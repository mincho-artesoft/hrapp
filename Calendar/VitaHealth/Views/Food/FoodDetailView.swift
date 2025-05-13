//
//  FoodDetailView.swift
//  VitaHealth
//
//  Updated to allow editing of fats and proteins and include debug logs.
//  Created by Mincho Milev on 2/3/25.
//

import SwiftUI
import SwiftData

struct FoodDetailView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    var food: Food

    // Editable state variables
    @State private var foodName: String
    @State private var servingSize: Double
    @State private var carbohydrates: String
    @State private var fats: String         // New
    @State private var proteins: String       // New

    // Dictionaries for vitamins and minerals amounts.
    @State private var vitaminAmounts: [String: String]
    @State private var mineralAmounts: [String: String]

    // Store initial values for comparison
    private let initialFoodName: String
    private let initialServingSize: Double
    private let initialCarbohydrates: String
    private let initialFats: String
    private let initialProteins: String
    private let initialVitaminAmounts: [String: String]
    private let initialMineralAmounts: [String: String]

    // Debug: List of vitamins and minerals to load
    private let allVitamins = [
        "Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E", "Vitamin K",
        "Vitamin B1", "Vitamin B2", "Vitamin B3", "Vitamin B5",
        "Vitamin B6", "Vitamin B7", "Vitamin B9", "Vitamin B12"
    ]
    private let allMinerals = [
        "Calcium", "Iron", "Magnesium", "Potassium", "Sodium", "Zinc"
    ]

    init(food: Food) {
        self.food = food
        let initName = food.name
        let initServing = food.servingSize
        let initCarbs = String(food.carbohydrates)
        let initFats = String(food.fats)
        let initProteins = String(food.proteins)
        self.initialFoodName = initName
        self.initialServingSize = initServing
        self.initialCarbohydrates = initCarbs
        self.initialFats = initFats
        self.initialProteins = initProteins
        _foodName = State(initialValue: initName)
        _servingSize = State(initialValue: initServing)
        _carbohydrates = State(initialValue: initCarbs)
        _fats = State(initialValue: initFats)
        _proteins = State(initialValue: initProteins)
        
        // Log basic Food info upon initialization.
        print("FoodDetailView init: food = \(food.name), servingSize = \(food.servingSize), carbohydrates = \(food.carbohydrates), fats = \(food.fats), proteins = \(food.proteins)")
        
        // Initialize vitamin amounts based on food.vitamins.
        var initVits: [String: String] = [:]
        for vitamin in allVitamins {
            if let nutrient = food.vitamins.first(where: { $0.name == vitamin }) {
                initVits[vitamin] = String(nutrient.amount)
                print("Found vitamin \(vitamin): \(nutrient.amount)")
            } else {
                initVits[vitamin] = ""
                print("No value found for vitamin \(vitamin)")
            }
        }
        _vitaminAmounts = State(initialValue: initVits)
        self.initialVitaminAmounts = initVits
        
        // Initialize mineral amounts based on food.minerals.
        var initMins: [String: String] = [:]
        for mineral in allMinerals {
            if let nutrient = food.minerals.first(where: { $0.name == mineral }) {
                initMins[mineral] = String(nutrient.amount)
                print("Found mineral \(mineral): \(nutrient.amount)")
            } else {
                initMins[mineral] = ""
                print("No value found for mineral \(mineral)")
            }
        }
        _mineralAmounts = State(initialValue: initMins)
        self.initialMineralAmounts = initMins
    }

    private var isModified: Bool {
        if foodName.trimmingCharacters(in: .whitespacesAndNewlines) != initialFoodName.trimmingCharacters(in: .whitespacesAndNewlines) {
            return true
        }
        if abs(servingSize - initialServingSize) > 0.001 {
            return true
        }
        if abs((Double(carbohydrates) ?? 0) - (Double(initialCarbohydrates) ?? 0)) > 0.001 {
            return true
        }
        if abs((Double(fats) ?? 0) - (Double(initialFats) ?? 0)) > 0.001 {
            return true
        }
        if abs((Double(proteins) ?? 0) - (Double(initialProteins) ?? 0)) > 0.001 {
            return true
        }
        if !compareDictionaries(initialVitaminAmounts, vitaminAmounts) {
            return true
        }
        if !compareDictionaries(initialMineralAmounts, mineralAmounts) {
            return true
        }
        return false
    }

    private func compareDictionaries(_ lhs: [String: String], _ rhs: [String: String]) -> Bool {
        if lhs.count != rhs.count { return false }
        for (key, value) in lhs {
            let lhsTrim = value.trimmingCharacters(in: .whitespacesAndNewlines)
            let rhsTrim = (rhs[key] ?? "").trimmingCharacters(in: .whitespacesAndNewlines)
            if lhsTrim != rhsTrim {
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
                    TextField("Fats (g)", text: $fats)
                        .keyboardType(.decimalPad)
                        .textFieldStyle(.roundedBorder)
                    TextField("Proteins (g)", text: $proteins)
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
            .navigationTitle("Food Details")
            .onAppear {
                // Log the current state of vitamins and minerals
                print("FoodDetailView onAppear:")
                print("  food.vitamins: \(food.vitamins)")
                print("  food.minerals: \(food.minerals)")
                print("  vitaminAmounts: \(vitaminAmounts)")
                print("  mineralAmounts: \(mineralAmounts)")
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(isModified ? "Done" : "Close") {
                        if isModified {
                            saveFood()
                        }
                        dismiss()
                    }
                    .disabled(isModified && foodName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }

    private func saveFood() {
        let carbValue = Double(carbohydrates) ?? 0
        let fatsValue = Double(fats) ?? 0
        let proteinsValue = Double(proteins) ?? 0
        
        food.name = foodName
        food.servingSize = servingSize
        food.carbohydrates = carbValue
        food.fats = fatsValue         // Save new fats value
        food.proteins = proteinsValue   // Save new proteins value

        food.vitamins.removeAll()
        for vitamin in allVitamins {
            let text = vitaminAmounts[vitamin] ?? ""
            let amount = Double(text) ?? 0
            let nutrient = Nutrient(name: vitamin, amount: amount, unit: "IU")
            food.vitamins.append(nutrient)
        }
        food.minerals.removeAll()
        for mineral in allMinerals {
            let text = mineralAmounts[mineral] ?? ""
            let amount = Double(text) ?? 0
            let nutrient = Nutrient(name: mineral, amount: amount, unit: "µg")
            food.minerals.append(nutrient)
        }
        
        print("Saving Food:")
        print("  Name: \(food.name)")
        print("  Serving Size: \(food.servingSize)")
        print("  Carbohydrates: \(food.carbohydrates)")
        print("  Fats: \(food.fats)")
        print("  Proteins: \(food.proteins)")
        print("  Vitamins: \(food.vitamins)")
        print("  Minerals: \(food.minerals)")
        
        try? modelContext.save()
    }
}
