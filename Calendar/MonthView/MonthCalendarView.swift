import SwiftUI
import EventKit
import EventKitUI

struct MonthCalendarView: View {
    @ObservedObject var viewModel: CalendarViewModel
    
    var startMonth: Date
    var selectedTab: Int
    var onViewChange: ((Int) -> Void)?
    var onDaySelected: ((Date) -> Void)?
    
    @State private var eventToView: EKEvent? = nil
    @State private var eventToEdit: EKEvent? = nil
    
    @State private var showRepeatingDialog = false
    @State private var repeatingEvent: EKEvent? = nil
    @State private var repeatingNewDate: Date? = nil
    
    @State private var currentMonth: Date
    
    @State private var showSearchBar: Bool = false
    @State private var searchText: String = ""
    
    private var calendar: Calendar {
        var cal = Calendar.current
        cal.locale = Locale.current
        cal.firstWeekday = GlobalState.firstWeekday
        return cal
    }
    init(viewModel: CalendarViewModel,
         startMonth: Date,
         selectedTab: Int,
         onViewChange: ((Int) -> Void)?,
         onDaySelected: ((Date) -> Void)? = nil) {
        self.viewModel = viewModel
        self.startMonth = startMonth
        self._currentMonth = State(initialValue: startMonth)
        self.selectedTab = selectedTab
        self.onViewChange = onViewChange
        self.onDaySelected = onDaySelected
        
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
            if showSearchBar {
                CalendarEventSearchField(text: $searchText) {
                    showSearchBar = false
                    searchText = ""
                }
                    .transition(.move(edge: .top))
            } else {
                topBar
            }
            
            // (B) Навигация за месеца
            if !(showSearchBar && !searchText.isEmpty) {
                HStack {
                    Button {
                        moveMonth(by: -1)
                    } label: {
                        Image(systemName: "chevron.backward")
                    }
                    
                    Text(localizedFormattedMonthYear(currentMonth))
                        .font(.headline)
                        .adaptiveSingleLine(minimumScale: 0.5)
                        .frame(maxWidth: .infinity)
                    
                    Button {
                        moveMonth(by: 1)
                    } label: {
                        Image(systemName: "chevron.forward")
                    }
                }
                .padding(.horizontal)
                .padding(.top)
            }
            
            // (C) Основно съдържание
            if showSearchBar && !searchText.isEmpty {
                SearchResultsView(searchText: searchText)
            } else {
                WeekdayHeaderView()
                    .padding(.top, 8)
                
                let dates = calendar.generateDatesForMonthGrid(for: currentMonth)
                ScrollView {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 7), spacing: 8) {
                        ForEach(dates, id: \.self) { day in
                            let dayKey = calendar.startOfDay(for: day)
                            let dayEvents = viewModel.eventsByDay[dayKey] ?? []
                            
                            DayCellView(
                                day: day,
                                currentMonth: currentMonth,
                                events: dayEvents,
                                onEventDropped: { eventID, newDay in
                                    handleEventDropped(eventID, on: newDay)
                                },
                                onDayTap: { tappedDay in
                                    onDaySelected?(tappedDay)
                                },
                                onDayLongPress: { pressedDay in
                                    createAndEditNewEvent(on: pressedDay)
                                    ReviewManager.eventCreated()
                                },
                                onEventTap: { tappedEvent in
                                    eventToView = tappedEvent
                                }
                            )
                        }
                    }
                    .padding(.horizontal, 8)
                }
            }
        }
        .animation(.easeInOut, value: showSearchBar)
        .onAppear {
            // Зареждаме събития за текущия месец
            viewModel.loadEvents(for: currentMonth)
        }
        .onChange(of: startMonth) { _, newValue in
            let normalizedMonth = calendar.date(from: calendar.dateComponents([.year, .month], from: newValue)) ?? newValue
            guard !calendar.isDate(normalizedMonth, equalTo: currentMonth, toGranularity: .month) else { return }
            currentMonth = normalizedMonth
            viewModel.loadEvents(for: currentMonth)
        }
        .navigationBarHidden(true)

        // (E) Sheet за детайлен изглед
        .sheet(item: $eventToView, onDismiss: {
            viewModel.loadEvents(for: currentMonth)
        }) { theEvent in
            EventDetailViewWrapper(event: theEvent)
        }
        
        // (F) Sheet за създаване/редакция
        .sheet(item: $eventToEdit, onDismiss: {
            viewModel.loadEvents(for: currentMonth)
        }) { theEvent in
            EventEditViewWrapper(eventStore: viewModel.eventStore, event: theEvent)
        }
        
        // (G) Диалог за повтарящо се събитие
        .confirmationDialog(LocalizedStringKey("This is a repeating event."),
                            isPresented: $showRepeatingDialog,
                            titleVisibility: .visible) {
            Button(LocalizedStringKey("Save for This Event Only")) {
                if let ev = repeatingEvent, let day = repeatingNewDate {
                    moveEvent(ev, to: day, span: .thisEvent)
                }
            }
            Button(LocalizedStringKey("Save for Future Events")) {
                if let ev = repeatingEvent, let day = repeatingNewDate {
                    moveEvent(ev, to: day, span: .futureEvents)
                }
            }
            Button(LocalizedStringKey("Cancel"), role: .cancel) {}
        }
    }

    @ViewBuilder
    private var topBar: some View {
        HStack(spacing: 9) {
            Spacer()
            if !showSearchBar {
                Button {
                    showSearchBar = true
                } label: {
                    Image(uiImage: CalendarSearchAppearance.iconImage)
                        .renderingMode(.template)
                        .foregroundStyle(.blue)
                }
                .frame(
                    width: CalendarSearchAppearance.buttonSize,
                    height: CalendarSearchAppearance.buttonSize
                )
                .contentShape(Rectangle())
                .buttonStyle(.plain)

                UIMenuButtonRepresentable(
                    currentView: selectedTab,
                    onViewChange: { newTab in
                        onViewChange?(newTab)
                    }
                )
                .frame(width: 30, height: 30)
            }
        }
        .padding(.horizontal)
        .padding(.top, 8)
        .padding(.bottom, 8)
    }
}

