import SwiftUI

struct DayCalendarView: View {
    @Binding var selectedDate: Date
    let events: [CalendarEvent]
    let onEventDoubleTap: (CalendarEvent) -> Void
    
    // NEW
    let onEventDrop: (UUID, Date) -> Void
    
    private let calendar = Calendar.current
    private let businessHoursRange = 8...17
    
    var body: some View {
        ScrollView {
            VStack(spacing: 4) {
                ForEach(businessHoursRange, id: \.self) { hour in
                    VStack(alignment: .leading, spacing: 4) {
                        // Текст за часа
                        Text("\(hour):00")
                            .font(.system(size: 8))
                            .foregroundColor(.gray)
                        
                        // Събития за текущия час
                        let hourEvents = events.filter {
                            calendar.isDate($0.start, inSameDayAs: selectedDate)
                            && calendar.component(.hour, from: $0.start) == hour
                        }
                        
                        // Показваме всяко събитие в този час едно под друго
                        ForEach(hourEvents) { event in
                            Text(event.title)
                                .font(.system(size: 10))
                                .padding(2)
                                .background(event.color.opacity(0.3))
                                .cornerRadius(4)
                                .draggable(CalendarEventDragTransfer(eventID: event.id))
                                .onTapGesture(count: 2) {
                                    onEventDoubleTap(event)
                                }
                        }
                    }
                    .frame(minHeight: 50, alignment: .top)
                    .frame(maxWidth: .infinity)             // Разпъва по цялата ширина
                    .contentShape(Rectangle())              // Прави цялата област „кликаема“ / дроп зона
                    .border(Color.gray.opacity(0.2), width: 0.5)
                    // DROP TARGET
                    .dropDestination(for: CalendarEventDragTransfer.self) { items, location in
                        guard let item = items.first else { return false }
                        if let newStart = calendar.date(bySettingHour: hour, minute: 0, second: 0, of: selectedDate) {
                            onEventDrop(item.eventID, newStart)
                            return true
                        }
                        return false
                    }
                }
            }
            .frame(maxWidth: .infinity) // И външният VStack може да се разпъне хоризонтално
        }
    }
}
