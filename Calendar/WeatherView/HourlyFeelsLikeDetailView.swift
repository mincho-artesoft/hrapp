import SwiftUI
// import WeatherKit // Only if using WeatherKit specific types directly

// Dummy structure for precipitation totals (replace with actual data source)
struct PrecipitationData {
    let snowLast24h: Double = 3.9 // cm
    let rainLast24h: Double = 3    // mm
    let precipNext24h: Double = 0   // mm
}

// Dummy structure for daily comparison (replace with actual data source)
struct DailyComparisonData {
    let todayMin: Double = -2
    let todayMax: Double = 4
    let yesterdayMin: Double = 0
    let yesterdayMax: Double = 7
    let highIsLower: Bool = true // Example: "The high temperature today is lower than yesterday."
}

// MARK: - Main View
struct HourlyFeelsLikeDetailView: View {
    // Data passed in
    let hourlyItems: [HourlyForecastItem]
    let currentActualTemp: Double?
    let currentFeelsLikeTemp: Double?
    let selectedDate: Date // The date this forecast is for

    // --- Placeholder Data for Missing Sections ---
    // You should pass this data in from your ViewModel or another source
    let chanceOfPrecipitationToday: Int = 0 // Example: 0%
    let precipitationData = PrecipitationData() // Example data
    let comparisonData = DailyComparisonData() // Example data
    // Example forecast text (should come from daily forecast summary)
    let forecastSummary: String = "0° now and mostly cloudy. Wind is making it feel colder, about -1°. Partly cloudy conditions expected around 18:00. Today's temperature range is from -2° to 4° and feels like -3° to 3°."
    // --- End Placeholder Data ---


    // State for the Actual/Feels Like toggle
    @State private var showingFeelsLike = true // Start with "Feels Like" selected

    // Environment for dismissing the sheet
    @Environment(\.dismiss) var dismiss

