import SwiftUI
import EventKit
import EventKitUI
@preconcurrency import WeatherKit // If you use WeatherKit directly in RootView
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
        if (0...7).contains(saved) { // Assuming 0-7 are your valid tab indices
            _selectedTab = State(initialValue: saved)
        }else{
            _selectedTab = State(initialValue: 1)
        }
    }
    
    var body: some View {
        ZStack {
            Color(.systemBackground).edgesIgnoringSafeArea(.all)

            NavigationView {
                GeometryReader { geometry in
                    let isPortrait = geometry.size.height > geometry.size.width

                    VStack(spacing: 0) { // Ensure VStack uses spacing 0 if no explicit spacing is desired
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
                                // For SingleDayMultiCalendarWrapper, toDate is usually same as fromDate
                                // pinnedToDateSingle   = tappedDay // Not typically set by this wrapper
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
                            .ignoresSafeArea(.container, edges: [.leading, .trailing, .bottom])
                        case 7:
                            VitaHealth(
                                 selectedTabRoot: selectedTab,
                                 oldSelectedTab: oldSelectedTab,
                                 onViewChange: { newTab in
                                     selectedTab = newTab
                                 }
                             )
                            .ignoresSafeArea(.container, edges: [.leading, .trailing, .bottom])
                        default:
                            Text("N/A - Selected Tab: \(selectedTab)") // More informative fallback
                                .frame(maxWidth: .infinity, maxHeight: .infinity) // Ensure it fills space
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity) // Make sure the VStack fills the GeometryReader
                    .overlay(alignment: .bottom) {
                        if menuState == .full && isPortrait && ![6,7].contains(selectedTab) { // Added checks from outer if
                             Color.black.opacity(0.001)
                                 .ignoresSafeArea()
                                 .contentShape(Rectangle())
                                 .onTapGesture {
                                     withAnimation(.spring()) { // Keep spring for user-initiated tap
                                         menuState = .collapsed
                                     }
                                 }
                                 .transition(.opacity) // Animate the overlay itself
                                 .zIndex(0)
                         }
                        
                        if isPortrait { // This condition was from your original code for showing DraggableMenuView
                            DraggableMenuView(
                                menuState: $menuState,
                                adaptiveBackgroundOpacity:$draggableMenuAdaptiveBackgroundОpacity,
                                bottomBar: {
                                    HStack{ // Content for bottomBar
                                        Spacer()
                                        bottomBarButton(title: "Today", image: "calendar.badge.checkmark", action: {
                                            let today = Calendar.current.startOfDay(for: Date())
                                            pinnedFromDateSingle = today
                                            pinnedToDateSingle   = today
                                            oldSelectedTab = selectedTab
                                            selectedTab = 1
                                            UserDefaults.standard.set(selectedTab, forKey: "selectedTabRoot")
                                            menuState = .collapsed
                                        })
                                        Spacer()
                                        bottomBarButton(title: "Add", image: "calendar.badge.plus", action: {
                                            createAndEditNewEvent(on: Date()) // Or use a relevant date
                                            menuState = .collapsed
                                            ReviewManager.eventCreated()     
                                        })
                                        Spacer()
                                        bottomBarButton(title: "Weather", image: "cloud.sun.fill", action: {
                                            oldSelectedTab = selectedTab
                                            selectedTab = 6
                                            UserDefaults.standard.set(selectedTab, forKey: "selectedTabRoot")
                                            menuState = .collapsed
                                        })
                                        Spacer()
                                        bottomBarButton(title: "VitaHealth", image: "leaf.fill", action: {
                                            oldSelectedTab = selectedTab
                                            selectedTab = 7
                                            UserDefaults.standard.set(selectedTab, forKey: "selectedTabRoot")
                                            menuState = .collapsed
                                        })
                                        Spacer()
                                    }
                                    .padding(.top, -20) // Original padding
                                },
                                horizontalContent: {
                                    Picker("", selection: $selectedTabDraggableMenuView) {
                                        Label("Calendar", systemImage: "calendar").tag(0)
                                        Label("MultiCalendar", systemImage: "calendar.badge.plus").tag(1)
                                        Label("Subscriptions", systemImage: "calendar.circle").tag(2)
                                    }
                                    .pickerStyle(.segmented)
                                },
                                verticalContent: {
                                    switch selectedTabDraggableMenuView {
                                    case 0: CalendarsSheetView().padding(.vertical, 8)
                                    case 1: CalendarsDropdownRepresentable().padding(.vertical, 8)
                                    case 2: SubscriptionView().padding(.vertical, 8)
                                    default: Text("N/A")
                                    }
                                },
                                onStateChange: { state in // This is the onStateChange for DraggableMenuView
                                    // Original logic for data loading on menu state change
                                    Task {
                                        let currentAccessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                                        self.accessGranted = currentAccessGranted // Update local state
                                        if currentAccessGranted {
                                            CalendarViewModel.shared.reloadCalendars()
                                            let year = Calendar.current.component(.year, from: Date())
                                            CalendarViewModel.shared.loadEventsForWholeYear(year: year)
                                            
                                            // Reload data for the *currently selected main tab*
                                            switch self.selectedTab { // use self.selectedTab
                                            case 1: loadSingleDayEvents()
                                            case 3: loadMultiDayEvents()
                                            case 5: reloadSingleDayEventsWithVisibleCalendars()
                                            default: break
                                            }
                                        }
                                    }
                                }
                            )
                            .opacity( [6, 7].contains(selectedTab) ? 0 : 1 ) // Keep opacity logic
                            .edgesIgnoringSafeArea(.all)
                            .zIndex(1) // Ensure DraggableMenuView is above the tap overlay
                            // ---- BEGIN FIX: Disable animation on DraggableMenuView based on selectedTab ----
                            .animation(.none, value: selectedTab)
                            // ---- END FIX ----
                        }
                    }
                } // End GeometryReader
            } // End NavigationView
            .navigationViewStyle(StackNavigationViewStyle())
            .toolbarBackground(Color.white.opacity(0.1), for: .bottomBar) // Example for bottom bar
            .toolbarBackground(.visible, for: .bottomBar)
            .toolbarColorScheme(.light, for: .bottomBar) // Or .dark as per your theme
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
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                if accessGranted {
                    CalendarViewModel.shared.reloadCalendars()
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)
                    // Initial load based on selectedTab
                    switch selectedTab {
                        case 1: loadSingleDayEvents()
                        case 3: loadMultiDayEvents()
                        case 5: reloadSingleDayEventsWithVisibleCalendars()
                        default: break
                    }
                }
            }
        }
        .sheet(item: $eventToEdit) { theEvent in
            EventEditViewWrapper(eventStore: CalendarViewModel.shared.eventStore, event: theEvent) {
                // onEventUpdated closure for EventEditViewWrapper
                Task {
                    if accessGranted { // Check access again or rely on previous check
                        CalendarViewModel.shared.reloadCalendars() // Reload calendars in case of changes
                        let year = Calendar.current.component(.year, from: Date())
                        CalendarViewModel.shared.loadEventsForWholeYear(year: year) // Reload events
                        
                        // Reload data for the currently active main tab
                        switch selectedTab {
                        case 1: loadSingleDayEvents()
                        case 3: loadMultiDayEvents()
                        case 4: reloadAllEvents() // If list view needs refresh
                        case 5: reloadSingleDayEventsWithVisibleCalendars()
                        default: break
                        }
                    }
                }
            }
        }
        .onChange(of: selectedTab) { oldValue, newValue in
             self.oldSelectedTab = oldValue // Update oldSelectedTab
            UserDefaults.standard.set(newValue, forKey: "selectedTabRoot")
            if newValue == 6 || newValue == 7 { // Weather or VitaHealth
                CalendarViewModel.shared.stopGoogleCalendarSync()
                CalendarViewModel.shared.stopMicrosoftCalendarSync()
                draggableMenuAdaptiveBackgroundОpacity = 0.35
            } else {
                CalendarViewModel.shared.startGoogleCalendarSync()
                CalendarViewModel.shared.startMicrosoftCalendarSync()
                draggableMenuAdaptiveBackgroundОpacity = 0.95
            }
            // Reload data for the new tab
            Task {
                if accessGranted { // Use the @State variable
                    switch newValue {
                    case 1: loadSingleDayEvents()
                    case 3: loadMultiDayEvents()
                    case 4: reloadAllEvents()
                    case 5: reloadSingleDayEventsWithVisibleCalendars()
                    default: break
                    }
                }
            }
        }
    }

    // Helper for bottom bar buttons
    @ViewBuilder
    private func bottomBarButton(title: String, image: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 0) {
                Image(systemName: image)
                    .font(.system(size: 18))
                    .foregroundColor(.blue)
                Text(LocalizedStringKey(title)) // For localization
                    .font(.system(size: 10))
                    .foregroundColor(.primary)
            }
        }
        .frame(maxWidth: .infinity)
    }
    
    // ... (Keep your existing loadSingleDayEvents, loadMultiDayEvents, etc. methods and extensions) ...
}


