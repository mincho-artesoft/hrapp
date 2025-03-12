import SwiftUI
import EventKit

struct AllEventsListView: View {
    @Binding var pinnedAllEvents: [EventDescriptor]
    
    let selectedTab: Int
    let onViewChange: (Int) -> Void
    
    let loadInitialEvents: () -> Void
    let onLoadMoreAfter: () -> Void
    let onLoadMoreBefore: () -> Void
    
    // Локално състояние за редактиране/създаване на събитие
    @State private var eventToEdit: EKEvent? = nil
    
    // Флаг, за да знаем, че току-що сме заредили стари събития
    @State private var didLoadMoreBefore: Bool = false
    // Флаг, който контролира видимостта на съдържанието
    @State private var isContentVisible: Bool = false
    
    // MARK: - NEW: Search states
    @State private var showSearchBar = false
    @State private var searchText = ""
    
    var body: some View {
        VStack(spacing: 0) {
            // 1) Optional search bar, shown if showSearchBar == true
            if showSearchBar {
                HStack {
                    TextField("Search events...", text: $searchText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.leading)
                    
                    Button("Cancel") {
                        showSearchBar = false
                        searchText = ""
                    }
                    .padding(.trailing)
                }
                .padding(.vertical, 8)
                .background(.thinMaterial)
                .transition(.move(edge: .top))
            }
            
            // 2) Main Content – conditionally show search results or the normal event list
            if showSearchBar && !searchText.isEmpty {
                // If searching and we have text, show search results
                SearchResultsView(searchText: searchText)
            } else {
                // Otherwise, show your normal event list
                ScrollViewReader { proxy in
                    content(proxy: proxy)
                }
                // 2a) Sheet за редактиране/създаване на събитие
                .sheet(item: $eventToEdit) { event in
                    EventEditViewWrapper(
                        eventStore: CalendarViewModel.shared.eventStore,
                        event: event,
                        onEventUpdated: {
                            // След Save/Delete → презареждане
                            loadInitialEvents()
                        }
                    )
                }
            }
        }
        // Нежна анимация при показване/скриване на searchBar
        .animation(.easeInOut, value: showSearchBar)
        
        // 3) Toolbar: add the magnifying glass button + existing items
        .toolbar {
            ToolbarItemGroup(placement: .navigationBarTrailing) {
                // Show the "plus" and "ellipsis" only if not searching
                if !showSearchBar {
                    // 3a) “+” за ново събитие
                    Button(action: {
                        createAndEditNewEvent(on: Date())
                    }) {
                        Image(systemName: "plus")
                    }
                    
                    // 3b) Search button
                    Button {
                        showSearchBar = true
                    } label: {
                        Image(systemName: "magnifyingglass")
                    }
                    
                    // 3c) Menu за изгледи
                    Menu {
                        Button {
                            onViewChange(1)
                        } label: {
                            Label("Day", systemImage: (selectedTab == 1 ? "checkmark" : ""))
                        }
                        Button {
                            onViewChange(3)
                        } label: {
                            Label("MultiDay", systemImage: (selectedTab == 3 ? "checkmark" : ""))
                        }
                        Button {
                            onViewChange(0)
                        } label: {
                            Label("Month", systemImage: (selectedTab == 0 ? "checkmark" : ""))
                        }
                        Button {
                            onViewChange(2)
                        } label: {
                            Label("Year", systemImage: (selectedTab == 2 ? "checkmark" : ""))
                        }
                        Button {
                            onViewChange(4)
                        } label: {
                            Label("List", systemImage: (selectedTab == 4 ? "checkmark" : ""))
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
        }
    }
    
    // MARK: - The main List content
    @ViewBuilder
    private func content(proxy: ScrollViewProxy) -> some View {
        Group {
            if isContentVisible {
                eventList(proxy: proxy)
            } else {
                EmptyView()
            }
        }
        .onAppear {
            if pinnedAllEvents.isEmpty {
                loadInitialEvents()
            }
            scrollToToday(proxy: proxy)
            // Малко закъснение, за да сме сигурни, че scrollToToday ще се изпълни
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.06) {
                isContentVisible = true
            }
        }
    }
    
    private func eventList(proxy: ScrollViewProxy) -> some View {
        List {
            let dayGroups = groupByDay(pinnedAllEvents)
            
            ForEach(dayGroups.indices, id: \.self) { index in
                let dayGroup = dayGroups[index]
                DaySectionView(
                    dayGroup: dayGroup,
                    isToday: isToday,
                    dayHeaderString: dayHeaderString,
                    timeString: timeString
                ) { event in
                    // On event tap → open for edit
                    if let multi = event as? EKMultiDayWrapper {
                        eventToEdit = multi.realEvent
                    } else if let editableEvent = event as? EKEvent {
                        eventToEdit = editableEvent
                    } else {
                        print("Event type not supported for editing")
                    }
                }
                .id(dayGroup.day)
                .onAppear {
                    let threshold = 3
                    // Ако сме в първите редове -> зареждаме още "назад"
                    if index < threshold {
                        didLoadMoreBefore = true
                        onLoadMoreBefore()
                    }
                    // Ако сме в последните редове -> зареждаме още "надолу"
                    if index >= dayGroups.count - threshold {
                        onLoadMoreAfter()
                    }
                }
            }
        }
        .listStyle(.plain)
        // При зареждане "назад" → скрол до "днес"
        .onChange(of: pinnedAllEvents.count) { _, _ in
            if didLoadMoreBefore {
                scrollToToday(proxy: proxy)
                didLoadMoreBefore = false
            }
        }
    }
    
    private func scrollToToday(proxy: ScrollViewProxy) {
        let today = Calendar.current.startOfDay(for: Date())
        let groups = groupByDay(pinnedAllEvents)
        if let match = groups.first(where: {
            Calendar.current.isDate($0.day, inSameDayAs: today)
        }) {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.01) {
                proxy.scrollTo(match.day, anchor: .top)
            }
        }
    }
    
    // MARK: - Helpers
    
    /// Групиране на събитията по ден
    func groupByDay(_ events: [EventDescriptor]) -> [DayGroup] {
        var dict = [Date: [EventDescriptor]]()
        let cal = Calendar.current
        
        for e in events {
            let dayStart = cal.startOfDay(for: e.dateInterval.start)
            dict[dayStart, default: []].append(e)
        }
        
        let sortedKeys = dict.keys.sorted()
        
        return sortedKeys.map { day in
            let dayEvents = dict[day] ?? []
            let sortedEvents = dayEvents.sorted { $0.dateInterval.start < $1.dateInterval.start }
            return DayGroup(day: day, events: sortedEvents)
        }
    }
    
    /// Помощна структура за ден
    struct DayGroup: Identifiable {
        let day: Date
        let events: [EventDescriptor]
        
        var id: Date { day }
    }
    
    /// Форматиране на заглавието на деня
    func dayHeaderString(_ date: Date) -> String {
        let calendar = Calendar.current
        let currentYear = calendar.component(.year, from: Date())
        let targetYear = calendar.component(.year, from: date)
        
        let df = DateFormatter()
        df.dateFormat = (targetYear == currentYear) ? "EEEE — MMM d" : "EEEE — MMM d, yyyy"
        
        return df.string(from: date).uppercased()
    }
    
    /// Проверка дали даден ден е днешния
    func isToday(_ date: Date) -> Bool {
        Calendar.current.isDateInToday(date)
    }
    
    /// Форматиране на час
    func timeString(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "h:mma"
        return df.string(from: date)
    }
    
    // MARK: - Създаване на нови събития
    private func createAndEditNewEvent(on day: Date) {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            switch status {
            case .fullAccess, .writeOnly:
                presentNewEvent(on: day)
            case .notDetermined:
                print("TODO: requestCalendarAccessIfNeeded()")
            default:
                print("No calendar access.")
            }
        } else {
            if status == .authorized {
                presentNewEvent(on: day)
            } else if status == .notDetermined {
                print("TODO: requestCalendarAccessIfNeeded()")
            } else {
                print("No calendar access.")
            }
        }
    }
    
    private func presentNewEvent(on day: Date) {
        let cal = Calendar.current
        let newEvent = EKEvent(eventStore: CalendarViewModel.shared.eventStore)
        
        // Вземаме [year, month, day] от "day"
        var dateComponents = cal.dateComponents([.year, .month, .day], from: day)
        
        // Вземаме [hour, minute] от текущия момент
        let nowComponents = cal.dateComponents([.hour, .minute], from: Date())
        
        // Комбинираме ги:
        dateComponents.hour = nowComponents.hour
        dateComponents.minute = nowComponents.minute
        
        // Начален час
        let startDate = cal.date(from: dateComponents)!
        newEvent.startDate = startDate
        
        // Краен час (+1 час)
        newEvent.endDate = cal.date(byAdding: .hour, value: 1, to: startDate)!
        
        newEvent.title = "New Event"
        newEvent.calendar = CalendarViewModel.shared.eventStore.defaultCalendarForNewEvents
        eventToEdit = newEvent
    }
}
