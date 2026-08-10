import UIKit


public final class HoursColumnView: UIView {
    // Височина на един "час" в пиксели
    public var hourHeight: CGFloat = 50
    public var extraMarginTopBottom: CGFloat = 10

    // Маркер дали текущият ден е в обхвата (за оранжев балон)
    public var isCurrentDayInWeek: Bool = false

    // Ако е зададено, рисуваме балон на текущия час
    public var currentTime: Date?

    // Ако е зададено, рисуваме ".MM" до съответния час
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

    private lazy var hourFormatter: DateFormatter = {
        appTimeFormatter()
    }()

    private lazy var hourMinuteFormatter: DateFormatter = {
        appTimeFormatter()
    }()

    private lazy var minuteNumberFormatter: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.locale = .appFormatting
        formatter.numberStyle = .decimal
        formatter.minimumIntegerDigits = 2
        formatter.maximumFractionDigits = 0
        formatter.usesGroupingSeparator = false
        return formatter
    }()

    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        let isRTL = effectiveUserInterfaceLayoutDirection == .rightToLeft

        // 1) Изчисляваме fractionCur
        var fractionCur: CGFloat = -1
        if let current = currentTime {
            let cal = Calendar.current
            let comps = cal.dateComponents([.hour, .minute], from: current)
            let hourF = CGFloat(comps.hour ?? 0)
            let minuteF = CGFloat(comps.minute ?? 0)
            fractionCur = hourF + minuteF/60.0
        }

        // 2) Рисуваме линиите и текстовете за часовете 0..24
        for hour in 0...24 {
            let y = extraMarginTopBottom + CGFloat(hour) * hourHeight

            // Прескачаме ако близо до текущото време
            if fractionCur >= 0 {
                let diffHours = abs(CGFloat(hour) - fractionCur)
                let diffMinutes = diffHours * 60
                if diffMinutes < 15 {
                    continue
                }
            }

            // Малка чертичка
            ctx.setStrokeColor(UIColor.lightGray.cgColor)
            ctx.setLineWidth(0.5)
            ctx.move(to: CGPoint(x: isRTL ? 0 : bounds.width - 5, y: y))
            ctx.addLine(to: CGPoint(x: isRTL ? 5 : bounds.width, y: y))
            ctx.strokePath()

            // Текст
            let hourStr = hourString(hour)
            let attrStr = NSAttributedString(
                string: hourStr,
                attributes: [
                    .font: majorFont,
                    .foregroundColor: UIColor.label
                ]
            )
            let size = attrStr.size()
            let textX = isRTL ? 4 : bounds.width - size.width - 4
            let textY = y - size.height/2
            attrStr.draw(at: CGPoint(x: textX, y: textY))
        }

        // 3) Маркер за конкретна минута
        if let mark = selectedMinuteMark {
            let h = mark.hour
            let m = mark.minute
            if (0 <= h && h < 24) && (0 <= m && m < 60) {
                let baseY = extraMarginTopBottom + CGFloat(h) * hourHeight
                let yPos = baseY + CGFloat(m)/60.0 * hourHeight

                let localizedMinute = minuteNumberFormatter.string(from: NSNumber(value: m)) ?? String(m)
                let minuteStr = ".\(localizedMinute)"
                let attr = NSAttributedString(
                    string: minuteStr,
                    attributes: [
                        .font: minorFont,
                        .foregroundColor: minorColor
                    ]
                )
                let size = attr.size()
                let textX = isRTL ? 4 : bounds.width - size.width - 4
                let textY = yPos - size.height/2
                attr.draw(at: CGPoint(x: textX, y: textY))
            }
        }

        // 4) Ако денят е в обхвата — рисуваме текущия час
        if isCurrentDayInWeek, fractionCur >= 0 {
            let yPos = extraMarginTopBottom + fractionCur * hourHeight
            let hourPart = Int(floor(fractionCur))
            let minutePart = Int(round((fractionCur - CGFloat(hourPart)) * 60))
            let currentTimeText = hourMinuteString(hour: hourPart, minute: minutePart)

            let attrs: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 11, weight: .semibold),
                .foregroundColor: UIColor.systemRed
            ]
            let size = (currentTimeText as NSString).size(withAttributes: attrs)
            let textX = isRTL ? 4 : bounds.width - size.width - 4
            let textY = yPos - size.height/2
            (currentTimeText as NSString).draw(at: CGPoint(x: textX, y: textY), withAttributes: attrs)
        }
    }

    // MARK: - Форматиране на низове

    private func hourString(_ hour: Int) -> String {
        hourFormatter.string(from: dateForTime(hour: hour, minute: 0))
    }

    private func hourMinuteString(hour: Int, minute: Int) -> String {
        hourMinuteFormatter.string(from: dateForTime(hour: hour, minute: minute))
    }

    private func dateForTime(hour: Int, minute: Int) -> Date {
        var components = DateComponents()
        components.calendar = Calendar.autoupdatingCurrent
        components.year = 2001
        components.month = 1
        components.day = 1
        components.hour = hour
        components.minute = minute
        return components.date ?? Date(timeIntervalSince1970: 0)
    }
}
