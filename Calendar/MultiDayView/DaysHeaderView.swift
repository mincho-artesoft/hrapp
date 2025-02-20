import UIKit

public final class DaysHeaderView: UIView {

    public var dayColumnWidth: CGFloat = 100

    // Тук го правим 0 (или нещо много малко)
    public var leadingInsetForHours: CGFloat = 0 // CHANGED

    public var fromDate: Date = Date() {
        didSet { rebuildLabelsIfNeeded() }
    }
    public var toDate: Date = Date() {
        didSet { rebuildLabelsIfNeeded() }
    }

    public var onDayTap: ((Date) -> Void)?

    private var labels: [UILabel] = []
    private var calendarForLabels: Calendar = {
        var cal = Calendar(identifier: .gregorian)
        cal.firstWeekday = 2 // Monday=2
        return cal
    }()

    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .clear
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        backgroundColor = .clear
    }

    private var dayCount: Int {
        let comps = calendarForLabels.dateComponents([.day], from: fromDateOnly, to: toDateOnly)
        return (comps.day ?? 0) + 1
    }

    private var fromDateOnly: Date {
        calendarForLabels.startOfDay(for: fromDate)
    }
    private var toDateOnly: Date {
        calendarForLabels.startOfDay(for: toDate)
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
            lbl.font = .systemFont(ofSize: 12, weight: .semibold)
            lbl.textColor = .label
            lbl.tag = i

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
        let df = DateFormatter()
        df.dateFormat = "EEE, d MMM"

        let todayOnly = calendarForLabels.startOfDay(for: Date())

        for i in 0..<labels.count {
            let lbl = labels[i]
            guard let currentDay = calendarForLabels.date(byAdding: .day, value: i, to: fromDateOnly) else {
                lbl.text = "??"
                continue
            }
            lbl.text = df.string(from: currentDay)

            let dayOnly = calendarForLabels.startOfDay(for: currentDay)
            lbl.textColor = (dayOnly == todayOnly) ? .systemOrange : .label
        }
    }

    public override func layoutSubviews() {
        super.layoutSubviews()

        for (i, lbl) in labels.enumerated() {
            let x = leadingInsetForHours + CGFloat(i)*dayColumnWidth
            lbl.frame = CGRect(x: x, y: 0, width: dayColumnWidth, height: bounds.height)
        }
    }
}
