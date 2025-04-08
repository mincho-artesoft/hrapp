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
}

// MARK: - WEATHERKIT VIEW MODEL
@MainActor
class WeatherKitViewModel: ObservableObject {
    // Singleton, ако искате да го достъпвате отвсякъде
    static let shared = WeatherKitViewModel()
    
    // WeatherService (общ за целия клас)
    let weatherService = WeatherService.shared

    // MARK: - Публикувани пропъртита (данни за интерфейса)
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
    
    // Още нови: (ако ви трябват)
    @Published var currentWindGust: Double?
    @Published var currentWindDirection: Angle?
    @Published var currentDewPoint: Double?
    @Published var pressureTrend: String?
    @Published var sunriseTime: Date?
    @Published var sunsetTime: Date?
    @Published var todayPrecipitationAmount: Double?
    @Published var nextHourPrecipitationChance: Double?

    // Почасова
    @Published var next24HourlyForecast: [HourlyForecastItem] = []
    @Published var hourlyForecast: [HourlyForecastItem] = []

    // 10-дневна
    @Published var dailyForecast: [DayForecastItem] = []
    
    // Грешки/съобщения
    @Published var errorMessage: String?
    
    /// Часова зона на текущата или избрана локация.
    /// По подразбиране – системната зона (`.current`).
    var locationTimeZone: TimeZone = .current
    
    // MARK: - Публични методи
    
    /// Задаваме нова часова зона (примерно при избрана друга локация).
    func setTimeZone(_ tz: TimeZone) {
        self.locationTimeZone = tz
    }

    /// Основният метод, който изтегля времето от WeatherKit по координати.
    func fetchWeatherForCoords(latitude: Double, longitude: Double) {
        Task {
            do {
                let loc = CLLocation(latitude: latitude, longitude: longitude)
                
                // Еднократно поискаме всички нужни данни: current + hourly + daily
                let weatherDataTuple = try await weatherService.weather(
                    for: loc,
                    including: .current, .hourly, .daily
                )
                
                let current = weatherDataTuple.0
                let hourlyForecast = weatherDataTuple.1
                let dailyForecast = weatherDataTuple.2
                
                // Обновяваме нашите пропъртита с получените данни
                updateCurrentWeather(current)
                updateHourlyForecast(hourlyForecast.forecast)
                updateDailyForecast(dailyForecast.forecast)
                
                // Sunrise/sunset/валеж за днес (използваме Calendar с избраната TZ)
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
                
                // Пример: процент за валеж в следващия час
                if let nextHour = hourlyForecast.forecast.first(where: { $0.date > Date() }) {
                    self.nextHourPrecipitationChance = nextHour.precipitationChance
                } else {
                    self.nextHourPrecipitationChance = hourlyForecast.forecast.last?.precipitationChance
                }
                
                // Изчистваме евентуална стара грешка, ако имаше
                self.errorMessage = nil
                
            } catch {
                print("WeatherKit Error: \(error)")
                self.errorMessage = "Failed to fetch weather data. Please check your connection or try again later."
            }
        }
    }
    
    /// Ако искате да нулирате всички данни (например при смяна на локация).
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
    
    // MARK: - Приватни методи (update логика)
    
    /// Обновява текущите стойности (current weather).
    private func updateCurrentWeather(_ current: CurrentWeather) {
        self.currentTemp      = current.temperature.value
        self.currentSymbol    = current.symbolName
        self.currentCondition = current.condition.description
        self.currentFeelsLike = current.apparentTemperature.value
        self.currentHumidity  = current.humidity
        self.currentPressure  = current.pressure.value
        self.currentVisibility = current.visibility.value
        self.currentUVIndex   = current.uvIndex.value
        
        // Преобразуваме в km/h
        let windSpeedKmh = current.wind.speed.converted(to: .kilometersPerHour).value
        self.currentWindSpeed = windSpeedKmh
        
        if let gust = current.wind.gust {
            self.currentWindGust = gust.converted(to: .kilometersPerHour).value
        } else {
            self.currentWindGust = nil
        }
        
        self.currentWindDirection = Angle(degrees: current.wind.direction.value)
        self.currentDewPoint = current.dewPoint.value
        
        // Pressure trend (Optional)
        switch current.pressureTrend {
        case .falling: self.pressureTrend = "Falling"
        case .rising:  self.pressureTrend = "Rising"
        case .steady:  self.pressureTrend = "Steady"
        @unknown default:
            self.pressureTrend = nil
        }
    }
    