// MARK: - Помощни методи
extension MonthCalendarView {
    private func localizedTabName(_ rawValue: String) -> String {
        return NSLocalizedString(rawValue, comment: "")
    }

    private func moveMonth(by offset: Int) {
        if let newMonth = calendar.date(byAdding: .month, value: offset, to: currentMonth) {
            currentMonth = newMonth
            viewModel.loadEvents(for: currentMonth)
        }
    }
    
    private func localizedFormattedMonthYear(_ date: Date) -> String {
        appDateFormatter(template: "yMMMM").string(from: date)
    }

    private func handleEventDropped(_ eventID: String, on newDate: Date) {
        guard let droppedEvent = viewModel.eventsByID[eventID] else { return }
        
        if droppedEvent.hasRecurrenceRules {
            repeatingEvent = droppedEvent
            repeatingNewDate = newDate
            showRepeatingDialog = true
        } else {
            moveEvent(droppedEvent, to: newDate, span: .thisEvent)
        }
    }

    private func moveEvent(_ event: EKEvent, to newDate: Date, span: EKSpan) {
        let cal = Calendar.current
        let duration = event.endDate.timeIntervalSince(event.startDate)
        let startHour = cal.component(.hour, from: event.startDate)
        let startMin = cal.component(.minute, from: event.startDate)
        
        guard let newStart = cal.date(bySettingHour: startHour, minute: startMin, second: 0, of: newDate) else {
            return
        }
        
        let newEnd = newStart.addingTimeInterval(duration)
        event.startDate = newStart
        event.endDate = newEnd

        do {
            try viewModel.eventStore.save(event, span: span, commit: true)
        } catch {
            print("Error saving event: \(error.localizedDescription)")
        }

        viewModel.loadEvents(for: currentMonth)
    }

    private func createAndEditNewEvent(on day: Date) {
        let status = EKEventStore.authorizationStatus(for: .event)
        
        if #available(iOS 17.0, *) {
            switch status {
            case .fullAccess, .writeOnly:
                presentNewEvent(on: day)
            case .notDetermined:
                print("Още не е поискан достъп.")
            default:
                print("Нямате достъп до календара.")
            }
        } else {
            if status == .authorized {
                presentNewEvent(on: day)
            } else if status == .notDetermined {
                print("Още не е поискан достъп.")
            } else {
                print("Нямате достъп до календара.")
            }
        }
    }
    
    private func presentNewEvent(on day: Date) {
        let cal = Calendar.current
        let startOfDay = cal.startOfDay(for: day)
        
        let newEvent = EKEvent(eventStore: viewModel.eventStore)
        newEvent.startDate = startOfDay.addingTimeInterval(9 * 3600)
        newEvent.endDate = startOfDay.addingTimeInterval(10 * 3600)
        newEvent.title = NSLocalizedString("New Event", comment: "Default title for newly created events")
        newEvent.calendar = viewModel.eventStore.defaultCalendarForNewEvents
        
        eventToEdit = newEvent
    }
}
