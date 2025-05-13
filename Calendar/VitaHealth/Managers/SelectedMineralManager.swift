//
//  SelectedMineralManager.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/3/25.
//


import SwiftUI

final class SelectedMineralManager: ObservableObject {
    @Published var selectedMineral: Mineral? = nil
}