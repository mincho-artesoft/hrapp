//
//  GenericYearView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/20/25.
//

import SwiftUI

/// A generic year view for events conforming to CalendarEvent.
/// T is your event type (TimeOffRequest, Interview, etc.)
struct GenericYearView<T: CalendarEvent>: View {
    let yearStart: Date
    let events: [T]
    let colorForEvent: (T) -> Color
    let onDrop: ((T, Date) -> Bool)?
    @Binding var isDraggingEvent: Bool

    private let calendar = Calendar.current
    private let columns = Array(repeating: GridItem(.flexible()), count: 3) // 3 columns => 12 mini-months

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 16) {
                // Fix: add `id: \.self`
                ForEach(monthsInYear(), id: \.self) { monthStart in
                    YearMonthCell(
                        monthStart: monthStart,
                        events: events,
                        colorForEvent: colorForEvent,
                        onDrop: onDrop,
                        isDraggingEvent: $isDraggingEvent
                    )
                }
            }
            .padding()
        }
        .scrollDisabled(isDraggingEvent)
    }

    // Generate 12 months in the given year
    private func monthsInYear() -> [Date] {
        let year = calendar.component(.year, from: yearStart)
        // Return an array of Date for each month Jan..Dec
        return (1...12).compactMap { m in
            var comps = DateComponents()
            comps.year = year
            comps.month = m
            comps.day = 1
            return calendar.date(from: comps)
        }
    }
}

/// One cell representing a single month in the year
fileprivate struct YearMonthCell<T: CalendarEvent>: View {
    let monthStart: Date
    let events: [T]
    let colorForEvent: (T) -> Color
    let onDrop: ((T, Date) -> Bool)?
    @Binding var isDraggingEvent: Bool

    private let calendar = Calendar.current
    // 7 columns => S M T W Th F Sa
    private let columns = Array(repeating: GridItem(.flexible()), count: 7)

    var body: some View {
        VStack(alignment: .leading) {
            Text(monthStart.formatted(.dateTime.year().month(.wide)))
                .font(.headline)
            miniMonth
        }
        .padding()
        .background(Color.gray.opacity(0.05))
        .cornerRadius(8)
    }

    /// The mini grid for that month
    private var miniMonth: some View {
        LazyVGrid(columns: columns, spacing: 2) {
            let days = generateDaysInMonth()
            ForEach(days, id: \.self) { dayDate in
                dayCell(dayDate)
            }
        }
    }

    @ViewBuilder
    private func dayCell(_ dayDate: Date) -> some View {
        let isCurrentMonth = calendar.isDate(dayDate, equalTo: monthStart, toGranularity: .month)
        let dayEvents = events.filter { $0.overlapsDay(dayDate) }
        let dayColor = colorForCell(isCurrentMonth: isCurrentMonth, dayEvents: dayEvents)

        Rectangle()
            .foregroundColor(dayColor)
            .frame(height: 10)
            .overlay(
                Text("\(calendar.component(.day, from: dayDate))")
                    .font(.system(size: 7))
                    .foregroundColor(.white),
                alignment: .center
            )
            .draggableIfNeeded(dayEvents: dayEvents, colorForEvent: colorForEvent)
            .dropDestination(for: GenericEventTransfer.self) { items, _ in
                handleDrop(items, dayDate)
            }
    }

    private func colorForCell(isCurrentMonth: Bool, dayEvents: [T]) -> Color {
        guard isCurrentMonth else { return .gray.opacity(0.2) }
        if dayEvents.isEmpty {
            return .blue.opacity(0.15)
        }
        // If multiple events, pick color of first
        let firstEvent = dayEvents[0]
        return colorForEvent(firstEvent).opacity(0.5)
    }

    private func handleDrop(_ items: [GenericEventTransfer], _ dayDate: Date) -> Bool {
        guard let first = items.first,
              let onDrop else { return false }

        // Identify the dropped event in the array
        guard let droppedEvent = events.first(where: { $0.id as! UUID == first.eventID }) else {
            return false
        }
        let success = onDrop(droppedEvent, dayDate)
        return success
    }

    private func generateDaysInMonth() -> [Date] {
        guard let range = calendar.range(of: .day, in: .month, for: monthStart) else {
            return []
        }
        let firstWeekday = calendar.component(.weekday, from: monthStart)
        let leadingSpaces = firstWeekday - 1
        var dates: [Date] = []

        // Leading placeholders for alignment
        for i in 0..<leadingSpaces {
            if let placeholderDay = calendar.date(byAdding: .day, value: i - leadingSpaces, to: monthStart) {
                dates.append(placeholderDay)
            }
        }
        // Actual days
        for day in range {
            if let date = calendar.date(byAdding: .day, value: day - 1, to: monthStart) {
                dates.append(date)
            }
        }
        return dates
    }
}

// MARK: - Add .draggable if there is at least one event
fileprivate extension View {
    func draggableIfNeeded<T: CalendarEvent>(dayEvents: [T], colorForEvent: (T) -> Color) -> some View {
        guard let first = dayEvents.first else {
            // No events => return self
            return AnyView(self)
        }
        // We pick color from the first event for the preview
        let color = colorForEvent(first)
        let preview = {
            RoundedRectangle(cornerRadius: 4)
                .fill(color)
                .frame(width: 50, height: 20)
        }
        return AnyView(
            self.draggable(
                GenericEventTransfer(
                    eventID: first.id as! UUID,
                    originalStart: first.startDate,
                    originalEnd: first.endDate
                ),
                preview: preview
            )
        )
    }
}
