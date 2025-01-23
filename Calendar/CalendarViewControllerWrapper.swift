import SwiftUI
import CalendarKit
import EventKit

struct CalendarViewControllerWrapper: UIViewControllerRepresentable {
    let selectedDate: Date
    let eventStore: EKEventStore
    
    func makeUIViewController(context: Context) -> CalendarViewController {
        let vc = CalendarViewController()
        vc.selectedDate = selectedDate
        vc.eventStore = eventStore
        return vc
    }
    
    func updateUIViewController(_ uiViewController: CalendarViewController, context: Context) {
        // Ако искате при промяна на selectedDate да презаредите Day View
        // uiViewController.dayView.state?.move(to: selectedDate)
    }
}
