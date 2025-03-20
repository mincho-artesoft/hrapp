import SwiftUI
import EventKit
import GoogleSignIn
import GoogleSignInSwift

struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    // За разгъване на DisclosureGroup
    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true

    // За Edit
    @State private var calendarToEdit: EKCalendar? = nil


    let clientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"

    var body: some View {
        NavigationView {
            VStack {
                Form {
                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(
                            viewModel.allCalendars.filter { cal in
                                cal.source.sourceType == .local
                            },
                            id: \.calendarIdentifier
                        ) { cal in
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
                        ForEach(
                            viewModel.allCalendars.filter { $0.source.sourceType != .local },
                            id: \.calendarIdentifier
                        ) { cal in
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

                // Долни бутони
                HStack {
                    Menu("Add Calendar") {
                        Button("Add Local Calendar") {
                            // тук може да отвориш някакъв sheet за създаване на локален календар
                            // или директно да вмъкнеш логиката
                        }
                        // Махаме "Add Integrated Calendar" понеже вече го правим горе
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
        // Sheet за Edit (EventKit календар)
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

