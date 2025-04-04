import SwiftUI

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
