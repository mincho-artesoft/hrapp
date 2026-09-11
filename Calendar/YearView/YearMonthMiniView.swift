import SwiftUI

struct YearMonthMiniView: View {
    let monthDate: Date
    let eventsByDay: [Date: [EventDescriptor]]
    let width: CGFloat
    let onMonthTapped: (Date) -> Void

    @Environment(\.locale) private var locale

    private var calendar: Calendar {
        var cal = Calendar.current
        cal.locale = locale
        cal.firstWeekday = GlobalState.firstWeekday
        return cal
    }

    /// Едно-буквените заглавия на колоните идват от символите на самия
    /// календар, а не от преводен CSV. Преводът можеше да загуби компонент
    /// или да раздели с не-ASCII запетая, а `ForEach(0..<7)` четеше отвъд
    /// края на масива — точно това беше крашът в 1.7.1.
    private var weekdayHeaders: [String] {
        let cal = calendar
        let symbols = cal.veryShortWeekdaySymbols
        guard symbols.count == 7 else { return Array(repeating: "", count: 7) }
        let idx = min(max(cal.firstWeekday - 1, 0), 6)
        return Array(symbols[idx...] + symbols[..<idx])
    }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color(.systemGray6))
                .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)

            VStack(spacing: 8) {
                Text(monthName(monthDate))
                    .font(.headline)
                    .adaptiveSingleLine(minimumScale: 0.5)
                    .padding(.top, 8)

                let allGridDays = calendar.generateDatesForMonthGridAligned(for: monthDate)

                LazyVGrid(
                    columns: Array(repeating: GridItem(.fixed(width == 180 ? 24 : 21), spacing: 1), count: 7),
                    spacing: 1
                ) {
                    // 1) Header на дните
                    ForEach(Array(weekdayHeaders.enumerated()), id: \.offset) { _, symbol in
                        Text(symbol)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .adaptiveSingleLine(minimumScale: 0.4)
                            .frame(maxWidth: .infinity)
                    }

                    // 2) Дни от месеца
                    ForEach(allGridDays, id: \.self) { day in
                        let dayKey = calendar.startOfDay(for: day)
                        let dayEvents = eventsByDay[dayKey] ?? []
                        let isInCurrentMonth = calendar.isDate(day, equalTo: monthDate, toGranularity: .month)

                        if isInCurrentMonth {
                            MiniDayCellView(day: day, referenceMonth: monthDate, events: dayEvents)
                        } else {
                            Rectangle()
                                .fill(Color.clear)
                                .frame(width: 30, height: 32)
                        }
                    }
                }
                .padding(.horizontal, 6)
            }
        }
        .contentShape(Rectangle())
        .onTapGesture { onMonthTapped(monthDate) }
        .frame(width: width, height: 240)
    }

    private func monthName(_ date: Date) -> String {
        appDateFormatter(template: "MMM").string(from: date)
    }
}
