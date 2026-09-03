// CalendarsSheetView.swift
import SwiftUI
import EventKit
import CryptoKit
import GoogleSignIn
import GoogleSignInSwift
import MSAL

private struct GoogleCalendarSharingTarget: Identifiable {
    let id = UUID()
    let googleCalendarID: String
    let user: StoredGoogleUser
    let calendarTitle: String
}

private struct ICloudCalendarSharingTarget: Identifiable {
    let id = UUID()
    let calendarID: String
    let calendarTitle: String
    let calendarColor: String
    let timeZone: String
    let localCalendarIdentifier: String
    let originalOwnerID: String?
    let originalOwnerEmail: String?
}

private struct SharedICloudCalendarInfoTarget: Identifiable {
    let id = UUID()
    let sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar
    let localCalendar: EKCalendar
}

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared
    @ObservedObject private var notificationManager = EventNotificationManager.shared

    // MARK: - State
    @State private var showAddGoogleCalendarSheet: StoredGoogleUser? = nil
    @State private var iCloudExpanded = true
    @State private var sharedICloudExpanded = true
    @State private var isOtherExpanded = true
    @State private var googleExpandedStates: [UUID: Bool] = [:]
    @State private var msExpandedStates: [UUID: Bool] = [:]
    @State private var calendarToEdit: EKCalendar? = nil
    @State private var showAddCalendarSheet = false
    @State private var showICloudSheet = false
    @State private var addingGoogleUserID: UUID? = nil
    @State private var addingGoogleCalendarTitle: String? = nil
    @State private var addingGoogleCalendarColor: UIColor? = nil
    @State private var googleCalendarSharingTarget: GoogleCalendarSharingTarget?
    @State private var iCloudCalendarSharingTarget: ICloudCalendarSharingTarget?
    @State private var sharedICloudCalendarInfoTarget: SharedICloudCalendarInfoTarget?
    @State private var sharedICloudCalendars: [CloudCalendarsAPI.SharedICloudCalendar] = []
    @State private var isLoadingSharedICloudCalendars = false
    @State private var sharedICloudCalendarsError: String?
    private let sharedICloudRefreshTimer = Timer.publish(
        every: 20,
        on: .main,
        in: .common
    ).autoconnect()
    private let bottomContentInset: CGFloat

    // MARK: - Init for iOS 14–15 appearance
    init(bottomContentInset: CGFloat = 0) {
        self.bottomContentInset = bottomContentInset
        UITableView.appearance().backgroundColor = .clear
        UITableViewCell.appearance().backgroundColor = .clear
    }

    // MARK: - Body
    var body: some View {
        VStack(spacing: 0) {

            // Custom “navigation bar”
            HStack {
                Button(action: toggleSelectAll) {
                    Text(viewModel.selectedCalendarIDs.count == viewModel.allCalendars.count
                         ? LocalizedStringKey("Deselect All")
                         : LocalizedStringKey("Select All"))
                        .fontWeight(.semibold)
                }
                Spacer()
            }
            .padding(.horizontal)
            .padding(.top, 12)

            // Main content
            Form {
                iCloudSection
                sharedWithMeICloudSection
                otherSection
                googleSection
                microsoftSection
                addCalendarSection
                shareCalendarsSection
                googleSignInSection
                microsoftSignInSection

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
            .listSectionSpacing(8)

            Spacer()
            Spacer()
        }
        .background(Color.clear)
        .onAppear {
            onAppear()
            Task { await loadSharedICloudCalendars() }
        }
        .onReceive(NotificationCenter.default.publisher(for: .cloudAccountChanged)) { _ in
            Task { await loadSharedICloudCalendars() }
        }
        .onReceive(NotificationCenter.default.publisher(for: .sharedEventImported)) { _ in
            viewModel.reloadCalendars()
            Task { await loadSharedICloudCalendars() }
        }
        .onReceive(NotificationCenter.default.publisher(for: .EKEventStoreChanged)) { _ in
            viewModel.reloadCalendars()
        }
        .onReceive(sharedICloudRefreshTimer) { _ in
            Task { await loadSharedICloudCalendars() }
        }

        // MARK: Sheets…

        // Edit local calendar
        .sheet(item: $calendarToEdit, onDismiss: {
            viewModel.reloadCalendars()
        }) { cal in
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }

        .sheet(item: $sharedICloudCalendarInfoTarget, onDismiss: {
            viewModel.reloadCalendars()
            Task { await loadSharedICloudCalendars() }
        }) { target in
            SharedICloudCalendarInfoView(
                eventStore: viewModel.eventStore,
                sharedCalendar: target.sharedCalendar,
                localCalendar: target.localCalendar,
                onRemoved: { removedShareID in
                    sharedICloudCalendars.removeAll { $0.id == removedShareID }
                }
            )
            .presentationDetents([.large])
            .presentationDragIndicator(.visible)
        }

        // Add iCloud Calendar
        .sheet(isPresented: $showAddCalendarSheet) {
            AddCalendarView()
        }

        // Open iCloud share
        .sheet(isPresented: $showICloudSheet) {
            if let url = URL(string: "https://www.icloud.com/calendar/") {
                SafariView(url: url)
            }
        }

        // Add Google Calendar
        .sheet(item: $showAddGoogleCalendarSheet) { gUser in
            AddGoogleCalendarView(user: gUser) { name, color in
                addingGoogleUserID = gUser.uniqueID
                addingGoogleCalendarTitle = name
                addingGoogleCalendarColor = color
                Task {
                    await viewModel.addGoogleCalendar(name: name, color: color, for: gUser)
                    addingGoogleUserID = nil
                    addingGoogleCalendarTitle = nil
                    addingGoogleCalendarColor = nil
                }
            }
        }

        // Manage sharing for the Google calendar selected from its row.
        .sheet(item: $googleCalendarSharingTarget) { target in
            GoogleCalendarSharingView(
                googleCalID: target.googleCalendarID,
                user: target.user,
                calendarTitle: target.calendarTitle
            )
        }

        .sheet(item: $iCloudCalendarSharingTarget) { target in
            ICloudCalendarSharingView(
                calendarID: target.calendarID,
                calendarTitle: target.calendarTitle,
                calendarColor: target.calendarColor,
                timeZone: target.timeZone,
                localCalendarIdentifier: target.localCalendarIdentifier,
                originalOwnerID: target.originalOwnerID,
                originalOwnerEmail: target.originalOwnerEmail
            )
            .presentationDetents([.large])
            .presentationDragIndicator(.visible)
        }

    }

    // MARK: - Sections

    private var iCloudSection: some View {
        Section {
            DisclosureGroup(LocalizedStringKey("iCloud"), isExpanded: $iCloudExpanded) {
                ForEach(
                    viewModel.localOrICloudCalendars().filter {
                        !SharedICloudCalendarLocalStore.allLocalCalendarIdentifiers
                            .contains($0.calendarIdentifier)
                    },
                    id: \.calendarIdentifier
                ) { cal in
                    CalendarRowView(
                        calendar: cal,
                        isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                        toggleAction: toggleCalendar,
                        editAction: { calendarToEdit = cal },
                        showEditButton: true,
                        showShareButton: true,
                        shareAction: {
                            iCloudCalendarSharingTarget = ICloudCalendarSharingTarget(
                                calendarID: iCloudCalendarShareID(for: cal),
                                calendarTitle: cal.title,
                                calendarColor: calendarColorHex(cal),
                                timeZone: TimeZone.current.identifier,
                                localCalendarIdentifier: cal.calendarIdentifier,
                                originalOwnerID: nil,
                                originalOwnerEmail: nil
                            )
                        }
                    )
                    .listRowSeparator(.hidden)
                }
            }
        }
    }

    private var sharedWithMeICloudSection: some View {
        Section {
            DisclosureGroup(
                LocalizedStringKey("Shared with me"),
                isExpanded: $sharedICloudExpanded
            ) {
                if CalendarFeedSession.existing == nil {
                    Text("Sign in to see calendars shared with you.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .listRowSeparator(.hidden)
                } else if isLoadingSharedICloudCalendars && sharedICloudCalendars.isEmpty {
                    HStack(spacing: 10) {
                        ProgressView()
                        Text("Loading shared calendars…")
                            .foregroundStyle(.secondary)
                    }
                    .listRowSeparator(.hidden)
                } else if let sharedICloudCalendarsError,
                          sharedICloudCalendars.isEmpty {
                    Label(sharedICloudCalendarsError, systemImage: "exclamationmark.circle.fill")
                        .font(.footnote)
                        .foregroundStyle(.red)
                        .listRowSeparator(.hidden)
                } else if sharedICloudCalendars.isEmpty {
                    Text("No calendars have been shared with you yet.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .listRowSeparator(.hidden)
                } else {
                    ForEach(sharedICloudCalendars) { calendar in
                        let localCalendar = SharedICloudCalendarLocalStore.localCalendar(
                            for: calendar,
                            in: viewModel.eventStore
                        )
                        SharedICloudCalendarRow(
                            calendar: calendar,
                            localCalendar: localCalendar,
                            isSelected: localCalendar.map {
                                viewModel.selectedCalendarIDs.contains($0.calendarIdentifier)
                            } ?? false,
                            toggleAction: {
                                guard let localCalendar else { return }
                                toggleCalendar(localCalendar)
                            },
                            manageSharingAction: calendar.access == .owner && !calendar.isRevoked ? {
                                iCloudCalendarSharingTarget = ICloudCalendarSharingTarget(
                                    calendarID: calendar.calendarId,
                                    calendarTitle: calendar.title,
                                    calendarColor: calendar.color,
                                    timeZone: calendar.timeZone,
                                    localCalendarIdentifier: localCalendar?.calendarIdentifier ?? "",
                                    originalOwnerID: calendar.ownerId,
                                    originalOwnerEmail: calendar.ownerEmail
                                )
                            } : nil,
                            infoAction: {
                                guard let localCalendar else { return }
                                sharedICloudCalendarInfoTarget =
                                    SharedICloudCalendarInfoTarget(
                                        sharedCalendar: calendar,
                                        localCalendar: localCalendar
                                    )
                            }
                        )
                            .listRowSeparator(.hidden)
                    }
                }
            }
        }
    }

    private func iCloudCalendarShareID(for calendar: EKCalendar) -> String {
        SHA256.hash(data: Data(calendar.calendarIdentifier.utf8))
            .map { String(format: "%02x", $0) }
            .joined()
    }

    private func calendarColorHex(_ calendar: EKCalendar) -> String {
        let color = UIColor(cgColor: calendar.cgColor ?? UIColor.systemBlue.cgColor)
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        guard color.getRed(&red, green: &green, blue: &blue, alpha: &alpha) else {
            return "#0088FF"
        }
        return String(
            format: "#%02X%02X%02X",
            Int((red * 255).rounded()),
            Int((green * 255).rounded()),
            Int((blue * 255).rounded())
        )
    }

    private var otherSection: some View {
        Section {
            DisclosureGroup(LocalizedStringKey("Other"), isExpanded: $isOtherExpanded) {
                ForEach(
                    viewModel.otherCalendars().filter {
                        !SharedICloudCalendarLocalStore.allLocalCalendarIdentifiers
                            .contains($0.calendarIdentifier)
                    },
                    id: \.calendarIdentifier
                ) { cal in
                    CalendarRowView(
                        calendar: cal,
                        isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                        toggleAction: toggleCalendar,
                        editAction: { calendarToEdit = cal },
                        showEditButton: true,
                        showShareButton: false,
                        shareAction: {}
                    )
                    .listRowSeparator(.hidden)
                }
            }
        }
    }

    // ⚡ Google Section with spinner row
    private var googleSection: some View {
        Group {
            if !viewModel.storedUsers.isEmpty {
                Section { Text(LocalizedStringKey("Google calendars")) }
            }
            ForEach(viewModel.storedUsers, id: \.uniqueID) { user in
                let isExpanded = Binding<Bool>(
                    get: { googleExpandedStates[user.uniqueID] ?? true },
                    set: { googleExpandedStates[user.uniqueID] = $0 }
                )
                Section {
                    DisclosureGroup(isExpanded: isExpanded) {
                        let googleCals = googleCopiedCalendars(for: user)
                        if googleCals.isEmpty {
                            Text(LocalizedStringKey("No synced Google calendars yet."))
                                .font(.footnote)
                                .foregroundColor(.secondary)
                                .listRowBackground(Color.clear)
                        } else {
                            ForEach(googleCals, id: \.calendarIdentifier) { cal in
                                CalendarRowView(
                                    calendar: cal,
                                    isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                    toggleAction: toggleCalendar,
                                    editAction: {},
                                    showEditButton: false,
                                    showShareButton: user.refreshToken?.isEmpty == false,
                                    shareAction: {
                                        guard let googleCalendarID = googleCalendarID(
                                            for: cal,
                                            user: user
                                        ) else { return }

                                        googleCalendarSharingTarget = GoogleCalendarSharingTarget(
                                            googleCalendarID: googleCalendarID,
                                            user: user,
                                            calendarTitle: cal.title
                                        )
                                    }
                                )
                                .listRowSeparator(.hidden)
                            }
                            // Temporary spinner row while adding
                            if addingGoogleUserID == user.uniqueID,
                               let title = addingGoogleCalendarTitle,
                               let color = addingGoogleCalendarColor {
                                HStack(spacing: 16) {
                                    Circle()
                                        .fill(Color(uiColor: color))
                                        .frame(width: 28, height: 28)
                                    Text(title)
                                        .foregroundColor(.primary)
                                    Spacer()
                                    ProgressView()
                                        .tint(.primary) 
                                }
                                .padding(.vertical, 4)
                                .padding(.horizontal, 5)
                                .background(
                                    RoundedRectangle(cornerRadius: 24)
                                        .fill(Color.clear)
                                )
                                .padding(.leading, -32)
                            }
                        }
                        Section {
                            Button {
                                showAddGoogleCalendarSheet = user
                            } label: {
                                Text(LocalizedStringKey("Add Google Calendar"))
                            }
                            .buttonStyle(HighlightOnPressButtonStyle(tint: .blue))
                            .listRowInsets(EdgeInsets(top: 0, leading: 8, bottom: 0, trailing: 0))
                            .listRowSeparator(.hidden)
                            .listRowBackground(Color.clear)
                        }
                        Section {
                            Button {
                                viewModel.signOutFromGoogle(user: user)
                            } label: {
                                Text(LocalizedStringKey("Sign out"))
                            }
                            .buttonStyle(HighlightOnPressButtonStyle(tint: .red))
                            .listRowInsets(EdgeInsets(top: 0, leading: 8, bottom: 0, trailing: 0))
                            .listRowSeparator(.hidden)
                            .listRowBackground(Color.clear)
                        }
                    } label: {
                        HStack {
                            if let photoURLString = user.photoURL,
                               let photoURL = URL(string: photoURLString) {
                                AsyncImage(url: photoURL) { phase in
                                    switch phase {
                                    case .empty:    ProgressView()
                                    case .success:  phase.image?.resizable().aspectRatio(contentMode: .fill)
                                    case .failure:  Image(systemName: "person.crop.circle.badge.exclamationmark")
                                                        .resizable().aspectRatio(contentMode: .fill)
                                    @unknown default: EmptyView()
                                    }
                                }
                                .frame(width: 28, height: 28)
                                .clipShape(Circle())
                            } else {
                                Image(systemName: "person.crop.circle")
                                    .resizable()
                                    .frame(width: 28, height: 28)
                            }
                            Text(user.email ?? NSLocalizedString("No Email", comment: ""))
                                .padding(.leading, 4)
                        }
                    }
                }
            }
        }
    }

    private var microsoftSection: some View {
        Group {
            if !viewModel.storedMsUsers.isEmpty {
                Section { Text(LocalizedStringKey("Microsoft calendars")) }
            }
            ForEach(viewModel.storedMsUsers, id: \.uniqueID) { user in
                let isExpanded = Binding<Bool>(
                    get: { msExpandedStates[user.uniqueID] ?? true },
                    set: { msExpandedStates[user.uniqueID] = $0 }
                )
                Section {
                    DisclosureGroup(isExpanded: isExpanded) {
                        let msCals = viewModel.microsoftCopiedCalendars(for: user)
                        if msCals.isEmpty {
                            Text(LocalizedStringKey("No synced Microsoft calendars yet."))
                                .font(.footnote).foregroundColor(.secondary)
                                .listRowBackground(Color.clear)
                        } else {
                            ForEach(msCals, id: \.calendarIdentifier) { cal in
                                CalendarRowView(
                                    calendar: cal,
                                    isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                    toggleAction: toggleCalendar,
                                    editAction: { calendarToEdit = cal },
                                    showEditButton: false,
                                    showShareButton: false,
                                    shareAction: {}
                                )
                                .listRowSeparator(.hidden)
                            }
                        }
                        Section {
                            Button {
                                viewModel.signOutFromMicrosoft(user: user)
                            } label: {
                                Text(LocalizedStringKey("Sign out"))
                            }
                            .buttonStyle(HighlightOnPressButtonStyle(tint: .red))
                            .listRowInsets(EdgeInsets(top: 0, leading: 8, bottom: 0, trailing: 0))
                            .listRowSeparator(.hidden)
                            .listRowBackground(Color.clear)
                        }
                    } label: {
                        HStack {
                            Image(systemName: "person.circle")
                                .resizable().frame(width: 28, height: 28)
                            Text(user.email ?? NSLocalizedString("No Email", comment: ""))
                                .padding(.leading, 4)
                        }
                    }
                }
            }
        }
    }

    private var addCalendarSection: some View {
        Section {
            Button { showAddCalendarSheet = true } label: {
                HStack {
                    Image(systemName: "icloud.fill")
                        .foregroundStyle(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 0.69, green: 0.85, blue: 0.98),
                                    Color(red: 0.46, green: 0.70, blue: 0.97),
                                    Color(red: 0.26, green: 0.57, blue: 0.96),
                                    Color(red: 0.09, green: 0.44, blue: 0.94),
                                    Color(red: 0.04, green: 0.35, blue: 0.92)
                                ]),
                                startPoint: .leading, endPoint: .trailing
                            )
                        )
                        .frame(width: 28, height: 28)
                    Text(LocalizedStringKey("Add iCloud Calendar"))
                }
            }
            .buttonStyle(PlainButtonStyle())
        }
    }

    private var shareCalendarsSection: some View {
        Section {
            Button { showICloudSheet = true } label: {
                HStack {
                    Image(systemName: "link.icloud.fill")
                        .foregroundStyle(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 0.69, green: 0.85, blue: 0.98),
                                    Color(red: 0.46, green: 0.70, blue: 0.97),
                                    Color(red: 0.26, green: 0.57, blue: 0.96),
                                    Color(red: 0.09, green: 0.44, blue: 0.94),
                                    Color(red: 0.04, green: 0.35, blue: 0.92)
                                ]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: 28, height: 28)
                    Text(LocalizedStringKey("Share calendars with iCloud Calendar"))
                }
            }
            .buttonStyle(.plain)
        }
    }

    private var googleSignInSection: some View {
        Section {
            Button(action: {
                // ПРОМЯНА: Премахната е проверката за .base план.
                // Сега директно викаме функцията за вход.
                viewModel.signInWithGoogle()
            }) {
                HStack {
                    Image("google_icon")
                        .resizable().aspectRatio(contentMode: .fit).frame(width: 28, height: 28)
                    Text(LocalizedStringKey("Sign in with Google"))
                }
            }
            .buttonStyle(PlainButtonStyle())
        }
    }

    private var microsoftSignInSection: some View {
        Section {
            Button(action: {
                if subscriptionManager.subscriptionStatus == .base  || subscriptionManager.subscriptionStatus == .advance {
                    let payload: [String: Any] = ["subscriptionStatusRaw": "Premium"]
                    NotificationCenter.default.post(
                        name: .notificationDraggableMenuViewSub,
                        object: nil,
                        userInfo: payload
                    )
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                        NotificationCenter.default.post(
                            name: .notificationDraggableMenuViewSub,
                            object: nil,
                            userInfo: payload
                        )
                    }
                } else {
                    viewModel.signInWithMicrosoft()
                }
            }) {
                HStack {
                    Image("microsoft_icon")
                        .resizable().aspectRatio(contentMode: .fit).frame(width: 28, height: 28)
                    Text(LocalizedStringKey("Sign in with Microsoft"))
                }
            }
            .buttonStyle(PlainButtonStyle())
        }
    }

    // MARK: - Helper Actions

    private func onAppear() {
        viewModel.reloadCalendars()
        notificationManager.refreshAuthorizationStatus()
        notificationManager.rescheduleUpcomingEventNotifications()
    }

    @MainActor
    private func loadSharedICloudCalendars() async {
        guard let session = CalendarFeedSession.existing else {
            sharedICloudCalendars = []
            sharedICloudCalendarsError = nil
            return
        }
        guard !isLoadingSharedICloudCalendars else { return }
        isLoadingSharedICloudCalendars = true
        defer { isLoadingSharedICloudCalendars = false }
        do {
            // Push permitted Writer/Owner changes before reading the latest
            // server snapshot. Reconciling the fetched payload directly here
            // used to overwrite a local edit before the foreground sync could
            // upload it.
            _ = await SharedICloudCalendarLocalStore.refreshAll()
            // The sync mutates EventKit in place. Refresh this sheet's
            // observed calendar collection as well, otherwise its open rows
            // can keep rendering the old EKCalendar instances while the
            // timeline already shows the new metadata and events.
            viewModel.reloadCalendars()
            let fetchedCalendars = try await CloudCalendarsAPI
                .iCloudCalendarsSharedWithMe(session: session)
                .filter {
                    !SharedICloudCalendarLocalStore.isRemovedLocally(
                        shareID: $0.id
                    )
                }

            // Assign the fresh value on every completed refresh. Besides the
            // title/color, the row also renders role and revocation fields
            // that do not originate from EventKit.
            sharedICloudCalendars = fetchedCalendars
            sharedICloudCalendarsError = nil
        } catch {
            sharedICloudCalendarsError = error.localizedDescription
        }
    }

    private func toggleSelectAll() {
        let allIDs = Set(viewModel.allCalendars.map { $0.calendarIdentifier })
        if viewModel.selectedCalendarIDs.count == allIDs.count {
            viewModel.selectedCalendarIDs.removeAll()
        } else {
            viewModel.selectedCalendarIDs = allIDs
        }
        notificationManager.rescheduleUpcomingEventNotifications()
    }

    private func toggleCalendar(_ cal: EKCalendar) {
        if viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier) {
            viewModel.selectedCalendarIDs.remove(cal.calendarIdentifier)
        } else {
            viewModel.selectedCalendarIDs.insert(cal.calendarIdentifier)
        }
        notificationManager.rescheduleUpcomingEventNotifications()
    }

    private func googleCopiedCalendars(for user: StoredGoogleUser) -> [EKCalendar] {
        let map = viewModel.googleToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        return viewModel.allCalendars.filter { localIDs.contains($0.calendarIdentifier) }
    }

    private func googleCalendarID(
        for calendar: EKCalendar,
        user: StoredGoogleUser
    ) -> String? {
        viewModel.googleToLocalCalendarMap(for: user.uniqueID)
            .first { $0.value == calendar.calendarIdentifier }?
            .key
    }

}

