import SwiftUI
import EventKit

struct SharedInvitationEventPreview: View {
    let payload: SharedEventImportPayload

    private var dateText: String {
        let formatter = DateFormatter()
        formatter.locale = .appFormatting
        formatter.timeZone = payload.timeZone
        formatter.setLocalizedDateFormatFromTemplate("EEEEyMMMMd")
        return formatter.string(from: payload.start)
    }

    private var timeText: String {
        guard !payload.isAllDay else { return NSLocalizedString("All-day event", comment: "") }
        let formatter = appTimeFormatter()
        formatter.timeZone = payload.timeZone
        var calendar = Calendar.current
        calendar.timeZone = payload.timeZone
        if !calendar.isDate(payload.start, inSameDayAs: payload.end) {
            let date = appShortDateFormatter(includesYear: false)
            date.timeZone = payload.timeZone
            return "\(date.string(from: payload.start)) \(formatter.string(from: payload.start)) – \(date.string(from: payload.end)) \(formatter.string(from: payload.end))"
        }
        return "\(formatter.string(from: payload.start)) – \(formatter.string(from: payload.end))"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(dateText, systemImage: "calendar")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.secondary)
                .padding(.horizontal, 4)

            CalendarEventCard(title: payload.title, color: payload.eventColor,
                timeText: timeText, location: payload.location, isAllDay: payload.isAllDay,
                titleSize: 16, detailSize: 14, titleLines: 3, detailLines: 3)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

}

struct SharedInvitationCalendarPicker: View {
    let writableCalendars: [EKCalendar]
    @Binding var selectedCalendarIdentifier: String
    var loading = false
    @State private var isCalendarPickerPresented = false

    var body: some View {
        HStack(spacing: 12) {
            Label("Calendar", systemImage: "calendar")
                .labelStyle(.titleAndIcon).font(.headline).fixedSize()

            Spacer(minLength: 8)

            if writableCalendars.isEmpty {
                if loading { ProgressView() } else { Text("Add a writable calendar first.").font(.footnote).foregroundStyle(.secondary) }
            } else {
                Button {
                    isCalendarPickerPresented = true
                } label: {
                    HStack(spacing: 8) {
                        if let calendar = selectedCalendar {
                            Circle()
                                .fill(calendarColor(calendar))
                                .frame(width: 18, height: 18)

                            Text(calendar.title)
                                .lineLimit(1)
                                .foregroundStyle(.primary)
                        }

                        Image(systemName: "chevron.up.chevron.down")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.tint)
                    }
                }
                .buttonStyle(.plain)
                .accessibilityLabel(Text("Calendar"))
                .accessibilityValue(Text(selectedCalendar?.title ?? ""))
                .popover(isPresented: $isCalendarPickerPresented, arrowEdge: .bottom) {
                    calendarPickerPopover
                        #if os(iOS)
                        .presentationCompactAdaptation(.popover)
                        #endif
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            CalendarPalette.secondaryGroupedBackground,
            in: RoundedRectangle(cornerRadius: 14, style: .continuous)
        )
    }

    private var selectedCalendar: EKCalendar? {
        writableCalendars.first {
            $0.calendarIdentifier == selectedCalendarIdentifier
        }
    }

    private var calendarPickerPopover: some View {
        ScrollView {
            LazyVStack(spacing: 0) {
                ForEach(writableCalendars, id: \.calendarIdentifier) { calendar in
                    Button {
                        selectedCalendarIdentifier = calendar.calendarIdentifier
                        isCalendarPickerPresented = false
                    } label: {
                        HStack(spacing: 12) {
                            Circle()
                                .fill(calendarColor(calendar))
                                .frame(width: 18, height: 18)

                            Text(calendar.title)
                                .foregroundStyle(.primary)
                                .multilineTextAlignment(.leading)

                            Spacer(minLength: 12)

                            if selectedCalendarIdentifier == calendar.calendarIdentifier {
                                Image(systemName: "checkmark")
                                    .font(.body.weight(.semibold))
                                    .foregroundStyle(.primary)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)

                    if calendar.calendarIdentifier != writableCalendars.last?.calendarIdentifier {
                        Divider()
                            .padding(.leading, 46)
                    }
                }
            }
        }
        .frame(
            width: 320,
            height: min(CGFloat(writableCalendars.count) * 52, 390)
        )
        .padding(.vertical, 6)
    }

    private func calendarColor(_ calendar: EKCalendar) -> Color {
        guard let color = calendar.cgColor else { return .gray }
        return Color(cgColor: color)
    }
}

struct SharedInvitationCalendarPreview: View {
    let payload: SharedCalendarInvitationPayload

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: "calendar")
                .font(.title2.weight(.semibold))
                .foregroundStyle(payload.color)
                .frame(width: 48, height: 48)
                .background(
                    payload.color.opacity(0.14),
                    in: RoundedRectangle(cornerRadius: 13, style: .continuous)
                )

            VStack(alignment: .leading, spacing: 4) {
                Text(payload.title)
                    .font(.headline)
                    .foregroundStyle(.primary)
                    .fixedSize(horizontal: false, vertical: true)

                Text("Shared calendar")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(
            CalendarPalette.secondaryGroupedBackground,
            in: RoundedRectangle(cornerRadius: 16, style: .continuous)
        )
    }

}

struct SharedInvitationAddButton: View {
    var isCalendar = false
    let busy: Bool
    var disabled = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Group {
                if busy {
                    HStack(spacing: 10) { ProgressView(); Text("Adding…") }
                } else if isCalendar {
                    Label("Add to Shared with me", systemImage: "person.2.badge.plus")
                } else {
                    Label("Add to Calendar", systemImage: "calendar.badge.plus")
                }
            }
            .labelStyle(.titleAndIcon)
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
        }
        .buttonStyle(.borderedProminent)
        .disabled(busy || disabled)
    }
}
