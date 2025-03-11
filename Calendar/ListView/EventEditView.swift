import SwiftUI
import EventKit
import EventKitUI

// MARK: - Обвивка за EKEventEditViewController с обновяване след редакция
struct EventEditView: UIViewControllerRepresentable {
    let event: EKEvent
    let eventStore: EKEventStore
    // Callback, който се извиква след приключване на редакцията
    var onEventUpdated: (() -> Void)?
    
    @Environment(\.presentationMode) var presentationMode

    class Coordinator: NSObject, @preconcurrency EKEventEditViewDelegate {
        var parent: EventEditView
        init(parent: EventEditView) {
            self.parent = parent
        }
        @MainActor func eventEditViewController(_ controller: EKEventEditViewController, didCompleteWith action: EKEventEditViewAction) {
            // Затваряме редактора
            parent.presentationMode.wrappedValue.dismiss()
            
            // Изчакваме малко и презареждаме събитията
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                CalendarViewModel.shared.reloadCalendars()
                self.parent.onEventUpdated?()
            }
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }
    
    func makeUIViewController(context: Context) -> EKEventEditViewController {
        let vc = EKEventEditViewController()
        vc.eventStore = eventStore
        vc.event = event
        vc.editViewDelegate = context.coordinator
        return vc
    }
    
    func updateUIViewController(_ uiViewController: EKEventEditViewController, context: Context) {
        // Няма нужда от обновяване
    }
}


