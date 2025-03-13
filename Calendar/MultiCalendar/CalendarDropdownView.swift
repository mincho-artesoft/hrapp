import UIKit
import EventKit

final class CalendarDropdownView: UIView, UITableViewDelegate, UITableViewDataSource {
    
    private let tableView = UITableView(frame: .zero, style: .plain)
    
    // Тук пазим само локалните календари (примерна логика):
    private var localCalendars: [EKCalendar] = []
    
    // Речник: [calendarID: (title, color)]
    private var selectedCalendars = [String: (title: String, color: UIColor)]()
    
    // Когато нещо се промени, викаме този callback,
    // за да уведомим контейнера (TwoWayPinnedMultiDayContainerMultiCalendarView)
    var onSelectionChanged: (([String: (title: String, color: UIColor)]) -> Void)?
    
    // ViewModel – трябва да е имплементиран във вашия проект
    private let viewModel = CalendarViewModel.shared
    
    // MARK: - Инициализатори
    override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        commonInit()
    }
    
    private func commonInit() {
        backgroundColor = .systemBackground
        layer.cornerRadius = 10
        layer.masksToBounds = true
        
        // Примерна начална големина – после я променяме в superview
        self.frame.size = CGSize(width: 200, height: 300)
        
        tableView.delegate   = self
        tableView.dataSource = self
        tableView.rowHeight  = 44
        tableView.register(CalendarCell.self, forCellReuseIdentifier: "CalendarCell")
        
        addSubview(tableView)
        
        reloadCalendars()
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        tableView.frame = bounds
    }
    
    /// Презареждаме календари (примерна логика)
    private func reloadCalendars() {
        viewModel.reloadCalendars()
        localCalendars = viewModel.allCalendars.filter { $0.source.sourceType == .local }
        
        // Ако речникът ни е празен => за първи път се отваряме
        // => селектираме ВСИЧКИ локални. (примерно)
        if selectedCalendars.isEmpty {
            for cal in localCalendars {
                let color = UIColor(cgColor: cal.cgColor)
                selectedCalendars[cal.calendarIdentifier] = (title: cal.title, color: color)
            }
        }
        
        tableView.reloadData()
    }

    /// Контейнерът ще извика този метод, ако има вече запазени селектирани календари
    public func setSelectedCalendars(_ dict: [String: (title: String, color: UIColor)]) {
        selectedCalendars = dict
        tableView.reloadData()
    }
    
    // MARK: - UITableViewDataSource
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView,
                   numberOfRowsInSection section: Int) -> Int {
        return localCalendars.count
    }
    
    func tableView(_ tableView: UITableView,
                   cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(
            withIdentifier: "CalendarCell",
            for: indexPath
        ) as! CalendarCell
        
        let calendar = localCalendars[indexPath.row]
        let calID = calendar.calendarIdentifier
        
        // Проверяваме дали този календар е в речника
        let isSelected = selectedCalendars.keys.contains(calID)
        
        cell.configure(with: calendar, isSelected: isSelected)
        
        return cell
    }
    
    // MARK: - UITableViewDelegate
    func tableView(_ tableView: UITableView,
                   didSelectRowAt indexPath: IndexPath) {
        
        tableView.deselectRow(at: indexPath, animated: true)
        
        // Взимаме съответния календар
        let calendar = localCalendars[indexPath.row]
        let calID = calendar.calendarIdentifier
        let calColor = UIColor(cgColor: calendar.cgColor)
        
        // Ако вече е селектиран, го махаме; иначе го добавяме
        if selectedCalendars.keys.contains(calID) {
            selectedCalendars.removeValue(forKey: calID)
        } else {
            selectedCalendars[calID] = (title: calendar.title, color: calColor)
        }
        
        // Презареждаме само текущия ред, за да се обнови отметката
        tableView.reloadRows(at: [indexPath], with: .none)
        
        print("[CalendarDropdownView] Селектирани календари:")
        for (id, info) in selectedCalendars {
            print("  - \(info.title) [\(id)], color=\(info.color)")
        }
        
        // Уведомяваме контейнера
        onSelectionChanged?(selectedCalendars)
    }
}
