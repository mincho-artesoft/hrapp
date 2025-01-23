import SwiftUI
import EventKit

struct DayCalendarWrapperView: View {
    let eventStore: EKEventStore
    @State private var date = Date()
    
    var body: some View {
        // Показваме DayView директно в този SwiftUI View
        CalendarViewControllerWrapper(selectedDate: date, eventStore: eventStore)
            .navigationTitle("Day View")
            .navigationBarTitleDisplayMode(.inline)
    }
}
