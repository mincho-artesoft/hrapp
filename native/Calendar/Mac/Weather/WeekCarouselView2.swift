#if os(macOS)
import SwiftUI
struct WeekCarouselView2: View {
    let today: Date
    @Binding var selectedDay: Date
    var body: some View {
        MacCalendarWeekCarousel(selectedDate: $selectedDay)
    }
}
#endif
