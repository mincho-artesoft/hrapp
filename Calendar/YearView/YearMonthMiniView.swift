import SwiftUI
import EventKit

struct YearMonthMiniView: View {
    let monthDate: Date
    let eventsByDay: [Date: [EKEvent]]
    let onMonthTapped: (Date) -> Void
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        VStack(spacing: 6) {
            // Име на месеца, напр. "Jan"
            Text(monthName(monthDate))
                .font(.headline)
            
            // Генерираме всички дни на месеца
            let daysInMonth = generateDaysInMonth(for: monthDate)
            
            // 7 колони
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 6) {
                ForEach(daysInMonth, id: \.self) { day in
                    let dayKey = calendar.startOfDay(for: day)
                    let dayEvents = eventsByDay[dayKey] ?? []
                    
                    MiniDayCellView(day: day, events: dayEvents)
                        .frame(width: 22, height: 22)  // по-големи дни
                }
            }
            
            Spacer(minLength: 0)
        }
        .padding(6)
        // Цялата област на месеца може да се клика
        .contentShape(Rectangle())
        .onTapGesture {
            onMonthTapped(monthDate)
        }
    }
    
    private func monthName(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "MMM" // Jan, Feb...
        return df.string(from: date)
    }
    
    private func generateDaysInMonth(for date: Date) -> [Date] {
        guard let range = calendar.range(of: .day, in: .month, for: date) else {
            return []
        }
        
        var result = [Date]()
        for dayNumber in range {
            var comps = calendar.dateComponents([.year, .month, .day], from: date)
            comps.day = dayNumber
            if let fullDate = calendar.date(from: comps) {
                result.append(fullDate)
            }
        }
        return result
    }
}
