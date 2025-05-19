//
//  RecipeEditorSheetView.swift
//  VitaHealth
//
//  Created: 2025-05-18
//  Rewritten to match FoodDetailView style (Form/Section) – 2025-05-19
//

import SwiftUI
import SwiftData
import PhotosUI      // за избор на снимки

// ─────────────────────────────────────────────────────────────
// MARK: – RecipeEditorSheetView
// ─────────────────────────────────────────────────────────────

struct RecipeEditorSheetView: View {

    // MARK: – Dependencies & inputs
    var recipe:  Food?    = nil           // при редакция
    var profile: Profile? = nil           // активен профил за RDA/UL

    @Environment(\.dismiss)      private var dismiss
    @Environment(\.modelContext) private var modelContext

    // Всички храни, които НЕ са рецепти
    @Query(sort: [SortDescriptor(\Food.name)])
    private var allFoods: [Food]
    private var ingredientFoods: [Food] { allFoods.filter { !$0.isRecipe } }

    // Списъци с всички микронутриенти
    private let allVitaminNames = defaultVitaminsList.map(\.name).sorted()
    private let allMineralNames = defaultMineralsList.map(\.name).sorted()

    // ─────────────────────────────────────────────────────────
    // MARK: – Form-state
    // ─────────────────────────────────────────────────────────
    @State private var recipeName       = ""
    @State private var recipeSubtitle   = ""
    @State private var prepTimeText     = ""                 // време на приготвяне (мин.)
    @State private var ingredients: [IngredientLine] = []
    @State private var searchText       = ""

    // Медия и инструкции
    @State private var coverPickerItem:    PhotosPickerItem?  = nil
    @State private var coverImage:         UIImage?           = nil
    @State private var galleryPickerItems: [PhotosPickerItem] = []
    @State private var galleryImages:      [UIImage]          = []
    @State private var instructionsText = ""

    // ─────────────────────────────────────────────────────────
    // MARK: – Init
    // ─────────────────────────────────────────────────────────
    init(recipe: Food? = nil, profile: Profile? = nil) {
        self.recipe  = recipe
        self.profile = profile

        _recipeName     = State(initialValue: recipe?.name ?? "")
        _recipeSubtitle = State(initialValue: recipe?.subtitle ?? "")
        _prepTimeText   = State(initialValue: {
            guard let t = recipe?.preparationTime else { return "" }
            return String(t)
        }())

        if let rec = recipe {
            // Съставки
            let lines = rec.ingredients.map { IngredientLine(food: $0, amount: 100) }
            _ingredients      = State(initialValue: lines)

            // Инструкции
            _instructionsText = State(initialValue: rec.instructions ?? "")

            // Cover
            if let d = rec.coverImage, let ui = UIImage(data: d) {
                _coverImage = State(initialValue: ui)
            }

            // Галерия
            let imgs = rec.galleryImages.compactMap(UIImage.init(data:))
            _galleryImages = State(initialValue: imgs)
        }
    }

