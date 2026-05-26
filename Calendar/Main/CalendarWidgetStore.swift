import Foundation
import EventKit
import UIKit
import WidgetKit

enum CalendarWidgetStore {
    static let appGroupID = "group.ARTE-SOFT.sandBOX"
    static let widgetKind = "CalendarIconWidget"
    static let classicWidgetKind = "CalendarIconWidgetClassic"

    struct UpcomingEventSnapshot: Codable {
        let id: String
        let title: String
        let startDate: Date
        let endDate: Date
        let isAllDay: Bool
        let colorRed: Double
        let colorGreen: Double
        let colorBlue: Double
        let colorAlpha: Double
    }

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
        static let upcomingEvents = "calendarWidget.upcomingEvents"
        static let updatedAt = "calendarWidget.updatedAt"
    }

    private static func reloadWidgets() {
        WidgetCenter.shared.reloadTimelines(ofKind: widgetKind)
        WidgetCenter.shared.reloadTimelines(ofKind: classicWidgetKind)
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

        reloadWidgets()
    }

    static func saveMoonSnapshot(phaseAssetName: String, phaseDescription: String) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        defaults.set(phaseAssetName, forKey: Key.moonPhaseAssetName)
        defaults.set(phaseDescription, forKey: Key.moonPhaseDescription)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        reloadWidgets()
    }

    @MainActor
    static func saveUpcomingEventsSnapshot(limit: Int = 6) {
        let status = EKEventStore.authorizationStatus(for: .event)
        let hasReadAccess: Bool = {
            if #available(iOS 17.0, *) {
                return status == .fullAccess
            } else {
                return status == .authorized
            }
        }()

        guard hasReadAccess else {
            clearUpcomingEventsSnapshot()
            return
        }

        let viewModel = CalendarViewModel.shared
        let eventStore = viewModel.eventStore
        let now = Date()
        let end = Calendar.current.date(byAdding: .year, value: 1, to: now) ?? now.addingTimeInterval(31_536_000)
        let calendars = viewModel.allowedCalendars()
        let predicate = eventStore.predicateForEvents(
            withStart: now,
            end: end,
            calendars: calendars.isEmpty ? nil : calendars
        )

        let snapshots = eventStore.events(matching: predicate)
            .filter { event in
                (event.endDate ?? event.startDate) >= now
            }
            .sorted { lhs, rhs in
                lhs.startDate < rhs.startDate
            }
            .prefix(limit)
            .map(makeUpcomingEventSnapshot)

        guard let defaults = UserDefaults(suiteName: appGroupID),
              let data = try? JSONEncoder().encode(snapshots)
        else {
            return
        }

        defaults.set(data, forKey: Key.upcomingEvents)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        reloadWidgets()
    }

    static func clearUpcomingEventsSnapshot() {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        defaults.removeObject(forKey: Key.upcomingEvents)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        reloadWidgets()
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

        reloadWidgets()
    }

    private static func makeUpcomingEventSnapshot(from event: EKEvent) -> UpcomingEventSnapshot {
        let color = UIColor(cgColor: event.calendar.cgColor)
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 1
        color.getRed(&red, green: &green, blue: &blue, alpha: &alpha)

        return UpcomingEventSnapshot(
            id: event.eventIdentifier ?? UUID().uuidString,
            title: event.title ?? NSLocalizedString("Untitled", comment: ""),
            startDate: event.startDate,
            endDate: event.endDate,
            isAllDay: event.isAllDay,
            colorRed: Double(red),
            colorGreen: Double(green),
            colorBlue: Double(blue),
            colorAlpha: Double(alpha)
        )
    }
}
