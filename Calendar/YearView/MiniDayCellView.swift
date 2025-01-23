import SwiftUI
import EventKit

struct MiniDayCellView: View {
    let day: Date
    let events: [EKEvent]
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        ZStack {
            if isToday {
                Circle()
                    .fill(Color.red)
            }
            
            HStack(spacing: 2) {
                Text("\(calendar.component(.day, from: day))")
                    .font(.system(size: 11)) // малко по-малък, за да пасне
                    .foregroundColor(isToday ? .white : .primary)
                
                if !events.isEmpty {
                    Circle()
                        .fill(Color.red)
                        .frame(width: 4, height: 4)
                }
            }
        }
        // Настройваме, за да е по-лесно клетката да се центрира
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var isToday: Bool {
        calendar.isDateInToday(day)
    }
}
