import UIKit
import SwiftUI

public final class TwoWayPinnedMultiDayContainerView: UIView, UIScrollViewDelegate {

    // MARK: - Properties

    fileprivate let navBarHeight: CGFloat = 60
    fileprivate let daysHeaderHeight: CGFloat = 40
    fileprivate let leftColumnWidth: CGFloat = 70
    
    private let fromDatePicker = UIDatePicker()
    
    // ------------------------
    // ВАЖНО: Само един addTarget!
    // ------------------------
    private let menuButton: UIButton = {
        let btn = UIButton(type: .system)
        btn.setImage(UIImage(systemName: "ellipsis"), for: .normal)
        btn.tintColor = .label
        return btn
    }()
    
    private let dateRangeButton: UIButton = {
        let btn = UIButton(type: .custom)
        btn.setTitle("Няма избран период", for: .normal)
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        btn.layer.cornerRadius = 8
        btn.backgroundColor = .systemGray5
        btn.setTitleColor(.label, for: .normal)
        btn.setTitleColor(.systemBlue, for: .selected)
        return btn
    }()
    
    // Дали показваме „popup“ календара в момента
    private var showCalendar = false
    
    private var calendarHostingController: UIHostingController<CalendarDateRangePickerWrapper>?
    
    public var showSingleDay: Bool = false {
        didSet {
            if showSingleDay {
                toDate = fromDate
            }
            if #available(iOS 14.0, *) {
                menuButton.menu = buildMenu()
            }
            setNeedsLayout()
        }
    }
    
    // Останалите вюта...
    fileprivate let cornerView = UIView()
    fileprivate let daysHeaderScrollView = UIScrollView()
    fileprivate let daysHeaderView = DaysHeaderView()
    fileprivate let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()
    public let allDayTitleLabel = UILabel()
    public let allDayScrollView = UIScrollView()
    public let allDayView = AllDayViewNonOverlapping()
    public let mainScrollView = UIScrollView()
    public let weekView = MultiDayTimelineViewNonOverlapping()

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
            refreshDateRangeButtonTitle()
            daysHeaderView.fromDate = fromDate
            allDayView.fromDate = fromDate
            weekView.fromDate = fromDate
            fromDatePicker.date = fromDate

            if showSingleDay {
                toDate = fromDate
            }
            setNeedsLayout()

            if fromDate > toDate {
                toDate = fromDate
            }
        }
    }
    public var toDate: Date = Date() {
        didSet {
            refreshDateRangeButtonTitle()
            daysHeaderView.toDate = toDate
            allDayView.toDate = toDate
            weekView.toDate = toDate
            setNeedsLayout()

            if fromDate > toDate {
                fromDate = toDate
            }
        }
    }
    
    private var redrawTimer: Timer?
    private var isInSecondPass = false

    // MARK: - Init
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
        startRedrawTimer()
        refreshDateRangeButtonTitle()
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
        startRedrawTimer()
        refreshDateRangeButtonTitle()
    }
    
    deinit {
        redrawTimer?.invalidate()
    }
    
    // MARK: - Setup
    private func setupViews() {
        backgroundColor = .systemBackground
        self.clipsToBounds = true
        
        // Основни subviews
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.bounces = false
        mainScrollView.addSubview(weekView)
        mainScrollView.layer.zPosition = 0
        addSubview(mainScrollView)

        allDayScrollView.delegate = self
        allDayScrollView.showsHorizontalScrollIndicator = false
        allDayScrollView.showsVerticalScrollIndicator = true
        allDayScrollView.alwaysBounceHorizontal = false
        allDayScrollView.alwaysBounceVertical = false
        allDayScrollView.bounces = false
        allDayScrollView.addSubview(allDayView)
        allDayScrollView.layer.zPosition = 1
        addSubview(allDayScrollView)

        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        hoursColumnScrollView.layer.zPosition = 3
        addSubview(hoursColumnScrollView)

        daysHeaderScrollView.showsVerticalScrollIndicator = false
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = true
        daysHeaderScrollView.delegate = self
        daysHeaderScrollView.backgroundColor = .secondarySystemBackground
        daysHeaderScrollView.bounces = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        daysHeaderScrollView.layer.zPosition = 4
        addSubview(daysHeaderScrollView)

        cornerView.backgroundColor = .secondarySystemBackground
        cornerView.layer.zPosition = 5
        addSubview(cornerView)

        allDayTitleLabel.text = "all-day"
        allDayTitleLabel.backgroundColor = .secondarySystemBackground
        allDayTitleLabel.layer.zPosition = 6
        addSubview(allDayTitleLabel)

        // „Нав-бар“
        let navBar = UIView()
        navBar.backgroundColor = .secondarySystemBackground
        navBar.layer.zPosition = 7
        addSubview(navBar)
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]

        fromDatePicker.datePickerMode = .date
        fromDatePicker.preferredDatePickerStyle = .compact
        fromDatePicker.addTarget(self, action: #selector(didPickFromDate(_:)), for: .valueChanged)
        navBar.addSubview(fromDatePicker)

        navBar.addSubview(menuButton)
        if #available(iOS 14.0, *) {
            menuButton.showsMenuAsPrimaryAction = true
            menuButton.menu = buildMenu()
        } else {
            menuButton.addTarget(self, action: #selector(legacyMenuTapped), for: .touchUpInside)
        }

        // ** Важно: САМО тук го добавяме, за да няма дублиращо се извикване **
        dateRangeButton.addTarget(self, action: #selector(didTapDateRangeButton), for: .touchUpInside)
        navBar.addSubview(dateRangeButton)

        daysHeaderView.leadingInsetForHours = 0
        allDayView.leadingInsetForHours = 0
        weekView.leadingInsetForHours = 0

        weekView.hoursColumnView = hoursColumnView
        
        // Примерна логика за Drag to AllDay:
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
    
    @objc private func legacyMenuTapped() {
        let alert = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "Single day", style: .default, handler: { [weak self] _ in
            self?.showSingleDay = true
        }))
        alert.addAction(UIAlertAction(title: "Multi-day", style: .default, handler: { [weak self] _ in
            self?.showSingleDay = false
        }))
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))

        if let windowScene = UIApplication.shared.connectedScenes
            .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
           let topVC = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController {
            alert.popoverPresentationController?.sourceView = menuButton
            topVC.present(alert, animated: true, completion: nil)
        }
    }
    
    // MARK: - Date picking
    @objc private func didPickFromDate(_ sender: UIDatePicker) {
        self.fromDate = sender.date
        self.toDate   = sender.date
        onRangeChange?(fromDate, toDate)
    }
    
    // MARK: - Show / Hide Calendar
    
    @objc private func didTapDateRangeButton() {
        // Ако натискате бутона и тук влиза два пъти,
        // проверете дали имате второ закачане към @IBAction
        // или още един addTarget.
     
        if showCalendar {
            hideCalendarPopup()
        } else {
            showCalendarPopup()
        }
    }

    @objc private func containerTapped(_ sender: UITapGestureRecognizer) {
        guard let hc = calendarHostingController else { return }
        let location = sender.location(in: self)
        let calendarFrame = hc.view.frame
        // Ако тапнем извън „popup“-а
        if !calendarFrame.contains(location) {
            hideCalendarPopup()
        }
    }
    
    private func showCalendarPopup() {
        guard !showCalendar else { return }
        showCalendar = true
        
        let swiftUICalendar = CalendarDateRangePickerWrapper(
            startDate: fromDate,
            endDate: toDate,
            minimumDate: nil,
            maximumDate: nil,
            selectedColor: UIColor.systemBlue
        ) { [weak self] newStart, newEnd in
            guard let self = self else { return }
            self.fromDate = newStart
            self.toDate   = newEnd
            self.onRangeChange?(self.fromDate, self.toDate)
        }
        
        let hc = UIHostingController(rootView: swiftUICalendar)
        hc.view.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.9)
        hc.view.layer.cornerRadius = 12
        hc.view.layer.zPosition = 9999
        
        self.calendarHostingController = hc
        
        if let parentVC = self.findViewController() {
            parentVC.addChild(hc)
            hc.didMove(toParent: parentVC)
        }

        self.addSubview(hc.view)
        
        let btnFrame = self.convert(dateRangeButton.frame, from: dateRangeButton.superview)
        let calW: CGFloat = 320
        let calH: CGFloat = 320
        let x = btnFrame.midX - calW/2
        let y = btnFrame.maxY + 8
        hc.view.frame = CGRect(x: x, y: y, width: calW, height: calH)

        // Анимация
        hc.view.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
        hc.view.alpha = 0

        UIView.animate(withDuration: 0.25,
                       delay: 0,
                       options: [.curveEaseOut],
                       animations: {
            hc.view.transform = .identity
            hc.view.alpha = 1
        }, completion: nil)

        // Тап извън календара
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(containerTapped(_:)))
        tapGesture.cancelsTouchesInView = false
        tapGesture.delegate = self // <-- NEW: Задаваме делегат
        self.addGestureRecognizer(tapGesture)

        dateRangeButton.isSelected = true
    }

    private func hideCalendarPopup() {
        guard showCalendar else { return }
        showCalendar = false
        guard let hc = calendarHostingController else {
            dateRangeButton.isSelected = false
            return
        }
        UIView.animate(withDuration: 0.2,
                       delay: 0,
                       options: [.curveEaseIn],
                       animations: {
            hc.view.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
            hc.view.alpha = 0
        }, completion: { _ in
            hc.willMove(toParent: nil)
            hc.view.removeFromSuperview()
            hc.removeFromParent()
        })
        calendarHostingController = nil
        dateRangeButton.isSelected = false
    }
    
    // MARK: - Layout
    
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        if isInSecondPass {
            isInSecondPass = false
        }
        
        guard let navBar = subviews.first(where: {
            $0.frame.origin == .zero && $0.bounds.height == navBarHeight
        }) else {
            return
        }
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        
        let buttonSize: CGFloat = 40
        menuButton.frame = CGRect(
            x: navBar.bounds.width - buttonSize - 8,
            y: (navBarHeight - buttonSize)/2,
            width: buttonSize,
            height: buttonSize
        )
        
        if showSingleDay {
            fromDatePicker.isHidden = false
            dateRangeButton.isHidden = true
            let pickerW: CGFloat = 160
            let pickerH: CGFloat = 40
            let x = (navBar.bounds.width - pickerW) / 2
            let y = (navBar.bounds.height - pickerH) / 2
            fromDatePicker.frame = CGRect(x: x, y: y, width: pickerW, height: pickerH)
        } else {
            fromDatePicker.isHidden = true
            dateRangeButton.isHidden = false
            let btnW: CGFloat = 220
            let btnH: CGFloat = 40
            let x = (navBar.bounds.width - btnW)/2
            let y = (navBarHeight - btnH)/2
            dateRangeButton.frame = CGRect(x: x, y: y, width: btnW, height: btnH)
        }
        
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
        let toOnly   = cal.startOfDay(for: toDate)
        let dayCount = (cal.dateComponents([.day], from: fromOnly, to: toOnly).day ?? 0) + 1
        
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
        
        let allDayY = yMain + daysHeaderHeight
        let oldOffset = allDayScrollView.contentOffset
        let allDayH = allDayView.desiredHeight()
        let allDayFullH = allDayView.contentHeight
        
        allDayTitleLabel.frame = CGRect(x: 0, y: allDayY, width: leftColumnWidth, height: allDayH)
        allDayScrollView.frame = CGRect(x: leftColumnWidth, y: allDayY, width: bounds.width - leftColumnWidth, height: allDayH)
        let totalAllDayWidth = CGFloat(dayCount) * allDayView.dayColumnWidth
        allDayScrollView.contentSize = CGSize(width: totalAllDayWidth, height: allDayFullH)
        allDayView.frame = CGRect(x: 0, y: 0, width: totalAllDayWidth, height: allDayFullH)

        let maxOffsetY = max(0, allDayScrollView.contentSize.height - allDayScrollView.bounds.height)
        var newOffset = oldOffset
        if newOffset.y < 0 { newOffset.y = 0 }
        else if newOffset.y > maxOffsetY { newOffset.y = maxOffsetY }
        allDayScrollView.setContentOffset(newOffset, animated: false)
        
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
        bringSubviewToFront(allDayTitleLabel)
        
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil
        
        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()
        
        allDayView.layoutIfNeeded()
        let newH = allDayView.desiredHeight()
        let newCH = allDayView.contentHeight
        let curH = allDayScrollView.frame.height
        let curCH = allDayScrollView.contentSize.height
        let diff1 = abs(newH - curH)
        let diff2 = abs(newCH - curCH)
        if (diff1 > 0.5 || diff2 > 0.5) && !isInSecondPass {
            isInSecondPass = true
            setNeedsLayout()
            return
        } else {
            isInSecondPass = false
        }
    }
    
    // MARK: - UIScrollViewDelegate
    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            let offsetX = scrollView.contentOffset.x
            daysHeaderScrollView.contentOffset.x = offsetX
            allDayScrollView.contentOffset.x = offsetX
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
        else if scrollView == allDayScrollView {
            let offsetX = scrollView.contentOffset.x
            mainScrollView.contentOffset.x = offsetX
            daysHeaderScrollView.contentOffset.x = offsetX
        }
        else if scrollView == daysHeaderScrollView {
            let offsetX = scrollView.contentOffset.x
            mainScrollView.contentOffset.x = offsetX
            allDayScrollView.contentOffset.x = offsetX
        }
    }
    
    // MARK: - Timer
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
    
    private func refreshDateRangeButtonTitle() {
        if fromDate > toDate {
            dateRangeButton.setTitle("Няма избран период", for: .normal)
        } else {
            let s = fmt(fromDate)
            let e = fmt(toDate)
            if s.isEmpty || e.isEmpty {
                dateRangeButton.setTitle("Няма избран период", for: .normal)
            } else {
                dateRangeButton.setTitle("\(s) - \(e)", for: .normal)
            }
        }
    }

    private func fmt(_ d: Date) -> String {
        let df = DateFormatter()
        df.dateStyle = .medium
        return df.string(from: d)
    }
}

// MARK: - UIGestureRecognizerDelegate
extension TwoWayPinnedMultiDayContainerView: UIGestureRecognizerDelegate { // <-- NEW: делегиране
    public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldReceive touch: UITouch) -> Bool {
        // Ако е натиснато върху dateRangeButton (или негов subview),
        // връщаме false, за да не се извика containerTapped(_:)
        if let tappedView = touch.view,
           tappedView.isDescendant(of: dateRangeButton) {
            return false
        }
        return true
    }
}
