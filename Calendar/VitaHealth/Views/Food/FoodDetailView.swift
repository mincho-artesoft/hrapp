//
//  FoodDetailView.swift
//  VitaHealth
//
//  Updated on 2025-05-15
//  • Добавени полета Fats и Proteins
//  • isModified, saveFood и init нагласени за новите стойности
//

import SwiftUI
import SwiftData

struct FoodDetailView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    // MARK: – Reference data
    private static let vitaminNames: [String]  = defaultVitaminsList.map(\.name).sorted()
    private static let mineralNames: [String] = defaultMineralsList.map(\.name).sorted()

    private let allVitamins = Self.vitaminNames
    private let allMinerals = Self.mineralNames

    // MARK: – Editing target
    private var editingFood: Food?

    // MARK: – Originals (за detect-modified)
    private let initialFoodName: String
    private let initialServingSize: Double
    private let initialCarbohydrates: String
    private let initialFats: String
    private let initialProteins: String
    private let initialVitaminAmounts: [String: String]
    private let initialMineralAmounts: [String: String]

    // MARK: – Form state
    @State private var foodName: String
    @State private var servingSize: Double
    @State private var carbohydrates: String
    @State private var fats: String
    @State private var proteins: String
    @State private var vitaminAmounts: [String: String]
    @State private var mineralAmounts: [String: String]

    // MARK: – Init
    init(food: Food? = nil) {
        self.editingFood = food

        // базови стойности
        let initName    = food?.name        ?? NSLocalizedString("New Food", comment: "")
        let initServing = food?.servingSize ?? 200
        let initCarbs   = food.map { String($0.carbohydrates) } ?? "0"
        let initFats    = food.map { String($0.fats) }          ?? "0"
        let initProteins = food.map { String($0.proteins) }     ?? "0"

        _foodName      = State(initialValue: initName)
        _servingSize   = State(initialValue: initServing)
        _carbohydrates = State(initialValue: initCarbs)
        _fats          = State(initialValue: initFats)
        _proteins      = State(initialValue: initProteins)

        initialFoodName      = initName
        initialServingSize   = initServing
        initialCarbohydrates = initCarbs
        initialFats          = initFats
        initialProteins      = initProteins

        // витамини
        var vDict: [String: String] = [:]
        for v in Self.vitaminNames {
            vDict[v] = food?.vitamins.first(where: { $0.name == v }).map { String($0.amount) } ?? ""
        }
        _vitaminAmounts = State(initialValue: vDict)
        initialVitaminAmounts = vDict

        // минерали
        var mDict: [String: String] = [:]
        for m in Self.mineralNames {
            mDict[m] = food?.minerals.first(where: { $0.name == m }).map { String($0.amount) } ?? ""
        }
        _mineralAmounts = State(initialValue: mDict)
        initialMineralAmounts = mDict
    }

    // MARK: – View
    var body: some View {
        NavigationStack {
            Form {
                // — Food Information —
                Section("Food Information") {

                    LabeledField(label: "Name",     text: $foodName)
                    LabeledField(label: "Serving (g)",
                                 value: $servingSize)
                    LabeledField(label: "Carbs (g)",
                                 text: $carbohydrates)
                    LabeledField(label: "Fats (g)",
                                 text: $fats)
                    LabeledField(label: "Proteins (g)",
                                 text: $proteins)
                }

                // — Vitamins —
                Section("Vitamins (IU)") {
                    ForEach(allVitamins, id: \.self) { vitamin in
                        NutrientRow(
                            title: vitamin,
                            text: Binding(
                                get: { vitaminAmounts[vitamin] ?? "" },
                                set: { vitaminAmounts[vitamin] = $0 }
                            )
                        )
                    }
                }

                // — Minerals —
                Section("Minerals (µg)") {
                    ForEach(allMinerals, id: \.self) { mineral in
                        NutrientRow(
                            title: mineral,
                            text: Binding(
                                get: { mineralAmounts[mineral] ?? "" },
                                set: { mineralAmounts[mineral] = $0 }
                            )
                        )
                    }
                }
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .principal) {
                    Text(editingFood == nil ? "Add Food" : "Edit Food")
                        .font(.headline)
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        saveFood()
                        dismiss()
                    }
                    .disabled(!isModified ||
                              foodName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }

    // MARK: – Change detection
    private var isModified: Bool {
        func trimmed(_ s: String) -> String {
            s.trimmingCharacters(in: .whitespacesAndNewlines)
        }

        if trimmed(foodName) != trimmed(initialFoodName) { return true }
        if abs(servingSize - initialServingSize) > 0.001 { return true }

        let doubleDiff: (String, String) -> Bool = { curr, orig in
            (Double(trimmed(curr)) ?? 0) != (Double(trimmed(orig)) ?? 0)
        }
        if doubleDiff(carbohydrates, initialCarbohydrates) { return true }
        if doubleDiff(fats,          initialFats)          { return true }
        if doubleDiff(proteins,      initialProteins)      { return true }

        if !compare(initialVitaminAmounts, vitaminAmounts) { return true }
        if !compare(initialMineralAmounts, mineralAmounts) { return true }

        return false
    }

    private func compare(_ lhs: [String: String], _ rhs: [String: String]) -> Bool {
        guard lhs.count == rhs.count else { return false }
        for (k, v) in lhs {
            if v.trimmingCharacters(in: .whitespacesAndNewlines) !=
                (rhs[k] ?? "").trimmingCharacters(in: .whitespacesAndNewlines) {
                return false
            }
        }
        return true
    }

    // MARK: – Save
    private func saveFood() {
        guard !foodName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        let carbValue  = Double(carbohydrates) ?? 0
        let fatsValue  = Double(fats)          ?? 0
        let protValue  = Double(proteins)      ?? 0

        let vitaminUnit: (String) -> String = { n in
            defaultVitaminsList.first { $0.name == n }?.unit ?? ""
        }
        let mineralUnit: (String) -> String = { n in
            defaultMineralsList.first { $0.name == n }?.unit ?? ""
        }

        if let foodToEdit = editingFood {
            // update
            foodToEdit.name          = foodName
            foodToEdit.servingSize   = servingSize
            foodToEdit.carbohydrates = carbValue
            foodToEdit.fats          = fatsValue
            foodToEdit.proteins      = protValue

            foodToEdit.vitamins.removeAll()
            for v in allVitamins {
                let amt = Double(vitaminAmounts[v] ?? "") ?? 0
                foodToEdit.vitamins.append(
                    Nutrient(name: v, amount: amt, unit: vitaminUnit(v))
                )
            }

            foodToEdit.minerals.removeAll()
            for m in allMinerals {
                let amt = Double(mineralAmounts[m] ?? "") ?? 0
                foodToEdit.minerals.append(
                    Nutrient(name: m, amount: amt, unit: mineralUnit(m))
                )
            }
        } else {
            // create
            let newFood = Food(
                name: foodName,
                servingSize: servingSize,
                carbohydrates: carbValue,
                fats: fatsValue,
                proteins: protValue
            )
            for v in allVitamins {
                let amt = Double(vitaminAmounts[v] ?? "") ?? 0
                newFood.vitamins.append(
                    Nutrient(name: v, amount: amt, unit: vitaminUnit(v))
                )
            }
            for m in allMinerals {
                let amt = Double(mineralAmounts[m] ?? "") ?? 0
                newFood.minerals.append(
                    Nutrient(name: m, amount: amt, unit: mineralUnit(m))
                )
            }
            modelContext.insert(newFood)
        }

        try? modelContext.save()
    }
}

// MARK: – Helper components
private struct LabeledField: View {
    let label: String
    @Binding var text: String
    var numeric: Bool = false

    init(label: String, text: Binding<String>) {
        self.label = label
        self._text = text
    }

    init(label: String, value: Binding<Double>) {
        self.label   = label
        self._text   = Binding(
            get: { String(value.wrappedValue) },
            set: { value.wrappedValue = Double($0) ?? 0 }
        )
        self.numeric = true
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
            TextField(label, text: $text)
                .keyboardType(numeric ? .decimalPad : .default)
                .textFieldStyle(.roundedBorder)
        }
    }
}

private struct NutrientRow: View {
    let title: String
    @Binding var text: String

    var body: some View {
        HStack {
            Text(title)
            Spacer()
            TextField("", text: $text)
                .multilineTextAlignment(.trailing)
                .keyboardType(.decimalPad)
                .textFieldStyle(.roundedBorder)
                .frame(width: 80)
        }
    }
}
