import Foundation
import SwiftUI
import CoreLocation

#if DEBUG

/// Drives the app straight to one screen, in one language, for a marketing
/// capture. Compiled out of release builds entirely.
///
/// The capture harness this replaces reached each screen by tapping: open the
/// view menu, wait for it, tap "Mehrere Tage", wait again; pull up the drawer,
/// wait, tap "Select All". Every one of those steps had to be re-measured per
/// device family, several were silently swallowed by a system alert the
/// automation could not see, and the waits alone cost minutes per language.
/// At seven languages that was tolerable. At thirty-two, across two device
/// families and five screens, it is three hundred and twenty navigations that
/// can each fail on their own.
///
/// Launch arguments avoid all of it: the state the taps were trying to produce
/// is written before any view reads it. That also fixes a failure the tapping
/// could not - the app restores its last tab, and on iPad the Weather screen
/// hides the tab bar, so a run that ended on Weather had no way back to the
/// calendar. Arguments are applied on every launch and cannot be overridden by
/// state restoration.
///
/// Activated only when `-ScreenshotMode 1` is passed, so a debug build a
/// developer launches by hand behaves exactly as before.
///
///     -ScreenshotMode 1
///     -ScreenshotScreen day|multiDay|month|year|list|multiCalendar|weather
///     -ScreenshotCalendarLocale de     // selects that language's calendars
///     -ScreenshotScrollHour 7          // pin the timeline instead of "now"
///     -WeatherPreviewCondition rain     // deterministic WeatherKit demo data
enum ScreenshotMode {

    enum Screen: String {
        case day, multiDay, month, year, list, multiCalendar, weather

        /// `RootView.selectedTab`, which is both the tab and the calendar view
        /// mode - the same value the view picker's menu writes, and the same
        /// one `TwoWayPinnedMultiDayContainerView` reports back as
        /// `currentView`. Persisted as `selectedTabRoot`.
        var rootTab: Int {
            switch self {
            case .month: return 0
            case .day: return 1
            case .year: return 2
            case .multiDay: return 3
            case .list: return 4
            case .multiCalendar: return 5
            case .weather: return 6
            }
        }
    }

    struct Configuration {
        var screen: Screen
        var calendarLocale: String?
        var scrollHour: Int?
        var weatherPreviewCondition: String?
        var weatherPreviewSky: String?
        var weatherPreviewMoonPhase: String?
        var weatherPreviewPrecipitation: String?
        var weatherPreviewAlert: String?
    }

    /// Parsed once. `nil` in every normal launch.
    static let configuration: Configuration? = {
        let defaults = UserDefaults.standard
        guard defaults.bool(forKey: "ScreenshotMode") else { return nil }

        let rawScreen = defaults.string(forKey: "ScreenshotScreen") ?? Screen.day.rawValue
        guard let screen = Screen(rawValue: rawScreen) else {
            assertionFailure("Unknown -ScreenshotScreen \(rawScreen)")
            return nil
        }

        // A launch argument arrives in the argument domain as a string, so
        // `object(forKey:) as? Int` is always nil for `-ScreenshotScrollHour 9`
        // and the timeline silently kept scrolling to "now". Presence is
        // checked separately from the value because `integer(forKey:)` cannot
        // distinguish an absent key from a literal 0, and hour 0 is valid.
        var scrollHour: Int?
        if defaults.object(forKey: "ScreenshotScrollHour") != nil {
            let hour = defaults.integer(forKey: "ScreenshotScrollHour")
            guard (0...23).contains(hour) else {
                assertionFailure("-ScreenshotScrollHour \(hour) is not an hour of the day")
                return nil
            }
            scrollHour = hour
        }

        return Configuration(
            screen: screen,
            calendarLocale: defaults.string(forKey: "ScreenshotCalendarLocale"),
            scrollHour: scrollHour,
            weatherPreviewCondition: defaults.string(forKey: "WeatherPreviewCondition"),
            weatherPreviewSky: defaults.string(forKey: "WeatherPreviewSky"),
            weatherPreviewMoonPhase: defaults.string(forKey: "WeatherPreviewMoonPhase"),
            weatherPreviewPrecipitation: defaults.string(forKey: "WeatherPreviewPrecipitation"),
            weatherPreviewAlert: defaults.string(forKey: "WeatherPreviewAlert")
        )
    }()

    static var isActive: Bool { configuration != nil }

    static var weatherPreviewSolarDetail: Bool {
        isActive && UserDefaults.standard.bool(forKey: "WeatherPreviewSolarDetail")
    }

