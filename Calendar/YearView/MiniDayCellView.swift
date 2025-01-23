import SwiftUI
import EventKit

struct MiniDayCellView: View {
    let day: Date
    let referenceMonth: Date
    let events: [EKEvent]
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        // Проверки
        let isToday = calendar.isDateInToday(day)
        let isInCurrentMonth = calendar.isDate(day, equalTo: referenceMonth, toGranularity: .month)
        let dayNumber = calendar.component(.day, from: day)

        ZStack(alignment: .top) {
            // 1) Кръг за „днес“ (ако е днешна дата)
            if isToday {
                Circle()
                    .fill(Color.red)
                    .frame(width: 28, height: 28)
                    .offset(y: 1) // може леко да го поместите
            }

            // 2) Цифрата на деня (винаги на една и съща позиция)
            Text("\(dayNumber)")
                .font(.system(size: 12))
                .foregroundColor(
                    isToday
                    ? Color.white
                    : (isInCurrentMonth ? Color.primary : Color.gray)
                )
                .frame(height: 28, alignment: .center)
                // alignment: .center, за да е центрирана в рамката

            // 3) Ако има събития, малка точка отдолу
            if !events.isEmpty {
                Circle()
                    .fill(Color.red)
                    .frame(width: 4, height: 4)
                    // Слагаме я под цифрата, например на +20 пиксела
                    .offset(y: 20)
            }
        }
        // Даваме фиксирана рамка за всяка клетка
        // Така всички цифри и точки се подравняват по редове/колони.
        .frame(width: 30, height: 32)
    }
}
