import SwiftUI
import EventKit
import EventKitUI
@preconcurrency import WeatherKit
import CoreLocation

// MARK: - RootView
struct RootView: View {
    // Съществуващи променливи (от по-стария ви код)
    @State private var selectedCalendars = Set<EKCalendar>()
    @State private var showCalendarChooser = false
    
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
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()
    
    // Управление на табовете. Според примера: 0=Month, 1=Day, 2=Year, 3=MultiDay, 4=AllEventsList, 5=MultiCalendar, 6=Weather
    @State private var selectedTab = 1
    
    // Нови променливи за различните sheet-ове
    @State private var showCalendarsSheet = false      // Показва CalendarsSheetView
    @State private var showLoginSheet = false          // Показва LoginView
    @State private var showRequestEmailSheet = false   // Показва RequestEmailView
    
    @EnvironmentObject var appViewModel: AppViewModel

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
                            .onAppear { loadSingleDayEventsLocal() }
                            .onReceive(timer) { _ in loadSingleDayEventsLocal() }
                            .ignoresSafeArea(.all)
                            
                        case 6:
                            WeatherKitView(
                                selectedTab: selectedTab,
                                onViewChange: { newTab in
                                    selectedTab = newTab
                                }
                            )
                            
                        default:
                            Text("N/A")
                        }
                    }
                    .overlay(alignment: .bottom) {               // ⬅️ добавете това
                        if isPortrait {
                            DraggableMenuViewRefactored(
                                initialState: .collapsed,
                                // --- 1. Трите бутона в долната лента ---
                                bottomLeft: {
                                    Button {
                                        let today = Calendar.current.startOfDay(for: Date())
                                        pinnedFromDateSingle = today
                                        pinnedToDateSingle   = today
                                        selectedTab = 1
                                    } label: {
                                        Image(systemName: "calendar.badge.checkmark")
                                            .symbolRenderingMode(.multicolor)   // ← мултиколър
                                            .font(.headline)
                                    }
                                },

                                bottomCenter: {
                                    Button {
                                        if !appViewModel.isLoggedIn {
                                            showLoginSheet = true
                                        } else if appViewModel.email.isEmpty {
                                            showRequestEmailSheet = true
                                        } else {
                                            showCalendarsSheet = true
                                        }
                                    } label: {
                                        Image(systemName: "calendar.badge.checkmark")
                                            .symbolRenderingMode(.multicolor)   // показва оригиналните цветове
                                            .font(.headline)
                                    }
                                },


                                bottomRight: {
                                    Button { selectedTab = 6 } label: {
                                        Image(systemName: "cloud.sun.fill")
                                            .symbolRenderingMode(.multicolor)   // ← мултиколър
                                            .font(.headline)
                                    }
                                },
                                // --- 2. Horizontal scroll‑секция (оставена празна за момента) ---
                                horizontalContent: {
                                    EmptyView()          // сложете тук ваши shortcut‑и, ако желаете
                                },
                                // --- 3. Vertical scroll‑секция (оставена празна за момента) ---
                                verticalContent: {
                                       CalendarsSheetView()   // ← вместо EmptyView()
                                           .padding(.vertical, 8)   // по желание
                                   }
                            )
                            .edgesIgnoringSafeArea(.all)   // менюто да “залепне” за долния край
                        }
                    }                                       // ⬅️ до тук

                }
            }
            .navigationViewStyle(StackNavigationViewStyle())
            // -- Тук задаваме бял фон + тъмен текст на долния тулбар --
            .toolbarBackground(Color.white, for: .bottomBar)
            .toolbarBackground(.visible, for: .bottomBar)
            .toolbarColorScheme(.light, for: .bottomBar)
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
                        loadSingleDayEventsLocal()
                    }
                }
            }
        }
        // Sheet: EKCalendarChooser (Inbox)
        .sheet(isPresented: $showCalendarChooser) {
            CalendarChooserView(selectedCalendars: $selectedCalendars)
        }
        // Sheet: CalendarsSheetView
        .sheet(isPresented: $showCalendarsSheet) {
            CalendarsSheetView()
        }
        // Sheet: LoginView
        .sheet(isPresented: $showLoginSheet) {
            LoginView()
                .environmentObject(appViewModel)
        }
        // Sheet: RequestEmailView
        .sheet(isPresented: $showRequestEmailSheet, onDismiss: {
            // При затваряне на RequestEmailView, ако вече има email -> отваряме Calendars
            if appViewModel.isLoggedIn && !appViewModel.email.isEmpty {
                showCalendarsSheet = true
            }
        }) {
            RequestEmailView()
                .environmentObject(appViewModel)
        }
        // Ако user се логне от LoginView -> onChange
        .onChange(of: appViewModel.isLoggedIn) { newValue in
            if newValue {
                // Току-що се логна
                if appViewModel.email.isEmpty {
                    // Още няма email -> поискай email
                    showRequestEmailSheet = true
                } else {
                    // Вече имаме email -> директно Calendars
                    showCalendarsSheet = true
                }
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
}

// MARK: - LAZY AllEventsListView (примерни методи)
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

// MARK: - Fetch & Split
extension RootView {
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

// MARK: - Други представими/помощни в същия файл (ако желаете да са тук)

// 1) CalendarChooserView (UIViewControllerRepresentable)
struct CalendarChooserView: UIViewControllerRepresentable {
    @Environment(\.presentationMode) var presentationMode
    @Binding var selectedCalendars: Set<EKCalendar>
    
    class Coordinator: NSObject, @preconcurrency EKCalendarChooserDelegate {
        let parent: CalendarChooserView
        
        init(_ parent: CalendarChooserView) {
            self.parent = parent
        }
        
        @MainActor func calendarChooserDidFinish(_ calendarChooser: EKCalendarChooser) {
            parent.selectedCalendars = calendarChooser.selectedCalendars
            parent.presentationMode.wrappedValue.dismiss()
        }
        
        @MainActor func calendarChooserDidCancel(_ calendarChooser: EKCalendarChooser) {
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIViewController(context: Context) -> UINavigationController {
        let chooser = EKCalendarChooser(
            selectionStyle: .multiple,
            displayStyle: .allCalendars,
            entityType: .event,
            eventStore: CalendarViewModel.shared.eventStore
        )
        chooser.showsDoneButton = true
        chooser.showsCancelButton = true
        chooser.delegate = context.coordinator
        
        return UINavigationController(rootViewController: chooser)
    }
    
    func updateUIViewController(_ uiViewController: UINavigationController, context: Context) {
        // Не е задължително да правите нещо тук
    }
}
