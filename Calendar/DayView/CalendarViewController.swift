//
//  CalendarViewController.swift
//  ExampleCalendarApp
//
//  Наш контролер, наследен от CalendarKit.DayViewController,
//  който показва събития от EKEventStore (чрез EKMultiDayWrapper),
//  за да могат много‐дневните събития да се визуализират във всеки ден.
//
import UIKit
import CalendarKit
import EventKit
import EventKitUI

final class CalendarViewController: DayViewController, EKEventEditViewDelegate {
    var eventStore: EKEventStore!
    var selectedDate: Date?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        subscribeToNotifications()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        dayView.reloadData()
        
        if let date = selectedDate {
            dayView.state?.move(to: date)
            // Пример: скрол до 9ч
            dayView.scrollTo(hour24: 9)
        }
    }
    
    private func subscribeToNotifications() {
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(storeChanged(_:)),
                                               name: .EKEventStoreChanged,
                                               object: eventStore)
    }
    
    @objc private func storeChanged(_ notification: Notification) {
        reloadData()
    }
    
    // MARK: - DayViewDataSource
    
    /// Тук връщаме "EventDescriptor"-и за дадена дата
    override func eventsForDate(_ date: Date) -> [EventDescriptor] {
        let startDate = date
        var comp = DateComponents()
        comp.day = 1
        let endDate = calendar.date(byAdding: comp, to: startDate)!
        
        let predicate = eventStore.predicateForEvents(withStart: startDate,
                                                      end: endDate,
                                                      calendars: nil)
        let ekEvents = eventStore.events(matching: predicate)
        
        var results = [EventDescriptor]()
        
        for ekEvent in ekEvents {
            guard let realStart = ekEvent.startDate,
                  let realEnd   = ekEvent.endDate else {
                // Ако липсва start/end, пропускаме
                continue
            }
            
            // Ако е еднодневно (или поне start и end са в същия ден)
            if Calendar.current.isDate(realStart, inSameDayAs: realEnd) {
                // Просто правим един EKMultiDayWrapper
                let oneDay = EKMultiDayWrapper(realEvent: ekEvent)
                results.append(oneDay)
            } else {
                // Много‐дневно: проверяваме каква част от евента попада в [date..date+1]
                let partialStart = max(realStart, startDate)
                let partialEnd   = min(realEnd, endDate)
                if partialStart < partialEnd {
                    let multi = EKMultiDayWrapper(
                        realEvent: ekEvent,
                        partialStart: partialStart,
                        partialEnd:   partialEnd
                    )
                    results.append(multi)
                }
            }
        }
        
        return results
    }
    
    // MARK: - DayViewDelegate
    
    /// Тап на евент -> показваме EKEventViewController (детайли)
    override func dayViewDidSelectEventView(_ eventView: EventView) {
        // Тук очакваме EKMultiDayWrapper
        guard let wrapper = eventView.descriptor as? EKMultiDayWrapper else { return }
        
        let detailVC = EKEventViewController()
        detailVC.event = wrapper.ekEvent
        detailVC.allowsCalendarPreview = true
        detailVC.allowsEditing = true
        
        navigationController?.pushViewController(detailVC, animated: true)
    }
    
    /// Long press на празна зона -> създаваме нов евент
    override func dayView(dayView: DayView, didLongPressTimelineAt date: Date) {
        endEventEditing()
        
        let newWrapper = createNewEvent(at: date)
        create(event: newWrapper, animated: true)
    }
    
    /// Помощен метод за създаване на чисто нов EKEvent + EKMultiDayWrapper
    private func createNewEvent(at date: Date) -> EKMultiDayWrapper {
        let newEvent = EKEvent(eventStore: eventStore)
        newEvent.calendar = eventStore.defaultCalendarForNewEvents
        
        var comp = DateComponents()
        comp.hour = 1
        let endDate = calendar.date(byAdding: comp, to: date)
        
        newEvent.startDate = date
        newEvent.endDate = endDate
        newEvent.title = "New event"
        
        // Създаваме EKMultiDayWrapper (еднодневно парче)
        let wrap = EKMultiDayWrapper(realEvent: newEvent)
        // Маркираме го като "редактирано"
        wrap.editedEvent = wrap
        return wrap
    }
    
    /// Long press върху съществуващ евент -> включваме "editing mode"
    override func dayViewDidLongPressEventView(_ eventView: EventView) {
        guard let desc = eventView.descriptor as? EKMultiDayWrapper else { return }
        endEventEditing()
        beginEditing(event: desc, animated: true)
    }
    
    /// Край на drag/resize -> commit‐ваме промените
    override func dayView(dayView: DayView, didUpdate event: EventDescriptor) {
        guard let editingEvent = event as? EKMultiDayWrapper else { return }
        
        if let original = event.editedEvent {
            editingEvent.commitEditing()
            
            if original === editingEvent {
                // Новосъздадено събитие
                presentEditingViewForEvent(editingEvent.ekEvent)
            } else {
                // Редакция на вече съществуващо
                try! eventStore.save(editingEvent.ekEvent, span: .thisEvent)
            }
        }
        reloadData()
    }
    
    /// Показваме системния EKEventEditViewController за финална редакция
    private func presentEditingViewForEvent(_ ekEvent: EKEvent) {
        let vc = EKEventEditViewController()
        vc.event = ekEvent
        vc.eventStore = eventStore
        vc.editViewDelegate = self
        present(vc, animated: true)
    }
    
    /// Тап върху празно място
    override func dayView(dayView: DayView, didTapTimelineAt date: Date) {
        endEventEditing()
    }
    
    /// Скрол почна -> end editing
    override func dayViewDidBeginDragging(dayView: DayView) {
        endEventEditing()
    }
    
    // MARK: - EKEventEditViewDelegate
    
    func eventEditViewController(_ controller: EKEventEditViewController,
                                 didCompleteWith action: EKEventEditViewAction) {
        endEventEditing()
        reloadData()
        controller.dismiss(animated: true)
    }
}
