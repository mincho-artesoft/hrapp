import SwiftUI
import StoreKit
import UIKit // Keep for AppStore.showManageSubscriptions

typealias StoreTransaction = StoreKit.Transaction

// Enum to better manage subscription tiers
enum SubscriptionTier: String, Comparable, CaseIterable {
    case base = "Base"
    case advance = "Advanced" // Assuming "Cloud.Calendars.Advanced"
    case premium = "Premium"  // Assuming "Cloud.Calendars.Premium"

    static func < (lhs: SubscriptionTier, rhs: SubscriptionTier) -> Bool {
        // Define the order of tiers
        let order: [SubscriptionTier] = [.base, .advance, .premium]
        return order.firstIndex(of: lhs)! < order.firstIndex(of: rhs)!
    }

    var displayName: String { self.rawValue }
}

@MainActor
class SubscriptionManager: ObservableObject {
    @AppStorage("subscriptionTier") private var subscriptionTierRaw: String = SubscriptionTier.base.rawValue

    var currentSubscriptionTier: SubscriptionTier {
        get { SubscriptionTier(rawValue: subscriptionTierRaw) ?? .base }
        set {
            subscriptionTierRaw = newValue.rawValue
            objectWillChange.send() // Ensure UI updates
            print("👑 Subscription tier updated to: \(newValue.displayName)")
        }
    }

    @Published var products: [Product] = []
    @Published var purchasedProductIDs: Set<String> = [] {
        didSet { updateCurrentSubscriptionTier() }
    }
    @Published var expirationDates: [String: Date] = [:]

    @Published var isLoadingProducts = false // Specific for product loading
    @Published var isRestoring = false      // Specific for restoration process
    @Published var restorationAlertMessage: String? // For showing an alert after restore

    private var updatesTask: Task<Void, Never>?
    var hasActiveSubscription: Bool { currentSubscriptionTier > .base }

    // Product IDs - ensure these exactly match your App Store Connect setup
    static let advancedMonthlyID = "Cloud.Calendars.Advanced.Monthly"
    static let advancedYearlyID  = "Cloud.Calendars.Advanced.Yearly"
    static let premiumMonthlyID  = "Cloud.Calendars.Premium.Monthly"
    static let premiumYearlyID   = "Cloud.Calendars.Premium.Yearly"

    static let productIDs: [String] = [
        advancedMonthlyID,
        advancedYearlyID,
        premiumMonthlyID,
        premiumYearlyID
    ]

    static let shared = SubscriptionManager()

    private init() {
        updatesTask = Task.detached(priority: .background) { [weak self] in
            // Listen for transaction updates from the App Store.
            for await verificationResult in StoreTransaction.updates {
                await self?.process(verificationResult: verificationResult)
            }
        }

        Task {
            await loadProducts()
            await updateSubscriptionStatus() // Initial check
        }
    }

    deinit {
        updatesTask?.cancel()
    }

    // MARK: - Product Loading
    func loadProducts() async {
        guard !isLoadingProducts else { return }
        await MainActor.run { isLoadingProducts = true }
        defer { Task { @MainActor in isLoadingProducts = false } }

        do {
            let storeProducts = try await Product.products(for: Self.productIDs)
            // Sort products for consistent display (e.g., monthly before yearly, advanced before premium)
            var sortedProducts = [Product]()
            for id in Self.productIDs {
                if let product = storeProducts.first(where: { $0.id == id }) {
                    sortedProducts.append(product)
                }
            }
            await MainActor.run {
                self.products = sortedProducts
                #if DEBUG
                print("💡 [StoreKit] Loaded products:", self.products.map(\.id))
                #endif
            }
        } catch {
            print("❌ [StoreKit] Failed to fetch products: \(error)")
        }
    }

