import SwiftUI

/// A form owns one focus value for all date rows, including the recurrence end.
struct CalendarDatePickerFocus: Equatable {
    enum Component { case date, time }
    let row: String
    let component: Component
}

struct CalendarDateTimePickerRow: View {
    let title: LocalizedStringKey
    let id: String
    @Binding var selection: Date
    var range: ClosedRange<Date> = Date.distantPast...Date.distantFuture
    var showsTime = true
    @Binding var expanded: CalendarDatePickerFocus?
    @Environment(\.timeZone) private var timeZone
    @Environment(\.calendarDatePickerColumnDates) private var columnDates
    @ObservedObject private var preferences = AppPreferences.shared

    private var calendar: Calendar {
        var value = preferences.presentationCalendar
        value.timeZone = timeZone
        return value
    }

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                Text(title).foregroundStyle(.primary)
                Spacer(minLength: 8)
                HStack(spacing: 6) {
                    valueButton(.date)
                    if showsTime { valueButton(.time) }
                }
                .layoutPriority(1)
            }
            .frame(minHeight: rowHeight)
            if let focus = expanded, focus.row == id {
                Divider()
                inlinePicker(focus.component)
                    .padding(.vertical, 8)
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .id("calendar-row-\(id)")
        .clipped()
        .environment(\.locale, preferences.presentationLocale)
        .environment(\.calendar, calendar)
        .onChange(of: showsTime) { _, value in
            if !value && expanded == CalendarDatePickerFocus(row: id, component: .time) {
                expanded = nil
            }
        }
    }

    private var rowHeight: CGFloat {
        #if os(macOS)
        44
        #else
        34
        #endif
    }

    private func valueButton(_ component: CalendarDatePickerFocus.Component) -> some View {
        let focus = CalendarDatePickerFocus(row: id, component: component)
        return Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                expanded = expanded == focus ? nil : focus
            }
        } label: {
            CalendarDatePickerValue(value: displayText(selection, component),
                columnValues: columnDates.map { displayText($0, component) },
                isActive: expanded == focus)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(title)
        .accessibilityValue(displayText(selection, component))
        .accessibilityAddTraits(expanded == focus ? .isSelected : [])
        .accessibilityIdentifier("calendar-\(id)-\(component)")
    }

    @ViewBuilder
    private func inlinePicker(_ component: CalendarDatePickerFocus.Component) -> some View {
        #if os(macOS)
        MacCalendarInlineDatePicker(selection: $selection, range: range,
            isTime: component == .time)
        #else
        if component == .date {
            CalendarInlineDateGrid(selection: $selection, range: range)
        } else {
            DatePicker(title, selection: $selection, in: range, displayedComponents: .hourAndMinute)
                .datePickerStyle(.wheel)
                .labelsHidden()
                .frame(maxWidth: .infinity)
        }
        #endif
    }

    private func displayText(_ date: Date, _ component: CalendarDatePickerFocus.Component) -> String {
        #if os(macOS)
        date.appFormatted(date: component == .date, time: component == .time, timeZone: timeZone)
        #else
        component == .date
            ? appShortDateFormatter(timeZone: timeZone, includesYear: true).string(from: date)
            : appTimeFormatter(timeZone: timeZone).string(from: date)
        #endif
    }
}
