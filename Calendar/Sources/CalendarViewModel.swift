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

    /// Можем да използаме този Calendar за изчисления (gregorian)
    let calendar = Calendar(identifier: .gregorian)
    
    private var cancellables = Set<AnyCancellable>()
    
    // MARK: - Google -> Local Mapping
    /// Речник: Google Calendar ID -> Local EKCalendar ID
    @Published var googleToLocalCalendarMapping: [String: String] = [:]
    private let googleToLocalCalendarMappingKey = "GoogleToLocalCalendarMappingKey"

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
        
        // 4) Зареждаме вече запазен mapping от UserDefaults
        if let data = UserDefaults.standard.data(forKey: googleToLocalCalendarMappingKey),
           let mapping = try? JSONDecoder().decode([String: String].self, from: data) {
            self.googleToLocalCalendarMapping = mapping
        } else {
            self.googleToLocalCalendarMapping = [:]
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
    
    /// Записваме `googleToLocalCalendarMapping` обратно в UserDefaults
    private func saveGoogleToLocalCalendarMapping() {
        if let data = try? JSONEncoder().encode(googleToLocalCalendarMapping) {
            UserDefaults.standard.set(data, forKey: googleToLocalCalendarMappingKey)
        }
    }
}


// MARK: - Разширение с методи за създаване на локален календар и импорт на Google събития
extension CalendarViewModel {
    
    /// Връща (или създава, ако не съществува) локален EKCalendar, кореспондиращ на даден Google календар.
    /// Ползваме `googleToLocalCalendarMapping`, за да проверим дали вече сме създали такъв.
    func findOrCreateLocalCalendar(for googleCal: GoogleCalendarItem) throws -> EKCalendar {
        // 1) Проверка дали вече имаме локален календар за този googleCal.id
        if let localCalID = googleToLocalCalendarMapping[googleCal.id],
           let existingLocalCalendar = allCalendars.first(where: { $0.calendarIdentifier == localCalID }) {
            return existingLocalCalendar
        }
        
        // 2) Ако нямаме запис - създаваме нов локален
        guard let localSource = eventStore.sources.first(where: { $0.sourceType == .local }) else {
            throw NSError(domain: "LocalSourceError",
                          code: 1,
                          userInfo: [NSLocalizedDescriptionKey: "Не е намерен локален source (On My iPhone)."])
        }
        
        let newCal = EKCalendar(for: .event, eventStore: eventStore)
        newCal.title = googleCal.summary
        newCal.source = localSource
        
        // Ако имаме backgroundColor от Google, парсваме го в UIColor
        if let bgColorHex = googleCal.backgroundColor,
           let uiColor = UIColor(hex: bgColorHex) {
            newCal.cgColor = uiColor.cgColor
        }
        
        // (По желание) ако искате да използвате foregroundColor за нещо - iOS не винаги го прилага,
        // но може да опитате да четете googleCal.foregroundColor

        try eventStore.saveCalendar(newCal, commit: true)
        reloadCalendars()
        
        // Записваме mapping
        googleToLocalCalendarMapping[googleCal.id] = newCal.calendarIdentifier
        saveGoogleToLocalCalendarMapping()
        
        return newCal
    }


    
    /// Създава (и записва) EKEvent обекти в даден локален календар на базата на списък от GoogleEvents.
    /// Ако не държите да проверявате за дубликати, това е достатъчно.
    func importGoogleEvents(_ googleEvents: [GoogleEvent], into localCalendar: EKCalendar) async throws {
        
        // Подготвяме batch commit:
        eventStore.reset()
        
        for gEvent in googleEvents {
            // 1) Създаваме EKEvent
            let newEvent = EKEvent(eventStore: eventStore)
            newEvent.calendar = localCalendar
            
            newEvent.title = gEvent.summary ?? "(Без заглавие)"
            
            // 2) Парсваме дати (целодневни vs. dateTime)
            if let startDate = parseGoogleDateTime(gEvent.start),
               let endDate = parseGoogleDateTime(gEvent.end) {
                
                if gEvent.start?.date != nil {
                    newEvent.isAllDay = true
                }
                
                newEvent.startDate = startDate
                newEvent.endDate   = endDate
            } else {
                // Ако липсват дати – пропускаме
                continue
            }
            
            // По желание може да сложите Google ID в notes
            // newEvent.notes = "GoogleEventID:\(gEvent.id)"
            
            // 3) Записваме (засега без да commit-ваме)
            do {
                try eventStore.save(newEvent, span: .thisEvent, commit: false)
            } catch {
                print("Грешка при запис на събитие: \(error.localizedDescription)")
            }
        }
        
        // Накрая правим final commit на всички събития
        do {
            try eventStore.commit()
        } catch {
            print("Грешка при commit на събитията: \(error.localizedDescription)")
        }
    }
    
    /// Алтернативен метод, който избягва дублирането, ако запаметявате GoogleEventID в notes.
    func importGoogleEventsAvoidingDuplicates(_ googleEvents: [GoogleEvent],
                                              into localCalendar: EKCalendar) async throws {
        
        // Пример: теглим текущи събития около +/- 6 месеца от днес, за да търсим дубликати
        let startDate = Date().addingTimeInterval(-3600*24*180)
        let endDate   = Date().addingTimeInterval(3600*24*365)
        
        let predicate = eventStore.predicateForEvents(withStart: startDate,
                                                      end: endDate,
                                                      calendars: [localCalendar])
        let existingEvents = eventStore.events(matching: predicate)
        
        // Речник: [googleID: EKEvent]
        var existingByGoogleID: [String: EKEvent] = [:]
        for ekEvent in existingEvents {
            if let notes = ekEvent.notes, notes.contains("GoogleEventID:") {
                let comp = notes.components(separatedBy: "GoogleEventID:")
                if comp.count == 2 {
                    let googleID = comp[1].trimmingCharacters(in: .whitespacesAndNewlines)
                    existingByGoogleID[googleID] = ekEvent
                }
            }
        }
        
        eventStore.reset()
        
        for gEvent in googleEvents {
            guard let startDate = parseGoogleDateTime(gEvent.start),
                  let endDate   = parseGoogleDateTime(gEvent.end) else {
                continue
            }
            
            let googleID = gEvent.id
            // Опитваме да намерим дали вече има EKEvent с този googleID
            let ekEvent = existingByGoogleID[googleID] ?? EKEvent(eventStore: eventStore)
            
            ekEvent.calendar = localCalendar
            ekEvent.title = gEvent.summary ?? "(Без заглавие)"
            
            if gEvent.start?.date != nil {
                ekEvent.isAllDay = true
            }
            
            ekEvent.startDate = startDate
            ekEvent.endDate   = endDate
            ekEvent.notes = "GoogleEventID:\(googleID)"
            
            do {
                try eventStore.save(ekEvent, span: .thisEvent, commit: false)
            } catch {
                print("Грешка при запис: \(error)")
            }
        }
        
        do {
            try eventStore.commit()
        } catch {
            print("Грешка при commit: \(error)")
        }
    }
    
    /// Помощна функция за парсване на Google EventDateTime
    private func parseGoogleDateTime(_ dateTime: EventDateTime?) -> Date? {
        guard let dateTime = dateTime else { return nil }
        
        if let dateTimeString = dateTime.dateTime {
            // Има часове/минути/секунди (ISO8601)
            let formatter = ISO8601DateFormatter()
            return formatter.date(from: dateTimeString)
            
        } else if let dateString = dateTime.date {
            // Целодневно събитие. Формат: "YYYY-MM-DD"
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            return formatter.date(from: dateString)
        }
        
        return nil
    }
}

