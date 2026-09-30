import Foundation

enum TravelRecurrenceTests {
    static func run() throws {
        let iso = ISO8601DateFormatter()
        func date(_ value: String) -> Date { iso.date(from: value)! }
        func rule(_ extra: [String: Any]) throws -> SharedEventRecurrenceRule {
            var object: [String: Any] = ["frequency": 0, "interval": 1]
            object.merge(extra, uniquingKeysWith: { _, new in new })
            return try JSONDecoder().decode(SharedEventRecurrenceRule.self, from: JSONSerialization.data(withJSONObject: object))
        }
        func expand(_ start: String, _ now: String, _ rule: SharedEventRecurrenceRule,
                    zone: String = "UTC", limit: Int = 8) -> [Date] {
            TravelRecurrence.starts(start: date(start), timeZone: zone, rules: [rule], after: date(now),
                before: date(now).addingTimeInterval(366 * 86400), limit: limit)
        }
        let daily = try rule([:])
        let future = expand("2026-09-01T09:00:00Z", "2026-09-30T12:00:00Z", daily)
        precondition(future.count == 8 && future.first == date("2026-10-01T09:00:00Z"), "Past DTSTART must still yield future occurrences")
        let counted = try rule(["occurrenceCount": 3])
        precondition(expand("2026-09-01T09:00:00Z", "2026-09-30T12:00:00Z", counted).isEmpty, "Count is measured from series start")
        precondition(expand("2026-09-29T09:00:00Z", "2026-09-30T12:00:00Z", counted) == [date("2026-10-01T09:00:00Z")])
        let until = try rule(["endDate": "2026-10-02T09:00:00Z"])
        precondition(expand("2026-09-01T09:00:00Z", "2026-09-30T12:00:00Z", until).count == 2, "UNTIL is inclusive")
        let weekly = try rule(["frequency": 1, "interval": 2, "daysOfTheWeek": [["weekday": 2, "weekNumber": 0], ["weekday": 4, "weekNumber": 0]]])
        precondition(expand("2026-09-07T09:00:00Z", "2026-09-23T12:00:00Z", weekly).prefix(2) == [date("2026-10-05T09:00:00Z"), date("2026-10-07T09:00:00Z")])
        let monthly = try rule(["frequency": 2])
        precondition(expand("2026-01-31T09:00:00Z", "2026-02-01T00:00:00Z", monthly).first == date("2026-03-31T09:00:00Z"), "Skip impossible month days")
        let lastDay = try rule(["frequency": 2, "daysOfTheMonth": [-1]])
        precondition(expand("2026-01-31T09:00:00Z", "2026-02-01T00:00:00Z", lastDay).first == date("2026-02-28T09:00:00Z"))
        let ordinal = try rule(["frequency": 2, "daysOfTheWeek": [["weekday": 2, "weekNumber": 2]]])
        precondition(expand("2026-01-12T09:00:00Z", "2026-02-01T00:00:00Z", ordinal).first == date("2026-02-09T09:00:00Z"))
        let lastWeekday = try rule(["frequency": 2, "daysOfTheWeek": (2...6).map { ["weekday": $0, "weekNumber": 0] }, "setPositions": [-1]])
        precondition(expand("2026-01-30T09:00:00Z", "2026-02-01T00:00:00Z", lastWeekday).first == date("2026-02-27T09:00:00Z"))
        let yearly = try rule(["frequency": 3, "monthsOfTheYear": [3, 9], "daysOfTheMonth": [15]])
        precondition(expand("2025-03-15T09:00:00Z", "2026-02-01T00:00:00Z", yearly).prefix(2) == [date("2026-03-15T09:00:00Z"), date("2026-09-15T09:00:00Z")])
        let dst = expand("2026-10-23T09:00:00+03:00", "2026-10-24T12:00:00+03:00", daily, zone: "Europe/Sofia")
        precondition(dst.first == date("2026-10-25T09:00:00+02:00"), "Keep the local event hour across DST")
        let duplicate = TravelRecurrence.starts(start: date("2026-10-01T09:00:00Z"), timeZone: "UTC", rules: [daily, daily],
            after: date("2026-09-30T12:00:00Z"), before: date("2026-10-04T00:00:00Z"))
        precondition(duplicate.count == 3 && Set(duplicate).count == 3, "Deduplicate DTSTART and overlapping rules")
        let clipped = TravelRecurrence.starts(start: date("2026-01-30T09:00:00Z"), timeZone: "UTC", rules: [lastWeekday],
            after: date("2026-02-01T00:00:00Z"), before: date("2026-02-15T00:00:00Z"))
        precondition(clipped.isEmpty, "Do not apply BYSETPOS to a truncated month")
        let spring = expand("2026-03-28T03:30:00+02:00", "2026-03-28T12:00:00+02:00", daily, zone: "Europe/Sofia")
        precondition(spring.first == date("2026-03-30T03:30:00+03:00"), "Skip nonexistent DST wall times")
        let oneOff = TravelRecurrence.starts(start: date("2026-10-01T09:00:00Z"), timeZone: "UTC", rules: [],
            after: date("2026-09-30T12:00:00Z"), before: date("2026-10-04T00:00:00Z"))
        precondition(oneOff == [date("2026-10-01T09:00:00Z")])
        let fractionalStart = date("2026-09-29T09:00:00Z").addingTimeInterval(0.25)
        let fractional = TravelRecurrence.starts(start: fractionalStart, timeZone: "UTC", rules: [counted],
            after: date("2026-09-30T12:00:00Z"), before: date("2026-10-05T00:00:00Z"))
        precondition(fractional == [date("2026-10-01T09:00:00Z").addingTimeInterval(0.25)], "Fractional DTSTART must count the first occurrence")
        let weekYear = try rule(["frequency": 3, "weeksOfTheYear": [1], "daysOfTheWeek": [["weekday": 2, "weekNumber": 0]]])
        precondition(expand("2024-01-01T09:00:00Z", "2025-09-30T12:00:00Z", weekYear).first == date("2025-12-29T09:00:00Z"), "ISO week year may begin in December")
        let yearDay = try rule(["frequency": 3, "daysOfTheYear": [-1]])
        precondition(expand("2024-12-31T09:00:00Z", "2025-09-30T12:00:00Z", yearDay).first == date("2025-12-31T09:00:00Z"))
        let leap = try rule(["frequency": 3])
        precondition(expand("2024-02-29T09:00:00Z", "2027-09-30T12:00:00Z", leap).first == date("2028-02-29T09:00:00Z"))
        let invalid = try rule(["interval": 0])
        precondition(expand("2026-09-01T09:00:00Z", "2026-09-30T12:00:00Z", invalid).isEmpty)
        let settings = TravelReminderSettings(transport: .walking, arrivalBufferMinutes: 20, advanceNoticeMinutes: 15)
        let restored = try JSONDecoder().decode(TravelReminderSettings.self, from: JSONEncoder().encode(settings))
        precondition(restored == settings)
        let event = date("2026-10-01T12:00:00Z")
        let departure = event.addingTimeInterval(-TimeInterval(settings.arrivalBufferMinutes * 60) - 1800)
        precondition(TravelReminderPolicy.notificationDate(start: event, departure: departure, now: date("2026-10-01T09:00:00Z"), advanceNotice: TimeInterval(settings.advanceNoticeMinutes * 60)) == date("2026-10-01T10:55:00Z"))
        precondition(settings.signature != TravelReminderSettings().signature, "Settings changes invalidate old route timings")
        print("PASS: 23 recurrence, DST, count, interval, deduplication and custom travel settings checks")
    }
}
