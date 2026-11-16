import SwiftUI

private struct CalendarBottomClearanceKey: EnvironmentKey {
    static let defaultValue: CGFloat = 0
}

extension EnvironmentValues {
    /// Main-screen overlay clearance only; standalone sheets keep their own insets.
    var calendarBottomClearance: CGFloat {
        get { self[CalendarBottomClearanceKey.self] }
        set { self[CalendarBottomClearanceKey.self] = newValue }
    }
}

struct CalendarScrollFooter: View {
    @Environment(\.calendarBottomClearance) private var clearance

    var body: some View {
        if clearance > 0 {
            Color.clear.frame(height: clearance)
                .allowsHitTesting(false)
                .accessibilityHidden(true)
        }
    }
}
