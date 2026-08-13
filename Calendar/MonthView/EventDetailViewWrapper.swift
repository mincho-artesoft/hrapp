import SwiftUI
import EventKitUI

/// Keeps Apple's event details intact and adds our App Clip share action to
/// the leading navigation-bar group beside the system Edit action.
final class ShareableEventViewController: EKEventViewController {
    private var eventEditButton: UIBarButtonItem?

    private lazy var eventShareButton = UIBarButtonItem(
        image: UIImage(systemName: "square.and.arrow.up"),
        style: .plain,
        target: self,
        action: #selector(shareEvent)
    )

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        // EKEventViewController creates its Edit item internally. Configuring
        // after it appears lets us retain its private target/action while only
        // changing the presentation from text to a pencil icon.
        configureLeadingButtonsIfNeeded()
    }

    private func configureLeadingButtonsIfNeeded() {
        // Remove an older placement if this controller is shown again after a
        // system edit flow, while leaving the system close button untouched.
        let trailingItems = (navigationItem.rightBarButtonItems ?? [])
            .filter { $0 !== eventShareButton }
        navigationItem.setRightBarButtonItems(trailingItems, animated: false)

        var leadingItems = navigationItem.leftBarButtonItems ?? []
        if eventEditButton == nil,
           let systemEditButton = leadingItems.first(where: { $0 !== eventShareButton }) {
            let pencilButton = UIBarButtonItem(
                image: UIImage(systemName: "pencil"),
                style: systemEditButton.style,
                target: systemEditButton.target,
                action: systemEditButton.action
            )
            pencilButton.accessibilityLabel = NSLocalizedString("Edit", comment: "Edit event button")
            pencilButton.accessibilityIdentifier = "eventDetail.edit"

            if let index = leadingItems.firstIndex(where: { $0 === systemEditButton }) {
                leadingItems[index] = pencilButton
            }
            eventEditButton = pencilButton
        }

        eventShareButton.accessibilityLabel = NSLocalizedString("Share", comment: "Share event button")
        eventShareButton.accessibilityIdentifier = "eventDetail.share"
        leadingItems.removeAll(where: { $0 === eventShareButton })
        leadingItems.insert(eventShareButton, at: min(1, leadingItems.count))
        navigationItem.setLeftBarButtonItems(leadingItems, animated: false)
    }

    @objc private func shareEvent() {
        guard let event else { return }
        EventAppClipSharing.present(
            for: event,
            from: self,
            sourceBarButtonItem: eventShareButton
        )
    }
}

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
        let eventVC = ShareableEventViewController()
        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        eventVC.event = event
        eventVC.delegate = context.coordinator
        
        // Показваме бутони Edit/Delete
        eventVC.allowsEditing = true
        // Позволява тап върху календара
        eventVC.allowsCalendarPreview = true
        eventVC.view.semanticContentAttribute = semanticDirection
        
        let nav = UINavigationController(rootViewController: eventVC)
        nav.view.semanticContentAttribute = semanticDirection
        return nav
    }
    
    func updateUIViewController(_ uiViewController: UINavigationController, context: Context) {
        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        uiViewController.view.semanticContentAttribute = semanticDirection
        uiViewController.topViewController?.view.semanticContentAttribute = semanticDirection
    }
}
