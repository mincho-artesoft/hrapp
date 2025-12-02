import SwiftUI
import SwiftData
import AltIcon
import UIKit   // UINavigationBarAppearance, UIToolbarAppearance
import CoreLocation
import GoogleMobileAds
@preconcurrency import WeatherKit

@main
struct CalendarApp: App {
    
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    @AppStorage("subscriptionStatus") private var storedSubscriptionStatusRaw: String = SubscriptionCategory.base.rawValue
    
    @Environment(\.scenePhase) private var scenePhase
    
    @State private var isFirstForegroundAppearance = true
    
    // WeatherKit ViewModel (твоя shared singleton)
    @StateObject private var weatherVM = WeatherKitViewModel.shared
    
    // LocationManager – за да вземаме текущата локация на устройството
    @StateObject private var locationManager = LocationManager()
    
    var body: some Scene {
        WindowGroup {
            RootView()
                .onAppear {
                    // Реклама при base subscription
                    if SubscriptionManager.shared.subscriptionStatus == .base {
                        MobileAds.shared.start(completionHandler: nil)
                        Task { await AppOpenAdManager.shared.loadAd() }
                    }
                    
                    print("👀 onAppear — абонаментен панел: \(storedSubscriptionStatusRaw)")
                    
                    let statusEnum = SubscriptionManager.shared.subscriptionStatus.rawValue
                    print("📦 SubscriptionManager status: \(statusEnum)")
                    
                    // Взимаме текущата локация и дърпаме време
                    if let loc = locationManager.currentLocation {
                        weatherVM.fetchWeatherForCoords(
                            latitude: loc.coordinate.latitude,
                            longitude: loc.coordinate.longitude
                        )
                    }
                }
                .onChange(of: locationManager.currentLocation) { _, newLoc in
                    guard let newLoc = newLoc else { return }
                    weatherVM.fetchWeatherForCoords(
                        latitude: newLoc.coordinate.latitude,
                        longitude: newLoc.coordinate.longitude
                    )
                }
        }
        .onChange(of: scenePhase) { _ /* oldPhase */, newPhase in
            switch newPhase {
            case .active:
                print("App is active. Starting sync timers.")
                
                if SubscriptionManager.shared.subscriptionStatus == .base {
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
                
                let locale = Locale.current
                let calendar = Calendar.current
                
                // 1. Регион
                if let regionCode = locale.region?.identifier {
                    GlobalState.region = regionCode
                }
                
                // 2. Календар
                let calID = String(describing: calendar.identifier)
                GlobalState.calendar = calID
                
                // 3. Температурна единица
                let temp = Measurement(value: 9, unit: UnitTemperature.celsius)
                let formattedTemp = temp.formatted(
                    .measurement(width: .abbreviated,
                                 usage: .person,
                                 numberFormatStyle: .number)
                )
                let unit = formattedTemp.firstIndex(of: "F") != nil ? UnitTemperature.fahrenheit : UnitTemperature.celsius
                GlobalState.temperatureUnit = unit.symbol
                
                // 4. Мерна система
                GlobalState.measurementSystem = (locale.measurementSystem == .metric) ? "Metric" : "Imperial"
                
                // 5. Първи ден от седмицата
                GlobalState.firstWeekday = calendar.firstWeekday
                
                // 6. Формат на дата
                let df = DateFormatter()
                df.locale = locale
                df.dateStyle = .short
                GlobalState.dateFormat = df.dateFormat ?? ""
                
                // 7. Формат на числа
                let nf = NumberFormatter()
                nf.locale = locale
                nf.numberStyle = .decimal
                let num = 1234567.89 as NSNumber
                GlobalState.numberFormat = nf.string(from: num) ?? ""
                
                // MARK: - Динамичен избор на икона по дата + време
                
                let date = Date()
                let day = calendar.component(.day, from: date)
                let month = calendar.component(.month, from: date)
                let weekday = calendar.component(.weekday, from: date)
                
                let months = ["Jan","Feb","Mar","Apr","May","Jun",
                              "Jul","Aug","Sep","Oct","Nov","Dec"]
                let weekdaysShort = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
                
                let monthName = months[month - 1]
                let weekdayNameShort = weekdaysShort[weekday - 1]
                let weatherType = getCurrentWeatherType()
                
                // Точно това име присъства като ключ в frame_map.json
                let iconName = "icon_\(monthName)_\(weekdayNameShort)_\(day)_\(weatherType)"
                
                // 🔹 1) Опит за зареждане на кадъра от видео (за вътрешна употреба / debug):
                if let videoIcon = IconVideoSource.shared.getIcon(named: iconName) {
                    print("✅ Успешно извлечена икона от видео за \(iconName), размер: \(videoIcon.size)")
                    // Тук Можеш да я ползваш вътре в приложението (например да обновиш някакво глобално Image)
                    // НО НЕ МОЖЕ директно да я подадеш на iOS като app icon.
                } else {
                    print("⚠️ Не успях да извадя кадър от видео за \(iconName)")
                }
                
                // 🔹 2) Задаваме app icon чрез AltIcon:
                //
                // Важно: iOS позволява смяна само към икони, които са описани
                // в Info.plist (CFBundleAlternateIcons) и са статични PNG в bundle-а.
                // Това извикване не може да използва UIImage от видео, а само име
                // на вече съществуваща alternate icon конфигурация.
                
                AltIcon.setAppIcon(iconName)
                
                // Ако иконата с това име не съществува като alternate icon,
                // можеш да държиш fallback име, което със сигурност има:
                let fallbackName = "icon_\(monthName)_\(weekdayNameShort)_\(day)_sun"
                AltIcon.setAppIcon(fallbackName)
                
                print("🔁 Опит за задаване на app icon: \(iconName), fallback: \(fallbackName)")
                
            case .background:
                print("App in background. Stop sync timers.")
                
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
    
    /// Връща типа време като string, за да съвпада с имената на иконите:
    /// напр. "cloud-bolt-rain", "cloud-fog", "cloud-heavyrain", "sun", и т.н.
    func getCurrentWeatherType() -> String {
        // WeatherKit символ, напр: "cloud.heavyrain.fill", "cloud.bolt.fill", "sun.max.fill"...
        let symbol = weatherVM.currentSymbol
        
        // Ако по някаква причина е празен:
        guard !symbol.isEmpty else {
            return "sun"
        }
        
        // Премахваме ".fill" от края, за да остане "cloud.heavyrain" например
        let cleanedSymbol = symbol.replacingOccurrences(of: ".fill", with: "")
        
        // Разширен речник със съответствия:
        let symbolMapping: [String: String] = [
            // ---- "cloud-bolt-rain" ----
            "cloud.bolt.rain": "cloud-bolt-rain",
            "cloud.sun.bolt.rain": "cloud-bolt-rain",
            
            // ---- "cloud-bolt" ----
            "cloud.bolt": "cloud-bolt",
            "cloud.sun.bolt": "cloud-bolt",
            
            // ---- "cloud-drizzle" ----
            "cloud.drizzle": "cloud-drizzle",
            
            // ---- "cloud-fog" ----
            "cloud.fog": "cloud-fog",
            
            // ---- "cloud-hail" ----
            "cloud.hail": "cloud-hail",
            
            // ---- "cloud-heavyrain" ----
            "cloud.heavyrain": "cloud-heavyrain",
            
            // ---- "cloud-rain" ----
            "cloud.rain": "cloud-rain",
            "cloud.sun.rain": "cloud-rain",
            
            // ---- "cloud-sleet" ----
            "cloud.sleet": "cloud-sleet",
            
            // ---- "cloud-snow" ----
            "cloud.snow": "cloud-snow",
            
            // ---- "cloud-sun" ----
            "cloud.sun": "cloud-sun",
            
            // ---- "cloud" ----
            "cloud": "cloud",
            
            // ---- "snowflake" ----
            "snowflake": "snowflake",
            
            // ---- "sun" ----
            "sun.max": "sun",
            "sun.haze": "sun"
        ]
        
        if let mapped = symbolMapping[cleanedSymbol] {
            return mapped
        } else {
            // fallback
            return "sun"
        }
    }
}
