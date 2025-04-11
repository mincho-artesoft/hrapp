import SwiftUI

struct UVIndexCard: View {
    let uvIndex: Int?
    // Use the category info passed from the ViewModel
    let categoryInfo: (description: String, color: Color)

    // UV Bar styled like the screenshot
    @ViewBuilder func uvBar() -> some View {
        GeometryReader { geometry in
            let totalWidth = geometry.size.width
            let barHeight: CGFloat = 5
            let maxUV: Double = 11 // Scale ends visually around 11+
            let fraction = min(1.0, max(0.0, Double(uvIndex ?? 0) / maxUV))
            let indicatorWidth: CGFloat = 3 // Width of the white line indicator
            // Calculate position for the *center* of the indicator
            let indicatorCenterX = (totalWidth - indicatorWidth) * fraction + (indicatorWidth / 2)

            ZStack(alignment: .leading) {
                // Gradient background bar
                LinearGradient(gradient: Gradient(colors: [.green, .yellow, .orange, .red, .purple]), startPoint: .leading, endPoint: .trailing)
                    .frame(height: barHeight)
                    .clipShape(Capsule()) // Rounded ends

                // White Indicator Line (vertical capsule)
                Capsule()
                   .fill(Color.white)
                   .frame(width: indicatorWidth, height: barHeight * 1.5) // Slightly taller
                   .shadow(color: .black.opacity(0.3), radius: 1, x: 0, y: 1)
                   // Position the center of the indicator capsule
                   .position(x: indicatorCenterX, y: geometry.size.height / 2)

            }
            // Center the ZStack vertically within the GeometryReader
            .frame(maxHeight: .infinity)
        }
        .frame(height: 10) // Height for the GeometryReader container itself
    }

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label("UV INDEX", systemImage: "sun.max.fill")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .symbolRenderingMode(.multicolor) // Yellow sun

            // Main Value - Below title
            Text("\(uvIndex ?? 0)")
                .font(.system(size: 34, weight: .regular))
                .foregroundStyle(.primary)

            // Category Description - Below main value
            Text(categoryInfo.description) // "Low", "Moderate", etc.
                .font(.system(size: 12)) // Smaller description font
                .foregroundStyle(.primary) // Primary color

            Spacer() // Pushes the bar to the bottom

            // UV Bar - Bottom
            uvBar()
        }
    }
}
