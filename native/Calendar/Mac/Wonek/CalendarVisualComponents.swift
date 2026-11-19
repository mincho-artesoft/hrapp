// Ported from Wonek Main/CalendarVisualStyle.swift. HRApp data adapters are in MacCalendarAdapters.swift.
#if os(macOS)
import SwiftUI
import EventKit
/// The same iCloud gradient and calendar symbols on both platforms.
enum CalendarProvider: CaseIterable {
    case local, iCloud, apple
}

struct CalendarProviderIcon: View {
    let provider: CalendarProvider
    var size: CGFloat = 28

    var body: some View {
        Group {
            switch provider {
            case .iCloud:
                Image(systemName: "icloud.fill")
                    .foregroundStyle(LinearGradient(colors: [
                        Color(red: 0.69, green: 0.85, blue: 0.98),
                        Color(red: 0.46, green: 0.70, blue: 0.97),
                        Color(red: 0.26, green: 0.57, blue: 0.96),
                        Color(red: 0.09, green: 0.44, blue: 0.94),
                        Color(red: 0.04, green: 0.35, blue: 0.92)
                    ], startPoint: .leading, endPoint: .trailing))
            case .local:
                Image(systemName: "calendar.badge.plus").foregroundStyle(.appBlue)
            case .apple:
                Image(systemName: "apple.logo").foregroundStyle(.primary)
            }
        }
        .font(CalendarTypography.title3)
        .frame(width: size, height: size)
        .accessibilityHidden(true)
    }
}

struct CalendarProviderLabel: View {
    let title: LocalizedStringKey
    let provider: CalendarProvider

    var body: some View {
        HStack(spacing: 8) {
            CalendarProviderIcon(provider: provider)
            Text(title).foregroundStyle(.primary)
        }
        .font(CalendarTypography.body)
    }
}

enum CalendarViewSymbol {
    static func name(for tab: Int) -> String {
        switch tab {
        case 1: "calendar.day.timeline.leading"
        case 3: "distribute.horizontal.left"
        case 0: "calendar"
        case 2: "12.lane"
        case 4: "list.bullet"
        case 5: "align.vertical.top"
        case 7: "line.3.horizontal"
        default: "calendar"
        }
    }
}

enum CalendarEventSymbol {
    static func name(calendar: EKCalendar?, allDay: Bool) -> String? {
        if calendar?.type == .birthday { return "gift.circle.fill" }
        if calendar?.type == .subscription,
           calendar?.title.localizedCaseInsensitiveContains("holiday") == true {
            return "star.circle.fill"
        }
        return allDay ? "calendar.circle.fill" : nil
    }
}

struct CalendarSelectionCircle: View {
    let color: Color
    let isSelected: Bool

    var body: some View {
        ZStack {
            Circle().fill(color)
            if isSelected {
                Image(systemName: "checkmark")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundStyle(.white)
            }
        }
        .frame(width: 28, height: 28)
        .accessibilityHidden(true)
    }
}

/// Mirrors the unchanged iPad EventRowView / SearchEventRowView hierarchy.
struct CalendarEventRowContent<Times: View>: View {
    let title: String
    let color: Color
    let allDay: Bool
    let symbol: String?
    let isCancelled: Bool
    var isReadOnly = false
    @ViewBuilder var times: () -> Times

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            if !allDay {
                RoundedRectangle(cornerRadius: 1.5)
                    .fill(color).frame(width: 3)
            }
            if let symbol { Image(systemName: symbol).foregroundStyle(color) }
            if isReadOnly {
                Image(systemName: "lock.fill")
                    .font(CalendarTypography.caption).foregroundStyle(color)
                    .accessibilityLabel(Text("Read only"))
            }
            Text(title)
                .font(CalendarTypography.body)
                .foregroundStyle(.primary)
                .strikethrough(isCancelled, color: color)
            Spacer()
            times()
                .font(CalendarTypography.subheadline)
                .foregroundStyle(.gray)
        }
        .font(CalendarTypography.body)
        .padding(.vertical, 6)
        .contentShape(Rectangle())
    }
}

struct CalendarPreferenceLabel: View {
    let title: LocalizedStringKey
    let icon: String
    var color: Color = .blue

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(CalendarTypography.title3)
                .foregroundStyle(color)
                .frame(width: 28, height: 28)
            Text(title)
                .font(CalendarTypography.headline)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}

struct CalendarSharingRowLabel: View {
    @Environment(\.locale) private var locale
    let title: LocalizedStringKey
    let subtitle: String
    let icon: String
    let color: Color
    var count: Int? = nil

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(CalendarTypography.body.weight(.semibold))
                .foregroundStyle(color)
                .frame(width: 38, height: 38)
                .background(color.opacity(0.12), in: RoundedRectangle(cornerRadius: 10))
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(CalendarTypography.body.weight(.semibold)).foregroundStyle(.primary)
                Text(subtitle).font(CalendarTypography.footnote).foregroundStyle(.secondary)
            }
            Spacer(minLength: 8)
            if let count, count > 0 {
                Text(count.formatted(.number.locale(locale))).font(CalendarTypography.caption2.bold())
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.65)
                    .frame(width: 26, height: 26)
                    .background(color, in: Circle())
                    .accessibilityLabel(Text(String.localizedStringWithFormat(
                        NSLocalizedString(count == 1 ? "%lld pending invitation" : "%lld pending invitations", comment: ""), Int64(count))))
            }
            Image(systemName: "chevron.forward")
                .font(CalendarTypography.footnote.weight(.semibold)).foregroundStyle(.tertiary)
        }
        .padding(.vertical, 8)
        .contentShape(Rectangle())
    }
}

#endif
