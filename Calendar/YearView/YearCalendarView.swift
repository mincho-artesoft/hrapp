import SwiftUI
import EventKit

struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    var selectedTab: Int
    var onViewChange: ((Int) -> Void)?
    
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    @State private var tappedMonthDate: Date? = nil
    @State private var eventToEdit: EKEvent? = nil
    
    // За търсенето
    @State private var showSearchBar: Bool = false
    @State private var searchText: String = ""
    
    var body: some View {
        VStack(spacing: 0) {
            if showSearchBar {
                HStack {
                    TextField("Search events...", text: $searchText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.leading)
                    
                    Button("Cancel") {
                        showSearchBar = false
                        searchText = ""
                    }
                    .padding(.trailing)
                }
                .padding(.vertical, 8)
                .background(.thinMaterial)
                .transition(.move(edge: .top))
            }
            
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
            
            if showSearchBar && !searchText.isEmpty {
                // Резултати от търсене
                SearchResultsView(searchText: searchText)
            } else {
                GeometryReader { geometry in
                    let isPad = UIDevice.current.userInterfaceIdiom == .pad
                    let isLandscape = geometry.size.width > geometry.size.height
                    let horizontalSpacing: CGFloat = 16
                    
                    let columns: [GridItem] = {
                        if isPad {
                            // iPad
                            if isLandscape {
                                // 6 колони (iPad хоризонтално)
                                return [
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing)
                                ]
                            } else {
                                // 4 колони (iPad портрет)
                                return [
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing)
                                ]
                            }
                        } else {
                            // iPhone
                            if isLandscape {
                                // 4 колони (iPhone хоризонтално)
                                return [
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing)
                                ]
                            } else {
                                // 2 колони (iPhone портрет)
                                return [
                                    GridItem(.fixed(180), spacing: horizontalSpacing),
                                    GridItem(.fixed(180), spacing: horizontalSpacing)
                                ]
                            }
                        }
                    }()
                    
                    ScrollView {
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
            ToolbarItem(placement: .navigationBarTrailing) {
                HStack(spacing: 9) {
                    // Бутон "+"
                    if !showSearchBar {
                        Button {
                            createNewEventForYear()
                        } label: {
                            Image(systemName: "plus")
                        }
                        
                        // Бутон за търсене
                        Button {
                            showSearchBar = true
                        } label: {
                            Image(systemName: "magnifyingglass")
                        }
                        
                        // Заместваме SwiftUI Menu с UIMenuButtonRepresentable
                        UIMenuButtonRepresentable(
                            currentView: selectedTab,
                            onViewChange: { newTab in
                                onViewChange?(newTab)
                            }
                        )
                        .frame(width: 30, height: 30)
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
