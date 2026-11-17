// Ported from Wonek Main/AppFormatting.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import Foundation

func localizedCappedCount(_ count: Int) -> String { count > 99 ? "99+" : localizedIntegerString(count) }

enum AppFormatting {
    private struct CacheStateKey: Equatable {
        let storedLanguage: String?
        let preferredLanguage: String
        let systemLocaleIdentifier: String
        let systemRegionIdentifier: String?
        let systemHourCycleRaw: String
        let firstWeekdayRaw: String
        let dateFormatRaw: String
        let timeFormatRaw: String
        let timeZoneIdentifier: String
        let systemFirstWeekday: Int

        static func current() -> Self {
            let defaults = UserDefaults.standard
            let autoupdating = Locale.autoupdatingCurrent
            return Self(
                storedLanguage: defaults.string(forKey: AppPreferenceKey.language),
                preferredLanguage: Locale.preferredLanguages.first ?? "",
                systemLocaleIdentifier: autoupdating.identifier,
                systemRegionIdentifier: autoupdating.region?.identifier,
                systemHourCycleRaw: String(describing: autoupdating.hourCycle),
                firstWeekdayRaw: defaults.string(forKey: AppPreferenceKey.firstWeekday) ?? "",
                dateFormatRaw: defaults.string(forKey: AppPreferenceKey.dateFormat) ?? "",
                timeFormatRaw: defaults.string(forKey: AppPreferenceKey.timeFormat) ?? "",
                timeZoneIdentifier: TimeZone.autoupdatingCurrent.identifier,
                systemFirstWeekday: Calendar.autoupdatingCurrent.firstWeekday
            )
        }
    }

    private final class RuntimeFormatterCache: @unchecked Sendable {
        let lock = NSLock()
        var key: CacheStateKey?
        var cachedLocale: Locale?
        var cachedCalendar: Calendar?
        var cachedListDayFormatter: DateFormatter?
        var cachedDateFormatter: DateFormatter?
        var cachedTimeFormatter: DateFormatter?
    }

    private static let runtimeCache = RuntimeFormatterCache()

    private static func ensureCurrentCacheLocked(_ key: CacheStateKey) -> (locale: Locale, calendar: Calendar) {
        if runtimeCache.key == key,
           let cachedLocale = runtimeCache.cachedLocale,
           let cachedCalendar = runtimeCache.cachedCalendar {
            return (cachedLocale, cachedCalendar)
        }
        let builtLocale = buildLocale(language: nil, system: .autoupdatingCurrent)
        var builtCalendar = Calendar(identifier: .gregorian)
        builtCalendar.locale = builtLocale
        builtCalendar.timeZone = .autoupdatingCurrent
        let choice = FirstWeekdayPreference(rawValue: key.firstWeekdayRaw) ?? .system
        builtCalendar.firstWeekday = choice.weekdayIndex ?? key.systemFirstWeekday
        runtimeCache.key = key
        runtimeCache.cachedLocale = builtLocale
        runtimeCache.cachedCalendar = builtCalendar
        runtimeCache.cachedListDayFormatter = nil
        runtimeCache.cachedDateFormatter = nil
        runtimeCache.cachedTimeFormatter = nil
        return (builtLocale, builtCalendar)
    }

    /// One date heading for calendar lists, chat history and shared content.
    static func listDayTitle(_ date: Date, now: Date = Date()) -> String {
        let activeCalendar = calendar
        if activeCalendar.isDate(date, inSameDayAs: now) {
            return NSLocalizedString("Today", comment: "")
        }
        if let yesterday = activeCalendar.date(byAdding: .day, value: -1, to: now),
           activeCalendar.isDate(date, inSameDayAs: yesterday) {
            return NSLocalizedString("yesterday", comment: "").capitalized(with: .appFormatting)
        }
        let key = CacheStateKey.current()
        runtimeCache.lock.lock()
        defer { runtimeCache.lock.unlock() }
        let (activeLocale, cal) = ensureCurrentCacheLocked(key)
        let formatter: DateFormatter
        if let existing = runtimeCache.cachedListDayFormatter {
            formatter = existing
        } else {
            let created = DateFormatter()
            created.locale = activeLocale
            created.calendar = cal
            created.timeZone = .autoupdatingCurrent
            let choice = AppDateFormatPreference(rawValue: key.dateFormatRaw) ?? .system
            let pattern = datePattern(for: choice, locale: activeLocale)
            // Preserve the complete selected date format, including its year.
            // A full date format already includes its own localized weekday.
            if pattern.range(of: #"[Ec]{3,6}"#, options: .regularExpression) == nil {
                let weekday = DateFormatter.dateFormat(fromTemplate: "EEEE", options: 0, locale: activeLocale) ?? "EEEE"
                created.dateFormat = weekday + ", " + pattern
            } else {
                created.dateFormat = pattern
            }
            runtimeCache.cachedListDayFormatter = created
            formatter = created
        }
        return formatter.string(from: date)
    }

