import SwiftUI
import CoreLocation

/// A dedicated detail surface for the solar cycle. It deliberately does not
/// reuse `WeatherDetailView`: solar events have their own data and layout.
struct SolarDetailSheet: View {
    @Environment(\.dismiss) private var dismiss

    let days: [SolarDayForecast]
    let timeZone: TimeZone
    let observationDate: Date
    let coordinate: CLLocationCoordinate2D?

    private var calendar: Calendar {
        var calendar = Calendar.current
        calendar.timeZone = timeZone
        return calendar
    }

    private var displayedDay: SolarDayForecast? {
        days.first(where: { calendar.isDate($0.date, inSameDayAs: observationDate) }) ?? days.first
    }

    private var nextEvent: SolarForecastEvent? {
        days
            .flatMap { day -> [SolarForecastEvent] in
                [
                    day.sunrise.map { SolarForecastEvent(kind: .sunrise, date: $0) },
                    day.sunset.map { SolarForecastEvent(kind: .sunset, date: $0) }
                ]
                .compactMap { $0 }
            }
            .filter { $0.date >= observationDate }
            .min { $0.date < $1.date }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                sheetHeader

                ScrollView(.vertical, showsIndicators: false) {
                    LazyVStack(spacing: 18) {
                        solarSummary

                        if let displayedDay {
                            solarTimesCard(displayedDay)
                        }

                        WeatherRotatingAdPlacement()

                        if !days.isEmpty {
                            upcomingDaysCard
                        }

                        if let coordinate {
                            monthlyAveragesCard(coordinate)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 10)
                    .padding(.bottom, 32)
                }
            }
            .background(Color.black.ignoresSafeArea())
            .toolbar(.hidden, for: .navigationBar)
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .presentationBackground(Color.black)
        .foregroundColor(.white)
        .colorScheme(.dark)
    }

    private var sheetHeader: some View {
        ZStack {
            HStack(spacing: 8) {
                Image(systemName: "sunrise.fill")
                    .symbolRenderingMode(.multicolor)

                Text(NSLocalizedString("Sunrise and Sunset", comment: "Solar detail title"))
                    .font(.headline)
                    .adaptiveSingleLine(minimumScale: 0.72)

                Image(systemName: "sunset.fill")
                    .symbolRenderingMode(.multicolor)
            }
            .padding(.horizontal, 62)
            .accessibilityElement(children: .combine)

            HStack {
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
                .buttonStyle(.plain)
                .accessibilityLabel(NSLocalizedString("Close", comment: "Close button"))
            }
        }
        .frame(height: 62)
        .padding(.horizontal, 16)
    }

