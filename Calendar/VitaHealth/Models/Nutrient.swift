//
//  Nutrient.swift
//  VitaHealth
//
//  Created by Your Name on [Date].
//  Represents a nutrient (vitamin or mineral) with an amount and unit.
//

import SwiftUI
import SwiftData

@Model
final class Nutrient: Identifiable, ObservableObject, Codable {
    var id: UUID = UUID()
    var name: String
    var amount: Double
    var unit: String

    // MARK: - Initialization
    init(name: String, amount: Double, unit: String) {
        self.name = name
        self.amount = amount
        self.unit = unit
    }
    
    // MARK: - Codable Conformance
    enum CodingKeys: String, CodingKey {
        case id, name, amount, unit
    }
    
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id     = try container.decode(UUID.self, forKey: .id)
        name   = try container.decode(String.self, forKey: .name)
        amount = try container.decode(Double.self, forKey: .amount)
        unit   = try container.decode(String.self, forKey: .unit)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encode(amount, forKey: .amount)
        try container.encode(unit, forKey: .unit)
    }
}
