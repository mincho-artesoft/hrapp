import SwiftUI

/// Статуси на абонацията (по избор)
enum SubscriptionStatus: String, CaseIterable {
    case base    = "Base"
    case advance = "Advance"
    case premium = "Premium"

    /// Локализирано заглавие за UI
    var title: LocalizedStringKey {
        LocalizedStringKey(rawValue)
    }
}
