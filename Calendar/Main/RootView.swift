import SwiftUI
import EventKit

struct RootView: View {
    // 1) Дали имаме достъп
    @State private var accessGranted = false
    @State private var loadedUntil: Date = Calendar.current.startOfDay(for: Date())
    private let chunkDays: Int = 30

    /// Докога МАКС можем да зареждаме напред (+3 години)
    private let maxLoadDate: Date = {
        let cal = Calendar.current
        return cal.date(byAdding: .year, value: 3, to: Date())!
    }()

    /// От коя дата сме заредили *назад* (примерно първоначално: днешния ден)
    @State private var loadedFrom: Date = Calendar.current.startOfDay(for: Date())

    /// Докога МИНИМУМ можем да зареждаме назад (до -1 година)
    private let minLoadDate: Date = {
        let cal = Calendar.current
        return cal.date(byAdding: .year, value: -1, to: Date())!
    }()
    // Примерни pinnedEvents за Day/MultiDay
    @State private var pinnedFromDateSingle: Date = Date()
    @State private var pinnedToDateSingle: Date = Date()
    @State private var pinnedEventsSingle: [EventDescriptor] = []
    
    @State private var pinnedFromDateMulti: Date = Date()
    @State private var pinnedToDateMulti: Date = Calendar.current.date(byAdding: .day, value: 7, to: Date())!
    @State private var pinnedEventsMulti: [EventDescriptor] = []
    
    // 2) Всички събития (за списъка)
    @State private var pinnedAllEvents: [EventDescriptor] = []
    
    // 3) Дати, които описват текущия обхват за AllEventsListView
    @State private var loadedStartDate: Date = Date()
    @State private var loadedEndDate: Date   = Date()
    
    // Таймер (за презареждане през 60 сек.)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    
    // Табовете/екраните
    @State private var selectedTab = 3  // 0=Month, 1=Day, 2=Year, 3=MultiDay, 4=AllEventsList
    
    // Sheet за календари
    @State private var showCalendarsSheet = false
    
    // EKEventEditor, ако искате редактиране
    @State private var eventToEdit: EKEvent? = nil
    
