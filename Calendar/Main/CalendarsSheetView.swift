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
            Form {
                // 1) Local “On My iPhone” section
                Section {
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
                            .listRowSeparator(.hidden)
                        }
                    }
                }
                Section {
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
                            .listRowSeparator(.hidden)
                        }
                    }
                }
                Section {
                    Text("Google calendars")
                }
                .listRowBackground(Color(UIColor.systemGroupedBackground))

                // 2) For всеки Google потребител
                ForEach(viewModel.storedUsers, id: \.uniqueID) { user in
                    let binding = Binding<Bool>(
                        get: { googleExpandedStates[user.uniqueID] ?? true },
                        set: { googleExpandedStates[user.uniqueID] = $0 }
                    )
                    Section {
                        DisclosureGroup(isExpanded: binding) {
                            // Child content за този Google потребител
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
                                            calendarToEdit = cal
                                        },
                                        showEditButton: false
                                    )
                                    .listRowSeparator(.hidden)
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
                                    Image(systemName: "person.crop.circle")
                                        .resizable()
                                        .frame(width: 28, height: 28)
                                }
                                
                                Text("\(user.email ?? "No Email")")
                                    .padding(.leading, 4)
                            }
                            
                        }
                    }
                }
               
                Section {
                    Text("Microsoft calendars")
                }
                .listRowBackground(Color(UIColor.systemGroupedBackground))

                // 3) For всеки Microsoft потребител
                ForEach(viewModel.storedMsUsers, id: \.uniqueID) { user in
                    let binding = Binding<Bool>(
                        get: { msExpandedStates[user.uniqueID] ?? true },
                        set: { msExpandedStates[user.uniqueID] = $0 }
                    )
                    Section {
                        DisclosureGroup(isExpanded: binding) {
                            // Child content за този Microsoft потребител
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
                                    .listRowSeparator(.hidden)
                                }
                            }
                            
                            // Sign-out button for Microsoft
                            Button("Sign out") {
                                viewModel.signOutFromMicrosoft(user: user)
                            }
                            .foregroundColor(.red)
                            
                        } label: {
                            HStack {
                                // Ако пазите avatar URL и за Microsoft, заредете го с AsyncImage
                                Image(systemName: "person.circle")
                                    .resizable()
                                    .frame(width: 28, height: 28)
                                
                                Text("\(user.email ?? "No Email")")
                                    .padding(.leading, 4)
                            }
                        }
                    }
                }
        
                Section {
                    Button(action: {
                        showAddCalendarSheet = true
                    }) {
                        HStack {
                            Image(systemName: "applelogo")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 28, height: 28)
                            Text("Add Local Calendar")
                        }
                    }
                    .buttonStyle(PlainButtonStyle())
                }
                // 5) Бутоните за Sign In
                Section {
                    // Google
                    Button(action: signInWithGoogle) {
                        HStack {
                            Image("google_icon")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 28, height: 28)
                            Text("Sign in with Google")
                        }
                    }
                    .buttonStyle(PlainButtonStyle())
                }
                .listSectionSpacing(8)

                Section {
                    // Microsoft
                    Button(action: signInWithMicrosoft) {
                        HStack {
                            Image("microsoft_icon")
                                .resizable()
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 28, height: 28)
                            Text("Sign in with Microsoft")
                                .foregroundColor(.primary)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                   
                }
            }
            .listSectionSpacing(8)
            .navigationBarTitle("Calendars", displayMode: .inline)
            // Преместваме “Hide All” горе вляво с иконка на Apple, а “Done” вдясно
            .navigationBarItems(
                leading:
                    Button(action: {
                        if viewModel.selectedCalendarIDs.isEmpty {
                            // Няма селектирани календари → селектирай всички
                            let allIDs = viewModel.allCalendars.map(\.calendarIdentifier)
                            viewModel.selectedCalendarIDs = Set(allIDs)
                        } else {
                            // Има поне един селектиран → раз-дeselect-ваме всички
                            viewModel.selectedCalendarIDs.removeAll()
                        }
                    }) {
                        Text(viewModel.selectedCalendarIDs.isEmpty ? "Select All" : "Deselect All")
                    },
                trailing:
                    Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
            )

        }
        // On appear, refresh
        .onAppear {
            viewModel.reloadCalendars()
        }
        // Sheets за редактиране или добавяне на локален календар
        .sheet(item: $calendarToEdit, onDismiss: {
            viewModel.reloadCalendars()
        }) { cal in
            // Вашият EditCalendarView
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
        .sheet(isPresented: $showAddCalendarSheet) {
            // Вашият AddCalendarView
            AddCalendarView()
        }
    }
    
    // MARK: - Helpers

    private func localNonGoogleCalendars() -> [EKCalendar] {
        let allLocal = viewModel.allCalendars.filter { $0.source.sourceType == .local }
        
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
        
        return allLocal.filter {
            !googleSyncedIDs.contains($0.calendarIdentifier) &&
            !msSyncedIDs.contains($0.calendarIdentifier)
        }
    }

    private func googleCopiedCalendars(for user: StoredGoogleUser) -> [EKCalendar] {
        let map = viewModel.googleToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        return viewModel.allCalendars.filter { localIDs.contains($0.calendarIdentifier) }
    }

    private func microsoftCopiedCalendars(for user: StoredMicrosoftUser) -> [EKCalendar] {
        let map = viewModel.msToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        return viewModel.allCalendars.filter { localIDs.contains($0.calendarIdentifier) }
    }

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
        // Просто извикваме съответния метод от ViewModel
        viewModel.signInWithMicrosoft()
    }
}
