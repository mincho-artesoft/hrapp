import Foundation
import EventKit

/// Editable recurrence dimensions. Preserve imported rules until their pattern
/// is explicitly edited, including dimensions not exposed by Calendar's UI.
struct CalendarRecurrencePattern: Equatable {
    var weekdays: Set<Int>
    var monthDays: Set<Int>
    var months: Set<Int>
    var usesOrdinal = false
    var ordinal = 1
    var weekday = 1 // 1...7 weekdays; 8 every day; 9 weekdays; 10 weekend days
    var edited = false
    private let original: EKRecurrenceRule?

    init(rule: EKRecurrenceRule?, start: Date, calendar: Calendar) {
        original = rule
        weekdays = Set(rule?.daysOfTheWeek?.map { $0.dayOfTheWeek.rawValue } ?? [calendar.component(.weekday, from: start)])
        monthDays = Set(rule?.daysOfTheMonth?.map(\.intValue) ?? [calendar.component(.day, from: start)])
        months = Set(rule?.monthsOfTheYear?.map(\.intValue) ?? [calendar.component(.month, from: start)])
        usesOrdinal = (rule?.frequency == .monthly || rule?.frequency == .yearly) && rule?.daysOfTheWeek?.isEmpty == false
        if usesOrdinal {
            ordinal = rule?.setPositions?.first?.intValue ?? rule?.daysOfTheWeek?.first?.weekNumber ?? 1
            if ordinal == 0 { ordinal = 1 }
            switch weekdays {
            case Set(1...7): weekday = 8
            case Set(2...6): weekday = 9
            case Set([1, 7]): weekday = 10
            default: weekday = weekdays.sorted().first ?? 1
            }
        }
    }

    var signature: String {
        "\(weekdays.sorted())|\(monthDays.sorted())|\(months.sorted())|\(usesOrdinal)|\(ordinal)|\(weekday)|\(edited)"
    }

    func rule(frequency: EKRecurrenceFrequency, interval: Int, end: Date?) -> EKRecurrenceRule {
        if !edited, let original, original.frequency == frequency {
            return EKRecurrenceRule(recurrenceWith: frequency, interval: max(1, interval),
                daysOfTheWeek: original.daysOfTheWeek, daysOfTheMonth: original.daysOfTheMonth,
                monthsOfTheYear: original.monthsOfTheYear, weeksOfTheYear: original.weeksOfTheYear,
                daysOfTheYear: original.daysOfTheYear, setPositions: original.setPositions,
                end: end.map(EKRecurrenceEnd.init(end:)) ?? ((original.recurrenceEnd?.occurrenceCount ?? 0) > 0 ? original.recurrenceEnd : nil))
        }
        var days: [EKRecurrenceDayOfWeek]?
        var positions: [NSNumber]?
        if frequency == .weekly {
            days = weekdays.sorted().compactMap { EKWeekday(rawValue: $0).map { EKRecurrenceDayOfWeek($0) } }
        } else if (frequency == .monthly || frequency == .yearly) && usesOrdinal {
            let values = weekday == 8 ? Array(1...7) : weekday == 9 ? Array(2...6) : weekday == 10 ? [1, 7] : [weekday]
            days = values.compactMap { EKWeekday(rawValue: $0).map { EKRecurrenceDayOfWeek($0) } }
            positions = [NSNumber(value: ordinal)]
        }
        return EKRecurrenceRule(recurrenceWith: frequency, interval: max(1, interval),
            daysOfTheWeek: days,
            daysOfTheMonth: frequency == .monthly && !usesOrdinal ? monthDays.sorted().map(NSNumber.init(value:)) : nil,
            monthsOfTheYear: frequency == .yearly ? months.sorted().map(NSNumber.init(value:)) : nil,
            weeksOfTheYear: nil, daysOfTheYear: nil, setPositions: positions,
            end: end.map(EKRecurrenceEnd.init(end:)))
    }
}
