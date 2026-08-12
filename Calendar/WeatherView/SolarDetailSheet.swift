import SwiftUI

/// A dedicated detail surface for the solar cycle. It deliberately does not
/// reuse `WeatherDetailView`: solar events have their own data and layout.
struct SolarDetailSheet: View {
    @Environment(\.dismiss) private var dismiss

    let days: [SolarDayForecast]
    let timeZone: TimeZone
    let observationDate: Date

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

                        if !days.isEmpty {
                            upcomingDaysCard
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