    // MARK: - Purchase
    func canPurchase(_ productToPurchase: Product) -> Bool {
        guard let currentSubTier = purchasedProductIDs.first.flatMap(getTier(for:)) else {
            return true // No active subscription, can purchase anything
        }
        guard let newSubTier = getTier(for: productToPurchase.id) else {
            return false // Product ID not recognized
        }

        if purchasedProductIDs.contains(productToPurchase.id) {
            return true // Trying to re-buy/renew the same thing (StoreKit handles this)
        }

        // Allow purchase if it's an upgrade or a different type within the same tier (e.g., monthly to yearly)
        // Or if it's a downgrade (StoreKit handles downgrade timing)
        return newSubTier >= currentSubTier || isDifferentPeriod(productToPurchase.id)
    }

    private func getTier(for productID: String) -> SubscriptionTier? {
        if productID.contains("Premium") { return .premium }
        if productID.contains("Advanced") { return .advance }
        return nil // Should not happen if IDs are correct
    }

    private func isDifferentPeriod(_ productID: String) -> Bool {
        guard let currentProductID = purchasedProductIDs.first else { return false }
        let isCurrentMonthly = currentProductID.contains("Monthly")
        let isNewMonthly = productID.contains("Monthly")
        return isCurrentMonthly != isNewMonthly && getTier(for: productID) == getTier(for: currentProductID)
    }
    
