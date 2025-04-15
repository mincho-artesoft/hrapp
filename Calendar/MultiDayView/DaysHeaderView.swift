import UIKit

/// DaysHeaderView – показва дните в даден диапазон (fromDate...toDate) + икона за времето + темп. диапазон
public final class DaysHeaderView: UIView {
    
    // Широчината на всяка колона за ден – по подразбиране 100 точки.
    public var dayColumnWidth: CGFloat = 100
    
    // Отстъп за часовете – тук може да оставите 0 или малка стойност.
    public var leadingInsetForHours: CGFloat = 0
    
    /// Начална дата (само денят има значение, часът се игнорира).
    public var fromDate: Date = Date() {
        didSet { rebuildLabelsIfNeeded() }
    }
    
    /// Крайна дата (само денят има значение, часът се игнорира).
    public var toDate: Date = Date() {
        didSet { rebuildLabelsIfNeeded() }
    }
    
    /// Списък с дневни прогнози (ако е празен или nil – не показваме прогноза).
    public var dailyForecasts: [DayForecastItem]? {
        didSet {
            // При промяна на прогнозата да обновим текста
            updateTexts()
        }
    }
    
    /// Callback, който се вика при натискане върху даден ден.
    public var onDayTap: ((Date) -> Void)?
    
    /// Масив с UILabel за всеки ден в диапазона.
    private var labels: [UILabel] = []
    
    /// Частен календар, който използваме за изчисления.
    private var calendarForLabels: Calendar = {
        var cal = Calendar(identifier: .gregorian)
        cal.firstWeekday = 2  // Monday = 2
        return cal
    }()
    
