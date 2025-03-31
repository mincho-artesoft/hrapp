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
                    // (LOC) Тук локализираме Placeholder-а
                    TextField(LocalizedStringKey("Search events..."), text: $searchText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.leading)
                    
                    // (LOC) Локализиран бутон „Cancel“
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
                        // (LOC) Бутон "+"
                        Button {
                            createAndEditNewEvent(on: Date())
                        } label: {
                            Image(systemName: "plus")
                        }
                        
                        // (LOC) Бутон за търсене
                        Button {
                            showSearchBar = true
                        } label: {
                            Image(systemName: "magnifyingglass")
                        }
                        
                        // (LOC) Меню за смяна на изгледите (Day, MultiDay, Month, Year, List, MultiCalendar)
                        Menu {
                            Button {
                                onViewChange?(1)
                            } label: {
                                Label(localizedTabName("Day"), systemImage: selectedTab == 1 ? "checkmark" : "")
                            }
                            Button {
                                onViewChange?(3)
                            } label: {
                                Label(localizedTabName("MultiDay"), systemImage: selectedTab == 3 ? "checkmark" : "")
                            }
                            Button {
                                onViewChange?(0)
                            } label: {
                                Label(localizedTabName("Month"), systemImage: selectedTab == 0 ? "checkmark" : "")
                            }
                            Button {
                                onViewChange?(2)
                            } label: {
                                Label(localizedTabName("Year"), systemImage: selectedTab == 2 ? "checkmark" : "")
                            }
                            Button {
                                onViewChange?(4)
                            } label: {
                                Label(localizedTabName("List"), systemImage: selectedTab == 4 ? "checkmark" : "")
                            }
                            Button {
                                onViewChange?(5)
                            } label: {
                                Label(localizedTabName("MultiCalendar"), systemImage: selectedTab == 5 ? "checkmark" : "")
                            }
                        } label: {
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
                    // (LOC) Бутон за затваряне
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button(LocalizedStringKey("Close")) {
                            selectedDayForFullScreen = nil
                            viewModel.loadEvents(for: currentMonth)
                        }
                    }
                }
                // (LOC) Заглавие „Day View“
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
        // (LOC) "This is a repeating event."
        .confirmationDialog(LocalizedStringKey("This is a repeating event."),
                            isPresented: $showRepeatingDialog,
                            titleVisibility: .visible) {
            // (LOC) "Save for This Event Only"
            Button(LocalizedStringKey("Save for This Event Only")) {
                if let ev = repeatingEvent, let day = repeatingNewDate {
                    moveEvent(ev, to: day, span: .thisEvent)
                }
            }
            // (LOC) "Save for Future Events"
            Button(LocalizedStringKey("Save for Future Events")) {
                if let ev = repeatingEvent, let day = repeatingNewDate {
                    moveEvent(ev, to: day, span: .futureEvents)
                }
            }
            // (LOC) "Cancel"
            Button(LocalizedStringKey("Cancel"), role: .cancel) {}
        }
    }
}

// MARK: - Помощни методи
extension MonthCalendarView {
    // (LOC) Функция за локализиране на имената на табовете
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

    private func localizedFormattedMonthYear(_ date: Date) -> String {
        let df = DateFormatter()
        // Ползваме текущия език на устройството
        df.locale = Locale.current
        
        // Локализиран формат "ММММ yyyy" (система сама адаптира към език/регион)
        // Може да използвате setLocalizedDateFormatFromTemplate("yyyyMMMM")
        // или направо да зададете "LLLL yyyy"
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
                print("Още не е поискан достъп.") // (LOC) при желание
            default:
                print("Нямате достъп до календара.") // (LOC)
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
        newEvent.title = NSLocalizedString("New Event", comment: "Default title for newly created events") // (LOC)
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
