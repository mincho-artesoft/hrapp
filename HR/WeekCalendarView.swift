//
//  WeekCalendarView.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI

struct WeekCalendarView: View {
    @Binding var selectedDate: Date
    @ObservedObject var viewModel: CalendarViewModel
    
    /// Called when the user double-taps an event
    let onEventDoubleTap: (CalendarEvent) -> Void
    
    /// Called when user drops an event’s drag item onto a time slot
    let onEventDrop: (UUID, Date) -> Void
    
    private let calendar = Calendar.current
    private let businessHours = 8...17 // 8 AM to 5 PM, for example
    
    var body: some View {
        let weekStart = startOfWeek(for: selectedDate)
        let days = (0..<7).compactMap { offset in
            calendar.date(byAdding: .day, value: offset, to: weekStart)
        }
        
        ScrollView(.horizontal, showsIndicators: true) {
            HStack(spacing: 8) {
                ForEach(days, id: \.self) { day in
                    // Each day in the week:
                    VStack(alignment: .leading, spacing: 0) {
                        // Day header
                        Text(dayHeaderString(for: day))
                            .font(.subheadline)
                            .padding(4)
                            .background(
                                calendar.isDate(day, inSameDayAs: selectedDate)
                                ? Color.blue.opacity(0.15)
                                : Color.gray.opacity(0.1)
                            )
                            .onTapGesture {
                                // Tapping the day label sets the selectedDate
                                selectedDate = day
                            }
                        
                        Divider()
                        
                        // Hour slots
                        ScrollView {
                            VStack(spacing: 0) {
                                ForEach(businessHours, id: \.self) { hour in
                                    hourCell(day: day, hour: hour)
                                        .frame(height: 50)
                                        .border(Color.gray.opacity(0.2), width: 0.5)
                                }
                            }
                        }
                    }
                    .frame(width: 120) // or however wide you want each day column
                    .cornerRadius(4)
                }
            }
            .padding(.vertical, 4)
            .padding(.horizontal, 4)
        }
    }
    
    // MARK: - Hour Cell
    
    /// Builds a time slot cell for the given day & hour
    
    private func hourCell(day: Date, hour: Int) -> some View {
        // Attempt to create the date for this hour
        let slotTime = calendar.date(bySettingHour: hour, minute: 0, second: 0, of: day)
        
        // Filter events that occur this hour
        let events = viewModel.eventsForDay(day).filter { event in
            // If allDay => put at hour 0, or handle separately. Skipped for brevity.
            if event.allDay { return false }
            let eventHour = calendar.component(.hour, from: event.start)
            return eventHour == hour
        }
        
        return ZStack(alignment: .topLeading) {
            // Make the entire cell a valid hit test area for tapping/dragging.
            // You can use .contentShape(Rectangle()) or a small opacity color:
            Color.white.opacity(0.001)
            
            if let _ = slotTime {
                // Show each event if we have a valid time
                ForEach(events) { event in
                    Text(event.title)
                        .font(.system(size: 10))
                        .padding(2)
                        .background(event.color.opacity(0.3))
                        .cornerRadius(3)
                        .draggable(CalendarEventDragTransfer(eventID: event.id))
                        .onTapGesture(count: 2) {
                            onEventDoubleTap(event)
                        }
                }
            } else {
                // If slotTime is invalid, render a fallback or nothing
                Color.clear
            }
        }
        // Accept drop of an event, only if slotTime is valid
        .dropDestination(for: CalendarEventDragTransfer.self) { items, _ in
            guard
                let dragItem = items.first,
                let slotTime = slotTime
            else {
                return false
            }
            onEventDrop(dragItem.eventID, slotTime)
            return true
        }
    }

    
    // MARK: - Helpers
    
    /// Return the start of the week for the given date, e.g. Monday or Sunday.
    /// Adjust .weekday ordinal if you want Monday-based or Sunday-based weeks.
    private func startOfWeek(for date: Date) -> Date {
        let comps = calendar.dateComponents([.yearForWeekOfYear, .weekOfYear], from: date)
        // This uses the user’s locale to pick the correct “first day” of the week.
        return calendar.date(from: comps) ?? date
    }
    
    /// Format day header. E.g. "Mon 23"
    private func dayHeaderString(for day: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "EEE d" // e.g. "Mon 23"
        return df.string(from: day)
    }
}
