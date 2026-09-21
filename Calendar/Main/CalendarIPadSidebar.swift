#if os(iOS)
import SwiftUI
import EventKit

struct CalendarIPadSidebar: View {
    let selectedDate: Date
    @Binding var selectedEvent: CalendarSidebarEvent?
    let onSelectDate: (Date) -> Void
    let onOpenEvent: (AppLocalEventEditorTarget) -> Void
    @Environment(\.calendar) private var calendar
    @State private var month = Date()
    @State private var events: [CalendarSidebarEvent] = []
    @ObservedObject private var model = CalendarViewModel.shared
    @ObservedObject private var preferences = AppPreferences.shared

    var body: some View {
        CalendarSidebarView(selectedDate: selectedDate, month: $month, events: events,
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
            .onAppear { month = selectedDate; reload() }
            .onChange(of: month) { _, _ in reload() }
            .onReceive(model.calendarContentDidChange) { _ in reload() }
            .onChange(of: model.accessGranted) { _, _ in reload() }
    }

    private func reload() {
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
        events = Array(items.values)
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

/// Read this calendar's own window, not UIScreen or a global key window. The
/// app's navigation rail, keyboard and presented sheets must not flip the
/// orientation test for the calendar underneath them.
struct CalendarWindowSizeReader: UIViewRepresentable {
    let onChange: (CGSize) -> Void
    func makeUIView(context: Context) -> SizeView { SizeView() }
    func updateUIView(_ view: SizeView, context: Context) { view.onChange = onChange }

    final class SizeView: UIView {
        var onChange: ((CGSize) -> Void)?
        private var lastSize = CGSize.zero
        override func didMoveToWindow() { super.didMoveToWindow(); reportSize() }
        override func layoutSubviews() { super.layoutSubviews(); reportSize() }
        private func reportSize() {
            guard let size = window?.bounds.size, size != lastSize else { return }
            lastSize = size
            DispatchQueue.main.async { [weak self] in self?.onChange?(size) }
        }
    }
}
#endif
