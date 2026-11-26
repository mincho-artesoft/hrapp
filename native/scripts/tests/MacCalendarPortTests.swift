import Foundation
import EventKit

@main
struct MacCalendarPortTests {
    static func main() throws {
        let original = EKRecurrenceRule(recurrenceWith: .monthly, interval: 2,
            daysOfTheWeek: [EKRecurrenceDayOfWeek(.monday)], daysOfTheMonth: nil,
            monthsOfTheYear: nil, weeksOfTheYear: nil, daysOfTheYear: nil,
            setPositions: [-1], end: EKRecurrenceEnd(occurrenceCount: 4))
        let data = SharedEventRecurrenceRule(rule: original)
        let roundTrip = try JSONDecoder().decode(SharedEventRecurrenceRule.self, from: JSONEncoder().encode(data))
        let restored = roundTrip.makeRule()!
        assert(restored.interval == 2 && restored.setPositions?.first == -1)
        assert(restored.daysOfTheWeek?.first?.dayOfTheWeek == .monday)
        assert(restored.recurrenceEnd?.occurrenceCount == 4)
        var anchor = DeviceCalendarEvent(id: "series", title: "Series", start: "2026-01-26T10:00:00Z", end: "2026-01-26T11:00:00Z", allDay: false)
        anchor.details = ["timeZone": .string("UTC"), "recurrenceRules": .array([.object(try CalendarJSON.object(encoding: data))]), "futureField": .bool(true)]
        let expanded = AppLocalRecurrence.occurrences(of: anchor, from: anchor.startDate, to: DeviceCalendarEvent.date("2027-01-01T00:00:00Z")!)
        assert(expanded.map(\.start) == ["2026-01-26T10:00:00Z", "2026-03-30T10:00:00Z", "2026-05-25T10:00:00Z", "2026-07-27T10:00:00Z"])
        assert(expanded.allSatisfy { $0.id == anchor.id && $0.details?["futureField"] == .bool(true) })
        assert(anchor.start == "2026-01-26T10:00:00Z")
        let selected = expanded[1]
        let newTime = DateInterval(start: selected.startDate.addingTimeInterval(7_200), duration: 5_400)
        let move = try AppLocalRecurrence.reschedule(anchor, occurrence: selected.startDate,
            interval: newTime, allDay: false, span: .thisEvent)
        let stored = try JSONEncoder().encode([move.retained!, move.moved])
        let reloaded = try JSONDecoder().decode([DeviceCalendarEvent].self, from: stored)
        let remaining = AppLocalRecurrence.occurrences(of: reloaded[0], from: anchor.startDate,
            to: DeviceCalendarEvent.date("2027-01-01T00:00:00Z")!)
        assert(remaining.map(\.start) == expanded.filter { $0.start != selected.start }.map(\.start))
        assert(reloaded[0].start == anchor.start && reloaded[0].macRecurrenceRules == anchor.macRecurrenceRules)
        assert(reloaded[1].id != anchor.id && reloaded[1].macRecurrenceRules.isEmpty)
        assert(reloaded[1].startDate == newTime.start && reloaded[1].endDate == newTime.end)
        assert(reloaded[1].details?["futureField"] == .bool(true))
        // Independent clients must detach the same occurrence under one wire ID.
        var lesson = anchor
        lesson.id = "lesson"
        lesson.start = "2032-03-24T09:00:00Z"
        lesson.end = "2032-03-24T10:00:00Z"
        lesson.details?["recurrenceRules"] = .array([.object(["frequency": .number(0), "interval": .number(2), "occurrenceCount": .number(5)])])
        let dates = AppLocalRecurrence.occurrences(of: lesson, from: lesson.startDate,
            to: lesson.startDate.addingTimeInterval(10 * 86400))
        func detach(_ event: DeviceCalendarEvent, index: Int, offset: Double) throws -> [DeviceCalendarEvent] {
            let start = dates[index].startDate
            let move = try AppLocalRecurrence.reschedule(event, occurrence: start,
                interval: DateInterval(start: start.addingTimeInterval(offset), duration: 3600), allDay: false, span: .thisEvent)
            return [move.retained!, move.moved]
        }
        let first = try detach(lesson, index: 2, offset: 3600)
        var imported = lesson
        imported.id = DeviceCalendarReplica.accountEventID(lesson.id)
        let retry = try detach(imported, index: 2, offset: 7200)
        assert(first[1].id == "ecd6b4bb580e50e8caa1ffbe74a2b42ee2d3dd419f52247656bf53bb46046a85")
        assert(first[1].id == retry[1].id)
        let other = try detach(lesson, index: 3, offset: 7200)
        let merged = DeviceCalendarReplica.merge(base: [lesson], local: first, remote: other)
        let shown = merged.flatMap { AppLocalRecurrence.occurrences(of: $0, from: lesson.startDate,
            to: lesson.startDate.addingTimeInterval(10 * 86400)) }.map(\.startDate)
        assert(shown.count == 5 && !shown.contains(dates[2].startDate) && !shown.contains(dates[3].startDate))
        let same = try detach(lesson, index: 2, offset: 10800)
        let sameOccurrence = DeviceCalendarReplica.merge(base: [lesson], local: first, remote: same)
        assert(sameOccurrence.count == 2 && sameOccurrence.contains(same[1]))
        // All-day recurrence keeps local midnight through the spring DST change.
        var allDay = DeviceCalendarEvent(id: "dst", title: "All day", start: "2026-03-28T22:00:00Z", end: "2026-03-29T21:00:00Z", allDay: true)
        let daily = SharedEventRecurrenceRule(rule: EKRecurrenceRule(recurrenceWith: .daily, interval: 1, end: EKRecurrenceEnd(occurrenceCount: 2)))
        allDay.details = ["timeZone": .string("Europe/Sofia"), "recurrenceRules": .array([.object(try CalendarJSON.object(encoding: daily))])]
        let days = AppLocalRecurrence.occurrences(of: allDay, from: allDay.startDate, to: DeviceCalendarEvent.date("2026-04-01T00:00:00Z")!)
        assert(days.map(\.start) == ["2026-03-28T22:00:00Z", "2026-03-29T21:00:00Z"])
        assert(days.map(\.end) == ["2026-03-29T21:00:00Z", "2026-03-30T21:00:00Z"])
        // An event ending exactly at midnight must not bleed into the next day.
        let empty = AppLocalRecurrence.occurrences(of: anchor, from: DeviceCalendarEvent.date("2026-01-26T11:00:00Z")!, to: DeviceCalendarEvent.date("2026-01-27T00:00:00Z")!)
        assert(empty.isEmpty)
        print("PASS: recurrence metadata, ordinal/monthly expansion, series identity, DST and exclusive ends")
    }
}
