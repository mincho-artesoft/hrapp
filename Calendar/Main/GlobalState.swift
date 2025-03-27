//
//  GlobalState.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 27/3/25.
//


import Foundation

struct GlobalState {
    nonisolated(unsafe) static var email: String = "" {
        didSet {
            print("GlobalState.email changed to: \(email)")
        }
    }
}
