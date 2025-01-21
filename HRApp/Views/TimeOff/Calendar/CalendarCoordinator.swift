//
//  CalendarCoordinator.swift
//  HRApp
//
//  Created by Mincho Milev on ...
//

import Foundation
import SwiftUI

/// (1) Глобален еnum - CalendarMode
/// За да няма дублиране и грешки "не е член на TimeOffCalendarView",
/// го изваждаме най-отгоре, за да е достъпен навсякъде.
enum CalendarMode: String, CaseIterable {
    case day    = "Day"
    case week   = "Week"
    case month  = "Month"
    case year   = "Year"
}

/// (2) Coordinator, който се занимава със смяна на дати
@MainActor
class CalendarCoordinator: ObservableObject {
    @Published var currentDate: Date = Date()
    
    private let calendar = Calendar.current
    
    var weekStart: Date {
        calendar.startOfWeek(for: currentDate)
    }
    var monthStart: Date {
        calendar.startOfMonth(for: currentDate)
    }
    var yearStart: Date {
        calendar.startOfYear(for: currentDate)
    }
    
    func goToNextPeriod(mode: CalendarMode) {
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
    
    func goToPreviousPeriod(mode: CalendarMode) {
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
    
    func currentPeriodTitle(mode: CalendarMode) -> String {
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

// MARK: - Calendar Extensions for startOfWeek / startOfMonth / startOfYear
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
    