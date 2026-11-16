import UIKit
import EventKit

// Only app services/providers are doubles. The view, layout, colors and resize
// handles below are compiled directly from production sources by the runner.
enum SystemColors { static let label = UIColor.label }
@MainActor final class CalendarViewModel {
    static let shared = CalendarViewModel()
    var newEventCalendarColor: UIColor? = .systemBlue
}
enum SharedInviteTracker {
    static func isReadOnly(_ event: EventDescriptor) -> Bool { false }
    static func shouldAppearStruckThrough(_ event: EKEvent) -> Bool { false }
}
enum TestFormatting {
    static var locale = "en_US"
    static var timeFormat = "h:mm a"
}
func appTimeFormatter() -> DateFormatter {
    let result = DateFormatter(); result.locale = Locale(identifier: TestFormatting.locale)
    result.dateFormat = TestFormatting.timeFormat; return result
}
func appShortDateFormatter(includesYear: Bool) -> DateFormatter {
    let result = DateFormatter(); result.locale = Locale(identifier: TestFormatting.locale)
    result.dateFormat = includesYear ? "M/d/yy" : "M/d"; return result
}
class TestDescriptor: EventDescriptor {
    var dateInterval: DateInterval
    var isAllDay = false
    var text = "Multi-day conference"
    var attributedText: NSAttributedString? { nil }
    var lineBreakMode: NSLineBreakMode? { nil }
    var font: UIFont { .systemFont(ofSize: 12, weight: .semibold) }
    var color: UIColor { .systemBlue }
    var textColor: UIColor { color }
    var backgroundColor: UIColor { color.withAlphaComponent(0.3) }
    var editedEvent: EventDescriptor?
    var calendarID: String? { "test-calendar" }
    init(_ interval: DateInterval) { dateInterval = interval }
    func makeEditable() -> Self { editedEvent = self; return self }
    func commitEditing() { editedEvent = nil }
}
final class EKMultiDayWrapper: TestDescriptor {
    let realEvent: EKEvent
    var ekEvent: EKEvent { realEvent }
    init(_ interval: DateInterval, slice: DateInterval, store: EKEventStore) {
        realEvent = EKEvent(eventStore: store)
        realEvent.calendar = EKCalendar(for: .event, eventStore: store)
        realEvent.title = "Multi-day conference"
        realEvent.startDate = interval.start; realEvent.endDate = interval.end
        realEvent.location = "Sofia Expo Center"
        super.init(slice)
    }
}
final class AppLocalEventDescriptor: TestDescriptor {
    let originalInterval: DateInterval
    let eventID = "test-local-event"
    var location = "Sofia Expo Center"
    var notes = ""
    var isCancelled = false
    init(_ interval: DateInterval, slice: DateInterval) {
        originalInterval = interval; super.init(slice)
    }
}

