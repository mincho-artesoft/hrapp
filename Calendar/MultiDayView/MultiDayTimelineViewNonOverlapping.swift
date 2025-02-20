//
//  WeekTimelineViewNonOverlapping.swift
//  CalendarKit
//
//  Модифициран да не застъпва събития, да има drag/drop, resize
//  и вече има `topMargin`, за да съвпадне с HoursColumnView.extraMarginTopBottom.
//

import UIKit

public final class MultiDayTimelineViewNonOverlapping: UIView, UIGestureRecognizerDelegate {

    // MARK: - Форматиране на датите за принтиране (с локална часова зона)
    private static let localFormatter: DateFormatter = {
        let df = DateFormatter()
        df.dateFormat = "yyyy-MM-dd HH:mm"
        df.timeZone = TimeZone.current // Или "Europe/Sofia"
        return df
    }()

    // -- Настройки за времевия изглед --
    public var fromDate: Date = Date()
    public var toDate: Date = Date()
    public var style = TimelineStyle()

    /// Горен отстъп (margin), за да съвпадне чертежът с този в HoursColumnView
    public var topMargin: CGFloat = 0

    public var leadingInsetForHours: CGFloat = 0
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50

    // Колоната с часове (за показване на селектираните минути и т.н.)
    public weak var hoursColumnView: HoursColumnView?

