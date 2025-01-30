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

    /// Нов колбек – когато натиснем върху ден от DaysHeaderView
    public var onDayLabelTap: ((Date) -> Void)?

    public init(
        startOfWeek: Binding<Date>,
        events: Binding<[EventDescriptor]>,
        eventStore: EKEventStore,
        onDayLabelTap: ((Date) -> Void)? = nil
    ) {
        self._startOfWeek = startOfWeek
        self._events = events
        self.eventStore = eventStore
        self.onDayLabelTap = onDayLabelTap
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()
        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // Първоначални данни
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // Колбек при смяна на седмицата
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate
            // Презареждаме събития
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

        // Колбек при тап върху евент
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

        // Колбек при дълго натискане в празно място
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

        // Drag/drop
        container.onEventDragEnded = { [weak vc] descriptor, newDate in
            guard let vc = vc else { return }
            if let ekWrapper = descriptor as? EKWrapper {
                let ev = ekWrapper.ekEvent
                // Проверка за recurring и т.н.
                if ev.hasRecurrenceRules {
                    self.askUserAndSaveRecurring(in: vc, event: ev, newStartDate: newDate, isResize: false)
                } else {
                    self.applyDragChangesAndSave(ev: ev, newStartDate: newDate, span: .thisEvent)
                }
            }
        }
        container.onEventDragResizeEnded = { [weak vc] descriptor, newDate in
            guard let vc = vc else { return }
            if let ekWrapper = descriptor as? EKWrapper {
                let ev = ekWrapper.ekEvent
                if ev.hasRecurrenceRules {
                    self.askUserAndSaveRecurring(in: vc, event: ev, newStartDate: newDate, isResize: true)
                } else {
                    self.applyResizeChangesAndSave(ev: ev, descriptor: descriptor, span: .thisEvent)
                }
            }
        }

        // ============ НОВО: при тап върху ден (DaysHeaderView) ============
        container.onDayLabelTap = { tappedDate in
            onDayLabelTap?(tappedDate)
        }

        // Добавяме контейнера като subview
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
        // Ако startOfWeek или events се променят, ъпдейтваме
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
                // Reload след затваряне
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

    // --- Помощни методи за Drag/Drop, Resize, Recurring ---

    private func askUserAndSaveRecurring(in vc: UIViewController,
                                         event: EKEvent,
                                         newStartDate: Date,
                                         isResize: Bool) {
        let alert = UIAlertController(
            title: "Recurring Event",
            message: "This event is part of a series. How would you like to update it?",
            preferredStyle: .actionSheet
        )

        let onlyThisAction = UIAlertAction(title: "This Event Only", style: .default) { _ in
            if !isResize {
                self.applyDragChangesAndSave(ev: event, newStartDate: newStartDate, span: .thisEvent)
            } else {
                self.applyResizeChangesAndSave(ev: event, descriptor: nil, span: .thisEvent, forcedNewDate: newStartDate)
            }
        }
        let futureAction = UIAlertAction(title: "All Future Events", style: .default) { _ in
            if !isResize {
                self.applyDragChangesAndSave(ev: event, newStartDate: newStartDate, span: .futureEvents)
            } else {
                self.applyResizeChangesAndSave(ev: event, descriptor: nil, span: .futureEvents, forcedNewDate: newStartDate)
            }
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { _ in
            self.reloadCurrentWeek()
        }

        alert.addAction(onlyThisAction)
        alert.addAction(futureAction)
        alert.addAction(cancelAction)

        if let popover = alert.popoverPresentationController {
            popover.sourceView = vc.view
            popover.sourceRect = CGRect(x: vc.view.bounds.midX,
                                        y: vc.view.bounds.midY,
                                        width: 0, height: 0)
            popover.permittedArrowDirections = []
        }

        vc.present(alert, animated: true)
    }

    private func applyDragChangesAndSave(ev: EKEvent,
                                         newStartDate: Date,
                                         span: EKSpan) {
        let duration = ev.endDate.timeIntervalSince(ev.startDate)
        ev.startDate = newStartDate
        ev.endDate   = newStartDate.addingTimeInterval(duration)
        do {
            try eventStore.save(ev, span: span)
        } catch {
            print("Error: \(error)")
        }
        reloadCurrentWeek()
    }

    private func applyResizeChangesAndSave(ev: EKEvent,
                                           descriptor: EventDescriptor?,
                                           span: EKSpan,
                                           forcedNewDate: Date? = nil) {
        if let desc = descriptor {
            ev.startDate = desc.dateInterval.start
            ev.endDate   = desc.dateInterval.end
        }
        else if let newDt = forcedNewDate {
            let oldDuration = ev.endDate.timeIntervalSince(ev.startDate)
            ev.startDate = newDt
            ev.endDate   = newDt.addingTimeInterval(oldDuration)
        }
        do {
            try eventStore.save(ev, span: span)
        } catch {
            print("Error: \(error)")
        }
        reloadCurrentWeek()
    }

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
