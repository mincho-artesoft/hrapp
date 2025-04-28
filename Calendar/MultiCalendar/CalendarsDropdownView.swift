import UIKit
import EventKit


// MARK: - UIKit View
public class CalendarsDropdownView: UIView {
    
    private let scrollView = UIScrollView()
    private let stackView  = UIStackView()
    
    /// Ключ = calendarID
    /// Стойност = (title, color, selected, calendar)
    private var dict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
    
    public var onSelectionChanged: (([String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)]) -> Void)?
    
    public override init(frame: CGRect) {
        super.init(frame: frame)
        
        backgroundColor = .systemBackground
        layer.cornerRadius = 8
        layer.masksToBounds = true
        
        // Настройваме scrollView и stackView
        addSubview(scrollView)
        scrollView.addSubview(stackView)
        
        stackView.axis = .vertical
        stackView.alignment = .fill
        stackView.distribution = .equalSpacing
        
        // >>> Добавяме spacing и layoutMargins на stackView, за да има отстояния около редовете
        stackView.spacing = 12
        stackView.isLayoutMarginsRelativeArrangement = true
        // Тук контролирате горен/долен/ляв/десен отстъп
        stackView.layoutMargins = UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
        
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: bottomAnchor),
            
            // Ограничаваме stackView към contentLayoutGuide на scrollView
            stackView.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor),
            stackView.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor),
            stackView.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor),
            stackView.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor),
            
            // Ширината на stackView да е равна на frameLayoutGuide.width
            stackView.widthAnchor.constraint(equalTo: scrollView.frameLayoutGuide.widthAnchor)
        ])
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    public func setCalendarsInfo(_ newDict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)]) {
        self.dict = newDict
        reloadStackView()
    }
    
    private func reloadStackView() {
        // Премахваме старите под-views
        stackView.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        // Сортираме по заглавие
        let sortedTuples = dict.sorted { $0.value.title < $1.value.title }
        
        for (calID, info) in sortedTuples {
            let isSelected = info.selected
            let color      = info.color
            let title      = info.title
            
            // ─────────────
            // 1) containerView (pill shape)
            // ─────────────
            let containerView = UIView()
            containerView.isUserInteractionEnabled = true
            containerView.layer.cornerRadius = 16
            containerView.layer.masksToBounds = true
            
            // При селектиран календар – задаваме сив фон, иначе .clear
            containerView.backgroundColor = isSelected ? .systemGray5 : .clear
            
            // Тап Gesture, за да знаем върху кой календар е натиснато
            let tap = UITapGestureRecognizer(target: self, action: #selector(handleRowTap(_:)))
            containerView.addGestureRecognizer(tap)
            containerView.accessibilityIdentifier = calID
            
            // ─────────────
            // 2) вътрешен horizontal stack (иконката + лейбъла)
            // ─────────────
            let rowStack = UIStackView()
            rowStack.axis = .horizontal
            rowStack.alignment = .center
            // Можете да променяте spacing, ако искате да са по-близо/далече
            rowStack.spacing = 8
            
            // Добавяме вътрешни отстояния, за да не е тясно по вертикала
            rowStack.isLayoutMarginsRelativeArrangement = true
            rowStack.layoutMargins = UIEdgeInsets(top: 10, left: 12, bottom: 10, right: 12)
            
            containerView.addSubview(rowStack)
            
            // rowStack да запълва изцяло containerView
            rowStack.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                rowStack.topAnchor.constraint(equalTo: containerView.topAnchor),
                rowStack.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
                rowStack.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
                rowStack.bottomAnchor.constraint(equalTo: containerView.bottomAnchor)
            ])
            
            // Кръгче с цвета на календара
            let circleView = UIView()
            circleView.backgroundColor = color
            circleView.translatesAutoresizingMaskIntoConstraints = false
            circleView.widthAnchor.constraint(equalToConstant: 24).isActive = true
            circleView.heightAnchor.constraint(equalToConstant: 24).isActive = true
            circleView.layer.cornerRadius = 12
            circleView.layer.masksToBounds = true
            
            // Ако е селектиран – слагаме „✓“
            if isSelected {
                let checkmarkLabel = UILabel()
                checkmarkLabel.text = "✓"
                checkmarkLabel.textColor = .white
                checkmarkLabel.font = .systemFont(ofSize: 14, weight: .bold)
                checkmarkLabel.textAlignment = .center
                
                circleView.addSubview(checkmarkLabel)
                checkmarkLabel.translatesAutoresizingMaskIntoConstraints = false
                NSLayoutConstraint.activate([
                    checkmarkLabel.centerXAnchor.constraint(equalTo: circleView.centerXAnchor),
                    checkmarkLabel.centerYAnchor.constraint(equalTo: circleView.centerYAnchor)
                ])
            }
            
            let titleLabel = UILabel()
            titleLabel.text = title
            titleLabel.font = .systemFont(ofSize: 16, weight: .regular)
            titleLabel.textColor = .label
            
            // Добавяме кръгчето и лейбъла в rowStack
            rowStack.addArrangedSubview(circleView)
            rowStack.addArrangedSubview(titleLabel)
            
            // Добавяме готовия containerView в основния stackView
            stackView.addArrangedSubview(containerView)
        }
    }
    
    @objc private func handleRowTap(_ gesture: UITapGestureRecognizer) {
        guard
            let tappedView = gesture.view,
            let calID      = tappedView.accessibilityIdentifier
        else { return }
        
        // Обръщаме флага „selected“
        if let oldVal = dict[calID] {
            dict[calID] = (
                title:    oldVal.title,
                color:    oldVal.color,
                selected: !oldVal.selected,
                calendar: oldVal.calendar
            )
        }
        
        // 1) известяваме SwiftUI/ViewModel
        onSelectionChanged?(dict)
        
        // 2) (по желание) глобална нотификация
        NotificationCenter.default.post(name: .calendarsSelectionChanged, object: nil)
        
        // 3) презареждаме UI
        reloadStackView()
    }
    
    // (По желание) метод за пресмятане на оптимална височина
    public func desiredHeight() -> CGFloat {
        // Приблизителна сметка, ако искате да нагласите размера на самото View
        let rowHeight: CGFloat = 44
        let count = CGFloat(dict.count)
        return (count > 0) ? rowHeight * count : 0
    }
}
