import UIKit
import CalendarKit

// MARK: - DaysHeaderView
/// Горна лента с 7 label‑а (Mon 1, Tue 2...), всеки започва при x = leadingInsetForHours + i*dayColumnWidth
/// и оцветява текущия ден в оранжево.
public final class DaysHeaderView: UIView {

    public var dayColumnWidth: CGFloat = 100
    public var leadingInsetForHours: CGFloat = 70  // По-голяма, за да има място за часовете

    public var startOfWeek: Date = Date() {
        didSet {
            updateTexts()
        }
    }

    private var labels: [UILabel] = []

    public override init(frame: CGRect) {
        super.init(frame: frame)
        configureLabels()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        configureLabels()
    }

    private func configureLabels() {
        // 7 label‑а
        for _ in 0..<7 {
            let lbl = UILabel()
            lbl.textAlignment = .center
            lbl.font = .systemFont(ofSize: 12, weight: .semibold)
            lbl.textColor = .label
            labels.append(lbl)
            addSubview(lbl)
        }
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        for (i, lbl) in labels.enumerated() {
            let x = leadingInsetForHours + CGFloat(i)*dayColumnWidth
            lbl.frame = CGRect(x: x, y: 0, width: dayColumnWidth, height: bounds.height)
        }
    }

    private func updateTexts() {
        let cal = Calendar.current
        let df = DateFormatter()
        df.dateFormat = "EEE, d MMM"

        let todayStart = cal.startOfDay(for: Date()) // днешна дата (без час)

        for (i, lbl) in labels.enumerated() {
            if let dayDate = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                lbl.text = df.string(from: dayDate)
                // Оцветяваме в оранжево, ако е "днес"
                let dayOnly = cal.startOfDay(for: dayDate)
                if dayOnly == todayStart {
                    lbl.textColor = .systemOrange
                } else {
                    lbl.textColor = .label
                }
            } else {
                lbl.text = "??"
            }
        }
    }
}

// MARK: - HoursColumnView
/// Лява колона (часове). Рисува 00:00..23:00 по вертикала,
/// + topOffset за all-day зоната. Може да изписва и текущия час (ако е в седмицата).
/// С логика да не рисува черния час, ако се застъпва с червения.
public final class HoursColumnView: UIView {

    public var hourHeight: CGFloat = 50
    public var font = UIFont.systemFont(ofSize: 12, weight: .medium)

    /// Изместване надолу (ако имаме all-day) – така 00:00 да е под all-day евентите
    public var topOffset: CGFloat = 0

    /// Ако true => днешният ден е в седмицата => показваме currentTime
    public var isCurrentDayInWeek: Bool = false

    /// Ако не е nil => това е текущият час. Рисуваме го в червено.
    public var currentTime: Date? = nil

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .white
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .white
    }

    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let cal = Calendar.current
        let baseDate = cal.startOfDay(for: Date())

        // Атрибути за черните етикети (часовете)
        let blackAttrs: [NSAttributedString.Key: Any] = [
            .foregroundColor: UIColor.label,
            .font: font
        ]

        // (1) Подготвяме позицията за "текущия час" (ако го има)
        var currentTimeRect: CGRect? = nil
        if isCurrentDayInWeek, let now = currentTime {
            // Пресмятаме къде ще е червеният текст
            let hour = CGFloat(cal.component(.hour, from: now))
            let minute = CGFloat(cal.component(.minute, from: now))
            let fraction = hour + minute/60.0
            let yNow = topOffset + fraction * hourHeight

            let timeFormatter = DateFormatter()
            timeFormatter.timeStyle = .short // "3:54 PM"
            let nowString = timeFormatter.string(from: now)

            let redAttrs: [NSAttributedString.Key: Any] = [
                .foregroundColor: UIColor.systemRed,
                .font: UIFont.systemFont(ofSize: 12, weight: .semibold)
            ]
            let size = nowString.size(withAttributes: redAttrs)

            let textX: CGFloat = 8
            let textY: CGFloat = yNow - size.height/2
            currentTimeRect = CGRect(x: textX, y: textY, width: size.width, height: size.height)
        }

        // (2) Рисуваме черните етикети за 0..24 часа, но прескачаме тези,
        //     които се застъпват с "currentTimeRect" (ако има такъв).
        for hour in 0...24 {
            let y = topOffset + CGFloat(hour)*hourHeight

            let date = cal.date(byAdding: .hour, value: hour, to: baseDate)!
            let df = DateFormatter()
            df.dateFormat = "h:00 a" // 10:00 AM
            let text = df.string(from: date)

            let size = text.size(withAttributes: blackAttrs)
            let textRect = CGRect(
                x: 8,
                y: y - size.height/2,
                width: size.width,
                height: size.height
            )

            // Проверка за застъпване с червения текст
            if let cRect = currentTimeRect,
               textRect.intersects(cRect) {
                // Ако се застъпват -> пропускаме рисуването на черния час.
                continue
            }

            // Иначе го рисуваме:
            text.draw(in: textRect, withAttributes: blackAttrs)
        }

        // (3) Накрая рисуваме червения текст (ако `isCurrentDayInWeek` и `currentTime != nil`)
        if isCurrentDayInWeek, let now = currentTime, let cRect = currentTimeRect {
            let timeFormatter = DateFormatter()
            timeFormatter.timeStyle = .short // "3:54 PM"
            let nowString = timeFormatter.string(from: now)

            let redAttrs: [NSAttributedString.Key: Any] = [
                .foregroundColor: UIColor.systemRed,
                .font: UIFont.systemFont(ofSize: 12, weight: .semibold)
            ]

            nowString.draw(in: cRect, withAttributes: redAttrs)
        }
    }
}

