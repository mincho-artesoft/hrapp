//
//  Vitamin.swift
//  VitaHealth
//
//  Created by Your Name on [Date].
//  Represents a vitamin with its nutritional requirements.
//

import SwiftUI
import SwiftData

@Model
final class Vitamin: Identifiable {
    var id: UUID = UUID()
    var name: String
    var unit: String
    var requirements: [Requirement]
    
    init(name: String, unit: String, requirements: [Requirement] = []) {
        self.name = name
        self.unit = unit
        self.requirements = requirements
    }
}
