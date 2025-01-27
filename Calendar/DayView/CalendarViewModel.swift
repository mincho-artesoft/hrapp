//
//  CalendarViewModel.swift
//  ExampleCalendarApp
//
//  ObservableObject, което държи заредените събития от EKEventStore
//

import SwiftUI
import EventKit
import Combine

/// ViewModel, който държи и презарежда събитията от eventStore
class CalendarViewModel: ObservableObject {
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID: [String: EKEvent] = [:]
    
    let eventStore: EKEventStore
    let calendar = Calendar(identifier: .gregorian)
    
    private var cancellables = Set<AnyCancellable>()
    
    init(eventStore: EKEventStore) {
        self.eventStore = eventStore
        
        // Слушаме системните нотификации за промяна в eventStore
        NotificationCenter.default.publisher(for: .EKEventStoreChanged)
            .sink { [weak self] _ in
                // Тук може да презаредите при всяка промяна,
                // или да го оставите празно – зависи от нуждите ви.
            }
            .store(in: &cancellables)
    }
    
    /// Зарежда събития за даден месец
    func loadEvents(for month: Date) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID = [:]
            return
        }
        
        let fetched = eventStore.fetchEventsByDay(for: month, calendar: calendar)
        self.eventsByDay = fetched
        
        // Изграждаме речник по eventIdentifier
        var tmp: [String: EKEvent] = [:]
        for evList in fetched.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }
    
    /// Зарежда **всички** събития за дадена година
    func loadEventsForWholeYear(year: Int) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID = [:]
            return
        }

        let calendar = Calendar(identifier: .gregorian)
        // Начало на годината
        var comp = DateComponents()
        comp.year = year
        comp.month = 1
        comp.day = 1
        guard let startOfYear = calendar.date(from: comp) else { return }
        
        // Начало на следващата година
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
        
        // Речник по ID:
        var tmp: [String: EKEvent] = [:]
        for evList in dict.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }
    
    /// Проверява дали имаме разрешение
    func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            return (status == .fullAccess)
        } else {
            return (status == .authorized)
        }
    }
    
    /// Искаме разрешение (ако е .notDetermined)
    func requestCalendarAccessIfNeeded(completion: @escaping () -> Void) {
        let status = EKEventStore.authorizationStatus(for: .event)
        if status == .notDetermined {
            if #available(iOS 17.0, *) {
                eventStore.requestFullAccessToEvents { granted, error in
                    DispatchQueue.main.async {
                        completion()
                    }
                }
            } else {
                eventStore.requestAccess(to: .event) { granted, error in
                    DispatchQueue.main.async {
                        completion()
                    }
                }
            }
        } else {
            completion()
        }
    }
}
