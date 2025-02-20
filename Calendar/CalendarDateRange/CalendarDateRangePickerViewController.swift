import UIKit

public protocol CalendarDateRangePickerViewControllerDelegate {
    func didCancelPickingDateRange()
    func didPickDateRange(startDate: Date!, endDate: Date!)
}

public class CalendarDateRangePickerViewController: UICollectionViewController {
    
    let cellReuseIdentifier = "CalendarDateRangePickerCell"
    let headerReuseIdentifier = "CalendarDateRangePickerHeaderView"
    
    public var delegate: CalendarDateRangePickerViewControllerDelegate!
    
    let itemsPerRow = 7
    let itemHeight: CGFloat = 40
    let collectionViewInsets = UIEdgeInsets(top: 0, left: 25, bottom: 0, right: 25)
    
    // Може да се подадат отвън
    public var minimumDate: Date?
    public var maximumDate: Date?
    
    // Може да се подадат отвън
    public var selectedStartDate: Date?
    public var selectedEndDate: Date?
    
    public var selectedColor = UIColor(red: 66/255.0, green: 150/255.0, blue: 240/255.0, alpha: 1.0)
    public var titleText = "Select Dates"
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        self.title = self.titleText
        
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
        
        // Ако никой не е подал min/max -> примерно -5/+3 години около днес
        let today = Date()
        if minimumDate == nil {
            minimumDate = Calendar.current.date(byAdding: .year, value: -5, to: today)
        }
        if maximumDate == nil {
            maximumDate = Calendar.current.date(byAdding: .year, value: 3, to: today)
        }
        
        // Бутони
        self.navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "Cancel",
            style: .plain,
            target: self,
            action: #selector(CalendarDateRangePickerViewController.didTapCancel)
        )
        self.navigationItem.rightBarButtonItem = UIBarButtonItem(
            title: "Done",
            style: .done,
            target: self,
            action: #selector(CalendarDateRangePickerViewController.didTapDone)
        )
        
        // Ако имаме поне startDate, позволяваме Done
        self.navigationItem.rightBarButtonItem?.isEnabled = (selectedStartDate != nil)
    }
    
    // Скролваме в viewWillAppear, за да избегнем "премигване"
    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        collectionView?.alpha = 0
        collectionView?.reloadData()
        collectionView?.layoutIfNeeded()
        
        // Скролваме до (startDate) или (днес), ако startDate е nil
        let anchorDate = selectedStartDate ?? Date()
        
        guard let minDate = minimumDate else {
            collectionView?.alpha = 1
            return
        }
        
        let differenceInMonths = Calendar.current.dateComponents([.month], from: minDate, to: anchorDate).month ?? 0
        let safeSection = max(0, differenceInMonths)
        
        let indexPath = IndexPath(item: 0, section: safeSection)
        collectionView?.scrollToItem(at: indexPath, at: .top, animated: false)
        
        collectionView?.alpha = 1
    }
    
    @objc func didTapCancel() {
        delegate?.didCancelPickingDateRange()
    }
    
    @objc func didTapDone() {
        // Ако имаме само start => end = start (един ден)
        guard let start = selectedStartDate else { return }
        let end = selectedEndDate ?? start
        
        delegate?.didPickDateRange(startDate: start, endDate: end)
    }
}

// MARK: - UICollectionViewDataSource
extension CalendarDateRangePickerViewController {
    
    public override func numberOfSections(in collectionView: UICollectionView) -> Int {
        guard let minDate = minimumDate, let maxDate = maximumDate else {
            // Ако са nil, даваме примерно 12 месеца
            return 12
        }
        
        let difference = Calendar.current.dateComponents([.month], from: minDate, to: maxDate)
        return (difference.month ?? 0) + 1
    }
    
