//
//  CalendarViewModel.swift
//  hrapp
//

import SwiftUI
import Combine

class CalendarViewModel: ObservableObject {
    @Published var events: [CalendarEvent] = []
    
    init() {
        loadMockData()
    }
    
    private func loadMockData() {
        let now = Date()
        let calendar = Calendar.current
        let tomorrow = calendar.date(byAdding: .day, value: 1, to: now)!
        let nextWeek = calendar.date(byAdding: .day, value: 7, to: now)!
        
        events = [
            CalendarEvent(
                title: "All-Day Offsite",
                start: now,
                end: now,
                allDay: true,
                color: .orange
            ),
            CalendarEvent(
                title: "Doctor Appointment",
                start: tomorrow,
                end: tomorrow.addingTimeInterval(60 * 60),
                color: .red
            ),
            CalendarEvent(
                title: "Multi-Day Project",
                start: now,
                end: nextWeek,
                allDay: false,
                color: .purple
            )
        ]
    }
    
    /// Insert or update
    func upsertEvent(_ event: CalendarEvent) {
        if let idx = events.firstIndex(where: { $0.id == event.id }) {
            events[idx] = event
        } else {
            events.append(event)
        }
    }
    
    /// Move event (drag & drop)
    func moveEvent(
        eventID: UUID,
        newStart: Date,
        newAllDay: Bool? = nil,
        newDuration: TimeInterval? = nil
    ) {
        guard let idx = events.firstIndex(where: { $0.id == eventID }) else { return }
        var e = events[idx]
        
        // Toggle allDay if passed
        if let ad = newAllDay {
            e.allDay = ad
        }
        
        if e.allDay {
            // If allDay => clamp to that date’s midnight
            let startOfNewDay = Calendar.current.startOfDay(for: newStart)
            e.start = startOfNewDay
            e.end   = startOfNewDay
        } else {
            // Keep or override the duration
            let duration = newDuration ?? e.end.timeIntervalSince(e.start)
            e.start = newStart
            e.end   = newStart.addingTimeInterval(duration)
        }
        
        events[idx] = e
    }
    
    /// Resize event (drag from top or bottom handle)
    func resizeEvent(
        eventID: UUID,
        newStart: Date? = nil,
        newEnd: Date? = nil
    ) {
        guard let idx = events.firstIndex(where: { $0.id == eventID }) else { return }
        var e = events[idx]
        
        if let ns = newStart, ns < e.end {
            e.start = ns
        }
        if let ne = newEnd, ne > e.start {
            e.end = ne
        }
        events[idx] = e
    }
    
    func deleteEvent(_ event: CalendarEvent) {
        events.removeAll { $0.id == event.id }
    }
}
