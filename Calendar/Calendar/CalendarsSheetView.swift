import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift
import MSAL
import SafariServices

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    
    @ObservedObject var viewModel: CalendarViewModel = .shared
    
    // Disclosure controls
    @State private var showICloudSheet     = false
    @State private var iCloudExpanded      = true
    @State private var isOtherExpanded     = true
    @State private var googleExpandedStates:    [UUID: Bool] = [:]
    @State private var msExpandedStates:        [UUID: Bool] = [:]
    
    // Editing / Adding local calendars
    @State private var calendarToEdit: EKCalendar? = nil
    @State private var showAddCalendarSheet = false
    
    var body: some View {
        NavigationView {
            Form {
                // 1) iCloud
                iCloudSection
                
                // 2) Other
                otherSection
                
                // 3) Google
                googleSection
                
                // 4) Microsoft
                microsoftSection
                
                // 5) Add new local calendar
                addCalendarSection
                
                // 6) “Share with iCloud Calendar” button
                shareCalendarsSection
                
                // 7) Google sign-in
                googleSignInSection
                
                // 8) Microsoft sign-in
                microsoftSignInSection
            }
            .listSectionSpacing(8)
            .navigationBarTitle("Calendars", displayMode: .inline)
            // Navigation bar items
            .navigationBarItems(
                leading: selectAllButton,
                trailing: doneButton
            )
        }
        // Reload calendars each time the sheet appears
        .onAppear {
            viewModel.reloadCalendars()
        }
        // Sheet за редактиране на календар
        .sheet(item: $calendarToEdit, onDismiss: {
            viewModel.reloadCalendars()
        }) { cal in
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
        // Sheet за добавяне на календар
        .sheet(isPresented: $showAddCalendarSheet) {
            AddCalendarView()
        }
    }
}

// MARK: - Subviews / Sections

extension CalendarsSheetView {
    
    // iCloud Section
    private var iCloudSection: some View {
        Section {
            DisclosureGroup("iCloud", isExpanded: $iCloudExpanded) {
                ForEach(viewModel.localOrICloudCalendars(), id: \.calendarIdentifier) { cal in
                    CalendarRowView(
                        calendar: cal,
                        isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                        toggleAction: toggleCalendar,
                        editAction: { calendarToEdit = cal },
                        showEditButton: true
                    )
                    .listRowSeparator(.hidden)
                }
            }
        }
    }
    
    // Other Section
    private var otherSection: some View {
        Section {
            DisclosureGroup("Other", isExpanded: $isOtherExpanded) {
                ForEach(viewModel.otherCalendars(), id: \.calendarIdentifier) { cal in
                    CalendarRowView(
                        calendar: cal,
                        isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                        toggleAction: toggleCalendar,
                        editAction: { calendarToEdit = cal },
                        showEditButton: true
                    )
                    .listRowSeparator(.hidden)
                }
            }
        }
    }
    
    // Google Section
    private var googleSection: some View {
        Group {
            // Label “Google calendars”
            if !viewModel.storedUsers.isEmpty {
                Section {
                    Text("Google calendars")
                }
                .listRowBackground(Color(UIColor.systemGroupedBackground))
            }
            
            // For each Google user
            ForEach(viewModel.storedUsers, id: \.uniqueID) { user in
                let binding = Binding<Bool>(
                    get: { googleExpandedStates[user.uniqueID] ?? true },
                    set: { googleExpandedStates[user.uniqueID] = $0 }
                )
                
                Section {
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
                                    editAction: { calendarToEdit = cal },
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
                        HStack {
                            // Show user avatar if we have one
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
        }
    }
    
    // Microsoft Section
    private var microsoftSection: some View {
        Group {
            // Label “Microsoft calendars”
            if !viewModel.storedMsUsers.isEmpty {
                Section {
                    Text("Microsoft calendars")
                }
                .listRowBackground(Color(UIColor.systemGroupedBackground))
            }
            
            // For each Microsoft user
            ForEach(viewModel.storedMsUsers, id: \.uniqueID) { user in
                let binding = Binding<Bool>(
                    get: { msExpandedStates[user.uniqueID] ?? true },
                    set: { msExpandedStates[user.uniqueID] = $0 }
                )
                
                Section {
                    DisclosureGroup(isExpanded: binding) {
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
                                    editAction: { calendarToEdit = cal },
                                    showEditButton: false
                                )
                                .listRowSeparator(.hidden)
                            }
                        }
                        
                        // Sign-out button
                        Button("Sign out") {
                            viewModel.signOutFromMicrosoft(user: user)
                        }
                        .foregroundColor(.red)
                    } label: {
                        HStack {
                            // If you have an avatar URL, load it similarly with AsyncImage
                            Image(systemName: "person.circle")
                                .resizable()
                                .frame(width: 28, height: 28)
                            
                            Text("\(user.email ?? "No Email")")
                                .padding(.leading, 4)
                        }
                    }
                }
            }
        }
    }
    
