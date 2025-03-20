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
}
