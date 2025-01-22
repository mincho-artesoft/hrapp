//
//  CalendarApp.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 22/1/25.
//

import SwiftUI

@main
struct CalendarApp: App {
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
import EventKit

extension EKEventStore {
    /// Връща речник [Date: [EKEvent]] за всички събития през дадения месец.
    /// Ключът е "началото на деня" (Date с часове занулени), а стойността е списък от EKEvent за този ден.
    func fetchEventsByDay(for month: Date, calendar: Calendar) -> [Date: [EKEvent]] {
        // 1) Намираме 1-во число на месеца
        guard let startOfMonth = calendar.date(from: calendar.dateComponents([.year, .month], from: month)),
              // 2) Намираме 1-во число на следващия месец
              let startOfNextMonth = calendar.date(byAdding: DateComponents(month: 1), to: startOfMonth)
        else {
            return [:]
        }
        
        // 3) Създаваме predicate, за да вземем събитията от startOfMonth до startOfNextMonth
        let predicate = predicateForEvents(withStart: startOfMonth, end: startOfNextMonth, calendars: nil)
        
        // 4) Четем събитията
        let events = events(matching: predicate)
        
        // 5) Групираме по "началото на деня"
        var eventsByDay: [Date: [EKEvent]] = [:]
        
        for event in events {
            // calendar.startOfDay(for:) занулява часовете, за да имаме само датата
            let startDay = calendar.startOfDay(for: event.startDate)
            eventsByDay[startDay, default: []].append(event)
        }
        
        return eventsByDay
    }
}
import Foundation

extension Calendar {
    /// Генерира масив от 42 дати (6 реда х 7 колони) за дадения месец
    func generateDatesForMonthGrid(for referenceDate: Date) -> [Date] {
        // 1) Началото на месеца
        guard let monthStart = self.date(from: self.dateComponents([.year, .month], from: referenceDate)) else {
            return []
        }
        
        // 2) Определяме кой ден от седмицата е monthStart
        let weekdayOfMonthStart = component(.weekday, from: monthStart)
        let firstWeekday = self.firstWeekday
        
        // 3) Колко дни да запълним преди 1-во число
        let daysToPrepend = (weekdayOfMonthStart - firstWeekday + 7) % 7
        
        // 4) Колко дни има самият месец
        guard let rangeOfDaysInMonth = range(of: .day, in: .month, for: monthStart) else {
            return []
        }
        let numberOfDaysInMonth = rangeOfDaysInMonth.count
        
        // 5) Нужни са ни общо 42 клетки (6 седмици x 7 дни)
        let totalCells = 42
        let daysToAppend = totalCells - daysToPrepend - numberOfDaysInMonth
        
        var dates: [Date] = []
        
        // 5.1) Дните "преди" месеца
        for i in 0..<daysToPrepend {
            if let d = self.date(byAdding: .day, value: i - daysToPrepend, to: monthStart) {
                dates.append(d)
            }
        }
        
        // 5.2) Дните от текущия месец
        for i in 0..<numberOfDaysInMonth {
            if let d = self.date(byAdding: .day, value: i, to: monthStart) {
                dates.append(d)
            }
        }
        
        // 5.3) Дните "след" месеца
        for i in 0..<daysToAppend {
            let offsetBase = monthStart.addingTimeInterval(TimeInterval(60*60*24*numberOfDaysInMonth))
            if let d = self.date(byAdding: .day, value: i, to: offsetBase) {
                dates.append(d)
            }
        }
        
        return dates
    }
}
