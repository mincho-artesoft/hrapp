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

    public var bottomContentInset: CGFloat = 0 {
        didSet {
            scrollView.contentInset.bottom = bottomContentInset
            scrollView.verticalScrollIndicatorInsets.bottom = bottomContentInset
        }
    }
    
    public override init(frame: CGRect) {
        super.init(frame: frame)
        
        backgroundColor = .systemBackground.withAlphaComponent(0.6)
        layer.cornerRadius = 8
        layer.masksToBounds = true
        
        // Настройваме scrollView и stackView
        addSubview(scrollView)
        scrollView.addSubview(stackView)
        
        stackView.axis = .vertical
        stackView.alignment = .fill
        stackView.distribution = .equalSpacing
        
        stackView.spacing = 12
        stackView.isLayoutMarginsRelativeArrangement = true
        stackView.layoutMargins = UIEdgeInsets(
            top: DraggableMenuContentLayout.verticalInset,
            left: DraggableMenuContentLayout.horizontalInset,
            bottom: DraggableMenuContentLayout.verticalInset,
            right: DraggableMenuContentLayout.horizontalInset
        )
        
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        stackView.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: bottomAnchor),
            
            stackView.topAnchor.constraint(equalTo: scrollView.contentLayoutGuide.topAnchor),
            stackView.leadingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.leadingAnchor),
            stackView.trailingAnchor.constraint(equalTo: scrollView.contentLayoutGuide.trailingAnchor),
            stackView.bottomAnchor.constraint(equalTo: scrollView.contentLayoutGuide.bottomAnchor),
            
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
        stackView.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        let sortedTuples = dict.sorted { $0.value.title < $1.value.title }
        
        for (calID, info) in sortedTuples {
            let isSelected = info.selected
            let color      = info.color
            let title      = info.title
            
            let containerView = UIView()
            containerView.isUserInteractionEnabled = true
            containerView.layer.cornerRadius = 16
            containerView.layer.masksToBounds = true
            containerView.backgroundColor = isSelected ? .systemGray5 : .clear
            
            let tap = UITapGestureRecognizer(target: self, action: #selector(handleRowTap(_:)))
            containerView.addGestureRecognizer(tap)
            containerView.accessibilityIdentifier = calID
            
            let rowStack = UIStackView()
            rowStack.axis = .horizontal
            rowStack.alignment = .center
            rowStack.spacing = 8
            rowStack.isLayoutMarginsRelativeArrangement = true
            rowStack.layoutMargins = UIEdgeInsets(top: 10, left: 12, bottom: 10, right: 12)
            
            containerView.addSubview(rowStack)
            rowStack.translatesAutoresizingMaskIntoConstraints = false
            NSLayoutConstraint.activate([
                rowStack.topAnchor.constraint(equalTo: containerView.topAnchor),
                rowStack.leadingAnchor.constraint(equalTo: containerView.leadingAnchor),
                rowStack.trailingAnchor.constraint(equalTo: containerView.trailingAnchor),
                rowStack.bottomAnchor.constraint(equalTo: containerView.bottomAnchor),
            ])
            
            let circleView = UIView()
            circleView.backgroundColor = color
            circleView.translatesAutoresizingMaskIntoConstraints = false
            circleView.widthAnchor.constraint(equalToConstant: 24).isActive = true
            circleView.heightAnchor.constraint(equalToConstant: 24).isActive = true
            circleView.layer.cornerRadius = 12
            circleView.layer.masksToBounds = true
            
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
            titleLabel.useAdaptiveSingleLine(minimumScale: 0.45)
            titleLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
            
            rowStack.addArrangedSubview(circleView)
            rowStack.addArrangedSubview(titleLabel)
            
            stackView.addArrangedSubview(containerView)
        }
    }
    
    @objc private func handleRowTap(_ gesture: UITapGestureRecognizer) {
        guard
            let tappedView = gesture.view,
            let calID      = tappedView.accessibilityIdentifier
        else { return }
        
        // Променяме флага selected
        if let oldVal = dict[calID] {
            dict[calID] = (
                title:    oldVal.title,
                color:    oldVal.color,
                selected: !oldVal.selected,
                calendar: oldVal.calendar
            )
        }
        
        // 1) Callback към SwiftUI/ViewModel
        onSelectionChanged?(dict)
        
        // 2) Вдигаме глобална нотификация
        //    (ТУК Е КЛЮЧОВАТА ПРОМЯНА, ако не е било сложено досега)
        NotificationCenter.default.post(name: .calendarsSelectionChanged, object: nil)
        
        // 3) Презареждаме UI на dropdown
        reloadStackView()
    }
    
    public func desiredHeight() -> CGFloat {
        let rowHeight: CGFloat = 44
        let count = CGFloat(dict.count)
        return (count > 0) ? rowHeight * count : 0
    }
}
