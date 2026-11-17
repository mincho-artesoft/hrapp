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
    private struct RemoteEvent: Codable {
        var remoteID: String
        var version: String?
        var snapshot: DeviceCalendarEvent
    }
    private struct CalendarState: Codable {
        var accountID: String
        var remoteID: String
        var events: [String: RemoteEvent] = [:]
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
    private unowned let backend: CalendarMacStore
    private let stateFile: URL
    private var states: [String: CalendarState] = [:]
    private let credentialService = "Deksan.CalendarASD.MacCalendarProviders.v1"
    init(backend: CalendarMacStore, directory: URL) {
        self.backend = backend
        stateFile = directory.appendingPathComponent("provider-calendar-state.json")
        if let data = try? Data(contentsOf: stateFile) { states = (try? JSONDecoder().decode([String: CalendarState].self, from: data)) ?? [:] }
        var result: CFTypeRef?
        let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrService as String: credentialService, kSecReturnData as String: true]
        if SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess, let data = result as? Data {
            accounts = (try? JSONDecoder().decode([Account].self, from: data)) ?? []
        }
    }
    func contains(calendarID: String) -> Bool { states[calendarID] != nil || calendarID.hasPrefix("provider-") }
    func accountID(for calendarID: String) -> String? { states[calendarID]?.accountID }
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
            await self.backend.sync()
        }
    }
    func disconnect(_ account: Account) throws {
        try saveAccounts(accounts.filter { $0.id != account.id })
        let ids = Set(states.filter { $0.value.accountID == account.id }.keys)
        // Keep the user's cached events; disconnecting never deletes remote data.
        var documents = backend.local
        for index in documents.indices where ids.contains(documents[index].id) { documents[index].available = false }
        try backend.applyProviderDocuments(documents)
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
    private func saveState() throws { try JSONEncoder().encode(states).write(to: stateFile, options: .atomic) }
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
        await backend.sync()
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
        let google = account.provider == "google"
        let listURL = google ? "https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250" : "https://graph.microsoft.com/v1.0/me/calendars?$top=100"
        let calendars = try await pages(URL(string: listURL)!, account: account)
        var known = Set<String>()
        for remote in calendars {
            guard let remoteID = remote["id"] as? String else { throw Failure.invalidResponse }
            let id = "provider-" + DeviceCalendarReplica.hash(account.id + ":" + remoteID)
            known.insert(id)
            let role = remote["accessRole"] as? String ?? "reader"
            let editable = google ? (role == "writer" || role == "owner") : (remote["canEdit"] as? Bool ?? false)
            let title = (remote["summaryOverride"] ?? remote["summary"] ?? remote["name"]) as? String ?? NSLocalizedString("Calendar", comment: "")
            let color = (remote["backgroundColor"] ?? remote["hexColor"]) as? String ?? "#2168DE"
            try await syncCalendar(id: id, remoteID: remoteID, title: title, color: color, editable: editable, account: account)
        }
        var documents = backend.local
        for index in documents.indices where states[documents[index].id]?.accountID == account.id && !known.contains(documents[index].id) {
            documents[index].available = false
        }
        try backend.applyProviderDocuments(documents)
    }
    private func syncCalendar(id: String, remoteID: String, title: String, color: String, editable: Bool, account: Account) async throws {
        var state = states[id] ?? CalendarState(accountID: account.id, remoteID: remoteID)
        let google = account.provider == "google"
        let start = Calendar.current.date(byAdding: .year, value: -1, to: Date())!
        let end = Calendar.current.date(byAdding: .year, value: 3, to: Date())!
        let base = calendarURL(remoteID, account: account)
        var components = URLComponents(url: base.appendingPathComponent(google ? "events" : "calendarView"), resolvingAgainstBaseURL: false)!
        components.queryItems = google ? [
            .init(name: "timeMin", value: start.ISO8601Format()), .init(name: "timeMax", value: end.ISO8601Format()),
            .init(name: "singleEvents", value: "true"), .init(name: "maxResults", value: "2500")
        ] : [.init(name: "startDateTime", value: start.ISO8601Format()), .init(name: "endDateTime", value: end.ISO8601Format()), .init(name: "$top", value: "1000")]
        let rawEvents = try await pages(components.url!, account: account)
        var fetched: [String: RemoteEvent] = [:]
        for raw in rawEvents {
            guard let remoteEventID = raw["id"] as? String else { throw Failure.invalidResponse }
            if raw["status"] as? String == "cancelled" || raw["isCancelled"] as? Bool == true { continue }
            let localID = state.events.first { $0.value.remoteID == remoteEventID }?.key ?? DeviceCalendarReplica.hash(id + ":" + remoteEventID)
            let snapshot = try MacCalendarProviderEventWire.event(raw, id: localID, google: google)
            fetched[localID] = RemoteEvent(remoteID: remoteEventID, version: (raw["etag"] ?? raw["@odata.etag"]) as? String, snapshot: snapshot)
        }
        let documentBeforeFetch = backend.local.first { $0.id == id }
        let current = documentBeforeFetch?.events ?? []
        let baseSnapshots = state.events.values.map(\.snapshot).filter { $0.startDate < end && $0.endDate > start }
        let coveredIDs = Set(baseSnapshots.map(\.id)).union(fetched.keys)
        let inRange = current.filter { coveredIDs.contains($0.id) || ($0.startDate < end && $0.endDate > start) }
        var merged = DeviceCalendarReplica.merge(base: baseSnapshots, local: inRange, remote: fetched.values.map(\.snapshot))
        if editable {
            for event in merged {
                let existing = fetched[event.id]
                guard event.content != existing?.snapshot.content else { continue }
                // A local edit is uploaded only if the fetched remote version still
                // matches the baseline. Conditional writes protect the remaining race.
                if let old = existing, old.snapshot.readOnly == true { continue }
                let url = existing.map { eventURL($0.remoteID, calendar: remoteID, account: account) } ?? base.appendingPathComponent("events")
                let body = try MacCalendarProviderEventWire.body(event, previous: existing?.snapshot, google: google)
                let saved: [String: Any]
                do {
                    saved = try await request(url, token: account.accessToken, method: existing == nil ? "POST" : "PATCH", body: body, version: existing?.version)
                } catch Failure.server(409) where google && existing == nil {
                    // A previous POST may have succeeded before its response was lost.
                    guard let retryID = body["id"] as? String else { throw Failure.invalidResponse }
                    saved = try await request(eventURL(retryID, calendar: remoteID, account: account), token: account.accessToken)
                }
                guard let savedID = saved["id"] as? String else { throw Failure.invalidResponse }
                let snapshot = try MacCalendarProviderEventWire.event(saved, id: event.id, google: google)
                fetched[event.id] = .init(remoteID: savedID, version: (saved["etag"] ?? saved["@odata.etag"]) as? String, snapshot: snapshot)
                // Persist each successful write's ID before the next request. A retry
                // must never turn an already-created event into a duplicate.
                state.events[event.id] = fetched[event.id]; states[id] = state; try saveState()
                if let index = merged.firstIndex(where: { $0.id == event.id }) { merged[index] = snapshot }
            }
            for (localID, remote) in fetched where !merged.contains(where: { $0.id == localID }) && state.events[localID] != nil {
                guard remote.snapshot.readOnly != true else { continue }
                _ = try await request(eventURL(remote.remoteID, calendar: remoteID, account: account), token: account.accessToken, method: "DELETE", version: remote.version)
                fetched.removeValue(forKey: localID)
            }
        } else { merged = fetched.values.map(\.snapshot) }
        // Preserve out-of-range events and edits made while requests were in flight.
        let latest = backend.local.first { $0.id == id }?.events ?? current
        let workingIDs = coveredIDs.union(inRange.map(\.id))
        let preserved = latest.filter { !workingIDs.contains($0.id) && ($0.startDate >= end || $0.endDate <= start) }
        let concurrent = DeviceCalendarReplica.merge(base: inRange, local: merged, remote: latest.filter { workingIDs.contains($0.id) || ($0.startDate < end && $0.endDate > start) })
        let doc = DeviceCalendarDocument(id: id, deviceId: DeviceCalendarReplica.deviceID, deviceName: Host.current().localizedName ?? "Mac",
            title: title, source: account.title, color: color, allowsChanges: editable, events: preserved + concurrent)
        var documents = backend.local
        if let index = documents.firstIndex(where: { $0.id == id }) { documents[index] = doc } else { documents.append(doc) }
        try backend.applyProviderDocuments(documents)
        state.events = state.events.filter { $0.value.snapshot.startDate >= end || $0.value.snapshot.endDate <= start }
        state.events.merge(fetched) { _, new in new }; states[id] = state; try saveState()
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