    private var solarSummary: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let nextEvent {
                Label(nextEvent.kind.localizedTitle, systemImage: nextEvent.kind.symbolName)
                    .symbolRenderingMode(.multicolor)
                    .font(.headline)

                HStack(alignment: .firstTextBaseline) {
                    Text(formatTime(nextEvent.date))
                        .font(.system(size: 42, weight: .medium, design: .rounded))
                        .monospacedDigit()

                    Spacer(minLength: 12)

                    Text(formatRelativeTime(to: nextEvent.date))
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.secondary)
                }
            }

            if let displayedDay {
                SheetSolarArcView(
                    sunrise: displayedDay.sunrise,
                    sunset: displayedDay.sunset,
                    observationDate: observationDate,
                    formatTime: formatOptionalTime,
                    height: 176,
                    sunSourceSide: 92
                )
                .padding(.top, 4)
            } else {
                ContentUnavailableView(
                    NSLocalizedString("Data unavailable", comment: "Unavailable solar data"),
                    systemImage: "sun.horizon"
                )
                .frame(maxWidth: .infinity, minHeight: 190)
            }
        }
        .padding(18)
        .background(
            Color.white.opacity(0.15),
            in: RoundedRectangle(cornerRadius: 24, style: .continuous)
        )
    }

    private func solarTimesCard(_ day: SolarDayForecast) -> some View {
        VStack(spacing: 0) {
            solarTimeRow(
                NSLocalizedString("First Light", comment: "Civil dawn label"),
                systemImage: "sun.horizon",
                value: formatOptionalTime(day.firstLight)
            )
            Divider()
            solarTimeRow(
                NSLocalizedString("Sunrise", comment: "Sunrise label"),
                systemImage: "sunrise.fill",
                value: formatOptionalTime(day.sunrise)
            )
            Divider()
            solarTimeRow(
                NSLocalizedString("Solar Noon", comment: "Solar noon label"),
                systemImage: "sun.max.fill",
                value: formatOptionalTime(day.solarNoon)
            )
            Divider()
            solarTimeRow(
                NSLocalizedString("Sunset", comment: "Sunset label"),
                systemImage: "sunset.fill",
                value: formatOptionalTime(day.sunset)
            )
            Divider()
            solarTimeRow(
                NSLocalizedString("Last Light", comment: "Civil dusk label"),
                systemImage: "sun.horizon",
                value: formatOptionalTime(day.lastLight)
            )
            Divider()
            solarTimeRow(
                NSLocalizedString("Total Daylight", comment: "Daylight duration label"),
                systemImage: "clock",
                value: formatDuration(day.daylightDuration)
            )
        }
        .padding(.horizontal, 16)
        .background(
            Color.white.opacity(0.15),
            in: RoundedRectangle(cornerRadius: 20, style: .continuous)
        )
    }

    private var upcomingDaysCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            Label(
                NSLocalizedString("10-DAY FORECAST", comment: "Solar forecast heading"),
                systemImage: "calendar"
            )
            .font(.caption.weight(.semibold))
            .foregroundStyle(.secondary)
            .padding(.horizontal, 16)
            .padding(.vertical, 14)

            Divider()

            ForEach(Array(days.enumerated()), id: \.element.id) { index, day in
                SolarDayRow(
                    day: day,
                    title: dayTitle(day.date, index: index),
                    timeZone: timeZone
                )
                .padding(.horizontal, 16)

                if index < days.count - 1 {
                    Divider()
                        .padding(.leading, 16)
                }
            }
        }
        .background(
            Color.white.opacity(0.15),
            in: RoundedRectangle(cornerRadius: 20, style: .continuous)
        )
    }

    private func monthlyAveragesCard(_ coordinate: CLLocationCoordinate2D) -> some View {
        let months = solarMonthSummaries(coordinate)

        return VStack(alignment: .leading, spacing: 0) {
            Label(
                NSLocalizedString("Sunrise and Sunset", comment: "Monthly solar heading"),
                systemImage: "calendar"
            )
            .font(.caption.weight(.semibold))
            .foregroundStyle(.secondary)
            .padding(.horizontal, 16)
            .padding(.vertical, 14)

            Divider()

            ForEach(Array(months.enumerated()), id: \.element.id) { index, month in
                SolarMonthRow(summary: month, timeZone: timeZone)
                    .padding(.horizontal, 16)

                if index < months.count - 1 {
                    Divider().padding(.leading, 16)
                }
            }
        }
        .background(
            Color.white.opacity(0.15),
            in: RoundedRectangle(cornerRadius: 20, style: .continuous)
        )
    }

    private func solarMonthSummaries(_ coordinate: CLLocationCoordinate2D) -> [SolarMonthSummary] {
        // Always present one calendar year in its natural order instead of a
        // rolling twelve-month window that begins with the current month.
        guard let yearStart = calendar.date(
            from: calendar.dateComponents([.year], from: observationDate)
        ) else { return [] }

        return (0..<12).compactMap { offset in
            guard let monthStart = calendar.date(byAdding: .month, value: offset, to: yearStart),
                  let dayRange = calendar.range(of: .day, in: .month, for: monthStart) else {
                return nil
            }

            let events = dayRange.compactMap { day -> (Date, Date)? in
                guard let date = calendar.date(byAdding: .day, value: day - 1, to: monthStart) else { return nil }
                return SolarCycleCalculator.events(
                    on: date,
                    coordinate: coordinate,
                    timeZone: timeZone
                )
            }

            let sunriseMinutes = events.map { localMinute($0.0) }
            let sunsetMinutes = events.map { localMinute($0.1) }
            let representativeDay = calendar.date(byAdding: .day, value: min(14, dayRange.count - 1), to: monthStart)

            return SolarMonthSummary(
                month: monthStart,
                sunrise: representativeDay.flatMap { dateAtAverageMinute(sunriseMinutes, on: $0) },
                sunset: representativeDay.flatMap { dateAtAverageMinute(sunsetMinutes, on: $0) }
            )
        }
    }

    private func localMinute(_ date: Date) -> Double {
        let components = calendar.dateComponents([.hour, .minute, .second], from: date)
        return Double(components.hour ?? 0) * 60
            + Double(components.minute ?? 0)
            + Double(components.second ?? 0) / 60
    }

    private func dateAtAverageMinute(_ values: [Double], on date: Date) -> Date? {
        guard !values.isEmpty else { return nil }
        let average = values.reduce(0, +) / Double(values.count)
        return calendar.date(
            bySettingHour: Int(average / 60),
            minute: Int(average.rounded()) % 60,
            second: 0,
            of: date
        )
    }

    private func solarTimeRow(_ title: String, systemImage: String, value: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: systemImage)
                .symbolRenderingMode(.multicolor)
                .frame(width: 22)

            Text(title)
                .font(.body.weight(.semibold))

            Spacer()

            Text(value)
                .foregroundStyle(.secondary)
                .monospacedDigit()
        }
        .frame(minHeight: 54)
    }

    private func dayTitle(_ date: Date, index: Int) -> String {
        if index == 0 || calendar.isDate(date, inSameDayAs: observationDate) {
            return NSLocalizedString("Today", comment: "Today label")
        }
        return appDateFormatter(template: "EEE d", timeZone: timeZone).string(from: date)
    }

    private func formatOptionalTime(_ date: Date?) -> String {
        guard let date else { return "—" }
        return formatTime(date)
    }

    private func formatTime(_ date: Date) -> String {
        return appTimeFormatter(timeZone: timeZone).string(from: date)
    }

    private func formatDuration(_ duration: TimeInterval?) -> String {
        guard let duration else { return "—" }
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = [.hour, .minute]
        formatter.unitsStyle = .abbreviated
        formatter.zeroFormattingBehavior = .dropLeading
        var formattingCalendar = Calendar.current
        formattingCalendar.locale = .appFormatting
        formattingCalendar.timeZone = timeZone
        formatter.calendar = formattingCalendar
        return formatter.string(from: duration) ?? "—"
    }

    private func formatRelativeTime(to date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        formatter.locale = .appFormatting
        formatter.unitsStyle = .full
        return formatter.localizedString(for: date, relativeTo: observationDate)
    }
}

