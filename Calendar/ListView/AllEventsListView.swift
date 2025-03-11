import SwiftUI
import EventKit

// MARK: - ALL EVENTS LIST VIEW (Infinite Scroll)
struct AllEventsListView: View {
    @Binding var pinnedAllEvents: [EventDescriptor]
    
    let selectedTab: Int
    let onViewChange: (Int) -> Void
    
    // Зареждане на “първата партида” (примерно 30 дни)
    let loadCurrentMonthEvents: () -> Void
    
    // Зареждане на още събития (след като стигнем дъното)
    let onLoadMore: () -> Void
    
    let onEventTap: (EventDescriptor) -> Void
    
    @State private var didInitialScroll = false
    
    var body: some View {
        ScrollViewReader { proxy in
            
            // Групираме събитията по дни (за Section-и)
            let dayGroups = groupByDay(pinnedAllEvents)
            
            List {
                ForEach(dayGroups, id: \.day) { dayGroup in
                    daySectionView(dayGroup: dayGroup)
                        .id(dayGroup.day)
                    
                    // MARK: - ТУК е “onAppear” на всеки DayGroup
                        .onAppear {
                            // Ако това е последният ден в списъка -> зареждаме още
                            if let lastDay = dayGroups.last?.day,
                               dayGroup.day == lastDay
                            {
                                onLoadMore()
                            }
                        }
                }
            }
            .listStyle(.plain)
            
            .onAppear {
                // Ако списъкът е празен -> първоначално зареждане
                if pinnedAllEvents.isEmpty {
                    loadCurrentMonthEvents()
                }
            }
            
            // Когато списъкът се промени от празен -> непразен, скрол до днес
            .onChange(of: pinnedAllEvents.isEmpty) { oldValue, newValue in
                if !newValue, !didInitialScroll {
                    DispatchQueue.main.async {
                        scrollToTodayIfNeeded(proxy: proxy)
                    }
                }
            }
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
    
    // Рендерира един ден (Section)
    @ViewBuilder
    func daySectionView(dayGroup: DayGroup) -> some View {
        Section {
            ForEach(dayGroup.events.indices, id: \.self) { i in
                let event = dayGroup.events[i]
                eventRowView(event: event)
            }
        } header: {
            Text(dayHeaderString(dayGroup.day))
                .font(.headline)
                .foregroundColor(isToday(dayGroup.day) ? .red : .secondary)
                .padding(.bottom, 4)
                .textCase(nil)
        }
    }
    
    // Един ред: визуализира EventDescriptor
    @ViewBuilder
    func eventRowView(event: EventDescriptor) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Rectangle()
                .fill(Color(uiColor: event.color))
                .frame(width: 3)
                .cornerRadius(1.5)
            
            Text(event.text)
                .font(.body)
                .foregroundColor(.primary)
            
            Spacer()
            
            if event.isAllDay {
                Text("all-day")
                    .font(.subheadline)
                    .foregroundColor(.gray)
            } else if let multi = event as? EKMultiDayWrapper {
                partialDayView(for: multi)
            } else {
                // Еднодневно
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
            VStack(alignment: .trailing, spacing: 2) {
                Text(timeString(multi.partialStart))
                Text(timeString(multi.partialEnd))
            }
            .font(.subheadline)
            .foregroundColor(.gray)
        }
    }
    
    func scrollToTodayIfNeeded(proxy: ScrollViewProxy) {
        guard !didInitialScroll else { return }
        didInitialScroll = true
        
        let dayGroups = groupByDay(pinnedAllEvents)
        if let idx = dayGroups.firstIndex(where: { isToday($0.day) }) {
            proxy.scrollTo(dayGroups[idx].day, anchor: .top)
        }
    }
    
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
        
        let df = DateFormatter()
        df.dateFormat = (targetYear == currentYear) ? "EEEE — MMM d" : "EEEE — MMM d, yyyy"
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

