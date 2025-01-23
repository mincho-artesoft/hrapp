import SwiftUI
import EventKit
import UniformTypeIdentifiers

struct DayCellView: View {
    let day: Date
    let currentMonth: Date
    let events: [EKEvent]

    var onEventDropped: (String, Date) -> Void
    var onDayTap: (Date) -> Void
    var onDayLongPress: (Date) -> Void
    var onEventTap: (EKEvent) -> Void

    private let calendar = Calendar(identifier: .gregorian)

    @State private var isTargeted = false

    var body: some View {
        ZStack {
            // Фон за засичане на tap/long press
            Rectangle()
                .fill(Color.clear)
                .contentShape(Rectangle())
                .onTapGesture {
                    onDayTap(day)
                }
                .onLongPressGesture {
                    onDayLongPress(day)
                }

            // Слоят с деня и капсулите
            VStack(spacing: 4) {
                // Ден
                if calendar.isDateInToday(day) {
                    // Днешна дата -> червен кръг
                    Text("\(dayNumber(day))")
                        .font(.subheadline)
                        .foregroundColor(.white)
                        .padding(6)
                        .background(Circle().fill(Color.red))
                } else {
                    Text("\(dayNumber(day))")
                        .font(.subheadline)
                        .foregroundColor(isInCurrentMonth(day) ? .primary : .gray)
                }

                // Събития (до 3)
                if events.count <= 3 {
                    ForEach(events, id: \.eventIdentifier) { event in
                        eventCapsule(event)
                    }
                } else {
                    ForEach(events.prefix(3), id: \.eventIdentifier) { event in
                        eventCapsule(event)
                    }
                    Text("... +\(events.count - 3)")
                        .font(.caption2)
                        .foregroundColor(.blue)
                }

                Spacer(minLength: 2)
            }
            .padding(2)
        }
        .frame(minHeight: 60)
        .frame(maxWidth: .infinity)
        .onDrop(of: [UTType.text], isTargeted: $isTargeted) { providers in
            handleDrop(providers)
        }
        .background(isTargeted ? Color.blue.opacity(0.1) : Color.clear)
    }

    private func eventCapsule(_ event: EKEvent) -> some View {
        let color = Color(UIColor(cgColor: event.calendar.cgColor ?? UIColor.systemGray.cgColor))

        return Text(event.title)
            .font(.caption2)
            .foregroundColor(.white)
            .lineLimit(1)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(color)
            .clipShape(Capsule())
            .onTapGesture {
                onEventTap(event)
            }
            .modifier(DraggableModifier(event: event))
    }

    private func handleDrop(_ providers: [NSItemProvider]) -> Bool {
        guard let provider = providers.first else { return false }

        provider.loadItem(forTypeIdentifier: UTType.text.identifier, options: nil) { item, error in
            if let data = item as? Data,
               let eventID = String(data: data, encoding: .utf8) {
                DispatchQueue.main.async {
                    onEventDropped(eventID, day)
                }
            }
        }
        return true
    }

    private func dayNumber(_ date: Date) -> String {
        String(calendar.component(.day, from: date))
    }

    private func isInCurrentMonth(_ date: Date) -> Bool {
        calendar.isDate(date, equalTo: currentMonth, toGranularity: .month)
    }
}
