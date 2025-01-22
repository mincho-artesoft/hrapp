//
//  CalendarContainerView.swift
//  hrapp
//

import SwiftUI

struct CalendarContainerView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    // The user’s current date selection
    @State var selectedDate: Date = Date()
    
    // The display mode
    @State var displayMode: CalendarDisplayMode = .month
    
    // Working hours
    @State var startHour: Int = 8
    @State var endHour: Int = 17
    @State var slotMinutes: Int = 30
    
    // For highlight
    @State private var highlightedEventID: UUID? = nil
    
    var body: some View {
        NavigationStack {
            VStack {
                calendarNavigationBar
                Divider()
                
                switch displayMode {
                case .day:
                    CalendarDayView(
                        viewModel: viewModel,
                        selectedDate: $selectedDate,
                        startHour: startHour,
                        endHour: endHour,
                        slotMinutes: slotMinutes,
                        highlightedEventID: $highlightedEventID
                    )
                case .week:
                    CalendarWeekView(
                        viewModel: viewModel,
                        selectedDate: $selectedDate,
                        startHour: startHour,
                        endHour: endHour,
                        slotMinutes: slotMinutes,
                        highlightedEventID: $highlightedEventID
                    )
                case .month:
                    CalendarMonthView(
                        viewModel: viewModel,
                        selectedDate: $selectedDate,
                        highlightedEventID: $highlightedEventID
                    )
                case .year:
                    CalendarYearView(
                        viewModel: viewModel,
                        selectedDate: $selectedDate,
                        highlightedEventID: $highlightedEventID
                    )
                }
            }
            .navigationTitle(navigationTitle(for: displayMode, date: selectedDate))
        }
    }
    
    // MARK: - Top Bar
    
    private var calendarNavigationBar: some View {
        HStack {
            Button(action: { stepBackward() }) {
                Image(systemName: "chevron.left")
            }
            Spacer()
            Picker("Mode", selection: $displayMode) {
                ForEach(CalendarDisplayMode.allCases, id: \.self) { mode in
                    Text(mode.rawValue.capitalized).tag(mode)
                }
            }
            .pickerStyle(.segmented)
            Spacer()
            Button(action: { stepForward() }) {
                Image(systemName: "chevron.right")
            }
        }
        .padding(.horizontal)
    }
    
    private func navigationTitle(for mode: CalendarDisplayMode, date: Date) -> String {
        let df = DateFormatter()
        switch mode {
        case .day:
            df.dateFormat = "EEEE, MMM d, yyyy"
        case .week:
            df.dateFormat = "'Week of' MMM d, yyyy"
        case .month:
            df.dateFormat = "LLLL yyyy"
        case .year:
            df.dateFormat = "yyyy"
        }
        return df.string(from: date)
    }
    
    // MARK: - Navigation
    
    private func stepBackward() {
        let cal = Calendar.current
        switch displayMode {
        case .day:
            selectedDate = cal.date(byAdding: .day, value: -1, to: selectedDate) ?? selectedDate
        case .week:
            selectedDate = cal.date(byAdding: .day, value: -7, to: selectedDate) ?? selectedDate
        case .month:
            selectedDate = cal.date(byAdding: .month, value: -1, to: selectedDate) ?? selectedDate
        case .year:
            selectedDate = cal.date(byAdding: .year, value: -1, to: selectedDate) ?? selectedDate
        }
    }
    
    private func stepForward() {
        let cal = Calendar.current
        switch displayMode {
        case .day:
            selectedDate = cal.date(byAdding: .day, value: 1, to: selectedDate) ?? selectedDate
        case .week:
            selectedDate = cal.date(byAdding: .day, value: 7, to: selectedDate) ?? selectedDate
        case .month:
            selectedDate = cal.date(byAdding: .month, value: 1, to: selectedDate) ?? selectedDate
        case .year:
            selectedDate = cal.date(byAdding: .year, value: 1, to: selectedDate) ?? selectedDate
        }
    }
}
