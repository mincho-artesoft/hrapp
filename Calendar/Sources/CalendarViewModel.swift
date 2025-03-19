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

    /// Singleton, за да се ползва по цялото приложение
    static let shared = CalendarViewModel()

    /// Можем да използваме този Calendar за изчисления (gregorian)
    let calendar = Calendar(identifier: .gregorian)
    
    private var cancellables = Set<AnyCancellable>()
    
    // MARK: - Google -> Local Calendar Mapping
    /// Речник: Google Calendar ID -> Local EKCalendar ID
    @Published var googleToLocalCalendarMapping: [String: String] = [:]
    private let googleToLocalCalendarMappingKey = "GoogleToLocalCalendarMappingKey"

    // MARK: - Google -> Local Event Mapping (за да избегнем дубликати)
    /// Речник: Google Event ID -> Local EKEvent.eventIdentifier
    @Published var googleToLocalEventMapping: [String: String] = [:]
    private let googleToLocalEventMappingKey = "GoogleToLocalEventMappingKey"
    
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
        
        // 3) При промяна на selectedCalendarIDs -> пазим обратно в UserDefaults
        $selectedCalendarIDs
            .sink { newValue in
                let array = Array(newValue)
                UserDefaults.standard.set(array, forKey: "SelectedCalendarIDsKey")
            }
            .store(in: &cancellables)
        
        // 4) Зареждаме вече запазен mapping за Calendar
        if let data = UserDefaults.standard.data(forKey: googleToLocalCalendarMappingKey),
           let mapping = try? JSONDecoder().decode([String: String].self, from: data) {
            self.googleToLocalCalendarMapping = mapping
        } else {
            self.googleToLocalCalendarMapping = [:]
        }
        
        // 5) Зареждаме вече запазен mapping за Event
        if let data = UserDefaults.standard.data(forKey: googleToLocalEventMappingKey),
           let mapping = try? JSONDecoder().decode([String: String].self, from: data) {
            self.googleToLocalEventMapping = mapping
        } else {
            self.googleToLocalEventMapping = [:]
        }
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

    /// Връща масив от EKCalendar, които са отбелязани като "selected"
    func allowedCalendars() -> [EKCalendar] {
        allCalendars.filter {
            selectedCalendarIDs.contains($0.calendarIdentifier)
        }
    }

    /// Зареждаме събития за даден месец (примерна реализация)
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

    /// Зареждаме събития за цяла година (примерна реализация)
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
    
    /// Зареждаме локалните (On My iPhone) календари в `calendarsDict` (примерно за Sheet)
    func loadLocalCalendars() {
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
    
    // MARK: - Записване на mapping-и в UserDefaults
    private func saveGoogleToLocalCalendarMapping() {
        if let data = try? JSONEncoder().encode(googleToLocalCalendarMapping) {
            UserDefaults.standard.set(data, forKey: googleToLocalCalendarMappingKey)
        }
    }
    
    private func saveGoogleToLocalEventMapping() {
        if let data = try? JSONEncoder().encode(googleToLocalEventMapping) {
            UserDefaults.standard.set(data, forKey: googleToLocalEventMappingKey)
        }
    }
}

// MARK: - Методи за намиране/създаване на локален календар
extension CalendarViewModel {
    
    /// Връща (или създава, ако не съществува) локален EKCalendar, кореспондиращ на даден Google календар.
    /// Ползваме `googleToLocalCalendarMapping`, за да проверим дали вече сме създали такъв.
    func findOrCreateLocalCalendar(for googleCal: GoogleCalendarItem) throws -> EKCalendar {
        
        // 1) Проверяваме речника дали вече имаме локален календар за този googleCal.id
        if let localCalID = googleToLocalCalendarMapping[googleCal.id],
           let existingLocalCalendar = allCalendars.first(where: { $0.calendarIdentifier == localCalID }) {
            return existingLocalCalendar
        }
        
        // 2) Ако нямаме запис, създаваме нов локален календар
        guard let localSource = eventStore.sources.first(where: { $0.sourceType == .local }) else {
            throw NSError(domain: "LocalSourceError",
                          code: 1,
                          userInfo: [NSLocalizedDescriptionKey: "Не е намерен локален source (On My iPhone)."])
        }
        
        let newCal = EKCalendar(for: .event, eventStore: eventStore)
        // Ползваме името на Google календара
        newCal.title = googleCal.summary
        newCal.source = localSource
        
        // Ако имаме backgroundColor, задаваме го
        if let bgColor = googleCal.backgroundColor,
           let uiColor = UIColor(hex: bgColor) {
            newCal.cgColor = uiColor.cgColor
        }
        
        try eventStore.saveCalendar(newCal, commit: true)
        reloadCalendars()
        
        // Записваме mapping: googleCal.id -> newCal.calendarIdentifier
        googleToLocalCalendarMapping[googleCal.id] = newCal.calendarIdentifier
        saveGoogleToLocalCalendarMapping()
        
        return newCal
    }
}