    // ─────────────────────────────────────────────────────────
    // MARK: – Body
    // ─────────────────────────────────────────────────────────
    var body: some View {
        NavigationStack {
            Form {

                // ─ Recipe info ────────────────────────────────────────
                Section("Recipe Information") {
                    LabeledField(label: "Name",    text: $recipeName)
                    LabeledField(label: "SubName", text: $recipeSubtitle)
                    LabeledField(label: "Prep Time (min)", value: prepTimeBinding)
                }

                // ─ Cover image ───────────────────────────────────────
                Section("Cover Image") { coverImagePicker }

                // ─ Gallery images ────────────────────────────────────
                Section("Gallery") { galleryImagesView }

                // ─ Preparation instructions ─────────────────────────
                Section("Preparation") {
                           ZStack(alignment: .topLeading) {
                               //--- Placeholder ---
                               if instructionsText.isEmpty {
                                   Text("Preparation...")                     // текстът, който искаш
                                       .foregroundColor(.secondary) // светлосив цвят като на снимката
                                       .padding(.horizontal, 10)    // отместване навътре,
                                       .padding(.vertical, 16)      // за да стои както в TextEditor-а
                               }

                               //--- Самият TextEditor ---
                               TextEditor(text: $instructionsText)
                                   .frame(minHeight: 120)
                                   .padding(8) // вътрешен падинг, за да не опира текста до рамката
                                   // Ако си на iOS 16+/macOS 13+ и искаш да махнеш
                                   // фона на scroll view-то:
                                   .scrollContentBackground(.hidden)
                           }
                       }

                // ─ Ingredients: search + list ───────────────────────
                Section("Add Ingredients") { ingredientsSearchView }

                if !ingredients.isEmpty {
                    Section("Ingredients") { ingredientsListView }
                }

                // ─ Vitamins ─────────────────────────────────────────
                Section("Vitamins (IU)") {
                    ForEach(allVitaminNames, id: \.self) { name in
                        if let (need, ul, unit) = requirement(for: name, isVitamin: true) {
                            NutrientBarView(
                                title: name,
                                amount: vitaminAmounts[name, default: 0],
                                unit: unit,
                                need: need,
                                upper: ul,
                                allFoods: ingredientFoods,
                                ingredients: $ingredients,
                                isVitamin: true
                            )
                        }
                    }
                }

                // ─ Minerals ─────────────────────────────────────────
                Section("Minerals (µg)") {
                    ForEach(allMineralNames, id: \.self) { name in
                        if let (need, ul, unit) = requirement(for: name, isVitamin: false) {
                            NutrientBarView(
                                title: name,
                                amount: mineralAmounts[name, default: 0],
                                unit: unit,
                                need: need,
                                upper: ul,
                                allFoods: ingredientFoods,
                                ingredients: $ingredients,
                                isVitamin: false
                            )
                        }
                    }
                }
            }
            .navigationTitle(recipe == nil ? "Add Recipe" : "Edit Recipe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
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
            .onChange(of: coverPickerItem)    { loadCoverImage() }
            .onChange(of: galleryPickerItems) { loadGalleryImages() }
        }
    }

    // ─────────────────────────────────────────────────────────
    // MARK: – Sub-views
    // ─────────────────────────────────────────────────────────

    private var coverImagePicker: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let img = coverImage {
                ZStack(alignment: .topTrailing) {
                    Image(uiImage: img)
                        .resizable()
                        .scaledToFill()
                        .frame(maxWidth: .infinity, maxHeight: 200)
                        .clipped()
                        .cornerRadius(12)

                    Button { coverImage = nil } label: {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title2)
                            .padding(6)
                            .background(.ultraThinMaterial, in: Circle())
                    }
                }
            }