    static var weatherPreviewSolarCard: Bool {
        isActive && UserDefaults.standard.bool(forKey: "WeatherPreviewSolarCard")
    }

    static var weatherPreviewMoonDetail: Bool {
        isActive && UserDefaults.standard.bool(forKey: "WeatherPreviewMoonDetail")
    }

    /// Called as early as possible, before any view reads persisted state.
    @MainActor
    static func applyIfNeeded() {
        let shared = UserDefaults(suiteName: appGroupID)

        guard let configuration else {
            // A capture on this simulator may have pinned a zone here. A
            // normal launch must not inherit it, or the widget would keep
            // formatting in whichever city the last screenshot run staged.
            shared?.removeObject(forKey: sharedTimeZoneKey)
            return
        }

        // The widget and the Live Activity each run in their own process, and
        // neither inherits the `TZ` the harness exports for this one, so on a
        // simulator they format in the host Mac's zone. Handing them the zone
        // this process is actually using is what keeps the Live Activity card
        // and the Lock Screen clock directly above it telling the same time.
        shared?.set(TimeZone.current.identifier, forKey: sharedTimeZoneKey)

        let defaults = UserDefaults.standard

        // Cleared here rather than by the harness, so the flag can only ever
        // describe the launch that is running. A stale `true` left by the
        // previous frame would let the next screenshot be taken before that
        // screen had laid out - the exact failure waiting on it is meant to
        // remove.
        defaults.removeObject(forKey: readyKey)

        defaults.set(configuration.screen.rootTab, forKey: "selectedTabRoot")

        if configuration.screen == .weather,
           let condition = configuration.weatherPreviewCondition {
            WeatherKitViewModel.shared.applyWeatherPreview(condition: condition)
        }

        if configuration.screen == .weather,
           defaults.bool(forKey: "WeatherPreviewSavedRegions") {
            let store = SavedWeatherRegionsStore.shared
            let sofia = store.save(
                name: "София",
                subtitle: "България",
                coordinate: .init(latitude: 42.6977, longitude: 23.3219),
                timeZone: TimeZone(identifier: "Europe/Sofia")
            )
            _ = store.save(
                name: "Пловдив",
                subtitle: "България",
                coordinate: .init(latitude: 42.1354, longitude: 24.7453),
                timeZone: TimeZone(identifier: "Europe/Sofia")
            )
            _ = store.save(
                name: "Лондон",
                subtitle: "Обединено кралство",
                coordinate: .init(latitude: 51.5072, longitude: -0.1276),
                timeZone: TimeZone(identifier: "Europe/London")
            )
            store.select(sofia.id)
        }

        // The seeder creates one set of calendars per language, named for that
        // language, so switching the screenshot language is a matter of
        // selecting a different four - no tapping through the drawer, and no
        // reseeding between languages.
        if let locale = configuration.calendarLocale {
            selectCalendars(forLocale: locale)
        }
    }

    /// Read by the day/multi-day container instead of scrolling to "now", so
    /// every language's capture shows the same window of the day. The hour is
    /// placed at the top of the visible timeline, not its centre: `9` means
    /// the day starts at 9.
    static var pinnedScrollHour: Int? { configuration?.scrollHour }

    /// When present, live location callbacks must not replace the deterministic
    /// preview while a weather animation is being captured.
    static var weatherPreviewCondition: String? { configuration?.weatherPreviewCondition }
    static var weatherPreviewSky: String? { configuration?.weatherPreviewSky }
    static var weatherPreviewMoonPhase: String? { configuration?.weatherPreviewMoonPhase }
    static var weatherPreviewPrecipitation: String? { configuration?.weatherPreviewPrecipitation }
    static var weatherPreviewAlert: String? { configuration?.weatherPreviewAlert }
    static var weatherPreviewSavedRegionsOpen: Bool {
        UserDefaults.standard.bool(forKey: "WeatherPreviewSavedRegionsOpen")
    }

    /// Set by the container once its content has been laid out and parked at
    /// its final scroll offset. The harness polls
    /// `defaults read Deksan.CalendarASD ScreenshotReady` and shoots when it
    /// turns 1, rather than sleeping a fixed number of seconds. Cleared on
    /// every launch by `applyIfNeeded`.
    static func markReady() {
        guard isActive else { return }
        UserDefaults.standard.set(true, forKey: readyKey)
        UserDefaults.standard.synchronize()
    }

