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
    @AppStorage("interstitialTabSwitchCount") private var tabSwitchCounter: Int = 0
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
    @State private var selectedMonthDate: Date = Date()

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
    
    // Следим състоянието на сцената (active, background, inactive)
    @Environment(\.scenePhase) private var scenePhase
    
    private let promotionalApps: [AppPromoData] = [
        AppPromoData(
            appName: "Wise Eating & Fitness Planner",
            description: "Wise Eating is your AI-powered coach for smarter nutrition and training. It combines modern nutrition science with practical tools to help you plan meals, design workouts, manage your pantry, and understand how food and movement affect your body.",
            iconName: "WiseEatingIcon",
            systemImageFallback: "carrot.fill",
            appStoreURL: "https://apps.apple.com/us/app/wise-eating-fitness-planner/id6751406823",
            accentColor: .green
        ),
        AppPromoData(
            appName: "StoreFront Studio",
            description: "StoreFront Studio is the elite 3D design environment for iOS and macOS developers. It combines high-fidelity RealityKit rendering with a powerful Rich Text editor to help you transform raw screenshots into professional, high-converting App Store assets.",
            iconName: "StoreFrontIcon",
            systemImageFallback: "heart.text.square.fill",
            appStoreURL: "https://apps.apple.com/us/app/storefront-studio/id6757389314",
            accentColor: .cyan
        ),

        // ✅ NEW #1
        AppPromoData(
            appName: "ReelStudio",
            description: "ReelStudio is the creator-grade screen recording studio for iOS and macOS. Capture your screen and camera at the same time, control mic + system audio, and export clean MP4s for tutorials, walkthroughs, and product demos. On iOS, you can even play a video inside the app and record it together with your camera for reaction-style and presenter-led content.",
            iconName: "ReelStudioIcon", // добави в Assets
            systemImageFallback: "record.circle.fill",
            appStoreURL: "https://apps.apple.com/us/app/reelstudio/id6758941990", // TODO: сложи реалния линк
            accentColor: .purple
        ),

        // ✅ NEW #2
        AppPromoData(
            appName: "Cloud Calendars",
            description: "Cloud Calendars combines advanced scheduling with beautifully integrated weather forecasts, so you can plan with precision. It supports multiple calendar services, intuitive gesture-based editing, built-in meeting links, and detailed hourly/daily forecasts directly inside your schedule.",
            iconName: "CloudCalendarsIcon", // добави в Assets
            systemImageFallback: "calendar.badge.clock",
            appStoreURL: "https://apps.apple.com/us/app/cloud-calendars/id6744690319",
            accentColor: .blue
        ),

        // ✅ NEW #3
        AppPromoData(
            appName: "MarketBrief AI",
            description: "MarketBrief AI helps you understand market movement with on-device analytics and a multi-agent workflow designed to separate signal from noise. Track real-time price data, explore regime-style probabilities, and use clear dashboards and charts to support your decision-making. Privacy-first: your configurations stay on your device.",
            iconName: "MarketBriefIcon", // добави в Assets
            systemImageFallback: "chart.line.uptrend.xyaxis",
            appStoreURL: "https://apps.apple.com/us/app/market-brief-ai/id6758329388", // TODO: сложи реалния линк
            accentColor: .blue.opacity(0.75)
        )
    ]


    
    init() {
        // Ако няма нищо записано, по подразбиране ще е 1
        let saved = UserDefaults.standard.object(forKey: "selectedTabRoot") as? Int ?? 1
        if (0...6).contains(saved) { // Assuming 0-7 are your valid tab indices
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
                                startMonth: selectedMonthDate,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                },
                                onDaySelected: { selectedDay in
                                    showSingleDayTab(for: selectedDay)
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
                                },
                                onDayLabelTap: { tappedDay in
                                    pinnedFromDateSingle = tappedDay
                                    pinnedToDateSingle   = tappedDay
                                    loadSingleDayEvents()
                                },
                                onMonthLabelTap: { month in
                                    showMonthTab(for: month)
                                }
                            )
                            .onAppear { loadSingleDayEvents() }
                            .onReceive(timer) { _ in loadSingleDayEvents() }
                            .ignoresSafeArea(.all)

                        case 2:
                            YearCalendarView(
                                viewModel: CalendarViewModel.shared,
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                },
                                onMonthSelected: { month in
                                    showMonthTab(for: month)
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
                                },
                                onDayLabelTap: { tappedDay in
                                    pinnedFromDateSingle = tappedDay
                                    pinnedToDateSingle   = tappedDay
                                    loadSingleDayEvents()
                                    selectedTab = 1
                                }
                            )
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
                                },
                                onDayLabelTap: { tappedDay in
                                    pinnedFromDateSingle = tappedDay
                                    // For SingleDayMultiCalendarWrapper, toDate is usually same as fromDate
                                    // pinnedToDateSingle   = tappedDay // Not typically set by this wrapper
                                    loadSingleDayEventsLocal()
                                },
                                onMonthLabelTap: { month in
                                    showMonthTab(for: month)
                                }
                            )
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
                                    }
                                    .padding(.top, -20) // Original padding
                                },
                                horizontalContent: {
                                    Picker("", selection: $selectedTabDraggableMenuView) {
                                        Label("Calendar", systemImage: "calendar").tag(0)
                                        Label("MultiCalendar", systemImage: "calendar.badge.plus").tag(1)
                                        Label("Subscriptions", systemImage: "calendar.circle").tag(2)
                                        Label("Apps", systemImage: "square.grid.2x2.fill").tag(3)
                                    }
                                    .pickerStyle(.segmented)
                                },
                                verticalContent: {
                                    switch selectedTabDraggableMenuView {
                                    case 0: CalendarsSheetView().padding(.vertical, 8)
                                    case 1: CalendarsDropdownRepresentable().padding(.vertical, 8)
                                    case 2: SubscriptionView().padding(.vertical, 8)
                                    case 3: AppsPromoListView(apps: promotionalApps).padding(.vertical, 8)
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
                                            refreshCalendarWidgetEventsSnapshot()
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
                    refreshCalendarWidgetEventsSnapshot()
                } else {
                    CalendarWidgetStore.clearUpcomingEventsSnapshot()
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
                        refreshCalendarWidgetEventsSnapshot()
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
            if SubscriptionManager.shared.subscriptionStatus == .base {
                // Увеличаваме брояча
                tabSwitchCounter += 1
                print("🔄 Tab switched. Count (saved): \(tabSwitchCounter)")
                
                // Ако стигне 2 (или колкото си решил)
                if tabSwitchCounter >= 10 {
                    InterstitialAdManager.shared.showAd()
                    tabSwitchCounter = 0
                }
            }
            Task {
                if accessGranted { // Use the @State variable
                    switch newValue {
                    case 1: loadSingleDayEvents()
                    case 3: loadMultiDayEvents()
                    case 4: reloadAllEvents()
                    case 5: reloadSingleDayEventsWithVisibleCalendars()
                    default: break
                    }
                    refreshCalendarWidgetEventsSnapshot()
                }
            }
        }
    }

    private func refreshCalendarWidgetEventsSnapshot() {
        guard accessGranted else {
            CalendarWidgetStore.clearUpcomingEventsSnapshot()
            return
        }

        CalendarWidgetStore.saveUpcomingEventsSnapshot()
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
}


// MARK: - Data Loading Helpers (Original from your file)
extension RootView {
    private func showMonthTab(for month: Date) {
        let normalizedMonth = Calendar.current.date(from: Calendar.current.dateComponents([.year, .month], from: month)) ?? month
        selectedMonthDate = normalizedMonth
        selectedTab = 0
    }

    private func showSingleDayTab(for day: Date) {
        let normalizedDay = Calendar.current.startOfDay(for: day)
        pinnedFromDateSingle = normalizedDay
        pinnedToDateSingle = normalizedDay
        loadSingleDayEvents()
        selectedTab = 1
    }

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
