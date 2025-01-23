//
//  RootView.swift
//  ObservableCalendarDemo
//

import SwiftUI
import EventKit

struct RootView: View {
    @State private var selectedTab = 0
    
    /// Един глобален EKEventStore за цялото приложение
    let eventStore = EKEventStore()
    
    /// Единствен екземпляр на CalendarViewModel, който държи и презарежда събития
    @StateObject private var calendarVM = CalendarViewModel(eventStore: EKEventStore())
    
    var body: some View {
        NavigationView {
            VStack {
                // Сегментиран контрол: Месец / Ден
                Picker("Изглед", selection: $selectedTab) {
                    Text("Месец").tag(0)
                    Text("Ден").tag(1)
                }
                .pickerStyle(.segmented)
                .padding()

                // Показваме или MonthCalendarView, или DayCalendarWrapperView
                switch selectedTab {
                case 0:
                    // Предаваме ViewModel, за да може да чете/пише събития
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
            // При първо стартиране проверяваме достъпа до календара
            calendarVM.requestCalendarAccessIfNeeded {
                // Ако вече има достъп (или го получим току-що), зареждаме събития
                // примерно за текущия месец
                calendarVM.loadEvents(for: Date())
            }
        }
    }
}
