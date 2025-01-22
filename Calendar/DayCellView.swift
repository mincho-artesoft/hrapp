import SwiftUI
import UniformTypeIdentifiers
import EventKit

struct DayCellView: View {
    let day: Date
    let currentMonth: Date
    let events: [EKEvent]
    
    // Тук подаваме callback, с който казваме на родителя:
    // "Някой дропна eventIdentifier върху този ден"
    var onEventDropped: (String, Date) -> Void
    
    private let calendar = Calendar(identifier: .gregorian)
    
    // Ако искаме да покажем визуална индикация дали сме "target" на drag
    @State private var isTargeted: Bool = false
    
    var body: some View {
        VStack(spacing: 4) {
            // Денят (числото и капсулките) – същата логика, както по-рано:
            if calendar.isDateInToday(day) {
                Text("\(dayNumber(day))")
                    .foregroundColor(.white)
                    .padding(6)
                    .background(Circle().fill(Color.red))
            } else {
                Text("\(dayNumber(day))")
                    .foregroundColor(isInCurrentMonth(day) ? .primary : .gray)
            }
            
            // Капсулките за събития
            ForEach(events.prefix(3), id: \.eventIdentifier) { event in
                EventCapsuleView(event: event)
                    // 1) onDrag => подаваме eventIdentifier като текст
                    .onDrag {
                        // Връщаме NSItemProvider с eventIdentifier.
                        let provider = NSItemProvider(object: event.eventIdentifier as NSString)
                        provider.suggestedName = event.eventIdentifier
                        return provider
                    }
            }
            
            // Ако имаме още събития
            if events.count > 3 {
                Text("... +\(events.count - 3)")
                    .font(.caption2)
                    .foregroundColor(.blue)
            }
            
            Spacer(minLength: 2)
        }
        .padding(2)
        .frame(minHeight: 60)
        .frame(maxWidth: .infinity)
        // 2) onDrop => приемаме UTType.text (или public.text)
        .onDrop(of: [UTType.text], isTargeted: $isTargeted) { providers in
            handleDrop(providers: providers)
        }
        .background(
            // За визуална индикация при "hover" (не е задължително)
            isTargeted ? Color.blue.opacity(0.15) : Color.clear
        )
    }
    
    private func handleDrop(providers: [NSItemProvider]) -> Bool {
        // Взимаме първия provider
        guard let itemProvider = providers.first else { return false }
        
        // Опитваме да заредим стринг (eventIdentifier)
        itemProvider.loadItem(forTypeIdentifier: UTType.text.identifier, options: nil) { (item, error) in
            guard let eventIdentifierData = item as? Data,
                  let eventIdentifier = String(data: eventIdentifierData, encoding: .utf8)
            else {
                // Понякога, ако сме сложили NSString, може да е (NSString) вместо Data
                // Опитайте да го декодирате другояче, ако това не работи.
                return
            }
            
            // Успешно прочетохме eventIdentifier => викаме callback
            DispatchQueue.main.async {
                self.onEventDropped(eventIdentifier, day)
            }
        }
        
        return true
    }
    
    private func dayNumber(_ date: Date) -> String {
        let d = calendar.component(.day, from: date)
        return String(d)
    }
    
    private func isInCurrentMonth(_ date: Date) -> Bool {
        calendar.isDate(date, equalTo: currentMonth, toGranularity: .month)
    }
}


/// Капсула с името на събитието, оцветена в цвета на календара
struct EventCapsuleView: View {
    let event: EKEvent
    
    var body: some View {
        let color = Color(UIColor(cgColor: event.calendar?.cgColor ?? UIColor.systemGray.cgColor))
        
        Text(event.title)
            .font(.caption2)
            .foregroundColor(.white)
            .lineLimit(1)
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(color)
            .clipShape(Capsule())
    }
}
