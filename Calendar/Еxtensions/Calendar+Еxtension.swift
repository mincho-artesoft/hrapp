import Foundation

extension Calendar {
    /// Връща 42 дати (6 реда х 7 колони), така че първият ден на месеца
    /// да попада в точната колона за своя делничен ден.
    /// По подразбиране приемаме, че понеделник е първият ден от седмицата.
    func generateDatesForMonthGridAligned(for date: Date) -> [Date] {
           // 1) Намираме първия ден от самия месец
           guard let startOfMonth = self.date(from: self.dateComponents([.year, .month], from: date)) else {
               return []
           }
           
           // 2) Намираме кой е weekday (1 за неделя, 2 за понеделник и т.н.)
           let weekdayOfFirst = component(.weekday, from: startOfMonth)
           
           // 3) Изчисляваме колко дни да върнем назад,
           //    за да дойде "неделя" (или какъвто е `self.firstWeekday`) в първата колона
           var offset = weekdayOfFirst - firstWeekday
           // Ако излезе отрицателно, връщаме +7
           if offset < 0 {
               offset += 7
           }
           
           // 4) Това ще е реалният старт на нашата "мрежа" (Grid)
           guard let startGrid = self.date(byAdding: .day, value: -offset, to: startOfMonth) else {
               return []
           }
           
           // 5) Връщаме 42 последователни дни (6 реда по 7 колони)
           return (0..<42).compactMap { i in
               self.date(byAdding: .day, value: i, to: startGrid)
           }
       }
    func generateDatesForMonthGrid(for referenceDate: Date) -> [Date] {
        guard let monthStart = self.date(from: dateComponents([.year, .month], from: referenceDate)) else {
            return []
        }

        let weekdayOfMonthStart = component(.weekday, from: monthStart)
        let firstWeekday = self.firstWeekday
        let daysToPrepend = (weekdayOfMonthStart - firstWeekday + 7) % 7

        guard let rangeOfDaysInMonth = range(of: .day, in: .month, for: monthStart) else {
            return []
        }
        let numberOfDaysInMonth = rangeOfDaysInMonth.count

        let totalCells = 42
        let daysToAppend = totalCells - daysToPrepend - numberOfDaysInMonth

        var dates: [Date] = []

        // Previous
        for i in 0..<daysToPrepend {
            if let d = self.date(byAdding: .day, value: i - daysToPrepend, to: monthStart) {
                dates.append(d)
            }
        }
        // Current
        for i in 0..<numberOfDaysInMonth {
            if let d = self.date(byAdding: .day, value: i, to: monthStart) {
                dates.append(d)
            }
        }
        // Next
        for i in 0..<daysToAppend {
            if let d = self.date(byAdding: .day, value: i, to: monthStart.addingTimeInterval(60*60*24*TimeInterval(numberOfDaysInMonth))) {
                dates.append(d)
            }
        }

        return dates
    }
}


