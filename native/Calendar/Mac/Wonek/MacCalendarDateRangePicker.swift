// Ported from Wonek Main/MacCalendarDateRangePicker.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI

/// Same 350-point floating calendar, 40-point day cells, range selection and
/// month/year wheel hierarchy as CalendarDateRangePickerViewController on iPad.
struct MacCalendarDateRangePicker: View {
    @ObservedObject private var appPreferences = AppPreferences.shared
    let onDismiss: () -> Void
    let onRangeChange: (Date, Date) -> Void
    @State private var month: Date
    @State private var selection: MacCalendarRangeSelection
    @State private var showsMonthPicker = false
    @FocusState private var hasFocus: Bool
    @State private var selectionBeforeDrag: MacCalendarRangeSelection?
    @State private var scrollHandle = MacCalendarScrollHandle()
    @Environment(\.layoutDirection) private var direction
    private var calendar: Calendar { MacCalendarFormatting.calendar }
    private let width: CGFloat = 350
    private let cellHeight: CGFloat = 40

    init(start: Date, end: Date, onDismiss: @escaping () -> Void, onRangeChange: @escaping (Date, Date) -> Void) {
        self.onRangeChange = onRangeChange
        self.onDismiss = onDismiss
        _month = State(initialValue: MacCalendarFormatting.calendar.dateInterval(of: .month, for: start)?.start ?? start)
        _selection = State(initialValue: .init(start: start, end: end))
    }

    var body: some View {
        VStack(spacing: 0) {
            CalendarMonthNavigationHeader(title: monthTitle, showsMonthAndYear: showsMonthPicker,
                toggleMonthAndYear: {
                    withAnimation(.easeInOut(duration: 0.25)) { showsMonthPicker.toggle() }
                }, previousMonth: { shiftMonth(-1) }, nextMonth: { shiftMonth(1) })
                .padding(.horizontal, 16).frame(height: 50)

            if showsMonthPicker {
                HStack(spacing: 0) {
                    MacCalendarWheelPicker(choices: monthChoices, selection: componentBinding(.month), fontSize: 20)
                        .frame(width: 195)
                    MacCalendarWheelPicker(choices: (1970...3000).map { ($0, localizedIntegerString($0)) },
                        selection: componentBinding(.year), fontSize: 20).frame(width: 105)
                }
                .frame(width: width, height: 280)
            } else {
                dayGrid.frame(height: 280, alignment: .top)
            }
            Spacer(minLength: 0)
        }
        .frame(width: width, height: 350)
        .background(CalendarPalette.background, in: RoundedRectangle(cornerRadius: 12))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .focusable().focusEffectDisabled().focused($hasFocus)
        .onAppear { hasFocus = true }
        .onExitCommand(perform: onDismiss)
        .accessibilityIdentifier("calendar-date-range-picker")
    }

