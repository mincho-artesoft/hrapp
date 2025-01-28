//
//  WeekTimelineViewNonOverlapping.swift
//  ExampleCalendarApp
//
//  Седмичен изглед, който поддържа:
//   - non-overlapping подредба на събитията
//   - drag & drop + resize (горна/долна дръжка)
//   - drag „между дните“ (т.е. и по хоризонтала)
//   - при отпускане -> onEventDragEnded(descriptor, newDate)
//
//  Кодът използва горния ръб (frame.minY) за вертикалната позиция (час)
//  и midX за хоризонталната позиция (ден).
//

import UIKit
import CalendarKit

public final class WeekTimelineViewNonOverlapping: UIView {

    // MARK: - Публични настройки
    public var startOfWeek: Date = Date()
    public var style = TimelineStyle()
    public var leadingInsetForHours: CGFloat = 70
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50

    public var allDayHeight: CGFloat = 40
    public var autoResizeAllDayHeight = true

    // MARK: - Callback-и
    /// При тап върху съществуващо събитие
    public var onEventTap: ((EventDescriptor) -> Void)?

    /// При дълго задържане в празно
    public var onEmptyLongPress: ((Date) -> Void)?

    /// При drag или resize, когато жестът приключи (.ended)
    /// → подава (EventDescriptor, Date) = (кое събитие, нова начална дата)
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?

    // MARK: - Данни за layout
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // Държим "живите" eventView за all-day и regular
    private var allDayEventViews: [EventView] = []
    private var eventViews: [EventView] = []

    // Мап: EventView -> EventDescriptor
    private var eventViewToDescriptor: [EventView : EventDescriptor] = [:]

    // --- Променливи за drag/resize ---
    private var originalFrameForDraggedEvent: CGRect?
    /// Drag offset: колко е (touch.x - frame.minX) и (touch.y - frame.minY)
    private var dragOffset: CGPoint?

    private var resizeHandleTag: Int?      // 0=top, 1=bottom
    private var prevResizeOffset: CGPoint?

