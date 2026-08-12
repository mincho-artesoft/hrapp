import Foundation

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

enum SolarForecastEventKind: String {
    case sunrise
    case sunset

    var localizedTitle: String {
        switch self {
        case .sunrise:
            return NSLocalizedString("Sunrise", comment: "Hourly forecast sunrise event")
        case .sunset:
            return NSLocalizedString("Sunset", comment: "Hourly forecast sunset event")
        }
    }

    var symbolName: String {
        switch self {
        case .sunrise: return "sunrise.fill"
        case .sunset: return "sunset.fill"
        }
    }
}

struct SolarForecastEvent: Identifiable {
    let kind: SolarForecastEventKind
    let date: Date

    var id: String {
        "\(kind.rawValue)-\(date.timeIntervalSinceReferenceDate)"
    }
}

struct SolarDayForecast: Identifiable {
    let date: Date
    let firstLight: Date?
    let sunrise: Date?
    let solarNoon: Date?
    let sunset: Date?
    let lastLight: Date?

    var id: Date { date }

    var daylightDuration: TimeInterval? {
        guard let sunrise, let sunset, sunset > sunrise else { return nil }
        return sunset.timeIntervalSince(sunrise)
    }
}
