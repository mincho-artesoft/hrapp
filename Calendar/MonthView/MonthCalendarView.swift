import SwiftUI
import EventKit
import EventKitUI

struct MonthCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    var startMonth: Date
    var selectedTab: Int
    var onViewChange: ((Int) -> Void)?
    
    @State private var eventToView: EKEvent? = nil
    @State private var eventToEdit: EKEvent? = nil
    
    @State private var showRepeatingDialog = false
    @State private var repeatingEvent: EKEvent? = nil
    @State private var repeatingNewDate: Date? = nil
    
    @State private var selectedDayForFullScreen: Date? = nil
    @State private var pinnedDayEvents: [EventDescriptor] = []
    
    @State private var currentMonth: Date
    
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
            // (A) Търсачка
            if showSearchBar {
                HStack {
                    TextField(LocalizedStringKey("Search events..."), text: $searchText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.leading)
                    
                    Button(LocalizedStringKey("Cancel")) {
                        showSearchBar = false
                        searchText = ""
                    }
                    .padding(.trailing)
                }
                .padding(.vertical, 8)
                .background(.thinMaterial)
                .transition(.move(edge: .top))
            }
            
            // (B) Навигация за месеца
            if !(showSearchBar && !searchText.isEmpty) {
                HStack {
                    Button {
                        moveMonth(by: -1)
                    } label: {
                        Image(systemName: "chevron.left")
                    }
                    
                    Text(localizedFormattedMonthYear(currentMonth))
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
            
            // (C) Основно съдържание
            if showSearchBar && !searchText.isEmpty {
                SearchResultsView(searchText: searchText)
            } else {
                WeekdayHeaderView()
                    .padding(.top, 8)
                
                let dates = calendar.generateDatesForMonthGrid(for: currentMonth)
                ScrollView {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 8) {
                        ForEach(dates, id: \.self) { day in
                            let dayKey = calendar.startOfDay(for: day)
                            let dayEvents = viewModel.eventsByDay[dayKey] ?? []
                            
                            DayCellView(
                                day: day,
                                currentMonth: currentMonth,
                                events: dayEvents,
                                onEventDropped: { eventID, newDay in
                                    handleEventDropped(eventID, on: newDay)
                                },
                                onDayTap: { tappedDay in
                                    selectedDayForFullScreen = tappedDay
                                },
                                onDayLongPress: { pressedDay in
                                    createAndEditNewEvent(on: pressedDay)
                                },
                                onEventTap: { tappedEvent in
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
        // (D) Toolbar
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                HStack(spacing: 9) {
                    if !showSearchBar {
                        
                        // Бутон "+"
                        Button {
                            createAndEditNewEvent(on: Date())
                        } label: {
                            Image(systemName: "plus")
                        }
                        
                        // Бутон за търсене
                        Button {
                            showSearchBar = true
                        } label: {
                            Image(systemName: "magnifyingglass")
                        }
                        
                        // Меню за смяна на изгледите (Day, MultiDay, Month, Year, List, MultiCalendar)
                        Menu {
                            // --- Day ---
                            Button {
                                onViewChange?(1)
                            } label: {
                                HStack {
                                    // Checkmark вляво, ако selectedTab == 1
                                    if selectedTab == 1 {
                                        Image(systemName: "checkmark")
                                    } else {
                                        Image(systemName: "checkmark").opacity(0)
                                    }
                                    
                                    // Заглавие
                                    Text(localizedTabName("Day"))
                                    
                                    // Spacer избутва иконката вдясно
                                    Spacer()
                                    
                                    // Иконка вдясно
                                    Image(systemName: iconName(for: 1))
                                }
                            }
                            
                            // --- MultiDay ---
                            Button {
                                onViewChange?(3)
                            } label: {
                                HStack {
                                    if selectedTab == 3 {
                                        Image(systemName: "checkmark")
                                    } else {
                                        Image(systemName: "checkmark").opacity(0)
                                    }
                                    Text(localizedTabName("MultiDay"))
                                    Spacer()
                                    Image(systemName: iconName(for: 3))
                                }
                            }
                            
                            // --- Month ---
                            Button {
                                onViewChange?(0)
                            } label: {
                                HStack {
                                    if selectedTab == 0 {
                                        Image(systemName: "checkmark")
                                    } else {
                                        Image(systemName: "checkmark").opacity(0)
                                    }
                                    Text(localizedTabName("Month"))
                                    Spacer()
                                    Image(systemName: iconName(for: 0))
                                }
                            }
                            
                            // --- Year ---
                            Button {
                                onViewChange?(2)
                            } label: {
                                HStack {
                                    if selectedTab == 2 {
                                        Image(systemName: "checkmark")
                                    } else {
                                        Image(systemName: "checkmark").opacity(0)
                                    }
                                    Text(localizedTabName("Year"))
                                    Spacer()
                                    Image(systemName: iconName(for: 2))
                                }
                            }
                            
                            // --- List ---
                            Button {
                                onViewChange?(4)
                            } label: {
                                HStack {
                                    if selectedTab == 4 {
                                        Image(systemName: "checkmark")
                                    } else {
                                        Image(systemName: "checkmark").opacity(0)
                                    }
                                    Text(localizedTabName("List"))
                                    Spacer()
                                    Image(systemName: iconName(for: 4))
                                }
                            }
                            
                            // --- MultiCalendar ---
                            Button {
                                onViewChange?(5)
                            } label: {
                                HStack {
                                    if selectedTab == 5 {
                                        Image(systemName: "checkmark")
                                    } else {
                                        Image(systemName: "checkmark").opacity(0)
                                    }
                                    Text(localizedTabName("MultiCalendar"))
                                    Spacer()
                                    Image(systemName: iconName(for: 5))
                                }
                            }
                            
                        } label: {
                            // Главна иконка в самия Toolbar
                            Image(systemName: iconName(for: selectedTab))
                        }
                    }
                }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        
        // (E) Full-screen cover (DayView)
        .fullScreenCover(item: $selectedDayForFullScreen) { day in
            NavigationView {
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
                        Button(LocalizedStringKey("Close")) {
                            selectedDayForFullScreen = nil
                            viewModel.loadEvents(for: currentMonth)
                        }
                    }
                }
                .navigationTitle(LocalizedStringKey("Day View"))
                .navigationBarTitleDisplayMode(.inline)
            }
        }
        
        // (F) Sheet за детайлен изглед
        .sheet(item: $eventToView, onDismiss: {
            viewModel.loadEvents(for: currentMonth)
        }) { theEvent in
            EventDetailViewWrapper(event: theEvent)
        }
        
        // (G) Sheet за създаване/редакция
        .sheet(item: $eventToEdit, onDismiss: {
            viewModel.loadEvents(for: currentMonth)
        }) { theEvent in
            EventEditViewWrapper(eventStore: viewModel.eventStore, event: theEvent)
        }
        
        // (H) Диалог за повтарящо се събитие
        .confirmationDialog(LocalizedStringKey("This is a repeating event."),
                            isPresented: $showRepeatingDialog,
                            titleVisibility: .visible) {
            Button(LocalizedStringKey("Save for This Event Only")) {
                if let ev = repeatingEvent, let day = repeatingNewDate {
                    moveEvent(ev, to: day, span: .thisEvent)
                }
            }
            Button(LocalizedStringKey("Save for Future Events")) {
                if let ev = repeatingEvent, let day = repeatingNewDate {
                    moveEvent(ev, to: day, span: .futureEvents)
                }
            }
            Button(LocalizedStringKey("Cancel"), role: .cancel) {}
        }
    }
}

// MARK: - Помощни методи
extension MonthCalendarView {
    private func localizedTabName(_ rawValue: String) -> String {
        return NSLocalizedString(rawValue, comment: "")
    }
    
    private func iconName(for tab: Int) -> String {
        switch tab {
        case 1:
            return "calendar.day.timeline.leading"
        case 3:
            return "distribute.horizontal.left"
        case 0:
            return "calendar"
        case 2:
            return "12.lane"
        case 4:
            return "list.bullet"
        case 5:
            return "align.vertical.top"
        default:
            return "calendar"
        }
    }
    
    private func moveMonth(by offset: Int) {
        if let newMonth = calendar.date(byAdding: .month, value: offset, to: currentMonth) {
            currentMonth = newMonth
            viewModel.loadEvents(for: currentMonth)
        }
    }

    /// Локализиран формат за месец/година според езика на системата
    private func localizedFormattedMonthYear(_ date: Date) -> String {
        let df = DateFormatter()
        df.locale = Locale.current
        df.setLocalizedDateFormatFromTemplate("yyyyMMMM")
        return df.string(from: date)
    }

    private func handleEventDropped(_ eventID: String, on newDate: Date) {
        guard let droppedEvent = viewModel.eventsByID[eventID] else { return }
        
        if droppedEvent.hasRecurrenceRules {
            repeatingEvent = droppedEvent
            repeatingNewDate = newDate
            showRepeatingDialog = true
        } else {
            moveEvent(droppedEvent, to: newDate, span: .thisEvent)
        }
    }

    private func moveEvent(_ event: EKEvent, to newDate: Date, span: EKSpan) {
        let cal = Calendar.current
        let duration = event.endDate.timeIntervalSince(event.startDate)
        let startHour = cal.component(.hour, from: event.startDate)
        let startMin = cal.component(.minute, from: event.startDate)
        
        guard let newStart = cal.date(bySettingHour: startHour, minute: startMin, second: 0, of: newDate) else {
            return
        }
        
        let newEnd = newStart.addingTimeInterval(duration)
        event.startDate = newStart
        event.endDate = newEnd

        do {
            try viewModel.eventStore.save(event, span: span, commit: true)
        } catch {
            print("Error saving event: \(error.localizedDescription)")
        }

        viewModel.loadEvents(for: currentMonth)
    }

    private func createAndEditNewEvent(on day: Date) {
        let status = EKEventStore.authorizationStatus(for: .event)
        
        if #available(iOS 17.0, *) {
            switch status {
            case .fullAccess, .writeOnly:
                presentNewEvent(on: day)
            case .notDetermined:
                print("Още не е поискан достъп.")
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
        newEvent.title = NSLocalizedString("New Event", comment: "Default title for newly created events")
        newEvent.calendar = viewModel.eventStore.defaultCalendarForNewEvents
        
        eventToEdit = newEvent
    }

    private func loadPinnedDayEvents(for day: Date) {
        let cal = Calendar.current
        let dayStart = cal.startOfDay(for: day)
        guard let nextDay = cal.date(byAdding: .day, value: 1, to: dayStart) else { return }
        
        let predicate = viewModel.eventStore.predicateForEvents(withStart: dayStart, end: nextDay, calendars: nil)
        let found = viewModel.eventStore.events(matching: predicate)
        
        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            let realStart = ekEvent.startDate
            let realEnd = ekEvent.endDate
            if let rs = realStart, let re = realEnd, (rs < dayStart || re > nextDay) {
                splitted.append(contentsOf: splitEventByDays(ekEvent, startRange: dayStart, endRange: nextDay))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        pinnedDayEvents = splitted
    }

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
            let partial = EKMultiDayWrapper(realEvent: ekEvent,
                                            partialStart: currentStart,
                                            partialEnd: pieceEnd)
            results.append(partial)

            guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                  let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay)
            else { break }
            currentStart = morning
        }
        return results
    }
}
