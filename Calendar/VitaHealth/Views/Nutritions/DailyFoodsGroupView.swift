import SwiftUI
import SwiftData

/// Displays the list of foods selected for carbohydrates with a header showing the total carbohydrate amount.
struct DailyFoodsGroupView: View {
    var profile: Profile
    @Query private var foods: [Food]
    /// Global food selections shared by all nutrient groups.
    @Binding var foodSelections: [FoodSelection]
    
    /// Filters selections to include only those with a positive carbohydrate value.
    private var servSelections: [FoodSelection] {
        foodSelections.filter { $0.food.servingSize > 0 }
    }
    
    var body: some View {
//        NutrientDisclosureRow(order: 3, header: {
        VStack {
            Text("Daily Planer")
                .font(.headline)
                .foregroundColor(.gray)
            Spacer()
            ProductAutoComplete(
                profile: profile,
                nutrientName: nil,
                nutrientUnit: nil,
                nutrientExtractor: { food in
                    // Return a Nutrient instance if this food has a carbohydrate value greater than zero.
                    food.servingSize > 0 ? Nutrient(name: "ServingSize", amount: food.servingSize, unit: "g") : nil
                },
                foodSelections: $foodSelections
            )
            //            .padding(.vertical, 5)
            //        })
        }
//        .padding(.horizontal)
        .zIndex(6)
    }
}
