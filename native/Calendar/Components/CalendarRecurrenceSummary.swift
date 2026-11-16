import Foundation
import EventKit

/// Describes the choices in Custom Repeat using complete, plural-aware sentences.
/// The resource table belongs to the app; formatting uses only public Foundation APIs.
struct CalendarRecurrenceSummary {
    let frequency: EKRecurrenceFrequency
    let interval: Int
    let pattern: CalendarRecurrencePattern
    let startDate: Date
    let calendar: Calendar
    let locale: Locale
    var bundle: Bundle = .main

    var text: String {
        switch frequency {
        case .daily:
            return sentence("Event will occur every day.", "Event will occur every %ld days.")
        case .weekly:
            let days = (0..<7).map { (calendar.firstWeekday - 1 + $0) % 7 + 1 }
                .filter { pattern.weekdays.contains($0) }
            if interval == 1 && pattern.weekdays == Set(1...7) {
                return localized("Event will occur every day.")
            }
            if interval == 1 && pattern.weekdays == Set(2...6) {
                return localized("Event will occur every weekday.")
            }
            if days.isEmpty || pattern.weekdays == [calendar.component(.weekday, from: startDate)] {
                return sentence("Event will occur every week.", "Event will occur every %ld weeks.")
            }
            return sentence("Event will occur every week on %@.", "Event will occur every %ld weeks on %@.",
                [list(days.map { symbols.weekdaySymbols[$0 - 1] })])
        case .monthly:
            if pattern.usesOrdinal {
                return sentence("Event will occur every month on the %@ %@.",
                    "Event will occur every %ld months on the %@ %@.", [ordinal(pattern.ordinal), weekday])
            }
            let days = pattern.monthDays.filter { (1...31).contains($0) }.sorted()
            if days.isEmpty || pattern.monthDays == [calendar.component(.day, from: startDate)] {
                return sentence("Event will occur every month.", "Event will occur every %ld months.")
            }
            return sentence("Event will occur every month on the %@.",
                "Event will occur every %ld months on the %@.", [list(days.map(dayNumber))])
        case .yearly:
            let months = pattern.months.filter { (1...12).contains($0) }.sorted()
            if pattern.usesOrdinal {
                let selectedMonths = months.isEmpty ? [calendar.component(.month, from: startDate)] : months
                return sentence("Event will occur every year on the %@ %@ %@.",
                    "every n years on a specific day of months",
                    [ordinal(pattern.ordinal), weekday, qualifiedMonths(selectedMonths)])
            }
            if months.isEmpty || pattern.months == [calendar.component(.month, from: startDate)] {
                return sentence("Event will occur every year.", "Event will occur every %ld years.")
            }
            return sentence("Event will occur every year in %@.", "Event will occur every %ld years in %@.",
                [list(months.map { symbols.monthSymbols[$0 - 1] })])
        @unknown default:
            return ""
        }
    }

    func ordinal(_ value: Int) -> String {
        if value == -1 { return localized("last") }
        if value == -2 { return localized("next to last") }
        return number(value, style: .ordinal)
    }

    private var weekday: String {
        switch pattern.weekday {
        case 1...7: return symbols.weekdaySymbols[pattern.weekday - 1]
        case 9: return localized("weekday")
        case 10: return localized("weekend day")
        default: return localized("day")
        }
    }

    private var symbols: DateFormatter {
        let formatter = DateFormatter()
        formatter.calendar = calendar
        formatter.locale = locale
        formatter.timeZone = calendar.timeZone
        return formatter
    }

    private func dayNumber(_ value: Int) -> String {
        number(value, style: localized("1: ordinal | 0: cardinal") == "1" ? .ordinal : .decimal)
    }

    private func number(_ value: Int, style: NumberFormatter.Style) -> String {
        let formatter = NumberFormatter()
        formatter.locale = locale
        formatter.numberStyle = style
        formatter.usesGroupingSeparator = false
        return formatter.string(from: NSNumber(value: value)) ?? String(value)
    }

    private func list(_ values: [String]) -> String {
        let formatter = ListFormatter()
        formatter.locale = locale
        return formatter.string(from: values) ?? values.joined(separator: ", ")
    }

    private func qualifiedMonths(_ months: [Int]) -> String {
        // Inflected month names and the preposition are language-specific. Keep
        // these forms in the table instead of prepending an English "of".
        let names = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"]
        guard let first = months.first else { return "" }
        // The month form encloses the rest of the list: Japanese, for example,
        // places its particle after the last month, English before the first.
        let marker = "{first-month}"
        let joined = list([marker] + months.dropFirst().map { symbols.monthSymbols[$0 - 1] })
        guard let range = joined.range(of: marker) else { return joined }
        let tail = String(joined[range.upperBound...])
        return String(joined[..<range.lowerBound])
            + String(format: localized("of \(names[first - 1])%@"), locale: locale, tail)
    }

    private func sentence(_ singular: String, _ plural: String, _ values: [String] = []) -> String {
        let arguments: [CVarArg] = interval <= 1 ? values : [max(1, interval)] + values.map { $0 as CVarArg }
        return String(format: localized(interval <= 1 ? singular : plural), locale: locale, arguments: arguments)
    }

    private func localized(_ key: String) -> String {
        bundle.localizedString(forKey: key, value: key, table: "CalendarRecurrence")
    }
}
