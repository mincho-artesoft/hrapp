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
    
    // Тук пазим нашия UILabel, който показва "March 2025"
    var monthLabel = UILabel()
    
    var currentMonth: Date = Date()
    
    public var delegate: CalendarDateRangePickerViewControllerDelegate!
    let itemsPerRow = 7
    let itemHeight: CGFloat = 40
    let collectionViewInsets = UIEdgeInsets(top: 0, left: 25, bottom: 0, right: 25)
    
    public var minimumDate: Date?
    public var maximumDate: Date?
    
    public var selectedStartDate: Date?
    public var selectedEndDate: Date?
    
    public var selectedColor = UIColor(red: 66/255.0,
                                       green: 150/255.0,
                                       blue: 240/255.0,
                                       alpha: 1.0)
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        collectionView?.dataSource = self
        collectionView?.delegate = self
        collectionView?.backgroundColor = UIColor.white
        
        // Регистрираме клетката
        collectionView?.register(
            CalendarDateRangePickerCell.self,
            forCellWithReuseIdentifier: cellReuseIdentifier
        )
        
        // Отстояния
        collectionView?.contentInset = collectionViewInsets
        
        // Минимални и максимални дати
        let today = Date()
        if minimumDate == nil {
            minimumDate = Calendar.current.date(byAdding: .year, value: -5, to: today)
        }
        if maximumDate == nil {
            maximumDate = Calendar.current.date(byAdding: .year, value: 3, to: today)
        }
        
        // Кой месец да се показва
        if let start = selectedStartDate {
            currentMonth = makeFirstDayOfMonth(from: start)
        } else {
            currentMonth = makeFirstDayOfMonth(from: today)
        }
        
        // == Слагаме MonthLabel в левия ъгъл ==
        monthLabel.text = getMonthLabel(date: currentMonth)  // "March 2025", напр.
        monthLabel.sizeToFit()
        
        // Пускаме tap жест върху monthLabel
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(monthLabelTapped))
        monthLabel.isUserInteractionEnabled = true
        monthLabel.addGestureRecognizer(tapGesture)
        
        // Правим UIBarButtonItem с този Label
        let labelItem = UIBarButtonItem(customView: monthLabel)
        self.navigationItem.leftBarButtonItem = labelItem
        
        // == Слагаме бутоните < и > в десния ъгъл ==
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
        
        // Ако искате "<" да е по-близо до monthLabel, разменете реда
        self.navigationItem.rightBarButtonItems = [nextMonthButton, prevMonthButton]
    }
    
    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        collectionView?.reloadData()
    }
    
    // При натискане на monthLabel -> показваме UIPickerView в UIAlertController
    @objc func monthLabelTapped() {
        let alert = UIAlertController(
            title: "Select month & year",
            message: "\n\n\n\n\n\n\n\n", // малък трик за място на Picker-а (~8 празни реда)
            preferredStyle: .actionSheet
        )
        
        // Създаваме нашия MonthYearPickerView
        let pickerView = MonthYearPickerView()
        pickerView.frame = CGRect(x: 0, y: 0, width: alert.view.bounds.width, height: 180)
        
        // Позиционираме пикъра според текущия месец/година
        let cal = Calendar.current
        let comps = cal.dateComponents([.year, .month], from: currentMonth)
        let curYear = comps.year ?? 2025
        let curMonth = comps.month ?? 3
        pickerView.select(month: curMonth, year: curYear)
        
        // Добавяме pickerView като subview на alert.view
        alert.view.addSubview(pickerView)
        
        // Бутон OK
        let okAction = UIAlertAction(title: "OK", style: .default) { [weak self] _ in
            guard let self = self else { return }
            
            let newMonth = pickerView.getSelectedMonth()    // int [1..12]
            let newYear = pickerView.getSelectedYear()      // int, напр. 2025
            
            // Правим нов Date (1-во число на избрания месец)
            var components = DateComponents()
            components.day = 1
            components.month = newMonth
            components.year = newYear
            if let newDate = Calendar.current.date(from: components) {
                self.currentMonth = newDate
                // Обновяваме monthLabel
                self.monthLabel.text = self.getMonthLabel(date: newDate)
                self.monthLabel.sizeToFit()
                
                // Релоуд на колекцията
                self.collectionView?.reloadData()
            }
        }
        
        // Бутон Cancel
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
        
        alert.addAction(okAction)
        alert.addAction(cancelAction)
        
        // За iPad (popover) да не крашне
        if let popoverController = alert.popoverPresentationController {
            popoverController.sourceView = self.monthLabel
            popoverController.sourceRect = self.monthLabel.bounds
        }
        
        present(alert, animated: true, completion: nil)
    }
    
    // Бутон < (предишен месец)
    @objc func didTapPrevMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: -1, to: currentMonth) {
            if let minD = minimumDate, newMonth < makeFirstDayOfMonth(from: minD) {
                return
            }
            currentMonth = newMonth
            
            // Обновяваме monthLabel
            self.monthLabel.text = getMonthLabel(date: currentMonth)
            self.monthLabel.sizeToFit()
            
            collectionView?.reloadData()
        }
    }
    
    // Бутон > (следващ месец)
    @objc func didTapNextMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: 1, to: currentMonth) {
            if let maxD = maximumDate, newMonth > makeFirstDayOfMonth(from: maxD) {
                return
            }
            currentMonth = newMonth
            
            // Обновяваме monthLabel
            self.monthLabel.text = getMonthLabel(date: currentMonth)
            self.monthLabel.sizeToFit()
            
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
        // 7 клетки за дните (Mon..Sun) + празни + реални дни
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
        
        // Първите 7 са етикети (Mon, Tue, Wed ...)
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
                // Един ден
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
            // Нямаме нищо
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
            if let start = selectedStartDate,
               isBefore(dateA: start, dateB: cellDate) {
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
            // Трето кликване => нов диапазон
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
        // Тук искаме "Mon" да е 1, но в iOS Monday = 2
        // Ако искате да компенсирате, може да има offset; засега приемаме така
        var comps = DateComponents()
        comps.calendar = Calendar.current
        comps.weekday = weekday
        
        let date = Calendar.current.nextDate(after: Date(),
                                             matching: comps,
                                             matchingPolicy: .strict)
        if date == nil { return "?" }
        
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEEE" // 1 буква: M, T, W...
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
