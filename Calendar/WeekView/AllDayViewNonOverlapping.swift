//
//  AllDayViewNonOverlapping.swift
//  CalendarKit
//
//  Updated to support dropping an event from the All‑Day view into the timeline (WeekTimelineViewNonOverlapping)
//  by converting it into a timed event if the drop location (in container coordinates) is inside the timeline area.
//

import UIKit
import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

public final class AllDayViewNonOverlapping: UIView, UIGestureRecognizerDelegate {
    
    public var fromDate: Date = Date()
    public var toDate: Date = Date()
    public var style = TimelineStyle()
    public var leadingInsetForHours: CGFloat = 0
    public var dayColumnWidth: CGFloat = 100
    public var autoResizeHeight = true
    public var fixedHeight: CGFloat = 40

    public var onEventTap: ((EventDescriptor) -> Void)?
    /// Callback for when a drag/drop operation ends.
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?

    /// Layout attributes for all‑day events.
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }
    
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView: EventDescriptor] = [:]
    
    // Gesture for long-press on empty space.
    private let longPressEmptySpace: UILongPressGestureRecognizer
    
    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?
    private var multiDayDraggingOriginalFrames: [EventView: CGRect] = [:]
    
    // MARK: - Initializers
    
    public override init(frame: CGRect) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(frame: frame)
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressEmptySpace(_:)))
        longPressEmptySpace.delegate = self
        addGestureRecognizer(longPressEmptySpace)
        backgroundColor = .systemGray5
    }
    
    required init?(coder: NSCoder) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(coder: coder)
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressEmptySpace(_:)))
        longPressEmptySpace.delegate = self
        addGestureRecognizer(longPressEmptySpace)
        backgroundColor = .systemGray5
    }
    
    // MARK: - Layout
    
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        // Hide all event views before re‑layout.
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
        
        // Group events by day and calculate each event’s frame.
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
        
        // Vertical lines
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: bounds.height))
        }
        
        // Horizontal lines
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
            dragOffset = CGPoint(x: loc.x - evView.frame.minX,
                                 y: loc.y - evView.frame.minY)
            
            // Ако евентът е EKMultiDayWrapper, пазим всички парчета (ако има)
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
            
            // Местене на всички парчета при EKMultiDayWrapper
            if let origFrame = multiDayDraggingOriginalFrames[evView] {
                let dx = newFrame.origin.x - origFrame.origin.x
                let dy = newFrame.origin.y - origFrame.origin.y
                for (otherV, origVFrame) in multiDayDraggingOriginalFrames {
                    if otherV != evView {
                        otherV.frame = origVFrame.offsetBy(dx: dx, dy: dy)
                    }
                }
            }
            
            // Ако искаме да показваме текущия час (10‑мин маркер) в колоната
            if let date = dateFromFrame(newFrame) {
                setSingle10MinuteMarkFromDate(date)
            }
            
        case .ended, .cancelled:
            setScrollsClipping(enabled: true)
            
            // 1) Намираме контейнера, който държи AllDayView + WeekTimelineView
            guard let container = self.superview?.superview as? TwoWayPinnedWeekContainerView else {
                // Ако няма container, връщаме на старо място
                if let orig = originalFrameForDraggedEvent {
                    evView.frame = orig
                }
                return
            }
            
            // 2) Координати на drop в контейнерната система
            let dropLocationInContainer = gesture.location(in: container)
            // Допълнително - координати в самия AllDayView (self)
            let dropLocationInAllDay = gesture.location(in: self)
            
            // === ВАЖНО: Първо проверяваме дали drop‑ът е в самия all‑day view ===
            if self.bounds.contains(dropLocationInAllDay) {
                // => събитието остава в all-day (преместваме го на друг ден)
                if let newDayIndex = dayIndexFromMidX(evView.frame.midX),
                   let newDayDate = dayDateByAddingDays(newDayIndex) {
                    
                    let cal = Calendar.current
                    let startOfDay = cal.startOfDay(for: newDayDate)
                    let endOfDay   = cal.date(byAdding: .day, value: 1, to: startOfDay)!
                    
                    descriptor.isAllDay = true
                    descriptor.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                    
                    print("AllDayView drop: Event dropped in all-day area. " +
                          "Day index: \(newDayIndex). Start: \(startOfDay), End: \(endOfDay)")
                    
                    onEventDragEnded?(descriptor, startOfDay)
                }
                else if let orig = originalFrameForDraggedEvent {
                    print("AllDayView drop: Could not compute valid day index. Reset.")
                    evView.frame = orig
                }
            }
            // === Ако НЕ е горе, проверяваме дали е в седмичния timeline (weekView) ===
            else if container.weekView.frame.contains(dropLocationInContainer) {
                // => Преобразуваме го в „timed event“
                let dropLocationInWeek = gesture.location(in: container.weekView)
                if let newDate = container.weekView.dateFromPoint(dropLocationInWeek) {
                    
                    descriptor.isAllDay = false
                    // Примерно: 1 час нова продължителност
                    let newEndDate = newDate.addingTimeInterval(3600)
                    descriptor.dateInterval = DateInterval(start: newDate, end: newEndDate)
                    
                    print("AllDayView drop: Event converted to timed. Start: \(newDate), End: \(newEndDate)")
                    container.weekView.onEventDragEnded?(descriptor, newDate)
                }
                else if let orig = originalFrameForDraggedEvent {
                    print("AllDayView drop: Invalid drop in WeekTimelineView. Reset.")
                    evView.frame = orig
                }
            }
            // === Иначе сме извън валидните зони => връщаме евента, откъдето го вдигнахме
            else {
                if let orig = originalFrameForDraggedEvent {
                    print("AllDayView drop: Dropped outside valid areas. Reset.")
                    evView.frame = orig
                }
            }
            
            // Финални операции
            dragOffset = nil
            originalFrameForDraggedEvent = nil
            multiDayDraggingOriginalFrames.removeAll()
            setNeedsLayout()
            
        default:
            break
        }
    }

    
    @objc private func handleLongPressEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let location = gesture.location(in: self)
        let tappedEvent = eventViews.first(where: { !$0.isHidden && $0.frame.contains(location) })
        guard tappedEvent == nil else { return }
        guard let dayIndex = dayIndexFromMidX(location.x) else { return }
        guard let dayDate = dayDateByAddingDays(dayIndex) else { return }
        onEmptyLongPress?(dayDate)
    }
    
    // MARK: - Helper Methods
    
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
    
    // Returns the day index based on a horizontal mid‑point.
    private func dayIndexFromMidX(_ x: CGFloat) -> Int? {
        let colX = x - leadingInsetForHours
        let idx = Int(floor(colX / dayColumnWidth))
        return (idx >= 0 && idx < dayCount) ? idx : nil
    }
    
    // Returns the date for the given day index.
    private func dayDateByAddingDays(_ dayIndex: Int) -> Date? {
        let cal = Calendar.current
        return cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate))
    }
    
    // Converts a given frame (typically of a dragged event) into a Date.
    private func dateFromFrame(_ frame: CGRect) -> Date? {
        let topY = frame.minY
        let midX = frame.midX
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate)) {
            if topY < 0 { return nil }
            return timeToDate(dayDate: dayDate, verticalOffset: topY)
        }
        return nil
    }
    
    // In the all‑day view, this method is a no‑op.
    private func setSingle10MinuteMarkFromDate(_ date: Date) { }
    
    private func timeToDate(dayDate: Date, verticalOffset: CGFloat) -> Date? {
        var hoursFloat = verticalOffset / (fixedHeight / 24)  // Simple scaling; adjust if needed.
        if hoursFloat < 0 { hoursFloat = 0 }
        if hoursFloat > 24 { hoursFloat = 24 }
        let hour = floor(hoursFloat)
        let minuteFloat = (hoursFloat - hour) * 60
        let minute = floor(minuteFloat)
        let cal = Calendar.current
        var comps = cal.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hour)
        comps.minute = Int(minute)
        comps.second = 0
        return cal.date(from: comps)
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
    
    // MARK: - Clipping Helper
    
    private func setScrollsClipping(enabled: Bool) {
        guard let container = self.superview?.superview as? TwoWayPinnedWeekContainerView else { return }
        container.allDayScrollView.clipsToBounds = enabled
    }
}
