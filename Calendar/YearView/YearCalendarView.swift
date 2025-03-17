import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    // MARK: - Existing States
    var selectedTab: Int
    var onViewChange: ((Int) -> Void)?
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    @State private var tappedMonthDate: Date? = nil
    @State private var eventToEdit: EKEvent? = nil
    
    // MARK: - NEW: Search States
    @State private var showSearchBar: Bool = false
    @State private var searchText: String = ""
    
    var body: some View {
        VStack(spacing: 0) {
            // 1) Search bar (if active)
            if showSearchBar {
                HStack {
                    TextField("Search events...", text: $searchText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.leading)
                    
                    Button("Cancel") {
                        // Close search bar and clear search text
                        showSearchBar = false
                        searchText = ""
                    }
                    .padding(.trailing)
                }
                .padding(.vertical, 8)
                .background(.thinMaterial)
                .transition(.move(edge: .top))
            }
            
            // 2) Year navigation (hidden if searchText is not empty)
            if !(showSearchBar && !searchText.isEmpty) {
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
                .padding(.vertical, 8)
                .padding(.horizontal)
            }
            
            // 3) Main content: if searching, show search results; otherwise show the year grid
            if showSearchBar && !searchText.isEmpty {
                // Тук показвате резултатите от търсене
                SearchResultsView(searchText: searchText)
            } else {
                // Normal year grid
                GeometryReader { geometry in
                    let isLandscape = geometry.size.width > geometry.size.height
                    
                    // Тук променяме конфигурацията, за да не е flexible, а фиксирана ширина
                    let horizontalSpacing: CGFloat = isLandscape ? 16 : 16
                    let columns = isLandscape
                        ? [GridItem(.fixed(180), spacing: horizontalSpacing),
                           GridItem(.fixed(180), spacing: horizontalSpacing),
                           GridItem(.fixed(180), spacing: horizontalSpacing),
                           GridItem(.fixed(180), spacing: horizontalSpacing)]
                        : [GridItem(.fixed(180), spacing: horizontalSpacing),
                           GridItem(.fixed(180), spacing: horizontalSpacing)]
                    
                    ScrollView {
                        // `spacing: 16` тук отговаря за вертикалното разстояние между редовете
                        LazyVGrid(columns: columns, spacing: 0) {
                            ForEach(1...12, id: \.self) { monthIndex in
                                let dateForMonth = dateFromYearMonth(year, monthIndex)
                                YearMonthMiniView(
                                    monthDate: dateForMonth,
                                    eventsByDay: viewModel.eventsByDay
                                ) { tappedMonth in
                                    tappedMonthDate = tappedMonth
                                }
                                .padding(8)
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 8)
                        .padding(.bottom, isLandscape ? 16 : 80)
                    }
                }
                .onAppear {
                    viewModel.loadEventsForWholeYear(year: year)
                }
            }
        }
        .animation(.easeInOut, value: showSearchBar)
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
        .sheet(item: $eventToEdit, onDismiss: {
            viewModel.loadEventsForWholeYear(year: year)
        }) { ev in
            EventEditViewWrapper(eventStore: viewModel.eventStore, event: ev)
        }
        .toolbar {
            // 1) Plus button
            ToolbarItem(placement: .navigationBarTrailing) {
                if !showSearchBar {
                    Button {
                        createNewEventForYear()
                    } label: {
                        Image(systemName: "plus")
                    }
                }
            }
            // 2) Search button
            ToolbarItem(placement: .navigationBarTrailing) {
                if !showSearchBar {
                    Button {
                        showSearchBar = true
                    } label: {
                        Image(systemName: "magnifyingglass")
                    }
                }
            }
            // 3) Menu for switching views
            ToolbarItem(placement: .navigationBarTrailing) {
                if !showSearchBar {
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
                        Button {
                            onViewChange?(4) // List
                        } label: {
                            Label("List", systemImage: (selectedTab == 4 ? "checkmark" : ""))
                        }
                        Button {
                            onViewChange?(5) // MultiCalendar
                        } label: {
                            Label("MultiCalendar", systemImage: (selectedTab == 5 ? "checkmark" : ""))
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
        }
    }
    
    // MARK: - Helper Methods
    
    private func dateFromYearMonth(_ year: Int, _ month: Int) -> Date {
        var comp = DateComponents()
        comp.year = year
        comp.month = month
        comp.day = 1
        return Calendar.current.date(from: comp) ?? Date()
    }
    
    private func createNewEventForYear() {
        let newEvent = EKEvent(eventStore: viewModel.eventStore)
        newEvent.title = "New Event"
        newEvent.calendar = viewModel.eventStore.defaultCalendarForNewEvents
        
        let start = Date()
        newEvent.startDate = start
        newEvent.endDate   = start.addingTimeInterval(3600)
        
        eventToEdit = newEvent
    }
}