    static let readyKey = "ScreenshotReady"

    /// Shared with the widget extension, which reads it as
    /// `WidgetTimeZone.overrideKey`. Both live in the app group because the
    /// standard domain is per-process and the widget cannot see this one.
    static let appGroupID = "group.ARTE-SOFT.sandBOX"
    static let sharedTimeZoneKey = "calendarWidget.global.timeZone"

    /// Waits briefly for EventKit rather than trusting the first answer.
    ///
    /// `applyIfNeeded` runs from `CalendarApp.init()`, which is early enough
    /// that the store sometimes reports no calendars at all - not because the
    /// seed is missing but because it has not finished loading. Asking again
    /// costs a few hundred milliseconds on the rare launch that needs it.
    @MainActor
    private static func seededCalendars(withPrefix prefix: String) -> [String] {
        let store = CalendarViewModel.shared.eventStore
        for attempt in 0..<10 {
            let matching = store.calendars(for: .event)
                .filter { $0.title.hasPrefix(prefix) }
                .map(\.calendarIdentifier)
            if !matching.isEmpty { return matching }
            if attempt < 9 { Thread.sleep(forTimeInterval: 0.2) }
        }
        return []
    }

    @MainActor
    private static func selectCalendars(forLocale locale: String) {
        let prefix = "\(locale.uppercased()) · "
        let matching = seededCalendars(withPrefix: prefix)

        guard !matching.isEmpty else {
            // Deliberately not an assertion. This runs from init(), so a trap
            // here takes the whole process down before a window exists, and
            // the harness sees a device that will not come to the foreground
            // rather than a message about calendars. That cost an hour of
            // chasing a Live Activity that "would not start". A capture with
            // the wrong calendars is visible in the frame and caught by
            // tools/audit.py; a launch crash is neither.
            print("ScreenshotMode: no seeded calendars titled \(prefix)…; run seed-locale.sh all <date> first")
            return
        }
        UserDefaults.standard.set(matching, forKey: "SelectedCalendarIDsKey")
        CalendarViewModel.shared.selectedCalendarIDs = Set(matching)
    }
}

@MainActor
private extension WeatherKitViewModel {
    struct WeatherPreviewProfile {
        let symbol: String
        let temperature: Double
        let precipitationChance: Double
        let snowfall: Double
        let windSpeed: Double
        let cloudCover: Double
    }

