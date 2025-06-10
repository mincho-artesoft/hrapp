// LocalizationExtensions.swift

import Foundation
import StoreKit
import SwiftUI

extension Product.SubscriptionPeriod.Unit {
    /// Връща локализирана "noun" версия на единицата (day/week/month/year)
    func noun(plural: Bool) -> String {
        let key: String
        switch self {
        case .day:   key = plural ? "days"   : "day"
        case .week:  key = plural ? "weeks"  : "week"
        case .month: key = plural ? "months" : "month"
        case .year:  key = plural ? "years"  : "year"
        @unknown default:
            key = plural ? "periods" : "period"
        }
        return NSLocalizedString(key, comment: "Subscription period unit")
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

    /// Връща "/day", "/week" и т.н., също локализирано
    var perPeriodString: String {
        let key: String
        switch self {
        case .day:   key = "/day"
        case .week:  key = "/week"
        case .month: key = "/month"
        case .year:  key = "/year"
        @unknown default:
            key = ""
        }
        return NSLocalizedString(key, comment: "Subscription price suffix")
    }
}

extension Product {
    /// Връща локализирана кратка форма: "Daily", "Weekly" и т.н.
    var periodUnitOnly: String {
        guard let unit = subscription?.subscriptionPeriod.unit else {
            return ""
        }
        let key: String
        switch unit {
        case .day:   key = "Daily"
        case .week:  key = "Weekly"
        case .month: key = "Monthly"
        case .year:  key = "Yearly"
        @unknown default:
            key = "Recurring"
        }
        return NSLocalizedString(key, comment: "Subscription period adjective")
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
