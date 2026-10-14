import SwiftUI

extension View {
    /// The text and controls determine a self-sizing row's height. A flexible
    /// shape inside its HStack would instead accept the collection view's
    /// estimated height, making the result depend on the previous layout pass.
    /// Draw the stripe only after measuring the content, preserving its 3pt
    /// width and 8pt gap without participating in vertical sizing.
    func calendarEventRowAccent(_ color: Color, isVisible: Bool = true) -> some View {
        padding(.leading, isVisible ? 11 : 0)
            .overlay(alignment: .leading) {
                if isVisible {
                    RoundedRectangle(cornerRadius: 1.5)
                        .fill(color)
                        .frame(width: 3)
                        .allowsHitTesting(false)
                        .accessibilityHidden(true)
                }
            }
    }
}