    // Section: Add local calendar
    private var addCalendarSection: some View {
        Section {
            Button(action: {
                showAddCalendarSheet = true
            }) {
                HStack {
                    Image("icloud_icon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 28, height: 28)
                    Text("Add iCloud Calendar")
                }
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
    
    // Section: “Share with iCloud Calendar”
    private var shareCalendarsSection: some View {
        Section {
            Button(action: {
                showICloudSheet = true
            }) {
                HStack {
                    Image(systemName: "link.icloud.fill")
                        .foregroundStyle(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(red: 0.90, green: 0.95, blue: 1.0), // Светло синьо
                                      Color(red: 0.75, green: 0.85, blue: 1.0),
                                      Color(red: 0.60, green: 0.75, blue: 1.0),
                                      Color(red: 0.45, green: 0.65, blue: 0.90), // Още по-тъмно
                                      Color.blue
                                    ]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: 28, height: 28)

                    
                    Text("Share calendars with iCloud Calendar")
                }
            }
            .buttonStyle(PlainButtonStyle())
            .sheet(isPresented: $showICloudSheet) {
                if let url = URL(string: "https://www.icloud.com/calendar/") {
                    SafariView(url: url)
                }
            }
        }
    }
    
    // Section: Google sign-in
    private var googleSignInSection: some View {
        Section {
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
    }
    
    // Section: Microsoft sign-in
    private var microsoftSignInSection: some View {
        Section {
            Button(action: signInWithMicrosoft) {
                HStack {
                    Image("microsoft_icon")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 28, height: 28)
                    Text("Sign in with Microsoft")
                }
            }
            .buttonStyle(PlainButtonStyle())
        }
    }
}

// MARK: - Navigation Bar Items

extension CalendarsSheetView {
    private var selectAllButton: some View {
        Button(action: {
            let allIDs = Set(viewModel.allCalendars.map { $0.calendarIdentifier })
            if viewModel.selectedCalendarIDs.count == allIDs.count {
                // All selected → deselect all
                viewModel.selectedCalendarIDs.removeAll()
            } else {
                // Some not selected → select all
                viewModel.selectedCalendarIDs = allIDs
            }
        }) {
            Text(
                viewModel.selectedCalendarIDs.count == viewModel.allCalendars.count
                ? "Deselect All"
                : "Select All"
            )
        }
    }

    private var doneButton: some View {
        Button("Done") {
            presentationMode.wrappedValue.dismiss()
        }
    }
}

// MARK: - Helpers

extension CalendarsSheetView {
    
    /// Превключва calendar в selectedCalendarIDs
    private func toggleCalendar(_ cal: EKCalendar) {
        if viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier) {
            viewModel.selectedCalendarIDs.remove(cal.calendarIdentifier)
        } else {
            viewModel.selectedCalendarIDs.insert(cal.calendarIdentifier)
        }
    }
    
    /// Връща локалните (EKCalendar), които са копирани от Google за даден user.
    private func googleCopiedCalendars(for user: StoredGoogleUser) -> [EKCalendar] {
        let map = viewModel.googleToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        return viewModel.allCalendars.filter { localIDs.contains($0.calendarIdentifier) }
    }
    
    /// Връща локалните (EKCalendar), които са копирани от Microsoft за даден user.
    private func microsoftCopiedCalendars(for user: StoredMicrosoftUser) -> [EKCalendar] {
        let map = viewModel.msToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        return viewModel.allCalendars.filter { localIDs.contains($0.calendarIdentifier) }
    }
    
    // MARK: - Sign-in Methods
    
    private func signInWithGoogle() {
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: viewModel.clientID)
        
        guard
            let windowScene = UIApplication.shared.connectedScenes
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
                // Запазваме user в UserDefaults
                viewModel.storeGoogleUserInUserDefaults(user)
                
                // Ако е първи акаунт, почваме sync
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
        viewModel.signInWithMicrosoft()
    }
}

// MARK: - SafariView

struct SafariView: UIViewControllerRepresentable {
    let url: URL
    
    func makeUIViewController(context: Context) -> SFSafariViewController {
        SFSafariViewController(url: url)
    }
    
    func updateUIViewController(_ uiViewController: SFSafariViewController, context: Context) {
        // Няма нужда от обновяване
    }
}
