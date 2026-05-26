import SwiftUI
import SwiftData
import UIKit
import CoreLocation
import GoogleMobileAds
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
                refreshCalendarWidgetIfNeeded()

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

    private func refreshCalendarWidgetIfNeeded() {
        guard !hasRefreshedWidgetThisSession else { return }
        hasRefreshedWidgetThisSession = true

        CalendarWidgetStore.saveWeatherSnapshot(
            symbol: weatherVM.currentSymbol,
            condition: weatherVM.currentCondition,
            temperature: weatherVM.currentTemp
        )
    }
}
