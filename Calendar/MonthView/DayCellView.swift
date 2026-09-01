import SwiftUI
import EventKit
import UniformTypeIdentifiers

struct DayCellView: View {
    let day: Date
    let currentMonth: Date
    let events: [EKEvent]

    /// Callback-и
    var onEventDropped: (String, Date) -> Void
    var onDayTap: (Date) -> Void
    var onDayLongPress: (Date) -> Void
    var onEventTap: (EKEvent) -> Void

    private let calendar = Calendar.current

    @State private var isTargeted = false

    var body: some View {
        ZStack {
            // 1) Зона за тап/дълго задържане
            Rectangle()
                .fill(Color.clear)
                .contentShape(Rectangle())
                .onTapGesture {
                    onDayTap(day)
                }
                .onLongPressGesture {
                    onDayLongPress(day)
                }

            // 2) Показваме деня и (до 3) събития
            VStack(spacing: 4) {
                // Денят (ако е днес, показваме червен кръг)
                if calendar.isDateInToday(day) {
                    Text(dayNumber(day))
                        .font(.subheadline)
                        .foregroundColor(.white)
                        .padding(6)
                        .background(Circle().fill(Color.red))
                } else {
                    Text(dayNumber(day))
                        .font(.subheadline)
                        .foregroundColor(isInCurrentMonth(day) ? .primary : .gray)
                }

                // Събития
                if events.count <= 3 {
                    ForEach(events, id: \.eventIdentifier) { event in
                        eventCapsule(event)
                    }
                } else {
                    ForEach(events.prefix(3), id: \.eventIdentifier) { event in
                        eventCapsule(event)
                    }
                    Text(localizedFormat("... +%d", events.count - 3))
                        .font(.caption2)
                        .foregroundColor(.blue)
                }

                Spacer(minLength: 2)
            }
            .padding(2)
        }
        .frame(minHeight: 60)
        .frame(maxWidth: .infinity)
        // Логика за drag & drop (ако ви трябва)
        .onDrop(of: [UTType.text], isTargeted: $isTargeted) { providers in
            handleDrop(providers)
        }
        .background(isTargeted ? Color.blue.opacity(0.1) : Color.clear)
    }

    /// Капсулка за едно събитие
    private func eventCapsule(_ event: EKEvent) -> some View {
        let color = Color(UIColor(cgColor: event.calendar.cgColor ?? UIColor.systemGray.cgColor))

        return HStack(spacing: 2) {
            if SharedInviteTracker.isReadOnly(event) {
                Image(systemName: "lock.fill")
                    .font(.system(size: 7, weight: .semibold))
                    .accessibilityLabel(LocalizedStringKey("Read-only shared event"))
            }

            Text(event.title)
                .lineLimit(1)
                .strikethrough(
                    SharedInviteTracker.shouldAppearStruckThrough(event),
                    color: color
                )
        }
            .font(.caption2)
            .foregroundColor(.white)
            .minimumScaleFactor(0.45)
            .allowsTightening(true)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(color)
            .clipShape(Capsule())
            .onTapGesture {
                onEventTap(event)
            }
            .modifier(DraggableModifier(event: event)) // ако ползвате draggable
    }

    /// Обработка на drop (ако ползвате drag & drop)
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
        localizedIntegerString(calendar.component(.day, from: date))
    }

    private func isInCurrentMonth(_ date: Date) -> Bool {
        calendar.isDate(date, equalTo: currentMonth, toGranularity: .month)
    }
}
