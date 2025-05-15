import SwiftUI

struct FoodRowView: View {
    var food: Food

    // Витамини / минерали с ненулево количество – форматирани готови за UI
    private var vitaminStrings: [String] {
        food.vitamins
            .filter { $0.amount > 0 }
            .sorted { $0.name < $1.name }
            .map { "\($0.name) \($0.amount.clean) \($0.unit)" }
    }

    private var mineralStrings: [String] {
        food.minerals
            .filter { $0.amount > 0 }
            .sorted { $0.name < $1.name }
            .map { "\($0.name) \($0.amount.clean) \($0.unit)" }
    }

    var body: some View {
        HStack(alignment: .top, spacing: 12) {

            // Име + иконка „рецепта“
            HStack(spacing: 4) {
                Text(food.name)
                    .font(.headline)

                if food.isRecipe {
                    Image(systemName: "fork.knife")
                        .font(.caption)
                        .foregroundColor(.orange)
                }
            }
            .frame(minWidth: 90, alignment: .leading)

            // Детайли
            VStack(alignment: .leading, spacing: 2) {
                Text("Carbs: \(food.carbohydrates, specifier: "%.1f") g")
                Text("Fats:  \(food.fats,          specifier: "%.1f") g")
                Text("Prot:  \(food.proteins,      specifier: "%.1f") g")

                if !vitaminStrings.isEmpty {
                    Text("Vits: " + vitaminStrings.joined(separator: ", "))
                }
                if !mineralStrings.isEmpty {
                    Text("Mins: " + mineralStrings.joined(separator: ", "))
                }
            }
            .font(.caption)
            .fixedSize(horizontal: false, vertical: true) // позволява многоредово

            Spacer()

            // Serving size
            Text("\(food.servingSize, specifier: "%.0f") g")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
}
