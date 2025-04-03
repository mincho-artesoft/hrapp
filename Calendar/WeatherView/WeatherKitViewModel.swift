import Combine
import MapKit
import CoreLocation
@preconcurrency import WeatherKit

@MainActor
class WeatherKitViewModel: ObservableObject {
    private let weatherService = WeatherService.shared
    
    // Текущо
    @Published var currentTemp: Double?
    @Published var currentSymbol: String = "cloud"
    @Published var currentCondition: String = "—"
    @Published var todayMinTemp: Double?
    @Published var todayMaxTemp: Double?
    
    // Доп. данни (Feels Like, Humidity, etc.)
    @Published var currentFeelsLike: Double?
    @Published var currentHumidity: Double?
    @Published var currentWindSpeed: Double?
    @Published var currentPressure: Double?
    @Published var currentVisibility: Double?
    @Published var currentUVIndex: Int?
    
    // Почасова (24 часа)
    @Published var hourlyForecast: [(hour: String, temp: Double, symbol: String)] = []
    
    // 10-дневна
    @Published var dailyForecast: [
        (day: String,
         minTemp: Double,
         maxTemp: Double,
         symbol: String,
         precipChance: Double?)
    ] = []
    
    @Published var errorMessage: String?
    
    func fetchWeatherForCoords(latitude: Double, longitude: Double) {
        Task {
            do {
                let loc = CLLocation(latitude: latitude, longitude: longitude)
                let weather = try await weatherService.weather(for: loc)
                
                updateCurrentWeather(weather.currentWeather)
                updateHourlyForecast(weather.hourlyForecast.forecast)
                updateDailyForecast(weather.dailyForecast.forecast)
                
                self.errorMessage = nil
            } catch {
                self.errorMessage = "Грешка при заявката: \(error.localizedDescription)"
            }
        }
    }
    
    private func updateCurrentWeather(_ current: CurrentWeather) {
        self.currentTemp = current.temperature.value
        self.currentSymbol = current.symbolName
        self.currentCondition = current.condition.description
        
        self.currentFeelsLike  = current.apparentTemperature.value
        self.currentHumidity   = current.humidity
        self.currentWindSpeed  = current.wind.speed.value
        self.currentPressure   = current.pressure.value
        self.currentVisibility = current.visibility.value
        self.currentUVIndex    = current.uvIndex.value
    }
    
    private func updateHourlyForecast(_ hours: [HourWeather]) {
        let now = Date()
        guard let startIndex = hours.firstIndex(where: { $0.date >= now }) else {
            self.hourlyForecast = []
            return
        }
        let endIndex = min(startIndex + 24, hours.count)
        let slice = hours[startIndex..<endIndex]
        
        var tempArray: [(String, Double, String)] = []
        for (i, hourData) in slice.enumerated() {
            let label = (i == 0) ? "Now" : hourString(from: hourData.date)
            tempArray.append((label, hourData.temperature.value, hourData.symbolName))
        }
        self.hourlyForecast = tempArray
    }
    
    private func updateDailyForecast(_ days: [DayWeather]) {
        let count = min(days.count, 10)
        let slice = days.prefix(count)
        
        var arr: [
            (String, Double, Double, String, Double?)
        ] = []
        
        for (i, dayData) in slice.enumerated() {
            let dayName = (i == 0) ? "Today" : weekdayString(from: dayData.date)
            let minT = dayData.lowTemperature.value
            let maxT = dayData.highTemperature.value
            let symbol = dayData.symbolName
            let chance = dayData.precipitationChance
            
            arr.append((dayName, minT, maxT, symbol, chance))
        }
        self.dailyForecast = arr
        
        if let firstDay = days.first {
            self.todayMinTemp = firstDay.lowTemperature.value
            self.todayMaxTemp = firstDay.highTemperature.value
        }
    }
    
    private func hourString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "h a"
        return formatter.string(from: date)
    }
    
    private func weekdayString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "E"
        return formatter.string(from: date)
    }
}
