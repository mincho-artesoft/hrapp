import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

// MARK: - TwoWayPinnedWeekWrapper

public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var fromDate: Date
    @Binding var toDate: Date
    @Binding var events: [EventDescriptor]
    let eventStore: EKEventStore

    public var onDayLabelTap: ((Date) -> Void)?

    public init(
        fromDate: Binding<Date>,
        toDate: Binding<Date>,
        events: Binding<[EventDescriptor]>,
        eventStore: EKEventStore,
        onDayLabelTap: ((Date) -> Void)? = nil
    ) {
        self._fromDate = fromDate
        self._toDate = toDate
        self._events = events
        self.eventStore = eventStore
        self.onDayLabelTap = onDayLabelTap
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()

        // Създаваме контейнер, който държи DaysHeaderView, AllDayView и MainWeekView
        let container = TwoWayPinnedWeekContainerView()

        // Инициализираме началния интервал
        container.fromDate = fromDate
        container.toDate   = toDate

        // Разделяме получените събития на all-day и "часови"
        let (allDay, regular) = splitAllDay(events)
        container.allDayView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes  = regular.map { EventLayoutAttributes($0) }

        // При промяна на диапазона "от-до"
        container.onRangeChange = { newFrom, newTo in
            self.fromDate = newFrom
            self.toDate   = newTo
            context.coordinator.reloadCurrentRange()
        }

        // При натискане на евент
        container.onEventTap = { descriptor in
            if let ekWrap = descriptor as? EKWrapper {
                context.coordinator.presentSystemEditor(ekWrap.ekEvent, in: vc)
            } else if let multi = descriptor as? EKMultiDayWrapper {
                context.coordinator.presentSystemEditor(multi.ekEvent, in: vc)
            }
        }

        // Когато се задържи дълго в празно място (не-all-day)
        container.onEmptyLongPress = { date in
            context.coordinator.createNewEventAndPresent(date: date, in: vc)
        }

        // Когато се задържи в all-day празно място
        container.allDayView.onEmptyLongPress = { dayDate in
            context.coordinator.createAllDayEventAndPresent(date: dayDate, in: vc)
        }

        // При край на drag евент
        container.onEventDragEnded = { descriptor, newDate in
            context.coordinator.handleEventDragOrResize(descriptor: descriptor, newDate: newDate, isResize: false)
        }

        // При край на resize евент
        container.onEventDragResizeEnded = { descriptor, newDate in
            context.coordinator.handleEventDragOrResize(descriptor: descriptor, newDate: newDate, isResize: true)
        }

        // Когато потребителят натисне етикета на ден (горе, DaysHeaderView)
        container.onDayLabelTap = { tappedDay in
            self.onDayLabelTap?(tappedDay)
        }

        // Добавяме subview и използваме safeAreaLayoutGuide, за да се запълни целия екран
        vc.view.addSubview(container)
        container.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            container.topAnchor.constraint(equalTo: vc.view.safeAreaLayoutGuide.topAnchor),
            container.leadingAnchor.constraint(equalTo: vc.view.leadingAnchor),
            container.trailingAnchor.constraint(equalTo: vc.view.trailingAnchor),
            container.bottomAnchor.constraint(equalTo: vc.view.safeAreaLayoutGuide.bottomAnchor),
        ])

        return vc
    }

    public func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        guard let container = uiViewController.view.subviews
            .first(where: { $0 is TwoWayPinnedWeekContainerView }) as? TwoWayPinnedWeekContainerView else { return }

        container.fromDate = fromDate
        container.toDate   = toDate

        let (allDay, regular) = splitAllDay(events)
        container.allDayView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes  = regular.map { EventLayoutAttributes($0) }

        container.setNeedsLayout()
        container.layoutIfNeeded()
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

    public func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    // MARK: - Coordinator

    public class Coordinator: NSObject, EKEventEditViewDelegate {
        let parent: TwoWayPinnedWeekWrapper

        // Вече не пазим ID за повторно "селектиране".
        // var selectedEventID: String?
        // var selectedEventPartialStart: Date?

        init(_ parent: TwoWayPinnedWeekWrapper) {
            self.parent = parent
        }

        // MARK: EKEventEditViewDelegate
        public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction) {
            controller.dismiss(animated: true) {
                self.reloadCurrentRange()
            }
        }

        /// Презарежда текущия диапазон (от parent.fromDate до parent.toDate)
        public func reloadCurrentRange() {
            let cal = Calendar.current
            let fromOnly = cal.startOfDay(for: parent.fromDate)
            let toOnly   = cal.startOfDay(for: parent.toDate)
            let actualEnd = cal.date(byAdding: .day, value: 1, to: toOnly) ?? toOnly

            let predicate = parent.eventStore.predicateForEvents(withStart: fromOnly,
                                                                 end: actualEnd,
                                                                 calendars: nil)
            let found = parent.eventStore.events(matching: predicate)

            var splitted: [EventDescriptor] = []
            for ekEvent in found {
                guard let realStart = ekEvent.startDate,
                      let realEnd = ekEvent.endDate else { continue }

                // Ако евентът се простира в няколко дни, нарязваме го на "парчета"
                if cal.startOfDay(for: realStart) != cal.startOfDay(for: realEnd) {
                    splitted.append(contentsOf: splitEventByDays(ekEvent,
                                                                 startRange: fromOnly,
                                                                 endRange: actualEnd))
                } else {
                    splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
                }
            }
            parent.events = splitted

            // Премахнато: логиката за "re-select":
            // if let lastID = selectedEventID { ... } => няма повече!
        }

        private func splitEventByDays(_ ekEvent: EKEvent,
                                      startRange: Date,
                                      endRange: Date) -> [EKMultiDayWrapper] {
            var results = [EKMultiDayWrapper]()
            let cal = Calendar.current
            let realStart = max(ekEvent.startDate, startRange)
            let realEnd   = min(ekEvent.endDate, endRange)
            if realStart >= realEnd { return results }

            var currentStart = realStart
            while currentStart < realEnd {
                guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart) else {
                    break
                }
                let pieceEnd = min(endOfDay, realEnd)
                let partial = EKMultiDayWrapper(realEvent: ekEvent,
                                                partialStart: currentStart,
                                                partialEnd: pieceEnd)
                results.append(partial)

                guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                      let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay) else {
                    break
                }
                currentStart = morning
            }
            return results
        }

        // MARK: - Показване на системния редактор (EKEventEditViewController)
        func presentSystemEditor(_ ekEvent: EKEvent, in parentVC: UIViewController) {
            let editVC = EKEventEditViewController()
            editVC.eventStore = parent.eventStore
            editVC.event = ekEvent
            editVC.editViewDelegate = self
            parentVC.present(editVC, animated: true)
        }

        // MARK: - Създаване на нов "часов" евент
        func createNewEventAndPresent(date: Date, in parentVC: UIViewController) {
            let newEvent = EKEvent(eventStore: parent.eventStore)
            newEvent.title = "New event"
            newEvent.calendar = parent.eventStore.defaultCalendarForNewEvents
            newEvent.startDate = date
            newEvent.endDate   = date.addingTimeInterval(3600)
            presentSystemEditor(newEvent, in: parentVC)
        }

        // MARK: - Създаване на all-day евент
        func createAllDayEventAndPresent(date: Date, in parentVC: UIViewController) {
            let newEvent = EKEvent(eventStore: parent.eventStore)
            newEvent.calendar = parent.eventStore.defaultCalendarForNewEvents
            newEvent.title = "All-day event"
            newEvent.isAllDay = true
            newEvent.startDate = date
            newEvent.endDate   = date
            presentSystemEditor(newEvent, in: parentVC)
        }

        // MARK: - Преместване (drag) или resize
        func handleEventDragOrResize(descriptor: EventDescriptor, newDate: Date, isResize: Bool) {
            // Премахваме задаването на selectedEventID/selectedEventPartialStart, за да не „селектираме“
            // if let multi = descriptor as? EKMultiDayWrapper {
            //     selectedEventID = multi.realEvent.eventIdentifier
            //     selectedEventPartialStart = multi.dateInterval.start
            // } else if let wrap = descriptor as? EKWrapper {
            //     selectedEventID = wrap.ekEvent.eventIdentifier
            //     selectedEventPartialStart = nil
            // }

            if let multi = descriptor as? EKMultiDayWrapper {
                let ev = multi.realEvent
                if ev.hasRecurrenceRules {
                    askUserForRecurring(event: ev, newDate: newDate, isResize: isResize)
                } else {
                    if !isResize {
                        applyDragChanges(ev, newStartDate: newDate, span: .thisEvent)
                    } else {
                        applyResizeChanges(ev, descriptor: multi, forcedNewDate: newDate, span: .thisEvent)
                    }
                }
            } else if let wrap = descriptor as? EKWrapper {
                let ev = wrap.ekEvent
                if ev.hasRecurrenceRules {
                    askUserForRecurring(event: ev, newDate: newDate, isResize: isResize)
                } else {
                    if !isResize {
                        applyDragChanges(ev, newStartDate: newDate, span: .thisEvent)
                    } else {
                        applyResizeChanges(ev, descriptor: wrap, forcedNewDate: newDate, span: .thisEvent)
                    }
                }
            }
        }

        // MARK: - Ако има серия (Recurring)
        func askUserForRecurring(event: EKEvent, newDate: Date, isResize: Bool) {
            let alert = UIAlertController(title: "Recurring Event",
                                          message: "This event is part of a series. Update which events?",
                                          preferredStyle: .actionSheet)
            alert.addAction(UIAlertAction(title: "This Event Only", style: .default, handler: { _ in
                if !isResize {
                    self.applyDragChanges(event, newStartDate: newDate, span: .thisEvent)
                } else {
                    self.applyResizeChanges(event, descriptor: nil, forcedNewDate: newDate, span: .thisEvent)
                }
            }))
            alert.addAction(UIAlertAction(title: "All Future Events", style: .default, handler: { _ in
                if !isResize {
                    self.applyDragChanges(event, newStartDate: newDate, span: .futureEvents)
                } else {
                    self.applyResizeChanges(event, descriptor: nil, forcedNewDate: newDate, span: .futureEvents)
                }
            }))
            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: { _ in
                self.reloadCurrentRange()
            }))

            if let wnd = UIApplication.shared.windows.first,
               let root = wnd.rootViewController {
                alert.popoverPresentationController?.sourceView = root.view
                root.present(alert, animated: true)
            } else {
                UIApplication.shared.keyWindow?.rootViewController?.present(alert, animated: true)
            }
        }

        // MARK: - При преместване (Drag)
        func applyDragChanges(_ event: EKEvent, newStartDate: Date, span: EKSpan) {
            guard let oldStart = event.startDate, let oldEnd = event.endDate else { return }
            let dur = oldEnd.timeIntervalSince(oldStart)
            event.startDate = newStartDate
            event.endDate   = newStartDate.addingTimeInterval(dur)
            do {
                try parent.eventStore.save(event, span: span)
            } catch {
                print("Error saving event: \(error)")
            }
            reloadCurrentRange()
        }

        // MARK: - При Resize
        func applyResizeChanges(_ event: EKEvent,
                                descriptor: EventDescriptor?,
                                forcedNewDate: Date,
                                span: EKSpan) {
            if let multi = descriptor as? EKMultiDayWrapper {
                let originalInterval = multi.dateInterval
                let distanceToStart = forcedNewDate.timeIntervalSince(originalInterval.start)
                let distanceToEnd   = originalInterval.end.timeIntervalSince(forcedNewDate)
                if distanceToStart < distanceToEnd {
                    // top
                    if forcedNewDate < event.endDate {
                        event.startDate = forcedNewDate
                    }
                } else {
                    // bottom
                    if forcedNewDate > event.startDate {
                        event.endDate = forcedNewDate
                    }
                }
            }
            else if let wrap = descriptor as? EKWrapper {
                let oldInterval = wrap.dateInterval
                let distanceToStart = forcedNewDate.timeIntervalSince(oldInterval.start)
                let distanceToEnd   = oldInterval.end.timeIntervalSince(forcedNewDate)
                if distanceToStart < distanceToEnd {
                    // top
                    if forcedNewDate < oldInterval.end {
                        event.startDate = forcedNewDate
                    }
                } else {
                    // bottom
                    if forcedNewDate > oldInterval.start {
                        event.endDate = forcedNewDate
                    }
                }
            } else {
                // fallback
                let oldDur = event.endDate.timeIntervalSince(event.startDate)
                let distanceToStart = forcedNewDate.timeIntervalSince(event.startDate)
                let distanceToEnd   = event.endDate.timeIntervalSince(forcedNewDate)
                if distanceToStart < distanceToEnd {
                    // top
                    if forcedNewDate < event.endDate {
                        event.startDate = forcedNewDate
                        if forcedNewDate > event.endDate {
                            event.endDate = forcedNewDate.addingTimeInterval(3600)
                        }
                    }
                } else {
                    // bottom
                    if forcedNewDate > event.startDate {
                        event.endDate = forcedNewDate
                        if forcedNewDate < event.startDate {
                            event.startDate = forcedNewDate.addingTimeInterval(-oldDur)
                        }
                    }
                }
            }

            do {
                try parent.eventStore.save(event, span: span)
            } catch {
                print("Error saving event: \(error)")
            }
            reloadCurrentRange()
        }
    }
}
