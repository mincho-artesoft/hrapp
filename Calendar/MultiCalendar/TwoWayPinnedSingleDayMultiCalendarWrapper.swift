import SwiftUI
import EventKitUI
import EventKit

// MARK: - TwoWayPinnedMultiDayMultiCalendarWrapper
public struct TwoWayPinnedSingleDayMultiCalendarWrapper: UIViewControllerRepresentable {
    
    @Binding var fromDate: Date
    @Binding var events: [EventDescriptor]
    
    let eventStore: EKEventStore
    
    var selectedTab: Int
    var onViewChange: ((Int)->Void)?
    
    public var onDayLabelTap: ((Date) -> Void)?

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()
        
        let container = TwoWayPinnedSingleDayMultiCalendarContainerView()
        
        container.fromDate = fromDate
        
        // Ако имате нужда да настройвате/подавате събития:
        let (allDay, regular) = splitAllDay(events)
        container.allDayView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes  = regular.map { EventLayoutAttributes($0) }
        
        // CALLBACK-и
        container.onRangeChange = { newFrom, newTo in
            fromDate = newFrom
            context.coordinator.reloadCurrentRange()
        }
        
        container.onEventTap = { descriptor in
            if let multi = descriptor as? EKMultiDayWrapper {
                context.coordinator.presentSystemEditor(multi.ekEvent, in: vc)
            }
        }
        
        container.onEmptyLongPress = {date, calendar in
            context.coordinator.createNewEventAndPresent(date: date, in: vc, preselectedCalendar: calendar)
        }

        container.allDayView.onEmptyLongPress = { date, calendar in
            context.coordinator.createAllDayEventAndPresent(date: date, in: vc, preselectedCalendar: calendar)
        }
        
        container.onEventDragEnded = { descriptor, newDate, isAllDay in
            context.coordinator.handleEventDragOrResize(
                descriptor: descriptor,
                newDate: newDate,
                isResize: false,
                isAllDay: isAllDay
            )
        }
        container.onEventDragResizeEnded = { descriptor, newDate in
            context.coordinator.handleEventDragOrResize(
                descriptor: descriptor,
                newDate: newDate,
                isResize: true,
                isAllDay: false
            )
        }
        
        container.onDayLabelTap = { day in
            onDayLabelTap?(day)
        }
        
        // Настройки за типа изглед (Day, MultiDay и т.н.)
        container.currentView = selectedTab
        container.onViewChange = onViewChange
        
        // Бутон “+”
        container.onAddNewEvent = {
            context.coordinator.createNewEventAndPresent(date: Date(), in: vc)
        }
        
        // НОВО: Когато потребителят промени селекцията на календарите:
        container.onCalendarsSelectionChanged = {
            // Координаторът презарежда събитията
            context.coordinator.reloadCurrentRange()
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
                .first(where: { $0 is TwoWayPinnedSingleDayMultiCalendarContainerView })
                as? TwoWayPinnedSingleDayMultiCalendarContainerView else {
            return
        }
        
        container.fromDate = fromDate
        
        let (allDay, regular) = splitAllDay(events)
        container.allDayView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes  = regular.map { EventLayoutAttributes($0) }
        
        container.currentView = selectedTab
        container.onViewChange = onViewChange
        
        container.setNeedsLayout()
        container.layoutIfNeeded()
    }
    
    private func splitAllDay(_ evts: [EventDescriptor]) -> ([EventDescriptor], [EventDescriptor]) {
        var allDay = [EventDescriptor]()
        var regular = [EventDescriptor]()
        for e in evts {
            if e.isAllDay { allDay.append(e) }
            else { regular.append(e) }
        }
        return (allDay, regular)
    }
    
    public func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    // MARK: - Coordinator
    public class Coordinator: NSObject, @preconcurrency EKEventEditViewDelegate {
        let parent: TwoWayPinnedSingleDayMultiCalendarWrapper
        
        init(_ parent: TwoWayPinnedSingleDayMultiCalendarWrapper) {
            self.parent = parent
        }
        
        @MainActor public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction) {
            controller.dismiss(animated: true) {
                self.reloadCurrentRange()
            }
        }
        
