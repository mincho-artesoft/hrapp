import CoreGraphics

enum CalendarHeaderLayout {
    static let buttonSize: CGFloat = 36
    static let horizontalInset: CGFloat = 16
    static let spacing: CGFloat = 9
    static let height: CGFloat = 52

    /// Use the local safe area, including SE/no-notch and already-inset hosts.
    /// Never add the window's safe area again or assume a fixed phone inset.
    static func topInset(safeAreaTop: CGFloat) -> CGFloat { max(0, safeAreaTop) }
}

enum CalendarHeaderMode: Int, CaseIterable {
    case day = 1, multiDay = 3, month = 0, year = 2, list = 4, multiCalendar = 5, weather = 6

    var title: String {
        switch self {
        case .day: "Day"
        case .multiDay: "MultiDay"
        case .month: "Month"
        case .year: "Year"
        case .list: "List"
        case .multiCalendar: "MultiCalendar"
        case .weather: "Weather"
        }
    }

    var symbol: String {
        switch self {
        case .day: "calendar.day.timeline.leading"
        case .multiDay: "distribute.horizontal.left"
        case .month: "calendar"
        case .year: "12.lane"
        case .list: "list.bullet"
        case .multiCalendar: "align.vertical.top"
        case .weather: "cloud.sun"
        }
    }
}

enum CalendarScrollLayout {
    static let bottomBarHeight: CGFloat = 60
    static let handleHeight: CGFloat = 26
    static let collapsedPeekExtra: CGFloat = 10

    static func bottomClearance(showsMenu: Bool, safeAreaBottom: CGFloat) -> CGFloat {
        guard showsMenu else { return 0 }
        return bottomBarHeight + handleHeight - collapsedPeekExtra + max(0, safeAreaBottom) + 12
    }
}
