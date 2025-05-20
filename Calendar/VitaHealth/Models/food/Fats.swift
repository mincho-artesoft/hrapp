import Foundation
// MARK: – Fats
struct Fats: MacroWithTotal {
    internal var _storedTotal: Double? = nil

    var saturated:       Double? { didSet { invalidateStoredTotal() } }
    var monounsaturated: Double? { didSet { invalidateStoredTotal() } }
    var polyunsaturated: Double? { didSet { invalidateStoredTotal() } }
    var trans:           Double? { didSet { invalidateStoredTotal() } }
    var omega3: Double?  { didSet { invalidateStoredTotal() } }
    var omega6: Double?  { didSet { invalidateStoredTotal() } }
    var omega9: Double?  { didSet { invalidateStoredTotal() } }
    var cholesterol: Double? // mg – doesn’t affect total

    var unsaturated: Double? {
        switch (monounsaturated, polyunsaturated) {
        case let (m?, p?): return m + p
        case let (m?, nil): return m
        case let (nil, p?): return p
        default: return nil
        }
    }

    func sumOfComponents() -> Double {
        (saturated ?? 0) + (monounsaturated ?? 0) + (polyunsaturated ?? 0) + (trans ?? 0)
    }
    mutating func resetComponents() {
        saturated = nil; monounsaturated = nil; polyunsaturated = nil; trans = nil
        omega3 = nil; omega6 = nil; omega9 = nil
    }
}


extension Fats {
    init(total: Double) {
        self._storedTotal = total
        self.saturated = nil
        self.monounsaturated = nil
        self.polyunsaturated = nil
        self.trans = nil
        self.omega3 = nil
        self.omega6 = nil
        self.omega9 = nil
        self.cholesterol = nil
    }
}
