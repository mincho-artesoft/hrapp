import Foundation
// MARK: – Proteins
struct Proteins: MacroWithTotal {
    internal var _storedTotal: Double? = nil

    var complete:   Double? { didSet { invalidateStoredTotal() } }
    var incomplete: Double? { didSet { invalidateStoredTotal() } }
    var aminoAcids: [AminoAcid : Double]? { didSet { invalidateStoredTotal() } }

    func sumOfComponents() -> Double {
        (complete ?? 0) + (incomplete ?? 0)
    }
    mutating func resetComponents() {
        complete = nil; incomplete = nil; aminoAcids = nil
    }
}


extension Proteins {
    init(total: Double) {
        self._storedTotal = total
        self.complete = nil
        self.incomplete = nil
        self.aminoAcids = nil
    }
}
