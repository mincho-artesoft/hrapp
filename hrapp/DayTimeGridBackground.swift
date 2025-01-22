import SwiftUI

/// Simple background lines for a day’s timeline
struct DayTimeGridBackground: View {
    let startHour: Int
    let endHour: Int
    let slotMinutes: Int
    
    var body: some View {
        VStack(spacing: 0) {
            ForEach(hoursArray, id: \.self) { hour in
                HStack {
                    Text("\(hour):00")
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                        .frame(width: 40, alignment: .leading)
                    Divider()
                }
                .frame(height: hourBlockHeight)
            }
        }
    }
    
    private var hoursArray: [Int] {
        return Array(startHour..<endHour)
    }
    
    /// Just a simplistic constant for height
    private var hourBlockHeight: CGFloat {
        60
    }
}
