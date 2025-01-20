import SwiftUI

// MARK: - Допълнителен DateFormatter за пълни имена на дните (Monday, Tuesday, Wednesday, ...)
extension DateFormatter {
    static let weekdayFull: DateFormatter = {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "EEEE" // Пълно име, например "Monday"
        return formatter
    }()
}

// Предполага се, че имате CalendarEvent, GenericEventTransfer, и т.н.

struct GenericWeekView<T: CalendarEvent>: View {
    let weekStart: Date
    let events: [T]
    let colorForEvent: (T) -> Color

    @Binding var isDraggingEvent: Bool
    let onDrop: ((T, Date) -> Bool)?

    private let calendar = Calendar.current
    private let dayWidth: CGFloat = 200

    var body: some View {
        // Изчисляваме последния ден от седмицата (weekStart + 6 дни)
        let weekEnd = calendar.date(byAdding: .day, value: 6, to: weekStart)!

        VStack(spacing: 8) {
            // Показваме заглавие с диапазона на седмицата
            Text("Week from \(weekStart.formatted(date: .abbreviated, time: .omitted)) to \(weekEnd.formatted(date: .abbreviated, time: .omitted))")
                .font(.headline)
                .padding(.top, 8)

            // Основна хоризонтална скрол лента за всеки ден
            ScrollView(.horizontal) {
                HStack(spacing: 8) {
                    ForEach(0..<7, id: \.self) { offset in
                        let dayDate = calendar.date(byAdding: .day, value: offset, to: weekStart)!
                        GenericWeekDayCell(
                            dayDate: dayDate,
                            events: events,
                            colorForEvent: colorForEvent,
                            isDraggingEvent: $isDraggingEvent,
                            onDrop: onDrop
                        )
                        .frame(width: dayWidth, height: 400)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                    }
                }
                .padding()
            }
            // Забраняваме скрол, ако потребителят драгва събитие
            .scrollDisabled(isDraggingEvent)
        }
    }
}

// MARK: - GenericWeekDayCell
fileprivate struct GenericWeekDayCell<T: CalendarEvent>: View {
    let dayDate: Date
    let events: [T]
    let colorForEvent: (T) -> Color

    @Binding var isDraggingEvent: Bool
    let onDrop: ((T, Date) -> Bool)?

    private let calendar = Calendar.current

    var body: some View {
        // Извличаме ПЪЛНОТО име на деня: Monday, Tuesday и т.н.
        let dayName = DateFormatter.weekdayFull.string(from: dayDate)

        VStack(alignment: .leading, spacing: 4) {
            // Показваме пълното име на деня (пример: Monday)
            Text(dayName)
                .font(.caption)
                .foregroundColor(.primary)

            // Показваме датата (пример: Jan 20)
            Text(dayDate.formatted(.dateTime.month(.abbreviated).day()))
                .font(.headline)

            // Филтрираме събитията, които се застъпват в конкретния ден
            let dayEvents = events.filter { $0.overlapsDay(dayDate) }

            ScrollView {
                ForEach(dayEvents) { event in
                    GenericWeekEventBox(
                        event: event,
                        color: colorForEvent(event),
                        isDraggingEvent: $isDraggingEvent
                    )
                }
            }
        }
        .dropDestination(for: GenericEventTransfer.self) { items, _ in
            handleDrop(items)
        }
    }

    /// Обработка на Drag & Drop
    private func handleDrop(_ items: [GenericEventTransfer]) -> Bool {
        defer { isDraggingEvent = false }

        guard
            let first = items.first,
            let droppedEvent = events.first(where: { $0.id as! UUID == first.eventID })
        else { return false }

        // Ако няма onDrop, отказваме
        guard let onDrop else { return false }

        // Извикваме родителското onDrop с информация за събитието + деня
        return onDrop(droppedEvent, dayDate)
    }
}

// MARK: - GenericWeekEventBox
fileprivate struct GenericWeekEventBox<T: CalendarEvent>: View {
    let event: T
    let color: Color

    @Binding var isDraggingEvent: Bool

    @State private var dragOffset: CGSize = .zero

    var body: some View {
        RoundedRectangle(cornerRadius: 6)
            .fill(color.opacity(0.3))
            .frame(height: 60)
            .overlay(
                VStack(alignment: .leading, spacing: 4) {
                    // Примерно текстово описание, показващо датите на евента
                    Text("Event: \(event.startDate.formatted(date: .abbreviated, time: .shortened)) - \(event.endDate.formatted(date: .abbreviated, time: .shortened))")
                        .font(.caption2)
                }
                .padding(5)
            )
            .onLongPressGesture(minimumDuration: 0.2) {
                // Когато задържим дълго, активираме drag
                isDraggingEvent = true
            }
            .offset(dragOffset)
            .gesture(
                DragGesture()
                    .onChanged { value in
                        dragOffset = value.translation
                    }
                    .onEnded { _ in
                        dragOffset = .zero
                    }
            )
            // Правим го draggable, за да може да го преместим в друг ден
            .draggable(
                GenericEventTransfer(
                    eventID: event.id as! UUID,
                    originalStart: event.startDate,
                    originalEnd: event.endDate
                )
            )
            .padding(.bottom, 8)
    }
}
