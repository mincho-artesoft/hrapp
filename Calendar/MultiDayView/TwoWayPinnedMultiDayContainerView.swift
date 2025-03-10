import UIKit
import SwiftUI
import EventKit

// MARK: - TwoWayPinnedMultiDayContainerView
public final class TwoWayPinnedMultiDayContainerView: UIView, UIScrollViewDelegate {

    // MARK: - Public configuration
    public var showSingleDay: Bool = false {
        didSet {
            if showSingleDay {
                toDate = fromDate
            }
            setNeedsLayout()
        }
    }
    
    public var currentView: Int = 3
    public var onViewChange: ((Int) -> Void)?
    
    public var fromDate: Date = Date() {
        didSet {
            refreshDateRangeButtonTitle()
            daysHeaderView.fromDate = fromDate
            allDayView.fromDate = fromDate
            weekView.fromDate = fromDate
            
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
    
    // MARK: - Subviews
    public let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()
    
    fileprivate let daysHeaderScrollView = UIScrollView()
    fileprivate let daysHeaderView = DaysHeaderView()
    
    fileprivate let cornerView = UIView()
    
    public let allDayScrollView = UIScrollView()
    public let allDayView = AllDayView()
    
    public let allDayTitleLabel = UILabel()
    
    public let mainScrollView = UIScrollView()
    public let weekView = MultiDayTimelineView()
    
    // MARK: - "Nav bar" (top area)
    private let singleDayButton: UIButton = {
        let btn = UIButton(type: .system)
        btn.setImage(UIImage(systemName: "calendar"), for: .normal)
        btn.tintColor = .label
        return btn
    }()
    
    private let dateRangeButton: UIButton = {
        let btn = UIButton(type: .custom)
        btn.setTitle("Няма избран период", for: .normal)
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        btn.layer.cornerRadius = 8
        btn.backgroundColor = .systemGray4
        btn.setTitleColor(.label, for: .normal)
        btn.setTitleColor(.systemBlue, for: .selected)
        return btn
    }()
    
    private let viewMenuButton: UIButton = {
        let btn = UIButton(type: .system)
        let image = UIImage(systemName: "ellipsis.circle")
        btn.setImage(image, for: .normal)
        btn.tintColor = .label
        return btn
    }()
    
    // MARK: - Private constants & variables
    fileprivate let navBarHeight: CGFloat = 50
    fileprivate let daysHeaderHeight: CGFloat = 20
    fileprivate let leftColumnWidth: CGFloat = 60
    
    private let topBorder = CALayer()
    private let bottomBorder = CALayer()
    
    private var showCalendar = false
    private var calendarHostingController: UIHostingController<CalendarDateRangePickerWrapper>?
    private var calendarBackgroundView: UIView?
    
    private var redrawTimer: Timer?
    private var isInSecondPass = false
    
    // MARK: - Lifecycle
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
        clipsToBounds = true
        
        // 1) mainScrollView
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.bounces = false
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)
        
        // 2) allDayScrollView
        allDayScrollView.delegate = self
        allDayScrollView.showsHorizontalScrollIndicator = false
        allDayScrollView.showsVerticalScrollIndicator = true
        allDayScrollView.alwaysBounceHorizontal = false
        allDayScrollView.alwaysBounceVertical = false
        allDayScrollView.bounces = false
        allDayScrollView.addSubview(allDayView)
        addSubview(allDayScrollView)
        
        // 3) hoursColumnScrollView
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)
        
