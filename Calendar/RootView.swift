import SwiftUI
import EventKit
import CalendarKit

struct RootView: View {
    @State private var selectedTab = 3

    // Единична споделена инстанция на EKEventStore
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())

    @State private var pinnedStartOfWeek: Date = Date()
    @State private var pinnedEvents: [EventDescriptor] = []

    // За да отворим Day View – коя дата е избрана:
    @State private var dayTabSelectedDate = Date()

    // Таймер за презареждане на pinnedEvents всяка минута в Week View
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
                    // Проста Month View
                    MonthCalendarView(viewModel: calendarVM, startMonth: Date())
                case 1:
                    // Day View – подаваме избраната дата
                    DayCalendarWrapperView(
                        eventStore: calendarVM.eventStore,
                        date: dayTabSelectedDate
                    )
                case 2:
                    // Проста Year View
                    YearCalendarView(viewModel: calendarVM)
                case 3:
                    // Нашият персонализиран 2‑way pinned Week View
                    TwoWayPinnedWeekWrapper(
                        startOfWeek: $pinnedStartOfWeek,
                        events: $pinnedEvents,
                        eventStore: calendarVM.eventStore,
                        onDayLabelTap: { tappedDate in
                            // При тап върху ден – превключваме към Day View
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
            // Искане за достъп и зареждане на събития за цялата година
            calendarVM.requestCalendarAccessIfNeeded {
                let year = Calendar.current.component(.year, from: Date())
                calendarVM.loadEventsForWholeYear(year: year)
            }
            pinnedStartOfWeek = startOfThisWeek()
        }
    }

    // Изчисляваме началото на седмицата (примерно – понеделник)
    private func startOfThisWeek() -> Date {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        let weekday = cal.component(.weekday, from: today)
        // Ако приемем, че седмицата започва в понеделник:
        // Ако Sunday (1) -> връщаме предишния Monday (diff = 6)
        // Ако Monday (2) -> diff = 0, ако Tuesday (3) -> diff = 1 и т.н.
        let diff = (weekday == 1) ? 6 : weekday - 2
        return cal.date(byAdding: .day, value: -diff, to: today)!
    }

    // Зареждаме събитията за седмичния интервал (pinned week events)
    private func loadPinnedWeekEvents() {
        let cal = Calendar.current
        guard let end = cal.date(byAdding: .day, value: 7, to: pinnedStartOfWeek) else { return }
        
        let predicate = calendarVM.eventStore.predicateForEvents(withStart: pinnedStartOfWeek,
                                                                 end: end,
                                                                 calendars: nil)
        let found = calendarVM.eventStore.events(matching: predicate)
        
        var wrappers = [EventDescriptor]()
        for event in found {
            guard let realStart = event.startDate, let realEnd = event.endDate else { continue }
            // Изчисляваме разликата в дните между началото и края на събитието
            let dayDifference = cal.dateComponents([.day], from: realStart, to: realEnd).day ?? 0
            if dayDifference > 0 {
                // Ако събитието спанава повече от един ден – го разделяме на части
                wrappers.append(contentsOf: splitEventByDays(event, startOfWeek: pinnedStartOfWeek, endOfWeek: end))
            } else {
                // Ако е събитие в рамките на един ден – използваме EKMultiDayWrapper
                wrappers.append(EKMultiDayWrapper(realEvent: event))
            }
        }
        pinnedEvents = wrappers
    }
    
    // Функция, която "разбива" многодневно събитие на отделни части за всеки ден в седмичния интервал
    private func splitEventByDays(_ ekEvent: EKEvent, startOfWeek: Date, endOfWeek: Date) -> [EKMultiDayWrapper] {
        var results = [EKMultiDayWrapper]()
        let cal = Calendar.current

        guard let realStart = ekEvent.startDate, let realEnd = ekEvent.endDate else { return results }
        
        // Ограничаваме интервала до седмичния диапазон
        var currentStart = max(realStart, startOfWeek)
        let finalEnd = min(realEnd, endOfWeek)
        if currentStart >= finalEnd { return results }
        
        // За всеки ден от интервала генерираме partial wrapper
        while currentStart < finalEnd {
            guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart) else { break }
            let pieceEnd = min(endOfDay, finalEnd)
            let partial = EKMultiDayWrapper(realEvent: ekEvent,
                                            partialStart: currentStart,
                                            partialEnd: pieceEnd)
            results.append(partial)
            
            // Преминаваме към следващия ден (00:00)
            guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                  let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay) else { break }
            currentStart = morning
        }
        return results
    }
}
