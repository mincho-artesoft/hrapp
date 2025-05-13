import UIKit

class InfiniteWeekHeaderViewController: UIPageViewController, UIPageViewControllerDataSource, UIPageViewControllerDelegate {
    var calendar: Calendar = Calendar.current
    
    /// The currently selected date (normalized).
    var selectedDate: Date = Date() {
        didSet {
            if let current = viewControllers?.first as? WeekDaysViewController {
                current.updateSelectedDate(selectedDate)
            }
            dateChanged?(selectedDate)
        }
    }
    
    /// Closure called when the selected date changes.
    var dateChanged: ((Date) -> Void)?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        dataSource = self
        delegate = self
        let initialWeekStart = beginningOfWeek(for: selectedDate)
        let initialVC = weekVC(for: initialWeekStart)
        initialVC.updateSelectedDate(selectedDate)
        setViewControllers([initialVC], direction: .forward, animated: false, completion: nil)
    }
    
    func beginningOfWeek(for date: Date) -> Date {
        let components = calendar.dateComponents([.yearForWeekOfYear, .weekOfYear], from: date)
        return calendar.date(from: components)!
    }
    
    func weekVC(for startDate: Date) -> WeekDaysViewController {
        let vc = WeekDaysViewController()
        vc.startDate = startDate
        vc.calendar = calendar
        vc.selectedDate = selectedDate
        vc.tapHandler = { [weak self] tappedDate in
            guard let self = self else { return }
            self.selectedDate = self.calendar.startOfDay(for: tappedDate)
        }
        return vc
    }
    
    // MARK: UIPageViewControllerDataSource
    
    func pageViewController(_ pageViewController: UIPageViewController,
                            viewControllerBefore viewController: UIViewController) -> UIViewController? {
        guard let vc = viewController as? WeekDaysViewController else { return nil }
        let previousWeekStart = calendar.date(byAdding: .day, value: -7, to: vc.startDate)!
        return weekVC(for: previousWeekStart)
    }
    
    func pageViewController(_ pageViewController: UIPageViewController,
                            viewControllerAfter viewController: UIViewController) -> UIViewController? {
        guard let vc = viewController as? WeekDaysViewController else { return nil }
        let nextWeekStart = calendar.date(byAdding: .day, value: 7, to: vc.startDate)!
        return weekVC(for: nextWeekStart)
    }
    
    // MARK: UIPageViewControllerDelegate
    
    func pageViewController(_ pageViewController: UIPageViewController,
                            didFinishAnimating finished: Bool,
                            previousViewControllers: [UIViewController],
                            transitionCompleted completed: Bool) {
        if completed, let vc = viewControllers?.first as? WeekDaysViewController {
            // Recalculate the selected date based on the visible week.
            let weekdayComponent = calendar.component(.weekday, from: selectedDate)
            let firstWeekday = calendar.firstWeekday
            let offset = (weekdayComponent - firstWeekday + 7) % 7
            let newSelected = calendar.date(byAdding: .day, value: offset, to: vc.startDate)!
            selectedDate = calendar.startOfDay(for: newSelected)
            vc.updateSelectedDate(selectedDate)
        }
    }
}
