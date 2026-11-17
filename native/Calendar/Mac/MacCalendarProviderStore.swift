#if os(macOS)
import Foundation
import Security
import AppKit

/// Direct provider calendars use app-local documents, so connecting an account
/// never depends on granting access to the Mac's Apple Calendar database.
@MainActor
final class MacCalendarProviderStore: ObservableObject {
    struct Account: Codable, Identifiable {
        let id: String
        let provider: String
        let email: String
        var accessToken: String
        var refreshToken: String
        var expiresAt: Date
        var photoURL: String? = nil
        var title: String { (provider == "google" ? "Google" : "Microsoft") + " · " + email }
    }
    enum Failure: LocalizedError {
        case invalidResponse, reconnect, storage, server(Int), unsupportedRecurrence
        var errorDescription: String? {
            switch self {
            case .invalidResponse: NSLocalizedString("The calendar provider returned an invalid response.", comment: "")
            case .reconnect: NSLocalizedString("Reconnect your calendar account to continue syncing.", comment: "")
            case .storage: NSLocalizedString("The calendar account could not be saved securely.", comment: "")
            case .server(let code): String.localizedStringWithFormat(NSLocalizedString("Calendar sync failed (%lld). Your local changes are kept for retry.", comment: ""), Int64(code))
            case .unsupportedRecurrence: NSLocalizedString("This repeat pattern is not supported by the selected calendar provider.", comment: "")
            }
        }
    }
    @Published private(set) var accounts: [Account] = []
    @Published private(set) var error: String?
    @Published private(set) var syncingAccountIDs = Set<String>()
    private let syncRequests = CalendarRequestCoalescer<String, Void>()
    private unowned let backend: CalendarMacStore
    private let engine: ProviderCalendarSyncEngine
    private let credentialService = "Deksan.CalendarASD.MacCalendarProviders.v1"
    init(backend: CalendarMacStore, directory: URL) {
        self.backend = backend
        engine = ProviderCalendarSyncEngine(storage: backend, directory: directory, identifierPrefix: "provider-", deviceName: Host.current().localizedName ?? "Mac")
        var result: CFTypeRef?
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: credentialService, kSecReturnData as String: true]
        if SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess, let data = result as? Data {
            accounts = (try? JSONDecoder().decode([Account].self, from: data)) ?? []
        }
    }
    func contains(calendarID: String) -> Bool { engine.accountID(for: calendarID) != nil || calendarID.hasPrefix("provider-") }
    func accountID(for calendarID: String) -> String? { engine.accountID(for: calendarID) }
    func remoteCalendarID(for calendarID: String) -> String? { engine.remoteCalendarID(for: calendarID) }
    func googleCalendarACL(accountID: String, calendarID: String) async throws -> [GoogleCalendarACLRule] {
        let account = try await freshAccount(accountID)
        guard account.provider == "google" else { throw Failure.invalidResponse }
        let url = URL(string: "https://www.googleapis.com/calendar/v3/calendars/" + Self.pathComponent(calendarID) + "/acl")!
        let items = try await pages(url, account: account)
        return try JSONDecoder().decode([GoogleCalendarACLRule].self, from: JSONSerialization.data(withJSONObject: items))
    }
    func changeGoogleCalendarACL(accountID: String, calendarID: String, ruleID: String? = nil,
                                 method: String, body: [String: Any]? = nil) async throws -> GoogleCalendarACLRule? {
        let account = try await freshAccount(accountID)
        guard account.provider == "google" else { throw Failure.invalidResponse }
        let path = "https://www.googleapis.com/calendar/v3/calendars/" + Self.pathComponent(calendarID) + "/acl"
            + (ruleID.map { "/" + Self.pathComponent($0) } ?? "")
        let result = try await request(URL(string: path)!, token: account.accessToken, method: method, body: body)
        if method == "DELETE" { return nil }
        return try JSONDecoder().decode(GoogleCalendarACLRule.self, from: JSONSerialization.data(withJSONObject: result))
    }
    func connect(_ provider: String) {
        error = nil
        if provider == "microsoft", SubscriptionManager.shared.subscriptionStatus != .premium {
            CloudAccountManager.shared.requestMicrosoftSubscription(); return
        }
        CloudAccountManager.calendarConnections.connectCalendars(provider: provider) { [weak self] tokens in
            guard let self, let token = tokens.accessToken else { throw Failure.invalidResponse }
            let profileURL = provider == "google" ? "https://www.googleapis.com/oauth2/v2/userinfo" : "https://graph.microsoft.com/v1.0/me?$select=id,mail,userPrincipalName"
            let profile = try await self.request(URL(string: profileURL)!, token: token)
            guard let remoteID = profile["id"] as? String,
                  let email = (profile["email"] ?? profile["mail"] ?? profile["userPrincipalName"]) as? String else { throw Failure.invalidResponse }
            let id = DeviceCalendarReplica.hash(provider + ":" + remoteID)
            let old = self.accounts.first { $0.id == id }
            guard let refreshToken = tokens.refreshToken ?? old?.refreshToken, !refreshToken.isEmpty else { throw Failure.reconnect }
            let account = Account(id: id, provider: provider, email: email, accessToken: token,
                refreshToken: refreshToken, expiresAt: Date().addingTimeInterval(tokens.expiresIn ?? 3600),
                photoURL: profile["picture"] as? String ?? old?.photoURL)
            var updated = self.accounts.filter { $0.id != id }; updated.append(account)
            try self.saveAccounts(updated)
            Task { await self.backend.sync() }
        }
    }
    func disconnect(_ account: Account) throws {
        try saveAccounts(accounts.filter { $0.id != account.id })
        try engine.disconnect(account.id)
    }
    private func saveAccounts(_ value: [Account]) throws {
        let data = try JSONEncoder().encode(value)
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: credentialService]
        let status = SecItemUpdate(query as CFDictionary, [kSecValueData as String: data] as CFDictionary)
        if status == errSecItemNotFound {
            var item = query; item[kSecValueData as String] = data
            item[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
            guard SecItemAdd(item as CFDictionary, nil) == errSecSuccess else { throw Failure.storage }
        } else if status != errSecSuccess { throw Failure.storage }
        accounts = value
    }
    private func freshAccount(_ id: String) async throws -> Account {
        guard var account = accounts.first(where: { $0.id == id }) else { throw Failure.reconnect }
        if account.expiresAt.timeIntervalSinceNow < 120 {
            let token = try await CloudAccountManager.refreshCalendarToken(provider: account.provider, refreshToken: account.refreshToken)
            guard let access = token.accessToken else { throw Failure.reconnect }
            account.accessToken = access
            account.refreshToken = token.refreshToken ?? account.refreshToken
            account.expiresAt = Date().addingTimeInterval(token.expiresIn ?? 3600)
            try saveAccounts(accounts.map { $0.id == id ? account : $0 })
        }
        return account
    }
    func createGoogleCalendar(accountID: String, title: String) async throws -> String {
        let account = try await freshAccount(accountID)
        guard account.provider == "google" else { throw Failure.invalidResponse }
        let result = try await request(URL(string: "https://www.googleapis.com/calendar/v3/calendars")!,
            token: account.accessToken, method: "POST", body: ["summary": title, "timeZone": TimeZone.current.identifier])
        guard let id = result["id"] as? String else { throw Failure.invalidResponse }
        return id
    }
    func finishGoogleCalendarCreation(accountID: String, calendarID: String, color: String) async throws {
        let account = try await freshAccount(accountID)
        guard account.provider == "google" else { throw Failure.invalidResponse }
        let url = URL(string: "https://www.googleapis.com/calendar/v3/users/me/calendarList/" + Self.pathComponent(calendarID) + "?colorRgbFormat=true")!
        _ = try await request(url, token: account.accessToken, method: "PATCH", body: ["backgroundColor": color, "foregroundColor": "#FFFFFF"])
        Task { await backend.sync() }
    }
    func sync() async {
        error = nil
        for original in accounts {
            do {
                var account = original
                if account.expiresAt.timeIntervalSinceNow < 120 {
                    let token = try await CloudAccountManager.refreshCalendarToken(provider: account.provider, refreshToken: account.refreshToken)
                    guard let access = token.accessToken else { throw Failure.reconnect }
                    account.accessToken = access; account.refreshToken = token.refreshToken ?? account.refreshToken
                    account.expiresAt = Date().addingTimeInterval(token.expiresIn ?? 3600)
                    try saveAccounts(accounts.map { $0.id == account.id ? account : $0 })
                }
                try await sync(account)
            } catch { self.error = error.localizedDescription }
        }
    }
    private func sync(_ account: Account) async throws {
        try await syncRequests.run(account.id) { [self] in
            syncingAccountIDs.insert(account.id)
            defer { syncingAccountIDs.remove(account.id) }
            try await engine.sync(.init(id: account.id, provider: account.provider, email: account.email, accessToken: account.accessToken))
        }
    }
    private func calendarURL(_ id: String, account: Account) -> URL {
        let prefix = account.provider == "google" ? "https://www.googleapis.com/calendar/v3/calendars/" : "https://graph.microsoft.com/v1.0/me/calendars/"
        return URL(string: prefix + Self.pathComponent(id))!
    }
    private func eventURL(_ id: String, calendar: String, account: Account) -> URL {
        URL(string: calendarURL(calendar, account: account).absoluteString + "/events/" + Self.pathComponent(id))!
    }
    private static func pathComponent(_ id: String) -> String {
        id.addingPercentEncoding(withAllowedCharacters: .alphanumerics.union(CharacterSet(charactersIn: "-._~")))!
    }
    private func pages(_ first: URL, account: Account) async throws -> [[String: Any]] {
        var url: URL? = first, items: [[String: Any]] = [], visited = Set<URL>()
        while let next = url {
            guard visited.insert(next).inserted, next.scheme == "https", next.host == first.host else { throw Failure.invalidResponse }
            let response = try await request(next, token: account.accessToken)
            let key = account.provider == "google" ? "items" : "value"
            let page = response[key] as? [[String: Any]]
            // An empty Google page can still have a continuation token.
            guard page != nil || (account.provider == "google" && response[key] == nil && response["kind"] != nil) else { throw Failure.invalidResponse }
            items += page ?? []
            if account.provider == "google", let token = response["nextPageToken"] as? String {
                var parts = URLComponents(url: first, resolvingAgainstBaseURL: false)!
                parts.queryItems = (parts.queryItems ?? []) + [.init(name: "pageToken", value: token)]; url = parts.url
            } else { url = (response["@odata.nextLink"] as? String).flatMap(URL.init(string:)) }
        }
        return items
    }
    private func request(_ url: URL, token: String, method: String = "GET", body: [String: Any]? = nil, version: String? = nil) async throws -> [String: Any] {
        var request = URLRequest(url: url); request.httpMethod = method; request.timeoutInterval = 30
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("outlook.timezone=\"\(TimeZone.current.identifier)\", outlook.body-content-type=\"text\"", forHTTPHeaderField: "Prefer")
        if let version { request.setValue(version, forHTTPHeaderField: "If-Match") }
        request.httpBody = try body.map { try JSONSerialization.data(withJSONObject: $0) }
        let (data, response) = try await URLSession.shared.data(for: request)
        let code = (response as? HTTPURLResponse)?.statusCode ?? 0
        if method == "DELETE", code == 404 { return [:] }
        guard (200..<300).contains(code) else { throw Failure.server(code) }
        if data.isEmpty { return [:] }
        guard let value = try JSONSerialization.jsonObject(with: data) as? [String: Any] else { throw Failure.invalidResponse }
        return value
    }

}
#endif