// MARK: - WeekTimelineViewNonOverlapping
/// Цялата седмична зона (all-day най-горе, после редовни евенти),
/// не-застъпваща се колонна подредба.
/// - Рисуваме current time line само в текущия ден (ако е в седмицата).
/// - Скриваме евентите, които се пресичат с тази линия (hideEventsClashingWithCurrentTime).
public final class WeekTimelineViewNonOverlapping: UIView {

    public var startOfWeek: Date = Date()
    public var style = TimelineStyle()
    public var leadingInsetForHours: CGFloat = 70
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50

    /// Височина на all-day зоната
    public var allDayHeight: CGFloat = 40

    /// Ако искате автоматично да увеличавате allDayHeight според броя all-day събития
    public var autoResizeAllDayHeight = true

    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    // Private UI
    private let allDayBackground = UIView()
    private let allDayLabel = UILabel()

    private var allDayEventViews: [EventView] = []
    private var eventViews: [EventView] = []

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = style.backgroundColor

        // Сив фон за all-day
        allDayBackground.backgroundColor = .systemGray5
        addSubview(allDayBackground)

        // Надпис "all-day"
        allDayLabel.text = "all-day"
        allDayLabel.font = UIFont.systemFont(ofSize: 14)
        allDayLabel.textColor = .black
        addSubview(allDayLabel)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) not implemented")
    }

    public override func layoutSubviews() {
        super.layoutSubviews()

        if autoResizeAllDayHeight {
            recalcAllDayHeightDynamically()
        }

        layoutAllDayBackground()
        layoutAllDayLabel()
        layoutAllDayEvents()
        layoutRegularEvents()

        // Скриваме тези евенти, които се пресичат с текущата часова линия:
        hideEventsClashingWithCurrentTime()
    }

    private func recalcAllDayHeightDynamically() {
        let groupedByDay = Dictionary(grouping: allDayLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }
        let maxEvents = groupedByDay.values.map { $0.count }.max() ?? 0
        if maxEvents <= 1 {
            allDayHeight = 40
        } else {
            let rowHeight: CGFloat = 24
            let base: CGFloat = 10
            allDayHeight = base + (rowHeight * CGFloat(maxEvents))
        }
    }

    private func layoutAllDayBackground() {
        let x = leadingInsetForHours
        let w = dayColumnWidth * 7
        allDayBackground.frame = CGRect(x: x, y: 0, width: w, height: allDayHeight)
    }

    private func layoutAllDayLabel() {
        let labelWidth = leadingInsetForHours
        allDayLabel.frame = CGRect(x: 0, y: 0,
                                   width: labelWidth,
                                   height: allDayHeight)
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
                v.frame = CGRect(x: x, y: y, width: w, height: h)
                v.updateWithDescriptor(event: attr.descriptor)
            }
        }
    }

    private func layoutRegularEvents() {
        // 1) Групираме по ден
        let groupedByDay = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }

        var usedEventViewIndex = 0

        for dayIndex in 0..<7 {
            guard let eventsForDay = groupedByDay[dayIndex], !eventsForDay.isEmpty else { continue }

            // 2) Сортираме по начален час
            let sorted = eventsForDay.sorted {
                $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start
            }

            // 3) Подреждаме в колони, за да не се застъпват
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

            // 4) Изчисляваме размери
            let numberOfColumns = CGFloat(columns.count)
            let columnWidth = (dayColumnWidth - style.eventGap * 2) / numberOfColumns

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

                    let topOffset = allDayHeight
                    let finalY = yStart + topOffset
                    let w = columnWidth - style.eventGap
                    let h = (yEnd - yStart) - style.eventGap

                    let evView = ensureRegularEventView(index: usedEventViewIndex)
                    usedEventViewIndex += 1

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

    // MARK: - Скриване на евентите, които се „застъпват“ с текущата часова линия
    private func hideEventsClashingWithCurrentTime() {
        let now = Date()
        // Проверяваме дали "днес" е в седмицата; ако не е, директно връщаме
        guard let dayIndex = dayIndexIfInCurrentWeek(now) else {
            return
        }

        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: now))
        let minute = CGFloat(cal.component(.minute, from: now))
        let fraction = hour + minute/60.0

        // y-координатата на текущия час
        let yNow = allDayHeight + fraction * hourHeight

        // Преценяме X‑координатите на колоната за текущия ден
        let dayX = leadingInsetForHours + CGFloat(dayIndex)*dayColumnWidth

        // Правим "линията" като тънък правоъгълник (висок 2 pt)
        let lineRect = CGRect(x: dayX, y: yNow - 1,
                              width: dayColumnWidth,
                              height: 2)

        // 1) Скриваме/показваме regular евентите
        for evView in eventViews {
            if evView.frame.intersects(lineRect) {
                evView.isHidden = true
            } else {
                evView.isHidden = false
            }
        }

        // 2) Ако искате да скривате и all-day евентите:
        for adView in allDayEventViews {
            if adView.frame.intersects(lineRect) {
                adView.isHidden = true
            } else {
                adView.isHidden = false
            }
        }
    }

    // MARK: - draw(_:)
    /// Рисуваме разделителните линии + current time line (само в текущия ден).
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let totalWidth = leadingInsetForHours + dayColumnWidth*7
        let normalZoneTop = allDayHeight

        // 1) Хоризонтални линии (0..24)
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

        // 2) Вертикална линия при leadingInsetForHours
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        ctx.strokePath()
        ctx.restoreGState()

        // 3) Вертикални линии за всяка колона (ден)
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        for i in 0...7 {
            let colX = leadingInsetForHours + CGFloat(i)*dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: bounds.height))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // 4) Рисуваме current time line само в текущия ден
        drawCurrentTimeLineForCurrentDay(ctx: ctx)
    }

    private func drawCurrentTimeLineForCurrentDay(ctx: CGContext) {
        let now = Date()
        guard let dayIndex = dayIndexIfInCurrentWeek(now) else {
            // ако не е в седмицата => не рисуваме
            return
        }

        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: now))
        let minute = CGFloat(cal.component(.minute, from: now))
        let fraction = hour + minute/60.0

        let yNow = allDayHeight + fraction * hourHeight

        let totalLeftX = leadingInsetForHours
        let totalRightX = leadingInsetForHours + dayColumnWidth*7

        let currentDayX  = leadingInsetForHours + dayColumnWidth * CGFloat(dayIndex)
        let currentDayX2 = currentDayX + dayColumnWidth

        // По желание: полупрозрачна линия в предишните колони
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

        // Плътна линия върху текущия ден
        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)
        ctx.beginPath()
        ctx.move(to: CGPoint(x: currentDayX,  y: yNow))
        ctx.addLine(to: CGPoint(x: currentDayX2, y: yNow))
        ctx.strokePath()
        ctx.restoreGState()

        // Полупрозрачна линия в следващите колони (ако желаете)
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

    /// Проверка дали `date` попада в [startOfWeek .. startOfWeek+7 дни).
    private func dayIndexIfInCurrentWeek(_ date: Date) -> Int? {
        let cal = Calendar.current
        let startOnly = startOfWeek.dateOnly(calendar: cal)
        let endOfWeek = cal.date(byAdding: .day, value: 7, to: startOnly)!
        if date >= startOnly && date < endOfWeek {
            let comps = cal.dateComponents([.day], from: startOnly, to: date)
            let d = comps.day ?? 0
            if d >= 0 && d < 7 {
                return d
            }
        }
        return nil
    }

    private func dayIndexFor(_ date: Date) -> Int {
        let cal = Calendar.current
        let startOnly = startOfWeek.dateOnly(calendar: cal)
        let eventOnly = date.dateOnly(calendar: cal)
        let comps = cal.dateComponents([.day], from: startOnly, to: eventOnly)
        return comps.day ?? 0
    }

    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return (hour + minute/60)*hourHeight
    }
}

