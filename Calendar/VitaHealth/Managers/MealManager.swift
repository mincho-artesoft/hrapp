//
//  MealManager.swift
//  VitaHealth
//
//  Created by Your Name on 2/25/25.
//

import SwiftUI

final class MealManager: ObservableObject {
    @Published var meals: [String] = ["Breakfast", "Lunch", "Dinner"]
}