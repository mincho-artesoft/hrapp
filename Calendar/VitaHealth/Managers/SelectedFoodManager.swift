//
//  SelectedFoodManager.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//


import SwiftUI

final class SelectedFoodManager: ObservableObject {
    @Published var selectedFood: Food? = nil
}