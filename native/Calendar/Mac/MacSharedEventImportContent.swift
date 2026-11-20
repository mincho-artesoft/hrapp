#if os(macOS)
import SwiftUI
import EventKit

/// The same preview, destination row and primary action as SharedEventImportView.
struct MacSharedEventImportContent: View {
    let payload: SharedEventImportPayload
    let calendars: [EKCalendar]
    @Binding var calendarID: String
    let busy: Bool
    let error: String?
    let close: () -> Void
    let add: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            MacCalendarSheetHeader(title: Text("Shared event")) {
                AppToolbarTextButton("Close", action: close).disabled(busy)
            } trailing: { EmptyView() }
            ScrollView {
                VStack(spacing: 22) {
                    SharedInvitationEventPreview(payload: payload)
                    SharedInvitationCalendarPicker(writableCalendars: calendars, selectedCalendarIdentifier: $calendarID)
                    if let error {
                        Label(error, systemImage: "exclamationmark.triangle.fill")
                            .foregroundStyle(.red).font(CalendarTypography.footnote).textSelection(.enabled)
                    }
                    SharedInvitationAddButton(busy: busy, disabled: calendarID.isEmpty || calendars.isEmpty, action: add)
                }.padding(.horizontal, 22).padding(.vertical, 24)
            }
        }.font(CalendarTypography.body)
            .background(CalendarPalette.groupedBackground)
            .frame(width: 600, height: 520)
            .interactiveDismissDisabled(busy)
    }

}

enum MacEmailInvitation: Identifiable {
    case event(SharedEventImportPayload)
    case calendar(SharedCalendarInvitationPayload)

    var id: String {
        switch self {
        case let .event(event): return "event-" + event.id
        case let .calendar(calendar): return "calendar-" + calendar.id
        }
    }
}

struct MacEmailInvitationSheet: View {
    let invitation: MacEmailInvitation
    @ObservedObject var store: MacTabletCalendarStore
    let close: () -> Void
    @State private var calendarID = ""
    @State private var busy = false
    @State private var error: String?
    @State private var showSignIn = false

    var body: some View {
        switch invitation {
        case let .event(payload):
            MacSharedEventImportContent(payload: payload, calendars: store.writableCalendars,
                calendarID: $calendarID, busy: busy, error: error, close: close, add: {
                    guard let target = store.writableCalendars.first(where: { $0.calendarIdentifier == calendarID }) else { return }
                    save {
                        let session = try await CalendarFeedSession.current()
                        try await MacEventSharing.accept(payload, target: target, bridge: store.local, session: session)
                    }
                })
                .onChange(of: store.defaultWritableCalendar?.calendarIdentifier, initial: true) { _, id in
                    if calendarID.isEmpty { calendarID = id ?? "" }
                }
        case let .calendar(payload):
            VStack(spacing: 0) {
                MacCalendarSheetHeader(title: Text("Calendar invitation")) {
                    AppToolbarTextButton("Close", action: close).disabled(busy)
                } trailing: { EmptyView() }
                VStack(spacing: 22) {
                    SharedInvitationCalendarPreview(payload: payload)
                    if let error { Text(error).foregroundStyle(.red) }
                    SharedInvitationAddButton(isCalendar: true, busy: busy) {
                        guard let session = store.backend.cloudSession else { showSignIn = true; return }
                        save {
                            let calendar = try await CloudCalendarsAPI.acceptICloudCalendarInvitation(
                                ownerId: payload.ownerID, calendarId: payload.calendarID, session: session)
                            guard store.backend.cloudSession?.calendarId == session.calendarId else { throw CancellationError() }
                            try store.backend.installSharedCalendar(calendar)
                        }
                    }
                }.padding(.horizontal, 22).padding(.vertical, 24)
                Spacer()
            }
            .background(CalendarPalette.groupedBackground).frame(width: 540, height: 320)
            .interactiveDismissDisabled(busy)
            .appSheet(isPresented: $showSignIn) {
                MacCalendarAccountView(store: store.backend)
            }
        }
    }

    private func save(_ action: @escaping @MainActor () async throws -> Void) {
        guard !busy else { return }
        busy = true
        error = nil
        Task { @MainActor in
            defer { busy = false }
            do {
                try await action()
                store.reload()
                Task { await store.backend.sync() }
                close()
            } catch { self.error = error.localizedDescription }
        }
    }
}
#endif
