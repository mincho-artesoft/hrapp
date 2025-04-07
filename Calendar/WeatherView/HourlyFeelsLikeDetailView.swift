import SwiftUI
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - Dummy Structures (Placeholder) - Keep as is
struct PrecipitationData {
    let snowLast24h: Double = 3.9
    let rainLast24h: Double = 3
    let precipNext24h: Double = 0
}

struct DailyComparisonData {
    let todayMin: Double = -2
    let todayMax: Double = 4
    let yesterdayMin: Double = 0
    let yesterdayMax: Double = 7
    let highIsLower: Bool = true
}

// MARK: - Главният изглед
struct HourlyFeelsLikeDetailView: View {

    // ... (Properties, State, Init, Placeholders, Helpers - Keep as is) ...
    // 1) Data Sources - Keep as is
    let allHourlyItems: [HourlyForecastItem]
    let allDailyItems: [DayForecastItem]
    let currentActualTemp: Double?
    let currentFeelsLikeTemp: Double?

    // 2) State - Keep as is
    @State private var selectedDate: Date
    @State private var showingFeelsLike = false

    // 3) Day Symbol - Keep as is
    private let daySymbol: String

    // 4) Environment - Keep as is
    @Environment(\.dismiss) var dismiss

    // MARK: – Init - Keep as is
    init(
        allHourlyItems: [HourlyForecastItem],
        allDailyItems: [DayForecastItem],
        currentActualTemp: Double?,
        currentFeelsLikeTemp: Double?,
        initialDate: Date,
        daySymbol: String
    ) {
        self.allHourlyItems = allHourlyItems
        self.allDailyItems = allDailyItems
        self.currentActualTemp = currentActualTemp
        self.currentFeelsLikeTemp = currentFeelsLikeTemp
        _selectedDate = State(initialValue: initialDate)
        self.daySymbol = daySymbol
    }


    // MARK: - Placeholder Data - Keep as is
    let chanceOfPrecipitationToday: Int = 0
    let precipitationData = PrecipitationData()
    let comparisonData = DailyComparisonData()
    let forecastSummary: String = """
    0° now and mostly cloudy. Wind is making it feel colder, about -1°.
    Partly cloudy conditions expected around 18:00.
    This week's temperature range is from -2° to 4° and feels like -3° to 3°.
    """

    // MARK: - Helper Functions - Keep as is
    private func conditionFromSymbol(_ symbol: String) -> String {
        let lowercasedSymbol = symbol.lowercased()
        if lowercasedSymbol.contains("bolt") { return "Thunderstorm" }
        if lowercasedSymbol.contains("drizzle") { return "Drizzle" }
        if lowercasedSymbol.contains("snow") { return "Snow" }
        if lowercasedSymbol.contains("rain") { return "Rain" }
        if lowercasedSymbol.contains("fog") { return "Fog" }
        if lowercasedSymbol.contains("cloud.sun") { return "Partly Cloudy" }
        if lowercasedSymbol.contains("cloud.moon") { return "Partly Cloudy Night" }
        if lowercasedSymbol.contains("moon") || lowercasedSymbol.contains("stars") { return "Clear Night" }
        if lowercasedSymbol.contains("cloud") { return "Cloudy" }
        if lowercasedSymbol.contains("sun") { return "Sunny" }
        return "Conditions"
    }

    private func hourString(from date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "HH"
        return df.string(from: date)
    }

    // MARK: - Computed Properties (Filtered Data, Display Info) - Keep as is
    private var hourlyItemsForSelectedDate: [HourlyForecastItem] {
        allHourlyItems.filter {
            Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
        }
        .sorted { $0.date < $1.date } // Ensure sorted for graph
    }

    private var displayedSymbol: String {
        if let dayItem = allDailyItems.first(where: { Calendar.current.isDate($0.date, inSameDayAs: selectedDate) }) {
            return dayItem.symbol
        }
        return "cloud" // Fallback
    }

    private var displayedCondition: String {
        conditionFromSymbol(displayedSymbol)
    }

