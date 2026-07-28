import SwiftUI
import WidgetKit

private enum WidgetSharedStore {
    static let appGroupID = "group.ARTE-SOFT.sandBOX"
    static let kind = "CalendarIconWidget"
    static let classicKind = "CalendarIconWidgetClassic"
    static let largeEventsKind = "CalendarIconWidgetLargeEvents"

    private enum Key {
        static let weatherSymbol = "calendarWidget.weatherSymbol"
        static let weatherCondition = "calendarWidget.weatherCondition"
        static let temperature = "calendarWidget.temperature"
        static let temperatureUnit = "calendarWidget.temperatureUnit"
        static let windDirectionDegrees = "calendarWidget.windDirectionDegrees"
        static let windDirectionText = "calendarWidget.windDirectionText"
        static let windSpeed = "calendarWidget.windSpeed"
        static let windSpeedUnit = "calendarWidget.windSpeedUnit"
        static let pressure = "calendarWidget.pressure"
        static let uvIndex = "calendarWidget.uvIndex"
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
            pressure: defaults?.object(forKey: Key.pressure) as? Double,
            uvIndex: defaults?.object(forKey: Key.uvIndex) as? Int,
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
    let pressure: Double?
    let uvIndex: Int?
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
            pressure: 1015,
            uvIndex: 1,
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
            CalendarWidgetUpcomingEvent(id: "6", title: "Family dinner", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 2, hour: 19)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 2, hour: 21)) ?? Date(), isAllDay: false, colorRed: 0.25, colorGreen: 0.84, colorBlue: 0.76, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "7", title: "Project planning", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 3, hour: 9)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 3, hour: 10)) ?? Date(), isAllDay: false, colorRed: 0.34, colorGreen: 0.68, colorBlue: 0.95, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "8", title: "Client call", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 3, hour: 11, minute: 30)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 3, hour: 12, minute: 15)) ?? Date(), isAllDay: false, colorRed: 0.94, colorGreen: 0.51, colorBlue: 0.33, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "9", title: "Focus time", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 3, hour: 14)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 3, hour: 16)) ?? Date(), isAllDay: false, colorRed: 0.55, colorGreen: 0.47, colorBlue: 0.93, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "10", title: "Sprint retrospective", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 4, hour: 10)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 4, hour: 11)) ?? Date(), isAllDay: false, colorRed: 0.45, colorGreen: 0.78, colorBlue: 0.42, colorAlpha: 1),
            CalendarWidgetUpcomingEvent(id: "11", title: "Doctor appointment", startDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 4, hour: 13, minute: 30)) ?? Date(), endDate: Calendar.current.date(from: DateComponents(year: 2026, month: 7, day: 4, hour: 14)) ?? Date(), isAllDay: false, colorRed: 0.91, colorGreen: 0.32, colorBlue: 0.44, colorAlpha: 1)
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

private enum CalendarWidgetLayout {
    case grid
    case classic
    case largeEvents
}

private struct CalendarIconWidgetView: View {
    @Environment(\.widgetFamily) private var family

    let entry: CalendarIconEntry
    let layout: CalendarWidgetLayout

