import SwiftUI
import SwiftData

@Model
final class Profile {
    var name: String
    var birthday: Date
    var gender: String
    var weight: Double      // kg
    var height: Double      // cm
    var meals: [Meal]
    var selections: [ProfileSelection] = []

    // Нови булеви свойства със стойности по подразбиране
    var isPregnant: Bool = false
    var isLactating: Bool = false

    /// Изчислява текущата възраст в години.
    var age: Int {
        Calendar.current.dateComponents([.year], from: birthday, to: Date()).year ?? 0
    }

    init(
        name: String,
        birthday: Date,
        gender: String,
        weight: Double,
        height: Double,
        meals: [Meal] = [],
        isPregnant: Bool = false,
        isLactating: Bool = false
    ) {
        self.name = name
        self.birthday = birthday
        self.gender = gender
        self.weight = weight
        self.height = height
        self.meals = meals.isEmpty ? Meal.defaultMeals() : meals
        
        // Инициализация на нови свойства
        self.isPregnant = isPregnant
        self.isLactating = isLactating
    }
}

// При промени в схемата на модела – изтрийте старото локално хранилище или преинсталирайте приложението,
// за да избегнете сривове при зареждане на обекти със стария формат.
