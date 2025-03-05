//
//  CalendarColorSelectionView.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 5/3/25.
//


import SwiftUI
import UIKit

struct CalendarColorSelectionView: View {
    /// Тук държим избрания цвят, идва от AddCalendarView чрез @Binding
    @Binding var selectedColor: UIColor
    
    /// Показваме ли системния color picker
    @State private var showSystemColorPicker = false
    
    /// Списък с “готови” цветове и техните имена
    private let colorOptions: [(name: String, color: UIColor)] = [
        ("Red",    .systemRed),
        ("Orange", .systemOrange),
        ("Yellow", .systemYellow),
        ("Green",  .systemGreen),
        ("Blue",   .systemBlue),
        ("Purple", .systemPurple),
        ("Brown",  .brown)
    ]
    
    var body: some View {
        List {
            Section {
                // 1) Списък с готови цветове
                ForEach(colorOptions, id: \.name) { option in
                    HStack {
                        Circle()
                            .fill(Color(option.color))
                            .frame(width: 20, height: 20)
                        Text(option.name)
                            .padding(.leading, 4)
                        Spacer()
                        // Чекмарка, ако този цвят е избран
                        if colorsAreEqual(option.color, selectedColor) {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                    .contentShape(Rectangle()) // за да се клика целия ред
                    .onTapGesture {
                        selectedColor = option.color
                    }
                }
                
                // 2) Редът “Custom...”
                HStack {
                    Circle()
                        .fill(Color(selectedColor))
                        .frame(width: 20, height: 20)
                    
                    Text("Custom...")
                        .padding(.leading, 4)
                    
                    Spacer()
                    // Ако текущият selectedColor НЕ съвпада с никой от горните,
                    // тогава маркираме, че е “Custom”.
                    if !colorOptions.contains(where: { colorsAreEqual($0.color, selectedColor) }) {
                        Image(systemName: "checkmark")
                            .foregroundColor(.blue)
                    }
                }
                .contentShape(Rectangle())
                .onTapGesture {
                    showSystemColorPicker = true
                }
            }
        }
        .navigationTitle("Calendar Color")
        
        // >>> ТУК ползваме .sheet, но с iOS 16 модификатори <<<
        .sheet(isPresented: $showSystemColorPicker) {
            UIKitColorPicker(selectedColor: $selectedColor)
                .presentationDetents([.fraction(0.9), .large])
                .presentationBackground(Color(.systemBackground))
                .presentationDragIndicator(.visible)
        }

    }
    
    /// Помощна функция за сравнение на два UIColor
    private func colorsAreEqual(_ c1: UIColor, _ c2: UIColor) -> Bool {
        var r1: CGFloat = 0, g1: CGFloat = 0, b1: CGFloat = 0, a1: CGFloat = 0
        var r2: CGFloat = 0, g2: CGFloat = 0, b2: CGFloat = 0, a2: CGFloat = 0
        c1.getRed(&r1, green: &g1, blue: &b1, alpha: &a1)
        c2.getRed(&r2, green: &g2, blue: &b2, alpha: &a2)
        return r1 == r2 && g1 == g2 && b1 == b2 && a1 == a2
    }
}

