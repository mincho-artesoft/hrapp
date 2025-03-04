import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    
    // Вместо bool, използваме Date? като "item" за fullScreenCover
    @State private var tappedMonthDate: Date? = nil
    
    var body: some View {
        GeometryReader { geometry in
            // Ако ширината е по-голяма от височината => Landscape => 3 колони,
            // иначе => Portrait => 2 колони.
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
                    // Тук подаваме columns, които създадохме по-горе
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
                    MonthCalendarView(viewModel: viewModel, startMonth: monthStart)
                        .toolbar {
                            ToolbarItem(placement: .navigationBarTrailing) {
                                Button("Close") {
                                    tappedMonthDate = nil
                                    // По желание може да презаредим годишните събития
                                    viewModel.loadEventsForWholeYear(year: year)
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
