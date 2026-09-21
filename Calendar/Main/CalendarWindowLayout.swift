import SwiftUI

private struct CalendarWindowSizeKey: EnvironmentKey {
    static let defaultValue: CGSize? = nil
}

extension EnvironmentValues {
    /// The owning window's layout proposal, available before the calendar's
    /// first frame. Never consult another scene's key window or UIScreen.
    var calendarWindowSize: CGSize? {
        get { self[CalendarWindowSizeKey.self] }
        set { self[CalendarWindowSizeKey.self] = newValue }
    }
}

private struct CalendarWindowLayout: ViewModifier {
    func body(content: Content) -> some View {
        GeometryReader { geometry in
            content.environment(\.calendarWindowSize, CalendarSidebarLayout.viewportSize(
                contentSize: geometry.size,
                horizontalInsets: geometry.safeAreaInsets.leading + geometry.safeAreaInsets.trailing,
                verticalInsets: geometry.safeAreaInsets.top + geometry.safeAreaInsets.bottom))
        }
        // A keyboard or a child sheet must not change the orientation policy.
        .ignoresSafeArea(.keyboard)
    }
}

extension View {
    func calendarWindowLayout() -> some View { modifier(CalendarWindowLayout()) }
}

