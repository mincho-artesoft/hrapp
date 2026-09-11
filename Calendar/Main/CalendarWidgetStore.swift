import Foundation
import EventKit
import UIKit
import WidgetKit

enum CalendarWidgetStore {
    static let appGroupID = "group.ARTE-SOFT.sandBOX"
    static let widgetKind = "CalendarIconWidget"
    static let classicWidgetKind = "CalendarIconWidgetClassic"
    static let largeEventsWidgetKind = "CalendarIconWidgetLargeEvents"
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
        static let pressure = "calendarWidget.pressure"
        static let uvIndex = "calendarWidget.uvIndex"
        static let moonPhaseAssetName = "calendarWidget.moonPhaseAssetName"
        static let moonPhaseDescription = "calendarWidget.moonPhaseDescription"
        static let upcomingEvents = "calendarWidget.upcomingEvents"
        static let region = "calendarWidget.global.region"
        static let calendar = "calendarWidget.global.calendar"
        static let measurementSystem = "calendarWidget.global.measurementSystem"
        static let firstWeekday = "calendarWidget.global.firstWeekday"
        static let dateFormat = "calendarWidget.global.dateFormat"
        static let timeFormat = "calendarWidget.global.timeFormat"
        static let numberFormat = "calendarWidget.global.numberFormat"
        static let updatedAt = "calendarWidget.updatedAt"
    }

    private static func reloadWidgets() {
        WidgetCenter.shared.reloadTimelines(ofKind: widgetKind)
        WidgetCenter.shared.reloadTimelines(ofKind: classicWidgetKind)
        WidgetCenter.shared.reloadTimelines(ofKind: largeEventsWidgetKind)
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
        defaults.set(GlobalState.timeFormat, forKey: Key.timeFormat)
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
                        widget.kind == widgetKind
                            || widget.kind == classicWidgetKind
                            || widget.kind == largeEventsWidgetKind
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
        windSpeed: Double? = nil,
        pressure: Double? = nil,
        uvIndex: Int? = nil
    ) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        saveGlobalStateSnapshot(to: defaults)
        defaults.set(symbol, forKey: Key.weatherSymbol)
        defaults.set(condition, forKey: Key.weatherCondition)
        setOptional(temperature, forKey: Key.temperature, in: defaults)
        setOptional(windDirectionDegrees, forKey: Key.windDirectionDegrees, in: defaults)
        setOptional(windDirectionText, forKey: Key.windDirectionText, in: defaults)
        setOptional(windSpeed, forKey: Key.windSpeed, in: defaults)
        setOptional(pressure, forKey: Key.pressure, in: defaults)
        setOptional(uvIndex, forKey: Key.uvIndex, in: defaults)
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
        let eventStore = CalendarViewModel.shared.eventStore
        let selectedCalendarIDs = CalendarViewModel.shared.selectedCalendarIDs
        saveCalendarSelectionSnapshot(selectedCalendarIDs)

        var snapshotDate = Date()
        #if DEBUG
        snapshotDate = ScreenshotMode.referenceDate ?? snapshotDate
        #endif
        let snapshots = makeUpcomingEventSnapshots(
            from: eventStore,
            selectedCalendarIDs: selectedCalendarIDs,
            limit: limit,
            now: snapshotDate
        )

        saveUpcomingEventSnapshots(snapshots)
    }

    @MainActor
    static func selectedCalendarIDs(for eventStore: EKEventStore) -> Set<String> {
        if let storedArray = UserDefaults.standard.array(forKey: selectedCalendarIDsKey) as? [String],
           !storedArray.isEmpty || UserDefaults.standard.bool(forKey: hasConfiguredSelectedCalendarIDsKey) {
            return Set(storedArray)
        }

        return Set(eventStore.calendars(for: .event).map(\.calendarIdentifier))
            .union(AppLocalCalendarStore.shared.calendars.map(\.id))
    }

    static func saveCalendarSelectionSnapshot(_ selectedCalendarIDs: Set<String>) {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return }

        let hasConfiguredSelection = UserDefaults.standard.bool(forKey: hasConfiguredSelectedCalendarIDsKey)
        guard !selectedCalendarIDs.isEmpty || hasConfiguredSelection else { return }

        defaults.set(Array(selectedCalendarIDs), forKey: selectedCalendarIDsKey)
        defaults.set(hasConfiguredSelection || !selectedCalendarIDs.isEmpty, forKey: hasConfiguredSelectedCalendarIDsKey)
        defaults.synchronize()
    }

    @MainActor
    static func makeUpcomingEventSnapshots(
        from eventStore: EKEventStore,
        selectedCalendarIDs: Set<String>,
        limit: Int = 25,
        now: Date = Date()
    ) -> [UpcomingEventSnapshot] {
        let end = Calendar.current.date(byAdding: .year, value: 1, to: now) ?? now.addingTimeInterval(31_536_000)
        guard !selectedCalendarIDs.isEmpty else {
            return []
        }

        let status = EKEventStore.authorizationStatus(for: .event)
        let canReadNative: Bool
        if #available(iOS 17.0, *) { canReadNative = status == .fullAccess }
        else { canReadNative = status == .authorized }

        var nativeEvents: [EKEvent] = []
        if canReadNative {
            let calendars = eventStore.calendars(for: .event).filter {
                selectedCalendarIDs.contains($0.calendarIdentifier)
            }
            // Passing nil/empty calendars to EventKit must never turn an
            // explicit local-only selection into all native calendars.
            if !calendars.isEmpty {
                let predicate = eventStore.predicateForEvents(withStart: now, end: end, calendars: calendars)
                nativeEvents = eventStore.events(matching: predicate)
            }
        }

        let localStore = AppLocalCalendarStore.shared
        return combineUpcomingEventSnapshots(nativeEvents: nativeEvents,
            localEvents: localStore.events(from: now, to: end, selectedCalendarIDs: selectedCalendarIDs),
            localCalendars: localStore.calendars, selectedCalendarIDs: selectedCalendarIDs,
            now: now, limit: limit)
    }

    /// Both consumers use one selection and one globally sorted/limited feed.
    /// Calendar identity, not title, keeps same-named native/local calendars distinct.
    @MainActor
    static func combineUpcomingEventSnapshots(
        nativeEvents: [EKEvent], localEvents: [AppLocalEventRecord],
        localCalendars: [AppLocalCalendarRecord], selectedCalendarIDs: Set<String>,
        now: Date, limit: Int
    ) -> [UpcomingEventSnapshot] {
        let calendars = Dictionary(localCalendars.map { ($0.id, $0) }, uniquingKeysWith: { _, last in last })
        var snapshots = nativeEvents.filter {
            selectedCalendarIDs.contains($0.calendar.calendarIdentifier)
                && $0.status != .canceled
                && !SharedInviteTracker.shouldAppearStruckThrough($0)
        }.map(makeUpcomingEventSnapshot)
        snapshots += localEvents.compactMap { event in
            guard selectedCalendarIDs.contains(event.calendarID), !event.isCancelled,
                  let calendar = calendars[event.calendarID], !calendar.isRevoked else { return nil }
            let color = AppLocalCalendarStore.color(calendar.displayColorHex)
            var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 1
            color.getRed(&r, green: &g, blue: &b, alpha: &a)
            return UpcomingEventSnapshot(id: event.id, title: event.title,
                startDate: event.startDate, endDate: event.endDate, isAllDay: event.isAllDay,
                location: event.location.trimmingCharacters(in: .whitespacesAndNewlines).nilIfEmpty,
                videoCallPlatform: videoCallPlatform(from: event.notes),
                colorRed: Double(r), colorGreen: Double(g), colorBlue: Double(b), colorAlpha: Double(a))
        }
        return snapshots.filter { !$0.isAllDay && $0.startDate > now }
            .sorted {
                if $0.startDate != $1.startDate { return $0.startDate < $1.startDate }
                return $0.id < $1.id
            }
            .prefix(max(0, limit)).map { $0 }
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
        defaults.removeObject(forKey: Key.pressure)
        defaults.removeObject(forKey: Key.uvIndex)
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