    /// Обновява почасовата прогноза (hourlyForecast и next24HourlyForecast).
    private func updateHourlyForecast(_ hours: [HourWeather]) {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = locationTimeZone
        
        let now = Date()
        // Намираме "текущия" час (изчистен до h:00:00)
        guard let truncatedNow = calendar.date(
            bySettingHour: calendar.component(.hour, from: now),
            minute: 0,
            second: 0,
            of: now
        ) else { return }
        
        // Търсим първия час, чиято дата >= truncatedNow
        guard let startIndex = hours.firstIndex(where: { $0.date >= truncatedNow }) else {
            // Ако не намерим нищо, зануляваме
            self.hourlyForecast = []
            self.next24HourlyForecast = []
            return
        }
        
        // Вземаме 24 часа занапред (ако има толкова)
        let endIndex = min(startIndex + 24, hours.count)
        let relevantHours = hours[startIndex..<endIndex]
        
        // Попълваме next24HourlyForecast (само следващите 24ч)
        var tempArray: [HourlyForecastItem] = []
        for (i, hourData) in relevantHours.enumerated() {
            // Можете да замените "Now" с "Сега" или директно да покажете "HH"
            let label = (i == 0) ? "Now" : hourString(from: hourData.date)
            
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
        self.next24HourlyForecast = tempArray

        // Пълната почасова прогноза (ако ви е нужна)
        self.hourlyForecast = hours.map { hourData in
            HourlyForecastItem(
                id: hourData.date,
                date: hourData.date,
                hour: hourString(from: hourData.date),
                temp: hourData.temperature.value,
                feelsLikeTemp: hourData.apparentTemperature.value,
                symbol: hourData.symbolName
            )
        }
    }
    
    /// Обновява 10-дневната прогноза (dailyForecast).
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
            
            let item = DayForecastItem(
                id: dateValue,
                date: dateValue,
                day: dayName,
                symbol: dayData.symbolName,
                precipChance: dayData.precipitationChance,
                minTemp: dayData.lowTemperature.value,
                maxTemp: dayData.highTemperature.value
            )
            arr.append(item)
        }
        self.dailyForecast = arr
        
        // Определяме today's min/max (ако първият е "днес")
        if let firstDay = arr.first,
           calendar.isDateInToday(firstDay.date) {
            self.todayMinTemp = firstDay.minTemp
            self.todayMaxTemp = firstDay.maxTemp
        } else {
            // Ако по някаква причина не го намерим,
            // вземаме първия елемент от days (ако има)
            self.todayMinTemp = days.first?.lowTemperature.value
            self.todayMaxTemp = days.first?.highTemperature.value
        }
    }
    
    // MARK: - Помощни функции за форматиране (24-часов формат)
    
    /// Връща "HH" (24ч) от дадена дата, напр. "00", "13", "22"...
    private func hourString(from date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "HH"  // 24-часов формат (може "HH:mm" при нужда)
        f.timeZone = locationTimeZone
        return f.string(from: date)
    }
    
    /// Връща съкратен ден от седмицата (Mon, Tue...) според локационната TZ.
    private func weekdayString(from date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "E" // Mon, Tue, Wed...
        f.timeZone = locationTimeZone
        return f.string(from: date)
    }
    
    /// Форматира Date (часове/минути), примерно "14:05", спрямо зададена TZ.
    func formatTime(_ date: Date?) -> String {
        guard let date = date else { return "--:--" }
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        formatter.timeZone = locationTimeZone
        return formatter.string(from: date)
    }
    
    // MARK: - Примерни помощни методи за UI (UV, вятър и т.н.)
    
    /// Например, за да дадете цвят/описание за UV индекса.
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
        let idx = Int(((deg+11.25).truncatingRemainder(dividingBy:360)/22.5).rounded()) % 16
        let directions = [
            "N","NNE","NE","ENE","E","ESE","SE","SSE",
            "S","SSW","SW","WSW","W","WNW","NW","NNW"
        ]
        return directions[idx]
    }
}