    init(entry: CalendarIconEntry, layout: CalendarWidgetLayout = .grid) {
        self.entry = entry
        self.layout = layout
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
            switch (family, layout) {
            case (.systemMedium, .grid):
                mediumGridBody
            case (.systemMedium, .classic):
                mediumClassicBody
            case (.systemLarge, .largeEvents):
                largeEventsBody
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

                classicEventsList(limit: 5, spacing: 1)
//                    .padding(.leading, 8)
                    .padding(.trailing, 16)
//                    .padding(.vertical, 8)
                    .frame(width: listWidth)
                    .frame(maxHeight: .infinity, alignment: .center)
            }
//            .padding(.vertical, 7)
        }
    }

    private var largeEventsBody: some View {
        GeometryReader { geometry in
            let iconWidth = geometry.size.width * 0.4
            let listWidth = geometry.size.width * 0.6

            HStack(alignment: .center, spacing: 0) {
                ZStack(alignment: .bottomLeading) {
                    smallBody
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)

                    largeBottomMetrics
                        .padding(.horizontal, 14)
                        .padding(.bottom, 8)
                }
                    .frame(width: iconWidth)
                    .frame(maxHeight: .infinity)

                classicEventsList(limit: 11, spacing: 4)
                    .padding(.trailing, 16)
                    .frame(width: listWidth)
                    .frame(maxHeight: .infinity, alignment: .center)
            }
        }
    }

    @ViewBuilder
    private func classicEventsList(limit: Int, spacing: CGFloat) -> some View {
        let events = Array(entry.events.prefix(limit))

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
            VStack(alignment: .leading, spacing: spacing) {
                ForEach(events) { event in
                    classicEventRow(event)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
        }
    }

    private func classicEventRow(_ event: CalendarWidgetUpcomingEvent) -> some View {
        HStack(alignment: .center, spacing: 8) {
            Capsule()
                .fill(event.tintColor)
                .frame(width: 4, height: 20)

            VStack(alignment: .leading, spacing: 1) {
                Text(event.title.isEmpty ? NSLocalizedString("Untitled", comment: "Fallback event title") : event.title)
                    .font(.system(size: 13, weight: .medium))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)

                Text(eventScheduleText(event))
                    .font(.system(size: 10, weight: .regular))
                    .lineLimit(1)
                    .minimumScaleFactor(0.65)
                    .opacity(0.78)
            }
        }
        .foregroundStyle(iconTextColor)
        .frame(height: 26)
    }

    private var largeBottomMetrics: some View {
        GeometryReader { geometry in
            let columnSpacing: CGFloat = 8
            let cellWidth = max(1, (geometry.size.width - columnSpacing) / 2)
            let cellHeight: CGFloat = 58
            let verticalStep = max(0, (geometry.size.height - cellHeight) / 3)

            ZStack(alignment: .topLeading) {
                VStack(spacing: 4) {
                    Image(entry.weather.moonPhaseAssetName)
                        .resizable()
                        .scaledToFit()
                        .frame(width: 48, height: 44)

                    compactMetricCaption(shortMoonPhaseText)
                }
                .frame(width: cellWidth, height: cellHeight)
                .position(x: cellWidth / 2, y: cellHeight / 2)

                VStack(spacing: 4) {
                    mediumWindCompass
                        .scaleEffect(0.9)
                        .frame(width: 44, height: 44)

                    compactMetricCaption("\(entry.weather.windDirectionText) \(windSpeedText)")
                }
                .frame(width: cellWidth, height: cellHeight)
                .position(
                    x: geometry.size.width - (cellWidth / 2),
                    y: (cellHeight / 2) + verticalStep
                )

                compactPressureMetric
                    .frame(width: cellWidth, height: cellHeight)
                    .position(
                        x: cellWidth / 2,
                        y: (cellHeight / 2) + (verticalStep * 2)
                    )

                compactUVMetric
                    .frame(width: cellWidth, height: cellHeight)
                    .position(
                        x: geometry.size.width - (cellWidth / 2),
                        y: (cellHeight / 2) + (verticalStep * 3)
                    )
            }
        }
        .frame(height: 204)
    }

    private var compactPressureMetric: some View {
        VStack(spacing: 2) {
            HStack(alignment: .firstTextBaseline, spacing: 2) {
                Text(pressureValueText)
                    .font(.system(size: 12, weight: .medium))

                Text(pressureUnitText)
                    .font(.system(size: 6, weight: .regular))
                    .opacity(0.72)
            }
            .foregroundStyle(iconTextColor)
            .lineLimit(1)

            compactPressureGauge
                .frame(width: 42, height: 22)

            compactMetricCaption(NSLocalizedString("Pressure", comment: "Pressure metric label"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var compactUVMetric: some View {
        VStack(spacing: 3) {
            HStack(spacing: 3) {
                Image(systemName: "sun.max.fill")
                    .symbolRenderingMode(.multicolor)
                    .font(.system(size: 9, weight: .medium))

                Text("UV \(entry.weather.uvIndex.map(String.init) ?? "--")")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(iconTextColor)
            }
            .lineLimit(1)

            compactUVBar

            compactMetricCaption(uvCategoryText)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var compactPressureGauge: some View {
        Canvas { context, size in
            let center = CGPoint(x: size.width / 2, y: size.height * 0.58)
            let radius = min(size.width * 0.4, size.height * 0.52)
            let startAngle = Angle.degrees(-225)
            let endAngle = Angle.degrees(45)

            var arc = Path()
            arc.addArc(
                center: center,
                radius: radius,
                startAngle: startAngle,
                endAngle: endAngle,
                clockwise: false
            )
            context.stroke(
                arc,
                with: .color(iconTextColor.opacity(0.38)),
                style: StrokeStyle(lineWidth: 2, lineCap: .round)
            )

            let needleDegrees = -225 + (270 * pressureGaugeFraction)
            let needleRadians = needleDegrees * .pi / 180
            let needleTip = CGPoint(
                x: center.x + (cos(needleRadians) * radius * 0.82),
                y: center.y + (sin(needleRadians) * radius * 0.82)
            )

            var needle = Path()
            needle.move(to: center)
            needle.addLine(to: needleTip)
            context.stroke(
                needle,
                with: .color(iconTextColor),
                style: StrokeStyle(lineWidth: 2.5, lineCap: .round)
            )

            let hubRect = CGRect(x: center.x - 2, y: center.y - 2, width: 4, height: 4)
            context.fill(Path(ellipseIn: hubRect), with: .color(iconTextColor))
        }
    }

    private var compactUVBar: some View {
        GeometryReader { geometry in
            let indicatorWidth: CGFloat = 2
            let availableWidth = max(0, geometry.size.width - indicatorWidth)
            let indicatorOffset = availableWidth * uvFraction

            ZStack(alignment: .leading) {
                LinearGradient(
                    colors: [.green, .yellow, .orange, .red, .purple],
                    startPoint: .leading,
                    endPoint: .trailing
                )
                .frame(height: 4)
                .clipShape(Capsule())

                Capsule()
                    .fill(iconTextColor)
                    .frame(width: indicatorWidth, height: 8)
                    .offset(x: indicatorOffset)
            }
            .frame(maxHeight: .infinity)
        }
        .frame(height: 8)
    }

    private var pressureValueText: String {
        guard let pressure = entry.weather.pressure else {
            return "--"
        }

        let formatter = NumberFormatter()
        formatter.locale = widgetLocale
        formatter.numberStyle = .decimal
        formatter.minimumFractionDigits = 0
        formatter.maximumFractionDigits = entry.settings.measurementSystem == "Imperial" ? 2 : 0
        return formatter.string(from: NSNumber(value: pressure)) ?? "--"
    }

    private var pressureUnitText: String {
        entry.settings.measurementSystem == "Imperial" ? "inHg" : "hPa"
    }

    private var pressureGaugeFraction: Double {
        guard let pressure = entry.weather.pressure else {
            return 0.5
        }

        let range = entry.settings.measurementSystem == "Imperial"
            ? 28.35...31.30
            : 960...1060
        return min(1, max(0, (pressure - range.lowerBound) / (range.upperBound - range.lowerBound)))
    }

    private var uvFraction: Double {
        min(1, max(0, Double(entry.weather.uvIndex ?? 0) / 11))
    }

    private var uvCategoryText: String {
        let key: String

        switch entry.weather.uvIndex ?? 0 {
        case 0...2:
            key = "Low"
        case 3...5:
            key = "Moderate"
        case 6...7:
            key = "High"
        case 8...10:
            key = "Very High"
        default:
            key = "Extreme"
        }

        return NSLocalizedString(key, comment: "UV index category")
    }

    private func compactMetricCaption(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 9, weight: .regular))
            .foregroundStyle(iconTextColor)
            .lineLimit(1)
            .minimumScaleFactor(0.45)
            .frame(maxWidth: .infinity)
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
        CalendarIconLargeEventsWidget()
        CalendarLiveActivityWidget()
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
            CalendarIconWidgetView(entry: entry, layout: .classic)
        }
        .configurationDisplayName("Calendar Events")
        .description("Shows today's date, current weather, and your next calendar events.")
        .supportedFamilies([.systemMedium])
        .contentMarginsDisabled()
    }
}

struct CalendarIconLargeEventsWidget: Widget {
    let kind = WidgetSharedStore.largeEventsKind

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CalendarIconProvider()) { entry in
            CalendarIconWidgetView(entry: entry, layout: .largeEvents)
        }
        .configurationDisplayName("Calendar Events Large")
        .description("Shows today's date, current weather, and up to 11 upcoming calendar events.")
        .supportedFamilies([.systemLarge])
        .contentMarginsDisabled()
    }
}
