import UIKit

// =====================================================================
// MARK: - MonthYearPickerView (за избор на месец/година)
// =====================================================================
public class MonthYearPickerView: UIPickerView, UIPickerViewDataSource, UIPickerViewDelegate {

    // Масив с месеци (12)
    private let months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    // Диапазон години (примерен: –9999...9999)
    public var years: [Int] = []

    // „Умножители“ за циклично превъртане
    private let monthRowsMultiplier = 10_000
    private let yearRowsMultiplier = 1_000

    // Индекси на текущо избрания месец/година
    private(set) var selectedMonthIndex = 0
    private(set) var selectedYearIndex = 0

    // Callback при промяна на месец/година
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
        
        // Пълен набор от години
        self.years = Array(1970...3000)
    }

    // MARK: - UIPickerViewDataSource
    public func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 2 // [0: Месец], [1: Година]
    }

    public func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        if component == 0 {
            return months.count * monthRowsMultiplier
        } else {
            return years.count * yearRowsMultiplier
        }
    }

    // MARK: - UIPickerViewDelegate
    public func pickerView(_ pickerView: UIPickerView,
                           titleForRow row: Int,
                           forComponent component: Int) -> String? {
        if component == 0 {
            let mIndex = row % months.count
            return months[mIndex]
        } else {
            let yIndex = row % years.count
            let realYear = years[yIndex]
            return "\(realYear)"
        }
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

    // Позициониране на (month, year)
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
