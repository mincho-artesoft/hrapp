import UIKit

public class MonthYearPickerView: UIPickerView, UIPickerViewDataSource, UIPickerViewDelegate {

    // Масив с месеци (12)
    private let months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    // Масив от години (примерно 2020..2030)
    public var years: [Int] = []

    // „Умножители“ за циклично превъртане
    private let monthRowsMultiplier = 10_000
    private let yearRowsMultiplier = 10_000

    // Тук пазим кой месец/година (по индекс в масивите) е избран
    private(set) var selectedMonthIndex = 0
    private(set) var selectedYearIndex = 0

    // Този closure ще извикваме, когато се смени нещо в UIPickerView
    public var onDateChanged: ((Int, Int) -> Void)?

    // MARK: - Init
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
        // Примерно: години от 2020 до 2030
        self.years = Array(2020...2030)
    }

    // MARK: - UIPickerViewDataSource
    public func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 2 // 0=Months, 1=Years
    }

    public func pickerView(_ pickerView: UIPickerView,
                           numberOfRowsInComponent component: Int) -> Int {
        if component == 0 {
            // Месеци
            return months.count * monthRowsMultiplier
        } else {
            // Години
            return years.count * yearRowsMultiplier
        }
    }

    // MARK: - UIPickerViewDelegate
    public func pickerView(_ pickerView: UIPickerView,
                           titleForRow row: Int,
                           forComponent component: Int) -> String? {
        if component == 0 {
            let actualMonthIndex = row % months.count
            return months[actualMonthIndex]
        } else {
            let actualYearIndex = row % years.count
            return "\(years[actualYearIndex])"
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

    // MARK: - Позициониране на picker-а на определен (month, year)
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
