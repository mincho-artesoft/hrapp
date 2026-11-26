import Foundation

/// Local calendars and EventKit omit fields that do not apply to them. Fill
/// portable defaults before decoding, and compare values rather than wire shapes.
enum MacEventShareSnapshot {
    static func calendarEventID(_ localID: String) -> String {
        DeviceCalendarReplica.accountEventID(localID)
    }

    static func details(_ event: DeviceCalendarEvent) throws -> SharedEventDetails {
        var object = try CalendarJSON.object(encoding: SharedEventDetails(notes: nil, timeZone: nil))
        object.merge(event.details ?? [:]) { _, value in value }
        let value = try JSONDecoder().decode(SharedEventDetails.self, from: JSONEncoder().encode(object))
        return SharedEventDetails(notes: value.notes?.isEmpty == true ? nil : value.notes,
            timeZone: value.timeZone, availability: value.availability, alarms: value.alarms,
            recurrenceRules: value.recurrenceRules, excludedStarts: value.excludedStarts, structuredLocation: value.structuredLocation,
            videoCallURL: value.videoCallURL, organizer: value.organizer, attendees: value.attendees,
            travelTime: value.travelTime, attachments: value.attachments ?? [])
    }

    static func canonical(_ event: DeviceCalendarEvent) throws -> DeviceCalendarEvent {
        var value = event
        value.start = DeviceCalendarEvent.iso(event.startDate)
        value.end = DeviceCalendarEvent.iso(event.endDate)
        value.details = try CalendarJSON.object(encoding: details(event))
        value.updatedAt = nil
        return value
    }
}
