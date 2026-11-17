// Ported from Wonek Components/CalendarPickerDay.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

/// Shared with the existing range calendar, including its day-number font.
enum CalendarPickerDayStyle {
    static let fontName = "HelveticaNeue"
    static let fontSize: CGFloat = 18
    static let diameter: CGFloat = 40
    static var selectionColor: Color { .appBlue }
    #if canImport(UIKit)
    static var uiSelectionColor: UIColor { .appBlue }
    #endif
}

struct CalendarPickerDay: View {
    let number: Int
    let isSelected: Bool
    var isToday = false
    var isEnabled = true

    var body: some View {
        Text(localizedIntegerString(number))
            .font(.custom(CalendarPickerDayStyle.fontName, size: CalendarPickerDayStyle.fontSize))
            .foregroundStyle(isSelected ? Color.white
                : !isEnabled ? Color.secondary.opacity(0.4)
                : isToday ? Color.orange : Color.primary)
            .frame(width: CalendarPickerDayStyle.diameter, height: CalendarPickerDayStyle.diameter)
            .background {
                if isSelected { Circle().fill(isToday ? Color.appRed : CalendarPickerDayStyle.selectionColor) }
            }
    }
}

#endif
