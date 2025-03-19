//
//  AddIntegrationView.swift
//  YourProject
//

import SwiftUI
import GoogleSignIn
import GoogleSignInSwift

struct AddIntegrationView: View {
    @State private var googleCalendars: [GoogleCalendarItem] = []
    @State private var isSignedIn = false
    @State private var errorMessage: String?
    
    let clientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"
    
    @ObservedObject var viewModel = CalendarViewModel.shared

    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                
                if isSignedIn {
                    Text("Signed in to Google")
                        .font(.headline)
                    
                    if let error = errorMessage {
                        Text("Error: \(error)")
                            .foregroundColor(.red)
                    }
                    
                    if googleCalendars.isEmpty {
                        Text("No calendars loaded or some were filtered out.")
                            .padding()
                    } else {
                        List(googleCalendars, id: \.id) { cal in
                            VStack(alignment: .leading) {
                                Text(cal.summary)
                                    .font(.headline)
                                if let desc = cal.description {
                                    Text(desc)
                                        .font(.subheadline)
                                }
                            }
                        }
                    }
                    
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
            .navigationBarTitle("Add Integration", displayMode: .inline)
            .padding()
        }
        .onAppear {
            restoreSignInIfNeeded()
        }
    }
}

// MARK: - Методи за логване, разлогване, четене на календари + импорт
extension AddIntegrationView {
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
        
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
        
        let scopes = ["https://www.googleapis.com/auth/calendar.readonly"]
        
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
    
    /// Зареждаме списъка с календари от Google, след което за всеки календар ще извлечем *всички* евенти,
    /// и ще ги добавим / ъпдейтнем локално (avoid duplicates).
    func loadGoogleCalendars() async {
        guard let user = GIDSignIn.sharedInstance.currentUser else {
            errorMessage = "Not signed in."
            return
        }
        
        let neededScope = "https://www.googleapis.com/auth/calendar.readonly"
        
        // 1) Проверяваме дали вече е даден scope за четене на Google Calendar
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
        
        // 2) Вземаме списък от календари
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
            
            // 3) За всеки календар -> изтегляме ВСИЧКИ събития и ги импортваме (avoid duplicates)
            var validCalendars: [GoogleCalendarItem] = []
            
            for cal in calendarList.items {
                do {
                    // Взимаме ВСИЧКИ (минали + бъдещи) събития, обработвайки pageToken
                    let allEvents = try await CalendarViewModel.shared.fetchAllEvents(forCalendarId: cal.id,
                                                                                      accessToken: accessToken)
                    
                    // 1) Намираме/създаваме локален календар (и ъпдейтваме име/цвят, ако се е променил)
                    let localCal = try CalendarViewModel.shared.findOrCreateLocalCalendar(for: cal)
                    
                    // 2) Импортираме събитията, като ъпдейтваме вече съществуващи (avoid duplicates)
                    try await CalendarViewModel.shared.importGoogleEventsAvoidingDuplicates(allEvents, into: localCal)
                    
                    // Добавяме календара към списъка за UI
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

/// Хелпър за topMostViewController
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
