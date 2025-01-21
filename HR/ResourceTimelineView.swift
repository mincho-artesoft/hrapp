//
//  ResourceTimelineView.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI

struct ResourceTimelineView: View {
    let resources: [CalendarResource]
    let events: [CalendarEvent]
    @Binding var selectedDate: Date
    
    let onEventDoubleTap: (CalendarEvent) -> Void
    
    var body: some View {
        List {
            ForEach(resources) { resource in
                Section(resource.name) {
                    // In a real app, events would be filtered by resource ID
                    // For this demo, we show all events
                    let resourceEvents = events
                        .sorted(by: { $0.start < $1.start })
                    
                    ForEach(resourceEvents) { event in
                        HStack {
                            VStack(alignment: .leading) {
                                Text(event.title)
                                    .font(.headline)
                                Text(timeString(event))
                                    .font(.subheadline)
                                    .foregroundColor(.gray)
                            }
                            Spacer()
                        }
                        .padding(4)
                        .background(event.color.opacity(0.1))
                        .cornerRadius(4)
                        .onTapGesture(count: 2) {
                            onEventDoubleTap(event)
                        }
                    }
                }
            }
        }
    }
    
    private func timeString(_ event: CalendarEvent) -> String {
        let df = DateFormatter()
        df.timeStyle = .short
        df.dateStyle = .none
        if event.allDay {
            return "All Day"
        } else {
            return "\(df.string(from: event.start)) - \(df.string(from: event.end))"
        }
    }
}
