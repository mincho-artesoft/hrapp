//
//  CalendarViewModel.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI
import Combine

/// Represents a single calendar event
struct CalendarEvent: Identifiable, Equatable {
    let id: UUID
    var title: String
    var start: Date
    var end: Date
    var allDay: Bool
    var notes: String
    var color: Color
    
    /// Editable flags
    var editable: Bool = true
    
    /// Quick init for convenience
    init(id: UUID = UUID(),
         title: String,
         start: Date,
         end: Date,
         allDay: Bool = false,
         notes: String = "",
         color: Color = .blue,
         editable: Bool = true) {
        self.id = id
        self.title = title
        self.start = start
        self.end = end
        self.allDay = allDay
        self.notes = notes
        self.color = color
        self.editable = editable
    }
}

/// Optional: If you want to model "Resources" (like rooms, people), etc.
struct CalendarResource: Identifiable, Hashable {
    let id: UUID
    var name: String
}

/// The main ViewModel that holds all calendar data & business logic
class CalendarViewModel: ObservableObject {
    @Published var events: [CalendarEvent] = []
    @Published var resources: [CalendarResource] = []
    
    init() {
        loadMockData()
        loadMockResources()
    }
    
    func loadMockData() {
        let now = Date()
        let calendar = Calendar.current
        let today10AM = calendar.date(bySettingHour: 10, minute: 0, second: 0, of: now)!
        let today11AM = calendar.date(bySettingHour: 11, minute: 0, second: 0, of: now)!
        
        let tomorrow9AM = calendar.date(bySettingHour: 9, minute: 0, second: 0, of: now)!.addingTimeInterval(86400)
        let tomorrow12PM = calendar.date(bySettingHour: 12, minute: 0, second: 0, of: now)!.addingTimeInterval(86400)
        
        events = [
            CalendarEvent(title: "Team Standup",
                          start: today10AM,
                          end: today11AM,
                          notes: "Daily team sync",
                          color: .green),
            CalendarEvent(title: "Doctor Appointment",
                          start: tomorrow9AM,
                          end: tomorrow12PM,
                          notes: "Remember to bring forms",
                          color: .red),
            CalendarEvent(title: "All-Day Offsite",
                          start: now,
                          end: now,
                          allDay: true,
                          notes: "Offsite meeting day",
                          color: .blue)
        ]
    }
    
    func loadMockResources() {
        resources = [
            CalendarResource(id: UUID(), name: "Room A"),
            CalendarResource(id: UUID(), name: "Room B"),
            CalendarResource(id: UUID(), name: "Room C")
        ]
    }
    
    /// Example of how you might fetch from a remote feed
    func loadEventsFromRemote(urlString: String) { /* ... */ }
    
    /// Add or update an event
    func upsertEvent(_ event: CalendarEvent) {
        if let index = events.firstIndex(where: { $0.id == event.id }) {
            events[index] = event
        } else {
            events.append(event)
        }
    }
    
    /// Delete an event
    func deleteEvent(_ event: CalendarEvent) {
        if let index = events.firstIndex(of: event) {
            events.remove(at: index)
        }
    }
    
    // MARK: - New Drag-and-Drop Logic
    
    /// Move an event to a new start date/time. Optionally specify new duration.
    /// If you do not specify a duration, this example sets a default of 1 hour for time-based events.
    func moveEvent(withID id: UUID,
                   to newStart: Date,
                   duration: TimeInterval? = nil,
                   allDay: Bool? = nil) {
        guard let index = events.firstIndex(where: { $0.id == id }) else {
            return
        }
        
        var updated = events[index]
        
        // Decide if we’re setting all-day or not
        if let forceAllDay = allDay {
            updated.allDay = forceAllDay
        }
        
        updated.start = newStart
        
        // If allDay, let's keep end = start.
        // Otherwise, set an hour or the given duration.
        if updated.allDay {
            updated.end = newStart
        } else {
            let effectiveDuration = duration ?? 3600  // 1 hour default
            updated.end = newStart.addingTimeInterval(effectiveDuration)
        }
        
        events[index] = updated
    }
}
