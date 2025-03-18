//
//  CalendarViewModel.swift
//  YourProject
//

import SwiftUI
import EventKit
import Combine
import GoogleSignIn
import GoogleSignInSwift

@MainActor
final class CalendarViewModel: ObservableObject {
    
    // MARK: - EventKit Store & Properties
    let eventStore: EKEventStore = EKEventStore()
    
    /// Съхраняваме всички намерени EKCalendar (локални, iCloud, Outlook, и т.н.)
    @Published var allCalendars: [EKCalendar] = []
    
    /// Събития (по дни и по ID) - примерно за месечен/годишен календар
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID:  [String: EKEvent] = [:]

    /// Дали вече имаме достъп до iOS Календара (EventKit)
    @Published var accessGranted = false

    /// IDs на календари, които потребителят е маркирал като "show" (EKCalendar.calendarIdentifier + Google IDs)
    @Published var selectedCalendarIDs: Set<String> = []

    /// Dictionary за вашите локални календари (по изискване)
    @Published var calendarsDict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
    
    /// Пазим UI цвят (UIColor) на първия локален календар (за някои цели)
    @Published var firstLocalCalendarColor: UIColor?

    // MARK: - Google Calendars
    /// Списък от Google CalendarItem (ваш модел), които сме заредили от Google API
    @Published var googleCalendars: [GoogleCalendarItem] = [] {
        didSet {
            // Всеки път, когато googleCalendars се промени => пазим в UserDefaults
            storeGoogleCalendarsInUserDefaults(googleCalendars)
        }
    }
    
    /// Префикс за Google календарите, за да ги различаваме от EKCalendar.calendarIdentifier
    static let googlePrefix = "google::"

    /// Singleton, за да се ползва по цялото приложение
    static let shared = CalendarViewModel()

    // MARK: - Друго
    private var cancellables = Set<AnyCancellable>()
    let calendar = Calendar(identifier: .gregorian)

    // MARK: - Инициализатор
    init() {
        // 1) Зареждаме локални (EventKit) календари
        loadLocalCalendars()
        
        // 2) Зареждаме selectedCalendarIDs (ако има) от UserDefaults
        if let storedArray = UserDefaults.standard.array(forKey: "SelectedCalendarIDsKey") as? [String],
           !storedArray.isEmpty {
            self.selectedCalendarIDs = Set(storedArray)
        } else {
            // Ако няма нищо запазено => селектираме всички налични EKCalendar
            let cals = eventStore.calendars(for: .event)
            self.selectedCalendarIDs = Set(cals.map { $0.calendarIdentifier })
        }

        // 3) Когато има промяна, да пазим обратно в UserDefaults
        $selectedCalendarIDs
            .sink { newValue in
                let array = Array(newValue)
                UserDefaults.standard.set(array, forKey: "SelectedCalendarIDsKey")
            }
            .store(in: &cancellables)

        // 4) Зареждаме преди това кеширани Google календари
        self.googleCalendars = loadGoogleCalendarsFromUserDefaults()
        
        // 5) Опит за автоматично възстановяване на Google Sign-In и зареждане на календарите от API
        restoreGoogleSignInIfNeededAndLoad()
    }

    // MARK: - Методи за EventKit (iOS) календари

