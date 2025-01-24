import UIKit
import CalendarKit

// MARK: - DaysHeaderView
/// Горна лента с 7 label‑а (Mon 1, Tue 2...), всеки започва при x = leadingInsetForHours + i*dayColumnWidth,
/// за да съвпадне с колоните в timeline.
public final class DaysHeaderView: UIView {

    public var dayColumnWidth: CGFloat = 100
    public var leadingInsetForHours: CGFloat = 53

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
        for (i, lbl) in labels.enumerated() {
            if let dayDate = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                lbl.text = df.string(from: dayDate)
            } else {
                lbl.text = "??"
            }
        }
    }
}

// MARK: - HoursColumnView
/// Лява колона (часове). Рисува 00:00..23:00 по vertical
public final class HoursColumnView: UIView {
    public var hourHeight: CGFloat = 50
    public var font = UIFont.systemFont(ofSize: 12, weight: .medium)

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
        ctx.interpolationQuality = .none

        let attrs: [NSAttributedString.Key: Any] = [
            .foregroundColor: UIColor.label,
            .font: font
        ]
        for hour in 0...24 {
            let y = CGFloat(hour)*hourHeight
            let text = String(format: "%02d:00", hour)
            text.draw(at: CGPoint(x: 8, y: y - 6), withAttributes: attrs)
        }
    }
}

public final class WeekTimelineViewNonOverlapping: UIView {

    /// Начална дата (например понеделник)
    public var startOfWeek: Date = Date()

    /// Визуален стил
    public var style = TimelineStyle()

    /// Отстъп вляво (за колоната с часове)
    public var leadingInsetForHours: CGFloat = 53

    /// Ширина за 1 ден
    public var dayColumnWidth: CGFloat = 100

    /// Височина на един час (в редовната част)
    public var hourHeight: CGFloat = 50

    /// Височина на all-day зоната.
    /// **Вече** ще я изчисляваме динамично според това колко all-day events имаме в даден ден.
    /// Но може и да зададете статична стойност, ако желаете.
    public var allDayHeight: CGFloat = 40

