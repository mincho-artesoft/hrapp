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
    
    init(viewModel: CalendarViewModel,
         selectedTab: Int,
         onViewChange: ((Int) -> Void)?) {
        self.viewModel = viewModel
        self.selectedTab = selectedTab
        self.onViewChange = onViewChange
        
        // ① 100 % прозрачно – когато е в scroll-edge (върха)
        let clear = UINavigationBarAppearance()
        clear.configureWithTransparentBackground()          // няма фон, няма blur

        // ② 30 % opacity – когато е стандартно (след скрол)
        let semi = UINavigationBarAppearance()
        semi.configureWithTransparentBackground()
        semi.backgroundColor =
            UIColor.systemBackground.withAlphaComponent(0.30)   // ← смени 0.30 по вкус
        // (по желание добави blur)
        // semi.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterial)

        // ③ Назначаваме
        let nav = UINavigationBar.appearance()
        nav.scrollEdgeAppearance         = clear        // горе → изцяло прозрачно
        nav.compactScrollEdgeAppearance  = clear        // (landscape compact)
        nav.standardAppearance           = semi         // скролнато → полупрозрачно
        nav.compactAppearance            = semi

        // iOS 17+ фиксация – иначе при swipe back мигаше бяло
        nav.scrollEdgeAppearance?.backgroundColor = .clear
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // (A) Търсачка
            if showSearchBar {
                TextField(LocalizedStringKey("Search events..."), text: $searchText)
                    .textFieldStyle(.plain)                         // без вътрешния бордър
                    .padding(.vertical, 8)
                    .padding(.horizontal, 12)
                    .background(
                        RoundedRectangle(cornerRadius: 10, style: .continuous)
                            .fill(.thinMaterial)                    // същия blur фон
                    )
                    // ⨯ бутонът вътре, долепен вдясно
                    .overlay(
                        Button {
                            showSearchBar = false
                            searchText = ""
                        } label: {
                            Image(systemName: "xmark")
                                .font(.subheadline.weight(.semibold))
                                .foregroundColor(.secondary)
                        }
                        .padding(.trailing, 8),                     // разстояние от десния ръб
                        alignment: .trailing
                    )
                    .transition(.move(edge: .top))
                    .padding(.horizontal)                           // външен padding (ако ти трябва)
            }
            
            // (B) Горен ред: year navigation (ако не сме в режим на търсене)
            if !(showSearchBar && !searchText.isEmpty) {
                HStack {
                    Button(action: {
                        year -= 1
                        viewModel.loadEventsForWholeYear(year: year)
                    }) {
                        Image(systemName: "chevron.left")
                    }
                    
                    // Просто показваме числото (година); не е нужно да се локализира
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
                                // 6 колони
                                return Array(repeating: GridItem(.fixed(180), spacing: horizontalSpacing), count: 6)
                            } else {
                                // 4 колони
                                return Array(repeating: GridItem(.fixed(180), spacing: horizontalSpacing), count: 4)
                            }
                        } else {
                            // iPhone
                            if isLandscape {
                                // 4 колони
                                return Array(repeating: GridItem(.fixed(180), spacing: horizontalSpacing), count: 4)
                            } else {
                                // 2 колони
                                return Array(repeating: GridItem(.fixed(180), spacing: horizontalSpacing), count: 2)
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
        
        // (D) Full-screen cover при цъкане на даден месец => MonthCalendarView
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
                        // Локализираме "Close"
                        Button(LocalizedStringKey("Close")) {
                            tappedMonthDate = nil
                            viewModel.loadEventsForWholeYear(year: year)
                        }
                    }
                }
            }
        }
        
        // (E) Sheet за създаване на събитие
        .sheet(item: $eventToEdit, onDismiss: {
            viewModel.loadEventsForWholeYear(year: year)
        }) { ev in
            EventEditViewWrapper(eventStore: viewModel.eventStore, event: ev)
        }
        
        // (F) Toolbar (Add, Search, UIMenuButtonRepresentable)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                HStack(spacing: 9) {
                    // Бутон "+"
                    if !showSearchBar {
//                        Button {
//                            createNewEventForYear()
//                        } label: {
//                            Image(systemName: "plus")
//                        }
                        
                        // Бутон за търсене
                        Button {
                            showSearchBar = true
                        } label: {
                            Image(systemName: "magnifyingglass")
                        }
                        
                        // Меню
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
        
        // Локализираме "New Event"
        newEvent.title = NSLocalizedString("New Event", comment: "Default title for newly created events")
        newEvent.calendar = viewModel.eventStore.defaultCalendarForNewEvents
        
        let start = Date()
        newEvent.startDate = start
        newEvent.endDate   = start.addingTimeInterval(3600)
        
        eventToEdit = newEvent
    }
}
