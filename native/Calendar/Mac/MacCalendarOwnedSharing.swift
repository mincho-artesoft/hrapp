#if os(macOS)
import Foundation
import EventKit

/// Keeps calendars shared from the Mac live after their sharing sheet closes.
/// Bindings are account-scoped and contain a merge baseline, never credentials.
@MainActor
final class MacCalendarOwnedSharing {
    private struct Binding: Codable {
        let accountID: String
        let localID: String
        let shareID: String
        var baseline: [DeviceCalendarEvent]
        var deletionPending: Bool? = nil
    }
    private unowned let backend: CalendarMacStore
    private let file: URL
    private let requests = CalendarRequestCoalescer<String, Void>()

    init(backend: CalendarMacStore, directory: URL) {
        self.backend = backend
        file = directory.appendingPathComponent("owned-shared-calendars.json")
    }

    func shareID(localID: String) throws -> String? {
        guard let session = backend.cloudSession else { return nil }
        return try read()[session.calendarId + ":" + localID]?.shareID
    }

    func registerAndSync(localID: String, shareID: String) async throws {
        guard let session = backend.cloudSession else { throw CalendarFeedSession.SessionError.signInRequired }
        var bindings = try read()
        let key = session.calendarId + ":" + localID
        if bindings[key] == nil {
            bindings[key] = .init(accountID: session.calendarId, localID: localID, shareID: shareID, baseline: [])
            try write(bindings)
        }
        try await sync(key: key, session: session)
    }

    func syncAll(session: CloudCalendarsAPI.Session) async throws {
        for (key, binding) in try read() where binding.accountID == session.calendarId {
            try await sync(key: key, session: session)
        }
    }

    func recordDeletion(localID: String) throws {
        guard let session = backend.cloudSession else { return }
        let key = session.calendarId + ":" + localID
        var bindings = try read()
        guard bindings[key] != nil else { return }
        bindings[key]?.deletionPending = true
        try write(bindings)
    }

    private func sync(key: String, session: CloudCalendarsAPI.Session) async throws {
        try await requests.run(key) { [self] in try await performSync(key: key, session: session) }
    }

    private func performSync(key: String, session: CloudCalendarsAPI.Session) async throws {
        guard let binding = try read()[key] else { return }
        if binding.deletionPending == true {
            try await CloudCalendarsAPI.deleteICloudCalendarSharing(calendarId: binding.shareID, session: session)
            var bindings = try read()
            bindings.removeValue(forKey: key)
            try write(bindings)
            return
        }
        guard let calendar = backend.calendars.first(where: { $0.id == binding.localID }), calendar.writable else { return }
        let remote: CloudCalendarsAPI.ICloudCalendarSharing
        do {
            remote = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: binding.shareID, session: session)
        } catch CloudCalendarsAPI.Failure.http(410, _) {
            guard backend.cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
            var bindings = try read()
            if bindings[key]?.shareID == binding.shareID {
                bindings.removeValue(forKey: key)
                try write(bindings)
                if let index = backend.local.firstIndex(where: { $0.id == binding.localID && $0.sharingCalendarID == binding.shareID }) {
                    var documents = backend.local
                    documents[index].sharingCalendarID = nil
                    try backend.applyProviderDocuments(documents)
                }
            }
            return
        }
        guard backend.cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
        // A missing/revoked share must not be silently recreated by background sync.
        guard !remote.title.isEmpty else { return }
        let local = try snapshot(calendar).map(MacCalendarSharingMerge.wireSnapshot)
        let remoteEvents = try MacCalendarSharingMerge.restoringLocalIDs(
            (remote.events ?? []).map { try $0.macDeviceEvent() }, matching: binding.baseline + local)
            .map(MacCalendarSharingMerge.wireSnapshot)
        let merged = try MacCalendarSharingMerge.reconcile(base: binding.baseline, local: local, remote: remoteEvents)
        if merged.map(\.content) != remoteEvents.map(\.content) {
            _ = try await CloudCalendarsAPI.saveICloudCalendarEvents(calendarId: binding.shareID,
                events: try merged.map { try $0.macSharedCalendarEvent() },
                windowStart: .distantPast, windowEnd: .distantFuture,
                expectedUpdatedAt: remote.eventsUpdatedAt, session: session)
        }
        guard backend.cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
        // Preserve edits made locally while the upload was in flight.
        let currentSnapshot = snapshot(calendar)
        let current = try currentSnapshot.map(MacCalendarSharingMerge.wireSnapshot)
        let flags = Dictionary(currentSnapshot.map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        let applied = try MacCalendarSharingMerge.preservingInFlightEdits(beforeUpload: local, uploaded: merged, current: current)
            .map { event in
                var result = event
                result.readOnly = flags[event.id]?.readOnly
                result.status = flags[event.id]?.status
                return result
            }
        if let native = calendar.native {
            if try applied.map(MacCalendarSharingMerge.wireSnapshot).map(\.content) != current.map(\.content) {
                try backend.adapter.apply(applied, calendar: native, original: backend.adapter.events(in: native), base: current)
            }
        } else if applied.map(\.content) != currentSnapshot.map(\.content),
                  let index = backend.local.firstIndex(where: { $0.id == binding.localID }) {
            var documents = backend.local
            documents[index].events = applied
            try backend.applyProviderDocuments(documents)
        }
        var bindings = try read()
        bindings[key]?.baseline = merged
        try write(bindings)
    }

    private func snapshot(_ calendar: MacCalendarItem) -> [DeviceCalendarEvent] {
        if let native = calendar.native {
            // EventKit fetches a bounded window. Keep previously shared events
            // outside that window; their absence is not a deletion.
            let items = backend.adapter.events(in: native).map(backend.adapter.snapshot)
            let start = Calendar.current.date(byAdding: .year, value: -1, to: Date())!
            let end = Calendar.current.date(byAdding: .year, value: 2, to: Date())!
            let baseline = (try? read().values.first { $0.accountID == backend.cloudSession?.calendarId && $0.localID == calendar.id }?.baseline) ?? []
            return items + baseline.filter { $0.endDate < start || $0.startDate > end }
        }
        return backend.local.first { $0.id == calendar.id }?.events ?? []
    }

    private func read() throws -> [String: Binding] {
        guard FileManager.default.fileExists(atPath: file.path) else { return [:] }
        return try JSONDecoder().decode([String: Binding].self, from: Data(contentsOf: file))
    }
    private func write(_ bindings: [String: Binding]) throws {
        try JSONEncoder().encode(bindings).write(to: file, options: .atomic)
    }
}
#endif
