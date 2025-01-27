//
//  TwoWayPinnedWeekWrapper.swift
//  ExampleCalendarApp
//
//  SwiftUI обвивка (UIViewControllerRepresentable) за TwoWayPinnedWeekContainerView.
//  - При драг върху събитие (onEventDragEnded) -> сменяме start/end в EKEventStore
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

        // Първоначални събития
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // При смяна на седмица
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate
            // Зареждаме събития
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let found = self.eventStore.events(matching: self.eventStore.predicateForEvents(
                withStart: newStartDate, end: endOfWeek, calendars: nil
            ))
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
            self.events = wrappers

            let (ad, reg) = self.splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }

            container.setNeedsLayout()
            container.layoutIfNeeded()
        }

        // При тап на евент -> EKEventEditViewController
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

        // При long press в празно -> ново събитие
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

        // При drag & drop на евент
        container.onEventDragEnded = { descriptor, newDate in
            // Преизчисляваме startDate/endDate
            if let ekWrapper = descriptor as? EKWrapper {
                let ev = ekWrapper.ekEvent
                let duration = ev.endDate.timeIntervalSince(ev.startDate)

                ev.startDate = newDate
                ev.endDate   = newDate.addingTimeInterval(duration)

                // Запис в eventStore
                do {
                    try self.eventStore.save(ev, span: .thisEvent)
                } catch {
                    print("Error saving dragged event: \(error)")
                }

                // Презареждаме списъка, за да видим промяната
                let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: self.startOfWeek)!
                let found = self.eventStore.events(matching: self.eventStore.predicateForEvents(
                    withStart: self.startOfWeek, end: endOfWeek, calendars: nil
                ))
                let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
                self.events = wrappers
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
                // Презареждаме
                let start = self.parent.startOfWeek
                let end = Calendar.current.date(byAdding: .day, value: 7, to: start)!
                let found = self.parent.eventStore.events(matching: self.parent.eventStore.predicateForEvents(
                    withStart: start, end: end, calendars: nil
                ))
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
