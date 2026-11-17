import XCTest
import StoreKit
import StoreKitTest

// Only the app's localization helper is supplied by the isolated test host.
func localizedFormat(_ format: String, _ arguments: CVarArg...) -> String {
    String(format: format, arguments: arguments)
}

@MainActor
final class SubscriptionStoreKitTests: XCTestCase {
    private static var sessions: [SKTestSession] = []
    private let monthlyID = "Cloud.Calendars.Premium.Monthly"
    private let yearlyID = "Cloud.Calendars.Premium.Yearly"

    func testOfferDisplayExpiredQuoteAndDebugPlanSelection() async throws {
        for scenario in ["FreeTrial", "IntroDiscount", "PayAsYouGo"] {
            let session = try fixture(scenario)
            defer { session.clearTransactions() }
            let manager = SubscriptionManager(startAutomatically: false, debugPremiumEnabled: false)
            await manager.loadProducts()
            let product = try XCTUnwrap(manager.products.first { $0.id == monthlyID })
            let offer = try XCTUnwrap(manager.offer(for: product), scenario)
            let presentation = SubscriptionOfferPresentation(product: product, offer: offer)
            XCTAssertTrue(presentation.renewalTerms.contains(product.displayPrice))
            XCTAssertFalse(presentation.summary.isEmpty)
            if scenario == "FreeTrial" {
                XCTAssertEqual(offer.paymentMode, .freeTrial)
                XCTAssertEqual(presentation.price, String(localized: "Free"))
            } else {
                XCTAssertEqual(offer.price, Decimal(string: "0.49"))
            }
            if scenario == "PayAsYouGo" { XCTAssertEqual(offer.periodCount, 3) }

            // A displayed campaign that expired must stop before any StoreKit purchase.
            let expired = SubscriptionPurchaseQuote(product: product, offer: offer,
                campaignEnd: Date().addingTimeInterval(-1))
            await manager.purchase(product, confirming: expired)
            XCTAssertNotNil(manager.restorationAlertMessage)
            XCTAssertTrue(session.allTransactions().isEmpty)
            XCTAssertFalse(manager.isPurchasing)

            let debug = SubscriptionManager(startAutomatically: false, debugPremiumEnabled: true)
            await debug.loadProducts()
            let yearly = try XCTUnwrap(debug.products.first { $0.id == yearlyID })
            XCTAssertTrue(debug.isCurrentPlan(yearly))
            XCTAssertFalse(debug.canPurchase(yearly))
            XCTAssertNil(debug.offer(for: yearly))
            XCTAssertNotNil(debug.displayedExpirationDate(for: yearly))
            XCTAssertTrue(debug.isDisplayedRenewing(yearly))
            await debug.purchase(product)
            XCTAssertTrue(debug.isCurrentPlan(product))
            XCTAssertFalse(debug.isCurrentPlan(yearly))
            XCTAssertEqual(debug.subscriptionStatus, .premium)
            XCTAssertFalse(debug.hasActiveSubscription)
            XCTAssertTrue(session.allTransactions().isEmpty)
        }
    }

    func testIntroductoryOffersAndRenewalTerms() async throws {
        for scenario in ["FreeTrial", "IntroDiscount", "PayAsYouGo"] {
            let session = try fixture(scenario)
            defer { session.clearTransactions() }
            let manager = SubscriptionManager(startAutomatically: false, debugPremiumEnabled: false)
            try await AppStore.sync()
            await manager.loadProducts()
            XCTAssertEqual(manager.products.count, 4)
            let product = try XCTUnwrap(manager.products.first { $0.id == monthlyID })
            let offer = try XCTUnwrap(manager.offer(for: product), scenario)
            let presentation = SubscriptionOfferPresentation(product: product, offer: offer)
            XCTAssertTrue(presentation.renewalTerms.contains(product.displayPrice))
            XCTAssertFalse(presentation.summary.isEmpty)
            if scenario == "FreeTrial" { XCTAssertEqual(offer.paymentMode, .freeTrial) }
            else { XCTAssertEqual(offer.price, Decimal(string: "0.49")) }
            if scenario == "PayAsYouGo" { XCTAssertEqual(offer.periodCount, 3) }
            await manager.purchase(product, confirming: manager.quote(for: product))
            XCTAssertTrue(manager.hasActiveSubscription, manager.restorationAlertMessage ?? scenario)
            XCTAssertNil(manager.offer(for: product))
            let latestResult = await Transaction.latest(for: product.id)
            let transaction = try manager.checkVerified(XCTUnwrap(latestResult))
            XCTAssertEqual(transaction.offer?.type, .introductory)
            XCTAssertEqual(transaction.price, offer.price)
        }
    }

