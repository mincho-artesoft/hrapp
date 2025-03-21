import SwiftUI
import EventKit
import EventKitUI

struct MonthCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    var startMonth: Date
    var selectedTab: Int
    var onViewChange: ((Int) -> Void)?
    
    // 1) За системния детайлен изглед (EKEventViewController)
    @State private var eventToView: EKEvent? = nil
    
    // 2) За екран за създаване/редакция (EKEventEditViewController)
    @State private var eventToEdit: EKEvent? = nil
    
    // 3) За диалог при повтарящи се събития (drag & drop)
    @State private var showRepeatingDialog = false
    @State private var repeatingEvent: EKEvent? = nil
    @State private var repeatingNewDate: Date? = nil
    
    // 4) DayView (пълен екран), ако го ползвате
    @State private var selectedDayForFullScreen: Date? = nil
    @State private var pinnedDayEvents: [EventDescriptor] = []
    
    // Текущ месец
    @State private var currentMonth: Date
    
    // Променливи за търсене
    @State private var showSearchBar: Bool = false
    @State private var searchText: String = ""
    
    private let calendar = Calendar(identifier: .gregorian)
    
    init(viewModel: CalendarViewModel,
         startMonth: Date,
         selectedTab: Int,
         onViewChange: ((Int) -> Void)?) {
        self.viewModel = viewModel
        self.startMonth = startMonth
        self._currentMonth = State(initialValue: startMonth)
        self.selectedTab = selectedTab
        self.onViewChange = onViewChange
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // (A) Търсачка (по желание)
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
            
            // (B) Навигация за месеца (бутон < >, заглавие)
            if !(showSearchBar && !searchText.isEmpty) {
                HStack {
                    Button {
                        moveMonth(by: -1)
                    } label: {
                        Image(systemName: "chevron.left")
                    }
                    
                    Text(formattedMonthYear(currentMonth))
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                    
                    Button {
                        moveMonth(by: 1)
                    } label: {
                        Image(systemName: "chevron.right")
                    }
                }
                .padding(.horizontal)
                .padding(.top)
            }
            
            // (C) Основно съдържание (календар или SearchResults)
            if showSearchBar && !searchText.isEmpty {
                SearchResultsView(searchText: searchText)
            } else {
                // Примерно: WeekdayHeaderView() за "Mon, Tue, Wed..."
                WeekdayHeaderView()
                    .padding(.top, 8)
                
                let dates = calendar.generateDatesForMonthGrid(for: currentMonth)
                ScrollView {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 8) {
                        ForEach(dates, id: \.self) { day in
                            let dayKey = calendar.startOfDay(for: day)
                            // Тук очакваме viewModel.eventsByDay да връща [EKEvent]
                            let dayEvents = viewModel.eventsByDay[dayKey] ?? []
                            
                            DayCellView(
                                day: day,
                                currentMonth: currentMonth,
                                events: dayEvents,
                                onEventDropped: { eventID, newDay in
                                    handleEventDropped(eventID, on: newDay)
                                },
                                onDayTap: { tappedDay in
                                    // Пример: отваряме DayView на пълен екран
                                    selectedDayForFullScreen = tappedDay
                                },
                                onDayLongPress: { pressedDay in
                                    // Създаваме ново събитие
                                    createAndEditNewEvent(on: pressedDay)
                                },
                                onEventTap: { tappedEvent in
                                    // Показваме детайла
                                    eventToView = tappedEvent
                                }
                            )
                        }
                    }
                    .padding(.horizontal, 8)
                }
            }
        }
        .animation(.easeInOut, value: showSearchBar)
        .onAppear {
            // Зареждаме събития за текущия месец
            viewModel.loadEvents(for: currentMonth)
        }
        // (D) Toolbar: бутони за + / search / смяна на изглед
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                if !showSearchBar {
                    Button {
                        createAndEditNewEvent(on: Date())
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                if !showSearchBar {
                    Button {
                        showSearchBar = true
                    } label: {
                        Image(systemName: "magnifyingglass")
                    }
                }
            }
            ToolbarItem(placement: .navigationBarTrailing) {
                if !showSearchBar {
                    Menu {
                        Button { onViewChange?(1) } label: {
                            Label("Day", systemImage: (selectedTab == 1 ? "checkmark" : ""))
                        }
                        Button { onViewChange?(3) } label: {
                            Label("MultiDay", systemImage: (selectedTab == 3 ? "checkmark" : ""))
                        }
                        Button { onViewChange?(0) } label: {
                            Label("Month", systemImage: (selectedTab == 0 ? "checkmark" : ""))
                        }
                        Button { onViewChange?(2) } label: {
                            Label("Year", systemImage: (selectedTab == 2 ? "checkmark" : ""))
                        }
                        Button { onViewChange?(4) } label: {
                            Label("List", systemImage: (selectedTab == 4 ? "checkmark" : ""))
                        }
                        Button { onViewChange?(5) } label: {
                            Label("MultiCalendar", systemImage: (selectedTab == 5 ? "checkmark" : ""))
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        
        // (E) Full-screen cover за DayView (ако ползвате)
        .fullScreenCover(item: $selectedDayForFullScreen) { day in
            NavigationView {
                // Примерно TwoWayPinnedMultiDayWrapper...
                TwoWayPinnedMultiDayWrapper(
                    fromDate: .constant(day),
                    toDate: .constant(day),
                    events: $pinnedDayEvents,
                    eventStore: viewModel.eventStore,
                    isSingleDay: true,
                    selectedTab: selectedTab,
                    onViewChange: onViewChange
                ) { tappedDay in
                    selectedDayForFullScreen = tappedDay
                }
                .onAppear {
                    loadPinnedDayEvents(for: day)
                }
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Close") {
                            selectedDayForFullScreen = nil
                            viewModel.loadEvents(for: currentMonth)
                        }
                    }
                }
                .navigationTitle("Day View")
                .navigationBarTitleDisplayMode(.inline)
            }
        }
        
        // (F) Sheet за детайлен изглед (EKEventViewController)
        .sheet(item: $eventToView, onDismiss: {
            viewModel.loadEvents(for: currentMonth)
        }) { theEvent in
            EventDetailViewWrapper(event: theEvent)
        }
        
        // (G) Sheet за създаване/редакция (EKEventEditViewController)
        .sheet(item: $eventToEdit, onDismiss: {
            viewModel.loadEvents(for: currentMonth)
        }) { theEvent in
            EventEditViewWrapper(eventStore: viewModel.eventStore, event: theEvent)
        }
        
        // (H) Диалог за повтарящо се събитие (ако е drag & drop)
        .confirmationDialog("This is a repeating event.",
                            isPresented: $showRepeatingDialog,
                            titleVisibility: .visible) {
            Button("Save for This Event Only") {
                if let ev = repeatingEvent, let day = repeatingNewDate {
                    moveEvent(ev, to: day, span: .thisEvent)
                }
            }
            Button("Save for Future Events") {
                if let ev = repeatingEvent, let day = repeatingNewDate {
                    moveEvent(ev, to: day, span: .futureEvents)
                }
            }
            Button("Cancel", role: .cancel) {}
        }
    }
}

