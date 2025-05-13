import SwiftUI
import SwiftData

class DataSeeder: ObservableObject {
    @MainActor func seedIfNeeded(modelContext: ModelContext) {
        // Seed Foods if not already present.
        let foodFetch = FetchDescriptor<Food>(sortBy: [SortDescriptor(\.name)])
        let existingFoods = (try? modelContext.fetch(foodFetch)) ?? []
        if existingFoods.isEmpty {
            for defaultFood in defaultFoodsList {
                let food = Food.from(defaultFood: defaultFood)
                modelContext.insert(food)
            }
        }
        
        // For Minerals, update if missing complete data; otherwise, seed if empty.
        let mineralFetch = FetchDescriptor<Mineral>(sortBy: [SortDescriptor(\.name)])
        let existingMinerals = (try? modelContext.fetch(mineralFetch)) ?? []
        if existingMinerals.isEmpty {
            for defaultMineral in defaultMineralsList {
                let mineral = Mineral(name: defaultMineral.name, unit: defaultMineral.unit)
                // Directly assign requirements since it's non-optional.
                mineral.requirements = defaultMineral.requirements
                modelContext.insert(mineral)
            }
        } else {
            for mineral in existingMinerals {
                // Update unit if it’s empty.
                if mineral.unit.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
                   let defaultData = defaultMineralsList.first(where: { $0.name == mineral.name }) {
                    mineral.unit = defaultData.unit
                    // Also update requirements if they are empty.
                    if mineral.requirements.isEmpty {
                        mineral.requirements = defaultData.requirements
                    }
                }
            }
        }
        
        // For Vitamins, update similarly (assuming your defaultVitaminsList has non-optional requirements).
        let vitaminFetch = FetchDescriptor<Vitamin>(sortBy: [SortDescriptor(\.name)])
        let existingVitamins = (try? modelContext.fetch(vitaminFetch)) ?? []
        if existingVitamins.isEmpty {
            for defaultVitamin in defaultVitaminsList {
                let vitamin = Vitamin(name: defaultVitamin.name, unit: defaultVitamin.unit)
                vitamin.requirements = defaultVitamin.requirements
                modelContext.insert(vitamin)
            }
        } else {
            for vitamin in existingVitamins {
                if vitamin.unit.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty,
                   let defaultData = defaultVitaminsList.first(where: { $0.name == vitamin.name }) {
                    vitamin.unit = defaultData.unit
                    if vitamin.requirements.isEmpty {
                        vitamin.requirements = defaultData.requirements
                    }
                }
            }
        }
        
        do {
            try modelContext.save()
        } catch {
            print("Error seeding default data: \(error)")
        }
    }
}
