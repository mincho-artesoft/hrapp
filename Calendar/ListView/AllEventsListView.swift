import SwiftUI
import EventKit

// MARK: - ALL EVENTS LIST VIEW (Infinite Scroll) + зареждане нагоре + скрол обратно до днешния ден
struct AllEventsListView: View {
    @Binding var pinnedAllEvents: [EventDescriptor]
    
    let selectedTab: Int
    let onViewChange: (Int) -> Void
    
    /// Първоначално зареждане (ако списъкът е празен)
    let loadInitialEvents: () -> Void
    
    /// Зареждане на още събития, след като стигнем „дъното“
    let onLoadMoreAfter: () -> Void
    
    /// Зареждане на още събития, след като стигнем „горе“ (първа дата)
    let onLoadMoreBefore: () -> Void
    
    let onEventTap: (EventDescriptor) -> Void
    
    /// Флаг, за да знаем, че току-що сме заредили стари събития
    @State private var didLoadMoreBefore: Bool = false
    
    var body: some View {
        // Използваме ScrollViewReader, за да можем да скролираме до конкретен ID (датата на деня)
        ScrollViewReader { proxy in
            let dayGroups = groupByDay(pinnedAllEvents)
            
            List {
                // Обхождаме ден-групите по индекс, за да имаме достъп до index
                ForEach(dayGroups.indices, id: \.self) { index in
                    let dayGroup = dayGroups[index]
                    
                    // Секция за конкретния ден
                    daySectionView(dayGroup: dayGroup)
                        // Даваме .id(dayGroup.day), за да можем да скролим до тази секция
                        .id(dayGroup.day)
                        
                        // При появяване на секцията проверяваме дали сме близо до „началото“ или „края“
                        .onAppear {
                            // Ако сме сред първите няколко дни (threshold = 3),
                            // значи сме скролнали горе и трябва да заредим още стари дни
                            let threshold = 3
                            if index < threshold {
                                didLoadMoreBefore = true
                                onLoadMoreBefore()
                            }
                            
                            // Ако сме сред последните няколко дни, зареждаме още дни "напред"
                            if index >= dayGroups.count - threshold {
                                onLoadMoreAfter()
                            }
                        }
                }
            }
            .listStyle(.plain)
            
            // Ако при първо показване списъкът е празен, извикваме начално зареждане
            .onAppear {
                if pinnedAllEvents.isEmpty {
                    loadInitialEvents()
                }
            }
            
            // Следим, когато броят на събитията се промени
            .onChange(of: pinnedAllEvents.count) { _ in
                // Ако току-що сме заредили стари събития, отиваме до днешния ден
                if didLoadMoreBefore {
                    scrollToToday(proxy: proxy)
                    didLoadMoreBefore = false
                }
            }
            
            // Примерен toolbar
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
    
    // MARK: - Скрол до днешния ден (секцията за него най-горе)
    func scrollToToday(proxy: ScrollViewProxy) {
        let today = Calendar.current.startOfDay(for: Date())
        let groups = groupByDay(pinnedAllEvents)
        
        // Търсим дали имаме група за днешния ден
        if let match = groups.first(where: { Calendar.current.isDate($0.day, inSameDayAs: today) }) {
            // Вместо веднага, пускаме скрол след кратко забавяне (0.05 сек),
            // за да сме сигурни, че List е "подготвен"
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.01) {
                withAnimation {
                    proxy.scrollTo(match.day, anchor: .top)
                }
            }
        }
    }
    
    // MARK: - UI за цяла секция (един ден)
    @ViewBuilder
    func daySectionView(dayGroup: DayGroup) -> some View {
        Section {
            // Редовете за събитията в този ден
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
    
    // MARK: - UI за един ред (EventDescriptor)
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
    
    // MARK: - UI за многодневно събитие (EKMultiDayWrapper), разглеждано ден по ден
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
    
    // MARK: - Групиране на събитията по ден
    func groupByDay(_ events: [EventDescriptor]) -> [DayGroup] {
        var dict = [Date: [EventDescriptor]]()
        let cal = Calendar.current
        
        for e in events {
            let dayStart = cal.startOfDay(for: e.dateInterval.start)
            dict[dayStart, default: []].append(e)
        }
        
        // Подреждаме дните по възходящ ред
        let sortedKeys = dict.keys.sorted()
        
        return sortedKeys.map { day in
            let dayEvents = dict[day] ?? []
            // Подреждаме събитията в самия ден по начален час
            let sortedEvents = dayEvents.sorted { $0.dateInterval.start < $1.dateInterval.start }
            return DayGroup(day: day, events: sortedEvents)
        }
    }
    
    // MARK: - Помощна структура за ден
    struct DayGroup: Identifiable {
        let day: Date
        let events: [EventDescriptor]
        
        var id: Date { day }
    }
    
    // MARK: - Форматиране на заглавието на деня
    func dayHeaderString(_ date: Date) -> String {
        let calendar = Calendar.current
        let currentYear = calendar.component(.year, from: Date())
        let targetYear = calendar.component(.year, from: date)
        
        let df = DateFormatter()
        // Ако е същата година -> "EEEE — MMM d", иначе добавяме и годината
        df.dateFormat = (targetYear == currentYear) ? "EEEE — MMM d" : "EEEE — MMM d, yyyy"
        
        return df.string(from: date).uppercased()
    }
    
    // MARK: - Проверка дали даден ден е днешния
    func isToday(_ date: Date) -> Bool {
        Calendar.current.isDateInToday(date)
    }
    
    // MARK: - Форматиране на час
    func timeString(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "h:mma" // Пример: "1:37PM"
        return df.string(from: date)
    }
}
