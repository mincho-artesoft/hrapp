#if os(macOS)
import SwiftUI
import EventKit
import AppKit
import CoreImage
import UniformTypeIdentifiers

/// HRApp's Sharing destinations, using the same API and invitation payloads as iOS.
struct MacCalendarSharingView: View {
    @ObservedObject var store: MacTabletCalendarStore
    @ObservedObject var account: CalendarMacStore
    var openAccount: () -> Void
    @State private var destination = 0
    @State private var searchOpen = false
    @State private var searchText = ""
    @State private var invitations: [CloudCalendarsAPI.PendingEventInvitation] = []
    @State private var calendarInvitations: [CloudCalendarsAPI.PendingICloudCalendarInvitation] = []
    @State private var sent: [CloudCalendarsAPI.RemoteSharedEvent] = []
    @State private var received: [CloudCalendarsAPI.RemoteSharedEvent] = []
    @State private var calendars: [CloudCalendarsAPI.SharedICloudCalendar] = []
    @State private var busy = false
    @State private var error: String?
    @State private var link = ""
    @State private var importOpen = false
    @State private var importEvent: SharedEventImportPayload?
    @State private var calendarID = ""
    @State private var accessEvent: CloudCalendarsAPI.RemoteSharedEvent?
    @State private var authenticatorOpen = false
    @State private var webChallenge: WebAuthChallengePayload?

    var body: some View {
        VStack(spacing: 0) {
            if destination != 0 {
                CalendarSearchHeader(isSearching: searchOpen, height: CalendarHeaderLayout.height) {
                    SharedEventsPageHeader(title: destination == 1 ? "Pending invitations" : destination == 2 ? "Shared by me" : "Shared with me",
                        close: { destination = 0; searchOpen = false; searchText = "" },
                        search: destination == 1 ? nil : { searchOpen = true })
                } search: {
                    CalendarEventSearchField(text: $searchText) {
                        searchOpen = false
                        searchText = ""
                    }
                }
            }
            if destination == 0 {
                ScrollView {
                    VStack(spacing: 0) {
                        AppMenuNavigationRow(title: "Scan QR Code", subtitle: NSLocalizedString("Open a shared event or calendar", comment: ""), symbol: "qrcode.viewfinder", color: .blue) { importOpen = true }
                        Divider()
                        AppMenuNavigationRow(title: "Cloud Calendars account", subtitle: account.signedIn ? account.accountEmail : NSLocalizedString("Sign in or manage accounts", comment: ""), symbol: account.signedIn ? "person.crop.circle.badge.checkmark" : "person.crop.circle.badge.exclamationmark", color: account.signedIn ? .green : .blue, action: openAccount)
                        Divider()
                        AppMenuNavigationRow(title: "Web Sign-In & Authenticator", subtitle: NSLocalizedString("6-digit security code for cloud-calendars.com", comment: ""), symbol: "key.horizontal.fill", color: .teal) {
                            authenticatorOpen = true
                        }
                        Divider()
                        sharingRow("Pending invitations", count: invitations.count + calendarInvitations.count, icon: "envelope.badge.fill", color: .orange, target: 1)
                        Divider()
                        sharingRow("Shared by me", count: sent.count, icon: "paperplane.fill", color: .blue, target: 2)
                        Divider()
                        sharingRow("Shared with me", count: received.count + calendars.count, icon: "tray.and.arrow.down.fill", color: .indigo, target: 3)
                        if busy { ProgressView().padding() }
                        if let error { Text(error).foregroundStyle(.red) }
                    }.padding(.horizontal, DraggableMenuContentLayout.horizontalInset)
                        .padding(.vertical, DraggableMenuContentLayout.verticalInset)
                }
            } else {
                sharingDestination

            }
        }
        .font(CalendarTypography.body)
        .task(id: account.accountEmail) { await refresh() }
        .appSheet(isPresented: $importOpen) { importSheet }
        .appSheet(item: $importEvent) { payload in
            VStack(spacing: 20) {
                MacCalendarSheetHeader(title: Text("Add Event")) {
                    AppToolbarTextButton("Cancel") { importEvent = nil }
                } trailing: { EmptyView() }
                eventLabel(payload.title, date: payload.start, subtitle: payload.location ?? "")
                AppPicker("Calendar", selection: $calendarID) {
                    ForEach(store.writableCalendars, id: \.calendarIdentifier) { Text($0.title).tag($0.calendarIdentifier) }
                }
                if store.writableCalendars.isEmpty { Text("Add a writable calendar first.") }
                Button("Add") { saveInvitation(payload) }.buttonStyle(AppActionButtonStyle()).disabled(calendarID.isEmpty || busy)
                if let error { Text(error).foregroundStyle(.red) }
                Spacer()
            }.padding(24).frame(width: 540, height: 360)
        }
        .appSheet(item: $accessEvent) { event in
            MacEventRecipientsView(event: event, session: account.cloudSession)
        }
        .appSheet(isPresented: $authenticatorOpen) { WebStudioAuthSheetView(initialChallenge: nil) }
        .appSheet(item: $webChallenge) { challenge in WebStudioAuthSheetView(initialChallenge: challenge) }
    }

