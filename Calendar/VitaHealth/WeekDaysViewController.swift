import UIKit

class WeekDaysViewController: UIViewController {
    /// The start of the week (normalized to midnight).
    var startDate: Date!
    /// The selected date to highlight.
    var selectedDate: Date?
    /// The calendar used for date calculations.
    var calendar: Calendar = Calendar.current
    
    /// The contained week view.
    private var weekView: WeekDaysView!
    
    /// Called when a day is tapped.
    var tapHandler: ((Date) -> Void)?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        weekView = WeekDaysView(startDate: startDate, selectedDate: selectedDate, calendar: calendar)
        weekView.tapHandler = { [weak self] date in
            self?.tapHandler?(date)
        }
        view.addSubview(weekView)
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        weekView.frame = view.bounds
    }
    
    func updateSelectedDate(_ date: Date) {
        selectedDate = calendar.startOfDay(for: date)
        weekView?.setSelectedDate(selectedDate!)
    }
}
