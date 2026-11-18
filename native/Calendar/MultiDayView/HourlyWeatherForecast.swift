import UIKit

/// Модел за прогнозна информация за един часов интервал
public struct HourlyWeatherForecast {
    let hour: Int           // Часът (0...23)
    let iconName: String    // Името на SFSymbol иконата, напр. "cloud.sun" или "wind"
    let temperature: Double // Прогнозирана температура
}

public final class HoursColumnWeatherView: UIView {
    
    /// Височина на един "час" в пиксели
    public var hourHeight: CGFloat = 50
    
    /**
     Отстъп отгоре и отдолу, за да не се реже текстът за 0‑вия и 24‑ия час.
     */
    public var extraMarginTopBottom: CGFloat = 10
    
    /// Флаг дали текущият ден е в обхвата (за показване на маркер за текущия час)
    public var isCurrentDayInWeek: Bool = false
    
    /// Ако е зададено, визуализира маркер за текущия час
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
        backgroundColor = .clear
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .clear
    }
    
    func updateForecast(for selectedDay: Date?) {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let limit = calendar.date(byAdding: .day, value: 10, to: today)!
        displayWeatherForecast = selectedDay.map { today <= $0 && $0 < limit } ?? false
        hourlyWeatherForecasts = displayWeatherForecast ? WeatherKitViewModel.shared.hourlyForecast.compactMap { item in
            guard let selectedDay, calendar.isDate(item.date, inSameDayAs: selectedDay) else { return nil }
            return HourlyWeatherForecast(hour: calendar.component(.hour, from: item.date),
                                         iconName: item.symbol, temperature: item.temp)
        } : nil
        setNeedsDisplay()
    }

    // MARK: - Draw
    
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard UIGraphicsGetCurrentContext() != nil else { return }
        let isRTL = effectiveUserInterfaceLayoutDirection == .rightToLeft
        
        // Широчина на зоната за прогнозна информация (вляво)
        let forecastAreaWidth: CGFloat = displayWeatherForecast ? 40 : 0
        
        // 1) Изчисляваме текущата позиция (в дробни часове).
        let fractionCur: CGFloat = -1
        // 1a) Закръгляме до най-близкия цял час (примерно ако е 3.75 => 4)
        let currentHourApprox = (fractionCur >= 0) ? Int(round(fractionCur)) : -1
        
        // 2) Рисуваме часовите линии и надписи (0 до 24)
        // (тук може да добавите кода за часовите линии и надписи, ако е необходимо)
        
        // 3) Рисуваме прогнозните иконки и температури
        if displayWeatherForecast, let forecasts = hourlyWeatherForecasts {
            for forecast in forecasts {
                
                // Пропускаме часа, ако е текущ (близък до този час)
                if currentHourApprox >= 0, forecast.hour == currentHourApprox {
                    continue
                }
                
                // Вертикална позиция на прогноза за даден час
                let yCenter = extraMarginTopBottom + CGFloat(forecast.hour) * hourHeight
                
                // Подготовка на температурата (напр. "23°")
                let tempText = localizedFormat("%.0f°", forecast.temperature)
                let tempAttributes: [NSAttributedString.Key: Any] = [
                    .font: UIFont.systemFont(ofSize: 10, weight: .regular),
                    .foregroundColor: UIColor.label
                ]
                let tempAttrStr = NSAttributedString(string: tempText, attributes: tempAttributes)
                let tempTextSize = tempAttrStr.size()
                
                // Опит за намиране на fill вариант за иконата
                let finalIconName = fillSymbolNameIfAvailable(forecast.iconName)
                
                // Задаваме фиксирана ширина на иконата и изчисляваме височината спрямо аспектното съотношение
                let fixedWidth: CGFloat = 20
                if let iconImage = UIImage(systemName: finalIconName) {
                    
                    let originalSize = iconImage.size
                    let aspectRatio = originalSize.height / originalSize.width
                    let newHeight = fixedWidth * aspectRatio
                    
                    // Позициониране на иконата (с фиксиран offset)
                    let iconX = (forecastAreaWidth - fixedWidth) / 2 + 15
                    let resolvedIconX = isRTL
                        ? bounds.width - iconX - fixedWidth
                        : iconX
                    let iconTopY = yCenter - newHeight / 2
                    let iconRect = CGRect(x: resolvedIconX,
                                          y: iconTopY + 20,
                                          width: fixedWidth,
                                          height: newHeight)
                    
                    if traitCollection.userInterfaceStyle == .dark {
                        // В тъмна тема използваме оригиналната икона с нейния многотоцветен вариант
                        let multicolorIcon = iconImage.withRenderingMode(.alwaysOriginal)
                        multicolorIcon.draw(in: iconRect)
                    } else {
                        // В светла тема, прилагаме различна палитра в зависимост от името на иконата.
                        let paletteConfig = paletteConfiguration(for: forecast.iconName)
                        if let paletteIcon = iconImage.applyingSymbolConfiguration(paletteConfig) {
                            paletteIcon.draw(in: iconRect)
                        } else {
                            // Ако приложението на палитрата не успее, използваме едноцветно оцветяване като резервен вариант.
                            let tintedIcon = iconImage.withTintColor(.systemBlue, renderingMode: .alwaysOriginal)
                            tintedIcon.draw(in: iconRect)
                        }
                    }
                    
                    // Центрираме текста за температура спрямо центъра на иконата
                    let verticalSpacing: CGFloat = 2
                    let textX = iconRect.midX - tempTextSize.width / 2
                    let textY = iconRect.maxY + verticalSpacing
                    tempAttrStr.draw(at: CGPoint(x: textX, y: textY))
                }
            }
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
    
    /// Връща конфигурация на палитра в зависимост от името на иконата.
    /// Този пример използва няколко различни случая за икони, които могат да се върнат от WeatherKit.
    /// API‑то за палитра на SFSymbols е налично от iOS 15.
    private func paletteConfiguration(for iconName: String) -> UIImage.SymbolConfiguration {
        UIImage.SymbolConfiguration(paletteColors: timelineWeatherColors(iconName, hourly: true))
    }

}