    /// All-day и редовни събития
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet { setNeedsLayout() }
    }

    /// Ако искате автоматично да увеличавате allDayHeight според броя all-day събития
    public var autoResizeAllDayHeight = true

    // MARK: - Private UI
    private let allDayBackground = UIView()
    private let allDayLabel = UILabel()

    // Списъци за actual EventView
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
        //    според броя all-day събития на всеки ден
        if autoResizeAllDayHeight {
            recalcAllDayHeightDynamically()
        }

        // 2) Подреждаме subviews
        layoutAllDayBackground()
        layoutAllDayLabel()
        layoutAllDayEvents()
        layoutRegularEvents()
    }

    /// Изчисляваме колко all-day събития има за всеки ден,
    /// взимаме най-голямата бройка, умножаваме по `rowHeight` => allDayHeight
    private func recalcAllDayHeightDynamically() {
        // Групираме allDayLayoutAttributes по ден от седмицата (dayIndex)
        let groupedByDay = Dictionary(grouping: allDayLayoutAttributes, by: { dayIndexFor($0.descriptor.dateInterval.start) })

        // Намираме най-големия брой all-day събития за някой ден
        let maxEventsInADay = groupedByDay.values.map({ $0.count }).max() ?? 0
        if maxEventsInADay <= 1 {
            // Ако за всеки ден имаме 0 или 1 събитие,
            // оставяме минимална височина (примерно 40).
            allDayHeight = 40
        } else {
            // rowHeight за 1 all-day събитие
            let rowHeight: CGFloat = 24
            // Допълнителен top/bottom space?
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

    /// Сега подреждаме allDay events в „редове“.
    /// 1) Групираме по dayIndex
    /// 2) Всеки event се поставя на rowIndex * rowHeight
    private func layoutAllDayEvents() {
        // 1) Групираме
        let grouped = Dictionary(grouping: allDayLayoutAttributes, by: { dayIndexFor($0.descriptor.dateInterval.start) })

        // rowHeight за всяко all-day event
        let rowHeight: CGFloat = max(24, (allDayHeight - 5) / 2)
        // Но ако ползвате recalcAllDayHeightDynamically, rowHeight
        // може да е = (allDayHeight - base)/maxEventsInADay

        // Изчистете/скрийте стари views, ако old count > new count
        // Но тук за простота просто не го трием.

        var usedIndex = 0 // eventView index

        for dayIndex in 0..<7 {
            let dayEvents = grouped[dayIndex] ?? []
            for (i, attr) in dayEvents.enumerated() {
                // i е редът в този ден
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

    // MARK: - Layout regular events
    private func layoutRegularEvents() {
        for (i, attr) in regularLayoutAttributes.enumerated() {
            let start = attr.descriptor.dateInterval.start
            let end   = attr.descriptor.dateInterval.end
            let dayIndex = dayIndexFor(start)

            let yStart = dateToY(start)
            let yEnd   = dateToY(end)

            let x = leadingInsetForHours + CGFloat(dayIndex)*dayColumnWidth + style.eventGap
            let topOffset = allDayHeight
            let finalY = yStart + topOffset
            let w = dayColumnWidth - style.eventGap*2
            let h = (yEnd - yStart) - style.eventGap

            let evView = ensureRegularEventView(index: i)
            evView.frame = CGRect(x: x, y: finalY, width: w, height: h)
            evView.updateWithDescriptor(event: attr.descriptor)
        }
    }

    // MARK: - draw(_:)
    /// Рисуваме хоризонтални линии за часа, + вертикални линии за дните
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
///  - cornerView (горе-ляво).
/// При скрол: offset.x -> daysHeaderScrollView, offset.y -> hoursColumnScrollView.
/// Така all-day евентите ще съвпаднат с колоните, защото formula за x е еднаква.
public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let topBarHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 53

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

        // ъгъл горе-ляво
        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)

        // DaysHeaderScrollView
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        // HoursColumnScrollView
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        // mainScrollView
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // За да няма разминаване:
        // И daysHeaderView, и weekView ползват еднакъв leadingInsetForHours
        daysHeaderView.leadingInsetForHours = leftColumnWidth
        weekView.leadingInsetForHours = leftColumnWidth

        daysHeaderView.dayColumnWidth = 100
        weekView.dayColumnWidth = 100

        hoursColumnView.hourHeight = 50
        weekView.hourHeight = 50

        let monday = findMonday(for: Date())
        self.startOfWeek = monday
    }

    private func findMonday(for date: Date) -> Date {
        let cal = Calendar.current
        let weekday = cal.component(.weekday, from: date)
        let diff = (weekday == 1) ? 6 : weekday - 2
        return cal.date(byAdding: .day, value: -diff, to: cal.startOfDay(for: date))!
    }

    public override func layoutSubviews() {
        super.layoutSubviews()

        cornerView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: topBarHeight)

        // DaysHeader
        daysHeaderScrollView.frame = CGRect(x: leftColumnWidth, y: 0,
                                            width: bounds.width - leftColumnWidth,
                                            height: topBarHeight)

        // HoursColumn
        hoursColumnScrollView.frame = CGRect(x: 0, y: topBarHeight,
                                             width: leftColumnWidth,
                                             height: bounds.height - topBarHeight)

        // mainScrollView
        mainScrollView.frame = CGRect(x: leftColumnWidth, y: topBarHeight,
                                      width: bounds.width - leftColumnWidth,
                                      height: bounds.height - topBarHeight)

        // contentSizes
        let w = weekView.leadingInsetForHours + 7*weekView.dayColumnWidth
        let h = weekView.allDayHeight + 24*weekView.hourHeight
        mainScrollView.contentSize = CGSize(width: w, height: h)
        weekView.frame = CGRect(x: 0, y: 0, width: w, height: h)

        // daysHeaderScrollView
        // ширината = w - leftColumnWidth (за scrolling)
        daysHeaderScrollView.contentSize = CGSize(width: w - leftColumnWidth, height: topBarHeight)
        // А самият daysHeaderView има width = w, за да включи leadingInsetForHours + 7*dayColumnWidth
        daysHeaderView.frame = CGRect(x: 0, y: 0, width: w, height: topBarHeight)

        // hoursColumnScrollView
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: h - topBarHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: h)

        daysHeaderView.setNeedsLayout()
        hoursColumnView.setNeedsDisplay()
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            // daysHeaderScrollView sync
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            // hoursColumnScrollView sync
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }
}

/// Примерен стил (както досега)
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
        wv.leadingInsetForHours = 53
        wv.dayColumnWidth = 100
        wv.hourHeight = 50
        wv.allDayHeight = 40

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
