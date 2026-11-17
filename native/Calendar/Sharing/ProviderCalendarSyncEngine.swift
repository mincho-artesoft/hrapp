import Foundation

/// Provider sync writes only to an application-owned document store on every platform.
@MainActor
protocol ProviderCalendarStorage: AnyObject {
    var providerDocuments: [DeviceCalendarDocument] { get }
    func applyProviderDocuments(_ documents: [DeviceCalendarDocument]) throws
}

@MainActor
final class ProviderCalendarSyncEngine {
    struct Account {
        let id: String
        let provider: String
        let email: String
        let accessToken: String
        var title: String { (provider == "google" ? "Google" : "Microsoft") + " · " + email }
    }
    struct LegacyEvent { let remoteID: String?; let snapshot: DeviceCalendarEvent }
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
        case invalidResponse, server(Int)
        var errorDescription: String? {
            switch self {
            case .invalidResponse: NSLocalizedString("The calendar provider returned an invalid response.", comment: "")
            case .server(let code): String.localizedStringWithFormat(NSLocalizedString("Calendar sync failed (%lld). Your local changes are kept for retry.", comment: ""), Int64(code))
            }
        }
    }
    private unowned let storage: any ProviderCalendarStorage
    private let transport: @MainActor (URLRequest) async throws -> (Data, URLResponse)
    private let stateFile: URL
    private let identifierPrefix: String
    private let deviceName: String
    private var states: [String: CalendarState] = [:]
    init(storage: any ProviderCalendarStorage, directory: URL, identifierPrefix: String, deviceName: String,
         transport: @escaping @MainActor (URLRequest) async throws -> (Data, URLResponse) = { try await URLSession.shared.data(for: $0) }) {
        self.transport = transport
        self.storage = storage; self.identifierPrefix = identifierPrefix; self.deviceName = deviceName
        stateFile = directory.appendingPathComponent("provider-calendar-state.json")
        if let data = try? Data(contentsOf: stateFile) {
            states = (try? JSONDecoder().decode([String: CalendarState].self, from: data)) ?? [:]
        }
    }
    func accountID(for id: String) -> String? { states[id]?.accountID }
    func remoteCalendarID(for id: String) -> String? { states[id]?.remoteID }
    func calendarIDs(for accountID: String) -> Set<String> { Set(states.filter { $0.value.accountID == accountID }.keys) }
    private func saveState() throws { try JSONEncoder().encode(states).write(to: stateFile, options: .atomic) }
    func disconnect(_ accountID: String) throws {
        let ids = calendarIDs(for: accountID)
        var documents = storage.providerDocuments
        for index in documents.indices where ids.contains(documents[index].id) { documents[index].available = false }
        try storage.applyProviderDocuments(documents)
    }
    func sync(_ account: Account, legacy: [String: [LegacyEvent]] = [:]) async throws {
        let google = account.provider == "google"
        let listURL = google ? "https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250" : "https://graph.microsoft.com/v1.0/me/calendars?$top=100"
        let calendars = try await pages(URL(string: listURL)!, account: account)
        var known = Set<String>()
        for remote in calendars {
            guard let remoteID = remote["id"] as? String else { throw Failure.invalidResponse }
            let id = identifierPrefix + DeviceCalendarReplica.hash(account.id + ":" + remoteID)
            known.insert(id)
            let role = remote["accessRole"] as? String ?? "reader"
            let editable = google ? (role == "writer" || role == "owner") : (remote["canEdit"] as? Bool ?? false)
            let title = (remote["summaryOverride"] ?? remote["summary"] ?? remote["name"]) as? String ?? NSLocalizedString("Calendar", comment: "")
            let color = (remote["backgroundColor"] ?? remote["hexColor"]) as? String ?? "#2168DE"
            try await syncCalendar(id: id, remoteID: remoteID, title: title, color: color, editable: editable, account: account, legacy: legacy[remoteID])
        }
        var documents = storage.providerDocuments
        for index in documents.indices where states[documents[index].id]?.accountID == account.id && !known.contains(documents[index].id) {
            documents[index].available = false
        }
        try storage.applyProviderDocuments(documents)
    }
    private func syncCalendar(id: String, remoteID: String, title: String, color: String, editable: Bool, account: Account, legacy: [LegacyEvent]?) async throws {
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
        let documentBeforeFetch = storage.providerDocuments.first { $0.id == id }
        var current = documentBeforeFetch?.events ?? []
        if documentBeforeFetch == nil, let edits = legacy, !edits.isEmpty {
            current = fetched.values.map(\.snapshot)
            state.events = fetched
            for edit in edits {
                if let remoteID = edit.remoteID {
                    guard let match = fetched.first(where: { $0.value.remoteID == remoteID }), match.value.snapshot.readOnly != true else { continue }
                    if let remoteDate = match.value.snapshot.updatedAt.flatMap(DeviceCalendarEvent.date),
                       let localDate = edit.snapshot.updatedAt.flatMap(DeviceCalendarEvent.date), remoteDate > localDate { continue }
                    var value = edit.snapshot; value.id = match.key
                    current.removeAll { $0.id == value.id }; current.append(value)
                } else {
                    var value = edit.snapshot
                    value.id = DeviceCalendarReplica.hash(id + ":legacy:" + value.id)
                    current.append(value)
                }
            }
        }
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
        let latest = storage.providerDocuments.first { $0.id == id }?.events ?? current
        let workingIDs = coveredIDs.union(inRange.map(\.id))
        let preserved = latest.filter { !workingIDs.contains($0.id) && ($0.startDate >= end || $0.endDate <= start) }
        let concurrent = DeviceCalendarReplica.merge(base: inRange, local: merged, remote: latest.filter { workingIDs.contains($0.id) || ($0.startDate < end && $0.endDate > start) })
        let doc = DeviceCalendarDocument(id: id, deviceId: DeviceCalendarReplica.deviceID, deviceName: deviceName,
            title: title, source: account.title, color: color, allowsChanges: editable, events: preserved + concurrent)
        var documents = storage.providerDocuments
        if let index = documents.firstIndex(where: { $0.id == id }) { documents[index] = doc } else { documents.append(doc) }
        try storage.applyProviderDocuments(documents)
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
        let (data, response) = try await transport(request)
        let code = (response as? HTTPURLResponse)?.statusCode ?? 0
        if method == "DELETE", code == 404 { return [:] }
        guard (200..<300).contains(code) else { throw Failure.server(code) }
        if data.isEmpty { return [:] }
        guard let value = try JSONSerialization.jsonObject(with: data) as? [String: Any] else { throw Failure.invalidResponse }
        return value
    }

}
