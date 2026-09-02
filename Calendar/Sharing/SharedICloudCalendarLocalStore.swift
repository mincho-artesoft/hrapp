import EventKit
import SwiftUI
import UIKit
import CryptoKit

/// Maintains the local EventKit calendars that back calendar-level shares.
/// They stay hidden from the regular iCloud/Other sections and are rendered
/// exclusively under "Shared with me", where their selection controls event
/// visibility just like every other calendar row.
@MainActor
enum SharedICloudCalendarLocalStore {
    private static let defaultsKey = "SharedICloudCalendarLocalIdentifiers"
    private static let eventDefaultsKey = "SharedICloudCalendarLocalEventIdentifiers.v1"
    private static let ownedDefaultsKey = "SharedICloudCalendarOwnedIdentifiers.v1"
    private static let revokedDefaultsKey = "SharedICloudCalendarRevokedShareIDs.v1"
    private static var isRefreshing = false
    private static var isUploading = false
    private static var didDiscoverOwnedCalendars = false

    private static var identifiers: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: defaultsKey) as? [String: String] ?? [:]
        }
        set {
            UserDefaults.standard.set(newValue, forKey: defaultsKey)
        }
    }

    static var allLocalCalendarIdentifiers: Set<String> {
        Set(identifiers.values)
    }

    /// Safe for the synchronous event-rendering paths. Those views need to
    /// decide whether to draw a strike-through without starting an async sync.
    nonisolated static func isRevoked(localCalendarIdentifier: String) -> Bool {
        let mappings = UserDefaults.standard.dictionary(
            forKey: "SharedICloudCalendarLocalIdentifiers"
        ) as? [String: String] ?? [:]
        let revoked = Set(
            UserDefaults.standard.stringArray(
                forKey: "SharedICloudCalendarRevokedShareIDs.v1"
            ) ?? []
        )
        return mappings.contains {
            $0.value == localCalendarIdentifier && revoked.contains($0.key)
        }
    }

    private static var revokedShareIDs: Set<String> {
        get { Set(UserDefaults.standard.stringArray(forKey: revokedDefaultsKey) ?? []) }
        set { UserDefaults.standard.set(Array(newValue).sorted(), forKey: revokedDefaultsKey) }
    }

    private static var eventIdentifiers: [String: [String: String]] {
        get {
            UserDefaults.standard.dictionary(forKey: eventDefaultsKey) as? [String: [String: String]] ?? [:]
        }
        set {
            UserDefaults.standard.set(newValue, forKey: eventDefaultsKey)
        }
    }

    private static var ownedIdentifiers: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: ownedDefaultsKey) as? [String: String] ?? [:]
        }
        set {
            UserDefaults.standard.set(newValue, forKey: ownedDefaultsKey)
        }
    }

    static func registerOwnedCalendar(
        shareID: String,
        localCalendarIdentifier: String
    ) {
        var values = ownedIdentifiers
        values[shareID] = localCalendarIdentifier
        ownedIdentifiers = values
    }

    static func markOwnedCalendarDeleted(shareID: String) async {
        guard let session = CalendarFeedSession.existing else { return }
        do {
            try await CloudCalendarsAPI.deleteICloudCalendarSharing(
                calendarId: shareID,
                session: session
            )
            var values = ownedIdentifiers
            values.removeValue(forKey: shareID)
            ownedIdentifiers = values
        } catch {
            print(
                "Shared calendar deletion sync failed for \(shareID): "
                    + error.localizedDescription
            )
        }
    }

    /// Pushes the current owner-side EventKit calendar to the canonical S3
    /// snapshot. Metadata is included on every pass, which also repairs name
    /// and color changes made from the normal calendar editor.
    @discardableResult
    static func syncOwnedCalendars(in eventStore: EKEventStore) async -> Int {
        guard !isUploading, let session = CalendarFeedSession.existing else { return 0 }
        isUploading = true
        defer { isUploading = false }

        await discoverOwnedCalendars(in: eventStore, session: session)

        let calendar = Calendar.current
        let windowStart = calendar.date(byAdding: .year, value: -1, to: Date()) ?? Date()
        let windowEnd = calendar.date(byAdding: .year, value: 3, to: Date()) ?? Date()
        var synced = 0
        var validMappings = ownedIdentifiers

        for (shareID, localIdentifier) in ownedIdentifiers {
            guard let localCalendar = eventStore.calendar(withIdentifier: localIdentifier) else {
                do {
                    try await CloudCalendarsAPI.deleteICloudCalendarSharing(
                        calendarId: shareID,
                        session: session
                    )
                    validMappings.removeValue(forKey: shareID)
                } catch {
                    print(
                        "Shared calendar deletion sync failed for \(shareID): "
                            + error.localizedDescription
                    )
                }
                continue
            }

            do {
                let existing = try await CloudCalendarsAPI.iCloudCalendarSharing(
                    calendarId: shareID,
                    session: session
                )
                guard !existing.title.isEmpty else {
                    validMappings.removeValue(forKey: shareID)
                    continue
                }

                _ = try await CloudCalendarsAPI.saveICloudCalendarSharing(
                    calendarId: shareID,
                    title: localCalendar.title,
                    color: colorHex(localCalendar.cgColor),
                    timeZone: existing.timeZone,
                    recipients: existing.recipients.map {
                        (email: $0.email, access: $0.access)
                    },
                    session: session
                )

                let predicate = eventStore.predicateForEvents(
                    withStart: windowStart,
                    end: windowEnd,
                    calendars: [localCalendar]
                )
                let events = eventStore.events(matching: predicate)
                    .compactMap(portableEvent)
                    .sorted {
                        if $0.start == $1.start { return $0.id < $1.id }
                        return $0.start < $1.start
                    }
                try await CloudCalendarsAPI.saveICloudCalendarEvents(
                    calendarId: shareID,
                    events: events,
                    windowStart: windowStart,
                    windowEnd: windowEnd,
                    session: session
                )
                synced += 1
            } catch {
                print("Shared calendar upload failed for \(shareID): \(error.localizedDescription)")
            }
        }

        if validMappings != ownedIdentifiers { ownedIdentifiers = validMappings }
        return synced
    }

    /// Older app builds created the canonical S3 share before the local
    /// owner-calendar mapping existed. Discover those records once per app
    /// launch so existing shares start syncing without requiring the owner to
    /// open the sharing sheet or make a throwaway edit after updating.
    private static func discoverOwnedCalendars(
        in eventStore: EKEventStore,
        session: CloudCalendarsAPI.Session
    ) async {
        guard !didDiscoverOwnedCalendars else { return }

        var mappings = ownedIdentifiers
        var completed = true
        let receivedCalendarIDs = allLocalCalendarIdentifiers
        let candidates = eventStore.calendars(for: .event).filter { calendar in
            !receivedCalendarIDs.contains(calendar.calendarIdentifier)
                && (calendar.source.sourceType == .local || calendar.source.title == "iCloud")
        }

        for calendar in candidates {
            let shareID = SHA256.hash(data: Data(calendar.calendarIdentifier.utf8))
                .map { String(format: "%02x", $0) }
                .joined()
            do {
                let sharing = try await CloudCalendarsAPI.iCloudCalendarSharing(
                    calendarId: shareID,
                    session: session
                )
                if !sharing.title.isEmpty {
                    mappings[shareID] = calendar.calendarIdentifier
                }
            } catch {
                completed = false
                print(
                    "Shared calendar discovery failed for \(shareID): "
                        + error.localizedDescription
                )
            }
        }

        ownedIdentifiers = mappings
        didDiscoverOwnedCalendars = completed
    }

    static func localCalendar(
        for sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        in eventStore: EKEventStore
    ) -> EKCalendar? {
        guard let identifier = identifiers[sharedCalendar.id] else { return nil }
        return eventStore.calendar(withIdentifier: identifier)
    }

    /// Pulls calendar-level sharing metadata on the same foreground cadence as
    /// shared events. This keeps the recipient's local calendar name and color
    /// current even while the Calendars sheet is closed.
    @discardableResult
    static func refreshAll() async -> Int {
        guard !isRefreshing, let session = CalendarFeedSession.existing else {
            return 0
        }

        isRefreshing = true
        defer { isRefreshing = false }

        do {
            let sharedCalendars = try await CloudCalendarsAPI
                .iCloudCalendarsSharedWithMe(session: session)
            let eventStore = CalendarViewModel.shared.eventStore
            var changed = 0

            for sharedCalendar in sharedCalendars {
                let result = try reconcile(sharedCalendar, in: eventStore)
                if result.created {
                    CalendarViewModel.shared.selectedCalendarIDs.insert(
                        result.calendar.calendarIdentifier
                    )
                }
                if result.changed {
                    changed += 1
                }
            }

            if changed > 0 {
                CalendarViewModel.shared.reloadCalendars()
                NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            }
            return changed
        } catch {
            print("Shared calendar refresh failed: \(error.localizedDescription)")
            return 0
        }
    }

    @discardableResult
    static func reconcile(
        _ sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        in eventStore: EKEventStore
    ) throws -> (calendar: EKCalendar, created: Bool, changed: Bool) {
        let revocationChanged = setRevoked(
            sharedCalendar.isRevoked,
            shareID: sharedCalendar.id
        )
        if let existing = localCalendar(for: sharedCalendar, in: eventStore) {
            let color = uiColor(sharedCalendar.color)
            var changed = revocationChanged
            if existing.title != sharedCalendar.title
                || !colorsMatch(existing.cgColor, color.cgColor) {
                existing.title = sharedCalendar.title
                existing.cgColor = color.cgColor
                try eventStore.saveCalendar(existing, commit: true)
                changed = true
            }
            changed = try reconcileEvents(
                sharedCalendar,
                into: existing,
                eventStore: eventStore
            ) || changed
            return (existing, false, changed)
        }

        guard let source = eventStore.sources.first(where: { $0.sourceType == .local })
            ?? eventStore.defaultCalendarForNewEvents?.source
        else {
            throw SharedCalendarLocalError.noWritableSource
        }

        let calendar = EKCalendar(for: .event, eventStore: eventStore)
        calendar.title = sharedCalendar.title
        calendar.cgColor = uiColor(sharedCalendar.color).cgColor
        calendar.source = source
        try eventStore.saveCalendar(calendar, commit: true)

        var updated = identifiers
        updated[sharedCalendar.id] = calendar.calendarIdentifier
        identifiers = updated
        _ = try reconcileEvents(sharedCalendar, into: calendar, eventStore: eventStore)
        return (calendar, true, true)
    }

    @discardableResult
    private static func setRevoked(_ revoked: Bool, shareID: String) -> Bool {
        var values = revokedShareIDs
        let changed: Bool
        if revoked {
            changed = values.insert(shareID).inserted
        } else {
            changed = values.remove(shareID) != nil
        }
        if changed { revokedShareIDs = values }
        return changed
    }

    private static func portableEvent(
        _ event: EKEvent
    ) -> CloudCalendarsAPI.SharedICloudCalendarEvent? {
        guard let title = event.title?.trimmingCharacters(in: .whitespacesAndNewlines),
              !title.isEmpty,
              let start = event.startDate,
              let end = event.endDate
        else { return nil }
        let rawIdentifier = event.eventIdentifier ?? event.calendarItemIdentifier
        let eventID = SHA256.hash(data: Data(rawIdentifier.utf8))
            .map { String(format: "%02x", $0) }
            .joined()
        return .init(
            id: eventID,
            title: title,
            start: ISO8601DateFormatter().string(from: start),
            end: ISO8601DateFormatter().string(from: end),
            allDay: event.isAllDay,
            location: event.location,
            url: EventShareIdentity.shareableURL(from: event)?.absoluteString,
            details: SharedEventDetails(event: event)
        )
    }

    private static func reconcileEvents(
        _ sharedCalendar: CloudCalendarsAPI.SharedICloudCalendar,
        into localCalendar: EKCalendar,
        eventStore: EKEventStore
    ) throws -> Bool {
        var allMappings = eventIdentifiers
        var mapping = allMappings[sharedCalendar.id] ?? [:]
        let remoteEvents = sharedCalendar.events ?? []
        let remoteIDs = Set(remoteEvents.map(\.id))
        var changed = false

        for remote in remoteEvents {
            guard let start = remote.startDate, let end = remote.endDate else { continue }
            let event: EKEvent
            if let identifier = mapping[remote.id],
               let existing = eventStore.event(withIdentifier: identifier) {
                event = existing
            } else {
                event = EKEvent(eventStore: eventStore)
                event.calendar = localCalendar
            }

            var eventChanged = event.eventIdentifier == nil
            if event.calendar?.calendarIdentifier != localCalendar.calendarIdentifier {
                event.calendar = localCalendar
                eventChanged = true
            }
            if event.title != remote.title { event.title = remote.title; eventChanged = true }
            if event.startDate == nil || abs(event.startDate.timeIntervalSince(start)) >= 0.5 {
                event.startDate = start
                eventChanged = true
            }
            let safeEnd = max(start, end)
            if event.endDate == nil || abs(event.endDate.timeIntervalSince(safeEnd)) >= 0.5 {
                event.endDate = safeEnd
                eventChanged = true
            }
            if event.isAllDay != remote.allDay { event.isAllDay = remote.allDay; eventChanged = true }
            if normalized(event.location) != normalized(remote.location) {
                event.location = normalized(remote.location).isEmpty ? nil : remote.location
                eventChanged = true
            }
            let remoteURL = remote.url.flatMap(URL.init(string:))
            if event.url != remoteURL { event.url = remoteURL; eventChanged = true }
            if let details = remote.details, !details.matchesWritableFields(of: event) {
                details.applyWritableFields(to: event)
                eventChanged = true
            }

            if eventChanged {
                try eventStore.save(event, span: .thisEvent, commit: true)
                changed = true
            }
            if let identifier = event.eventIdentifier, mapping[remote.id] != identifier {
                mapping[remote.id] = identifier
            }
        }

        if let windowStart = sharedCalendar.windowStartDate,
           let windowEnd = sharedCalendar.windowEndDate {
            for (remoteID, localIdentifier) in Array(mapping) where !remoteIDs.contains(remoteID) {
                guard let localEvent = eventStore.event(withIdentifier: localIdentifier) else {
                    mapping.removeValue(forKey: remoteID)
                    continue
                }
                if localEvent.startDate < windowEnd && localEvent.endDate > windowStart {
                    try eventStore.remove(localEvent, span: .thisEvent, commit: true)
                    mapping.removeValue(forKey: remoteID)
                    changed = true
                }
            }
        }

        allMappings[sharedCalendar.id] = mapping
        eventIdentifiers = allMappings
        return changed
    }

    private static func uiColor(_ hex: String) -> UIColor {
        let raw = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        guard raw.count == 6, let value = UInt64(raw, radix: 16) else {
            return .systemBlue
        }
        return UIColor(
            red: CGFloat((value >> 16) & 0xFF) / 255,
            green: CGFloat((value >> 8) & 0xFF) / 255,
            blue: CGFloat(value & 0xFF) / 255,
            alpha: 1
        )
    }

    private static func colorHex(_ color: CGColor?) -> String {
        let color = UIColor(cgColor: color ?? UIColor.systemBlue.cgColor)
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        guard color.getRed(&red, green: &green, blue: &blue, alpha: &alpha) else {
            return "#0088FF"
        }
        return String(
            format: "#%02X%02X%02X",
            Int((red * 255).rounded()),
            Int((green * 255).rounded()),
            Int((blue * 255).rounded())
        )
    }

    private static func normalized(_ value: String?) -> String {
        value?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    }

    private static func colorsMatch(_ first: CGColor?, _ second: CGColor) -> Bool {
        guard let first else { return false }
        return UIColor(cgColor: first).isEqual(UIColor(cgColor: second))
    }
}

private enum SharedCalendarLocalError: LocalizedError {
    case noWritableSource

    var errorDescription: String? {
        "Couldn’t create the local backing calendar."
    }
}
