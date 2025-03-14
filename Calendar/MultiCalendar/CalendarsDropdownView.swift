import UIKit

public class CalendarsDropdownView: UIView {
    
    private let stackView = UIStackView()
    
    // Ключ = calendarID
    // Стойност = (title, color, selected)
    private var dict: [String: (title: String, color: UIColor, selected: Bool)] = [:]
    
    public var onSelectionChanged: (([String: (title: String, color: UIColor, selected: Bool)]) -> Void)?
    
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .systemBackground
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
        // Премахваме старите под-views
        stackView.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        // Сортираме по заглавие
        let sortedTuples = dict.sorted { $0.value.title < $1.value.title }
        
        for (index, (calID, info)) in sortedTuples.enumerated() {
            let isSelected = info.selected
            let color      = info.color
            let title      = info.title
            
            // Хоризонтален stack за целия ред
            let rowStack = UIStackView()
            rowStack.axis = .horizontal
            rowStack.alignment = .center
            rowStack.spacing = 8
            rowStack.isLayoutMarginsRelativeArrangement = true
            // Настройваме отстоянията, може да ги коригирате по желание
            rowStack.layoutMargins = UIEdgeInsets(top: 8, left: 12, bottom: 8, right: 12)
            
            // Кръг с желания цвят
            let circleView = UIView()
            circleView.backgroundColor = color
            circleView.translatesAutoresizingMaskIntoConstraints = false
            circleView.widthAnchor.constraint(equalToConstant: 24).isActive = true
            circleView.heightAnchor.constraint(equalToConstant: 24).isActive = true
            circleView.layer.cornerRadius = 12
            circleView.layer.masksToBounds = true
            
            // Ако е селектиран, слагаме "✓" вътре
            if isSelected {
                let checkmarkLabel = UILabel()
                checkmarkLabel.text = "✓"
                checkmarkLabel.textColor = .white
                checkmarkLabel.font = .systemFont(ofSize: 16, weight: .bold)
                checkmarkLabel.textAlignment = .center
                
                circleView.addSubview(checkmarkLabel)
                // Центрираме "✓" в кръга
                checkmarkLabel.translatesAutoresizingMaskIntoConstraints = false
                NSLayoutConstraint.activate([
                    checkmarkLabel.centerXAnchor.constraint(equalTo: circleView.centerXAnchor),
                    checkmarkLabel.centerYAnchor.constraint(equalTo: circleView.centerYAnchor)
                ])
            }
            
            // UILabel за името на календара
            let titleLabel = UILabel()
            titleLabel.text = title
            titleLabel.font = .systemFont(ofSize: 16, weight: .regular)
            titleLabel.textColor = .label
            
            // Добавяме в rowStack: първо кръга, после текста
            rowStack.addArrangedSubview(circleView)
            rowStack.addArrangedSubview(titleLabel)
            
            // За „тап“ върху целия ред
            rowStack.isUserInteractionEnabled = true
            let tap = UITapGestureRecognizer(target: self, action: #selector(handleRowTap(_:)))
            rowStack.addGestureRecognizer(tap)
            
            // Запаметяваме calID, за да го разпознаем при тап
            rowStack.accessibilityIdentifier = calID
            
            // Добавяме самия rowStack
            stackView.addArrangedSubview(rowStack)
            
            // Ако това не е последният ред, добавяме разделител (тънка сива линия)
            if index < sortedTuples.count - 1 {
                let separator = UIView()
                separator.backgroundColor = .lightGray
                separator.translatesAutoresizingMaskIntoConstraints = false
                
                // Съзнателно го правим с фиксирана височина
                separator.heightAnchor.constraint(equalToConstant: 0.5).isActive = true
                // Добавяме го в stackView, така че да стои между редовете
                stackView.addArrangedSubview(separator)
            }
        }
    }
    
    @objc private func handleRowTap(_ gesture: UITapGestureRecognizer) {
        guard let rowStack = gesture.view as? UIStackView,
              let calID = rowStack.accessibilityIdentifier else {
            return
        }
        
        // Обръщаме флага "selected"
        if let oldVal = dict[calID] {
            dict[calID] = (
                title: oldVal.title,
                color: oldVal.color,
                selected: !oldVal.selected
            )
        }
        
        // Известяваме, че има промяна
        onSelectionChanged?(dict)
        
        // Презареждаме изгледа, за да опресним checkmark-овете
        reloadStackView()
    }
    
    // Примерна височина
    public func desiredHeight() -> CGFloat {
        // Приемаме, че всеки ред е 44 т. височина + 0.5 т. за линията (между редовете).
        // Но тъй като последният ред няма линия, общо = редове * 44 + (редове - 1) * 0.5
        let rowHeight: CGFloat = 44
        let lineHeight: CGFloat = 0.5
        
        let count = CGFloat(dict.count)
        if count > 0 {
            return rowHeight * count + lineHeight * (count - 1)
        } else {
            return 0
        }
    }
}
