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
        
        // 1) Събираме всички уникални цветове на календарите за събитията в този ден.
        let distinctColors: [UIColor] = {
            let cals = events.compactMap { $0.calendar }
            let unique = Set(cals.map { $0.cgColor ?? UIColor.systemGray.cgColor })
            return unique.map { UIColor(cgColor: $0) }
        }()
        
        // 2) Разделяме масива на парчета (chunk) по 3 елемента.
        let colorChunks: [[UIColor]] = stride(from: 0, to: distinctColors.count, by: 3).map {
            Array(distinctColors[$0..<min($0+3, distinctColors.count)])
        }
        
        return ZStack(alignment: .top) {
            // Ако е днес -> по-голям кръг зад датата
            if isToday {
                Circle()
                    .fill(Color.red)
                    .frame(width: 28, height: 28)
                    .offset(y: 1)
            }
            
            // Числото на деня
            Text("\(dayNumber)")
                .font(.system(size: 12))
                .foregroundColor(
                    isToday
                        ? .white
                        : (isInCurrentMonth ? .primary : .gray)
                )
                .frame(height: 28, alignment: .center)
            
            // 3) Малки точици за всеки календар, подредени в няколко реда.
            if !distinctColors.isEmpty {
                VStack(alignment: .center, spacing: 2) {
                    ForEach(0..<colorChunks.count, id: \.self) { rowIndex in
                        HStack(spacing: 2) {
                            ForEach(colorChunks[rowIndex], id: \.self) { uiColor in
                                Circle()
                                    .fill(Color(uiColor))
                                    .frame(width: 4, height: 4)
                            }
                        }
                    }
                }
                .offset(y: 20) // Местим цялата VStack надолу под датата
            }
        }
        .frame(width: 24, height: 28)
    }
}
