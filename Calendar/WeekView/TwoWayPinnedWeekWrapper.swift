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
                    context.coordinator.askUserAndSaveRecurring(
                        event: ev,
                        newStartDate: newDate,
                        isResize: false
                    )
                } else {
                    // Обикновен евент
                    context.coordinator.applyDragChangesAndSave(ev: ev, newStartDate: newDate, span: .thisEvent)
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
                    context.coordinator.applyResizeChangesAndSave(ev: ev, descriptor: descriptor, span: .thisEvent)
                }
            }
        }

        // Тап върху ден (DaysHeaderView)
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
        public func reloadCurrentWeek() {
            let start = parent.startOfWeek
            guard let end = Calendar.current.date(byAdding: .day, value: 7, to: start) else { return }

            // Теглим събития от eventStore
            let found = parent.eventStore.events(
                matching: parent.eventStore.predicateForEvents(withStart: start,
                                                               end: end,
                                                               calendars: nil)
            )

            // ------------------------------------------------------------------
            // Тук "разцепваме" (split) всяко многодневно EKEvent, за да се покаже
            // във всички дни (колони), които обхваща.
            // ------------------------------------------------------------------
            var splittedWrappers = [EventDescriptor]()
            for ekEvent in found {
                // Понеже в iOS17 EKEvent.startDate/endDate са Date?,
                // пазим ги safely:
                guard let realStart = ekEvent.startDate,
                      let realEnd   = ekEvent.endDate else {
                    // Ако липсва startDate/endDate, прескачаме
                    continue
                }

                // Ако е в рамките на 1 календарен ден (или нулева продължителност):
                if Calendar.current.isDate(realStart, inSameDayAs: realEnd) {
                    splittedWrappers.append(EKWrapper(eventKitEvent: ekEvent))
                } else {
                    // МНОГОДНЕВНО! -> split-ваме
                    let partials = splitEventByDays(ekEvent,
                                                    startOfWeek: start,
                                                    endOfWeek: end)
                    splittedWrappers.append(contentsOf: partials)
                }
            }

            // Ако имаме "selectedEventID" -> намираме същото събитие и го маркираме
            if let lastID = selectedEventID {
                if let sameEvent = splittedWrappers
                    .compactMap({ $0 as? EKWrapper })
                    .first(where: { $0.ekEvent.eventIdentifier == lastID }) {
                    sameEvent.editedEvent = sameEvent
                }
            }

            // Ъпдейтваме @Binding var events
            parent.events = splittedWrappers
        }

        /// Разцепва EKEvent на парчета за всеки ден, който пресича (в рамките на [startOfWeek..endOfWeek]).
        private func splitEventByDays(_ ekEvent: EKEvent,
                                      startOfWeek: Date,
                                      endOfWeek: Date) -> [EKWrapper] {
            var results = [EKWrapper]()
            let cal = Calendar.current

            // Безопасно опаковане:
            guard let realStart = ekEvent.startDate,
                  let realEnd   = ekEvent.endDate else {
                return results
            }

            // Коригираме, ако е извън седмицата
            var currentStart = max(realStart, startOfWeek)  // по-късната от 2 дати
            let finalEnd = min(realEnd, endOfWeek)          // по-ранната от 2 дати
            if currentStart >= finalEnd {
                return results
            }

            while currentStart < finalEnd {
                // Търсим края на деня (23:59:59), но не по-късно от finalEnd
                guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart) else {
                    break
                }
                let pieceEnd = min(endOfDay, finalEnd)

                // Създаваме *копие* на EKEvent (за да не променяме оригинала)
                let partialEvent = ekEvent.copy() as! EKEvent
                partialEvent.startDate = currentStart
                partialEvent.endDate   = pieceEnd

                results.append(EKWrapper(eventKitEvent: partialEvent))

                // Отиваме на следващия ден (00:00)
                guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                      let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay)
                else {
                    break
                }
                currentStart = morning
            }

            return results
        }

        // MARK: - Методи за Drag/Drop, Resize и Recurring
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
                UIApplication.shared.keyWindow?.rootViewController?.present(alert, animated: true)
            }
        }

        func applyDragChangesAndSave(ev: EKEvent,
                                     newStartDate: Date,
                                     span: EKSpan) {
            selectedEventID = ev.eventIdentifier
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
            selectedEventID = ev.eventIdentifier

            if let desc = descriptor {
                ev.startDate = desc.dateInterval.start
                ev.endDate   = desc.dateInterval.end
            } else if let newDt = forcedNewDate {
                guard let oldStart = ev.startDate,
                      let oldEnd   = ev.endDate else { return }

                let oldDuration = oldEnd.timeIntervalSince(oldStart)
                ev.startDate = newDt
                ev.endDate   = newDt.addingTimeInterval(oldDuration)
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
