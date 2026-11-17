import SwiftUI
import StoreKit
#if os(iOS)
import SafariServices
#else
import AppKit
#endif

struct SubscriptionView: View {
    @ObservedObject private var manager = SubscriptionManager.shared
    @State private var selectedCategory: SubscriptionCategory = .advance
    @State private var selectedProductID: String?
    @State private var hasInitializedCategory = false
    @State private var isRedeemingCode = false
    @State private var presentedURL: URL?
    @State private var showPlanAlert = false
    @State private var alertMessage = ""
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        VStack(spacing: 0) {
            SubscriptionCategoryPicker(selection: $selectedCategory)
                .frame(maxWidth: 920)
                .padding(.horizontal, 18).padding(.vertical, 16)
            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    if selectedCategory == .base {
                        SubscriptionFeaturesView(category: .base)
                    } else {
                        SubscriptionListView(category: selectedCategory, products: categoryProducts, selectedProductID: $selectedProductID)
                    }
                    if selectedCategory != .base { linksSection }
                }
                .foregroundStyle(SubscriptionPalette.text)
                .frame(maxWidth: 920)
                .padding(.horizontal, 18).padding(.bottom, 30)
                .frame(maxWidth: .infinity)
            }
        }
        .background(SubscriptionScreenBackground())
        .buttonStyle(.plain)
        .offerCodeRedemption(isPresented: $isRedeemingCode) { result in
            if case .failure(let error) = result {
                if case StoreKitError.userCancelled = error { return }
                manager.restorationAlertMessage = error.localizedDescription
            }
            Task { await manager.loadProducts(); await manager.updatePurchasedStatus() }
        }
        .task {
            if !hasInitializedCategory {
                hasInitializedCategory = true
                selectedCategory = manager.subscriptionStatus == .premium ? .premium : .advance
            }
            setupDefaultSelection()
            await manager.loadProducts()
            setupDefaultSelection()
        }
        .onChange(of: selectedCategory) { _, _ in setupDefaultSelection() }
        .onChange(of: manager.products) { _, _ in setupDefaultSelection() }
        .onChange(of: manager.purchasedProductIDs) { _, _ in setupDefaultSelection() }
        .onChange(of: manager.debugPlanID) { _, _ in setupDefaultSelection() }
        .onChange(of: manager.scheduledProductIDs) { _, _ in setupDefaultSelection() }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active { Task { await manager.loadProducts(); await manager.updatePurchasedStatus() } }
        }
        .onReceive(NotificationCenter.default.publisher(for: .notificationDraggableMenuViewSub)) { notification in
            guard let raw = notification.userInfo?["subscriptionStatusRaw"] as? String,
                  let category = SubscriptionCategory(rawValue: raw), category != .base else { return }
            selectedCategory = category
            alertMessage = localizedFormat(NSLocalizedString("You need an active %@ plan to access this section.", comment: ""), category.title)
            showPlanAlert = true
        }
        .alert("Plan Required", isPresented: $showPlanAlert) { Button("OK", role: .cancel) {} } message: { Text(alertMessage) }
        .alert("Subscriptions", isPresented: Binding(get: { manager.restorationAlertMessage != nil },
                                                     set: { if !$0 { manager.restorationAlertMessage = nil } })) {
            Button("OK", role: .cancel) { manager.restorationAlertMessage = nil }
        } message: { Text(manager.restorationAlertMessage ?? "") }
        #if os(iOS)
        .appSheet(item: $presentedURL) { url in SafariView(url: url) }
        #endif
    }

    private var linksSection: some View {
        VStack(spacing: 12) {
            SubscriptionActionButton(title: "Redeem Offer Code", icon: "giftcard", tint: SubscriptionPalette.pro, prominent: true) {
                isRedeemingCode = true
            }
            .disabled(manager.isPurchasing || manager.isRestoring)
            .accessibilityIdentifier("subscription.redeemCode")
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 10) {
                    footerLink("Manage Subscription", icon: "creditcard") {
                        Task { await manager.openManageSubscriptions() }
                    }.disabled(manager.isPurchasing || manager.isRestoring)
                    footerLink("Privacy Policy", icon: "lock.shield") {
                        openURL("https://www.cloud-calendars.com/privacy-policy")
                    }
                }.frame(maxWidth: .infinity, alignment: .leading)
                VStack(alignment: .leading, spacing: 10) {
                    footerLink(manager.isRestoring ? "Restoring purchases..." : "Restore Purchases", icon: "arrow.trianglehead.2.clockwise") {
                        Task { await manager.restorePurchases() }
                    }.disabled(manager.isPurchasing || manager.isRestoring)
                    footerLink("Terms of Service", icon: "doc.text") {
                        openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")
                    }
                }.frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(.horizontal, 9).padding(.top, 10)
        }
    }

    private func footerLink(_ title: LocalizedStringKey, icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) { Label(title, systemImage: icon) }
            .font(CalendarTypography.footnote)
            .foregroundStyle(Color.appBlue)
            .lineLimit(2).minimumScaleFactor(0.85)
            .fixedSize(horizontal: false, vertical: true)
            .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var categoryProducts: [Product] {
        manager.sortedProducts.filter {
            switch selectedCategory {
            case .base: return false
            case .advance: return $0.id.localizedCaseInsensitiveContains("advanced")
            case .premium: return $0.id.localizedCaseInsensitiveContains("premium")
            }
        }
    }
    private func setupDefaultSelection() {
        guard selectedCategory != .base else { selectedProductID = nil; return }
        if categoryProducts.contains(where: { $0.id == selectedProductID }) { return }
        selectedProductID = (categoryProducts.first { manager.isCurrentPlan($0) }
            ?? categoryProducts.first { $0.subscription?.subscriptionPeriod.unit == .year }
            ?? categoryProducts.first)?.id
    }
    private func openURL(_ string: String) {
        guard let url = URL(string: string) else { return }
        #if os(macOS)
        NSWorkspace.shared.open(url)
        #else
        presentedURL = url
        #endif
    }
}