    @ViewBuilder private var sharingDestination: some View {
        if busy && invitations.isEmpty && calendarInvitations.isEmpty && sent.isEmpty && received.isEmpty {
            ProgressView().frame(maxWidth: .infinity, maxHeight: .infinity)
        } else if destination == 1 {
            if invitations.isEmpty && calendarInvitations.isEmpty {
                ContentUnavailableView("No pending invitations.", systemImage: "envelope.open")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(calendarInvitations) { item in
                            invitationCard(title: item.title, sender: item.senderEmail ?? item.ownerEmail ?? "", access: item.access, date: nil, calendar: true,
                                accept: { acceptCalendar(owner: item.ownerId, id: item.calendarId) },
                                decline: { perform { session in try await CloudCalendarsAPI.declinePendingICloudCalendarInvitation(ownerId: item.ownerId, calendarId: item.calendarId, session: session) } })
                        }
                        ForEach(invitations) { item in
                            invitationCard(title: item.title, sender: item.senderName, access: item.access, date: item.startDate, calendar: false,
                                accept: { importEvent = item.importPayload; calendarID = store.defaultWritableCalendar?.calendarIdentifier ?? "" },
                                decline: { perform { session in try await CloudCalendarsAPI.declinePendingEventInvitation(eventId: item.eventId, feedId: item.feedId, session: session) } })
                        }
                    }.padding(16)
                }.refreshable { await refresh() }
            }
        } else {
            let filtered = (destination == 2 ? sent : received).filter {
                searchText.isEmpty || $0.title.localizedCaseInsensitiveContains(searchText) || ($0.location?.localizedCaseInsensitiveContains(searchText) ?? false)
            }
            let groups = Dictionary(grouping: filtered) { MacCalendarFormatting.calendar.startOfDay(for: $0.startDate ?? .distantPast) }
            if groups.isEmpty && (destination != 3 || calendars.isEmpty) {
                ContentUnavailableView(LocalizedStringKey(searchText.isEmpty ? "No shared events yet." : "No matching events."),
                    systemImage: !searchText.isEmpty ? "magnifyingglass" : destination == 2 ? "paperplane" : "tray.and.arrow.down")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 0) {
                        ForEach(groups.keys.sorted(), id: \.self) { day in
                            Text(day.formatted(.dateTime.weekday(.wide).day().month(.wide).year().locale(.appFormatting)).uppercased(with: .appFormatting))
                                .font(CalendarTypography.headline).foregroundStyle(MacCalendarFormatting.calendar.isDateInToday(day) ? .red : .secondary)
                                .padding(.top, 16).padding(.bottom, 8)
                            ForEach((groups[day] ?? []).sorted { $0.start < $1.start }) { event in
                                SharedEventPresentationRow(title: event.title, start: event.startDate ?? day, end: event.endDate ?? day,
                                    isAllDay: event.allDay, location: event.location, isCancelled: event.isCancelled,
                                    color: .blue, access: destination == 3 ? event.access : nil, optionsAction: { accessEvent = event })
                                Divider()
                            }
                        }
                        if destination == 3 {
                            ForEach(calendars) { item in
                                AppMenuNavigationRow(title: LocalizedStringKey(item.title), subtitle: item.access.title,
                                    symbol: "calendar", color: .blue) { acceptCalendar(owner: item.ownerId, id: item.calendarId) }
                            }
                        }
                    }.padding(.horizontal, 16)
                }
            }
        }
        if let error { Text(error).font(CalendarTypography.footnote).foregroundStyle(.red).padding(16) }
    }
    private func invitationCard(title: String, sender: String, access: CloudCalendarsAPI.EventAccess,
        date: Date?, calendar: Bool, accept: @escaping () -> Void, decline: @escaping () -> Void) -> some View {
        VStack(alignment: .leading, spacing: 7) {
            HStack(alignment: .firstTextBaseline) {
                if calendar { Image(systemName: "calendar") }
                Text(title).font(CalendarTypography.body.weight(.semibold)).lineLimit(2)
                Spacer()
                Text(access.title).font(CalendarTypography.caption.weight(.semibold)).foregroundStyle(.secondary)
                    .padding(.horizontal, 8).padding(.vertical, 4).background(.thinMaterial, in: Capsule())
            }
            Text("From \(sender)").font(CalendarTypography.footnote).foregroundStyle(.secondary)
            if let date { Text(invitationDate(date)).font(CalendarTypography.footnote).foregroundStyle(.secondary) }
            HStack(spacing: 10) {
                Button(role: .destructive, action: decline) { Text("Decline").frame(maxWidth: .infinity).contentShape(Rectangle()) }
                    .buttonStyle(.bordered).tint(.red)
                Button(action: accept) { Text("Accept").frame(maxWidth: .infinity).contentShape(Rectangle()) }
                    .buttonStyle(.borderedProminent)
            }.controlSize(.small).disabled(busy)
        }.padding(.vertical, 6)
    }

    private func sharingRow(_ title: LocalizedStringKey, count: Int, icon: String, color: Color, target: Int) -> some View {
        let key = target == 1 ? (count == 1 ? "%lld pending invitation" : "%lld pending invitations") : (count == 1 ? "%lld event" : "%lld events")
        return AppMenuNavigationRow(title: title, subtitle: localizedFormat(NSLocalizedString(key, comment: ""), Int64(count)),
            symbol: icon, color: color, badge: target == 1 ? count : 0) { destination = target }
    }
    private func invitationDate(_ date: Date) -> String {
        MacCalendarFormatting.dateFormatter().string(from: date) + " · " + MacCalendarFormatting.time(date)
    }

    private func eventLabel(_ title: String, date: Date?, subtitle: String) -> some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(title).fontWeight(.medium)
            if let date { Text(invitationDate(date)).foregroundStyle(.secondary) }
            if !subtitle.isEmpty { Text(subtitle).font(.callout).foregroundStyle(.secondary) }
        }.frame(maxWidth: .infinity, alignment: .leading)
    }
    private var importSheet: some View {
        MacCalendarQRImportView { url in
            link = url.absoluteString
            let recognized = SharedEventImportPayload(url: url) != nil || SharedCalendarInvitationPayload(url: url) != nil || WebAuthChallengePayload(url: url) != nil
            if recognized { openLink() }
            return recognized
        }
    }
    private func openLink() {
        error = nil
        guard let url = URL(string: link.trimmingCharacters(in: .whitespacesAndNewlines)) else { error = NSLocalizedString("Invalid invitation link.", comment: ""); return }
        if let payload = SharedEventImportPayload(url: url) {
            importOpen = false; calendarID = store.defaultWritableCalendar?.calendarIdentifier ?? ""
            DispatchQueue.main.async { importEvent = payload }
        } else if let payload = SharedCalendarInvitationPayload(url: url) {
            importOpen = false; acceptCalendar(owner: payload.ownerID, id: payload.calendarID)
        } else if let challenge = WebAuthChallengePayload(url: url) {
            importOpen = false; webChallenge = challenge
        } else { error = NSLocalizedString("Invalid invitation link.", comment: "") }
    }
    private func saveInvitation(_ payload: SharedEventImportPayload) {
        guard let target = store.writableCalendars.first(where: { $0.calendarIdentifier == calendarID }) else { return }
        busy = true; error = nil
        Task { @MainActor in
            defer { busy = false }
            do {
                let event = EKEvent(eventStore: store.eventStore)
                event.calendar = target; event.title = payload.title; event.startDate = payload.start; event.endDate = payload.end
                event.isAllDay = payload.isAllDay; event.location = payload.location; event.url = payload.eventURL; event.timeZone = payload.timeZone
                let saved = try store.local.persist(event, replacing: nil, span: .thisEvent)
                if let session = account.cloudSession, let eventID = payload.eventID, let feedID = payload.feedID {
                    do {
                        try await CloudCalendarsAPI.rememberReceivedInvite(eventId: eventID, feedId: feedID, localEventIdentifier: saved.calendarItemIdentifier, session: session)
                    } catch {
                        // The local event remains usable; surface the sync failure instead of losing the user's import.
                        self.error = error.localizedDescription
                    }
                }
                store.reload(); importEvent = nil; await refresh()
            } catch { self.error = error.localizedDescription }
        }
    }
    private func acceptCalendar(owner: String, id: String) {
        perform { session in
            let value = try await CloudCalendarsAPI.acceptICloudCalendarInvitation(ownerId: owner, calendarId: id, session: session)
            try account.installSharedCalendar(value)
            store.reload()
        }
    }
    private func perform(_ action: @escaping (CloudCalendarsAPI.Session) async throws -> Void) {
        guard let session = account.cloudSession else { openAccount(); return }
        busy = true; error = nil
        Task { @MainActor in
            defer { busy = false }
            do { try await action(session); await refresh() } catch { self.error = error.localizedDescription }
        }
    }
    private func refresh() async {
        guard let session = account.cloudSession else { invitations = []; calendarInvitations = []; sent = []; received = []; calendars = []; return }
        busy = true; defer { busy = false }
        do {
            async let pending = CloudCalendarsAPI.pendingEventInvitations(session: session)
            async let pendingCalendars = CloudCalendarsAPI.pendingICloudCalendarInvitations(session: session)
            async let shared = CloudCalendarsAPI.sharedState(session: session)
            async let sharedCalendars = CloudCalendarsAPI.iCloudCalendarsSharedWithMe(session: session)
            let result = try await (pending, pendingCalendars, shared, sharedCalendars)
            invitations = result.0; calendarInvitations = result.1; sent = result.2.outgoing; received = result.2.received; calendars = result.3
        } catch { self.error = error.localizedDescription }
    }
}

