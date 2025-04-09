import SwiftUI
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - Dummy Structures (Placeholder) - Keep as is

struct DailyComparisonData {
    let todayMin: Double = -2
    let todayMax: Double = 4
    let yesterdayMin: Double = 0
    let yesterdayMax: Double = 7
    let highIsLower: Bool = true
}

// MARK: - Главният изглед
struct WeatherDetailView: View {
    @StateObject private var vm = WeatherKitViewModel.shared
    // 1) Data Sources - Keep as is
    let allHourlyItems: [HourlyForecastItem]
    let allDailyItems: [DayForecastItem]
    let currentActualTemp: Double?
    let currentFeelsLikeTemp: Double?
    @State private var selectedOption: Int = 0   // 2) State - Keep as is
    @State private var selectedDate: Date
    @State private var showingFeelsLike = false
    @State private var dragLocationTEMP: CGPoint? = nil
    @State private var dragLocationPreci: CGPoint? = nil
    @State private var dragLocationUV: CGPoint? = nil

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
                    symbol: "nosign",
                    precipChance: 0,
                    uvIndex: 0
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
                    
                    hourlyGraphSection()
                        .padding(.horizontal)
                        .padding(.bottom)
                    
                    chanceOfPrecipGraphSection()
                        .padding(.horizontal)
                        .padding(.bottom)
                    
                    UVGraphSection()
                        .padding(.horizontal)
                        .padding(.bottom)
                    
                    if let todayForecast = allDailyItems.first(where: {
                        Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
                    }) {
                        precipitationTotalsSection(for: todayForecast)
                            .padding(.horizontal)
                            .padding(.bottom)
                    }
                    
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
    private var dynamicLabelText: String {
        switch selectedOption {
        case 0: return "Conditions"
        case 1: return "UV Index"
        case 2: return "Wind"
        case 3: return "Precipitation"
        case 4: return "Humidity"
        case 5: return "Visibility"
        case 6: return "Pressure"
        default: return displayedCondition
        }
    }

    private var dynamicLabelIcon: String {
        switch selectedOption {
        case 0: return "cloud.sun.fill"
        case 1: return "sun.max.fill"
        case 2: return "wind"
        case 3: return "drop.fill"
        case 4: return "humidity"
        case 5: return "eye.fill"
        case 6: return "gauge"
        default: return displayedSymbol
        }
    }

