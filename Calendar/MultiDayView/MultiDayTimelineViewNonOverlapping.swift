//
//  MultiDayTimelineViewNonOverlapping.swift
//  CalendarKit
//
//  Features:
//   - Non-overlapping event columns
//   - Drag & drop horizontally across days
//   - Ghost event is full day-column width during drag
//   - For multi-day events, each day's ghost slice is as tall as the ENTIRE event duration
//     (so users see the full 53-hour (etc.) vertical span, extending outside container if needed).
//

import UIKit

public final class MultiDayTimelineViewNonOverlapping: UIView, UIGestureRecognizerDelegate {
    
    // MARK: - Local DateFormatter (for prints)
    private static let localFormatter: DateFormatter = {
        let df = DateFormatter()
        df.dateFormat = "yyyy-MM-dd HH:mm"
        df.timeZone = TimeZone.current
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
    public var onEventConvertToAllDay: ((EventDescriptor, Int) -> Void)?
    
    // MARK: - Events to Layout
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
    private var draggingOriginalAlphas: [EventView: CGFloat] = [:]
    
    // Used to store drag data
    private let DRAG_DATA_KEY = "DragDataKey"
    
    // Resizing uses a single ghostView
    private var ghostView: EventView?
    
    // MARK: - Auto-Scroll
    private var autoScrollDisplayLink: CADisplayLink?
    private var autoScrollDirection = CGPoint.zero
    
    // MARK: - Init
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = style.backgroundColor
        clipsToBounds = false
        
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()
    }
    
