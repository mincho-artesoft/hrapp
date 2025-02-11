import SwiftUI
import EventKit

// MARK: - YearMonthMiniView
struct YearMonthMiniView: View {
    let monthDate: Date
    let eventsByDay: [Date: [EKEvent]]
    let onMonthTapped: (Date) -> Void
    
    private let calendar = Calendar(identifier: .gregorian)
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color(.systemGray6))
                .shadow(color: .black.opacity(0.05), radius: 5, x: 0, y: 2)
            
            VStack(spacing: 8) {
                // Заглавие на месеца (Jan, Feb...)
                Text(monthName(monthDate))
                    .font(.headline)
                    .padding(.top, 8)
                
                // Генерираме всички 42 дати (с правилно подравняване по делнични дни):
                let allGridDays = calendar.generateDatesForMonthGridAligned(for: monthDate)
                
                LazyVGrid(
                    columns: Array(
                        repeating: GridItem(.flexible(), spacing: 12),
                        count: 7
                    ),
                    spacing: 12
                ) {
                    ForEach(allGridDays, id: \.self) { day in
                        let dayKey = calendar.startOfDay(for: day)
                        let dayEvents = eventsByDay[dayKey] ?? []
                        let isInCurrentMonth = calendar.isDate(day, equalTo: monthDate, toGranularity: .month)
                        
                        if isInCurrentMonth {
                            // Показваме клетка за текущия месец
                            MiniDayCellView(day: day, referenceMonth: monthDate, events: dayEvents)
                        } else {
                            // Или празна клетка (за дните от съседен месец)
                            Text("")
                                .frame(width: 30, height: 32)
                        }
                    }
                }
                .padding(.horizontal, 6)
            }
        }
        // Правим целия блок кликаем
        .contentShape(Rectangle())
        .onTapGesture {
            onMonthTapped(monthDate)
        }
        .frame(width: 180, height: 240)
    }
    
    private func monthName(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateFormat = "MMM" // "Jan", "Feb", ...
        return df.string(from: date)
    }
}

// MARK: - YearCalendarView
struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    
    // Вместо bool, използваме Date? като "item" за fullScreenCover
    @State private var tappedMonthDate: Date? = nil
    
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
                            // Задаваме tappedMonthDate (и вече SwiftUI ще покаже fullScreenCover)
                            tappedMonthDate = tappedMonth
                        }
                        // 3) Може да добавим padding около всяко мини-каре
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
        
        // Показваме MonthCalendarView като fullScreenCover,
        // когато tappedMonthDate != nil
        .fullScreenCover(item: $tappedMonthDate) { monthStart in
            // monthStart е "разопакованият" Date
            NavigationView {
                MonthCalendarView(viewModel: viewModel, startMonth: monthStart)
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Close") {
                                // При затваряне зануляваме tappedMonthDate
                                tappedMonthDate = nil
                                // Можем (по желание) да презаредим годишните събития
                                viewModel.loadEventsForWholeYear(year: year)
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

