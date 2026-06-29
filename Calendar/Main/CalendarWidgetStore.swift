import Foundation
import EventKit
import UIKit
import WidgetKit

enum CalendarWidgetStore {
    static let appGroupID = "group.ARTE-SOFT.sandBOX"
    static let widgetKind = "CalendarIconWidget"
    static let classicWidgetKind = "CalendarIconWidgetClassic"
    static let selectedCalendarIDsKey = "SelectedCalendarIDsKey"
    static let hasConfiguredSelectedCalendarIDsKey = "HasConfiguredSelectedCalendarIDsKey"

    struct UpcomingEventSnapshot: Codable {
        let id: String
        let title: String
        let startDate: Date
        let endDate: Date
        let isAllDay: Bool
        let location: String?
        let videoCallPlatform: String?
        let colorRed: Double
        let colorGreen: Double
        let colorBlue: Double
        let colorAlpha: Double
    }

    static func upcomingEventsSnapshot() -> [UpcomingEventSnapshot] {
        guard
            let data = UserDefaults(suiteName: appGroupID)?.data(forKey: Key.upcomingEvents),
            let snapshots = try? JSONDecoder().decode([UpcomingEventSnapshot].self, from: data)
        else {
            return []
        }

        return snapshots
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
        static let region = "calendarWidget.global.region"
        static let calendar = "calendarWidget.global.calendar"
        static let measurementSystem = "calendarWidget.global.measurementSystem"
        static let firstWeekday = "calendarWidget.global.firstWeekday"
        static let dateFormat = "calendarWidget.global.dateFormat"
        static let numberFormat = "calendarWidget.global.numberFormat"
        static let updatedAt = "calendarWidget.updatedAt"
    }

    private static func reloadWidgets() {
        WidgetCenter.shared.reloadTimelines(ofKind: widgetKind)
        WidgetCenter.shared.reloadTimelines(ofKind: classicWidgetKind)
    }

