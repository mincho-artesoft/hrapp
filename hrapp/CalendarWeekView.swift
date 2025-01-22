//
//  CalendarWeekView.swift
//  hrapp
//

import SwiftUI

struct CalendarWeekView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    @Binding var selectedDate: Date
    @Binding var highlightedEventID: UUID?
    
    let startHour: Int
    let endHour: Int
    let slotMinutes: Int
    
    private let calendar = Calendar.current
    
    var body: some View {
        let days = daysInWeek(containing: selectedDate)
        
        ScrollView(.horizontal) {
            HStack(spacing: 2) {
                ForEach(days, id: \.self) { day in
                    DayColumnView(
                        day: day,
                        allDayEvents: allDayEvents(for: day),
                        timedEvents: timedEvents(for: day),
                        startHour: startHour,
                        endHour: endHour,
                        slotMinutes: slotMinutes,
                        highlightedEventID: $highlightedEventID,
                        selectedDate: $selectedDate,
                        onAllDayDrop: { eventID in
                            // Convert to an all-day event on `day`
                            viewModel.moveEvent(eventID: eventID, newStart: day, newAllDay: true)
                            highlightedEventID = eventID
                        },
                        onTimedDrop: { eventID, locationY, geoHeight in
                            let newStart = dayTimeFromY(day: day, y: locationY, geoHeight: geoHeight)
                            viewModel.moveEvent(eventID: eventID, newStart: newStart, newAllDay: false)
                            highlightedEventID = eventID
                        },
                        onEventTapped: handleEventTapped,
                        onResizeTop: { event, deltaY, totalHeight in
                            resizeEventTop(event: event, deltaY: deltaY, totalHeight: totalHeight)
                        },
                        onResizeBottom: { event, deltaY, totalHeight in
                            resizeEventBottom(event: event, deltaY: deltaY, totalHeight: totalHeight)
                        }
                    )
                    .frame(width: 120)
                }
            }
        }
    }
}

// MARK: - Subview for Each Day Column

private struct DayColumnView: View {
    let day: Date
    let allDayEvents: [CalendarEvent]
    let timedEvents: [CalendarEvent]
    
    let startHour: Int
    let endHour: Int
    let slotMinutes: Int
    
    @Binding var highlightedEventID: UUID?
    @Binding var selectedDate: Date
    
    /// Called when an event is dropped onto the All-Day row for this day
    let onAllDayDrop: (UUID) -> Void
    
    /// Called when an event is dropped onto the timed area, given the Y location
    let onTimedDrop: (UUID, CGFloat, CGFloat) -> Void
    
    /// Tapped an event
    let onEventTapped: (CalendarEvent) -> Void
    
    /// Resizing from top or bottom
    let onResizeTop: (CalendarEvent, CGFloat, CGFloat) -> Void
    let onResizeBottom: (CalendarEvent, CGFloat, CGFloat) -> Void
    
    var body: some View {
        VStack(spacing: 0) {
            // All-Day row
            AllDayRowView(
                date: day,
                events: allDayEvents,
                onEventTapped: onEventTapped,
                onDrop: onAllDayDrop
            )
            Divider()
            
            // Timed area
            GeometryReader { geo in
                TimedDayAreaView(
                    day: day,
                    events: timedEvents,
                    startHour: startHour,
                    endHour: endHour,
                    slotMinutes: slotMinutes,
                    geoSize: geo.size,
                    highlightedEventID: $highlightedEventID,
                    selectedDate: $selectedDate,
                    onTimedDrop: onTimedDrop,
                    onEventTapped: onEventTapped,
                    onResizeTop: onResizeTop,
                    onResizeBottom: onResizeBottom
                )
            }
            .frame(height: 1000)
        }
    }
}

// MARK: - Subview for Timed Area

private struct TimedDayAreaView: View {
    let day: Date
    let events: [CalendarEvent]
    let startHour: Int
    let endHour: Int
    let slotMinutes: Int
    
    let geoSize: CGSize
    
    @Binding var highlightedEventID: UUID?
    @Binding var selectedDate: Date
    
    let onTimedDrop: (UUID, CGFloat, CGFloat) -> Void
    let onEventTapped: (CalendarEvent) -> Void
    let onResizeTop: (CalendarEvent, CGFloat, CGFloat) -> Void
    let onResizeBottom: (CalendarEvent, CGFloat, CGFloat) -> Void
    
    private let calendar = Calendar.current
    
