import UIKit

final class CalendarsHeaderView: UIView {
    /// Данни за всеки календар: [calendarID: (title, color, selected)]
    var calendarsDict: [String: (title: String, color: UIColor, selected: Bool)] = [:] {
        didSet {
            rebuildSubviews()
        }
    }
    
    /// Базова (минимална) ширина на колона, ползва се ако имаме >= 4 колони
    var defaultColumnWidth: CGFloat = 100
    
    // Масив от UILabel за визуализация
    private var labelViews: [UILabel] = []
    
    // Инициализатори – тук задаваме бял фон и isOpaque = true
    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .white
        isOpaque = true
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .white
        isOpaque = true
    }

    private func rebuildSubviews() {
        // 1) Remove old labels
        labelViews.forEach { $0.removeFromSuperview() }
        labelViews = []

        // 2) Build an array of calendars that are "to show"
        let selectedCals = calendarsDict.filter { $0.value.selected }
        let calsToDraw: [(String, (title: String, color: UIColor, selected: Bool))]
        if selectedCals.isEmpty {
            // none selected => show all
            calsToDraw = Array(calendarsDict)
        } else {
            calsToDraw = Array(selectedCals)
        }

        // 3) SORT them by .title
        let sortedCals = calsToDraw.sorted { $0.1.title < $1.1.title }

        // 4) Create UILabels for each, in sorted order
        for (_, info) in sortedCals {
            let label = UILabel()
            label.text = info.title
            label.textAlignment = .center
            label.backgroundColor = info.color.withAlphaComponent(0.15)
            // etc.
            addSubview(label)
            labelViews.append(label)
        }

        setNeedsLayout()
        setNeedsDisplay()
    }

    
    override func layoutSubviews() {
        super.layoutSubviews()
        
        let count = labelViews.count
        guard count > 0 else { return }
        
        let totalWidth = bounds.width
        let isLandscape = bounds.width > bounds.height

        // Ако колoните са 4 или повече -> фиксирана ширина
        // Ако са < 4 -> разпределяме по цялата ширина
        let actualColumnWidth: CGFloat
        if isLandscape{
            if count < 7 {
                actualColumnWidth = totalWidth / CGFloat(count)
            } else {
                if calendarsDict.values.filter({ $0.selected }).count > 0{
                    actualColumnWidth = defaultColumnWidth
                }else {
                    actualColumnWidth = totalWidth / CGFloat(count)
                }
            }
        }else{
            if count < 4 {
                actualColumnWidth = totalWidth / CGFloat(count)
            } else {
                if calendarsDict.values.filter({ $0.selected }).count > 0{
                    actualColumnWidth = defaultColumnWidth}
                else{
                    actualColumnWidth = totalWidth / CGFloat(count)
                }
            }
        }
        
        
        for (index, lbl) in labelViews.enumerated() {
            let xPos = CGFloat(index) * actualColumnWidth
            lbl.frame = CGRect(
                x: xPos,
                y: 0,
                width: actualColumnWidth,
                height: bounds.height
            )
        }
        
        if let scrollView = superview as? UIScrollView {
            let contentW = CGFloat(count) * actualColumnWidth
            scrollView.contentSize = CGSize(width: contentW, height: bounds.height)
        }
    }
    
    override func draw(_ rect: CGRect) {
        super.draw(rect)
        
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        
        // (1) Изчистваме (запълваме) фона, за да не наслагваме стари линии
        // Ако backgroundColor ни е бял и isOpaque = true,
        // това може и да не е задължително, но е "по-сигурно".
        UIColor.white.setFill()
        ctx.fill(rect)
        
        // (2) Задаваме тънка (1 px) линия и цвят
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        UIColor.lightGray.setStroke()
        
        // (3) Чертаме линия в началото на всеки (без първия) label
        if labelViews.count > 0{
            for i in 1..<labelViews.count {
                // По желание може да подравняваме xPos към пиксел:
                let xPos = round(labelViews[i].frame.minX * UIScreen.main.scale) / UIScreen.main.scale
                
                ctx.move(to: CGPoint(x: xPos, y: 0))
                ctx.addLine(to: CGPoint(x: xPos, y: bounds.height))
                ctx.strokePath()
            }
        }
    }
}
