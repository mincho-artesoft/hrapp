//
//  WeekTimelineViewNonOverlapping.swift
//  ExampleCalendarApp
//
//  - Non-overlapping подреждане
//  - Drag & drop на целия евент (Pan / LongPress)
//  - Resize (горна/долна дръжка)
//  - Дроп/прехвърляне в all-day зоната, включително за дълги евенти (ВНИМАНИЕ: ползваме frame.minY < allDayHeight)
//  - „snap“ към най-близките 10 минути при отпускане
//  - Динамично рисуване на най-близката 10-минутна отметка в HoursColumnView
//

import UIKit
import CalendarKit

public final class WeekTimelineViewNonOverlapping: UIView, UIGestureRecognizerDelegate {

    // MARK: - Публични настройки
    public var startOfWeek: Date = Date()
    public var style = TimelineStyle()

    public var leadingInsetForHours: CGFloat = 70
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50

    public var allDayHeight: CGFloat = 40
    public var autoResizeAllDayHeight = true

    /// Свързваме го, за да показваме динамично една отметка (hour, minute) в колоната
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

    // Константа за ключ (resize DragData)
    private let DRAG_DATA_KEY = "ResizeDragDataKey"

    // Ghost (временен EventView за resize)
    private var ghostView: EventView?

    // MARK: - Инициализация
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
        // Ако е Pan върху EventView, позволяваме само ако евентът е вече селектиран
        if let pan = gestureRecognizer as? UIPanGestureRecognizer,
           let evView = pan.view as? EventView {
            return (currentlyEditedEventView === evView)
        }
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

