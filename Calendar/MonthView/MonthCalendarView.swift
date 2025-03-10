import SwiftUI
import EventKit
import EventKitUI

struct MonthCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    /// Начална дата за този месец
    var startMonth: Date
    
    /// Кое "tab" е в момента (0=Month)
    var selectedTab: Int                    // CHANGES
    
    /// Смяна на екрана оттук
    var onViewChange: ((Int)->Void)?        // CHANGES
    
    // Вместо Bool `showDayView`, ще използваме Date? като "item"
    @State private var selectedDayForFullScreen: Date? = nil
    
    // Вместо Bool `showEventEditor`, директно `eventToEdit`
    @State private var eventToEdit: EKEvent? = nil
    
    // За recurring
    @State private var showRepeatingDialog = false
    @State private var repeatingEvent: EKEvent?
    @State private var repeatingNewDate: Date?
    
    @State private var currentMonth: Date
    
    private let calendar = Calendar(identifier: .gregorian)
    
    // Тук пазим събитията за конкретния ден
    @State private var pinnedDayEvents: [EventDescriptor] = []
    
    init(viewModel: CalendarViewModel, startMonth: Date,
         selectedTab: Int, // CHANGES
         onViewChange: ((Int)->Void)? // CHANGES
    ) {
        self.viewModel = viewModel
        self.startMonth = startMonth
        self._currentMonth = State(initialValue: startMonth)
        self.selectedTab = selectedTab // CHANGES
        self.onViewChange = onViewChange
    }
    
    var body: some View {
        VStack {
            // Навигация за месеца (ляво/дясно)
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
            
            WeekdayHeaderView()
                .padding(.top, 8)
            
            // Генерираме датите за месеца
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
                                if viewModel.isCalendarAccessGranted() {
                                    selectedDayForFullScreen = tappedDay
                                }
                            },
                            onDayLongPress: { pressedDay in
                                createAndEditNewEvent(on: pressedDay)
                            },
                            onEventTap: { tappedEvent in
                                eventToEdit = tappedEvent
                            }
                        )
                    }
                }
                .padding(.horizontal, 8)
            }
        }
        .onAppear {
            viewModel.loadEvents(for: currentMonth)
        }
        // fullScreenCover за DayView
        .fullScreenCover(item: $selectedDayForFullScreen) { day in
            NavigationView {
                TwoWayPinnedMultiDayWrapper(
                    fromDate: .constant(day),
                    toDate: .constant(day),
                    events: $pinnedDayEvents,
                    eventStore: viewModel.eventStore,
                    isSingleDay: true,
                    
                    // Pass current tab + callback
                    selectedTab: selectedTab,              // CHANGES
                    onViewChange: onViewChange             // CHANGES
                    
                ) { tappedDay in
                    // Ако кликнем друг ден, сменяме selectedDayForFullScreen
                    selectedDayForFullScreen = tappedDay
                }
                .onAppear {
                    loadPinnedDayEvents(for: day)
                }
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Close") {
                            selectedDayForFullScreen = nil
                            // По желание, презареждаме събитията на месеца
                            viewModel.loadEvents(for: currentMonth)
                        }
                    }
                }
                .navigationTitle("Day View")
                .navigationBarTitleDisplayMode(.inline)
            }
        }
        // System event editor
        .sheet(item: $eventToEdit, onDismiss: {
            viewModel.loadEvents(for: currentMonth)
        }) { event in
            EventEditViewWrapper(eventStore: viewModel.eventStore, event: event)
        }
        // Recurring dialog
        .confirmationDialog("This is a repeating event.", isPresented: $showRepeatingDialog) {
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
        // CHANGES: Three-dot menu in the nav bar
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Menu {
                    // Day
                    Button {
                        onViewChange?(1) // switch to Day
                    } label: {
                        Label("Day", systemImage: (selectedTab == 1 ? "checkmark" : ""))
                    }
                    // MultiDay
                    Button {
                        onViewChange?(3) // switch to MultiDay
                    } label: {
                        Label("MultiDay", systemImage: (selectedTab == 3 ? "checkmark" : ""))
                    }
                    // Month
                    Button {
                        // Already on Month (0), do nothing or re-trigger
                        onViewChange?(0)
                    } label: {
                        Label("Month", systemImage: (selectedTab == 0 ? "checkmark" : ""))
                    }
                    // Year
                    Button {
                        onViewChange?(2)
                    } label: {
                        Label("Year", systemImage: (selectedTab == 2 ? "checkmark" : ""))
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                }
            }
        }
    }
    
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
        guard let oldStart = event.startDate,
              let oldEnd = event.endDate else { return }
        
        let startComp = cal.dateComponents([.hour, .minute, .second], from: oldStart)
        let endComp   = cal.dateComponents([.hour, .minute, .second], from: oldEnd)
        
        let newDay    = cal.startOfDay(for: newDate)
        let newStart  = cal.date(byAdding: startComp, to: newDay) ?? newDate
        let newEnd    = cal.date(byAdding: endComp, to: newDay)   ?? newDate
        
        event.startDate = newStart
        event.endDate   = newEnd
        
        do {
            try viewModel.eventStore.save(event, span: span, commit: true)
        } catch {
            print("Error saving event: \(error)")
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
        let newEvent = EKEvent(eventStore: viewModel.eventStore)
        let cal = Calendar.current
        
        let startOfDay = cal.startOfDay(for: day)
        newEvent.startDate = startOfDay.addingTimeInterval(9 * 3600)
        newEvent.endDate   = startOfDay.addingTimeInterval(10 * 3600)
        newEvent.title     = "New Event"
        newEvent.calendar  = viewModel.eventStore.defaultCalendarForNewEvents
        
        eventToEdit = newEvent
    }
    
    private func loadPinnedDayEvents(for day: Date) {
        let cal = Calendar.current
        let dayStart = cal.startOfDay(for: day)
        guard let nextDay = cal.date(byAdding: .day, value: 1, to: dayStart) else { return }
        
        let predicate = viewModel.eventStore.predicateForEvents(
            withStart: dayStart,
            end: nextDay,
            calendars: nil
        )
        let found = viewModel.eventStore.events(matching: predicate)
        
        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            let realStart = ekEvent.startDate
            let realEnd   = ekEvent.endDate
            if realStart! < dayStart || realEnd! > nextDay {
                splitted.append(contentsOf: splitEventByDays(ekEvent,
                                                             startRange: dayStart,
                                                             endRange: nextDay))
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
        
        let realStart = max(ekEvent.startDate, startRange)
        let realEnd   = min(ekEvent.endDate, endRange)
        if realStart >= realEnd { return results }
        
        var currentStart = realStart
        while currentStart < realEnd {
            guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59,
                                          of: currentStart)
            else { break }
            let pieceEnd = min(endOfDay, realEnd)
            
            let partial = EKMultiDayWrapper(
                realEvent: ekEvent,
                partialStart: currentStart,
                partialEnd: pieceEnd
            )
            results.append(partial)
            
            guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                  let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay)
            else { break }
            currentStart = morning
        }
        
        return results
    }
}
