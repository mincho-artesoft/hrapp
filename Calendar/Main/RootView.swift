import SwiftUI
import EventKit

// MARK: - Основен RootView
struct RootView: View {
    @State private var selectedTab = 3  // MultiDay, примерно
    @State var accessGranted = false

    // За Multi-Day примера
    @State private var pinnedFromDate: Date = Date()
    @State private var pinnedToDate: Date = Date()
    @State private var pinnedEvents: [EventDescriptor] = []

    // Таймер за презареждане (пример)
    let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    // Показваме/скриваме листа с календари
    @State private var showCalendarsSheet = false
    // Показваме/скриваме AddCalendarView
    @State private var showAddCalendarSheet = false

    var body: some View {
        ZStack {
            Color(.systemBackground)
                .edgesIgnoringSafeArea(.all)

            NavigationView {
                VStack {
                    // Горен Picker (Day / MultiDay / Month / Year / TEST)
                    Picker("View", selection: $selectedTab) {
                        Text("Day").tag(1)
                        Text("MultiDay").tag(3)
                        Text("Month").tag(0)
                        Text("Year").tag(2)
                        Text("TEST").tag(4)
                    }
                    .pickerStyle(.segmented)
                    .padding()

                    // Превключваме между различните примери
                    switch selectedTab {
                    case 0:
                        // Пример: месечен календар
                        MonthCalendarView(
                            viewModel: CalendarViewModel.shared,
                            startMonth: Date()
                        )

                    case 1:
                        // Single-day пример
                        TwoWayPinnedMultiDayWrapper(
                            fromDate: $pinnedFromDate,
                            toDate: $pinnedFromDate,
                            events: $pinnedEvents,
                            eventStore: CalendarViewModel.shared.eventStore,
                            isSingleDay: true
                        ) { tappedDay in
                            pinnedFromDate = tappedDay
                            pinnedToDate   = tappedDay
                        }
                        .onAppear { loadPinnedRangeEvents() }
                        .onReceive(timer) { _ in loadPinnedRangeEvents() }

                    case 2:
                        // Годишен календар
                        YearCalendarView(viewModel: CalendarViewModel.shared)

                    case 3:
                        // Multi-day
                        TwoWayPinnedMultiDayWrapper(
                            fromDate: $pinnedFromDate,
                            toDate: $pinnedToDate,
                            events: $pinnedEvents,
                            eventStore: CalendarViewModel.shared.eventStore,
                            isSingleDay: false
                        ) { tappedDay in
                            pinnedFromDate = tappedDay
                            pinnedToDate   = tappedDay
                        }
                        .onAppear { loadPinnedRangeEvents() }
                        .onReceive(timer) { _ in loadPinnedRangeEvents() }

                    case 4:
                        // Тестова страница
                        ContentView()

                    default:
                        Text("N/A")
                    }
                }
                .navigationTitle("Calendar Demo")
                // Долна лента с 3 бутона: Today / Calendars / Inbox (+AddCalendar, ако искате)
                .toolbar {
                    ToolbarItemGroup(placement: .bottomBar) {
                        // “Today”
                        Button("Today") {
                            pinnedFromDate = Calendar.current.startOfDay(for: Date())
                            pinnedToDate   = pinnedFromDate
                            selectedTab    = 1 // Day view
                        }
                        Spacer()

                        // “Calendars”
                        Button("Calendars") {
                            showCalendarsSheet = true
                        }
                        Spacer()

                        // “Inbox” (пример)
                        Button("Inbox") {
                            // Може да покажете някакъв екран за покани
                        }
                    }
                }
            }
        }
        .onAppear {
            // Искаме достъп до календарите
            Task {
                accessGranted = await CalendarViewModel.shared.requestCalendarAccessIfNeeded()
                if accessGranted {
                    let year = Calendar.current.component(.year, from: Date())
                    CalendarViewModel.shared.loadEventsForWholeYear(year: year)
                }
            }
        }
        // Sheet с “CalendarsSheetView”
        .sheet(isPresented: $showCalendarsSheet) {
            CalendarsSheetView()
        }
    }

    // Зареждаме събития в pinnedEvents за диапазона [pinnedFromDate ... pinnedToDate]
    private func loadPinnedRangeEvents() {
        guard accessGranted else { return }
        let cal = Calendar.current
        let store = CalendarViewModel.shared.eventStore

        let fromOnly = cal.startOfDay(for: pinnedFromDate)
        let toOnly   = cal.startOfDay(for: pinnedToDate)
        guard let actualEnd = cal.date(byAdding: .day, value: 1, to: toOnly) else { return }

        let predicate = store.predicateForEvents(withStart: fromOnly, end: actualEnd, calendars: nil)
        let found = store.events(matching: predicate)

        var splitted: [EventDescriptor] = []
        for ekEvent in found {
            // Ако събитието прехвърля няколко дни, разцепваме го
            if cal.startOfDay(for: ekEvent.startDate) != cal.startOfDay(for: ekEvent.endDate) {
                splitted.append(contentsOf: splitEventByDays(
                    ekEvent,
                    startRange: fromOnly,
                    endRange: actualEnd
                ))
            } else {
                splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
            }
        }
        pinnedEvents = splitted
    }

