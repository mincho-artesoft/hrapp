import SwiftUI

// MARK: - Main Subscription View
struct SubscriptionView: View {
    @StateObject private var manager = SubscriptionManager.shared
    @State private var selectedCategory: SubscriptionCategory = .base
    @State private var selectedProductID: String?

    // State for showing the alert
    @State private var showPlanAlert = false
    @State private var alertMessage = ""

    var body: some View {
        NavigationView {
            VStack {
                // Picker to switch between plans
                Picker("Plan", selection: $selectedCategory) {
                    ForEach(SubscriptionCategory.allCases) { category in
                        // вместо rawValue ➝ вече показваме локализираното title
                        Text(category.title).tag(category)
                    }
                }
                .padding(.top)
                .padding(.horizontal)
                .pickerStyle(SegmentedPickerStyle())

                // Show the appropriate subview
                Group {
                    switch selectedCategory {
                    case .base:
                        BaseSubscriptionView()
                    case .advance:
                        SubscriptionListView(
                            title: "Advance Plans",
                            products: manager.sortedProducts.filter { $0.id.contains("advance") },
                            selectedProductID: $selectedProductID
                        )
                    case .premium:
                        SubscriptionListView(
                            title: "Premium Plans",
                            products: manager.sortedProducts.filter { $0.id.contains("premium") },
                            selectedProductID: $selectedProductID
                        )
                    }
                }
                // Listen for notification and trigger alert
                .onReceive(NotificationCenter.default.publisher(
                    for: .notificationDraggableMenuViewSub)
                ) { notification in
                    if let info = notification.userInfo,
                       let value = info["subscriptionStatusRaw"] as? String {
                        switch value {
                        case SubscriptionCategory.advance.rawValue:
                            // Използваме форматен низ с локализация и локализирания title
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
                .onAppear { setupDefaultSelection() }
                .onChange(of: manager.products) { setupDefaultSelection() }
                .onChange(of: manager.hasActiveSubscription) {
                    if manager.hasActiveSubscription {
                        selectedProductID = manager.purchasedProductIDs.first
                    } else {
                        setupDefaultSelection()
                    }
                }

                Spacer()
            }
            .background(Color(.systemGroupedBackground).ignoresSafeArea())
            // Alert presentation
            .alert(
                // заглавие на алерта
                Text(NSLocalizedString("Plan Required", comment: "Alert title when plan missing")),
                isPresented: $showPlanAlert
            ) {
                // бутон OK
                Button(
                    NSLocalizedString("OK", comment: "OK button title"),
                    role: .cancel
                ) { }
            } message: {
                Text(alertMessage)
            }
        }
        .cornerRadius(10)
        .padding(.horizontal)
    }

    private func setupDefaultSelection() {
        switch selectedCategory {
        case .advance:
            selectedProductID = manager.sortedProducts
                .first(where: { $0.id.contains("advance") && $0.id.contains("yearly") })?.id
        case .premium:
            selectedProductID = manager.sortedProducts
                .first(where: { $0.id.contains("premium") && $0.id.contains("yearly") })?.id
        case .base:
            selectedProductID = nil
        }
    }
}
