//
//  FullCalendarContainer.swift
//  HR
//
//  Created by Mincho Milev on 1/21/25.
//

import SwiftUI
import Combine

/// The different view modes (Month, Week, Day, List, Resource Timeline)
enum CalendarDisplayMode: String, CaseIterable, Identifiable {
    case month = "Month"
    case week = "Week"
    case day = "Day"
    case list = "List"
    case resourceTimeline = "Resources"
    
    var id: String { self.rawValue }
}

struct FullCalendarContainer: View {
    @StateObject var viewModel = CalendarViewModel()
    
    @State private var selectedDate = Date()
    @State private var displayMode: CalendarDisplayMode = .month
    
    @State private var editingEvent: CalendarEvent? = nil
    
    private let calendar = Calendar.current
    
    var body: some View {
        NavigationStack {
            VStack {
                // Top control bar
                HStack {
                    Button(action: goToPrevious) {
                        Image(systemName: "chevron.left")
                    }
                    Spacer()
                    Button("Today") {
                        selectedDate = Date()
                    }
                    Spacer()
                    Button(action: goToNext) {
                        Image(systemName: "chevron.right")
                    }
                }
                .padding(.horizontal)
                
                // Display mode switcher
                HStack {
                    Text(displayMode.rawValue)
                        .font(.headline)
                    Spacer()
                    Picker("View", selection: $displayMode) {
                        ForEach(CalendarDisplayMode.allCases) { mode in
                            Text(mode.rawValue).tag(mode)
                        }
                    }
                    .pickerStyle(.segmented)
                }
                .padding(.horizontal)
                
                Divider()
                
                // Main content (using a dedicated @ViewBuilder func)
                mainContent()
            }
            .navigationTitle(formattedDate(selectedDate))
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        // Create a new empty event at the currently selected date
                        let newEvent = CalendarEvent(
                            title: "",
                            start: selectedDate,
                            end: selectedDate.addingTimeInterval(3600) // +1 hour
                        )
                        editingEvent = newEvent
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            // Present the form in a sheet
            .sheet(item: $editingEvent) { event in
                CalendarEventFormView(
                    viewModel: viewModel,
                    event: event,
                    isNew: !viewModel.events.contains(event)
                )
            }
        }
    }
    
    // MARK: - Main Content
    
    /// By wrapping this switch in a @ViewBuilder function, we avoid type-inference problems.
    @ViewBuilder
    private func mainContent() -> some View {
        switch displayMode {
        case .month:
            MonthCalendarView(
                selectedDate: $selectedDate,
                viewModel: viewModel,
                onEventDoubleTap: { event in
                    editingEvent = event
                },
                onEventDrop: { eventID, day in
                    // Move event to that day as all-day
                    viewModel.moveEvent(withID: eventID, to: day, allDay: true)
                }
            )
            
        case .week:
            WeekCalendarView(
                selectedDate: $selectedDate,
                viewModel: viewModel,
                onEventDoubleTap: { event in
                    editingEvent = event
                },
                onEventDrop: { eventID, newStart in
                    // Move event to the newStart with an hour-based drop
                    viewModel.moveEvent(withID: eventID, to: newStart, allDay: false)
                }
            )
            
        case .day:
            DayCalendarView(
                selectedDate: $selectedDate,
                viewModel: viewModel,
                onEventDoubleTap: { event in
                    editingEvent = event
                },
                onEventDrop: { eventID, newStart in
                    // For day view, we also treat it as time-based
                    viewModel.moveEvent(withID: eventID, to: newStart, allDay: false)
                }
            )
            
        case .list:
            ListCalendarView(
                selectedDate: $selectedDate,
                viewModel: viewModel,
                onEventDoubleTap: { event in
                    editingEvent = event
                }
            )
            
        case .resourceTimeline:
            ResourceTimelineView(
                resources: viewModel.resources,
                events: viewModel.events, // or your expanded repeats if you prefer
                selectedDate: $selectedDate,
                onEventDoubleTap: { event in
                    editingEvent = event
                }
            )
        }
    }
    
    // MARK: - Navigation Helpers
    
    private func goToPrevious() {
        switch displayMode {
        case .month:
            if let newDate = calendar.date(byAdding: .month, value: -1, to: selectedDate) {
                selectedDate = newDate
            }
        case .week:
            if let newDate = calendar.date(byAdding: .day, value: -7, to: selectedDate) {
                selectedDate = newDate
            }
        case .day:
            if let newDate = calendar.date(byAdding: .day, value: -1, to: selectedDate) {
                selectedDate = newDate
            }
        case .list, .resourceTimeline:
            if let newDate = calendar.date(byAdding: .day, value: -1, to: selectedDate) {
                selectedDate = newDate
            }
        }
    }
    
    private func goToNext() {
        switch displayMode {
        case .month:
            if let newDate = calendar.date(byAdding: .month, value: 1, to: selectedDate) {
                selectedDate = newDate
            }
        case .week:
            if let newDate = calendar.date(byAdding: .day, value: 7, to: selectedDate) {
                selectedDate = newDate
            }
        case .day:
            if let newDate = calendar.date(byAdding: .day, value: 1, to: selectedDate) {
                selectedDate = newDate
            }
        case .list, .resourceTimeline:
            if let newDate = calendar.date(byAdding: .day, value: 1, to: selectedDate) {
                selectedDate = newDate
            }
        }
    }
    
    private func formattedDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        switch displayMode {
        case .month:
            formatter.dateFormat = "LLLL yyyy"
        case .week:
            formatter.dateFormat = "'Week of' MMM d, yyyy"
        case .day, .list, .resourceTimeline:
            formatter.dateFormat = "EEEE, MMM d, yyyy"
        }
        return formatter.string(from: date)
    }
}
