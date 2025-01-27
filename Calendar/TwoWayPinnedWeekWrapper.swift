//
//  TwoWayPinnedWeekWrapper.swift
//  ExampleCalendarApp
//
//  SwiftUI обвивка за TwoWayPinnedWeekContainerView.
//  - При Long Press в празно: отваряме системния EKEventEditViewController за нов евент
//  - При Tap върху съществуващо събитие: отваряме редакция на него
//

import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]

    // Единственият EKEventStore, който ползвате (да няма "Event does not belong to eventStore")
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
        
        // Създаваме контейнер
        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // Първоначално подаваме събитията
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // При смяна на седмица
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate

            // Примерно - зареждаме от eventStore
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let predicate = self.eventStore.predicateForEvents(
                withStart: newStartDate, end: endOfWeek, calendars: nil
            )
            let found = self.eventStore.events(matching: predicate)
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
            self.events = wrappers

            let (ad, reg) = self.splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }

            container.setNeedsLayout()
            container.layoutIfNeeded()
        }

        // При тап върху евент => отваряме редакция
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

        // При Long Press в празно => създаваме нов EKEvent и отваряме редактора
        container.onEmptyLongPress = { [weak vc] date in
            guard let vc = vc else { return }

            let newEvent = EKEvent(eventStore: self.eventStore)
            newEvent.title = "New event"
            newEvent.calendar = self.eventStore.defaultCalendarForNewEvents
            newEvent.startDate = date
            newEvent.endDate   = date.addingTimeInterval(3600) // +1 час

            let editVC = EKEventEditViewController()
            editVC.eventStore = self.eventStore
            editVC.event = newEvent
            editVC.editViewDelegate = context.coordinator
            vc.present(editVC, animated: true)
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
            // След Done/Cancel
            controller.dismiss(animated: true) {
                // Презареждаме събития
                let start = self.parent.startOfWeek
                let end = Calendar.current.date(byAdding: .day, value: 7, to: start)!

                let predicate = self.parent.eventStore.predicateForEvents(
                    withStart: start, end: end, calendars: nil
                )
                let found = self.parent.eventStore.events(matching: predicate)
                let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
                self.parent.events = wrappers
            }
        }
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
