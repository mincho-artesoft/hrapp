//
//  Profile.swift
//  VitaHealth
//
//  Created by Your Name on 19 May 2025.
//

import SwiftUI
import SwiftData
import EventKit   // only for the calendar identifier typealias (String)

// MARK: - Profile model ✧ SwiftData @Model
@Model
final class Profile {

    // ─────────────────────────────────────────────────────────────
    //  Stored properties
    // ─────────────────────────────────────────────────────────────
    var name:   String
    var birthday: Date
    var gender: String                       // “Male”, “Female”, “Other”
    var weight: Double                       // kilograms
    var height: Double                       // centimetres

    var meals: [Meal]                        // user-defined meal slots
    var selections: [ProfileSelection] = []  // food entries per day

    /// New flags (default = false)
    var isPregnant:  Bool = false
    var isLactating: Bool = false

    /// **Link to the private calendar** created for this profile.
    /// It is the `EKCalendar.calendarIdentifier` string.
    /// • `nil` until `CalendarViewModel.createCalendar(for:)` succeeds.
    /// • Updated automatically if the calendar is renamed or deleted.
    var calendarID: String? = nil


    // ─────────────────────────────────────────────────────────────
    //  Computed properties
    // ─────────────────────────────────────────────────────────────
    /// Current age in whole years.
    var age: Int {
        Calendar.current.dateComponents([.year], from: birthday, to: Date()).year ?? 0
    }


    // ─────────────────────────────────────────────────────────────
    //  Init
    // ─────────────────────────────────────────────────────────────
    init(
        name: String,
        birthday: Date,
        gender: String,
        weight: Double,
        height: Double,
        meals: [Meal] = [],
        isPregnant: Bool = false,
        isLactating: Bool = false,
        calendarID: String? = nil
    ) {
        self.name        = name
        self.birthday    = birthday
        self.gender      = gender
        self.weight      = weight
        self.height      = height
        self.meals       = meals.isEmpty ? Meal.defaultMeals() : meals
        self.isPregnant  = isPregnant
        self.isLactating = isLactating
        self.calendarID  = calendarID
    }
}