private struct SharedICloudCalendarRow: View {
    let calendar: CloudCalendarsAPI.SharedICloudCalendar
    let localCalendar: EKCalendar?
    let isSelected: Bool
    let toggleAction: () -> Void
    let manageSharingAction: (() -> Void)?
    let infoAction: () -> Void

    var body: some View {
        HStack(spacing: 16) {
            Button(action: toggleAction) {
                HStack(spacing: 16) {
                    ZStack {
                        Circle()
                            .fill(calendarColor)
                            .frame(width: 28, height: 28)

                        if isSelected {
                            Image(systemName: "checkmark")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundStyle(.white)
                        }
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text(calendar.title)
                            .foregroundStyle(.primary)
                            .lineLimit(1)
                            .strikethrough(calendar.isRevoked, color: calendarColor)

                        if let ownerEmail = calendar.ownerEmail, !ownerEmail.isEmpty {
                            Text(ownerEmail)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .lineLimit(1)
                                .truncationMode(.middle)
                        }
                    }
                }
            }
            .buttonStyle(.plain)
            .disabled(localCalendar == nil)

            Spacer(minLength: 8)

            Text(calendarStatusText)
                .font(.caption.weight(.semibold))
                .foregroundStyle(
                    calendar.isRevoked
                        ? Color.red
                        : Color.primary
                )
                .padding(.horizontal, 9)
                .padding(.vertical, 5)
                .background(Color(uiColor: .secondarySystemGroupedBackground), in: Capsule())

            if let manageSharingAction {
                Button(action: manageSharingAction) {
                    Image(systemName: "person.2.fill")
                        .font(.system(size: 18))
                        .foregroundStyle(.blue)
                }
                .buttonStyle(.borderless)
                .accessibilityLabel("Manage calendar sharing")
            }

            Button(action: infoAction) {
                Image(systemName: "info.circle")
                    .font(.system(size: 18))
                    .foregroundStyle(.blue)
            }
            .buttonStyle(.borderless)
            .disabled(localCalendar == nil)
            .accessibilityLabel("Shared calendar information")
        }
        .padding(.vertical, 4)
        .padding(.horizontal, 5)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(
                    isSelected
                        ? Color(uiColor: UIColor.systemGray4.withAlphaComponent(0.5))
                        : Color.clear
                )
        )
        .padding(.leading, -32)
    }

    private var calendarColor: Color {
        if let cgColor = localCalendar?.cgColor {
            return Color(uiColor: UIColor(cgColor: cgColor))
        }
        let raw = calendar.color.trimmingCharacters(
            in: CharacterSet.alphanumerics.inverted
        )
        guard raw.count == 6, let value = UInt64(raw, radix: 16) else {
            return .blue
        }
        return Color(
            red: Double((value >> 16) & 0xFF) / 255,
            green: Double((value >> 8) & 0xFF) / 255,
            blue: Double(value & 0xFF) / 255
        )
    }

    private var calendarStatusText: String {
        guard calendar.isRevoked else { return calendar.access.title }
        return calendar.wasDeletedByOwner
            ? String(localized: "Deleted by owner")
            : String(localized: "Access removed")
    }
}

