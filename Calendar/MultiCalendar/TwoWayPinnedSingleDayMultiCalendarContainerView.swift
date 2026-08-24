import UIKit
import SwiftUI
import EventKit
import EventKitUI

//
// MARK: - TwoWayPinnedSingleDayMultiCalendarContainerView
//
public final class TwoWayPinnedSingleDayMultiCalendarContainerView: UIView,
                                                                  UIScrollViewDelegate,
                                                                  UIGestureRecognizerDelegate,
                                                                  UISearchBarDelegate
{
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared
    // Най-горе при другите свойства
    private var calendarsChangedObserver: NSObjectProtocol?
    private var didScrollToNow = false

    // ---------------------------------------------------------
    // MARK: - Променливи свързани с календарите
    // ---------------------------------------------------------
    
    /// Взимаме ViewModel, за да заредим списък с календари.
    private let calendarVM = CalendarViewModel.shared
    
    /// Callback, който ще извикаме, когато потребителят промени селекцията на календари
    public var onCalendarsSelectionChanged: (() -> Void)?
    
    // Dropdown + background
    private var dropdownBackgroundView: UIView?
    
    public var currentView: Int = 1
    public var onViewChange: ((Int) -> Void)?
    
    public var fromDate: Date = Date() {
        didSet {
            daysHeaderView.fromDate = fromDate
            allDayView.fromDate     = fromDate
            weekView.fromDate       = fromDate
            
            setNeedsLayout()
        }
    }
    
    public var onRangeChange: ((Date, Date) -> Void)?
    
    public var onEventTap: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventTap   = onEventTap
            allDayView.onEventTap = onEventTap
        }
    }
    public var onEventDeleted: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventDeleted = onEventDeleted
        }
    }
    public var onEventDuplicated: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventDuplicated = onEventDuplicated
        }
    }
    public var onEmptyLongPress: ((Date, EKCalendar?) -> Void)? {
        didSet {
            weekView.onEmptyLongPress   = onEmptyLongPress
            allDayView.onEmptyLongPress = onEmptyLongPress
        }
    }
    public var onEventDragEnded: ((EventDescriptor, Date, Bool) -> Void)? {
        didSet {
            weekView.onEventDragEnded   = onEventDragEnded
            allDayView.onEventDragEnded = onEventDragEnded
        }
    }
    
    public var onEventsReload: (() -> Void)? {
        didSet {
            weekView.onEventDragEnded   = onEventDragEnded
            allDayView.onEventDragEnded = onEventDragEnded
        }
    }
    
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)? {
        didSet {
            weekView.onEventDragResizeEnded   = onEventDragResizeEnded
            allDayView.onEventDragResizeEnded = onEventDragResizeEnded
        }
    }
    public var onDayLabelTap: ((Date) -> Void)? {
        didSet { daysHeaderView.onDayTap = onDayLabelTap }
    }
    public var onMonthLabelTap: ((Date) -> Void)?
    public var onAddNewEvent: (() -> Void)?
    
    // ---------------------------------------------------------
    // MARK: - UI компоненти (scroll views, labels, пр.)
    // ---------------------------------------------------------
    public let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView       = HoursColumnView()
    
    fileprivate let daysHeaderScrollView = UIScrollView()
    fileprivate let daysHeaderView       = DaysHeaderView()
    fileprivate let cornerView           = UIView()
    
    public let allDayScrollView = UIScrollView()
    public let allDayView       = AllDayMultiCalendarView()
    public let allDayTitleLabel = UILabel()
    
    public let mainScrollView = UIScrollView()
    public let weekView       = SingleDayTimelineMultiCalendarView()
    
    // Горна лента (navBar)
    private let navBar = UIView()
    
    private let monthLabel: UILabel = {
        let label = UILabel()
        label.text = ""
        label.font = .systemFont(ofSize: 16, weight: .medium)
        label.textColor = .label
        label.isHidden  = true
        label.isUserInteractionEnabled = true
        return label
    }()
    
    private let singleDayCarousel: WeekCarouselView = {
        let view = WeekCarouselView()
        view.backgroundColor = .secondarySystemBackground
        view.isHidden = true
        return view
    }()
    
    private let viewMenuButton: UIButton = {
        let btn = UIButton(type: .system)
        let image = UIImage(systemName: "ellipsis.circle")
        btn.setImage(image, for: .normal)
        btn.tintColor = .systemBlue
        return btn
    }()
    
