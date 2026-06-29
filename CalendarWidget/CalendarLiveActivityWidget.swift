import ActivityKit
import SwiftUI
import WidgetKit

struct CalendarLiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        let updatedAt: Date
        let events: [CalendarLiveActivityEvent]
    }

    let title: String
}

struct CalendarLiveActivityEvent: Codable, Hashable, Identifiable {
    let id: String
    let title: String
    let startDate: Date
    let endDate: Date
    let isAllDay: Bool
    let location: String?
    let videoCallPlatform: String?
    let colorRed: Double
    let colorGreen: Double
    let colorBlue: Double
    let colorAlpha: Double
}

private enum CalendarLiveActivityPalette {
    static let background = Color.white.opacity(0.96)
    static let primaryText = Color.black.opacity(0.9)
    static let secondaryText = Color.black.opacity(0.62)
    static let accent = Color.blue
}

private struct CalendarLiveActivityAppIcon: View {
    let size: CGFloat
    var fallbackColor = CalendarLiveActivityPalette.accent

    var body: some View {
        Image(systemName: "calendar")
            .font(.system(size: size, weight: .semibold))
            .foregroundStyle(fallbackColor)
    }
}

private enum CalendarLiveActivitySharedStore {
    static let appGroupID = "group.ARTE-SOFT.sandBOX"

    private enum Key {
        static let region = "calendarWidget.global.region"
        static let calendar = "calendarWidget.global.calendar"
        static let firstWeekday = "calendarWidget.global.firstWeekday"
        static let dateFormat = "calendarWidget.global.dateFormat"
        static let numberFormat = "calendarWidget.global.numberFormat"
        static let upcomingEvents = "calendarWidget.upcomingEvents"
    }

    private struct UpcomingEventSnapshot: Codable {
        let id: String
        let title: String
        let startDate: Date
        let endDate: Date
        let isAllDay: Bool
        let location: String?
        let videoCallPlatform: String?
        let colorRed: Double
        let colorGreen: Double
        let colorBlue: Double
        let colorAlpha: Double
    }

    static func globalSettings() -> CalendarLiveActivitySettingsSnapshot {
        let defaults = UserDefaults(suiteName: appGroupID)

        return CalendarLiveActivitySettingsSnapshot(
            region: defaults?.string(forKey: Key.region) ?? "",
            calendarIdentifier: defaults?.string(forKey: Key.calendar) ?? "",
            firstWeekday: defaults?.integer(forKey: Key.firstWeekday) ?? Calendar.current.firstWeekday,
            dateFormat: defaults?.string(forKey: Key.dateFormat) ?? "",
            numberFormat: defaults?.string(forKey: Key.numberFormat) ?? ""
        )
    }

    private static func upcomingEvents() -> [CalendarLiveActivityEvent] {
        guard
            let data = UserDefaults(suiteName: appGroupID)?.data(forKey: Key.upcomingEvents),
            let snapshots = try? JSONDecoder().decode([UpcomingEventSnapshot].self, from: data)
        else {
            return []
        }

        return snapshots
            .map(makeEvent)
            .futureEvents()
    }

    private static func makeEvent(from snapshot: UpcomingEventSnapshot) -> CalendarLiveActivityEvent {
        CalendarLiveActivityEvent(
            id: snapshot.id,
            title: snapshot.title,
            startDate: snapshot.startDate,
            endDate: snapshot.endDate,
            isAllDay: snapshot.isAllDay,
            location: snapshot.location,
            videoCallPlatform: snapshot.videoCallPlatform,
            colorRed: snapshot.colorRed,
            colorGreen: snapshot.colorGreen,
            colorBlue: snapshot.colorBlue,
            colorAlpha: snapshot.colorAlpha
        )
    }
}

private struct CalendarLiveActivitySettingsSnapshot {
    let region: String
    let calendarIdentifier: String
    let firstWeekday: Int
    let dateFormat: String
    let numberFormat: String

    var locale: Locale {
        let region = region.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !region.isEmpty else {
            return Locale.autoupdatingCurrent
        }

        let languageCode = Locale.autoupdatingCurrent.language.languageCode?.identifier ?? "en"
        return Locale(identifier: "\(languageCode)_\(region)")
    }

    var calendar: Calendar {
        var calendar = Calendar(identifier: calendarIdentifierValue)
        calendar.locale = locale
        calendar.timeZone = .autoupdatingCurrent

        if (1...7).contains(firstWeekday) {
            calendar.firstWeekday = firstWeekday
        }

        return calendar
    }

