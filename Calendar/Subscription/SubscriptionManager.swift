
import SwiftUI
import StoreKit
import UIKit

typealias StoreTransaction = StoreKit.Transaction

@MainActor
class SubscriptionManager: ObservableObject {
    @AppStorage("subscriptionStatus") private var subscriptionStatusRaw: String = SubscriptionStatus.base.rawValue
    @Published var restorationAlertMessage: String?       // ← НОВО

    var subscriptionStatus: SubscriptionStatus {
        get { SubscriptionStatus(rawValue: subscriptionStatusRaw) ?? .base }
        set {
            subscriptionStatusRaw = newValue.rawValue
            objectWillChange.send()
        }
    }

    @Published var products: [Product] = []
    @Published var purchasedProductIDs: Set<String> = [] {
        didSet { updateSubscriptionStatus() }
    }
    @Published var expirationDates: [String: Date] = [:]
    @Published var isLoading = false

    private var updatesTask: Task<Void, Never>?
    var hasActiveSubscription: Bool { !purchasedProductIDs.isEmpty }

    static let shared = SubscriptionManager()
    private init() {
        Task {
            await loadProducts()
            await updatePurchasedStatus()
        }
        startListeningForUpdates()
    }

    deinit { updatesTask?.cancel() }

    // MARK: - Products --------------------------------------------------------

    @MainActor
    func loadProducts() async {
        // Показваме spinner-а, докато зареждаме
        await MainActor.run { isLoading = true }
        defer { Task { @MainActor in isLoading = false } }

        // 1️⃣  Списък с точните Product ID-та в реда, в който искаме да се
        //      визуализират (годишните след месечните – или обратно).
        let ids: [String] = [
            "Cloud.Calendars.Advanced.Monthly",
            "Cloud.Calendars.Advanced.Yearly",
            "Cloud.Calendars.Premium.Monthly",
            "Cloud.Calendars.Premium.Yearly"
        ]

        do {
            // 2️⃣  Вземаме само продуктите, които StoreKit връща като „достъпни“
            let fetched = try await Product.products(for: ids)

            // 3️⃣  Подреждаме ги по същия ред като `ids`
            await MainActor.run {
                self.products = ids.compactMap { id in
                    fetched.first(where: { $0.id == id })
                }
                // 4️⃣  За дебъг – ще виждате 0, 2 или 4 продукта според статуса им
                #if DEBUG
                print("💡 [StoreKit] Loaded products:", self.products.map(\.id))
                #endif
            }
        } catch {
            // 5️⃣  Груб, но полезен печат; можеш да добавиш Crashlytics или Alert
            print("❌ [StoreKit] Failed to fetch products:", error.localizedDescription)
        }
    }

    // MARK: - Purchase --------------------------------------------------------

    func canPurchase(_ newProduct: Product) -> Bool {
        guard hasActiveSubscription else { return true }         // no active sub → OK
        if purchasedProductIDs.contains(newProduct.id) { return true } // same plan → OK
        return isUpgradeable(to: newProduct)                     // else only if upgrade
    }

    private func isUpgradeable(to newProduct: Product) -> Bool {
        guard let currentID = purchasedProductIDs.first,
              let current   = products.first(where: { $0.id == currentID }),
              let curUnit   = current.subscription?.subscriptionPeriod.unit,
              let newUnit   = newProduct.subscription?.subscriptionPeriod.unit
        else { return false }

        return currentID.lowercased().contains("advanced") &&
               newProduct.id.lowercased().contains("premium") &&
               curUnit == newUnit
    }

