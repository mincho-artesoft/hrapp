import SwiftUI
import EventKitUI
import EventKit

// MARK: - TwoWayPinnedMultiDayWrapper
public struct TwoWayPinnedMultiDayWrapper: UIViewControllerRepresentable {
    
    @Binding var fromDate: Date
    @Binding var toDate: Date
    @Binding var events: [EventDescriptor]
    
    let eventStore: EKEventStore
    var isSingleDay: Bool
    
    var selectedTab: Int
    var onViewChange: ((Int)->Void)?
    
    public var onDayLabelTap: ((Date) -> Void)? = nil
    public var onMonthLabelTap: ((Date) -> Void)? = nil
    public var onEventSelectionChanged: ((EventDescriptor?) -> Void)? = nil
    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()
        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        vc.view.semanticContentAttribute = semanticDirection
        
        // Ако ще представяте този контролер модално и искате
        // да е fullscreen, можете да активирате:
        //
        // vc.modalPresentationStyle = .fullScreen

        let container = TwoWayPinnedMultiDayContainerView()
        container.bottomScrollPadding = context.environment.calendarBottomClearance
        container.semanticContentAttribute = semanticDirection
        container.onEventDeleted = { descriptor in
               // Когато в MultiDayTimelineView натиснат „Delete“ (и реално изтриете EventKit event),
               // Накрая искаме да презаредим диапазона:
               context.coordinator.reloadCurrentRange()
           }
           
           container.onEventDuplicated = { descriptor in
               // Същото при „Duplicate“
               context.coordinator.reloadCurrentRange()
           }
           
           vc.view.addSubview(container)
        container.showSingleDay = isSingleDay
        container.fromDate = fromDate
        container.toDate   = toDate
        
        // Ако имате нужда да настройвате/подавате събития:
        let (allDay, regular) = splitAllDay(events)
        container.allDayView.allDayLayoutAttributes = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes  = regular.map { EventLayoutAttributes($0) }
        context.coordinator.lastRenderedEvents = eventDescriptorPresentationKeys(events)
        
