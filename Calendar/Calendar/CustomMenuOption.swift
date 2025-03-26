import UIKit
//
// MARK: - Custom Structures for the new Menu
//
struct CustomMenuOption {
    let title: String
    let icon: UIImage?
    var viewID: Int
}

final class CustomDropdownMenuView: UIView {
    
    private let tableView = UITableView()
    
    /// Масив с опциите, които ще покажем
    private var options: [CustomMenuOption] = []
    
    /// Индекс на текущо селектираната опция
    private var selectedIndex: Int = -1
    
    /// Callback, който ще извикаме при смяна на избрания елемент
    var onSelectionChanged: ((CustomMenuOption) -> Void)?
    
    init() {
        super.init(frame: .zero)
        backgroundColor = .systemBackground
        layer.borderColor = UIColor.lightGray.cgColor
        layer.borderWidth = 1
        layer.cornerRadius = 8
        layer.masksToBounds = true
        
        setupTableView()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupTableView() {
        addSubview(tableView)
        tableView.dataSource = self
        tableView.delegate   = self
        tableView.separatorStyle = .singleLine
        tableView.alwaysBounceVertical = false
        tableView.rowHeight = 44
        
        // Регистрация на cell
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cellID")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        tableView.frame = bounds
    }
    
    /// Подаваш опциите, които искаш да се виждат в dropdown-а
    func setOptions(_ opts: [CustomMenuOption], selectedViewID: Int) {
        self.options = opts
        // Откриваме кое viewID е избрано, за да го маркираме
        if let idx = options.firstIndex(where: { $0.viewID == selectedViewID }) {
            self.selectedIndex = idx
        } else {
            self.selectedIndex = -1
        }
        tableView.reloadData()
    }
    
    /// Пресмятаме колко да е височината спрямо броя редове
    func desiredHeight() -> CGFloat {
        let rowH = tableView.rowHeight
        return CGFloat(options.count) * rowH
    }
}

extension CustomDropdownMenuView: UITableViewDataSource, UITableViewDelegate {
    func tableView(_ tableView: UITableView,
                   numberOfRowsInSection section: Int) -> Int {
        return options.count
    }
    
    func tableView(_ tableView: UITableView,
                   cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(
            withIdentifier: "cellID",
            for: indexPath
        )
        let option = options[indexPath.row]
        
        // Име + икона
        cell.textLabel?.text = option.title
        cell.imageView?.image = option.icon
        
        // Премахваме системния стил на селекция, за да си управляваме сами оцветяването
        cell.selectionStyle = .none
        
        // Ако този ред е избраният, оцветяваме го в синьо
        if indexPath.row == selectedIndex {
            cell.backgroundColor = UIColor.systemBlue.withAlphaComponent(0.2)
        } else {
            cell.backgroundColor = .clear
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView,
                   didSelectRowAt indexPath: IndexPath) {
        // Запомняме кой индекс е избран
        selectedIndex = indexPath.row
        tableView.reloadData()
        
        // Викаме callback
        let selected = options[indexPath.row]
        onSelectionChanged?(selected)
    }
}
