//
//  RootView.swift
//  ExampleCalendarApp
//
//  Тук имаме основното SwiftUI View с табове:
//   - Месечен изглед (MonthCalendarView)
//   - Дневен изглед (DayCalendarWrapperView, базиран на CalendarKit)
//   - Годишен изглед (YearCalendarView)
//   - Седмичен изглед (TwoWayPinnedWeekWrapper)
//

import SwiftUI
import EventKit
import Combine
import CalendarKit

struct RootView: View {
    @State private var selectedTab = 0

    /// Един-единствен `EKEventStore`, който се ползва навсякъде
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())

    // Свойства за седмичния изглед
    @State private var pinnedStartOfWeek: Date = Date()
    @State private var pinnedEvents: [EventDescriptor] = []

    // Таймер (рефреш всяка минута)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    var body: some View {
        NavigationView {
            VStack {
                // Сегментиран контрол (4 таба)
                Picker("Изглед", selection: $selectedTab) {
                    Text("Месец").tag(0)
                    Text("Ден").tag(1)
                    Text("Година").tag(2)
                    Text("Седмица").tag(3)
                }
                .pickerStyle(.segmented)
                .padding()

                // Показваме конкретния изглед според селекцията
                switch selectedTab {
                case 0:
                    // Месечен изглед
                    MonthCalendarView(viewModel: calendarVM, startMonth: Date())

                case 1:
                    // Дневен изглед (CalendarKit DayViewController)
                    DayCalendarWrapperView(eventStore: calendarVM.eventStore)

                case 2:
                    // Годишен изглед
                    YearCalendarView(viewModel: calendarVM)

                case 3:
                    // Седмичен изглед (TwoWayPinnedWeekWrapper)
                    TwoWayPinnedWeekWrapper(
                        startOfWeek: $pinnedStartOfWeek,
                        events: $pinnedEvents,
                        // ВАЖНО: подаваме един и същи EventStore на седмичния изглед
                        eventStore: calendarVM.eventStore
                    )
                    .onAppear {
                        // При показване -> зареждаме събития за седмицата
                        loadPinnedWeekEvents()
                    }
                    // На всяка минута -> рефреш
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
            // При първо показване: искаме разрешение за календара и зареждаме годишни събития
            calendarVM.requestCalendarAccessIfNeeded {
                let currentYear = Calendar.current.component(.year, from: Date())
                calendarVM.loadEventsForWholeYear(year: currentYear)
            }
            // Инициализираме pinnedStartOfWeek да е понеделник
            pinnedStartOfWeek = startOfThisWeek()
        }
    }

    /// Намира понеделника на текущата седмица
    func startOfThisWeek() -> Date {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        let weekday = cal.component(.weekday, from: today) // 1 = Sunday
        // Ако е неделя (1), offset = 6 дена назад, иначе offset = weekday - 2
        let diff = (weekday == 1) ? 6 : weekday - 2
        return cal.date(byAdding: .day, value: -diff, to: today)!
    }

    /// Зарежда събитията за [pinnedStartOfWeek..+7 дни]
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
