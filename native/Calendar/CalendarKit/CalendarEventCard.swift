import SwiftUI

/// Compact event presentation shared by the app, App Clip, widgets and Live
/// Activity. The grid owns positioning/overlap; cards share its palette,
/// symbols and the protected 5pt stripe + 3pt width + 4pt text gap.
struct CalendarEventCard: View {
    @Environment(\.colorScheme) private var colorScheme
    let title: String
    let color: Color
    var timeText: String? = nil
    var location: String? = nil
    var videoCall: String? = nil
    var titleIcon: String? = nil
    var isAllDay = false
    var isRecurring = false
    var isCancelled = false
    var titleSize: CGFloat = 14
    var detailSize: CGFloat = 12
    var titleLines = 2
    var detailLines = 2
    var verticalPadding: CGFloat = 5
    var showsBackground = true
    var foregroundColor: Color? = nil

    #if os(macOS)
    private var baseColor: NSColor { NSColor(color) }
    #else
    private var baseColor: EventTimelinePlatformColor {
        UIColor(color).resolvedColor(with: UITraitCollection(
            userInterfaceStyle: colorScheme == .dark ? .dark : .light))
    }
    #endif

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                if let titleIcon { Image(systemName: titleIcon) }
                Text(title)
                    .strikethrough(isCancelled)
                    .lineLimit(titleLines)
                    .frame(maxWidth: .infinity, alignment: .leading)
                if isRecurring { Image(systemName: "repeat") }
            }
            .font(.system(size: titleSize, weight: .semibold))
            .foregroundStyle(foregroundColor ?? Color(cgColor: EventTimelineColors.text(baseColor,
                strength: 0.58, dark: colorScheme == .dark).cgColor))
            if let timeText, !timeText.isEmpty {
                detail(timeText, symbol: isAllDay ? "calendar" : "clock")
            }
            if let videoCall, !videoCall.isEmpty { detail(videoCall, symbol: "video") }
            if let location, !location.isEmpty { detail(location, symbol: "location") }
        }
        .foregroundStyle(foregroundColor?.opacity(0.82) ?? Color(cgColor: EventTimelineColors.text(baseColor,
            strength: 0.82, dark: colorScheme == .dark).cgColor))
        .padding(.leading, isAllDay ? 8 : 12)
        .padding(.trailing, 7)
        .padding(.vertical, verticalPadding)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(showsBackground ? Color(cgColor: EventTimelineColors.background(baseColor,
            selected: false, depth: 0, dark: colorScheme == .dark).cgColor) : .clear,
            in: RoundedRectangle(cornerRadius: 5))
        .overlay(alignment: .leading) {
            if !isAllDay {
                Capsule().fill(color).frame(width: 3)
                    .padding(.vertical, 5).padding(.leading, 5)
            }
        }
        .clipped()
        .accessibilityElement(children: .combine)
    }

    private func detail(_ text: String, symbol: String) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 4) {
            Image(systemName: symbol).frame(width: detailSize)
            Text(text).lineLimit(detailLines)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .font(.system(size: detailSize))
    }
}
