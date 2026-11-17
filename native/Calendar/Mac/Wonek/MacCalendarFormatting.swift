// Ported from Wonek Main/MacCalendarFormatting.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import Foundation

/// The values/patterns below are the existing iPad AppPreferences choices.
/// This adapter does not change the iPad implementation or its saved defaults.
enum MacCalendarFormatting {
    static let dateChoices: [(id: String, pattern: String?)] = [
        ("system", nil), ("medium", nil), ("long", nil), ("full", nil),
        ("dayMonthYear", "dd/MM/yyyy"), ("monthDayYear", "MM/dd/yyyy"),
        ("yearMonthDay", "yyyy-MM-dd"), ("dayMonthYearDot", "dd.MM.yyyy"),
        ("monthDayYearDot", "MM.dd.yyyy"), ("yearMonthDayDot", "yyyy.MM.dd"),
        ("dayMonthYearDash", "dd-MM-yyyy"), ("monthDayYearDash", "MM-dd-yyyy"),
        ("yearMonthDaySlash", "yyyy/MM/dd"), ("dayAbbreviatedMonthYear", "d MMM yyyy"),
        ("abbreviatedMonthDayYear", "MMM d, yyyy"), ("yearAbbreviatedMonthDay", "yyyy MMM d"),
        ("dayFullMonthYear", "d MMMM yyyy"), ("fullMonthDayYear", "MMMM d, yyyy"),
        ("yearFullMonthDay", "yyyy MMMM d")
    ]
    static let weekdays = ["system", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

    static var calendar: Calendar { AppFormatting.calendar }

    static func dateFormatter(choice: String? = nil) -> DateFormatter {
        AppFormatting.dateFormatter(choice: choice.flatMap(AppDateFormatPreference.init(rawValue:)))
    }

    static func time(_ date: Date, choice: String? = nil) -> String {
        timeFormatter(choice: choice).string(from: date)
    }

    static func timeFormatter(choice: String? = nil, timeZone: TimeZone = .autoupdatingCurrent) -> DateFormatter {
        AppFormatting.timeFormatter(choice: choice.flatMap(AppTimeFormatPreference.init(rawValue:)),
                                    timeZone: timeZone)
    }

    static func shortDateFormatter(includesYear: Bool = false, includesWeekday: Bool = true,
                                   fullWeekday: Bool = false) -> DateFormatter {
        AppFormatting.shortDateFormatter(includesYear: includesYear, includesWeekday: includesWeekday,
                                         fullWeekday: fullWeekday)
    }

    static func dateExample(_ choice: String) -> String {
        let date = calendar.date(from: DateComponents(year: calendar.component(.year, from: Date()), month: 12, day: 31)) ?? Date()
        let example = dateFormatter(choice: choice).string(from: date)
        return choice == "system" ? NSLocalizedString("System", comment: "") + " (\(example))" : example
    }

    static func timeExample(_ choice: String) -> String {
        let date = calendar.date(bySettingHour: 13, minute: 45, second: 0, of: Date()) ?? Date()
        let example = time(date, choice: choice)
        return choice == "system" ? NSLocalizedString("System", comment: "") + " (\(example))" : example
    }

    static func weekdayName(_ choice: String) -> String {
        let index = weekdays.firstIndex(of: choice) ?? 0
        let symbols = calendar.weekdaySymbols
        let name = symbols[index == 0 ? Calendar.autoupdatingCurrent.firstWeekday - 1 : index - 1]
        return index == 0 ? NSLocalizedString("System", comment: "") + " (\(name))" : name
    }
}
#endif

#endif
