// Ported from Wonek AppLocal/AppLocalRecurrence.swift, adapted to HRApp documents.
import Foundation
import EventKit

/// Expands display occurrences without creating stored events or publishing
/// derived copies. Recurrence dates use the event's zone, not the device's zone.
enum AppLocalRecurrence {
    static func occurrences(of event: DeviceCalendarEvent, from lower: Date, to upper: Date) -> [DeviceCalendarEvent] {
        guard lower < upper, event.startDate < upper else { return [] }
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: event.details?["timeZone"]?.string ?? TimeZone.current.identifier) ?? .current
        calendar.firstWeekday = 2
        calendar.minimumDaysInFirstWeek = 4
        let duration = max(0, event.endDate.timeIntervalSince(event.startDate))
        let days = calendar.dateComponents([.day], from: calendar.startOfDay(for: event.startDate),
            to: calendar.startOfDay(for: event.endDate)).day ?? 0
        func occurrence(_ date: Date) -> DeviceCalendarEvent {
            var value = event
            value.start = DeviceCalendarEvent.iso(date)
            value.end = DeviceCalendarEvent.iso(event.allDay
                ? calendar.date(byAdding: .day, value: max(1, days), to: date) ?? date.addingTimeInterval(duration)
                : date.addingTimeInterval(duration))
            return value
        }
        func overlaps(_ value: DeviceCalendarEvent) -> Bool {
            value.startDate < upper && (value.endDate > lower || (value.endDate == value.startDate && value.startDate >= lower))
        }
        var starts: Set<Date> = [event.startDate]
        // Include an overlapping multi-day occurrence before the query start.
        let searchStart = calendar.date(byAdding: .day, value: -max(1, days + 1), to: lower)
            ?? lower.addingTimeInterval(-duration)
        for rule in event.macRecurrenceRules {
            starts.formUnion(dates(rule, start: event.startDate, lower: min(searchStart, lower.addingTimeInterval(-duration)),
                upper: upper, calendar: calendar))
        }
        return starts.subtracting(event.localExcludedStarts).sorted().map(occurrence).filter(overlaps)
    }

    /// Keeps generated occurrences out of storage. The original date identifies the
    /// exception, even when the dragged event is a clipped slice of a multi-day event.
    static func reschedule(_ series: DeviceCalendarEvent, occurrence: Date, interval: DateInterval,
                           allDay: Bool, span: EKSpan) throws -> (retained: DeviceCalendarEvent?, moved: DeviceCalendarEvent) {
        let rules = series.macRecurrenceRules
        guard !rules.isEmpty, occurrences(of: series, from: occurrence, to: occurrence.addingTimeInterval(1))
                .contains(where: { $0.startDate == occurrence }) else {
            throw NSError(domain: "CalendarRecurrence", code: 409, userInfo: [NSLocalizedDescriptionKey: NSLocalizedString("This calendar changed. Refresh and try again.", comment: "")])
        }
        var retained = series, moved = series
        moved.start = DeviceCalendarEvent.iso(interval.start)
        moved.end = DeviceCalendarEvent.iso(interval.end)
        moved.allDay = allDay
        let wireID = DeviceCalendarReplica.accountEventID(series.id)
        let milliseconds = Int64((occurrence.timeIntervalSince1970 * 1000).rounded())
        moved.id = DeviceCalendarReplica.hash("occurrence:\(wireID):\(milliseconds)")
        moved.updatedAt = nil
        if span == .thisEvent {
            retained.localExcludedStarts.insert(occurrence)
            moved.details?["recurrenceRules"] = .array([])
            moved.localExcludedStarts = []
            return (retained, moved)
        }

        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = series.details?["timeZone"]?.string.flatMap(TimeZone.init(identifier:)) ?? .current
        calendar.firstWeekday = 2
        calendar.minimumDaysInFirstWeek = 4
        let dayShift = calendar.dateComponents([.day], from: calendar.startOfDay(for: occurrence), to: calendar.startOfDay(for: interval.start)).day ?? 0
        let clockShift = calendar.dateComponents([.day,.hour,.minute,.second], from: occurrence, to: interval.start)
        func shifted(_ date: Date) -> Date { calendar.date(byAdding: clockShift, to: date) ?? date.addingTimeInterval(interval.start.timeIntervalSince(occurrence)) }
        var pastRules: [CalendarJSON] = [], futureRules: [CalendarJSON] = []
        for rule in rules {
            var future = try CalendarJSON.object(encoding: rule), past = future
            let cutoff = occurrence.addingTimeInterval(-1)
            if rule.endDate.flatMap(DeviceCalendarEvent.date).map({ $0 < occurrence }) == true {
                pastRules.append(.object(past))
                continue
            }
            past["endDate"] = .string(DeviceCalendarEvent.iso(cutoff))
            past.removeValue(forKey: "occurrenceCount")
            pastRules.append(.object(past))
            if let count = rule.occurrenceCount, count > 0, occurrence > series.startDate {
                let used = 1 + dates(rule, start: series.startDate, lower: series.startDate, upper: occurrence, calendar: calendar).count
                guard count > used else { continue }
                future["occurrenceCount"] = .number(Double(count - used))
            }
            if let until = rule.endDate.flatMap(DeviceCalendarEvent.date) {
                future["endDate"] = .string(DeviceCalendarEvent.iso(shifted(until)))
            }
            if rule.frequency <= 1, dayShift != 0, let weekdays = rule.daysOfTheWeek {
                future["daysOfTheWeek"] = .array(weekdays.map {
                    .object(["weekday": .number(Double((($0.weekday - 1 + dayShift) % 7 + 7) % 7 + 1)), "weekNumber": .number(Double($0.weekNumber))])
                })
            }
            futureRules.append(.object(future))
        }
        moved.details?["recurrenceRules"] = .array(futureRules)
        moved.localExcludedStarts = Set(series.localExcludedStarts.filter { $0 >= occurrence }.map(shifted))
        if occurrence == series.startDate { moved.id = series.id; return (nil, moved) }
        retained.details?["recurrenceRules"] = .array(pastRules)
        retained.localExcludedStarts = series.localExcludedStarts.filter { $0 < occurrence }
        return (retained, moved)
    }

    private static func dates(_ rule: SharedEventRecurrenceRule, start: Date, lower: Date,
        upper: Date, calendar: Calendar) -> [Date] {
        guard (0...3).contains(rule.frequency), (1...100_000).contains(rule.interval) else { return [] }
        let usesWeekYear = rule.frequency == 3 && !(rule.weeksOfTheYear ?? []).isEmpty
        let component: Calendar.Component = usesWeekYear ? .yearForWeekOfYear : [.day, .weekOfYear, .month, .year][rule.frequency]
        guard let initialPeriod = calendar.dateInterval(of: component, for: start)?.start else { return [] }
        let until = rule.endDate.flatMap(DeviceCalendarEvent.date)
        let limit = rule.occurrenceCount.flatMap { $0 > 0 ? $0 : nil }
        if limit == 1 { return [] }
        let time = calendar.dateComponents([.hour, .minute, .second], from: start)
        let original = calendar.dateComponents([.month, .day, .weekday], from: start)
        var period = initialPeriod
        if limit == nil, lower > start {
            let distance = calendar.dateComponents([component], from: initialPeriod, to: lower).value(for: component) ?? 0
            let aligned = max(0, distance / rule.interval - 1) * rule.interval
            period = calendar.date(byAdding: component, value: aligned, to: initialPeriod) ?? initialPeriod
        }
        var count = 1 // DTSTART is always the first occurrence.
        var result: [Date] = []
        while period < upper, until == nil || period <= until! {
            guard let next = calendar.date(byAdding: component, value: rule.interval, to: period), next > period,
                  let interval = calendar.dateInterval(of: component, for: period) else { break }
            var candidates: [Date] = []
            var day = interval.start
            while day < interval.end {
                if matches(day, rule: rule, original: original, calendar: calendar) {
                    var parts = calendar.dateComponents([.year, .month, .day], from: day)
                    parts.hour = time.hour; parts.minute = time.minute; parts.second = time.second
                    if let date = calendar.date(from: parts),
                       calendar.dateComponents([.year, .month, .day, .hour, .minute, .second], from: date) == parts {
                        candidates.append(date)
                    }
                }
                guard let tomorrow = calendar.date(byAdding: .day, value: 1, to: day), tomorrow > day else { break }
                day = tomorrow
            }
            if let positions = rule.setPositions, !positions.isEmpty {
                candidates = Set(positions.compactMap { position -> Date? in
                    guard position != 0 else { return nil }
                    let index = position > 0 ? position - 1 : candidates.count + position
                    return candidates.indices.contains(index) ? candidates[index] : nil
                }).sorted()
            }
            for date in candidates where date > start {
                if date >= upper || (until != nil && date > until!) { continue }
                if let limit, count >= limit { return result }
                count += 1
                if date >= lower { result.append(date) }
            }
            if let limit, count >= limit { break }
            period = next
        }
        return result
    }

    static func matches(_ date: Date, rule: SharedEventRecurrenceRule,
        original: DateComponents, calendar: Calendar) -> Bool {
        let values = calendar.dateComponents([.year, .month, .day, .weekday, .weekOfYear, .yearForWeekOfYear], from: date)
        let month = values.month!, day = values.day!, weekday = values.weekday!
        let monthDays = calendar.range(of: .day, in: .month, for: date)!.count
        let yearDays = calendar.range(of: .day, in: .year, for: date)!.count
        let yearDay = calendar.ordinality(of: .day, in: .year, for: date)!
        func includes(_ candidates: [Int]?, value: Int, total: Int) -> Bool {
            guard let candidates, !candidates.isEmpty else { return true }
            return candidates.contains { $0 > 0 ? $0 == value : $0 < 0 && total + $0 + 1 == value }
        }
        if let months = rule.monthsOfTheYear, !months.isEmpty, !months.contains(month) { return false }
        guard includes(rule.daysOfTheMonth, value: day, total: monthDays),
              includes(rule.daysOfTheYear, value: yearDay, total: yearDays) else { return false }
        if let weeks = rule.weeksOfTheYear, !weeks.isEmpty {
            guard let dec28 = calendar.date(from: DateComponents(year: values.yearForWeekOfYear, month: 12, day: 28)),
                  includes(weeks, value: values.weekOfYear!, total: calendar.component(.weekOfYear, from: dec28)) else { return false }
        }
        let weekdays = rule.daysOfTheWeek ?? []
        if !weekdays.isEmpty {
            guard weekdays.contains(where: { candidate in
                guard candidate.weekday == weekday else { return false }
                if candidate.weekNumber == 0 || rule.frequency < 2 { return true }
                let yearly = rule.frequency == 3 && (rule.monthsOfTheYear ?? []).isEmpty
                let ordinal = yearly ? yearDay : day, total = yearly ? yearDays : monthDays
                return candidate.weekNumber > 0
                    ? (ordinal - 1) / 7 + 1 == candidate.weekNumber
                    : -((total - ordinal) / 7 + 1) == candidate.weekNumber
            }) else { return false }
        }
        if rule.frequency == 1, weekdays.isEmpty, weekday != original.weekday { return false }
        let hasDaySelection = !weekdays.isEmpty || !(rule.daysOfTheMonth ?? []).isEmpty
            || !(rule.daysOfTheYear ?? []).isEmpty || !(rule.weeksOfTheYear ?? []).isEmpty
        if rule.frequency >= 2, !hasDaySelection, day != original.day { return false }
        if rule.frequency == 3, (rule.monthsOfTheYear ?? []).isEmpty, !hasDaySelection,
           month != original.month { return false }
        return true
    }
}