// MARK: - Помощни методи
extension MonthCalendarView {
    private func moveMonth(by offset: Int) {
        if let newMonth = calendar.date(byAdding: .month, value: offset, to: currentMonth) {
            currentMonth = newMonth
            viewModel.loadEvents(for: currentMonth)
        }
    }

    private func formattedMonthYear(_ date: Date) -> String {
        let df = DateFormatter()
        df.locale = Locale(identifier: "en_US")
        df.dateFormat = "LLLL yyyy"
        return df.string(from: date).capitalized
    }

    /// Логика за DRAG & DROP
    private func handleEventDropped(_ eventID: String, on newDate: Date) {
        guard let droppedEvent = viewModel.eventsByID[eventID] else { return }
        
        // Ако има recurrenceRules -> показваме диалог
        if droppedEvent.hasRecurrenceRules {
            repeatingEvent = droppedEvent
            repeatingNewDate = newDate
            showRepeatingDialog = true
        } else {
            moveEvent(droppedEvent, to: newDate, span: .thisEvent)
        }
    }

    /// Реално мести събитието в newDate, запазва го.
    private func moveEvent(_ event: EKEvent, to newDate: Date, span: EKSpan) {
        let cal = Calendar.current
        
        // Да запазим "продължителността" (end - start)
        let duration = event.endDate.timeIntervalSince(event.startDate)

        // Може да вземем (час:минути) от оригиналното начало
        let startHour = cal.component(.hour, from: event.startDate)
        let startMin = cal.component(.minute, from: event.startDate)

        // Нов старт: (newDate + startHour:startMin)
        guard let newStart = cal.date(bySettingHour: startHour, minute: startMin, second: 0, of: newDate)
        else {
            return
        }

        let newEnd = newStart.addingTimeInterval(duration)
        event.startDate = newStart
        event.endDate = newEnd

        do {
            try viewModel.eventStore.save(event, span: span, commit: true)
        } catch {
            print("Error saving event: \(error)")
        }

        viewModel.loadEvents(for: currentMonth)
    }

