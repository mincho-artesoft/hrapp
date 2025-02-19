import UIKit
import CalendarKit

public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let navBarHeight: CGFloat = 60
    private let daysHeaderHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 70

    private let fromDatePicker = UIDatePicker()
    private let toDatePicker   = UIDatePicker()
    private let cornerView = UIView()

    private let daysHeaderScrollView = UIScrollView()
    private let daysHeaderView = DaysHeaderView()

    private let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()

    public let allDayTitleLabel = UILabel()
    public let allDayScrollView = UIScrollView()      // scroll за all-day (вертикален)
    public let allDayView = AllDayViewNonOverlapping()// самият custom view

    public let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    // Callbacks
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
    public var onEventDragEnded: ((EventDescriptor, Date, Bool) -> Void)? {
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

    // двоен pass
    private var isInSecondPass = false

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
        self.clipsToBounds = true

        // 1) mainScrollView + weekView
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        mainScrollView.bounces = false
        mainScrollView.layer.zPosition = 0
        addSubview(mainScrollView)

        // 2) allDayScrollView + allDayView
        allDayScrollView.showsHorizontalScrollIndicator = false  // (чистим хоризонталния скрол)
        allDayScrollView.showsVerticalScrollIndicator = true
        allDayScrollView.alwaysBounceHorizontal = false          // (чистим хоризонталния скрол)
        allDayScrollView.isScrollEnabled = true
        allDayScrollView.bounces = false// за вертикален скрол
        allDayScrollView.addSubview(allDayView)
        allDayScrollView.layer.zPosition = 1
        addSubview(allDayScrollView)

        // 3) Закрепени елементи
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.layer.zPosition = 2
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.backgroundColor = .secondarySystemBackground
        daysHeaderScrollView.layer.zPosition = 3
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        cornerView.backgroundColor = .secondarySystemBackground
        cornerView.layer.zPosition = 4
        addSubview(cornerView)

        allDayTitleLabel.text = "all-day"
        allDayTitleLabel.backgroundColor = .secondarySystemBackground
        allDayTitleLabel.layer.zPosition = 5
        addSubview(allDayTitleLabel)

        // 4) Navigation bar (с picker-и)
        let navBar = UIView()
        navBar.backgroundColor = .secondarySystemBackground
        navBar.layer.zPosition = 6
        addSubview(navBar)
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]

        fromDatePicker.datePickerMode = .date
        fromDatePicker.preferredDatePickerStyle = .compact
        fromDatePicker.addTarget(self, action: #selector(didPickFromDate(_:)), for: .valueChanged)
        fromDatePicker.layer.zPosition = 7
        navBar.addSubview(fromDatePicker)

        toDatePicker.datePickerMode = .date
        toDatePicker.preferredDatePickerStyle = .compact
        toDatePicker.addTarget(self, action: #selector(didPickToDate(_:)), for: .valueChanged)
        toDatePicker.layer.zPosition = 8
        navBar.addSubview(toDatePicker)

        // 5) Задаваме 0 за weekView.leadingInsetForHours
        daysHeaderView.leadingInsetForHours = 0
        allDayView.leadingInsetForHours = 0
        weekView.leadingInsetForHours = 0

        // Свързваме hoursColumnView с weekView
        weekView.hoursColumnView = hoursColumnView

        // Пример за onEventConvertToAllDay
        weekView.onEventConvertToAllDay = { [weak self] descriptor, dayIndex in
            guard let self = self else { return }
            let cal = Calendar.current
            let fromOnly = cal.startOfDay(for: self.fromDate)
            if let newDayDate = cal.date(byAdding: .day, value: dayIndex, to: fromOnly) {
                descriptor.isAllDay = true
                let startOfDay = cal.startOfDay(for: newDayDate)
                let endOfDay = cal.date(byAdding: .day, value: 1, to: startOfDay)!
                descriptor.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                self.allDayView.onEventDragEnded?(descriptor, startOfDay, false)
                self.setNeedsLayout()
            }
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

        if isInSecondPass {
            isInSecondPass = false
        }

        // 1) Navigation bar
        if let navBar = subviews.first(where: { $0.frame.origin == .zero && $0.bounds.height == navBarHeight }) {
            navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        }

        let marginX: CGFloat = 8
        let pickerW: CGFloat = 160
        fromDatePicker.frame = CGRect(x: marginX, y: 10, width: pickerW, height: 40)
        toDatePicker.frame   = CGRect(x: marginX + pickerW + 16, y: 10, width: pickerW, height: 40)

        let yMain = navBarHeight

        // 2) Corner + days header
        cornerView.frame = CGRect(x: 0, y: yMain, width: leftColumnWidth, height: daysHeaderHeight)
        daysHeaderScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: yMain,
            width: bounds.width - leftColumnWidth,
            height: daysHeaderHeight
        )

        // 3) Брой дни
        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly   = cal.startOfDay(for: toDate)
        let dayCount = (cal.dateComponents([.day], from: fromOnly, to: toOnly).day ?? 0) + 1

        // Широчина на колоните
        let availableWidth = bounds.width - leftColumnWidth
        if dayCount < 4 {
            let newDayColumnWidth = availableWidth / CGFloat(dayCount)
            weekView.dayColumnWidth = newDayColumnWidth
            daysHeaderView.dayColumnWidth = newDayColumnWidth
            allDayView.dayColumnWidth = newDayColumnWidth
        } else {
            weekView.dayColumnWidth = 100
            daysHeaderView.dayColumnWidth = 100
            allDayView.dayColumnWidth = 100
        }

        let totalDaysHeaderWidth = CGFloat(dayCount) * daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(width: totalDaysHeaderWidth, height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0, width: totalDaysHeaderWidth, height: daysHeaderHeight)

        // 5) all-day view
        let allDayY = yMain + daysHeaderHeight

        let allDayH = allDayView.desiredHeight()   // До 2.5 реда
        let allDayFullH = allDayView.contentHeight // Цялото

        allDayTitleLabel.frame = CGRect(x: 0, y: allDayY, width: leftColumnWidth, height: allDayH)

        // Рамката на scrollView
        allDayScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: allDayY,
            width: bounds.width - leftColumnWidth,
            height: allDayH
        )

        // (чистим хоризонталния скрол)
        // => contentSize.width = frame.width
        // => няма да може да се скролира хоризонтално
        let scrollViewWidth = allDayScrollView.frame.width

        // За да има вертикален скрол, задаваме:
        allDayScrollView.contentSize = CGSize(width: scrollViewWidth, height: allDayFullH)

        // Самото allDayView може да е по-широко, но user няма да го скролне хоризонтално,
        // защото contentSize.width е "заключена" до scrollViewWidth
        let totalAllDayWidth = CGFloat(dayCount) * allDayView.dayColumnWidth
        allDayView.frame = CGRect(x: 0, y: 0, width: totalAllDayWidth, height: allDayFullH)

        // 6) hours column + mainScrollView
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

        // Задаваме topMargin на weekView
        weekView.topMargin = hoursColumnView.extraMarginTopBottom

        let totalHours = 25
        let baseHeight = CGFloat(totalHours) * weekView.hourHeight
        let finalHeight = baseHeight + (weekView.topMargin * 2)
        let totalWidth  = CGFloat(dayCount) * weekView.dayColumnWidth

        mainScrollView.contentSize = CGSize(width: totalWidth, height: finalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: finalHeight)

        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: finalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: finalHeight)

        sendSubviewToBack(mainScrollView)
        sendSubviewToBack(allDayScrollView)

        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil

        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()

        bringSubviewToFront(allDayTitleLabel)

        // Двоен pass
        allDayView.layoutIfNeeded()
        let newH = allDayView.desiredHeight()
        let newCH = allDayView.contentHeight
        let curH = allDayScrollView.frame.height
        let curCH = allDayScrollView.contentSize.height

        let diff1 = abs(newH - curH)
        let diff2 = abs(newCH - curCH)

        if diff1 > 0.5 || diff2 > 0.5 {
            if !isInSecondPass {
                isInSecondPass = true
                setNeedsLayout()
                return
            } else {
                isInSecondPass = false
            }
        }
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            // Синхронизираме хоризонталния offset
            let offsetX = scrollView.contentOffset.x

            daysHeaderScrollView.contentOffset.x = offsetX
            allDayScrollView.contentOffset.x = offsetX // Обвързваме x offset

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
