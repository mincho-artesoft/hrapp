//
//  SelectedVitaminManager.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//


import SwiftUI

final class SelectedVitaminManager: ObservableObject {
    @Published var selectedVitamin: Vitamin? = nil
}