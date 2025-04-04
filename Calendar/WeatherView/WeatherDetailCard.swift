import SwiftUI
import WeatherKit // For Angle

// MARK: - Base Card Styling
struct WeatherDetailCard<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        // The VStack now arranges content vertically, Spacer will push elements apart
        VStack(alignment: .leading, spacing: 5) {
            content // The specific card's content goes here
        }
        // Ensure the VStack fills the card vertically to allow Spacer to work
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .padding(.horizontal, 15)
        .padding(.vertical, 12)
        .background(
            // Use ultraThinMaterial for the frosted glass look consistent with screenshots
           .ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12)
        )
         // Force dark elements assuming the background material is light/translucent
         // Remove or change this if your app supports light mode differently
        .colorScheme(.dark)
    }
}

// MARK: - Individual Card Views (STYLED)

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
        if abs(diff) < 1.5 { return "Similar to the actual temperature." }
        else if diff < 0 { return "Wind is making it feel cooler." }
        else { return "Humidity is making it feel warmer." }
    }
}

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


struct SunsetCard: View {
    let sunrise: Date?
    let sunset: Date?
    let formatTime: (Date?) -> String // Expects a function like vm.formatTime

    // Sun arc view styled like the screenshot
    @ViewBuilder func sunArc() -> some View {
         Canvas { context, size in
             // Ensure size is valid for drawing
             guard size.width > 0, size.height > 0 else { return }

             // Calculate geometry constants
             let diameter = min(size.width, size.height * 2) // Arc diameter based on available space
             let radius = diameter / 2
             guard radius > 0 else { return } // Ensure radius is positive

             let center = CGPoint(x: size.width / 2, y: size.height) // Arc's center at bottom-middle

             // Calculate current sun position fraction (0.0 at sunrise, 1.0 at sunset)
             let now = Date()
             var sunFraction: Double = 0.5 // Default to noon if times are missing or invalid
             if let rise = sunrise, let set = sunset, rise < set { // Ensure valid rise/set times
                 let totalDuration = set.timeIntervalSince(rise)
                 if totalDuration > 0 {
                     let elapsed = now.timeIntervalSince(rise)
                     // Clamp fraction between 0 (sunrise) and 1 (sunset)
                     sunFraction = max(0.0, min(1.0, elapsed / totalDuration))
                 } else if now >= set { // Handle edge case where sun has set or rise/set are simultaneous
                    sunFraction = 1.0
                 } else if now < rise { // Handle case where sun hasn't risen yet
                    sunFraction = 0.0
                 }
             } else if let set = sunset, now >= set { // Handle only sunset time available
                 sunFraction = 1.0
             } else if let rise = sunrise, now < rise { // Handle only sunrise time available
                 sunFraction = 0.0
             }

             // --- Angle Calculations for Canvas/addArc Coordinate System ---
             // 0 degrees = right, 180 degrees = left, 270 = bottom
             let startAngle = Angle.degrees(180) // Start arc at the left (sunrise)
             // Calculate the total sweep angle based on the sun's progress (max 180 degrees)
             let currentSweepDegrees = sunFraction * 180.0
             // The end angle for the progress arc goes from 180 up to 360 degrees
             let endAngleProgress = Angle.degrees(180.0 + currentSweepDegrees)
             // The angle where the sun symbol should be placed is the same as the progress end angle
             let finalSunAngle = endAngleProgress


             // Calculate Sun's (x, y) coordinates on the arc
             let sunX = center.x + radius * CGFloat(cos(finalSunAngle.radians))
             let sunY = center.y + radius * CGFloat(sin(finalSunAngle.radians))
             // --- End Angle Calculations ---


             // 1. Draw the dashed background arc path (the full semi-circle)
             let fullArcPath = Path { path in
                 path.addArc(center: center, radius: radius, startAngle: startAngle, endAngle: .degrees(360), clockwise: false)
             }
             // Stroke the path with a dashed style and secondary color
             context.stroke(fullArcPath, with: .color(.secondary.opacity(0.7)), style: StrokeStyle(lineWidth: 1, dash: [3, 3]))


             // 2. Draw the solid line path representing sun's progress (REMOVED to match screenshot)
             /*
             if sunFraction > 0 && sunrise != nil && sunset != nil && sunrise! < sunset! {
                 let progressArcPath = Path { path in
                     // Draw arc from start angle to the current sun progress angle
                     path.addArc(center: center, radius: radius, startAngle: startAngle, endAngle: endAngleProgress, clockwise: false)
                 }
                 // Stroke with primary color, slightly thicker
                 context.stroke(progressArcPath, with: .color(.primary.opacity(0.8)), lineWidth: 1.5)
             }
             */


             // 3. Draw the sun symbol at its calculated position
             // --- Create a Text view containing the symbol ---
             let sunSymbolText = Text(Image(systemName: "sun.max.fill")) // Embed symbol in Text
                                 .font(.system(size: 10)) // Control size via font
                                 .foregroundStyle(.yellow) // Set color

             // --- Resolve the Text view for drawing ---
             let resolvedSunText = context.resolve(sunSymbolText)

             // Define the drawing point
             let drawPoint = CGPoint(x: sunX, y: sunY)

             // Draw the resolved Text if times are available (sun is somewhere)
             if sunrise != nil || sunset != nil {
                 context.draw(resolvedSunText, at: drawPoint, anchor: .center) // Anchor ensures center of text is at drawPoint
             }

         } // End Canvas
         .frame(height: 50) // Set the desired height for the Canvas view
         // --- Corrected Overlay for Time Labels using HStack ---
         .overlay(alignment: .bottom) { // Single overlay at the bottom
             HStack { // Use HStack to position labels side-by-side
                 Text("Sunrise: \(formatTime(sunrise))")
                 Spacer() // Pushes labels to edges
                 Text("Sunset: \(formatTime(sunset))")
             }
             .font(.system(size: 9)) // Apply font once to HStack
             .foregroundStyle(.secondary.opacity(0.8)) // Apply color once
             .padding(.horizontal, 5) // Add horizontal padding to inset from edges
             // Optionally add a slight vertical offset if needed
             // .offset(y: 5) // Example offset
         }
         // --- End of Correction ---
         .padding(.bottom, 5) // Keep padding below the overlay
    }

