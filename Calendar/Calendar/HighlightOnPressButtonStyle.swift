import SwiftUI

struct HighlightOnPressButtonStyle: ButtonStyle {
    let tint: Color
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(tint)                        // текст в избрания цвят
            .padding(.vertical, 6)
            .padding(.horizontal, 12)
            .background(
                RoundedRectangle(cornerRadius: 8)
                    .fill(configuration.isPressed
                          ? tint.opacity(0.2)            // полупрозрачна избава при натиск
                          : Color.clear)
            )
            .animation(.easeInOut(duration: 0.1), value: configuration.isPressed)
            .contentShape(RoundedRectangle(cornerRadius: 8))
    }
}
