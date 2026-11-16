import EventKit
import Foundation

/// App-owned metadata for values shown by Calendar's editor but not exposed as
/// writable properties by EventKit's public EKEvent API.
struct EventKitEventSupplement: Codable, Equatable {
    var travelTime: TimeInterval?
    var attachments: [AppLocalEventAttachment]
    var videoCallURL: String?
}

@MainActor
enum EventKitEventSupplementStore {
    private static let fileName = "eventkit-event-supplements.json"

    static func supplement(for event: EKEvent) -> EventKitEventSupplement? {
        let values = load()
        return identifiers(for: event).lazy.compactMap { values[$0] }.first
    }

    @discardableResult
    static func update(
        travelTime: TimeInterval?,
        attachments: [AppLocalEventAttachment],
        videoCallURL: String? = nil,
        for event: EKEvent
    ) -> Bool {
        let value = EventKitEventSupplement(
            travelTime: travelTime,
            attachments: attachments,
            videoCallURL: videoCallURL
        )
        let keys = identifiers(for: event)
        guard !keys.isEmpty else { return false }

        var values = load()
        let changed = keys.contains { values[$0] != value }
        guard changed else { return false }
        for key in keys { values[key] = value }
        save(values)
        return true
    }

    @discardableResult
    static func update(details: SharedEventDetails?, for event: EKEvent) -> Bool {
        guard let details else { return false }
        return update(
            travelTime: details.travelTime,
            attachments: details.attachments?.map(AppLocalEventAttachment.init) ?? [],
            videoCallURL: details.videoCallURL,
            for: event
        )
    }

    static func remove(for event: EKEvent) {
        let keys = identifiers(for: event)
        guard !keys.isEmpty else { return }
        var values = load()
        let oldCount = values.count
        for key in keys { values.removeValue(forKey: key) }
        if values.count != oldCount { save(values) }
    }

    private static func identifiers(for event: EKEvent) -> [String] {
        [event.calendarItemIdentifier, event.eventIdentifier]
            .compactMap { $0?.trimmingCharacters(in: .whitespacesAndNewlines) }
            .filter { !$0.isEmpty }
    }

    private static var fileURL: URL? {
        guard let directory = FileManager.default.urls(
            for: .applicationSupportDirectory,
            in: .userDomainMask
        ).first else { return nil }
        try? FileManager.default.createDirectory(
            at: directory,
            withIntermediateDirectories: true
        )
        return directory.appendingPathComponent(fileName, isDirectory: false)
    }

    private static func load() -> [String: EventKitEventSupplement] {
        guard let fileURL,
              let data = try? Data(contentsOf: fileURL),
              let values = try? JSONDecoder().decode(
                [String: EventKitEventSupplement].self,
                from: data
              )
        else { return [:] }
        return values
    }

    private static func save(_ values: [String: EventKitEventSupplement]) {
        guard let fileURL,
              let data = try? JSONEncoder().encode(values)
        else { return }
        try? data.write(to: fileURL, options: .atomic)
    }
}