        @MainActor public func reloadCurrentRange() {
            let cal = Calendar.current
            let fromOnly = cal.startOfDay(for: parent.fromDate)
            // от утрото на parent.fromDate до +1 ден
            guard let actualEnd = cal.date(byAdding: .day, value: 1, to: fromOnly) else {
                parent.events = []
                return
            }
            
            // Вземаме само ЛОКАЛНИ календари, и само "selected"
            let localCalendars = CalendarViewModel.shared.allCalendars.filter {
                $0.source.sourceType == .local &&
                (CalendarViewModel.shared.calendarsDict[$0.calendarIdentifier]?.selected == true)
            }

            let predicate = parent.eventStore.predicateForEvents(
                withStart: fromOnly,
                end: actualEnd,
                calendars: localCalendars
            )
            let found = parent.eventStore.events(matching: predicate)
            
            var splitted: [EventDescriptor] = []
            for ekEvent in found {
                let startDay = cal.startOfDay(for: ekEvent.startDate)
                let endDay   = cal.startOfDay(for: ekEvent.endDate)
                
                // Ако обхваща повече от 1 ден => split
                if startDay != endDay {
                    splitted.append(contentsOf:
                        splitEventByDays(ekEvent,
                                         startRange: fromOnly,
                                         endRange: actualEnd)
                    )
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
        
        @MainActor public func presentSystemEditor(_ ekEvent: EKEvent, in parentVC: UIViewController) {
            let editVC = EKEventEditViewController()
            editVC.eventStore = parent.eventStore
            editVC.event = ekEvent
            editVC.editViewDelegate = self
            parentVC.present(editVC, animated: true)
        }
        
        @MainActor
        public func createNewEventAndPresent(
            date: Date,
            in parentVC: UIViewController,
            preselectedCalendar: EKCalendar? = nil
        ) {
            let newEvent = EKEvent(eventStore: parent.eventStore)
            newEvent.title     = "New event"
            newEvent.startDate = date
            newEvent.endDate   = date.addingTimeInterval(3600)

            // Ако имаме избран календар, ползваме него; иначе default
            if let cal = preselectedCalendar {
                newEvent.calendar = cal
            } else {
                newEvent.calendar = parent.eventStore.defaultCalendarForNewEvents
            }

            presentSystemEditor(newEvent, in: parentVC)
        }


        
        @MainActor public func createAllDayEventAndPresent(date: Date, in parentVC: UIViewController,  preselectedCalendar: EKCalendar? = nil) {
            let newEvent = EKEvent(eventStore: parent.eventStore)
            newEvent.title = "All-day event"
            newEvent.calendar = parent.eventStore.defaultCalendarForNewEvents
            newEvent.isAllDay = true
            newEvent.startDate = date
            newEvent.endDate   = date
            if let cal = preselectedCalendar {
                newEvent.calendar = cal
            } else {
                newEvent.calendar = parent.eventStore.defaultCalendarForNewEvents
            }
            presentSystemEditor(newEvent, in: parentVC)
        }
        
        @MainActor public func handleEventDragOrResize(
            descriptor: EventDescriptor,
            newDate: Date,
            isResize: Bool,
            isAllDay: Bool
        ) {
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
            }
        }
        
        @MainActor public func askUserForRecurring(event: EKEvent, newDate: Date, isResize: Bool) {
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
            
            if let windowScene = UIApplication.shared.connectedScenes
                .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
               let window = windowScene.windows.first(where: { $0.isKeyWindow }),
               let root = window.rootViewController {
                alert.popoverPresentationController?.sourceView = root.view
                root.present(alert, animated: true)
            }
        }
        
        @MainActor public func applyDragChanges(
            _ event: EKEvent,
            newStartDate: Date,
            span: EKSpan,
            isAllDay: Bool
        ) {
            guard let oldStart = event.startDate, let oldEnd = event.endDate else { return }
            if isAllDay {
                event.startDate = newStartDate
                event.endDate   = newStartDate.addingTimeInterval(3600)
            } else {
                let duration = oldEnd.timeIntervalSince(oldStart)
                event.startDate = newStartDate
                event.endDate   = newStartDate.addingTimeInterval(duration)
            }
            do {
                try parent.eventStore.save(event, span: span)
            } catch {
                print("Error saving event: \(error)")
            }
            reloadCurrentRange()
        }
        
        @MainActor public func applyResizeChanges(
            _ event: EKEvent,
            descriptor: EventDescriptor?,
            forcedNewDate: Date,
            span: EKSpan
        ) {
            if let multi = descriptor as? EKMultiDayWrapper {
                let originalInterval = multi.dateInterval
                let distanceToStart = forcedNewDate.timeIntervalSince(originalInterval.start)
                let distanceToEnd   = originalInterval.end.timeIntervalSince(forcedNewDate)
                // Ако хващаме горната част (start) или долната (end) при resize:
                if distanceToStart < distanceToEnd {
                    // resize отгоре (нов start)
                    if forcedNewDate < event.endDate {
                        event.startDate = forcedNewDate
                    }
                } else {
                    // resize отдолу (нов end)
                    if forcedNewDate > event.startDate {
                        event.endDate = forcedNewDate
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
