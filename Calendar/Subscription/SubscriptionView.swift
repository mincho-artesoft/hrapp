import SwiftUI
import StoreKit      // ← нужно за Product в child вю-та

// MARK: - Main Subscription View
struct SubscriptionView: View {
    @StateObject private var manager = SubscriptionManager.shared

    @State private var showRestoreAlert = false
    @State private var restoreAlertMessage = ""
    
    @State private var selectedCategory: SubscriptionCategory = .base
    @State private var selectedProductID: String?

    // Alert
    @State private var showPlanAlert = false
    @State private var alertMessage   = ""

    @Environment(\.scenePhase) private var scenePhase   // ← NEW

    var body: some View {
            VStack {
                // Segmented picker
                Picker("Plan", selection: $selectedCategory) {
                    ForEach(SubscriptionCategory.allCases) { category in
                        Text(category.title).tag(category)
                    }
                }
                .padding(.top)
                .padding(.horizontal)
                .pickerStyle(.segmented)

                // Tab content
                Group {
                    switch selectedCategory {
                    case .base:
                        BaseSubscriptionView()

                    case .advance:
                        SubscriptionListView(
                            title: "Advance Plans",
                            products: manager.sortedProducts.filter { $0.id.localizedCaseInsensitiveContains("advanced") },
                            selectedProductID: $selectedProductID
                        )

                    case .premium:
                        SubscriptionListView(
                            title: "Premium Plans",
                            products: manager.sortedProducts.filter { $0.id.localizedCaseInsensitiveContains("premium") },
                            selectedProductID: $selectedProductID
                        )
                    }
                }

                Spacer()
            }
            .background(Color(.systemGroupedBackground).ignoresSafeArea())

            // MARK: – реагира на промени
            .onAppear { setupDefaultSelection() }
            .onChange(of: selectedCategory)          {setupDefaultSelection() }
            .onChange(of: manager.products)          {setupDefaultSelection() }
            .onChange(of: manager.hasActiveSubscription) {
                if manager.hasActiveSubscription {
                    selectedProductID = manager.purchasedProductIDs.first
                } else {
                    setupDefaultSelection()
                }
            }
            // NEW: презареждаме при връщане на преден план
            .onChange(of: scenePhase) { _, phase in
                if phase == .active {
                    Task { await manager.updatePurchasedStatus() }
                }
            }

            // MARK: – алерти от други части на приложението
            .onReceive(
                NotificationCenter.default.publisher(for: .notificationDraggableMenuViewSub)
            ) { notification in
                if let info  = notification.userInfo,
                   let value = info["subscriptionStatusRaw"] as? String {
                    switch value {
                    case SubscriptionCategory.advance.rawValue:
                        alertMessage = String(
                            format: NSLocalizedString(
                                "You need an active %@ plan to access this section.",
                                comment: "Alert when user tries to access Advance without subscription"
                            ),
                            SubscriptionCategory.advance.title
                        )
                        selectedCategory = .advance

                    case SubscriptionCategory.premium.rawValue:
                        alertMessage = String(
                            format: NSLocalizedString(
                                "You need an active %@ plan to access this section.",
                                comment: "Alert when user tries to access Premium without subscription"
                            ),
                            SubscriptionCategory.premium.title
                        )
                        selectedCategory = .premium

                    default:
                        return
                    }
                    showPlanAlert = true
                }
            }
            .onChange(of: manager.restorationAlertMessage) { _, newValue in
                      if let newValue {                         // когато не е nil
                          restoreAlertMessage = newValue
                          showRestoreAlert   = true             // отваряме alert-a
                          manager.restorationAlertMessage = nil // „обработено“
                      }
                  }
            // MARK: – системен alert
            .alert(
                Text(NSLocalizedString("Plan Required", comment: "Alert title when plan missing")),
                isPresented: $showPlanAlert
            ) {
                Button(NSLocalizedString("OK", comment: "OK button title"), role: .cancel) { }
            } message: {
                Text(alertMessage)
            }
            .alert(
                        Text(NSLocalizedString("Restore Purchases", comment: "Alert title")),
                        isPresented: $showRestoreAlert
                    ) {
                        Button("OK", role: .cancel) { }
                    } message: {
                        Text(restoreAlertMessage)
                    }
        .cornerRadius(10)
        .padding(.horizontal)
    }

    /// Избира „първия, който може да се купи“ за текущия таб
    private func setupDefaultSelection() {
        // BASE няма платени продукти
        guard selectedCategory != .base else {
            selectedProductID = nil
            return
        }

        // Филтър за Advance/Premium
        let categoryMatches: (Product) -> Bool = { product in
            switch selectedCategory {
            case .advance: return product.id.contains("advanced")
            case .premium: return product.id.contains("premium")
            case .base:    return false
            }
        }

        // Търсим първия REAL selectable
        if let firstSelectable = manager.sortedProducts.first(where: { product in
            categoryMatches(product) &&
            manager.canPurchase(product) &&
            !manager.purchasedProductIDs.contains(product.id)
        }) {
            selectedProductID = firstSelectable.id
        } else {
            selectedProductID = nil
        }
    }
}
