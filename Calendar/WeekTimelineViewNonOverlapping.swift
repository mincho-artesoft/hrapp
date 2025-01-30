//
//  WeekTimelineViewNonOverlapping.swift
//  ExampleCalendarApp
//

import UIKit
import CalendarKit

public final class WeekTimelineViewNonOverlapping: UIView, UIGestureRecognizerDelegate {

    public var startOfWeek: Date = Date()
    public var style = TimelineStyle()

    public var leadingInsetForHours: CGFloat = 70
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50

    public var allDayHeight: CGFloat = 40
    public var autoResizeAllDayHeight = true

    /// Свързваме HoursColumnView, за да може да задаваме selected5MinMark
    public weak var hoursColumnView: HoursColumnView?

    // Callbacks
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?

    // Layout данни
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // Списък с реалните subviews
    private var allDayEventViews: [EventView] = []
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView : EventDescriptor] = [:]

    // Кое евент-вю е текущо селектирано
    private var currentlyEditedEventView: EventView?

    // Drag offsets
    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?

    private let DRAG_DATA_KEY = "ResizeDragDataKey"
    private var ghostView: EventView?

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = style.backgroundColor
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = style.backgroundColor
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()
    }

    // MARK: - Gesture Recognizer Delegate
    public override func gestureRecognizerShouldBegin(_ gestureRecognizer: UIGestureRecognizer) -> Bool {
        // Ако е Pan, го позволяваме само ако е върху вече селектиран евент
        if let pan = gestureRecognizer as? UIPanGestureRecognizer,
           let evView = pan.view as? EventView {
            return (currentlyEditedEventView === evView)
        }
        return true
    }

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

    // MARK: - Tap върху празно място -> деселекция
    @objc private func handleTapOnEmptySpace(_ gesture: UITapGestureRecognizer) {
        guard gesture.state == .ended else { return }

        // Ако има селектиран евент, махаме "editedEvent"
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }

        // Нулираме 5-минутната отметка
        hoursColumnView?.selected5MinMark = nil
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
        hideEventsClashingWithCurrentTime()
    }

    private let allDayBackground = UIView()
    private var didSetupAllDayBackground = false

    private func layoutAllDayBackground() {
        if !didSetupAllDayBackground {
            allDayBackground.backgroundColor = .systemGray5
            addSubview(allDayBackground)
            didSetupAllDayBackground = true
        }
        let x = leadingInsetForHours
        let w = dayColumnWidth * 7
        allDayBackground.frame = CGRect(x: x, y: 0, width: w, height: allDayHeight)
    }

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

    private func layoutAllDayEvents() {
        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        let base: CGFloat = 10
        let groupedMax = grouped.values.map { $0.count }.max() ?? 1
        let rowHeight = max(24, (allDayHeight - base) / CGFloat(groupedMax))

        var usedIndex = 0
        for dayIndex in 0..<7 {
            let dayEvents = grouped[dayIndex] ?? []
            for (i, attr) in dayEvents.enumerated() {
                let x = leadingInsetForHours + CGFloat(dayIndex)*dayColumnWidth + style.eventGap
                let y = style.eventGap + CGFloat(i)*rowHeight
                let w = dayColumnWidth - style.eventGap*2
                let h = rowHeight - style.eventGap*2

                let v = ensureAllDayEventView(index: usedIndex)
                usedIndex += 1

                v.isHidden = false
                v.frame = CGRect(x: x, y: y, width: w, height: h)
                v.updateWithDescriptor(event: attr.descriptor)
                eventViewToDescriptor[v] = attr.descriptor
            }
        }
    }

    private func layoutRegularEvents() {
        let groupedByDay = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        var usedEventViewIndex = 0

        for dayIndex in 0..<7 {
            guard let eventsForDay = groupedByDay[dayIndex], !eventsForDay.isEmpty else {
                continue
            }

            let sorted = eventsForDay.sorted {
                $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start
            }
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
                    let yStart = dateToY(start)
                    let yEnd   = dateToY(end)

                    let x = leadingInsetForHours
                              + CGFloat(dayIndex)*dayColumnWidth
                              + style.eventGap
                              + columnWidth*CGFloat(colIndex)

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

    private func isOverlapping(_ candidate: EventLayoutAttributes,
                               in columnEvents: [EventLayoutAttributes]) -> Bool {
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

    private func hideEventsClashingWithCurrentTime() {
        let now = Date()
        guard let dayIndex = dayIndexIfInCurrentWeek(now) else { return }
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: now))
        let minute = CGFloat(cal.component(.minute, from: now))
        let fraction = hour + minute/60
        let yNow = allDayHeight + fraction * hourHeight

        let dayX = leadingInsetForHours + CGFloat(dayIndex)*dayColumnWidth
        let lineRect = CGRect(x: dayX, y: yNow - 1, width: dayColumnWidth, height: 2)

        for evView in eventViews {
            if evView.frame.intersects(lineRect) {
                evView.isHidden = true
            }
        }
        for adView in allDayEventViews {
            if adView.frame.intersects(lineRect) {
                adView.isHidden = true
            }
        }
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

        // 1) Tap за селекция
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        tapGR.delegate = self
        ev.addGestureRecognizer(tapGR)

        // 2) LongPress за drag
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewLongPress(_:)))
        lp.minimumPressDuration = 0.5
        lp.delegate = self
        ev.addGestureRecognizer(lp)

        // 3) Pan -> ако е селектиран
        let pan = UIPanGestureRecognizer(target: self, action: #selector(handleEventViewPan(_:)))
        pan.delegate = self
        ev.addGestureRecognizer(pan)

        // 4) Resize handles
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

    // MARK: - Tap върху EventView (селекция)
    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else {
            return
        }
        // Деселектираме стар
        if let oldView = currentlyEditedEventView,
           oldView !== tappedView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
        }
        // Селектираме този
        descriptor.editedEvent = descriptor
        tappedView.updateWithDescriptor(event: descriptor)
        currentlyEditedEventView = tappedView

        // Задаваме 5-минутната отметка (ако не е кръгъл час)
        setSingle5MinuteMarkFromDate(descriptor.dateInterval.start)

        // Callback
        onEventTap?(descriptor)
    }

    // MARK: - LongPress върху EventView
    @objc private func handleEventViewLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView else { return }

        let location = gesture.location(in: self)

        switch gesture.state {
        case .began:
            // Селектираме, ако не е
            if let oldView = currentlyEditedEventView,
               oldView !== evView,
               let oldDesc = eventViewToDescriptor[oldView] {
                oldDesc.editedEvent = nil
                oldView.updateWithDescriptor(event: oldDesc)
            }
            if let desc = eventViewToDescriptor[evView],
               desc.editedEvent == nil {
                desc.editedEvent = desc
                evView.updateWithDescriptor(event: desc)
            }
            currentlyEditedEventView = evView

            // Слагаме 5-минутната отметка (ако не е кръгъл час)
            if let desc = eventViewToDescriptor[evView] {
                setSingle5MinuteMarkFromDate(desc.dateInterval.start)
            }

            // Начало на drag
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(
                x: location.x - evView.frame.minX,
                y: location.y - evView.frame.minY
            )

        case .changed:
            guard let offset = dragOffset,
                  currentlyEditedEventView === evView else { return }

            let newLoc = gesture.location(in: self)
            var newF = evView.frame
            newF.origin.x = newLoc.x - offset.x
            newF.origin.y = newLoc.y - offset.y
            evView.frame = newF

        case .ended, .cancelled:
            guard currentlyEditedEventView === evView else { return }

            if let desc = eventViewToDescriptor[evView],
               let newDate = dateFromFrame(evView.frame) {
                onEventDragEnded?(desc, newDate)
            } else if let orig = originalFrameForDraggedEvent {
                evView.frame = orig
            }

            dragOffset = nil
            originalFrameForDraggedEvent = nil

        default:
            break
        }
    }

    // MARK: - Pan върху EventView
    @objc private func handleEventViewPan(_ gesture: UIPanGestureRecognizer) {
        guard let evView = gesture.view as? EventView else { return }

        switch gesture.state {
        case .began:
            if currentlyEditedEventView === evView {
                let loc = gesture.location(in: self)
                originalFrameForDraggedEvent = evView.frame
                dragOffset = CGPoint(
                    x: loc.x - evView.frame.minX,
                    y: loc.y - evView.frame.minY
                )
            } else {
                gesture.state = .cancelled
            }

        case .changed:
            guard let offset = dragOffset,
                  currentlyEditedEventView === evView else { return }

            let loc = gesture.location(in: self)
            var newF = evView.frame
            newF.origin.x = loc.x - offset.x
            newF.origin.y = loc.y - offset.y
            evView.frame = newF

        case .ended, .cancelled:
            guard currentlyEditedEventView === evView else { return }
            if let desc = eventViewToDescriptor[evView],
               let newDate = dateFromFrame(evView.frame) {
                onEventDragEnded?(desc, newDate)
            } else if let orig = originalFrameForDraggedEvent {
                evView.frame = orig
            }
            dragOffset = nil
            originalFrameForDraggedEvent = nil

        default:
            break
        }
    }

    // MARK: - Pan върху дръжка (resize)
    @objc private func handleResizeHandlePanGesture(_ gesture: UIPanGestureRecognizer) {
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView,
              let desc = eventViewToDescriptor[eventView] else { return }

        let isTop = (handleView.tag == 0)

        switch gesture.state {
        case .began:
            // Селектираме, ако не е
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
            let dayX = leadingInsetForHours + CGFloat(dayIndex)*dayColumnWidth
            let originalY = eventView.frame.origin.y
            let originalH = eventView.frame.size.height

            ghost.frame = CGRect(
                x: dayX,
                y: originalY,
                width: dayColumnWidth,
                height: originalH
            )
            eventView.isHidden = true

            let startGlobal = gesture.location(in: self.window)
            let d = DragData(
                startGlobalPoint: startGlobal,
                originalFrame: ghost.frame,
                isTop: isTop,
                startInterval: desc.dateInterval
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

        case .ended, .cancelled:
            guard let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let ghost = ghostView else { return }

            let finalFrame = ghost.frame
            let isTop = d.isTop

            if let newDate = dateFromResize(finalFrame, isTop: isTop) {
                var interval = d.startInterval
                if isTop {
                    interval = DateInterval(start: newDate, end: interval.end)
                } else {
                    interval = DateInterval(start: interval.start, end: newDate)
                }
                desc.dateInterval = interval

                onEventDragResizeEnded?(desc, newDate)
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

    // MARK: - LongPress върху дръжка (resize)
    @objc private func handleResizeHandleLongPressGesture(_ gesture: UILongPressGestureRecognizer) {
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView,
              let desc = eventViewToDescriptor[eventView] else { return }

        let isTop = (handleView.tag == 0)

        switch gesture.state {
        case .began:
            // Селектираме, ако не е
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
            let dayX = leadingInsetForHours + CGFloat(dayIndex)*dayColumnWidth
            let originalY = eventView.frame.origin.y
            let originalH = eventView.frame.size.height

            ghost.frame = CGRect(
                x: dayX,
                y: originalY,
                width: dayColumnWidth,
                height: originalH
            )
            eventView.isHidden = true

            let startGlobal = gesture.location(in: self.window)
            let d = DragData(
                startGlobalPoint: startGlobal,
                originalFrame: ghost.frame,
                isTop: isTop,
                startInterval: desc.dateInterval
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

        case .ended, .cancelled:
            guard let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let ghost = ghostView else { return }

            let finalFrame = ghost.frame
            let isTop = d.isTop

            if let newDate = dateFromResize(finalFrame, isTop: isTop) {
                var interval = d.startInterval
                if isTop {
                    interval = DateInterval(start: newDate, end: interval.end)
                } else {
                    interval = DateInterval(start: interval.start, end: newDate)
                }
                desc.dateInterval = interval

                onEventDragResizeEnded?(desc, newDate)
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

    // MARK: - Empty space LongPress -> нов евент
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)

        // Проверяваме дали попада върху някой евент
        for evView in (allDayEventViews + eventViews) {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        // Ако има евент в edit mode
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }

        // Callback за създаване на ново събитие
        if let tappedDate = dateFromPoint(point) {
            onEmptyLongPress?(tappedDate)
        }
    }

    // MARK: - setSingle5MinuteMarkFromDate(_:)
    /// Закръгля минутите до най-близка 5-минутка, освен ако не е 00 или 60 (т.е. кръгъл час).
    private func setSingle5MinuteMarkFromDate(_ date: Date) {
        let cal = Calendar.current
        let comps = cal.dateComponents([.hour, .minute], from: date)
        guard let hour = comps.hour, let minute = comps.minute else {
            hoursColumnView?.selected5MinMark = nil
            hoursColumnView?.setNeedsDisplay()
            return
        }

        // ако minute == 0 => кръгъл час -> не показваме 5-мин отметка
        if minute == 0 {
            hoursColumnView?.selected5MinMark = nil
            hoursColumnView?.setNeedsDisplay()
            return
        }

        // Закръгляме
        let remainder = minute % 5
        var closest5 = minute
        if remainder < 3 {
            // надолу
            closest5 = minute - remainder
        } else {
            // нагоре
            closest5 = minute + (5 - remainder)
            if closest5 == 60 {
                // това ще стане кръгъл час -> не показваме
                hoursColumnView?.selected5MinMark = nil
                hoursColumnView?.setNeedsDisplay()
                return
            }
        }

        // Обновяваме
        hoursColumnView?.selected5MinMark = (hour, closest5)
        hoursColumnView?.setNeedsDisplay()
    }

    // MARK: - Помощни методи (дата <-> координати)
    private func dateFromPoint(_ point: CGPoint) -> Date? {
        let x = point.x
        let y = point.y
        if x < leadingInsetForHours { return nil }
        if y < allDayHeight { return nil }

        let dayIndex = Int((x - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex > 6 { return nil }

        guard let dayDate = Calendar.current.date(byAdding: .day, value: dayIndex, to: startOfWeek) else {
            return nil
        }
        let yOffset = y - allDayHeight
        return timeToDate(dayDate: dayDate, verticalOffset: yOffset)
    }

    private func dateFromFrame(_ frame: CGRect) -> Date? {
        let topY = frame.minY
        let midX = frame.midX
        if midX < leadingInsetForHours { return nil }

        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex > 6 { return nil }

        guard let dayDate = Calendar.current.date(byAdding: .day, value: dayIndex, to: startOfWeek) else {
            return nil
        }
        let yOffset = topY - allDayHeight
        return timeToDate(dayDate: dayDate, verticalOffset: yOffset)
    }

    private func dateFromResize(_ frame: CGRect, isTop: Bool) -> Date? {
        let y: CGFloat = isTop ? frame.minY : frame.maxY
        let midX = frame.midX
        if midX < leadingInsetForHours { return nil }

        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex > 6 { return nil }

        guard let dayDate = Calendar.current.date(byAdding: .day, value: dayIndex, to: startOfWeek) else {
            return nil
        }
        let yOffset = y - allDayHeight
        return timeToDate(dayDate: dayDate, verticalOffset: yOffset)
    }

    private func timeToDate(dayDate: Date, verticalOffset: CGFloat) -> Date? {
        var hoursFloat = verticalOffset / hourHeight
        if hoursFloat < 0 { hoursFloat = 0 }
        if hoursFloat > 24 { hoursFloat = 24 }

        let hour = floor(hoursFloat)
        let minuteFloat = (hoursFloat - hour)*60
        let minute = floor(minuteFloat)

        let cal = Calendar.current
        var comps = cal.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hour)
        comps.minute = Int(minute)
        return cal.date(from: comps)
    }

    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return hourHeight * (hour + minute/60)
    }

    // dayIndex за даден date спрямо startOfWeek
    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = startOfWeek.dateOnly(calendar: cal)
        let evOnly = date.dateOnly(calendar: cal)
        let comps = cal.dateComponents([.day], from: startOnly, to: evOnly)
        return comps.day ?? 0
    }

    func dayIndexIfInCurrentWeek(_ date: Date) -> Int? {
        let cal = Calendar.current
        let startOnly = startOfWeek.dateOnly(calendar: cal)
        guard let endOfWeek = cal.date(byAdding: .day, value: 7, to: startOnly) else { return nil }

        if date >= startOnly && date < endOfWeek {
            let comps = cal.dateComponents([.day], from: startOnly, to: date)
            return comps.day
        }
        return nil
    }

    // MARK: - Рисуване на линиите
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let totalWidth = leadingInsetForHours + dayColumnWidth*7
        let normalZoneTop = allDayHeight

        // Хоризонтални линии (часови)
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        for hour in 0...24 {
            let y = normalZoneTop + CGFloat(hour)*hourHeight
            ctx.move(to: CGPoint(x: leadingInsetForHours, y: y))
            ctx.addLine(to: CGPoint(x: totalWidth, y: y))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // Вертикални линии (дните)
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        for i in 0...7 {
            let colX = leadingInsetForHours + CGFloat(i)*dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: bounds.height))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // Червена линия за текущия момент
        drawCurrentTimeLineForCurrentDay(ctx: ctx)
    }

    private func drawCurrentTimeLineForCurrentDay(ctx: CGContext) {
        let now = Date()
        guard let dayIndex = dayIndexIfInCurrentWeek(now) else { return }

        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: now))
        let minute = CGFloat(cal.component(.minute, from: now))
        let fraction = hour + minute/60

        let yNow = allDayHeight + fraction * hourHeight
        let totalLeftX = leadingInsetForHours
        let totalRightX = leadingInsetForHours + dayColumnWidth * 7

        let currentDayX  = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
        let currentDayX2 = currentDayX + dayColumnWidth

        // Ляв полупрозрачен сегмент
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

        // Плътна червена линия (за текущия ден)
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: currentDayX, y: yNow))
        ctx.addLine(to: CGPoint(x: currentDayX2, y: yNow))
        ctx.strokePath()
        ctx.restoreGState()

        // Дясна полупрозрачна
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

// MARK: - Помощна структура
private struct DragData {
    let startGlobalPoint: CGPoint
    let originalFrame: CGRect
    let isTop: Bool
    let startInterval: DateInterval
}
