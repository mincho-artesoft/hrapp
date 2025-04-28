import SwiftUI
import StoreKit

/// Manages fetching, purchasing, and tracking subscription products using StoreKit 2.
@MainActor
class SubscriptionManager: ObservableObject {
    @Published var products: [Product] = []
    @Published var purchasedProductIDs: Set<String> = []
    @Published var isLoading = false
    private var updatesTask: Task<Void, Never>?

    init() {
           Task {                                     // 1) зареждаш продукти
               await loadProducts()
               await updatePurchasedStatus()          // 2) текущи права
           }
           startListeningForUpdates()                 // 3) слушаш за нови
       }

       deinit {                                      // не забравяй да я отмениш
           updatesTask?.cancel()
       }

    private func startListeningForUpdates() {
           updatesTask = Task.detached(priority: .background) { [weak self] in
               guard let self else { return }

               for await verification in Transaction.updates {
                   do {
                       let transaction = try await self.checkVerified(verification)

                       // 🔑 Обновяваме UI на главния поток
                       await MainActor.run {
                           self.purchasedProductIDs.insert(transaction.productID)
                       }

                       await transaction.finish()
                   } catch {
                       print("Unverified transaction: \(error)")
                   }
               }
           }
       }
    
    /// Load subscription products by their identifiers
    func loadProducts() async {
        isLoading = true
        defer { isLoading = false }

        let ids = ["ARTE.Calendar.subscription.monthly",
                   "ARTE.Calendar.subscription.yearly"]

        do {
            let fetched = try await Product.products(for: ids)

            // пресъздай масива според първоначалния ред на ID-тата
            products = ids.compactMap { id in
                fetched.first(where: { $0.id == id })
            }
        } catch {
            print("Failed to fetch products: \(error)")
        }
    }


    /// Purchase a given product
    func purchase(_ product: Product) async throws {
        let result = try await product.purchase()
        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            purchasedProductIDs.insert(transaction.productID)
            await transaction.finish()
        case .userCancelled, .pending:
            break
        @unknown default:
            break
        }
    }

    /// Update the list of active subscriptions based on current entitlements
    func updatePurchasedStatus() async {
        for await verification in Transaction.currentEntitlements {
            do {
                let transaction = try checkVerified(verification)
                purchasedProductIDs.insert(transaction.productID)
            } catch {
                print("Unverified transaction: \(error)")
            }
        }
    }

    /// Helper to verify transaction
    func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error): throw error
        case .verified(let signed): return signed
        }
    }
}

struct SubscriptionView: View {
    @StateObject var manager = SubscriptionManager()
    
    var body: some View {
        NavigationView {
            ZStack {
                // ↓ 1) Полупрозрачен бял фон (60 % непрозрачен)
                Color(.systemBackground)   // или Color(uiColor: .systemBackground)
                    .opacity(0.6)
                    .ignoresSafeArea()
                // ↓ 2) Реалното съдържание
                content
                    .background(Color(.systemBackground.withAlphaComponent(0.6)))
            }
        }
    }

    @ViewBuilder
    private var content: some View {
        if manager.isLoading {
            ProgressView("Loading subscriptions…")
                .padding()
        } else if manager.products.isEmpty {
            VStack(spacing: 8) {
                Image(systemName: "tray")
                    .font(.largeTitle)
                    .foregroundColor(.secondary)
                Text("No subscriptions available")
                    .foregroundColor(.secondary)
            }
            .padding()
        } else {
            List(manager.products) { product in
                row(for: product)
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)          // ⟵ важно! крие дефолтния фон на List-а
        }
    }

    private func row(for product: Product) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(product.displayName)
                    .font(.headline)

                Text(product.periodUnitOnly)        // ← „Месечен“
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                Text(product.displayPrice)
                    .font(.subheadline)
            }

            Spacer()

            if manager.purchasedProductIDs.contains(product.id) {
                Text("Subscribed")
                    .foregroundColor(.green)
                    .padding(8)
                    .background(Color(.systemGray6))
                    .cornerRadius(8)
            } else {
                Button("Subscribe") {
                    Task { try? await manager.purchase(product) }
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding(.vertical, 8)
        .listRowBackground(Color.clear)
    }
}

extension Product.SubscriptionPeriod.Unit {
    var sortIndex: Int {
        switch self {
        case .day:   return 0
        case .week:  return 1
        case .month: return 2   // по-краткият (месец) идва преди
        case .year:  return 3   // по-дългия (година)
        @unknown default: return .max
        }
    }
}



extension Product {
    /// "Monthly", "Yearly", "Weekly", …
    var periodUnitOnly: String {
        guard let unit = subscription?.subscriptionPeriod.unit else { return "" }

        // Always format with an English locale
        let enUS = Locale(identifier: "en_US")

        if #available(iOS 15.0, *) {
            // subscriptionPeriodUnitFormatStyle → "month", "year", …
            let noun = unit.formatted(
                subscriptionPeriodUnitFormatStyle
                    .locale(enUS)                      // force English
            )

            // Convert noun ("month") → adjective ("Monthly")
            // simplest: capitalise first letter + "ly"
            let adjective = noun.capitalized + "ly"
            return adjective            // "Monthly", "Yearly", …
        }

        // Fallback for iOS 13-14
        switch unit {
        case .day:   return "Daily"
        case .week:  return "Weekly"
        case .month: return "Monthly"
        case .year:  return "Yearly"
        @unknown default:
            return "Recurring"
        }
    }
}
