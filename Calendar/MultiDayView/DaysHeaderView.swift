import UIKit
import SwiftUI


public final class DaysHeaderView: UIView {

    // Широчината на всяка колона за ден – задаваме фиксирано 100 точки.
    public var dayColumnWidth: CGFloat = 100

    // Отстъп за часовете – тук оставяме 0 или малка стойност.
    public var leadingInsetForHours: CGFloat = 0

    public var fromDate: Date = Date() {
        didSet { rebuildLabelsIfNeeded() }
    }
    public var toDate: Date = Date() {
        didSet { rebuildLabelsIfNeeded() }
    }
    
    // Свойство за дневната прогноза
    public var dailyForecasts: [DayForecastItem]? {
        didSet {
            updateTexts()
        }
    }
    
    public var onDayTap: ((Date) -> Void)?

    private var labels: [UILabel] = []
    private var calendarForLabels: Calendar = {
        var cal = Calendar(identifier: .gregorian)
        cal.firstWeekday = 2 // Monday = 2
        return cal
    }()

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
    }

    required public init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .clear
    }

    private var dayCount: Int {
        let comps = calendarForLabels.dateComponents([.day], from: fromDateOnly, to: toDateOnly)
        return (comps.day ?? 0) + 1
    }

    private var fromDateOnly: Date {
        return calendarForLabels.startOfDay(for: fromDate)
    }
    private var toDateOnly: Date {
        return calendarForLabels.startOfDay(for: toDate)
    }

    private func rebuildLabelsIfNeeded() {
        let needed = dayCount
        if needed < 1 {
            labels.forEach { $0.removeFromSuperview() }
            labels.removeAll()
            return
        }
        if labels.count == needed {
            updateTexts()
            return
        }
        labels.forEach { $0.removeFromSuperview() }
        labels.removeAll()

        for i in 0..<needed {
            let lbl = UILabel()
            lbl.textAlignment = .center
            lbl.font = UIFont.systemFont(ofSize: 12, weight: .semibold)
            lbl.textColor = .label
            lbl.tag = i
            // Ограничаваме текста да бъде на 1 ред и да се намалява шрифтът, ако е необходимо
            lbl.numberOfLines = 1
            lbl.adjustsFontSizeToFitWidth = true
            lbl.minimumScaleFactor = 0.7

            let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleLabelTap(_:)))
            lbl.isUserInteractionEnabled = true
            lbl.addGestureRecognizer(tapGR)

            labels.append(lbl)
            addSubview(lbl)
        }
        updateTexts()
        setNeedsLayout()
    }

    @objc private func handleLabelTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedLabel = gesture.view as? UILabel else { return }
        let dayIndex = tappedLabel.tag
        if let d = calendarForLabels.date(byAdding: .day, value: dayIndex, to: fromDateOnly) {
            onDayTap?(d)
        }
    }

    private func updateTexts() {
        // Форматираме датата – например "Mon, 15 Apr"
        let df = DateFormatter()
        df.dateFormat = "EEE, d MMM"
        
        let todayOnly = calendarForLabels.startOfDay(for: Date())
        
        for i in 0..<labels.count {
            let lbl = labels[i]
            guard let currentDay = calendarForLabels.date(byAdding: .day, value: i, to: fromDateOnly) else {
                lbl.attributedText = NSAttributedString(string: "??")
                continue
            }
            let dateString = df.string(from: currentDay)
            let baseAttributes: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 12, weight: .semibold),
                .foregroundColor: (calendarForLabels.startOfDay(for: currentDay) == todayOnly) ? UIColor.systemOrange : UIColor.label
            ]
            let baseAttrStr = NSAttributedString(string: dateString, attributes: baseAttributes)
            let completeAttrStr = NSMutableAttributedString(attributedString: baseAttrStr)
            
            // Ако има дневна прогноза за този ден, добавяме разделител, иконка и температурен диапазон
            if let forecasts = dailyForecasts {
                let dayStart = calendarForLabels.startOfDay(for: currentDay)
                if let forecast = forecasts.first(where: { calendarForLabels.isDate($0.date, inSameDayAs: dayStart) }) {
                    let spacer = NSAttributedString(string: " ", attributes: baseAttributes)
                    completeAttrStr.append(spacer)
                    
                    // Добавяме иконка чрез NSTextAttachment, ако има символ
                    if let iconImage = UIImage(systemName: forecast.symbol)?.withRenderingMode(.alwaysOriginal) {
                        let attachment = NSTextAttachment()
                        let iconSize = CGSize(width: 12, height: 12)
                        attachment.bounds = CGRect(origin: .zero, size: iconSize)
                        attachment.image = iconImage
                        let iconAttrStr = NSAttributedString(attachment: attachment)
                        completeAttrStr.append(iconAttrStr)
                    }
                    
                    let tempString = String(format: "%d°/%d°", Int(round(forecast.minTemp)), Int(round(forecast.maxTemp)))
                    let tempAttrStr = NSAttributedString(string: tempString, attributes: baseAttributes)
                    completeAttrStr.append(tempAttrStr)
                }
            }
            
            lbl.attributedText = completeAttrStr
        }
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        for (i, lbl) in labels.enumerated() {
            let x = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            lbl.frame = CGRect(x: x, y: 0, width: dayColumnWidth, height: bounds.height)
        }
    }
}