        // CALLBACK-и
        container.onRangeChange = { newFrom, newTo in
            context.coordinator.parent.onEventSelectionChanged?(nil)
            fromDate = newFrom
            toDate   = newTo
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
        
        container.onEmptyLongPress = { interval, calendarID in
            context.coordinator.createNewEventAndPresent(date: interval.start, in: vc,
                initialInterval: interval, preselectedCalendarID: calendarID)
        }
        container.allDayView.onEmptyLongPress = { date in
            context.coordinator.createAllDayEventAndPresent(date: date, in: vc)
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

        container.onMonthLabelTap = { month in
            onMonthLabelTap?(month)
        }
        
        // Настройки за типа изглед (Day, MultiDay и т.н.)
        container.currentView = selectedTab
        container.onViewChange = onViewChange
        
        // Бутон “+”
        container.onAddNewEvent = {
            // Примерно създаваме ново събитие за "сега":
            context.coordinator.createNewEventAndPresent(date: Date(), in: vc)
        }
        
        vc.view.addSubview(container)
        container.translatesAutoresizingMaskIntoConstraints = false
        
        // >>> ТУК Е ПРОМЯНАТА <<<
        // Вместо safeAreaLayoutGuide, връзваме към vc.view.(top/leading/...):
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
                .first(where: { $0 is TwoWayPinnedMultiDayContainerView })
                as? TwoWayPinnedMultiDayContainerView else {
            return
        }
        container.bottomScrollPadding = context.environment.calendarBottomClearance

        let semanticDirection: UISemanticContentAttribute =
            context.environment.layoutDirection == .rightToLeft ? .forceRightToLeft : .forceLeftToRight
        uiViewController.view.semanticContentAttribute = semanticDirection
        container.semanticContentAttribute = semanticDirection
        
        if container.showSingleDay != isSingleDay {
            container.showSingleDay = isSingleDay
        }
        if container.fromDate != fromDate {
            container.fromDate = fromDate
        }
        if container.toDate != toDate {
            container.toDate = toDate
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
        
        var parent: TwoWayPinnedMultiDayWrapper
        var lastRenderedEvents: [EventDescriptorPresentationKey] = []
        var currentlyViewingEventID: String?
        var currentlyEditingEventID: String? = nil
        var currentlyEditingEventWasNew = false

        init(_ parent: TwoWayPinnedMultiDayWrapper) {
            self.parent = parent
        }
      
        @MainActor
        public func eventEditViewController(_ controller: EKEventEditViewController,
                                            didCompleteWith action: EKEventEditViewAction)
        {
            let shouldOfferSharing = action == .saved && currentlyEditingEventWasNew
            let completedEvent = controller.event
            defer {
                controller.dismiss(animated: true) {
                    self.reloadCurrentRange()
                    if shouldOfferSharing, let completedEvent {
                        EventSharePromptManager.shared.show(for: completedEvent)
                    }
                }
                currentlyEditingEventID = nil
                currentlyEditingEventWasNew = false
            }
            switch action {
            case .canceled:
                print("Canceled")
                
            case .saved:
                // Ако не е nil, можем да запишем директно.
                if let event = controller.event {
                    guard !SharedInviteTracker.isReadOnly(event) else {
                        Task { await SharedInviteRefresher.refreshAll() }
                        return
                    }
                    do {
                        try controller.eventStore.save(event, span: .thisEvent)
                    } catch {
                        print("Save error:", error)
                    }
                }
                
            case .deleted:
                print("Deleted")
                
                // 1) Опитваме да достъпим директно event.
                if let event = controller.event {
                    // Ако е останал валиден, трием го по стандартния начин
                    do {
                        try controller.eventStore.remove(event, span: .thisEvent)
                        print("Събитието е изтрито локално (директно).")
                    } catch {
                        print("Remove error:", error)
                    }
                } else {
                    // 2) Ако iOS го е махнал от паметта => ползваме предварително
                    //    запомнения currentlyEditingEventID
                    print("controller.event е nil – iOS вече го е махнал от редактора.")
                    
                    if let id = self.currentlyEditingEventID {
                        // Проверяваме дали все още съществува в eventStore
                        if let leftover = controller.eventStore.event(withIdentifier: id) {
                            print("Намираме събитие c ID=\(id). Ще го изтрием ръчно.")
                            do {
                                try controller.eventStore.remove(leftover, span: .thisEvent)
                                print("Събитието е изтрито локално (ръчно).")
                            } catch {
                                print("Remove error:", error)
                            }
                        } else {
                            print("Не го намираме в eventStore => вече е изтрито.")
                        }
                    }
                }
                if let identifier = self.currentlyEditingEventID {
                    SharedInviteTracker.localEventWasDeleted(localEventIdentifier: identifier)
                }
                
            @unknown default:
                break
            }
        }

        @MainActor public func reloadCurrentRange() {
            let cal = Calendar.current
            let fromOnly = cal.startOfDay(for: parent.fromDate)
            let toOnly   = cal.startOfDay(for: parent.toDate)
            let actualEnd = cal.date(byAdding: .day, value: 1, to: toOnly) ?? toOnly

            let allowedCals = CalendarViewModel.shared.allowedCalendars()
            let found: [EKEvent]
            if allowedCals.isEmpty {
                found = []
            } else {
                let predicate = parent.eventStore.predicateForEvents(
                    withStart: fromOnly,
                    end: actualEnd,
                    calendars: allowedCals
                )
                found = parent.eventStore.events(matching: predicate)
            }
            
            var splitted: [EventDescriptor] = []
            for ekEvent in found {
                guard let realStart = ekEvent.startDate,
                      let realEnd   = ekEvent.endDate else { continue }
                
                // Ако е повече от 1 ден -> split
                if cal.startOfDay(for: realStart) != cal.startOfDay(for: realEnd) {
                    splitted.append(contentsOf: splitEventByDays(ekEvent,
                                                                 startRange: fromOnly,
                                                                 endRange: actualEnd))
                } else {
                    splitted.append(EKMultiDayWrapper(realEvent: ekEvent))
                }
            }
            splitted.append(contentsOf: AppLocalCalendarStore.shared.descriptors(
                from: fromOnly,
                to: actualEnd,
                selectedCalendarIDs: CalendarViewModel.shared.visibleCalendarIDs
            ))
            parent.events = splitted
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
            ReviewManager.eventCreated()
        }

        @MainActor
        public func presentSystemEditor(_ ekEvent: EKEvent, in parentVC: UIViewController) {
            guard !SharedInviteTracker.isReadOnly(ekEvent) else {
                presentSystemDetails(ekEvent, in: parentVC)
                return
            }
            // Запомняме идентификатора:
            self.currentlyEditingEventID = ekEvent.eventIdentifier
            self.currentlyEditingEventWasNew = ekEvent.eventIdentifier == nil
            
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
            date: Date, in parentVC: UIViewController, initialInterval: DateInterval? = nil,
            preselectedCalendarID: String? = nil
        ) {
            guard let destination = CalendarViewModel.shared.newEventCalendar(
                preferredCalendarID: preselectedCalendarID) else { return }
            if let calendarID = destination.appLocalCalendarID {
                presentAppLocalEditor(
                    target: AppLocalEventEditorTarget(date: date, calendarID: calendarID, initialInterval: initialInterval),
                    in: parentVC
                )
                return
            }
            let newEvent = EKEvent(eventStore: parent.eventStore)
            newEvent.title = NSLocalizedString("New event", comment: "")

            newEvent.calendar = destination.calendar

            newEvent.startDate = date
            newEvent.endDate   = initialInterval?.end ?? date.addingTimeInterval(3600)
            presentSystemEditor(newEvent, in: parentVC)
            ReviewManager.eventCreated()
        }
        
        @MainActor
        public func createAllDayEventAndPresent(date: Date, in parentVC: UIViewController) {
            guard let destination = CalendarViewModel.shared.newEventCalendar() else { return }
            if let calendarID = destination.appLocalCalendarID {
                presentAppLocalEditor(
                    target: AppLocalEventEditorTarget(
                        date: date,
                        calendarID: calendarID,
                        isAllDay: true
                    ),
                    in: parentVC
                )
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
                // The timeline already resolved BOTH edges, including top-
                // handle resizing and conversions between timed/all-day.
                local.commitTimelineChange(isResize: isResize)
                // Replace gesture-mutated slices even after a no-op or a
                // rejected destination; the store remains authoritative.
                lastRenderedEvents = []
                reloadCurrentRange()
                return
            }
            if let multi = descriptor as? EKMultiDayWrapper {
                let ev = multi.realEvent
                guard !SharedInviteTracker.isReadOnly(ev) else {
                    reloadCurrentRange()
                    return
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
            target: AppLocalEventEditorTarget,
            in parentVC: UIViewController
        ) {
            let controller = UIHostingController(
                rootView: AppLocalEventEditorView(target: target) { [weak self] in
                    self?.reloadCurrentRange()
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
    }
}
