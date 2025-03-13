import UIKit

//
// MARK: - CalendarsDropdownView (title, color, selected)
//
public class CalendarsDropdownView: UIView {
    
    private let stackView = UIStackView()
    
    // Ключ = calendarID
    // Стойност = (title, color, selected)
    private var dict: [String: (title: String, color: UIColor, selected: Bool)] = [:]
    
    public var onSelectionChanged: (([String: (title: String, color: UIColor, selected: Bool)]) -> Void)?
    
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .secondarySystemBackground
        layer.cornerRadius = 8
        layer.masksToBounds = true
        
        stackView.axis = .vertical
        stackView.alignment = .fill
        stackView.distribution = .equalSpacing
        addSubview(stackView)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    public override func layoutSubviews() {
        super.layoutSubviews()
        stackView.frame = bounds
    }
    
    public func setCalendarsInfo(_ newDict: [String: (title: String, color: UIColor, selected: Bool)]) {
        self.dict = newDict
        reloadStackView()
    }
    
    private func reloadStackView() {
        stackView.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        // Сортираме по calendarTitle, примерно
        let sortedItems = dict.values.sorted {
            $0.title < $1.title
        }
        
        // Но тук губим ключа (calendarID). Ако искате да запазите ключа, направете масив от tuples (key, value).
        // Пример:
        let sortedTuples = dict.sorted { $0.value.title < $1.value.title }
        
        for (calID, info) in sortedTuples {
            let isSelected = info.selected
            let color      = info.color
            let title      = info.title
            
            let label = UILabel()
            label.font = .systemFont(ofSize: 16, weight: .medium)
            label.textColor = color  // Оцветяваме текста в цвета на календара
            
            let checkmark = isSelected ? "✓ " : ""
            label.text = checkmark + title
            
            label.isUserInteractionEnabled = true
            let tap = UITapGestureRecognizer(target: self, action: #selector(handleLabelTap(_:)))
            label.addGestureRecognizer(tap)
            
            // Запазваме ключа (calendarID) в label
            label.accessibilityIdentifier = calID
            
            // Разделител отдолу (по желание)
            let separator = UIView()
            separator.backgroundColor = .lightGray
            separator.translatesAutoresizingMaskIntoConstraints = false
            label.addSubview(separator)
            NSLayoutConstraint.activate([
                separator.leadingAnchor.constraint(equalTo: label.leadingAnchor),
                separator.trailingAnchor.constraint(equalTo: label.trailingAnchor),
                separator.bottomAnchor.constraint(equalTo: label.bottomAnchor),
                separator.heightAnchor.constraint(equalToConstant: 0.5)
            ])
            
            stackView.addArrangedSubview(label)
        }
    }
    
    @objc private func handleLabelTap(_ gesture: UITapGestureRecognizer) {
        guard let label = gesture.view as? UILabel,
              let calID = label.accessibilityIdentifier else {
            return
        }
        
        // Обръщаме флага
        if let oldVal = dict[calID] {
            dict[calID] = (
                title: oldVal.title,
                color: oldVal.color,
                selected: !oldVal.selected
            )
        }
        
        // Уведомяваме
        onSelectionChanged?(dict)
        
        // Презареждаме
        reloadStackView()
    }
    
    // Примерна височина
    public func desiredHeight() -> CGFloat {
        let rowHeight: CGFloat = 44
        return rowHeight * CGFloat(dict.count)
    }
}
