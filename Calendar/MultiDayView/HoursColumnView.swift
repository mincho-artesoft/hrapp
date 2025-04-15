import UIKit

/// Модел за прогнозна информация за един часов интервал
public struct HourlyWeatherForecast {
    let hour: Int           // Часът (0...23)
    let iconName: String    // Името на SFSymbol иконата, напр. "cloud.sun" или "wind"
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
    
    // MARK: - Инициализация
    
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .systemGray6
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .systemGray6
    }
    
    // MARK: - Draw
    
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }
        
        // Широчина на зоната за прогнозна информация (вляво)
        let forecastAreaWidth: CGFloat = displayWeatherForecast ? 40 : 0
        
        // 1) Изчисляваме текущата позиция (в дробни часове).
        var fractionCur: CGFloat = -1
        if let current = currentTime {
            let cal = Calendar.current
            let comps = cal.dateComponents([.hour, .minute], from: current)
            let hourF = CGFloat(comps.hour ?? 0)
            let minuteF = CGFloat(comps.minute ?? 0)
            fractionCur = hourF + minuteF / 60.0
        }
        
        // 1a) Закръгляме до най-близкия цял час (примерно ако е 3.75 => 4)
        let currentHourApprox = (fractionCur >= 0) ? Int(round(fractionCur)) : -1
        
        // 2) Рисуваме часовите линии и надписи (0 до 24)
        for hour in 0...24 {
            let yCenter = extraMarginTopBottom + CGFloat(hour) * hourHeight
            
            // По избор: ако текущото време е близо до този час, може да пропуснем линията
            if fractionCur >= 0 {
                let diffHours = abs(CGFloat(hour) - fractionCur)
                let diffMinutes = diffHours * 60
                if diffMinutes < 15 {
                    continue
                }
            }
            
            // Рисуваме хоризонтална линия в дясната част
            ctx.setStrokeColor(UIColor.lightGray.cgColor)
            ctx.setLineWidth(0.5)
            ctx.move(to: CGPoint(x: bounds.width - 5, y: yCenter))
            ctx.addLine(to: CGPoint(x: bounds.width, y: yCenter))
            ctx.strokePath()
            
            // Рисуваме текста за часа (12h формат: "1 AM", "2 PM", ...)
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
        
        // 3) Рисуваме прогнозните иконки и температури
        if displayWeatherForecast, let forecasts = hourlyWeatherForecasts {
            for forecast in forecasts {
                
                // >>> Вместо да проверяваме if forecast.hour == Calendar.current.component(.hour, from: current)
                // проверяваме дали forecast.hour == currentHourApprox
                if currentHourApprox >= 0, forecast.hour == currentHourApprox {
                    // Пропускаме иконата за най-близкия (закръглен) текущ час
                    continue
                }
                
                // Вертикалната позиция се определя от forecast.hour
                let yCenter = extraMarginTopBottom + CGFloat(forecast.hour) * hourHeight
                
                // Подготовка на низа с температурата (например "23°")
                let tempText = String(format: "%.0f°", forecast.temperature)
                let tempAttributes: [NSAttributedString.Key: Any] = [
                    .font: UIFont.systemFont(ofSize: 10, weight: .regular),
                    .foregroundColor: UIColor.label
                ]
                let tempAttrStr = NSAttributedString(string: tempText, attributes: tempAttributes)
                let tempTextSize = tempAttrStr.size()
                
                // Опитваме да намерим fill вариант, ако има
                let finalIconName = fillSymbolNameIfAvailable(forecast.iconName)
                
                // Пример: оцветяваме иконата в systemBlue (и пазим пропорциите по ширина/височина)
                if let iconImage = UIImage(systemName: finalIconName)?
                    .withTintColor(.systemBlue, renderingMode: .alwaysOriginal) {
                    
                    // Да кажем, че искаме ширина 20, а височината се смята:
                    let fixedWidth: CGFloat = 20
                    let originalSize = iconImage.size
                    let aspectRatio = originalSize.height / originalSize.width
                    let newHeight = fixedWidth * aspectRatio
                    
                    // Смятаме x и y, като го изместваме наляво спрямо forecastAreaWidth
                    let iconX = (forecastAreaWidth - fixedWidth) / 2 - 8
                    let iconTopY = yCenter - newHeight / 2
                    
                    let iconRect = CGRect(x: iconX,
                                          y: iconTopY,
                                          width: fixedWidth,
                                          height: newHeight)
                    
                    iconImage.draw(in: iconRect)
                    
                    // Рисуваме температурата под иконата
                    let verticalSpacing: CGFloat = 2
                    let textX = (forecastAreaWidth - tempTextSize.width) / 2 - 8
                    let textY = iconRect.maxY + verticalSpacing
                    tempAttrStr.draw(at: CGPoint(x: textX, y: textY))
                }
            }
        }
        
        // 4) Рисуваме маркировка за избрана минута (ако има)
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
        
        // 5) Рисуваме маркер за текущото време в червено (ако денят е в обхвата)
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
    
    /// Ако UIImage(systemName: "\(symbolName).fill") != nil,
    /// връща fill варианта, иначе - оригиналния (без fill).
    private func fillSymbolNameIfAvailable(_ symbolName: String) -> String {
        let fillVariant = symbolName + ".fill"
        if UIImage(systemName: fillVariant) != nil {
            return fillVariant
        }
        return symbolName
    }
    
    /// Преобразува час (0...24) в 12h формат, напр. "1 AM", "2 PM"
    private func hourString12HourFormat(_ hour: Int) -> String {
        let hrMod12 = hour % 12
        let finalHr = (hrMod12 == 0) ? 12 : hrMod12
        let ampm = (hour < 12 || hour == 24) ? "AM" : "PM"
        return "\(finalHr) \(ampm)"
    }
    
    /// Прави низ "H:MM AM/PM" от час и минута (12h формат)
    private func hourMinuteAmPmString(hour: Int, minute: Int) -> String {
        let hrMod12 = hour % 12
        let finalHr = (hrMod12 == 0) ? 12 : hrMod12
        let ampm = (hour < 12 || hour == 24) ? "AM" : "PM"
        return String(format: "%d:%02d %@", finalHr, minute, ampm)
    }
}
