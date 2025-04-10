import SwiftUI
import Combine
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - Структури за почасова (Hourly) и дневна (Daily) прогноза
struct DayForecastItem: Identifiable, Equatable {
    let id: Date
    var date: Date
    var day: String
    var symbol: String
    var precipChance: Double?
    var minTemp: Double
    var maxTemp: Double
    
    // За последните 24 часа
    var precipLast24h: Double   // Общ валеж (мм)
    var rainLast24h: Double     // Дъжд (мм)
    var snowLast24h: Double     // Сняг (напр. в см или мм)
    
    var precipitationAmount : Double
    var reinAmount : Double
    var snowfallAmount: Double

    // За следващите 24 часа
    var precipNext24h: Double  // Общ валеж (мм)
    var rainNext24h: Double    // Дъжд (мм)
    var snowNext24h: Double    // Сняг (напр. в см или мм)
    
    // (Optional) If you want a daily maximum UV or anything else:
    var maxUV: Int
    
    
    var maxWindSpeed: Double  // e.g. the day’s highest wind speed (km/h)
    var maxWindGust: Double  // day’s max wind gust (km/h), optional
    var predominantWindDirection: Double // e.g.  in degrees (0–360)
    
    var humidityMin: Double
    var humidityMax: Double

    var visibilityMin: Double
    var visibilityMax: Double

    static func == (lhs: DayForecastItem, rhs: DayForecastItem) -> Bool {
        lhs.id == rhs.id
    }
}

struct HourlyForecastItem: Identifiable {
    let id: Date
    var date: Date
    var hour: String
    var temp: Double
    var feelsLikeTemp: Double
    var symbol: String
    var precipChance: Double          // Шанс за валеж (0...1)
    var precipitationAmount: Double  // Количество валеж (мм) за конкретния час
    var snowfallAmount: Double
    // NEW: add UV Index if available in your data source
    var uvIndex: Int
    
    var windSpeed: Double       // in km/h
    var windGust: Double       // in km/h
    var windDirection: Double  // degrees 0–360 (N=0°, E=90°, S=180°, W=270°, etc.)
    
    var humidity: Double
    
    var visibility: Double
    
    var pressure: Double

}

@MainActor
class WeatherKitViewModel: ObservableObject {
    // Singleton – достъпен отвсякъде ако е необходимо
    static let shared = WeatherKitViewModel()
    
    let weatherService = WeatherService.shared

    // MARK: - Публикувани променливи за текущото време
    @Published var currentTemp: Double?
    @Published var currentSymbol: String = "cloud"
    @Published var currentCondition: String = "—"
    @Published var currentFeelsLike: Double?
    @Published var currentHumidity: Double?
    @Published var currentPressure: Double?
    @Published var currentVisibility: Double?
    @Published var currentUVIndex: Int?
    @Published var currentWindSpeed: Double?
    @Published var currentWindGust: Double?
    @Published var currentWindDirection: Angle?
    @Published var currentDewPoint: Double?
    @Published var pressureTrend: String?
    
    // Допълнителни променливи – разширяване за възможно предоставени данни от WeatherKit
    @Published var currentPrecipitationAmount: Double?       // Например: мм валеж в текущия момент
    @Published var currentPrecipitationProbability: Double?   // Шанс за валеж (напр. 0...1)
    @Published var currentCloudCover: Double?                 // Процент или доля на облачност
    // Можете да добавите още, ако API-то предоставя други параметри, напр. скорост на дъждовния поток, тип валеж и т.н.
    
    // Дадени за изгледа/прогнозите
    @Published var todayMinTemp: Double?
    @Published var todayMaxTemp: Double?
    @Published var sunriseTime: Date?
    @Published var sunsetTime: Date?
    @Published var todayPrecipitationAmount: Double?
    @Published var nextHourPrecipitationChance: Double?
    
    @Published var next24HourlyForecast: [HourlyForecastItem] = []
    @Published var hourlyForecast: [HourlyForecastItem] = []
    @Published var dailyForecast: [DayForecastItem] = []
    
    @Published var errorMessage: String?
    
    var locationTimeZone: TimeZone = .current

    // MARK: - Публични методи
    func setTimeZone(_ tz: TimeZone) {
        self.locationTimeZone = tz
    }
    
    func fetchWeatherForCoords(latitude: Double, longitude: Double) {
        Task {
            do {
                let loc = CLLocation(latitude: latitude, longitude: longitude)
                let weatherDataTuple = try await weatherService.weather(
                    for: loc,
                    including: .current, .hourly, .daily
                )
                let current = weatherDataTuple.0
                let hourlyForecast = weatherDataTuple.1
                let dailyForecast = weatherDataTuple.2
                
                updateCurrentWeather(current)
                updateHourlyForecast(hourlyForecast.forecast)
                updateDailyForecast(dailyForecast.forecast)
                
                var calendar = Calendar(identifier: .gregorian)
                calendar.timeZone = locationTimeZone
                
                if let todayForecast = dailyForecast.forecast.first(where: { calendar.isDateInToday($0.date) }) {
                    self.sunriseTime = todayForecast.sun.sunrise
                    self.sunsetTime  = todayForecast.sun.sunset
                    self.todayPrecipitationAmount = todayForecast.precipitationAmount.value
                } else {
                    self.sunriseTime = nil
                    self.sunsetTime  = nil
                    self.todayPrecipitationAmount = 0
                }
                
                if let nextHour = hourlyForecast.forecast.first(where: { $0.date > Date() }) {
                    self.nextHourPrecipitationChance = nextHour.precipitationChance
                } else {
                    self.nextHourPrecipitationChance = hourlyForecast.forecast.last?.precipitationChance
                }
                
                self.errorMessage = nil
                
            } catch {
                print("WeatherKit Error: \(error)")
                self.errorMessage = "Failed to fetch weather data. Please check your connection or try again later."
            }
        }
    }
    
