import SwiftUI

struct GenericMonthView<T: CalendarEvent>: View {
    let monthStart: Date
    let events: [T]
    let colorForEvent: (T) -> Color

    @Binding var isDraggingEvent: Bool
    let onDrop: ((T, Date) -> Bool)?

     let calendar = Calendar.current
     let columns = Array(repeating: GridItem(.flexible()), count: 7)

    /// Форматиращ за съкратеното име на деня, напр. "Mon", "Tue" и т.н.
     lazy var dayNameFormatter: DateFormatter = {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "en_US_POSIX")
            formatter.dateFormat = "EEE"
            return formatter
        }()

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 8) {
                ForEach(generateDaysInMonth(), id: \.self) { dayDate in
                    dayCell(dayDate)
                }
            }
            .padding()
        }
        // Забраняваме скролването, когато потребителят мести (драга) ивент.
        .scrollDisabled(isDraggingEvent)
    }

    @ViewBuilder
    private func dayCell(_ dayDate: Date) -> some View {
        let isCurrentMonth = calendar.isDate(dayDate, equalTo: monthStart, toGranularity: .month)
        let dayNum = calendar.component(.day, from: dayDate)
        let dayAbbreviation = DateFormatter.dayNameFormatter.string(from: dayDate)

        VStack(alignment: .leading, spacing: 4) {
            // Показваме число на деня и съкратеното му име
            Text("\(dayNum)")
                .font(.caption)
                .foregroundColor(isCurrentMonth ? .primary : .gray)
            Text(dayAbbreviation)
                .font(.caption2)
                .foregroundColor(isCurrentMonth ? .primary : .gray)

            // Показваме хоризонтални ленти за всяко събитие през този ден
            let dayEvents = events.filter { $0.overlapsDay(dayDate) }
            ForEach(dayEvents) { event in
                let color = colorForEvent(event)
                Rectangle()
                    .fill(color.opacity(0.8))
                    .frame(height: 4)
                    .cornerRadius(2)
                    .padding(.vertical, 1)
                    .draggable(
                        GenericEventTransfer(
                            eventID: event.id as! UUID,
                            originalStart: event.startDate,
                            originalEnd: event.endDate
                        )
                    )
            }
        }
        .padding(4)
        .frame(minHeight: 60)
        .background(Color.gray.opacity(isCurrentMonth ? 0.1 : 0.05))
        .cornerRadius(4)
        // Drop Destination, за да може да пускаме елементи от type GenericEventTransfer
        .dropDestination(for: GenericEventTransfer.self) { items, _ in
            handleDrop(items, dayDate: dayDate)
        }
    }

    private func handleDrop(_ items: [GenericEventTransfer], dayDate: Date) -> Bool {
        guard
            let first = items.first,
            let onDrop else { return false }

        guard let droppedEvent = events.first(where: { $0.id as! UUID == first.eventID }) else {
            return false
        }

        let success = onDrop(droppedEvent, dayDate)
        return success
    }

    private func generateDaysInMonth() -> [Date] {
        guard let range = calendar.range(of: .day, in: .month, for: monthStart) else {
            return []
        }
        // Намираме кой ден от седмицата е първият ден на месеца
        let firstWeekday = calendar.component(.weekday, from: monthStart)
        let leadingSpaces = firstWeekday - 1

        var dates: [Date] = []
        // Добавяме предходните дни (от предишния месец), за да запълним седмицата
        for i in 0..<leadingSpaces {
            if let placeholderDay = calendar.date(byAdding: .day, value: i - leadingSpaces, to: monthStart) {
                dates.append(placeholderDay)
            }
        }
        // Добавяме всички дни от текущия месец
        for day in range {
            if let date = calendar.date(byAdding: .day, value: day - 1, to: monthStart) {
                dates.append(date)
            }
        }
        return dates
    }
}

/// 1) Създавате разширение на DateFormatter
extension DateFormatter {
    static let dayNameFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "EEE"  // "Mon", "Tue", "Wed", ...
        return formatter
    }()
}
