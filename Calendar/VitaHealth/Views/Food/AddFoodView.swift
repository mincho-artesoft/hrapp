//
//  AddFoodView.swift
//  VitaHealth
//

import SwiftUI
import SwiftData

struct AddFoodView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    // Nutrient names used in the form.
    private let allVitamins = [
        "Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E", "Vitamin K",
        "Vitamin B1", "Vitamin B2", "Vitamin B3", "Vitamin B5",
        "Vitamin B6", "Vitamin B7", "Vitamin B9", "Vitamin B12"
    ]
    private let allMinerals = [
        "Calcium", "Iron", "Magnesium", "Potassium", "Sodium", "Zinc"
    ]
    
    // If editing an existing Food, it is passed in.
    private var editingFood: Food?
    
    // These hold the original values so that we can detect modifications.
    private let initialFoodName: String
    private let initialServingSize: Double
    private let initialCarbohydrates: String
    private let initialVitaminAmounts: [String: String]
    private let initialMineralAmounts: [String: String]
    
    // The form’s state.
    @State private var foodName: String
    @State private var servingSize: Double
    @State private var carbohydrates: String
    @State private var vitaminAmounts: [String: String]
    @State private var mineralAmounts: [String: String]
    
    /// If no Food is passed, this view acts as “add new.”
    init(food: Food? = nil) {
        self.editingFood = food
        let initName = food?.name ?? "New Food"
        let initServing = food?.servingSize ?? 200
        let initCarbs = food != nil ? String(food!.carbohydrates) : "0"
        
        // Set up state variables.
        _foodName = State(initialValue: initName)
        _servingSize = State(initialValue: initServing)
        _carbohydrates = State(initialValue: initCarbs)
        self.initialFoodName = initName
        self.initialServingSize = initServing
        self.initialCarbohydrates = initCarbs
        
        // Initialize vitamin amounts.
        var initVitamins: [String: String] = [:]
        for vitamin in allVitamins {
            if let food = food,
               let nutrient = food.vitamins.first(where: { $0.name == vitamin }) {
                initVitamins[vitamin] = String(nutrient.amount)
            } else {
                initVitamins[vitamin] = ""
            }
        }
        
        // Initialize mineral amounts.
        var initMinerals: [String: String] = [:]
        for mineral in allMinerals {
            if let food = food,
               let nutrient = food.minerals.first(where: { $0.name == mineral }) {
                initMinerals[mineral] = String(nutrient.amount)
            } else {
                initMinerals[mineral] = ""
            }
        }
        _vitaminAmounts = State(initialValue: initVitamins)
        _mineralAmounts = State(initialValue: initMinerals)
        self.initialVitaminAmounts = initVitamins
        self.initialMineralAmounts = initMinerals
    }
    
    /// Returns true if any field has been changed relative to the original values.
    private var isModified: Bool {
        // Compare text fields after trimming.
        if foodName.trimmingCharacters(in: .whitespacesAndNewlines) != initialFoodName.trimmingCharacters(in: .whitespacesAndNewlines) {
            return true
        }
        // Compare the serving size with a small tolerance.
        if abs(servingSize - initialServingSize) > 0.001 {
            return true
        }
        // Compare carbohydrate values numerically.
        let currentCarbs = Double(carbohydrates.trimmingCharacters(in: .whitespacesAndNewlines)) ?? 0
        let originalCarbs = Double(initialCarbohydrates.trimmingCharacters(in: .whitespacesAndNewlines)) ?? 0
        if abs(currentCarbs - originalCarbs) > 0.001 {
            return true
        }
        // Compare vitamin amounts.
        if !compareDictionaries(initialVitaminAmounts, vitaminAmounts) {
            return true
        }
        // Compare mineral amounts.
        if !compareDictionaries(initialMineralAmounts, mineralAmounts) {
            return true
        }
        return false
    }
    
    /// Compares two dictionaries of strings after trimming their values.
    private func compareDictionaries(_ lhs: [String: String], _ rhs: [String: String]) -> Bool {
        if lhs.count != rhs.count { return false }
        for (key, value) in lhs {
            let lhsTrimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
            let rhsTrimmed = (rhs[key] ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
            if lhsTrimmed != rhsTrimmed {
                return false
            }
        }
        return true
    }
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Food Information")) {
                    TextField("Food Name", text: $foodName)
                        .textFieldStyle(.roundedBorder)
                    TextField("Serving Size (grams)", value: $servingSize, format: .number)
                        .keyboardType(.decimalPad)
                        .textFieldStyle(.roundedBorder)
                    TextField("Carbohydrates (g)", text: $carbohydrates)
                        .keyboardType(.decimalPad)
                        .textFieldStyle(.roundedBorder)
                }
                Section(header: Text("Vitamins (IU)")) {
                    ForEach(allVitamins, id: \.self) { vitamin in
                        HStack {
                            Text(vitamin)
                            Spacer()
                            TextField("", text: Binding(
                                get: { vitaminAmounts[vitamin] ?? "" },
                                set: { vitaminAmounts[vitamin] = $0 }
                            ))
                            .multilineTextAlignment(.trailing)
                            .keyboardType(.decimalPad)
                            .frame(width: 80)
                            .textFieldStyle(.roundedBorder)
                        }
                    }
                }
                Section(header: Text("Minerals (µg)")) {
                    ForEach(allMinerals, id: \.self) { mineral in
                        HStack {
                            Text(mineral)
                            Spacer()
                            TextField("", text: Binding(
                                get: { mineralAmounts[mineral] ?? "" },
                                set: { mineralAmounts[mineral] = $0 }
                            ))
                            .multilineTextAlignment(.trailing)
                            .keyboardType(.decimalPad)
                            .frame(width: 80)
                            .textFieldStyle(.roundedBorder)
                        }
                    }
                }
            }
            .navigationTitle("Add Food")
            .toolbar {
                // Left “Cancel” button always available.
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                // Right button shows “Close” if nothing is changed; switches to “Done” when modified.
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(isModified ? "Done" : "Close") {
                        if isModified {
                            saveFood()
                        }
                        dismiss()
                    }
                    // Disable saving if the form is modified but the food name is empty.
                    .disabled(isModified && foodName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }
    
    /// Updates an existing Food or creates a new one.
    private func saveFood() {
        let carbValue = Double(carbohydrates) ?? 0
        if let foodToEdit = editingFood {
            foodToEdit.name = foodName
            foodToEdit.servingSize = servingSize
            foodToEdit.carbohydrates = carbValue
            foodToEdit.vitamins.removeAll()
            for vitamin in allVitamins {
                let text = vitaminAmounts[vitamin] ?? ""
                let amount = Double(text) ?? 0
                let nutrient = Nutrient(name: vitamin, amount: amount, unit: "IU")
                foodToEdit.vitamins.append(nutrient)
            }
            foodToEdit.minerals.removeAll()
            for mineral in allMinerals {
                let text = mineralAmounts[mineral] ?? ""
                let amount = Double(text) ?? 0
                let nutrient = Nutrient(name: mineral, amount: amount, unit: "µg")
                foodToEdit.minerals.append(nutrient)
            }
        } else {
            let newFood = Food(name: foodName, servingSize: servingSize, carbohydrates: carbValue)
            for vitamin in allVitamins {
                let text = vitaminAmounts[vitamin] ?? ""
                let amount = Double(text) ?? 0
                let nutrient = Nutrient(name: vitamin, amount: amount, unit: "IU")
                newFood.vitamins.append(nutrient)
            }
            for mineral in allMinerals {
                let text = mineralAmounts[mineral] ?? ""
                let amount = Double(text) ?? 0
                let nutrient = Nutrient(name: mineral, amount: amount, unit: "µg")
                newFood.minerals.append(nutrient)
            }
            modelContext.insert(newFood)
        }
        try? modelContext.save()
    }
}

#Preview {
    AddFoodView()
}
