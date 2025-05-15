//
//  RecipeEditorSheetView.swift
//  VitaHealth
//
//  Create / edit a recipe with live vitamin & mineral bars.
//  (Definitions of `NutrientBarView` and `IngredientLine` are expected
//   elsewhere in the project.)
//
//  Updated: 2025-05-15
//

import SwiftUI
import SwiftData

// ──────────────────────────────────────────────────────────────
// MARK: – Main sheet
// ──────────────────────────────────────────────────────────────

struct RecipeEditorSheetView: View {

    // Вход
    var recipe:  Food?    = nil           // при редакция
    var profile: Profile? = nil           // активен профил за RDA/UL

    @Environment(\.dismiss)      private var dismiss
    @Environment(\.modelContext) private var modelContext

    // Всички храни, които НЕ са рецепти
    @Query(sort: [SortDescriptor(\Food.name)])
    private var allFoods: [Food]
    private var ingredientFoods: [Food] { allFoods.filter { !$0.isRecipe } }

    // Пълен списък имена (показваме всички барове)
    private let allVitaminNames = defaultVitaminsList.map(\.name).sorted()
    private let allMineralNames = defaultMineralsList.map(\.name).sorted()

    // Form state
    @State private var recipeName = ""
    @State private var ingredients: [IngredientLine] = []
    @State private var searchText = ""

    // ────────── Init
    init(recipe: Food? = nil, profile: Profile? = nil) {
        self.recipe  = recipe
        self.profile = profile

        _recipeName = State(initialValue: recipe?.name ?? "")
        if let rec = recipe {
            let lines = rec.ingredients.map { IngredientLine(food: $0, amount: 100) }
            _ingredients = State(initialValue: lines)
        }
    }

    // ────────── View
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {

                    // ─ Name ------------------------------------------------
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Recipe")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        TextField("Name", text: $recipeName)
                            .textFieldStyle(.roundedBorder)
                    }

                    // ─ Search + add ---------------------------------------
                    searchSection

                    // ─ Ingredients list -----------------------------------
                    ingredientsSection

                    // ─ Vitamins -------------------------------------------
                    Text("Vitamins")
                        .font(.title2.bold())
                        .padding(.top, 10)

                    ForEach(allVitaminNames, id: \.self) { name in
                        let amt = vitaminAmounts[name, default: 0]
                        if let (need, ul, unit) = requirement(for: name, isVitamin: true) {
                            NutrientBarView(title: name,
                                            amount: amt,
                                            unit: unit,
                                            need: need,
                                            upper: ul)
                        }
                    }

                    // ─ Minerals -------------------------------------------
                    Text("Minerals")
                        .font(.title2.bold())
                        .padding(.top, 10)

