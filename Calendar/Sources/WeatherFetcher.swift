////
////  WeatherFetcher.swift
////  Calendar
////
////  Created by Aleksandar Svinarov on 2/4/25.
////
//
//
//import SwiftUI
//import CoreLocation
//import WeatherKit
//
///// Клас, който взима текуща локация + текущо време от Apple WeatherKit
///// и го публикува като `currentWeatherType` (String?).
//class WeatherFetcher: NSObject, ObservableObject {
//    private let locationManager = CLLocationManager()
//    private let weatherService = WeatherService()
//    
//    /// Тук ще държим "sun", "cloud", "cloud.rain" и т.н.
//    @Published var currentWeatherType: String? = nil
//    
//    override init() {
//        super.init()
//        locationManager.delegate = self
//        // Искаме локация "When in Use"
//        locationManager.requestWhenInUseAuthorization()
//        // Стартираме ъпдейти (в реално приложение може да го правите само при нужда)
//        locationManager.startUpdatingLocation()
//    }
//    
//    /// Извиква WeatherKit, за да вземе времето за подадената локация, и го записва в currentWeatherType.
//    private func fetchWeather(for location: CLLocation) {
//        Task {
//            do {
//                let weather = try await weatherService.weather(for: location)
//                
//                // Вземаме "Condition" (примерно .clear, .cloudy, .rain и т.н.)
//                let condition = weather.currentWeather.condition
//                // Мапваме към вашите иконки
//                let iconKey = mapWeatherConditionToIcon(condition)
//                
//                // Обновяваме @Published променливата -> SwiftUI ще го усети.
//                DispatchQueue.main.async {
//                    self.currentWeatherType = iconKey
//                }
//                
//            } catch {
//                print("Грешка при fetchWeather: \(error)")
//                // По желание fallback -> "sun"
//                DispatchQueue.main.async {
//                    self.currentWeatherType = "sun"
//                }
//            }
//        }
//    }
//    
//    /// Тук правим примерно преобразуване. Разширете/пипнете според нуждите.
//    private func mapWeatherConditionToIcon(_ condition: WeatherCondition) -> String {
//        switch condition {
//        case .clear, .mostlyClear, .mostlySunny, .sunny:
//            return "sun"
//        case .partlyCloudy:
//            return "cloud.sun"
//        case .cloudy, .mostlyCloudy:
//            return "cloud"
//        case .foggy, .hazy:
//            return "cloud.fog"
//        case .drizzle, .lightRain, .moderateRain:
//            return "cloud.rain"
//        case .heavyRain:
//            return "cloud.heavyrain"
//        case .isolatedThunderstorms, .scatteredThunderstorms, .thunderstorms:
//            return "cloud.bolt"       // или "cloud.bolt.rain"
//        case .snow, .heavySnow:
//            return "cloud.snow"
//        case .wintryMix:
//            return "cloud.sleet"      // ако искате sleet/hal
//        default:
//            // Някои други случаи (градушка, буря, ...)
//            return "sun" // fallback
//        }
//    }
//}
//
//// MARK: - CLLocationManagerDelegate
//extension WeatherFetcher: CLLocationManagerDelegate {
//    /// Всеки път, когато имаме ъпдейт на локацията, взимаме първата (най-прясна) и викаме fetchWeather().
//    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
//        guard let loc = locations.last else { return }
//        // Обикновено ползваме `last` като най-актуална.
//        fetchWeather(for: loc)
//    }
//    
//    /// Ако има грешка (напр. потребителят отказал да даде достъп до локация).
//    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
//        print("Грешка в locationManager: \(error)")
//        // fallback към "sun"
//        self.currentWeatherType = "sun"
//    }
//}
