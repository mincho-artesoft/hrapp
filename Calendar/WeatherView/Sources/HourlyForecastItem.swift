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
