import UIKit

class WeekDaysView: UIView {
    /// The first day of the week (normalized to midnight).
    var startDate: Date {
        didSet {
            startDate = calendar.startOfDay(for: startDate)
            updateDayCells()
        }
    }
    
    /// The currently selected date (normalized to midnight).
    private var selectedDate: Date? {
        didSet {
            if let sel = selectedDate { self.selectedDate = calendar.startOfDay(for: sel) }
            updateDayCells()
        }
    }
    
    /// The calendar used for date calculations.
    var calendar: Calendar
    
    /// Called when a day is tapped.
    var tapHandler: ((Date) -> Void)?
    
    private let daysInWeek = 7
    private var dayCells: [DayCellView] = []
    
    init(startDate: Date, selectedDate: Date?, calendar: Calendar = Calendar.current) {
        self.calendar = calendar
        self.startDate = calendar.startOfDay(for: startDate)
        if let sel = selectedDate {
            self.selectedDate = calendar.startOfDay(for: sel)
        }
        super.init(frame: .zero)
        setupDayCells()
    }
    
    required init?(coder: NSCoder) {
        self.calendar = Calendar.current
        self.startDate = calendar.startOfDay(for: Date())
        super.init(coder: coder)
        setupDayCells()
    }
    
    private func setupDayCells() {
//        for _ in 0..<daysInWeek {
//            let cell = DayCellView()
//            cell.tapHandler = { [weak self, weak cell] in
//                guard let self = self, let cell = cell,
//                      let index = self.dayCells.firstIndex(of: cell) else { return }
//                let date = self.calendar.date(byAdding: .day, value: index, to: self.startDate)!
//                self.tapHandler?(date)
//            }
//            addSubview(cell)
//            dayCells.append(cell)
//        }
    }
    
    override func layoutSubviews() {
//        super.layoutSubviews()
//        let cellWidth = bounds.width / CGFloat(daysInWeek)
//        let cellHeight = bounds.height
//        for (index, cell) in dayCells.enumerated() {
//            cell.frame = CGRect(x: CGFloat(index) * cellWidth,
//                                y: 0,
//                                width: cellWidth,
//                                height: cellHeight)
//        }
    }
    
    private func updateDayCells() {
//        let today = calendar.startOfDay(for: Date())
//        for i in 0..<daysInWeek {
//            let cell = dayCells[i]
//            let cellDate = calendar.date(byAdding: .day, value: i, to: startDate)!
//            cell.date = cellDate
//            let normalizedCellDate = calendar.startOfDay(for: cellDate)
//            let isToday = (normalizedCellDate == today)
//            let isSelected = (selectedDate != nil && normalizedCellDate == selectedDate!)
//            cell.configure(isToday: isToday, isSelected: isSelected)
//        }
    }
    
    func setSelectedDate(_ date: Date) {
        self.selectedDate = calendar.startOfDay(for: date)
    }
}
