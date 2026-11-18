// Ported from Wonek Main/MacCalendarWeekCarousel.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI
import AppKit

/// Selection and paging are independent: picking a day moves only the marker,
/// while dragging/scrolling changes the displayed calendar week.
struct MacCalendarWeekCarousel: NSViewRepresentable {
    @ObservedObject private var appPreferences = AppPreferences.shared
    @Binding var selectedDate: Date
    @Environment(\.layoutDirection) private var layoutDirection
    func makeNSView(context: Context) -> MacCalendarWeekCarouselSurface { MacCalendarWeekCarouselSurface() }
    func updateNSView(_ view: MacCalendarWeekCarouselSurface, context: Context) {
        view.onSelect = { selectedDate = $0 }
        view.update(date: selectedDate, calendar: MacCalendarFormatting.calendar,
                    rightToLeft: layoutDirection == .rightToLeft)
    }
    static func dismantleNSView(_ view: MacCalendarWeekCarouselSurface, coordinator: ()) { view.stop() }
}

final class MacCalendarWeekCarouselSurface: NSView {
    override var isFlipped: Bool { true }
    override var acceptsFirstResponder: Bool { true }
    var onSelect: ((Date) -> Void)?
    private var calendar = Calendar.current
    private var selected = Date.distantPast
    private var visibleWeekStart = Date.distantPast
    private var offset: CGFloat = 0
    private var down: NSPoint?
    private var dragged = false
    private var rightToLeft = false
    private var animation: Timer?
    private var wheelEnd: DispatchWorkItem?
    private var dayWidth: CGFloat { bounds.width / 7 }

    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        // NSView defaults to unclipped drawing on macOS 14+. Overscan days
        // belong to this viewport, never the neighboring calendar sidebar.
        clipsToBounds = true
    }
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        clipsToBounds = true
    }

    func update(date: Date, calendar: Calendar, rightToLeft: Bool = false) {
        let calendarChanged = self.calendar != calendar
        if self.rightToLeft != rightToLeft {
            stop(); down = nil; dragged = false; offset = 0
            self.rightToLeft = rightToLeft
        }
        self.calendar = calendar
        if calendarChanged || !calendar.isDate(selected, inSameDayAs: date) {
            stop(); selected = calendar.startOfDay(for: date); offset = 0
            visibleWeekStart = CalendarWeekCarouselMath.weekStart(containing: selected, calendar: calendar)
        }
        needsDisplay = true
        updateAccessibility()
    }
    func stop() { animation?.invalidate(); animation = nil; wheelEnd?.cancel(); wheelEnd = nil }

    override func draw(_ dirtyRect: NSRect) {
        guard dayWidth > 0 else { return }
        NSGraphicsContext.saveGraphicsState()
        defer { NSGraphicsContext.restoreGraphicsState() }
        NSBezierPath(rect: bounds).addClip()
        let weekday = DateFormatter(); weekday.locale = .appFormatting; weekday.calendar = calendar
        weekday.timeZone = calendar.timeZone; weekday.setLocalizedDateFormatFromTemplate("EEEEE")
        let number = DateFormatter(); number.locale = .appFormatting; number.calendar = calendar
        number.timeZone = calendar.timeZone; number.setLocalizedDateFormatFromTemplate("d")
        let selectedFill = NSColor(AppColorPalette.blueViolet.primary)
        let first = Int(floor(offset / dayWidth)) - 1
        for index in first...(first + 9) {
            let date = CalendarWeekCarouselMath.date(from: visibleWeekStart, offset: index, calendar: calendar)
            let logicalX = CGFloat(index) * dayWidth - offset
            let x = rightToLeft ? bounds.width - dayWidth - logicalX : logicalX
            let today = calendar.isDateInToday(date)
            let isSelected = calendar.isDate(date, inSameDayAs: selected)
            let circle = NSRect(x: x + (dayWidth - 35) / 2, y: bounds.height / 2 - 2, width: 35, height: 35)
            if isSelected {
                (today ? NSColor.appRed : selectedFill).setFill()
                NSBezierPath(ovalIn: circle).fill()
            }
            drawText(weekday.string(from: date).uppercased(),
                in: NSRect(x: x, y: 0, width: dayWidth, height: bounds.height / 2),
                font: .systemFont(ofSize: 12), color: today ? .appRed : isSelected ? .labelColor : .secondaryLabelColor)
            drawText(number.string(from: date), in: circle,
                font: .systemFont(ofSize: 18, weight: .semibold), color: isSelected ? .white : today ? .appRed : .labelColor)
        }
    }
    private func drawText(_ text: String, in rect: NSRect, font: NSFont, color: NSColor) {
        let paragraph = NSMutableParagraphStyle(); paragraph.alignment = .center
        let attributed = NSAttributedString(string: text, attributes: [.font: font, .foregroundColor: color, .paragraphStyle: paragraph])
        let height = attributed.size().height
        attributed.draw(in: NSRect(x: rect.minX, y: rect.midY - height / 2, width: rect.width, height: height))
    }
    override func mouseDown(with event: NSEvent) {
        stop(); offset = 0; down = convert(event.locationInWindow, from: nil); dragged = false
        window?.makeFirstResponder(self)
    }
    override func mouseDragged(with event: NSEvent) {
        guard let down else { return }
        let point = convert(event.locationInWindow, from: nil)
        if abs(point.x - down.x) > 4 { dragged = true }
        if dragged { offset = (down.x - point.x) * (rightToLeft ? -1 : 1); needsDisplay = true }
    }
    override func mouseUp(with event: NSEvent) {
        guard let down, dayWidth > 0 else { return }
        self.down = nil
        let point = convert(event.locationInWindow, from: nil)
        if dragged {
            settle(days: CalendarWeekCarouselMath.pageOffset(translation: point.x - down.x,
                projected: point.x - down.x, width: bounds.width, rightToLeft: rightToLeft))
        } else if bounds.contains(point) {
            selectDay(at: CalendarWeekCarouselMath.visualDay(max(0, min(6, Int(point.x / dayWidth))),
                rightToLeft: rightToLeft))
        }
    }
    override func scrollWheel(with event: NSEvent) {
        // A neighboring timeline can forward an unconsumed wheel event at
        // its horizontal boundary. That must not page the selected week.
        guard bounds.contains(convert(event.locationInWindow, from: nil)) else { return }
        guard abs(event.scrollingDeltaX) > abs(event.scrollingDeltaY) || abs(offset) > 0 else {
            super.scrollWheel(with: event); return
        }
        animation?.invalidate(); animation = nil; wheelEnd?.cancel()
        offset -= event.scrollingDeltaX * (event.hasPreciseScrollingDeltas ? 1 : 12) * (rightToLeft ? -1 : 1)
        offset = min(bounds.width * 1.5, max(-bounds.width * 1.5, offset))
        needsDisplay = true
        let work = DispatchWorkItem { [weak self] in
            guard let self else { return }
            self.settle(days: CalendarWeekCarouselMath.pageOffset(translation: -self.offset, projected: -self.offset, width: self.bounds.width))
        }
        wheelEnd = work
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.16, execute: work)
    }
    override func keyDown(with event: NSEvent) {
        switch event.keyCode {
        case 123, 124:
            let direction = (event.keyCode == 123 ? -1 : 1) * (rightToLeft ? -1 : 1)
            if event.modifierFlags.contains(.option) { settle(days: direction * 7) }
            else {
                let date = CalendarWeekCarouselMath.date(from: selected, offset: direction, calendar: calendar)
                update(date: date, calendar: calendar, rightToLeft: rightToLeft)
                onSelect?(selected)
            }
        default: super.keyDown(with: event)
        }
    }
    private func selectDay(at index: Int) {
        stop(); offset = 0
        selected = CalendarWeekCarouselMath.date(from: visibleWeekStart, offset: index, calendar: calendar)
        needsDisplay = true
        updateAccessibility()
        onSelect?(selected)
    }
    private func settle(days: Int) {
        stop()
        let target = CGFloat(days) * dayWidth
        let start = offset
        let began = Date.timeIntervalSinceReferenceDate
        let duration = NSWorkspace.shared.accessibilityDisplayShouldReduceMotion ? 0.001 : 0.22
        let timer = Timer(timeInterval: 1.0 / 60, repeats: true) { [weak self] _ in
            MainActor.assumeIsolated {
                guard let self else { return }
                let progress = min(1, (Date.timeIntervalSinceReferenceDate - began) / duration)
                self.offset = start + (target - start) * (1 - pow(1 - progress, 3))
                self.needsDisplay = true
                if progress == 1 {
                    self.animation?.invalidate(); self.animation = nil
                    self.selected = CalendarWeekCarouselMath.date(from: self.selected, offset: days, calendar: self.calendar)
                    self.visibleWeekStart = CalendarWeekCarouselMath.date(from: self.visibleWeekStart, offset: days, calendar: self.calendar)
                    self.offset = 0
                    self.onSelect?(self.selected)
                    self.updateAccessibility()
                }
            }
        }
        animation = timer; RunLoop.main.add(timer, forMode: .common)
    }
    private func updateAccessibility() {
        setAccessibilityElement(false)
        setAccessibilityRole(.group)
        setAccessibilityLabel(NSLocalizedString("Choose day", comment: ""))
        let children = (0..<7).map { index -> MacCalendarAccessibleDay in
            let day = CalendarWeekCarouselMath.date(from: visibleWeekStart, offset: index, calendar: calendar)
            let element = MacCalendarAccessibleDay()
            element.setAccessibilityParent(self); element.setAccessibilityRole(.button)
            element.setAccessibilityEnabled(true)
            element.setAccessibilityIdentifier("week-carousel-day-\(index)")
            element.setAccessibilityLabel(day.appFormatted(time: false))
            element.setAccessibilityValue(calendar.isDate(day, inSameDayAs: selected) ? NSLocalizedString("Selected", comment: "") : "")
            element.setAccessibilityFrameInParentSpace(NSRect(
                x: CGFloat(CalendarWeekCarouselMath.visualDay(index, rightToLeft: rightToLeft)) * dayWidth,
                y: 0, width: dayWidth, height: bounds.height))
            element.action = { [weak self] in self?.selectDay(at: index) }
            return element
        }
        setAccessibilityChildren(children)
    }
    override func setFrameSize(_ newSize: NSSize) { super.setFrameSize(newSize); stop(); offset = 0; updateAccessibility(); needsDisplay = true }
}

private final class MacCalendarAccessibleDay: NSAccessibilityElement {
    var action: (() -> Void)?
    override func accessibilityPerformPress() -> Bool { action?(); return true }
}

#endif

#endif
