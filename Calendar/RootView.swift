import SwiftUI
import EventKit
import CalendarKit

struct RootView: View {
    @State private var selectedTab = 3

    // One shared EKEventStore
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())

    @State private var pinnedStartOfWeek: Date = Date()
    @State private var pinnedEvents: [EventDescriptor] = []

    // Which day we open in “Day” tab:
    @State private var dayTabSelectedDate = Date()

    // So that we can refresh pinnedEvents every minute in the Week tab
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    var body: some View {
        NavigationView {
            VStack {
                Picker("View", selection: $selectedTab) {
                    Text("Month").tag(0)
                    Text("Day").tag(1)
                    Text("Year").tag(2)
                    Text("Week").tag(3)
                }
                .pickerStyle(.segmented)
                .padding()

                switch selectedTab {
                case 0:
                    // A simple Month view
                    MonthCalendarView(viewModel: calendarVM, startMonth: Date())
                case 1:
                    // Day View, passing a selected date
                    DayCalendarWrapperView(
                        eventStore: calendarVM.eventStore,
                        date: dayTabSelectedDate
                    )
                case 2:
                    // A simple Year view
                    YearCalendarView(viewModel: calendarVM)
                case 3:
                    // Our custom 2‐way pinned Week view
                    TwoWayPinnedWeekWrapper(
                        startOfWeek: $pinnedStartOfWeek,
                        events: $pinnedEvents,
                        eventStore: calendarVM.eventStore,
                        onDayLabelTap: { tappedDate in
                            // Switch to Day tab
                            self.dayTabSelectedDate = tappedDate
                            self.selectedTab = 1
                        }
                    )
                    .onAppear {
                        loadPinnedWeekEvents()
                    }
                    .onReceive(timer) { _ in
                        loadPinnedWeekEvents()
                    }

                default:
                    Text("Invalid selection")
                }
            }
            .navigationTitle("Calendar Demo")
        }
        .onAppear {
            // Request access, then load a year’s worth of events
            calendarVM.requestCalendarAccessIfNeeded {
                let year = Calendar.current.component(.year, from: Date())
                calendarVM.loadEventsForWholeYear(year: year)
            }
            pinnedStartOfWeek = startOfThisWeek()
        }
    }

    private func startOfThisWeek() -> Date {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        // By default, Sunday = 1, Monday = 2, ...
        let weekday = cal.component(.weekday, from: today)
        // Example: if Monday = 2 => diff = 0
        // If Sunday = 1 => diff = 6 (going back to Monday)
        let diff = (weekday == 1) ? 6 : weekday - 2
        return cal.date(byAdding: .day, value: -diff, to: today)!
    }

    private func loadPinnedWeekEvents() {
        let cal = Calendar.current
        let end = cal.date(byAdding: .day, value: 7, to: pinnedStartOfWeek)!
        let predicate = calendarVM.eventStore.predicateForEvents(withStart: pinnedStartOfWeek,
                                                                 end: end,
                                                                 calendars: nil)
        let found = calendarVM.eventStore.events(matching: predicate)
        // Wrap them so that TwoWayPinnedWeekWrapper can display them
        // We'll just use basic EKWrapper or multi-day wrapper:
        let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
        pinnedEvents = wrappers
    }
}
