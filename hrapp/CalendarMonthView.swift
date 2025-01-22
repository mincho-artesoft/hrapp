//
//  CalendarMonthView.swift
//  hrapp
//

import SwiftUI

struct CalendarMonthView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    @Binding var selectedDate: Date
    @Binding var highlightedEventID: UUID?
    
    private let calendar = Calendar.current
    
    var body: some View {
        // Break the body into multiple steps so the compiler won’t complain
        let monthDays = makeDaysOfMonth(selectedDate)
        let columns = Array(repeating: GridItem(.flexible(), spacing: 1), count: 7)
        
        LazyVGrid(columns: columns, spacing: 1) {
            ForEach(monthDays, id: \.self) { day in
                dayCell(day)
            }
        }
    }
    
    @ViewBuilder
    private func dayCell(_ day: Date) -> some View {
        // Filter the events for this day
        let dayEvents = viewModel.events.filter {
            dayRangeOverlap(event: $0, day: day)
        }
        // Show up to 4
        let firstFour = Array(dayEvents.prefix(4))
        
        ZStack(alignment: .topLeading) {
            Rectangle().fill(Color.clear)
            
            // Day number label
            Text("\(calendar.component(.day, from: day))")
                .font(.system(size: 12))
                .padding(4)
                .foregroundColor(calendar.isDate(day, inSameDayAs: selectedDate) ? .blue : .primary)
            
            VStack(alignment: .leading, spacing: 2) {
                ForEach(firstFour) { event in
                    let isHighlighted = (highlightedEventID == event.id)
                    Text(event.title)
                        .font(.system(size: 10))
                        .lineLimit(1)
                        .padding(2)
                        .background(event.color.opacity(isHighlighted ? 0.8 : 0.3))
                        .cornerRadius(4)
                        .onTapGesture {
                            highlightedEventID = event.id
                            selectedDate = day
                        }
                        .draggable(
                            CalendarEventDragTransfer(eventID: event.id),
                            gestures: [.pressAndDrag]
                        )
                }
                // If more than 4, show +N more
                if dayEvents.count > 4 {
                    Text("+\(dayEvents.count - 4) more")
                        .font(.system(size: 10))
                        .foregroundColor(.gray)
                }
            }
            .padding(.top, 18)
            .padding(.horizontal, 2)
        }
        .frame(minHeight: 60)
        .border(Color.gray.opacity(0.2), width: 0.5)
        .onTapGesture {
            selectedDate = day
            highlightedEventID = nil
        }
        .dropDestination(for: CalendarEventDragTransfer.self) { items, location in
            guard let first = items.first else { return false }
            handleDropOnDay(day: day, eventID: first.eventID)
            return true
        }
    }
    
    // MARK: - Month Days
    
    private func makeDaysOfMonth(_ date: Date) -> [Date] {
        guard let monthInterval = calendar.dateInterval(of: .month, for: date) else { return [] }
        let start = monthInterval.start
        
        let dayRange = calendar.range(of: .day, in: .month, for: start) ?? (1..<31)
        
        var days: [Date] = []
        for dayOffset in dayRange {
            if let d = calendar.date(byAdding: .day, value: dayOffset - 1, to: start) {
                days.append(d)
            }
        }
        return days
    }
    
    /// Returns true if the event overlaps the given day
    private func dayRangeOverlap(event: CalendarEvent, day: Date) -> Bool {
        let dayStart = calendar.startOfDay(for: day)
        guard let dayEnd = calendar.date(byAdding: .day, value: 1, to: dayStart) else { return false }
        return dateRangeOverlap(event.start, event.end, dayStart, dayEnd)
    }
    
    // MARK: - Drop
    
    private func handleDropOnDay(day: Date, eventID: UUID) {
        guard let idx = viewModel.events.firstIndex(where: { $0.id == eventID }) else { return }
        var e = viewModel.events[idx]
        
        let originalDuration = e.end.timeIntervalSince(e.start)
        
        if e.allDay {
            // Keep it all-day but change the date
            e.start = day
            e.end   = day
        } else {
            // Keep hour/min offset but change the day
            let comps = calendar.dateComponents([.hour, .minute], from: e.start)
            if let newStart = calendar.date(bySettingHour: comps.hour ?? 0,
                                            minute: comps.minute ?? 0,
                                            second: 0,
                                            of: day) {
                e.start = newStart
                e.end   = newStart.addingTimeInterval(originalDuration)
            }
        }
        
        viewModel.events[idx] = e
        highlightedEventID = e.id
        selectedDate = day
    }
}
