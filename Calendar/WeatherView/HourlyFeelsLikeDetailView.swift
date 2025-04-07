import SwiftUI
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - Dummy Structures (Placeholder)
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
    
    // 1) Пълен набор почасови данни (няколко дни)
    let allHourlyItems: [HourlyForecastItem]
    let allDailyItems: [DayForecastItem]
    // 2) Текущи темп.
    let currentActualTemp: Double?
    let currentFeelsLikeTemp: Double?
    
    // 3) Избрана начална дата, която става @State, за да се мени вътре
    @State private var selectedDate: Date
    
    // >>> НОВО: ще си пазим символа, получен от 10-дневната прогноза
    private let daySymbol: String
    
    // MARK: – Init
    init(
        allHourlyItems: [HourlyForecastItem],
        allDailyItems: [DayForecastItem],
        currentActualTemp: Double?,
        currentFeelsLikeTemp: Double?,
        initialDate: Date,
        daySymbol: String
    ) {
        self.allHourlyItems = allHourlyItems
        self.allDailyItems = allDailyItems    // <-- задължително!
        self.currentActualTemp = currentActualTemp
        self.currentFeelsLikeTemp = currentFeelsLikeTemp
        _selectedDate = State(initialValue: initialDate)
        self.daySymbol = daySymbol
    }

    
    // MARK: - Placeholder за "липсващи" данни
    let chanceOfPrecipitationToday: Int = 0
    let precipitationData = PrecipitationData()
    let comparisonData = DailyComparisonData()
    let forecastSummary: String = """
    0° now and mostly cloudy. Wind is making it feel colder, about -1°.
    Partly cloudy conditions expected around 18:00.
    This week's temperature range is from -2° to 4° and feels like -3° to 3°.
    """
    
    // Тогъл Actual / FeelsLike
    @State private var showingFeelsLike = false
    // dismiss environment
    @Environment(\.dismiss) var dismiss
    
    // Функция, която превръща "cloud.rain.fill" -> "Rain", "sun.max" -> "Sunny" и т.н.
    private func conditionFromSymbol(_ symbol: String) -> String {
        let lowercasedSymbol = symbol.lowercased()
        
        // Гръмотевици (cloud.bolt, cloud.bolt.rain, bolt.fill и т.н.)
        if lowercasedSymbol.contains("bolt") {
            return "Thunderstorm"
        }
        
        // Drizzle (ръмеж)
        if lowercasedSymbol.contains("drizzle") {
            return "Drizzle"
        }
        
        // Snow
        if lowercasedSymbol.contains("snow") {
            return "Snow"
        }
        
        // Rain
        if lowercasedSymbol.contains("rain") {
            return "Rain"
        }
        
        // Fog
        if lowercasedSymbol.contains("fog") {
            return "Fog"
        }
        
        // Partly Cloudy (ден)
        if lowercasedSymbol.contains("cloud.sun") {
            return "Partly Cloudy"
        }
        
        // Partly Cloudy (нощ)
        if lowercasedSymbol.contains("cloud.moon") {
            return "Partly Cloudy Night"
        }
        
        // Clear Night
        if lowercasedSymbol.contains("moon") || lowercasedSymbol.contains("stars") {
            return "Clear Night"
        }
        
        // Общо “Cloudy”
        if lowercasedSymbol.contains("cloud") {
            return "Cloudy"
        }
        
        // Общо “Sunny”
        if lowercasedSymbol.contains("sun") {
            return "Sunny"
        }
        
        // Ако не се е хванало нищо по-горе
        return "Conditions"
    }

    
    // MARK: - Почасовите данни, **филтрирани** за избрания ден
    private var hourlyItemsForSelectedDate: [HourlyForecastItem] {
        allHourlyItems.filter {
            Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
        }
    }
    
    // >>> ПРОМЕНЕНО: сега вече не взимаме символа от първия час,
    // а директно ползваме daySymbol, който си е денят от 10-дневната прогноза.
    private var displayedSymbol: String {
           if let dayItem = allDailyItems.first(where: {
               Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
           }) {
               return dayItem.symbol
           }
           // fallback:
           return "cloud"
       }
    
    private var displayedCondition: String {
          conditionFromSymbol(displayedSymbol)
      }
    
    // MARK: - Дата форматъри
    private var headerDateFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "EEEE, d MMMM yyyy" // Monday, 7 April 2025
        return f
    }
    private var dayInitialFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "E"
        return f
    }
    private var dayOfMonthFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "d"
        return f
    }
    
    // MARK: - Графика (за почасови данни)
    private let graphPadding: CGFloat = 15
    private let yAxisLabelWidth: CGFloat = 35
    private let graphHeight: CGFloat = 160
    
    private var temperatures: [Double] {
        hourlyItemsForSelectedDate.map { showingFeelsLike ? $0.feelsLikeTemp : $0.temp }
    }
    
    private var yAxisRange: (min: Double, max: Double) {
        let allTemps = hourlyItemsForSelectedDate.flatMap { [$0.temp, $0.feelsLikeTemp] }
        guard let dataMin = allTemps.min(), let dataMax = allTemps.max() else {
            return (-10, 30)
        }
        let rangeMin = floor(dataMin / 5.0) * 5.0 - 5.0
        let rangeMax = ceil(dataMax / 5.0) * 5.0 + 5.0
        let finalMin = min(rangeMin, rangeMax - 20)
        let finalMax = max(rangeMax, rangeMin + 20)
        if finalMin >= -10 && finalMax <= 30 {
            return (-10, 30)
        }
        return (finalMin, finalMax)
    }
    
    private var yAxisLabels: [Double] {
        stride(from: yAxisRange.max, through: yAxisRange.min, by: -5).map { $0 }
    }
    
    // MARK: BODY
    var body: some View {
        VStack(spacing: 0) {
            customNavBar
                .padding(.bottom, 5)
            
            ScrollView {
                VStack(alignment: .leading, spacing: 15) {
                    
                    dateCarousel
                    
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
    
    // Navbar
    private var customNavBar: some View {
        HStack {
            Spacer()
            
            // >>> Вече dynamic от `daySymbol`:
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
    
    // Карусел (TabView-страници) – 7 дни
    private var dateCarousel: some View {
        WeekCarouselView2(
            today: Date(),
            selectedDay: $selectedDate
        )
        .padding(.bottom, 10)
    }
    
    private var currentStatusHeader: some View {
        HStack(alignment: .firstTextBaseline) {
            VStack(alignment: .leading, spacing: 0) {
                Text("\(Int((showingFeelsLike ? currentFeelsLikeTemp : currentActualTemp) ?? 0))°")
                    .font(.system(size: 70, weight: .thin))
                
                Text(showingFeelsLike
                     ? "Actual: \(Int(currentActualTemp ?? 0))°"
                     : "Feels Like: \(Int(currentFeelsLikeTemp ?? 0))°"
                )
                .font(.system(size: 13))
                .foregroundColor(.gray)
                .padding(.leading, 4)
            }
            
            Spacer()
            
            Image(systemName: hourlyItemsForSelectedDate.first?.symbol ?? "cloud")
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
        }
    }
    
    // Можеш да го сложиш най-отгоре в HourlyFeelsLikeDetailView
    private func hourString(from date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "HH"  // Ще излиза "00", "02", "04"...
        return df.string(from: date)
    }

    @ViewBuilder
    private func hourlyGraphSection() -> some View {
        // 1) Филтриране на почасови данни през 2 часа
        let twoHourItems = hourlyItemsForSelectedDate
            .filter {
                let hour = Calendar.current.component(.hour, from: $0.date)
                return hour % 2 == 0
            }
            .sorted { $0.date < $1.date }
            .prefix(12) // ако искаш максимум 12 записа (00...22)
        
        // 2) Масив от температуру, който вече имаш в currentTemperatures
        let currentTemperatures = temperatures
        let yRange = yAxisRange
        
        VStack(spacing: 0) {
            
            // (A) Горен ред с иконки
            HStack(spacing: 0) {
                if twoHourItems.isEmpty {
                    Text("No data")
                        .frame(maxWidth: .infinity)
                } else {
                    ForEach(twoHourItems) { item in
                        Image(systemName: item.symbol)
                            .renderingMode(.original)
                            .font(.system(size: 13))
                            .frame(maxWidth: .infinity)
                            .opacity(item.date < Date() ? 0.5 : 1.0)
                    }
                }
            }
            .frame(height: 20)
            .padding(.horizontal, graphPadding / 2)
            .padding(.top, 4)
            
            // (B) Самата графика (Canvas + Y етикети)
            HStack(spacing: 2) {
                Canvas { context, size in
                    guard !currentTemperatures.isEmpty,
                          size.width > graphPadding + yAxisLabelWidth,
                          size.height > graphPadding * 2
                    else { return }
                    
                    let graphContentWidth  = size.width - graphPadding - yAxisLabelWidth
                    let graphContentHeight = size.height - graphPadding * 2
                    let origin = CGPoint(x: graphPadding, y: size.height - graphPadding)
                    
                    let yStep = (yRange.max > yRange.min)
                                ? graphContentHeight / CGFloat(yRange.max - yRange.min)
                                : 0
                    
                    // Dashed lines (през 5 градуса например)
                    for tempLabelValue in yAxisLabels
                    where tempLabelValue != yRange.min && tempLabelValue != yRange.max {
                        let yPos = origin.y - CGFloat(tempLabelValue - yRange.min) * yStep
                        var path = Path()
                        path.move(to: CGPoint(x: origin.x - 5, y: yPos))
                        path.addLine(to: CGPoint(x: origin.x + graphContentWidth + 5, y: yPos))
                        context.stroke(path, with: .color(.gray.opacity(0.3)),
                                       style: StrokeStyle(lineWidth: 0.5, dash: [2, 3]))
                    }
                    
                    // Линия за температурата
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
                            // Кръгче за първа точка
                            let circle = Path(ellipseIn: CGRect(
                                x: point.x - 3.5, y: point.y - 3.5, width: 7, height: 7
                            ))
                            context.fill(circle, with: .color(.white))
                        } else {
                            linePath.addLine(to: point)
                        }
                    }
                    context.stroke(linePath, with: .color(.cyan.opacity(0.9)), lineWidth: 2.5)
                    
                    // H/L
                    let validPoints = points.filter { !$0.x.isNaN && !$0.y.isNaN }
                    guard !validPoints.isEmpty else { return }
                    
                    if let maxTemp = currentTemperatures.max(),
                       let maxIndex = currentTemperatures.firstIndex(of: maxTemp),
                       validPoints.indices.contains(maxIndex) {
                        let highPoint = validPoints[maxIndex]
                        context.draw(
                            Text("H").font(.system(size: 10, weight: .bold)).foregroundColor(.white),
                            at: CGPoint(x: highPoint.x, y: highPoint.y - 10)
                        )
                    }
                    
                    if let minTemp = currentTemperatures.min(),
                       let minIndex = currentTemperatures.firstIndex(of: minTemp),
                       validPoints.indices.contains(minIndex) {
                        let lowPoint = validPoints[minIndex]
                        context.draw(
                            Text("L").font(.system(size: 10, weight: .bold)).foregroundColor(.white),
                            at: CGPoint(x: lowPoint.x, y: lowPoint.y + 12)
                        )
                    }
                }
                .frame(height: graphHeight)
                
                // Y етикетите (градуси)
                VStack(alignment: .trailing, spacing: 0) {
                    let gh = graphHeight - graphPadding * 2
                    let yStep = (yRange.max > yRange.min)
                                ? gh / CGFloat(yRange.max - yRange.min)
                                : 0
                    let labelH: CGFloat = 15
                    
                    ForEach(yAxisLabels, id: \.self) { tempLabelValue in
                        let yPos = graphPadding + CGFloat(yRange.max - tempLabelValue) * yStep
                        Text("\(Int(tempLabelValue))°")
                            .font(.system(size: 10))
                            .foregroundColor(.gray)
                            .frame(width: yAxisLabelWidth, height: labelH, alignment: .trailing)
                            .offset(y: yPos - (graphHeight / 2) - (labelH / 2) + 3)
                        Spacer(minLength: 0)
                    }
                }
                .frame(height: graphHeight, alignment: .top)
                .padding(.trailing, 5)
            }
            
            // Разделителна линия
            Divider()
                .background(Color.gray.opacity(0.4))
                .padding(.horizontal, graphPadding / 2)
                .padding(.top, 2)
            
            // (C) Долен ред със самите часове (00, 02, 04...)
            HStack(spacing: 0) {
                if twoHourItems.isEmpty {
                    Text("No data")
                        .frame(maxWidth: .infinity)
                } else {
                    ForEach(twoHourItems) { item in
                        Text(hourString(from: item.date))
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                            .frame(maxWidth: .infinity)
                    }
                }
            }
            .frame(height: 20)
            .padding(.horizontal, graphPadding / 2)
            .padding(.top, 4)
        }
    }

    
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
                    .foregroundColor(!showingFeelsLike ? .white : .gray)
                    .background(!showingFeelsLike ? Color.white.opacity(0.25) : Color.clear)
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
                    .foregroundColor(showingFeelsLike ? .white : .gray)
                    .background(showingFeelsLike ? Color.white.opacity(0.25) : Color.clear)
                    .cornerRadius(15)
            }
            .buttonStyle(.plain)
        }
        .padding(3)
        .background(Color.white.opacity(0.1))
        .clipShape(Capsule())
    }
    
    private var descriptionText: some View {
        Text("What the temperature feels like as a result of humidity, sunlight or wind.")
            .font(.caption)
            .foregroundColor(.secondary)
            .lineSpacing(3)
    }
    
    // MARK: - Допълнителни Placeholder секции
    private var chanceOfPrecipSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Chance of Precipitation")
                .font(.system(size: 16, weight: .semibold))
            Text("Today's chance: \(chanceOfPrecipitationToday)%")
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
    
    // Минимално вмъкваме тук PrecipitationChanceGraph (или може да е отделен файл)
    struct PrecipitationChanceGraph: View {
        let hourlyItems: [HourlyForecastItem]
        
        private let graphPadding: CGFloat = 5
        private let yAxisWidth: CGFloat = 30
        private let xAxisHeight: CGFloat = 15
        private let yAxisLabels: [Int] = [100, 80, 60, 40, 20, 0]
        
        private func getPrecipChance(for item: HourlyForecastItem) -> Double {
            let idx = hourlyItems.firstIndex(where: { $0.id == item.id }) ?? 0
            switch idx {
            case 5...9:
                return 0.15
            case 10...15:
                return 0.10
            case 16...24:
                return 0.05
            default:
                return 0.02
            }
        }
        
        var body: some View {
            VStack(spacing: 0) {
                GeometryReader { geo in
                    let w = geo.size.width
                    let h = geo.size.height
                    
                    let graphWidth = w - graphPadding * 2 - yAxisWidth
                    let graphHeight = h - graphPadding * 2 - xAxisHeight
                    let origin = CGPoint(x: graphPadding, y: h - graphPadding - xAxisHeight)
                    
                    let lowerYBound = graphPadding
                    let upperYBound = origin.y
                    
                    HStack(spacing: 2) {
                        Canvas { context, _ in
                            guard !hourlyItems.isEmpty, graphWidth>0, graphHeight>0 else { return }
                            
                            let yStep = graphHeight / 100.0
                            
                            for labelVal in yAxisLabels where labelVal != 0 && labelVal != 100 {
                                let yPos = origin.y - CGFloat(labelVal) * yStep
                                var path = Path()
                                path.move(to: CGPoint(x: origin.x, y: yPos))
                                path.addLine(to: CGPoint(x: origin.x+graphWidth, y: yPos))
                                context.stroke(
                                    path,
                                    with: .color(.gray.opacity(0.3)),
                                    style: StrokeStyle(lineWidth: 0.5, dash: [2,3])
                                )
                            }
                            
                            var linePath = Path()
                            let xStep = graphWidth / CGFloat(max(1, hourlyItems.count-1))
                            var points: [CGPoint] = []
                            
                            for (index, item) in hourlyItems.enumerated() {
                                let chance = getPrecipChance(for: item)
                                let xPos = origin.x + CGFloat(index)*xStep
                                let calcY = origin.y - CGFloat(chance*100)*yStep
                                let yPos = max(lowerYBound, min(calcY, upperYBound))
                                
                                let pt = CGPoint(x:xPos, y:yPos)
                                points.append(pt)
                                
                                if index==0 {
                                    linePath.move(to:pt)
                                    context.fill(Path(ellipseIn:CGRect(x:pt.x-2, y:pt.y-2, width:4,height:4)), with: .color(.white))
                                } else {
                                    linePath.addLine(to:pt)
                                }
                            }
                            if !points.isEmpty {
                                context.stroke(linePath, with: .color(.blue), lineWidth:1.5)
                            }
                        }
                        .overlay(alignment: .bottom) {
                            HStack {
                                Text("00").frame(maxWidth:.infinity)
                                Text("06").frame(maxWidth:.infinity)
                                Text("12").frame(maxWidth:.infinity)
                                Text("18").frame(maxWidth:.infinity)
                            }
                            .font(.system(size:9))
                            .foregroundColor(.gray)
                            .padding(.horizontal, graphPadding)
                            .frame(height:xAxisHeight)
                        }
                        
                        // Y axis
                        VStack(alignment:.trailing) {
                            if graphHeight>0 {
                                let yStep = graphHeight / 100.0
                                let labelHeight:CGFloat = 12
                                ForEach(yAxisLabels, id:\.self) { val in
                                    let yCenter = origin.y - CGFloat(val)*yStep
                                    Text("\(val)%")
                                        .font(.system(size:9))
                                        .foregroundColor(.gray)
                                        .frame(height:labelHeight)
                                        .position(x:yAxisWidth/2,y:yCenter)
                                    Spacer(minLength:0)
                                }
                            }
                        }
                        .frame(width:yAxisWidth)
                    }
                }
                .frame(height:80)
                
                Divider()
                    .background(Color.gray.opacity(0.4))
                    .padding(.horizontal,5)
                    .padding(.top,5)
            }
            .frame(height:95)
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
                Text("\(Int(minTemp))°")
                    .font(.system(size:14))
                    .foregroundColor(.secondary)
                    .frame(width:30,alignment:.trailing)
                
                GeometryReader { geo in
                    ZStack(alignment:.leading) {
                        Capsule().fill(Color.gray.opacity(0.3)).frame(height:4)
                        Capsule()
                            .fill(LinearGradient(colors:[.blue,.yellow], startPoint:.leading, endPoint:.trailing))
                            .frame(width:geo.size.width*widthPercentage, height:4)
                            .offset(x:geo.size.width*startOffsetPercentage)
                    }
                    .frame(height:4)
                    .position(x:geo.size.width/2,y:geo.size.height/2)
                }
                .frame(height:20)
                
                Text("\(Int(maxTemp))°").font(.system(size:14))
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
    
    struct OptionRow:View {
        let label:String
        let value:String
        var body: some View {
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

// MARK: - RECT EXTENSION
extension CGRect {
    init(center:CGPoint, radius:CGFloat) {
        self.init(x:center.x-radius, y:center.y-radius, width:radius*2, height:radius*2)
    }
}
