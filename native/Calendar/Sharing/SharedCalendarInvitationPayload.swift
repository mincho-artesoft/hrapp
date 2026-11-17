import SwiftUI

struct SharedCalendarInvitationPayload: Identifiable, Equatable {
    let ownerID: String
    let calendarID: String
    let title: String
    let colorHex: String

    var id: String { "\(ownerID):\(calendarID)" }

    init?(url: URL) {
        let scheme = url.scheme?.lowercased()
        let host = url.host?.lowercased()
        let isFullAppLink = scheme == "cloudcalendars" && host == "shared-calendar"
        let isServerLink = SharedInvitationServer.baseURL(for: url, route: "icloud-calendar-invites/open") != nil
        let isAppClipLink = scheme == "https" && host == "appclip.apple.com"

        guard isFullAppLink || isServerLink || isAppClipLink,
              let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        else { return nil }
        let values = Dictionary(
            uniqueKeysWithValues: (components.queryItems ?? []).map { ($0.name, $0.value ?? "") }
        )
        if isAppClipLink {
            guard values["calendarShare"] == "1" else { return nil }
        }
        guard let ownerID = values["o"], !ownerID.isEmpty,
              let calendarID = values["c"], !calendarID.isEmpty
        else { return nil }
        self.ownerID = ownerID
        self.calendarID = calendarID
        title = values["title"].flatMap { $0.isEmpty ? nil : $0 }
            ?? NSLocalizedString("Shared calendar", comment: "")
        colorHex = values["color"].flatMap { $0.isEmpty ? nil : $0 } ?? "#0088FF"
    }

    var color: Color {
        #if os(macOS)
        Color(hex: colorHex)
        #else
        Color(uiColor: uiColor)
        #endif
    }

    #if os(iOS)
    var uiColor: UIColor {
        let value = colorHex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        guard value.count == 6, let number = UInt64(value, radix: 16) else {
            return .systemBlue
        }
        return UIColor(
            red: CGFloat((number >> 16) & 0xFF) / 255,
            green: CGFloat((number >> 8) & 0xFF) / 255,
            blue: CGFloat(number & 0xFF) / 255,
            alpha: 1
        )
    }
    #endif
}
