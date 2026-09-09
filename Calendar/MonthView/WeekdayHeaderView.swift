import SwiftUI

struct WeekdayHeaderView: View {
    @Environment(\.locale) private var locale
    // Вземаме локализирани символи за дните
    private var weekdaySymbols: [String] {
        // Создаваме копие на календара с firstWeekday от GlobalState
        var cal = Calendar.current
        cal.locale = locale
        cal.firstWeekday = GlobalState.firstWeekday
        // Можеш да ползваш shortWeekdaySymbols ("Sun", "Mon", …)
        let symbols = cal.shortWeekdaySymbols  // ["Sun","Mon",…]
        // Завъртаме масива така, че да започва от firstWeekday
        let idx = cal.firstWeekday - 1         // 0-базирано
        return Array(symbols[idx...] + symbols[..<idx])
    }
    
    var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(weekdaySymbols.enumerated()), id: \.offset) { _, dayName in
                Text(dayName)
                    .font(.caption)
                    .adaptiveSingleLine(minimumScale: 0.4)
                    .frame(maxWidth: .infinity)
            }
        }
    }
}
