import SwiftUI

/// The same inline calendar on all platforms, using the range calendar's day style.
struct CalendarInlineDateGrid: View {
    @Binding var selection: Date
    let range: ClosedRange<Date>
    @Environment(\.calendar) private var calendar
    @Environment(\.locale) private var locale
    @State private var visibleMonth: Date?
    @State private var showsMonthAndYear = false

    private var month: Date {
        calendar.dateInterval(of: .month, for: visibleMonth ?? selection)?.start ?? selection
    }
    private var days: Int { calendar.range(of: .day, in: .month, for: month)?.count ?? 30 }
    private var blanks: Int { (calendar.component(.weekday, from: month) - calendar.firstWeekday + 7) % 7 }

    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) { showsMonthAndYear.toggle() }
                } label: {
                    HStack(spacing: 5) {
                        Text(format(month, template: "MMMM yyyy")).bold()
                            .foregroundStyle(showsMonthAndYear ? Color.accentColor : Color.primary)
                        Image(systemName: showsMonthAndYear ? "chevron.down" : "chevron.forward")
                    }.frame(minHeight: 44).contentShape(Rectangle())
                }.accessibilityLabel("Choose month and year")
                Spacer(minLength: 8)
                Button { shiftMonth(-1) } label: {
                    Image(systemName: "chevron.backward").frame(width: 40, height: 44).contentShape(Rectangle())
                }.accessibilityLabel("Previous month")
                Button { shiftMonth(1) } label: {
                    Image(systemName: "chevron.forward").frame(width: 40, height: 44).contentShape(Rectangle())
                }.accessibilityLabel("Next month")
            }
            .buttonStyle(.plain).foregroundStyle(Color.accentColor)
            if showsMonthAndYear {
                CalendarValueWheels(columns: [
                    calendar.standaloneMonthSymbols.enumerated().map { ($0.offset + 1, $0.element) },
                    (1...9999).map { ($0, localizedIntegerString($0)) }
                ], selections: [monthBinding(.month), monthBinding(.year)])
            } else {
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 0), count: 7), spacing: 4) {
                    ForEach(0..<7, id: \.self) { index in
                        Text(calendar.shortStandaloneWeekdaySymbols[(calendar.firstWeekday - 1 + index) % 7].uppercased(with: locale))
                            .font(.system(size: 13, weight: .semibold)).foregroundStyle(.secondary)
                            .frame(height: 26)
                    }
                    ForEach(0..<(blanks + days), id: \.self) { index in
                        if index < blanks { Color.clear.frame(height: 40).accessibilityHidden(true) }
                        else if let date = calendar.date(byAdding: .day, value: index - blanks, to: month) {
                            dayButton(date)
                        }
                    }
                }
            }
        }
        .frame(maxWidth: 420)
        .frame(maxWidth: .infinity)
        .onChange(of: selection) { _, value in
            if !calendar.isDate(value, equalTo: month, toGranularity: .month) { visibleMonth = value }
        }
    }

    private func dayButton(_ date: Date) -> some View {
        let selected = calendar.isDate(date, inSameDayAs: selection)
        let available = calendar.startOfDay(for: date) >= calendar.startOfDay(for: range.lowerBound)
            && calendar.startOfDay(for: date) <= calendar.startOfDay(for: range.upperBound)
        return Button {
            let time = calendar.dateComponents([.hour, .minute, .second], from: selection)
            let value = calendar.date(bySettingHour: time.hour ?? 0, minute: time.minute ?? 0,
                second: time.second ?? 0, of: date) ?? date
            selection = min(max(value, range.lowerBound), range.upperBound)
        } label: {
            CalendarPickerDay(number: calendar.component(.day, from: date), isSelected: selected,
                isToday: calendar.isDateInToday(date), isEnabled: available)
                .frame(maxWidth: .infinity).contentShape(Rectangle())
        }
        .buttonStyle(.plain).disabled(!available)
        .accessibilityLabel(format(date, template: "EEEE d MMMM yyyy"))
        .accessibilityAddTraits(selected ? .isSelected : [])
    }

    private func monthBinding(_ component: Calendar.Component) -> Binding<Int> {
        Binding(get: { calendar.component(component, from: month) }, set: { value in
            var parts = calendar.dateComponents([.year, .month], from: month)
            parts.setValue(value, for: component)
            visibleMonth = calendar.date(from: parts) ?? month
        })
    }
    private func shiftMonth(_ offset: Int) { visibleMonth = calendar.date(byAdding: .month, value: offset, to: month) }
    private func format(_ date: Date, template: String) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale; formatter.calendar = calendar; formatter.timeZone = calendar.timeZone
        formatter.setLocalizedDateFormatFromTemplate(template)
        return formatter.string(from: date)
    }
}
