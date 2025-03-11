import SwiftUI
import EventKit

struct RootView: View {
    @State var accessGranted = false
    
    // MARK: - Single Day
    @State private var pinnedFromDateSingle: Date = Date()
    @State private var pinnedToDateSingle: Date = Date()
    @State private var pinnedEventsSingle: [EventDescriptor] = []
    
    // MARK: - Multi Day
    @State private var pinnedFromDateMulti: Date = Date()
    @State private var pinnedToDateMulti: Date = Calendar.current.date(byAdding: .day, value: 7, to: Date())!
    @State private var pinnedEventsMulti: [EventDescriptor] = []
    
    // MARK: - All Events
    @State private var pinnedAllEvents: [EventDescriptor] = []
    
    // За "lazy load"
    @State private var loadedStartDate: Date = Calendar.current.startOfMonth(for: Date())
    @State private var loadedEndDate: Date   = Calendar.current.endOfMonth(for: Date())
    
    // Таймер (презареждане на 60 сек)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    
    // Избор на екран (0=Month, 1=Day, 2=Year, 3=MultiDay, 4=AllEventsList)
    @State private var selectedTab = 3 // Да стартира примерно с MultiDay
    
    // Sheet за календари
    @State private var showCalendarsSheet = false
    
    // EKEventEditor, ако искате да редактирате събития
    @State private var eventToEdit: EKEvent? = nil
    
    var body: some View {
        ZStack {
            Color(.systemBackground).edgesIgnoringSafeArea(.all)
            
            NavigationView {
                GeometryReader { geometry in
                    // 1) Проверяваме ориентацията
                    let isPortrait = geometry.size.height > geometry.size.width
                    
                    VStack {
                        switch selectedTab {
                        case 0:
                            MonthCalendarView(
                                viewModel: CalendarViewModel.shared,
                                startMonth: Date(),
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            )
                            
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
                            
                        case 2:
                            YearCalendarView(
                                viewModel: CalendarViewModel.shared,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            )
                            
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
                            
                        case 4:
                            // Нашият списък с ALL events, с “lazy load”
                            AllEventsListView(
                                pinnedAllEvents: $pinnedAllEvents,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                },
                                loadInitialMonth: { loadInitialMonth() },
                                // Забележете, че сега приемаме completion
                                loadNextMonth: { completion in
                                    loadNextMonth(completion: completion)
                                },
                                onEventTap: { descriptor in
                                    if let multi = descriptor as? EKMultiDayWrapper {
                                        eventToEdit = multi.realEvent
                                    }
                                }
                            )
                            
                        default:
                            Text("N/A")
                        }
                    }
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
                // 1) Искаме достъп до календарите
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                
                if accessGranted {
                    // 2) Зареждаме календари
                    CalendarViewModel.shared.reloadCalendars()
                    
                    // 3) Примерно зареждаме събития за текущата година
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)
                    
                    // 4) Ако сме на MultiDay или Day, презареждаме
                    if selectedTab == 3 {
                        loadMultiDayEvents()
                    } else if selectedTab == 1 {
                        loadSingleDayEvents()
                    }
                }
            }
        }
        .sheet(isPresented: $showCalendarsSheet, onDismiss: {
            // Когато приключим CalendarsSheet
            if accessGranted {
                if selectedTab == 3 {
                    loadMultiDayEvents()
                } else if selectedTab == 1 {
                    loadSingleDayEvents()
                } else if selectedTab == 4 {
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

// MARK: - Функции за LAZY AllEventsListView
extension RootView {
    func loadInitialMonth() {
        guard accessGranted else { return }
        
        // Започваме от днешния ден (startOfDay)
        let start = Calendar.current.startOfDay(for: Date())
        // Прибавяме 1 месец към днешния ден
        guard let end = Calendar.current.date(byAdding: .month, value: 1, to: start) else {
            return
        }
        
        loadedStartDate = start
        loadedEndDate   = end
        
        pinnedAllEvents = fetchAndSplitEvents(from: start, to: end)
    }
    
    // Тук добавяме optional completion, за да сигнализираме кога сме готови
    func loadNextMonth(completion: (() -> Void)? = nil) {
        guard accessGranted else {
            completion?()
            return
        }
        
        // Стартът е последната крайна дата + 1 сек
        let newStart = loadedEndDate.addingTimeInterval(1)
        
        // Краят е още 1 месец напред
        guard let newEnd = Calendar.current.date(byAdding: .month, value: 1, to: newStart) else {
            completion?()
            return
        }
        
        let newEvents = fetchAndSplitEvents(from: newStart, to: newEnd)
        pinnedAllEvents.append(contentsOf: newEvents)
        
        loadedEndDate = newEnd
        
        // Казваме че сме готови
        completion?()
    }
}

// MARK: - Общ метод
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
            // Ако събитието обхваща повече от 1 ден, го “разделяме” на парчета
            if cal.startOfDay(for: ekEvent.startDate) != cal.startOfDay(for: ekEvent.endDate) {
                splitted.append(contentsOf: splitEventByDays(ekEvent, startRange: from, endRange: to))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        return splitted
    }
    
    private func splitEventByDays(_ ekEvent: EKEvent, startRange: Date, endRange: Date) -> [EKMultiDayWrapper] {
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

// Примерен extension за start/endOfMonth
extension Calendar {
    func startOfMonth(for date: Date) -> Date {
        guard let start = self.date(from: self.dateComponents([.year, .month], from: date)) else {
            return date
        }
        return start
    }
    
    func endOfMonth(for date: Date) -> Date {
        guard
            let start = self.date(from: self.dateComponents([.year, .month], from: date)),
            let plusOneMonth = self.date(byAdding: .month, value: 1, to: start),
            let minusOneSec  = self.date(byAdding: .second, value: -1, to: plusOneMonth)
        else {
            return date
        }
        return minusOneSec
    }
}
