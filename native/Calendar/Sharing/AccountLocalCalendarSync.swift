import Foundation

@MainActor
protocol AccountLocalCalendarStorage: AnyObject {
    func accountLocalDocuments(matching localID: String?) throws -> [DeviceCalendarDocument]
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
    private static var pending = false
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
    private static var namespace: String {
        "accountLocal.v1.\(DeviceCalendarReplica.storageHost(for: CloudCalendarsAPI.baseURL))."
    }
    static func visibilityFilter() -> (String) -> Bool {
        let owners = UserDefaults.standard.dictionary(forKey: namespace + "owners") as? [String: String] ?? [:]
        let active = CalendarFeedSession.existing.flatMap { session in
            session.ownerId ?? UserDefaults.standard.string(forKey: namespace + "session." + session.calendarId)
        }
        let copies = active.map { Set(UserDefaults.standard.stringArray(forKey: namespace + "copies." + $0) ?? []) } ?? []
        return { id in !copies.contains(id) && (owners[id].map { $0 == active } ?? true) }
    }

    static let importedPrefix = "app-local:account:"
    static func accountCalendarID(for localID: String) -> String {
        localID.hasPrefix(importedPrefix) ? String(localID.dropFirst(importedPrefix.count)) : DeviceCalendarReplica.hash(localID)
    }

    static func sync(storage: any AccountLocalCalendarStorage) async throws {
        if busy { pending = true; return }
        busy = true
        defer { busy = false }
        repeat {
            pending = false
            guard let session = CalendarFeedSession.existing else { return }
            try await syncPass(storage: storage, session: session)
        } while pending
    }

