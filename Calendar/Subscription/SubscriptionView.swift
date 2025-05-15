import SwiftUI
import StoreKit // Keep for Product type if used in subviews

// Assuming SubscriptionCategory exists and has .title and .rawValue
// enum SubscriptionCategory: String, CaseIterable, Identifiable {
//    case base, advance, premium
//    var id: String { self.rawValue }
//    var title: String { // Provide appropriate titles }
// }
// Assuming .notificationDraggableMenuViewSub is a defined Notification.Name

// MARK: - Main Subscription View
struct SubscriptionView: View {
    // Use @EnvironmentObject if SubscriptionManager is provided higher up in the hierarchy
    // For a standalone view, @StateObject is fine if this is where it's primarily managed.
    // If it's truly shared across the app, @EnvironmentObject is better.
    @StateObject private var manager = SubscriptionManager.shared

    @State private var selectedCategory: SubscriptionCategory = .base
    // selectedProductID is managed within SubscriptionListView now for clarity

    // Alert for plan required (from notifications)
    @State private var showPlanRequiredAlert = false
    @State private var planRequiredAlertMessage = ""

    // Alert for restoration status
    @State private var showRestorationAlert = false
    // restorationAlertMessage is now a @Published var in SubscriptionManager

    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.openURL) var openURL // For opening legal links

    // URLs - Replace with your actual URLs
    let privacyPolicyURL = URL(string: "https://www.yourwebsite.com/privacy-policy")!
    // If using Apple's Standard EULA, use their link. If custom, use yours.
    let termsOfUseURL = URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!

    var body: some View {
        // Using Form or List for better structure and standard iOS styling
        Form {
            // Section for Plan Selection
            Section {
                Picker("Plan", selection: $selectedCategory) {
                    ForEach(SubscriptionCategory.allCases) { category in
                        Text(category.title).tag(category)
                    }
                }
                .pickerStyle(.segmented)
            }

            // Section for Subscription Options
            // The content (Base, Advance, Premium lists)
            Group {
                switch selectedCategory {
                case .base:
                    BaseSubscriptionView() // Assuming this view explains the free tier
                        .padding(.vertical) // Add some padding if it's just text

                case .advance:
                    SubscriptionListView(
                        title: "Advance Plans",
                        products: manager.sortedProducts.filter { $0.id.localizedCaseInsensitiveContains("advanced") },
                        category: .advance // Pass category for context
                    )

                case .premium:
                    SubscriptionListView(
                        title: "Premium Plans",
                        products: manager.sortedProducts.filter { $0.id.localizedCaseInsensitiveContains("premium") },
                        category: .premium // Pass category for context
                    )
                }
            }
            .listRowBackground(Color.clear) // Make the background of the Group clear if using Form

            // Section for Management & Legal - ALWAYS VISIBLE
            Section(header: Text("Manage & Legal").font(.headline)) {
                // RESTORE PURCHASES BUTTON
                Button {
                    Task {
                        await manager.restorePurchases()
                        // showRestorationAlert will be triggered by onChange of manager.restorationAlertMessage
                    }
                } label: {
                    HStack {
                        Image(systemName: "arrow.triangle.2.circlepath.circle")
                        Text("Restore Purchases")
                        Spacer()
                        if manager.isRestoring {
                            ProgressView().scaleEffect(0.7)
                        }
                    }
                }
                .disabled(manager.isRestoring)

                // MANAGE SUBSCRIPTIONS (Optional but good UX)
                if manager.hasActiveSubscription {
                    Button {
                        Task {
                            await manager.openManageSubscriptions()
                        }
                    } label: {
                        HStack {
                            Image(systemName: "creditcard.circle")
                            Text("Manage Subscriptions")
                        }
                    }
                }

                // LEGAL LINKS - REQUIRED
                Button {
                    openURL(privacyPolicyURL)
                } label: {
                    HStack {
                        Image(systemName: "lock.shield")
                        Text("Privacy Policy")
                        Spacer()
                        Image(systemName: "link")
                    }
                }
                
                Button {
                    openURL(termsOfUseURL)
                } label: {
                    HStack {
                        Image(systemName: "doc.text")
                        Text("Terms of Use (EULA)")
                        Spacer()
                        Image(systemName: "link")
                    }
                }
            }
            .foregroundColor(.primary) // Ensure text color is appropriate

            // Optional: Display current subscription status
            if manager.hasActiveSubscription || !manager.purchasedProductIDs.isEmpty {
                 Section(header: Text("Current Status")) {
                    Text("Active Tier: \(manager.currentSubscriptionTier.displayName)")
                    if let firstID = manager.purchasedProductIDs.first,
                       let expiry = manager.expirationDates[firstID],
                       expiry > Date() {
                        Text("Expires: \(expiry, style: .date)")
                    } else if !manager.purchasedProductIDs.isEmpty {
                        Text("Subscription Expired")
                            .foregroundColor(.orange)
                    }
                }
            }
        }
        .navigationTitle("Cloud Calendars Pro") // Assuming this view is within a NavigationView
        .background(Color(.systemGroupedBackground).ignoresSafeArea()) // Keep if desired, Form handles its own bg

        // MARK: - Lifecycle and State Changes
        .onAppear {
            Task {
                // Load products if not already loaded
                if manager.products.isEmpty && !manager.isLoadingProducts {
                    await manager.loadProducts()
                }
                // Always update status on appear
                await manager.updateSubscriptionStatus()
                // setupDefaultSelection() // This might be better handled within SubscriptionListView
            }
        }
        .onChange(of: scenePhase) { _, newPhase in
            if newPhase == .active {
                Task {
                    print("Scene became active, updating subscription status.")
                    await manager.updateSubscriptionStatus()
                }
            }
        }
        // This updates the selected tab if the active subscription changes elsewhere
        .onChange(of: manager.currentSubscriptionTier) { _, newTier in
            if newTier > .base { // If there's an active paid subscription
                if newTier == .advance && selectedCategory != .advance {
                    selectedCategory = .advance
                } else if newTier == .premium && selectedCategory != .premium {
                    selectedCategory = .premium
                }
            } else if selectedCategory != .base { // If no active paid sub, but a paid tab is selected
                // selectedCategory = .base // Or keep the current tab, let user decide
            }
        }

        // MARK: - Alert for Plan Required (from external notification)
        .onReceive(
            NotificationCenter.default.publisher(for: .notificationDraggableMenuViewSub) // Ensure this notification name is correct
        ) { notification in
            if let info  = notification.userInfo,
               let value = info["subscriptionStatusRaw"] as? String { // Ensure key and type match
                
                let requiredCategory: SubscriptionCategory? = SubscriptionCategory(rawValue: value)
                
                guard let category = requiredCategory, category > .base else { return }

                planRequiredAlertMessage = String(
                    format: NSLocalizedString(
                        "You need an active %@ plan to access this section.",
                        comment: "Alert when user tries to access a feature without required subscription"
                    ),
                    category.title
                )
                selectedCategory = category // Switch to the relevant tab
                showPlanRequiredAlert = true
            }
        }
        .alert(
            Text(NSLocalizedString("Plan Required", comment: "Alert title when plan missing")),
            isPresented: $showPlanRequiredAlert,
            actions: {
                Button(NSLocalizedString("OK", comment: "OK button title"), role: .cancel) { }
            },
            message: {
                Text(planRequiredAlertMessage)
            }
        )

        // MARK: - Alert for Restoration Status
        .onChange(of: manager.restorationAlertMessage) { _, newMessage in
            if newMessage != nil {
                showRestorationAlert = true
            }
        }
        .alert(
            "Restore Status", // Title for restoration alert
            isPresented: $showRestorationAlert,
            presenting: manager.restorationAlertMessage, // Bind to the optional message in manager
            actions: { _ in // The message string is passed here if needed
                Button("OK") {
                    manager.restorationAlertMessage = nil // Clear message after alert is dismissed
                }
            },
            message: { messageText in
                Text(messageText) // Display the message from the manager
            }
        )
    }

    // `setupDefaultSelection` might be complex here if `SubscriptionListView` handles its own selection.
    // If `SubscriptionListView` needs a pre-selected product ID from this parent view,
    // then this logic would be needed. Otherwise, it can be simplified or removed if
    // each `SubscriptionListView` just displays its products.
    // For now, I've removed it, assuming SubscriptionListView will show all its products
    // and the purchase buttons will handle selection.
}

