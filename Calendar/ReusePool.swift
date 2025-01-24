//
//  WeekTimelineNonOverlapping.swift
//
//  Примерен седмичен изглед, където:
//   - лявата колона за часовете (leadingInsetForHours) не се застъпва със сив all-day фон
//   - отгоре има all-day зона, започваща x = leadingInsetForHours
//   - надписите Mon, Tue... се виждат над all-day фона
//   - имаме ReusePool, SwiftUI обвивка и т.н.
//

import UIKit
import SwiftUI
import CalendarKit
import EventKit

// MARK: - ReusePool

final class ReusePool<T: UIView> {
    private var storage: [T] = []

    func enqueue(views: [T]) {
        views.forEach { $0.frame = .zero }
        storage.append(contentsOf: views)
    }

    func dequeue() -> T {
        guard !storage.isEmpty else {
            return T()
        }
        return storage.removeLast()
    }
}

// MARK: - WeekTimelineViewNonOverlapping

/// UIView, показващ:
///  - Лява колона за часовете (00:00..23:00)
///  - Сива "all-day" зона отгоре, **не застъпва** лявата колона
///  - Надписи "Mon, Jan 29" и т.н. над all-day
///  - all-day събития (EventView) в тази зона
///  - Редовни събития (всеки ден по колона)
public final class WeekTimelineViewNonOverlapping: UIView {

    // MARK: Конфигурируеми пропъртита

    /// Начална дата на седмицата (напр. понеделник)
    public var startOfWeek: Date = Date()

    /// Визуален стил, подобно на TimelineStyle
    public var style = TimelineStyle()

    /// Ширина на колоната за часовете (ляво)
    public var leadingInsetForHours: CGFloat = 53

    /// Ширина за 1 ден
    public var dayColumnWidth: CGFloat = 100

    /// Височина за 1 час
    public var hourHeight: CGFloat = 50

    /// Височина за all-day зона
    public var allDayHeight: CGFloat = 50

    // MARK: - Subviews

    /// Сив фон, започващ след колоната за часовете (x = leadingInsetForHours)
    private let allDayBackground = UIView()

    /// Надпис "all-day" (по желание)
    private let allDayLabel = UILabel()

    // MARK: - Данни за събития

    /// All-day events
    public var allDayLayoutAttributes = [EventLayoutAttributes]() {
        didSet {
            prepareAllDayViews()
            setNeedsLayout()
        }
    }
    /// Редовни (часови) events
    public var regularLayoutAttributes = [EventLayoutAttributes]() {
        didSet {
            prepareEventViews()
            setNeedsLayout()
        }
    }

    private var allDayEventViews: [EventView] = []
    private var allDayPool = ReusePool<EventView>()

    private var eventViews: [EventView] = []
    private var pool = ReusePool<EventView>()

    // MARK: - Init

    override public init(frame: CGRect) {
        super.init(frame: frame)
        configure()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        configure()
    }

    private func configure() {
        backgroundColor = style.backgroundColor

        // Сивата зона (all-day)
        allDayBackground.backgroundColor = .systemGray5
        addSubview(allDayBackground)

        // Лейбъл "all-day"
        allDayLabel.text = "all-day"
        allDayLabel.font = UIFont.systemFont(ofSize: 14)
        allDayLabel.textColor = .black
        addSubview(allDayLabel)
    }

    // MARK: - Layout

    public override func layoutSubviews() {
        super.layoutSubviews()

        // 1) Позиционираме allDayBackground
        layoutAllDayBackground()
        // 2) All-day label
        layoutAllDayLabel()
        // 3) All-day евенти
        layoutAllDayEvents()
        // 4) Редовни евенти
        layoutRegularEvents()
    }

    private func layoutAllDayBackground() {
        // Всичко: 7 дни + time column
        // Но искаме да започне след колоната за часовете
        let x = leadingInsetForHours
        let w = dayColumnWidth * 7
        let h = allDayHeight
        allDayBackground.frame = CGRect(x: x, y: 0, width: w, height: h)
    }

