import UIKit
import CalendarKit

public final class TwoWayPinnedMultiDayContainerView: UIView, UIScrollViewDelegate {

    // Размери
    private let navBarHeight: CGFloat = 60
    private let daysHeaderHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 70

    // Двата UIDatePicker-а
    private let fromDatePicker = UIDatePicker()
    private let toDatePicker   = UIDatePicker()

    // Бутон (три точки) за менюто
    private let menuButton: UIButton = {
        let btn = UIButton(type: .system)
        btn.setImage(UIImage(systemName: "ellipsis"), for: .normal)
        btn.tintColor = .label
        return btn
    }()

    // MARK: - Публично свойство, което указва дали да е single-day
    // При промяна на showSingleDay динамично опресняваме менюто и layout-а.
    public var showSingleDay: Bool = false {
        didSet {
            // Крием toDatePicker, ако сме single
            toDatePicker.isHidden = showSingleDay

            // Ако вече сме single, приравняваме toDate = fromDate,
            // за да не се разминават датите
            if showSingleDay {
                toDate = fromDate
            }

            // Подновяваме менюто (iOS 14+), за да се покаже отметката правилно
            if #available(iOS 14.0, *) {
                menuButton.menu = buildMenu()
            }

            // Пренареждаме
            setNeedsLayout()
        }
    }

    private let cornerView = UIView()
    private let daysHeaderScrollView = UIScrollView()
    private let daysHeaderView = DaysHeaderView()
    private let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()

    public let allDayTitleLabel = UILabel()
    public let allDayScrollView = UIScrollView()
    public let allDayView = AllDayViewNonOverlapping()

    public let mainScrollView = UIScrollView()
    public let weekView = MultiDayTimelineViewNonOverlapping()

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

    // Дати (първи и последен), обхванати от изгледа
    public var fromDate: Date = Date() {
        didSet {
            daysHeaderView.fromDate = fromDate
            allDayView.fromDate = fromDate
            weekView.fromDate = fromDate
            fromDatePicker.date = fromDate

            // Ако сме single и вече разминаваме from/to,
            // приравняваме toDate
            if showSingleDay {
                toDate = fromDate
            }

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

    // Таймер за презареждане
    private var redrawTimer: Timer?

    // За двоен pass при layoutSubviews()
    private var isInSecondPass = false

    // MARK: - ИНИЦИАЛИЗАЦИЯ
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

    // MARK: - SETUP
    private func setupViews() {
        backgroundColor = .systemBackground
        self.clipsToBounds = true

        // 1) Основният скрол + weekView
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        mainScrollView.bounces = false
        mainScrollView.layer.zPosition = 0
        addSubview(mainScrollView)

        // 2) AllDay скрол + allDayView
        allDayScrollView.showsHorizontalScrollIndicator = false
        allDayScrollView.showsVerticalScrollIndicator = true
        allDayScrollView.alwaysBounceHorizontal = false
        allDayScrollView.isScrollEnabled = true
        allDayScrollView.bounces = false
        allDayScrollView.addSubview(allDayView)
        allDayScrollView.layer.zPosition = 1
        addSubview(allDayScrollView)

        // 3) Закрепените зони: колоната за часовете + header за дните
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

        // 4) Navigation bar
        let navBar = UIView()
        navBar.backgroundColor = .secondarySystemBackground
        navBar.layer.zPosition = 6
        addSubview(navBar)
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]

        // DatePickers
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

        // Бутон (три точки)
        navBar.addSubview(menuButton)

        // iOS 14+ -> Menu
        if #available(iOS 14.0, *) {
            menuButton.showsMenuAsPrimaryAction = true
            menuButton.menu = buildMenu()
        } else {
            // < iOS 14 -> UIAlertController
            menuButton.addTarget(self, action: #selector(legacyMenuTapped), for: .touchUpInside)
        }

        // 5) Индентации
        daysHeaderView.leadingInsetForHours = 0
        allDayView.leadingInsetForHours = 0
        weekView.leadingInsetForHours = 0

        // Свързваме hoursColumnView с weekView
        weekView.hoursColumnView = hoursColumnView

        // onEventConvertToAllDay (пример)
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

    // MARK: - Създаване на меню (iOS 14+)
    @available(iOS 14.0, *)
    private func buildMenu() -> UIMenu {
        let singleAction = UIAction(
            title: "Single day",
            state: showSingleDay ? .on : .off
        ) { [weak self] _ in
            self?.showSingleDay = true
        }
        let multiAction = UIAction(
            title: "Multi-day",
            state: showSingleDay ? .off : .on
        ) { [weak self] _ in
            self?.showSingleDay = false
        }
        return UIMenu(title: "", children: [singleAction, multiAction])
    }

    // < iOS 14
    @objc private func legacyMenuTapped() {
        let alert = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "Single day", style: .default, handler: { [weak self] _ in
            self?.showSingleDay = true
        }))
        alert.addAction(UIAlertAction(title: "Multi-day", style: .default, handler: { [weak self] _ in
            self?.showSingleDay = false
        }))
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))

        if let topVC = UIApplication.shared.windows.first?.rootViewController {
            alert.popoverPresentationController?.sourceView = menuButton
            topVC.present(alert, animated: true, completion: nil)
        }
    }

    // MARK: - Действия при промяна на DatePickers
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

    // MARK: - Layout
    public override func layoutSubviews() {
        super.layoutSubviews()

        if isInSecondPass {
            isInSecondPass = false
        }

        // Навбар
        if let navBar = subviews.first(where: { $0.frame.origin == .zero && $0.bounds.height == navBarHeight }) {
            navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)

            // Бутонът горе вдясно
            let buttonSize: CGFloat = 40
            menuButton.frame = CGRect(
                x: navBar.bounds.width - buttonSize - 8,
                y: (navBarHeight - buttonSize) / 2,
                width: buttonSize,
                height: buttonSize
            )

            // Ако сме single-day: центрираме fromDatePicker, крием toDatePicker
            if showSingleDay {
                let pickerW: CGFloat = 160
                let pickerH: CGFloat = 40
                fromDatePicker.frame = CGRect(
                    x: (navBar.bounds.width - pickerW)/2,
                    y: (navBarHeight - pickerH)/2,
                    width: pickerW,
                    height: pickerH
                )
                toDatePicker.frame = .zero
            } else {
                // Multi-day
                let marginX: CGFloat = 8
                let pickerW: CGFloat = 160
                fromDatePicker.frame = CGRect(
                    x: marginX,
                    y: 10,
                    width: pickerW,
                    height: 40
                )
                toDatePicker.frame = CGRect(
                    x: marginX + pickerW + 16,
                    y: 10,
                    width: pickerW,
                    height: 40
                )
            }
        }

        let yMain = navBarHeight

        // Corner + daysHeader
        cornerView.frame = CGRect(x: 0, y: yMain, width: leftColumnWidth, height: daysHeaderHeight)
        daysHeaderScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: yMain,
            width: bounds.width - leftColumnWidth,
            height: daysHeaderHeight
        )

        // Колко дни?
        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly   = cal.startOfDay(for: toDate)
        let dayCount = (cal.dateComponents([.day], from: fromOnly, to: toOnly).day ?? 0) + 1

        // Колона (width)
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

        // daysHeader view
        let totalDaysHeaderWidth = CGFloat(dayCount) * daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(width: totalDaysHeaderWidth, height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0, width: totalDaysHeaderWidth, height: daysHeaderHeight)

        // All-day
        let allDayY = yMain + daysHeaderHeight
        let allDayH = allDayView.desiredHeight()
        let allDayFullH = allDayView.contentHeight

        allDayTitleLabel.frame = CGRect(x: 0, y: allDayY, width: leftColumnWidth, height: allDayH)
        allDayScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: allDayY,
            width: bounds.width - leftColumnWidth,
            height: allDayH
        )

        let scrollViewWidth = allDayScrollView.frame.width
        allDayScrollView.contentSize = CGSize(width: scrollViewWidth, height: allDayFullH)

        let totalAllDayWidth = CGFloat(dayCount) * allDayView.dayColumnWidth
        allDayView.frame = CGRect(x: 0, y: 0, width: totalAllDayWidth, height: allDayFullH)

        // HoursColumn + mainScrollView
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

        // Top margin
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

        // Текущ ден в диапазона?
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil

        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()

        bringSubviewToFront(allDayTitleLabel)

        // Двоен pass, ако allDayView промени височина
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
            let offsetX = scrollView.contentOffset.x
            daysHeaderScrollView.contentOffset.x = offsetX
            allDayScrollView.contentOffset.x = offsetX

            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }

    private func startRedrawTimer() {
        redrawTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            Task { @MainActor in
                guard let self = self else { return }
                self.setNeedsLayout()
                self.layoutIfNeeded()
                self.weekView.setNeedsDisplay()
                self.allDayView.setNeedsLayout()
            }
        }
    }
}
