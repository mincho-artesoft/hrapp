import UIKit

public final class DaysHeaderView: UIView {

    public var dayColumnWidth: CGFloat = 100
    public var leadingInsetForHours: CGFloat = 70

    /// Начална и крайна дата на диапазона, който ще се показва
    public var fromDate: Date = Date() {
        didSet { rebuildLabelsIfNeeded() }
    }
    public var toDate: Date = Date() {
        didSet { rebuildLabelsIfNeeded() }
    }

    /// При тап върху даден ден
    public var onDayTap: ((Date) -> Void)?

    // Динамично създаваме label-ове според броя дни в диапазона
    private var labels: [UILabel] = []
    private var calendarForLabels: Calendar = {
        var cal = Calendar(identifier: .gregorian)
        // Monday = 2 (ако искате понеделник да е първи ден)
        cal.firstWeekday = 2
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

    // Колко дни обхваща диапазонът
    private var dayCount: Int {
        let comps = calendarForLabels.dateComponents([.day], from: fromDateOnly, to: toDateOnly)
        // +1 за да включим и крайния ден
        return (comps.day ?? 0) + 1
    }

    /// Изчисляваме “start of day” за fromDate / toDate, за да избегнем часове
    private var fromDateOnly: Date {
        calendarForLabels.startOfDay(for: fromDate)
    }
    private var toDateOnly: Date {
        calendarForLabels.startOfDay(for: toDate)
    }

    // Ако броят на label-ите се е променил, строим наново
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
        // Премахваме старите
        labels.forEach { $0.removeFromSuperview() }
        labels.removeAll()

        // Създаваме нужния брой
        for i in 0..<needed {
            let lbl = UILabel()
            lbl.textAlignment = .center
            lbl.font = .systemFont(ofSize: 12, weight: .semibold)
            lbl.textColor = .label
            lbl.tag = i

            // Tap gesture
            lbl.isUserInteractionEnabled = true
            let tapGR = UITapGestureRecognizer(target: self, action: #selector(handleLabelTap(_:)))
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

    // Обновяваме текстовете в label-ите
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

            // Оцветяваме, ако е днешния ден
            let dayOnly = calendarForLabels.startOfDay(for: currentDay)
            if dayOnly == todayOnly {
                lbl.textColor = .systemOrange
            } else {
                lbl.textColor = .label
            }
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
