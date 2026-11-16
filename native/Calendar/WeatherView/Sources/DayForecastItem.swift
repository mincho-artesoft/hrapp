import WeatherKit
import Foundation

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
