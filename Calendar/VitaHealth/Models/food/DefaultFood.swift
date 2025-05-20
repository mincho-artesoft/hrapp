import Foundation

// Трябва да имате дефинирани enum Allergen и Diet, както сте ги предоставили:
// enum Allergen: String, Codable, CaseIterable, Identifiable { ... }
// enum Diet: String, Codable, CaseIterable, Identifiable { ... }

/// Seed model shipped in the app bundle.
struct DefaultFood: Codable {
    let name: String
    let servingSize: Double
    let vitamins: [String : Double]
    let minerals: [String : Double]
    let carbohydrates: Double
    let fats: Double
    let proteins: Double
    let allergens: [Allergen]? // Вече съществува
    let diets: [Diet]?         // Вече съществува

    /// Convenience init (allergens / diets default to [])
    init(
        name: String,
        servingSize: Double,
        vitamins: [String: Double],
        minerals: [String: Double],
        carbohydrates: Double,
        fats: Double,
        proteins: Double,
        allergens: [Allergen] = [], // Стойност по подразбиране
        diets: [Diet] = []          // Стойност по подразбиране
    ) {
        self.name = name
        self.servingSize = servingSize
        self.vitamins = vitamins
        self.minerals = minerals
        self.carbohydrates = carbohydrates
        self.fats = fats
        self.proteins = proteins
        self.allergens = allergens
        self.diets = diets
    }
}


