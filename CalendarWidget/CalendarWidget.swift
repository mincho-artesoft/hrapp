import SwiftUI
import WidgetKit

private enum WidgetSharedStore {
    static let appGroupID = "group.ARTE-SOFT.sandBOX"
    static let kind = "CalendarIconWidget"
    static let classicKind = "CalendarIconWidgetClassic"

    private enum Key {
        static let weatherSymbol = "calendarWidget.weatherSymbol"
        static let weatherCondition = "calendarWidget.weatherCondition"
        static let temperature = "calendarWidget.temperature"
        static let temperatureUnit = "calendarWidget.temperatureUnit"
        static let windDirectionDegrees = "calendarWidget.windDirectionDegrees"
        static let windDirectionText = "calendarWidget.windDirectionText"
        static let windSpeed = "calendarWidget.windSpeed"
        static let windSpeedUnit = "calendarWidget.windSpeedUnit"
        static let moonPhaseAssetName = "calendarWidget.moonPhaseAssetName"
        static let moonPhaseDescription = "calendarWidget.moonPhaseDescription"
        static let upcomingEvents = "calendarWidget.upcomingEvents"
        static let region = "calendarWidget.global.region"
        static let calendar = "calendarWidget.global.calendar"
        static let measurementSystem = "calendarWidget.global.measurementSystem"
        static let firstWeekday = "calendarWidget.global.firstWeekday"
        static let dateFormat = "calendarWidget.global.dateFormat"
        static let numberFormat = "calendarWidget.global.numberFormat"
    }

    static func snapshot() -> WeatherSnapshot {
        let defaults = UserDefaults(suiteName: appGroupID)
        let storedUnit = defaults?.string(forKey: Key.temperatureUnit)

        return WeatherSnapshot(
            symbol: defaults?.string(forKey: Key.weatherSymbol) ?? "cloud.sun.rain",
            condition: defaults?.string(forKey: Key.weatherCondition) ?? "",
            temperature: defaults?.object(forKey: Key.temperature) as? Double,
            isFahrenheit: storedUnit == UnitTemperature.fahrenheit.symbol,
            windDirectionDegrees: defaults?.object(forKey: Key.windDirectionDegrees) as? Double,
            windDirectionText: defaults?.string(forKey: Key.windDirectionText) ?? "-",
            windSpeed: defaults?.object(forKey: Key.windSpeed) as? Double,
            windSpeedUnit: defaults?.string(forKey: Key.windSpeedUnit) ?? "",
            moonPhaseAssetName: defaults?.string(forKey: Key.moonPhaseAssetName) ?? "phase_full",
            moonPhaseDescription: defaults?.string(forKey: Key.moonPhaseDescription) ?? "Moon"
        )
    }

    static func globalSettings() -> GlobalSettingsSnapshot {
        let defaults = UserDefaults(suiteName: appGroupID)

        return GlobalSettingsSnapshot(
            region: defaults?.string(forKey: Key.region) ?? "",
            calendarIdentifier: defaults?.string(forKey: Key.calendar) ?? "",
            temperatureUnit: defaults?.string(forKey: Key.temperatureUnit) ?? "",
            measurementSystem: defaults?.string(forKey: Key.measurementSystem) ?? "",
            firstWeekday: defaults?.integer(forKey: Key.firstWeekday) ?? Calendar.current.firstWeekday,
            dateFormat: defaults?.string(forKey: Key.dateFormat) ?? "",
            numberFormat: defaults?.string(forKey: Key.numberFormat) ?? ""
        )
    }

    static func upcomingEvents() -> [CalendarWidgetUpcomingEvent] {
        guard
            let data = UserDefaults(suiteName: appGroupID)?.data(forKey: Key.upcomingEvents),
            let events = try? JSONDecoder().decode([CalendarWidgetUpcomingEvent].self, from: data)
        else {
            return []
        }

        return events
    }
}

private struct WeatherSnapshot {
    let symbol: String
    let condition: String
    let temperature: Double?
    let isFahrenheit: Bool
    let windDirectionDegrees: Double?
    let windDirectionText: String
    let windSpeed: Double?
    let windSpeedUnit: String
    let moonPhaseAssetName: String
    let moonPhaseDescription: String
}

private struct GlobalSettingsSnapshot {
    let region: String
    let calendarIdentifier: String
    let temperatureUnit: String
    let measurementSystem: String
    let firstWeekday: Int
    let dateFormat: String
    let numberFormat: String
}