private struct MacEventRecipientsView: View {
    let event: CloudCalendarsAPI.RemoteSharedEvent
    let session: CloudCalendarsAPI.Session?
    @Environment(\.dismiss) private var dismiss
    @State private var recipients: [CloudCalendarsAPI.EventRecipient] = []
    @State private var original: [CloudCalendarsAPI.EventRecipient] = []
    @State private var error: String?
    @State private var busy = false
    var body: some View {
        VStack {
            MacCalendarSheetHeader(title: Text("People with this event")) {
                AppToolbarTextButton("Cancel") { dismiss() }
            } trailing: {
                AppToolbarTextButton("Save") { save() }.disabled(busy)
            }
            Text(event.title).font(CalendarTypography.headline)
            Form {
                ForEach($recipients) { $recipient in
                    HStack {
                        Text(recipient.displayEmail); Spacer()
                        if event.access == .owner || event.access == nil {
                            AppPicker("Access", selection: $recipient.access) {
                                ForEach(CloudCalendarsAPI.EventAccess.allCases) { Text($0.title).tag($0) }
                            }.disabled(recipient.belongsToOriginalOwner)
                            Button(role: .destructive) { recipients.removeAll { $0.id == recipient.id } } label: { Image(systemName: "trash") }
                                .disabled(recipient.belongsToOriginalOwner)
                        } else { Text(recipient.access.title) }
                    }
                }
            }.formStyle(.grouped)
            if let error { Text(error).foregroundStyle(.red) }
            if busy { ProgressView() }
        }.padding(20).frame(width: 650, height: 520)
        .task {
            guard let session else { return }
            do { recipients = try await CloudCalendarsAPI.eventRecipients(eventId: event.id, session: session); original = recipients }
            catch { self.error = error.localizedDescription }
        }
    }
    private func save() {
        guard let session else { return }; busy = true
        Task { @MainActor in
            defer { busy = false }
            do {
                _ = try await CloudCalendarsAPI.saveEventRecipientChanges(eventId: event.id,
                    accessByRecipientID: Dictionary(uniqueKeysWithValues: recipients.map { ($0.id, $0.access) }),
                    removedRecipientIDs: Set(original.map(\.id)).subtracting(recipients.map(\.id)), session: session)
                dismiss()
            } catch { self.error = error.localizedDescription }
        }
    }
}

#endif
