import SwiftUI
import EventKit

struct SharedEventDetailSource {
    let event: CloudCalendarsAPI.RemoteSharedEvent
    let received: Bool
    let session: CloudCalendarsAPI.Session
    let usesServerRecord: Bool

    var canEdit: Bool { !event.isCancelled && (!received || event.access == .writer || event.access == .owner) }
    var canShare: Bool { !event.isCancelled && (!received || event.access == .owner) }
}

/// Shared events can originate on a different device with no matching local record.
struct SharedEventDetailSnapshot {
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let location: String?
    var url: String?
    var details: SharedEventDetails?
    var calendarTitle: String?

    func displayEvent(in store: EKEventStore) -> EKEvent {
        let calendar = EKCalendar(for: .event, eventStore: store)
        calendar.title = calendarTitle ?? ""
        let event = EKEvent(eventStore: store)
        event.calendar = calendar
        event.title = title
        event.isAllDay = isAllDay
        event.startDate = start
        event.endDate = end
        event.location = location
        event.url = url.flatMap(URL.init(string:))
        details?.applyWritableFields(to: event, canonicalLocation: location)
        return event
    }

    var supplement: EventKitEventSupplement {
        .init(travelTime: details?.travelTime, attachments: (details?.attachments ?? []).map {
            AppLocalEventAttachment(id: $0.id, fileName: $0.fileName, contentType: $0.contentType, dataBase64: $0.dataBase64)
        }, videoCallURL: details?.videoCallURL)
    }
}


/// Event list content shared verbatim by iOS and native Mac Sharing.
struct SharedEventPresentationRow: View {
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let location: String?
    let isCancelled: Bool
    let color: Color
    var access: CloudCalendarsAPI.EventAccess? = nil
    var accessWasRemoved = false
    var optionsAction: (() -> Void)? = nil
    var infoAction: (() -> Void)? = nil
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                    .font(CalendarTypography.body)
                    .strikethrough(isCancelled, color: color)
                    .foregroundStyle(.primary)

                if let location, !location.isEmpty {
                    Label(location, systemImage: "location")
                        .font(CalendarTypography.footnote)
                        .foregroundStyle(.secondary)
                        .lineLimit(1)
                }
            }

            Spacer(minLength: 8)

            VStack(alignment: .trailing, spacing: 5) {
                if isAllDay {
                    Text(LocalizedStringKey("all-day"))
                        .font(CalendarTypography.subheadline)
                        .foregroundStyle(.secondary)
                } else {
                    VStack(alignment: .trailing, spacing: 2) {
                        let time = appTimeFormatter()
                        Text(time.string(from: start))
                        Text(time.string(from: end))
                    }
                    .font(CalendarTypography.subheadline)
                    .foregroundStyle(.secondary)
                }

                if accessWasRemoved {
                    Text(LocalizedStringKey("Access removed"))
                        .font(CalendarTypography.footnote.weight(.semibold))
                        .foregroundStyle(Color.red)
                        .fixedSize()
                        .accessibilityLabel("Event access removed")
                } else if let access {
                    Text(access.title)
                        .font(CalendarTypography.footnote.weight(.semibold))
                        .foregroundStyle(.secondary)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(.thinMaterial, in: Capsule())
                        .fixedSize()
                        .accessibilityLabel("Event access: \(access.title)")
                }

                HStack(spacing: 2) {
                    if let optionsAction {
                        Button(action: optionsAction) {
                            Image(systemName: "person.2.fill")
                                .font(CalendarTypography.body.weight(.semibold))
                                .frame(width: 30, height: 30)
                        }
                        .buttonStyle(.borderless)
                        .accessibilityLabel("Manage event access")
                    }

                    if let infoAction {
                        Button(action: infoAction) {
                            Image(systemName: "info.circle")
                                .font(CalendarTypography.body.weight(.semibold))
                                .frame(width: 30, height: 30)
                        }
                        .buttonStyle(.borderless)
                        .accessibilityLabel("Event Details")
                    }
                }
            }
        }
        .calendarEventRowAccent(color)
        .padding(.vertical, 6)
        .contentShape(Rectangle())
    }
}

struct SharedEventsDayHeader: View {
    let day: Date
    var body: some View {
        let calendar = Calendar.current
        let includesYear = calendar.component(.year, from: day)
            != calendar.component(.year, from: Date())
        let title = appShortDateFormatter(
            includesYear: includesYear,
            includesWeekday: true,
            usesFullWeekday: true
        ).string(from: day).uppercased(with: .appFormatting)

        Text(title)
            .font(.headline)
            .foregroundStyle(calendar.isDateInToday(day) ? Color.red : Color.secondary)
            .padding(.bottom, 4)
            .textCase(nil)
    }
}

struct SharedEventsPageHeader: View {
    let title: LocalizedStringKey
    let close: () -> Void
    var search: (() -> Void)? = nil
    var body: some View {
        HStack(spacing: 0) {
            Button(action: close) {
                Text("Close").font(CalendarTypography.body).foregroundStyle(.blue)
                    .frame(width: 72, height: 38, alignment: .leading).contentShape(Rectangle())
            }.buttonStyle(.plain)
            Text(title).font(CalendarTypography.headline).lineLimit(1).frame(maxWidth: .infinity)
            if let search {
                Button(action: search) {
                    Image(systemName: "magnifyingglass").font(.system(size: 20)).foregroundStyle(.blue)
                        .frame(width: 72, height: 38, alignment: .trailing).contentShape(Rectangle())
                }.buttonStyle(.plain).accessibilityLabel("Search events")
            } else { Color.clear.frame(width: 72, height: 38).accessibilityHidden(true) }
        }.padding(.horizontal, 16).padding(.vertical, 8)
    }
}
