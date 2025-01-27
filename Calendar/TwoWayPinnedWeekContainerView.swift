import UIKit
import CalendarKit

/// Контейнер, който държи бутони за смяна на седмица (<<< / >>>),
/// хедър с дни (DaysHeaderView), лява колонка с часове (HoursColumnView),
/// и основен 2D ScrollView (mainScrollView) + WeekTimelineViewNonOverlapping().
///
/// Целта е, ако днешният ден НЕ попада в startOfWeek..(startOfWeek+7 дни),
/// да не се показва червената/оранжевата линия и текущият час.
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

    // Основен 2D скрол за седмичния „canvas“
    private let mainScrollView = UIScrollView()
    public let weekView = WeekTimelineViewNonOverlapping()

    /// Callback, ако искаме да уведомяваме външния свят при смяна на седмица.
    public var onWeekChange: ((Date) -> Void)? = nil

    /// Начало на седмицата (понеделник 00:00)
    public var startOfWeek: Date = Date() {
        didSet {
            print("[DEBUG] Променяме startOfWeek на: \(startOfWeek)")
            daysHeaderView.startOfWeek = startOfWeek
            weekView.startOfWeek       = startOfWeek
            updateWeekLabel()
            
            // Принудително преизчисляване на layout
            setNeedsLayout()
            layoutIfNeeded()
        }
    }

    /// Таймер, който периодично преизчертава (за да мърда червената линия всяка минута например)
    private var redrawTimer: Timer?
    
    // MARK: - Инициализация
    public override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
        startRedrawTimer()  // ако искаме автоматично опресняване всяка минута
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
        startRedrawTimer()
    }

    deinit {
        // Спираме таймера при освобождаване на този view
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

        // Задаваме разни стойности на DaysHeader/WeekView
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

        // Горна лента (navBar)
        navBar.frame = CGRect(x: 0, y: 0,
                              width: bounds.width,
                              height: navBarHeight)

        let btnW: CGFloat = 44
        prevWeekButton.frame = CGRect(x: 8, y: 0,
                                      width: btnW, height: navBarHeight)
        nextWeekButton.frame = CGRect(x: navBar.bounds.width - btnW - 8,
                                      y: 0,
                                      width: btnW,
                                      height: navBarHeight)

        currentWeekLabel.frame = CGRect(x: prevWeekButton.frame.maxX,
                                        y: 0,
                                        width: nextWeekButton.frame.minX - prevWeekButton.frame.maxX,
                                        height: navBarHeight)

        // DaysHeader (върху scrollView)
        cornerView.frame = CGRect(x: 0,
                                  y: navBarHeight,
                                  width: leftColumnWidth,
                                  height: daysHeaderHeight)

        daysHeaderScrollView.frame = CGRect(x: leftColumnWidth,
                                            y: navBarHeight,
                                            width: bounds.width - leftColumnWidth,
                                            height: daysHeaderHeight)

        let totalDaysHeaderWidth = daysHeaderView.leadingInsetForHours + 7*daysHeaderView.dayColumnWidth
        daysHeaderScrollView.contentSize = CGSize(
            width: totalDaysHeaderWidth - leftColumnWidth,
            height: daysHeaderHeight
        )

        daysHeaderView.frame = CGRect(x: 0,
                                      y: 0,
                                      width: totalDaysHeaderWidth,
                                      height: daysHeaderHeight)

        // MainScroll + HoursColumn
        let yMain = navBarHeight + daysHeaderHeight
        mainScrollView.frame = CGRect(
            x: leftColumnWidth,
            y: yMain,
            width: bounds.width - leftColumnWidth,
            height: bounds.height - yMain
        )

        hoursColumnScrollView.frame = CGRect(
            x: 0,
            y: yMain,
            width: leftColumnWidth,
            height: bounds.height - yMain
        )

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

        // Винаги искаме HoursColumn да е над другите
        bringSubviewToFront(hoursColumnScrollView)
        bringSubviewToFront(cornerView)

        // --- Проверка дали днешната дата е в [startOfWeek .. +7 дни)
        let now = Date()
        let inWeek = (weekView.dayIndexIfInCurrentWeek(now) != nil)
        print("[DEBUG] inWeek = \(inWeek) за 'now' = \(now) (startOfWeek = \(startOfWeek))")

        // Ако НЕ сме в седмицата -> не рисуваме текущия час
        hoursColumnView.isCurrentDayInWeek = inWeek
        hoursColumnView.currentTime        = inWeek ? now : nil

        // Принудително преизчертаване, за да се махне / появи червената линия
        hoursColumnView.setNeedsDisplay()
        weekView.setNeedsDisplay()
    }

    public func scrollViewDidScroll(_ scrollView: UIScrollView) {
        if scrollView == mainScrollView {
            // Синхронизираме хедъра и лявата колона
            daysHeaderScrollView.contentOffset.x = scrollView.contentOffset.x
            hoursColumnScrollView.contentOffset.y = scrollView.contentOffset.y
        }
    }

    // MARK: - Бутоните < и >
    @objc private func didTapPrevWeek() {
        print("[DEBUG] Натиснат е бутонът < (Предишна седмица)")
        var cal = Calendar.current
        cal.firstWeekday = 2 // Понеделник

        if let newDate = cal.date(byAdding: .day, value: -7, to: startOfWeek) {
            let mondayMidnight = newDate.dateOnly(calendar: cal)
            startOfWeek = mondayMidnight
            onWeekChange?(mondayMidnight)
        }
    }

    @objc private func didTapNextWeek() {
        print("[DEBUG] Натиснат е бутонът > (Следваща седмица)")
        var cal = Calendar.current
        cal.firstWeekday = 2 // Понеделник

        if let newDate = cal.date(byAdding: .day, value: 7, to: startOfWeek) {
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

    // MARK: - Таймер за периодично преизчертаване (ако желаем да „мърда“ червената линия)
    private func startRedrawTimer() {
        // Пример: на всеки 60 секунди да се преизчертава
        redrawTimer = Timer.scheduledTimer(withTimeInterval: 60, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            print("[DEBUG] Преизчертаваме заради таймера (60s).")

            // Подбутваме layoutSubviews() -> опреснява червената линия
            self.setNeedsLayout()
            self.layoutIfNeeded()

            // И също преизчертаваме централната зона (weekView), за да се "мести" червената линия
            self.weekView.setNeedsDisplay()
        }
    }
}
