import UIKit
import SwiftUI
import EventKit

// MARK: - TwoWayPinnedMultiDayContainerView
public final class TwoWayPinnedMultiDayContainerView: UIView, UIScrollViewDelegate, UIGestureRecognizerDelegate {

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
    
    /// NEW: Callback при натискане на бутона “+”
    public var onAddNewEvent: (() -> Void)?

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
        // Оцветяваме го в системно синьо
        btn.tintColor = .systemBlue
        return btn
    }()
    
    /// Тук променяме цвета на текста: нормално - сиво; при highlight - синьо.
    private let dateRangeButton: UIButton = {
        let btn = UIButton(type: .custom)
        btn.setTitle("Няма избран период", for: .normal)
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        btn.layer.cornerRadius = 8
        btn.backgroundColor = .systemGray4
        
        // В нормално състояние - сив текст
        btn.setTitleColor(.label, for: .normal)
        // Ако бутонът е "selected" (когато е отворен календарът), искаме също да е сив
        btn.setTitleColor(.systemBlue, for: .selected)
        // При натискане (highlighted) - син текст
        btn.setTitleColor(.systemBlue, for: .highlighted)
        
        return btn
    }()
    
    private let viewMenuButton: UIButton = {
        let btn = UIButton(type: .system)
        let image = UIImage(systemName: "ellipsis.circle")
        btn.setImage(image, for: .normal)
        // Оцветяваме го в системно синьо
        btn.tintColor = .systemBlue
        return btn
    }()
    
    /// NEW: Бутон за “+”, оцветен в системно синьо
    private let addEventButton: UIButton = {
        let btn = UIButton(type: .system)
        let image = UIImage(systemName: "plus")
        btn.setImage(image, for: .normal)
        btn.tintColor = .systemBlue
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
        
        // singleDay button
        navBar.addSubview(singleDayButton)
        singleDayButton.addTarget(self, action: #selector(openSingleDayPicker), for: .touchUpInside)
        
        // dateRange button
        dateRangeButton.addTarget(self, action: #selector(didTapDateRangeButton), for: .touchUpInside)
        navBar.addSubview(dateRangeButton)
        
        // NEW: addEventButton
        navBar.addSubview(addEventButton)
        addEventButton.addTarget(self, action: #selector(addEventButtonTapped), for: .touchUpInside)
        
        // viewMenu button
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
        // Фиксираме височината на 1 час и допълнителни марджини за hoursColumnView и weekView:
        // ------------------------------------------------------------------------------------
        hoursColumnView.hourHeight = 50
        hoursColumnView.extraMarginTopBottom = 10
        
        weekView.hourHeight = 50
        weekView.topMargin = 10
        // ------------------------------------------------------------------------------------
    }
    
    // MARK: - NEW: Бутон "+"
    @objc private func addEventButtonTapped() {
        onAddNewEvent?()
    }
    
    // MARK: - Layout
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        // Намираме навигационната лента (navBar)
        guard let navBar = subviews.first(where: { $0.bounds.height == navBarHeight }) else {
            return
        }
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        
        // Размери за бутоните горе
        let menuBtnSize: CGFloat = 34
        let singleBtnSize: CGFloat = 34
        let plusBtnSize: CGFloat = 34
        let margin: CGFloat = 8
        
        // Позиционираме бутона с трите точки (viewMenuButton) най-вдясно
        let menuButtonX = navBar.bounds.width - menuBtnSize - 10
        let centerY = (navBar.bounds.height - menuBtnSize) / 2
        viewMenuButton.frame = CGRect(
            x: menuButtonX,
            y: centerY,
            width: menuBtnSize,
            height: menuBtnSize
        )
        
        // Ако сме на iOS 14+, обновяваме UIMenu на viewMenuButton
        if #available(iOS 14.0, *) {
            viewMenuButton.menu = buildViewMenu()
        }
        
        // Вляво от бутона с трите точки е бутонът “+”
        let plusButtonX = menuButtonX - plusBtnSize - margin
        addEventButton.frame = CGRect(
            x: plusButtonX,
            y: centerY,
            width: plusBtnSize,
            height: plusBtnSize
        )
        
        // Ако showSingleDay == true, показваме singleDayButton; иначе dateRangeButton
        if showSingleDay {
            singleDayButton.isHidden = false
            dateRangeButton.isHidden = true
            
            // singleDayButton e вляво от “+” бутона
            let singleDayX = plusButtonX - singleBtnSize - margin
            singleDayButton.frame = CGRect(
                x: singleDayX,
                y: centerY,
                width: singleBtnSize,
                height: singleBtnSize
            )
        } else {
            singleDayButton.isHidden = true
            dateRangeButton.isHidden = false
            
            // Центрираме dateRangeButton в navBar
            let btnW: CGFloat = 220
            let btnH: CGFloat = 40
            let x = (navBar.bounds.width - btnW) / 2
            let y = (navBar.bounds.height - btnH) / 2
            dateRangeButton.frame = CGRect(x: x, y: y, width: btnW, height: btnH)
        }
        
        // Продължаваме надолу с позициониране на останалите вюта
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
        
        // All‐day ред
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
        
        // Коригираме вертикалния offset (ако е нужно)
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
        
        // Височина на mainScrollView съдържанието
        // 25 часа (0..24) * височина + topMargin * 2 (горен и долен)
        let totalHours = 25
        let baseHeight = CGFloat(totalHours) * weekView.hourHeight
        let finalHeight = baseHeight + (weekView.topMargin * 2)
        
        let totalWidth  = CGFloat(dayCount) * weekView.dayColumnWidth
        
        mainScrollView.contentSize = CGSize(width: totalWidth, height: finalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: finalHeight)
        
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: finalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: finalHeight)
        
        // Отбелязваме дали текущият ден попада в обхвата
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil
        
        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()
        
        // Ако при layout се окаже, че allDayView е подала нова желана височина,
        // да я реизчислим втори път (но само веднъж, за да не влезем в безкраен цикъл).
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
    
    // MARK: - Timer за периодично опресняване
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
        
        return UIMenu(
            title: "",
            children: [dayAction, multiAction, monthAction, yearAction]
        )
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
        // Ако тапваме извън pop-up-a (hostView)
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
        
        // 1) Създаваме "заден" изглед за целия екран (полупрозрачен):
        let backgroundView = UIView(frame: window.bounds)
        backgroundView.backgroundColor = UIColor.black.withAlphaComponent(0) // Тъмен overlay
        backgroundView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        backgroundView.layer.zPosition = 9998
        window.addSubview(backgroundView)
        calendarBackgroundView = backgroundView
        
        // 2) Създаваме SwiftUI календара (същото както досега), но може да му сложим alpha:
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
        
        // Ако искате и самият календар да е полупрозрачен – слагате alpha:
        hc.view.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.7)
        hc.view.layer.cornerRadius = 12
        hc.view.layer.masksToBounds = true
        hc.view.layer.zPosition = 9999
        self.calendarHostingController = hc
        
        // 3) Позиционираме календара точно под бутона dateRangeButton.
        // Взимаме рамката на бутона спрямо цялото прозорец (window) и
        // показваме календара отдолу, центриран спрямо бутона.
        let buttonFrameInWindow = dateRangeButton.superview?.convert(dateRangeButton.frame, to: window) ?? .zero
        
        let calendarWidth: CGFloat  = 350
        let calendarHeight: CGFloat = 350
        
        // Смятаме X така, че pop-up-ът да е центриран спрямо бутона:
        let xCenter = buttonFrameInWindow.midX - (calendarWidth / 2)
        // Y ще е точно под бутона, плюс малка разредка.
        let yBelowButton = buttonFrameInWindow.maxY + 8
        
        // Ако календарът ще надхвърли десния край на екрана – коригираме:
        var finalX = xCenter
        if (finalX + calendarWidth) > window.bounds.maxX {
            finalX = window.bounds.maxX - calendarWidth - 10
        }
        if finalX < 10 {
            finalX = 10
        }
        
        // Същото и по вертикала (ако е необходимо).
        var finalY = yBelowButton
        if (finalY + calendarHeight) > window.bounds.maxY {
            // Ако няма място надолу, може да го покажете над бутона, примерно:
            finalY = buttonFrameInWindow.minY - calendarHeight - 8
        }
        
        hc.view.frame = CGRect(x: finalX, y: finalY, width: calendarWidth, height: calendarHeight)
        
        // 4) Добавяме го в backgroundView
        backgroundView.addSubview(hc.view)
        
        // Анимация при появяване (лека скала + избледняване)
        hc.view.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
        hc.view.alpha = 0
        backgroundView.alpha = 0
        UIView.animate(withDuration: 0.25, delay: 0, options: [.curveEaseOut], animations: {
            hc.view.transform = .identity
            hc.view.alpha = 1
            backgroundView.alpha = 1
        }, completion: nil)
        
        // 5) Gesture recognizer за "тап извън календара"
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(containerTapped(_:)))
        tapGesture.cancelsTouchesInView = false
        tapGesture.delegate = self
        backgroundView.addGestureRecognizer(tapGesture)
        
        // 6) Маркираме бутона като "selected", докато е отворен календарът
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
        
        // Анимация при скриване
        UIView.animate(withDuration: 0.2, delay: 0, options: [.curveEaseIn], animations: {
            hc.view.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
            hc.view.alpha = 0
            bgView.alpha = 0
        }, completion: { _ in
            hc.view.removeFromSuperview()
            bgView.removeFromSuperview()
            self.calendarBackgroundView = nil
        })
        
        // Бутонът вече не е "selected"
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
    
    // MARK: - UIGestureRecognizerDelegate
    public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer,
                                  shouldReceive touch: UITouch) -> Bool {
        guard let hostingView = calendarHostingController?.view else {
            return true
        }
        // Ако докосваме вътре в календара, да не го затваряме
        if let tappedView = touch.view, tappedView.isDescendant(of: hostingView) {
            return false
        }
        // Ако докосваме самия бутон dateRangeButton, също не го затваряме
        if let tappedView = touch.view, tappedView.isDescendant(of: dateRangeButton) {
            return false
        }
        return true
    }
}
