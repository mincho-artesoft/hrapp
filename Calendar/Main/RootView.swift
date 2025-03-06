import SwiftUI
import EventKit

struct RootView: View {
    @State var accessGranted = false
    
    // MARK: - Single Day
    @State private var pinnedFromDateSingle: Date = Date()
    @State private var pinnedToDateSingle: Date = Date()
    @State private var pinnedEventsSingle: [EventDescriptor] = []
    
    // MARK: - Multi Day (пример за 7-дневен диапазон)
    @State private var pinnedFromDateMulti: Date = Date()
    @State private var pinnedToDateMulti: Date = Calendar.current.date(byAdding: .day, value: 7, to: Date())!
    @State private var pinnedEventsMulti: [EventDescriptor] = []
    
    // Таймер за пример (презареждане на 60 секунди)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    
    // Избор на таб
    @State private var selectedTab = 3  // По подразбиране MultiDay
    
    // Sheet за календари
    @State private var showCalendarsSheet = false
    
    var body: some View {
        ZStack {
            Color(.systemBackground)
                .edgesIgnoringSafeArea(.all)
            
            NavigationView {
                VStack {
                    Picker("View", selection: $selectedTab) {
                        Text("Day").tag(1)
                        Text("MultiDay").tag(3)
                        Text("Month").tag(0)
                        Text("Year").tag(2)
                    }
                    .pickerStyle(.segmented)
                    .padding()
                    
                    switch selectedTab {
                    case 0:
                        // Месечен календар
                        MonthCalendarView(
                            viewModel: CalendarViewModel.shared,
                            startMonth: Date()
                        )
                        
                    case 1:
                        // Single Day
                        TwoWayPinnedMultiDayWrapper(
                            fromDate: $pinnedFromDateSingle,
                            toDate: $pinnedToDateSingle,
                            events: $pinnedEventsSingle,
                            eventStore: CalendarViewModel.shared.eventStore,
                            isSingleDay: true
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
                        YearCalendarView(viewModel: CalendarViewModel.shared)
                        
                    case 3:
                        // MultiDay (начална дата: pinnedFromDateMulti, крайна: pinnedToDateMulti)
                        TwoWayPinnedMultiDayWrapper(
                            fromDate: $pinnedFromDateMulti,
                            toDate: $pinnedToDateMulti,
                            events: $pinnedEventsMulti,
                            eventStore: CalendarViewModel.shared.eventStore,
                            isSingleDay: false
                        ) { tappedDay in
                            // Когато натиснем върху ден от DaysHeaderView:
                            // 1) Превключваме директно на Single Day,
                            //    като задаваме "tappedDay" и в двата state-а
                            pinnedFromDateSingle = tappedDay
                            pinnedToDateSingle   = tappedDay
                            loadSingleDayEvents()
                            
                            // 2) Преминаваме към таба "Day"
                            selectedTab = 1
                        }
                        .onAppear {
                            loadMultiDayEvents()
                        }
                        .onReceive(timer) { _ in
                            loadMultiDayEvents()
                        }
                        
                    default:
                        Text("N/A")
                    }
                }
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
                            // Може да покажете някакъв екран за покани
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
                    // 2) ТУК Е КЛЮЧОВО: първо зареждаме списъка с календари
                    CalendarViewModel.shared.reloadCalendars()
                    
                    // 3) После зареждаме събития (примерно цяла година)
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)
                    
                    // 4) Ако сме по подразбиране на MultiDay (selectedTab = 3),
                    //    да заредим и multi-day събитията:
                    loadMultiDayEvents()
                }
            }
        }
        // Когато листът CalendarsSheetView се затвори, презареждаме
        .sheet(isPresented: $showCalendarsSheet, onDismiss: {
            if accessGranted {
                // Зависи кой таб гледаме.
                if selectedTab == 3 {
                    loadMultiDayEvents()
                } else if selectedTab == 1 {
                    loadSingleDayEvents()
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
        
        // За multi-day взимаме края като startOfDay(for: pinnedToDateMulti) + 1 ден
        let toOnly = cal.startOfDay(for: pinnedToDateMulti)
        guard let actualEnd = cal.date(byAdding: .day, value: 1, to: toOnly) else {
            pinnedEventsMulti = []
            return
        }
        
        pinnedEventsMulti = fetchAndSplitEvents(from: fromOnly, to: actualEnd)
    }
}


// MARK: - Общ метод за fetch + split
extension RootView {
    private func fetchAndSplitEvents(from: Date, to: Date) -> [EventDescriptor] {
        let store = CalendarViewModel.shared.eventStore
        let cal   = Calendar.current
        
        // 1) Филтрираме само календари, които са селектирани
        let allowedCalendars = CalendarViewModel.shared.allCalendars.filter {
            CalendarViewModel.shared.selectedCalendarIDs.contains($0.calendarIdentifier)
        }
        // 2) Правим predicate САМО за тези календари
        let predicate = store.predicateForEvents(withStart: from, end: to, calendars: allowedCalendars)
        let found = store.events(matching: predicate)
        
        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            // Ако събитието е много‐дневно, да го "разцепим"
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
            guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart)
            else { break }
            
            let pieceEnd = min(endOfDay, realEnd)
            let partial = EKMultiDayWrapper(realEvent: ekEvent,
                                            partialStart: currentStart,
                                            partialEnd: pieceEnd)
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