    // The main body of the SunsetCard view
    var body: some View {
        // Use the base card styling
        WeatherDetailCard {
            // Card Title Label - Use "SUNRISE" to match the time displayed
            Label("SUNRISE", systemImage: "sunrise.fill") // Changed icon and label
                .symbolRenderingMode(.multicolor) // Use colors defined in the symbol
                .font(.system(size: 10, weight: .medium)) // Title font style
                .foregroundStyle(.secondary) // Title color

            // Main Value - Display SUNRISE time to match screenshot's AM value
            Text(formatTime(sunrise)) // Display sunrise time
                .font(.system(size: 34, weight: .regular)) // Main value font style
                .foregroundStyle(.primary) // Main value color

            Spacer() // Pushes arc to the bottom

            // Add the Sun Arc Canvas View
            sunArc()
        }
    }
}


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

struct HumidityCard: View {
    let humidity: Double? // 0.0 to 1.0
    let dewPoint: Double?

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label("HUMIDITY", systemImage: "humidity.fill")
                .symbolRenderingMode(.multicolor) // Blue drop inside
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)

            // Main Value - Below Title
            Text("\(Int((humidity ?? 0) * 100))%")
                .font(.system(size: 34, weight: .regular))
                .foregroundStyle(.primary)

             Spacer() // Pushes description to the bottom

            // Description - Bottom Left
            if let dew = dewPoint {
                 // Format matches screenshot "The dew point is 7° right now."
                 Text("The dew point is \(Int(dew.rounded()))° right now.")
                    .font(.system(size: 12))
                    .foregroundStyle(.primary)
            } else {
                 Text(" ") // Placeholder if no dew point
                    .font(.system(size: 12))
            }
        }
    }
}

struct PressureCard: View {
    let pressure: Double? // hPa
    let trend: String?

