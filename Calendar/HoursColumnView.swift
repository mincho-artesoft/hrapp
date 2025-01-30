import UIKit

public final class HoursColumnView: UIView {
    public var hourHeight: CGFloat = 50
    public var topOffset: CGFloat = 0

    public var isCurrentDayInWeek: Bool = false
    public var currentTime: Date?

    /// Показваме само една отметка (hour, minute). Ако е nil, не рисуваме.
    public var selectedMinuteMark: (hour: Int, minute: Int)?

    private let majorFont = UIFont.systemFont(ofSize: 11, weight: .medium)
    private let majorColor = UIColor.darkText

    private let minorFont = UIFont.systemFont(ofSize: 10, weight: .regular)
    private let minorColor = UIColor.darkGray.withAlphaComponent(0.8)

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .white
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .white
    }

    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        // 1) Рисуваме целите часове 0..24
        for hour in 0...24 {
            let y = topOffset + CGFloat(hour)*hourHeight

            ctx.setStrokeColor(UIColor.lightGray.cgColor)
            ctx.setLineWidth(0.5)
            ctx.move(to: CGPoint(x: bounds.width - 5, y: y))
            ctx.addLine(to: CGPoint(x: bounds.width,     y: y))
            ctx.strokePath()

            let hourStr = hourString12HourFormat(hour)
            let attrStr = NSAttributedString(
                string: hourStr,
                attributes: [
                    .font: majorFont,
                    .foregroundColor: majorColor
                ]
            )
            let size = attrStr.size()
            let textX = bounds.width - size.width - 4
            let textY = y - size.height/2
            attrStr.draw(at: CGPoint(x: textX, y: textY))
        }

        // 2) ЕДНА отметка (hour, minute), ако е зададена
        if let mark = selectedMinuteMark {
            let h = mark.hour
            let m = mark.minute
            if h >= 0 && h < 24 && m > 0 && m < 60 {
                let baseY = topOffset + CGFloat(h)*hourHeight
                let fraction = CGFloat(m)/60.0
                let yPos = baseY + fraction*hourHeight

                let minuteStr = String(format: ".%02d", m)  // ".05", ".10", ...
                let attr = NSAttributedString(
                    string: minuteStr,
                    attributes: [
                        .font: minorFont,
                        .foregroundColor: minorColor
                    ]
                )
                let size = attr.size()
                let textX = bounds.width - size.width - 4
                let textY = yPos - size.height/2
                attr.draw(at: CGPoint(x: textX, y: textY))
            }
        }

        // 3) Оранжев балон за текущия час (ако isCurrentDayInWeek + currentTime)
        if isCurrentDayInWeek, let current = currentTime {
            let cal = Calendar.current
            let comps = cal.dateComponents([.hour, .minute], from: current)
            let hourF = CGFloat(comps.hour ?? 0)
            let minuteF = CGFloat(comps.minute ?? 0)
            let fraction = hourF + minuteF/60.0

            let yPos = topOffset + fraction*hourHeight

            let bubbleText = hourMinuteAmPmString(hour: Int(hourF), minute: Int(minuteF))
            let bubbleFont = UIFont.systemFont(ofSize: 10, weight: .semibold)
            let bubbleAttrs: [NSAttributedString.Key: Any] = [
                .font: bubbleFont,
                .foregroundColor: UIColor.white
            ]
            let textSize = (bubbleText as NSString).size(withAttributes: bubbleAttrs)
            let bubbleWidth = textSize.width + 12
            let bubbleHeight = textSize.height + 4

            let bubbleX = bounds.width - bubbleWidth - 4
            let bubbleY = yPos - bubbleHeight/2
            let bubbleRect = CGRect(x: bubbleX, y: bubbleY, width: bubbleWidth, height: bubbleHeight)

            let path = UIBezierPath(roundedRect: bubbleRect, cornerRadius: bubbleHeight/2)
            UIColor.systemOrange.setFill()
            path.fill()

            let textX = bubbleX + (bubbleWidth - textSize.width)/2
            let textY = bubbleY + (bubbleHeight - textSize.height)/2
            (bubbleText as NSString).draw(at: CGPoint(x: textX, y: textY), withAttributes: bubbleAttrs)
        }
    }

    // Пример: 0 -> "12 AM", 13 -> "1 PM", 24 -> "12 AM"
    private func hourString12HourFormat(_ hour: Int) -> String {
        let hrMod12 = hour % 12
        let finalHr = (hrMod12 == 0) ? 12 : hrMod12
        let ampm = (hour < 12 || hour == 24) ? "AM" : "PM"
        return "\(finalHr) \(ampm)"
    }

    private func hourMinuteAmPmString(hour: Int, minute: Int) -> String {
        let hrMod12 = hour % 12
        let finalHr = (hrMod12 == 0) ? 12 : hrMod12
        let ampm = (hour < 12 || hour == 24) ? "AM" : "PM"
        return String(format: "%d:%02d %@", finalHr, minute, ampm)
    }
}
