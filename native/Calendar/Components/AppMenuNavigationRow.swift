import SwiftUI

/// The same menu row on iOS and native Mac, independent of platform Form chrome.
struct AppMenuNavigationRow: View {
    let title: LocalizedStringKey
    let subtitle: String
    let symbol: String
    let color: Color
    var badge = 0
    let action: () -> Void
    var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: symbol)
                    .font(CalendarTypography.body.weight(.semibold)).foregroundStyle(color)
                    .frame(width: 38, height: 38)
                    .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: 10))
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).font(CalendarTypography.body.weight(.semibold)).foregroundStyle(.primary)
                    Text(subtitle).font(CalendarTypography.footnote).foregroundStyle(.secondary)
                }
                Spacer(minLength: 8)
                if badge > 0 {
                    Text(verbatim: localizedIntegerString(badge))
                        .font(CalendarTypography.caption2.weight(.bold)).foregroundStyle(.white)
                        .lineLimit(1).minimumScaleFactor(0.65).frame(width: 26, height: 26)
                        .background(color, in: Circle())
                }
                Image(systemName: "chevron.forward")
                    .font(CalendarTypography.footnote.weight(.semibold)).foregroundStyle(.tertiary)
            }
            .padding(.vertical, DraggableMenuContentLayout.verticalInset)
            .contentShape(Rectangle())
        }.buttonStyle(.plain)
    }
}
