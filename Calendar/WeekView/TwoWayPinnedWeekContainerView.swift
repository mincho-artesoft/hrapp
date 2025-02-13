import UIKit
import CalendarKit

public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let navBarHeight: CGFloat = 60
    private let daysHeaderHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 70

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

    // **Нов** label, който да пише "all-day" и да е винаги пиннат отляво
    private let allDayTitleLabel = UILabel()

    // pinned all-day зона (само хоризонтален скрол)
    private let allDayScrollView = UIScrollView()
    public let allDayView = AllDayViewNonOverlapping()

    // Основен scroll за часовете (vertical + horizontal)
    private let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    // Callback при смяна на диапазона
    public var onRangeChange: ((Date, Date) -> Void)?

    // При тап върху евент
    public var onEventTap: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventTap = onEventTap
            allDayView.onEventTap = onEventTap
        }
    }

    // При long press в празното
    public var onEmptyLongPress: ((Date) -> Void)? {
        didSet {
            weekView.onEmptyLongPress = onEmptyLongPress
            allDayView.onEmptyLongPress = onEmptyLongPress
        }
    }

    // При drag/drop/resize
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

    // При тап върху day label
    public var onDayLabelTap: ((Date) -> Void)? {
        didSet {
            daysHeaderView.onDayTap = onDayLabelTap
        }
    }

    // Нашите дати
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

    // Таймер за прерисуване на червената линия "Now"
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

        // 1) Нав бар
        let navBar = UIView()
        navBar.backgroundColor = .secondarySystemBackground
        addSubview(navBar)
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]

        // Дата пикъри
        fromDatePicker.datePickerMode = .date
        fromDatePicker.preferredDatePickerStyle = .compact
        fromDatePicker.addTarget(self, action: #selector(didPickFromDate(_:)), for: .valueChanged)
        navBar.addSubview(fromDatePicker)

        toDatePicker.datePickerMode = .date
        toDatePicker.preferredDatePickerStyle = .compact
        toDatePicker.addTarget(self, action: #selector(didPickToDate(_:)), for: .valueChanged)
        navBar.addSubview(toDatePicker)

        // 2) Ъглов изглед под нав бара
        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)

        // 3) Горен days header
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        // 4) Лявата колона за часове
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        // 5) Label "all-day", винаги отляво
        allDayTitleLabel.text = "all-day"
        allDayTitleLabel.textColor = .label
        allDayTitleLabel.font = .systemFont(ofSize: 14, weight: .medium)
        allDayTitleLabel.textAlignment = .center
        addSubview(allDayTitleLabel)

        // 6) pinned all-day зона
        allDayScrollView.showsHorizontalScrollIndicator = false
        allDayScrollView.showsVerticalScrollIndicator = false
        allDayScrollView.alwaysBounceHorizontal = true
        allDayScrollView.alwaysBounceVertical = false
        // ТУК ПРОМЕНЯМЕ: беше true, сега става false
        allDayScrollView.isScrollEnabled = false
        addSubview(allDayScrollView)
        allDayScrollView.addSubview(allDayView)

        // 7) основен scroll за часовете
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // Свързваме hoursColumnView -> WeekTimelineView
        weekView.hoursColumnView = hoursColumnView

        // DaysHeaderView / AllDayView / WeekView - задаваме left inset
        daysHeaderView.leadingInsetForHours = leftColumnWidth
        allDayView.leadingInsetForHours = leftColumnWidth
        weekView.leadingInsetForHours = leftColumnWidth
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

        // 1) Нав бар
        let navBarFrame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        if let navBar = subviews.first {
            navBar.frame = navBarFrame
        }
        // позиция на date pickers
        let pickerW: CGFloat = 160
        let marginX: CGFloat = 8
        fromDatePicker.frame = CGRect(x: marginX, y: 10, width: pickerW, height: 40)
        toDatePicker.frame = CGRect(x: marginX + pickerW + 16, y: 10, width: pickerW, height: 40)

        let yMain = navBarHeight
        cornerView.frame = CGRect(x: 0, y: yMain, width: leftColumnWidth, height: daysHeaderHeight)

        daysHeaderScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: yMain,
            width: bounds.width - leftColumnWidth,
            height: daysHeaderHeight
        )

        // колко дни
        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly = cal.startOfDay(for: toDate)
        let dayCount = (cal.dateComponents([.day], from: fromOnly, to: toOnly).day ?? 0) + 1

        let totalDaysHeaderWidth = daysHeaderView.leadingInsetForHours + CGFloat(dayCount) * daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(width: totalDaysHeaderWidth - leftColumnWidth,
                                                  height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0,
                                      width: totalDaysHeaderWidth,
                                      height: daysHeaderHeight)

        // 2) pinned all-day
        let allDayY = yMain + daysHeaderHeight
        let allDayH = allDayView.desiredHeight()  // метод от AllDayViewNonOverlapping

        // Позиционираме pinned label "all-day"
        allDayTitleLabel.frame = CGRect(
            x: 0,
            y: allDayY,
            width: leftColumnWidth,
            height: allDayH
        )

        allDayScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: allDayY,
            width: bounds.width - leftColumnWidth,
            height: allDayH
        )
        let totalAllDayWidth = allDayView.leadingInsetForHours + CGFloat(dayCount) * allDayView.dayColumnWidth
        allDayScrollView.contentSize = CGSize(width: totalAllDayWidth - leftColumnWidth, height: allDayH)
        allDayView.frame = CGRect(x: 0, y: 0, width: totalAllDayWidth, height: allDayH)

        // 3) Лява колона за часове под all-day
        let hoursColumnY = allDayY + allDayH
        hoursColumnScrollView.frame = CGRect(
            x: 0,
            y: hoursColumnY,
            width: leftColumnWidth,
            height: bounds.height - hoursColumnY
        )

        // 4) mainScroll
        let mainScrollY = hoursColumnY
        mainScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: mainScrollY,
            width: bounds.width - leftColumnWidth,
            height: bounds.height - mainScrollY
        )
        // Размери на timeline (24ч)
        let totalHeight = 24 * weekView.hourHeight
        let totalWidth = weekView.leadingInsetForHours + CGFloat(dayCount) * weekView.dayColumnWidth
        mainScrollView.contentSize = CGSize(width: totalWidth, height: totalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: totalHeight)

        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: totalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: totalHeight)

        bringSubviewToFront(hoursColumnScrollView)
        bringSubviewToFront(cornerView)

        // Маркираме дали е текущ ден
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil

        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            // Синхронизираме хоризонталния скрол на daysHeaderScrollView и allDayScrollView
            let offsetX = scrollView.contentOffset.x
            daysHeaderScrollView.contentOffset.x = offsetX
            allDayScrollView.contentOffset.x = offsetX

            // Синхронизираме вертикалния скрол за hoursColumn
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
