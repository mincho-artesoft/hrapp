//
//  FoodDetailView.swift
//  VitaHealth
//
//  Updated: 2025-05-18
//  • Празно поле, когато стойността е 0 – за макроси, витамини, минерали
//  • parse(_:) преместена на ниво struct, за да е достъпна навсякъде
//  • LabeledField показва "" при 0 и форматира красиво числата
//

import SwiftUI
import SwiftData

// ─────────────────────────────────────────────────────────────
// MARK: – FoodDetailView
// ─────────────────────────────────────────────────────────────

struct FoodDetailView: View {

    // MARK: Dependencies
    @Environment(\.dismiss)      private var dismiss
    @Environment(\.modelContext) private var modelContext

    // Сортирани списъци с имената на всички витамини/минерали
    private static let vitaminNames  = defaultVitaminsList .map(\.name).sorted()
    private static let mineralNames  = defaultMineralsList .map(\.name).sorted()
    private let allVitamins = Self.vitaminNames
    private let allMinerals = Self.mineralNames

    // Ако е nil → създаваме нов Food
    private var editingFood: Food?

    // MARK: Original values (за modified-check)
    private let initialFoodName: String
    private let initialServing:  Double
    private let initialCarbs:    String
    private let initialFats:     String
    private let initialProts:    String
    private let initialVit:      [String:String]
    private let initialMin:      [String:String]

    // MARK: Form state
    @State private var foodName       : String
    @State private var servingSize    : Double
    @State private var carbohydrates  : String
    @State private var fats           : String
    @State private var proteins       : String
    @State private var vitaminAmounts : [String:String]
    @State private var mineralAmounts : [String:String]

    // MARK: – Init
    init(food: Food? = nil) {
        self.editingFood = food

        // --- базова информация (празно поле при 0)
        let name    = food?.name        ?? NSLocalizedString("New Food", comment: "")
        let serving = food?.servingSize ?? 200

        let carbs = food.map { $0.carbohydrates == 0 ? "" : $0.carbohydrates.clean } ?? ""
        let fats  = food.map { $0.fats          == 0 ? "" : $0.fats.clean          } ?? ""
        let prots = food.map { $0.proteins      == 0 ? "" : $0.proteins.clean      } ?? ""

        _foodName      = State(initialValue: name)
        _servingSize   = State(initialValue: serving)
        _carbohydrates = State(initialValue: carbs)
        _fats          = State(initialValue: fats)
        _proteins      = State(initialValue: prots)

        initialFoodName = name
        initialServing  = serving
        initialCarbs    = carbs
        initialFats     = fats
        initialProts    = prots

        // --- витамини (празно поле при 0)
        var vitDict = [String:String]()
        for v in Self.vitaminNames {
            if let amt = food?.vitamins.first(where: { $0.name == v })?.amount,
               amt > 0 {
                vitDict[v] = amt.clean
            } else {
                vitDict[v] = ""
            }
        }
        _vitaminAmounts = State(initialValue: vitDict)
        initialVit      = vitDict

        // --- минерали (празно поле при 0)
        var minDict = [String:String]()
        for m in Self.mineralNames {
            if let amt = food?.minerals.first(where: { $0.name == m })?.amount,
               amt > 0 {
                minDict[m] = amt.clean
            } else {
                minDict[m] = ""
            }
        }
        _mineralAmounts = State(initialValue: minDict)
        initialMin      = minDict
    }

    // ────────── Helper: parse "1,5" / "1.5"  →  Double ──────────
    /// При празен низ връща 0.
    private func parse(_ raw: String) -> Double {
        let t = raw.trimmingCharacters(in: .whitespaces)
        if let v = Double(t) { return v }
        return Double(t.replacingOccurrences(of: ",", with: ".")) ?? 0
    }

