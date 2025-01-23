import SwiftUI
import EventKit

struct MiniDayCellView: View {
    let day: Date
    let referenceMonth: Date
    let events: [EKEvent]
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        let isToday = calendar.isDateInToday(day)
        let isInCurrentMonth = calendar.isDate(day, equalTo: referenceMonth, toGranularity: .month)
        let dayNumber = calendar.component(.day, from: day)
        
        ZStack(alignment: .top) {
            // Ако е днешна дата -> червен кръг отзад
            if isToday {
                Circle()
                    .fill(Color.red)
                    .frame(width: 28, height: 28)
                    .offset(y: 1)
            }
            
            // Цифрата
            Text("\(dayNumber)")
                .font(.system(size: 12))
                .foregroundColor(
                    isToday
                        ? .white
                        : (isInCurrentMonth ? .primary : .gray)
                )
                .frame(height: 28, alignment: .center)
            
            // Ако има събития -> точка отдолу
            if !events.isEmpty {
                if isToday {
                    // Ако е днешен ден И има събития -> бяла точка
                    Circle()
                        .fill(Color.white)
                        .frame(width: 4, height: 4)
                        .offset(y: 20)
                } else {
                    // Иначе стандартна червена точка (или какъвто цвят искате)
                    Circle()
                        .fill(Color.red)
                        .frame(width: 4, height: 4)
                        .offset(y: 20)
                }
            }
        }
        // Фиксирана рамка, за да са дните на една линия
        .frame(width: 30, height: 32)
    }
}
