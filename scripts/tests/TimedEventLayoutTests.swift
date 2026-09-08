import Foundation
import CoreGraphics

// Provider stand-ins: compile the production UIKit adapter on the host without
// EventKit permissions or touching any simulator/calendar data.
protocol EventDescriptor: AnyObject {
    var text: String { get }
    var calendarID: String? { get }
    var dateInterval: DateInterval { get }
}
final class EventLayoutAttributes {
    let descriptor: EventDescriptor
    var frame = CGRect.zero
    init(_ descriptor: EventDescriptor) { self.descriptor = descriptor }
}
final class EKMultiDayWrapper: EventDescriptor {
    struct Event { let startDate: Date; let endDate: Date }
    let realEvent: Event
    let text: String
    let calendarID: String?
    let dateInterval: DateInterval
    init(_ title: String, _ start: Date, _ end: Date, _ calendar: String, slice: DateInterval) {
        text = title; calendarID = calendar; dateInterval = slice
        realEvent = Event(startDate: start, endDate: end)
    }
}
final class AppLocalEventDescriptor: EventDescriptor {
    let text: String
    let calendarID: String?
    let originalInterval: DateInterval
    let dateInterval: DateInterval
    init(_ title: String, _ start: Date, _ end: Date, _ calendar: String, slice: DateInterval) {
        text = title; calendarID = calendar; dateInterval = slice
        originalInterval = DateInterval(start: start, end: end)
    }
}

@main
enum TimedEventLayoutTests {
    @MainActor static func main() {
        let calendar = Calendar.current
        let day = calendar.startOfDay(for: Date(timeIntervalSince1970: 1_788_825_600))
        func date(_ hour: Double) -> Date { day.addingTimeInterval(hour * 3_600) }
        let fixture: [(String, Double, Double, String)] = [
            ("Conference", -10, 50, "Work"), ("Milestone", -3, 21, "Team"),
            ("Lunch", 12, 13, "Personal"), ("Work Underlay", 13, 17, "Work"),
            ("Team Underlay", 13.5, 17, "Team"), ("Client", 14, 15.5, "Work"),
            ("Same Start", 14, 15.5, "Team"), ("Nested", 14.5, 15, "Personal"),
            ("Boundary", 15, 15.5, "Personal"), ("Release", 16, 16.5, "Team")]
        func input(local: Bool) -> [EventLayoutAttributes] {
            fixture.map { title, start, end, cal in
                let slice = DateInterval(start: max(day, date(start)), end: min(date(24), date(end)))
                let descriptor: EventDescriptor = local
                    ? AppLocalEventDescriptor(title, date(start), date(end), cal, slice: slice)
                    : EKMultiDayWrapper(title, date(start), date(end), cal, slice: slice)
                return EventLayoutAttributes(descriptor)
            }
        }
        func layout(_ attrs: [EventLayoutAttributes], width: CGFloat = 340, origin: CGFloat = 60, rtl: Bool = false) -> [TimedEventLayout.Placement] {
            TimedEventLayout.place(attrs, day: day, originX: origin, width: width,
                top: 10, hourHeight: 50, gap: 2, rightToLeft: rtl)
        }
        let ek = layout(input(local: false))
        let local = layout(input(local: true))
        precondition(ek.map(\.frame) == local.map(\.frame), "Provider geometry differs")
        precondition(ek.filter { $0.depth == 0 }.count == 2, "Every event became a narrow root lane")
        let byTitle = Dictionary(uniqueKeysWithValues: ek.map { ($0.attributes.descriptor.text, $0) })
        precondition(byTitle["Conference"]!.frame.maxY == 1210, "Midnight collapsed to the top of the day")
        precondition(byTitle["Conference"]!.continuesFromPreviousDay, "Repeated continuation title")
        precondition(byTitle["Work Underlay"]!.textHeight == 48, "Parent text runs under children")
        precondition(byTitle["Release"]!.frame.width > byTitle["Same Start"]!.frame.width, "Free columns not reused")
        for width: CGFloat in [80, 160, 340] {
            let ltr = layout(input(local: true), width: width)
            let rtl = layout(input(local: true), width: width, rtl: true)
            for (a, b) in zip(ltr, rtl) {
                precondition(abs(a.frame.minX + b.frame.maxX - (120 + width)) < 0.001, "RTL not mirrored once")
                precondition(a.frame.minX >= 60 && a.frame.maxX <= 60 + width, "Column overflow")
                precondition(a.frame.height > 0 && a.textHeight >= 0, "Invalid text/block height")
            }
        }
        // MultiCalendar must nest only within its own calendar, never cross
        // the header boundary or put unknown calendars in the first column.
        let calendars = ["Work", "Team", "Personal"]
        for (index, cal) in calendars.enumerated() {
            let origin = CGFloat(index) * 160
            let placed = layout(input(local: true).filter { $0.descriptor.calendarID == cal }, width: 160, origin: origin)
            precondition(placed.allSatisfy { $0.frame.minX >= origin && $0.frame.maxX <= origin + 160 }, "Cross-calendar spill")
        }
        let tiny = EventLayoutAttributes(AppLocalEventDescriptor("Tiny", date(9), date(9.01), "Work",
            slice: DateInterval(start: date(9), end: date(9.01))))
        precondition(layout([tiny])[0].frame.height == 20, "Short event is an invisible line")
        print("PASS: UIKit adapter, local/EventKit parity, nesting, midnight, text clipping, column bounds, RTL and minimum height")
    }
}
