//
//  HourlyWeatherForecast.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 15/4/25.
//


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
        backgroundColor = .clear
    }
    
    public required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .clear
    }
    
    // MARK: - Draw
    
    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard UIGraphicsGetCurrentContext() != nil else { return }
        
        // Широчина на зоната за прогнозна информация (вляво)
        let forecastAreaWidth: CGFloat = displayWeatherForecast ? 40 : 0
        
        // 1) Изчисляваме текущата позиция (в дробни часове).
        let fractionCur: CGFloat = -1
        // 1a) Закръгляме до най-близкия цял час (примерно ако е 3.75 => 4)
        let currentHourApprox = (fractionCur >= 0) ? Int(round(fractionCur)) : -1
        
        // 2) Рисуваме часовите линии и надписи (0 до 24)

        
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
                let tempText = String(format: "%.0f°", forecast.temperature)
                let tempAttributes: [NSAttributedString.Key: Any] = [
                    .font: UIFont.systemFont(ofSize: 10, weight: .regular),
                    .foregroundColor: UIColor.label
                ]
                let tempAttrStr = NSAttributedString(string: tempText, attributes: tempAttributes)
                let tempTextSize = tempAttrStr.size()
                
                // Опит за намиране на fill вариант за иконата
                let finalIconName = fillSymbolNameIfAvailable(forecast.iconName)
                
                if let iconImage = UIImage(systemName: finalIconName)?
                    .withTintColor(.systemBlue, renderingMode: .alwaysOriginal) {
                    
                    // Задаваме фиксирана ширина на иконата и изчисляваме височината спрямо аспектното съотношение
                    let fixedWidth: CGFloat = 20
                    let originalSize = iconImage.size
                    let aspectRatio = originalSize.height / originalSize.width
                    let newHeight = fixedWidth * aspectRatio
                    
                    // Връщаме иконката към оригиналното й положение (с offset -8)
                    let iconX = (forecastAreaWidth - fixedWidth) / 2
                    let iconTopY = yCenter - newHeight / 2
                    
                    let iconRect = CGRect(x: iconX + 15,
                                          y: iconTopY + 20,
                                          width: fixedWidth,
                                          height: newHeight)
                    iconImage.draw(in: iconRect)
                    
                    // Центрираме температурата спрямо центъра на иконата
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
}