            let hasCover = coverImage != nil
            PhotosPicker(selection: $coverPickerItem,
                         matching: .images,
                         photoLibrary: .shared()) {
                Label(hasCover ? "Change cover…" : "Select cover…",
                      systemImage: "photo")
            }
        }
        .padding(.vertical, 4)
    }

    private var galleryImagesView: some View {
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
                        Image(systemName: "plus").font(.title)
                        Text("Add").font(.caption)
                    }
                    .frame(width: 120, height: 120)
                    .foregroundColor(.secondary)
                    .background(Color(.systemGray4))
                    .cornerRadius(8)
                }
            }
            .padding(.vertical, 4)
        }
    }

    private var ingredientsSearchView: some View {
        VStack(alignment: .leading, spacing: 4) {
            TextField("Search Food", text: $searchText)
                .padding(10)
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .shadow(radius: 1)

            if !searchResults.isEmpty {
                let rowHeight: CGFloat  = 44
                let visibleRows: CGFloat = 4

                ScrollView(.vertical, showsIndicators: true) {
                    VStack(spacing: 0) {
                        ForEach(searchResults, id: \.id) { food in
                            HStack {
                                Text(food.name)
                                    .lineLimit(1)
                                Spacer(minLength: 12)
                                Text("\(Int(food.servingSize)) g")
                                    .foregroundColor(.secondary)
                            }
                            .padding(.horizontal, 16)
                            .frame(height: rowHeight)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .contentShape(Rectangle())
                            .onTapGesture {
                                addIngredient(food)
                                searchText = ""
                            }

                            if food.id != searchResults.last?.id { Divider() }
                        }
                    }
                }
                .frame(maxHeight: rowHeight * visibleRows)
                .background(Color(.systemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .shadow(radius: 3)
            }
        }
        .padding(.vertical, 4)
    }

    private var ingredientsListView: some View {
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

    // ─────────────────────────────────────────────────────────
    // MARK: – Aggregation helpers
    // ─────────────────────────────────────────────────────────

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
            if let upper = req.upperLimit{
                return (req.dailyNeed, upper, vit.unit)
            }else{
                return (req.dailyNeed, -1, vit.unit)
            }
          
        }

        if !isVitamin,
           let min = defaultMineralsList.first(where: { $0.name == name }),
           let req = min.requirements.first(where: { $0.demographic == demo }) {
            if let upper = req.upperLimit{
                return (req.dailyNeed, upper, min.unit)
            }else{
                return (req.dailyNeed, -1, min.unit)
            }
        }
        return nil
    }

    private func demographicString(for profile: Profile) -> String {
        // 0. Ако е маркирана като бременна → Pregnant Women
//        if profile.selections.contains(where: { $0 == .pregnant }) {
//            return Demographic.pregnantWomen
//        }
//        // 0b. Ако е маркирана като кърмеща → Lactating Women
//        if profile.selections.contains(where: { $0 == .lactating }) {
//            return Demographic.lactatingWomen
//        }

        // 1. Бебета в месеци
        let months = Calendar.current
            .dateComponents([.month], from: profile.birthday, to: Date())
            .month ?? 0
        if months < 6 { return Demographic.babies0_6m }
        if months < 12 { return Demographic.babies7_12m }

        // 2. Деца и тийнейджъри (години)
        switch profile.age {
        case 1..<4:   return Demographic.children1_3y
        case 4..<9:   return Demographic.children4_8y
        case 9..<14:  return Demographic.children9_13y
        case 14..<19:
            return profile.gender.lowercased().hasPrefix("f")
                ? Demographic.adolescentFemales14_18y
                : Demographic.adolescentMales14_18y
        default:
            // 3. Възрастни
            let isFemale = profile.gender.lowercased().hasPrefix("f")
            if isFemale {
                return profile.age <= 50
                    ? Demographic.adultWomen19_50y
                    : Demographic.adultWomen51plusY
            } else {
                return profile.age <= 50
                    ? Demographic.adultMen19_50y
                    : Demographic.adultMen51plusY
            }
        }
    }



    // ─────────────────────────────────────────────────────────
    // MARK: – Actions
    // ─────────────────────────────────────────────────────────

    private func addIngredient(_ food: Food) {
        if let i = ingredients.firstIndex(where: { $0.food.id == food.id }) {
            ingredients[i].amount += food.servingSize
        } else {
            ingredients.append(IngredientLine(food: food, amount: food.servingSize))
        }
    }

    private func removeIngredient(_ line: IngredientLine) {
        ingredients.removeAll { $0.id == line.id }
    }

    private func saveRecipe() {

        // 1. Тегло на рецептата
        let totalGrams = ingredients.reduce(0) { $0 + $1.amount }

        // 2. Макро-нутриенти
        var totalCarb = 0.0, totalFat = 0.0, totalProt = 0.0
        for line in ingredients {
            let ratio = line.amount / line.food.servingSize
            totalCarb += line.food.carbohydrates * ratio
            totalFat  += line.food.fats          * ratio
            totalProt += line.food.proteins      * ratio
        }

        // 3. Микро-нутриенти
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

        // 4. Медия
        let coverData   = coverImage?.jpegData(compressionQuality: 0.8)
        let galleryData = galleryImages.compactMap {
            $0.jpegData(compressionQuality: 0.7)
        }

        // 5. Други
        let foodsOnly = ingredients.map(\.food)
        let prepTime  = Int(prepTimeText)   // nil ако полето е празно / невалидно

        if let edit = recipe {
            // UPDATE
            edit.name          = recipeName
            edit.subtitle      = recipeSubtitle.isEmpty ? nil : recipeSubtitle
            edit.servingSize   = totalGrams
            edit.carbohydrates = totalCarb
            edit.fats          = totalFat
            edit.proteins      = totalProt
            edit.ingredients   = foodsOnly
            edit.vitamins      = vitArray
            edit.minerals      = minArray

            edit.preparationTime = prepTime
            edit.coverImage    = coverData
            edit.galleryImages = galleryData
            edit.instructions  = instructionsText
        } else {
            // CREATE
            let new = Food(name: recipeName,
                           subtitle: recipeSubtitle.isEmpty ? nil : recipeSubtitle,
                           servingSize: totalGrams,
                           carbohydrates: totalCarb,
                           fats: totalFat,
                           proteins: totalProt,
                           isUserAdded: true,
                           preparationTime: prepTime,
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

    // ─────────────────────────────────────────────────────────
    // MARK: – Image loaders
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
                galleryPickerItems = []   // reset
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    // MARK: – Helpers
    // ─────────────────────────────────────────────────────────

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

    private var prepTimeBinding: Binding<Double> {
        Binding<Double>(
            get: { Double(prepTimeText.replacingOccurrences(of: ",", with: ".")) ?? 0 },
            set: { prepTimeText = $0 == 0 ? "" : String(Int($0)) }
        )
    }
}
