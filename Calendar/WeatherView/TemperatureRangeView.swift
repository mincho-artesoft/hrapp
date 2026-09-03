import SwiftUI

struct TemperatureRangeView: View {
    @Environment(\.layoutDirection) private var layoutDirection

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
            // Keep the low end next to the minimum label and the high end next
            // to the maximum label in both interface directions.
            let minX = (layoutDirection == .rightToLeft ? 1 - clampedMinFraction : clampedMinFraction) * totalWidth
            let maxX = (layoutDirection == .rightToLeft ? 1 - clampedMaxFraction : clampedMaxFraction) * totalWidth
            let segmentStartX = min(minX, maxX)
            let segmentEndX = max(minX, maxX)
            // Ensure segmentWidth is at least the diameter for rounded ends
            let segmentWidth = max(barHeight, segmentEndX - segmentStartX)
            let segmentCenterX = (segmentStartX + segmentEndX) / 2

            let averageTemp = (day.minTemp + day.maxTemp) / 2.0
            let gradient = colorGradient(for: averageTemp, layoutDirection: layoutDirection)

            ZStack {
                // Background bar (full width, light gray)
                RoundedRectangle(cornerRadius: barCornerRadius)
                    .fill(Color.gray.opacity(0.4))
                    .frame(width: totalWidth, height: barHeight)
                    .position(x: totalWidth / 2, y: geometry.size.height / 2)

                // Active segment with dynamic gradient
                RoundedRectangle(cornerRadius: barCornerRadius)
                    .fill(gradient)
                    .frame(width: segmentWidth, height: barHeight)
                    .position(x: segmentCenterX, y: geometry.size.height / 2)

                // --- NEW: Current Temperature Dot ---
                if isToday, let temp = currentTemp {
                    // Calculate dot position fraction
                    let currentTempFraction = (temp - globalMin) / totalRange
                    // Clamp fraction
                    let clampedCurrentFraction = max(0, min(1, currentTempFraction))
                    // Calculate pixel position for the dot's center
                    let rawDotCenterX = (
                        layoutDirection == .rightToLeft
                            ? 1 - clampedCurrentFraction
                            : clampedCurrentFraction
                    ) * totalWidth
                    let dotCenterX = min(
                        totalWidth - dotSize / 2,
                        max(dotSize / 2, rawDotCenterX)
                    )

                    // Draw the dot
                    Circle()
                        .fill(Color.white) // White dot
                        .frame(width: dotSize, height: dotSize)
                        // Optional: add a thin border for contrast
                        .overlay(
                            Circle().stroke(Color.black.opacity(0.2), lineWidth: 0.5)
                        )
                        .position(x: dotCenterX, y: geometry.size.height / 2)
                }
                // ---------------------------------
            }
            // All x values in this drawing surface are physical coordinates
            // and already include the RTL conversion above.
            .environment(\.layoutDirection, .leftToRight)
            .frame(height: barHeight) // Ensure ZStack uses the bar height
            // Center the ZStack vertically within the GeometryReader's height
             .frame(maxHeight: .infinity, alignment: .center)
        }
        // Explicitly set the height for the GeometryReader itself
        .frame(height: barHeight)
    }

    private func colorGradient(
        for averageTemperature: Double,
        layoutDirection: LayoutDirection
    ) -> LinearGradient {
        TemperatureColorScale.bandGradient(
            for: averageTemperature,
            layoutDirection: layoutDirection
        )
    }
}