    private var calendarIdentifierValue: Calendar.Identifier {
        switch calendarIdentifier.lowercased() {
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
}

struct CalendarLiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: CalendarLiveActivityAttributes.self) { context in
            CalendarLiveActivityContentView(
                state: context.state,
                settings: CalendarLiveActivitySharedStore.globalSettings()
            )
                .activityBackgroundTint(CalendarLiveActivityPalette.background)
                .activitySystemActionForegroundColor(CalendarLiveActivityPalette.accent)
        } dynamicIsland: { context in
            let settings = CalendarLiveActivitySharedStore.globalSettings()
            return DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    CalendarLiveActivityExpandedBrandView()
                        .padding(.leading, 12)
                        .padding(.top, 9)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    CalendarLiveActivityExpandedCountdownView(
                        event: context.state.nextEvent,
                        settings: settings
                    )
                    .padding(.trailing, 12)
                    .padding(.top, 5)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    if let event = context.state.nextEvent {
                        CalendarLiveActivityEventCardView(event: event, settings: settings)
                            .padding(.horizontal, 10)
                            .padding(.top, 0)
                            .padding(.bottom, 2)
                    } else {
                        Text("No upcoming events")
                            .font(.subheadline.weight(.medium))
                            .foregroundStyle(.white.opacity(0.72))
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 18)
                    }
                }
            } compactLeading: {
                CalendarLiveActivityAppIcon(size: 18)
            } compactTrailing: {
                if let event = context.state.nextEvent {
                    CalendarLiveActivityCompactCountdownView(
                        event: event,
                        settings: CalendarLiveActivitySharedStore.globalSettings()
                    )
                } else {
                    Image(systemName: "exclamationmark.circle")
                        .font(.caption2.bold())
                        .foregroundStyle(CalendarLiveActivityPalette.secondaryText)
                }
            } minimal: {
                CalendarLiveActivityAppIcon(size: 14)
            }
        }
    }
}

private struct CalendarLiveActivityExpandedBrandView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 1) {
            Text("CloudCalendars")
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(.white)
                .lineLimit(1)
                .minimumScaleFactor(0.65)
                .allowsTightening(true)

            Text("Next Event")
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(.white.opacity(0.58))
                .lineLimit(1)
        }
    }
}

private struct CalendarLiveActivityExpandedCountdownView: View {
    let event: CalendarLiveActivityEvent?
    let settings: CalendarLiveActivitySettingsSnapshot
    var labelColor: Color = CalendarLiveActivityPalette.accent
    var valueColor: Color = .white
    var iconColor: Color = CalendarLiveActivityPalette.accent

    var body: some View {
        VStack(alignment: .trailing, spacing: 3) {
            Text("Starts in")
                .font(.caption2.weight(.semibold))
                .foregroundStyle(labelColor)

            HStack(alignment: .firstTextBaseline, spacing: 7) {
                if let event {
                    CalendarLiveActivityCountdownValueView(targetDate: event.startDate, settings: settings)
                        .font(.system(size: 20, weight: .semibold, design: .rounded))
                        .foregroundStyle(valueColor)
                        .lineLimit(1)
                        .minimumScaleFactor(0.65)
                } else {
                    Text("--")
                        .font(.system(size: 20, weight: .semibold, design: .rounded))
                        .foregroundStyle(valueColor.opacity(0.6))
                }

                Image(systemName: "clock")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundStyle(iconColor)
            }
        }
    }
}

private struct CalendarLiveActivityCompactCountdownView: View {
    let event: CalendarLiveActivityEvent
    let settings: CalendarLiveActivitySettingsSnapshot

    var body: some View {
        CalendarLiveActivityCountdownValueView(targetDate: event.startDate, settings: settings)
            .font(.system(size: 12, weight: .semibold, design: .rounded))
            .foregroundStyle(.white)
            .lineLimit(1)
            .minimumScaleFactor(0.72)
            .frame(width: 42, alignment: .trailing)
    }
}

private struct CalendarLiveActivityCountdownValueView: View {
    let targetDate: Date
    let settings: CalendarLiveActivitySettingsSnapshot

    var body: some View {
        TimelineView(.periodic(from: Date(), by: 60)) { timeline in
            Text(Self.localizedRemainingTime(until: targetDate, now: timeline.date, settings: settings))
                .monospacedDigit()
        }
    }

