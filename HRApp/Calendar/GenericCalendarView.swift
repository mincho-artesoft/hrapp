//
//  GenericCalendarView.swift
//  HRApp
//

import SwiftUI

struct GenericCalendarView<T: CalendarEvent>: View {
    enum CalendarMode: String, CaseIterable {
        case day    = "Day"
        case week   = "Week"
        case month  = "Month"
        case year   = "Year"
    }

    let events: [T]
    let colorForEvent: (T) -> Color
    let onDrop: ((T, Date) -> Bool)?

    @State private var mode: CalendarMode = .month
    @StateObject private var coordinator = GenericCalendarCoordinator()
    @State private var isDraggingEvent = false

    var body: some View {
        VStack(spacing: 0) {
            modePicker
            navHeader
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

    private var modePicker: some View {
        Picker("Mode", selection: $mode) {
            ForEach(CalendarMode.allCases, id: \.self) { m in
                Text(m.rawValue).tag(m)
            }
        }
        .pickerStyle(.segmented)
        .padding()
    }

    private var navHeader: some View {
        HStack {
            Button {
                coordinator.goPrev(mode)
            } label: {
                Image(systemName: "chevron.left")
            }
            Spacer()
            Text(coordinator.title(for: mode))
                .font(.headline)
            Spacer()
            Button {
                coordinator.goNext(mode)
            } label: {
                Image(systemName: "chevron.right")
            }
        }
        .padding(.horizontal)
        .padding(.bottom, 5)
    }
}

// MARK: - Coordinator
import Foundation

@MainActor
final class GenericCalendarCoordinator: ObservableObject {
    @Published var currentDate: Date = Date()
    private let calendar = Calendar.current

    var weekStart: Date {
        let comps = calendar.dateComponents([.yearForWeekOfYear, .weekOfYear], from: currentDate)
        return calendar.date(from: comps) ?? currentDate
    }
    var monthStart: Date {
        let comps = calendar.dateComponents([.year, .month], from: currentDate)
        return calendar.date(from: comps) ?? currentDate
    }
    var yearStart: Date {
        let comps = calendar.dateComponents([.year], from: currentDate)
        return calendar.date(from: comps) ?? currentDate
    }

    func goPrev(_ mode: GenericCalendarView<some CalendarEvent>.CalendarMode) {
        switch mode {
        case .day:
            currentDate = calendar.date(byAdding: .day, value: -1, to: currentDate) ?? currentDate
        case .week:
            currentDate = calendar.date(byAdding: .weekOfYear, value: -1, to: currentDate) ?? currentDate
        case .month:
            currentDate = calendar.date(byAdding: .month, value: -1, to: currentDate) ?? currentDate
        case .year:
            currentDate = calendar.date(byAdding: .year, value: -1, to: currentDate) ?? currentDate
        }
    }

    func goNext(_ mode: GenericCalendarView<some CalendarEvent>.CalendarMode) {
        switch mode {
        case .day:
            currentDate = calendar.date(byAdding: .day, value: 1, to: currentDate) ?? currentDate
        case .week:
            currentDate = calendar.date(byAdding: .weekOfYear, value: 1, to: currentDate) ?? currentDate
        case .month:
            currentDate = calendar.date(byAdding: .month, value: 1, to: currentDate) ?? currentDate
        case .year:
            currentDate = calendar.date(byAdding: .year, value: 1, to: currentDate) ?? currentDate
        }
    }

    func title(for mode: GenericCalendarView<some CalendarEvent>.CalendarMode) -> String {
        let fmt = DateFormatter()
        switch mode {
        case .day:
            fmt.dateStyle = .medium
            return fmt.string(from: currentDate)
        case .week:
            fmt.dateFormat = "'Week of' MMM d, yyyy"
            return fmt.string(from: weekStart)
        case .month:
            fmt.dateFormat = "MMMM yyyy"
            return fmt.string(from: monthStart)
        case .year:
            fmt.dateFormat = "yyyy"
            return fmt.string(from: yearStart)
        }
    }
}
