import SwiftUI
import WeatherKit // Only needed if you use WeatherKit types directly, not strictly necessary here

struct HourlyFeelsLikeDetailView: View {
    // Data passed in
    let hourlyItems: [HourlyForecastItem] // Assumes this contains at least a few hours for the graph
    let currentActualTemp: Double?
    let currentFeelsLikeTemp: Double?
    let selectedDate: Date // The date this forecast is for (used for the header)

    // State for the Actual/Feels Like toggle
    @State private var showingFeelsLike = true // Start with "Feels Like" selected (as per screenshot)

    // Environment for dismissing the sheet
    @Environment(\.dismiss) var dismiss

    // Date Formatters (matching screenshot)
    private var headerDateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, d MMMM yyyy" // Friday, 4 April 2025
        return formatter
    }
    private var dayInitialFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "E" // T, F, S, S, M, T, W
        return formatter
    }
    private var dayOfMonthFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "d" // 3, 4, 5, 6, 7, 8, 9
        return formatter
    }

    // Constants for Graph
    private let yAxisLabelCount = 7 // 20, 15, 10, 5, 0, -5, -10
    private let graphPadding: CGFloat = 20 // Padding inside the canvas for the line
    private let yAxisLabelWidth: CGFloat = 30 // Space for labels like "-10°"

    // Computed properties for graph data range
    private var temperatures: [Double] {
        hourlyItems.map { showingFeelsLike ? $0.feelsLikeTemp : $0.temp }
    }
    private var tempMin: Double {
        (temperatures.min() ?? 0).rounded(.down) - 2 // Add some buffer
    }
    private var tempMax: Double {
        (temperatures.max() ?? 20).rounded(.up) + 2 // Add some buffer
    }
    // Calculate a reasonable Y-axis range based on data, snapped to nearest 5 or 10
     private var yAxisRange: (min: Double, max: Double) {
         let dataMin = temperatures.min() ?? 0
         let dataMax = temperatures.max() ?? 20
         let range = max(10, dataMax - dataMin) // Ensure minimum range

         // Snap to nearest 5 or 10 for cleaner labels
         let snappedMin = floor((dataMin - range * 0.1) / 5.0) * 5.0
         let snappedMax = ceil((dataMax + range * 0.1) / 5.0) * 5.0
         // Ensure max is always greater than min
         return (min: snappedMin, max: max(snappedMin + 5, snappedMax))
     }
     private var yAxisLabels: [Double] {
         let range = yAxisRange
         let step = max(1.0, floor((range.max - range.min) / Double(yAxisLabelCount - 1) / 5.0) * 5.0) // Step by 5 typically
         return stride(from: range.min, through: range.max, by: step).map { $0 }
     }


    var body: some View {
        // --- Main Container ---
        VStack(spacing: 0) { // No spacing for seamless look
            // --- Custom Navigation Bar Area ---
            customNavBar
                .padding(.bottom, 5)

            // --- Scrollable Content ---
            ScrollView {
                VStack(alignment: .leading, spacing: 5) { // Reduced spacing

                    // Date Selector Header
                    dateSelectorHeader
                        .padding(.bottom, 10)

                    // Current Status Header
                    currentStatusHeader
                        .padding(.horizontal) // Add horizontal padding
                        .padding(.bottom, 15)

                    // Hourly Icons Row
                    hourlyIconsRow
                         .padding(.horizontal, 5) // Minimal padding for icons

                    // Hourly Graph Section
                    hourlyGraphSection() // Pass data dynamically
                        .padding(.vertical, 5) // Reduced padding

                    // X Axis Labels (Aligned below graph)
                    graphXAxisLabels
                        .padding(.horizontal, graphPadding / 2) // Align with graph content area
                        .padding(.top, -5) // Pull closer to graph divider


                    // Actual / Feels Like Toggle Buttons
                    actualFeelsLikeToggle
                        .padding(.vertical, 15) // More padding around toggle
                        .padding(.horizontal)

                    // Description Text
                    Text("What the temperature feels like as a result of humidity, sunlight or wind.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.horizontal)
                        .padding(.bottom)

                    // Chance of Precipitation Section
                    ChanceOfPrecipitationSection
                         .padding(.horizontal)
                         .padding(.bottom)

                    Spacer() // Pushes content up
                }
            }
        }
        .background(Color.black.edgesIgnoringSafeArea(.all)) // Dark background like screenshot
        .foregroundColor(.white) // Default text color to white
        .colorScheme(.dark) // Force dark mode elements (like status bar)
    }


    // MARK: - Subviews

    // Custom Navigation Bar simulation
    private var customNavBar: some View {
        HStack {
            Spacer() // Pushes title to center

            Label("Conditions", systemImage: "cloud.fill")
                .font(.headline)
                .foregroundColor(.white) // Explicitly white

            Spacer() // Pushes button to trailing edge

            Button { dismiss() } label: {
                Image(systemName: "xmark")
                    .font(.body.weight(.semibold))
                    .foregroundColor(Color.white.opacity(0.7)) // Match screenshot color
                    .padding(8)
                    .background(Color.white.opacity(0.15)) // Match screenshot background
                    .clipShape(Circle())
            }
        }
        .padding(.horizontal)
        .padding(.top, 5) // Adjust top padding as needed for safe area
        .frame(height: 44) // Standard nav bar height
    }


    // Header similar to screenshot with Day/Date buttons
    private var dateSelectorHeader: some View {
        VStack(spacing: 2) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 15) { // Increased spacing
                    // Generate day items dynamically (e.g., 1 before, selected, 5 after)
                    ForEach(-1..<6) { i in
                        let date = Calendar.current.date(byAdding: .day, value: i, to: selectedDate)!
                        let isSelected = Calendar.current.isDate(date, inSameDayAs: selectedDate)

                        VStack(spacing: 5) { // Increased spacing
                             Text(dayInitialFormatter.string(from: date).prefix(1)) // T, F, S...
                                  .font(.system(size: 12, weight: isSelected ? .bold : .medium))
                                  .foregroundColor(isSelected ? .white : .gray) // Gray for non-selected

                             Text(dayOfMonthFormatter.string(from: date)) // 3, 4, 5...
                                  .font(.system(size: 14, weight: isSelected ? .bold : .medium))
                                  .foregroundColor(isSelected ? .white : .white.opacity(0.9)) // Slightly dimmer non-selected numbers
                        }
                        .frame(width: 30, height: 45) // Adjust size
                        .background(
                             Circle()
                                 .fill(isSelected ? Color.blue : Color.clear) // Blue circle only if selected
                         )
                         // Add tap gesture if you want to make them selectable
                         // .onTapGesture { /* Update selectedDate */ }
                    }
                }
                .padding(.horizontal)
            }
            // Date String below the day selector
            Text(selectedDate, formatter: headerDateFormatter) // Friday, 4 April 2025
                .font(.system(size: 12)) // Match screenshot font size
                .foregroundColor(.gray) // Match screenshot color
                .padding(.top, 4) // Padding above the date string
        }
    }

    // Current Temperature and Icon Header
    private var currentStatusHeader: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) { // Reduced spacing
                Text("\(Int((showingFeelsLike ? currentFeelsLikeTemp : currentActualTemp) ?? 0))°")
                    .font(.system(size: 60, weight: .thin)) // Large temperature

                Text(showingFeelsLike ? "Actual: \(Int(currentActualTemp ?? 0))°" : "Feels Like: \(Int(currentFeelsLikeTemp ?? 0))°")
                    .font(.system(size: 13)) // Slightly larger footnote
                    .foregroundColor(.gray) // Match screenshot color
            }
            Spacer()
            Image(systemName: hourlyItems.first?.symbol ?? "cloud.sun.fill") // Use first hour's symbol
                .renderingMode(.original) // Use multicolor rendering
                .font(.system(size: 40)) // Adjust icon size
        }
    }

     // Row of Hourly Icons above the Graph
     private var hourlyIconsRow: some View {
         HStack(spacing: 0) {
             // Ensure we have items before trying to iterate
             if !hourlyItems.isEmpty {
                 ForEach(hourlyItems) { item in
                     Image(systemName: item.symbol)
                         .renderingMode(.original)
                         .font(.system(size: 12))
                         .frame(maxWidth: .infinity, alignment: .center) // Distribute evenly
                 }
             } else {
                 Text("").frame(maxWidth: .infinity) // Placeholder if no data
             }
         }
     }

    // Creates the Graph Canvas and its Y-Axis Labels
    @ViewBuilder
    private func hourlyGraphSection() -> some View {
        let yRange = yAxisRange // Calculate range once
        let currentTemperatures = temperatures // Get current data set

        HStack(spacing: 2) { // Minimal spacing between graph and labels
            Canvas { context, size in
                // Guard against drawing with no data or zero size
                guard !currentTemperatures.isEmpty, size.width > 0, size.height > 0 else { return }

                let graphWidth = size.width - graphPadding * 2
                let graphHeight = size.height - graphPadding * 2
                let origin = CGPoint(x: graphPadding, y: size.height - graphPadding) // Bottom-Left of graph area

                // --- Draw Horizontal Grid Lines & Y-Axis Labels ---
                let yStep = (yRange.max > yRange.min) ? graphHeight / CGFloat(yRange.max - yRange.min) : 0
                for tempLabelValue in yAxisLabels {
                    let yPos = origin.y - CGFloat(tempLabelValue - yRange.min) * yStep
                    var path = Path()
                    path.move(to: CGPoint(x: origin.x, y: yPos))
                    path.addLine(to: CGPoint(x: origin.x + graphWidth, y: yPos))
                    // Draw dashed grid line inside Canvas
                     context.stroke(path, with: .color(.gray.opacity(0.4)), style: StrokeStyle(lineWidth: 0.5, dash: [3, 3]))
                }

                // --- Draw Temperature Line ---
                var linePath = Path()
                var points: [CGPoint] = [] // Store points for H/L markers
                let xStep = graphWidth / CGFloat(max(1, currentTemperatures.count - 1))

                for (index, temp) in currentTemperatures.enumerated() {
                    let xPos = origin.x + CGFloat(index) * xStep
                    let yPos = origin.y - CGFloat(temp - yRange.min) * yStep
                    let point = CGPoint(x: xPos, y: yPos)
                    points.append(point)

                    if index == 0 {
                        linePath.move(to: point)
                    } else {
                        linePath.addLine(to: point)
                    }
                }
                // Stroke the line with a gradient (simple example)
                 let gradient = Gradient(colors: [.cyan.opacity(0.7), .green.opacity(0.7)])
                 context.stroke(linePath, with: .linearGradient(gradient, startPoint: origin, endPoint: CGPoint(x: origin.x + graphWidth, y: origin.y - graphHeight)), lineWidth: 2.5)


                // --- Draw H/L Markers ---
                if let maxTempIndex = currentTemperatures.indices.max(by: { currentTemperatures[$0] < currentTemperatures[$1] }),
                   points.indices.contains(maxTempIndex) {
                    let highPoint = points[maxTempIndex]
                    // Draw 'H' slightly above the point
                     context.draw(Text("H").font(.system(size: 10, weight: .bold)).foregroundColor(.white), at: CGPoint(x: highPoint.x, y: highPoint.y - 10))
                     // Optional: Draw a small circle marker on the line
                      // context.fill(Path(ellipseIn: CGRect(x: highPoint.x - 2, y: highPoint.y - 2, width: 4, height: 4)), with: .color(.white))
                }
                if let minTempIndex = currentTemperatures.indices.min(by: { currentTemperatures[$0] < currentTemperatures[$1] }),
                   points.indices.contains(minTempIndex) {
                    let lowPoint = points[minTempIndex]
                     // Draw 'L' slightly below the point
                     context.draw(Text("L").font(.system(size: 10, weight: .bold)).foregroundColor(.white), at: CGPoint(x: lowPoint.x, y: lowPoint.y + 10))
                     // Optional: Circle marker
                      // context.fill(Path(ellipseIn: CGRect(x: lowPoint.x - 2, y: lowPoint.y - 2, width: 4, height: 4)), with: .color(.white))
                }


            }
            .frame(height: 150) // Fixed height for the graph canvas
            .padding(.leading, graphPadding / 2) // Indent graph slightly for X labels below
            .padding(.trailing, yAxisLabelWidth) // Make space for Y labels

            // --- Y-Axis Labels (Drawn outside Canvas for easier text layout) ---
            VStack(alignment: .trailing, spacing: 0) {
                 if yRange.max > yRange.min { // Avoid division by zero if range is invalid
                     let graphHeight = 150.0 - graphPadding * 2 // Match canvas drawing height
                     let yStep = graphHeight / CGFloat(yRange.max - yRange.min)

                     ForEach(yAxisLabels.reversed(), id: \.self) { tempLabelValue in
                         Text("\(Int(tempLabelValue))°")
                             .font(.system(size: 10))
                             .foregroundColor(.gray)
                             .frame(width: yAxisLabelWidth, alignment: .trailing)
                             // Position labels based on their value within the visible graph height
                             .offset(y: graphPadding + (CGFloat(tempLabelValue - yRange.min) * yStep) - (150.0/2.0) - 5) // Complex offset calculation to align
                         Spacer() // Distribute labels vertically
                     }
                 }
            }
            .frame(height: 150) // Match canvas height
            .padding(.trailing, 5) // Padding from the screen edge
        }
        // Divider Line below Graph Area
         Divider()
              .background(Color.gray.opacity(0.4))
              .padding(.horizontal, graphPadding / 2) // Align divider with graph area
              .padding(.top, -graphPadding) // Pull divider up closer to canvas bottom padding
    }

    // X-Axis Labels (00, 06, 12, 18)
     private var graphXAxisLabels: some View {
          HStack(spacing: 0) {
              // Assuming hourlyItems covers roughly 24h, place labels approximately
              Text("00").frame(maxWidth: .infinity, alignment: .center)
              Text("06").frame(maxWidth: .infinity, alignment: .center)
              Text("12").frame(maxWidth: .infinity, alignment: .center)
              Text("18").frame(maxWidth: .infinity, alignment: .center)
          }
          .font(.system(size: 11))
          .foregroundColor(.gray)
          .padding(.top, 4) // Padding below the divider
     }


    // Actual/Feels Like Toggle styled like the screenshot
    private var actualFeelsLikeToggle: some View {
        HStack(spacing: 5) { // Spacing between buttons
            Button { showingFeelsLike = false } label: {
                Text("Actual")
                    .font(.system(size: 12, weight: .medium))
                    .padding(.vertical, 6)
                    .padding(.horizontal, 12)
                    .frame(maxWidth: .infinity)
                    .foregroundColor(showingFeelsLike ? .gray : .white) // Selected text is white
                    .background(showingFeelsLike ? Color.clear : Color.white.opacity(0.25)) // Selected background
                    .cornerRadius(15)
            }
            .buttonStyle(.plain)

            Button { showingFeelsLike = true } label: {
                Text("Feels Like")
                    .font(.system(size: 12, weight: .medium))
                    .padding(.vertical, 6)
                    .padding(.horizontal, 12)
                    .frame(maxWidth: .infinity)
                    .foregroundColor(showingFeelsLike ? .white : .gray)
                    .background(showingFeelsLike ? Color.white.opacity(0.25) : Color.clear)
                    .cornerRadius(15)
            }
            .buttonStyle(.plain)
        }
        .padding(3) // Padding inside the outer capsule
        .background(Color.white.opacity(0.1)) // Background for the toggle container
        .clipShape(Capsule())
    }

    // Chance of Precipitation Section
    private var ChanceOfPrecipitationSection: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text("Chance of Precipitation")
                .font(.system(size: 16, weight: .medium)) // Slightly bolder title
                .padding(.bottom, 2)
            // --- TODO: Replace with actual data ---
            // Find precipitation chance for the selected day from your daily forecast data if available
            let precipChance = 0 // Placeholder
            Text("Today's chance: \(precipChance)%")
            // --- End TODO ---
                .font(.system(size: 14)) // Match size
                .foregroundColor(.white.opacity(0.9)) // Slightly dimmer value text
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// MARK: - Preview Provider
struct HourlyFeelsLikeDetailView_Previews: PreviewProvider {
    static var previews: some View {
        // Create more realistic sample data spanning ~24 hours
        let calendar = Calendar.current
        let startDate = calendar.date(bySettingHour: 0, minute: 0, second: 0, of: Date())!
        let sampleItems = (0..<24).map { i -> HourlyForecastItem in
             let date = startDate.addingTimeInterval(TimeInterval(i * 3600))
             // Simulate a daily temperature curve
             let progress = Double(i) / 23.0 // 0.0 to 1.0
             let baseTemp = 5.0 + sin(progress * .pi) * 8.0 // Simulate day/night cycle (5° to 13°)
             let tempVariation = Double.random(in: -0.5...0.5) // Small noise
             let actualTemp = baseTemp + tempVariation

             // Simulate feels like based on humidity/wind (higher during day, lower at night)
             let feelsLikeDiff = sin(progress * .pi) * 1.5 - (1.0 - sin(progress * .pi)) * 1.0 + Double.random(in: -0.5...0.5)
             let feelsLikeTemp = actualTemp + feelsLikeDiff

             // Simulate weather symbols changing
             let symbol: String
             if i < 6 || i > 20 { // Night
                 symbol = ["moon.stars.fill", "cloud.moon.fill", "moon.fill"].randomElement()!
             } else if i > 10 && i < 16 { // Midday
                 symbol = ["sun.max.fill", "cloud.sun.fill"].randomElement()!
             } else { // Morning/Evening transition
                  symbol = ["cloud.fill", "smoke.fill", "cloud.sun.fill"].randomElement()!
             }

             return HourlyForecastItem(
                 id: date,
                 date: date,
                 hour: "", // Hour string not needed for this preview view directly
                 temp: actualTemp,
                 feelsLikeTemp: feelsLikeTemp,
                 symbol: symbol
             )
        }

        HourlyFeelsLikeDetailView(
            hourlyItems: sampleItems,
            currentActualTemp: 13, // From screenshot
            currentFeelsLikeTemp: 12, // From screenshot
            selectedDate: Calendar.current.date(bySetting: .day, value: 4, of: Date())! // Simulate April 4th
        )
    }
}