// MARK: - Методи за Импорт на Събития
extension CalendarViewModel {

    /// Импорт на Google събития, БЕЗ проверка за дубликати (създава нови всеки път!)
    func importGoogleEvents(_ googleEvents: [GoogleEvent], into localCalendar: EKCalendar) async throws {
        
        eventStore.reset()
        
        for gEvent in googleEvents {
            guard let startDate = parseGoogleDateTime(gEvent.start),
                  let endDate   = parseGoogleDateTime(gEvent.end) else {
                continue
            }
            
            let newEvent = EKEvent(eventStore: eventStore)
            newEvent.calendar = localCalendar
            newEvent.title = gEvent.summary ?? "(Без заглавие)"
            
            if gEvent.start?.date != nil {
                newEvent.isAllDay = true
            }
            
            newEvent.startDate = startDate
            newEvent.endDate   = endDate
            
            do {
                try eventStore.save(newEvent, span: .thisEvent, commit: false)
            } catch {
                print("Грешка при запис на събитие: \(error.localizedDescription)")
            }
        }
        
        do {
            try eventStore.commit()
        } catch {
            print("Грешка при commit на събитията: \(error.localizedDescription)")
        }
    }
    
    /// Импорт на Google събития *с проверка* (и избягване) на дубликати.
    /// Ако има вече създадено събитие за `gEvent.id`, го ъпдейтваме вместо да създаваме ново.
    func importGoogleEventsAvoidingDuplicates(_ googleEvents: [GoogleEvent],
                                              into localCalendar: EKCalendar) async throws {
        
        eventStore.reset()
        
        for gEvent in googleEvents {
            guard let startDate = parseGoogleDateTime(gEvent.start),
                  let endDate   = parseGoogleDateTime(gEvent.end) else {
                continue
            }
            
            let googleID = gEvent.id
            
            // 1) Проверяваме дали вече имаме локален EKEvent за това Google ID
            if let localEventID = googleToLocalEventMapping[googleID],
               let existingEvent = eventStore.event(withIdentifier: localEventID) {
                
                // => Обновяваме съществуващо събитие
                existingEvent.calendar  = localCalendar
                existingEvent.title     = gEvent.summary ?? "(Без заглавие)"
                existingEvent.isAllDay  = (gEvent.start?.date != nil)
                existingEvent.startDate = startDate
                existingEvent.endDate   = endDate
                
                do {
                    try eventStore.save(existingEvent, span: .thisEvent, commit: false)
                } catch {
                    print("Грешка при update: \(error.localizedDescription)")
                }
                
            } else {
                // => Няма такова локално събитие -> Създаваме ново
                let newEvent = EKEvent(eventStore: eventStore)
                newEvent.calendar  = localCalendar
                newEvent.title     = gEvent.summary ?? "(Без заглавие)"
                newEvent.isAllDay  = (gEvent.start?.date != nil)
                newEvent.startDate = startDate
                newEvent.endDate   = endDate
                
                do {
                    try eventStore.save(newEvent, span: .thisEvent, commit: false)
                    
                    // Записваме mapping: googleEventID -> localEventID
                    googleToLocalEventMapping[googleID] = newEvent.eventIdentifier
                } catch {
                    print("Грешка при създаване на Event: \(error.localizedDescription)")
                }
            }
        }
        
        do {
            try eventStore.commit()
        } catch {
            print("Грешка при commit на събитията: \(error.localizedDescription)")
        }
        
        // Накрая записваме речника в UserDefaults
        saveGoogleToLocalEventMapping()
    }
    
    /// Помощна функция за парсване на Google EventDateTime
    fileprivate func parseGoogleDateTime(_ dateTime: EventDateTime?) -> Date? {
        guard let dateTime = dateTime else { return nil }
        
        if let dateTimeString = dateTime.dateTime {
            // Ако е пълно ISO8601
            let formatter = ISO8601DateFormatter()
            return formatter.date(from: dateTimeString)
        } else if let dateString = dateTime.date {
            // Целодневно: YYYY-MM-DD
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            return formatter.date(from: dateString)
        }
        return nil
    }
}

// MARK: - Google Models
struct GoogleCalendarList: Codable {
    let items: [GoogleCalendarItem]
}

struct GoogleCalendarItem: Codable, Hashable {
    let id: String
    let summary: String
    let description: String?
    
    let colorId: String?
    let backgroundColor: String?
    let foregroundColor: String?
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
    let dateTime: String?
    let date: String?
}

// MARK: - UIColor(hex:)
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
