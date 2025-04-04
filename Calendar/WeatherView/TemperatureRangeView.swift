import SwiftUI

struct TemperatureRangeView: View {
    let day: DayForecastItem
    let globalMin: Double
    let globalMax: Double
    // --- NEW PROPERTIES ---
    let isToday: Bool
    let currentTemp: Double?
    // ---------------------

    private let barHeight: CGFloat = 5.0
    private let barCornerRadius: CGFloat = 2.5
    private let dotSize: CGFloat = 7.0 // Size of the current temp indicator dot

    var body: some View {
        GeometryReader { geometry in
            let totalWidth = geometry.size.width
            // Ensure totalRange is not zero to avoid division by zero
            let totalRange = max(1, globalMax - globalMin)

            // Calculate bar positions
            let dayMinFraction = (day.minTemp - globalMin) / totalRange
            let dayMaxFraction = (day.maxTemp - globalMin) / totalRange
            // Clamp fractions between 0 and 1
            let clampedMinFraction = max(0, min(1, dayMinFraction))
            let clampedMaxFraction = max(0, min(1, dayMaxFraction))
            // Calculate pixel positions and width for the bar
            let startX = clampedMinFraction * totalWidth
            let endX = clampedMaxFraction * totalWidth
            // Ensure segmentWidth is at least the diameter for rounded ends
            let segmentWidth = max(barHeight, endX - startX)

            let averageTemp = (day.minTemp + day.maxTemp) / 2.0
            let gradient = colorGradient(for: averageTemp)

            ZStack(alignment: .leading) {
                // Background bar (full width, light gray)
                RoundedRectangle(cornerRadius: barCornerRadius)
                    .fill(Color.gray.opacity(0.4))
                    .frame(height: barHeight)

                // Active segment with dynamic gradient
                RoundedRectangle(cornerRadius: barCornerRadius)
                    .fill(gradient)
                    .frame(width: segmentWidth, height: barHeight)
                    .offset(x: startX) // Position the colored segment

                // --- NEW: Current Temperature Dot ---
                if isToday, let temp = currentTemp {
                    // Calculate dot position fraction
                    let currentTempFraction = (temp - globalMin) / totalRange
                    // Clamp fraction
                    let clampedCurrentFraction = max(0, min(1, currentTempFraction))
                    // Calculate pixel position for the dot's center
                    let dotCenterX = clampedCurrentFraction * totalWidth

                    // Draw the dot
                    Circle()
                        .fill(Color.white) // White dot
                        .frame(width: dotSize, height: dotSize)
                        // Optional: add a thin border for contrast
                        .overlay(
                            Circle().stroke(Color.black.opacity(0.2), lineWidth: 0.5)
                        )
                        // Position the dot. Offset by -dotSize/2 to center it.
                        .offset(x: dotCenterX - (dotSize / 2))
                }
                // ---------------------------------
            }
            .frame(height: barHeight) // Ensure ZStack uses the bar height
            // Center the ZStack vertically within the GeometryReader's height
             .frame(maxHeight: .infinity, alignment: .center)
        }
        // Explicitly set the height for the GeometryReader itself
        .frame(height: barHeight)
    }

    // --- Helper Function for Dynamic Gradient Colors (Celsius) ---
    // (Keep the existing colorGradient function unchanged)
    private func colorGradient(for averageTemperature: Double) -> LinearGradient {
        let veryColdThreshold: Double = 0
        let coolThreshold: Double = 12
        let warmThreshold: Double = 22
        let hotThreshold: Double = 30

        let purple = Color(hue: 0.75, saturation: 0.7, brightness: 0.7)
        let darkBlue = Color(hue: 0.65, saturation: 0.8, brightness: 0.8)
        let cyan = Color(hue: 0.55, saturation: 0.7, brightness: 0.9)
        let green = Color(hue: 0.33, saturation: 0.6, brightness: 0.8)
        let yellow = Color(hue: 0.15, saturation: 0.8, brightness: 1.0)
        let orange = Color(hue: 0.08, saturation: 0.9, brightness: 1.0)
        let red = Color(hue: 0.0, saturation: 0.9, brightness: 0.9)

        let colors: [Color]
        if averageTemperature < veryColdThreshold { colors = [purple, darkBlue] }
        else if averageTemperature < coolThreshold { colors = [darkBlue, cyan] }
        else if averageTemperature < warmThreshold { colors = [green, yellow] }
        else if averageTemperature < hotThreshold { colors = [yellow, orange] }
        else { colors = [orange, red] }

        return LinearGradient(gradient: Gradient(colors: colors), startPoint: .leading, endPoint: .trailing)
    }
}
