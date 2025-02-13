import UIKit
import CalendarKit

/// Pinned (vertically) view за all-day събития.
/// Пример без хоризонтален скрол: ширината за всеки ден се пресмята динамично
/// така, че всички дни да се поберат в наличната ширина на view-то.
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

    /// Ако искате автоматично да се преоразмерява височината спрямо броя all-day евенти.
    public var autoResizeHeight = true

    /// Ако autoResizeHeight = false, това е фиксираната височина.
    /// Ако = true, ще преизчисляваме динамично в `recalcAllDayHeightDynamically()`.
    public var fixedHeight: CGFloat = 40

    // Колбек-и (за реакция при действия в all-day зона):
    public var onEventTap: ((EventDescriptor) -> Void)?
    public var onEmptyLongPress: ((Date) -> Void)?
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)?
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)?

    // Списък с layout атрибути за всеки all-day евент
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // Списък със субвюта (EventView) за визуализация на евентите
    private var eventViews: [EventView] = []
    private var eventViewToDescriptor: [EventView: EventDescriptor] = [:]

    // Текущо селектиран (редактиран) евент
    private var currentlyEditedEventView: EventView?

    // Gesture recognizer за long press в празното пространство
    private let longPressEmptySpace: UILongPressGestureRecognizer

    // MARK: - Инициализация

    public override init(frame: CGRect) {
        longPressEmptySpace = UILongPressGestureRecognizer()
        super.init(frame: frame)

        // За разлика от style.backgroundColor, тук даваме по-тъмен фон (пример)
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

        // Първо скриваме/нулираме всички стари eventView-та:
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
            // Разпределяме го поравно за всеки ден
            dayColumnWidth = safeWidth / CGFloat(totalDays)
        } else {
            dayColumnWidth = 0
        }

        setNeedsDisplay()

        // Групираме евентите по ден
        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }

        // Намираме колко най-много евенти има в който и да е ден
        let maxEventsInAnyDay = grouped.values.map { $0.count }.max() ?? 0

        // Определяме височината за един "ред" евент
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

    // Чертаем разделителните линии
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

        // Хоризонтални
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

        // Resize handles (ако решите да ползвате resizing и тук)
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

        // Премахваме старата селекция, ако има
        if let oldView = currentlyEditedEventView, oldView !== tappedView,
           let oldDesc = eventViewToDescriptor[oldView] {
            oldDesc.editedEvent = nil
            oldView.updateWithDescriptor(event: oldDesc)
        }

        // Селектираме този евент
        descriptor.editedEvent = descriptor
        tappedView.updateWithDescriptor(event: descriptor)
        currentlyEditedEventView = tappedView

        onEventTap?(descriptor)
    }

    @objc private func handleEventViewLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }
        if gesture.state == .began {
            // Деселектираме предишния
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

    private var originalFrameForDraggedEvent: CGRect?
    private var dragOffset: CGPoint?
    private var multiDayDraggingOriginalFrames: [EventView: CGRect] = [:]

    @objc private func handleEventViewPan(_ gesture: UIPanGestureRecognizer) {
        guard let evView = gesture.view as? EventView,
              let descriptor = eventViewToDescriptor[evView] else { return }

        if currentlyEditedEventView !== evView {
            selectEventView(evView)
        }

        switch gesture.state {
        case .began:
            let loc = gesture.location(in: self)
            originalFrameForDraggedEvent = evView.frame
            dragOffset = CGPoint(x: loc.x - evView.frame.minX, y: loc.y - evView.frame.minY)

            // Ако е многодневен (EKMultiDayWrapper) – пазим всички парчета
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

            // Ако е многодневен, местим и останалите вюта
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
            // При отпускане проверяваме дали сме върху валиден ден
            if let newDayIndex = dayIndexFromMidX(evView.frame.midX) {
                // Ако е валиден ден -> ъпдейтваме събитието
                if let newDayDate = dayDateByAddingDays(newDayIndex) {
                    let startOfDay = Calendar.current.startOfDay(for: newDayDate)
                    let endOfDay = Calendar.current.date(byAdding: .day, value: 1, to: startOfDay)!
                    descriptor.isAllDay = true
                    descriptor.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                    onEventDragEnded?(descriptor, startOfDay)
                }
            } else {
                // Ако излизаме извън зоната -> връщаме го на старото място
                if let orig = originalFrameForDraggedEvent {
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
        // За all-day няма специална логика
        guard let handleView = gesture.view as? EventResizeHandleView,
              let eventView = handleView.superview as? EventView,
              let desc = eventViewToDescriptor[eventView] else { return }

        switch gesture.state {
        case .began:
            if currentlyEditedEventView !== eventView {
                selectEventView(eventView)
            }
        case .ended, .cancelled:
            onEventDragResizeEnded?(desc, desc.dateInterval.start)
        default:
            break
        }
    }

    @objc private func handleResizeHandleLongPressGesture(_ gesture: UILongPressGestureRecognizer) {
        // допълнителна логика, ако искате
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

        // Ако попада върху евент
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
        return Calendar.current.date(
            byAdding: .day,
            value: dayIndex,
            to: Calendar.current.startOfDay(for: fromDate)
        )
    }
}
