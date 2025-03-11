import SwiftUI

struct AllEventsListView: View {
    @Binding var pinnedAllEvents: [EventDescriptor]
    
    let selectedTab: Int
    let onViewChange: (Int) -> Void
    
    // Методи за lazy load (двупосочен скрол)
    let loadInitialMonth: () -> Void
    let loadNextMonth: (@escaping () -> Void) -> Void
    let loadPreviousMonth: (@escaping () -> Void) -> Void
    
    let onEventTap: (EventDescriptor) -> Void
    
    // Флагове
    @State private var isLoadingMore = false
    @State private var didInitialScroll = false  // За да скролнем до Today само първия път
    
    var body: some View {
        ScrollViewReader { proxy in
            // Основният списък (List)
            List {
                // Групираме всички събития по ден
                ForEach(groupByDay(pinnedAllEvents), id: \.day) { dayGroup in
                    // Секцията за даден ден
                    // вместо да слагаме много код тук, ползваме подфункция:
                    daySectionView(dayGroup: dayGroup)
                        // Даваме .id на секцията (уникален идентификатор = самата дата)
                        .id(dayGroup.day)
                }
            }
            .listStyle(.plain)
            
            // MARK: - onAppear
            .onAppear {
                // Ако е празно, зареждаме началния месец
                if pinnedAllEvents.isEmpty {
                    loadInitialMonth()
                }
                // Скролваме до "днешния" ден (само при първо появяване)
                DispatchQueue.main.async {
                    scrollToTodayIfNeeded(proxy: proxy)
                }
            }
            
            // Ако искате да пренасочвате скрола при всяка промяна:
            // .onChange(of: pinnedAllEvents) { _ in ... }
            
            // MARK: - Toolbar
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
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
}

extension AllEventsListView {
    
    /// Рендерира един “ден” (Section) - header + списък от събития
    @ViewBuilder
    func daySectionView(dayGroup: DayGroup) -> some View {
        Section {
            // Събитията за този ден
            ForEach(dayGroup.events.indices, id: \.self) { i in
                let event = dayGroup.events[i]
                
                // Рендер на 1 ред (EventRow)
                eventRowView(event: event)
                    // Prefetch нагоре/надолу
                    .onAppear {
                        prefetchBottomIfNeeded(currentIndex: i, totalCount: dayGroup.events.count)
                        prefetchTopIfNeeded(currentIndex: i)
                    }
            }
        } header: {
            // Заглавие на деня
            Text(dayHeaderString(dayGroup.day))
                .font(.headline)
                .foregroundColor(isToday(dayGroup.day) ? .red : .secondary)
                .padding(.bottom, 4)
                .textCase(nil)
        }
    }
    
}
extension AllEventsListView {
    @ViewBuilder
    func eventRowView(event: EventDescriptor) -> some View {
        HStack(alignment: .top, spacing: 8) {
            // Цветна лента вляво
            Rectangle()
                .fill(Color(uiColor: event.color))
                .frame(width: 3)
                .cornerRadius(1.5)
            
            // Текст на събитието
            Text(event.text)
                .font(.body)
                .foregroundColor(.primary)
                .lineLimit(nil) // Или .lineLimit(1), в зависимост от дизайна
            
            Spacer()
            
            // Дясна част: all-day / partial / еднодневни
            if event.isAllDay {
                Text("all-day")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            } else if let multi = event as? EKMultiDayWrapper {
                partialDayView(for: multi)
            } else {
                // Нормално еднодневно
                VStack(alignment: .trailing, spacing: 2) {
                    Text(timeString(event.dateInterval.start))
                    Text(timeString(event.dateInterval.end))
                }
                .font(.subheadline)
                .foregroundColor(.gray)
            }
        }
        .padding(.vertical, 6)
        .contentShape(Rectangle())
        .onTapGesture {
            onEventTap(event)
        }
    }
}
extension AllEventsListView {
    /// Показва времето за многодневно partial събитие
    @ViewBuilder
    func partialDayView(for multi: EKMultiDayWrapper) -> some View {
        if multi.isFirstPartialDay {
            Text(timeString(multi.partialStart))
                .font(.subheadline)
                .foregroundColor(.gray)
        } else if multi.isLastPartialDay {
            VStack(alignment: .trailing, spacing: 2) {
                Text("Ends")
                Text(timeString(multi.partialEnd))
            }
            .font(.subheadline)
            .foregroundColor(.gray)
        } else if multi.isMiddlePartialDay {
            Text("all-day")
                .font(.subheadline)
                .foregroundColor(.gray)
        } else {
            // Фалбек
            VStack(alignment: .trailing, spacing: 2) {
                Text(timeString(multi.partialStart))
                Text(timeString(multi.partialEnd))
            }
            .font(.subheadline)
            .foregroundColor(.gray)
        }
    }
}
extension AllEventsListView {
    func prefetchBottomIfNeeded(currentIndex: Int, totalCount: Int) {
        let threshold = totalCount - 5
        if currentIndex >= threshold && !isLoadingMore {
            isLoadingMore = true
            loadNextMonth {
                isLoadingMore = false
            }
        }
    }
    
    func prefetchTopIfNeeded(currentIndex: Int) {
        if currentIndex < 5 && !isLoadingMore {
            isLoadingMore = true
            loadPreviousMonth {
                isLoadingMore = false
            }
        }
    }
}
extension AllEventsListView {
    func scrollToTodayIfNeeded(proxy: ScrollViewProxy) {
        // За да не скролваме многократно
        guard !didInitialScroll else { return }
        
        let dayGroups = groupByDay(pinnedAllEvents)
        
        // Търсим индекс на днешния ден
        if let idx = dayGroups.firstIndex(where: { isToday($0.day) }) {
            let dayID = dayGroups[idx].day
            // Скролваме
            proxy.scrollTo(dayID, anchor: .top)
        }
        
        didInitialScroll = true
    }
}
extension AllEventsListView {
    /// Групира `pinnedAllEvents` по startOfDay
    func groupByDay(_ events: [EventDescriptor]) -> [DayGroup] {
        var dict = [Date: [EventDescriptor]]()
        let cal = Calendar.current
        
        for e in events {
            let dayStart = cal.startOfDay(for: e.dateInterval.start)
            dict[dayStart, default: []].append(e)
        }
        
        // Сортираме дните във възходящ ред
        let sortedKeys = dict.keys.sorted()
        
        return sortedKeys.map { day in
            let dayEvents = dict[day]?.sorted(by: { $0.dateInterval.start < $1.dateInterval.start }) ?? []
            return DayGroup(day: day, events: dayEvents)
        }
    }
    
    struct DayGroup: Identifiable {
        let day: Date
        let events: [EventDescriptor]
        
        var id: Date { day }
    }
    
    // MARK: - Format/Helper
    func dayHeaderString(_ date: Date) -> String {
        let calendar = Calendar.current
        let currentYear = calendar.component(.year, from: Date())
        let targetYear = calendar.component(.year, from: date)

        let df = DateFormatter()
        df.dateFormat = (targetYear == currentYear)
            ? "EEEE — MMM d"
            : "EEEE — MMM d, yyyy"
        
        return df.string(from: date).uppercased()
    }

    
    func isToday(_ date: Date) -> Bool {
        Calendar.current.isDateInToday(date)
    }
    
    func timeString(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "h:mma"
        return df.string(from: date)
    }
}
