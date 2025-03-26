import UIKit

// =====================================================================
// MARK: - ViewController с календар (UICollectionView)
// =====================================================================
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

    public var currentMonth: Date = Date()
    public var minimumDate: Date?
    public var maximumDate: Date?
    public var selectedStartDate: Date?
    public var selectedEndDate: Date?

    // Тук може да изберете цвета на „кръга“:
    public var selectedColor = UIColor(
        red: 66/255.0,
        green: 150/255.0,
        blue: 240/255.0,
        alpha: 1.0
    )

    // Layout за UICollectionView
    private let itemsPerRow = 7
    private let itemHeight: CGFloat = 40
    
    // Премахваме отстояния
    private let collectionViewInsets = UIEdgeInsets.zero

    private var isPickerVisible = false

    // MARK: - viewDidLoad
    public override func viewDidLoad() {
        super.viewDidLoad()

        // 1) Правим полупрозрачен фон, за да „прозира“ съдържанието отдолу
        view.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.8)
        
        // (По избор) Закръгляме ъглите:
        view.layer.cornerRadius = 12
        view.layer.masksToBounds = true

        // 2) UICollectionView + Layout
        let layout = UICollectionViewFlowLayout()
        layout.minimumLineSpacing = 0
        layout.minimumInteritemSpacing = 0

        collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        // Важно: ако колекцията е .systemBackground, ще покрие прозрачността
        // => правим я .clear
        collectionView.backgroundColor = .clear
        collectionView.dataSource = self
        collectionView.delegate = self

        // Регистрираме custom клетката
        collectionView.register(
            CalendarDateRangePickerCell.self,
            forCellWithReuseIdentifier: "CalendarDateRangePickerCell"
        )

        view.addSubview(collectionView)
        collectionView.translatesAutoresizingMaskIntoConstraints = false

        // 3) MonthYearPickerView
        monthYearPickerView.translatesAutoresizingMaskIntoConstraints = false
        monthYearPickerView.isHidden = true
        view.addSubview(monthYearPickerView)
        
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

        // 4) Auto Layout
        NSLayoutConstraint.activate([
            collectionView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            collectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            collectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            collectionView.bottomAnchor.constraint(equalTo: view.bottomAnchor),

            monthYearPickerView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            monthYearPickerView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            monthYearPickerView.widthAnchor.constraint(equalToConstant: 300),
            monthYearPickerView.heightAnchor.constraint(equalToConstant: 200),
        ])

        // 5) min/max date (по желание)
        let today = Date()
        if minimumDate == nil {
            minimumDate = Calendar.current.date(byAdding: .year, value: -5, to: today)
        }
        if maximumDate == nil {
            maximumDate = Calendar.current.date(byAdding: .year, value: 3, to: today)
        }

        // startMonth
        if let start = selectedStartDate {
            currentMonth = makeFirstDayOfMonth(from: start)
        } else {
            currentMonth = makeFirstDayOfMonth(from: today)
        }

        // 6) Navbar: monthLabel + стрелка (chevron)
        monthLabel.text = getMonthLabel(date: currentMonth)
        monthLabel.font = UIFont.boldSystemFont(ofSize: 17)
        monthLabel.textColor = .label
        monthLabel.sizeToFit()

        arrowImageView.image = UIImage(systemName: "chevron.right")
        arrowImageView.tintColor = .systemBlue
        arrowImageView.contentMode = .scaleAspectFit

        // Създаваме stackView за левия бутон
        let leftStack = UIStackView(arrangedSubviews: [monthLabel, arrowImageView])
        leftStack.axis = .horizontal
        leftStack.spacing = 4

        // Задаваме layoutMargins => това „бутва“ съдържанието навътре
        leftStack.layoutMargins = UIEdgeInsets(top: 0, left: 8, bottom: 0, right: 8)
        leftStack.isLayoutMarginsRelativeArrangement = true

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(monthLabelTapped))
        leftStack.isUserInteractionEnabled = true
        leftStack.addGestureRecognizer(tapGesture)

        // Правим го customView на UIBarButtonItem
        let labelItem = UIBarButtonItem(customView: leftStack)
        navigationItem.leftBarButtonItem = labelItem

        // 7) Бутоните chevron.left и chevron.right
        let prevMonthButton = UIButton(type: .system)
        prevMonthButton.setImage(UIImage(systemName: "chevron.left"), for: .normal)
        prevMonthButton.addTarget(self, action: #selector(didTapPrevMonth), for: .touchUpInside)

        let nextMonthButton = UIButton(type: .system)
        nextMonthButton.setImage(UIImage(systemName: "chevron.right"), for: .normal)
        nextMonthButton.addTarget(self, action: #selector(didTapNextMonth), for: .touchUpInside)

        // Слагаме двата бутона в един stack
        let rightStack = UIStackView(arrangedSubviews: [prevMonthButton, nextMonthButton])
        rightStack.axis = .horizontal
        rightStack.spacing = 16

        // Също им даваме "отстояния" навътре
        rightStack.layoutMargins = UIEdgeInsets(top: 0, left: 8, bottom: 0, right: 8)
        rightStack.isLayoutMarginsRelativeArrangement = true

        let rightBarButtonItem = UIBarButtonItem(customView: rightStack)
        navigationItem.rightBarButtonItem = rightBarButtonItem


        // 8) Добавяме Pan Gesture, за да поддържаме drag-selection
        let panGesture = UIPanGestureRecognizer(target: self, action: #selector(handlePanGesture(_:)))
        collectionView.addGestureRecognizer(panGesture)
    }

    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        collectionView.reloadData()
    }

    // MARK: - monthLabelTapped
    @objc func monthLabelTapped() {
        arrowIsDown.toggle()
        let rotationAngle: CGFloat = arrowIsDown ? .pi / 2 : 0

        // Завъртане и промяна на цвета на надписа
        UIView.animate(withDuration: 0.25) {
            self.arrowImageView.transform = CGAffineTransform(rotationAngle: rotationAngle)
            self.monthLabel.textColor = self.arrowIsDown ? .systemBlue : .label
        }

        // Показване/скриване на picker-a с анимация
        isPickerVisible.toggle()

        if isPickerVisible {
            // Подготвяме picker-a за анимация (скрит, умален)
            monthYearPickerView.alpha = 0
            monthYearPickerView.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
            monthYearPickerView.isHidden = false
            self.collectionView.isHidden = true
            // Анимираме "показването"
            UIView.animate(withDuration: 0.25,
                           animations: {
                self.monthYearPickerView.alpha = 1
                self.monthYearPickerView.transform = .identity
            }, completion: { _ in
                // Селектираме текущия месец/година
                let comps = Calendar.current.dateComponents([.month, .year], from: self.currentMonth)
                let curMonth = comps.month ?? 1
                let curYear = comps.year ?? 2025
                self.monthYearPickerView.select(month: curMonth, year: curYear)

                // Скриваме колекцията, докато е отворен picker-ът
            })
        } else {
            // Анимираме "скриването"
            UIView.animate(withDuration: 0.25,
                           animations: {
                self.monthYearPickerView.alpha = 0
                self.monthYearPickerView.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
            }, completion: { _ in
                self.monthYearPickerView.isHidden = true

                // Връщаме колекцията след затваряне на picker-а
                self.collectionView.isHidden = false
            })
        }
    }


    // MARK: - didTapPrevMonth
    @objc func didTapPrevMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: -1, to: currentMonth) {
            currentMonth = newMonth
            monthLabel.text = getMonthLabel(date: currentMonth)
            monthLabel.sizeToFit()
            collectionView.reloadData()
        }
    }

    // MARK: - didTapNextMonth
    @objc func didTapNextMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: 1, to: currentMonth) {
            currentMonth = newMonth
            monthLabel.text = getMonthLabel(date: currentMonth)
            monthLabel.sizeToFit()
            collectionView.reloadData()
        }
    }
}

