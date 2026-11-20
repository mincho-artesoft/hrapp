import Combine
import EventKit
import SwiftUI

private struct ReceivedSharedEvent: Identifiable {
    let id: String
    let feedID: String
    let localEventIdentifier: String
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let location: String?
    let isCancelled: Bool
    let isRevoked: Bool
    let access: CloudCalendarsAPI.EventAccess
}

private struct SharedEventAccessTarget: Identifiable {
    let eventID: String
    let feedID: String?
    let localEventIdentifier: String?
    let title: String
    var remote: CloudCalendarsAPI.RemoteSharedEvent?
    var cancelled = false

    var id: String { eventID }

    init(_ event: SharedOutgoingEventTracker.SentEvent) {
        remote = event.serverEvent
        cancelled = event.isCancelled == true
        eventID = event.eventID
        feedID = event.feedID
        localEventIdentifier = event.localEventIdentifier
        title = event.title
    }

    init(_ event: ReceivedSharedEvent) {
        cancelled = event.isCancelled
        eventID = event.id
        feedID = event.feedID
        localEventIdentifier = event.localEventIdentifier
        title = event.title
    }
}

private struct SharedEventDayGroup<Item>: Identifiable {
    let day: Date
    let events: [Item]

    var id: Date { day }
}

private enum SharedEventsDestination: String, Identifiable {
    case pending
    case sent
    case received

    var id: String { rawValue }

    var title: LocalizedStringKey {
        switch self {
        case .pending: "Pending invitations"
        case .sent: "Shared by me"
        case .received: "Shared with me"
        }
    }
}

struct SharingSheetView: View {
    @ObservedObject private var viewModel: CalendarViewModel = .shared
    @ObservedObject private var cloudAccountManager = CloudAccountManager.shared
    @ObservedObject private var pendingInvitationManager = PendingEventInvitationManager.shared

    @State private var showCloudAccount = false
    @State private var sentEvents: [SharedOutgoingEventTracker.SentEvent] = []
    @State private var receivedEvents: [ReceivedSharedEvent] = []
    @State private var selectedEventAccessTarget: SharedEventAccessTarget?
    @State private var selectedEventDetails: AppLocalEventEditorTarget?
    @State private var selectedPendingInvitation: SharedEventImportPayload?
    @State private var selectedPendingCalendarInvitation: SharedCalendarInvitationPayload?
    @State private var pendingInvitationActionIDs: Set<String> = []
    @State private var pendingInvitationErrorMessage: String?
    @State private var sharedEventsDestination: SharedEventsDestination?
    @State private var showSharedEventsSearch = false
    @State private var sharedEventsSearchText = ""
    @State private var showQRScanner = false
    @State private var pendingScannedEvent: SharedEventImportPayload?
    @State private var pendingScannedCalendar: SharedCalendarInvitationPayload?
    @State private var pendingScannedWebAuth: WebAuthChallengePayload?
    @State private var scannedEvent: SharedEventImportPayload?
    @State private var scannedCalendar: SharedCalendarInvitationPayload?
    @State private var scannedWebAuth: WebAuthChallengePayload?
    @State private var showWebAuthenticator = false

    private let expiryRefreshTimer = Timer.publish(
        every: 60,
        on: .main,
        in: .common
    ).autoconnect()

    private let bottomContentInset: CGFloat

    #if DEBUG
    private var isSurfaceFixture = false
    #else
    private let isSurfaceFixture = false
    #endif

    private var displayedEventInvitations: [CloudCalendarsAPI.PendingEventInvitation] {
        #if DEBUG
        if isSurfaceFixture { return Self.surfaceInvitations }
        #endif
        return pendingInvitationManager.invitations
    }

    private var displayedCalendarInvitations: [CloudCalendarsAPI.PendingICloudCalendarInvitation] {
        isSurfaceFixture ? [] : pendingInvitationManager.calendarInvitations
    }

    private var displayedInvitationCount: Int {
        displayedEventInvitations.count + displayedCalendarInvitations.count
    }

    init(bottomContentInset: CGFloat = 0) {
        self.bottomContentInset = bottomContentInset
    }