    func purchase(_ product: Product) async throws -> Bool {
        let result = try await product.purchase()

        switch result {
        case .success(let verification):
            await process(verificationResult: verification)
            await MainActor.run { UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil) } // Dismiss keyboard
            return true
        case .userCancelled:
            print("ℹ️ [StoreKit] Purchase cancelled by user.")
            return false
        case .pending:
            print("⏳ [StoreKit] Purchase is pending approval.")
            return false // Or handle as appropriate
        @unknown default:
            print("⚠️ [StoreKit] Unknown purchase result.")
            return false
        }
    }

    // MARK: - Transaction Processing & Entitlements
    private func process(verificationResult: VerificationResult<StoreTransaction>) async {
        do {
            let transaction = try verificationResult.payloadValue
            await MainActor.run {
                 register(transaction: transaction)
            }
            await transaction.finish() // Important: Finish the transaction
            await updateSubscriptionStatus() // Refresh status
        } catch {
            print("❌ [StoreKit] Transaction verification failed: \(error)")
        }
    }
    
    private func register(transaction: StoreTransaction) {
        guard transaction.revocationDate == nil else {
            print("ℹ️ [StoreKit] Transaction for \(transaction.productID) was revoked.")
            purchasedProductIDs.remove(transaction.productID)
            expirationDates.removeValue(forKey: transaction.productID)
            return
        }

        if products.contains(where: { $0.id == transaction.productID }) {
            print("✅ [StoreKit] Registering purchased product: \(transaction.productID)")
            purchasedProductIDs.insert(transaction.productID)
            if let expiry = transaction.expirationDate {
                expirationDates[transaction.productID] = expiry
            }
        } else {
            print("⚠️ [StoreKit] Purchased product ID \(transaction.productID) not found in loaded products.")
        }
    }


    func updateSubscriptionStatus() async {
        var validSubscriptionIDs: Set<String> = []
        var latestExpirationDate: Date? = nil
        var highestTierProductID: String? = nil
        var highestTier: SubscriptionTier = .base

        // Iterate through all current entitlements
        for await result in StoreTransaction.currentEntitlements {
            guard case .verified(let transaction) = result else { continue }

            if transaction.revocationDate == nil, // Not revoked
               let expirationDate = transaction.expirationDate,
               expirationDate > Date() { // Not expired

                if let tier = getTier(for: transaction.productID) {
                    if tier > highestTier {
                        highestTier = tier
                        highestTierProductID = transaction.productID
                        latestExpirationDate = expirationDate
                    } else if tier == highestTier {
                        // If same tier, prefer longer expiration or yearly over monthly
                        if let currentExpiry = latestExpirationDate, expirationDate > currentExpiry {
                            highestTierProductID = transaction.productID
                            latestExpirationDate = expirationDate
                        } else if latestExpirationDate == nil { // First one of this tier
                            highestTierProductID = transaction.productID
                            latestExpirationDate = expirationDate
                        }
                    }
                }
            }
        }
        
        var newPurchasedIDs = Set<String>()
        var newExpirationDates = [String: Date]()

        if let finalProductID = highestTierProductID, let finalExpiry = latestExpirationDate {
            newPurchasedIDs.insert(finalProductID)
            newExpirationDates[finalProductID] = finalExpiry
        }

        await MainActor.run {
            self.purchasedProductIDs = newPurchasedIDs
            self.expirationDates = newExpirationDates
            self.updateCurrentSubscriptionTier() // This will also trigger objectWillChange
             print("ℹ️ [StoreKit] Updated status. Active IDs: \(self.purchasedProductIDs), Tier: \(self.currentSubscriptionTier.displayName)")
        }
    }

    private func updateCurrentSubscriptionTier() {
        var determinedTier: SubscriptionTier = .base
        var latestExpiry: Date? = nil

        for productID in purchasedProductIDs {
            if let productTier = getTier(for: productID),
               let expiry = expirationDates[productID],
               expiry > Date() { // Ensure it's not expired

                if productTier > determinedTier {
                    determinedTier = productTier
                    latestExpiry = expiry
                } else if productTier == determinedTier {
                    if let currentExpiry = latestExpiry, expiry > currentExpiry {
                        latestExpiry = expiry // Prefer longer subscription within the same tier
                    } else if latestExpiry == nil {
                         latestExpiry = expiry
                    }
                }
            }
        }
        currentSubscriptionTier = determinedTier
    }


    // MARK: - Restore Purchases
    @MainActor
    func restorePurchases() async {
        isRestoring = true
        restorationAlertMessage = nil // Clear previous message
        defer { isRestoring = false }

        print("🔄 [StoreKit] Attempting to restore purchases...")
        do {
            // This refreshes the receipt and syncs transactions with the App Store.
            // Transaction.updates listener and currentEntitlements will reflect changes.
            try await AppStore.sync()
            
            // After sync, updateSubscriptionStatus will re-evaluate entitlements
            await updateSubscriptionStatus()

            if hasActiveSubscription {
                restorationAlertMessage = "Your previous purchases have been successfully restored."
                print("✅ [StoreKit] Restore successful. Active subscriptions found.")
            } else {
                restorationAlertMessage = "No active subscriptions found to restore."
                print("ℹ️ [StoreKit] Restore complete. No active subscriptions found for this Apple ID.")
            }
        } catch {
            print("❌ [StoreKit] Restore purchases failed: \(error)")
            restorationAlertMessage = "Failed to restore purchases. Please check your internet connection and try again. If the problem persists, please contact support. Error: \(error.localizedDescription)"
        }
    }

    // MARK: - Manage Subscriptions
    @MainActor
    func openManageSubscriptions() async {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene else {
            print("❌ [StoreKit] Could not find active window scene.")
            return
        }

        do {
            try await AppStore.showManageSubscriptions(in: windowScene)
            // It's good practice to refresh status after user might have made changes
            // Give it a slight delay as the sheet dismissal might not be instantaneous
            // Task { try? await Task.sleep(nanoseconds: 1_000_000_000); await self.updateSubscriptionStatus() }
        } catch {
            print("❌ [StoreKit] Failed to show manage subscriptions: \(error)")
        }
    }

    // MARK: - Sorting Helper
    var sortedProducts: [Product] {
        // This relies on the order in `productIDs` for primary sort,
        // then by price if needed (e.g. if you had different price points for same tier)
        products
    }
}

