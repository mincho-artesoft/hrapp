import Foundation

struct GlobalState {
  
    private static let emailKey = "PrimaryEmail"
    private static let regionKey           = "GlobalRegion"
    private static let calendarKey         = "GlobalCalendar"
    private static let temperatureKey      = "GlobalTemperatureUnit"
    private static let measureKey          = "GlobalMeasurementSystem"
    private static let firstWeekdayKey     = "GlobalFirstWeekday"
    private static let dateFormatKey       = "GlobalDateFormat"
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

    nonisolated(unsafe) static var numberFormat: String =
        UserDefaults.standard.string(forKey: numberFormatKey) ?? "" {
        didSet {
            UserDefaults.standard.set(numberFormat, forKey: numberFormatKey)
            print("🔢 Number Format: \(numberFormat)")
        }
    }
}

