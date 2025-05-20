import Foundation

struct Carbohydrates: MacroWithTotal {
    // резервният total
    internal var _storedTotal: Double? = nil

    // --- компонентни полета (g) ---
    var sugars:         Double? { didSet { invalidateStoredTotal() } }
    var addedSugars:    Double? { didSet { invalidateStoredTotal() } }
    var sugarAlcohols:  Double? { didSet { invalidateStoredTotal() } }
    var fibreSoluble:   Double? { didSet { invalidateStoredTotal() } }
    var fibreInsoluble: Double? { didSet { invalidateStoredTotal() } }
    var starch:         Double? { didSet { invalidateStoredTotal() } }

    // --- удобни derived стойности ---
    /// Общо фибри (ако имаме поне една от двете стойности)
    var fibre: Double? {
        switch (fibreSoluble, fibreInsoluble) {
        case let (s?, i?): return s + i
        case let (s?, nil): return s
        case let (nil, i?): return i
        default: return nil
        }
    }

    /// “Нетни” въглехидрати – често използвано в кето режими
    var netCarbs: Double { total - (fibre ?? 0.0) - (sugarAlcohols ?? 0.0) }

    // --- MacroWithTotal helpers ---
    func sumOfComponents() -> Double {
        /// Използваме масив + compactMap, за да избегнем грешката
        [sugars, addedSugars, sugarAlcohols,
         fibreSoluble, fibreInsoluble, starch]
            .compactMap { $0 }
            .reduce(0.0, +)
    }

    mutating func resetComponents() {
        sugars = nil; addedSugars = nil; sugarAlcohols = nil
        fibreSoluble = nil; fibreInsoluble = nil; starch = nil
    }

    /// Бърз convenience init за total-only режим
    init(total: Double) {
        self._storedTotal = total
        // всички компоненти остават nil
        sugars = nil; addedSugars = nil; sugarAlcohols = nil
        fibreSoluble = nil; fibreInsoluble = nil; starch = nil
    }
}
