import Foundation

// MARK: - Category Enum
enum SubscriptionCategory: String, CaseIterable, Identifiable {
    case base     = "Base"
    case advance  = "Advance"
    case premium  = "Premium"

    var id: String { rawValue }

    /// Връща локализирано заглавие за показване в UI
    var title: String {
        NSLocalizedString(rawValue, comment: "Subscription category title")
    }
}