private struct CalendarWidgetUpcomingEvent: Codable, Identifiable {
    let id: String
    let title: String
    let startDate: Date
    let endDate: Date
    let isAllDay: Bool
    let colorRed: Double
    let colorGreen: Double
    let colorBlue: Double
    let colorAlpha: Double

    var tintColor: Color {
        Color(red: colorRed, green: colorGreen, blue: colorBlue, opacity: colorAlpha)
    }
}

private struct CalendarWidgetTriangleArrow: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

private struct CalendarIconEntry: TimelineEntry {
    let date: Date
    let weather: WeatherSnapshot
    let settings: GlobalSettingsSnapshot
    let events: [CalendarWidgetUpcomingEvent]

    static let preview = CalendarIconEntry(
        date: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 1, hour: 12)) ?? Date(),
        weather: WeatherSnapshot(
            symbol: "cloud.sun.rain",
            condition: "Partly Cloudy",
            temperature: 22,
            isFahrenheit: false,
            windDirectionDegrees: 45,
            windDirectionText: "NE",
            windSpeed: 12,
            windSpeedUnit: "km/h",
            moonPhaseAssetName: "phase_waxing_gibbous",
            moonPhaseDescription: "Waxing Gibbous"
        ),
        settings: GlobalSettingsSnapshot(
            region: "US",
            calendarIdentifier: "gregorian",
            temperatureUnit: UnitTemperature.celsius.symbol,
            measurementSystem: "Metric",
            firstWeekday: 1,
            dateFormat: "M/d/yy",
            numberFormat: "1,234,567.89"
        ),
        events: [
            CalendarWidgetUpcomingEvent(id: "1", title: "Team standup", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 1, hour: 9, minute: 30)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 1, hour: 10)) ?? Date(), isAllDay: false, colorRed: 0.16, colorGreen: 0.58, colorBlue: 0.95, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "2", title: "Product review", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 1, hour: 11)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 1, hour: 12)) ?? Date(), isAllDay: false, colorRed: 0.95, colorGreen: 0.42, colorBlue: 0.35, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "3", title: "Lunch with Alex", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 1, hour: 13)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 1, hour: 14)) ?? Date(), isAllDay: false, colorRed: 0.47, colorGreen: 0.80, colorBlue: 0.40, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "4", title: "Design sync", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 1, hour: 15, minute: 30)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 1, hour: 16)) ?? Date(), isAllDay: false, colorRed: 0.72, colorGreen: 0.54, colorBlue: 0.98, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "5", title: "Release prep", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 2, hour: 10)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 2, hour: 11)) ?? Date(), isAllDay: false, colorRed: 1.00, colorGreen: 0.74, colorBlue: 0.20, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "6", title: "Family dinner", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 2, hour: 19)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 2, hour: 21)) ?? Date(), isAllDay: false, colorRed: 0.25, colorGreen: 0.84, colorBlue: 0.76, colorAlpha: 1)
        ]
    )
}

private struct CalendarIconProvider: TimelineProvider {
    func placeholder(in context: Context) -> CalendarIconEntry {
        .preview
    }

    func getSnapshot(in context: Context, completion: @escaping (CalendarIconEntry) -> Void) {
        completion(CalendarIconEntry(date: Date(), weather: WidgetSharedStore.snapshot(), settings: WidgetSharedStore.globalSettings(), events: WidgetSharedStore.upcomingEvents()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CalendarIconEntry>) -> Void) {
        let now = Date()
        let settings = WidgetSharedStore.globalSettings()
        let entry = CalendarIconEntry(date: now, weather: WidgetSharedStore.snapshot(), settings: settings, events: WidgetSharedStore.upcomingEvents())
        let nextRefresh = Calendar.current.date(byAdding: .minute, value: 15, to: now) ?? now.addingTimeInterval(900)
        completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
    }
}

private enum CalendarMediumLayout {
    case grid
    case classic
}

private struct CalendarIconWidgetView: View {
    @Environment(\.widgetFamily) private var family

    let entry: CalendarIconEntry
    let mediumLayout: CalendarMediumLayout

    init(entry: CalendarIconEntry, mediumLayout: CalendarMediumLayout = .grid) {
        self.entry = entry
        self.mediumLayout = mediumLayout
    }

    private var calendar: Calendar {
        var calendar = Calendar(identifier: calendarIdentifier(from: entry.settings.calendarIdentifier))
        calendar.locale = widgetLocale
        calendar.timeZone = .autoupdatingCurrent

        if (1...7).contains(entry.settings.firstWeekday) {
            calendar.firstWeekday = entry.settings.firstWeekday
        }

        return calendar
    }

