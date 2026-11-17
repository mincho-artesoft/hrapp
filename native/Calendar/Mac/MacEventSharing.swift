#if os(macOS)
import SwiftUI
import AppKit
import EventKit

struct HRAppMacEventShareView: View {
    @ObservedObject var store: MacTabletCalendarStore
    let event: EKEvent
    @ObservedObject private var account = CloudAccountManager.shared
    @Environment(\.dismiss) private var dismiss
    @State private var delivery: Delivery?
    @State private var busy = false
    @State private var error: String?
    @State private var anchor: NSView?
    private struct Delivery: Identifiable {
        let kind: String
        let link: URL
        let eventID: String
        var id: String { kind }
    }

    var body: some View {
        VStack(spacing: 0) {
            if account.isSignedIn {
                EventShareMethodPicker(eventTitle: event.title ?? "",
                    onAppClip: { prepare("appclip") }, onEmail: { prepare("email") },
                    onQRCode: { prepare("qr") }, onCancel: { dismiss() })
            } else {
                MacCalendarSheetHeader(title: Text("Share Event")) {
                    AppToolbarTextButton("Cancel") { dismiss() }
                } trailing: { EmptyView() }
                ScrollView { CloudAccountSignInContent().padding(20) }
            }
            if busy { ProgressView().padding(12) }
            if let error { Text(error).font(CalendarTypography.footnote).foregroundStyle(.red).padding(16) }
        }
        .background(CalendarPalette.groupedBackground)
        .background(SharingAnchor { anchor = $0 })
        .frame(width: 600, height: 540)
        .disabled(busy)
        .appSheet(item: $delivery) { item in
            if item.kind == "email" {
                EventEmailInvitationsView(eventID: item.eventID, eventTitle: event.title ?? "", eventURL: item.link, onSent: {})
                    .frame(width: 600, height: 620)
            } else {
                EventShareQRCodeView(eventTitle: event.title ?? "", url: item.link).frame(width: 600, height: 680)
            }
        }
    }

    private func prepare(_ kind: String) {
        guard !busy, store.canShare(event) else { return }
        busy = true; error = nil
        Task { @MainActor in
            defer { busy = false }
            do {
                let session = try await CalendarFeedSession.current()
                let snapshot = store.local.record(for: event) ?? store.backend.adapter.snapshot(event)
                let calendarID = store.local.record(for: event.calendar)?.id ?? event.calendar.calendarIdentifier
                let shared = try await MacEventSharing.prepare(snapshot, calendarID: calendarID,
                    native: !store.local.isLocal(event), session: session)
                let base = kind == "appclip" ? URL(string: "https://appclip.apple.com/id")!
                    : CloudCalendarsAPI.baseURL.appendingPathComponent("event-invites/open")
                var url = URLComponents(url: base, resolvingAgainstBaseURL: false)!
                url.queryItems = [
                    .init(name: "p", value: SharedEventImportPayload.appClipBundleIdentifier),
                    .init(name: "e", value: shared.remoteID), .init(name: "c", value: shared.feedID),
                    .init(name: "title", value: String(snapshot.title.prefix(120))),
                    .init(name: "start", value: String(snapshot.startDate.timeIntervalSince1970)),
                    .init(name: "end", value: String(snapshot.endDate.timeIntervalSince1970)),
                    .init(name: "allDay", value: snapshot.allDay ? "1" : "0"),
                    .init(name: "timeZone", value: event.timeZone?.identifier ?? TimeZone.current.identifier),
                    .init(name: "color", value: NSColor(store.color(for: event.calendar)).hex),
                    .init(name: "location", value: snapshot.location.map { String($0.prefix(160)) })
                ]
                guard let link = url.url else { return }
                if kind == "appclip", let anchor {
                    NSSharingServicePicker(items: [link]).show(relativeTo: anchor.bounds, of: anchor, preferredEdge: .minY)
                } else { delivery = Delivery(kind: kind, link: link, eventID: shared.remoteID) }
            } catch { self.error = error.localizedDescription }
        }
    }

