import SwiftUI
import EventKit


// MARK: - RootView с “lazy loading” до 3 години напред
struct RootView: View {
    // Проверка дали имаме достъп до календара
    @State private var accessGranted = false
    
    // Разни pinned за Day/MultiDay (ако си ги ползвате)
    @State private var pinnedFromDateSingle: Date = Date()
    @State private var pinnedToDateSingle: Date = Date()
    @State private var pinnedEventsSingle: [EventDescriptor] = []
    
    @State private var pinnedFromDateMulti: Date = Date()
    @State private var pinnedToDateMulti: Date = Calendar.current.date(byAdding: .day, value: 7, to: Date())!
    @State private var pinnedEventsMulti: [EventDescriptor] = []
    
    // Тук държим ВСИЧКИ events, които показваме в списъка
    @State private var pinnedAllEvents: [EventDescriptor] = []
    
    // Текущ “Tab”
    @State private var selectedTab = 4
    
    // Таймер (ако искате да рефрешвате периодично)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    
    // Sheet за избор на календари
    @State private var showCalendarsSheet = false
    
    // EKEventEditor
    @State private var eventToEdit: EKEvent? = nil
    
    // MARK: - ДАННИ ЗА “lazy loading”
    // Докъде сме заредили в бъдещето
    @State private var loadedUntil: Date = Calendar.current.startOfDay(for: Date())
    
    // До кога може да зареждаме (примерно +3 години)
    private let maxLoadDate: Date = {
        let cal = Calendar.current
        return cal.date(byAdding: .year, value: 3, to: Date())!
    }()
    
    // Колко дни да зареждаме на “пакет” (може да е 30, 60, 90…)
    private let chunkDays: Int = 30
    
    var body: some View {
        ZStack {
            Color(.systemBackground).edgesIgnoringSafeArea(.all)
            
            NavigationView {
                GeometryReader { geometry in
                    let isPortrait = geometry.size.height > geometry.size.width
                    
                    VStack {
                        switch selectedTab {
                            // 0) … примерни Month/Day/Year/MultiDay
                        case 4:
                            // ТУК е нашата AllEventsListView
                            AllEventsListView(
                                pinnedAllEvents: $pinnedAllEvents,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                },
                                // Първата партида
                                loadCurrentMonthEvents: {
                                    loadNextChunkOfUpcomingEvents() // зарежда (примерно) 30 дни
                                },
                                // Когато стигнем края на списъка
                                onLoadMore: {
                                    // Ако още не сме стигнали +3 години
                                    if loadedUntil < maxLoadDate {
                                        loadNextChunkOfUpcomingEvents()
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
                    .toolbar {
                        // Примерен ToolBar
                        ToolbarItemGroup(placement: .bottomBar) {
                            if isPortrait {
                                Button("Today") {
                                    let today = Calendar.current.startOfDay(for: Date())
                                    pinnedFromDateSingle = today
                                    pinnedToDateSingle   = today
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
        // При първо стартиране:
        .onAppear {
            Task {
                // 1) Искане на достъп
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                
                if accessGranted {
                    // 2) Зареждаме календари
                    CalendarViewModel.shared.reloadCalendars()
                    
                    // 3) Ако сме на List (tab=4), зареждаме първа партида
                    if selectedTab == 4 {
                        loadNextChunkOfUpcomingEvents()
                    }
                }
            }
        }
        // Sheet за избор на календари
        .sheet(isPresented: $showCalendarsSheet, onDismiss: {
            if accessGranted {
                CalendarViewModel.shared.reloadCalendars()
                // Презареждане на AllEventsList
                if selectedTab == 4 {
                    pinnedAllEvents.removeAll()
                    loadedUntil = Calendar.current.startOfDay(for: Date())
                    loadNextChunkOfUpcomingEvents()
                }
            }
        }) {
            CalendarsSheetView() // <– ваш sheet за избор на календари
        }
    }
}

// MARK: - LAZY LOADING логиката
extension RootView {
    /// Зарежда “парче” от [loadedUntil .. +30 дни], добавя го към pinnedAllEvents и обновява `loadedUntil`.
    private func loadNextChunkOfUpcomingEvents() {
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
        
        // За да сме сигурни, че е хронологично
        pinnedAllEvents.sort { $0.dateInterval.start < $1.dateInterval.start }
        
        // Ъпдейт на loadedUntil
        loadedUntil = toDate
    }
    
    /// Извлича (и раздробява) събития от EventKit в диапазона [from .. to]
    private func fetchAndSplitEvents(from: Date, to: Date) -> [EventDescriptor] {
        let store = CalendarViewModel.shared.eventStore
        
        // Кои календари са селектирани
        let allowedCalendars = CalendarViewModel.shared.allCalendars.filter {
            CalendarViewModel.shared.selectedCalendarIDs.contains($0.calendarIdentifier)
        }
        
        let predicate = store.predicateForEvents(withStart: from, end: to, calendars: allowedCalendars)
        let found = store.events(matching: predicate)
        
        var splitted: [EventDescriptor] = []
        let cal = Calendar.current
        
        for ekEvent in found {
            let startDay = cal.startOfDay(for: ekEvent.startDate)
            let endDay   = cal.startOfDay(for: ekEvent.endDate)
            
            // Ако е многодневно
            if startDay != endDay {
                splitted.append(contentsOf: splitEventByDays(ekEvent, startRange: from, endRange: to))
            } else {
                // Еднодневно
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        return splitted
    }
    
    /// Раздробява многодневно събитие по дни
    private func splitEventByDays(_ ekEvent: EKEvent,
                                  startRange: Date,
                                  endRange: Date) -> [EKMultiDayWrapper] {
        var results: [EKMultiDayWrapper] = []
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
