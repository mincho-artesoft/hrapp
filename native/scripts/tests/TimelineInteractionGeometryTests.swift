import Foundation
import CoreGraphics

@main enum TimelineInteractionGeometryTests {
    static func main() {
        let base = Date(timeIntervalSince1970: 1_789_200_000)
        func hour(_ n: Double) -> Date { base.addingTimeInterval(n * 3600) }
        for duration in [0.5, 1, 24, 51, 96] {
            let original = DateInterval(start: hour(0), end: hour(duration))
            for delta in [-49.0, -1, 0, 0.5, 25] {
                for slice in [0.0, 12, 24, 48] {
                    let moved = TimelineInteractionGeometry.movedStart(
                        originalStart: original.start, sliceStart: hour(slice),
                        proposedSliceStart: hour(slice + delta))
                    precondition(moved == hour(delta), "Continuation offset was lost")
                    precondition(moved.addingTimeInterval(original.duration) == hour(delta + duration))
                }
            }
            let top = TimelineInteractionGeometry.resized(original, edge: hour(-0.5), isTop: true)
            precondition(top.start == hour(-0.5) && top.end == original.end)
            let bottom = TimelineInteractionGeometry.resized(original, edge: hour(duration + 0.5), isTop: false)
            precondition(bottom.start == original.start && bottom.end == hour(duration + 0.5))
            precondition(TimelineInteractionGeometry.resized(original, edge: original.end, isTop: true) == original)
            precondition(TimelineInteractionGeometry.resized(original, edge: original.start, isTop: false) == original)
        }
        for available: CGFloat in [250, 342, 800, 1024] {
            for count in 1...20 {
                let width = TimelineInteractionGeometry.columnWidth(available: available, count: count)
                precondition(width >= 100)
                precondition(width * CGFloat(count) >= available)
                if available / CGFloat(count) >= 100 { precondition(width == available / CGFloat(count)) }
            }
        }
        for zone in ["UTC", "Europe/Sofia", "America/Los_Angeles", "Asia/Riyadh"] {
            var calendar = Calendar(identifier: .gregorian)
            calendar.timeZone = TimeZone(identifier: zone)!
            for date in [
                calendar.date(from: DateComponents(year: 2026, month: 9, day: 8, hour: 23, minute: 58))!,
                calendar.date(from: DateComponents(year: 2026, month: 9, day: 8, hour: 14, minute: 0, second: 29))!,
                calendar.date(from: DateComponents(year: 2026, month: 3, day: 29, hour: 1, minute: 57))!,
                calendar.date(from: DateComponents(year: 2026, month: 10, day: 25, hour: 3, minute: 56))!
            ] {
                let snapped = TimelineInteractionGeometry.snappedToTenMinutes(date, calendar: calendar)
                let parts = calendar.dateComponents([.minute, .second], from: snapped)
                precondition(parts.minute! % 10 == 0 && parts.second == 0)
                precondition(abs(snapped.timeIntervalSince(date)) <= 300, "Snap changed the day or DST hour")
                precondition(TimelineInteractionGeometry.snappedToTenMinutes(snapped, calendar: calendar) == snapped)
            }
            for dayOffset in [-3, 0, 4] {
                let day = calendar.date(byAdding: .day, value: dayOffset, to: calendar.startOfDay(for: base))!
                for hourHeight: CGFloat in [25, 50, 80, 120] {
                    for duration: CGFloat in [0.5, 1, 2.5] {
                        for rawMinute: CGFloat in [-30, 0, 94, 578, 855, 1370, 1450] {
                            let frame = CGRect(x: 100, y: 10 + rawMinute / 60 * hourHeight,
                                width: 100, height: duration * hourHeight)
                            let placement = TimelineInteractionGeometry.creationPlacement(
                                frame: frame, day: day, topMargin: 10, hourHeight: hourHeight, calendar: calendar)!
                            let components = calendar.dateComponents([.hour, .minute], from: placement.interval.start)
                            let minute = components.hour! * 60 + components.minute!
                            precondition(minute % 10 == 0)
                            precondition(abs(placement.frame.minY - 10 - CGFloat(minute) / 60 * hourHeight) < 0.001)
                            precondition(abs(placement.interval.duration - Double(duration) * 3600) < 0.001)
                            let editor = EventEditorInitialSchedule.resolve(
                                day: day, exactInterval: placement.interval, isAllDay: false, now: base, calendar: calendar)
                            precondition(editor == placement.interval, "Editor changed the ghost's start/end")
                            let again = TimelineInteractionGeometry.creationPlacement(
                                frame: placement.frame, day: day, topMargin: 10, hourHeight: hourHeight, calendar: calendar)!
                            precondition(again.interval == editor, "Releasing preview rounded twice")
                        }
                    }
                }
            }
        }
        let names = [("system-work", "Team"), ("app-local-work", "Team"), ("system-personal", "Personal"), ("other-team", "Team")]
        func ordered(_ values: [(String, String)]) -> [String] {
            values.sorted { CalendarColumnOrder.precedes(title: $0.1, id: $0.0, otherTitle: $1.1, otherID: $1.0) }.map(\.0)
        }
        for permutation in [names, Array(names.reversed()), Array(names[1...]) + [names[0]]] {
            precondition(ordered(permutation) == ordered(names), "Same-name calendar columns swapped")
            precondition(Set(ordered(permutation)).count == 4, "Distinct calendar with same name was removed")
        }
        print("PASS: movement/resize, midnight/DST snapping, widths, 1008 creation preview/editor intervals across dates/time zones/zoom, stable same-name calendar order")
    }
}
