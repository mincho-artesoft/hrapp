import SwiftUI
import Combine
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

struct WeatherAlertDisplayItem: Identifiable, Equatable {
    let id: String
    let summary: String
    let source: String
    let region: String?
    let severity: WeatherSeverity
    let detailsURL: URL?
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
    @Published var currentConditionLocalizationKey: String = ""
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
    @Published var currentPrecipitationType: String?
    @Published var weatherAlerts: [WeatherAlertDisplayItem] = []

    // MARK: - Прогнози
    @Published var todayMinTemp: Double?
    @Published var todayMaxTemp: Double?
    @Published var sunriseTime: Date?
    @Published var sunsetTime: Date?
    @Published var todayPrecipitationAmount: Double?
    @Published var nextHourPrecipitationChance: Double?

    @Published var next24HourlyForecast: [HourlyForecastItem] = []
    @Published var next24SolarEvents: [SolarForecastEvent] = []
    @Published var solarDayForecast: [SolarDayForecast] = []
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

    func fetchWeatherForCoords(
        latitude: Double,
        longitude: Double,
        isGPSLocation: Bool = false,
        gpsDisplayName: String? = nil
    ) {
        Task {
            do {
                let loc = CLLocation(latitude: latitude, longitude: longitude)
                let (current, hourlyData, dailyData, alerts) = try await weatherService.weather(
                    for: loc,
                    including: .current, .hourly, .daily, .alerts
                )

                print(
                    String(
                        format: "🌦️ [WeatherAlerts] Forecast response: %.5f,%.5f gps=%@ alerts=%d",
                        latitude,
                        longitude,
                        isGPSLocation ? "true" : "false",
                        alerts?.count ?? 0
                    )
                )
                if !isGPSLocation, !(alerts?.isEmpty ?? true) {
                    print("🌦️ [WeatherAlerts] Alerts belong to a searched/saved region; GPS-only notifications intentionally skipped")
                }

                updateCurrentWeather(current)
                updateHourlyForecast(hourlyData.forecast)
                updateDailyForecast(dailyData.forecast)
                updateSolarEvents(dailyData.forecast, relativeTo: current.date)
                updateCurrentPrecipitationType(hourlyData.forecast, relativeTo: current.date)
                updateWeatherAlerts(alerts)

                if isGPSLocation {
                    await WeatherAlertNotificationManager.shared.processFetchedGPSAlerts(
                        alerts,
                        location: loc,
                        displayName: gpsDisplayName
                    )
                }

                var calendar = Calendar.current
                calendar.timeZone = locationTimeZone

                if let todayForecast = dailyData.forecast.first(where: { calendar.isDateInToday($0.date) }) {
                    self.sunriseTime = todayForecast.sun.sunrise
                    self.sunsetTime  = todayForecast.sun.sunset

                    let pptByType = todayForecast.precipitationAmountByType
                    
                    todayPrecipitationAmount = (GlobalState.measurementSystem == "Imperial")
                        ? pptByType.precipitation.value / 25.4
                        : pptByType.precipitation.value
                    
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
                NotificationCenter.default.post(name: .weatherForecastUpdated, object: nil)
            } catch {
                print("WeatherKit Error: \(error)")
                self.errorMessage = NSLocalizedString(
                    "Failed to fetch weather data. Please check your connection or try again later.",
                    comment: "Weather loading error"
                )
            }
        }
    }

    func clearWeatherData() {
        currentTemp = nil
        currentSymbol = "cloud"
        currentCondition = "—"
        currentConditionLocalizationKey = ""
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
        next24SolarEvents = []
        solarDayForecast = []
        dailyForecast = []

        currentPrecipitationAmount = nil
        currentCloudCover = nil
        currentPrecipitationType = nil
        weatherAlerts = []

        nextMoonPhase = nil
        daysUntilNextMoonPhase = nil
        currentMoonEvents = nil

        errorMessage = nil
        CalendarWidgetStore.clearWeatherSnapshot()
        NotificationCenter.default.post(name: .weatherForecastUpdated, object: nil)
    }

    // MARK: - Current Weather Conversion
    private func updateCurrentWeather(_ current: CurrentWeather) {
        // 1. Температура в °C или °F
        let tempUnit: UnitTemperature = (GlobalState.temperatureUnit == UnitTemperature.fahrenheit.symbol)
            ? .fahrenheit
            : .celsius
        currentTemp      = current.temperature.converted(to: tempUnit).value
        currentFeelsLike = current.apparentTemperature.converted(to: tempUnit).value
        currentDewPoint  = current.dewPoint.converted(to: tempUnit).value

        // 2. Налягане в hPa или inHg
        let pressureUnit: UnitPressure = (GlobalState.measurementSystem == "Imperial")
            ? .inchesOfMercury
            : .hectopascals
        currentPressure = current.pressure.converted(to: pressureUnit).value

        // 3. Видимост в km или miles
        let distanceUnit: UnitLength = (GlobalState.measurementSystem == "Imperial")
            ? .miles
            : .kilometers
        
        currentVisibility = current.visibility.converted(to: distanceUnit).value
        // 4. Вятър в km/h или mph
        let speedUnit: UnitSpeed = (GlobalState.measurementSystem == "Imperial")
            ? .milesPerHour
            : .kilometersPerHour
        currentWindSpeed = current.wind.speed.converted(to: speedUnit).value
        if let gust = current.wind.gust {
            currentWindGust = gust.converted(to: speedUnit).value
        }
        currentWindDirection = Angle(degrees: current.wind.direction.value)

        // 5. Влажност, UV индекс и облачност
        currentHumidity   = current.humidity
        currentUVIndex    = current.uvIndex.value
        currentCloudCover = current.cloudCover

        // 6. Валежи (интензитет мм/h → mm/h или in/h)
        let rawIntensityMmPerHour = current.precipitationIntensity.value
        currentPrecipitationAmount = (GlobalState.measurementSystem == "Imperial")
            ? rawIntensityMmPerHour / 25.4
            : rawIntensityMmPerHour
        

        // 7. Символ и тренд на налягането
        currentSymbol    = current.symbolName
        currentConditionLocalizationKey = weatherConditionLocalizationKey(current.condition)
        currentCondition = localizedWeatherCondition(current.condition)
        CalendarWidgetStore.saveWeatherSnapshot(
            symbol: currentSymbol,
            condition: currentConditionLocalizationKey,
            temperature: currentTemp,
            windDirectionDegrees: currentWindDirection?.degrees,
            windDirectionText: windDirectionAbbreviation(for: currentWindDirection),
            windSpeed: currentWindSpeed,
            pressure: currentPressure,
            uvIndex: currentUVIndex
        )
        switch current.pressureTrend {
        case .falling: pressureTrend = "Falling"
        case .rising:  pressureTrend = "Rising"
        case .steady:  pressureTrend = "Steady"
        @unknown default:
            pressureTrend = "Unknown"
        }
    }

    private func updateCurrentPrecipitationType(
        _ hours: [HourWeather],
        relativeTo observationDate: Date
    ) {
        let closest = hours.min {
            abs($0.date.timeIntervalSince(observationDate))
                < abs($1.date.timeIntervalSince(observationDate))
        }
        currentPrecipitationType = closest?.precipitation.rawValue
    }

    private func updateWeatherAlerts(_ alerts: [WeatherAlert]?) {
        weatherAlerts = (alerts ?? []).map { alert in
            WeatherAlertDisplayItem(
                id: "\(alert.source)|\(alert.summary)|\(alert.region ?? "")",
                summary: alert.summary,
                source: alert.source,
                region: alert.region,
                severity: alert.severity,
                detailsURL: alert.detailsURL
            )
        }
        .sorted { severityRank($0.severity) > severityRank($1.severity) }
    }

    private func severityRank(_ severity: WeatherSeverity) -> Int {
        switch severity {
        case .extreme: return 4
        case .severe: return 3
        case .moderate: return 2
        case .minor: return 1
        case .unknown: return 0
        @unknown default: return 0
        }
    }

    // MARK: - Hourly Forecast Conversion
    private func updateHourlyForecast(_ hours: [HourWeather]) {
        // 1. Избиране на базови единици
        let tempUnit: UnitTemperature = (GlobalState.temperatureUnit == UnitTemperature.fahrenheit.symbol)
            ? .fahrenheit
            : .celsius
        let distanceUnit: UnitLength = (GlobalState.measurementSystem == "Imperial")
            ? .miles
            : .kilometers
        let speedUnit: UnitSpeed = (GlobalState.measurementSystem == "Imperial")
            ? .milesPerHour
            : .kilometersPerHour
        // 2. Определяме началото на текущия час
        var calendar = Calendar.current
        calendar.timeZone = locationTimeZone
        let now = Date()
        guard let startOfHour = calendar.date(
            bySettingHour: calendar.component(.hour, from: now),
            minute: 0, second: 0, of: now
        ) else { return }

        // 3. Вземаме slice за следващите 24 ч.
        guard let startIndex = hours.firstIndex(where: { $0.date >= startOfHour }) else {
            hourlyForecast = []
            next24HourlyForecast = []
            return
        }
        let slice = hours[startIndex..<min(startIndex + 24, hours.count)]

        // 4. Попълваме next24HourlyForecast
        next24HourlyForecast = slice.enumerated().map { i, h in
            let rawPpt = h.precipitationAmount.value       // mm
            let rawSnow = h.snowfallAmount.value           // mm
            return HourlyForecastItem(
                id: h.date,
                date: h.date,
                hour: i == 0
                    ? NSLocalizedString("Now", comment: "")
                    : hourString(from: h.date),
                temp: h.temperature.converted(to: tempUnit).value,
                feelsLikeTemp: h.apparentTemperature.converted(to: tempUnit).value,
                symbol: h.symbolName,
                precipChance: h.precipitationChance,
                precipitationAmount: (GlobalState.measurementSystem == "Imperial")
                    ? rawPpt / 25.4
                    : rawPpt,
                snowfallAmount: (GlobalState.measurementSystem == "Imperial")
                    ? rawSnow / 25.4
                    : rawSnow,
                uvIndex: h.uvIndex.value,
                windSpeed: h.wind.speed.converted(to: speedUnit).value,
                windGust: h.wind.gust?.converted(to: speedUnit).value ?? 0,
                windDirection: h.wind.direction.converted(to: .degrees).value,
                humidity: h.humidity,
                visibility: h.visibility.converted(to: distanceUnit).value,
                pressure: h.pressure.converted(to: (GlobalState.measurementSystem == "Imperial")
                    ? .inchesOfMercury
                    : .hectopascals).value
            )
        }

        // 5. Попълваме пълния hourlyForecast
        hourlyForecast = hours.map { h in
            let rawPpt = h.precipitationAmount.value
            let rawSnow = h.snowfallAmount.value
            return HourlyForecastItem(
                id: h.date,
                date: h.date,
                hour: hourString(from: h.date),
                temp: h.temperature.converted(to: tempUnit).value,
                feelsLikeTemp: h.apparentTemperature.converted(to: tempUnit).value,
                symbol: h.symbolName,
                precipChance: h.precipitationChance,
                precipitationAmount: (GlobalState.measurementSystem == "Imperial")
                    ? rawPpt / 25.4
                    : rawPpt,
                snowfallAmount: (GlobalState.measurementSystem == "Imperial")
                    ? rawSnow / 25.4
                    : rawSnow,
                uvIndex: h.uvIndex.value,
                windSpeed: h.wind.speed.converted(to: speedUnit).value,
                windGust: h.wind.gust?.converted(to: speedUnit).value ?? 0,
                windDirection: h.wind.direction.converted(to: .degrees).value,
                humidity: h.humidity,
                visibility: h.visibility.converted(to: distanceUnit).value,
                pressure: h.pressure.converted(to: (GlobalState.measurementSystem == "Imperial")
                    ? .inchesOfMercury
                    : .hectopascals).value
            )
        }
    }

    // MARK: - Daily Forecast Conversion
    private func updateSolarEvents(_ days: [DayWeather], relativeTo observationDate: Date) {
        let start = max(observationDate, Date())
        let end = start.addingTimeInterval(24 * 60 * 60)

        solarDayForecast = days.prefix(10).map { day in
            SolarDayForecast(
                date: day.date,
                firstLight: day.sun.civilDawn,
                sunrise: day.sun.sunrise,
                solarNoon: day.sun.solarNoon,
                sunset: day.sun.sunset,
                lastLight: day.sun.civilDusk
            )
        }

        next24SolarEvents = days
            .flatMap { day -> [SolarForecastEvent] in
                var events: [SolarForecastEvent] = []
                if let sunrise = day.sun.sunrise {
                    events.append(.init(kind: .sunrise, date: sunrise))
                }
                if let sunset = day.sun.sunset {
                    events.append(.init(kind: .sunset, date: sunset))
                }
                return events
            }
            .filter { $0.date >= start && $0.date <= end }
            .sorted { $0.date < $1.date }
    }

    private func updateDailyForecast(_ days: [DayWeather]) {
        // 1. Избиране на базови единици
        let tempUnit: UnitTemperature = (GlobalState.temperatureUnit == UnitTemperature.fahrenheit.symbol)
            ? .fahrenheit
            : .celsius
        let distanceUnit: UnitLength = (GlobalState.measurementSystem == "Imperial")
            ? .miles
            : .kilometers
        let speedUnit: UnitSpeed = (GlobalState.measurementSystem == "Imperial")
            ? .milesPerHour
            : .kilometersPerHour

        var calendar = Calendar.current
        calendar.timeZone = locationTimeZone
        let relevantDays = days.prefix(min(days.count, 10))
        var arr: [DayForecastItem] = []

        for dayData in relevantDays {
            let dateValue = dayData.date
            let isToday = calendar.isDateInToday(dateValue)
            let dayName = isToday
                ? NSLocalizedString("Today", comment: "")
                : weekdayString(from: dateValue)
            if isToday { currentMoonEvents = dayData.moon }

            // 2. API breakdown (mm)
            let rawTotalPrecip = dayData.precipitationAmountByType.precipitation.value
            let rawRainPrecip  = dayData.precipitationAmountByType.rainfall.value
            let rawSnowPrecip  = dayData.precipitationAmountByType.snowfallAmount.amount.value

            let totalPrecip = (GlobalState.measurementSystem == "Imperial")
                ? rawTotalPrecip / 25.4
                : rawTotalPrecip
            let rainPrecip = (GlobalState.measurementSystem == "Imperial")
                ? rawRainPrecip / 25.4
                : rawRainPrecip
            let snowPrecip = (GlobalState.measurementSystem == "Imperial")
                ? rawSnowPrecip / 25.4
                : rawSnowPrecip

            // 3. Почасови за последните 24ч. (те вече в конвертирани единици)
            let hourlyForDay = hourlyForecast.filter {
                calendar.isDate($0.date, inSameDayAs: dateValue)
            }
            let totalHourlyPrecip = hourlyForDay.reduce(0) { $0 + $1.precipitationAmount }
            let totalHourlyRain   = hourlyForDay.reduce(0) { sum, it in
                it.symbol.lowercased().contains("snow") ? sum : sum + it.precipitationAmount
            }
            let totalHourlySnow   = hourlyForDay.reduce(0) { sum, it in
                it.symbol.lowercased().contains("snow") ? sum + it.precipitationAmount : sum
            }

            // 4. Low/High temperature
            let lowTemp  = dayData.lowTemperature.converted(to: tempUnit).value
            let highTemp = dayData.highTemperature.converted(to: tempUnit).value

            // 5. Други стойности
            let uv    = dayData.uvIndex.value
            let windS = (dayData.highWindSpeed ?? Measurement(value: 0, unit: .metersPerSecond))
                .converted(to: speedUnit)
                .value

            let gust = (dayData.wind.gust ?? Measurement(value: 0, unit: .metersPerSecond))
                .converted(to: speedUnit)
                .value


            // 6. Видимост (Double м → km/miles)
            let visMin = Measurement(value: dayData.minimumVisibility,
                                     unit: UnitLength.meters)
                .converted(to: distanceUnit).value
            let visMax = Measurement(value: dayData.maximumVisibility,
                                     unit: UnitLength.meters)
                .converted(to: distanceUnit).value

            let item = DayForecastItem(
                id: dateValue,
                date: dateValue,
                day: dayName,
                symbol: dayData.symbolName,
                precipChance: dayData.precipitationChance,
                minTemp: lowTemp,
                maxTemp: highTemp,

                // Последни 24ч.
                precipLast24h:    totalPrecip,
                rainLast24h:      rainPrecip,
                snowLast24h:      snowPrecip,

                // API breakdown
                precipitationAmount: totalPrecip,
                reinAmount:          rainPrecip,
                snowfallAmount:      snowPrecip,

                // Следващи 24ч.
                precipNext24h: totalHourlyPrecip,
                rainNext24h:   totalHourlyRain,
                snowNext24h:   totalHourlySnow,

                maxUV:                     uv,
                maxWindSpeed:              windS,
                maxWindGust:               gust,
                predominantWindDirection:  dayData.wind.direction.converted(to: .degrees).value,
                humidityMin:               dayData.minimumHumidity,
                humidityMax:               dayData.maximumHumidity,
                visibilityMin:             visMin,
                visibilityMax:             visMax,
                moon:                      dayData.moon
            )
            arr.append(item)
        }

        dailyForecast = arr

        // Обновяване на днешни мин/макс
        if let first = arr.first, Calendar.current.isDateInToday(first.date) {
            todayMinTemp = first.minTemp
            todayMaxTemp = first.maxTemp
        }
        updateMoonPhaseInfo()
        if let currentMoonEvents {
            CalendarWidgetStore.saveMoonSnapshot(
                phaseAssetName: widgetMoonPhaseAssetName(for: currentMoonEvents.phase),
                phaseDescription: moonPhaseLocalizationKey(currentMoonEvents.phase)
            )
        }
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
                nextMoonPhase = localizedMoonPhase(m.phase)
                if let diff = calendar.dateComponents([.day], from: Date(), to: forecast.date).day {
                    daysUntilNextMoonPhase = diff
                }
                break
            }
        }
    }

    // MARK: - Помощни форматиращи

    private func weatherConditionLocalizationKey(_ condition: WeatherCondition) -> String {
        "WeatherCondition.\(condition.rawValue)"
    }

    private func localizedWeatherCondition(_ condition: WeatherCondition) -> String {
        NSLocalizedString(
            weatherConditionLocalizationKey(condition),
            comment: "Weather condition"
        )
    }

    func moonPhaseLocalizationKey(_ phase: MoonPhase) -> String {
        "MoonPhase.\(phase.rawValue)"
    }

    func localizedMoonPhase(_ phase: MoonPhase) -> String {
        NSLocalizedString(
            moonPhaseLocalizationKey(phase),
            comment: "Moon phase"
        )
    }

    private func hourString(from date: Date) -> String {
        let fmt = appTimeFormatter(timeZone: locationTimeZone, includesMinutes: false)
        return fmt.string(from: date)
    }

    private func weekdayString(from date: Date) -> String {
        let fmt = appDateFormatter(template: "E", timeZone: locationTimeZone)
        return fmt.string(from: date)
    }

    func formatTime(_ date: Date?) -> String {
        guard let date = date else { return "--:--" }
        let fmt = appTimeFormatter(timeZone: locationTimeZone)
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
        guard let angle = angle else { return "-" }
        let deg = angle.degrees.truncatingRemainder(dividingBy: 360)
        let idx = Int(((deg + 11.25)
                        .truncatingRemainder(dividingBy: 360)
                      / 22.5).rounded()) % 16
        // Съответстващи ключове в правилния ред
        let keys = [
            "cardinal.N","cardinal.NNE","cardinal.NE","cardinal.ENE",
            "cardinal.E","cardinal.ESE","cardinal.SE","cardinal.SSE",
            "cardinal.S","cardinal.SSW","cardinal.SW","cardinal.WSW",
            "cardinal.W","cardinal.WNW","cardinal.NW","cardinal.NNW"
        ]
        let key = keys[idx]
        return NSLocalizedString(key, comment: "Wind direction abbreviation")
    }

    private func widgetMoonPhaseAssetName(for phase: MoonPhase) -> String {
        switch phase {
        case .new: return "phase_new"
        case .full: return "phase_full"
        case .firstQuarter: return "phase_first_quarter"
        case .lastQuarter: return "phase_third_quarter"
        case .waningCrescent: return "phase_waning_crescent"
        case .waningGibbous: return "phase_waning_gibbous"
        case .waxingCrescent: return "phase_waxing_crescent"
        case .waxingGibbous: return "phase_waxing_gibbous"
        @unknown default: return "phase_full"
        }
    }

}
