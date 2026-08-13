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
        formatter.setLocalizedDateFormatFromTemplate("jm")
        return "\(formatter.string(from: payload.start)) – \(formatter.string(from: payload.end))"
    }

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(red: 0.02, green: 0.11, blue: 0.23), Color(red: 0.04, green: 0.30, blue: 0.50)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 22) {
                    header
                    eventCard
                    privacyNote
                    appStoreButton
                }
                .padding(.horizontal, 22)
                .padding(.vertical, 28)
            }
        }
        .preferredColorScheme(.dark)
    }

    private var header: some View {
        VStack(spacing: 10) {
            Image("AppClipHeaderIcon")
                .resizable()
                .scaledToFit()
                .frame(width: 86, height: 86)

            Text("Cloud Calendars")
                .font(.headline)
                .foregroundStyle(.white.opacity(0.85))

            Text("Shared event")
                .font(.largeTitle.bold())
                .multilineTextAlignment(.center)
        }
    }

    private var eventCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(dateText, systemImage: "calendar")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white.opacity(0.72))
                .padding(.horizontal, 4)

            VStack(alignment: .leading, spacing: 7) {
                Text(payload.title)
                    .font(.system(size: 16, weight: .bold))
                    .fixedSize(horizontal: false, vertical: true)

                if !payload.isAllDay {
                    Label(timeText, systemImage: "clock")
                }

                if let location = payload.location {
                    Label(location, systemImage: "location")
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            .font(.system(size: 14, weight: .semibold))
            .foregroundStyle(payload.eventColor)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.leading, 8)
            .padding(.trailing, 5)
            .padding(.vertical, 3)
            .background(
                payload.eventColor.opacity(0.30),
                in: RoundedRectangle(cornerRadius: payload.isAllDay ? 9 : 5)
            )
            .overlay(alignment: .leading) {
                Capsule()
                    .fill(payload.eventColor)
                    .frame(width: 3)
                    .padding(.vertical, 5)
                    .padding(.leading, 4.5)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var privacyNote: some View {
        Label {
            Text("This App Clip only previews the event. It doesn’t access your calendars.")
        } icon: {
            Image(systemName: "lock.shield")
        }
        .font(.footnote)
        .foregroundStyle(.white.opacity(0.72))
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var appStoreButton: some View {
        Link(destination: URL(string: "https://apps.apple.com/app/cloud-calendars/id6744690319")!) {
            Label("Open Cloud Calendars", systemImage: "arrow.down.app.fill")
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(.white, in: Capsule())
                .foregroundStyle(Color(red: 0.02, green: 0.20, blue: 0.38))
        }
    }
}

#Preview {
    EventClipPreviewView(payload: .example)
}