private struct SharedICloudCalendarInfoView: View {
    private enum PresentedAlert: Identifiable {
        case confirmRemoval
        case failed(String)

        var id: String {
            switch self {
            case .confirmRemoval: "confirm-removal"
            case .failed(let message): "failed-\(message)"
            }
        }
    }

    @Environment(\.dismiss) private var dismiss

    let eventStore: EKEventStore
    let sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar
    let localCalendar: EKCalendar
    let onRemoved: (String) -> Void

    @State private var selectedColor: UIColor
    @State private var usesCreatorDefault: Bool
    @State private var presentedAlert: PresentedAlert?
    @State private var isRemoving = false

    init(
        eventStore: EKEventStore,
        sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        localCalendar: EKCalendar,
        onRemoved: @escaping (String) -> Void
    ) {
        self.eventStore = eventStore
        self.sharedCalendar = sharedCalendar
        self.localCalendar = localCalendar
        self.onRemoved = onRemoved
        let localOverride = SharedICloudCalendarLocalStore.localColorOverride(
            shareID: sharedCalendar.id
        )
        _selectedColor = State(initialValue: localOverride ?? Self.creatorColor(sharedCalendar))
        _usesCreatorDefault = State(initialValue: localOverride == nil)
    }

    var body: some View {
        NavigationView {
            Form {
                Section {
                    TextField(
                        LocalizedStringKey("Calendar Name"),
                        text: .constant(sharedCalendar.title)
                    )
                    .disabled(true)
                }

                Section {
                    NavigationLink {
                        CalendarColorSelectionView(
                            selectedColor: $selectedColor,
                            defaultColor: Self.creatorColor(sharedCalendar),
                            usesDefault: $usesCreatorDefault
                        )
                    } label: {
                        HStack {
                            Circle()
                                .fill(Color(uiColor: effectiveSelectedColor))
                                .frame(width: 20, height: 20)
                            Text(displayColorName(for: effectiveSelectedColor))
                                .padding(.leading, 8)
                        }
                    }
                } header: {
                    Text(LocalizedStringKey("COLOR"))
                        .foregroundColor(.secondary)
                } footer: {
                    Text(
                        usesCreatorDefault
                            ? String(localized: "Default from creator")
                            : String(localized: "Custom on this device")
                    )
                }

                Section {
                    LabeledContent("Access", value: sharedCalendar.access.title)
                    if let ownerEmail = sharedCalendar.ownerEmail,
                       !ownerEmail.isEmpty {
                        LabeledContent("Owner", value: ownerEmail)
                    }
                }

                Section {
                    Button(role: .destructive) {
                        presentedAlert = .confirmRemoval
                    } label: {
                        Text("Remove from My Calendars")
                            .frame(maxWidth: .infinity, alignment: .center)
                    }
                }
            }
            .navigationBarTitle(LocalizedStringKey("Edit Calendar"), displayMode: .inline)
            .navigationBarItems(
                leading: AppToolbarTextButton("Cancel") { dismiss() },
                trailing: AppToolbarTextButton("Done") { saveLocalColor() }
            )
        }
        .alert(item: $presentedAlert) { alert in
            switch alert {
            case .confirmRemoval:
                Alert(
                    title: Text("Remove Shared Calendar?"),
                    primaryButton: .destructive(Text("Remove")) {
                        Task { await leaveSharedCalendar() }
                    },
                    secondaryButton: .cancel()
                )
            case .failed(let message):
                Alert(
                    title: Text("Unable to Update Calendar"),
                    message: Text(message),
                    dismissButton: .default(Text("OK"))
                )
            }
        }
    }

