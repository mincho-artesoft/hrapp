import UIKit
import SwiftUI
import Foundation

// MARK: - TwoWayPinnedMultiDayContainerView
public final class TwoWayPinnedMultiDayContainerView: UIView,
                                                      UIScrollViewDelegate,
                                                      UIGestureRecognizerDelegate {
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared

    private var didScrollToNow = false
    private var isSynchronizingScroll = false

    // MARK: - Public configuration
    public var showSingleDay: Bool = false {
        didSet {
            if showSingleDay {
                toDate = fromDate
            }
            setNeedsLayout()
        }
    }
    
    public var currentView: Int = 3 { didSet { setNeedsLayout() } }

    public var onViewChange: ((Int) -> Void)?
    
    public var fromDate: Date = Date() {
        didSet {

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
    
    public var onEventSelectionChanged: ((EventDescriptor?) -> Void)? {
        didSet { weekView.onEventSelectionChanged = onEventSelectionChanged }
    }
    public var onEventTap: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventTap = onEventTap
            allDayView.onEventTap = onEventTap
        }
    }
    public var onEventEdit: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventEdit = onEventEdit
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

    public var onEmptyLongPress: ((DateInterval, String?) -> Void)? {
        didSet {
            weekView.onEmptyLongPress = onEmptyLongPress
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
    public var onMonthLabelTap: ((Date) -> Void)?
    
    /// Callback при натискане на бутона “+”
    public var onAddNewEvent: (() -> Void)?
    
    // MARK: - Subviews
    
    public let hoursColumnWeatherScrollView = UIScrollView()
    public let hoursColumnWeatherView = HoursColumnWeatherView()
    
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
    private let navBar = UIView()
    private let headerHost = CalendarScreenHeaderHost()
    
    
    // MARK: - singleDayCarousel
    private let singleDayCarousel: WeekCarouselView = {
        let view = WeekCarouselView()
        view.backgroundColor = .secondarySystemBackground
        view.isHidden = true  // По подразбиране скрит, ако showSingleDay = false
        return view
    }()
    
    private var searchHostingController: UIHostingController<AnyView>?
    private var searchFieldHostingController: UIHostingController<CalendarEventSearchField>?
    
    private var isSearching: Bool = false {
        didSet {
            updateScreenHeader()
            if isSearching { animateSearchBarIn() }
            else { animateSearchBarOut() }
            setNeedsLayout()
        }
    }

    private var searchText: String = "" {
        didSet {
            updateSearchResults()
        }
    }
    
    // MARK: - Private constants & variables
    fileprivate let navBarHeight = CalendarHeaderLayout.height
    fileprivate let daysHeaderHeight: CGFloat = 40
    fileprivate let leftColumnWidth: CGFloat = 60
    var bottomScrollPadding: CGFloat = 0 { didSet { if oldValue != bottomScrollPadding { setNeedsLayout() } } }
    fileprivate let weatherStripWidth: CGFloat = 50
    /// Whether the hourly weather strip is drawn beside the timeline.
    fileprivate var showsWeatherStrip: Bool {
        guard showSingleDay else { return false }
        let calendar = Calendar.current
        let offset = calendar.dateComponents(
            [.day],
            from: calendar.startOfDay(for: Date()),
            to: calendar.startOfDay(for: fromDate)
        ).day ?? -1
        return (0...9).contains(offset)
    }

    private var usesRightToLeftLayout: Bool {
        effectiveUserInterfaceLayoutDirection == .rightToLeft
    }

    private var isWindowLandscape: Bool {
        let size = window?.bounds.size ?? bounds.size
        return size.width > size.height
    }
    
    private let topBorder = CALayer()
    private let bottomBorder = CALayer()
    
    private var showCalendar = false
    private var calendarHostingController: UIHostingController<CalendarDateRangePickerWrapper>?
    private var calendarBackgroundView: UIView?
    
    private var redrawTimer: Timer?
    private var isInSecondPass = false
    private var lastHorizontalContentWidth: CGFloat = -1
    private var lastHorizontalLayoutWasRTL: Bool?
    
    // Доп. изглед за фон зад navBar (ако желаем да добавим отместване)
    private let topBackgroundView = UIView()
    private let topBackgroundView2 = UIView()

    // MARK: - Lifecycle
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
        startRedrawTimer()

        NotificationCenter.default.addObserver(
               self,
               selector: #selector(orientationDidChange),
               name: UIDevice.orientationDidChangeNotification,
               object: nil
           )
        NotificationCenter.default.addObserver(
               self,
               selector: #selector(weatherForecastDidUpdate),
               name: .weatherForecastUpdated,
               object: nil
           )
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
        startRedrawTimer()

        NotificationCenter.default.addObserver(
               self,
               selector: #selector(orientationDidChange),
               name: UIDevice.orientationDidChangeNotification,
               object: nil
           )
        NotificationCenter.default.addObserver(
               self,
               selector: #selector(weatherForecastDidUpdate),
               name: .weatherForecastUpdated,
               object: nil
           )
    }
    
    deinit {
        redrawTimer?.invalidate()
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc private func orientationDidChange() {
        hideCalendarPopup()
    }

    @objc private func weatherForecastDidUpdate() {
        setNeedsLayout()
        layoutIfNeeded()
        hoursColumnWeatherView.setNeedsDisplay()
        daysHeaderView.setNeedsDisplay()
    }
    
    // MARK: - Setup
    private func setupViews() {
        backgroundColor = .systemBackground
        clipsToBounds = true
        
        // mainScrollView
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.bounces = false
        mainScrollView.contentInsetAdjustmentBehavior = .never
        mainScrollView.layer.zPosition = 1
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)
        
        // allDayScrollView
        allDayScrollView.delegate = self
        allDayScrollView.showsHorizontalScrollIndicator = false
        allDayScrollView.showsVerticalScrollIndicator = true
        allDayScrollView.alwaysBounceHorizontal = false
        allDayScrollView.alwaysBounceVertical = false
        allDayScrollView.bounces = false
        allDayScrollView.contentInsetAdjustmentBehavior = .never
        allDayScrollView.layer.zPosition = 2
        allDayScrollView.addSubview(allDayView)
        addSubview(allDayScrollView)
        
        // hoursColumnScrollView
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.showsHorizontalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = true
        hoursColumnScrollView.bounces = false
        hoursColumnScrollView.isDirectionalLockEnabled = true
        hoursColumnScrollView.delegate = self
        hoursColumnScrollView.accessibilityIdentifier = "timeline-hours-scroll"
        let hoursTap = UITapGestureRecognizer(target: self, action: #selector(handleHoursColumnTap(_:)))
        hoursTap.cancelsTouchesInView = false
        hoursTap.require(toFail: hoursColumnScrollView.panGestureRecognizer)
        hoursColumnScrollView.addGestureRecognizer(hoursTap)
        hoursColumnScrollView.contentInsetAdjustmentBehavior = .never
        hoursColumnScrollView.addSubview(hoursColumnView)
        hoursColumnScrollView.layer.zPosition = 3
        addSubview(hoursColumnScrollView)
        
        hoursColumnWeatherScrollView.showsVerticalScrollIndicator = false
        hoursColumnWeatherScrollView.isScrollEnabled = false
        hoursColumnWeatherScrollView.contentInsetAdjustmentBehavior = .never
        hoursColumnWeatherScrollView.addSubview(hoursColumnWeatherView)
        hoursColumnWeatherScrollView.layer.zPosition = 3
        hoursColumnWeatherScrollView.isUserInteractionEnabled = false
        addSubview(hoursColumnWeatherScrollView)
        
        // daysHeaderScrollView
        daysHeaderScrollView.showsVerticalScrollIndicator = false
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = true
        daysHeaderScrollView.delegate = self
        daysHeaderScrollView.backgroundColor = .secondarySystemBackground
        daysHeaderScrollView.bounces = false
        daysHeaderScrollView.contentInsetAdjustmentBehavior = .never
        daysHeaderScrollView.addSubview(daysHeaderView)
        daysHeaderScrollView.layer.zPosition = 4
        addSubview(daysHeaderScrollView)
        
        // cornerView
        cornerView.backgroundColor = .secondarySystemBackground
        cornerView.layer.zPosition = 5
        addSubview(cornerView)
        
        // allDayTitleLabel
        // MARK: - allDayTitleLabel
        allDayTitleLabel.text = " " + NSLocalizedString("all-day", comment: "")
        allDayTitleLabel.font = .systemFont(ofSize: 14, weight: .semibold)
        allDayTitleLabel.useAdaptiveSingleLine(minimumScale: 0.4)
        allDayTitleLabel.backgroundColor = .secondarySystemBackground
        allDayTitleLabel.layer.zPosition = 6
        addSubview(allDayTitleLabel)

        
        topBorder.backgroundColor = UIColor.lightGray.cgColor
        allDayTitleLabel.layer.addSublayer(topBorder)
        
        bottomBorder.backgroundColor = UIColor.lightGray.cgColor
        allDayTitleLabel.layer.addSublayer(bottomBorder)
        
        // Nav bar
        navBar.backgroundColor = .secondarySystemBackground
        navBar.layer.zPosition = 7
        addSubview(navBar)
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]
        
        
        // singleDayCarousel
        addSubview(singleDayCarousel)
        singleDayCarousel.onDaySelected = { [weak self] date in
            guard let self = self else { return }
            self.fromDate = date
            self.toDate   = date
            self.onRangeChange?(date, date)
            self.setNeedsLayout()
        }
        
        // Свързваме вюта
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
        
        hoursColumnView.hourHeight = 50
        hoursColumnView.extraMarginTopBottom = 10
        hoursColumnWeatherView.hourHeight = 50
        hoursColumnWeatherView.extraMarginTopBottom = 10
        
        weekView.hourHeight = 50
        weekView.topMargin = 10
        
        // Доп. изглед за фон зад нав. лента (примерно)
        topBackgroundView.backgroundColor = .secondarySystemBackground
        
        addSubview(topBackgroundView)
        
       
    }
    
    // MARK: - Бутон с лупичка (търсене)
    @objc private func searchButtonTapped() {
        isSearching = true
        searchText = ""
    }

    @objc private func closeSearchButtonTapped() {
        isSearching = false
        searchText = ""
    }
    
    // MARK: - Shared SwiftUI search field
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
        controller.safeAreaRegions = []
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
        // Тук може да филтрирате събития и т.н.
        setNeedsLayout()
    }
    
    private func layoutSearchResultsIfNeeded() {
        let shouldShow = isSearching && !searchText.isEmpty
        
        mainScrollView.isHidden = shouldShow
        hoursColumnScrollView.isHidden = shouldShow
        hoursColumnWeatherScrollView.isHidden = shouldShow
        allDayScrollView.isHidden = shouldShow
        cornerView.isHidden = shouldShow
        allDayTitleLabel.isHidden = shouldShow
        daysHeaderScrollView.isHidden = shouldShow
        if shouldShow {
            singleDayCarousel.isHidden = true
        }
        
        guard shouldShow == true else {
            searchHostingController?.view.removeFromSuperview()
            searchHostingController = nil
            return
        }
        
        let resultsView = AnyView(SearchResultsView(searchText: searchText)
            .environment(\.calendarBottomClearance, bottomScrollPadding)
            .environment(\.locale, Locale.appFormatting)
            .environment(\.layoutDirection, usesRightToLeftLayout ? .rightToLeft : .leftToRight))
        
        if let hc = searchHostingController {
            hc.rootView = resultsView
        } else {
            let hc = UIHostingController(rootView: resultsView)
            hc.safeAreaRegions = []
            searchHostingController = hc
            addSubview(hc.view)
        }
        
        if let hc = searchHostingController {
            bringSubviewToFront(hc.view)
            let navBarBottom = navBar.frame.maxY
            hc.view.layer.zPosition = 9
            hc.view.frame = CGRect(
                x: 0,
                y: navBarBottom,
                width: bounds.width,
                height: bounds.height - navBarBottom
            )
        }
    }
    
    // Бутон "+"
    @objc private func addEventButtonTapped() {
        onAddNewEvent?()
    }

    @objc private func monthLabelTapped() {
        onMonthLabelTap?(fromDate)
    }
    
    // MARK: - Layout
    public override func didMoveToWindow() {
        super.didMoveToWindow()
        if window == nil { headerHost.detach() }
        else { setNeedsLayout() }
    }

    public override func safeAreaInsetsDidChange() {
        super.safeAreaInsetsDidChange()
        setNeedsLayout()
    }

    private func updateScreenHeader() {
        let isLandscape = isWindowLandscape
        headerHost.update(in: navBar, snapshot: .init(mode: currentView,
            title: showSingleDay && !isLandscape ? appDateFormatter(template: "LLLL").string(from: fromDate) : nil,
            range: showSingleDay ? nil : dateRangeTitle, rangeIsSelected: showCalendar,
            rtl: usesRightToLeftLayout, localeIdentifier: Locale.appFormatting.identifier),
            hidden: isSearching,
            onTitle: { [weak self] in self?.monthLabelTapped() },
            onRange: { [weak self] in self?.didTapDateRangeButton() },
            onSearch: { [weak self] in self?.searchButtonTapped() },
            onViewChange: { [weak self] mode in
                self?.currentView = mode
                self?.onViewChange?(mode)
            })
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        
        let isLandscape = isWindowLandscape
        let hidesSingleDayCarousel = isLandscape && traitCollection.userInterfaceIdiom != .pad
        let isRTL = usesRightToLeftLayout
        let topOffset = CalendarHeaderLayout.topInset(safeAreaTop: safeAreaInsets.top)
        
        // 1. Фон зад navBar (ако има)
        topBackgroundView.frame = CGRect(x: 0, y: 0, width: bounds.width, height: topOffset)
        topBackgroundView.layer.zPosition = 3
        
        // 2. NavBar
        navBar.frame = CGRect(x: 0, y: topOffset, width: bounds.width, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]
        
        updateScreenHeader()

        // 3. SingleDayCarousel
        var singleDayCarouselHeight: CGFloat = showSingleDay ? 70 : 0
        singleDayCarousel.isHidden = !showSingleDay
        if hidesSingleDayCarousel {
            singleDayCarousel.isHidden = true
            singleDayCarouselHeight = 0
        }
        singleDayCarousel.layer.zPosition = 8
        let singleDayCarouselY = navBar.frame.maxY
        singleDayCarousel.frame = CGRect(x: 0, y: singleDayCarouselY, width: bounds.width, height: singleDayCarouselHeight)
        if showSingleDay {
            singleDayCarousel.selectedDate = fromDate
        }
        
        // 4. Days Header – позициониране на cornerView и daysHeaderScrollView
        let yMain = singleDayCarousel.frame.maxY
        // The hourly forecast is an overlay in both directions. The timeline
        // therefore keeps its full width and event blocks continue underneath
        // the forecast strip, exactly mirroring the existing LTR behaviour.
        let hoursColumnX = isRTL ? bounds.width - leftColumnWidth : 0
        let timelineX: CGFloat = isRTL ? 0 : leftColumnWidth
        let timelineWidth = bounds.width - leftColumnWidth
        cornerView.frame = CGRect(x: hoursColumnX, y: yMain, width: leftColumnWidth, height: daysHeaderHeight)
        daysHeaderScrollView.frame = CGRect(x: timelineX, y: yMain, width: timelineWidth, height: daysHeaderHeight)
        
        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly   = cal.startOfDay(for: toDate)
        let dayCount = (cal.dateComponents([.day], from: fromOnly, to: toOnly).day ?? 0) + 1
        
        let availableWidth = timelineWidth
        // A day column must remain readable. When the selected range needs more
        // horizontal space than the viewport, the synchronized header, all-day
        // area and timeline scroll instead of squeezing every day on screen.
        // There is intentionally no maximum width: shorter ranges may expand to
        // use all of the available space.
        let newDayColumnWidth = TimelineInteractionGeometry.columnWidth(
            available: availableWidth, count: dayCount)
        weekView.dayColumnWidth = newDayColumnWidth
        daysHeaderView.dayColumnWidth = newDayColumnWidth
        allDayView.dayColumnWidth = newDayColumnWidth
        
        let totalDaysHeaderWidth = CGFloat(dayCount) * daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(width: totalDaysHeaderWidth, height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0, width: totalDaysHeaderWidth, height: daysHeaderHeight)
        
        // 5. All-Day View
        allDayView.recalcAllDayHeightDynamically()
        let allDayY = yMain + daysHeaderHeight
        let oldOffset = allDayScrollView.contentOffset
        let allDayH = allDayView.desiredHeight()
        let allDayFullH = allDayView.contentHeight
        allDayTitleLabel.frame = CGRect(x: hoursColumnX, y: allDayY, width: leftColumnWidth, height: allDayH)
        allDayScrollView.frame = CGRect(x: timelineX, y: allDayY, width: timelineWidth, height: allDayH)
        let totalAllDayWidth = CGFloat(dayCount) * allDayView.dayColumnWidth
        allDayScrollView.contentSize = CGSize(width: totalAllDayWidth, height: allDayFullH)
        allDayView.frame = CGRect(x: 0, y: 0, width: totalAllDayWidth, height: allDayFullH)
        
        // Настройка на тънките линии (border) за allDayTitleLabel
        let superThin = 1 / UIScreen.main.scale
        topBorder.frame = CGRect(x: 0, y: 0, width: allDayTitleLabel.bounds.width, height: superThin)
        bottomBorder.frame = CGRect(x: 0, y: allDayTitleLabel.bounds.height - superThin, width: allDayTitleLabel.bounds.width, height: superThin)
        
        let maxOffsetY = max(0, allDayScrollView.contentSize.height - allDayScrollView.bounds.height)
        var newOffset = oldOffset
        if newOffset.y < 0 { newOffset.y = 0 }
        else if newOffset.y > maxOffsetY { newOffset.y = maxOffsetY }
        allDayScrollView.setContentOffset(newOffset, animated: false)
        
        // 6. Hours Column and Main ScrollView
        let hoursColumnY = allDayY + allDayH
        hoursColumnScrollView.frame = CGRect(x: hoursColumnX, y: hoursColumnY, width: leftColumnWidth, height: bounds.height - hoursColumnY)
        hoursColumnWeatherScrollView.frame = CGRect(x: isRTL ? 0 : bounds.width - weatherStripWidth,
                                    y: hoursColumnY,
                                    width: weatherStripWidth,
                                    height: bounds.height - hoursColumnY)
        mainScrollView.frame = CGRect(x: timelineX, y: hoursColumnY, width: timelineWidth, height: bounds.height - hoursColumnY)
        
        let totalHours = 25
        let baseHeight = CGFloat(totalHours) * weekView.hourHeight
        let finalHeight = baseHeight + (weekView.topMargin * 2) + bottomScrollPadding
        let totalWidth = CGFloat(dayCount) * weekView.dayColumnWidth
        mainScrollView.contentSize = CGSize(width: totalWidth, height: finalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: finalHeight)
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: finalHeight)
        hoursColumnWeatherScrollView.contentSize = CGSize(width: weatherStripWidth, height: finalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: finalHeight)
        hoursColumnWeatherView.frame = CGRect(x: 0, y: 0, width: weatherStripWidth, height: finalHeight)

        if lastHorizontalLayoutWasRTL != isRTL || abs(lastHorizontalContentWidth - totalWidth) > 0.5 {
            let initialOffsetX = isRTL ? max(0, totalWidth - mainScrollView.bounds.width) : 0
            mainScrollView.setContentOffset(
                CGPoint(x: initialOffsetX, y: mainScrollView.contentOffset.y),
                animated: false
            )
            daysHeaderScrollView.setContentOffset(CGPoint(x: initialOffsetX, y: 0), animated: false)
            allDayScrollView.setContentOffset(
                CGPoint(x: initialOffsetX, y: allDayScrollView.contentOffset.y),
                animated: false
            )
            lastHorizontalContentWidth = totalWidth
            lastHorizontalLayoutWasRTL = isRTL
        }
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        #if DEBUG
        let indicatorDate = ScreenshotMode.referenceDate ?? Date()
        #else
        let indicatorDate = Date()
        #endif
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? indicatorDate : nil
        
        hoursColumnWeatherView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        
        hoursColumnView.setNeedsDisplay()
        hoursColumnWeatherView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()
        
        // 7. Интеграция на данните за прогнозата
        // Ако сме в режим showSingleDay и fromDate е в интервала [днес, днес + 9 дни],
        // вземаме данни от WeatherKitViewModel.shared.hourlyForecast за избрания ден.
        if showsWeatherStrip {
            hoursColumnWeatherView.displayWeatherForecast = true
            
            let weatherVM = WeatherKitViewModel.shared
            // Филтрираме часовете от прогнозата за избрания ден
            let dayHourlyForecasts = weatherVM.hourlyForecast.filter {
                cal.isDate($0.date, inSameDayAs: fromDate)
            }
            // Преобразуваме всеки HourlyForecastItem към модела HourlyWeatherForecast,
            // използвайки часа (component .hour), символ (icon) и температура
            let hourlyForecasts: [HourlyWeatherForecast] = dayHourlyForecasts.map { forecast in
                let forecastHour = cal.component(.hour, from: forecast.date)
                return HourlyWeatherForecast(
                    hour: forecastHour,
                    iconName: forecast.symbol,
                    temperature: forecast.temp
                )
            }
            hoursColumnWeatherView.hourlyWeatherForecasts = hourlyForecasts
        } else {
            hoursColumnWeatherView.displayWeatherForecast = false
            hoursColumnWeatherView.hourlyWeatherForecasts = nil
        }
        
        hoursColumnView.setNeedsDisplay()
        hoursColumnWeatherView.setNeedsDisplay()

        updateDaysHeaderForecast()

        // 8. Layout на рез-лтати от търсене (ако сме в режим на търсене)
        layoutSearchResultsIfNeeded()
        
        if !didScrollToNow {
              scrollToCurrentTime()
              didScrollToNow = true
              #if DEBUG
              // The timeline is laid out and parked at its final offset. The
              // capture harness waits for this instead of sleeping a fixed
              // number of seconds and hoping.
              ScreenshotMode.markReady()
              #endif
          }
    }


    // MARK: - UIScrollViewDelegate
    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        guard !isSynchronizingScroll else { return }
        isSynchronizingScroll = true
        defer { isSynchronizingScroll = false }
        if scrollView == mainScrollView {
            let syncedOffsetY = syncedVerticalOffset(for: scrollView.contentOffset.y)
            if abs(scrollView.contentOffset.y - syncedOffsetY) > 0.5 {
                mainScrollView.contentOffset.y = syncedOffsetY
            }
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x     = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = syncedOffsetY
            hoursColumnWeatherScrollView.contentOffset.y = syncedOffsetY

        }
        else if scrollView == daysHeaderScrollView {
            mainScrollView.contentOffset.x = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x = scrollView.contentOffset.x
        }
        else if scrollView == hoursColumnScrollView {
            let y = syncedVerticalOffset(for: scrollView.contentOffset.y)
            hoursColumnScrollView.contentOffset = CGPoint(x: 0, y: y)
            mainScrollView.contentOffset.y = y
            hoursColumnWeatherScrollView.contentOffset.y = y
        }
        else if scrollView == allDayScrollView {
            mainScrollView.contentOffset.x = scrollView.contentOffset.x
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
        }
    }

    private func syncedVerticalOffset(for proposedOffsetY: CGFloat) -> CGFloat {
        let mainMaxOffset = max(0, mainScrollView.contentSize.height - mainScrollView.bounds.height)
        let hoursMaxOffset = max(0, hoursColumnScrollView.contentSize.height - hoursColumnScrollView.bounds.height)
        let sharedMaxOffset = min(mainMaxOffset, hoursMaxOffset)

        return min(max(proposedOffsetY, 0), sharedMaxOffset)
    }

    @objc private func handleHoursColumnTap(_ gesture: UITapGestureRecognizer) {
        guard gesture.state == .ended else { return }
        weekView.clearEventSelection()
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
    
    // MARK: - DateRangeButton
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
        guard let window else { return }
        guard !showCalendar else { return }
        showCalendar = true
        
        let backgroundView = UIView(frame: window.bounds)
        backgroundView.backgroundColor = UIColor.black.withAlphaComponent(0)
        backgroundView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        backgroundView.layer.zPosition = 9998
        window.addSubview(backgroundView)
        calendarBackgroundView = backgroundView
        
        let swiftUICalendar = CalendarDateRangePickerWrapper(
            startDate: fromDate,
            endDate: toDate,
            minimumDate: nil,
            maximumDate: nil,
            selectedColor: .systemBlue.withAlphaComponent(0.7)
        ) { [weak self] newStart, newEnd in
            guard let self = self else { return }
            self.fromDate = newStart
            self.toDate   = newEnd
            self.onRangeChange?(self.fromDate, self.toDate)
        }
        
        let hc = UIHostingController(rootView: swiftUICalendar)
        hc.view.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.7)
        hc.view.layer.cornerRadius = 12
        hc.view.layer.masksToBounds = true
        hc.view.layer.zPosition = 9999
        self.calendarHostingController = hc
        
        // Размер на календара
        let calendarWidth: CGFloat  = 350
        let calendarHeight: CGFloat = 350
        
        // Координати на бутона в прозореца
        let buttonFrameInWindow = navBar.convert(navBar.bounds, to: window)
        
        // Първоначално центриране по X
        var finalX = (window.bounds.width - calendarWidth) / 2
        
        // "Под бутона" по Y (с малък отстъп)
        let belowButtonY = buttonFrameInWindow.maxY + 8
        
        // Опитваме първо да го поставим отдолу
        var finalY = belowButtonY
        var placed = false
        
        // 1) Ако излиза извън екрана надолу,
        //    пробваме над бутона
        if finalY + calendarHeight > window.bounds.maxY - 10 {
            let aboveButtonY = buttonFrameInWindow.minY - calendarHeight - 8
            if aboveButtonY >= 10 {
                finalY = aboveButtonY
                placed = true
            }
        } else {
            placed = true
        }
        
        // 2) Ако все още не е сложен (няма място нито отдолу, нито отгоре),
        //    го центрираме по вертикала
        if !placed {
            finalY = (window.bounds.height - calendarHeight) / 2
        }
        
        // --- Офсет при пейзажен режим (ако width > height)
        let isLandscape = window.bounds.width > window.bounds.height
        if isLandscape {
            // Примерно 80 точки надясно и 20 надолу
            finalX += finalX/2
            finalY += 20
        }
        // -------------------------------
        
        // „Clamping” по хоризонтала (да не излезе вляво или вдясно)
        if finalX < 10 {
            finalX = 10
        } else if finalX + calendarWidth > window.bounds.width - 10 {
            finalX = window.bounds.width - calendarWidth - 10
        }
        
        // „Clamping” по вертикала (да не излезе горе или долу)
        if finalY < 10 {
            finalY = 10
        } else if finalY + calendarHeight > window.bounds.height - 10 {
            finalY = window.bounds.height - calendarHeight - 10
        }
        
        // Поставяме календара
        hc.view.frame = CGRect(x: finalX, y: finalY, width: calendarWidth, height: calendarHeight)
        backgroundView.addSubview(hc.view)
        
        // Анимация при поява
        hc.view.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
        hc.view.alpha = 0
        backgroundView.alpha = 0
        UIView.animate(withDuration: 0.25, delay: 0, options: [.curveEaseOut], animations: {
            hc.view.transform = .identity
            hc.view.alpha = 1
            backgroundView.alpha = 1
        }, completion: nil)
        
        // Tap-gesture за да го скрием при натискане извън календара
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(containerTapped(_:)))
        tapGesture.cancelsTouchesInView = false
        tapGesture.delegate = self
        backgroundView.addGestureRecognizer(tapGesture)
        
        updateScreenHeader()
    }


    
    private func hideCalendarPopup() {
        guard showCalendar else { return }
        showCalendar = false
        
        guard
            let hc = calendarHostingController,
            let bgView = calendarBackgroundView
        else {
            updateScreenHeader()
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
        updateScreenHeader()
    }
    
    // MARK: - Helpers
    private var dateRangeTitle: String {
        guard fromDate <= toDate else { return NSLocalizedString("No selected range", comment: "") }
        let start = fmt(fromDate)
        let end = fmt(toDate)
        return start.isEmpty || end.isEmpty
            ? NSLocalizedString("No selected range", comment: "") : "\(start) - \(end)"
    }

    private func fmt(_ d: Date) -> String {
        appShortDateFormatter().string(from: d)
    }
    
    // MARK: - UIGestureRecognizerDelegate
    public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer,
                                  shouldReceive touch: UITouch) -> Bool {
        guard let hostingView = calendarHostingController?.view else {
            return true
        }
        // Ако докосваме вътре в календара → да не го затваряме
        if let tappedView = touch.view, tappedView.isDescendant(of: hostingView) {
            return false
        }
        // Ако докосваме dateRangeButton → също да не го затваряме
        if let tappedView = touch.view, tappedView.isDescendant(of: navBar) {
            return false
        }
        return true
    }
    // В класа TwoWayPinnedMultiDayContainerView добавете функцията:
    private func updateDaysHeaderForecast() {
        let weatherVM = WeatherKitViewModel.shared
        if !weatherVM.dailyForecast.isEmpty {
            daysHeaderView.dailyForecasts = weatherVM.dailyForecast
        } else {
            daysHeaderView.dailyForecasts = nil
        }
    }

    private func scrollToCurrentTime() {
        guard var targetOffsetY = initialVerticalOffset() else { return }

        // Ограничаваме до валидния диапазон
        let maxOffsetY = max(0, mainScrollView.contentSize.height - mainScrollView.bounds.height)
        targetOffsetY = min(max(targetOffsetY, 0), maxOffsetY)

        // Скролваме без анимация
        mainScrollView.setContentOffset(CGPoint(x: mainScrollView.contentOffset.x, y: targetOffsetY), animated: false)
        hoursColumnScrollView.setContentOffset(CGPoint(x: 0, y: targetOffsetY), animated: false)
        hoursColumnWeatherScrollView.setContentOffset(CGPoint(x: 0, y: targetOffsetY), animated: false)
    }

    /// Where the timeline sits on first layout.
    private func initialVerticalOffset() -> CGFloat? {
        #if DEBUG
        if let pinnedHour = ScreenshotMode.pinnedScrollHour {
            // A marketing capture pins the timeline so that every language
            // shows the same window of the day. Centring on "now" is right for
            // someone opening the app and wrong for a screenshot set, where it
            // leaves each language scrolled to whatever time its capture
            // happened to run - a set shot across an afternoon then reads as
            // several different moments rather than one.
            //
            // The hour goes to the top of the visible timeline rather than its
            // middle, so -ScreenshotScrollHour 9 means "the day starts at 9".
            return 10 + CGFloat(pinnedHour) * weekView.hourHeight
        }
        #endif

        let now = Date()
        let cal = Calendar.current
        let comps = cal.dateComponents([.hour, .minute], from: now)
        guard let hour = comps.hour, let minute = comps.minute else { return nil }

        // Пресмятаме честичното число на часа
        let hoursFloat = CGFloat(hour) + CGFloat(minute) / 60.0
        // y-координата на линията „сега“
        let yNow = 10 + hoursFloat * weekView.hourHeight

        // Искаме yNow да е в средата на екрана:
        return yNow - mainScrollView.bounds.height / 2
    }

}
