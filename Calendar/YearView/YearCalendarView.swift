import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    // Вместо да е фиксиран, го правим @State, за да го променяме
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    
    @State private var showMonthView = false
    @State private var tappedMonthDate: Date?
    
    // Две колони (примерно)
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    var body: some View {
        VStack {
            // Горната "лента" за избор на година
            HStack {
                Button(action: {
                    // Минаваме 1 година назад
                    year -= 1
                    viewModel.loadEventsForWholeYear(year: year)
                }) {
                    Image(systemName: "chevron.left")
                }
                
                Text(year, format: .number.grouping(.never))
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                
                Button(action: {
                    // Минаваме 1 година напред
                    year += 1
                    viewModel.loadEventsForWholeYear(year: year)
                }) {
                    Image(systemName: "chevron.right")
                }
            }
            .padding(.horizontal)
            
            ScrollView {
                LazyVGrid(columns: columns, spacing: 16) {
                    ForEach(1...12, id: \.self) { monthIndex in
                        let dateForMonth = dateFromYearMonth(year, monthIndex)
                        
                        YearMonthMiniView(
                            monthDate: dateForMonth,
                            eventsByDay: viewModel.eventsByDay
                        ) { tappedMonth in
                            tappedMonthDate = tappedMonth
                            showMonthView = true
                        }
                        .frame(width: 200, height: 260)
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                    }
                }
                .padding()
            }
        }
        // Когато го покажем за първи път
        .onAppear {
            viewModel.loadEventsForWholeYear(year: year)
        }
        // Когато затворим екрана за месеца
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
