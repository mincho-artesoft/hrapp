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
    let selectedDate: Date
    
    func makeUIViewController(context: Context) -> CalendarViewController {
        let vc = CalendarViewController()
        vc.selectedDate = selectedDate
        return vc
    }
    
    func updateUIViewController(_ uiViewController: CalendarViewController, context: Context) {
        // Ако искате да обновявате при промяна на selectedDate, го правите тук.
    }
}
