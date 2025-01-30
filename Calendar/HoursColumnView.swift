//
//  HoursColumnView.swift
//  ExampleCalendarApp
//

import UIKit

public final class HoursColumnView: UIView {
    public var hourHeight: CGFloat = 50
    public var topOffset: CGFloat = 0

    /// Флаг дали сме в текущия ден/седмица – ако е true и имаме currentTime,
    /// ще покажем оранжев балон за текущия час.
    public var isCurrentDayInWeek: Bool = false

    /// Текущото време (ако е nil, не показваме балон)
    public var currentTime: Date?

    /// Флаг, който показва дали да рисуваме 5-минутните отметки (.05, .10, ...)
    public var show5MinuteMarks: Bool = false

    // Основен шрифт/цвят за целите часове (12 AM, 1 AM и т.н.)
    private let majorFont = UIFont.systemFont(ofSize: 11, weight: .medium)
    private let majorColor = UIColor.darkText

    // Шрифт/цвят за 5-минутните отметки
    private let minorFont = UIFont.systemFont(ofSize: 10, weight: .regular)
    private let minorColor = UIColor.darkGray.withAlphaComponent(0.7)

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

        //
        // 1) Рисуваме основните часове 0..24 в 12-часов формат (AM/PM)
        //
        for hour in 0...24 {
            let y = topOffset + CGFloat(hour)*hourHeight

            // Малка черта вдясно
            ctx.setStrokeColor(UIColor.lightGray.cgColor)
            ctx.setLineWidth(0.5)
            ctx.move(to: CGPoint(x: bounds.width - 5, y: y))
            ctx.addLine(to: CGPoint(x: bounds.width, y: y))
            ctx.strokePath()

            // Текст "12 AM", "1 AM", ... "12 PM", ...
            let hourString = hourString12HourFormat(hour)
            let attrString = NSAttributedString(
                string: hourString,
                attributes: [
                    .font: majorFont,
                    .foregroundColor: majorColor
                ]
            )
            let size = attrString.size()
            let textX = bounds.width - size.width - 4
            let textY = y - size.height/2
            attrString.draw(at: CGPoint(x: textX, y: textY))
        }

        //
        // 2) Рисуваме (или не) 5-минутните отметки през .05, .10, .15...
        //
        if show5MinuteMarks {
            for hour in 0..<24 {
                let baseY = topOffset + CGFloat(hour)*hourHeight
                for minute in stride(from: 5, through: 55, by: 5) {
                    let fraction = CGFloat(minute)/60.0
                    let y = baseY + fraction*hourHeight

                    let minuteStr = String(format: ".%02d", minute) // напр. ".05"
                    let attrString = NSAttributedString(
                        string: minuteStr,
                        attributes: [
                            .font: minorFont,
                            .foregroundColor: minorColor
                        ]
                    )
                    let size = attrString.size()
                    let textX = bounds.width - size.width - 4
                    let textY = y - size.height/2
                    attrString.draw(at: CGPoint(x: textX, y: textY))
                }
            }
        }

        //
        // 3) Оранжев балон за текущия час (ако е в седмицата и имаме currentTime)
        //
        if isCurrentDayInWeek, let current = currentTime {
            let calendar = Calendar.current
            let comps = calendar.dateComponents([.hour, .minute], from: current)
            let hourF = CGFloat(comps.hour ?? 0)
            let minuteF = CGFloat(comps.minute ?? 0)
            let fraction = hourF + minuteF/60.0

            let yPos = topOffset + fraction*hourHeight

            // Текст в балона, напр. "1:24 PM"
            let bubbleText = hourMinuteAmPmString(hour: Int(hourF), minute: Int(minuteF))

            // Шрифт и атрибути
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

    // Превръща час 0..24 в 12-часов формат (AM/PM).
    // Пример: 0 -> "12 AM", 13 -> "1 PM", 24 -> "12 AM"
    private func hourString12HourFormat(_ hour: Int) -> String {
        let hrMod12 = hour % 12
        let finalHr = (hrMod12 == 0) ? 12 : hrMod12
        let ampm = (hour < 12 || hour == 24) ? "AM" : "PM"
        return "\(finalHr) \(ampm)"
    }

    /// Пример: 13:24 -> "1:24 PM"
    private func hourMinuteAmPmString(hour: Int, minute: Int) -> String {
        let hrMod12 = hour % 12
        let finalHr = (hrMod12 == 0) ? 12 : hrMod12
        let ampm = (hour < 12 || hour == 24) ? "AM" : "PM"
        return String(format: "%d:%02d %@", finalHr, minute, ampm)
    }
}
