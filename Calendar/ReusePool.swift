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
public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let topBarHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 70  // Достатъчно да се вижда текстът

    private let mainScrollView = UIScrollView()
    private let daysHeaderScrollView = UIScrollView()
    private let hoursColumnScrollView = UIScrollView()

    private let daysHeaderView = DaysHeaderView()
    private let hoursColumnView = HoursColumnView()
    private let cornerView = UIView()

    public let weekView = WeekTimelineViewNonOverlapping()

    public var startOfWeek: Date = Date() {
        didSet {
            daysHeaderView.startOfWeek = startOfWeek
            weekView.startOfWeek = startOfWeek
        }
    }

    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
    }

    private func setupViews() {
        backgroundColor = .systemBackground

        // Ъгъл горе-ляво (малкото сиво квадратче)
        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)

        // DaysHeaderScrollView (най-горе)
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        // HoursColumnScrollView (най-вляво)
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        // mainScrollView (вътрешна зона за хоризонтален + вертикален скрол)
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // Синхронизираме параметрите
        daysHeaderView.leadingInsetForHours = leftColumnWidth
        weekView.leadingInsetForHours = leftColumnWidth

        daysHeaderView.dayColumnWidth = 100
        weekView.dayColumnWidth = 100

        hoursColumnView.hourHeight = 50
        weekView.hourHeight = 50

        // Стартираме от понеделник на текущата седмица
        let monday = findMonday(for: Date())
        self.startOfWeek = monday
    }

    private func findMonday(for date: Date) -> Date {
        let cal = Calendar.current
        let weekday = cal.component(.weekday, from: date)
        // weekday: 1=Sunday, 2=Monday, ...
        let diff = (weekday == 1) ? 6 : weekday - 2
        return cal.date(byAdding: .day, value: -diff, to: cal.startOfDay(for: date))!
    }

    public override func layoutSubviews() {
        super.layoutSubviews()

        cornerView.frame = CGRect(
            x: 0,
            y: 0,
            width: leftColumnWidth,
            height: topBarHeight
        )

        // DaysHeader (горе)
        daysHeaderScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: 0,
            width: bounds.width - leftColumnWidth,
            height: topBarHeight
        )

        // HoursColumn (вляво)
        hoursColumnScrollView.frame = CGRect(
            x: 0,
            y: topBarHeight,
            width: leftColumnWidth,
            height: bounds.height - topBarHeight
        )

        // mainScrollView (двупосочен) – започва след лявата колона
        mainScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: topBarHeight,
            width: bounds.width - leftColumnWidth,
            height: bounds.height - topBarHeight
        )

        // Пресмятаме общите размери спрямо 7 дни + 24 часа
        let totalWidth = weekView.leadingInsetForHours + 7 * weekView.dayColumnWidth
        let totalHeight = weekView.allDayHeight + 24 * weekView.hourHeight

        // mainScrollView content
        mainScrollView.contentSize = CGSize(width: totalWidth, height: totalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: totalHeight)

        // Изместваме часовете надолу, колкото е allDayHeight
        hoursColumnView.topOffset = weekView.allDayHeight

        // Съдържание на hoursColumnScrollView
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: totalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: totalHeight)

        // daysHeaderScrollView
        daysHeaderScrollView.contentSize = CGSize(width: totalWidth - leftColumnWidth, height: topBarHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: topBarHeight)

        // Винаги изкарваме колоната с часовете и cornerView най-отгоре
        bringSubviewToFront(hoursColumnScrollView)
        bringSubviewToFront(cornerView)
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            // Свързваме X-offset -> daysHeaderScrollView
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            // Свързваме Y-offset -> hoursColumnScrollView
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
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

// MARK: - SwiftUI обвивка (опционално)
import SwiftUI
import CalendarKit

public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {
    public let startOfWeek: Date
    public let events: [EventDescriptor]

    public init(startOfWeek: Date, events: [EventDescriptor]) {
        self.startOfWeek = startOfWeek
        self.events = events
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()
        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // Настройка на weekView
        let wv = container.weekView
        wv.style.separatorColor = .lightGray
        wv.style.timeColor = .darkGray
        wv.leadingInsetForHours = 70
        wv.dayColumnWidth = 100
        wv.hourHeight = 50
        wv.allDayHeight = 40
        wv.autoResizeAllDayHeight = true

        // Зареждаме събития
        let (allDay, regular) = splitAllDay(events)
        wv.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        wv.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

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
        if let container = uiViewController.view.subviews.first(where: { $0 is TwoWayPinnedWeekContainerView }) as? TwoWayPinnedWeekContainerView {
            container.startOfWeek = startOfWeek
            let wv = container.weekView

            let (allDay, regular) = splitAllDay(events)
            wv.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
            wv.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }
        }
    }

    /// Разделяме на all-day срещу редовни.
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
