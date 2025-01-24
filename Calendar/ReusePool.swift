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
/// Лява колона (часове). Рисува 00:00..23:00/24:00 по вертикала,
/// вече в 12‐часов (AM/PM) формат, + topOffset за all-day зоната.
public final class HoursColumnView: UIView {
    public var hourHeight: CGFloat = 50
    public var font = UIFont.systemFont(ofSize: 12, weight: .medium)

    /// Изместване надолу (ако имаме all-day) – така 00:00 да е под all-day евентите
    public var topOffset: CGFloat = 0

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

        let attrs: [NSAttributedString.Key: Any] = [
            .foregroundColor: UIColor.label,
            .font: font
        ]

        // Подготвяме DateFormatter за AM/PM
        let dateFormatter = DateFormatter()
        // Примерен формат: "h:00 a" => "12:00 AM", "1:00 AM", "1:00 PM", ...
        dateFormatter.dateFormat = "h:00 a"

        // За да можем да добавим часове от 0 до 24, си взимаме "baseDate"
        let cal = Calendar.current
        let baseDate = cal.startOfDay(for: Date()) // произволна дата, само за да форматираме часа

        for hour in 0...24 {
            let y = topOffset + CGFloat(hour)*hourHeight

            // Правим date = "baseDate + hour часа"
            if let date = cal.date(byAdding: .hour, value: hour, to: baseDate) {
                let text = dateFormatter.string(from: date) // "12:00 AM", "1:00 AM"...
                text.draw(at: CGPoint(x: 8, y: y - 6), withAttributes: attrs)
            }
        }
    }
}

