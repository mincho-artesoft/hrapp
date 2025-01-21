import SwiftUI

struct DayCalendarView: View {
    @Binding var selectedDate: Date
    @ObservedObject var viewModel: CalendarViewModel
    
    let onEventDoubleTap: (CalendarEvent) -> Void
    let onEventDrop: (UUID, Date) -> Void
    
    private let calendar = Calendar.current
    private let businessHoursRange = 8...17
    
    var body: some View {
        ScrollView {
            VStack(spacing: 4) {
                ForEach(businessHoursRange, id: \.self) { hour in
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(hour):00")
                            .font(.system(size: 8))
                            .foregroundColor(.gray)
                        
                        // Instead of filtering raw `events`, expand from viewModel:
                        let hourEvents = viewModel.eventsForDay(selectedDate)
                            .filter { calendar.component(.hour, from: $0.start) == hour }
                        
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
                    .frame(maxWidth: .infinity)
                    .contentShape(Rectangle())
                    .border(Color.gray.opacity(0.2), width: 0.5)
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
            .frame(maxWidth: .infinity)
        }
    }
}
