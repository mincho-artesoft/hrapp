import SwiftUI
import EventKit

/// Value snapshots keep the shared rail independent of each platform's event store.
/// The occurrence start belongs in the identity: recurring EventKit instances can
/// share a calendar-item identifier, but must remain separately selectable.
struct CalendarSidebarEvent: Identifiable {
    let id: String
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let color: Color
    let calendarTitle: String
    let location: String
    let notes: String
    let isCancelled: Bool
    // Retain the selected occurrence for opening, even if its calendar is only
    // enabled in MultiCalendar rather than in the sidebar's upcoming list.
    let nativeEvent: EKEvent?

    init(event: EKEvent) {
        id = Self.identity(for: event)
        title = event.title ?? ""
        start = event.startDate
        end = event.endDate
        isAllDay = event.isAllDay
        color = event.calendar.cgColor.map { Color(cgColor: $0) } ?? .blue
        calendarTitle = event.calendar.title
        location = event.location ?? ""
        notes = event.notes ?? ""
        isCancelled = event.status == .canceled
        nativeEvent = event
    }

    init(id: String, title: String, start: Date, end: Date, isAllDay: Bool,
         color: Color, calendarTitle: String, location: String, notes: String,
         isCancelled: Bool = false) {
        self.id = id; self.title = title; self.start = start; self.end = end
        self.isAllDay = isAllDay; self.color = color; self.calendarTitle = calendarTitle
        self.location = location; self.notes = notes
        self.isCancelled = isCancelled
        self.nativeEvent = nil
    }

    static func identity(for event: EKEvent) -> String {
        "ek:\(event.eventIdentifier ?? event.calendarItemIdentifier):\(event.startDate.timeIntervalSinceReferenceDate)"
    }

    var displayTitle: String { title.isEmpty ? NSLocalizedString("No Title", comment: "") : title }
}

/// Landscape iPad rail; opens this app's existing provider-neutral event editor.
struct CalendarSidebarView: View {
    let selectedDate: Date
    @Binding var month: Date
    let events: [CalendarSidebarEvent]
    @Binding var selectedEvent: CalendarSidebarEvent?
    let calendar: Calendar
    let timeLabel: (Date) -> String
    let onSelectDate: (Date) -> Void
    let onOpenEvent: (CalendarSidebarEvent) -> Void

    private var sortedEvents: [CalendarSidebarEvent] {
        events.sorted { $0.start == $1.start ? $0.id < $1.id : $0.start < $1.start }
    }

