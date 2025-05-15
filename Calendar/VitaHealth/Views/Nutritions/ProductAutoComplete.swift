import SwiftUI
import SwiftData

// MARK: - Notification Extension

extension Notification.Name {
    /// Posted by the global tap gesture to dismiss any open auto‑complete panels.
    static let dismissAutoComplete = Notification.Name("dismissAutoComplete")
}

// MARK: - ProductAutoComplete

struct ProductAutoComplete: View {
    // MARK: - Properties

    /// The profile containing meals.
    var profile: Profile
    /// The nutrient name (e.g., "Vitamin A", "Fats", etc.)
    var nutrientName: String?
    /// The nutrient unit to display (e.g., "IU", "µg", "g")
    var nutrientUnit: String?
    /// Closure that extracts the corresponding Nutrient from a Food instance.
    var nutrientExtractor: (Food) -> Nutrient?
    /// Global binding to the list of selected food items for this nutrient group.
    @Binding var foodSelections: [FoodSelection]
    
    // MARK: - Local State

    /// The text entered by the user.
    @State private var searchText: String = ""
    /// Whether the suggestions overlay should be shown.
    @State private var showSuggestions: Bool = false
    /// The list of foods filtered by the search text for the currently selected meal.
    @State private var filteredFoods: [Food] = []
    /// Focus state for the search field.
    @FocusState private var isFieldFocused: Bool
    /// Work item used to debounce the search.
    @State private var searchDebounceWorkItem: DispatchWorkItem?
    
    /// Query to load all foods.
    @Query private var foods: [Food]
    
    /// The currently selected meal (from the picker above the search field).
    @State private var selectedMeal: Meal?
    
    // MARK: - Computed Properties

    /// Returns only the food selections whose nutrient value is > 0.
    private var validFoodSelections: [FoodSelection] {
        foodSelections.filter { selection in
            (try? isValidSelection(selection)) ?? false
        }
    }
    
    // MARK: - Body

    var body: some View {
        ZStack(alignment: .top) {
            // MARK: Global Tap Detector for Dismissing Suggestions
            if showSuggestions && isFieldFocused {
                Color.clear
                    .contentShape(Rectangle())
                    .onTapGesture {
                        dismissSuggestions()
                    }
                    .ignoresSafeArea()
            }
            
            // MARK: Main Content
            VStack(alignment: .leading, spacing: 8) {
                // Meal Picker – always displayed.
                Picker("Select Meal", selection: $selectedMeal) {
                    ForEach(profile.meals.isEmpty ? [Meal(name: "Default")] : profile.meals) { meal in
                        Text(meal.name)
                            .tag(Optional(meal))
                    }
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding(.horizontal)
                .onAppear {
                    // Default to the first meal if none is selected.
                    if selectedMeal == nil {
                        selectedMeal = profile.meals.first ?? Meal(name: "Default")
                    }
                }
                
                // Search Field.
                TextField("Search Food", text: $searchText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .focused($isFieldFocused)
                    .padding(.horizontal)
                    .padding(.top, 10)
                    .onChange(of: searchText) {
                        debounceSearch()
                    }
                    .onChange(of: isFieldFocused) { _, focused in
                        withAnimation { showSuggestions = focused }
                        if focused { updateFilteredFoods() }
                    }
                
                // Selected Foods List grouped by meal.
                ForEach(profile.meals, id: \.self) { meal in
                    let mealSelections = validFoodSelections.filter { $0.meal == meal }
                    if !mealSelections.isEmpty {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(meal.name)
                                .font(.headline)
                                .padding(.horizontal)
                            ForEach(mealSelections) { selection in
                                let calculatedValue = calculateNutrient(for: selection)
                                HStack {
                                    Text(selection.food.name)
                                        .foregroundColor(.gray)
                                        .lineLimit(1)
                                        .layoutPriority(1)
                                    Spacer(minLength: 8)
                                    if nutrientName != nil {
                                        HStack(spacing: 4) {
                                            if let calc = calculatedValue,
                                               let nutrient = nutrientExtractor(selection.food) {
                                                Text("\(calc, specifier: "%.0f")")
                                                    .foregroundColor(.secondary)
                                                Text(nutrient.unit)
                                                    .foregroundColor(.secondary)
                                            } else {
                                                Text("-")
                                                    .foregroundColor(.secondary)
                                                Text("")
                                            }
                                        }
                                        .lineLimit(1)
                                        Spacer(minLength: 8)
                                    }
                                    HStack(spacing: 4) {
                                        NumericTextField(
                                            value: Binding(
                                                get: { selection.quantity },
                                                set: { newVal in
                                                    if let index = foodSelections.firstIndex(where: { $0.id == selection.id }) {
                                                        foodSelections[index].quantity = newVal
                                                    }
                                                }
                                            ),
                                            placeholder: "Qty",
                                            maxDecimalPlaces: 0
                                        )
                                        .frame(maxWidth: 50)
                                        Text("g")
                                            .foregroundColor(.secondary)
                                    }
                                    Button(action: {
                                        if let index = foodSelections.firstIndex(where: { $0.id == selection.id }) {
                                            foodSelections.remove(at: index)
                                            updateFilteredFoods()
                                        }
                                    }) {
                                        Image(systemName: "trash")
                                    }
                                }
                                .padding(.vertical, 4)
                                .padding(.horizontal)
                            }
                        }
                    }
                }
            }
            
            // MARK: Suggestions Overlay
            if showSuggestions && isFieldFocused {
                Group {
                    if filteredFoods.isEmpty {
                        Text("No products available\(nutrientName.map { " for \($0)" } ?? "")")
                            .foregroundColor(.secondary)
                            .font(.caption)
                            .padding()
                    } else {
                        ScrollView {
                            VStack(spacing: 0) {
                                ForEach(filteredFoods, id: \.id) { food in
                                    AutoCompleteRow(
                                        food: food,
                                        nutrientExtractor: nutrientExtractor,
                                        onSelect: { addFoodSelection(for: food) }
                                    )
                                }
                            }
                        }
                        .frame(maxHeight: 150)
                    }
                }
                .background(Color.white)
                .cornerRadius(8)
                .shadow(radius: 4)
                .padding(.horizontal)
                .offset(y: 83) // Adjusted for the meal picker.
                .zIndex(10000000)
            }
        }
        // Listen for a global “dismiss” notification.
        .onReceive(NotificationCenter.default.publisher(for: .dismissAutoComplete)) { _ in
            dismissSuggestions()
        }
        .onAppear { updateFilteredFoods() }
        .onChange(of: foods) {updateFilteredFoods() }
        .onChange(of: selectedMeal) {updateFilteredFoods() }
    }
    
    // MARK: - Helper Functions
    
    /// Dismisses the suggestions overlay.
    private func dismissSuggestions() {
        searchText = ""
        isFieldFocused = false
        withAnimation { showSuggestions = false }
    }
    
    /// Checks if the given food selection has a valid nutrient amount (> 0).
    private func isValidSelection(_ selection: FoodSelection) throws -> Bool {
        guard let nutrient = nutrientExtractor(selection.food) else { return false }
        return nutrient.amount > 0
    }
    
    /// Debounces the search input so that filtering occurs only after a short delay.
    private func debounceSearch() {
        searchDebounceWorkItem?.cancel()
        let workItem = DispatchWorkItem { updateFilteredFoods() }
        searchDebounceWorkItem = workItem
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.2, execute: workItem)
    }
    
