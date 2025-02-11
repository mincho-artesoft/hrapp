import SwiftUI
import CalendarKit
import EventKit
import EventKitUI
import UniformTypeIdentifiers

public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]
    let eventStore: EKEventStore

    /// Called when user taps a day label (e.g. to jump to Day View).
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

        // Initial data: разделяме събитията на all-day и regular.
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // Handling week changes
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate
            context.coordinator.reloadCurrentWeek()
        }

        // Тап върху събитие -> отваряме системния редактор
        container.onEventTap = { [weak vc] descriptor in
            guard let vc = vc else { return }
            if let ekWrap = descriptor as? EKWrapper {
                let editVC = EKEventEditViewController()
                editVC.eventStore = self.eventStore
                editVC.event = ekWrap.ekEvent
                editVC.editViewDelegate = context.coordinator
                vc.present(editVC, animated: true)
            } else if let multi = descriptor as? EKMultiDayWrapper {
                let editVC = EKEventEditViewController()
                editVC.eventStore = self.eventStore
                editVC.event = multi.ekEvent
                editVC.editViewDelegate = context.coordinator
                vc.present(editVC, animated: true)
            }
        }

        // Long press върху празна зона -> създаваме ново събитие
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

        // Drag/Drop на събитие
        container.onEventDragEnded = { descriptor, newDate in
            context.coordinator.handleEventDragOrResize(descriptor: descriptor, newDate: newDate, isResize: false)
        }
        container.onEventDragResizeEnded = { descriptor, newDate in
            context.coordinator.handleEventDragOrResize(descriptor: descriptor, newDate: newDate, isResize: true)
        }

        // Тап върху ден label
        container.onDayLabelTap = { date in
            self.onDayLabelTap?(date)
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

    // MARK: - updateUIViewController
    public func updateUIViewController(_ uiViewController: UIViewController, context: Context) {
        guard let container = uiViewController.view.subviews.first(where: { $0 is TwoWayPinnedWeekContainerView }) as? TwoWayPinnedWeekContainerView else { return }
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

    // MARK: - Helper: split all-day vs regular events
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

    // MARK: - Coordinator
    public class Coordinator: NSObject, EKEventEditViewDelegate {
        let parent: TwoWayPinnedWeekWrapper
        var selectedEventID: String?

        init(_ parent: TwoWayPinnedWeekWrapper) {
            self.parent = parent
        }

        // При затваряне на EKEventEditViewController
        public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction) {
            controller.dismiss(animated: true) {
                self.reloadCurrentWeek()
            }
        }

        // Зареждаме текущата седмица и разделяме събитията (split)
        public func reloadCurrentWeek() {
            let start = parent.startOfWeek
            guard let end = Calendar.current.date(byAdding: .day, value: 7, to: start) else { return }

            let found = parent.eventStore.events(
                matching: parent.eventStore.predicateForEvents(withStart: start,
                                                               end: end,
                                                               calendars: nil)
            )
            var splitted = [EventDescriptor]()
            let cal = Calendar.current

            for ekEvent in found {
                guard let realStart = ekEvent.startDate,
                      let realEnd = ekEvent.endDate else { continue }

                if cal.isDate(realStart, inSameDayAs: realEnd) {
                    splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
                } else {
                    splitted.append(contentsOf: self.splitEventByDays(ekEvent, startOfWeek: start, endOfWeek: end))
                }
            }

            if let lastID = selectedEventID {
                if let sameEvent = splitted
                    .compactMap({ $0 as? EKMultiDayWrapper })
                    .first(where: { $0.ekEvent.eventIdentifier == lastID }) {
                    sameEvent.editedEvent = sameEvent
                }
            }

            parent.events = splitted
        }

        // Функция за разделяне на многодневни събития – генерира partial wrappers за всеки ден
        private func splitEventByDays(_ ekEvent: EKEvent,
                                      startOfWeek: Date,
                                      endOfWeek: Date) -> [EKMultiDayWrapper] {
            var results = [EKMultiDayWrapper]()
            let cal = Calendar.current

            guard let realStart = ekEvent.startDate,
                  let realEnd = ekEvent.endDate else { return results }

            var currentStart = max(realStart, startOfWeek)
            let finalEnd = min(realEnd, endOfWeek)
            if currentStart >= finalEnd { return results }

            while currentStart < finalEnd {
                guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart) else { break }
                let pieceEnd = min(endOfDay, finalEnd)
                let partial = EKMultiDayWrapper(realEvent: ekEvent,
                                                partialStart: currentStart,
                                                partialEnd: pieceEnd)
                results.append(partial)
                guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                      let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay) else { break }
                currentStart = morning
            }
            return results
        }

        // MARK: - Обработка на Drag / Resize
        public func handleEventDragOrResize(descriptor: EventDescriptor,
                                            newDate: Date,
                                            isResize: Bool) {
            if let ekw = descriptor as? EKWrapper {
                let ev = ekw.ekEvent
                if ev.hasRecurrenceRules {
                    askUserAndSaveRecurring(event: ev, newStartDate: newDate, isResize: isResize)
                } else {
                    selectedEventID = ev.eventIdentifier
                    if !isResize {
                        applyDragChangesAndSave(ev: ev, newStartDate: newDate, span: .thisEvent)
                    } else {
                        applyResizeChangesAndSave(ev: ev, descriptor: ekw, span: .thisEvent, forcedNewDate: newDate)
                    }
                }
            } else if let multi = descriptor as? EKMultiDayWrapper {
                let ev = multi.realEvent
                if ev.hasRecurrenceRules {
                    askUserAndSaveRecurring(event: ev, newStartDate: newDate, isResize: isResize)
                } else {
                    selectedEventID = ev.eventIdentifier
                    let calendar = Calendar.current
                    let draggedDay = calendar.startOfDay(for: multi.dateInterval.start)
                    let originalDay = calendar.startOfDay(for: ev.startDate)
                    var adjustedNewDate = newDate
                    // Ако денят на partial wrapper-а не съвпада с деня на реалното начало,
                    // изчисляваме offset и го прибавяме.
                    if draggedDay != originalDay {
                        let offset = ev.startDate.timeIntervalSince(multi.dateInterval.start)
                        adjustedNewDate = newDate.addingTimeInterval(offset)
                    }
                    if !isResize {
                        applyDragChangesAndSave(ev: ev, newStartDate: adjustedNewDate, span: .thisEvent)
                    } else {
                        applyResizeChangesAndSave(ev: ev, descriptor: multi, span: .thisEvent, forcedNewDate: adjustedNewDate)
                    }
                }
            }
        }

        func askUserAndSaveRecurring(event: EKEvent,
                                     newStartDate: Date,
                                     isResize: Bool) {
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
                self.reloadCurrentWeek()
            }

            alert.addAction(onlyThis)
            alert.addAction(future)
            alert.addAction(cancel)

            if let wnd = UIApplication.shared.windows.first,
               let root = wnd.rootViewController {
                alert.popoverPresentationController?.sourceView = root.view
                alert.popoverPresentationController?.sourceRect = CGRect(x: root.view.bounds.midX,
                                                                         y: root.view.bounds.midY,
                                                                         width: 0, height: 0)
                alert.popoverPresentationController?.permittedArrowDirections = []
                root.present(alert, animated: true)
            } else {
                UIApplication.shared.keyWindow?.rootViewController?.present(alert, animated: true)
            }
        }

        // Модифициран метод за прилагане на Resize промените.
        // При resize от горната дръжка (forcedNewDate по-малко от ev.startDate) се променя само началната дата,
        // а крайната остава непроменена.
        func applyResizeChangesAndSave(ev: EKEvent,
                                       descriptor: EventDescriptor?,
                                       span: EKSpan,
                                       forcedNewDate: Date? = nil) {
            if let forced = forcedNewDate, let multiWrapper = descriptor as? EKMultiDayWrapper {
                // Използваме оригиналния интервал от wrapper-а
                let originalInterval = multiWrapper.dateInterval
                // Изчисляваме разликите от началото и края
                let distanceToStart = forced.timeIntervalSince(originalInterval.start)
                let distanceToEnd = originalInterval.end.timeIntervalSince(forced)
                
                // Ако новата дата е по-близо до началото – смятаме, че е ресайз отгоре
                if distanceToStart < distanceToEnd {
                    // Уверяваме се, че forced е по-малко от текущия endDate
                    if forced < ev.endDate {
                        ev.startDate = forced
                    }
                } else {
                    // В противен случай – ресайз отдолу: ако forced е по-голяма от startDate
                    if forced > ev.startDate {
                        ev.endDate = forced
                    }
                }
            } else if let desc = descriptor {
                ev.startDate = desc.dateInterval.start
                ev.endDate = desc.dateInterval.end
            } else if let forced = forcedNewDate {
                let oldDuration = ev.endDate.timeIntervalSince(ev.startDate)
                ev.startDate = forced
                ev.endDate = forced.addingTimeInterval(oldDuration)
            }
            do {
                try parent.eventStore.save(ev, span: span)
            } catch {
                print("Error saving event: \(error)")
            }
            reloadCurrentWeek()
        }


        func applyDragChangesAndSave(ev: EKEvent, newStartDate: Date, span: EKSpan) {
            guard let oldStart = ev.startDate, let oldEnd = ev.endDate else { return }
            let duration = oldEnd.timeIntervalSince(oldStart)
            ev.startDate = newStartDate
            ev.endDate = newStartDate.addingTimeInterval(duration)
            do {
                try parent.eventStore.save(ev, span: span)
            } catch {
                print("Error saving event: \(error)")
            }
            reloadCurrentWeek()
        }
    }
}