    var body: some View {
        let sorted = sortedEvents
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                TimelineView(.periodic(from: .now, by: 60)) { context in
                    VStack(alignment: .leading, spacing: 10) {
                        sectionTitle("Up next")
                        if let event = sorted.first(where: {
                            CalendarSidebarLayout.isUpcoming(isAllDay: $0.isAllDay, end: $0.end, now: context.date)
                        }) {
                            eventCard(event)
                        } else {
                            Text("Nothing upcoming")
                                .font(.subheadline).foregroundStyle(.secondary)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(12).background(Color(uiColor: .systemGray6), in: RoundedRectangle(cornerRadius: 8))
                        }
                    }
                }
                miniCalendar(events: sorted)
                if let selectedEvent {
                    eventInspector(events.first(where: { $0.id == selectedEvent.id }) ?? selectedEvent)
                }
                CalendarScrollFooter()
            }
            .padding(16)
        }
        .background(Color(uiColor: .systemBackground).opacity(0.76))
        .frame(maxHeight: .infinity, alignment: .top)
        .accessibilityIdentifier("calendar.sidebar")
        .onChange(of: selectedDate) { _, date in
            if !calendar.isDate(month, equalTo: date, toGranularity: .month) { month = date }
        }
    }

    private func miniCalendar(events: [CalendarSidebarEvent]) -> some View {
        let days = CalendarSidebarLayout.monthDays(containing: month, calendar: calendar)
        return VStack(spacing: 10) {
            HStack {
                Button { moveMonth(-1) } label: { Image(systemName: "chevron.left").frame(width: 28, height: 28) }
                    .accessibilityLabel("Previous month").accessibilityIdentifier("calendar.sidebar.previousMonth")
                Spacer(minLength: 0)
                Text(dateLabel(month, template: "MMMM y")).font(.subheadline.weight(.semibold))
                    .lineLimit(1).minimumScaleFactor(0.7)
                Spacer(minLength: 0)
                Button { moveMonth(1) } label: { Image(systemName: "chevron.right").frame(width: 28, height: 28) }
                    .accessibilityLabel("Next month").accessibilityIdentifier("calendar.sidebar.nextMonth")
            }.buttonStyle(.plain)
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 4, alignment: .top), count: 7), spacing: 6) {
                ForEach(0..<7, id: \.self) { offset in
                    Text(calendar.veryShortStandaloneWeekdaySymbols[(calendar.firstWeekday - 1 + offset) % 7])
                        .font(.caption2.weight(.semibold)).foregroundStyle(.secondary)
                }
                ForEach(days, id: \.self) { day in
                    dayButton(day, colors: eventColors(on: day, events: events))
                }
            }
            Button("Today") { selectDate(Date()) }
                .font(.caption.weight(.semibold)).buttonStyle(.plain).foregroundStyle(.blue)
                .frame(maxWidth: .infinity, minHeight: 28)
                .accessibilityIdentifier("calendar.sidebar.today")
        }
        .padding(12)
        .background {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Color(uiColor: .secondarySystemGroupedBackground))
                .shadow(color: .black.opacity(0.06), radius: 5, y: 2)
        }
        .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous)
            .strokeBorder(Color.primary.opacity(0.08)))
        .accessibilityIdentifier("calendar.sidebar.monthCard")
    }

    private func eventColors(on day: Date, events: [CalendarSidebarEvent]) -> [Color] {
        CalendarSidebarLayout.eventColors(on: day, calendar: calendar, events: events,
            start: { $0.start }, end: { $0.end }, color: { $0.color })
    }

    private func dayButton(_ day: Date, colors: [Color]) -> some View {
        let selected = calendar.isDate(day, inSameDayAs: selectedDate)
        let today = calendar.isDateInToday(day)
        let inMonth = calendar.isDate(day, equalTo: month, toGranularity: .month)
        return Button { selectDate(day) } label: {
            VStack(spacing: 2) {
                Text(localizedIntegerString(calendar.component(.day, from: day)))
                    .font(.caption.weight(selected || today ? .bold : .medium))
                    .foregroundStyle(selected ? Color.white : today ? .red : inMonth ? .primary : .secondary.opacity(0.55))
                    .frame(width: 26, height: 26)
                    .background(selected ? (today ? Color.red : .blue) : .clear, in: Circle())
                CalendarDayEventDots(colors: colors)
            }
            .frame(maxWidth: .infinity, minHeight: 34).contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(dateLabel(day, template: "EEEE d MMMM y"))
        .accessibilityAddTraits(selected ? [.isSelected] : [])
        .accessibilityIdentifier("calendar.sidebar.day.\(calendar.component(.year, from: day))-\(calendar.component(.month, from: day))-\(calendar.component(.day, from: day))")
    }

    private func sectionTitle(_ text: LocalizedStringKey) -> some View {
        Text(text).font(.caption.weight(.bold)).foregroundStyle(.secondary).textCase(.uppercase)
    }

    private func eventCard(_ event: CalendarSidebarEvent) -> some View {
        Button {
            selectDate(event.start)
            selectedEvent = event
        } label: {
            VStack(alignment: .leading, spacing: 6) {
                Text(eventDateLabel(event.start))
                    .font(.caption).foregroundStyle(.secondary)
                CalendarSidebarEventRow(title: event.displayTitle, color: event.color,
                    allDay: event.isAllDay,
                    symbol: nil,
                    isCancelled: event.isCancelled) {
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(timeLabel(event.start))
                        Text(timeLabel(event.end))
                    }
                    .fixedSize()
                }
                .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle())
        }.buttonStyle(.plain)
            .accessibilityIdentifier("calendar.sidebar.upNext")
    }

    private func eventInspector(_ event: CalendarSidebarEvent) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top, spacing: 8) {
                Circle().fill(event.color).frame(width: 10, height: 10).padding(.top, 5)
                Text(event.displayTitle).font(.title3.weight(.semibold))
                    .accessibilityIdentifier("calendar.sidebar.selectedTitle")
            }
            Text(eventDateLabel(event.start)).font(.caption).foregroundStyle(.secondary)
            Text(eventTime(event)).font(.subheadline.weight(.medium))
            Label(event.calendarTitle, systemImage: "calendar").font(.caption).foregroundStyle(.secondary)
            if !event.location.isEmpty {
                Label(event.location, systemImage: "mappin.and.ellipse").font(.caption).foregroundStyle(.secondary)
            }
            if !event.notes.isEmpty {
                Divider()
                Text(event.notes).font(.subheadline).foregroundStyle(.secondary).lineLimit(5)
            }
            Button { onOpenEvent(event) } label: {
                Label("Open event", systemImage: "arrow.forward.circle")
            }.buttonStyle(.borderedProminent).controlSize(.small)
                .accessibilityIdentifier("calendar.sidebar.openEvent")
        }.frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityElement(children: .contain)
            .accessibilityIdentifier("calendar.sidebar.selectedEvent")
    }

    private func selectDate(_ date: Date) {
        month = date
        onSelectDate(calendar.startOfDay(for: date))
    }

    private func moveMonth(_ offset: Int) {
        // Browsing the mini calendar does not move the main view until a day is picked.
        let start = calendar.dateInterval(of: .month, for: month)?.start ?? month
        month = calendar.date(byAdding: .month, value: offset, to: start) ?? start
    }

    private func dateLabel(_ date: Date, template: String) -> String {
        #if os(iOS)
        let formatter = appDateFormatter(template: template, timeZone: calendar.timeZone)
        #else
        let formatter = DateFormatter()
        formatter.calendar = calendar; formatter.locale = calendar.locale ?? .autoupdatingCurrent
        formatter.timeZone = calendar.timeZone
        formatter.setLocalizedDateFormatFromTemplate(template)
        #endif
        return formatter.string(from: date)
    }

    /// Event dates use the exact Settings format, not a sidebar-only template.
    private func eventDateLabel(_ date: Date) -> String {
        #if os(macOS)
        let formatter = MacCalendarFormatting.dateFormatter()
        formatter.timeZone = calendar.timeZone
        #else
        let formatter = appShortDateFormatter(timeZone: calendar.timeZone)
        #endif
        return formatter.string(from: date)
    }

    private func eventTime(_ event: CalendarSidebarEvent) -> String {
        event.isAllDay ? NSLocalizedString("all-day", comment: "") : "\(timeLabel(event.start)) – \(timeLabel(event.end))"
    }
}

/// Matches the event list's coloured bar, regular title and trailing times.
private struct CalendarSidebarEventRow<Times: View>: View {
    let title: String
    let color: Color
    let allDay: Bool
    let symbol: String?
    let isCancelled: Bool
    @ViewBuilder var times: () -> Times

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            if !allDay { RoundedRectangle(cornerRadius: 1.5).fill(color).frame(width: 3) }
            if let symbol { Image(systemName: symbol).foregroundStyle(color) }
            Text(title).font(.body).foregroundStyle(.primary).strikethrough(isCancelled, color: color)
            Spacer()
            times().font(.subheadline).foregroundStyle(.gray)
        }
        .padding(.vertical, 6)
        .contentShape(Rectangle())
    }
}
