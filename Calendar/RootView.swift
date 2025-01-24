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
                    Text("Седмица+Часове").tag(3) // <-- нов таб
                }
                .pickerStyle(.segmented)
                .padding()

                switch selectedTab {
                case 0:
                    MonthCalendarView(viewModel: calendarVM, startMonth: Date())

                case 1:
                    DayCalendarWrapperView(eventStore: calendarVM.eventStore)

                case 2:
                    YearCalendarView(viewModel: calendarVM)

                case 3:
                    let monday = startOfThisWeek()
                    let cal = Calendar.current
                    let end = cal.date(byAdding: .day, value: 7, to: monday)!
                    let found = calendarVM.eventStore.events(matching: calendarVM.eventStore.predicateForEvents(withStart: monday, end: end, calendars: nil))
                    let wrappers = found.map { EKWrapper(eventKitEvent: $0) }

                    WeekNonOverlappingWrapper(startOfWeek: monday, events: wrappers)
                default:
                    Text("Невалидна селекция")
                }
            }
            .navigationTitle("Calendar Demo")
        }
        .onAppear {
            // Искаме достъп до календара (ако не е даден)
            calendarVM.requestCalendarAccessIfNeeded {
                // По желание, зареждаме цялата година или нещо друго
                // currentYear?
                let currentYear = Calendar.current.component(.year, from: Date())
                calendarVM.loadEventsForWholeYear(year: currentYear)
            }
        }
    }

    /// Примерна функция, която намира понеделника на текущата седмица.
    func startOfThisWeek() -> Date {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        let weekday = cal.component(.weekday, from: today)
        // Приемаме, че 2 = Monday, 1 = Sunday (за BG Locale).
        // Ако искате друго изчисление, адаптирайте
        let diff = weekday == 1 ? 6 : weekday - 2
        return cal.date(byAdding: .day, value: -diff, to: today)!
    }
}