//    private let addEventButton: UIButton = {
//        let btn = UIButton(type: .system)
//        let image = UIImage(systemName: "plus")
//        btn.setImage(image, for: .normal)
//        btn.tintColor = .systemBlue
//        return btn
//    }()
    
    // Търсене
    private let searchButton: UIButton = {
        let btn = UIButton(type: .custom)
        let image = CalendarSearchAppearance.iconImage.withRenderingMode(.alwaysTemplate)
        btn.setImage(image, for: .normal)
        btn.imageView?.contentMode = .center
        btn.tintColor = .systemBlue
        return btn
    }()

    private let closeSearchButton: UIButton = {
        let btn = UIButton(type: .system)
        let image = UIImage(systemName: "xmark")
        btn.setImage(image, for: .normal)
        btn.tintColor = .secondaryLabel
        btn.isHidden = true
        return btn
    }()
    
    private let searchBar: UISearchBar = {
        let sb = UISearchBar()
        sb.placeholder = NSLocalizedString("Search events...", comment: "")
        sb.isHidden = false
        sb.searchBarStyle = .default
        sb.backgroundImage = UIImage()
        sb.barTintColor = .systemGray5
        sb.backgroundColor = .systemGray5
        sb.isTranslucent = false
        sb.tintColor = .systemBlue
        sb.layer.cornerRadius = 8
        sb.layer.masksToBounds = true
        
        if #available(iOS 13.0, *) {
            let textField = sb.searchTextField
            textField.leftViewMode = .never
            textField.backgroundColor = .systemGray5
            textField.layer.cornerRadius = 8
            textField.layer.masksToBounds = true
            textField.font = UIFont.systemFont(ofSize: 16)
            textField.adjustsFontSizeToFitWidth = true
            textField.minimumFontSize = 10
            textField.attributedPlaceholder = NSAttributedString(
                string: NSLocalizedString("Search events...", comment: "Search events placeholder"),
                attributes: [.foregroundColor: UIColor.secondaryLabel]
            )
        }
        return sb
    }()
    
    // ---------------------------------------------------------
    // MARK: - Layout constants
    // ---------------------------------------------------------
    fileprivate let navBarHeight: CGFloat     = 50
    fileprivate let daysHeaderHeight: CGFloat = 20
    fileprivate let leftColumnWidth: CGFloat  = 60
    fileprivate let bottomScrollPadding: CGFloat = 50

    private var usesRightToLeftLayout: Bool {
        effectiveUserInterfaceLayoutDirection == .rightToLeft
    }
    
    private let topBorder    = CALayer()
    private let bottomBorder = CALayer()
    
    private var showCalendar = false
    private var calendarBackgroundView: UIView?
    
    private var redrawTimer: Timer?
    private var isInSecondPass = false
    private var lastHorizontalContentWidth: CGFloat = -1
    private var lastHorizontalLayoutWasRTL: Bool?
    private let topBackgroundView = UIView()
    private let calendarHeaderBackgroundView = UIView()

    // ---------------------------------------------------------
    // MARK: - Втори хедър за календари
    // ---------------------------------------------------------
    // Увеличихме височината с 10 пиксела (от 20 на 30)
    fileprivate let calendarsHeaderScrollView = UIScrollView()
    fileprivate let calendarsHeaderView       = CalendarsHeaderView()
    fileprivate let calendarsHeaderHeight: CGFloat = 30
    
    // ---------------------------------------------------------
    // MARK: - Инициализация
    // ---------------------------------------------------------
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()

        // 👉 selector-вариант
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleCalendarsSelectionChanged),
            name: .calendarsSelectionChanged,
            object: nil
        )

        updateCalendarsHeader()   // показваме текущите календари
        startRedrawTimer()
    }


    @objc private func handleCalendarsSelectionChanged(_ note: Notification) {
        Task { @MainActor in
            onEventsReload!()
            
            updateCalendarsHeader()
        }
    }

    @MainActor
    private func updateCalendarsHeader() {
        calendarsHeaderView.calendarsDict = calendarVM.calendarsDict
        setNeedsLayout()          // safe, вече сме на Main actor
        layoutIfNeeded()
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
        
        // (НОВО) Задаваме списъка с календари от ViewModel
        calendarsHeaderView.calendarsDict = calendarVM.calendarsDict
        
        startRedrawTimer()
    }
    
    deinit {
        redrawTimer?.invalidate()
        NotificationCenter.default.removeObserver(self)
    }

    // ---------------------------------------------------------
    // MARK: - Setup на под-views
    // ---------------------------------------------------------
    private func setupViews() {
        backgroundColor = .systemBackground
        clipsToBounds   = true
        
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator   = true
        mainScrollView.bounces = false
        mainScrollView.contentInsetAdjustmentBehavior = .never
        mainScrollView.layer.zPosition = 1
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)
        
        allDayScrollView.delegate = self
        allDayScrollView.showsHorizontalScrollIndicator = false
        allDayScrollView.showsVerticalScrollIndicator   = true
        allDayScrollView.alwaysBounceHorizontal = false
        allDayScrollView.alwaysBounceVertical   = false
        allDayScrollView.bounces = false
        allDayScrollView.contentInsetAdjustmentBehavior = .never
        allDayScrollView.layer.zPosition = 2
        allDayScrollView.addSubview(allDayView)
        addSubview(allDayScrollView)
        
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.contentInsetAdjustmentBehavior = .never
        hoursColumnScrollView.addSubview(hoursColumnView)
        hoursColumnScrollView.layer.zPosition = 3
        addSubview(hoursColumnScrollView)
        
        daysHeaderScrollView.showsVerticalScrollIndicator   = false
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = true
        daysHeaderScrollView.delegate = self
        daysHeaderScrollView.backgroundColor = .secondarySystemBackground
        daysHeaderScrollView.bounces = false
        daysHeaderScrollView.contentInsetAdjustmentBehavior = .never
        daysHeaderScrollView.addSubview(daysHeaderView)
        daysHeaderScrollView.layer.zPosition = 4
        addSubview(daysHeaderScrollView)
        
        cornerView.backgroundColor = .secondarySystemBackground
        cornerView.layer.zPosition = 5
        addSubview(cornerView)
        
        allDayTitleLabel.text = " " + NSLocalizedString("all-day", comment: "")
        allDayTitleLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        allDayTitleLabel.useAdaptiveSingleLine(minimumScale: 0.4)
        allDayTitleLabel.backgroundColor = .secondarySystemBackground
        allDayTitleLabel.layer.zPosition = 6
        addSubview(allDayTitleLabel)
        
        topBorder.backgroundColor    = UIColor.lightGray.cgColor
        bottomBorder.backgroundColor = UIColor.lightGray.cgColor
        allDayTitleLabel.layer.addSublayer(topBorder)
        allDayTitleLabel.layer.addSublayer(bottomBorder)
        
        navBar.backgroundColor = .secondarySystemBackground
        navBar.layer.zPosition = 7
        addSubview(navBar)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]
        
        navBar.addSubview(monthLabel)
        let monthLabelTapGesture = UITapGestureRecognizer(target: self, action: #selector(monthLabelTapped))
        monthLabel.addGestureRecognizer(monthLabelTapGesture)
        
        addSubview(singleDayCarousel)
        singleDayCarousel.onDaySelected = { [weak self] date in
            guard let self = self else { return }
            self.fromDate = date
            self.onRangeChange?(date, date)
            self.setNeedsLayout()
        }
        
//        navBar.addSubview(addEventButton)
//        addEventButton.addTarget(self, action: #selector(addEventButtonTapped), for: .touchUpInside)
        
        updateButtonIconForCurrentView()
        if #available(iOS 14.0, *) {
            viewMenuButton.showsMenuAsPrimaryAction = true
            viewMenuButton.menu = buildViewMenu()
        }
        navBar.addSubview(viewMenuButton)
        
        navBar.addSubview(searchButton)
        searchButton.addTarget(self, action: #selector(searchButtonTapped), for: .touchUpInside)
        
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
        
        // Настройки за HoursColumn и Timeline
        hoursColumnView.hourHeight          = 50
        hoursColumnView.extraMarginTopBottom = 10
        
        weekView.hourHeight = 50
        weekView.topMargin  = 10
        
        topBackgroundView.backgroundColor = .secondarySystemBackground
        addSubview(topBackgroundView)
        calendarHeaderBackgroundView.backgroundColor = .secondarySystemBackground
        addSubview(calendarHeaderBackgroundView)
        // (НОВО) Setup за втория хедър (ScrollView + View)
        calendarsHeaderScrollView.showsHorizontalScrollIndicator = false
        calendarsHeaderScrollView.showsVerticalScrollIndicator   = false
        calendarsHeaderScrollView.bounces = false
        calendarsHeaderScrollView.delegate = self
        calendarsHeaderScrollView.contentInsetAdjustmentBehavior = .never
        calendarsHeaderScrollView.layer.zPosition = 4
        addSubview(calendarsHeaderScrollView)
        
        calendarsHeaderScrollView.addSubview(calendarsHeaderView)
    }
    
    // ---------------------------------------------------------
    // MARK: - Layout
    // ---------------------------------------------------------
    @objc private func monthLabelTapped() {
        onMonthLabelTap?(fromDate)
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        
        let isLandscape = bounds.width > bounds.height
        let isRTL = usesRightToLeftLayout
        let topOffset: CGFloat = isLandscape ? 0 : 53.5
        
        topBackgroundView.frame = CGRect(x: 0, y: 0, width: bounds.width, height: topOffset)
        topBackgroundView.layer.zPosition = 3

        navBar.frame = CGRect(x: 0, y: topOffset, width: bounds.width - 2, height: navBarHeight)
        
        if !isLandscape {
            let df = appDateFormatter(template: "LLLL")
            monthLabel.text = df.string(from: fromDate)
            monthLabel.textColor = .systemBlue
            monthLabel.useAdaptiveSingleLine(minimumScale: 0.4)
            monthLabel.isHidden = false
        } else {
            monthLabel.isHidden = true
        }
        
        let menuBtnSize: CGFloat   = 34
        let searchBtnSize = CalendarSearchAppearance.buttonSize
        let margin:  CGFloat       = 8
        
        let menuButtonX = isRTL ? 10 : navBar.bounds.width - menuBtnSize - 10
        let centerY = (navBar.bounds.height - menuBtnSize) / 2
        viewMenuButton.frame = CGRect(
            x: menuButtonX,
            y: centerY,
            width: menuBtnSize,
            height: menuBtnSize
        )
        updateButtonIconForCurrentView()
        if #available(iOS 14.0, *) {
            viewMenuButton.menu = buildViewMenu()
        }
        
        let searchButtonX = isRTL
            ? menuButtonX + menuBtnSize + margin
            : menuButtonX - searchBtnSize - margin
        let searchCenterY = (navBar.bounds.height - searchBtnSize) / 2
        searchButton.frame = CGRect(
            x: searchButtonX,
            y: searchCenterY,
            width: searchBtnSize,
            height: searchBtnSize
        )
        closeSearchButton.frame = CGRect(
            x: isRTL ? 10 : navBar.bounds.width - searchBtnSize - 10,
            y: searchCenterY,
            width: searchBtnSize,
            height: searchBtnSize
        )

        if !isLandscape {
            let labelLeading: CGFloat = 10
            let labelTrailing = isRTL
                ? navBar.bounds.width - (searchButtonX + searchBtnSize + margin)
                : searchButtonX - margin
            let availableMonthWidth = max(0, labelTrailing - labelLeading)
            monthLabel.frame = CGRect(
                x: isRTL ? navBar.bounds.width - labelLeading - availableMonthWidth : labelLeading,
                y: 0,
                width: availableMonthWidth,
                height: navBar.bounds.height
            )
            monthLabel.textAlignment = isRTL ? .right : .left
        }
        
        var singleDayCarouselHeight: CGFloat = 70
        singleDayCarousel.isHidden = false
        if isLandscape {
            singleDayCarousel.isHidden = true
            singleDayCarouselHeight = 0
        }
        singleDayCarousel.layer.zPosition = 8
        let singleDayCarouselY = navBar.frame.maxY
        singleDayCarousel.frame = CGRect(
            x: 0,
            y: singleDayCarouselY,
            width: bounds.width,
            height: singleDayCarouselHeight
        )
        singleDayCarousel.selectedDate = fromDate
        
        let yMain = singleDayCarousel.frame.maxY
        let hoursColumnX = isRTL ? bounds.width - leftColumnWidth : 0
        let timelineX: CGFloat = isRTL ? 0 : leftColumnWidth
        
        cornerView.frame = CGRect(
            x: hoursColumnX,
            y: yMain,
            width: leftColumnWidth,
            height: daysHeaderHeight
        )
        
        daysHeaderScrollView.frame = CGRect(
            x: timelineX,
            y: yMain,
            width: bounds.width - leftColumnWidth,
            height: daysHeaderHeight
        )
        
        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: fromDate)
        
        let availableWidth = bounds.width - leftColumnWidth
        let selectedCalendarCount = calendarVM.calendarsDict.values.filter { $0.selected }.count
        let displayedCalendarCount = max(
            1,
            selectedCalendarCount == 0 ? calendarVM.calendarsDict.count : selectedCalendarCount
        )
        let fullyVisibleCalendarLimit = isLandscape ? 10 : 8
        let totalCalendarWidth: CGFloat
        if displayedCalendarCount <= fullyVisibleCalendarLimit {
            totalCalendarWidth = availableWidth
        } else {
            totalCalendarWidth = max(
                availableWidth,
                CGFloat(displayedCalendarCount) * 52
            )
        }

        weekView.dayColumnWidth       = totalCalendarWidth
        daysHeaderView.dayColumnWidth = totalCalendarWidth
        allDayView.dayColumnWidth     = totalCalendarWidth
        
        let totalDaysHeaderWidth = daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(width: totalDaysHeaderWidth, height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0,
                                      width: totalDaysHeaderWidth,
                                      height: daysHeaderHeight)
        
        // Втори хедър за календари под daysHeaderScrollView
        let calendarsHeaderY = daysHeaderScrollView.frame.maxY
        calendarsHeaderScrollView.frame = CGRect(
            x: timelineX,
            y: calendarsHeaderY,
            width: bounds.width - leftColumnWidth,
            height: calendarsHeaderHeight
        )
        calendarHeaderBackgroundView.frame = CGRect(x: 0, y: calendarsHeaderY, width: bounds.width, height: calendarsHeaderHeight)
        calendarHeaderBackgroundView.layer.zPosition = 3
        calendarsHeaderScrollView.contentSize = CGSize(
            width: totalDaysHeaderWidth,
            height: calendarsHeaderHeight
        )
        
        calendarsHeaderView.frame = CGRect(
            x: 0,
            y: 0,
            width: totalDaysHeaderWidth,
            height: calendarsHeaderHeight
        )
        
        allDayView.recalcAllDayHeightDynamically()
        // Отместваме AllDay под втория хедър
        let allDayY = calendarsHeaderScrollView.frame.maxY
        let oldOffset = allDayScrollView.contentOffset
        let allDayH = allDayView.desiredHeight()
        let allDayFullH = allDayView.contentHeight
        
        allDayTitleLabel.frame = CGRect(x: hoursColumnX, y: allDayY,
                                        width: leftColumnWidth, height: allDayH)
        
        allDayScrollView.frame = CGRect(
            x: timelineX,
            y: allDayY,
            width: bounds.width - leftColumnWidth,
            height: allDayH
        )
        
        let totalAllDayWidth = allDayView.dayColumnWidth
        allDayScrollView.contentSize = CGSize(width: totalAllDayWidth, height: allDayFullH)
        allDayView.frame = CGRect(x: 0, y: 0, width: totalAllDayWidth, height: allDayFullH)
        
        let superThin = 1 / UIScreen.main.scale
        topBorder.frame = CGRect(x: 0, y: 0,
                                 width: allDayTitleLabel.bounds.width,
                                 height: superThin)
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
            x: hoursColumnX,
            y: hoursColumnY,
            width: leftColumnWidth,
            height: bounds.height - hoursColumnY
        )
        
        mainScrollView.frame = CGRect(
            x: timelineX,
            y: hoursColumnY,
            width: bounds.width - leftColumnWidth,
            height: bounds.height - hoursColumnY
        )
        
        let totalHours = 25
        let baseHeight = CGFloat(totalHours) * weekView.hourHeight
        let finalHeight = baseHeight + (weekView.topMargin * 2) + bottomScrollPadding
        
        let totalWidth = weekView.dayColumnWidth
        mainScrollView.contentSize = CGSize(width: totalWidth, height: finalHeight)
        weekView.frame = CGRect(x: 0, y: 0,
                                width: totalWidth,
                                height: finalHeight)
        
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: finalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0,
                                       width: leftColumnWidth,
                                       height: finalHeight)

        if lastHorizontalLayoutWasRTL != isRTL || abs(lastHorizontalContentWidth - totalWidth) > 0.5 {
            let initialOffsetX = isRTL ? max(0, totalWidth - mainScrollView.bounds.width) : 0
            mainScrollView.setContentOffset(
                CGPoint(x: initialOffsetX, y: mainScrollView.contentOffset.y),
                animated: false
            )
            daysHeaderScrollView.setContentOffset(CGPoint(x: initialOffsetX, y: 0), animated: false)
            calendarsHeaderScrollView.setContentOffset(CGPoint(x: initialOffsetX, y: 0), animated: false)
            allDayScrollView.setContentOffset(
                CGPoint(x: initialOffsetX, y: allDayScrollView.contentOffset.y),
                animated: false
            )
            lastHorizontalContentWidth = totalWidth
            lastHorizontalLayoutWasRTL = isRTL
        }
        
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly == fromOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil
        
        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()
        
        hoursColumnView.setNeedsDisplay()
        
        layoutSearchResultsIfNeeded()
        
        if !didScrollToNow {
                scrollToCurrentTime()
                didScrollToNow = true
                #if DEBUG
                ScreenshotMode.markReady()
                #endif
            }
    }

    
    // ---------------------------------------------------------
    // MARK: - UIScrollViewDelegate
    // ---------------------------------------------------------
    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            let syncedOffsetY = syncedVerticalOffset(for: scrollView.contentOffset.y)
            if abs(scrollView.contentOffset.y - syncedOffsetY) > 0.5 {
                mainScrollView.contentOffset.y = syncedOffsetY
            }
            daysHeaderScrollView.contentOffset.x     = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x         = scrollView.contentOffset.x
            calendarsHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y      = syncedOffsetY
        }
        else if scrollView == daysHeaderScrollView {
            mainScrollView.contentOffset.x           = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x         = scrollView.contentOffset.x
            calendarsHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
        }
        else if scrollView == allDayScrollView {
            mainScrollView.contentOffset.x           = scrollView.contentOffset.x
            daysHeaderScrollView.contentOffset.x     = scrollView.contentOffset.x
            calendarsHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
        }
        else if scrollView == calendarsHeaderScrollView {
            mainScrollView.contentOffset.x       = scrollView.contentOffset.x
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x     = scrollView.contentOffset.x
        }
    }

    private func syncedVerticalOffset(for proposedOffsetY: CGFloat) -> CGFloat {
        let mainMaxOffset = max(0, mainScrollView.contentSize.height - mainScrollView.bounds.height)
        let hoursMaxOffset = max(0, hoursColumnScrollView.contentSize.height - hoursColumnScrollView.bounds.height)
        let sharedMaxOffset = min(mainMaxOffset, hoursMaxOffset)

        return min(max(proposedOffsetY, 0), sharedMaxOffset)
    }
    
    // ---------------------------------------------------------
    // MARK: - Timer за презарисуване
    // ---------------------------------------------------------
    private func startRedrawTimer() {
        redrawTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            Task { @MainActor in
                self?.setNeedsLayout()
                self?.layoutIfNeeded()
                self?.weekView.setNeedsDisplay()
                self?.allDayView.setNeedsLayout()
            }
        }
    }
    
    // ---------------------------------------------------------
    // MARK: - Меню за “...”
    // ---------------------------------------------------------
    
    // MARK: - iOS 14+ menu
    @available(iOS 14.0, *)
    private func buildViewMenu() -> UIMenu {
        // Създаване на иконите за опциите
        let dayImage          = UIImage(systemName: "calendar.day.timeline.leading")
        let multiDayImage     = UIImage(systemName: "distribute.horizontal.left")
        let monthImage        = UIImage(systemName: "calendar")
        let yearImage         = UIImage(systemName: "12.lane")
        let listImage         = UIImage(systemName: "list.bullet")
        let multiCalendarIcon = UIImage(systemName: "align.vertical.top")
        let weatherImage      = UIImage(systemName: "cloud.sun")  // Нова икона за Weather

        // Съществуващите UIAction-и
        let dayAction = UIAction(
            title: NSLocalizedString("Day", comment: ""),
            image: dayImage,
            state: currentView == 1 ? .on : .off
        ) { [weak self] _ in
            self?.currentView = 1
            self?.onViewChange?(1)
            self?.viewMenuButton.setImage(dayImage, for: .normal)
        }
        
        let multiAction = UIAction(
            title: NSLocalizedString("MultiDay", comment: ""),
            image: multiDayImage,
            state: currentView == 3 ? .on : .off
        ) { [weak self] _ in
            self?.currentView = 3
            self?.onViewChange?(3)
            self?.viewMenuButton.setImage(multiDayImage, for: .normal)
        }
        
        let monthAction = UIAction(
            title: NSLocalizedString("Month", comment: ""),
            image: monthImage,
            state: currentView == 0 ? .on : .off
        ) { [weak self] _ in
            self?.currentView = 0
            self?.onViewChange?(0)
            self?.viewMenuButton.setImage(monthImage, for: .normal)
        }
        
        let yearAction = UIAction(
            title: NSLocalizedString("Year", comment: ""),
            image: yearImage,
            state: currentView == 2 ? .on : .off
        ) { [weak self] _ in
            self?.currentView = 2
            self?.onViewChange?(2)
            self?.viewMenuButton.setImage(yearImage, for: .normal)
        }
        
        let listAction = UIAction(
            title: NSLocalizedString("List", comment: ""),
            image: listImage,
            state: currentView == 4 ? .on : .off
        ) { [weak self] _ in
            self?.currentView = 4
            self?.onViewChange?(4)
            self?.viewMenuButton.setImage(listImage, for: .normal)
        }
        
        let multiCalendarAction = UIAction(
           title: NSLocalizedString("MultiCalendar", comment: ""),
           image: multiCalendarIcon,
           state: currentView == 5 ? .on : .off
        ) { [weak self] _ in
            // ПРОМЯНА: Премахната е проверката за абонамент.
            self?.currentView = 5
            self?.onViewChange?(5)
            self?.viewMenuButton.setImage(multiCalendarIcon, for: .normal)
        }
        
        // Добавяне на нов UIAction за Weather
        let weatherAction = UIAction(
            title: NSLocalizedString("Weather", comment: ""),
            image: weatherImage,
            state: currentView == 6 ? .on : .off
        ) { [weak self] _ in
            self?.currentView = 6
            self?.onViewChange?(6)
            self?.viewMenuButton.setImage(weatherImage, for: .normal)
        }
        
        return UIMenu(
            title: "",
            children: [
                dayAction,
                multiAction,
                monthAction,
                yearAction,
                listAction,
                multiCalendarAction,
                weatherAction
            ]
        )
    }


    private func updateButtonIconForCurrentView() {
        let imageName: String
        switch currentView {
        case 1:
            imageName = "calendar.day.timeline.leading"
        case 3:
            imageName = "distribute.horizontal.left"
        case 0:
            imageName = "calendar"
        case 2:
            imageName = "12.lane"
        case 4:
            imageName = "list.bullet"
        case 5:
            imageName = "align.vertical.top"
        case 6:
            imageName = "cloud.sun"
        default:
            imageName = "calendar"
        }
        
        viewMenuButton.setImage(UIImage(systemName: imageName), for: .normal)
    }

   
    private func fmt(_ d: Date) -> String {
        appShortDateFormatter().string(from: d)
    }
    
    // ---------------------------------------------------------
    // MARK: - Add (+)
    // ---------------------------------------------------------
    @objc private func addEventButtonTapped() {
        onAddNewEvent?()
    }
    
    // ---------------------------------------------------------
    // MARK: - Търсене
    // ---------------------------------------------------------
    private var searchHostingController: UIHostingController<SearchResultsView>?
    private var searchFieldHostingController: UIHostingController<CalendarEventSearchField>?
    private var isSearching: Bool = false {
        didSet {
            if isSearching {
//                addEventButton.isHidden      = true
                viewMenuButton.isHidden      = true
                searchButton.isHidden        = true
                closeSearchButton.isHidden   = true
                animateSearchBarIn()
            } else {
//                addEventButton.isHidden      = false
                viewMenuButton.isHidden      = false
                searchButton.isHidden        = false
                closeSearchButton.isHidden   = true
                animateSearchBarOut()
            }
        }
    }
    private var searchText: String = "" {
        didSet {
            updateSearchResults()
        }
    }
    
    @objc private func searchButtonTapped() {
        isSearching  = true
        searchText   = ""
    }

    @objc private func closeSearchButtonTapped() {
        isSearching = false
        searchText = ""
    }
    
    public func searchBar(_ searchBar: UISearchBar, textDidChange text: String) {
        self.searchText = text
    }
    
    public func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        searchBar.resignFirstResponder()
    }
    
    public func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        isSearching = false
        searchBar.resignFirstResponder()
        searchText = ""
        searchBar.text = ""
    }
    
    private func animateSearchBarIn() {
        searchFieldHostingController?.view.removeFromSuperview()

        let binding = Binding<String>(
            get: { [weak self] in self?.searchText ?? "" },
            set: { [weak self] in self?.searchText = $0 }
        )
        let field = CalendarEventSearchField(text: binding) { [weak self] in
            self?.closeSearchButtonTapped()
        }
        let controller = UIHostingController(rootView: field)
        controller.view.backgroundColor = .clear
        controller.view.frame = navBar.bounds
        controller.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        controller.view.alpha = 0
        controller.view.transform = CGAffineTransform(translationX: 0, y: -navBarHeight)
        searchFieldHostingController = controller
        navBar.addSubview(controller.view)

        UIView.animate(withDuration: 0.25) {
            controller.view.alpha = 1
            controller.view.transform = .identity
        }
    }
    
    private func animateSearchBarOut() {
        guard let controller = searchFieldHostingController else { return }

        UIView.animate(withDuration: 0.25, animations: {
            controller.view.alpha = 0
            controller.view.transform = CGAffineTransform(translationX: 0, y: -self.navBarHeight)
        }, completion: { _ in
            controller.view.removeFromSuperview()
            if self.searchFieldHostingController === controller {
                self.searchFieldHostingController = nil
            }
        })
    }
    
    private func updateSearchResults() {
        setNeedsLayout()
    }
    
    private func layoutSearchResultsIfNeeded() {
        let shouldShow = isSearching && !searchText.isEmpty
        
        mainScrollView.isHidden      = shouldShow
        hoursColumnScrollView.isHidden = shouldShow
        allDayScrollView.isHidden    = shouldShow
        cornerView.isHidden          = shouldShow
        allDayTitleLabel.isHidden    = shouldShow
        daysHeaderScrollView.isHidden = shouldShow
        calendarsHeaderScrollView.isHidden = shouldShow
        
        guard shouldShow else {
            searchHostingController?.view.removeFromSuperview()
            searchHostingController = nil
            return
        }
        
        let resultsView = SearchResultsView(searchText: searchText)
        if let hc = searchHostingController {
            hc.rootView = resultsView
        } else {
            let hc = UIHostingController(rootView: resultsView)
            searchHostingController = hc
            addSubview(hc.view)
        }
        
        if let hc = searchHostingController {
            bringSubviewToFront(hc.view)
            let navBarBottom = CGFloat(navBarHeight)
            hc.view.layer.zPosition = 9
            hc.view.frame = CGRect(
                x: 0,
                y: navBarBottom,
                width: bounds.width,
                height: bounds.height - navBarBottom
            )
        }
    }
    
    // ---------------------------------------------------------
    // MARK: - Помощен метод за topVC
    // ---------------------------------------------------------
    private func topMostViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first(where: { $0.isKeyWindow }),
              let root = window.rootViewController else {
            return nil
        }
        var top = root
        while let presented = top.presentedViewController {
            top = presented
        }
        return top
    }
    
    private func scrollToCurrentTime() {
        guard var targetOffsetY = initialVerticalOffset() else { return }

        // Ограничаваме до валидния диапазон
        let maxOffsetY = max(0, mainScrollView.contentSize.height - mainScrollView.bounds.height)
        targetOffsetY = min(max(targetOffsetY, 0), maxOffsetY)

        // Скролваме без анимация
        mainScrollView.setContentOffset(CGPoint(x: mainScrollView.contentOffset.x, y: targetOffsetY), animated: false)
        hoursColumnScrollView.setContentOffset(CGPoint(x: 0, y: targetOffsetY), animated: false)
    }

    /// Where the timeline sits on first layout. See the note on the same
    /// method in `TwoWayPinnedMultiDayContainerView`.
    private func initialVerticalOffset() -> CGFloat? {
        #if DEBUG
        if let pinnedHour = ScreenshotMode.pinnedScrollHour {
            return -158 + CGFloat(pinnedHour) * weekView.hourHeight
        }
        #endif

        let now = Date()
        let cal = Calendar.current
        let comps = cal.dateComponents([.hour, .minute], from: now)
        guard let hour = comps.hour, let minute = comps.minute else { return nil }

        // Пресмятаме честичното число на часа
        let hoursFloat = CGFloat(hour) + CGFloat(minute) / 60.0
        // y-координата на линията „сега“
        let yNow = -158 + hoursFloat * weekView.hourHeight

        // Искаме yNow да е в средата на екрана:
        return yNow - mainScrollView.bounds.height / 2
    }
}
