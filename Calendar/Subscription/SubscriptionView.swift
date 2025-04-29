import SwiftUI
import StoreKit

// MARK: - View
struct SubscriptionView: View {
    @StateObject var manager = SubscriptionManager.shared
    @State private var selectedProductID: String?
    // @Environment(\.windowScene) var windowScene // Uncomment if using AppStore.showManageSubscriptions

    var body: some View {
        NavigationView {
            ZStack {
                 Color(.systemGroupedBackground)
                    .ignoresSafeArea()

                content // No horizontal padding here
            }
            .onAppear { setupDefaultSelection() }
            .onChange(of: manager.products) { _ in setupDefaultSelection() }
            .onChange(of: manager.hasActiveSubscription) { _ in
                 if manager.hasActiveSubscription {
                     selectedProductID = manager.purchasedProductIDs.first
                 } else {
                     setupDefaultSelection()
                 }
            }
        }
    }

    private func setupDefaultSelection() {
        if selectedProductID == nil || !manager.products.contains(where: { $0.id == selectedProductID }) {
            if manager.hasActiveSubscription {
                selectedProductID = manager.purchasedProductIDs.first
            } else {
                selectedProductID = manager.sortedProducts.first { $0.id.contains("yearly") }?.id
                ?? manager.sortedProducts.first { $0.id.contains("monthly") }?.id
                ?? manager.sortedProducts.first?.id
            }
             print("Default selection set to: \(selectedProductID ?? "nil")")
        }
    }

