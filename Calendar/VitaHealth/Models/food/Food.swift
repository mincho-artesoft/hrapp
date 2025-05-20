//
//  Food.swift
//  VitaHealth
//

import SwiftUI
import SwiftData

@Model
final class Food: Codable, Identifiable {
    // MARK: – Basic
    var id: UUID = UUID()
    var name: String
    var subtitle: String?
    var servingSize: Double            // g
    var macros: MacronutrientProfile
    var isUserAdded: Bool = true       // false → seeded

    // MARK: – Recipe specific
    var preparationTime: Int?
    @Relationship(deleteRule: .nullify, inverse: \Food.usedInRecipes)
    var ingredients: [Food] = []
    var usedInRecipes: [Food] = []
    var isRecipe: Bool { !ingredients.isEmpty }

    // MARK: – Micronutrients
    var vitamins: [Nutrient]
    var minerals: [Nutrient]

    // MARK: – Allergens & Diet tags
    var allergens: [Allergen]
    var diets: [Diet]

    // MARK: – Media
    var coverImage: Data?
    var galleryImages: [Data]
    var instructions: String?

    // MARK: – Init
    init(
        name: String,
        subtitle: String? = nil,
        servingSize: Double,
        macros: MacronutrientProfile? = MacronutrientProfile(
            carbs:    Carbohydrates(total: 0),
            fats:     Fats(total: 0),
            proteins: Proteins(total: 0)
        ),
        isUserAdded: Bool = true,
        preparationTime: Int? = nil,
        vitamins: [Nutrient] = [],
        minerals: [Nutrient] = [],
        allergens: [Allergen] = [],
        diets: [Diet] = [],
        ingredients: [Food] = [],
        coverImage: Data? = nil,
        galleryImages: [Data] = [],
        instructions: String? = nil
    ) {
        self.name = name
        self.subtitle = subtitle
        self.servingSize = servingSize
        self.macros = macros!
        self.isUserAdded = isUserAdded
        self.preparationTime = preparationTime
        self.vitamins = vitamins
        self.minerals = minerals
        self.allergens = allergens
        self.diets = diets
        self.ingredients = ingredients
        self.coverImage = coverImage
        self.galleryImages = galleryImages
        self.instructions = instructions
    }

    // MARK: – Codable
    private enum K: String, CodingKey {
        case id, name, subtitle, servingSize, macros, isUserAdded, preparationTime,
             vitamins, minerals, allergens, diets, ingredients,
             coverImage, galleryImages, instructions
    }

    required init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: K.self)
        id              = try c.decode(UUID.self,   forKey: .id)
        name            = try c.decode(String.self, forKey: .name)
        subtitle        = try c.decodeIfPresent(String.self, forKey: .subtitle)
        servingSize     = try c.decode(Double.self, forKey: .servingSize)
        macros          = try c.decode(MacronutrientProfile.self, forKey: .macros)
        isUserAdded     = try c.decodeIfPresent(Bool.self,  forKey: .isUserAdded) ?? true
        preparationTime = try c.decodeIfPresent(Int.self,   forKey: .preparationTime)
        vitamins        = try c.decode([Nutrient].self,     forKey: .vitamins)
        minerals        = try c.decode([Nutrient].self,     forKey: .minerals)
        allergens       = try c.decodeIfPresent([Allergen].self, forKey: .allergens) ?? []
        diets           = try c.decodeIfPresent([Diet].self,      forKey: .diets)     ?? []
        ingredients     = try c.decodeIfPresent([Food].self,      forKey: .ingredients) ?? []
        coverImage      = try c.decodeIfPresent(Data.self,  forKey: .coverImage)
        galleryImages   = try c.decodeIfPresent([Data].self,forKey: .galleryImages) ?? []
        instructions    = try c.decodeIfPresent(String.self,forKey: .instructions)
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: K.self)
        try c.encode(id,          forKey: .id)
        try c.encode(name,        forKey: .name)
        try c.encodeIfPresent(subtitle,       forKey: .subtitle)
        try c.encode(servingSize,            forKey: .servingSize)
        try c.encode(macros,                 forKey: .macros)
        try c.encode(isUserAdded,            forKey: .isUserAdded)
        try c.encodeIfPresent(preparationTime, forKey: .preparationTime)
        try c.encode(vitamins,               forKey: .vitamins)
        try c.encode(minerals,               forKey: .minerals)
        try c.encode(allergens,              forKey: .allergens)
        try c.encode(diets,                  forKey: .diets)
        try c.encode(ingredients,            forKey: .ingredients)
        try c.encodeIfPresent(coverImage,    forKey: .coverImage)
        try c.encode(galleryImages,          forKey: .galleryImages)
        try c.encodeIfPresent(instructions,  forKey: .instructions)
    }
}

// MARK: – Factory for seeded foods
extension Food {
    static func from(defaultFood d: DefaultFood) -> Food {
        let vits = d.vitamins.map { Nutrient(name: $0.key, amount: $0.value, unit: "IU") }
        let mins = d.minerals.map { Nutrient(name: $0.key, amount: $0.value, unit: "µg") }

        let macros = MacronutrientProfile(
            carbs:    Carbohydrates(total: d.carbohydrates),
            fats:     Fats(total: d.fats),
            proteins: Proteins(total: d.proteins)
        )

        return Food(
            name: d.name,
            servingSize: d.servingSize,
            macros: macros,
            isUserAdded: false,
            vitamins: vits,
            minerals: mins,
            allergens: d.allergens ?? [],
            diets: d.diets ?? []
        )
    }
}
