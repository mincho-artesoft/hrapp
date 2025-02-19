import SwiftUI
import EventKit
import CalendarKit

struct RootView: View {
    @State private var selectedTab = 3

    // Единична споделена инстанция на EKEventStore
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())

    // За Multi-Day изгледа
    @State private var pinnedFromDate: Date = {
        let cal = Calendar.current
        return cal.startOfDay(for: Date())
    }()
    @State private var pinnedToDate: Date = {
        let cal = Calendar.current
        if let plus7 = cal.date(byAdding: .day, value: 7, to: cal.startOfDay(for: Date())) {
            return plus7
        }
        return Date()
    }()
    @State private var pinnedEvents: [EventDescriptor] = []

    // За Day View (ако е необходимо)
    @State private var dayTabSelectedDate = Date()

    // Нови state‑променливи за избрания ден (начало и край)
    @State private var selectedStartTime: Date = Calendar.current.startOfDay(for: Date())
    @State private var selectedEndTime: Date = Calendar.current.date(byAdding: .day, value: 1, to: Calendar.current.startOfDay(for: Date()))!

    // Таймер за презареждане
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    // Formatter за показване на времето
    var timeFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter
    }

    var body: some View {
        ZStack {
            // Системен фон
            Color(.systemBackground)
                .edgesIgnoringSafeArea(.all)
            
            NavigationView {
                VStack {
                    Picker("View", selection: $selectedTab) {
                        Text("Month").tag(0)
                        Text("Day").tag(1)
                        Text("Year").tag(2)
                        Text("MultiDay").tag(3)
                    }
                    .pickerStyle(.segmented)
                    .padding()

                    switch selectedTab {
                    case 0:
                        MonthCalendarView(viewModel: calendarVM, startMonth: Date())
                    case 1:
                        // Пример: показваме TwoWayPinnedWeekWrapper като single-day
                        TwoWayPinnedWeekWrapper(
                            fromDate: $pinnedFromDate,
                            toDate: $pinnedFromDate,
                            events: $pinnedEvents,
                            eventStore: calendarVM.eventStore,
                            isSingleDay: true // <-- ВАЖНО: single day
                        ) { tappedDay in
                            // Ако потребителят цъкне на dayLabel, задаваме една и съща from/to
                            pinnedFromDate = tappedDay
                            pinnedToDate   = tappedDay
                        }
                        .onAppear {
                            loadPinnedRangeEvents()
                        }
                        .onReceive(timer) { _ in
                            loadPinnedRangeEvents()
                        }

                    case 2:
                        YearCalendarView(viewModel: calendarVM)

                    case 3:
                        // Пример: показваме TwoWayPinnedWeekWrapper като multi-day
                        TwoWayPinnedWeekWrapper(
                            fromDate: $pinnedFromDate,
                            toDate: $pinnedToDate,
                            events: $pinnedEvents,
                            eventStore: calendarVM.eventStore,
                            isSingleDay: false // <-- Multi-day
                        ) { tappedDay in
                            // Обновяваме началния и крайния ден
                            pinnedFromDate = tappedDay
                            pinnedToDate   = tappedDay
                        }
                        .onAppear {
                            loadPinnedRangeEvents()
                        }
                        .onReceive(timer) { _ in
                            loadPinnedRangeEvents()
                        }
                        
                    default:
                        Text("N/A")
                    }
                }
                .navigationTitle("Calendar Demo")
            }
        }
        .onAppear {
            // При стартиране искаме достъп до календара и зареждаме данни
            calendarVM.requestCalendarAccessIfNeeded {
                let year = Calendar.current.component(.year, from: Date())
                calendarVM.loadEventsForWholeYear(year: year)
            }
        }
    }
    
    private func loadPinnedRangeEvents() {
        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: pinnedFromDate)
        let toOnly   = cal.startOfDay(for: pinnedToDate)
        guard let actualEnd = cal.date(byAdding: .day, value: 1, to: toOnly) else { return }
        let predicate = calendarVM.eventStore.predicateForEvents(
            withStart: fromOnly,
            end: actualEnd,
            calendars: nil
        )
        let found = calendarVM.eventStore.events(matching: predicate)

        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            guard let realStart = ekEvent.startDate,
                  let realEnd   = ekEvent.endDate else { continue }
            
            // Ако събитието е в няколко дни, режем го
            if cal.startOfDay(for: realStart) != cal.startOfDay(for: realEnd) {
                splitted.append(contentsOf: splitEventByDays(ekEvent,
                                                             startRange: fromOnly,
                                                             endRange: actualEnd))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        pinnedEvents = splitted
    }
    
    private func splitEventByDays(_ ekEvent: EKEvent,
                                  startRange: Date,
                                  endRange: Date) -> [EKMultiDayWrapper] {
        var results = [EKMultiDayWrapper]()
        let cal = Calendar.current
        let realStart = max(ekEvent.startDate, startRange)
        let realEnd   = min(ekEvent.endDate, endRange)
        if realStart >= realEnd { return results }

        var currentStart = realStart
        while currentStart < realEnd {
            guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart) else {
                break
            }
            let pieceEnd = min(endOfDay, realEnd)
            let partial = EKMultiDayWrapper(realEvent: ekEvent,
                                            partialStart: currentStart,
                                            partialEnd: pieceEnd)
            results.append(partial)

            guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                  let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay) else {
                break
            }
            currentStart = morning
        }
        return results
    }
}
