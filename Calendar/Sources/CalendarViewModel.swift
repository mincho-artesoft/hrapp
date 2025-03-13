//
// MARK: - CalendarViewModel
//
import SwiftUI
import EventKit
import Combine

@MainActor
final class CalendarViewModel: ObservableObject {
    let eventStore: EKEventStore = EKEventStore()
    @Published var calendarsDict: [String: (title: String, color: UIColor, selected: Bool)] = [:]

    static let shared = CalendarViewModel()

    @Published var allCalendars: [EKCalendar] = []
    
    // Събития
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID:  [String: EKEvent] = [:]

    // Дали имаме достъп до Календарите
    @Published var accessGranted = false

    // Тук пазим ID-тата на календари, които потребителят е “разрешил”
    @Published var selectedCalendarIDs: Set<String> = []

    // Променлива, в която да запазим UI цвят (UIColor) на първия .local календар
    @Published var firstLocalCalendarColor: UIColor?

    let calendar = Calendar(identifier: .gregorian)

    private var cancellables = Set<AnyCancellable>()

    // MARK: - Инициализатор
    init() {
        loadLocalCalendars()
        // --- ПРОМЕНЕНО: добавена логика за "ако няма нищо в UserDefaults, взимаме всички календари"
        if let storedArray = UserDefaults.standard.array(forKey: "SelectedCalendarIDsKey") as? [String],
           !storedArray.isEmpty {
            self.selectedCalendarIDs = Set(storedArray)
        } else {
            // Ако няма нищо в UserDefaults, селектираме ВСИЧКИ календари по подразбиране
            // (Може да избереш да селектираш само първия локален, ако предпочиташ)
            let cals = eventStore.calendars(for: .event)
            self.selectedCalendarIDs = Set(cals.map { $0.calendarIdentifier })
        }

        // Когато selectedCalendarIDs се промени => да пазим в UserDefaults
        $selectedCalendarIDs
            .sink { newValue in
                let array = Array(newValue)
                UserDefaults.standard.set(array, forKey: "SelectedCalendarIDsKey")
            }
            .store(in: &cancellables)
    }

    // MARK: - Проверка/заявка за достъп
    func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            return (status == .fullAccess)
        } else {
            return (status == .authorized)
        }
    }

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

    // MARK: - Зареждане на календари
    func reloadCalendars() {
        let cals = eventStore.calendars(for: .event)
        
        self.allCalendars = cals
        
        // Търсим първия локален календар
        if let firstLocalCal = cals.first(where: { $0.source.sourceType == .local }),
           let cgColor = firstLocalCal.cgColor {
            self.firstLocalCalendarColor = UIColor(cgColor: cgColor)
        } else {
            self.firstLocalCalendarColor = nil
        }
    }

    // MARK: - Методи за зареждане на събития
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
        
        var tmp: [String: EKEvent] = [:]
        for evList in fetched.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }

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

    // MARK: - Помощни
    func allowedCalendars() -> [EKCalendar] {
        allCalendars.filter {
            selectedCalendarIDs.contains($0.calendarIdentifier)
        }
    }
    private func loadLocalCalendars() {
        // Предполага се, че вече имате accessGranted == true
        reloadCalendars()
        
        // Може да вземете всички, или само локални
        let localCals = allCalendars.filter {
            $0.source.sourceType == .local
        }
        
        var dict: [String: (title: String, color: UIColor, selected: Bool)] = [:]
        
        for cal in localCals {
            // Извличаме заглавие
            let calTitle = cal.title
            
            // Извличаме цвят
            var uiColor = UIColor.systemGray
            if let cgColor = cal.cgColor {
                uiColor = UIColor(cgColor: cgColor)
            }
            
            // Всички => selected = true (по изискването ви)
            dict[cal.calendarIdentifier] = (
                title: calTitle,
                color: uiColor,
                selected: true
            )
        }
        
        calendarsDict = dict
    }
}