    // Ако event е много‐дневен, правим парчета за всеки ден
    private func splitEventByDays(_ ekEvent: EKEvent,
                                  startRange: Date,
                                  endRange: Date) -> [EKMultiDayWrapper] {
        var results = [EKMultiDayWrapper]()
        let cal = Calendar.current

        let realStart = max(ekEvent.startDate, startRange)
        let realEnd   = min(ekEvent.endDate, endRange)
        if realStart >= realEnd { return results }

        var currentStart = realStart
        while currentStart < realEnd {
            guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart)
            else { break }

            let pieceEnd = min(endOfDay, realEnd)
            let partial = EKMultiDayWrapper(
                realEvent: ekEvent,
                partialStart: currentStart,
                partialEnd: pieceEnd
            )
            results.append(partial)

            guard
                let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay)
            else {
                break
            }
            currentStart = morning
        }
        return results
    }
}
import SwiftUI
import EventKit

// MARK: - Екран (sheet) с всички календари
struct CalendarsSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @ObservedObject var viewModel: CalendarViewModel = .shared

    @State private var selectedCalendarIDs: Set<String> = []

    @State private var onMyIphoneCalendars: [EKCalendar] = []
    @State private var otherCalendars:      [EKCalendar] = []

    // Управляваме разгъването на секциите
    @State private var isOnMyIphoneExpanded = true
    @State private var isOtherExpanded      = true

    // Примерен toggle за “Show Completed Reminders”
    @State private var showCompletedReminders = true

    // Управляваме sheet-а за AddCalendarView
    @State private var showAddCalendarView = false

    var body: some View {
        NavigationView {
            VStack {
                // Формуляр с 2 DisclosureGroup секции и един toggle
                Form {
                    DisclosureGroup("On My iPhone", isExpanded: $isOnMyIphoneExpanded) {
                        ForEach(onMyIphoneCalendars, id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar
                            )
                        }
                    }

                    DisclosureGroup("Other", isExpanded: $isOtherExpanded) {
                        ForEach(otherCalendars, id: \.calendarIdentifier) { cal in
                            CalendarRowView(
                                calendar: cal,
                                isSelected: selectedCalendarIDs.contains(cal.calendarIdentifier),
                                toggleAction: toggleCalendar
                            )
                        }
                    }

                    Toggle("Show Completed Reminders", isOn: $showCompletedReminders)
                }
                .navigationBarTitle("Calendars", displayMode: .inline)
                .navigationBarItems(
                    trailing:
                        Button("Done") {
                            presentationMode.wrappedValue.dismiss()
                        }
                )

                // Долен ред бутони: “Add Calendar” и “Hide All”
                HStack {
                    Button("Add Calendar") {
                        showAddCalendarView = true
                    }
                    .padding(.leading)

                    Spacer()

                    Button("Hide All") {
                        selectedCalendarIDs.removeAll()
                    }
                    .padding(.trailing)
                }
                .padding(.vertical, 8)
            }
        }
        .onAppear {
            loadCalendars()
        }
        // При затваряне на AddCalendarView, презареждаме списъка:
        .sheet(isPresented: $showAddCalendarView, onDismiss: {
            loadCalendars()
        }) {
            // Екранът за добавяне на календар
            AddCalendarView()
        }
    }

    // Зареждаме календарите и ги разделяме
    private func loadCalendars() {
        let store = viewModel.eventStore
        let allCals = store.calendars(for: .event)

        onMyIphoneCalendars = allCals.filter { $0.source.title == "On My iPhone" }
        otherCalendars      = allCals.filter { $0.source.title != "On My iPhone" }

        // По желание: избираме всички първоначално
        selectedCalendarIDs = Set(allCals.map { $0.calendarIdentifier })
    }

    private func toggleCalendar(_ cal: EKCalendar) {
        if selectedCalendarIDs.contains(cal.calendarIdentifier) {
            selectedCalendarIDs.remove(cal.calendarIdentifier)
        } else {
            selectedCalendarIDs.insert(cal.calendarIdentifier)
        }
    }
}

/// Ред в списъка с календари: цветно кръгче, чек, заглавие, “info”
struct CalendarRowView: View {
    let calendar: EKCalendar
    let isSelected: Bool
    let toggleAction: (EKCalendar) -> Void

