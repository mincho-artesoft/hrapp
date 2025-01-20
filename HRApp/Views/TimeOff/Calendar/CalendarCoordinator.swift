//
//  CalendarCoordinator.swift
//  HRApp
//
//  Created by Mincho Milev on 1/19/25.
//


import Foundation
import SwiftUI

@MainActor
class CalendarCoordinator: ObservableObject {
    @Published var currentDate: Date = Date()

    private let calendar = Calendar.current

    var weekStart: Date {
        // Get start of the week from currentDate
        calendar.startOfWeek(for: currentDate)
    }

    var monthStart: Date {
        // Get first day of the month from currentDate
        calendar.startOfMonth(for: currentDate)
    }

    var yearStart: Date {
        // Get first day of the year from currentDate
        calendar.startOfYear(for: currentDate)
    }

    // Shift date when going next/prev
    func goToNextPeriod(mode: TimeOffCalendarView.CalendarMode) {
        switch mode {
        case .day:
            if let newDate = calendar.date(byAdding: .day, value: 1, to: currentDate) {
                currentDate = newDate
            }
        case .week:
            if let newDate = calendar.date(byAdding: .weekOfYear, value: 1, to: currentDate) {
                currentDate = newDate
            }
        case .month:
            if let newDate = calendar.date(byAdding: .month, value: 1, to: currentDate) {
                currentDate = newDate
            }
        case .year:
            if let newDate = calendar.date(byAdding: .year, value: 1, to: currentDate) {
                currentDate = newDate
            }
        }
    }

    func goToPreviousPeriod(mode: TimeOffCalendarView.CalendarMode) {
        switch mode {
        case .day:
            if let newDate = calendar.date(byAdding: .day, value: -1, to: currentDate) {
                currentDate = newDate
            }
        case .week:
            if let newDate = calendar.date(byAdding: .weekOfYear, value: -1, to: currentDate) {
                currentDate = newDate
            }
        case .month:
            if let newDate = calendar.date(byAdding: .month, value: -1, to: currentDate) {
                currentDate = newDate
            }
        case .year:
            if let newDate = calendar.date(byAdding: .year, value: -1, to: currentDate) {
                currentDate = newDate
            }
        }
    }

    func currentPeriodTitle(mode: TimeOffCalendarView.CalendarMode) -> String {
        let formatter = DateFormatter()
        switch mode {
        case .day:
            formatter.dateStyle = .medium
            formatter.timeStyle = .none
            return formatter.string(from: currentDate)
        case .week:
            // Display "Week of MMM d, yyyy"
            formatter.dateFormat = "'Week of' MMM d, yyyy"
            return formatter.string(from: weekStart)
        case .month:
            formatter.dateFormat = "MMMM yyyy"
            return formatter.string(from: monthStart)
        case .year:
            formatter.dateFormat = "yyyy"
            return formatter.string(from: yearStart)
        }
    }
}

// Convenience extensions
extension Calendar {
    func startOfWeek(for date: Date) -> Date {
        let comps = dateComponents([.yearForWeekOfYear, .weekOfYear], from: date)
        return self.date(from: comps) ?? date
    }

    func startOfMonth(for date: Date) -> Date {
        let comps = dateComponents([.year, .month], from: date)
        return self.date(from: comps) ?? date
    }

    func startOfYear(for date: Date) -> Date {
        let comps = dateComponents([.year], from: date)
        return self.date(from: comps) ?? date
    }
}