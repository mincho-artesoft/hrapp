import Foundation
import ObjectiveC.runtime
import SwiftUI

enum AppPreferenceKey {
    static let language = "AppLanguagePreference"
    static let measurementUnits = "AppMeasurementUnitsPreference"
    static let dateFormat = "AppDateFormatPreference"
    static let timeFormat = "AppTimeFormatPreference"
}

enum MeasurementUnitsPreference: String, CaseIterable, Identifiable {
    case system
    case metric
    case imperial

    var id: String { rawValue }
}

enum AppDateFormatPreference: String, CaseIterable, Identifiable {
    case system
    case medium
    case long
    case full
    case dayMonthYear
    case monthDayYear
    case yearMonthDay
    case dayMonthYearDot
    case monthDayYearDot
    case yearMonthDayDot
    case dayMonthYearDash
    case monthDayYearDash
    case yearMonthDaySlash
    case dayAbbreviatedMonthYear
    case abbreviatedMonthDayYear
    case yearAbbreviatedMonthDay
    case dayFullMonthYear
    case fullMonthDayYear
    case yearFullMonthDay

    var id: String { rawValue }
}

enum AppTimeFormatPreference: String, CaseIterable, Identifiable {
    case system
    case twelveHour
    case twentyFourHour

    var id: String { rawValue }
}

nonisolated(unsafe) private var appLanguageBundleAssociationKey: UInt8 = 0

private final class AppLanguageBundle: Bundle, @unchecked Sendable {
    override func localizedString(
        forKey key: String,
        value: String?,
        table tableName: String?
    ) -> String {
        guard let languageBundle = objc_getAssociatedObject(
            self,
            &appLanguageBundleAssociationKey
        ) as? Bundle else {
            return super.localizedString(forKey: key, value: value, table: tableName)
        }

        return languageBundle.localizedString(forKey: key, value: value, table: tableName)
    }
}

private extension Bundle {
    static func useAppLanguage(_ identifier: String?) {
        object_setClass(Bundle.main, AppLanguageBundle.self)

        guard let identifier,
              let path = Bundle.main.path(forResource: identifier, ofType: "lproj"),
              let languageBundle = Bundle(path: path)
        else {
            objc_setAssociatedObject(
                Bundle.main,
                &appLanguageBundleAssociationKey,
                nil,
                .OBJC_ASSOCIATION_RETAIN_NONATOMIC
            )
            return
        }

        objc_setAssociatedObject(
            Bundle.main,
            &appLanguageBundleAssociationKey,
            languageBundle,
            .OBJC_ASSOCIATION_RETAIN_NONATOMIC
        )
    }
}

@MainActor
final class AppPreferences: ObservableObject {
    static let shared = AppPreferences()
    nonisolated static let systemLanguageIdentifier = "system"

    @Published var languageIdentifier: String {
        didSet {
            guard languageIdentifier != oldValue else { return }
            UserDefaults.standard.set(languageIdentifier, forKey: AppPreferenceKey.language)
            applyLanguage()
        }
    }

    @Published var measurementUnits: MeasurementUnitsPreference {
        didSet {
            guard measurementUnits != oldValue else { return }
            UserDefaults.standard.set(
                measurementUnits.rawValue,
                forKey: AppPreferenceKey.measurementUnits
            )
            applyFormattingPreferences(refreshWeather: true)
        }
    }

    @Published var dateFormat: AppDateFormatPreference {
        didSet {
            guard dateFormat != oldValue else { return }
            UserDefaults.standard.set(dateFormat.rawValue, forKey: AppPreferenceKey.dateFormat)
            applyFormattingPreferences()
        }
    }

    @Published var timeFormat: AppTimeFormatPreference {
        didSet {
            guard timeFormat != oldValue else { return }
            UserDefaults.standard.set(timeFormat.rawValue, forKey: AppPreferenceKey.timeFormat)
            applyFormattingPreferences()
        }
    }

    @Published private(set) var interfaceLocale: Locale

    let availableLanguageIdentifiers: [String]

    var layoutDirection: LayoutDirection {
        interfaceLocale.language.characterDirection == .rightToLeft
            ? .rightToLeft
            : .leftToRight
    }

    private init() {
        let defaults = UserDefaults.standard
        let storedLanguage = defaults.string(forKey: AppPreferenceKey.language)
            ?? Self.systemLanguageIdentifier
        let supportedLanguages = Bundle.main.localizations
            .filter { $0 != "Base" }

        let resolvedLanguage = supportedLanguages.contains(storedLanguage)
            ? storedLanguage
            : Self.systemLanguageIdentifier
        languageIdentifier = resolvedLanguage
        measurementUnits = MeasurementUnitsPreference(
            rawValue: defaults.string(forKey: AppPreferenceKey.measurementUnits) ?? ""
        ) ?? .system
        dateFormat = AppDateFormatPreference(
            rawValue: defaults.string(forKey: AppPreferenceKey.dateFormat) ?? ""
        ) ?? .system
        timeFormat = AppTimeFormatPreference(
            rawValue: defaults.string(forKey: AppPreferenceKey.timeFormat) ?? ""
        ) ?? .system
        availableLanguageIdentifiers = supportedLanguages.sorted()
        interfaceLocale = Self.makeInterfaceLocale(for: resolvedLanguage)

        Bundle.useAppLanguage(
            resolvedLanguage == Self.systemLanguageIdentifier ? nil : resolvedLanguage
        )
        applyFormattingPreferences()
    }