    private func layoutAllDayLabel() {
        // Ако искаме надпис "all-day" да е ВЪРХУ лявата колонка:
        // x=0, width=leadingInsetForHours
        let labelWidth = leadingInsetForHours
        allDayLabel.frame = CGRect(x: 0, y: 0, width: labelWidth, height: allDayHeight)
    }

    private func layoutAllDayEvents() {
        // All-day събития: x = leadingInsetForHours + dayIndex * dayColumnWidth
        for (i, attr) in allDayLayoutAttributes.enumerated() {
            let view = allDayEventViews[i]
            let dayIndex = dayIndexFor(attr.descriptor.dateInterval.start)

            let x = leadingInsetForHours + CGFloat(dayIndex)*dayColumnWidth + style.eventGap
            let y = style.eventGap
            let w = dayColumnWidth - style.eventGap*2
            let h = allDayHeight - style.eventGap*2
            view.frame = CGRect(x: x, y: y, width: w, height: h)
            view.updateWithDescriptor(event: attr.descriptor)
        }
    }

    private func layoutRegularEvents() {
        for (i, attr) in regularLayoutAttributes.enumerated() {
            let view = eventViews[i]
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

            view.frame = CGRect(x: x, y: finalY, width: w, height: h)
            view.updateWithDescriptor(event: attr.descriptor)
        }
    }

    // MARK: - draw(_:) - рисуваме часове, дати

    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let cal = Calendar.current
        let totalWidth = leadingInsetForHours + dayColumnWidth*7
        let normalZoneTop = allDayHeight

        // 1) Вертикална линия отделяща часовете
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        ctx.move(to: CGPoint(x: leadingInsetForHours, y: 0))
        ctx.addLine(to: CGPoint(x: leadingInsetForHours, y: bounds.height))
        ctx.strokePath()
        ctx.restoreGState()

        // 2) Хоризонтални линии (0..24)
        ctx.saveGState()
        ctx.setStrokeColor(style.separatorColor.cgColor)
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        for hour in 0...24 {
            let y = normalZoneTop + CGFloat(hour)*hourHeight
            ctx.move(to: CGPoint(x: leadingInsetForHours, y: y))
            ctx.addLine(to: CGPoint(x: totalWidth, y: y))
        }
        ctx.strokePath()
        ctx.restoreGState()

        // 3) Текст за часовете (00:00, 01:00...)
        for hour in 0..<24 {
            let text = String(format: "%02d:00", hour)
            let attrs: [NSAttributedString.Key : Any] = [
                .font: style.font,
                .foregroundColor: style.timeColor
            ]
            let y = normalZoneTop + CGFloat(hour)*hourHeight - 6
            let x: CGFloat = 2
            text.draw(at: CGPoint(x: x, y: y), withAttributes: attrs)
        }

