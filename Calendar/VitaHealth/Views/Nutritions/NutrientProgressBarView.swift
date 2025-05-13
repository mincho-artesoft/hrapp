import SwiftUI
import SwiftData

// MARK: - Helper Extension

extension CGFloat {
    /// Clamps a value to the given closed range.
    func clamped(to range: ClosedRange<CGFloat>) -> CGFloat {
        Swift.min(Swift.max(self, range.lowerBound), range.upperBound)
    }
}

// MARK: - Triangle Shape

/// A custom triangle shape used for marker indicators.
struct Triangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let topCenter = CGPoint(x: rect.midX, y: rect.minY)
        let bottomLeft = CGPoint(x: rect.minX, y: rect.maxY)
        let bottomRight = CGPoint(x: rect.maxX, y: rect.maxY)
        path.move(to: topCenter)
        path.addLine(to: bottomLeft)
        path.addLine(to: bottomRight)
        path.closeSubpath()
        return path
    }
}

// MARK: - NutrientProgressBarView

/// Displays a progress bar with markers for the daily need, upper limit, and maximum value.
/// An overlaid current–value label is positioned at the end of the filled portion.
struct NutrientProgressBarView: View {
    var currentValue: Double   // Total nutrient amount (used to calculate progress)
    var dailyNeed: Double      // A marker value (e.g. the recommended daily intake)
    var upperLimit: Double     // A marker value (e.g. the safe upper limit)
    
    /// The maximum value used to scale the progress bar.
    private var maxValue: Double {
        let validUpper = upperLimit > 0 ? upperLimit : dailyNeed
        return validUpper * 1.2
    }
    
    /// Determines the fill color based on the ratio of the current value to the daily need.
    private var fillColor: Color {
        guard dailyNeed > 0 else { return .gray }
        let ratio = currentValue / dailyNeed
        if ratio < 0.5 {
            return .red
        } else if ratio < 0.8 {
            return .blue
        } else if ratio <= 1.2 {
            return .green
        } else if ratio <= 1.5 {
            return .blue
        } else {
            return .red
        }
    }
    
    var body: some View {
        VStack(spacing: 8) {
            // MARK: Progress Bar and Top Marker
            GeometryReader { geo in
                let width = geo.size.width
                let progressFraction = min(currentValue / maxValue, 1.0)
                let progressWidth = width * CGFloat(progressFraction)
                let dailyX = width * CGFloat(dailyNeed / maxValue)
                let upperX = width * CGFloat(upperLimit / maxValue)
                
                ZStack(alignment: .leading) {
                    // Background bar.
                    Rectangle()
                        .fill(Color.gray.opacity(0.3))
                        .frame(height: 10)
                    
                    // Filled portion.
                    Rectangle()
                        .fill(fillColor)
                        .frame(width: progressWidth, height: 10)
                }
                .overlay(
                    // Marker triangles for dailyNeed and upperLimit.
                    ZStack {
                        Triangle()
                            .fill(Color.gray)
                            .frame(width: 10, height: 10)
                            .position(x: dailyX.clamped(to: 5...width - 5), y: 15)
                        Triangle()
                            .fill(Color.gray)
                            .frame(width: 10, height: 10)
                            .position(x: upperX.clamped(to: 5...width - 5), y: 15)
                    }
                )
                .overlay(
                    // Current value label.
                    Text("\(currentValue, specifier: "%.0f")")
                        .font(.caption2)
                        .foregroundColor(.primary)
                        .padding(4)
                        .background(
                            RoundedRectangle(cornerRadius: 3)
                                .fill(Color.white.opacity(0.8))
                        )
                        .position(x: progressWidth.clamped(to: 20...width - 20), y: -10)
                )
            }
            .frame(height: 30)
            
            // MARK: Numeric Labels Below the Bar.
            GeometryReader { geo in
                let width = geo.size.width
                let dailyX = width * CGFloat(dailyNeed / maxValue)
                let upperX = width * CGFloat(upperLimit / maxValue)
                
                ZStack {
                    Text("\(dailyNeed, specifier: "%.0f")")
                        .font(.caption2)
                        .foregroundColor(.primary)
                        .position(x: dailyX.clamped(to: 20...width - 20), y: geo.size.height / 2 - 20)
                    Text("\(upperLimit, specifier: "%.0f")")
                        .font(.caption2)
                        .foregroundColor(.primary)
                        .position(x: upperX.clamped(to: 20...width - 20), y: geo.size.height / 2 - 20)
                }
            }
            .frame(height: 20)
        }
    }
}

// MARK: - SwiftUI Views

/// A view that uses a text field. (This text field benefits from our swizzling tweaks.)
struct PreloadedTextField: View {
    @State private var text: String = ""
    var body: some View {
        TextField("Enter text...", text: $text)
            .textFieldStyle(RoundedBorderTextFieldStyle())
            .padding()
    }
}
