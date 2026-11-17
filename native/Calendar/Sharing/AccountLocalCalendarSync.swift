import Foundation

@MainActor
protocol AccountLocalCalendarStorage: AnyObject {
    func accountLocalDocuments() throws -> [DeviceCalendarDocument]
    func applyAccountLocalDocument(_ document: DeviceCalendarDocument, localID: String?) throws -> String
    func removeAccountLocalDocument(localID: String) throws
}

/// Personal app-local calendars have one identity per account, independent of
/// the device. EventKit/provider/received calendars keep their own sync paths.
@MainActor
enum AccountLocalCalendarSync {
    private struct Inventory: Decodable { let ownerID: String; let calendars: [DeviceCalendarDocument] }
    private struct Binding: Codable { var localID: String; var baseline: DeviceCalendarDocument? }
    private static var busy = false
    #if DEBUG
    /// Test cleanup is limited to the explicit audit prefix; ordinary calendars
    /// and their tombstones must retain their account bindings.
    static func discardAuditBindings(prefix: String) throws {
        guard prefix.hasPrefix("QA-PHYSICAL-20261117-") else { return }
        let namespace = "accountLocal.v1.\(DeviceCalendarReplica.storageHost(for: CloudCalendarsAPI.baseURL))."
        var removedLocalIDs = Set<String>()
        for key in UserDefaults.standard.dictionaryRepresentation().keys where key.hasPrefix(namespace) && key != namespace + "owners" {
            guard let data = UserDefaults.standard.data(forKey: key),
                  let bindings = try? JSONDecoder().decode([String: Binding].self, from: data) else { continue }
            let removed = bindings.filter { $0.value.baseline?.title.hasPrefix(prefix) == true }
            removedLocalIDs.formUnion(removed.values.map(\.localID))
            UserDefaults.standard.set(try JSONEncoder().encode(bindings.filter { removed[$0.key] == nil }), forKey: key)
        }
        if let owners = UserDefaults.standard.dictionary(forKey: namespace + "owners") as? [String: String] {
            UserDefaults.standard.set(owners.filter { !removedLocalIDs.contains($0.key) }, forKey: namespace + "owners")
        }
    }
    #endif
    static func sync(storage: any AccountLocalCalendarStorage) async throws {
        guard !busy, let session = CalendarFeedSession.existing else { return }
        busy = true; defer { busy = false }
        var request = URLRequest(url: CloudCalendarsAPI.baseURL.appendingPathComponent("ios/calendars/account"))
        request.setValue("Bearer \(session.deviceToken)", forHTTPHeaderField: "Authorization")
        request.cachePolicy = .reloadIgnoringLocalCacheData
        let (data, response) = try await URLSession.shared.data(for: request)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(status) else { throw DeviceCalendarReplica.SyncError.server(status) }
        let inventory = try JSONDecoder().decode(Inventory.self, from: data)
        try verify(session)
        let namespace = "accountLocal.v1.\(DeviceCalendarReplica.storageHost(for: CloudCalendarsAPI.baseURL))."
        let key = namespace + inventory.ownerID
        var bindings = UserDefaults.standard.data(forKey: key).flatMap { try? JSONDecoder().decode([String: Binding].self, from: $0) } ?? [:]
        var owners = UserDefaults.standard.dictionary(forKey: namespace + "owners") as? [String: String] ?? [:]
        let replica = DeviceCalendarReplica(baseURL: CloudCalendarsAPI.baseURL, token: session.deviceToken, accountID: session.calendarId)
        func save() throws {
            UserDefaults.standard.set(try JSONEncoder().encode(bindings), forKey: key)
            UserDefaults.standard.set(owners, forKey: namespace + "owners")
        }
        var local = try storage.accountLocalDocuments()
        for document in local where owners[document.id] == nil || owners[document.id] == inventory.ownerID {
            if bindings.values.contains(where: { $0.localID == document.id }) { continue }
            let id = DeviceCalendarReplica.hash(document.id)
            bindings[id] = .init(localID: document.id, baseline: nil)
            owners[document.id] = inventory.ownerID
        }
        try save()
        for document in inventory.calendars where bindings[document.id] == nil && document.available {
            let id = try storage.applyAccountLocalDocument(document, localID: nil)
            bindings[document.id] = .init(localID: id, baseline: document)
            owners[id] = inventory.ownerID
            try save()
        }
        for (id, originalBinding) in bindings {
            try verify(session)
            var binding = originalBinding
            var remote = inventory.calendars.first { $0.id == id }
            for attempt in 0..<3 {
                local = try storage.accountLocalDocuments()
                let before = local.first { $0.id == binding.localID }
                if let remote, !remote.available {
                    if before != nil { try storage.removeAccountLocalDocument(localID: binding.localID) }
                    binding.baseline = remote; bindings[id] = binding; try save(); break
                }
                guard before != nil || binding.baseline != nil else { break }
                var proposed: DeviceCalendarDocument
                if let before {
                    proposed = try canonical(before, id: id)
                    if let remote {
                        proposed.deviceId = remote.deviceId; proposed.deviceName = remote.deviceName
                        let base = binding.baseline
                        proposed.events = DeviceCalendarReplica.merge(base: base?.events ?? [], local: proposed.events, remote: remote.events)
                        if let base {
                            if remote.title != base.title { proposed.title = remote.title }
                            if remote.color != base.color { proposed.color = remote.color }
                            if remote.sharingCalendarID != base.sharingCalendarID { proposed.sharingCalendarID = remote.sharingCalendarID }
                        } else {
                            proposed.title = remote.title; proposed.color = remote.color
                            proposed.sharingCalendarID = remote.sharingCalendarID ?? proposed.sharingCalendarID
                        }
                    }
                } else {
                    guard let old = remote ?? binding.baseline else { break }
                    proposed = old; proposed.available = false
                }
                proposed.revision = remote?.revision ?? 0; proposed.updatedAt = remote?.updatedAt
                let existingEvents = Dictionary((remote?.events ?? []).map { ($0.id, $0) }, uniquingKeysWith: { first, _ in first })
                proposed.events = proposed.events.map { existingEvents[$0.id]?.content == $0.content ? existingEvents[$0.id]! : $0 }.sorted { $0.id < $1.id }
                var normalized = remote; normalized?.events.sort { $0.id < $1.id }
                let saved: DeviceCalendarDocument
                do {
                    if proposed == normalized { saved = proposed }
                    else {
                        var body = try CalendarJSON.object(encoding: proposed)
                        body["deviceId"] = .string(DeviceCalendarReplica.deviceID)
                        body["expectedRevision"] = .number(Double(remote?.revision ?? 0))
                        guard let value = try await replica.send(JSONEncoder().encode(body)) else { throw CloudCalendarsAPI.Failure.malformedResponse }
                        saved = value
                    }
                } catch DeviceCalendarReplica.SyncError.server(409) where attempt < 2 {
                    let body: [String: CalendarJSON] = ["id": .string(id), "deviceId": .string(DeviceCalendarReplica.deviceID), "readOnly": .bool(true)]
                    remote = try await replica.send(JSONEncoder().encode(body)); continue
                }
                try verify(session)
                if let before, let latest = try storage.accountLocalDocuments().first(where: { $0.id == binding.localID }) {
                    var applied = saved
                    applied.events = try DeviceCalendarReplica.merge(base: canonical(before, id: id).events, local: saved.events, remote: canonical(latest, id: id).events)
                    if latest.title != before.title { applied.title = latest.title }
                    if latest.color != before.color { applied.color = latest.color }
                    _ = try storage.applyAccountLocalDocument(applied, localID: binding.localID)
                }
                binding.baseline = saved; bindings[id] = binding; try save(); break
            }
        }
    }
    private static func verify(_ session: CloudCalendarsAPI.Session) throws {
        guard CalendarFeedSession.existing?.calendarId == session.calendarId else { throw CancellationError() }
    }
    static func normalizedEvent(_ event: DeviceCalendarEvent) throws -> DeviceCalendarEvent {
        var result = try MacEventShareSnapshot.canonical(event)
        result.location = result.location?.isEmpty == true ? nil : result.location
        result.url = result.url?.isEmpty == true ? nil : result.url
        result.readOnly = result.readOnly == true ? true : nil
        if !(result.id.count == 64 && result.id.allSatisfy(\.isHexDigit)) { result.id = DeviceCalendarReplica.hash(result.id) }
        return result
    }
    private static func canonical(_ document: DeviceCalendarDocument, id: String) throws -> DeviceCalendarDocument {
        var value = document
        value.id = id; value.accountLocal = true; value.source = "Local Calendars"
        value.events = try value.events.map(normalizedEvent).sorted { $0.id < $1.id }
        return value
    }
}