                    ForEach(allMineralNames, id: \.self) { name in
                        let amt = mineralAmounts[name, default: 0]
                        if let (need, ul, unit) = requirement(for: name, isVitamin: false) {
                            NutrientBarView(title: name,
                                            amount: amt,
                                            unit: unit,
                                            need: need,
                                            upper: ul)
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.bottom, 40)
            }
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .principal) {
                    Text(recipe == nil ? "Add Recipe" : "Edit Recipe")
                        .font(.headline)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        saveRecipe()
                        dismiss()
                    }
                    .disabled(recipeName.trimmingCharacters(in: .whitespaces).isEmpty ||
                              ingredients.isEmpty)
                }
            }
        }
    }

    // ──────────────────────────────────────────────────────────
    // MARK: – UI sections
    // ──────────────────────────────────────────────────────────

    private var searchSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            TextField("Search Food", text: $searchText)
                .padding(10)
                .background(Color(.secondarySystemBackground))
                .cornerRadius(8)

            if !searchResults.isEmpty {
                ForEach(searchResults, id: \.id) { food in
                    Button {
                        addIngredient(food)
                    } label: {
                        HStack {
                            Text(food.name)
                            Spacer()
                            Text("\(Int(food.servingSize)) g")
                                .foregroundColor(.secondary)
                        }
                        .padding(.vertical, 4)
                    }
                }
                .buttonStyle(.plain)
            }
        }
    }

    private var ingredientsSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            ForEach($ingredients) { $line in
                HStack {
                    Text(line.food.name)
                        .frame(maxWidth: .infinity, alignment: .leading)

                    TextField("", value: $line.amount, formatter: numberFormatter)
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                        .frame(width: 60)

                    Text("g").foregroundColor(.secondary)

                    Button {
                        removeIngredient(line)
                    } label: {
                        Image(systemName: "trash")
                            .foregroundColor(.blue)
                    }
                }
                .padding(.vertical, 4)
            }
        }
    }

    // ──────────────────────────────────────────────────────────
    // MARK: – Aggregation helpers
    // ──────────────────────────────────────────────────────────

    private var vitaminAmounts: [String: Double] { aggregate(isVitamin: true) }
    private var mineralAmounts: [String: Double] { aggregate(isVitamin: false) }

    private func aggregate(isVitamin: Bool) -> [String: Double] {
        var dict: [String: Double] = [:]

        for line in ingredients {
            let ratio     = line.amount / line.food.servingSize
            let nutrients = isVitamin ? line.food.vitamins : line.food.minerals
            for n in nutrients {
                dict[n.name, default: 0] += n.amount * ratio
            }
        }
        return dict
    }

    private func requirement(for name: String,
                             isVitamin: Bool) -> (Double, Double, String)? {

        guard let profile else {
            let unit = (isVitamin
                        ? defaultVitaminsList.first { $0.name == name }?.unit
                        : defaultMineralsList.first { $0.name == name }?.unit) ?? ""
            return (0, 0, unit)
        }

        let demo = demographicString(for: profile)

        if isVitamin,
           let vit = defaultVitaminsList.first(where: { $0.name == name }),
           let req = vit.requirements.first(where: { $0.demographic == demo }) {
            return (req.dailyNeed, req.upperLimit, vit.unit)
        }

        if !isVitamin,
           let min = defaultMineralsList.first(where: { $0.name == name }),
           let req = min.requirements.first(where: { $0.demographic == demo }) {
            return (req.dailyNeed, req.upperLimit, min.unit)
        }
        return nil
    }

    private func demographicString(for profile: Profile) -> String {
        let months = Calendar.current.dateComponents([.month],
                                                     from: profile.birthday,
                                                     to: Date()).month ?? 0
        if months < 6  { return "Babies (0-6 months)" }
        if months < 12 { return "Babies (7-12 months)" }

        switch profile.age {
        case 1..<4:   return "Children (1-3 years)"
        case 4..<9:   return "Children (4-8 years)"
        case 9..<14:  return "Children (9-13 years)"
        case 14..<19: return "Adolescents (14-18 years)"
        default:      break
        }
        return profile.gender.lowercased().hasPrefix("f")
             ? "Adult Women (19+)" : "Adult Men (19+)"
    }

    // ──────────────────────────────────────────────────────────
    // MARK: – Actions
    // ──────────────────────────────────────────────────────────

    private func addIngredient(_ food: Food) {
        if let i = ingredients.firstIndex(where: { $0.food.id == food.id }) {
            ingredients[i].amount += 50
        } else {
            ingredients.append(IngredientLine(food: food, amount: 50))
        }
        searchText = ""
    }

    private func removeIngredient(_ line: IngredientLine) {
        ingredients.removeAll { $0.id == line.id }
    }

    private func saveRecipe() {

        // — Aggregate totals —
        let totalGrams = ingredients.reduce(0) { $0 + $1.amount }

        var totalCarb = 0.0, totalFat = 0.0, totalProt = 0.0
        for line in ingredients {
            let ratio = line.amount / line.food.servingSize
            totalCarb += line.food.carbohydrates * ratio
            totalFat  += line.food.fats          * ratio
            totalProt += line.food.proteins      * ratio
        }

        // — Aggregate micro-nutrients —
        let vitUnit: (String) -> String = { n in
            defaultVitaminsList.first { $0.name == n }?.unit ?? ""
        }
        let minUnit: (String) -> String = { n in
            defaultMineralsList.first { $0.name == n }?.unit ?? ""
        }

        let vitArray = allVitaminNames.map {
            Nutrient(name: $0,
                     amount: vitaminAmounts[$0, default: 0],
                     unit: vitUnit($0))
        }
        let minArray = allMineralNames.map {
            Nutrient(name: $0,
                     amount: mineralAmounts[$0, default: 0],
                     unit: minUnit($0))
        }

        let foodsOnly = ingredients.map(\.food)

        if let edit = recipe {
            // update
            edit.name          = recipeName
            edit.servingSize   = totalGrams
            edit.carbohydrates = totalCarb
            edit.fats          = totalFat
            edit.proteins      = totalProt
            edit.ingredients   = foodsOnly
            edit.vitamins      = vitArray
            edit.minerals      = minArray
        } else {
            // create
            let new = Food(name: recipeName,
                           servingSize: totalGrams,
                           carbohydrates: totalCarb,
                           fats: totalFat,
                           proteins: totalProt,
                           isUserAdded: true,
                           vitamins: vitArray,
                           minerals: minArray,
                           ingredients: foodsOnly)
            modelContext.insert(new)
        }
        try? modelContext.save()
    }

    // ──────────────────────────────────────────────────────────
    // MARK: – Helpers
    // ──────────────────────────────────────────────────────────

    private var searchResults: [Food] {
        guard !searchText.isEmpty else { return [] }
        return ingredientFoods.filter {
            $0.name.lowercased().contains(searchText.lowercased())
        }
    }

    private var numberFormatter: NumberFormatter {
        let nf = NumberFormatter()
        nf.numberStyle = .decimal
        nf.maximumFractionDigits = 1
        return nf
    }
}
