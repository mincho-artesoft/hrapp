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
        try MacEventShareSnapshot.canonical(event)
    }
    private static func upload(_ event: DeviceCalendarEvent, remoteID: String, session: CloudCalendarsAPI.Session) async throws {
        let details = try MacEventShareSnapshot.details(event)
        try await CloudCalendarsAPI.upsertEvent(.init(id: remoteID, title: event.title, start: event.startDate, end: event.endDate,
            isAllDay: event.allDay, location: event.location, url: event.url.flatMap(URL.init(string:)), details: details,
            localEventIdentifier: event.id, organizerName: nil, organizerEmail: nil), session: session)
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
    static func sync(backend: CalendarMacStore, session: CloudCalendarsAPI.Session) async throws {
        let all = records(session).filter { !$0.value.cancelled }
        guard !all.isEmpty else { return }
        let remote = try await CloudCalendarsAPI.sharedState(session: session).outgoing
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
            if merged.content != (try canonical(current)).content, let calendar = backend.calendar(for: current), calendar.writable {
                var applied = merged
                // Sharing owns known portable fields; keep provider-only metadata locally.
                var details = current.details ?? [:]
                details.merge(merged.details ?? [:]) { _, shared in shared }
                applied.details = details
                try backend.save(applied, calendarID: calendar.id)
            }
            record.baseline = merged; try store(record, session: session)
        }
    }
}
#endif
