import SwiftUI
import EventKit

// MARK: - ALL EVENTS LIST VIEW (Infinite Scroll) - без автоскрол и без автоматично зареждане нагоре
struct AllEventsListView: View {
    @Binding var pinnedAllEvents: [EventDescriptor]
    
    let selectedTab: Int
    let onViewChange: (Int) -> Void
    
    /// Първоначално зареждане (ако списъкът е празен)
    let loadInitialEvents: () -> Void
    
    /// Зареждане на още събития, след като стигнем „дъното“
    let onLoadMoreAfter: () -> Void
    
    /// Зареждане на още събития, след като стигнем „горе“ (първа дата)
    /// - Ще го викаме ръчно (ако изобщо искаме).
    let onLoadMoreBefore: () -> Void
    
    let onEventTap: (EventDescriptor) -> Void
    
    var body: some View {
        ScrollViewReader { proxy in
            let dayGroups = groupByDay(pinnedAllEvents)
            
            List {
                // Вместо ForEach(dayGroups, id: \.day), ползваме индекси:
                ForEach(dayGroups.indices, id: \.self) { index in
                    let dayGroup = dayGroups[index]
                    
                    daySectionView(dayGroup: dayGroup)
                        .id(dayGroup.day)
                    
                        // Коментар/пример за автоматично зареждане „назад“ (спрян в момента):
                        /*
                        .onAppear {
                            // Ако искаме да товарим назад, може да проверим подобно
                            // дали index е малък и ако е (примерно) 2, да load-нем назад
                            if index == 0 {
                                onLoadMoreBefore()
                            }
                        }
                        */
                        
                        // Автоматично зареждане "напред" (по-рано).
                        // Ако сме в последните 3 dayGroups, викаме onLoadMoreAfter()
                        .onAppear {
                            let threshold = 3
                            // Ако индексът е в последните 'threshold' елемента
                            if index >= dayGroups.count - threshold {
                                onLoadMoreAfter()
                            }
                        }
                }
            }
            .listStyle(.plain)
            
            // Ако списъкът е празен -> първоначално зареждане
            .onAppear {
                if pinnedAllEvents.isEmpty {
                    loadInitialEvents()
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
