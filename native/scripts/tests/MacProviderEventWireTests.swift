import Foundation
import EventKit

@main
struct MacProviderEventWireTests {
    static func main() throws {
        let raw: [String: Any] = ["id": "remote", "summary": "Call", "start": ["dateTime": "2026-11-16T11:00:00+02:00"], "end": ["dateTime": "2026-11-16T12:00:00+02:00"], "description": "Notes", "location": "Sofia"]
        let google = try MacCalendarProviderEventWire.event(raw, id: "local", google: true)
        assert(google.start == "2026-11-16T09:00:00Z" && google.end == "2026-11-16T10:00:00Z")
        var edited = google; edited.title = "Renamed"
        let patch = try MacCalendarProviderEventWire.body(edited, previous: google, google: true)
        assert(patch.count == 1 && patch["summary"] as? String == "Renamed", "A title edit must not overwrite provider metadata")
        let create1 = try MacCalendarProviderEventWire.body(google, previous: nil, google: true)
        let create2 = try MacCalendarProviderEventWire.body(google, previous: nil, google: true)
        assert(create1["id"] as? String == create2["id"] as? String, "Google creation retries need a stable ID")
        let microsoft = try MacCalendarProviderEventWire.event(["subject": "Meeting", "start": ["dateTime": "2026-11-16T09:00:00.0000000", "timeZone": "UTC"], "end": ["dateTime": "2026-11-16T10:00:00.0000000", "timeZone": "UTC"], "attendees": [["emailAddress": ["address": "test@example.com"]]]], id: "ms", google: false)
        assert(microsoft.start == google.start && microsoft.readOnly == true)
        let localized = try MacCalendarProviderEventWire.event(["subject": "Local", "start": ["dateTime": "2026-11-16T11:00:00.0000000", "timeZone": "Europe/Sofia"], "end": ["dateTime": "2026-11-16T12:00:00.0000000", "timeZone": "Europe/Sofia"]], id: "localized", google: false)
        assert(localized.start == google.start, "Graph's offset-free dates must use the returned time zone")
        var allDay = DeviceCalendarEvent(id: "all-day", title: "DST", start: "2026-03-28T22:00:00Z", end: "2026-03-29T21:00:00Z", allDay: true)
        allDay.details = ["timeZone": .string("Europe/Sofia")]
        let googleDay = try MacCalendarProviderEventWire.body(allDay, previous: nil, google: true)
        assert((googleDay["start"] as? [String: String])?["date"] == "2026-03-29")
        assert((googleDay["end"] as? [String: String])?["date"] == "2026-03-30")
        let msDay = try MacCalendarProviderEventWire.body(allDay, previous: nil, google: false)
        assert((msDay["start"] as? [String: String])?["dateTime"] == "2026-03-29T00:00:00")
        let rule = SharedEventRecurrenceRule(rule: EKRecurrenceRule(recurrenceWith: .monthly, interval: 2,
            daysOfTheWeek: [EKRecurrenceDayOfWeek(.monday)], daysOfTheMonth: nil, monthsOfTheYear: nil,
            weeksOfTheYear: nil, daysOfTheYear: nil, setPositions: [-1], end: EKRecurrenceEnd(occurrenceCount: 4)))
        edited.details?["recurrenceRules"] = .array([.object(try CalendarJSON.object(encoding: rule))])
        let googleSeries = try MacCalendarProviderEventWire.body(edited, previous: nil, google: true)
        assert((googleSeries["recurrence"] as? [String])?.first == "RRULE:FREQ=MONTHLY;INTERVAL=2;BYDAY=MO;BYSETPOS=-1;COUNT=4")
        let msSeries = try MacCalendarProviderEventWire.body(edited, previous: nil, google: false)
        let msRecurrence = msSeries["recurrence"] as! [String: Any]
        assert((msRecurrence["pattern"] as! [String: Any])["index"] as? String == "last")
        assert((msRecurrence["range"] as! [String: Any])["numberOfOccurrences"] as? Int == 4)
        do {
            _ = try MacCalendarProviderEventWire.event(["start": ["dateTime": "bad"], "end": ["dateTime": "bad"]], id: "bad", google: true)
            fatalError("Malformed ranges must abort synchronization, not silently delete the missing event")
        } catch {}
        print("PASS: Google/Microsoft timestamps, DST all-day ranges, minimal patches, retry IDs, recurrence and malformed-response protection")
    }
}
