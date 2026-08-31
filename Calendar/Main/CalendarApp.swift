import ActivityKit
import BackgroundTasks
import EventKit
import SwiftUI
import SwiftData
import UIKit
import CoreLocation
import GoogleMobileAds
import WidgetKit
@preconcurrency import WeatherKit

@main
struct CalendarApp: App {

    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    @AppStorage("subscriptionStatus")
    private var storedSubscriptionStatusRaw: String = SubscriptionCategory.base.rawValue

    /// ✅ Persist-ва се между стартиранията. Първия път е false.
    @AppStorage("hasLaunchedBefore")
    private var hasLaunchedBefore: Bool = false

    @Environment(\.scenePhase) private var scenePhase

    @State private var hasRefreshedWidgetThisSession = false
    @State private var widgetRefreshTask: Task<Void, Never>?
    @State private var pendingSharedEvent: SharedEventImportPayload?

    private let liveActivityRefreshInterval: UInt64 = 5 * 60 * 1_000_000_000

    // Това е вашият WeatherKit ViewModel
    @StateObject private var weatherVM = WeatherKitViewModel.shared

    // ВАЖНО: LocationManager тук се използва само за стартиране на сървисите,
    // но НЕ трябва да обновява времето директно от този файл.
    @StateObject private var locationManager = LocationManager()

