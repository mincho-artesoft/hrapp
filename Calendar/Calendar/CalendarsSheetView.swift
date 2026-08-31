// CalendarsSheetView.swift
import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift
import MSAL

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared
    @ObservedObject private var notificationManager = EventNotificationManager.shared

    // MARK: - State
    @State private var showAddGoogleCalendarSheet: StoredGoogleUser? = nil
    @State private var iCloudExpanded = true
    @State private var isOtherExpanded = true
    @State private var googleExpandedStates: [UUID: Bool] = [:]
    @State private var msExpandedStates: [UUID: Bool] = [:]
    @State private var calendarToEdit: EKCalendar? = nil
    @State private var showAddCalendarSheet = false
    @State private var showICloudSheet = false
    @State private var addingGoogleUserID: UUID? = nil
    @State private var addingGoogleCalendarTitle: String? = nil
    @State private var addingGoogleCalendarColor: UIColor? = nil
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
        .onAppear(perform: onAppear)

        // MARK: Sheets…

        // Edit local calendar
        .sheet(item: $calendarToEdit, onDismiss: {
            viewModel.reloadCalendars()
        }) { cal in
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
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

    }

    // MARK: - Sections

    private var iCloudSection: some View {
        Section {
            DisclosureGroup(LocalizedStringKey("iCloud"), isExpanded: $iCloudExpanded) {
                ForEach(viewModel.localOrICloudCalendars(), id: \.calendarIdentifier) { cal in
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

    private var otherSection: some View {
        Section {
            DisclosureGroup(LocalizedStringKey("Other"), isExpanded: $isOtherExpanded) {
                ForEach(viewModel.otherCalendars(), id: \.calendarIdentifier) { cal in
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
                                    showShareButton: false,
                                    shareAction: {}
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

}