    private func saveLocalColor() {
        do {
            try SharedICloudCalendarLocalStore.setLocalColorOverride(
                usesCreatorDefault ? nil : selectedColor,
                for: sharedCalendar,
                in: eventStore
            )
            CalendarViewModel.shared.reloadCalendars()
            NotificationCenter.default.post(name: .cloudAccountChanged, object: nil)
            dismiss()
        } catch {
            presentedAlert = .failed(error.localizedDescription)
        }
    }

    private var effectiveSelectedColor: UIColor {
        usesCreatorDefault ? Self.creatorColor(sharedCalendar) : selectedColor
    }

    private func displayColorName(for color: UIColor) -> String {
        if colorsAreEqual(color, .systemRed) {
            return String(localized: "Red")
        }
        if colorsAreEqual(color, .systemOrange) {
            return String(localized: "Orange")
        }
        if colorsAreEqual(color, .systemYellow) {
            return String(localized: "Yellow")
        }
        if colorsAreEqual(color, .systemGreen) {
            return String(localized: "Green")
        }
        if colorsAreEqual(color, .systemBlue) {
            return String(localized: "Blue")
        }
        if colorsAreEqual(color, .systemPurple) {
            return String(localized: "Purple")
        }
        if colorsAreEqual(color, .brown) {
            return String(localized: "Brown")
        }
        return String(localized: "Custom")
    }

