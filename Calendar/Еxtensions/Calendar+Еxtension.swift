import Foundation

extension Calendar {
    /// Връща 42 дати (6 реда х 7 колони), така че първият ден на месеца
    /// да попада в точната колона за своя делничен ден.
    /// По подразбиране приемаме, че понеделник е първият ден от седмицата.
    func generateDatesForMonthGridAligned(for date: Date) -> [Date] {
        // 1) Намираме "първо число" на дадения месец
        guard let firstOfMonth = self.date(from: self.dateComponents([.year, .month], from: date))
        else { return [] }
        
        // 2) Колко дни има в месеца
        _ = self.range(of: .day, in: .month, for: firstOfMonth)?.count ?? 30
        
        // 3) Определяме деня от седмицата на "първо число".
        //    В зависимост от Locale това може да е 1=Неделя, 2=Понеделник и т.н.
        let weekdayOfFirst = component(.weekday, from: firstOfMonth)
        
        // За да подравним така, че ПОНЕДЕЛНИК да е колона 0,
        // правим изчисление "offset = (weekdayOfFirst + 7 - firstWeekday) % 7".
        // По подразбиране в iOS Calendar "firstWeekday" често е 1 (Неделя),
        // но в БГ обичайно искаме 2 (Понеделник) да е начало. Ето пример:
        let firstWeekday = 2  // 2 = Понеделник, 1 = Неделя...
        let offset = (weekdayOfFirst + 7 - firstWeekday) % 7
        
        // 4) Искаме общо 42 клетки.
        //    Значи след като "първо число" влезе на правилната колона (offset),
        //    трябва да попълним и дните до края, плюс евентуално следващия месец.
        let totalCells = 42
        // Ако един месец има 31 дни и offset=2, тогава са нужни още (42 - 31 - 2) = 9 клетки за следващия месец
        
        // 5) Определяме началната дата в решетката: "firstOfMonth - offset дни"
        guard let startDate = self.date(byAdding: .day, value: -offset, to: firstOfMonth)
        else { return [] }
        
        // 6) Генерираме всички 42 дати
        var result: [Date] = []
        for i in 0..<totalCells {
            if let someDay = self.date(byAdding: .day, value: i, to: startDate) {
                result.append(someDay)
            }
        }
        
        return result
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


