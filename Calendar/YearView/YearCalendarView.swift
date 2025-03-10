import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    // CHANGES: info за активния таб и callback за смяна
    var selectedTab: Int
    var onViewChange: ((Int)->Void)?
    
    // Показва годината
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    
    // При клик върху даден месец, ще отваряме MonthCalendarView
    @State private var tappedMonthDate: Date? = nil
    
    // NEW: За редакция на (ново) събитие
    @State private var eventToEdit: EKEvent? = nil
    
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
                // Горна лента (показва "year" и стрелки)
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
                
                // Съдържание – мрежа с 12 месеца
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
            // fullScreenCover за MonthCalendarView
            .fullScreenCover(item: $tappedMonthDate) { monthStart in
                NavigationView {
                    MonthCalendarView(
                        viewModel: viewModel,
                        startMonth: monthStart,
                        
                        selectedTab: selectedTab,
                        onViewChange: onViewChange
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
            // NEW: sheet за системния редактор на събития
            .sheet(item: $eventToEdit, onDismiss: {
                // При затваряне на редактора, презареждаме цялата година
                viewModel.loadEventsForWholeYear(year: year)
            }) { ev in
                EventEditViewWrapper(eventStore: viewModel.eventStore, event: ev)
            }
            // Toolbar с “+” бутон и трите точки
            .toolbar {
                // 1) Бутон “+”
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        createNewEventForYear()
                    } label: {
                        Image(systemName: "plus")
                    }
                }
                
                // 2) Бутон с трите точки (Menu)
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
    
    /// Създава `Date` от дадена година и месец (примерно 2025, 7 → 1 юли 2025)
    private func dateFromYearMonth(_ year: Int, _ month: Int) -> Date {
        var comp = DateComponents()
        comp.year = year
        comp.month = month
        comp.day = 1
        return Calendar.current.date(from: comp) ?? Date()
    }
    
    // NEW: Примерен метод, създаващ събитие за "днешна дата"
    private func createNewEventForYear() {
        // Може да е "първия ден на текущата година", Date(), или нещо друго
        let newEvent = EKEvent(eventStore: viewModel.eventStore)
        newEvent.title = "New Event"
        newEvent.calendar = viewModel.eventStore.defaultCalendarForNewEvents
        
        // Тук избираме да е за "днес" (текущ час)
        let start = Date()
        newEvent.startDate = start
        newEvent.endDate   = start.addingTimeInterval(3600)
        
        eventToEdit = newEvent
    }
}
