import UIKit

// MARK: - Протокол (за връщане на резултата)
public protocol CalendarDateRangePickerViewControllerDelegate {
    func didCancelPickingDateRange()
    func didPickDateRange(startDate: Date!, endDate: Date!)
}

// MARK: - Основен VC (UIViewController)
public class CalendarDateRangePickerViewController: UIViewController {

    // == UI ==
    private var collectionView: UICollectionView!
    private var monthYearPickerView = MonthYearPickerView()
    
    // Navigation Bar: надпис + стрелка
    private var monthLabel = UILabel()
    private var arrowImageView = UIImageView()
    private var arrowIsDown = false  // следи дали стрелката е "завъртяна"

    // == Параметри/настройки ==
    public var delegate: CalendarDateRangePickerViewControllerDelegate?

    // Месецът, който в момента се показва
    public var currentMonth: Date = Date()

    public var minimumDate: Date?
    public var maximumDate: Date?

    public var selectedStartDate: Date?
    public var selectedEndDate: Date?

    public var selectedColor = UIColor(
        red: 66/255.0,
        green: 150/255.0,
        blue: 240/255.0,
        alpha: 1.0
    )

    // Layout за UICollectionView
    private let itemsPerRow = 7
    private let itemHeight: CGFloat = 40
    private let collectionViewInsets = UIEdgeInsets(top: 0, left: 25, bottom: 0, right: 25)

    private var isPickerVisible = false

    // MARK: - viewDidLoad
    public override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .white

        // -----------------------------
        // 1) Създаваме collectionView
        // -----------------------------
        let layout = UICollectionViewFlowLayout()
        layout.minimumLineSpacing = 5
        layout.minimumInteritemSpacing = 0

        collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        collectionView.backgroundColor = .white
        collectionView.dataSource = self
        collectionView.delegate = self

        // Регистрираме custom клетката
        collectionView.register(
            CalendarDateRangePickerCell.self,
            forCellWithReuseIdentifier: "CalendarDateRangePickerCell"
        )

        // Добавяме като subview
        view.addSubview(collectionView)
        collectionView.translatesAutoresizingMaskIntoConstraints = false

        // -----------------------------
        // 2) MonthYearPickerView (скрит)
        // -----------------------------
        monthYearPickerView.translatesAutoresizingMaskIntoConstraints = false
        monthYearPickerView.isHidden = true  // по начало е скрит
        view.addSubview(monthYearPickerView)
        
        // 2а) Когато се смени месец или година в monthYearPickerView,
        //     да се обновява currentMonth и да се релоудва колекцията:
        monthYearPickerView.onDateChanged = { [weak self] (newMonth, newYear) in
            guard let self = self else { return }
            
            var comps = DateComponents()
            comps.day = 1
            comps.month = newMonth
            comps.year = newYear
            
            if let newDate = Calendar.current.date(from: comps) {
                self.currentMonth = newDate
                self.monthLabel.text = self.getMonthLabel(date: newDate)
                self.monthLabel.sizeToFit()
                
                self.collectionView.reloadData()
            }
        }

        // -----------------------------
        // 3) Auto Layout
        // -----------------------------
        NSLayoutConstraint.activate([
            // Колекцията да заема целия екран
            collectionView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            collectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            collectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            collectionView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            // MonthYearPickerView да е по средата
            monthYearPickerView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            monthYearPickerView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            monthYearPickerView.widthAnchor.constraint(equalToConstant: 300),
            monthYearPickerView.heightAnchor.constraint(equalToConstant: 200),
        ])

        // -----------------------------
        // 4) Минимална / максимална дата
        // -----------------------------
        let today = Date()
        if minimumDate == nil {
            minimumDate = Calendar.current.date(byAdding: .year, value: -5, to: today)
        }
        if maximumDate == nil {
            maximumDate = Calendar.current.date(byAdding: .year, value: 3, to: today)
        }

        // Ако имаме избран startDate, почваме от него, иначе от днешна
        if let start = selectedStartDate {
            currentMonth = makeFirstDayOfMonth(from: start)
        } else {
            currentMonth = makeFirstDayOfMonth(from: today)
        }

        // -----------------------------
        // 5) Navigation Bar: monthLabel + стрелка (chevron)
        // -----------------------------
        monthLabel.text = getMonthLabel(date: currentMonth)
        monthLabel.textColor = .label
        monthLabel.sizeToFit()

        arrowImageView.image = UIImage(systemName: "chevron.right")
        arrowImageView.tintColor = .systemBlue
        arrowImageView.contentMode = .scaleAspectFit