// MARK: - WeekTimelineViewNonOverlapping
/// Цялата седмична зона (all-day най-горе, после редовни евенти).
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

    // MARK: - Private UI
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

        // 1) Динамично (по желание) коригираме allDayHeight
        if autoResizeAllDayHeight {
            recalcAllDayHeightDynamically()
        }

        // 2) Подреждаме
        layoutAllDayBackground()
        layoutAllDayLabel()
        layoutAllDayEvents()
        layoutRegularEvents()
    }

    private func recalcAllDayHeightDynamically() {
        let groupedByDay = Dictionary(grouping: allDayLayoutAttributes, by: { dayIndexFor($0.descriptor.dateInterval.start) })
        let maxEventsInADay = groupedByDay.values.map({ $0.count }).max() ?? 0
        if maxEventsInADay <= 1 {
            allDayHeight = 40
        } else {
            let rowHeight: CGFloat = 24
            let base: CGFloat = 10
            allDayHeight = base + (rowHeight * CGFloat(maxEventsInADay))
        }
    }

    // MARK: - Layout All-day zone
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
        let grouped = Dictionary(grouping: allDayLayoutAttributes, by: { dayIndexFor($0.descriptor.dateInterval.start) })

        // rowHeight за всяко all-day event
        let groupedCount = grouped.values.map { $0.count }.max() ?? 1
        let base: CGFloat = 10
        let rowHeight = max(24, (allDayHeight - base) / CGFloat(groupedCount))

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

    // MARK: - Разпределяне на редовните събития (не се застъпват)
    private func layoutRegularEvents() {
        // 1) Групираме по ден
        let groupedByDay = Dictionary(grouping: regularLayoutAttributes) {
            dayIndexFor($0.descriptor.dateInterval.start)
        }

        // Ще броим колко EventView сме "изнесли" (reused) до момента
        var usedEventViewIndex = 0

        // 2) За всеки ден подреждаме събитията
        for dayIndex in 0..<7 {
            guard let eventsForDay = groupedByDay[dayIndex], !eventsForDay.isEmpty else { continue }

            // 2.1) Сортираме по начален час
            let sorted = eventsForDay.sorted {
                $0.descriptor.dateInterval.start < $1.descriptor.dateInterval.start
            }

            // 2.2) Разпределяме в под-колони
            var columns: [[EventLayoutAttributes]] = []
            for attr in sorted {
                let start = attr.descriptor.dateInterval.start
                let end   = attr.descriptor.dateInterval.end

                // Опитваме да намерим първата колона без застъпване
                var placed = false
                for c in 0..<columns.count {
                    if !isOverlapping(attr, in: columns[c]) {
                        columns[c].append(attr)
                        placed = true
                        break
                    }
                }
                // Ако не успяхме - отваряме нова
                if !placed {
                    columns.append([attr])
                }
            }

            let numberOfColumns = CGFloat(columns.count)
            let columnWidth = (dayColumnWidth - style.eventGap * 2) / numberOfColumns

            // 2.4) Изчисляваме frames
            for (colIndex, columnEvents) in columns.enumerated() {
                for attr in columnEvents {
                    let start = attr.descriptor.dateInterval.start
                    let end   = attr.descriptor.dateInterval.end

                    let yStart = dateToY(start)
                    let yEnd   = dateToY(end)

                    let x = leadingInsetForHours
                            + CGFloat(dayIndex) * dayColumnWidth
                            + style.eventGap
                            + columnWidth * CGFloat(colIndex)

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

    /// Проверка дали даден нов евент (`candidate`) се застъпва с някое вече в `columnEvents`.
    private func isOverlapping(
        _ candidate: EventLayoutAttributes,
        in columnEvents: [EventLayoutAttributes]) -> Bool
    {
        let candStart = candidate.descriptor.dateInterval.start
        let candEnd   = candidate.descriptor.dateInterval.end

        for ev in columnEvents {
            let evStart = ev.descriptor.dateInterval.start
            let evEnd   = ev.descriptor.dateInterval.end
            // Ако [candStart..candEnd) и [evStart..evEnd) се застъпват:
            if evStart < candEnd && candStart < evEnd {
                return true
            }
        }
        return false
    }

    // MARK: - draw(_:)
    /// Рисуваме линиите за часа/ден + current time line, ако днешната дата е в седмицата.
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

        // 2) Вертикалната линия при leadingInsetForHours
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

        // 4) Рисуваме "current time line" през ВСИЧКИ дни, ако днес е в седмицата
        let now = Date()
        if dayIndexIfInCurrentWeek(now) != nil {
            drawCurrentTimeLineAcrossAllDays(ctx: ctx, now: now)
        }
    }

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

    /// Червена линия, минаваща от колоната с часовете до края (всичките 7 дни),
    /// + червена точка + надпис с часа (напр. "3:54 PM") вляво от точката.
    private func drawCurrentTimeLineAcrossAllDays(ctx: CGContext, now: Date) {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: now))
        let minute = CGFloat(cal.component(.minute, from: now))
        let fraction = hour + minute/60.0

        let yNow = allDayHeight + fraction * hourHeight

        let leftX = leadingInsetForHours
        let rightX = leadingInsetForHours + dayColumnWidth*7

        ctx.saveGState()
        ctx.setStrokeColor(UIColor.systemRed.cgColor)
        ctx.setLineWidth(1.5)

        // 1) Хоризонтална червена линия
        ctx.beginPath()
        ctx.move(to: CGPoint(x: leftX,  y: yNow))
        ctx.addLine(to: CGPoint(x: rightX, y: yNow))
        ctx.strokePath()

        // 2) Червена точка в началото (leftX, yNow)
        let radius: CGFloat = 4
        let center = CGPoint(x: leftX, y: yNow)
        ctx.setFillColor(UIColor.systemRed.cgColor)
        ctx.fillEllipse(in: CGRect(
            x: center.x - radius,
            y: center.y - radius,
            width: 2*radius,
            height: 2*radius))

        // 3) Часът като текст (например "3:54 PM")
        let dateFormatter = DateFormatter()
        dateFormatter.timeStyle = .short  // "3:54 PM" (12-часово)
        let currentTimeString = dateFormatter.string(from: now)

        let timeAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 12, weight: .bold),
            .foregroundColor: UIColor.systemRed
        ]
        let textSize = currentTimeString.size(withAttributes: timeAttrs)
        // Рисуваме надписа малко вляво от точката
        let textX = center.x - textSize.width - 6
        let textY = center.y - textSize.height/2
        let textRect = CGRect(x: textX, y: textY, width: textSize.width, height: textSize.height)

        currentTimeString.draw(in: textRect, withAttributes: timeAttrs)

        ctx.restoreGState()
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
///  - има daysHeaderScrollView (горе, X-only) + DaysHeaderView
///  - има hoursColumnScrollView (вляво, Y-only) + HoursColumnView
///  - има mainScrollView (двупосочен) + WeekTimelineViewNonOverlapping
///  - cornerView (горе-ляво) - „ъгъл“ между двете.
/// При скрол: offset.x -> daysHeaderScrollView, offset.y -> hoursColumnScrollView.
import UIKit
import CalendarKit

