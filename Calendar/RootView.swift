//
//  RootView.swift
//  ExampleCalendarApp
//
//  Основен SwiftUI View с 4 таба:
//   - Месечен изглед (MonthCalendarView)
//   - Дневен изглед (DayCalendarWrapperView)
//   - Годишен изглед (YearCalendarView)
//   - Седмичен изглед (TwoWayPinnedWeekWrapper)
//

import SwiftUI
import EventKit
import CalendarKit

struct RootView: View {
    @State private var selectedTab = 3

    // Единен EKEventStore, който ползваме навсякъде
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())

    // Седмичен изглед (startOfWeek + масив от EventDescriptor)
    @State private var pinnedStartOfWeek: Date = Date()
    @State private var pinnedEvents: [EventDescriptor] = []

    // Таймер за рефреш всяка минута (примерно)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    var body: some View {
        NavigationView {
            VStack {
                // 4 таба (Месец, Ден, Година, Седмица)
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
                    // Месечен
                    MonthCalendarView(viewModel: calendarVM, startMonth: Date())

                case 1:
                    // Дневен (CalendarKit)
                    DayCalendarWrapperView(eventStore: calendarVM.eventStore)

                case 2:
                    // Годишен
                    YearCalendarView(viewModel: calendarVM)

                case 3:
                    // Седмичен (TwoWayPinnedWeekWrapper)
                    TwoWayPinnedWeekWrapper(
                        startOfWeek: $pinnedStartOfWeek,
                        events: $pinnedEvents,
                        eventStore: calendarVM.eventStore
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
            // При първо пускане -> достъп до календара
            calendarVM.requestCalendarAccessIfNeeded {
                // Зареждаме годишните (примерно)
                let year = Calendar.current.component(.year, from: Date())
                calendarVM.loadEventsForWholeYear(year: year)
            }

            // Намираме понеделника
            pinnedStartOfWeek = startOfThisWeek()
        }
    }

    /// Намери понеделника на текущата седмица
    private func startOfThisWeek() -> Date {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        let weekday = cal.component(.weekday, from: today) // 1=Sunday, 2=Monday,...
        // Ако е неделя (1), offset=6, иначе offset=weekday-2
        let diff = (weekday == 1) ? 6 : weekday - 2
        return cal.date(byAdding: .day, value: -diff, to: today)!
    }

    /// Зареждаме събития за pinnedStartOfWeek..+7 дни
    private func loadPinnedWeekEvents() {
        let cal = Calendar.current
        let end = cal.date(byAdding: .day, value: 7, to: pinnedStartOfWeek)!
        let predicate = calendarVM.eventStore.predicateForEvents(
            withStart: pinnedStartOfWeek, end: end, calendars: nil
        )
        let found = calendarVM.eventStore.events(matching: predicate)
        let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
        pinnedEvents = wrappers
    }
}