// =====================================================================
// MARK: - UICollectionViewDataSource, UICollectionViewDelegateFlowLayout
// =====================================================================
extension CalendarDateRangePickerViewController: UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {

    public func collectionView(_ collectionView: UICollectionView,
                               numberOfItemsInSection section: Int) -> Int {
        // Първите 7 слота са за етикети на дните от седмицата
        let weekdayRowItems = 7
        // Колко "празни" слота има преди 1-во число
        let blankItems = getWeekday(date: currentMonth) - 1
        // Колко дни има текущият месец
        let daysInMonth = getNumberOfDaysInMonth(date: currentMonth)
        return weekdayRowItems + blankItems + daysInMonth
    }

    public func collectionView(_ collectionView: UICollectionView,
                               cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let cell = collectionView.dequeueReusableCell(
            withReuseIdentifier: "CalendarDateRangePickerCell",
            for: indexPath
        ) as! CalendarDateRangePickerCell
        
        // Нулираме клетката (премахва стари линии/кръгове)
        cell.reset()
        // За всеки случай първоначално задаваме избрания цвят
        cell.selectedColor = self.selectedColor

        // Първите 7 клетки са за дните от седмицата (Пон, Вто, ...)
        if indexPath.item < 7 {
            cell.label.text = getWeekdayLabel(weekday: indexPath.item + 1)
            cell.label.textColor = .secondaryLabel
            return cell
        }

        // Колко празни слотове има преди да започне 1-вият ден от месеца
        let blankItems = getWeekday(date: currentMonth) - 1
        if indexPath.item < 7 + blankItems {
            // Празна клетка
            cell.label.text = ""
            return cell
        }

        // Изчисляваме кой "ден от месеца" съответства на тази клетка
        let dayOfMonth = indexPath.item - (7 + blankItems) + 1
        let date = getDate(dayOfMonth: dayOfMonth, baseMonth: currentMonth)
        cell.date = date
        cell.label.text = "\(dayOfMonth)"

        // Проверка дали е „днес“
        let today = Date()
        let isToday = areSameDay(dateA: date, dateB: today)

        // === Логика за селекция (start/end) ===
        if let start = selectedStartDate, let end = selectedEndDate {
            
            // Ако start и end съвпадат => само един ден е избран
            if areSameDay(dateA: start, dateB: end) {
                if areSameDay(dateA: date, dateB: start) {
                    // Ако е "днес" + start/end => кръгчето става .systemRed
                    cell.selectedColor = isToday ? .systemRed : self.selectedColor
                    cell.addCircle()
                }
            } else {
                // Нормален случай: start < end
                if areSameDay(dateA: date, dateB: start) {
                    cell.selectedColor = isToday ? .systemRed : self.selectedColor
                    // Линия вдясно + кръг
                    cell.addLine(from: cell.bounds.width / 2, to: cell.bounds.width)
                    cell.addCircle()

                } else if areSameDay(dateA: date, dateB: end) {
                    cell.selectedColor = isToday ? .systemRed : self.selectedColor
                    // Линия вляво + кръг
                    cell.addLine(from: 0, to: cell.bounds.width / 2)
                    cell.addCircle()

                } else if isBefore(dateA: start, dateB: date),
                          isBefore(dateA: date, dateB: end) {
                    // Денят е между start и end => чертаем само линия
                    cell.addLine(from: 0, to: cell.bounds.width)
                }
            }
        }
        else if let justStart = selectedStartDate {
            // Имаме само start, но още не е избран end
            if areSameDay(dateA: date, dateB: justStart) {
                cell.selectedColor = isToday ? .systemRed : self.selectedColor
                cell.addCircle()
            }
        }

        // Ако денят е „днес“, но НЯМА кръг (circleView),
        // маркираме текста в оранжево (както досега).
        if isToday && cell.circleView == nil {
            cell.label.textColor = .systemOrange
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
            // Първи клик => начална дата
            selectedStartDate = cellDate
        }
        else if selectedEndDate == nil {
            // Втори клик => крайна дата
            if let start = selectedStartDate, isBefore(dateA: start, dateB: cellDate) {
                selectedEndDate = cellDate
            } else {
                selectedStartDate = cellDate
            }
            // Извикваме делегата
            if let s = selectedStartDate, let e = selectedEndDate {
                delegate?.didPickDateRange(startDate: s, endDate: e)
            }
        }
        else {
            // Трети клик => рестартираме (нова startDate)
            selectedStartDate = cellDate
            selectedEndDate = nil
        }

        collectionView.reloadData()
    }

    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               sizeForItemAt indexPath: IndexPath) -> CGSize {
        
        let w = collectionView.bounds.width
        let itemWidth = w / CGFloat(itemsPerRow)
        return CGSize(width: itemWidth, height: itemHeight)
    }
}

