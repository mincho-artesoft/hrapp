import SwiftUI
import EventKit


struct ContentView: View {
    // Създаваме си eventStore (или го подаваме отвън)
    let eventStore = EKEventStore()
    
    var body: some View {
        TabView {
            // Вашият DayView от CalendarKit
            NavigationView {
                CalendarViewControllerWrapper()
                    .navigationTitle("Day View")
            }
            .tabItem {
                Label("Day", systemImage: "calendar.day.timeline.left")
            }
            
            // Вашият Month View (custom)
            NavigationView {
                MonthCalendarView(eventStore: eventStore)
                    .navigationTitle("Month View")
            }
            .tabItem {
                Label("Month", systemImage: "calendar")
            }
        }
    }
}
