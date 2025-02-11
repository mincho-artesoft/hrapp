import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    @State private var showMonthView = false
    @State private var tappedMonthDate: Date?
    
    // 1) Указваме spacing в самите GridItem (това е разстоянието между колоните)
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    var body: some View {
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
                // 2) Увеличаваме `spacing` тук за да имаме повече вертикално разстояние между редовете
                LazyVGrid(columns: columns, spacing: 32) {
                    ForEach(1...12, id: \.self) { monthIndex in
                        let dateForMonth = dateFromYearMonth(year, monthIndex)
                        
                        YearMonthMiniView(
                            monthDate: dateForMonth,
                            eventsByDay: viewModel.eventsByDay
                        ) { tappedMonth in
                            tappedMonthDate = tappedMonth
                            showMonthView = true
                        }
                        // 3) Може да добавите и padding около всяко мини-каре
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
        .fullScreenCover(isPresented: $showMonthView, onDismiss: {
            viewModel.loadEventsForWholeYear(year: year)
        }) {
            if let monthStart = tappedMonthDate {
                NavigationView {
                    MonthCalendarView(viewModel: viewModel, startMonth: monthStart)
                        .toolbar {
                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button("Close") {
                                    showMonthView = false
                                }
                            }
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
