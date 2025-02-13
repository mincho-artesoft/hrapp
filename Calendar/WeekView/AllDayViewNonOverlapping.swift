import UIKit
import CalendarKit

public final class AllDayViewNonOverlapping: UIView, UIGestureRecognizerDelegate {

    // MARK: - Публични настройки

    /// Начална и крайна дата, обхващащи периода.
    public var fromDate: Date = Date()
    public var toDate: Date = Date()

    /// Стилът за таймлайн (цветове, дебелина на линии и т.н.).
    public var style = TimelineStyle()

    /// Колко място оставяме вляво (между колоната с часовете и евентите).
    /// Ще го правим 0, за да няма допълнителен отстъп.
    public var leadingInsetForHours: CGFloat = 0 // CHANGED

    /// Ширина на колоната за всеки ден (ще се преизчислява динамично в `layoutSubviews()`).
    public var dayColumnWidth: CGFloat = 100

    /// Ако искате автоматично да се преоразмерява височината спрямо броя all‑day евенти.
    public var autoResizeHeight = true

    /// Ако autoResizeHeight = false, това е фиксираната височина.
    public var fixedHeight: CGFloat = 40

    // Колбек‑и (за реакция при действия в all‑day зоната):
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?

    // Списък с layout атрибути за всеки all‑day евент
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // Списък със subview‑та (EventView) за визуализация на евентите
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView: EventDescriptor] = [:]

    // Текущо селектиран (редактиран) евент
    private var currentlyEditedEventView: EventView?

    // Gesture recognizer за long press в празното пространство
    private let longPressEmptySpace: UILongPressGestureRecognizer

    // MARK: - Properties за drag/resize (при конвертиране)
    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?
    private var multiDayDraggingOriginalFrames: [EventView: CGRect] = [:]
    private var ghostView: EventView?
    private let DRAG_DATA_KEY = "ResizeDragDataKey"

    // MARK: - Инициализация

    public override init(frame: CGRect) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(frame: frame)
        
        backgroundColor = .systemGray5
        
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressOnEmptySpace(_:)))
        longPressEmptySpace.minimumPressDuration = 0.7
        addGestureRecognizer(longPressEmptySpace)
    }

    required init?(coder: NSCoder) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(coder: coder)
        
        backgroundColor = .systemGray5
        
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressOnEmptySpace(_:)))
        longPressEmptySpace.minimumPressDuration = 0.7
        addGestureRecognizer(longPressEmptySpace)
    }

    // MARK: - Layout

    public override func layoutSubviews() {
        super.layoutSubviews()
        
        // Скриваме всички стари eventView‑та
        for ev in eventViews {
            ev.isHidden = true
        }
        
        // Ако трябва да преоразмерим височината:
        if autoResizeHeight {
            recalcAllDayHeightDynamically()
        }
        
        // Преизчисляваме ширината на колоните, за да няма хоризонтален скрол
        let totalDays = dayCount
        if totalDays > 0 {
            let availableWidth = bounds.width - leadingInsetForHours
            let safeWidth = max(availableWidth, 0)
            dayColumnWidth = safeWidth / CGFloat(totalDays)
        } else {
            dayColumnWidth = 0
        }
        
        setNeedsDisplay()
        
        // Групираме евентите по ден
        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        
        // Определяме броя на евентите в деня
        let maxEventsInAnyDay = grouped.values.map { $0.count }.max() ?? 0
        
        // Определяме височината за всеки "ред" евент
        let baseY: CGFloat = 6
        let totalH = bounds.height
        let rowHeight = max(24, (totalH - baseY) / CGFloat(maxEventsInAnyDay == 0 ? 1 : maxEventsInAnyDay))
        
        // Подреждаме евентите
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
        
        // Хоризонтални линии
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

    // MARK: - Менажиране на EventView

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
        
        // Tap жест за селекция
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        tapGR.delegate = self
        ev.addGestureRecognizer(tapGR)
        
        // LongPress за drag
        let lp = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewLongPress(_:)))
        lp.minimumPressDuration = 0.5
        lp.delegate = self
        ev.addGestureRecognizer(lp)
        
        // Pan жест – ако вече е избран
        let pan = UIPanGestureRecognizer(target: self, action: #selector(handleEventViewPan(_:)))
        pan.delegate = self
        ev.addGestureRecognizer(pan)
        
        // Resize handles (ако използвате resizing)
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

    // MARK: - Actions върху евент

    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else { return }
        
        // Премахваме старата селекция
        if let oldView = currentlyEditedEventView, oldView !== tappedView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
        }
        
        // Селектираме евента
        descriptor.editedEvent = descriptor
        tappedView.updateWithDescriptor(event: descriptor)
        currentlyEditedEventView = tappedView
        
        onEventTap?(descriptor)
    }
    
    @objc private func handleEventViewLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        if gesture.state == .began {
            if let oldView = currentlyEditedEventView, oldView !== evView,
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
    
    // MARK: - Обработване на drag (Pan) – модифициран за конвертиране от all‑day към time‑based
    @objc private func handleEventViewPan(_ gesture: UIPanGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        
        // Ако евентът не е избран, го селектираме
        if currentlyEditedEventView !== evView {
            selectEventView(evView)
        }
        
        switch gesture.state {
        case .began:
            let loc = gesture.location(in: self)
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(x: loc.x - evView.frame.minX, y: loc.y - evView.frame.minY)
            
            // Ако е многодневен – запазваме оригиналните рамки
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
            
            // Ако е многодневен – местим и другите му части
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
            // Ако евентът е пуснат извън височината на all‑day зоната,
            // го конвертираме в нормален (time‑based) евент.
            if evView.frame.origin.y > self.bounds.height {
                // Опитваме се да намерим WeekTimelineViewNonOverlapping в супервюто
                if let container = self.superview,
                   let weekView = container.subviews.first(where: { $0 is WeekTimelineViewNonOverlapping }) as? WeekTimelineViewNonOverlapping {
                    
                    // Преобразуваме drop позицията от all‑day към weekView
                    let dropPoint = self.convert(evView.frame.origin, to: weekView)
                    // Използваме помощен метод в weekView за нова дата (трябва да го дефинирате)
                    if let newDate = weekView.dateFromPoint(dropPoint) {
                        descriptor.isAllDay = false
                        // Задаваме нов интервал – тук примерна продължителност 1 час
                        descriptor.dateInterval = DateInterval(start: newDate, end: newDate.addingTimeInterval(3600))
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
                // Ако евентът е пуснат в рамките на all‑day зоната – стандартна обработка
                if let newDayIndex = dayIndexFromMidX(evView.frame.midX),
                   let newDayDate = dayDateByAddingDays(newDayIndex) {
                    let startOfDay = Calendar.current.startOfDay(for: newDayDate)
                    let endOfDay = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
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
    
    @objc private func handleResizeHandlePanGesture(_ gesture: UIPanGestureRecognizer) {
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView,
              let desc = eventViewToDescriptor[eventView] else { return }
        
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
                isTop: (handleView.tag == 0),
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
            
            if let newEdgeDate = dateFromResize(f, isTop: d.isTop) {
                setSingle10MinuteMarkFromDate(newEdgeDate)
            }
            
        case .ended, .cancelled:
            guard let d = eventView.layer.value(forKey: DRAG_DATA_KEY) as? DragData,
                  let ghost = ghostView else { return }
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
            eventView.isHidden = false
            setNeedsLayout()
            eventView.layer.setValue(nil, forKey: DRAG_DATA_KEY)
            
        default:
            break
        }
    }
    
    @objc private func handleResizeHandleLongPressGesture(_ gesture: UILongPressGestureRecognizer) {
        // Допълнителна логика, ако е необходима
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
    
    // MARK: - LongPress на празно място
    
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)
        
        // Ако точката попада върху евент – не правим нищо
        for evView in eventViews where !evView.isHidden && evView.frame.contains(point) {
            return
        }
        
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }
        
        let dayIdx = dayIndexFromMidX(point.x)
        if let di = dayIdx,
           let dayDate = dayDateByAddingDays(di) {
            let startOfDay = Calendar.current.startOfDay(for: dayDate)
            onEmptyLongPress?(startOfDay)
        }
    }
    
    // MARK: - Помощни методи
    
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
        return Calendar.current.date(byAdding: .day, value: dayIndex, to: Calendar.current.startOfDay(for: fromDate))
    }
    
    // MARK: - Примерни методи за конвертиране (трябва да бъдат имплементирани или адаптирани спрямо проекта ви)
    
    // Пример: изчислява дата от точка в координатната система на all‑day view
    // (Ако WeekTimelineViewNonOverlapping има подобен метод, използвайте неговата имплементация)
    public func dateFromPoint(_ point: CGPoint) -> Date? {
        // Този пример преобразува вертикалното отместване в часове (с hourHeight, дефиниран в weekView)
        // Трябва да се адаптира спрямо реалната ви имплементация
        let cal = Calendar.current
        let hour = Int(point.y / 50) // ако hourHeight = 50
        let minute = Int(((point.y.truncatingRemainder(dividingBy: 50)) / 50) * 60)
        var comps = cal.dateComponents([.year, .month, .day], from: fromDate)
        comps.hour = hour
        comps.minute = minute
        return cal.date(from: comps)
    }
    
    // Примерен метод за пресмятане на нова дата при resize
    private func dateFromResize(_ frame: CGRect, isTop: Bool) -> Date? {
        let y: CGFloat = isTop ? frame.minY : frame.maxY
        let midX = frame.midX
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex >= dayCount { return nil }
        let cal = Calendar.current
        if let dayDate = cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate)) {
            return timeToDate(dayDate: dayDate, verticalOffset: y)
        }
        return nil
    }
    
    private func timeToDate(dayDate: Date, verticalOffset: CGFloat) -> Date? {
        var hoursFloat = verticalOffset / 50 // ако hourHeight = 50
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
    
    // Примерен метод за наслагване към най-близките 10 минути
    private func snapToNearest10Min(_ date: Date) -> Date {
        let cal = Calendar.current
        let comps = cal.dateComponents([.year, .month, .day, .hour, .minute], from: date)
        guard let y = comps.year, let mo = comps.month, let d = comps.day,
              let h = comps.hour, let m = comps.minute else { return date }
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
                var comps2 = DateComponents(year: y, month: mo, day: d, hour: plusOneHour, minute: 0, second: 0)
                return cal.date(from: comps2) ?? date
            }
        }
        var comps2 = DateComponents(year: y, month: mo, day: d, hour: h, minute: finalM, second: 0)
        return cal.date(from: comps2) ?? date
    }
    
    // Примерен метод за поставяне на малък маркер (например, за 10-минутен интервал)
    private func setSingle10MinuteMarkFromDate(_ date: Date) {
        // Тук можете да обновите изгледа за часовата колона, ако използвате такъв маркер
    }
}

private struct DragData {
    let startGlobalPoint: CGPoint
    let originalFrame: CGRect
    let isTop: Bool
    let startInterval: DateInterval
    let wasAllDay: Bool
}
