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
                    if subscriptionURL != nil {
                        subscribeButton
                    }
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

    /// The sender's feed, if this link carries one. Links made before sync
    /// existed have no feed, and those simply show no subscribe button.
    private var subscriptionURL: URL? {
        guard let feedID = payload.feedID, !feedID.isEmpty else { return nil }
        return URL(string: "webcal://cal.cloud-calendars.com/f/\(feedID).ics")
    }

    /// Subscribing is what turns a static invite into one that stays correct:
    /// the calendar app re-reads the feed on its own, so a change of time or a
    /// cancellation arrives without the sender having to send anything again.
    @ViewBuilder
    private var subscribeButton: some View {
        if let subscriptionURL {
            VStack(spacing: 8) {
                Link(destination: subscriptionURL) {
                    Label("Add to Calendar", systemImage: "calendar.badge.plus")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(payload.eventColor.opacity(0.95), in: Capsule())
                        .foregroundStyle(.white)
                }

                Text("You’ll see it update if the time changes or the event is called off.")
                    .font(.footnote)
                    .foregroundStyle(.white.opacity(0.66))
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private var privacyNote: some View {
        Label {
            Text(subscriptionURL == nil
                 ? "This App Clip only previews the event. It doesn’t access your calendars."
                 : "Adding the event hands it to your calendar app. This App Clip never reads your calendars.")
        } icon: {
            Image(systemName: "lock.shield")
        }
        .font(.footnote)
        .foregroundStyle(.white.opacity(0.72))
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var appStoreButton: some View {
        Link(destination: URL(string: "https://apps.apple.com/app/cloud-calendars/id6744690319")!) {
            Label("Download Cloud Calendars", systemImage: "arrow.down.app.fill")
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
