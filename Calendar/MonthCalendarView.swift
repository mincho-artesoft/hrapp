//
//  MonthCalendarView.swift
//  ObservableCalendarDemo
//

import SwiftUI
import EventKit
import EventKitUI

struct MonthCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    @State private var currentMonth: Date = Date()
    
    // За Day View
    @State private var showDayView = false
    @State private var selectedDate: Date? = nil
    
    // За системния редактор (EKEventEditViewController)
    @State private var showEventEditor = false
    @State private var eventToEdit: EKEvent? = nil
    
    // За recurring събития:
    @State private var showRepeatingDialog = false
    @State private var repeatingEvent: EKEvent?
    @State private var repeatingNewDate: Date?
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        VStack {
            // Горната навигация (бутон назад/напред за месеци)
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
            
            // Генерираме 42 дати (6 реда по 7 колони)
            let dates = calendar.generateDatesForMonthGrid(for: currentMonth)
            
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 8) {
                ForEach(dates, id: \.self) { day in
                    let dayKey = calendar.startOfDay(for: day)
                    let dayEvents = viewModel.eventsByDay[dayKey] ?? []
                    
                    DayCellView(
                        day: day,
                        currentMonth: currentMonth,
                        events: dayEvents,
                        
                        // Drag & Drop
                        onEventDropped: { eventID, newDay in
                            handleEventDropped(eventID, on: newDay)
                        },
                        
                        // Tap на празен ден → Day View
                        onDayTap: { tappedDay in
                            if viewModel.isCalendarAccessGranted() {
                                selectedDate = tappedDay
                                showDayView = true
                            } else {
                                viewModel.requestCalendarAccessIfNeeded()
                            }
                        },
                        
                        // Long press → Ново събитие
                        onDayLongPress: { pressedDay in
                            createAndEditNewEvent(on: pressedDay)
                        },
                        
                        // Tap на събитие → системен редактор
                        onEventTap: { tappedEvent in
                            eventToEdit = tappedEvent
                            showEventEditor = true
                        }
                    )
                }
            }
            .padding(.horizontal, 8)
        }
        // При появяване на MonthCalendarView - презареждаме за текущия месец
        .onAppear {
            viewModel.loadEvents(for: currentMonth)
        }
        // Показваме Day View (CalendarKit) на цял екран
        .fullScreenCover(isPresented: $showDayView, onDismiss: {
            // Презареждаме след затваряне
            viewModel.loadEvents(for: currentMonth)
        }, content: {
            if let date = selectedDate {
                NavigationView {
                    CalendarViewControllerWrapper(selectedDate: date,
                                                  eventStore: viewModel.eventStore)
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
        })
        // Системен редактор (sheet)
        .sheet(isPresented: $showEventEditor, onDismiss: {
            // Презареждаме след затваряне
            viewModel.loadEvents(for: currentMonth)
        }, content: {
            if let ev = eventToEdit {
                EventEditViewWrapper(eventStore: viewModel.eventStore, event: ev)
            }
        })
        // Диалог за повтарящи се събития
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
    
    // Маркираме func за навигация по месеци
    private func moveMonth(by offset: Int) {
        if let newMonth = calendar.date(byAdding: .month, value: offset, to: currentMonth) {
            currentMonth = newMonth
            viewModel.loadEvents(for: currentMonth)
        }
    }
    
    // Форматиране на "септември 2025"
    private func formattedMonthYear(_ date: Date) -> String {
        let df = DateFormatter()
        df.locale = Locale(identifier: "en_US")
        df.dateFormat = "LLLL yyyy"
        return df.string(from: date).capitalized
    }
    
    // Drag & Drop
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
    
    // Местене на събитие към друга дата
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
            try viewModel.eventStore.save(event, span: span, commit: true)
        } catch {
            print("Error saving event: \(error)")
        }
        // Презареждане след местене
        viewModel.loadEvents(for: currentMonth)
    }
    
    // Създаване на ново събитие (long press)
    private func createAndEditNewEvent(on day: Date) {
        guard viewModel.isCalendarAccessGranted() else {
            viewModel.requestCalendarAccessIfNeeded()
            return
        }
        
        let newEvent = EKEvent(eventStore: viewModel.eventStore)
        let startOfDay = calendar.startOfDay(for: day)
        newEvent.startDate = startOfDay.addingTimeInterval(9 * 3600)  // 09:00
        newEvent.endDate   = startOfDay.addingTimeInterval(10 * 3600) // 10:00
        newEvent.title     = "New Event"
        newEvent.calendar  = viewModel.eventStore.defaultCalendarForNewEvents
        
        eventToEdit = newEvent
        showEventEditor = true
    }
}
