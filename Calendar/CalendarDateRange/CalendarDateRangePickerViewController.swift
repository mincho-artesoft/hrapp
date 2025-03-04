import UIKit
import Foundation

// MARK: - Протокол
public protocol CalendarDateRangePickerViewControllerDelegate {
    func didCancelPickingDateRange()
    func didPickDateRange(startDate: Date!, endDate: Date!)
}

// MARK: - Основен VC
public class CalendarDateRangePickerViewController: UICollectionViewController {
    
    let cellReuseIdentifier = "CalendarDateRangePickerCell"
    
    // UILabel, който показва месец и година (примерно "March 2025")
    var monthLabel = UILabel()
    
    // Стрелка (UIImageView) + булево, което пази дали е завъртяна надолу
    private var arrowImageView = UIImageView()
    private var arrowIsDown = false
    
    var currentMonth: Date = Date()
    
    public var delegate: CalendarDateRangePickerViewControllerDelegate!
    let itemsPerRow = 7
    let itemHeight: CGFloat = 40
    let collectionViewInsets = UIEdgeInsets(top: 0, left: 25, bottom: 0, right: 25)
    
    public var minimumDate: Date?
    public var maximumDate: Date?
    
    public var selectedStartDate: Date?
    public var selectedEndDate: Date?
    
    // Цвят за избрания ден
    public var selectedColor = UIColor(
        red: 66/255.0,
        green: 150/255.0,
        blue: 240/255.0,
        alpha: 1.0
    )
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        collectionView?.dataSource = self
        collectionView?.delegate = self
        collectionView?.backgroundColor = UIColor.white
        
        // Регистрираме нашата custom клетка
        collectionView?.register(
            CalendarDateRangePickerCell.self,
            forCellWithReuseIdentifier: cellReuseIdentifier
        )
        
        // Отстояния
        collectionView?.contentInset = collectionViewInsets
        
        // Ако не е подадена min/max дата, задаваме по подразбиране (± няколко години)
        let today = Date()
        if minimumDate == nil {
            minimumDate = Calendar.current.date(byAdding: .year, value: -5, to: today)
        }
        if maximumDate == nil {
            maximumDate = Calendar.current.date(byAdding: .year, value: 3, to: today)
        }
        
        // Определяме кой месец да се показва (или този на startDate, или сегашен)
        if let start = selectedStartDate {
            currentMonth = makeFirstDayOfMonth(from: start)
        } else {
            currentMonth = makeFirstDayOfMonth(from: today)
        }
        
        // == Слагаме monthLabel и стрелката ">" в лявата част на Navigation Bar ==
        monthLabel.text = getMonthLabel(date: currentMonth)
        monthLabel.textColor = .label  // Начален цвят – системен (черен/бял според Dark Mode)
        monthLabel.sizeToFit()
        
        // Стрелката (SF Symbol "chevron.right"), която винаги е синя
        arrowImageView.image = UIImage(systemName: "chevron.right")
        arrowImageView.tintColor = .systemBlue
        arrowImageView.contentMode = .scaleAspectFit
        
        // Слагаме monthLabel + стрелката в един UIStackView
        let containerStack = UIStackView(arrangedSubviews: [monthLabel, arrowImageView])
        containerStack.axis = .horizontal
        containerStack.spacing = 4
        
