import Combine
import MapKit
import CoreLocation
@preconcurrency import WeatherKit
import SwiftUI // Needed for Angle, Color, PressureTrend description

// MARK: - НОВА СТРУКТУРА ЗА ЕДИН ДЕН ОТ ПРОГНОЗАТА
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

// MARK: - WEATHERKIT VIEW MODEL
@MainActor
class WeatherKitViewModel: ObservableObject {
    private let weatherService = WeatherService.shared

    // Текущо
    @Published var currentTemp: Double?
    @Published var currentSymbol: String = "cloud" // Default icon
    @Published var currentCondition: String = "—"
    @Published var todayMinTemp: Double?
    @Published var todayMaxTemp: Double?

    // Доп. данни (Feels Like, Humidity, etc.)
    @Published var currentFeelsLike: Double?
    @Published var currentHumidity: Double?
    @Published var currentWindSpeed: Double? // Speed in m/s from WeatherKit
    @Published var currentPressure: Double?
    @Published var currentVisibility: Double?
    @Published var currentUVIndex: Int?
    // --- NEW Properties ---
    @Published var currentWindGust: Double? // Speed in m/s
    @Published var currentWindDirection: Angle? // Angle
    @Published var currentDewPoint: Double? // Temperature value
    @Published var pressureTrend: String? // e.g., "Falling", "Steady", "Rising"
    @Published var sunriseTime: Date?
    @Published var sunsetTime: Date?
    @Published var todayPrecipitationAmount: Double? // Amount in mm
    @Published var nextHourPrecipitationChance: Double? // For the "Precipitation" card short term info
    // --- End NEW Properties ---


    // Почасова (24 часа)
    @Published var hourlyForecast: [(hour: String, temp: Double, symbol: String)] = []

    // 10-дневна
    @Published var dailyForecast: [DayForecastItem] = []

    @Published var errorMessage: String?

    func fetchWeatherForCoords(latitude: Double, longitude: Double) {
           Task {
               do {
                   let loc = CLLocation(latitude: latitude, longitude: longitude)

                   // --- Request ALL datasets ---
                   // This returns a TUPLE: (CurrentWeather, Forecast<HourWeather>, Forecast<DayWeather>)
                   let weatherDataTuple = try await weatherService.weather(
                       for: loc,
                       including: .current, .hourly, .daily
                   )
                   // ---------------------------

                   // --- Access tuple elements by index ---
                   let current = weatherDataTuple.0
                   let hourlyForecast = weatherDataTuple.1 // This is Forecast<HourWeather>
                   let dailyForecast = weatherDataTuple.2   // This is Forecast<DayWeather>
                   // --------------------------------------

                   updateCurrentWeather(current) // Pass the CurrentWeather object
                   updateHourlyForecast(hourlyForecast.forecast) // Pass the [HourWeather] array
                   updateDailyForecast(dailyForecast.forecast)   // Pass the [DayWeather] array

                   // --- Fetch today's detailed daily data using the dailyForecast ---
                   if let todayForecast = dailyForecast.forecast.first(where: { Calendar.current.isDateInToday($0.date) }) {
                       self.sunriseTime = todayForecast.sun.sunrise
                       self.sunsetTime = todayForecast.sun.sunset
                       self.todayPrecipitationAmount = todayForecast.precipitationAmount.value // Get today's total precip in mm
                   } else {
                       self.sunriseTime = nil
                       self.sunsetTime = nil
                       self.todayPrecipitationAmount = 0 // Default to 0 if not found
                   }
                   // ----------------------------------------------------------------

                   // --- Fetch next hour precipitation chance using the hourlyForecast ---
                   // Find the first forecast entry strictly after the current time
                   if let nextHour = hourlyForecast.forecast.first(where: { $0.date > Date() }) {
                      self.nextHourPrecipitationChance = nextHour.precipitationChance
                   } else {
                       // If no future hour found (unlikely unless at end of data), use the latest available
                        self.nextHourPrecipitationChance = hourlyForecast.forecast.last?.precipitationChance
                   }
                   // -----------------------------------------

                   self.errorMessage = nil
               } catch {
                   print("WeatherKit Error: \(error)") // Log the actual error
                   self.errorMessage = "Failed to fetch weather data. Please check your connection or try again later."
                   // Consider clearing old data to avoid showing stale info
                   // clearWeatherData()
               }
           }
       }

