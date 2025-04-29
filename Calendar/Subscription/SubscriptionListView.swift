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
                            // позволяваме селекция само ако можем да купим/ъпгрейднем
                            if canBuy {
                                selectedProductID = product.id
                            }
                        }
                        // забраняваме и избледняваме само опциите, които не можем да купим
                        .disabled(!canBuy)
                        .opacity(!canBuy ? 0.6 : 1.0)
                    }
                }
                .padding(.horizontal)

                // винаги показваме статуса на активната подписка
                ActiveSubscriptionStatusView()
                    .padding(.horizontal)

                // а бутоните за Subscribe показваме само ако:
                //  - има селектиран product
                //  - не е вече изкупен (isActive == false)
                //  - може да се купи/ъпгрейдне
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
            
            // Вземаме типа план от SubscriptionManager (Advance, Premium или Base)
            let planType = manager.subscriptionStatus.rawValue
            // Вземаме периода (Monthly или Yearly)
            let period   = product.periodUnitOnly
            
            VStack(spacing: 5) {
                Text("You are subscribed to the \(planType) \(period) plan")
                    .font(.headline)
                Text("Renews on: \(expiry, style: .date)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                Button("Manage Subscription") {
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
                    let labelText = product.subscription?.introductoryOffer != nil
                        ? "Start Free Trial"
                        : "Subscribe Now"
                    
                    Text(labelText)
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

    private func offerSummary(product: Product) -> String? {
        let suffix = product.subscription?.subscriptionPeriod.unit.perPeriodString ?? ""
        let price  = product.displayPrice
        if let intro = product.subscription?.introductoryOffer {
            let plural  = intro.period.value > 1
            let unitTxt = intro.period.unit.noun(plural: plural).lowercased()
            return "\(intro.period.value) \(unitTxt) free, then \(price)\(suffix)."
        } else {
            return "Subscribe for \(price)\(suffix)."
        }
    }
}
