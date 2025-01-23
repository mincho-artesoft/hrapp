import SwiftUI
import EventKit

struct ContentView: View {
    /// Един глобален EKEventStore за цялото приложение
    let eventStore = EKEventStore()
    
    var body: some View {
        NavigationView {
            MonthCalendarView(eventStore: eventStore)
                .navigationTitle("Month Calendar")
        }
    }
}
