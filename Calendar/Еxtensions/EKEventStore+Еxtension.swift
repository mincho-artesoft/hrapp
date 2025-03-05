import EventKit

extension EKEventStore: @unchecked @retroactive Sendable{
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
    /// Зареждаме събития за месеца, групирани по дни
    func fetchEventsByDay(
        for month: Date,
        calendar: Calendar,
        allowedCalendarIDs: Set<String>
    ) -> [Date: [EKEvent]] {
        // Начало на месеца
        let comp = calendar.dateComponents([.year, .month], from: month)
        guard let startOfMonth = calendar.date(from: comp) else { return [:] }

        // Начало на следващия месец
        var nextComp = DateComponents()
        nextComp.month = 1
        guard let startOfNextMonth = calendar.date(byAdding: nextComp, to: startOfMonth) else {
            return [:]
        }

        // Взимаме само календарите, които са разрешени
        let allowedCals = calendars(for: .event).filter {
            allowedCalendarIDs.contains($0.calendarIdentifier)
        }

        let predicate = predicateForEvents(
            withStart: startOfMonth,
            end: startOfNextMonth,
            calendars: allowedCals
        )
        let found = events(matching: predicate)

        var dict: [Date: [EKEvent]] = [:]
        for ev in found {
            let dayKey = calendar.startOfDay(for: ev.startDate)
            dict[dayKey, default: []].append(ev)
        }
        return dict
    }
}
