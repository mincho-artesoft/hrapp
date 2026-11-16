import SwiftUI

struct EventClipPreviewView: View {
    let payload: SharedEventPayload

    private var dateText: String {
        let formatter = DateFormatter()
        formatter.locale = .current
        formatter.timeZone = payload.timeZone
        formatter.setLocalizedDateFormatFromTemplate("EEEEyMMMMd")
        return formatter.string(from: payload.start)
    }

    private var timeText: String {
        guard !payload.isAllDay else {
            return String(localized: "All-day event")
        }

        let formatter = DateFormatter()
        formatter.locale = .current
        formatter.timeZone = payload.timeZone
        var calendar = Calendar.current
        calendar.timeZone = payload.timeZone
        formatter.setLocalizedDateFormatFromTemplate(calendar.isDate(payload.start, inSameDayAs: payload.end) ? "jm" : "MMMdjm")
        return "\(formatter.string(from: payload.start)) – \(formatter.string(from: payload.end))"
    }

    var body: some View {
        ZStack {
            Color(uiColor: .systemGroupedBackground).ignoresSafeArea()

            ScrollView {
                VStack(spacing: 22) {
                    header
                    eventCard
                    primaryAction
                    privacyNote
                }
                .padding(.horizontal, 22)
                .padding(.vertical, 28)
            }
        }
    }

    private var header: some View {
        VStack(spacing: 10) {
            Image("AppClipHeaderIcon")
                .resizable()
                .scaledToFit()
                .frame(width: 86, height: 86)

            Text("Cloud Calendars")
                .font(.headline)
                .foregroundStyle(.secondary)

            Text("Shared event")
                .font(.largeTitle.bold())
                .multilineTextAlignment(.center)
        }
    }

    private var eventCard: some View {
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

    private var privacyNote: some View {
        Label {
            Text("This App Clip only previews the event. Download Cloud Calendars to add it to your calendar.")
        } icon: {
            Image(systemName: "lock.shield")
        }
        .font(.footnote)
        .foregroundStyle(.secondary)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var primaryAction: some View {
        appStoreButton
    }

    private var appStoreButton: some View {
        Link(destination: URL(string: "https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319")!) {
            Label("Download Cloud Calendars", systemImage: "arrow.down.app.fill")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color.blue, in: Capsule())
                .foregroundStyle(.white)
        }
    }

}

#Preview {
    EventClipPreviewView(payload: .example)
}
