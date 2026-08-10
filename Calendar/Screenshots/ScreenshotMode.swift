import Foundation

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

        let hour = defaults.object(forKey: "ScreenshotScrollHour") as? Int
        return Configuration(
            screen: screen,
            calendarLocale: defaults.string(forKey: "ScreenshotCalendarLocale"),
            scrollHour: hour.flatMap { (0...23).contains($0) ? $0 : nil }
        )
    }()

    static var isActive: Bool { configuration != nil }

    /// Called as early as possible, before any view reads persisted state.
    @MainActor
    static func applyIfNeeded() {
        guard let configuration else { return }
        let defaults = UserDefaults.standard

        defaults.set(configuration.screen.rootTab, forKey: "selectedTabRoot")

        // The seeder creates one set of calendars per language, named for that
        // language, so switching the screenshot language is a matter of
        // selecting a different four - no tapping through the drawer, and no
        // reseeding between languages.
        if let locale = configuration.calendarLocale {
            selectCalendars(forLocale: locale)
        }
    }

    /// Read by the day/multi-day container instead of scrolling to "now", so
    /// every language's capture shows the same window of the day.
    static var pinnedScrollHour: Int? { configuration?.scrollHour }

    /// Set by the container once its content has been laid out. The harness
    /// waits for this rather than sleeping a fixed number of seconds.
    static func markReady() {
        guard isActive else { return }
        UserDefaults.standard.set(true, forKey: readyKey)
        UserDefaults.standard.synchronize()
    }

    static let readyKey = "ScreenshotReady"

    @MainActor
    private static func selectCalendars(forLocale locale: String) {
        let store = CalendarViewModel.shared.eventStore
        let prefix = "\(locale.uppercased()) · "
        let matching = store.calendars(for: .event)
            .filter { $0.title.hasPrefix(prefix) }
            .map(\.calendarIdentifier)

        guard !matching.isEmpty else {
            assertionFailure("No seeded calendars titled \(prefix)…; run seed-locale.sh --locale all first")
            return
        }
        UserDefaults.standard.set(matching, forKey: "SelectedCalendarIDsKey")
        CalendarViewModel.shared.selectedCalendarIDs = Set(matching)
    }
}

#endif
