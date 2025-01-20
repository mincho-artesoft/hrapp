//
//  AuthenticationService.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//


import SwiftUI

final class AuthenticationService: ObservableObject {
    @Published var isAuthenticated: Bool = false
    @Published var currentUserRole: String? = nil // e.g. "Admin", "Manager", "Employee"

    func signIn(email: String, password: String) {
        // TODO: Replace with real authentication if needed
        isAuthenticated = true
        currentUserRole = "Admin"
    }

    func signOut() {
        isAuthenticated = false
        currentUserRole = nil
    }
}
