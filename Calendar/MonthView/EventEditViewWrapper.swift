import SwiftUI
import EventKit
import EventKitUI

struct EventEditViewWrapper: UIViewControllerRepresentable {
    let eventStore: EKEventStore
    let event: EKEvent
    var preferredColorScheme: ColorScheme? = nil
    
    /// Callback, който да се извика след като събитието е запазено / редактирано / изтрито.
    var onEventUpdated: (() -> Void)? = nil

    /// Това свойство ни позволява да затворим sheet-а, без да викаме UIKit `dismiss(animated:)`.
    @Environment(\.presentationMode) var presentationMode

    func makeUIViewController(context: Context) -> EKEventEditViewController {
        let vc = EKEventEditViewController()
        vc.eventStore = eventStore
        vc.event = event
        vc.editViewDelegate = context.coordinator
        vc.view.semanticContentAttribute = context.environment.layoutDirection == .rightToLeft
            ? .forceRightToLeft
            : .forceLeftToRight
        applyPreferredAppearance(to: vc)
        
        return vc
    }
    
    func updateUIViewController(_ uiViewController: EKEventEditViewController, context: Context) {
        uiViewController.view.semanticContentAttribute = context.environment.layoutDirection == .rightToLeft
            ? .forceRightToLeft
            : .forceLeftToRight
        applyPreferredAppearance(to: uiViewController)
    }

    private func applyPreferredAppearance(to controller: UIViewController) {
        guard let preferredColorScheme else {
            controller.overrideUserInterfaceStyle = .unspecified
            return
        }

        controller.overrideUserInterfaceStyle = preferredColorScheme == .dark ? .dark : .light
        controller.view.backgroundColor = .systemBackground
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, @preconcurrency EKEventEditViewDelegate {
        let parent: EventEditViewWrapper
        let eventWasNew: Bool
        let originalEventIdentifier: String?
        
        init(_ parent: EventEditViewWrapper) {
            self.parent = parent
            self.eventWasNew = parent.event.eventIdentifier == nil
            self.originalEventIdentifier = parent.event.eventIdentifier
        }
        
        @MainActor func eventEditViewController(_ controller: EKEventEditViewController,
                                     didCompleteWith action: EKEventEditViewAction) {
            // Затваряме SwiftUI sheet-а (вместо директно да викаме controller.dismiss(animated: true))
            parent.presentationMode.wrappedValue.dismiss()
            
            // Ако искаме да презаредим календари или списъци, можем да го направим след леко забавяне:
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) { [self] in
                EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
                if action == .saved,
                   eventWasNew,
                   let event = controller.event {
                    EventSharePromptManager.shared.show(for: event)
                }
                if action == .deleted, let originalEventIdentifier {
                    SharedInviteTracker.localEventWasDeleted(
                        localEventIdentifier: originalEventIdentifier
                    )
                }
                // CalendarViewModel.shared.reloadCalendars()
                // Извикваме и подадения callback, ако е зададен
                parent.onEventUpdated?()
            }
        }
    }
}
