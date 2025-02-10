import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

/// A SwiftUI wrapper that uses the custom `TwoWayPinnedWeekContainerView` for a horizontal “week” layout.
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

        let parentVC: UIViewController? = vc

        // Initial data
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // Handling week changes
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate
            context.coordinator.reloadCurrentWeek()
        }

        // Tapping an event -> open the system’s EKEventEditView
        container.onEventTap = { [weak parentVC] descriptor in
            guard let parentVC = parentVC else { return }
            // If it’s an EKWrapper or EKMultiDayWrapper
            if let ekWrap = descriptor as? EKWrapper {
                let editVC = EKEventEditViewController()
                editVC.eventStore = self.eventStore
                editVC.event = ekWrap.ekEvent
                editVC.editViewDelegate = context.coordinator
                parentVC.present(editVC, animated: true)
            } else if let multi = descriptor as? EKMultiDayWrapper {
                let editVC = EKEventEditViewController()
                editVC.eventStore = self.eventStore
                editVC.event = multi.ekEvent
                editVC.editViewDelegate = context.coordinator
                parentVC.present(editVC, animated: true)
            }
        }

        // Long press on empty slot -> create a new event
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

        // Drag/Drop the entire event
        container.onEventDragEnded = { descriptor, newDate in
            context.coordinator.handleEventDragOrResize(descriptor: descriptor,
                                                        newDate: newDate,
                                                        isResize: false)
        }

        // Resize
        container.onEventDragResizeEnded = { descriptor, newDate in
            context.coordinator.handleEventDragOrResize(descriptor: descriptor,
                                                        newDate: newDate,
                                                        isResize: true)
        }

        // Tapping a day label
        container.onDayLabelTap = { date in
            onDayLabelTap?(date)
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

    // Splits out all-day vs normal
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

        // On close of EKEventEditViewController
        public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction) {
            controller.dismiss(animated: true) {
                self.reloadCurrentWeek()
            }
        }

        // Reload the current week
        public func reloadCurrentWeek() {
            let start = parent.startOfWeek
            guard let end = Calendar.current.date(byAdding: .day, value: 7, to: start) else { return }
            
            // Извличаме всички събития в седмичния интервал.
            let found = parent.eventStore.events(
                matching: parent.eventStore.predicateForEvents(withStart: start,
                                                               end: end,
                                                               calendars: nil)
            )
            
            var splitted = [EventDescriptor]()
            let cal = Calendar.current
            
            for ekEvent in found {
                guard let realStart = ekEvent.startDate,
                      let realEnd   = ekEvent.endDate else { continue }
                
                // Изчисляваме разликата в дни между началната и крайната дата.
                let dayDifference = cal.dateComponents([.day], from: realStart, to: realEnd).day ?? 0
                
                if dayDifference > 0 {
                    // Ако събитието спанава повече от един ден – разделяме го.
                    splitted.append(contentsOf: splitEventByDays(ekEvent,
                                                                 startOfWeek: start,
                                                                 endOfWeek: end))
                } else {
                    // Ако е в рамките на един ден – създаваме обикновен wrapper.
                    splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
                }
            }
            
            // Ако има избрано събитие от предишна селекция, опитваме да го подберем отново.
            if let lastID = selectedEventID {
                if let sameEvent = splitted
                    .compactMap({ $0 as? EKMultiDayWrapper })
                    .first(where: { $0.ekEvent.eventIdentifier == lastID }) {
                    sameEvent.editedEvent = sameEvent
                }
            }
            
            parent.events = splitted
        }


        private func splitEventByDays(_ ekEvent: EKEvent,
                                      startOfWeek: Date,
                                      endOfWeek: Date) -> [EKMultiDayWrapper] {
            var results = [EKMultiDayWrapper]()
            let cal = Calendar.current

            guard let realStart = ekEvent.startDate,
                  let realEnd   = ekEvent.endDate else {
                return results
            }

            // Ограничаваме интервала до [startOfWeek, endOfWeek]
            var currentStart = max(realStart, startOfWeek)
            let finalEnd = min(realEnd, endOfWeek)
            if currentStart >= finalEnd { return results }

            // Стъпковото разделяне на всеки ден.
            while currentStart < finalEnd {
                guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart) else {
                    break
                }
                let pieceEnd = min(endOfDay, finalEnd)
                let partial = EKMultiDayWrapper(realEvent: ekEvent,
                                                partialStart: currentStart,
                                                partialEnd: pieceEnd)
                results.append(partial)

                // Превключваме към следващия ден (00:00)
                guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                      let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay) else {
                    break
                }
                currentStart = morning
            }
            return results
        }


        // Called by onEventDragEnded or onEventDragResizeEnded
        func handleEventDragOrResize(descriptor: EventDescriptor,
                                     newDate: Date,
                                     isResize: Bool) {
            // If recurring, show an action sheet. Otherwise, just apply
            if let ekw = descriptor as? EKWrapper {
                // single-day
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
                    if !isResize {
                        applyDragChangesAndSave(ev: ev, newStartDate: newDate, span: .thisEvent)
                    } else {
                        applyResizeChangesAndSave(ev: ev, descriptor: multi, span: .thisEvent, forcedNewDate: newDate)
                    }
                }
            }
        }

        // Show an action sheet for recurring events
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

            // iPad popover anchor
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

        func applyDragChangesAndSave(ev: EKEvent, newStartDate: Date, span: EKSpan) {
            guard let oldStart = ev.startDate, let oldEnd = ev.endDate else { return }
            let duration = oldEnd.timeIntervalSince(oldStart)

            ev.startDate = newStartDate
            ev.endDate   = newStartDate.addingTimeInterval(duration)

            do {
                try parent.eventStore.save(ev, span: span)
            } catch {
                print("Error: \(error)")
            }
            reloadCurrentWeek()
        }

        func applyResizeChangesAndSave(ev: EKEvent,
                                       descriptor: EventDescriptor?,
                                       span: EKSpan,
                                       forcedNewDate: Date? = nil) {
            if let desc = descriptor {
                // Use the descriptor’s updated dateInterval
                ev.startDate = desc.dateInterval.start
                ev.endDate   = desc.dateInterval.end
            } else if let forced = forcedNewDate {
                guard let oldStart = ev.startDate,
                      let oldEnd = ev.endDate else { return }
                let oldDuration = oldEnd.timeIntervalSince(oldStart)
                ev.startDate = forced
                ev.endDate   = forced.addingTimeInterval(oldDuration)
            }

            do {
                try parent.eventStore.save(ev, span: span)
            } catch {
                print("Error: \(error)")
            }
            reloadCurrentWeek()
        }
    }
}