    // -- Callback-и --
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date, Bool) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?
    
    /// Ако драгнем „часово“ събитие нагоре към All-Day зоната
    public var onEventConvertToAllDay: ((EventDescriptor, Int) -> Void)?

    // -- Списък със събития (regular), чиито layoutAttributes няма да се застъпват --
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // -- View-ове за събития --
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView : EventDescriptor] = [:]

    // -- Редактиране / drag & drop / resize --
    private var currentlyEditedEventView: EventView?

    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?

    // Ако евентът е EKMultiDayWrapper, може да има няколко „парчета“ в различни дни
    private var multiDayDraggingOriginalFrames: [EventView: CGRect] = [:]

    // Призрачно копие при resize
    private var ghostView: EventView?

    // Ключ за layer.setValue(...)
    private let DRAG_DATA_KEY = "ResizeDragDataKey"

    // -- Auto Scroll (при drag) --
    private var autoScrollDisplayLink: CADisplayLink?
    private var autoScrollDirection = CGPoint.zero

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

    // -- Жестове за празно място --

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
        // Ако има "editedEventView", го затваряме
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }
        // Махаме marker
        hoursColumnView?.selectedMinuteMark = nil
        hoursColumnView?.setNeedsDisplay()
    }

    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)
        // Проверка дали не е върху съществуващо събитие
        for evView in eventViews {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        // Ако е празно
        // Затваряме друго редактирано събитие (ако има)
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
        // Скриваме старите
        for v in eventViews {
            v.isHidden = true
        }
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
            // Сортираме по начален час
            let sorted = eventsForDay.sorted { $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start }

            // Подреждаме в колони
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

                    // >>> Добавяме topMargin при изчисляване на Y
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

        // Пан за драг
        let pan = UIPanGestureRecognizer(target: self, action: #selector(handleEventViewPan(_:)))
        pan.delegate = self
        ev.addGestureRecognizer(pan)

        // Дръжки за resize
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

        // Ако има друго editedEvent, го "затваряме"
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
            // Затваряме друго
            if let oldView = currentlyEditedEventView,
               oldView !== evView,
               let oldDesc = eventViewToDescriptor[oldView] {
                oldDesc.editedEvent = nil
                oldView.updateWithDescriptor(event: oldDesc)
            }
            if descriptor.editedEvent == nil {
                descriptor.editedEvent = descriptor
                evView.updateWithDescriptor(event: descriptor)
            }
            currentlyEditedEventView = evView
        }
    }

    // MARK: - Пан (drag) на цялото събитие

    @objc private func handleEventViewPan(_ gesture: UIPanGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }

        // Ако не е селектирано
        if currentlyEditedEventView !== evView {
            selectEventView(evView)
        }

        // Търсим контейнера (TwoWayPinnedWeekContainerView)
        guard let container = self.superview?.superview as? TwoWayPinnedMultiDayContainerView else { return }

        switch gesture.state {
        case .began:
            setScrollsClipping(enabled: false)
            let loc = gesture.location(in: self)
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(x: loc.x - evView.frame.minX, y: loc.y - evView.frame.minY)

            // Ако е EKMultiDayWrapper => пазим всички парчета
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

            // Ако евентът е EKMultiDayWrapper => местим и останалите парчета
            if let origFrame = multiDayDraggingOriginalFrames[evView] {
                let dx = newFrame.origin.x - origFrame.origin.x
                let dy = newFrame.origin.y - origFrame.origin.y
                for (otherV, origVFrame) in multiDayDraggingOriginalFrames {
                    if otherV != evView {
                        otherV.frame = origVFrame.offsetBy(dx: dx, dy: dy)
                    }
                }
            }

            // >>> NEW LOGIC: изчисляваме start от горната част, но ако тя е извън изгледа,
            //    опитваме да вземем дата от долната част (да продължим да принтираме край).
            let oldDuration = descriptor.dateInterval.duration

            // 1) Опитваме се да вземем "start" (горна част)
            if let newStart = dateFromFrame(newFrame) {
                setSingle10MinuteMarkFromDate(newStart)

                let newEnd = newStart.addingTimeInterval(oldDuration)
                let startStr = Self.localFormatter.string(from: newStart)
                let endStr   = Self.localFormatter.string(from: newEnd)
//                print("Dragging event... (TOP visible) start = \(startStr), end = \(endStr)")

            } else {
                // 2) Горната част е извън, но ако долната част е още в полето (например > 0)
                if newFrame.maxY > 0 {
                    // Нека вземем "край" от долната част: bottomFrame
                    // Тоест мислено вземаме point = (x: frame.midX, y: frame.maxY)
                    // и ще го трактираме като start? Не, реално това е "end" :)
                    // => За да вземем dateFromFrame, подаваме малка "рамка" около bottomY.
                    var bottomFrame = newFrame
                    bottomFrame.origin.y = newFrame.maxY - 1
                    bottomFrame.size.height = 1

                    if let newEnd = dateFromFrame(bottomFrame) {
                        // Сега newEnd считаме за краен час,
                        // а старта е newEnd - старата продължителност
                        let newStart = newEnd.addingTimeInterval(-oldDuration)

                        // (може да изберете да сложите mark и на newEnd, ако желаете)
                        setSingle10MinuteMarkFromDate(newEnd)

                        let startStr = Self.localFormatter.string(from: newStart)
                        let endStr   = Self.localFormatter.string(from: newEnd)
//                        print("Dragging event... (BOTTOM) start = \(startStr), end = \(endStr)")
                    }
                }
            }

            // Auto scroll
            updateAutoScrollDirection(for: gesture)

        case .ended, .cancelled:
            setScrollsClipping(enabled: true)
            stopAutoScroll()

            // При drop
            let topInContainer = evView.convert(CGPoint(x: evView.bounds.midX, y: evView.bounds.minY), to: container)
            let topPointInWeek = container.weekView.convert(topInContainer, from: container)

            let locationInContainer = gesture.location(in: container)
            if let hitView = container.hitTest(locationInContainer, with: nil) {
                let hitViewClass = String(describing: type(of: hitView))

                // Първо ниво родител
                var parent1Class = "nil"
                var parent2Class = "nil"

                if let parent1 = hitView.superview {
                    parent1Class = String(describing: type(of: parent1))
                    if let parent2 = parent1.superview {
                        parent2Class = String(describing: type(of: parent2))
                    }
                }

                print("""
                Dragging above: \(hitViewClass)
                parent1: \(parent1Class)
                parent2: \(parent2Class)
                """)

                if hitViewClass == "MultiDayTimelineViewNonOverlapping"
                    || parent1Class == "MultiDayTimelineViewNonOverlapping"
                    || parent2Class == "MultiDayTimelineViewNonOverlapping"
                {
                    if topInContainer.y < container.allDayScrollView.frame.maxY {
                        var newFrame = evView.frame
                        let loc = gesture.location(in: self)
                        guard let offset = dragOffset else { return }
                        newFrame.origin.x = loc.x - offset.x
                        newFrame.origin.y = loc.y - offset.y
                        var bottomFrame = newFrame
                        bottomFrame.origin.y = newFrame.maxY - 1
                        bottomFrame.size.height = 1
                        let oldDuration = descriptor.dateInterval.duration

                        if let newEnd = dateFromFrame(bottomFrame) {
                            // Сега newEnd считаме за краен час,
                            // а старта е newEnd - старата продължителност
                            let newStart = newEnd.addingTimeInterval(-oldDuration)

                            // (може да изберете да сложите mark и на newEnd, ако желаете)
                            setSingle10MinuteMarkFromDate(newEnd)

                            let startStr = Self.localFormatter.string(from: newStart)
                            let endStr   = Self.localFormatter.string(from: newEnd)
                            print("Drop event... (BOTTOM) start = \(startStr), end = \(endStr)")
                                 let oldDuration = descriptor.dateInterval.duration
                                 let snapped = snapToNearest10Min(newStart)
                                 descriptor.isAllDay = false
                                 descriptor.dateInterval = DateInterval(start: snapped,
                                                                        end: snapped.addingTimeInterval(oldDuration))
                                 container.weekView.onEventDragEnded?(descriptor, snapped, false)
                        }
                     
                    } else {
                        // Остава в timeline
                        if let newDateRaw = container.weekView.dateFromPoint(topPointInWeek) {
                            let oldDuration = descriptor.dateInterval.duration
                            let snapped = snapToNearest10Min(newDateRaw)
                            descriptor.isAllDay = false
                            descriptor.dateInterval = DateInterval(start: snapped,
                                                                   end: snapped.addingTimeInterval(oldDuration))
                            container.weekView.onEventDragEnded?(descriptor, snapped, false)
                        } else if let orig = originalFrameForDraggedEvent {
                            evView.frame = orig
                        }
                    }
                }
                else if hitViewClass == "AllDayViewNonOverlapping"
                        || parent1Class == "AllDayViewNonOverlapping"
                        || parent2Class == "AllDayViewNonOverlapping"
                {
                    if let newDayIndex = dayIndexFromMidX(evView.frame.midX) {
                        onEventConvertToAllDay?(descriptor, newDayIndex)
                    } else if let orig = originalFrameForDraggedEvent {
                        evView.frame = orig
                    }
                }
            }

            dragOffset = nil
            originalFrameForDraggedEvent = nil
            multiDayDraggingOriginalFrames.removeAll()

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

    // MARK: - Resize

    private struct DragData {
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
            // Ако има друго editedEvent
            if let oldView = currentlyEditedEventView,
               oldView !== eventView,
               let oldDesc = eventViewToDescriptor[oldView] {
                oldDesc.editedEvent = nil
                oldView.updateWithDescriptor(event: oldDesc)
            }
            // Активираме edit
            if desc.editedEvent == nil {
                desc.editedEvent = desc
                eventView.updateWithDescriptor(event: desc)
            }
            currentlyEditedEventView = eventView

            // Ghost
            let ghost = EventView()
            ghost.updateWithDescriptor(event: desc)
            ghost.alpha = 0.5
            addSubview(ghost)
            ghostView = ghost

            setScrollsClipping(enabled: false)

            // Изчисляваме frame, който ще заеме ghost:
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
            guard
                let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
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
                let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                let ghost = ghostView
            else {
                return
            }

            let finalFrame = ghost.frame
            // При resize - става само timed event
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
            eventView.isHidden = false
            setNeedsLayout()
            eventView.layer.setValue(nil, forKey: DRAG_DATA_KEY)

        default:
            break
        }
    }

    @objc private func handleResizeHandleLongPressGesture(_ gesture: UILongPressGestureRecognizer) {
        // Може да покажем контекстно меню, ако искаме
    }

    private func dateFromResize(_ frame: CGRect, isTop: Bool) -> Date? {
        // Взимаме подходящия y (top или bottom), но важно: трябва да "махнем" topMargin
        let y = isTop ? frame.minY : frame.maxY
        let localY = y - topMargin  // коригираме с topMargin
        let midX = frame.midX

        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }

        let cal = Calendar.current
        guard let dayDate = cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate))
        else { return nil }

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

        // Хоризонтални линии (0..24)
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

        // Вертикални линии
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

        // Червена линия за "сега"
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
        // Добавяме topMargin и тогава рисуваме червената линия
        let yNow = topMargin + fraction * hourHeight

        let currentDayX = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
        let currentDayX2 = currentDayX + dayColumnWidth

        // Основна червена линия
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: currentDayX, y: yNow))
        ctx.addLine(to: CGPoint(x: currentDayX2, y: yNow))
        ctx.strokePath()
        ctx.restoreGState()
    }

    // MARK: - Помощни

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
                var comps2 = DateComponents(year: y, month: mo, day: d,
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
        // Тук махаме topMargin
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
        // Взимаме topY, но изваждаме topMargin
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
