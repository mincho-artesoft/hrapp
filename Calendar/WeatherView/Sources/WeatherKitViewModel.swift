import SwiftUI
import Combine
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - Структури за почасова (Hourly) и дневна (Daily) прогноза

public struct DayForecastItem: Identifiable, Equatable {
    public let id: Date
    public var date: Date
    public var day: String
    public var symbol: String
    public var precipChance: Double?
    public var minTemp: Double
    public var maxTemp: Double

    // За последните 24 часа
    public var precipLast24h: Double   // Общ валеж (мм)
    public var rainLast24h: Double     // Дъжд (мм)
    public var snowLast24h: Double     // Сняг (мм)

    public var precipitationAmount: Double
    public var reinAmount: Double
    public var snowfallAmount: Double

    // За следващите 24 часа
    public var precipNext24h: Double   // Общ валеж (мм)
    public var rainNext24h: Double     // Дъжд (мм)
    public var snowNext24h: Double     // Сняг (мм)

    public var maxUV: Int
    public var maxWindSpeed: Double      // км/ч
    public var maxWindGust: Double       // км/ч
    public var predominantWindDirection: Double  // градуси 0–360

    public var humidityMin: Double
    public var humidityMax: Double

    public var visibilityMin: Double
    public var visibilityMax: Double

    public var moon: MoonEvents?

    public init(id: Date,
                date: Date,
                day: String,
                symbol: String,
                precipChance: Double?,
                minTemp: Double,
                maxTemp: Double,
                precipLast24h: Double,
                rainLast24h: Double,
                snowLast24h: Double,
                precipitationAmount: Double,
                reinAmount: Double,
                snowfallAmount: Double,
                precipNext24h: Double,
                rainNext24h: Double,
                snowNext24h: Double,
                maxUV: Int,
                maxWindSpeed: Double,
                maxWindGust: Double,
                predominantWindDirection: Double,
                humidityMin: Double,
                humidityMax: Double,
                visibilityMin: Double,
                visibilityMax: Double,
                moon: MoonEvents?) {
        self.id = id
        self.date = date
        self.day = day
        self.symbol = symbol
        self.precipChance = precipChance
        self.minTemp = minTemp
        self.maxTemp = maxTemp
        self.precipLast24h = precipLast24h
        self.rainLast24h = rainLast24h
        self.snowLast24h = snowLast24h
        self.precipitationAmount = precipitationAmount
        self.reinAmount = reinAmount
        self.snowfallAmount = snowfallAmount
        self.precipNext24h = precipNext24h
        self.rainNext24h = rainNext24h
        self.snowNext24h = snowNext24h
        self.maxUV = maxUV
        self.maxWindSpeed = maxWindSpeed
        self.maxWindGust = maxWindGust
        self.predominantWindDirection = predominantWindDirection
        self.humidityMin = humidityMin
        self.humidityMax = humidityMax
        self.visibilityMin = visibilityMin
        self.visibilityMax = visibilityMax
        self.moon = moon
    }
}

struct HourlyForecastItem: Identifiable {
    let id: Date
    var date: Date
    var hour: String
    var temp: Double
    var feelsLikeTemp: Double
    var symbol: String
    var precipChance: Double
    var precipitationAmount: Double
    var snowfallAmount: Double
    var uvIndex: Int
    var windSpeed: Double
    var windGust: Double
    var windDirection: Double
    var humidity: Double
    var visibility: Double
    var pressure: Double
}

@MainActor
class WeatherKitViewModel: ObservableObject {
    // Singleton
    static let shared = WeatherKitViewModel()
    let weatherService = WeatherService.shared

    // MARK: - Текущо време
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
    @Published var currentMoonEvents: MoonEvents?

    // Нови параметри за валежи
    @Published var currentPrecipitationAmount: Double?    // ще пази стойността на precipitationIntensity
    @Published var currentCloudCover: Double?

    // MARK: - Прогнози
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

    @Published var nextMoonPhase: String?
    @Published var daysUntilNextMoonPhase: Int?

    var locationTimeZone: TimeZone = .current

    // MARK: - Публични методи

    func setTimeZone(_ tz: TimeZone) {
        self.locationTimeZone = tz
    }

