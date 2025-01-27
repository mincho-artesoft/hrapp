import UIKit

public final class HoursColumnView: UIView {

    public var hourHeight: CGFloat = 50
    public var font = UIFont.systemFont(ofSize: 12, weight: .medium)
    public var topOffset: CGFloat = 0

    /// true → червеният час се показва, false → не се показва
    public var isCurrentDayInWeek: Bool = false

    /// Ако не е nil, червеният текст (2:13 PM) ще се изрисува
    public var currentTime: Date? = nil

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .white
    }
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .white
    }

    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let cal = Calendar.current
        let baseDate = cal.startOfDay(for: Date())

        let blackAttrs: [NSAttributedString.Key: Any] = [
            .foregroundColor: UIColor.label,
            .font: font
        ]

        // (1) Ако сме в текущата седмица и currentTime != nil → подготвяме "червен" час
        var currentTimeRect: CGRect? = nil
        if isCurrentDayInWeek, let now = currentTime {
            let hour = CGFloat(cal.component(.hour, from: now))
            let minute = CGFloat(cal.component(.minute, from: now))
            let fraction = hour + minute/60
            let yNow = topOffset + fraction * hourHeight

            let fmt = DateFormatter()
            fmt.timeStyle = .short
            let nowStr = fmt.string(from: now)

            let redAttrs: [NSAttributedString.Key: Any] = [
                .foregroundColor: UIColor.systemRed,
                .font: UIFont.systemFont(ofSize: 12, weight: .semibold)
            ]
            let size = nowStr.size(withAttributes: redAttrs)
            let textX: CGFloat = 8
            let textY: CGFloat = yNow - size.height/2
            currentTimeRect = CGRect(x: textX, y: textY, width: size.width, height: size.height)
        }

        // (2) Рисуваме 0..24 часа (в черно)
        for hour in 0...24 {
            let y = topOffset + CGFloat(hour)*hourHeight
            guard let date = cal.date(byAdding: .hour, value: hour, to: baseDate) else { continue }

            let df = DateFormatter()
            df.dateFormat = "h:00 a"
            let text = df.string(from: date)
            let size = text.size(withAttributes: blackAttrs)
            let textRect = CGRect(x: 8, y: y - size.height/2,
                                  width: size.width, height: size.height)

            // Ако се застъпва с червеното → пропускаме
            if let cRect = currentTimeRect, textRect.intersects(cRect) {
                continue
            }
            text.draw(in: textRect, withAttributes: blackAttrs)
        }

        // (3) Червеният час (ако е зададен)
        if isCurrentDayInWeek, let cRect = currentTimeRect, let now = currentTime {
            let fmt = DateFormatter()
            fmt.timeStyle = .short
            let nowStr = fmt.string(from: now)

            let redAttrs: [NSAttributedString.Key: Any] = [
                .foregroundColor: UIColor.systemRed,
                .font: UIFont.systemFont(ofSize: 12, weight: .semibold)
            ]
            nowStr.draw(in: cRect, withAttributes: redAttrs)
        }
    }
}
