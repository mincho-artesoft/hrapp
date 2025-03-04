import Foundation
import UIKit

public protocol CalendarDateRangePickerViewControllerDelegate {
    func didCancelPickingDateRange()
    func didPickDateRange(startDate: Date!, endDate: Date!)
}

public class CalendarDateRangePickerViewController: UICollectionViewController {
    
    let cellReuseIdentifier = "CalendarDateRangePickerCell"
    let headerReuseIdentifier = "CalendarDateRangePickerHeaderView"
    
    var currentMonth: Date = Date()
    
    public var delegate: CalendarDateRangePickerViewControllerDelegate!
    let itemsPerRow = 7
    let itemHeight: CGFloat = 40
    let collectionViewInsets = UIEdgeInsets(top: 0, left: 25, bottom: 0, right: 25)
    
    public var minimumDate: Date?
    public var maximumDate: Date?
    
    public var selectedStartDate: Date?
    public var selectedEndDate: Date?
    
    public var selectedColor = UIColor(red: 66/255.0, green: 150/255.0, blue: 240/255.0, alpha: 1.0)
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        collectionView?.dataSource = self
        collectionView?.delegate = self
        collectionView?.backgroundColor = UIColor.white
        
        collectionView?.register(
            CalendarDateRangePickerCell.self,
            forCellWithReuseIdentifier: cellReuseIdentifier
        )
        collectionView?.register(
            CalendarDateRangePickerHeaderView.self,
            forSupplementaryViewOfKind: UICollectionView.elementKindSectionHeader,
            withReuseIdentifier: headerReuseIdentifier
        )
        collectionView?.contentInset = collectionViewInsets
        
        // Минимални/максимални дати
        let today = Date()
        if minimumDate == nil {
            minimumDate = Calendar.current.date(byAdding: .year, value: -5, to: today)
        }
        if maximumDate == nil {
            maximumDate = Calendar.current.date(byAdding: .year, value: 3, to: today)
        }
        
        // Определяме кой месец да се вижда
        if let start = selectedStartDate {
            currentMonth = makeFirstDayOfMonth(from: start)
        } else {
            currentMonth = makeFirstDayOfMonth(from: today)
        }
        
        // -- Махаме бутоните Cancel/Done --
        // (ако искаме да имаме < / > бутони за навигация, може да ги оставим)
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
        // Примерно ги слагаме вдясно
        self.navigationItem.rightBarButtonItems = [nextMonthButton, prevMonthButton]
    }
    
    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        collectionView?.reloadData()
    }
    
    // MARK: - Бутоните < / >
    @objc func didTapPrevMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: -1, to: currentMonth) {
            if let minD = minimumDate, newMonth < makeFirstDayOfMonth(from: minD) {
                return
            }
            currentMonth = newMonth
            collectionView?.reloadData()
        }
    }
    
    @objc func didTapNextMonth() {
        if let newMonth = Calendar.current.date(byAdding: .month, value: 1, to: currentMonth) {
            if let maxD = maximumDate, newMonth > makeFirstDayOfMonth(from: maxD) {
                return
            }
            currentMonth = newMonth
            collectionView?.reloadData()
        }
    }
}

// MARK: - UICollectionViewDataSource
extension CalendarDateRangePickerViewController {
    
    public override func numberOfSections(in collectionView: UICollectionView) -> Int {
        // Само 1 секция – текущият месец
        return 1
    }
    
    public override func collectionView(_ collectionView: UICollectionView,
                                        numberOfItemsInSection section: Int) -> Int {
        // 7 клетки за етикетите на дните + празните слотове + реалните дни
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
        
        // Първите 7 са етикети (Mon, Tue, Wed...)
        if indexPath.item < 7 {
            cell.label.text = getWeekdayLabel(weekday: indexPath.item + 1)
            return cell
        }
        
        let blankItems = getWeekday(date: currentMonth) - 1
        // Празни слотове
        if indexPath.item < 7 + blankItems {
            cell.label.text = ""
            return cell
        }
        
        // Реални дни
        let dayOfMonth = indexPath.item - (7 + blankItems) + 1
        let date = getDate(dayOfMonth: dayOfMonth, baseMonth: currentMonth)
        cell.date = date
        cell.label.text = "\(dayOfMonth)"
        
        // Оцветяване (startDate/endDate)
        if let start = selectedStartDate, let end = selectedEndDate {
            // Имаме пълен диапазон
            if areSameDay(dateA: start, dateB: end) {
                // Един ден
                if areSameDay(dateA: date, dateB: start) {
                    cell.select()
                } else if areSameDay(dateA: date, dateB: Date()) {
                    cell.label.textColor = .orange
                }
            } else {
                // start < end
                if isBefore(dateA: start, dateB: date) && isBefore(dateA: date, dateB: end) {
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
    
    // Ако искате горен хедър "Месец Година":
    public override func collectionView(_ collectionView: UICollectionView,
                                        viewForSupplementaryElementOfKind kind: String,
                                        at indexPath: IndexPath) -> UICollectionReusableView {
        switch kind {
        case UICollectionView.elementKindSectionHeader:
            let headerView = collectionView.dequeueReusableSupplementaryView(
                ofKind: kind,
                withReuseIdentifier: headerReuseIdentifier,
                for: indexPath
            ) as! CalendarDateRangePickerHeaderView
            headerView.label.text = getMonthLabel(date: currentMonth)
            return headerView
        default:
            fatalError("Unexpected element kind")
        }
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
        
        // 1) Ако нямаме start -> избираме start
        // 2) Ако имаме start, но нямаме end -> слагаме end (ако е след start) или сменяме start
        // 3) В момента, в който имаме start + end, директно викаме callback и затваряме
        if selectedStartDate == nil {
            selectedStartDate = cellDate
        }
        else if selectedEndDate == nil {
            // Имаме само start
            if let start = selectedStartDate, isBefore(dateA: start, dateB: cellDate) {
                selectedEndDate = cellDate
            } else {
                selectedStartDate = cellDate
            }
            
            // Вече имаме start + end ⇒ Извикваме delegate => затваряме
            if let s = selectedStartDate, let e = selectedEndDate {
                delegate?.didPickDateRange(startDate: s, endDate: e)
            }
        }
        else {
            // Ако user кликне трети път, да започне нов диапазон
            // (По желание може директно да се игнорира третият клик)
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
    
    public func collectionView(_ collectionView: UICollectionView,
                               layout collectionViewLayout: UICollectionViewLayout,
                               referenceSizeForHeaderInSection section: Int) -> CGSize {
        return CGSize(width: view.frame.size.width, height: 50)
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
        formatter.dateFormat = "MMMM yyyy"
        return formatter.string(from: date)
    }
    
    func getWeekdayLabel(weekday: Int) -> String {
        var comps = DateComponents()
        comps.calendar = Calendar.current
        comps.weekday = weekday
        let date = Calendar.current.nextDate(after: Date(),
                                             matching: comps,
                                             matchingPolicy: .strict)
        if date == nil {
            return "?"
        }
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEEE" // 1 буква (M, T, W...)
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
