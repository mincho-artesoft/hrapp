import Foundation
import StoreKit

/// Merchandising dates only. This file cannot grant eligibility or change Apple's price.
/// Dates must match the actual App Store Connect schedule for the listed storefronts.
struct SubscriptionOfferCampaign: Decodable, Equatable {
    let productID: String
    let offerType: String
    let offerID: String?
    let storefronts: [String]
    let startsAt: Date
    let endsAt: Date

    func matches(product: Product, offer: Product.SubscriptionOffer, storefront: String?, now: Date) -> Bool {
        guard productID == product.id, startsAt <= now, now < endsAt,
              let storefront, storefronts.contains(storefront) else { return false }
        if offerType == "introductory" {
            return offer.type == .introductory && offerID == nil
        }
        return offerType == "winBack" && offer.type == .winBack && offerID != nil && offerID == offer.id
    }
}

struct SubscriptionCampaignConfiguration: Decodable {
    let version: Int
    let campaigns: [SubscriptionOfferCampaign]

    static let empty = Self(version: 1, campaigns: [])

    static func decode(_ data: Data) throws -> Self {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let result = try decoder.decode(Self.self, from: data)
        guard result.version == 1, result.campaigns.count <= 100,
              result.campaigns.allSatisfy({ $0.startsAt < $0.endsAt }) else {
            throw CocoaError(.coderReadCorrupt)
        }
        return result
    }

    static func bundled(in bundle: Bundle = .main) -> Self {
        guard let url = bundle.url(forResource: "SubscriptionOfferCampaigns", withExtension: "json"),
              let data = try? Data(contentsOf: url), let config = try? decode(data) else { return .empty }
        return config
    }

}
