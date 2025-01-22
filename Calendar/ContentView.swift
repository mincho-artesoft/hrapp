import SwiftUI
import EventKit

struct ContentView: View {
    let eventStore = EKEventStore()

    var body: some View {
        NavigationView {
            MonthCalendarView(eventStore: eventStore)
                .navigationTitle("Month Calendar")
        }
    }
}
