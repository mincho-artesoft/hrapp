import SwiftUI

/// Identical local/received calendar rows on iOS and native Mac. Storage adapters
/// supply metadata and actions, while both platforms share layout and styling.
struct LocalCalendarListRow: View {
    let title: String
    let color: Color
    let isSelected: Bool
    let ownerEmail: String?
    let access: CloudCalendarsAPI.EventAccess?
    let isRevoked: Bool
    let isPersonalCloud: Bool
    let toggleAction: () -> Void
    let editAction: () -> Void
    let shareAction: (() -> Void)?
    var showsEditButton = true

    var body: some View {
        HStack(spacing: 12) {
            Button(action: toggleAction) {
                ZStack {
                    Circle().fill(color).frame(width: 28, height: 28)
                    if isSelected {
                        Image(systemName: "checkmark")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(.white)
                    }
                }
            }
            .buttonStyle(.plain)
            .accessibilityLabel(Text(title))
            .accessibilityValue(Text(isSelected ? "Selected" : "Not selected"))

            Button(action: editAction) {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 5) {
                        Text(title).foregroundStyle(.primary).lineLimit(1)
                            .strikethrough(isRevoked, color: color)
                        if isPersonalCloud {
                            Image(systemName: "icloud.fill")
                                .font(CalendarTypography.caption2).foregroundStyle(.secondary)
                        }
                    }
                    if isPersonalCloud {
                        Text("Web & Events Sync").font(CalendarTypography.caption)
                            .foregroundStyle(.secondary).lineLimit(1)
                    } else if access != nil {
                        Text(ownerEmail ?? NSLocalizedString("Shared calendar", comment: "Shared calendar owner fallback"))
                            .font(CalendarTypography.caption).foregroundStyle(.secondary)
                            .lineLimit(1).truncationMode(.middle)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)

            if let access {
                Text(isRevoked ? NSLocalizedString("Access removed", comment: "Revoked calendar access") : access.title)
                    .font(CalendarTypography.caption.weight(.semibold))
                    .foregroundStyle(isRevoked ? .red : .secondary)
                    .padding(.horizontal, 9).padding(.vertical, 5)
                    .background(CalendarPalette.secondaryGroupedBackground, in: Capsule())
                    .fixedSize()
            }
            if let shareAction {
                Button(action: shareAction) {
                    Image(systemName: "person.2.fill").font(.system(size: 18))
                }
                .buttonStyle(.borderless)
                .accessibilityLabel("Manage calendar sharing")
            }
            if showsEditButton {
                Button(action: editAction) {
                    Image(systemName: "info.circle").font(.system(size: 18))
                }
                .buttonStyle(.borderless)
                .accessibilityLabel("Edit local calendar")
            }
        }
        .font(CalendarTypography.body)
        .padding(.vertical, 4).padding(.horizontal, 5)
        .background(isSelected ? CalendarPalette.selectedCalendar : .clear,
                    in: RoundedRectangle(cornerRadius: 24))
        .padding(.leading, -32)
    }
}
