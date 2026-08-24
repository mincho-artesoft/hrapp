
import SwiftUI
import StoreKit
import UIKit

typealias StoreTransaction = StoreKit.Transaction

@MainActor
class SubscriptionManager: ObservableObject {
    @AppStorage("subscriptionStatus") private var subscriptionStatusRaw: String = SubscriptionStatus.base.rawValue
    @Published var restorationAlertMessage: String?       // ← НОВО

    var subscriptionStatus: SubscriptionStatus {
        get {
            #if DEBUG
            // A marketing capture is a premium session. Every ad decision in
            // the app keys off `== .base`, so answering here turns off the
            // banner, the interstitial and the app-open ad in one place rather
            // than three.
            //
            // Worth doing because an AdMob test ad in an App Store preview is
            // an automatic rejection. No screenshot ever caught one -- each is
            // a fresh, short-lived launch -- but a minute-long screen
            // recording relaunches the app mid-clip, and the first take of the
            // Japanese preview came back with "Test mode" across it.
            if ScreenshotMode.isActive { return .premium }
            #endif
            return SubscriptionStatus(rawValue: subscriptionStatusRaw) ?? .base
        }
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

    /// True while `product` is the plan the customer is subscribed to right now.
    func isCurrentPlan(_ product: Product) -> Bool {
        purchasedProductIDs.contains(product.id)
    }

    // All four plans share one App Store subscription group
    // (Cloud.Calendars.Group), so the store resolves a second purchase into an
    // upgrade, a downgrade or a duration change of the active one -- it cannot
    // leave a customer paying for two of them at once. The app used to allow
    // only an Advanced -> Premium move at the same period, which left a
    // subscriber no way to switch between the monthly and the yearly duration
    // of their own tier. App Review read that as the durations being separate
    // products (guideline 3.1.2(b)), so the decision now belongs to StoreKit,
    // which is the only place that can make it correctly anyway.
    func purchase(_ product: Product) async {
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
        #if DEBUG
        // Marketing captures must not contain ads: App Review rejects
        // screenshots showing a test-mode ad banner, and a real one would put
        // another company's artwork in our store listing. Reporting premium
        // suppresses them at the source, rather than trying to catch each
        // banner as it appears.
        //
        // Gated on the screenshot flag rather than on DEBUG alone, so a debug
        // build a developer runs by hand still exercises the real entitlement
        // path and the paywall stays testable.
        if ScreenshotMode.isActive {
            subscriptionStatus = .premium
            return
        }
        #endif

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
                       localizedFormat(NSLocalizedString(
                               "Failed to restore purchases. Please try again later. (%@)",
                               comment: "Restore failed"
                           ),
                           error.localizedDescription
                       )
               }
           }
       }
}

