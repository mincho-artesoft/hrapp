import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

/// Shared with the existing range calendar, including its day-number font.
enum CalendarPickerDayStyle {
    static let fontName = "HelveticaNeue"
    static let fontSize: CGFloat = 18
    static let diameter: CGFloat = 40
    static let selectionColor = Color(red: 66 / 255, green: 150 / 255, blue: 240 / 255)
    #if canImport(UIKit)
    static let uiSelectionColor = UIColor(red: 66 / 255, green: 150 / 255, blue: 240 / 255, alpha: 1)
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
                if isSelected { Circle().fill(isToday ? Color.red : CalendarPickerDayStyle.selectionColor) }
            }
    }
}