// MARK: - TwoWayPinnedWeekContainerView
/// Контейнер, който:
///  - има navBar (горе) с бутони <, > и заглавие
///  - горен daysHeaderScrollView (X-only) + DaysHeaderView
///  - ляв hoursColumnScrollView (Y-only) + HoursColumnView
///  - mainScrollView (двупосочен) + WeekTimelineViewNonOverlapping
/// При скрол: offset.x -> daysHeaderScrollView, offset.y -> hoursColumnScrollView.
///
/// + Добавяме setNeedsLayout() в didSet на startOfWeek, за да се „занулява“ червената линия, ако вече не сме в текущата седмица.
public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let navBarHeight: CGFloat = 40
    private let daysHeaderHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 70

    // Горна лента
    private let navBar = UIView()
    private let prevWeekButton = UIButton(type: .system)
    private let nextWeekButton = UIButton(type: .system)
    private let currentWeekLabel = UILabel()

    // Days Header
    private let cornerView = UIView()
    private let daysHeaderScrollView = UIScrollView()
    private let daysHeaderView = DaysHeaderView()

    // Лява колона (часове)
    private let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()

    // Основен скрол
    private let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    // Текущо зададена начална дата на седмицата
    public var startOfWeek: Date = Date() {
        didSet {
            daysHeaderView.startOfWeek = startOfWeek
            weekView.startOfWeek       = startOfWeek
            updateWeekLabel()

            // Принудително преизчертаване:
            setNeedsLayout()
            layoutIfNeeded()
        }
    }

    /// Callback, който се вика при натискане на бутоните < или >
    public var onWeekChange: ((Date) -> Void)?

    // MARK: - Инициализация
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
    }

    // MARK: - setupViews()
    private func setupViews() {
        backgroundColor = .systemBackground

        // (1) Горна „navBar“
        navBar.backgroundColor = .secondarySystemBackground
        addSubview(navBar)

        // Бутон <
        prevWeekButton.setTitle("<", for: .normal)
        prevWeekButton.addTarget(self, action: #selector(didTapPrevWeek), for: .touchUpInside)
        navBar.addSubview(prevWeekButton)

        // Бутон >
        nextWeekButton.setTitle(">", for: .normal)
        nextWeekButton.addTarget(self, action: #selector(didTapNextWeek), for: .touchUpInside)
        navBar.addSubview(nextWeekButton)

        // Label, показващ диапазона на седмицата
        currentWeekLabel.font = .boldSystemFont(ofSize: 14)
        currentWeekLabel.textAlignment = .center
        navBar.addSubview(currentWeekLabel)

        // (2) DaysHeader (Mon, Tue...)
        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)

        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        // (3) Лява колона с часове
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        // (4) MainScrollView + WeekTimelineView (двупосочен скрол)
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // (5) Настройки
        daysHeaderView.leadingInsetForHours = leftColumnWidth
        daysHeaderView.dayColumnWidth = 100

        weekView.leadingInsetForHours = leftColumnWidth
        weekView.dayColumnWidth = 100
        weekView.hourHeight = 50
        weekView.allDayHeight = 40
        weekView.autoResizeAllDayHeight = true

        hoursColumnView.hourHeight = 50
    }

    // MARK: - Layout
    public override func layoutSubviews() {
        super.layoutSubviews()

        // (1) navBar
        navBar.frame = CGRect(
            x: 0, y: 0,
            width: bounds.width,
            height: navBarHeight
        )
        let btnW: CGFloat = 44
        prevWeekButton.frame = CGRect(x: 8, y: 0, width: btnW, height: navBarHeight)
        nextWeekButton.frame = CGRect(
            x: navBar.bounds.width - btnW - 8,
            y: 0,
            width: btnW,
            height: navBarHeight
        )
        currentWeekLabel.frame = CGRect(
            x: prevWeekButton.frame.maxX,
            y: 0,
            width: nextWeekButton.frame.minX - prevWeekButton.frame.maxX,
            height: navBarHeight
        )

        // (2) Лента с дните
        cornerView.frame = CGRect(
            x: 0,
            y: navBarHeight,
            width: leftColumnWidth,
            height: daysHeaderHeight
        )
        daysHeaderScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: navBarHeight,
            width: bounds.width - leftColumnWidth,
            height: daysHeaderHeight
        )
        let totalDaysHeaderWidth: CGFloat =
            daysHeaderView.leadingInsetForHours + 7*daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(
            width: totalDaysHeaderWidth - leftColumnWidth,
            height: daysHeaderHeight
        )
        daysHeaderView.frame = CGRect(
            x: 0,
            y: 0,
            width: totalDaysHeaderWidth,
            height: daysHeaderHeight
        )

        // (3) MainScrollView + HoursColumn
        let yMain = navBarHeight + daysHeaderHeight
        mainScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: yMain,
            width: bounds.width - leftColumnWidth,
            height: bounds.height - yMain
        )
        hoursColumnScrollView.frame = CGRect(
            x: 0,
            y: yMain,
            width: leftColumnWidth,
            height: bounds.height - yMain
        )

        let totalWidth = weekView.leadingInsetForHours + 7 * weekView.dayColumnWidth
        let totalHeight = weekView.allDayHeight + 24 * weekView.hourHeight

        mainScrollView.contentSize = CGSize(width: totalWidth, height: totalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: totalHeight)

        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: totalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: totalHeight)
        hoursColumnView.topOffset = weekView.allDayHeight

        bringSubviewToFront(hoursColumnScrollView)
        bringSubviewToFront(cornerView)

        // Указваме на лявата колона дали днешният ден е в седмицата и кой е currentTime
        let now = Date()
        let inWeek = (dayIndexIfInCurrentWeek(now) != nil)
        hoursColumnView.isCurrentDayInWeek = inWeek
        hoursColumnView.currentTime = inWeek ? now : nil
    }

    // MARK: - Скрол делегат
    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }

    // MARK: - Бутоните
    @objc private func didTapPrevWeek() {
        guard let newDate = Calendar.current.date(byAdding: .day, value: -7, to: startOfWeek) else { return }
        startOfWeek = newDate
        onWeekChange?(newDate)
    }

    @objc private func didTapNextWeek() {
        guard let newDate = Calendar.current.date(byAdding: .day, value: 7, to: startOfWeek) else { return }
        startOfWeek = newDate
        onWeekChange?(newDate)
    }

    // MARK: - Помощни
    private func updateWeekLabel() {
        let cal = Calendar.current
        let endOfWeek = cal.date(byAdding: .day, value: 6, to: startOfWeek) ?? startOfWeek
        let df = DateFormatter()
        df.dateFormat = "d MMM"

        let startStr = df.string(from: startOfWeek)
        let endStr   = df.string(from: endOfWeek)
        currentWeekLabel.text = "\(startStr) - \(endStr)"
    }

    /// Връща индекс [0..6], ако днешният ден попада в диапазона startOfWeek..+7 дни.
    private func dayIndexIfInCurrentWeek(_ date: Date) -> Int? {
        let cal = Calendar.current
        let startOnly = startOfWeek.dateOnly(calendar: cal)
        let endOfWeek = cal.date(byAdding: .day, value: 7, to: startOnly)!
        if date >= startOnly && date < endOfWeek {
            let comps = cal.dateComponents([.day], from: startOnly, to: date)
            let d = comps.day ?? 0
            if d >= 0 && d < 7 {
                return d
            }
        }
        return nil
    }
}

// MARK: - TimelineStyle
public struct TimelineStyle {
    public var backgroundColor = UIColor.white
    public var separatorColor = UIColor.lightGray
    public var timeColor = UIColor.darkGray
    public var font = UIFont.boldSystemFont(ofSize: 12)
    public var verticalInset: CGFloat = 2
    public var eventGap: CGFloat = 2
    public init() {}
}

