import SwiftUI
import EventKit
import AppKit

// Calendar surfaces, editors and the header picker come from Wonek.
// HRApp supplies the menu sections, Weather and calendar sync.
struct CalendarMacRoot: View {
    @StateObject private var store = MacCalendarLaunch.makeStore()
    @State private var selectedDate = Date()
    @State private var displayedMonth = Date()
    @State private var displayedYear = Calendar.current.component(.year, from: Date())
    @AppStorage("selectedTabRoot") private var selectedTab = 0
    @State private var multiDayCount = 8
    @State private var rangePickerIsOpen = false
    @State private var viewMenuIsOpen = false
    @State private var search = ""
    @State private var searching = false
    @State private var sidebarMonth = Date()
    @State private var listScrollRequest: CalendarListScrollRequest?
    @AppStorage("MacSelectedMenuSection") private var menuSection = 0
    @State private var editorTarget: MacTabletEventEditorTarget?
    @State private var calendarEditorTarget: MacCalendarEditorTarget?
    @State private var accountOpen = false
    @AppStorage("MacLastCalendarTab") private var lastCalendarTab = 0
    @AppStorage("EventNotificationsEnabled") private var eventNotifications = false
    @Environment(\.scenePhase) private var scenePhase
    @ObservedObject private var appPreferences = AppPreferences.shared
    private var calendar: Calendar { MacCalendarFormatting.calendar }
    private var rangeEnd: Date { calendar.date(byAdding: .day, value: multiDayCount - 1, to: selectedDate) ?? selectedDate }

