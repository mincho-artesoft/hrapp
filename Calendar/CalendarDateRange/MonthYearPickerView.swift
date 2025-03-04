import UIKit

class MonthYearPickerView: UIPickerView, UIPickerViewDataSource, UIPickerViewDelegate {
    
    let months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    
    var years: [Int] = []
    private(set) var selectedMonthIndex = 0
    private(set) var selectedYearIndex = 0
    
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
        
        // Пример: години от 2020 до 2030
        years = Array(2020...2030)
    }
    
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 2 // [Month] + [Year]
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return (component == 0) ? months.count : years.count
    }
    
    func pickerView(_ pickerView: UIPickerView,
                    titleForRow row: Int,
                    forComponent component: Int) -> String? {
        return (component == 0) ? months[row] : "\(years[row])"
    }
    
    func pickerView(_ pickerView: UIPickerView,
                    didSelectRow row: Int,
                    inComponent component: Int) {
        if component == 0 {
            selectedMonthIndex = row
        } else {
            selectedYearIndex = row
        }
    }
    
    func select(month: Int, year: Int) {
        // month: 1..12, търсим year в масива
        if let yearPos = years.firstIndex(of: year) {
            self.selectRow(month - 1, inComponent: 0, animated: false)
            self.selectRow(yearPos, inComponent: 1, animated: false)
            selectedMonthIndex = month - 1
            selectedYearIndex = yearPos
        }
    }
    
    func getSelectedMonth() -> Int {
        return selectedMonthIndex + 1
    }
    
    func getSelectedYear() -> Int {
        return years[selectedYearIndex]
    }
}
