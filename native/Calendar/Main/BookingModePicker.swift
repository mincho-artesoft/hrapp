import SwiftUI

enum BookingViewMode: String, CaseIterable {
    case appointments, availability

    static let preferenceKey = "SelectedBookingViewMode"

    var title: LocalizedStringKey {
        switch self {
        case .appointments: "My bookings"
        case .availability: "Booking calendars"
        }
    }
}

struct BookingModePicker: View {
    @ObservedObject private var account = CloudAccountManager.shared
    @Binding var selection: BookingViewMode

    var body: some View {
        if account.isSignedIn, CalendarFeedSession.existing != nil {
            CalendarSectionPicker(selection: $selection, rows: [
                BookingViewMode.allCases.map { .init(id: $0, title: $0.title) }
            ])
            .foregroundStyle(Color.primary)
            .frame(maxWidth: 400)
            .accessibilityLabel("Bookings")
        } else { Text("Bookings").font(CalendarTypography.headline) }
    }
}