    private static func localizedRemainingTime(
        until targetDate: Date,
        now: Date,
        settings: CalendarLiveActivitySettingsSnapshot
    ) -> String {
        let remaining = max(0, targetDate.timeIntervalSince(now))
        let value: Int
        let unitKey: String

        if remaining > 24 * 60 * 60 {
            value = Int(remaining / 86_400)
            unitKey = value == 1 ? "LiveActivityCountdownDayUnitOne" : "LiveActivityCountdownDayUnitOther"
        } else if remaining > 60 * 60 {
            value = Int(remaining / 3_600)
            unitKey = value == 1 ? "LiveActivityCountdownHourUnitOne" : "LiveActivityCountdownHourUnitOther"
        } else {
            value = Int(remaining / 60)
            unitKey = value == 1 ? "LiveActivityCountdownMinuteUnitOne" : "LiveActivityCountdownMinuteUnitOther"
        }

        let format = NSLocalizedString(
            "LiveActivityCountdownFormat",
            comment: "Live Activity countdown format with value and localized unit"
        )
        let unit = NSLocalizedString(unitKey, comment: "Live Activity countdown unit")

        return String(format: format, locale: settings.locale, value, unit)
    }
}

private struct CalendarLiveActivityContentView: View {
    let state: CalendarLiveActivityAttributes.ContentState
    let settings: CalendarLiveActivitySettingsSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top, spacing: 10) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("CloudCalendars")
                        .font(.headline.weight(.semibold))
                        .foregroundStyle(CalendarLiveActivityPalette.primaryText)
                    Text("Next Event")
                        .font(.subheadline)
                        .foregroundStyle(CalendarLiveActivityPalette.secondaryText)
                }

                Spacer()

                CalendarLiveActivityExpandedCountdownView(
                    event: state.nextEvent,
                    settings: settings,
                    valueColor: CalendarLiveActivityPalette.primaryText
                )
            }

            if let event = state.nextEvent {
                CalendarLiveActivityEventCardView(event: event, settings: settings)
            } else {
                Text("No upcoming events")
                    .font(.subheadline)
                    .foregroundStyle(CalendarLiveActivityPalette.secondaryText)
            }
        }
        .padding(14)
    }
}

private struct CalendarLiveActivityEventCardView: View {
    let event: CalendarLiveActivityEvent
    let settings: CalendarLiveActivitySettingsSnapshot