private struct SolarMonthSummary: Identifiable {
    let month: Date
    let sunrise: Date?
    let sunset: Date?

    var id: Date { month }
}

private struct SolarMonthRow: View {
    @Environment(\.layoutDirection) private var layoutDirection

    let summary: SolarMonthSummary
    let timeZone: TimeZone

    var body: some View {
        HStack(spacing: 10) {
            Text(appDateFormatter(template: "MMM", timeZone: timeZone).string(from: summary.month))
                .font(.subheadline.weight(.semibold))
                .frame(width: 48, alignment: .leading)
                .lineLimit(1)

            Text(formatTime(summary.sunrise))
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .monospacedDigit()
                .frame(width: 58, alignment: .trailing)

            GeometryReader { proxy in
                let start = fractionOfDay(summary.sunrise)
                let end = fractionOfDay(summary.sunset)
                let span = max(0, end - start)
                let width = max(5, proxy.size.width * span)
                let physicalStart = layoutDirection == .rightToLeft ? 1 - end : start
                let centerX = proxy.size.width * (physicalStart + span / 2)

                ZStack {
                    Capsule()
                        .fill(Color.white.opacity(0.08))
                        .frame(height: 6)

                    if summary.sunrise != nil, summary.sunset != nil {
                        Capsule()
                            .fill(
                                LinearGradient(
                                    colors: [.orange, .yellow, .cyan],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .frame(width: width, height: 6)
                            .position(x: centerX, y: 4)
                    }
                }
            }
            .frame(height: 8)

            Text(formatTime(summary.sunset))
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .monospacedDigit()
                .frame(width: 58, alignment: .leading)
        }
        .frame(minHeight: 52)
        .accessibilityElement(children: .combine)
    }

    private func fractionOfDay(_ date: Date?) -> Double {
        guard let date else { return 0 }
        var calendar = Calendar.current
        calendar.timeZone = timeZone
        let components = calendar.dateComponents([.hour, .minute, .second], from: date)
        let seconds = Double(components.hour ?? 0) * 3_600
            + Double(components.minute ?? 0) * 60
            + Double(components.second ?? 0)
        return max(0, min(1, seconds / 86_400))
    }

    private func formatTime(_ date: Date?) -> String {
        guard let date else { return "—" }
        return appTimeFormatter(timeZone: timeZone).string(from: date)
    }
}

private enum SolarCycleCalculator {
    private static let zenith = 90.833

    static func events(
        on date: Date,
        coordinate: CLLocationCoordinate2D,
        timeZone: TimeZone
    ) -> (sunrise: Date, sunset: Date)? {
        guard let sunrise = event(
            on: date,
            coordinate: coordinate,
            timeZone: timeZone,
            isSunrise: true
        ), let sunset = event(
            on: date,
            coordinate: coordinate,
            timeZone: timeZone,
            isSunrise: false
        ) else { return nil }
        return (sunrise, sunset)
    }

    private static func event(
        on date: Date,
        coordinate: CLLocationCoordinate2D,
        timeZone: TimeZone,
        isSunrise: Bool
    ) -> Date? {
        var localCalendar = Calendar(identifier: .gregorian)
        localCalendar.timeZone = timeZone
        let localComponents = localCalendar.dateComponents([.year, .month, .day], from: date)
        guard let year = localComponents.year,
              let month = localComponents.month,
              let day = localComponents.day,
              let dayOfYear = localCalendar.ordinality(of: .day, in: .year, for: date) else {
            return nil
        }

        let longitudeHour = coordinate.longitude / 15
        let approximateTime = Double(dayOfYear)
            + ((isSunrise ? 6 : 18) - longitudeHour) / 24
        let meanAnomaly = 0.9856 * approximateTime - 3.289
        var trueLongitude = meanAnomaly
            + 1.916 * sin(degreesToRadians(meanAnomaly))
            + 0.020 * sin(2 * degreesToRadians(meanAnomaly))
            + 282.634
        trueLongitude = normalizedDegrees(trueLongitude)

        var rightAscension = radiansToDegrees(
            atan(0.91764 * tan(degreesToRadians(trueLongitude)))
        )
        rightAscension = normalizedDegrees(rightAscension)
        rightAscension += floor(trueLongitude / 90) * 90 - floor(rightAscension / 90) * 90
        rightAscension /= 15

        let sinDeclination = 0.39782 * sin(degreesToRadians(trueLongitude))
        let cosDeclination = cos(asin(sinDeclination))
        let latitudeRadians = degreesToRadians(coordinate.latitude)
        let cosHourAngle = (
            cos(degreesToRadians(zenith)) - sinDeclination * sin(latitudeRadians)
        ) / (cosDeclination * cos(latitudeRadians))

        guard (-1...1).contains(cosHourAngle) else { return nil }
        let hourAngleDegrees = isSunrise
            ? 360 - radiansToDegrees(acos(cosHourAngle))
            : radiansToDegrees(acos(cosHourAngle))
        let localMeanTime = hourAngleDegrees / 15
            + rightAscension
            - 0.06571 * approximateTime
            - 6.622
        let universalHour = normalizedHours(localMeanTime - longitudeHour)

        var utcCalendar = Calendar(identifier: .gregorian)
        utcCalendar.timeZone = TimeZone(secondsFromGMT: 0)!
        guard let utcBase = utcCalendar.date(from: DateComponents(year: year, month: month, day: day)) else {
            return nil
        }

        let baseEvent = utcBase.addingTimeInterval(universalHour * 3_600)
        return [-1, 0, 1]
            .map { baseEvent.addingTimeInterval(Double($0) * 86_400) }
            .first { localCalendar.isDate($0, inSameDayAs: date) }
            ?? baseEvent
    }

    private static func normalizedDegrees(_ value: Double) -> Double {
        let remainder = value.truncatingRemainder(dividingBy: 360)
        return remainder >= 0 ? remainder : remainder + 360
    }

    private static func normalizedHours(_ value: Double) -> Double {
        let remainder = value.truncatingRemainder(dividingBy: 24)
        return remainder >= 0 ? remainder : remainder + 24
    }

    private static func degreesToRadians(_ value: Double) -> Double { value * .pi / 180 }
    private static func radiansToDegrees(_ value: Double) -> Double { value * 180 / .pi }
}

private struct SolarDayRow: View {
    @Environment(\.layoutDirection) private var layoutDirection

    let day: SolarDayForecast
    let title: String
    let timeZone: TimeZone

    private var calendar: Calendar {
        var calendar = Calendar.current
        calendar.timeZone = timeZone
        return calendar
    }

    var body: some View {
        HStack(spacing: 10) {
            Text(title)
                .font(.subheadline.weight(.semibold))
                .frame(width: 76, alignment: .leading)
                .lineLimit(1)
                .minimumScaleFactor(0.72)

            Text(formatTime(day.sunrise))
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .monospacedDigit()
                .frame(width: 58, alignment: .trailing)

            GeometryReader { proxy in
                let start = fractionOfDay(day.sunrise)
                let end = fractionOfDay(day.sunset)
                let span = max(0, end - start)
                let width = max(5, proxy.size.width * span)
                let physicalStart = layoutDirection == .rightToLeft ? 1 - end : start
                let centerX = proxy.size.width * (physicalStart + span / 2)

                ZStack {
                    Capsule()
                        .fill(Color.white.opacity(0.08))
                        .frame(height: 6)

                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [.orange, .yellow, .cyan],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: width, height: 6)
                        .position(x: centerX, y: 4)
                }
            }
            .frame(height: 8)

            Text(formatTime(day.sunset))
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .monospacedDigit()
                .frame(width: 58, alignment: .leading)
        }
        .frame(minHeight: 52)
        .accessibilityElement(children: .combine)
    }

    private func fractionOfDay(_ date: Date?) -> Double {
        guard let date else { return 0 }
        let components = calendar.dateComponents([.hour, .minute, .second], from: date)
        let hourSeconds = Double(components.hour ?? 0) * 3_600
        let minuteSeconds = Double(components.minute ?? 0) * 60
        let secondValue = Double(components.second ?? 0)
        let seconds = hourSeconds + minuteSeconds + secondValue
        return max(0, min(1, seconds / 86_400))
    }

    private func formatTime(_ date: Date?) -> String {
        guard let date else { return "—" }
        return appTimeFormatter(timeZone: timeZone).string(from: date)
    }
}
