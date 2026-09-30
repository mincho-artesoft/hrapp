import Foundation

/// Expands personal reminder occurrences without inserting synthetic calendar events.
/// Calendar arithmetic preserves the series' local hour across time-zone transitions.
enum TravelRecurrence {
    static func starts(start: Date, timeZone: String, rules: [SharedEventRecurrenceRule],
                       after now: Date, before horizon: Date, limit: Int = 8) -> [Date] {
        guard limit > 0, horizon > now else { return [] }
        var dates = Set<Date>()
        if start > now && start < horizon { dates.insert(start) }
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: timeZone) ?? .current
        calendar.firstWeekday = 2 // EventKit / RFC 5545 default: Monday.
        calendar.minimumDaysInFirstWeek = 4
        for rule in rules {
            dates.formUnion(expand(rule, start: start, calendar: calendar, after: now, before: horizon, limit: limit))
        }
        return Array(dates.sorted().prefix(limit))
    }

    private static func expand(_ rule: SharedEventRecurrenceRule, start: Date, calendar: Calendar,
                               after now: Date, before horizon: Date, limit: Int) -> [Date] {
        let units: [Calendar.Component] = [.day, .weekOfYear, .month, .year]
        guard units.indices.contains(rule.frequency), rule.interval > 0 else { return [] }
        let unit: Calendar.Component = rule.frequency == 3 && !(rule.weeksOfTheYear ?? []).isEmpty
            ? .yearForWeekOfYear : units[rule.frequency]
        guard var period = calendar.dateInterval(of: unit, for: start)?.start else { return [] }
        var inclusiveEnd: Date?
        var until = horizon
        if let value = rule.endDate {
            let formatter = ISO8601DateFormatter()
            var date = formatter.date(from: value)
            if date == nil {
                formatter.formatOptions.insert(.withFractionalSeconds)
                date = formatter.date(from: value)
            }
            guard let date else { return [] }
            inclusiveEnd = date
            until = min(horizon, date.addingTimeInterval(1)) // UNTIL includes the final start.
        }
        let countLimit = rule.endDate == nil ? rule.occurrenceCount : nil
        if let countLimit, countLimit <= 0 { return [] }
        // Skip elapsed periods only for uncounted series; COUNT belongs to DTSTART.
        if countLimit == nil, now > period,
           let distance = calendar.dateComponents([unit], from: period, to: now).value(for: unit),
           let advanced = calendar.date(byAdding: unit, value: (distance / rule.interval) * rule.interval, to: period) {
            period = advanced
        }
        let fractionalSecond = start.timeIntervalSinceReferenceDate - floor(start.timeIntervalSinceReferenceDate)
        let clock = calendar.dateComponents([.hour, .minute, .second], from: start)
        let original = calendar.dateComponents([.month, .day, .weekday], from: start)
        var emitted = 0
        var result: [Date] = []
        while period < until {
            guard let periodEnd = calendar.date(byAdding: unit, value: 1, to: period),
                  let nextPeriod = calendar.date(byAdding: unit, value: rule.interval, to: period), nextPeriod > period else { break }
            var day = period
            var matches: [Date] = []
            while day < periodEnd {
                if matchesDay(day, rule: rule, original: original, calendar: calendar) {
                    var components = calendar.dateComponents([.year, .month, .day], from: day)
                    components.hour = clock.hour
                    components.minute = clock.minute
                    components.second = clock.second
                    // date(from:) can normalize impossible times; reject that normalization.
                    if let date = calendar.date(from: components),
                       calendar.dateComponents([.year, .month, .day, .hour, .minute, .second], from: date) == components {
                        matches.append(date.addingTimeInterval(fractionalSecond))
                    }
                }
                guard let next = calendar.date(byAdding: .day, value: 1, to: day), next > day else { break }
                day = next
            }
            if let positions = rule.setPositions, !positions.isEmpty {
                matches = Array(Set(positions.compactMap { position -> Date? in
                    let index = position > 0 ? position - 1 : matches.count + position
                    return position != 0 && matches.indices.contains(index) ? matches[index] : nil
                })).sorted()
            }
            for date in matches where date >= start && date < horizon && (inclusiveEnd == nil || date <= inclusiveEnd!) {
                emitted += 1
                if let countLimit, emitted > countLimit { return result }
                if date > now {
                    result.append(date)
                    if result.count == limit { return result }
                }
            }
            if let countLimit, emitted >= countLimit { break }
            period = nextPeriod
        }
        return result
    }

    private static func matchesDay(_ date: Date, rule: SharedEventRecurrenceRule,
                                   original: DateComponents, calendar: Calendar) -> Bool {
        let c = calendar.dateComponents([.year, .month, .day, .weekday, .weekOfYear, .yearForWeekOfYear], from: date)
        guard let month = c.month, let day = c.day, let weekday = c.weekday,
              let monthLength = calendar.range(of: .day, in: .month, for: date)?.count,
              let yearLength = calendar.range(of: .day, in: .year, for: date)?.count,
              let yearDay = calendar.ordinality(of: .day, in: .year, for: date) else { return false }
        func includes(_ values: [Int]?, positive: Int, length: Int) -> Bool {
            guard let values, !values.isEmpty else { return true }
            return values.contains(positive) || values.contains(positive - length - 1)
        }
        if let months = rule.monthsOfTheYear, !months.isEmpty, !months.contains(month) { return false }
        guard includes(rule.daysOfTheMonth, positive: day, length: monthLength),
              includes(rule.daysOfTheYear, positive: yearDay, length: yearLength) else { return false }
        if let weeks = rule.weeksOfTheYear, !weeks.isEmpty {
            // ISO week numbering, consistent with EventKit's Monday week start.
            guard let week = c.weekOfYear,
                  let december28 = calendar.date(from: DateComponents(year: c.yearForWeekOfYear, month: 12, day: 28)) else { return false }
            guard includes(weeks, positive: week, length: calendar.component(.weekOfYear, from: december28)) else { return false }
        }
        let weekdays = rule.daysOfTheWeek ?? []
        if !weekdays.isEmpty {
            guard weekdays.contains(where: { value in
                guard value.weekday == weekday else { return false }
                if value.weekNumber == 0 || rule.frequency < 2 { return true }
                let useYear = rule.frequency == 3 && (rule.monthsOfTheYear ?? []).isEmpty
                let position = useYear ? yearDay : day
                let length = useYear ? yearLength : monthLength
                let ordinal = value.weekNumber > 0 ? (position - 1) / 7 + 1 : -((length - position) / 7 + 1)
                return ordinal == value.weekNumber
            }) else { return false }
        }
        let hasDayRule = !weekdays.isEmpty || !(rule.daysOfTheMonth ?? []).isEmpty || !(rule.daysOfTheYear ?? []).isEmpty
        switch rule.frequency {
        case 1:
            if weekdays.isEmpty && weekday != original.weekday { return false }
        case 2:
            if !hasDayRule && day != original.day { return false }
        case 3:
            if !hasDayRule {
                if !(rule.weeksOfTheYear ?? []).isEmpty { return weekday == original.weekday }
                if day != original.day { return false }
            }
            if !hasDayRule && (rule.monthsOfTheYear ?? []).isEmpty && month != original.month { return false }
        default: break
        }
        return true
    }
}
