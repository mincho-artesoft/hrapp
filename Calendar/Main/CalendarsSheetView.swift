import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true
    
    // Вместо един isGoogleExpanded, ползваме речник на потребителите:
    @State private var googleExpandedStates: [UUID: Bool] = [:]

    // За редакция на вече създаден календар:
    @State private var calendarToEdit: EKCalendar? = nil

    // Sheet за добавяне на нов календар:
    @State private var showAddCalendarSheet = false

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

                    // 2) За всеки Google потребител => отделен DisclosureGroup
                    ForEach(viewModel.storedUsers, id: \.uniqueID) { user in
                        // Binding за expanded state (ако няма запис в речника, default е true)
                        let binding = Binding<Bool>(
                            get: { googleExpandedStates[user.uniqueID] ?? true },
                            set: { googleExpandedStates[user.uniqueID] = $0 }
                        )
                        
                        DisclosureGroup(isExpanded: binding) {
                            // Секцията на групата (child content):
                            
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
                                            // по желание може да се позволи rename
                                            calendarToEdit = cal
                                        },
                                        showEditButton: false
                                    )
                                }
                            }
                            
                            // Бутона за sign out
                            Button("Sign out") {
                                viewModel.signOutFromGoogle(user: user)
                            }
                            .foregroundColor(.red)
                            
                        } label: {
                            // Label на DisclosureGroup (където показваме аватар + имейл)
                            HStack {
                                if let photoURLString = user.photoURL,
                                   let photoURL = URL(string: photoURLString) {
                                    // iOS 15+ AsyncImage
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
                                    // Ако няма photoURL
                                    Image(systemName: "person.crop.circle")
                                        .resizable()
                                        .frame(width: 28, height: 28)
                                }
                                
                                Text("Google calendars (\(user.email ?? "No Email"))")
                                    .padding(.leading, 4)
                            }
                        }
                    }
                    
                    // 3) Други (iCloud, Exchange и др.)
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
                    
                    // 4) Google Sign-In бутон
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
                        .buttonStyle(PlainButtonStyle()) // Или .borderlessButtonStyle()
                    }
                }
                .navigationBarTitle("Calendars", displayMode: .inline)
                .navigationBarItems(
                    trailing: Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
                )
                
                // Долна лента с бутони
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
            // Например EditCalendarView
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
        .sheet(isPresented: $showAddCalendarSheet) {
            // Например AddCalendarView
            AddCalendarView()
        }
    }
    
    // MARK: - Helpers

    private func localNonGoogleCalendars() -> [EKCalendar] {
        // Събираме всички "Local" календари
        let allLocal = viewModel.allCalendars.filter { $0.source.sourceType == .local }
        
        // Събираме ID-та на локалните календари, които са копирани от Google
        let googleSyncedIDs = Set(
            viewModel.storedUsers.flatMap { user in
                viewModel.googleToLocalCalendarMap(for: user.uniqueID).values
            }
        )
        // Връщаме онези, които не са в Google map
        return allLocal.filter { !googleSyncedIDs.contains($0.calendarIdentifier) }
    }
    
    private func googleCopiedCalendars(for user: StoredGoogleUser) -> [EKCalendar] {
        // Намираме кои локални календари са "Google copies" за този user
        let map = viewModel.googleToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        
        return viewModel.allCalendars.filter {
            localIDs.contains($0.calendarIdentifier)
        }
    }

    private func otherCalendars() -> [EKCalendar] {
        // Всички, които не са .local, и не са копие от Google
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
        // ClientID е налично във viewModel
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
                
                // Записваме в нашата логика
                viewModel.storeGoogleUserInUserDefaults(user)
                
                // Ако е първият акаунт, стартираме sync
                if viewModel.storedUsers.count == 1 {
                    viewModel.startGoogleCalendarSync()
                }
                
                // Правим immediate sync
                Task {
                    if let newStoredUser = viewModel.storedUsers.last {
                        await viewModel.performGoogleCalendarSync(for: newStoredUser)
                    }
                }
            }
        }
    }
}