    private static func syncPass(storage: any AccountLocalCalendarStorage, session: CloudCalendarsAPI.Session) async throws {
        var request = URLRequest(url: CloudCalendarsAPI.baseURL.appendingPathComponent("ios/calendars/account"))
        request.setValue("Bearer \(session.deviceToken)", forHTTPHeaderField: "Authorization")
        request.cachePolicy = .reloadIgnoringLocalCacheData
        let (data, response) = try await URLSession.shared.data(for: request)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(status) else { throw DeviceCalendarReplica.SyncError.server(status) }
        let inventory = try JSONDecoder().decode(Inventory.self, from: data)
        try verify(session)
        let namespace = "accountLocal.v1.\(DeviceCalendarReplica.storageHost(for: CloudCalendarsAPI.baseURL))."
        UserDefaults.standard.set(inventory.ownerID, forKey: namespace + "session." + session.calendarId)
        let key = namespace + inventory.ownerID
        var bindings = UserDefaults.standard.data(forKey: key).flatMap { try? JSONDecoder().decode([String: Binding].self, from: $0) } ?? [:]
        var owners = UserDefaults.standard.dictionary(forKey: namespace + "owners") as? [String: String] ?? [:]
        let replica = DeviceCalendarReplica(baseURL: CloudCalendarsAPI.baseURL, token: session.deviceToken, accountID: session.calendarId)
        func save() throws {
            UserDefaults.standard.set(try JSONEncoder().encode(bindings), forKey: key)
            UserDefaults.standard.set(owners, forKey: namespace + "owners")
        }
        let local = try storage.accountLocalDocuments(matching: nil)
        let documents = Dictionary(uniqueKeysWithValues: inventory.calendars.map { ($0.id, $0) })
        var bindingsChanged = false
        for document in local where owners[document.id] == nil || owners[document.id] == inventory.ownerID {
            let id = accountCalendarID(for: document.id)
            if document.id.hasPrefix(importedPrefix) {
                guard documents[id] != nil else { continue }
                // Repair a binding created by hashing the imported local ID.
                let oldID = DeviceCalendarReplica.hash(document.id)
                if bindings[oldID]?.localID == document.id {
                    bindings.removeValue(forKey: oldID)
                    bindingsChanged = true
                }
            }
            if bindings.values.contains(where: { $0.localID == document.id }) { continue }
            guard bindings[id] == nil else { continue }
            bindings[id] = .init(localID: document.id, baseline: nil)
            owners[document.id] = inventory.ownerID
            bindingsChanged = true
        }
        if bindingsChanged { try save() }
        // Keep verified legacy copies on disk. If an offline edit is pending,
        // publish it through its existing binding before hiding anything.
        var hiddenCopies = Set<String>()
        var idleCopies = Set<String>()
        let localByID = Dictionary(uniqueKeysWithValues: local.map { ($0.id, $0) })
        for copy in inventory.calendars where copy.duplicateOf != nil {
            guard let binding = bindings[copy.id] else { continue }
            if let current = localByID[binding.localID] {
                let baseline = binding.baseline ?? copy
                guard current.title == baseline.title, current.color == baseline.color,
                      current.sharingCalendarID == baseline.sharingCalendarID,
                      try canonical(current, id: copy.id).events == canonical(baseline, id: copy.id).events else { continue }
                hiddenCopies.insert(current.id)
            }
            idleCopies.insert(copy.id)
        }
        let copiesKey = namespace + "copies." + inventory.ownerID
        if hiddenCopies != Set(UserDefaults.standard.stringArray(forKey: copiesKey) ?? []) {
            UserDefaults.standard.set(hiddenCopies.sorted(), forKey: copiesKey)
        }
        var firstFailure: Error?
        for document in inventory.calendars where bindings[document.id] == nil && document.available && document.duplicateOf == nil {
            do {
                let id = try storage.applyAccountLocalDocument(document, localID: nil)
                bindings[document.id] = .init(localID: id, baseline: document)
                owners[id] = inventory.ownerID
                try save()
            } catch {
                firstFailure = firstFailure ?? error
            }
        }
        func reconcile(id: String, originalBinding: Binding) async throws {
            var binding = originalBinding
            var remote = documents[id]
            for attempt in 0..<3 {
                let before = try storage.accountLocalDocuments(matching: binding.localID).first
                if let remote, !remote.available {
                    if before != nil { try storage.removeAccountLocalDocument(localID: binding.localID) }
                    if binding.baseline != remote {
                        binding.baseline = remote; bindings[id] = binding; try save()
                    }
                    break
                }
                guard before != nil || binding.baseline != nil else { break }
                var proposed: DeviceCalendarDocument
                if let before {
                    proposed = try canonical(before, id: id)
                    if let remote {
                        proposed.deviceId = remote.deviceId; proposed.deviceName = remote.deviceName
                        if binding.baseline == remote,
                           proposed.title == remote.title, proposed.color == remote.color,
                           proposed.sharingCalendarID == remote.sharingCalendarID,
                           proposed.events == (try canonical(remote, id: id)).events {
                            break
                        }
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
                    proposed = old; proposed.available = false; proposed.events = []
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
                if let before, let latest = try storage.accountLocalDocuments(matching: binding.localID).first {
                    var applied = saved
                    applied.events = try DeviceCalendarReplica.merge(base: canonical(before, id: id).events, local: saved.events, remote: canonical(latest, id: id).events)
                    if latest.title != before.title { applied.title = latest.title }
                    if latest.color != before.color { applied.color = latest.color }
                    _ = try storage.applyAccountLocalDocument(applied, localID: binding.localID)
                }
                if binding.baseline != saved {
                    binding.baseline = saved; bindings[id] = binding; try save()
                }
                break
            }
        }
        for (id, binding) in bindings where !idleCopies.contains(id) {
            try verify(session)
            try Task.checkCancellation()
            do { try await reconcile(id: id, originalBinding: binding) }
            catch is CancellationError { throw CancellationError() }
            catch { firstFailure = firstFailure ?? error }
        }
        if let firstFailure { throw firstFailure }
    }
    private static func verify(_ session: CloudCalendarsAPI.Session) throws {
        guard CalendarFeedSession.isCurrent(session) else { throw CancellationError() }
    }
    static func normalizedEvent(_ event: DeviceCalendarEvent) throws -> DeviceCalendarEvent {
        var result = try MacEventShareSnapshot.canonical(event)
        result.location = result.location?.isEmpty == true ? nil : result.location
        result.url = result.url?.isEmpty == true ? nil : result.url
        result.readOnly = result.readOnly == true ? true : nil
        result.id = DeviceCalendarReplica.accountEventID(result.id)
        return result
    }
    private static func canonical(_ document: DeviceCalendarDocument, id: String) throws -> DeviceCalendarDocument {
        var value = document
        value.id = id; value.accountLocal = true; value.source = "Local Calendars"
        value.events = try value.events.map(normalizedEvent).sorted { $0.id < $1.id }
        return value
    }
}
