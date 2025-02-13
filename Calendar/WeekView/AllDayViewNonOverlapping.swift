//
//  AllDayViewNonOverlapping.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 12/2/25.
//


import UIKit
import CalendarKit

/// Pinned (vertically) view for all-day events only.
/// Similar logic to the old "all-day" част в WeekTimelineViewNonOverlapping,
/// но извадено в отделен subview, който има само хоризонтален скрол.
public final class AllDayViewNonOverlapping: UIView, UIGestureRecognizerDelegate {

    // MARK: - Публични настройки

    public var fromDate: Date = Date()
    public var toDate: Date = Date()

    public var style = TimelineStyle()

    public var leadingInsetForHours: CGFloat = 70
    public var dayColumnWidth: CGFloat = 100

    /// Ако искате автоматично да се преоразмерява височината спрямо броя all-day евенти
    public var autoResizeHeight = true

    /// Височина на тази зона, ако autoResizeHeight = false
    /// Ако autoResizeHeight = true, се опитваме да го преизчислим динамично.
    public var fixedHeight: CGFloat = 40

    // Колбек-и (същите като в WeekTimelineViewNonOverlapping, но тук са само за all-day):
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?

    // Данни за layout
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // Всички евенти (subviews)
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView: EventDescriptor] = [:]

    // Кой евент е "edited"?
    private var currentlyEditedEventView: EventView?

    // Gesture recognizers за дълго задържане в празното
    private let longPressEmptySpace: UILongPressGestureRecognizer

    // MARK: - Инициализация

    public override init(frame: CGRect) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(frame: frame)

        backgroundColor = style.backgroundColor

        // Setup long press for empty space
        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressOnEmptySpace(_:)))
        longPressEmptySpace.minimumPressDuration = 0.7
        addGestureRecognizer(longPressEmptySpace)
    }

    required init?(coder: NSCoder) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(coder: coder)

        backgroundColor = style.backgroundColor

        longPressEmptySpace.addTarget(self, action: #selector(handleLongPressOnEmptySpace(_:)))
        longPressEmptySpace.minimumPressDuration = 0.7
        addGestureRecognizer(longPressEmptySpace)
    }

    // MARK: - Layout

    public override func layoutSubviews() {
        super.layoutSubviews()

        // При всяко setNeedsLayout разпределяме наново
        // 1) Първо крием съществуващите eventViews
        for ev in eventViews {
            ev.isHidden = true
        }

        if autoResizeHeight {
            recalcAllDayHeightDynamically()
        }

        // Рисуваме един фонов слой, ако желаем
        layoutBackground()

        // групиране по ден
        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }

        // Установяваме колко най-много евенти има за някой ден
        let maxEventsInAnyDay = grouped.values.map { $0.count }.max() ?? 0

        // За да подредим евентите едни под други (без застъпване),
        // приемаме rowHeight примерно 24, но да не надвишава общата височина
        // (ако autoResizeHeight = false, ще има изрязване, ако не стига)
        let baseY: CGFloat = 6
        let totalH = bounds.height
        let rowHeight = max(24, (totalH - baseY) / CGFloat(maxEventsInAnyDay == 0 ? 1 : maxEventsInAnyDay))

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

    private func layoutBackground() {
        // Може да добавите някакъв background за allDay зоната
        // или да рисувате линии и т.н.
        // Примерно, можем да рисуваме разделителни линии между дните:
        let ctx = UIGraphicsGetCurrentContext()
        ctx?.saveGState()

        // vertical lines
        ctx?.setStrokeColor(style.separatorColor.cgColor)
        ctx?.setLineWidth(1.0 / UIScreen.main.scale)
        ctx?.beginPath()
        // Линия вляво (граница със часовете)
        ctx?.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx?.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))

        // Следващи колони за всеки ден
        for i in 0...dayCount {
            let colX = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            ctx?.move(to: CGPoint(x: colX, y: 0))
            ctx?.addLine(to: CGPoint(x: colX, y: bounds.height))
        }
        ctx?.strokePath()

        ctx?.restoreGState()
    }

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

    // MARK: - Gesture върху евент

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

        onEventTap?(descriptor)
    }

    @objc private func handleEventViewLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        if gesture.state == .began {
            // Премахваме старата селекция
            if let oldView = currentlyEditedEventView, oldView !== evView,
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

    // За drag на целия евент
    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?
    private var multiDayDraggingOriginalFrames: [EventView: CGRect] = [:]

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

            // Ако е многодневен (EKMultiDayWrapper)
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

        case .ended, .cancelled:
            // Тук, ако финално сме извън тази pinned зона, може да искаме да превключим към "не е all-day" и да извикаме onEventDragEnded?
            // Или ако оставаме в all-day зоната, само сменяме деня?
            if let newDayIndex = dayIndexFromMidX(evView.frame.midX) {
                // Ако оставаме в pinned зоната, просто сменяме деня:
                if let newDayDate = dayDateByAddingDays(newDayIndex) {
                    let startOfDay = Calendar.current.startOfDay(for: newDayDate)
                    let endOfDay = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
                    descriptor.isAllDay = true
                    descriptor.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                    onEventDragEnded?(descriptor, startOfDay)
                }
            } else {
                // Ако midX ни изкарва извън обхвата, можехме да решим, че user иска да го направи "regular" събитие?
                // В реален календар бихме искали да може да се дропне в "часовата" част. Но тук сме само pinned subview,
                // така че при release да се върне на място.
                if let orig = originalFrameForDraggedEvent {
                    evView.frame = orig
                }
            }

            dragOffset = nil
            originalFrameForDraggedEvent = nil
            multiDayDraggingOriginalFrames.removeAll()

            // Прерисуваме
            setNeedsLayout()

        default:
            break
        }
    }

    @objc private func handleResizeHandlePanGesture(_ gesture: UIPanGestureRecognizer) {
        // Подобно на логиката за resizing по часове – тук е all-day, така че
        // най-вероятно ще си остане all-day, освен ако не го издърпаме надолу в часовете (което става в друг view).
        // За да не усложняваме примера, може да позволим само horizontal resize = смяна на деня (разширяване/стесняване)?
        // Или да го оставим минимално за пример:
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView,
              let desc = eventViewToDescriptor[eventView] else { return }
        // Няма да правим сложен resize в този пример – само ще нулираме жеста.
        switch gesture.state {
        case .began:
            // Ако трябва, селектираме евента
            if currentlyEditedEventView !== eventView {
                selectEventView(eventView)
            }
        case .ended, .cancelled:
            // Накрая може да извикаме onEventDragResizeEnded?
            onEventDragResizeEnded?(desc, desc.dateInterval.start)
        default:
            break
        }
    }

    @objc private func handleResizeHandleLongPressGesture(_ gesture: UILongPressGestureRecognizer) {
        // може да се допълни при нужда
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

    // MARK: - LongPress на празно място
    @objc private func handleLongPressOnEmptySpace(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        let point = gesture.location(in: self)

        // Ако попада върху евент, пропускаме
        for evView in eventViews {
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

        // dayIndex
        let dayIdx = dayIndexFromMidX(point.x)
        if let di = dayIdx, let dayDate = dayDateByAddingDays(di) {
            let startOfDay = Calendar.current.startOfDay(for: dayDate)
            onEmptyLongPress?(startOfDay)
        }
    }

    // MARK: - Помощни

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
            // default
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

    /// Външен метод, който контейнерът може да ползва, за да пита "колко високо искаш да станеш?"
    public func desiredHeight() -> CGFloat {
        return self.fixedHeight
    }

    private func dayIndexFromMidX(_ x: CGFloat) -> Int? {
        // примерен метод
        let colX = x - leadingInsetForHours
        let idx = Int(floor(colX / dayColumnWidth))
        if idx < 0 || idx >= dayCount { return nil }
        return idx
    }

    private func dayDateByAddingDays(_ dayIndex: Int) -> Date? {
        let cal = Calendar.current
        return cal.date(byAdding: .day, value: dayIndex, to: cal.startOfDay(for: fromDate))
    }
}
