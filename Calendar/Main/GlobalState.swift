//
//  GlobalState.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 27/3/25.
//


import Foundation

struct GlobalState {
  
    private static let emailKey = "PrimaryEmail"          // UserDefaults ключ

    /// The user’s “primary” e-mail.
    ///
    /// • При старт се зарежда от UserDefaults (ако има запис).
    /// • При всяка промяна се записва отново в UserDefaults.
    nonisolated(unsafe) static var email: String = {
        // initial load
        UserDefaults.standard.string(forKey: emailKey) ?? ""
    }() {
        // every time someone sets GlobalState.email = …
        didSet {
            UserDefaults.standard.set(email, forKey: emailKey)
        }
    }
}
