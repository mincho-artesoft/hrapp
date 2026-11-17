import SwiftUI
import StoreKit

struct SubscriptionCard: View {
    let product: Product
    let isActive: Bool
    let isSelected: Bool
    let expirationDate: Date?
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                VStack(alignment: .leading, spacing: 5) {
                    Text(product.periodUnitOnly)
                        .font(CalendarTypography.headline)
                        .lineLimit(2)
                        .fixedSize(horizontal: false, vertical: true)
                    Text(product.displayPrice)
                        .font(CalendarTypography.title2.weight(.semibold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.85)
                    
                    // → локализирано чрез NSLocalizedString + localizedFormat()
                    if let monthly = product.pricePerMonth,
                       product.subscription?.subscriptionPeriod.unit == .year {
                        Text(
                            localizedFormat(NSLocalizedString(
                                    "Equivalent to %@ per month",
                                    comment: "Equivalent monthly price"
                                ),
                                monthly
                            )
                        )
                        .font(CalendarTypography.caption)
                        .foregroundColor(.secondary)
                        .fixedSize(horizontal: false, vertical: true)
                    }

                    if isActive {
                        Text(NSLocalizedString("Current Plan",
                                               comment: "Marks the plan the customer is subscribed to"))
                            .font(CalendarTypography.caption.weight(.semibold))
                            .foregroundColor(.green)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
                .frame(maxHeight: .infinity, alignment: .top)
                .frame(maxWidth: .infinity, alignment: .leading)

                Spacer()

                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .resizable()
                    .frame(width: 24, height: 24)
                    .foregroundColor(isSelected ? .accentColor : Color.secondary.opacity(0.5))
                    .animation(.easeInOut(duration: 0.2), value: isSelected)
            }
            .padding(.vertical, 18)
            .padding(.horizontal, 10)
            .background(CalendarSurfaceColors.secondaryGrouped)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(
                        isActive
                            ? Color.green
                            : (isSelected ? Color.accentColor : Color.secondary.opacity(0.35)),
                        lineWidth: isSelected || isActive ? 2.5 : 1.5
                    )
            )
            .scaleEffect(isSelected ? 1.02 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isSelected)
        }
        .buttonStyle(.plain)
    }
}
