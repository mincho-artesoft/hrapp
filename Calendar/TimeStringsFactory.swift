import Foundation

/// Фабрика за генериране на низове (часове/минути) през различни интервали.
struct TimeStringsFactory {
    private let calendar: Calendar

    init(_ calendar: Calendar = Calendar.autoupdatingCurrent) {
        self.calendar = calendar
    }

    /// През 1 час, 24-часов формат: ["00:00", "01:00", ... , "23:00", "24:00"]
    func makeHourlyStrings24h() -> [String] {
        var result = [String]()
        for hour in 0...24 {
            let hh = hour < 10 ? "0\(hour)" : "\(hour)"
            result.append("\(hh):00")
        }
        return result
    }

    /// През 5 мин: 24 часа * (60 / 5) = 288 записа: 00:00, 00:05, 00:10, ..., 23:55
    func make5MinStrings24h() -> [String] {
        var result = [String]()
        
        // "Първи момент" на деня – 00:00
        guard let startOfDay = calendar.date(bySettingHour: 0,
                                             minute: 0,
                                             second: 0,
                                             of: Date())
        else {
            return []
        }

        let formatter = DateFormatter()
        formatter.calendar = calendar
        formatter.dateFormat = "HH:mm"
        
        for step in 0..<288 {
            if let d = calendar.date(byAdding: .minute, value: step * 5, to: startOfDay) {
                result.append(formatter.string(from: d))
            }
        }
        return result
    }
}
