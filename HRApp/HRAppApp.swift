//
//  HRAppApp.swift
//  HRApp
//
//  Created by Mincho Milev on 1/18/25.
//

import SwiftUI
import SwiftData

@main
struct HRAppApp: App {
    @StateObject private var persistenceController = PersistenceController.shared
    @StateObject private var authService = AuthenticationService()

    var body: some Scene {
            WindowGroup {
                ContentView()
                    // Inject the SwiftData model context
//                    .environment(\.modelContext, persistenceController.container.mainContext)
                    // Inject the authentication service for global access
                    .environmentObject(authService)
            }
            .modelContainer(PersistenceController.shared.container)
        }
}
