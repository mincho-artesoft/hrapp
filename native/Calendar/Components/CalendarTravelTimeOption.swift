import Foundation

/// The durations offered by the system Calendar travel-time menu.
/// Shared by the editor and event details so None remains an accessible choice.
enum CalendarTravelTimeOption: Int, CaseIterable, Identifiable {
    case none = 0, five = 300, fifteen = 900, thirty = 1800
    case oneHour = 3600, ninetyMinutes = 5400, twoHours = 7200

    var id: Int { rawValue }

    @MainActor var title: String {
        if self == .none {
            return Bundle.main.localizedString(forKey: "None", value: "None", table: nil)
        }
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = [.hour, .minute]
        formatter.unitsStyle = .full
        formatter.maximumUnitCount = 2
        var calendar = Calendar(identifier: .gregorian)
        calendar.locale = AppPreferences.shared.interfaceLocale
        formatter.calendar = calendar
        return formatter.string(from: TimeInterval(rawValue)) ?? ""
    }

    init(seconds: TimeInterval?) {
        self = Self.allCases.min {
            abs(Double($0.rawValue) - (seconds ?? 0)) < abs(Double($1.rawValue) - (seconds ?? 0))
        } ?? .none
    }
}