        // Добавяме Tap Gesture върху целия stack, за да отваря Picker-а
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(monthLabelTapped))
        containerStack.isUserInteractionEnabled = true
        containerStack.addGestureRecognizer(tapGesture)
        
        // Правим UIBarButtonItem от този StackView
        let labelItem = UIBarButtonItem(customView: containerStack)
        self.navigationItem.leftBarButtonItem = labelItem
        
        // == Добавяме бутоните < и > в десния ъгъл за смяна на месеца ==
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
        
        // Подреждаме бутоните: [Next, Prev]
        self.navigationItem.rightBarButtonItems = [nextMonthButton, prevMonthButton]
    }
    
    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        collectionView?.reloadData()
    }
    
    // При натискане на monthLabel/стрелката -> UIPickerView в UIAlertController
    @objc func monthLabelTapped() {
        // Обръщаме флага arrowIsDown
        arrowIsDown.toggle()
        
        // Изчисляваме ъгъла на завъртане (0 за надясно, π/2 за надолу)
        let rotationAngle: CGFloat = arrowIsDown ? .pi / 2 : 0
        
        // Анимираме завъртане на стрелката и може да сменим цвета на label, ако желаем
        UIView.animate(withDuration: 0.25) {
            self.arrowImageView.transform = CGAffineTransform(rotationAngle: rotationAngle)
            self.monthLabel.textColor = self.arrowIsDown ? .systemBlue : .label
        }
        
        // Показваме UIAlertController с нашия MonthYearPickerView
        let alert = UIAlertController(
            title: "Select month & year",
            message: "\n\n\n\n\n\n\n\n", // Добавя празни редове, за да има място за Picker
            preferredStyle: .actionSheet
        )
        
        // Picker за месец/година
        let pickerView = MonthYearPickerView()
        pickerView.frame = CGRect(
            x: 0,
            y: 0,
            width: alert.view.bounds.width,
            height: 180
        )
        
        // Настройваме picker-а да е на текущия monthLabel
        let cal = Calendar.current
        let comps = cal.dateComponents([.year, .month], from: currentMonth)
        let curYear = comps.year ?? 2025
        let curMonth = comps.month ?? 3
        pickerView.select(month: curMonth, year: curYear)
        
        alert.view.addSubview(pickerView)
        
        // OK бутон
        let okAction = UIAlertAction(title: "OK", style: .default) { [weak self] _ in
            guard let self = self else { return }
            
            let newMonth = pickerView.getSelectedMonth()  // 1..12
            let newYear = pickerView.getSelectedYear()    // напр. 2025
            
            // Правим нова дата (1-во число на избрания месец/година)
            var components = DateComponents()
            components.day = 1
            components.month = newMonth
            components.year = newYear
            
            if let newDate = Calendar.current.date(from: components) {
                self.currentMonth = newDate
                self.monthLabel.text = self.getMonthLabel(date: newDate)
                self.monthLabel.sizeToFit()
                
                // Ако искаме след OK да се връща пак ">" и черен monthLabel:
                // self.arrowIsDown = false
                // self.arrowImageView.transform = .identity
                // self.monthLabel.textColor = .label
                
                self.collectionView?.reloadData()
            }
        }
        
        // Cancel бутон
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { [weak self] _ in
            guard let self = self else { return }
            
            // При Cancel върнем стрелката и цвета в изходно положение
            self.arrowIsDown = false
            UIView.animate(withDuration: 0.25) {
                self.arrowImageView.transform = .identity
                self.monthLabel.textColor = .label
            }
        }
        
        alert.addAction(okAction)
        alert.addAction(cancelAction)
        
        // За iPad (popover) – да не крашне
        if let popoverController = alert.popoverPresentationController {
            popoverController.sourceView = self.monthLabel
            popoverController.sourceRect = self.monthLabel.bounds
        }
        
        present(alert, animated: true, completion: nil)
    }
    
    // Предишен месец
    @objc func didTapPrevMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: -1, to: currentMonth) {
            // Не позволяваме да отидем преди minimumDate (ако е зададена)
            if let minD = minimumDate, newMonth < makeFirstDayOfMonth(from: minD) {
                return
            }
            currentMonth = newMonth
            monthLabel.text = getMonthLabel(date: currentMonth)
            monthLabel.sizeToFit()
            collectionView?.reloadData()
        }
    }
    
    // Следващ месец
    @objc func didTapNextMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: 1, to: currentMonth) {
            // Не позволяваме да отидем след maximumDate (ако е зададена)
            if let maxD = maximumDate, newMonth > makeFirstDayOfMonth(from: maxD) {
                return
            }
            currentMonth = newMonth
            monthLabel.text = getMonthLabel(date: currentMonth)
            monthLabel.sizeToFit()
            collectionView?.reloadData()
        }
    }
}

// MARK: - UICollectionViewDataSource
extension CalendarDateRangePickerViewController {
    
    public override func numberOfSections(in collectionView: UICollectionView) -> Int {
        return 1
    }
    
