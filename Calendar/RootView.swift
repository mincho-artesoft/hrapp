import SwiftUI
import EventKit
import CalendarKit

struct RootView: View {
    @State private var selectedTab = 3

    // Единична споделена инстанция на EKEventStore
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())

    // За Multi-Day (бивш седмичен) изглед
    @State private var pinnedFromDate: Date = {
        // Примерно: днешна дата
        let cal = Calendar.current
        return cal.startOfDay(for: Date())
    }()
    @State private var pinnedToDate: Date = {
        // По подразбиране +7 дни
        let cal = Calendar.current
        if let plus7 = cal.date(byAdding: .day, value: 7, to: cal.startOfDay(for: Date())) {
            return plus7
        }
        return Date()
    }()
    @State private var pinnedEvents: [EventDescriptor] = []

    // Примерно – за Day View
    @State private var dayTabSelectedDate = Date()

    // Таймер за презареждане
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    var body: some View {
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
                    DayCalendarWrapperView(
                        eventStore: calendarVM.eventStore,
                        date: dayTabSelectedDate
                    )
                case 2:
                    YearCalendarView(viewModel: calendarVM)
                case 3:
                    // Нашият Multi-Day изглед
                    TwoWayPinnedWeekWrapper(
                        fromDate: $pinnedFromDate,
                        toDate: $pinnedToDate,
                        events: $pinnedEvents,
                        eventStore: calendarVM.eventStore
                    ) { tappedDay in
                        // Ако натиснем върху label на ден – прехвърляме се на Day View
                        self.dayTabSelectedDate = tappedDay
                        self.selectedTab = 1
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
        .onAppear {
            // Първоначално искаме да поискаме достъп и да заредим данни
            calendarVM.requestCalendarAccessIfNeeded {
                // Пример: зареждаме събития за текущата година
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
        let predicate = calendarVM.eventStore.predicateForEvents(withStart: fromOnly, end: actualEnd, calendars: nil)
        let found = calendarVM.eventStore.events(matching: predicate)

        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            guard let realStart = ekEvent.startDate, let realEnd = ekEvent.endDate else { continue }
            if cal.startOfDay(for: realStart) != cal.startOfDay(for: realEnd) {
                splitted.append(contentsOf: splitEventByDays(ekEvent, startRange: fromOnly, endRange: actualEnd))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        pinnedEvents = splitted
    }

    private func splitEventByDays(_ ekEvent: EKEvent, startRange: Date, endRange: Date) -> [EKMultiDayWrapper] {
        var results = [EKMultiDayWrapper]()
        let cal = Calendar.current
        let realStart = max(ekEvent.startDate, startRange)
        let realEnd   = min(ekEvent.endDate, endRange)
        if realStart >= realEnd { return results }
        var currentStart = realStart
        while currentStart < realEnd {
            guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart) else { break }
            let pieceEnd = min(endOfDay, realEnd)
            let partial = EKMultiDayWrapper(realEvent: ekEvent, partialStart: currentStart, partialEnd: pieceEnd)
            results.append(partial)
            guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                  let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay) else { break }
            currentStart = morning
        }
        return results
    }
}
