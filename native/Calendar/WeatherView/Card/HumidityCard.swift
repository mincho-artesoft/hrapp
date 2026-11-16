import SwiftUI

struct HumidityCard: View {
    let humidity: Double? // 0.0 to 1.0
    let dewPoint: Double?

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label(NSLocalizedString("HUMIDITY", comment: "Humidity card title"), systemImage: "humidity.fill")
                .symbolRenderingMode(.multicolor) // Blue drop inside
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)
                .adaptiveSingleLine(minimumScale: 0.4)

            // Main Value - Below Title
            Text(localizedFormat("%d%%", Int((humidity ?? 0) * 100)))
                .font(.system(size: 34, weight: .regular))
                .foregroundStyle(.primary)

             Spacer() // Pushes description to the bottom

            // Description - Bottom Left
            if let dew = dewPoint {
                 // Format matches screenshot "The dew point is 7° right now."
                Text(
                    localizedFormat(NSLocalizedString("dewPoint.current", comment: ""),
                        Int(dew.rounded())
                    )
                )
                    .font(.system(size: 12))
                    .foregroundStyle(.primary)
                    .fixedSize(horizontal: false, vertical: true)
            } else {
                 Text(" ") // Placeholder if no dew point
                    .font(.system(size: 12))
            }
        }
    }
}
