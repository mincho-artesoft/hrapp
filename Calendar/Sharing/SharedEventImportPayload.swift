import Foundation
import SwiftUI

struct SharedEventImportPayload: Identifiable, Equatable {
    static let appClipBundleIdentifier = "Deksan.CalendarASD.Clip"

    let sourceURL: URL
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let location: String?
    let timeZone: TimeZone
    let eventColorHex: String

    var id: String { sourceURL.absoluteString }

    var eventColor: Color {
        Color(sharedEventHex: eventColorHex) ?? .blue
    }

    init?(url: URL) {
        guard url.scheme?.lowercased() == "https",
              url.host?.lowercased() == "appclip.apple.com",
              let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        else { return nil }

        var values: [String: String] = [:]
        for item in components.queryItems ?? [] where values[item.name] == nil {
            values[item.name] = item.value ?? ""
        }

        guard values["p"] == Self.appClipBundleIdentifier,
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
        self.timeZone = values["timeZone"].flatMap(TimeZone.init(identifier:)) ?? .current
        self.eventColorHex = Self.validColorHex(rawColor) ? rawColor : "#0A84FF"
    }

    private static func validColorHex(_ value: String) -> Bool {
        let normalized = value.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        return normalized.count == 6 && UInt64(normalized, radix: 16) != nil
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
