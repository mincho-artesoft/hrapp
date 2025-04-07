import SwiftUI
import Combine
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - Структура за ден от прогнозата
struct DayForecastItem: Identifiable, Equatable {
    let id: Date
    var date: Date
    var day: String
    var symbol: String
    var precipChance: Double?
    var minTemp: Double
    var maxTemp: Double

    static func == (lhs: DayForecastItem, rhs: DayForecastItem) -> Bool {
        lhs.id == rhs.id
    }
}

// MARK: - Структура за час от прогнозата
struct HourlyForecastItem: Identifiable {
    let id: Date
    var date: Date
    var hour: String
    var temp: Double
    var feelsLikeTemp: Double
    var symbol: String
}

// MARK: - WEATHERKIT VIEW MODEL
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
    // --- NEW:
    @Published var currentWindGust: Double?
    @Published var currentWindDirection: Angle?
    @Published var currentDewPoint: Double?
    @Published var pressureTrend: String?
    @Published var sunriseTime: Date?
    @Published var sunsetTime: Date?
    @Published var todayPrecipitationAmount: Double?
    @Published var nextHourPrecipitationChance: Double?
    // ---

    // Почасова
    @Published var hourlyForecast: [HourlyForecastItem] = []
    
    // 10-дневна
    @Published var dailyForecast: [DayForecastItem] = []
    
    @Published var errorMessage: String?

    func fetchWeatherForCoords(latitude: Double, longitude: Double) {
        Task {
            do {
                let loc = CLLocation(latitude: latitude, longitude: longitude)
                
                // Всички datasets
                let weatherDataTuple = try await weatherService.weather(
                    for: loc,
                    including: .current, .hourly, .daily
                )
                
                let current = weatherDataTuple.0
                let hourlyForecast = weatherDataTuple.1
                let dailyForecast = weatherDataTuple.2
                
                // Обновяваме
                updateCurrentWeather(current)
                updateHourlyForecast(hourlyForecast.forecast)
                updateDailyForecast(dailyForecast.forecast)
                
                // Sunrise/sunset/valеж за днес
                if let todayForecast = dailyForecast.forecast.first(where: {
                    Calendar.current.isDateInToday($0.date)
                }) {
                    self.sunriseTime = todayForecast.sun.sunrise
                    self.sunsetTime  = todayForecast.sun.sunset
                    self.todayPrecipitationAmount = todayForecast.precipitationAmount.value
                } else {
                    self.sunriseTime = nil
                    self.sunsetTime  = nil
                    self.todayPrecipitationAmount = 0
                }
                
                // Next hour precip
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
        dailyForecast = []
        errorMessage = nil
    }
    
    private func updateCurrentWeather(_ current: CurrentWeather) {
        self.currentTemp     = current.temperature.value
        self.currentSymbol   = current.symbolName
        self.currentCondition = current.condition.description
        self.currentFeelsLike = current.apparentTemperature.value
        self.currentHumidity  = current.humidity
        self.currentPressure  = current.pressure.value
        self.currentVisibility = current.visibility.value
        self.currentUVIndex   = current.uvIndex.value
        
        // Конвертираме wind speed/gust в km/h
        let windSpeedKmh = current.wind.speed.converted(to: .kilometersPerHour).value
        self.currentWindSpeed = windSpeedKmh
        
        if let gust = current.wind.gust {
            self.currentWindGust = gust.converted(to:.kilometersPerHour).value
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
            self.pressureTrend = nil
        }
    }
    
    // Премахваме 24-часово ограничение!
    private func updateHourlyForecast(_ hours: [HourWeather]) {
        // Преди: само 24 часа
        // Сега: всички
        let relevantHours = hours
        
        var tempArray: [HourlyForecastItem] = []
        for (i, hourData) in relevantHours.enumerated() {
            // Надпис на часа
            let label = hourString(from: hourData.date)
            
            let item = HourlyForecastItem(
                id: hourData.date,
                date: hourData.date,
                hour: label,
                temp: hourData.temperature.value,
                feelsLikeTemp: hourData.apparentTemperature.value,
                symbol: hourData.symbolName
            )
            tempArray.append(item)
        }
        self.hourlyForecast = tempArray
    }
    
    private func updateDailyForecast(_ days: [DayWeather]) {
        let count = min(days.count, 10)
        let relevantDays = days.prefix(count)
        
        var arr: [DayForecastItem] = []
        for dayData in relevantDays {
            let dayName = Calendar.current.isDateInToday(dayData.date)
                          ? "Today"
                          : weekdayString(from: dayData.date)
            let minT = dayData.lowTemperature.value
            let maxT = dayData.highTemperature.value
            let symbol = dayData.symbolName
            let chance = dayData.precipitationChance
            let dateValue = dayData.date
            
            let item = DayForecastItem(
                id: dateValue,
                date: dateValue,
                day: dayName,
                symbol: symbol,
                precipChance: chance,
                minTemp: minT,
                maxTemp: maxT
            )
            arr.append(item)
        }
        self.dailyForecast = arr
        
        // Ако първият е "днес"
        if let firstDay = arr.first,
           Calendar.current.isDateInToday(firstDay.date) {
            self.todayMinTemp = firstDay.minTemp
            self.todayMaxTemp = firstDay.maxTemp
        } else {
            self.todayMinTemp = days.first?.lowTemperature.value
            self.todayMaxTemp = days.first?.highTemperature.value
        }
    }
    
    // Формат на часа (3PM)
    private func hourString(from date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "ha"
        f.amSymbol = "AM"
        f.pmSymbol = "PM"
        return f.string(from: date)
    }
    
    private func weekdayString(from date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "E" // e.g. Mon
        return f.string(from: date)
    }
    
    func formatTime(_ date: Date?) -> String {
        guard let date = date else { return "--:--" }
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
    
    func uvCategory(for index: Int?) -> (description: String, color: Color) {
        guard let index = index else { return ("Unknown", .gray) }
        switch index {
        case 0...2: return ("Low", .green)
        case 3...5: return ("Moderate", .yellow)
        case 6...7: return ("High", .orange)
        case 8...10:return ("Very High", .red)
        case 11...: return ("Extreme", .purple)
        default:    return ("Unknown", .gray)
        }
    }
    
    func windDirectionAbbreviation(for angle:Angle?) -> String {
        guard let angle = angle else { return "---" }
        let deg = angle.degrees.truncatingRemainder(dividingBy:360)
                     .advanced(by: angle.degrees<0 ? 360:0)
        let idx = Int(((deg+11.25).truncatingRemainder(dividingBy:360)/22.5).rounded())%16
        let directions = [
            "N","NNE","NE","ENE","E","ESE","SE","SSE",
            "S","SSW","SW","WSW","W","WNW","NW","NNW"
        ]
        return directions[idx]
    }
}
