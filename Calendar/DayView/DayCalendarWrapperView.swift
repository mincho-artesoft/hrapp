import SwiftUI
import EventKit
import CalendarKit

struct DayCalendarWrapperView: View {
    let eventStore: EKEventStore
    
    /// We show a particular date in the Day view
    var date: Date

    var body: some View {
        CalendarViewControllerWrapper(
            selectedDate: date,
            eventStore: eventStore
        )
        .navigationTitle("Day View")
        .navigationBarTitleDisplayMode(.inline)
    }
}