// MARK: - Placeholder/Example Sub-Views (Adapt these)

struct BaseSubscriptionView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Free Tier Features")
                .font(.title2)
                .padding(.bottom, 5)
            Text("• Access basic calendar functions.")
            Text("• Sync with one cloud account.")
            Text("• Limited event creation.")
            Spacer()
            Text("Upgrade for more features!")
                .font(.headline)
        }
        .padding()
    }
}

// Assuming SubscriptionListView is defined elsewhere and takes products and category.
// It should handle displaying product.displayName, product.description, product.displayPrice
// and the purchase button for each product.
//
// struct SubscriptionListView: View {
//     @EnvironmentObject var manager: SubscriptionManager
//     let title: String
//     let products: [Product]
//     let category: SubscriptionCategory // For context if needed
//     // @Binding var selectedProductID: String? // If selection is managed here
//
//     var body: some View {
//         // ... List of ProductViews for the given products ...
//         // Each ProductView would have:
//         // - product.displayName
//         // - product.description
//         // - product.displayPrice
//         // - Purchase button calling manager.purchase(product)
//     }
// }

//``````````
//import SwiftUI
//import StoreKit      // ← нужно за Product в child вю-та
//
//// MARK: - Main Subscription View
//struct SubscriptionView: View {
//    @StateObject private var manager = SubscriptionManager.shared
//
//    @State private var selectedCategory: SubscriptionCategory = .base
//    @State private var selectedProductID: String?
//
//    // Alert
//    @State private var showPlanAlert = false
//    @State private var alertMessage   = ""
//
//    @Environment(\.scenePhase) private var scenePhase   // ← NEW
//
//    var body: some View {
//            VStack {
//                // Segmented picker
//                Picker("Plan", selection: $selectedCategory) {
//                    ForEach(SubscriptionCategory.allCases) { category in
//                        Text(category.title).tag(category)
//                    }
//                }
//                .padding(.top)
//                .padding(.horizontal)
//                .pickerStyle(.segmented)
//
//                // Tab content
//                Group {
//                    switch selectedCategory {
//                    case .base:
//                        BaseSubscriptionView()
//
//                    case .advance:
//                        SubscriptionListView(
//                            title: "Advance Plans",
//                            products: manager.sortedProducts.filter { $0.id.localizedCaseInsensitiveContains("advanced") },
//                            selectedProductID: $selectedProductID
//                        )
//
//                    case .premium:
//                        SubscriptionListView(
//                            title: "Premium Plans",
//                            products: manager.sortedProducts.filter { $0.id.localizedCaseInsensitiveContains("premium") },
//                            selectedProductID: $selectedProductID
//                        )
//                    }
//                }
//
//                Spacer()
//            }
//            .background(Color(.systemGroupedBackground).ignoresSafeArea())
//
//            // MARK: – реагира на промени
//            .onAppear { setupDefaultSelection() }
//            .onChange(of: selectedCategory)          {setupDefaultSelection() }
//            .onChange(of: manager.products)          {setupDefaultSelection() }
//            .onChange(of: manager.hasActiveSubscription) {
//                if manager.hasActiveSubscription {
//                    selectedProductID = manager.purchasedProductIDs.first
//                } else {
//                    setupDefaultSelection()
//                }
//            }
//            // NEW: презареждаме при връщане на преден план
//            .onChange(of: scenePhase) { _, phase in
//                if phase == .active {
//                    Task { await manager.updatePurchasedStatus() }
//                }
//            }
//
//            // MARK: – алерти от други части на приложението
//            .onReceive(
//                NotificationCenter.default.publisher(for: .notificationDraggableMenuViewSub)
//            ) { notification in
//                if let info  = notification.userInfo,
//                   let value = info["subscriptionStatusRaw"] as? String {
//print("value",value)
//                    switch value {
//                    case SubscriptionCategory.advance.rawValue:
//                        alertMessage = String(
//                            format: NSLocalizedString(
//                                "You need an active %@ plan to access this section.",
//                                comment: "Alert when user tries to access Advance without subscription"
//                            ),
//                            SubscriptionCategory.advance.title
//                        )
//                        selectedCategory = .advance
//
//                    case SubscriptionCategory.premium.rawValue:
//                        alertMessage = String(
//                            format: NSLocalizedString(
//                                "You need an active %@ plan to access this section.",
//                                comment: "Alert when user tries to access Premium without subscription"
//                            ),
//                            SubscriptionCategory.premium.title
//                        )
//                        selectedCategory = .premium
//
//                    default:
//                        return
//                    }
//                    showPlanAlert = true
//                }
//            }
//
//            // MARK: – системен alert
//            .alert(
//                Text(NSLocalizedString("Plan Required", comment: "Alert title when plan missing")),
//                isPresented: $showPlanAlert
//            ) {
//                Button(NSLocalizedString("OK", comment: "OK button title"), role: .cancel) { }
//            } message: {
//                Text(alertMessage)
//            }
//        .cornerRadius(10)
//        .padding(.horizontal)
//    }
//
//    /// Избира „първия, който може да се купи“ за текущия таб
//    private func setupDefaultSelection() {
//        // BASE няма платени продукти
//        guard selectedCategory != .base else {
//            selectedProductID = nil
//            return
//        }
//
//        // Филтър за Advance/Premium
//        let categoryMatches: (Product) -> Bool = { product in
//            switch selectedCategory {
//            case .advance: return product.id.contains("advanced")
//            case .premium: return product.id.contains("premium")
//            case .base:    return false
//            }
//        }
//
//        // Търсим първия REAL selectable
//        if let firstSelectable = manager.sortedProducts.first(where: { product in
//            categoryMatches(product) &&
//            manager.canPurchase(product) &&
//            !manager.purchasedProductIDs.contains(product.id)
//        }) {
//            selectedProductID = firstSelectable.id
//        } else {
//            selectedProductID = nil
//        }
//    }
//}
