import Foundation
import EventKit
import SwiftUI
import CoreLocation
import UserNotifications

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

    /// Which part of the invitation flow to stage. Invitations arrive through
    /// a link, and a capture cannot follow one, so the payload is built here
    /// from the same URL parsing the real thing uses.
    enum InviteScene: String {
        case importSheet = "import"
        case cancelled
        case settings
    }

    struct Configuration {
        var screen: Screen
        var inviteScene: InviteScene?
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

        let inviteScene = defaults.string(forKey: "ScreenshotSharedInvite")
            .flatMap(InviteScene.init(rawValue:))

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
            inviteScene: inviteScene,
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

    /// Pins the displayed calendar, widget and countdown clock in captures.
    /// EventKit, WeatherKit and the system clock continue using real time.
    static let referenceDate: Date? = {
        guard isActive,
              let value = UserDefaults.standard.string(forKey: "ScreenshotClock") else { return nil }
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter.date(from: value)
    }()

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
            shared?.removeObject(forKey: "calendarWidget.screenshot.referenceDate")
            removeStagedRegions()
            return
        }

        // The widget and the Live Activity each run in their own process, and
        // neither inherits the `TZ` the harness exports for this one, so on a
        // simulator they format in the host Mac's zone. Handing them the zone
        // this process is actually using is what keeps the Live Activity card
        // and the Lock Screen clock directly above it telling the same time.
        shared?.set(TimeZone.current.identifier, forKey: sharedTimeZoneKey)
        if let referenceDate {
            shared?.set(referenceDate, forKey: "calendarWidget.screenshot.referenceDate")
        } else {
            shared?.removeObject(forKey: "calendarWidget.screenshot.referenceDate")
        }

        let defaults = UserDefaults.standard

        // Cleared here rather than by the harness, so the flag can only ever
        // describe the launch that is running. A stale `true` left by the
        // previous frame would let the next screenshot be taken before that
        // screen had laid out - the exact failure waiting on it is meant to
        // remove.
        defaults.removeObject(forKey: readyKey)
        UNUserNotificationCenter.current().removeAllDeliveredNotifications()
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()

        defaults.set(configuration.screen.rootTab, forKey: "selectedTabRoot")

        // Choose a real saved city through the same store as the city picker.
        // WeatherKit still fetches live weather for these coordinates. The id is
        // kept so the saved-city sheet, staged below, can put the check mark back
        // on this city instead of leaving it on the last one saved.
        var selectedWeatherRegionID: UUID?
        let coordinate = defaults.string(forKey: "ScreenshotWeatherCoordinate")?
            .split(separator: ",").compactMap { Double($0) }
        if configuration.screen == .weather,
           let name = defaults.string(forKey: "ScreenshotWeatherCity"),
           let latitude = coordinate?.first ?? defaults.string(forKey: "ScreenshotWeatherLatitude").flatMap(Double.init),
           let longitude = (coordinate?.count == 2 ? coordinate?.last : nil)
                ?? defaults.string(forKey: "ScreenshotWeatherLongitude").flatMap(Double.init),
           (-90...90).contains(latitude), (-180...180).contains(longitude) {
            let region = stageRegion(
                name: name,
                subtitle: defaults.string(forKey: "ScreenshotWeatherCountry"),
                coordinate: .init(latitude: latitude, longitude: longitude),
                timeZone: TimeZone.current
            )
            SavedWeatherRegionsStore.shared.select(region.id)
            selectedWeatherRegionID = region.id
        }

        // The day and week views carry weather chips of their own, and those come from
        // the same view model. A capture that names a condition gets it on every screen,
        // so a run does not depend on a live forecast arriving for that city.
        if let condition = configuration.weatherPreviewCondition {
            WeatherKitViewModel.shared.applyWeatherPreview(condition: condition)
        }

        if configuration.screen == .weather,
           defaults.bool(forKey: "WeatherPreviewSavedRegions") {
            // The list is passed in per capture, so an English shot is not left
            // showing the three Bulgarian cities the first run happened to need.
            let staged = previewCities(from: defaults).map { city in
                stageRegion(
                    name: city.name,
                    subtitle: city.subtitle,
                    coordinate: .init(latitude: city.latitude, longitude: city.longitude),
                    timeZone: city.timeZone.flatMap(TimeZone.init(identifier:))
                )
            }
            // Saving a city selects it, so after this the check mark sat on the last
            // one staged. The capture's own city takes it back; a capture without one
            // gives it to the first city in the list.
            if let selected = selectedWeatherRegionID ?? staged.first?.id {
                SavedWeatherRegionsStore.shared.select(selected)
            }
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

    /// The city `applyIfNeeded` staged and selected, so a capture with
    /// deterministic weather still names a real place in the header instead of
    /// reading "Weather Preview".
    static var stagedWeatherCity: String? {
        guard isActive,
              let name = UserDefaults.standard.string(forKey: "ScreenshotWeatherCity"),
              !name.isEmpty else { return nil }
        return name
    }
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

    /// A staged invitation, built by parsing a link exactly as an arriving one
    /// would be. Returns nil if the flow is not being captured.
    /// Puts two invitations in the calendar - one live, one called off - so a
    /// capture shows the contrast the strikethrough is there to draw.
    @MainActor
    static func stageCancelledInvite() {
        guard configuration?.inviteScene == .cancelled else { return }

        let store = CalendarViewModel.shared.eventStore

        // Screenshot fixtures use the same destination rule as a real import
        // and never manufacture a calendar of their own.
        guard let calendar = SharedInviteCalendar.destination(in: store) else { return }

        // Clear the day across every non-seeded calendar. Earlier runs of this
        // capture made their own invites calendars, and their events would
        // otherwise pile up side by side, one column per language.
        let dayStart = Calendar.current.startOfDay(for: Date())
        let dayEnd = dayStart.addingTimeInterval(86_400)
        let ours = store.calendars(for: .event).filter {
            $0.allowsContentModifications && !$0.title.contains(" · ")
        }
        if !ours.isEmpty {
            let existing = store.events(matching: store.predicateForEvents(
                withStart: dayStart, end: dayEnd, calendars: ours
            ))
            for event in existing { try? store.remove(event, span: .thisEvent, commit: false) }
            try? store.commit()
        }

        func make(title: String, hour: Int) -> EKEvent? {
            let event = EKEvent(eventStore: store)
            event.title = title
            event.startDate = Calendar.current.date(bySettingHour: hour, minute: 0, second: 0, of: Date())
            event.endDate = event.startDate?.addingTimeInterval(3_600)
            event.calendar = calendar
            event.location = NSLocalizedString("Sofia", comment: "")
            do { try store.save(event, span: .thisEvent, commit: true); return event }
            catch { print("Screenshot invite could not be saved - \(error.localizedDescription)"); return nil }
        }

        _ = make(title: NSLocalizedString("Sample shared event", comment: ""), hour: 10)

        let marker = NSLocalizedString("Cancelled", comment: "")
        guard let called = make(title: "\(marker): \(NSLocalizedString("Team lunch", comment: ""))", hour: 12),
              let identifier = called.eventIdentifier
        else { return }

        SharedInviteTracker.update(
            SharedInviteTracker.Invite(
                eventID: "screenshot-cancelled",
                feedID: "screenshotfeedidentifier",
                localEventIdentifier: identifier,
                isCancelled: true,
                lastSequence: 1
            )
        )

        // applyIfNeeded selects only the calendars seeded for this language, so
        // without this the invites calendar is filtered out of the timeline and
        // the capture comes back empty.
        var selected = CalendarViewModel.shared.selectedCalendarIDs
        selected.insert(calendar.calendarIdentifier)
        CalendarViewModel.shared.selectedCalendarIDs = selected
        UserDefaults.standard.set(Array(selected), forKey: "SelectedCalendarIDsKey")
        CalendarViewModel.shared.reloadCalendars()
    }

    @MainActor
    static func stagedInvite() -> SharedEventImportPayload? {
        guard configuration?.inviteScene == .importSheet else { return nil }

        let start = Calendar.current.date(
            bySettingHour: 15, minute: 30, second: 0,
            of: Date().addingTimeInterval(2 * 86_400)
        ) ?? Date().addingTimeInterval(2 * 86_400)

        var components = URLComponents()
        components.scheme = "https"
        components.host = "appclip.apple.com"
        components.path = "/id"
        components.queryItems = [
            URLQueryItem(name: "p", value: SharedEventImportPayload.appClipBundleIdentifier),
            URLQueryItem(name: "e", value: "screenshot-sample"),
            URLQueryItem(name: "c", value: "screenshotfeedidentifier"),
            URLQueryItem(name: "title", value: NSLocalizedString("Sample shared event", comment: "")),
            URLQueryItem(name: "start", value: String(start.timeIntervalSince1970)),
            URLQueryItem(name: "end", value: String(start.addingTimeInterval(3_600).timeIntervalSince1970)),
            URLQueryItem(name: "allDay", value: "0"),
            URLQueryItem(name: "timeZone", value: TimeZone.current.identifier),
            URLQueryItem(name: "color", value: "#0A84FF"),
            URLQueryItem(name: "location", value: NSLocalizedString("Sofia", comment: ""))
        ]

        return components.url.flatMap(SharedEventImportPayload.init(url:))
    }

    static let readyKey = "ScreenshotReady"

    /// Ids of the saved regions a capture put in the user's own city list.
    /// Kept so the next ordinary launch can take them back out again - without
    /// it every screenshot run would leave its city behind for good.
    private static let stagedRegionsKey = "ScreenshotStagedRegionIDs"

    private struct PreviewCity: Decodable {
        let name: String
        let subtitle: String?
        let latitude: Double
        let longitude: Double
        let timeZone: String?
    }

    /// The cities the saved-city sheet is staged with, as JSON on the command
    /// line:
    ///
    ///     -WeatherPreviewCities <base64 of [{"name":"New York",
    ///                             "subtitle":"United States","latitude":40.7128,
    ///                             "longitude":-74.0060,"timeZone":"America/New_York"}]>
    ///
    /// Without it the three cities the Bulgarian run needed are staged, which is
    /// what every capture before this argument existed relied on.
    private static func previewCities(from defaults: UserDefaults) -> [PreviewCity] {
        // A command-line value that opens with a bracket is parsed into an array before
        // it ever reaches `string(forKey:)`, so the JSON has to be taken back from
        // whichever of the two forms the argument domain decided on.
        let payload: Data? = {
            if let raw = defaults.string(forKey: "WeatherPreviewCities") {
                // base64 first: a bare JSON array on the command line is read as a
                // property list, and one that does not parse is dropped before it
                // reaches here, so the harness sends the encoded form.
                if let decoded = Data(base64Encoded: raw) { return decoded }
                return raw.data(using: .utf8)
            }
            if let parsed = defaults.array(forKey: "WeatherPreviewCities") {
                return try? JSONSerialization.data(withJSONObject: parsed)
            }
            return nil
        }()
        guard let data = payload,
              let cities = try? JSONDecoder().decode([PreviewCity].self, from: data),
              !cities.isEmpty
        else {
            return [
                PreviewCity(name: "София", subtitle: "България",
                            latitude: 42.6977, longitude: 23.3219, timeZone: "Europe/Sofia"),
                PreviewCity(name: "Пловдив", subtitle: "България",
                            latitude: 42.1354, longitude: 24.7453, timeZone: "Europe/Sofia"),
                PreviewCity(name: "Лондон", subtitle: "Обединено кралство",
                            latitude: 51.5072, longitude: -0.1276, timeZone: "Europe/London"),
            ]
        }
        return cities
    }

    /// Saves a region exactly as the city picker does, and records it as this
    /// run's, but only when it is genuinely new. `save` folds a coordinate
    /// onto a nearby existing entry, and a city the user saved themselves must
    /// survive the cleanup.
    @MainActor
    @discardableResult
    private static func stageRegion(
        name: String,
        subtitle: String?,
        coordinate: CLLocationCoordinate2D,
        timeZone: TimeZone?
    ) -> SavedWeatherRegion {
        let store = SavedWeatherRegionsStore.shared
        let existingIDs = Set(store.regions.map(\.id))
        let region = store.save(
            name: name,
            subtitle: subtitle,
            coordinate: coordinate,
            timeZone: timeZone
        )

        guard !existingIDs.contains(region.id) else { return region }

        let defaults = UserDefaults.standard
        var staged = defaults.stringArray(forKey: stagedRegionsKey) ?? []
        if !staged.contains(region.id.uuidString) {
            staged.append(region.id.uuidString)
            defaults.set(staged, forKey: stagedRegionsKey)
        }
        return region
    }

    /// Drops whatever the previous capture staged. Reads the key before
    /// touching the store so an ordinary launch, which is every launch outside
    /// a capture, does not build the singleton just to find nothing to do.
    @MainActor
    private static func removeStagedRegions() {
        let defaults = UserDefaults.standard
        guard let staged = defaults.stringArray(forKey: stagedRegionsKey) else { return }

        let store = SavedWeatherRegionsStore.shared
        for id in staged.compactMap(UUID.init(uuidString:)) {
            store.remove(id)
        }
        defaults.removeObject(forKey: stagedRegionsKey)
    }

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

/// Captures the actual share forms with inert, in-memory sample data.
/// Explicit launch arguments keep this entirely outside normal navigation.
@MainActor
struct ScreenshotSharingCaptureView: View {
    static var scene: String {
        UserDefaults.standard.string(forKey: "ScreenshotSharingScene") ?? ""
    }

    static var isRequested: Bool {
        ScreenshotMode.isActive && ["event", "calendar"].contains(scene)
    }

    private var title: String {
        UserDefaults.standard.string(forKey: "ScreenshotSharingTitle") ?? "Cloud Calendars"
    }

    var body: some View {
        RootView()
            .sheet(isPresented: .constant(true)) {
                Group {
                    if Self.scene == "event" {
                        EventShareMethodPicker(eventTitle: title,
                            onAppClip: {}, onEmail: {}, onQRCode: {}, onCancel: {})
                    } else {
                        ICloudCalendarSharingView(calendarID: "screenshot-calendar",
                            calendarTitle: title, calendarColor: "#8E6BF0",
                            timeZone: TimeZone.current.identifier, localCalendarIdentifier: "",
                            originalOwnerID: "screenshot-owner", originalOwnerEmail: "sofia@example.com",
                            isScreenshotPreview: true)
                    }
                }
                .allowsHitTesting(false)
                .presentationDetents([Self.scene == "event" ? .medium : .large])
                .presentationDragIndicator(.visible)
                .task {
                    try? await Task.sleep(for: .milliseconds(800))
                    ScreenshotMode.markReady()
                }
            }
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
        // Every number here is printed as it is, in whatever units the region asks for,
        // so the profile - written metric - has to be converted the same way the real
        // forecast is. Without it a US capture read 20°, 1012 inHg and 8 cm of snow.
        let imperial = GlobalState.measurementSystem == "Imperial"
        let unit: UnitTemperature = GlobalState.temperatureUnit == UnitTemperature.fahrenheit.symbol
            ? .fahrenheit : .celsius
        let metric = weatherPreviewProfile(for: condition)
        let profile = WeatherPreviewProfile(
            symbol: metric.symbol,
            temperature: Measurement(value: metric.temperature, unit: UnitTemperature.celsius)
                .converted(to: unit).value.rounded(),
            precipitationChance: metric.precipitationChance,
            // centimetres of snow become inches, kilometres per hour become miles
            snowfall: imperial ? (metric.snowfall / 2.54).rounded(toPlaces: 1) : metric.snowfall,
            windSpeed: imperial
                ? Measurement(value: metric.windSpeed, unit: UnitSpeed.kilometersPerHour)
                    .converted(to: .milesPerHour).value.rounded()
                : metric.windSpeed,
            cloudCover: metric.cloudCover
        )
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
        currentPressure = imperial ? 29.88 : 1_012
        let visibilityKm: Double = ["foggy", "haze", "smoky", "blowingDust"].contains(condition) ? 2.8 : 16
        currentVisibility = imperial
            ? Measurement(value: visibilityKm, unit: UnitLength.kilometers).converted(to: .miles).value.rounded(toPlaces: 1)
            : visibilityKm
        currentUVIndex = ["clear", "mostlyClear", "hot"].contains(condition) ? 7 : 3
        currentWindSpeed = profile.windSpeed
        currentWindGust = profile.windSpeed * 1.45
        currentWindDirection = Angle(degrees: 238)
        currentDewPoint = profile.temperature - (imperial ? 7 : 4)
        pressureTrend = "Steady"
        currentPrecipitationAmount = profile.precipitationChance * 3.4 / (imperial ? 25.4 : 1)
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
        // The widgets read weather from the shared snapshot, not from this view model, so
        // a capture without it showed empty widgets and the run refused the frame. This is
        // what made the Arabic pass stop three times.
        CalendarWidgetStore.saveWeatherSnapshot(
            symbol: profile.symbol, condition: conditionKey,
            temperature: profile.temperature, windDirectionDegrees: 238,
            windDirectionText: windDirectionAbbreviation(for: Angle(degrees: 238)),
            windSpeed: profile.windSpeed, pressure: currentPressure, uvIndex: currentUVIndex
        )
        todayPrecipitationAmount = profile.precipitationChance * 7.5 / (imperial ? 25.4 : 1)
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

/// Debug-only, launch-argument-driven reset used to put the two sharing
/// simulators on the same deterministic calendar data without touching any
/// other simulator. The normal app never enters this path.
@MainActor
enum SimulatorCalendarTestSeeder {
    static let requestKey = "ResetAndSeedSimulatorCalendars"
    static let resultKey = "SimulatorCalendarSeedResult"

    static var isRequested: Bool {
        UserDefaults.standard.bool(forKey: requestKey)
    }

    static func run() async -> String {
        guard isRequested else { return "SKIP not requested" }

        let eventStore = CalendarViewModel.shared.eventStore
        do {
            if EKEventStore.authorizationStatus(for: .event) != .fullAccess {
                guard try await eventStore.requestFullAccessToEvents() else {
                    return finish("FAIL EventKit access denied")
                }
            }

            let eventKitResult = try await resetAndSeedEventKit(eventStore)
            let localResult = resetAndSeedAppLocal()
            clearStaleLocalSharingMetadata()

            let selectedIDs = Set(
                eventKitResult.calendarIDs + localResult.calendarIDs
            )
            CalendarViewModel.shared.selectedCalendarIDs = selectedIDs
            UserDefaults.standard.set(
                Array(selectedIDs).sorted(),
                forKey: "SelectedCalendarIDsKey"
            )
            CalendarViewModel.shared.reloadCalendars()

            return finish(
                "PASS eventkitCalendars=\(eventKitResult.calendarIDs.count) "
                    + "eventkitEvents=\(eventKitResult.eventCount) "
                    + "localCalendars=\(localResult.calendarIDs.count) "
                    + "localEvents=\(localResult.eventCount)"
            )
        } catch {
            return finish("FAIL \(error.localizedDescription)")
        }
    }

    private static func finish(_ result: String) -> String {
        UserDefaults.standard.set(result, forKey: resultKey)
        UserDefaults.standard.synchronize()
        print("[SimulatorCalendarTestSeeder] \(result)")
        return result
    }

    private static func resetAndSeedEventKit(
        _ eventStore: EKEventStore
    ) async throws -> (calendarIDs: [String], eventCount: Int) {
        eventStore.refreshSourcesIfNecessary()
        // EventKit can expose calendars before their items have arrived from
        // the simulator's Calendar daemon. Give the daemon a short settling
        // window so the destructive pass cannot miss old events.
        try await Task.sleep(for: .seconds(2))
        let writableCalendars = eventStore.calendars(for: .event)
            .filter(\.allowsContentModifications)
        let keeper = eventStore.defaultCalendarForNewEvents ?? writableCalendars.first
        guard let keeper else {
            throw NSError(
                domain: "SimulatorCalendarTestSeeder",
                code: 1,
                userInfo: [NSLocalizedDescriptionKey: "No writable EventKit calendar"]
            )
        }

        var gregorian = Calendar(identifier: .gregorian)
        gregorian.timeZone = TimeZone(identifier: "Europe/Sofia") ?? .current
        // EventKit event predicates have a bounded reliable interval. Querying
        // one giant range can return no items even though the calendar is not
        // empty, so clear in three-year windows instead.
        let removalRanges: [(Date, Date)] = stride(from: 2000, through: 2033, by: 3)
            .compactMap { year in
                guard let start = gregorian.date(from: DateComponents(
                    year: year,
                    month: 1,
                    day: 1
                )), let end = gregorian.date(from: DateComponents(
                    year: min(year + 3, 2036),
                    month: 1,
                    day: 1
                )) else { return nil }
                return (start, end)
            }

        // Repeat after a refresh because simulator iCloud can deliver another
        // page of items immediately after the first commit. Do not de-duplicate
        // by calendarItemIdentifier: older simulator records can temporarily
        // report the same empty identifier even though they are distinct.
        for pass in 0..<3 {
            let calendars = eventStore.calendars(for: .event)
                .filter(\.allowsContentModifications)
            let existingEvents = removalRanges.flatMap { start, end in
                eventStore.events(matching: eventStore.predicateForEvents(
                    withStart: start,
                    end: end,
                    calendars: calendars
                ))
            }
            if existingEvents.isEmpty { break }
            for event in existingEvents {
                EventKitEventSupplementStore.remove(for: event)
                try? eventStore.remove(
                    event,
                    span: event.hasRecurrenceRules ? .futureEvents : .thisEvent,
                    commit: false
                )
            }
            try eventStore.commit()
            eventStore.refreshSourcesIfNecessary()
            if pass < 2 { try await Task.sleep(for: .milliseconds(500)) }
        }

        for calendar in writableCalendars
        where calendar.calendarIdentifier != keeper.calendarIdentifier {
            try eventStore.removeCalendar(calendar, commit: false)
        }
        try eventStore.commit()

        keeper.title = "Work"
        keeper.cgColor = UIColor.systemBlue.cgColor
        try eventStore.saveCalendar(keeper, commit: true)

        func makeCalendar(_ title: String, _ color: UIColor) throws -> EKCalendar {
            let calendar = EKCalendar(for: .event, eventStore: eventStore)
            calendar.title = title
            calendar.cgColor = color.cgColor
            calendar.source = keeper.source
            try eventStore.saveCalendar(calendar, commit: true)
            return calendar
        }

        let personal = try makeCalendar("Personal", .systemGreen)
        let team = try makeCalendar("Team", .systemOrange)
        let calendars = [keeper, personal, team]
        let dayStart = gregorian.startOfDay(for: Date())

        func date(day: Int = 0, hour: Int, minute: Int = 0) -> Date {
            let shifted = gregorian.date(byAdding: .day, value: day, to: dayStart) ?? dayStart
            return gregorian.date(
                bySettingHour: hour,
                minute: minute,
                second: 0,
                of: shifted
            ) ?? shifted
        }

        @discardableResult
        func makeEvent(
            _ title: String,
            calendar: EKCalendar,
            start: Date,
            end: Date,
            allDay: Bool = false,
            location: String = "",
            notes: String = "",
            url: String? = nil,
            alarms: [TimeInterval] = [],
            recurrence: EKRecurrenceRule? = nil
        ) throws -> EKEvent {
            let event = EKEvent(eventStore: eventStore)
            event.title = title
            event.calendar = calendar
            event.startDate = start
            event.endDate = end
            event.isAllDay = allDay
            event.timeZone = gregorian.timeZone
            event.location = location
            event.notes = notes
            event.url = url.flatMap(URL.init(string:))
            event.alarms = alarms.map(EKAlarm.init(relativeOffset:))
            if let recurrence { event.recurrenceRules = [recurrence] }
            try eventStore.save(
                event,
                span: recurrence == nil ? .thisEvent : .futureEvents,
                commit: false
            )
            return event
        }

        _ = try makeEvent(
            "Project Milestone",
            calendar: team,
            start: dayStart,
            end: gregorian.date(byAdding: .day, value: 1, to: dayStart)!,
            allDay: true,
            notes: "Shared all-day test event"
        )
        _ = try makeEvent(
            "Morning Stand-up",
            calendar: team,
            start: date(hour: 8, minute: 30),
            end: date(hour: 9),
            location: "Meeting Room A",
            alarms: [-600]
        )
        _ = try makeEvent(
            "Product Planning",
            calendar: keeper,
            start: date(hour: 9),
            end: date(hour: 10, minute: 30),
            location: "Sofia Tech Park",
            notes: "Review roadmap, owners, and the release checklist.",
            url: "https://cloud-calendars.com/test",
            alarms: [-900, -86_400]
        )
        _ = try makeEvent(
            "Design Review",
            calendar: team,
            start: date(hour: 9, minute: 30),
            end: date(hour: 11),
            location: "Design Studio"
        )
        _ = try makeEvent(
            "Lunch with Alex",
            calendar: personal,
            start: date(hour: 12),
            end: date(hour: 13),
            location: "Sofia Center"
        )
        _ = try makeEvent(
            "Client Call",
            calendar: keeper,
            start: date(hour: 14),
            end: date(hour: 15, minute: 30),
            location: "Video Call",
            notes: "Prepare the final proposal before the call."
        )
        // Dense reference matrix around Client Call. It deliberately covers
        // same-calendar underlays, cross-calendar overlaps, identical starts,
        // a nested 30-minute item and an event that begins on another event's
        // end boundary. This lets the custom detail timeline be compared with
        // Calendar.app using the exact same EventKit records.
        _ = try makeEvent(
            "Work Underlay",
            calendar: keeper,
            start: date(hour: 13),
            end: date(hour: 17),
            location: "Long same-calendar event"
        )
        _ = try makeEvent(
            "Team Underlay",
            calendar: team,
            start: date(hour: 13, minute: 30),
            end: date(hour: 17),
            location: "Long cross-calendar event"
        )
        _ = try makeEvent(
            "Same Start",
            calendar: team,
            start: date(hour: 14),
            end: date(hour: 15, minute: 30)
        )
        _ = try makeEvent(
            "Nested 30 Minutes",
            calendar: personal,
            start: date(hour: 14, minute: 30),
            end: date(hour: 15)
        )
        _ = try makeEvent(
            "Boundary Follow-up",
            calendar: personal,
            start: date(hour: 15),
            end: date(hour: 15, minute: 30)
        )
        _ = try makeEvent(
            "Release Check",
            calendar: team,
            start: date(hour: 16),
            end: date(hour: 16, minute: 30)
        )
        _ = try makeEvent(
            "Weekly Review",
            calendar: keeper,
            start: date(day: 1, hour: 10),
            end: date(day: 1, hour: 11),
            recurrence: EKRecurrenceRule(
                recurrenceWith: .weekly,
                interval: 1,
                end: nil
            )
        )
        _ = try makeEvent(
            "Previous Day Retrospective",
            calendar: team,
            start: date(day: -1, hour: 15),
            end: date(day: -1, hour: 16)
        )
        _ = try makeEvent(
            "Two-Day Conference",
            calendar: keeper,
            start: date(day: -1, hour: 17),
            end: date(day: 1, hour: 19),
            location: "Sofia Expo Center",
            notes: "Multi-day test event lasting longer than 24 hours."
        )
        _ = try makeEvent(
            "Early Coffee",
            calendar: personal,
            start: date(day: 1, hour: 7, minute: 45),
            end: date(day: 1, hour: 8)
        )
        _ = try makeEvent(
            "Product Workshop",
            calendar: team,
            start: date(day: 2, hour: 10),
            end: date(day: 2, hour: 12),
            location: "Workshop Hall"
        )
        _ = try makeEvent(
            "Personal Appointment",
            calendar: personal,
            start: date(day: 3, hour: 17),
            end: date(day: 3, hour: 17, minute: 45)
        )
        _ = try makeEvent(
            "Roadmap Follow-up",
            calendar: keeper,
            start: date(day: 5, hour: 13),
            end: date(day: 5, hour: 14)
        )
        try eventStore.commit()
        return (calendars.map(\.calendarIdentifier), 19)
    }

    private static func resetAndSeedAppLocal() -> (
        calendarIDs: [String],
        eventCount: Int
    ) {
        let store = AppLocalCalendarStore.shared
        for calendar in store.calendars {
            store.removeCalendar(id: calendar.id)
        }

        let projectsID = "app-local:test-projects"
        let personalID = "app-local:test-personal"
        store.upsertCalendar(AppLocalCalendarRecord(
            id: projectsID,
            title: "Local Projects",
            colorHex: "#AF52DE"
        ))
        store.upsertCalendar(AppLocalCalendarRecord(
            id: personalID,
            title: "Local Personal",
            colorHex: "#FF2D55"
        ))

        var gregorian = Calendar(identifier: .gregorian)
        gregorian.timeZone = TimeZone(identifier: "Europe/Sofia") ?? .current
        let dayStart = gregorian.startOfDay(for: Date())
        func date(day: Int = 0, hour: Int, minute: Int = 0) -> Date {
            let shifted = gregorian.date(byAdding: .day, value: day, to: dayStart) ?? dayStart
            return gregorian.date(
                bySettingHour: hour,
                minute: minute,
                second: 0,
                of: shifted
            ) ?? shifted
        }

        store.saveEvent(AppLocalEventRecord(
            id: "app-local-event:test-local-planning",
            calendarID: projectsID,
            title: "Local Planning",
            startDate: date(hour: 10),
            endDate: date(hour: 11, minute: 30),
            location: "Project Room",
            notes: "Editable local event with an attachment and alert.",
            urlString: "https://cloud-calendars.com/local-test",
            timeZoneIdentifier: gregorian.timeZone.identifier,
            alarms: [AppLocalEventAlarm(relativeOffset: -900)],
            structuredLocation: SharedEventLocation(
                title: "Project Room",
                latitude: 42.6977,
                longitude: 23.3219,
                radius: 0
            ),
            attachments: [AppLocalEventAttachment(
                id: "test-agenda-attachment",
                fileName: "agenda.txt",
                contentType: "text/plain",
                dataBase64: "VGVzdCBhZ2VuZGE="
            )]
        ))
        store.saveEvent(AppLocalEventRecord(
            id: "app-local-event:test-local-overlap",
            calendarID: projectsID,
            title: "Local Engineering Sync",
            startDate: date(hour: 10, minute: 30),
            endDate: date(hour: 11),
            location: "Online"
        ))
        store.saveEvent(AppLocalEventRecord(
            id: "app-local-event:test-local-gym",
            calendarID: personalID,
            title: "Gym",
            startDate: date(hour: 18),
            endDate: date(hour: 19)
        ))
        store.saveEvent(AppLocalEventRecord(
            id: "app-local-event:test-local-tomorrow",
            calendarID: projectsID,
            title: "Tomorrow Follow-up",
            startDate: date(day: 1, hour: 13),
            endDate: date(day: 1, hour: 13, minute: 30)
        ))
        store.saveEvent(AppLocalEventRecord(
            id: "app-local-event:test-local-retro",
            calendarID: projectsID,
            title: "Local Retrospective",
            startDate: date(day: -2, hour: 11),
            endDate: date(day: -2, hour: 12)
        ))
        store.saveEvent(AppLocalEventRecord(
            id: "app-local-event:test-local-offsite",
            calendarID: projectsID,
            title: "Local Multi-Day Offsite",
            startDate: date(day: 1, hour: 15),
            endDate: date(day: 3, hour: 18),
            location: "Borovets",
            notes: "Local multi-day test event lasting longer than 24 hours."
        ))
        store.saveEvent(AppLocalEventRecord(
            id: "app-local-event:test-local-breakfast",
            calendarID: personalID,
            title: "Breakfast",
            startDate: date(day: 2, hour: 8, minute: 30),
            endDate: date(day: 2, hour: 9)
        ))
        store.saveEvent(AppLocalEventRecord(
            id: "app-local-event:test-local-day-off",
            calendarID: personalID,
            title: "Local Day Off",
            startDate: gregorian.date(byAdding: .day, value: 4, to: dayStart) ?? dayStart,
            endDate: gregorian.date(byAdding: .day, value: 5, to: dayStart) ?? dayStart,
            isAllDay: true
        ))
        return ([projectsID, personalID], 8)
    }

    private static func clearStaleLocalSharingMetadata() {
        let defaults = UserDefaults.standard
        [
            "UnifiedEventEditorEventKitFixtureID",
            "EventEditorReferencePreview",
            "EventEditorReferenceMode",
            "EventEditorReferenceKind",
            "EventEditorReferenceOverlap",
            "EventEditorReferenceDenseTimeline",
            "sharedInvites.tracked",
            "eventShare.sentEvents.v1",
            "eventShare.sentEventsMigrated.v1",
            "eventShare.shareIDsByEvent",
            "SharedICloudCalendarLocalIdentifiers",
            "SharedICloudCalendarLocalEventIdentifiers.v1",
            "SharedICloudCalendarOwnedIdentifiers.v1",
            "SharedICloudCalendarRevokedShareIDs.v1",
            "SharedICloudCalendarAccessByShareID.v1",
            "SharedICloudCalendarSyncBaselines.v1",
            "SharedICloudCalendarOwnedSyncBaselines.v1",
            "SharedICloudCalendarLocalColorOverrides.v1",
            "SharedICloudCalendarRemovedLocally.v1"
        ].forEach(defaults.removeObject(forKey:))
    }
}

@MainActor
struct SimulatorCalendarTestSeedView: View {
    @State private var status = "Preparing identical test calendars…"

    var body: some View {
        VStack(spacing: 16) {
            ProgressView()
            Text(status)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
        }
        .task {
            status = await SimulatorCalendarTestSeeder.run()
        }
    }
}

private extension Double {
    /// Keeps a converted preview figure to the number of decimals the card prints,
    /// so 3.2 inches of snow does not arrive as 3.2283464566929134.
    func rounded(toPlaces places: Int) -> Double {
        let f = pow(10.0, Double(places))
        return (self * f).rounded() / f
    }
}

#endif
