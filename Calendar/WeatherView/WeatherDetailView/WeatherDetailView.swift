import SwiftUI
import CoreLocation
import MapKit
@preconcurrency import WeatherKit

// MARK: - Главният изглед
struct WeatherDetailView: View {
    @StateObject var vm = WeatherKitViewModel.shared
    // 1) Data Sources - Keep as is
    let allHourlyItems: [HourlyForecastItem]
    let allDailyItems: [DayForecastItem]
    @State private var selectedOption: Int
    @State var selectedDate: Date
    @State var showingFeelsLike = false
    @State var dragLocationTEMP: CGPoint? = nil
    @State var dragLocationPreci: CGPoint? = nil
    @State var dragLocationUV: CGPoint? = nil
    @State var dragLocationWind: CGPoint? = nil
    @State var dragLocationHumidity: CGPoint? = nil
    @State var dragLocationVisibility: CGPoint? = nil
    @State var dragPressureVisibility: CGPoint? = nil
    @State var dragPrecipAmauntVisibility: CGPoint? = nil

    
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
        daySymbol: String,
        selectedOption: Int
    ) {
        self.selectedOption = selectedOption
        self.allHourlyItems = allHourlyItems
        self.allDailyItems = allDailyItems
        _selectedDate = State(initialValue: initialDate)
        self.daySymbol = daySymbol
    }
    
    private func hourString(from date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "HH"
        return df.string(from: date)
    }
    
    // MARK: - Computed Properties (Filtered Data, Display Info) - Keep as is
    var hourlyItemsForSelectedDate: [HourlyForecastItem] {
        let startOfDay = Calendar.current.startOfDay(for: selectedDate)
        var fullDayItems: [HourlyForecastItem] = []
        
        for hourOffset in 0...24 {
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
    
    // MARK: - Date Formatters - Keep as is
    private var headerDateFormatter: DateFormatter {
        let f = DateFormatter()
        f.dateFormat = "EEEE, d MMMM yyyy"
        return f
    }
    
    // MARK: - Graph Configuration - Keep as is
     let graphPadding: CGFloat = 25
     let yAxisLabelWidth: CGFloat = 35
     let graphHeight: CGFloat = 160
    
    var temperatures: [Double] {
        hourlyItemsForSelectedDate.map { showingFeelsLike ? $0.feelsLikeTemp : $0.temp }
    }
    
    var yAxisRange: (min: Double, max: Double) {
        let allTemps = hourlyItemsForSelectedDate.flatMap { [$0.temp, $0.feelsLikeTemp] }
        guard let dataMin = allTemps.min(), let dataMax = allTemps.max(), !allTemps.isEmpty else {
            return (-10, 40)  // например някакъв fallback
        }
        // Увеличаваме rangeBuffer, ако искаш по-голямо “въздух” отгоре/отдолу
        let rangeBuffer: Double = 10.0
        let minRangeSpan: Double = 20
        
        // Заместваме 5.0 с 10.0
        var suggestedMin = floor(dataMin / 10.0) * 10.0 - rangeBuffer
        var suggestedMax = ceil(dataMax / 10.0) * 10.0 + rangeBuffer
        
        // Проверка за минимален диапазон
        if (suggestedMax - suggestedMin) < minRangeSpan {
            let center = (suggestedMax + suggestedMin) / 2.0
            let half = minRangeSpan / 2.0
            suggestedMin = floor((center - half) / 10.0) * 10.0
            suggestedMax = ceil((center + half) / 10.0) * 10.0
        }
        return (suggestedMin, suggestedMax)
    }

    var yAxisLabels: [Double] {
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
                    
                    ZStack{
                        HStack {
                            Spacer()
                            UIWeatherMenuButtonRepresentable(
                                currentView: selectedOption,
                                onViewChange: { newTab in
                                    selectedOption = newTab
                                }
                            )
                            .frame(width: 30, height: 30)
                            .offset(x: -40)
                        }
                    }
                
                    VStack{
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
                            
                            if let selectedDayForecast = allDailyItems.first(where: {
                                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
                            }) {
                                forecastTempSection(for: selectedDayForecast)
                                    .padding(.horizontal)
                                    .padding(.bottom)
                            }
                            
                            aboutFeelsLikeSection
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                            Spacer()
                            
                        case 1:
                            uVGraphSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                        case 2:
                            windGraphSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                            if let selectedDayForecast = allDailyItems.first(where: {
                                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
                            }) {
                                forecastWindSection(for: selectedDayForecast)
                                    .padding(.horizontal)
                                    .padding(.bottom)
                            }
                            
                            windTableSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                            aboutWindSpeedAndGustsSection
                                .padding(.horizontal)
                                .padding(.bottom)
                           
                            aboutBeaufortScaleSection
                                .padding(.horizontal)
                                .padding(.bottom)
                        case 3:
                            precipAmauntDiagranmSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                            chanceOfPrecipGraphSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                                .offset(x: 5, y: -45)
                            
                            if let todayForecast = allDailyItems.first(where: {
                                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
                            }) {
                                precipitationTotalsSection(for: todayForecast)
                                    .padding(.horizontal)
                                    .padding(.bottom)
                                    .offset(x: 5, y: -45)
                            }
                            
                            if let selectedDayForecast = allDailyItems.first(where: {
                                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
                            }) {
                                forecastPrecipitationSection(for: selectedDayForecast)
                                    .padding(.horizontal)
                                    .padding(.bottom)
                            }
                            
                            aboutPrecipitationSection()
                                .padding(.horizontal)
                                .padding(.bottom)

                            
                        case 4:
                            humidityGraphSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                            if let selectedDayForecast = allDailyItems.first(where: {
                                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
                            }) {
                                forecastHumiditySection(for: selectedDayForecast)
                                    .padding(.horizontal)
                                    .padding(.bottom)
                            }
                          
                            aboutHumiditySection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                            aboutDewPointSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                        case 5:
                            visibilityGraphSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                            if let selectedDayForecast = allDailyItems.first(where: {
                                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
                            }) {
                                forecastVisibilitySection(for: selectedDayForecast)
                                    .padding(.horizontal)
                                    .padding(.bottom)
                            }
                            
                            aboutVisibilitySection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                        case 6:
                            pressureGraphSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                            if let selectedDayForecast = allDailyItems.first(where: {
                                Calendar.current.isDate($0.date, inSameDayAs: selectedDate)
                            }) {
                                forecastPressureSection(for: selectedDayForecast)
                                    .padding(.horizontal)
                                    .padding(.bottom)
                            }
                            
                            aboutPressureSection()
                                .padding(.horizontal)
                                .padding(.bottom)
                            
                        default:
                            EmptyView()
                        }
                    }
                    .offset(y: -50)
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
        default: return "displayedCondition"
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
                    .foregroundColor(.gray)
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
    func calculatePressureRange(from values: [Double]) -> (Double, Double) {
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

    // MARK: - HELPER: Рисуване на маркер (H / L)
    func drawHLMarker(
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
    
    var currentTimeString: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: Date())
    }
    private func hourOfDay(from date: Date) -> Int {
        return Calendar.current.component(.hour, from: date)
    }

    func colorFromGradient(gradient: Gradient, location: Double) -> Color {
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
    func drawHLMarker(
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
    func directionAbbreviation(for degrees: Double) -> String {
        let d = degrees.truncatingRemainder(dividingBy: 360)
        let dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
                    "S","SSW","SW","WSW","W","WNW","NW","NNW"]
        let index = Int(((d + 11.25).truncatingRemainder(dividingBy: 360) / 22.5).rounded()) % 16
        return dirs[index]
    }

    // MARK: - Draw a min/max marker (circle + label)
    func drawMarker(
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

    // Помощна функция за генериране на динамичен текст за вятъра,
    // базиран на данните за деня и текущите стойности от вю модела (vm).
    func generateWindSummaryText(isToday: Bool,
                                           speeds: [Double],
                                           dayItem: DayForecastItem?) -> String {
        // Изчисляваме минималната скорост от часовата прогноза
        let dailyMinWindSpeed = speeds.min() ?? 0
        // Вземаме дневните данни за максимална скорост и порив (ако са налични)
        let dailyMaxSpeed = dayItem?.maxWindSpeed ?? 0
        let dailyMaxGust  = dayItem?.maxWindGust  ?? 0
        
        // Ако има дневен елемент, извличаме посоката от него;
        // ако не – връщаме дефолтен стринг.
        let directionAbbrev: String = {
            if let item = dayItem {
                return directionAbbreviation(for: item.predominantWindDirection)
            } else {
                return "-"
            }
        }()
        
        if isToday {
            // Ако денят е днешен, използваме данните от vm (ако са налични)
            let currentSpeed = vm.currentWindSpeed != nil ? Int(round(vm.currentWindSpeed!)) : Int(round(dailyMaxSpeed))
            let direction = vm.currentWindDirection != nil
                ? vm.windDirectionAbbreviation(for: vm.currentWindDirection)
                : directionAbbrev
            let minSpeed = Int(round(dailyMinWindSpeed))
            let maxSpeed = Int(round(dailyMaxSpeed))
            let gustSpeed = Int(round(dailyMaxGust))
            
            return "Wind is currently \(currentSpeed) km/h from the \(direction). Today, wind speeds are \(minSpeed) to \(maxSpeed) km/h, with gusts up to \(gustSpeed) km/h."
        } else {
            // За друг ден – изчисляваме диапазона от часовата прогноза
            let minSpeed = Int(round(dailyMinWindSpeed))
            let maxSpeed = Int(round(dailyMaxSpeed))
            let gustSpeed = Int(round(dailyMaxGust))
            return "Wind speeds range from \(minSpeed) to \(maxSpeed) km/h, with gusts up to \(gustSpeed) km/h."
        }
    }

    private func precipitationTotalsSection(for day: DayForecastItem) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Precipitation Totals")
                .font(.system(size: 16, weight: .semibold))
            
            if Calendar.current.isDate(day.date, inSameDayAs: Date()) {
                // Подробен изглед за текущия ден
                VStack(alignment: .leading, spacing: 5) {
                    Text("LAST 24 HOURS")
                        .font(.caption.weight(.medium))
                        .foregroundColor(.secondary)
                    
                    let rainLast = day.rainLast24h
                    let snowLast = day.snowLast24h
                    
                    if rainLast == 0 && snowLast == 0 {
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
                
                VStack(alignment: .leading, spacing: 5) {
                    Text("NEXT 24 HOURS")
                        .font(.caption.weight(.medium))
                        .foregroundColor(.secondary)
                    
                    let rainNext = day.rainNext24h
                    let snowNext = day.snowNext24h
                    
                    if rainNext == 0 && snowNext == 0 {
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
            } else {
                // За ден, който не е текущ – използваме данните от reinAmount и snowfallAmount.
                let rainValue = day.reinAmount
                let snowValue = day.snowfallAmount
                
                if rainValue == 0 && snowValue == 0 {
                    HStack {
                        Label("Total", systemImage: "drop.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text("Precipitation")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(Int(day.precipitationAmount)) mm")
                            .font(.system(size: 14))
                    }
                } else if snowValue == 0 {
                    HStack {
                        Label("Rain", systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text("Rain")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(Int(rainValue)) mm")
                            .font(.system(size: 14))
                            .foregroundColor(.blue)
                    }
                } else {
                    HStack {
                        Label("Snow", systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.white)
                        Text("Snow")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(String(format: "%.1f", snowValue)) cm")
                            .font(.system(size: 14))
                    }
                    HStack {
                        Label("Rain", systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text("Rain")
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(Int(rainValue)) mm")
                            .font(.system(size: 14))
                            .foregroundColor(.blue)
                    }
                }
            }
        }
        .offset(y: -10)
    }

    private var aboutWindSpeedAndGustsSection: some View {
           VStack(alignment:.leading, spacing:5) {
               Text("About Wind Speed and Gusts")
                   .font(.system(size:16, weight:.semibold))
               Text("The wind speed is calculated using the average over a short period of time. Gusts are short bursts of wind above this average. A gust typically lasts under 20 seconds.")
                   .font(.system(size:14))
                   .lineSpacing(3)
                   .foregroundColor(.gray)
           }
           .frame(maxWidth: .infinity, alignment: .leading)
       }
       
       /// Секция „About the Beaufort Scale“
       private var aboutBeaufortScaleSection: some View {
           VStack(alignment:.leading, spacing:5) {
               Text("About the Beaufort Scale")
                   .font(.system(size:16, weight:.semibold))
               Text("The Beaufort wind scale expresses how forceful or strong the wind is at a given speed. The Beaufort scale may make it easier to understand how windy it will feel or how much effect the wind could have. Each value on the scale corresponds to a wind speed range.")
                   .font(.system(size:14))
                   .lineSpacing(3)
                   .foregroundColor(.gray)
           }
           .frame(maxWidth: .infinity, alignment: .leading)
       }
    
    /// Генерира подробен текст за текущия ден, използвайки данните от WeatherKitViewModel (vm) за текущите условия,
    /// като падащите данни се комбинират с данните от обекта day (напр. за дневната мин/макс температура, ако vm не ги предоставя).
    private func generateCurrentDayForecastText(from day: DayForecastItem) -> String {
        // Използваме shared вю модел – ако има налични данни, ги вземаме от него.
        let vm = WeatherKitViewModel.shared
        
        // Текущата температура: ако vm.currentTemp има стойност, използваме я, иначе изчисляваме средната
        let currentTemp = vm.currentTemp ?? ((day.minTemp + day.maxTemp) / 2.0)
        // "Feels like": ако vm.currentFeelsLike има стойност, използваме я, иначе симулираме чрез отнемане на 2°
        let currentFeelsLike = vm.currentFeelsLike ?? (currentTemp - 2.0)
        
        // Ако за деня са зададени минимална/максимална температура (например vm.todayMinTemp), ги използваме, иначе данните от day.
        let minTemp = vm.todayMinTemp ?? day.minTemp
        let maxTemp = vm.todayMaxTemp ?? day.maxTemp
        
        // За символа използваме данните от vm, ако са зададени
        let condition = vm.currentSymbol
        
        // Валежната вероятност – използваме данните от vm, ако са налични
        let precipChanceText: String = {
            if let chance = vm.currentPrecipitationProbability {
                return "\(Int(chance * 100))%"
            } else if let chance = day.precipChance {
                return "\(Int(chance * 100))%"
            }
            return "N/A"
        }()
        
        // За вятъра: ако vm.currentWindDirection има стойност, го използваме; иначе използваме данните от day
        let windDir: String = {
            if let angle = vm.currentWindDirection {
                return directionAbbreviation(for: angle.degrees)
            }
            return directionAbbreviation(for: day.predominantWindDirection)
        }()
        let windGust = vm.currentWindGust ?? day.maxWindGust
        
        // UV индекс – използваме данните от vm или от day
        let uvText: String = {
            if let uv = vm.currentUVIndex {
                return "UV index up to \(uv)"
            }
            return "UV index up to \(day.maxUV)"
        }()
        
        // Влажност – тук ако няма текуща стойност, използваме диапазона от day
        let humidityText: String = {
            // Ако currentHumidity има стойност, приемаме, че тя представя момента (например приблизително една стойност)
            if let hum = vm.currentHumidity {
                return "Humidity around \(Int(round(hum * 100)))%"
            }
            return "Humidity from \(Int(round(day.humidityMin * 100)))% to \(Int(round(day.humidityMax * 100)))%"
        }()
        
        return "\(Int(round(currentTemp)))° now with \(condition.lowercased()) conditions. There is a precipitation chance of \(precipChanceText). Wind from \(windDir) with gusts up to \(Int(round(windGust))) km/h. Today's temperature ranges from \(Int(round(minTemp)))° to \(Int(round(maxTemp)))° and feels like \(Int(round(currentFeelsLike)))°. \(uvText), and \(humidityText)."
    }

    /// Генерира динамичен текст за друг ден, използвайки данните от DayForecastItem.
    /// Тук текстът включва пълното име на деня, изчислен "feels like" диапазон (чрез отнемане на 3°) и кратко резюме за валежите.
    private func generateOtherDayForecastText(for day: DayForecastItem) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE"  // Пълното име на деня, напр. "Friday"
        let dayName = formatter.string(from: day.date)
        
        let feelsLikeMin = day.minTemp - 3.0
        let feelsLikeMax = day.maxTemp - 3.0
        let windDir = directionAbbreviation(for: day.predominantWindDirection)
        
        let precipSummary: String = {
            if day.rainLast24h == 0 && day.snowLast24h == 0 {
                return "No precipitation recorded in the last 24 hours."
            } else if day.snowLast24h == 0 {
                return "It rained \(Int(round(day.rainLast24h))) mm in the last 24 hours."
            } else {
                return "In the last 24 hours, snow measured \(String(format: "%.1f", day.snowLast24h)) cm and rain \(Int(round(day.rainLast24h))) mm."
            }
        }()
        
        return "\(dayName)'s low is \(Int(round(day.minTemp)))° and the high is \(Int(round(day.maxTemp)))°. The temperature will feel like \(Int(round(feelsLikeMin)))° to \(Int(round(feelsLikeMax)))°. Wind from \(windDir) is expected. \(precipSummary)"
    }

    /// Показва секция за прогнозата – ако денят е текущ, заглавието е "Forecast" и се използват текущите данни от vm,
    /// а ако не е, заглавието е "Daily Summary" и се използват данните от DayForecastItem.
    private func forecastTempSection(for day: DayForecastItem) -> some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(Calendar.current.isDate(day.date, inSameDayAs: Date()) ? "Forecast" : "Daily Summary")
                .font(.system(size: 16, weight: .semibold))
            Text(Calendar.current.isDate(day.date, inSameDayAs: Date()) ?
                 generateCurrentDayForecastText(from: day) :
                 generateOtherDayForecastText(for: day))
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .offset(x: -2, y: -10)
    }

    @ViewBuilder
    private func forecastPrecipitationSection(for day: DayForecastItem) -> some View {
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        // Compute weekday name outside of the view's conditional content.
        let dayName: String = {
            let formatter = DateFormatter()
            formatter.dateFormat = "EEEE"
            return formatter.string(from: day.date)
        }()
        
        VStack(alignment: .leading, spacing: 5) {
            Text(isToday ? "Forecast" : "Daily Summary")
                .font(.system(size: 16, weight: .semibold))
            
            if isToday {
                // For the current day, show a detailed forecast.
                Text("There has been \(Int(day.precipLast24h)) mm of precipitation in the last 24 hours. Today's total precipitation will be \(Int(day.precipitationAmount)) mm. In the next 24 hours, \(Int(day.precipNext24h)) mm of precipitation is expected.")
                    .font(.system(size: 14))
                    .lineSpacing(3)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
            } else {
                // For other days, display a concise summary using the dayName computed earlier.
                Text("On \(dayName), the total precipitation will be \(Int(day.precipitationAmount)) mm.")
                    .font(.system(size: 14))
                    .lineSpacing(3)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4,y: -60)
    }

    @ViewBuilder
    private func forecastHumiditySection(for day: DayForecastItem) -> some View {
        // Проверяваме дали денят е текущия
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        
        // Изчисляваме името на деня, ако не е "Today"
        let dayName: String = {
            let formatter = DateFormatter()
            formatter.dateFormat = "EEEE"
            return formatter.string(from: day.date)
        }()
        
        // Средната влажност – приемаме, че е средната от минимална и максимална влажност (преобразувана в проценти)
        let avgHumidity = Int(round(((day.humidityMin + day.humidityMax) / 2) * 100))
        
        // Динамично изчисляваме dew point стойностите с помощта на аппроксимация
        let dewPointMin = Int(round(day.minTemp - ((100 - (day.humidityMin * 100)) / 5)))
        let dewPointMax = Int(round(day.maxTemp - ((100 - (day.humidityMax * 100)) / 5)))
        
        // Генерираме текста за dew point-а според това дали денят е текущ или не
        let dewPointText: String = isToday ?
            "The dew point is \(dewPointMin)° to \(dewPointMax)°." :
            "The dew point will be \(dewPointMin)° to \(dewPointMax)°."
        
        VStack(alignment: .leading, spacing: 5) {
            Text(isToday ? "Forecast" : "Daily Summary")
                .font(.system(size: 16, weight: .semibold))
            
            if isToday {
                Text("Today, the average humidity is \(avgHumidity)%. \(dewPointText)")
                    .font(.system(size: 14))
                    .lineSpacing(3)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
            } else {
                Text("On \(dayName), the average humidity will be \(avgHumidity)%.\n\(dewPointText)")
                    .font(.system(size: 14))
                    .lineSpacing(3)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: -40)
    }
    
    func clarityDescription(for value: Int) -> String {
        if value >= 30 {
            return "perfectly clear"
        } else if value >= 20 {
            return "clear"
        } else if value >= 10 {
            return "partially clear"
        } else {
            return "hazy"
        }
    }
    
    @ViewBuilder
    private func forecastVisibilitySection(for day: DayForecastItem) -> some View {
        // Проверяваме дали денят е текущия ден
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        
        // Ако денят не е текущ, извличаме пълното име на деня (например "Saturday")
        let dayName: String = {
            let formatter = DateFormatter()
            formatter.dateFormat = "EEEE"
            return formatter.string(from: day.date)
        }()
        
        // Закръгляме стойностите за видимост (в км) към цели числа
        let minVis = Int(round(day.visibilityMin))
        let maxVis = Int(round(day.visibilityMax))
        
        // Локална функция, която определя описанието на видимостта динамично
       
        
        // За текущия ден може да използваме средната стойност като индикатор за общото състояние
        let avgVis = (minVis + maxVis) / 2
        let avgClarity = clarityDescription(for: avgVis)
        // За не-текущите дни отделно описваме минималната и максималната видимост
        let minClarity = clarityDescription(for: minVis)
        let maxClarity = clarityDescription(for: maxVis)
        
        VStack(alignment: .leading, spacing: 5) {
            // Заглавна част: "Forecast" за текущия ден или "Daily Summary" за друг ден
            Text(isToday ? "Forecast" : "Daily Summary")
                .font(.system(size: 16, weight: .semibold))
            
            if isToday {
                // Пример за текущ ден:
                // "Today, the visibility will be perfectly clear, at 21 to 32 km."
                Text("Today, the visibility will be \(avgClarity), at \(minVis) to \(maxVis) km.")
                    .font(.system(size: 14))
                    .lineSpacing(3)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
            } else {
                // Пример за не-текущ ден:
                // "On Saturday, the lowest visibility will be clear at 13 km, and the highest will be perfectly clear at 28 km."
                Text("On \(dayName), the lowest visibility will be \(minClarity) at \(minVis) km, and the highest will be \(maxClarity) at \(maxVis) km.")
                    .font(.system(size: 14))
                    .lineSpacing(3)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: 5)
    }


    @ViewBuilder
    private func aboutVisibilitySection() -> some View {
        VStack(alignment:.leading, spacing:5) {
            Text("About Visibility")
                .font(.system(size:16, weight:.semibold))
            Text("""
            Visibility tells you how far away you can clearly see objects like buildings and hills. It is a measure of the transparency of the air and does not take into account the amount of sunlight or the presence of obstructions. Visibility at or above 10 km is considered clear.
            """)

                .font(.system(size:14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: 15)
    }
    
    @ViewBuilder
    private func forecastPressureSection(for day: DayForecastItem) -> some View {
        // Определяме дали денят е днешният
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        
        // Извличаме почасовите стойности за налягането (в hPa) от hourlyItemsForSelectedDate
        let pressureValues = hourlyItemsForSelectedDate.map { $0.pressure }
        
        // Изчисляваме средното налягане (ако има данни, иначе fallback)
        let avgPressure: Int = {
            if !pressureValues.isEmpty {
                return Int(round(pressureValues.reduce(0, +) / Double(pressureValues.count)))
            } else {
                return 1013  // fallback стойност
            }
        }()
        
        // Извличаме минималното налягане (ако няма данни, fallback)
        let minPressure: Int = {
            if let minVal = pressureValues.min() {
                return Int(round(minVal))
            } else {
                return 1013
            }
        }()
        
        VStack(alignment: .leading, spacing: 5) {
            // Заглавна част – "Forecast" за днешния ден, "Daily Summary" за друг ден
            Text(isToday ? "Forecast" : "Daily Summary")
                .font(.system(size: 16, weight: .semibold))
            
            if isToday {
                // За днешния ден използваме vm.currentPressure, ако е налична, иначе използваме средната стойност
                let currentPressure = Int(round(vm.currentPressure ?? Double(avgPressure)))
                Text("Pressure is currently \(currentPressure) hPa and falling. Today, the average pressure will be \(avgPressure) hPa, and the lowest pressure will be \(minPressure) hPa.")
                    .font(.system(size: 14))
                    .lineSpacing(3)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
            } else {
                // Извличаме името на деня (например "Sunday")
                let weekday: String = {
                    let formatter = DateFormatter()
                    formatter.dateFormat = "EEEE"
                    return formatter.string(from: day.date)
                }()
                Text("On \(weekday), the average pressure will be \(avgPressure) hPa, and the lowest pressure will be \(minPressure) hPa.")
                    .font(.system(size: 14))
                    .lineSpacing(3)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: 5)
    }



    @ViewBuilder
    private func aboutPressureSection() -> some View {
        VStack(alignment:.leading, spacing:5) {
            Text("About Pressure")
                .font(.system(size:16, weight:.semibold))
            Text("""
            Significant, rapid changes in pressure are used to predict changes in the weather. For example, a drop in pressure can mean that rain or snow is on the way, and rising pressure can mean that weather will improve. Pressure is also called barometric pressure or atmospheric pressure.
            """)

                .font(.system(size:14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: 15)
    }
    
    @ViewBuilder
    private func aboutHumiditySection() -> some View {
        VStack(alignment:.leading, spacing:5) {
            Text("About Relative Humidity")
                .font(.system(size:16, weight:.semibold))
            Text("""
            Relative humidity, commonly known just as humidity, is the amount of moisture in the air compared with what the air can hold. The air can hold more moisture at higher temperatures. A relative humidity near 100% means there may be dew or fog.
            """)

                .font(.system(size:14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4,y: -40)
    }
    
    @ViewBuilder
    private func aboutDewPointSection() -> some View {
        VStack(alignment:.leading, spacing:5) {
            Text("About Precipitation Intensity")
                .font(.system(size:16, weight:.semibold))
            Text("""
            The dew point is what the temperature would need to fall to for dew to form. It can be a useful way to tell how humid the air feels — the higher the dew point, the more humid it feels. A dew point that matches the current temperature means the relative humidity is 100%, and there may be dew or fog.
            """)

                .font(.system(size:14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4,y: -40)
    }
    
    @ViewBuilder
    private func aboutPrecipitationSection() -> some View {
        VStack(alignment:.leading, spacing:5) {
            Text("About Precipitation Intensity")
                .font(.system(size:16, weight:.semibold))
            Text("""
            Intensity is calculated based on how much rain or snow falls per hour and is meant to indicate how heavy the rain or snow will feel. It is also used with other precipitation types such as sleet and wintry mix. A downpour or heavy snowstorm can have a "heavy" intensity, while an average rainfall or lighter drizzle can have a "moderate" or "light" intensity.
            """)

                .font(.system(size:14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4,y: -60)
    }
    
    @ViewBuilder
    private func forecastWindSection(for day: DayForecastItem) -> some View {
        // Изчисляваме скоростите от почасовата прогноза за избрания ден
        let speeds: [Double] = hourlyItemsForSelectedDate.map { $0.windSpeed }
        // Определяме дали денят от day е текущ (днес)
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        
        VStack(alignment: .leading, spacing: 5) {
            Text(Calendar.current.isDate(day.date, inSameDayAs: Date()) ? "Forecast" : "Daily Summary")
                .font(.system(size: 16, weight: .semibold))
            Text(generateWindSummaryText(isToday: isToday,
                                          speeds: speeds,
                                          dayItem: day))
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading) // Подравняване на много редове
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(y: -10)
    }

    struct BeaufortScaleItem: Identifiable {
        let id = UUID()
        let bft: Int
        let description: String
        let kmhRange: String
    }
    
    func interpolateColor(from: UIColor, to: UIColor, fraction: CGFloat) -> UIColor {
        var fRed: CGFloat = 0, fGreen: CGFloat = 0, fBlue: CGFloat = 0, fAlpha: CGFloat = 0
        var tRed: CGFloat = 0, tGreen: CGFloat = 0, tBlue: CGFloat = 0, tAlpha: CGFloat = 0
        from.getRed(&fRed, green: &fGreen, blue: &fBlue, alpha: &fAlpha)
        to.getRed(&tRed, green: &tGreen, blue: &tBlue, alpha: &tAlpha)
        let red   = fRed   + (tRed   - fRed)   * fraction
        let green = fGreen + (tGreen - fGreen) * fraction
        let blue  = fBlue  + (tBlue  - fBlue)  * fraction
        let alpha = fAlpha + (tAlpha - fAlpha) * fraction
        return UIColor(red: red, green: green, blue: blue, alpha: alpha)
    }
    
    func gradientColor(for progress: Double) -> Color {
        let clamped = min(max(progress, 0.0), 1.0)
        let uiColor: UIColor
        if clamped <= 0.33 {
            let fraction = CGFloat(clamped / 0.33)
            // teal to yellow
            uiColor = interpolateColor(from: UIColor.systemTeal, to: UIColor.yellow, fraction: fraction)
        } else if clamped <= 0.66 {
            let fraction = CGFloat((clamped - 0.33) / 0.33)
            // yellow to orange
            uiColor = interpolateColor(from: UIColor.yellow, to: UIColor.orange, fraction: fraction)
        } else {
            let fraction = CGFloat((clamped - 0.66) / 0.34)
            // orange to red
            uiColor = interpolateColor(from: UIColor.orange, to: UIColor.red, fraction: fraction)
        }
        return Color(uiColor)
    }
    
    @ViewBuilder
    private func windTableSection() -> some View {
        // MARK: Beaufort Data
        let beaufortData: [BeaufortScaleItem] = [
            BeaufortScaleItem(bft: 0, description: "Calm",             kmhRange: "< 2"),
            BeaufortScaleItem(bft: 1, description: "Light air",        kmhRange: "2 – 5"),
            BeaufortScaleItem(bft: 2, description: "Light breeze",     kmhRange: "6 – 11"),
            BeaufortScaleItem(bft: 3, description: "Gentle breeze",    kmhRange: "12 – 19"),
            BeaufortScaleItem(bft: 4, description: "Moderate breeze",  kmhRange: "20 – 28"),
            BeaufortScaleItem(bft: 5, description: "Fresh breeze",     kmhRange: "29 – 38"),
            BeaufortScaleItem(bft: 6, description: "Strong breeze",    kmhRange: "39 – 49"),
            BeaufortScaleItem(bft: 7, description: "High wind",        kmhRange: "50 – 61"),
            BeaufortScaleItem(bft: 8, description: "Gale",             kmhRange: "62 – 74"),
            BeaufortScaleItem(bft: 9, description: "Strong gale",      kmhRange: "75 – 88"),
            BeaufortScaleItem(bft: 10, description: "Storm",           kmhRange: "89 – 102"),
            BeaufortScaleItem(bft: 11, description: "Violent storm",   kmhRange: "103 – 117"),
            BeaufortScaleItem(bft: 12, description: "Hurricane-force", kmhRange: "> 118")
        ]
      
        VStack(alignment: .leading, spacing: 5) {
            // Main Header
            Text("Beaufort Scale")
                .font(.system(size: 16, weight: .semibold))
                .offset(y: -5)
                .frame(maxWidth: .infinity, alignment: .leading)

            // Column Headers
            HStack(spacing: 12) {
                Text("bft")
                    .font(.system(size: 13, weight: .medium))
                    .frame(width: 20, alignment: .leading)
                    .offset(x: 19)
                Text("Description")
                    .font(.system(size: 13, weight: .medium))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .offset(x: 20)
                Text("km/h")
                    .font(.system(size: 13, weight: .medium))
                    .frame(width: 60, alignment: .leading)
            }
            .foregroundColor(.gray)
            .padding(.horizontal, 16)
            .padding(.bottom, 4)
            Divider()
                .background(Color.white.opacity(0.2))
                .padding(.horizontal, 16)
            
            ForEach(beaufortData) { item in
                // Compute progress for the gradient based on Beaufort level (0...1)
                let progress = Double(item.bft) / 12.0
                let circleColor = gradientColor(for: progress)
                
                VStack(spacing: 0) {
                    HStack(spacing: 12) {
                        // Gradient-based colored circle
                        Circle()
                            .fill(circleColor)
                            .frame(width: 10, height: 10)
                        
                        // Beaufort number
                        Text("\(item.bft)")
                            .frame(width: 20, alignment: .leading)
                        
                        // Wind description
                        Text(item.description)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        
                        // km/h range left-aligned
                        Text(item.kmhRange)
                            .frame(width: 60, alignment: .leading)
                    }
                    .font(.system(size: 14))
                    .foregroundColor(.white)
                    .padding(.vertical, 6)
                    .padding(.horizontal, 16)
                    
                    Divider()
                        .background(Color.white.opacity(0.08))
                        .padding(.leading, 16)
                }
            }
        }
        .background(Color.black)

    }

    private var aboutFeelsLikeSection: some View {
        VStack(alignment:.leading, spacing:5) {
            Text("About Feels Like Temperature")
                .font(.system(size:16, weight:.semibold))
            Text("Feels Like conveys how warm or cold it feels and can be different from the actual temperature. The Feels Like temperature is affected by humidity, sunlight and wind.")
                .font(.system(size:14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .offset(x: -4, y:-10)
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