    var body: some View {
        ZStack {
            Color(.systemBackground).edgesIgnoringSafeArea(.all)
            
            NavigationView {
                GeometryReader { geometry in
                    let isPortrait = geometry.size.height > geometry.size.width
                    
                    VStack {
                        switch selectedTab {
                            // 0) Month
                        case 0:
                            MonthCalendarView(
                                viewModel: CalendarViewModel.shared,
                                startMonth: Date(),
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            )
                            
                            // 1) Day
                        case 1:
                            TwoWayPinnedMultiDayWrapper(
                                fromDate: $pinnedFromDateSingle,
                                toDate: $pinnedToDateSingle,
                                events: $pinnedEventsSingle,
                                eventStore: CalendarViewModel.shared.eventStore,
                                isSingleDay: true,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            ) { tappedDay in
                                pinnedFromDateSingle = tappedDay
                                pinnedToDateSingle   = tappedDay
                                loadSingleDayEvents()
                            }
                            .onAppear {
                                loadSingleDayEvents()
                            }
                            .onReceive(timer) { _ in
                                loadSingleDayEvents()
                            }
                            
                            // 2) Year
                        case 2:
                            YearCalendarView(
                                viewModel: CalendarViewModel.shared,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            )
                            
                            // 3) MultiDay
                        case 3:
                            TwoWayPinnedMultiDayWrapper(
                                fromDate: $pinnedFromDateMulti,
                                toDate: $pinnedToDateMulti,
                                events: $pinnedEventsMulti,
                                eventStore: CalendarViewModel.shared.eventStore,
                                isSingleDay: false,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            ) { tappedDay in
                                pinnedFromDateSingle = tappedDay
                                pinnedToDateSingle   = tappedDay
                                loadSingleDayEvents()
                                selectedTab = 1
                            }
                            .onAppear {
                                loadMultiDayEvents()
                            }
                            .onReceive(timer) { _ in
                                loadMultiDayEvents()
                            }
                            
                            // 4) AllEventsList
                        case 4:
                            // Тук подаваме и новия метод loadPreviousMonth
                            AllEventsListView(
                                pinnedAllEvents: $pinnedAllEvents,
                                selectedTab: selectedTab,

                                // Смяна на "tab" изгледа
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                },

                                // Първата партида (ако списъкът е празен)
                                loadInitialEvents: {
                                    loadNextChunkOfEvents() // зарежда (примерно) първи “пакет” напред
                                },

                                // Когато стигнем края на списъка (скрол надолу)
                                onLoadMoreAfter: {
                                    // Ако още не сме стигнали +3 години
                                    if loadedUntil < maxLoadDate {
                                        loadNextChunkOfEvents()
                                    }
                                },

                                // Когато стигнем началото на списъка (скрол нагоре)
                                onLoadMoreBefore: {
                                    // Ако още не сме стигнали -1 година
                                    if loadedFrom > minLoadDate {
                                        loadPreviousChunkOfEvents()
                                    }
                                },

                                onEventTap: { descriptor in
                                    // Примерен тап -> EKEventEditor
                                    if let multi = descriptor as? EKMultiDayWrapper {
                                        eventToEdit = multi.realEvent
                                    }
                                }
                            )
                            
                        default:
                            Text("N/A")
                        }
                    }
                    // Toolbar
                    .toolbar {
                        ToolbarItemGroup(placement: .bottomBar) {
                            if isPortrait {
                                Button("Today") {
                                    let today = Calendar.current.startOfDay(for: Date())
                                    pinnedFromDateSingle = today
                                    pinnedToDateSingle = today
                                    selectedTab = 1
                                }
                                Spacer()
                                
                                Button("Calendars") {
                                    showCalendarsSheet = true
                                }
                                Spacer()
                                
                                Button("Inbox") {
                                    // ...
                                }
                            }
                        }
                    }
                }
            }
        }
        .onAppear {
            Task {
                // Искане на достъп
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                
                if accessGranted {
                    // Зареждане на календари
                    CalendarViewModel.shared.reloadCalendars()
                    
                    // Зареждаме събития за годината (примерно)
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)
                    
                    // Ако сме на MultiDay или Day, презареждаме
                    if selectedTab == 3 {
                        loadMultiDayEvents()
                    } else if selectedTab == 1 {
                        loadSingleDayEvents()
                    }
                }
            }
        }
        .sheet(isPresented: $showCalendarsSheet, onDismiss: {
            // Презареждаме събития според новата селекция от календари
            if accessGranted {
                if selectedTab == 3 {
                    loadMultiDayEvents()
                } else if selectedTab == 1 {
                    loadSingleDayEvents()
                } else if selectedTab == 4 {
                    // Ако сме в AllEventsList, може да занулим масива:
                    pinnedAllEvents.removeAll()
                }
            }
        }) {
            CalendarsSheetView()
        }
    }
}

// MARK: - Примерни функции за SingleDay и MultiDay
extension RootView {
    private func loadSingleDayEvents() {
        guard accessGranted else { return }
        let fromOnly = Calendar.current.startOfDay(for: pinnedFromDateSingle)
        guard let toDate = Calendar.current.date(byAdding: .day, value: 1, to: fromOnly) else {
            pinnedEventsSingle = []
            return
        }
        pinnedEventsSingle = fetchAndSplitEvents(from: fromOnly, to: toDate)
    }
    
    private func loadMultiDayEvents() {
        guard accessGranted else { return }
        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: pinnedFromDateMulti)
        
        let toOnly = cal.startOfDay(for: pinnedToDateMulti)
        guard let actualEnd = cal.date(byAdding: .day, value: 1, to: toOnly) else {
            pinnedEventsMulti = []
            return
        }
        
        pinnedEventsMulti = fetchAndSplitEvents(from: fromOnly, to: actualEnd)
    }
}

// MARK: - Функции за LAZY AllEventsListView (двупосочно)
extension RootView {
    func loadInitialMonth() {
        guard accessGranted else { return }
        
        // Пример: Ще заредим 1 месец назад от днес, и 1 месец напред
        let now = Date()
        guard
            let start = Calendar.current.date(byAdding: .month, value: -1, to: now),
            let end   = Calendar.current.date(byAdding: .month, value: 1, to: now)
        else {
            return
        }
        
        loadedStartDate = start
        loadedEndDate   = end
        
        pinnedAllEvents = fetchAndSplitEvents(from: start, to: end)
    }
    
