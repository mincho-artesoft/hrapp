import SwiftUI
import SwiftData
import AltIcon
import UIKit
import CoreLocation
import GoogleMobileAds
@preconcurrency import WeatherKit

@main
struct CalendarApp: App {

    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @AppStorage("subscriptionStatus") private var storedSubscriptionStatusRaw: String = SubscriptionCategory.base.rawValue
    
    @Environment(\.scenePhase) private var scenePhase
    
    @State private var isFirstForegroundAppearance = true
    @State private var hasCheckedIconThisSession = false // Флаг за иконите

    // Това е вашият WeatherKit ViewModel
    @StateObject private var weatherVM = WeatherKitViewModel.shared
    
    // ВАЖНО: LocationManager тук се използва само за стартиране на сървисите,
    // но НЕ трябва да обновява времето директно от този файл.
    @StateObject private var locationManager = LocationManager()
    
    private var areAdsEnabledByDate: Bool {
        let calendar = Calendar.current
        let targetDateComponents = DateComponents(year: 2026, month: 4, day: 1)
        guard let targetDate = calendar.date(from: targetDateComponents) else { return true }
        return Date() >= targetDate
    }
    
    var body: some Scene {
        WindowGroup {
            RootView()
                .onAppear {
                    // Логика за реклами
                    if SubscriptionManager.shared.subscriptionStatus == .base && areAdsEnabledByDate {
                        MobileAds.shared.start(completionHandler: nil)
                        Task { await AppOpenAdManager.shared.loadAd() }
                    }
                    print("👀 onAppear — абонаментен панел: \(storedSubscriptionStatusRaw)")
                    
                    /*
                     ВАЖНО: Премахнахме първоначалното извикване на weatherVM.fetchWeatherForCoords тук.
                     WeatherKitView.swift и RootView.swift имат собствена логика (.onAppear/.onReceive),
                     която ще зареди времето, когато потребителят отвори екрана.
                     Това предотвратява конфликтите.
                    */
                }
                /*
                 ВАЖНО: ИЗТРИХМЕ .onChange(of: locationManager.currentLocation).
                 Това беше причината за бъга! Този блок насилствено презаписваше данните
                 с GPS локацията, независимо какво е търсил потребителят.
                */
        }
        .onChange(of: scenePhase) { _ /* oldPhase */, newPhase in
            switch newPhase {
            case .active:
                print("App is active.")
                
                if SubscriptionManager.shared.subscriptionStatus == .base && areAdsEnabledByDate {
                    let delay: UInt64 = isFirstForegroundAppearance ? 10 : 2
                    isFirstForegroundAppearance = false
                    
                    Task {
                        await AppOpenAdManager.shared.loadAd()
                        try? await Task.sleep(nanoseconds: delay * 1_000_000_000)
                        AppOpenAdManager.shared.showAdIfAvailable()
                    }
                }
                
                ReviewManager.appLaunched()
                
                CalendarViewModel.shared.startGoogleCalendarSync()
                CalendarViewModel.shared.startMicrosoftCalendarSync()
                
                setupGlobalState()
                updateAppIconIfNeeded()
                
            case .background:
                print("App in background.")
                if SubscriptionManager.shared.subscriptionStatus == .base && areAdsEnabledByDate {
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
        guard !hasCheckedIconThisSession else { return }
        hasCheckedIconThisSession = true
        
        let calendar = Calendar.current
        let date = Date()
        let day = calendar.component(.day, from: date)
        let month = calendar.component(.month, from: date)
        let weekday = calendar.component(.weekday, from: date)
        
        let months = ["Jan","Feb","Mar","Apr","May","Jun", "Jul","Aug","Sep","Oct","Nov","Dec"]
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
