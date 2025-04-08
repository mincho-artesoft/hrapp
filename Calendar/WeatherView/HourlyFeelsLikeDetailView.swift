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
    @StateObject private var vm = WeatherKitViewModel.shared
    // 1) Data Sources - Keep as is
    let allHourlyItems: [HourlyForecastItem]
    let allDailyItems: [DayForecastItem]
    let currentActualTemp: Double?
    let currentFeelsLikeTemp: Double?
    @State private var selectedOption: Int = 0   // 2) State - Keep as is
    @State private var selectedDate: Date
    @State private var showingFeelsLike = false
    // Изтриваме state за popover, защото Menu ще се използва
    // @State private var showDropdown = false
    
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
        let startOfDay = Calendar.current.startOfDay(for: selectedDate)
        var fullDayItems: [HourlyForecastItem] = []
        for hourOffset in 0..<24 {
            let hourDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: startOfDay)!
            if let realItem = allHourlyItems.first(where: {
                Calendar.current.isDate($0.date, equalTo: hourDate, toGranularity: .hour)
            }) {
                fullDayItems.append(realItem)
            } else {
                let placeholder = HourlyForecastItem(
                    id: hourDate,
                    date: hourDate,
                    hour: String(format: "%02d", hourOffset),
                    temp: 0,
                    feelsLikeTemp: 0,
                    symbol: "nosign"
                )
                fullDayItems.append(placeholder)
            }
        }
        return fullDayItems
    }
    
    private var displayedSymbol: String {
        if let dayItem = allDailyItems.first(where: { Calendar.current.isDate($0.date, inSameDayAs: selectedDate) }) {
            return dayItem.symbol
        }
        return "cloud"
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
    
    // MARK: - Graph Configuration - Keep as is
    private let graphPadding: CGFloat = 25
    private let yAxisLabelWidth: CGFloat = 35
    private let graphHeight: CGFloat = 160
    
    private var temperatures: [Double] {
        hourlyItemsForSelectedDate.map { showingFeelsLike ? $0.feelsLikeTemp : $0.temp }
    }
    
    private var yAxisRange: (min: Double, max: Double) {
        let allTemps = hourlyItemsForSelectedDate.flatMap { [$0.temp, $0.feelsLikeTemp] }
        guard let dataMin = allTemps.min(), let dataMax = allTemps.max(), !allTemps.isEmpty else {
            return (-5, 35)
        }
        let rangeBuffer: Double = 5.0
        let minRangeSpan: Double = 20
        var suggestedMin = floor(dataMin / 5.0) * 5.0 - rangeBuffer
        var suggestedMax = ceil(dataMax / 5.0) * 5.0 + rangeBuffer
        if (suggestedMax - suggestedMin) < minRangeSpan {
            let center = (suggestedMax + suggestedMin) / 2.0
            suggestedMin = center - (minRangeSpan / 2.0)
            suggestedMax = center + (minRangeSpan / 2.0)
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
                    
                    dateCarousel
                    
                    Text(selectedDate, formatter: headerDateFormatter)
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .padding(.horizontal)
                        .padding(.bottom, 5)
                    
                    currentStatusHeader
                        .padding(.horizontal)
                        .padding(.bottom, 10)
                    
                    hourlyGraphSection()
                    
                    actualFeelsLikeToggle
                        .padding(.vertical, 15)
                        .padding(.horizontal)
                    
                    descriptionText
                        .padding(.horizontal)
                        .padding(.bottom)
                    
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
    
    // MARK: - Subviews
    
    private var customNavBar: some View {
        HStack {
            Spacer()
            Label(displayedCondition, systemImage: displayedSymbol)
                .font(.headline)
                .foregroundColor(.white)
            Spacer()
            Button {
                dismiss()
            } label: {
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
            today: Date(),
            selectedDay: $selectedDate
        )
        .padding(.bottom, 10)
    }
    
    private var currentStatusHeader: some View {
        HStack(alignment: .top) {
            if let dayItem = allDailyItems.first(where: {
                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
            }) {
                if showingFeelsLike, let feelsLike = currentFeelsLikeTemp {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Feels Like")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.secondary)
                        Text("\(Int(round(feelsLike)))°")
                            .font(.system(size: 70, weight: .thin))
                    }
                } else if let actual = currentActualTemp {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Actual")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.secondary)
                        HStack(alignment: .top, spacing: 10) {
                            Text("\(Int(round(actual)))°")
                                .font(.system(size: 70, weight: .thin))
                            VStack(alignment: .leading, spacing: 4) {
                                Text("H: \(Int(round(dayItem.maxTemp)))°")
                                    .font(.system(size: 14, weight: .regular))
                                Text("L: \(Int(round(dayItem.minTemp)))°")
                                    .font(.system(size: 14, weight: .regular))
                                    .foregroundColor(.gray)
                            }
                        }
                    }
                } else {
                    Text("--°")
                        .font(.system(size: 70, weight: .thin))
                }
                Image(systemName: dayItem.symbol)
                    .symbolVariant(.fill)
                    .symbolRenderingMode(.multicolor)
                    .font(.system(size: 40))
                    .shadow(color: .black.opacity(0.1), radius: 1, y: 1)
                    .offset(y: 14)
                
                Spacer()
                UIWeatherMenuButtonRepresentable(
                    currentView: selectedOption,
                    onViewChange: { newTab in
                        selectedOption = newTab
                    }
                )
                .frame(width: 30, height: 30)


            } else {
                Text("--°")
                    .font(.system(size: 70, weight: .thin))
                Spacer()
            }
        }
    }
    
    @ViewBuilder
    private func hourlyGraphSection() -> some View {
        let currentTemperatures = temperatures
        let yRange = yAxisRange
        let hourMarkers = [0, 6, 12, 18, 24]
        
        let purple   = Color(hue: 0.75, saturation: 0.7, brightness: 0.7)
        let darkBlue = Color(hue: 0.65, saturation: 0.8, brightness: 0.8)
        let cyan     = Color(hue: 0.55, saturation: 0.7, brightness: 0.9)
        let green    = Color(hue: 0.33, saturation: 0.6, brightness: 0.8)
        let yellow   = Color(hue: 0.15, saturation: 0.8, brightness: 1.0)
        let orange   = Color(hue: 0.08, saturation: 0.9, brightness: 1.0)
        let red      = Color(hue: 0.00, saturation: 0.9, brightness: 0.9)
        
        let gradient = Gradient(stops: [
            .init(color: purple,   location: temperatureToGradientLocation(-10, range: yRange)),
            .init(color: darkBlue, location: temperatureToGradientLocation(0, range: yRange)),
            .init(color: cyan,     location: temperatureToGradientLocation(12, range: yRange)),
            .init(color: green,    location: temperatureToGradientLocation(22, range: yRange)),
            .init(color: yellow,   location: temperatureToGradientLocation(25, range: yRange)),
            .init(color: orange,   location: temperatureToGradientLocation(30, range: yRange)),
            .init(color: red,      location: temperatureToGradientLocation(35, range: yRange))
        ])
        
        VStack(spacing: 0) {
            let twoHourItemsForIcons = hourlyItemsForSelectedDate
                .enumerated()
                .filter { index, _ in index % 2 == 0 }
                .map { _, item in item }
            
            HStack(spacing: 0) {
                if twoHourItemsForIcons.isEmpty {
                    Text("No hourly data available for this day.")
                        .font(.caption)
                        .foregroundColor(.gray)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical)
                } else {
                    ForEach(Array(twoHourItemsForIcons), id: \.id) { item in
                        Image(systemName: "\(item.symbol).fill")
                            .symbolRenderingMode(.multicolor)
                            .font(.system(size: 13))
                            .frame(maxWidth: .infinity)
                            .opacity(item.date < Date() ? 0.6 : 1.0)
                    }
                }
            }
            .frame(height: 20)
            .padding(.horizontal, graphPadding)
            .padding(.bottom, -15)
            
            Canvas { context, size in
                guard !currentTemperatures.isEmpty,
                      currentTemperatures.count > 1,
                      size.width > graphPadding,
                      size.height > graphPadding * 2,
                      yRange.max > yRange.min else { return }
                
                let effectiveWidth = size.width
                let effectiveHeight = size.height
                let origin = CGPoint(x: graphPadding, y: effectiveHeight - graphPadding)
                let graphContentWidth  = effectiveWidth - graphPadding * 2
                let graphContentHeight = effectiveHeight - graphPadding * 2
                let yStep = graphContentHeight / CGFloat(yRange.max - yRange.min)
                
                func yPosition(for temp: Double) -> CGFloat {
                    origin.y - CGFloat(temp - yRange.min) * yStep
                }
                
                for tempLabelValue in yAxisLabels {
                    let yPos = yPosition(for: tempLabelValue)
                    var hLine = Path()
                    hLine.move(to: CGPoint(x: origin.x, y: yPos))
                    hLine.addLine(to: CGPoint(x: origin.x + graphContentWidth, y: yPos))
                    context.stroke(
                        hLine,
                        with: .color(.gray.opacity(0.3)),
                        style: StrokeStyle(lineWidth: 0.5)
                    )
                    let textX = origin.x + graphContentWidth + 15
                    let textPoint = CGPoint(x: textX, y: yPos)
                    context.draw(
                        Text("\(Int(round(tempLabelValue)))°")
                            .font(.system(size: 10))
                            .foregroundColor(.gray),
                        at: textPoint,
                        anchor: .center
                    )
                }
                
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (graphContentWidth / 24.0))
                    var vLine = Path()
                    vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                    vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                    context.stroke(
                        vLine,
                        with: .color(.gray.opacity(0.3)),
                        style: StrokeStyle(lineWidth: 0.5)
                    )
                }
                
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
                        fillPath.move(to: CGPoint(x: xPos, y: origin.y))
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
                
                context.drawLayer { layerContext in
                    layerContext.fill(
                        fillPath,
                        with: .linearGradient(
                            gradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint: CGPoint(x: 0, y: 0)
                        )
                    )
                    let opacityGradient = Gradient(colors: [.clear, .black.opacity(0.8)])
                    layerContext.blendMode = .destinationOut
                    layerContext.fill(
                        fillPath,
                        with: .linearGradient(
                            opacityGradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint: CGPoint(x: 0, y: 0)
                        )
                    )
                    layerContext.blendMode = .normal
                }
                
                context.drawLayer { layerContext in
                    let lineWidth: CGFloat = 2.5
                    let stroked = linePath.strokedPath(.init(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))
                    layerContext.clip(to: stroked)
                    layerContext.fill(
                        Path(CGRect(origin: .zero, size: size)),
                        with: .linearGradient(
                            gradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint: CGPoint(x: 0, y: 0)
                        )
                    )
                }
                
                let validPoints = points.filter { !$0.x.isNaN && !$0.y.isNaN }
                guard !validPoints.isEmpty else { return }
                
                if let maxTemp = currentTemperatures.max(),
                   let maxIndex = currentTemperatures.firstIndex(of: maxTemp),
                   validPoints.indices.contains(maxIndex) {
                    let highPoint = validPoints[maxIndex]
                    drawHLMarker(
                        context: context,
                        label: "H",
                        at: highPoint,
                        temperature: maxTemp,
                        range: yRange,
                        gradient: gradient
                    )
                }
                
                if let minTemp = currentTemperatures.min(),
                   let minIndex = currentTemperatures.firstIndex(of: minTemp),
                   validPoints.indices.contains(minIndex) {
                    let lowPoint = validPoints[minIndex]
                    drawHLMarker(
                        context: context,
                        label: "L",
                        at: lowPoint,
                        temperature: minTemp,
                        range: yRange,
                        gradient: gradient
                    )
                }
                
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (graphContentWidth / 24.0))
                    let textPoint = CGPoint(x: xPos, y: origin.y + 14)
                    context.draw(
                        Text(String(format: "%02d", hour))
                            .font(.system(size: 11))
                            .foregroundColor(.gray),
                        at: textPoint,
                        anchor: .center
                    )
                }
                
                var calendar = Calendar(identifier: .gregorian)
                calendar.timeZone = vm.locationTimeZone
                if calendar.isDate(Date(), inSameDayAs: selectedDate),
                   let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                       calendar.isDate($0.date, equalTo: Date(), toGranularity: .hour)
                   }) {
                    let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
                    let currentLineYOffset: CGFloat = graphPadding + 20
                    var verticalPath = Path()
                    verticalPath.move(to: CGPoint(x: currentXPos, y: currentLineYOffset))
                    verticalPath.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                    
                    let currentTemp = currentTemperatures[currentHourIndex]
                    let currentColor = colorForTemperature(currentTemp, in: yRange, using: gradient)
                    
                    context.stroke(
                        verticalPath,
                        with: .color(currentColor),
                        style: StrokeStyle(lineWidth: 2)
                    )
                    
                    let darkenRect = CGRect(
                        x: origin.x,
                        y: graphPadding,
                        width: currentXPos - origin.x,
                        height: effectiveHeight - graphPadding * 2
                    )
                    context.fill(
                        Path(darkenRect),
                        with: .color(.black.opacity(0.3))
                    )
                }
            }
            .frame(height: graphHeight + 20)
            
            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2)
                .padding(.top, 2)
        }
    }
    
    // MARK: - HELPER: Рисуване на маркер (H / L)
    private func drawHLMarker(
        context: GraphicsContext,
        label: String,
        at point: CGPoint,
        temperature: Double,
        range: (min: Double, max: Double),
        gradient: Gradient
    ) {
        context.drawLayer { layerContext in
            let innerColor = colorForTemperature(temperature, in: range, using: gradient)
            let outerRadius: CGFloat = 6
            let outerRect = CGRect(center: point, radius: outerRadius)
            let outerPath = Path(ellipseIn: outerRect)
            layerContext.fill(outerPath, with: .color(.black))
            
            let innerRadius: CGFloat = 3
            let innerRect = CGRect(center: point, radius: innerRadius)
            let innerPath = Path(ellipseIn: innerRect)
            layerContext.fill(innerPath, with: .color(innerColor))
            
            let textOffsetY: CGFloat = outerRadius + 4
            let textPoint = CGPoint(x: point.x, y: point.y - textOffsetY)
            
            layerContext.draw(
                Text(label)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.gray),
                at: textPoint,
                anchor: .center
            )
        }
    }
    
    private func colorForTemperature(
        _ temperature: Double,
        in range: (min: Double, max: Double),
        using gradient: Gradient
    ) -> Color {
        let loc = temperatureToGradientLocation(temperature, range: range)
        let stops = gradient.stops.sorted { $0.location < $1.location }
        guard let firstStop = stops.first, let lastStop = stops.last else {
            return .white
        }
        if loc <= firstStop.location { return firstStop.color }
        if loc >= lastStop.location { return lastStop.color }
        for i in 0..<stops.count - 1 {
            let lower = stops[i]
            let upper = stops[i+1]
            if loc >= lower.location && loc <= upper.location {
                let ratio = (loc - lower.location) / (upper.location - lower.location)
                return (ratio < 0.5) ? lower.color : upper.color
            }
        }
        return .white
    }
    
    private func temperatureToGradientLocation(_ temp: Double, range: (min: Double, max: Double)) -> CGFloat {
        guard range.max > range.min else { return 0.5 }
        let normalized = (temp - range.min) / (range.max - range.min)
        return CGFloat(max(0.0, min(1.0, normalized)))
    }
    
    // MARK: - Други Subviews
    private var actualFeelsLikeToggle: some View {
        HStack(spacing: 5) {
            Button {
                showingFeelsLike = false
            } label: {
                Text("Actual")
                    .font(.system(size: 12, weight: .medium))
                    .padding(.vertical, 7)
                    .padding(.horizontal, 12)
                    .frame(maxWidth: .infinity)
                    .foregroundColor(!showingFeelsLike ? .black : .gray)
                    .background(!showingFeelsLike ? Color.white : Color.clear)
                    .cornerRadius(15)
            }
            .buttonStyle(.plain)
            
            Button {
                showingFeelsLike = true
            } label: {
                Text("Feels Like")
                    .font(.system(size: 12, weight: .medium))
                    .padding(.vertical, 7)
                    .padding(.horizontal, 12)
                    .frame(maxWidth: .infinity)
                    .foregroundColor(showingFeelsLike ? .black : .gray)
                    .background(showingFeelsLike ? Color.white : Color.clear)
                    .cornerRadius(15)
            }
            .buttonStyle(.plain)
        }
        .padding(3)
        .background(Color.white.opacity(0.15))
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
    
    private var chanceOfPrecipSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Chance of Precipitation")
                .font(.system(size: 16, weight: .semibold))
            Text("Tuesday's chance: \(chanceOfPrecipitationToday)%")
                .font(.system(size: 13))
                .foregroundColor(.white.opacity(0.8))
            PrecipitationChanceGraph(hourlyItems: hourlyItemsForSelectedDate)
                .frame(height: 80)
                .padding(.top, 5)
            Text("The daily chance of precipitation tends to be higher than the chance for each hour.")
                .font(.caption)
                .foregroundColor(.secondary)
                .padding(.top, 5)
        }
    }
    
    struct PrecipitationChanceGraph: View {
        let hourlyItems: [HourlyForecastItem]
        var body: some View {
            Rectangle()
                .fill(Color.blue.opacity(0.2))
                .overlay(Text("Precip Graph Placeholder").foregroundColor(.gray))
                .frame(height: 80)
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
    
    private func forecastSection(summary: String) -> some View {
        VStack(alignment:.leading, spacing:5) {
            Text("Forecast")
                .font(.system(size:16, weight:.semibold))
            Text(summary)
                .font(.system(size:14))
                .lineSpacing(4)
                .foregroundColor(.white.opacity(0.9))
        }
    }
    
    private func dailyComparisonSection(data: DailyComparisonData) -> some View {
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
                               overallMin:min(data.todayMin, data.yesterdayMin),
                               overallMax:max(data.todayMax, data.yesterdayMax))
            dailyComparisonRow(label:"Yesterday", minTemp:data.yesterdayMin, maxTemp:data.yesterdayMax,
                               overallMin:min(data.todayMin, data.yesterdayMin),
                               overallMax:max(data.todayMax, data.yesterdayMax))
        }
    }
    
    private func dailyComparisonRow(label: String, minTemp: Double, maxTemp: Double,
                                    overallMin: Double, overallMax: Double) -> some View {
        DailyComparisonRow(
            label: label,
            minTemp: minTemp,
            maxTemp: maxTemp,
            overallMin: overallMin,
            overallMax: overallMax
        )
    }
    
    struct DailyComparisonRow: View {
        let label: String
        let minTemp: Double
        let maxTemp: Double
        let overallMin: Double
        let overallMax: Double
        
        private var range: Double { max(1, overallMax - overallMin) }
        private var startOffsetPercentage: CGFloat { CGFloat((minTemp - overallMin) / range) }
        private var widthPercentage: CGFloat { CGFloat((maxTemp - minTemp) / range) }
        
        var body: some View {
            HStack {
                Text(label)
                    .font(.system(size:14, weight:.medium))
                    .frame(width:70, alignment:.leading)
                Text("\(Int(round(minTemp)))°")
                    .font(.system(size:14))
                    .foregroundColor(.secondary)
                    .frame(width:30, alignment:.trailing)
                GeometryReader { geo in
                    ZStack(alignment:.leading) {
                        Capsule()
                            .fill(Color.gray.opacity(0.3))
                            .frame(height: 4)
                        Capsule()
                            .fill(LinearGradient(colors: [.blue.opacity(0.7), .yellow.opacity(0.7)], startPoint: .leading, endPoint: .trailing))
                            .frame(width: max(4, geo.size.width * widthPercentage), height: 4)
                            .offset(x: geo.size.width * startOffsetPercentage)
                    }
                    .frame(height: 4)
                    .position(x: geo.size.width/2, y: geo.size.height/2)
                    .clipShape(Capsule())
                }
                .frame(height: 20)
                Text("\(Int(round(maxTemp)))°")
                    .font(.system(size:14))
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
    
    struct OptionRow: View {
        let label: String
        let value: String
        var body: some View {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(label)
                        .font(.system(size:14))
                    Spacer()
                    Text(value)
                        .font(.system(size:14))
                        .foregroundColor(.gray)
                    Image(systemName: "chevron.up.chevron.down")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                Divider()
                    .background(Color.gray.opacity(0.3))
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