    // ────────── UI ──────────
    var body: some View {
        NavigationStack {
            Form {

                // — базова информация —
                Section("Food Information") {
                    LabeledField(label: "Name",        text: $foodName)
                    LabeledField(label: "Serving (g)", value: $servingSize)
                    LabeledField(label: "Carbs (g)",   text: $carbohydrates)
                    LabeledField(label: "Fats (g)",    text: $fats)
                    LabeledField(label: "Proteins (g)",text: $proteins)
                }

                // — витамини —
                Section("Vitamins (IU)") {
                    ForEach(allVitamins, id: \.self) { v in
                        NutrientRow(
                            title: v,
                            text: Binding(
                                get: { vitaminAmounts[v] ?? "" },
                                set: { vitaminAmounts[v] = $0 }
                            )
                        )
                    }
                }

                // — минерали —
                Section("Minerals (µg)") {
                    ForEach(allMinerals, id: \.self) { m in
                        NutrientRow(
                            title: m,
                            text: Binding(
                                get: { mineralAmounts[m] ?? "" },
                                set: { mineralAmounts[m] = $0 }
                            )
                        )
                    }
                }
            }
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .principal) {
                    Text(editingFood == nil ? "Add Food" : "Edit Food")
                        .font(.headline)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        saveFood()
                        dismiss()
                    }
                    .disabled(!isModified ||
                              foodName.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }

    // MARK: – Modified check
    private var isModified: Bool {
        func trim(_ s: String) -> String { s.trimmingCharacters(in: .whitespaces) }
        if trim(foodName) != trim(initialFoodName)   { return true }
        if abs(servingSize - initialServing) > 0.001 { return true }
        if trim(carbohydrates) != trim(initialCarbs) { return true }
        if trim(fats)          != trim(initialFats)  { return true }
        if trim(proteins)      != trim(initialProts) { return true }
        if vitaminAmounts != initialVit              { return true }
        if mineralAmounts != initialMin              { return true }
        return false
    }

    // ─────────────────────────────────────────────────────────────
    // MARK: – SAVE
    // ─────────────────────────────────────────────────────────────
    private func saveFood() {
        guard !foodName.trimmingCharacters(in: .whitespaces).isEmpty else { return }

        let carbVal = parse(carbohydrates)
        let fatVal  = parse(fats)
        let protVal = parse(proteins)

        // ─── UPDATE ───
        if let food = editingFood {
            food.name          = foodName
            food.servingSize   = servingSize
            food.carbohydrates = carbVal
            food.fats          = fatVal
            food.proteins      = protVal

            syncNutrients(
                in: &food.vitamins,
                from: vitaminAmounts,
                defaultList: defaultVitaminsList.map { ($0.name, $0.unit) },
                ownerKeyPath: \.vitaminOwner,
                food: food
            )

            syncNutrients(
                in: &food.minerals,
                from: mineralAmounts,
                defaultList: defaultMineralsList.map { ($0.name, $0.unit) },
                ownerKeyPath: \.mineralOwner,
                food: food
            )

        // ─── CREATE ───
        } else {
            let newFood = Food(
                name: foodName,
                servingSize: servingSize,
                carbohydrates: carbVal,
                fats: fatVal,
                proteins: protVal
            )
            modelContext.insert(newFood)

            newFood.vitamins = buildNutrients(
                from: vitaminAmounts,
                defaultList: defaultVitaminsList.map { ($0.name, $0.unit) },
                ownerKeyPath: \.vitaminOwner,
                food: newFood
            )

            newFood.minerals = buildNutrients(
                from: mineralAmounts,
                defaultList: defaultMineralsList.map { ($0.name, $0.unit) },
                ownerKeyPath: \.mineralOwner,
                food: newFood
            )
        }

        try? modelContext.save()
    }

    // ─────────────────────────────────────────────────────────────
    // MARK: – Helpers for nutrients
    // ─────────────────────────────────────────────────────────────

    /// Създава нови Nutrient обекти за дадената храна
    private func buildNutrients(
        from dict: [String:String],
        defaultList: [(name: String, unit: String)],
        ownerKeyPath: ReferenceWritableKeyPath<Nutrient, Food?>,
        food: Food
    ) -> [Nutrient] {

        var units = [String:String]()
        defaultList.forEach { units[$0.name] = $0.unit }

        return dict.keys.sorted().compactMap { key in
            let amt = parse(dict[key] ?? "")
            guard amt > 0 else { return nil }           // пропускаме празни
            let n = Nutrient(name: key, amount: amt, unit: units[key] ?? "")
            n[keyPath: ownerKeyPath] = food
            modelContext.insert(n)
            return n
        }
    }

    /// Синхронизира съществуващия масив Nutrient с новите стойности
    private func syncNutrients(
        in array: inout [Nutrient],
        from dict: [String:String],
        defaultList: [(name: String, unit: String)],
        ownerKeyPath: ReferenceWritableKeyPath<Nutrient, Food?>,
        food: Food
    ) {
        var units = [String:String]()
        defaultList.forEach { units[$0.name] = $0.unit }

        // 1. Обновяваме съществуващи или създаваме нови
        for key in dict.keys {
            let amt = parse(dict[key] ?? "")
            if let existing = array.first(where: { $0.name == key }) {
                existing.amount = amt
            } else if amt > 0 {
                let n = Nutrient(name: key, amount: amt, unit: units[key] ?? "")
                n[keyPath: ownerKeyPath] = food
                modelContext.insert(n)
                array.append(n)
            }
        }

        // 2. Премахваме празните
        for n in array.filter({ (dict[$0.name] ?? "").isEmpty }) {
            modelContext.delete(n)
        }
        array.removeAll { (dict[$0.name] ?? "").isEmpty }
    }
}
