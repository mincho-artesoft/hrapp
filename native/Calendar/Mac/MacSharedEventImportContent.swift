#if os(macOS)
import SwiftUI
import EventKit

/// The same preview, destination row and primary action as SharedEventImportView.
struct MacSharedEventImportContent: View {
    let payload: SharedEventImportPayload
    let calendars: [EKCalendar]
    @Binding var calendarID: String
    let busy: Bool
    let error: String?
    let close: () -> Void
    let add: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            MacCalendarSheetHeader(title: Text("Shared event")) {
                AppToolbarTextButton("Close", action: close).disabled(busy)
            } trailing: { EmptyView() }
            ScrollView {
                VStack(spacing: 22) {
                    VStack(alignment: .leading, spacing: 10) {
                        Label(dateText, systemImage: "calendar").font(CalendarTypography.subheadline.weight(.semibold)).foregroundStyle(.secondary)
                        CalendarEventCard(title: payload.title, color: payload.eventColor, timeText: timeText,
                            location: payload.location, isAllDay: payload.isAllDay, titleSize: 16, detailSize: 14, titleLines: 3, detailLines: 3)
                    }.frame(maxWidth: .infinity, alignment: .leading)
                    HStack(spacing: 12) {
                        Label("Calendar", systemImage: "calendar").font(CalendarTypography.headline)
                        Spacer(minLength: 8)
                        if calendars.isEmpty { Text("Add a writable calendar first.").foregroundStyle(.secondary) }
                        else {
                            AppPicker("Calendar", selection: $calendarID) {
                                ForEach(calendars, id: \.calendarIdentifier) { calendar in
                                    Label {
                                        Text(calendar.title)
                                    } icon: {
                                        Circle().fill(Color(cgColor: calendar.cgColor)).frame(width: 16, height: 16)
                                    }.tag(calendar.calendarIdentifier)
                                }
                            }.labelsHidden().fixedSize()
                        }
                    }.padding(16)
                        .background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: 14))
                    if let error {
                        Label(error, systemImage: "exclamationmark.triangle.fill")
                            .foregroundStyle(.red).font(CalendarTypography.footnote).textSelection(.enabled)
                    }
                    Button(action: add) {
                        HStack(spacing: 10) {
                            if busy { ProgressView() }
                            Label(LocalizedStringKey(busy ? "Adding…" : "Add to Calendar"), systemImage: "calendar.badge.plus")
                        }.font(CalendarTypography.headline).frame(maxWidth: .infinity)
                    }.buttonStyle(AppActionButtonStyle(prominent: true, tint: .appBlue)).controlSize(.large).disabled(busy || calendarID.isEmpty || calendars.isEmpty)
                }.padding(24)
            }
        }.font(CalendarTypography.body)
            .background(CalendarPalette.groupedBackground)
            .frame(width: 600, height: 520)
            .interactiveDismissDisabled(busy)
    }
    private var dateText: String {
        let formatter = DateFormatter()
        formatter.locale = .appFormatting; formatter.timeZone = payload.timeZone
        formatter.setLocalizedDateFormatFromTemplate("EEEEyMMMMd")
        return formatter.string(from: payload.start)
    }
    private var timeText: String {
        guard !payload.isAllDay else { return NSLocalizedString("All-day event", comment: "") }
        let formatter = appTimeFormatter(); formatter.timeZone = payload.timeZone
        var calendar = Calendar.current; calendar.timeZone = payload.timeZone
        if !calendar.isDate(payload.start, inSameDayAs: payload.end) {
            let date = appShortDateFormatter(includesYear: false); date.timeZone = payload.timeZone
            return "\(date.string(from: payload.start)) \(formatter.string(from: payload.start)) – \(date.string(from: payload.end)) \(formatter.string(from: payload.end))"
        }
        return "\(formatter.string(from: payload.start)) – \(formatter.string(from: payload.end))"
    }
}
#endif
