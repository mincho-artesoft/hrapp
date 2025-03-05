import SwiftUI
import EventKit

// MARK: - Основен RootView
struct RootView: View {
    @State private var selectedTab = 3  // MultiDay, примерно
    @State var accessGranted = false

    // За Multi-Day примера
    @State private var pinnedFromDate: Date = Date()
    @State private var pinnedToDate: Date = Date()
    @State private var pinnedEvents: [EventDescriptor] = []

    // Таймер за презареждане (пример)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    // Показваме/скриваме листа с календари
    @State private var showCalendarsSheet = false
    // Показваме/скриваме AddCalendarView
    @State private var showAddCalendarSheet = false

    var body: some View {
        ZStack {
            Color(.systemBackground)
                .edgesIgnoringSafeArea(.all)

            NavigationView {
                VStack {
                    // Горен Picker (Day / MultiDay / Month / Year / TEST)
                    Picker("View", selection: $selectedTab) {
                        Text("Day").tag(1)
                        Text("MultiDay").tag(3)
                        Text("Month").tag(0)
                        Text("Year").tag(2)
                        Text("TEST").tag(4)
                    }
                    .pickerStyle(.segmented)
                    .padding()

                    // Превключваме между различните примери
                    switch selectedTab {
                    case 0:
                        // Пример: месечен календар
                        MonthCalendarView(
                            viewModel: CalendarViewModel.shared,
                            startMonth: Date()
                        )

                    case 1:
                        // Single-day пример
                        TwoWayPinnedMultiDayWrapper(
                            fromDate: $pinnedFromDate,
                            toDate: $pinnedFromDate,
                            events: $pinnedEvents,
                            eventStore: CalendarViewModel.shared.eventStore,
                            isSingleDay: true
                        ) { tappedDay in
                            pinnedFromDate = tappedDay
                            pinnedToDate   = tappedDay
                        }
                        .onAppear { loadPinnedRangeEvents() }
                        .onReceive(timer) { _ in loadPinnedRangeEvents() }

                    case 2:
                        // Годишен календар
                        YearCalendarView(viewModel: CalendarViewModel.shared)

                    case 3:
                        // Multi-day
                        TwoWayPinnedMultiDayWrapper(
                            fromDate: $pinnedFromDate,
                            toDate: $pinnedToDate,
                            events: $pinnedEvents,
                            eventStore: CalendarViewModel.shared.eventStore,
                            isSingleDay: false
                        ) { tappedDay in
                            pinnedFromDate = tappedDay
                            pinnedToDate   = tappedDay
                        }
                        .onAppear { loadPinnedRangeEvents() }
                        .onReceive(timer) { _ in loadPinnedRangeEvents() }

                    case 4:
                        // Тестова страница
                        ContentView()

                    default:
                        Text("N/A")
                    }
                }
                .navigationTitle("Calendar Demo")
                // Долна лента с 3 бутона: Today / Calendars / Inbox (+AddCalendar, ако искате)
                .toolbar {
                    ToolbarItemGroup(placement: .bottomBar) {
                        // “Today”
                        Button("Today") {
                            pinnedFromDate = Calendar.current.startOfDay(for: Date())
                            pinnedToDate   = pinnedFromDate
                            selectedTab    = 1 // Day view
                        }
                        Spacer()

                        // “Calendars”
                        Button("Calendars") {
                            showCalendarsSheet = true
                        }
                        Spacer()

                        // “Inbox” (пример)
                        Button("Inbox") {
                            // Може да покажете някакъв екран за покани
                        }
                    }
                }
            }
        }
        // При първо отваряне на RootView
        .onAppear {
            Task {
                // Заявяваме достъп асинхронно
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                if accessGranted {
                    // Зареждаме събития за текущата година (примерно)
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)

                    // Ако искате да заредите и pinnedEvents веднага
                    loadPinnedRangeEvents()
                }
            }
        }
        // Когато затваряме листа с календари – веднага презареждаме pinnedEvents
        .sheet(isPresented: $showCalendarsSheet, onDismiss: {
            // Презареждаме текущо видимите събития
            if accessGranted {
                loadPinnedRangeEvents()
            }
        }) {
            CalendarsSheetView()
        }
    }

    // Зареждаме събития в pinnedEvents за диапазона [pinnedFromDate ... pinnedToDate]
    private func loadPinnedRangeEvents() {
        guard accessGranted else { return }
        let cal = Calendar.current
        let store = CalendarViewModel.shared.eventStore

        let fromOnly = cal.startOfDay(for: pinnedFromDate)
        let toOnly   = cal.startOfDay(for: pinnedToDate)
        guard let actualEnd = cal.date(byAdding: .day, value: 1, to: toOnly) else { return }

        let predicate = store.predicateForEvents(withStart: fromOnly, end: actualEnd, calendars: nil)
        let found = store.events(matching: predicate)

        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            // Ако събитието прехвърля няколко дни, разцепваме го
            if cal.startOfDay(for: ekEvent.startDate) != cal.startOfDay(for: ekEvent.endDate) {
                splitted.append(contentsOf: splitEventByDays(
                    ekEvent,
                    startRange: fromOnly,
                    endRange: actualEnd
                ))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        pinnedEvents = splitted
    }

    // Ако event е много‐дневен, правим парчета за всеки ден
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
            guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart)
            else { break }

            let pieceEnd = min(endOfDay, realEnd)
            let partial = EKMultiDayWrapper(
                realEvent: ekEvent,
                partialStart: currentStart,
                partialEnd: pieceEnd
            )
            results.append(partial)

            guard
                let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay)
            else {
                break
            }
            currentStart = morning
        }
        return results
    }
}