/// UIView, което показва:
/// - Горен „navBar“ (бутони <, > + Label)
/// - DaysHeader + лява колона (hours)
/// - Основна зона (двупосочен скрол) за WeekTimelineViewNonOverlapping.
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
    private let hoursColumnView = HoursColumnView()

    // Основен скрол
    private let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    // Текущо зададена начална дата на седмицата
    public var startOfWeek: Date = Date() {
        didSet {
            daysHeaderView.startOfWeek = startOfWeek
            weekView.startOfWeek = startOfWeek
            updateWeekLabel()
        }
    }

    /// Callback, който викаме при натискане на бутоните < или >
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

    // Конфигуриране на всички под-изгледи
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

        // По желание – да започваме от понеделник на текущата седмица:
        self.startOfWeek = findMonday(for: Date())
    }

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

    /// Връща понеделника на седмицата, в която попада дадена дата
    private func findMonday(for date: Date) -> Date {
        let cal = Calendar.current
        let weekday = cal.component(.weekday, from: date) // 1=Sun,2=Mon,...
        let diff = (weekday == 1) ? 6 : weekday - 2
        return cal.date(byAdding: .day, value: -diff, to: cal.startOfDay(for: date))!
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

import SwiftUI
import CalendarKit
import EventKit

/// SwiftUI обвивка, която създава TwoWayPinnedWeekContainerView (UIKit)
/// и позволява лесно да му подадем:
///   - startOfWeek (Binding)
///   - масив от EventDescriptor
/// Когато потребителят натисне бутон < или >, вика onWeekChange и ние можем да презаредим събитията.
public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    // Параметри, които идват отвън (или от някакъв ViewModel)
    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]

    // Може да имате и eventStore тук, ако искате директно да fetch-вате
    let localEventStore = EKEventStore()

    public init(startOfWeek: Binding<Date>, events: Binding<[EventDescriptor]>) {
        self._startOfWeek = startOfWeek
        self._events = events
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()

        // 1) Създаваме TwoWayPinnedWeekContainerView
        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // 2) Задаваме начални събития (изчиствайки старите)
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // 3) Когато сменим седмицата от бутоните, извикваме onWeekChange
        container.onWeekChange = { newStartDate in
            // (а) сменяме @Binding startOfWeek -> това ще влезе в updateUIViewController
            self.startOfWeek = newStartDate

            // (б) Тук можем директно да fetch-нем новите събития и да ги зададем.
            //     Примерно, ако искате [newStartDate..+7дни]:
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let predicate = self.localEventStore.predicateForEvents(withStart: newStartDate, end: endOfWeek, calendars: nil)
            let found = self.localEventStore.events(matching: predicate)
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }

            // (в) Обновяваме @Binding events (ако искаме да ги пазим в SwiftUI)
            self.events = wrappers

            // (г) Слагаме ги във view-то
            let (ad, reg) = splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }

            // (д) Принудително layout, за да се рефрешне
            container.setNeedsLayout()
            container.layoutIfNeeded()
        }

        // Слагаме го във VC
        vc.view.addSubview(container)
        container.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            container.topAnchor.constraint(equalTo: vc.view.topAnchor),
            container.leadingAnchor.constraint(equalTo: vc.view.leadingAnchor),
            container.trailingAnchor.constraint(equalTo: vc.view.trailingAnchor),
            container.bottomAnchor.constraint(equalTo: vc.view.bottomAnchor),
        ])

        return vc
    }

    public func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        // Ако SwiftUI смени startOfWeek или events, рефрешваме.
        guard let container = uiViewController.view.subviews.first(where: { $0 is TwoWayPinnedWeekContainerView }) as? TwoWayPinnedWeekContainerView else {
            return
        }

        // (1) Обновяваме startOfWeek
        container.startOfWeek = startOfWeek

        // (2) Обновяваме списъка със събития
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        container.setNeedsLayout()
        container.layoutIfNeeded()
    }

    // Разделя евентите на allDay / редовни
    private func splitAllDay(_ evts: [EventDescriptor]) -> ([EventDescriptor], [EventDescriptor]) {
        var allDay = [EventDescriptor]()
        var regular = [EventDescriptor]()
        for e in evts {
            if e.isAllDay {
                allDay.append(e)
            } else {
                regular.append(e)
            }
        }
        return (allDay, regular)
    }
}
