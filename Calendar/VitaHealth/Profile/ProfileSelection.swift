//
//  NutrientGroup.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/4/25.
//


//
//  ProfileSelection.swift
//  VitaHealth
//
//  Created by Your Name on 2/4/25.
//

import SwiftUI
import SwiftData

enum NutrientGroup: String, Codable, CaseIterable {
    case vitamin, mineral, carbohydrate, combined
}

@Model
final class ProfileSelection: Identifiable {
    var id: UUID = UUID()
    /// Which group is this selection for?
    var group: NutrientGroup
    /// For vitamins/minerals: which nutrient (e.g. "Vitamin A" or "Calcium"). For carbohydrates this can be nil.
    var nutrientName: String?
    /// The Food that was selected.
    var food: Food
    /// The quantity (in grams) the user entered.
    var quantity: Double
    /// The date this selection is associated with.
    var date: Date
    /// The meal name associated with this selection.
    var meal: String

    init(group: NutrientGroup, nutrientName: String?, food: Food, quantity: Double, date: Date, meal: String) {
        self.group = group
        self.nutrientName = nutrientName
        self.food = food
        self.quantity = quantity
        self.date = date
        self.meal = meal
    }
}
