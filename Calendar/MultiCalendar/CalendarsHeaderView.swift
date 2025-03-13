import UIKit


//============================================================
// MARK: - CalendarsHeaderView
//============================================================

final class CalendarsHeaderView: UIView {
    /// Данни за всеки календар: [calendarID: (title, color, selected)]
    var calendarsDict: [String: (title: String, color: UIColor, selected: Bool)] = [:] {
        didSet {
            rebuildSubviews()
        }
    }
    
    /// Ширина на всяка колона в хедъра
    var columnWidth: CGFloat = 100
    
    // Масив от UILabel за визуализация
    private var labelViews: [UILabel] = []
    
    private func rebuildSubviews() {
        // 1) Махаме старите
        labelViews.forEach { $0.removeFromSuperview() }
        labelViews = []
        
        // 2) Създаваме по 1 UILabel за всеки календар
        for (_, info) in calendarsDict {
            let label = UILabel()
            label.textAlignment = .center
            label.text = info.title
            label.textColor = .label
            
            // За да визуализираме кой цвят има календарът,
            // може да оцветим фона в лек оттенък на info.color
            label.backgroundColor = info.color.withAlphaComponent(0.15)
            
            // Или да сложим border — примерно
            label.layer.borderColor = info.color.cgColor
            label.layer.borderWidth = info.selected ? 2 : 1
            
            // Ако не е селектиран, намаляме alpha
            if !info.selected {
                label.alpha = 0.5
            }
            
            addSubview(label)
            labelViews.append(label)
        }
        
        setNeedsLayout()
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        // Всеки label се подрежда хоризонтално, с фиксирана columnWidth
        for (index, lbl) in labelViews.enumerated() {
            let xPos = CGFloat(index) * columnWidth
            lbl.frame = CGRect(
                x: xPos,
                y: 0,
                width: columnWidth,
                height: bounds.height
            )
        }
    }
}
