//
//  hrappApp.swift
//  hrapp
//

import SwiftUI

@main
struct hrappApp: App {
    @StateObject var viewModel = CalendarViewModel()
        @State var selectedDate = Date()
        @State var highlightedEventID: UUID? = nil
        
        var body: some Scene {
            WindowGroup {
                CalendarDayView(
                    viewModel: viewModel,
                    selectedDate: $selectedDate,
                    startHour: 8,
                    endHour: 17,
                    slotMinutes: 30,
                    highlightedEventID: $highlightedEventID
                )
            }
        }
}