    init() {
        #if DEBUG
        // Must run before RootView.init, which reads the persisted tab.
        MainActor.assumeIsolated { ScreenshotMode.applyIfNeeded() }

        // Xcode's App Clip local experience supplies this value. Supporting it
        // in the full app as well makes the handoff screen testable locally.
        if let rawURL = ProcessInfo.processInfo.environment["_XCAppClipURL"],
           let url = URL(string: rawURL),
           let payload = SharedEventImportPayload(url: url) {
            _pendingSharedEvent = State(initialValue: payload)
        }
        #endif
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .onAppear {
                    EventNotificationManager.shared.configure()
                    EventNotificationManager.shared.requestAuthorizationOnLaunch()

                    // Логика за реклами
                    if SubscriptionManager.shared.subscriptionStatus == .base {
                        MobileAds.shared.start(completionHandler: nil)
                        Task {
                            await AppOpenAdManager.shared.loadAd()
                            InterstitialAdManager.shared.loadAd()
                        }
                        // ✅ При първото стартиране НЕ показваме App Open Ad.
                        // ✅ При всяко следващо стартиране/отваряне - показваме.
                        if hasLaunchedBefore {
                            Task {
                                try? await Task.sleep(nanoseconds: 2_000_000_000)
                                guard pendingSharedEvent == nil else { return }
                                AppOpenAdManager.shared.showAdIfAvailable()
                            }
                        } else {
                            hasLaunchedBefore = true
                        }
                    }

                    print("👀 onAppear — абонаментен панел: \(storedSubscriptionStatusRaw)")

                    if pendingSharedEvent == nil {
                        pendingSharedEvent = SharedEventImportHandoffStore.takePendingPayload()
                    }

                    #if DEBUG
                    ScreenshotMode.stageCancelledInvite()
                    if let staged = ScreenshotMode.stagedInvite() {
                        pendingSharedEvent = staged
                        ScreenshotMode.markReady()
                    }
                    #endif
                }
                .onContinueUserActivity(NSUserActivityTypeBrowsingWeb) { activity in
                    guard let url = activity.webpageURL else { return }
                    guard let payload = SharedEventImportPayload(url: url) else { return }
                    SharedEventImportHandoffStore.clearPendingPayload()
                    pendingSharedEvent = payload
                }
                .onOpenURL { url in
                    guard let payload = SharedEventImportPayload(url: url) else { return }
                    SharedEventImportHandoffStore.clearPendingPayload()
                    pendingSharedEvent = payload
                }
                .sheet(item: $pendingSharedEvent) { payload in
                    SharedEventImportView(payload: payload)
                }
        }
        .backgroundTask(.appRefresh(CalendarLiveActivityBackgroundRefreshTask.identifier)) {
            await CalendarLiveActivityBackgroundRefreshTask.run()
        }
        .onChange(of: scenePhase) { _, newPhase in
            switch newPhase {
            case .active:
                print("App is active.")

                // Uses the same 20-second foreground cadence as the Google and
                // Microsoft sync loops. It pushes organiser edits and pulls
                // updated invite feeds, with an immediate pass on activation.
                SharedEventSyncManager.start()

                // If this device runs a booking page, keep it in step with the
                // real calendar: push busy times up, pull new bookings down.
                Task { await BookingManager.refresh() }

                // ПРОВЕРКА ЗА РЕКЛАМИ
                if SubscriptionManager.shared.subscriptionStatus == .base {
                    Task { await AppOpenAdManager.shared.loadAd() }

                    // ✅ Показваме само ако НЕ е първо стартиране.
                    if hasLaunchedBefore {
                        Task {
                            // Universal-link delivery follows activation. This
                            // short delay lets the shared-event route win over
                            // the app-open ad when the app is already installed.
                            try? await Task.sleep(for: .milliseconds(600))
                            guard pendingSharedEvent == nil else { return }
                            AppOpenAdManager.shared.showAdIfAvailable()
                        }
                    } else {
                        hasLaunchedBefore = true
                    }
                }

                // Останалите процеси
                ReviewManager.appLaunched()
                CalendarViewModel.shared.startGoogleCalendarSync()
                CalendarViewModel.shared.startMicrosoftCalendarSync()

                setupGlobalState()
                EventNotificationManager.shared.refreshAuthorizationStatus()
                EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
                Task {
                    await WeatherAlertNotificationManager.shared.checkForNewGPSAlerts(
                        force: true,
                        reason: "app-active"
                    )
                }
                refreshCalendarWidgetIfNeeded()
                CalendarLiveActivityManager.shared.update()
                startPeriodicCalendarWidgetRefresh()

            case .background:
                print("App in background.")
                CalendarLiveActivityManager.shared.update()
                CalendarLiveActivityBackgroundRefreshTask.schedule()
                if SubscriptionManager.shared.subscriptionStatus == .base {
                    Task { await AppOpenAdManager.shared.loadAd() }
                }
                CalendarViewModel.shared.stopGoogleCalendarSync()
                CalendarViewModel.shared.stopMicrosoftCalendarSync()
                SharedEventSyncManager.stop()
                stopPeriodicCalendarWidgetRefresh()

            case .inactive:
                print("App is inactive.")

            @unknown default:
                break
            }
        }
    }

    // MARK: - Helper Methods

    private func setupGlobalState() {
        let locale = Locale.current
        let calendar = Calendar.current

        if let regionCode = locale.region?.identifier {
            GlobalState.region = regionCode
        }

        GlobalState.calendar = String(describing: calendar.identifier)

        let temp = Measurement(value: 9, unit: UnitTemperature.celsius)
        let formattedTemp = temp.formatted(.measurement(width: .abbreviated, usage: .person, numberFormatStyle: .number))
        let unit = formattedTemp.firstIndex(of: "F") != nil ? UnitTemperature.fahrenheit : UnitTemperature.celsius
        GlobalState.temperatureUnit = unit.symbol

        GlobalState.measurementSystem = (locale.measurementSystem == .metric) ? "Metric" : "Imperial"
        GlobalState.firstWeekday = calendar.firstWeekday

        let df = DateFormatter()
        df.locale = locale
        df.dateStyle = .short
        GlobalState.dateFormat = df.dateFormat ?? ""

        GlobalState.timeFormat = DateFormatter.dateFormat(
            fromTemplate: "j:mm",
            options: 0,
            locale: locale
        ) ?? "HH:mm"

        let nf = NumberFormatter()
        nf.locale = locale
        nf.numberStyle = .decimal
        let num = 1234567.89 as NSNumber
        GlobalState.numberFormat = nf.string(from: num) ?? ""

        CalendarWidgetStore.saveGlobalStateSnapshot(reload: false)
    }

    private func refreshCalendarWidgetIfNeeded() {
        guard !hasRefreshedWidgetThisSession else { return }
        hasRefreshedWidgetThisSession = true

        Task { @MainActor in
            await refreshCalendarWidgetIfInstalled()
        }
    }

    private func startPeriodicCalendarWidgetRefresh() {
        widgetRefreshTask?.cancel()
        widgetRefreshTask = Task { @MainActor in
            await refreshCalendarSurfaces()

            while !Task.isCancelled {
                do {
                    try await Task.sleep(nanoseconds: liveActivityRefreshInterval)
                } catch {
                    return
                }

                await refreshCalendarSurfaces()
            }
        }
    }

    private func stopPeriodicCalendarWidgetRefresh() {
        widgetRefreshTask?.cancel()
        widgetRefreshTask = nil
    }

    @MainActor
    private func refreshCalendarWidgetIfInstalled() async {
        await refreshCalendarSurfaces()
    }

    @MainActor
    private func refreshCalendarSurfaces() async {
        let hasInstalledCalendarWidget = await CalendarWidgetStore.hasInstalledCalendarWidget()

        if hasInstalledCalendarWidget {
            CalendarWidgetStore.saveWeatherSnapshot(
                symbol: weatherVM.currentSymbol,
                condition: weatherVM.currentConditionLocalizationKey.isEmpty
                    ? weatherVM.currentCondition
                    : weatherVM.currentConditionLocalizationKey,
                temperature: weatherVM.currentTemp,
                windDirectionDegrees: weatherVM.currentWindDirection?.degrees,
                windDirectionText: weatherVM.windDirectionAbbreviation(for: weatherVM.currentWindDirection),
                windSpeed: weatherVM.currentWindSpeed,
                pressure: weatherVM.currentPressure,
                uvIndex: weatherVM.currentUVIndex
            )
        }

        CalendarWidgetStore.saveUpcomingEventsSnapshot()
        CalendarLiveActivityManager.shared.update(refreshSnapshot: false)
    }
}