    // MARK: - Инициализация
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = style.backgroundColor
        setupLongPressForEmptySpace()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = style.backgroundColor
        setupLongPressForEmptySpace()
    }

    private func setupLongPressForEmptySpace() {
        let longPressGR = UILongPressGestureRecognizer(
            target: self,
            action: #selector(handleLongPressOnEmptySpace(_:))
        )
        longPressGR.minimumPressDuration = 0.7
        addGestureRecognizer(longPressGR)
    }

    // MARK: - LayoutSubviews
    public override func layoutSubviews() {
        super.layoutSubviews()

        // Първо крия старите
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

    // Фон за all-day (примерен)
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

    // "all-day" етикет
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

    // Динамична височина
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

    // Подреждане all-day
    private func layoutAllDayEvents() {
        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        var usedIndex = 0
        let base: CGFloat = 10
        let groupedMax = grouped.values.map { $0.count }.max() ?? 1
        let rowHeight = max(24, (allDayHeight - base) / CGFloat(groupedMax))

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

    // Подреждане regular
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

            // Разделяме в колони (non-overlapping)
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

    // Скриваме евентите, които се засичат с текущия час
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
        // Tap
        let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleEventViewTap(_:)))
        v.addGestureRecognizer(tapGR)

        // LongPress -> drag
        let longPressGR = UILongPressGestureRecognizer(target: self, action: #selector(handleEventViewLongPress(_:)))
        longPressGR.minimumPressDuration = 0.5
        v.addGestureRecognizer(longPressGR)

        // Пан върху дръжките (горна/долна)
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
        onEventTap?(descriptor)
    }

    // MARK: - LongPress върху събитие (drag) - и вертикално, и хоризонтално
    @objc private func handleEventViewLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView else { return }
        let location = gesture.location(in: self)

        switch gesture.state {
        case .began:
            // Ако event не е в editing
            if let desc = eventViewToDescriptor[evView], desc.editedEvent == nil {
                desc.editedEvent = desc
                evView.updateWithDescriptor(event: desc)
            }
            originalFrameForDraggedEvent = evView.frame
            // Запомняме offset (touch - frame.origin)
            dragOffset = CGPoint(
                x: location.x - evView.frame.minX,
                y: location.y - evView.frame.minY
            )

        case .changed:
            guard let offset = dragOffset else { return }
            var newFrame = evView.frame
            newFrame.origin.x = location.x - offset.x
            newFrame.origin.y = location.y - offset.y
            evView.frame = newFrame

        case .ended, .cancelled:
            if let desc = eventViewToDescriptor[evView] {
                // При отпускане -> вземаме деня (по midX) + началото (по minY)
                if let newDate = dateFromFrame(evView.frame) {
                    onEventDragEnded?(desc, newDate)
                } else {
                    // Ако е извън, връщаме
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

    // MARK: - Пан върху дръжките
    @objc private func handleResizeHandlePanGesture(_ gesture: UIPanGestureRecognizer) {
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView else { return }
        let location = gesture.location(in: self)
        let tag = handleView.tag // 0=top, 1=bottom

        switch gesture.state {
        case .began:
            if let desc = eventViewToDescriptor[eventView], desc.editedEvent == nil {
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
            if f.size.height < 20 { break }
            eventView.frame = f
            prevResizeOffset = location

        case .ended, .cancelled:
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

    // Кое време взимаме? Ако е top → frame.minY, ако bottom → frame.maxY
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
        let hours = floor(yOffset / hourHeight)
        let minuteFraction = (yOffset / hourHeight) - hours
        let minutes = minuteFraction * 60

        var comps = cal.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hours)
        comps.minute = Int(minutes)
        return cal.date(from: comps)
    }

    // MARK: - Long Press в празно
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)

        // Ако попада върху event, не правим нищо
        for evView in (allDayEventViews + eventViews) {
            if !evView.isHidden && evView.frame.contains(point) {
                return
            }
        }
        // Иначе: onEmptyLongPress
        if let tappedDate = dateFromPoint(point) {
            onEmptyLongPress?(tappedDate)
        }
    }

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
        let hours = floor(yOffset / hourHeight)
        let minuteFraction = (yOffset / hourHeight) - hours
        let minutes = minuteFraction * 60

        var comps = cal.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hours)
        comps.minute = Int(minutes)
        return cal.date(from: comps)
    }

    /// При drag на цялото събитие (хотизонтално+вертикално),
    /// за начален час взимаме frame.minY, а за ден - frame.midX.
    private func dateFromFrame(_ frame: CGRect) -> Date? {
        let topY = frame.minY
        let midX = frame.midX

        // Ден
        if midX < leadingInsetForHours { return nil }
        let dayIndex = Int((midX - leadingInsetForHours) / dayColumnWidth)
        if dayIndex < 0 || dayIndex > 6 { return nil }

        let cal = Calendar.current
        guard let dayDate = cal.date(byAdding: .day, value: dayIndex, to: startOfWeek) else {
            return nil
        }

        // Час
        let yOffset = topY - allDayHeight
        let hours = floor(yOffset / hourHeight)
        let minuteFraction = (yOffset / hourHeight) - hours
        let minutes = minuteFraction * 60

        var comps = cal.dateComponents([.year, .month, .day], from: dayDate)
        comps.hour = Int(hours)
        comps.minute = Int(minutes)
        return cal.date(from: comps)
    }

    // MARK: - Помощни
    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return hourHeight*(hour + minute/60)
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
        let endOfWeek = cal.date(byAdding: .day, value: 7, to: startOnly)!

        if date >= startOnly && date < endOfWeek {
            let comps = cal.dateComponents([.day], from: startOnly, to: date)
            return comps.day
        }
        return nil
    }

    // MARK: - Рисуване (линии, текущ час)
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

        // Плътна червена линия в текущия ден
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: currentDayX, y: yNow))
        ctx.addLine(to: CGPoint(x: currentDayX2, y: yNow))
        ctx.strokePath()
        ctx.restoreGState()

        // Дясна полупрозрачен
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