        let containerStack = UIStackView(arrangedSubviews: [monthLabel, arrowImageView])
        containerStack.axis = .horizontal
        containerStack.spacing = 4

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(monthLabelTapped))
        containerStack.isUserInteractionEnabled = true
        containerStack.addGestureRecognizer(tapGesture)

        let labelItem = UIBarButtonItem(customView: containerStack)
        navigationItem.leftBarButtonItem = labelItem

        // -----------------------------
        // 6) Бутоните "<" и ">" за месец
        // -----------------------------
        let prevMonthButton = UIBarButtonItem(
            title: "<",
            style: .plain,
            target: self,
            action: #selector(didTapPrevMonth)
        )
        let nextMonthButton = UIBarButtonItem(
            title: ">",
            style: .plain,
            target: self,
            action: #selector(didTapNextMonth)
        )
        navigationItem.rightBarButtonItems = [nextMonthButton, prevMonthButton]
    }

    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        collectionView.reloadData()
    }

    // MARK: - При тап върху monthLabel => показваме/скриваме picker-а
    @objc func monthLabelTapped() {
        arrowIsDown.toggle()
        let rotationAngle: CGFloat = arrowIsDown ? .pi / 2 : 0

        UIView.animate(withDuration: 0.25) {
            self.arrowImageView.transform = CGAffineTransform(rotationAngle: rotationAngle)
            self.monthLabel.textColor = self.arrowIsDown ? .systemBlue : .label
        }

        // Показваме или скриваме picker-а
        isPickerVisible.toggle()
        monthYearPickerView.isHidden = !isPickerVisible

        // Ако picker става видим, позиционираме го на currentMonth
        if isPickerVisible {
            let comps = Calendar.current.dateComponents([.month, .year], from: currentMonth)
            let curMonth = comps.month ?? 1
            let curYear = comps.year ?? 2025
            // Позиционираме picker-а
            monthYearPickerView.select(month: curMonth, year: curYear)
            
            // Скриваме колекцията
            collectionView.isHidden = true
        } else {
            // Скриваме picker-а, показваме колекцията
            collectionView.isHidden = false
        }
    }

    // Бутон < (предишен месец)
    @objc func didTapPrevMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: -1, to: currentMonth) {
            if let minD = minimumDate, newMonth < makeFirstDayOfMonth(from: minD) {
                return
            }
            currentMonth = newMonth
            monthLabel.text = getMonthLabel(date: currentMonth)
            monthLabel.sizeToFit()
            collectionView.reloadData()
        }
    }

    // Бутон > (следващ месец)
    @objc func didTapNextMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: 1, to: currentMonth) {
            if let maxD = maximumDate, newMonth > makeFirstDayOfMonth(from: maxD) {
                return
            }
            currentMonth = newMonth
            monthLabel.text = getMonthLabel(date: currentMonth)
            monthLabel.sizeToFit()
            collectionView.reloadData()
        }
    }
}

// MARK: - UICollectionViewDataSource, UICollectionViewDelegateFlowLayout
extension CalendarDateRangePickerViewController: UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {

    public func collectionView(_ collectionView: UICollectionView,
                               numberOfItemsInSection section: Int) -> Int {
        // 7 клетки за дните (Mon..Sun) + празни + реални дни
        let weekdayRowItems = 7
        let blankItems = getWeekday(date: currentMonth) - 1
        let daysInMonth = getNumberOfDaysInMonth(date: currentMonth)

        return weekdayRowItems + blankItems + daysInMonth
    }

