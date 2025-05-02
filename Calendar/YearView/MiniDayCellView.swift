// MiniDayCellView.swift
import SwiftUI
import EventKit

struct MiniDayCellView: View {
    let day: Date
    let referenceMonth: Date
    let events: [EKEvent]
    
    // Използваме глобалния календар, зададен от потребителя
    private var calendar: Calendar {
        var cal = Calendar.current
        cal.firstWeekday = GlobalState.firstWeekday
        if !GlobalState.region.isEmpty {
            cal.locale = Locale(identifier: GlobalState.region)
        }
        return cal
    }
    
    var body: some View {
        let isToday = calendar.isDateInToday(day)
        let isInCurrentMonth = calendar.isDate(day, equalTo: referenceMonth, toGranularity: .month)
        let dayNumber = calendar.component(.day, from: day)
        
        let distinctColors: [UIColor] = {
            let cals = events.compactMap { $0.calendar }
            let unique = Set(cals.map { $0.cgColor ?? UIColor.systemGray.cgColor })
            return unique.map { UIColor(cgColor: $0) }
        }()
        
        let colorChunks: [[UIColor]] = stride(from: 0, to: distinctColors.count, by: 3).map {
            Array(distinctColors[$0..<min($0+3, distinctColors.count)])
        }
        
        ZStack(alignment: .top) {
            if isToday {
                Circle()
                    .fill(Color.red)
                    .frame(width: 28, height: 28)
                    .offset(y: 1)
            }
            
            Text("\(dayNumber)")
                .font(.system(size: 12))
                .foregroundColor(
                    isToday
                        ? .white
                        : (isInCurrentMonth ? .primary : .gray)
                )
                .frame(height: 28, alignment: .center)
            
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
                .offset(y: 20)
            }
        }
        .frame(width: 24, height: 28)
    }
}