    /// Calculates the nutrient value for a given food selection.
    private func calculateNutrient(for selection: FoodSelection) -> Double? {
        guard let nutrient = nutrientExtractor(selection.food),
              selection.food.servingSize != 0 else { return nil }
        return (nutrient.amount / selection.food.servingSize) * selection.quantity
    }
    
    /// Updates the list of filtered foods based on the search text.
    ///
    /// **Fix:** Instead of comparing Food instances by their IDs, we now compare by the food's name.
    /// Additionally, duplicate foods (by name) are removed. When duplicates exist, the product with the highest
    /// nutrient amount is retained.
    private func updateFilteredFoods() {
        guard let currentMeal = selectedMeal ?? profile.meals.first else {
            filteredFoods = []
            return
        }
        
        // Exclude foods that are already selected for the current meal.
        let selectedFoodNames = Set(foodSelections.filter { $0.meal == currentMeal }.map { $0.food.name })
        let foodsAfterSelectionFilter = foods.filter { !selectedFoodNames.contains($0.name) }
        
        // Filter foods based on search text.
        let foodsAfterSearchFilter = foodsAfterSelectionFilter.filter { food in
            searchText.isEmpty || food.name.localizedCaseInsensitiveContains(searchText)
        }
        
        // Filter out foods that don't have a valid nutrient amount.
        let foodsAfterNutrientCheck = foodsAfterSearchFilter.filter { food in
            if let nutrient = nutrientExtractor(food) {
                return nutrient.amount > 0
            }
            return false
        }
        
        // Remove duplicates: group foods by name and choose the one with the highest nutrient amount.
        let uniqueFoodsDict = Dictionary(grouping: foodsAfterNutrientCheck, by: { $0.name })
        let uniqueFoods = uniqueFoodsDict.compactMap { (_, group) -> Food? in
            return group.max { (foodA, foodB) in
                (nutrientExtractor(foodA)?.amount ?? 0) < (nutrientExtractor(foodB)?.amount ?? 0)
            }
        }
        
        // Sort the unique list by descending nutrient amount.
        filteredFoods = uniqueFoods.sorted {
            (nutrientExtractor($0)?.amount ?? 0) > (nutrientExtractor($1)?.amount ?? 0)
        }
    }
    
    /// Adds a food selection if it is not already selected for the current meal.
    ///
    /// Note that we check by food name here as well to avoid duplicate selections.
    private func addFoodSelection(for food: Food) {
        let mealToUse: Meal = selectedMeal ?? (profile.meals.first ?? Meal(name: "Default"))
        if !foodSelections.contains(where: { $0.food.name == food.name && $0.meal == mealToUse }) {
            let safeServingSize = food.servingSize.isNaN ? 1.0 : food.servingSize
            foodSelections.append(FoodSelection(food: food, quantity: safeServingSize, meal: mealToUse))
        }
        searchText = ""
        isFieldFocused = false
        withAnimation { showSuggestions = false }
    }
}
