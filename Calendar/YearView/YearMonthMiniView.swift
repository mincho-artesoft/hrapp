import SwiftUI
import EventKit

struct YearMonthMiniView: View {
    let monthDate: Date
    let eventsByDay: [Date: [EKEvent]]
    let width: CGFloat
    let onMonthTapped: (Date) -> Void

    private var calendar: Calendar {
        var cal = Calendar.current
        cal.firstWeekday = GlobalState.firstWeekday
        if !GlobalState.region.isEmpty {
            cal.locale = Locale(identifier: GlobalState.region)
        }
        return cal
    }

    // 1) Зареждаме CSV от Localizable.strings
    private var rawSymbols: [String] {
        let csv = NSLocalizedString("weekday.headers", comment: "Comma-separated 1-letter weekday symbols, starting от Sunday")
        return csv
            .split(separator: ",")
            .map { String($0) }
    }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color(.systemGray6))
                .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)

            VStack(spacing: 8) {
                Text(monthName(monthDate))
                    .font(.headline)
                    .padding(.top, 8)

                let allGridDays = calendar.generateDatesForMonthGridAligned(for: monthDate)

                // 2) Завъртаме rawSymbols така, че първият елемент да е съобразен с firstWeekday
                let headers = rawSymbols.rotated(by: calendar.firstWeekday - 1)

                LazyVGrid(
                    columns: Array(repeating: GridItem(.fixed(width == 180 ? 24 : 21), spacing: 1), count: 7),
                    spacing: 1
                ) {
                    // 3) Header на дните
                    ForEach(0..<7) { i in
                        Text(headers[i])
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .frame(maxWidth: .infinity)
                    }

                    // 4) Дни от месеца
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
        let df = DateFormatter()
        df.dateFormat = "MMM"
        return df.string(from: date)
    }
}