    private var customNavBar: some View {
        HStack {
            Spacer()
            Label(dynamicLabelText, systemImage: dynamicLabelIcon)
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

    @ViewBuilder
    private func hourlyGraphSection() -> some View {
        // Избираме актуалната дата (сега) и изчисляваме дял от деня (0.0...1.0)
           let now = Date()
           let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
           let secondsFromMidnight = now.timeIntervalSince(startOfSelectedDay)
           let fractionOfDay = secondsFromMidnight / (24 * 3600)

           let currentTemperatures = temperatures
           let yRange = yAxisRange
           let hourMarkers = [0, 6, 12, 18, 24]
           
           // Определяме цветове и градиент
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
               // Първата част: показване на текущата температура, минимална/максимална стойност и иконка
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
               
               // Втората част: Часови икони с надложен затъмнителен слой за миналото.
               GeometryReader { geo in
                   ZStack(alignment: .leading) {
                       HStack(spacing: 0) {
                           let twoHourItemsForIcons = hourlyItemsForSelectedDate
                               .enumerated()
                               .filter { index, _ in index % 2 == 0 }
                               .map { $0.element }
                           
                           if twoHourItemsForIcons.isEmpty {
                               Text("No hourly data available for this day.")
                                   .font(.caption)
                                   .foregroundColor(.gray)
                                   .frame(maxWidth: .infinity, alignment: .center)
                                   .padding(.vertical)
                           } else {
                               ForEach(twoHourItemsForIcons, id: \.id) { item in
                                   if item.symbol == "wind"{
                                       Image(systemName: "\(item.symbol)")
                                           .symbolRenderingMode(.multicolor)
                                           .font(.system(size: 13))
                                           .frame(maxWidth: .infinity)
                                   }else{
                                       Image(systemName: "\(item.symbol).fill")
                                           .symbolRenderingMode(.multicolor)
                                           .font(.system(size: 13))
                                           .frame(maxWidth: .infinity)
                                           .offset(y: item.symbol == "cloud.fill" ? -5 : 0)
                                   }
                               }
                           }
                       }
                       
                       // Ако избраният ден съвпада с днешния, поставяме затъмняващ слой и вертикална линия,
                       // които използват една и съща дробна стойност (fractionOfDay)
                       if Calendar.current.isDate(now, inSameDayAs: selectedDate) {
                           let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                           // Полупрозрачен правоъгълник, който покрива частта до текущото време
                           Rectangle()
                               .fill(Color.black.opacity(0.4))
                               .frame(width: overlayWidth)
                         
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
                
                // Рисуване на хоризонталните линии и температурните етикети
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
                
                // Вертикални часовникови маркери
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
                
                // Изчисляване на точките за чертане на температурната линия
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
                
                // Рисуване на запълнената област под линията
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
                
                // Рисуване на температурната линия с градиент
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
                
                // Поставяне на маркери за най-висока и най-ниска температура
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
                
                // Часовникови надписи под графиката
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
                
                // *** Блок за текущото време и затъмняване ***
               
                if Calendar.current.isDate(Date(), inSameDayAs: selectedDate),
                   let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                       Calendar.current.isDate($0.date, equalTo: Date(), toGranularity: .hour)
                   }) {
                    let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
                    let currentLineYOffset: CGFloat = graphPadding - 120
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
                
                // *** Блок за Drag Gesture – вертикална линия с интерполация ***
                if let dragPoint = dragLocationTEMP {
                    if dragPoint.x >= origin.x && dragPoint.x <= origin.x + graphContentWidth {
                        // Изчисляване на позиционирането в данните
                        let fractionIndex = (dragPoint.x - origin.x) / xStep
                        let lowerIndex = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                        let upperIndex = max(0, min(points.count - 1, lowerIndex + 1))
                        let t: CGFloat = (upperIndex == lowerIndex) ? 0 : (fractionIndex - CGFloat(lowerIndex))
                        
                        // Интерполация на температурата
                        let interpolatedTemp = currentTemperatures[lowerIndex] + (currentTemperatures[upperIndex] - currentTemperatures[lowerIndex]) * Double(t)
                        
                        // Интерполация на y–координатата
                        var interpolatedY: CGFloat = points[lowerIndex].y
                        if upperIndex != lowerIndex {
                            interpolatedY = points[lowerIndex].y + t * (points[upperIndex].y - points[lowerIndex].y)
                        }
                        let dotPoint = CGPoint(x: dragPoint.x, y: interpolatedY)
                        
                        // Чертаем вертикална линия през точката (от горната до долната граница на графиката)
                        var verticalLine = Path()
                        verticalLine.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                        verticalLine.addLine(to: CGPoint(x: dotPoint.x, y: effectiveHeight - graphPadding))
                        context.stroke(verticalLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                        
                        // Рисуване на маркера (точката)
                        let dotRect = CGRect(center: dotPoint, radius: 4)
                        context.fill(Path(ellipseIn: dotRect), with: .color(.white))
                        
                        // Извличане на елемента от данни, според приблизителния индекс
                        let selectedIndex = max(0, min(hourlyItemsForSelectedDate.count - 1, Int(round(fractionIndex))))
                        let forecastItem = hourlyItemsForSelectedDate[selectedIndex]
                        
                        // Изчисляване на интерполираната дата за точните минути (добавяме дробна част от час към базовата дата)
                        let baseDate = hourlyItemsForSelectedDate[lowerIndex].date
                        let secondsOffset = (fractionIndex - CGFloat(lowerIndex)) * 3600.0  // 1 час = 3600 секунди
                        let interpolatedDate = baseDate.addingTimeInterval(TimeInterval(secondsOffset))
                        
                        // Фиксирано изместване за надписите вдясно от вертикалната линия
                        let labelOffset: CGFloat = 8
                        
                        // Рисуване на иконата чрез Text (използва се вграден Image за SF Symbol)
                        let iconSize: CGFloat = 10
                        let iconText = Text(Image(systemName: forecastItem.symbol))
                            .font(.system(size: iconSize))
                            .foregroundColor(.white)
                        let iconPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 45)
                        context.draw(iconText, at: iconPoint, anchor: .leading)
                        
                        // Форматиране на времето с минути (напр. "14:30")
                        let dateFormatter = DateFormatter()
                        dateFormatter.dateFormat = "HH:mm"
                        let exactTime = dateFormatter.string(from: interpolatedDate)
                        
                        // Рисуване на времето като текст вдясно от вертикалната линия
                        let timeText = Text(exactTime)
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.white)
                        let timePoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 30)
                        context.draw(timeText, at: timePoint, anchor: .leading)
                        
                        // Рисуване на температурата като текст вдясно от вертикалната линия
                        let temperatureText = Text("\(Int(round(interpolatedTemp)))°")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                        let tempPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 20)
                        context.draw(temperatureText, at: tempPoint, anchor: .leading)
                    }
                }


            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        dragLocationTEMP = value.location
                    }
                    .onEnded { _ in
                        dragLocationTEMP = nil
                    }
            )

