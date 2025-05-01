import StoreKit
import SwiftUICore

extension Product.SubscriptionPeriod.Unit {
    func noun(plural: Bool) -> String {
        switch self {
        case .day:   return plural ? "days"   : "day"
        case .week:  return plural ? "weeks"  : "week"
        case .month: return plural ? "months" : "month"
        case .year:  return plural ? "years"  : "year"
        @unknown default: return plural ? "periods" : "period"
        }
    }

    var sortIndex: Int {
        switch self {
        case .day:   return 0
        case .week:  return 1
        case .month: return 2
        case .year:  return 3
        @unknown default: return .max
        }
    }

    var perPeriodString: String {
        switch self {
        case .day: return "/day"
        case .week: return "/week"
        case .month: return "/month"
        case .year: return "/year"
        @unknown default: return ""
        }
    }
}

extension Product {

        var periodUnitOnly: LocalizedStringKey {
            guard let unit = subscription?.subscriptionPeriod.unit else {
                return LocalizedStringKey("")
            }
            switch unit {
            case .day:   return LocalizedStringKey("Daily")
            case .week:  return LocalizedStringKey("Weekly")
            case .month: return LocalizedStringKey("Monthly")
            case .year:  return LocalizedStringKey("Yearly")
            @unknown default:
                return LocalizedStringKey("Recurring")
            }
        }

    var pricePerMonth: String? {
        guard let subscription = subscription else { return nil }
        let period = subscription.subscriptionPeriod
        guard period.value > 0 else { return nil }

        var multiplier: Double
        switch period.unit {
        case .day:   multiplier = 30.0 / Double(period.value)
        case .week:  multiplier = 4.0  / Double(period.value)
        case .month: multiplier = 1.0  / Double(period.value)
        case .year:  multiplier = 1.0/(Double(period.value)*12.0)
        @unknown default: return nil
        }

        let perMonthPrice = price * Decimal(multiplier)
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.locale = priceFormatStyle.locale
        formatter.maximumFractionDigits = 2

        return formatter.string(from: perMonthPrice as NSDecimalNumber)
    }
}
