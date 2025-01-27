//
//  TwoWayPinnedWeekWrapper.swift
//  ExampleCalendarApp
//
//  SwiftUI обвивка за TwoWayPinnedWeekContainerView.
//  - При тап на събитие -> отваряме EKEventEditViewController (в същия store)
//  - При long press на празно -> извикваме onEmptyLongPress?(date)
//

import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]

    // Подаваме отвън единствения EKEventStore, за да няма конфликт
    let eventStore: EKEventStore

    /// Callback при дълго задържане върху празно място
    public var onEmptyLongPress: ((Date) -> Void)? = nil

    public init(
        startOfWeek: Binding<Date>,
        events: Binding<[EventDescriptor]>,
        eventStore: EKEventStore,
        onEmptyLongPress: ((Date) -> Void)? = nil
    ) {
        self._startOfWeek = startOfWeek
        self._events = events
        self.eventStore = eventStore
        self.onEmptyLongPress = onEmptyLongPress
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()

        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // Първоначално "рисуваме" събитията
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // При смяна на седмица
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate

            // Презареждаме от eventStore (примерен код)
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let predicate = self.eventStore.predicateForEvents(withStart: newStartDate,
                                                               end: endOfWeek,
                                                               calendars: nil)
            let found = self.eventStore.events(matching: predicate)
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
            self.events = wrappers

            let (ad, reg) = self.splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }

            container.setNeedsLayout()
            container.layoutIfNeeded()
        }

        // При тап върху събитие
        container.onEventTap = { [weak vc] descriptor in
            guard let vc = vc else { return }

            if let ekWrapper = descriptor as? EKWrapper {
                let editVC = EKEventEditViewController()
                // Същият store, от който е взето събитието
                editVC.eventStore = self.eventStore
                editVC.event = ekWrapper.ekEvent
                editVC.editViewDelegate = context.coordinator
                vc.present(editVC, animated: true)
            }
        }

        // При long press на празно
        container.onEmptyLongPress = { date in
            onEmptyLongPress?(date)
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

        // Обновяваме startOfWeek и събития
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
            // Затваряме editor-а
            controller.dismiss(animated: true) {
                // Презареждаме събития, за да отразим евентуални промени
                let start = self.parent.startOfWeek
                let end = Calendar.current.date(byAdding: .day, value: 7, to: start)!

                let predicate = self.parent.eventStore.predicateForEvents(
                    withStart: start,
                    end: end,
                    calendars: nil
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
