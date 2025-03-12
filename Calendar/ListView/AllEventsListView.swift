import SwiftUI
import EventKit

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
    
    // Локално състояние за редактиране/създаване на събитие
    @State private var eventToEdit: EKEvent? = nil
    
    /// Флаг, за да знаем, че току-що сме заредили стари събития
    @State private var didLoadMoreBefore: Bool = false
    /// Флаг, който контролира видимостта на съдържанието
    @State private var isContentVisible: Bool = false
    
    var body: some View {
        ScrollViewReader { proxy in
            content(proxy: proxy)
        }
        // 2) В sheet-а за редактиране:
        //    - Гарантираме, че след Save/Delete извикваме loadInitialEvents()
        .sheet(item: $eventToEdit) { event in
            EventEditViewWrapper(
                eventStore: CalendarViewModel.shared.eventStore,
                event: event,
                onEventUpdated: {
                    // След като затворим EventEditViewWrapper, презареждаме
                    loadInitialEvents()
                }
            )
        }
    }
    
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
            // Закъснение, за да сме сигурни, че scrollToToday ще се изпълни
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
                DaySectionView(dayGroup: dayGroup,
                               isToday: isToday,
                               dayHeaderString: dayHeaderString,
                               timeString: timeString,
                               eventRowAction: { event in
                                   if let multi = event as? EKMultiDayWrapper {
                                       eventToEdit = multi.realEvent
                                   } else if let editableEvent = event as? EKEvent {
                                       eventToEdit = editableEvent
                                   } else {
                                       print("Event type not supported for editing")
                                   }
                               })
                    .id(dayGroup.day)
                    .onAppear {
                        let threshold = 3
                        // Ако сме в първите редове -> зареждаме още "назад"
                        if index < threshold {
                            didLoadMoreBefore = true
                            onLoadMoreBefore()
                        }
                        // Ако сме към последните редове -> зареждаме още "надолу"
                        if index >= dayGroups.count - threshold {
                            onLoadMoreAfter()
                        }
                    }
            }
        }
        .listStyle(.plain)
        .toolbar {
            ToolbarItemGroup(placement: .navigationBarTrailing) {
                // Бутонът "плюс" за създаване на ново събитие
                Button(action: {
                    createAndEditNewEvent(on: Date())
                }) {
                    Image(systemName: "plus")
                }
                // Менюто за смяна на изгледите
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
        if let match = groups.first(where: { Calendar.current.isDate($0.day, inSameDayAs: today) }) {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.01) {
                proxy.scrollTo(match.day, anchor: .top)
            }
        }
    }
    
    // MARK: - Помощни функции
    
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
    
    // MARK: - Функции за създаване на нови събития
    
    // 1) Тук пипаме началните/крайните дати: вместо "Date()" сега
    //    задаваме точно "day" (startOfDay), за да е сигурно, че
    //    попада в диапазона, който вие вече сте заредили.
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
        
        // Вземаме [year, month, day] от подадения "day"
        var dateComponents = cal.dateComponents([.year, .month, .day], from: day)
        
        // И вземаме [hour, minute] от текущия момент
        let nowComponents = cal.dateComponents([.hour, .minute], from: Date())
        
        // Комбинираме ги:
        dateComponents.hour = nowComponents.hour
        dateComponents.minute = nowComponents.minute
        
        // Създаваме начален час като “текущия час в избрания ден”
        let startDate = cal.date(from: dateComponents)!
        newEvent.startDate = startDate
        
        // Задаваме край – например +1 час
        newEvent.endDate   = cal.date(byAdding: .hour, value: 1, to: startDate)!
        
        newEvent.title = "New Event"
        newEvent.calendar = CalendarViewModel.shared.eventStore.defaultCalendarForNewEvents
        eventToEdit = newEvent
    }

}
