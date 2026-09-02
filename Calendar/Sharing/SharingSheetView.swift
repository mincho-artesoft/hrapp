import Combine
import EventKit
import EventKitUI
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

    var id: String { eventID }

    init(_ event: SharedOutgoingEventTracker.SentEvent) {
        eventID = event.eventID
        feedID = event.feedID
        localEventIdentifier = event.localEventIdentifier
        title = event.title
    }

    init(_ event: ReceivedSharedEvent) {
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

    @State private var showBookingSetup = false
    @State private var showCloudAccount = false
    @State private var sentEvents: [SharedOutgoingEventTracker.SentEvent] = []
    @State private var receivedEvents: [ReceivedSharedEvent] = []
    @State private var selectedEventAccessTarget: SharedEventAccessTarget?
    @State private var selectedReceivedEvent: EKEvent?
    @State private var selectedPendingInvitation: SharedEventImportPayload?
    @State private var pendingInvitationActionIDs: Set<String> = []
    @State private var pendingInvitationErrorMessage: String?
    @State private var sharedEventsDestination: SharedEventsDestination?
    @State private var showSharedEventsSearch = false
    @State private var sharedEventsSearchText = ""
    @State private var showQRScanner = false
    @State private var pendingScannedEvent: SharedEventImportPayload?
    @State private var pendingScannedCalendar: SharedCalendarInvitationPayload?
    @State private var scannedEvent: SharedEventImportPayload?
    @State private var scannedCalendar: SharedCalendarInvitationPayload?

    private let expiryRefreshTimer = Timer.publish(
        every: 60,
        on: .main,
        in: .common
    ).autoconnect()

    private let bottomContentInset: CGFloat

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
        .scrollContentBackground(.hidden)
        .background(Color.clear)
        .listRowBackground(Color.clear)
        .onAppear {
            viewModel.reloadCalendars()
            reloadSharedEvents()
            openPendingInvitationsIfRequested()
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
        .onReceive(NotificationCenter.default.publisher(for: .cloudAccountChanged)) { _ in
            Task { await pendingInvitationManager.refresh() }
        }
        .sheet(isPresented: $showBookingSetup) {
            BookingSetupView()
        }
        .fullScreenCover(isPresented: $showCloudAccount) {
            cloudAccountView
        }
        .fullScreenCover(isPresented: $showQRScanner, onDismiss: presentScannedEvent) {
            SharedEventQRScannerView { share in
                switch share {
                case .event(let payload):
                    pendingScannedEvent = payload
                case .calendar(let payload):
                    pendingScannedCalendar = payload
                }
            }
        }
        .sheet(item: $scannedEvent) { payload in
            SharedEventImportView(payload: payload)
        }
        .sheet(item: $scannedCalendar) { payload in
            SharedCalendarInvitationView(payload: payload)
        }
        .fullScreenCover(item: $sharedEventsDestination) { destination in
            sharedEventsList(destination)
        }
    }

    private var sharingNavigationSection: some View {
        Section {
            scanEventQRCodeButton

            cloudAccountButton

            sharedEventsNavigationButton(
                title: "Pending invitations",
                count: pendingInvitationManager.invitations.count,
                systemImage: "envelope.badge.fill",
                color: .orange,
                destination: .pending
            )

            sharedEventsNavigationButton(
                title: "Shared by me",
                count: sentEvents.count,
                systemImage: "paperplane.fill",
                color: .blue,
                destination: .sent
            )

            sharedEventsNavigationButton(
                title: "Shared with me",
                count: receivedEvents.count,
                systemImage: "tray.and.arrow.down.fill",
                color: .indigo,
                destination: .received
            )

            // Temporarily hidden. Keep the booking flow implemented so this
            // can be restored without rebuilding the feature.
            // bookingButton

            // Booking footer hidden together with the button:
            // "Let people book your open times. Meetings land on the calendar
            // you choose, and your busy times keep those slots free."
        }
    }

    private var scanEventQRCodeButton: some View {
        Button { showQRScanner = true } label: {
            HStack(spacing: 12) {
                Image(systemName: "qrcode.viewfinder")
                    .font(.body.weight(.semibold))
                    .foregroundStyle(.blue)
                    .frame(width: 38, height: 38)
                    .background(Color.blue.opacity(0.12), in: RoundedRectangle(cornerRadius: 10))

                VStack(alignment: .leading, spacing: 2) {
                    Text("Scan QR Code")
                        .font(.body.weight(.semibold))
                        .foregroundStyle(.primary)
                    Text("Open a shared event or calendar")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Spacer(minLength: 8)

                Image(systemName: "chevron.right")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(.tertiary)
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private var cloudAccountButton: some View {
            Button {
                showCloudAccount = true
            } label: {
                HStack(spacing: 12) {
                    Image(systemName: cloudAccountManager.isSignedIn
                          ? "person.crop.circle.badge.checkmark"
                          : "person.crop.circle.badge.exclamationmark")
                        .font(.body.weight(.semibold))
                        .foregroundStyle(cloudAccountManager.isSignedIn ? .green : .blue)
                        .frame(width: 38, height: 38)
                        .background(
                            (cloudAccountManager.isSignedIn ? Color.green : Color.blue).opacity(0.12),
                            in: RoundedRectangle(cornerRadius: 10)
                        )

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Cloud Calendars account")
                            .font(.body.weight(.semibold))
                            .foregroundStyle(.primary)
                        Text(cloudAccountSummary)
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }

                    Spacer(minLength: 8)

                    Image(systemName: "chevron.right")
                        .font(.footnote.weight(.semibold))
                        .foregroundStyle(.tertiary)
                }
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
    }

    private var cloudAccountSummary: String {
        let count = cloudAccountManager.account?.identities.count ?? 0
        if count == 0 { return "Sign in or manage accounts" }
        return count == 1 ? "1 connected account" : "\(count) connected accounts"
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
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { showCloudAccount = false }
                }
            }
        }
    }

    private func presentScannedEvent() {
        if let payload = pendingScannedEvent {
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
        Button {
            sharedEventsDestination = destination
        } label: {
            HStack(spacing: 12) {
                Image(systemName: systemImage)
                    .font(.body.weight(.semibold))
                    .foregroundStyle(color)
                    .frame(width: 38, height: 38)
                    .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: 10))

                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.body.weight(.semibold))
                        .foregroundStyle(.primary)
                    Text(sharedEventsCountText(count, destination: destination))
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Spacer(minLength: 8)

                if destination == .pending, count > 0 {
                    Text(verbatim: "\(count)")
                        .font(.caption2.weight(.bold))
                        .foregroundStyle(.white)
                        .lineLimit(1)
                        .minimumScaleFactor(0.65)
                        .frame(width: 26, height: 26)
                        .background(color, in: Circle())
                        .accessibilityLabel("\(count) pending invitations")
                }

                Image(systemName: "chevron.right")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(.tertiary)
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func sharedEventsCountText(
        _ count: Int,
        destination: SharedEventsDestination
    ) -> String {
        if destination == .pending {
            return count == 1 ? "1 pending invitation" : "\(count) pending invitations"
        }
        return count == 1 ? "1 upcoming event" : "\(count) upcoming events"
    }

    private func sharedEventsList(_ destination: SharedEventsDestination) -> some View {
        NavigationStack {
            VStack(spacing: 0) {
                if showSharedEventsSearch, destination != .pending {
                    CalendarEventSearchField(text: $sharedEventsSearchText) {
                        showSharedEventsSearch = false
                        sharedEventsSearchText = ""
                    }
                    .transition(.move(edge: .top))
                } else {
                    sharedEventsListHeader(destination)
                }

                sharedEventsListContent(destination)
            }
            .animation(.easeInOut, value: showSharedEventsSearch)
            .toolbar(.hidden, for: .navigationBar)
            .sheet(item: $selectedEventAccessTarget) { event in
                SharedEventAccessSheet(event: event)
                    .presentationDetents([.large])
                    .presentationDragIndicator(.visible)
            }
            .sheet(item: $selectedReceivedEvent, onDismiss: reloadSharedEvents) { event in
                EventDetailViewWrapper(event: event)
            }
            .sheet(item: $selectedPendingInvitation, onDismiss: {
                Task { await pendingInvitationManager.refresh() }
            }) { payload in
                SharedEventImportView(payload: payload)
            }
            .onAppear {
                showSharedEventsSearch = false
                sharedEventsSearchText = ""
                if destination == .pending {
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
                Text(pendingInvitationErrorMessage ?? "Please try again.")
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
        HStack(spacing: 0) {
            Button {
                closeSharedEventsList()
            } label: {
                Text(LocalizedStringKey("Close"))
                    .font(.body)
                    .foregroundStyle(.blue)
            }
            .buttonStyle(.plain)
            .frame(width: 72, alignment: .leading)

            Text(destination.title)
                .font(.headline)
                .lineLimit(1)
                .frame(maxWidth: .infinity)

            if destination == .pending {
                Color.clear
                    .frame(width: 72, height: CalendarSearchAppearance.buttonSize)
                    .accessibilityHidden(true)
            } else {
                Button {
                    showSharedEventsSearch = true
                } label: {
                    Image(uiImage: CalendarSearchAppearance.iconImage)
                        .renderingMode(.template)
                        .foregroundStyle(.blue)
                }
                .frame(
                    width: CalendarSearchAppearance.buttonSize,
                    height: CalendarSearchAppearance.buttonSize
                )
                .contentShape(Rectangle())
                .buttonStyle(.plain)
                .frame(width: 72, alignment: .trailing)
                .accessibilityLabel("Search events")
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
        .padding(.bottom, 8)
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
                && pendingInvitationManager.invitations.isEmpty {
                ProgressView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if pendingInvitationManager.invitations.isEmpty {
                sharedEventsEmptyState(
                    title: "No pending invitations.",
                    systemImage: "envelope.open"
                )
            } else {
                List {
                    ForEach(pendingInvitationManager.invitations) { invitation in
                        pendingInvitationRow(invitation)
                    }
                }
                .listStyle(.plain)
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
                                    }
                                )
                            }
                        } header: {
                            sharedEventsDayHeader(group.day)
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
                                        selectedReceivedEvent = viewModel.eventStore.event(
                                            withIdentifier: event.localEventIdentifier
                                        )
                                    }
                                )
                            }
                        } header: {
                            sharedEventsDayHeader(group.day)
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
        let isUpdating = pendingInvitationActionIDs.contains(invitation.id)

        return VStack(alignment: .leading, spacing: 7) {
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Text(invitation.title)
                    .font(.body.weight(.semibold))
                    .lineLimit(2)

                Spacer(minLength: 8)

                Text(invitation.access.title)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(invitation.access == .writer ? Color.green : Color.secondary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(.thinMaterial, in: Capsule())
                    .fixedSize()
            }

            Text("From \(invitation.senderName)")
                .font(.footnote)
                .foregroundStyle(.secondary)

            if let start = invitation.startDate,
               let end = invitation.endDate {
                Text(eventDateText(
                    start: start,
                    end: end,
                    isAllDay: invitation.allDay
                ))
                .font(.footnote)
                .foregroundStyle(.secondary)
            }

            if let location = invitation.location, !location.isEmpty {
                Label(location, systemImage: "location")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            }

            HStack(spacing: 10) {
                Button(role: .destructive) {
                    Task { await declinePendingInvitation(invitation) }
                } label: {
                    Text("Decline")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.bordered)
                .tint(.red)

                Button {
                    selectedPendingInvitation = invitation.importPayload
                } label: {
                    Text("Accept")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .disabled(invitation.importPayload == nil)
            }
            .controlSize(.small)
            .disabled(isUpdating)
        }
        .padding(.vertical, 6)
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

    private func sharedEventsDayHeader(_ date: Date) -> some View {
        let calendar = Calendar.current
        let includesYear = calendar.component(.year, from: date)
            != calendar.component(.year, from: Date())
        let title = appShortDateFormatter(
            includesYear: includesYear,
            includesWeekday: true,
            usesFullWeekday: true
        ).string(from: date).uppercased()

        return Text(title)
            .font(.headline)
            .foregroundStyle(calendar.isDateInToday(date) ? Color.red : Color.secondary)
            .padding(.bottom, 4)
            .textCase(nil)
    }

    private func sharedEventCalendarColor(
        localEventIdentifier: String?,
        fallback: Color
    ) -> Color {
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

    private var bookingButton: some View {
        Button {
            showBookingSetup = true
        } label: {
            HStack(spacing: 12) {
                Image(systemName: "calendar.badge.clock")
                    .font(.body.weight(.semibold))
                    .foregroundStyle(Color.blue)
                    .frame(width: 38, height: 38)
                    .background(Color.blue.opacity(0.12), in: RoundedRectangle(cornerRadius: 10))

                Text(LocalizedStringKey("Set up a booking page"))
                    .font(.body.weight(.semibold))
                    .foregroundStyle(.primary)
                    .frame(minHeight: 38)

                Spacer(minLength: 8)

                Image(systemName: "chevron.right")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(.tertiary)
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
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
        HStack(alignment: .top, spacing: 8) {
            Rectangle()
                .fill(color)
                .frame(width: 3)
                .clipShape(Capsule())

            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(.body)
                    .strikethrough(isCancelled, color: color)
                    .foregroundStyle(.primary)

                if let location, !location.isEmpty {
                    Label(location, systemImage: "location")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }

            Spacer(minLength: 8)

            VStack(alignment: .trailing, spacing: 5) {
                if isAllDay {
                    Text(LocalizedStringKey("all-day"))
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                } else {
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(start.formatted(date: .omitted, time: .shortened))
                        Text(end.formatted(date: .omitted, time: .shortened))
                    }
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                }

                if accessWasRemoved {
                    Text(LocalizedStringKey("Access removed"))
                        .font(.footnote.weight(.semibold))
                        .foregroundStyle(Color.red)
                        .fixedSize()
                        .accessibilityLabel("Event access removed")
                } else if let access {
                    Text(access.title)
                        .font(.footnote.weight(.semibold))
                        .foregroundStyle(access == .writer ? Color.green : Color.secondary)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(.thinMaterial, in: Capsule())
                        .fixedSize()
                        .accessibilityLabel("Event access: \(access.title)")
                }

                HStack(spacing: 2) {
                    if let optionsAction {
                        Button(action: optionsAction) {
                            Image(systemName: "person.2.fill")
                                .font(.body.weight(.semibold))
                                .frame(width: 30, height: 30)
                        }
                        .buttonStyle(.borderless)
                        .accessibilityLabel("Manage event access")
                    }

                    if let infoAction {
                        Button(action: infoAction) {
                            Image(systemName: "info.circle")
                                .font(.body.weight(.semibold))
                                .frame(width: 30, height: 30)
                        }
                        .buttonStyle(.borderless)
                        .accessibilityLabel("Event details")
                    }
                }
            }
        }
        .padding(.vertical, 6)
        .contentShape(Rectangle())
    }

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
        if isAllDay {
            return start.formatted(date: .abbreviated, time: .omitted)
        }

        if Calendar.current.isDate(start, inSameDayAs: end) {
            let date = start.formatted(date: .abbreviated, time: .omitted)
            let startTime = start.formatted(date: .omitted, time: .shortened)
            let endTime = end.formatted(date: .omitted, time: .shortened)
            return "\(date), \(startTime) – \(endTime)"
        }

        return "\(start.formatted(date: .abbreviated, time: .shortened)) – \(end.formatted(date: .abbreviated, time: .shortened))"
    }

    private func reloadSharedEvents() {
        let now = Date()

        sentEvents = SharedOutgoingEventTracker.sentEvents(in: viewModel.eventStore)
            .filter { $0.end > now }
            .sorted {
                if $0.start == $1.start { return $0.end < $1.end }
                return $0.start < $1.start
            }

        receivedEvents = SharedInviteTracker.tracked().values.compactMap { invite in
            guard let event = viewModel.eventStore.event(withIdentifier: invite.localEventIdentifier),
                  let start = event.startDate,
                  let end = event.endDate,
                  end > now
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

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(editableEvent?.title ?? event.title)
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
            .navigationTitle("Event Access")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItemGroup(placement: .cancellationAction) {
                    Button { showEventEditor = true } label: {
                        Image(systemName: "pencil")
                    }
                    .accessibilityLabel("Edit Event")
                    .disabled(editableEvent == nil || hasUnsavedChanges || isSaving)

                    Button {
                        guard let editableEvent else { return }
                        EventAppClipSharing.present(for: editableEvent)
                    } label: {
                        Image(systemName: "square.and.arrow.up")
                    }
                    .accessibilityLabel("Share Event")
                    .disabled(editableEvent == nil || hasUnsavedChanges || isSaving)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        Task { await saveChanges() }
                    } label: {
                        if isSaving {
                            ProgressView()
                        } else {
                            Text("Save")
                        }
                    }
                    .disabled(isLoading || isSaving)
                }
            }
            .task { await loadRecipients() }
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
                    stageRemoval(of: recipient)
                }
                Button("Cancel", role: .cancel) {}
            } message: { recipient in
                Text("After Save, \(recipient.displayEmail) will lose access. Their local copy will remain read-only with a line through it.")
            }
            .sheet(isPresented: $showEventEditor) {
                if let localEventIdentifier = event.localEventIdentifier {
                    SharedEventEditController(
                        localEventIdentifier: localEventIdentifier
                    ) { action in
                        showEventEditor = false
                        if action == .saved {
                            SharedEventSyncManager.eventStoreDidChange()
                            NotificationCenter.default.post(
                                name: .sharedEventsTrackingChanged,
                                object: nil
                            )
                        }
                    }
                    .ignoresSafeArea()
                }
            }
        }
    }

    private var editableEvent: EKEvent? {
        guard let identifier = event.localEventIdentifier else { return nil }
        return CalendarViewModel.shared.eventStore.event(withIdentifier: identifier)
    }

    private func recipientRow(_ recipient: CloudCalendarsAPI.EventRecipient) -> some View {
        let providers = recipient.isAnonymous
            ? "Not signed in"
            : recipient.isPendingInvitation
                ? "Invitation pending"
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
            stageAccess(access, for: recipient)
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
            errorMessage = "Sign in to manage event access."
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
    private func stageAccess(
        _ access: CloudCalendarsAPI.EventAccess,
        for recipient: CloudCalendarsAPI.EventRecipient
    ) {
        guard !recipient.belongsToOriginalOwner,
              let index = recipients.firstIndex(where: { $0.id == recipient.id })
        else { return }
        recipients[index].access = access
    }

    private func stageRemoval(of recipient: CloudCalendarsAPI.EventRecipient) {
        guard !recipient.belongsToOriginalOwner else { return }
        removedRecipientIDs.insert(recipient.id)
        recipients.removeAll { $0.id == recipient.id }
        recipientPendingRemoval = nil
    }

    private var removalDialogIsPresented: Binding<Bool> {
        Binding(
            get: { recipientPendingRemoval != nil },
            set: { if !$0 { recipientPendingRemoval = nil } }
        )
    }

    private var hasUnsavedChanges: Bool {
        guard removedRecipientIDs.isEmpty else { return true }
        let originalAccess = Dictionary(
            uniqueKeysWithValues: originalRecipients.map { ($0.id, $0.access) }
        )
        return recipients.contains { originalAccess[$0.id] != $0.access }
    }

    @MainActor
    private func saveChanges() async {
        guard !isSaving else { return }
        guard hasUnsavedChanges else {
            dismiss()
            return
        }
        guard let session = CalendarFeedSession.existing else {
            errorMessage = "Sign in to save event access."
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
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private var canResendInvitation: Bool {
        event.feedID != nil && editableEvent != nil
    }

    @MainActor
    private func resendInvitation(to recipient: CloudCalendarsAPI.EventRecipient) async {
        let persistedRecipient = originalRecipients.first(where: { $0.id == recipient.id }) ?? recipient
        guard persistedRecipient.isPendingInvitation,
              let email = persistedRecipient.emails.first,
              let feedID = event.feedID,
              let editableEvent,
              let url = EventAppClipSharing.invocationURL(
                for: editableEvent,
                feedID: feedID,
                shareID: event.eventID
              ),
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

private struct SharedEventEditController: UIViewControllerRepresentable {
    let localEventIdentifier: String
    let onComplete: (EKEventEditViewAction) -> Void

    func makeCoordinator() -> Coordinator {
        Coordinator(onComplete: onComplete)
    }

    func makeUIViewController(context: Context) -> EKEventEditViewController {
        let controller = EKEventEditViewController()
        let store = CalendarViewModel.shared.eventStore
        controller.eventStore = store
        controller.event = store.event(withIdentifier: localEventIdentifier)
        controller.editViewDelegate = context.coordinator
        return controller
    }

    func updateUIViewController(
        _ uiViewController: EKEventEditViewController,
        context: Context
    ) {}

    final class Coordinator: NSObject, EKEventEditViewDelegate {
        let onComplete: (EKEventEditViewAction) -> Void

        init(onComplete: @escaping (EKEventEditViewAction) -> Void) {
            self.onComplete = onComplete
        }

        func eventEditViewController(
            _ controller: EKEventEditViewController,
            didCompleteWith action: EKEventEditViewAction
        ) {
            onComplete(action)
        }
    }
}
