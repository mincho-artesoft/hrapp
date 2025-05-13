import SwiftUI
import SwiftData

/// Displays the list of foods selected for carbohydrates with a header showing the total carbohydrate amount.
struct CarbohydrateGroupView: View {
    var profile: Profile
    @Query private var foods: [Food]
    /// Global food selections shared by all nutrient groups.
    @Binding var foodSelections: [FoodSelection]
    
    /// Filters selections to include only those with a positive carbohydrate value.
    private var carbSelections: [FoodSelection] {
        foodSelections.filter { $0.food.carbohydrates > 0 }
    }
    
    /// Computes the total carbohydrates (in grams) from the selected foods.
    private var totalCarbs: Double {
        carbSelections.reduce(0.0) { total, selection in
            total + (selection.food.carbohydrates / selection.food.servingSize) * selection.quantity
        }
    }
    
    var body: some View {
        NutrientDisclosureRow(order: 3, header: {
            HStack {
                Text("Carbohydrates")
                    .font(.headline)
                    .foregroundColor(.gray)
                Spacer()
                Text("Total: \(totalCarbs, specifier: "%.1f") g")
                    .font(.headline)
            }
        }, content: {
            ProductAutoComplete(
                profile: profile,
                nutrientName: "Carbohydrates",
                nutrientUnit: "g",
                nutrientExtractor: { food in
                    // Return a Nutrient instance if this food has a carbohydrate value greater than zero.
                    food.carbohydrates > 0 ? Nutrient(name: "Carbohydrates", amount: food.carbohydrates, unit: "g") : nil
                },
                foodSelections: $foodSelections
            )
            .padding(.vertical, 5)
        })
        .padding(.horizontal)
        .zIndex(3)
    }
}
