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
    @State private var dragLocationWind: CGPoint? = nil
    @State private var dragLocationHumidity: CGPoint? = nil
    @State private var dragLocationVisibility: CGPoint? = nil
    @State private var dragPressureVisibility: CGPoint? = nil
    @State private var dragPrecipAmauntVisibility: CGPoint? = nil

    
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
                    precipitationAmount: 0,
                    snowfallAmount: 0,
                    uvIndex: 0,
                    windSpeed: 0,
                    windGust: 0,
                    windDirection: 0,
                    humidity: 0,
                    visibility: 0,
                    pressure: 0,
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
                    
                         switch selectedOption {
                         case 0:
                             hourlyGraphSection()
                                 .padding(.horizontal)
                                 .padding(.bottom)
                             
                             chanceOfPrecipGraphSection()
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
                             
                         case 1:
                             UVGraphSection()
                                 .padding(.horizontal)
                                 .padding(.bottom)
                             
                         case 2:
                             windGraphSection()
                                 .padding(.horizontal)
                                 .padding(.bottom)
                             
                         case 3:
                             precipAmauntDiagranmSection()
                                 .padding(.horizontal)
                                 .padding(.bottom)
                             
                             chanceOfPrecipGraphSection()
                                 .padding(.horizontal)
                                 .padding(.bottom)
                             
                           
                         case 4:
                             humidityGraphSection()
                                 .padding(.horizontal)
                                 .padding(.bottom)
                             
                         case 5:
                             visibilityGraphSection()
                                 .padding(.horizontal)
                                 .padding(.bottom)
                             
                         case 6:
                             pressureGraphSection()
                                 .padding(.horizontal)
                                 .padding(.bottom)
                             
                         default:
                             EmptyView()
                         }
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

    /// Помощна функция, която изчислява долна и горна граница (suggestedMin / suggestedMax)
    /// за масива от налягания, като добавя буфер и гарантира минимален диапазон.
    private func calculatePressureRange(from values: [Double]) -> (Double, Double) {
        let minPressure = values.min() ?? 1000
        let maxPressure = values.max() ?? 1020
        
        let rangeBuffer: Double = 3
        let minRangeSpan: Double = 15

        var sMin = floor(minPressure / 5) * 5 - rangeBuffer
        var sMax = ceil(maxPressure / 5) * 5 + rangeBuffer

        if (sMax - sMin) < minRangeSpan {
            let midpoint = (sMax + sMin) / 2
            sMin = midpoint - (minRangeSpan / 2)
            sMax = midpoint + (minRangeSpan / 2)
            sMin = floor(sMin / 5) * 5
            sMax = ceil(sMax / 5) * 5
        }

        return (sMin, sMax)
    }

    private func precipAmauntDiagranmSection() -> some View {
        // 1) Подготвяме нужните данни за всеки час (RAIN + SNOW)
        let hourlyData = hourlyItemsForSelectedDate
        let maxRain = hourlyData.map { $0.precipitationAmount }.max() ?? 0
        let maxSnow = hourlyData.map { $0.snowfallAmount }.max() ?? 0
        let maxPrecip = max(maxRain, maxSnow)
        
        // 2) Задаваме горна граница (yRange.max) с буфер, гарантираме и минимален обхват
        let rangeBuffer: Double = 2
        let minRangeSpan: Double = 10
        
        var suggestedMax = ceil(maxPrecip / 1) * 1 + rangeBuffer
        if suggestedMax < minRangeSpan {
            suggestedMax = minRangeSpan
        }
        let yRange: (min: Double, max: Double) = (0, suggestedMax)
        
        // Примерни прагове за light / moderate / heavy (mm/h)
        let thresholds: [Double] = [1.0, 4.0, 10.0]
        
        // fractionOfDay – за shading при текущия ден
        let now = Date()
        let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
        let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)
        
        // 3) Връщаме изглед (View)
        return VStack(spacing: 0) {
            
            // Заглавие и кратък описателен текст
            VStack() {
                VStack(alignment: .leading, spacing: 5) {
                    Text("Precipitation Amount")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Hourly bars for rain & snow (mm/h).")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.8))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                .offset(x: -10)
                
                Spacer()
                UIWeatherMenuButtonRepresentable(
                    currentView: selectedOption,
                    onViewChange: { newTab in
                        selectedOption = newTab
                    }
                )
                .frame(width: 30, height: 30)
            }
           
            // (По желание) горен ред за средни стойности на всеки 2 часа, тук само празно:
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Color.clear
                    
                    // Ако е днешен ден, частично засенчваме изминалата част
                    if Calendar.current.isDate(now, inSameDayAs: selectedDate) {
                        let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                        Rectangle()
                            .fill(Color.black.opacity(0.4))
                            .frame(width: overlayWidth)
                    }
                }
            }
            .frame(height: 20)
            .padding(.horizontal, graphPadding)
            .offset(y: 20)
            
            
            // Основната графика (Canvas) – барове за Rain и Snow
            Canvas { context, size in
                guard hourlyData.count > 1,
                      size.width > graphPadding,
                      size.height > graphPadding * 2
                else { return }
                
                let w = size.width
                let h = size.height
                let origin = CGPoint(x: graphPadding, y: h - graphPadding)
                let contentWidth  = w - graphPadding * 2
                let contentHeight = h - graphPadding * 2
                
                func yPos(_ val: Double) -> CGFloat {
                    // По-голяма стойност -> по-нагоре
                    let ratio = val / (yRange.max - yRange.min)
                    return origin.y - CGFloat(ratio) * contentHeight
                }
                
                // (A) Рисуваме хоризонталните линии през 2 mm/h
                let step: Double = 2
                let regularMarkers = stride(from: 0.0, through: yRange.max, by: step)
                for marker in regularMarkers {
                    let lineY = yPos(marker)
                    var path = Path()
                    path.move(to: CGPoint(x: origin.x, y: lineY))
                    path.addLine(to: CGPoint(x: origin.x + contentWidth, y: lineY))
                    context.stroke(
                        path,
                        with: .color(.gray.opacity(0.3)),
                        style: StrokeStyle(lineWidth: 0.5)
                    )
                    
                    // Надпис вдясно
                    let labelPt = CGPoint(x: origin.x + contentWidth + 15, y: lineY)
                    context.draw(
                        Text("\(Int(marker))")
                            .font(.system(size: 10))
                            .foregroundColor(.gray),
                        at: labelPt,
                        anchor: .center
                    )
                }
                
                // (B) Специални threshold линии (Light/Moderate/Heavy)
                for threshold in thresholds {
                    guard threshold <= yRange.max else { continue }
                    let lineY = yPos(threshold)
                    var path = Path()
                    path.move(to: CGPoint(x: origin.x, y: lineY))
                    path.addLine(to: CGPoint(x: origin.x + contentWidth, y: lineY))
                    context.stroke(
                        path,
                        with: .color(.white.opacity(0.5)),
                        style: StrokeStyle(lineWidth: 1, dash: [4, 4])
                    )
                    
                    // Малък надпис
                    let label: String
                    switch threshold {
                    case 1.0:  label = "Light"
                    case 4.0:  label = "Moderate"
                    case 10.0: label = "Heavy"
                    default:   label = ""
                    }
                    let labelPt = CGPoint(x: origin.x , y: lineY)
                    context.draw(
                        Text(label)
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundColor(.white.opacity(0.7)),
                        at: labelPt,
                        anchor: .topLeading
                    )
                }
                
                // (C) Вертикални часови маркери (0,6,12,18,24)
                let hourMarkers = [0,6,12,18,24]
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                    var vLine = Path()
                    vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                    vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                    context.stroke(
                        vLine,
                        with: .color(.gray.opacity(0.3)),
                        style: StrokeStyle(lineWidth: 0.5)
                    )
                }
                
                // (D) Барове за всеки час (2 колони: Rain / Snow)
                let xStep = contentWidth / 24
                let barWidth = xStep / 2.5
                
                for (i, item) in hourlyData.enumerated() {
                    let groupXCenter = origin.x + xStep * (CGFloat(i) + 0.5)
                    
                    // Rain бар
                    let rainVal = item.precipitationAmount
                    if rainVal > 0 {
                        let barLeftX  = groupXCenter - barWidth * 1.05
                        let topY      = yPos(rainVal)
                        let barHeight = max(0, origin.y - topY)
                        let barRect   = CGRect(x: barLeftX, y: topY, width: barWidth, height: barHeight)
                        context.fill(Path(barRect), with: .color(.blue))
                    }
                    
                    // Snow бар
                    let snowVal = item.snowfallAmount
                    if snowVal > 0 {
                        let barRightX = groupXCenter + (barWidth * 0.05)
                        let topY      = yPos(snowVal)
                        let barHeight = max(0, origin.y - topY)
                        let barRect   = CGRect(x: barRightX, y: topY, width: barWidth, height: barHeight)
                        context.fill(Path(barRect), with: .color(.white))
                    }
                }
                
                // (E) Засенчване на изминали часове, ако е днес
                if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                   let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                       Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                   }) {
                    
                    let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
                    // Вертикална линия за "сега"
                    var nowLine = Path()
                    nowLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                    nowLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                    context.stroke(
                        nowLine,
                        with: .color(.white.opacity(0.8)),
                        style: StrokeStyle(lineWidth: 2)
                    )
                    
                    // Тъмно shading
                    let darkRect = CGRect(
                        x: origin.x,
                        y: graphPadding,
                        width: currentXPos - origin.x,
                        height: contentHeight
                    )
                    context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))
                }
                
                // (F) Часови надписи в долната част
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                    let textPoint = CGPoint(x: xPos, y: origin.y + 14)
                    context.draw(
                        Text(String(format: "%02d", hour))
                            .font(.system(size: 11))
                            .foregroundColor(.gray),
                        at: textPoint,
                        anchor: .center
                    )
                }
                
                // (G) Drag Gesture – показва Rain / Snow за съответния час
                if let dragPoint = dragPrecipAmauntVisibility {
                    let localX = dragPoint.x - origin.x
                    if localX >= 0, localX < contentWidth {
                        let hourIndex = Int(floor(localX / xStep))
                        if hourIndex >= 0, hourIndex < hourlyData.count {
                            let item = hourlyData[hourIndex]
                            
                            let highlightX = origin.x + (CGFloat(hourIndex) + 0.5) * xStep
                            // Вертикална подсказваща линия
                            var highlightLine = Path()
                            highlightLine.move(to: CGPoint(x: highlightX, y: graphPadding))
                            highlightLine.addLine(to: CGPoint(x: highlightX, y: origin.y))
                            context.stroke(highlightLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                            
                            // Tooltip
                            let df = DateFormatter()
                            df.dateFormat = "HH"
                            let hourStr = df.string(from: item.date)
                            let rVal = item.precipitationAmount
                            let sVal = item.snowfallAmount
                            let labelText = """
                                \(hourStr)h
                                Rain: \(String(format: "%.1f", rVal)) mm/h
                                Snow: \(String(format: "%.1f", sVal)) mm/h
                                """
                            let tooltipPt = CGPoint(x: highlightX + 6, y: graphPadding + 15)
                            
                            context.draw(
                                Text(labelText)
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(.white),
                                at: tooltipPt,
                                anchor: .topLeading
                            )
                        }
                    }
                }
            }
            .frame(height: 250)
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        dragPrecipAmauntVisibility = value.location
                    }
                    .onEnded { _ in
                        dragPrecipAmauntVisibility = nil
                    }
            )
            
            // Divider
            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2)
                .padding(.top, 2)
            
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Bars show hourly Rain (blue) and Snow (white).")
                Text("Light <1 mm/h, moderate up to ~4 mm/h, heavy above 10 mm/h.")
            }
            .font(.caption)
            .foregroundColor(.secondary)
            .offset(y: 20)
            
        }
        .padding(.bottom, 8)
        // (H) Някакъв финален описателен текст
       
    }


    
    @ViewBuilder
    private func pressureGraphSection() -> some View {
        // 1) Извличаме почасовите стойности (hPa) за избрания ден
        let pressureValues = hourlyItemsForSelectedDate.map { $0.pressure }

        // 2) Ако няма данни, показваме fallback
        if pressureValues.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("Pressure")
                    .font(.system(size: 16, weight: .semibold))
                Text("No pressure data available for this day.")
                    .font(.footnote)
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 8)

        } else {
            // 3) Изчисляваме препоръчителен мин/макс (с буфер)
            let (suggestedMin, suggestedMax) = calculatePressureRange(from: pressureValues)

            // Реален min/max (без буфер), ако искаме да ги показваме в текста
            let realMin = Int(round(pressureValues.min() ?? 1000))
            let realMax = Int(round(pressureValues.max() ?? 1020))

            // 4) fractionOfDay => колко част от деня е минала (за shading, ако е днес)
            let now = Date()
            let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
            let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)

            VStack(spacing: 0) {
                VStack() {
                    // MARK: Заглавна част
                    VStack(alignment: .leading, spacing: 5) {
                        Text("Pressure")
                            .font(.system(size: 16, weight: .semibold))
                        Text("Today's min \(realMin) hPa – max \(realMax) hPa")
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.8))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                    .offset(x: -10)
                Spacer()
                UIWeatherMenuButtonRepresentable(
                    currentView: selectedOption,
                    onViewChange: { newTab in
                        selectedOption = newTab
                    }
                )
                .frame(width: 30, height: 30)
            }
               
                
                // MARK: Ред с иконки (arrow.up / arrow.down / equal) – на всеки 2 часа
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        HStack(spacing: 0) {
                            // Взимаме всички почасови елементи, но само през 2 часа
                            let twoHourPressures = hourlyItemsForSelectedDate
                                .enumerated()
                                .filter { $0.offset % 2 == 0 } // взимаме на всеки 2 часа
                            
                            if twoHourPressures.isEmpty {
                                Text("No hourly data available for this day.")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .frame(maxWidth: .infinity, alignment: .center)
                                    .padding(.vertical)
                            } else {
                                ForEach(twoHourPressures, id: \.element.id) { (originalIndex, item) in

                                    // (A) Локален closure, който изчислява какво да бъде името на иконата.
                                    let iconName: String = {
                                        if originalIndex >= 2 {
                                            let prevItem = hourlyItemsForSelectedDate[originalIndex - 2]
                                            let diff = item.pressure - prevItem.pressure
                                            
                                            if diff > 0.2 {
                                                return "arrowshape.up.fill"
                                            } else if diff < -0.2 {
                                                return "arrowshape.down.fill"
                                            } else {
                                                return "equal"
                                            }
                                        } else {
                                            return "equal"
                                        }
                                    }()

                                    // (B) Вече чертаем Image
                                    Image(systemName: iconName)
                                        .font(.system(size: 13))
                                        .frame(maxWidth: .infinity)
                                }

                            }
                        }
                        
                        // Частично засенчваме миналите часове, ако избраният ден е "днес"
                        if Calendar.current.isDate(now, inSameDayAs: selectedDate) {
                            let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                            Rectangle()
                                .fill(Color.black.opacity(0.4))
                                .frame(width: overlayWidth)
                        }
                    }
                }
                .frame(height: 20)
                .padding(.horizontal, graphPadding)
                .offset(y: 5)  // може да коригирате offset според визията си
                
                
                // MARK: - Основна графика (Canvas)
                Canvas { context, size in
                    guard pressureValues.count > 1,
                          size.width > graphPadding,
                          size.height > graphPadding * 2
                    else { return }

                    let w = size.width
                    let h = size.height
                    let origin = CGPoint(x: graphPadding, y: h - graphPadding)
                    let contentWidth  = w - graphPadding * 2
                    let contentHeight = h - graphPadding * 2

                    func yPosition(_ val: Double) -> CGFloat {
                        let range = suggestedMax - suggestedMin
                        let ratio = (val - suggestedMin) / range
                        return origin.y - CGFloat(ratio) * contentHeight
                    }

                    // Хоризонтални линии (примерно през 5 hPa)
                    let step: Double = 5
                    let horizontalMarkers = stride(from: suggestedMin,
                                                   through: suggestedMax,
                                                   by: step)
                    for marker in horizontalMarkers {
                        let yPos = yPosition(marker)
                        var hLine = Path()
                        hLine.move(to: CGPoint(x: origin.x, y: yPos))
                        hLine.addLine(to: CGPoint(x: origin.x + contentWidth, y: yPos))
                        context.stroke(
                            hLine,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                        
                        // Надпис вдясно
                        let labelPt = CGPoint(x: origin.x + contentWidth + 15, y: yPos)
                        context.draw(
                            Text("\(Int(marker))")
                                .font(.system(size: 8)) // може да нагласите размера
                                .foregroundColor(.gray),
                            at: labelPt,
                            anchor: .center
                        )
                    }

                    // Вертикални линии за часовете (0, 6, 12, 18, 24)
                    let hourMarkers = [0, 6, 12, 18, 24]
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                        context.stroke(
                            vLine,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                    }

                    // Линия + fillPath
                    var linePath = Path()
                    var fillPath = Path()
                    var points: [CGPoint] = []

                    let xStep = contentWidth / CGFloat(max(1, pressureValues.count - 1))

                    for (i, val) in pressureValues.enumerated() {
                        let xPos = origin.x + CGFloat(i) * xStep
                        let yPos = yPosition(val)
                        let pt   = CGPoint(x: xPos, y: yPos)
                        points.append(pt)

                        if i == 0 {
                            linePath.move(to: pt)
                            fillPath.move(to: CGPoint(x: xPos, y: origin.y))
                            fillPath.addLine(to: pt)
                        } else {
                            linePath.addLine(to: pt)
                            fillPath.addLine(to: pt)
                        }
                    }
                    // Затваряме fillPath надолу
                    if let lastPt = points.last {
                        fillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                        fillPath.closeSubpath()
                    }

                    // Градиент (пример: синьо -> червено)
                    let pressureGradient = Gradient(stops: [
                        .init(color: .blue, location: 0),
                        .init(color: .red,  location: 1)
                    ])

                    // Запълване под линията
                    context.drawLayer { layerContext in
                        layerContext.fill(
                            fillPath,
                            with: .linearGradient(
                                pressureGradient,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint:   CGPoint(x: 0, y: 0)
                            )
                        )
                    }

                    // Линията (stroke) с градиент
                    context.drawLayer { layerContext in
                        let strokeStyle = StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round)
                        let stroked     = linePath.strokedPath(strokeStyle)
                        layerContext.clip(to: stroked)
                        
                        layerContext.fill(
                            Path(CGRect(origin: .zero, size: size)),
                            with: .linearGradient(
                                pressureGradient,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint:   CGPoint(x: 0, y: 0)
                            )
                        )
                    }

                    // Маркери Min / Max (по желание)
                    if let maxVal = pressureValues.max(),
                       let maxIndex = pressureValues.firstIndex(of: maxVal),
                       points.indices.contains(maxIndex) {
                        let highPoint = points[maxIndex]
                        drawHLMarker(context: context, label: "Max", at: highPoint)
                    }
                    if let minVal = pressureValues.min(),
                       let minIndex = pressureValues.firstIndex(of: minVal),
                       points.indices.contains(minIndex) {
                        let lowPoint = points[minIndex]
                        drawHLMarker(context: context, label: "Min", at: lowPoint)
                    }

                    // Затъмняваме “миналите” часове, ако денят е текущ
                    if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                       let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                           Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                       }) {
                        let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep

                        // Вертикална линия за текущия час
                        var verticalLine = Path()
                        verticalLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                        verticalLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                        context.stroke(
                            verticalLine,
                            with: .color(.white.opacity(0.8)),
                            style: StrokeStyle(lineWidth: 2)
                        )

                        // Правоъгълник за shading
                        let darkRect = CGRect(
                            x: origin.x,
                            y: graphPadding,
                            width: currentXPos - origin.x,
                            height: contentHeight
                        )
                        context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))
                    }

                    // Часови надписи долу
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                        let textPoint = CGPoint(x: xPos, y: origin.y + 14)
                        context.draw(
                            Text(String(format: "%02d", hour))
                                .font(.system(size: 11))
                                .foregroundColor(.gray),
                            at: textPoint,
                            anchor: .center
                        )
                    }

                    // MARK: - Drag интерполация (показва налягане + точен час)
                    if let dragPoint = dragPressureVisibility {
                        if dragPoint.x >= origin.x && dragPoint.x <= origin.x + contentWidth {
                            let fractionIndex = (dragPoint.x - origin.x) / xStep
                            let lowerIdx = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                            let upperIdx = max(0, min(points.count - 1, lowerIdx + 1))
                            let t = (upperIdx == lowerIdx) ? 0 : (fractionIndex - CGFloat(lowerIdx))

                            let pLower = pressureValues[lowerIdx]
                            let pUpper = pressureValues[upperIdx]
                            let pVal   = pLower + (pUpper - pLower) * Double(t)

                            var interpolatedY = points[lowerIdx].y
                            if upperIdx != lowerIdx {
                                interpolatedY += t * (points[upperIdx].y - points[lowerIdx].y)
                            }
                            let dotPoint = CGPoint(x: dragPoint.x, y: interpolatedY)

                            // Вертикална линия
                            var vLine = Path()
                            vLine.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                            vLine.addLine(to: CGPoint(x: dotPoint.x, y: origin.y))
                            context.stroke(vLine, with: .color(.white.opacity(0.5)), lineWidth: 1)

                            // Малка точка (dot)
                            let dotRect = CGRect(center: dotPoint, radius: 4)
                            context.fill(Path(ellipseIn: dotRect), with: .color(.white))

                            // Интерполация на време (часове:минути)
                            let timeString: String
                            if lowerIdx < hourlyItemsForSelectedDate.count,
                               upperIdx < hourlyItemsForSelectedDate.count {
                                let d1 = hourlyItemsForSelectedDate[lowerIdx].date
                                let d2 = hourlyItemsForSelectedDate[upperIdx].date
                                let totalInterval = d2.timeIntervalSince(d1)
                                let interpolatedDate = d1.addingTimeInterval(totalInterval * Double(t))

                                let df = DateFormatter()
                                df.dateFormat = "HH:mm"
                                timeString = df.string(from: interpolatedDate)
                            } else {
                                timeString = "--:--"
                            }

                            // Многострочен текст (час + hPa)
                            let labelText = "\(timeString)\n\(Int(round(pVal))) hPa"
                            let label = Text(labelText)
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)

                            let labelOffset: CGFloat = 8
                            let textPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 20)
                            context.draw(label, at: textPoint, anchor: .bottomLeading)
                        }
                    }
                }
                .frame(height: 240)
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            dragPressureVisibility = value.location
                        }
                        .onEnded { _ in
                            dragPressureVisibility = nil
                        }
                )

                // Divider
                Divider()
                    .background(Color.gray.opacity(0.4))
                    .padding(.horizontal, graphPadding / 2)
                    .padding(.top, 2)

                // MARK: - Примерен текст отдолу
                Text(
                    "Current pressure is around \(Int(round(vm.currentPressure ?? 1013))) hPa. " +
                    "Today’s range based on hourly data is about \(realMin)–\(realMax) hPa."
                )
                .font(.caption)
                .foregroundColor(.secondary)
                .padding(.top, 8)
            }
            .padding(.bottom, 8)
        }
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
            VStack() {
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
            Spacer()
            UIWeatherMenuButtonRepresentable(
                currentView: selectedOption,
                onViewChange: { newTab in
                    selectedOption = newTab
                }
            )
            .frame(width: 30, height: 30)
        }
           

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

    // HELPER: Convert wind direction degrees (0–360) to textual abbreviations (N, NNE, NE, etc.)
    // MARK: - Convert wind direction (degrees) to textual abbreviation (N, NE, etc.)
    private func directionAbbreviation(for degrees: Double) -> String {
        let d = degrees.truncatingRemainder(dividingBy: 360)
        let dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
                    "S","SSW","SW","WSW","W","WNW","NW","NNW"]
        let index = Int(((d + 11.25).truncatingRemainder(dividingBy: 360) / 22.5).rounded()) % 16
        return dirs[index]
    }

    // MARK: - Draw a min/max marker (circle + label)
    private func drawMarker(
        context: GraphicsContext,
        label: String,
        at point: CGPoint,
        color: Color
    ) {
        context.drawLayer { layerContext in
            let outerRect = CGRect(center: point, radius: 6)
            layerContext.fill(Path(ellipseIn: outerRect), with: .color(.black))
            
            let innerRect = CGRect(center: point, radius: 3)
            layerContext.fill(Path(ellipseIn: innerRect), with: .color(color))
            
            let textPoint = CGPoint(x: point.x, y: point.y - 10)
            layerContext.draw(
                Text(label)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.gray),
                at: textPoint,
                anchor: .center
            )
        }
    }
    
    
    @ViewBuilder
    private func visibilityGraphSection() -> some View {
        // 1) Extract hourly visibility data (in km) for the selected date
        let visData = hourlyItemsForSelectedDate.map { $0.visibility }
        
        // 2) Get the corresponding DayForecastItem to display daily min/max
        let dayItem = allDailyItems.first {
            Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
        }
        let dailyMinVis = dayItem?.visibilityMin ?? 0
        let dailyMaxVis = dayItem?.visibilityMax ?? 0
        
        // 3) Hardcode the y‑axis range from 0 to 50 (km)
        let yRange: (min: Double, max: Double) = (0.0, 50.0)
        
        // 4) If no data, show a fallback message
        if visData.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("Visibility")
                    .font(.system(size: 16, weight: .semibold))
                Text("No visibility data available for this day.")
                    .font(.footnote)
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 8)
        } else {
            // 5) Compute fraction of the day (for shading past hours if `selectedDate` is today)
            let now = Date()
            let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
            let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)
            
            VStack(spacing: 0) {
                VStack() {
                    // Заглавна част
                    VStack(alignment: .leading, spacing: 5) {
                        Text("Visibility")
                            .font(.system(size: 16, weight: .semibold))
                        
                        Text("Today's min \(String(format: "%.1f", dailyMinVis)) km – max \(String(format: "%.1f", dailyMaxVis)) km")
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.8))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)
                    .offset(x: -15)
                    .offset(y: 25)
                    Spacer()
                UIWeatherMenuButtonRepresentable(
                    currentView: selectedOption,
                    onViewChange: { newTab in
                        selectedOption = newTab
                    }
                )
                .frame(width: 30, height: 30)
            }
                // MARK: - Header with daily min–max
                VStack(alignment: .leading, spacing: 5) {
                    Text("Visibility")
                        .font(.system(size: 16, weight: .semibold))
                    
                    Text("Today's min \(String(format: "%.1f", dailyMinVis)) km – max \(String(format: "%.1f", dailyMaxVis)) km")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.8))
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                .offset(x: -15)
                .offset(y: 25)
                
                // MARK: - Optional two-hour average row at the top
                let twoHourAverages: [Int] = stride(from: 0, to: visData.count, by: 2).map { startIndex in
                    let endIndex = min(startIndex + 2, visData.count)
                    let block = visData[startIndex..<endIndex]
                    return Int(block.reduce(0, +) / Double(block.count))
                }
                
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        HStack(spacing: 0) {
                            if twoHourAverages.isEmpty {
                                Text("No hourly data available.")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .frame(maxWidth: .infinity, alignment: .center)
                                    .padding(.vertical)
                            } else {
                                ForEach(twoHourAverages.indices, id: \.self) { i in
                                    Text("\(twoHourAverages[i])")
                                        .font(.system(size: 12, weight: .bold))
                                        .frame(maxWidth: .infinity)
                                }
                            }
                        }
                        
                        // Shading for "past" portion if this is today's date
                        if Calendar.current.isDate(now, inSameDayAs: selectedDate) {
                            let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                            Rectangle()
                                .fill(Color.black.opacity(0.4))
                                .frame(width: overlayWidth)
                        }
                    }
                }
                .frame(height: 20)
                .padding(.horizontal, graphPadding)
                .offset(y: 30)
                
                // MARK: - Main line chart
                Canvas { context, size in
                    guard visData.count > 1,
                          size.width > graphPadding,
                          size.height > graphPadding * 2 else { return }
                    
                    let effectiveWidth  = size.width
                    let effectiveHeight = size.height
                    let origin = CGPoint(x: graphPadding, y: effectiveHeight - graphPadding)
                    let graphWidth  = effectiveWidth  - graphPadding * 2
                    let graphHeight = effectiveHeight - graphPadding * 2
                    
                    // We'll map 0..50 (yRange) into the chart height
                    let yStep = graphHeight / CGFloat(yRange.max - yRange.min)
                    
                    func yPosition(_ vis: Double) -> CGFloat {
                        // higher visibility => higher up on chart
                        return origin.y - CGFloat(vis - yRange.min) * yStep
                    }
                    
                    // Horizontal grid lines at e.g. 0, 10, 20, 30, 40, 50
                    let step = 5.0
                    let horizontalMarkers = stride(from: yRange.min,
                                                   through: yRange.max,
                                                   by: step).map { $0 }
                    for marker in horizontalMarkers {
                        let yPos = yPosition(marker)
                        var linePath = Path()
                        linePath.move(to: CGPoint(x: origin.x, y: yPos))
                        linePath.addLine(to: CGPoint(x: origin.x + graphWidth, y: yPos))
                        context.stroke(
                            linePath,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                        
                        // Label on the right (e.g. "10", "20", etc.)
                        let labelPoint = CGPoint(x: origin.x + graphWidth + 15, y: yPos)
                        context.draw(
                            Text("\(Int(marker))")
                                .font(.system(size: 10))
                                .foregroundColor(.gray),
                            at: labelPoint,
                            anchor: .center
                        )
                    }
                    
                    // Vertical hour markers for 0, 6, 12, 18, 24
                    let hourMarkers = [0, 6, 12, 18, 24]
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (graphWidth / 24.0))
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                        context.stroke(
                            vLine,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                    }
                    
                    // Build the path (line + fill) for visibility
                    var points: [CGPoint] = []
                    var linePath = Path()
                    var fillPath = Path()
                    
                    let xStep = graphWidth / CGFloat(max(1, visData.count - 1))
                    for (i, val) in visData.enumerated() {
                        let xPos = origin.x + CGFloat(i) * xStep
                        let yPos = yPosition(val)
                        let pt   = CGPoint(x: xPos, y: yPos)
                        points.append(pt)
                        
                        if i == 0 {
                            linePath.move(to: pt)
                            fillPath.move(to: CGPoint(x: xPos, y: origin.y))
                            fillPath.addLine(to: pt)
                        } else {
                            linePath.addLine(to: pt)
                            fillPath.addLine(to: pt)
                        }
                    }
                    
                    // Close the fill path
                    if let lastPt = points.last {
                        fillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                        fillPath.closeSubpath()
                    }
                    
                    // A gradient from red (bad/low) → green (good/high)
                    let visibilityGradient = Gradient(stops: [
                        .init(color: .red,   location: 0.00),
                        .init(color: .green, location: 1.00)
                    ])
                    
                    // Fill area
                    context.drawLayer { layerContext in
                        layerContext.fill(
                            fillPath,
                            with: .linearGradient(
                                visibilityGradient,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint:   CGPoint(x: 0, y: 0)
                            )
                        )
                    }
                    
                    // Stroke the line with the same gradient
                    context.drawLayer { layerContext in
                        let strokeStyle = StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round)
                        let stroked = linePath.strokedPath(strokeStyle)
                        layerContext.clip(to: stroked)
                        
                        layerContext.fill(
                            Path(CGRect(origin: .zero, size: size)),
                            with: .linearGradient(
                                visibilityGradient,
                                startPoint: CGPoint(x: 0, y: size.height),
                                endPoint:   CGPoint(x: 0, y: 0)
                            )
                        )
                    }
                    
                    // Markers for min / max
                    if let maxVal = visData.max(),
                       let maxIdx = visData.firstIndex(of: maxVal),
                       points.indices.contains(maxIdx) {
                        let maxPoint = points[maxIdx]
                        drawHLMarker(context: context, label: "Max", at: maxPoint)
                    }
                    if let minVal = visData.min(),
                       let minIdx = visData.firstIndex(of: minVal),
                       points.indices.contains(minIdx) {
                        let minPoint = points[minIdx]
                        drawHLMarker(context: context, label: "Min", at: minPoint)
                    }
                    
                    // Shade the “past” portion if it’s today
                    if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                       let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                           Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                       }) {
                        
                        let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
                        // Vertical line
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                        context.stroke(vLine, with: .color(.white.opacity(0.7)), style: StrokeStyle(lineWidth: 2))
                        
                        // Shading rectangle
                        let darkRect = CGRect(
                            x: origin.x,
                            y: graphPadding,
                            width: currentXPos - origin.x,
                            height: graphHeight
                        )
                        context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))
                    }
                    
                    // Hour labels at the bottom
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (graphWidth / 24.0))
                        let labelPoint = CGPoint(x: xPos, y: origin.y + 14)
                        context.draw(
                            Text(String(format: "%02d", hour))
                                .font(.system(size: 11))
                                .foregroundColor(.gray),
                            at: labelPoint,
                            anchor: .center
                        )
                    }
                    
                    // Drag interpolation
                    if let dragPt = dragLocationVisibility {
                        if dragPt.x >= origin.x && dragPt.x <= origin.x + graphWidth {
                            let fractionIndex = (dragPt.x - origin.x) / xStep
                            let lowerIdx = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                            let upperIdx = max(0, min(points.count - 1, lowerIdx + 1))
                            let t = (upperIdx == lowerIdx) ? 0 : (fractionIndex - CGFloat(lowerIdx))
                            
                            let lowerVal = visData[lowerIdx]
                            let upperVal = visData[upperIdx]
                            let interpolatedVis = lowerVal + (upperVal - lowerVal) * Double(t)
                            
                            var yVal = points[lowerIdx].y
                            if upperIdx != lowerIdx {
                                yVal += t * (points[upperIdx].y - points[lowerIdx].y)
                            }
                            let dotPoint = CGPoint(x: dragPt.x, y: yVal)
                            
                            // Vertical line
                            var verticalLine = Path()
                            verticalLine.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                            verticalLine.addLine(to: CGPoint(x: dotPoint.x, y: origin.y))
                            context.stroke(verticalLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                            
                            // Dot
                            let dotRect = CGRect(center: dotPoint, radius: 4)
                            context.fill(Path(ellipseIn: dotRect), with: .color(.white))
                            
                            // Time interpolation
                            let timeLabelString: String
                            if lowerIdx < hourlyItemsForSelectedDate.count,
                               upperIdx < hourlyItemsForSelectedDate.count {
                                let lowerDate = hourlyItemsForSelectedDate[lowerIdx].date
                                let upperDate = hourlyItemsForSelectedDate[upperIdx].date
                                let totalInterval = upperDate.timeIntervalSince(lowerDate)
                                let interpolatedDate = lowerDate.addingTimeInterval(totalInterval * Double(t))
                                
                                let df = DateFormatter()
                                df.dateFormat = "HH:mm"
                                timeLabelString = df.string(from: interpolatedDate)
                            } else {
                                timeLabelString = "--:--"
                            }
                            
                            let combinedLabel = Text("\(timeLabelString)\n\(String(format: "%.1f", interpolatedVis)) km")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                            
                            let labelOffset: CGFloat = 8
                            let textPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 20)
                            context.draw(combinedLabel, at: textPoint, anchor: .bottomLeading)
                        }
                    }
                }
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            dragLocationVisibility = value.location
                        }
                        .onEnded { _ in
                            dragLocationVisibility = nil
                        }
                )
                .frame(height: (graphHeight + 20) * 1.5)
                
                Divider()
                    .background(Color.gray.opacity(0.4))
                    .padding(.horizontal, graphPadding / 2)
                    .padding(.top, 2)
            }
            
            // Optional textual summary below the chart
            VStack(alignment: .leading, spacing: 4) {
                Text("Now, \(currentTimeString)")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(
                    "Visibility is currently around \(String(format: "%.1f", vm.currentVisibility ?? 0)) km. " +
                    "Lower values indicate fog or reduced visibility."
                )
                .font(.caption)
                .foregroundColor(.secondary)
            }
            .padding(.top, 5)
        }
    }


    @ViewBuilder
    private func humidityGraphSection() -> some View {
        // 1) Extract hourly humidity data (0.0–1.0) for the selected date
        let humidityData = hourlyItemsForSelectedDate.map { $0.humidity }

        // 2) Identify the corresponding DayForecastItem to get min/max daily humidity
        let dayItem = allDailyItems.first {
            Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
        }
        let dailyMinH = dayItem?.humidityMin ?? 0
        let dailyMaxH = dayItem?.humidityMax ?? 1

        // 3) We'll chunk the 24 hours (or however many hours you have) into 6-hour blocks
        let hoursCount = hourlyItemsForSelectedDate.count
        let chunkSize  = 6
        
        // Create an array of (startIndex, endIndex) pairs for each 6-hour chunk
        let chunkRanges: [(start: Int, end: Int)] = stride(from: 0, to: hoursCount, by: chunkSize)
            .map { startIndex in
                let endIndex = min(startIndex + chunkSize, hoursCount)
                return (start: startIndex, end: endIndex)
            }

        // 4) Fraction of day for shading the “past” portion if selectedDate is “today”
        let now = Date()
        let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
        let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)

        // 5) The overall vertical stack for our humidity section
        VStack(spacing: 8) {
            VStack() {
                // Заглавна част
                VStack(alignment: .leading, spacing: 5) {
                    Text("Humidity")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Today's min \(Int(dailyMinH * 100))% – max \(Int(dailyMaxH * 100))%")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.8))
                }
                // Optional formatting/layout offsets
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                .offset(x: -15)
                .offset(y: 30)
                Spacer()
            UIWeatherMenuButtonRepresentable(
                currentView: selectedOption,
                onViewChange: { newTab in
                    selectedOption = newTab
                }
            )
            .frame(width: 30, height: 30)
        }
            // MARK: - Header with daily min–max
          

            
            // MARK: - A row showing 6‑hour chunk averages
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    HStack(spacing: 0) {
                        // ForEach over our chunkRanges
                        ForEach(chunkRanges.indices, id: \.self) { i in
                            let (startIndex, endIndex) = chunkRanges[i]
                            let block   = hourlyItemsForSelectedDate[startIndex..<endIndex]
                            let avgHum  = block.map(\.humidity).reduce(0, +) / Double(block.count)
                            let avgPct  = Int(round(avgHum * 100))

                            Text("\(avgPct)%")
                                .font(.system(size: 12, weight: .bold))
                                .frame(maxWidth: .infinity)
                        }
                    }
                    
                    // If this is “today,” shade the fraction of the day that’s already passed
                    if Calendar.current.isDate(now, inSameDayAs: selectedDate) {
                        let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                        Rectangle()
                            .fill(Color.black.opacity(0.4))
                            .frame(width: overlayWidth)
                    }
                }
            }
            .frame(height: 20)
            .padding(.horizontal, graphPadding)
            .offset(y: 35)


            // MARK: - Canvas-based line chart
            Canvas { context, size in
                // 6) Bail out if we have no data or zero-size
                guard humidityData.count > 1,
                      size.width > graphPadding,
                      size.height > graphPadding * 2 else { return }

                let width  = size.width
                let height = size.height
                let origin = CGPoint(x: graphPadding, y: height - graphPadding)
                let chartWidth  = width  - graphPadding * 2
                let chartHeight = height - graphPadding * 2

                // Y function for 0...1 humidity → chart space
                func yPosition(_ h: Double) -> CGFloat {
                    let ratio = (h - 0.0) / (1.0 - 0.0)  // i.e. 0..1
                    return origin.y - CGFloat(ratio) * chartHeight
                }

                // Horizontal lines at 0%, 20%, 40%, 60%, 80%, 100%
                let humidityMarkers: [Double] = [0, 0.2, 0.4, 0.6, 0.8, 1.0]
                for marker in humidityMarkers {
                    let yPos = yPosition(marker)
                    var hLine = Path()
                    hLine.move(to: CGPoint(x: origin.x, y: yPos))
                    hLine.addLine(to: CGPoint(x: origin.x + chartWidth, y: yPos))
                    context.stroke(hLine,
                                   with: .color(.gray.opacity(0.3)),
                                   style: StrokeStyle(lineWidth: 0.5))
                    
                    let labelPt = CGPoint(x: origin.x + chartWidth + 15, y: yPos)
                    context.draw(
                        Text("\(Int(marker * 100))%")
                            .font(.system(size: 10))
                            .foregroundColor(.gray),
                        at: labelPt,
                        anchor: .center
                    )
                }

                // Vertical lines at hours 0, 6, 12, 18, 24
                let hourMarkers = [0, 6, 12, 18, 24]
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (chartWidth / 24.0))
                    var vLine = Path()
                    vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                    vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                    context.stroke(vLine, with: .color(.gray.opacity(0.3)), style: StrokeStyle(lineWidth: 0.5))
                }

                // Build the line path + fill path
                var linePath = Path()
                var fillPath = Path()
                var points: [CGPoint] = []

                let xStep = chartWidth / CGFloat(max(1, humidityData.count - 1))
                for (index, humVal) in humidityData.enumerated() {
                    let xPos = origin.x + CGFloat(index) * xStep
                    let yPos = yPosition(humVal)
                    let pt   = CGPoint(x: xPos, y: yPos)

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
                // Close fill path from last point down to baseline
                if let lastPt = points.last {
                    fillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                    fillPath.closeSubpath()
                }

                // Simple gradient from yellow (dry) to blue (wet)
                let humidityGradient = Gradient(stops: [
                    .init(color: .yellow, location: 0.0),
                    .init(color: .blue,   location: 1.0)
                ])

                // Fill under line
                context.drawLayer { layerContext in
                    layerContext.fill(
                        fillPath,
                        with: .linearGradient(
                            humidityGradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint:   CGPoint(x: 0, y: 0)
                        )
                    )
                }

                // Stroke the line with a gradient
                context.drawLayer { layerContext in
                    let strokeStyle = StrokeStyle(lineWidth: 2.5, lineCap: .round, lineJoin: .round)
                    let strokedPath = linePath.strokedPath(strokeStyle)
                    layerContext.clip(to: strokedPath)
                    layerContext.fill(
                        Path(CGRect(origin: .zero, size: size)),
                        with: .linearGradient(
                            humidityGradient,
                            startPoint: CGPoint(x: 0, y: size.height),
                            endPoint:   CGPoint(x: 0, y: 0)
                        )
                    )
                }

                // Min & Max markers
                if let maxHum = humidityData.max(),
                   let maxIndex = humidityData.firstIndex(of: maxHum),
                   points.indices.contains(maxIndex) {
                    let highPoint = points[maxIndex]
                    drawHLMarker(context: context, label: "Max", at: highPoint)
                }
                if let minHum = humidityData.min(),
                   let minIndex = humidityData.firstIndex(of: minHum),
                   points.indices.contains(minIndex) {
                    let lowPoint = points[minIndex]
                    drawHLMarker(context: context, label: "Min", at: lowPoint)
                }

                // Shade the “past” portion if selected date is today
                if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                   let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                       Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                   }) {
                    let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep

                    // Vertical line at current hour
                    var verticalLine = Path()
                    verticalLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                    verticalLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                    context.stroke(verticalLine, with: .color(.white.opacity(0.7)), style: StrokeStyle(lineWidth: 2))

                    // Dark rectangle for everything to the left
                    let darkRect = CGRect(
                        x: origin.x,
                        y: graphPadding,
                        width: currentXPos - origin.x,
                        height: chartHeight
                    )
                    context.fill(Path(darkRect), with: .color(.black.opacity(0.3)))
                }

                // Hour labels at bottom
                for hour in hourMarkers {
                    let xPos = origin.x + (CGFloat(hour) * (chartWidth / 24.0))
                    let labelPoint = CGPoint(x: xPos, y: origin.y + 14)
                    context.draw(
                        Text(String(format: "%02d", hour))
                            .font(.system(size: 11))
                            .foregroundColor(.gray),
                        at: labelPoint,
                        anchor: .center
                    )
                }

                // DRAG Gesture Interpolation – showing humidity % and time
                if let dragPoint = dragLocationHumidity {
                    if dragPoint.x >= origin.x && dragPoint.x <= origin.x + chartWidth {
                        let fractionIndex = (dragPoint.x - origin.x) / xStep
                        let lowerIndex = max(0, min(points.count - 1, Int(floor(fractionIndex))))
                        let upperIndex = max(0, min(points.count - 1, lowerIndex + 1))
                        let t = (upperIndex == lowerIndex) ? 0 : (fractionIndex - CGFloat(lowerIndex))

                        // Interpolate humidity
                        let lowerValue = humidityData[lowerIndex]
                        let upperValue = humidityData[upperIndex]
                        let hVal = lowerValue + (upperValue - lowerValue) * Double(t)

                        // Interpolate y
                        var hY = points[lowerIndex].y
                        if upperIndex != lowerIndex {
                            hY += t * (points[upperIndex].y - points[lowerIndex].y)
                        }
                        let dotPoint = CGPoint(x: dragPoint.x, y: hY)

                        // Vertical line
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: dotPoint.x, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: dotPoint.x, y: origin.y))
                        context.stroke(vLine, with: .color(.white.opacity(0.5)), lineWidth: 1)

                        // Dot
                        let dotRect = CGRect(center: dotPoint, radius: 4)
                        context.fill(Path(ellipseIn: dotRect), with: .color(.white))

                        // Time interpolation
                        let timeLabel: String
                        if lowerIndex < hourlyItemsForSelectedDate.count,
                           upperIndex < hourlyItemsForSelectedDate.count {
                            let d1 = hourlyItemsForSelectedDate[lowerIndex].date
                            let d2 = hourlyItemsForSelectedDate[upperIndex].date
                            let totalInterval = d2.timeIntervalSince(d1)
                            let interpolatedDate = d1.addingTimeInterval(totalInterval * Double(t))
                            let df = DateFormatter()
                            df.dateFormat = "HH:mm"
                            timeLabel = df.string(from: interpolatedDate)
                        } else {
                            timeLabel = "--:--"
                        }

                        let labelText = "\(timeLabel)\n\(Int(round(hVal * 100)))%"
                        let label = Text(labelText)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)

                        let labelOffset: CGFloat = 8
                        let textPoint = CGPoint(x: dotPoint.x + labelOffset, y: dotPoint.y - 20)
                        context.draw(label, at: textPoint, anchor: .bottomLeading)
                    }
                }
            }
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        // If you want a separate var for humidity drag location,
                        // create: @State private var dragLocationHumidity: CGPoint?
                        dragLocationHumidity = value.location
                    }
                    .onEnded { _ in
                        dragLocationHumidity = nil
                    }
            )
            // Increase the chart’s height for extra space
            .frame(height: (graphHeight + 20) * 1.5)

            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2)
                .padding(.top, 2)
        }

        // Optionally, show a small textual summary
        VStack(alignment: .leading, spacing: 4) {
            Text("Now, \(currentTimeString)")
                .font(.caption)
                .foregroundColor(.secondary)
            Text("Today's humidity ranges from \(Int(dailyMinH * 100))% to \(Int(dailyMaxH * 100))%. A comfortable indoor humidity is around 40–60%.")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.top, 5)
    }




    
    @ViewBuilder
    private func windGraphSection() -> some View {
        // 1) Извличаме масиви от почасовата прогноза
        let speeds: [Double] = hourlyItemsForSelectedDate.map { $0.windSpeed }
        let gusts:  [Double] = hourlyItemsForSelectedDate.map { $0.windGust }
        let directions = hourlyItemsForSelectedDate.map { $0.windDirection }
        
        // 2) Ако няма данни, показваме fallback изглед
        if speeds.isEmpty && gusts.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("Wind Speed & Gust")
                    .font(.system(size: 16, weight: .semibold))
                Text("No wind data available for this day.")
                    .font(.footnote)
                    .foregroundColor(.gray)
            }
            .padding(.bottom, 8)
        } else {
            // ----------- Подготвяме изчисленията извън @ViewBuilder блока -----------
            
            // 3) Определяме обхвата по Y (минимум и максимум)
            let maxSpeed = speeds.max() ?? 0
            let maxGust  = gusts.max()  ?? 0
            let overallMax = max(maxSpeed, maxGust)

            let rangeBuffer: Double = 3
            let minRangeSpan: Double = 10
            
            // Задаваме твърдо минималната стойност на 0
            let suggestedMin: Double = 0
            
            // Изчисляваме горната граница (suggestedMax)
            let suggestedMax: Double = {
                var tmp = ceil(overallMax / 5) * 5 + rangeBuffer
                if (tmp - suggestedMin) < minRangeSpan {
                    tmp = suggestedMin + minRangeSpan
                    tmp = ceil(tmp / 5) * 5
                }
                return tmp
            }()
            
            let yRange: (min: Double, max: Double) = (suggestedMin, suggestedMax)
            
            // 4) Четем дневната прогноза за показване на “Max Speed/Gust” в заглавието
            let dayItem = allDailyItems.first {
                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
            }
            let dailyMaxSpeed = dayItem?.maxWindSpeed ?? 0
            let dailyMaxGust  = dayItem?.maxWindGust  ?? 0
            
            // Ако има daily item, извличаме посоката
            let directionAbbrev: String = {
                  if let item = dayItem {
                      return directionAbbreviation(for: item.predominantWindDirection)
                  } else {
                      return "-"
                  }
              }()
            
            let dailyMaxLabel = "Max Speed: \(Int(dailyMaxSpeed)) – Gust: \(Int(dailyMaxGust)) – Dir: \(directionAbbrev)"
            
            // ----------- Вече изграждаме изгледите -----------
            
            VStack(spacing: 0) {
                    VStack() {
                        // Заглавна част
                        VStack(alignment: .leading, spacing: 5) {
                            Text("Wind & Gust")
                                .font(.system(size: 16, weight: .semibold))
                            Text(dailyMaxLabel)
                                .font(.system(size: 13))
                                .foregroundColor(.white.opacity(0.8))
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal)
                        .offset(x: -10)
                        Spacer()
                    UIWeatherMenuButtonRepresentable(
                        currentView: selectedOption,
                        onViewChange: { newTab in
                            selectedOption = newTab
                        }
                    )
                    .frame(width: 30, height: 30)
                }
                // Header (заглавие) за скоростта на вятъра
              
                
                // Ред с иконки, показващи посока на вятъра (на всеки 2 часа)
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        let now = Date()
                        let startOfSelectedDay = Calendar.current.startOfDay(for: selectedDate)
                        let fractionOfDay = now.timeIntervalSince(startOfSelectedDay) / (24 * 3600)

                        HStack(spacing: 0) {
                            let twoHourItems = Array(directions.enumerated())
                                .filter { $0.offset % 2 == 0 }  // 0,2,4,...
                            
                            if twoHourItems.isEmpty {
                                Text("No directions")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .frame(maxWidth: .infinity, alignment: .center)
                            } else {
                                ForEach(twoHourItems, id: \.offset) { (_, deg) in
                                    let rotation = deg - 90.0
                                    Image(systemName: "arrowshape.forward.fill")
                                        .font(.system(size: 12))
                                        .rotationEffect(.degrees(rotation))
                                        .frame(maxWidth: .infinity)
                                }
                            }
                        }
                        
                        // Частично засенчване (past shading), ако денят е днес
                        if Calendar.current.isDate(now, inSameDayAs: selectedDate) {
                            let overlayWidth = geo.size.width * CGFloat(fractionOfDay)
                            Rectangle()
                                .fill(Color.black.opacity(0.4))
                                .frame(width: overlayWidth)
                        }
                    }
                }
                .frame(height: 20)
                .padding(.horizontal, graphPadding)
                .offset(y: 25)
                
                // Canvas за рисуване на самата графика
                Canvas { context, size in
                    guard speeds.count > 1,
                          size.width > graphPadding,
                          size.height > graphPadding * 2
                    else { return }

                    let w = size.width
                    let h = size.height
                    let origin = CGPoint(x: graphPadding, y: h - graphPadding)
                    let contentWidth  = w - graphPadding * 2
                    let contentHeight = h - graphPadding * 2
                    let yStep = contentHeight / CGFloat(yRange.max - yRange.min)
                    
                    func yPosition(_ val: Double) -> CGFloat {
                        origin.y - CGFloat(val - yRange.min) * yStep
                    }
                    
                    // Хоризонтални линии (примерно на всеки 5 единици)
                    let step: Double = 5
                    let markers = stride(from: yRange.min, through: yRange.max, by: step).map { $0 }
                    for marker in markers {
                        let yPos = yPosition(marker)
                        var hLine = Path()
                        hLine.move(to: CGPoint(x: origin.x, y: yPos))
                        hLine.addLine(to: CGPoint(x: origin.x + contentWidth, y: yPos))
                        context.stroke(
                            hLine,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                        
                        // Етикети вдясно
                        let labelPt = CGPoint(x: origin.x + contentWidth + 15, y: yPos)
                        context.draw(
                            Text("\(Int(marker))")
                                .font(.system(size: 10))
                                .foregroundColor(.gray),
                            at: labelPt,
                            anchor: .center
                        )
                    }
                    
                    // Вертикални линии (часови маркери)
                    let hourMarkers = [0, 6, 12, 18, 24]
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                        var vLine = Path()
                        vLine.move(to: CGPoint(x: xPos, y: graphPadding))
                        vLine.addLine(to: CGPoint(x: xPos, y: origin.y))
                        context.stroke(
                            vLine,
                            with: .color(.gray.opacity(0.3)),
                            style: StrokeStyle(lineWidth: 0.5)
                        )
                    }
                    
                    // Построяваме path за wind SPEED
                    let xStep = contentWidth / CGFloat(max(1, speeds.count - 1))
                    
                    var speedPoints: [CGPoint] = []
                    var speedLinePath = Path()
                    
                    for (i, val) in speeds.enumerated() {
                        let xPos = origin.x + CGFloat(i) * xStep
                        let yPos = yPosition(val)
                        let pt = CGPoint(x: xPos, y: yPos)
                        speedPoints.append(pt)
                        
                        if i == 0 {
                            speedLinePath.move(to: pt)
                        } else {
                            speedLinePath.addLine(to: pt)
                        }
                    }
                    
                    // Path за запълването под speed линията (до baseline)
                    var speedFillPath = speedLinePath
                    if let firstPt = speedPoints.first,
                       let lastPt  = speedPoints.last {
                        speedFillPath.addLine(to: CGPoint(x: lastPt.x, y: origin.y))
                        speedFillPath.addLine(to: CGPoint(x: firstPt.x, y: origin.y))
                        speedFillPath.closeSubpath()
                    }
                    
                    // Path за wind GUST
                    var gustPoints: [CGPoint] = []
                    var gustLinePath = Path()
                    for (i, val) in gusts.enumerated() {
                        let xPos = origin.x + CGFloat(i) * xStep
                        let yPos = yPosition(val)
                        let pt = CGPoint(x: xPos, y: yPos)
                        gustPoints.append(pt)
                        
                        if i == 0 {
                            gustLinePath.move(to: pt)
                        } else {
                            gustLinePath.addLine(to: pt)
                        }
                    }
                    
                    // Запълване (fill) под SPEED линията
                    context.fill(
                        speedFillPath,
                        with: .color(.blue.opacity(0.25))
                    )
                    
                    // Stroke на SPEED линията (синьо)
                    context.stroke(
                        speedLinePath,
                        with: .color(.blue),
                        style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round)
                    )
                    
                    // Stroke на GUST линията (зелено)
                    context.stroke(
                        gustLinePath,
                        with: .color(.green),
                        style: StrokeStyle(lineWidth: 2, lineCap: .round, lineJoin: .round)
                    )
                    
                    // Маркери за Max S и Max G
                    if let maxS = speeds.max(),
                       let maxSIdx = speeds.firstIndex(of: maxS),
                       speedPoints.indices.contains(maxSIdx) {
                        let hp = speedPoints[maxSIdx]
                        drawMarker(context: context, label: "Max S", at: hp, color: .blue)
                    }
                    if let maxG = gusts.max(),
                       let maxGIdx = gusts.firstIndex(of: maxG),
                       gustPoints.indices.contains(maxGIdx) {
                        let hp = gustPoints[maxGIdx]
                        drawMarker(context: context, label: "Max G", at: hp, color: .green)
                    }
                    
                    // Частично засенчване (past shading), ако денят е днес
                    let now = Date()
                    if Calendar.current.isDate(now, inSameDayAs: selectedDate),
                       let currentHourIndex = hourlyItemsForSelectedDate.firstIndex(where: {
                           Calendar.current.isDate($0.date, equalTo: now, toGranularity: .hour)
                       }) {
                        let currentXPos = origin.x + CGFloat(currentHourIndex) * xStep
                        var verticalLine = Path()
                        verticalLine.move(to: CGPoint(x: currentXPos, y: graphPadding))
                        verticalLine.addLine(to: CGPoint(x: currentXPos, y: origin.y))
                        context.stroke(
                            verticalLine,
                            with: .color(.white.opacity(0.8)),
                            style: StrokeStyle(lineWidth: 1.5)
                        )
                        
                        let darkRect = CGRect(
                            x: origin.x,
                            y: graphPadding,
                            width: currentXPos - origin.x,
                            height: contentHeight
                        )
                        context.fill(Path(darkRect), with: .color(.black.opacity(0.2)))
                    }
                    
                    // Часови етикети отдолу
                    for hour in hourMarkers {
                        let xPos = origin.x + (CGFloat(hour) * (contentWidth / 24.0))
                        let textPoint = CGPoint(x: xPos, y: origin.y + 14)
                        context.draw(
                            Text(String(format: "%02d", hour))
                                .font(.system(size: 11))
                                .foregroundColor(.gray),
                            at: textPoint,
                            anchor: .center
                        )
                    }
                    
                    // DRAG интерполация за speed/gust
                    if let dragPoint = dragLocationWind {
                        if dragPoint.x >= origin.x && dragPoint.x <= origin.x + contentWidth {
                            let fractionIndex = (dragPoint.x - origin.x) / xStep
                            let lowerIdx = max(0, min(speedPoints.count - 1, Int(floor(fractionIndex))))
                            let upperIdx = max(0, min(speedPoints.count - 1, lowerIdx + 1))
                            let t = (upperIdx == lowerIdx) ? 0 : (fractionIndex - CGFloat(lowerIdx))
                            
                            // Интерполация на speed
                            let sLower = speeds[lowerIdx]
                            let sUpper = speeds[upperIdx]
                            let sVal   = sLower + (sUpper - sLower) * Double(t)
                            
                            // Интерполация на gust
                            let gLower = gusts[lowerIdx]
                            let gUpper = gusts[upperIdx]
                            let gVal   = gLower + (gUpper - gLower) * Double(t)
                            
                            // Интерполация по Y
                            var sY = speedPoints[lowerIdx].y
                            var gY = gustPoints[lowerIdx].y
                            if upperIdx != lowerIdx {
                                sY += t * (speedPoints[upperIdx].y - speedPoints[lowerIdx].y)
                                gY += t * (gustPoints[upperIdx].y - gustPoints[lowerIdx].y)
                            }
                            let spdPt = CGPoint(x: dragPoint.x, y: sY)
                            let gstPt = CGPoint(x: dragPoint.x, y: gY)
                            
                            // Вертикална линия на drag позицията
                            var vLine = Path()
                            vLine.move(to: CGPoint(x: dragPoint.x, y: graphPadding))
                            vLine.addLine(to: CGPoint(x: dragPoint.x, y: origin.y))
                            context.stroke(vLine, with: .color(.white.opacity(0.5)), lineWidth: 1)
                            
                            // Dot за скорост (синя точка)
                            let speedDot = CGRect(center: spdPt, radius: 3.5)
                            context.fill(Path(ellipseIn: speedDot), with: .color(.blue))
                            
                            // Dot за порив (зелена точка)
                            let gustDot = CGRect(center: gstPt, radius: 3.5)
                            context.fill(Path(ellipseIn: gustDot), with: .color(.green))
                            
                            // Интерполация на времето
                            var timeText = "--:--"
                            if lowerIdx < hourlyItemsForSelectedDate.count,
                               upperIdx < hourlyItemsForSelectedDate.count {
                                let d1 = hourlyItemsForSelectedDate[lowerIdx].date
                                let d2 = hourlyItemsForSelectedDate[upperIdx].date
                                let dt = d2.timeIntervalSince(d1) * Double(t)
                                let newDate = d1.addingTimeInterval(dt)
                                let df = DateFormatter()
                                df.dateFormat = "HH:mm"
                                timeText = df.string(from: newDate)
                            }
                            
                            let labelText = "\(timeText)\nSpeed: \(Int(round(sVal)))\nGust:  \(Int(round(gVal)))"
                            let label = Text(labelText)
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                            
                            let labelOffset: CGFloat = 8
                            let textPoint = CGPoint(x: spdPt.x + labelOffset, y: spdPt.y - 30)
                            context.draw(label, at: textPoint, anchor: .bottomLeading)
                        }
                    }
                } // край на Canvas
                .frame(height: 240)
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { value in
                            dragLocationWind = value.location
                        }
                        .onEnded { _ in
                            dragLocationWind = nil
                        }
                )
                
                Divider()
                    .background(Color.gray.opacity(0.4))
                    .padding(.horizontal, graphPadding / 2)
                    .padding(.top, 2)
                
                // Примерен текст отдолу
                Text("Wind is currently 15 km/h from the north-west. Today, wind speeds are 3 to 15 km/h, with gusts up to 36 km/h.")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.top, 35)
            }
            .padding(.bottom, 8)
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
