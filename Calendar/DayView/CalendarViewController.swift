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
            // Example: scroll to 9 AM
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

    /// Return “EventDescriptor”s for a given date
    override func eventsForDate(_ date: Date) -> [EventDescriptor] {
        let startDate = date
        let endDate = calendar.date(byAdding: .day, value: 1, to: startDate)!

        let predicate = eventStore.predicateForEvents(withStart: startDate, end: endDate, calendars: nil)
        let ekEvents = eventStore.events(matching: predicate)

        var results = [EventDescriptor]()

        for ekEvent in ekEvents {
            guard let realStart = ekEvent.startDate,
                  let realEnd   = ekEvent.endDate else {
                // if missing start/end, skip
                continue
            }

            if calendar.isDate(realStart, inSameDayAs: realEnd) {
                // single-day event
                let singleWrapper = EKMultiDayWrapper(realEvent: ekEvent)
                results.append(singleWrapper)
            } else {
                // multi-day
                // This day’s portion is [max(realStart, dayStart) .. min(realEnd, dayEnd)]
                let partialStart = max(realStart, startDate)
                let partialEnd = min(realEnd, endDate)
                if partialStart < partialEnd {
                    let multi = EKMultiDayWrapper(realEvent: ekEvent,
                                                  partialStart: partialStart,
                                                  partialEnd: partialEnd)
                    results.append(multi)
                }
            }
        }
        return results
    }

    // MARK: - DayViewDelegate

    /// Tapping an event -> push EKEventViewController
    override func dayViewDidSelectEventView(_ eventView: EventView) {
        guard let wrapper = eventView.descriptor as? EKMultiDayWrapper else { return }

        let detailVC = EKEventViewController()
        detailVC.event = wrapper.ekEvent
        detailVC.allowsCalendarPreview = true
        detailVC.allowsEditing = true

        navigationController?.pushViewController(detailVC, animated: true)
    }

    /// Long press on empty area -> create new event
    override func dayView(dayView: DayView, didLongPressTimelineAt date: Date) {
        endEventEditing()

        let newWrapper = createNewEvent(at: date)
        create(event: newWrapper, animated: true)
    }

    private func createNewEvent(at date: Date) -> EKMultiDayWrapper {
        let newEvent = EKEvent(eventStore: eventStore)
        newEvent.calendar = eventStore.defaultCalendarForNewEvents
        newEvent.title = "New event"
        let endDate = calendar.date(byAdding: .hour, value: 1, to: date) ?? date.addingTimeInterval(3600)
        newEvent.startDate = date
        newEvent.endDate = endDate

        let wrap = EKMultiDayWrapper(realEvent: newEvent)
        // Mark it as “being edited” so the user can drag/resize
        wrap.editedEvent = wrap
        return wrap
    }

    /// Long press on an existing event -> editing mode
    override func dayViewDidLongPressEventView(_ eventView: EventView) {
        guard let desc = eventView.descriptor as? EKMultiDayWrapper else { return }
        endEventEditing()
        beginEditing(event: desc, animated: true)
    }

    /// End of drag/resize -> commit changes
    override func dayView(dayView: DayView, didUpdate event: EventDescriptor) {
        guard let editingEvent = event as? EKMultiDayWrapper else { return }

        if let original = event.editedEvent {
            // The wrapper’s realEvent was changed
            editingEvent.commitEditing()

            if original === editingEvent {
                // A brand-new event
                presentEditingViewForEvent(editingEvent.ekEvent)
            } else {
                // An existing event was updated
                do {
                    try eventStore.save(editingEvent.ekEvent, span: .thisEvent)
                } catch {
                    print("Error saving: \(error)")
                }
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

    /// Tapping empty area
    override func dayView(dayView: DayView, didTapTimelineAt date: Date) {
        endEventEditing()
    }

    /// Scrolling -> end editing
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
