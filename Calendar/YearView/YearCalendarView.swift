import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    // CHANGES
    var selectedTab: Int
    var onViewChange: ((Int)->Void)?
    
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    @State private var tappedMonthDate: Date? = nil
    
    var body: some View {
        GeometryReader { geometry in
            let isLandscape = geometry.size.width > geometry.size.height
            let columns = isLandscape
                ? [GridItem(.flexible(), spacing: 16),
                   GridItem(.flexible(), spacing: 16),
                   GridItem(.flexible(), spacing: 16)]
                : [GridItem(.flexible(), spacing: 16),
                   GridItem(.flexible(), spacing: 16)]
            
            VStack {
                // Горна лента
                HStack {
                    Button(action: {
                        year -= 1
                        viewModel.loadEventsForWholeYear(year: year)
                    }) {
                        Image(systemName: "chevron.left")
                    }
                    
                    Text(String(year))
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                    
                    Button(action: {
                        year += 1
                        viewModel.loadEventsForWholeYear(year: year)
                    }) {
                        Image(systemName: "chevron.right")
                    }
                }
                .padding(.horizontal)
                
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 32) {
                        ForEach(1...12, id: \.self) { monthIndex in
                            let dateForMonth = dateFromYearMonth(year, monthIndex)
                            
                            YearMonthMiniView(
                                monthDate: dateForMonth,
                                eventsByDay: viewModel.eventsByDay
                            ) { tappedMonth in
                                tappedMonthDate = tappedMonth
                            }
                            .padding(16)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                }
            }
            .onAppear {
                viewModel.loadEventsForWholeYear(year: year)
            }
            // Показваме MonthCalendarView като fullScreenCover, когато tappedMonthDate != nil
            .fullScreenCover(item: $tappedMonthDate) { monthStart in
                NavigationView {
                    MonthCalendarView(
                        viewModel: viewModel,
                        startMonth: monthStart,
                        
                        selectedTab: selectedTab,     // CHANGES
                        onViewChange: onViewChange    // CHANGES
                    )
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Close") {
                                tappedMonthDate = nil
                                viewModel.loadEventsForWholeYear(year: year)
                            }
                        }
                    }
                }
            }
            // CHANGES: Three-dot menu
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button {
                            onViewChange?(1) // Day
                        } label: {
                            Label("Day", systemImage: selectedTab == 1 ? "checkmark" : "")
                        }
                        Button {
                            onViewChange?(3) // MultiDay
                        } label: {
                            Label("MultiDay", systemImage: selectedTab == 3 ? "checkmark" : "")
                        }
                        Button {
                            onViewChange?(0) // Month
                        } label: {
                            Label("Month", systemImage: selectedTab == 0 ? "checkmark" : "")
                        }
                        Button {
                            onViewChange?(2) // Year
                        } label: {
                            Label("Year", systemImage: selectedTab == 2 ? "checkmark" : "")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
        }
    }
    
    private func dateFromYearMonth(_ year: Int, _ month: Int) -> Date {
        var comp = DateComponents()
        comp.year = year
        comp.month = month
        comp.day = 1
        return Calendar.current.date(from: comp) ?? Date()
    }
}