    func loadNextMonth(completion: (() -> Void)? = nil) {
        guard accessGranted else {
            completion?()
            return
        }
        
        // Започваме от loadedEndDate + 1 сек
        let newStart = loadedEndDate.addingTimeInterval(1)
        
        guard let newEnd = Calendar.current.date(byAdding: .month, value: 1, to: newStart) else {
            completion?()
            return
        }
        
        let newEvents = fetchAndSplitEvents(from: newStart, to: newEnd)
        pinnedAllEvents.append(contentsOf: newEvents)
        
        loadedEndDate = newEnd
        
        completion?()
    }
    
    func loadPreviousMonth(completion: (() -> Void)? = nil) {
        guard accessGranted else {
            completion?()
            return
        }
        
        // Краят на новия интервал е (loadedStartDate - 1 сек)
        let newEnd = loadedStartDate.addingTimeInterval(-1)
        
        // Началото е 1 месец по-рано
        guard let newStart = Calendar.current.date(byAdding: .month, value: -1, to: newEnd) else {
            completion?()
            return
        }
        
        let newEvents = fetchAndSplitEvents(from: newStart, to: newEnd)
        
        // Слагаме ги в началото на списъка
        pinnedAllEvents.insert(contentsOf: newEvents, at: 0)
        
        // Ъпдейтваме loadedStartDate
        loadedStartDate = newStart
        
        completion?()
    }
}

// MARK: - Общ метод за взимане на събития
extension RootView {
    private func fetchAndSplitEvents(from: Date, to: Date) -> [EventDescriptor] {
        let store = CalendarViewModel.shared.eventStore
        let cal   = Calendar.current
        
        let allowedCalendars = CalendarViewModel.shared.allCalendars.filter {
            CalendarViewModel.shared.selectedCalendarIDs.contains($0.calendarIdentifier)
        }
        
        let predicate = store.predicateForEvents(withStart: from, end: to, calendars: allowedCalendars)
        let found = store.events(matching: predicate)
        
        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            // Ако е повече от 1 ден
            if cal.startOfDay(for: ekEvent.startDate) != cal.startOfDay(for: ekEvent.endDate) {
                splitted.append(contentsOf: splitEventByDays(ekEvent, startRange: from, endRange: to))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        return splitted
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

extension RootView {
    /// Зарежда “парче” от текущия `loadedUntil` .. +chunkDays, добавя го към pinnedAllEvents и обновява `loadedUntil`.
    private func loadNextChunkOfEvents() {
        guard accessGranted else { return }

        let cal = Calendar.current
        let fromDate = loadedUntil

        // Ако вече сме надвишили 3 години -> няма да зареждаме
        guard fromDate < maxLoadDate else { return }

        // Край за този “chunk”
        let toDateRaw = cal.date(byAdding: .day, value: chunkDays, to: fromDate)!
        // но ако надхвърля maxLoadDate, го “отрязваме”
        let toDate = min(toDateRaw, maxLoadDate)

        // Извличаме събития
        let newEvents = fetchAndSplitEvents(from: fromDate, to: toDate)

        // Добавяме ги към списъка
        pinnedAllEvents.append(contentsOf: newEvents)

        // За да сме сигурни, че е хронологично (ascending)
        pinnedAllEvents.sort { $0.dateInterval.start < $1.dateInterval.start }

        // Ъпдейт на loadedUntil
        loadedUntil = toDate
    }

    /// Зарежда “парче” ОТ (loadedFrom - chunkDays) .. ДО loadedFrom (назад във времето).
    private func loadPreviousChunkOfEvents() {
        guard accessGranted else { return }

        let cal = Calendar.current
        let toDate = loadedFrom

        // Ако вече сме под минус 1 година -> няма да зареждаме
        guard toDate > minLoadDate else { return }

        // Начало за този “chunk”
        let fromDateRaw = cal.date(byAdding: .day, value: -chunkDays, to: toDate)!
        // но ако паднем под minLoadDate, го “отрязваме”
        let fromDate = max(fromDateRaw, minLoadDate)

        // Извличаме събития
        let newEvents = fetchAndSplitEvents(from: fromDate, to: toDate)

        // Добавяме ги към списъка
        pinnedAllEvents.append(contentsOf: newEvents)

        // За да сме сигурни, че е хронологично
        pinnedAllEvents.sort { $0.dateInterval.start < $1.dateInterval.start }

        // Ъпдейт на loadedFrom
        loadedFrom = fromDate
    }
}
