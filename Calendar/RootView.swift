import SwiftUI
import EventKit

struct RootView: View {
    @State private var selectedTab = 0
    
    let eventStore = EKEventStore()
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())
    
    var body: some View {
        NavigationView {
            VStack {
                Picker("Изглед", selection: $selectedTab) {
                    Text("Месец").tag(0)
                    Text("Ден").tag(1)
                    Text("Година").tag(2)
                }
                .pickerStyle(.segmented)
                .padding()

                switch selectedTab {
                case 0:
                    MonthCalendarView(viewModel: calendarVM, startMonth: Date())
                case 1:
                    // Примерно Day View с CalendarKit
                    DayCalendarWrapperView(eventStore: calendarVM.eventStore)
                case 2:
                    YearCalendarView(viewModel: calendarVM)
                default:
                    Text("Невалидна селекция")
                }
            }
            .navigationTitle("Calendar Demo")
        }
        .onAppear {
            // Искаме достъп до календара (ако не е даден)
            calendarVM.requestCalendarAccessIfNeeded {
                // По желание, зареждаме цялата година
                let currentYear = Calendar.current.component(.year, from: Date())
                calendarVM.loadEventsForWholeYear(year: currentYear)
            }
        }
    }
}
