import SwiftUI
import UIKit

struct CalendarColorSelectionView: View {
    @Binding var selectedColor: UIColor

    private let defaultColor: UIColor?
    private let usesDefault: Binding<Bool>?
    
    @State private var showSystemColorPicker = false
    
    // Заменяме name: String с name: LocalizedStringKey,
    // ако предпочитате да ползвате директно ключовете.
    // Обаче в този пример ще го направим, като при извикване
    // на Text(LocalizedStringKey(option.name)), да конвертираме String -> LocalizedStringKey.
    private let colorOptions: [(name: String, color: UIColor)] = [
        ("Red",    .systemRed),
        ("Orange", .systemOrange),
        ("Yellow", .systemYellow),
        ("Green",  .systemGreen),
        ("Blue",   .systemBlue),
        ("Purple", .systemPurple),
        ("Brown",  .brown)
    ]

    init(selectedColor: Binding<UIColor>) {
        _selectedColor = selectedColor
        defaultColor = nil
        usesDefault = nil
    }

    init(
        selectedColor: Binding<UIColor>,
        defaultColor: UIColor,
        usesDefault: Binding<Bool>
    ) {
        _selectedColor = selectedColor
        self.defaultColor = defaultColor
        self.usesDefault = usesDefault
    }
    
    var body: some View {
        List {
            Section {
                if let defaultColor, let usesDefault {
                    HStack {
                        Circle()
                            .fill(Color(defaultColor))
                            .frame(width: 20, height: 20)
                        Text("Default from creator")
                            .padding(.leading, 4)
                        Spacer()
                        if usesDefault.wrappedValue {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectedColor = defaultColor
                        usesDefault.wrappedValue = true
                    }
                }

                ForEach(colorOptions, id: \.name) { option in
                    HStack {
                        Circle()
                            .fill(Color(option.color))
                            .frame(width: 20, height: 20)
                        // Ползваме LocalizedStringKey, за да се чете преводът от Localizable.strings
                        Text(LocalizedStringKey(option.name))
                            .padding(.leading, 4)
                        Spacer()
                        if usesDefault?.wrappedValue != true
                            && colorsAreEqual(option.color, selectedColor) {
                            Image(systemName: "checkmark")
                                .foregroundColor(.blue)
                        }
                    }
                    .contentShape(Rectangle())
                    .onTapGesture {
                        selectedColor = option.color
                        usesDefault?.wrappedValue = false
                    }
                }
                
                // Редът “Custom...”
                HStack {
                    Circle()
                        .fill(Color(selectedColor))
                        .frame(width: 20, height: 20)
                    Text(LocalizedStringKey("Custom..."))
                        .padding(.leading, 4)
                    Spacer()
                    // Ако текущият цвят не е в списъка (Red, Orange, …, Brown), показваме checkmark при “Custom...”
                    if usesDefault?.wrappedValue != true
                        && !colorOptions.contains(where: {
                            colorsAreEqual($0.color, selectedColor)
                        }) {
                        Image(systemName: "checkmark")
                            .foregroundColor(.blue)
                    }
                }
                .contentShape(Rectangle())
                .onTapGesture {
                    usesDefault?.wrappedValue = false
                    showSystemColorPicker = true
                }
            }
        }
        // Заглавието на NavigationBar също го правим локализирано
        .navigationTitle(LocalizedStringKey("Calendar Color"))
        .sheet(isPresented: $showSystemColorPicker) {
            UIKitColorPicker(selectedColor: customColorBinding)
                .presentationDetents([.fraction(0.9), .large])
                .presentationBackground(Color(.systemBackground))
                .presentationDragIndicator(.visible)
        }
    }

    private var customColorBinding: Binding<UIColor> {
        Binding(
            get: { selectedColor },
            set: { color in
                selectedColor = color
                usesDefault?.wrappedValue = false
            }
        )
    }
    
    private func colorsAreEqual(_ c1: UIColor, _ c2: UIColor) -> Bool {
        var r1: CGFloat = 0, g1: CGFloat = 0, b1: CGFloat = 0, a1: CGFloat = 0
        var r2: CGFloat = 0, g2: CGFloat = 0, b2: CGFloat = 0, a2: CGFloat = 0
        c1.getRed(&r1, green: &g1, blue: &b1, alpha: &a1)
        c2.getRed(&r2, green: &g2, blue: &b2, alpha: &a2)
        return (r1 == r2 && g1 == g2 && b1 == b2 && a1 == a2)
    }
}
