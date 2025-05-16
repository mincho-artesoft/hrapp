//
//  FoodDetailView.swift
//  VitaHealth
//
//  Shows / edits a single food item.
//  Added: cover-image picker under the name field (2025-05-18).
//

import SwiftUI
import SwiftData
import PhotosUI          // for PhotosPicker

// ─────────────────────────────────────────────────────────────
// MARK: – FoodDetailView
// ─────────────────────────────────────────────────────────────

struct FoodDetailView: View {

    // MARK: Dependencies
    @Environment(\.dismiss)      private var dismiss
    @Environment(\.modelContext) private var modelContext

    // Sorted lists with every vitamin / mineral name
    private static let vitaminNames = defaultVitaminsList .map(\.name).sorted()
    private static let mineralNames = defaultMineralsList .map(\.name).sorted()
    private let allVitamins = Self.vitaminNames
    private let allMinerals = Self.mineralNames

    // nil → creating a brand-new Food object
    private let editingFood: Food?

    // ─────────────────────────────────────────────────────────
    // MARK: – Original values (for isModified)
    // ─────────────────────────────────────────────────────────
    private let initialFoodName : String
    private let initialServing  : Double
    private let initialCarbs    : String
    private let initialFats     : String
    private let initialProts    : String
    private let initialVit      : [String:String]
    private let initialMin      : [String:String]
    private let initialCover    : Data?

    // ─────────────────────────────────────────────────────────
    // MARK: – Form state
    // ─────────────────────────────────────────────────────────
    @State private var foodName      : String
    @State private var servingSize   : Double
    @State private var carbohydrates : String
    @State private var fats          : String
    @State private var proteins      : String
    @State private var vitaminAmounts: [String:String]
    @State private var mineralAmounts: [String:String]

    // Cover image
    @State private var coverPickerItem: PhotosPickerItem? = nil
    @State private var coverImage    : UIImage?           = nil

    // ─────────────────────────────────────────────────────────
    // MARK: – Init
    // ─────────────────────────────────────────────────────────
    init(food: Food? = nil) {
        editingFood = food

        // — basic info —
        let name    = food?.name        ?? NSLocalizedString("New Food", comment: "")
        let serving = food?.servingSize ?? 200

        func blankIfZero(_ v: Double) -> String { v == 0 ? "" : v.clean }
        let carbs = food.map { blankIfZero($0.carbohydrates) } ?? ""
        let fats  = food.map { blankIfZero($0.fats)          } ?? ""
        let prots = food.map { blankIfZero($0.proteins)      } ?? ""

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

        // — vitamins —
        var vit = [String:String]()
        for v in Self.vitaminNames {
            let amt = food?.vitamins.first(where: { $0.name == v })?.amount ?? 0
            vit[v] = amt == 0 ? "" : amt.clean
        }
        _vitaminAmounts = State(initialValue: vit)
        initialVit      = vit

        // — minerals —
        var min = [String:String]()
        for m in Self.mineralNames {
            let amt = food?.minerals.first(where: { $0.name == m })?.amount ?? 0
            min[m] = amt == 0 ? "" : amt.clean
        }
        _mineralAmounts = State(initialValue: min)
        initialMin      = min

        // — cover image —
        if let data = food?.coverImage,
           let img  = UIImage(data: data) {
            _coverImage = State(initialValue: img)
        }
        initialCover = food?.coverImage
    }

    // ─────────────────────────────────────────────────────────
    // MARK: – Helper: parse “1,5” / “1.5” → Double
    // ─────────────────────────────────────────────────────────
    private func parse(_ raw: String) -> Double {
        let t = raw.trimmingCharacters(in: .whitespaces)
        if let v = Double(t)                { return v }
        return Double(t.replacingOccurrences(of: ",", with: ".")) ?? 0
    }

