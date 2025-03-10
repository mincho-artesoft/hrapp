import SwiftUI
import EventKit

// MARK: - RootView
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
    @State private var eventToEdit: EKEvent? = nil
    
    // Таймер (презареждане на 60 сек)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    
    // Избор на екран (0=Month, 1=Day, 2=Year, 3=MultiDay, 4=AllEventsList)
    @State private var selectedTab = 3 // По подразбиране да стартираме на "All Events"
    
    // Sheet за календари
    @State private var showCalendarsSheet = false
    
    var body: some View {
        ZStack {
            Color(.systemBackground)
                .edgesIgnoringSafeArea(.all)
            
            NavigationView {
                GeometryReader { geometry in
                    // Това беше за portrait/landscape
                    // Няма да крием бутона за Calendars в landscape
                    // така че, ако искаш - можеш да изтриеш изцяло логиката
                    let isPortrait = geometry.size.height > geometry.size.width
                    
                    VStack {
                        switch selectedTab {
                        case 0:
                            // Месечен календар
                            MonthCalendarView(
                                viewModel: CalendarViewModel.shared,
                                startMonth: Date(),
                                selectedTab: selectedTab,
                                onViewChange: { newTab in selectedTab = newTab }
                            )
                            
                        case 1:
                            // Single Day
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
                            // Годишен календар
                            YearCalendarView(
                                viewModel: CalendarViewModel.shared,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            )
                            
                        case 3:
                            // MultiDay
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
                                // Преминаване към Single Day
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
                            // All Events List
                            AllEventsListView(
                                events: pinnedAllEvents,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                },
                                onEventTap: { descriptor in
                                    if let multi = descriptor as? EKMultiDayWrapper {
                                        eventToEdit = multi.realEvent
                                    }
                                }
                            )
                            .onAppear {
                                loadAllEventsFromMinusOneYearToPlusTwoYears()
                            }
                            
                        default:
                            Text("N/A")
                        }
                    }
                    // Инструментална лента (toolbar)
                    .toolbar {
                        ToolbarItemGroup(placement: .bottomBar) {
                            
                            // “Today”
                            Button("Today") {
                                let today = Calendar.current.startOfDay(for: Date())
                                pinnedFromDateSingle = today
                                pinnedToDateSingle = today
                                selectedTab = 1 // Day view
                            }
                            
                            Spacer()
                            
                            // “Calendars”
                            Button("Calendars") {
                                showCalendarsSheet = true
                            }
                            
                            Spacer()
                            
                            // “Inbox” (пример)
                            Button("Inbox") {
                                // ...
                            }
                        }
                    }
                }
            }
        }
        .onAppear {
            Task {
                // 1) Искане на достъп
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                
                if accessGranted {
                    // 2) Зареждане на календари
                    CalendarViewModel.shared.reloadCalendars()
                    
                    // 3) Зареждаме събития за годината
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)
                    
                    // 4) Ако сме на MultiDay или AllEventsList, или Day — зареждаме нужните
                    if selectedTab == 3 {
                        loadMultiDayEvents()
                    } else if selectedTab == 1 {
                        loadSingleDayEvents()
                    } else if selectedTab == 4 {
                        loadAllEventsFromMinusOneYearToPlusTwoYears()
                    }
                }
            }
        }
        // Sheet за избор на календари
        .sheet(isPresented: $showCalendarsSheet, onDismiss: {
            if accessGranted {
                if selectedTab == 3 {
                    loadMultiDayEvents()
                } else if selectedTab == 1 {
                    loadSingleDayEvents()
                } else if selectedTab == 4 {
                    loadAllEventsFromMinusOneYearToPlusTwoYears()
                }
            }
        }) {
            CalendarsSheetView()
        }
    }
}

// MARK: - Зареждане на евенти за SingleDay
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
}

// MARK: - Зареждане на евенти за MultiDay
extension RootView {
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

// MARK: - Зареждане на евенти за "All Events"
extension RootView {
    private func loadAllEventsFromMinusOneYearToPlusTwoYears() {
        guard accessGranted else { return }
        let cal = Calendar.current
        
        // Пример: от днес - 1 година до днес + 2 години
        let start = cal.date(byAdding: .year, value: -1, to: Date())!
        let end   = cal.date(byAdding: .year, value: 2, to: Date())!
        
        pinnedAllEvents = fetchAndSplitEvents(from: start, to: end)
    }
}

// MARK: - Общ метод
extension RootView {
    private func fetchAndSplitEvents(from: Date, to: Date) -> [EventDescriptor] {
        let store = CalendarViewModel.shared.eventStore
        let cal   = Calendar.current
        
        // 1) Само селектирани календари
        let allowedCalendars = CalendarViewModel.shared.allCalendars.filter {
            CalendarViewModel.shared.selectedCalendarIDs.contains($0.calendarIdentifier)
        }
        
        // 2) Predicate
        let predicate = store.predicateForEvents(withStart: from, end: to, calendars: allowedCalendars)
        let found = store.events(matching: predicate)
        
        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            // Ако е много‐дневно, “цепим” по дни
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

