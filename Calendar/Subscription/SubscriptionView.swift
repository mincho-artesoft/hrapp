import SwiftUI

// MARK: - Category Enum
enum SubscriptionCategory: String, CaseIterable, Identifiable {
    case base = "Base"
    case advance = "Advance"
    case premium = "Premium"
    var id: String { rawValue }
}

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
                        Text(category.rawValue).tag(category)
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
                    for: .notificationDraggableMenuViewSub)) { notification in
                    if let info = notification.userInfo,
                       let value = info["subscriptionStatusRaw"] as? String {
                        switch value {
                        case "Advance":
                            alertMessage = "You need an active Advance plan to access this section."
                            selectedCategory = .advance
                        case "Premium":
                            alertMessage = "You need an active Premium plan to access this section."
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
            .alert("Plan Required", isPresented: $showPlanAlert) {
                Button("OK", role: .cancel) { }
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
