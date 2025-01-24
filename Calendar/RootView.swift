import SwiftUI
import EventKit
import CalendarKit

struct RootView: View {
    @State private var selectedTab = 0

    // Вашият съществуващ eventStore и ViewModel
    let eventStore = EKEventStore()
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())

    // MARK: - Нови свойства за "Седмица+Часове"
    @State private var pinnedStartOfWeek: Date = Date()
    @State private var pinnedEvents: [EventDescriptor] = []

    var body: some View {
        NavigationView {
            VStack {
                // Сегментиран контрол за избор на изглед
                Picker("Изглед", selection: $selectedTab) {
                    Text("Месец").tag(0)
                    Text("Ден").tag(1)
                    Text("Година").tag(2)
                    Text("Седмица+Часове").tag(3)
                }
                .pickerStyle(.segmented)
                .padding()

                // Показваме конкретния изглед според селекцията
                switch selectedTab {
                case 0:
                    // Месечен изглед
                    MonthCalendarView(viewModel: calendarVM, startMonth: Date())

                case 1:
                    // Дневен изглед
                    DayCalendarWrapperView(eventStore: calendarVM.eventStore)

                case 2:
                    // Годишен изглед
                    YearCalendarView(viewModel: calendarVM)

                case 3:
                    // Новият пиннат седмичен изглед
                    TwoWayPinnedWeekWrapper(
                        startOfWeek: $pinnedStartOfWeek,
                        events: $pinnedEvents
                    )
                    // Когато се появи този таб, презареждаме събитията
                    .onAppear {
                        loadPinnedWeekEvents()
                    }

                default:
                    Text("Невалидна селекция")
                }
            }
            .navigationTitle("Calendar Demo")
        }
        .onAppear {
            // При първо показване искаме разрешение и зареждаме събития за ViewModel
            calendarVM.requestCalendarAccessIfNeeded {
                let currentYear = Calendar.current.component(.year, from: Date())
                calendarVM.loadEventsForWholeYear(year: currentYear)
            }
            // Инициализираме pinnedStartOfWeek (пример: намираме понеделника)
            pinnedStartOfWeek = startOfThisWeek()
        }
    }

    /// Намира понеделника на текущата седмица
    func startOfThisWeek() -> Date {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        let weekday = cal.component(.weekday, from: today)
        // 1=Sunday, 2=Monday...
        let diff = (weekday == 1) ? 6 : weekday - 2
        return cal.date(byAdding: .day, value: -diff, to: today)!
    }

    /// Презарежда събитията за текущия pinnedStartOfWeek (7 дни напред)
    func loadPinnedWeekEvents() {
        let cal = Calendar.current
        let end = cal.date(byAdding: .day, value: 7, to: pinnedStartOfWeek)!
        let predicate = calendarVM.eventStore.predicateForEvents(
            withStart: pinnedStartOfWeek,
            end: end,
            calendars: nil
        )
        let found = calendarVM.eventStore.events(matching: predicate)
        let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
        pinnedEvents = wrappers
    }
}
