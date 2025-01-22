import SwiftUI


struct ContentView: View {
    var body: some View {
        NavigationView {
            CalendarViewControllerWrapper()
                .navigationTitle("Calendar")
        }
    }
}
