//
//  HoursColumnView.swift
//  ExampleCalendarApp
//

import UIKit

public final class HoursColumnView: UIView {
    public var hourHeight: CGFloat = 50
    public var topOffset: CGFloat = 0

    /// Дали сме в текущия ден/седмица: ако е true + имаме currentTime,
    /// рисуваме оранжев балон за текущия час.
    public var isCurrentDayInWeek: Bool = false

    /// Текущото време (ако е nil, не показваме балон)
    public var currentTime: Date?

    /**
     Тук държим информацията за *една-единствена* 5-минутна отметка,
     която да покажем. Пример: (hour: 13, minute: 10) -> рисуваме ".10" при 13ч.
     Ако е nil, не рисуваме нищо.
     */
    public var selected5MinMark: (hour: Int, minute: Int)?

    // Шрифт/цвят за основните (целите) часове
    private let majorFont = UIFont.systemFont(ofSize: 11, weight: .medium)
    private let majorColor = UIColor.darkText

    // Шрифт/цвят за 5-минутната отметка
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

        //
        // 1) Рисуваме всички цели часове (0..24) в 12-часов формат AM/PM
        //
        for hour in 0...24 {
            let y = topOffset + CGFloat(hour)*hourHeight

            // Малка черта вдясно
            ctx.setStrokeColor(UIColor.lightGray.cgColor)
            ctx.setLineWidth(0.5)
            ctx.move(to: CGPoint(x: bounds.width - 5, y: y))
            ctx.addLine(to: CGPoint(x: bounds.width, y: y))
            ctx.strokePath()

            // Текст, например "12 AM", "1 AM", ...
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

        //
        // 2) Рисуваме ЕДНА 5-минутна отметка (ако е зададена):
        //
        if let mark = selected5MinMark {
            let h = mark.hour
            let m = mark.minute
            // Проверяваме hour в [0..23], minute в [1..59]
            if h >= 0 && h < 24 && m > 0 && m < 60 {
                let baseY = topOffset + CGFloat(h)*hourHeight
                let fraction = CGFloat(m)/60.0
                let yPos = baseY + fraction*hourHeight

                // Текст, напр. ".05", ".10"
                let minuteStr = String(format: ".%02d", m)
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

        //
        // 3) Рисуваме (по избор) оранжев балон за текущия час,
        //    ако isCurrentDayInWeek == true и currentTime != nil
        //
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

    // Превръща час 0..24 в 12-часов AM/PM, например 13->"1 PM", 0->"12 AM", 24->"12 AM"
    private func hourString12HourFormat(_ hour: Int) -> String {
        let hrMod12 = hour % 12
        let finalHr = (hrMod12 == 0) ? 12 : hrMod12
        let ampm = (hour < 12 || hour == 24) ? "AM" : "PM"
        return "\(finalHr) \(ampm)"
    }

    // Пример: 13:24 -> "1:24 PM"
    private func hourMinuteAmPmString(hour: Int, minute: Int) -> String {
        let hrMod12 = hour % 12
        let finalHr = (hrMod12 == 0) ? 12 : hrMod12
        let ampm = (hour < 12 || hour == 24) ? "AM" : "PM"
        return String(format: "%d:%02d %@", finalHr, minute, ampm)
    }
}
