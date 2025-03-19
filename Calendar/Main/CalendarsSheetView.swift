import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    // За разгъване на DisclosureGroup
    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true
    @State private var isGoogleExpanded     = true

    // За Edit
    @State private var calendarToEdit: EKCalendar? = nil
    
    // ========== Google Sign-In променливи ==========
    @State private var isSignedIn = false
    @State private var googleCalendars: [GoogleCalendarItem] = []
    @State private var errorMessage: String?

    let clientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    let googleLocalCalendarIDs = Set(viewModel.googleToLocalCalendarMapping.values)

                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(
                            viewModel.allCalendars.filter { cal in
                                cal.source.sourceType == .local
                                && !googleLocalCalendarIDs.contains(cal.calendarIdentifier)
                            },
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
                    
                    DisclosureGroup("Google Calendars", isExpanded: $isGoogleExpanded) {
                        ForEach(
                            viewModel.allCalendars.filter { cal in
                                cal.source.sourceType == .local
                                && googleLocalCalendarIDs.contains(cal.calendarIdentifier)
                            },
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
                    
                    // =============== Google Integration Section ===============
                    Section(header: Text("Google Integration")) {
                        if let error = errorMessage {
                            Text("Грешка: \(error)")
                                .foregroundColor(.red)
                        }
                        
                        if isSignedIn {
                            Button("Load Google Calendars & Events") {
                                Task {
                                    await loadGoogleCalendars()
                                }
                            }

                            Button("Sign Out") {
                                signOut()
                            }
                            .foregroundColor(.red)
                            
                        } else {
                            GoogleSignInButton {
                                signIn()
                            }
                            .frame(width: 200, height: 50)
                        }
                    }
                }
                .navigationBarTitle("Calendars", displayMode: .inline)
                .navigationBarItems(
                    trailing: Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
                )

                // Долни бутони
                HStack {
                    Menu("Add Calendar") {
                        Button("Add Local Calendar") {
                            // Тук може да отвориш sheet за създаване на локален календар
                            // или директно да вмъкнеш логика
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
            Task {
                await loadGoogleCalendars()
            }

            // Презареждаме системните (EventKit) календари
            viewModel.reloadCalendars()
            // Опит за възстановяване на Google сесия
            restoreSignInIfNeeded()
        }
        // Sheet за Edit (EventKit календар)
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
}

// MARK: - Google Sign-In helpers
extension CalendarsSheetView {
    func restoreSignInIfNeeded() {
        GIDSignIn.sharedInstance.restorePreviousSignIn { signInResult, error in
            if let error = error {
                self.errorMessage = "Restore error: \(error.localizedDescription)"
                return
            }
            guard let _ = signInResult else {
                // Няма налична сесия
                return
            }
            // Има валидна сесия
            self.isSignedIn = true
            self.errorMessage = nil
        }
    }

    func signIn() {
        guard let topVC = UIApplication.shared.topMostViewController() else {
            return
        }
        
        // 1) Инициализираме GIDConfiguration
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
        
        // 2) Тук ползваме "calendar" (пълен достъп),
        // вместо "calendar.readonly", за да можем да редактираме/трием/създаваме събития.
        let scopes = ["https://www.googleapis.com/auth/calendar"]
        
        // 3) Стартираме Google Sign-In
        GIDSignIn.sharedInstance.signIn(
            withPresenting: topVC,
            hint: nil,
            additionalScopes: scopes
        ) { signInResult, error in
            if let error = error {
                self.errorMessage = "Sign-in error: \(error.localizedDescription)"
                return
            }
            guard let signInResult = signInResult else {
                self.errorMessage = "No SignInResult found."
                return
            }
            // Успешен логин
            self.isSignedIn = true
            self.errorMessage = nil
        }
    }

    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        isSignedIn = false
        googleCalendars = []
    }

    func loadGoogleCalendars() async {
        guard let user = GIDSignIn.sharedInstance.currentUser else {
            errorMessage = "Not signed in."
            return
        }
        
        // Тук също ползваме "calendar", не "calendar.readonly"
        let neededScope = "https://www.googleapis.com/auth/calendar"
        
        // 1) Проверяваме дали имаме нужния scope
        if !(user.grantedScopes?.contains(neededScope) ?? false) {
            guard let topVC = UIApplication.shared.topMostViewController() else { return }
            
            do {
                try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Void, Error>) in
                    user.addScopes([neededScope], presenting: topVC) { newUser, error in
                        if let error = error {
                            continuation.resume(throwing: error)
                        } else {
                            continuation.resume(returning: ())
                        }
                    }
                }

            } catch {
                self.errorMessage = "Потребителят отказа календарен достъп: \(error.localizedDescription)"
                return
            }
        }
        
        // 2) Вземаме списък от календари (GET)
        let accessToken = user.accessToken.tokenString
        guard let url = URL(string: "https://www.googleapis.com/calendar/v3/users/me/calendarList") else {
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse,
                  (200..<300).contains(httpResponse.statusCode) else {
                let respStr = String(data: data, encoding: .utf8) ?? ""
                self.errorMessage = "HTTP Error: \(respStr)"
                print(respStr)
                return
            }
            
            let decoder = JSONDecoder()
            let calendarList = try decoder.decode(GoogleCalendarList.self, from: data)
            
            var validCalendars: [GoogleCalendarItem] = []
            
            // 3) За всеки календар -> изтегляме ВСИЧКИ събития и ги импортваме
            for cal in calendarList.items {
                do {
                    let allEvents = try await CalendarViewModel.shared.fetchAllEvents(
                        forCalendarId: cal.id,
                        accessToken: accessToken
                    )
                    
                    let localCal = try CalendarViewModel.shared.findOrCreateLocalCalendar(for: cal)
                    
                    try await CalendarViewModel.shared.importGoogleEventsAvoidingDuplicates(
                        allEvents, into: localCal
                    )
                    
                    validCalendars.append(cal)
                } catch {
                    print("Skipping calendar \(cal.id) due to fetch error: \(error.localizedDescription)")
                }
            }
            
            // 4) Записваме филтрираните календари (за UI)
            DispatchQueue.main.async {
                self.googleCalendars = validCalendars
            }
            
        } catch {
            self.errorMessage = "Fetch error: \(error.localizedDescription)"
        }
    }
}

// MARK: - TopMostViewController
extension UIApplication {
    func topMostViewController(_ base: UIViewController? = nil) -> UIViewController? {
        let baseVC = base ?? keyWindow?.rootViewController
        if let nav = baseVC as? UINavigationController {
            return topMostViewController(nav.visibleViewController)
        }
        if let tab = baseVC as? UITabBarController {
            return topMostViewController(tab.selectedViewController)
        }
        if let presented = baseVC?.presentedViewController {
            return topMostViewController(presented)
        }
        return baseVC
    }
}
