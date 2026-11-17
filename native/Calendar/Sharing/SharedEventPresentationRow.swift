import SwiftUI

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
                        Text(start.formatted(date: .omitted, time: .shortened))
                        Text(end.formatted(date: .omitted, time: .shortened))
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