    public override func collectionView(_ collectionView: UICollectionView,
                                        numberOfItemsInSection section: Int) -> Int {
        // Първите 7 са дните от седмицата (Mon, Tue, Wed...)
        let weekdayRowItems = 7
        
        let firstDateForSection = getFirstDateForSection(section: section)
        
        // Колко празни позиции има преди да започне 1-ви ден
        let blankItems = getWeekday(date: firstDateForSection) - 1
        
        // Колко дни има в месеца
        let daysInMonth = getNumberOfDaysInMonth(date: firstDateForSection)
        
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
        
        let firstDateForSection = getFirstDateForSection(section: indexPath.section)
        let blankItems = getWeekday(date: firstDateForSection) - 1
        
        // Първите 7 клетки: етикети за дните (Mon, Tue, Wed...)
        if indexPath.item < 7 {
            cell.label.text = getWeekdayLabel(weekday: indexPath.item + 1)
        }
        else if indexPath.item < 7 + blankItems {
            cell.label.text = ""
        }
        else {
            // Коя дата представлява тази клетка
            let dayOfMonth = indexPath.item - (7 + blankItems) + 1
            let date = getDate(dayOfMonth: dayOfMonth, section: indexPath.section)
            cell.date = date
            cell.label.text = "\(dayOfMonth)"
            
            // ----------------------------
            // Логика за оцветяване:
            // ----------------------------
            if let start = selectedStartDate, let end = selectedEndDate {
                
                if areSameDay(dateA: start, dateB: end) {
                    // === ЕДНА дата (start == end) ===
                    if areSameDay(dateA: date, dateB: start) {
                        // Само кръг, без highlightLeft / highlightRight
                        cell.select()
                    } else {
                        // Ако е днешен ден извън селекция:
                        if areSameDay(dateA: date, dateB: Date()) {
                            cell.label.textColor = .orange
                        }
                    }
                } else {
                    // === Имаме истински диапазон (start < end) ===
                    
                    // Ако датата е "между" start и end
                    if isBefore(dateA: start, dateB: date) && isBefore(dateA: date, dateB: end) {
                        
                        if dayOfMonth == 1 {
                            cell.highlightRight()  // 1-ви ден на месеца
                        }
                        else if dayOfMonth == getNumberOfDaysInMonth(date: date) {
                            cell.highlightLeft()   // последен ден
                        } else {
                            cell.highlight()
                        }
                        
                    }
                    else if areSameDay(dateA: date, dateB: start) {
                        cell.select()
                        cell.highlightRight()
                    }
                    else if areSameDay(dateA: date, dateB: end) {
                        cell.select()
                        cell.highlightLeft()
                    }
                    else {
                        // Ако е "днес", извън диапазона:
                        if areSameDay(dateA: date, dateB: Date()) {
                            cell.label.textColor = .orange
                        }
                    }
                }
                
            } else if let start = selectedStartDate {
                // == Имаме само start, няма end
                if areSameDay(dateA: date, dateB: start) {
                    cell.select()
                } else {
                    if areSameDay(dateA: date, dateB: Date()) {
                        cell.label.textColor = .orange
                    }
                }
            } else {
                // == Нямаме никакви избрани дати
                if areSameDay(dateA: date, dateB: Date()) {
                    cell.label.textColor = .orange
                }
            }
        }
        
        return cell
    }
    
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
            headerView.label.text = getMonthLabel(date: getFirstDateForSection(section: indexPath.section))
            return headerView
        default:
            fatalError("Unexpected element kind")
        }
    }
}

// MARK: - UICollectionViewDelegateFlowLayout
extension CalendarDateRangePickerViewController: UICollectionViewDelegateFlowLayout {
    
    public override func collectionView(_ collectionView: UICollectionView,
                                        didSelectItemAt indexPath: IndexPath) {
        
        guard let cell = collectionView.cellForItem(at: indexPath) as? CalendarDateRangePickerCell,
              let cellDate = cell.date else {
            return
        }
        
        // Логика, която позволява:
        // - ако нямаме start => избираме start
        // - ако имаме start, но нямаме end => избираме end, ако е след start, иначе сменяме start
        // - ако имаме start + end => рестартираме с нов start
        
        if selectedStartDate == nil {
            // Първа селекция
            selectedStartDate = cellDate
            self.navigationItem.rightBarButtonItem?.isEnabled = true
        }
        else if selectedEndDate == nil {
            // Имаме само start
            if let start = selectedStartDate, isBefore(dateA: start, dateB: cellDate) {
                // Ако избраната е след start => това е end
                selectedEndDate = cellDate
                self.navigationItem.rightBarButtonItem?.isEnabled = true
            } else {
                // Ако user избере дата преди start => нов start
                selectedStartDate = cellDate
            }
        }
        else {
            // Имаме вече start + end => почваме начисто
            selectedStartDate = cellDate
            selectedEndDate = nil
            self.navigationItem.rightBarButtonItem?.isEnabled = true
        }
        
        collectionView.reloadData()
    }
    
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
    
    func getFirstDate() -> Date {
        // Ако minimumDate е nil -> днешна
        let safeMinDate = minimumDate ?? Date()
        var comps = Calendar.current.dateComponents([.month, .year], from: safeMinDate)
        comps.day = 1
        return Calendar.current.date(from: comps)!
    }
    
    func getFirstDateForSection(section: Int) -> Date {
        return Calendar.current.date(byAdding: .month, value: section, to: getFirstDate())!
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
            return "E"
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
    
    func getDate(dayOfMonth: Int, section: Int) -> Date {
        var comps = Calendar.current.dateComponents([.month, .year],
                                                    from: getFirstDateForSection(section: section))
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
