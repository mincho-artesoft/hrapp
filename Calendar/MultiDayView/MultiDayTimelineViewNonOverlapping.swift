//
//  MultiDayTimelineViewNonOverlapping.swift
//  CalendarKit
//
//  Modified to avoid overlapping events, support drag/drop, resizing,
//  now makes the original event partially transparent (alpha = 0.3)
//  during dragging instead of completely hiding it.
//

import UIKit

public final class MultiDayTimelineViewNonOverlapping: UIView, UIGestureRecognizerDelegate {

    // MARK: - Local DateFormatter (for prints)
    private static let localFormatter: DateFormatter = {
        let df = DateFormatter()
        df.dateFormat = "yyyy-MM-dd HH:mm"
        df.timeZone = TimeZone.current // or "Europe/Sofia"
        return df
    }()

    // MARK: - Public Style / Config
    public var fromDate: Date = Date()
    public var toDate: Date = Date()
    public var style = TimelineStyle()

    /// Top margin so drawing aligns with HoursColumnView
    public var topMargin: CGFloat = 0

    public var leadingInsetForHours: CGFloat = 0
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50

    // The hours column view (to show minute markers, etc.)
    public weak var hoursColumnView: HoursColumnView?

    // MARK: - Public Callbacks
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date, Bool) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?
    /// If we drag a "timed" event upward into the all-day zone
    public var onEventConvertToAllDay: ((EventDescriptor, Int) -> Void)?

    // MARK: - Events to Layout
    /// These are the *regular* events (non-all-day) that won’t overlap
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // The actual event views
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView : EventDescriptor] = [:]

    // MARK: - Editing / Drag & Drop / Resize
    private var currentlyEditedEventView: EventView?

    // GHOSTS used while dragging (one ghost per day piece)
    private var draggingGhosts: [EventView: EventView] = [:]

    // We also keep a struct to store the original bounding times for multi-day drag.
    private let DRAG_DATA_KEY = "DragDataKey"

    // Used to remember original alpha for each event piece while dragging
    // so we can restore it once the drag ends.
    private var draggingOriginalAlphas: [EventView : CGFloat] = [:] // CHANGED/ADDED

    // Resizing uses a single ghostView
    private var ghostView: EventView?

    // MARK: - Auto-Scroll
    private var autoScrollDisplayLink: CADisplayLink?
    private var autoScrollDirection = CGPoint.zero

    // MARK: - Init
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = style.backgroundColor
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()
    }

    required public init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = style.backgroundColor
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()
    }

    // MARK: - Gestures for Empty Space
    private func setupLongPressForEmptySpace() {
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPressOnEmptySpace(_:)))
        lp.minimumPressDuration = 0.7
        addGestureRecognizer(lp)
    }

    private func setupTapOnEmptySpace() {
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleTapOnEmptySpace(_:)))
        tap.cancelsTouchesInView = false
        tap.delegate = self
        addGestureRecognizer(tap)
    }

    public override func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }

    @objc private func handleTapOnEmptySpace(_ gesture: UITapGestureRecognizer) {
        guard gesture.state == .ended else { return }
        // If there's an editedEventView, close it
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }
        // Remove marker
        hoursColumnView?.selectedMinuteMark = nil
        hoursColumnView?.setNeedsDisplay()
    }

    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)
        // Make sure it's not on top of an existing event
        for evView in eventViews {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        // If truly empty
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }
        // Callback
        if let tappedDate = dateFromPoint(point) {
            onEmptyLongPress?(tappedDate)
        }
    }

    // MARK: - Layout
    public override func layoutSubviews() {
        super.layoutSubviews()

        // 1) Hide all existing event views first
        for v in eventViews {
            v.isHidden = true
        }

        // 2) Layout the current list of events
        layoutRegularEvents()
    }

    private var dayCount: Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let endOnly = cal.startOfDay(for: toDate)
        let comps = cal.dateComponents([.day], from: startOnly, to: endOnly)
        return (comps.day ?? 0) + 1
    }

    private func layoutRegularEvents() {
        let groupedByDay = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        var usedEventViewIndex = 0

        for dayIndex in 0..<dayCount {
            guard let eventsForDay = groupedByDay[dayIndex], !eventsForDay.isEmpty else { continue }
            // Sort by start date
            let sorted = eventsForDay.sorted { $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start }

            // Build columns so they don’t overlap
            var columns: [[EventLayoutAttributes]] = []
            for attr in sorted {
                var placed = false
                for c in 0..<columns.count {
                    if !isOverlapping(attr, in: columns[c]) {
                        columns[c].append(attr)
                        placed = true
                        break
                    }
                }
                if !placed {
                    columns.append([attr])
                }
            }

            let colCount = CGFloat(columns.count)
            let columnWidth = (dayColumnWidth - style.eventGap * 2) / colCount

            for (colIndex, columnEvents) in columns.enumerated() {
                for attr in columnEvents {
                    let start = attr.descriptor.dateInterval.start
                    let end   = attr.descriptor.dateInterval.end

                    let yStart = topMargin + dateToY(start)
                    let yEnd   = topMargin + dateToY(end)

                    let x = leadingInsetForHours
                            + CGFloat(dayIndex) * dayColumnWidth
                            + style.eventGap
                            + columnWidth * CGFloat(colIndex)
                    let w = columnWidth - style.eventGap
                    let h = (yEnd - yStart) - style.eventGap

                    let evView = ensureRegularEventView(index: usedEventViewIndex)
                    usedEventViewIndex += 1
                    evView.isHidden = false
                    evView.frame = CGRect(x: x, y: yStart, width: w, height: h)
                    evView.updateWithDescriptor(event: attr.descriptor)
                    eventViewToDescriptor[evView] = attr.descriptor

                    // Multi-day handle logic for top/bottom handles
                    if let multiEvent = attr.descriptor as? EKMultiDayWrapper {
                        let firstDayIndex = dayIndexFor(multiEvent.realEvent.startDate)
                        let lastDayIndex  = dayIndexFor(multiEvent.realEvent.endDate)
                        if firstDayIndex == lastDayIndex {
                            // Single-day (though wrapped)
                            let showHandles = (attr.descriptor.editedEvent != nil)
                            evView.eventResizeHandles[0].isHidden = !showHandles
                            evView.eventResizeHandles[1].isHidden = !showHandles
                        } else if dayIndex == firstDayIndex {
                            // First day
                            evView.eventResizeHandles[0].isHidden = false
                            evView.eventResizeHandles[1].isHidden = true
                        } else if dayIndex == lastDayIndex {
                            // Last day
                            evView.eventResizeHandles[0].isHidden = true
                            evView.eventResizeHandles[1].isHidden = false
                        } else {
                            // Middle day(s)
                            evView.eventResizeHandles[0].isHidden = true
                            evView.eventResizeHandles[1].isHidden = true
                        }
                    } else {
                        // Normal single-day event
                        let showHandles = (attr.descriptor.editedEvent != nil)
                        evView.eventResizeHandles[0].isHidden = !showHandles
                        evView.eventResizeHandles[1].isHidden = !showHandles
                    }
                }
            }
        }
    }

    private func isOverlapping(_ candidate: EventLayoutAttributes, in columnEvents: [EventLayoutAttributes]) -> Bool {
        let candStart = candidate.descriptor.dateInterval.start
        let candEnd   = candidate.descriptor.dateInterval.end
        for ev in columnEvents {
            let evStart = ev.descriptor.dateInterval.start
            let evEnd   = ev.descriptor.dateInterval.end
            // overlap if (evStart < candEnd) AND (candStart < evEnd)
            if evStart < candEnd && candStart < evEnd {
                return true
            }
        }
        return false
    }

    private func ensureRegularEventView(index: Int) -> EventView {
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

        // Tap
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        tapGR.delegate = self
        ev.addGestureRecognizer(tapGR)

        // Long press
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewLongPress(_:)))
        lp.minimumPressDuration = 0.5
        lp.delegate = self
        ev.addGestureRecognizer(lp)

        // Pan for drag
        let pan = UIPanGestureRecognizer(target: self, action: #selector(handleEventViewPan(_:)))
        pan.delegate = self
        ev.addGestureRecognizer(pan)

        // Resize handles
        for handle in ev.eventResizeHandles {
            let panResize = UIPanGestureRecognizer(target: self, action: #selector(handleResizeHandlePanGesture(_:)))
            panResize.delegate = self

            let lpResize = UILongPressGestureRecognizer(target: self, action: #selector(handleResizeHandleLongPressGesture(_:)))
            lpResize.delegate = self
            lpResize.minimumPressDuration = 0.4
            lpResize.require(toFail: panResize)

            handle.addGestureRecognizer(panResize)
            handle.addGestureRecognizer(lpResize)
        }

        ev.isUserInteractionEnabled = true
        addSubview(ev)
        return ev
    }

    // MARK: - Gesture: Tap on event
    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }

        // Close any other editedEvent
        if let oldView = currentlyEditedEventView, oldView !== tappedView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
        }

        // Mark this as editing
        descriptor.editedEvent = descriptor
        tappedView.updateWithDescriptor(event: descriptor)
        currentlyEditedEventView = tappedView

        setSingle10MinuteMarkFromDate(descriptor.dateInterval.start)
        onEventTap?(descriptor)
    }

    @objc private func handleEventViewLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        if gesture.state == .began {
            // If we have another edited event, close it
            if let oldView = currentlyEditedEventView,
               oldView !== evView,
               let oldDesc = eventViewToDescriptor[oldView] {
                oldDesc.editedEvent = nil
                oldView.updateWithDescriptor(event: oldDesc)
            }
            // Mark this one as editing
            if descriptor.editedEvent == nil {
                descriptor.editedEvent = descriptor
                evView.updateWithDescriptor(event: descriptor)
            }
            currentlyEditedEventView = evView
        }
    }

    // MARK: - Draggable Data
    /// For dragging a multi-day event so each day’s ghost can show the
    /// *full bounding range* (e.g. 53 hours total).
    private struct DragData {
        let originalBoundingStart: Date
        let originalBoundingEnd: Date
        let totalDuration: TimeInterval
        let startGlobalPoint: CGPoint
        let anchorDayY: CGFloat
        let anchorDate: Date
    }

    // MARK: - Pan (drag) the whole event
    @objc private func handleEventViewPan(_ gesture: UIPanGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }

        if currentlyEditedEventView !== evView {
            selectEventView(evView)
        }

        // We need the container for possible auto-scroll
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }

        switch gesture.state {
        case .began:
            // Turn off clipping so we can drag out of bounds
            setScrollsClipping(enabled: false)

            // Gather bounding start/end (multi-day uses real event range, single-day uses dateInterval)
            let realStart: Date
            let realEnd: Date
            if let multi = descriptor as? EKMultiDayWrapper {
                realStart = multi.realEvent.startDate
                realEnd   = multi.realEvent.endDate
            } else {
                realStart = descriptor.dateInterval.start
                realEnd   = descriptor.dateInterval.end
            }
            let totalDuration = realEnd.timeIntervalSince(realStart)

            let startGlobal = gesture.location(in: self.window)

            // We'll treat the "anchorDate" as the top date of the piece we grabbed
            let anchorDate = descriptor.dateInterval.start
            let anchorDayY = evView.frame.minY

            // Find all day pieces for the same real event if multi-day
            var multiDayViews: [EventView] = []
            if let multi = descriptor as? EKMultiDayWrapper {
                let eventID = multi.realEvent.eventIdentifier
                for (otherView, otherDesc) in eventViewToDescriptor {
                    if let otherMulti = otherDesc as? EKMultiDayWrapper,
                       otherMulti.realEvent.eventIdentifier == eventID {
                        multiDayViews.append(otherView)
                    }
                }
            } else {
                multiDayViews.append(evView)
            }

            draggingGhosts.removeAll()
            // CHANGED/ADDED: Keep track of original alpha values
            draggingOriginalAlphas.removeAll()

            // Instead of hiding the originals, we make them partially transparent
            for realView in multiDayViews {
                guard let realDesc = eventViewToDescriptor[realView] else { continue }

                // Store original alpha and set new alpha
                draggingOriginalAlphas[realView] = realView.alpha  // CHANGED/ADDED
                realView.alpha = 0.0                                // CHANGED/ADDED

                let ghost = createEventView()
                ghost.updateWithDescriptor(event: realDesc)
                ghost.alpha = 1
                addSubview(ghost)
                ghost.isHidden = false
                draggingGhosts[realView] = ghost
            }

            let d = DragData(
                originalBoundingStart: realStart,
                originalBoundingEnd:   realEnd,
                totalDuration: totalDuration,
                startGlobalPoint: startGlobal,
                anchorDayY: anchorDayY,
                anchorDate: anchorDate
            )
            evView.layer.setValue(d, forKey: DRAG_DATA_KEY)

        case .changed:
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData else { return }
            let currGlobal = gesture.location(in: self.window)
            let diffY = currGlobal.y - d.startGlobalPoint.y

            // how many hours we moved
            let movedHours = diffY / hourHeight
            let movedSeconds = movedHours * 3600

            // new bounding start
            let newBoundingStart = d.originalBoundingStart.addingTimeInterval(movedSeconds)
            let newBoundingEnd   = newBoundingStart.addingTimeInterval(d.totalDuration)

            // For each piece, show the full bounding range in that day
            for (realView, ghost) in draggingGhosts {
                guard let realDesc = eventViewToDescriptor[realView] else { continue }
                let dayIndex = dayIndexFor(realDesc.dateInterval.start)
                let dayX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)

                let localStartHour = hoursBetweenDayIndex(newBoundingStart, dayIndex: dayIndex)
                let localEndHour   = localStartHour + CGFloat(d.totalDuration / 3600.0)

                let yStart = topMargin + (localStartHour * hourHeight)
                let yEnd   = topMargin + (localEndHour * hourHeight)

                let ghostFrame = CGRect(
                    x: dayX,
                    y: yStart,
                    width: dayColumnWidth,
                    height: (yEnd - yStart)
                )
                ghost.frame = ghostFrame
            }

            // Show a "time pointer" in the hours column for the user
            let newTopForAnchorPiece = d.anchorDate.addingTimeInterval(movedSeconds)
            setSingle10MinuteMarkFromDate(newTopForAnchorPiece)

            // auto-scroll
            updateAutoScrollDirection(for: gesture)

        case .ended, .cancelled:
            setScrollsClipping(enabled: true)
            stopAutoScroll()
            hoursColumnView?.selectedMinuteMark = nil

            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData else {
                // If no data, just remove ghosts & restore alpha if needed
                for (realView, ghost) in draggingGhosts {
                    ghost.removeFromSuperview()
                    // Restore alpha
                    if let originalAlpha = draggingOriginalAlphas[realView] {
                        realView.alpha = originalAlpha
                    }
                }
                draggingGhosts.removeAll()
                draggingOriginalAlphas.removeAll()
                evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
                setNeedsLayout()
                return
            }

            let currGlobal = gesture.location(in: self.window)
            let diffY = currGlobal.y - d.startGlobalPoint.y
            let movedHours = diffY / hourHeight
            let movedSeconds = movedHours * 3600

            let finalBoundingStart = d.originalBoundingStart.addingTimeInterval(movedSeconds)
            let finalBoundingEnd   = finalBoundingStart.addingTimeInterval(d.totalDuration)

            let locationInContainer = gesture.location(in: container)
            if let hitView = container.hitTest(locationInContainer, with: nil) {
                let hitViewClass = String(describing: type(of: hitView))
                let parent1Class = hitView.superview.map { String(describing: type(of: $0)) } ?? "nil"
                let parent2Class = hitView.superview?.superview.map { String(describing: type(of: $0)) } ?? "nil"

                // Remove ghosts & restore alphas
                for (realView, ghost) in draggingGhosts {
                    ghost.removeFromSuperview()
                    if let originalAlpha = draggingOriginalAlphas[realView] {
                        realView.alpha = originalAlpha // CHANGED/ADDED
                    }
                }
                draggingGhosts.removeAll()
                draggingOriginalAlphas.removeAll()

                // Now finalize new date/time
                if hitViewClass == "MultiDayTimelineViewNonOverlapping"
                    || parent1Class == "MultiDayTimelineViewNonOverlapping"
                    || parent2Class == "MultiDayTimelineViewNonOverlapping" {

                    descriptor.isAllDay = false
                    descriptor.dateInterval = DateInterval(start: finalBoundingStart,
                                                           end: finalBoundingEnd)
                    onEventDragEnded?(descriptor, finalBoundingStart, false)
                }
                else if hitViewClass == "AllDayViewNonOverlapping"
                        || parent1Class == "AllDayViewNonOverlapping"
                        || parent2Class == "AllDayViewNonOverlapping" {
                    if let dayIndex = dayIndexFromMidX(evView.frame.midX) {
                        onEventConvertToAllDay?(descriptor, dayIndex)
                    }
                } else {
                    // Fallback => do nothing
                }
            } else {
                // No valid drop => revert
                for (realView, ghost) in draggingGhosts {
                    ghost.removeFromSuperview()
                    if let originalAlpha = draggingOriginalAlphas[realView] {
                        realView.alpha = originalAlpha // CHANGED/ADDED
                    }
                }
                draggingGhosts.removeAll()
                draggingOriginalAlphas.removeAll()
            }

            // We do not unhide it because we never hid it—just restore alpha after drop
            evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            setNeedsLayout()

        default:
            break
        }
    }

    /// Returns hours difference from day i's midnight
    private func hoursBetweenDayIndex(_ date: Date, dayIndex: Int) -> CGFloat {
        let cal = Calendar.current
        let day0 = cal.startOfDay(for: fromDate)
        guard let actualDay = cal.date(byAdding: .day, value: dayIndex, to: day0) else {
            return 0
        }
        let diff = date.timeIntervalSince(actualDay)
        return CGFloat(diff / 3600.0)
    }

    private func selectEventView(_ evView: EventView) {
        guard let descriptor = eventViewToDescriptor[evView] else { return }
        if let oldView = currentlyEditedEventView, oldView !== evView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
        }
        descriptor.editedEvent = descriptor
        evView.updateWithDescriptor(event: descriptor)
        currentlyEditedEventView = evView
    }

    // MARK: - Resizing

    private struct ResizeDragData {
        let startGlobalPoint: CGPoint
        let originalFrame: CGRect
        let isTop: Bool
        let startInterval: DateInterval
        let wasAllDay: Bool
    }

    @objc private func handleResizeHandlePanGesture(_ gesture: UIPanGestureRecognizer) {
        guard
            let handleView = gesture.view as? EventResizeHandleView,
            let eventView = handleView.superview as? EventView,
            let desc = eventViewToDescriptor[eventView]
        else {
            return
        }
        let isTop = (handleView.tag == 0)

        switch gesture.state {
        case .began:
            if let oldView = currentlyEditedEventView,
               oldView !== eventView,
               let oldDesc = eventViewToDescriptor[oldView] {
                oldDesc.editedEvent = nil
                oldView.updateWithDescriptor(event: oldDesc)
            }
            if desc.editedEvent == nil {
                desc.editedEvent = desc
                eventView.updateWithDescriptor(event: desc)
            }
            currentlyEditedEventView = eventView

            // Create ghost
            let ghost = EventView()
            ghost.updateWithDescriptor(event: desc)
            ghost.alpha = 0.5
            addSubview(ghost)
            ghostView = ghost

            setScrollsClipping(enabled: false)

            let dayIndex = dayIndexFor(desc.dateInterval.start)
            let dayX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
            let originalY = eventView.frame.origin.y
            let originalH = eventView.frame.size.height
            ghost.frame = CGRect(x: dayX, y: originalY, width: dayColumnWidth, height: originalH)

            // Hide the original event
            eventView.isHidden = true

            let startGlobal = gesture.location(in: self.window)
            let d = ResizeDragData(
                startGlobalPoint: startGlobal,
                originalFrame: ghost.frame,
                isTop: isTop,
                startInterval: desc.dateInterval,
                wasAllDay: desc.isAllDay
            )
            eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)

        case .changed:
            guard
                let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? ResizeDragData,
                let ghost = ghostView
            else {
                return
            }
            let currGlobal = gesture.location(in: self.window)
            let diffY = currGlobal.y - d.startGlobalPoint.y

            var f = d.originalFrame
            if d.isTop {
                f.origin.y += diffY
                f.size.height -= diffY
            } else {
                f.size.height += diffY
            }
            if f.size.height < 20 { return }

            ghost.frame = f

            if let newEdgeDate = dateFromResize(f, isTop: d.isTop) {
                setSingle10MinuteMarkFromDate(newEdgeDate)
            }

        case .ended, .cancelled:
            setScrollsClipping(enabled: true)

            guard
                let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? ResizeDragData,
                let ghost = ghostView
            else {
                return
            }

            let finalFrame = ghost.frame
            desc.isAllDay = false

            if let newDateRaw = dateFromResize(finalFrame, isTop: d.isTop) {
                let snapped = snapToNearest10Min(newDateRaw)
                var interval = d.startInterval
                if d.isTop {
                    if snapped < interval.end {
                        interval = DateInterval(start: snapped, end: interval.end)
                    }
                } else {
                    if snapped > interval.start {
                        interval = DateInterval(start: interval.start, end: snapped)
                    }
                }
                desc.dateInterval = interval
                onEventDragResizeEnded?(desc, snapped)
            }

            ghost.removeFromSuperview()
            ghostView = nil

            // Re-show the original after layout pass
            eventView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            setNeedsLayout()

        default:
            break
        }
    }

    @objc private func handleResizeHandleLongPressGesture(_ gesture: UILongPressGestureRecognizer) {
        // Additional logic if needed
    }

    private func dateFromResize(_ frame: CGRect, isTop: Bool) -> Date? {
        let y = isTop ? frame.minY : frame.maxY
        let localY = y - topMargin
        let midX = frame.midX

        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }

        let cal = Calendar.current
        guard let dayDate = cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate)) else {
            return nil
        }

        var hoursFloat = localY / hourHeight
        if hoursFloat < 0 { hoursFloat = 0 }
        if hoursFloat > 24 { hoursFloat = 24 }
        let hour = floor(hoursFloat)
        let minuteFloat = (hoursFloat - hour) * 60
        let minute = floor(minuteFloat)

        var comps = cal.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hour)
        comps.minute = Int(minute)
        comps.second = 0
        return cal.date(from: comps)
    }

    // MARK: - Drawing
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let totalWidth = leadingInsetForHours + dayColumnWidth * CGFloat(dayCount)

        // Horizontal lines for hours
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        var lastY: CGFloat = 0
        for hour in 0...24 {
            let y = topMargin + CGFloat(hour) * hourHeight
            lastY = y
            ctx.move(to: CGPoint(x: leadingInsetForHours, y: y))
            ctx.addLine(to: CGPoint(x: totalWidth, y: y))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // Vertical lines for day boundaries
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()

        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))

        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: lastY))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // Red "current time" line if it’s in range
        drawCurrentTimeLineForCurrentRange(ctx: ctx)
    }

    private func drawCurrentTimeLineForCurrentRange(ctx: CGContext) {
        let now = Date()
        let cal = Calendar.current
        let nowOnly = cal.startOfDay(for: now)
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly   = cal.startOfDay(for: toDate)
        if nowOnly < fromOnly || nowOnly > toOnly { return }

        let dayIndex = dayIndexFor(now)
        if dayIndex < 0 || dayIndex >= dayCount { return }

        let hour = CGFloat(cal.component(.hour, from: now))
        let minute = CGFloat(cal.component(.minute, from: now))
        let fraction = hour + minute / 60.0
        let yNow = topMargin + fraction * hourHeight

        let currentDayX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
        let currentDayX2 = currentDayX + dayColumnWidth

        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: currentDayX, y: yNow))
        ctx.addLine(to: CGPoint(x: currentDayX2, y: yNow))
        ctx.strokePath()
        ctx.restoreGState()
    }

    // MARK: - Helpers
    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return hourHeight * (hour + minute / 60.0)
    }

    private func setSingle10MinuteMarkFromDate(_ date: Date) {
        let cal = Calendar.current
        let comps = cal.dateComponents([.hour, .minute], from: date)
        guard let hour = comps.hour, let minute = comps.minute else {
            hoursColumnView?.selectedMinuteMark = nil
            hoursColumnView?.setNeedsDisplay()
            return
        }
        if minute == 0 {
            hoursColumnView?.selectedMinuteMark = nil
            hoursColumnView?.setNeedsDisplay()
            return
        }
        let remainder = minute % 10
        var closest10 = minute
        if remainder < 5 {
            closest10 = minute - remainder
        } else {
            closest10 = minute + (10 - remainder)
            if closest10 == 60 {
                hoursColumnView?.selectedMinuteMark = nil
                hoursColumnView?.setNeedsDisplay()
                return
            }
        }
        hoursColumnView?.selectedMinuteMark = (hour, closest10)
        hoursColumnView?.setNeedsDisplay()
    }

    private func snapToNearest10Min(_ date: Date) -> Date {
        let cal = Calendar.current
        let comps = cal.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        guard let y = comps.year, let mo = comps.month, let d = comps.day,
              let h = comps.hour, let m = comps.minute else {
            return date
        }
        if m == 0 { return date }
        let remainder = m % 10
        var finalM = m
        if remainder < 5 {
            finalM = m - remainder
        } else {
            finalM = m + (10 - remainder)
            if finalM == 60 {
                finalM = 0
                let plusOneHour = (h + 1) % 24
                let comps2 = DateComponents(year: y, month: mo, day: d,
                                            hour: plusOneHour, minute: 0, second: 0)
                return cal.date(from: comps2) ?? date
            }
        }
        var comps2 = DateComponents()
        comps2.year = y
        comps2.month = mo
        comps2.day = d
        comps2.hour = h
        comps2.minute = finalM
        comps2.second = 0
        return cal.date(from: comps2) ?? date
    }

    func dateFromPoint(_ point: CGPoint) -> Date? {
        let localY = point.y - topMargin

        if point.x < leadingInsetForHours { return nil }
        let dayIndex = Int((point.x - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate)) {
            if localY < 0 { return nil }
            return timeToDate(dayDate: dayDate, verticalOffset: localY)
        }
        return nil
    }

    private func dateFromFrame(_ frame: CGRect) -> Date? {
        let topY = frame.minY - topMargin
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

    private func timeToDate(dayDate: Date, verticalOffset: CGFloat) -> Date? {
        var hoursFloat = verticalOffset / hourHeight
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

    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let dateOnly = cal.startOfDay(for: date)
        let comps = cal.dateComponents([.day], from: startOnly, to: dateOnly)
        return comps.day ?? 0
    }

    func dayIndexFromMidX(_ x: CGFloat) -> Int? {
        let localX = x - leadingInsetForHours
        let idx = Int(floor(localX / dayColumnWidth))
        return (idx >= 0 && idx < dayCount) ? idx : nil
    }

    // MARK: - Scroll / Clipping
    private func setScrollsClipping(enabled: Bool) {
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        container.mainScrollView.clipsToBounds = enabled
        if enabled {
            container.allDayScrollView.layer.zPosition = 2
            container.mainScrollView.layer.zPosition = 1
        } else {
            container.allDayScrollView.layer.zPosition = 1
            container.mainScrollView.layer.zPosition = 2
        }
    }

    // MARK: - Auto Scroll
    private func updateAutoScrollDirection(for gesture: UIPanGestureRecognizer) {
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        let location = gesture.location(in: container)
        let threshold: CGFloat = 50.0
        var direction = CGPoint.zero

        let scrollFrame = container.mainScrollView.frame

        if location.x < scrollFrame.minX + threshold {
            direction.x = -1
        } else if location.x > scrollFrame.maxX - threshold {
            direction.x = 1
        }

        if location.y < scrollFrame.minY + threshold {
            direction.y = -1
        } else if location.y > scrollFrame.maxY - threshold {
            direction.y = 1
        }

        autoScrollDirection = direction
        if direction != .zero {
            startAutoScrollIfNeeded()
        } else {
            stopAutoScroll()
        }
    }

    private func startAutoScrollIfNeeded() {
        if autoScrollDisplayLink == nil {
            autoScrollDisplayLink = CADisplayLink(target: self, selector: #selector(handleAutoScroll))
            autoScrollDisplayLink?.add(to: .main, forMode: .common)
        }
    }

    private func stopAutoScroll() {
        autoScrollDisplayLink?.invalidate()
        autoScrollDisplayLink = nil
    }

    @objc private func handleAutoScroll() {
        guard autoScrollDirection != .zero,
              let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }

        let scrollView = container.mainScrollView
        var newOffset = scrollView.contentOffset
        let scrollSpeed: CGFloat = 5.0

        newOffset.x += autoScrollDirection.x * scrollSpeed
        newOffset.y += autoScrollDirection.y * scrollSpeed

        newOffset.x = max(0, min(newOffset.x, scrollView.contentSize.width - scrollView.bounds.width))
        newOffset.y = max(0, min(newOffset.y, scrollView.contentSize.height - scrollView.bounds.height))

        scrollView.setContentOffset(newOffset, animated: false)
    }
}
