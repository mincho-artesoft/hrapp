import SwiftUI
import StoreKit

struct SubscriptionListView: View {
    let title: String
    let products: [Product]
    @Binding var selectedProductID: String?
    @StateObject private var manager = SubscriptionManager.shared

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Сравняваме вече локализирани заглавия
                if title == "Advance Plans"{
                    AdvanceSubscriptionView()

                }else if title == "Premium Plans"{
                    PremiumSubscriptionView()
                }
                
                HStack(spacing: 10) {
                    ForEach(products) { product in
                        let isActive = manager.purchasedProductIDs.contains(product.id)
                        let isSelectedOrActive = isActive || product.id == selectedProductID
                        let canBuy = manager.canPurchase(product)

                        SubscriptionCard(
                            product: product,
                            isActive: isActive,
                            isSelected: isSelectedOrActive,
                            expirationDate: manager.expirationDates[product.id]
                        ) {
                            if canBuy {
                                selectedProductID = product.id
                            }
                        }
                        .disabled(!canBuy)
                        .opacity(!canBuy ? 0.6 : 1.0)
                    }
                }
                .padding(.horizontal)

                ActiveSubscriptionStatusView()
                    .padding(.horizontal)

                if let id = selectedProductID,
                   let product = manager.products.first(where: { $0.id == id }),
                   !manager.purchasedProductIDs.contains(id),
                   manager.canPurchase(product) {
                    PurchaseSectionView(selectedProductID: id)
                        .padding(.horizontal)
                }
            }
        }
        Spacer()
    }

    @ViewBuilder
    private func ActiveSubscriptionStatusView() -> some View {
        if let activeID = manager.purchasedProductIDs.first,
           let product = manager.products.first(where: { $0.id == activeID }),
           let expiry = manager.expirationDates[activeID] {

            // 1. rawValue на статуса – това са ключовете "Base", "Advance", "Premium"
            let planTypeKey = manager.subscriptionStatus.rawValue

            // 2. Ръчно правим mapping unit → String ключ, точно както в periodUnitOnly, но като String
            let periodKey: String = {
                guard let unit = product.subscription?.subscriptionPeriod.unit else { return "" }
                switch unit {
                case .day:   return "Daily"
                case .week:  return "Weekly"
                case .month: return "Monthly"
                case .year:  return "Yearly"
                @unknown default: return "Recurring"
                }
            }()

            // 3. Локализираме двата ключа
            let planTypeLocalized = NSLocalizedString(
                planTypeKey,
                comment: "Subscription plan type"
            )
            let periodLocalized = NSLocalizedString(
                periodKey,
                comment: "Subscription period unit"
            )

            VStack(spacing: 5) {
                Text(
                    String(
                        format: NSLocalizedString(
                            "You are subscribed to the %@ %@ plan",
                            comment: "Status line showing current plan and period"
                        ),
                        planTypeLocalized,
                        periodLocalized
                    )
                )
                .font(.headline)

                Text(
                    String(
                        format: NSLocalizedString(
                            "Renews on: %@",
                            comment: "Label for renewal date"
                        ),
                        DateFormatter.localizedString(from: expiry, dateStyle: .medium, timeStyle: .none)
                    )
                )
                .font(.subheadline)
                .foregroundColor(.secondary)

                Button(
                    NSLocalizedString("Manage Subscription", comment: "Button title to open subscription management")
                ) {
                    Task { await manager.openManageSubscriptions() }
                }
                .font(.caption)
                .padding(.top, 5)
            }
            .padding(.vertical)
        }
    }


    @ViewBuilder
    private func PurchaseSectionView(selectedProductID: String?) -> some View {
        if let id = selectedProductID,
           let product = manager.products.first(where: { $0.id == id }) {
            
            VStack(spacing: 15) {
                if let summary = offerSummary(product: product) {
                    Text(summary)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .fixedSize(horizontal: false, vertical: true)
                }
                
                Button {
                    Task { await manager.purchase(product) }
                } label: {
                    let labelKey = product.subscription?.introductoryOffer != nil
                        ? NSLocalizedString("Start Free Trial", comment: "Button to start trial")
                        : NSLocalizedString("Subscribe Now", comment: "Button to subscribe immediately")
                    
                    Text(labelKey)
                        .font(.headline.weight(.semibold))
                        .padding(.vertical, 12)
                        .padding(.horizontal)
                        .frame(maxWidth: .infinity)
                        .foregroundColor(.white)
                        .background(Color.accentColor)
                        .cornerRadius(10)
                }
            }
            .padding(.vertical)
        }
    }

    // Връщаме локализирана String
    private func offerSummary(product: Product) -> String? {
        let suffix = product.subscription?.subscriptionPeriod.unit.perPeriodString ?? ""
        let price  = product.displayPrice
        if let intro = product.subscription?.introductoryOffer {
            let plural  = intro.period.value > 1
            let unitTxt = intro.period.unit.noun(plural: plural).lowercased()
            return String(
                format: NSLocalizedString(
                    "%d %@ free, then %@%@.",
                    comment: "Intro offer summary: free period then price"
                ),
                intro.period.value,
                unitTxt,
                price,
                suffix
            )
        } else {
            return String(
                format: NSLocalizedString(
                    "Subscribe for %@%@.",
                    comment: "Standard subscribe summary with price"
                ),
                price,
                suffix
            )
        }
    }
}
