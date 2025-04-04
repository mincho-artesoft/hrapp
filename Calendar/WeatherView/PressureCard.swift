import SwiftUICore

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
