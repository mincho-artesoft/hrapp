import SwiftUI
import EventKit

struct MonthCalendarView: View {
    @State private var currentMonth: Date = Date()
    
    @State private var eventsByDay: [Date: [EKEvent]] = [:]
    @State private var eventsByID: [String: EKEvent] = [:]
    
    // За диалога при recurring
    @State private var showRepeatingDialog = false
    @State private var repeatingEvent: EKEvent?
    @State private var repeatingNewDate: Date?
    
    // За отваряне на Day View
    @State private var showDayView = false
    @State private var selectedDate: Date? = nil
    
    let eventStore: EKEventStore
    let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        VStack {
            // --- Навигация между месеци ---
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
            
            // --- Ред с дните от седмицата ---
            WeekdayHeaderView()
                .padding(.top, 8)
            
            // --- 42 клетки (6 реда x 7 колони) ---
            let dates = calendar.generateDatesForMonthGrid(for: currentMonth)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 8) {
                ForEach(dates, id: \.self) { day in
                    let dayEvents = eventsByDay[calendar.startOfDay(for: day)] ?? []
                    
                    DayCellView(
                        day: day,
                        currentMonth: currentMonth,
                        events: dayEvents
                    ) { droppedEventID, targetDay in
                        handleEventDropped(droppedEventID, on: targetDay)
                    }
                    .onTapGesture {
                        // 1) Проверяваме дали имаме календарен достъп
                        if isCalendarAccessGranted() {
                            // Ако имаме => отваряме Day View
                            selectedDate = day
                            showDayView = true
                        } else {
                            // Ако не е => искаме го
                            requestCalendarAccessIfNeeded()
                        }
                    }
                }
            }
            .padding(.horizontal, 8)
        }
        .onAppear {
            requestCalendarAccessIfNeeded()
            loadEvents()
        }
        // --- Диалог за recurring събития (This Event Only / Future Events) ---
        .confirmationDialog(
            "This is a repeating event.",
            isPresented: $showRepeatingDialog
        ) {
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
        // --- Day View на цял екран (fullScreenCover) ---
        .fullScreenCover(isPresented: $showDayView) {
            if let date = selectedDate {
                NavigationView {
                    CalendarViewControllerWrapper(selectedDate: date)
                        // Бутон за "Close" горе вдясно
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
    }
}

// MARK: - Вътрешни методи на MonthCalendarView
extension MonthCalendarView {
    /// Проверяваме дали вече имаме разрешен достъп
    private func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        
        if #available(iOS 17.0, *) {
            return (status == .fullAccess)
        } else {
            return (status == .authorized)
        }
    }
    
    /// Искаме достъп, ако не е даден. След като бъде даден (или отказан), можем да load-нем събития
    private func requestCalendarAccessIfNeeded() {
        let status = EKEventStore.authorizationStatus(for: .event)
        
        // Ако вече е даден или отказан, не правим нищо
        // (Може да сложите проверка за .denied, да показвате съобщение да иде в Settings и т.н.)
        guard status == .notDetermined else { return }
        
        if #available(iOS 17.0, *) {
            eventStore.requestFullAccessToEvents { granted, error in
                if granted && error == nil {
                    DispatchQueue.main.async {
                        self.loadEvents()
                    }
                }
            }
        } else {
            eventStore.requestAccess(to: .event) { granted, error in
                if granted && error == nil {
                    DispatchQueue.main.async {
                        self.loadEvents()
                    }
                }
            }
        }
    }
    
    /// Зареждаме събитията за currentMonth, групирано по ден
    private func loadEvents() {
        eventsByDay = eventStore.fetchEventsByDay(for: currentMonth, calendar: calendar)
        
        var tmp: [String: EKEvent] = [:]
        for dayEvents in eventsByDay.values {
            for ev in dayEvents {
                tmp[ev.eventIdentifier] = ev
            }
        }
        eventsByID = tmp
    }
    
    private func moveMonth(by offset: Int) {
        if let newMonth = calendar.date(byAdding: .month, value: offset, to: currentMonth) {
            currentMonth = newMonth
            loadEvents()
        }
    }
    
    private func formattedMonthYear(_ date: Date) -> String {
        let df = DateFormatter()
        df.locale = Locale(identifier: "en_US") // или "bg_BG"
        df.dateFormat = "LLLL yyyy"
        return df.string(from: date).capitalized
    }
    
    /// При drag & drop на събитие (eventID) в даден ден
    private func handleEventDropped(_ eventID: String, on newDate: Date) {
        guard let droppedEvent = eventsByID[eventID] else { return }
        
        // Ако е recurring -> диалог
        if droppedEvent.hasRecurrenceRules {
            repeatingEvent = droppedEvent
            repeatingNewDate = newDate
            showRepeatingDialog = true
        } else {
            // Non-recurring => местим директно
            moveEvent(droppedEvent, to: newDate, span: .thisEvent)
        }
    }
    
    /// Променяме датата (деня) на събитието, но запазваме часа. span => .thisEvent / .futureEvents
    private func moveEvent(_ event: EKEvent, to newDate: Date, span: EKSpan) {
        guard let oldStart = event.startDate,
              let oldEnd = event.endDate
        else { return }
        
        let startComponents = calendar.dateComponents([.hour, .minute, .second], from: oldStart)
        let endComponents   = calendar.dateComponents([.hour, .minute, .second], from: oldEnd)
        
        let newDay = calendar.startOfDay(for: newDate)
        let newStart = calendar.date(byAdding: startComponents, to: newDay) ?? newDate
        let newEnd   = calendar.date(byAdding: endComponents, to: newDay) ?? newDate
        
        event.startDate = newStart
        event.endDate   = newEnd
        
        do {
            try eventStore.save(event, span: span, commit: true)
            print("Moved event to \(newDate) with span=\(span)")
        } catch {
            print("Error saving event: \(error)")
        }
        
        loadEvents()
    }
}
