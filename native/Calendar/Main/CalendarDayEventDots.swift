import SwiftUI

/// The sidebar and year mini-months share the same calendar-colour markers.
struct CalendarDayEventDots: View {
    let colors: [Color]

    var body: some View {
        VStack(spacing: 2) {
            ForEach(Array(stride(from: 0, to: colors.count, by: 3)), id: \.self) { first in
                HStack(spacing: 2) {
                    ForEach(first..<min(first + 3, colors.count), id: \.self) { index in
                        Circle().fill(colors[index]).frame(width: 4, height: 4)
                    }
                }
            }
        }
        .frame(minHeight: 4)
        .accessibilityHidden(true)
    }
}