    func fetchWeatherForCoords(latitude: Double, longitude: Double) {
        Task {
            do {
                let loc = CLLocation(latitude: latitude, longitude: longitude)
                let (current, hourlyData, dailyData) = try await weatherService.weather(
                    for: loc,
                    including: .current, .hourly, .daily
                )

                updateCurrentWeather(current)
                updateHourlyForecast(hourlyData.forecast)
                updateDailyForecast(dailyData.forecast)

                var calendar = Calendar(identifier: .gregorian)
                calendar.timeZone = locationTimeZone

                if let todayForecast = dailyData.forecast.first(where: { calendar.isDateInToday($0.date) }) {
                    self.sunriseTime = todayForecast.sun.sunrise
                    self.sunsetTime  = todayForecast.sun.sunset

                    let pptByType = todayForecast.precipitationAmountByType
                    self.todayPrecipitationAmount       = pptByType.precipitation.value
                    self.nextHourPrecipitationChance = todayForecast.precipitationChance
                } else {
                    self.sunriseTime = nil
                    self.sunsetTime  = nil
                    self.todayPrecipitationAmount = 0
                }

                if let nextHour = hourlyData.forecast.first(where: { $0.date > Date() }) {
                    self.nextHourPrecipitationChance = nextHour.precipitationChance
                } else {
                    self.nextHourPrecipitationChance = hourlyData.forecast.last?.precipitationChance
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
        currentFeelsLike = nil
        currentHumidity = nil
        currentPressure = nil
        currentVisibility = nil
        currentUVIndex = nil
        currentWindSpeed = nil
        currentWindGust = nil
        currentWindDirection = nil
        currentDewPoint = nil
        pressureTrend = nil

        sunriseTime = nil
        sunsetTime = nil
        todayMinTemp = nil
        todayMaxTemp = nil
        todayPrecipitationAmount = nil
        nextHourPrecipitationChance = nil

        hourlyForecast = []
        next24HourlyForecast = []
        dailyForecast = []

        currentPrecipitationAmount = nil
        currentCloudCover = nil

        nextMoonPhase = nil
        daysUntilNextMoonPhase = nil
        currentMoonEvents = nil

        errorMessage = nil
    }

    // MARK: - Приватни методи

    private func updateCurrentWeather(_ current: CurrentWeather) {
        currentTemp       = current.temperature.value
        currentSymbol     = current.symbolName
        currentCondition  = current.condition.description
        currentFeelsLike  = current.apparentTemperature.value
        currentHumidity   = current.humidity
        currentPressure   = current.pressure.value
        currentVisibility = current.visibility.value
        currentUVIndex    = current.uvIndex.value

        // km/h
        currentWindSpeed = current.wind.speed.converted(to: .kilometersPerHour).value
        if let gust = current.wind.gust {
            currentWindGust = gust.converted(to: .kilometersPerHour).value
        }

        currentWindDirection = Angle(degrees: current.wind.direction.value)
        currentDewPoint      = current.dewPoint.value

        switch current.pressureTrend {
        case .falling: pressureTrend = "Falling"
        case .rising:  pressureTrend = "Rising"
        case .steady:  pressureTrend = "Steady"
        @unknown default:
            pressureTrend = "Unknown"
        }

        // валежи: използваме precipitationIntensity
        currentPrecipitationAmount = current.precipitationIntensity.value
        currentCloudCover          = current.cloudCover
    }

    private func updateHourlyForecast(_ hours: [HourWeather]) {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = locationTimeZone
        let now = Date()

        guard let startOfHour = calendar.date(
            bySettingHour: calendar.component(.hour, from: now),
            minute: 0,
            second: 0,
            of: now
        ) else { return }

        guard let startIndex = hours.firstIndex(where: { $0.date >= startOfHour }) else {
            hourlyForecast = []
            next24HourlyForecast = []
            return
        }

        let endIndex = min(startIndex + 24, hours.count)
        let slice = hours[startIndex..<endIndex]
        next24HourlyForecast = slice.enumerated().map { i, h in
            HourlyForecastItem(
                id: h.date,
                date: h.date,
                hour: i == 0 ? "Now" : hourString(from: h.date),
                temp: h.temperature.value,
                feelsLikeTemp: h.apparentTemperature.value,
                symbol: h.symbolName,
                precipChance: h.precipitationChance,
                precipitationAmount: h.precipitationAmount.value,
                snowfallAmount: h.snowfallAmount.value,
                uvIndex: h.uvIndex.value,
                windSpeed: h.wind.speed.value,
                windGust: h.wind.gust?.value ?? 0,
                windDirection: h.wind.direction.converted(to: .degrees).value,
                humidity: h.humidity,
                visibility: h.visibility.value / 1000,
                pressure: h.pressure.value
            )
        }

        hourlyForecast = hours.map { h in
            HourlyForecastItem(
                id: h.date,
                date: h.date,
                hour: hourString(from: h.date),
                temp: h.temperature.value,
                feelsLikeTemp: h.apparentTemperature.value,
                symbol: h.symbolName,
                precipChance: h.precipitationChance,
                precipitationAmount: h.precipitationAmount.value,
                snowfallAmount: h.snowfallAmount.value,
                uvIndex: h.uvIndex.value,
                windSpeed: h.wind.speed.value,
                windGust: h.wind.gust?.value ?? 0,
                windDirection: h.wind.direction.converted(to: .degrees).value,
                humidity: h.humidity,
                visibility: h.visibility.value / 1000,
                pressure: h.pressure.value
            )
        }
    }

    private func updateDailyForecast(_ days: [DayWeather]) {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = locationTimeZone

        // Вземаме до 10 дни напред
        let relevantDays = days.prefix(min(days.count, 10))
        var arr: [DayForecastItem] = []

        for dayData in relevantDays {
            let dateValue = dayData.date
            let isToday = calendar.isDateInToday(dateValue)
            let dayName = isToday ? "Today" : weekdayString(from: dateValue)

            if isToday {
                currentMoonEvents = dayData.moon
            }

            // Сумираме почасовите валежи за следващите 24ч
            let hourlyForDay = hourlyForecast.filter {
                calendar.isDate($0.date, inSameDayAs: dateValue)
            }
            let totalHourlyPrecip = hourlyForDay.reduce(0) { $0 + $1.precipitationAmount }
            let totalHourlyRain = hourlyForDay.reduce(0) { sum, it in
                it.symbol.lowercased().contains("snow") ? sum : sum + it.precipitationAmount
            }
            let totalHourlySnow = hourlyForDay.reduce(0) { sum, it in
                it.symbol.lowercased().contains("snow") ? sum + it.precipitationAmount : sum
            }

            // Взимаме разбивката от новия API
            let pptByType   = dayData.precipitationAmountByType
            let totalPrecip = pptByType.precipitation.value
            let rainPrecip  = pptByType.rainfall.value
            // Тук е ключово: amount e Measurement<UnitLength>
            let snowPrecip  = pptByType.snowfallAmount.amount.value

            let item = DayForecastItem(
                id: dateValue,
                date: dateValue,
                day: dayName,
                symbol: dayData.symbolName,
                precipChance: dayData.precipitationChance,
                minTemp: dayData.lowTemperature.value,
                maxTemp: dayData.highTemperature.value,

                // Последни 24ч
                precipLast24h:    totalPrecip,
                rainLast24h:      rainPrecip,
                snowLast24h:      snowPrecip,

                // Дублиращи полета
                precipitationAmount: totalPrecip,
                reinAmount:          rainPrecip,
                snowfallAmount:      snowPrecip,

                // Следващи 24ч
                precipNext24h: totalHourlyPrecip,
                rainNext24h:  totalHourlyRain,
                snowNext24h:  totalHourlySnow,

                maxUV:                   dayData.uvIndex.value,
                maxWindSpeed:            dayData.highWindSpeed!.value,
                maxWindGust:             dayData.wind.gust?.value ?? 0,
                predominantWindDirection: dayData.wind.direction.converted(to: .degrees).value,
                humidityMin:             dayData.minimumHumidity,
                humidityMax:             dayData.maximumHumidity,
                visibilityMin:           dayData.minimumVisibility / 1000,
                visibilityMax:           dayData.maximumVisibility / 1000,
                moon:                    dayData.moon
            )
            arr.append(item)
        }

        dailyForecast = arr

        // Обновяваме днешните мин и макс
        if let first = arr.first, calendar.isDateInToday(first.date) {
            todayMinTemp = first.minTemp
            todayMaxTemp = first.maxTemp
        } else {
            todayMinTemp = days.first?.lowTemperature.value
            todayMaxTemp = days.first?.highTemperature.value
        }

        updateMoonPhaseInfo()
    }


    private func updateMoonPhaseInfo() {
        guard let currentMoon = currentMoonEvents else {
            nextMoonPhase = nil
            daysUntilNextMoonPhase = nil
            return
        }
        let currentPhase = currentMoon.phase
        let calendar = Calendar.current

        for forecast in dailyForecast {
            if let m = forecast.moon, m.phase != currentPhase {
                nextMoonPhase = m.phase.description
                if let diff = calendar.dateComponents([.day], from: Date(), to: forecast.date).day {
                    daysUntilNextMoonPhase = diff
                }
                break
            }
        }
    }

    // MARK: - Помощни форматиращи

    private func hourString(from date: Date) -> String {
        let fmt = DateFormatter()
        fmt.dateFormat = "HH"
        fmt.timeZone = locationTimeZone
        return fmt.string(from: date)
    }

    private func weekdayString(from date: Date) -> String {
        let fmt = DateFormatter()
        fmt.dateFormat = "E"
        fmt.timeZone = locationTimeZone
        return fmt.string(from: date)
    }

    func formatTime(_ date: Date?) -> String {
        guard let date = date else { return "--:--" }
        let fmt = DateFormatter()
        fmt.timeStyle = .short
        fmt.timeZone = locationTimeZone
        return fmt.string(from: date)
    }

    func uvCategory(for index: Int?) -> (description: String, color: Color) {
        guard let i = index else { return ("Unknown", .gray) }
        switch i {
        case 0...2:   return ("Low", .green)
        case 3...5:   return ("Moderate", .yellow)
        case 6...7:   return ("High", .orange)
        case 8...10:  return ("Very High", .red)
        case 11...:   return ("Extreme", .purple)
        default:      return ("Unknown", .gray)
        }
    }

    func windDirectionAbbreviation(for angle: Angle?) -> String {
        guard let angle = angle else { return "---" }
        let deg = angle.degrees.truncatingRemainder(dividingBy: 360)
        let idx = Int(((deg + 11.25).truncatingRemainder(dividingBy: 360) / 22.5).rounded()) % 16
        let dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
        return dirs[idx]
    }
}
