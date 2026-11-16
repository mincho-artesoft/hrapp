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
          // 1. Първи ден от месеца (00:00)
          guard let monthStart = date(from: dateComponents([.year, .month], from: referenceDate)) else {
              return []
          }
          
          // 2. В кой ден от седмицата е monthStart? (1…7)
          let weekdayOfMonthStart = component(.weekday, from: monthStart)
          
          // 3. Колко дни да изместим назад, за да стигнем до firstWeekday?
          //    Използваме +7 % 7, за да получим стойност в [0…6].
          let daysToPrepend = (weekdayOfMonthStart - firstWeekday + 7) % 7
          
          // 4. Изчисляваме началната дата за grid-а
          guard let gridStart = date(byAdding: .day, value: -daysToPrepend, to: monthStart) else {
              return []
          }
          
          // 5. Създаваме точно 42 последователни дати (6 седмици × 7 дни)
          return (0..<42).compactMap { offset in
              date(byAdding: .day, value: offset, to: gridStart)
          }
      }
}