        // 4) Надпис за всеки ден (Mon, Jan 29)
        let dayFormatter = DateFormatter()
        dayFormatter.dateFormat = "EEE, MMM d"
        for i in 0..<7 {
            if let dayDate = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                let text = dayFormatter.string(from: dayDate)
                let attrs: [NSAttributedString.Key: Any] = [
                    .font: style.font,
                    .foregroundColor: style.timeColor
                ]
                let x = leadingInsetForHours + CGFloat(i)*dayColumnWidth + style.eventGap
                // Нека y = 2, за да е леко отстоящ
                text.draw(at: CGPoint(x: x, y: 2), withAttributes: attrs)
            }
        }
    }

    // MARK: - Reuse

    private func prepareAllDayViews() {
        allDayPool.enqueue(views: allDayEventViews)
        allDayEventViews.removeAll()
        for _ in allDayLayoutAttributes {
            let v = allDayPool.dequeue()
            if v.superview == nil {
                addSubview(v)
            }
            allDayEventViews.append(v)
        }
    }

    private func prepareEventViews() {
        pool.enqueue(views: eventViews)
        eventViews.removeAll()
        for _ in regularLayoutAttributes {
            let v = pool.dequeue()
            if v.superview == nil {
                addSubview(v)
            }
            eventViews.append(v)
        }
    }

    // MARK: - Helpers

    private func dayIndexFor(_ date: Date) -> Int {
        let startOnly = startOfWeek.dateOnly(calendar: Calendar.current)
        let eventOnly = date.dateOnly(calendar: Calendar.current)
        let comps = Calendar.current.dateComponents([.day], from: startOnly, to: eventOnly)
        return comps.day ?? 0
    }

    private func dateToY(_ date: Date) -> CGFloat {
        let cal = Calendar.current
        let hour = CGFloat(cal.component(.hour, from: date))
        let minute = CGFloat(cal.component(.minute, from: date))
        return (hour + minute/60) * hourHeight
    }

    /// Ако искате drag & drop:
    public func yToDate(_ y: CGFloat, dayIndex: Int) -> Date {
        let hourFloat = (y - allDayHeight)/hourHeight
        let h = Int(floor(hourFloat))
        let m = Int((hourFloat - CGFloat(h)) * 60)
        let baseDay = Calendar.current.date(byAdding: .day, value: dayIndex, to: startOfWeek) ?? Date()
        return Calendar.current.date(bySettingHour: h, minute: m, second: 0, of: baseDay) ?? baseDay
    }
}

// MARK: - WeekTimelineContainerNonOverlapping

public final class WeekTimelineContainerNonOverlapping: UIScrollView {
    public let weekView: WeekTimelineViewNonOverlapping

    public init(_ weekView: WeekTimelineViewNonOverlapping) {
        self.weekView = weekView
        super.init(frame: .zero)
        addSubview(weekView)
        showsVerticalScrollIndicator = true
        showsHorizontalScrollIndicator = true
        bounces = true
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) not implemented") }

    public override func layoutSubviews() {
        super.layoutSubviews()

        // width = lента (leadingInsetForHours) + 7 колони
        let w = weekView.leadingInsetForHours + weekView.dayColumnWidth*7
        // height = allDayHeight + (24h * hourHeight)
        let h = weekView.allDayHeight + 24 * weekView.hourHeight
        contentSize = CGSize(width: w, height: h)

        weekView.frame = CGRect(x: 0, y: 0, width: w, height: h)
    }

    public func prepareForReuse() {
        weekView.allDayLayoutAttributes.removeAll()
        weekView.regularLayoutAttributes.removeAll()
    }
}

// MARK: - SwiftUI Wrapper

public struct WeekNonOverlappingWrapper: UIViewControllerRepresentable {
    public let startOfWeek: Date
    public let events: [EventDescriptor]

    public init(startOfWeek: Date, events: [EventDescriptor]) {
        self.startOfWeek = startOfWeek
        self.events = events
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()

        let weekView = WeekTimelineViewNonOverlapping()
        weekView.startOfWeek = startOfWeek

        // Примерни настройки
        weekView.style.verticalInset = 2
        weekView.style.font = UIFont.systemFont(ofSize: 12)
        weekView.style.separatorColor = .lightGray
        weekView.style.timeColor = .darkGray

        weekView.leadingInsetForHours = 53
        weekView.dayColumnWidth = 100
        weekView.hourHeight = 50
        weekView.allDayHeight = 40

        // Разделяме събития
        let (allDay, regular) = splitAllDay(events)
        weekView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        let container = WeekTimelineContainerNonOverlapping(weekView)
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
        if let container = uiViewController.view.subviews.first as? WeekTimelineContainerNonOverlapping {
            let (allDay, regular) = splitAllDay(events)
            container.weekView.startOfWeek = startOfWeek
            container.weekView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }
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