/// An array of default foods with updated macronutrient information, allergens, and diets.
/// Mineral values are in mg, vitamin values are in their respective units (µg, mg, IU).
let defaultFoodsList: [DefaultFood] = [
    DefaultFood(
        name: "Tomato",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 833, "Vitamin C": 20, "Vitamin D": 0, "Vitamin E": 0.7, "Vitamin K": 7.9,
            "Vitamin B1": 0.1, "Vitamin B2": 0.05, "Vitamin B3": 0.5, "Vitamin B5": 0.1, "Vitamin B6": 0.08,
            "Vitamin B7": 0, "Vitamin B9": 15, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 27.0, "Iron": 0.45, "Magnesium": 16.5, "Potassium": 355.5, "Sodium": 7.5, "Zinc": 0.255
        ],
        carbohydrates: 6.0, fats: 0.3, proteins: 1.3,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .lowCarb, .lowFat, .glutenFree, .dairyFree, .nutFree, .lowFodmap, .pescatarian, .keto] // Keto (в малки количества)
    ),
    DefaultFood(
        name: "Potato",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 2, "Vitamin C": 10, "Vitamin D": 0, "Vitamin E": 0.1, "Vitamin K": 2,
            "Vitamin B1": 0.05, "Vitamin B2": 0.03, "Vitamin B3": 0.3, "Vitamin B5": 0.1, "Vitamin B6": 0.2,
            "Vitamin B7": 0, "Vitamin B9": 20, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 15.0, "Iron": 1.2, "Magnesium": 34.5, "Potassium": 631.5, "Sodium": 9.0, "Zinc": 0.45
        ],
        carbohydrates: 39.0, fats: 0.2, proteins: 3.0,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .lowFat, .glutenFree, .dairyFree, .nutFree, .pescatarian] // Не е Paleo, Keto, LowCarb
    ),
    DefaultFood(
        name: "Carrot",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 8350, "Vitamin C": 3, "Vitamin D": 0, "Vitamin E": 0.66, "Vitamin K": 13,
            "Vitamin B1": 0.07, "Vitamin B2": 0.06, "Vitamin B3": 0.5, "Vitamin B5": 0.1, "Vitamin B6": 0.1,
            "Vitamin B7": 0, "Vitamin B9": 19, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 33.0, "Iron": 0.3, "Magnesium": 12.0, "Potassium": 320.0, "Sodium": 50.0, "Zinc": 0.24
        ],
        carbohydrates: 10.0, fats: 0.2, proteins: 0.9,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .lowFat, .glutenFree, .dairyFree, .nutFree, .lowFodmap, .pescatarian, .keto] // Keto (в малки количества)
    ),
    DefaultFood(
        name: "Spinach",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 2813, "Vitamin C": 28, "Vitamin D": 0, "Vitamin E": 2, "Vitamin K": 483,
            "Vitamin B1": 0.08, "Vitamin B2": 0.24, "Vitamin B3": 1, "Vitamin B5": 0.65, "Vitamin B6": 0.2,
            "Vitamin B7": 0, "Vitamin B9": 194, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 99.0, "Iron": 2.7, "Magnesium": 79.0, "Potassium": 558.0, "Sodium": 79.0, "Zinc": 0.53
        ],
        carbohydrates: 1.0, fats: 0.4, proteins: 2.9,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .keto, .lowCarb, .lowFat, .glutenFree, .dairyFree, .nutFree, .pescatarian]
    ),
    DefaultFood(
        name: "Broccoli",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 623, "Vitamin C": 89, "Vitamin D": 0, "Vitamin E": 1.5, "Vitamin K": 101.6,
            "Vitamin B1": 0.07, "Vitamin B2": 0.1, "Vitamin B3": 1.2, "Vitamin B5": 0.6, "Vitamin B6": 0.2,
            "Vitamin B7": 0, "Vitamin B9": 63, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 47.0, "Iron": 0.73, "Magnesium": 21.0, "Potassium": 316.0, "Sodium": 33.0, "Zinc": 0.41
        ],
        carbohydrates: 7.0, fats: 0.4, proteins: 2.8,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .lowCarb, .lowFat, .glutenFree, .dairyFree, .nutFree, .pescatarian, .keto] // Keto (в умерени количества)
    ),
    DefaultFood(
        name: "Apple",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 98, "Vitamin C": 8, "Vitamin D": 0, "Vitamin E": 0.2, "Vitamin K": 2,
            "Vitamin B1": 0.03, "Vitamin B2": 0.02, "Vitamin B3": 0.3, "Vitamin B5": 0.1, "Vitamin B6": 0.04,
            "Vitamin B7": 0, "Vitamin B9": 5, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 9.0, "Iron": 0.18, "Magnesium": 7.5, "Potassium": 160.5, "Sodium": 1.5, "Zinc": 0.06
        ],
        carbohydrates: 19.0, fats: 0.3, proteins: 0.5,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .lowFat, .glutenFree, .dairyFree, .nutFree, .lowFodmap, .pescatarian] // Не е Keto, LowCarb
    ),
    DefaultFood(
        name: "Banana",
        servingSize: 120,
        vitamins: [
            "Vitamin A": 76, "Vitamin C": 10, "Vitamin D": 0, "Vitamin E": 0.1, "Vitamin K": 0.5,
            "Vitamin B1": 0.04, "Vitamin B2": 0.1, "Vitamin B3": 0.8, "Vitamin B5": 0.3, "Vitamin B6": 0.4,
            "Vitamin B7": 0, "Vitamin B9": 22, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 6.0, "Iron": 0.312, "Magnesium": 32.4, "Potassium": 429.6, "Sodium": 1.2, "Zinc": 0.18
        ],
        carbohydrates: 27.4, fats: 0.3, proteins: 1.3,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .lowFat, .glutenFree, .dairyFree, .nutFree, .pescatarian] // Не е Keto, LowCarb; Високо FODMAP за някои
    ),
    DefaultFood(
        name: "Orange",
        servingSize: 130,
        vitamins: [
            "Vitamin A": 225, "Vitamin C": 70, "Vitamin D": 0, "Vitamin E": 0.2, "Vitamin K": 0,
            "Vitamin B1": 0.1, "Vitamin B2": 0.05, "Vitamin B3": 0.3, "Vitamin B5": 0.2, "Vitamin B6": 0.1,
            "Vitamin B7": 0, "Vitamin B9": 40, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 52.0, "Iron": 0.13, "Magnesium": 13.0, "Potassium": 235.0, "Sodium": 0.0, "Zinc": 0.09
        ],
        carbohydrates: 12.0, fats: 0.2, proteins: 1.0,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .lowFat, .glutenFree, .dairyFree, .nutFree, .lowFodmap, .pescatarian] // Keto (в малки количества)
    ),
    DefaultFood(
        name: "Egg",
        servingSize: 50,
        vitamins: [
            "Vitamin A": 270, "Vitamin C": 0, "Vitamin D": 41, "Vitamin E": 0.5, "Vitamin K": 0.3,
            "Vitamin B1": 0.02, "Vitamin B2": 0.2, "Vitamin B3": 0.1, "Vitamin B5": 0.7, "Vitamin B6": 0.1,
            "Vitamin B7": 10, "Vitamin B9": 25, "Vitamin B12": 0.9
        ],
        minerals: [
            "Calcium": 28.0, "Iron": 0.75, "Magnesium": 6.0, "Potassium": 6.3, "Sodium": 70.0, "Zinc": 0.6
        ],
        carbohydrates: 0.6, fats: 5.0, proteins: 6.0,
        allergens: [.eggs],
        diets: [.omnivore, .vegetarian, .pescatarian, .paleo, .keto, .lowCarb, .glutenFree, .dairyFree, .nutFree] // DairyFree (самото яйце), NutFree
    ),
    DefaultFood(
        name: "Milk",
        servingSize: 240,
        vitamins: [
            "Vitamin A": 500, "Vitamin C": 0, "Vitamin D": 115, "Vitamin E": 0.1, "Vitamin K": 0.5,
            "Vitamin B1": 0.1, "Vitamin B2": 0.4, "Vitamin B3": 1.2, "Vitamin B5": 0.9, "Vitamin B6": 0.2,
            "Vitamin B7": 0, "Vitamin B9": 50, "Vitamin B12": 1.1
        ],
        minerals: [
            "Calcium": 300.0, "Iron": 0.1, "Magnesium": 24.0, "Potassium": 350.0, "Sodium": 105.0, "Zinc": 1.0
        ],
        carbohydrates: 12.0, fats: 8.0, proteins: 8.0, // Предполага се пълномаслено мляко
        allergens: [.dairy],
        diets: [.omnivore, .vegetarian, .pescatarian, .glutenFree, .nutFree] // Не е Paleo, Keto, LowCarb, Vegan
    ),
    DefaultFood(
        name: "Avocado",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 146, "Vitamin C": 10, "Vitamin D": 0, "Vitamin E": 3.0, "Vitamin K": 30,
            "Vitamin B1": 0.07, "Vitamin B2": 0.08, "Vitamin B3": 0.2, "Vitamin B5": 0.15, "Vitamin B6": 0.3,
            "Vitamin B7": 0, "Vitamin B9": 90, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 10.0, "Iron": 0.5, "Magnesium": 15.0, "Potassium": 250.0, "Sodium": 3.0, "Zinc": 0.2
        ],
        carbohydrates: 8.5, fats: 21.0, proteins: 3.0,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .keto, .lowCarb, .glutenFree, .dairyFree, .nutFree, .pescatarian] // Високо FODMAP за някои
    ),
    DefaultFood(
        name: "Cauliflower",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 100, "Vitamin C": 60, "Vitamin D": 0, "Vitamin E": 0.5, "Vitamin K": 50,
            "Vitamin B1": 0.03, "Vitamin B2": 0.02, "Vitamin B3": 0.04, "Vitamin B5": 0.025, "Vitamin B6": 0.03,
            "Vitamin B7": 0, "Vitamin B9": 80, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 20.0, "Iron": 0.7, "Magnesium": 10.0, "Potassium": 300.0, "Sodium": 4.0, "Zinc": 0.15
        ],
        carbohydrates: 5.0, fats: 0.3, proteins: 3.0,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .keto, .lowCarb, .lowFat, .glutenFree, .dairyFree, .nutFree, .pescatarian]
    ),
    DefaultFood(
        name: "Strawberry",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 100, "Vitamin C": 60, "Vitamin D": 0, "Vitamin E": 0.2, "Vitamin K": 15,
            "Vitamin B1": 0.01, "Vitamin B2": 0.01, "Vitamin B3": 0.02, "Vitamin B5": 0.015, "Vitamin B6": 0.02,
            "Vitamin B7": 0, "Vitamin B9": 30, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 10.0, "Iron": 0.3, "Magnesium": 8.0, "Potassium": 150.0, "Sodium": 2.0, "Zinc": 0.1
        ],
        carbohydrates: 7.7, fats: 0.3, proteins: 1.0,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .lowFat, .glutenFree, .dairyFree, .nutFree, .lowFodmap, .pescatarian, .keto] // Keto (в малки количества)
    ),
    DefaultFood(
        name: "Blueberry",
        servingSize: 150,
        vitamins: [
            "Vitamin A": 50, "Vitamin C": 30, "Vitamin D": 0, "Vitamin E": 0.1, "Vitamin K": 20,
            "Vitamin B1": 0.005, "Vitamin B2": 0.005, "Vitamin B3": 0.01, "Vitamin B5": 0.008, "Vitamin B6": 0.01,
            "Vitamin B7": 0, "Vitamin B9": 15, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 8.0, "Iron": 0.2, "Magnesium": 7.0, "Potassium": 140.0, "Sodium": 1.5, "Zinc": 0.09
        ],
        carbohydrates: 14.5, fats: 0.5, proteins: 1.1,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .paleo, .lowFat, .glutenFree, .dairyFree, .nutFree, .lowFodmap, .pescatarian] // Keto (в малки количества)
    ),
    DefaultFood( // Добавям няколко примера за храни с месо/риба
        name: "Chicken Breast (Cooked)",
        servingSize: 100, // Типична порция
        vitamins: [ // Приблизителни стойности
            "Vitamin A": 13, "Vitamin C": 0, "Vitamin D": 5, "Vitamin E": 0.2, "Vitamin K": 0.3,
            "Vitamin B1": 0.07, "Vitamin B2": 0.09, "Vitamin B3": 10.0, "Vitamin B5": 1.0, "Vitamin B6": 0.6,
            "Vitamin B7": 3, "Vitamin B9": 4, "Vitamin B12": 0.4
        ],
        minerals: [ // Приблизителни стойности
            "Calcium": 15.0, "Iron": 0.7, "Magnesium": 29.0, "Potassium": 256.0, "Sodium": 70.0, "Zinc": 0.9
        ],
        carbohydrates: 0.0, fats: 3.6, proteins: 31.0,
        allergens: [],
        diets: [.omnivore, .pescatarian, .paleo, .keto, .lowCarb, .glutenFree, .dairyFree, .nutFree]
    ),
    DefaultFood(
        name: "Salmon (Cooked)",
        servingSize: 100,
        vitamins: [ // Приблизителни стойности
            "Vitamin A": 50, "Vitamin C": 0, "Vitamin D": 570, "Vitamin E": 1.1, "Vitamin K": 0.5,
            "Vitamin B1": 0.2, "Vitamin B2": 0.15, "Vitamin B3": 8.0, "Vitamin B5": 1.6, "Vitamin B6": 0.8,
            "Vitamin B7": 5, "Vitamin B9": 25, "Vitamin B12": 3.2
        ],
        minerals: [ // Приблизителни стойности
            "Calcium": 9.0, "Iron": 0.3, "Magnesium": 27.0, "Potassium": 363.0, "Sodium": 59.0, "Zinc": 0.4, "Selenium": 36.5 // µg -> добавям Селен като пример
        ],
        carbohydrates: 0.0, fats: 13.0, proteins: 20.0,
        allergens: [.fish],
        diets: [.omnivore, .pescatarian, .paleo, .keto, .lowCarb, .glutenFree, .dairyFree, .nutFree]
    ),
    DefaultFood(
        name: "Tofu (Firm)",
        servingSize: 100,
        vitamins: [ // Приблизителни стойности
            "Vitamin A": 0, "Vitamin C": 0, "Vitamin D": 0, "Vitamin E": 0.1, "Vitamin K": 3.0,
            "Vitamin B1": 0.08, "Vitamin B2": 0.05, "Vitamin B3": 0.2, "Vitamin B5": 0.06, "Vitamin B6": 0.05,
            "Vitamin B7": 0, "Vitamin B9": 20, "Vitamin B12": 0
        ],
        minerals: [ // Приблизителни стойности
            "Calcium": 350.0, "Iron": 2.7, "Magnesium": 30.0, "Potassium": 121.0, "Sodium": 7.0, "Zinc": 0.8
        ],
        carbohydrates: 1.9, fats: 4.8, proteins: 8.0,
        allergens: [.soy],
        diets: [.vegan, .vegetarian, .omnivore, .pescatarian, .lowCarb, .lowFat, .glutenFree, .dairyFree, .nutFree, .keto]
    ),
    DefaultFood(
        name: "Almonds",
        servingSize: 30, // около 1/4 чаша
        vitamins: [
            "Vitamin A": 0, "Vitamin C": 0, "Vitamin D": 0, "Vitamin E": 7.3, "Vitamin K": 0,
            "Vitamin B1": 0.06, "Vitamin B2": 0.32, "Vitamin B3": 1.0, "Vitamin B5": 0.13, "Vitamin B6": 0.04,
            "Vitamin B7": 0, "Vitamin B9": 13, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 76.0, "Iron": 1.05, "Magnesium": 77.0, "Potassium": 208.0, "Sodium": 0.3, "Zinc": 0.9
        ],
        carbohydrates: 6.1, fats: 14.2, proteins: 6.0,
        allergens: [.treeNuts], // Бадемите са ядки от дърво
        diets: [.vegan, .vegetarian, .omnivore, .pescatarian, .paleo, .keto, .lowCarb, .glutenFree, .dairyFree]
    ),
    DefaultFood(
        name: "Peanut Butter",
        servingSize: 32, // 2 супени лъжици
        vitamins: [
            "Vitamin A": 0, "Vitamin C": 0, "Vitamin D": 0, "Vitamin E": 2.9, "Vitamin K": 0.1,
            "Vitamin B1": 0.04, "Vitamin B2": 0.04, "Vitamin B3": 4.2, "Vitamin B5": 0.2, "Vitamin B6": 0.14,
            "Vitamin B7": 0, "Vitamin B9": 24, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 17.0, "Iron": 0.6, "Magnesium": 57.0, "Potassium": 180.0, "Sodium": 150.0, // Натрият може да варира много
            "Zinc": 0.9
        ],
        carbohydrates: 7.0, fats: 16.0, proteins: 7.0,
        allergens: [.peanuts], // Фъстъците са алерген
        diets: [.vegan, .vegetarian, .omnivore, .pescatarian, .keto, .lowCarb, .glutenFree, .dairyFree] // Не е Paleo (бобово)
    ),
     DefaultFood(
        name: "Olive Oil",
        servingSize: 15, // 1 супена лъжица
        vitamins: [
            "Vitamin A": 0, "Vitamin C": 0, "Vitamin D": 0, "Vitamin E": 1.9, "Vitamin K": 8.1, // Коригирана стойност за Vit K
            "Vitamin B1": 0, "Vitamin B2": 0, "Vitamin B3": 0, "Vitamin B5": 0, "Vitamin B6": 0,
            "Vitamin B7": 0, "Vitamin B9": 0, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 0.1, "Iron": 0.08, "Magnesium": 0, "Potassium": 0.1, "Sodium": 0.3, "Zinc": 0
        ],
        carbohydrates: 0.0, fats: 14.0, proteins: 0.0, // fats е 14g, не 15g за 15ml (13.5-14g тегло)
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .pescatarian, .paleo, .keto, .lowCarb, .lowFat, .glutenFree, .dairyFree, .nutFree, .lowFodmap]
    ),
    // ... продължете да добавяте и за останалите храни от оригиналния ви списък, като включите allergens и diets
    // Например:
    DefaultFood(
        name: "Mushrooms",
        servingSize: 100,
        vitamins: [
            "Vitamin A": 50, "Vitamin C": 8, "Vitamin D": 15, "Vitamin E": 0.1, "Vitamin K": 5,
            "Vitamin B1": 0.01, "Vitamin B2": 0.009, "Vitamin B3": 0.02, "Vitamin B5": 0.012, "Vitamin B6": 0.015,
            "Vitamin B7": 0, "Vitamin B9": 25, "Vitamin B12": 0
        ],
        minerals: [
            "Calcium": 3.0, "Iron": 0.2, "Magnesium": 4.0, "Potassium": 70.0, "Sodium": 0.5, "Zinc": 0.05
        ],
        carbohydrates: 3.0, fats: 0.3, proteins: 3.1,
        allergens: [],
        diets: [.vegan, .vegetarian, .omnivore, .pescatarian, .paleo, .keto, .lowCarb, .lowFat, .glutenFree, .dairyFree, .nutFree, .lowFodmap]
    ),
    DefaultFood(
        name: "Chocolate (Dark, 70-85%)", // Уточняване на типа шоколад
        servingSize: 30,
        vitamins: [ // Стойностите могат да варират
            "Vitamin A": 0, "Vitamin C": 0, "Vitamin D": 0, "Vitamin E": 0.24, "Vitamin K": 2.2,
            "Vitamin B1": 0.02, "Vitamin B2": 0.03, "Vitamin B3": 0.3, "Vitamin B5": 0.04, "Vitamin B6": 0.01,
            "Vitamin B7": 0, "Vitamin B9": 5, "Vitamin B12": 0
        ],
        minerals: [ // Стойностите могат да варират
            "Calcium": 22.0, "Iron": 3.6, "Magnesium": 69.0, "Potassium": 215.0, "Sodium": 6.0, "Zinc": 1.0
        ],
        carbohydrates: 13.0, fats: 12.0, proteins: 2.0, // Оригиналните 50g въглехидрати бяха твърде много
        allergens: [.dairy, .soy], // Често съдържа мляко и соев лецитин, дори тъмният. Проверете етикета.
        diets: [.vegetarian, .omnivore, .pescatarian, .glutenFree, .nutFree] // Може да е vegan, ако няма мляко.
    ),
    DefaultFood(
        name: "Shellfish (e.g., Shrimp, cooked)", // Пример за миди
        servingSize: 100, // Коригирана порция за сравнение
        vitamins: [ // Приблизителни стойности за скариди
            "Vitamin A": 20, "Vitamin C": 1.2, "Vitamin D": 152, "Vitamin E": 1.3, "Vitamin K": 0.2,
            "Vitamin B1": 0.03, "Vitamin B2": 0.03, "Vitamin B3": 2.6, "Vitamin B5": 0.4, "Vitamin B6": 0.1,
            "Vitamin B7": 2, "Vitamin B9": 10, "Vitamin B12": 1.7
        ],
        minerals: [ // Приблизителни стойности за скариди
            "Calcium": 64.0, "Iron": 0.5, "Magnesium": 35.0, "Potassium": 185.0, "Sodium": 200.0, // Натрият може да е висок
            "Zinc": 1.3, "Selenium": 38.0 // µg
        ],
        carbohydrates: 0.9, fats: 1.1, proteins: 20.3,
        allergens: [.shellfish],
        diets: [.omnivore, .pescatarian, .paleo, .keto, .lowCarb, .glutenFree, .dairyFree, .nutFree]
    )
]
