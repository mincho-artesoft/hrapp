import SwiftUI
import CalendarKit
import EventKit
import EventKitUI

public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]
    let eventStore: EKEventStore

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

        // Първоначално задаваме attributes
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // onWeekChange
        container.onWeekChange = { newStartDate in
            self.startOfWeek = newStartDate
            context.coordinator.reloadCurrentWeek()
        }

        // Тап върху евент -> отваряме EKEventEditViewController
        container.onEventTap = { [weak vc] descriptor in
            guard let parentVC = vc else { return }
            // descriptor вероятно е EKMultiDayWrapper
            let realEventToEdit: EKEvent
            if let multi = descriptor as? EKMultiDayWrapper {
                realEventToEdit = multi.realEvent
            }
            else if let ekw = descriptor as? EKWrapper {
                realEventToEdit = ekw.ekEvent
            }
            else {
                return
            }

            let editVC = EKEventEditViewController()
            editVC.eventStore = self.eventStore
            editVC.event = realEventToEdit // <-- тук отваряме ЦЯЛОТО събитие
            editVC.editViewDelegate = context.coordinator
            parentVC.present(editVC, animated: true)
        }

        // Дълго натискане в празно
        container.onEmptyLongPress = { [weak vc] date in
            guard let parentVC = vc else { return }
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

        // Drag/Drop
        container.onEventDragEnded = { descriptor, newDate in
            // descriptor ще е EKMultiDayWrapper или EKWrapper
            if let multi = descriptor as? EKMultiDayWrapper {
                context.coordinator.dragMultiDay(multi, newStartDate: newDate)
            } else if let ekw = descriptor as? EKWrapper {
                context.coordinator.dragEKWrapper(ekw, newStartDate: newDate)
            }
        }

        // Resize
        container.onEventDragResizeEnded = { descriptor, newDate in
            if let multi = descriptor as? EKMultiDayWrapper {
                context.coordinator.resizeMultiDay(multi, newDate: newDate)
            } else if let ekw = descriptor as? EKWrapper {
                context.coordinator.resizeEKWrapper(ekw, newDate: newDate)
            }
        }

        // Тап върху ден (DaysHeaderView)
        container.onDayLabelTap = { tappedDate in
            onDayLabelTap?(tappedDate)
        }

        // Добавяме container
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

    // MARK: - splitAllDay
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
        
        // Помним кое eventIdentifier е 'selected'
        var selectedEventID: String?

        init(_ parent: TwoWayPinnedWeekWrapper) {
            self.parent = parent
        }
        
        // EKEventEditViewDelegate
        public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction) {
            controller.dismiss(animated: true) {
                self.reloadCurrentWeek()
            }
        }

        // MARK: - reloadCurrentWeek
        public func reloadCurrentWeek() {
            let start = parent.startOfWeek
            guard let end = Calendar.current.date(byAdding: .day, value: 7, to: start) else { return }

            let foundEvents = parent.eventStore.events(
                matching: parent.eventStore.predicateForEvents(withStart: start,
                                                               end: end,
                                                               calendars: nil)
            )

            var splittedWrappers = [EventDescriptor]()
            for ev in foundEvents {
                // iOS17 -> startDate/endDate са optional:
                guard let s = ev.startDate, let e = ev.endDate else { continue }

                if Calendar.current.isDate(s, inSameDayAs: e) {
                    // Еднодневно => добавяме един EKMultiDayWrapper (без partial)
                    let wrap = EKMultiDayWrapper(realEvent: ev)
                    splittedWrappers.append(wrap)
                } else {
                    // Многодневно => split
                    splittedWrappers.append(contentsOf: splitEventMultiDay(ev, start, end))
                }
            }

            // Ако имаме selectedEventID -> маркираме всички
            if let lastID = selectedEventID {
                let splitted = splittedWrappers.compactMap { $0 as? EKMultiDayWrapper }
                for w in splitted where w.realEvent.eventIdentifier == lastID {
                    w.editedEvent = w
                }
            }

            parent.events = splittedWrappers
        }

        // Разцепва многодневно EKEvent на EKMultiDayWrapper за всеки ден
        private func splitEventMultiDay(_ ekEvent: EKEvent,
                                        _ startOfWeek: Date,
                                        _ endOfWeek: Date) -> [EKMultiDayWrapper] {
            var results = [EKMultiDayWrapper]()
            let cal = Calendar.current

            guard let realStart = ekEvent.startDate,
                  let realEnd   = ekEvent.endDate else { return results }

            var currentStart = max(realStart, startOfWeek)
            let finalEnd     = min(realEnd, endOfWeek)

            while currentStart < finalEnd {
                guard let endOfDay = cal.date(bySettingHour: 23, minute: 59, second: 59, of: currentStart) else {
                    break
                }
                let pieceEnd = min(endOfDay, finalEnd)

                let multi = EKMultiDayWrapper(realEvent: ekEvent,
                                              partialStart: currentStart,
                                              partialEnd:   pieceEnd)
                results.append(multi)

                // Отиваме на следващия ден
                guard let nextDay = cal.date(byAdding: .day, value: 1, to: currentStart),
                      let morning = cal.date(bySettingHour: 0, minute: 0, second: 0, of: nextDay) else {
                    break
                }
                currentStart = morning
            }
            return results
        }

        // MARK: - Drag / Resize (MultiDay wrapper)
        public func dragMultiDay(_ wrap: EKMultiDayWrapper, newStartDate: Date) {
            self.selectedEventID = wrap.realEvent.eventIdentifier

            // Вземаме стара продължителност
            guard let oldStart = wrap.realEvent.startDate,
                  let oldEnd   = wrap.realEvent.endDate else { return }
            let dur = oldEnd.timeIntervalSince(oldStart)

            wrap.realEvent.startDate = newStartDate
            wrap.realEvent.endDate   = newStartDate.addingTimeInterval(dur)

            do {
                try parent.eventStore.save(wrap.realEvent, span: .thisEvent)
            } catch {
                print("Error saving event: \(error)")
            }
            reloadCurrentWeek()
        }

        public func resizeMultiDay(_ wrap: EKMultiDayWrapper, newDate: Date) {
            self.selectedEventID = wrap.realEvent.eventIdentifier
            // Проверяваме дали влачим горния / долния край, но CalendarKit обикновено
            // ни дава само "newDate" => тук ще опростим:
            guard let oldStart = wrap.realEvent.startDate,
                  let oldEnd   = wrap.realEvent.endDate else { return }

            // Ако newDate < oldStart, значи сме местили горния край
            if newDate < oldStart {
                let dur = oldEnd.timeIntervalSince(oldStart)
                // Смъкваме старта
                wrap.realEvent.startDate = newDate
                // Ако искаме да запазим същата продължителност, тогава:
                wrap.realEvent.endDate   = newDate.addingTimeInterval(dur)
            } else {
                // Иначе вдигаме долния край
                wrap.realEvent.endDate = newDate
            }

            do {
                try parent.eventStore.save(wrap.realEvent, span: .thisEvent)
            } catch {
                print("Error saving event: \(error)")
            }
            reloadCurrentWeek()
        }

        // MARK: - Drag / Resize (EKWrapper) – за еднодневни (без MultiDay)
        public func dragEKWrapper(_ ekw: EKWrapper, newStartDate: Date) {
            self.selectedEventID = ekw.ekEvent.eventIdentifier

            guard let oldStart = ekw.ekEvent.startDate,
                  let oldEnd   = ekw.ekEvent.endDate else { return }
            let dur = oldEnd.timeIntervalSince(oldStart)

            ekw.ekEvent.startDate = newStartDate
            ekw.ekEvent.endDate   = newStartDate.addingTimeInterval(dur)

            do {
                try parent.eventStore.save(ekw.ekEvent, span: .thisEvent)
            } catch {
                print("Error: \(error)")
            }
            reloadCurrentWeek()
        }

        public func resizeEKWrapper(_ ekw: EKWrapper, newDate: Date) {
            self.selectedEventID = ekw.ekEvent.eventIdentifier

            guard let oldStart = ekw.ekEvent.startDate,
                  let oldEnd   = ekw.ekEvent.endDate else { return }

            if newDate < oldStart {
                let dur = oldEnd.timeIntervalSince(oldStart)
                ekw.ekEvent.startDate = newDate
                ekw.ekEvent.endDate   = newDate.addingTimeInterval(dur)
            } else {
                ekw.ekEvent.endDate = newDate
            }

            do {
                try parent.eventStore.save(ekw.ekEvent, span: .thisEvent)
            } catch {
                print("Error: \(error)")
            }
            reloadCurrentWeek()
        }

        // MARK: - askUserAndSaveRecurring
        public func askUserAndSaveRecurring(event: EKEvent,
                                            newStartDate: Date,
                                            isResize: Bool) {
            // Ако е recurring...
            let alert = UIAlertController(
                title: "Recurring Event",
                message: "This event is part of a series. How would you like to update it?",
                preferredStyle: .actionSheet
            )

            let onlyThis = UIAlertAction(title: "This Event Only", style: .default) { _ in
                if !isResize {
                    self.dragRecurring(event, newStartDate: newStartDate, span: .thisEvent)
                } else {
                    self.resizeRecurring(event, newDate: newStartDate, span: .thisEvent)
                }
            }
            let future = UIAlertAction(title: "All Future Events", style: .default) { _ in
                if !isResize {
                    self.dragRecurring(event, newStartDate: newStartDate, span: .futureEvents)
                } else {
                    self.resizeRecurring(event, newDate: newStartDate, span: .futureEvents)
                }
            }
            let cancel = UIAlertAction(title: "Cancel", style: .cancel) { _ in
                self.reloadCurrentWeek()
            }

            alert.addAction(onlyThis)
            alert.addAction(future)
            alert.addAction(cancel)

            // iPad popover
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

        private func dragRecurring(_ ev: EKEvent, newStartDate: Date, span: EKSpan) {
            self.selectedEventID = ev.eventIdentifier
            guard let oldStart = ev.startDate,
                  let oldEnd   = ev.endDate else { return }
            let dur = oldEnd.timeIntervalSince(oldStart)

            ev.startDate = newStartDate
            ev.endDate   = newStartDate.addingTimeInterval(dur)

            do {
                try parent.eventStore.save(ev, span: span)
            } catch {
                print("Error: \(error)")
            }
            reloadCurrentWeek()
        }

        private func resizeRecurring(_ ev: EKEvent, newDate: Date, span: EKSpan) {
            self.selectedEventID = ev.eventIdentifier
            guard let oldStart = ev.startDate,
                  let oldEnd   = ev.endDate else { return }

            if newDate < oldStart {
                let dur = oldEnd.timeIntervalSince(oldStart)
                ev.startDate = newDate
                ev.endDate   = newDate.addingTimeInterval(dur)
            } else {
                ev.endDate = newDate
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
