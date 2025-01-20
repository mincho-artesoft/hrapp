//
//  ContentView.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//


import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var authService: AuthenticationService

    var body: some View {
        Group {
            if authService.isAuthenticated {
                MainTabView()
            } else {
                SignInView()
            }
        }
    }
}
