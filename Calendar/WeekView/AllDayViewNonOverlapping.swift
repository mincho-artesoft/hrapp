import UIKit
import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

// MARK: - AllDayViewNonOverlapping

public final class AllDayViewNonOverlapping: UIView, UIGestureRecognizerDelegate {
    
    public var fromDate: Date = Date()
    public var toDate: Date = Date()
    public var style = TimelineStyle()
    public var leadingInsetForHours: CGFloat = 0
    public var dayColumnWidth: CGFloat = 100
    public var autoResizeHeight = true
    public var fixedHeight: CGFloat = 40

    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?

    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet {
            setNeedsLayout()
        }
    }

    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView: EventDescriptor] = [:]

    // Тук вече няма логика за "editedEvent"

    // -- Жест за дълго задържане на празно място --
    private let longPressEmptySpace: UILongPressGestureRecognizer

    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?
    private var multiDayDraggingOriginalFrames: [EventView: CGRect] = [:]

    // MARK: - Initializers

    public override init(frame: CGRect) {
        // 1) Създаваме жеста без да подаваме target
        longPressEmptySpace = UILongPressGestureRecognizer()
        
        // 2) Първо извикваме super.init
        super.init(frame: frame)

        // 3) Сега вече свързваме жеста с self
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressEmptySpace(_:)))
        longPressEmptySpace.delegate = self
        addGestureRecognizer(longPressEmptySpace)

        backgroundColor = .systemGray5
    }

    required init?(coder: NSCoder) {
        // 1) Създаваме жеста без да подаваме target
        longPressEmptySpace = UILongPressGestureRecognizer()
        
        // 2) Първо извикваме super.init
        super.init(coder: coder)

        // 3) Сега вече свързваме жеста с self
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressEmptySpace(_:)))
        longPressEmptySpace.delegate = self
        addGestureRecognizer(longPressEmptySpace)

        backgroundColor = .systemGray5
    }

    // MARK: - Layout

    public override func layoutSubviews() {
        super.layoutSubviews()

        // Скриваме всичките (за да ги пренаредим)
        for ev in eventViews {
            ev.isHidden = true
        }

        if autoResizeHeight {
            recalcAllDayHeightDynamically()
        }

        let totalDays = dayCount
        if totalDays > 0 {
            let availableWidth = bounds.width - leadingInsetForHours
            let safeWidth = max(availableWidth, 0)
            dayColumnWidth = safeWidth / CGFloat(totalDays)
        } else {
            dayColumnWidth = 0
        }

        setNeedsDisplay()

        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        let maxEventsInAnyDay = grouped.values.map { $0.count }.max() ?? 0

        let baseY: CGFloat = 6
        let totalH = bounds.height
        let rowHeight = max(24, (totalH - baseY) / CGFloat(maxEventsInAnyDay == 0 ? 1 : maxEventsInAnyDay))

        var usedIndex = 0
        for dayIndex in 0..<dayCount {
            let dayEvents = grouped[dayIndex] ?? []
            for (i, attr) in dayEvents.enumerated() {
                let x = leadingInsetForHours + CGFloat(dayIndex) * dayColumnWidth + style.eventGap
                let y = baseY + CGFloat(i) * rowHeight + style.eventGap
                let w = dayColumnWidth - style.eventGap * 2
                let h = rowHeight - style.eventGap * 2

                let evView = ensureEventView(at: usedIndex)
                evView.isHidden = false
                evView.frame = CGRect(x: x, y: y, width: w, height: h)
                evView.updateWithDescriptor(event: attr.descriptor)

                eventViewToDescriptor[evView] = attr.descriptor
                usedIndex += 1
            }
        }
    }

    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        layoutBackground()
    }

    private func layoutBackground() {
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()

        // Вертикални линии
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))

        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: bounds.height))
        }

        // Хоризонтални линии (според броя all-day евенти)
        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        let maxEventsInAnyDay = grouped.values.map { $0.count }.max() ?? 0

        if autoResizeHeight {
            recalcAllDayHeightDynamically()
        }
        let baseY: CGFloat = 6
        let totalH = bounds.height
        let rowHeight = max(24, (totalH - baseY) / CGFloat(maxEventsInAnyDay == 0 ? 1 : maxEventsInAnyDay))

        for r in 0...maxEventsInAnyDay {
            let y = baseY + CGFloat(r) * rowHeight
            ctx.move(to: CGPoint(x: leadingInsetForHours, y: y))
            ctx.addLine(to: CGPoint(x: leadingInsetForHours + CGFloat(dayCount) * dayColumnWidth, y: y))
        }

        ctx.strokePath()
        ctx.restoreGState()
    }

    private func ensureEventView(at index: Int) -> EventView {
        if index < eventViews.count {
            return eventViews[index]
        } else {
            let v = createEventView()
            eventViews.append(v)
            return v
        }
    }

    private func createEventView() -> EventView {
        let ev = EventView()

        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        tapGR.delegate = self
        ev.addGestureRecognizer(tapGR)

        let pan = UIPanGestureRecognizer(target: self, action: #selector(handleEventViewPan(_:)))
        pan.delegate = self
        ev.addGestureRecognizer(pan)

        ev.isUserInteractionEnabled = true
        addSubview(ev)
        return ev
    }

    // MARK: - Gesture Handling

    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }
        onEventTap?(descriptor)
    }

    @objc private func handleEventViewPan(_ gesture: UIPanGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }

        switch gesture.state {
        case .began:
            setScrollsClipping(enabled: false)
            let loc = gesture.location(in: self)
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(x: loc.x - evView.frame.minX, y: loc.y - evView.frame.minY)

            if let multi = descriptor as? EKMultiDayWrapper {
                multiDayDraggingOriginalFrames.removeAll()
                let eventID = multi.realEvent.eventIdentifier
                for (otherView, otherDesc) in eventViewToDescriptor {
                    if let otherMulti = otherDesc as? EKMultiDayWrapper,
                       otherMulti.realEvent.eventIdentifier == eventID {
                        multiDayDraggingOriginalFrames[otherView] = otherView.frame
                    }
                }
            }

        case .changed:
            guard let offset = dragOffset else { return }
            let loc = gesture.location(in: self)
            var newFrame = evView.frame
            newFrame.origin.x = loc.x - offset.x
            newFrame.origin.y = loc.y - offset.y
            evView.frame = newFrame

            // Ако е многодневен, местим всички части
            if let origFrame = multiDayDraggingOriginalFrames[evView] {
                let deltaX = newFrame.origin.x - origFrame.origin.x
                let deltaY = newFrame.origin.y - origFrame.origin.y
                for (otherView, otherOrig) in multiDayDraggingOriginalFrames {
                    if otherView != evView {
                        otherView.frame = otherOrig.offsetBy(dx: deltaX, dy: deltaY)
                    }
                }
            }

        case .ended, .cancelled:
            setScrollsClipping(enabled: true)

            // Проверяваме дали евентът е „изпаднал“ от all-day зоната (надолу):
            if evView.frame.origin.y > self.bounds.height {
                // -> Преместваме го в "часовия" изглед (WeekTimelineViewNonOverlapping)
                if let container = self.superview,
                   let weekView = container.subviews.first(where: { $0 is WeekTimelineViewNonOverlapping })
                       as? WeekTimelineViewNonOverlapping {

                    let dropPoint = self.convert(evView.frame.origin, to: weekView)
                    if let newDate = weekView.dateFromPoint(dropPoint) {
                        descriptor.isAllDay = false
                        descriptor.dateInterval = DateInterval(start: newDate,
                                                               end: newDate.addingTimeInterval(3600))
                        weekView.onEventDragEnded?(descriptor, newDate)
                    } else {
                        if let orig = originalFrameForDraggedEvent {
                            evView.frame = orig
                        }
                    }
                } else {
                    if let orig = originalFrameForDraggedEvent {
                        evView.frame = orig
                    }
                }
            } else {
                // Остава в all-day (може да е сменил деня)
                if let newDayIndex = dayIndexFromMidX(evView.frame.midX),
                   let newDayDate = dayDateByAddingDays(newDayIndex) {
                    let cal = Calendar.current
                    let startOfDay = cal.startOfDay(for: newDayDate)
                    let endOfDay = cal.date(byAdding: .day, value: 1, to: startOfDay)!
                    descriptor.isAllDay = true
                    descriptor.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                    onEventDragEnded?(descriptor, startOfDay)
                } else if let orig = originalFrameForDraggedEvent {
                    evView.frame = orig
                }
            }

            dragOffset = nil
            originalFrameForDraggedEvent = nil
            multiDayDraggingOriginalFrames.removeAll()
            setNeedsLayout()

        default:
            break
        }
    }

    // -- Метод за дълго задържане в празно място --
    @objc private func handleLongPressEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        // Реагираме само при .began
        guard gesture.state == .began else { return }

        let location = gesture.location(in: self)
        
        // 1) Проверяваме дали е върху EventView
        let tappedEvent = eventViews.first(where: { !$0.isHidden && $0.frame.contains(location) })
        guard tappedEvent == nil else { return }

        // 2) Определяме деня
        guard let dayIndex = dayIndexFromMidX(location.x) else { return }

        // 3) Генерираме датата (startOfDay за дадения ден)
        guard let dayDate = dayDateByAddingDays(dayIndex) else { return }

        // 4) Извикваме callback-а
        onEmptyLongPress?(dayDate)
    }

    // MARK: - Helpers

    private var dayCount: Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let endOnly = cal.startOfDay(for: toDate)
        let comps = cal.dateComponents([.day], from: startOnly, to: endOnly)
        return (comps.day ?? 0) + 1
    }

    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let dateOnly = cal.startOfDay(for: date)
        let comps = cal.dateComponents([.day], from: startOnly, to: dateOnly)
        return comps.day ?? 0
    }

    private func recalcAllDayHeightDynamically() {
        if allDayLayoutAttributes.isEmpty {
            self.fixedHeight = 40
            return
        }
        let groupedByDay = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        let maxEventsInAnyDay = groupedByDay.values.map { $0.count }.max() ?? 0
        if maxEventsInAnyDay <= 1 {
            self.fixedHeight = 40
        } else {
            let rowHeight: CGFloat = 24
            let base: CGFloat = 10
            self.fixedHeight = base + (rowHeight * CGFloat(maxEventsInAnyDay))
        }
    }

    public func desiredHeight() -> CGFloat {
        return self.fixedHeight
    }

    private func dayIndexFromMidX(_ x: CGFloat) -> Int? {
        let colX = x - leadingInsetForHours
        let idx = Int(floor(colX / dayColumnWidth))
        if idx < 0 || idx >= dayCount { return nil }
        return idx
    }

    private func dayDateByAddingDays(_ dayIndex: Int) -> Date? {
        return Calendar.current.date(byAdding: .day,
                                     value: dayIndex,
                                     to: Calendar.current.startOfDay(for: fromDate))
    }

    private func setScrollsClipping(enabled: Bool) {
        // superview => allDayScrollView; superview?.superview => TwoWayPinnedWeekContainerView
        guard let container = self.superview?.superview as? TwoWayPinnedWeekContainerView else { return }
        container.allDayScrollView.clipsToBounds = enabled
    }

    // Позволяваме едновременно разпознаване на tap + pan + long press
    public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer,
                                  shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        if (gestureRecognizer is UITapGestureRecognizer && otherGestureRecognizer is UIPanGestureRecognizer) ||
           (gestureRecognizer is UIPanGestureRecognizer && otherGestureRecognizer is UITapGestureRecognizer) ||
           (gestureRecognizer is UILongPressGestureRecognizer && otherGestureRecognizer is UIPanGestureRecognizer) ||
           (gestureRecognizer is UIPanGestureRecognizer && otherGestureRecognizer is UILongPressGestureRecognizer) {
            return true
        }
        return false
    }
}
