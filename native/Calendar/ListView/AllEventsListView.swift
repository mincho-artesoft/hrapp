import SwiftUI
import EventKit

struct AllEventsListView: View {
    @Binding var pinnedAllEvents: [EventDescriptor]
    var scrollRequest: CalendarListScrollRequest? = nil
    
    let selectedTab: Int
    let onViewChange: (Int) -> Void
    
    let loadInitialEvents: () -> Void
    let onLoadMoreAfter: () -> Void
    let onLoadMoreBefore: () -> Void
    
    @State private var eventToView: EKEvent? = nil
    
    @State private var didInitialScroll = false
    @State private var handledScrollRequestID: UUID?
    @State private var isUserScrolling = false
    @State private var visibleDays: Set<Date> = []
    @State private var loadedBeforeDuringScroll = false
    @State private var loadedAfterDuringScroll = false
    
    // MARK: - NEW: Search states
    @State private var showSearchBar = false
    @State private var searchText = ""
    
    var body: some View {
        VStack(spacing: 0) {
            if showSearchBar {
                CalendarEventSearchField(text: $searchText) {
                    showSearchBar = false
                    searchText = ""
                }
                    .transition(.move(edge: .top))
            } else {
                topBar
            }
            
            // 2) Main Content
            if showSearchBar && !searchText.isEmpty {
                SearchResultsView(searchText: searchText)
            } else {
                GeometryReader { geo in
                    ScrollViewReader { proxy in
                        content(proxy: proxy)
                    }
                    .padding(.top,1)
//                    .frame(height: cardHeight)
                    .sheet(item: $eventToView, onDismiss: {
                        loadInitialEvents()
                    }) { event in
                        EventDetailViewWrapper(event: event)
                    }
                }
            }
        }
        .animation(.easeInOut, value: showSearchBar)
        .navigationBarHidden(true)
        .onChange(of: scrollRequest) { _, _ in
            showSearchBar = false
            searchText = ""
        }
    }

    private var topBar: some View {
        CalendarScreenHeader(currentView: selectedTab,
            onSearch: { showSearchBar = true },
            onViewChange: { newTab in onViewChange(newTab) })
    }
    
    // MARK: - The main List content
    @ViewBuilder
    private func content(proxy: ScrollViewProxy) -> some View {
        eventList(proxy: proxy)
        .onAppear {
            if pinnedAllEvents.isEmpty {
                loadInitialEvents()
            }
        }
        .onDisappear {
            // Search replaces the List and its scroll reader. Restore the date
            // anchor when the list is mounted again instead of showing row one.
            didInitialScroll = false
        }
    }
    
    private func eventList(proxy: ScrollViewProxy) -> some View {
        List {
            let dayGroups = groupByDay(pinnedAllEvents)
            
            ForEach(dayGroups) { dayGroup in
                
                DaySectionView(
                    dayGroup: dayGroup,
                    isToday: isToday,
                    dayHeaderString: dayHeaderString,
                    timeString: timeString
                ) { event in
                    if let multi = event as? EKMultiDayWrapper {
                        eventToView = multi.realEvent
                    } else if let editableEvent = event as? EKEvent {
                        eventToView = editableEvent
                    } else {
                        print("Event type not supported for editing")
                    }
                }
                .onAppear {
                    visibleDays.insert(dayGroup.day)
                    loadNearVisibleEdges()
                }
                .onDisappear { visibleDays.remove(dayGroup.day) }
            }

            Section {
                CalendarScrollFooter()
                    .listRowInsets(EdgeInsets())
                    .listRowSeparator(.hidden)
                    .listRowBackground(Color.clear)
                    .accessibilityHidden(true)
            }
        }
        .listStyle(.plain)
        .onScrollPhaseChange { previous, phase in
            if phase == .interacting && previous != .interacting {
                loadedBeforeDuringScroll = false
                loadedAfterDuringScroll = false
            }
            isUserScrolling = phase == .interacting || phase == .decelerating
            loadNearVisibleEdges()
        }
        .task(id: CalendarListScrollUpdate(request: scrollRequest, days: groupByDay(pinnedAllEvents).map(\.day))) {
            guard !didInitialScroll || handledScrollRequestID != scrollRequest?.id,
                  let target = CalendarSidebarLayout.listScrollTarget(
                    days: groupByDay(pinnedAllEvents).map(\.day), selectedDate: scrollRequest?.date,
                    calendar: Calendar.current) else { return }
            // Render the section before asking List to find its anchor.
            await Task.yield()
            guard !Task.isCancelled else { return }
            if scrollRequest != nil {
                withAnimation(.easeInOut(duration: 0.25)) { proxy.scrollTo(target, anchor: .top) }
            } else {
                proxy.scrollTo(target, anchor: .top)
            }
            didInitialScroll = true
            handledScrollRequestID = scrollRequest?.id
        }
    }

    private func loadNearVisibleEdges() {
        // Never paginate while the initial/programmatic anchor is resolving.
        // Also check when a gesture begins: sparse lists may already have their
        // first/last sections on screen, so no new onAppear would be delivered.
        guard didInitialScroll, isUserScrolling else { return }
        let days = groupByDay(pinnedAllEvents).map(\.day)
        if !loadedBeforeDuringScroll, days.prefix(3).contains(where: visibleDays.contains) {
            loadedBeforeDuringScroll = true
            onLoadMoreBefore()
        }
        if !loadedAfterDuringScroll, days.suffix(3).contains(where: visibleDays.contains) {
            loadedAfterDuringScroll = true
            onLoadMoreAfter()
        }
    }
    
    // MARK: - Helpers
    func groupByDay(_ events: [EventDescriptor]) -> [DayGroup] {
        var dict = [Date: [EventDescriptor]]()
        let cal = Calendar.current
        
        for e in events {
            let dayStart = cal.startOfDay(for: e.dateInterval.start)
            dict[dayStart, default: []].append(e)
        }
        
        let sortedKeys = CalendarSidebarLayout.listDays(eventDays: Array(dict.keys),
            selectedDate: scrollRequest?.date, calendar: cal)
        return sortedKeys.map { day in
            let dayEvents = dict[day] ?? []
            let sortedEvents = dayEvents.sorted { $0.dateInterval.start < $1.dateInterval.start }
            return DayGroup(day: day, events: sortedEvents)
        }
    }
    
    struct DayGroup: Identifiable {
        let day: Date
        let events: [EventDescriptor]
        
        var id: Date { day }
    }
    
    func dayHeaderString(_ date: Date) -> String {
        let calendar = Calendar.current
        let currentYear = calendar.component(.year, from: Date())
        let targetYear = calendar.component(.year, from: date)
        
        let df = appShortDateFormatter(
            includesYear: targetYear != currentYear,
            includesWeekday: true,
            usesFullWeekday: true
        )
        
        return df.string(from: date).uppercased()
    }
    
    func isToday(_ date: Date) -> Bool {
        Calendar.current.isDateInToday(date)
    }
    
    func timeString(_ date: Date) -> String {
        appTimeFormatter().string(from: date)
    }
    
}
