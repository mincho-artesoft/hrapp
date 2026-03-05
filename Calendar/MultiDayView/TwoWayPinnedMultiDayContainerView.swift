import UIKit
import SwiftUI

// MARK: - TwoWayPinnedMultiDayContainerView
public final class TwoWayPinnedMultiDayContainerView: UIView,
                                                      UIScrollViewDelegate,
                                                      UIGestureRecognizerDelegate,
                                                      UISearchBarDelegate {
    @ObservedObject private var subscriptionManager = SubscriptionManager.shared

    private var didScrollToNow = false

    // MARK: - Public configuration
    public var showSingleDay: Bool = false {
        didSet {
            if showSingleDay {
                toDate = fromDate
            }
            // Показваме или скриваме етикета за месеца
            monthLabel.isHidden = !showSingleDay
            setNeedsLayout()
        }
    }
    
    public var currentView: Int = 3 {
        didSet {
            updateButtonIconForCurrentView()
            viewMenuButton.menu = buildViewMenu()
        }
    }

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
    
    // Добавяме нов лейбъл за месеца (скрит по подразбиране, ще го показваме само при showSingleDay = true)
    private let monthLabel: UILabel = {
        let label = UILabel()
        label.text = ""
        label.font = .systemFont(ofSize: 16, weight: .medium)
        label.textColor = .label
        label.isHidden = true
        return label
    }()
    
    // MARK: - singleDayCarousel
    private let singleDayCarousel: WeekCarouselView = {
        let view = WeekCarouselView()
        view.backgroundColor = .secondarySystemBackground
        view.isHidden = true  // По подразбиране скрит, ако showSingleDay = false
        return view
    }()
    
    private let dateRangeButton: UIButton = {
        let btn = UIButton(type: .custom)
        btn.setTitle("Няма избран период", for: .normal)
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        btn.layer.cornerRadius = 8
        btn.backgroundColor = .systemGray5
        btn.setTitleColor(.label, for: .normal)
        btn.setTitleColor(.systemBlue, for: .selected)
        btn.setTitleColor(.systemBlue, for: .highlighted)
        return btn
    }()
    
    private let viewMenuButton: UIButton = {
        let btn = UIButton(type: .system)
        let image = UIImage(systemName: "ellipsis.circle")
        btn.setImage(image, for: .normal)
        btn.tintColor = .systemBlue
        return btn
    }()
    
    // Бутон “+”
//    private let addEventButton: UIButton = {
//        let btn = UIButton(type: .system)
//        let image = UIImage(systemName: "plus")
//        btn.setImage(image, for: .normal)
//        btn.tintColor = .systemBlue
//        return btn
//    }()
    
    /// NEW: Бутон с лупичка
    private let searchButton: UIButton = {
        let btn = UIButton(type: .system)
        let image = UIImage(systemName: "magnifyingglass")
        btn.setImage(image, for: .normal)
        btn.tintColor = .systemBlue
        return btn
    }()
    
    // MARK: - Search functionality (с Cancel)
    private let searchBar: UISearchBar = {
        let sb = UISearchBar()
        sb.placeholder = "Search events..."
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
            textField.attributedPlaceholder = NSAttributedString(
                string: "Search events...",
                attributes: [.foregroundColor: UIColor.secondaryLabel]
            )
        }
        
        return sb
    }()
    
    private var searchHostingController: UIHostingController<SearchResultsView>?
    
    private var isSearching: Bool = false {
        didSet {
            if isSearching {
                // Крие някои бутони (Add, Menu, Search)
//                addEventButton.isHidden = true
                viewMenuButton.isHidden = true
                searchButton.isHidden = true
                
                // Ако showSingleDay = true, оставяме каросела видим, но скриваме бутона:
                if showSingleDay {
                    dateRangeButton.isHidden = true
                } else {
                    dateRangeButton.isHidden   = true
                }
                
                // Показваме SearchBar с анимация
                animateSearchBarIn()
                
            } else {
                // Възстановяваме бутоните
//                addEventButton.isHidden = false
                viewMenuButton.isHidden = false
                searchButton.isHidden = false
                
                if showSingleDay {
                    dateRangeButton.isHidden   = true
                } else {
                    dateRangeButton.isHidden   = false
                }
                
                // Скриваме SearchBar
                animateSearchBarOut()
            }
        }
    }
    
    private var searchText: String = "" {
        didSet {
            updateSearchResults()
        }
    }
    
    // MARK: - Private constants & variables
    fileprivate let navBarHeight: CGFloat = 50
    fileprivate let daysHeaderHeight: CGFloat = 40
    fileprivate let leftColumnWidth: CGFloat = 60
    
    private let topBorder = CALayer()
    private let bottomBorder = CALayer()
    
    private var showCalendar = false
    private var calendarHostingController: UIHostingController<CalendarDateRangePickerWrapper>?
    private var calendarBackgroundView: UIView?
    
    private var redrawTimer: Timer?
    private var isInSecondPass = false
    
    // Доп. изглед за фон зад navBar (ако желаем да добавим отместване)
    private let topBackgroundView = UIView()
    private let topBackgroundView2 = UIView()

    // MARK: - Lifecycle
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
        startRedrawTimer()
        refreshDateRangeButtonTitle()
        NotificationCenter.default.addObserver(
               self,
               selector: #selector(orientationDidChange),
               name: UIDevice.orientationDidChangeNotification,
               object: nil
           )
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
        startRedrawTimer()
        refreshDateRangeButtonTitle()
        NotificationCenter.default.addObserver(
               self,
               selector: #selector(orientationDidChange),
               name: UIDevice.orientationDidChangeNotification,
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
    
    // MARK: - Setup
    private func setupViews() {
        backgroundColor = .systemBackground
        clipsToBounds = true
        
        // mainScrollView
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.bounces = false
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
        allDayScrollView.layer.zPosition = 2
        allDayScrollView.addSubview(allDayView)
        addSubview(allDayScrollView)
        
        // hoursColumnScrollView
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        hoursColumnScrollView.layer.zPosition = 3
        addSubview(hoursColumnScrollView)
        
        hoursColumnWeatherScrollView.showsVerticalScrollIndicator = false
        hoursColumnWeatherScrollView.isScrollEnabled = false
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
        allDayTitleLabel.numberOfLines = 1
        allDayTitleLabel.adjustsFontSizeToFitWidth = true
        allDayTitleLabel.minimumScaleFactor = 0.5   // може да намалява до 50% от оригиналния размер
        allDayTitleLabel.lineBreakMode = .byTruncatingTail
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
        
        // Добавяме monthLabel в navBar
        navBar.addSubview(monthLabel)
        
        // Search bar
        searchBar.delegate = self
        navBar.addSubview(searchBar)
        
        // singleDayCarousel
        addSubview(singleDayCarousel)
        singleDayCarousel.onDaySelected = { [weak self] date in
            guard let self = self else { return }
            self.fromDate = date
            self.toDate   = date
            self.onRangeChange?(date, date)
            self.setNeedsLayout()
        }
        
        // dateRangeButton
        dateRangeButton.addTarget(self, action: #selector(didTapDateRangeButton), for: .touchUpInside)
        navBar.addSubview(dateRangeButton)
        
        // addEventButton
//        navBar.addSubview(addEventButton)
//        addEventButton.addTarget(self, action: #selector(addEventButtonTapped), for: .touchUpInside)
        
        updateButtonIconForCurrentView() // дава началната икона
           
           if #available(iOS 14.0, *) {
              viewMenuButton.showsMenuAsPrimaryAction = true
              viewMenuButton.menu = buildViewMenu()
           }
        navBar.addSubview(viewMenuButton)
        
        // searchButton
        navBar.addSubview(searchButton)
        searchButton.addTarget(self, action: #selector(searchButtonTapped), for: .touchUpInside)
        
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
        searchBar.text = ""
        searchBar.becomeFirstResponder()
    }
    
    // MARK: - UISearchBarDelegate
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
        searchBar.isHidden          = false
        searchBar.showsCancelButton = true          // ← бутонът вече съществува

        customizeCancelButton()                     // ⏪ тук

        let sbHeight: CGFloat = 36
        let finalY = (navBarHeight - sbHeight) / 2
        let finalFrame = CGRect(x: 10, y: finalY,
                                width: navBar.bounds.width - 20, height: sbHeight)

        let startFrame = finalFrame.offsetBy(dx: 0, dy: -navBarHeight)
        searchBar.frame = startFrame
        searchBar.alpha = 0

        UIView.animate(withDuration: 0.3) {
            self.searchBar.frame = finalFrame
            self.searchBar.alpha = 1
        }
    }
    
    // MARK: - Преоразяване на “Cancel” в xmark
    private func customizeCancelButton() {
        guard let cancelBtn = searchBar.value(forKey: "cancelButton") as? UIButton else { return }

        // махаме текста и слагаме SF символ
        cancelBtn.setTitle("", for: .normal)
        let img = UIImage(systemName: "xmark")?.withRenderingMode(.alwaysTemplate)
        cancelBtn.setImage(img, for: .normal)

        // цвят и размер

        cancelBtn.tintColor = .secondaryLabel        // или .label, .secondaryLabel, каквото решиш
        cancelBtn.frame.size = CGSize(width: 22, height: 22)   // компактно
    }

    
    private func animateSearchBarOut() {
        let finalFrame = searchBar.frame.offsetBy(dx: 0, dy: -navBarHeight)
        
        UIView.animate(withDuration: 0.3, animations: {
            self.searchBar.frame = finalFrame
            self.searchBar.alpha = 0
        }, completion: { _ in
            self.searchBar.isHidden = true
            self.searchBar.showsCancelButton = false
            self.searchBar.text = ""
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
        
        guard shouldShow == true else {
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
                    y: navBarBottom + 60,
                    width: bounds.width,
                    height: bounds.height - navBarBottom
                )
        }
    }
    
    // Бутон "+"
    @objc private func addEventButtonTapped() {
        onAddNewEvent?()
    }
    
    // MARK: - Layout
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        let isLandscape = bounds.width > bounds.height
        let topOffset: CGFloat = isLandscape ? 0 : 53.5
        
        // 1. Фон зад navBar (ако има)
        topBackgroundView.frame = CGRect(x: 0, y: 0, width: bounds.width, height: topOffset)
        topBackgroundView.layer.zPosition = 3
        
        // 2. NavBar
        navBar.frame = CGRect(x: 0, y: topOffset, width: bounds.width - 2, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]
        
        // Ако сме в режим showSingleDay и не сме в пейзажен режим, показваме monthLabel с името на месеца
        if showSingleDay && !isLandscape {
            let df = DateFormatter()
            df.dateFormat = "LLLL"
            monthLabel.text = df.string(from: fromDate)
            monthLabel.textColor = .systemBlue
            monthLabel.sizeToFit()
            let mlX: CGFloat = 10
            let mlY = (navBarHeight - monthLabel.bounds.height) / 2
            monthLabel.frame = CGRect(x: mlX, y: mlY, width: monthLabel.bounds.width, height: monthLabel.bounds.height)
            monthLabel.isHidden = false
        } else {
            monthLabel.isHidden = true
        }
        
        // Подреждаме бутоните в navBar
        let menuBtnSize: CGFloat = 34
        let searchBtnSize: CGFloat = 34
        let plusBtnSize: CGFloat = 34
        let margin: CGFloat = 8
        
        let menuButtonX = navBar.bounds.width - menuBtnSize - 10
        let centerY = (navBar.bounds.height - menuBtnSize) / 2
        viewMenuButton.frame = CGRect(x: menuButtonX, y: centerY, width: menuBtnSize, height: menuBtnSize)
        
        let searchButtonX = menuButtonX - searchBtnSize - margin
        searchButton.frame = CGRect(x: searchButtonX, y: centerY, width: searchBtnSize, height: searchBtnSize)
        
        let plusButtonX = searchButtonX - plusBtnSize - margin
//        addEventButton.frame = CGRect(x: plusButtonX, y: centerY, width: plusBtnSize, height: plusBtnSize)
        
        let btnW: CGFloat = 220
        let btnH: CGFloat = 40
        let btnX = plusButtonX - btnW - margin
        let btnY = (navBar.bounds.height - btnH) / 2
        dateRangeButton.frame = CGRect(x: btnX, y: btnY, width: btnW, height: btnH)
        
        // Ако не търсим, скриваме dateRangeButton при showSingleDay
        if !isSearching {
            dateRangeButton.isHidden = showSingleDay
        }
        
        // 3. SingleDayCarousel
        var singleDayCarouselHeight: CGFloat = showSingleDay ? 70 : 0
        singleDayCarousel.isHidden = !showSingleDay
        if isLandscape {
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
        cornerView.frame = CGRect(x: 0, y: yMain, width: leftColumnWidth, height: daysHeaderHeight)
        daysHeaderScrollView.frame = CGRect(x: leftColumnWidth, y: yMain, width: bounds.width - leftColumnWidth, height: daysHeaderHeight)
        
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
        
        // 5. All-Day View
        allDayView.recalcAllDayHeightDynamically()
        let allDayY = yMain + daysHeaderHeight
        let oldOffset = allDayScrollView.contentOffset
        let allDayH = allDayView.desiredHeight()
        let allDayFullH = allDayView.contentHeight
        allDayTitleLabel.frame = CGRect(x: 0, y: allDayY, width: leftColumnWidth, height: allDayH)
        allDayScrollView.frame = CGRect(x: leftColumnWidth, y: allDayY, width: bounds.width - leftColumnWidth, height: allDayH)
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
        hoursColumnScrollView.frame = CGRect(x: 0, y: hoursColumnY, width: leftColumnWidth, height: bounds.height - hoursColumnY)
        hoursColumnWeatherScrollView.frame = CGRect(x: bounds.width - 50,
                                    y: hoursColumnY,
                                    width: 50,
                                    height: bounds.height - hoursColumnY)
        mainScrollView.frame = CGRect(x: leftColumnWidth, y: hoursColumnY, width: bounds.width - leftColumnWidth, height: bounds.height - hoursColumnY)
        
        let totalHours = 25
        let baseHeight = CGFloat(totalHours) * weekView.hourHeight
        let finalHeight = baseHeight + (weekView.topMargin * 2)
        let totalWidth = CGFloat(dayCount) * weekView.dayColumnWidth
        mainScrollView.contentSize = CGSize(width: totalWidth, height: finalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: finalHeight)
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: finalHeight)
        hoursColumnWeatherScrollView.contentSize = CGSize(width: leftColumnWidth, height: finalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: finalHeight)
        hoursColumnWeatherView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: finalHeight)
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil
        
        hoursColumnWeatherView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        
        hoursColumnView.setNeedsDisplay()
        hoursColumnWeatherView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()
        
        // 7. Интеграция на данните за прогнозата
        // Ако сме в режим showSingleDay и fromDate е в интервала [днес, днес + 9 дни],
        // вземаме данни от WeatherKitViewModel.shared.hourlyForecast за избрания ден.
        let todayDay = cal.startOfDay(for: Date())
        let daysDifference = cal.dateComponents([.day], from: todayDay, to: fromOnly).day ?? -1
        if showSingleDay, daysDifference >= 0, daysDifference <= 9 {
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
          }
    }


    // MARK: - UIScrollViewDelegate
    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x     = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
            hoursColumnWeatherScrollView.contentOffset.y = scrollView.contentOffset.y

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
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first else {
            print("No active UIWindow found.")
            return
        }
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
        let buttonFrameInWindow = dateRangeButton.superview?.convert(dateRangeButton.frame, to: window) ?? .zero
        
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
    
    // MARK: - Helpers
    private func refreshDateRangeButtonTitle() {
        if fromDate > toDate {
            dateRangeButton.setTitle(NSLocalizedString("No selected range", comment: ""), for: .normal)
        } else {
            let s = fmt(fromDate)
            let e = fmt(toDate)
            if s.isEmpty || e.isEmpty {
                dateRangeButton.setTitle(NSLocalizedString("No selected range", comment: ""), for: .normal)
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
        if let tappedView = touch.view, tappedView.isDescendant(of: dateRangeButton) {
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
        let now = Date()
        let cal = Calendar.current
        let comps = cal.dateComponents([.hour, .minute], from: now)
        guard let hour = comps.hour, let minute = comps.minute else { return }

        // Пресмятаме честичното число на часа
        let hoursFloat = CGFloat(hour) + CGFloat(minute) / 60.0
        // y-координата на линията „сега“
        let yNow = 10 + hoursFloat * weekView.hourHeight

        // Искаме yNow да е в средата на екрана:
        let midScreenY = mainScrollView.bounds.height / 2
        var targetOffsetY = yNow - midScreenY

        // Ограничаваме до валидния диапазон
        let maxOffsetY = max(0, mainScrollView.contentSize.height - mainScrollView.bounds.height)
        targetOffsetY = min(max(targetOffsetY, 0), maxOffsetY)

        // Скролваме без анимация
        mainScrollView.setContentOffset(CGPoint(x: mainScrollView.contentOffset.x, y: targetOffsetY), animated: false)
        hoursColumnScrollView.setContentOffset(CGPoint(x: 0, y: targetOffsetY), animated: false)
        hoursColumnWeatherScrollView.setContentOffset(CGPoint(x: 0, y: targetOffsetY), animated: false)
    }

}