    var body: some View {
        Form {
            sharingNavigationSection

            if bottomContentInset > 0 {
                Section {
                    Color.clear
                        .frame(height: bottomContentInset)
                        .listRowInsets(EdgeInsets())
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                        .accessibilityHidden(true)
                }
            }
        }
        .contentMargins(.horizontal, 0, for: .scrollContent)
        .contentMargins(.vertical, 0, for: .scrollContent)
        .listSectionSpacing(0)
        .scrollContentBackground(.hidden)
        .background(Color.clear)
        .listRowBackground(Color.clear)
        .onAppear {
            guard !isSurfaceFixture else { return }
            viewModel.reloadCalendars()
            reloadSharedEvents()
            openPendingInvitationsIfRequested()
            #if DEBUG
            if let screen = EventSurfaceFullScreen.appScreen {
                if screen == "account" { showCloudAccount = true }
                else if let destination = SharedEventsDestination(rawValue: screen) {
                    sharedEventsDestination = destination
                }
            }
            #endif
            Task { await pendingInvitationManager.refresh() }
        }
        .onReceive(NotificationCenter.default.publisher(for: .openPendingEventInvitations)) { _ in
            openPendingInvitationsIfRequested()
        }
        .onReceive(NotificationCenter.default.publisher(for: .sharedEventsTrackingChanged)) { _ in
            reloadSharedEvents()
        }
        .onReceive(NotificationCenter.default.publisher(for: .sharedEventImported)) { _ in
            reloadSharedEvents()
        }
        .onReceive(NotificationCenter.default.publisher(for: .EKEventStoreChanged)) { _ in
            reloadSharedEvents()
        }
        .onReceive(expiryRefreshTimer) { _ in
            reloadSharedEvents()
        }
        .task(id: CalendarFeedSession.existing?.calendarId) {
            guard !isSurfaceFixture else { return }
            _ = await SharedOutgoingEventTracker.pullRemoteChanges(in: viewModel.eventStore)
            reloadSharedEvents()
        }
        .onReceive(NotificationCenter.default.publisher(for: .cloudAccountChanged)) { _ in
            selectedEventDetails = nil
            selectedEventAccessTarget = nil
            reloadSharedEvents()
            Task { await pendingInvitationManager.refresh() }
        }
        .appFullScreenCover(isPresented: $showCloudAccount) {
            cloudAccountView
        }
        .appFullScreenCover(isPresented: $showQRScanner, onDismiss: presentScannedEvent) {
            SharedEventQRScannerView { share in
                switch share {
                case .event(let payload):
                    pendingScannedEvent = payload
                case .calendar(let payload):
                    pendingScannedCalendar = payload
                case .webAuth(let payload):
                    pendingScannedWebAuth = payload
                }
            }
        }
        .appSheet(item: $scannedEvent) { payload in
            SharedEventImportView(payload: payload)
        }
        .appSheet(item: $scannedCalendar) { payload in
            SharedCalendarInvitationView(payload: payload)
        }
        .appSheet(item: $scannedWebAuth) { payload in
            WebStudioAuthSheetView(initialChallenge: payload)
        }
        .appSheet(isPresented: $showWebAuthenticator) {
            WebStudioAuthSheetView(initialChallenge: nil)
        }
        .appFullScreenCover(item: $sharedEventsDestination) { destination in
            sharedEventsList(destination)
        }
    }

    private var sharingNavigationSection: some View {
        Section {
            VStack(spacing: 0) {
                scanEventQRCodeButton

                Divider()

                cloudAccountButton

                Divider()

                webAuthenticatorButton

                Divider()

                sharedEventsNavigationButton(
                    title: "Pending invitations",
                    count: displayedInvitationCount,
                    systemImage: "envelope.badge.fill",
                    color: .orange,
                    destination: .pending
                )

                Divider()

                sharedEventsNavigationButton(
                    title: "Shared by me",
                    count: sentEvents.count,
                    systemImage: "paperplane.fill",
                    color: .blue,
                    destination: .sent
                )

                Divider()

                sharedEventsNavigationButton(
                    title: "Shared with me",
                    count: receivedEvents.count,
                    systemImage: "tray.and.arrow.down.fill",
                    color: .indigo,
                    destination: .received
                )

            }
            .listRowSeparator(.hidden)
            .listRowBackground(Color.clear)
            .listRowInsets(
                EdgeInsets(
                    top: 0,
                    leading: DraggableMenuContentLayout.horizontalInset,
                    bottom: 0,
                    trailing: DraggableMenuContentLayout.horizontalInset
                )
            )
        }
    }

    private var scanEventQRCodeButton: some View {
        AppMenuNavigationRow(title: "Scan QR Code", subtitle: NSLocalizedString("Open a shared event or calendar", comment: ""), symbol: "qrcode.viewfinder", color: .blue) { showQRScanner = true }
    }

    private var cloudAccountButton: some View {
        AppMenuNavigationRow(title: "Cloud Calendars account", subtitle: cloudAccountSummary,
            symbol: cloudAccountManager.isSignedIn ? "person.crop.circle.badge.checkmark" : "person.crop.circle.badge.exclamationmark",
            color: cloudAccountManager.isSignedIn ? .green : .blue) { showCloudAccount = true }
    }

    private var cloudAccountSummary: String {
        let count = cloudAccountManager.account?.identities.count ?? 0
        if count == 0 { return NSLocalizedString("Sign in or manage accounts", comment: "") }
        let format = count == 1
            ? NSLocalizedString("%lld connected account", comment: "")
            : NSLocalizedString("%lld connected accounts", comment: "")
        return localizedFormat(format, Int64(count))
    }

    private var webAuthenticatorButton: some View {
        AppMenuNavigationRow(title: "Web Sign-In & Authenticator", subtitle: NSLocalizedString("6-digit security code for cloud-calendars.com", comment: ""), symbol: "key.horizontal.fill", color: .teal) { showWebAuthenticator = true }
    }

