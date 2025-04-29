//
//  SubscriptionManager.swift
//  ArteCalendar
//
//  Created by Aleksandar Svinarov on 29/4/25.
//

import SwiftUI
import StoreKit
import UIKit // Needed for UIApplication.shared.open

/// Disambiguate from SwiftUI.Transaction.
typealias StoreTransaction = StoreKit.Transaction


// MARK: - Subscription Manager
@MainActor
class SubscriptionManager: ObservableObject {
    @AppStorage("isSubscribed") private(set) var isSubscribed: Bool = false

    // Published state
    @Published var products: [Product] = []
    @Published var purchasedProductIDs: Set<String> = []
    @Published var expirationDates: [String: Date] = [:]
    @Published var isLoading = false

    private var updatesTask: Task<Void, Never>?

    /// Convenience – true while the user owns at least one active entitlement
    var hasActiveSubscription: Bool { !purchasedProductIDs.isEmpty }

    // MARK: Init / deinit
    static let shared = SubscriptionManager()       // 👈 един-единствен екземпляр
    
     private init() {                                // (скрийте init-а)
         Task {                                      // старите ви задачи си остават
             await loadProducts()
             await updatePurchasedStatus()
         }
         startListeningForUpdates()
     }

    deinit { updatesTask?.cancel() }

    // MARK: StoreKit helpers
    private func startListeningForUpdates() {
        updatesTask = Task.detached(priority: .background) { [weak self] in
            // Use non-optional self after capture
            guard let self = self else { return }

            for await verification in StoreTransaction.updates {
                do {
                    let transaction = try await self.checkVerified(verification)
                    // Ensure UI updates are on the main thread
                    await MainActor.run { self.register(transaction: transaction) }
                    await transaction.finish() // Finish transaction after processing
                } catch {
                    // Consider more specific error handling or logging
                    print("Transaction update failed verification: \(error)")
                }
            }
        }
    }


    func loadProducts() async {
        // Ensure isLoading updates happen on the main thread
        await MainActor.run { isLoading = true }
        defer {
            Task { @MainActor in isLoading = false } // Ensure defer runs on main thread too
        }

        // Make sure these Product IDs match exactly what's in App Store Connect
        // Example IDs - Replace with your actual Product IDs
        let ids = ["ARTE.Calendar.subscription.monthly",
                   "ARTE.Calendar.subscription.yearly"]
        do {
            let fetched = try await Product.products(for: ids)
            // Ensure products update happens on the main thread
            await MainActor.run {
                // Maintain the order from 'ids' if needed, or use sortedProducts later
                self.products = ids.compactMap { id in fetched.first(where: { $0.id == id }) }
                 print("Fetched products: \(self.products.map { $0.id })") // Debugging
            }
        } catch {
            print("Failed to fetch products: \(error)")
            // Optionally update UI to show an error state
        }
    }

    // Purchase should be called from the main thread (e.g., button tap)
    func purchase(_ product: Product) async {
        guard !hasActiveSubscription else {
            print("Attempted to purchase, but already has active subscription.")
            return
        }

        do {
            let result = try await product.purchase()

            switch result {
            case .success(let verification):
                print("Purchase successful, verifying transaction...")
                let transaction = try checkVerified(verification)
                await MainActor.run { self.register(transaction: transaction) }
                await transaction.finish()
                print("Transaction finished and registered.")
            case .userCancelled:
                print("Purchase cancelled by user.")
            case .pending:
                print("Purchase is pending approval.")
            @unknown default:
                print("Purchase result is unknown.")
            }
        } catch {
            print("Purchase failed: \(error)")
        }
    }

    func updatePurchasedStatus() async {
        print("Checking current entitlements...")
        var activeIDs = Set<String>()
        var expiryDates = [String: Date]()

        for await verification in StoreTransaction.currentEntitlements {
            do {
                let transaction = try checkVerified(verification)
                if transaction.revocationDate == nil && !(transaction.isUpgraded) {
                    if let expiry = transaction.expirationDate, expiry > Date() {
                         print("Found active entitlement: \(transaction.productID), Expires: \(expiry)")
                         activeIDs.insert(transaction.productID)
                         expiryDates[transaction.productID] = expiry
                    } else if transaction.productType == .nonRenewable {
                         print("Found non-renewable entitlement: \(transaction.productID)")
                         activeIDs.insert(transaction.productID)
                    } else {
                         print("Entitlement expired or invalid: \(transaction.productID)")
                    }
                } else {
                    print("Entitlement revoked or upgraded: \(transaction.productID)")
                }
            } catch {
                print("Entitlement verification failed: \(error)")
            }
        }

        await MainActor.run {
             self.purchasedProductIDs = activeIDs
             self.expirationDates = expiryDates
             print("Updated purchased IDs: \(self.purchasedProductIDs)")
             print("Updated expiration dates: \(self.expirationDates)")
        }
    }


    private func register(transaction: StoreTransaction) {
        guard transaction.revocationDate == nil, !(transaction.isUpgraded) else {
            print("Registering transaction skipped (revoked or upgraded): \(transaction.productID)")
            return
        }
        guard products.contains(where: { $0.id == transaction.productID }) else {
             print("Registering transaction skipped (unknown product ID): \(transaction.productID)")
             return
        }

        print("Registering transaction: \(transaction.productID)")
        purchasedProductIDs.insert(transaction.productID)
        if let expiry = transaction.expirationDate {
            expirationDates[transaction.productID] = expiry
            print("  - Expiration: \(expiry)")
        } else {
             print("  - No expiration date found for \(transaction.productID)")
        }
    }

    // MARK: Verification
    func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            print("Verification failed: \(error.localizedDescription)")
            throw error
        case .verified(let safe):
            return safe
        }
    }

    var sortedProducts: [Product] {
        products.sorted { p1, p2 in
            guard let period1 = p1.subscription?.subscriptionPeriod,
                  let period2 = p2.subscription?.subscriptionPeriod else {
                return false
            }
            return period1.unit.sortIndex < period2.unit.sortIndex
        }
    }
}
