//
//  RootView.swift
//  ObservableCalendarDemo
//

import SwiftUI
import EventKit

struct RootView: View {
    @State private var selectedTab = 0
    
    // Един глобален EKEventStore за цялото приложение
    let eventStore = EKEventStore()
    
    // Единствен екземпляр на CalendarViewModel
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())
    
    var body: some View {
        NavigationView {
            VStack {
                Picker("Изглед", selection: $selectedTab) {
                    Text("Месец").tag(0)
                    Text("Ден").tag(1)
                }
                .pickerStyle(.segmented)
                .padding()

                // Смяна на изгледите
                switch selectedTab {
                case 0:
                    MonthCalendarView(viewModel: calendarVM)
                case 1:
                    DayCalendarWrapperView(eventStore: calendarVM.eventStore)
                default:
                    Text("Невалидна селекция")
                }
            }
            .navigationTitle("Calendar Demo")
        }
        .onAppear {
            // При първо стартиране искаме достъп до календара:
            calendarVM.requestCalendarAccessIfNeeded {
                // След заявка (или ако вече има разрешение),
                // зареждаме текущия месец
                calendarVM.loadEvents(for: Date())
            }
        }
    }
}
