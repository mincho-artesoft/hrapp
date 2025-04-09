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
    
    // За следващите 24 часа
    var precipNext24h: Double  // Общ валеж (мм)
    var rainNext24h: Double    // Дъжд (мм)
    var snowNext24h: Double    // Сняг (напр. в см или мм)
    
    // (Optional) If you want a daily maximum UV or anything else:
    var maxUV: Int
    
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
    var precipitationAmount: Double?  // Количество валеж (мм) за конкретния час
    
    // NEW: add UV Index if available in your data source
    var uvIndex: Int
}

// MARK: - WEATHERKIT VIEW MODEL
@MainActor
class WeatherKitViewModel: ObservableObject {
    // Singleton – достъпен отвсякъде ако е необходимо
    static let shared = WeatherKitViewModel()
    
    // WeatherService (общ за целия клас)
    let weatherService = WeatherService.shared

    // MARK: - Публикувани пропъртита (данни за интерфейса)
    @Published var currentTemp: Double?
    @Published var currentSymbol: String = "cloud"
    @Published var currentCondition: String = "—"
    @Published var todayMinTemp: Double?
    @Published var todayMaxTemp: Double?
    
    // Допълнителни данни (Feels Like, Humidity, и т.н.)
    @Published var currentFeelsLike: Double?
    @Published var currentHumidity: Double?
    @Published var currentWindSpeed: Double?
    @Published var currentPressure: Double?
    @Published var currentVisibility: Double?
    @Published var currentUVIndex: Int?
    
    // Още нови – ако са необходими
    @Published var currentWindGust: Double?
    @Published var currentWindDirection: Angle?
    @Published var currentDewPoint: Double?
    @Published var pressureTrend: String?
    @Published var sunriseTime: Date?
    @Published var sunsetTime: Date?
    @Published var todayPrecipitationAmount: Double?
    @Published var nextHourPrecipitationChance: Double?

    // Почасова прогноза
    @Published var next24HourlyForecast: [HourlyForecastItem] = []
    @Published var hourlyForecast: [HourlyForecastItem] = []

    // 10-дневна прогноза
    @Published var dailyForecast: [DayForecastItem] = []
    
    // Грешки/съобщения
    @Published var errorMessage: String?
    
    /// Часова зона на текущата или избрана локация.
    /// По подразбиране – системната зона (.current).
    var locationTimeZone: TimeZone = .current
    
    // MARK: - Публични методи
    
    /// Задава нова часова зона (примерно при избор на друга локация).
    func setTimeZone(_ tz: TimeZone) {
        self.locationTimeZone = tz
    }

    /// Основният метод, който изтегля данни от WeatherKit по координати.
    func fetchWeatherForCoords(latitude: Double, longitude: Double) {
        Task {
            do {
                let loc = CLLocation(latitude: latitude, longitude: longitude)
                
                // Изтегляме данните наведнъж: current, hourly и daily
                let weatherDataTuple = try await weatherService.weather(
                    for: loc,
                    including: .current, .hourly, .daily
                )
                
                let current = weatherDataTuple.0
                let hourlyForecast = weatherDataTuple.1
                let dailyForecast = weatherDataTuple.2
                
                // Обновяваме данните, използвайки получените стойности
                updateCurrentWeather(current)
                updateHourlyForecast(hourlyForecast.forecast)
                updateDailyForecast(dailyForecast.forecast)
                
                // Sunrise, sunset и валеж за днес, съобразени с избраната времева зона
                var calendar = Calendar(identifier: .gregorian)
                calendar.timeZone = locationTimeZone
                
                if let todayForecast = dailyForecast.forecast.first(where: {
                    calendar.isDateInToday($0.date)
                }) {
                    self.sunriseTime = todayForecast.sun.sunrise
                    self.sunsetTime  = todayForecast.sun.sunset
                    self.todayPrecipitationAmount = todayForecast.precipitationAmount.value
                } else {
                    self.sunriseTime = nil
                    self.sunsetTime  = nil
                    self.todayPrecipitationAmount = 0
                }
                
                // Пример: процент за валеж през следващия час
                if let nextHour = hourlyForecast.forecast.first(where: { $0.date > Date() }) {
                    self.nextHourPrecipitationChance = nextHour.precipitationChance
                } else {
                    self.nextHourPrecipitationChance = hourlyForecast.forecast.last?.precipitationChance
                }
                
                // Изчистваме евентуални стари грешки
                self.errorMessage = nil
                
            } catch {
                print("WeatherKit Error: \(error)")
                self.errorMessage = "Failed to fetch weather data. Please check your connection or try again later."
            }
        }
    }
    