    private struct SharingAnchor: NSViewRepresentable {
        let attach: (NSView) -> Void
        func makeNSView(context: Context) -> NSView {
            let view = NSView(); DispatchQueue.main.async { attach(view) }; return view
        }
        func updateNSView(_ view: NSView, context: Context) {}
    }
}

@MainActor
enum MacEventSharing {
    struct Record: Codable {
        let remoteID: String
        let feedID: String
        let calendarID: String
        let native: Bool
        var baseline: DeviceCalendarEvent
        var cancelled = false
    }
    private static func key(_ session: CloudCalendarsAPI.Session) -> String {
        "macEventSharing.v1.\(DeviceCalendarReplica.storageHost(for: CloudCalendarsAPI.baseURL)).\(session.calendarId)"
    }
    private static func records(_ session: CloudCalendarsAPI.Session) -> [String: Record] {
        guard let data = UserDefaults.standard.data(forKey: key(session)) else { return [:] }
        return (try? JSONDecoder().decode([String: Record].self, from: data)) ?? [:]
    }
    private static func store(_ value: Record, session: CloudCalendarsAPI.Session) throws {
        var all = records(session); all[value.baseline.id] = value
        UserDefaults.standard.set(try JSONEncoder().encode(all), forKey: key(session))
    }
    private static func canonical(_ event: DeviceCalendarEvent) throws -> DeviceCalendarEvent {
        try MacCalendarSharingMerge.wireSnapshot(event)
    }
    private static func upload(_ event: DeviceCalendarEvent, remoteID: String, session: CloudCalendarsAPI.Session, receivedFeedID: String? = nil) async throws {
        let details = try MacEventShareSnapshot.details(event)
        try await CloudCalendarsAPI.upsertEvent(.init(id: remoteID, title: event.title, start: event.startDate, end: event.endDate,
            isAllDay: event.allDay, location: event.location, url: event.url.flatMap(URL.init(string:)), details: details,
            localEventIdentifier: event.id, organizerName: nil, organizerEmail: nil), session: session, receivedFeedId: receivedFeedID)
    }
    #if DEBUG
    static func discardAuditRecords(prefix: String, eventIDs: Set<String>, session: CloudCalendarsAPI.Session) throws {
        let kept = records(session).filter { !$0.value.baseline.title.hasPrefix(prefix) }
        UserDefaults.standard.set(try JSONEncoder().encode(kept), forKey: key(session))
        let baselines = receivedBaselines(session)
        let removed = eventIDs.union(baselines.filter { $0.value.title.hasPrefix(prefix) }.keys)
        UserDefaults.standard.set(try JSONEncoder().encode(baselines.filter { !removed.contains($0.key) }), forKey: key(session) + ".receivedBaselines")
        UserDefaults.standard.set(receivedCopies(session).filter { !removed.contains($0.key) }, forKey: key(session) + ".receivedCopies")
    }
    #endif
    private static func receivedCopies(_ session: CloudCalendarsAPI.Session) -> [String: String] {
        UserDefaults.standard.dictionary(forKey: key(session) + ".receivedCopies") as? [String: String] ?? [:]
    }
    private static func receivedBaselines(_ session: CloudCalendarsAPI.Session) -> [String: DeviceCalendarEvent] {
        UserDefaults.standard.data(forKey: key(session) + ".receivedBaselines").flatMap {
            try? JSONDecoder().decode([String: DeviceCalendarEvent].self, from: $0)
        } ?? [:]
    }
    /// A server receipt is account-wide; the local copy identifier is device-specific.
    @discardableResult
    static func accept(_ payload: SharedEventImportPayload, target: EKCalendar,
                       bridge: MacAppLocalCalendarBridge, session: CloudCalendarsAPI.Session) async throws -> String {
        let backend = bridge.store.backend
        var copies = receivedCopies(session)
        let knownID = payload.eventID.flatMap { copies[$0] ?? receivedBaselines(session)[$0]?.id }
        let localID: String
        if let knownID, let existing = backend.event(matchingLocalIdentifier: knownID) {
            localID = existing.id
        } else {
            let event = EKEvent(eventStore: backend.eventStore)
            event.calendar = target; event.title = payload.title; event.startDate = payload.start; event.endDate = payload.end
            event.isAllDay = payload.isAllDay; event.location = payload.location; event.url = payload.eventURL; event.timeZone = payload.timeZone
            let saved = try bridge.persist(event, replacing: nil, span: .thisEvent)
            localID = bridge.record(for: saved)?.id ?? backend.adapter.identity(saved)
        }
        if let id = payload.eventID, let feed = payload.feedID {
            copies[id] = localID
            UserDefaults.standard.set(copies, forKey: key(session) + ".receivedCopies")
            try await CloudCalendarsAPI.rememberReceivedInvite(eventId: id, feedId: feed, localEventIdentifier: localID, session: session)
        }
        return localID
    }

