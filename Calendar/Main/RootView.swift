import SwiftUI
import EventKit
import EventKitUI
@preconcurrency import WeatherKit
import CoreLocation

// MARK: - RootView
struct RootView: View {
    @State private var selectedCalendars = Set<EKCalendar>()
    @State private var showCalendarChooser = false
    @State private var selectedTabDraggableMenuView = 0
    @State private var menuState: MenuState = .collapsed
    @State private var draggableMenuAdaptiveBackgroundОpacity: CGFloat = 0.95

    @State private var accessGranted = false
    @State private var loadedUntil: Date = Calendar.current.startOfDay(for: Date())
    private let chunkDays: Int = 30
    private let maxLoadDate: Date = {
        Calendar.current.date(byAdding: .year, value: 3, to: Date())!
    }()
    @State private var loadedFrom: Date = Calendar.current.startOfDay(for: Date())
    private let minLoadDate: Date = {
        Calendar.current.date(byAdding: .year, value: -1, to: Date())!
    }()

    @State private var pinnedFromDateSingle: Date = Date()
    @State private var pinnedToDateSingle: Date = Date()
    @State private var pinnedEventsSingle: [EventDescriptor] = []

    @State private var pinnedFromDateMulti: Date = Date()
    @State private var pinnedToDateMulti: Date = Calendar.current.date(byAdding: .day, value: 7, to: Date())!
    @State private var pinnedEventsMulti: [EventDescriptor] = []

    @State private var pinnedAllEvents: [EventDescriptor] = []
    @State private var loadedStartDate: Date = Date()
    @State private var loadedEndDate: Date   = Date()

    // Таймер (например за презареждане)
    let timer = Timer.publish(every: 20, on: .main, in: .common).autoconnect()

    // Управление на табовете. Според примера: 0=Month, 1=Day, 2=Year, 3=MultiDay, 4=AllEventsList, 5=MultiCalendar, 6=Weather
    @State private var selectedTab = 1
    @State private var oldSelectedTab = 1

    // Нови променливи за различните sheet-ове
    @State private var showCalendarsSheet = false      // Показва CalendarsSheetView
    @State private var showLoginSheet = false          // Показва LoginView
    @State private var showRequestEmailSheet = false   // Показва RequestEmailView

    // Sheet за създаване/редакция на събитие
    @State private var eventToEdit: EKEvent? = nil
    
    init() {
            // Ако няма нищо записано, по подразбиране ще е 1
            let saved = UserDefaults.standard.object(forKey: "selectedTabRoot") as? Int ?? 1
            _selectedTab = State(initialValue: saved)
        }
    
