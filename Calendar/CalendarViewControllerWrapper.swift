//
//  CalendarViewControllerWrapper.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 22/1/25.
//


import SwiftUI
import CalendarKit

/// Този SwiftUI изглед вгражда нашия `CalendarViewController` (UIKit) в SwiftUI йерархията
struct CalendarViewControllerWrapper: UIViewControllerRepresentable {

    // MARK: - Coordinator (ако ни трябва да комуникираме обратно към SwiftUI)

    class Coordinator: NSObject {
        // Тук може да пазим референции, ако трябва да връщаме данни към SwiftUI
    }

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    // MARK: - UIViewControllerRepresentable

    /// Създаваме инстанция на CalendarViewController (UIKit)
    func makeUIViewController(context: Context) -> CalendarViewController {
        let vc = CalendarViewController()
        // Тук можем да конфигурираме още неща, ако се наложи
        return vc
    }

    /// Ъпдейтва се при смяна на SwiftUI state
    func updateUIViewController(_ uiViewController: CalendarViewController, context: Context) {
        // Ако имаме нужда да обновяваме нещо специфично
    }
}
