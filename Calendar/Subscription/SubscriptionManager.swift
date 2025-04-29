// SubscriptionManager.swift

import SwiftUI
import StoreKit
import UIKit  // Needed for UIApplication.shared.open

/// Статуси на абонацията (по избор)
enum SubscriptionStatus: String, CaseIterable {
    case base    = "Base"
    case advance = "Advance"
    case premium = "Premium"
}

typealias StoreTransaction = StoreKit.Transaction

@MainActor
class SubscriptionManager: ObservableObject {
    @AppStorage("subscriptionStatus") private var subscriptionStatusRaw: String = SubscriptionStatus.base.rawValue

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

    deinit {
        updatesTask?.cancel()
    }

    func loadProducts() async {
        await MainActor.run { isLoading = true }
        defer { Task { @MainActor in isLoading = false } }

        let ids = [
            "ARTE.Calendar.subscription.advance.monthly",
            "ARTE.Calendar.subscription.advance.yearly",
            "ARTE.Calendar.subscription.premium.monthly2",
            "ARTE.Calendar.subscription.premium.yearly2"
        ]

        do {
            let fetched = try await Product.products(for: ids)
            await MainActor.run {
                self.products = ids.compactMap { id in
                    fetched.first(where: { $0.id == id })
                }
            }
        } catch {
            print("Failed to fetch products: \(error)")
        }
    }

    /// Връща true ако може да се селектира/new purchase или upgrade
    func canPurchase(_ newProduct: Product) -> Bool {
        // ако няма текуща – винаги може
        guard hasActiveSubscription else { return true }
        // ако е текущата – също може
        if purchasedProductIDs.contains(newProduct.id) {
            return true
        }
        // иначе само ако е upgrade Advance→Premium със същия период
        return isUpgradeable(to: newProduct)
    }

    private func isUpgradeable(to newProduct: Product) -> Bool {
        guard let currentID = purchasedProductIDs.first,
              let current = products.first(where: { $0.id == currentID }),
              let curUnit = current.subscription?.subscriptionPeriod.unit,
              let newUnit = newProduct.subscription?.subscriptionPeriod.unit
        else { return false }

        return currentID.contains("advance")
            && newProduct.id.contains("premium")
            && curUnit == newUnit
    }

    func purchase(_ product: Product) async {
        if hasActiveSubscription && !isUpgradeable(to: product) && !purchasedProductIDs.contains(product.id) {
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
            case .userCancelled:
                break
            case .pending:
                break
            @unknown default:
                break
            }
        } catch {
            print("Purchase failed: \(error)")
        }
    }

    private func startListeningForUpdates() {
        updatesTask = Task.detached(priority: .background) { [weak self] in
            guard let self = self else { return }
            for await verification in StoreTransaction.updates {
                do {
                    let transaction = try await self.checkVerified(verification)
                    await MainActor.run { self.register(transaction: transaction) }
                    await transaction.finish()
                    await self.updatePurchasedStatus()
                } catch {
                    print("Update verification failed: \(error)")
                }
            }
        }
    }

    func updatePurchasedStatus() async {
        var activeIDs = Set<String>()
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
        case .verified(let safe):     return safe
        }
    }

    var sortedProducts: [Product] {
        products.sorted {
            guard let u1 = $0.subscription?.subscriptionPeriod.unit,
                  let u2 = $1.subscription?.subscriptionPeriod.unit
            else { return false }
            return u1.sortIndex < u2.sortIndex
        }
    }

    private func updateSubscriptionStatus() {
        guard !purchasedProductIDs.isEmpty else {
            subscriptionStatus = .base
            return
        }
        if purchasedProductIDs.contains(where: { $0.contains("premium") }) {
            subscriptionStatus = .premium
        } else if purchasedProductIDs.contains(where: { $0.contains("advance") }) {
            subscriptionStatus = .advance
        } else {
            subscriptionStatus = .base
        }
    }

    @MainActor
    func openManageSubscriptions() async {
        guard let url = URL(string: "https://apps.apple.com/account/subscriptions"),
              UIApplication.shared.canOpenURL(url)
        else { return }
        await UIApplication.shared.open(url)
    }
}
