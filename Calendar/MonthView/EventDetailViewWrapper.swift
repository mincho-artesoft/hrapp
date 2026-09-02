import SwiftUI
import EventKit
import EventKitUI

/// Keeps Apple's event details intact and adds our App Clip share action to
/// the leading navigation-bar group beside the system Edit action.
final class ShareableEventViewController: EKEventViewController, UIGestureRecognizerDelegate {
    private var eventEditButton: UIBarButtonItem?

    private lazy var receivedEventCalendarTap = UITapGestureRecognizer(
        target: self,
        action: #selector(chooseReceivedEventCalendar)
    )

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
        configureReceivedEventCalendarTap()
    }

    private func configureLeadingButtonsIfNeeded() {
        let isReadOnly = event.map(SharedInviteTracker.isReadOnly) ?? false
        let canShare = event.map(SharedInviteTracker.canShare) ?? false

        if isReadOnly {
            // Keep EventKit's details unchanged. The existing Calendar row is
            // intercepted below so it moves only the recipient's local copy.
            let leadingItems = (navigationItem.leftBarButtonItems ?? [])
                .filter { $0 !== eventShareButton }
            navigationItem.setLeftBarButtonItems(leadingItems, animated: false)

            let trailingItems = (navigationItem.rightBarButtonItems ?? [])
                .filter { $0 !== eventShareButton }
            navigationItem.setRightBarButtonItems(trailingItems, animated: false)
            return
        }

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

        leadingItems.removeAll(where: { $0 === eventShareButton })
        if canShare {
            eventShareButton.accessibilityLabel = NSLocalizedString("Share", comment: "Share event button")
            eventShareButton.accessibilityIdentifier = "eventDetail.share"
            leadingItems.insert(eventShareButton, at: min(1, leadingItems.count))
        }
        navigationItem.setLeftBarButtonItems(leadingItems, animated: false)
    }

    @objc private func shareEvent() {
        guard let event, SharedInviteTracker.canShare(event) else { return }
        EventAppClipSharing.present(
            for: event,
            from: self,
            sourceBarButtonItem: eventShareButton
        )
    }

    private func configureReceivedEventCalendarTap() {
        guard event.map(SharedInviteTracker.isReadOnly) == true else {
            if receivedEventCalendarTap.view != nil {
                view.removeGestureRecognizer(receivedEventCalendarTap)
            }
            return
        }
        guard receivedEventCalendarTap.view == nil else { return }
        receivedEventCalendarTap.delegate = self
        receivedEventCalendarTap.cancelsTouchesInView = true
        view.addGestureRecognizer(receivedEventCalendarTap)
    }

    func gestureRecognizer(
        _ gestureRecognizer: UIGestureRecognizer,
        shouldReceive touch: UITouch
    ) -> Bool {
        guard gestureRecognizer === receivedEventCalendarTap,
              event.map(SharedInviteTracker.isReadOnly) == true,
              let touchedView = touch.view,
              let row = containingListCell(of: touchedView)
        else { return false }

        let calendarLabel = NSLocalizedString(
            "Calendar",
            comment: "Calendar row in event details"
        )
        let rowLabels = [calendarLabel, "Calendar", event?.calendar.title]
            .compactMap { $0 }
            .filter { !$0.isEmpty }
        return rowLabels.contains { containsVisibleText($0, in: row) }
    }

    private func containingListCell(of view: UIView) -> UIView? {
        var candidate: UIView? = view
        while let current = candidate, current !== self.view {
            if current is UITableViewCell || current is UICollectionViewCell {
                return current
            }
            candidate = current.superview
        }
        return nil
    }

    private func containsVisibleText(_ text: String, in view: UIView) -> Bool {
        if let label = view as? UILabel,
           label.text?.localizedCaseInsensitiveCompare(text) == .orderedSame {
            return true
        }
        return view.subviews.contains { containsVisibleText(text, in: $0) }
    }

    @objc private func chooseReceivedEventCalendar() {
        guard let event,
              SharedInviteTracker.isReadOnly(event),
              let eventIdentifier = event.eventIdentifier
        else { return }

        let picker = ReceivedEventCalendarPicker(eventIdentifier: eventIdentifier) { [weak self] identifier in
            guard let self,
                  let movedEvent = CalendarViewModel.shared.eventStore.event(withIdentifier: identifier)
            else { return }
            self.event = movedEvent
        }
        let controller = UIHostingController(rootView: picker)
        controller.modalPresentationStyle = .pageSheet
        if let sheet = controller.sheetPresentationController {
            sheet.detents = [.medium(), .large()]
            sheet.selectedDetentIdentifier = .medium
            sheet.prefersGrabberVisible = true
        }
        present(controller, animated: true)
    }

}

