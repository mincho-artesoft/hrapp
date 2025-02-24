//
//  MultiDayTimelineViewNonOverlapping.swift
//  CalendarKit
//

import UIKit

public final class MultiDayTimelineViewNonOverlapping: UIView, UIGestureRecognizerDelegate {
    
    // MARK: - Local DateFormatter (for debug prints)
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
    
    /// Top margin so drawing aligns with HoursColumnView lines
    public var topMargin: CGFloat = 0
    
    public var leadingInsetForHours: CGFloat = 0
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50
    
    // Hours column (for minute markers, etc.)
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
    
    // Actual subviews for normal events
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView : EventDescriptor] = [:]
    
    // MARK: - Editing / Drag & Drop / Resize
    private var currentlyEditedEventView: EventView?
    
    // Ghosts during drag (one ghost per day slice)
    private var draggingGhosts: [EventView: EventView] = [:]
    private var draggingOriginalAlphas: [EventView: CGFloat] = [:]
    
    private let DRAG_DATA_KEY = "DragDataKey"
    private var ghostView: EventView? // for resizing
    
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
        // Ensure not on an event
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
        
        // Hide all eventViews first
        for v in eventViews {
            v.isHidden = true
        }
        layoutRegularEvents()
    }
    
    var dayCount: Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let endOnly = cal.startOfDay(for: toDate)
        let comps = cal.dateComponents([.day], from: startOnly, to: endOnly)
        return (comps.day ?? 0) + 1
    }
    
    private func layoutRegularEvents() {
        // Group by day
        let grouped = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        var usedEventViewIndex = 0
        
        for dayIndex in 0..<dayCount {
            guard let eventsForDay = grouped[dayIndex], !eventsForDay.isEmpty else { continue }
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
                    
                    let evView = ensureEventView(index: usedEventViewIndex)
                    usedEventViewIndex += 1
                    evView.isHidden = false
                    evView.frame = CGRect(x: x, y: yStart, width: w, height: h)
                    evView.updateWithDescriptor(event: attr.descriptor)
                    eventViewToDescriptor[evView] = attr.descriptor
                    
                    // Multi-day handle logic
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
            if evStart < candEnd && candStart < evEnd {
                return true
            }
        }
        return false
    }
    
    private func ensureEventView(index: Int) -> EventView {
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
//        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewLongPress(_:)))
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewPan(_:)))
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
    
    // MARK: - Gesture: Tap on Event
    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }
        
        // Deselect old
        if let oldView = currentlyEditedEventView, oldView !== tappedView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
        }
        
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
            // Deselect old
            if let oldView = currentlyEditedEventView,
               oldView !== evView,
               let oldDesc = eventViewToDescriptor[oldView] {
                oldDesc.editedEvent = nil
                oldView.updateWithDescriptor(event: oldDesc)
            }
            // Mark as editing
            if descriptor.editedEvent == nil {
                descriptor.editedEvent = descriptor
                evView.updateWithDescriptor(event: descriptor)
            }
            currentlyEditedEventView = evView
        }
    }
    
    // MARK: - Drag the event
    /// Additional pinned top offset to fix vertical mismatch from pinned headers/all-day, etc.
    private var pinnedTop: CGFloat {
        return 0
    }
    
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
        
        // The container (superview of superview)
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        
        switch gesture.state {
        case .began:
            setScrollsClipping(enabled: false)
          
                // Deselect old
                if let oldView = currentlyEditedEventView,
                   oldView !== evView,
                   let oldDesc = eventViewToDescriptor[oldView] {
                    oldDesc.editedEvent = nil
                    oldView.updateWithDescriptor(event: oldDesc)
                }
                // Mark as editing
                if descriptor.editedEvent == nil {
                    descriptor.editedEvent = descriptor
                    evView.updateWithDescriptor(event: descriptor)
                }
                currentlyEditedEventView = evView
    
            // Real start/end for entire multi-day
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
            
            // Identify all day slices
            var slices: [EventView] = []
            if let multi = descriptor as? EKMultiDayWrapper {
                let eventID = multi.realEvent.eventIdentifier
                for (ov, od) in eventViewToDescriptor {
                    if let om = od as? EKMultiDayWrapper,
                       om.realEvent.eventIdentifier == eventID {
                        slices.append(ov)
                    }
                }
            } else {
                slices.append(evView)
            }
            
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            // Create ghosts in container coords
            var originalFrames = [EventView: CGRect]()
            for realSliceView in slices {
                if let desc = eventViewToDescriptor[realSliceView] {
                    // fade out real
                    draggingOriginalAlphas[realSliceView] = realSliceView.alpha
                    realSliceView.alpha = 0.0
                    
                    // Convert slice frame from self => container
                    let sliceFrameInTimeline = realSliceView.frame
                    var sliceFrameInContainer = self.convert(sliceFrameInTimeline, to: container)
                    // Bump down by pinnedTop so we see it under finger
                    sliceFrameInContainer.origin.y += pinnedTop
                    
                    // Force a full-width ghost for the entire multi-day duration
                    let ghost = createEventView()
                    ghost.updateWithDescriptor(event: desc)
                    ghost.alpha = 1.0
                    ghost.layer.zPosition = 2
                    container.addSubview(ghost)
                    
                    // We'll compute the final ghost height to be the entire event timespan
                    let hoursTotal = totalDuration / 3600.0
                    let ghostH = hourHeight * CGFloat(hoursTotal)
                    
                    // The top aligns with realStart relative to day
                    let dayIndex = dayIndexFor(desc.dateInterval.start)
                    let dayStart = dayStartDate(for: dayIndex)
                    let hoursOffset = realStart.timeIntervalSince(dayStart) / 3600.0
                    let topY = topMargin + CGFloat(hoursOffset) * hourHeight    
                    
                    let ghostX = sliceFrameInContainer.minX
                    let ghostY = sliceFrameInContainer.minY
                    let ghostW = dayColumnWidth - style.eventGap*2
                    
                    let ghostFrame = CGRect(
                        x: ghostX,
                        y: ghostY,
                        width: ghostW,
                        height: ghostH
                    )
                    ghost.frame = ghostFrame
                    ghost.isHidden = false
                    
                    draggingGhosts[realSliceView] = ghost
                    originalFrames[realSliceView] = ghostFrame
                }
            }
            
            // Anchor offset
            let fingerInContainer = gesture.location(in: container)
            guard let anchorGhost = draggingGhosts[evView] else { return }
            
            let anchorFrame = anchorGhost.frame
            let offsetX = fingerInContainer.x - anchorFrame.minX
            let offsetY = fingerInContainer.y - anchorFrame.minY
            
            let d = DragData(
                totalDuration: totalDuration,
                originalContainerFrames: originalFrames,
                anchorOffsetX: offsetX,
                anchorOffsetY: offsetY
            )
            evView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            print("asd")
        case .changed:
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData else { return }
            
            let fingerInContainer = gesture.location(in: container)
            let newX = fingerInContainer.x - d.anchorOffsetX
            let newY = fingerInContainer.y - d.anchorOffsetY
            
            if let anchorOrig = d.originalContainerFrames[evView] {
                let deltaX = newX - anchorOrig.minX
                let deltaY = newY - anchorOrig.minY
                
                for (sliceView, ghost) in draggingGhosts {
                    guard let origF = d.originalContainerFrames[sliceView] else { continue }
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
            
            // >>>>>>> ТУК ПРОМЕНЯМЕ ЛОГИКАТА ЗА setSingle10MinuteMarkFromDate <<<<<<
            if let anchorGhost = draggingGhosts[evView] {
                // Convert ghost's frame from container => self
                var ghostFrameInTimeline = anchorGhost.frame
                ghostFrameInTimeline.origin.y -= pinnedTop
                let frameSelf = container.convert(ghostFrameInTimeline, to: self)
                
                // Тук прилагаме логика: ако top е в зоната -> ползваме него,
                // иначе вземаме bottom.
                let topY = frameSelf.minY
                let bottomY = frameSelf.maxY
                
                // Може да считаме за "видима" зона [0 ... bounds.height]
                // (или [topMargin ... bounds.height], ако има нужда).
                
                let topIsVisible = (topY >= 0 && topY < bounds.height)
                if topIsVisible {
                    if let newStart = dateFromFrame(frameSelf) {
                        setSingle10MinuteMarkFromDate(newStart)
                    }
                } else {
                    // bottom
                    var bottomFrame = frameSelf
                    bottomFrame.origin.y = bottomY - 1
                    bottomFrame.size.height = 1
                    if let newEnd = dateFromFrame(bottomFrame) {
                        setSingle10MinuteMarkFromDate(newEnd)
                    }
                }
            }
            
            updateAutoScrollDirection(for: gesture)
            
        case .ended, .cancelled:
            setScrollsClipping(enabled: true)
            stopAutoScroll()
            hoursColumnView?.selectedMinuteMark = nil
            
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let anchorGhost = draggingGhosts[evView],
                  let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else {
                // Clean up
                for (sv, gh) in draggingGhosts {
                    gh.removeFromSuperview()
                    if let alpha = draggingOriginalAlphas[sv] {
                        sv.alpha = alpha
                    }
                }
                draggingGhosts.removeAll()
                draggingOriginalAlphas.removeAll()
                evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
                setNeedsLayout()
                return
            }
            
            // Convert final anchor ghost from container -> self
            var finalFrame = anchorGhost.frame
            // remove pinnedTop offset
            finalFrame.origin.y -= pinnedTop
            let finalFrameInTimeline = container.convert(finalFrame, to: self)
            
            // day from midX
            let midX = finalFrameInTimeline.midX
            var dayIndex = Int(floor((midX - leadingInsetForHours) / dayColumnWidth))
            dayIndex = max(0, min(dayIndex, dayCount - 1))
            
            // hour from topY
            let topY = finalFrameInTimeline.minY
            let hourOffset = (topY - topMargin) / hourHeight
            
            let dayDate = dayStartDate(for: dayIndex)
            let finalStart = dayDate.addingTimeInterval(hourOffset * 3600)
            let finalEnd   = finalStart.addingTimeInterval(d.totalDuration)
            
            // remove ghosts
            for (sv, gh) in draggingGhosts {
                gh.removeFromSuperview()
                if let alpha = draggingOriginalAlphas[sv] {
                    sv.alpha = alpha
                }
            }
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            // Check where we dropped
            let locationInContainer = gesture.location(in: container)
            if let hitView = container.hitTest(locationInContainer, with: nil) {
                let hitViewClass = String(describing: type(of: hitView))
                let parent1Class = hitView.superview.map { String(describing: type(of: $0)) } ?? "nil"
                let parent2Class = hitView.superview?.superview.map { String(describing: type(of: $0)) } ?? "nil"
                
                descriptor.isAllDay = false
                descriptor.dateInterval = DateInterval(start: finalStart, end: finalEnd)
                
                if hitViewClass == "MultiDayTimelineViewNonOverlapping"
                    || parent1Class == "MultiDayTimelineViewNonOverlapping"
                    || parent2Class == "MultiDayTimelineViewNonOverlapping" {
                    
                    onEventDragEnded?(descriptor, finalStart, false)
                    
                } else if hitViewClass == "AllDayViewNonOverlapping"
                            || parent1Class == "AllDayViewNonOverlapping"
                            || parent2Class == "AllDayViewNonOverlapping" {
                    
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
    
    // MARK: - Helpers for day index
    func dayStartDate(for dayIndex: Int) -> Date {
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
            if let oldView = currentlyEditedEventView, oldView !== eventView,
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
            guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
            let ghost = EventView()
            ghost.updateWithDescriptor(event: desc)
            ghost.alpha = 1
            ghost.layer.zPosition = 2
            container.addSubview(ghost)
            
            // Convert from self => container
            let frameInTimeline = eventView.frame
            var frameInContainer = self.convert(frameInTimeline, to: container)
            frameInContainer.origin.y += pinnedTop // account for pinned top
            ghost.frame = frameInContainer
            
            ghostView = ghost
            setScrollsClipping(enabled: false)
            eventView.isHidden = true
            
            let startGlobal = gesture.location(in: container)
            let d = ResizeDragData(
                startGlobalPoint: startGlobal,
                originalFrame: frameInContainer,
                isTop: isTop,
                startInterval: desc.dateInterval,
                wasAllDay: desc.isAllDay
            )
            eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            
        case .changed:
            guard
                let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? ResizeDragData,
                let ghost = ghostView,
                let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView
            else {
                return
            }
            
            let currInContainer = gesture.location(in: container)
            let diffY = currInContainer.y - d.startGlobalPoint.y
            
            var f = d.originalFrame
            if d.isTop {
                f.origin.y += diffY
                f.size.height -= diffY
            } else {
                f.size.height += diffY
            }
            ghost.frame = f
            
            // >>>>>>> ТУК ПРОМЕНЯМЕ ЛОГИКАТА ЗА setSingle10MinuteMarkFromDate <<<<<<
            let ghostTop = ghost.frame.minY
            let ghostBottom = ghost.frame.maxY
            // Позиция на горния/долния край => засичаме текущата минута
            // Ако горният край е видим, взимаме него.
            // Иначе => взимаме долния.
            let topIsVisible = (ghostTop >= 0 && ghostTop < bounds.height)
            if topIsVisible {
                if let newEdgeDate = dateFromResize(ghost.frame, isTop: d.isTop, container: container) {
                    setSingle10MinuteMarkFromDate(newEdgeDate)
                }
            } else {
                var bottomFrame = ghost.frame
                bottomFrame.origin.y = ghostBottom - 1
                bottomFrame.size.height = 1
                if let newEdgeDate = dateFromResize(bottomFrame, isTop: d.isTop, container: container) {
                    setSingle10MinuteMarkFromDate(newEdgeDate)
                }
            }
            
        case .ended, .cancelled:
            setScrollsClipping(enabled: true)
            guard let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? ResizeDragData,
                  let ghost = ghostView,
                  let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else {
                return
            }
            let finalFrame = ghost.frame
            ghost.removeFromSuperview()
            ghostView = nil
            desc.isAllDay = false
            
            if let newDateRaw = dateFromResize(finalFrame, isTop: d.isTop, container: container) {
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
            
            eventView.isHidden = false
            eventView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            setNeedsLayout()
            
        default:
            break
        }
    }
    
    @objc private func handleResizeHandleLongPressGesture(_ gesture: UILongPressGestureRecognizer) {
        // Additional logic if needed
    }
    
    private func dateFromResize(_ frameInContainer: CGRect,
                                isTop: Bool,
                                container: UIView) -> Date? {
        // remove pinnedTop first
        var adjusted = frameInContainer
        adjusted.origin.y -= pinnedTop
        
        let inTimeline = container.convert(adjusted, to: self)
        
        let y = isTop ? inTimeline.minY : inTimeline.maxY
        let localY = y - topMargin
        let midX = inTimeline.midX
        
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        
        let cal = Calendar.current
        let dayDate = dayStartDate(for: dayIndex)
        
        var hoursFloat = localY / hourHeight
        hoursFloat = max(0, min(24, hoursFloat))
        
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
        
        // left boundary
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        
        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: lastY))
        }
        ctx.strokePath()
        ctx.restoreGState()
        
        // Red "now" line if in range
        drawCurrentTimeLine(ctx: ctx)
    }
    
    private func drawCurrentTimeLine(ctx: CGContext) {
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
        let fraction = hour + minute/60.0
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
        return hourHeight * (hour + minute/60.0)
    }
    
    private func setSingle10MinuteMarkFromDate(_ date: Date) {
        guard let hoursView = hoursColumnView else { return }
        
        let cal = Calendar.current
        let comps = cal.dateComponents([.hour, .minute], from: date)
        guard let hour = comps.hour, let minute = comps.minute else {
            hoursView.selectedMinuteMark = nil
            hoursView.setNeedsDisplay()
            return
        }
        if minute == 0 {
            hoursView.selectedMinuteMark = nil
            hoursView.setNeedsDisplay()
            return
        }
        let remainder = minute % 10
        var closest10 = minute
        if remainder < 5 {
            closest10 = minute - remainder
        } else {
            closest10 = minute + (10 - remainder)
            if closest10 == 60 {
                hoursView.selectedMinuteMark = nil
                hoursView.setNeedsDisplay()
                return
            }
        }
        hoursView.selectedMinuteMark = (hour, closest10)
        hoursView.setNeedsDisplay()
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
        hoursFloat = max(0, min(24, hoursFloat))
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
        let threshold: CGFloat = 50
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
        let scrollSpeed: CGFloat = 5
        var newOffset = scrollView.contentOffset
        
        newOffset.x += autoScrollDirection.x * scrollSpeed
        newOffset.y += autoScrollDirection.y * scrollSpeed
        
        newOffset.x = max(0, min(newOffset.x, scrollView.contentSize.width - scrollView.bounds.width))
        newOffset.y = max(0, min(newOffset.y, scrollView.contentSize.height - scrollView.bounds.height))
        
        scrollView.setContentOffset(newOffset, animated: false)
    }
    
    func dateFromFrame(_ frame: CGRect) -> Date? {
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
}
