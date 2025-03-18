import SwiftUI
import GoogleSignIn
import GoogleSignInSwift

/// Примерен SwiftUI изглед, който прави Google Sign-In, иска календарен scope при нужда и чете Google Calendar.
struct AddIntegrationView: View {
    // Съхраняваме календарите, които сме извлекли от Google
    @State private var googleCalendars: [GoogleCalendarItem] = []
    
    // Дали сме логнати
    @State private var isSignedIn = false
    
    // Показваме ли грешка (ако има)
    @State private var errorMessage: String?
    
    // Примерен clientID
    let clientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"
    
    // ViewModel, в който пазим googleCalendars глобално
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
                    
                    Button("Load Google Calendars") {
                        Task {
                            await loadGoogleCalendars()
                        }
                    }
                    
                    Button("Sign Out") {
                        signOut()
                    }
                    .foregroundColor(.red)
                    
                } else {
                    // Бутон за логин с Google
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

// MARK: - Методи за логване, разлогване, четене на календари
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
        viewModel.googleCalendars = []
    }
    
    /// Зареждаме списъка с календари от Google, след което за всеки календар опитваме да заредим евентите.
    /// Ако е успешно - добавяме го, ако не - пропускаме го.
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
            
            // 3) Филтрираме: за всеки календар, опитваме да заредим евентите му.
            var validCalendars: [GoogleCalendarItem] = []
            
            for cal in calendarList.items {
                let calId = cal.id
                let canFetch = await canFetchEvents(forCalendarId: calId, accessToken: accessToken)
                if canFetch {
                    // Ако успешно може да заредим събития => добавяме го
                    validCalendars.append(cal)
                } else {
                    print("Skipping calendar \(calId) due to fetch error or HTTP error.")
                }
            }
            
            // 4) Записваме филтрираните календари
            DispatchQueue.main.async {
                self.googleCalendars = validCalendars
                self.viewModel.googleCalendars = validCalendars
            }
            
        } catch {
            self.errorMessage = "Fetch error: \(error.localizedDescription)"
        }
    }
    
    /// Примерен метод, който тества дали могат да се прочетат евентите на даден календар.
    /// Ако получим 2xx отговор => true, иначе (404 / 403 / etc) => false
    private func canFetchEvents(forCalendarId calId: String, accessToken: String) async -> Bool {
        guard let eventsURL = URL(string: "https://www.googleapis.com/calendar/v3/calendars/\(calId)/events") else {
            return false
        }
        
        var eventsRequest = URLRequest(url: eventsURL)
        eventsRequest.httpMethod = "GET"
        eventsRequest.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        do {
            let (_, response) = try await URLSession.shared.data(for: eventsRequest)
            guard let httpResponse = response as? HTTPURLResponse,
                  (200..<300).contains(httpResponse.statusCode) else {
                // Не е успешен статус => връщаме false
                return false
            }
            // Успешно
            return true
        } catch {
            // Грешка (напр. връзка) => false
            return false
        }
    }
}

// Примерни модели
struct GoogleCalendarList: Codable {
    let items: [GoogleCalendarItem]
}

struct GoogleCalendarItem: Codable, Hashable {
    let id: String
    let summary: String
    let description: String?
    
    // Добавете, ако го има в JSON-а от Google
    let colorId: String?
    let backgroundColor: String?
    let foregroundColor: String?
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