    func applyWeatherPreview(condition: String) {
        let profile = weatherPreviewProfile(for: condition)
        let conditionKey = "WeatherCondition.\(condition)"
        let actualNow = Date()
        locationCoordinate = CLLocationCoordinate2D(latitude: 42.6977, longitude: 23.3219)
        var calendar = Calendar.current
        calendar.timeZone = locationTimeZone
        let now: Date
        switch ScreenshotMode.weatherPreviewSky {
        case "day":
            now = calendar.date(bySettingHour: 13, minute: 27, second: 0, of: actualNow) ?? actualNow
        case "sunrise":
            now = calendar.date(bySettingHour: 5, minute: 42, second: 0, of: actualNow) ?? actualNow
        case "sunset":
            now = calendar.date(bySettingHour: 19, minute: 48, second: 0, of: actualNow) ?? actualNow
        default:
            now = actualNow
        }

        currentTemp = profile.temperature
        currentSymbol = profile.symbol
        currentConditionLocalizationKey = conditionKey
        currentCondition = NSLocalizedString(conditionKey, comment: "Weather preview condition")
        currentFeelsLike = profile.temperature + (condition == "hot" ? 3 : -1)
        currentHumidity = profile.precipitationChance > 0.4 ? 0.82 : 0.48
        currentPressure = 1_012
        currentVisibility = ["foggy", "haze", "smoky", "blowingDust"].contains(condition) ? 2.8 : 16
        currentUVIndex = ["clear", "mostlyClear", "hot"].contains(condition) ? 7 : 3
        currentWindSpeed = profile.windSpeed
        currentWindGust = profile.windSpeed * 1.45
        currentWindDirection = Angle(degrees: 238)
        currentDewPoint = profile.temperature - 4
        pressureTrend = "Steady"
        currentPrecipitationAmount = profile.precipitationChance * 3.4
        currentCloudCover = profile.cloudCover
        currentPrecipitationType = ScreenshotMode.weatherPreviewPrecipitation
            ?? previewPrecipitationType(for: condition)
        if ScreenshotMode.weatherPreviewAlert == "tornado" {
            weatherAlerts = [
                WeatherAlertDisplayItem(
                    id: "preview-tornado-warning",
                    summary: NSLocalizedString("WeatherAlert.Preview.Tornado", comment: "Preview tornado warning"),
                    source: NSLocalizedString("WeatherAlert.Preview.Source", comment: "Preview alert source"),
                    region: NSLocalizedString("WeatherAlert.Preview.Region", comment: "Preview alert region"),
                    severity: .extreme,
                    detailsURL: nil
                )
            ]
        } else {
            weatherAlerts = []
        }
        todayMinTemp = profile.temperature - 4
        todayMaxTemp = profile.temperature + 5
        sunriseTime = calendar.date(bySettingHour: 6, minute: 24, second: 0, of: now)
        sunsetTime = calendar.date(bySettingHour: 20, minute: 31, second: 0, of: now)
        let tomorrowSunrise = calendar.date(
            byAdding: .day,
            value: 1,
            to: sunriseTime ?? now
        )
        next24SolarEvents = [
            sunriseTime.map { SolarForecastEvent(kind: .sunrise, date: $0) },
            sunsetTime.map { SolarForecastEvent(kind: .sunset, date: $0) },
            tomorrowSunrise.map { SolarForecastEvent(kind: .sunrise, date: $0) }
        ]
        .compactMap { $0 }
        .filter { $0.date >= now && $0.date <= now.addingTimeInterval(24 * 60 * 60) }
        .sorted { $0.date < $1.date }
        solarDayForecast = (0..<10).compactMap { offset in
            guard let day = calendar.date(byAdding: .day, value: offset, to: now),
                  let sunrise = calendar.date(bySettingHour: 6, minute: 24 + min(offset, 5), second: 0, of: day),
                  let sunset = calendar.date(bySettingHour: 20, minute: 31 - min(offset * 2, 18), second: 0, of: day) else {
                return nil
            }
            return SolarDayForecast(
                date: day,
                firstLight: sunrise.addingTimeInterval(-31 * 60),
                sunrise: sunrise,
                solarNoon: Date(timeIntervalSince1970: (sunrise.timeIntervalSince1970 + sunset.timeIntervalSince1970) / 2),
                sunset: sunset,
                lastLight: sunset.addingTimeInterval(31 * 60)
            )
        }
        todayPrecipitationAmount = profile.precipitationChance * 7.5
        nextHourPrecipitationChance = profile.precipitationChance
        errorMessage = nil

        let hourFormatter = DateFormatter()
        hourFormatter.locale = .current
        hourFormatter.timeZone = locationTimeZone
        hourFormatter.setLocalizedDateFormatFromTemplate("j")

        next24HourlyForecast = (0..<24).compactMap { offset in
            guard let date = calendar.date(byAdding: .hour, value: offset, to: now) else { return nil }
            let wave = sin(Double(offset) / 4) * 2.4
            return HourlyForecastItem(
                id: date,
                date: date,
                hour: offset == 0 ? NSLocalizedString("Now", comment: "") : hourFormatter.string(from: date),
                temp: profile.temperature + wave,
                feelsLikeTemp: profile.temperature + wave - 1,
                symbol: offset < 5 ? profile.symbol : previewSupportingSymbol(at: offset),
                precipChance: offset < 5 ? profile.precipitationChance : max(0.05, profile.precipitationChance - 0.18),
                precipitationAmount: profile.precipitationChance * 0.8,
                snowfallAmount: profile.snowfall,
                uvIndex: max(0, 7 - abs(offset - 8)),
                windSpeed: profile.windSpeed,
                windGust: profile.windSpeed * 1.45,
                windDirection: 238,
                humidity: currentHumidity ?? 0.5,
                visibility: currentVisibility ?? 16,
                pressure: currentPressure ?? 1_012
            )
        }
        hourlyForecast = next24HourlyForecast

        let dayFormatter = DateFormatter()
        dayFormatter.locale = .current
        dayFormatter.timeZone = locationTimeZone
        dayFormatter.setLocalizedDateFormatFromTemplate("EEE")

        dailyForecast = (0..<10).compactMap { offset in
            guard let date = calendar.date(byAdding: .day, value: offset, to: now) else { return nil }
            let symbol = offset == 0 ? profile.symbol : previewSupportingSymbol(at: offset)
            let chance = offset == 0 ? profile.precipitationChance : [0.12, 0.28, 0.08, 0.45, 0.18][offset % 5]
            let minTemp = profile.temperature - 5 + Double(offset % 3)
            let maxTemp = profile.temperature + 4 + Double(offset % 4)
            return DayForecastItem(
                id: date,
                date: date,
                day: offset == 0 ? NSLocalizedString("Today", comment: "") : dayFormatter.string(from: date),
                symbol: symbol,
                precipChance: chance,
                minTemp: minTemp,
                maxTemp: maxTemp,
                precipLast24h: chance * 5,
                rainLast24h: profile.snowfall > 0 ? 0 : chance * 5,
                snowLast24h: profile.snowfall,
                precipitationAmount: chance * 5,
                reinAmount: profile.snowfall > 0 ? 0 : chance * 5,
                snowfallAmount: profile.snowfall,
                precipNext24h: chance * 6,
                rainNext24h: profile.snowfall > 0 ? 0 : chance * 6,
                snowNext24h: profile.snowfall,
                maxUV: 6,
                maxWindSpeed: profile.windSpeed,
                maxWindGust: profile.windSpeed * 1.45,
                predominantWindDirection: 238,
                humidityMin: 0.42,
                humidityMax: 0.82,
                visibilityMin: currentVisibility ?? 16,
                visibilityMax: (currentVisibility ?? 16) + 3,
                moon: nil
            )
        }

        NotificationCenter.default.post(name: .weatherForecastUpdated, object: nil)
        ScreenshotMode.markReady()
    }

