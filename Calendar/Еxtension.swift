import Foundation
import EventKit



extension Calendar {
    /// Генерира 42 дати (6 седмици по 7 дни) за даден месец,
    /// включително предишните и следващите дни, за да се запълни "grid".
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
        
        // Предишни дни
        for i in 0..<daysToPrepend {
            if let d = self.date(byAdding: .day, value: i - daysToPrepend, to: monthStart) {
                dates.append(d)
            }
        }
        // Текущ месец
        for i in 0..<numberOfDaysInMonth {
            if let d = self.date(byAdding: .day, value: i, to: monthStart) {
                dates.append(d)
            }
        }
        // Следващи дни
        for i in 0..<daysToAppend {
            if let d = self.date(byAdding: .day, value: i, to: monthStart.addingTimeInterval(TimeInterval(60*60*24*numberOfDaysInMonth))) {
                dates.append(d)
            }
        }
        
        return dates
    }
}

extension EKEventStore {
    /// Зарежда всички събития за даден месец, групирани по ден
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

// MARK: - Помощни разширения (без промени)
extension Date {
    func dateOnly(calendar: Calendar) -> Date {
        let yearComponent = calendar.component(.year, from: self)
        let monthComponent = calendar.component(.month, from: self)
        let dayComponent = calendar.component(.day, from: self)
        let zone = calendar.timeZone

        let newComponents = DateComponents(timeZone: zone,
                                           year: yearComponent,
                                           month: monthComponent,
                                           day: dayComponent)
        let returnValue = calendar.date(from: newComponents)
        return returnValue!
    }
}