    var body: some View {
        HStack(alignment: .center, spacing: 10) {
            RoundedRectangle(cornerRadius: 3, style: .continuous)
                .fill(eventColor)
                .frame(width: 5, height: markerHeight)

            VStack(alignment: .leading, spacing: 3) {
                Text(event.title.isEmpty ? "Untitled" : event.title)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(eventColor)
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)

                Label(eventTimeRangeText(event), systemImage: event.isAllDay ? "calendar" : "clock")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(eventColor)
                    .lineLimit(1)
                    .minimumScaleFactor(0.78)

                if let videoCallPlatform = event.videoCallPlatform, !videoCallPlatform.isEmpty {
                    Label(videoCallPlatform, systemImage: "video")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(eventColor)
                        .lineLimit(1)
                        .minimumScaleFactor(0.78)
                }

                if let location = event.location, !location.isEmpty {
                    Label(location, systemImage: "location.fill")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(eventColor)
                        .lineLimit(1)
                        .minimumScaleFactor(0.78)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(.horizontal, 11)
        .padding(.vertical, 7)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(eventBackgroundColor)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private var eventColor: Color {
        Color(
            red: event.colorRed,
            green: event.colorGreen,
            blue: event.colorBlue,
            opacity: max(event.colorAlpha, 0.9)
        )
    }

    private var eventBackgroundColor: Color {
        Color(
            red: event.colorRed,
            green: event.colorGreen,
            blue: event.colorBlue,
            opacity: 0.3
        )
    }

    private var markerHeight: CGFloat {
        var rows = 2
        if let videoCallPlatform = event.videoCallPlatform, !videoCallPlatform.isEmpty {
            rows += 1
        }
        if let location = event.location, !location.isEmpty {
            rows += 1
        }

        return rows > 2 ? 54 : 42
    }

    private func eventTimeRangeText(_ event: CalendarLiveActivityEvent) -> String {
        if event.isAllDay {
            return NSLocalizedString("all-day", comment: "All-day event label")
        }

        let calendar = settings.calendar

        if calendar.isDate(event.startDate, inSameDayAs: event.endDate) {
            return "\(shortTimeText(event.startDate)) - \(shortTimeText(event.endDate))"
        }

        return "\(shortDateText(event.startDate)) \(shortTimeText(event.startDate)) - \(shortDateText(event.endDate)) \(shortTimeText(event.endDate))"
    }

    private func shortTimeText(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = settings.calendar
        formatter.locale = settings.locale
        formatter.timeZone = .autoupdatingCurrent
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }

    private func shortDateText(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = settings.calendar
        formatter.locale = settings.locale
        formatter.timeZone = .autoupdatingCurrent

        let dateFormat = settings.dateFormat.trimmingCharacters(in: .whitespacesAndNewlines)
        if dateFormat.isEmpty {
            formatter.setLocalizedDateFormatFromTemplate("EEE d MMM")
        } else {
            formatter.dateFormat = dateFormat
        }

        return formatter.string(from: date)
    }
}

private struct CalendarLiveActivityEventSummaryView: View {
    let state: CalendarLiveActivityAttributes.ContentState
    var compact = false
    var settings = CalendarLiveActivitySharedStore.globalSettings()
    var primaryText = CalendarLiveActivityPalette.primaryText
    var secondaryText = CalendarLiveActivityPalette.secondaryText
    var accent = CalendarLiveActivityPalette.accent

    var body: some View {
        VStack(alignment: .leading, spacing: compact ? 2 : 5) {
            if let event = state.nextEvent {
                Text(event.title.isEmpty ? "Untitled" : event.title)
                    .font(compact ? .caption.weight(.semibold) : .headline.weight(.semibold))
                    .foregroundStyle(primaryText)
                    .lineLimit(compact ? 1 : 2)

                HStack(spacing: 5) {
                    Image(systemName: "timer")
                        .foregroundStyle(accent)
                    Text("Starts in")
                    CalendarLiveActivityCountdownValueView(targetDate: event.startDate, settings: settings)
                }
                .font(compact ? .caption2 : .subheadline)
                .foregroundStyle(secondaryText)
                .lineLimit(1)

                HStack(spacing: 5) {
                    Image(systemName: event.isAllDay ? "calendar" : "clock")
                        .foregroundStyle(accent)
                    Text(eventTimeRangeText(event))
                }
                .font(compact ? .caption2 : .subheadline)
                .foregroundStyle(secondaryText)
                .lineLimit(1)
            } else {
                Text("No upcoming events")
                    .font(compact ? .caption : .subheadline)
                    .foregroundStyle(secondaryText)
            }

            (Text("Updated") + Text(" ") + Text(shortTimeText(state.updatedAt)))
                .font(.caption2)
                .foregroundStyle(secondaryText)
        }
    }

    private func eventTimeRangeText(_ event: CalendarLiveActivityEvent) -> String {
        if event.isAllDay {
            return NSLocalizedString("all-day", comment: "All-day event label")
        }

        let calendar = settings.calendar

        if calendar.isDate(event.startDate, inSameDayAs: event.endDate) {
            return "\(shortTimeText(event.startDate)) - \(shortTimeText(event.endDate))"
        }

        return "\(shortDateText(event.startDate)) \(shortTimeText(event.startDate)) - \(shortDateText(event.endDate)) \(shortTimeText(event.endDate))"
    }

    private func shortTimeText(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = settings.calendar
        formatter.locale = settings.locale
        formatter.timeZone = .autoupdatingCurrent
        formatter.dateStyle = .none
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }

    private func shortDateText(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = settings.calendar
        formatter.locale = settings.locale
        formatter.timeZone = .autoupdatingCurrent

        let dateFormat = settings.dateFormat.trimmingCharacters(in: .whitespacesAndNewlines)
        if dateFormat.isEmpty {
            formatter.setLocalizedDateFormatFromTemplate("EEE d MMM")
        } else {
            formatter.dateFormat = dateFormat
        }

        return formatter.string(from: date)
    }

}

private extension CalendarLiveActivityAttributes.ContentState {
    var nextEvent: CalendarLiveActivityEvent? {
        events.futureEvents().first
    }
}

private extension Array where Element == CalendarLiveActivityEvent {
    func futureEvents(now: Date = Date()) -> [CalendarLiveActivityEvent] {
        self
            .filter { !$0.isAllDay && $0.startDate > now }
            .sorted {
                $0.startDate < $1.startDate
            }
    }
}
