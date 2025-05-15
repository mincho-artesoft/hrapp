import Foundation

 struct IngredientLine: Identifiable, Hashable {
    let id = UUID()
    var food: Food
    var amount: Double          // grams
}
