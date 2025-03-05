import SwiftUI
import EventKit
import Combine

@MainActor
final class CalendarViewModel: ObservableObject {
    let eventStore: EKEventStore = EKEventStore()

    /// Единствен, споделен инстанс (Singleton)
    static let shared = CalendarViewModel()
    
    // Пазим всички календари (за .event)
    @Published var allCalendars: [EKCalendar] = []
    
    // Събития (примерно по ден или по ID)
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID:  [String: EKEvent] = [:]
    
    // Дали имаме достъп до Календарите
    @Published var accessGranted = false

    /// Тук пазим ID-тата на календари, които потребителят е “разрешил” да се виждат
    @Published var selectedCalendarIDs: Set<String> = []

    let calendar = Calendar(identifier: .gregorian)

    /// За Combine sink-ове
    private var cancellables = Set<AnyCancellable>()

    // MARK: - Инициализатор
    init() {
        // 1) Зареждаме вече запомнените ID-та от UserDefaults (ако има)
        if let storedArray = UserDefaults.standard.array(forKey: "SelectedCalendarIDsKey") as? [String] {
            self.selectedCalendarIDs = Set(storedArray)
        }

        // 2) Всеки път, когато selectedCalendarIDs се промени, записваме обратно
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
    }

    // MARK: - Методи за зареждане на събития
    func loadEvents(for month: Date) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID  = [:]
            return
        }
        
        // Примерно “ByDay” за 1 месец
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

        // Start of year
        var comp = DateComponents()
        comp.year = year
        comp.month = 1
        comp.day = 1
        guard let startOfYear = calendar.date(from: comp) else { return }

        // Start of next year
        var compNext = DateComponents()
        compNext.year = year + 1
        compNext.month = 1
        compNext.day = 1
        guard let startOfNextYear = calendar.date(from: compNext) else { return }

        // Филтрираме само разрешените календари
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
}

// MARK: - EKEventStore helper (пример)
extension EKEventStore {
    /// Зареждаме събития за месеца, групирани по дни
    func fetchEventsByDay(
        for month: Date,
        calendar: Calendar,
        allowedCalendarIDs: Set<String>
    ) -> [Date: [EKEvent]] {
        // Начало на месеца
        let comp = calendar.dateComponents([.year, .month], from: month)
        guard let startOfMonth = calendar.date(from: comp) else { return [:] }

        // Начало на следващия месец
        var nextComp = DateComponents()
        nextComp.month = 1
        guard let startOfNextMonth = calendar.date(byAdding: nextComp, to: startOfMonth) else {
            return [:]
        }

        // Взимаме само календарите, които са разрешени
        let allowedCals = calendars(for: .event).filter {
            allowedCalendarIDs.contains($0.calendarIdentifier)
        }

        let predicate = predicateForEvents(
            withStart: startOfMonth,
            end: startOfNextMonth,
            calendars: allowedCals
        )
        let found = events(matching: predicate)

        var dict: [Date: [EKEvent]] = [:]
        for ev in found {
            let dayKey = calendar.startOfDay(for: ev.startDate)
            dict[dayKey, default: []].append(ev)
        }
        return dict
    }
}