/// Reader access protects the shared payload, not the recipient's choice of
/// local EventKit calendar. This picker moves only that local copy.
private struct ReceivedEventCalendarPicker: View {
    private let eventStore = CalendarViewModel.shared.eventStore
    private let onMoved: (String) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var eventIdentifier: String
    @State private var errorMessage: String?
    @State private var isMoving = false

    init(eventIdentifier: String, onMoved: @escaping (String) -> Void) {
        _eventIdentifier = State(initialValue: eventIdentifier)
        self.onMoved = onMoved
    }

    private var event: EKEvent? {
        eventStore.event(withIdentifier: eventIdentifier)
    }

    private var writableCalendars: [EKCalendar] {
        eventStore.calendars(for: .event)
            .filter(\.allowsContentModifications)
            .sorted {
                let titleOrder = $0.title.localizedCaseInsensitiveCompare($1.title)
                if titleOrder != .orderedSame { return titleOrder == .orderedAscending }
                return $0.source.title.localizedCaseInsensitiveCompare($1.source.title) == .orderedAscending
            }
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    if writableCalendars.isEmpty {
                        ContentUnavailableView(
                            "No Writable Calendars",
                            systemImage: "calendar.badge.exclamationmark",
                            description: Text("Add a writable calendar before moving this event.")
                        )
                    } else {
                        ForEach(writableCalendars, id: \.calendarIdentifier) { calendar in
                            Button {
                                moveEvent(to: calendar)
                            } label: {
                                HStack(spacing: 12) {
                                    Circle()
                                        .fill(Color(uiColor: UIColor(cgColor: calendar.cgColor)))
                                        .frame(width: 12, height: 12)

                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(calendar.title)
                                            .foregroundStyle(.primary)
                                        Text(calendar.source.title)
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                    }

                                    Spacer()

                                    if event?.calendar.calendarIdentifier == calendar.calendarIdentifier {
                                        Image(systemName: "checkmark")
                                            .fontWeight(.semibold)
                                    }
                                }
                            }
                            .disabled(isMoving)
                        }
                    }
                } footer: {
                    Text("This changes only your local copy. Shared event details stay read-only.")
                }
            }
            .navigationTitle("Choose Calendar")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
            .alert("Couldn’t Move Event", isPresented: Binding(
                get: { errorMessage != nil },
                set: { if !$0 { errorMessage = nil } }
            )) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage ?? "Please try again.")
            }
        }
    }

    private func moveEvent(to calendar: EKCalendar) {
        guard !isMoving,
              let event,
              let oldIdentifier = event.eventIdentifier,
              var invite = SharedInviteTracker.invite(localEventIdentifier: oldIdentifier)
        else { return }

        if event.calendar.calendarIdentifier == calendar.calendarIdentifier {
            dismiss()
            return
        }

        isMoving = true
        event.calendar = calendar

        do {
            let span: EKSpan = event.hasRecurrenceRules ? .futureEvents : .thisEvent
            try eventStore.save(event, span: span, commit: true)

            let newIdentifier = event.eventIdentifier ?? oldIdentifier
            eventIdentifier = newIdentifier
            invite.localEventIdentifier = newIdentifier
            SharedInviteTracker.update(invite)
            onMoved(newIdentifier)

            NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()

            if let session = CalendarFeedSession.existing {
                Task {
                    try? await CloudCalendarsAPI.rememberReceivedInvite(
                        eventId: invite.eventID,
                        feedId: invite.feedID,
                        localEventIdentifier: newIdentifier,
                        anonymousRecipientId: SharedInviteTracker.anonymousRecipientID,
                        session: session
                    )
                }
            }

            isMoving = false
            dismiss()
        } catch {
            isMoving = false
            errorMessage = error.localizedDescription
        }
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
            if action == .deleted,
               let identifier = parent.event.eventIdentifier {
                SharedInviteTracker.localEventWasDeleted(localEventIdentifier: identifier)
                EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
                NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            }
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
        
        // Received App Clip invitations are read-only inside the app. Their
        // dedicated trash action above still allows local removal.
        eventVC.allowsEditing = !SharedInviteTracker.isReadOnly(event)
        // For Reader events the existing Calendar row opens our local calendar
        // selector. Disable Apple's preview so it cannot flash underneath it.
        eventVC.allowsCalendarPreview = !SharedInviteTracker.isReadOnly(event)
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
