//
//  EventEditViewWrapper.swift
//  ExampleCalendarApp
//
//  SwiftUI обвивка за системния EKEventEditViewController
//

import SwiftUI
import EventKitUI

struct EventEditViewWrapper: UIViewControllerRepresentable {
    let eventStore: EKEventStore
    let event: EKEvent
    
    func makeUIViewController(context: Context) -> EKEventEditViewController {
        let vc = EKEventEditViewController()
        vc.eventStore = eventStore
        vc.event = event
        vc.editViewDelegate = context.coordinator
        return vc
    }
    
    func updateUIViewController(_ uiViewController: EKEventEditViewController, context: Context) {
        // Няма нужда от update
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    class Coordinator: NSObject, EKEventEditViewDelegate {
        let parent: EventEditViewWrapper
        
        init(_ parent: EventEditViewWrapper) {
            self.parent = parent
        }
        
        func eventEditViewController(_ controller: EKEventEditViewController,
                                     didCompleteWith action: EKEventEditViewAction) {
            // Когато потребителят натисне Done/Cancel, затваряме редактора
            controller.dismiss(animated: true)
        }
    }
}
