//
//  DaysHeaderView.swift
//  ExampleCalendarApp
//
//  Изписва 7 етикета (Mon 20 Jan, Tue 21 Jan...), започвайки от startOfWeek.
//
import UIKit

public final class DaysHeaderView: UIView {

    public var dayColumnWidth: CGFloat = 100
    public var leadingInsetForHours: CGFloat = 70

    public var startOfWeek: Date = Date() {
        didSet { updateTexts() }
    }

    /// Колбек, който ще извикаме при тап върху даден ден:
    public var onDayTap: ((Date) -> Void)?

    private var labels: [UILabel] = []

    private var calendarForLabels: Calendar = {
        var cal = Calendar(identifier: .gregorian)
        cal.firstWeekday = 2 // Monday start
        return cal
    }()

    public override init(frame: CGRect) {
        super.init(frame: frame)
        configureLabels()
    }
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        configureLabels()
    }

    private func configureLabels() {
        for i in 0..<7 {
            let lbl = UILabel()
            lbl.textAlignment = .center
            lbl.font = .systemFont(ofSize: 12, weight: .semibold)
            lbl.textColor = .label

            // Правим лейбъла интерактивен
            lbl.isUserInteractionEnabled = true
            // Добавяме Tap Gesture
            let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleLabelTap(_:)))
            lbl.addGestureRecognizer(tapGR)
            // Помним кой ден е това чрез lbl.tag
            lbl.tag = i

            labels.append(lbl)
            addSubview(lbl)
        }
    }

    @objc private func handleLabelTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedLabel = gesture.view as? UILabel else { return }
        let dayIndex = tappedLabel.tag

        // Определяме точната дата = startOfWeek + dayIndex дни
        if let tappedDate = calendarForLabels.date(byAdding: .day, value: dayIndex, to: startOfWeek) {
            onDayTap?(tappedDate)
        }
    }

    public override func layoutSubviews() {
        super.layoutSubviews()
        for (i, lbl) in labels.enumerated() {
            let x = leadingInsetForHours + CGFloat(i)*dayColumnWidth
            lbl.frame = CGRect(x: x, y: 0, width: dayColumnWidth, height: bounds.height)
        }
    }

    private func updateTexts() {
        var cal = calendarForLabels
        cal.firstWeekday = 2 // Monday start

        let df = DateFormatter()
        df.dateFormat = "EEE, d MMM"

        let todayStart = cal.startOfDay(for: Date())

        for (i, lbl) in labels.enumerated() {
            if let dayDate = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                lbl.text = df.string(from: dayDate)
                let dayOnly = cal.startOfDay(for: dayDate)
                if dayOnly == todayStart {
                    lbl.textColor = .systemOrange
                } else {
                    lbl.textColor = .label
                }
            } else {
                lbl.text = "??"
            }
        }
    }
}
