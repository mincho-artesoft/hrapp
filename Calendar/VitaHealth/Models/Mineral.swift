//
//  Mineral.swift
//  VitaHealth
//
//  Created by Your Name on [Date].
//  Represents a mineral with its nutritional requirements.
//

import SwiftUI
import SwiftData

@Model
final class Mineral: Identifiable {
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
