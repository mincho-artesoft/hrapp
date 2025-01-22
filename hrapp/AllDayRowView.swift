//
//  AllDayRowView.swift
//  hrapp
//
//  Created by Mincho Milev on 1/22/25.
//


//
//  AllDayRowView.swift
//  hrapp
//

import SwiftUI

/// A horizontal strip that displays all-day events for a given day, plus drop zone to convert events to all-day.
struct AllDayRowView: View {
    let date: Date
    let events: [CalendarEvent]
    let onEventTapped: (CalendarEvent) -> Void
    let onDrop: (UUID) -> Void
    
    var body: some View {
        HStack(spacing: 4) {
            Text("All-Day")
                .font(.caption2)
                .foregroundColor(.secondary)
                .frame(width: 50)
            Divider()
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 4) {
                    ForEach(events) { event in
                        let bgColor = event.color.opacity(0.3)
                        Text(event.title)
                            .font(.system(size: 10))
                            .padding(4)
                            .background(bgColor)
                            .cornerRadius(4)
                            .onTapGesture {
                                onEventTapped(event)
                            }
                            .draggable(CalendarEventDragTransfer(eventID: event.id),
                                       gestures: [.pressAndDrag])
                    }
                }
            }
        }
        .frame(height: 40)
        .dropDestination(for: CalendarEventDragTransfer.self) { items, _ in
            guard let first = items.first else { return false }
            onDrop(first.eventID)
            return true
        }
    }
}