    /// Дълго задържане => създаване на ново събитие
    private func createAndEditNewEvent(on day: Date) {
        let status = EKEventStore.authorizationStatus(for: .event)
        
        if #available(iOS 17.0, *) {
            switch status {
            case .fullAccess, .writeOnly:
                presentNewEvent(on: day)
            case .notDetermined:
                print("Още не е поискан достъп.")
                // Може да извикате viewModel.requestCalendarAccessIfNeeded()
            default:
                print("Нямате достъп до календара.")
            }
        } else {
            if status == .authorized {
                presentNewEvent(on: day)
            } else if status == .notDetermined {
                print("Още не е поискан достъп.")
            } else {
                print("Нямате достъп до календара.")
            }
        }
    }
    
    private func presentNewEvent(on day: Date) {
        let cal = Calendar.current
        let startOfDay = cal.startOfDay(for: day)
        
        let newEvent = EKEvent(eventStore: viewModel.eventStore)
        newEvent.startDate = startOfDay.addingTimeInterval(9 * 3600)
        newEvent.endDate = startOfDay.addingTimeInterval(10 * 3600)
        newEvent.title = "New Event"
        newEvent.calendar = viewModel.eventStore.defaultCalendarForNewEvents
        
        // Пускаме sheet-a за редакция
        eventToEdit = newEvent
    }

    /// Зареждаме събития за DayView (ако ползвате TwoWayPinnedMultiDayWrapper)
    private func loadPinnedDayEvents(for day: Date) {
        let cal = Calendar.current
        let dayStart = cal.startOfDay(for: day)
        guard let nextDay = cal.date(byAdding: .day, value: 1, to: dayStart) else { return }
        
        let predicate = viewModel.eventStore.predicateForEvents(withStart: dayStart, end: nextDay, calendars: nil)
        let found = viewModel.eventStore.events(matching: predicate)
        
        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            let realStart = ekEvent.startDate ?? day
            let realEnd = ekEvent.endDate ?? day
            if realStart < dayStart || realEnd > nextDay {
                splitted.append(contentsOf: splitEventByDays(ekEvent, startRange: dayStart, endRange: nextDay))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        pinnedDayEvents = splitted
    }

    /// Примерен split по дни (ако преминава през полунощ)
    private func splitEventByDays(_ ekEvent: EKEvent,
                                  startRange: Date,
                                  endRange: Date) -> [EKMultiDayWrapper] {
        var results = [EKMultiDayWrapper]()
        let cal = Calendar.current
        let realStart = max(ekEvent.startDate ?? startRange, startRange)
        let realEnd = min(ekEvent.endDate ?? endRange, endRange)
        if realStart >= realEnd { return results }

        var currentStart = realStart
        while currentStart < realEnd {
            guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart) else { break }
            let pieceEnd = min(endOfDay, realEnd)
            let partial = EKMultiDayWrapper(realEvent: ekEvent, partialStart: currentStart, partialEnd: pieceEnd)
            results.append(partial)

            guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                  let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay)
            else { break }
            currentStart = morning
        }
        return results
    }
}
