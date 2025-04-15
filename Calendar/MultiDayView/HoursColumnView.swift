import UIKit

/// Модел за прогнозна информация за един часов интервал
public struct HourlyWeatherForecast {
    let hour: Int           // Часът (0...23)
    let iconName: String    // Името на SFSymbol иконата, напр. "cloud.sun.fill"
    let temperature: Double // Прогнозирана температура
}

public final class HoursColumnView: UIView {
    /// Височина на един "час" в пиксели
    public var hourHeight: CGFloat = 50
    
    /**
     Отстъп отгоре и отдолу, за да не се реже текстът за 0‑вия и 24‑ия час.
     */
    public var extraMarginTopBottom: CGFloat = 10
    
    /// Флаг дали текущият ден е в обхвата (за показване на маркер за текущия час)
    public var isCurrentDayInWeek: Bool = false
    
    /// Ако е зададено, визуализира маркер за текущия час
    public var currentTime: Date?
    
    /// Ако е зададено, рисуваме ".MM" до съответния час
    public var selectedMinuteMark: (hour: Int, minute: Int)?
    
    // MARK: - Свойства за прогнозна информация
    /// Флаг за активиране на прогнозните данни до часовете
    public var displayWeatherForecast: Bool = false
    
    /// Данни за прогнозата – по един запис за всеки час (0...23)
    public var hourlyWeatherForecasts: [HourlyWeatherForecast]?
    
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
        
        // Широчина на зоната за прогнозна информация (вляво)
        let forecastAreaWidth: CGFloat = displayWeatherForecast ? 40 : 0
        
        // Изчисляваме текущата позиция (в часов формат), ако currentTime е зададено.
        var fractionCur: CGFloat = -1
        if let current = currentTime {
            let cal = Calendar.current
            let comps = cal.dateComponents([.hour, .minute], from: current)
            let hourF = CGFloat(comps.hour ?? 0)
            let minuteF = CGFloat(comps.minute ?? 0)
            fractionCur = hourF + minuteF / 60.0
        }
        
        // 1. Рисуваме часовите линии и часовете (0 до 23)
        for hour in 0...24 {
            let yCenter = extraMarginTopBottom + CGFloat(hour) * hourHeight
            
            // (Опционално) Ако текущото време е близо до този час, може да пропуснете рисуването на линията,
            // но това може да бъде адаптирано според нуждите ви.
            if fractionCur >= 0 {
                let diffHours = abs(CGFloat(hour) - fractionCur)
                let diffMinutes = diffHours * 60
                if diffMinutes < 15 {
                    continue
                }
            }
            
            // Рисуваме хоризонтална линия вдясно
            ctx.setStrokeColor(UIColor.lightGray.cgColor)
            ctx.setLineWidth(0.5)
            ctx.move(to: CGPoint(x: bounds.width - 5, y: yCenter))
            ctx.addLine(to: CGPoint(x: bounds.width, y: yCenter))
            ctx.strokePath()
            
            // Рисуваме текста за часа (например "1 AM", "2 AM" и т.н.)
            let hourStr = hourString12HourFormat(hour)
            let attrStr = NSAttributedString(string: hourStr, attributes: [
                .font: majorFont,
                .foregroundColor: UIColor.label
            ])
            let size = attrStr.size()
            let textX = bounds.width - size.width - 4
            let textY = yCenter - size.height / 2
            attrStr.draw(at: CGPoint(x: textX, y: textY))
        }
        
        // 2. Рисуваме прогнозните иконки и температури – използваме стойността forecast.hour за позициониране
        // 2. Рисуваме прогнозните иконки и температури – използваме стойността forecast.hour за позициониране
        if displayWeatherForecast, let forecasts = hourlyWeatherForecasts {
            for forecast in forecasts {
                // Ако currentTime е зададено, извличаме текущия час
                if let current = currentTime {
                    let currentHour = Calendar.current.component(.hour, from: current)
                    // Ако прогнозата е за текущия час, НЕ рисуваме иконата
                    if forecast.hour == currentHour {
                        continue
                    }
                }
                
                // Изчисляваме вертикалната позиция по базата на forecast.hour
                let yCenter = extraMarginTopBottom + CGFloat(forecast.hour) * hourHeight
                
                let iconSize: CGFloat = 20
                let verticalSpacing: CGFloat = 2
                
                // Подготовка на низа с температурата (например "23°")
                let tempText = String(format: "%.0f°", forecast.temperature)
                let tempAttributes: [NSAttributedString.Key: Any] = [
                    .font: UIFont.systemFont(ofSize: 10, weight: .regular),
                    .foregroundColor: UIColor.label
                ]
                let tempAttrStr = NSAttributedString(string: tempText, attributes: tempAttributes)
                let tempTextSize = tempAttrStr.size()
                
                // Изчисляваме позицията на иконата: центрирана хоризонтално в прогнозната зона с отместване наляво
                let iconX = (forecastAreaWidth - iconSize) / 2 - 8  // отместване с -8 пиксела
                let iconTopY = yCenter - iconSize / 2
                
                if let iconImage = UIImage(systemName: forecast.iconName)?.withRenderingMode(.alwaysOriginal) {
                    let iconRect = CGRect(x: iconX, y: iconTopY, width: iconSize, height: iconSize)
                    iconImage.draw(in: iconRect)
                    
                    // Рисуваме температурата под иконата
                    let textX = (forecastAreaWidth - tempTextSize.width) / 2 - 8
                    let textY = iconRect.maxY + verticalSpacing
                    tempAttrStr.draw(at: CGPoint(x: textX, y: textY))
                }
            }
        }

        
        // 3. Рисуваме маркировка за избрана минута (ако има)
        if let mark = selectedMinuteMark {
            let h = mark.hour
            let m = mark.minute
            if (0 <= h && h < 24) && (0 <= m && m < 60) {
                let baseY = extraMarginTopBottom + CGFloat(h) * hourHeight
                let fraction = CGFloat(m) / 60.0
                let yPos = baseY + fraction * hourHeight
                let minuteStr = String(format: ".%02d", m)
                let attr = NSAttributedString(string: minuteStr, attributes: [
                    .font: minorFont,
                    .foregroundColor: minorColor
                ])
                let size = attr.size()
                let textX = bounds.width - size.width - 4
                let textY = yPos - size.height / 2
                attr.draw(at: CGPoint(x: textX, y: textY))
            }
        }
        
        // 4. Рисуваме маркер за текущото време в червено (ако денят е в обхвата)
        if isCurrentDayInWeek, fractionCur >= 0 {
            let yPos = extraMarginTopBottom + fractionCur * hourHeight
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

    
    // MARK: - Помощни функции
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
