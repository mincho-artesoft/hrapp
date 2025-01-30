//
//  RootView.swift
//  ExampleCalendarApp
//

import SwiftUI
import EventKit
import CalendarKit

struct RootView: View {
    @State private var selectedTab = 3

    // Единен EKEventStore
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())

    @State private var pinnedStartOfWeek: Date = Date()
    @State private var pinnedEvents: [EventDescriptor] = []

    // Тук пазим кой ден сме избрали за Day View:
    @State private var dayTabSelectedDate = Date()

    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    var body: some View {
        NavigationView {
            VStack {
                Picker("Изглед", selection: $selectedTab) {
                    Text("Месец").tag(0)
                    Text("Ден").tag(1)
                    Text("Година").tag(2)
                    Text("Седмица").tag(3)
                }
                .pickerStyle(.segmented)
                .padding()

                switch selectedTab {
                case 0:
                    MonthCalendarView(viewModel: calendarVM, startMonth: Date())
                case 1:
                    // Day View, подаваме конкретна дата
                    DayCalendarWrapperView(
                        eventStore: calendarVM.eventStore,
                        date: dayTabSelectedDate
                    )
                case 2:
                    YearCalendarView(viewModel: calendarVM)
                case 3:
                    TwoWayPinnedWeekWrapper(
                        startOfWeek: $pinnedStartOfWeek,
                        events: $pinnedEvents,
                        eventStore: calendarVM.eventStore,
                        onDayLabelTap: { tappedDate in
                            // Когато натиснем върху ден (DaysHeaderView):
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
                    Text("Невалидна селекция")
                }
            }
            .navigationTitle("Calendar Demo")
        }
        .onAppear {
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
        let weekday = cal.component(.weekday, from: today) // 1=Sun
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
        let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
        pinnedEvents = wrappers
    }
}
