import UIKit
import CalendarKit

// MARK: - DaysHeaderView
/// Показва 7 надписа (Mon 1, Tue 2...), подредени хоризонтално.
public final class DaysHeaderView: UIView {
    public var dayColumnWidth: CGFloat = 100
    public var startOfWeek: Date = Date() {
        didSet { updateTexts() }
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
            let x = CGFloat(i)*dayColumnWidth
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
/// Рисува 24 етикета "00:00", "01:00"... във вертикална колона (hourHeight за 1 ред).
public final class HoursColumnView: UIView {
    public var hourHeight: CGFloat = 50
    public var font = UIFont.systemFont(ofSize: 12, weight: .medium)

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .white // за да се отличава текстът
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
            let pos = CGPoint(x: 8, y: y - 6)
            text.draw(at: pos, withAttributes: attrs)
        }
    }
}

// MARK: - WeekTimelineViewNonOverlapping
/// Рисува grid за 7 дни, all-day фон, event-и. Не рисува часове и дати (те са в отделни pinned зони).
public final class WeekTimelineViewNonOverlapping: UIView {

    public var startOfWeek: Date = Date()
    public var style = TimelineStyle()

    public var leadingInsetForHours: CGFloat = 53
    public var dayColumnWidth: CGFloat = 100
    public var hourHeight: CGFloat = 50
    public var allDayHeight: CGFloat = 40

    // Данни за събития
    public var allDayLayoutAttributes = [EventLayoutAttributes]()
    public var regularLayoutAttributes = [EventLayoutAttributes]()

    private let allDayBackground = UIView()
    private let allDayLabel = UILabel()

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = style.backgroundColor

        allDayBackground.backgroundColor = .systemGray5
        addSubview(allDayBackground)

        allDayLabel.text = "all-day"
        allDayLabel.font = .systemFont(ofSize: 14)
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
        allDayLabel.frame = CGRect(x: 0, y: 0,
                                   width: leadingInsetForHours,
                                   height: allDayHeight)
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
        // Ако има повече views от attributes, почистете...
    }

    private func layoutRegularEvents() {
        for (i, attr) in regularLayoutAttributes.enumerated() {
            let start = attr.descriptor.dateInterval.start
            let dayIndex = dayIndexFor(start)
            let yStart = dateToY(start)
            let yEnd   = dateToY(attr.descriptor.dateInterval.end)

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

    // Примерен draw(_, без рисуване на часове/дни
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        let totalWidth = leadingInsetForHours + dayColumnWidth*7
        let normalZoneTop = allDayHeight

        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)

        // Вертикална линия (отделяща hours column)
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        ctx.strokePath()

        // Хоризонтални линии
        ctx.beginPath()
        for hour in 0...24 {
            let y = normalZoneTop + CGFloat(hour)*hourHeight
            ctx.move(to: CGPoint(x: leadingInsetForHours, y: y))
            ctx.addLine(to: CGPoint(x: totalWidth, y: y))
        }
        ctx.strokePath()
    }

    private var allDayEventViews: [EventView] = []
    private var eventViews: [EventView] = []

    private func ensureAllDayEventView(index: Int) -> EventView {
        // Ако го имаме, връщаме, иначе създаваме
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
/// Основен контейнер, който има mainScrollView + daysHeaderScrollView + hoursColumnScrollView.
/// - daysHeaderView се скролва само по X
/// - hoursColumnView се скролва само по Y
/// - user реално скролва mainScrollView (двупосочно).
public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let topBarHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 53

    private let mainScrollView = UIScrollView()
    private let daysHeaderScrollView = UIScrollView()
    private let hoursColumnScrollView = UIScrollView()

    private let daysHeaderView = DaysHeaderView()
    private let hoursColumnView = HoursColumnView()
    private let cornerView = UIView()

    // Тук е основният седмичен изглед
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

        // Corner (горе-ляво)
        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)

        // Days header
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        // Hours column
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        // Main scroll
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // Примерни настройки
        weekView.leadingInsetForHours = leftColumnWidth
        weekView.dayColumnWidth = 100
        weekView.hourHeight = 50
        daysHeaderView.dayColumnWidth = 100
        hoursColumnView.hourHeight = 50

        // Задаваме примерен startOfWeek = понеделник
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

        // cornerView горе вляво
        cornerView.frame = CGRect(x: 0, y: 0,
                                  width: leftColumnWidth, height: topBarHeight)

        // daysHeaderScrollView (горе, x=leftColumnWidth)
        daysHeaderScrollView.frame = CGRect(x: leftColumnWidth, y: 0,
                                            width: bounds.width - leftColumnWidth,
                                            height: topBarHeight)

        // hoursColumnScrollView (вляво, y=topBarHeight)
        hoursColumnScrollView.frame = CGRect(x: 0, y: topBarHeight,
                                             width: leftColumnWidth,
                                             height: bounds.height - topBarHeight)

        // mainScrollView (същинското скролиране)
        mainScrollView.frame = CGRect(x: leftColumnWidth, y: topBarHeight,
                                      width: bounds.width - leftColumnWidth,
                                      height: bounds.height - topBarHeight)

        // Определяме contentSize
        let w = weekView.leadingInsetForHours + 7*weekView.dayColumnWidth
        let h = weekView.allDayHeight + 24*weekView.hourHeight
        mainScrollView.contentSize = CGSize(width: w, height: h)
        weekView.frame = CGRect(x: 0, y: 0, width: w, height: h)

        // daysHeaderScrollView contentSize
        daysHeaderScrollView.contentSize = CGSize(width: w - leftColumnWidth, height: topBarHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0,
                                      width: (7*daysHeaderView.dayColumnWidth) + leftColumnWidth,
                                      height: topBarHeight)

        // hoursColumnScrollView contentSize
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: h - topBarHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0,
                                       width: leftColumnWidth,
                                       height: h)

        daysHeaderView.setNeedsLayout()
        hoursColumnView.setNeedsDisplay()
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        // При скрол, синхронизираме X offset за daysHeader, Y offset за hoursColumn
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }
}

// MARK: - Допълнителен стил
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

        let wv = container.weekView
        // Примерни настройки
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
