import UIKit
import EventKit

final class CalendarDropdownView: UIView, UITableViewDelegate, UITableViewDataSource {
    
    private let tableView = UITableView(frame: .zero, style: .plain)
    
    // За да групираме „On My iPhone“ и „Other“
    private var localCalendars: [EKCalendar] = []
    private var otherCalendars: [EKCalendar] = []
    
    // Тук достъпваме директно сингълтона
    private let viewModel = CalendarViewModel.shared
    
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
        
        tableView.delegate   = self
        tableView.dataSource = self
        tableView.rowHeight  = 44
        
        addSubview(tableView)
        
        // Зареждаме списъка с календари
        reloadCalendars()
    }
    
    private func reloadCalendars() {
        viewModel.reloadCalendars()
        
        let allCals = viewModel.allCalendars
        localCalendars = allCals.filter { $0.source.sourceType == .local }
        otherCalendars = allCals.filter { $0.source.sourceType != .local }
        
        tableView.reloadData()
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        tableView.frame = bounds
    }
    
    // MARK: - UITableViewDataSource
    func numberOfSections(in tableView: UITableView) -> Int {
        // 2 секции: "On My iPhone" и "Other"
        return 2
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if section == 0 {
            return localCalendars.count
        } else {
            return otherCalendars.count
        }
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return (section == 0) ? "On My iPhone" : "Other"
    }
    
    func tableView(_ tableView: UITableView,
                   cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let calID = "CalendarCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: calID)
            ?? UITableViewCell(style: .subtitle, reuseIdentifier: calID)
        
        let calendar = (indexPath.section == 0) ?
            localCalendars[indexPath.row] :
            otherCalendars[indexPath.row]
        
        cell.textLabel?.text = calendar.title
        
        let switchView = UISwitch()
        switchView.isOn = viewModel.selectedCalendarIDs.contains(calendar.calendarIdentifier)
        
        // tag: за да разберем в didSelectRow (ако искате)
        switchView.tag = (indexPath.section * 1000) + indexPath.row
        
        switchView.addTarget(self, action: #selector(switchChanged(_:)), for: .valueChanged)
        cell.accessoryView = switchView
        
        return cell
    }
    
    @objc private func switchChanged(_ sender: UISwitch) {
        let section = sender.tag / 1000
        let row     = sender.tag % 1000
        
        let calendar = (section == 0) ?
            localCalendars[row] :
            otherCalendars[row]
        
        if sender.isOn {
            viewModel.selectedCalendarIDs.insert(calendar.calendarIdentifier)
        } else {
            viewModel.selectedCalendarIDs.remove(calendar.calendarIdentifier)
        }
    }
    
    // MARK: - UITableViewDelegate
    func tableView(_ tableView: UITableView,
                   didSelectRowAt indexPath: IndexPath) {
        // Ако искате при tap на ред без switch да toggle-вате
        if let cell = tableView.cellForRow(at: indexPath),
           let switchView = cell.accessoryView as? UISwitch {
            switchView.setOn(!switchView.isOn, animated: true)
            switchChanged(switchView)
        }
        tableView.deselectRow(at: indexPath, animated: true)
    }
}
