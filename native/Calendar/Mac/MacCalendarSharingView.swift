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
    @State private var detailTarget: MacTabletEventEditorTarget?
    @State private var searchOpen = false
    @State private var searchText = ""
    @State private var invitations: [CloudCalendarsAPI.PendingEventInvitation] = []
    @State private var calendarInvitations: [CloudCalendarsAPI.PendingICloudCalendarInvitation] = []
    @State private var sent: [CloudCalendarsAPI.RemoteSharedEvent] = []
    @State private var received: [CloudCalendarsAPI.RemoteSharedEvent] = []
    @State private var busy = false
    @State private var loadingSections = Set<String>()
    @State private var refreshID = UUID()
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
                        sharingRow("Shared with me", count: received.count, icon: "tray.and.arrow.down.fill", color: .indigo, target: 3)
                        if busy || !loadingSections.isEmpty { ProgressView().padding() }
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
            MacSharedEventImportContent(payload: payload, calendars: store.writableCalendars,
                calendarID: $calendarID, busy: busy, error: error,
                close: { importEvent = nil }, add: { saveInvitation(payload) })
        }
        .appSheet(item: $detailTarget, onDismiss: { Task { await refresh() } }) { target in
            MacTabletEventEditor(store: store, target: target) { detailTarget = nil }
                .frame(width: 600, height: 720)
        }
        .appSheet(item: $accessEvent) { event in
            MacEventRecipientsView(store: store, event: event, isOutgoing: destination == 2, session: account.cloudSession)
        }
        .appSheet(isPresented: $authenticatorOpen) { WebStudioAuthSheetView(initialChallenge: nil) }
        .appSheet(item: $webChallenge) { challenge in WebStudioAuthSheetView(initialChallenge: challenge) }
    }

    @ViewBuilder private var sharingDestination: some View {
        if !account.signedIn {
            CalendarSharingForm { CalendarSharingSection { CloudAccountSignInContent() } }
        } else if destinationIsLoading && destinationIsEmpty {
            ProgressView().frame(maxWidth: .infinity, maxHeight: .infinity)
        } else if destination == 1 {
            if invitations.isEmpty && calendarInvitations.isEmpty {
                ContentUnavailableView("No pending invitations.", systemImage: "envelope.open")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                PendingInvitationsList {
                    ForEach(calendarInvitations) { item in
                        PendingCalendarInvitationRow(invitation: item, isUpdating: busy,
                            accept: { acceptCalendar(owner: item.ownerId, id: item.calendarId) },
                            decline: { perform { session in try await CloudCalendarsAPI.declinePendingICloudCalendarInvitation(ownerId: item.ownerId, calendarId: item.calendarId, session: session) } })
                    }
                    ForEach(invitations) { item in
                        PendingEventInvitationRow(invitation: item, isUpdating: busy,
                            accept: { importEvent = item.importPayload; calendarID = store.defaultWritableCalendar?.calendarIdentifier ?? "" },
                            decline: { perform { session in try await CloudCalendarsAPI.declinePendingEventInvitation(eventId: item.eventId, feedId: item.feedId, session: session) } })
                    }
                }.refreshable { await refresh() }
            }
        } else {
            let filtered = (destination == 2 ? sent : received).filter {
                searchText.isEmpty || $0.title.localizedCaseInsensitiveContains(searchText) || ($0.location?.localizedCaseInsensitiveContains(searchText) ?? false)
            }
            let groups = Dictionary(grouping: filtered) { MacCalendarFormatting.calendar.startOfDay(for: $0.startDate ?? .distantPast) }
            if groups.isEmpty {
                ContentUnavailableView(LocalizedStringKey(searchText.isEmpty ? "No shared events yet." : "No matching events."),
                    systemImage: !searchText.isEmpty ? "magnifyingglass" : destination == 2 ? "paperplane" : "tray.and.arrow.down")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 0, pinnedViews: [.sectionHeaders]) {
                        ForEach(groups.keys.sorted(), id: \.self) { day in
                            Section {
                                ForEach((groups[day] ?? []).sorted { ($0.start, $0.end) < ($1.start, $1.end) }) { event in
                                    let local = MacEventSharing.localEvent(for: event, received: destination == 3, store: store)
                                    SharedEventPresentationRow(title: event.title, start: event.startDate ?? day, end: event.endDate ?? day,
                                        isAllDay: event.allDay, location: event.location, isCancelled: event.isCancelled,
                                        color: local.map { store.color(for: $0.calendar) } ?? (destination == 3 ? .indigo : .blue),
                                        access: destination == 3 ? event.access : nil,
                                        optionsAction: destination == 2 || event.access == .owner ? { accessEvent = event } : nil,
                                        infoAction: { openDetails(event, local: local, received: destination == 3) })
                                    Divider()
                                }
                            } header: {
                                SharedEventsDayHeader(day: day)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding(.top, 8).background(CalendarPalette.background)
                            }
                        }
                    }.padding(.horizontal, 16)
                }
            }
        }
        if let error { Text(error).font(CalendarTypography.footnote).foregroundStyle(.red).padding(16) }
    }
    private func openDetails(_ remote: CloudCalendarsAPI.RemoteSharedEvent, local: EKEvent?, received: Bool) {
        guard let session = account.cloudSession, let start = remote.startDate, let end = remote.endDate else { return }
        let snapshot = SharedEventDetailSnapshot(title: remote.title, start: start, end: end,
            isAllDay: remote.allDay, location: remote.location, url: remote.url, details: remote.details, calendarTitle: remote.calendarTitle)
        let event = local ?? snapshot.displayEvent(in: store.eventStore)
        var target = MacTabletEventEditorTarget(event: event, defaultDate: start, startsInEditingMode: false)
        let source = SharedEventDetailSource(event: remote, received: received, session: session, usesServerRecord: local == nil)
        target.sharedSource = source
        target.readOnly = !source.canEdit
        if local == nil { target.displaySupplement = snapshot.supplement }
        detailTarget = target
    }

    private var destinationIsLoading: Bool {
        destination == 1 ? !loadingSections.isDisjoint(with: ["events", "calendars"]) : loadingSections.contains("shared")
    }
    private var destinationIsEmpty: Bool {
        destination == 1 ? invitations.isEmpty && calendarInvitations.isEmpty : (destination == 2 ? sent.isEmpty : received.isEmpty)
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
                let session = try await CalendarFeedSession.current()
                try await MacEventSharing.accept(payload, target: target, bridge: store.local, session: session)
                Task { await store.backend.sync() }
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
        let generation = UUID()
        refreshID = generation
        guard let session = account.cloudSession else {
            invitations = []; calendarInvitations = []; sent = []; received = []; loadingSections = []; error = nil; return
        }
        loadingSections = ["events", "calendars", "shared"]
        error = nil
        async let events: Void = loadSection("events", session: session, generation: generation)
        async let calendars: Void = loadSection("calendars", session: session, generation: generation)
        async let shared: Void = loadSection("shared", session: session, generation: generation)
        _ = await (events, calendars, shared)
    }

    private func loadSection(_ section: String, session: CloudCalendarsAPI.Session, generation: UUID) async {
        defer { if refreshID == generation { loadingSections.remove(section) } }
        do {
            switch section {
            case "events":
                let result = try await CloudCalendarsAPI.pendingEventInvitations(session: session)
                guard isCurrent(session, generation) else { return }
                invitations = result
            case "calendars":
                let result = try await CloudCalendarsAPI.pendingICloudCalendarInvitations(session: session)
                guard isCurrent(session, generation) else { return }
                calendarInvitations = result
            default:
                let result = try await CloudCalendarsAPI.sharedState(session: session)
                guard isCurrent(session, generation) else { return }
                sent = result.outgoing; received = result.received
            }
        } catch {
            guard isCurrent(session, generation) else { return }
            self.error = error.localizedDescription
        }
    }
    private func isCurrent(_ session: CloudCalendarsAPI.Session, _ generation: UUID) -> Bool {
        refreshID == generation && account.cloudSession?.calendarId == session.calendarId && !Task.isCancelled
    }
}

#endif
