//
//  WeekCalendarView.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI

struct WeekCalendarView: View {
    @Binding var selectedDate: Date
    let events: [CalendarEvent]
    let onEventDoubleTap: (CalendarEvent) -> Void
    
    // NEW
    let onEventDrop: (UUID, Date) -> Void
    
    private let calendar = Calendar.current
    private let businessHoursRange = 8...17
    
    var body: some View {
        let startOfWeek = findStartOfWeek(selectedDate)
        let daysOfWeek = (0..<7).compactMap {
            calendar.date(byAdding: .day, value: $0, to: startOfWeek)
        }
        
        ScrollView(.horizontal) {
            HStack(spacing: 8) {
                ForEach(daysOfWeek, id: \.self) { day in
                    VStack(alignment: .leading, spacing: 2) {
                        Text(dayTitle(day))
                            .font(.caption)
                            .bold()
                            .padding(.bottom, 2)
                        
                        ScrollView {
                            VStack(spacing: 4) {
                                ForEach(businessHoursRange, id: \.self) { hour in
                                    VStack(alignment: .leading, spacing: 4) {
                                        // Показваме часa
                                        Text("\(hour):00")
                                            .font(.system(size: 8))
                                            .foregroundColor(.gray)
                                        
                                        // Взимаме всички събития, които са в този час
                                        let hourEvents = events.filter {
                                            calendar.isDate($0.start, inSameDayAs: day) &&
                                            calendar.component(.hour, from: $0.start) == hour
                                        }
                                        
                                        // Показваме всяко събитие на нов ред
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
                                    .frame(minHeight: 50, alignment: .top) // позволява на клетката да се разтяга
                                    .border(Color.gray.opacity(0.2), width: 0.5)
                                    .dropDestination(for: CalendarEventDragTransfer.self) { items, location in
                                        guard let item = items.first else { return false }
                                        // Конструираме новата дата от ден + час
                                        if let newStart = calendar.date(bySettingHour: hour, minute: 0, second: 0, of: day) {
                                            onEventDrop(item.eventID, newStart)
                                            return true
                                        }
                                        return false
                                    }
                                }

                            }
                        }
                    }
                    .frame(width: 100)
                    .background(
                        calendar.isDate(day, inSameDayAs: selectedDate) ?
                        Color.blue.opacity(0.1) : Color.clear
                    )
                    .onTapGesture {
                        selectedDate = day
                    }
                }
            }
        }
    }
    
    private func findStartOfWeek(_ date: Date) -> Date {
        let components = calendar.dateComponents([.yearForWeekOfYear, .weekOfYear], from: date)
        return calendar.date(from: components) ?? date
    }
    
    private func dayTitle(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "EEE M/d"
        return df.string(from: date)
    }
}
