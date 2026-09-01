import Foundation
import SwiftUI

extension URLComponents {
    /// Server invitation links use form-style query encoding, where a raw `+`
    /// represents a space. Decode the percent escapes only after normalising
    /// those separators so an actual plus encoded as `%2B` remains a plus.
    var sharedEventFormQueryValues: [String: String] {
        guard let percentEncodedQuery else { return [:] }

        var values: [String: String] = [:]
        for pair in percentEncodedQuery.split(
            separator: "&",
            omittingEmptySubsequences: false
        ) {
            let parts = pair.split(
                separator: "=",
                maxSplits: 1,
                omittingEmptySubsequences: false
            )
            let encodedName = parts.first.map(String.init) ?? ""
            let encodedValue = parts.count > 1 ? String(parts[1]) : ""
            let name = Self.decodeSharedEventFormComponent(encodedName)
            guard values[name] == nil else { continue }
            values[name] = Self.decodeSharedEventFormComponent(encodedValue)
        }
        return values
    }

    private static func decodeSharedEventFormComponent(_ value: String) -> String {
        let spacesNormalised = value.replacingOccurrences(of: "+", with: " ")
        return spacesNormalised.removingPercentEncoding ?? spacesNormalised
    }
}

struct SharedEventImportPayload: Identifiable, Equatable {
    static let appClipBundleIdentifier = "Deksan.CalendarASD.Clip"

    let sourceURL: URL
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let location: String?
    let eventURL: URL?
    let timeZone: TimeZone
    let eventColorHex: String

    /// Stable id of the event on the sender's side. Kept so that a later
    /// change to the same event can be matched to the copy we imported
    /// instead of adding a second one.
    let eventID: String?

    /// The feed this invite can be re-read from. Absent on links made before
    /// syncing existed, and those simply never update.
    let feedID: String?

    var id: String { sourceURL.absoluteString }

    /// True when this invite can be kept up to date; both ids are needed.
    var isSyncable: Bool {
        guard let eventID, let feedID else { return false }
        return !eventID.isEmpty && !feedID.isEmpty
    }

    var eventColor: Color {
        Color(sharedEventHex: eventColorHex) ?? .blue
    }

    init?(url: URL) {
        let scheme = url.scheme?.lowercased()
        let host = url.host?.lowercased()
        let isAppClipLink = scheme == "https" && host == "appclip.apple.com"
        let isServerInvitationLink = scheme == "https"
            && host == "api.cloud-calendars.com"
            && url.path == "/event-invites/open"
        let isFullAppHandoff = scheme == "cloudcalendars" && host == "shared-event"

        guard isAppClipLink || isServerInvitationLink || isFullAppHandoff,
              let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        else { return nil }

        let values = components.sharedEventFormQueryValues

        guard (isFullAppHandoff || isServerInvitationLink || values["p"] == Self.appClipBundleIdentifier),
              let rawTitle = values["title"]?.trimmingCharacters(in: .whitespacesAndNewlines),
              !rawTitle.isEmpty,
              let startTimestamp = values["start"].flatMap(TimeInterval.init),
              let endTimestamp = values["end"].flatMap(TimeInterval.init),
              startTimestamp.isFinite,
              endTimestamp.isFinite
        else { return nil }

        let start = Date(timeIntervalSince1970: startTimestamp)
        let end = Date(timeIntervalSince1970: endTimestamp)
        let maximumDuration: TimeInterval = 366 * 24 * 60 * 60
        guard end >= start, end.timeIntervalSince(start) <= maximumDuration else { return nil }

        let rawLocation = values["location"]?.trimmingCharacters(in: .whitespacesAndNewlines)
        let rawColor = values["color"] ?? "#0A84FF"

        self.sourceURL = url
        self.title = String(rawTitle.prefix(120))
        self.start = start
        self.end = end
        self.isAllDay = values["allDay"] == "1"
        self.location = rawLocation.flatMap { $0.isEmpty ? nil : String($0.prefix(160)) }
        self.eventURL = values["eventURL"].flatMap(Self.safeEventURL)
        self.timeZone = values["timeZone"].flatMap(TimeZone.init(identifier:)) ?? .current
        self.eventColorHex = Self.validColorHex(rawColor) ? rawColor : "#0A84FF"
        self.eventID = values["e"].flatMap { $0.isEmpty ? nil : $0 }
        self.feedID = values["c"].flatMap { $0.isEmpty ? nil : $0 }
    }

    private static func validColorHex(_ value: String) -> Bool {
        let normalized = value.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        return normalized.count == 6 && UInt64(normalized, radix: 16) != nil
    }

    private static func safeEventURL(_ value: String) -> URL? {
        guard value.count <= 1_024,
              !value.unicodeScalars.contains(where: CharacterSet.controlCharacters.contains),
              let url = URL(string: value)
        else { return nil }
        if let scheme = url.scheme?.lowercased(),
           ["cloudcalendars", "gcal", "mscal"].contains(scheme) {
            return nil
        }
        return url
    }
}

enum SharedEventImportHandoffStore {
    static let appGroupIdentifier = "group.ARTE-SOFT.sandBOX"
    private static let pendingURLKey = "sharedEventImport.pendingURL"
    private static let storedAtKey = "sharedEventImport.pendingURL.storedAt"
    private static let maximumHandoffAge: TimeInterval = 7 * 24 * 60 * 60

    static func takePendingPayload() -> SharedEventImportPayload? {
        guard let defaults = UserDefaults(suiteName: appGroupIdentifier) else { return nil }
        defer {
            defaults.removeObject(forKey: pendingURLKey)
            defaults.removeObject(forKey: storedAtKey)
        }

        guard let rawURL = defaults.string(forKey: pendingURLKey),
              let storedAt = defaults.object(forKey: storedAtKey) as? Date,
              abs(storedAt.timeIntervalSinceNow) <= maximumHandoffAge,
              let url = URL(string: rawURL)
        else { return nil }
        return SharedEventImportPayload(url: url)
    }

    static func clearPendingPayload() {
        guard let defaults = UserDefaults(suiteName: appGroupIdentifier) else { return }
        defaults.removeObject(forKey: pendingURLKey)
        defaults.removeObject(forKey: storedAtKey)
    }
}

private extension Color {
    init?(sharedEventHex: String) {
        let value = sharedEventHex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        guard value.count == 6, let number = UInt64(value, radix: 16) else { return nil }
        self.init(
            red: Double((number >> 16) & 0xFF) / 255,
            green: Double((number >> 8) & 0xFF) / 255,
            blue: Double(number & 0xFF) / 255
        )
    }
}
