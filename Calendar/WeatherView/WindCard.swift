import SwiftUI

struct WindCard: View {
    let windSpeedKmh: Double
    let gustSpeedKmh: Double?
    let direction: Angle?
    let directionAbbreviation: String

    // Wind compass styled like the screenshot
    @ViewBuilder func windCompass() -> some View {
         ZStack {
             // Subtle ticks
              ForEach(0..<12) { i in
                 Rectangle()
                     .fill(Color.secondary.opacity(0.5))
                      // Make N, E, S, W ticks slightly longer/thicker if desired
                     .frame(width: i % 3 == 0 ? 1.5 : 1, height: i % 3 == 0 ? 6 : 4)
                     .offset(y: -28) // Position on radius
                     .rotationEffect(.degrees(Double(i) * 30))
              }

             // Direction letters (bolder)
             Text("N").font(.caption.weight(.semibold)).foregroundStyle(.primary).offset(y: -38)
             Text("S").font(.caption.weight(.semibold)).foregroundStyle(.primary).offset(y: 38)
             Text("W").font(.caption.weight(.semibold)).foregroundStyle(.primary).offset(x: -38)
             Text("E").font(.caption.weight(.semibold)).foregroundStyle(.primary).offset(x: 38)

             // Wind Vane Arrow (points FROM direction)
              Image(systemName: "location.north.fill") // Use location arrow shape from screenshot
                  .resizable()
                  .scaledToFit()
                  .frame(width: 12, height: 12) // Smaller arrow
                  .foregroundStyle(.primary)
                  // Rotate arrow TO the direction wind is blowing FROM
                  .rotationEffect((direction ?? Angle.zero) + Angle.degrees(180))


             // Central speed display
             VStack(spacing: -2) { // Reduced spacing for compact look
                  Text(String(format: "%.0f", windSpeedKmh))
                       .font(.system(size: 20, weight: .medium)) // Prominent speed
                       .foregroundStyle(.primary)
                  Text("km/h")
                       .font(.system(size: 9, weight: .medium)) // Smaller units
                       .foregroundStyle(.secondary) // Units are secondary
             }
         }
         .frame(width: 80, height: 80) // Maintain compass size
    }

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label("WIND", systemImage: "wind")
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)

            // Use HStack to place text left, compass right
            HStack(alignment: .center) {
                // Text Content - Left Side
                VStack(alignment: .leading, spacing: 4) {
                    // Wind Direction Text (e.g., "Wind SW")
                    Text("Wind \(directionAbbreviation)")
                         .font(.system(size: 16, weight: .medium)) // Larger direction text
                         .foregroundStyle(.primary)

                    // Gusts Text (prominent)
                    if let gust = gustSpeedKmh, gust > windSpeedKmh {
                        Text("Gusts \(Int(gust.rounded())) km/h")
                             .font(.system(size: 18, weight: .regular)) // Large gusts value
                             .foregroundStyle(.primary)
                    } else {
                         // Add placeholder if needed for alignment, or just empty
                         Text(" ") // Keep space consistent
                              .font(.system(size: 18, weight: .regular))
                    }
                     // Add Spacer if needed to push text up within its column
                     // Spacer()
                }

                Spacer() // Pushes compass to the right

                // Compass - Right Side
                windCompass()
            }
             // Add Spacer below the HStack if the card needs more vertical fill
             // Spacer()
        }
    }
}

