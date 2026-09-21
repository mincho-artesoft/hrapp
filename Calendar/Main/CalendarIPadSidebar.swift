#if os(iOS)
import SwiftUI
import EventKit

struct CalendarIPadSidebar: View {
    let selectedDate: Date
    @Binding var selectedEvent: CalendarSidebarEvent?
    let onSelectDate: (Date) -> Void
    let onOpenEvent: (AppLocalEventEditorTarget) -> Void
    @Environment(\.calendar) private var calendar
    @State private var month: Date
    @StateObject private var snapshot: CalendarIPadSidebarSnapshot
    @State private var hasAppeared = false
    @ObservedObject private var model = CalendarViewModel.shared
    @ObservedObject private var preferences = AppPreferences.shared

    init(selectedDate: Date, selectedEvent: Binding<CalendarSidebarEvent?>,
         onSelectDate: @escaping (Date) -> Void, onOpenEvent: @escaping (AppLocalEventEditorTarget) -> Void) {
        self.selectedDate = selectedDate
        self._selectedEvent = selectedEvent
        self.onSelectDate = onSelectDate
        self.onOpenEvent = onOpenEvent
        _month = State(initialValue: selectedDate)
        // StateObject evaluates this once, before the first body, not on every
        // parent update. Reopening starts from current local data, never [].
        _snapshot = StateObject(wrappedValue: CalendarIPadSidebarSnapshot(
            month: selectedDate, calendar: AppPreferences.shared.presentationCalendar))
    }

    var body: some View {
        CalendarSidebarView(selectedDate: selectedDate, month: $month, events: snapshot.events,
            selectedEvent: $selectedEvent,
            calendar: calendar, timeLabel: { appTimeFormatter().string(from: $0) },
            onSelectDate: onSelectDate, onOpenEvent: { item in
                if let event = item.nativeEvent {
                    onOpenEvent(.init(eventKitEvent: event, startsInEditingMode: false))
                } else if AppLocalCalendarStore.shared.event(id: item.id) != nil {
                    onOpenEvent(.init(eventID: item.id))
                }
            })
            .id(preferences.presentationRevision)
            .onChange(of: calendar) { _, _ in reload() }
            .onAppear {
                if hasAppeared { reload() }
                hasAppeared = true
            }
            .onChange(of: month) { _, _ in reload() }
            .onReceive(model.calendarContentDidChange) { _ in reload() }
            .onChange(of: model.accessGranted) { _, _ in reload() }
            .onChange(of: model.allCalendars.map(\.calendarIdentifier)) { _, _ in reload() }
    }

    private func reload() {
        snapshot.reload(month: month, calendar: calendar)
        if let selected = selectedEvent {
            if let native = selected.nativeEvent {
                selectedEvent = native.refresh() ? CalendarSidebarEvent(event: native) : nil
            } else {
                selectedEvent = CalendarSidebarEvent(descriptor: AppLocalEventDescriptor(eventID: selected.id,
                    partialStart: selected.start, partialEnd: selected.end))
            }
        }
    }
}

@MainActor
private final class CalendarIPadSidebarSnapshot: ObservableObject {
    @Published private(set) var events: [CalendarSidebarEvent]

    init(month: Date, calendar: Calendar) {
        events = Self.load(month: month, calendar: calendar)
    }

    func reload(month: Date, calendar: Calendar) {
        events = Self.load(month: month, calendar: calendar)
    }

    private static func load(month: Date, calendar: Calendar) -> [CalendarSidebarEvent] {
        let model = CalendarViewModel.shared
        let today = calendar.startOfDay(for: Date())
        let start = calendar.date(byAdding: .year, value: -1, to: today) ?? today
        let end = calendar.date(byAdding: .year, value: 3, to: today) ?? today
        var ranges = [DateInterval(start: start, end: end)]
        let days = CalendarSidebarLayout.monthDays(containing: month, calendar: calendar)
        if let first = days.first, let last = days.last,
           let gridEnd = calendar.date(byAdding: .day, value: 1, to: last), first < start || gridEnd > end {
            ranges.append(DateInterval(start: first, end: gridEnd))
        }
        let calendars = model.allCalendars.filter { model.selectedCalendarIDs.contains($0.calendarIdentifier) }
        var items: [String: CalendarSidebarEvent] = [:]
        for range in ranges {
            if model.isCalendarAccessGranted(), !calendars.isEmpty {
                let predicate = model.eventStore.predicateForEvents(withStart: range.start, end: range.end, calendars: calendars)
                for event in model.eventStore.events(matching: predicate) {
                    let item = CalendarSidebarEvent(event: event)
                    items[item.id] = item
                }
            }
            // App-owned/shared calendars do not necessarily have an EKEvent.
            for event in AppLocalCalendarStore.shared.events(from: range.start, to: range.end,
                selectedCalendarIDs: model.selectedCalendarIDs) {
                let descriptor = AppLocalEventDescriptor(eventID: event.id,
                    partialStart: event.startDate, partialEnd: event.endDate)
                items[event.id] = CalendarSidebarEvent(id: event.id, title: event.title,
                    start: event.startDate, end: event.endDate, isAllDay: event.isAllDay,
                    color: Color(uiColor: descriptor.color),
                    calendarTitle: AppLocalCalendarStore.shared.calendar(id: event.calendarID)?.title ?? "",
                    location: event.location, notes: event.notes, isCancelled: descriptor.isCancelled)
            }
        }
        return Array(items.values)
    }
}

extension CalendarSidebarEvent {
    @MainActor
    init?(descriptor: EventDescriptor) {
        if let system = descriptor as? EKMultiDayWrapper {
            self.init(event: system.ekEvent)
        } else if let local = descriptor as? AppLocalEventDescriptor,
                  let event = AppLocalCalendarStore.shared.event(id: local.eventID) {
            // Use the whole event, not the tapped day's multi-day slice.
            self.init(id: event.id, title: event.title, start: event.startDate, end: event.endDate,
                isAllDay: event.isAllDay, color: Color(uiColor: local.color),
                calendarTitle: AppLocalCalendarStore.shared.calendar(id: event.calendarID)?.title ?? "",
                location: event.location, notes: event.notes, isCancelled: local.isCancelled)
        } else {
            return nil
        }
    }
}

#endif
