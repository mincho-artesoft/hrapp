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

    /// Нов колбек – когато натиснем върху ден от DaysHeaderView.
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

    // MARK: - makeUIViewController
    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()
        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // Взимаме "родителя" като optional, за да можем да го ползваме със [weak].
        let parentVC: UIViewController? = vc

        // Първоначални данни (allDay и regular)
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // Смяна на седмицата
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate
            // Презареждаме от Coordinator
            context.coordinator.reloadCurrentWeek()
        }

        // Тап върху евент -> отваряме EKEventEditViewController
        container.onEventTap = { [weak parentVC] descriptor in
            guard let parentVC = parentVC else { return }
            if let ekWrapper = descriptor as? EKWrapper {
                let editVC = EKEventEditViewController()
                editVC.eventStore = self.eventStore
                editVC.event = ekWrapper.ekEvent
                editVC.editViewDelegate = context.coordinator
                parentVC.present(editVC, animated: true)
            }
        }

        // Дълго натискане в празно -> нов евент
        container.onEmptyLongPress = { [weak parentVC] date in
            guard let parentVC = parentVC else { return }
            let newEvent = EKEvent(eventStore: self.eventStore)
            newEvent.title = "New event"
            newEvent.calendar = self.eventStore.defaultCalendarForNewEvents
            newEvent.startDate = date
            newEvent.endDate   = date.addingTimeInterval(3600)

            let editVC = EKEventEditViewController()
            editVC.eventStore = self.eventStore
            editVC.event = newEvent
            editVC.editViewDelegate = context.coordinator
            parentVC.present(editVC, animated: true)
        }

        // Drag/Drop (местене на целия евент)
        container.onEventDragEnded = { descriptor, newDate in
            if let ekWrapper = descriptor as? EKWrapper {
                let ev = ekWrapper.ekEvent
                // Ако е recurring...
                if ev.hasRecurrenceRules {
                    // Попитайте потребителя (this / future / cancel):
                    context.coordinator.askUserAndSaveRecurring(
                        event: ev,
                        newStartDate: newDate,
                        isResize: false
                    )
                } else {
                    // Обикновен евент
                    context.coordinator.applyDragChangesAndSave(
                        ev: ev,
                        newStartDate: newDate,
                        span: .thisEvent
                    )
                }
            }
        }

        // Resize (промяна на горния/долния край)
        container.onEventDragResizeEnded = { descriptor, newDate in
            if let ekWrapper = descriptor as? EKWrapper {
                let ev = ekWrapper.ekEvent
                // Ако е recurring...
                if ev.hasRecurrenceRules {
                    context.coordinator.askUserAndSaveRecurring(
                        event: ev,
                        newStartDate: newDate,
                        isResize: true
                    )
                } else {
                    // Обикновен евент
                    context.coordinator.applyResizeChangesAndSave(
                        ev: ev,
                        descriptor: descriptor,
                        span: .thisEvent
                    )
                }
            }
        }

        // Тап върху ден
        container.onDayLabelTap = { tappedDate in
            onDayLabelTap?(tappedDate)
        }

        // Добавяме контейнера във vc
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

    // MARK: - updateUIViewController
    public func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        // Ако startOfWeek или events се променят
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

    // MARK: - makeCoordinator
    public func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    // MARK: - Coordinator
    public class Coordinator: NSObject, EKEventEditViewDelegate {
        let parent: TwoWayPinnedWeekWrapper
        
        // Пазим идентификатора на последния "пипнат" (местен / ресайзван) евент
        var selectedEventID: String?

        init(_ parent: TwoWayPinnedWeekWrapper) {
            self.parent = parent
        }
        
        // При затваряне на EKEventEditViewController, презареждаме
        public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction) {
            controller.dismiss(animated: true) {
                self.reloadCurrentWeek()
            }
        }

        // MARK: - Основен метод за презареждане
        func reloadCurrentWeek() {
            let start = parent.startOfWeek
            guard let end = Calendar.current.date(byAdding: .day, value: 7, to: start) else { return }

            // Теглим събития от eventStore
            let found = parent.eventStore.events(
                matching: parent.eventStore.predicateForEvents(withStart: start,
                                                               end: end,
                                                               calendars: nil)
            )
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }

            // Ако имаме запомнен ID -> намираме същото събитие и го "селектираме"
            if let lastID = selectedEventID {
                if let sameEvent = wrappers.first(where: { $0.ekEvent.eventIdentifier == lastID }) {
                    sameEvent.editedEvent = sameEvent
                }
            }

            // Ъпдейтваме @Binding var events
            parent.events = wrappers
        }

        // MARK: - Методи за Drag/Drop, Resize и Recurring
        func askUserAndSaveRecurring(event: EKEvent,
                                     newStartDate: Date,
                                     isResize: Bool) {
            // Правим UIAlertController "This / Future / Cancel"
            let alert = UIAlertController(
                title: "Recurring Event",
                message: "This event is part of a series. How would you like to update it?",
                preferredStyle: .actionSheet
            )

            let onlyThis = UIAlertAction(title: "This Event Only", style: .default) { _ in
                if !isResize {
                    self.applyDragChangesAndSave(ev: event, newStartDate: newStartDate, span: .thisEvent)
                } else {
                    self.applyResizeChangesAndSave(ev: event, descriptor: nil, span: .thisEvent, forcedNewDate: newStartDate)
                }
            }
            let future = UIAlertAction(title: "All Future Events", style: .default) { _ in
                if !isResize {
                    self.applyDragChangesAndSave(ev: event, newStartDate: newStartDate, span: .futureEvents)
                } else {
                    self.applyResizeChangesAndSave(ev: event, descriptor: nil, span: .futureEvents, forcedNewDate: newStartDate)
                }
            }
            let cancel = UIAlertAction(title: "Cancel", style: .cancel) { _ in
                // Връщаме го обратно
                self.reloadCurrentWeek()
            }

            alert.addAction(onlyThis)
            alert.addAction(future)
            alert.addAction(cancel)

            // Нужно е, ако сме на iPad, да посочим popoverPresentationController
            if let wnd = UIApplication.shared.windows.first,
               let root = wnd.rootViewController {
                alert.popoverPresentationController?.sourceView = root.view
                alert.popoverPresentationController?.sourceRect = CGRect(x: root.view.bounds.midX,
                                                                         y: root.view.bounds.midY,
                                                                         width: 0, height: 0)
                alert.popoverPresentationController?.permittedArrowDirections = []
                root.present(alert, animated: true)
            } else {
                // Ако сме на iPhone:
                UIApplication.shared.keyWindow?.rootViewController?.present(alert, animated: true)
            }
        }

        func applyDragChangesAndSave(ev: EKEvent,
                                     newStartDate: Date,
                                     span: EKSpan) {
            // 1) Запомняме кой евент местим
            selectedEventID = ev.eventIdentifier

            // 2) Променяме start/end
            let duration = ev.endDate.timeIntervalSince(ev.startDate)
            ev.startDate = newStartDate
            ev.endDate   = newStartDate.addingTimeInterval(duration)

            // 3) Записваме
            do {
                try parent.eventStore.save(ev, span: span)
            } catch {
                print("Error: \(error)")
            }
            // 4) Презареждаме
            reloadCurrentWeek()
        }

        func applyResizeChangesAndSave(ev: EKEvent,
                                       descriptor: EventDescriptor?,
                                       span: EKSpan,
                                       forcedNewDate: Date? = nil) {
            // 1) Запомняме кой евент ресайзваме
            selectedEventID = ev.eventIdentifier

            // 2) Променяме start/end
            if let desc = descriptor {
                ev.startDate = desc.dateInterval.start
                ev.endDate   = desc.dateInterval.end
            } else if let newDt = forcedNewDate {
                let oldDuration = ev.endDate.timeIntervalSince(ev.startDate)
                ev.startDate = newDt
                ev.endDate   = newDt.addingTimeInterval(oldDuration)
            }

            // 3) Записваме
            do {
                try parent.eventStore.save(ev, span: span)
            } catch {
                print("Error: \(error)")
            }
            // 4) Презареждаме
            reloadCurrentWeek()
        }
    }

    // MARK: - Помощна функция: разделя масива на allDay / regular
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
