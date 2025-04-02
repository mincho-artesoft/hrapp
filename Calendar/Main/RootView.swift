import SwiftUI
import EventKit
import EventKitUI

struct RootView: View {
    // 1) Дали имаме достъп
    @State private var selectedCalendars = Set<EKCalendar>()
    
    @State private var showCalendarChooser = false
    
    @State private var accessGranted = false
    @State private var loadedUntil: Date = Calendar.current.startOfDay(for: Date())
    private let chunkDays: Int = 30
    
    /// Докога МАКС можем да зареждаме напред (+3 години)
    private let maxLoadDate: Date = {
        let cal = Calendar.current
        return cal.date(byAdding: .year, value: 3, to: Date())!
    }()
    
    /// От коя дата сме заредили *назад*
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
    
    // 2) Всички събития (за AllEventsListView)
    @State private var pinnedAllEvents: [EventDescriptor] = []
    
    // 3) Дати за текущия обхват за AllEventsListView
    @State private var loadedStartDate: Date = Date()
    @State private var loadedEndDate: Date   = Date()
    
    // Таймер (за презареждане през 60 сек.)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    
    // Табовете/екраните
    @State private var selectedTab = 6 // 0=Month, 1=Day, 2=Year, 3=MultiDay, 4=AllEventsList, 5=MultiCalendar
    
    // Sheet за календари
    @State private var showCalendarsSheet = false
    
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
                            .ignoresSafeArea(.container, edges: [.leading, .trailing, .bottom])
                            
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
                            .onAppear { loadSingleDayEvents() }
                            .onReceive(timer) { _ in loadSingleDayEvents() }
                            .ignoresSafeArea(.all)

                            // 2) Year
                        case 2:
                            YearCalendarView(
                                viewModel: CalendarViewModel.shared,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            )
                            .ignoresSafeArea(.container, edges: [.leading, .trailing, .bottom])

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
                            .onAppear { loadMultiDayEvents() }
                            .onReceive(timer) { _ in loadMultiDayEvents() }
                            .ignoresSafeArea(.all)

