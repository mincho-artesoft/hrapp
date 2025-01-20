//
//  CalendarColorManager.swift
//  HRApp
//
//  Created by Mincho Milev on 1/19/25.
//


import SwiftUI
import SwiftData

@MainActor
class CalendarColorManager: ObservableObject {
    // Maps employee ID -> Color
    private var colorMap: [UUID : Color] = [:]

    // Called by subviews to get a color for a given employee
    func color(for employee: Employee) -> Color {
        if let existing = colorMap[employee.id] {
            return existing
        }
        // Create random color
        let newColor = randomColor()
        colorMap[employee.id] = newColor
        return newColor
    }

    private func randomColor() -> Color {
        // Random pastel color for example
        let hue = Double.random(in: 0...1)
        let saturation = Double.random(in: 0.4...0.6)
        let brightness = Double.random(in: 0.8...1)
        return Color(hue: hue, saturation: saturation, brightness: brightness)
    }
    
    func randomInterviewColor(for candidate: Candidate) -> Color {
        // Return a random pastel color:
        let hue = Double.random(in: 0...1)
        let saturation = Double.random(in: 0.4...0.7)
        let brightness = Double.random(in: 0.8...1)
        return Color(hue: hue, saturation: saturation, brightness: brightness)
    }
}