    // MARK: - Date Formatters - Keep as is
    private var headerDateFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "EEEE, d MMMM yyyy"
        return f
    }
    // ... other formatters remain the same ...

    // MARK: - Graph Configuration - Keep as is (or adjust if needed)
    private let graphPadding: CGFloat = 15
    private let yAxisLabelWidth: CGFloat = 35
    private let graphHeight: CGFloat = 160 // Adjust height if needed

    private var temperatures: [Double] {
        hourlyItemsForSelectedDate.map { showingFeelsLike ? $0.feelsLikeTemp : $0.temp }
    }

    // --- Y-AXIS RANGE & LABELS (Keep the smart logic) ---
    private var yAxisRange: (min: Double, max: Double) {
        let allTemps = hourlyItemsForSelectedDate.flatMap { [$0.temp, $0.feelsLikeTemp] }
        guard let dataMin = allTemps.min(), let dataMax = allTemps.max(), !allTemps.isEmpty else {
            return (-5, 35) // Default range if no data
        }
        // Keep the smart range calculation
        let rangeBuffer: Double = 5.0 // How much space above max / below min
        let minRangeSpan: Double = 20 // Ensure minimum degrees span
        
        var suggestedMin = floor(dataMin / 5.0) * 5.0 - rangeBuffer
        var suggestedMax = ceil(dataMax / 5.0) * 5.0 + rangeBuffer
        
        // Ensure minimum span
        if (suggestedMax - suggestedMin) < minRangeSpan {
            let center = (suggestedMax + suggestedMin) / 2.0
            suggestedMin = center - (minRangeSpan / 2.0)
            suggestedMax = center + (minRangeSpan / 2.0)
            // Re-round to nearest 5 after adjusting span
            suggestedMin = floor(suggestedMin / 5.0) * 5.0
            suggestedMax = ceil(suggestedMax / 5.0) * 5.0
        }

        return (suggestedMin, suggestedMax)
    }


    private var yAxisLabels: [Double] {
        stride(from: yAxisRange.max, through: yAxisRange.min, by: -5).map { $0 }
    }

    // MARK: BODY - Keep structure, uses updated hourlyGraphSection
    var body: some View {
        VStack(spacing: 0) {
            customNavBar
                .padding(.bottom, 5)

            ScrollView {
                VStack(alignment: .leading, spacing: 15) {

                    dateCarousel // Use WeekCarouselView2

                    // Use selectedDate to show header
                    Text(selectedDate, formatter: headerDateFormatter)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .padding(.horizontal)
                        .padding(.bottom, 5)


                    currentStatusHeader // Shows temp based on selectedDate's H/L
                        .padding(.horizontal)
                        .padding(.bottom, 10)

                    // --- UPDATED GRAPH SECTION ---
                    hourlyGraphSection() // << Contains the main changes
                    // ---------------------------

                    actualFeelsLikeToggle
                        .padding(.vertical, 15)
                        .padding(.horizontal)

                    descriptionText // Update if needed
                        .padding(.horizontal)
                        .padding(.bottom)

                    // --- Other sections remain the same ---
                    chanceOfPrecipSection
                        .padding(.horizontal)
                        .padding(.bottom)

                    precipitationTotalsSection(data: precipitationData)
                        .padding(.horizontal)
                        .padding(.bottom)

                    forecastSection(summary: forecastSummary)
                        .padding(.horizontal)
                        .padding(.bottom)

                    dailyComparisonSection(data: comparisonData)
                        .padding(.horizontal)
                        .padding(.bottom)

                    aboutFeelsLikeSection
                        .padding(.horizontal)
                        .padding(.bottom)

                    optionsSection
                        .padding(.horizontal)
                        .padding(.bottom)

                    Spacer()
                }
            }
        }
        .background(Color.black.edgesIgnoringSafeArea(.all))
        .foregroundColor(.white)
        .colorScheme(.dark)
    }

    // MARK: - Subviews (NavBar, Carousel, Header, Toggle, Text) - Keep mostly as is

    private var customNavBar: some View {
        HStack {
            Spacer()
            Label(displayedCondition, systemImage: displayedSymbol)
                .font(.headline)
                .foregroundColor(.white)
            Spacer()
            Button { dismiss() } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white.opacity(0.7))
                    .padding(8)
                    .background(Color.white.opacity(0.15))
                    .clipShape(Circle())
            }
        }
        .padding(.horizontal)
        .padding(.top, 5)
        .frame(height: 44)
    }

    private var dateCarousel: some View {
         WeekCarouselView2(
             today: Date(), // Or pass the actual 'today' if needed elsewhere
             selectedDay: $selectedDate
         )
         .padding(.bottom, 10)
    }

     private var currentStatusHeader: some View {
         HStack(alignment: .firstTextBaseline) {
             if let dayItem = allDailyItems.first(where: { Calendar.current.isDate($0.date, inSameDayAs: selectedDate) }) {
                 Text("\(Int(round(dayItem.maxTemp)))°") // Rounded
                     .font(.system(size: 70, weight: .thin))
                 + Text(" ")
                 + Text("\(Int(round(dayItem.minTemp)))°") // Rounded
                     .font(.system(size: 50, weight: .thin))
                     .foregroundColor(.gray)

                 Spacer()
                 Image(systemName: dayItem.symbol)
                     .renderingMode(.original)
                     .font(.system(size: 35))
                     .offset(y: 5)
                     .shadow(color: .black.opacity(0.1), radius: 1, y: 1)
                 Image(systemName: "chevron.down.circle.fill")
                     .symbolRenderingMode(.palette)
                     .foregroundStyle(.white.opacity(0.8), .white.opacity(0.2))
                     .font(.system(size: 20))
                     .padding(.leading, 5)
                     .offset(y: 5)
             } else {
                 Text("--°")
                     .font(.system(size: 70, weight: .thin))
                 Spacer()
             }
         }
     }

    // MARK: - HOURLY GRAPH SECTION (REVISED FOR GRADIENT)
    @ViewBuilder
    private func hourlyGraphSection() -> some View {
        let twoHourItemsForIcons = hourlyItemsForSelectedDate
            .enumerated()
            .filter { index, _ in index % 2 == 0 }
            .map { _, item in item }
            .prefix(12)

        let currentTemperatures = temperatures
        let yRange = yAxisRange

        // --- 1. Define Temperature Gradient ---
        // Define colors and rough temperature thresholds (adjust as needed)
        let gradient = Gradient(stops: [
            .init(color: .blue, location: temperatureToGradientLocation(-5, range: yRange)), // Blue below -5°C
            .init(color: .cyan, location: temperatureToGradientLocation(5, range: yRange)),  // Cyan around 5°C
            .init(color: .green, location: temperatureToGradientLocation(15, range: yRange)), // Green around 15°C
            .init(color: .yellow, location: temperatureToGradientLocation(25, range: yRange)),// Yellow around 25°C
            .init(color: .orange, location: temperatureToGradientLocation(30, range: yRange)),// Orange around 30°C
            .init(color: .red, location: temperatureToGradientLocation(35, range: yRange))    // Red above 35°C
        ])

        // Gradient for the fill area (combines color and slight opacity)
        let fillGradient = LinearGradient(
            gradient: gradient,
            startPoint: .bottom, // Cooler colors at the bottom
            endPoint: .top       // Warmer colors at the top
        )

        // Gradient for the line stroke (purely color, will be clipped)
        let lineStrokeGradient = LinearGradient(
             gradient: gradient,
             startPoint: .bottom,
             endPoint: .top
        )
        // --- End Gradient Definitions ---

        VStack(spacing: 0) {
            // (A) Top row with icons - Keep as is
            HStack(spacing: 0) {
                 if twoHourItemsForIcons.isEmpty {
                     Text("No hourly data available for this day.")
                         .font(.caption)
                         .foregroundColor(.gray)
                         .frame(maxWidth: .infinity, alignment: .center)
                         .padding(.vertical)
                 } else {
                     ForEach(Array(twoHourItemsForIcons), id: \.id) { item in
                         Image(systemName: item.symbol)
                             .renderingMode(.original)
                             .font(.system(size: 13))
                             .frame(maxWidth: .infinity)
                             .opacity(item.date < Date() ? 0.6 : 1.0)
                     }
                 }
             }
             .frame(height: 20)
             .padding(.horizontal, graphPadding + yAxisLabelWidth / 4)
             .padding(.bottom, 4)

            // (B) Graph Area (Canvas + Y labels)
            HStack(spacing: 2) {
                Canvas { context, size in
                    // Guards and basic setup
                    guard !currentTemperatures.isEmpty,
                          currentTemperatures.count > 1,
                          size.width > graphPadding + yAxisLabelWidth,
                          size.height > graphPadding * 2,
                          yRange.max > yRange.min // Prevent division by zero
                    else { return }

                    let graphContentWidth = size.width - graphPadding - yAxisLabelWidth
                    let graphContentHeight = size.height - graphPadding * 2
                    let origin = CGPoint(x: graphPadding, y: size.height - graphPadding)
                    let yStep = graphContentHeight / CGFloat(yRange.max - yRange.min)

                    // Helper to calculate Y position
                    func yPosition(for temp: Double) -> CGFloat {
                        origin.y - CGFloat(temp - yRange.min) * yStep
                    }

                    // --- 1. Dashed Grid Lines --- (Keep as is)
                    for tempLabelValue in yAxisLabels
                    where tempLabelValue != yRange.min && tempLabelValue != yRange.max {
                        let yPos = yPosition(for: tempLabelValue)
                        var path = Path()
                        path.move(to: CGPoint(x: origin.x - 5, y: yPos))
                        path.addLine(to: CGPoint(x: origin.x + graphContentWidth + 5, y: yPos))
                        context.stroke(path, with: .color(.gray.opacity(0.3)),
                                       style: StrokeStyle(lineWidth: 0.5, dash: [2, 3]))
                    }

                    // --- 2. Calculate Points & Paths --- (Keep as is)
                    var linePath = Path()
                    var fillPath = Path()
                    var points: [CGPoint] = []
                    let xStep = graphContentWidth / CGFloat(max(1, currentTemperatures.count - 1))

                    for (index, temp) in currentTemperatures.enumerated() {
                        let xPos = origin.x + CGFloat(index) * xStep
                        let yPos = yPosition(for: temp)
                        let point = CGPoint(x: xPos, y: yPos)
                        points.append(point)

                        if index == 0 {
                            linePath.move(to: point)
                            fillPath.move(to: CGPoint(x: point.x, y: origin.y))
                            fillPath.addLine(to: point)
                        } else {
                            linePath.addLine(to: point)
                            fillPath.addLine(to: point)
                        }
                    }
                    if let lastPoint = points.last {
                         fillPath.addLine(to: CGPoint(x: lastPoint.x, y: origin.y))
                         fillPath.closeSubpath()
                    }

                    // --- 3. Draw GRADIENT Shaded Area (Fill) ---
                    // Apply the vertical color gradient with reduced opacity
                    context.fill(fillPath, with: .linearGradient(
                        gradient,
                        startPoint: CGPoint(x: 0, y: size.height),
                        endPoint: CGPoint(x: 0, y: 0)
                    ), style: FillStyle(eoFill: false))
                     
                    // Add a subtle opacity gradient overlay (optional, enhances the look)
                    let opacityGradient = Gradient(colors: [.clear, .black.opacity(0.8)]) // Fades from top to bottom
                    context.blendMode = .destinationOut // Knock out opacity
                    context.fill(fillPath, with: .linearGradient(
                        opacityGradient,
                        startPoint: CGPoint(x: 0, y: size.height),
                        endPoint: CGPoint(x: 0, y: 0)
                    ))
                    context.blendMode = .normal // Reset blend mode


                    // --- 4. Draw GRADIENT Temperature Line ---
                    let lineWidth: CGFloat = 2.5
                    let strokedLinePath = linePath.strokedPath(.init(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))

                    // Clip subsequent drawing to the shape of the stroked line
                    context.clip(to: strokedLinePath)

                    // Fill the clipped area (the line) with the vertical temperature gradient
                    context.fill(Path(CGRect(origin: .zero, size: size)), with: .linearGradient(
                        gradient,
                        startPoint: CGPoint(x: 0, y: size.height),
                        endPoint: CGPoint(x: 0, y: 0)
                    ))

                    // Clipping automatically ends after the drawing block.

                    // --- 5. Draw First Point Marker --- (Keep as is, but maybe use white fill)
                    if let firstPoint = points.first {
                        let circle = Path(ellipseIn: CGRect(center: firstPoint, radius: 3.5))
                        context.fill(circle, with: .color(.black)) // Small black bg for contrast
                        context.fill(circle.strokedPath(.init(lineWidth: 1)), with: .color(.white)) // White outline
                    }
                    
                    // --- 6. Draw H/L Markers --- (Keep as is)
                    let validPoints = points.filter { !$0.x.isNaN && !$0.y.isNaN }
                    guard !validPoints.isEmpty else { return }

                    if let maxTemp = currentTemperatures.max(),
                       let maxIndex = currentTemperatures.firstIndex(of: maxTemp),
                       validPoints.indices.contains(maxIndex) {
                        let highPoint = validPoints[maxIndex]
                        drawHLText(context: context, text: "H", at: highPoint, yOffset: -12)
                    }

                    if let minTemp = currentTemperatures.min(),
                       let minIndex = currentTemperatures.firstIndex(of: minTemp),
                       validPoints.indices.contains(minIndex) {
                        let lowPoint = validPoints[minIndex]
                        drawHLText(context: context, text: "L", at: lowPoint, yOffset: 14)
                    }
                }
                .frame(height: graphHeight)

                // (C) Y-Axis Labels (Right Side) - Keep as is
                VStack(alignment: .trailing, spacing: 0) {
                     let availableHeight = graphHeight - graphPadding * 2
                     let yStep = (yRange.max > yRange.min) ? availableHeight / CGFloat(yRange.max - yRange.min) : 0
                     let labelHeight: CGFloat = 15

                     GeometryReader { geo in
                         ForEach(yAxisLabels, id: \.self) { tempLabelValue in
                             let yCenterOffset = graphPadding + CGFloat(yRange.max - tempLabelValue) * yStep
                             Text("\(Int(round(tempLabelValue)))°") // Rounded
                                 .font(.system(size: 10))
                                 .foregroundColor(.gray)
                                 .frame(width: yAxisLabelWidth, height: labelHeight, alignment: .trailing)
                                 .position(x: geo.size.width / 2, y: yCenterOffset)
                         }
                     }
                 }
                 .frame(width: yAxisLabelWidth, height: graphHeight)
                 .padding(.trailing, 5)
            }

            // Divider Line - Keep as is
            Divider()
                 .background(Color.gray.opacity(0.4))
                 .padding(.horizontal, graphPadding / 2)
                 .padding(.top, 2)

            // (D) Bottom row with hour labels - Keep as is
            HStack {
                  if !hourlyItemsForSelectedDate.isEmpty {
                      Text("00").frame(maxWidth: .infinity, alignment: .leading) // Align first/last better
                      Text("06").frame(maxWidth: .infinity)
                      Text("12").frame(maxWidth: .infinity)
                      Text("18").frame(maxWidth: .infinity)
                      Text("00").frame(maxWidth: .infinity, alignment: .trailing) // Next day 00 marker
                  } else { Text("") }
             }
             .font(.system(size: 11))
             .foregroundColor(.gray)
             .frame(height: 20)
             .padding(.horizontal, graphPadding + yAxisLabelWidth / 4)
             .padding(.bottom, 4)
        }
    }

    // Helper to draw H/L text with background shadow/blur for contrast
    private func drawHLText(context: GraphicsContext, text: String, at point: CGPoint, yOffset: CGFloat) {
        let textPoint = CGPoint(x: point.x, y: point.y + yOffset)
        context.drawLayer { layerContext in
            layerContext.addFilter(.shadow(color: .black.opacity(0.7), radius: 1.5, x: 0, y: 0))
            layerContext.draw(
                Text(text).font(.system(size: 10, weight: .bold)).foregroundColor(.white),
                at: textPoint,
                anchor: .center
            )
        }
    }

    // Helper function to map temperature to gradient location (0.0 to 1.0)
    private func temperatureToGradientLocation(_ temp: Double, range: (min: Double, max: Double)) -> CGFloat {
        guard range.max > range.min else { return 0.5 } // Avoid division by zero
        let normalized = (temp - range.min) / (range.max - range.min)
        return CGFloat(max(0.0, min(1.0, normalized))) // Clamp between 0 and 1
    }


    // MARK: - Other Subviews (Toggle, Text, Placeholders) - Keep as is

    private var actualFeelsLikeToggle: some View {
        HStack(spacing: 5) {
            Button { showingFeelsLike = false } label: {
                Text("Actual")
                    .font(.system(size: 12, weight: .medium)).padding(.vertical, 7).padding(.horizontal, 12).frame(maxWidth: .infinity)
                    .foregroundColor(!showingFeelsLike ? .black : .gray) // Adjust text color for selection
                    .background(!showingFeelsLike ? Color.white : Color.clear) // Use white bg for selected
                    .cornerRadius(15)
            }.buttonStyle(.plain)
            Button { showingFeelsLike = true } label: {
                Text("Feels Like")
                    .font(.system(size: 12, weight: .medium)).padding(.vertical, 7).padding(.horizontal, 12).frame(maxWidth: .infinity)
                    .foregroundColor(showingFeelsLike ? .black : .gray) // Adjust text color for selection
                    .background(showingFeelsLike ? Color.white : Color.clear) // Use white bg for selected
                    .cornerRadius(15)
            }.buttonStyle(.plain)
        }
        .padding(3)
        .background(Color.white.opacity(0.15)) // Slightly more opaque background
        .clipShape(Capsule())
    }

    private var descriptionText: some View {
        Text(showingFeelsLike
             ? "What the temperature feels like as a result of humidity, sunlight or wind."
             : "The actual air temperature."
            )
            .font(.caption)
            .foregroundColor(.secondary)
            .lineSpacing(3)
    }

    // --- All placeholder sections remain the same ---
    // ... (ChanceOfPrecipSection, PrecipitationTotalsSection, ForecastSection, etc.) ...
    // MARK: - Допълнителни Placeholder секции
    private var chanceOfPrecipSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Chance of Precipitation")
                .font(.system(size: 16, weight: .semibold))
            Text("Tuesday's chance: \(chanceOfPrecipitationToday)%") // Example Text
                .font(.system(size: 13))
                .foregroundColor(.white.opacity(0.8))
            
            // Ensure your PrecipitationChanceGraph uses hourlyItemsForSelectedDate
            PrecipitationChanceGraph(hourlyItems: hourlyItemsForSelectedDate)
                .frame(height: 80)
                .padding(.top, 5)
            
            Text("The daily chance of precipitation tends to be higher than the chance for each hour.")
                .font(.caption)
                .foregroundColor(.secondary)
                .padding(.top, 5)
        }
    }
    
    // Ensure PrecipitationChanceGraph uses the correct data structure if needed
    struct PrecipitationChanceGraph: View {
        let hourlyItems: [HourlyForecastItem]
        
        // Simplified placeholder - use your actual implementation
        var body: some View {
            Rectangle()
                .fill(Color.blue.opacity(0.2))
                .overlay(Text("Precip Graph Placeholder").foregroundColor(.gray))
                .frame(height: 80) // Match frame height
                 // Add your actual graph logic here
        }
    }
    
    private func precipitationTotalsSection(data: PrecipitationData) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Precipitation Totals")
                .font(.system(size:16,weight:.semibold))
            
            VStack(alignment: .leading, spacing:5) {
                Text("LAST 24 HOURS")
                    .font(.caption.weight(.medium))
                    .foregroundColor(.secondary)
                HStack {
                    Label("Snow", systemImage: "circle.fill")
                        .labelStyle(.iconOnly)
                        .foregroundColor(.white)
                    Text("Snow").font(.system(size:14))
                    Spacer()
                    Text("\(String(format:"%.1f",data.snowLast24h)) cm")
                        .font(.system(size:14))
                }
                HStack {
                    Label("Rain", systemImage:"circle.fill")
                        .labelStyle(.iconOnly)
                        .foregroundColor(.blue)
                    Text("Rain").font(.system(size:14))
                    Spacer()
                    Text("\(Int(data.rainLast24h)) mm")
                        .font(.system(size:14))
                }
            }
            .padding(.top,5)
            
            VStack(alignment: .leading, spacing:5) {
                Text("NEXT 24 HOURS")
                    .font(.caption.weight(.medium))
                    .foregroundColor(.secondary)
                HStack {
                    Text("Precipitation").font(.system(size:14))
                    Spacer()
                    Text("\(Int(data.precipNext24h)) mm")
                        .font(.system(size:14))
                }
            }
            .padding(.top,10)
        }
    }
    
    private func forecastSection(summary:String) -> some View {
        VStack(alignment:.leading, spacing:5) {
            Text("Forecast")
                .font(.system(size:16, weight:.semibold))
            Text(summary)
                .font(.system(size:14))
                .lineSpacing(4)
                .foregroundColor(.white.opacity(0.9))
        }
    }
    
    private func dailyComparisonSection(data:DailyComparisonData) -> some View {
        VStack(alignment:.leading, spacing:8) {
            Text("Daily Comparison")
                .font(.system(size:16, weight:.semibold))
            
            Text(data.highIsLower
                 ? "The high temperature today is lower than yesterday."
                 : "The high temperature today is higher than yesterday."
            )
            .font(.system(size:14))
            .foregroundColor(.white.opacity(0.9))
            .padding(.bottom,5)
            
            dailyComparisonRow(label:"Today", minTemp:data.todayMin, maxTemp:data.todayMax,
                               overallMin:min(data.todayMin,data.yesterdayMin),
                               overallMax:max(data.todayMax,data.yesterdayMax))
            dailyComparisonRow(label:"Yesterday", minTemp:data.yesterdayMin, maxTemp:data.yesterdayMax,
                               overallMin:min(data.todayMin,data.yesterdayMin),
                               overallMax:max(data.todayMax,data.yesterdayMax))
        }
    }
    
    // Make sure DailyComparisonRow is defined or imported
    private func dailyComparisonRow(label:String, minTemp:Double, maxTemp:Double,
                                    overallMin:Double, overallMax:Double) -> some View {
        DailyComparisonRow(
            label: label,
            minTemp: minTemp,
            maxTemp: maxTemp,
            overallMin: overallMin,
            overallMax: overallMax
        )
    }
    
    // Ensure this struct is defined
    struct DailyComparisonRow:View {
        let label:String
        let minTemp:Double
        let maxTemp:Double
        let overallMin:Double
        let overallMax:Double
        
        private var range:Double { max(1, overallMax-overallMin) }
        private var startOffsetPercentage:CGFloat {
            CGFloat((minTemp-overallMin)/range)
        }
        private var widthPercentage:CGFloat {
            CGFloat((maxTemp-minTemp)/range)
        }
        
        var body: some View {
            HStack {
                Text(label).font(.system(size:14,weight:.medium))
                    .frame(width:70,alignment:.leading)
                Text("\(Int(round(minTemp)))°") // Rounded
                    .font(.system(size:14))
                    .foregroundColor(.secondary)
                    .frame(width:30,alignment:.trailing)
                
                GeometryReader { geo in
                    ZStack(alignment:.leading) {
                        Capsule().fill(Color.gray.opacity(0.3)).frame(height:4)
                        Capsule()
                            // You could apply a simple gradient here too if desired
                            .fill(LinearGradient(colors:[.blue.opacity(0.7),.yellow.opacity(0.7)], startPoint:.leading, endPoint:.trailing))
                            .frame(width:max(4, geo.size.width*widthPercentage), height:4) // Ensure min width
                            .offset(x:geo.size.width*startOffsetPercentage)
                    }
                    .frame(height:4)
                    .position(x:geo.size.width/2,y:geo.size.height/2)
                    .clipShape(Capsule()) // Clip the whole container
                }
                .frame(height:20)
                
                Text("\(Int(round(maxTemp)))°").font(.system(size:14)) // Rounded
                    .frame(width:30, alignment:.trailing)
            }
        }
    }
    
    private var aboutFeelsLikeSection: some View {
        VStack(alignment:.leading, spacing:5) {
            Text("About Feels Like Temperature")
                .font(.system(size:16, weight:.semibold))
            Text("Feels Like conveys how warm or cold it feels and can be different from the actual temperature. The Feels Like temperature is affected by humidity, sunlight and wind.")
                .font(.system(size:14))
                .lineSpacing(4)
                .foregroundColor(.white.opacity(0.9))
        }
    }
    
    private var optionsSection: some View {
        VStack(alignment:.leading, spacing:10) {
            Text("Options")
                .font(.system(size:16, weight:.semibold))
            
            OptionRow(label:"Temperature", value:"Use system setting (°C)")
            OptionRow(label:"Precipitation", value:"mm, cm")
        }
    }
    
    // Ensure this struct is defined
    struct OptionRow:View {
        let label:String
        let value:String
        var body: some View {
            VStack(alignment: .leading, spacing: 8) { // Use VStack for label/value and divider
                HStack {
                    Text(label).font(.system(size:14))
                    Spacer()
                    Text(value).font(.system(size:14))
                        .foregroundColor(.gray)
                    Image(systemName:"chevron.up.chevron.down")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                Divider().background(Color.gray.opacity(0.3))
            }
        }
    }

}

// MARK: - RECT EXTENSION - Keep as is
extension CGRect {
    init(center: CGPoint, radius: CGFloat) {
        self.init(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2)
    }
}