    func previewPrecipitationType(for condition: String) -> String? {
        switch condition {
        case "hail": return "hail"
        case "sleet": return "sleet"
        case "wintryMix": return "mixed"
        case "flurries", "snow", "heavySnow", "blowingSnow", "blizzard", "sunFlurries": return "snow"
        case "drizzle", "freezingDrizzle", "freezingRain", "rain", "heavyRain",
             "isolatedThunderstorms", "scatteredThunderstorms", "strongStorms",
             "sunShowers", "thunderstorms", "hurricane", "tropicalStorm": return "rain"
        default: return "none"
        }
    }

    func weatherPreviewProfile(for condition: String) -> WeatherPreviewProfile {
        switch condition {
        case "blizzard": return .init(symbol: "wind.snow", temperature: -10, precipitationChance: 0.95, snowfall: 8.2, windSpeed: 58, cloudCover: 1)
        case "blowingDust": return .init(symbol: "sun.dust.fill", temperature: 31, precipitationChance: 0.02, snowfall: 0, windSpeed: 46, cloudCover: 0.35)
        case "blowingSnow": return .init(symbol: "wind.snow", temperature: -7, precipitationChance: 0.72, snowfall: 4.4, windSpeed: 48, cloudCover: 0.92)
        case "breezy": return .init(symbol: "wind", temperature: 20, precipitationChance: 0.08, snowfall: 0, windSpeed: 27, cloudCover: 0.32)
        case "clear": return .init(symbol: "sun.max.fill", temperature: 25, precipitationChance: 0.01, snowfall: 0, windSpeed: 7, cloudCover: 0.05)
        case "cloudy": return .init(symbol: "cloud.fill", temperature: 18, precipitationChance: 0.14, snowfall: 0, windSpeed: 12, cloudCover: 0.9)
        case "drizzle": return .init(symbol: "cloud.drizzle.fill", temperature: 15, precipitationChance: 0.66, snowfall: 0, windSpeed: 10, cloudCover: 0.88)
        case "flurries": return .init(symbol: "cloud.snow.fill", temperature: -2, precipitationChance: 0.52, snowfall: 1.1, windSpeed: 13, cloudCover: 0.78)
        case "foggy": return .init(symbol: "cloud.fog.fill", temperature: 11, precipitationChance: 0.08, snowfall: 0, windSpeed: 3, cloudCover: 0.82)
        case "freezingDrizzle": return .init(symbol: "cloud.sleet.fill", temperature: -1, precipitationChance: 0.68, snowfall: 0.3, windSpeed: 12, cloudCover: 0.92)
        case "freezingRain": return .init(symbol: "cloud.sleet.fill", temperature: -2, precipitationChance: 0.88, snowfall: 0.5, windSpeed: 18, cloudCover: 1)
        case "frigid": return .init(symbol: "thermometer.snowflake", temperature: -18, precipitationChance: 0.04, snowfall: 0, windSpeed: 8, cloudCover: 0.18)
        case "hail": return .init(symbol: "cloud.hail.fill", temperature: 6, precipitationChance: 0.86, snowfall: 0.8, windSpeed: 24, cloudCover: 0.96)
        case "haze": return .init(symbol: "sun.haze.fill", temperature: 28, precipitationChance: 0.03, snowfall: 0, windSpeed: 4, cloudCover: 0.4)
        case "heavyRain": return .init(symbol: "cloud.heavyrain.fill", temperature: 13, precipitationChance: 0.98, snowfall: 0, windSpeed: 31, cloudCover: 1)
        case "heavySnow": return .init(symbol: "cloud.snow.fill", temperature: -6, precipitationChance: 0.97, snowfall: 9.6, windSpeed: 25, cloudCover: 1)
        case "hot": return .init(symbol: "thermometer.sun.fill", temperature: 38, precipitationChance: 0.01, snowfall: 0, windSpeed: 6, cloudCover: 0.03)
        case "hurricane": return .init(symbol: "hurricane", temperature: 26, precipitationChance: 1, snowfall: 0, windSpeed: 118, cloudCover: 1)
        case "isolatedThunderstorms": return .init(symbol: "cloud.bolt.rain.fill", temperature: 22, precipitationChance: 0.72, snowfall: 0, windSpeed: 29, cloudCover: 0.82)
        case "mostlyClear": return .init(symbol: "sun.max.fill", temperature: 24, precipitationChance: 0.04, snowfall: 0, windSpeed: 8, cloudCover: 0.22)
        case "mostlyCloudy": return .init(symbol: "cloud.fill", temperature: 17, precipitationChance: 0.18, snowfall: 0, windSpeed: 11, cloudCover: 0.82)
        case "partlyCloudy": return .init(symbol: "cloud.sun.fill", temperature: 21, precipitationChance: 0.09, snowfall: 0, windSpeed: 9, cloudCover: 0.48)
        case "rain": return .init(symbol: "cloud.rain.fill", temperature: 14, precipitationChance: 0.86, snowfall: 0, windSpeed: 19, cloudCover: 0.94)
        case "scatteredThunderstorms": return .init(symbol: "cloud.sun.bolt.fill", temperature: 23, precipitationChance: 0.68, snowfall: 0, windSpeed: 26, cloudCover: 0.76)
        case "sleet": return .init(symbol: "cloud.sleet.fill", temperature: 1, precipitationChance: 0.82, snowfall: 1.4, windSpeed: 21, cloudCover: 0.96)
        case "smoky": return .init(symbol: "smoke.fill", temperature: 27, precipitationChance: 0.02, snowfall: 0, windSpeed: 5, cloudCover: 0.64)
        case "snow": return .init(symbol: "cloud.snow.fill", temperature: -4, precipitationChance: 0.82, snowfall: 4.8, windSpeed: 16, cloudCover: 0.92)
        case "strongStorms": return .init(symbol: "cloud.bolt.rain.fill", temperature: 20, precipitationChance: 0.99, snowfall: 0, windSpeed: 52, cloudCover: 1)
        case "sunFlurries": return .init(symbol: "cloud.sun.fill", temperature: 1, precipitationChance: 0.48, snowfall: 0.9, windSpeed: 12, cloudCover: 0.4)
        case "sunShowers": return .init(symbol: "cloud.sun.rain.fill", temperature: 19, precipitationChance: 0.58, snowfall: 0, windSpeed: 13, cloudCover: 0.42)
        case "thunderstorms": return .init(symbol: "cloud.bolt.rain.fill", temperature: 21, precipitationChance: 0.92, snowfall: 0, windSpeed: 37, cloudCover: 1)
        case "tropicalStorm": return .init(symbol: "tropicalstorm", temperature: 27, precipitationChance: 0.96, snowfall: 0, windSpeed: 76, cloudCover: 1)
        case "windy": return .init(symbol: "wind", temperature: 18, precipitationChance: 0.09, snowfall: 0, windSpeed: 45, cloudCover: 0.42)
        case "wintryMix": return .init(symbol: "cloud.sleet.fill", temperature: 0, precipitationChance: 0.9, snowfall: 2.2, windSpeed: 25, cloudCover: 1)
        default: return .init(symbol: "cloud.sun.fill", temperature: 20, precipitationChance: 0.1, snowfall: 0, windSpeed: 8, cloudCover: 0.4)
        }
    }

    func previewSupportingSymbol(at offset: Int) -> String {
        ["sun.max.fill", "cloud.sun.fill", "cloud.fill", "cloud.rain.fill", "sun.max.fill"][offset % 5]
    }
}

#endif