    public override func collectionView(_ collectionView: UICollectionView,
                                        numberOfItemsInSection section: Int) -> Int {
        // 7 клетки за дните (Mon..Sun), + blank слотове + реалните дни
        let weekdayRowItems = 7
        let blankItems = getWeekday(date: currentMonth) - 1
        let daysInMonth = getNumberOfDaysInMonth(date: currentMonth)
        return weekdayRowItems + blankItems + daysInMonth
    }
    
    public override func collectionView(_ collectionView: UICollectionView,
                                        cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let cell = collectionView.dequeueReusableCell(
            withReuseIdentifier: cellReuseIdentifier,
            for: indexPath
        ) as! CalendarDateRangePickerCell
        
        cell.selectedColor = self.selectedColor
        cell.reset()
        
        // Първите 7 клетки са за "Mon", "Tue", "Wed", ...
        if indexPath.item < 7 {
            cell.label.text = getWeekdayLabel(weekday: indexPath.item + 1)
            return cell
        }
        
        // Празни слотове за преди 1-во число
        let blankItems = getWeekday(date: currentMonth) - 1
        if indexPath.item < 7 + blankItems {
            cell.label.text = ""
            return cell
        }
        
        // Изчисляваме ден от месеца
        let dayOfMonth = indexPath.item - (7 + blankItems) + 1
        let date = getDate(dayOfMonth: dayOfMonth, baseMonth: currentMonth)
        cell.date = date
        cell.label.text = "\(dayOfMonth)"
        
        // Слагаме различни цветове, ако е в избрания диапазон
        if let start = selectedStartDate, let end = selectedEndDate {
            if areSameDay(dateA: start, dateB: end) {
                // Само един ден
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
            // Имаме само start
            if areSameDay(dateA: date, dateB: start) {
                cell.select()
            } else if areSameDay(dateA: date, dateB: Date()) {
                cell.label.textColor = .orange
            }
        }
        else {
            // Не са избрани никакви дати
            if areSameDay(dateA: date, dateB: Date()) {
                cell.label.textColor = .orange
            }
        }
        
        return cell
    }
}

// MARK: - UICollectionViewDelegate
extension CalendarDateRangePickerViewController {
    
    public override func collectionView(_ collectionView: UICollectionView,
                                        didSelectItemAt indexPath: IndexPath) {
        
        guard let cell = collectionView.cellForItem(at: indexPath) as? CalendarDateRangePickerCell,
              let cellDate = cell.date else {
            return
        }
        
        // Логика за избор на start/end
        if selectedStartDate == nil {
            selectedStartDate = cellDate
        }
        else if selectedEndDate == nil {
            if let start = selectedStartDate, isBefore(dateA: start, dateB: cellDate) {
                selectedEndDate = cellDate
            } else {
                selectedStartDate = cellDate
            }
            
            // Вече имаме start+end => казваме на делегата
            if let s = selectedStartDate, let e = selectedEndDate {
                delegate?.didPickDateRange(startDate: s, endDate: e)
            }
        }
        else {
            // Трето кликване => зануляваме и почваме нов диапазон
            selectedStartDate = cellDate
            selectedEndDate = nil
        }
        
        collectionView.reloadData()
    }
}

// MARK: - UICollectionViewDelegateFlowLayout
extension CalendarDateRangePickerViewController: UICollectionViewDelegateFlowLayout {
    
    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               sizeForItemAt indexPath: IndexPath) -> CGSize {
        
        let padding = collectionViewInsets.left + collectionViewInsets.right
        let availableWidth = view.frame.width - padding
        let itemWidth = availableWidth / CGFloat(itemsPerRow)
        return CGSize(width: itemWidth, height: itemHeight)
    }
    
    // Не ни трябва header => .zero
    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               referenceSizeForHeaderInSection section: Int) -> CGSize {
        return .zero
    }
    
    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return 5
    }
    
    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               minimumInteritemSpacingForSectionAt section: Int) -> CGFloat {
        return 0
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
        // weekday: 1 = Sunday, 2 = Monday, ...
        // В iOS "Monday" = 2, "Sunday" = 1.
        var comps = DateComponents()
        comps.calendar = Calendar.current
        comps.weekday = weekday
        
        let date = Calendar.current.nextDate(
            after: Date(),
            matching: comps,
            matchingPolicy: .strict
        )
        if date == nil { return "?" }
        
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEEE" // 1 буква: M, T, W, T, F, S, S
        return formatter.string(from: date!)
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
