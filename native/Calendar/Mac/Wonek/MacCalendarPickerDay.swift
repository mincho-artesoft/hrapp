// Ported from Wonek Main/MacCalendarPickerDay.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI

/// The range picker and inline event picker share their day typography and colors.
struct MacCalendarPickerDay: View {
    let date: Date
    let calendar: Calendar
    let isSelected: Bool
    var isEnabled = true

    private var isToday: Bool { calendar.isDateInToday(date) }
    var body: some View {
        CalendarPickerDay(number: calendar.component(.day, from: date), isSelected: isSelected,
            isToday: isToday, isEnabled: isEnabled)
    }
}
#endif

#endif
