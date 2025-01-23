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
    
    override func eventsForDate(_ date: Date) -> [EventDescriptor] {
        let startDate = date
        var comp = DateComponents()
        comp.day = 1
        let endDate = calendar.date(byAdding: comp, to: startDate)!
        
        let predicate = eventStore.predicateForEvents(withStart: startDate,
                                                      end: endDate,
                                                      calendars: nil)
        
        let ekEvents = eventStore.events(matching: predicate)
        return ekEvents.map { EKWrapper(eventKitEvent: $0) }
    }
    
    // MARK: - DayViewDelegate
    
    override func dayViewDidSelectEventView(_ eventView: EventView) {
        guard let wrapper = eventView.descriptor as? EKWrapper else { return }
        
        let detailVC = EKEventViewController()
        detailVC.event = wrapper.ekEvent
        detailVC.allowsCalendarPreview = true
        detailVC.allowsEditing = true
        navigationController?.pushViewController(detailVC, animated: true)
    }
    
    // Long press в празен час → ново събитие
    override func dayView(dayView: DayView, didLongPressTimelineAt date: Date) {
        endEventEditing()
        
        let newWrapper = createNewEvent(at: date)
        create(event: newWrapper, animated: true)
    }
    
    private func createNewEvent(at date: Date) -> EKWrapper {
        let newEvent = EKEvent(eventStore: eventStore)
        newEvent.calendar = eventStore.defaultCalendarForNewEvents
        
        var comp = DateComponents()
        comp.hour = 1
        let endDate = calendar.date(byAdding: comp, to: date)
        
        newEvent.startDate = date
        newEvent.endDate   = endDate
        newEvent.title     = "New event"
        
        let wrap = EKWrapper(eventKitEvent: newEvent)
        // Сигнал, че е "ново"
        wrap.editedEvent = wrap
        return wrap
    }
    
    override func dayViewDidLongPressEventView(_ eventView: EventView) {
        guard let desc = eventView.descriptor as? EKWrapper else { return }
        endEventEditing()
        beginEditing(event: desc, animated: true)
    }
    
    override func dayView(dayView: DayView, didUpdate event: EventDescriptor) {
        guard let editingEvent = event as? EKWrapper else { return }
        
        if let original = event.editedEvent {
            editingEvent.commitEditing()
            
            if original === editingEvent {
                // Новосъздадено
                presentEditingViewForEvent(editingEvent.ekEvent)
            } else {
                // Редакция на вече съществуващо
                try! eventStore.save(editingEvent.ekEvent, span: .thisEvent)
            }
        }
        reloadData()
    }
    
    private func presentEditingViewForEvent(_ ekEvent: EKEvent) {
        let vc = EKEventEditViewController()
        vc.event = ekEvent
        vc.eventStore = eventStore
        vc.editViewDelegate = self
        present(vc, animated: true)
    }
    
    override func dayView(dayView: DayView, didTapTimelineAt date: Date) {
        endEventEditing()
    }
    
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
