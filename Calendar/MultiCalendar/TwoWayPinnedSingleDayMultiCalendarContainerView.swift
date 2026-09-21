import UIKit
import SwiftUI
import Combine
import EventKit
import EventKitUI

//
// MARK: - TwoWayPinnedSingleDayMultiCalendarContainerView
//
public final class TwoWayPinnedSingleDayMultiCalendarContainerView: UIView,
                                                                  UIScrollViewDelegate,
                                                                  UIGestureRecognizerDelegate
{
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared
    // Най-горе при другите свойства
    private var calendarsChangedObserver: NSObjectProtocol?
    private var calendarSourceCancellables = Set<AnyCancellable>()
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
    
    public var currentView: Int = 1 { didSet { setNeedsLayout() } }
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
    
    public var onEventSelectionChanged: ((EventDescriptor?) -> Void)? {
        didSet { weekView.onEventSelectionChanged = onEventSelectionChanged }
    }
    public var onEventTap: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventTap   = onEventTap
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
            weekView.onEmptyLongPress   = onEmptyLongPress
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
    private let headerHost = CalendarScreenHeaderHost()
    
    
    private let singleDayCarousel: WeekCarouselView = {
        let view = WeekCarouselView()
        view.backgroundColor = .secondarySystemBackground
        view.isHidden = true
        return view
    }()
    
    // ---------------------------------------------------------
    // MARK: - Layout constants
    // ---------------------------------------------------------
    fileprivate let navBarHeight = CalendarHeaderLayout.height
    fileprivate let daysHeaderHeight: CGFloat = 20
    fileprivate let leftColumnWidth: CGFloat  = 60
    var bottomScrollPadding: CGFloat = 0 { didSet { if oldValue != bottomScrollPadding { setNeedsLayout() } } }

    private var usesRightToLeftLayout: Bool {
        effectiveUserInterfaceLayoutDirection == .rightToLeft
    }

    private var isWindowLandscape: Bool {
        let size = window?.bounds.size ?? bounds.size
        return size.width > size.height
    }
    
    private let topBorder    = CALayer()
    private let bottomBorder = CALayer()
    
    private var showCalendar = false
    private var calendarBackgroundView: UIView?
    
    private var redrawTimer: Timer?
    private var isInSecondPass = false
    private var lastHorizontalContentWidth: CGFloat = -1
    private var lastHorizontalLayoutWasRTL: Bool?
    private var isSynchronizingScroll = false
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
        observeCalendarSources()
        startRedrawTimer()
    }


    @objc private func handleCalendarsSelectionChanged(_ note: Notification) {
        let selectionSnapshot = note.object as? [String: MultiCalendarInfo]
        Task { @MainActor in
            onEventsReload?()
            refreshCalendarSources(using: selectionSnapshot)
        }
    }

    @MainActor
    private func updateCalendarsHeader(using snapshot: [String: MultiCalendarInfo]? = nil) {
        calendarsHeaderView.calendarsDict = snapshot ?? calendarVM.multiCalendarsDict
        setNeedsLayout()          // safe, вече сме на Main actor
        layoutIfNeeded()
    }

    /// Refreshes provider-neutral calendar columns when an app-local share or
    /// a Google/Microsoft sync changes the available calendars while this
    /// UIKit container is already on screen.
    @MainActor
    public func refreshCalendarSources(using snapshot: [String: MultiCalendarInfo]? = nil) {
        updateCalendarsHeader(using: snapshot)
        weekView.setNeedsDisplay()
        weekView.setNeedsLayout()
        allDayView.setNeedsDisplay()
        allDayView.setNeedsLayout()
        setNeedsLayout()
        layoutIfNeeded()
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
        
        // (НОВО) Задаваме списъка с календари от ViewModel
        calendarsHeaderView.calendarsDict = calendarVM.multiCalendarsDict
        observeCalendarSources()
        
        startRedrawTimer()
    }

    private func observeCalendarSources() {
        calendarVM.$selectedCalendarIDs
            .dropFirst()
            .removeDuplicates()
            .receive(on: RunLoop.main)
            .sink { [weak self] _ in
                Task { @MainActor [weak self] in
                    self?.refreshCalendarSources()
                }
            }
            .store(in: &calendarSourceCancellables)

        calendarVM.$allCalendars
            .dropFirst()
            .receive(on: RunLoop.main)
            .sink { [weak self] _ in
                Task { @MainActor [weak self] in
                    self?.refreshCalendarSources()
                }
            }
            .store(in: &calendarSourceCancellables)

        NotificationCenter.default.publisher(for: .appLocalCalendarStoreChanged)
            .receive(on: RunLoop.main)
            .sink { [weak self] _ in
                Task { @MainActor [weak self] in
                    self?.refreshCalendarSources()
                }
            }
            .store(in: &calendarSourceCancellables)
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
        
        daysHeaderScrollView.showsVerticalScrollIndicator   = false
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
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
        
        
        addSubview(singleDayCarousel)
        singleDayCarousel.onDaySelected = { [weak self] date in
            guard let self = self else { return }
            self.fromDate = date
            self.onRangeChange?(date, date)
            self.setNeedsLayout()
        }
        
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
            title: !isLandscape ? appDateFormatter(template: "LLLL").string(from: fromDate) : nil,
            range: nil, rangeIsSelected: false,
            rtl: usesRightToLeftLayout, localeIdentifier: Locale.appFormatting.identifier),
            hidden: isSearching,
            onTitle: { [weak self] in self?.monthLabelTapped() },
            onRange: {  },
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
        
        topBackgroundView.frame = CGRect(x: 0, y: 0, width: bounds.width, height: topOffset)
        topBackgroundView.layer.zPosition = 3

        navBar.frame = CGRect(x: 0, y: topOffset, width: bounds.width, height: navBarHeight)
        
        updateScreenHeader()

        var singleDayCarouselHeight: CGFloat = 70
        singleDayCarousel.isHidden = false
        if hidesSingleDayCarousel {
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
        let selectedCalendarCount = calendarVM.multiCalendarsDict.values.filter { $0.selected }.count
        let displayedCalendarCount = max(
            1,
            selectedCalendarCount == 0 ? calendarVM.multiCalendarsDict.count : selectedCalendarCount
        )
        // Same 100-point minimum as MultiDay. All four scroll surfaces share
        // this width; adding calendars must not squeeze existing columns.
        let totalCalendarWidth = TimelineInteractionGeometry.columnWidth(
            available: availableWidth, count: displayedCalendarCount
        ) * CGFloat(displayedCalendarCount)

        weekView.dayColumnWidth       = totalCalendarWidth
        // The single date stays centered in the viewport, independently of
        // the scrollable calendar columns below it.
        daysHeaderView.dayColumnWidth = availableWidth
        allDayView.dayColumnWidth     = totalCalendarWidth
        
        let totalDaysHeaderWidth = totalCalendarWidth
        daysHeaderScrollView.contentSize = CGSize(width: availableWidth, height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0,
                                      width: availableWidth,
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
            daysHeaderScrollView.setContentOffset(.zero, animated: false)
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
        #if DEBUG
        let indicatorDate = ScreenshotMode.referenceDate ?? Date()
        #else
        let indicatorDate = Date()
        #endif
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? indicatorDate : nil
        
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
        guard !isSynchronizingScroll, scrollView != daysHeaderScrollView else { return }
        isSynchronizingScroll = true
        defer { isSynchronizingScroll = false }
        if scrollView == mainScrollView {
            let syncedOffsetY = syncedVerticalOffset(for: scrollView.contentOffset.y)
            if abs(scrollView.contentOffset.y - syncedOffsetY) > 0.5 {
                mainScrollView.contentOffset.y = syncedOffsetY
            }
            allDayScrollView.contentOffset.x         = scrollView.contentOffset.x
            calendarsHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y      = syncedOffsetY
        }
        else if scrollView == hoursColumnScrollView {
            let y = syncedVerticalOffset(for: scrollView.contentOffset.y)
            hoursColumnScrollView.contentOffset = CGPoint(x: 0, y: y)
            mainScrollView.contentOffset.y = y
        }
        else if scrollView == allDayScrollView {
            mainScrollView.contentOffset.x           = scrollView.contentOffset.x
            calendarsHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
        }
        else if scrollView == calendarsHeaderScrollView {
            mainScrollView.contentOffset.x       = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x     = scrollView.contentOffset.x
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
    
    @objc private func searchButtonTapped() {
        isSearching  = true
        searchText   = ""
    }

    @objc private func closeSearchButtonTapped() {
        isSearching = false
        searchText = ""
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
