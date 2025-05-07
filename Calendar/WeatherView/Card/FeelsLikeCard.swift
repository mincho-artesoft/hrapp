import SwiftUI

struct FeelsLikeCard: View {
    let feelsLike: Double?
    let currentTemp: Double? // To determine the descriptive text

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label("FEELS LIKE", systemImage: "thermometer")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)

            // Main Value - Below title
            if let temp = feelsLike {
                Text("\(Int(temp.rounded()))°")
                    .font(.system(size: 34, weight: .regular)) // Large regular font
                    .foregroundStyle(.primary)
            } else {
                Text("—°")
                    .font(.system(size: 34, weight: .regular))
                    .foregroundStyle(.primary)
            }

            Spacer() // Pushes the description to the bottom

            // Description - Bottom Left
            Text(feelsLikeDescription())
               .font(.system(size: 12))
               .foregroundStyle(.primary) // Primary color for description
               .fixedSize(horizontal: false, vertical: true) // Allow wrapping
        }
    }

    // Helper for descriptive text (same as before)
    private func feelsLikeDescription() -> String {
        guard let feels = feelsLike, let current = currentTemp else { return " " }
        let diff = feels - current
        if abs(diff) < 1.5 { return NSLocalizedString("similar_to_actual_temp", comment: "") }
        else if diff < 0 { return NSLocalizedString("wind_cooler_feel", comment: "") }
        else { return NSLocalizedString("humidity_warmer_feel", comment: "") }
    }

}