// =====================================================================
// MARK: - Pan Gesture (Drag) селекция
// =====================================================================
extension CalendarDateRangePickerViewController {
    @objc private func handlePanGesture(_ gesture: UIPanGestureRecognizer) {
        let location = gesture.location(in: collectionView)

        guard let indexPath = collectionView.indexPathForItem(at: location),
              let cell = collectionView.cellForItem(at: indexPath) as? CalendarDateRangePickerCell,
              let cellDate = cell.date else {
            return
        }
        
        // Ако не искате да се влачи върху първия ред (етикети на дни):
        if indexPath.item < 7 {
            return
        }
        
        switch gesture.state {
        case .began:
            selectedStartDate = cellDate
            selectedEndDate = nil
            collectionView.reloadData()
            
        case .changed:
            if let start = selectedStartDate {
                if isBefore(dateA: start, dateB: cellDate) {
                    selectedEndDate = cellDate
                } else {
                    selectedStartDate = cellDate
                }
                collectionView.reloadData()
            }
            
        case .ended, .cancelled, .failed:
            if let s = selectedStartDate, let e = selectedEndDate {
                delegate?.didPickDateRange(startDate: s, endDate: e)
            }
            
        default:
            break
        }
    }
}

// =====================================================================
// MARK: - Помощни функции
// =====================================================================
extension CalendarDateRangePickerViewController {

    func makeFirstDayOfMonth(from date: Date) -> Date {
        var comps = Calendar.current.dateComponents([.year, .month], from: date)
        comps.day = 1
        return Calendar.current.date(from: comps)!
    }

    func getMonthLabel(date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy"
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
            return "???"
        }

        let formatter = DateFormatter()
        formatter.dateFormat = "EEE"
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
