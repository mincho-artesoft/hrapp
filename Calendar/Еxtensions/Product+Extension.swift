import StoreKit
// MARK: - Helpers (Moved BEFORE SubscriptionView)
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

    // Helper for "/month", "/year" suffix
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
    /// "Monthly", "Yearly", … – English adjective only.
    var periodUnitOnly: String {
        guard let unit = subscription?.subscriptionPeriod.unit else { return "" }
        switch unit {
        case .day:   return "Daily"
        case .week:  return "Weekly"
        case .month: return "Monthly"
        case .year:  return "Yearly"
        @unknown default: return "Recurring"
        }
    }

     /// Calculates the price per month for comparison purposes, especially for annual plans.
     /// Returns a formatted string like "$7.49". Returns nil if not a subscription or cannot calculate.
     var pricePerMonth: String? {
         guard let subscription = subscription else { return nil }
         let period = subscription.subscriptionPeriod
         guard period.value > 0 else { return nil } // Avoid division by zero

         var monthlyMultiplier: Double = 0
         switch period.unit {
         case .day: monthlyMultiplier = 30.0 / Double(period.value) // Approximation
         case .week: monthlyMultiplier = 4.0 / Double(period.value) // Approximation
         case .month: monthlyMultiplier = 1.0 / Double(period.value)
         case .year: monthlyMultiplier = 1.0 / (Double(period.value) * 12.0)
         @unknown default: return nil
         }

         guard monthlyMultiplier > 0 else { return nil }

         let pricePerMonthDecimal = price * Decimal(monthlyMultiplier)

         // Use a NumberFormatter to format the currency correctly
         let formatter = NumberFormatter()
         formatter.numberStyle = .currency
         formatter.locale = priceFormatStyle.locale // Use locale from the product
         formatter.maximumFractionDigits = 2 // Ensure two decimal places

         return formatter.string(from: pricePerMonthDecimal as NSDecimalNumber)
     }
}