    // Function to clear data, useful on error or location change start
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
        errorMessage = nil // Clear error message too
    }


    private func updateCurrentWeather(_ current: CurrentWeather) {
        self.currentTemp = current.temperature.value
        self.currentSymbol = current.symbolName
        self.currentCondition = current.condition.description

        self.currentFeelsLike  = current.apparentTemperature.value
        self.currentHumidity   = current.humidity
        self.currentWindSpeed  = current.wind.speed.value // Keep as m/s internally
        self.currentPressure   = current.pressure.value // hPa (millibars)
        self.currentVisibility = current.visibility.value // meters
        self.currentUVIndex    = current.uvIndex.value

        // --- Update NEW Properties ---
        self.currentWindGust = current.wind.gust?.value // Gust is optional (m/s)
        self.currentWindDirection = Angle(degrees: current.wind.direction.value)
        self.currentDewPoint = current.dewPoint.value // Celsius

        switch current.pressureTrend {
        case .falling: self.pressureTrend = "Falling"
        case .rising: self.pressureTrend = "Rising"
        case .steady: self.pressureTrend = "Steady"
        @unknown default:
            self.pressureTrend = nil // Handle unknown cases
        }
        // --- End Update NEW ---
    }

    private func updateHourlyForecast(_ hours: [HourWeather]) {
        let now = Date()
        // Find index of the first hour that starts *now* or later
        guard let startIndex = hours.firstIndex(where: { $0.date >= now }) else {
            self.hourlyForecast = []
            return
        }
        // Take the next 24 hours from that starting point
        let endIndex = min(startIndex + 24, hours.count)
        let relevantHours = hours[startIndex..<endIndex]

        var tempArray: [(String, Double, String)] = []
        for (i, hourData) in relevantHours.enumerated() {
            // Label the first item as "Now"
            let label = (i == 0) ? "Now" : hourString(from: hourData.date)
            tempArray.append((label, hourData.temperature.value, hourData.symbolName))
        }
        self.hourlyForecast = tempArray
    }

    private func updateDailyForecast(_ days: [DayWeather]) {
        let count = min(days.count, 10) // Limit to 10 days
        let relevantDays = days.prefix(count)

        var arr: [DayForecastItem] = []

        for (i, dayData) in relevantDays.enumerated() {
            // Label the first day as "Today"
            let dayName = Calendar.current.isDateInToday(dayData.date) ? "Today" : weekdayString(from: dayData.date)
            let minT = dayData.lowTemperature.value
            let maxT = dayData.highTemperature.value
            let symbol = dayData.symbolName
            let chance = dayData.precipitationChance
            let dateValue = dayData.date // Use the date as the ID

            let item = DayForecastItem(id: dateValue,
                                       date: dateValue,
                                       day: dayName,
                                       symbol: symbol,
                                       precipChance: chance,
                                       minTemp: minT,
                                       maxTemp: maxT)
            arr.append(item)
        }
        self.dailyForecast = arr

        // Update today's min/max specifically from the processed array
        if let firstDay = arr.first, Calendar.current.isDateInToday(firstDay.date) {
            self.todayMinTemp = firstDay.minTemp
            self.todayMaxTemp = firstDay.maxTemp
        } else {
            // Fallback if the first day isn't 'Today' (shouldn't happen with current logic)
            self.todayMinTemp = days.first?.lowTemperature.value
            self.todayMaxTemp = days.first?.highTemperature.value
        }
    }

    // --- Helper Functions ---
    private func hourString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "ha" // e.g., 3PM (no space, uppercase AM/PM)
        formatter.amSymbol = "AM"
        formatter.pmSymbol = "PM"
        return formatter.string(from: date)
    }

    private func weekdayString(from date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "E" // e.g., Tue
        return formatter.string(from: date)
    }

    func formatTime(_ date: Date?) -> String {
        guard let date = date else { return "--:--" }
        let formatter = DateFormatter()
        formatter.dateStyle = .none
        formatter.timeStyle = .short // e.g., 7:01 PM (respects locale)
        return formatter.string(from: date)
    }

     func uvCategory(for index: Int?) -> (description: String, color: Color) {
        guard let index = index else { return ("Unknown", .gray) }
        switch index {
        case 0...2: return ("Low", .green)
        case 3...5: return ("Moderate", .yellow) // Match screenshot description
        case 6...7: return ("High", .orange)
        case 8...10: return ("Very High", .red)
        case 11...: return ("Extreme", .purple)
        default: return ("Unknown", .gray) // Should not happen for valid index >= 0
        }
    }

     func windDirectionAbbreviation(for angle: Angle?) -> String {
         guard let angle = angle else { return "---" }
         // Normalize angle to 0 <= degrees < 360
         let degrees = angle.degrees.truncatingRemainder(dividingBy: 360).advanced(by: angle.degrees < 0 ? 360 : 0)
         // Determine the index in the 16-wind compass rose
         let index = Int(((degrees + 11.25) / 22.5).rounded().truncatingRemainder(dividingBy: 16))
         let directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
         return directions[index]
     }

     func metersPerSecondToKmh(_ speed: Double?) -> Double {
         guard let speed = speed else { return 0 }
         return speed * 3.6
     }
}
