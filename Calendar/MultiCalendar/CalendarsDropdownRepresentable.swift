import SwiftUI
import UIKit
import EventKit

// MARK: - SwiftUI обвивка

/// Покажи падащия списък с календарите в SwiftUI
struct CalendarsDropdownRepresentable: UIViewRepresentable {
    /// Може да е @ObservedObject, ако CalendarViewModel е ObservableObject
    @ObservedObject var viewModel: CalendarViewModel = .shared
    
    func makeUIView(context: Context) -> CalendarsDropdownView {
        let view = CalendarsDropdownView()
        view.setCalendarsInfo(viewModel.calendarsDict)
        
        // двупосочна връзка SwiftUI ↔ UIKit
        view.onSelectionChanged = { newDict in
            viewModel.calendarsDict = newDict
        }
        return view
    }
    
    func updateUIView(_ uiView: CalendarsDropdownView, context: Context) {
        // при всяка промяна от SwiftUI – опресняваме UIKit‑компонента
        uiView.setCalendarsInfo(viewModel.calendarsDict)
    }
}