    var body: some View {
        GeometryReader { geometry in
            if selectedTab == 6 {
                MacWeatherKitView(selectedTab: selectedTab, onCreateEvent: { date in
                    guard store.defaultWritableCalendar != nil else { store.errorMessage = NSLocalizedString("Add a writable calendar first.", comment: ""); return }
                    editorTarget = .init(event: nil, defaultDate: date, usesExactStart: true)
                }, onViewChange: { selectedTab = $0 })
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                HStack(spacing: 0) {
                    sidebar.frame(width: CalendarSidebarLayout.width(availableWidth: geometry.size.width))
                    Divider()
                    ZStack(alignment: .topTrailing) {
                        VStack(spacing: 0) {
                            CalendarSearchHeader(isSearching: searching, height: CalendarHeaderLayout.height) {
                                header
                            } search: {
                                searchBar
                            }
                            Divider()
                            if selectedTab == 7 { menuPage }
                            else if searching && !search.isEmpty {
                                MacTabletSearchResultsView(store: store, query: search, editorTarget: $editorTarget)
                            } else { activeView }
                        }
                        .accessibilityHidden(viewMenuIsOpen || rangePickerIsOpen)
                        if viewMenuIsOpen || rangePickerIsOpen {
                            Color.black.opacity(0.001).contentShape(Rectangle())
                                .onTapGesture { viewMenuIsOpen = false; rangePickerIsOpen = false }
                        }
                        if viewMenuIsOpen { viewMenu.padding(.top, 48).padding(.trailing, 53) }
                        if rangePickerIsOpen {
                            MacCalendarDateRangePicker(start: selectedDate, end: rangeEnd, onDismiss: { rangePickerIsOpen = false }) { start, end in
                                selectedDate = start
                                multiDayCount = MacCalendarRangeSelection(start: start, end: end).dayCount(calendar: calendar) ?? 8
                            }.padding(.top, 54).padding(.leading, 16).frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                }
            }
        }
        .background(CalendarPalette.background)
        .preferredColorScheme(appPreferences.theme.preferredColorScheme)
        .appSheet(item: $editorTarget) { target in
            MacTabletEventEditor(store: store, target: target) { editorTarget = nil }
                .frame(width: 600, height: 720).interactiveDismissDisabled()
        }
        .appSheet(item: $calendarEditorTarget) { target in
            MacTabletCalendarEditor(store: store, target: target) { calendarEditorTarget = nil }
                .frame(width: 600, height: 680).interactiveDismissDisabled()
        }
        .appSheet(isPresented: $accountOpen) { MacCalendarAccountView(store: store.backend) }
        .alert("Calendar", isPresented: Binding(get: { store.errorMessage != nil || store.backend.error != nil }, set: { if !$0 { store.errorMessage = nil; store.backend.error = nil } })) {
            Button("OK") { store.errorMessage = nil; store.backend.error = nil }
        } message: { Text(store.errorMessage ?? store.backend.error ?? "") }
        .onReceive(NotificationCenter.default.publisher(for: .notificationDraggableMenuViewSub)) { _ in
            accountOpen = false; selectedTab = 7; menuSection = 2
        }
        .onReceive(store.$events) { _ in MacCalendarReminderScheduler.shared.refresh(store: store) }
        .onChange(of: eventNotifications) { _, enabled in MacCalendarReminderScheduler.shared.refresh(store: store, requestPermission: enabled) }
        .onChange(of: selectedTab) { oldTab, _ in
            if oldTab < 6 { lastCalendarTab = oldTab }
            searching = false; search = ""; rangePickerIsOpen = false; viewMenuIsOpen = false
        }
        .onChange(of: scenePhase) { _, phase in if phase == .active { store.reload() } }
        .onExitCommand {
            if viewMenuIsOpen || rangePickerIsOpen { rangePickerIsOpen = false; viewMenuIsOpen = false }
            else if selectedTab >= 6 { selectedTab = lastCalendarTab }
        }
        .task {
            if MacCalendarMode(rawValue: selectedTab) == nil { selectedTab = 0 }
            if !(0...5).contains(lastCalendarTab) { lastCalendarTab = 0 }
            if !(0...5).contains(menuSection) { menuSection = 0 }
            if store.includesSystemCalendars { await store.activate() }
            while !Task.isCancelled { await store.backend.sync(); try? await Task.sleep(for: .seconds(30)) }
        }
        .environment(\.appContextMenuFocusEnabled, false)
    }

    @ViewBuilder private var activeView: some View {
        switch selectedTab {
        case 1: MacTabletDayView(store: store, selectedDate: $selectedDate, editorTarget: $editorTarget)
        case 2: MacTabletYearView(store: store, year: $displayedYear, month: $displayedMonth, selectedTab: $selectedTab)
        case 3: MacTabletMultiDayView(store: store, startDate: $selectedDate, dayCount: multiDayCount, selectedTab: $selectedTab, editorTarget: $editorTarget)
        case 4: MacTabletListView(store: store, scrollRequest: listScrollRequest, editorTarget: $editorTarget)
        case 5: MacTabletMultiCalendarView(store: store, selectedDate: $selectedDate, editorTarget: $editorTarget)
        default: MacTabletMonthView(store: store, month: $displayedMonth, selectedDate: $selectedDate, selectedTab: $selectedTab, editorTarget: $editorTarget)
        }
    }
    private var header: some View {
        HStack(spacing: 9) {
            switch selectedTab {
            case 1, 5:
                Button {
                    displayedMonth = calendar.dateInterval(of: .month, for: selectedDate)?.start ?? selectedDate
                    selectedTab = 0
                } label: {
                    Text(selectedDate.formatted(.dateTime.month(.wide).locale(.appFormatting)))
                        .font(CalendarTypography.headline)
                        .foregroundStyle(.appBlue)
                }
                .buttonStyle(.plain)
            case 3:
                Button {
                    viewMenuIsOpen = false
                    rangePickerIsOpen.toggle()
                } label: {
                    Text(multiDayRangeTitle)
                        .font(CalendarTypography.headline)
                        .foregroundStyle(Color.primary)
                        .lineLimit(1)
                        .fixedSize(horizontal: true, vertical: false)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 7)
                        .background(Color.secondary.opacity(0.09), in: RoundedRectangle(cornerRadius: 8))
                        .contentShape(RoundedRectangle(cornerRadius: 8))
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Choose date range")
                .accessibilityValue(multiDayRangeTitle)
            default:
                EmptyView()
            }

            Spacer(minLength: 8)

            if selectedTab != 7 {
                Button(action: newEvent) {
                    Image(systemName: "plus")
                        .font(.system(size: 21, weight: .medium))
                        .frame(width: 30, height: 30).contentShape(Rectangle())
                }
                .buttonStyle(.plain).foregroundStyle(Color.appBlue)
                .accessibilityLabel("New Event").help("New Event")
                .keyboardShortcut("n", modifiers: .command)
                Button {
                    searching = true
                } label: {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 21, weight: .medium))
                }
                .buttonStyle(.plain)
                .foregroundStyle(Color.appBlue)
                .help("Search events")
            }

            Button {
                viewMenuIsOpen.toggle()
            } label: {
                Image(systemName: icon(for: selectedTab == 7 ? lastCalendarTab : selectedTab))
                    .font(.system(size: 20, weight: .regular))
                    .frame(width: 30, height: 30)
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .foregroundStyle(Color.appBlue)
            .help("Calendar views")
            .accessibilityLabel("Calendar views")

            MacCalendarMenuButton(tint: .appBlue) {
                selectedTab = 7
                viewMenuIsOpen = false
                rangePickerIsOpen = false
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .frame(minHeight: 46)
    }

    private var searchBar: some View {
        CalendarEventSearchField(text: $search) {
            searching = false
            search = ""
        }
    }

    private var viewMenu: some View {
        MacCalendarModeMenu(selectedTab: selectedTab) { selectedTab = $0; viewMenuIsOpen = false }
    }

    private func icon(for tab: Int) -> String { MacCalendarMode(rawValue: tab)?.symbol ?? "calendar" }
    private var multiDayRangeTitle: String {
        let formatter = MacCalendarFormatting.dateFormatter()
        return "\(formatter.string(from: selectedDate)) - \(formatter.string(from: rangeEnd))"
    }
    private var sidebar: some View {
        CalendarSidebarView(selectedDate: selectedTab == 0 ? displayedMonth : selectedDate, month: $sidebarMonth,
            events: store.sidebarEvents(in: sidebarMonth).map(store.sidebarEvent),
            selectedEvent: $store.selectedSidebarEvent, calendar: calendar,
            timeLabel: { MacCalendarFormatting.time($0) }, onSelectDate: selectDate, onOpenEvent: { item in
                guard let event = item.nativeEvent else { return }
                editorTarget = .init(event: event, defaultDate: event.startDate, startsInEditingMode: false)
            })
    }
    private func selectDate(_ date: Date) {
        store.selectedSidebarEvent = nil
        selectedDate = date
        displayedMonth = calendar.dateInterval(of: .month, for: date)?.start ?? date
        displayedYear = calendar.component(.year, from: date)
        searching = false; search = ""; rangePickerIsOpen = false
        if selectedTab == 4 { listScrollRequest = .init(date: date) }
        if ![1, 3, 4, 5].contains(selectedTab) { selectedTab = 1 }
    }
    private var menuPage: some View {
        VStack(spacing: 0) {
            DraggableMenuSectionPicker(selection: $menuSection)
                .frame(maxWidth: 820)
                .padding(.horizontal, 16)
                .padding(.vertical, 16)
            Divider()
            menuContent
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(CalendarPalette.background)
        .accessibilityIdentifier("calendar.mac.menuPage")
    }
    @ViewBuilder private var menuContent: some View {
        switch menuSection {
        case 5:
            MacCalendarSettingsView { accountOpen = true }
        case 0, 1:
            MacCalendarMenuList(store: store, isMultiCalendar: menuSection == 1,
                editCalendar: { calendarEditorTarget = $0 }, openAccount: { accountOpen = true })
        case 4: MacCalendarSharingView(store: store, account: store.backend) { accountOpen = true }
        case 2: SubscriptionView()
        default: AppsPromoListView(apps: AppPromoCatalog.apps)

        }
    }
    private func newEvent() {
        guard store.defaultWritableCalendar != nil else { store.errorMessage = NSLocalizedString("Add a writable calendar first.", comment: ""); return }
        editorTarget = .init(event: nil, defaultDate: selectedDate)
    }

}

private struct MacCalendarAccountView: View {
    @ObservedObject var store: CalendarMacStore
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        VStack(spacing: 0) {
            MacCalendarSheetHeader(title: Text("Cloud Calendars account")) {
                AppToolbarTextButton("Close") { CloudAccountManager.shared.cancelSignIn(); dismiss() }
            } trailing: { EmptyView() }
            ScrollView {
                VStack(spacing: 12) {
                    CloudAccountSignInContent()
                    MacCalendarSyncStatus(store: store)
                }.padding(20)
            }
        }.background(CalendarPalette.groupedBackground)
            .frame(width: 600, height: 620)
            .onDisappear { CloudAccountManager.shared.cancelSignIn() }
    }
}

enum MacCalendarMode: Int, CaseIterable {
    case day = 1, multiDay = 3, month = 0, year = 2, list = 4, multiCalendar = 5, weather = 6, menu = 7
    var title: String { self == .menu ? "Menu" : CalendarHeaderMode(rawValue: rawValue)!.title }
    var symbol: String { self == .menu ? "line.3.horizontal" : CalendarHeaderMode(rawValue: rawValue)!.symbol }
}
