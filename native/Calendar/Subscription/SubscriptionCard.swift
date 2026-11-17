import SwiftUI
import StoreKit

/// Reel Screen Recorder's offer card, using Cloud Calendars' StoreKit products.
struct SubscriptionCard: View {
    let product: Product
    let isActive: Bool
    let isSelected: Bool
    let expirationDate: Date?
    var isScheduled = false
    var offer: Product.SubscriptionOffer?
    var campaignEnd: Date?
    let action: () -> Void
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private var accent: Color { isActive ? SubscriptionPalette.success : SubscriptionPalette.pro }

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: 14) {
                if let offer {
                    Label(SubscriptionOfferPresentation(product: product, offer: offer).title,
                          systemImage: offer.type == .winBack ? "arrow.uturn.backward.circle.fill" : "gift.fill")
                        .font(.system(size: 15, weight: .bold, design: .rounded))
                        .foregroundStyle(SubscriptionPalette.pro)
                }
                HStack(spacing: 14) {
                    Image(systemName: "creditcard")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(accent)
                        .frame(width: 42, height: 42)
                        .background(accent.opacity(0.12), in: RoundedRectangle(cornerRadius: 13))
                    VStack(alignment: .leading, spacing: 6) {
                        Text(product.periodUnitOnly)
                            .font(.system(size: 15, weight: .bold, design: .rounded))
                        if let offer {
                            let details = SubscriptionOfferPresentation(product: product, offer: offer)
                            ViewThatFits(in: .horizontal) {
                                HStack(alignment: .firstTextBaseline, spacing: 8) { regularPrice; offerPrice(details.price) }
                                VStack(alignment: .leading, spacing: 4) { regularPrice; offerPrice(details.price) }
                            }
                        } else {
                            Text(product.displayPrice)
                                .font(.system(size: 22, weight: .bold, design: .rounded))
                                .foregroundStyle(isActive || isSelected ? accent : SubscriptionPalette.text)
                        }
                        if offer == nil, let monthly = product.pricePerMonth,
                           product.subscription?.subscriptionPeriod.unit == .year {
                            Text(localizedFormat(NSLocalizedString("Equivalent to %@ per month", comment: ""), monthly))
                                .font(.caption).foregroundStyle(SubscriptionPalette.secondaryText)
                        }
                        if isActive {
                            Text("Current Plan").font(.caption.weight(.semibold)).foregroundStyle(SubscriptionPalette.success)
                        } else if isScheduled {
                            Text("Starts at next renewal").font(.caption.weight(.semibold)).foregroundStyle(SubscriptionPalette.success)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    Image(systemName: isSelected || isActive ? "checkmark.circle.fill" : "circle")
                        .font(.system(size: 24))
                        .foregroundStyle(isSelected || isActive ? accent : SubscriptionPalette.secondaryText.opacity(0.45))
                        .shadow(color: accent.opacity(isSelected || isActive ? 0.45 : 0), radius: 7)
                }
                if let offer {
                    let details = SubscriptionOfferPresentation(product: product, offer: offer)
                    VStack(alignment: .leading, spacing: 6) {
                        Text(details.summary).font(.subheadline.weight(.medium)).foregroundStyle(SubscriptionPalette.pro)
                        Text(details.renewalTerms).font(.caption).foregroundStyle(SubscriptionPalette.secondaryText)
                    }
                }
                if let campaignEnd, offer != nil {
                    TimelineView(.periodic(from: .now, by: 1)) { context in
                        if campaignEnd > context.date {
                            HStack {
                                Label("Offer ends in", systemImage: "timer")
                                Text(campaignEnd, style: .timer).monospacedDigit().fontWeight(.bold)
                            }
                            .font(.subheadline).foregroundStyle(SubscriptionPalette.pro)
                        }
                    }
                }
            }
            .foregroundStyle(SubscriptionPalette.text)
            .fixedSize(horizontal: false, vertical: true)
            .padding(16)
            .background {
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .fill(LinearGradient(colors: [SubscriptionPalette.cardTop, SubscriptionPalette.cardBottom],
                                         startPoint: .topLeading, endPoint: .bottomTrailing))
                    .overlay {
                        RoundedRectangle(cornerRadius: 20, style: .continuous)
                            .stroke(isActive || isSelected ? accent : Color.secondary.opacity(0.35), lineWidth: isSelected || isActive ? 1.6 : 1)
                    }
            }
            .shadow(color: accent.opacity(isSelected || isActive ? 0.18 : 0), radius: 14)
            .scaleEffect(isSelected && !reduceMotion ? 1.01 : 1)
            .animation(reduceMotion ? nil : .spring(response: 0.3, dampingFraction: 0.6), value: isSelected)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected || isActive ? .isSelected : [])
        .accessibilityIdentifier("subscription.plan." + product.id)
    }

    private var regularPrice: some View {
        Text(product.displayPrice)
            .font(.system(size: 16, weight: .medium, design: .rounded))
            .foregroundStyle(SubscriptionPalette.secondaryText).strikethrough()
    }
    private func offerPrice(_ price: String) -> some View {
        Text(price).font(.system(size: 22, weight: .bold, design: .rounded)).foregroundStyle(accent)
    }
}