//import SwiftUI
//import StoreKit
//import UIKit
//
//typealias StoreTransaction = StoreKit.Transaction
//
//@MainActor
//class SubscriptionManager: ObservableObject {
//    @AppStorage("subscriptionStatus") private var subscriptionStatusRaw: String = SubscriptionStatus.base.rawValue
//
//    var subscriptionStatus: SubscriptionStatus {
//        get { SubscriptionStatus(rawValue: subscriptionStatusRaw) ?? .base }
//        set {
//            subscriptionStatusRaw = newValue.rawValue
//            objectWillChange.send()
//        }
//    }
//
//    @Published var products: [Product] = []
//    @Published var purchasedProductIDs: Set<String> = [] {
//        didSet { updateSubscriptionStatus() }
//    }
//    @Published var expirationDates: [String: Date] = [:]
//    @Published var isLoading = false
//
//    private var updatesTask: Task<Void, Never>?
//    var hasActiveSubscription: Bool { !purchasedProductIDs.isEmpty }
//
//    static let shared = SubscriptionManager()
//    private init() {
//        Task {
//            await loadProducts()
//            await updatePurchasedStatus()
//        }
//        startListeningForUpdates()
//    }
//
//    deinit { updatesTask?.cancel() }
//
//    // MARK: - Products --------------------------------------------------------
//
//    @MainActor
//    func loadProducts() async {
//        // Показваме spinner-а, докато зареждаме
//        await MainActor.run { isLoading = true }
//        defer { Task { @MainActor in isLoading = false } }
//
//        // 1️⃣  Списък с точните Product ID-та в реда, в който искаме да се
//        //      визуализират (годишните след месечните – или обратно).
//        let ids: [String] = [
//            "Cloud.Calendars.Advanced.Monthly",
//            "Cloud.Calendars.Advanced.Yearly",
//            "Cloud.Calendars.Premium.Monthly",
//            "Cloud.Calendars.Premium.Yearly"
//        ]
//
//        do {
//            // 2️⃣  Вземаме само продуктите, които StoreKit връща като „достъпни“
//            let fetched = try await Product.products(for: ids)
//
//            // 3️⃣  Подреждаме ги по същия ред като `ids`
//            await MainActor.run {
//                self.products = ids.compactMap { id in
//                    fetched.first(where: { $0.id == id })
//                }
//                // 4️⃣  За дебъг – ще виждате 0, 2 или 4 продукта според статуса им
//                #if DEBUG
//                print("💡 [StoreKit] Loaded products:", self.products.map(\.id))
//                #endif
//            }
//        } catch {
//            // 5️⃣  Груб, но полезен печат; можеш да добавиш Crashlytics или Alert
//            print("❌ [StoreKit] Failed to fetch products:", error.localizedDescription)
//        }
//    }
//
//    // MARK: - Purchase --------------------------------------------------------
//
//    func canPurchase(_ newProduct: Product) -> Bool {
//        guard hasActiveSubscription else { return true }         // no active sub → OK
//        if purchasedProductIDs.contains(newProduct.id) { return true } // same plan → OK
//        return isUpgradeable(to: newProduct)                     // else only if upgrade
//    }
//
//    private func isUpgradeable(to newProduct: Product) -> Bool {
//        guard let currentID = purchasedProductIDs.first,
//              let current   = products.first(where: { $0.id == currentID }),
//              let curUnit   = current.subscription?.subscriptionPeriod.unit,
//              let newUnit   = newProduct.subscription?.subscriptionPeriod.unit
//        else { return false }
//
//        return currentID.lowercased().contains("advanced") &&
//               newProduct.id.lowercased().contains("premium") &&
//               curUnit == newUnit
//    }
//
//    func purchase(_ product: Product) async {
//        if hasActiveSubscription &&
//            !isUpgradeable(to: product) &&
//            !purchasedProductIDs.contains(product.id) {
//            print("Cannot purchase – already have non-upgradeable subscription.")
//            return
//        }
//
//        do {
//            let result = try await product.purchase()
//            switch result {
//            case .success(let verification):
//                let transaction = try checkVerified(verification)
//                await MainActor.run { register(transaction: transaction) }
//                await transaction.finish()
//                await updatePurchasedStatus()
//            case .userCancelled, .pending: break
//            @unknown default:             break
//            }
//        } catch {
//            print("Purchase failed: \(error)")
//        }
//    }
//
//    // MARK: - Updates listener -----------------------------------------------
//
//    private func startListeningForUpdates() {
//        updatesTask = Task.detached(priority: .background) { [weak self] in
//            guard let self else { return }
//            for await verification in StoreTransaction.updates {
//                do {
//                    let tx = try await self.checkVerified(verification)
//                    await MainActor.run { self.register(transaction: tx) }
//                    await tx.finish()
//                    await self.updatePurchasedStatus()
//                } catch {
//                    print("Update verification failed: \(error)")
//                }
//            }
//        }
//    }
//
//    // MARK: - Entitlements ----------------------------------------------------
//
//    func updatePurchasedStatus() async {
//        var activeIDs   = Set<String>()
//        var expiryDates = [String: Date]()
//
//        for await verification in StoreTransaction.currentEntitlements {
//            do {
//                let tx = try checkVerified(verification)
//                if tx.revocationDate == nil,
//                   let expiry = tx.expirationDate,
//                   expiry > Date() {
//                    activeIDs.insert(tx.productID)
//                    expiryDates[tx.productID] = expiry
//                }
//            } catch {
//                print("Entitlement verification failed: \(error)")
//            }
//        }
//
//        // If any premium sub – drop advance ones
//        if activeIDs.contains(where: { $0.contains("premium") }) {
//            activeIDs   = activeIDs.filter { $0.contains("premium") }
//            expiryDates = expiryDates.filter { key, _ in key.contains("premium") }
//        }
//
//        await MainActor.run {
//            self.purchasedProductIDs = activeIDs
//            self.expirationDates     = expiryDates
//        }
//    }
//
//    private func register(transaction: StoreTransaction) {
//        guard transaction.revocationDate == nil else { return }
//        guard products.contains(where: { $0.id == transaction.productID }) else { return }
//        purchasedProductIDs.insert(transaction.productID)
//        if let expiry = transaction.expirationDate {
//            expirationDates[transaction.productID] = expiry
//        }
//    }
//
//    func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
//        switch result {
//        case .unverified(_, let error): throw error
//        case .verified(let safe):       return safe
//        }
//    }
//
//    // MARK: - Sorting helper --------------------------------------------------
//
//    var sortedProducts: [Product] {
//        products.sorted {
//            guard let u1 = $0.subscription?.subscriptionPeriod.unit,
//                  let u2 = $1.subscription?.subscriptionPeriod.unit else { return false }
//            return u1.sortIndex < u2.sortIndex
//        }
//    }
//
//    private func updateSubscriptionStatus() {
//        guard !purchasedProductIDs.isEmpty else {
//            subscriptionStatus = .base
//            return
//        }
//        if purchasedProductIDs.contains(where: { $0.lowercased().contains("premium") }) {
//            subscriptionStatus = .premium
//        } else if purchasedProductIDs.contains(where: { $0.lowercased().contains("advanced") }) {
//            subscriptionStatus = .advance
//        } else {
//            subscriptionStatus = .base
//        }
//    }
//
//    // MARK: - Manage subscription sheet --------------------------------------
//
//    @MainActor
//    func openManageSubscriptions() async {
//        guard let windowScene = UIApplication.shared.connectedScenes
//                .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene
//        else { return }
//
//        do {
//            try await AppStore.showManageSubscriptions(in: windowScene)
//            // ⚠️  веднага обновяваме статуса, след като листът се затвори
//            await updatePurchasedStatus()
//        } catch {
//            print("Неуспешно показване на управлението на абонаменти: \(error)")
//        }
//    }
//    
//    @MainActor
//    func restorePurchases() async {
//        do {
//            try await AppStore.sync()
//            await updatePurchasedStatus()
//        } catch {
//            print("Restore failed: \(error.localizedDescription)")
//        }
//    }
//
//}
