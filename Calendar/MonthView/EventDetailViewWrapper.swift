import SwiftUI
import EventKitUI

/// Обвивка, която вгражда системния детайлен изглед (EKEventViewController).
struct EventDetailViewWrapper: UIViewControllerRepresentable {
    let event: EKEvent
    
    class Coordinator: NSObject, @preconcurrency EKEventViewDelegate {
        let parent: EventDetailViewWrapper
        
        init(parent: EventDetailViewWrapper) {
            self.parent = parent
        }
        
        /// Извиква се при натискане на "Done" или когато затворим прозореца.
        @MainActor func eventViewController(_ controller: EKEventViewController,
                                 didCompleteWith action: EKEventViewAction) {
            controller.dismiss(animated: true)
        }
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }
    
    func makeUIViewController(context: Context) -> UINavigationController {
        let eventVC = EKEventViewController()
        eventVC.event = event
        eventVC.delegate = context.coordinator
        
        // Показваме бутони Edit/Delete
        eventVC.allowsEditing = true
        // Позволява тап върху календара
        eventVC.allowsCalendarPreview = true
        
        let nav = UINavigationController(rootViewController: eventVC)
        return nav
    }
    
    func updateUIViewController(_ uiViewController: UINavigationController, context: Context) {
        // Няма нужда от update
    }
}