    fileprivate static func cachedDateAndTimeString(for date: Date, includeDate: Bool, includeTime: Bool) -> String {
        let key = CacheStateKey.current()
        runtimeCache.lock.lock()
        defer { runtimeCache.lock.unlock() }
        let (activeLocale, cal) = ensureCurrentCacheLocked(key)
        var parts: [String] = []
        if includeDate {
            let df: DateFormatter
            if let existing = runtimeCache.cachedDateFormatter {
                df = existing
            } else {
                let created = DateFormatter()
                created.locale = activeLocale
                created.calendar = cal
                created.timeZone = .autoupdatingCurrent
                let choice = AppDateFormatPreference(rawValue: key.dateFormatRaw) ?? .system
                created.dateFormat = datePattern(for: choice, locale: activeLocale)
                runtimeCache.cachedDateFormatter = created
                df = created
            }
            parts.append(df.string(from: date))
        }
        if includeTime {
            let tf: DateFormatter
            if let existing = runtimeCache.cachedTimeFormatter {
                tf = existing
            } else {
                let created = DateFormatter()
                created.locale = activeLocale
                created.calendar = cal
                created.timeZone = .autoupdatingCurrent
                let choice = AppTimeFormatPreference(rawValue: key.timeFormatRaw) ?? .system
                created.dateFormat = timePattern(for: choice)
                runtimeCache.cachedTimeFormatter = created
                tf = created
            }
            parts.append(tf.string(from: date))
        }
        return parts.joined(separator: " · ")
    }

