import UIKit

public final class HoursColumnView: UIView {
    /// Височина на един "час" в пиксели
    public var hourHeight: CGFloat = 50
    
    /**
     Допълнителен отстъп, който добавяме в горната
     и долната част, за да не се реже текстът
     за 0‐вия и 24‐ия час.
     
     Същото това разстояние ще ползваме като `topMargin`
     в седмичния Timeline, за да съвпадат линиите.
     */
    public var extraMarginTopBottom: CGFloat = 10

    /// Маркер дали текущият ден е в обхвата (за оранжев балон)
    public var isCurrentDayInWeek: Bool = false

    /// Ако е зададено, рисуваме балон на текущия час
    public var currentTime: Date?

    /// Ако е зададено, рисуваме ".MM" до съответния час
    public var selectedMinuteMark: (hour: Int, minute: Int)?

    private let majorFont = UIFont.systemFont(ofSize: 11, weight: .medium)
    private let minorFont = UIFont.systemFont(ofSize: 10, weight: .regular)
    private let minorColor = UIColor.darkGray.withAlphaComponent(0.8)

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .systemGray6
    }

    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .systemGray6
    }

    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        // 1) Изчисляваме fractionCur, за да знаем къде е текущото време (ако има)
        //    Ако currentTime не е зададено, fractionCur ще остане -1, което значи „няма текущ час“.
        var fractionCur: CGFloat = -1
        if let current = currentTime {
            let cal = Calendar.current
            let comps = cal.dateComponents([.hour, .minute], from: current)
            let hourF = CGFloat(comps.hour ?? 0)
            let minuteF = CGFloat(comps.minute ?? 0)
            fractionCur = hourF + minuteF/60.0
        }

        // 2) Рисуваме линиите и текстовете за часовете 0..24 (общо 25 линии)
        //    но пропускаме (continue) близкия час, ако е под 15 мин. разлика от fractionCur
        for hour in 0...24 {
            let y = extraMarginTopBottom + CGFloat(hour)*hourHeight
            
            // Проверка: ако имаме текущ час, дали hour е под 15 мин разлика?
            if fractionCur >= 0 {
                let diffHours = abs(CGFloat(hour) - fractionCur)
                let diffMinutes = diffHours * 60
                // Ако е по-малко от 15 мин, пропускаме рисуването
                if diffMinutes < 15 {
                    continue
                }
            }

            // Малка чертичка в десния край
            ctx.setStrokeColor(UIColor.lightGray.cgColor)
            ctx.setLineWidth(0.5)
            ctx.move(to: CGPoint(x: bounds.width - 5, y: y))
            ctx.addLine(to: CGPoint(x: bounds.width, y: y))
            ctx.strokePath()

            // Текст на часа (напр. "1 AM", "12 PM", и т.н.)
            let hourStr = hourString12HourFormat(hour)
            let attrStr = NSAttributedString(
                string: hourStr,
                attributes: [
                    .font: majorFont,
                    .foregroundColor: UIColor.label
                ]
            )
            let size = attrStr.size()
            let textX = bounds.width - size.width - 4
            let textY = y - size.height/2  // центриране спрямо линията
            attrStr.draw(at: CGPoint(x: textX, y: textY))
        }

        // 3) Маркер за конкретна минута (пример: .30)
        if let mark = selectedMinuteMark {
            let h = mark.hour
            let m = mark.minute
            if (0 <= h && h < 24) && (0 <= m && m < 60) {
                let baseY = extraMarginTopBottom + CGFloat(h)*hourHeight
                let fraction = CGFloat(m)/60.0
                let yPos = baseY + fraction*hourHeight

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

        // 4) Ако денят е в обхвата — рисуваме текущия час в ЧЕРВЕНО (без балон)
        if isCurrentDayInWeek, fractionCur >= 0 {
            let yPos = extraMarginTopBottom + fractionCur * hourHeight

            // Превръщаме fractionCur обратно към (час, минути) за надписа
            let hourPart = Int(floor(fractionCur))
            let minutePart = Int(round((fractionCur - CGFloat(hourPart)) * 60))

            let currentTimeText = hourMinuteAmPmString(hour: hourPart, minute: minutePart)

            let attrs: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 11, weight: .semibold),
                .foregroundColor: UIColor.systemRed
            ]
            let size = (currentTimeText as NSString).size(withAttributes: attrs)
            let textX = bounds.width - size.width - 4
            let textY = yPos - size.height / 2
            (currentTimeText as NSString).draw(at: CGPoint(x: textX, y: textY), withAttributes: attrs)
        }
    }


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