    private var dayGrid: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.fixed(width / 7), spacing: 0), count: 7), spacing: 0) {
            ForEach(0..<7, id: \.self) { index in
                Text(calendar.shortWeekdaySymbols[(calendar.firstWeekday - 1 + index) % 7])
                    .font(.custom("HelveticaNeue", size: 18)).foregroundStyle(.secondary)
                    .adaptiveSingleLine()
                    .frame(width: width / 7, height: cellHeight)
            }
            ForEach(0..<(leadingBlanks + daysInMonth), id: \.self) { index in
                if let date = date(at: index) {
                    Button {
                        selection.select(date, calendar: calendar)
                        publishSelection()
                    } label: { dayCell(date) }
                        .buttonStyle(.plain)
                        .accessibilityLabel(date.appFormatted(time: false))
                        .accessibilityAddTraits(isSelected(date) ? .isSelected : [])
                } else {
                    Color.clear.frame(width: width / 7, height: cellHeight)
                }
            }
        }
        .contentShape(Rectangle())
        .overlay {
            // SwiftUI Button tracking can swallow a macOS drag before the grid
            // gesture begins. Use the same native pointer tracker as the timeline.
            MacCalendarPointerSurface(scrollHandle: scrollHandle, viewport: .zero,
                accepts: { date(at: $0) != nil }, prepare: { _ in 0.2 },
                begin: { point in
                    guard let date = date(at: point) else { return }
                    selectionBeforeDrag = selection
                    selection.beginDrag(date, calendar: calendar)
                },
                change: { point in
                    if let date = date(at: point) { selection.drag(to: date, calendar: calendar) }
                },
                end: { point in
                    if let date = date(at: point) { selection.drag(to: date, calendar: calendar) }
                    selectionBeforeDrag = nil
                    publishSelection()
                },
                cancel: {
                    if let original = selectionBeforeDrag { selection = original }
                    selectionBeforeDrag = nil
                },
                click: { point, _ in
                    guard let date = date(at: point) else { return }
                    selection.select(date, calendar: calendar)
                    publishSelection()
                })
        }
    }

    private func dayCell(_ date: Date) -> some View {
        let isStart = selection.start == date
        let isEnd = selection.end == date
        let endpoint = isStart || isEnd
        let ranged = selection.start != selection.end && selection.end != nil && isSelected(date)
        let bandWidth = width / 7 * (endpoint ? 0.5 : 1)
        return ZStack {
            if ranged {
                Rectangle().fill(CalendarPalette.tertiaryFill).frame(width: bandWidth, height: cellHeight)
                    // Align the continuation toward the selected dates. SwiftUI
                    // resolves leading/trailing once, including inside an RTL grid.
                    .frame(width: width / 7, alignment: isStart ? .trailing : .leading)
            }
            MacCalendarPickerDay(date: date, calendar: calendar, isSelected: endpoint)
        }
        .frame(width: width / 7, height: cellHeight).contentShape(Rectangle())
    }

    private var leadingBlanks: Int { (calendar.component(.weekday, from: month) - calendar.firstWeekday + 7) % 7 }
    private var daysInMonth: Int { calendar.range(of: .day, in: .month, for: month)?.count ?? 0 }
    private func date(at index: Int) -> Date? {
        let day = index - leadingBlanks
        guard day >= 0, day < daysInMonth else { return nil }
        return calendar.date(byAdding: .day, value: day, to: month)
    }
    private func date(at point: CGPoint) -> Date? {
        guard point.x >= 0, point.x < width, point.y >= cellHeight, point.y < 280 else { return nil }
        let physicalColumn = Int(point.x / (width / 7))
        let column = direction == .rightToLeft ? 6 - physicalColumn : physicalColumn
        return date(at: (Int(point.y / cellHeight) - 1) * 7 + column)
    }
    private func isSelected(_ date: Date) -> Bool {
        guard let start = selection.start else { return false }
        return date >= start && date <= (selection.end ?? start)
    }
    private func publishSelection() {
        if let start = selection.start, let end = selection.end { onRangeChange(start, end) }
    }
    private var monthTitle: String {
        let formatter = DateFormatter()
        formatter.locale = .appFormatting
        formatter.calendar = calendar
        formatter.setLocalizedDateFormatFromTemplate("MMMMy")
        return formatter.string(from: month)
    }
    private var monthChoices: [(value: Int, title: String)] {
        let formatter = DateFormatter()
        formatter.locale = .appFormatting
        formatter.calendar = calendar
        return (formatter.standaloneMonthSymbols ?? formatter.monthSymbols).enumerated().map { ($0 + 1, $1) }
    }
    private func componentBinding(_ component: Calendar.Component) -> Binding<Int> {
        Binding(get: { calendar.component(component, from: month) }, set: { value in
            var parts = calendar.dateComponents([.year, .month], from: month)
            parts.day = 1
            if component == .year { parts.year = value } else { parts.month = value }
            if let next = calendar.date(from: parts) { month = next }
        })
    }
    private func shiftMonth(_ offset: Int) {
        if let next = calendar.date(byAdding: .month, value: offset, to: month) { month = next }
    }
}
#endif

#endif
