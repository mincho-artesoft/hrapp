import SwiftUI
import UIKit

struct CalendarColorSelectionView: View {
    @Binding var selectedColor: UIColor
    
    @State private var showSystemColorPicker = false
    
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
                ForEach(colorOptions, id: \.name) { option in
                    HStack {
                        Circle()
                            .fill(Color(option.color))
                            .frame(width: 20, height: 20)
                        Text(option.name)
                            .padding(.leading, 4)
                        Spacer()
                        if colorsAreEqual(option.color, selectedColor) {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectedColor = option.color
                    }
                }
                
                // Редът “Custom...”
                HStack {
                    Circle()
                        .fill(Color(selectedColor))
                        .frame(width: 20, height: 20)
                    Text("Custom...")
                        .padding(.leading, 4)
                    Spacer()
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
        .sheet(isPresented: $showSystemColorPicker) {
            UIKitColorPicker(selectedColor: $selectedColor)
                .presentationDetents([.fraction(0.9), .large])
                .presentationBackground(Color(.systemBackground))
                .presentationDragIndicator(.visible)
        }
    }
    
    private func colorsAreEqual(_ c1: UIColor, _ c2: UIColor) -> Bool {
        var r1: CGFloat = 0, g1: CGFloat = 0, b1: CGFloat = 0, a1: CGFloat = 0
        var r2: CGFloat = 0, g2: CGFloat = 0, b2: CGFloat = 0, a2: CGFloat = 0
        c1.getRed(&r1, green: &g1, blue: &b1, alpha: &a1)
        c2.getRed(&r2, green: &g2, blue: &b2, alpha: &a2)
        return (r1 == r2 && g1 == g2 && b1 == b2 && a1 == a2)
    }
}
