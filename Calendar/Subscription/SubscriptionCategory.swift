// MARK: - Category Enum
enum SubscriptionCategory: String, CaseIterable, Identifiable {
    case base = "Base"
    case advance = "Advance"
    case premium = "Premium"
    var id: String { rawValue }
}
