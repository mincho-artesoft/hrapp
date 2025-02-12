import UIKit
import CalendarKit

public final class WeekTimelineViewNonOverlapping: UIView, UIGestureRecognizerDelegate {

    // MARK: - Публични настройки

    /// Вече работим с произволен диапазон [fromDate .. toDate], вместо фиксирана седмица
    public var fromDate: Date = Date()
    public var toDate: Date = Date()

    public var style = TimelineStyle()

    public var leadingInsetForHours: CGFloat = 70
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50

    public var allDayHeight: CGFloat = 40
    public var autoResizeAllDayHeight = true

    /// Свързваме го, за да рисуваме допълнителна отметка (minuteMark)
    public weak var hoursColumnView: HoursColumnView?

    // Колбек-и
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?

    // Данни за layout
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // Всички реални субвюта
    private var allDayEventViews: [EventView] = []
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView : EventDescriptor] = [:]

    // Кой евент е "edited"
    private var currentlyEditedEventView: EventView?

    // За drag на целия евент
    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?

    /// Речник за запазване на оригиналните рамки (за multi-day drag)
    private var multiDayDraggingOriginalFrames: [EventView: CGRect] = [:]

    private let DRAG_DATA_KEY = "ResizeDragDataKey"
    private var ghostView: EventView?

    // MARK: - Инициализация

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

    // MARK: - Gesture Recognizer Delegate
    public override func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }

    // MARK: - Setup на жестове

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

    // MARK: - Tap върху празно -> деселекция
    @objc private func handleTapOnEmptySpace(_ gesture: UITapGestureRecognizer) {
        guard gesture.state == .ended else { return }
        // Ако нещо е селектирано, изчистваме
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }
        hoursColumnView?.selectedMinuteMark = nil
        hoursColumnView?.setNeedsDisplay()
    }

    // MARK: - Layout

    public override func layoutSubviews() {
        super.layoutSubviews()

        for v in allDayEventViews { v.isHidden = true }
        for v in eventViews { v.isHidden = true }

        if autoResizeAllDayHeight {
            recalcAllDayHeightDynamically()
        }

        layoutAllDayBackground()
        layoutAllDayLabel()
        layoutAllDayEvents()
        layoutRegularEvents()
    }

    // Колко дни обхваща диапазонът?
    private var dayCount: Int {
        let cal = Calendar.current
        let startOnly = cal.startOfDay(for: fromDate)
        let endOnly = cal.startOfDay(for: toDate)
        let comps = cal.dateComponents([.day], from: startOnly, to: endOnly)
        // +1 за да включим и последния ден
        return (comps.day ?? 0) + 1
    }

    // MARK: - All-day фон
    private let allDayBackground = UIView()
    private var didSetupAllDayBackground = false

    private func layoutAllDayBackground() {
        if !didSetupAllDayBackground {
            allDayBackground.backgroundColor = .systemGray5
            addSubview(allDayBackground)
            didSetupAllDayBackground = true
        }
        let x = leadingInsetForHours
        let w = dayColumnWidth * CGFloat(dayCount)
        allDayBackground.frame = CGRect(x: x, y: 0, width: w, height: allDayHeight)
    }

    // MARK: - All-day label
    private let allDayLabel = UILabel()
    private var didSetupAllDayLabel = false

    private func layoutAllDayLabel() {
        if !didSetupAllDayLabel {
            allDayLabel.text = "all-day"
            allDayLabel.font = UIFont.systemFont(ofSize: 14)
            allDayLabel.textColor = .black
            addSubview(allDayLabel)
            didSetupAllDayLabel = true
        }
        let lw = leadingInsetForHours
        allDayLabel.frame = CGRect(x: 0, y: 0, width: lw, height: allDayHeight)
    }

    // Определяме автоматично колко високо да е allDayHeight
    private func recalcAllDayHeightDynamically() {
        let groupedByDay = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        let maxEventsInAnyDay = groupedByDay.values.map { $0.count }.max() ?? 0
        if maxEventsInAnyDay <= 1 {
            allDayHeight = 40
        } else {
            let rowHeight: CGFloat = 24
            let base: CGFloat = 10
            allDayHeight = base + (rowHeight * CGFloat(maxEventsInAnyDay))
        }
    }

    // MARK: - All-day евенти
    private func layoutAllDayEvents() {
        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }

        let base: CGFloat = 10
        let groupedMax = grouped.values.map { $0.count }.max() ?? 1
        let rowHeight = max(24, (allDayHeight - base) / CGFloat(groupedMax))

        var usedIndex = 0
        for dayIndex in 0..<dayCount {
            let dayEvents = grouped[dayIndex] ?? []
            for (i, attr) in dayEvents.enumerated() {
                let x = leadingInsetForHours + CGFloat(dayIndex) * dayColumnWidth + style.eventGap
                let y = style.eventGap + CGFloat(i) * rowHeight
                let w = dayColumnWidth - style.eventGap * 2
                let h = rowHeight - style.eventGap * 2

                let v = ensureAllDayEventView(index: usedIndex)
                usedIndex += 1

                v.isHidden = false
                v.frame = CGRect(x: x, y: y, width: w, height: h)
                v.updateWithDescriptor(event: attr.descriptor)
                eventViewToDescriptor[v] = attr.descriptor
            }
        }
    }

    // MARK: - Regular евенти
    private func layoutRegularEvents() {
        let groupedByDay = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        var usedEventViewIndex = 0

        for dayIndex in 0..<dayCount {
            guard let eventsForDay = groupedByDay[dayIndex], !eventsForDay.isEmpty else { continue }
            let sorted = eventsForDay.sorted { $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start }
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
                if !placed { columns.append([attr]) }
            }
            let colCount = CGFloat(columns.count)
            let columnWidth = (dayColumnWidth - style.eventGap * 2) / colCount

            for (colIndex, columnEvents) in columns.enumerated() {
                for attr in columnEvents {
                    let start = attr.descriptor.dateInterval.start
                    let end   = attr.descriptor.dateInterval.end
                    let yStart = dateToY(start)
                    let yEnd   = dateToY(end)
                    let x = leadingInsetForHours + CGFloat(dayIndex) * dayColumnWidth + style.eventGap + columnWidth * CGFloat(colIndex)
                    let finalY = yStart + allDayHeight
                    let w = columnWidth - style.eventGap
                    let h = (yEnd - yStart) - style.eventGap

                    let evView = ensureRegularEventView(index: usedEventViewIndex)
                    usedEventViewIndex += 1

                    evView.isHidden = false
                    evView.frame = CGRect(x: x, y: finalY, width: w, height: h)
                    evView.updateWithDescriptor(event: attr.descriptor)
                    eventViewToDescriptor[evView] = attr.descriptor
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
            if evStart < candEnd && candStart < evEnd { return true }
        }
        return false
    }

    private func ensureAllDayEventView(index: Int) -> EventView {
        if index < allDayEventViews.count {
            return allDayEventViews[index]
        } else {
            let v = createEventView()
            allDayEventViews.append(v)
            return v
        }
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

        // Tap -> селекция
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        tapGR.delegate = self
        ev.addGestureRecognizer(tapGR)

        // LongPress -> drag евент
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewLongPress(_:)))
        lp.minimumPressDuration = 0.5
        lp.delegate = self
        ev.addGestureRecognizer(lp)

        // Pan -> ако евентът вече е селектиран
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

    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }

        // Премахваме старата селекция
        if let oldView = currentlyEditedEventView, oldView !== tappedView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
        }

        // Селектираме текущия
        descriptor.editedEvent = descriptor
        tappedView.updateWithDescriptor(event: descriptor)
        currentlyEditedEventView = tappedView

        // Ако не е all-day, слагаме отметка в hoursColumnView
        if !descriptor.isAllDay {
            setSingle10MinuteMarkFromDate(descriptor.dateInterval.start)
        } else {
            hoursColumnView?.selectedMinuteMark = nil
            hoursColumnView?.setNeedsDisplay()
        }

        onEventTap?(descriptor)
    }

    @objc private func handleEventViewLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        if gesture.state == .began {
            // Премахваме стара селекция
            if let oldView = currentlyEditedEventView,
               oldView !== evView,
               let oldDesc = eventViewToDescriptor[oldView] {
                oldDesc.editedEvent = nil
                oldView.updateWithDescriptor(event: oldDesc)
            }
            // Селектираме този
            if descriptor.editedEvent == nil {
                descriptor.editedEvent = descriptor
                evView.updateWithDescriptor(event: descriptor)
            }
            currentlyEditedEventView = evView
        }
    }

    private func selectEventView(_ evView: EventView) {
        guard let descriptor = eventViewToDescriptor[evView] else { return }

        // Сваляме старата селекция
        if let oldView = currentlyEditedEventView, oldView !== evView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
        }
        // Селектираме новия
        descriptor.editedEvent = descriptor
        evView.updateWithDescriptor(event: descriptor)
        currentlyEditedEventView = evView
    }

    @objc private func handleEventViewPan(_ gesture: UIPanGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        // Ако евентът не е селектиран, селектираме го
        if currentlyEditedEventView !== evView {
            selectEventView(evView)
        }

        switch gesture.state {
        case .began:
            let loc = gesture.location(in: self)
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(x: loc.x - evView.frame.minX, y: loc.y - evView.frame.minY)

            // Ако е многодневен евент (EKMultiDayWrapper), може да местим всички свързани части
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

            // Ако местим многодневен, синхронизираме и останалите части
            if let origFrame = multiDayDraggingOriginalFrames[evView] {
                let deltaX = newFrame.origin.x - origFrame.origin.x
                let deltaY = newFrame.origin.y - origFrame.origin.y
                for (otherView, otherOrig) in multiDayDraggingOriginalFrames {
                    if otherView != evView {
                        otherView.frame = otherOrig.offsetBy(dx: deltaX, dy: deltaY)
                    }
                }
            }

            // Обновяваме отметката (ако не е стигнало в all-day зоната)
            if newFrame.minY < allDayHeight {
                hoursColumnView?.selectedMinuteMark = nil
                hoursColumnView?.setNeedsDisplay()
            } else if let newDate = dateFromFrame(newFrame) {
                setSingle10MinuteMarkFromDate(newDate)
            }

        case .ended, .cancelled:
            if let newRaw = dateFromFrame(evView.frame) {
                let snapped = snapToNearest10Min(newRaw)
                descriptor.isAllDay = false
                onEventDragEnded?(descriptor, snapped)
            } else if let orig = originalFrameForDraggedEvent {
                evView.frame = orig
            }
            dragOffset = nil
            originalFrameForDraggedEvent = nil
            multiDayDraggingOriginalFrames.removeAll()

        default:
            break
        }
    }

    @objc private func handleResizeHandlePanGesture(_ gesture: UIPanGestureRecognizer) {
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView,
              let desc = eventViewToDescriptor[eventView] else { return }
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

            let ghost = EventView()
            ghost.updateWithDescriptor(event: desc)
            ghost.alpha = 0.5
            addSubview(ghost)
            ghostView = ghost

            let dayIndex = dayIndexFor(desc.dateInterval.start)
            let dayX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
            let originalY = eventView.frame.origin.y
            let originalH = eventView.frame.size.height
            ghost.frame = CGRect(x: dayX, y: originalY, width: dayColumnWidth, height: originalH)
            eventView.isHidden = true

            let startGlobal = gesture.location(in: self.window)
            let d = DragData(
                startGlobalPoint: startGlobal,
                originalFrame: ghost.frame,
                isTop: isTop,
                startInterval: desc.dateInterval,
                wasAllDay: desc.isAllDay
            )
            eventView.layer.setValue(d, forKey: DRAG_DATA_KEY)

        case .changed:
            guard let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let ghost = ghostView else { return }
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

            if f.minY < allDayHeight || f.maxY < allDayHeight {
                hoursColumnView?.selectedMinuteMark = nil
                hoursColumnView?.setNeedsDisplay()
                return
            }
            if d.isTop {
                if let newStart = dateFromResize(f, isTop: true) {
                    setSingle10MinuteMarkFromDate(newStart)
                }
            } else {
                if let newEnd = dateFromResize(f, isTop: false) {
                    setSingle10MinuteMarkFromDate(newEnd)
                }
            }

        case .ended, .cancelled:
            guard let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let ghost = ghostView else { return }
            let finalFrame = ghost.frame
            // Проверяваме дали сме минали изцяло в all-day зоната
            if let dayIdx = dayIndexIfAllDayDrop(finalFrame) {
                desc.isAllDay = true
                if let dayDate = Calendar.current.date(byAdding: .day, value: dayIdx, to: fromDateOnly) {
                    let startOfDay = Calendar.current.startOfDay(for: dayDate)
                    let endOfDay = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
                    desc.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                    onEventDragResizeEnded?(desc, startOfDay)
                }
            } else {
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
            }
            ghost.removeFromSuperview()
            ghostView = nil
            eventView.isHidden = false
            setNeedsLayout()
            eventView.layer.setValue(nil, forKey: DRAG_DATA_KEY)

        default:
            break
        }
    }

    @objc private func handleResizeHandleLongPressGesture(_ gesture: UILongPressGestureRecognizer) {
        // по желание
    }

    // MARK: - LongPress на празно място
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)
        // Ако попада върху евент, пропускаме
        for evView in (allDayEventViews + eventViews) {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        // Деселектираме стария
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }
        // Ако е над all-day
        if point.y < allDayHeight {
            let dayIdx = Int((point.x - leadingInsetForHours) / dayColumnWidth)
            if dayIdx >= 0 && dayIdx < dayCount {
                if let dayDate = Calendar.current.date(byAdding: .day, value: dayIdx, to: fromDateOnly) {
                    let startOfDay = Calendar.current.startOfDay(for: dayDate)
                    onEmptyLongPress?(startOfDay)
                }
            }
            return
        }
        if let tappedDate = dateFromPoint(point) {
            onEmptyLongPress?(tappedDate)
        }
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
        guard let y = comps.year, let mo = comps.month, let d = comps.day, let h = comps.hour, let m = comps.minute else { return date }
        if m == 0 { return date }
        let remainder = m % 10
        var finalM = m
        if remainder < 5 {
            finalM = m - remainder
        } else {
            finalM = m + (10 - remainder)
            if finalM == 60 {
                finalM = 0
                // Увеличаваме час
                let plusOneHour = (h + 1) % 24
                var comps2 = DateComponents(year: y, month: mo, day: d, hour: plusOneHour, minute: 0, second: 0)
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

    private func dateFromPoint(_ point: CGPoint) -> Date? {
        if point.x < leadingInsetForHours { return nil }
        if point.y < allDayHeight { return nil }
        let dayIndex = Int((point.x - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: fromDateOnly) {
            let yOffset = point.y - allDayHeight
            return timeToDate(dayDate: dayDate, verticalOffset: yOffset)
        }
        return nil
    }

    private func dateFromFrame(_ frame: CGRect) -> Date? {
        let topY = frame.minY
        let midX = frame.midX
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: fromDateOnly) {
            let yOffset = topY - allDayHeight
            if yOffset < 0 { return nil }
            return timeToDate(dayDate: dayDate, verticalOffset: yOffset)
        }
        return nil
    }

    private func dateFromResize(_ frame: CGRect, isTop: Bool) -> Date? {
        let y: CGFloat = isTop ? frame.minY : frame.maxY
        let midX = frame.midX
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: fromDateOnly) {
            let yOffset = y - allDayHeight
            if yOffset < 0 { return nil }
            return timeToDate(dayDate: dayDate, verticalOffset: yOffset)
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

    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return hourHeight * (hour + minute/60)
    }

    private var fromDateOnly: Date {
        let cal = Calendar.current
        return cal.startOfDay(for: fromDate)
    }

    // Ако date е в диапазона, връща dayIndex, иначе nil
    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = fromDateOnly
        let dateOnly = cal.startOfDay(for: date)
        let comps = cal.dateComponents([.day], from: startOnly, to: dateOnly)
        return comps.day ?? 0
    }

    private func dayIndexIfAllDayDrop(_ frame: CGRect) -> Int? {
        let midX = frame.midX
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        // Ако пада в all-day зоната
        if frame.minY < allDayHeight {
            return dayIndex
        }
        return nil
    }

    // MARK: - Рисуване
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        let normalZoneTop = allDayHeight

        let totalWidth = leadingInsetForHours + dayColumnWidth * CGFloat(dayCount)

        // Хоризонтални линии (часове)
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        for hour in 0...24 {
            let y = normalZoneTop + CGFloat(hour) * hourHeight
            ctx.move(to: CGPoint(x: leadingInsetForHours, y: y))
            ctx.addLine(to: CGPoint(x: totalWidth, y: y))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // Вертикални линии
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        // Линия вляво (граница със часовете)
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))

        // Следващи колони за всеки ден
        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: bounds.height))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // Червена линия за текущ час, ако е в диапазона
        drawCurrentTimeLineForCurrentRange(ctx: ctx)
    }

    private func drawCurrentTimeLineForCurrentRange(ctx: CGContext) {
        let now = Date()
        // Проверяваме дали е в диапазона [fromDateOnly .. toDateOnly]
        let cal = Calendar.current
        let nowOnly = cal.startOfDay(for: now)
        if nowOnly < fromDateOnly || nowOnly > cal.startOfDay(for: toDate) {
            return
        }
        // Намираме dayIndex
        let dayIndex = dayIndexFor(now)
        if dayIndex < 0 || dayIndex >= dayCount {
            return
        }
        let hour = CGFloat(cal.component(.hour, from: now))
        let minute = CGFloat(cal.component(.minute, from: now))
        let fraction = hour + minute / 60
        let yNow = allDayHeight + fraction * hourHeight

        let totalLeftX = leadingInsetForHours
        let totalRightX = leadingInsetForHours + dayColumnWidth * CGFloat(dayCount)
        let currentDayX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
        let currentDayX2 = currentDayX + dayColumnWidth

        // Част отляво
        if currentDayX > totalLeftX {
            ctx.saveGState()
            ctx.setStrokeColor(UIColor.systemRed.withAlphaComponent(0.3).cgColor)
            ctx.setLineWidth(1.5)
            ctx.beginPath()
            ctx.move(to: CGPoint(x: totalLeftX, y: yNow))
            ctx.addLine(to: CGPoint(x: currentDayX, y: yNow))
            ctx.strokePath()
            ctx.restoreGState()
        }
        // Централна червена линия
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: currentDayX, y: yNow))
        ctx.addLine(to: CGPoint(x: currentDayX2, y: yNow))
        ctx.strokePath()
        ctx.restoreGState()

        // Част вдясно
        if currentDayX2 < totalRightX {
            ctx.saveGState()
            ctx.setStrokeColor(UIColor.systemRed.withAlphaComponent(0.3).cgColor)
            ctx.setLineWidth(1.5)
            ctx.beginPath()
            ctx.move(to: CGPoint(x: currentDayX2, y: yNow))
            ctx.addLine(to: CGPoint(x: totalRightX, y: yNow))
            ctx.strokePath()
            ctx.restoreGState()
        }
    }
}

// Помощна структура
private struct DragData {
    let startGlobalPoint: CGPoint
    let originalFrame: CGRect
    let isTop: Bool
    let startInterval: DateInterval
    let wasAllDay: Bool
}