    // Date Formatters
    private var headerDateFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, d MMMM yyyy" // Monday, 7 April 2025
        return formatter
    }
    private var dayInitialFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "E" // S, M, T...
        return formatter
    }
    private var dayOfMonthFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "d" // 6, 7, 8...
        return formatter
    }
    private var precipChanceHourFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH" // 00, 06, 12, 18
        return formatter
    }

    // Constants for Graph
    private let graphPadding: CGFloat = 15 // Reduced padding
    private let yAxisLabelWidth: CGFloat = 35 // Space for labels like "-10°"
    private let graphHeight: CGFloat = 160 // Specific height for graph area

    // Computed properties for graph data range
    private var temperatures: [Double] {
        hourlyItems.map { showingFeelsLike ? $0.feelsLikeTemp : $0.temp }
    }

     // More robust Y-axis range calculation based on screenshots
     private var yAxisRange: (min: Double, max: Double) {
         // Use both actual and feels like to determine overall range for axis stability
         let allTemps = hourlyItems.flatMap { [$0.temp, $0.feelsLikeTemp] }
         guard let dataMin = allTemps.min(), let dataMax = allTemps.max() else {
             return (min: -10, max: 30) // Default fallback
         }

         // Determine appropriate bounds based on screenshots (-10 to 30 with 5 degree steps)
         // Find the nearest multiple of 5 below min and above max
         let rangeMin = floor(dataMin / 5.0) * 5.0 - 5.0 // Go one step lower
         let rangeMax = ceil(dataMax / 5.0) * 5.0 + 5.0 // Go one step higher

         // Ensure a minimum span (e.g., 20 degrees)
         let finalMin = min(rangeMin, rangeMax - 20)
         let finalMax = max(rangeMax, rangeMin + 20)

         // Prioritize common ranges like screenshot if data fits
         if finalMin >= -10 && finalMax <= 30 { return (min: -10, max: 30) }

         return (min: finalMin, max: finalMax) // Return calculated range
     }

     // Generate labels based on the fixed range from screenshot
     private var yAxisLabels: [Double] {
         // Use the specific labels shown in the screenshot
         return stride(from: yAxisRange.max, through: yAxisRange.min, by: -5.0).map { $0 }
     }


    var body: some View {
        VStack(spacing: 0) {
            customNavBar
                .padding(.bottom, 5)

            ScrollView {
                // Reduce spacing between major sections to match screenshot density
                VStack(alignment: .leading, spacing: 15) {

                    dateSelectorHeader
                        .padding(.bottom, 10)

                    currentStatusHeader
                        .padding(.horizontal)
                        .padding(.bottom, 10) // Reduced bottom padding

                    hourlyIconsRow
                         .padding(.horizontal, graphPadding / 2 + 2) // Align roughly with graph content start
                         .padding(.bottom, 2) // Closer to graph

                    hourlyGraphSection() // Contains graph, axes, divider
                         // No vertical padding needed, handled internally

                    actualFeelsLikeToggle
                        .padding(.vertical, 15)
                        .padding(.horizontal)

                    descriptionText // Explanation for Feels Like
                        .padding(.horizontal)
                        .padding(.bottom)

                    // --- Added Sections based on Screenshots 3 & 4 ---
                    ChanceOfPrecipitationSection // Includes graph placeholder
                         .padding(.horizontal)
                         .padding(.bottom)

                    PrecipitationTotalsSection(data: precipitationData)
                         .padding(.horizontal)
                         .padding(.bottom)

                    ForecastSection(summary: forecastSummary)
                         .padding(.horizontal)
                         .padding(.bottom)

                    DailyComparisonSection(data: comparisonData)
                         .padding(.horizontal)
                         .padding(.bottom)

                    AboutFeelsLikeSection
                         .padding(.horizontal)
                         .padding(.bottom)

                    OptionsSection // Placeholder for settings
                         .padding(.horizontal)
                         .padding(.bottom)
                    // --- End Added Sections ---

                    Spacer() // Pushes content up if needed
                }
            }
        }
        .background(Color.black.edgesIgnoringSafeArea(.all))
        .foregroundColor(.white)
        .colorScheme(.dark)
    }


    // MARK: - Subviews

    private var customNavBar: some View {
        HStack {
            Spacer()
            Label("Conditions", systemImage: "cloud.fill") // Use filled icon like screenshot
                .font(.headline)
                .foregroundColor(.white)
            Spacer()
            Button { dismiss() } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 12, weight: .semibold)) // Smaller, bolder X
                    .foregroundColor(Color.white.opacity(0.7))
                    .padding(8)
                    .background(Color.white.opacity(0.15)) // Slightly transparent gray circle
                    .clipShape(Circle())
            }
        }
        .padding(.horizontal)
        .padding(.top, 5)
        .frame(height: 44)
    }

    private var dateSelectorHeader: some View {
        VStack(spacing: 2) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 20) { // Increased spacing between day elements
                    // Generate days around the selected date (e.g., -1 to +5)
                    ForEach(-1..<6) { i in
                        let date = Calendar.current.date(byAdding: .day, value: i, to: selectedDate)!
                        let isSelected = Calendar.current.isDate(date, inSameDayAs: selectedDate)

                        VStack(spacing: 6) { // Slightly more spacing in VStack
                             Text(dayInitialFormatter.string(from: date).prefix(1)) // S, M, T
                                  .font(.system(size: 12, weight: .medium)) // Medium weight for all
                                  .foregroundColor(isSelected ? .white : .gray)

                             Text(dayOfMonthFormatter.string(from: date)) // 6, 7, 8
                                  .font(.system(size: isSelected ? 17 : 16, weight: .medium)) // Slightly larger selected
                                  .foregroundColor(isSelected ? .white : .white.opacity(0.9))
                                  .frame(width: 30, height: 30) // Explicit frame for circle background
                                  .background(
                                       Circle()
                                           .fill(isSelected ? Color.blue : Color.clear) // Blue circle if selected
                                   )
                        }
                         // Add tap gesture if needed: .onTapGesture { /* Update selectedDate */ }
                    }
                }
                .padding(.horizontal) // Padding for scroll content
            }
            Text(selectedDate, formatter: headerDateFormatter) // Monday, 7 April 2025
                .font(.system(size: 12))
                .foregroundColor(.gray)
                .padding(.top, 6) // More padding above date string
        }
    }

    // Current Temperature and Icon Header
    private var currentStatusHeader: some View {
        HStack(alignment: .firstTextBaseline) { // Align baseline of large temp and text
            VStack(alignment: .leading, spacing: 0) { // No spacing
                Text("\(Int((showingFeelsLike ? currentFeelsLikeTemp : currentActualTemp) ?? 0))°")
                    .font(.system(size: 70, weight: .thin)) // Larger, thinner font

                Text(showingFeelsLike ? "Actual: \(Int(currentActualTemp ?? 0))°" : "Feels Like: \(Int(currentFeelsLikeTemp ?? 0))°")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
                    .padding(.leading, 4) // Slight indent
            }

            Spacer()

            // Find the symbol for the "current" hour (use first item as proxy)
            // In a real app, you might get the *actual* current conditions symbol separately
            Image(systemName: hourlyItems.first?.symbol ?? "cloud")
                 .renderingMode(.original) // Use multicolor weather icons
                 .font(.system(size: 35)) // Slightly smaller icon
                 .offset(y: 5) // Align visually better with large temp
                 .shadow(color: .black.opacity(0.1), radius: 1, y: 1) // Subtle shadow

            // Dropdown icon (purely visual, no action here)
            Image(systemName: "chevron.down.circle.fill")
                // --- FIX: Use .symbolRenderingMode for palette ---
                .symbolRenderingMode(.palette) // Allows coloring foreground/background layers
                .foregroundStyle(.white.opacity(0.8), .white.opacity(0.2)) // Primary and secondary colors for the palette
                .font(.system(size: 20))
                .padding(.leading, 5)
                .offset(y: 5)

        }
    }

     private var hourlyIconsRow: some View {
         HStack(spacing: 0) {
             if !hourlyItems.isEmpty {
                 // Display icons for each hour in the forecast data
                 ForEach(hourlyItems) { item in
                     Image(systemName: item.symbol)
                         .renderingMode(.original) // Use multi-color icons
                         .font(.system(size: 13))   // Slightly larger icon size
                         .frame(maxWidth: .infinity, alignment: .center) // Distribute evenly
                         .opacity(item.date < Date() ? 0.5 : 1.0) // Dim past hours slightly (optional)
                 }
             } else {
                 Text("").frame(maxWidth: .infinity) // Placeholder if no data
             }
         }
         .frame(height: 20) // Give the row some height
     }

    // Creates the Graph Canvas, Y-Axis Labels, and Divider
    @ViewBuilder
    private func hourlyGraphSection() -> some View {
        let yRange = yAxisRange // Use pre-calculated range
        let currentTemperatures = temperatures // Data for the line

        VStack(spacing: 0) { // Stack graph and X labels vertically
            HStack(spacing: 2) {
                // --- Graph Canvas ---
                Canvas { context, size in
                    guard !currentTemperatures.isEmpty, size.width > graphPadding + yAxisLabelWidth, size.height > graphPadding * 2 else { return }

                    let graphContentWidth = size.width - graphPadding - yAxisLabelWidth
                    let graphContentHeight = size.height - graphPadding * 2 // Top/Bottom padding
                    let origin = CGPoint(x: graphPadding, y: size.height - graphPadding)

                    let yStep = (yRange.max > yRange.min) ? graphContentHeight / CGFloat(yRange.max - yRange.min) : 0

                    // --- Draw Dashed Horizontal Grid Lines ---
                    for tempLabelValue in yAxisLabels where tempLabelValue != yRange.min && tempLabelValue != yRange.max { // Don't draw lines at very top/bottom edge
                        let yPos = origin.y - CGFloat(tempLabelValue - yRange.min) * yStep
                        var path = Path()
                        path.move(to: CGPoint(x: origin.x - 5, y: yPos)) // Start slightly left for visual balance
                        path.addLine(to: CGPoint(x: origin.x + graphContentWidth + 5, y: yPos)) // Extend slightly right
                        context.stroke(path, with: .color(.gray.opacity(0.3)), style: StrokeStyle(lineWidth: 0.5, dash: [2, 3])) // Match dash pattern
                    }

                    // --- Draw Temperature Line ---
                    var linePath = Path()
                    var points: [CGPoint] = []
                    let xStep = graphContentWidth / CGFloat(max(1, currentTemperatures.count - 1))

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
                        // Draw point marker (white dot) at the 'current' hour (index 0)
                        if index == 0 {
                            let circle = Path(ellipseIn: CGRect(center: point, radius: 3.5))
                            context.fill(circle, with: .color(.white))
                            let innerCircle = Path(ellipseIn: CGRect(center: point, radius: 2))
                            context.fill(innerCircle, with: .color(.blue)) // Or cyan? Match the line color
                        }
                    }
                     // Stroke the line - use a solid cyan/blue color like screenshot
                     context.stroke(linePath, with: .color(.cyan.opacity(0.9)), lineWidth: 2.5)


                    // --- Draw H/L Markers ---
                     let validPoints = points.filter { !$0.x.isNaN && !$0.y.isNaN } // Filter out potential NaN values
                     guard !validPoints.isEmpty else { return }

                     if let maxTemp = currentTemperatures.max(),
                        let maxIndex = currentTemperatures.firstIndex(of: maxTemp),
                        validPoints.indices.contains(maxIndex) {
                         let highPoint = validPoints[maxIndex]
                         context.draw(Text("H").font(.system(size: 10, weight: .bold)).foregroundColor(.white), at: CGPoint(x: highPoint.x, y: highPoint.y - 10))
                         // Small dot on the line for H
                         context.fill(Path(ellipseIn: CGRect(center: highPoint, radius: 2.5)), with: .color(.white))
                     }

                     if let minTemp = currentTemperatures.min(),
                        let minIndex = currentTemperatures.firstIndex(of: minTemp),
                        validPoints.indices.contains(minIndex) {
                         let lowPoint = validPoints[minIndex]
                         context.draw(Text("L").font(.system(size: 10, weight: .bold)).foregroundColor(.white), at: CGPoint(x: lowPoint.x, y: lowPoint.y + 12)) // Position L below point
                         // Small dot on the line for L
                         context.fill(Path(ellipseIn: CGRect(center: lowPoint, radius: 2.5)), with: .color(.white))
                     }


                }
                .frame(height: graphHeight) // Fixed height for the canvas
                // No explicit padding here, handled by parent HStack spacing and label width

                // --- Y-Axis Labels (External VStack) ---
                VStack(alignment: .trailing, spacing: 0) {
                     let graphContentHeight = graphHeight - graphPadding * 2
                     let yStep = (yRange.max > yRange.min) ? graphContentHeight / CGFloat(yRange.max - yRange.min) : 0
                     let labelHeight: CGFloat = 15 // Approx height for alignment

                     ForEach(yAxisLabels, id: \.self) { tempLabelValue in
                         let yPos = graphPadding + CGFloat(yRange.max - tempLabelValue) * yStep
                         Text("\(Int(tempLabelValue))°")
                             .font(.system(size: 10))
                             .foregroundColor(.gray)
                             .frame(width: yAxisLabelWidth, height: labelHeight, alignment: .trailing)
                             .offset(y: yPos - (graphHeight / 2) - (labelHeight / 2) + 3) // Fine-tuned offset calculation
                         Spacer(minLength: 0) // Use minLength 0 spacers
                     }
                }
                .frame(height: graphHeight, alignment: .top) // Align content top
                .padding(.trailing, 5) // Padding from the screen edge
            }

            // --- Divider Line ---
            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2) // Align divider with graph area
                .padding(.top, 2) // Small space below graph

            // --- X Axis Labels ---
            graphXAxisLabels
                .padding(.horizontal, graphPadding / 2) // Align with graph content area
                .padding(.top, 4) // Space above X labels
        }
    }

     private var graphXAxisLabels: some View {
          // Dynamically generate based on hourlyItems if possible, or use fixed ones
          HStack {
              // Placeholder - ideally derive these from hourlyItems date range
              Text("00").font(.system(size: 11)).foregroundColor(.gray).frame(maxWidth: .infinity, alignment: .center)
              Text("06").font(.system(size: 11)).foregroundColor(.gray).frame(maxWidth: .infinity, alignment: .center)
              Text("12").font(.system(size: 11)).foregroundColor(.gray).frame(maxWidth: .infinity, alignment: .center)
              Text("18").font(.system(size: 11)).foregroundColor(.gray).frame(maxWidth: .infinity, alignment: .center)
              // Add "Now" label dynamically? Maybe harder to align. Stick to fixed hours for now.
          }
     }


    private var actualFeelsLikeToggle: some View {
        HStack(spacing: 5) {
            Button { showingFeelsLike = false } label: {
                Text("Actual")
                    .font(.system(size: 12, weight: .medium))
                    .padding(.vertical, 7) // Slightly more vertical padding
                    .padding(.horizontal, 12)
                    .frame(maxWidth: .infinity)
                    .foregroundColor(!showingFeelsLike ? .white : .gray) // White if selected
                    .background(!showingFeelsLike ? Color.white.opacity(0.25) : Color.clear) // Darker bg if selected
                    .cornerRadius(15) // Match corner radius
            }
            .buttonStyle(.plain) // Remove default button styling

            Button { showingFeelsLike = true } label: {
                Text("Feels Like")
                    .font(.system(size: 12, weight: .medium))
                    .padding(.vertical, 7)
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

    private var descriptionText: some View {
        Text("What the temperature feels like as a result of humidity, sunlight or wind.")
            .font(.caption)
            .foregroundColor(.secondary)
            .lineSpacing(3) // Add a bit of line spacing if needed
    }

    // MARK: - Added Sections (Placeholders / Basic Implementation)

    private var ChanceOfPrecipitationSection: some View {
        VStack(alignment: .leading, spacing: 8) { // Increased spacing
            Text("Chance of Precipitation")
                .font(.system(size: 16, weight: .semibold)) // Match screenshot font
            Text("Today's chance: \(chanceOfPrecipitationToday)%")
                 .font(.system(size: 13)) // Match size
                 .foregroundColor(.white.opacity(0.8)) // Slightly dimmer

            // --- Placeholder Graph ---
             // This requires more complex data processing (hourly precipitation chance)
             // which might not be readily available here. Showing a static example.
             PrecipitationChanceGraph(hourlyItems: hourlyItems) // Pass hourly data if it contains precip chance
                 .frame(height: 80) // Height for the graph area
                 .padding(.top, 5)

             Text("The daily chance of precipitation tends to be higher than the chance for each hour.")
                 .font(.caption)
                 .foregroundColor(.secondary)
                 .padding(.top, 5)

        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // Simple graph showing precipitation chance over the next hours
    // Simple graph showing precipitation chance over the next hours
    // Simple graph showing precipitation chance over the next hours
    struct PrecipitationChanceGraph: View {
        let hourlyItems: [HourlyForecastItem] // Assuming items have precipitation chance

        // --- Define constants locally within the nested struct ---
        private let graphPadding: CGFloat = 5
        private let yAxisWidth: CGFloat = 30 // Width allocated for Y labels
        private let xAxisHeight: CGFloat = 15 // Height allocated for X labels
        private let yAxisLabels: [Int] = [100, 80, 60, 40, 20, 0]
        // --- End local constants ---


        // Replace Double with actual precipitation chance property if available
        private func getPrecipChance(for item: HourlyForecastItem) -> Double {
             // Placeholder: return dummy value or actual if available
             // e.g., return item.precipitationChance ?? 0.0
             // For demo, let's create a dummy pattern based on index
             let index = hourlyItems.firstIndex(where: { $0.id == item.id }) ?? 0
             switch index {
                 case 5...9: return 0.15 // Around 06:00-10:00
                 case 10...15: return 0.10 // Around 11:00-16:00
                 case 16...20: return 0.05 // Around 17:00-21:00
                 default: return 0.02
             }
        }

         var body: some View {
             VStack(spacing: 0) { // Use VStack to stack graph and divider
                 GeometryReader { geometry in
                     // --- Define dimensions accessible within GeometryReader ---
                     let availableWidth = geometry.size.width
                     let availableHeight = geometry.size.height
                     let graphWidth = availableWidth - graphPadding * 2 - yAxisWidth
                     let graphHeight = availableHeight - graphPadding * 2 - xAxisHeight
                     let origin = CGPoint(x: graphPadding, y: availableHeight - graphPadding - xAxisHeight)
                     let lowerYBound = graphPadding // Top edge of graph area
                     let upperYBound = origin.y     // Bottom edge of graph area
                     // --- End dimensions ---

                     HStack(spacing: 2) {
                          Canvas { context, size in
                              // Basic size check using calculated dimensions
                              guard !hourlyItems.isEmpty, graphWidth > 0, graphHeight > 0 else { return }

                              // --- Draw Grid Lines ---
                              let yStep = graphHeight / 100.0 // Map 0-100% to height
                              if yStep > 0 { // Avoid division by zero if height is too small
                                  for percentLabel in yAxisLabels where percentLabel != 0 && percentLabel != 100 {
                                      let yPos = origin.y - CGFloat(percentLabel) * yStep
                                      var path = Path()
                                      path.move(to: CGPoint(x: origin.x, y: yPos))
                                      path.addLine(to: CGPoint(x: origin.x + graphWidth, y: yPos))
                                      context.stroke(path, with: .color(.gray.opacity(0.3)), style: StrokeStyle(lineWidth: 0.5, dash: [2, 3]))
                                  }
                              }

                              // --- Draw Precip Chance Line ---
                              var linePath = Path()
                              let xStep = graphWidth / CGFloat(max(1, hourlyItems.count - 1))
                              var points: [CGPoint] = []

                              for (index, item) in hourlyItems.enumerated() {
                                  let precipChance = getPrecipChance(for: item)
                                  let xPos = origin.x + CGFloat(index) * xStep
                                  // Calculate Y position
                                  let calculatedYPos = origin.y - CGFloat(precipChance * 100.0) * yStep
                                  // --- FIX: Replace clamped with min/max ---
                                  let yPos = max(lowerYBound, min(calculatedYPos, upperYBound))

                                  // Ensure points are valid numbers
                                  guard !xPos.isNaN, !yPos.isNaN else { continue }
                                  let point = CGPoint(x: xPos, y: yPos)
                                  points.append(point)

                                  if points.count == 1 { // Use points.count instead of index == 0 for safety
                                      linePath.move(to: point)
                                      context.fill(Path(ellipseIn: CGRect(center: point, radius: 2)), with: .color(.white))
                                  } else {
                                      linePath.addLine(to: point)
                                  }
                              }
                               if !points.isEmpty { // Only stroke if we have valid points
                                    context.stroke(linePath, with: .color(.blue), lineWidth: 1.5)
                               }

                          }
                          .overlay(alignment: .bottom) {
                               // X-Axis Labels for Precip Graph
                               HStack {
                                   Text("00").frame(maxWidth: .infinity)
                                   Text("06").frame(maxWidth: .infinity)
                                   Text("12").frame(maxWidth: .infinity)
                                   Text("18").frame(maxWidth: .infinity)
                               }
                               .font(.system(size: 9))
                               .foregroundColor(.gray)
                               // --- FIX: Use the local graphPadding ---
                               .padding(.horizontal, graphPadding)
                               .frame(height: xAxisHeight) // Use constant
                               // Positioned automatically at bottom by overlay
                          }

                          // --- Y-Axis Labels ---
                          VStack(alignment: .trailing) {
                              // --- FIX: Use graphHeight defined above ---
                              if graphHeight > 0 { // Ensure valid height
                                  let graphContentHeight = graphHeight // Renamed for clarity inside VStack scope
                                  let yStep = graphContentHeight / 100.0
                                  let labelHeight: CGFloat = 12 // Approx height for alignment calculation

                                  ForEach(yAxisLabels, id: \.self) { percentLabel in
                                      // Calculate center Y position relative to graph area's top padding
                                      let yCenterInGraph = CGFloat(100 - percentLabel) * yStep
                                      let yCenter = graphPadding + yCenterInGraph

                                      Text("\(percentLabel)%")
                                          .font(.system(size: 9))
                                          .foregroundColor(.gray)
                                          .frame(height: labelHeight, alignment: .center)
                                          // --- FIX: Use yAxisWidth defined above ---
                                          .position(x: yAxisWidth / 2, y: yCenter) // Position within the VStack's width/height
                                      Spacer(minLength: 0) // Use minLength 0 spacers
                                  }
                              }
                          }
                          // --- FIX: Use yAxisWidth defined above ---
                          .frame(width: yAxisWidth) // Width for Y labels
                          // Positioned by the HStack spacing
                     }
                 } // End GeometryReader
                 .frame(height: 80) // Height for the graph part (GeometryReader)

                 // Divider below graph section
                 Divider()
                     .background(Color.gray.opacity(0.4))
                     .padding(.horizontal, 5)
                     .padding(.top, 5) // Space between graph bottom and divider

             } // End Outer VStack
             .frame(height: 95) // Total height including divider padding
         }
    }


    private func PrecipitationTotalsSection(data: PrecipitationData) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Precipitation Totals")
                 .font(.system(size: 16, weight: .semibold))

            VStack(alignment: .leading, spacing: 5) {
                 Text("LAST 24 HOURS")
                     .font(.caption.weight(.medium))
                     .foregroundColor(.secondary)
                 HStack {
                     Label("Snow", systemImage: "circle.fill") // Use filled circle
                        .labelStyle(.iconOnly)
                        .foregroundColor(.white) // White circle for snow
                     Text("Snow")
                         .font(.system(size: 14))
                     Spacer()
                     Text("\(String(format: "%.1f", data.snowLast24h)) cm")
                         .font(.system(size: 14))
                 }
                 HStack {
                      Label("Rain", systemImage: "circle.fill")
                         .labelStyle(.iconOnly)
                         .foregroundColor(.blue) // Blue circle for rain
                     Text("Rain")
                          .font(.system(size: 14))
                     Spacer()
                     Text("\(Int(data.rainLast24h)) mm")
                          .font(.system(size: 14))
                 }
            }
            .padding(.top, 5)

            VStack(alignment: .leading, spacing: 5) {
                 Text("NEXT 24 HOURS")
                      .font(.caption.weight(.medium))
                      .foregroundColor(.secondary)
                 HStack {
                      // Assuming only rain forecast for next 24h in this example
                     Text("Precipitation")
                          .font(.system(size: 14))
                     Spacer()
                     Text("\(Int(data.precipNext24h)) mm")
                          .font(.system(size: 14))
                 }
            }
            .padding(.top, 10)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func ForecastSection(summary: String) -> some View {
        VStack(alignment: .leading, spacing: 5) {
            Text("Forecast")
                 .font(.system(size: 16, weight: .semibold))
            Text(summary)
                .font(.system(size: 14))
                .lineSpacing(4) // Add line spacing for readability
                .foregroundColor(.white.opacity(0.9))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func DailyComparisonSection(data: DailyComparisonData) -> some View {
        VStack(alignment: .leading, spacing: 8) {
             Text("Daily Comparison")
                 .font(.system(size: 16, weight: .semibold))

             Text(data.highIsLower ? "The high temperature today is lower than yesterday." : "The high temperature today is higher than yesterday.") // Example text
                 .font(.system(size: 14))
                 .foregroundColor(.white.opacity(0.9))
                 .padding(.bottom, 5)

            // Custom Slider Row
            DailyComparisonRow(label: "Today", minTemp: data.todayMin, maxTemp: data.todayMax, overallMin: min(data.todayMin, data.yesterdayMin), overallMax: max(data.todayMax, data.yesterdayMax))
            DailyComparisonRow(label: "Yesterday", minTemp: data.yesterdayMin, maxTemp: data.yesterdayMax, overallMin: min(data.todayMin, data.yesterdayMin), overallMax: max(data.todayMax, data.yesterdayMax))

        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // Custom view for the comparison slider rows
    struct DailyComparisonRow: View {
        let label: String
        let minTemp: Double
        let maxTemp: Double
        let overallMin: Double
        let overallMax: Double

        private var range: Double { max(1, overallMax - overallMin) } // Avoid division by zero
        private var startOffsetPercentage: CGFloat { CGFloat((minTemp - overallMin) / range) }
        private var widthPercentage: CGFloat { CGFloat((maxTemp - minTemp) / range) }

        var body: some View {
             HStack {
                 Text(label)
                     .font(.system(size: 14, weight: .medium))
                     .frame(width: 70, alignment: .leading) // Fixed width for label

                 Text("\(Int(minTemp))°")
                     .font(.system(size: 14))
                     .foregroundColor(.secondary)
                     .frame(width: 30, alignment: .trailing)

                 // Custom Slider Bar
                 GeometryReader { geometry in
                     ZStack(alignment: .leading) {
                         Capsule()
                             .fill(Color.gray.opacity(0.3))
                             .frame(height: 4)
                         Capsule()
                             .fill(LinearGradient(colors: [.blue, .yellow], startPoint: .leading, endPoint: .trailing)) // Example gradient
                             .frame(width: geometry.size.width * widthPercentage, height: 4)
                             .offset(x: geometry.size.width * startOffsetPercentage)
                     }
                     .frame(height: 4) // Ensure ZStack takes minimal height
                     .position(x: geometry.size.width / 2, y: geometry.size.height / 2) // Center the bar vertically
                 }
                 .frame(height: 20) // Give GeometryReader some vertical space

                 Text("\(Int(maxTemp))°")
                      .font(.system(size: 14))
                      .frame(width: 30, alignment: .trailing)
             }
        }
    }


    private var AboutFeelsLikeSection: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text("About Feels Like Temperature")
                 .font(.system(size: 16, weight: .semibold))
            Text("Feels Like conveys how warm or cold it feels and can be different from the actual temperature. The Feels Like temperature is affected by humidity, sunlight and wind.")
                .font(.system(size: 14))
                .lineSpacing(4)
                .foregroundColor(.white.opacity(0.9))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var OptionsSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Options")
                 .font(.system(size: 16, weight: .semibold))

             // Example rows - data should come from user settings/system
             OptionRow(label: "Temperature", value: "Use system setting (°C)")
             OptionRow(label: "Precipitation", value: "mm, cm")
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // Row for Options section
    struct OptionRow: View {
        let label: String
        let value: String

        var body: some View {
            HStack {
                 Text(label)
                     .font(.system(size: 14))
                 Spacer()
                 Text(value)
                     .font(.system(size: 14))
                     .foregroundColor(.gray)
                 Image(systemName: "chevron.up.chevron.down") // Match screenshot icon
                     .font(.caption)
                     .foregroundColor(.gray)
            }
            Divider().background(Color.gray.opacity(0.3)) // Divider between options
        }
    }
}

// MARK: - Helper Extensions (Optional)
extension CGRect {
    // Helper to create CGRect centered at a point with a radius
    init(center: CGPoint, radius: CGFloat) {
        self.init(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2)
    }
}
