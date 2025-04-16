import UIKit

/// DaysHeaderView – показва дните в даден диапазон (fromDate...toDate) + икона за времето + температурен диапазон
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
            // При промяна на прогнозата обновяваме текста
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
        cal.firstWeekday = 2  // Първият ден е понеделник (2)
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
    
    // MARK: - Изчисляване на броя дни в [fromDate, toDate]
    
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
    
    // MARK: - Създаване/обновяване на лейбълите
    
    /// Проверява колко дни трябва да се покажат и създава (или премахва) UILabel-ите при нужда.
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
            lbl.numberOfLines = 0
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
    
    // MARK: - Обновяване на атрибутния текст (дата + иконка + температурен диапазон)
    
    private func updateTexts() {
        let df = DateFormatter()
        df.dateFormat = "EEE, d MMM"
        
        let todayOnly = calendarForLabels.startOfDay(for: Date())
        
        for i in 0..<labels.count {
            let lbl = labels[i]
            
            guard let currentDay = calendarForLabels.date(byAdding: .day, value: i, to: fromDateOnly) else {
                lbl.attributedText = NSAttributedString(string: "??")
                continue
            }
            
            let isToday = (calendarForLabels.startOfDay(for: currentDay) == todayOnly)
            let baseAttributes: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 12, weight: .semibold),
                .foregroundColor: isToday ? UIColor.systemOrange : UIColor.label
            ]
            let tempAttributes: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 10, weight: .regular)
            ]
            
            let dateString = df.string(from: currentDay)
            let baseAttrStr = NSAttributedString(string: dateString, attributes: baseAttributes)
            let completeAttrStr = NSMutableAttributedString(attributedString: baseAttrStr)
            
            if let forecasts = dailyForecasts {
                let dayStart = calendarForLabels.startOfDay(for: currentDay)
                if let forecast = forecasts.first(where: { calendarForLabels.isDate($0.date, inSameDayAs: dayStart) }) {
                    completeAttrStr.append(NSAttributedString(string: "\n", attributes: baseAttributes))
                    
                    let finalSymbolName = fillSymbolNameIfAvailable(forecast.symbol)
                    
                    if let iconImage = UIImage(systemName: finalSymbolName) {
                        let attachment = NSTextAttachment()
                        let defaultDesiredHeight: CGFloat = 16
                        // Проверяваме оригиналния символ, за да избегнем проблема с "cloud.fill"
                        let desiredHeight: CGFloat = (forecast.symbol == "cloud") ? defaultDesiredHeight - 3 : defaultDesiredHeight
                        let originalSize = iconImage.size
                        let aspectRatio = originalSize.width / originalSize.height
                        let newWidth = desiredHeight * aspectRatio
                        let yOffset: CGFloat =  -3

                        if traitCollection.userInterfaceStyle == .dark {
                            let multicolorIcon = iconImage.withRenderingMode(.alwaysOriginal)
                            attachment.image = multicolorIcon
                        } else {
                            let paletteConfig = paletteConfiguration(for: forecast.symbol)
                            if let paletteIcon = iconImage.applyingSymbolConfiguration(paletteConfig) {
                                attachment.image = paletteIcon
                            } else {
                                let tintedIcon = iconImage.withTintColor(.systemBlue, renderingMode: .alwaysOriginal)
                                attachment.image = tintedIcon
                            }
                        }

                        attachment.bounds = CGRect(x: 0, y: yOffset, width: newWidth, height: desiredHeight)
                        completeAttrStr.append(NSAttributedString(attachment: attachment))
                    }

                    
                    completeAttrStr.append(NSAttributedString(string: " ", attributes: baseAttributes))
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
    
    // MARK: - Помощни функции за иконите
    
    /// Проверява дали има наличен ".fill" вариант за дадения символ.
    /// Ако има, връща fill варианта, иначе – оригиналния.
    private func fillSymbolNameIfAvailable(_ symbolName: String) -> String {
        let fillVariant = symbolName + ".fill"
        if UIImage(systemName: fillVariant) != nil {
            return fillVariant
        }
        return symbolName
    }
    
    /// Връща конфигурация на палитрата в зависимост от името на иконата.
    private func paletteConfiguration(for iconName: String) -> UIImage.SymbolConfiguration {
        let paletteColors: [UIColor]
        switch iconName {
        case "sun.max", "sunrise":
            paletteColors = [.systemOrange, .systemOrange]
        case "sunset":
            paletteColors = [.systemOrange, .systemRed]
        case "cloud.sun":
            paletteColors = [.systemGray, .systemOrange]
        case "cloud":
            paletteColors = [.systemGray]
        case "cloud.rain":
            paletteColors = [.systemGray, .systemIndigo]
        case "cloud.drizzle":
            paletteColors = [.systemGray, .systemIndigo]
        case "cloud.heavyrain", "cloud.rain.heavy":
            paletteColors = [.systemGray, .systemIndigo]
        case "cloud.bolt":
            paletteColors = [.systemGray, .systemOrange]
        case "cloud.snow":
            paletteColors = [.systemGray, .systemGray]
        case "wind":
            paletteColors = [.systemGray]
        case "cloud.fog", "fog":
            paletteColors = [.systemGray, .systemGray]
        case "smoke":
            paletteColors = [.systemGray, .systemGray]
        case "haze":
            paletteColors = [.systemGray, .systemGray]
        case "mist":
            paletteColors = [.systemGray, .systemBlue]
        case "cloud.sun.rain":
            paletteColors = [.systemGray, .systemOrange]
        case "cloud.sun.bolt":
            paletteColors = [.systemGray, .systemOrange, .systemOrange]
        case "tornado":
            paletteColors = [.systemGray]
        case "wind.snow":
            paletteColors = [.systemGray, .systemGray]
        case "moon", "moon.fill":
            paletteColors = [.systemBlue, .systemBlue]
        case "moon.stars":
            paletteColors = [.systemBlue, .systemOrange]
        case "cloud.moon.fill":
            paletteColors = [.systemGray, .systemBlue, .systemGray]
        case "cloud.moon":
            paletteColors = [.systemGray, .systemBlue]
        default:
            paletteColors = [.systemBlue]
        }
        return UIImage.SymbolConfiguration(paletteColors: paletteColors)
    }
    
    // MARK: - Разположение на лейбълите
    
    public override func layoutSubviews() {
        super.layoutSubviews()
        for (i, lbl) in labels.enumerated() {
            let x = leadingInsetForHours + CGFloat(i) * dayColumnWidth
            lbl.frame = CGRect(x: x, y: 0, width: dayColumnWidth, height: bounds.height)
        }
    }
}
