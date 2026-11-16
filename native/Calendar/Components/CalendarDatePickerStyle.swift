import SwiftUI

private struct CalendarDatePickerColumnDatesKey: EnvironmentKey {
    static let defaultValue: [Date] = []
}

extension EnvironmentValues {
    var calendarDatePickerColumnDates: [Date] {
        get { self[CalendarDatePickerColumnDatesKey.self] }
        set { self[CalendarDatePickerColumnDatesKey.self] = newValue }
    }
}

extension View {
    /// Both rows measure the same localized values, keeping date and time
    /// columns aligned as their values, formats, language or text size change.
    func calendarDatePickerColumns(_ dates: [Date]) -> some View {
        environment(\.calendarDatePickerColumnDates, dates)
    }
}

struct CalendarDatePickerValue: View {
    let value: String
    let columnValues: [String]
    var isActive = false
    @ScaledMetric(relativeTo: .body) private var minimumHeight = 34

    var body: some View {
        ZStack {
            // Hidden reference labels contribute only their intrinsic size.
            // Measuring before padding gives every row the same capsule width,
            // without fixed widths that would truncate translated values.
            ForEach(Array(columnValues.enumerated()), id: \.offset) { _, text in
                Text(verbatim: text).hidden().accessibilityHidden(true)
            }
            Text(verbatim: value)
        }
        .font(valueFont)
        .foregroundStyle(isActive ? Color.accentColor : Color.primary)
        .lineLimit(1)
        .fixedSize(horizontal: true, vertical: true)
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .frame(minHeight: minimumHeight)
        .background(fill, in: Capsule())
        .contentShape(Capsule())
    }

    private var valueFont: Font {
        #if os(macOS)
        .system(size: 17)
        #else
        .body
        #endif
    }

    private var fill: Color {
        #if os(macOS)
        CalendarPalette.tertiaryFill
        #else
        Color(uiColor: .tertiarySystemFill)
        #endif
    }
}
