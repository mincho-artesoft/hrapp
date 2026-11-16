import Foundation

@main
enum EventDetailTimelineLayoutTests {
    typealias Item = EventDetailTimelineLayout.Item
    static let base = Date(timeIntervalSince1970: 1_788_825_600)
    static func date(_ hours: Double) -> Date { base.addingTimeInterval(hours * 3_600) }
    static func event(_ id: String, _ start: Double, _ end: Double) -> Item {
        Item(id: id, title: id, calendarTitle: "Calendar", start: date(start), end: date(end))
    }
    static func check(_ condition: @autoclosure () -> Bool, _ message: String) {
        precondition(condition(), message)
    }

    static func main() {
        let engine = EventDetailTimelineLayout(width: 264)
        let fixture = [event("Conference", -10, 50), event("Milestone", -3, 21),
            event("Lunch", 12, 13), event("Work", 13, 17), event("Team", 13.5, 17),
            event("Client", 14, 15.5), event("Same Start", 14, 15.5),
            event("Nested", 14.5, 15), event("Boundary", 15, 15.5), event("Release", 16, 16.5)]
        let result = engine.place(fixture)
        let byID = Dictionary(uniqueKeysWithValues: result.map { ($0.id, $0) })
        check(byID["Conference"]!.depth == 0 && byID["Milestone"]!.depth == 0, "Long events need two backdrop columns")
        check(byID["Work"]!.depth == 1 && byID["Team"]!.depth == 1, "Underlays should occupy separate shallow parents")
        check(byID["Client"]!.depth == 2 && byID["Same Start"]!.depth == 2, "Same-start pair should be nested siblings")
        check(byID["Client"]!.leading < byID["Same Start"]!.leading, "Tie-breaking must be stable")
        check(byID["Nested"]!.leading == byID["Boundary"]!.leading, "Adjacent half-hours must reuse a lane")
        check(byID["Release"]!.width > byID["Client"]!.width, "Later events should expand into vacant columns")
        check(byID["Work"]!.contentEnd == date(14), "Parent text must stop above its children")
        check(byID["Team"]!.contentEnd == date(14.5), "Second parent's text must stop above its children")
        let reversed = engine.place(fixture.reversed())
        check(result.map(\.id) == reversed.map(\.id), "Input/provider order must not change placement")
        check(result.map(\.leading) == reversed.map(\.leading), "Provider order changed column geometry")

        let sequential = engine.place((0..<8).map { event("Half-hour \($0)", 8 + Double($0)/2, 8.5 + Double($0)/2) })
        check(sequential.allSatisfy { $0.leading == 0 && $0.width == 264 }, "Independent half-hours should fill the timeline")
        let crossing = engine.place([event("A", 9, 11), event("B", 10, 12)])
        check(crossing.allSatisfy { $0.depth == 0 }, "Crossing events must not be nested")
        check(crossing[0].leading + crossing[0].width <= crossing[1].leading, "Crossing labels overlap")
        let short = engine.place([event("Short A", 9, 9.05), event("Short B", 9.1, 9.15)])
        check(short[0].leading + short[0].width <= short[1].leading, "Minimum-height short blocks overlap")
        let safeHeaders = EventDetailTimelineLayout(width: 100, minimumHeaderDuration: 24 * 60)
        let earlyChild = safeHeaders.place([event("Parent", 10, 12), event("Five minutes later", 10 + 5.0/60, 11)])
        check(earlyChild.allSatisfy { $0.depth == 0 }, "Child covers parent's first title line")
        check(earlyChild[0].leading + earlyChild[0].width <= earlyChild[1].leading, "Insufficient-header events need separate columns")
        let halfHourChild = safeHeaders.place([event("Parent", 10, 12), event("Half-hour child", 10.5, 11)])
        check(halfHourChild[1].depth == 1, "Valid nesting was removed despite room for a complete title")
        check(halfHourChild[0].contentEnd == date(10.5), "Parent label must stop before the half-hour child")

        // A short event starting together with a new multi-day event can use
        // an older underlay instead of reserving a fourth root for the day.
        let withOffscreenSibling = fixture + [event("Multi-Day Underlay", 10.5, 58.5), event("Morning sibling", 10.5, 11)]
        let afternoon = DateInterval(start: date(12.5), end: date(16.5))
        let visible = engine.place(withOffscreenSibling, in: afternoon)
        let roots = visible.filter { $0.depth == 0 }
        check(roots.count == 3, "An offscreen event reserved a root column")
        check(roots.allSatisfy { abs($0.width - 86) < 0.001 }, "Visible roots failed to use all three columns")
        check((roots.map { $0.leading + $0.width }.max() ?? 0) >= 263, "Unused trailing space in detail preview")
        check(!visible.contains { $0.id == "Morning sibling" }, "Offscreen sibling was not removed")
        let morning = engine.place(withOffscreenSibling, in: DateInterval(start: date(10), end: date(12)))
        check(morning.filter { $0.depth == 0 }.count == 3, "A short same-start event reserved a full-day root lane")
        check(morning.first { $0.id == "Morning sibling" }!.depth > 0, "Short event did not use an earlier underlay")
        let afternoonRoots = Set(roots.map(\.id))
        check(afternoonRoots.isSubset(of: Set(morning.filter { $0.depth == 0 }.map(\.id))), "Viewport clipping changed the containment tree")
        let childWindows = [event("Parent", 9, 18), event("Before window", 10, 12), event("Visible child", 11, 17)]
        let children = engine.place(childWindows, in: DateInterval(start: date(13), end: date(16)))
        let child = children.first { $0.id == "Visible child" }!
        check(child.leading == 10 && child.width == 254, "Offscreen nested sibling reserved an empty child lane")
        check(children.first { $0.id == "Parent" }!.contentEnd == date(10), "Clipping must not repeat parent text at the viewport top")
        check(engine.place(fixture, in: DateInterval(start: date(100), end: date(104))).isEmpty, "Empty viewport produced placements")
        let boundary = engine.place([event("Ends at window", 10, 12), event("Short ended before window", 11.75, 11.8), event("Starts at end", 16, 17), event("Inside", 12, 13)],
            in: DateInterval(start: date(12), end: date(16)))
        check(boundary.map(\.id) == ["Inside"] && boundary[0].width == 264, "Viewport boundaries reserved empty columns")
        for root in roots {
            check(abs(root.origin(in: 264, rightToLeft: true) + root.leading + root.width - 264) < 0.001, "Visible-window RTL mirroring regressed")
        }

        // Dense, deeply nested and narrow/RTL geometry must stay in bounds.
        let stress = fixture + (0..<30).map { event("Dense \($0)", 10 + Double($0)/12, 18 - Double($0)/12) }
        for width: CGFloat in [1, 80, 264, 600] {
            let placed = EventDetailTimelineLayout(width: width).place(stress)
            check(placed.count == stress.count, "An event was lost")
            for p in placed {
                check(p.width > 0 && p.leading >= 0 && p.leading + p.width <= width + 0.001, "LTR bounds failure for \(p.id)")
                let rtl = p.origin(in: width, rightToLeft: true)
                check(rtl >= -0.001 && rtl + p.width <= width + 0.001, "RTL bounds failure for \(p.id)")
                check(abs(rtl + p.leading + p.width - width) < 0.001, "Double RTL mirroring")
            }
        }
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(secondsFromGMT: 0)!
        let full = EventDetailTimelineLayout.window(start: date(14), end: date(15.5), allDay: false, calendar: calendar)
        let half = EventDetailTimelineLayout.window(start: date(14.5), end: date(15), allDay: false, calendar: calendar)
        check(full.hours == 4 && half.hours == 3, "Native long/short preview heights regressed")
        check(half.start.timeIntervalSince(full.start) == 3_600, "Half-hour preview anchoring regressed")
        print("PASS: backdrop, nested, same-start, crossing, sequential, short, expansion, clipping, stable-order, dense, RTL, viewport and offscreen-lane cases")
    }
}