            .frame(height: graphHeight + 20)
            
            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2)
                .padding(.top, 2)
        }
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
        
        Text(showingFeelsLike
             ? "What the temperature feels like as a result of humidity, sunlight or wind."
             : "The actual air temperature."
        )
        .font(.caption)
        .foregroundColor(.secondary)
        .lineSpacing(3)
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
   
    @ViewBuilder
    private func chanceOfPrecipGraphSection() -> some View {
        // Извличаме стойностите за вероятностите от часовата прогноза.
        let precipData = hourlyItemsForSelectedDate.map { $0.precipChance }
        // Задаваме фиксиран диапазон – от 0% до 100% (0.0 ... 1.0)
        let yRange: (min: Double, max: Double) = (0.0, 1.0)
        // Маркерите по оста за определени часове (0, 6, 12, 18, 24)
        let hourMarkers = [0, 6, 12, 18, 24]
        
        let todayChance: Int = {
            if let dayItem = allDailyItems.first(where: { Calendar.current.isDate($0.date, inSameDayAs: selectedDate) }) {
                return Int(dayItem.precipChance!*100)
            }
            return 0
        }()
        
        VStack(spacing: 0) {
          
            VStack(alignment: .leading, spacing: 5) {
                 Text("Chance of Precipitation")
                     .font(.system(size: 16, weight: .semibold))
                 Text("Today's chance: \(todayChance)%")
                     .font(.system(size: 13))
                     .foregroundColor(.white.opacity(0.8))
             }
             .frame(maxWidth: .infinity, alignment: .leading) // Задава максимална ширина и ляво подравняване
             .padding(.horizontal)
             .offset(x: -18)

            
            // Графиката с Canvas – чертае линия с запълнената област, марки и интерактивен drag gesture
            Canvas { context, size in
                guard precipData.count > 1,
                      size.width > graphPadding,
                      size.height > graphPadding * 2 else { return }
                
                let effectiveWidth = size.width
                let effectiveHeight = size.height
                let origin = CGPoint(x: graphPadding, y: effectiveHeight - graphPadding)
                let graphContentWidth = effectiveWidth - graphPadding * 2
                let graphContentHeight = effectiveHeight - graphPadding * 2
                let yStep = graphContentHeight / CGFloat(yRange.max - yRange.min)
                
                func yPosition(for chance: Double) -> CGFloat {
                    // По-голямата вероятност (до 1.0) води до по-висока позиция.
                    return origin.y - CGFloat(chance - yRange.min) * yStep
                }
                
                // Чертаме хоризонтални линии и надписи (0%, 25%, 50%, 75%, 100%)
                let percMarkers: [Double] = [0, 0.25, 0.5, 0.75, 1.0]
                for marker in percMarkers {
                    let yPos = yPosition(for: marker)
                    var hLine = Path()
                    hLine.move(to: CGPoint(x: origin.x, y: yPos))
                    hLine.addLine(to: CGPoint(x: origin.x + graphContentWidth, y: yPos))
                    context.stroke(hLine, with: .color(.gray.opacity(0.3)), style: StrokeStyle(lineWidth: 0.5))
                    let labelPoint = CGPoint(x: origin.x + graphContentWidth + 15, y: yPos)
                    context.draw(
                        Text("\(Int(marker * 100))%")
                            .font(.system(size: 10))
                            .foregroundColor(.gray),
                        at: labelPoint,
                        anchor: .center
                    )
                }
                
                // Чертаме вертикални линии за избрани часове (0, 6, 12, 18, 24)
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (graphContentWidth / 24.0))
                    var vLine = Path()
                    vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                    vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                    context.stroke(vLine, with: .color(.gray.opacity(0.3)), style: StrokeStyle(lineWidth: 0.5))
                }
                
                // Изчисляваме точките по линията
                var linePath = Path()
                var fillPath = Path()
                var points: [CGPoint] = []
                let itemCount = precipData.count
                let xStep = graphContentWidth / CGFloat(max(1, itemCount - 1))
                for (index, chance) in precipData.enumerated() {
                    let xPos = origin.x + CGFloat(index) * xStep
                    let yPos = yPosition(for: chance)
                    let pt = CGPoint(x: xPos, y: yPos)
                    points.append(pt)
                    if index == 0 {
                        linePath.move(to: pt)
                        fillPath.move(to: CGPoint(x: xPos, y: origin.y))
                        fillPath.addLine(to: pt)
                    } else {
                        linePath.addLine(to: pt)
                        fillPath.addLine(to: pt)
                    }
                }
                if let lastPt = points.last {
                    fillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                    fillPath.closeSubpath()
                }
                
                // Градиент от светло към наситен син
                let gradient = Gradient(stops: [
                    .init(color: Color.blue.opacity(0.4), location: 0),
                    .init(color: Color.blue.opacity(0.8), location: 1)
                ])
                
                // Запълване на областта под линията с градиент
                context.drawLayer { layerContext in
                    layerContext.fill(
                        fillPath,
                        with: .linearGradient(
                            gradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint: CGPoint(x: 0, y: 0)
                        )
                    )
                }
                
                // Чертаме линията на вероятностите
                context.stroke(linePath, with: .color(Color.blue), lineWidth: 2.5)
                
                // Ако не всички данни са 0, рисуваме маркерите за най-високата и най-ниската стойност.
                if !precipData.allSatisfy({ $0 == 0 }) {
                    if let maxChance = precipData.max(),
                       let maxIndex = precipData.firstIndex(of: maxChance),
                       points.indices.contains(maxIndex) {
                        let highPoint = points[maxIndex]
                        context.drawLayer { layerContext in
                            let outerRadius: CGFloat = 6
                            let innerRadius: CGFloat = 3
                            let outerRect = CGRect(center: highPoint, radius: outerRadius)
                            let innerRect = CGRect(center: highPoint, radius: innerRadius)
                            layerContext.fill(Path(ellipseIn: outerRect), with: .color(.black))
                            layerContext.fill(Path(ellipseIn: innerRect), with: .color(Color.blue))
                            let labelPoint = CGPoint(x: highPoint.x, y: highPoint.y - outerRadius - 4)
                            layerContext.draw(
                                Text("Max")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.gray),
                                at: labelPoint,
                                anchor: .center
                            )
                        }
                    }
                    if let minChance = precipData.min(),
                       let minIndex = precipData.firstIndex(of: minChance),
                       points.indices.contains(minIndex) {
                        let lowPoint = points[minIndex]
                        context.drawLayer { layerContext in
                            let outerRadius: CGFloat = 6
                            let innerRadius: CGFloat = 3
                            let outerRect = CGRect(center: lowPoint, radius: outerRadius)
                            let innerRect = CGRect(center: lowPoint, radius: innerRadius)
                            layerContext.fill(Path(ellipseIn: outerRect), with: .color(.black))
                            layerContext.fill(Path(ellipseIn: innerRect), with: .color(Color.blue))
                            let labelPoint = CGPoint(x: lowPoint.x, y: lowPoint.y - outerRadius - 4)
                            layerContext.draw(
                                Text("Min")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.gray),
                                at: labelPoint,
                                anchor: .center
                            )
                        }
                    }
                }
                
                // Изписваме часовите надписи под графиката.
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
                
                // Ако избраният ден е текущ, затъмняваме графичната област преди текущия час...
                if Calendar.current.isDate(Date(), inSameDayAs: selectedDate),
                   let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                       Calendar.current.isDate($0.date, equalTo: Date(), toGranularity: .hour)
                   }) {
                    let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
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
                    // ...и добавяме вертикална линия, отбелязваща текущия час.
                    var currentLine = Path()
                    currentLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                    currentLine.addLine(to: CGPoint(x: currentXPos, y: effectiveHeight - graphPadding))
                    context.stroke(currentLine, with: .color(.green), lineWidth: 2)
                }
                
                // Интерполация при Drag Gesture – показване на стойност на вероятността в проценти.
                if let dragPoint = dragLocationPreci {
                    if dragPoint.x >= origin.x && dragPoint.x <= origin.x + graphContentWidth {
                        
                        // 1) fractionIndex – позиция (0...n) между точките
                        let fractionIndex = (dragPoint.x - origin.x) / xStep
                        
                        // 2) Индекси на „долната“ и „горната“ точки
                        let lowerIndex = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                        let upperIndex = max(0, min(points.count - 1, lowerIndex + 1))
                        let t = (upperIndex == lowerIndex) ? 0 : (fractionIndex - CGFloat(lowerIndex))
                        
                        // 3) Интерполация на вероятността за валеж (precipData)
                        let lowerValue = precipData[lowerIndex]
                        let upperValue = precipData[upperIndex]
                        let interpolatedChance = lowerValue + (upperValue - lowerValue) * Double(t)
                        
                        // 4) Интерполация на координатата по Y (графиката)
                        var interpolatedY = points[lowerIndex].y
                        if upperIndex != lowerIndex {
                            interpolatedY = points[lowerIndex].y + t * (points[upperIndex].y - points[lowerIndex].y)
                        }
                        let dotPoint = CGPoint(x: dragPoint.x, y: interpolatedY)
                        
                        // 5) Вертикална линия, която показва текущата X позиция
                        var verticalPath = Path()
                        verticalPath.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                        verticalPath.addLine(to: CGPoint(x: dotPoint.x, y: effectiveHeight - graphPadding))
                        context.stroke(verticalPath, with: .color(.white.opacity(0.5)), lineWidth: 1)
                        
                        // 6) Малка бяла точка (dot), за да маркираме мястото
                        let dotRect = CGRect(center: dotPoint, radius: 4)
                        context.fill(Path(ellipseIn: dotRect), with: .color(.white))
                        
                        // 7) Интерполираме и времето, за да покажем точния "HH:mm"
                        let timeLabelString: String
                        if lowerIndex < hourlyItemsForSelectedDate.count, upperIndex < hourlyItemsForSelectedDate.count {
                            let lowerDate = hourlyItemsForSelectedDate[lowerIndex].date
                            let upperDate = hourlyItemsForSelectedDate[upperIndex].date
                            
                            let totalInterval = upperDate.timeIntervalSince(lowerDate)
                            let interpolatedDate = lowerDate.addingTimeInterval(totalInterval * Double(t))
                            
                            let dateFormatter = DateFormatter()
                            dateFormatter.dateFormat = "HH:mm"
                            timeLabelString = dateFormatter.string(from: interpolatedDate)
                        } else {
                            timeLabelString = "--:--"
                        }

                        // 8) Подготвяме многострочен етикет (час + % шанс за валеж)
                        let combinedLabel = Text("\(timeLabelString)\n\(Int(interpolatedChance * 100))%")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                        
                        // 9) Позиционираме го малко вдясно и нагоре (за да не се застъпва с точката)
                        let labelOffset: CGFloat = 8
                        let textPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 20)
                        
                        // Използваме .bottomLeading, за да „стъпи“ долният ред (процентът) там, където сме задали textPoint
                        context.draw(combinedLabel, at: textPoint, anchor: .bottomLeading)
                    }
                }
            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        dragLocationPreci = value.location
                    }
                    .onEnded { _ in
                        dragLocationPreci = nil
                    }
            )
            .frame(height: graphHeight + 20)
            
            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2)
                .padding(.top, 2)
        }
        Text("The daily chance of precipitation tends to be higher than the chance for each hour.")
            .font(.caption)
            .foregroundColor(.secondary)
            .padding(.top, 5)
    }
    
    private func uvCategory(for uv: Int) -> String {
        if uv >= 11 {
            return "Extreme"
        } else if uv >= 8 {
            return "Very High"
        } else if uv >= 6 {
            return "High"
        } else if uv >= 3 {
            return "Moderate"
        } else if uv >= 1 {
            return "Low"
        } else {
            return "None" // или "0", ако искате да показвате конкретно число
        }
    }
    
    @ViewBuilder
    private func UVGraphSection() -> some View {
        let now = Date()
        let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
        let secondsFromMidnight = now.timeIntervalSince(startOfSelectedDay)
        let fractionOfDay = secondsFromMidnight / (24 * 3600)
        // 1) Извличане на UV данните за избрания ден (24 часа)
        let uvData = hourlyItemsForSelectedDate.map { $0.uvIndex }
        
        // 2) Фиксиран мащаб от 0 до 12
        let yRange: (min: Double, max: Double) = (0, 12)
        
        // 3) Часови маркери – обикновено на всеки 6 часа
        let hourMarkers = [0, 6, 12, 18, 24]
        
        // 4) Определяне на дневния максимален UV от дневната прогноза
        let dayItem = allDailyItems.first {
            Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
        }
        let dailyMaxUV = dayItem?.maxUV ?? 0
        
    
        
        VStack(spacing: 8) {
            // Заглавна част
            VStack(alignment: .leading, spacing: 5) {
                Text("UV Index")
                    .font(.system(size: 16, weight: .semibold))
                Text("Today's \(uvCategory(for: dailyMaxUV)) \(dailyMaxUV)")
                    .font(.system(size: 13))
                    .foregroundColor(.white.opacity(0.8))
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal)
            .offset(x: -15)
            .offset(y: 30)

            // Хедър със средните стойности за всеки 2 часа – използваме същия изглед, какъвто имате в hourlyGraphSection.
            let twoHourAverages: [Int] = stride(from: 0, to: uvData.count, by: 2).map { startIndex in
                let endIndex = min(startIndex + 2, uvData.count)
                let block = uvData[startIndex..<endIndex]
                return block.reduce(0, +) / block.count
            }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    HStack(spacing: 0) {
                        let twoHourItemsForIcons = hourlyItemsForSelectedDate
                            .enumerated()
                            .filter { index, _ in index % 2 == 0 }
                            .map { $0.element }
                        
                        if twoHourItemsForIcons.isEmpty {
                            Text("No hourly data available for this day.")
                                .font(.caption)
                                .foregroundColor(.gray)
                                .frame(maxWidth: .infinity, alignment: .center)
                                .padding(.vertical)
                        } else {
                            ForEach(twoHourAverages.indices, id: \.self) { index in
                                Text("\(twoHourAverages[index])")
                                    .font(.system(size: 12, weight: .bold))
                                    .frame(maxWidth: .infinity)
                            }
                        }
                    }
                    
                    // Ако избраният ден съвпада с днешния, поставяме затъмняващ слой и вертикална линия,
                    // които използват една и съща дробна стойност (fractionOfDay)
                    if Calendar.current.isDate(now, inSameDayAs: selectedDate) {
                        let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                        // Полупрозрачен правоъгълник, който покрива частта до текущото време
                        Rectangle()
                            .fill(Color.black.opacity(0.4))
                            .frame(width: overlayWidth)
                      
                    }
                }
            }
            .frame(height: 20)
            .padding(.horizontal, graphPadding)
            .offset(y: 35)

            // Графична част с Canvas – увеличена височина
            // Графична част с Canvas – увеличена височина
            Canvas { context, size in
                guard uvData.count > 1,
                      size.width > graphPadding,
                      size.height > graphPadding * 2 else { return }
                
                let effectiveWidth = size.width
                let effectiveHeight = size.height
                let origin = CGPoint(x: graphPadding, y: effectiveHeight - graphPadding)
                let graphContentWidth = effectiveWidth - graphPadding * 2
                let graphContentHeight = effectiveHeight - graphPadding * 2
                
                let yStep = graphContentHeight / CGFloat(yRange.max - yRange.min)
                func yPosition(for uv: Double) -> CGFloat {
                    return origin.y - CGFloat(uv - yRange.min) * yStep
                }
                let specialMarkers: [Int: String] = [
                    1: "Low",
                    3: "Moderate",
                    6: "High",
                    8: "Very High",
                    11: "Extreme"
                ]
                let gridMarkers: [Double] = Array(stride(from: 0, through: 12, by: 1))
                for marker in gridMarkers {
                    let yPos = yPosition(for: marker)
                    var hLine = Path()
                    hLine.move(to: CGPoint(x: origin.x, y: yPos))
                    hLine.addLine(to: CGPoint(x: origin.x + graphContentWidth, y: yPos))
                    context.stroke(hLine,
                                   with: .color(.gray.opacity(0.3)),
                                   style: StrokeStyle(lineWidth: 0.5))
                    
                    // Надпис вдясно (числовия маркер)
                    let rightLabelPoint = CGPoint(x: origin.x + graphContentWidth + 15, y: yPos)
                    context.draw(
                        Text("\(Int(marker))")
                            .font(.system(size: 10))
                            .foregroundColor(.gray),
                        at: rightLabelPoint,
                        anchor: .center
                    )
                    
                    // Проверка дали текущият маркер се съдържа в речника за специални маркери
                    if let specialText = specialMarkers[Int(marker)] {
                        let leftLabelPoint = CGPoint(x: origin.x + 5, y: yPos + 5)
                        context.draw(
                            Text(specialText)
                                .font(.system(size: 10))
                                .foregroundColor(.gray),
                            at: leftLabelPoint,
                            anchor: .init(x: 0, y: 0.5) // x=0 -> ляво, y=0.5 -> центриране по вертикалата
                        )
                    }

                }
                
                // Рисуване на вертикални линии за часовите маркери
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (graphContentWidth / 24.0))
                    var vLine = Path()
                    vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                    vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                    context.stroke(vLine,
                                   with: .color(.gray.opacity(0.3)),
                                   style: StrokeStyle(lineWidth: 0.5))
                }
                
                // Построяване на пътя за линията и запълването под нея
                var linePath = Path()
                var fillPath = Path()
                var points: [CGPoint] = []
                let xStep = graphContentWidth / CGFloat(max(1, uvData.count - 1))
                for (index, uv) in uvData.enumerated() {
                    let xPos = origin.x + CGFloat(index) * xStep
                    let yPos = yPosition(for: Double(uv))
                    let pt = CGPoint(x: xPos, y: yPos)
                    points.append(pt)
                    if index == 0 {
                        linePath.move(to: pt)
                        fillPath.move(to: CGPoint(x: xPos, y: origin.y))
                        fillPath.addLine(to: pt)
                    } else {
                        linePath.addLine(to: pt)
                        fillPath.addLine(to: pt)
                    }
                }
                if let lastPt = points.last {
                    fillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                    fillPath.closeSubpath()
                }
                
                // Градиент за UV – от зелен към жълт, оранжев, червен и лилав
                let uvGradient = Gradient(stops: [
                    .init(color: .green,   location: 0.0),
                    .init(color: .yellow,  location: 0.3),
                    .init(color: .orange,  location: 0.58),
                    .init(color: .red,     location: 0.75),
                    .init(color: .purple,  location: 1.0)
                ])
                
                // Запълване под линията с градиент
                context.drawLayer { layerContext in
                    layerContext.fill(
                        fillPath,
                        with: .linearGradient(
                            uvGradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint: CGPoint(x: 0, y: 0)
                        )
                    )
                }
                
                // Рисуване на линията с градиент чрез клипване и запълване
                context.drawLayer { layerContext in
                    let lineWidth: CGFloat = 2.5
                    let stroked = linePath.strokedPath(.init(lineWidth: lineWidth, lineCap: .round, lineJoin: .round))
                    layerContext.clip(to: stroked)
                    layerContext.fill(
                        Path(CGRect(origin: .zero, size: size)),
                        with: .linearGradient(
                            uvGradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint: CGPoint(x: 0, y: 0)
                        )
                    )
                }
                
                // Рисуване на маркера за максималната стойност
                if let maxUV = uvData.max(),
                   let maxIndex = uvData.firstIndex(of: maxUV),
                   points.indices.contains(maxIndex) {
                    let highPoint = points[maxIndex]
                    drawHLMarker(context: context, label: "Max", at: highPoint)
                }
                
                // Затъмняване само на графичната област (fillPath) от началото до текущата точка и затъмняване на линията до текущия час
                if Calendar.current.isDate(Date(), inSameDayAs: selectedDate),
                   let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                       Calendar.current.isDate($0.date, equalTo: Date(), toGranularity: .hour)
                   }) {
                    // Изчисляване на X позицията за текущия час
                    let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep

                    // Начертаване на вертикална линия (можете да зададете Y офсета според нуждите; тук използваме graphPadding)
                    var verticalPath = Path()
                    verticalPath.move(to: CGPoint(x: currentXPos, y: graphPadding))
                    verticalPath.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                    
                    // Изчисляваме текущата UV стойност и нормализираме за извличане на цвят от градиента
                    let currentUV = uvData[currentHourIndex]
                    let normalized = (Double(currentUV) - yRange.min) / (yRange.max - yRange.min)
                    let currentColor: Color = colorFromGradient(gradient: uvGradient, location: normalized)
                    
                    // Начертаване на вертикалната линия с текущия цвят и дебелина 2
                    context.stroke(
                        verticalPath,
                        with: .color(currentColor),
                        style: StrokeStyle(lineWidth: 2)
                    )
                    
                    // Определяне на правоъгълник, който обхваща областта от началната X позиция до текущата,
                    // и запълване с полупрозрачен черен цвят за потъмняване
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


                // Часови надписи под графиката
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
                
                // Drag gesture интерполация – показване на стойност, взета от данните (като цяло число)
                if let dragPoint = dragLocationUV {
                    // Проверка дали координатата на драг попада в рамките на графиката (по X)
                    if dragPoint.x >= origin.x && dragPoint.x <= origin.x + graphContentWidth {
                        
                        // 1) fractionIndex – къде по X е плъзгачът спрямо началото на графиката
                        let fractionIndex = (dragPoint.x - origin.x) / xStep
                        
                        // 2) Индекси на съседните точки, между които плъзгаме
                        let lowerIndex = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                        let upperIndex = max(0, min(points.count - 1, lowerIndex + 1))
                        let t = (upperIndex == lowerIndex) ? 0 : (fractionIndex - CGFloat(lowerIndex))
                        
                        // 3) Интерполираме UV стойността
                        let lowerValue = Double(uvData[lowerIndex])
                        let upperValue = Double(uvData[upperIndex])
                        let interpolatedValueDouble = lowerValue + (upperValue - lowerValue) * Double(t)
                        let interpolatedUV = Int(round(interpolatedValueDouble))
                        
                        // 4) Интерполираме и координатата по Y
                        var interpolatedY = points[lowerIndex].y
                        if upperIndex != lowerIndex {
                            interpolatedY = points[lowerIndex].y + t * (points[upperIndex].y - points[lowerIndex].y)
                        }
                        let dotPoint = CGPoint(x: dragPoint.x, y: interpolatedY)
                        
                        // 5) Рисуваме вертикална линия по X
                        var verticalPath = Path()
                        verticalPath.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                        verticalPath.addLine(to: CGPoint(x: dotPoint.x, y: effectiveHeight - graphPadding))
                        context.stroke(verticalPath, with: .color(.white.opacity(0.5)), lineWidth: 1)
                        
                        // 6) Малък кръг (dot) върху точката
                        let dotRect = CGRect(center: dotPoint, radius: 4)
                        let normalizedDragged = (Double(interpolatedUV) - yRange.min) / (yRange.max - yRange.min)
                        let dragColor: Color = colorFromGradient(gradient: uvGradient, location: normalizedDragged)
                        context.fill(Path(ellipseIn: dotRect), with: .color(dragColor))
                        
                        // 7) **Интерполираме времето** (ЧАС:МИНУТИ), а не просто долния индекс
                        let timeLabelString: String
                        if lowerIndex < hourlyItemsForSelectedDate.count, upperIndex < hourlyItemsForSelectedDate.count {
                            let lowerDate = hourlyItemsForSelectedDate[lowerIndex].date
                            let upperDate = hourlyItemsForSelectedDate[upperIndex].date
                            
                            // Цялата разлика между двете дати
                            let totalInterval = upperDate.timeIntervalSince(lowerDate)
                            
                            // Новата, „междинна“ дата според t
                            let interpolatedDate = lowerDate.addingTimeInterval(totalInterval * Double(t))
                            
                            // Форматираме като HH:mm (например "14:07", "15:30", ...)
                            let dateFormatter = DateFormatter()
                            dateFormatter.dateFormat = "HH:mm"
                            timeLabelString = dateFormatter.string(from: interpolatedDate)
                        } else {
                            // fallback, ако сме извън обхват
                            timeLabelString = "--:--"
                        }
                        
                        // 8) Създаваме двуредов етикет (час + UV)
                        let combinedLabel = Text("\(timeLabelString)\n\(interpolatedUV)")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                        
                        // 9) Позиционираме етикета малко вдясно и нагоре, за да не застъпва точката
                        let labelOffset: CGFloat = 8
                        let textPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 20)
                        
                        // .bottomLeading => долният ред на текста (UV) да съвпада с точката
                        context.draw(combinedLabel, at: textPoint, anchor: .bottomLeading)
                    }
                }

            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in dragLocationUV = value.location }
                    .onEnded { _ in dragLocationUV = nil }
            )
            .frame(height: (graphHeight + 20) * 1.5)

            .frame(height: (graphHeight + 20) * 1.5)
            
            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2)
                .padding(.top, 2)
        }
        
        
        VStack(alignment: .leading, spacing: 4) {
            Text("Now, \(currentTimeString)")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Text(generateUVAdvice(uvData: uvData, startOfSelectedDay: startOfSelectedDay))
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.top, 5)
    }

    func generateUVAdvice(uvData: [Int], startOfSelectedDay: Date) -> String {
        // 1) Филтрираме UV стойностите, които са поне 3 (Moderate или по-висок)
        let moderateOrHigher = uvData.enumerated().filter { $0.element >= 1 } // [(index, uv)]
        
        // 2) Ако няма нито една стойност ≥ 3, връщаме съответно съобщение
        if moderateOrHigher.isEmpty {
            return "No moderate or higher UV levels are expected for this day."
        } else {
            // earliest и latest – първият и последният час в деня, където UV ≥ 3
            let earliestHourIndex = moderateOrHigher.first!.offset
            let latestHourIndex   = moderateOrHigher.last!.offset
            
            // minUV и maxUV – най-ниската и най-високата UV стойност в този диапазон
            let minUV = moderateOrHigher.map { $0.element }.min() ?? 1
            let maxUV = moderateOrHigher.map { $0.element }.max() ?? 1
            
            // Преобразуваме index (час) в реални Date обекти
            let calendar = Calendar.current
            let earliestDate = calendar.date(byAdding: .hour, value: earliestHourIndex, to: startOfSelectedDay)!
            let latestDate   = calendar.date(byAdding: .hour, value: latestHourIndex,  to: startOfSelectedDay)!
            
            // Форматираме ги като час:минути (HH:mm) или друго, което предпочитате
            let formatter = DateFormatter()
            formatter.dateFormat = "HH:mm"
            let earliestStr = formatter.string(from: earliestDate) // "10:00"
            let latestStr   = formatter.string(from: latestDate)   // "15:00"
            
            // Определяме категориите за minUV и maxUV (пр. Moderate, High и т.н.)
            let minCategory = uvCategory(for: minUV)
            let maxCategory = uvCategory(for: maxUV)
            
            // Накрая сглобяваме динамичен текст
            let uvAdviceText = """
            Sun protection recommended. UV levels range from \(minCategory) to \(maxCategory), \
            reached between \(earliestStr) and \(latestStr).
            """
            
            return uvAdviceText
        }
    }

    private var currentTimeString: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: Date())
    }
    private func hourOfDay(from date: Date) -> Int {
        return Calendar.current.component(.hour, from: date)
    }

    private func colorFromGradient(gradient: Gradient, location: Double) -> Color {
        let stops = gradient.stops.sorted(by: { $0.location < $1.location })
        guard let first = stops.first, let last = stops.last else {
            return .white
        }
        if location <= first.location { return first.color }
        if location >= last.location { return last.color }
        for i in 0..<stops.count - 1 {
            let lower = stops[i]
            let upper = stops[i+1]
            if location >= lower.location && location <= upper.location {
                let ratio = (location - lower.location) / (upper.location - lower.location)
                return ratio < 0.5 ? lower.color : upper.color
            }
        }
        return .white
    }

    // MARK: - Helper for “Min” / “Max” markers
    private func drawHLMarker(
        context: GraphicsContext,
        label: String,
        at point: CGPoint
    ) {
        context.drawLayer { layerContext in
            let outerRadius: CGFloat = 6
            let innerRadius: CGFloat = 3
            let outerRect = CGRect(center: point, radius: outerRadius)
            let innerRect = CGRect(center: point, radius: innerRadius)
            
            layerContext.fill(Path(ellipseIn: outerRect), with: .color(.black))
            layerContext.fill(Path(ellipseIn: innerRect), with: .color(.white))
            
            let labelPoint = CGPoint(x: point.x, y: point.y - outerRadius - 4)
            layerContext.draw(
                Text(label)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.gray),
                at: labelPoint,
                anchor: .center
            )
        }
    }


    
    private func precipitationTotalsSection(for day: DayForecastItem) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Precipitation Totals")
                .font(.system(size: 16, weight: .semibold))
            
            // LAST 24 HOURS секция
            VStack(alignment: .leading, spacing: 5) {
                Text("LAST 24 HOURS")
                    .font(.caption.weight(.medium))
                    .foregroundColor(.secondary)
                
                // Извличаме стойностите (ако са nil, ги третираме като 0)
                let rainLast = day.rainLast24h
                let snowLast = day.snowLast24h
                
                if rainLast == 0 && snowLast == 0 {
                    // Ако няма отделни данни за дъжд и сняг – показваме само общ валеж
                    HStack {
                        Label("Total", systemImage: "drop.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text("Precipitation")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(Int(day.precipLast24h)) mm")
                            .font(.system(size: 14))
                    }
                } else if snowLast == 0 {
                    // Ако няма информация за сняг – показваме само за дъжд
                    HStack {
                        Label("Rain", systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text("Rain")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(Int(rainLast)) mm")
                            .font(.system(size: 14))
                            .foregroundColor(.blue)
                    }
                } else {
                    // В противен случай показваме отделно и за сняг и за дъжд
                    HStack {
                        Label("Snow", systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.white)
                        Text("Snow")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(String(format: "%.1f", snowLast)) cm")
                            .font(.system(size: 14))
                    }
                    HStack {
                        Label("Rain", systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text("Rain")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(Int(rainLast)) mm")
                            .font(.system(size: 14))
                            .foregroundColor(.blue)
                    }
                }
            }
            .padding(.top, 5)
            
            // NEXT 24 HOURS секция
            VStack(alignment: .leading, spacing: 5) {
                Text("NEXT 24 HOURS")
                    .font(.caption.weight(.medium))
                    .foregroundColor(.secondary)
                
                let rainNext = day.rainNext24h
                let snowNext = day.snowNext24h
                
                if rainNext == 0 && snowNext == 0 {
                    // Ако няма отделни данни – показваме само общ валеж
                    HStack {
                        Label("Total", systemImage: "drop.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text("Precipitation")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(Int(day.precipNext24h)) mm")
                            .font(.system(size: 14))
                            .foregroundColor(.blue)
                    }
                } else if snowNext == 0 {
                    // Ако няма данни за сняг – показваме само ред за дъжд
                    HStack {
                        Label("Rain", systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text("Rain")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(Int(rainNext)) mm")
                            .font(.system(size: 14))
                            .foregroundColor(.blue)
                    }
                } else {
                    // Ако има данни и за сняг, и за дъжд – показваме двата реда
                    HStack {
                        Label("Snow", systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.white)
                        Text("Snow")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(String(format: "%.1f", snowNext)) cm")
                            .font(.system(size: 14))
                    }
                    HStack {
                        Label("Rain", systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text("Rain")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(Int(rainNext)) mm")
                            .font(.system(size: 14))
                            .foregroundColor(.blue)
                    }
                }
            }
            .padding(.top, 10)
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