    var body: some View {
        HStack {
            // Цветното кръгче
            Circle()
                .fill(Color(uiColor: UIColor(cgColor: calendar.cgColor ?? UIColor.clear.cgColor)))
                .frame(width: 12, height: 12)

            // Бутон за check/uncheck
            Button(action: { toggleAction(calendar) }) {
                Image(systemName: isSelected ? "checkmark" : "")
                    .frame(width: 24, height: 24)
                    .foregroundColor(.blue)
            }
            .buttonStyle(.plain)

            Text(calendar.title)
                .padding(.leading, 4)
            Spacer()

            // Info бутон (пример)
            Image(systemName: "info.circle")
                .foregroundColor(.secondary)
        }
    }
}
import SwiftUI
import EventKit

// MARK: - AddCalendarView
struct AddCalendarView: View {
    @Environment(\.presentationMode) var presentationMode
    let eventStore = CalendarViewModel.shared.eventStore

    @State private var calendarName: String = ""
    @State private var selectedColor: UIColor = .systemGreen
    @State private var eventAlertsEnabled: Bool = true

    // За тази демо‐версия фиксираме акаунта в “On My iPhone”
    private let accountName: String = "On My iPhone"

    var body: some View {
        NavigationView {
            Form {
                Section {
                    TextField("Calendar Name", text: $calendarName)

                    // “Account: On My iPhone”
                    HStack {
                        Text("Account")
                        Spacer()
                        Text(accountName)
                            .foregroundColor(.secondary)
                    }
                }

                // >>> Тук вече ползваме CalendarColorSelectionView <<<
                Section(header: Text("COLOR").foregroundColor(.secondary)) {
                    NavigationLink(destination: CalendarColorSelectionView(selectedColor: $selectedColor)) {
                        HStack {
                            Circle()
                                .fill(Color(selectedColor))
                                .frame(width: 20, height: 20)
                            Text( displayColorName(for: selectedColor) )
                                .padding(.leading, 8)
                        }
                    }
                }

                Section(header: Text("NOTIFICATIONS").foregroundColor(.secondary)) {
                    Toggle(isOn: $eventAlertsEnabled) {
                        Text("Event Alerts")
                    }
                    Text("Allow events on this calendar to display alerts.")
                        .font(.footnote)
                        .foregroundColor(.secondary)
                }
            }
            .navigationBarTitle("Add Calendar", displayMode: .inline)
            .navigationBarItems(
                leading:
                    Button("Cancel") {
                        presentationMode.wrappedValue.dismiss()
                    }
                    .foregroundColor(.red),
                trailing:
                    Button("Done") {
                        createCalendar()
                    }
                    .disabled(calendarName.trimmingCharacters(in: .whitespaces).isEmpty)
            )
        }
    }

    private func createCalendar() {
        let newCal = EKCalendar(for: .event, eventStore: eventStore)
        newCal.title = calendarName

        // Намираме “On My iPhone”, или ако няма – default
        if let localSource = eventStore.sources.first(where: { $0.title == "On My iPhone" }) {
            newCal.source = localSource
        } else if let defaultSource = eventStore.defaultCalendarForNewEvents?.source {
            newCal.source = defaultSource
        }

        newCal.cgColor = selectedColor.cgColor

        do {
            try eventStore.saveCalendar(newCal, commit: true)
            // Принуждаваме EventKit да опресни списъка си
            eventStore.refreshSourcesIfNecessary()

            print("Създадохме нов календар: \(newCal.title)")
            // По желание: настройка на “eventAlertsEnabled”? (изисква допълнителна логика)

            presentationMode.wrappedValue.dismiss()
        } catch {
            print("Грешка при създаване на календар: \(error.localizedDescription)")
        }
    }

    /// Показваме име на цвят (ако съвпада с готовите), иначе “Custom”
    private func displayColorName(for uiColor: UIColor) -> String {
        if colorsAreEqual(uiColor, .systemRed)    { return "Red" }
        if colorsAreEqual(uiColor, .systemOrange) { return "Orange" }
        if colorsAreEqual(uiColor, .systemYellow) { return "Yellow" }
        if colorsAreEqual(uiColor, .systemGreen)  { return "Green" }
        if colorsAreEqual(uiColor, .systemBlue)   { return "Blue" }
        if colorsAreEqual(uiColor, .systemPurple) { return "Purple" }
        if colorsAreEqual(uiColor, .brown)        { return "Brown" }
        return "Custom"
    }

