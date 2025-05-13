import SwiftUI
import SwiftData

struct VitaminGroupView: View {
    var profile: Profile
    var selectedDate: Date
    @Query private var vitamins: [Vitamin]
    @Binding var foodSelections: [FoodSelection]
    
//    init(profile: Profile, selectedDate: Date, foodSelections: Binding<[FoodSelection]>) {
//        self.profile = profile
//        self.selectedDate = selectedDate
//        self._foodSelections = foodSelections
//        print("VitaminGroupView initialized with \(foodSelections.wrappedValue.count) foodSelections:")
//        
//        for selection in foodSelections.wrappedValue {
//            do {
//                let jsonData = try JSONEncoder().encode(selection)
//                if let jsonString = String(data: jsonData, encoding: .utf8) {
//                    print("FoodSelection JSON: \(jsonString)")
//                }
//            } catch {
//                print("Error encoding FoodSelection with id \(selection.id): \(error)")
//            }
//        }
//    }
    
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
    
    private func requirement(for vitamin: Vitamin, on date: Date) -> Requirement? {
        let demographic = demographicForProfile(profile, on: date)
        return vitamin.requirements.first { $0.demographic == demographic }
    }
    
    private func totalIntake(for vitamin: Vitamin) -> Double {
        foodSelections.reduce(0.0) { total, selection in
            
            if let nutrient = selection.food.vitamins.first(where: { $0.name == vitamin.name }),
               nutrient.amount > 0 {
                return total + (nutrient.amount / selection.food.servingSize) * selection.quantity
            }
            return total
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Vitamins")
                .font(.title2)
                .padding(.vertical, 5)
            
            ForEach(Array(vitamins.enumerated()), id: \.offset) { index, vitamin in
                if let req = requirement(for: vitamin, on: selectedDate) {
                    let dailyNeed = req.dailyNeed
                    let upperLimit = req.upperLimit
                    let current = totalIntake(for: vitamin)
                    
                    NutrientDisclosureRow(order: index, header: {
                        VStack(alignment: .leading, spacing: 30) {
                            Text(vitamin.name)
                                .font(.headline)
                                .foregroundColor(.gray)
                            NutrientProgressBarView(
                                currentValue: current,
                                dailyNeed: dailyNeed,
                                upperLimit: upperLimit
                            )
                            .frame(height: 40)
                        }
                    }, content: {
                        ProductAutoComplete(
                            profile: profile,
                            nutrientName: vitamin.name,
                            nutrientUnit: "IU",
                            nutrientExtractor: { food in
                                food.vitamins.first { $0.name == vitamin.name }
                            },
                            foodSelections: $foodSelections
                        )
                    })
                } else {
                    Text(vitamin.name)
                        .font(.headline)
                        .foregroundColor(.gray)
                }
            }
        }
        .padding(.horizontal)
    }
}
