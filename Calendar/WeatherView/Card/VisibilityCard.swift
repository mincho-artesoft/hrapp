import SwiftUI

struct VisibilityCard: View {
    let visibilityKm: Double?

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label("VISIBILITY", systemImage: "eye.fill")
                .symbolRenderingMode(.hierarchical) // Subtle icon style
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)

            // Main Value - Below Title
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                if let vis = visibilityKm {
                    Text(String(format: "%.0f", vis))
                        .font(.system(size: 34, weight: .regular))
                        .foregroundStyle(.primary)
                    Text("km")
                         .font(.system(size: 14, weight: .regular))
                         .foregroundStyle(.secondary)
                } else {
                    Text("—")
                        .font(.system(size: 34, weight: .regular))
                        .foregroundStyle(.primary)
                     Text("km")
                          .font(.system(size: 14, weight: .regular))
                          .foregroundStyle(.secondary)
                }
            }

             Spacer() // Pushes description to the bottom

            // Description - Bottom Left
            Text(visibilityDescription(vis: visibilityKm))
                 .font(.system(size: 12))
                 .foregroundStyle(.primary)
        }
    }

    // Visibility description helper (same as before)
    func visibilityDescription(vis: Double?) -> String {
        guard let vis = vis else { return " " }
        if vis > 20 { return "Perfectly clear view." }
        if vis > 15 { return "Excellent visibility." } // Match screenshot
        if vis > 10 { return "Good visibility." }
        if vis > 5 { return "Moderate visibility." }
        if vis > 1 { return "Poor visibility." }
        return "Very poor visibility."
    }
}
