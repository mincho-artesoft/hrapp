//
//  GenericCalendarView.swift
//  HRApp
//
//  Примерен универсален календарен изглед, който показва [T] events,
//  използва coordinator, и прилага drag&drop.
//
//  Забележка: Вече нямаме enum CalendarMode тук!
//  Ползваме глобалния (от CalendarCoordinator.swift).
//

import SwiftUI

struct GenericCalendarView<T: CalendarEvent>: View {

    // Приемаме данните
    let events: [T]
    let colorForEvent: (T) -> Color
    let onDrop: ((T, Date) -> Bool)?
    
    // Binding към външна променлива, за да блокираме scroll
    @Binding var isDraggingEvent: Bool
    
    // Също приемаме mode и coordinator отвън, вместо да ги държим тук
    let mode: CalendarMode
    @ObservedObject var coordinator: CalendarCoordinator

    var body: some View {
        switch mode {
        case .day:
            GenericDayView(
                date: coordinator.currentDate,
                events: events,
                colorForEvent: colorForEvent,
                isDraggingEvent: $isDraggingEvent,
                onDrop: onDrop
            )
        case .week:
            GenericWeekView(
                weekStart: coordinator.weekStart,
                events: events,
                colorForEvent: colorForEvent,
                isDraggingEvent: $isDraggingEvent,
                onDrop: onDrop
            )
        case .month:
            GenericMonthView(
                monthStart: coordinator.monthStart,
                events: events,
                colorForEvent: colorForEvent,
                isDraggingEvent: $isDraggingEvent,
                onDrop: onDrop
            )
        case .year:
            GenericYearView(
                yearStart: coordinator.yearStart,
                events: events,
                colorForEvent: colorForEvent,
                onDrop: onDrop,
                isDraggingEvent: $isDraggingEvent
            )
        }
    }
}
