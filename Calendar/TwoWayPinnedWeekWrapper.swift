//
//  TwoWayPinnedWeekWrapper.swift
//  ExampleCalendarApp
//

import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]

    let eventStore: EKEventStore

    public init(
        startOfWeek: Binding<Date>,
        events: Binding<[EventDescriptor]>,
        eventStore: EKEventStore
    ) {
        self._startOfWeek = startOfWeek
        self._events = events
        self.eventStore = eventStore
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()
        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // Initial load
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // On week change
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate
            // Load events for the new week
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let found = self.eventStore.events(
                matching: self.eventStore.predicateForEvents(withStart: newStartDate,
                                                             end: endOfWeek,
                                                             calendars: nil)
            )
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
            self.events = wrappers

            let (ad, reg) = self.splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }

            container.setNeedsLayout()
            container.layoutIfNeeded()
        }

        // On event tap -> show EKEventEditViewController
        container.onEventTap = { [weak vc] descriptor in
            guard let vc = vc else { return }
            if let ekWrapper = descriptor as? EKWrapper {
                let editVC = EKEventEditViewController()
                editVC.eventStore = self.eventStore
                editVC.event = ekWrapper.ekEvent
                editVC.editViewDelegate = context.coordinator
                vc.present(editVC, animated: true)
            }
        }

        // On empty space long press -> create a new event
        container.onEmptyLongPress = { [weak vc] date in
            guard let vc = vc else { return }
            let newEvent = EKEvent(eventStore: self.eventStore)
            newEvent.title = "New event"
            newEvent.calendar = self.eventStore.defaultCalendarForNewEvents
            newEvent.startDate = date
            newEvent.endDate   = date.addingTimeInterval(3600)

            let editVC = EKEventEditViewController()
            editVC.eventStore = self.eventStore
            editVC.event = newEvent
            editVC.editViewDelegate = context.coordinator
            vc.present(editVC, animated: true)
        }

        // MARK: - Drag/Drop End
        container.onEventDragEnded = { [weak vc] descriptor, newDate in
            guard let vc = vc else { return }
            if let ekWrapper = descriptor as? EKWrapper {
                let ev = ekWrapper.ekEvent

                // If it's a recurring event, ask user how to save
                if ev.hasRecurrenceRules {
                    self.askUserAndSaveRecurring(in: vc, event: ev, newStartDate: newDate, isResize: false)
                } else {
                    // If it's not recurring, save immediately for this event only
                    self.applyDragChangesAndSave(ev: ev, newStartDate: newDate, span: .thisEvent)
                }
            }
        }

        // MARK: - Resize End
        container.onEventDragResizeEnded = { [weak vc] descriptor, newDate in
            guard let vc = vc else { return }
            if let ekWrapper = descriptor as? EKWrapper {
                let ev = ekWrapper.ekEvent

                // If it's a recurring event, ask user
                if ev.hasRecurrenceRules {
                    self.askUserAndSaveRecurring(in: vc, event: ev, newStartDate: newDate, isResize: true)
                } else {
                    // If it's not recurring, save immediately
                    self.applyResizeChangesAndSave(ev: ev, descriptor: descriptor, span: .thisEvent)
                }
            }
        }

        vc.view.addSubview(container)
        container.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            container.topAnchor.constraint(equalTo: vc.view.topAnchor),
            container.leadingAnchor.constraint(equalTo: vc.view.leadingAnchor),
            container.trailingAnchor.constraint(equalTo: vc.view.trailingAnchor),
            container.bottomAnchor.constraint(equalTo: vc.view.bottomAnchor),
        ])

        return vc
    }

    public func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        guard let container = uiViewController.view.subviews
            .first(where: { $0 is TwoWayPinnedWeekContainerView }) as? TwoWayPinnedWeekContainerView
        else { return }

        container.startOfWeek = startOfWeek

        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        container.setNeedsLayout()
        container.layoutIfNeeded()
    }

    public func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    public class Coordinator: NSObject, EKEventEditViewDelegate {
        let parent: TwoWayPinnedWeekWrapper
        
        init(_ parent: TwoWayPinnedWeekWrapper) {
            self.parent = parent
        }
        
        public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction) {
            controller.dismiss(animated: true) {
                // Reload after closing the editor
                let start = self.parent.startOfWeek
                let end = Calendar.current.date(byAdding: .day, value: 7, to: start)!
                let found = self.parent.eventStore.events(
                    matching: self.parent.eventStore.predicateForEvents(
                        withStart: start, end: end, calendars: nil
                    )
                )
                let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
                self.parent.events = wrappers
            }
        }
    }

    // -------------------------------------------------------------------------
    // MARK: - Utility methods for saving (Drag/Drop and Resize) with EKSpan
    // -------------------------------------------------------------------------

    /// Ask user how to save changes to a recurring event: this event only, future events, or cancel.
    private func askUserAndSaveRecurring(in vc: UIViewController,
                                         event: EKEvent,
                                         newStartDate: Date,
                                         isResize: Bool) {
        let alert = UIAlertController(
            title: "Recurring Event",
            message: "This event is part of a series. How would you like to update it?",
            preferredStyle: .actionSheet
        )

        // 1) Only this event
        let onlyThisAction = UIAlertAction(title: "This Event Only", style: .default) { _ in
            if !isResize {
                self.applyDragChangesAndSave(ev: event, newStartDate: newStartDate, span: .thisEvent)
            } else {
                self.applyResizeChangesAndSave(ev: event, descriptor: nil, span: .thisEvent, forcedNewDate: newStartDate)
            }
        }

        // 2) Future events
        let futureAction = UIAlertAction(title: "All Future Events", style: .default) { _ in
            if !isResize {
                self.applyDragChangesAndSave(ev: event, newStartDate: newStartDate, span: .futureEvents)
            } else {
                self.applyResizeChangesAndSave(ev: event, descriptor: nil, span: .futureEvents, forcedNewDate: newStartDate)
            }
        }

        // 3) Cancel
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { _ in
            self.reloadCurrentWeek()  // Reload to revert the visual change
        }

        alert.addAction(onlyThisAction)
        alert.addAction(futureAction)
        alert.addAction(cancelAction)

        // iPad support
        if let popover = alert.popoverPresentationController {
            popover.sourceView = vc.view
            popover.sourceRect = CGRect(x: vc.view.bounds.midX,
                                        y: vc.view.bounds.midY,
                                        width: 0, height: 0)
            popover.permittedArrowDirections = []
        }

        vc.present(alert, animated: true)
    }

    /// Apply dragged changes and save with the given EKSpan.
    private func applyDragChangesAndSave(ev: EKEvent,
                                         newStartDate: Date,
                                         span: EKSpan) {
        let duration = ev.endDate.timeIntervalSince(ev.startDate)
        ev.startDate = newStartDate
        ev.endDate   = newStartDate.addingTimeInterval(duration)

        do {
            try eventStore.save(ev, span: span)
        } catch {
            print("Error while saving dragged event: \(error)")
        }

        reloadCurrentWeek()
    }

    /// Apply resized changes and save with the given EKSpan.
    ///
    /// - If we have a descriptor, we use `descriptor.dateInterval.start/end`.
    /// - If nil (after the alert), we use `forcedNewDate` to update start/end.
    private func applyResizeChangesAndSave(ev: EKEvent,
                                           descriptor: EventDescriptor?,
                                           span: EKSpan,
                                           forcedNewDate: Date? = nil) {
        if let desc = descriptor {
            ev.startDate = desc.dateInterval.start
            ev.endDate   = desc.dateInterval.end
        }
        else if let newDt = forcedNewDate {
            // Simple approach: keep the same duration, move startDate to newDt
            let oldDuration = ev.endDate.timeIntervalSince(ev.startDate)
            ev.startDate = newDt
            ev.endDate   = newDt.addingTimeInterval(oldDuration)
        }

        do {
            try eventStore.save(ev, span: span)
        } catch {
            print("Error while saving resized event: \(error)")
        }

        reloadCurrentWeek()
    }

    /// Reload events for the current week to refresh UI
    private func reloadCurrentWeek() {
        let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: self.startOfWeek)!
        let found = self.eventStore.events(
            matching: self.eventStore.predicateForEvents(
                withStart: self.startOfWeek,
                end: endOfWeek,
                calendars: nil
            )
        )
        let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
        self.events = wrappers
    }

    // Splits all-day vs normal events
    private func splitAllDay(_ evts: [EventDescriptor]) -> ([EventDescriptor], [EventDescriptor]) {
        var allDay = [EventDescriptor]()
        var regular = [EventDescriptor]()
        for e in evts {
            if e.isAllDay {
                allDay.append(e)
            } else {
                regular.append(e)
            }
        }
        return (allDay, regular)
    }
}
