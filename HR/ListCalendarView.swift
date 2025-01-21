//
//  ListCalendarView.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//
import SwiftUI

struct ListCalendarView: View {
    @Binding var selectedDate: Date
    @ObservedObject var viewModel: CalendarViewModel
    let onEventDoubleTap: (CalendarEvent) -> Void
    
    private let calendar = Calendar.current
    
    var body: some View {
        let dayEvents = viewModel.eventsForDay(selectedDate)
            .sorted(by: { $0.start < $1.start })
        
        List {
            ForEach(dayEvents) { event in
                VStack(alignment: .leading) {
                    Text(event.title)
                        .font(.headline)
                    Text(timeRangeString(for: event))
                        .font(.subheadline)
                        .foregroundColor(.gray)
                }
                .listRowBackground(event.color.opacity(0.1))
                .onTapGesture(count: 2) {
                    onEventDoubleTap(event)
                }
            }
        }
    }
    
    private func timeRangeString(for event: CalendarEvent) -> String {
        let df = DateFormatter()
        df.dateStyle = .none
        df.timeStyle = .short
        if event.allDay {
            return "All Day"
        } else {
            return "\(df.string(from: event.start)) - \(df.string(from: event.end))"
        }
    }
}
