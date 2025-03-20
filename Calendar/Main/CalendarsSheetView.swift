import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true
    @State private var isIntegrateExpanded  = true

    @State private var calendarToEdit: EKCalendar? = nil

    let clientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(
                            viewModel.allCalendars.filter { $0.source.sourceType == .local },
                            id: \.calendarIdentifier
                        ) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    calendarToEdit = cal
                                }
                            )
                        }
                    }

                    DisclosureGroup("Other", isExpanded: $isOtherExpanded) {
                        ForEach(
                            viewModel.allCalendars.filter { $0.source.sourceType != .local },
                            id: \.calendarIdentifier
                        ) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    calendarToEdit = cal
                                }
                            )
                        }
                    }

                    DisclosureGroup("Integrate calendar", isExpanded: $isIntegrateExpanded) {
                        if let user = viewModel.googleUser {
                            Text("Логнат сте като: \(user.profile?.email ?? "(няма email)")")
                                .padding(.vertical, 4)
                            
                            Button("Log out from Google") {
                                GIDSignIn.sharedInstance.signOut()
                                viewModel.googleUser = nil
                                viewModel.stopGoogleCalendarSync()
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

                HStack {
                    Menu("Add Calendar") {
                        Button("Add Local Calendar") {
                            // ...
                        }
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
        guard let rootVC = UIApplication.shared.windows.first?.rootViewController else {
            return
        }
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
