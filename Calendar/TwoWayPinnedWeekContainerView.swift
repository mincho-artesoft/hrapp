import UIKit
import CalendarKit

public final class TwoWayPinnedWeekContainerView: UIView, UIScrollViewDelegate {

    // Размери
    private let navBarHeight: CGFloat = 40
    private let daysHeaderHeight: CGFloat = 40
    private let leftColumnWidth: CGFloat = 70

    // Горна "navbar"
    private let navBar = UIView()
    private let prevWeekButton = UIButton(type: .system)
    private let nextWeekButton = UIButton(type: .system)
    private let currentWeekLabel = UILabel()

    // Days Header (Mon, Tue...)
    private let cornerView = UIView()
    private let daysHeaderScrollView = UIScrollView()
    private let daysHeaderView = DaysHeaderView()

    // Лява колона за часове
    private let hoursColumnScrollView = UIScrollView()
    public let hoursColumnView = HoursColumnView()

    // Основен 2D scroll за седмичния „canvas“
    private let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    /// Callback, ако искате да „известите“ SwiftUI или нещо друго при смяна на седмицата.
    public var onWeekChange: ((Date) -> Void)? = nil

    /// Начало на седмицата (понеделник 00:00)
    public var startOfWeek: Date = Date() {
        didSet {
            daysHeaderView.startOfWeek = startOfWeek
            weekView.startOfWeek       = startOfWeek
            updateWeekLabel()

            setNeedsLayout()
            layoutIfNeeded()
        }
    }

    /// Таймер за периодично преизчертаване
    private var redrawTimer: Timer?

    // MARK: - Инициализация
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
        startRedrawTimer()  // по избор: таймер, който опреснява червената линия всяка минута
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
        startRedrawTimer()
    }

    deinit {
        // Ако се освободи този view, да не остане Timer активен
        redrawTimer?.invalidate()
        redrawTimer = nil
    }

    private func setupViews() {
        backgroundColor = .systemBackground

        // (1) НавБар
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

        // (3) Лява колона (часове)
        hoursColumnScrollView.showsVerticalScrollIndicator = false
        hoursColumnScrollView.isScrollEnabled = false
        hoursColumnScrollView.addSubview(hoursColumnView)
        addSubview(hoursColumnScrollView)

        // (4) Основен 2D скрол
        mainScrollView.delegate = self
        mainScrollView.showsHorizontalScrollIndicator = true
        mainScrollView.showsVerticalScrollIndicator = true
        mainScrollView.addSubview(weekView)
        addSubview(mainScrollView)

        // Настройки за ширини/височини
        daysHeaderView.leadingInsetForHours = leftColumnWidth
        daysHeaderView.dayColumnWidth = 100

        weekView.leadingInsetForHours = leftColumnWidth
        weekView.dayColumnWidth = 100
        weekView.hourHeight = 50
        weekView.allDayHeight = 40
        weekView.autoResizeAllDayHeight = true

        hoursColumnView.hourHeight = 50
    }

    // MARK: - Layout
    public override func layoutSubviews() {
        super.layoutSubviews()

        // Горна лента
        navBar.frame = CGRect(x: 0, y: 0,
                              width: bounds.width,
                              height: navBarHeight)
        let btnW: CGFloat = 44
        prevWeekButton.frame = CGRect(x: 8, y: 0,
                                      width: btnW, height: navBarHeight)
        nextWeekButton.frame = CGRect(x: navBar.bounds.width - btnW - 8,
                                      y: 0, width: btnW, height: navBarHeight)
        currentWeekLabel.frame = CGRect(x: prevWeekButton.frame.maxX,
                                        y: 0,
                                        width: nextWeekButton.frame.minX - prevWeekButton.frame.maxX,
                                        height: navBarHeight)

        // DaysHeader
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

        // MainScroll + HoursColumn
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

        // --- Проверка дали текущата дата е в [startOfWeek.. +7 дни)
        let now = Date()
        let inWeek = (weekView.dayIndexIfInCurrentWeek(now) != nil)

        // Ако не е в седмицата, не показваме червената линия (hoursColumnView)
        hoursColumnView.isCurrentDayInWeek = inWeek
        hoursColumnView.currentTime = inWeek ? now : nil
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }

    // MARK: - Бутоните < и >
    @objc private func didTapPrevWeek() {
        var cal = Calendar.current
        cal.firstWeekday = 2 // Понеделник
        if let newDate = cal.date(byAdding: .day, value: -7, to: startOfWeek) {
            // Изрязваме до 00:00
            let mondayMidnight = newDate.dateOnly(calendar: cal)
            startOfWeek = mondayMidnight
            onWeekChange?(mondayMidnight)
        }
    }

    @objc private func didTapNextWeek() {
        var cal = Calendar.current
        cal.firstWeekday = 2 // Понеделник
        if let newDate = cal.date(byAdding: .day, value: 7, to: startOfWeek) {
            // Изрязваме до 00:00
            let mondayMidnight = newDate.dateOnly(calendar: cal)
            startOfWeek = mondayMidnight
            onWeekChange?(mondayMidnight)
        }
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

    // MARK: - Таймер за преизчертаване (по избор)
    private func startRedrawTimer() {
        // Пример: на всеки 60 секунди
        redrawTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            // Подбутваме layoutSubviews() -> опреснява червената линия
            self.setNeedsLayout()
            self.layoutIfNeeded()

            // И също преизчертаваме централната зона, за да се "мести" линията
            self.weekView.setNeedsDisplay()
        }
    }
}
