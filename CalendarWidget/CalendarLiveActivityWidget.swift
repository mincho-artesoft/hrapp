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
            isAllDay: snapshot.isAllDay
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
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    CalendarLiveActivityAppIcon(size: 18)
                        .padding(.leading, 10)
                }
                DynamicIslandExpandedRegion(.center) {
                    CalendarLiveActivityEventSummaryView(
                        state: context.state,
                        compact: true,
                        settings: CalendarLiveActivitySharedStore.globalSettings(),
                        primaryText: .white,
                        secondaryText: .white.opacity(0.72),
                        accent: CalendarLiveActivityPalette.accent
                    )
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 10)
                }
            } compactLeading: {
                CalendarLiveActivityAppIcon(size: 18)
            } compactTrailing: {
                if let event = context.state.nextEvent {
                    CalendarLiveActivityCompactCountdownView(event: event)
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

private struct CalendarLiveActivityCompactCountdownView: View {
    let event: CalendarLiveActivityEvent

    var body: some View {
        Text(timerInterval: Date()...targetDate, countsDown: true)
            .font(.system(size: 12, weight: .semibold, design: .rounded))
            .monospacedDigit()
            .foregroundStyle(.white)
            .lineLimit(1)
            .minimumScaleFactor(0.72)
            .frame(width: 42, alignment: .trailing)
    }

    private var targetDate: Date {
        event.startDate
    }
}

private struct CalendarLiveActivityContentView: View {
    let state: CalendarLiveActivityAttributes.ContentState
    let settings: CalendarLiveActivitySettingsSnapshot

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 8) {
                CalendarLiveActivityAppIcon(size: 20)
                Text("Cloud Calendars")
                    .font(.headline)
                    .foregroundStyle(CalendarLiveActivityPalette.primaryText)
                Spacer()
            }

            CalendarLiveActivityEventSummaryView(state: state, settings: settings)
        }
        .padding(14)
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
                    Text(timerInterval: Date()...event.startDate, countsDown: true)
                        .monospacedDigit()
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