    var body: some View {
        ZStack {
            Color(.systemBackground).edgesIgnoringSafeArea(.all)

            NavigationView {
                GeometryReader { geometry in
                    let isPortrait = geometry.size.height > geometry.size.width

                    VStack {
                        // Тук си избирате кой екран да се покаже според selectedTab
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
                            .ignoresSafeArea(.container, edges: [.leading, .trailing, .bottom])

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

                        case 2:
                            YearCalendarView(
                                viewModel: CalendarViewModel.shared,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            )
                            .ignoresSafeArea(.container, edges: [.leading, .trailing, .bottom])

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
                                loadSingleDayEventsLocal()
                            }
                            .onAppear {  reloadSingleDayEventsWithVisibleCalendars() }
                            .onReceive(timer) { _ in loadSingleDayEventsLocal() }
                            .ignoresSafeArea(.all)

                        case 6:
                            WeatherKitView(
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            )
                        case 7:
                            VitaHealth(
                                 selectedTabRoot: selectedTab,
                                 oldSelectedTab: oldSelectedTab,   // ⬅️ ново
                                 onViewChange: { newTab in
                                     selectedTab = newTab
                                 }
                             )
                            .ignoresSafeArea(.container, edges: [.leading, .trailing, .bottom])
                        default:
                            Text("N/A")
                        }
                    }
                    .overlay(alignment: .bottom) {
                        if menuState == .full {
                             Color.black.opacity(0.001)
                                 .ignoresSafeArea()
                                 .onTapGesture {
                                     withAnimation(.spring()) {
                                         menuState = .collapsed
                                     }
                                 }
                                 .transition(.opacity)
                                 .zIndex(0)              // под менюто, но над останалия интерфейс
                         }
                        
                        if isPortrait {
                            DraggableMenuView(
                                menuState: $menuState,
                                adaptiveBackgroundOpacity:$draggableMenuAdaptiveBackgroundОpacity,
                                // MARK: Bottom bar с 3 бутона
                                bottomBar: {
                                    HStack{
                                        Spacer()
                                        
                                        Button {
                                            let today = Calendar.current.startOfDay(for: Date())
                                            pinnedFromDateSingle = today
                                            pinnedToDateSingle   = today
                                            selectedTab = 1
                                            UserDefaults.standard.set(selectedTab, forKey: "selectedTabRoot")
                                            menuState = .collapsed
                                        } label: {
                                            VStack(spacing: 0) {
                                                Image(systemName: "calendar.badge.checkmark")
                                                    .font(.system(size: 18))
                                                    .foregroundColor(.blue)
                                                Text("Today")
                                                    .font(.system(size: 10))
                                                    .foregroundColor(.primary)
                                            }
                                        }
                                        .frame(maxWidth: .infinity)
                                        
                                        Spacer()
                                        
                                        Button {
                                            createAndEditNewEvent(on: Date())
                                            menuState = .collapsed
                                        } label: {
                                            VStack(spacing: 0) {
                                                Image(systemName: "calendar.badge.plus")
                                                    .font(.system(size: 18))
                                                    .foregroundColor(.blue)
                                                Text("Add")
                                                    .font(.system(size: 10))
                                                    .foregroundColor(.primary)
                                            }
                                        }
                                        .frame(maxWidth: .infinity)
                                        
                                        Spacer()
                                        
                                        Button {
                                            selectedTab = 6
                                            UserDefaults.standard.set(selectedTab, forKey: "selectedTabRoot")
                                            menuState = .collapsed
                                        } label: {
                                            VStack(spacing: 0) {
                                                Image(systemName: "cloud.sun.fill")
                                                    .font(.system(size: 18))
                                                    .foregroundColor(.blue)
                                                Text("Weather")
                                                    .font(.system(size: 10))
                                                    .foregroundColor(.primary)
                                            }
                                        }
                                        .frame(maxWidth: .infinity)
                                        
                                        Spacer()
                                        
                                        Button {
                                            selectedTab = 7
                                            UserDefaults.standard.set(selectedTab, forKey: "selectedTabRoot")
                                            menuState = .collapsed
                                        } label: {
                                            VStack(spacing: 0) {
                                                Image(systemName: "fork.knife")
                                                    .font(.system(size: 18))
                                                    .foregroundColor(.blue)
                                                Text("VitaHealth")
                                                    .font(.system(size: 10))
                                                    .foregroundColor(.primary)
                                            }
                                        }
                                        .frame(maxWidth: .infinity)
                                        
                                        Spacer()
                                    }
                                    .padding(.top, -20)
                                },
                                
                                // MARK: Horizontal секция (Picker)
                                horizontalContent: {
                                    Picker("", selection: $selectedTabDraggableMenuView) {
                                        Label("Calendar",      systemImage: "calendar").tag(0)
                                        Label("MultiCalendar", systemImage: "calendar.badge.plus").tag(1)
                                        Label("Subscriptions", systemImage: "calendar.circle").tag(2)
                                    }
                                    .pickerStyle(.segmented)
                                },
                                
                                // MARK: Vertical секция
                                verticalContent: {
                                    switch selectedTabDraggableMenuView {
                                    case 0:
                                        CalendarsSheetView().padding(.vertical, 8)
                                    case 1:
                                        CalendarsDropdownRepresentable().padding(.vertical, 8)
                                    case 2:
                                        SubscriptionView().padding(.vertical, 8)
                                    default:
                                        Text("N/A")
                                    }
                                },
                                
                                onStateChange: { state in
                                    Task {
                                        accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                                        if accessGranted {
                                            CalendarViewModel.shared.reloadCalendars()
                                            let year = Calendar.current.component(.year, from: Date())
                                            CalendarViewModel.shared.loadEventsForWholeYear(year: year)
                                            
                                            switch selectedTab {
                                            case 1: loadSingleDayEvents()
                                            case 3: loadMultiDayEvents()
                                            case 5: reloadSingleDayEventsWithVisibleCalendars()
                                            default: break
                                            }
                                        }
                                    }
                                }
                            )
                            .opacity( [6, 7].contains(selectedTab) ? 0 : 1 )
                            .edgesIgnoringSafeArea(.all)
                        }
                    }
                }
            }
            .navigationViewStyle(StackNavigationViewStyle())
            // -- Тук задаваме бял фон + тъмен текст на долния тулбар --
            .toolbarBackground(Color.white, for: .bottomBar)
            .toolbarBackground(.visible, for: .bottomBar)
            .toolbarColorScheme(.light, for: .bottomBar)
        }
        .onReceive(NotificationCenter.default.publisher(
            for: .notificationDraggableMenuViewSub)) { notification in
                if notification.userInfo != nil{
                        menuState = .full
                        selectedTabDraggableMenuView = 2
                }
            }
        .onAppear {
            Task {
                // Искане на достъп до календара (по вашата логика)
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                if accessGranted {
                    CalendarViewModel.shared.reloadCalendars()
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)

                    // Зареждаме начално, ако желаете
                    if selectedTab == 3 {
                        loadMultiDayEvents()
                    } else if selectedTab == 1 {
                        loadSingleDayEvents()
                    } else if selectedTab == 5 {
                        reloadSingleDayEventsWithVisibleCalendars()
                    }
                }
            }
        }
        
        // Sheet за редакция/създаване
        .sheet(item: $eventToEdit) { theEvent in
            EventEditViewWrapper(eventStore: CalendarViewModel.shared.eventStore, event: theEvent)
        }
        .onChange(of: eventToEdit) {
            Task {
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                if accessGranted {
                    CalendarViewModel.shared.reloadCalendars()
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)

                    // Зареждаме начално, ако желаете
                    if selectedTab == 3 {
                        loadMultiDayEvents()
                    } else if selectedTab == 1 {
                        loadSingleDayEvents()
                    } else if selectedTab == 5 {
                        reloadSingleDayEventsWithVisibleCalendars()
                    }
                }
            }
        }
        .onChange(of: selectedTab) { oldValue, newValue in
            oldSelectedTab = oldValue
            print("oldSelectedTab", oldSelectedTab)
            UserDefaults.standard.set(newValue, forKey: "selectedTabRoot")
            if newValue == 6 {
                CalendarViewModel.shared.stopGoogleCalendarSync()
                CalendarViewModel.shared.stopMicrosoftCalendarSync()
                draggableMenuAdaptiveBackgroundОpacity = 0.35
            }else{
                CalendarViewModel.shared.startGoogleCalendarSync()
                CalendarViewModel.shared.startMicrosoftCalendarSync()
                draggableMenuAdaptiveBackgroundОpacity = 0.95
            }
        }
    }
}

