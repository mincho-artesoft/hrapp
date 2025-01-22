import SwiftUI
import UniformTypeIdentifiers
import EventKit

// MARK: - 4) DayCellView (клетка за конкретен ден в месеца)
struct DayCellView: View {
    let day: Date
       let currentMonth: Date
       let events: [EKEvent]
       
       /// Callback при drag & drop
       var onEventDropped: (String, Date) -> Void
       
       private let calendar = Calendar(identifier: .gregorian)
       @State private var isTargeted = false
       
       var body: some View {
           VStack(spacing: 4) {
               // Ден
               if calendar.isDateInToday(day) {
                   // Днес -> червен кръг
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
            
            // Събития (до 3), после "... +X"
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
        .frame(minHeight: 60)
        .frame(maxWidth: .infinity)
        // Приемаме Drag & Drop
        .onDrop(of: [UTType.text], isTargeted: $isTargeted) { providers in
            handleDrop(providers)
        }
        .background(isTargeted ? Color.blue.opacity(0.15) : Color.clear)
    }
    
    private func eventCapsule(_ event: EKEvent) -> some View {
        // Капсула, оцветена според event.calendar
        let color = Color(UIColor(cgColor: event.calendar?.cgColor ?? UIColor.systemGray.cgColor))
        
        return Text(event.title)
            .font(.caption2)
            .foregroundColor(.white)
            .lineLimit(1)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(color)
            .clipShape(Capsule())
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
