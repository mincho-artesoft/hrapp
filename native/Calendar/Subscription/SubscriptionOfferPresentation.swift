import Foundation
import StoreKit

/// Everything displayed here comes from StoreKit, including the currency and billing periods.
struct SubscriptionOfferPresentation {
    let product: Product
    let offer: Product.SubscriptionOffer

    var title: String {
        offer.type == .winBack
            ? String(localized: "Welcome back offer")
            : String(localized: "Introductory offer")
    }

    var price: String {
        offer.paymentMode == .freeTrial
            ? String(localized: "Free")
            : offer.price.formatted(product.priceFormatStyle.locale(Locale.current))
    }

    var summary: String {
        let period = Self.duration(offer.period)
        let totalPeriod = Self.duration(offer.period, count: offer.periodCount)
        switch offer.paymentMode {
        case .freeTrial:
            return String.localizedStringWithFormat(
                String(localized: "%@ free"), totalPeriod)
        case .payAsYouGo:
            return String.localizedStringWithFormat(
                String(localized: "%@ every %@ for %@"), price, period, totalPeriod)
        default:
            return String.localizedStringWithFormat(
                String(localized: "%@ for %@"), price, totalPeriod)
        }
    }

    var renewalTerms: String {
        guard let subscription = product.subscription else { return "" }
        return String.localizedStringWithFormat(
            String(localized: "Then %@ every %@. Auto-renews. Cancel anytime."),
            product.displayPrice, Self.duration(subscription.subscriptionPeriod))
    }

    static func duration(_ period: Product.SubscriptionPeriod, count: Int = 1) -> String {
        let value = period.value * count
        var calendar = Calendar(identifier: .gregorian)
        calendar.locale = Locale.current
        let formatter = DateComponentsFormatter()
        formatter.calendar = calendar
        formatter.unitsStyle = .full
        formatter.maximumUnitCount = 1
        let components: DateComponents
        switch period.unit {
        case .day where value % 7 == 0: components = DateComponents(weekOfMonth: value / 7)
        case .day: components = DateComponents(day: value)
        case .week: components = DateComponents(weekOfMonth: value)
        case .month: components = DateComponents(month: value)
        case .year: components = DateComponents(year: value)
        @unknown default: components = DateComponents(day: value)
        }
        return formatter.string(from: components) ?? String(value)
    }
}

/// Captured by the button when rendering, then checked again before opening the payment sheet.
struct SubscriptionPurchaseQuote: Equatable {
    let productID: String
    let price: Decimal
    let currencyCode: String
    let period: Product.SubscriptionPeriod?
    let offer: Product.SubscriptionOffer?
    let campaignEnd: Date?

    init(product: Product, offer: Product.SubscriptionOffer?, campaignEnd: Date? = nil) {
        productID = product.id
        price = product.price
        currencyCode = product.priceFormatStyle.currencyCode
        period = product.subscription?.subscriptionPeriod
        self.offer = offer
        self.campaignEnd = campaignEnd
    }
}
