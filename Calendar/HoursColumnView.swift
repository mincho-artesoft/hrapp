//
//  HoursColumnView.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 27/1/25.
//


import UIKit

/// Лява колона (часове) от 0..24. Ако `isCurrentDayInWeek=false`, не рисува червено време.
public final class HoursColumnView: UIView {

    public var hourHeight: CGFloat = 50
    public var font = UIFont.systemFont(ofSize: 12, weight: .medium)
    public var topOffset: CGFloat = 0

    public var isCurrentDayInWeek: Bool = false
    public var currentTime: Date? = nil

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .white
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .white
    }

    public override func draw(_ rect: CGRect) {
        super.draw(rect)
        guard let ctx = UIGraphicsGetCurrentContext() else { return }

        let cal = Calendar.current
        let baseDate = cal.startOfDay(for: Date())

        // Стил за черни часове
        let blackAttrs: [NSAttributedString.Key: Any] = [
            .foregroundColor: UIColor.label,
            .font: font
        ]

        // (1) Ако isCurrentDayInWeek=true => вадим позиция за "червен час"
        var currentTimeRect: CGRect? = nil
        if isCurrentDayInWeek, let now = currentTime {
            let hour = CGFloat(cal.component(.hour, from: now))
            let minute = CGFloat(cal.component(.minute, from: now))
            let fraction = hour + minute/60.0
            let yNow = topOffset + fraction*hourHeight

            let timeFormatter = DateFormatter()
            timeFormatter.timeStyle = .short
            let nowString = timeFormatter.string(from: now)

            let redAttrs: [NSAttributedString.Key: Any] = [
                .foregroundColor: UIColor.systemRed,
                .font: UIFont.systemFont(ofSize: 12, weight: .semibold)
            ]
            let size = nowString.size(withAttributes: redAttrs)
            let textX: CGFloat = 8
            let textY: CGFloat = yNow - size.height/2
            currentTimeRect = CGRect(x: textX, y: textY, width: size.width, height: size.height)
        }

        // (2) Рисуваме 0..24 часа в черно, пропускаме ако се застъпват с червения
        for hour in 0...24 {
            let y = topOffset + CGFloat(hour)*hourHeight
            let date = cal.date(byAdding: .hour, value: hour, to: baseDate)!
            let df = DateFormatter()
            df.dateFormat = "h:00 a"

            let text = df.string(from: date)
            let size = text.size(withAttributes: blackAttrs)
            let textRect = CGRect(x: 8, y: y - size.height/2,
                                  width: size.width, height: size.height)

            if let cRect = currentTimeRect, textRect.intersects(cRect) {
                // Ако се засича, пропускаме
                continue
            }

            text.draw(in: textRect, withAttributes: blackAttrs)
        }

        // (3) Накрая рисуваме червения час (ако inWeek=true)
        if isCurrentDayInWeek, let now = currentTime, let cRect = currentTimeRect {
            let timeFormatter = DateFormatter()
            timeFormatter.timeStyle = .short
            let nowString = timeFormatter.string(from: now)

            let redAttrs: [NSAttributedString.Key: Any] = [
                .foregroundColor: UIColor.systemRed,
                .font: UIFont.systemFont(ofSize: 12, weight: .semibold)
            ]
            nowString.draw(in: cRect, withAttributes: redAttrs)
        }
    }
}
