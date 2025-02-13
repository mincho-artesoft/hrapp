import UIKit
import CalendarKit

public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let navBarHeight: CGFloat = 60
    private let daysHeaderHeight: CGFloat = 40

    // Връщаме го на 70 (както беше) или вашата стойност
    private let leftColumnWidth: CGFloat = 70 // CHANGED

    // Нав-бар с два DatePicker-а
    private let fromDatePicker = UIDatePicker()
    private let toDatePicker   = UIDatePicker()

    // Малък "ъгъл" вляво под навбара
    private let cornerView = UIView()

    // Горен скрол с дните
    private let daysHeaderScrollView = UIScrollView()
    private let daysHeaderView = DaysHeaderView()

    // Лява pinned колона за часове
    private let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()

    // Label "all-day", винаги отляво
    private let allDayTitleLabel = UILabel()

    // pinned all-day зона (само хоризонтален скрол)
    private let allDayScrollView = UIScrollView()
    public let allDayView = AllDayViewNonOverlapping()

    // Основен scroll за часовете (vertical + horizontal)
    private let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    public var onRangeChange: ((Date, Date) -> Void)?
    public var onEventTap: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventTap = onEventTap
            allDayView.onEventTap = onEventTap
        }
    }
    public var onEmptyLongPress: ((Date) -> Void)? {
        didSet {
            weekView.onEmptyLongPress = onEmptyLongPress
            allDayView.onEmptyLongPress = onEmptyLongPress
        }
    }
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)? {
        didSet {
            weekView.onEventDragEnded = onEventDragEnded
            allDayView.onEventDragEnded = onEventDragEnded
        }
    }
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)? {
        didSet {
            weekView.onEventDragResizeEnded = onEventDragResizeEnded
            allDayView.onEventDragResizeEnded = onEventDragResizeEnded
        }
    }
    public var onDayLabelTap: ((Date) -> Void)? {
        didSet {
            daysHeaderView.onDayTap = onDayLabelTap
        }
    }

    public var fromDate: Date = Date() {
        didSet {
            daysHeaderView.fromDate = fromDate
            allDayView.fromDate = fromDate
            weekView.fromDate = fromDate
            fromDatePicker.date = fromDate
            setNeedsLayout()
        }
    }
    public var toDate: Date = Date() {
        didSet {
            daysHeaderView.toDate = toDate
            allDayView.toDate = toDate
            weekView.toDate = toDate
            toDatePicker.date = toDate
            setNeedsLayout()
        }
    }

    private var redrawTimer: Timer?

    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
        startRedrawTimer()
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
        startRedrawTimer()
    }

    deinit {
        redrawTimer?.invalidate()
    }

    private func setupViews() {
        backgroundColor = .systemBackground

        // Нав бар
        let navBar = UIView()
        navBar.backgroundColor = .secondarySystemBackground
        addSubview(navBar)
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]

        fromDatePicker.datePickerMode = .date
        fromDatePicker.preferredDatePickerStyle = .compact
        fromDatePicker.addTarget(self, action: #selector(didPickFromDate(_:)), for: .valueChanged)
        navBar.addSubview(fromDatePicker)

        toDatePicker.datePickerMode = .date
        toDatePicker.preferredDatePickerStyle = .compact
        toDatePicker.addTarget(self, action: #selector(didPickToDate(_:)), for: .valueChanged)
        navBar.addSubview(toDatePicker)

        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)

        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        allDayTitleLabel.text = "all-day"
        allDayTitleLabel.textColor = .label
        allDayTitleLabel.font = .systemFont(ofSize: 14, weight: .medium)
        allDayTitleLabel.textAlignment = .center
        addSubview(allDayTitleLabel)

        allDayScrollView.showsHorizontalScrollIndicator = false
        allDayScrollView.showsVerticalScrollIndicator = false
        allDayScrollView.alwaysBounceHorizontal = true
        allDayScrollView.alwaysBounceVertical = false
        allDayScrollView.isScrollEnabled = false
        addSubview(allDayScrollView)
        allDayScrollView.addSubview(allDayView)

        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // Тук казваме 0 за всички .leadingInsetForHours
        daysHeaderView.leadingInsetForHours = 0
        allDayView.leadingInsetForHours     = 0
        weekView.leadingInsetForHours       = 0

        // Свързваме hoursColumnView -> weekView
        weekView.hoursColumnView = hoursColumnView

        // --- НОВО: Закачаме onEventConvertToAllDay --- //
        weekView.onEventConvertToAllDay = { [weak self] descriptor, dayIdx in
            guard let self = self else { return }
            let cal = Calendar.current
            let fromOnly = cal.startOfDay(for: self.fromDate)
            guard let targetDay = cal.date(byAdding: .day, value: dayIdx, to: fromOnly) else { return }

            descriptor.isAllDay = true

            let startOfDay = cal.startOfDay(for: targetDay)
            let endOfDay   = cal.date(byAdding: .day, value: 1, to: startOfDay)!
            descriptor.dateInterval = DateInterval(start: startOfDay, end: endOfDay)

            // По аналогия на onEventDragEnded:
            self.onEventDragEnded?(descriptor, startOfDay)

            // Или, ако ползвате Coordinator (EKEventStore):
            // context.coordinator.handleEventConvertToAllDay(descriptor, startOfDay)
            // ...
        }
    }

    @objc private func didPickFromDate(_ sender: UIDatePicker) {
        if sender.date > toDate {
            toDate = sender.date
        }
        fromDate = sender.date
        onRangeChange?(fromDate, toDate)
    }

    @objc private func didPickToDate(_ sender: UIDatePicker) {
        if sender.date < fromDate {
            fromDate = sender.date
        }
        toDate = sender.date
        onRangeChange?(fromDate, toDate)
    }

    public override func layoutSubviews() {
        super.layoutSubviews()

        // Нав бар
        let navBarFrame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        if let navBar = subviews.first {
            navBar.frame = navBarFrame
        }
        let pickerW: CGFloat = 160
        let marginX: CGFloat = 8
        fromDatePicker.frame = CGRect(x: marginX, y: 10, width: pickerW, height: 40)
        toDatePicker.frame   = CGRect(x: marginX + pickerW + 16, y: 10, width: pickerW, height: 40)

        let yMain = navBarHeight
        cornerView.frame = CGRect(x: 0, y: yMain, width: leftColumnWidth, height: daysHeaderHeight)

        daysHeaderScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: yMain,
            width: bounds.width - leftColumnWidth,
            height: daysHeaderHeight
        )

        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly = cal.startOfDay(for: toDate)
        let dayCount = (cal.dateComponents([.day], from: fromOnly, to: toOnly).day ?? 0) + 1

        let totalDaysHeaderWidth = daysHeaderView.leadingInsetForHours + CGFloat(dayCount) * daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(width: totalDaysHeaderWidth, height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0, width: totalDaysHeaderWidth, height: daysHeaderHeight)

        let allDayY = yMain + daysHeaderHeight
        let allDayH = allDayView.desiredHeight()
        allDayTitleLabel.frame = CGRect(x: 0, y: allDayY, width: leftColumnWidth, height: allDayH)

        allDayScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: allDayY,
            width: bounds.width - leftColumnWidth,
            height: allDayH
        )
        let totalAllDayWidth = allDayView.leadingInsetForHours + CGFloat(dayCount) * allDayView.dayColumnWidth
        allDayScrollView.contentSize = CGSize(width: totalAllDayWidth, height: allDayH)
        allDayView.frame = CGRect(x: 0, y: 0, width: totalAllDayWidth, height: allDayH)

        let hoursColumnY = allDayY + allDayH
        hoursColumnScrollView.frame = CGRect(
            x: 0,
            y: hoursColumnY,
            width: leftColumnWidth,
            height: bounds.height - hoursColumnY
        )

        mainScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: hoursColumnY,
            width: bounds.width - leftColumnWidth,
            height: bounds.height - hoursColumnY
        )

        let totalHeight = 24 * weekView.hourHeight
        let totalWidth = weekView.leadingInsetForHours + CGFloat(dayCount) * weekView.dayColumnWidth
        mainScrollView.contentSize = CGSize(width: totalWidth, height: totalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: totalHeight)

        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: totalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: totalHeight)

        bringSubviewToFront(hoursColumnScrollView)
        bringSubviewToFront(cornerView)

        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil

        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            let offsetX = scrollView.contentOffset.x
            daysHeaderScrollView.contentOffset.x = offsetX
            allDayScrollView.contentOffset.x     = offsetX

            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }

    private func startRedrawTimer() {
        redrawTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.setNeedsLayout()
            self.layoutIfNeeded()
            self.weekView.setNeedsDisplay()
            self.allDayView.setNeedsLayout()
        }
    }
}
