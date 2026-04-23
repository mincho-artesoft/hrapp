import SwiftUI
import SwiftData
import UIKit
import CoreLocation
#if !targetEnvironment(macCatalyst)
import AltIcon
import GoogleMobileAds
#endif
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

    @State private var hasCheckedIconThisSession = false // Флаг за иконите

    // Това е вашият WeatherKit ViewModel
    @StateObject private var weatherVM = WeatherKitViewModel.shared

    // ВАЖНО: LocationManager тук се използва само за стартиране на сървисите,
    // но НЕ трябва да обновява времето директно от този файл.
    @StateObject private var locationManager = LocationManager()

    var body: some Scene {
        WindowGroup {
            RootView()
                .onAppear {
                    // Логика за реклами
                    if SubscriptionManager.shared.subscriptionStatus == .base {
                        #if !targetEnvironment(macCatalyst)
                        MobileAds.shared.start(completionHandler: nil)
                        #endif
                        Task {
                            await AppOpenAdManager.shared.loadAd()
                            InterstitialAdManager.shared.loadAd()
                        }
                        // ✅ При първото стартиране НЕ показваме App Open Ad.
                        // ✅ При всяко следващо стартиране/отваряне - показваме.
                        if hasLaunchedBefore {
                            Task {
                                try? await Task.sleep(nanoseconds: 2_000_000_000)
                                AppOpenAdManager.shared.showAdIfAvailable()
                            }
                        } else {
                            hasLaunchedBefore = true
                        }
                    }

                    print("👀 onAppear — абонаментен панел: \(storedSubscriptionStatusRaw)")
                }
        }
        .onChange(of: scenePhase) { _, newPhase in
            switch newPhase {
            case .active:
                print("App is active.")

                // ПРОВЕРКА ЗА РЕКЛАМИ
                if SubscriptionManager.shared.subscriptionStatus == .base {
                    Task { await AppOpenAdManager.shared.loadAd() }

                    // ✅ Показваме само ако НЕ е първо стартиране.
                    if hasLaunchedBefore {
                        AppOpenAdManager.shared.showAdIfAvailable()
                    } else {
                        hasLaunchedBefore = true
                    }
                }

                // Останалите процеси
                ReviewManager.appLaunched()
                CalendarViewModel.shared.startGoogleCalendarSync()
                CalendarViewModel.shared.startMicrosoftCalendarSync()

                setupGlobalState()
                updateAppIconIfNeeded()

            case .background:
                print("App in background.")
                if SubscriptionManager.shared.subscriptionStatus == .base {
                    Task { await AppOpenAdManager.shared.loadAd() }
                }
                CalendarViewModel.shared.stopGoogleCalendarSync()
                CalendarViewModel.shared.stopMicrosoftCalendarSync()

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

        let nf = NumberFormatter()
        nf.locale = locale
        nf.numberStyle = .decimal
        let num = 1234567.89 as NSNumber
        GlobalState.numberFormat = nf.string(from: num) ?? ""
    }

    private func updateAppIconIfNeeded() {
        #if targetEnvironment(macCatalyst)
        return
        #else
        guard !hasCheckedIconThisSession else { return }
        hasCheckedIconThisSession = true

        let calendar = Calendar.current
        let date = Date()
        let day = calendar.component(.day, from: date)
        let month = calendar.component(.month, from: date)
        let weekday = calendar.component(.weekday, from: date)

        let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        let weekdaysShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

        let monthName = months[month - 1]
        let weekdayNameShort = weekdaysShort[weekday - 1]
        let weatherType = getCurrentWeatherType()

        let iconName = "icon_\(monthName)_\(weekdayNameShort)_\(day)_\(weatherType)"
        let currentIcon = UIApplication.shared.alternateIconName

        if currentIcon != iconName {
            print("Changing app icon to: \(iconName)")
            AltIcon.setAppIcon(iconName)
        }
        #endif
    }

    func getCurrentWeatherType() -> String {
        let symbol = weatherVM.currentSymbol
        guard !symbol.isEmpty else { return "sun" }

        let cleanedSymbol = symbol.replacingOccurrences(of: ".fill", with: "")

        let symbolMapping: [String: String] = [
            "cloud.bolt.rain": "cloud-bolt-rain",
            "cloud.sun.bolt.rain": "cloud-bolt-rain",
            "cloud.bolt": "cloud-bolt",
            "cloud.sun.bolt": "cloud-bolt",
            "cloud.drizzle": "cloud-drizzle",
            "cloud.fog": "cloud-fog",
            "cloud.hail": "cloud-hail",
            "cloud.heavyrain": "cloud-heavyrain",
            "cloud.rain": "cloud-rain",
            "cloud.sun.rain": "cloud-rain",
            "cloud.sleet": "cloud-sleet",
            "cloud.snow": "cloud-snow",
            "cloud.sun": "cloud-sun",
            "cloud": "cloud",
            "snowflake": "snowflake",
            "sun.max": "sun",
            "sun.haze": "sun"
        ]

        if let mapped = symbolMapping[cleanedSymbol] {
            return mapped
        } else {
            return "sun"
        }
    }
}
