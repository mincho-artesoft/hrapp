import Foundation
import UIKit

enum CalendarSearchAppearance {
    static let iconPointSize: CGFloat = 22
    static let buttonSize: CGFloat = 36

    static var symbolConfiguration: UIImage.SymbolConfiguration {
        UIImage.SymbolConfiguration(pointSize: iconPointSize, weight: .regular)
    }

    static var iconImage: UIImage {
        UIImage(
            systemName: "magnifyingglass",
            withConfiguration: symbolConfiguration
        ) ?? UIImage()
    }
}

extension Locale {
    /// Locale used for values that are rendered as part of the translated UI.
    /// It follows the app language while retaining the user's region when the
    /// localization itself does not specify one (for example `ar` vs `fr-CA`).
    static var appFormatting: Locale {
        let localization = AppPreferences.storedExplicitLanguageIdentifier
            ?? Bundle.main.preferredLocalizations.first
            ?? Locale.autoupdatingCurrent.identifier
        let localizedLocale = Locale(identifier: localization)
        let currentLocale = Locale.autoupdatingCurrent

        // Keep the full user locale whenever it already uses the app language.
        // Unlike rebuilding a locale from language + region, this preserves
        // explicit iOS overrides such as 12/24-hour time and date-field order.
        if currentLocale.language.languageCode == localizedLocale.language.languageCode {
            return currentLocale
        }

        if localizedLocale.region != nil {
            return localizedLocale
        }

        let globalRegion = GlobalState.region.trimmingCharacters(in: .whitespacesAndNewlines)
        if !globalRegion.isEmpty {
            return Locale(identifier: "\(localization)_\(globalRegion)")
        }

        if let region = Locale.autoupdatingCurrent.region?.identifier {
            return Locale(identifier: "\(localization)_\(region)")
        }

        return localizedLocale
    }
}

/// `String(format:)` defaults to Latin digits. Use the app locale so numeric
/// placeholders also follow Arabic and other locale-specific numeral systems.
func localizedFormat(_ format: String, _ arguments: CVarArg...) -> String {
    String(format: format, locale: Locale.appFormatting, arguments: arguments)
}

func localizedIntegerString(_ value: Int, minimumIntegerDigits: Int = 1) -> String {
    let formatter = NumberFormatter()
    formatter.locale = .appFormatting
    formatter.numberStyle = .decimal
    formatter.minimumIntegerDigits = minimumIntegerDigits
    formatter.maximumFractionDigits = 0
    formatter.usesGroupingSeparator = false
    return formatter.string(from: NSNumber(value: value))
        ?? localizedFormat("%0*d", minimumIntegerDigits, value)
}

func localizedDecimalString(
    _ value: Double,
    minimumFractionDigits: Int = 0,
    maximumFractionDigits: Int
) -> String {
    let formatter = NumberFormatter()
    formatter.locale = .appFormatting
    formatter.numberStyle = .decimal
    formatter.minimumFractionDigits = minimumFractionDigits
    formatter.maximumFractionDigits = maximumFractionDigits
    formatter.usesGroupingSeparator = false
    return formatter.string(from: NSNumber(value: value))
        ?? localizedFormat("%.*f", maximumFractionDigits, value)
}

struct GlobalState {
  
    private static let emailKey            = "PrimaryEmail"
    private static let regionKey           = "GlobalRegion"
    private static let calendarKey         = "GlobalCalendar"
    private static let temperatureKey      = "GlobalTemperatureUnit"
    private static let measureKey          = "GlobalMeasurementSystem"
    private static let firstWeekdayKey     = "GlobalFirstWeekday"
    private static let dateFormatKey       = "GlobalDateFormat"
    private static let timeFormatKey       = "GlobalTimeFormat"
    private static let numberFormatKey     = "GlobalNumberFormat"
    
    nonisolated(unsafe) static var email: String = {
        // initial load
        UserDefaults.standard.string(forKey: emailKey) ?? ""
    }() {
        // every time someone sets GlobalState.email = …
        didSet {
            UserDefaults.standard.set(email, forKey: emailKey)
        }
    }
    
    nonisolated(unsafe) static var region: String =
        UserDefaults.standard.string(forKey: regionKey) ?? "" {
        didSet {
            UserDefaults.standard.set(region, forKey: regionKey)
            print("🌍 Region: \(region)")
        }
    }

