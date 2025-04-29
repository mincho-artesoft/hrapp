// SubscriptionManager.swift
// ArteCalendar
// Created by Aleksandar Svinarov on 29/4/25.

import SwiftUI
import StoreKit
import UIKit  // Needed for UIApplication.shared.open

/// Статуси на абонамента (по избор, ако използваш)
enum SubscriptionStatus: String, CaseIterable {
    case base    = "Base"
    case advance = "Advance"
    case premium = "Premium"
}

/// Disambiguate from SwiftUI.Transaction.
typealias StoreTransaction = StoreKit.Transaction

@MainActor
class SubscriptionManager: ObservableObject {
    // Запазете това, ако ползвате SubscriptionStatus enum
    @AppStorage("subscriptionStatus") private var subscriptionStatusRaw: String = SubscriptionStatus.base.rawValue

    /// Ако не ползвате enum, премахнете тези два реда и isSubscribed
    var subscriptionStatus: SubscriptionStatus {
        get { SubscriptionStatus(rawValue: subscriptionStatusRaw) ?? .base }
        set {
            subscriptionStatusRaw = newValue.rawValue
            objectWillChange.send()
        }
    }

    // MARK: - Published state

    @Published var products: [Product] = []
    @Published var purchasedProductIDs: Set<String> = [] {
        didSet { updateSubscriptionStatus() }
    }
    @Published var expirationDates: [String: Date] = [:]
    @Published var isLoading = false

    private var updatesTask: Task<Void, Never>?

    /// True ако има поне един активен entitlement
    var hasActiveSubscription: Bool { !purchasedProductIDs.isEmpty }

    // MARK: - Init / Deinit

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

    // MARK: - Load Products

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
                print("Fetched products: \(self.products.map { $0.id })")
            }
        } catch {
            print("Failed to fetch products: \(error)")
        }
    }

    // MARK: - Purchase / Upgrade

    /// Проверява дали продуктът е upgrade Advance→Premium със същия период
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

    /// Извикваме за покупка или upgrade
    func purchase(_ product: Product) async {
        // Блокирай само ако не е upgrade
        if hasActiveSubscription && !isUpgradeable(to: product) {
            print("Attempted to purchase, but already has active subscription.")
            return
        }

        do {
            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                let transaction = try checkVerified(verification)
                // регистрираме вътрешно
                await MainActor.run { register(transaction: transaction) }
                // приключваме транзакцията
                await transaction.finish()
                // **презареждаме entitlements**
                await updatePurchasedStatus()
                print("Purchase/upgrade successful for \(product.id)")

            case .userCancelled:
                print("Purchase cancelled by user.")
            case .pending:
                print("Purchase is pending.")
            @unknown default:
                print("Unknown purchase result.")
            }
        } catch {
            print("Purchase failed: \(error)")
        }
    }

    // MARK: - Background Updates Listener

    private func startListeningForUpdates() {
        updatesTask = Task.detached(priority: .background) { [weak self] in
            guard let self = self else { return }
            for await verification in StoreTransaction.updates {
                do {
                    let transaction = try await self.checkVerified(verification)
                    await MainActor.run { self.register(transaction: transaction) }
                    await transaction.finish()
                    // **и тук презареждаме entitlements**
                    await self.updatePurchasedStatus()
                } catch {
                    print("Transaction update failed verification: \(error)")
                }
            }
        }
    }

    // MARK: - Update Purchased Status

    /// Проверява текущите entitlements
    func updatePurchasedStatus() async {
        print("Checking current entitlements...")
        var activeIDs = Set<String>()
        var expiryDates = [String: Date]()

        for await verification in StoreTransaction.currentEntitlements {
            do {
                let transaction = try checkVerified(verification)
                if transaction.revocationDate == nil {
                    if let expiry = transaction.expirationDate, expiry > Date() {
                        activeIDs.insert(transaction.productID)
                        expiryDates[transaction.productID] = expiry
                    }
                }
            } catch {
                print("Entitlement verification failed: \(error)")
            }
        }

        await MainActor.run {
            self.purchasedProductIDs = activeIDs
            self.expirationDates     = expiryDates
            print("Updated purchased IDs: \(self.purchasedProductIDs)")
        }
    }

    // MARK: - Register Transaction

    private func register(transaction: StoreTransaction) {
        guard transaction.revocationDate == nil else { return }
        guard products.contains(where: { $0.id == transaction.productID }) else { return }

        purchasedProductIDs.insert(transaction.productID)
        if let expiry = transaction.expirationDate {
            expirationDates[transaction.productID] = expiry
        }
    }

    // MARK: - Verification

    func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            throw error
        case .verified(let safe):
            return safe
        }
    }

    // MARK: - Helpers

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

    // MARK: - Manage Subscriptions

    @MainActor
    func openManageSubscriptions() async {
        guard let url = URL(string: "https://apps.apple.com/account/subscriptions"),
              UIApplication.shared.canOpenURL(url)
        else { return }
        await UIApplication.shared.open(url)
    }
}
