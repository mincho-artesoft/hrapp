import SwiftUI
import SwiftData

struct GenericDayView<T: CalendarEvent>: View {
    @Environment(\.modelContext) private var context  // ако ползвате SwiftData и искате да save-вате

    let date: Date
    let events: [T]
    let colorForEvent: (T) -> Color
    @Binding var isDraggingEvent: Bool

    /// Callback, ако искате да обработвате drop отвън:
    let onDrop: ((T, Date) -> Bool)?

    var body: some View {
        // Избираме само събития, които припокриват "date"
        let dayEvents = events.filter { $0.overlapsDay(date) }

        ScrollView {
            VStack(spacing: 0) {
                // Обхождаме часовете [0..23]
                ForEach(0..<24, id: \.self) { hour in
                    hourRow(hour, dayEvents: dayEvents)
                }
            }
            .padding(.horizontal)
        }
        // Може да спираме скрол, когато user влачи
        .scrollDisabled(isDraggingEvent)
    }

    /// "Ред" за конкретен час [hour:hour+1]
    @ViewBuilder
    private func hourRow(_ hour: Int, dayEvents: [T]) -> some View {
        let hourStart = Calendar.current.date(
            bySettingHour: hour, minute: 0, second: 0, of: date
        )!
        let hourEnd = Calendar.current.date(
            byAdding: .hour, value: 1, to: hourStart
        )!

        // Всички евенти, които се застъпват с този часов интервал
        let eventsInThisHour = dayEvents.filter {
            $0.startDate < hourEnd && $0.endDate > hourStart
        }

        HStack(alignment: .top, spacing: 0) {
            // Лявата колона с текст "hh:00"
            Text(String(format: "%02d:00", hour))
                .frame(width: 50, alignment: .leading)
                .padding(.leading, 8)

            ZStack(alignment: .topLeading) {
                Rectangle()
                    .fill(Color.gray.opacity(0.15))
                    .frame(height: 60)
                    // Drop Destination
                    .dropDestination(for: GenericEventTransfer.self) { items, location in
                        // Убедете се, че се извиква (напр. print)
                        print("Drop destination triggered on hour \(hour)")

                        guard let dropItem = items.first else {
                            return false
                        }
                        // Търсим евента по ID
                        guard let droppedEvent = events.first(where: {
                            $0.id == dropItem.eventID
                        }) else {
                            return false
                        }

                        // Или ползваме onDrop, или директно местим
                        if let onDrop {
                            // ако родителят иска да се справи с промяната
                            return onDrop(droppedEvent, hourStart)
                        } else {
                            // Директно тук сменяме start/end
                            let duration = droppedEvent.endDate.timeIntervalSince(droppedEvent.startDate)
                            droppedEvent.startDate = hourStart
                            droppedEvent.endDate   = hourStart.addingTimeInterval(duration)

                            // Ако използвате SwiftData:
                            do {
                                try context.save()
                                // Принтваме за отстраняване на грешки
                                print("Dropped event: \(droppedEvent.id), new start:", droppedEvent.startDate)
                                return true
                            } catch {
                                print("Error saving: \(error)")
                                return false
                            }
                        }
                    }

                // Показваме всички евенти в този час
                ForEach(eventsInThisHour) { event in
                    GenericDayEventRow(
                        event: event,
                        color: colorForEvent(event),
                        isDraggingEvent: $isDraggingEvent
                    )
                }
            }
            .frame(maxWidth: .infinity, minHeight: 60)
        }
        .padding(.vertical, 2)
    }
}

/// Единичен визуален "ред" за евент
struct GenericDayEventRow<T: CalendarEvent>: View {
    let event: T
    let color: Color
    @Binding var isDraggingEvent: Bool

    var body: some View {
        RoundedRectangle(cornerRadius: 8)
            .fill(color.opacity(0.3))
            .frame(height: 60)
            // По-ясен текст, за да се види дали start/end се променят
            .overlay(
                VStack(alignment: .leading, spacing: 2) {
                    Text("ID: \(event.id)")
                        .font(.caption2)
                    Text("Start: \(event.startDate.formatted(date: .omitted, time: .shortened))")
                    Text("End:   \(event.endDate.formatted(date: .omitted, time: .shortened))")
                }
                .padding(5)
            )
            // Правим draggable
            .draggable(
                GenericEventTransfer(
                    eventID: event.id,
                    originalStart: event.startDate,
                    originalEnd: event.endDate
                ),
                // По желание подайте preview, за да видите графика:
                preview: {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(color)
                        .frame(width: 80, height: 30)
                        .overlay(
                            Text("Moving").foregroundColor(.white)
                        )
                }
            )
            // Ако искате long-press, може да добавите:
            .onLongPressGesture(minimumDuration: 0.5) {
                isDraggingEvent = true
                print("Long press -> isDraggingEvent = true")
            }
            // Ако user пусне (drop) другаде, тогава isDraggingEvent = false
            // (Зависи как сте структурирали кода, това може да стане и автоматично.)
            .onChange(of: isDraggingEvent) { newVal in
                if newVal == false {
                    print("Stopped dragging event: \(event.id)")
                }
            }
    }
}
