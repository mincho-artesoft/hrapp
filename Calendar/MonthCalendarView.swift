import SwiftUI
import EventKit

struct MonthCalendarView: View {
    @State private var currentMonth: Date = Date()
    @State private var eventsByDay: [Date: [EKEvent]] = [:]
    @State private var eventsByID: [String: EKEvent] = [:]
    
    // Управление на диалога за повтарящо се събитие
    @State private var showRepeatingDialog = false
    @State private var repeatingEvent: EKEvent?
    @State private var repeatingNewDate: Date?
    
    let eventStore: EKEventStore
    let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        VStack {
            // Бутоните за предишен/следващ месец
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
            
            // Самата решетка (6 реда x 7 колони = 42 дни)
            let dates = calendar.generateDatesForMonthGrid(for: currentMonth)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 8) {
                ForEach(dates, id: \.self) { day in
                    let dayEvents = eventsByDay[calendar.startOfDay(for: day)] ?? []
                    
                    DayCellView(
                        day: day,
                        currentMonth: currentMonth,
                        events: dayEvents
                    ) { droppedEventID, targetDay in
                        // При drop извикваме handleEventDropped
                        handleEventDropped(droppedEventID, on: targetDay)
                    }
                }
            }
            .padding(.horizontal, 8)
        }
        .onAppear {
            requestCalendarAccessIfNeeded()
            loadEvents()
        }
        
        // MARK: - Диалог за Repeating Event
        .confirmationDialog(
            "This is a repeating event",
            isPresented: $showRepeatingDialog,
            actions: {
                Button("Save for This Event Only") {
                    if let ev = repeatingEvent, let targetDay = repeatingNewDate {
                        moveEvent(ev, to: targetDay, span: .thisEvent)
                    }
                }
                Button("Save for Future Events") {
                    if let ev = repeatingEvent, let targetDay = repeatingNewDate {
                        moveEvent(ev, to: targetDay, span: .futureEvents)
                    }
                }
                Button("Cancel", role: .cancel) {}
            },
            message: {
                Text("Choose which events you want to change.")
            }
        )
    }
}

// MARK: - Методи в MonthCalendarView

extension MonthCalendarView {
    private func requestCalendarAccessIfNeeded() {
        let status = EKEventStore.authorizationStatus(for: .event)
        
        guard status == .notDetermined else { return }
        
        if #available(iOS 17.0, *) {
            eventStore.requestFullAccessToEvents { granted, error in
                if granted && error == nil {
                    loadEvents()
                }
            }
        } else {
            eventStore.requestAccess(to: .event) { granted, error in
                if granted && error == nil {
                    loadEvents()
                }
            }
        }
    }
    
    private func loadEvents() {
        eventsByDay = eventStore.fetchEventsByDay(for: currentMonth, calendar: calendar)
        
        var dict: [String: EKEvent] = [:]
        for dayEvents in eventsByDay.values {
            for ev in dayEvents {
                dict[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = dict
    }
    
    private func moveMonth(by offset: Int) {
        if let newMonth = calendar.date(byAdding: .month, value: offset, to: currentMonth) {
            currentMonth = newMonth
            loadEvents()
        }
    }
    
    private func formattedMonthYear(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US") // или "bg_BG", ако желаете
        formatter.dateFormat = "LLLL yyyy"
        return formatter.string(from: date).capitalized
    }
    
    /// При дроп на eventID в DayCellView (ден)
    private func handleEventDropped(_ eventID: String, on newDate: Date) {
        guard let droppedEvent = eventsByID[eventID] else { return }
        
        // Ако НЕ е recurring => местим веднага (span: .thisEvent)
        if !droppedEvent.hasRecurrenceRules {
            moveEvent(droppedEvent, to: newDate, span: .thisEvent)
        } else {
            // Ако е recurring => отваряме диалог (thisEvent or futureEvents)
            repeatingEvent = droppedEvent
            repeatingNewDate = newDate
            showRepeatingDialog = true
        }
    }
    
    /// Мести конкретен event към новия ден, запазва същите часове,
    /// и при save ползва дадения EKSpan (thisEvent или futureEvents).
    private func moveEvent(_ event: EKEvent, to newDate: Date, span: EKSpan) {
        let oldStart = event.startDate!
        let oldEnd   = event.endDate
        
        let startTime = calendar.dateComponents([.hour, .minute, .second], from: oldStart)
        let endTime   = calendar.dateComponents([.hour, .minute, .second], from: oldEnd!)
        
        let newDay = calendar.startOfDay(for: newDate)
        
        let newStart = calendar.date(byAdding: startTime, to: newDay) ?? newDate
        let newEnd   = calendar.date(byAdding: endTime, to: newDay) ?? newDate
        
        event.startDate = newStart
        event.endDate   = newEnd
        
        do {
            try eventStore.save(event, span: span, commit: true)
            print("Event moved to \(newDate) with span \(span)")
        } catch {
            print("Error saving event: \(error)")
        }
        
        // Презареждаме
        loadEvents()
    }
}
