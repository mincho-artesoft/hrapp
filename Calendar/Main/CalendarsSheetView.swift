import SwiftUI
import EventKit

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    // Показваме ли Add/Edit sheet
    @State private var showAddCalendarView = false
    @State private var calendarToEdit: EKCalendar? = nil

    // За разгръщане на секциите
    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    // "On My iPhone"
                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(viewModel.allCalendars.filter { $0.source.sourceType == .local },
                                id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                // Вече гледаме директно viewModel.selectedCalendarIDs
                                isSelected: viewModel.selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar,
                                editAction: {
                                    calendarToEdit = cal
                                }
                            )
                        }
                    }

                    // "Other"
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
                    trailing:
                        Button("Done") {
                            presentationMode.wrappedValue.dismiss()
                        }
                )

                // Долни бутони "Add Calendar" и "Hide All"
                HStack {
                    Button("Add Calendar") {
                        showAddCalendarView = true
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
            // Когато отворим листа, презареждаме текущия списък календари
            viewModel.reloadCalendars()
        }
        // Sheet за Add
        .sheet(isPresented: $showAddCalendarView, onDismiss: {
            // Когато AddCalendarView се затвори
            viewModel.reloadCalendars()
        }) {
            AddCalendarView()
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
