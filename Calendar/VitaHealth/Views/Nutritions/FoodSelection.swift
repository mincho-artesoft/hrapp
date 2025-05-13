//
//  FoodSelection.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/4/25.
//


import Foundation

struct FoodSelection: Codable, Identifiable {
    var id = UUID()
    var food: Food
    var quantity: Double
    var meal: Meal
}
