import UIKit

final class DigitsDropdownView: UIView, UITableViewDataSource, UITableViewDelegate {

    private let containerView = UIView()
    private let tableView = UITableView(frame: .zero, style: .plain)
    
    var selectedDigits = Set<Int>() {
        didSet {
            tableView.reloadData()
        }
    }
    
    var onSelectionChanged: ((Set<Int>) -> Void)?

    override init(frame: CGRect) {
        super.init(frame: frame)
        
        backgroundColor = .clear

        containerView.backgroundColor = .systemBackground
        containerView.layer.cornerRadius = 12
        containerView.layer.masksToBounds = false
        containerView.layer.shadowColor   = UIColor.black.cgColor
        containerView.layer.shadowOpacity = 0.2
        containerView.layer.shadowOffset  = CGSize(width: 2, height: 2)
        containerView.layer.shadowRadius  = 4
        
        addSubview(containerView)

        tableView.dataSource = self
        tableView.delegate   = self
        
        // Махаме празни редове в края
        tableView.tableFooterView = UIView()
        
        // Сепараторите да са от край до край
        tableView.separatorInset = .zero
        tableView.layoutMargins = .zero
        tableView.cellLayoutMarginsFollowReadableWidth = false
        
        // Заоблени ъгли, ако искате и редовете да са "отрязани":
        tableView.layer.cornerRadius = 12
        tableView.clipsToBounds      = true
        
        containerView.addSubview(tableView)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        containerView.frame = bounds
        tableView.frame     = containerView.bounds
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - UITableViewDataSource
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 10 // Цифри от 1 до 10
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let digit = indexPath.row + 1
        
        // Може да си пазите reuseIdentifier, но за краткост ще ползваме nil
        let cell = UITableViewCell(style: .default, reuseIdentifier: nil)
        
        cell.textLabel?.text = "Цифра \(digit)"
        
        // Няма accessoryType, защото checkmark винаги отива вдясно
        cell.accessoryType = .none
        
        // Ще ползваме системна икона "checkmark" и при необходимост я правим прозрачна.
        // Така запазваме винаги същата рамка за изображението и текстът не „подскача“.
        
        if selectedDigits.contains(digit) {
            // Показваме нормално checkmark
            cell.imageView?.image = UIImage(systemName: "checkmark")
            cell.imageView?.tintColor = .label // или както искате
        } else {
            // Слагаме същата икона, но оцветена в clear, за да бъде „невидима“
            // (или може да ползвате UIImage() с фиксирани размери, стига да са същите)
            let checkmark = UIImage(systemName: "checkmark")?.withRenderingMode(.alwaysTemplate)
            cell.imageView?.image = checkmark
            cell.imageView?.tintColor = .clear
        }
        
        // Махаме вътрешните inset-ове на клетката:
        cell.separatorInset = .zero
        cell.layoutMargins  = .zero
        
        return cell
    }
    
    // MARK: - UITableViewDelegate
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let digit = indexPath.row + 1
        
        // Ако вече е селектирано – махаме, иначе добавяме
        if selectedDigits.contains(digit) {
            selectedDigits.remove(digit)
        } else {
            selectedDigits.insert(digit)
        }
        
        // Анимирано презареждане само на конкретния ред
        tableView.reloadRows(at: [indexPath], with: .automatic)
        
        onSelectionChanged?(selectedDigits)
    }
}
