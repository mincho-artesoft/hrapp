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
                
                let locale = Locale.current
                      let calendar = Calendar.current

                      // 1. Регион
                      if let regionCode = locale.region?.identifier,
                         let regionName = locale.localizedString(forRegionCode: regionCode) {
                          GlobalState.region = "\(regionName) (\(regionCode))"
                      }

                      // 2. Календар
                      let calID = String(describing: calendar.identifier)
                      let calName = locale.localizedString(for: calendar.identifier) ?? calID
                      GlobalState.calendar = "\(calName) (\(calID))"

                      // 3. Температурна единица
                      let formatter = MeasurementFormatter()
                      formatter.locale = locale
                      formatter.unitStyle = .short
                      formatter.unitOptions = .naturalScale
                      let sample = Measurement(value: 1, unit: UnitTemperature.celsius)
                      let tempStr = formatter.string(from: sample)
                      GlobalState.temperatureUnit = tempStr.contains("°F") ? "°F" : "°C"
                      // 4. Мерна система
                
                        let temp = Measurement(value: 9, unit: UnitTemperature.celsius)
                        let formattedTemp = temp.formatted(.measurement(width: .abbreviated, usage: .person, numberFormatStyle: .number))
                        let unit = formattedTemp.firstIndex(of: "F") != nil ? UnitTemperature.fahrenheit : UnitTemperature.celsius
                        print("unit", unit)
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

                // ——— Твой код за иконите ———
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
                let iconName = "icon_\(monthName)_\(weekdayNameShort)_\(day)_\(weatherType)"

                AltIcon.setAppIcon(iconName)
                print("Не намирам \(iconName). Слагам fallback (sun).")
                let fallbackName = "icon_\(monthName)_\(weekdayNameShort)_\(day)_sun"
                AltIcon.setAppIcon(fallbackName)
                // ——————————————————————————————


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
