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
        let formatter = DateFormatter()
        formatter.dateFormat = "HH"
        formatter.timeZone = vm.locationTimeZone // Сега използва избраната часова зона
        return formatter.string(from: date)
    }

    
    // MARK: - Computed Properties (Filtered Data, Display Info) - Keep as is
    var hourlyItemsForSelectedDate: [HourlyForecastItem] {
        let startOfDay = customCalendar.startOfDay(for: selectedDate)
        // Използвайте customCalendar за всички сравнения и изчисления
        var fullDayItems: [HourlyForecastItem] = []
        
        for hourOffset in 0...24 {
            let hourDate = customCalendar.date(byAdding: .hour, value: hourOffset, to: startOfDay)!
            if let realItem = allHourlyItems.first(where: {
                customCalendar.isDate($0.date, equalTo: hourDate, toGranularity: .hour)
            }) {
                fullDayItems.append(realItem)
            } else {
                // Добавете placeholder елемент
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
                    pressure: 0
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
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, d MMMM yyyy"
        formatter.timeZone = vm.locationTimeZone
        return formatter
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
        case 0:
            return NSLocalizedString("Conditions", comment: "Label for Conditions tab")
        case 1:
            return NSLocalizedString("UV Index", comment: "Label for UV Index tab")
        case 2:
            return NSLocalizedString("Wind", comment: "Label for Wind tab")
        case 3:
            return NSLocalizedString("Precipitation", comment: "Label for Precipitation tab")
        case 4:
            return NSLocalizedString("Humidity", comment: "Label for Humidity tab")
        case 5:
            return NSLocalizedString("Visibility", comment: "Label for Visibility tab")
        case 6:
            return NSLocalizedString("Pressure", comment: "Label for Pressure tab")
        default:
            return NSLocalizedString("displayedCondition", comment: "Fallback label")
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
        let index = Int(((d + 11.25).truncatingRemainder(dividingBy: 360) / 22.5).rounded()) % 16
        let keys = [
            "Dir_N",   "Dir_NNE", "Dir_NE",  "Dir_ENE",
            "Dir_E",   "Dir_ESE", "Dir_SE",  "Dir_SSE",
            "Dir_S",   "Dir_SSW", "Dir_SW",  "Dir_WSW",
            "Dir_W",   "Dir_WNW", "Dir_NW",  "Dir_NNW"
        ]
        return NSLocalizedString(keys[index],
                                 comment: "Compass direction abbreviation")
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
        
        let speedUnit = GlobalState.speedUnitLabel // Вземаме динамичната единица за скорост

        if isToday {
            // Ако денят е днешен, използваме данните от vm (ако са налични)
            let currentSpeed = vm.currentWindSpeed != nil ? Int(round(vm.currentWindSpeed!)) : Int(round(dailyMaxSpeed))
            let direction = vm.currentWindDirection != nil
                ? vm.windDirectionAbbreviation(for: vm.currentWindDirection)
                : directionAbbrev
            let minSpeed = Int(round(dailyMinWindSpeed))
            let maxSpeed = Int(round(dailyMaxSpeed))
            let gustSpeed = Int(round(dailyMaxGust))
            
            return String(
                format: NSLocalizedString(
                    "WindSummary_Current",
                    comment: "Summary for today's wind. Params: 1:currentSpeed, 2:speedUnit, 3:direction, 4:minSpeed, 5:maxSpeed, 6:gustSpeed"
                ),
                currentSpeed,   // %1$d
                speedUnit,      // %2$@
                direction,      // %3$@
                minSpeed,       // %4$d
                maxSpeed,       // %5$d
                gustSpeed       // %6$d
            )
        } else {
            // За друг ден – изчисляваме диапазона от часовата прогноза
            let minSpeed = Int(round(dailyMinWindSpeed))
            let maxSpeed = Int(round(dailyMaxSpeed))
            let gustSpeed = Int(round(dailyMaxGust))
            
            return String(
                format: NSLocalizedString(
                    "WindSummary_Range",
                    comment: "Summary for other days’ wind. Params: 1:minSpeed, 2:maxSpeed, 3:speedUnit, 4:gustSpeed"
                ),
                minSpeed,       // %1$d
                maxSpeed,       // %2$d
                speedUnit,      // %3$@
                gustSpeed       // %4$d
            )
        }
    }

    private func precipitationTotalsSection(for day: DayForecastItem) -> some View {
        let liquidUnit = GlobalState.precipitationUnitLabel
        let snowUnit = GlobalState.measurementSystem == "Imperial"
            ? NSLocalizedString("Unit_Precipitation_in", comment: "Inch unit abbreviation")
            : NSLocalizedString("UnitCentimeter", comment: "Centimeter unit abbreviation")

        func formatted(_ value: Double) -> String {
            return value == 0 ? "0" : String(format: "%.1f", value)
        }

        return VStack(alignment: .leading, spacing: 8) {
            Text(NSLocalizedString("PrecipitationTotals_Title", comment: "Precipitation Totals title"))
                .font(.system(size: 16, weight: .semibold))

            if Calendar.current.isDate(day.date, inSameDayAs: Date()) {
                // LAST 24 HOURS
                VStack(alignment: .leading, spacing: 5) {
                    Text(NSLocalizedString("Last24h_Label", comment: "Last 24 hours label"))
                        .font(.caption.weight(.medium))
                        .foregroundColor(.secondary)

                    let rainLast = day.rainLast24h
                    let snowLast = day.snowLast24h

                    if rainLast == 0 && snowLast == 0 {
                        HStack {
                            Label(NSLocalizedString("Total_Label", comment: "Total label"), systemImage: "drop.fill")
                                .labelStyle(.iconOnly)
                                .foregroundColor(.blue)
                            Text(NSLocalizedString("Precipitation_Label", comment: "Precipitation label"))
                                .font(.system(size: 14))
                            Spacer()
                            Text("\(formatted(day.precipLast24h))\(liquidUnit)")
                                .font(.system(size: 14))
                        }
                    } else if snowLast == 0 {
                        HStack {
                            Label(NSLocalizedString("Rain_Label", comment: "Rain label"), systemImage: "circle.fill")
                                .labelStyle(.iconOnly)
                                .foregroundColor(.blue)
                            Text(NSLocalizedString("Rain_Label", comment: "Rain label"))
                                .font(.system(size: 14))
                            Spacer()
                            Text("\(formatted(rainLast))\(liquidUnit)")
                                .font(.system(size: 14))
                                .foregroundColor(.blue)
                        }
                    } else {
                        HStack {
                            Label(NSLocalizedString("Snow_Label", comment: "Snow label"), systemImage: "circle.fill")
                                .labelStyle(.iconOnly)
                                .foregroundColor(.white)
                            Text(NSLocalizedString("Snow_Label", comment: "Snow label"))
                                .font(.system(size: 14))
                            Spacer()
                            Text("\(formatted(snowLast)) \(snowUnit)")
                                .font(.system(size: 14))
                        }
                        HStack {
                            Label(NSLocalizedString("Rain_Label", comment: "Rain label"), systemImage: "circle.fill")
                                .labelStyle(.iconOnly)
                                .foregroundColor(.blue)
                            Text(NSLocalizedString("Rain_Label", comment: "Rain label"))
                                .font(.system(size: 14))
                            Spacer()
                            Text("\(formatted(rainLast))\(liquidUnit)")
                                .font(.system(size: 14))
                                .foregroundColor(.blue)
                        }
                    }
                }
                .padding(.top, 5)

                // NEXT 24 HOURS
                VStack(alignment: .leading, spacing: 5) {
                    Text(NSLocalizedString("Next24h_Label", comment: "Next 24 hours label"))
                        .font(.caption.weight(.medium))
                        .foregroundColor(.secondary)

                    let rainNext = day.rainNext24h
                    let snowNext = day.snowNext24h

                    if rainNext == 0 && snowNext == 0 {
                        HStack {
                            Label(NSLocalizedString("Total_Label", comment: "Total label"), systemImage: "drop.fill")
                                .labelStyle(.iconOnly)
                                .foregroundColor(.blue)
                            Text(NSLocalizedString("Precipitation_Label", comment: "Precipitation label"))
                                .font(.system(size: 14))
                            Spacer()
                            Text("\(formatted(day.precipNext24h))\(liquidUnit)")
                                .font(.system(size: 14))
                                .foregroundColor(.blue)
                        }
                    } else if snowNext == 0 {
                        HStack {
                            Label(NSLocalizedString("Rain_Label", comment: "Rain label"), systemImage: "circle.fill")
                                .labelStyle(.iconOnly)
                                .foregroundColor(.blue)
                            Text(NSLocalizedString("Rain_Label", comment: "Rain label"))
                                .font(.system(size: 14))
                            Spacer()
                            Text("\(formatted(rainNext))\(liquidUnit)")
                                .font(.system(size: 14))
                                .foregroundColor(.blue)
                        }
                    } else {
                        HStack {
                            Label(NSLocalizedString("Snow_Label", comment: "Snow label"), systemImage: "circle.fill")
                                .labelStyle(.iconOnly)
                                .foregroundColor(.white)
                            Text(NSLocalizedString("Snow_Label", comment: "Snow label"))
                                .font(.system(size: 14))
                            Spacer()
                            Text("\(formatted(snowNext)) \(snowUnit)")
                                .font(.system(size: 14))
                        }
                        HStack {
                            Label(NSLocalizedString("Rain_Label", comment: "Rain label"), systemImage: "circle.fill")
                                .labelStyle(.iconOnly)
                                .foregroundColor(.blue)
                            Text(NSLocalizedString("Rain_Label", comment: "Rain label"))
                                .font(.system(size: 14))
                            Spacer()
                            Text("\(formatted(rainNext))\(liquidUnit)")
                                .font(.system(size: 14))
                                .foregroundColor(.blue)
                        }
                    }
                }
                .padding(.top, 10)

            } else {
                // ДРУГ ДЕН
                let rainValue = day.reinAmount
                let snowValue = day.snowfallAmount

                if rainValue == 0 && snowValue == 0 {
                    HStack {
                        Label(NSLocalizedString("Total_Label", comment: "Total label"), systemImage: "drop.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text(NSLocalizedString("Precipitation_Label", comment: "Precipitation label"))
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(formatted(day.precipitationAmount))\(liquidUnit)")
                            .font(.system(size: 14))
                    }
                } else if snowValue == 0 {
                    HStack {
                        Label(NSLocalizedString("Rain_Label", comment: "Rain label"), systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text(NSLocalizedString("Rain_Label", comment: "Rain label"))
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(formatted(rainValue))\(liquidUnit)")
                            .font(.system(size: 14))
                            .foregroundColor(.blue)
                    }
                } else {
                    HStack {
                        Label(NSLocalizedString("Snow_Label", comment: "Snow label"), systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.white)
                        Text(NSLocalizedString("Snow_Label", comment: "Snow label"))
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(formatted(snowValue)) \(snowUnit)")
                            .font(.system(size: 14))
                    }
                    HStack {
                        Label(NSLocalizedString("Rain_Label", comment: "Rain label"), systemImage: "circle.fill")
                            .labelStyle(.iconOnly)
                            .foregroundColor(.blue)
                        Text(NSLocalizedString("Rain_Label", comment: "Rain label"))
                            .font(.system(size: 14))
                        Spacer()
                        Text("\(formatted(rainValue))\(liquidUnit)")
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
               Text(NSLocalizedString("About Wind Speed and Gusts", comment: "Wind speed info title"))
                   .font(.system(size:16, weight:.semibold))
               Text(NSLocalizedString("The wind speed is calculated using the average over a short period of time. Gusts are short bursts of wind above this average. A gust typically lasts under 20 seconds.", comment: "Wind speed info body"))
                   .font(.system(size:14))
                   .lineSpacing(3)
                   .foregroundColor(.gray)
           }
           .frame(maxWidth: .infinity, alignment: .leading)
       }
       
       /// Секция „About the Beaufort Scale“
       private var aboutBeaufortScaleSection: some View {
           VStack(alignment:.leading, spacing:5) {
               Text(NSLocalizedString("About the Beaufort Scale", comment: "Beaufort info title"))
                   .font(.system(size:16, weight:.semibold))
               Text(NSLocalizedString("The Beaufort wind scale expresses how forceful or strong the wind is at a given speed. The Beaufort scale may make it easier to understand how windy it will feel or how much effect the wind could have. Each value on the scale corresponds to a wind speed range.", comment: "Beaufort info body"))
                   .font(.system(size:14))
                   .lineSpacing(3)
                   .foregroundColor(.gray)
           }
           .frame(maxWidth: .infinity, alignment: .leading)
       }
    
    /// Генерира подробен текст за текущия ден, използвайки данните от WeatherKitViewModel (vm) за текущите условия,
    /// като падащите данни се комбинират с данните от обекта day (напр. за дневната мин/макс температура, ако vm не ги предоставя).
    private func generateCurrentDayForecastText(from day: DayForecastItem) -> String {
        let vm = WeatherKitViewModel.shared
        
        let currentTemp      = vm.currentTemp ?? ((day.minTemp + day.maxTemp) / 2.0)
        let currentFeelsLike = vm.currentFeelsLike ?? (currentTemp - 2.0)
        let minTemp          = vm.todayMinTemp    ?? day.minTemp
        let maxTemp          = vm.todayMaxTemp    ?? day.maxTemp
        let condition        = vm.currentSymbol.lowercased()
        
        // precipChanceText остава с %% вече форматирано
        let precipChanceText: String = {
            if let chance = vm.nextHourPrecipitationChance {
                return String(format: "%d%%", Int(chance * 100))
            } else if let chance = day.precipChance {
                return String(format: "%d%%", Int(chance * 100))
            }
            return NSLocalizedString("NA", comment: "Fallback when not available")
        }()
        
        let windDir = vm.currentWindDirection
            .map { directionAbbreviation(for: $0.degrees) }
          ?? directionAbbreviation(for: day.predominantWindDirection)
        
        let windGust = vm.currentWindGust ?? day.maxWindGust
        
        let uvText: String = {
            let uv = vm.currentUVIndex ?? day.maxUV
            return String(format: NSLocalizedString("UVIndexFormat", comment: "UV index format"), uv)
        }()
        
        let humidityText: String = {
            if let hum = vm.currentHumidity {
                return String(format: NSLocalizedString("HumidityFormat", comment: "Current humidity"), Int(round(hum*100)))
            } else {
                return String(
                    format: NSLocalizedString("HumidityRangeFormat", comment: "Humidity range"),
                    Int(round(day.humidityMin * 100)),
                    Int(round(day.humidityMax * 100))
                )
            }
        }()
        let windSpeedUnit = GlobalState.speedUnitLabel

        let format = NSLocalizedString(
            "CurrentDayForecastText",
            comment: "Full summary for today's forecast: temp, condition, precip, wind, range, feels like, UV, humidity"
        )
        return String(
            format: format,
            Int(round(currentTemp)),
            condition,
            precipChanceText,
            windDir,
            Int(round(windGust)),
            windSpeedUnit,
            Int(round(minTemp)),
            Int(round(maxTemp)),
            Int(round(currentFeelsLike)),
            uvText,
            humidityText
        )

    }

    private func generateOtherDayForecastText(for day: DayForecastItem) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE"
        let dayName = formatter.string(from: day.date)
        
        let feelsLikeMin = day.minTemp - 3.0
        let feelsLikeMax = day.maxTemp - 3.0
        let windDir      = directionAbbreviation(for: day.predominantWindDirection)
        
        let precipSummary: String = {
            if day.rainLast24h == 0 && day.snowLast24h == 0 {
                return NSLocalizedString("NoPrecipLast24h", comment: "No precip in last 24h")
            } else if day.snowLast24h == 0 {
                return String(
                    format: NSLocalizedString("RainLast24h", comment: "Rain in last 24h"),
                    Int(round(day.rainLast24h))
                )
            } else {
                return String(
                    format: NSLocalizedString("SnowAndRainLast24h", comment: "Snow & rain in last 24h"),
                    String(format: "%.1f", day.snowLast24h),
                    Int(round(day.rainLast24h))
                )
            }
        }()
        
        let format = NSLocalizedString(
            "OtherDayForecastText",
            comment: "Full summary for another day: dayName, low, high, feelsLike-range, wind, precipSummary"
        )
        return String(
            format: format,
            dayName,
            Int(round(day.minTemp)),
            Int(round(day.maxTemp)),
            Int(round(feelsLikeMin)),
            Int(round(feelsLikeMax)),
            windDir,
            precipSummary
        )
    }


    /// Показва секция за прогнозата – ако денят е текущ, заглавието е "Forecast" и се използват текущите данни от vm,
    /// а ако не е, заглавието е "Daily Summary" и се използват данните от DayForecastItem.
    private func forecastTempSection(for day: DayForecastItem) -> some View {
        VStack(alignment: .leading, spacing: 5) {
            let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
            
            Text(
                NSLocalizedString(
                    isToday ? "Forecast" : "DailySummary",
                    comment: isToday
                        ? "Title for today's forecast"
                        : "Title for daily summary"
                )
            )
            .font(.system(size: 16, weight: .semibold))
            
            Text(
                isToday
                    ? generateCurrentDayForecastText(from: day)
                    : generateOtherDayForecastText(for: day)
            )
            .font(.system(size: 14))
            .lineSpacing(3)
            .foregroundColor(.gray)
        }
        .offset(x: -2, y: -10)
    }


    @ViewBuilder
    private func forecastPrecipitationSection(for day: DayForecastItem) -> some View {
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        let dayName: String = {
            let formatter = DateFormatter()
            formatter.dateFormat = "EEEE"
            return formatter.string(from: day.date)
        }()
        let unit = GlobalState.precipitationUnitLabel
        let last24 = day.precipLast24h
        let total  = day.precipitationAmount
        let next24 = day.precipNext24h

        VStack(alignment: .leading, spacing: 5) {
            Text(
                NSLocalizedString(
                    isToday ? "Forecast_Title" : "DailySummary_Title",
                    comment: "Section header"
                )
            )
            .font(.system(size: 16, weight: .semibold))

            if isToday {
                Text(
                    String(
                        format: NSLocalizedString(
                            "ForecastPrecip_TodayFormat",
                            comment: "Detailed precipitation forecast for today"
                        ),
                        last24, unit,
                        total,  unit,
                        next24, unit
                    )
                )
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
            } else {
                Text(
                    String(
                        format: NSLocalizedString(
                            "ForecastPrecip_OtherDayFormat",
                            comment: "Precipitation forecast for another day"
                        ),
                        dayName,
                        total, unit
                    )
                )
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: -60)
    }


    @ViewBuilder
    private func forecastHumiditySection(for day: DayForecastItem) -> some View {
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        let dayName: String = {
            let fmt = DateFormatter()
            fmt.dateFormat = "EEEE"
            return fmt.string(from: day.date)
        }()
        let avgHumidity = Int(round(((day.humidityMin + day.humidityMax) / 2) * 100))
        let dewPointMin = Int(round(day.minTemp - ((100 - (day.humidityMin * 100)) / 5)))
        let dewPointMax = Int(round(day.maxTemp - ((100 - (day.humidityMax * 100)) / 5)))

        // избираме правилния формат за dew point
        let dewKey = isToday
            ? "DewPoint_CurrentFormat"
            : "DewPoint_FutureFormat"
        let dewText = String(
            format: NSLocalizedString(dewKey, comment: "Dew point sentence"),
            dewPointMin, dewPointMax
        )

        VStack(alignment: .leading, spacing: 5) {
            Text(NSLocalizedString(
                isToday ? "Forecast_Title" : "DailySummary_Title",
                comment: "Section title"
            ))
            .font(.system(size: 16, weight: .semibold))

            if isToday {
                Text(String(
                    format: NSLocalizedString("ForecastHumidity_Today", comment: "Today humidity summary"),
                    avgHumidity,
                    dewText
                ))
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
            } else {
                Text(String(
                    format: NSLocalizedString("ForecastHumidity_Other", comment: "Other day humidity summary"),
                    dayName,
                    avgHumidity,
                    dewText
                ))
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: -40)
    }
    
    @ViewBuilder
    private func forecastVisibilitySection(for day: DayForecastItem) -> some View {
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        let dayName: String = {
            let fmt = DateFormatter()
            fmt.dateFormat = "EEEE"
            return fmt.string(from: day.date)
        }()
        
        let unit = GlobalState.distanceUnitLabel
        let minVis = Int(round(day.visibilityMin))
        let maxVis = Int(round(day.visibilityMax))
        let avgVis = (minVis + maxVis) / 2
        let avgClarity = clarityDescription(for: avgVis)
        let minClarity = clarityDescription(for: minVis)
        let maxClarity = clarityDescription(for: maxVis)

        VStack(alignment: .leading, spacing: 5) {
            Text(isToday
                 ? NSLocalizedString("Section_Forecast", comment: "Forecast title")
                 : NSLocalizedString("Section_DailySummary", comment: "Daily Summary title"))
                .font(.system(size: 16, weight: .semibold))

            if isToday {
                Text(
                    String(
                        format: NSLocalizedString(
                            "ForecastVisibility_TodayFormat",
                            comment: "Today, the visibility will be %@, at %d to %d km."
                        ),
                        avgClarity,
                        minVis,
                        maxVis,
                        unit
                    )
                )
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
            } else {
                Text(
                    String(
                        format: NSLocalizedString(
                            "ForecastVisibility_OtherFormat",
                            comment: "On %@, the lowest visibility will be %@ at %d km, and the highest will be %@ at %d km."
                        ),
                        dayName,
                        minClarity,
                        minVis,
                        maxClarity,
                        maxVis,
                        unit
                    )
                )
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: 5)
    }


    // Помощна функция за описание на видимостта
    private func clarityDescription(for km: Int) -> String {
        let key: String
        switch km {
        case 0..<5:   key = "Clarity_Foggy"
        case 5..<15:  key = "Clarity_Hazy"
        case 15..<30: key = "Clarity_Clear"
        default:      key = "Clarity_PerfectlyClear"
        }
        return NSLocalizedString(key, comment: "Visibility clarity description")
    }

    @ViewBuilder
    private func aboutVisibilitySection() -> some View {
        let unit = GlobalState.distanceUnitLabel
        let clearVisibility = unit == NSLocalizedString("Unit_Distance_km", comment: "kilometers") ? "10 km" : "6.2 miles" // Ако е км, задаваме 10 км, ако е имперична система (мили), слагаме 6.2 мили

        VStack(alignment: .leading, spacing: 5) {
            Text(NSLocalizedString("AboutVisibility_Title", comment: "Section title for about visibility"))
                .font(.system(size: 16, weight: .semibold))
            Text(String(
                format: NSLocalizedString("AboutVisibility_Body", comment: "Detailed explanation of visibility"),
                clearVisibility
            ))
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: 15)
    }

    func formatPressure(_ value: Double) -> String {
        if GlobalState.measurementSystem == "Imperial" {
            return String(format: "%.2f", value)
        } else {
            return String(format: "%.0f", value) 
        }
    }
    
    @ViewBuilder
    private func forecastPressureSection(for day: DayForecastItem) -> some View {
        // Определяме дали денят е днешният
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        
        // Извличаме почасовите стойности за налягането (в hPa)
        let pressureValues = hourlyItemsForSelectedDate.map { $0.pressure }
        
        // Изчисляваме средното налягане (ако има данни, иначе fallback)
        let avgPressure: Double = {
            guard !pressureValues.isEmpty else { return 1013 }
            return pressureValues.reduce(0, +) / Double(pressureValues.count)
        }()
        
        // Извличаме минималното налягане (или fallback)
        let minPressure: Double = {
            guard let minVal = pressureValues.min() else { return 1013 }
            return minVal
        }()
        
        // Името на деня (например "Saturday")
        let weekday: String = {
            let formatter = DateFormatter()
            formatter.dateFormat = "EEEE"
            return formatter.string(from: day.date)
        }()
        
        // Получаваме единицата за налягане
        let unit = GlobalState.pressureUnitLabel
        
        VStack(alignment: .leading, spacing: 5) {
            // Заглавие: "Forecast" или "Daily Summary"
            Text(
                NSLocalizedString(
                    isToday ? "SectionForecast" : "SectionDailySummary",
                    comment: ""
                )
            )
            .font(.system(size: 16, weight: .semibold))
            
            if isToday {
                // Днешна прогноза
                let currentPressure = vm.currentPressure ?? avgPressure
                Text(
                    String(
                        format: NSLocalizedString("PressureForecast_Today", comment: ""),
                        formatPressure(currentPressure),// Използваме новата функция
                        unit,
                        formatPressure(avgPressure), // Използваме новата функция
                        unit,
                        formatPressure(minPressure), // Използваме новата функция
                        unit // Добавяме единицата за налягането
                    )
                )
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
                .multilineTextAlignment(.leading)
            } else {
                // Прогноза за бъдещ/минал ден
                Text(
                    String(
                        format: NSLocalizedString("PressureForecast_Other", comment: ""),
                        weekday,
                        formatPressure(avgPressure), // Използваме новата функция
                        unit,
                        formatPressure(minPressure), // Използваме новата функция
                        unit // Добавяме единицата за налягането
                    )
                )
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
        VStack(alignment: .leading, spacing: 5) {
            Text(NSLocalizedString("AboutPressure_Title", comment: "Section title for pressure info"))
                .font(.system(size: 16, weight: .semibold))
            Text(NSLocalizedString("AboutPressure_Body", comment: "Body text for pressure info"))
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: 15)
    }

    @ViewBuilder
    private func aboutHumiditySection() -> some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(NSLocalizedString("AboutHumidity_Title", comment: "Section title for relative humidity info"))
                .font(.system(size: 16, weight: .semibold))
            Text(NSLocalizedString("AboutHumidity_Body", comment: "Body text for relative humidity info"))
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: -40)
    }

    @ViewBuilder
    private func aboutDewPointSection() -> some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(NSLocalizedString("AboutDewPoint_Title", comment: "Section title for dew point info"))
                .font(.system(size: 16, weight: .semibold))
            Text(NSLocalizedString("AboutDewPoint_Body", comment: "Body text explaining dew point"))
                .font(.system(size: 14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: -40)
    }
    
    @ViewBuilder
    private func aboutPrecipitationSection() -> some View {
        VStack(alignment:.leading, spacing:5) {
            Text(NSLocalizedString("AboutPrecipitation_Title",
                                   comment: "Section header for precipitation intensity"))
                .font(.system(size:16, weight:.semibold))

            Text(NSLocalizedString("AboutPrecipitation_Body",
                                   comment: "Full description of how precipitation intensity is calculated"))
                .font(.system(size:14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .offset(x: 4, y: -60)
    }

    
    @ViewBuilder
    private func forecastWindSection(for day: DayForecastItem) -> some View {
        // Изчисляваме скоростите от почасовата прогноза за избрания ден
        let speeds: [Double] = hourlyItemsForSelectedDate.map { $0.windSpeed }
        // Определяме дали денят от day е текущ (днес)
        let isToday = Calendar.current.isDate(day.date, inSameDayAs: Date())
        
        VStack(alignment: .leading, spacing: 5) {
            Text(NSLocalizedString(Calendar.current.isDate(day.date, inSameDayAs: Date()) ? "Forecast" : "Daily Summary", comment: "Wind forecast section title"))
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
    
    let beaufortRangesKmH: [String: String] = [
        "BeaufortRange_0": "< 2",
        "BeaufortRange_1": "2 – 5",
        "BeaufortRange_2": "6 – 11",
        "BeaufortRange_3": "12 – 19",
        "BeaufortRange_4": "20 – 28",
        "BeaufortRange_5": "29 – 38",
        "BeaufortRange_6": "39 – 49",
        "BeaufortRange_7": "50 – 61",
        "BeaufortRange_8": "62 – 74",
        "BeaufortRange_9": "75 – 88",
        "BeaufortRange_10": "89 – 102",
        "BeaufortRange_11": "103 – 117",
        "BeaufortRange_12": "> 118"
    ]
    
    let beaufortRangesMph: [String: String] = [
        "BeaufortRange_0": "< 1",
        "BeaufortRange_1": "1 – 3",
        "BeaufortRange_2": "4 – 7",
        "BeaufortRange_3": "7 – 12",
        "BeaufortRange_4": "12 – 17",
        "BeaufortRange_5": "18 – 24",
        "BeaufortRange_6": "24 – 30",
        "BeaufortRange_7": "31 – 38",
        "BeaufortRange_8": "39 – 46",
        "BeaufortRange_9": "47 – 55",
        "BeaufortRange_10": "55 – 63",
        "BeaufortRange_11": "64 – 73",
        "BeaufortRange_12": "> 73"
    ]

    
    @ViewBuilder
    private func windTableSection() -> some View {
        // MARK: Beaufort Data
        let beaufortData: [BeaufortScaleItem] = [
            .init(bft: 0,
                  description: NSLocalizedString("Beaufort_0", comment: "Calm"),
                  kmhRange: NSLocalizedString("BeaufortRange_0", comment: "< 2")),
            .init(bft: 1,
                  description: NSLocalizedString("Beaufort_1", comment: "Light air"),
                  kmhRange: NSLocalizedString("BeaufortRange_1", comment: "2 – 5")),
            .init(bft: 2,
                  description: NSLocalizedString("Beaufort_2", comment: "Light breeze"),
                  kmhRange: NSLocalizedString("BeaufortRange_2", comment: "6 – 11")),
            .init(bft: 3,
                  description: NSLocalizedString("Beaufort_3", comment: "Gentle breeze"),
                  kmhRange: NSLocalizedString("BeaufortRange_3", comment: "12 – 19")),
            .init(bft: 4,
                  description: NSLocalizedString("Beaufort_4", comment: "Moderate breeze"),
                  kmhRange: NSLocalizedString("BeaufortRange_4", comment: "20 – 28")),
            .init(bft: 5,
                  description: NSLocalizedString("Beaufort_5", comment: "Fresh breeze"),
                  kmhRange: NSLocalizedString("BeaufortRange_5", comment: "29 – 38")),
            .init(bft: 6,
                  description: NSLocalizedString("Beaufort_6", comment: "Strong breeze"),
                  kmhRange: NSLocalizedString("BeaufortRange_6", comment: "39 – 49")),
            .init(bft: 7,
                  description: NSLocalizedString("Beaufort_7", comment: "High wind"),
                  kmhRange: NSLocalizedString("BeaufortRange_7", comment: "50 – 61")),
            .init(bft: 8,
                  description: NSLocalizedString("Beaufort_8", comment: "Gale"),
                  kmhRange: NSLocalizedString("BeaufortRange_8", comment: "62 – 74")),
            .init(bft: 9,
                  description: NSLocalizedString("Beaufort_9", comment: "Strong gale"),
                  kmhRange: NSLocalizedString("BeaufortRange_9", comment: "75 – 88")),
            .init(bft: 10,
                  description: NSLocalizedString("Beaufort_10", comment: "Storm"),
                  kmhRange: NSLocalizedString("BeaufortRange_10", comment: "89 – 102")),
            .init(bft: 11,
                  description: NSLocalizedString("Beaufort_11", comment: "Violent storm"),
                  kmhRange: NSLocalizedString("BeaufortRange_11", comment: "103 – 117")),
            .init(bft: 12,
                  description: NSLocalizedString("Beaufort_12", comment: "Hurricane-force"),
                  kmhRange: NSLocalizedString("BeaufortRange_12", comment: "> 118"))
        ]

        // Dynamically select the appropriate range (km/h or mph) based on measurement system
        let beaufortRanges = GlobalState.measurementSystem == "Imperial" ? beaufortRangesMph : beaufortRangesKmH

        VStack(alignment: .leading, spacing: 5) {
            // Main Header
            Text(NSLocalizedString("Beaufort_Scale", comment: "Beaufort Scale title"))
                .font(.system(size: 16, weight: .semibold))
                .offset(y: -5)
                .frame(maxWidth: .infinity, alignment: .leading)

            // Column Headers
            HStack(spacing: 12) {
                Text(NSLocalizedString("Beaufort_Column_bft", comment: "BFT column header"))
                    .font(.system(size: 13, weight: .medium))
                    .frame(width: 20, alignment: .leading)
                    .offset(x: 19)
                Text(NSLocalizedString("Beaufort_Column_Description", comment: "Description column header"))
                    .font(.system(size: 13, weight: .medium))
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .offset(x: 20)
                Text(GlobalState.speedUnitLabel)
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
                let progress = Double(item.bft) / 12.0
                let circleColor = gradientColor(for: progress)

                VStack(spacing: 0) {
                    HStack(spacing: 12) {
                        Circle()
                            .fill(circleColor)
                            .frame(width: 10, height: 10)

                        Text("\(item.bft)")
                            .frame(width: 20, alignment: .leading)

                        Text(item.description)
                            .frame(maxWidth: .infinity, alignment: .leading)

                        // Use the selected range from beaufortRanges (km/h or mph)
                        Text(beaufortRanges["BeaufortRange_\(item.bft)"] ?? "")
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
            Text(NSLocalizedString("About Feels Like Temperature", comment: "Feels like info title"))
                .font(.system(size:16, weight:.semibold))
            Text(NSLocalizedString("Feels Like conveys how warm or cold it feels and can be different from the actual temperature. The Feels Like temperature is affected by humidity, sunlight and wind.", comment: "Feels like info body"))
                .font(.system(size:14))
                .lineSpacing(3)
                .foregroundColor(.gray)
        }
        .offset(x: -4, y:-10)
    }
    
    private var optionsSection: some View {
        VStack(alignment:.leading, spacing:10) {
            Text(NSLocalizedString("Options", comment: "Weather options section title"))
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
                    Text(NSLocalizedString(label, comment: "Weather option label"))
                        .font(.system(size:14))
                    Spacer()
                    Text(NSLocalizedString(value, comment: "Weather option value"))
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
    var customCalendar: Calendar {
           var cal = Calendar.current
           cal.timeZone = vm.locationTimeZone // Използва избраната от потребителя зона
           return cal
       }
     
     private func weekdayString(from date: Date) -> String {
         let formatter = DateFormatter()
         formatter.dateFormat = "E"
         formatter.timeZone = vm.locationTimeZone
         return formatter.string(from: date)
     }
     
     // Пример за изчисление на fractionOfDay в графичните функции
     func fractionOfDay(for date: Date) -> TimeInterval {
         let startOfDay = customCalendar.startOfDay(for: date)
         return Date().timeIntervalSince(startOfDay) / (24 * 3600)
     }
}
