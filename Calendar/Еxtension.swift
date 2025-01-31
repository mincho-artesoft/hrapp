import Foundation
import EventKit

extension Calendar {
    /// Generate an array of 42 dates for a typical 6-row month grid
    func generateDatesForMonthGrid(for referenceDate: Date) -> [Date] {
        guard let monthStart = self.date(from: dateComponents([.year, .month], from: referenceDate)) else {
            return []
        }

        let weekdayOfMonthStart = component(.weekday, from: monthStart)
        let firstWeekday = self.firstWeekday
        let daysToPrepend = (weekdayOfMonthStart - firstWeekday + 7) % 7

        guard let rangeOfDaysInMonth = range(of: .day, in: .month, for: monthStart) else {
            return []
        }
        let numberOfDaysInMonth = rangeOfDaysInMonth.count

        let totalCells = 42
        let daysToAppend = totalCells - daysToPrepend - numberOfDaysInMonth

        var dates: [Date] = []

        // Previous
        for i in 0..<daysToPrepend {
            if let d = self.date(byAdding: .day, value: i - daysToPrepend, to: monthStart) {
                dates.append(d)
            }
        }
        // Current
        for i in 0..<numberOfDaysInMonth {
            if let d = self.date(byAdding: .day, value: i, to: monthStart) {
                dates.append(d)
            }
        }
        // Next
        for i in 0..<daysToAppend {
            if let d = self.date(byAdding: .day, value: i, to: monthStart.addingTimeInterval(60*60*24*TimeInterval(numberOfDaysInMonth))) {
                dates.append(d)
            }
        }

        return dates
    }
}

extension Date {
    func dateOnly(calendar: Calendar) -> Date {
        let comps = calendar.dateComponents([.year, .month, .day], from: self)
        return calendar.date(from: comps) ?? self
    }
}

extension EKEventStore {
    /// Fetch events in a given month, returning a [Date: [EKEvent]] dictionary
    func fetchEventsByDay(for month: Date, calendar: Calendar) -> [Date: [EKEvent]] {
        guard
            let startOfMonth = calendar.date(from: calendar.dateComponents([.year, .month], from: month)),
            let startOfNextMonth = calendar.date(byAdding: .month, value: 1, to: startOfMonth)
        else {
            return [:]
        }

        let predicate = predicateForEvents(withStart: startOfMonth, end: startOfNextMonth, calendars: nil)
        let foundEvents = events(matching: predicate)

        var dict: [Date: [EKEvent]] = [:]
        for ev in foundEvents {
            let dayKey = calendar.startOfDay(for: ev.startDate)
            dict[dayKey, default: []].append(ev)
        }
        return dict
    }
}