    required public init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = style.backgroundColor
        clipsToBounds = false
        
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
        true
    }
    
    @objc private func handleTapOnEmptySpace(_ gesture: UITapGestureRecognizer) {
        guard gesture.state == .ended else { return }
        // If we had an edited event, revert it:
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }
        // Remove any selection mark in HoursColumnView
        hoursColumnView?.selectedMinuteMark = nil
        hoursColumnView?.setNeedsDisplay()
    }
    
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)
        // Ensure it’s not on an existing event
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
        if let tappedDate = dateFromPoint(point) {
            onEmptyLongPress?(tappedDate)
        }
    }
    
    // MARK: - Layout
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        // Hide all existing event views first
        for v in eventViews {
            v.isHidden = true
        }
        
        // Layout the current list of events (non-overlapping columns)
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
        // Group by day
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
                            // single day
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
                        // Normal single-day
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
            // Overlap if (evStart < candEnd) && (candStart < evEnd)
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
        ev.clipsToBounds = false
        addSubview(ev)
        return ev
    }
    
    // MARK: - Gesture: Tap on event
    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }
        
        // Close any other edited event
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
            // Mark this as editing
            if descriptor.editedEvent == nil {
                descriptor.editedEvent = descriptor
                evView.updateWithDescriptor(event: descriptor)
            }
            currentlyEditedEventView = evView
        }
    }
    
    // MARK: - Pan (drag) the whole event
    /// DragData storing final durations, original big frames, anchor offsets, etc.
    private struct DragData {
        let totalDuration: TimeInterval
        let originalContainerFrames: [EventView: CGRect]
        let anchorOffsetX: CGFloat
        let anchorOffsetY: CGFloat
    }
    
    @objc private func handleEventViewPan(_ gesture: UIPanGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        
        if currentlyEditedEventView !== evView {
            selectEventView(evView)
        }
        
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        
        switch gesture.state {
        case .began:
            setScrollsClipping(enabled: false)
            
            // Real start/end for entire multi-day event
            let (realStart, realEnd) = actualStartEnd(for: descriptor)
            let totalDuration = realEnd.timeIntervalSince(realStart) // e.g. 53 hours
            
            // For multi-day events, find all day slices
            var multiDayViews: [EventView] = []
            if let multi = descriptor as? EKMultiDayWrapper {
                let eventID = multi.realEvent.eventIdentifier
                for (otherView, otherDesc) in eventViewToDescriptor {
                    if let otherMulti = otherDesc as? EKMultiDayWrapper,
                       otherMulti.realEvent.eventIdentifier == eventID {
                        multiDayViews.append(otherView)
                    }
                }
            } else if let ekWrap = descriptor as? EKWrapper {
                let eventID = ekWrap.ekEvent.eventIdentifier
                for (otherView, otherDesc) in eventViewToDescriptor {
                    if let otherWrap = otherDesc as? EKWrapper,
                       otherWrap.ekEvent.eventIdentifier == eventID {
                        multiDayViews.append(otherView)
                    }
                }
            } else {
                // Single-day
                multiDayViews.append(evView)
            }
            
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            var originalFrames = [EventView: CGRect]()
            
            // Create a ghost for each day slice, but forcibly make it represent the full event height
            for realView in multiDayViews {
                if let realDesc = eventViewToDescriptor[realView] {
                    // Fade out the real slice
                    draggingOriginalAlphas[realView] = realView.alpha
                    realView.alpha = 0.0
                    
                    // We still want to preserve the day slice's horizontal position
                    // from the existing frame, but compute a "full-event" vertical size.
                    let partialFrameInTimeline = realView.frame
                    let partialFrameInContainer = self.convert(partialFrameInTimeline, to: container)
                    
                    let ghost = createEventView()
                    ghost.updateWithDescriptor(event: realDesc)
                    ghost.alpha = 1.0
                    ghost.layer.zPosition = 9999
                    ghost.clipsToBounds = false
                    
                    container.addSubview(ghost)
                    container.bringSubviewToFront(ghost)
                    
                    // *** Compute the "full vertical" ghost frame for day i. ***
                    // 1) Identify which day this slice belongs to:
                    let dayIndex = dayIndexFor(realDesc.dateInterval.start)
                    // 2) We want to place the ghost so that its top
                    //    aligns with (realStart relative to dayIndex's midnight).
                    let dayStart = dayStartDate(for: dayIndex)
                    let hoursOffset = realStart.timeIntervalSince(dayStart) / 3600.0
                    let topY = topMargin + hourHeight * CGFloat(hoursOffset) // might be negative
                    let height = CGFloat(totalDuration / 3600.0) * hourHeight
                    
                    // 3) Force the width to one day column wide:
                    //    We can reuse the partial's x (minus style gaps if needed):
                    //    Or just partialFrameInContainer.minX for left,
                    //    and keep dayColumnWidth - style.eventGap * 2 for width:
                    let ghostWidth = dayColumnWidth - style.eventGap * 2
                    let ghostX = partialFrameInContainer.minX
                    
                    let ghostFrame = CGRect(
                        x: ghostX,
                        y: topY,
                        width: ghostWidth,
                        height: height
                    )
                    ghost.frame = ghostFrame
                    ghost.isHidden = false
                    draggingGhosts[realView] = ghost
                    originalFrames[realView] = ghostFrame
                }
            }
            
            // Anchor offset from finger
            let fingerWindow = gesture.location(in: self.window)
            guard let anchorGhost = draggingGhosts[evView] else { return }
            
            let anchorFrame = anchorGhost.frame
            let offsetX = fingerWindow.x - anchorFrame.minX
            let offsetY = fingerWindow.y - anchorFrame.minY
            
            let d = DragData(
                totalDuration: totalDuration,
                originalContainerFrames: originalFrames,
                anchorOffsetX: offsetX,
                anchorOffsetY: offsetY
            )
            evView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            
        case .changed:
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData else { return }
            let fingerWindow = gesture.location(in: self.window)
            
            // The new top-left for the anchor ghost
            let newX = fingerWindow.x - d.anchorOffsetX
            let newY = fingerWindow.y - d.anchorOffsetY
            
            // Shift each piece by the same delta
            if let anchorOrig = d.originalContainerFrames[evView] {
                let deltaX = newX - anchorOrig.minX
                let deltaY = newY - anchorOrig.minY
                
                for (realView, ghost) in draggingGhosts {
                    guard let origF = d.originalContainerFrames[realView] else { continue }
                    
                    let ghostX = origF.minX + deltaX
                    let ghostY = origF.minY + deltaY
                    ghost.frame = CGRect(
                        x: ghostX,
                        y: ghostY,
                        width: origF.width,
                        height: origF.height
                    )
                }
            }
            
            // Show time pointer from anchor ghost’s top
            if let anchorGhost = draggingGhosts[evView] {
                let anchorFrameInTimeline = container.convert(anchorGhost.frame, to: self)
                let localY = anchorFrameInTimeline.minY - topMargin
                let hourOffset = localY / hourHeight
                let descriptor = eventViewToDescriptor[evView]!
                // We interpret the original descriptor's start as reference:
                let referenceStart = descriptor.dateInterval.start
                let newTime = referenceStart.addingTimeInterval(hourOffset * 3600)
                setSingle10MinuteMarkFromDate(newTime)
            }
            
            updateAutoScrollDirection(for: gesture)
            
        case .ended, .cancelled:
            setScrollsClipping(enabled: true)
            stopAutoScroll()
            hoursColumnView?.selectedMinuteMark = nil
            
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let anchorGhost = draggingGhosts[evView],
                  let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else {
                // Clean up if anything is missing
                for (realView, ghost) in draggingGhosts {
                    ghost.removeFromSuperview()
                    if let alpha = draggingOriginalAlphas[realView] {
                        realView.alpha = alpha
                    }
                }
                draggingGhosts.removeAll()
                draggingOriginalAlphas.removeAll()
                evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
                setNeedsLayout()
                return
            }
            
            // Convert final ghost frame to timeline coords
            let anchorFrameInTimeline = container.convert(anchorGhost.frame, to: self)
            
            // Day index from midX
            let midX = anchorFrameInTimeline.midX
            var dayIndex = Int(floor((midX - leadingInsetForHours) / dayColumnWidth))
            dayIndex = max(0, min(dayIndex, dayCount - 1)) // clamp
            
            // hour offset from topY
            let topY = anchorFrameInTimeline.minY
            let hourOffset = (topY - topMargin) / hourHeight
            
            // The day’s midnight
            let dayDate = dayStartDate(for: dayIndex)
            
            // Final start / end
            let finalStart = dayDate.addingTimeInterval(hourOffset * 3600)
            let finalEnd   = finalStart.addingTimeInterval(d.totalDuration)
            
            // Remove ghosts
            for (realView, ghost) in draggingGhosts {
                ghost.removeFromSuperview()
                if let alpha = draggingOriginalAlphas[realView] {
                    realView.alpha = alpha
                }
            }
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            // See where we dropped
            let locationInContainer = gesture.location(in: container)
            if let hitView = container.hitTest(locationInContainer, with: nil) {
                let hitViewClass = String(describing: type(of: hitView))
                let parent1Class = hitView.superview.map { String(describing: type(of: $0)) } ?? "nil"
                let parent2Class = hitView.superview?.superview.map { String(describing: type(of: $0)) } ?? "nil"
                
                // Final assignment: set descriptor's new interval
                descriptor.isAllDay = false
                descriptor.dateInterval = DateInterval(start: finalStart, end: finalEnd)
                
                if hitViewClass == "MultiDayTimelineViewNonOverlapping"
                    || parent1Class == "MultiDayTimelineViewNonOverlapping"
                    || parent2Class == "MultiDayTimelineViewNonOverlapping" {
                    
                    // Timed event dropped in timeline
                    onEventDragEnded?(descriptor, finalStart, false)
                    
                } else if hitViewClass == "AllDayViewNonOverlapping"
                            || parent1Class == "AllDayViewNonOverlapping"
                            || parent2Class == "AllDayViewNonOverlapping" {
                    
                    // Moved to all-day
                    onEventConvertToAllDay?(descriptor, dayIndex)
                }
            }
            
            evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            setNeedsLayout()
            
        default:
            break
        }
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
    
    // MARK: - Helpers
    /// Return the real start/end for multi-day or single-day descriptor
    private func actualStartEnd(for descriptor: EventDescriptor) -> (Date, Date) {
        if let multi = descriptor as? EKMultiDayWrapper {
            return (multi.realEvent.startDate, multi.realEvent.endDate)
        } else if let wrap = descriptor as? EKWrapper {
            return (wrap.ekEvent.startDate, wrap.ekEvent.endDate)
        } else {
            return (descriptor.dateInterval.start, descriptor.dateInterval.end)
        }
    }
    
    /// Return the Date at midnight for dayIndex (0-based from `fromDate`)
    private func dayStartDate(for dayIndex: Int) -> Date {
        let cal = Calendar.current
        let start = cal.startOfDay(for: fromDate)
        return cal.date(byAdding: .day, value: dayIndex, to: start) ?? start
    }
    
    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let dateOnly = cal.startOfDay(for: date)
        let comps = cal.dateComponents([.day], from: startOnly, to: dateOnly)
        return comps.day ?? 0
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
        else { return }
        
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
            
            // Create ghost in container coords
            let ghost = EventView()
            ghost.updateWithDescriptor(event: desc)
            ghost.alpha = 0.5
            ghost.layer.zPosition = 9999
            
            guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
            container.addSubview(ghost)
            container.bringSubviewToFront(ghost)
            
            let frameInTimeline = eventView.frame
            let frameInContainer = self.convert(frameInTimeline, to: container)
            ghost.frame = frameInContainer
            
            ghostView = ghost
            setScrollsClipping(enabled: false)
            
            // Hide original
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
            
            if let newEdgeDate = dateFromResize(ghost.frame, isTop: d.isTop) {
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
            
            // Re-show original
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
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else {
            return nil
        }
        let frameInTimeline = container.convert(frame, to: self)
        
        let y = isTop ? frameInTimeline.minY : frameInTimeline.maxY
        let localY = y - topMargin
        let midX = frameInTimeline.midX
        
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
        
        // Horizontal hour lines
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
        
        // Vertical day lines
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
        
        // Red "now" line if it’s in range
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
                let plusHour = (h + 1) % 24
                let comps2 = DateComponents(year: y, month: mo, day: d, hour: plusHour, minute: 0)
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
    
    // MARK: - Scroll / Clipping
    private func setScrollsClipping(enabled: Bool) {
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        container.mainScrollView.clipsToBounds = enabled
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