    func clearWeatherData() {
        currentTemp = nil
        currentSymbol = "cloud"
        currentCondition = "—"
        todayMinTemp = nil
        todayMaxTemp = nil
        currentFeelsLike = nil
        currentHumidity = nil
        currentWindSpeed = nil
        currentPressure = nil
        currentVisibility = nil
        currentUVIndex = nil
        currentWindGust = nil
        currentWindDirection = nil
        currentDewPoint = nil
        pressureTrend = nil
        sunriseTime = nil
        sunsetTime = nil
        todayPrecipitationAmount = nil
        nextHourPrecipitationChance = nil
        hourlyForecast = []
        next24HourlyForecast = []
        dailyForecast = []
        errorMessage = nil
        
        // Допълнителни променливи също могат да се нулират
        currentPrecipitationAmount = nil
        currentPrecipitationProbability = nil
        currentCloudCover = nil
    }
    
    // MARK: - Приватни методи за обновяване на данните
    
    private func updateCurrentWeather(_ current: CurrentWeather) {
        self.currentTemp      = current.temperature.value
        self.currentSymbol    = current.symbolName
        self.currentCondition = current.condition.description
        self.currentFeelsLike = current.apparentTemperature.value
        self.currentHumidity  = current.humidity
        self.currentPressure  = current.pressure.value
        self.currentVisibility = current.visibility.value
        self.currentUVIndex   = current.uvIndex.value
        
        // Преобразуване на вятърната скорост в км/ч
        let windSpeedKmh = current.wind.speed.converted(to: .kilometersPerHour).value
        self.currentWindSpeed = windSpeedKmh
        
        if let gust = current.wind.gust {
            self.currentWindGust = gust.converted(to: .kilometersPerHour).value
        } else {
            self.currentWindGust = nil
        }
        
        self.currentWindDirection = Angle(degrees: current.wind.direction.value)
        self.currentDewPoint = current.dewPoint.value
        
        switch current.pressureTrend {
        case .falling: self.pressureTrend = "Falling"
        case .rising:  self.pressureTrend = "Rising"
        case .steady:  self.pressureTrend = "Steady"
        @unknown default:
            self.pressureTrend = "Unknown"
        }
    }
    
    private func updateHourlyForecast(_ hours: [HourWeather]) {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = locationTimeZone
        
        let now = Date()
        guard let truncatedNow = calendar.date(
            bySettingHour: calendar.component(.hour, from: now),
            minute: 0,
            second: 0,
            of: now
        ) else { return }
        
        guard let startIndex = hours.firstIndex(where: { $0.date >= truncatedNow }) else {
            self.hourlyForecast = []
            self.next24HourlyForecast = []
            return
        }
        
        let endIndex = min(startIndex + 24, hours.count)
        let relevantHours = hours[startIndex..<endIndex]
        
        var tempArray: [HourlyForecastItem] = []
        for (i, hourData) in relevantHours.enumerated() {
            let label = (i == 0) ? "Now" : hourString(from: hourData.date)
            
            let item = HourlyForecastItem(
                id: hourData.date,
                date: hourData.date,
                hour: label,
                temp: hourData.temperature.value,
                feelsLikeTemp: hourData.apparentTemperature.value,
                symbol: hourData.symbolName,
                precipChance: hourData.precipitationChance,
                precipitationAmount: hourData.precipitationAmount.value,
                snowfallAmount: hourData.snowfallAmount.value,
                uvIndex: hourData.uvIndex.value,
                windSpeed: hourData.wind.speed.value,
                windGust: hourData.wind.gust!.value,
                windDirection: hourData.wind.direction.converted(to: .degrees).value,
                humidity: hourData.humidity,
                visibility: hourData.visibility.value / 1000,
                pressure: hourData.pressure.value
            )
            tempArray.append(item)
        }
        self.next24HourlyForecast = tempArray
        
        self.hourlyForecast = hours.map { hourData in
            HourlyForecastItem(
                id: hourData.date,
                date: hourData.date,
                hour: hourString(from: hourData.date),
                temp: hourData.temperature.value,
                feelsLikeTemp: hourData.apparentTemperature.value,
                symbol: hourData.symbolName,
                precipChance: hourData.precipitationChance,
                precipitationAmount: hourData.precipitationAmount.value,
                snowfallAmount: hourData.snowfallAmount.value,
                uvIndex: hourData.uvIndex.value,
                windSpeed: hourData.wind.speed.value,
                windGust: hourData.wind.gust!.value,
                windDirection: hourData.wind.direction.converted(to: .degrees).value,
                humidity: hourData.humidity,
                visibility: hourData.visibility.value / 1000,
                pressure: hourData.pressure.value
            )
        }
    }
    
