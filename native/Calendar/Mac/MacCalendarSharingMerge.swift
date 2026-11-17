#if os(macOS)
import Foundation

/// Share snapshots use normalized portable fields before comparing three revisions.
@MainActor
enum MacCalendarSharingMerge {
    /// Received wire IDs are fingerprints; existing local IDs must remain stable.
    static func restoringLocalIDs(_ remote: [DeviceCalendarEvent], matching local: [DeviceCalendarEvent]) -> [DeviceCalendarEvent] {
        let ids = Dictionary(local.map { (MacEventShareSnapshot.calendarEventID($0.id), $0.id) }, uniquingKeysWith: { first, _ in first })
        return remote.map { event in
            var value = event
            value.id = ids[event.id] ?? event.id
            return value
        }
    }

    static func reconcile(base: [DeviceCalendarEvent], local: [DeviceCalendarEvent], remote: [DeviceCalendarEvent]) throws -> [DeviceCalendarEvent] {
        DeviceCalendarReplica.merge(base: try base.map(wireSnapshot),
            local: try local.map(wireSnapshot), remote: try remote.map(wireSnapshot))
    }

    static func wireSnapshot(_ event: DeviceCalendarEvent) throws -> DeviceCalendarEvent {
        var value = try MacEventShareSnapshot.canonical(event)
        // The sharing API has calendar-level access and does not carry this
        // device/provider flag. It must not trigger a change on every poll.
        value.readOnly = nil
        return value
    }

    static func preservingInFlightEdits(beforeUpload: [DeviceCalendarEvent], uploaded: [DeviceCalendarEvent], current: [DeviceCalendarEvent]) throws -> [DeviceCalendarEvent] {
        // The newest local snapshot gets conflict priority over the completed upload.
        try reconcile(base: beforeUpload, local: uploaded, remote: current)
    }
}

#endif
