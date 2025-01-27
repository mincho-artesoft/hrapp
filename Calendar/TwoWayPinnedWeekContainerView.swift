import UIKit
import CalendarKit

/// Контейнер (UIKit) със:
///  - navBar + бутони < и > + надпис (диапазон на седмицата)
///  - горен DaysHeaderView (Mon, Tue...)
///  - лява HoursColumnView (часове)
///  - централна 2D scroll зона (WeekTimelineViewNonOverlapping)
///
/// При смяна на седмицата (< / >) вика callback `onWeekChange(newDate)`.
public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    private let navBarHeight: CGFloat = 40
    private let daysHeaderHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 70

    // Горна лента
    private let navBar = UIView()
    private let prevWeekButton = UIButton(type: .system)
    private let nextWeekButton = UIButton(type: .system)
    private let currentWeekLabel = UILabel()

    // Days Header
    private let cornerView = UIView()
    private let daysHeaderScrollView = UIScrollView()
    private let daysHeaderView = DaysHeaderView()

    // Лява колона (часове)
    private let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()

    // Основен 2D скрол
    private let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    /// Callback, вика се при натискане < или >.
    public var onWeekChange: ((Date) -> Void)? = nil

    /// Начална дата на седмицата (обикновено понеделник 00:00)
    public var startOfWeek: Date = Date() {
        didSet {
            daysHeaderView.startOfWeek = startOfWeek
            weekView.startOfWeek       = startOfWeek
            updateWeekLabel()

            setNeedsLayout()
            layoutIfNeeded()
        }
    }

    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
    }

    private func setupViews() {
        backgroundColor = .systemBackground

        // (1) NavBar
        navBar.backgroundColor = .secondarySystemBackground
        addSubview(navBar)

        prevWeekButton.setTitle("<", for: .normal)
        prevWeekButton.addTarget(self, action: #selector(didTapPrevWeek), for: .touchUpInside)
        navBar.addSubview(prevWeekButton)

        nextWeekButton.setTitle(">", for: .normal)
        nextWeekButton.addTarget(self, action: #selector(didTapNextWeek), for: .touchUpInside)
        navBar.addSubview(nextWeekButton)

        currentWeekLabel.font = .boldSystemFont(ofSize: 14)
        currentWeekLabel.textAlignment = .center
        navBar.addSubview(currentWeekLabel)

        // (2) DaysHeader
        cornerView.backgroundColor = .secondarySystemBackground
        addSubview(cornerView)
        daysHeaderScrollView.showsHorizontalScrollIndicator = false
        daysHeaderScrollView.isScrollEnabled = false
        daysHeaderScrollView.addSubview(daysHeaderView)
        addSubview(daysHeaderScrollView)

        // (3) HoursColumn
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        // (4) MainScrollView (2D)
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // (5) Настройки
        daysHeaderView.leadingInsetForHours = leftColumnWidth
        daysHeaderView.dayColumnWidth = 100

        weekView.leadingInsetForHours = leftColumnWidth
        weekView.dayColumnWidth = 100
        weekView.hourHeight = 50
        weekView.allDayHeight = 40
        weekView.autoResizeAllDayHeight = true

        hoursColumnView.hourHeight = 50
    }

    public override func layoutSubviews() {
        super.layoutSubviews()

        // --- НавБар
        navBar.frame = CGRect(x: 0, y: 0,
                              width: bounds.width,
                              height: navBarHeight)

        let btnW: CGFloat = 44
        prevWeekButton.frame = CGRect(x: 8, y: 0,
                                      width: btnW, height: navBarHeight)
        nextWeekButton.frame = CGRect(x: navBar.bounds.width - btnW - 8,
                                      y: 0,
                                      width: btnW, height: navBarHeight)
        currentWeekLabel.frame = CGRect(x: prevWeekButton.frame.maxX,
                                        y: 0,
                                        width: nextWeekButton.frame.minX - prevWeekButton.frame.maxX,
                                        height: navBarHeight)

        // --- Header (Mon, Tue...)
        cornerView.frame = CGRect(x: 0, y: navBarHeight,
                                  width: leftColumnWidth,
                                  height: daysHeaderHeight)
        daysHeaderScrollView.frame = CGRect(x: leftColumnWidth, y: navBarHeight,
                                            width: bounds.width - leftColumnWidth,
                                            height: daysHeaderHeight)
        let totalDaysHeaderWidth = daysHeaderView.leadingInsetForHours + 7*daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(width: totalDaysHeaderWidth - leftColumnWidth,
                                                  height: daysHeaderHeight)
        daysHeaderView.frame = CGRect(x: 0, y: 0,
                                      width: totalDaysHeaderWidth,
                                      height: daysHeaderHeight)

        // --- MainScroll + HoursColumn
        let yMain = navBarHeight + daysHeaderHeight
        mainScrollView.frame = CGRect(x: leftColumnWidth, y: yMain,
                                      width: bounds.width - leftColumnWidth,
                                      height: bounds.height - yMain)
        hoursColumnScrollView.frame = CGRect(x: 0, y: yMain,
                                             width: leftColumnWidth,
                                             height: bounds.height - yMain)

        let totalWidth = weekView.leadingInsetForHours + 7*weekView.dayColumnWidth
        let totalHeight = weekView.allDayHeight + 24*weekView.hourHeight

        mainScrollView.contentSize = CGSize(width: totalWidth, height: totalHeight)
        weekView.frame = CGRect(x: 0, y: 0,
                                width: totalWidth,
                                height: totalHeight)

        hoursColumnScrollView.contentSize = CGSize(width: leftColumnWidth, height: totalHeight)
        hoursColumnView.frame = CGRect(x: 0, y: 0,
                                       width: leftColumnWidth,
                                       height: totalHeight)
        hoursColumnView.topOffset = weekView.allDayHeight

        bringSubviewToFront(hoursColumnScrollView)
        bringSubviewToFront(cornerView)

        // --- Ако `Date()` е в [startOfWeek..+7), показваме червеното време
        let now = Date()
        let inWeek = (dayIndexIfInCurrentWeek(now) != nil)
        hoursColumnView.isCurrentDayInWeek = inWeek
        hoursColumnView.currentTime = inWeek ? now : nil
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }

    @objc private func didTapPrevWeek() {
        guard let newDate = Calendar.current.date(byAdding: .day, value: -7, to: startOfWeek) else { return }
        startOfWeek = newDate
        onWeekChange?(newDate)
    }

    @objc private func didTapNextWeek() {
        guard let newDate = Calendar.current.date(byAdding: .day, value: 7, to: startOfWeek) else { return }
        startOfWeek = newDate
        onWeekChange?(newDate)
    }

    private func updateWeekLabel() {
        let cal = Calendar.current
        let endOfWeek = cal.date(byAdding: .day, value: 6, to: startOfWeek) ?? startOfWeek
        let df = DateFormatter()
        df.dateFormat = "d MMM"

        let startStr = df.string(from: startOfWeek)
        let endStr   = df.string(from: endOfWeek)
        currentWeekLabel.text = "\(startStr) - \(endStr)"
    }

    /// Проверка дали `date` попада в `[startOfWeek ..< startOfWeek+7 дни)`.
    private func dayIndexIfInCurrentWeek(_ date: Date) -> Int? {
        let cal = Calendar.current
        let startOnly = startOfWeek.dateOnly(calendar: cal)
        let endOfWeek = cal.date(byAdding: .day, value: 7, to: startOnly)!
        if date >= startOnly && date < endOfWeek {
            let comps = cal.dateComponents([.day], from: startOnly, to: date)
            let d = comps.day ?? 0
            return d
        } else {
            return nil
        }
    }
}
