import UIKit

public final class DaysHeaderView: UIView {

    public var dayColumnWidth: CGFloat = 100
    public var leadingInsetForHours: CGFloat = 70

    public var startOfWeek: Date = Date() {
        didSet { updateTexts() }
    }

    public var onDayTap: ((Date) -> Void)?

    private var labels: [UILabel] = []

    private var calendarForLabels: Calendar = {
        var cal = Calendar(identifier: .gregorian)
        // Monday = 2
        cal.firstWeekday = 2
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

            lbl.isUserInteractionEnabled = true
            let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleLabelTap(_:)))
            lbl.addGestureRecognizer(tapGR)
            lbl.tag = i

            labels.append(lbl)
            addSubview(lbl)
        }
    }

    @objc private func handleLabelTap(_ gesture: UITapGestureRecognizer) {
        guard let tappedLabel = gesture.view as? UILabel else { return }
        let dayIndex = tappedLabel.tag

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
        let cal = calendarForLabels
        let df = DateFormatter()
        df.dateFormat = "EEE, d MMM"

        let todayStart = cal.startOfDay(for: Date())

        for i in 0..<7 {
            if let dayDate = cal.date(byAdding: .day, value: i, to: startOfWeek) {
                let dayStr = df.string(from: dayDate)
                labels[i].text = dayStr
                let dayOnly = cal.startOfDay(for: dayDate)
                labels[i].textColor = (dayOnly == todayStart) ? .systemOrange : .label
            } else {
                labels[i].text = "??"
            }
        }
    }
}
