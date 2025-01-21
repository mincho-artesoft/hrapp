//
//  HourCellView.swift
//  HR
//
//  Created by Aleksandar Svinarov on 21/1/25.
//

import SwiftUI


struct HourCellView: View {
    let hour: Int
    let day: Date
    let events: [CalendarEvent]
    let onEventDoubleTap: (CalendarEvent) -> Void
    let onEventDrop: (UUID, Date) -> Void
    let calendar = Calendar.current

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            // Show the hour
            Text("\(hour):00")
                .font(.system(size: 8))
                .foregroundColor(.gray)
            
            // Filter the events for this hour
            let hourEvents = events.filter {
                calendar.isDate($0.start, inSameDayAs: day) &&
                calendar.component(.hour, from: $0.start) == hour
            }
            
            // Display each event
            ForEach(hourEvents) { event in
                Text(event.title)
                    .font(.system(size: 10))
                    .padding(2)
                    .background(event.color.opacity(0.3))
                    .cornerRadius(4)
                    .onTapGesture(count: 2) {
                        onEventDoubleTap(event)
                    }
                    // DRAG
                    .draggable(CalendarEventDragTransfer(eventID: event.id))
            }
        }
        .frame(minHeight: 50, alignment: .top)
        .background(Color.clear)
        .contentShape(Rectangle())
        .border(Color.gray.opacity(0.2), width: 0.5)
        // DROP
        .dropDestination(for: CalendarEventDragTransfer.self) { items, _ in
            guard let item = items.first else { return false }
            // Build the new date from day + hour
            if let newStart = calendar.date(bySettingHour: hour, minute: 0, second: 0, of: day) {
                onEventDrop(item.eventID, newStart)
                return true
            }
            return false
        }
    }
}
