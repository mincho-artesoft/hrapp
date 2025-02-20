import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

/// SwiftUI-обвивка за TwoWayPinnedWeekContainerView,
/// която позволява извън него да се зададе дали да е Single-day или Multi-day.
public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var fromDate: Date
    @Binding var toDate: Date
    @Binding var events: [EventDescriptor]
    
    /// EventStore - подава се отвън
    let eventStore: EKEventStore
    
    /// НОВО: флаг дали да се показва като Single day
    /// (ако е true, ще видите само `fromDatePicker`, центриран,
    ///  а `toDatePicker` ще се скрие).
    var isSingleDay: Bool

    public var onDayLabelTap: ((Date) -> Void)?

    // MARK: - Инициализатор
    public init(
        fromDate: Binding<Date>,
        toDate: Binding<Date>,
        events: Binding<[EventDescriptor]>,
        eventStore: EKEventStore,
        // По подразбиране приемаме false => Multi-day
        isSingleDay: Bool = false,
        onDayLabelTap: ((Date) -> Void)? = nil
    ) {
        self._fromDate = fromDate
        self._toDate = toDate
        self._events = events
        self.eventStore = eventStore
        self.isSingleDay = isSingleDay
        self.onDayLabelTap = onDayLabelTap
    }

    // MARK: - makeUIViewController
    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()

        // Нашият UIView
        let container = TwoWayPinnedWeekContainerView()

        // Настройваме дали да е single-day или multi-day
        container.showSingleDay = isSingleDay

        // Задаваме началните дати
        container.fromDate = fromDate
        container.toDate   = toDate

        // Зареждаме all-day vs. regular
        let (allDay, regular) = splitAllDay(events)
        container.allDayView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes  = regular.map { EventLayoutAttributes($0) }

        // Callbacks
        container.onRangeChange = { newFrom, newTo in
            // Когато вътрешният изглед промени обхвата,
            // обновяваме нашите @State променливи
            fromDate = newFrom
            toDate   = newTo
            context.coordinator.reloadCurrentRange()
        }

        container.onEventTap = { descriptor in
            // При натискане на събитие -> отваряме system editor
            if let ekWrap = descriptor as? EKWrapper {
                context.coordinator.presentSystemEditor(ekWrap.ekEvent, in: vc)
            } else if let multi = descriptor as? EKMultiDayWrapper {
                context.coordinator.presentSystemEditor(multi.ekEvent, in: vc)
            }
        }

        container.onEmptyLongPress = { date in
            context.coordinator.createNewEventAndPresent(date: date, in: vc)
        }

        container.allDayView.onEmptyLongPress = { dayDate in
            context.coordinator.createAllDayEventAndPresent(date: dayDate, in: vc)
        }

        container.onEventDragEnded = { descriptor, newDate, isAllDay in
            context.coordinator.handleEventDragOrResize(descriptor: descriptor,
                                                        newDate: newDate,
                                                        isResize: false,
                                                        isAllDay: isAllDay)
        }

        container.onEventDragResizeEnded = { descriptor, newDate in
            context.coordinator.handleEventDragOrResize(descriptor: descriptor,
                                                        newDate: newDate,
                                                        isResize: true,
                                                        isAllDay: false)
        }

        container.onDayLabelTap = { tappedDay in
            onDayLabelTap?(tappedDay)
        }

        // Добавяме като subview във ViewController-а
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

    // MARK: - updateUIViewController
    public func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        guard let container = uiViewController.view.subviews
                .first(where: { $0 is TwoWayPinnedWeekContainerView })
                as? TwoWayPinnedWeekContainerView else {
            return
        }

        // Променяме single/multi
        container.showSingleDay = isSingleDay

        // Обновяваме датите
        container.fromDate = fromDate
        container.toDate   = toDate

        // Обновяваме събитията
        let (allDay, regular) = splitAllDay(events)
        container.allDayView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes  = regular.map { EventLayoutAttributes($0) }

        // Принуждаваме layout, ако има промени
        container.setNeedsLayout()
        container.layoutIfNeeded()
    }

    // MARK: - Подпомагаща функция: отделяме all-day от редовни събития
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

    // MARK: - makeCoordinator
    public func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    // MARK: - Coordinator (EKEventEditViewDelegate)
    public class Coordinator: NSObject, @preconcurrency EKEventEditViewDelegate {
        let parent: TwoWayPinnedWeekWrapper

        init(_ parent: TwoWayPinnedWeekWrapper) {
            self.parent = parent
        }

        // Делегатен метод на EKEventEditViewController
        @MainActor
        public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction) {
            controller.dismiss(animated: true) {
                self.reloadCurrentRange()
            }
        }


        @MainActor
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
                      let realEnd = ekEvent.endDate else {
                    continue
                }
                // Ако се простира няколко дни - режем го
                if cal.startOfDay(for: realStart) != cal.startOfDay(for: realEnd) {
                    splitted.append(contentsOf: splitEventByDays(ekEvent,
                                                                 startRange: fromOnly,
                                                                 endRange: actualEnd))
                } else {
                    splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
                }
            }
            parent.events = splitted
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

        @MainActor
        func presentSystemEditor(_ ekEvent: EKEvent, in parentVC: UIViewController) {
            let editVC = EKEventEditViewController()
            editVC.eventStore = parent.eventStore
            editVC.event = ekEvent
            editVC.editViewDelegate = self
            parentVC.present(editVC, animated: true)
        }

        @MainActor
        func createNewEventAndPresent(date: Date, in parentVC: UIViewController) {
            let newEvent = EKEvent(eventStore: parent.eventStore)
            newEvent.title = "New event"
            newEvent.calendar = parent.eventStore.defaultCalendarForNewEvents
            newEvent.startDate = date
            newEvent.endDate   = date.addingTimeInterval(3600)
            presentSystemEditor(newEvent, in: parentVC)
        }

        @MainActor
        func createAllDayEventAndPresent(date: Date, in parentVC: UIViewController) {
            let newEvent = EKEvent(eventStore: parent.eventStore)
            newEvent.title = "All-day event"
            newEvent.calendar = parent.eventStore.defaultCalendarForNewEvents
            newEvent.isAllDay = true
            newEvent.startDate = date
            newEvent.endDate   = date
            presentSystemEditor(newEvent, in: parentVC)
        }

        @MainActor
        func handleEventDragOrResize(descriptor: EventDescriptor, newDate: Date, isResize: Bool, isAllDay: Bool) {
            // Проверяваме кой wrapper имаме
            if let multi = descriptor as? EKMultiDayWrapper {
                let ev = multi.realEvent
                if ev.hasRecurrenceRules {
                    askUserForRecurring(event: ev, newDate: newDate, isResize: isResize)
                } else {
                    if !isResize {
                        applyDragChanges(ev, newStartDate: newDate, span: .thisEvent, isAllDay: isAllDay)
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
                        applyDragChanges(ev, newStartDate: newDate, span: .thisEvent, isAllDay: isAllDay)
                    } else {
                        applyResizeChanges(ev, descriptor: wrap, forcedNewDate: newDate, span: .thisEvent)
                    }
                }
            }
        }

        @MainActor
        func askUserForRecurring(event: EKEvent, newDate: Date, isResize: Bool) {
            let alert = UIAlertController(
                title: "Recurring Event",
                message: "This event is part of a series. Update which events?",
                preferredStyle: .actionSheet
            )
            alert.addAction(UIAlertAction(title: "This Event Only", style: .default, handler: { _ in
                if !isResize {
                    self.applyDragChanges(event, newStartDate: newDate, span: .thisEvent, isAllDay: false)
                } else {
                    self.applyResizeChanges(event, descriptor: nil, forcedNewDate: newDate, span: .thisEvent)
                }
            }))
            alert.addAction(UIAlertAction(title: "All Future Events", style: .default, handler: { _ in
                if !isResize {
                    self.applyDragChanges(event, newStartDate: newDate, span: .futureEvents, isAllDay: false)
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

        @MainActor
        func applyDragChanges(_ event: EKEvent, newStartDate: Date, span: EKSpan, isAllDay: Bool) {
            guard let oldStart = event.startDate, let oldEnd = event.endDate else { return }
            if isAllDay {
                event.startDate = newStartDate
                event.endDate   = newStartDate.addingTimeInterval(3600)
            } else {
                let dur = oldEnd.timeIntervalSince(oldStart)
                event.startDate = newStartDate
                event.endDate   = newStartDate.addingTimeInterval(dur)
            }

            do {
                try parent.eventStore.save(event, span: span)
            } catch {
                print("Error saving event: \(error)")
            }
            reloadCurrentRange()
        }

        @MainActor
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
                guard let oldStart = event.startDate,
                      let oldEnd = event.endDate else { return }
                let oldDur = oldEnd.timeIntervalSince(oldStart)
                let distanceToStart = forcedNewDate.timeIntervalSince(oldStart)
                let distanceToEnd   = oldEnd.timeIntervalSince(forcedNewDate)
                if distanceToStart < distanceToEnd {
                    // top
                    if forcedNewDate < oldEnd {
                        event.startDate = forcedNewDate
                        if forcedNewDate > oldEnd {
                            event.endDate = forcedNewDate.addingTimeInterval(3600)
                        }
                    }
                } else {
                    // bottom
                    if forcedNewDate > oldStart {
                        event.endDate = forcedNewDate
                        if forcedNewDate < oldStart {
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
