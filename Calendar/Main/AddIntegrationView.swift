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

// MARK: - Методи за логване, разлогване, четене на календари + импорт в локални календари
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
    
    /// Зареждаме списъка с календари от Google, след което за всеки календар ще извлечем и евентите му,
    /// и ги импортираме в локален календар.
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
            
            // 3) За всеки календар извличаме евентите -> записваме ги в локален
            var validCalendars: [GoogleCalendarItem] = []
            
            for cal in calendarList.items {
                do {
                    // Вземаме евентите за този Google календар
                    let events = try await fetchEvents(forCalendarId: cal.id, accessToken: accessToken)
                    
                    // Импортираме евентите в локален календар:
                    // 1) Намираме/създаваме EKCalendar (On My iPhone) за този Google календар
                    let localCal = try CalendarViewModel.shared.findOrCreateLocalCalendar(for: cal)
                    
                    // 2) Импортираме събитията
                    //    Ако искате да избягвате дубликати, ползвайте importGoogleEventsAvoidingDuplicates(...)
                    try await CalendarViewModel.shared.importGoogleEvents(events, into: localCal)
                    
                    // Добавяме календара към списъка за UI
                    validCalendars.append(cal)
                    
                } catch {
                    // Ако не успеем да заредим евенти или да създадем календар, го пропускаме
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
    
    /// Връща списък от евентите на даден Google календар.
    private func fetchEvents(forCalendarId calId: String, accessToken: String) async throws -> [GoogleEvent] {
        // Пример: включваме future events от днес нататък
        let nowISO = ISO8601DateFormatter().string(from: Date())
        guard let eventsURL = URL(string: "https://www.googleapis.com/calendar/v3/calendars/\(calId)/events?timeMin=\(nowISO)&singleEvents=true&orderBy=startTime") else {
            throw URLError(.badURL)
        }
        
        var eventsRequest = URLRequest(url: eventsURL)
        eventsRequest.httpMethod = "GET"
        eventsRequest.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: eventsRequest)
        
        guard let httpResponse = response as? HTTPURLResponse,
              (200..<300).contains(httpResponse.statusCode) else {
            let statusCode = (response as? HTTPURLResponse)?.statusCode ?? -1
            let respStr = String(data: data, encoding: .utf8) ?? ""
            throw NSError(
                domain: "CalendarFetch",
                code: statusCode,
                userInfo: [NSLocalizedDescriptionKey: "HTTP Error: \(respStr)"]
            )
        }

        let decoder = JSONDecoder()
        let eventsList = try decoder.decode(GoogleEventsList.self, from: data)
        return eventsList.items
    }
}

// MARK: - Модели
struct GoogleCalendarList: Codable {
    let items: [GoogleCalendarItem]
}

struct GoogleCalendarItem: Codable, Hashable {
    let id: String
    let summary: String
    let description: String?
    
    let colorId: String?
    let backgroundColor: String? // <- Hex стринг (примерно "#9fe1e7")
    let foregroundColor: String? // <- Hex стринг за текста
}

struct GoogleEventsList: Codable {
    let items: [GoogleEvent]
}

struct GoogleEvent: Codable, Hashable {
    let id: String
    let summary: String?
    let description: String?
    let start: EventDateTime?
    let end: EventDateTime?
}

struct EventDateTime: Codable, Hashable {
    let dateTime: String?   // ако е събитие с точни часове
    let date: String?       // ако е целодневно събитие
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
import UIKit

extension UIColor {
    /// Конструктор за "#RRGGBB" или "#RRGGBBAA".
    convenience init?(hex: String) {
        var raw = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        // Махаме '#' ако го има
        if raw.hasPrefix("#") {
            raw.removeFirst()
        }
        
        // Допустими формати: 6 или 8 символа (RGB или RGBA)
        guard raw.count == 6 || raw.count == 8 else {
            return nil
        }
        
        var rgbValue: UInt64 = 0
        Scanner(string: raw).scanHexInt64(&rgbValue)
        
        if raw.count == 6 {
            let r = CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0
            let g = CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0
            let b = CGFloat(rgbValue & 0x0000FF)         / 255.0
            self.init(red: r, green: g, blue: b, alpha: 1.0)
        } else {
            // 8 символа (RRGGBBAA)
            let r = CGFloat((rgbValue & 0xFF000000) >> 24) / 255.0
            let g = CGFloat((rgbValue & 0x00FF0000) >> 16) / 255.0
            let b = CGFloat((rgbValue & 0x0000FF00) >> 8)  / 255.0
            let a = CGFloat(rgbValue & 0x000000FF)         / 255.0
            self.init(red: r, green: g, blue: b, alpha: a)
        }
    }
}
