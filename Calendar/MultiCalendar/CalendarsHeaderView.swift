import UIKit

@MainActor
func arrangedForLayoutDirection<Element>(_ values: [Element], in view: UIView) -> [Element] {
    view.effectiveUserInterfaceLayoutDirection == .rightToLeft
        ? Array(values.reversed())
        : values
}

final class CalendarsHeaderView: UIView {
    private struct CalendarHeaderState: Equatable {
        let id: String
        let title: String
        let color: String
        let selected: Bool
    }

    private var displayedSnapshot: [CalendarHeaderState] = []
    private var displayedLayoutDirection: UIUserInterfaceLayoutDirection?

    /// Данни за всеки календар: [calendarID: (title, color, selected)]
    var calendarsDict: [String: MultiCalendarInfo] = [:] {
        didSet {
            let newSnapshot = snapshot(of: calendarsDict)
            guard newSnapshot != displayedSnapshot else { return }
            displayedSnapshot = newSnapshot
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

    private func snapshot(of value: [String: MultiCalendarInfo]) -> [CalendarHeaderState] {
        value.map { id, info in
            let color = info.color.cgColor.components?
                .map { String(format: "%.4f", Double($0)) }
                .joined(separator: ",") ?? info.color.description
            return CalendarHeaderState(
                id: id,
                title: info.title,
                color: color,
                selected: info.selected
            )
        }
        .sorted { $0.id < $1.id }
    }

    private func rebuildSubviews() {
        displayedLayoutDirection = effectiveUserInterfaceLayoutDirection
        // 1) Премахваме старите labels
        labelViews.forEach { $0.removeFromSuperview() }
        labelViews = []

        // 2) Избираме календарите, които трябва да се покажат
        let selectedCals = calendarsDict.filter { $0.value.selected }
        let calsToDraw: [(String, MultiCalendarInfo)]
        if selectedCals.isEmpty {
            // ако няма селектирани -> показваме всички
            calsToDraw = Array(calendarsDict)
        } else {
            calsToDraw = Array(selectedCals)
        }

        // 3) Сортираме ги по .title
        let sortedCals = arrangedForLayoutDirection(
            calsToDraw.sorted(by: MultiCalendarInfo.orderedBefore),
            in: self
        )

        // 4) Създаваме UILabel за всеки, в сортиран ред
        for (id, info) in sortedCals {
            let label = UILabel()
            label.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
            label.text = info.title
            label.accessibilityIdentifier = "calendar-column:" + id
            label.textAlignment = .center
            label.useAdaptiveSingleLine(minimumScale: 0.4)
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
        if displayedLayoutDirection != effectiveUserInterfaceLayoutDirection { rebuildSubviews() }
        
        let count = labelViews.count
        guard count > 0 else { return }
        
        let totalWidth = bounds.width
        // The container owns content width and synchronized scrolling.
        let actualColumnWidth = totalWidth / CGFloat(count)
        
        for (index, lbl) in labelViews.enumerated() {
            let xPos = CGFloat(index) * actualColumnWidth
            lbl.frame = CGRect(
                x: xPos + 4,
                y: 0,
                width: max(0, actualColumnWidth - 8),
                height: bounds.height
            )
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
