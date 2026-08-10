import SwiftUI
import StoreKit
import SafariServices

struct SubscriptionListView: View {
    let title: String
    let products: [Product]
    @Binding var selectedProductID: String?
    @StateObject private var manager = SubscriptionManager.shared
    @State private var presentedURL: URL?
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Сравняваме вече локализирани заглавия
                if title == "Advance Plans"{
                    AdvanceSubscriptionView()
                    
                }else if title == "Premium Plans"{
                    PremiumSubscriptionView()
                }
                
                LazyVGrid(
                    columns: Array(
                        repeating: GridItem(.flexible(), spacing: 10),
                        count: min(max(products.count, 1), 2)
                    ),
                    spacing: 10
                ) {
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
                        .frame(maxWidth: .infinity)
                    }
                }
                .padding(.horizontal)
                .padding(.top, -20)
                ActiveSubscriptionStatusView()
                
                if let id = selectedProductID,
                   let product = manager.products.first(where: { $0.id == id }),
                   !manager.purchasedProductIDs.contains(id),
                   manager.canPurchase(product) {
                    PurchaseSectionView(selectedProductID: id)
                        .padding(.horizontal)
                }
                // Вашият HStack с Manage и Restore бутони...
                HStack(alignment: .top, spacing: 12) {
                    VStack(alignment: .leading, spacing: 10){
                        Button {
                            Task { await manager.openManageSubscriptions() }
                        } label: {
                            Label(
                                NSLocalizedString("Manage Subscription",
                                                  comment: "Button to open subscription management"),
                                systemImage: "creditcard")
                        }
                        .font(.footnote)
                        .adaptiveSingleLine(minimumScale: 0.4)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                        Button {
                            presentedURL = URL(string: "https://www.cloud-calendars.com/privacy-policy")!
                        } label: {
                            Label(
                                NSLocalizedString("Privacy Policy",
                                                  comment: "Open privacy policy link"),
                                systemImage: "lock.shield")
                        }
                        .font(.footnote)
                        .adaptiveSingleLine(minimumScale: 0.4)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    
                    VStack(alignment: .leading, spacing: 10){
                        Button {
                            Task { await manager.restorePurchases() }
                        } label: {
                            Label(
                                NSLocalizedString("Restore Purchases",
                                                  comment: "Restore"),
                                systemImage: "arrow.trianglehead.2.clockwise")
                        }
                        .font(.footnote)
                        .adaptiveSingleLine(minimumScale: 0.4)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        
                        Button {
                            presentedURL = URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!
                        } label: {
                            Label(
                                NSLocalizedString("Terms of Service",
                                                  comment: "Open terms of service link"),
                                systemImage: "doc.text")
                        }
                        .font(.footnote)
                        .adaptiveSingleLine(minimumScale: 0.4)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding(.horizontal, 25)
                .padding(.top, 10)
            }
            .sheet(item: $presentedURL) { url in
                SafariView(url: url)
            }
        }
        Spacer()
    }
    

    @ViewBuilder
    private func ActiveSubscriptionStatusView() -> some View {
        if let activeID = manager.purchasedProductIDs.first,
           let product = manager.products.first(where: { $0.id == activeID }),
           let expiry = manager.expirationDates[activeID] {

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

            VStack(alignment: .leading, spacing: 10) {
                // Първата част – Subscription status
                Text(
                     localizedFormat(NSLocalizedString(
                             "SubscriptionStatus",
                             comment: "Status without the"
                         ),
                         planTypeLocalized,
                         periodLocalized
                     )
                 )
                 .font(.headline)

                 Text(
                     localizedFormat(NSLocalizedString(
                             "RenewsOn",
                             comment: "Label for renewal date"
                         ),
                         DateFormatter.localizedString(
                             from: expiry,
                             dateStyle: .medium,
                             timeStyle: .none
                         )
                     )
                 )
                 .font(.subheadline)
                 .foregroundColor(.secondary)
            }
            .padding(.top, 10)
            .padding(.vertical)

        }
    }


    @ViewBuilder
    private func PurchaseSectionView(selectedProductID: String?) -> some View {
        if let id = selectedProductID,
           let product = manager.products.first(where: { $0.id == id }) {
            
            VStack(spacing: 15) {
                Button {
                    Task { await manager.purchase(product) }
                } label: {
                    let labelKey = product.subscription?.introductoryOffer != nil
                        ? NSLocalizedString("Start Free Trial", comment: "Button to start trial")
                        : NSLocalizedString("Subscribe Now", comment: "Button to subscribe immediately")
                    
                    Text(labelKey)
                        .font(.headline.weight(.semibold))
                        .adaptiveSingleLine(minimumScale: 0.45)
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
}
