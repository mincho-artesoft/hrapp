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
    
    public var onDayLabelTap: ((Date) -> Void)? = nil
    public var onMonthLabelTap: ((Date) -> Void)? = nil
    public var onEventSelectionChanged: ((EventDescriptor?) -> Void)? = nil

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()
        context.coordinator.presentationController = vc
        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        vc.view.semanticContentAttribute = semanticDirection
        
        let container = TwoWayPinnedSingleDayMultiCalendarContainerView()
        container.bottomScrollPadding = context.environment.calendarBottomClearance
        container.semanticContentAttribute = semanticDirection
        container.refreshCalendarSources()
        
        container.fromDate = fromDate
        container.onEventDeleted = { descriptor in
               // Анонимна функция, която вика reloadCurrentRange() през координатора:
               context.coordinator.reloadCurrentRange()
           }
           // 2) Когато евент се дублира
           container.onEventDuplicated = { descriptor in
               // Отново
               context.coordinator.reloadCurrentRange()
           }
           vc.view.addSubview(container)
        // Ако имате нужда да настройвате/подавате събития:
        let (allDay, regular) = splitAllDay(events)
        container.allDayView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes  = regular.map { EventLayoutAttributes($0) }
        context.coordinator.lastRenderedEvents = eventDescriptorPresentationKeys(events)
        
        // CALLBACK-и
        container.onRangeChange = { newFrom, newTo in
            context.coordinator.parent.onEventSelectionChanged?(nil)
            fromDate = newFrom
            context.coordinator.reloadCurrentRange()
        }
        
        container.onEventSelectionChanged = { descriptor in
            context.coordinator.parent.onEventSelectionChanged?(descriptor)
        }
        container.onEventTap = { descriptor in
            context.coordinator.parent.onEventSelectionChanged?(descriptor)
            if let local = descriptor as? AppLocalEventDescriptor {
                context.coordinator.presentAppLocalEditor(eventID: local.eventID, in: vc)
            } else if let multi = descriptor as? EKMultiDayWrapper {
                context.coordinator.presentSystemDetails(multi.ekEvent, in: vc)
            }
        }

        container.onEventEdit = { descriptor in
            if let local = descriptor as? AppLocalEventDescriptor {
                context.coordinator.presentAppLocalEditor(
                    eventID: local.eventID,
                    startsInEditingMode: true,
                    in: vc
                )
            } else if let multi = descriptor as? EKMultiDayWrapper {
                context.coordinator.presentSystemEditor(multi.ekEvent, in: vc)
            }
        }
        
        container.onEmptyLongPress = { interval, calendar in
            context.coordinator.createNewEventAndPresent(
                date: interval.start, in: vc, preselectedCalendarID: calendar, initialInterval: interval)
        }

        container.allDayView.onEmptyLongPress = { date, calendar in
            context.coordinator.createAllDayEventAndPresent(date: date, in: vc, preselectedCalendarID: calendar)
        }
        
        container.onEventDragEnded = { descriptor, newDate, isAllDay in
            context.coordinator.handleEventDragOrResize(
                descriptor: descriptor,
                newDate: newDate,
                isResize: false,
                isAllDay: isAllDay
            )
        }
        
        container.onEventsReload = {
            context.coordinator.reloadCurrentRange()
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

        container.onMonthLabelTap = { month in
            onMonthLabelTap?(month)
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
        context.coordinator.parent = self
        guard let container = uiViewController.view.subviews
                .first(where: { $0 is TwoWayPinnedSingleDayMultiCalendarContainerView })
                as? TwoWayPinnedSingleDayMultiCalendarContainerView else {
            return
        }
        container.bottomScrollPadding = context.environment.calendarBottomClearance

        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        uiViewController.view.semanticContentAttribute = semanticDirection
        container.semanticContentAttribute = semanticDirection
        container.refreshCalendarSources()
        
        if container.fromDate != fromDate {
            container.fromDate = fromDate
        }

        let presentation = eventDescriptorPresentationKeys(events)
        if context.coordinator.lastRenderedEvents != presentation {
            let (allDay, regular) = splitAllDay(events)
            container.allDayView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes  = regular.map { EventLayoutAttributes($0) }
            context.coordinator.lastRenderedEvents = presentation
        }

        if container.currentView != selectedTab {
            container.currentView = selectedTab
        }
        container.onViewChange = onViewChange
        container.onDayLabelTap = onDayLabelTap
        container.onMonthLabelTap = onMonthLabelTap
        
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
    public class Coordinator: NSObject, @preconcurrency EKEventEditViewDelegate, @preconcurrency EKEventViewDelegate {
        @MainActor public func eventViewController(_ controller: EKEventViewController, didCompleteWith action: EKEventViewAction) {
            if action == .deleted,
               let identifier = currentlyViewingEventID ?? controller.event?.eventIdentifier {
                SharedInviteTracker.localEventWasDeleted(localEventIdentifier: identifier)
            }
            currentlyViewingEventID = nil
            controller.dismiss(animated: true) {
                self.reloadCurrentRange()
            }
        }
        
        var parent: TwoWayPinnedSingleDayMultiCalendarWrapper
        weak var presentationController: UIViewController?
        var lastRenderedEvents: [EventDescriptorPresentationKey] = []
        var currentlyViewingEventID: String?
        var currentlyEditingEventWasNew = false
        var currentlyEditingEventID: String?
        
        init(_ parent: TwoWayPinnedSingleDayMultiCalendarWrapper) {
            self.parent = parent
            
        }
        
        @MainActor public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction) {
            let shouldOfferSharing = action == .saved && currentlyEditingEventWasNew
            let completedEvent = controller.event
            if action == .deleted, let currentlyEditingEventID {
                SharedInviteTracker.localEventWasDeleted(
                    localEventIdentifier: currentlyEditingEventID
                )
            }
            currentlyEditingEventID = nil
            currentlyEditingEventWasNew = false
            controller.dismiss(animated: true) {
                self.reloadCurrentRange()
                if shouldOfferSharing, let completedEvent {
                    EventSharePromptManager.shared.show(for: completedEvent)
                }
            }
        }
        
        @MainActor
        public func reloadCurrentRange(debug: Bool = true) {
            let cal = Calendar.current
            let fromOnly = cal.startOfDay(for: parent.fromDate)
            
            // Показваме точно 1 ден
            guard let actualEnd = cal.date(byAdding: .day, value: 1, to: fromOnly) else {
                parent.events = []
                return
            }
            
            // ----------------------------------------------------------
            // 1) Видими календари
            // ----------------------------------------------------------
            let visibleIDs = CalendarViewModel.shared.visibleCalendarIDs
            if debug {
                print("⇢ visibleCalendarIDs =", visibleIDs)
                print("⇢ MultiCalendar sources (title • id • selected):")
                CalendarViewModel.shared.multiCalendarsDict.forEach { id, info in
                    print("   •", info.title, "•", id, "• sel:", info.selected)
                }
            }
            
            // ----------------------------------------------------------
            // 2) Календарите, които подаваме към EventKit
            // ----------------------------------------------------------
            let allowedCalendars = CalendarViewModel.shared.allCalendars.filter {
                visibleIDs.contains($0.calendarIdentifier)
            }
            if debug {
                print("⇢ allowedCalendars =", allowedCalendars.count)
                allowedCalendars.forEach { c in
                    print("   •", c.title, "•", c.calendarIdentifier)
                }
            }
            
            // ----------------------------------------------------------
            // 3) Взимаме събитията. `nil` here means all EventKit
            // calendars, so an empty selection must stay an empty result.
            // ----------------------------------------------------------
            let found: [EKEvent]
            if allowedCalendars.isEmpty {
                found = []
            } else {
                let predicate = parent.eventStore.predicateForEvents(
                    withStart: fromOnly,
                    end: actualEnd,
                    calendars: allowedCalendars
                )
                found = parent.eventStore.events(matching: predicate)
            }
            if debug {
                print("⇢ EventKit returned =", found.count, "events")
                found.forEach { e in
                    print("   •", e.title ?? "(no title)",
                          "• cal:", e.calendar.title,
                          "• id:", e.calendar.calendarIdentifier,
                          "• allday:", e.isAllDay)
                }
            }
            
            // ----------------------------------------------------------
            // 4) Разделяме многодневните, ако има
            // ----------------------------------------------------------
            var descriptors: [EventDescriptor] = []
            
            for ekEvent in found {
                let startDay = cal.startOfDay(for: ekEvent.startDate)
                let endDay   = cal.startOfDay(for: ekEvent.endDate)
                
                if startDay != endDay {
                    let parts = splitEventByDays(ekEvent,
                                                 startRange: fromOnly,
                                                 endRange: actualEnd)
                    descriptors.append(contentsOf: parts)
                    if debug && !parts.isEmpty {
                        print("   ↳ split", ekEvent.title ?? "(no title)",
                              "into", parts.count, "slices")
                    }
                } else {
                    descriptors.append(EKMultiDayWrapper(realEvent: ekEvent))
                }
            }

            descriptors.append(contentsOf: AppLocalCalendarStore.shared.descriptors(
                from: fromOnly,
                to: actualEnd,
                selectedCalendarIDs: visibleIDs
            ))
            
            if debug {
                print("⇢ descriptors to UI =", descriptors.count)
            }
            
            // 5) Подаваш към SwiftUI
            parent.events = descriptors
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
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
            guard !SharedInviteTracker.isReadOnly(ekEvent) else {
                presentSystemDetails(ekEvent, in: parentVC)
                return
            }
            currentlyEditingEventWasNew = ekEvent.eventIdentifier == nil
            currentlyEditingEventID = ekEvent.eventIdentifier
            presentAppLocalEditor(
                target: AppLocalEventEditorTarget(
                    eventKitEvent: ekEvent,
                    startsInEditingMode: true
                ),
                in: parentVC
            )
            ReviewManager.eventCreated()
        }
        
        @MainActor
        public func createNewEventAndPresent(
            date: Date,
            in parentVC: UIViewController,
            preselectedCalendarID: String? = nil,
            initialInterval: DateInterval? = nil
        ) {
            guard let destination = CalendarViewModel.shared.newEventCalendar(
                preferredCalendarID: preselectedCalendarID) else { return }
            if let id = destination.appLocalCalendarID {
                presentAppLocalEditor(date: date, calendarID: id, initialInterval: initialInterval, in: parentVC)
                return
            }
            let newEvent = EKEvent(eventStore: parent.eventStore)
            newEvent.title = NSLocalizedString("New event", comment: "")
            newEvent.startDate = date
            newEvent.endDate   = initialInterval?.end ?? date.addingTimeInterval(3600)

            newEvent.calendar = destination.calendar

            presentSystemEditor(newEvent, in: parentVC)
            ReviewManager.eventCreated()
        }


        
        @MainActor public func createAllDayEventAndPresent(date: Date, in parentVC: UIViewController, preselectedCalendarID: String? = nil) {
            guard let destination = CalendarViewModel.shared.newEventCalendar(
                preferredCalendarID: preselectedCalendarID) else { return }
            if let id = destination.appLocalCalendarID {
                presentAppLocalEditor(date: date, calendarID: id, isAllDay: true, in: parentVC)
                return
            }
            let newEvent = EKEvent(eventStore: parent.eventStore)
            newEvent.title = NSLocalizedString("All-day event", comment: "")
            newEvent.calendar = destination.calendar
            newEvent.isAllDay = true
            newEvent.startDate = date
            newEvent.endDate   = date
            presentSystemEditor(newEvent, in: parentVC)
            ReviewManager.eventCreated()
        }
        
        @MainActor public func handleEventDragOrResize(
            descriptor: EventDescriptor,
            newDate: Date,
            isResize: Bool,
            isAllDay: Bool
        ) {
            if let local = descriptor as? AppLocalEventDescriptor {
                if let destinationID = local.pendingCalendarID,
                   let destination = parent.eventStore.calendar(withIdentifier: destinationID) {
                    finishTimelineTransfer {
                        try CalendarTimelineTransfer.move(local: local, to: destination,
                            eventStore: parent.eventStore, isResize: isResize)
                    }
                    return
                }
                // The timeline already resolved BOTH edges, including top-
                // handle resizing and conversions between timed/all-day.
                local.commitTimelineChange(isResize: isResize)
                // Replace gesture-mutated slices even after a no-op or a
                // rejected destination; the store remains authoritative.
                lastRenderedEvents = []
                reloadCurrentRange(debug: false)
                return
            }
            if let multi = descriptor as? EKMultiDayWrapper {
                let ev = multi.realEvent
                guard !SharedInviteTracker.isReadOnly(ev) else {
                    reloadCurrentRange()
                    return
                }
                if let destinationID = multi.pendingCalendarID {
                    if let destination = AppLocalCalendarStore.shared.calendar(id: destinationID) {
                        moveSystemEventToLocal(multi, destination: destination)
                        return
                    }
                    guard let destination = parent.eventStore.calendar(withIdentifier: destinationID),
                          destination.allowsContentModifications else {
                        finishTimelineTransfer { throw CalendarTimelineTransfer.unavailable() }
                        return
                    }
                    ev.calendar = destination
                    multi.pendingCalendarID = nil
                }
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

        @MainActor
        private func finishTimelineTransfer(_ operation: () throws -> Void) {
            do {
                try operation()
                EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
                SharedEventSyncManager.eventStoreDidChange()
                NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            } catch {
                let alert = UIAlertController(title: nil, message: error.localizedDescription, preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: NSLocalizedString("OK", comment: ""), style: .default))
                presentationController?.present(alert, animated: true)
            }
            lastRenderedEvents = []
            reloadCurrentRange(debug: false)
        }

        @MainActor
        private func moveSystemEventToLocal(_ event: EKMultiDayWrapper, destination: AppLocalCalendarRecord) {
            let move: (EKSpan) -> Void = { span in
                self.finishTimelineTransfer {
                    try CalendarTimelineTransfer.move(system: event, to: destination,
                        eventStore: self.parent.eventStore, span: span)
                }
            }
            guard event.realEvent.hasRecurrenceRules else { move(.thisEvent); return }
            let alert = UIAlertController(
                title: NSLocalizedString("Recurring Event", comment: ""),
                message: NSLocalizedString("This event is part of a series. Update which events?", comment: ""),
                preferredStyle: .actionSheet)
            alert.addAction(UIAlertAction(title: NSLocalizedString("This Event Only", comment: ""), style: .default) { _ in move(.thisEvent) })
            alert.addAction(UIAlertAction(title: NSLocalizedString("All Future Events", comment: ""), style: .default) { _ in move(.futureEvents) })
            alert.addAction(UIAlertAction(title: NSLocalizedString("Cancel", comment: ""), style: .cancel) { _ in
                self.lastRenderedEvents = []
                self.reloadCurrentRange(debug: false)
            })
            alert.popoverPresentationController?.sourceView = presentationController?.view
            presentationController?.present(alert, animated: true)
        }

        @MainActor
        func presentAppLocalEditor(eventID: String, in parentVC: UIViewController) {
            presentAppLocalEditor(
                target: AppLocalEventEditorTarget(eventID: eventID),
                in: parentVC
            )
        }

        @MainActor
        func presentAppLocalEditor(
            eventID: String,
            startsInEditingMode: Bool,
            in parentVC: UIViewController
        ) {
            presentAppLocalEditor(
                target: AppLocalEventEditorTarget(
                    eventID: eventID,
                    startsInEditingMode: startsInEditingMode
                ),
                in: parentVC
            )
        }

        @MainActor
        private func presentAppLocalEditor(
            date: Date,
            calendarID: String,
            isAllDay: Bool = false,
            initialInterval: DateInterval? = nil,
            in parentVC: UIViewController
        ) {
            presentAppLocalEditor(
                target: AppLocalEventEditorTarget(
                    date: date,
                    calendarID: calendarID,
                    isAllDay: isAllDay,
                    initialInterval: initialInterval
                ),
                in: parentVC
            )
        }

        @MainActor
        private func presentAppLocalEditor(
            target: AppLocalEventEditorTarget,
            in parentVC: UIViewController
        ) {
            let controller = UIHostingController(
                rootView: AppLocalEventEditorView(target: target) { [weak self] in
                    self?.reloadCurrentRange(debug: false)
                }
            )
            controller.modalPresentationStyle = .pageSheet
            controller.sheetPresentationController?.detents = [.large()]
            parentVC.present(controller, animated: true)
        }
        
        @MainActor public func askUserForRecurring(event: EKEvent, newDate: Date, isResize: Bool) {
            let alert = UIAlertController(
                title: NSLocalizedString("Recurring Event", comment: ""),
                message: NSLocalizedString("This event is part of a series. Update which events?", comment: ""),
                preferredStyle: .actionSheet
            )
            alert.addAction(UIAlertAction(title: NSLocalizedString("This Event Only", comment: ""), style: .default, handler: { _ in
                if !isResize {
                    self.applyDragChanges(event, newStartDate: newDate, span: .thisEvent, isAllDay: false)
                } else {
                    self.applyResizeChanges(event, descriptor: nil, forcedNewDate: newDate, span: .thisEvent)
                }
            }))
            alert.addAction(UIAlertAction(title: NSLocalizedString("All Future Events", comment: ""), style: .default, handler: { _ in
                if !isResize {
                    self.applyDragChanges(event, newStartDate: newDate, span: .futureEvents, isAllDay: false)
                } else {
                    self.applyResizeChanges(event, descriptor: nil, forcedNewDate: newDate, span: .futureEvents)
                }
            }))
            alert.addAction(UIAlertAction(title: NSLocalizedString("Cancel", comment: ""), style: .cancel, handler: { _ in 
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
            guard !SharedInviteTracker.isReadOnly(event) else {
                reloadCurrentRange()
                return
            }
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
            ReviewManager.eventCreated()
        }
        
        @MainActor public func applyResizeChanges(
            _ event: EKEvent,
            descriptor: EventDescriptor?,
            forcedNewDate: Date,
            span: EKSpan
        ) {
            guard !SharedInviteTracker.isReadOnly(event) else {
                reloadCurrentRange()
                return
            }
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
            ReviewManager.eventCreated()
        }
        @MainActor
        public func presentSystemDetails(_ ekEvent: EKEvent, in parentVC: UIViewController) {
            currentlyViewingEventID = ekEvent.eventIdentifier
            presentAppLocalEditor(
                target: AppLocalEventEditorTarget(
                    eventKitEvent: ekEvent,
                    startsInEditingMode: false
                ),
                in: parentVC
            )
        }

    }
}
