import SwiftUI
import EventKit

struct RootView: View {
    @State private var selectedTab = 0
    let eventStore = EKEventStore()

    var body: some View {
        VStack {
            Picker("Изглед", selection: $selectedTab) {
                Text("Месец").tag(0)
                Text("Ден").tag(1)
            }
            .pickerStyle(.segmented)
            .padding()
            .onChange(of: selectedTab) { newValue in
                if newValue == 0 {
                    // Сменяме на "Месец" - принуди MonthCalendarView да се презареди
                    NotificationCenter.default.post(name: .EKEventStoreChanged, object: eventStore)
                    // или ако искаш по-пряко: някакъв flag, binding, и т.н.
                }
            }

            if selectedTab == 0 {
                MonthCalendarView(eventStore: eventStore)
            } else {
                DayCalendarWrapperView(eventStore: eventStore)
            }
        }
    }
}
