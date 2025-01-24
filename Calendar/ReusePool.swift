import UIKit
import CalendarKit

// MARK: - DaysHeaderView
/// Горна лента с 7 етикета (Mon, Tue...), които започват след leadingInsetForHours.
/// Така е пригодено да съвпада с timeline, който рисува първата колона при x=leadingInsetForHours.
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
        // 7 label‑а за 7 дни
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
        // Първият ден започва на x = leadingInsetForHours
        // Вторият ден е x = leadingInsetForHours + dayColumnWidth, и т.н.
        for i in 0..<7 {
            let x = leadingInsetForHours + CGFloat(i)*dayColumnWidth
            labels[i].frame = CGRect(x: x, y: 0, width: dayColumnWidth, height: bounds.height)
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
/// Лявата колона, рисуваща 00:00..23:00 по вертикала.
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

        let textColor = UIColor.label
        let attrs: [NSAttributedString.Key: Any] = [
            .foregroundColor: textColor,
            .font: font
        ]
        for hour in 0...24 {
            let y = CGFloat(hour)*hourHeight
            let text = String(format: "%02d:00", hour)
            text.draw(at: CGPoint(x: 8, y: y - 6), withAttributes: attrs)
        }
    }
}

// MARK: - WeekTimelineViewNonOverlapping
/// Основният седмичен изглед (7 колони), all-day зона. Рисува:
/// - Хор. линии за часовете
/// - Вертикални линии за разделяне на дните
/// - Има allDayBackground + label
/// - Event-и (allDay и regular)
public final class WeekTimelineViewNonOverlapping: UIView {

    public var startOfWeek: Date = Date()
    public var style = TimelineStyle()

    /// Оставяме празно пространство вляво (leadingInsetForHours), където реално са часовете (в отделен pinned view).
    public var leadingInsetForHours: CGFloat = 53

    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50
    public var allDayHeight: CGFloat = 40

    public var allDayLayoutAttributes = [EventLayoutAttributes]()
    public var regularLayoutAttributes = [EventLayoutAttributes]()

    private let allDayBackground = UIView()
    private let allDayLabel = UILabel()

    // Кеш за EventView
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
        fatalError("init(coder:) not implemented")
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        layoutAllDayBackground()
        layoutAllDayLabel()
        layoutAllDayEvents()
        layoutRegularEvents()
    }

    private func layoutAllDayBackground() {
        let x = leadingInsetForHours
        let w = dayColumnWidth*7
        allDayBackground.frame = CGRect(x: x, y: 0, width: w, height: allDayHeight)
    }
    private func layoutAllDayLabel() {
        allDayLabel.frame = CGRect(x: 0, y: 0, width: leadingInsetForHours, height: allDayHeight)
    }

    private func layoutAllDayEvents() {
        for (i, attr) in allDayLayoutAttributes.enumerated() {
            let dayIndex = dayIndexFor(attr.descriptor.dateInterval.start)
            let x = leadingInsetForHours + CGFloat(dayIndex)*dayColumnWidth + style.eventGap
            let y = style.eventGap
            let w = dayColumnWidth - style.eventGap*2
            let h = allDayHeight - style.eventGap*2

            let evView = ensureAllDayEventView(index: i)
            evView.frame = CGRect(x: x, y: y, width: w, height: h)
            evView.updateWithDescriptor(event: attr.descriptor)
        }
    }

    private func layoutRegularEvents() {
        for (i, attr) in regularLayoutAttributes.enumerated() {
            let start = attr.descriptor.dateInterval.start
            let end = attr.descriptor.dateInterval.end
            let dayIndex = dayIndexFor(start)

            let yStart = dateToY(start)
            let yEnd = dateToY(end)
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

    // Чертаем хоризонтални линии за часовете, + вертикални линии за ден
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

        // Вертикална линия при leadingInsetForHours
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        ctx.strokePath()
        ctx.restoreGState()

        // Вертикални линии за всяка от 7-те колони
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.beginPath()
        // ако искате i в 1...6 за вътрешните, или 0...7 за всички
        for i in 0...7 {
            let colX = leadingInsetForHours + CGFloat(i)*dayColumnWidth
            ctx.move(to: CGPoint(x: colX, y: 0))
            ctx.addLine(to: CGPoint(x: colX, y: bounds.height))
        }
        ctx.strokePath()
        ctx.restoreGState()
    }

    // MARK: Helpers
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
///  - има cornerView (горе-ляво).
/// При скрол копира offset.x -> daysHeaderScrollView, offset.y -> hoursColumnScrollView.
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

        // cornerView
        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)

        // daysHeaderScrollView
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        // hoursColumnScrollView
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        // mainScrollView (потребителят тук скролва)
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.bounces = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // Примерни настройки, за да съвпада
        weekView.leadingInsetForHours = leftColumnWidth
        daysHeaderView.leadingInsetForHours = leftColumnWidth

        weekView.dayColumnWidth = 100
        daysHeaderView.dayColumnWidth = 100

        weekView.hourHeight = 50
        hoursColumnView.hourHeight = 50

        // зад. нач. седмица
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

        // daysHeaderScrollView
        daysHeaderScrollView.frame = CGRect(x: leftColumnWidth, y: 0,
                                            width: bounds.width - leftColumnWidth,
                                            height: topBarHeight)

        // hoursColumnScrollView
        hoursColumnScrollView.frame = CGRect(x: 0, y: topBarHeight,
                                             width: leftColumnWidth,
                                             height: bounds.height - topBarHeight)

        // mainScrollView
        mainScrollView.frame = CGRect(x: leftColumnWidth, y: topBarHeight,
                                      width: bounds.width - leftColumnWidth,
                                      height: bounds.height - topBarHeight)

        // Изчисляваме content size
        let w = weekView.leadingInsetForHours + 7*weekView.dayColumnWidth
        let h = weekView.allDayHeight + 24*weekView.hourHeight
        mainScrollView.contentSize = CGSize(width: w, height: h)
        weekView.frame = CGRect(x: 0, y: 0, width: w, height: h)

        // daysHeaderScrollView contentSize
        // тя трябва да има същия totalWidth = leadingInsetForHours + dayColumnWidth*7
        daysHeaderScrollView.contentSize = CGSize(width: w - leftColumnWidth, height: topBarHeight)

        daysHeaderView.frame = CGRect(
            x: 0,
            y: 0,
            width: w,
            height: topBarHeight
        )

        // hoursColumnScrollView
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: h - topBarHeight)
        hoursColumnView.frame = CGRect(
            x: 0,
            y: 0,
            width: leftColumnWidth,
            height: h
        )

        daysHeaderView.setNeedsLayout()
        hoursColumnView.setNeedsDisplay()
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }
}

// MARK: - TimelineStyle (примерен)
public struct TimelineStyle {
    public var backgroundColor = UIColor.white
    public var separatorColor = UIColor.lightGray
    public var timeColor = UIColor.darkGray
    public var font = UIFont.boldSystemFont(ofSize: 12)
    public var verticalInset: CGFloat = 2
    public var eventGap: CGFloat = 0
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
