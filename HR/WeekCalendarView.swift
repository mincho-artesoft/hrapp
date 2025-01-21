import SwiftUI

struct WeekCalendarView: View {
    @Binding var selectedDate: Date
    let events: [CalendarEvent]
    let onEventDoubleTap: (CalendarEvent) -> Void
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
                        // Day title
                        Text(dayTitle(day))
                            .font(.caption)
                            .bold()
                            .padding(.bottom, 2)

                        ScrollView {
                            VStack(spacing: 4) {
                                ForEach(businessHoursRange, id: \.self) { hour in
                                    HourCellView(
                                        hour: hour,
                                        day: day,
                                        events: events,
                                        onEventDoubleTap: onEventDoubleTap,
                                        onEventDrop: onEventDrop
                                    )
                                }
                            }
                        }
                    }
                    .frame(width: 100)  // or use minWidth / maxWidth as needed
                    .background(
                        calendar.isDate(day, inSameDayAs: selectedDate)
                            ? Color.blue.opacity(0.1)
                            : Color.clear
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
