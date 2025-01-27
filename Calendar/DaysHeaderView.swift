//
//  DaysHeaderView.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 27/1/25.
//


import UIKit
import CalendarKit

/// Горна лента с 7 label-а (Mon 1, Tue 2…), за дните от startOfWeek.
public final class DaysHeaderView: UIView {

    public var dayColumnWidth: CGFloat = 100
    public var leadingInsetForHours: CGFloat = 70

    public var startOfWeek: Date = Date() {
        didSet { updateTexts() }
    }

    private var labels: [UILabel] = []

    public override init(frame: CGRect) {
        super.init(frame: frame)
        configureLabels()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        configureLabels()
    }

    private func configureLabels() {
        for _ in 0..<7 {
            let lbl = UILabel()
            lbl.textAlignment = .center
            lbl.font = .systemFont(ofSize: 12, weight: .semibold)
            lbl.textColor = .label
            labels.append(lbl)
            addSubview(lbl)
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
        let cal = Calendar.current
        let df = DateFormatter()
        df.dateFormat = "EEE, d MMM"

        let today = cal.startOfDay(for: Date())

        for (i, lbl) in labels.enumerated() {
            if let dayDate = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                lbl.text = df.string(from: dayDate)

                let dayOnly = cal.startOfDay(for: dayDate)
                if dayOnly == today {
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