@MainActor
private enum CalendarLiveActivityBackgroundRefreshTask {
    static let identifier = "com.deksan.calendarasd.refresh"
    private static let refreshInterval: TimeInterval = 5 * 60
    private static var schedulingUnavailable = false

    static func schedule() {
        guard !schedulingUnavailable else { return }

        guard UIApplication.shared.backgroundRefreshStatus == .available else {
            schedulingUnavailable = true
            print("Calendar Live Activity refresh was not scheduled because Background App Refresh is unavailable.")
            return
        }

        let request = BGAppRefreshTaskRequest(identifier: identifier)
        request.earliestBeginDate = Date(timeIntervalSinceNow: refreshInterval)

        do {
            try BGTaskScheduler.shared.submit(request)
        } catch {
            let nsError = error as NSError
            if nsError.domain == BGTaskScheduler.errorDomain,
               nsError.code == BGTaskScheduler.Error.Code.unavailable.rawValue {
                schedulingUnavailable = true
            }
            print("Could not schedule Calendar Live Activity refresh: \(error.localizedDescription)")
        }
    }

    static func run() async {
        schedule()

        // Weather warning notifications intentionally use only the last real
        // GPS coordinate, never a selected or saved weather region.
        await WeatherAlertNotificationManager.shared.checkForNewGPSAlerts(
            reason: "background-refresh"
        )

        guard canReadCalendar else { return }

        let eventStore = EKEventStore()
        let selectedCalendarIDs = CalendarWidgetStore.selectedCalendarIDs(for: eventStore)
        let snapshots = CalendarWidgetStore.makeUpcomingEventSnapshots(
            from: eventStore,
            selectedCalendarIDs: selectedCalendarIDs
        )

        CalendarWidgetStore.saveUpcomingEventSnapshots(snapshots)

        let state = CalendarLiveActivityManager.makeContentState(from: snapshots)
        let content = ActivityContent(
            state: state,
            staleDate: CalendarLiveActivityManager.staleDate(for: state)
        )

        for activity in Activity<CalendarLiveActivityAttributes>.activities {
            await activity.update(content)
        }
    }

    private static var canReadCalendar: Bool {
        let status = EKEventStore.authorizationStatus(for: .event)

        if #available(iOS 17.0, *) {
            return status == .fullAccess
        } else {
            return status == .authorized
        }
    }
}