    static func shortDateFormatter(includesYear: Bool = false, includesWeekday: Bool = true,
                                   fullWeekday: Bool = false) -> DateFormatter {
        let formatter = dateFormatter()
        var format = formatter.dateFormat ?? "M/d/y"
        if !includesYear, let year = format.range(of: #"[yYuUr]+"#, options: .regularExpression) {
            let separators = CharacterSet(charactersIn: " .,/\\-–—")
            func isSeparator(_ char: Character) -> Bool { char.unicodeScalars.allSatisfy(separators.contains) }
            var cursor = year.lowerBound
            while cursor > format.startIndex {
                let previous = format.index(before: cursor)
                guard isSeparator(format[previous]) else { break }
                cursor = previous
            }
            var removal = cursor..<year.upperBound
            if cursor == year.lowerBound {
                cursor = year.upperBound
                while cursor < format.endIndex, isSeparator(format[cursor]) { cursor = format.index(after: cursor) }
                removal = year.lowerBound..<cursor
            }
            format.removeSubrange(removal)
            format = format.trimmingCharacters(in: separators)
        }
        if includesWeekday {
            format = format.replacingOccurrences(of: #"[Ec]{3,6}[,،]?\s*"#, with: "", options: .regularExpression)
            let weekday = DateFormatter.dateFormat(fromTemplate: fullWeekday ? "EEEE" : "EEE",
                options: 0, locale: .appFormatting) ?? "EEE"
            format = weekday + ", " + format
        }
        formatter.dateFormat = format
        return formatter
    }


    static func locale(for language: String? = nil, system: Locale = .autoupdatingCurrent) -> Locale {
        if language == nil, system == .autoupdatingCurrent {
            let key = CacheStateKey.current()
            runtimeCache.lock.lock()
            defer { runtimeCache.lock.unlock() }
            return ensureCurrentCacheLocked(key).locale
        }
        return buildLocale(language: language, system: system)
    }

    private static func buildLocale(language: String?, system: Locale) -> Locale {
        let stored = UserDefaults.standard.string(forKey: AppPreferenceKey.language)
        let selected = language ?? stored.flatMap { Bundle.main.localizations.contains($0) ? $0 : nil }
        let systemLanguage = Bundle.preferredLocalizations(from: Bundle.main.localizations,
            forPreferences: Locale.preferredLanguages).first ?? "en"
        let localized = Locale(identifier: selected ?? systemLanguage)
        let resolved: Locale
        if system.language.languageCode == localized.language.languageCode,
           system.language.script == localized.language.script,
           localized.region == nil || localized.region == system.region {
            resolved = system
        } else if localized.region != nil {
            resolved = localized
        } else {
            var components = Locale.Components(locale: localized)
            components.region = system.region
            // Preserve the device's hour-cycle choice when changing only language.
            components.hourCycle = system.hourCycle
            resolved = Locale(components: components)
        }
        return resolved.usingAppNumeralSystem.usingAppCalendar
    }

    static var calendar: Calendar {
        let key = CacheStateKey.current()
        runtimeCache.lock.lock()
        defer { runtimeCache.lock.unlock() }
        return ensureCurrentCacheLocked(key).calendar
    }

    static func dateFormatter(choice: AppDateFormatPreference? = nil,
                              timeZone: TimeZone = .autoupdatingCurrent) -> DateFormatter {
        let choice = choice ?? AppDateFormatPreference(rawValue:
            UserDefaults.standard.string(forKey: AppPreferenceKey.dateFormat) ?? "") ?? .system
        let formatter = DateFormatter()
        formatter.locale = .appFormatting
        formatter.calendar = calendar
        formatter.timeZone = timeZone
        formatter.dateFormat = datePattern(for: choice)
        return formatter
    }

    static func timeFormatter(choice: AppTimeFormatPreference? = nil,
                              timeZone: TimeZone = .autoupdatingCurrent) -> DateFormatter {
        let choice = choice ?? AppTimeFormatPreference(rawValue:
            UserDefaults.standard.string(forKey: AppPreferenceKey.timeFormat) ?? "") ?? .system
        let formatter = DateFormatter()
        formatter.locale = .appFormatting
        formatter.calendar = calendar
        formatter.timeZone = timeZone
        formatter.dateFormat = timePattern(for: choice)
        return formatter
    }

    static func datePattern(for preference: AppDateFormatPreference, locale: Locale = .appFormatting) -> String {
        switch preference {
        case .system:
            let formatter = DateFormatter()
            formatter.locale = Locale.autoupdatingCurrent
            formatter.dateStyle = .short
            return formatter.dateFormat ?? "y-MM-dd"
        case .medium:
            return localizedDateFormat(style: .medium, locale: locale)
        case .long:
            return localizedDateFormat(style: .long, locale: locale)
        case .full:
            return localizedDateFormat(style: .full, locale: locale)
        case .dayMonthYear:
            return "dd/MM/yyyy"
        case .monthDayYear:
            return "MM/dd/yyyy"
        case .yearMonthDay:
            return "yyyy-MM-dd"
        case .dayMonthYearDot:
            return "dd.MM.yyyy"
        case .monthDayYearDot:
            return "MM.dd.yyyy"
        case .yearMonthDayDot:
            return "yyyy.MM.dd"
        case .dayMonthYearDash:
            return "dd-MM-yyyy"
        case .monthDayYearDash:
            return "MM-dd-yyyy"
        case .yearMonthDaySlash:
            return "yyyy/MM/dd"
        case .dayAbbreviatedMonthYear:
            return "d MMM yyyy"
        case .abbreviatedMonthDayYear:
            return "MMM d, yyyy"
        case .yearAbbreviatedMonthDay:
            return "yyyy MMM d"
        case .dayFullMonthYear:
            return "d MMMM yyyy"
        case .fullMonthDayYear:
            return "MMMM d, yyyy"
        case .yearFullMonthDay:
            return "yyyy MMMM d"
        }
    }

    private static func localizedDateFormat(style: DateFormatter.Style, locale: Locale) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.dateStyle = style
        return formatter.dateFormat ?? "y-MM-dd"
    }

    static func timePattern(for preference: AppTimeFormatPreference) -> String {
        switch preference {
        case .system:
            return DateFormatter.dateFormat(
                fromTemplate: "j:mm",
                options: 0,
                locale: Locale.autoupdatingCurrent
            ) ?? "HH:mm"
        case .twelveHour:
            return "h:mm a"
        case .twentyFourHour:
            return "HH:mm"
        }
    }

}

extension Date {
    /// All complete UI dates/times use the user's app-wide format choices.
    /// Month names/day cells still use localized calendar-component templates.
    func appFormatted(date: Bool = true, time: Bool = true,
                      timeZone: TimeZone = .autoupdatingCurrent) -> String {
        if timeZone == .autoupdatingCurrent {
            return AppFormatting.cachedDateAndTimeString(for: self, includeDate: date, includeTime: time)
        }
        var parts: [String] = []
        if date { parts.append(AppFormatting.dateFormatter(timeZone: timeZone).string(from: self)) }
        if time { parts.append(AppFormatting.timeFormatter(timeZone: timeZone).string(from: self)) }
        return parts.joined(separator: " · ")
    }
}

#endif