        // Ако има селектиран евент - махаме го
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }

        // Махаме отметката
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
        hideEventsClashingWithCurrentTime()
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
        let w = dayColumnWidth * 7
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

    // MARK: - Изчисляваме височината за all-day (ако има много евенти)
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

    // MARK: - Regular евенти
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

    // Проверка за застъпване
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

    // MARK: - Скриване на евенти, които са "дописани" от current time
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

    // MARK: - All-day вю създаване/ползване
    private func ensureAllDayEventView(index: Int) -> EventView {
        if index < allDayEventViews.count {
            return allDayEventViews[index]
        } else {
            let v = createEventView()
            allDayEventViews.append(v)
            return v
        }
    }
    // MARK: - Regular евент вю
    private func ensureRegularEventView(index: Int) -> EventView {
        if index < eventViews.count {
            return eventViews[index]
        } else {
            let v = createEventView()
            eventViews.append(v)
            return v
        }
    }

    // MARK: - Създаваме EventView с жестове
    private func createEventView() -> EventView {
        let ev = EventView()

        // Tap -> селекция
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        tapGR.delegate = self
        ev.addGestureRecognizer(tapGR)

        // LongPress -> drag целия евент
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewLongPress(_:)))
        lp.minimumPressDuration = 0.5
        lp.delegate = self
        ev.addGestureRecognizer(lp)

        // Pan -> drag, ако вече е селектиран
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

    // MARK: - Tap върху евент
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

        // Показваме 10-мин отметка за началния час (само ако не е all-day)
        if !descriptor.isAllDay {
            setSingle10MinuteMarkFromDate(descriptor.dateInterval.start)
        } else {
            hoursColumnView?.selectedMinuteMark = nil
            hoursColumnView?.setNeedsDisplay()
        }

        onEventTap?(descriptor)
    }

    // MARK: - LongPress (drag)
    @objc private func handleEventViewLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView else { return }

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

            let loc = gesture.location(in: self)
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(
                x: loc.x - evView.frame.minX,
                y: loc.y - evView.frame.minY
            )

        case .changed:
            guard let offset = dragOffset,
                  currentlyEditedEventView === evView else { return }

            let loc = gesture.location(in: self)
            var newF = evView.frame
            newF.origin.x = loc.x - offset.x
            newF.origin.y = loc.y - offset.y
            evView.frame = newF

            // Динамично -> 10-мин отметка (само ако не сме горе в all-day)
            if newF.minY < allDayHeight {
                hoursColumnView?.selectedMinuteMark = nil
                hoursColumnView?.setNeedsDisplay()
            } else if let newDate = dateFromFrame(newF) {
                setSingle10MinuteMarkFromDate(newDate)
            }

        case .ended, .cancelled:
            guard currentlyEditedEventView === evView else { return }

            if let desc = eventViewToDescriptor[evView] {
                // Проверяваме дали сме "дропнали" в all-day зоната
                if let dayIdx = dayIndexIfAllDayDrop(evView.frame) {
                    // -> Всички day-based all-day настройки
                    desc.isAllDay = true

                    if let dayDate = Calendar.current.date(byAdding: .day, value: dayIdx, to: startOfWeek) {
                        let startOfDay = Calendar.current.startOfDay(for: dayDate)
                        let endOfDay   = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
                        desc.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                        onEventDragEnded?(desc, startOfDay)
                    }
                }
                else if let newRaw = dateFromFrame(evView.frame) {
                    // -> Редови евент с конкретни часове
                    let snapped = snapToNearest10Min(newRaw)
                    desc.isAllDay = false
                    onEventDragEnded?(desc, snapped)
                }
                else if let orig = originalFrameForDraggedEvent {
                    // Ако изобщо не можем да вземем валидна дата - връщаме
                    evView.frame = orig
                }
            }

            dragOffset = nil
            originalFrameForDraggedEvent = nil

        default:
            break
        }
    }

    // MARK: - Pan -> drag, ако евентът е селектиран
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

            // Динамично -> 10-мин отметка (ако не е над allDayHeight)
            if newF.minY < allDayHeight {
                hoursColumnView?.selectedMinuteMark = nil
                hoursColumnView?.setNeedsDisplay()
            } else if let newDate = dateFromFrame(newF) {
                setSingle10MinuteMarkFromDate(newDate)
            }

        case .ended, .cancelled:
            guard currentlyEditedEventView === evView else { return }

            if let desc = eventViewToDescriptor[evView] {
                // Проверка за all-day
                if let dayIdx = dayIndexIfAllDayDrop(evView.frame) {
                    desc.isAllDay = true
                    if let dayDate = Calendar.current.date(byAdding: .day, value: dayIdx, to: startOfWeek) {
                        let startOfDay = Calendar.current.startOfDay(for: dayDate)
                        let endOfDay   = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
                        desc.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                        onEventDragEnded?(desc, startOfDay)
                    }
                }
                else if let newRaw = dateFromFrame(evView.frame) {
                    let snapped = snapToNearest10Min(newRaw)
                    desc.isAllDay = false
                    onEventDragEnded?(desc, snapped)
                }
                else if let orig = originalFrameForDraggedEvent {
                    evView.frame = orig
                }
            }

            dragOffset = nil
            originalFrameForDraggedEvent = nil

        default:
            break
        }
    }

    // MARK: - Pan -> resize handle
    @objc private func handleResizeHandlePanGesture(_ gesture: UIPanGestureRecognizer) {
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView,
              let desc = eventViewToDescriptor[eventView] else { return }

        let isTop = (handleView.tag == 0) // 0 = горна дръжка

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

            // Ghost
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

            // Динамична отметка
            // Ако горната/долната част е над allDayHeight -> махаме minuteMark
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

            // Проверка за all-day?
            if let dayIdx = dayIndexIfAllDayDrop(finalFrame) {
                desc.isAllDay = true
                if let dayDate = Calendar.current.date(byAdding: .day, value: dayIdx, to: startOfWeek) {
                    let startOfDay = Calendar.current.startOfDay(for: dayDate)
                    let endOfDay   = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
                    desc.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                    onEventDragResizeEnded?(desc, startOfDay)
                }
            } else {
                // Иначе -> нормален час:мин
                desc.isAllDay = false
                if let newDateRaw = dateFromResize(finalFrame, isTop: d.isTop) {
                    let snapped = snapToNearest10Min(newDateRaw)

                    var interval = d.startInterval
                    if d.isTop {
                        interval = DateInterval(start: snapped, end: interval.end)
                    } else {
                        interval = DateInterval(start: interval.start, end: snapped)
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

    // MARK: - LongPress -> resize handle
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

            // Ако сме над allDayHeight, махаме minuteMark
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

            // Проверка за all-day?
            if let dayIdx = dayIndexIfAllDayDrop(finalFrame) {
                desc.isAllDay = true
                if let dayDate = Calendar.current.date(byAdding: .day, value: dayIdx, to: startOfWeek) {
                    let startOfDay = Calendar.current.startOfDay(for: dayDate)
                    let endOfDay   = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
                    desc.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                    onEventDragResizeEnded?(desc, startOfDay)
                }
            } else {
                // Иначе -> нормален час:мин
                desc.isAllDay = false
                if let newDateRaw = dateFromResize(finalFrame, isTop: d.isTop) {
                    let snapped = snapToNearest10Min(newDateRaw)

                    var interval = d.startInterval
                    if d.isTop {
                        interval = DateInterval(start: snapped, end: interval.end)
                    } else {
                        interval = DateInterval(start: interval.start, end: snapped)
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

    // MARK: - (UPDATED) Проверка дали drop-ът е в all-day зоната (по minY)
    /// Ако midX (или centerX) на евента е в даден ден, и minY е < allDayHeight -> връща dayIndex
    private func dayIndexIfAllDayDrop(_ frame: CGRect) -> Int? {
        let midX = frame.midX
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex > 6 { return nil }

        // (UPDATED) Вече гледаме frame.minY, за да може и дълги евенти да се прехвърлят
        if frame.minY < allDayHeight {
            return dayIndex
        }
        return nil
    }

    // MARK: - LongPress празно -> нов евент
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)

        // Проверяваме дали не е върху евент
        for evView in (allDayEventViews + eventViews) {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        // Деселектираме евент, ако има
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }

        // Ако е над allDayHeight -> all-day евент
        if point.y < allDayHeight {
            let dayIdx = Int((point.x - leadingInsetForHours) / dayColumnWidth)
            if dayIdx >= 0 && dayIdx < 7 {
                if let dayDate = Calendar.current.date(byAdding: .day, value: dayIdx, to: startOfWeek) {
                    let startOfDay = Calendar.current.startOfDay(for: dayDate)
                    onEmptyLongPress?(startOfDay) // <- в callback може да зададете all-day = true
                }
            }
            return
        }

        // Иначе – нормален евент
        if let tappedDate = dateFromPoint(point) {
            onEmptyLongPress?(tappedDate)
        }
    }

    // MARK: - Динамична отметка (докато се движи)
    private func setSingle10MinuteMarkFromDate(_ date: Date) {
        let cal = Calendar.current
        let comps = cal.dateComponents([.hour, .minute], from: date)
        guard let hour = comps.hour, let minute = comps.minute else {
            hoursColumnView?.selectedMinuteMark = nil
            hoursColumnView?.setNeedsDisplay()
            return
        }

        if minute == 0 {
            // кръгъл час -> не показваме
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

    // MARK: - Финално "snap" при отпускане
    private func snapToNearest10Min(_ date: Date) -> Date {
        let cal = Calendar.current
        let comps = cal.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        guard let y = comps.year,
              let mo = comps.month,
              let d = comps.day,
              let h = comps.hour,
              let m = comps.minute
        else {
            return date
        }

        // ако е точно кръгъл час, не пипаме
        if m == 0 { return date }

        let remainder = m % 10
        var finalM = m
        if remainder < 5 {
            finalM = m - remainder
        } else {
            finalM = m + (10 - remainder)
            if finalM == 60 {
                // значи точно следващия час
                finalM = 0
                return cal.date(bySettingHour: (h + 1) % 24, minute: 0, second: 0, of: date) ?? date
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

    // MARK: - Помощни методи за координати -> дата
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
        if yOffset < 0 { return nil } // вече сме над all-day
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
        if yOffset < 0 { return nil }
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
        comps.second = 0
        return cal.date(from: comps)
    }

    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return hourHeight * (hour + minute/60)
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

    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = startOfWeek.dateOnly(calendar: cal)
        let evOnly = date.dateOnly(calendar: cal)
        let comps = cal.dateComponents([.day], from: startOnly, to: evOnly)
        return comps.day ?? 0
    }

    // MARK: - Рисуване на часови линии
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let totalWidth = leadingInsetForHours + dayColumnWidth*7
        let normalZoneTop = allDayHeight

        // Хоризонтални линии (0..24)
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

        // Червена линия за текущия час
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

        // Ляв полупрозрачен
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

        // Плътна червена линия
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

// MARK: - Помощна структура (drag data при resize)
private struct DragData {
    let startGlobalPoint: CGPoint
    let originalFrame: CGRect
    let isTop: Bool
    let startInterval: DateInterval
    let wasAllDay: Bool
}

