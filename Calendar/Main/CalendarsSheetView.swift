import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true
    
    // We won’t have a single “isGoogleExpanded” anymore; we'll expand/collapse each user individually.
    @State private var googleExpandedStates: [UUID: Bool] = [:]

    // For editing existing calendar
    @State private var calendarToEdit: EKCalendar? = nil

    // For AddCalendarView
    @State private var showAddCalendarSheet = false

    // Replace with your actual ClientID

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    // 1) Local “On My iPhone”
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

                    // 2) For each storedUser => show a separate Google group
                    ForEach(viewModel.storedUsers, id: \.uniqueID) { user in
                        // Default to expanded if not in dictionary
                        let binding = Binding<Bool>(
                            get: { googleExpandedStates[user.uniqueID] ?? true },
                            set: { googleExpandedStates[user.uniqueID] = $0 }
                        )
                        
                        DisclosureGroup("Google (\(user.email ?? "No Email"))",
                                        isExpanded: binding) {
                            // Show the local calendars that correspond to *this user’s* googleToLocalCalendarMap
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
                                            // Typically we don't let the user rename the “Google copy” calendar
                                            // but if you want, you can present your EditCalendarView:
                                            calendarToEdit = cal
                                        },
                                        showEditButton: false
                                    )
                                }
                            }
                            
                            // Log out for this user
                            Button("Sign out from Google (\(user.email ?? ""))") {
                                viewModel.signOutFromGoogle(user: user)
                            }
                            .foregroundColor(.red)
                        }
                    }
                    
                    // 3) Other (iCloud, Exchange, etc.)
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
                    
                    // 4) Google Sign-In area
                    Section {
                        Button("Sign in with Google") {
                            signInWithGoogle()
                        }
                    }
                }
                .navigationBarTitle("Calendars", displayMode: .inline)
                .navigationBarItems(
                    trailing: Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
                )
                
                // Bottom bar
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
        .onAppear {
            viewModel.reloadCalendars()
        }
        .sheet(item: $calendarToEdit, onDismiss: {
            viewModel.reloadCalendars()
        }) { cal in
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
        .sheet(isPresented: $showAddCalendarSheet) {
            AddCalendarView()
        }
    }
    
    // MARK: - Helpers

    private func localNonGoogleCalendars() -> [EKCalendar] {
        // Gather *all* local calendars that are NOT associated with any Google user
        let allLocal = viewModel.allCalendars.filter { $0.source.sourceType == .local }
        
        // Combine all user googleToLocalCalendarMaps
        let googleSyncedIDs = Set(
            viewModel.storedUsers.flatMap { user in
                viewModel.googleToLocalCalendarMap(for: user.uniqueID).values
            }
        )
        // Filter out anything in googleSyncedIDs
        return allLocal.filter { !googleSyncedIDs.contains($0.calendarIdentifier) }
    }
    
    private func googleCopiedCalendars(for user: StoredGoogleUser) -> [EKCalendar] {
        // For a specific user, get googleToLocalCalendarMap
        let map = viewModel.googleToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        
        // Filter allCalendars by those IDs
        return viewModel.allCalendars.filter {
            localIDs.contains($0.calendarIdentifier)
        }
    }

    private func otherCalendars() -> [EKCalendar] {
        // Return calendars that are *not local*, and not in googleToLocalCalendarMap of any user
        let googleSyncedIDs = Set(
            viewModel.storedUsers.flatMap { user in
                viewModel.googleToLocalCalendarMap(for: user.uniqueID).values
            }
        )
        return viewModel.allCalendars.filter {
            $0.source.sourceType != .local && !googleSyncedIDs.contains($0.calendarIdentifier)
        }
    }

    private func toggleCalendar(_ cal: EKCalendar) {
        if viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier) {
            viewModel.selectedCalendarIDs.remove(cal.calendarIdentifier)
        } else {
            viewModel.selectedCalendarIDs.insert(cal.calendarIdentifier)
        }
    }

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
                // 1) Store the new user in our multi-user model
                viewModel.storeGoogleUserInUserDefaults(user)
                
                // 2) Start the sync timer if not started
                if viewModel.storedUsers.count == 1 {
                    viewModel.startGoogleCalendarSync()
                }
                
                // 3) Perform an immediate sync
                Task {
                    if let newStoredUser = viewModel.storedUsers.last {
                        await viewModel.performGoogleCalendarSync(for: newStoredUser)
                    }
                }
            }
        }
    }
}