    private func updateDailyForecast(_ days: [DayWeather]) {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = locationTimeZone
        
        let count = min(days.count, 10)
        let relevantDays = days.prefix(count)
        
        var arr: [DayForecastItem] = []
        for dayData in relevantDays {
            let dateValue = dayData.date
            let isToday = calendar.isDateInToday(dateValue)
            let dayName = isToday ? "Today" : weekdayString(from: dateValue)
            
            let averageTemp = (dayData.lowTemperature.value + dayData.highTemperature.value) / 2
            let temperatureThreshold = 0.0
            let isLikelySnow = (averageTemp < temperatureThreshold) || dayData.symbolName.lowercased().contains("snow")
            
            let precipitationValue = dayData.precipitationAmount.value
            
            let forecastItemsForDay = self.hourlyForecast.filter {
                calendar.isDate($0.date, inSameDayAs: dateValue)
            }
            
            let totalHourlyPrecip = forecastItemsForDay.reduce(0) { sum, item in
                sum + (item.precipitationAmount ?? 0)
            }
            
            let totalHourlyRain = forecastItemsForDay.reduce(0) { sum, item in
                let isLikelySnowHourly = item.symbol.lowercased().contains("snow")
                return isLikelySnowHourly ? sum : sum + (item.precipitationAmount ?? 0)
            }
            let totalHourlySnow = forecastItemsForDay.reduce(0) { sum, item in
                let isLikelySnowHourly = item.symbol.lowercased().contains("snow")
                return isLikelySnowHourly ? sum + (item.precipitationAmount ?? 0) : sum
            }
            
            let item = DayForecastItem(
                id: dateValue,
                date: dateValue,
                day: dayName,
                symbol: dayData.symbolName,
                precipChance: dayData.precipitationChance,
                minTemp: dayData.lowTemperature.value,
                maxTemp: dayData.highTemperature.value,
                precipLast24h: precipitationValue,
                rainLast24h: isLikelySnow ? 0 : precipitationValue,
                snowLast24h: isLikelySnow ? precipitationValue : 0,
                precipitationAmount: dayData.precipitationAmount.value,
                reinAmount: dayData.rainfallAmount.value,
                snowfallAmount: dayData.snowfallAmount.value,
                precipNext24h: totalHourlyPrecip,
                rainNext24h: totalHourlyRain,
                snowNext24h: totalHourlySnow,
                maxUV: dayData.uvIndex.value,
                maxWindSpeed: dayData.highWindSpeed!.value,
                maxWindGust: dayData.wind.gust?.value ?? 0,
                predominantWindDirection: dayData.wind.direction.converted(to: .degrees).value,
                humidityMin: dayData.minimumHumidity,
                humidityMax: dayData.maximumHumidity,
                visibilityMin: dayData.minimumVisibility / 1000,
                visibilityMax: dayData.maximumVisibility / 1000
            )
            arr.append(item)
        }
        self.dailyForecast = arr
        
        if let firstDay = arr.first, calendar.isDateInToday(firstDay.date) {
            self.todayMinTemp = firstDay.minTemp
            self.todayMaxTemp = firstDay.maxTemp
        } else {
            self.todayMinTemp = days.first?.lowTemperature.value
            self.todayMaxTemp = days.first?.highTemperature.value
        }
    }
    
    // MARK: - Помощни функции за форматиране
    
    private func hourString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH"
        formatter.timeZone = locationTimeZone
        return formatter.string(from: date)
    }
    
    private func weekdayString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "E"
        formatter.timeZone = locationTimeZone
        return formatter.string(from: date)
    }
    
    func formatTime(_ date: Date?) -> String {
        guard let date = date else { return "--:--" }
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        formatter.timeZone = locationTimeZone
        return formatter.string(from: date)
    }
    
    func uvCategory(for index: Int?) -> (description: String, color: Color) {
        guard let index = index else { return ("Unknown", .gray) }
        switch index {
        case 0...2: return ("Low", .green)
        case 3...5: return ("Moderate", .yellow)
        case 6...7: return ("High", .orange)
        case 8...10: return ("Very High", .red)
        case 11...: return ("Extreme", .purple)
        default:    return ("Unknown", .gray)
        }
    }
    
    func windDirectionAbbreviation(for angle: Angle?) -> String {
        guard let angle = angle else { return "---" }
        let deg = angle.degrees.truncatingRemainder(dividingBy:360)
                     .advanced(by: angle.degrees < 0 ? 360 : 0)
        let idx = Int(((deg + 11.25).truncatingRemainder(dividingBy:360) / 22.5).rounded()) % 16
        let directions = [
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
        ]
        return directions[idx]
    }
}
