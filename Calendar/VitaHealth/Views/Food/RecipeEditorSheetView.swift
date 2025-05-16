//
//  RecipeEditorSheetView.swift
//  VitaHealth
//
//  Create / edit a recipe with live vitamin & mineral bars
//  + cover image, gallery images, preparation time & instructions
//
//  Updated: 2025-05-17
//

import SwiftUI
import SwiftData
import PhotosUI      // за избор на снимки

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

    // Form state – базови полета
    @State private var recipeName    = ""
    @State private var prepTimeText  = ""              // ← време на приготвяне (мин.)
    @State private var ingredients: [IngredientLine] = []
    @State private var searchText    = ""

    // Медия и инструкции
    @State private var coverPickerItem: PhotosPickerItem? = nil
    @State private var coverImage:     UIImage?           = nil

    @State private var galleryPickerItems: [PhotosPickerItem] = []
    @State private var galleryImages:      [UIImage]          = []

    @State private var instructionsText = ""

    // ────────── Init
    init(recipe: Food? = nil, profile: Profile? = nil) {
        self.recipe  = recipe
        self.profile = profile

        _recipeName = State(initialValue: recipe?.name ?? "")
        _prepTimeText = State(initialValue: {              // ← NEW
            if let t = recipe?.preparationTime { return String(t) }
            return ""
        }())

        if let rec = recipe {
            // съществуващи съставки
            let lines = rec.ingredients.map { IngredientLine(food: $0, amount: 100) }
            _ingredients = State(initialValue: lines)

            // инструкции
            _instructionsText = State(initialValue: rec.instructions ?? "")

            // cover image
            if let d = rec.coverImage, let ui = UIImage(data: d) {
                _coverImage = State(initialValue: ui)
            }
            // gallery
            let imgs = rec.galleryImages.compactMap { UIImage(data: $0) }
            _galleryImages = State(initialValue: imgs)
        }
    }

    // ────────── View
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {

                    // ─ Name & prep time ------------------------------------
                    nameSection
                    prepTimeSection

                    // ─ Cover image ----------------------------------------
                    coverSection

                    // ─ Gallery images -------------------------------------
                    gallerySection

                    // ─ Instructions ---------------------------------------
                    instructionsSection

                    // ─ Search + add ---------------------------------------
                    searchSection

                    // ─ Ingredients list -----------------------------------
                    ingredientsSection

                    // ─ Vitamins & Minerals --------------------------------
                    vitaminsSection
                    mineralsSection
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
            .onChange(of: coverPickerItem) {loadCoverImage() }
            .onChange(of: galleryPickerItems) {loadGalleryImages() }
        }
    }

    // ──────────────────────────────────────────────────────────
    // MARK: – UI sections
    // ──────────────────────────────────────────────────────────

    // Name
    private var nameSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Recipe")
                .font(.caption)
                .foregroundColor(.secondary)
            TextField("Name", text: $recipeName)
                .textFieldStyle(.roundedBorder)
        }
    }

    // Preparation time (optional)
    private var prepTimeSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Prep Time (min)")
                .font(.caption)
                .foregroundColor(.secondary)
            TextField("e.g. 45", text: $prepTimeText)
                .keyboardType(.numberPad)
                .textFieldStyle(.roundedBorder)
        }
    }

    // Cover image
    private var coverSection: some View {
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
    }

    // Gallery images
    private var gallerySection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Gallery")
                .font(.caption)
                .foregroundColor(.secondary)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(galleryImages.indices, id: \.self) { idx in
                        ZStack(alignment: .topTrailing) {
                            Image(uiImage: galleryImages[idx])
                                .resizable()
                                .scaledToFill()
                                .frame(width: 120, height: 120)
                                .clipped()
                                .cornerRadius(8)

                            Button {
                                galleryImages.remove(at: idx)
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .font(.body)
                                    .padding(4)
                                    .background(.ultraThinMaterial, in: Circle())
                            }
                        }
                    }
                    PhotosPicker(selection: $galleryPickerItems,
                                 maxSelectionCount: 5,
                                 matching: .images,
                                 photoLibrary: .shared()) {
                        VStack {
                            Image(systemName: "plus")
                                .font(.title)
                            Text("Add")
                                .font(.caption)
                        }
                        .frame(width: 120, height: 120)
                        .foregroundColor(.secondary)
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(8)
                    }
                }
            }
        }
    }

    // Instructions
    private var instructionsSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Preparation")
                .font(.caption)
                .foregroundColor(.secondary)

            TextEditor(text: $instructionsText)
                .frame(minHeight: 120)
                .padding(8)
                .background(Color(.secondarySystemBackground))
                .cornerRadius(8)
        }
    }

    // — Search field + drop-down (4 видими реда, под полето) —
    private var searchSection: some View {
        VStack(alignment: .leading, spacing: 0) {

            // 1. Search field
            TextField("Search Food", text: $searchText)
                .padding(10)
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .shadow(radius: 1)

            // 2. Dropdown list (only if there are results)
            if !searchResults.isEmpty {

                let rowHeight: CGFloat  = 44
                let visibleRows: CGFloat = 4

                ScrollView(.vertical, showsIndicators: true) {
                    VStack(spacing: 0) {
                        ForEach(searchResults, id: \.id) { food in
                            HStack {
                                Text(food.name)
                                    .lineLimit(1)
                                    .truncationMode(.tail)

                                Spacer(minLength: 12)

                                Text("\(Int(food.servingSize)) g")
                                    .foregroundColor(.secondary)
                            }
                            .padding(.horizontal, 16)
                            .frame(height: rowHeight)
                            .frame(maxWidth: .infinity, alignment: .leading) // full-width tap
                            .contentShape(Rectangle())                       // tap area = whole row
                            .onTapGesture {
                                addIngredient(food)
                                searchText = ""          // clear field, keep panel open
                            }

                            if food.id != searchResults.last?.id { Divider() }
                        }
                    }
                }
                .frame(maxHeight: rowHeight * visibleRows)
                .background(Color(.systemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .shadow(radius: 3)
                .padding(.top, 4)
            }
        }
        .zIndex(1)   // keeps dropdown above Vitamins section
    }




    // Ingredients list
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

    // Vitamins section
    private var vitaminsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
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
                                    upper: ul,
                                    allFoods: ingredientFoods,
                                    ingredients: $ingredients,   // <─ NEW binding
                                    isVitamin: true)
                }
            }
        }
    }

    // Minerals section  (аналогично)
    private var mineralsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
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
                                    upper: ul,
                                    allFoods: ingredientFoods,
                                    ingredients: $ingredients,   // <─ NEW binding
                                    isVitamin: false)
                }
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
            ingredients[i].amount += food.servingSize
        } else {
            ingredients.append(IngredientLine(food: food, amount: food.servingSize))
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

        // превръщаме UIImage → Data
        let coverData   = coverImage?.jpegData(compressionQuality: 0.8)
        let galleryData = galleryImages.compactMap { $0.jpegData(compressionQuality: 0.7) }

        let foodsOnly = ingredients.map(\.food)
        let prepTime  = Int(prepTimeText)            // ← NEW (nil, ако текстът е празен/невалиден)

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

            edit.preparationTime = prepTime          // ← NEW
            edit.coverImage    = coverData
            edit.galleryImages = galleryData
            edit.instructions  = instructionsText
        } else {
            // create
            let new = Food(name: recipeName,
                           servingSize: totalGrams,
                           carbohydrates: totalCarb,
                           fats: totalFat,
                           proteins: totalProt,
                           isUserAdded: true,
                           preparationTime: prepTime,      // ← NEW
                           vitamins: vitArray,
                           minerals: minArray,
                           ingredients: foodsOnly,
                           coverImage: coverData,
                           galleryImages: galleryData,
                           instructions: instructionsText)
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

    // Загрузка снимки от PhotosPickerItem → UIImage
    private func loadCoverImage() {
        guard let item = coverPickerItem else { return }
        Task {
            if let data = try? await item.loadTransferable(type: Data.self),
               let ui = UIImage(data: data) {
                await MainActor.run { coverImage = ui }
            }
        }
    }

    private func loadGalleryImages() {
        Task {
            var newImgs: [UIImage] = []
            for item in galleryPickerItems {
                if let data = try? await item.loadTransferable(type: Data.self),
                   let ui = UIImage(data: data) {
                    newImgs.append(ui)
                }
            }
            await MainActor.run {
                galleryImages.append(contentsOf: newImgs)
                galleryPickerItems = []     // reset
            }
        }
    }
}
