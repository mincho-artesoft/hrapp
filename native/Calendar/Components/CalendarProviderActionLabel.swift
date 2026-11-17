import SwiftUI

/// Shared by the iOS Calendar menu and the native Mac menu.
struct CalendarProviderActionLabel: View {
    enum Icon { case local, iCloud, iCloudSharing, google, microsoft }
    let title: LocalizedStringKey
    let icon: Icon
    var body: some View {
        HStack(spacing: 8) {
            Group {
                switch icon {
                case .google: Image("google_icon").resizable().scaledToFit()
                case .microsoft: Image("microsoft_icon").resizable().scaledToFit()
                case .local: Image(systemName: "calendar.badge.plus").foregroundStyle(Color.appBlue)
                case .iCloud, .iCloudSharing:
                    Image(systemName: icon == .iCloud ? "icloud.fill" : "link.icloud.fill")
                        .foregroundStyle(LinearGradient(colors: [
                            Color(red: 0.69, green: 0.85, blue: 0.98),
                            Color(red: 0.46, green: 0.70, blue: 0.97),
                            Color(red: 0.26, green: 0.57, blue: 0.96),
                            Color(red: 0.09, green: 0.44, blue: 0.94),
                            Color(red: 0.04, green: 0.35, blue: 0.92)
                        ], startPoint: .leading, endPoint: .trailing))
                }
            }.frame(width: 28, height: 28).accessibilityHidden(true)
            Text(title).foregroundStyle(.primary)
            Spacer(minLength: 0)
        }.font(CalendarTypography.body).frame(maxWidth: .infinity, minHeight: 36, alignment: .leading)
            .contentShape(Rectangle())
    }
}