    nonisolated(unsafe) static var calendar: String =
        UserDefaults.standard.string(forKey: calendarKey) ?? "" {
        didSet {
            UserDefaults.standard.set(calendar, forKey: calendarKey)
            print("📆 Calendar: \(calendar)")
        }
    }

    nonisolated(unsafe) static var temperatureUnit: String =
        UserDefaults.standard.string(forKey: temperatureKey) ?? "" {
        didSet {
            UserDefaults.standard.set(temperatureUnit, forKey: temperatureKey)
            print("🌡 Temperature Unit: \(temperatureUnit)")
        }
    }

    nonisolated(unsafe) static var measurementSystem: String =
        UserDefaults.standard.string(forKey: measureKey) ?? "" {
        didSet {
            UserDefaults.standard.set(measurementSystem, forKey: measureKey)
            print("📏 Measurement Units: \(measurementSystem)")
        }
    }

    nonisolated(unsafe) static var firstWeekday: Int =
        UserDefaults.standard.integer(forKey: firstWeekdayKey) {
        didSet {
            UserDefaults.standard.set(firstWeekday, forKey: firstWeekdayKey)
            print("📅 First Day of Week: \(firstWeekday)")
        }
    }

    nonisolated(unsafe) static var dateFormat: String =
        UserDefaults.standard.string(forKey: dateFormatKey) ?? "" {
        didSet {
            UserDefaults.standard.set(dateFormat, forKey: dateFormatKey)
            print("🗓 Date Format: \(dateFormat)")
        }
    }

    nonisolated(unsafe) static var timeFormat: String =
        UserDefaults.standard.string(forKey: timeFormatKey) ?? "" {
        didSet {
            UserDefaults.standard.set(timeFormat, forKey: timeFormatKey)
            print("🕐 Time Format: \(timeFormat)")
        }
    }

    nonisolated(unsafe) static var numberFormat: String =
        UserDefaults.standard.string(forKey: numberFormatKey) ?? "" {
        didSet {
            UserDefaults.standard.set(numberFormat, forKey: numberFormatKey)
            print("🔢 Number Format: \(numberFormat)")
        }
    }
}

extension GlobalState {
    static var resolvedDateFormat: String {
        let storedFormat = dateFormat.trimmingCharacters(in: .whitespacesAndNewlines)
        guard storedFormat.isEmpty else { return storedFormat }

        let formatter = DateFormatter()
        formatter.locale = .appFormatting
        formatter.dateStyle = .short
        return formatter.dateFormat ?? "y-MM-dd"
    }

    static var resolvedTimeFormat: String {
        let storedFormat = timeFormat.trimmingCharacters(in: .whitespacesAndNewlines)
        guard storedFormat.isEmpty else { return storedFormat }

        return DateFormatter.dateFormat(
            fromTemplate: "j:mm",
            options: 0,
            locale: .appFormatting
        ) ?? "HH:mm"
    }

    static var resolvedDateFormatWithoutYear: String {
        var format = resolvedDateFormat
        guard let yearRange = format.range(
            of: #"[yYuUr]+"#,
            options: .regularExpression
        ) else {
            return format
        }

        let separators = CharacterSet(charactersIn: " .,/\\-–—")
        func isSeparator(_ character: Character) -> Bool {
            character.unicodeScalars.allSatisfy(separators.contains)
        }

        var removalRange = yearRange
        var cursor = yearRange.lowerBound
        while cursor > format.startIndex {
            let previous = format.index(before: cursor)
            guard isSeparator(format[previous]) else { break }
            cursor = previous
        }

        if cursor < yearRange.lowerBound {
            removalRange = cursor..<yearRange.upperBound
        } else {
            cursor = yearRange.upperBound
            while cursor < format.endIndex, isSeparator(format[cursor]) {
                cursor = format.index(after: cursor)
            }
            removalRange = yearRange.lowerBound..<cursor
        }

        format.removeSubrange(removalRange)
        return format.trimmingCharacters(in: separators)
    }

    static var uses12HourClock: Bool {
        resolvedTimeFormat.contains("a") || resolvedTimeFormat.contains("B")
    }

    static var hourOnlyDateFormat: String {
        let template = uses12HourClock ? "ha" : "HH"
        return DateFormatter.dateFormat(
            fromTemplate: template,
            options: 0,
            locale: .appFormatting
        ) ?? (uses12HourClock ? "h a" : "HH")
    }

    static func localizedDateFormat(fromTemplate template: String) -> String {
        DateFormatter.dateFormat(
            fromTemplate: template,
            options: 0,
            locale: .appFormatting
        ) ?? template
    }
}

