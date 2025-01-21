//
//  CalendarViewModel.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//


//
//  CalendarViewModel.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI
import Combine

class CalendarViewModel: ObservableObject {
    
    @Published var events: [CalendarEvent] = []
    @Published var resources: [CalendarResource] = []
    
    private let calendar = Calendar.current
    
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
            CalendarEvent(
                title: "Team Standup",
                start: today10AM,
                end: today11AM,
                notes: "Daily team sync",
                color: .green,
                repeatRule: .never
            ),
            CalendarEvent(
                title: "Doctor Appointment",
                start: tomorrow9AM,
                end: tomorrow12PM,
                notes: "Remember to bring forms",
                color: .red,
                repeatRule: .never
            ),
            CalendarEvent(
                title: "All-Day Offsite",
                start: now,
                end: now,
                allDay: true,
                notes: "Offsite meeting day",
                color: .blue,
                repeatRule: .never
            )
        ]
    }
    
    func loadMockResources() {
        resources = [
            CalendarResource(id: UUID(), name: "Room A"),
            CalendarResource(id: UUID(), name: "Room B"),
            CalendarResource(id: UUID(), name: "Room C")
        ]
    }
    
    // MARK: - CRUD
    
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
    
    // MARK: - Repeating Expansion
    
    /// Return all event occurrences that fall on the given day,
    /// expanding any repeating events to that day if they match.
    func eventsForDay(_ day: Date) -> [CalendarEvent] {
        var results: [CalendarEvent] = []
        
        for event in events {
            // Expand this event for the given day
            let expansions = expansionsOf(event, day: day)
            results.append(contentsOf: expansions)
        }
        // Sort by start time
        results.sort { $0.start < $1.start }
        return results
    }
    
    /// For a single CalendarEvent, return 0 or 1 occurrences on the specified day
    /// (a repeating rule might generate an occurrence).
    private func expansionsOf(_ event: CalendarEvent, day: Date) -> [CalendarEvent] {
        // If the event doesn't repeat, just check if its actual start date is on "day"
        if event.repeatRule == .never {
            return calendar.isDate(event.start, inSameDayAs: day)
                   ? [event]
                   : []
        }
        
        // If repeating, we do a naive approach: the event recurs from its start date forward, no end date
        // (just like iOS would until some distant future). We only expand if day >= the start's day.
        // Then we check if "day" fits the pattern (every X days/weeks/months/years).
        
        // We do not handle negative recurrences (i.e. day < event.start).
        let startOfEventDay = calendar.startOfDay(for: event.start)
        let startOfRequestedDay = calendar.startOfDay(for: day)
        if startOfRequestedDay < startOfEventDay {
            // event wasn’t “active” yet
            return []
        }
        
        switch event.repeatRule {
        case .everyDay:
            // if day >= startDay, it repeats daily
            return [makeRepeatedOccurrence(base: event, day: day)]
            
        case .everyWeek:
            // check if day difference is multiple of 7
            let diffDays = daysBetween(startOfEventDay, startOfRequestedDay)
            if diffDays % 7 == 0 {
                return [makeRepeatedOccurrence(base: event, day: day)]
            }
            
        case .every2Weeks:
            // check if day difference is multiple of 14
            let diffDays = daysBetween(startOfEventDay, startOfRequestedDay)
            if diffDays % 14 == 0 {
                return [makeRepeatedOccurrence(base: event, day: day)]
            }
            
        case .everyMonth:
            // naive approach: same day-of-month each time
            let startComps = calendar.dateComponents([.day, .month, .year], from: event.start)
            let dayComps = calendar.dateComponents([.day, .month, .year], from: day)
            if let startDay = startComps.day,
               let dayDay = dayComps.day,
               let startMonth = startComps.month,
               let dayMonth = dayComps.month,
               let startYear = startComps.year,
               let dayYear = dayComps.year {
                
                // month offset from event start
                let monthDiff = (dayYear - startYear) * 12 + (dayMonth - startMonth)
                
                if monthDiff >= 0, dayDay == startDay {
                    return [makeRepeatedOccurrence(base: event, day: day)]
                }
            }
            
        case .everyYear:
            // naive approach: same month/day each year
            let df = DateFormatter()
            df.dateFormat = "MM-dd"
            
            let startMD = df.string(from: event.start)
            let requestedMD = df.string(from: day)
            if requestedMD == startMD, day >= startOfEventDay {
                return [makeRepeatedOccurrence(base: event, day: day)]
            }
            
        case .custom:
            // not implemented
            return []
            
        case .never:
            break
        }
        
        return []
    }
    
    /// Construct a “copy” of `baseEvent` that occurs on `day`.
    /// We keep the same start/end time-of-day, but the date is `day`.
    private func makeRepeatedOccurrence(base: CalendarEvent, day: Date) -> CalendarEvent {
        let newStart = combine(day: day, time: base.start)
        let newEnd   = combine(day: day, time: base.end)
        
        // new ephemeral ID so ForEach won't confuse them
        return CalendarEvent(
            id: UUID(),
            title: base.title,
            start: newStart,
            end: newEnd,
            allDay: base.allDay,
            notes: base.notes,
            color: base.color,
            repeatRule: base.repeatRule,
            editable: base.editable
        )
    }
    
    /// Merge date (year/month/day) from `day` with hour/min/sec from `time`.
    private func combine(day: Date, time: Date) -> Date {
        var dayComps = calendar.dateComponents([.year, .month, .day], from: day)
        let timeComps = calendar.dateComponents([.hour, .minute, .second], from: time)
        
        dayComps.hour = timeComps.hour
        dayComps.minute = timeComps.minute
        dayComps.second = timeComps.second
        
        return calendar.date(from: dayComps) ?? day
    }
    
    private func daysBetween(_ start: Date, _ end: Date) -> Int {
        calendar.dateComponents([.day], from: start, to: end).day ?? 0
    }
    
    // MARK: - Drag-and-Drop Logic
    
    /// Move an event to a new start date/time. Optionally specify new duration.
    /// If you do not specify a duration, we set a default of 1 hour for time-based events.
    func moveEvent(withID id: UUID,
                   to newStart: Date,
                   duration: TimeInterval? = nil,
                   allDay: Bool? = nil) {
        
        guard let index = events.firstIndex(where: { $0.id == id }) else {
            return
        }
        
        var updated = events[index]
        if let forceAllDay = allDay {
            updated.allDay = forceAllDay
        }
        
        updated.start = newStart
        
        // If allDay, keep end = start. Otherwise set duration or 1 hr.
        if updated.allDay {
            updated.end = newStart
        } else {
            let effectiveDuration = duration ?? 3600 // 1 hour
            updated.end = newStart.addingTimeInterval(effectiveDuration)
        }
        
        events[index] = updated
    }
}

// MARK: - Resource Example

struct CalendarResource: Identifiable, Hashable {
    let id: UUID
    var name: String
}