//
//  WeekTimelineViewNonOverlapping.swift
//  ExampleCalendarApp
//
//  - Non-overlapping подреждане
//  - Drag & Drop (не изключва edit мода при .ended)
//  - Resize (не изключва edit мода при .ended)
//  - Не се пипа името на евента (title/text) при разтегляне!
//  - Поддържа разтегляне надолу до 23:59, ако потребителят влачи извън 24:00.
//
//  Edit mode: спира САМО при tap върху друг евент или tap/long press на празно място.
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
    
    /// Височина на "all-day" зоната (горе)
    public var allDayHeight: CGFloat = 40
    
    /// Автоматично да се увеличава allDayHeight според броя all-day евенти
    public var autoResizeAllDayHeight = true

    // MARK: - Callback-и
    /// При TAP върху съществуващо събитие
    public var onEventTap: ((EventDescriptor) -> Void)?
    
    /// При LONG PRESS на празно
    public var onEmptyLongPress: ((Date) -> Void)?
    
    /// При отпускане (.ended) на drag/resize:
    /// подаваме (EventDescriptor, Date) = (кое събитие, новата начална дата).
    /// (Не гаси edit mode, само информира.)
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?

    // MARK: - Данни за layout
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // UIView-и за all-day и regular събития
    private var allDayEventViews: [EventView] = []
    private var eventViews: [EventView] = []
    
    // За бърза връзка: EventView -> EventDescriptor
    private var eventViewToDescriptor: [EventView : EventDescriptor] = [:]

    // Кое събитие в момента е в "режим редакция"
    private var currentlyEditedEventView: EventView?

    // --- Променливи за drag/resize ---
    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?

    private var resizeHandleTag: Int?
    private var prevResizeOffset: CGPoint?

    // MARK: - Инициализация
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = style.backgroundColor
        
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()  // Gesture за "tap на празно"
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = style.backgroundColor
        
        setupLongPressForEmptySpace()
        setupTapOnEmptySpace()
    }
    
    private func setupLongPressForEmptySpace() {
        // Long press на празно
        let longPressGR = UILongPressGestureRecognizer(
            target: self,
            action: #selector(handleLongPressOnEmptySpace(_:))
        )
        longPressGR.minimumPressDuration = 0.7
        addGestureRecognizer(longPressGR)
    }
    
    // Gesture за "tap на празно място" – с него ще можем да спираме edit mode.
    private func setupTapOnEmptySpace() {
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleTapOnEmptySpace(_:)))
        tapGR.cancelsTouchesInView = false
        tapGR.delegate = self
        addGestureRecognizer(tapGR)
    }
    
    // Delegate метод: разрешаваме tapOnEmptySpace само ако не е върху eventView.
    public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer,
                                  shouldReceive touch: UITouch) -> Bool {
        let location = touch.location(in: self)
        // Ако е върху някой от eventView-ите -> да не се задейства tapOnEmptySpace
        for evView in (allDayEventViews + eventViews) {
            if !evView.isHidden && evView.frame.contains(location) {
                return false
            }
        }
        return true
    }
    
    // Tap на празно => изключваме edit mode
    @objc private func handleTapOnEmptySpace(_ gesture: UITapGestureRecognizer) {
        guard gesture.state == .ended else { return }
        
        // Ако има отворен edit mode, го затваряме
        if let oldView = currentlyEditedEventView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
            currentlyEditedEventView = nil
        }
    }
    
    // MARK: - LayoutSubviews
    public override func layoutSubviews() {
        super.layoutSubviews()

        // Крие/ресет старите
        for v in allDayEventViews { v.isHidden = true }
        for v in eventViews       { v.isHidden = true }

        if autoResizeAllDayHeight {
            recalcAllDayHeightDynamically()
        }

        layoutAllDayBackground()
        layoutAllDayLabel()
        layoutAllDayEvents()
        layoutRegularEvents()
        hideEventsClashingWithCurrentTime()
    }

    // Примерна "all-day" зона
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
    
    // "all-day" текст
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
        let labelWidth = leadingInsetForHours
        allDayLabel.frame = CGRect(x: 0, y: 0, width: labelWidth, height: allDayHeight)
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

    // MARK: - Подреждане all-day
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

    // MARK: - Подреждане regular
    private func layoutRegularEvents() {
        let groupedByDay = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        var usedEventViewIndex = 0

        for dayIndex in 0..<7 {
            guard let eventsForDay = groupedByDay[dayIndex],
                  !eventsForDay.isEmpty else { continue }

            let sorted = eventsForDay.sorted {
                $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start
            }

            // Намираме колко "колони" ни трябват (не-overlapping)
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
            // Overlap check
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

    // MARK: - Създаване на EventView
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
        let v = EventView()

        // TAP върху евента
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        v.addGestureRecognizer(tapGR)

        // LONG PRESS -> drag
        let longPressGR = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewLongPress(_:)))
        longPressGR.minimumPressDuration = 0.5
        v.addGestureRecognizer(longPressGR)

        // Пан за дръжките (top/bottom)
        for handle in v.eventResizeHandles {
            handle.panGestureRecognizer.addTarget(self, action: #selector(handleResizeHandlePanGesture(_:)))
            handle.panGestureRecognizer.cancelsTouchesInView = true
        }

        v.isUserInteractionEnabled = true
        addSubview(v)
        return v
    }

    // MARK: - Tap върху събитие
    @objc private func handleEventViewTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[tappedView] else {
            return
        }

        // Ако друго евент е било в edit mode, махаме го
        if let oldView = currentlyEditedEventView,
           oldView !== tappedView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
        }

        // Включваме (или държим) edit mode за текущия
        descriptor.editedEvent = descriptor
        tappedView.updateWithDescriptor(event: descriptor)
        currentlyEditedEventView = tappedView

        onEventTap?(descriptor)
    }

    // MARK: - LongPress върху събитие (drag)
    @objc private func handleEventViewLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView else { return }
        let location = gesture.location(in: self)

        switch gesture.state {
        case .began:
            // Ако друго евент е в edit mode, го изключваме
            if let oldView = currentlyEditedEventView,
               oldView !== evView,
               let oldDesc = eventViewToDescriptor[oldView] {
                oldDesc.editedEvent = nil
                oldView.updateWithDescriptor(event: oldDesc)
            }
            // Включваме edit mode
            if let desc = eventViewToDescriptor[evView],
               desc.editedEvent == nil {
                desc.editedEvent = desc
                evView.updateWithDescriptor(event: desc)
            }
            currentlyEditedEventView = evView

            // Запомняме началния frame + offset
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(x: location.x - evView.frame.minX,
                                 y: location.y - evView.frame.minY)

        case .changed:
            guard let offset = dragOffset else { return }
            var newFrame = evView.frame
            newFrame.origin.x = location.x - offset.x
            newFrame.origin.y = location.y - offset.y
            evView.frame = newFrame

        case .ended, .cancelled:
            // НЕ махаме edit mode тук!
            if let desc = eventViewToDescriptor[evView] {
                if let newDate = dateFromFrame(evView.frame) {
                    onEventDragEnded?(desc, newDate)
                } else {
                    // ако е извън зоната - връщаме го
                    if let original = originalFrameForDraggedEvent {
                        evView.frame = original
                    }
                }
            }
            dragOffset = nil
            originalFrameForDraggedEvent = nil

        default:
            break
        }
    }

    // MARK: - Пан върху дръжките (top/bottom)
    @objc private func handleResizeHandlePanGesture(_ gesture: UIPanGestureRecognizer) {
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView else { return }
        let location = gesture.location(in: self)
        let tag = handleView.tag // 0=top, 1=bottom

        switch gesture.state {
        case .began:
            // Ако друго евент е в edit mode, го изключваме
            if let oldView = currentlyEditedEventView,
               oldView !== eventView,
               let oldDesc = eventViewToDescriptor[oldView] {
                oldDesc.editedEvent = nil
                oldView.updateWithDescriptor(event: oldDesc)
            }
            currentlyEditedEventView = eventView

            // Включваме edit mode за това (ако не е)
            if let desc = eventViewToDescriptor[eventView],
               desc.editedEvent == nil {
                desc.editedEvent = desc
                eventView.updateWithDescriptor(event: desc)
            }

            resizeHandleTag = tag
            prevResizeOffset = location

        case .changed:
            guard let prevLoc = prevResizeOffset else { return }
            let dy = location.y - prevLoc.y

            var f = eventView.frame
            if tag == 0 {
                // Горна дръжка
                f.origin.y += dy
                f.size.height -= dy
            } else {
                // Долна дръжка
                f.size.height += dy
            }
            if f.size.height < 20 {
                // Минимална височина
                break
            }
            eventView.frame = f
            prevResizeOffset = location

            // "Real-time" промяна на dateInterval
            if let desc = eventViewToDescriptor[eventView] {
                let isTop = (tag == 0)
                if let newDate = dateFromResize(eventView.frame, isTop: isTop) {
                    var interval = desc.dateInterval
                    // Променяме start/end
                    if isTop {
                        interval = DateInterval(start: newDate, end: interval.end)
                    } else {
                        interval = DateInterval(start: interval.start, end: newDate)
                    }
                    desc.dateInterval = interval

                    // Не пипаме title/text на евента!

                    // Ъпдейтваме изгледа
                    eventView.updateWithDescriptor(event: desc)
                }
            }

        case .ended, .cancelled:
            // НЕ махаме edit mode!
            if let desc = eventViewToDescriptor[eventView] {
                let isTop = (resizeHandleTag == 0)
                if let newDate = dateFromResize(eventView.frame, isTop: isTop) {
                    onEventDragEnded?(desc, newDate)
                }
            }
            resizeHandleTag = nil
            prevResizeOffset = nil

        default:
            break
        }
    }

    // MARK: - Long Press в празно
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)

        // Ако сме попаднали върху евент, не правим нищо
        for evView in (allDayEventViews + eventViews) {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }

        // Изключваме edit mode на старото, ако има
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

    // Преобразуване на CGPoint -> Date (за tap/long press)
    private func dateFromPoint(_ point: CGPoint) -> Date? {
        let x = point.x
        let y = point.y
        if x < leadingInsetForHours { return nil }
        if y < allDayHeight { return nil }

        let dayIndex = Int((x - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex > 6 { return nil }

        let cal = Calendar.current
        guard let dayDate = cal.date(byAdding: .day, value: dayIndex, to: startOfWeek) else {
            return nil
        }

        let yOffset = y - allDayHeight
        return timeToDate(dayDate: dayDate, verticalOffset: yOffset)
    }

    // При drag -> frame.minY => час, frame.midX => ден
    private func dateFromFrame(_ frame: CGRect) -> Date? {
        let topY = frame.minY
        let midX = frame.midX

        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex > 6 { return nil }

        let cal = Calendar.current
        guard let dayDate = cal.date(byAdding: .day, value: dayIndex, to: startOfWeek) else {
            return nil
        }

        let yOffset = topY - allDayHeight
        return timeToDate(dayDate: dayDate, verticalOffset: yOffset)
    }

    // При top => frame.minY, при bottom => frame.maxY
    private func dateFromResize(_ frame: CGRect, isTop: Bool) -> Date? {
        let y: CGFloat = isTop ? frame.minY : frame.maxY
        let centerX = frame.midX
        if centerX < leadingInsetForHours { return nil }
        let dayIndex = Int((centerX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex > 6 { return nil }

        let cal = Calendar.current
        guard let dayDate = cal.date(byAdding: .day, value: dayIndex, to: startOfWeek) else {
            return nil
        }

        let yOffset = y - allDayHeight
        return timeToDate(dayDate: dayDate, verticalOffset: yOffset)
    }

    // Помощна: превръща yOffset (0..24h) в Date, с кламп до [0..24h]
    private func timeToDate(dayDate: Date, verticalOffset: CGFloat) -> Date? {
        let cal = Calendar.current
        var hoursFloat = (verticalOffset / hourHeight) // 1 = 1.0h
        if hoursFloat < 0 { hoursFloat = 0 }
        if hoursFloat > 24 { hoursFloat = 24 } // Клампваме до 24

        let hour = floor(hoursFloat)
        let minuteFloat = (hoursFloat - hour) * 60
        let minute = floor(minuteFloat)

        var comps = cal.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hour)
        comps.minute = Int(minute)
        if let newDate = cal.date(from: comps) {
            return newDate
        }
        return nil
    }

    // MARK: - Помощни
    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        // 00:00 => 0, 24:00 => 24 * hourHeight
        return hourHeight * (hour + minute/60)
    }

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

    // MARK: - Рисуване (часови линии + текущата червена линия)
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

        // Вертикални линии (7 колони)
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

        // Плътна червена линия (вътре в текущия ден)
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
