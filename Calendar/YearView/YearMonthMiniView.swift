import SwiftUI
import EventKit

struct YearMonthMiniView: View {
    let monthDate: Date
    let eventsByDay: [Date: [EKEvent]]
    let onMonthTapped: (Date) -> Void
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color(.systemGray6))
                .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
            
            VStack(spacing: 8) {
                // Заглавие на месеца (Jan, Feb...)
                Text(monthName(monthDate))
                    .font(.headline)
                    .padding(.top, 8)
                
                // Генерираме всички 42 дати (с правилно подравняване по делнични дни):
                let allGridDays = calendar.generateDatesForMonthGridAligned(for: monthDate)
                
                LazyVGrid(
                    columns: Array(
                        repeating: GridItem(.flexible(), spacing: 12),
                        count: 7
                    ),
                    spacing: 12
                ) {
                    ForEach(allGridDays, id: \.self) { day in
                        let dayKey = calendar.startOfDay(for: day)
                        let dayEvents = eventsByDay[dayKey] ?? []
                        let isInCurrentMonth = calendar.isDate(day, equalTo: monthDate, toGranularity: .month)
                        
                        if isInCurrentMonth {
                            // Показваме клетка за текущия месец
                            MiniDayCellView(day: day, referenceMonth: monthDate, events: dayEvents)
                        } else {
                            // Или празна клетка (за дните от съседен месец)
                            Text("")
                                .frame(width: 30, height: 32)
                        }
                    }
                }
                .padding(.horizontal, 6)
            }
        }
        // Правим целия блок кликаем
        .contentShape(Rectangle())
        .onTapGesture {
            onMonthTapped(monthDate)
        }
        .frame(width: 180, height: 240)
    }
    
    private func monthName(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "MMM" // "Jan", "Feb", ...
        return df.string(from: date)
    }
}
