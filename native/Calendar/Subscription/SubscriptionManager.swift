
import SwiftUI
import StoreKit
#if os(iOS)
import UIKit
#else
import AppKit
#endif

typealias StoreTransaction = StoreKit.Transaction

@MainActor
class SubscriptionManager: ObservableObject {
    @AppStorage("subscriptionStatus") private var subscriptionStatusRaw: String = SubscriptionStatus.base.rawValue
    @Published var restorationAlertMessage: String?       // ← НОВО

    /// Development access is computed, never saved as an App Store entitlement.
    /// Launch with -DebugPremium NO to test the regular purchase flow in Debug.
    var isDebugPremiumEnabled: Bool {
        #if DEBUG
        if let debugPremiumOverride { return debugPremiumOverride }
        let arguments = ProcessInfo.processInfo.arguments
        if let index = arguments.lastIndex(of: "-DebugPremium"),
           arguments.indices.contains(index + 1) {
            return !["no", "false", "0"].contains(arguments[index + 1].lowercased())
        }
        return true
        #else
        return false
        #endif
    }

    var subscriptionStatus: SubscriptionStatus {
        get {
            if isDebugPremiumEnabled { return debugPlanID.contains("Premium") ? .premium : .advance }
            #if DEBUG && os(iOS)
            // Render the ad-free app for explicit marketing captures. This
            // neither changes persisted entitlement state nor buys a plan.
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
    @Published private(set) var hasCheckedEntitlements = false

    @Published private(set) var isPurchasing = false
    @Published private(set) var isRestoring = false
    @Published private(set) var productLoadError: String?
    @Published private(set) var eligibleIntroOfferIDs = Set<String>()
    @Published private(set) var eligibleWinBackOffers: [String: Product.SubscriptionOffer] = [:]
    @Published private(set) var scheduledProductIDs = Set<String>()
    @Published private(set) var autoRenewingProductIDs = Set<String>()
    private var storefrontCountryCode: String?
    private let campaigns = SubscriptionCampaignConfiguration.bundled().campaigns
    @Published private(set) var debugPlanID = "Cloud.Calendars.Premium.Yearly"
    private let debugPlanStart = Date()
    private let debugPremiumOverride: Bool?
    private var refreshGeneration = 0
    static let productIDs = ["Cloud.Calendars.Advanced.Monthly", "Cloud.Calendars.Advanced.Yearly",
                             "Cloud.Calendars.Premium.Monthly", "Cloud.Calendars.Premium.Yearly"]
    private var updatesTask: Task<Void, Never>?
    var hasActiveSubscription: Bool { !purchasedProductIDs.isEmpty }

    static let shared = SubscriptionManager()
    init(startAutomatically: Bool = true, debugPremiumEnabled: Bool? = nil) {
        debugPremiumOverride = debugPremiumEnabled
        guard startAutomatically else { return }
        Task {
            await updatePurchasedStatus()
            await loadProducts()
        }
        startListeningForUpdates()
    }

    deinit { updatesTask?.cancel() }

    // MARK: - Products --------------------------------------------------------

    @MainActor
    func loadProducts() async {
        guard !isLoading else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            let fetched = try await Product.products(for: Self.productIDs)
            products = Self.productIDs.compactMap { id in fetched.first { $0.id == id } }
            productLoadError = nil
            await updatePurchasedStatus()
        } catch {
            productLoadError = error.localizedDescription
        }
    }

    func offer(for product: Product) -> Product.SubscriptionOffer? {
        guard !isCurrentPlan(product), !scheduledProductIDs.contains(product.id) else { return nil }
        return eligibleWinBackOffers[product.id]
            ?? (eligibleIntroOfferIDs.contains(product.id) ? product.subscription?.introductoryOffer : nil)
    }

    func campaignEnd(for product: Product, now: Date = .now) -> Date? {
        guard let offer = offer(for: product) else { return nil }
        return campaigns.first { $0.matches(product: product, offer: offer, storefront: storefrontCountryCode, now: now) }?.endsAt
    }

    func quote(for product: Product, now: Date = .now) -> SubscriptionPurchaseQuote {
        .init(product: product, offer: offer(for: product), campaignEnd: campaignEnd(for: product, now: now))
    }

    func canPurchase(_ product: Product) -> Bool {
        Self.productIDs.contains(product.id) && !isCurrentPlan(product) && !scheduledProductIDs.contains(product.id)
    }

    // MARK: - Purchase --------------------------------------------------------

    /// True while `product` is the plan the customer is subscribed to right now.
    func isCurrentPlan(_ product: Product) -> Bool {
        if isDebugPremiumEnabled { return debugPlanID == product.id }
        return purchasedProductIDs.contains(product.id)
    }

    func displayedExpirationDate(for product: Product) -> Date? {
        if isDebugPremiumEnabled, isCurrentPlan(product) {
            return Calendar.current.date(byAdding: product.subscription?.subscriptionPeriod.unit == .year ? .year : .month,
                                         value: 1, to: debugPlanStart)
        }
        return expirationDates[product.id]
    }

    func isDisplayedRenewing(_ product: Product) -> Bool {
        isDebugPremiumEnabled ? isCurrentPlan(product) : autoRenewingProductIDs.contains(product.id)
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
    func purchase(_ product: Product, confirming displayedQuote: SubscriptionPurchaseQuote? = nil) async {
        guard !isPurchasing, !isRestoring, canPurchase(product) else { return }
        #if DEBUG
        // Simulate plan selection only in memory; never write a fake StoreKit
        // transaction, persist an entitlement, or charge the debug account.
        if isDebugPremiumEnabled { debugPlanID = product.id; return }
        #endif
        let expected = displayedQuote ?? quote(for: product)
        isPurchasing = true
        defer { isPurchasing = false }
        do {
            // Revalidate the displayed offer before opening Apple's purchase
            // sheet. An expired offer must never silently become full price.
            let fetched = try await Product.products(for: Self.productIDs)
            products = Self.productIDs.compactMap { id in fetched.first { $0.id == id } }
            await updatePurchasedStatus()
            guard let current = products.first(where: { $0.id == product.id }), canPurchase(current),
                  expected == quote(for: current), expected.campaignEnd.map({ $0 > Date() }) ?? true else {
                restorationAlertMessage = NSLocalizedString("This offer or plan has changed. Review the updated price and try again.", comment: "")
                return
            }
            var options = Set<Product.PurchaseOption>()
            if let offer = expected.offer, offer.type == .winBack { options.insert(.winBackOffer(offer)) }
            switch try await current.purchase(options: options) {
            case .success(let verification):
                let transaction = try checkVerified(verification)
                await transaction.finish()
                await updatePurchasedStatus()
            case .pending:
                restorationAlertMessage = NSLocalizedString("Purchase awaiting approval.", comment: "")
            case .userCancelled: break
            @unknown default: break
            }
        } catch {
            if case StoreKitError.userCancelled = error { return }
            restorationAlertMessage = error.localizedDescription
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
        refreshGeneration += 1
        let generation = refreshGeneration
        var activeIDs = Set<String>()
        var expiryDates: [String: Date] = [:]
        var scheduledIDs = Set<String>()
        var renewingIDs = Set<String>()
        var winBackIDs: [String: [String]] = [:]
        for await verification in StoreTransaction.currentEntitlements {
            guard let tx = try? checkVerified(verification), Self.productIDs.contains(tx.productID),
                  tx.revocationDate == nil, !tx.isUpgraded,
                  let expiry = tx.expirationDate, expiry > Date() else { continue }
            activeIDs.insert(tx.productID)
            expiryDates[tx.productID] = expiry
        }
        var visitedGroups = Set<String>()
        for product in products {
            guard let subscription = product.subscription,
                  visitedGroups.insert(subscription.subscriptionGroupID).inserted,
                  let statuses = try? await subscription.status else { continue }
            for status in statuses {
                guard let tx = try? checkVerified(status.transaction),
                      let renewal = try? checkVerified(status.renewalInfo),
                      Self.productIDs.contains(tx.productID), tx.revocationDate == nil, !tx.isUpgraded else { continue }
                winBackIDs[subscription.subscriptionGroupID, default: []].append(contentsOf: renewal.eligibleWinBackOfferIDs)
                if status.state == .inGracePeriod, let expiry = renewal.gracePeriodExpirationDate, expiry > Date() {
                    activeIDs.insert(tx.productID)
                    expiryDates[tx.productID] = expiry
                }
                guard activeIDs.contains(tx.productID), renewal.willAutoRenew else { continue }
                renewingIDs.insert(tx.productID)
                if let next = renewal.autoRenewPreference, next != tx.productID, Self.productIDs.contains(next) {
                    scheduledIDs.insert(next)
                }
            }
        }
        var introIDs = Set<String>()
        var winBackOffers: [String: Product.SubscriptionOffer] = [:]
        for product in products {
            guard let subscription = product.subscription else { continue }
            if subscription.introductoryOffer != nil, await subscription.isEligibleForIntroOffer { introIDs.insert(product.id) }
            winBackOffers[product.id] = winBackIDs[subscription.subscriptionGroupID]?.lazy.compactMap { id in
                subscription.winBackOffers.first { $0.id == id }
            }.first
        }
        let storefront = await Storefront.current
        guard generation == refreshGeneration else { return }
        if activeIDs.contains(where: { $0.localizedCaseInsensitiveContains("premium") }) {
            activeIDs = activeIDs.filter { $0.localizedCaseInsensitiveContains("premium") }
            expiryDates = expiryDates.filter { activeIDs.contains($0.key) }
        }
        expirationDates = expiryDates
        purchasedProductIDs = activeIDs
        scheduledProductIDs = scheduledIDs
        autoRenewingProductIDs = renewingIDs
        eligibleIntroOfferIDs = introIDs
        eligibleWinBackOffers = winBackOffers
        storefrontCountryCode = storefront?.countryCode
        hasCheckedEntitlements = true
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
        #if os(iOS)
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
        #else
        NSWorkspace.shared.open(URL(string: "https://apps.apple.com/account/subscriptions")!)
        #endif
    }
    
    @MainActor
       func restorePurchases() async {
           guard !isRestoring, !isPurchasing else { return }
           isRestoring = true
           defer { isRestoring = false }
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