    private var cloudAccountView: some View {
        NavigationStack {
            Form {
                Section {
                    CloudAccountSignInContent()
                        .padding(.vertical, 4)
                }
            }
            .navigationTitle("Cloud Calendars account")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                AppSheetToolbarItem(placement: .cancellationAction) {
                    AppToolbarTextButton("Close") {
                        cloudAccountManager.cancelSignIn()
                        showCloudAccount = false
                    }
                }
            }
        }
    }

    private func presentScannedEvent() {
        if let payload = pendingScannedWebAuth {
            pendingScannedWebAuth = nil
            DispatchQueue.main.async {
                scannedWebAuth = payload
            }
        } else if let payload = pendingScannedEvent {
            pendingScannedEvent = nil
            DispatchQueue.main.async {
                scannedEvent = payload
            }
        } else if let payload = pendingScannedCalendar {
            pendingScannedCalendar = nil
            DispatchQueue.main.async {
                scannedCalendar = payload
            }
        }
    }

    private func openPendingInvitationsIfRequested() {
        guard PendingEventInvitationNavigation.consumeOpenRequest() else { return }
        sharedEventsDestination = .pending
    }

    private func sharedEventsNavigationButton(
        title: LocalizedStringKey,
        count: Int,
        systemImage: String,
        color: Color,
        destination: SharedEventsDestination
    ) -> some View {
        AppMenuNavigationRow(title: title, subtitle: sharedEventsCountText(count, destination: destination), symbol: systemImage, color: color,
            badge: destination == .pending ? count : 0) { sharedEventsDestination = destination }
    }

    private func sharedEventsCountText(
        _ count: Int,
        destination: SharedEventsDestination
    ) -> String {
        if destination == .pending {
            let format = count == 1
                ? NSLocalizedString("%lld pending invitation", comment: "")
                : NSLocalizedString("%lld pending invitations", comment: "")
            return localizedFormat(format, Int64(count))
        }
        let format = count == 1
            ? NSLocalizedString("%lld event", comment: "")
            : NSLocalizedString("%lld events", comment: "")
        return localizedFormat(format, Int64(count))
    }

    private func sharedEventsList(_ destination: SharedEventsDestination) -> some View {
        NavigationStack {
            VStack(spacing: 0) {
                CalendarSearchHeader(isSearching: showSharedEventsSearch && destination != .pending,
                                     height: CalendarHeaderLayout.height) {
                    sharedEventsListHeader(destination)
                } search: {
                    CalendarEventSearchField(text: $sharedEventsSearchText) {
                        showSharedEventsSearch = false
                        sharedEventsSearchText = ""
                    }
                }

                sharedEventsListContent(destination)
                    .allowsHitTesting(!isSurfaceFixture)
            }
            .toolbar(.hidden, for: .navigationBar)
            .appSheet(item: $selectedEventAccessTarget) { event in
                SharedEventAccessSheet(event: event)
                    .presentationDetents([.large])
                    .presentationDragIndicator(.visible)
            }
            .appSheet(item: $selectedEventDetails, onDismiss: reloadSharedEvents) { target in
                AppLocalEventEditorView(target: target)
            }
            .appSheet(item: $selectedPendingInvitation, onDismiss: {
                Task { await pendingInvitationManager.refresh() }
            }) { payload in
                SharedEventImportView(payload: payload)
            }
            .appSheet(item: $selectedPendingCalendarInvitation, onDismiss: {
                Task { await pendingInvitationManager.refresh() }
            }) { payload in
                SharedCalendarInvitationView(payload: payload)
            }
            .onAppear {
                showSharedEventsSearch = false
                sharedEventsSearchText = ""
                if destination == .pending && !isSurfaceFixture {
                    Task { await pendingInvitationManager.refresh() }
                }
            }
            .alert(
                "Unable to update invitation",
                isPresented: pendingInvitationErrorIsPresented
            ) {
                Button("OK", role: .cancel) {
                    pendingInvitationErrorMessage = nil
                }
            } message: {
                Text(pendingInvitationErrorMessage ?? NSLocalizedString("Please try again.", comment: "Invitation error fallback"))
            }
        }
    }

    private var pendingInvitationErrorIsPresented: Binding<Bool> {
        Binding(
            get: { pendingInvitationErrorMessage != nil },
            set: { if !$0 { pendingInvitationErrorMessage = nil } }
        )
    }

    private func sharedEventsListHeader(_ destination: SharedEventsDestination) -> some View {
        SharedEventsPageHeader(title: destination.title, close: closeSharedEventsList,
            search: destination == .pending ? nil : { showSharedEventsSearch = true })
    }

    private func closeSharedEventsList() {
        showSharedEventsSearch = false
        sharedEventsSearchText = ""
        sharedEventsDestination = nil
    }

    @ViewBuilder
    private func sharedEventsListContent(_ destination: SharedEventsDestination) -> some View {
        switch destination {
        case .pending:
            if pendingInvitationManager.isLoading
                && displayedInvitationCount == 0 {
                ProgressView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if displayedInvitationCount == 0 {
                sharedEventsEmptyState(
                    title: "No pending invitations.",
                    systemImage: "envelope.open"
                )
            } else {
                PendingInvitationsList {
                    ForEach(displayedCalendarInvitations) { invitation in
                        pendingCalendarInvitationRow(invitation)
                    }
                    ForEach(displayedEventInvitations) { invitation in
                        pendingInvitationRow(invitation)
                    }
                }
                .refreshable {
                    await pendingInvitationManager.refresh()
                }
            }

        case .sent:
            let filtered = sentEvents.filter {
                sharedEventMatchesSearch(
                    title: $0.title,
                    location: $0.location,
                    start: $0.start,
                    end: $0.end,
                    isAllDay: $0.isAllDay
                )
            }
            let groups = groupSharedEvents(filtered, start: { $0.start })

            if groups.isEmpty {
                sharedEventsEmptyState(
                    title: sharedEventsSearchText.isEmpty
                        ? "No shared events yet."
                        : "No matching events.",
                    systemImage: sharedEventsSearchText.isEmpty ? "paperplane" : "magnifyingglass"
                )
            } else {
                List {
                    ForEach(groups) { group in
                        Section {
                            ForEach(group.events) { event in
                                sharedEventRow(
                                    title: event.title,
                                    start: event.start,
                                    end: event.end,
                                    isAllDay: event.isAllDay,
                                    location: event.location,
                                    isCancelled: event.isCancelled == true,
                                    color: sharedEventCalendarColor(
                                        localEventIdentifier: event.localEventIdentifier,
                                        fallback: .blue
                                    ),
                                    optionsAction: {
                                        selectedEventAccessTarget = SharedEventAccessTarget(event)
                                    },
                                    infoAction: {
                                        openSharedDetails(identifier: event.localEventIdentifier, received: false,
                                            readOnly: event.isCancelled == true, remote: event.serverEvent, snapshot: .init(title: event.title,
                                                start: event.start, end: event.end, isAllDay: event.isAllDay,
                                                location: event.location, url: event.serverEvent?.url ?? event.lastUploadedSnapshot?.url,
                                                details: event.serverEvent?.details ?? event.lastUploadedSnapshot?.details))
                                    }
                                )
                            }
                        } header: {
                            SharedEventsDayHeader(day: group.day)
                        }
                    }
                }
                .listStyle(.plain)
            }

        case .received:
            let filtered = receivedEvents.filter {
                sharedEventMatchesSearch(
                    title: $0.title,
                    location: $0.location,
                    start: $0.start,
                    end: $0.end,
                    isAllDay: $0.isAllDay
                )
            }
            let groups = groupSharedEvents(filtered, start: { $0.start })

            if groups.isEmpty {
                sharedEventsEmptyState(
                    title: sharedEventsSearchText.isEmpty
                        ? "No one has shared an event with you yet."
                        : "No matching events.",
                    systemImage: sharedEventsSearchText.isEmpty
                        ? "tray.and.arrow.down"
                        : "magnifyingglass"
                )
            } else {
                List {
                    ForEach(groups) { group in
                        Section {
                            ForEach(group.events) { event in
                                sharedEventRow(
                                    title: event.title,
                                    start: event.start,
                                    end: event.end,
                                    isAllDay: event.isAllDay,
                                    location: event.location,
                                    isCancelled: event.isCancelled,
                                    color: sharedEventCalendarColor(
                                        localEventIdentifier: event.localEventIdentifier,
                                        fallback: .indigo
                                    ),
                                    access: event.access,
                                    accessWasRemoved: event.isRevoked,
                                    optionsAction: event.access == .owner && !event.isRevoked
                                        ? {
                                            selectedEventAccessTarget = SharedEventAccessTarget(event)
                                        }
                                        : nil,
                                    infoAction: {
                                        openSharedDetails(identifier: event.localEventIdentifier, received: true,
                                            readOnly: event.isRevoked || event.isCancelled || event.access == .reader,
                                            snapshot: .init(title: event.title, start: event.start, end: event.end,
                                                isAllDay: event.isAllDay, location: event.location))
                                    }
                                )
                            }
                        } header: {
                            SharedEventsDayHeader(day: group.day)
                        }
                    }
                }
                .listStyle(.plain)
            }
        }
    }

    private func pendingInvitationRow(
        _ invitation: CloudCalendarsAPI.PendingEventInvitation
    ) -> some View {
        PendingEventInvitationRow(invitation: invitation,
            isUpdating: pendingInvitationActionIDs.contains(invitation.id),
            accept: { selectedPendingInvitation = invitation.importPayload },
            decline: { Task { await declinePendingInvitation(invitation) } })
    }

    private func pendingCalendarInvitationRow(
        _ invitation: CloudCalendarsAPI.PendingICloudCalendarInvitation
    ) -> some View {
        PendingCalendarInvitationRow(invitation: invitation,
            isUpdating: pendingInvitationActionIDs.contains("calendar:\(invitation.id)"),
            accept: { selectedPendingCalendarInvitation = invitation.importPayload },
            decline: { Task { await declinePendingCalendarInvitation(invitation) } })
    }

    @MainActor
    private func declinePendingInvitation(
        _ invitation: CloudCalendarsAPI.PendingEventInvitation
    ) async {
        guard !pendingInvitationActionIDs.contains(invitation.id),
              let session = CalendarFeedSession.existing
        else { return }

        pendingInvitationActionIDs.insert(invitation.id)
        defer { pendingInvitationActionIDs.remove(invitation.id) }

        do {
            try await CloudCalendarsAPI.declinePendingEventInvitation(
                eventId: invitation.eventId,
                feedId: invitation.feedId,
                session: session
            )
            pendingInvitationErrorMessage = nil
            await pendingInvitationManager.refresh()
        } catch {
            pendingInvitationErrorMessage = error.localizedDescription
        }
    }

    @MainActor
    private func declinePendingCalendarInvitation(
        _ invitation: CloudCalendarsAPI.PendingICloudCalendarInvitation
    ) async {
        let actionID = "calendar:\(invitation.id)"
        guard !pendingInvitationActionIDs.contains(actionID),
              let session = CalendarFeedSession.existing
        else { return }

        pendingInvitationActionIDs.insert(actionID)
        defer { pendingInvitationActionIDs.remove(actionID) }

        do {
            try await CloudCalendarsAPI.declinePendingICloudCalendarInvitation(
                ownerId: invitation.ownerId,
                calendarId: invitation.calendarId,
                session: session
            )
            pendingInvitationErrorMessage = nil
            await pendingInvitationManager.refresh()
        } catch {
            pendingInvitationErrorMessage = error.localizedDescription
        }
    }

    private func sharedEventsEmptyState(
        title: LocalizedStringKey,
        systemImage: String
    ) -> some View {
        ContentUnavailableView(title, systemImage: systemImage)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private func groupSharedEvents<Item>(
        _ events: [Item],
        start: (Item) -> Date
    ) -> [SharedEventDayGroup<Item>] {
        let grouped = Dictionary(grouping: events) {
            Calendar.current.startOfDay(for: start($0))
        }
        return grouped.keys.sorted().map { day in
            SharedEventDayGroup(day: day, events: grouped[day] ?? [])
        }
    }

    private func openSharedDetails(identifier: String?, received: Bool, readOnly: Bool,
                                   remote: CloudCalendarsAPI.RemoteSharedEvent? = nil, snapshot: SharedEventDetailSnapshot) {
        selectedEventDetails = Self.detailTarget(identifier: identifier, received: received, readOnly: readOnly,
                                                  remote: remote, snapshot: snapshot, eventStore: viewModel.eventStore)
    }

    fileprivate static func detailTarget(identifier: String?, received: Bool, readOnly: Bool,
                                         remote: CloudCalendarsAPI.RemoteSharedEvent?, snapshot: SharedEventDetailSnapshot,
                                         eventStore: EKEventStore, editing: Bool = false) -> AppLocalEventEditorTarget {
        var target: AppLocalEventEditorTarget
        var cloudOnly = false
        let localStore = AppLocalCalendarStore.shared
        if let local = identifier.flatMap(localStore.event(id:)) {
            target = .init(eventID: local.id, startsInEditingMode: editing)
        } else if let identifier, let event = eventStore.event(withIdentifier: identifier) {
            target = .init(eventKitEvent: event, startsInEditingMode: editing)
        } else {
            cloudOnly = true
            var snapshot = snapshot
            snapshot.calendarTitle = remote?.calendarTitle
            target = .init(eventKitEvent: snapshot.displayEvent(in: eventStore),
                           startsInEditingMode: editing)
            target.displaySupplement = snapshot.supplement
            target.readOnly = remote == nil || CalendarFeedSession.existing == nil
        }
        if let remote, let session = CalendarFeedSession.existing {
            target.sharedSource = .init(event: remote, received: received, session: session, usesServerRecord: cloudOnly)
        }
        target.readOnly = target.readOnly || readOnly
        return target
    }

    private func sharedEventCalendarColor(
        localEventIdentifier: String?,
        fallback: Color
    ) -> Color {
        if let id = localEventIdentifier, let local = AppLocalCalendarStore.shared.event(id: id),
           let calendar = AppLocalCalendarStore.shared.calendar(id: local.calendarID) {
            return Color(uiColor: AppLocalCalendarStore.color(calendar.displayColorHex))
        }
        guard let localEventIdentifier,
              let event = viewModel.eventStore.event(withIdentifier: localEventIdentifier),
              let calendarColor = event.calendar.cgColor
        else { return fallback }

        return Color(uiColor: UIColor(cgColor: calendarColor))
    }

    private func sharedEventMatchesSearch(
        title: String,
        location: String?,
        start: Date,
        end: Date,
        isAllDay: Bool
    ) -> Bool {
        let query = sharedEventsSearchText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !query.isEmpty else { return true }

        return title.localizedCaseInsensitiveContains(query)
            || location?.localizedCaseInsensitiveContains(query) == true
            || eventDateText(start: start, end: end, isAllDay: isAllDay)
                .localizedCaseInsensitiveContains(query)
    }


    private func sharedEventRow(
        title: String,
        start: Date,
        end: Date,
        isAllDay: Bool,
        location: String?,
        isCancelled: Bool,
        color: Color,
        access: CloudCalendarsAPI.EventAccess? = nil,
        accessWasRemoved: Bool = false,
        optionsAction: (() -> Void)? = nil,
        infoAction: (() -> Void)? = nil
    ) -> some View {
        SharedEventPresentationRow(title: title, start: start, end: end, isAllDay: isAllDay,
            location: location, isCancelled: isCancelled, color: color, access: access,
            accessWasRemoved: accessWasRemoved, optionsAction: optionsAction, infoAction: infoAction)
    }

    #if DEBUG
    /// The actual full-screen list, with in-memory data only. No tracker,
    /// invitation, EventKit or backend records are written for screenshots.
    init(eventSurfaceDestination: String) {
        bottomContentInset = 0
        isSurfaceFixture = true
        _sharedEventsDestination = State(initialValue: SharedEventsDestination(rawValue: eventSurfaceDestination))
        let start = Date().addingTimeInterval(3600)
        let titles = ["Product Launch Planning", "Local Project Review", "Team Retrospective"]
        _sentEvents = State(initialValue: titles.enumerated().map { index, title in
            SharedOutgoingEventTracker.SentEvent(eventID: "surface-\(index)", title: title,
                start: start.addingTimeInterval(Double(index) * 5400),
                end: start.addingTimeInterval(Double(index) * 5400 + 3600), isAllDay: false,
                location: index == 0 ? "Apple Park Visitor Center" : "Meeting room", sharedAt: start)
        })
        _receivedEvents = State(initialValue: titles.enumerated().map { index, title in
            ReceivedSharedEvent(id: "surface-\(index)", feedID: "surface-preview", localEventIdentifier: "surface-preview-\(index)",
                title: title, start: start.addingTimeInterval(Double(index) * 5400),
                end: start.addingTimeInterval(Double(index) * 5400 + 3600), isAllDay: false,
                location: index == 0 ? "Apple Park Visitor Center" : "Meeting room",
                isCancelled: index == 2, isRevoked: false, access: index == 0 ? .writer : .reader)
        })
    }

    private static var surfaceInvitations: [CloudCalendarsAPI.PendingEventInvitation] {
        let start = Calendar.current.date(bySettingHour: 18, minute: 0, second: 0, of: Date())!
        let formatter = ISO8601DateFormatter()
        return ["Product Launch Planning", "Local Project Review"].enumerated().map { index, title in
            CloudCalendarsAPI.PendingEventInvitation(id: "surface-\(index)", eventId: "surface-preview", feedId: "surface-preview",
                title: title, start: formatter.string(from: start.addingTimeInterval(Double(index) * 5400)),
                end: formatter.string(from: start.addingTimeInterval(Double(index) * 5400 + 3600)), allDay: false,
                location: "Apple Park Visitor Center", access: index == 0 ? .writer : .reader, invitedAt: nil,
                senderName: "Alex", senderEmail: "alex@example.com", eventUrl: "", color: "#0A84FF")
        }
    }

    func eventSurfaceSharedRow(start: Date) -> some View {
        sharedEventRow(title: "Product Launch Planning", start: start, end: start.addingTimeInterval(5400),
            isAllDay: false, location: "Apple Park Visitor Center, Cupertino", isCancelled: false,
            color: .blue, access: .writer, optionsAction: {}, infoAction: {})
    }
    func eventSurfacePendingRow(start: Date, url: URL) -> some View {
        let formatter = ISO8601DateFormatter()
        return pendingInvitationRow(CloudCalendarsAPI.PendingEventInvitation(id: "preview", eventId: "preview", feedId: "preview",
            title: "Product Launch Planning", start: formatter.string(from: start),
            end: formatter.string(from: start.addingTimeInterval(5400)), allDay: false,
            location: "Apple Park Visitor Center, Cupertino", access: .writer, invitedAt: nil,
            senderName: "Alex", senderEmail: "alex@example.com", eventUrl: url.absoluteString, color: "#0A84FF"))
    }
    #endif

    private func emptyRow(title: LocalizedStringKey, systemImage: String) -> some View {
        Label {
            Text(title)
        } icon: {
            Image(systemName: systemImage)
                .frame(width: 28, height: 28)
        }
        .foregroundStyle(.secondary)
        .padding(.vertical, 4)
    }

    private func eventDateText(start: Date, end: Date, isAllDay: Bool) -> String {
        let date = appShortDateFormatter()
        let time = appTimeFormatter()
        if isAllDay {
            return "\(date.string(from: start)) · \(NSLocalizedString("all-day", comment: "All day event"))"
        }

        if Calendar.current.isDate(start, inSameDayAs: end) {
            return "\(date.string(from: start)), \(time.string(from: start)) – \(time.string(from: end))"
        }

        return "\(date.string(from: start)) \(time.string(from: start)) – \(date.string(from: end)) \(time.string(from: end))"
    }

    private func reloadSharedEvents() {
        guard !isSurfaceFixture else { return }
        sentEvents = SharedOutgoingEventTracker.sentEvents(in: viewModel.eventStore)
            .sorted {
                if $0.start == $1.start { return $0.end < $1.end }
                return $0.start < $1.start
            }

        receivedEvents = SharedInviteTracker.tracked().values.compactMap { invite in
            if let record = AppLocalCalendarStore.shared.event(id: invite.localEventIdentifier) {
                return ReceivedSharedEvent(id: invite.eventID, feedID: invite.feedID, localEventIdentifier: record.id,
                    title: record.title, start: record.startDate, end: record.endDate, isAllDay: record.isAllDay,
                    location: record.location, isCancelled: invite.shouldAppearStruckThrough,
                    isRevoked: invite.isRevoked == true, access: invite.effectiveAccess)
            }
            guard let event = viewModel.eventStore.event(withIdentifier: invite.localEventIdentifier),
                  let start = event.startDate,
                  let end = event.endDate
            else { return nil }

            return ReceivedSharedEvent(
                id: invite.eventID,
                feedID: invite.feedID,
                localEventIdentifier: invite.localEventIdentifier,
                title: event.title ?? NSLocalizedString("Shared event", comment: "Fallback shared event title"),
                start: start,
                end: end,
                isAllDay: event.isAllDay,
                location: event.location,
                isCancelled: invite.shouldAppearStruckThrough,
                isRevoked: invite.isRevoked == true,
                access: invite.effectiveAccess
            )
        }
        .sorted {
            if $0.start == $1.start { return $0.end < $1.end }
            return $0.start < $1.start
        }
    }

}

private struct SharedEventAccessSheet: View {
    let event: SharedEventAccessTarget

    @Environment(\.dismiss) private var dismiss
    @State private var recipients: [CloudCalendarsAPI.EventRecipient] = []
    @State private var originalRecipients: [CloudCalendarsAPI.EventRecipient] = []
    @State private var removedRecipientIDs: Set<String> = []
    @State private var isLoading = true
    @State private var isSaving = false
    @State private var resendingRecipientIDs: Set<String> = []
    @State private var recipientPendingRemoval: CloudCalendarsAPI.EventRecipient?
    @State private var errorMessage: String?
    @State private var showEventEditor = false
    @State private var refreshedSource: CloudCalendarsAPI.RemoteSharedEvent?

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(event.title)
                            .font(.headline)
                        Text("Choose Reader, Writer, or Owner. Owners can also share this event and manage access.")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 3)
                }

                Section("People with this event") {
                    if isLoading {
                        HStack {
                            Spacer()
                            ProgressView()
                            Spacer()
                        }
                    } else if recipients.isEmpty {
                        ContentUnavailableView(
                            "No recipients yet",
                            systemImage: "person.2.slash",
                            description: Text("People appear here after they add the event.")
                        )
                    } else {
                        ForEach(recipients) { recipient in
                            recipientRow(recipient)
                        }
                    }
                }

                if let errorMessage {
                    Section {
                        Label(errorMessage, systemImage: "exclamationmark.triangle.fill")
                            .foregroundStyle(.red)
                    }
                }
            }
            .disabled(isSaving)
            .navigationTitle("Event Access")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                AppSheetToolbarItem(placement: .topBarLeading) {
                    AppSheetHeaderIconGroup {
                    Button { showEventEditor = true } label: {
                        Image(systemName: "pencil")
                    }
                    .accessibilityLabel("Edit Event")
                    .disabled(editorTarget == nil || isSaving)

                    Button {
                        guard let target = editorTarget else { return }
                        if let remote = target.sharedSource {
                            EventAppClipSharing.presentConfirmed(remote, event: target.eventKitEvent)
                        } else if let id = target.eventID, let local = AppLocalCalendarStore.shared.event(id: id) {
                            EventAppClipSharing.present(for: AppLocalEventDescriptor(eventID: id, partialStart: local.startDate, partialEnd: local.endDate))
                        } else if let local = target.eventKitEvent {
                            EventAppClipSharing.present(for: local)
                        }
                    } label: {
                        Image(systemName: "square.and.arrow.up")
                    }
                    .accessibilityLabel("Share Event")
                    .disabled(editorTarget == nil || isSaving)
                    }
                }
                AppSheetToolbarItem(placement: .confirmationAction) {
                    AppToolbarTextButton("Done") { dismiss() }
                    .disabled(isLoading || isSaving)
                }
            }
            .task { await loadRecipients() }
            .onReceive(NotificationCenter.default.publisher(for: .sharedEventsTrackingChanged)) { _ in
                if event.remote != nil { refreshedSource = SharedOutgoingEventTracker.sentEvent(id: event.eventID)?.serverEvent }
            }
            .onReceive(
                NotificationCenter.default.publisher(for: .sharedEventRecipientsChanged)
            ) { notification in
                guard notification.object as? String == event.eventID else { return }
                Task { await loadRecipients() }
            }
            .interactiveDismissDisabled(isSaving)
            .confirmationDialog(
                "Remove Access?",
                isPresented: removalDialogIsPresented,
                titleVisibility: .visible,
                presenting: recipientPendingRemoval
            ) { recipient in
                Button("Remove Access", role: .destructive) {
                    removeAccess(from: recipient)
                }
                Button("Cancel", role: .cancel) {}
            } message: { recipient in
                Text(recipient.displayEmail)
            }
            .appSheet(isPresented: $showEventEditor) {
                if let editorTarget {
                    AppLocalEventEditorView(target: editorTarget) {
                        showEventEditor = false
                        SharedEventSyncManager.eventStoreDidChange()
                        NotificationCenter.default.post(
                            name: .sharedEventsTrackingChanged,
                            object: nil
                        )
                    }
                }
            }
        }
    }

    private var editorTarget: AppLocalEventEditorTarget? {
        guard !event.cancelled else { return nil }
        let store = CalendarViewModel.shared.eventStore
        if let remote = refreshedSource ?? event.remote, !remote.isCancelled, let start = remote.startDate, let end = remote.endDate {
            return SharingSheetView.detailTarget(identifier: event.localEventIdentifier,
                received: false, readOnly: false, remote: remote,
                snapshot: .init(title: remote.title, start: start, end: end, isAllDay: remote.allDay,
                    location: remote.location, url: remote.url, details: remote.details),
                eventStore: store, editing: true)
        }
        guard let id = event.localEventIdentifier else { return nil }
        if let local = AppLocalCalendarStore.shared.event(id: id) { return .init(eventID: local.id, startsInEditingMode: true) }
        return store.event(withIdentifier: id).map { .init(eventKitEvent: $0, startsInEditingMode: true) }
    }

    private func recipientRow(_ recipient: CloudCalendarsAPI.EventRecipient) -> some View {
        let providers = recipient.isAnonymous
            ? NSLocalizedString("Not signed in", comment: "")
            : recipient.isPendingInvitation
                ? NSLocalizedString("Invitation pending", comment: "")
                : recipient.identities.map { $0.provider.capitalized }.joined(separator: ", ")

        return HStack(alignment: .top, spacing: 10) {
            Image(systemName: "person.crop.circle.fill")
                .font(.title2)
                .foregroundStyle(.blue)
                .padding(.top, 2)

            VStack(alignment: .leading, spacing: 2) {
                Text(recipient.displayEmail)
                    .font(.body.weight(.medium))
                    .lineLimit(1)
                    .truncationMode(.middle)

                if !providers.isEmpty {
                    Text(providers)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                if recipient.isPendingInvitation {
                    if resendingRecipientIDs.contains(recipient.id) {
                        ProgressView()
                            .controlSize(.small)
                            .frame(height: 20)
                    } else {
                        Button {
                            Task { await resendInvitation(to: recipient) }
                        } label: {
                            HStack(spacing: 4) {
                                Image(systemName: "arrow.clockwise")
                                Text("Resend")
                            }
                            .font(.caption.weight(.semibold))
                            .padding(.vertical, 2)
                        }
                        .buttonStyle(.borderless)
                        .fixedSize(horizontal: true, vertical: true)
                        .disabled(!canResendInvitation)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            HStack(alignment: .center, spacing: 7) {
                if recipient.belongsToOriginalOwner {
                    HStack(spacing: 5) {
                        Image(systemName: "lock.fill")
                            .font(.caption)
                        Text(CloudCalendarsAPI.EventAccess.owner.title)
                    }
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: true, vertical: true)
                    .accessibilityLabel("Original sharer, Owner access")
                } else if recipient.isAnonymous {
                    Text(CloudCalendarsAPI.EventAccess.reader.title)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.secondary)
                        .frame(minWidth: 64, alignment: .trailing)
                        .fixedSize(horizontal: true, vertical: true)
                } else {
                    Menu {
                        accessButton(.reader, recipient: recipient)
                        accessButton(.writer, recipient: recipient)
                        accessButton(.owner, recipient: recipient)
                    } label: {
                        HStack(spacing: 5) {
                            Text(recipient.access.title)
                                .foregroundStyle(.secondary)
                            Image(systemName: "chevron.up.chevron.down")
                                .font(.caption2.weight(.bold))
                        }
                        .font(.subheadline.weight(.semibold))
                        .frame(minWidth: 68, alignment: .trailing)
                        .fixedSize(horizontal: true, vertical: true)
                    }
                    .buttonStyle(.borderless)
                    .fixedSize(horizontal: true, vertical: true)
                }

                if !recipient.belongsToOriginalOwner {
                    Button(role: .destructive) {
                        recipientPendingRemoval = recipient
                    } label: {
                        Image(systemName: "person.crop.circle.badge.minus")
                            .font(.body)
                            .foregroundStyle(.red)
                            .frame(width: 28, height: 28)
                    }
                    .buttonStyle(.borderless)
                    .disabled(isSaving)
                    .accessibilityLabel("Remove Access")
                }
            }
            .fixedSize(horizontal: true, vertical: true)
            .layoutPriority(2)
        }
        .fixedSize(horizontal: false, vertical: true)
        .listRowInsets(EdgeInsets(top: 6, leading: 16, bottom: 6, trailing: 16))
    }

    @ViewBuilder
    private func accessButton(
        _ access: CloudCalendarsAPI.EventAccess,
        recipient: CloudCalendarsAPI.EventRecipient
    ) -> some View {
        Button {
            changeAccess(access, for: recipient)
        } label: {
            if recipient.access == access {
                Label(access.title, systemImage: "checkmark")
            } else {
                Text(access.title)
            }
        }
    }

    @MainActor
    private func loadRecipients() async {
        defer { isLoading = false }
        guard let session = CalendarFeedSession.existing else {
            errorMessage = NSLocalizedString("Sign in to manage event access.", comment: "")
            return
        }
        do {
            let loaded = try await CloudCalendarsAPI.eventRecipients(
                eventId: event.eventID,
                session: session
            )
            recipients = loaded
            originalRecipients = loaded
            removedRecipientIDs = []
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    @MainActor
    private func changeAccess(
        _ access: CloudCalendarsAPI.EventAccess,
        for recipient: CloudCalendarsAPI.EventRecipient
    ) {
        guard !recipient.belongsToOriginalOwner,
              let index = recipients.firstIndex(where: { $0.id == recipient.id }),
              recipients[index].access != access
        else { return }
        recipients[index].access = access
        Task { await persistChanges() }
    }

    @MainActor
    private func removeAccess(from recipient: CloudCalendarsAPI.EventRecipient) {
        guard !recipient.belongsToOriginalOwner else { return }
        removedRecipientIDs.insert(recipient.id)
        recipients.removeAll { $0.id == recipient.id }
        recipientPendingRemoval = nil
        Task { await persistChanges() }
    }

    private var removalDialogIsPresented: Binding<Bool> {
        Binding(
            get: { recipientPendingRemoval != nil },
            set: { if !$0 { recipientPendingRemoval = nil } }
        )
    }

    private var hasPendingChanges: Bool {
        guard removedRecipientIDs.isEmpty else { return true }
        let originalAccess = Dictionary(
            uniqueKeysWithValues: originalRecipients.map { ($0.id, $0.access) }
        )
        return recipients.contains { originalAccess[$0.id] != $0.access }
    }

    @MainActor
    private func persistChanges() async {
        guard !isSaving else { return }
        guard hasPendingChanges else { return }
        guard let session = CalendarFeedSession.existing else {
            recipients = originalRecipients
            removedRecipientIDs = []
            errorMessage = NSLocalizedString("Sign in to manage event access.", comment: "")
            return
        }

        let originalAccess = Dictionary(
            uniqueKeysWithValues: originalRecipients.map { ($0.id, $0.access) }
        )
        let changedAccess = Dictionary(
            uniqueKeysWithValues: recipients.compactMap { recipient in
                originalAccess[recipient.id] == recipient.access
                    ? nil
                    : (recipient.id, recipient.access)
            }
        )

        isSaving = true
        errorMessage = nil
        defer { isSaving = false }
        do {
            let saved = try await CloudCalendarsAPI.saveEventRecipientChanges(
                eventId: event.eventID,
                accessByRecipientID: changedAccess,
                removedRecipientIDs: removedRecipientIDs,
                session: session
            )
            recipients = saved
            originalRecipients = saved
            removedRecipientIDs = []
            NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
        } catch {
            recipients = originalRecipients
            removedRecipientIDs = []
            errorMessage = error.localizedDescription
        }
    }

    private func invitationURL(feedID: String) -> URL? {
        guard let target = editorTarget else { return nil }
        if let local = target.eventKitEvent {
            return EventAppClipSharing.invocationURL(for: local, feedID: feedID, shareID: event.eventID)
        }
        guard let id = target.eventID, let local = AppLocalCalendarStore.shared.event(id: id) else { return nil }
        let snapshot = SharedEventDetailSnapshot(title: local.title, start: local.startDate, end: local.endDate,
            isAllDay: local.isAllDay, location: local.location, url: local.urlString)
        return EventAppClipSharing.invocationURL(for: snapshot.displayEvent(in: CalendarViewModel.shared.eventStore),
                                                feedID: feedID, shareID: event.eventID)
    }

    private var canResendInvitation: Bool {
        event.feedID != nil && editorTarget != nil
    }

    @MainActor
    private func resendInvitation(to recipient: CloudCalendarsAPI.EventRecipient) async {
        let persistedRecipient = originalRecipients.first(where: { $0.id == recipient.id }) ?? recipient
        guard persistedRecipient.isPendingInvitation,
              let email = persistedRecipient.emails.first,
              let feedID = event.feedID,
              let url = invitationURL(feedID: feedID),
              let session = CalendarFeedSession.existing
        else { return }

        resendingRecipientIDs.insert(recipient.id)
        defer { resendingRecipientIDs.remove(recipient.id) }
        do {
            _ = try await CloudCalendarsAPI.inviteEventRecipients(
                eventId: event.eventID,
                eventURL: url,
                invitations: [.init(email: email, access: persistedRecipient.access)],
                session: session
            )
            errorMessage = nil
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
