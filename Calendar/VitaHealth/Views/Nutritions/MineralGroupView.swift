import SwiftUI
import SwiftData

struct MineralGroupView: View {
    var profile: Profile
    var selectedDate: Date
    @Query private var minerals: [Mineral]
    @Binding var foodSelections: [FoodSelection]
    
    /// Computes the demographic for nutrient requirements based on the profile’s birthday.
    private func demographicForProfile(_ profile: Profile, on date: Date) -> String {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month], from: profile.birthday, to: date)
        if let years = components.year, years >= 1 {
            if years < 4 { return "Children (1-3 years)" }
            else if years < 9 { return "Children (4-8 years)" }
            else if years < 14 { return "Children (9-13 years)" }
            else if years < 19 { return "Adolescents (14-18 years)" }
            else { return profile.gender == "Female" ? "Adult Women (19+)" : "Adult Men (19+)" }
        } else {
            if let months = components.month, months <= 6 {
                return "Babies (0-6 months)"
            } else {
                return "Babies (7-12 months)"
            }
        }
    }
    
    private func requirement(for mineral: Mineral, on date: Date) -> Requirement? {
        let demographic = demographicForProfile(profile, on: date)
        return mineral.requirements.first { $0.demographic == demographic }
    }
    
    private func totalIntake(for mineral: Mineral) -> Double {
        foodSelections.reduce(0.0) { total, selection in
            if let nutrient = selection.food.minerals.first(where: { $0.name == mineral.name }),
               nutrient.amount > 0 {
                return total + (nutrient.amount / selection.food.servingSize) * selection.quantity
            }
            return total
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Minerals")
                .font(.title2)
                .padding(.vertical, 5)
            
            ForEach(Array(minerals.enumerated()), id: \.offset) { index, mineral in
                if let req = requirement(for: mineral, on: selectedDate) {
                    let dailyNeed = req.dailyNeed
                    let upperLimit = req.upperLimit
                    let current = totalIntake(for: mineral)
                    
                    NutrientDisclosureRow(order: index, header: {
                        VStack(alignment: .leading, spacing: 30) {
                            Text(mineral.name)
                                .font(.headline)
                                .foregroundColor(.gray)
                            NutrientProgressBarView(
                                currentValue: current,
                                dailyNeed: dailyNeed,
                                upperLimit: upperLimit!
                            )
                            .frame(height: 40)
                        }
                    }, content: {
                        ProductAutoComplete(
                            profile: profile,
                            nutrientName: mineral.name,
                            nutrientUnit: "µg",
                            nutrientExtractor: { food in
                                food.minerals.first { $0.name == mineral.name }
                            },
                            foodSelections: $foodSelections
                        )
                    })
                } else {
                    Text(mineral.name)
                        .font(.headline)
                        .foregroundColor(.gray)
                }
            }
        }
        .padding(.horizontal)
    }
}