    /// Проверка дали имаме (или сме поискали) разрешение за достъп до календари
    func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            return (status == .fullAccess)
        } else {
            return (status == .authorized)
        }
    }

    /// Ако потребителят още не е дал достъп до EventKit, искаме. Иначе връща true/false според статуса.
    @MainActor
    func requestCalendarAccessIfNeeded() async -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if status == .notDetermined {
            do {
                let granted = try await eventStore.requestFullAccessToEvents()
                self.accessGranted = granted
                return granted
            } catch {
                print("Error requesting calendar access: \(error.localizedDescription)")
                self.accessGranted = false
                return false
            }
        } else {
            let granted = isCalendarAccessGranted()
            self.accessGranted = granted
            return granted
        }
    }

    /// Презареждаме списъка `allCalendars` от EventKit Store
    func reloadCalendars() {
        let cals = eventStore.calendars(for: .event)
        self.allCalendars = cals
        
        // Намираме първия локален календар и пазим неговия цвят
        if let firstLocalCal = cals.first(where: { $0.source.sourceType == .local }),
           let cgColor = firstLocalCal.cgColor {
            self.firstLocalCalendarColor = UIColor(cgColor: cgColor)
        } else {
            self.firstLocalCalendarColor = nil
        }
        
    }

    /// Зареждаме събития за даден месец
    func loadEvents(for month: Date) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID  = [:]
            return
        }
        
        let fetched = eventStore.fetchEventsByDay(
            for: month,
            calendar: calendar,
            allowedCalendarIDs: selectedCalendarIDs
        )
        self.eventsByDay = fetched
        
        // Събираме всички в един речник по eventIdentifier
        var tmp: [String: EKEvent] = [:]
        for evList in fetched.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }

    /// Зареждаме събития за цяла година (примерен метод)
    func loadEventsForWholeYear(year: Int) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID  = [:]
            return
        }

        var comp = DateComponents()
        comp.year = year
        comp.month = 1
        comp.day = 1
        guard let startOfYear = calendar.date(from: comp) else { return }

        var compNext = DateComponents()
        compNext.year = year + 1
        compNext.month = 1
        compNext.day = 1
        guard let startOfNextYear = calendar.date(from: compNext) else { return }

        let allowedCals = allowedCalendars()
        let predicate = eventStore.predicateForEvents(
            withStart: startOfYear,
            end: startOfNextYear,
            calendars: allowedCals
        )
        let foundEvents = eventStore.events(matching: predicate)

        var dict: [Date: [EKEvent]] = [:]
        for ev in foundEvents {
            let dayKey = calendar.startOfDay(for: ev.startDate)
            dict[dayKey, default: []].append(ev)
        }
        self.eventsByDay = dict

        var tmp: [String: EKEvent] = [:]
        for evList in dict.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }

    /// Връща масив от EKCalendar, които са отбелязани като "selected"
    func allowedCalendars() -> [EKCalendar] {
        allCalendars.filter {
            selectedCalendarIDs.contains($0.calendarIdentifier)
        }
    }
    
    /// Зареждаме локалните (On My iPhone) календари в `calendarsDict` (примерно за Sheet)
    private func loadLocalCalendars() {
        // Предполага се, че вече имаме accessGranted, но все пак:
        reloadCalendars()
        
        let localCals = allCalendars.filter {
            $0.source.sourceType == .local
        }
        
        var dict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
        
        for cal in localCals {
            let calTitle = cal.title
            var uiColor = UIColor.systemGray
            if let cgColor = cal.cgColor {
                uiColor = UIColor(cgColor: cgColor)
            }
            // По условие => всички локални = selected = true (или както решите)
            dict[cal.calendarIdentifier] = (
                title: calTitle,
                color: uiColor,
                selected: true,
                calendar: cal
            )
        }
        
        self.calendarsDict = dict
    }
    
    // MARK: - Google Sign-In Възстановяване и Fetch
    private func restoreGoogleSignInIfNeededAndLoad() {
        // Опит за възстановяване на предишна Google сесия
        GIDSignIn.sharedInstance.restorePreviousSignIn { signInResult, error in
            if let error = error {
                print("Restore Google SignIn error: \(error.localizedDescription)")
                return
            }
            // Ако имаме валиден signInResult => значи сме логнати => да fetch‐нем
            guard let _ = signInResult else {
                print("No existing Google SignIn session.")
                return
            }
            
            print("✅ Google session restored => fetching calendars from API...")
            Task {
                await self.fetchGoogleCalendarsFromAPI()
            }
        }
    }

    /// Извлича списък от Google календари директно от API (ако имаме логнат user)
    @MainActor
    func fetchGoogleCalendarsFromAPI() async {
        guard let user = GIDSignIn.sharedInstance.currentUser else {
            print("⚠️ Not signed in to Google => skip fetching.")
            return
        }

        let neededScope = "https://www.googleapis.com/auth/calendar.readonly"
        
        // 1) Проверяваме scope
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
                print("⚠️ User denied calendar scope: \(error)")
                return
            }
        }

        // 2) Зареждаме списъка с календари
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
                print("⚠️ HTTP Error from Google (calendarList): \(respStr)")
                return
            }
            
            let decoder = JSONDecoder()
            let calendarList = try decoder.decode(GoogleCalendarList.self, from: data)
            
            var validCalendars: [GoogleCalendarItem] = []

            // 3) За всеки календар от списъка – опит за fetch на събития:
            for cal in calendarList.items {
                let calId = cal.id
                if await canFetchEvents(forCalendarId: calId, accessToken: accessToken) {
                    // Успешно се зареждат евентите => включваме го
                    validCalendars.append(cal)
                } else {
                    // Грешка при събитията => пропускаме го
                    print("Skipping calendar \(calId) due to fetch error.")
                }
            }

            // 4) Записваме само „валидните“ календари
            DispatchQueue.main.async {
                self.googleCalendars = validCalendars
                self.storeGoogleCalendarsInUserDefaults(validCalendars)
            }

            print("✅ Filtered Google Calendars: \(validCalendars.count) from total \(calendarList.items.count)")

        } catch {
            print("⚠️ Fetch from Google error: \(error)")
        }
    }

    /// Помощен метод, който прави заявка към "/calendars/{calendarId}/events"
    /// и връща true/false дали може да зареди евентите успешно (2xx статус).
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
                return false
            }
            return true
        } catch {
            print("⚠️ Error fetching events for \(calId): \(error)")
            return false
        }
    }


    // MARK: - Съхранение/четене на Google Calendars от UserDefaults
    private func storeGoogleCalendarsInUserDefaults(_ calendars: [GoogleCalendarItem]) {
        print("storeGoogleCalendarsInUserDefaults")
        
        for cal in calendars {
            print("  • \(cal.summary) | colorId: \(cal.colorId ?? "no colorId") | bgColor: \(cal.backgroundColor ?? "n/a")")
        }
        
        do {
            let data = try JSONEncoder().encode(calendars)
            UserDefaults.standard.set(data, forKey: "StoredGoogleCalendars")
        } catch {
            print("⚠️ Failed to encode GoogleCalendars: \(error)")
        }
    }

    private func loadGoogleCalendarsFromUserDefaults() -> [GoogleCalendarItem] {
        guard let data = UserDefaults.standard.data(forKey: "StoredGoogleCalendars") else {
            return []
        }
        print("loadGoogleCalendarsFromUserDefaults")
        
        do {
            let decoded = try JSONDecoder().decode([GoogleCalendarItem].self, from: data)
            print("  -> Заредени са \(decoded.count) GoogleCalendars:")
            for cal in decoded {
                print("     • \(cal.summary) | colorId: \(cal.colorId ?? "no colorId") | bgColor: \(cal.backgroundColor ?? "n/a")")
            }
            return decoded
        } catch {
            print("⚠️ Failed to decode GoogleCalendars: \(error)")
            return []
        }
    }
}

/// Модел за списък от събития
 struct GoogleEventList: Codable {
    let items: [GoogleEvent]
}

/// Модел за събитие (може да се разшири според нуждите)
 struct GoogleEvent: Codable {
    let id: String
    let summary: String?
    let start: EventDateTime?
    let end: EventDateTime?

    struct EventDateTime: Codable {
        let date: String?
        let dateTime: String?
    }
}
