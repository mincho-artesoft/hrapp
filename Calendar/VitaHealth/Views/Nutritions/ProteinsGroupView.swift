import SwiftUI
import SwiftData

/// Displays the list of foods selected for proteins with a header showing the total protein amount.
struct ProteinsGroupView: View {
    var profile: Profile
    @Query private var foods: [Food]
    /// Global food selections shared by all nutrient groups.
    @Binding var foodSelections: [FoodSelection]
    
    /// Filters selections to include only those with a positive protein value.
    private var proteinSelections: [FoodSelection] {
        foodSelections.filter { $0.food.macros.proteins.total > 0 }
    }
    
    /// Computes the total proteins (in grams) from the selected foods.
    private var totalProteins: Double {
        proteinSelections.reduce(into: 0.0) { total, selection in
            total + (selection.food.macros.proteins.total / selection.food.servingSize) * selection.quantity
        }
    }
    
    var body: some View {
        NutrientDisclosureRow(order: 1, header: {
            HStack {
                Text("Proteins")
                    .font(.headline)
                    .foregroundColor(.gray)
                Spacer()
                Text("Total: \(totalProteins, specifier: "%.1f") g")
                    .font(.headline)
            }
        }, content: {
            ProductAutoComplete(
                profile: profile,
                nutrientName: "Proteins",
                nutrientUnit: "g",
                nutrientExtractor: { food in
                    // Return a Nutrient instance if this food has a protein value greater than zero.
                    food.macros.proteins.total > 0 ? Nutrient(name: "Proteins", amount: food.macros.proteins.total, unit: "g") : nil
                },
                foodSelections: $foodSelections
            )
            .padding(.vertical, 5)
        })
        .padding(.horizontal)
        .zIndex(1)
    }
}
