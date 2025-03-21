import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    @State private var isOnMyIphoneExpanded = true
    @State private var isGoogleExpanded     = true
    @State private var isOtherExpanded      = true
    @State private var isIntegrateExpanded  = true

    // За редакция на вече съществуващ календар
    @State private var calendarToEdit: EKCalendar? = nil

    // За показване на AddCalendarView (нов календар)
    @State private var showAddCalendarSheet = false

    let clientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    // 1) Група с локални „On My iPhone“ (които НЕ са Google копия)
                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(localNonGoogleCalendars(), id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    calendarToEdit = cal
                                },
                                showEditButton: true  // показваме info бутона
                            )
                        }
                    }

                    // 2) Група с локални календари, които са копие на Google
                    DisclosureGroup("Google Calendars", isExpanded: $isGoogleExpanded) {
                        ForEach(googleCopiedCalendars(), id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    // няма редакция
                                },
                                showEditButton: false
                            )
                        }
                    }

                    // 3) Група с „други“ (iCloud, Exchange и т.н.)
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

                    // 4) Група за Google Sign-In / логване
                    DisclosureGroup("Integrate calendar", isExpanded: $isIntegrateExpanded) {
                        if let user = viewModel.googleUser {
                            Text("Логнат сте като: \(user.profile?.email ?? "(няма email)")")
                                .padding(.vertical, 4)

                            Button("Log out from Google") {
                                // Първо стандартното signOut
                                GIDSignIn.sharedInstance.signOut()
                                viewModel.googleUser = nil
                                viewModel.stopGoogleCalendarSync()
                                viewModel.signOutFromGoogle()
                            }
                        } else {
                            Button("Sign in with Google") {
                                signInWithGoogle()
                            }
                        }
                    }
                }
                .navigationBarTitle("Calendars", displayMode: .inline)
                .navigationBarItems(
                    trailing: Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
                )

                // В долната лента - бутон "Add Local Calendar" и "Hide All"
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
        // .sheet за редактиране на вече съществуващ календар
        .sheet(item: $calendarToEdit, onDismiss: {
            viewModel.reloadCalendars()
        }) { cal in
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
        // .sheet за създаване на нов (AddCalendarView)
        .sheet(isPresented: $showAddCalendarSheet) {
            AddCalendarView()  // директно в нов sheet
        }
    }
    
    // MARK: - Помощни методи

    private func localNonGoogleCalendars() -> [EKCalendar] {
        let googleSyncedIDs = Set(viewModel.googleToLocalCalendarMap.values)
        return viewModel.allCalendars.filter {
            $0.source.sourceType == .local &&
            !googleSyncedIDs.contains($0.calendarIdentifier)
        }
    }

    private func googleCopiedCalendars() -> [EKCalendar] {
        let googleSyncedIDs = Set(viewModel.googleToLocalCalendarMap.values)
        return viewModel.allCalendars.filter {
            googleSyncedIDs.contains($0.calendarIdentifier)
        }
    }

    private func otherCalendars() -> [EKCalendar] {
        let googleSyncedIDs = Set(viewModel.googleToLocalCalendarMap.values)
        return viewModel.allCalendars.filter {
            $0.source.sourceType != .local &&
            !googleSyncedIDs.contains($0.calendarIdentifier)
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
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientID)
        
        // Query the active UIWindowScene
        guard let windowScene = UIApplication.shared.connectedScenes
            .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
              let rootVC = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController
        else {
            return
        }

        // Present the Google sign-in flow using the obtained root view controller
        GIDSignIn.sharedInstance.signIn(withPresenting: rootVC) { signInResult, error in
            if let error = error {
                print("Google Sign In error:", error.localizedDescription)
                return
            }
            if let user = signInResult?.user {
                print("Signed in user:", user.profile?.email ?? "(no email)")
                Task { @MainActor in
                    viewModel.googleUser = user
                    viewModel.startGoogleCalendarSync()
                    await viewModel.performGoogleCalendarSync()
                }
            }
        }
    }

}