    func purchase(_ product: Product) async {
        if hasActiveSubscription &&
            !isUpgradeable(to: product) &&
            !purchasedProductIDs.contains(product.id) {
            print("Cannot purchase – already have non-upgradeable subscription.")
            return
        }

        do {
            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                let transaction = try checkVerified(verification)
                await MainActor.run { register(transaction: transaction) }
                await transaction.finish()
                await updatePurchasedStatus()
            case .userCancelled, .pending: break
            @unknown default:             break
            }
        } catch {
            print("Purchase failed: \(error)")
        }
    }

    // MARK: - Updates listener -----------------------------------------------

    private func startListeningForUpdates() {
        updatesTask = Task.detached(priority: .background) { [weak self] in
            guard let self else { return }
            for await verification in StoreTransaction.updates {
                do {
                    let tx = try await self.checkVerified(verification)
                    await MainActor.run { self.register(transaction: tx) }
                    await tx.finish()
                    await self.updatePurchasedStatus()
                } catch {
                    print("Update verification failed: \(error)")
                }
            }
        }
    }

    // MARK: - Entitlements ----------------------------------------------------

    func updatePurchasedStatus() async {
        var activeIDs   = Set<String>()
        var expiryDates = [String: Date]()

        for await verification in StoreTransaction.currentEntitlements {
            do {
                let tx = try checkVerified(verification)
                if tx.revocationDate == nil,
                   let expiry = tx.expirationDate,
                   expiry > Date() {
                    activeIDs.insert(tx.productID)
                    expiryDates[tx.productID] = expiry
                }
            } catch {
                print("Entitlement verification failed: \(error)")
            }
        }

        // If any premium sub – drop advance ones
        if activeIDs.contains(where: { $0.contains("premium") }) {
            activeIDs   = activeIDs.filter { $0.contains("premium") }
            expiryDates = expiryDates.filter { key, _ in key.contains("premium") }
        }

        await MainActor.run {
            self.purchasedProductIDs = activeIDs
            self.expirationDates     = expiryDates
        }
    }

    private func register(transaction: StoreTransaction) {
        guard transaction.revocationDate == nil else { return }
        guard products.contains(where: { $0.id == transaction.productID }) else { return }
        purchasedProductIDs.insert(transaction.productID)
        if let expiry = transaction.expirationDate {
            expirationDates[transaction.productID] = expiry
        }
    }

    func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error): throw error
        case .verified(let safe):       return safe
        }
    }

    // MARK: - Sorting helper --------------------------------------------------

    var sortedProducts: [Product] {
        products.sorted {
            guard let u1 = $0.subscription?.subscriptionPeriod.unit,
                  let u2 = $1.subscription?.subscriptionPeriod.unit else { return false }
            return u1.sortIndex < u2.sortIndex
        }
    }

    private func updateSubscriptionStatus() {
        guard !purchasedProductIDs.isEmpty else {
            subscriptionStatus = .base
            return
        }
        if purchasedProductIDs.contains(where: { $0.lowercased().contains("premium") }) {
            subscriptionStatus = .premium
        } else if purchasedProductIDs.contains(where: { $0.lowercased().contains("advanced") }) {
            subscriptionStatus = .advance
        } else {
            subscriptionStatus = .base
        }
    }

    // MARK: - Manage subscription sheet --------------------------------------

    @MainActor
    func openManageSubscriptions() async {
        guard let windowScene = UIApplication.shared.connectedScenes
                .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene
        else { return }

        do {
            try await AppStore.showManageSubscriptions(in: windowScene)
            // ⚠️  веднага обновяваме статуса, след като листът се затвори
            await updatePurchasedStatus()
        } catch {
            print("Неуспешно показване на управлението на абонаменти: \(error)")
        }
    }
    
    @MainActor
       func restorePurchases() async {
           do {
               try await AppStore.sync()
               await updatePurchasedStatus()

               await MainActor.run {
                   if hasActiveSubscription {
                       restorationAlertMessage =
                           NSLocalizedString("Your previous purchases have been successfully restored.",
                                             comment: "Restore succeeded")
                   } else {
                       restorationAlertMessage =
                           NSLocalizedString("No active subscriptions found to restore.",
                                             comment: "Nothing to restore")
                   }
               }
           } catch {
               await MainActor.run {
                   restorationAlertMessage =
                       String(
                           format: NSLocalizedString(
                               "Failed to restore purchases. Please try again later. (%@)",
                               comment: "Restore failed"
                           ),
                           error.localizedDescription
                       )
               }
           }
       }
}