    // Pressure gauge styled like the screenshot
    @ViewBuilder func pressureGauge() -> some View {
         Canvas { context, size in
            let diameter = min(size.width, size.height) * 0.8 // Make gauge slightly smaller
            let radius = diameter / 2
             guard radius > 0 else { return }
            let center = CGPoint(x: size.width / 2, y: size.height / 2)

             // Pressure range and angles
             let minPressure: Double = 960
             let maxPressure: Double = 1060
             let pressureRange = maxPressure - minPressure
             let startAngle = Angle.degrees(-135 - 90) // Start from bottom-left quarter
             let endAngle = Angle.degrees(135 - 90)   // End at bottom-right quarter
             let totalAngle = endAngle - startAngle

             // Current pressure fraction and needle angle
             var pressureFraction: Double = 0.5
             if let p = pressure {
                 pressureFraction = max(0.0, min(1.0, (p - minPressure) / pressureRange))
             }
             let needleAngle = startAngle + (totalAngle * pressureFraction)

             // 1. Draw the gauge background arc (subtle)
             let gaugePath = Path { path in
                 path.addArc(center: center, radius: radius, startAngle: startAngle, endAngle: endAngle, clockwise: false)
             }
             context.stroke(gaugePath, with: .color(.secondary.opacity(0.6)), style: StrokeStyle(lineWidth: 2, lineCap: .round))

             // 2. Draw the needle
             let needlePath = Path { path in
                 // Base of the needle
                 path.move(to: CGPoint(x: center.x + cos(needleAngle.radians + .pi/2) * radius * 0.1,
                                      y: center.y + sin(needleAngle.radians + .pi/2) * radius * 0.1))
                 // Tip of the needle
                 path.addLine(to: CGPoint(x: center.x + cos(needleAngle.radians) * radius * 0.9, // Needle length
                                         y: center.y + sin(needleAngle.radians) * radius * 0.9))
                 // Other base point
                  path.addLine(to: CGPoint(x: center.x + cos(needleAngle.radians - .pi/2) * radius * 0.1,
                                           y: center.y + sin(needleAngle.radians - .pi/2) * radius * 0.1))
                 path.closeSubpath()
             }
             context.fill(needlePath, with: .color(.primary)) // Fill needle with primary color

             // 3. Draw the center hub
             let hubSize = radius * 0.15
             let hubRect = CGRect(x: center.x - hubSize / 2, y: center.y - hubSize / 2, width: hubSize, height: hubSize)
             context.fill(Path(ellipseIn: hubRect), with: .color(.primary)) // Primary hub

             // Trend arrow is omitted to match screenshot gauge simplicity

         }
         .frame(width: 80, height: 60) // Gauge area size
         // Overlay for Low/High labels matching screenshot
         .overlay(alignment: .bottomLeading) {
             Text("Low")
                 .font(.system(size: 10, weight: .medium))
                 .foregroundStyle(.secondary)
                 .offset(x: 5, y: 5) // Position labels
         }
         .overlay(alignment: .bottomTrailing) {
             Text("High")
                  .font(.system(size: 10, weight: .medium))
                  .foregroundStyle(.secondary)
                  .offset(x: -5, y: 5) // Position labels
         }
         .padding(.bottom, 10) // Padding below gauge
    }

    var body: some View {
        WeatherDetailCard {
            // Title - Top Left
            Label("PRESSURE", systemImage: "gauge.medium")
                .symbolRenderingMode(.hierarchical)
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(.secondary)

            // Main Value - Below Title
            HStack(alignment: .firstTextBaseline, spacing: 2) {
                 if let pres = pressure {
                     // Format with comma using NumberFormatter if desired for locale
                     Text(formatPressure(pres))
                     // Text(String(format: "%.0f", pres.rounded())) // Original formatting
                        .font(.system(size: 34, weight: .regular))
                        .foregroundStyle(.primary)
                     Text("hPa")
                         .font(.system(size: 14, weight: .regular))
                         .foregroundStyle(.secondary)
                         .offset(y: -2) // Adjust baseline slightly
                 } else {
                     Text("—")
                        .font(.system(size: 34, weight: .regular))
                        .foregroundStyle(.primary)
                     Text("hPa")
                          .font(.system(size: 14, weight: .regular))
                          .foregroundStyle(.secondary)
                          .offset(y: -2)
                 }
             }

             Spacer() // Pushes gauge to the bottom

            // Pressure Gauge - Bottom
            pressureGauge()
        }
    }

    // Helper to format pressure potentially with locale-specific grouping separator
    private func formatPressure(_ pressureValue: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal // Use decimal style
        formatter.maximumFractionDigits = 0 // No decimal places
        formatter.groupingSeparator = "," // Example: force comma
        formatter.usesGroupingSeparator = true // Enable grouping
        return formatter.string(from: NSNumber(value: pressureValue.rounded())) ?? String(format: "%.0f", pressureValue.rounded())
    }
}
