import SwiftUI
import EventKit
import Combine

/// ViewModel that holds events from EKEventStore
class CalendarViewModel: ObservableObject {
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID: [String: EKEvent] = [:]

    let eventStore: EKEventStore
    let calendar = Calendar(identifier: .gregorian)

    private var cancellables = Set<AnyCancellable>()

    init(eventStore: EKEventStore) {
        self.eventStore = eventStore

        // Listen for system notifications that the store changed
        NotificationCenter.default.publisher(for: .EKEventStoreChanged)
            .sink { [weak self] _ in
                // You could reload if needed
            }
            .store(in: &cancellables)
    }

    /// Load events for a given month
    func loadEvents(for month: Date) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID = [:]
            return
        }

        let fetched = eventStore.fetchEventsByDay(for: month, calendar: calendar)
        self.eventsByDay = fetched

        var tmp: [String: EKEvent] = [:]
        for evList in fetched.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }

    /// Load **all** events for a given year
    func loadEventsForWholeYear(year: Int) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID = [:]
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

        let predicate = eventStore.predicateForEvents(
            withStart: startOfYear,
            end: startOfNextYear,
            calendars: nil
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

    /// Check if we have permission
    func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            return (status == .fullAccess)
        } else {
            return (status == .authorized)
        }
    }

    /// Ask for permission (if .notDetermined)
    @MainActor
    func requestCalendarAccessIfNeeded(completion: @escaping () -> Void) {
        let status = EKEventStore.authorizationStatus(for: .event)
        if status == .notDetermined {
            if #available(iOS 17.0, *) {
                eventStore.requestFullAccessToEvents { _, _ in
                    completion()
                }
            } else {
                eventStore.requestAccess(to: .event) { _, _ in
                    completion()
                }
            }
        } else {
            completion()
        }
    }

}