    // --- МОДИФИЦИРАН content ViewBuilder ---
    @ViewBuilder
    private var content: some View {
        VStack { // Основен VStack
            if manager.isLoading {
                ProgressView("Loading subscriptions…")
                    .padding()
                    .frame(maxHeight: .infinity)
            } else if manager.products.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "cart.badge.questionmark")
                        .font(.system(size: 50))
                        .foregroundColor(.secondary)
                    Text("No Subscriptions Available")
                        .font(.title2)
                        .foregroundColor(.primary)
                    Text("Unable to load subscription plans...")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                .padding()
                .frame(maxHeight: .infinity)
            } else {
                 ScrollView {
                     VStack(spacing: 20) {
                         // Заглавия с индивидуален padding
                         Text("Unlock All Features")
                            .font(.title.bold())
                            .padding(.vertical, 10)
                            .padding(.horizontal) // <<-- Padding тук

                         Text("Choose your plan:")
                             .font(.headline)
                             .foregroundColor(.secondary)
                             .padding(.bottom, 15)
                             .padding(.horizontal) // <<-- Padding тук

                         // HStack с НАМАЛЕНО разстояние И ВЪНШЕН PADDING
                         HStack(spacing: 10) { // <<-- Може да пробвате 8, 10, 12
                             ForEach(manager.sortedProducts) { product in
                                 // Картите използват новия padding от SubscriptionCard
                                 SubscriptionCard(
                                     product: product,
                                     isActive: manager.purchasedProductIDs.contains(product.id),
                                     isSelected: product.id == selectedProductID,
                                     expirationDate: manager.expirationDates[product.id]
                                 ) {
                                     if !manager.hasActiveSubscription {
                                          selectedProductID = product.id
                                          print("Selected product: \(product.id)")
                                     }
                                 }
                                 .disabled(manager.hasActiveSubscription && !manager.purchasedProductIDs.contains(product.id))
                                 .opacity(manager.hasActiveSubscription && !manager.purchasedProductIDs.contains(product.id) ? 0.6 : 1.0)
                             }
                         }
                         .padding(.horizontal) // <<-- ДОБАВЕН ВЪНШЕН PADDING за стесняване

                         // Долни секции с индивидуален padding
                         if manager.hasActiveSubscription {
                             activeSubscriptionStatusView
                                .padding(.top, 20)
                                .padding(.horizontal) // <<-- Padding тук
                         } else {
                             purchaseSectionView
                                .padding(.top, 20)
                                .padding(.horizontal) // <<-- Padding тук
                         }

                         Spacer()

                     } // Край на VStack вътре в ScrollView
                 } // Край на ScrollView
            }
        } // Край на основния VStack
    }

    // Extracted view for the active subscription status
    @ViewBuilder
    private var activeSubscriptionStatusView: some View {
        if let activeID = manager.purchasedProductIDs.first,
           let activeProduct = manager.products.first(where: { $0.id == activeID }),
           let expiry = manager.expirationDates[activeID] {
            VStack(spacing: 5) {
                Text("You are subscribed to \(activeProduct.periodUnitOnly)")
                    .font(.headline)
                Text("Renews on: \(expiry, style: .date)")
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                Button("Manage Subscription") {
                     print("Manage subscription tapped")
                     Task { await openManageSubscriptions() }
                }
                .font(.caption)
                .padding(.top, 5)
            }
            .padding(.vertical)
        } else if manager.hasActiveSubscription {
             VStack(spacing: 5) {
                 Text("Subscription Active")
                    .font(.headline)
                 if let activeID = manager.purchasedProductIDs.first, let expiry = manager.expirationDates[activeID] {
                    Text("Renews on: \(expiry, style: .date)")
                       .font(.subheadline)
                       .foregroundColor(.secondary)
                 }
                 Button("Manage Subscription") {
                     print("Manage subscription tapped")
                     Task { await openManageSubscriptions() }
                 }
                 .font(.caption)
                 .padding(.top, 5)
             }
             .padding(.vertical)
        } else {
            Text("Thank you for supporting us!")
                .font(.headline)
                .padding(.vertical)
        }
    }

    // Helper function to open manage subscriptions URL
    @MainActor
    private func openManageSubscriptions() async {
        // Fallback - Open the App Store URL directly
        await openManageSubscriptionsURLFallback()
    }

    // Fallback function to open URL
    @MainActor
    private func openManageSubscriptionsURLFallback() async {
         guard let url = URL(string: "https://apps.apple.com/account/subscriptions") else {
             print("Could not create subscription management URL.")
             return
         }
         if await UIApplication.shared.canOpenURL(url) {
             await UIApplication.shared.open(url)
         } else {
             print("Cannot open subscription management URL.")
         }
     }

    // Extracted view for the purchase section (summary + button)
    @ViewBuilder
    private var purchaseSectionView: some View {
         VStack(spacing: 15) {
             if let summary = offerSummaryText() {
                  Text(summary)
                      .font(.caption)
                      .foregroundColor(.secondary)
                      .multilineTextAlignment(.center)
                      .fixedSize(horizontal: false, vertical: true)
             }

             Button {
                 guard let productToPurchase = selectedProduct else { return }
                 print("Attempting to purchase \(productToPurchase.id)...")
                 Task { await manager.purchase(productToPurchase) }
             } label: {
                 let buttonText = selectedProduct?.subscription?.introductoryOffer != nil ? "Start Free Trial" : "Subscribe Now"
                 Text(buttonText)
                     .font(.headline.weight(.semibold))
                     .padding(.vertical, 12)
                     .padding(.horizontal)
                     .frame(maxWidth: .infinity)
                     .foregroundColor(.white)
                     .background(Color.accentColor)
                     .cornerRadius(10)
             }
             .disabled(selectedProduct == nil)
             .opacity(selectedProduct == nil ? 0.6 : 1.0)
         }
         .padding(.vertical) // Само вертикален padding за тази секция
    }

    // Helper to get the currently selected product
    private var selectedProduct: Product? {
        manager.products.first { $0.id == selectedProductID }
    }

    // Helper function to generate the summary text below cards
    private func offerSummaryText() -> String? {
        guard let product = selectedProduct else { return nil }
        let priceSuffix = product.subscription?.subscriptionPeriod.unit.perPeriodString ?? ""
        let displayPrice = product.displayPrice

        if let intro = product.subscription?.introductoryOffer {
            let plural = intro.period.value > 1
            let unitText = intro.period.unit.noun(plural: plural).lowercased()
            return "\(intro.period.value) \(unitText) free, then \(displayPrice)\(priceSuffix)."
        } else {
            return "Subscribe for \(displayPrice)\(priceSuffix)."
        }
    }
}
