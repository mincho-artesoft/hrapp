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
    
    // Тук пазим събитията (EventDescriptor) за конкретния ден,
    // които подаваме на TwoWayPinnedWeekWrapper.
    @State private var pinnedDayEvents: [EventDescriptor] = []
    
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
            
            // Генерираме всички дати за показване в мрежата 7x6 (или 7x5) за месеца
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
                                // Ако нямате достъп:
                                // await viewModel.requestCalendarAccessIfNeeded()
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
        // Презареждаме събитията за текущия месец при onAppear:
        .onAppear {
            viewModel.loadEvents(for: currentMonth)
        }
        
        // Показваме Day View (fullScreenCover) -
        // TwoWayPinnedMultiDayWrapper вместо CalendarKit DayViewController.
        .fullScreenCover(item: $selectedDayForFullScreen) { day in
            NavigationView {
                TwoWayPinnedMultiDayWrapper(
                    fromDate: .constant(day),   // изглед от day до day (1 ден)
                    toDate: .constant(day),
                    events: $pinnedDayEvents,
                    eventStore: viewModel.eventStore,
                    isSingleDay: true
                ) { tappedDay in
                    // Ако кликнем друг ден, може да сменим selectedDayForFullScreen
                    selectedDayForFullScreen = tappedDay
                }
                .onAppear {
                    // Зареждаме събитията за този конкретен ден
                    loadPinnedDayEvents(for: day)
                }
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Close") {
                            selectedDayForFullScreen = nil
                            // По желание, презаредете събитията на месеца
                            viewModel.loadEvents(for: currentMonth)
                        }
                    }
                }
                .navigationTitle("Day View")
                .navigationBarTitleDisplayMode(.inline)
            }
        }
        
        // Системният редактор за EKEvent (sheet)
        .sheet(item: $eventToEdit, onDismiss: {
            // ВАЖНО: презареждаме събитията, когато редакторът се затвори
            viewModel.loadEvents(for: currentMonth)
        }) { event in
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
        df.dateFormat = "LLLL yyyy" // "January 2025"
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
        // Презареждаме:
        viewModel.loadEvents(for: currentMonth)
    }
    
    // Създаваме ново събитие с long press
    private func createAndEditNewEvent(on day: Date) {
        let status = EKEventStore.authorizationStatus(for: .event)
        
        if #available(iOS 17.0, *) {
            // iOS 17+: Check for either full access or write-only access.
            switch status {
            case .fullAccess, .writeOnly:
                presentNewEvent(on: day)
            case .notDetermined:
                // Може да поискате достъп, ако желаете (async/await)
                print("TODO: requestCalendarAccessIfNeeded()")
            default:
                print("No calendar access.")
            }
        } else {
            // Pre-iOS 17: Use the old .authorized status.
            if status == .authorized {
                presentNewEvent(on: day)
            } else if status == .notDetermined {
                // Може да поискате достъп, ако желаете
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
        newEvent.startDate = startOfDay.addingTimeInterval(9 * 3600)   // 09:00
        newEvent.endDate   = startOfDay.addingTimeInterval(10 * 3600)  // 10:00
        newEvent.title     = "New Event"
        newEvent.calendar  = viewModel.eventStore.defaultCalendarForNewEvents
        
        // Отваряме новото събитие за редакция
        eventToEdit = newEvent
    }
    
    // Зареждаме EKEvent-и като EventDescriptor, за да ги подадем на TwoWayPinnedWeekWrapper.
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
        
        // Ако събитията минават отвъд един ден, може да ги "раздробите"
        // с допълнителна логика (splitEventByDays). Тук е пример:
        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            let realStart = ekEvent.startDate
            let realEnd   = ekEvent.endDate
            
            // Ако пресичат границата: ден/следващ, раздробяваме:
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
    
    /// Примерна функция за "раздробяване" на EKEvent, който прелива през няколко дни.
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
            else {
                break
            }
            let pieceEnd = min(endOfDay, realEnd)
            
            let partial = EKMultiDayWrapper(
                realEvent: ekEvent,
                partialStart: currentStart,
                partialEnd: pieceEnd
            )
            results.append(partial)
            
            guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                  let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay)
            else {
                break
            }
            currentStart = morning
        }
        
        return results
    }
}
