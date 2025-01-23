//
//  CalendarViewModel.swift
//  ObservableCalendarDemo
//

import SwiftUI
import EventKit
import Combine

class CalendarViewModel: ObservableObject {
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID: [String: EKEvent] = [:]
    
    let eventStore: EKEventStore
    let calendar = Calendar(identifier: .gregorian)
    
    private var cancellables = Set<AnyCancellable>()
    
    init(eventStore: EKEventStore) {
        self.eventStore = eventStore
        
        // Слушаме системните нотификации за промяна в event store-а
        NotificationCenter.default.publisher(for: .EKEventStoreChanged)
            .sink { [weak self] _ in
                // При всяка промяна (добавяне, триене, редактиране), презареждаме
                self?.reloadCurrentMonth()
            }
            .store(in: &cancellables)
    }
    
    /// Зарежда събитията за даден месец
    func loadEvents(for month: Date) {
        // Ако нямаме достъп, зануляваме
        if !isCalendarAccessGranted() {
            self.eventsByDay = [:]
            self.eventsByID = [:]
            return
        }
        
        let fetched = eventStore.fetchEventsByDay(for: month, calendar: calendar)
        self.eventsByDay = fetched
        
        // Съставяме и речник по eventIdentifier
        var tmp: [String: EKEvent] = [:]
        for evList in fetched.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }
    
    /// Ако искаме при всяка системна промяна да презареждаме някакъв "текущ" месец,
    /// можем да пазим един @Published currentMonth и да го презареждаме винаги.
    /// Или просто да презаредим последно заредения месец. Тук за пример - няма state.
    func reloadCurrentMonth() {
        // Може да пазим последно заредения месец в някоя @Published променлива, да речем:
        // но тук за простота ще презаредим "днешния месец"
        loadEvents(for: Date())
    }
    
    func requestCalendarAccessIfNeeded(completion: (() -> Void)? = nil) {
        let status = EKEventStore.authorizationStatus(for: .event)
        if status == .notDetermined {
            if #available(iOS 17.0, *) {
                eventStore.requestFullAccessToEvents { granted, error in
                    DispatchQueue.main.async {
                        completion?()
                    }
                }
            } else {
                eventStore.requestAccess(to: .event) { granted, error in
                    DispatchQueue.main.async {
                        completion?()
                    }
                }
            }
        } else {
            completion?()
        }
    }
    
    func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            return (status == .fullAccess)
        } else {
            return (status == .authorized)
        }
    }
}
