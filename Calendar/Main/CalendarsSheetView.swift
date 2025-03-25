import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift
import MSAL  // Be sure to add MSAL to your project if you haven't already.

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true
    
    // For each Google user: store disclosure group expand/collapse states
    @State private var googleExpandedStates: [UUID: Bool] = [:]
    // For each Microsoft user: store disclosure group expand/collapse states
    @State private var msExpandedStates:     [UUID: Bool] = [:]

    // For editing an existing calendar
    @State private var calendarToEdit: EKCalendar? = nil
    // Sheet for adding a new local calendar
    @State private var showAddCalendarSheet = false

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    // 1) Local “On My iPhone” section
                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(localNonGoogleCalendars(), id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    calendarToEdit = cal
                                },
                                showEditButton: true
                            )
                        }
                    }

                    // 2) For each Google user => separate DisclosureGroup
                    ForEach(viewModel.storedUsers, id: \.uniqueID) { user in
                        let binding = Binding<Bool>(
                            get: { googleExpandedStates[user.uniqueID] ?? true },
                            set: { googleExpandedStates[user.uniqueID] = $0 }
                        )
                        DisclosureGroup(isExpanded: binding) {
                            // Child content for this Google user
                            let googleCals = googleCopiedCalendars(for: user)
                            if googleCals.isEmpty {
                                Text("No synced Google calendars yet.")
                                    .font(.footnote)
                                    .foregroundColor(.secondary)
                            } else {
                                ForEach(googleCals, id: \.calendarIdentifier) { cal in
                                    CalendarRowView(
                                        calendar: cal,
                                        isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                        toggleAction: toggleCalendar,
                                        editAction: {
                                            // Optionally allow rename
                                            calendarToEdit = cal
                                        },
                                        showEditButton: false
                                    )
                                }
                            }

                            // Sign-out button
                            Button("Sign out") {
                                viewModel.signOutFromGoogle(user: user)
                            }
                            .foregroundColor(.red)

                        } label: {
                            // The label portion (avatar + email)
                            HStack {
                                if let photoURLString = user.photoURL,
                                   let photoURL = URL(string: photoURLString) {
                                    // iOS 15+ AsyncImage for the avatar
                                    AsyncImage(url: photoURL) { phase in
                                        switch phase {
                                        case .empty:
                                            ProgressView()
                                        case .success(let image):
                                            image
                                                .resizable()
                                                .aspectRatio(contentMode: .fill)
                                        case .failure:
                                            Image(systemName: "person.crop.circle.badge.exclamationmark")
                                                .resizable()
                                                .aspectRatio(contentMode: .fill)
                                        @unknown default:
                                            EmptyView()
                                        }
                                    }
                                    .frame(width: 28, height: 28)
                                    .clipShape(Circle())
                                } else {
                                    // Fallback icon if no photoURL
                                    Image(systemName: "person.crop.circle")
                                        .resizable()
                                        .frame(width: 28, height: 28)
                                }
                                
                                Text("Google calendars (\(user.email ?? "No Email"))")
                                    .padding(.leading, 4)
                            }
                        }
                    }

                    // 3) For each Microsoft user => separate DisclosureGroup
                    ForEach(viewModel.storedMsUsers, id: \.uniqueID) { user in
                        let binding = Binding<Bool>(
                            get: { msExpandedStates[user.uniqueID] ?? true },
                            set: { msExpandedStates[user.uniqueID] = $0 }
                        )
                        DisclosureGroup(isExpanded: binding) {
                            // Child content for this Microsoft user
                            let msCals = viewModel.microsoftCopiedCalendars(for: user)
                            if msCals.isEmpty {
                                Text("No synced Microsoft calendars yet.")
                                    .font(.footnote)
                                    .foregroundColor(.secondary)
                            } else {
                                ForEach(msCals, id: \.calendarIdentifier) { cal in
                                    CalendarRowView(
                                        calendar: cal,
                                        isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                        toggleAction: toggleCalendar,
                                        editAction: {
                                            calendarToEdit = cal
                                        },
                                        showEditButton: false
                                    )
                                }
                            }

                            // Sign-out button for Microsoft
                            Button("Sign out") {
                                viewModel.signOutFromMicrosoft(user: user)
                            }
                            .foregroundColor(.red)
                            
                        } label: {
                            // Label portion (avatar + email) for Microsoft
                            HStack {
                                // If you store an avatar URL for MS, load it similarly with AsyncImage
                                Image(systemName: "person.circle")
                                    .resizable()
                                    .frame(width: 28, height: 28)
                                
                                Text("Microsoft calendars (\(user.email ?? "No Email"))")
                                    .padding(.leading, 4)
                            }
                        }
                    }

                    // 4) Other (iCloud, Exchange, etc.) calendars
                    DisclosureGroup("Other", isExpanded: $isOtherExpanded) {
                        ForEach(otherCalendars(), id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    calendarToEdit = cal
                                },
                                showEditButton: true
                            )
                        }
                    }

                    // 5) Buttons for signing in
                    Section {
                        // Google
                        Button(action: signInWithGoogle) {
                            HStack {
                                Image("google_icon") // or systemName if you prefer
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                                    .frame(width: 28, height: 28)
                                Text("Sign in with Google")
                            }
                        }
                        .buttonStyle(PlainButtonStyle())

                        // Microsoft
                        Button(action: signInWithMicrosoft) {
                            HStack {
                                Image("microsoft_icon")  // Replace with a MS icon if you have one
                                    .resizable()
                                    .aspectRatio(contentMode: .fit)
                                    .frame(width: 28, height: 28)
                                Text("Sign in with Microsoft")
                            }
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .navigationBarTitle("Calendars", displayMode: .inline)
                .navigationBarItems(
                    trailing: Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
                )

                // Bottom bar with Add Calendar / Hide All
                HStack {
                    Button("Add Local Calendar") {
                        showAddCalendarSheet = true
                    }
                    .padding(.leading)
                    
                    Spacer()
                    
                    Button("Hide All") {
                        viewModel.selectedCalendarIDs.removeAll()
                    }
                    .padding(.trailing)
                }
                .padding(.vertical, 8)
            }
        }
        // On appear, refresh
        .onAppear {
            viewModel.reloadCalendars()
        }
        // Sheets for editing or adding local calendars
        .sheet(item: $calendarToEdit, onDismiss: {
            viewModel.reloadCalendars()
        }) { cal in
            // For example, your EditCalendarView
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
        .sheet(isPresented: $showAddCalendarSheet) {
            // For example, AddCalendarView
            AddCalendarView()
        }
    }
    
    // MARK: - Helpers

    /// Returns all local calendars that are NOT Google or Microsoft copies
    private func localNonGoogleCalendars() -> [EKCalendar] {
        let allLocal = viewModel.allCalendars.filter { $0.source.sourceType == .local }
        
        // Gather IDs of local cals that are copies of Google
        let googleSyncedIDs = Set(
            viewModel.storedUsers.flatMap { user in
                viewModel.googleToLocalCalendarMap(for: user.uniqueID).values
            }
        )
        // Gather IDs of local cals that are copies of Microsoft
        let msSyncedIDs = Set(
            viewModel.storedMsUsers.flatMap { user in
                viewModel.msToLocalCalendarMap(for: user.uniqueID).values
            }
        )
        // Return those not in either sync set
        return allLocal.filter {
            !googleSyncedIDs.contains($0.calendarIdentifier) &&
            !msSyncedIDs.contains($0.calendarIdentifier)
        }
    }

    /// Returns the local calendars that are “copies” of Google calendars for a particular user
    private func googleCopiedCalendars(for user: StoredGoogleUser) -> [EKCalendar] {
        let map = viewModel.googleToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        return viewModel.allCalendars.filter { localIDs.contains($0.calendarIdentifier) }
    }

    /// Returns local calendars that are “copies” of MS calendars for a particular user
    private func microsoftCopiedCalendars(for user: StoredMicrosoftUser) -> [EKCalendar] {
        let map = viewModel.msToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        return viewModel.allCalendars.filter { localIDs.contains($0.calendarIdentifier) }
    }

    /// Returns everything else (iCloud, Exchange, etc.) that is not local or a known Google/MS copy
    private func otherCalendars() -> [EKCalendar] {
        let googleSyncedIDs = Set(
            viewModel.storedUsers.flatMap { user in
                viewModel.googleToLocalCalendarMap(for: user.uniqueID).values
            }
        )
        let msSyncedIDs = Set(
            viewModel.storedMsUsers.flatMap { user in
                viewModel.msToLocalCalendarMap(for: user.uniqueID).values
            }
        )
        return viewModel.allCalendars.filter {
            $0.source.sourceType != .local
            && !googleSyncedIDs.contains($0.calendarIdentifier)
            && !msSyncedIDs.contains($0.calendarIdentifier)
        }
    }

    /// Toggles a calendar’s selection on/off
    private func toggleCalendar(_ cal: EKCalendar) {
        if viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier) {
            viewModel.selectedCalendarIDs.remove(cal.calendarIdentifier)
        } else {
            viewModel.selectedCalendarIDs.insert(cal.calendarIdentifier)
        }
    }
    
    // MARK: - Sign-in Helpers
    
    private func signInWithGoogle() {
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: viewModel.clientID)
        
        guard let windowScene = UIApplication.shared.connectedScenes
                .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
              let rootVC = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController
        else {
            return
        }

        GIDSignIn.sharedInstance.signIn(withPresenting: rootVC) { signInResult, error in
            if let error = error {
                print("Google Sign In error:", error.localizedDescription)
                return
            }
            if let user = signInResult?.user {
                print("Signed in user:", user.profile?.email ?? "(no email)")
                
                // Store in our logic
                viewModel.storeGoogleUserInUserDefaults(user)
                
                // If first account, start sync
                if viewModel.storedUsers.count == 1 {
                    viewModel.startGoogleCalendarSync()
                }

                // Immediate sync
                Task {
                    if let newStoredUser = viewModel.storedUsers.last {
                        await viewModel.performGoogleCalendarSync(for: newStoredUser)
                    }
                }
            }
        }
    }

    private func signInWithMicrosoft() {
        // Just call the viewModel method
        viewModel.signInWithMicrosoft()
    }
}
