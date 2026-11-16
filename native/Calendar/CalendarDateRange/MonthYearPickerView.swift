import UIKit

// =====================================================================
// MARK: - MonthYearPickerView (за избор на месец/година)
// =====================================================================
public class MonthYearPickerView: UIPickerView, UIPickerViewDataSource, UIPickerViewDelegate {

    private lazy var months: [String] = {
        let formatter = DateFormatter()
        formatter.locale = .appFormatting
        return formatter.standaloneMonthSymbols ?? formatter.monthSymbols
    }()

    public var years: [Int] = []
    private let monthRowsMultiplier = 10_000
    private let yearRowsMultiplier = 1_000

    private(set) var selectedMonthIndex = 0
    private(set) var selectedYearIndex = 0

    public var onDateChanged: ((Int, Int) -> Void)?

    override init(frame: CGRect) {
        super.init(frame: frame)
        setup()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setup()
    }

    private func setup() {
        self.dataSource = self
        self.delegate = self
        
        self.years = Array(1970...3000)
    }

    public func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 2
    }

    public func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        if component == 0 {
            return months.count * monthRowsMultiplier
        } else {
            return years.count * yearRowsMultiplier
        }
    }

    public func pickerView(_ pickerView: UIPickerView,
                           viewForRow row: Int,
                           forComponent component: Int,
                           reusing view: UIView?) -> UIView {
        let label = (view as? UILabel) ?? UILabel()
        label.font = .systemFont(ofSize: 20)
        label.textAlignment = .center
        label.textColor = .label
        label.useAdaptiveSingleLine(minimumScale: 0.45)

        if component == 0 {
            let mIndex = row % months.count
            label.text = months[mIndex]
        } else {
            let yIndex = row % years.count
            let realYear = years[yIndex]
            label.text = localizedIntegerString(realYear)
        }
        return label
    }

    public func pickerView(_ pickerView: UIPickerView, widthForComponent component: Int) -> CGFloat {
        component == 0 ? pickerView.bounds.width * 0.62 : pickerView.bounds.width * 0.32
    }

    public func pickerView(_ pickerView: UIPickerView,
                           didSelectRow row: Int,
                           inComponent component: Int) {
        if component == 0 {
            selectedMonthIndex = row % months.count
        } else {
            selectedYearIndex = row % years.count
        }
        let selectedMonth = selectedMonthIndex + 1
        let selectedYear = years[selectedYearIndex]
        onDateChanged?(selectedMonth, selectedYear)
    }

    public func select(month: Int, year: Int, animated: Bool = false) {
        guard let yearPos = years.firstIndex(of: year) else { return }

        let middleMonths = months.count * (monthRowsMultiplier / 2)
        let middleYears = years.count * (yearRowsMultiplier / 2)

        let monthRow = middleMonths + (month - 1)
        let yearRow = middleYears + yearPos

        self.selectRow(monthRow, inComponent: 0, animated: animated)
        self.selectRow(yearRow, inComponent: 1, animated: animated)

        selectedMonthIndex = month - 1
        selectedYearIndex = yearPos
    }
}
