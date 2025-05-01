import SwiftUI
import AltIcon
import UIKit   // UINavigationBarAppearance, UIToolbarAppearance
import CoreLocation
@preconcurrency import WeatherKit

@main
struct CalendarApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @AppStorage("subscriptionStatus") private var storedSubscriptionStatusRaw: String = SubscriptionCategory.base.rawValue

    @Environment(\.scenePhase) private var scenePhase
    
    // Това е вашият WeatherKit ViewModel:
    @StateObject private var weatherVM = WeatherKitViewModel.shared
    
    // Вашият LocationManager (за да вземаме текущата локация на устройството)
    @StateObject private var locationManager = LocationManager()
    
    var body: some Scene {
        WindowGroup {
            RootView()
                // Когато се появи RootView, опитваме да вземем текуща локация:
                .onAppear {
                   // Принтираме при първо показване на RootView:
                   print("👀 onAppear — абонаментен панел: \(storedSubscriptionStatusRaw)")
                   
                   // Пример: ако искаш да вземеш и enum-а от SubscriptionManager:
                   let statusEnum = SubscriptionManager.shared.subscriptionStatus.rawValue
                   print("📦 SubscriptionManager status: \(statusEnum)")

                   // Съществуващата ти логика:
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
                CalendarViewModel.shared.startGoogleCalendarSync()
                CalendarViewModel.shared.startMicrosoftCalendarSync()
                
                let date = Date()
                let calendar = Calendar.current
                let day = calendar.component(.day, from: date)
                let month = calendar.component(.month, from: date)
                let weekday = calendar.component(.weekday, from: date)
                
                let months = ["Jan","Feb","Mar","Apr","May","Jun",
                              "Jul","Aug","Sep","Oct","Nov","Dec"]
                let weekdays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
                
                let monthName = months[month - 1]
                let weekdayName = weekdays[weekday - 1]
                let weatherType = getCurrentWeatherType()
                let iconName = "icon_\(monthName)_\(weekdayName)_\(day)_\(weatherType)"
                
                AltIcon.setAppIcon(iconName)
                print("Не намирам \(iconName). Слагам fallback (sun).")
                let fallbackName = "icon_\(monthName)_\(weekdayName)_\(day)_sun"
                AltIcon.setAppIcon(fallbackName)
                
            case .background:
                print("App in background. Stop sync timers.")
                CalendarViewModel.shared.stopGoogleCalendarSync()
                CalendarViewModel.shared.stopMicrosoftCalendarSync()

            case .inactive:
                print("App is inactive.")
                
            @unknown default:
                break
            }
        }
    }
    
    /// Функция, която връща типа време, за да съответства на вашите налични икони.
    /// Списъкът долу покрива всички "cloud-bolt-rain", "cloud-fog", "cloud-heavyrain" и т.н.
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
            
            // ---- "cloud-hail" ---- (ако WeatherKit има "cloud.hail")
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
            
            // ---- "snowflake" ---- (WeatherKit рядко го връща, но ако имате .appiconset)
            "snowflake": "snowflake",
            
            // ---- "sun" ---- (което във WeatherKit може да бъде "sun.max", "sun.min")
            "sun.max": "sun",
            
            // Примерно, ако има "sun.haze" -> да го броим за "sun":
            "sun.haze": "sun",
            
            // ... добавете още ако ви трябват.
        ]
        
        // Ако имаме съвпадение в речника -> връщаме го.
        if let mapped = symbolMapping[cleanedSymbol] {
            return mapped
        } else {
            // Иначе - fallback "sun"
            return "sun"
        }
    }
}