    func testWinBackEligibilityAndPurchase() async throws {
        for scenario in ["WinBack", "WinBackIneligible"] {
            let session = try fixture(scenario)
            defer { session.clearTransactions() }
            _ = try await session.buyProduct(identifier: yearlyID, options: [
                .purchaseDate(Date().addingTimeInterval(-400 * 86_400), renewalBehavior: .cancelImmediately)
            ])
            let manager = SubscriptionManager(startAutomatically: false, debugPremiumEnabled: false)
            try await AppStore.sync()
            await manager.loadProducts()
            let product = try XCTUnwrap(manager.products.first { $0.id == yearlyID })
            XCTAssertFalse(manager.hasActiveSubscription)
            if scenario == "WinBackIneligible" { XCTAssertNil(manager.offer(for: product)); continue }
            XCTAssertEqual(manager.offer(for: product)?.type, .winBack)
            await manager.purchase(product, confirming: manager.quote(for: product))
            XCTAssertTrue(manager.hasActiveSubscription, manager.restorationAlertMessage ?? "")
            let latestResult = await Transaction.latest(for: product.id)
            let transaction = try manager.checkVerified(XCTUnwrap(latestResult))
            XCTAssertEqual(transaction.offer?.type, .winBack)
            XCTAssertEqual(transaction.price, Decimal(string: "4.99"))
        }
    }

    func testExpiredOfferDoesNotPurchaseAtFullPrice() async throws {
        let session = try fixture("IntroDiscount")
        defer { session.clearTransactions() }
        let manager = SubscriptionManager(startAutomatically: false, debugPremiumEnabled: false)
        await manager.loadProducts()
        let product = try XCTUnwrap(manager.products.first { $0.id == monthlyID })
        let quote = manager.quote(for: product)
        XCTAssertNotNil(quote.offer)
        _ = try await session.buyProduct(identifier: yearlyID, options: [
            .purchaseDate(Date().addingTimeInterval(-800 * 86_400), renewalBehavior: .cancelImmediately)
        ])
        let count = session.allTransactions().count
        await manager.purchase(product, confirming: quote)
        XCTAssertEqual(session.allTransactions().count, count)
        XCTAssertNotNil(manager.restorationAlertMessage)
        XCTAssertFalse(manager.hasActiveSubscription)
    }

    func testOfferCodeRedemptionUpdatesRealEntitlement() async throws {
        let session = try fixture("OfferCode")
        defer { session.clearTransactions() }
        let manager = SubscriptionManager(startAutomatically: false, debugPremiumEnabled: false)
        await manager.loadProducts()
        _ = try await session.buyProduct(identifier: yearlyID, options: [.codeOffer(referenceName: "HRAPPTEST")])
        await manager.updatePurchasedStatus()
        XCTAssertTrue(manager.purchasedProductIDs.contains(yearlyID))
        let latestResult = await Transaction.latest(for: yearlyID)
        XCTAssertEqual(try manager.checkVerified(XCTUnwrap(latestResult)).offer?.type, .code)
    }

    func testCampaignDeadlinesAndDebugPurchaseGuard() async throws {
        let session = try fixture("FreeTrial")
        defer { session.clearTransactions() }
        let manager = SubscriptionManager(startAutomatically: false, debugPremiumEnabled: true)
        await manager.loadProducts()
        let product = try XCTUnwrap(manager.products.first { $0.id == monthlyID })
        let offer = try XCTUnwrap(manager.offer(for: product))
        let now = Date()
        let campaign = SubscriptionOfferCampaign(productID: product.id, offerType: "introductory", offerID: nil,
            storefronts: ["USA"], startsAt: now.addingTimeInterval(-60), endsAt: now.addingTimeInterval(60))
        XCTAssertTrue(campaign.matches(product: product, offer: offer, storefront: "USA", now: now))
        XCTAssertFalse(campaign.matches(product: product, offer: offer, storefront: "BGR", now: now))
        XCTAssertFalse(campaign.matches(product: product, offer: offer, storefront: "USA", now: campaign.endsAt))
        await manager.purchase(product)
        XCTAssertTrue(session.allTransactions().isEmpty)
        XCTAssertTrue(manager.isDebugPremiumEnabled)
        XCTAssertFalse(manager.hasActiveSubscription)
    }

    private func fixture(_ name: String) throws -> SKTestSession {
        let session = try SKTestSession(configurationFileNamed: name)
        session.resetToDefaultState()
        Self.sessions.append(session)
        session.disableDialogs = true
        session.storefront = "USA"
        session.locale = Locale(identifier: "en_US")
        session.clearTransactions()
        return session
    }
}
