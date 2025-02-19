//
//  MonthCalendarView.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI

struct MonthCalendarView: View {
    @Binding var selectedDate: Date
    
    // Instead of passing plain [CalendarEvent], pass the entire viewModel
    // or call a function in your parent that calls viewModel.eventsForDay(...)
    // For simplicity, let’s pass the viewModel:
    @ObservedObject var viewModel: CalendarViewModel
    
    let onEventDoubleTap: (CalendarEvent) -> Void
    let onEventDrop: (UUID, Date) -> Void
    
    private let calendar = Calendar.current
    
    var body: some View {
        let daysInMonth = makeDaysForMonth(selectedDate)
        let columns = Array(repeating: GridItem(.flexible(minimum: 30), spacing: 2), count: 7)
        
        LazyVGrid(columns: columns, spacing: 2) {
            ForEach(daysInMonth, id: \.self) { day in
                // Each day cell
                VStack(alignment: .leading, spacing: 2) {
                    Text("\(calendar.component(.day, from: day))")
                        .font(.caption2)
                        .foregroundColor(.primary)
                    
                    // GET repeated expansions from the viewModel
                    let dayEvents = viewModel.eventsForDay(day)
                    
                    ForEach(dayEvents) { event in
                        Text(event.title)
                            .font(.system(size: 8))
                            .padding(2)
                            .background(event.color.opacity(0.25))
                            .cornerRadius(4)
                            // DRAG
                            .draggable(CalendarEventDragTransfer(eventID: event.id))
                            .onTapGesture(count: 2) {
                                onEventDoubleTap(event)
                            }
                    }
                }
                .padding(4)
                .frame(maxWidth: .infinity, minHeight: 50, alignment: .topLeading)
                .background(
                    calendar.isDate(day, inSameDayAs: selectedDate)
                    ? Color.blue.opacity(0.1)
                    : Color.clear
                )
                .onTapGesture {
                    selectedDate = day
                }
                // DROP
                .dropDestination(for: CalendarEventDragTransfer.self) { items, location in
                    guard let item = items.first else { return false }
                    onEventDrop(item.eventID, day)
                    return true
                }
            }
        }
    }
    
    private func makeDaysForMonth(_ date: Date) -> [Date] {
        guard let monthInterval = calendar.dateInterval(of: .month, for: date) else {
            return []
        }
        var days: [Date] = []
        
        let start = monthInterval.start
        let dayCount = calendar.dateComponents([.day], from: start, to: monthInterval.end).day ?? 0
        for offset in 0..<dayCount {
            if let day = calendar.date(byAdding: .day, value: offset, to: start) {
                days.append(day)
            }
        }
        return days
    }
}
