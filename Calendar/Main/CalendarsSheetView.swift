import SwiftUI
import EventKit

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    // За разгъване на DisclosureGroup
    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true

    // Кое sheet да покажем (nil, ако не искаме да показваме sheet)
    @State private var sheetType: AddCalendarSheetType? = nil

    // За Edit
    @State private var calendarToEdit: EKCalendar? = nil

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(viewModel.allCalendars.filter { $0.source.sourceType == .local },
                                id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    calendarToEdit = cal
                                }
                            )
                        }
                    }
                    
                    DisclosureGroup("Other", isExpanded: $isOtherExpanded) {
                        ForEach(viewModel.allCalendars.filter { $0.source.sourceType != .local },
                                id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
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
                    trailing: Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
                )
                
                // Долни бутони "Add Calendar" (Menu) и "Hide All"
                HStack {
                    // Заменяме Button("Add Calendar") с Menu("Add Calendar")
                    Menu("Add Calendar") {
                        Button("Add Local Calendar") {
                            // При избор на „Add Local Calendar“ показваме sheet за локален календар
                            sheetType = .local
                        }
                        
                        Button("Add Integrated Calendar") {
                            // При избор на „Add Integrated Calendar“ показваме sheet за интеграция
                            sheetType = .integration
                        }
                    }
                    .padding(.leading)
                    
                    Spacer()
                    
                    Button("Hide All") {
                        viewModel.selectedCalendarIDs.removeAll()
                    }
                    .padding(.trailing)
                }
                .padding(.vertical, 8)
            }
        }
        .onAppear {
            viewModel.reloadCalendars()
        }
        // Sheet за Add (local или интеграция)
        .sheet(item: $sheetType, onDismiss: {
            viewModel.reloadCalendars()
        }) { type in
            switch type {
            case .local:
                AddCalendarView()
            case .integration:
                AddIntegrationView()
            }
        }
        // Sheet за Edit
        .sheet(item: $calendarToEdit, onDismiss: {
            viewModel.reloadCalendars()
        }) { cal in
            EditCalendarView(eventStore: viewModel.eventStore, calendar: cal)
        }
    }
    
    private func toggleCalendar(_ cal: EKCalendar) {
        if viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier) {
            viewModel.selectedCalendarIDs.remove(cal.calendarIdentifier)
        } else {
            viewModel.selectedCalendarIDs.insert(cal.calendarIdentifier)
        }
    }
}