    /// Нулира всички данни – например при смяна на локация.
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
    }
    
    // MARK: - Приватни методи (обновяване на данните)
    
    /// Обновява текущите метеорологични данни.
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
        
        // Обработка на тренда на налягането
        switch current.pressureTrend {
        case .falling: self.pressureTrend = "Falling"
        case .rising:  self.pressureTrend = "Rising"
        case .steady:  self.pressureTrend = "Steady"
        @unknown default:
            self.pressureTrend = nil
        }
    }
    
    /// Обновява почасовата прогноза – както за следващите 24 часа, така и цялата.
    private func updateHourlyForecast(_ hours: [HourWeather]) {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = locationTimeZone
        
        let now = Date()
        // Намираме “текущия” час, изчистен до нула секунди
        guard let truncatedNow = calendar.date(
            bySettingHour: calendar.component(.hour, from: now),
            minute: 0,
            second: 0,
            of: now
        ) else { return }
        
        // Намираме първия час с дата >= truncatedNow
        guard let startIndex = hours.firstIndex(where: { $0.date >= truncatedNow }) else {
            self.hourlyForecast = []
            self.next24HourlyForecast = []
            return
        }
        
        // Извличаме следващите 24 часа (ако има достатъчно данни)
        let endIndex = min(startIndex + 24, hours.count)
        let relevantHours = hours[startIndex..<endIndex]
        
        // Попълване на next24HourlyForecast с информация за следващите 24 часа
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
                uvIndex: hourData.uvIndex.value
            )
            tempArray.append(item)
        }
        self.next24HourlyForecast = tempArray

        // Пълната почасова прогноза
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
                uvIndex: hourData.uvIndex.value
            )
        }
    }
    
    /// Обновява 10-дневната прогноза.
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
            
            // Изчисляваме средната температура за по-точно определяне на вида валеж:
            let averageTemp = (dayData.lowTemperature.value + dayData.highTemperature.value) / 2
            let temperatureThreshold = 0.0  // Например 0°C
            let isLikelySnow = (averageTemp < temperatureThreshold) || dayData.symbolName.lowercased().contains("snow")
            
            // Общ валеж според DayWeather
            let precipitationValue = dayData.precipitationAmount.value
            
            // Филтриране на почасовите данни за съответния ден
            let forecastItemsForDay = self.hourlyForecast.filter {
                calendar.isDate($0.date, inSameDayAs: dateValue)
            }
            
            // Изчисляване на сумата за валежите през следващите 24 часа
            let totalHourlyPrecip = forecastItemsForDay.reduce(0) { sum, item in
                sum + (item.precipitationAmount ?? 0)
            }
            
            // Разделяне на валежа – дъжд и сняг – според символите
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
                // Валеж за последните 24 часа – използваме стойността от DayWeather
                precipLast24h: precipitationValue,
                rainLast24h: isLikelySnow ? 0 : precipitationValue,
                snowLast24h: isLikelySnow ? precipitationValue : 0,
                // Валеж за следващите 24 часа – суми от почасовата прогноза
                precipNext24h: totalHourlyPrecip,
                rainNext24h: totalHourlyRain,
                snowNext24h: totalHourlySnow,
                maxUV: dayData.uvIndex.value
            )
            arr.append(item)
        }
        self.dailyForecast = arr
        
        // Настройване на днешните минимална и максимална температура
        if let firstDay = arr.first, calendar.isDateInToday(firstDay.date) {
            self.todayMinTemp = firstDay.minTemp
            self.todayMaxTemp = firstDay.maxTemp
        } else {
            self.todayMinTemp = days.first?.lowTemperature.value
            self.todayMaxTemp = days.first?.highTemperature.value
        }
    }

    // MARK: - Помощни функции за форматиране (24-часов формат)
    
    /// Връща "HH" (24ч) от дата, напр. "00", "13", "22"...
    private func hourString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH"
        formatter.timeZone = locationTimeZone
        return formatter.string(from: date)
    }
    
    /// Връща съкратено име на ден от седмицата (Mon, Tue, Wed...) според избраната времева зона.
    private func weekdayString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "E"
        formatter.timeZone = locationTimeZone
        return formatter.string(from: date)
    }
    
    /// Форматира дата (часове/минути) според избраната времева зона, напр. "14:05".
    func formatTime(_ date: Date?) -> String {
        guard let date = date else { return "--:--" }
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        formatter.timeZone = locationTimeZone
        return formatter.string(from: date)
    }
    
    // MARK: - Примерни помощни методи за UI (UV, вятър и т.н.)
    
    /// Връща описание и цвят за даден UV индекс.
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
    
    /// Преобразува ъгъл (Angle) във векторна посока (N, NE, E, SE...).
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