    private func colorsAreEqual(_ c1: UIColor, _ c2: UIColor) -> Bool {
        var r1: CGFloat = 0, g1: CGFloat = 0, b1: CGFloat = 0, a1: CGFloat = 0
        var r2: CGFloat = 0, g2: CGFloat = 0, b2: CGFloat = 0, a2: CGFloat = 0
        c1.getRed(&r1, green: &g1, blue: &b1, alpha: &a1)
        c2.getRed(&r2, green: &g2, blue: &b2, alpha: &a2)
        return r1 == r2 && g1 == g2 && b1 == b2 && a1 == a2
    }
}
import SwiftUI
import UIKit

struct CalendarColorSelectionView: View {
    /// Тук държим избрания цвят, идва от AddCalendarView чрез @Binding
    @Binding var selectedColor: UIColor
    
    /// Показваме ли системния color picker
    @State private var showSystemColorPicker = false
    
    /// Списък с “готови” цветове и техните имена
    private let colorOptions: [(name: String, color: UIColor)] = [
        ("Red",    .systemRed),
        ("Orange", .systemOrange),
        ("Yellow", .systemYellow),
        ("Green",  .systemGreen),
        ("Blue",   .systemBlue),
        ("Purple", .systemPurple),
        ("Brown",  .brown)
    ]
    
    var body: some View {
        List {
            Section {
                // 1) Списък с готови цветове
                ForEach(colorOptions, id: \.name) { option in
                    HStack {
                        Circle()
                            .fill(Color(option.color))
                            .frame(width: 20, height: 20)
                        Text(option.name)
                            .padding(.leading, 4)
                        Spacer()
                        // Чекмарка, ако този цвят е избран
                        if colorsAreEqual(option.color, selectedColor) {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                    .contentShape(Rectangle()) // за да се клика целия ред
                    .onTapGesture {
                        selectedColor = option.color
                    }
                }
                
                // 2) Редът “Custom...”
                HStack {
                    Circle()
                        .fill(Color(selectedColor))
                        .frame(width: 20, height: 20)
                    
                    Text("Custom...")
                        .padding(.leading, 4)
                    
                    Spacer()
                    // Ако текущият selectedColor НЕ съвпада с никой от горните,
                    // тогава маркираме, че е “Custom”.
                    if !colorOptions.contains(where: { colorsAreEqual($0.color, selectedColor) }) {
                        Image(systemName: "checkmark")
                            .foregroundColor(.blue)
                    }
                }
                .contentShape(Rectangle())
                .onTapGesture {
                    showSystemColorPicker = true
                }
            }
        }
        .navigationTitle("Calendar Color")
        
        // >>> ТУК ползваме .sheet, но с iOS 16 модификатори <<<
        .sheet(isPresented: $showSystemColorPicker) {
            UIKitColorPicker(selectedColor: $selectedColor)
                .presentationDetents([.fraction(0.9), .large])
                .presentationBackground(Color(.systemBackground))
                .presentationDragIndicator(.visible)
        }

    }
    
    /// Помощна функция за сравнение на два UIColor
    private func colorsAreEqual(_ c1: UIColor, _ c2: UIColor) -> Bool {
        var r1: CGFloat = 0, g1: CGFloat = 0, b1: CGFloat = 0, a1: CGFloat = 0
        var r2: CGFloat = 0, g2: CGFloat = 0, b2: CGFloat = 0, a2: CGFloat = 0
        c1.getRed(&r1, green: &g1, blue: &b1, alpha: &a1)
        c2.getRed(&r2, green: &g2, blue: &b2, alpha: &a2)
        return r1 == r2 && g1 == g2 && b1 == b2 && a1 == a2
    }
}

import SwiftUI
import UIKit

struct UIKitColorPicker: UIViewControllerRepresentable {
    @Binding var selectedColor: UIColor
    @Environment(\.presentationMode) var presentationMode
    
    func makeUIViewController(context: Context) -> UIColorPickerViewController {
        let picker = UIColorPickerViewController()
        picker.selectedColor = selectedColor
        picker.delegate      = context.coordinator
        
        // >>> НЕ пипаме modalPresentationStyle, за да оставим SwiftUI sheet
        // picker.modalPresentationStyle = .fullScreen  (закоментирайте)

        // >>> Ако държите, може да зададете някакъв фон, но не е нужно
        // picker.view.backgroundColor = .white
        
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIColorPickerViewController, context: Context) {
        uiViewController.selectedColor = selectedColor
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, UIColorPickerViewControllerDelegate {
        let parent: UIKitColorPicker
        
        init(_ parent: UIKitColorPicker) {
            self.parent = parent
        }
        
        func colorPickerViewControllerDidFinish(_ viewController: UIColorPickerViewController) {
            parent.presentationMode.wrappedValue.dismiss()
        }
        
        func colorPickerViewController(_ viewController: UIColorPickerViewController,
                                       didSelect color: UIColor,
                                       continuously: Bool) {
            parent.selectedColor = color
        }
    }
}