    var body: some View {
        ZStack {
            DayTimeGridBackground(
                startHour: startHour,
                endHour: endHour,
                slotMinutes: slotMinutes
            )
            
            // Each timed event
            ForEach(events) { event in
                let isHighlighted = (highlightedEventID == event.id)
                let yPos = dayEventY(event: event, day: day, totalHeight: geoSize.height)
                let eHeight = dayEventHeight(event: event, totalHeight: geoSize.height)
                
                EventBlockView(
                    event: event,
                    isHighlighted: isHighlighted,
                    onEventTapped: onEventTapped,
                    onResizeTop: { delta in
                        onResizeTop(event, delta, geoSize.height)
                    },
                    onResizeBottom: { delta in
                        onResizeBottom(event, delta, geoSize.height)
                    }
                )
                .frame(width: geoSize.width - 8, height: eHeight)
                .position(x: geoSize.width / 2, y: yPos + eHeight / 2)
                .draggable(CalendarEventDragTransfer(eventID: event.id),
                           gestures: [.pressAndDrag])
                .dropDestination(for: CalendarEventDragTransfer.self) { items, location in
                    guard let first = items.first else { return false }
                    onTimedDrop(first.eventID, location.y, geoSize.height)
                    return true
                }
            }
        }
        .contentShape(Rectangle())
        // Tapping empty space resets highlight & sets selectedDate
        .simultaneousGesture(
            TapGesture()
                .onEnded {
                    highlightedEventID = nil
                    selectedDate = day
                }
        )
    }
    
    // MARK: - Geometry Helpers
    
    private func dayEventY(event: CalendarEvent, day: Date, totalHeight: CGFloat) -> CGFloat {
        let minutesInDay = Double((endHour - startHour) * 60)
        guard let dayStart = calendar.date(
            bySettingHour: startHour,
            minute: 0,
            second: 0,
            of: day
        ) else {
            return 0
        }
        
        let diffMins = event.start.timeIntervalSince(dayStart) / 60
        let fraction = diffMins / minutesInDay
        return CGFloat(max(0, min(1, fraction))) * totalHeight
    }
    
    private func dayEventHeight(event: CalendarEvent, totalHeight: CGFloat) -> CGFloat {
        let minutesInDay = Double((endHour - startHour) * 60)
        let durationMins = event.end.timeIntervalSince(event.start) / 60
        let fraction = durationMins / minutesInDay
        return max(20, CGFloat(fraction) * totalHeight)
    }
}

// MARK: - Main View Logic Extensions

extension CalendarWeekView {
    /// Return the 7 calendar dates for the week containing `date`.
    private func daysInWeek(containing date: Date) -> [Date] {
        // This uses "weekOfYear" logic.
        guard
            let startOfWeek = calendar.date(
                from: calendar.dateComponents([.weekOfYear, .yearForWeekOfYear], from: date)
            )
        else {
            return [date]
        }
        return (0..<7).compactMap {
            calendar.date(byAdding: .day, value: $0, to: startOfWeek)
        }
    }
    
    /// All-day events for a specific day
    private func allDayEvents(for day: Date) -> [CalendarEvent] {
        viewModel.events.filter {
            $0.allDay && calendar.isDate($0.start, inSameDayAs: day)
        }
    }
    
    /// Timed (non-all-day) events that overlap this day
    private func timedEvents(for day: Date) -> [CalendarEvent] {
        viewModel.events.filter {
            !$0.allDay &&
            dateRangeOverlap(
                $0.start, $0.end,
                calendar.startOfDay(for: day),
                calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: day))!
            )
        }
    }
    
    /// Tap on an event to highlight or begin editing
    private func handleEventTapped(_ event: CalendarEvent) {
        if highlightedEventID == event.id {
            // Already highlighted => e.g., show detail or do nothing
        } else {
            highlightedEventID = event.id
        }
    }
    
    /// Resizing from the top “handle”
    private func resizeEventTop(event: CalendarEvent, deltaY: CGFloat, totalHeight: CGFloat) {
        let minuteDelta = minuteFromDeltaY(deltaY, totalHeight: totalHeight)
        let newStart = event.start.addingTimeInterval(minuteDelta * 60)
        viewModel.resizeEvent(eventID: event.id, newStart: newStart)
    }
    
    /// Resizing from the bottom “handle”
    private func resizeEventBottom(event: CalendarEvent, deltaY: CGFloat, totalHeight: CGFloat) {
        let minuteDelta = minuteFromDeltaY(deltaY, totalHeight: totalHeight)
        let newEnd = event.end.addingTimeInterval(minuteDelta * 60)
        viewModel.resizeEvent(eventID: event.id, newEnd: newEnd)
    }
    
    /// Convert a vertical delta (in points) to minutes
    private func minuteFromDeltaY(_ deltaY: CGFloat, totalHeight: CGFloat) -> Double {
        let minutesInDay = Double((endHour - startHour) * 60)
        let fraction = Double(deltaY / totalHeight)
        return fraction * minutesInDay
    }
    
    /// Convert a Y location into a Date within the day
    private func dayTimeFromY(day: Date, y: CGFloat, geoHeight: CGFloat) -> Date {
        let minutesInDay = Double((endHour - startHour) * 60)
        let fraction = Double(y / geoHeight)
        let offsetMins = max(0, min(minutesInDay, fraction * minutesInDay))
        
        guard let dayStart = calendar.date(
            bySettingHour: startHour, minute: 0, second: 0, of: day
        ) else {
            return day
        }
        return dayStart.addingTimeInterval(offsetMins * 60)
    }
}
