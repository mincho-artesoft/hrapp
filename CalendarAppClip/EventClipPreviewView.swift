import SwiftUI
import UIKit

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
                    primaryAction
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
            if fullAppImportURL == nil {
                Text("This App Clip only previews the event. Download Cloud Calendars to add it to your calendar.")
            } else {
                Text("Adding the event hands it to your calendar app. This App Clip never reads your calendars.")
            }
        } icon: {
            Image(systemName: "lock.shield")
        }
        .font(.footnote)
        .foregroundStyle(.white.opacity(0.72))
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    @ViewBuilder
    private var primaryAction: some View {
        if let fullAppImportURL {
            importButton(destination: fullAppImportURL)
        } else {
            appStoreButton
        }
    }

    private var fullAppImportURL: URL? {
        guard
            let feedID = payload.feedID?.trimmingCharacters(in: .whitespacesAndNewlines),
            !feedID.isEmpty
        else {
            return nil
        }

        var components = URLComponents()
        components.scheme = "cloudcalendars"
        components.host = "shared-event"
        components.queryItems = [
            URLQueryItem(name: "e", value: payload.eventID),
            URLQueryItem(name: "c", value: feedID),
            URLQueryItem(name: "title", value: payload.title),
            URLQueryItem(name: "start", value: String(payload.start.timeIntervalSince1970)),
            URLQueryItem(name: "end", value: String(payload.end.timeIntervalSince1970)),
            URLQueryItem(name: "allDay", value: payload.isAllDay ? "1" : "0"),
            URLQueryItem(name: "timeZone", value: payload.timeZone.identifier),
            URLQueryItem(name: "color", value: payload.eventColorHex),
            URLQueryItem(name: "location", value: payload.location)
        ]
        return components.url
    }

    private func importButton(destination: URL) -> some View {
        VStack(spacing: 8) {
            Button {
                openFullApp(destination)
            } label: {
                Label("Add to Calendar", systemImage: "calendar.badge.plus")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(payload.eventColor, in: Capsule())
                    .foregroundStyle(.white)
            }

            Text("You’ll see it update if the time changes or the event is called off.")
                .font(.footnote)
                .multilineTextAlignment(.center)
                .foregroundStyle(.white.opacity(0.72))
        }
    }

    private func openFullApp(_ destination: URL) {
        UIApplication.shared.open(destination, options: [:]) { opened in
            guard !opened,
                  let appStoreURL = URL(string: "https://apps.apple.com/app/cloud-calendars/id6744690319")
            else { return }
            UIApplication.shared.open(appStoreURL)
        }
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
