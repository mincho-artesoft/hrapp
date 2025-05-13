import SwiftUI
import SwiftData

/// Displays the list of foods selected for fats with a header showing the total fat amount.
struct FatsGroupView: View {
    var profile: Profile
    @Query private var foods: [Food]
    /// Global food selections shared by all nutrient groups.
    @Binding var foodSelections: [FoodSelection]
    
    /// Filters selections to include only those with a positive fat value.
    private var fatSelections: [FoodSelection] {
        foodSelections.filter { $0.food.fats > 0 }
    }
    
    /// Computes the total fats (in grams) from the selected foods.
    private var totalFats: Double {
        fatSelections.reduce(0.0) { total, selection in
            total + (selection.food.fats / selection.food.servingSize) * selection.quantity
        }
    }
    
    var body: some View {
        NutrientDisclosureRow(order: 2, header: {
            HStack {
                Text("Fats")
                    .font(.headline)
                    .foregroundColor(.gray)
                Spacer()
                Text("Total: \(totalFats, specifier: "%.1f") g")
                    .font(.headline)
            }
        }, content: {
            ProductAutoComplete(
                profile: profile,
                nutrientName: "Fats",
                nutrientUnit: "g",
                nutrientExtractor: { food in
                    // Return a Nutrient instance if this food has a fat value greater than zero.
                    food.fats > 0 ? Nutrient(name: "Fats", amount: food.fats, unit: "g") : nil
                },
                foodSelections: $foodSelections
            )
            .padding(.vertical, 5)
        })
        .padding(.horizontal)
        .zIndex(2)
    }
}
