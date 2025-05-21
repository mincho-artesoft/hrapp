import SwiftUI
import EventKit


// MARK: - Главен изглед за годината
struct YearCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    var selectedTab: Int
    var onViewChange: ((Int) -> Void)?
    
    @State private var year: Int = Calendar.current.component(.year, from: Date())
    @State private var tappedMonthDate: Date? = nil
    @State private var eventToEdit: EKEvent? = nil
    
    // Търсене
    @State private var showSearchBar: Bool = false
    @State private var searchText: String = ""
    
    // MARK: - Инициализатор
    init(viewModel: CalendarViewModel,
         selectedTab: Int,
         onViewChange: ((Int) -> Void)?) {
        self.viewModel = viewModel
        self.selectedTab = selectedTab
        self.onViewChange = onViewChange
        
        // Настройки за прозрачен/полупрозрачен navigation bar
        let clear = UINavigationBarAppearance()
        clear.configureWithTransparentBackground()
        
        let semi = UINavigationBarAppearance()
        semi.configureWithTransparentBackground()
        semi.backgroundColor = UIColor.systemBackground.withAlphaComponent(0.30)
        
        let nav = UINavigationBar.appearance()
        nav.scrollEdgeAppearance        = clear
        nav.compactScrollEdgeAppearance = clear
        nav.standardAppearance          = semi
        nav.compactAppearance           = semi
        nav.scrollEdgeAppearance?.backgroundColor = .clear
    }
    
    // MARK: - Тяло
    var body: some View {
        VStack(spacing: 0) {
            
            // (A) Търсачка
            if showSearchBar {
                TextField(LocalizedStringKey("Search events..."), text: $searchText)
                    .textFieldStyle(.plain)
                    .padding(.vertical, 8)
                    .padding(.horizontal, 12)
                    .background(
                        RoundedRectangle(cornerRadius: 10, style: .continuous)
                            .fill(.thinMaterial)
                    )
                    .overlay(
                        Button {
                            showSearchBar = false
                            searchText = ""
                        } label: {
                            Image(systemName: "xmark")
                                .font(.subheadline.weight(.semibold))
                                .foregroundColor(.secondary)
                        }
                        .padding(.trailing, 8),
                        alignment: .trailing
                    )
                    .transition(.move(edge: .top))
                    .padding(.horizontal)
            }
            
            // (B) Header с навигация по години (скрит при активно търсене)
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
            
            // (C) Основно съдържание
            if showSearchBar && !searchText.isEmpty {
                SearchResultsView(searchText: searchText)
            } else {
                GeometryReader { geometry in
                    let isPad       = UIDevice.current.userInterfaceIdiom == .pad
                    let isLandscape = geometry.size.width > geometry.size.height
                    let isiPhone16x9 = UIScreen.main.isSixteenByNine      // ← новата проверка
                    let horizontalSpacing: CGFloat = 16
                    
                    // Определяне на колоните
                    let columns: [GridItem] = {
                        if isPad {
                                return Array(
                                    repeating: GridItem(.fixed(180), spacing: horizontalSpacing),
                                    count: isLandscape ? 6 : 4
                                )

                        } else {
                            if isiPhone16x9 {
                                return Array(
                                    repeating: GridItem(.fixed(isLandscape ? 180 : 160), spacing: horizontalSpacing),
                                    count: isLandscape ? 3 : 2
                                )
                            } else {
                                return Array(
                                    repeating: GridItem(.fixed(180), spacing: horizontalSpacing),
                                    count: isLandscape ? 4 : 2
                                )
                            }
                        }
                    }()
                    
                    ScrollView {
                        LazyVGrid(columns: columns, spacing: 0) {
                            ForEach(1...12, id: \.self) { monthIndex in
                                let dateForMonth = dateFromYearMonth(year, monthIndex)
                                
                                if isPad {
                                    YearMonthMiniView(
                                        monthDate: dateForMonth,
                                        eventsByDay: viewModel.eventsByDay,
                                        width: 180,
                                    ) { tappedMonth in
                                        tappedMonthDate = tappedMonth
                                    }
                                    .padding(8)
                                } else {
                                    if isiPhone16x9 {
                                        YearMonthMiniView(
                                            monthDate: dateForMonth,
                                            eventsByDay: viewModel.eventsByDay,
                                            width: isLandscape ? 180 : 160,
                                        ) { tappedMonth in
                                            tappedMonthDate = tappedMonth
                                        }
                                        .padding(8)
                                    } else {
                                        YearMonthMiniView(
                                            monthDate: dateForMonth,
                                            eventsByDay: viewModel.eventsByDay,
                                            width: 180,
                                        ) { tappedMonth in
                                            tappedMonthDate = tappedMonth
                                        }
                                        .padding(8)
                                    }
                                }
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
        
        // (D) Покривка при избор на месец
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
                        Button(LocalizedStringKey("Close")) {
                            tappedMonthDate = nil
                            viewModel.loadEventsForWholeYear(year: year)
                        }
                    }
                }
            }
        }
        
        // (E) Sheet за създаване/редактиране на събитие
        .sheet(item: $eventToEdit, onDismiss: {
            viewModel.loadEventsForWholeYear(year: year)
        }) { ev in
            EventEditViewWrapper(eventStore: viewModel.eventStore, event: ev)
        }
        
        // (F) Toolbar – Add, Search, Menu
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                HStack(spacing: 9) {
                    if !showSearchBar {
                        // Бутон за търсене
                        Button {
                            showSearchBar = true
                        } label: {
                            Image(systemName: "magnifyingglass")
                        }
                        
                        // Меню за смяна на изгледи
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
    
    // MARK: - Helper-и
    private func dateFromYearMonth(_ year: Int, _ month: Int) -> Date {
        var comp = DateComponents()
        comp.year = year
        comp.month = month
        comp.day = 1
        return Calendar.current.date(from: comp) ?? Date()
    }
    
    private func createNewEventForYear() {
        let newEvent = EKEvent(eventStore: viewModel.eventStore)
        newEvent.title = NSLocalizedString("New Event", comment: "Default title for newly created events")
        newEvent.calendar = viewModel.eventStore.defaultCalendarForNewEvents
        let start = Date()
        newEvent.startDate = start
        newEvent.endDate   = start.addingTimeInterval(3600)
        eventToEdit = newEvent
    }
}
