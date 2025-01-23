import SwiftUI
import EventKit

struct MonthCalendarView: View {
    @State private var currentMonth: Date = Date()

    @State private var eventsByDay: [Date: [EKEvent]] = [:]
    @State private var eventsByID: [String: EKEvent] = [:]

    // За recurring събития:
    @State private var showRepeatingDialog = false
    @State private var repeatingEvent: EKEvent?
    @State private var repeatingNewDate: Date?

    // За Day View
    @State private var showDayView = false
    @State private var selectedDate: Date? = nil

    // За системния редактор (EKEventEditViewController)
    @State private var showEventEditor = false
    @State private var eventToEdit: EKEvent? = nil

    let eventStore: EKEventStore
    let calendar = Calendar(identifier: .gregorian)

    var body: some View {
        VStack {
            // Навигация за месеци
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

            // Ред с дните от седмицата
            WeekdayHeaderView()
                .padding(.top, 8)

            // Генерираме 42 дати (6x7)
            let dates = calendar.generateDatesForMonthGrid(for: currentMonth)

            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 8) {
                ForEach(dates, id: \.self) { day in
                    // Събития за този ден
                    let dayEvents = eventsByDay[calendar.startOfDay(for: day)] ?? []

                    DayCellView(
                        day: day,
                        currentMonth: currentMonth,
                        events: dayEvents,

                        // 1) Drag & Drop
                        onEventDropped: { eventID, newDay in
                            handleEventDropped(eventID, on: newDay)
                        },

                        // 2) Tap на празен ден → Day View
                        onDayTap: { tappedDay in
                            if isCalendarAccessGranted() {
                                selectedDate = tappedDay
                                showDayView = true
                            } else {
                                requestCalendarAccessIfNeeded()
                            }
                        },

                        // 3) Long press → ново събитие
                        onDayLongPress: { pressedDay in
                            createAndEditNewEvent(on: pressedDay)
                        },

                        // 4) Tap на събитие → системен редактор
                        onEventTap: { tappedEvent in
                            eventToEdit = tappedEvent
                            showEventEditor = true
                        }
                    )
                }
            }
            .padding(.horizontal, 8)
        }
        .onAppear {
            requestCalendarAccessIfNeeded()
            loadEvents()
        }
        // Автоматично презареждане при промени в EventKit
        .onReceive(NotificationCenter.default.publisher(for: .EKEventStoreChanged)) { _ in
            loadEvents()
        }
        // Диалог за recurring събитие
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
        // Пълноекранен Day View (CalendarKit)
        .fullScreenCover(isPresented: $showDayView, onDismiss: {
            // <-- добавено onDismiss
            // След като Day View се затвори, презареждаме
            loadEvents()
        }) {
            if let date = selectedDate {
                NavigationView {
                    CalendarViewControllerWrapper(selectedDate: date,
                                                  eventStore: eventStore)
                        .toolbar {
                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button("Close") {
                                    showDayView = false
                                }
                            }
                        }
                        .navigationTitle("Day View")
                        .navigationBarTitleDisplayMode(.inline)
                }
            }
        }
        // System Event Editor (sheet)
        .sheet(isPresented: $showEventEditor, onDismiss: {
            // При затваряне на системния редактор също презареждаме
            loadEvents()
        }) {
            if let ev = eventToEdit {
                EventEditViewWrapper(eventStore: eventStore, event: ev)
            }
        }
    }
}

extension MonthCalendarView {
    private func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            return (status == .fullAccess)
        } else {
            return (status == .authorized)
        }
    }

    private func requestCalendarAccessIfNeeded() {
        let status = EKEventStore.authorizationStatus(for: .event)
        guard status == .notDetermined else { return }

        if #available(iOS 17.0, *) {
            eventStore.requestFullAccessToEvents { granted, error in
                if granted && error == nil {
                    DispatchQueue.main.async {
                        loadEvents()
                    }
                }
            }
        } else {
            eventStore.requestAccess(to: .event) { granted, error in
                if granted && error == nil {
                    DispatchQueue.main.async {
                        loadEvents()
                    }
                }
            }
        }
    }

    private func loadEvents() {
        if isCalendarAccessGranted() {
            eventsByDay = eventStore.fetchEventsByDay(for: currentMonth, calendar: calendar)

            var tmp: [String: EKEvent] = [:]
            for dayList in eventsByDay.values {
                for ev in dayList {
                    tmp[ev.eventIdentifier] = ev
                }
            }
            eventsByID = tmp
        } else {
            eventsByDay.removeAll()
            eventsByID.removeAll()
        }
    }

    private func moveMonth(by offset: Int) {
        if let newMonth = calendar.date(byAdding: .month, value: offset, to: currentMonth) {
            currentMonth = newMonth
            loadEvents()
        }
    }

    private func formattedMonthYear(_ date: Date) -> String {
        let df = DateFormatter()
        df.locale = Locale(identifier: "en_US")
        df.dateFormat = "LLLL yyyy"
        return df.string(from: date).capitalized
    }

    private func handleEventDropped(_ eventID: String, on newDate: Date) {
        guard let droppedEvent = eventsByID[eventID] else { return }

        if droppedEvent.hasRecurrenceRules {
            repeatingEvent = droppedEvent
            repeatingNewDate = newDate
            showRepeatingDialog = true
        } else {
            moveEvent(droppedEvent, to: newDate, span: .thisEvent)
        }
    }

    private func moveEvent(_ event: EKEvent, to newDate: Date, span: EKSpan) {
        guard let oldStart = event.startDate, let oldEnd = event.endDate else { return }

        let startComp = calendar.dateComponents([.hour, .minute, .second], from: oldStart)
        let endComp   = calendar.dateComponents([.hour, .minute, .second], from: oldEnd)

        let newDay    = calendar.startOfDay(for: newDate)
        let newStart  = calendar.date(byAdding: startComp, to: newDay) ?? newDate
        let newEnd    = calendar.date(byAdding: endComp, to: newDay)   ?? newDate

        event.startDate = newStart
        event.endDate   = newEnd

        do {
            try eventStore.save(event, span: span, commit: true)
        } catch {
            print("Error saving event: \(error)")
        }
        loadEvents()
    }

    private func createAndEditNewEvent(on day: Date) {
        guard isCalendarAccessGranted() else {
            requestCalendarAccessIfNeeded()
            return
        }

        let newEvent = EKEvent(eventStore: eventStore)
        let startOfDay = calendar.startOfDay(for: day)
        newEvent.startDate = startOfDay.addingTimeInterval(9 * 3600)  // 09:00
        newEvent.endDate   = startOfDay.addingTimeInterval(10 * 3600) // 10:00
        newEvent.title     = "New Event"
        newEvent.calendar  = eventStore.defaultCalendarForNewEvents

        eventToEdit = newEvent
        showEventEditor = true
    }
}