    private func colorsAreEqual(_ lhs: UIColor, _ rhs: UIColor) -> Bool {
        var lhsRed: CGFloat = 0
        var lhsGreen: CGFloat = 0
        var lhsBlue: CGFloat = 0
        var lhsAlpha: CGFloat = 0
        var rhsRed: CGFloat = 0
        var rhsGreen: CGFloat = 0
        var rhsBlue: CGFloat = 0
        var rhsAlpha: CGFloat = 0
        lhs.getRed(&lhsRed, green: &lhsGreen, blue: &lhsBlue, alpha: &lhsAlpha)
        rhs.getRed(&rhsRed, green: &rhsGreen, blue: &rhsBlue, alpha: &rhsAlpha)
        return lhsRed == rhsRed
            && lhsGreen == rhsGreen
            && lhsBlue == rhsBlue
            && lhsAlpha == rhsAlpha
    }

    private static func creatorColor(
        _ sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar
    ) -> UIColor {
        let raw = sharedCalendar.color.trimmingCharacters(
            in: CharacterSet.alphanumerics.inverted
        )
        guard raw.count == 6, let value = UInt64(raw, radix: 16) else {
            return .systemBlue
        }
        return UIColor(
            red: CGFloat((value >> 16) & 0xFF) / 255,
            green: CGFloat((value >> 8) & 0xFF) / 255,
            blue: CGFloat(value & 0xFF) / 255,
            alpha: 1
        )
    }

    @MainActor
    private func leaveSharedCalendar() async {
        guard !isRemoving else { return }
        guard let session = CalendarFeedSession.existing else {
            presentedAlert = .failed(String(localized: "Sign In Required"))
            return
        }
        isRemoving = true
        defer { isRemoving = false }
        do {
            try await CloudCalendarsAPI.leaveICloudCalendar(
                ownerId: sharedCalendar.ownerId,
                calendarId: sharedCalendar.calendarId,
                session: session
            )
            try SharedICloudCalendarLocalStore.removeLocally(
                sharedCalendar,
                in: eventStore
            )
            onRemoved(sharedCalendar.id)
            NotificationCenter.default.post(name: .cloudAccountChanged, object: nil)
            dismiss()
        } catch {
            presentedAlert = .failed(error.localizedDescription)
        }
    }
}
