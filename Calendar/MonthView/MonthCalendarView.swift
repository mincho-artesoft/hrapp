import SwiftUI
import EventKit
import EventKitUI
import UniformTypeIdentifiers

struct MonthCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    /// Начална дата за този месец (напр. 1-ви януари)
    var startMonth: Date
    
    /// Вместо Bool `showDayView`, ще използваме Date? като "item"
    @State private var selectedDayForFullScreen: Date? = nil
    
    /// Вместо Bool `showEventEditor`, директно ползваме eventToEdit = EKEvent?
    @State private var eventToEdit: EKEvent? = nil
    
    // За recurring събития
    @State private var showRepeatingDialog = false
    @State private var repeatingEvent: EKEvent?
    @State private var repeatingNewDate: Date?
    
    @State private var currentMonth: Date

    private let calendar = Calendar(identifier: .gregorian)
    
    init(viewModel: CalendarViewModel, startMonth: Date) {
        self.viewModel = viewModel
        self.startMonth = startMonth
        _currentMonth = State(initialValue: startMonth)
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
            
            let dates = calendar.generateDatesForMonthGrid(for: currentMonth)

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
                                // Вместо showDayView = true -> задаваме selectedDayForFullScreen
                                selectedDayForFullScreen = tappedDay
                            } else {
                                viewModel.requestCalendarAccessIfNeeded {
                                    // Ако получите достъп, може пак да зададете selectedDayForFullScreen
                                }
                            }
                        },
                        onDayLongPress: { pressedDay in
                            createAndEditNewEvent(on: pressedDay)
                        },
                        onEventTap: { tappedEvent in
                            // Вместо showEventEditor = true, директно задаваме eventToEdit
                            eventToEdit = tappedEvent
                        }
                    )
                }
            }
            .padding(.horizontal, 8)
        }
        // Ако искате всеки път да презареждате само този месец
        .onAppear {
            viewModel.loadEvents(for: currentMonth)
        }
        
        // Показваме Day View (CalendarKit) като fullScreenCover
        // Вече item: $selectedDayForFullScreen, така че се показва още първия път
        .fullScreenCover(item: $selectedDayForFullScreen) { day in
            NavigationView {
                // Тук вашият CalendarKit вю контролер
                CalendarViewControllerWrapper(selectedDate: day,
                                              eventStore: viewModel.eventStore)
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Close") {
                                selectedDayForFullScreen = nil
                                // По желание презаредете събития
                                viewModel.loadEvents(for: currentMonth)
                            }
                        }
                    }
                    .navigationTitle("Day View")
                    .navigationBarTitleDisplayMode(.inline)
            }
        }
        
        // Системният редактор за EKEvent
        // Вместо .sheet(isPresented: $showEventEditor), ползваме .sheet(item: $eventToEdit)
        .sheet(item: $eventToEdit) { event in
            EventEditViewWrapper(eventStore: viewModel.eventStore, event: event)
        }
        
        // Диалог за многократни (recurring) събития
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
    }
    
    // Смяна на месеца
    private func moveMonth(by offset: Int) {
        if let newMonth = calendar.date(byAdding: .month, value: offset, to: currentMonth) {
            currentMonth = newMonth
            viewModel.loadEvents(for: currentMonth)
        }
    }
    
    private func formattedMonthYear(_ date: Date) -> String {
        let df = DateFormatter()
        df.locale = Locale(identifier: "en_US")
        df.dateFormat = "LLLL yyyy" // January 2025
        return df.string(from: date).capitalized
    }
    
    // Drag&Drop на събитие
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
    
    // Преместване на събитие
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
    
    // Създаваме ново събитие с long press
    private func createAndEditNewEvent(on day: Date) {
        let status = EKEventStore.authorizationStatus(for: .event)
        
        if #available(iOS 17.0, *), status == .fullAccess {
            presentNewEvent(on: day)
        } else if status == .authorized {
            presentNewEvent(on: day)
        } else if status == .notDetermined {
            viewModel.requestCalendarAccessIfNeeded {
                if viewModel.isCalendarAccessGranted() {
                    self.presentNewEvent(on: day)
                }
            }
        } else {
            // denied / restricted
            print("No calendar access.")
        }
    }
    
    private func presentNewEvent(on day: Date) {
        let newEvent = EKEvent(eventStore: viewModel.eventStore)
        let cal = Calendar.current
        
        let startOfDay = cal.startOfDay(for: day)
        newEvent.startDate = startOfDay.addingTimeInterval(9 * 3600)   // 09:00
        newEvent.endDate   = startOfDay.addingTimeInterval(10 * 3600)  // 10:00
        newEvent.title     = "New Event"
        newEvent.calendar  = viewModel.eventStore.defaultCalendarForNewEvents
        
        eventToEdit = newEvent
    }
}
