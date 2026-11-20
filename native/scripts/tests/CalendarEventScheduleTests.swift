import EventKit
import Foundation

@main
struct CalendarEventScheduleTests {
    static func main() {
        let calendar = Calendar.current
        let start = calendar.startOfDay(for: Date())
        let store = EKEventStore()
        let event = EKEvent(eventStore: store)
        // Exercise creation, reuse of the same bridged event, and a timed edit.
        for length in [1, 3, 1] {
            let end = calendar.date(byAdding: .day, value: length, to: start)!
            event.applyCalendarSchedule(start: start, end: end, allDay: true, timeZone: .current)
            precondition(event.isAllDay && event.startDate == start && event.calendarRangeEnd == end)
            let details = SharedEventDetails(notes: nil, timeZone: TimeZone.current.identifier, availability: event.availability.rawValue)
            details.applyWritableFields(to: event)
            precondition(event.isAllDay && details.matchesWritableFields(of: event))
        }
        let timedEnd = start.addingTimeInterval(3600)
        event.applyCalendarSchedule(start: start, end: timedEnd, allDay: false, timeZone: .current)
        precondition(!event.isAllDay && event.calendarRangeEnd == timedEnd)
        precondition(event.timeZone?.identifier == TimeZone.current.identifier)
        print("PASS all-day timeline classification, exclusive dates and timed edits")
    }
}
