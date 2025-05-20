
import Foundation

// MARK: – Base protocol (DRY for the three structs)
protocol MacroWithTotal: Codable {
    var _storedTotal: Double? { get set }
    func sumOfComponents() -> Double
}

extension MacroWithTotal {
    /// Public API – computed total that follows the “either / or” rule
    var total: Double {
        get { _storedTotal ?? sumOfComponents() }
        set {
            _storedTotal = newValue
            resetComponents()
        }
    }

    /// When any component is set, drop the stored total so that `total`
    /// recalculates automatically.
    mutating func invalidateStoredTotal() {
        _storedTotal = nil
    }

    /// Default no-op; each struct overrides to clear its own fields.
    mutating func resetComponents() { }
}
