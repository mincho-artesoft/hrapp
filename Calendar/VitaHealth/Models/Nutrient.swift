//
//  Nutrient.swift
//  VitaHealth
//
//  Updated: 2025-05-16
//  – добавени са inverse-връзки към Food.vitamins и Food.minerals
//

import SwiftUI
import SwiftData

@Model
final class Nutrient: Identifiable, ObservableObject, Codable {

    // ────────── Полета ──────────
    var id     : UUID   = UUID()
    var name   : String
    var amount : Double
    var unit   : String

    // MARK: – Връзки към родител Food
    // • Ако нутриентът е витамин → vitaminOwner е зададен
    // • Ако е минерал          → mineralOwner е зададен
    @Relationship(inverse: \Food.vitamins)
    var vitaminOwner: Food?

    @Relationship(inverse: \Food.minerals)
    var mineralOwner: Food?

    // ────────── Init ──────────
    init(name: String, amount: Double, unit: String) {
        self.name   = name
        self.amount = amount
        self.unit   = unit
    }

    // ────────── Codable ──────────
    enum CodingKeys: String, CodingKey {
        case id, name, amount, unit
        // ⚠️ НЕ кодираме връзките – избягваме рекурсия
    }

    required init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id     = try c.decode(UUID.self,   forKey: .id)
        name   = try c.decode(String.self, forKey: .name)
        amount = try c.decode(Double.self, forKey: .amount)
        unit   = try c.decode(String.self, forKey: .unit)
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id,     forKey: .id)
        try c.encode(name,   forKey: .name)
        try c.encode(amount, forKey: .amount)
        try c.encode(unit,   forKey: .unit)
    }
}
