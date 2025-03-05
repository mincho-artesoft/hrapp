//
//  CalendarsSheetView.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 5/3/25.
//



import SwiftUI
import EventKit

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    @State private var selectedCalendarIDs: Set<String> = []
    
    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true

    // Показваме ли Add/Edit?
    @State private var showAddCalendarView = false
    @State private var calendarToEdit: EKCalendar? = nil // за sheet

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    // ГРУПА "On My iPhone"
                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(viewModel.allCalendars.filter { $0.source.sourceType == .local },
                                id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    calendarToEdit = cal
                                }
                            )
                        }
                    }

                    // ГРУПА "Other"
                    DisclosureGroup("Other", isExpanded: $isOtherExpanded) {
                        ForEach(viewModel.allCalendars.filter { $0.source.sourceType != .local },
                                id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    calendarToEdit = cal
                                }
                            )
                        }
                    }
                }
                .navigationBarTitle("Calendars", displayMode: .inline)
                .navigationBarItems(
                    trailing:
                        Button("Done") {
                            presentationMode.wrappedValue.dismiss()
                        }
                )

                // Долни бутони "Add Calendar" / "Hide All"
                HStack {
                    Button("Add Calendar") {
                        showAddCalendarView = true
                    }
                    .padding(.leading)

                    Spacer()

                    Button("Hide All") {
                        selectedCalendarIDs.removeAll()
                    }
                    .padding(.trailing)
                }
                .padding(.vertical, 8)
            }
        }
        // Когато View се появи, зареждаме списъка с календари
        .onAppear {
            viewModel.reloadCalendars()
            
            // За по-лесно: селектираме всички (пример)
            let allIDs = viewModel.allCalendars.map { $0.calendarIdentifier }
            self.selectedCalendarIDs = Set(allIDs)
        }

        // Sheet за Add:
        .sheet(isPresented: $showAddCalendarView, onDismiss: {
            // Когато AddCalendarView се затвори:
            viewModel.reloadCalendars()
        }) {
            AddCalendarView()
        }
        
        // Sheet за Edit:
        .sheet(item: $calendarToEdit, onDismiss: {
            // Когато EditCalendarView се затвори:
            viewModel.reloadCalendars()
        }) { cal in
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
    }

    private func toggleCalendar(_ cal: EKCalendar) {
        if selectedCalendarIDs.contains(cal.calendarIdentifier) {
            selectedCalendarIDs.remove(cal.calendarIdentifier)
        } else {
            selectedCalendarIDs.insert(cal.calendarIdentifier)
        }
    }
}
