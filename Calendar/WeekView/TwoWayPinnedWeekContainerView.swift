import UIKit
import CalendarKit

public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let navBarHeight: CGFloat = 60
    private let daysHeaderHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 70

    /// Вместо бутони за смяна на седмица, имаме два DatePicker-а
    private let fromDatePicker = UIDatePicker()
    private let toDatePicker   = UIDatePicker()

    private let cornerView = UIView()
    private let daysHeaderScrollView = UIScrollView()
    private let daysHeaderView = DaysHeaderView()

    private let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()

    private let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    /// Callback – когато потребителят смени датите в DatePicker-ите
    public var onRangeChange: ((Date, Date) -> Void)?

    /// При тап върху евент
    public var onEventTap: ((EventDescriptor) -> Void)? {
        didSet { weekView.onEventTap = onEventTap }
    }

    /// Long press в празно
    public var onEmptyLongPress: ((Date) -> Void)? {
        didSet { weekView.onEmptyLongPress = onEmptyLongPress }
    }

    /// Drag/Drop
    public var onEventDragEnded: ((EventDescriptor, Date) -> Void)? {
        didSet { weekView.onEventDragEnded = onEventDragEnded }
    }
    public var onEventDragResizeEnded: ((EventDescriptor, Date) -> Void)? {
        didSet { weekView.onEventDragResizeEnded = onEventDragResizeEnded }
    }

    /// Тап върху label на ден
    public var onDayLabelTap: ((Date) -> Void)? {
        didSet { daysHeaderView.onDayTap = onDayLabelTap }
    }

    // Нашите дати за диапазона
    public var fromDate: Date = Date() {
        didSet {
            daysHeaderView.fromDate = fromDate
            weekView.fromDate = fromDate
            fromDatePicker.date = fromDate
            setNeedsLayout()
        }
    }
    public var toDate: Date = Date() {
        didSet {
            daysHeaderView.toDate = toDate
            weekView.toDate = toDate
            toDatePicker.date = toDate
            setNeedsLayout()
        }
    }

    // Таймер за прерисуване (на линията за текущия час)
    private var redrawTimer: Timer?

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

        // Нав бар (ползваме го като контейнер)
        let navBar = UIView()
        navBar.backgroundColor = .secondarySystemBackground
        addSubview(navBar)
        navBar.frame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        navBar.autoresizingMask = [.flexibleWidth, .flexibleBottomMargin]

        // Настройки на datePicker-ите
        fromDatePicker.datePickerMode = .date
        fromDatePicker.preferredDatePickerStyle = .compact
        fromDatePicker.addTarget(self, action: #selector(didPickFromDate(_:)), for: .valueChanged)
        navBar.addSubview(fromDatePicker)

        toDatePicker.datePickerMode = .date
        toDatePicker.preferredDatePickerStyle = .compact
        toDatePicker.addTarget(self, action: #selector(didPickToDate(_:)), for: .valueChanged)
        navBar.addSubview(toDatePicker)

        // ъгълчето вляво под navbar
        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)

        // Days header
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        // Hours column
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        // Main scroll
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // Свързваме hoursColumnView
        weekView.hoursColumnView = hoursColumnView

        // Някои начални настройки
        daysHeaderView.leadingInsetForHours = leftColumnWidth
        weekView.leadingInsetForHours = leftColumnWidth
        hoursColumnView.topOffset = weekView.allDayHeight
    }

    @objc private func didPickFromDate(_ sender: UIDatePicker) {
        // Ако потребителят вдигне "fromDate", не допускаме даDate да е по-рано
        if sender.date > toDate {
            toDate = sender.date
        }
        fromDate = sender.date
        onRangeChange?(fromDate, toDate)
    }

    @objc private func didPickToDate(_ sender: UIDatePicker) {
        // Не допускаме toDate < fromDate
        if sender.date < fromDate {
            fromDate = sender.date
        }
        toDate = sender.date
        onRangeChange?(fromDate, toDate)
    }

    public override func layoutSubviews() {
        super.layoutSubviews()

        let navBarFrame = CGRect(x: 0, y: 0, width: bounds.width, height: navBarHeight)
        // Търсим първия subview (navigation bar)
        if let navBar = subviews.first {
            navBar.frame = navBarFrame
        }

        // Позиционираме picker-ите вътре в нав бара
        // (по желание може да ги наредите по друг начин)
        let pickerW: CGFloat = 160
        let marginX: CGFloat = 8
        fromDatePicker.frame = CGRect(x: marginX, y: 10, width: pickerW, height: 40)
        toDatePicker.frame = CGRect(x: marginX + pickerW + 16, y: 10, width: pickerW, height: 40)

        let yMain = navBarHeight
        cornerView.frame = CGRect(x: 0, y: yMain, width: leftColumnWidth, height: daysHeaderHeight)

        daysHeaderScrollView.frame = CGRect(x: leftColumnWidth, y: yMain,
                                            width: bounds.width - leftColumnWidth,
                                            height: daysHeaderHeight)

        // Изчисляваме колко дни е диапазонът
        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: fromDate)
        let toOnly = cal.startOfDay(for: toDate)
        let dayCount = (cal.dateComponents([.day], from: fromOnly, to: toOnly).day ?? 0) + 1

        let totalDaysHeaderWidth = daysHeaderView.leadingInsetForHours + CGFloat(dayCount)*daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(width: totalDaysHeaderWidth - leftColumnWidth,
                                                  height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0,
                                      width: totalDaysHeaderWidth,
                                      height: daysHeaderHeight)

        let mainScrollY = yMain + daysHeaderHeight
        mainScrollView.frame = CGRect(x: leftColumnWidth, y: mainScrollY,
                                      width: bounds.width - leftColumnWidth,
                                      height: bounds.height - mainScrollY)

        hoursColumnScrollView.frame = CGRect(x: 0, y: mainScrollY,
                                             width: leftColumnWidth,
                                             height: bounds.height - mainScrollY)

        // Ширина на timeline
        let totalWidth = weekView.leadingInsetForHours + CGFloat(dayCount)*weekView.dayColumnWidth
        // Височина: allDayHeight + 24 * hourHeight (може да се смени)
        let totalHeight = weekView.allDayHeight + 24*weekView.hourHeight

        mainScrollView.contentSize = CGSize(width: totalWidth, height: totalHeight)
        weekView.frame = CGRect(x: 0, y: 0, width: totalWidth, height: totalHeight)

        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: totalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0, width: leftColumnWidth, height: totalHeight)
        hoursColumnView.topOffset = weekView.allDayHeight

        bringSubviewToFront(hoursColumnScrollView)
        bringSubviewToFront(cornerView)

        // Маркираме в HoursColumnView дали текущият ден попада в диапазона
        let nowOnly = cal.startOfDay(for: Date())
        hoursColumnView.isCurrentDayInWeek = (nowOnly >= fromOnly && nowOnly <= toOnly)
        hoursColumnView.currentTime = hoursColumnView.isCurrentDayInWeek ? Date() : nil

        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }

    private func startRedrawTimer() {
        redrawTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            self.setNeedsLayout()
            self.layoutIfNeeded()
            self.weekView.setNeedsDisplay()
        }
    }
}