// MARK: - Data Loading Helpers (Original from your file)
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

// MARK: - Fetch & Split helpers (Original from your file)
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
            if cal.startOfDay(for: ekEvent.startDate) != cal.startOfDay(for: ekEvent.endDate ?? ekEvent.startDate) {
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

        let predicate = store.predicateForEvents(withStart: from, end: to, calendars: allowedCalendars.isEmpty ? nil : allowedCalendars) // Added check for empty allowedCalendars
        let found = store.events(matching: predicate)

        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            let cal = Calendar.current
            if cal.startOfDay(for: ekEvent.startDate) != cal.startOfDay(for: ekEvent.endDate ?? ekEvent.startDate) {
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

        let realStart = max(ekEvent.startDate ?? startRange, startRange)
        let realEnd   = min(ekEvent.endDate ?? endRange, endRange)
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

// MARK: - Lazy loading helpers for AllEventsListView (Original from your file)
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

// MARK: - Chunk Loading (Original from your file)
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
        pinnedAllEvents.append(contentsOf: newEvents) // Should be insert at 0 for previous
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

// MARK: - Create & Edit new Event (Original from your file)
extension RootView {
    private func createAndEditNewEvent(on day: Date) {
        let status = EKEventStore.authorizationStatus(for: .event)
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
        let startOfDay = cal.startOfDay(for: day)
        let eventInitialStart: Date = {
            if cal.isDateInToday(day) {
                return Date()
            } else {
                return cal.date(byAdding: .hour, value: 9, to: startOfDay) ?? startOfDay
            }
        }()

        let newEvent        = EKEvent(eventStore: store)
        newEvent.startDate  = eventInitialStart
        newEvent.endDate    = eventInitialStart.addingTimeInterval(3600)
        newEvent.title      = NSLocalizedString("New Event", comment: "")
        newEvent.calendar   = store.defaultCalendarForNewEvents
        eventToEdit = newEvent
    }
}

// MARK: - Reload for MultiCalendar (Original from your file)
extension RootView {
    private func reloadSingleDayEventsWithVisibleCalendars() {
         guard accessGranted else { pinnedEventsSingle = []; return }
         let cal = Calendar.current
         let fromOnly = cal.startOfDay(for: pinnedFromDateSingle)
         guard let toDate = cal.date(byAdding: .day, value: 1, to: fromOnly) else {
             pinnedEventsSingle = []
             return
         }

         let visibleIDs = CalendarViewModel.shared.visibleCalendarIDs
         let allowedCalendars = CalendarViewModel.shared.allCalendars.filter {
             visibleIDs.contains($0.calendarIdentifier)
         }

         let predicate = CalendarViewModel.shared.eventStore
             .predicateForEvents(withStart: fromOnly,
                                 end: toDate,
                                 calendars: allowedCalendars.isEmpty ? nil : allowedCalendars) // Added check for empty
         let found = CalendarViewModel.shared.eventStore.events(matching: predicate)

         var descriptors: [EventDescriptor] = []
         for ekEvent in found {
             let startDay = cal.startOfDay(for: ekEvent.startDate)
             let endDay   = cal.startOfDay(for: ekEvent.endDate ?? ekEvent.startDate) // Added nil check
             if startDay != endDay {
                 descriptors.append(contentsOf: splitEventByDays(ekEvent,
                                                                startRange: fromOnly,
                                                                endRange: toDate))
             } else {
                 descriptors.append(EKMultiDayWrapper(realEvent: ekEvent))
             }
         }
         pinnedEventsSingle = descriptors
     }
}
