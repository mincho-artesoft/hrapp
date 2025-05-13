//
//  Profile.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/4/25.
//


//
//  Profile.swift
//  VitaHealth
//
//  Created by Your Name on 2/4/25.
//

import SwiftUI
import SwiftData

@Model
final class Profile {
    var name: String
    var email: String
    var birthday: Date
    var gender: String
    var meals: [Meal]
    var selections: [ProfileSelection] = [] // For food selections if needed

    /// Computed property that calculates the current age in years.
    var age: Int {
        Calendar.current.dateComponents([.year], from: birthday, to: Date()).year ?? 0
    }
    
    init(name: String, email: String, birthday: Date, gender: String, meals: [Meal] = []) {
        self.name = name
        self.email = email
        self.birthday = birthday
        self.gender = gender
        // Use the provided meals or default meals if empty.
        self.meals = meals.isEmpty ? Meal.defaultMeals() : meals
    }
}