                            // 4) AllEventsList
                        case 4:
                            AllEventsListView(
                                pinnedAllEvents: $pinnedAllEvents,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                },
                                loadInitialEvents: {
                                    reloadAllEvents()
                                },
                                onLoadMoreAfter: {
                                    if loadedUntil < maxLoadDate {
                                        loadNextChunkOfEvents()
                                    }
                                },
                                onLoadMoreBefore: {
                                    if loadedFrom > minLoadDate {
                                        loadPreviousChunkOfEvents()
                                    }
                                }
                            )
                            .ignoresSafeArea(.container, edges: [.leading, .trailing, .bottom])
                            
                            // 5) MultiCalendar (TwoWayPinnedMultiDayMultiCalendarWrapper)
                        case 5:
                            TwoWayPinnedSingleDayMultiCalendarWrapper(
                                fromDate: $pinnedFromDateSingle,
                                events: $pinnedEventsSingle,
                                eventStore: CalendarViewModel.shared.eventStore,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            ) { tappedDay in
                                pinnedFromDateSingle = tappedDay
                                pinnedToDateSingle   = tappedDay
                                // зареждаме само локални за този таб (пример)
                                loadSingleDayEventsLocal()
                            }
                            .onAppear { loadSingleDayEventsLocal() }
                            .onReceive(timer) { _ in loadSingleDayEventsLocal() }
                            .ignoresSafeArea(.all)
                        case 6:
                            WeatherView()
                           
                        default:
                            Text(LocalizedStringKey("N/A"))
                        }
                    }
                    // Toolbar
                    .toolbar {
                        ToolbarItemGroup(placement: .bottomBar) {
                            if isPortrait {
                                Button(LocalizedStringKey("Today")) {
                                    let today = Calendar.current.startOfDay(for: Date())
                                    pinnedFromDateSingle = today
                                    pinnedToDateSingle = today
                                    selectedTab = 1
                                }
                                Spacer()
                                
                                Button(LocalizedStringKey("Calendars")) {
                                    showCalendarsSheet = true
                                }
                                Spacer()
                                
                                Button(LocalizedStringKey("Inbox")) {
                                    showCalendarChooser = true
                                }
                            }
                        }
                    }
                }
            }
            .navigationViewStyle(StackNavigationViewStyle())
            .toolbarBackground(Color(UIColor.systemBackground), for: .bottomBar)
            .toolbarBackground(.visible, for: .bottomBar)
        }
        .onAppear {

            Task {
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                if accessGranted {
                    CalendarViewModel.shared.reloadCalendars()
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)
                    
                    // Зареждаме при първоначален appear
                    if selectedTab == 3 {
                        loadMultiDayEvents()
                    } else if selectedTab == 1 {
                        loadSingleDayEvents()
                    } else if selectedTab == 5 {
                        // Тук зареждаме локални, без да гледаме selectedCalendarIDs
                        loadSingleDayEventsLocal()
                    }
                }
            }
        }
        .sheet(isPresented: $showCalendarChooser) {
            CalendarChooserView(selectedCalendars: $selectedCalendars)
        }
        .sheet(isPresented: $showCalendarsSheet, onDismiss: {
            if accessGranted {
                switch selectedTab {
                case 0:
                    let nowMonth = Calendar.current.startOfDay(for: Date())
                    CalendarViewModel.shared.loadEvents(for: nowMonth)
                    
                case 1:
                    loadSingleDayEvents()
                    
                case 2:
                    let currentYear = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: currentYear)
                    
                case 3:
                    loadMultiDayEvents()
                    
                case 4:
                    pinnedAllEvents.removeAll()
                    
                case 5:
                    loadSingleDayEventsLocal()
                    
                default:
                    break
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
        let toOnly   = cal.startOfDay(for: pinnedToDateMulti)
        
        guard let actualEnd = cal.date(byAdding: .day, value: 1, to: toOnly) else {
            pinnedEventsMulti = []
            return
        }
        pinnedEventsMulti = fetchAndSplitEvents(from: fromOnly, to: actualEnd)
    }
}

// MARK: - >>> НОВИ методи за локални календари (case 5)
extension RootView {
    /// Същото като loadSingleDayEvents, но филтрира САМО локални (и селектирани) от calendarsDict
    private func loadSingleDayEventsLocal() {
        guard accessGranted else { return }
        let fromOnly = Calendar.current.startOfDay(for: pinnedFromDateSingle)
        guard let toDate = Calendar.current.date(byAdding: .day, value: 1, to: fromOnly) else {
            pinnedEventsSingle = []
            return
        }
        // Вече ползваме по-долния метод
        pinnedEventsSingle = fetchAndSplitEventsLocal(from: fromOnly, to: toDate)
    }
    
    /// Тук се игнорира `selectedCalendarIDs` и ползваме само локални (sourceType == .local),
    /// но и проверяваме дали са маркирани в `calendarsDict[...]?.selected == true`.
    private func fetchAndSplitEventsLocal(from: Date, to: Date) -> [EventDescriptor] {
        let store = CalendarViewModel.shared.eventStore
        let cal   = Calendar.current
        
        // Филтрираме за локални + такива, които са маркирани (selected) в нашия `calendarsDict`.
        let localCals = CalendarViewModel.shared.allCalendars.filter {
            $0.source.sourceType == .local &&
            (CalendarViewModel.shared.calendarsDict[$0.calendarIdentifier]?.selected == true)
        }
        
        let predicate = store.predicateForEvents(withStart: from, end: to, calendars: localCals)
        let found = store.events(matching: predicate)
        
        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            // Ако обхваща повече от 1 ден – split
            if cal.startOfDay(for: ekEvent.startDate) != cal.startOfDay(for: ekEvent.endDate) {
                splitted.append(contentsOf: splitEventByDays(ekEvent,
                                                             startRange: from,
                                                             endRange: to))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        return splitted
    }
}

// MARK: - Функции за LAZY AllEventsListView (двупосочно)
extension RootView {
    func loadInitialMonth() {
        guard accessGranted else { return }
        let now = Date()
        guard let start = Calendar.current.date(byAdding: .month, value: -1, to: now),
              let end   = Calendar.current.date(byAdding: .month, value: 1, to: now)
        else { return }
        loadedStartDate = start
        loadedEndDate   = end
        pinnedAllEvents = fetchAndSplitEvents(from: start, to: end)
    }
    
    func loadNextMonth(completion: (() -> Void)? = nil) {
        guard accessGranted else { completion?(); return }
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
        guard accessGranted else { completion?(); return }
        let newEnd = loadedStartDate.addingTimeInterval(-1)
        guard let newStart = Calendar.current.date(byAdding: .month, value: -1, to: newEnd) else {
            completion?()
            return
        }
        let newEvents = fetchAndSplitEvents(from: newStart, to: newEnd)
        pinnedAllEvents.insert(contentsOf: newEvents, at: 0)
        loadedStartDate = newStart
        completion?()
    }
}

// MARK: - Общи помощни функции за fetch, split, etc.
extension RootView {
    /// Оригинален fetch, който взема *всички* календари, НО филтрира по selectedCalendarIDs
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
            // Ако започва и свършва в различни дни – split
            if cal.startOfDay(for: ekEvent.startDate) != cal.startOfDay(for: ekEvent.endDate) {
                splitted.append(contentsOf: splitEventByDays(ekEvent,
                                                             startRange: from,
                                                             endRange: to))
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

// MARK: - Допълнителни функции за зареждане на chunk-ове (AllEventsListView)
extension RootView {
    private func loadNextChunkOfEvents() {
        guard accessGranted else { return }
        let cal = Calendar.current
        let fromDate = loadedUntil
        guard fromDate < maxLoadDate else { return }
        
        let toDateRaw = cal.date(byAdding: .day, value: chunkDays, to: fromDate)!
        let toDate = min(toDateRaw, maxLoadDate)
        
        let newEvents = fetchAndSplitEvents(from: fromDate, to: toDate)
        pinnedAllEvents.append(contentsOf: newEvents)
        pinnedAllEvents.sort { $0.dateInterval.start < $1.dateInterval.start }
        loadedUntil = toDate
    }
    
    private func loadPreviousChunkOfEvents() {
        guard accessGranted else { return }
        let cal = Calendar.current
        let toDate = loadedFrom
        guard toDate > minLoadDate else { return }
        
        let fromDateRaw = cal.date(byAdding: .day, value: -chunkDays, to: toDate)!
        let fromDate = max(fromDateRaw, minLoadDate)
        
        let newEvents = fetchAndSplitEvents(from: fromDate, to: toDate)
        pinnedAllEvents.append(contentsOf: newEvents)
        pinnedAllEvents.sort { $0.dateInterval.start < $1.dateInterval.start }
        loadedFrom = fromDate
    }
    
    private func reloadAllEvents() {
        let now = Date()
        guard
            let start = Calendar.current.date(byAdding: .month, value: -1, to: now),
            let end   = Calendar.current.date(byAdding: .month, value: 1, to: now)
        else {
            return
        }
        
        loadedStartDate = start
        loadedEndDate   = end
        loadedFrom      = Calendar.current.startOfDay(for: start)
        loadedUntil     = Calendar.current.startOfDay(for: end)
        
        pinnedAllEvents = fetchAndSplitEvents(from: start, to: end)
        pinnedAllEvents.sort { $0.dateInterval.start < $1.dateInterval.start }
    }
}

import SwiftUI
import EventKit
import EventKitUI

// 1) Нашият представител (wrapper) за EKCalendarChooser
struct CalendarChooserView: UIViewControllerRepresentable {

    // Свързваме се със SwiftUI, за да затворим sheet-а и да връщаме избора на календари.
    @Environment(\.presentationMode) var presentationMode
    
    // Примерно property, в което пазим избраните от потребителя календари
    @Binding var selectedCalendars: Set<EKCalendar>
    
    // Делегат клас (Coordinator), който реагира на събитията от EKCalendarChooserDelegate
    class Coordinator: NSObject, @preconcurrency EKCalendarChooserDelegate {
        let parent: CalendarChooserView
        
        init(_ parent: CalendarChooserView) {
            self.parent = parent
        }
        
        // Извиква се, когато потребителят натисне Done
        @MainActor func calendarChooserDidFinish(_ calendarChooser: EKCalendarChooser) {
            // Записваме избраните календари и затваряме sheet-а
            parent.selectedCalendars = calendarChooser.selectedCalendars
            parent.presentationMode.wrappedValue.dismiss()
        }
        
        // Извиква се, когато потребителят натисне Cancel
        @MainActor func calendarChooserDidCancel(_ calendarChooser: EKCalendarChooser) {
            // Просто затваряме sheet-а без да променяме selectedCalendars
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
    
    func makeCoordinator() -> Coordinator {
        return Coordinator(self)
    }
    
    func makeUIViewController(context: Context) -> UINavigationController {
        // Създаваме EKCalendarChooser с желаните параметри
        let chooser = EKCalendarChooser(
            selectionStyle: .multiple,
            displayStyle: .allCalendars,
            entityType: .event,
            eventStore: CalendarViewModel.shared.eventStore
        )
        
        chooser.showsDoneButton = true
        chooser.showsCancelButton = true
        chooser.delegate = context.coordinator
        
        // Обвиваме в UINavigationController
        return UINavigationController(rootViewController: chooser)
    }
    
    func updateUIViewController(_ uiViewController: UINavigationController, context: Context) {
        // Може да обновявате EKCalendarChooser при нужда, ако selectedCalendars се промени отвън
    }
}
