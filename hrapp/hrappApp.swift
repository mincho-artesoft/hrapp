import SwiftUI

@main
struct hrappApp: App {
    @StateObject var viewModel = CalendarViewModel()
    @State var selectedDate = Date()
    @State var highlightedEventID: UUID? = nil
    
    var body: some Scene {
        WindowGroup {
            // For demonstration, show the Day View by default
            CalendarDayView(
                viewModel: viewModel,
                selectedDate: $selectedDate,
                startHour: 8,
                endHour: 17,
                slotMinutes: 30,
                highlightedEventID: $highlightedEventID
            )
        }
    }
}
