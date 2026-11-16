import SwiftUI

enum TemperatureColorScale {
    private static let purple = Color(hue: 0.75, saturation: 0.7, brightness: 0.7)
    private static let darkBlue = Color(hue: 0.65, saturation: 0.8, brightness: 0.8)
    private static let cyan = Color(hue: 0.55, saturation: 0.7, brightness: 0.9)
    private static let green = Color(hue: 0.33, saturation: 0.6, brightness: 0.8)
    private static let yellow = Color(hue: 0.15, saturation: 0.8, brightness: 1.0)
    private static let orange = Color(hue: 0.08, saturation: 0.9, brightness: 1.0)
    private static let red = Color(hue: 0.0, saturation: 0.9, brightness: 0.9)

    static func graphGradient(range: (min: Double, max: Double)) -> Gradient {
        Gradient(stops: [
            .init(color: purple, location: gradientLocation(forCelsius: -10, range: range)),
            .init(color: darkBlue, location: gradientLocation(forCelsius: 0, range: range)),
            .init(color: cyan, location: gradientLocation(forCelsius: 12, range: range)),
            .init(color: green, location: gradientLocation(forCelsius: 22, range: range)),
            .init(color: yellow, location: gradientLocation(forCelsius: 25, range: range)),
            .init(color: orange, location: gradientLocation(forCelsius: 30, range: range)),
            .init(color: red, location: gradientLocation(forCelsius: 35, range: range))
        ])
    }

    static func bandGradient(
        for temperature: Double,
        layoutDirection: LayoutDirection
    ) -> LinearGradient {
        let colors: [Color]
        if temperature < displayValue(forCelsius: 0) {
            colors = [purple, darkBlue]
        } else if temperature < displayValue(forCelsius: 12) {
            colors = [darkBlue, cyan]
        } else if temperature < displayValue(forCelsius: 22) {
            colors = [green, yellow]
        } else if temperature < displayValue(forCelsius: 30) {
            colors = [yellow, orange]
        } else {
            colors = [orange, red]
        }

        let startPoint: UnitPoint = layoutDirection == .rightToLeft ? .trailing : .leading
        let endPoint: UnitPoint = layoutDirection == .rightToLeft ? .leading : .trailing
        return LinearGradient(
            gradient: Gradient(colors: colors),
            startPoint: startPoint,
            endPoint: endPoint
        )
    }

    private static func gradientLocation(forCelsius celsius: Double, range: (min: Double, max: Double)) -> CGFloat {
        guard range.max > range.min else { return 0.5 }

        let displayTemperature = displayValue(forCelsius: celsius)
        let normalized = (displayTemperature - range.min) / (range.max - range.min)
        return CGFloat(max(0.0, min(1.0, normalized)))
    }

    private static func displayValue(forCelsius celsius: Double) -> Double {
        if GlobalState.temperatureUnit == UnitTemperature.fahrenheit.symbol {
            return celsius * 9.0 / 5.0 + 32.0
        }

        return celsius
    }
}
