import SwiftUI

/// Shared with iPhone and iPad so macOS does not substitute NSSegmentedControl.
struct SubscriptionCategoryPicker: View {
    @Binding var selection: SubscriptionCategory

    var body: some View {
        HStack(spacing: 0) {
            ForEach(SubscriptionCategory.allCases) { category in
                let selected = selection == category
                Button {
                    selection = category
                } label: {
                    Text(category.title)
                        .font(CalendarTypography.subheadline.weight(selected ? .semibold : .regular))
                        .foregroundStyle(.primary)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                        .frame(maxWidth: .infinity, minHeight: 32)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .background {
                    if selected {
                        RoundedRectangle(cornerRadius: 17, style: .continuous)
                            .fill(CalendarSurfaceColors.background)
                            .shadow(color: .black.opacity(0.08), radius: 1, y: 1)
                    }
                }
                .accessibilityAddTraits(selected ? .isSelected : [])
            }
        }
        .padding(3)
        .background(CalendarSurfaceColors.tertiaryFill)
        .clipShape(RoundedRectangle(cornerRadius: 21, style: .continuous))
        .accessibilityElement(children: .contain)
        .accessibilityIdentifier("subscription.categoryPicker")
    }
}
