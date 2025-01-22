//
//  CalendarDayView.swift
//  hrapp
//

import SwiftUI

struct CalendarDayView: View {
    @ObservedObject var viewModel: CalendarViewModel
    @Binding var selectedDate: Date
    
    let startHour: Int
    let endHour: Int
    let slotMinutes: Int
    
    @Binding var highlightedEventID: UUID?
    
    private let calendar = Calendar.current
    
    var body: some View {
        VStack(spacing: 0) {
            // 1) All-day row
            allDayRow
            Divider()
            // 2) The time grid
            timeGrid
        }
    }
    
    // MARK: - Subviews
    
    private var allDayRow: some View {
        AllDayRowView(
            date: selectedDate,
            events: dayAllDayEvents,
            onEventTapped: handleEventTapped,
            onDrop: handleDropAllDay
        )
    }
    
    private var timeGrid: some View {
        GeometryReader { geo in
            ScrollView {
                ZStack(alignment: .topLeading) {
                    DayTimeGridBackground(
                        startHour: startHour,
                        endHour: endHour,
                        slotMinutes: slotMinutes
                    )
                    
                    // Timed events
                    ForEach(dayTimedEvents) { event in
                        let yPos    = dayEventY(event: event, totalHeight: geo.size.height)
                        let eHeight = dayEventHeight(event: event, totalHeight: geo.size.height)
                        let isHighlighted = (highlightedEventID == event.id)
                        
                        EventBlockView(
                            event: event,
                            isHighlighted: isHighlighted,
                            onEventTapped: handleEventTapped,
                            onResizeTop: { delta in
                                resizeEventTop(event: event, deltaY: delta, totalHeight: geo.size.height)
                            },
                            onResizeBottom: { delta in
                                resizeEventBottom(event: event, deltaY: delta, totalHeight: geo.size.height)
                            }
                        )
                        .frame(width: geo.size.width - 8, height: eHeight)
                        .position(x: geo.size.width / 2, y: yPos + eHeight / 2)
                        // Drag & drop
                        .draggable(
                            CalendarEventDragTransfer(eventID: event.id),
                            gestures: [.pressAndDrag]
                        )
                        .dropDestination(for: CalendarEventDragTransfer.self) { items, location in
                            guard let first = items.first else { return false }
                            handleDropOnTimeGrid(
                                eventID: first.eventID,
                                locationY: location.y,
                                geoHeight: geo.size.height
                            )
                            return true
                        }
                    }
                }
                // For demo, a fixed large height:
                .frame(height: 1000)
            }
        }
    }
    
    // MARK: - Computed event arrays
    
    private var dayAllDayEvents: [CalendarEvent] {
        viewModel.events.filter {
            $0.allDay && calendar.isDate($0.start, inSameDayAs: selectedDate)
        }
    }
    
    private var dayTimedEvents: [CalendarEvent] {
        viewModel.events.filter {
            !$0.allDay
            && dateRangeOverlap(
                $0.start, $0.end,
                calendar.startOfDay(for: selectedDate),
                calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: selectedDate))!
            )
        }
    }
    
    // MARK: - Drop handlers
    
    private func handleDropAllDay(_ eventID: UUID) {
        // Convert the dropped event to all-day on selectedDate
        viewModel.moveEvent(eventID: eventID, newStart: selectedDate, newAllDay: true)
        highlightedEventID = eventID
    }
    
    private func handleDropOnTimeGrid(eventID: UUID, locationY: CGFloat, geoHeight: CGFloat) {
        // Snap the dropped event to an hour matching locationY
        let newStart = dayTimeFromY(locationY, totalHeight: geoHeight)
        // Give it a default 1-hour duration for demonstration
        viewModel.moveEvent(eventID: eventID, newStart: newStart, newAllDay: false, newDuration: 3600)
        highlightedEventID = eventID
    }
    
    // MARK: - Taps & Resizing
    
    private func handleEventTapped(_ event: CalendarEvent) {
        // Toggle or show details if already highlighted
        if highlightedEventID == event.id {
            // e.g. present detail sheet
        } else {
            highlightedEventID = event.id
        }
    }
    
    private func resizeEventTop(event: CalendarEvent, deltaY: CGFloat, totalHeight: CGFloat) {
        let minuteDelta = minuteFromDeltaY(deltaY, totalHeight: totalHeight)
        let newStart = event.start.addingTimeInterval(minuteDelta * 60)
        viewModel.resizeEvent(eventID: event.id, newStart: newStart)
    }
    
    private func resizeEventBottom(event: CalendarEvent, deltaY: CGFloat, totalHeight: CGFloat) {
        let minuteDelta = minuteFromDeltaY(deltaY, totalHeight: totalHeight)
        let newEnd = event.end.addingTimeInterval(minuteDelta * 60)
        viewModel.resizeEvent(eventID: event.id, newEnd: newEnd)
    }
    
    // MARK: - Geometry Helpers
    
    private func dayEventY(event: CalendarEvent, totalHeight: CGFloat) -> CGFloat {
        let minutesInDay = Double((endHour - startHour) * 60)
        guard let dayStart = calendar.date(
            bySettingHour: startHour,
            minute: 0,
            second: 0,
            of: selectedDate
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
    
    private func dayTimeFromY(_ y: CGFloat, totalHeight: CGFloat) -> Date {
        let minutesInDay = Double((endHour - startHour) * 60)
        let fraction = Double(y / totalHeight)
        let offsetMins = max(0, min(minutesInDay, fraction * minutesInDay))
        
        guard let dayStart = calendar.date(
            bySettingHour: startHour,
            minute: 0,
            second: 0,
            of: selectedDate
        ) else {
            return selectedDate
        }
        
        return dayStart.addingTimeInterval(offsetMins * 60)
    }
    
    private func minuteFromDeltaY(_ deltaY: CGFloat, totalHeight: CGFloat) -> Double {
        let minutesInDay = Double((endHour - startHour) * 60)
        let fraction = Double(deltaY / totalHeight)
        return fraction * minutesInDay
    }
}