    private var widgetLocale: Locale {
        let region = entry.settings.region.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !region.isEmpty else {
            return Locale.autoupdatingCurrent
        }

        let languageCode = Locale.autoupdatingCurrent.languageCode ?? "en"
        return Locale(identifier: "\(languageCode)_\(region)")
    }

    private var monthText: String {
        formattedDate(entry.date, format: "MMM").uppercased()
    }

    private var weekdayText: String {
        formattedDate(entry.date, format: "EEE").uppercased()
    }

    private var dayText: String {
        String(calendar.component(.day, from: entry.date))
    }

    private var temperatureText: String? {
        guard let temperature = entry.weather.temperature else {
            return nil
        }
        return "\(roundedNumberText(temperature))°"
    }

    var body: some View {
        Group {
            switch family {
            case .systemMedium:
                mediumBody
            default:
                smallBody
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .containerBackground(for: .widget) {
            widgetBackground
        }
    }

    private var smallBody: some View {
        VStack(spacing: 0) {
            // Горна част: Месец/Ден от седмицата и Времето с температурата
            HStack(alignment: .top) {
                // Лява колона
                VStack(alignment: .center, spacing: 2) {
                    Text(monthText)
                        .font(.system(size: 24, weight: .regular))
                        .minimumScaleFactor(0.8)

                    Text(weekdayText)
                        .font(.system(size: 24, weight: .regular))
                        .minimumScaleFactor(0.8)
                }
                .foregroundStyle(iconTextColor)
                .lineLimit(1)
                .frame(width: 82, alignment: .center)
                .frame(maxHeight: .infinity, alignment: .center) // Разтяга колоната до максималната налична височина

                Spacer()

                // Дясна колона
                VStack(alignment: .center, spacing: 2) {
                    Image(systemName: normalizedSymbol(entry.weather.symbol))
                        .symbolVariant(.fill)
                        .symbolRenderingMode(.multicolor)
                        .font(.system(size: 34, weight: .regular))
                        .minimumScaleFactor(0.8)

                    if let temperatureText {
                        Text(temperatureText)
                            .font(.system(size: 12, weight: .regular))
                            .foregroundStyle(iconTextColor)
                            .lineLimit(1)
                            .minimumScaleFactor(0.8)
                    }
                }
                .frame(maxHeight: .infinity) // Разтяга и тази колона до същата височина
            }
            .frame(height: 60) // Задава се фиксирана обща височина на целия ред
            .padding(.top, 10)
            .padding(.horizontal, 10)

            // Долна част: Голямото число за деня
            HStack {
                Spacer()
                Text(dayText)
                    .font(.system(size: 80, weight: .regular))
                    .foregroundStyle(iconTextColor)
                    .lineLimit(1)
                    .minimumScaleFactor(0.8)

                Spacer()
            }
            .padding(.bottom, 10)
        }
    }

    @ViewBuilder
    private var mediumBody: some View {
        switch mediumLayout {
        case .grid:
            mediumGridBody
        case .classic:
            mediumClassicBody
        }
    }

    private var mediumGridBody: some View {
        GeometryReader { geometry in
            let verticalInset: CGFloat = 0
            let horizontalInset: CGFloat = 0
            let rowSpacing = verticalInset
            let columnSpacing: CGFloat = 10
            let cellWidth = max(CGFloat(1), (geometry.size.width - (horizontalInset * 2) - (columnSpacing * 2)) / 3)
            let cellHeight = max(CGFloat(1), (geometry.size.height - (verticalInset * 2) - rowSpacing) / 2)

            VStack(spacing: rowSpacing) {
                HStack(spacing: columnSpacing) {
                    mediumDateView
                        .frame(width: cellWidth, height: cellHeight)
                    mediumWeatherView
                        .frame(width: cellWidth, height: cellHeight)
                    mediumMetricView(
                        value: shortMoonPhaseText,
                        imageName: entry.weather.moonPhaseAssetName
                    )
                    .frame(width: cellWidth, height: cellHeight)
                }

                HStack(spacing: columnSpacing) {
                    mediumDayView
                        .frame(width: cellWidth, height: cellHeight)
                    mediumTemperatureView
                        .frame(width: cellWidth, height: cellHeight)
                    mediumWindView
                        .frame(width: cellWidth, height: cellHeight)
                }
            }
            .padding(.vertical, verticalInset)
            .padding(.horizontal, horizontalInset)
        }
    }

    private var mediumClassicBody: some View {
        GeometryReader { geometry in
            let iconWidth = geometry.size.width * 0.4
            let listWidth = geometry.size.width * 0.6

            HStack(alignment: .center, spacing: 0) {
                smallBody
//                    .padding(.leading, 16)
//                    .padding(.trailing, 8)
                    .frame(width: iconWidth)
                    .frame(maxHeight: .infinity)

                mediumClassicEventsList
//                    .padding(.leading, 8)
                    .padding(.trailing, 16)
//                    .padding(.vertical, 8)
                    .frame(width: listWidth)
                    .frame(maxHeight: .infinity, alignment: .center)
            }
//            .padding(.vertical, 7)
        }
    }

    @ViewBuilder
    private var mediumClassicEventsList: some View {
        let events = Array(entry.events.prefix(6))

        if events.isEmpty {
            VStack(alignment: .leading, spacing: 4) {
                Text(NSLocalizedString("No upcoming events", comment: "Widget empty events state"))
                    .font(.system(size: 15, weight: .medium))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
                Text(NSLocalizedString("Calendar", comment: "Calendar label"))
                    .font(.system(size: 11, weight: .regular))
                    .opacity(0.78)
                    .lineLimit(1)
            }
            .foregroundStyle(iconTextColor)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
        } else {
            VStack(alignment: .leading, spacing: 3) {
                ForEach(events) { event in
                    mediumClassicEventRow(event)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
        }
    }

    private func mediumClassicEventRow(_ event: CalendarWidgetUpcomingEvent) -> some View {
        HStack(alignment: .center, spacing: 6) {
            Capsule()
                .fill(event.tintColor)
                .frame(width: 3, height: 15)

            VStack(alignment: .leading, spacing: 0) {
                Text(event.title.isEmpty ? NSLocalizedString("Untitled", comment: "Fallback event title") : event.title)
                    .font(.system(size: 11, weight: .medium))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)

                Text(eventScheduleText(event))
                    .font(.system(size: 9, weight: .regular))
                    .lineLimit(1)
                    .minimumScaleFactor(0.65)
                    .opacity(0.78)
            }
        }
        .foregroundStyle(iconTextColor)
        .frame(height: 16)
    }

    private func eventScheduleText(_ event: CalendarWidgetUpcomingEvent) -> String {
        let endDate = eventDisplayEndDate(event)
        let isMultiDay = !calendar.isDate(event.startDate, inSameDayAs: endDate)

        if event.isAllDay {
            if isMultiDay {
                return "\(shortDateText(event.startDate)) - \(shortDateText(endDate)), \(NSLocalizedString("all-day", comment: ""))"
            }

            return "\(shortDateText(event.startDate)), \(NSLocalizedString("all-day", comment: ""))"
        }

        if isMultiDay {
            return "\(shortDateText(event.startDate)) \(shortTimeText(event.startDate)) - \(shortDateText(endDate)) \(shortTimeText(endDate))"
        }

        return "\(shortDateText(event.startDate)), \(shortTimeText(event.startDate))-\(shortTimeText(endDate))"
    }

    private func shortDateText(_ date: Date) -> String {
        if calendar.isDateInToday(date) {
            return NSLocalizedString("Today", comment: "")
        }

        if calendar.isDateInTomorrow(date) {
            return NSLocalizedString("Tomorrow", comment: "")
        }

        let dateFormat = entry.settings.dateFormat.trimmingCharacters(in: .whitespacesAndNewlines)
        return formattedDate(date, format: dateFormat.isEmpty ? "EEE d MMM" : dateFormat)
    }

    private func shortTimeText(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = calendar
        formatter.locale = widgetLocale
        formatter.timeZone = .autoupdatingCurrent
        formatter.timeStyle = .short
        formatter.dateStyle = .none
        return formatter.string(from: date)
    }

    private func eventDisplayEndDate(_ event: CalendarWidgetUpcomingEvent) -> Date {
        guard event.isAllDay else {
            return event.endDate
        }

        return event.endDate.addingTimeInterval(-1)
    }

    private var shortMoonPhaseText: String {
        let text = entry.weather.moonPhaseDescription
        return text == "Moon" ? NSLocalizedString("Phase", comment: "Moon phase fallback label") : text
    }

    private var windSpeedText: String {
        guard let windSpeed = entry.weather.windSpeed else {
            return "--"
        }

        return "\(roundedNumberText(windSpeed)) \(windSpeedUnitText)"
    }

    private var windArrowRotation: Angle {
        Angle(degrees: entry.weather.windDirectionDegrees ?? 0)
    }

    private var windSpeedUnitText: String {
        if !entry.weather.windSpeedUnit.isEmpty {
            return entry.weather.windSpeedUnit
        }

        return entry.settings.measurementSystem == "Imperial" ? "mph" : "km/h"
    }

    private func formattedDate(_ date: Date, format: String) -> String {
        let formatter = DateFormatter()
        formatter.calendar = calendar
        formatter.locale = widgetLocale
        formatter.timeZone = .autoupdatingCurrent
        formatter.dateFormat = format
        return formatter.string(from: date)
    }

    private func roundedNumberText(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.locale = widgetLocale
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 0
        formatter.minimumFractionDigits = 0

        let separators = numberSeparators(from: entry.settings.numberFormat)
        formatter.decimalSeparator = separators.decimal ?? formatter.decimalSeparator
        formatter.groupingSeparator = separators.grouping ?? formatter.groupingSeparator

        return formatter.string(from: NSNumber(value: value.rounded())) ?? "\(Int(value.rounded()))"
    }

    private func numberSeparators(from sample: String) -> (grouping: String?, decimal: String?) {
        let separators = sample.filter { !$0.isNumber }
        guard !separators.isEmpty else {
            return (nil, nil)
        }

        let decimal = separators.last.map(String.init)
        let grouping = separators.dropLast().first.map(String.init)
        return (grouping, decimal)
    }

    private func calendarIdentifier(from value: String) -> Calendar.Identifier {
        switch value.lowercased() {
        case "buddhist": return .buddhist
        case "chinese": return .chinese
        case "coptic": return .coptic
        case "ethiopicametealem": return .ethiopicAmeteAlem
        case "ethiopicametemihret": return .ethiopicAmeteMihret
        case "hebrew": return .hebrew
        case "indian": return .indian
        case "islamic": return .islamic
        case "islamiccivil": return .islamicCivil
        case "islamictabular": return .islamicTabular
        case "islamicummalqura": return .islamicUmmAlQura
        case "iso8601": return .iso8601
        case "japanese": return .japanese
        case "persian": return .persian
        case "republicofchina": return .republicOfChina
        default: return .gregorian
        }
    }

    private var mediumWeatherView: some View {
        mediumGridCell {
            VStack(spacing: 3) {
                Image(systemName: normalizedSymbol(entry.weather.symbol))
                    .symbolVariant(.fill)
                    .symbolRenderingMode(.multicolor)
                    .font(.system(size: 32, weight: .regular))
                    .frame(width: 50, height: 42, alignment: .center)

                mediumCaptionText(entry.weather.condition.isEmpty ? NSLocalizedString("Weather", comment: "Weather fallback label") : entry.weather.condition)
            }
        }
    }

    private var mediumTemperatureView: some View {
        mediumGridCell {
            Text(temperatureText ?? "--°")
                .font(.system(size: 48, weight: .regular))
                .foregroundStyle(iconTextColor)
                .lineLimit(1)
                .minimumScaleFactor(0.65)
        }
    }

    private var mediumDayView: some View {
        mediumGridCell {
            Text(dayText)
                .font(.system(size: 52, weight: .regular))
                .foregroundStyle(iconTextColor)
                .lineLimit(1)
                .minimumScaleFactor(0.65)
        }
    }

    private var mediumWindView: some View {
        mediumGridCell {
            mediumWindCompass

            mediumCaptionText("\(entry.weather.windDirectionText) \(windSpeedText)")
        }
    }

    private var mediumWindCompass: some View {
        let compassSize: CGFloat = 48
        let letterOffset: CGFloat = compassSize / 2 - 2

        return ZStack {
            ForEach(0..<60) { i in
                let isMajor = i % 5 == 0
                Rectangle()
                    .fill(iconTextColor.opacity(isMajor ? 0.62 : 0.36))
                    .frame(width: 1, height: isMajor ? 4 : 2.5)
                    .offset(y: -(compassSize / 2 - 5))
                    .rotationEffect(.degrees(Double(i) * 6))
            }

            Text("N")
                .font(.system(size: 8, weight: .medium))
                .foregroundStyle(iconTextColor.opacity(0.82))
                .offset(y: -letterOffset)
            Text("S")
                .font(.system(size: 8, weight: .medium))
                .foregroundStyle(iconTextColor.opacity(0.82))
                .offset(y: letterOffset)
            Text("W")
                .font(.system(size: 8, weight: .medium))
                .foregroundStyle(iconTextColor.opacity(0.82))
                .offset(x: -letterOffset)
            Text("E")
                .font(.system(size: 8, weight: .medium))
                .foregroundStyle(iconTextColor.opacity(0.82))
                .offset(x: letterOffset)

            Group {
                Capsule()
                    .fill(Color.white)
                    .frame(width: 2, height: compassSize * 0.22)
                Circle()
                    .fill(Color.white)
                    .frame(width: 8, height: 8)
                    .offset(y: -(compassSize * 0.11 + 4))
            }
            .offset(y: -compassSize * 0.14)
            .rotationEffect(windArrowRotation)

            Group {
                Capsule()
                    .fill(Color.white)
                    .frame(width: 2, height: compassSize * 0.22)
                CalendarWidgetTriangleArrow()
                    .fill(Color.white)
                    .frame(width: 9, height: 9)
                    .offset(y: -(compassSize * 0.11 + 4))
            }
            .offset(y: -compassSize * 0.14)
            .rotationEffect(windArrowRotation + .degrees(180))

            Circle()
                .fill(iconBlue.opacity(0.62))
                .frame(width: compassSize * 0.34, height: compassSize * 0.34)
        }
        .frame(width: compassSize, height: compassSize)
    }

    private func mediumMetricView(value: String, imageName: String) -> some View {
        mediumGridCell {
            VStack(spacing: 3) {
                Image(imageName)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 50, height: 42, alignment: .center)

                mediumCaptionText(value)
            }
        }
    }

    private func mediumCaptionText(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 11, weight: .regular))
            .foregroundStyle(iconTextColor)
            .lineLimit(1)
            .frame(height: 13, alignment: .top)
            .frame(maxWidth: .infinity, alignment: .center)
    }