// MARK: - Примерни функции за SingleDay/MultiDay.
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

    private func loadSingleDayEventsLocal() {
        guard accessGranted else { return }
        let fromOnly = Calendar.current.startOfDay(for: pinnedFromDateSingle)
        guard let toDate = Calendar.current.date(byAdding: .day, value: 1, to: fromOnly) else {
            pinnedEventsSingle = []
            return
        }
        pinnedEventsSingle = fetchAndSplitEventsLocal(from: fromOnly, to: toDate)
    }
}

// MARK: - Fetch & Split helpers
extension RootView {
    private func fetchAndSplitEventsLocal(from: Date, to: Date) -> [EventDescriptor] {
        let store = CalendarViewModel.shared.eventStore

        let localCals = CalendarViewModel.shared.allCalendars.filter {
            $0.source.sourceType == .local &&
            (CalendarViewModel.shared.calendarsDict[$0.calendarIdentifier]?.selected == true)
        }
        let predicate = store.predicateForEvents(withStart: from, end: to, calendars: localCals)
        let found = store.events(matching: predicate)

        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            let cal = Calendar.current
            if cal.startOfDay(for: ekEvent.startDate) != cal.startOfDay(for: ekEvent.endDate) {
                splitted.append(contentsOf: splitEventByDays(ekEvent, startRange: from, endRange: to))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        return splitted
    }

    private func fetchAndSplitEvents(from: Date, to: Date) -> [EventDescriptor] {
        let store = CalendarViewModel.shared.eventStore

        let allowedCalendars = CalendarViewModel.shared.allCalendars.filter {
            CalendarViewModel.shared.selectedCalendarIDs.contains($0.calendarIdentifier)
        }

        let predicate = store.predicateForEvents(withStart: from, end: to, calendars: allowedCalendars)
        let found = store.events(matching: predicate)

        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            let cal = Calendar.current
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

// MARK: - Lazy loading helpers for AllEventsListView
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

// MARK: - Chunk Loading
extension RootView {
    private func loadNextChunkOfEvents() {
        guard accessGranted else { return }
        let cal = Calendar.current
        let fromDate = loadedUntil
        guard fromDate < maxLoadDate else { return }

        let toDateRaw = cal.date(byAdding: .day, value: 30, to: fromDate)!
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

        let fromDateRaw = cal.date(byAdding: .day, value: -30, to: toDate)!
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

// MARK: - Create & Edit new Event
extension RootView {
    private func createAndEditNewEvent(on day: Date) {
        let status = EKEventStore.authorizationStatus(for: .event)

        // Проверка за права (iOS17 и по-стари)
        let authorised: Bool = {
            if #available(iOS 17, *) {
                return status == .fullAccess || status == .writeOnly
            } else {
                return status == .authorized
            }
        }()

        guard authorised else { return }

        let store = CalendarViewModel.shared.eventStore
        let cal   = Calendar.current
        let start = cal.startOfDay(for: day).addingTimeInterval(9 * 3600)

        let newEvent        = EKEvent(eventStore: store)
        newEvent.startDate  = start
        newEvent.endDate    = start.addingTimeInterval(3600)
        newEvent.title      = NSLocalizedString("New Event", comment: "")
        newEvent.calendar   = store.defaultCalendarForNewEvents

        eventToEdit = newEvent                // ← задейства sheet‑a
    }
}


extension RootView {
    private func reloadSingleDayEventsWithVisibleCalendars() {
        guard accessGranted else { pinnedEventsSingle = []; return }
        let cal = Calendar.current
        let fromOnly = cal.startOfDay(for: pinnedFromDateSingle)
        guard let toDate = cal.date(byAdding: .day, value: 1, to: fromOnly) else {
            pinnedEventsSingle = []
            return
        }

        // 1) Вземаме видимите календари от модела
        let visibleIDs = CalendarViewModel.shared.visibleCalendarIDs

        // 2) Филтрираме само тези календари
        let allowedCalendars = CalendarViewModel.shared.allCalendars.filter {
            visibleIDs.contains($0.calendarIdentifier)
        }

        // 3) Правим EventKit запитването
        let predicate = CalendarViewModel.shared.eventStore
            .predicateForEvents(withStart: fromOnly,
                                end: toDate,
                                calendars: allowedCalendars.isEmpty ? nil : allowedCalendars)
        let found = CalendarViewModel.shared.eventStore.events(matching: predicate)

        // 4) Разделяме многодневните
        var descriptors: [EventDescriptor] = []
        for ekEvent in found {
            let startDay = cal.startOfDay(for: ekEvent.startDate)
            let endDay   = cal.startOfDay(for: ekEvent.endDate)
            if startDay != endDay {
                descriptors.append(contentsOf: splitEventByDays(ekEvent,
                                                               startRange: fromOnly,
                                                               endRange: toDate))
            } else {
                descriptors.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }

        // 5) Актуализираме състоянието
        pinnedEventsSingle = descriptors
    }
}
