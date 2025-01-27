//
//  TwoWayPinnedWeekWrapper.swift
//  ExampleCalendarApp
//
//  SwiftUI обвивка (UIViewControllerRepresentable) за TwoWayPinnedWeekContainerView.
//  Тук обработваме onEventTap, отваряме EKEventEditViewController, и след Done/Cancel
//  презареждаме събитията, за да се видят редактираните веднага.
//
import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]

    /// Вътрешен eventStore (или може да ползвате глобален)
    let localEventStore = EKEventStore()

    public init(startOfWeek: Binding<Date>, events: Binding<[EventDescriptor]>) {
        self._startOfWeek = startOfWeek
        self._events = events
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()

        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // Първоначално подаваме събитията
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // При смяна на седмица (< или >)
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate

            // Примерно - fetch от localEventStore
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let predicate = self.localEventStore.predicateForEvents(
                withStart: newStartDate,
                end: endOfWeek,
                calendars: nil
            )
            let found = self.localEventStore.events(matching: predicate)
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }

            self.events = wrappers

            let (ad, reg) = self.splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }

            container.setNeedsLayout()
            container.layoutIfNeeded()
        }

        // При тап върху евент
        container.onEventTap = { [weak vc] descriptor in
            guard let vc = vc else { return }
            // Ако е EKWrapper -> имаме EKEvent
            if let ekWrapper = descriptor as? EKWrapper {
                let editVC = EKEventEditViewController()
                editVC.eventStore = self.localEventStore
                editVC.event = ekWrapper.ekEvent
                editVC.editViewDelegate = context.coordinator
                vc.present(editVC, animated: true)
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

        // Обновяваме startOfWeek + събития
        container.startOfWeek = startOfWeek

        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        container.setNeedsLayout()
        container.layoutIfNeeded()
    }

    // MARK: - EKEventEditViewDelegate чрез Coordinator
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
            // Затваряме контролера
            controller.dismiss(animated: true) {
                // Тук презареждаме събитията:
                let start = self.parent.startOfWeek
                let end = Calendar.current.date(byAdding: .day, value: 7, to: start)!

                let predicate = self.parent.localEventStore.predicateForEvents(
                    withStart: start,
                    end: end,
                    calendars: nil
                )
                let found = self.parent.localEventStore.events(matching: predicate)
                let wrappers = found.map { EKWrapper(eventKitEvent: $0) }

                // Записваме в @Binding var events
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