    var explicitLanguageIdentifier: String? {
        languageIdentifier == Self.systemLanguageIdentifier ? nil : languageIdentifier
    }

    nonisolated static var storedExplicitLanguageIdentifier: String? {
        guard let identifier = UserDefaults.standard.string(forKey: AppPreferenceKey.language),
              identifier != systemLanguageIdentifier
        else {
            return nil
        }
        return identifier
    }

    func languageDisplayName(for identifier: String) -> String {
        let displayLocale = interfaceLocale
        let name = displayLocale.localizedString(forIdentifier: identifier)
            ?? Locale.autoupdatingCurrent.localizedString(forIdentifier: identifier)
            ?? identifier
        return name.prefix(1).localizedUppercase + name.dropFirst()
    }

    func dateExample(for preference: AppDateFormatPreference) -> String {
        let formatter = DateFormatter()
        formatter.locale = interfaceLocale
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = resolvedDateFormat(for: preference)

        var components = DateComponents()
        components.calendar = Calendar(identifier: .gregorian)
        components.timeZone = TimeZone(secondsFromGMT: 0)
        components.year = 2026
        components.month = 12
        components.day = 31
        return formatter.string(from: components.date ?? Date())
    }

    func timeExample(for preference: AppTimeFormatPreference) -> String {
        let formatter = DateFormatter()
        formatter.locale = interfaceLocale
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = resolvedTimeFormat(for: preference)

        var components = DateComponents()
        components.calendar = Calendar(identifier: .gregorian)
        components.timeZone = TimeZone(secondsFromGMT: 0)
        components.year = 2026
        components.month = 1
        components.day = 1
        components.hour = 13
        components.minute = 45
        return formatter.string(from: components.date ?? Date())
    }

    func applyFormattingPreferences(refreshWeather: Bool = false) {
        let systemLocale = Locale.autoupdatingCurrent

        switch measurementUnits {
        case .system:
            GlobalState.measurementSystem = systemLocale.measurementSystem == .metric
                ? "Metric"
                : "Imperial"
            GlobalState.temperatureUnit = Self.systemTemperatureUnit(for: systemLocale).symbol
        case .metric:
            GlobalState.measurementSystem = "Metric"
            GlobalState.temperatureUnit = UnitTemperature.celsius.symbol
        case .imperial:
            GlobalState.measurementSystem = "Imperial"
            GlobalState.temperatureUnit = UnitTemperature.fahrenheit.symbol
        }

        GlobalState.dateFormat = resolvedDateFormat(for: dateFormat)
        GlobalState.timeFormat = resolvedTimeFormat(for: timeFormat)
        CalendarWidgetStore.saveGlobalStateSnapshot()

        guard refreshWeather,
              let coordinate = WeatherKitViewModel.shared.locationCoordinate
        else {
            return
        }

        WeatherKitViewModel.shared.fetchWeatherForCoords(
            latitude: coordinate.latitude,
            longitude: coordinate.longitude
        )
    }

    private func applyLanguage() {
        Bundle.useAppLanguage(explicitLanguageIdentifier)
        interfaceLocale = Self.makeInterfaceLocale(for: languageIdentifier)
        applyFormattingPreferences()
        objectWillChange.send()
    }

    private func resolvedDateFormat(for preference: AppDateFormatPreference) -> String {
        switch preference {
        case .system:
            let formatter = DateFormatter()
            formatter.locale = Locale.autoupdatingCurrent
            formatter.dateStyle = .short
            return formatter.dateFormat ?? "y-MM-dd"
        case .medium:
            return localizedDateFormat(style: .medium)
        case .long:
            return localizedDateFormat(style: .long)
        case .full:
            return localizedDateFormat(style: .full)
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

    private func localizedDateFormat(style: DateFormatter.Style) -> String {
        let formatter = DateFormatter()
        formatter.locale = interfaceLocale
        formatter.dateStyle = style
        return formatter.dateFormat ?? "y-MM-dd"
    }

    private func resolvedTimeFormat(for preference: AppTimeFormatPreference) -> String {
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

    private static func makeInterfaceLocale(for identifier: String) -> Locale {
        let localization = identifier == systemLanguageIdentifier
            ? (Bundle.main.preferredLocalizations.first
                ?? Locale.autoupdatingCurrent.identifier)
            : identifier
        let locale = Locale(identifier: localization)

        if locale.region != nil {
            return locale
        }

        if let region = Locale.autoupdatingCurrent.region?.identifier {
            return Locale(identifier: "\(localization)_\(region)")
        }

        return locale
    }

    private static func systemTemperatureUnit(for locale: Locale) -> UnitTemperature {
        let temperature = Measurement(value: 9, unit: UnitTemperature.celsius)
        let formatted = temperature.formatted(
            .measurement(
                width: .abbreviated,
                usage: .person,
                numberFormatStyle: .number
            )
            .locale(locale)
        )
        return formatted.contains("F") ? .fahrenheit : .celsius
    }
}
