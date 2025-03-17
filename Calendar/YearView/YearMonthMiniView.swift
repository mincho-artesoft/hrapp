import SwiftUI
import EventKit

struct YearMonthMiniView: View {
    let monthDate: Date
    let eventsByDay: [Date: [EKEvent]]
    let onMonthTapped: (Date) -> Void
    
    // Календар, който почва от неделя
    private var sundayStartCalendar: Calendar {
        var cal = Calendar(identifier: .gregorian)
        cal.firstWeekday = 1 // Sunday
        return cal
    }
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color(.systemGray6))
                .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
            
            VStack(spacing: 8) {
                // Заглавие на месеца (Mar)
                Text(monthName(monthDate))
                    .font(.headline)
                    .padding(.top, 8)
                
                // Генерираме 42 дати, ползвайки календар, който започва в неделя
                let allGridDays = sundayStartCalendar.generateDatesForMonthGridAligned(for: monthDate)
                
                // Съкратени имена на дните (почват от Sunday)
                let weekdaySymbols = sundayStartCalendar.shortStandaloneWeekdaySymbols.map {
                    String($0.prefix(1))
                }
                
                LazyVGrid(
                    columns: Array(repeating: GridItem(.fixed(24), spacing: 1), count: 7), spacing: 1
                ) {
                    // Седмичния хедър
                    ForEach(0..<7) { i in
                        Text(weekdaySymbols[i])
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .frame(maxWidth: .infinity)
                    }

                    // Дните от месеца
                    ForEach(allGridDays, id: \.self) { day in
                        let dayKey = sundayStartCalendar.startOfDay(for: day)
                        let dayEvents = eventsByDay[dayKey] ?? []
                        let isInCurrentMonth = sundayStartCalendar.isDate(day, equalTo: monthDate, toGranularity: .month)

                        if isInCurrentMonth {
                            MiniDayCellView(
                                day: day,
                                referenceMonth: monthDate,
                                events: dayEvents
                            )
                        } else {
                            Text("") // Празна клетка за дните, които не са в текущия месец
                                .frame(width: 30, height: 32)
                        }
                    }
                }

                .padding(.horizontal, 6)
            }
        }
        .contentShape(Rectangle())
        .onTapGesture {
            onMonthTapped(monthDate)
        }
        .frame(width: 180, height: 240)
    }
    
    private func monthName(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "MMM"
        return df.string(from: date)
    }
}