        // 4) daysHeaderScrollView
        daysHeaderScrollView.showsVerticalScrollIndicator = false
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = true
        daysHeaderScrollView.delegate = self
        daysHeaderScrollView.backgroundColor = .secondarySystemBackground
        daysHeaderScrollView.bounces = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)
        
        // 5) cornerView
        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)
        
        // 6) allDayTitleLabel
        allDayTitleLabel.text = "  all-day"
        allDayTitleLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        allDayTitleLabel.backgroundColor = .secondarySystemBackground
        addSubview(allDayTitleLabel)
        
        topBorder.backgroundColor = UIColor.lightGray.cgColor
        allDayTitleLabel.layer.addSublayer(topBorder)
        
        bottomBorder.backgroundColor = UIColor.lightGray.cgColor
        allDayTitleLabel.layer.addSublayer(bottomBorder)
        
        // 7) The "Nav bar" up top
        let navBar = UIView()
        navBar.backgroundColor = .secondarySystemBackground
        addSubview(navBar)
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]
        
        navBar.addSubview(singleDayButton)
        singleDayButton.addTarget(self, action: #selector(openSingleDayPicker), for: .touchUpInside)
        
        dateRangeButton.addTarget(self, action: #selector(didTapDateRangeButton), for: .touchUpInside)
        navBar.addSubview(dateRangeButton)
        
        if #available(iOS 14.0, *) {
            viewMenuButton.showsMenuAsPrimaryAction = true
        } else {
            viewMenuButton.addTarget(self, action: #selector(legacyMenuTapped), for: .touchUpInside)
        }
        navBar.addSubview(viewMenuButton)
        
        // 8) Layout in subviews
        daysHeaderView.leadingInsetForHours = 0
        allDayView.leadingInsetForHours = 0
        weekView.leadingInsetForHours = 0
        
        weekView.hoursColumnView = hoursColumnView
        
        weekView.onEventConvertToAllDay = { [weak self] descriptor, dayIndex in
            guard let self = self else { return }
            let cal = Calendar.current
            let fromOnly = cal.startOfDay(for: self.fromDate)
            if let newDayDate = cal.date(byAdding: .day, value: dayIndex, to: fromOnly) {
                descriptor.isAllDay = true
                let startOfDay = cal.startOfDay(for: newDayDate)
                let endOfDay   = cal.date(byAdding: .day, value: 1, to: startOfDay)!
                
                descriptor.dateInterval = DateInterval(start: startOfDay, end: endOfDay)
                self.allDayView.onEventDragEnded?(descriptor, startOfDay, false)
                self.setNeedsLayout()
            }
        }
        
        // ------------------------------------------------------------------------------------
        // FIX: Задаваме еднакви hourHeight и "margin" и за hoursColumnView, и за weekView:
        // ------------------------------------------------------------------------------------
        hoursColumnView.hourHeight = 50
        hoursColumnView.extraMarginTopBottom = 10
        
        weekView.hourHeight = 50
        weekView.topMargin = 10
        // ------------------------------------------------------------------------------------
    }
    
    // MARK: - Layout
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        guard let navBar = subviews.first(where: { $0.bounds.height == navBarHeight }) else {
            return
        }
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        
        // Логика за позиция на бутоните singleDayButton/viewMenuButton...
        let menuBtnSize: CGFloat = 34
        let singleBtnSize: CGFloat = 34
        let margin: CGFloat = 8
        
        let menuButtonX = navBar.bounds.width - menuBtnSize - 10
        let centerY = (navBar.bounds.height - menuBtnSize) / 2
        
        viewMenuButton.frame = CGRect(
            x: menuButtonX,
            y: centerY,
            width: menuBtnSize,
            height: menuBtnSize
        )
        
        if #available(iOS 14.0, *) {
            viewMenuButton.menu = buildViewMenu()
        }
        
        if showSingleDay {
            singleDayButton.isHidden = false
            dateRangeButton.isHidden = true
            
            let singleDayX = menuButtonX - singleBtnSize - margin
            let singleDayY = (navBar.bounds.height - singleBtnSize) / 2
            singleDayButton.frame = CGRect(
                x: singleDayX,
                y: singleDayY,
                width: singleBtnSize,
                height: singleBtnSize
            )
        } else {
            singleDayButton.isHidden = true
            dateRangeButton.isHidden = false
            
            let btnW: CGFloat = 220
            let btnH: CGFloat = 40
            let x = (navBar.bounds.width - btnW) / 2 - 20
            let y = (navBar.bounds.height - btnH) / 2
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
            weekView.dayColumnWidth       = newDayColumnWidth
            daysHeaderView.dayColumnWidth = newDayColumnWidth
            allDayView.dayColumnWidth     = newDayColumnWidth
        } else {
            weekView.dayColumnWidth       = 100
            daysHeaderView.dayColumnWidth = 100
            allDayView.dayColumnWidth     = 100
        }
        
        let totalDaysHeaderWidth = CGFloat(dayCount) * daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(width: totalDaysHeaderWidth, height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0, width: totalDaysHeaderWidth, height: daysHeaderHeight)
        
        // All‐day row
        let allDayY = yMain + daysHeaderHeight
        let oldOffset = allDayScrollView.contentOffset
        
        let allDayH = allDayView.desiredHeight()
        let allDayFullH = allDayView.contentHeight
        
        allDayTitleLabel.frame = CGRect(x: 0, y: allDayY, width: leftColumnWidth, height: allDayH)
        allDayScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: allDayY,
            width: bounds.width - leftColumnWidth,
            height: allDayH
        )
        
        let totalAllDayWidth = CGFloat(dayCount) * allDayView.dayColumnWidth
        allDayScrollView.contentSize = CGSize(width: totalAllDayWidth, height: allDayFullH)
        allDayView.frame = CGRect(x: 0, y: 0, width: totalAllDayWidth, height: allDayFullH)
        
        let superThin = 1 / UIScreen.main.scale
        topBorder.frame = CGRect(
            x: 0,
            y: 0,
            width: allDayTitleLabel.bounds.width,
            height: superThin
        )
        bottomBorder.frame = CGRect(
            x: 0,
            y: allDayTitleLabel.bounds.height - superThin,
            width: allDayTitleLabel.bounds.width,
            height: superThin
        )
        
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
        
        // ------------------------------------------------------------------------------------
        // FIX: Вместо директно "25 * hourHeight", вадим topMargin от weekView:
        // ------------------------------------------------------------------------------------
        let totalHours = 25  // 0..24
        let baseHeight = CGFloat(totalHours) * weekView.hourHeight
        let finalHeight = baseHeight + (weekView.topMargin * 2) // горен + долен отстъп
        
        let totalWidth  = CGFloat(dayCount) * weekView.dayColumnWidth
        
        mainScrollView.contentSize = CGSize(width: totalWidth, height: finalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: finalHeight)
        
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: finalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: finalHeight)
        // ------------------------------------------------------------------------------------
        
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil
        
        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()
        
        if isInSecondPass {
            isInSecondPass = false
        } else {
            let newH = allDayView.desiredHeight()
            let newCH = allDayView.contentHeight
            let diff1 = abs(newH - allDayScrollView.frame.height)
            let diff2 = abs(newCH - allDayScrollView.contentSize.height)
            if (diff1 > 0.5 || diff2 > 0.5) {
                isInSecondPass = true
                setNeedsLayout()
            }
        }
    }

    // MARK: - UIScrollViewDelegate
    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x     = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
        else if scrollView == daysHeaderScrollView {
            mainScrollView.contentOffset.x = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x = scrollView.contentOffset.x
        }
        else if scrollView == allDayScrollView {
            mainScrollView.contentOffset.x = scrollView.contentOffset.x
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
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
    
    // MARK: - iOS 14+ menu
    @available(iOS 14.0, *)
    private func buildViewMenu() -> UIMenu {
        let dayAction = UIAction(
            title: "Day",
            state: (currentView == 1 ? .on : .off)
        ) { [weak self] _ in
            self?.showSingleDay = true
            self?.onViewChange?(1)
        }
        
        let multiAction = UIAction(
            title: "MultiDay",
            state: (currentView == 3 ? .on : .off)
        ) { [weak self] _ in
            self?.showSingleDay = false
            self?.onViewChange?(3)
        }
        
        let monthAction = UIAction(
            title: "Month",
            state: (currentView == 0 ? .on : .off)
        ) { [weak self] _ in
            self?.onViewChange?(0)
        }
        
        let yearAction = UIAction(
            title: "Year",
            state: (currentView == 2 ? .on : .off)
        ) { [weak self] _ in
            self?.onViewChange?(2)
        }
        
        return UIMenu(title: "", children: [dayAction, multiAction, monthAction, yearAction])
    }
    
    // MARK: - Legacy menu (iOS < 14)
    @objc private func legacyMenuTapped() {
        let sheet = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        
        sheet.addAction(UIAlertAction(title: "Day", style: .default, handler: { [weak self] _ in
            self?.showSingleDay = true
            self?.onViewChange?(1)
        }))
        sheet.addAction(UIAlertAction(title: "MultiDay", style: .default, handler: { [weak self] _ in
            self?.showSingleDay = false
            self?.onViewChange?(3)
        }))
        sheet.addAction(UIAlertAction(title: "Month", style: .default, handler: { [weak self] _ in
            self?.onViewChange?(0)
        }))
        sheet.addAction(UIAlertAction(title: "Year", style: .default, handler: { [weak self] _ in
            self?.onViewChange?(2)
        }))
        sheet.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        
        if let windowScene = UIApplication.shared.connectedScenes
            .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
           let topVC = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController {
            sheet.popoverPresentationController?.sourceView = topVC.view
            topVC.present(sheet, animated: true, completion: nil)
        }
    }
    
    // MARK: - Показване / скриване на pop-up (SwiftUI range picker)
    @objc private func didTapDateRangeButton() {
        if showCalendar {
            hideCalendarPopup()
        } else {
            showCalendarPopupOnWindow()
        }
    }
    
    @objc private func containerTapped(_ sender: UITapGestureRecognizer) {
        guard
            let backgroundView = calendarBackgroundView,
            let hostingView = calendarHostingController?.view
        else { return }
        
        let location = sender.location(in: backgroundView)
        if !hostingView.frame.contains(location) {
            hideCalendarPopup()
        }
    }
    
    private func showCalendarPopupOnWindow() {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first else {
            print("No active UIWindow found.")
            return
        }
        guard !showCalendar else { return }
        showCalendar = true
        
        let backgroundView = UIView(frame: window.bounds)
        backgroundView.backgroundColor = .clear
        backgroundView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        backgroundView.layer.zPosition = 9998
        window.addSubview(backgroundView)
        calendarBackgroundView = backgroundView
        
        let swiftUICalendar = CalendarDateRangePickerWrapper(
            startDate: fromDate,
            endDate: toDate,
            minimumDate: nil,
            maximumDate: nil,
            selectedColor: .systemBlue
        ) { [weak self] newStart, newEnd in
            guard let self = self else { return }
            self.fromDate = newStart
            self.toDate   = newEnd
            self.onRangeChange?(self.fromDate, self.toDate)
        }
        
        let hc = UIHostingController(rootView: swiftUICalendar)
        hc.view.backgroundColor = UIColor.systemBackground
        hc.view.layer.cornerRadius = 12
        hc.view.layer.masksToBounds = true
        hc.view.layer.zPosition = 9999
        self.calendarHostingController = hc
        
        let hostingView = hc.view!
        let size: CGFloat = 350
        hostingView.frame = CGRect(
            x: (backgroundView.bounds.width - size) / 2,
            y: (backgroundView.bounds.height - size) / 2,
            width: size,
            height: size
        )
        backgroundView.addSubview(hostingView)
        
        hostingView.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
        hostingView.alpha = 0
        backgroundView.alpha = 0
        UIView.animate(withDuration: 0.25, delay: 0, options: [.curveEaseOut], animations: {
            hostingView.transform = .identity
            hostingView.alpha = 1
            backgroundView.alpha = 1
        }, completion: nil)
        
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(containerTapped(_:)))
        tapGesture.cancelsTouchesInView = false
        tapGesture.delegate = self
        backgroundView.addGestureRecognizer(tapGesture)
        
        dateRangeButton.isSelected = true
    }
    
    private func hideCalendarPopup() {
        guard showCalendar else { return }
        showCalendar = false
        
        guard
            let hc = calendarHostingController,
            let bgView = calendarBackgroundView
        else {
            dateRangeButton.isSelected = false
            return
        }
        
        UIView.animate(withDuration: 0.2, delay: 0, options: [.curveEaseIn], animations: {
            hc.view.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
            hc.view.alpha = 0
            bgView.alpha = 0
        }, completion: { _ in
            hc.view.removeFromSuperview()
            bgView.removeFromSuperview()
            self.calendarBackgroundView = nil
        })
        
        calendarHostingController = nil
        dateRangeButton.isSelected = false
    }
    
    // MARK: - Helper
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
    
    // MARK: - Single‐day DatePicker popup
    @objc private func openSingleDayPicker() {
        let alert = UIAlertController(title: "Избери ден", message: nil, preferredStyle: .actionSheet)
        
        if let popover = alert.popoverPresentationController {
            popover.sourceView = singleDayButton
            popover.sourceRect = singleDayButton.bounds
        }

        let pickerVC = UIViewController()
        pickerVC.preferredContentSize = CGSize(width: 250, height: 200)
        
        let picker = UIDatePicker()
        picker.datePickerMode = .date
        if #available(iOS 14.0, *) {
            picker.preferredDatePickerStyle = .wheels
        }
        picker.date = fromDate
        picker.translatesAutoresizingMaskIntoConstraints = false
        
        pickerVC.view.addSubview(picker)
        NSLayoutConstraint.activate([
            picker.centerXAnchor.constraint(equalTo: pickerVC.view.centerXAnchor),
            picker.centerYAnchor.constraint(equalTo: pickerVC.view.centerYAnchor)
        ])
        
        alert.setValue(pickerVC, forKey: "contentViewController")
        
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { [weak self] _ in
            guard let self = self else { return }
            let pickedDate = picker.date
            self.fromDate = pickedDate
            self.toDate   = pickedDate
            self.onRangeChange?(pickedDate, pickedDate)
            self.setNeedsLayout()
        }))
        
        alert.addAction(UIAlertAction(title: "Отказ", style: .cancel, handler: nil))
        
        if let windowScene = UIApplication.shared.connectedScenes
            .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
           let topVC = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController {
            topVC.present(alert, animated: true, completion: nil)
        }
    }
}

// MARK: - UIGestureRecognizerDelegate
extension TwoWayPinnedMultiDayContainerView: UIGestureRecognizerDelegate {
    public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer,
                                  shouldReceive touch: UITouch) -> Bool {
        guard let hostingView = calendarHostingController?.view else {
            return true
        }
        if let tappedView = touch.view, tappedView.isDescendant(of: hostingView) {
            return false
        }
        if let tappedView = touch.view, tappedView.isDescendant(of: dateRangeButton) {
            return false
        }
        return true
    }
}
