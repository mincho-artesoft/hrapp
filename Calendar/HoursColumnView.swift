import UIKit

/// Лявата колона, в която се изписват часовете.
public final class HoursColumnView: UIView {

    /// Колко точки (pt) е височината на 1 час.
    public var hourHeight: CGFloat = 50

    /// Ако true -> рисуваме на всеки 5 мин; иначе -> само на всеки кръгъл час.
    public var isEventSelected: Bool = false {
        didSet {
            setNeedsDisplay()  // при промяна - презареждаме
        }
    }

    /// Флаг дали днешният ден е в текущата седмица (за да рисуваме червена линия).
    public var isCurrentDayInWeek: Bool = false

    /// Ако `isCurrentDayInWeek == true`, тук пазим "сега" (`Date`).
    public var currentTime: Date?

    /// Опционален offset, ако имате горна зона за all-day (напр. 40 px).
    public var topOffset: CGFloat = 0

    private let timeFactory = TimeStringsFactory()

    // Двата набора от часови маркери:
    private let timeMarksHourly: [String]
    private let timeMarks5Min: [String]

    // MARK: - Init
    public override init(frame: CGRect) {
        // Генерираме предварително двата масива
        self.timeMarksHourly = timeFactory.makeHourlyStrings24h()
        self.timeMarks5Min   = timeFactory.make5MinStrings24h()
        super.init(frame: frame)
        backgroundColor = .systemBackground
    }

    public required init?(coder: NSCoder) {
        self.timeMarksHourly = timeFactory.makeHourlyStrings24h()
        self.timeMarks5Min   = timeFactory.make5MinStrings24h()
        super.init(coder: coder)
        backgroundColor = .systemBackground
    }

    // MARK: - Draw
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        // Избираме кой масив да ползваме:
        let activeMarks = isEventSelected ? timeMarks5Min : timeMarksHourly

        // Ако рисуваме през 5 мин -> 288 записа (00:00..23:55).
        // Ако рисуваме през час -> 25 записа (00:00..24:00) или 24, според предпочитания.
        let count = CGFloat(activeMarks.count)
        
        // 24 часа = 24 * hourHeight точки.
        // Разстояние между всяка стъпка: (24 * hourHeight) / (count - 1)
        // (ако има 25 точки за 24 ч, значи 24 интервала)
        let dayHeight = 24.0 * hourHeight
        let stepHeight = dayHeight / max(1, (count - 1))

        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.alignment = .right

        let textAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 10),
            .foregroundColor: UIColor.label,
            .paragraphStyle: paragraphStyle
        ]

        for (i, timeString) in activeMarks.enumerated() {
            let y = CGFloat(i) * stepHeight

            // (А) По желание - рисуваме хоризонтална линия
            ctx.saveGState()
            ctx.setStrokeColor(UIColor.lightGray.withAlphaComponent(0.3).cgColor)
            ctx.setLineWidth(1.0 / UIScreen.main.scale)
            ctx.move(to: CGPoint(x: 0, y: y))
            ctx.addLine(to: CGPoint(x: rect.width, y: y))
            ctx.strokePath()
            ctx.restoreGState()

            // (Б) Рисуваме текст
            let textRect = CGRect(x: 0,
                                  y: y - 5,
                                  width: rect.width - 2,
                                  height: 10)
            timeString.draw(in: textRect, withAttributes: textAttrs)
        }

        // (В) Ако е текущ ден, рисуваме червена линия за "сега"
        if isCurrentDayInWeek, let curr = currentTime {
            let cal = Calendar.current
            let hour = CGFloat(cal.component(.hour, from: curr))
            let minute = CGFloat(cal.component(.minute, from: curr))
            let fraction = hour + minute/60.0

            let yNow = fraction * hourHeight
            ctx.saveGState()
            ctx.setStrokeColor(UIColor.systemRed.cgColor)
            ctx.setLineWidth(1.5)
            ctx.move(to: CGPoint(x: 0, y: yNow))
            ctx.addLine(to: CGPoint(x: rect.width, y: yNow))
            ctx.strokePath()
            ctx.restoreGState()
        }
    }
}
