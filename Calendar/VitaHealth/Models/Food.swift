//
//  Food.swift
//  VitaHealth
//
//  Updated: 2025-05-15
//  • Добавени: ingredients (рецептни компоненти) + isRecipe
//

import SwiftUI
import SwiftData

@Model
final class Food: Codable, Identifiable {

    // MARK: – Базова информация
    var id: UUID = UUID()
    var name: String
    var servingSize: Double                    // g
    var carbohydrates: Double = 0.0            // g
    var fats: Double = 0.0                     // g
    var proteins: Double = 0.0                 // g

    /// true → създадено от потребителя, false → seed-нато
    var isUserAdded: Bool = true

    // MARK: – Микроелементи
    var vitamins: [Nutrient]
    var minerals: [Nutrient]

    // MARK: – Рецепта (опционално)
    /// Ако списъкът не е празен, обектът се счита за рецепта.
    var ingredients: [Food] = []

    /// Удобно свойство – връща *true*, когато това `Food` е рецепта
    var isRecipe: Bool { !ingredients.isEmpty }

    // MARK: – Init
    init(name: String,
         servingSize: Double = 200,
         carbohydrates: Double = 0.0,
         fats: Double = 0.0,
         proteins: Double = 0.0,
         isUserAdded: Bool = true,
         vitamins: [Nutrient] = [],
         minerals: [Nutrient] = [],
         ingredients: [Food] = []) {

        self.name          = name
        self.servingSize   = servingSize
        self.carbohydrates = carbohydrates
        self.fats          = fats
        self.proteins      = proteins
        self.isUserAdded   = isUserAdded
        self.vitamins      = vitamins
        self.minerals      = minerals
        self.ingredients   = ingredients
    }

    // MARK: – Codable
    enum CodingKeys: String, CodingKey {
        case id, name, servingSize, carbohydrates, fats, proteins,
             isUserAdded, vitamins, minerals, ingredients
    }

    required init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id            = try c.decode(UUID.self,   forKey: .id)
        name          = try c.decode(String.self, forKey: .name)
        servingSize   = try c.decode(Double.self, forKey: .servingSize)
        carbohydrates = try c.decode(Double.self, forKey: .carbohydrates)
        fats          = try c.decode(Double.self, forKey: .fats)
        proteins      = try c.decode(Double.self, forKey: .proteins)
        isUserAdded   = try c.decodeIfPresent(Bool.self, forKey: .isUserAdded) ?? true
        vitamins      = try c.decode([Nutrient].self, forKey: .vitamins)
        minerals      = try c.decode([Nutrient].self, forKey: .minerals)
        ingredients   = try c.decodeIfPresent([Food].self, forKey: .ingredients) ?? []
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id,            forKey: .id)
        try c.encode(name,          forKey: .name)
        try c.encode(servingSize,   forKey: .servingSize)
        try c.encode(carbohydrates, forKey: .carbohydrates)
        try c.encode(fats,          forKey: .fats)
        try c.encode(proteins,      forKey: .proteins)
        try c.encode(isUserAdded,   forKey: .isUserAdded)
        try c.encode(vitamins,      forKey: .vitamins)
        try c.encode(minerals,      forKey: .minerals)
        try c.encode(ingredients,   forKey: .ingredients)
    }
}

// MARK: – Factory за seed-нати храни
extension Food {
    /// Създава `Food` от `DefaultFood`; маркира го като seed-нато (isUserAdded = false)
    static func from(defaultFood: DefaultFood) -> Food {
        let vits = defaultFood.vitamins.map { Nutrient(name: $0.key, amount: $0.value, unit: "IU") }
        let mins = defaultFood.minerals.map { Nutrient(name: $0.key, amount: $0.value, unit: "µg") }
        return Food(
            name: defaultFood.name,
            servingSize: defaultFood.servingSize,
            carbohydrates: defaultFood.carbohydrates,
            fats: defaultFood.fats,
            proteins: defaultFood.proteins,
            isUserAdded: false,
            vitamins: vits,
            minerals: mins,
            ingredients: []              // ← важно за seed-нати: не са рецепти
        )
    }
}
