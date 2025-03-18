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
    
    // Примерен clientID (в реален проект може да е в Info.plist)
    let clientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"
    
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
                        Text("No calendars loaded yet or an error occurred.")
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
        // Опит за възстановяване на предишна Google сесия
        .onAppear {
            restoreSignInIfNeeded()
        }
    }
}

// MARK: - Методи за логване, разлогване, четене на календари
extension AddIntegrationView {
    /// Опит за възстановяване на предишна Google Sign-In сесия
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
    
    /// Логика за Sign In с искане на calendar.readonly scope
    func signIn() {
        guard let topVC = UIApplication.shared.topMostViewController() else {
            return
        }
        
        // Създаваме конфигурация
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config
        
        // Списъкът със scopes, които искаме – напр. четене на календар
        let scopes = ["https://www.googleapis.com/auth/calendar.readonly"]
        
        // Извикваме signIn, но с `additionalScopes`
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
    
    /// Sign Out (без да унищожаваме refresh токена)
    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        isSignedIn = false
        googleCalendars = []
    }
    
    /// Заявка към Google Calendar API за да извлечем списък с календари
    ///
    /// - Ако текущият потребител *няма* още `calendar.readonly` scope,
    ///   опитваме да го добавим (user.addScopes).
    func loadGoogleCalendars() async {
        guard let user = GIDSignIn.sharedInstance.currentUser else {
            errorMessage = "Not signed in."
            return
        }
        
        // 1) Убедете се, че имаме календарен scope
        let neededScope = "https://www.googleapis.com/auth/calendar.readonly"
        
        // Ако потребителят все още няма нужното scope, го добавяме
        if !(user.grantedScopes?.contains(neededScope) ?? false) {
            guard let topVC = UIApplication.shared.topMostViewController() else { return }
            
            do {
                // addScopes ползва completion блок, но може да се "await"-не чрез continuation
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
        
        // 2) Вече трябва да имаме нужното scope, правим заявка
        let accessToken = GIDSignIn.sharedInstance.currentUser?.accessToken.tokenString ?? ""
        print("accessToken: \(accessToken)")
        
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
            self.googleCalendars = calendarList.items
            
        } catch {
            self.errorMessage = "Fetch error: \(error.localizedDescription)"
        }
    }
}

// MARK: - Примерни модели за декодиране на Google Calendar List JSON
struct GoogleCalendarList: Codable {
    let items: [GoogleCalendarItem]
}

struct GoogleCalendarItem: Codable {
    let id: String
    let summary: String
    let description: String?
}

/// Хелпър за намиране на topMostViewController (нужно при signIn(withPresenting:...))
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
