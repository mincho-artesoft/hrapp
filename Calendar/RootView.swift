//
//  RootView.swift
//  ObservableCalendarDemo
//

import SwiftUI
import EventKit

struct RootView: View {
    @State private var selectedTab = 0
    
    let eventStore = EKEventStore()
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())
    
    var body: some View {
        NavigationView {
            VStack {
                Picker("Изглед", selection: $selectedTab) {
                    Text("Месец").tag(0)
                    Text("Ден").tag(1)
                    Text("Година").tag(2)  // <-- нов таб
                }
                .pickerStyle(.segmented)
                .padding()

                switch selectedTab {
                case 0:
                    MonthCalendarView(viewModel: calendarVM, startMonth: Date())
                case 1:
                    DayCalendarWrapperView(eventStore: calendarVM.eventStore)
                case 2:
                    // Тук викаме годишния изглед
                    YearCalendarView(viewModel: calendarVM)
                default:
                    Text("Невалидна селекция")
                }
            }
            .navigationTitle("Calendar Demo")
        }
        .onAppear {
            // Искаме достъп до календара (ако не е даден)
            calendarVM.requestCalendarAccessIfNeeded {
                // Зареждаме си каквото ни трябва, напр. текущ месец
                calendarVM.loadEvents(for: Date())
            }
        }
    }
}