@main final class EventViewTestApp: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    func application(_ application: UIApplication, didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let controller = UIViewController(); controller.view.backgroundColor = .systemBackground
        let label = UILabel(frame: CGRect(x: 20, y: 65, width: 350, height: 80))
        label.numberOfLines = 0; controller.view.addSubview(label)
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = controller; window?.makeKeyAndVisible()
        do {
            let cases = try runTests()
            label.text = "PASS: \(cases) production EventView rendering checks"
            showPreviewExamples(in: controller.view)
            try write(["status": "PASS", "checks": cases])
        } catch {
            label.text = "FAIL: \(error.localizedDescription)"
            try? write(["status": "FAIL", "error": error.localizedDescription])
        }
        return true
    }
    func showPreviewExamples(in host: UIView) {
        let rtl = host.effectiveUserInterfaceLayoutDirection == .rightToLeft
        TestFormatting.locale = rtl ? "ar_SA" : "en_US"
        TestFormatting.timeFormat = "h:mm a"
        let day = Calendar.current.startOfDay(for: Date())
        let original = DateInterval(start: day.addingTimeInterval((14 * 60 + 50) * 60), duration: 230 * 60)
        let descriptor = AppLocalEventDescriptor(original, slice: original)
        descriptor.text = rtl ? "اجتماع تخطيط المشروع" : "New event planning"
        descriptor.editedEvent = descriptor
        let examples: [(String, DateInterval?)] = [
            ("Original: 2:50 PM – 6:40 PM", nil),
            ("Drag: +30 minutes", DateInterval(start: original.start.addingTimeInterval(1800), duration: original.duration)),
            ("Resize: end at 8:00 PM", DateInterval(start: original.start, end: day.addingTimeInterval(20 * 3600)))
        ]
        for (index, example) in examples.enumerated() {
            let y = CGFloat(175 + index * 200)
            let caption = UILabel(frame: CGRect(x: 20, y: y, width: host.bounds.width - 40, height: 25))
            caption.font = .systemFont(ofSize: 15, weight: .semibold)
            caption.text = example.0
            host.addSubview(caption)
            let event = EventView(frame: .zero)
            host.addSubview(event)
            event.updateWithDescriptor(event: descriptor)
            // Deliberately assign the frame after the descriptor, like gestures.
            event.frame = CGRect(x: 20, y: y + 35, width: host.bounds.width - 40, height: 130)
            if let interval = example.1 { event.updateTimelinePreview(interval: interval) }
            event.layoutIfNeeded()
        }
    }
    func write(_ report: [String: Any]) throws {
        let documents = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        try JSONSerialization.data(withJSONObject: report, options: [.prettyPrinted, .sortedKeys])
            .write(to: documents.appendingPathComponent("result.json"), options: .atomic)
    }
    func runTests() throws -> Int {
        var checks = 0
        func check(_ value: Bool, _ message: String) throws {
            guard value else { throw NSError(domain: "EventViewRegression", code: 1, userInfo: [NSLocalizedDescriptionKey: message]) }
            checks += 1
        }
        let store = EKEventStore() // Unsaved objects only: never request access or write to EventKit.
        let calendar = Calendar.current
        let day = calendar.startOfDay(for: Date())
        let dayEnd = calendar.date(byAdding: .day, value: 1, to: day)!
        func date(_ hour: Double) -> Date { day.addingTimeInterval(hour * 3_600) }
        // The same view must use the CURRENT selected calendar, not a color
        // cached at launch / EventKit reload. Explicit MC columns override it.
        for rtl in [false, true] {
            for style in [UIUserInterfaceStyle.light, .dark] {
                let ghost = EventView(frame: CGRect(x: 0, y: 0, width: 220, height: 60))
                ghost.overrideUserInterfaceStyle = style
                ghost.semanticContentAttribute = rtl ? .forceRightToLeft : .forceLeftToRight
                func sameColor(_ actual: UIColor?, _ expected: UIColor) -> Bool {
                    actual?.resolvedColor(with: ghost.traitCollection).cgColor
                        == expected.resolvedColor(with: ghost.traitCollection).cgColor
                }
                for color in [UIColor.systemGreen, .systemPurple, .systemOrange, .systemBlue] {
                    CalendarViewModel.shared.newEventCalendarColor = color
                    ghost.updateWithDescriptor(event: BasicEvent())
                    ghost.applyGhostStyle()
                    ghost.layoutIfNeeded()
                    try check(sameColor(ghost.color, color), "Stale default ghost stripe")
                    try check(sameColor(ghost.textView.textColor, color), "Stale default ghost text")
                    try check(sameColor(ghost.backgroundColor, color.withAlphaComponent(0.3)), "Stale ghost fill")
                    ghost.applyGhostStyle(calendarColor: .systemRed)
                    try check(sameColor(ghost.color, .systemRed), "Pinned destination lost to new selection")
                    ghost.applyGhostColor(newColor: .systemTeal)
                    try check(sameColor(ghost.color, .systemTeal) && sameColor(ghost.textView.textColor, .systemTeal),
                              "MultiCalendar hover color did not follow column")
                }
            }
        }
        CalendarViewModel.shared.newEventCalendarColor = .systemBlue
        for local in [false, true] {
            for rtl in [false, true] {
                for style in [UIUserInterfaceStyle.light, .dark] {
                    let full = DateInterval(start: date(-12), end: date(34))
                    let slice = DateInterval(start: day, end: dayEnd)
                    let descriptor: TestDescriptor = local
                        ? AppLocalEventDescriptor(full, slice: slice)
                        : EKMultiDayWrapper(full, slice: slice, store: store)
                    let childFull = DateInterval(start: date(9), end: date(10))
                    let child = AppLocalEventDescriptor(childFull, slice: childFull)
                    let attrs = [EventLayoutAttributes(descriptor), EventLayoutAttributes(child)]
                    let placements = TimedEventLayout.place(attrs, day: day, originX: 0, width: 360,
                        top: 0, hourHeight: 50, gap: 2, rightToLeft: rtl)
                    let placement = placements.first { $0.attributes.descriptor === descriptor }!
                    let view = EventView(frame: placement.frame)
                    view.overrideUserInterfaceStyle = style
                    view.semanticContentAttribute = rtl ? .forceRightToLeft : .forceLeftToRight
                    view.updateWithDescriptor(event: descriptor)
                    view.applyTimelinePlacement(placement)
                    view.layoutIfNeeded()
                    let initialFrame = view.textView.frame
                    let initialColor = view.layer.backgroundColor
                    try check(initialFrame.height > 100, "Unselected continuation text is hidden: local=\(local), rtl=\(rtl), style=\(style.rawValue)")
                    try check(view.textView.text.contains("Multi-day conference") && view.textView.text.contains("Sofia Expo Center"), "Missing event name/metadata")
                    try check(initialFrame.maxY <= placement.textHeight, "Parent text overlaps a child")
                    let titleColor = view.textView.attributedText.attribute(.foregroundColor, at: 0, effectiveRange: nil) as! UIColor
                    // Both selection and deselection refresh every displayed
                    // descriptor, exactly as the production timeline does.
                    for selected in [true, false, true, false] {
                        descriptor.editedEvent = selected ? descriptor : nil
                        view.updateWithDescriptor(event: descriptor)
                        view.layoutIfNeeded()
                        try check(view.textView.frame == initialFrame, "Selection changed text clipping/visibility")
                        try check(view.layer.backgroundColor == initialColor, "Selection discarded the timeline palette")
                        try check(view.eventResizeHandles.allSatisfy { $0.isHidden == !selected },
                            "Deselecting/redrawing left resize handles visible")
                        let currentColor = view.textView.attributedText.attribute(.foregroundColor, at: 0, effectiveRange: nil) as! UIColor
                        try check(currentColor.isEqual(titleColor), "Selection changed title contrast")
                    }
                    // Reuse must clear the previous event's placement budget.
                    view.frame.size.height = 600
                    view.updateWithDescriptor(event: AppLocalEventDescriptor(childFull, slice: childFull))
                    view.layoutIfNeeded()
                    try check(view.textView.frame.height == 600, "Reused event retained stale clipping")
                }
            }
        }
        // Production ghosts are initialized before their real frame is known.
        // Exercise the same ordering, both providers, layout directions, themes
        // and formatting preferences, without ever writing an event.
        for local in [false, true] {
            for rtl in [false, true] {
                for style in [UIUserInterfaceStyle.light, .dark] {
                    for format in [("en_US", "h:mm a"), ("en_GB", "HH:mm"), ("ar_SA", "h:mm a")] {
                        TestFormatting.locale = format.0
                        TestFormatting.timeFormat = format.1
                        let title = format.0 == "ar_SA" ? "اجتماع تخطيط المشروع" : "New event planning"
                        let original = DateInterval(start: date(14 + 50.0 / 60), end: date(18 + 40.0 / 60))
                        let descriptor: TestDescriptor = local
                            ? AppLocalEventDescriptor(original, slice: original)
                            : EKMultiDayWrapper(original, slice: original, store: store)
                        descriptor.text = title
                        descriptor.editedEvent = descriptor
                        let ghost = EventView(frame: .zero)
                        ghost.overrideUserInterfaceStyle = style
                        ghost.semanticContentAttribute = rtl ? .forceRightToLeft : .forceLeftToRight
                        ghost.updateWithDescriptor(event: descriptor)
                        for width: CGFloat in [340, 40, 340, 100, 340] {
                            ghost.frame = CGRect(x: 0, y: 0, width: width, height: 250)
                            ghost.layoutIfNeeded()
                            if width == 340 {
                                try check(ghost.textView.text.hasPrefix(title), "Ghost kept the zero/narrow-width truncated title")
                                try check(ghost.textView.textContainer.maximumNumberOfLines == 0 || ghost.textView.textContainer.maximumNumberOfLines > 2, "Ghost kept the narrow-width line limit")
                            }
                            try check(ghost.textView.frame.width == width - 17, "Ghost text did not use its current width")
                        }
                        let source = EventView(frame: ghost.frame)
                        source.updateWithDescriptor(event: descriptor)
                        source.layoutIfNeeded()
                        let sourceText = source.textView.text
                        let drafts = [
                            DateInterval(start: date(15), duration: original.duration),
                            DateInterval(start: date(16), duration: original.duration),
                            DateInterval(start: original.start, end: date(20)), // bottom handle
                            DateInterval(start: date(13), end: original.end), // top handle
                            DateInterval(start: date(23 + 50.0 / 60), duration: original.duration),
                            DateInterval(start: date(24), duration: 51 * 3600),
                            original
                        ]
                        for draft in drafts {
                            ghost.updateTimelinePreview(interval: draft)
                            ghost.layoutIfNeeded()
                            try check(ghost.textView.text.hasPrefix(title), "Live time refresh lost the full title")
                            let time = appTimeFormatter()
                            let shortDate = appShortDateFormatter(includesYear: false)
                            let spansDays = !calendar.isDate(draft.start, inSameDayAs: draft.end)
                            func formatted(_ date: Date) -> String {
                                (spansDays ? shortDate.string(from: date) + " " : "") + time.string(from: date)
                            }
                            let expected = formatted(draft.start) + " - " + formatted(draft.end)
                            try check(ghost.textView.text.contains(expected), "Ghost displayed persisted/stale time instead of localized draft interval")
                            try check(descriptor.dateInterval == original && descriptor.timelineOriginalInterval == original,
                                "Preview mutated the backing event or slice")
                            try check(source.textView.text == sourceText, "Preview changed the source event")
                            let paragraph = ghost.textView.attributedText.attribute(.paragraphStyle, at: 0, effectiveRange: nil) as! NSParagraphStyle
                            try check(paragraph.alignment == (rtl ? .right : .left), "Ghost time refresh lost RTL alignment")
                        }
                        ghost.applyGhostColor(newColor: .systemPurple)
                        ghost.updateTimelinePreview(interval: drafts[1])
                        ghost.frame.size.width = 320
                        ghost.layoutIfNeeded()
                        let color = ghost.textView.attributedText.attribute(.foregroundColor, at: 0, effectiveRange: nil) as! UIColor
                        try check(color.isEqual(UIColor.systemPurple) && ghost.color.isEqual(UIColor.systemPurple),
                            "Time/bounds refresh lost the destination calendar color")
                        ghost.updateWithDescriptor(event: descriptor)
                        ghost.layoutIfNeeded()
                        try check(ghost.textView.text == sourceText, "Reusing/cancelling a ghost retained draft times")
                    }
                }
            }
        }
        // A nested child must not cover half of its parent's next text line.
        // Inspect actual laid-out glyph lines, not just the view's clip rect.
        for local in [false, true] {
            for rtl in [false, true] {
                for style in [UIUserInterfaceStyle.light, .dark] {
                    for width: CGFloat in [80, 100, 160, 340] {
                        for hourHeight: CGFloat in [25, 40, 50, 80] {
                            for childMinute in [5.0, 30, 45] {
                                let parentInterval = DateInterval(start: date(10), end: date(11.5))
                                let childInterval = DateInterval(start: date(10 + childMinute / 60), end: date(11 + childMinute / 120))
                                func descriptor(_ interval: DateInterval, title: String) -> TestDescriptor {
                                    let result: TestDescriptor = local
                                        ? AppLocalEventDescriptor(interval, slice: interval)
                                        : EKMultiDayWrapper(interval, slice: interval, store: store)
                                    result.text = title
                                    return result
                                }
                                let parent = descriptor(parentInterval, title: rtl ? "اجتماع تخطيط المشروع" : "Local Planning")
                                let child = descriptor(childInterval, title: rtl ? "الاجتماع التالي" : "Local Engineering")
                                let placements = TimedEventLayout.place(
                                    [EventLayoutAttributes(parent), EventLayoutAttributes(child)],
                                    day: day, originX: 0, width: width, top: 0, hourHeight: hourHeight, gap: 2, rightToLeft: rtl)
                                for placement in placements {
                                    let view = EventView(frame: placement.frame)
                                    view.overrideUserInterfaceStyle = style
                                    view.semanticContentAttribute = rtl ? .forceRightToLeft : .forceLeftToRight
                                    view.updateWithDescriptor(event: placement.attributes.descriptor)
                                    view.applyTimelinePlacement(placement)
                                    view.layoutIfNeeded()
                                    try check(placement.textHeight < 20 || !view.textView.isHidden,
                                        "A usable text area lost its title: width=\(width), hourHeight=\(hourHeight), minute=\(childMinute), textHeight=\(placement.textHeight), rtl=\(rtl)")
                                    if !view.textView.isHidden {
                                        let manager = view.textView.layoutManager
                                        manager.ensureLayout(for: view.textView.textContainer)
                                        var partial = false
                                        manager.enumerateLineFragments(forGlyphRange: manager.glyphRange(for: view.textView.textContainer)) { _, used, _, _, _ in
                                            if used.minY < view.textView.bounds.height && used.maxY > view.textView.bounds.height + 0.1 {
                                                partial = true
                                            }
                                        }
                                        try check(!partial, "Partial text line under nested block: width=\(width), hourHeight=\(hourHeight), minute=\(childMinute)")
                                    }
                                    try check(view.textView.frame.maxY <= placement.textHeight + 0.1,
                                        "Text view spills into a child's reserved area")
                                }
                            }
                        }
                    }
                }
            }
        }
        return checks
    }
}
