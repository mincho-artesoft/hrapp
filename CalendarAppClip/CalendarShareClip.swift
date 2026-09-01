import SwiftUI

struct ClipSharedCalendar: Equatable {
    let ownerID: String
    let calendarID: String
    let title: String
    let colorHex: String

    init?(url: URL) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return nil
        }
        let values = Dictionary(
            uniqueKeysWithValues: (components.queryItems ?? []).map { ($0.name, $0.value ?? "") }
        )
        guard values["calendarShare"] == "1",
              let ownerID = values["o"], !ownerID.isEmpty,
              let calendarID = values["c"], !calendarID.isEmpty
        else { return nil }
        self.ownerID = ownerID
        self.calendarID = calendarID
        title = values["title"].flatMap { $0.isEmpty ? nil : $0 } ?? "Shared calendar"
        colorHex = values["color"].flatMap { $0.isEmpty ? nil : $0 } ?? "#0088FF"
    }

    var fullAppURL: URL? {
        var components = URLComponents()
        components.scheme = "cloudcalendars"
        components.host = "shared-calendar"
        components.queryItems = [
            URLQueryItem(name: "o", value: ownerID),
            URLQueryItem(name: "c", value: calendarID),
            URLQueryItem(name: "title", value: title),
            URLQueryItem(name: "color", value: colorHex)
        ]
        return components.url
    }

    var color: Color {
        let value = colorHex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        guard value.count == 6, let number = UInt64(value, radix: 16) else { return .blue }
        return Color(
            red: Double((number >> 16) & 0xFF) / 255,
            green: Double((number >> 8) & 0xFF) / 255,
            blue: Double(number & 0xFF) / 255
        )
    }
}

struct CalendarClipPreviewView: View {
    let calendar: ClipSharedCalendar

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.02, green: 0.11, blue: 0.23),
                    Color(red: 0.04, green: 0.30, blue: 0.50)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            ScrollView {
                VStack(spacing: 22) {
                    header
                    calendarCard
                    appStoreButton
                    privacyNote
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

            Text("Shared calendar")
                .font(.largeTitle.bold())
                .multilineTextAlignment(.center)
        }
    }

    private var calendarCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Calendar invitation", systemImage: "calendar")
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white.opacity(0.72))
                .padding(.horizontal, 4)

            HStack(spacing: 10) {
                Image(systemName: "calendar")
                    .font(.headline.weight(.semibold))

                Text(calendar.title)
                    .font(.system(size: 16, weight: .bold))
                    .fixedSize(horizontal: false, vertical: true)
            }
            .foregroundStyle(calendar.color)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.leading, 8)
            .padding(.trailing, 5)
            .padding(.vertical, 10)
            .background(
                calendar.color.opacity(0.30),
                in: RoundedRectangle(cornerRadius: 9)
            )
            .overlay(alignment: .leading) {
                Capsule()
                    .fill(calendar.color)
                    .frame(width: 3)
                    .padding(.vertical, 5)
                    .padding(.leading, 4.5)
            }
        }
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

    private var privacyNote: some View {
        Label {
            Text(
                "This App Clip only previews the calendar invitation. "
                    + "Download Cloud Calendars to add it to Shared with me."
            )
        } icon: {
            Image(systemName: "lock.shield")
        }
        .font(.footnote)
        .foregroundStyle(.white.opacity(0.72))
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
