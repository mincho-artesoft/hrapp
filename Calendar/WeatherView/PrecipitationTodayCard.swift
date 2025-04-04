import SwiftUI

struct PrecipitationTodayCard: View {
    let amount: Double? // in mm
    let nextExpectedAmount: Double?
    let nextExpectedTimeString: String?

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label("PRECIPITATION", systemImage: "drop.fill")
                .symbolRenderingMode(.multicolor) // Blue drop
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)

            // Main Value - Below Title
            HStack(alignment: .firstTextBaseline, spacing: 2) { // Align value and unit
                 Text(String(format: "%.0f", amount ?? 0)) // No decimal for mm
                     .font(.system(size: 34, weight: .regular))
                     .foregroundStyle(.primary)
                 Text("mm") // Unit separate
                     .font(.system(size: 14, weight: .regular)) // Smaller unit font
                     .foregroundStyle(.secondary) // Unit is secondary
                 Text("today") // Description separate
                      .font(.system(size: 12, weight: .regular))
                      .foregroundStyle(.secondary)
                      .padding(.leading, 2)
            }


            Spacer() // Pushes description to the bottom

            // Description - Bottom Left
             if let amount = nextExpectedAmount, amount > 0.1, let time = nextExpectedTimeString {
                // Format matches screenshot "Next expected is 1 mm on Mon."
                Text("Next expected is \(String(format: "%.0f", amount)) mm \(time).")
                    .font(.system(size: 12))
                    .foregroundStyle(.primary)
            } else {
                 Text("No precipitation expected soon.") // Simplified message
                    .font(.system(size: 12))
                    .foregroundStyle(.primary)
            }
        }
    }
}
