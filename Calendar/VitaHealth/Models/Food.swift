//
//  Food.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//  Updated to include fats and proteins
//

import SwiftUI
import SwiftData

@Model
final class Food: Codable, Identifiable {
    var id: UUID = UUID()
    var name: String
    var servingSize: Double
    var carbohydrates: Double = 0.0  // Default value for migration compatibility
    var fats: Double = 0.0           // New property
    var proteins: Double = 0.0       // New property
    var vitamins: [Nutrient]
    var minerals: [Nutrient]
    
    init(name: String,
         servingSize: Double = 200,
         carbohydrates: Double = 0.0,
         fats: Double = 0.0,
         proteins: Double = 0.0,
         vitamins: [Nutrient] = [],
         minerals: [Nutrient] = []) {
        self.name = name
        self.servingSize = servingSize
        self.carbohydrates = carbohydrates
        self.fats = fats
        self.proteins = proteins
        self.vitamins = vitamins
        self.minerals = minerals
    }
    
    // MARK: - Codable Conformance
    
    enum CodingKeys: String, CodingKey {
        case id, name, servingSize, carbohydrates, fats, proteins, vitamins, minerals
    }
    
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id            = try container.decode(UUID.self, forKey: .id)
        name          = try container.decode(String.self, forKey: .name)
        servingSize   = try container.decode(Double.self, forKey: .servingSize)
        carbohydrates = try container.decode(Double.self, forKey: .carbohydrates)
        fats          = try container.decode(Double.self, forKey: .fats)
        proteins      = try container.decode(Double.self, forKey: .proteins)
        vitamins      = try container.decode([Nutrient].self, forKey: .vitamins)
        minerals      = try container.decode([Nutrient].self, forKey: .minerals)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encode(servingSize, forKey: .servingSize)
        try container.encode(carbohydrates, forKey: .carbohydrates)
        try container.encode(fats, forKey: .fats)
        try container.encode(proteins, forKey: .proteins)
        try container.encode(vitamins, forKey: .vitamins)
        try container.encode(minerals, forKey: .minerals)
    }
}

extension Food {
    /// Creates a persistable Food instance from a DefaultFood struct.
    static func from(defaultFood: DefaultFood) -> Food {
        let vitaminNutrients = defaultFood.vitamins.map { (name, amount) in
            Nutrient(name: name, amount: amount, unit: "IU")
        }
        let mineralNutrients = defaultFood.minerals.map { (name, amount) in
            Nutrient(name: name, amount: amount, unit: "µg")
        }
        return Food(
            name: defaultFood.name,
            servingSize: defaultFood.servingSize,
            carbohydrates: defaultFood.carbohydrates,
            fats: defaultFood.fats,         // Pass new value
            proteins: defaultFood.proteins,   // Pass new value
            vitamins: vitaminNutrients,
            minerals: mineralNutrients
        )
    }
}
