import UIKit
import CalendarKit

public final class WeekTimelineViewNonOverlapping: UIView {

    public var startOfWeek: Date = Date()
    public var style = TimelineStyle()
    public var leadingInsetForHours: CGFloat = 70
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50

    public var allDayHeight: CGFloat = 40
    public var autoResizeAllDayHeight = true

    // Массиви със събития (EventLayoutAttributes, които са CalendarKit)
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // Тук ще се рисуват "all-day" евенти
    private let allDayBackground = UIView()
    private let allDayLabel = UILabel()

    private var allDayEventViews: [EventView] = []
    private var eventViews: [EventView] = []

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = style.backgroundColor

        allDayBackground.backgroundColor = .systemGray5
        addSubview(allDayBackground)

        allDayLabel.text = "all-day"
        allDayLabel.font = UIFont.systemFont(ofSize: 14)
        allDayLabel.textColor = .black
        addSubview(allDayLabel)
    }
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    public override func layoutSubviews() {
        super.layoutSubviews()

        // Скриваме стари EventView (рециклиране)
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

    // Пример: ако има много all-day събития, увеличава allDayHeight
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

    private func layoutAllDayBackground() {
        let x = leadingInsetForHours
        let w = dayColumnWidth * 7
        allDayBackground.frame = CGRect(x: x, y: 0, width: w, height: allDayHeight)
    }

    private func layoutAllDayLabel() {
        let labelWidth = leadingInsetForHours
        allDayLabel.frame = CGRect(x: 0, y: 0, width: labelWidth, height: allDayHeight)
    }

    private func layoutAllDayEvents() {
        let grouped = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }

        let base: CGFloat = 10
        let maxInAnyDay = grouped.values.map { $0.count }.max() ?? 1
        let rowHeight = max(24, (allDayHeight - base) / CGFloat(maxInAnyDay))

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
            }
        }
    }

    private func layoutRegularEvents() {
        let groupedByDay = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        var usedEventViewIndex = 0

        for dayIndex in 0..<7 {
            guard let eventsForDay = groupedByDay[dayIndex],
                  !eventsForDay.isEmpty else { continue }

            // Сортираме по начален час
            let sorted = eventsForDay.sorted {
                $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start
            }

            // Подреждаме в колони (не-застъпващо)
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
                }
            }
        }
    }

    private func isOverlapping(_ candidate: EventLayoutAttributes,
                               in columnEvents: [EventLayoutAttributes]) -> Bool
    {
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

    // Ако „червената линия“ се пресича с някое евент view, можем да го скрием.
    // (примерен детайл, не винаги е нужен)
    private func hideEventsClashingWithCurrentTime() {
        let now = Date()
        guard let dayIndex = dayIndexIfInCurrentWeek(now) else {
            return
        }
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

    // MARK: - draw(_:) => чертае хор. линии, вертик. линии и "червена линия"
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let totalWidth = leadingInsetForHours + dayColumnWidth*7
        let normalZoneTop = allDayHeight

        // (1) Хор. линии 0..24
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

        // (2) Вертикални линии (начална + 7 колони)
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        // Линия при leadingInsetForHours
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        // + още 7 линии
        for i in 0...7 {
            let colX = leadingInsetForHours + CGFloat(i)*dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: bounds.height))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // (3) Червена линия (ако днешният ден е в седмицата)
        drawCurrentTimeLineForCurrentDay(ctx: ctx)
    }

    private func drawCurrentTimeLineForCurrentDay(ctx: CGContext) {
        let now = Date()
        guard let dayIndex = dayIndexIfInCurrentWeek(now) else {
            // Ако не е в седмицата, не рисуваме линия
            return
        }
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

        // Плътна червена линия над текущия ден
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: currentDayX, y: yNow))
        ctx.addLine(to: CGPoint(x: currentDayX2, y: yNow))
        ctx.strokePath()
        ctx.restoreGState()

        // Десен полупрозрачен сегмент
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

    // MARK: - Helpers

    /// Проверка дали `date` е в диапазона `[startOfWeek ..< startOfWeek+7 дни]`.
    /// Ако е вътре – връщаме 0..6 (индекс на деня). Ако не – nil.
    public func dayIndexIfInCurrentWeek(_ date: Date) -> Int? {
        let cal = Calendar.current
        // "изрязваме" часовете, за да сме сигурни, че startOfWeek е 00:00
        let startOnly = startOfWeek.dateOnly(calendar: cal)
        let endOfWeek = cal.date(byAdding: .day, value: 7, to: startOnly)!

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

    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return (hour + minute/60) * hourHeight
    }

    private func ensureAllDayEventView(index: Int) -> EventView {
        if index < allDayEventViews.count {
            return allDayEventViews[index]
        } else {
            let v = EventView()
            addSubview(v)
            allDayEventViews.append(v)
            return v
        }
    }

    private func ensureRegularEventView(index: Int) -> EventView {
        if index < eventViews.count {
            return eventViews[index]
        } else {
            let v = EventView()
            addSubview(v)
            eventViews.append(v)
            return v
        }
    }
}
