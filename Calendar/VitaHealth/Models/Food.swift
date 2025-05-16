//
//  Food.swift
//  VitaHealth
//
//  Updated: 2025-05-17
//
//  • many-to-many: ingredients ↔︎ usedInRecipes  (inverse само от едната страна)
//  • deleteRule: .nullify  →  даден Food може да участва в няколко рецепти
//  • coverImage, galleryImages, instructions – валидни само за рецепти
//

import SwiftUI
import SwiftData

@Model
final class Food: Codable, Identifiable {

    // MARK: – Базова информация
    var id: UUID = UUID()
    var name: String
    var subtitle: String? = nil
    var servingSize: Double                    // g
    var carbohydrates: Double = 0.0            // g
    var fats: Double = 0.0                     // g
    var proteins: Double = 0.0                 // g
    var isUserAdded: Bool = true               // true → user, false → seed

    // MARK: – Време на приготвяне (мин.) – валидно само за рецепти
    var preparationTime: Int? = nil            // ⟵ НОВО

    // MARK: – Микроелементи
    var vitamins: [Nutrient]
    var minerals: [Nutrient]

    // MARK: – Релации рецепта / ингредиент
    /// Ингредиентите, изграждащи тази рецепта
    @Relationship(deleteRule: .nullify,
                  inverse: \Food.usedInRecipes)
    var ingredients: [Food] = []

    /// Рецептите, в които този обект участва – **без макро**, за да избегнем цикъл
    var usedInRecipes: [Food] = []

    /// true, когато е рецепта (има поне един ингредиент)
    var isRecipe: Bool { !ingredients.isEmpty }

    // MARK: – Медия и инструкции (валидни за рецепти)
    var coverImage:    Data?    = nil
    var galleryImages: [Data]   = []
    var instructions:  String?  = nil   // Markdown / plain-text

    // MARK: – Init
    init(name: String,
         subtitle: String? = nil,
         servingSize: Double = 200,
         carbohydrates: Double = 0.0,
         fats: Double = 0.0,
         proteins: Double = 0.0,
         isUserAdded: Bool = true,
         preparationTime: Int? = nil,          // ⟵ НОВО
         vitamins: [Nutrient] = [],
         minerals: [Nutrient] = [],
         ingredients: [Food] = [],
         coverImage: Data? = nil,
         galleryImages: [Data] = [],
         instructions: String? = nil) {

        self.name            = name
        self.subtitle    = subtitle
        self.servingSize     = servingSize
        self.carbohydrates   = carbohydrates
        self.fats            = fats
        self.proteins        = proteins
        self.isUserAdded     = isUserAdded
        self.preparationTime = preparationTime
        self.vitamins        = vitamins
        self.minerals        = minerals
        self.ingredients     = ingredients
        self.coverImage      = coverImage
        self.galleryImages   = galleryImages
        self.instructions    = instructions
    }

    // MARK: – Codable
    private enum CodingKeys: String, CodingKey {
        case id, name, subtitle, servingSize, carbohydrates, fats, proteins,
              isUserAdded, preparationTime,
              vitamins, minerals, ingredients,
              coverImage, galleryImages, instructions
    }

    required init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)

        id              = try c.decode(UUID.self,   forKey: .id)
        name            = try c.decode(String.self, forKey: .name)
        subtitle        = try c.decodeIfPresent(String.self, forKey: .subtitle)
        servingSize     = try c.decode(Double.self, forKey: .servingSize)
        carbohydrates   = try c.decode(Double.self, forKey: .carbohydrates)
        fats            = try c.decode(Double.self, forKey: .fats)
        proteins        = try c.decode(Double.self, forKey: .proteins)
        isUserAdded     = try c.decodeIfPresent(Bool.self, forKey: .isUserAdded) ?? true
        preparationTime = try c.decodeIfPresent(Int.self,  forKey: .preparationTime) // ⟵ НОВО
        vitamins        = try c.decode([Nutrient].self, forKey: .vitamins)
        minerals        = try c.decode([Nutrient].self, forKey: .minerals)
        ingredients     = try c.decodeIfPresent([Food].self, forKey: .ingredients) ?? []
        coverImage      = try c.decodeIfPresent(Data.self, forKey: .coverImage)
        galleryImages   = try c.decodeIfPresent([Data].self, forKey: .galleryImages) ?? []
        instructions    = try c.decodeIfPresent(String.self, forKey: .instructions)
        // usedInRecipes ще бъде попълвано автоматично от SwiftData
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)

        try c.encode(id,            forKey: .id)
        try c.encode(name,          forKey: .name)
        try c.encodeIfPresent(subtitle, forKey: .subtitle)
        try c.encode(servingSize,   forKey: .servingSize)
        try c.encode(carbohydrates, forKey: .carbohydrates)
        try c.encode(fats,          forKey: .fats)
        try c.encode(proteins,      forKey: .proteins)
        try c.encode(isUserAdded,   forKey: .isUserAdded)
        try c.encodeIfPresent(preparationTime, forKey: .preparationTime) // ⟵ НОВО
        try c.encode(vitamins,      forKey: .vitamins)
        try c.encode(minerals,      forKey: .minerals)
        try c.encode(ingredients,   forKey: .ingredients)
        try c.encodeIfPresent(coverImage,    forKey: .coverImage)
        try c.encode(galleryImages,           forKey: .galleryImages)
        try c.encodeIfPresent(instructions,  forKey: .instructions)
    }
}

// MARK: – Factory за seed-нати храни
extension Food {
    static func from(defaultFood: DefaultFood) -> Food {
        let vits = defaultFood.vitamins.map {
            Nutrient(name: $0.key, amount: $0.value, unit: "IU")
        }
        let mins = defaultFood.minerals.map {
            Nutrient(name: $0.key, amount: $0.value, unit: "µg")
        }
        return Food(name:          defaultFood.name,
                    servingSize:   defaultFood.servingSize,
                    carbohydrates: defaultFood.carbohydrates,
                    fats:          defaultFood.fats,
                    proteins:      defaultFood.proteins,
                    isUserAdded:   false,
                    vitamins:      vits,
                    minerals:      mins)
    }
}
