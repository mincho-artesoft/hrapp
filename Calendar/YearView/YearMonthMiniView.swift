import SwiftUI
import EventKit

struct YearMonthMiniView: View {
    let monthDate: Date
    let eventsByDay: [Date: [EKEvent]]
    let onMonthTapped: (Date) -> Void
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        VStack(spacing: 6) {
            // Име на месеца (напр. "Jan")
            Text(monthName(monthDate))
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .center)
            
            // Генерираме 42 дати за месеца
            let daysInGrid = calendar.generateDatesForMonthGrid(for: monthDate)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 6) {
                ForEach(daysInGrid, id: \.self) { day in
                    let dayKey = calendar.startOfDay(for: day)
                    let dayEvents = eventsByDay[dayKey] ?? []
                    
                    MiniDayCellView(day: day,
                                    referenceMonth: monthDate,
                                    events: dayEvents)
                }
            }
        }
        .padding(6)
        .contentShape(Rectangle()) // цялото е кликаемо
        .onTapGesture {
            onMonthTapped(monthDate)
        }
    }
    
    private func monthName(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "MMM" // "Jan", "Feb" и т.н.
        // Ако искате пълно име: df.dateFormat = "LLLL" (January, February...)
        return df.string(from: date)
    }
}