func appTimeFormatter(
    timeZone: TimeZone = .autoupdatingCurrent,
    includesMinutes: Bool = true
) -> DateFormatter {
    let formatter = DateFormatter()
    formatter.locale = .appFormatting
    formatter.timeZone = timeZone
    formatter.dateFormat = includesMinutes
        ? GlobalState.resolvedTimeFormat
        : GlobalState.hourOnlyDateFormat
    return formatter
}

func appDateFormatter(
    template: String,
    timeZone: TimeZone = .autoupdatingCurrent
) -> DateFormatter {
    let formatter = DateFormatter()
    formatter.locale = .appFormatting
    formatter.timeZone = timeZone
    formatter.dateFormat = GlobalState.localizedDateFormat(fromTemplate: template)
    return formatter
}

func appShortDateFormatter(
    timeZone: TimeZone = .autoupdatingCurrent,
    includesYear: Bool = true,
    includesWeekday: Bool = false,
    usesFullWeekday: Bool = false
) -> DateFormatter {
    let formatter = DateFormatter()
    formatter.locale = .appFormatting
    formatter.timeZone = timeZone

    let dateFormat = includesYear
        ? GlobalState.resolvedDateFormat
        : GlobalState.resolvedDateFormatWithoutYear

    if includesWeekday {
        let weekdayTemplate = usesFullWeekday ? "EEEE" : "EEE"
        let weekdayFormat = GlobalState.localizedDateFormat(fromTemplate: weekdayTemplate)
        formatter.dateFormat = "\(weekdayFormat), \(dateFormat)"
    } else {
        formatter.dateFormat = dateFormat
    }

    return formatter
}


import SwiftUI

extension GlobalState {
    /// „°C“ или „°F“
    static var temperatureUnitSymbol: String {
        if temperatureUnit == UnitTemperature.fahrenheit.symbol {
            return "°F"
        } else {
            return "°C"
        }
    }

    /// „km/h“ или „mph“
    static var speedUnitLabel: String {
        if measurementSystem == "Imperial" {
            return NSLocalizedString("Unit_Speed_mph", comment: "miles per hour")
        } else {
            return NSLocalizedString("Unit_Speed_kmh", comment: "kilometers per hour")
        }
    }

    /// „km“ или „mi“
    static var distanceUnitLabel: String {
        if measurementSystem == "Imperial" {
            return NSLocalizedString("Unit_Distance_mi", comment: "miles")
        } else {
            return NSLocalizedString("Unit_Distance_km", comment: "kilometers")
        }
    }

    /// „mm“ или „in“
    static var precipitationUnitLabel: String {
        if measurementSystem == "Imperial" {
            return NSLocalizedString("Unit_Precipitation_in", comment: "inches")
        } else {
            return NSLocalizedString("Unit_Precipitation_mm", comment: "millimeters")
        }
    }

    /// „hPa“ или „inHg“
    static var pressureUnitLabel: String {
        if measurementSystem == "Imperial" {
            return NSLocalizedString("Unit_Pressure_inHg", comment: "inches of mercury")
        } else {
            return NSLocalizedString("Unit_Pressure_hPa", comment: "hectopascals")
        }
    }
    
}

// Compact calendar controls contain dates and translated labels whose length
// varies considerably between locales. Keep the complete value visible before
// UIKit falls back to an ellipsis.
extension UILabel {
    func useAdaptiveSingleLine(minimumScale: CGFloat = 0.4) {
        numberOfLines = 1
        adjustsFontSizeToFitWidth = true
        minimumScaleFactor = minimumScale
        allowsDefaultTighteningForTruncation = true
        lineBreakMode = .byClipping
    }
}

extension UIButton {
    func useAdaptiveTitle(minimumScale: CGFloat = 0.4) {
        titleLabel?.useAdaptiveSingleLine(minimumScale: minimumScale)
        titleLabel?.textAlignment = .center
        contentEdgeInsets = UIEdgeInsets(
            top: 0,
            left: AppButtonLayout.textHorizontalPadding,
            bottom: 0,
            right: AppButtonLayout.textHorizontalPadding
        )
    }
}

extension View {
    func adaptiveSingleLine(minimumScale: CGFloat = 0.4) -> some View {
        lineLimit(1)
            .minimumScaleFactor(minimumScale)
            .allowsTightening(true)
    }
}
