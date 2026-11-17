import SwiftUI
import StoreKit

struct SubscriptionListView: View {
    let category: SubscriptionCategory
    let products: [Product]
    @Binding var selectedProductID: String?
    @ObservedObject private var manager = SubscriptionManager.shared

    var body: some View {
        VStack(spacing: 20) {
            SubscriptionFeaturesView(category: category)
            activeStatus
            if manager.isLoading && products.isEmpty {
                VStack(spacing: 12) {
                    ProgressView().tint(SubscriptionPalette.pro)
                    Text("Loading plans...").font(.subheadline).foregroundStyle(SubscriptionPalette.secondaryText)
                }.frame(maxWidth: .infinity).padding(28)
            } else if products.isEmpty {
                SubscriptionPanel {
                    Label("Plans", systemImage: "wifi.exclamationmark").font(.headline)
                    Text("No plans available at the moment.").foregroundStyle(SubscriptionPalette.secondaryText)
                    if let error = manager.productLoadError { Text(error).font(.caption).foregroundStyle(SubscriptionPalette.secondaryText) }
                    SubscriptionActionButton(title: "Retry", icon: "arrow.clockwise") { Task { await manager.loadProducts() } }
                }
            } else {
                VStack(spacing: 14) {
                    ForEach(products) { product in
                        SubscriptionCard(product: product, isActive: manager.isCurrentPlan(product),
                                         isSelected: selectedProductID == product.id,
                                         expirationDate: manager.displayedExpirationDate(for: product),
                                         isScheduled: manager.scheduledProductIDs.contains(product.id),
                                         offer: manager.offer(for: product), campaignEnd: manager.campaignEnd(for: product)) {
                            withAnimation { selectedProductID = product.id }
                        }
                        .disabled(!manager.canPurchase(product) || manager.isPurchasing)
                    }
                    if let product = products.first(where: { $0.id == selectedProductID }) {
                        purchaseSection(product, quote: manager.quote(for: product))
                    }
                    Text("You can change your plan or billing period at any time.")
                        .font(.caption).foregroundStyle(SubscriptionPalette.secondaryText)
                        .multilineTextAlignment(.center)
                }
            }
        }
    }

    @ViewBuilder private var activeStatus: some View {
        if let product = manager.sortedProducts.first(where: { manager.isCurrentPlan($0) }),
           let expiry = manager.displayedExpirationDate(for: product) {
            HStack(spacing: 10) {
                Image(systemName: "checkmark.seal.fill")
                VStack(alignment: .leading, spacing: 4) {
                    Text(localizedFormat(NSLocalizedString("SubscriptionStatus", comment: ""),
                                         NSLocalizedString(product.id.contains("Premium") ? "Premium" : "Advanced", comment: ""), product.periodUnitOnly))
                        .font(.system(size: 15, weight: .bold, design: .rounded))
                    Text(localizedFormat(NSLocalizedString(manager.isDisplayedRenewing(product) ? "RenewsOn" : "Expires on %@", comment: ""),
                                         DateFormatter.localizedString(from: expiry, dateStyle: .medium, timeStyle: .none)))
                        .font(.caption)
                }
            }
            .foregroundStyle(SubscriptionPalette.success)
            .frame(maxWidth: .infinity, alignment: .leading).padding(16)
            .background(SubscriptionPalette.success.opacity(0.12), in: RoundedRectangle(cornerRadius: 20))
            .overlay(RoundedRectangle(cornerRadius: 20).stroke(SubscriptionPalette.success.opacity(0.35)))
        }
    }

    private func purchaseSection(_ product: Product, quote: SubscriptionPurchaseQuote) -> some View {
        VStack(spacing: 12) {
            Button {
                Task { await manager.purchase(product, confirming: quote) }
            } label: {
                HStack(spacing: 9) {
                    if manager.isPurchasing { ProgressView().tint(.white) }
                    else { Image(systemName: quote.offer == nil ? "creditcard" : "gift.fill") }
                    Text(manager.isCurrentPlan(product) ? "Current Plan" : manager.scheduledProductIDs.contains(product.id) ? "Starts at next renewal" : purchaseTitle(quote))
                }
                .font(.system(size: 16, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
                .padding(.horizontal, 14).padding(.vertical, 14)
                .frame(maxWidth: .infinity, minHeight: 50)
                .background(Color.accentColor, in: Capsule())
                .contentShape(Capsule())
            }
            .buttonStyle(.plain).disabled(manager.isPurchasing || manager.isRestoring || !manager.canPurchase(product))
            .shadow(color: SubscriptionPalette.pro.opacity(0.42), radius: 12, y: 5)
            .accessibilityIdentifier("subscription.purchase")
            if let offer = quote.offer {
                let details = SubscriptionOfferPresentation(product: product, offer: offer)
                Text(details.summary + ". " + details.renewalTerms).font(.caption).foregroundStyle(SubscriptionPalette.secondaryText)
            } else if let subscription = product.subscription {
                Text(localizedFormat(NSLocalizedString("%@ every %@. Auto-renews. Cancel anytime.", comment: ""),
                                     product.displayPrice, SubscriptionOfferPresentation.duration(subscription.subscriptionPeriod)))
                    .font(.caption).foregroundStyle(SubscriptionPalette.secondaryText)
            }
        }.padding(.top, 10)
    }
    private func purchaseTitle(_ quote: SubscriptionPurchaseQuote) -> LocalizedStringKey {
        if manager.hasActiveSubscription || manager.isDebugPremiumEnabled { return "Change Plan" }
        if let offer = quote.offer { return offer.paymentMode == .freeTrial ? "Start Free Trial" : "Get Offer" }
        return "Subscribe Now"
    }
}
