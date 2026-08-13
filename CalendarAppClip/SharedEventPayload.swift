import Foundation
import SwiftUI

struct SharedEventPayload: Equatable {
    var title: String
    var start: Date
    var end: Date
    var isAllDay: Bool
    var location: String?
    var timeZone: TimeZone
    var eventColorHex: String

    var eventColor: Color {
        Color(hex: eventColorHex) ?? .blue
    }

    static let example = SharedEventPayload(
        title: String(localized: "Sample shared event"),
        start: Date().addingTimeInterval(3_600),
        end: Date().addingTimeInterval(7_200),
        isAllDay: false,
        location: String(localized: "Sofia"),
        timeZone: .current,
        eventColorHex: "#0A84FF"
    )

    init(
        title: String,
        start: Date,
        end: Date,
        isAllDay: Bool,
        location: String?,
        timeZone: TimeZone,
        eventColorHex: String
    ) {
        self.title = title
        self.start = start
        self.end = max(end, start)
        self.isAllDay = isAllDay
        self.location = location
        self.timeZone = timeZone
        self.eventColorHex = eventColorHex
    }

    init(url: URL) {
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        let values = Dictionary(
            uniqueKeysWithValues: (components?.queryItems ?? []).map { ($0.name, $0.value ?? "") }
        )

        let fallback = Self.example
        let start = values["start"].flatMap(TimeInterval.init).map(Date.init(timeIntervalSince1970:))
        let end = values["end"].flatMap(TimeInterval.init).map(Date.init(timeIntervalSince1970:))

        self.init(
            title: values["title"].flatMap { $0.isEmpty ? nil : $0 } ?? fallback.title,
            start: start ?? fallback.start,
            end: end ?? fallback.end,
            isAllDay: values["allDay"] == "1",
            location: values["location"].flatMap { $0.isEmpty ? nil : $0 },
            timeZone: values["timeZone"].flatMap(TimeZone.init(identifier:)) ?? .current,
            eventColorHex: values["color"].flatMap { $0.isEmpty ? nil : $0 }
                ?? fallback.eventColorHex
        )
    }
}

private extension Color {
    init?(hex: String) {
        let value = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        guard value.count == 6, let number = UInt64(value, radix: 16) else { return nil }
        self.init(
            red: Double((number >> 16) & 0xFF) / 255,
            green: Double((number >> 8) & 0xFF) / 255,
            blue: Double(number & 0xFF) / 255
        )
    }
}
