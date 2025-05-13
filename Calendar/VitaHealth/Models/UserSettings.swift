//
//  UserSettings.swift
//  VitaHealth
//
//  Created by Mincho Milev on 2/5/25.
//
import SwiftUI
import SwiftData

@Model
class UserSettings: ObservableObject {
    var id: UUID = UUID()
    /// The last selected profile.
    var lastSelectedProfile: Profile?
    
    init(lastSelectedProfile: Profile? = nil) {
        self.lastSelectedProfile = lastSelectedProfile
    }
}