    static func saveGlobalStateSnapshot(reload: Bool = true) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        saveGlobalStateSnapshot(to: defaults)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        if reload {
            reloadWidgets()
        }
    }

    private static func saveGlobalStateSnapshot(to defaults: UserDefaults) {
        defaults.set(GlobalState.region, forKey: Key.region)
        defaults.set(GlobalState.calendar, forKey: Key.calendar)
        defaults.set(GlobalState.temperatureUnit, forKey: Key.temperatureUnit)
        defaults.set(GlobalState.measurementSystem, forKey: Key.measurementSystem)
        defaults.set(GlobalState.firstWeekday, forKey: Key.firstWeekday)
        defaults.set(GlobalState.dateFormat, forKey: Key.dateFormat)
        defaults.set(GlobalState.numberFormat, forKey: Key.numberFormat)
        defaults.set(GlobalState.speedUnitLabel, forKey: Key.windSpeedUnit)
    }

    private static func setOptional<T>(_ value: T?, forKey key: String, in defaults: UserDefaults) {
        guard let value else { return }
        defaults.set(value, forKey: key)
    }

    static func hasInstalledCalendarWidget() async -> Bool {
        await withCheckedContinuation { continuation in
            WidgetCenter.shared.getCurrentConfigurations { result in
                switch result {
                case .success(let widgets):
                    continuation.resume(returning: widgets.contains { widget in
                        widget.kind == widgetKind || widget.kind == classicWidgetKind
                    })
                case .failure:
                    continuation.resume(returning: true)
                }
            }
        }
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

        saveGlobalStateSnapshot(to: defaults)
        defaults.set(symbol, forKey: Key.weatherSymbol)
        defaults.set(condition, forKey: Key.weatherCondition)
        setOptional(temperature, forKey: Key.temperature, in: defaults)
        setOptional(windDirectionDegrees, forKey: Key.windDirectionDegrees, in: defaults)
        setOptional(windDirectionText, forKey: Key.windDirectionText, in: defaults)
        setOptional(windSpeed, forKey: Key.windSpeed, in: defaults)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        reloadWidgets()
    }

    static func saveMoonSnapshot(phaseAssetName: String, phaseDescription: String) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        saveGlobalStateSnapshot(to: defaults)
        defaults.set(phaseAssetName, forKey: Key.moonPhaseAssetName)
        defaults.set(phaseDescription, forKey: Key.moonPhaseDescription)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        reloadWidgets()
    }

    @MainActor
    static func saveUpcomingEventsSnapshot(limit: Int = 25) {
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

        let eventStore = CalendarViewModel.shared.eventStore
        let selectedCalendarIDs = CalendarViewModel.shared.selectedCalendarIDs
        saveCalendarSelectionSnapshot(selectedCalendarIDs)

        let snapshots = makeUpcomingEventSnapshots(
            from: eventStore,
            selectedCalendarIDs: selectedCalendarIDs,
            limit: limit
        )

        saveUpcomingEventSnapshots(snapshots)
    }

    static func selectedCalendarIDs(for eventStore: EKEventStore) -> Set<String> {
        if let storedArray = UserDefaults.standard.array(forKey: selectedCalendarIDsKey) as? [String],
           !storedArray.isEmpty || UserDefaults.standard.bool(forKey: hasConfiguredSelectedCalendarIDsKey) {
            return Set(storedArray)
        }

        return Set(eventStore.calendars(for: .event).map(\.calendarIdentifier))
    }

    static func saveCalendarSelectionSnapshot(_ selectedCalendarIDs: Set<String>) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        let hasConfiguredSelection = UserDefaults.standard.bool(forKey: hasConfiguredSelectedCalendarIDsKey)
        guard !selectedCalendarIDs.isEmpty || hasConfiguredSelection else { return }

        defaults.set(Array(selectedCalendarIDs), forKey: selectedCalendarIDsKey)
        defaults.set(hasConfiguredSelection || !selectedCalendarIDs.isEmpty, forKey: hasConfiguredSelectedCalendarIDsKey)
        defaults.synchronize()
    }

    static func makeUpcomingEventSnapshots(
        from eventStore: EKEventStore,
        selectedCalendarIDs: Set<String>,
        limit: Int = 25
    ) -> [UpcomingEventSnapshot] {
        let now = Date()
        let end = Calendar.current.date(byAdding: .year, value: 1, to: now) ?? now.addingTimeInterval(31_536_000)
        guard !selectedCalendarIDs.isEmpty else {
            return []
        }

        let calendars = eventStore.calendars(for: .event).filter {
            selectedCalendarIDs.contains($0.calendarIdentifier)
        }

        guard !calendars.isEmpty else {
            return []
        }

        let predicate = eventStore.predicateForEvents(
            withStart: now,
            end: end,
            calendars: calendars
        )

        return eventStore.events(matching: predicate)
            .filter { event in
                !event.isAllDay && event.startDate > now
            }
            .sorted { lhs, rhs in
                lhs.startDate < rhs.startDate
            }
            .prefix(limit)
            .map(makeUpcomingEventSnapshot)
    }

    static func saveUpcomingEventSnapshots(_ snapshots: [UpcomingEventSnapshot]) {
        guard let defaults = UserDefaults(suiteName: appGroupID),
              let data = try? JSONEncoder().encode(snapshots)
        else {
            return
        }

        defaults.set(data, forKey: Key.upcomingEvents)
        saveGlobalStateSnapshot(to: defaults)
        defaults.set(Date(), forKey: Key.updatedAt)
        defaults.synchronize()

        reloadWidgets()
    }

    static func clearUpcomingEventsSnapshot() {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        defaults.removeObject(forKey: Key.upcomingEvents)
        saveGlobalStateSnapshot(to: defaults)
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
        saveGlobalStateSnapshot(to: defaults)
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
            location: event.location?.trimmingCharacters(in: .whitespacesAndNewlines).nilIfEmpty,
            videoCallPlatform: videoCallPlatform(from: event.notes),
            colorRed: Double(red),
            colorGreen: Double(green),
            colorBlue: Double(blue),
            colorAlpha: Double(alpha)
        )
    }

    private static func videoCallPlatform(from notes: String?) -> String? {
        guard let notes,
              notes.contains("----( Video Call )----")
        else {
            return nil
        }

        let bracketRegex = "\\[([^\\]]+)\\]"
        guard let matchRange = notes.range(of: bracketRegex, options: .regularExpression) else {
            return nil
        }

        return String(notes[matchRange])
            .trimmingCharacters(in: CharacterSet(charactersIn: "[]"))
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .nilIfEmpty
    }
}

private extension String {
    var nilIfEmpty: String? {
        isEmpty ? nil : self
    }
}