    public func collectionView(_ collectionView: UICollectionView,
                               cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {

        let cell = collectionView.dequeueReusableCell(
            withReuseIdentifier: "CalendarDateRangePickerCell",
            for: indexPath
        ) as! CalendarDateRangePickerCell

        cell.selectedColor = self.selectedColor
        cell.reset()

        // Първите 7 -> "Mon", "Tue", "Wed", ...
        if indexPath.item < 7 {
            cell.label.text = getWeekdayLabel(weekday: indexPath.item + 1)
            return cell
        }

        // Празни слотове
        let blankItems = getWeekday(date: currentMonth) - 1
        if indexPath.item < 7 + blankItems {
            cell.label.text = ""
            return cell
        }

        // Реален ден
        let dayOfMonth = indexPath.item - (7 + blankItems) + 1
        let date = getDate(dayOfMonth: dayOfMonth, baseMonth: currentMonth)
        cell.date = date
        cell.label.text = "\(dayOfMonth)"

        // Оцветяване (startDate/endDate)
        if let start = selectedStartDate, let end = selectedEndDate {
            if areSameDay(dateA: start, dateB: end) {
                // Един и същи ден
                if areSameDay(dateA: date, dateB: start) {
                    cell.select()
                } else if areSameDay(dateA: date, dateB: Date()) {
                    cell.label.textColor = .orange
                }
            } else {
                // start < end
                if isBefore(dateA: start, dateB: date) &&
                   isBefore(dateA: date, dateB: end) {
                    cell.highlight()
                } else if areSameDay(dateA: date, dateB: start) {
                    cell.select()
                } else if areSameDay(dateA: date, dateB: end) {
                    cell.select()
                } else if areSameDay(dateA: date, dateB: Date()) {
                    cell.label.textColor = .orange
                }
            }
        }
        else if let start = selectedStartDate {
            // Само start
            if areSameDay(dateA: date, dateB: start) {
                cell.select()
            } else if areSameDay(dateA: date, dateB: Date()) {
                cell.label.textColor = .orange
            }
        }
        else {
            // Нямаме дати
            if areSameDay(dateA: date, dateB: Date()) {
                cell.label.textColor = .orange
            }
        }

        return cell
    }

    public func collectionView(_ collectionView: UICollectionView,
                               didSelectItemAt indexPath: IndexPath) {
        
        guard let cell = collectionView.cellForItem(at: indexPath) as? CalendarDateRangePickerCell,
              let cellDate = cell.date else {
            return
        }

        if selectedStartDate == nil {
            selectedStartDate = cellDate
        }
        else if selectedEndDate == nil {
            // Ако е в бъдещето спрямо startDate, слагаме за endDate;
            // иначе просто заменяме startDate
            if let start = selectedStartDate, isBefore(dateA: start, dateB: cellDate) {
                selectedEndDate = cellDate
            } else {
                selectedStartDate = cellDate
            }
            // Имаме start+end => делегат
            if let s = selectedStartDate, let e = selectedEndDate {
                delegate?.didPickDateRange(startDate: s, endDate: e)
            }
        }
        else {
            // Трето кликване => започваме нов диапазон
            selectedStartDate = cellDate
            selectedEndDate = nil
        }

        collectionView.reloadData()
    }

    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               sizeForItemAt indexPath: IndexPath) -> CGSize {

        let width = collectionView.bounds.width
        let padding = collectionViewInsets.left + collectionViewInsets.right
        let availableWidth = width - padding
        let itemWidth = availableWidth / CGFloat(itemsPerRow)
        return CGSize(width: itemWidth, height: itemHeight)
    }
}

// MARK: - Помощни функции
extension CalendarDateRangePickerViewController {

    func makeFirstDayOfMonth(from date: Date) -> Date {
        var comps = Calendar.current.dateComponents([.year, .month], from: date)
        comps.day = 1
        return Calendar.current.date(from: comps)!
    }

    func getMonthLabel(date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy" // "March 2025"
        return formatter.string(from: date)
    }

    func getWeekdayLabel(weekday: Int) -> String {
        // weekday: 1=Sunday, 2=Monday, ...
        var comps = DateComponents()
        comps.calendar = Calendar.current
        comps.weekday = weekday

        guard let date = Calendar.current.nextDate(
            after: Date(),
            matching: comps,
            matchingPolicy: .strict
        ) else {
            return "?"
        }

        let formatter = DateFormatter()
        formatter.dateFormat = "EEEEE" // 1 буква, напр. "M", "T" и т.н.
        return formatter.string(from: date)
    }

    func getWeekday(date: Date) -> Int {
        return Calendar.current.component(.weekday, from: date)
    }

    func getNumberOfDaysInMonth(date: Date) -> Int {
        return Calendar.current.range(of: .day, in: .month, for: date)!.count
    }

    func getDate(dayOfMonth: Int, baseMonth: Date) -> Date {
        var comps = Calendar.current.dateComponents([.month, .year], from: baseMonth)
        comps.day = dayOfMonth
        return Calendar.current.date(from: comps)!
    }

    func areSameDay(dateA: Date, dateB: Date) -> Bool {
        return Calendar.current.compare(dateA, to: dateB, toGranularity: .day) == .orderedSame
    }

    func isBefore(dateA: Date, dateB: Date) -> Bool {
        return Calendar.current.compare(dateA, to: dateB, toGranularity: .day) == .orderedAscending
    }
}