    private var mediumDateView: some View {
        mediumGridCell {
            VStack(spacing: 0) {
                Text(monthText)
                    .font(.system(size: 25, weight: .regular))
                    .foregroundStyle(iconTextColor)
                    .lineLimit(1)
                    .minimumScaleFactor(0.65)

                Text(weekdayText)
                    .font(.system(size: 25, weight: .regular))
                    .foregroundStyle(iconTextColor)
                    .lineLimit(1)
                    .minimumScaleFactor(0.65)
            }
        }
    }

    private func mediumGridCell<Content: View>(@ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .center, spacing: 3) {
            content()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .clipped()
    }

    private var widgetBackground: some View {
        iconBlue
    }

    private var iconBlue: Color {
        Color(red: 20/255, green: 109/255, blue: 179/255)
    }

    private var iconTextColor: Color {
        Color(red: 255/255, green: 248/255, blue: 231/255)
    }

    private func normalizedSymbol(_ symbol: String) -> String {
        let cleanSymbol = symbol.replacingOccurrences(of: ".fill", with: "")
        return cleanSymbol.isEmpty ? "sun.max" : cleanSymbol
    }
}

@main
struct CalendarWidgetBundle: WidgetBundle {
    var body: some Widget {
        CalendarIconWidget()
        CalendarIconClassicWidget()
    }
}

struct CalendarIconWidget: Widget {
    let kind = WidgetSharedStore.kind

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CalendarIconProvider()) { entry in
            CalendarIconWidgetView(entry: entry)
        }
        .configurationDisplayName("Calendar & Weather")
        .description("Small shows today's date and current weather. Medium adds moon phase and wind.")
        .supportedFamilies([.systemSmall, .systemMedium])
        .contentMarginsDisabled()
    }
}

struct CalendarIconClassicWidget: Widget {
    let kind = WidgetSharedStore.classicKind

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CalendarIconProvider()) { entry in
            CalendarIconWidgetView(entry: entry, mediumLayout: .classic)
        }
        .configurationDisplayName("Calendar Events")
        .description("Shows today's date, current weather, and your next calendar events.")
        .supportedFamilies([.systemMedium])
        .contentMarginsDisabled()
    }
}

#Preview("Calendar & Weather / Small", as: .systemSmall) {
    CalendarIconWidget()
} timeline: {
    CalendarIconEntry.preview
}

#Preview("Calendar & Weather / Medium", as: .systemMedium) {
    CalendarIconWidget()
} timeline: {
    CalendarIconEntry.preview
}

#Preview("Calendar Events / Medium", as: .systemMedium) {
    CalendarIconClassicWidget()
} timeline: {
    CalendarIconEntry.preview
}
