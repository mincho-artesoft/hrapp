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
    
    // Инициализатори – тук задаваме фон от secondarySystemBackground и isOpaque = true
    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .secondarySystemBackground
        isOpaque = true
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .secondarySystemBackground
        isOpaque = true
    }

    private func rebuildSubviews() {
        // 1) Премахваме старите labels
        labelViews.forEach { $0.removeFromSuperview() }
        labelViews = []

        // 2) Избираме календарите, които трябва да се покажат
        let selectedCals = calendarsDict.filter { $0.value.selected }
        let calsToDraw: [(String, (title: String, color: UIColor, selected: Bool))]
        if selectedCals.isEmpty {
            // ако няма селектирани -> показваме всички
            calsToDraw = Array(calendarsDict)
        } else {
            calsToDraw = Array(selectedCals)
        }

        // 3) Сортираме ги по .title
        let sortedCals = calsToDraw.sorted { $0.1.title < $1.1.title }

        // 4) Създаваме UILabel за всеки, в сортиран ред
        for (_, info) in sortedCals {
            let label = UILabel()
            label.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
            label.text = info.title
            label.textAlignment = .center
//            label.layer.cornerRadius = 8
//            label.layer.masksToBounds = true
            label.textColor = info.color
            label.backgroundColor = .secondarySystemBackground
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

        // Ако колоните са 4 или повече -> фиксирана ширина
        // Ако са < 4 -> разпределяме по цялата ширина
        let actualColumnWidth: CGFloat
        if isLandscape {
            if count < 7 {
                actualColumnWidth = totalWidth / CGFloat(count)
            } else {
                if calendarsDict.values.filter({ $0.selected }).count > 0 {
                    actualColumnWidth = defaultColumnWidth
                } else {
                    actualColumnWidth = totalWidth / CGFloat(count)
                }
            }
        } else {
            if count < 4 {
                actualColumnWidth = totalWidth / CGFloat(count)
            } else {
                if calendarsDict.values.filter({ $0.selected }).count > 0 {
                    actualColumnWidth = defaultColumnWidth
                } else {
                    actualColumnWidth = totalWidth / CGFloat(count)
                }
            }
        }
        
        for (index, lbl) in labelViews.enumerated() {
            let xPos = CGFloat(index) * actualColumnWidth
            lbl.frame = CGRect(
                x: xPos /*+ 1.5*/,
                y: 0,
                width: actualColumnWidth /*- 3*/,
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
        
        // (1) Изчистваме фона, като го запълваме с secondarySystemBackground,
        // за да не наслагваме стари линии
        UIColor.secondarySystemBackground.setFill()
        ctx.fill(rect)
        
        // (2) Задаваме тънка (1 px) линия и цвят
        ctx.setLineWidth(1.0 / UIScreen.main.scale)
        UIColor.lightGray.setStroke()
        
        // (3) Чертаме линия в началото на всеки (без първия) label
        if labelViews.count > 0 {
            for i in 1..<labelViews.count {
                let xPos = round(labelViews[i].frame.minX * UIScreen.main.scale) / UIScreen.main.scale
                ctx.move(to: CGPoint(x: xPos, y: 0))
                ctx.addLine(to: CGPoint(x: xPos, y: bounds.height))
                ctx.strokePath()
            }
        }
    }
}