    // MARK: - Инициализация
    
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .clear
    }
    
    // MARK: - Брой дни в [fromDate, toDate]
    
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
    
    // MARK: - Основен метод за създаване/обновяване на лейбълите
    
    /// Проверява колко дни има нужда да се покажат и създава (или трие) UILabel-ите при нужда.
    private func rebuildLabelsIfNeeded() {
        let needed = dayCount
        if needed < 1 {
            // Ако няма дни, махаме всички лейбъли
            labels.forEach { $0.removeFromSuperview() }
            labels.removeAll()
            return
        }
        // Ако вече имаме толкова лейбъли, колкото дни, просто обновяваме текста
        if labels.count == needed {
            updateTexts()
            return
        }
        
        // Иначе изчистваме старите и създаваме точно толкова нови, колкото дни има
        labels.forEach { $0.removeFromSuperview() }
        labels.removeAll()
        
        for i in 0..<needed {
            let lbl = UILabel()
            lbl.textAlignment = .center
            lbl.font = UIFont.systemFont(ofSize: 12, weight: .semibold)
            lbl.textColor = .label
            lbl.tag = i
            
            // Позволяваме етикетът да има повече от един ред (за датата и прогнозата)
            lbl.numberOfLines = 0
            lbl.adjustsFontSizeToFitWidth = true
            lbl.minimumScaleFactor = 0.7
            
            // Добавяме gesture, за да можем да засичаме натискания
            let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleLabelTap(_:)))
            lbl.isUserInteractionEnabled = true
            lbl.addGestureRecognizer(tapGR)
            
            labels.append(lbl)
            addSubview(lbl)
        }
        
        // Обновяваме текстовете в лейбълите
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
    
    // MARK: - Създаване/обновяване на атрибутния текст в лейбълите
    
    /// Обновява текста (дата + иконка + температура) във всеки лейбъл.
    private func updateTexts() {
        // Форматиращ обект за датите (пример: "Mon, 15 Apr")
        let df = DateFormatter()
        df.dateFormat = "EEE, d MMM"
        
        let todayOnly = calendarForLabels.startOfDay(for: Date())
        
        for i in 0..<labels.count {
            let lbl = labels[i]
            
            guard let currentDay = calendarForLabels.date(byAdding: .day, value: i, to: fromDateOnly) else {
                lbl.attributedText = NSAttributedString(string: "??")
                continue
            }
            
            // Проверяваме дали е днешен ден
            let isToday = (calendarForLabels.startOfDay(for: currentDay) == todayOnly)
            
            // Основни атрибути за датата и (при нужда) иконката
            let baseAttributes: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 12, weight: .semibold),
                .foregroundColor: isToday ? UIColor.systemOrange : UIColor.label
            ]
            
            // По-малки и винаги черни цифри за температурите
            let tempAttributes: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 10, weight: .regular),
            ]
            
            // Форматираме датата
            let dateString = df.string(from: currentDay)
            let baseAttrStr = NSAttributedString(string: dateString, attributes: baseAttributes)
            let completeAttrStr = NSMutableAttributedString(attributedString: baseAttrStr)
            
            // Ако имаме дневна прогноза за този ден, добавяме нов ред + иконка + температури
            if let forecasts = dailyForecasts {
                let dayStart = calendarForLabels.startOfDay(for: currentDay)
                
                if let forecast = forecasts.first(where: { calendarForLabels.isDate($0.date, inSameDayAs: dayStart) }) {
                    // Добавяме нов ред (за да са на втори ред иконката и температурите)
                    let lineBreak = NSAttributedString(string: "\n", attributes: baseAttributes)
                    completeAttrStr.append(lineBreak)
                    
                    // “Fill” вариант на символа, ако е наличен
                    let finalSymbolName = fillSymbolNameIfAvailable(forecast.symbol)
                    
                    // Добавяме NSTextAttachment за иконката,
                    // като я оцветяваме в systemBlue и запазваме пропорциите на символа
                    if let iconImage = UIImage(systemName: finalSymbolName)?
                        .withTintColor(.systemBlue, renderingMode: .alwaysOriginal) {
                        
                        let attachment = NSTextAttachment()
                        
                        // Избираме височина 12 pt (примерно).
                        let desiredHeight: CGFloat = 12
                        
                        // Вземаме оригиналния размер на SF Symbol
                        let originalSize = iconImage.size
                        
                        // Съотношение ширина : височина
                        let aspectRatio = originalSize.width / originalSize.height
                        
                        // Новата ширина, така че иконата да не се разтяга/стеснява
                        let newWidth = desiredHeight * aspectRatio
                        
                        // По избор – малък отместване по вертикала, за да се центрира с текста
                        let yOffset: CGFloat = -1
                        
                        attachment.bounds = CGRect(x: 0, y: yOffset, width: newWidth, height: desiredHeight)
                        attachment.image = iconImage
                        
                        let iconAttrStr = NSAttributedString(attachment: attachment)
                        completeAttrStr.append(iconAttrStr)
                    }
                    
                    // Малко интервал
                    let spacer = NSAttributedString(string: " ", attributes: baseAttributes)
                    completeAttrStr.append(spacer)
                    
                    // Температури (пример: "7°/13°") – по-малки и винаги черни
                    let tempString = String(format: "%d°/%d°",
                                            Int(round(forecast.minTemp)),
                                            Int(round(forecast.maxTemp)))
                    let tempAttrStr = NSAttributedString(string: tempString, attributes: tempAttributes)
                    completeAttrStr.append(tempAttrStr)
                }
            }
            
            lbl.attributedText = completeAttrStr
        }
    }
    
    // MARK: - Проверка за наличен ".fill" вариант
    
    /// Ако UIImage(systemName: "\(symbolName).fill") != nil, връща fill варианта, иначе - оригиналния.
    private func fillSymbolNameIfAvailable(_ symbolName: String) -> String {
        let fillVariant = symbolName + ".fill"
        if UIImage(systemName: fillVariant) != nil {
            return fillVariant
        }
        return symbolName
    }
    
    // MARK: - Разположение на лейбълите
    
    /// Подрежда UILabel-ите хоризонтално, всеки върху своя ден.
    public override func layoutSubviews() {
        super.layoutSubviews()
        
        for (i, lbl) in labels.enumerated() {
            let x = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            lbl.frame = CGRect(x: x, y: 0, width: dayColumnWidth, height: bounds.height)
        }
    }
}
