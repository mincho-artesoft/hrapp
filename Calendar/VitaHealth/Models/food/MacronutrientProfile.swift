//
//  MacronutrientProfile.swift
//  Cloud Calendars for Google, Microsoft and iCloud
//
//  Created by Aleksandar Svinarov on 19/5/25.
//


// MARK: – Aggregate holder
struct MacronutrientProfile: Codable {
    var carbs: Carbohydrates
    var fats:  Fats
    var proteins: Proteins

    static let empty = Self(
        carbs: Carbohydrates(total: 0),
        fats:  Fats(total: 0),
        proteins: Proteins(total: 0)
    )

    /// Quick energy estimate (kcal) – 4/4/9 formula
    var calories: Double {
        carbs.total * 4 + proteins.total * 4 + fats.total * 9
    }
}
