//
//  SubscriptionListView.swift
//  ArteCalendar
//
//  Created by Aleksandar Svinarov on 29/4/25.
//


// SubscriptionListView.swift
// ArteCalendar
// Created by Aleksandar Svinarov on 29/4/25.

import SwiftUI
import StoreKit

struct SubscriptionListView: View {
    let title: String
    let products: [Product]
    @Binding var selectedProductID: String?
    @StateObject private var manager = SubscriptionManager.shared

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                Text(title)
                    .font(.title2.bold())
                    .padding(.top)

                HStack(spacing: 10) {
                    ForEach(products) { product in
                        SubscriptionCard(
                            product: product,
                            isActive: manager.purchasedProductIDs.contains(product.id),
                            isSelected: product.id == selectedProductID,
                            expirationDate: manager.expirationDates[product.id]
                        ) {
                            if !manager.hasActiveSubscription {
                                selectedProductID = product.id
                            }
                        }
                        .disabled(manager.hasActiveSubscription && !manager.purchasedProductIDs.contains(product.id))
                        .opacity(manager.hasActiveSubscription && !manager.purchasedProductIDs.contains(product.id) ? 0.6 : 1.0)
                    }
                }
                .padding(.horizontal)

                if manager.hasActiveSubscription {
                    ActiveSubscriptionStatusView()
                        .padding(.horizontal)
                } else {
                    PurchaseSectionView(selectedProductID: selectedProductID)
                        .padding(.horizontal)
                }
            }
        }
    }

    @ViewBuilder
    private func ActiveSubscriptionStatusView() -> some View {
        if let activeID = manager.purchasedProductIDs.first,
           let product = manager.products.first(where: { $0.id == activeID }),
           let expiry = manager.expirationDates[activeID] {
            VStack(spacing: 5) {
                Text("You are subscribed to \(product.periodUnitOnly)")
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
        // Ако няма избран продукт — нищо не се рисува
        if let id = selectedProductID,
           let product = manager.products.first(where: { $0.id == id }) {
            
            VStack(spacing: 15) {
                // Оферта: "X дни безплатно, след това Y"
                if let summary = offerSummary(product: product) {
                    Text(summary)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .fixedSize(horizontal: false, vertical: true)
                }
                
                // Бутон за покупка или безплатен период
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
        // else: @ViewBuilder автоматично връща EmptyView()
    }

    private func offerSummary(product: Product) -> String? {
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
