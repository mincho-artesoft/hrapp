import UIKit
import SwiftUI
import EventKit
import EventKitUI

public final class TwoWayPinnedMultiDayContainerMultiCalendarView: UIView,
                                                                  UIScrollViewDelegate,
                                                                  UIGestureRecognizerDelegate,
                                                                  UISearchBarDelegate
{
    // ---------------------------------------------------------
    // MARK: - Публични/други пропъртита
    // ---------------------------------------------------------
    public var showSingleDay: Bool = false {
        didSet {
            if showSingleDay {
                toDate = fromDate
            }
            monthLabel.isHidden = !showSingleDay
            setNeedsLayout()
        }
    }
    
    public var currentView: Int = 3
    public var onViewChange: ((Int) -> Void)?
    
    public var fromDate: Date = Date() {
        didSet {
            refreshDateRangeButtonTitle()
            daysHeaderView.fromDate = fromDate
            allDayView.fromDate     = fromDate
            weekView.fromDate       = fromDate
            
            if showSingleDay { toDate = fromDate }
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
            allDayView.toDate     = toDate
            weekView.toDate       = toDate
            setNeedsLayout()
            if fromDate > toDate {
                fromDate = toDate
            }
        }
    }
    public var onRangeChange: ((Date, Date) -> Void)?
    
    public var onEventTap: ((EventDescriptor) -> Void)? {
        didSet {
            weekView.onEventTap   = onEventTap
            allDayView.onEventTap = onEventTap
        }
    }
    public var onEmptyLongPress: ((Date) -> Void)? {
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
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)? {
        didSet {
            weekView.onEventDragResizeEnded   = onEventDragResizeEnded
            allDayView.onEventDragResizeEnded = onEventDragResizeEnded
        }
    }
    public var onDayLabelTap: ((Date) -> Void)? {
        didSet { daysHeaderView.onDayTap = onDayLabelTap }
    }
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
    public let weekView       = MultiDayTimelineMultiCalendarView()
    
    // MARK: - Горна лента (navBar)
    private let navBar = UIView()
    
    private let monthLabel: UILabel = {
        let label = UILabel()
        label.text = ""
        label.font = .systemFont(ofSize: 16, weight: .medium)
        label.textColor = .label
        label.isHidden  = true
        return label
    }()
    
    private let singleDayCarousel: WeekCarouselView = {
        let view = WeekCarouselView()
        view.backgroundColor = .secondarySystemBackground
        view.isHidden = true
        return view
    }()
    
    private let dateRangeButton: UIButton = {
        let btn = UIButton(type: .custom)
        btn.setTitle("Няма избран период", for: .normal)
        btn.titleLabel?.font = .systemFont(ofSize: 16, weight: .medium)
        btn.layer.cornerRadius = 8
        btn.backgroundColor = .systemGray5
        btn.setTitleColor(.label,      for: .normal)
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
    
    private let addEventButton: UIButton = {
        let btn = UIButton(type: .system)
        let image = UIImage(systemName: "plus")
        btn.setImage(image, for: .normal)
        btn.tintColor = .systemBlue
        return btn
    }()
    
    // MARK: - Търсене
    private let searchButton: UIButton = {
        let btn = UIButton(type: .system)
        let image = UIImage(systemName: "magnifyingglass")
        btn.setImage(image, for: .normal)
        btn.tintColor = .systemBlue
        return btn
    }()
    
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
    
    // ---------------------------------------------------------
    // MARK: - Dropdown с цифри 1..10
    // ---------------------------------------------------------
    private var selectedDigits = Set<Int>()
    private var digitsDropdownView: DigitsDropdownView?
    private var dropdownBackgroundView: UIControl?
    
    // ▼ Промяна #1: Правим две изображения за стрелките + бутон с по-малка икона вдясно
    // ---------------------------------------------------------
    // Конфигурацията за "по-малка" икона
    private let smallConfig = UIImage.SymbolConfiguration(pointSize: 14, weight: .regular)
    // Двете икони (chevron.right / chevron.down)
    private lazy var arrowImageRight: UIImage? = UIImage(systemName: "chevron.right", withConfiguration: smallConfig)
    private lazy var arrowImageDown:  UIImage? = UIImage(systemName: "chevron.down",  withConfiguration: smallConfig)

    // ---------------------------------------------------------
    // ВАЖНАТА ПРОМЯНА: премахваме titleEdgeInsets (за iOS 15+)
    // ---------------------------------------------------------
    // Използваме if #available, за да избегнем депрекейшъна.
    private let calendarsMultiSelectButton: UIButton = {
        if #available(iOS 15.0, *) {
            // iOS 15+ -> ползваме UIButton.Configuration
            var config = UIButton.Configuration.plain()
            
            // Текст на бутона
            config.title = "Calendars"  // Тук може да е по-дълъг текст
            
            // Цвят на текста
            config.baseForegroundColor = .systemBlue
            
            // Слагаме иконата (chevron) вдясно
            config.image = UIImage(systemName: "chevron.right")
            config.imagePlacement = .trailing
            config.imagePadding = 8
            
            // Подравняваме текста вляво, и при недостиг на място ще се „отреже“ ...
            config.titleAlignment = .leading
            config.titleLineBreakMode = .byTruncatingTail
            
            // Вътрешни отстояния (горе,ляво,долу,дясно)
            config.contentInsets = NSDirectionalEdgeInsets(top: 8, leading: 12, bottom: 8, trailing: 12)

            let btn = UIButton(type: .system)
            btn.configuration = config
            
            // За всеки случай, подсигуряваме, че няма да има многоредов текст
            btn.titleLabel?.numberOfLines = 1
            btn.titleLabel?.lineBreakMode = .byTruncatingTail
            
            // Тук може да сложите фиксирана ширина или Auto Layout constraint:
            // btn.widthAnchor.constraint(equalToConstant: 180).isActive = true
            // Или минимална ширина:
            // btn.widthAnchor.constraint(greaterThanOrEqualToConstant: 120).isActive = true
            
            return btn
            
        } else {
            // iOS 14 (или по-старо) -> старият подход
            let btn = UIButton(type: .system)
            
            btn.setTitle("Calendars", for: .normal)
            btn.tintColor = .systemBlue
            
            // Слагаме иконата „chevron.right“ вдясно
            if let chevronImage = UIImage(systemName: "chevron.right") {
                btn.setImage(chevronImage, for: .normal)
                // С forceRightToLeft иконата остава отдясно на текста
                btn.semanticContentAttribute = .forceRightToLeft
            }
            
            // Вътрешни отстояния (горе,ляво,долу,дясно)
            btn.contentEdgeInsets = UIEdgeInsets(top: 8, left: 12, bottom: 8, right: 12)
            
            // Един ред, и ако няма място - да реже текста с „…“
            btn.titleLabel?.numberOfLines = 1
            btn.titleLabel?.lineBreakMode = .byTruncatingTail
            
            // И тук може да зададете width constraint при Auto Layout, ако желаете
            // btn.widthAnchor.constraint(equalToConstant: 180).isActive = true
            
            return btn
        }
    }()




    // ---------------------------------------------------------
    // MARK: - Layout constants
    // ---------------------------------------------------------
    fileprivate let navBarHeight: CGFloat   = 50
    fileprivate let daysHeaderHeight: CGFloat = 20
    fileprivate let leftColumnWidth: CGFloat  = 60
    
    private let topBorder    = CALayer()
    private let bottomBorder = CALayer()
    
    private var showCalendar = false
    private var calendarHostingController: UIHostingController<CalendarDateRangePickerWrapper>?
    private var calendarBackgroundView: UIView?
    
    private var redrawTimer: Timer?
    private var isInSecondPass = false
    private let topBackgroundView = UIView()
    
    // ---------------------------------------------------------
    // MARK: - Инициализация
    // ---------------------------------------------------------
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
    
    // ---------------------------------------------------------
    // MARK: - Setup
    // ---------------------------------------------------------
    private func setupViews() {
        backgroundColor = .systemBackground
        clipsToBounds   = true
        
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator   = true
        mainScrollView.bounces = false
        mainScrollView.layer.zPosition = 1
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)
        
        allDayScrollView.delegate = self
        allDayScrollView.showsHorizontalScrollIndicator = false
        allDayScrollView.showsVerticalScrollIndicator   = true
        allDayScrollView.alwaysBounceHorizontal = false
        allDayScrollView.alwaysBounceVertical   = false
        allDayScrollView.bounces = false
        allDayScrollView.layer.zPosition = 2
        allDayScrollView.addSubview(allDayView)
        addSubview(allDayScrollView)
        
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        hoursColumnScrollView.layer.zPosition = 3
        addSubview(hoursColumnScrollView)
        
        daysHeaderScrollView.showsVerticalScrollIndicator   = false
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
        
        allDayTitleLabel.text  = "  all-day"
        allDayTitleLabel.font  = .systemFont(ofSize: 14, weight: .semibold)
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
        
        searchBar.delegate = self
        navBar.addSubview(searchBar)
        
        addSubview(singleDayCarousel)
        singleDayCarousel.onDaySelected = { [weak self] date in
            guard let self = self else { return }
            self.fromDate = date
            self.toDate   = date
            self.onRangeChange?(date, date)
            self.setNeedsLayout()
        }
        
        dateRangeButton.addTarget(self, action: #selector(didTapDateRangeButton), for: .touchUpInside)
        navBar.addSubview(dateRangeButton)
        
        navBar.addSubview(addEventButton)
        addEventButton.addTarget(self, action: #selector(addEventButtonTapped), for: .touchUpInside)
        
        if #available(iOS 14.0, *) {
            viewMenuButton.showsMenuAsPrimaryAction = true
            viewMenuButton.menu = buildViewMenu()
        } else {
            viewMenuButton.addTarget(self, action: #selector(legacyMenuTapped), for: .touchUpInside)
        }
        navBar.addSubview(viewMenuButton)
        
        navBar.addSubview(searchButton)
        searchButton.addTarget(self, action: #selector(searchButtonTapped), for: .touchUpInside)
        
        // ▼ Промяна #2 (от по-горния код): вече дефиниран calendarsMultiSelectButton
        //    го добавяме към navBar
        navBar.addSubview(calendarsMultiSelectButton)
        calendarsMultiSelectButton.addTarget(
            self,
            action: #selector(toggleDigitsDropdown),
            for: .touchUpInside
        )
        
        daysHeaderView.leadingInsetForHours = 0
        allDayView.leadingInsetForHours     = 0
        weekView.leadingInsetForHours       = 0
        
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
        
        hoursColumnView.hourHeight          = 50
        hoursColumnView.extraMarginTopBottom = 10
        
        weekView.hourHeight = 50
        weekView.topMargin  = 10
        
        topBackgroundView.backgroundColor = .secondarySystemBackground
        addSubview(topBackgroundView)
    }
    
    // ---------------------------------------------------------
    // MARK: - Layout
    // ---------------------------------------------------------
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        let isLandscape = bounds.width > bounds.height
        let topOffset: CGFloat = isLandscape ? 0 : 60
        
        topBackgroundView.frame = CGRect(x: 0, y: 0, width: bounds.width, height: topOffset)
        topBackgroundView.layer.zPosition = 3
        
        navBar.frame = CGRect(x: 0, y: topOffset, width: bounds.width, height: navBarHeight)
        
        if showSingleDay && !isLandscape {
            let df = DateFormatter()
            df.dateFormat = "LLLL"
            monthLabel.text = df.string(from: fromDate)
            monthLabel.textColor = .systemBlue
            monthLabel.sizeToFit()
            let mlX: CGFloat = 10
            let mlY = (navBarHeight - monthLabel.bounds.height) / 2
            monthLabel.frame = CGRect(x: mlX, y: mlY,
                                      width: monthLabel.bounds.width,
                                      height: monthLabel.bounds.height)
            monthLabel.isHidden = false
        } else {
            monthLabel.isHidden = true
        }
        
        let menuBtnSize: CGFloat   = 34
        let searchBtnSize: CGFloat = 34
        let plusBtnSize:   CGFloat = 34
        let margin:  CGFloat       = 8
        
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
        
        let searchButtonX = menuButtonX - searchBtnSize - margin
        searchButton.frame = CGRect(
            x: searchButtonX,
            y: centerY,
            width: searchBtnSize,
            height: searchBtnSize
        )
        
        let plusButtonX = searchButtonX - plusBtnSize - margin
        addEventButton.frame = CGRect(
            x: plusButtonX,
            y: centerY,
            width: plusBtnSize,
            height: plusBtnSize
        )
        
        // Бутон за digits (Calendars)
        let calButtonW: CGFloat = 130
        let calButtonH: CGFloat = 34
        let calButtonX = plusButtonX - calButtonW + margin
        calendarsMultiSelectButton.frame = CGRect(
            x: calButtonX,
            y: centerY,
            width: calButtonW,
            height: calButtonH
        )
        calendarsMultiSelectButton.layer.cornerRadius = 8
        calendarsMultiSelectButton.layer.masksToBounds = true
        
        // dateRangeButton
        let btnW: CGFloat = 220
        let btnH: CGFloat = 40
        let x = calButtonX - btnW - margin
        let y = (navBar.bounds.height - btnH) / 2
        dateRangeButton.frame = CGRect(x: x, y: y, width: btnW, height: btnH)
        
        if !isSearching {
            dateRangeButton.isHidden = showSingleDay
        }
        
        var singleDayCarouselHeight: CGFloat = showSingleDay ? 70 : 0
        singleDayCarousel.isHidden = !showSingleDay
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
        if showSingleDay {
            singleDayCarousel.selectedDate = fromDate
        }
        
        let yMain = singleDayCarousel.frame.maxY
        
        cornerView.frame = CGRect(
            x: 0,
            y: yMain,
            width: leftColumnWidth,
            height: daysHeaderHeight
        )
        
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
        daysHeaderView.frame = CGRect(x: 0, y: 0,
                                      width: totalDaysHeaderWidth,
                                      height: daysHeaderHeight)
        
        let allDayY    = yMain + daysHeaderHeight
        let oldOffset  = allDayScrollView.contentOffset
        let allDayH    = allDayView.desiredHeight()
        let allDayFullH = allDayView.contentHeight
        
        allDayTitleLabel.frame = CGRect(x: 0, y: allDayY,
                                        width: leftColumnWidth, height: allDayH)
        
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
        
        let totalHours = 25
        let baseHeight = CGFloat(totalHours) * weekView.hourHeight
        let finalHeight = baseHeight + (weekView.topMargin * 2)
        
        let totalWidth  = CGFloat(dayCount) * weekView.dayColumnWidth
        mainScrollView.contentSize = CGSize(width: totalWidth, height: finalHeight)
        weekView.frame = CGRect(x: 0, y: 0,
                                width: totalWidth,
                                height: finalHeight)
        
        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: finalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0,
                                       width: leftColumnWidth,
                                       height: finalHeight)
        
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil
        
        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
        allDayView.setNeedsLayout()
        
        if isInSecondPass {
            isInSecondPass = false
        } else {
            let newH  = allDayView.desiredHeight()
            let newCH = allDayView.contentHeight
            let diff1 = abs(newH - allDayScrollView.frame.height)
            let diff2 = abs(newCH - allDayScrollView.contentSize.height)
            if diff1 > 0.5 || diff2 > 0.5 {
                isInSecondPass = true
                setNeedsLayout()
            }
        }
        
        layoutSearchResultsIfNeeded()
        
        // Ако dropdown вече е отворен => преизчисляваме позицията му (напр. при завъртане)
        if let dView = digitsDropdownView {
            positionDigitsDropdown(dView)
        }
    }
    
    // ---------------------------------------------------------
    // MARK: - UIScrollViewDelegate
    // ---------------------------------------------------------
    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x     = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
        else if scrollView == daysHeaderScrollView {
            mainScrollView.contentOffset.x   = scrollView.contentOffset.x
            allDayScrollView.contentOffset.x = scrollView.contentOffset.x
        }
        else if scrollView == allDayScrollView {
            mainScrollView.contentOffset.x     = scrollView.contentOffset.x
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
        }
    }
    
    // ---------------------------------------------------------
    // MARK: - Timer за презарисуване (червена линия и т.н.)
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
    @available(iOS 14.0, *)
    private func buildViewMenu() -> UIMenu {
        let dayAction = UIAction(title: "Day", state: (currentView == 1 ? .on : .off)) { [weak self] _ in
            self?.showSingleDay = true
            self?.onViewChange?(1)
        }
        let multiAction = UIAction(title: "MultiDay", state: (currentView == 3 ? .on : .off)) { [weak self] _ in
            self?.showSingleDay = false
            self?.onViewChange?(3)
        }
        let monthAction = UIAction(title: "Month", state: (currentView == 0 ? .on : .off)) { [weak self] _ in
            self?.onViewChange?(0)
        }
        let yearAction = UIAction(title: "Year", state: (currentView == 2 ? .on : .off)) { [weak self] _ in
            self?.onViewChange?(2)
        }
        let listAction = UIAction(title: "List", state: (currentView == 4 ? .on : .off)) { [weak self] _ in
            self?.onViewChange?(4)
        }
        let multiCal = UIAction(title: "MultiCalendar", state: (currentView == 5 ? .on : .off)) { [weak self] _ in
            self?.onViewChange?(5)
        }
        
        return UIMenu(title: "", children: [
            dayAction, multiAction, monthAction, yearAction, listAction, multiCal
        ])
    }
    
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
        sheet.addAction(UIAlertAction(title: "List", style: .default, handler: { [weak self] _ in
            self?.onViewChange?(4)
        }))
        sheet.addAction(UIAlertAction(title: "MultiCalendar", style: .default, handler: { [weak self] _ in
            self?.onViewChange?(5)
        }))
        sheet.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        
        if let topVC = topMostViewController() {
            if UIDevice.current.userInterfaceIdiom == .pad {
                sheet.popoverPresentationController?.sourceView = topVC.view
            }
            topVC.present(sheet, animated: true)
        }
    }
    
    // ---------------------------------------------------------
    // MARK: - DateRangeButton
    // ---------------------------------------------------------
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
        guard let topVC = topMostViewController() else { return }
        guard !showCalendar else { return }
        showCalendar = true
        
        let backgroundView = UIView(frame: topVC.view.bounds)
        backgroundView.backgroundColor = UIColor.black.withAlphaComponent(0)
        backgroundView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        backgroundView.layer.zPosition  = 9998
        topVC.view.addSubview(backgroundView)
        calendarBackgroundView = backgroundView
        
        let swiftUICalendar = CalendarDateRangePickerWrapper(
            startDate: fromDate,
            endDate:   toDate,
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
        hc.view.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.7)
        hc.view.layer.cornerRadius = 12
        hc.view.layer.masksToBounds = true
        hc.view.layer.zPosition     = 9999
        self.calendarHostingController = hc
        
        let buttonFrameInWindow = dateRangeButton.superview?.convert(dateRangeButton.frame, to: topVC.view) ?? .zero
        
        let calendarWidth:  CGFloat = 350
        let calendarHeight: CGFloat = 350
        
        var finalX = buttonFrameInWindow.midX - (calendarWidth / 2)
        var finalY = buttonFrameInWindow.maxY + 8
        
        if (finalX + calendarWidth) > topVC.view.bounds.maxX {
            finalX = topVC.view.bounds.maxX - calendarWidth - 10
        }
        if finalX < 10 {
            finalX = 10
        }
        
        if (finalY + calendarHeight) > topVC.view.bounds.maxY {
            finalY = buttonFrameInWindow.minY - calendarHeight - 8
        }
        
        hc.view.frame = CGRect(x: finalX, y: finalY,
                               width: calendarWidth, height: calendarHeight)
        backgroundView.addSubview(hc.view)
        
        hc.view.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
        hc.view.alpha = 0
        backgroundView.alpha = 0
        UIView.animate(withDuration: 0.25) {
            hc.view.transform = .identity
            hc.view.alpha = 1
            backgroundView.alpha = 1
        }
        
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(containerTapped(_:)))
        tapGesture.cancelsTouchesInView = false
        tapGesture.delegate = self
        backgroundView.addGestureRecognizer(tapGesture)
        
        dateRangeButton.isSelected = true
    }
    
    private func hideCalendarPopup() {
        guard showCalendar else { return }
        showCalendar = false
        
        guard let hc = calendarHostingController,
              let bgView = calendarBackgroundView else {
            dateRangeButton.isSelected = false
            return
        }
        
        UIView.animate(withDuration: 0.2, animations: {
            hc.view.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
            hc.view.alpha = 0
            bgView.alpha   = 0
        }, completion: { _ in
            hc.view.removeFromSuperview()
            bgView.removeFromSuperview()
            self.calendarBackgroundView = nil
        })
        
        calendarHostingController = nil
        dateRangeButton.isSelected = false
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
    private var isSearching: Bool = false {
        didSet {
            if isSearching {
                addEventButton.isHidden      = true
                viewMenuButton.isHidden      = true
                searchButton.isHidden        = true
                calendarsMultiSelectButton.isHidden = true
                
                if showSingleDay {
                    dateRangeButton.isHidden = true
                } else {
                    dateRangeButton.isHidden = true
                }
                animateSearchBarIn()
            } else {
                addEventButton.isHidden      = false
                viewMenuButton.isHidden      = false
                searchButton.isHidden        = false
                calendarsMultiSelectButton.isHidden = false
                
                if showSingleDay {
                    dateRangeButton.isHidden = true
                } else {
                    dateRangeButton.isHidden = false
                }
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
        searchBar.text = ""
        searchBar.becomeFirstResponder()
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
        searchBar.isHidden         = false
        searchBar.showsCancelButton = true
        
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
    private func animateSearchBarOut() {
        let finalFrame = searchBar.frame.offsetBy(dx: 0, dy: -navBarHeight)
        UIView.animate(withDuration: 0.3, animations: {
            self.searchBar.frame = finalFrame
            self.searchBar.alpha = 0
        }, completion: { _ in
            self.searchBar.isHidden         = true
            self.searchBar.showsCancelButton = false
            self.searchBar.text = ""
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
                y: navBarBottom + 60,
                width: bounds.width,
                height: bounds.height - navBarBottom
            )
        }
    }
    
    // ---------------------------------------------------------
    // MARK: - Dropdown с цифри
    // ---------------------------------------------------------
    @objc private func toggleDigitsDropdown() {
        if digitsDropdownView == nil {
            // Ако dropdown не е показан -> показваме го
            showDigitsDropdown()
            
            // ▼ Промяна #3: при отваряне – crossfade chevron.right -> chevron.down
            UIView.transition(
                with: calendarsMultiSelectButton,
                duration: 0.2,
                options: .transitionCrossDissolve,
                animations: { [self] in
                    // Ако сме на iOS 15+ и ползваме config, ъпдейтваме image:
                    if #available(iOS 15.0, *) {
                        var config = calendarsMultiSelectButton.configuration
                        config?.image = self.arrowImageDown
                        calendarsMultiSelectButton.configuration = config
                    } else {
                        // Старият вариант (iOS 14-):
                        calendarsMultiSelectButton.setImage(self.arrowImageDown, for: .normal)
                    }
                },
                completion: nil
            )
        } else {
            // Ако dropdown е отворен -> затваряме го
            hideDigitsDropdown()
            
            // При затваряне – crossfade chevron.down -> chevron.right
            UIView.transition(
                with: calendarsMultiSelectButton,
                duration: 0.2,
                options: .transitionCrossDissolve,
                animations: { [self] in
                    if #available(iOS 15.0, *) {
                        var config = calendarsMultiSelectButton.configuration
                        config?.image = self.arrowImageRight
                        calendarsMultiSelectButton.configuration = config
                    } else {
                        calendarsMultiSelectButton.setImage(self.arrowImageRight, for: .normal)
                    }
                },
                completion: nil
            )
        }
    }
    
    private func showDigitsDropdown() {
        guard digitsDropdownView == nil else { return }
        
        // Прозрачен overlay
        let bg = UIControl(frame: UIScreen.main.bounds)
        bg.backgroundColor = .clear
        bg.addTarget(self, action: #selector(handleTapOutsideDropdown), for: .touchUpInside)
        
        guard let topVC = topMostViewController() else { return }
        topVC.view.addSubview(bg)
        dropdownBackgroundView = bg
        
        let dropdown = DigitsDropdownView()
        dropdown.selectedDigits = self.selectedDigits
        dropdown.onSelectionChanged = { [weak self] newSet in
            self?.selectedDigits = newSet
        }
        
        // Примерни размери
        dropdown.frame = CGRect(x: 0, y: 0, width: 150, height: 240)
        
        bg.addSubview(dropdown)
        digitsDropdownView = dropdown
        
        positionDigitsDropdown(dropdown)
        
        dropdown.alpha = 0
        UIView.animate(withDuration: 0.2) {
            dropdown.alpha = 1
        }
    }
    
    private func positionDigitsDropdown(_ dropdown: DigitsDropdownView) {
        guard let bg = dropdownBackgroundView,
              let topVC = topMostViewController() else { return }
        
        let btnFrameInVC = calendarsMultiSelectButton.superview?
            .convert(calendarsMultiSelectButton.frame, to: topVC.view) ?? .zero
        
        let dW = dropdown.frame.width
        let dH = dropdown.frame.height
        
        let centerX = btnFrameInVC.midX
        var finalX  = centerX - dW / 2
        
        let finalY  = btnFrameInVC.maxY + 4
        
        let screenW = bg.bounds.width
        if (finalX + dW) > (screenW - 10) {
            finalX = screenW - dW - 10
        }
        if finalX < 10 {
            finalX = 10
        }
        
        dropdown.frame = CGRect(x: finalX, y: finalY, width: dW, height: dH)
    }
    
    private func hideDigitsDropdown() {
        guard let bg = dropdownBackgroundView,
              let dropdown = digitsDropdownView else { return }
        
        UIView.animate(withDuration: 0.2, animations: {
            dropdown.alpha = 0
        }, completion: { _ in
            dropdown.removeFromSuperview()
            bg.removeFromSuperview()
        })
        
        digitsDropdownView     = nil
        dropdownBackgroundView = nil
    }
    
    @objc private func handleTapOutsideDropdown() {
        // Тап извън => затваряме
        hideDigitsDropdown()
        
        // Когато „tap“-нем извън, връщаме иконата (чрез crossfade):
        UIView.transition(
            with: calendarsMultiSelectButton,
            duration: 0.2,
            options: .transitionCrossDissolve,
            animations: {
                if #available(iOS 15.0, *) {
                    var config = self.calendarsMultiSelectButton.configuration
                    config?.image = self.arrowImageRight
                    self.calendarsMultiSelectButton.configuration = config
                } else {
                    self.calendarsMultiSelectButton.setImage(self.arrowImageRight, for: .normal)
                }
            },
            completion: nil
        )
    }
    
    // ---------------------------------------------------------
    // MARK: - Помощен метод
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
    
    // ---------------------------------------------------------
    // MARK: - UIGestureRecognizerDelegate
    // ---------------------------------------------------------
    public func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer,
                                  shouldReceive touch: UITouch) -> Bool {
        if let hostingView = calendarHostingController?.view {
            if let tappedView = touch.view, tappedView.isDescendant(of: hostingView) {
                return false
            }
        }
        if let tappedView = touch.view,
           tappedView.isDescendant(of: dateRangeButton) {
            return false
        }
        return true
    }
}
