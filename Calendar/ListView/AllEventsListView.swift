import SwiftUI
import EventKit

struct AllEventsListView: View {
    @Binding var pinnedAllEvents: [EventDescriptor]
    
    let selectedTab: Int
    let onViewChange: (Int) -> Void
    
    let loadInitialEvents: () -> Void
    let onLoadMoreAfter: () -> Void
    let onLoadMoreBefore: () -> Void
    
    @State private var eventToView: EKEvent? = nil
    
    // Флаг, за да знаем, че току-що сме заредили стари събития
    @State private var didLoadMoreBefore: Bool = false
    // Флаг, който контролира видимостта на съдържанието
    @State private var isContentVisible: Bool = false
    
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
    }

    @ViewBuilder
    private var topBar: some View {
        HStack(spacing: 9) {
            Spacer()
            if !showSearchBar {
                Button {
                    showSearchBar = true
                } label: {
                    Image(uiImage: CalendarSearchAppearance.iconImage)
                        .renderingMode(.template)
                        .foregroundStyle(.blue)
                }
                .frame(
                    width: CalendarSearchAppearance.buttonSize,
                    height: CalendarSearchAppearance.buttonSize
                )
                .contentShape(Rectangle())
                .buttonStyle(.plain)

                UIMenuButtonRepresentable(
                    currentView: selectedTab,
                    onViewChange: { newTab in
                        onViewChange(newTab)
                    }
                )
                .frame(width: 30, height: 30)
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
        .padding(.bottom, 8)
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
                    if let multi = event as? EKMultiDayWrapper {
                        eventToView = multi.realEvent
                    } else if let editableEvent = event as? EKEvent {
                        eventToView = editableEvent
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
