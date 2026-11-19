import SwiftUI

struct WeatherWeekCarousel: View {
    @Binding var selectedDay: Date
    let calendar: Calendar
    let forecastDays: ClosedRange<Date>

    var body: some View {
        #if os(macOS)
        MacCalendarWeekCarousel(selectedDate: $selectedDay, displayCalendar: calendar, selectableDays: forecastDays)
            .frame(height: 70)
        #else
        WeatherWeekCarouselBridge(selectedDay: $selectedDay, calendar: calendar, forecastDays: forecastDays)
            .frame(height: 70)
        #endif
    }
}

#if os(iOS)
private struct WeatherWeekCarouselBridge: UIViewRepresentable {
    @Binding var selectedDay: Date
    let calendar: Calendar
    let forecastDays: ClosedRange<Date>

    func makeUIView(context: Context) -> WeekCarouselView { WeekCarouselView() }

    func updateUIView(_ view: WeekCarouselView, context: Context) {
        view.displayDays(in: forecastDays, calendar: calendar, selected: selectedDay)
        view.onDaySelected = { selectedDay = $0 }
    }
}
#endif
