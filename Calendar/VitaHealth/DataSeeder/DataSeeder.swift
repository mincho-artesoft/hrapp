import SwiftUI
import SwiftData

class DataSeeder: ObservableObject {
    @MainActor
    func seedIfNeeded(modelContext: ModelContext) {
        // --- Foods ---
        let foodFetch = FetchDescriptor<Food>(sortBy: [SortDescriptor(\.name)])
        if (try? modelContext.fetch(foodFetch))?.isEmpty ?? true {
            for def in defaultFoodsList {
                modelContext.insert(Food.from(defaultFood: def)) // isUserAdded = false вътре
            }
        }

        // --- Minerals ---
        let mineralFetch = FetchDescriptor<Mineral>(sortBy: [SortDescriptor(\.name)])
        let existingMins = (try? modelContext.fetch(mineralFetch)) ?? []
        if existingMins.isEmpty {
            for d in defaultMineralsList {
                let m = Mineral(name: d.name, unit: d.unit)
                m.requirements = d.requirements
                modelContext.insert(m)
            }
        } else {
            for m in existingMins {
                if m.unit.trimmingCharacters(in: .whitespaces).isEmpty,
                   let d = defaultMineralsList.first(where: { $0.name == m.name }) {
                    m.unit = d.unit
                    if m.requirements.isEmpty { m.requirements = d.requirements }
                }
            }
        }

        // --- Vitamins ---
        let vitaminFetch = FetchDescriptor<Vitamin>(sortBy: [SortDescriptor(\.name)])
        let existingVits = (try? modelContext.fetch(vitaminFetch)) ?? []
        if existingVits.isEmpty {
            for d in defaultVitaminsList {
                let v = Vitamin(name: d.name, unit: d.unit)
                v.requirements = d.requirements
                modelContext.insert(v)
            }
        } else {
            for v in existingVits {
                if v.unit.trimmingCharacters(in: .whitespaces).isEmpty,
                   let d = defaultVitaminsList.first(where: { $0.name == v.name }) {
                    v.unit = d.unit
                    if v.requirements.isEmpty { v.requirements = d.requirements }
                }
            }
        }

        try? modelContext.save()
    }
}
