//
//  Requirement.swift
//  VitaHealth
//
//  Created by Your Name on [Date].
//

import Foundation

/// Represents a daily nutrient requirement and its tolerable upper limit for a given demographic.
struct Requirement: Codable, Hashable, Identifiable {
    var id = UUID()
    var demographic: String
    var dailyNeed: Double
    var upperLimit: Double
}
