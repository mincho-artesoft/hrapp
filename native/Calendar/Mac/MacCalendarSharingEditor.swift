#if os(macOS)
import SwiftUI
import EventKit

struct MacCalendarSharingEditor: View {
    @ObservedObject var store: MacTabletCalendarStore
    let calendar: EKCalendar
    @Environment(\.dismiss) private var dismiss
    @State private var recipients: [Recipient] = []
    @State private var initialEmails: Set<String> = []
    @State private var revision: String?
    @State private var error: String?
    @State private var busy = false
    @State private var loaded = false
    private struct Recipient: Identifiable {
        let id = UUID()
        var email: String
        var access: CloudCalendarsAPI.EventAccess
    }
    private var shareID: String { store.local.record(for: calendar)?.id ?? DeviceCalendarReplica.hash(calendar.calendarIdentifier) }
    var body: some View {
        VStack(spacing: 0) {
            MacCalendarSheetHeader(title: Text(calendar.title)) {
                AppToolbarTextButton("Cancel") { dismiss() }
            } trailing: {
                AppToolbarTextButton("Save") { save() }.disabled(busy || !loaded)
            }
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text("People with this calendar").font(CalendarTypography.headline)
                    ForEach($recipients) { $recipient in
                        HStack {
                            TextField("Email", text: $recipient.email).textFieldStyle(.roundedBorder)
                            AppPicker("Access", selection: $recipient.access) {
                                ForEach(CloudCalendarsAPI.EventAccess.calendarSharingCases) { Text($0.title).tag($0) }
                            }.frame(width: 150)
                            Button(role: .destructive) { recipients.removeAll { $0.id == recipient.id } } label: { Image(systemName: "trash") }
                        }
                    }
                    Button { recipients.append(.init(email: "", access: .reader)) } label: { Label("Add Person", systemImage: "person.badge.plus") }
                        .buttonStyle(AppActionButtonStyle())
                    if let error { Text(error).foregroundStyle(.red).textSelection(.enabled) }
                    if busy { ProgressView() }
                }.padding(20)
            }
        }.font(CalendarTypography.body).frame(width: 650, height: 520)
        .task { await load() }
    }
    private func load() async {
        guard let session = store.backend.cloudSession else { return }
        busy = true; defer { busy = false }
        do {
            let result = try await CloudCalendarsAPI.iCloudCalendarSharing(calendarId: shareID, session: session)
            recipients = result.recipients.map { .init(email: $0.email, access: $0.access) }
            initialEmails = Set(result.recipients.map(\.email)); revision = result.updatedAt; loaded = true
        } catch CloudCalendarsAPI.Failure.http(let code, _) where code == 404 { loaded = true }
        catch { self.error = error.localizedDescription }
    }
    private func save() {
        guard let session = store.backend.cloudSession else { return }
        let values = recipients.map { (email: $0.email.trimmingCharacters(in: .whitespacesAndNewlines).lowercased(), access: $0.access) }
        guard values.allSatisfy({ $0.email.contains("@") && !$0.email.contains(" ") }), Set(values.map(\.email)).count == values.count else {
            error = NSLocalizedString("Enter a valid, unique email address for each person.", comment: ""); return
        }
        busy = true; error = nil
        Task { @MainActor in
            defer { busy = false }
            do {
                let currentEmails = Set(values.map(\.email))
                let result = try await CloudCalendarsAPI.saveICloudCalendarSharing(calendarId: shareID,
                    title: calendar.title, color: NSColor(store.color(for: calendar)).hex, timeZone: TimeZone.current.identifier,
                    calendarKind: store.local.isLocal(calendar) ? "app_local" : "eventkit", recipients: values,
                    removedRecipientEmails: initialEmails.subtracting(currentEmails), expectedUpdatedAt: revision, session: session)
                let events = store.events.filter { $0.calendar.calendarIdentifier == calendar.calendarIdentifier }
                let portable: [CloudCalendarsAPI.SharedICloudCalendarEvent] = try events.map { event in
                    if let local = store.local.record(for: event) { return try local.macSharedCalendarEvent() }
                    return .init(id: event.calendarItemIdentifier, title: event.title ?? "", start: DeviceCalendarEvent.iso(event.startDate),
                        end: DeviceCalendarEvent.iso(event.endDate), allDay: event.isAllDay, location: event.location, url: event.url?.absoluteString,
                        details: SharedEventDetails(event: event))
                }
                let now = Date()
                _ = try await CloudCalendarsAPI.saveICloudCalendarEvents(calendarId: shareID, events: portable,
                    windowStart: Calendar.current.date(byAdding: .year, value: -1, to: now)!,
                    windowEnd: Calendar.current.date(byAdding: .year, value: 3, to: now)!, expectedUpdatedAt: result.eventsUpdatedAt, session: session)
                let added = currentEmails.subtracting(initialEmails)
                if !added.isEmpty {
                    _ = try await CloudCalendarsAPI.inviteICloudCalendarRecipients(calendarId: shareID, emails: Array(added), session: session)
                }
                dismiss()
            } catch { self.error = error.localizedDescription }
        }
    }
}
#endif
