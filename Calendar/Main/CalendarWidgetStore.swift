import Foundation
import WidgetKit

enum CalendarWidgetStore {
    static let appGroupID = "group.ARTE-SOFT.sandBOX"
    static let widgetKind = "CalendarIconWidget"

    private enum Key {
        static let weatherSymbol = "calendarWidget.weatherSymbol"
        static let weatherCondition = "calendarWidget.weatherCondition"
        static let temperature = "calendarWidget.temperature"
        static let temperatureUnit = "calendarWidget.temperatureUnit"
        static let windDirectionDegrees = "calendarWidget.windDirectionDegrees"
        static let windDirectionText = "calendarWidget.windDirectionText"
        static let windSpeed = "calendarWidget.windSpeed"
        static let windSpeedUnit = "calendarWidget.windSpeedUnit"
        static let moonPhaseAssetName = "calendarWidget.moonPhaseAssetName"
        static let moonPhaseDescription = "calendarWidget.moonPhaseDescription"
        static let updatedAt = "calendarWidget.updatedAt"
    }

    static func saveWeatherSnapshot(
        symbol: String,
        condition: String,
        temperature: Double?,
        windDirectionDegrees: Double? = nil,
        windDirectionText: String? = nil,
        windSpeed: Double? = nil
    ) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        defaults.set(symbol, forKey: Key.weatherSymbol)
        defaults.set(condition, forKey: Key.weatherCondition)
        defaults.set(temperature, forKey: Key.temperature)
        defaults.set(GlobalState.temperatureUnit, forKey: Key.temperatureUnit)
        defaults.set(windDirectionDegrees, forKey: Key.windDirectionDegrees)
        defaults.set(windDirectionText, forKey: Key.windDirectionText)
        defaults.set(windSpeed, forKey: Key.windSpeed)
        defaults.set(GlobalState.speedUnitLabel, forKey: Key.windSpeedUnit)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        WidgetCenter.shared.reloadTimelines(ofKind: widgetKind)
    }

    static func saveMoonSnapshot(phaseAssetName: String, phaseDescription: String) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        defaults.set(phaseAssetName, forKey: Key.moonPhaseAssetName)
        defaults.set(phaseDescription, forKey: Key.moonPhaseDescription)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        WidgetCenter.shared.reloadTimelines(ofKind: widgetKind)
    }

    static func clearWeatherSnapshot() {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        defaults.removeObject(forKey: Key.weatherSymbol)
        defaults.removeObject(forKey: Key.weatherCondition)
        defaults.removeObject(forKey: Key.temperature)
        defaults.removeObject(forKey: Key.temperatureUnit)
        defaults.removeObject(forKey: Key.windDirectionDegrees)
        defaults.removeObject(forKey: Key.windDirectionText)
        defaults.removeObject(forKey: Key.windSpeed)
        defaults.removeObject(forKey: Key.windSpeedUnit)
        defaults.removeObject(forKey: Key.moonPhaseAssetName)
        defaults.removeObject(forKey: Key.moonPhaseDescription)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        WidgetCenter.shared.reloadTimelines(ofKind: widgetKind)
    }
}