    static func prepare(_ event: DeviceCalendarEvent, calendarID: String, native: Bool,
                        session: CloudCalendarsAPI.Session) async throws -> Record {
        let existing = records(session)[event.id]
        if let existing, !existing.cancelled { return existing }
        // Retrying a failed grant must not create another outgoing event.
        // A cancelled share gets a new, but still retry-stable, generation.
        let remoteID = "mac_" + DeviceCalendarReplica.hash(DeviceCalendarReplica.deviceID + ":" + event.id + ":" + (existing?.remoteID ?? ""))
        try await upload(event, remoteID: remoteID, session: session)
        let grant = try await CloudCalendarsAPI.createGrant(role: "viewer", eventId: remoteID, feedName: event.title, session: session)
        let record = Record(remoteID: remoteID, feedID: grant.feedId, calendarID: calendarID, native: native, baseline: try canonical(event))
        try store(record, session: session)
        return record
    }
    static func restoreReceivedPermissions(backend: CalendarMacStore, session: CloudCalendarsAPI.Session) {
        let roles = UserDefaults.standard.dictionary(forKey: key(session) + ".receivedAccess") as? [String: String] ?? [:]
        backend.receivedEventAccess = roles.compactMapValues(CloudCalendarsAPI.EventAccess.init(rawValue:))
        backend.receivedEventUnavailable = Set(UserDefaults.standard.stringArray(forKey: key(session) + ".receivedUnavailable") ?? [])
    }
    static func sync(backend: CalendarMacStore, session: CloudCalendarsAPI.Session) async throws {
        let all = records(session).filter { !$0.value.cancelled }
        let state = try await CloudCalendarsAPI.sharedState(session: session)
        guard backend.cloudSession?.calendarId == session.calendarId else { return }
        try await syncReceived(state.received, backend: backend, session: session)
        let remote = state.outgoing
        for (_, original) in all {
            guard backend.cloudSession?.calendarId == session.calendarId else { return }
            var record = original
            guard let server = remote.first(where: { $0.id == record.remoteID }) else { continue }
            if server.isCancelled { record.cancelled = true; try store(record, session: session); continue }
            guard let current = backend.events.first(where: { $0.id == record.baseline.id }) else {
                // A disconnected/deleted calendar is not proof that its event
                // was deleted. Only cancel while the source is still available.
                guard backend.calendars.contains(where: { $0.id == record.calendarID && $0.writable }) else { continue }
                // Missing access or events outside EventKit's query are not deletions.
                if record.native {
                    guard EKEventStore.authorizationStatus(for: .event) == .fullAccess,
                          record.baseline.startDate > Calendar.current.date(byAdding: .year, value: -1, to: Date())!,
                          record.baseline.endDate < Calendar.current.date(byAdding: .year, value: 2, to: Date())! else { continue }
                }
                try await CloudCalendarsAPI.cancelEvent(id: record.remoteID, session: session)
                record.cancelled = true; try store(record, session: session); continue
            }
            var incoming = DeviceCalendarEvent(id: current.id, title: server.title, start: server.start, end: server.end,
                allDay: server.allDay, location: server.location, url: server.url,
                details: try server.details.map { try CalendarJSON.object(encoding: $0) })
            // Keep provider metadata that the sharing API does not own.
            incoming.readOnly = current.readOnly
            let merged = DeviceCalendarReplica.merge(base: [record.baseline], local: [try canonical(current)], remote: [try canonical(incoming)])[0]
            if merged.content != (try canonical(incoming)).content { try await upload(merged, remoteID: record.remoteID, session: session) }
            if let latest = backend.events.first(where: { $0.id == current.id }),
               let calendar = backend.calendar(for: latest), calendar.writable {
                let preserved = try MacCalendarSharingMerge.preservingInFlightEdits(
                    beforeUpload: [current], uploaded: [merged], current: [latest])
                if var applied = preserved.first, applied.content != (try canonical(latest)).content {
                    var details = latest.details ?? [:]
                    details.merge(applied.details ?? [:]) { _, shared in shared }
                    applied.details = details; applied.readOnly = latest.readOnly
                    try backend.save(applied, calendarID: calendar.id, scheduleSync: false)
                }
            }
            record.baseline = merged; try store(record, session: session)
        }
    }
    private static func syncReceived(_ received: [CloudCalendarsAPI.RemoteSharedEvent], backend: CalendarMacStore,
                                     session: CloudCalendarsAPI.Session) async throws {
        let storageKey = key(session) + ".receivedBaselines"
        var baselines = UserDefaults.standard.data(forKey: storageKey).flatMap {
            try? JSONDecoder().decode([String: DeviceCalendarEvent].self, from: $0)
        } ?? [:]
        var copies = receivedCopies(session)
        var access: [String: CloudCalendarsAPI.EventAccess] = [:]
        var unavailable = Set<String>()
        for remote in received {
            guard backend.cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
            guard let identifier = copies[remote.id] ?? baselines[remote.id]?.id ?? remote.localEventIdentifier,
                  let current = backend.event(matchingLocalIdentifier: identifier),
                  let calendar = backend.calendar(for: current) else { continue }
            copies[remote.id] = current.id
            let role = remote.access ?? .reader
            access[current.id] = role
            if remote.isCancelled { unavailable.insert(current.id) }
            var incoming = DeviceCalendarEvent(id: current.id, title: remote.title, start: remote.start, end: remote.end,
                allDay: remote.allDay, location: remote.location, url: remote.url,
                details: try remote.details.map { try CalendarJSON.object(encoding: $0) })
            incoming = try canonical(incoming)
            let writable = role != .reader && !remote.isCancelled
            let merged = writable ? try MacCalendarSharingMerge.reconcile(base: [baselines[remote.id] ?? incoming],
                local: [current], remote: [incoming])[0] : incoming
            if writable && merged.content != incoming.content {
                try await upload(merged, remoteID: remote.id, session: session, receivedFeedID: remote.feedId)
            }
            guard backend.cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
            if let latest = backend.events.first(where: { $0.id == current.id }) {
                let preserved = writable ? try MacCalendarSharingMerge.preservingInFlightEdits(
                    beforeUpload: [current], uploaded: [merged], current: [latest]) : [merged]
                if var applied = preserved.first {
                    var details = latest.details ?? [:]
                    details.merge(applied.details ?? [:]) { _, shared in shared }
                    applied.details = details; applied.readOnly = !writable
                    if applied.content != latest.content {
                        try backend.save(applied, calendarID: calendar.id, scheduleSync: false)
                    }
                }
            }
            baselines[remote.id] = merged
            UserDefaults.standard.set(try JSONEncoder().encode(baselines), forKey: storageKey)
        }
        let present = Set(received.map(\.id))
        for (remoteID, localID) in copies where !present.contains(remoteID) {
            guard var event = backend.event(matchingLocalIdentifier: localID), let calendar = backend.calendar(for: event) else { continue }
            access[event.id] = .reader; unavailable.insert(event.id)
            if event.readOnly != true {
                event.readOnly = true
                try backend.save(event, calendarID: calendar.id, scheduleSync: false)
            }
        }
        UserDefaults.standard.set(copies, forKey: key(session) + ".receivedCopies")
        UserDefaults.standard.set(access.mapValues(\.rawValue), forKey: key(session) + ".receivedAccess")
        UserDefaults.standard.set(Array(unavailable), forKey: key(session) + ".receivedUnavailable")
        backend.receivedEventAccess = access
        backend.receivedEventUnavailable = unavailable
    }

}
#endif