    // ─────────────────────────────────────────────────────────
    // MARK: – Body
    // ─────────────────────────────────────────────────────────
    var body: some View {
        NavigationStack {
            Form {

                // — Basic info —
                Section("Food Information") {
                    LabeledField(label: "Name", text: $foodName)

                    // — Cover image picker / preview —
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Cover Image")
                            .font(.caption)
                            .foregroundColor(.secondary)

                        if let img = coverImage {
                            ZStack(alignment: .topTrailing) {
                                Image(uiImage: img)
                                    .resizable()
                                    .scaledToFill()
                                    .frame(maxWidth: .infinity, maxHeight: 200)
                                    .clipped()
                                    .cornerRadius(12)

                                Button {
                                    coverImage = nil
                                } label: {
                                    Image(systemName: "xmark.circle.fill")
                                        .font(.title2)
                                        .padding(6)
                                        .background(.ultraThinMaterial, in: Circle())
                                }
                            }
                        }

                        // За да избегнем актора-вида, изчисляваме bool извън closure
                        let hasCover = coverImage != nil

                        PhotosPicker(selection: $coverPickerItem,
                                     matching: .images,
                                     photoLibrary: .shared()) {
                            Label(hasCover ? "Change cover…" : "Select cover…",
                                  systemImage: "photo")
                        }
                    }
                    .padding(.vertical, 4)
                    // — End cover image —

                    LabeledField(label: "Serving (g)", value: $servingSize)
                    LabeledField(label: "Carbs (g)",   text: $carbohydrates)
                    LabeledField(label: "Fats (g)",    text: $fats)
                    LabeledField(label: "Proteins (g)",text: $proteins)
                }

                // — Vitamins —
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

                // — Minerals —
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
            .onChange(of: coverPickerItem) {loadCoverImage() }
        }
    }

    // ─────────────────────────────────────────────────────────
    // MARK: – Modified check
    // ─────────────────────────────────────────────────────────
    private var isModified: Bool {
        func trim(_ s: String) -> String { s.trimmingCharacters(in: .whitespaces) }
        if trim(foodName) != trim(initialFoodName)   { return true }
        if abs(servingSize - initialServing) > 0.001 { return true }
        if trim(carbohydrates) != trim(initialCarbs) { return true }
        if trim(fats)          != trim(initialFats)  { return true }
        if trim(proteins)      != trim(initialProts) { return true }
        if vitaminAmounts != initialVit              { return true }
        if mineralAmounts != initialMin              { return true }

        let currentCover = coverImage?.jpegData(compressionQuality: 0.8)
        if currentCover != initialCover             { return true }
        return false
    }

    // ─────────────────────────────────────────────────────────
    // MARK: – SAVE
    // ─────────────────────────────────────────────────────────
    private func saveFood() {
        guard !foodName.trimmingCharacters(in: .whitespaces).isEmpty else { return }

        let carbVal   = parse(carbohydrates)
        let fatVal    = parse(fats)
        let protVal   = parse(proteins)
        let coverData = coverImage?.jpegData(compressionQuality: 0.8)

        // — UPDATE —
        if let food = editingFood {
            food.name          = foodName
            food.servingSize   = servingSize
            food.carbohydrates = carbVal
            food.fats          = fatVal
            food.proteins      = protVal
            food.coverImage    = coverData

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

        // — CREATE —
        } else {
            let newFood = Food(
                name: foodName,
                servingSize: servingSize,
                carbohydrates: carbVal,
                fats: fatVal,
                proteins: protVal,
                coverImage: coverData
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

    // ─────────────────────────────────────────────────────────
    // MARK: – Helpers for nutrients
    // ─────────────────────────────────────────────────────────

    /// Creates Nutrient objects for the given food
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
            guard amt > 0 else { return nil }     // skip blanks
            let n = Nutrient(name: key, amount: amt, unit: units[key] ?? "")
            n[keyPath: ownerKeyPath] = food
            modelContext.insert(n)
            return n
        }
    }

    /// Sync existing Nutrient array with new values (add / update / remove)
    private func syncNutrients(
        in array: inout [Nutrient],
        from dict: [String:String],
        defaultList: [(name: String, unit: String)],
        ownerKeyPath: ReferenceWritableKeyPath<Nutrient, Food?>,
        food: Food
    ) {
        var units = [String:String]()
        defaultList.forEach { units[$0.name] = $0.unit }

        // 1. update existing or insert new
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

        // 2. delete blanks
        for n in array.filter({ (dict[$0.name] ?? "").isEmpty }) {
            modelContext.delete(n)
        }
        array.removeAll { (dict[$0.name] ?? "").isEmpty }
    }

    // ─────────────────────────────────────────────────────────
    // MARK: – Load cover image
    // ─────────────────────────────────────────────────────────
    private func loadCoverImage() {
        guard let item = coverPickerItem else { return }
        Task {
            if let data = try? await item.loadTransferable(type: Data.self),
               let ui   = UIImage(data: data) {
                await MainActor.run { coverImage = ui }
            }
        }
    }
}
