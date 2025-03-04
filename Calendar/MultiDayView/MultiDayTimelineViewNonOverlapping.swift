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
    var isFirstResize = false
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
    
    // MARK: - Temporary multi-day slices
    private var dragSlicesMap = [String: [EventView]]()
    
    // MARK: - Editing / Drag & Drop / Resize
    private var currentlyEditedEventView: EventView?
    
    // Ghosts during drag (one ghost per day slice)
    private var draggingGhosts: [EventView: EventView] = [:]
    private var draggingOriginalAlphas: [EventView: CGFloat] = [:]
    
    // Ключ за запазване на данни при drag
    private let DRAG_DATA_KEY = "DragDataKey"
    
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
    
    // При TAP върху празно — зануляваме edit режима за всички
    @objc private func handleTapOnEmptySpace(_ gesture: UITapGestureRecognizer) {
        guard gesture.state == .ended else { return }
        
        // 1) Проверяваме дали реално е тап върху празно
        let point = gesture.location(in: self)
        for evView in eventViews {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        
        // 2) Махаме едит режима за всички EventDescriptor-и
        for (view, _) in eventViewToDescriptor {
            view.eventResizeHandles[0].isHidden = true
            view.eventResizeHandles[1].isHidden = true
        }
        currentlyEditedEventView = nil

        // 3) Зануляваме селектираната минута в колоната, ако има
        hoursColumnView?.selectedMinuteMark = nil
        hoursColumnView?.setNeedsDisplay()
    }

    // При LongPress върху празно — същото махане, плюс извикване на onEmptyLongPress
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)
        // Проверяваме да не е върху някое събитие
        for evView in eventViews {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        // Ако е празно, зануляваме edit режима навсякъде
        for (view, descriptor) in eventViewToDescriptor {
            if descriptor.editedEvent != nil {
                descriptor.editedEvent = nil
                view.updateWithDescriptor(event: descriptor)
            }
        }
        currentlyEditedEventView = nil
        
        // Callback
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
        // Group events by day
        let grouped = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        var usedEventViewIndex = 0
        
        for dayIndex in 0..<dayCount {
            guard let eventsForDay = grouped[dayIndex], !eventsForDay.isEmpty else { continue }
            let sortedEvents = eventsForDay.sorted { $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start }
            
            // Define availableWidth at the start of the loop
            let availableWidth = dayColumnWidth - style.eventGap * 2
            
            // Check if any events have a start time difference of less than 40 minutes
            let hasCloseEvents = checkCloseEvents(sortedEvents)
            
            if hasCloseEvents {
                // Use old logic: split the day into proportional parts for all events
                layoutWithProportionalColumns(sortedEvents, dayIndex: dayIndex, availableWidth: availableWidth)
            } else {
                // Use new logic: side-by-side columns or stacking based on screen size
                let maxColumns = calculateMaxConcurrentEvents(sortedEvents)
                
                // Check if we have enough width for separate columns or need to stack
                let screenWidth = bounds.width // Use the view's bounds for simplicity
                let minColumnWidth = 50.0 // Minimum width per column to avoid stacking
                let canUseColumns = (availableWidth / CGFloat(max(maxColumns, 1))) >= minColumnWidth
                
                if canUseColumns {
                    // Use side-by-side columns for larger screens
                    layoutWithColumns(sortedEvents, dayIndex: dayIndex, maxColumns: maxColumns, availableWidth: availableWidth)
                } else {
                    // Stack events vertically with slight indentation for overlaps on smaller screens
                    layoutStackedEvents(sortedEvents, dayIndex: dayIndex, availableWidth: availableWidth)
                }
            }
            
            // Apply layout to event views (common for all layouts)
            for attr in sortedEvents {
                let start = attr.descriptor.dateInterval.start
                let end = attr.descriptor.dateInterval.end
                
                let yStart = topMargin + dateToY(start)
                let yEnd = topMargin + dateToY(end)
                
                let (x, width) = eventPositions[attr] ?? (leadingInsetForHours + CGFloat(dayIndex) * dayColumnWidth + style.eventGap, availableWidth)
                let height = max(1, (yEnd - yStart) - style.eventGap)
                
                let evView = ensureEventView(index: usedEventViewIndex)
                usedEventViewIndex += 1
                evView.isHidden = false
                evView.frame = CGRect(x: x, y: yStart, width: width, height: height)
                evView.updateWithDescriptor(event: attr.descriptor)
                eventViewToDescriptor[evView] = attr.descriptor
                
                // Handle multi-day events and resize handles (unchanged)
                var slices: [EventView] = []
                if let multi = attr.descriptor as? EKMultiDayWrapper {
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
                
                if let multi = attr.descriptor as? EKMultiDayWrapper {
                    var isCurrentlyEditedEventView = false
                    for realSliceView in slices {
                        if currentlyEditedEventView == realSliceView {
                            isCurrentlyEditedEventView = true
                        }
                    }
                    if isCurrentlyEditedEventView {
                        let firstDayIndex = dayIndexFor(multi.realEvent.startDate)
                        let lastDayIndex = dayIndexFor(multi.realEvent.endDate)
                        
                        if firstDayIndex == lastDayIndex {
                            evView.eventResizeHandles[0].isHidden = false
                            evView.eventResizeHandles[1].isHidden = false
                        } else if dayIndex == firstDayIndex {
                            evView.eventResizeHandles[0].isHidden = false
                            evView.eventResizeHandles[1].isHidden = true
                        } else if dayIndex == lastDayIndex {
                            evView.eventResizeHandles[0].isHidden = true
                            evView.eventResizeHandles[1].isHidden = false
                        }
                    }
                }
            }
        }
        
        // Handle single-event selection case (unchanged)
        if eventViewToDescriptor.count == 1 {
            if isFirstResize {
                selectEventView(eventViewToDescriptor.first!.key)
            }
        }
    }
    
    // Check if any events have a start time difference of less than 40 minutes (check all pairs)
    private func checkCloseEvents(_ events: [EventLayoutAttributes]) -> Bool {
        let sortedEvents = events.sorted { $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start }
        for i in 0..<sortedEvents.count {
            for j in i + 1..<sortedEvents.count {
                let start1 = sortedEvents[i].descriptor.dateInterval.start
                let start2 = sortedEvents[j].descriptor.dateInterval.start
                
                // Check if the start time difference is less than 40 minutes
                let timeDiff = start2.timeIntervalSince(start1) / 60 // Convert to minutes
                if timeDiff < 40 {
                    return true
                }
            }
        }
        return false
    }
    
    // Calculate the maximum number of concurrent events at any point in time
    private func calculateMaxConcurrentEvents(_ events: [EventLayoutAttributes]) -> Int {
        var maxCount = 0
        var currentCount = 0
        var sortedTimes: [Date] = []
        
        // Collect all start and end times
        for event in events {
            sortedTimes.append(event.descriptor.dateInterval.start)
            sortedTimes.append(event.descriptor.dateInterval.end)
        }
        sortedTimes.sort()
        
        // Count concurrent events at each time point
        for time in sortedTimes {
            currentCount = events.filter { $0.descriptor.dateInterval.start <= time && $0.descriptor.dateInterval.end > time }.count
            maxCount = max(maxCount, currentCount)
        }
        
        return maxCount
    }
    
    // Layout events in distinct columns for larger screens (new logic)
    private var eventPositions: [EventLayoutAttributes: (x: CGFloat, width: CGFloat)] = [:]
    
    private func layoutWithColumns(_ events: [EventLayoutAttributes], dayIndex: Int, maxColumns: Int, availableWidth: CGFloat) {
        eventPositions.removeAll()
        let dayX = leadingInsetForHours + CGFloat(dayIndex) * dayColumnWidth
        
        // Group events by their column based on overlaps, reusing columns where possible
        var columns: [[EventLayoutAttributes]] = Array(repeating: [], count: maxColumns)
        for event in events {
            var placed = false
            for col in 0..<maxColumns {
                if !doesColumnOverlap(event, with: columns[col]) {
                    columns[col].append(event)
                    placed = true
                    break
                }
            }
            if !placed && maxColumns > columns.count {
                columns.append([event])
            } else if !placed {
                // If we exceed max columns, append to the last column (simulating stacking)
                columns[maxColumns - 1].append(event)
            }
        }
        
        // Assign positions to each event
        let columnWidth = availableWidth / CGFloat(max(maxColumns, 1)) - style.eventGap
        for (colIndex, column) in columns.enumerated() {
            for attr in column {
                let xPos = dayX + style.eventGap + CGFloat(colIndex) * (columnWidth + style.eventGap)
                eventPositions[attr] = (x: xPos, width: columnWidth)
            }
        }
    }
    
    // Layout events stacked vertically with slight indentation for smaller screens (new logic)
    private func layoutStackedEvents(_ events: [EventLayoutAttributes], dayIndex: Int, availableWidth: CGFloat) {
        eventPositions.removeAll()
        let dayX = leadingInsetForHours + CGFloat(dayIndex) * dayColumnWidth
        
        // Sort events by start time for stacking
        let sortedEvents = events.sorted { $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start }
        
        var currentY: CGFloat = 0
        var indent: CGFloat = 0
        
        for (index, attr) in sortedEvents.enumerated() {
            let start = attr.descriptor.dateInterval.start
            let end = attr.descriptor.dateInterval.end
            
            let yStart = topMargin + dateToY(start)
            let yEnd = topMargin + dateToY(end)
            let height = max(1, (yEnd - yStart) - style.eventGap)
            
            // Check for overlaps to determine indentation
            var overlaps = false
            for prevAttr in sortedEvents[0..<index] {
                if doesEventOverlap(attr, with: [prevAttr]) {
                    overlaps = true
                    break
                }
            }
            
            if overlaps {
                indent += 5 // Slight horizontal offset for nesting
                if indent > availableWidth / 2 {
                    indent = 0 // Reset if too much indentation
                }
            } else {
                indent = 0 // Reset indentation for non-overlapping events
            }
            
            let xPos = dayX + style.eventGap + indent
            let width = availableWidth - indent - style.eventGap
            eventPositions[attr] = (x: xPos, width: width)
        }
    }
    
    // Layout events with proportional columns (old logic for close events)
    private func layoutWithProportionalColumns(_ events: [EventLayoutAttributes], dayIndex: Int, availableWidth: CGFloat) {
        eventPositions.removeAll()
        let dayX = leadingInsetForHours + CGFloat(dayIndex) * dayColumnWidth
        
        // Non-overlapping columns (old logic)
        var columns: [[EventLayoutAttributes]] = []
        for attr in events {
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
        let columnWidth = (availableWidth - style.eventGap * (colCount - 1)) / colCount // Adjust for gaps between columns
        
        for (colIndex, columnEvents) in columns.enumerated() {
            for attr in columnEvents {
                let start = attr.descriptor.dateInterval.start
                let end = attr.descriptor.dateInterval.end
                
                let yStart = topMargin + dateToY(start)
                let yEnd = topMargin + dateToY(end)
                let height = max(1, (yEnd - yStart) - style.eventGap)
                
                let xPos = dayX + style.eventGap + CGFloat(colIndex) * (columnWidth + style.eventGap)
                eventPositions[attr] = (x: xPos, width: columnWidth)
            }
        }
    }
    
    // Check if an event overlaps with any event in a column (old logic)
    private func isOverlapping(_ candidate: EventLayoutAttributes, in columnEvents: [EventLayoutAttributes]) -> Bool {
        let candStart = candidate.descriptor.dateInterval.start
        let candEnd = candidate.descriptor.dateInterval.end
        for ev in columnEvents {
            let evStart = ev.descriptor.dateInterval.start
            let evEnd = ev.descriptor.dateInterval.end
            if evStart < candEnd && candStart < evEnd {
                return true
            }
        }
        return false
    }
    
    // Check if an event overlaps with any event in a column (new logic)
    private func doesColumnOverlap(_ candidate: EventLayoutAttributes, with column: [EventLayoutAttributes]) -> Bool {
        let candStart = candidate.descriptor.dateInterval.start
        let candEnd = candidate.descriptor.dateInterval.end
        for event in column {
            let evStart = event.descriptor.dateInterval.start
            let evEnd = event.descriptor.dateInterval.end
            if evStart < candEnd && candStart < evEnd {
                return true
            }
        }
        return false
    }
    
    // Check if two events overlap (used for stacking and close events)
    private func doesEventOverlap(_ candidate: EventLayoutAttributes, with events: [EventLayoutAttributes]) -> Bool {
        let candStart = candidate.descriptor.dateInterval.start
        let candEnd = candidate.descriptor.dateInterval.end
        for event in events {
            let evStart = event.descriptor.dateInterval.start
            let evEnd = event.descriptor.dateInterval.end
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
        
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        tapGR.delegate = self
        ev.addGestureRecognizer(tapGR)
        
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewPan(_:)))
        lp.minimumPressDuration = 0.2
        lp.delegate = self
        ev.addGestureRecognizer(lp)
        
        for handle in ev.eventResizeHandles {
            let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
            tapGR.delegate = self
            handle.addGestureRecognizer(tapGR)
            
            let lpResize = UILongPressGestureRecognizer(target: self, action: #selector(handleResizeHandlePanGesture(_:)))
            lpResize.delegate = self
            lpResize.minimumPressDuration = 0.05
            handle.addGestureRecognizer(lpResize)
        }
        
        ev.isUserInteractionEnabled = true
        addSubview(ev)
        return ev
    }
    
    // MARK: - createMissingSlicesIfNeeded / removeMissingSlicesIfNeeded
    @discardableResult
    private func createMissingSlicesIfNeeded(for multi: EKMultiDayWrapper, count: Int) -> [EventView] {
        removeMissingSlicesIfNeeded(for: multi)
        guard
            let realStart = multi.realEvent.startDate,
            let realEnd = multi.realEvent.endDate,
            realStart < realEnd
        else {
            return []
        }

        let eventID = multi.realEvent.eventIdentifier ?? "--noID--"
        let cal = Calendar.current
        
        let dayStart = cal.startOfDay(for: realStart)
        let dayEnd = cal.startOfDay(for: realEnd)
        
        var totalDays = cal.dateComponents([.day], from: dayStart, to: dayEnd).day ?? 0
        
        if !cal.isDate(dayEnd, equalTo: realEnd, toGranularity: .minute) {
            totalDays += 1
        }
        print("totalDays", totalDays)

        if totalDays < 1 {
            totalDays = 1
        }
        
        var newViews: [EventView] = []
        
        var index = 0
        if realStart < fromDate {
            print("realStart < fromDate")
        }
        if realEnd > toDate {
            print("realEnd > toDate")
            if count == 1 {
                index = 1
            }
        }
      
        for i in index..<totalDays {
            guard let thisDay = cal.date(byAdding: .day, value: i, to: dayStart) else { continue }
            
            let partialDayStart = max(thisDay, realStart)
            guard let nextDay = cal.date(byAdding: .day, value: 1, to: thisDay) else { continue }
            let partialDayEnd = min(nextDay, realEnd)
            
            if partialDayStart >= partialDayEnd {
                continue
            }
            
            // Skip if [partialDayStart..partialDayEnd] overlaps with [fromDate..toDate]
            if partialDayStart <= toDate && partialDayEnd > fromDate {
                continue
            }
            
            let partialWrapper = EKMultiDayWrapper(
                realEvent: multi.realEvent,
                partialStart: partialDayStart,
                partialEnd: partialDayEnd
            )
            
            let hiddenView = createEventView()
            hiddenView.isHidden = true
            hiddenView.updateWithDescriptor(event: partialWrapper)
            
            let dayIndex = dayIndexFor(partialDayStart)
            let x = leadingInsetForHours + CGFloat(dayIndex) * dayColumnWidth + style.eventGap
            let fromY = topMargin + dateToY(partialDayStart)
            let toY = topMargin + dateToY(partialDayEnd)
            let w = dayColumnWidth - 2 * style.eventGap
            let h = max(1, (toY - fromY) - style.eventGap)
            
            hiddenView.frame = CGRect(x: x, y: fromY, width: w, height: h)
            
            eventViewToDescriptor[hiddenView] = partialWrapper
            newViews.append(hiddenView)
        }
        
        dragSlicesMap[eventID] = newViews
        return newViews
    }

    private func removeMissingSlicesIfNeeded(for multi: EKMultiDayWrapper) {
        let eventID = multi.realEvent.eventIdentifier ?? "--noID--"
        guard let slices = dragSlicesMap[eventID] else { return }
        
        for sliceView in slices {
            sliceView.removeFromSuperview()
            eventViewToDescriptor.removeValue(forKey: sliceView)
        }
        dragSlicesMap.removeValue(forKey: eventID)
    }
    
    // MARK: - Gesture: Tap on Event
    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }
        selectEventView(tappedView)
        onEventTap?(descriptor)
    }
    
    // [MODIFIED] - Клик (tap) върху slice от многодневно събитие → всички slice-ове в edit режим
    private func selectEventView(_ evView: EventView) {
        // 1) Първо махаме edit режима от всички евенти
        for (view, desc) in eventViewToDescriptor {
            if desc.editedEvent != nil {
                desc.editedEvent = nil
                view.updateWithDescriptor(event: desc)
            }
        }
        
        // 2) Descriptor на кликнатото парче
        guard let descriptor = eventViewToDescriptor[evView] else { return }
        
        // 3) Ако е многодневно
        if let multi = descriptor as? EKMultiDayWrapper {
            let realEventObj = multi.realEvent
            // Търсим ВСИЧКИ slice-ове, които имат *същото* реално събитие
            for (view, d) in eventViewToDescriptor {
                if let m2 = d as? EKMultiDayWrapper {
                    // Първо сравняваме по обект
                    if m2.realEvent == realEventObj {
                        m2.editedEvent = m2
                        view.updateWithDescriptor(event: m2)
                    }
                    // После fallback по eventIdentifier
                    else if let eID1 = m2.realEvent.eventIdentifier,
                            let eID2 = realEventObj.eventIdentifier,
                            !eID1.isEmpty, !eID2.isEmpty,
                            eID1 == eID2 {
                        
                        m2.editedEvent = m2
                        view.updateWithDescriptor(event: m2)
                    }
                }
            }
        } else {
            // 4) Ако е еднодневно, само той влиза в edit режим
            descriptor.editedEvent = descriptor
            evView.updateWithDescriptor(event: descriptor)
        }
        
        // 5) Запомняме, ако ползвате тази променлива за друго
        currentlyEditedEventView = evView
        
        // 6) (Опционално) Обновяваме визуална индикация
        setSingle10MinuteMarkFromDate(descriptor.dateInterval.start)
    }
    
    private struct DragData {
        let totalDuration: TimeInterval
        let originalContainerFrames: [EventView: CGRect]
        let anchorOffsetX: CGFloat
        let anchorOffsetY: CGFloat
        let originalStart: Date
    }
    
    private func removeGhostsForDescriptor(_ descriptor: EventDescriptor) {
        let pairsToRemove = draggingGhosts.filter { (originalView, ghostView) in
            if let d = eventViewToDescriptor[originalView] {
                return d === descriptor
            }
            return false
        }
        for (originalView, ghostView) in pairsToRemove {
            ghostView.removeFromSuperview()
            draggingGhosts.removeValue(forKey: originalView)
            if let oldAlpha = draggingOriginalAlphas[originalView] {
                originalView.alpha = oldAlpha
                draggingOriginalAlphas.removeValue(forKey: originalView)
            }
        }
    }
    
    @objc private func handleEventViewPan(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        
        var missingEvent: [EventView] = []
        switch gesture.state {
        case .began:
            // Always enter edit mode on long press, regardless of which part is tapped
            selectEventView(evView)
            isFirstResize = false
            removeGhostsForDescriptor(descriptor)
            
            if evView.layer.value(forKey: DRAG_DATA_KEY) != nil {
                return
            }
            
            setScrollsClipping(enabled: false)
            var totalDays = 1
            if let multi = descriptor as? EKMultiDayWrapper {
                let cal = Calendar.current
                let startOfStart = cal.startOfDay(for: multi.realEvent.startDate)
                let startOfEnd = cal.startOfDay(for: multi.realEvent.endDate)
                let dayCount = cal.dateComponents([.day], from: startOfStart, to: startOfEnd).day ?? 0
                totalDays = dayCount + 1
                print("Многодневното събитие обхваща \(totalDays) календарни дни.")
            }
            let realStart: Date
            let realEnd: Date
            if let multi = descriptor as? EKMultiDayWrapper {
                realStart = multi.realEvent.startDate
                realEnd = multi.realEvent.endDate
            } else {
                realStart = descriptor.dateInterval.start
                realEnd = descriptor.dateInterval.end
            }
            let totalDuration = realEnd.timeIntervalSince(realStart)
            
            guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
            
            var slices: [EventView] = []
            if let multi = descriptor as? EKMultiDayWrapper {
                let eventID = multi.realEvent.eventIdentifier
                for (ov, od) in eventViewToDescriptor {
                    if let om = od as? EKMultiDayWrapper,
                       om.realEvent.eventIdentifier == eventID {
                        slices.append(ov)
                    }
                }
            }
            print("IndexB", slices.count)
            if let multi = descriptor as? EKMultiDayWrapper {
                if totalDays != slices.count {
                    missingEvent = createMissingSlicesIfNeeded(for: multi, count: slices.count)
                }
            }
            for realSliceView in missingEvent {
                slices.append(realSliceView)
            }
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            var originalFrames = [EventView: CGRect]()
            print("IndexA", slices.count)
            for realSliceView in slices {
                if let desc = eventViewToDescriptor[realSliceView] {
                    
                    realSliceView.isHidden = false
                    draggingOriginalAlphas[realSliceView] = realSliceView.alpha
                    realSliceView.alpha = 0.0
                    
                    let sliceFrameInTimeline = realSliceView.frame
                    let sliceFrameInContainer = self.convert(sliceFrameInTimeline, to: container)
                    
                    let ghost = createEventView()
                    ghost.updateWithDescriptor(event: desc)
                    ghost.alpha = 1.0
                    ghost.layer.zPosition = 2
                    container.addSubview(ghost)
                    
                    let hoursTotal = totalDuration / 3600.0
                    var ghostH = hourHeight * CGFloat(hoursTotal) - 2.5
                    
                    let dayIndex = dayIndexFor(desc.dateInterval.start)
                    let dayStart = dayStartDate(for: dayIndex)
                    let hoursOffset = realStart.timeIntervalSince(dayStart) / 3600.0
                    let topY = topMargin + CGFloat(hoursOffset) * hourHeight
                    var finalY = sliceFrameInContainer.minY - (dateToY(desc.dateInterval.start) - topY) - 10
                    
                    let localX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
                    // Convert point (localX, 0) from self to container
                    let containerPoint = self.convert(CGPoint(x: localX, y: 0), to: container)
                    
                    let ghostX = containerPoint.x + 2
                    let ghostW = dayColumnWidth - style.eventGap * 2 - 2

                    if totalDays == 1 {
                        print("ghostX", sliceFrameInContainer.minX, "ghostY", sliceFrameInContainer.minY)
                        finalY = sliceFrameInContainer.minY
                        ghostH = sliceFrameInContainer.height
                    }
                  
                    let ghostFrame = CGRect(
                        x: ghostX,
                        y: finalY,
                        width: ghostW,
                        height: ghostH
                    )
                    ghost.frame = ghostFrame
                    ghost.isHidden = false
                    
                    draggingGhosts[realSliceView] = ghost
                    originalFrames[realSliceView] = ghostFrame
                }
            }
            
            let fingerInContainer = gesture.location(in: container)
            guard let anchorGhost = draggingGhosts[evView] else { return }
            
            let anchorFrame = anchorGhost.frame
            let offsetX = fingerInContainer.x - anchorFrame.minX
            let offsetY = fingerInContainer.y - anchorFrame.minY
            
            let d = DragData(
                totalDuration: totalDuration,
                originalContainerFrames: originalFrames,
                anchorOffsetX: offsetX,
                anchorOffsetY: offsetY,
                originalStart: descriptor.dateInterval.start
            )
            evView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            
        case .changed:
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData else { return }
            
            guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
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
            
            // Snap to 10-minute steps while dragging
            if let anchorGhost = draggingGhosts[evView] {
                let ghostFrameInTimeline = anchorGhost.frame
                let frameSelf = container.convert(ghostFrameInTimeline, to: self)
                
                let topY = frameSelf.minY
                let bottomY = frameSelf.maxY
                
                let topIsVisible = (topY >= 0 && topY < bounds.height)
                if topIsVisible {
                    if let newStart = dateFromFrame(frameSelf) {
                        let snapped = snapToNearest10Min(newStart)
                        setSingle10MinuteMarkFromDate(snapped)
                    }
                } else {
                    var bottomFrame = frameSelf
                    bottomFrame.origin.y = bottomY - 1
                    bottomFrame.size.height = 1
                    if let newEnd = dateFromFrame(bottomFrame) {
                        let snapped = snapToNearest10Min(newEnd)
                        setSingle10MinuteMarkFromDate(snapped)
                    }
                }
            }
            
            updateAutoScrollDirection(for: gesture)
            
        case .ended, .cancelled:
            for realSliceView in missingEvent {
                eventViewToDescriptor.removeValue(forKey: realSliceView)
            }
            setScrollsClipping(enabled: true)
            stopAutoScroll()
            hoursColumnView?.selectedMinuteMark = nil
            
            guard let d = evView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let anchorGhost = draggingGhosts[evView],
                  let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else {
                
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
            
            let finalFrame = anchorGhost.frame
            let frameSelf = container.convert(finalFrame, to: self)
            
            let midX = frameSelf.midX
            var dayIndex = Int(floor((midX - leadingInsetForHours) / dayColumnWidth))
            dayIndex = max(0, min(dayIndex, dayCount - 1))
            
            let topY = frameSelf.minY
            let hourOffset = (topY - topMargin) / hourHeight
            
            let dayDate = dayStartDate(for: dayIndex)
            let finalStart = dayDate.addingTimeInterval(hourOffset * 3600)
            
            for (sv, gh) in draggingGhosts {
                gh.removeFromSuperview()
                if let alpha = draggingOriginalAlphas[sv] {
                    sv.alpha = alpha
                }
            }
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            if let multi = descriptor as? EKMultiDayWrapper {
                removeMissingSlicesIfNeeded(for: multi)
            }
            
            // Snap to nearest 10 minutes
            let snappedStart = snapToNearest10Min(finalStart)
            let snappedEnd = snappedStart.addingTimeInterval(d.totalDuration)
            
            descriptor.isAllDay = false
            descriptor.dateInterval = DateInterval(start: snappedStart, end: snappedEnd)
            
            // Check where the drop occurred
            let locationInContainer = gesture.location(in: container)
            if let hitView = container.hitTest(locationInContainer, with: nil) {
                let hitViewClass = String(describing: type(of: hitView))
                let parent1Class = hitView.superview.map { String(describing: type(of: $0)) } ?? "nil"
                let parent2Class = hitView.superview?.superview.map { String(describing: type(of: $0)) } ?? "nil"
                
                if hitViewClass.contains("MultiDayTimelineViewNonOverlapping") ||
                   parent1Class.contains("MultiDayTimelineViewNonOverlapping") ||
                   parent2Class.contains("MultiDayTimelineViewNonOverlapping") {
                    onEventDragEnded?(descriptor, snappedStart, false)
                } else if hitViewClass.contains("AllDayViewNonOverlapping") ||
                          parent1Class.contains("AllDayViewNonOverlapping") ||
                          parent2Class.contains("AllDayViewNonOverlapping") {
                    for (view, _) in eventViewToDescriptor {
                        view.eventResizeHandles[0].isHidden = true
                        view.eventResizeHandles[1].isHidden = true
                    }
                    currentlyEditedEventView = nil
                    onEventConvertToAllDay?(descriptor, dayIndex)
                }
            }
          
            evView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            eventViewToDescriptor.removeAll()
            setNeedsLayout()
            
        default:
            break
        }
    }
    
    private struct ResizeDragData {
        let startGlobalPoint: CGPoint
        var originalFrame: CGRect
        let isTop: Bool
        let startInterval: DateInterval
        let wasAllDay: Bool
        let originalDayIndex: Int
        var lastDayIndex: Int
        let missingBefore: Bool
        let missingAfter: Bool
        var totalDay: Int
        let originalTotalDays: Int
    }

    @objc private func handleResizeHandlePanGesture(_ gesture: UILongPressGestureRecognizer) {
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView,
              let desc = eventViewToDescriptor[eventView]
        else { return }
        isFirstResize = false
        let isTop = (handleView.tag == 0)  // Top handle => tag = 0, Bottom => tag = 1
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }
        var missingBefore: Bool = false
        var missingAfter: Bool = false
        switch gesture.state {
        // ----------------------------------------------------------------------------------
        // MARK: .began
        // ----------------------------------------------------------------------------------
        case .began:
            let realStart: Date
            let realEnd: Date
            if let multi = desc as? EKMultiDayWrapper {
                realStart = multi.realEvent.startDate
                realEnd = multi.realEvent.endDate
            } else {
                realStart = desc.dateInterval.start
                realEnd = desc.dateInterval.end
            }
            
            // Enter edit mode on long press
            selectEventView(eventView)
            
            // Remove old ghosts if any
            removeGhostsForDescriptor(desc)
            
            // If drag data already exists, exit
            if eventView.layer.value(forKey: DRAG_DATA_KEY) != nil {
                return
            }
            
            // Disable clipping to allow movement outside visible area
            setScrollsClipping(enabled: false)
            
            var totalDays = 1
            if let multi = desc as? EKMultiDayWrapper {
                let cal = Calendar.current
                let startOfStart = cal.startOfDay(for: multi.realEvent.startDate)
                let startOfEnd = cal.startOfDay(for: multi.realEvent.endDate)
                let dayCount = cal.dateComponents([.day], from: startOfStart, to: startOfEnd).day ?? 0
                totalDays = dayCount + 1
                print("Многодневното събитие обхваща \(totalDays) календарни дни.")
            }
            
            // Collect all slices of this event
            var slices: [EventView] = []
            if let multi = desc as? EKMultiDayWrapper {
                let eventID = multi.realEvent.eventIdentifier
                for (ov, od) in eventViewToDescriptor {
                    if let om = od as? EKMultiDayWrapper,
                       om.realEvent.eventIdentifier == eventID {
                        slices.append(ov)
                    }
                }
            }
            var missingEvent: [EventView] = []
            if let multi = desc as? EKMultiDayWrapper {
                if totalDays != slices.count {
                    missingEvent = createMissingSlicesIfNeeded(for: multi, count: slices.count)
                }
                if !missingEvent.isEmpty {
                    // Report missing slices before or after the visible range
                    if multi.realEvent.startDate < fromDate {
                        print("Липсващи slice-ове: ПРЕДИ видимия диапазон.")
                        missingBefore = true
                    }
                    if multi.realEvent.endDate > toDate {
                        print("Липсващи slice-ове: СЛЕД видимия диапазон.")
                        missingAfter = true
                    }
                }
            }
            print("IndexA", slices.count)

            // Create ghosts and store original frames
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            var originalFrames = [EventView: CGRect]()
            
            for realSliceView in slices {
                guard let thisDesc = eventViewToDescriptor[realSliceView] else { continue }
                
                realSliceView.isHidden = false
                draggingOriginalAlphas[realSliceView] = realSliceView.alpha
                realSliceView.alpha = 0.0  // Hide the original
                
                let sliceFrameInSelf = realSliceView.frame
                let ghost = createEventView()
                ghost.updateWithDescriptor(event: thisDesc)
                ghost.alpha = 1.0
                ghost.layer.zPosition = 2
                addSubview(ghost)
                
                let dayIndex = dayIndexFor(thisDesc.dateInterval.start)
                let ghostX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex) + 2
                let ghostY = sliceFrameInSelf.minY
                let ghostW = dayColumnWidth - style.eventGap * 2 - 2
                let ghostH = sliceFrameInSelf.height
                
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
            
            let startPointInSelf = gesture.location(in: self)
            
            let dateInterval = DateInterval(start: realStart, end: realEnd)
            var originalDayIndex = 0
            if isTop {
                originalDayIndex = dayIndexFor(dateInterval.start)
            } else {
                originalDayIndex = dayIndexFor(dateInterval.end)
            }
            
            let d = ResizeDragData(
                startGlobalPoint: startPointInSelf,
                originalFrame: originalFrames[eventView] ?? .zero,
                isTop: isTop,
                startInterval: dateInterval,
                wasAllDay: desc.isAllDay,
                originalDayIndex: originalDayIndex,
                lastDayIndex: originalDayIndex,
                missingBefore: missingBefore,
                missingAfter: missingAfter,
                totalDay: totalDays,
                originalTotalDays: totalDays
            )
            eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            
        // ----------------------------------------------------------------------------------
        // MARK: .changed
        // ----------------------------------------------------------------------------------
        case .changed:
            guard var d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? ResizeDragData,
                  let ghost = draggingGhosts[eventView] else { return }
            
            let MIN_HEIGHT: CGFloat = 20  // Minimum height
            
            // Calculate vertical delta (for top or bottom)
            let currPointInSelf = gesture.location(in: self)
            let diffY = currPointInSelf.y - d.startGlobalPoint.y
            var f = d.originalFrame
            
            if d.isTop {
                f.origin.y += diffY
                f.size.height -= diffY
            } else {
                f.size.height += diffY
            }
            
            if f.size.height < MIN_HEIGHT {
                if d.isTop {
                    let bottomY = d.originalFrame.maxY
                    f.origin.y = bottomY - MIN_HEIGHT
                    f.size.height = MIN_HEIGHT
                } else {
                    let topY = d.originalFrame.minY
                    f.size.height = MIN_HEIGHT
                    f.origin.y = topY
                }
            }
            
            // Calculate dayIndex from X
            let newDayIndexRaw = Int((currPointInSelf.x - leadingInsetForHours) / dayColumnWidth)
            var clampedDayIndex = max(0, min(newDayIndexRaw, dayCount - 1))
            
            // Get all day indices from ghosts => min, max
            let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                let midX = gv.frame.midX
                let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                return max(0, min(di, dayCount - 1))
            }
            guard !allGhostDayIndexes.isEmpty else { break }
            
            // If we have more than 1 slice => multi-day; clamp (checks)
            if draggingGhosts.count > 1 {
                let minSliceIndex = allGhostDayIndexes.min()!
                let maxSliceIndex = allGhostDayIndexes.max()!
                
                if d.isTop {
                    if clampedDayIndex >= maxSliceIndex && (missingAfter || (!missingBefore && !missingAfter)) {
                        clampedDayIndex = maxSliceIndex
                        if let ghostAtMax = draggingGhosts.values.first(where: { gv in
                            let midX = gv.frame.midX
                            let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                            return di == maxSliceIndex
                        }) {
                            let newBottomY = ghostAtMax.frame.maxY
                            let potentialTopY = f.origin.y
                            var potentialHeight = newBottomY - potentialTopY
                            if potentialHeight < 0 {
                                potentialHeight = MIN_HEIGHT
                            }
                            if potentialHeight < MIN_HEIGHT {
                                potentialHeight = MIN_HEIGHT
                            }
                            f.size.height = potentialHeight
                            f.origin.y = newBottomY - potentialHeight
                        }
                    }
                } else {
                    if clampedDayIndex <= minSliceIndex && (missingBefore || (!missingBefore && !missingAfter)) {
                        clampedDayIndex = minSliceIndex
                        if let ghostAtMin = draggingGhosts.values.first(where: { gv in
                            let midX = gv.frame.midX
                            let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                            return di == minSliceIndex
                        }) {
                            let oldBottomY = f.maxY
                            let newTopY = ghostAtMin.frame.minY
                            f.origin.y = newTopY
                            f.size.height = oldBottomY - newTopY
                            if f.size.height < MIN_HEIGHT {
                                f.size.height = MIN_HEIGHT
                            }
                        }
                    }
                }
            }
            
            let limitDayIndex = d.isTop ? dayIndexFor(d.startInterval.end) : dayIndexFor(d.startInterval.start)
            if d.isTop {
                clampedDayIndex = min(clampedDayIndex, limitDayIndex)
            } else {
                clampedDayIndex = max(clampedDayIndex, limitDayIndex)
            }
            
            // Adjust X & width
            let newX = leadingInsetForHours + CGFloat(clampedDayIndex) * dayColumnWidth + 2
            let ghostW = dayColumnWidth - style.eventGap * 2 - 2
            f.origin.x = newX
            f.size.width = ghostW
            
            ghost.frame = f
            
            // Check if dayIndex has changed and print
            if clampedDayIndex != d.lastDayIndex {
                if draggingGhosts.count > 1 {
                    print("Многодневен евент: смяна на колона от \(d.lastDayIndex) на \(clampedDayIndex)")
                    let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                        let midX = gv.frame.midX
                        let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                        return max(0, min(di, dayCount - 1))
                    }
                    print("allGhostDayIndexes", allGhostDayIndexes)
                    if !allGhostDayIndexes.contains(d.lastDayIndex) {
                        let ghost = createEventView()
                        ghost.updateWithDescriptor(event: desc)
                        ghost.alpha = 1.0
                        ghost.layer.zPosition = 2
                        addSubview(ghost)
                        
                        let dayIndex = d.lastDayIndex
                        let ghostX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex) + 2
                        let ghostY = 10
                        let ghostW = dayColumnWidth - style.eventGap * 2 - 2
                        let ghostH = 24 * 50 - 3
                        
                        let ghostFrame = CGRect(
                            x: ghostX,
                            y: CGFloat(ghostY),
                            width: ghostW,
                            height: CGFloat(ghostH)
                        )
                        ghost.frame = ghostFrame
                        ghost.isHidden = false
                        
                        draggingGhosts[ghost] = ghost
                        d.totalDay = d.totalDay + 1
                    }
                } else {
                    print("Еднодневен евент: смяна на колона от \(d.lastDayIndex) на \(clampedDayIndex)")
                    
                    if isTop && d.lastDayIndex > clampedDayIndex && d.originalDayIndex == d.lastDayIndex {
                        let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                            let midX = gv.frame.midX
                            let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                            return max(0, min(di, dayCount - 1))
                        }
                        print("allGhostDayIndexes", allGhostDayIndexes)
                        if !allGhostDayIndexes.contains(d.lastDayIndex) {
                            let ghost = createEventView()
                            ghost.updateWithDescriptor(event: desc)
                            ghost.alpha = 1.0
                            ghost.layer.zPosition = 2
                            addSubview(ghost)
                            
                            let dayIndex = d.lastDayIndex
                            let ghostX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex) + 2
                            let ghostY = 10
                            let ghostW = dayColumnWidth - style.eventGap * 2 - 2
                            let ghostH = d.originalFrame.maxY - 10
                            
                            let ghostFrame = CGRect(
                                x: ghostX,
                                y: CGFloat(ghostY),
                                width: ghostW,
                                height: CGFloat(ghostH)
                            )
                            ghost.frame = ghostFrame
                            ghost.isHidden = false
                            
                            draggingGhosts[ghost] = ghost
                            let ghostFrame2 = CGRect(
                                x: ghostX,
                                y: d.originalFrame.minY,
                                width: ghostW,
                                height: 24 * 50 + 7 - d.originalFrame.minY
                            )
                            d.originalFrame = ghostFrame2
                            d.totalDay = d.totalDay + 1
                        }
                    } else if !isTop && d.lastDayIndex < clampedDayIndex && d.originalDayIndex == d.lastDayIndex {
                        let allGhostDayIndexes: [Int] = draggingGhosts.values.compactMap { gv in
                            let midX = gv.frame.midX
                            let di = Int((midX - leadingInsetForHours) / dayColumnWidth)
                            return max(0, min(di, dayCount - 1))
                        }
                        print("allGhostDayIndexes", allGhostDayIndexes)
                        if !allGhostDayIndexes.contains(d.lastDayIndex) {
                            let ghost = createEventView()
                            ghost.updateWithDescriptor(event: desc)
                            ghost.alpha = 1.0
                            ghost.layer.zPosition = 2
                            addSubview(ghost)
                            
                            let dayIndex = d.lastDayIndex
                            let ghostX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex) + 2
                            let ghostY = d.originalFrame.minY
                            let ghostW = dayColumnWidth - style.eventGap * 2 - 2
                            let ghostH = 24 * 50 + 10 - d.originalFrame.minY
                            
                            let ghostFrame = CGRect(
                                x: ghostX,
                                y: CGFloat(ghostY),
                                width: ghostW,
                                height: CGFloat(ghostH)
                            )
                            ghost.frame = ghostFrame
                            ghost.isHidden = false
                            
                            draggingGhosts[ghost] = ghost
                            
                            let ghostFrame2 = CGRect(
                                x: ghostX,
                                y: 10,
                                width: ghostW,
                                height: d.originalFrame.maxY - 10
                            )
                            d.originalFrame = ghostFrame2
                            d.totalDay = d.totalDay + 1
                        }
                    }
                }
                // Update lastDayIndex
                d.lastDayIndex = clampedDayIndex
                eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)
            }
            
            // Snap to 10 minutes if desired
            if let newDateRaw = dateFromResize(f, isTop: d.isTop) {
                let snapped = snapToNearest10Min(newDateRaw)
                setSingle10MinuteMarkFromDate(snapped)
            }
            
            // Auto-scroll
            updateAutoScrollDirection(for: gesture)
            
            // Hide slices outside the scope
            let boundaryDayIndex = clampedDayIndex
            for (origView, ghostView) in draggingGhosts {
                if origView == eventView { continue }
                let ghostMidX = ghostView.frame.midX
                let ghostDayIndex = Int((ghostMidX - leadingInsetForHours) / dayColumnWidth)
                
                if d.isTop {
                    if ghostDayIndex <= boundaryDayIndex {
                        let isHidden = ghostView.isHidden
                        ghostView.isHidden = true
                        if isHidden != ghostView.isHidden {
                            d.totalDay = d.totalDay - 1
                        }
                    } else {
                        let isHidden = ghostView.isHidden
                        ghostView.isHidden = false
                        if isHidden != ghostView.isHidden {
                            d.totalDay = d.totalDay + 1
                        }
                    }
                } else {
                    if ghostDayIndex >= boundaryDayIndex {
                        let isHidden = ghostView.isHidden
                        ghostView.isHidden = true
                        if isHidden != ghostView.isHidden {
                            d.totalDay = d.totalDay - 1
                        }
                    } else {
                        let isHidden = ghostView.isHidden
                        ghostView.isHidden = false
                        if isHidden != ghostView.isHidden {
                            d.totalDay = d.totalDay + 1
                        }
                    }
                }
            }
            
            eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)

        // ----------------------------------------------------------------------------------
        // MARK: .ended / .cancelled
        // ----------------------------------------------------------------------------------
        case .ended, .cancelled:
            stopAutoScroll()
            setScrollsClipping(enabled: true)
            hoursColumnView?.selectedMinuteMark = nil
            
            guard let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? ResizeDragData,
                  let ghost = draggingGhosts[eventView]
            else {
                // If no DragData, just remove ghosts
                for (sv, gh) in draggingGhosts {
                    gh.removeFromSuperview()
                    if let oldAlpha = draggingOriginalAlphas[sv] {
                        sv.alpha = oldAlpha
                    }
                }
                draggingGhosts.removeAll()
                draggingOriginalAlphas.removeAll()
                return
            }
            
            let finalFrameInSelf = ghost.frame
            
            // Remove ghosts, restore alpha
            for (sv, gh) in draggingGhosts {
                gh.removeFromSuperview()
                if let oldAlpha = draggingOriginalAlphas[sv] {
                    sv.alpha = oldAlpha
                }
            }
            draggingGhosts.removeAll()
            draggingOriginalAlphas.removeAll()
            
            // Remove slices if created for multi-day events
            if let multi = desc as? EKMultiDayWrapper {
                removeMissingSlicesIfNeeded(for: multi)
            }
            
            eventView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            
            // New date interval
            var interval = d.startInterval
            desc.isAllDay = false
            
            // Snap the top or bottom edge
            if let newDateRaw = dateFromResize(finalFrameInSelf, isTop: d.isTop) {
                let snapped = snapToNearest10Min(newDateRaw)
                if d.isTop {
                    if snapped < interval.end {
                        interval = DateInterval(start: snapped, end: interval.end)
                    }
                } else {
                    if snapped > interval.start {
                        interval = DateInterval(start: interval.start, end: snapped)
                    }
                }
            }
            if d.originalTotalDays == eventViewToDescriptor.count && d.totalDay == 1 {
                for ev in eventViews {
                    ev.isHidden = true
                }
                isFirstResize = true
                eventViews.removeAll()
            }
            desc.dateInterval = interval
            let newEdge = d.isTop ? interval.start : interval.end
            onEventDragResizeEnded?(desc, newEdge)
            eventViewToDescriptor.removeAll()
            // Update layout
            setNeedsLayout()
            
        default:
            break
        }
    }

    // MARK: - dayIndex, etc.
    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let dateOnly = cal.startOfDay(for: date)
        let comps = cal.dateComponents([.day], from: startOnly, to: dateOnly)
        return comps.day ?? 0
    }
    
    func dayStartDate(for dayIndex: Int) -> Date {
        let cal = Calendar.current
        let start = cal.startOfDay(for: fromDate)
        return cal.date(byAdding: .day, value: dayIndex, to: start) ?? start
    }
    
    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return hourHeight * (hour + minute/60.0)
    }

    private func dateFromResize(_ frameInTimeline: CGRect, isTop: Bool) -> Date? {
        let y = isTop ? frameInTimeline.minY : frameInTimeline.maxY
        let localY = y - topMargin
        let midX = frameInTimeline.midX
        
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        
        let dayDate = dayStartDate(for: dayIndex)
        
        var hoursFloat = localY / hourHeight
        hoursFloat = max(0, min(24, hoursFloat))
        
        let hour = floor(hoursFloat)
        let minuteFloat = (hoursFloat - hour) * 60
        let minute = floor(minuteFloat)
        
        var comps = Calendar.current.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hour)
        comps.minute = Int(minute)
        comps.second = 0
        
        return Calendar.current.date(from: comps)
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
        
        // Left boundary
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        
        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: lastY))
        }
        ctx.strokePath()
        ctx.restoreGState()
        
        // Red "now" line
        drawCurrentTimeLine(ctx: ctx)
    }
    
    private func drawCurrentTimeLine(ctx: CGContext) {
        let now = Date()
        let cal = Calendar.current
        let nowOnly = cal.startOfDay(for: now)
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly = cal.startOfDay(for: toDate)
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
    private func updateAutoScrollDirection(for gesture: UILongPressGestureRecognizer) {
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
