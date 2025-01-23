import SwiftUI
import EventKit
import UniformTypeIdentifiers

struct DayCellView: View {
    let day: Date
    let currentMonth: Date
    let events: [EKEvent]
    
    /// Callback при Drag & Drop (смяна на дата)
    var onEventDropped: (String, Date) -> Void
    
    /// Tap върху ПРАЗНО място в деня -> Day View
    var onDayTap: (Date) -> Void
    
    /// Long press върху ПРАЗНО място -> създаване на ново събитие
    var onDayLongPress: (Date) -> Void
    
    /// Tap върху СЪБИТИЕ -> редактор
    var onEventTap: (EKEvent) -> Void
    
    private let calendar = Calendar(identifier: .gregorian)
    
    // За визуализация при drag & drop
    @State private var isTargeted = false
    
    var body: some View {
        // Основен контейнер
        ZStack {
            // 1) Фон, който ще засича tap/long press
            Rectangle()
                .fill(Color.clear)
                .contentShape(Rectangle()) // да може да хваща целия правоъгълник
                // Tap върху ПРАЗНО => Day View
                .onTapGesture {
                    onDayTap(day)
                }
                // Long Press върху ПРАЗНО => ново събитие
                .onLongPressGesture {
                    onDayLongPress(day)
                }
            
            // 2) Слоят отгоре: показва деня и събитията
            VStack(spacing: 4) {
                // Ден
                if calendar.isDateInToday(day) {
                    // Ако е днес -> червен кръг
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
        // Приемаме drop
        .onDrop(of: [UTType.text], isTargeted: $isTargeted) { providers in
            handleDrop(providers)
        }
        .background(isTargeted ? Color.blue.opacity(0.1) : Color.clear)
    }
    
    /// Капсула за събитието: tap => редакция, long press => drag (реално .onDrag)
    private func eventCapsule(_ event: EKEvent) -> some View {
        // Цветът зависи от event.calendar
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
                // Tap върху събитието = редакция
                onEventTap(event)
            }
            // Drag & drop (при дълго задържане)
            .modifier(DraggableModifier(event: event))
    }
    
    /// Обработка на drop (друг ден да го приеме)
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
