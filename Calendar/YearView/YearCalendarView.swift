import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    // Ако искате автоматично да вземете "текущата" година:
    private let year: Int = Calendar.current.component(.year, from: Date())
    
    @State private var showMonthView = false
    @State private var tappedMonthDate: Date?
    
    // Примерно 2 колони (по 6 месеца в колона)
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    var body: some View {
        VStack {
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
                        // Увеличете, ако искате повече място
                        .frame(width: 200, height: 260)
                        .background(Color(.systemGray6))
                        .cornerRadius(12)
                    }
                }
                .padding()
            }
        }
        // Когато показваме годишния изглед – винаги зареждаме цялата година
        .onAppear {
            viewModel.loadEventsForWholeYear(year: year)
        }
        // Когато затворим (onDismiss) екрана с месец
        .fullScreenCover(isPresented: $showMonthView, onDismiss: {
            // Презареждаме цялата година
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
