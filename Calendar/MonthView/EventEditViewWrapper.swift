import SwiftUI
import EventKit
import EventKitUI

struct EventEditViewWrapper: UIViewControllerRepresentable {
    let eventStore: EKEventStore
    let event: EKEvent
    
    /// Callback, който да се извика след като събитието е запазено / редактирано / изтрито.
    var onEventUpdated: (() -> Void)? = nil

    /// Това свойство ни позволява да затворим sheet-а, без да викаме UIKit `dismiss(animated:)`.
    @Environment(\.presentationMode) var presentationMode

    func makeUIViewController(context: Context) -> EKEventEditViewController {
        let vc = EKEventEditViewController()
        vc.eventStore = eventStore
        vc.event = event
        vc.editViewDelegate = context.coordinator
        
        return vc
    }
    
    func updateUIViewController(_ uiViewController: EKEventEditViewController, context: Context) {
        // Няма нужда да правим update
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, @preconcurrency EKEventEditViewDelegate {
        let parent: EventEditViewWrapper
        
        init(_ parent: EventEditViewWrapper) {
            self.parent = parent
        }
        
        @MainActor func eventEditViewController(_ controller: EKEventEditViewController,
                                     didCompleteWith action: EKEventEditViewAction) {
            // Затваряме SwiftUI sheet-а (вместо директно да викаме controller.dismiss(animated: true))
            parent.presentationMode.wrappedValue.dismiss()
            
            // Ако искаме да презаредим календари или списъци, можем да го направим след леко забавяне:
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { [self] in
                // CalendarViewModel.shared.reloadCalendars()
                // Извикваме и подадения callback, ако е зададен
                parent.onEventUpdated?()
            }
        }
    }
}
