//
//  DayCalendarWrapperView.swift
//  ExampleCalendarApp
//
//  SwiftUI View, което „обвива“ CalendarViewController (DayViewController от CalendarKit).
//

import SwiftUI
import EventKit
import CalendarKit

struct DayCalendarWrapperView: View {
    let eventStore: EKEventStore
    @State private var date = Date()
    
    var body: some View {
        CalendarViewControllerWrapper(selectedDate: date, eventStore: eventStore)
            .navigationTitle("Day View")
            .navigationBarTitleDisplayMode(.inline)
    }
}
