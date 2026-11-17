// Ported from Wonek Main/MacCalendarInlineDatePicker.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
#if os(macOS)
import SwiftUI

/// Inline calendar and time wheels; editing stays in the event form.
struct MacCalendarInlineDatePicker: View {
    @Binding var selection: Date
    let range: ClosedRange<Date>
    let isTime: Bool
    @Environment(\.calendar) private var calendar
    @Environment(\.locale) private var locale
    private var is12Hour: Bool {
        let pattern = DateFormatter.dateFormat(fromTemplate: "j", options: 0, locale: locale) ?? "HH"
        return pattern.contains("h") || pattern.contains("K")
    }

    var body: some View {
        Group {
            if isTime { timeWheels }
            else { CalendarInlineDateGrid(selection: $selection, range: range) }
        }
        .frame(maxWidth: 420)
        .frame(maxWidth: .infinity)
    }

    private var timeWheels: some View {
        HStack(spacing: 0) {
            MacCalendarWheelPicker(choices: (is12Hour ? Array(1...12) : Array(0...23)).map { ($0, number($0)) },
                selection: timeBinding(.hour), showsSelectionBackground: false, wraps: true)
                .accessibilityLabel(Text(verbatim: format(selection, template: "j")))
            MacCalendarWheelPicker(choices: (0...59).map { ($0, number($0, digits: 2)) },
                selection: timeBinding(.minute), showsSelectionBackground: false, wraps: true)
            if is12Hour {
                MacCalendarWheelPicker(choices: [(0, calendar.amSymbol), (1, calendar.pmSymbol)],
                    selection: Binding(get: { calendar.component(.hour, from: selection) / 12 }, set: { period in
                        setTime(hour: calendar.component(.hour, from: selection) % 12 + period * 12,
                            minute: calendar.component(.minute, from: selection))
                    }), showsSelectionBackground: false)
            }
        }
        .background {
            Capsule().fill(CalendarPalette.tertiaryFill).frame(height: 32)
        }
    }

    private func timeBinding(_ component: Calendar.Component) -> Binding<Int> {
        Binding(get: {
            let value = calendar.component(component, from: selection)
            return component == .hour && is12Hour ? (value % 12 == 0 ? 12 : value % 12) : value
        }, set: { value in
            let hour = calendar.component(.hour, from: selection)
            setTime(hour: component == .hour ? (is12Hour ? value % 12 + hour / 12 * 12 : value) : hour,
                minute: component == .minute ? value : calendar.component(.minute, from: selection))
        })
    }

    private func setTime(hour: Int, minute: Int) {
        guard let value = calendar.date(bySettingHour: hour, minute: minute, second: 0, of: selection) else { return }
        selection = min(max(value, range.lowerBound), range.upperBound)
    }

    private func format(_ date: Date, template: String) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale; formatter.calendar = calendar; formatter.timeZone = calendar.timeZone
        formatter.setLocalizedDateFormatFromTemplate(template)
        return formatter.string(from: date)
    }
    private func number(_ value: Int, digits: Int = 1) -> String {
        let formatter = NumberFormatter()
        formatter.locale = locale; formatter.minimumIntegerDigits = digits; formatter.usesGroupingSeparator = false
        return formatter.string(from: NSNumber(value: value)) ?? String(value)
    }
}
#endif

#endif
