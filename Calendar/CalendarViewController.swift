//
//  CalendarViewController.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 22/1/25.
//

import UIKit
import CalendarKit
import EventKit
import EventKitUI

final class CalendarViewController: DayViewController, EKEventEditViewDelegate {
    private var eventStore = EKEventStore()
    
    // MARK: - View Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Ако ползвате SwiftUI NavigationView, можете да коментирате следващия ред,
        // за да избегнете дублирано заглавие:
        // title = "Calendar"
        
        requestAccessToCalendar()
        subscribeToNotifications()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        // Ако по някаква причина се показва toolbar (например черен), можете да го скриете:
        // navigationController?.setToolbarHidden(true, animated: false)
    }
    
    // MARK: - Calendar Access
    
    /// Искаме достъп до календара на потребителя
    private func requestAccessToCalendar() {
        let completionHandler: EKEventStoreRequestAccessCompletionHandler =  { [weak self] granted, error in
            DispatchQueue.main.async {
                guard let self = self else { return }
                
                // ВАЖНО: Проверка дали достъпът е наистина даден
                guard granted, error == nil else {
                    // Тук можете да покажете Alert или да пренасочите потребителя към Settings
                    print("Calendar access not granted (or error). Error = \(String(describing: error))")
                    return
                }
                
                // Ако сме тук, значи имаме (поне) Full Access в iOS 17 или Authorized в iOS < 17
                self.initializeStore()
                self.subscribeToNotifications()
                self.reloadData()
            }
        }

        if #available(iOS 17.0, *) {
            eventStore.requestFullAccessToEvents(completion: completionHandler)
        } else {
            eventStore.requestAccess(to: .event, completion: completionHandler)
        }
    }


    private func initializeStore() {
        // Презапазваме (реинициализираме) eventStore, за да сме сигурни, че е валиден
        eventStore = EKEventStore()
    }
    
    // MARK: - Notifications
    
    private func subscribeToNotifications() {
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(storeChanged(_:)),
                                               name: .EKEventStoreChanged,
                                               object: eventStore)
    }
    
    @objc private func storeChanged(_ notification: Notification) {
        // При промяна в EventStore (добавяне, изтриване, редакция на събитие), презареждаме изгледа
        reloadData()
    }

    // MARK: - DayViewDataSource (CalendarKit)
    
    /// Този метод се извиква от CalendarKit, за да вземе събития за дадена дата
    override func eventsForDate(_ date: Date) -> [EventDescriptor] {
        // CalendarKit подава "date" с часове 00:00.00 за конкретния ден
        let startDate = date
        var oneDayComponents = DateComponents()
        oneDayComponents.day = 1
        // endDate ще бъде начало на следващия ден (00:00.00)
        let endDate = calendar.date(byAdding: oneDayComponents, to: startDate)!

        // Създаваме predicate, за да вземем събития от eventStore в диапазона [startDate, endDate)
        let predicate = eventStore.predicateForEvents(withStart: startDate,
                                                      end: endDate,
                                                      calendars: nil)
        
        // Вземаме всички събития от eventStore за този ден
        let eventKitEvents = eventStore.events(matching: predicate)
        // Преобразуваме ги към EventDescriptor (EKWrapper)
        let calendarKitEvents = eventKitEvents.map(EKWrapper.init)

        return calendarKitEvents
    }

    // MARK: - DayViewDelegate (CalendarKit)
    
    /// Извиква се при докосване (tap) върху вече съществуващо събитие
    override func dayViewDidSelectEventView(_ eventView: EventView) {
        guard let ckEvent = eventView.descriptor as? EKWrapper else { return }
        presentDetailViewForEvent(ckEvent.ekEvent)
    }
    
    /// Отваряме детайлния екран за дадено EKEvent (EKEventViewController)
    private func presentDetailViewForEvent(_ ekEvent: EKEvent) {
        let eventController = EKEventViewController()
        eventController.event = ekEvent
        eventController.allowsCalendarPreview = true
        eventController.allowsEditing = true
        // Ако искате да останете в UIKit за подробен изглед:
        navigationController?.pushViewController(eventController, animated: true)
    }
    
    // MARK: - Създаване и редакция на събития
    
    /// Дълго задържане (long press) в празно място от деня – създаваме ново събитие
    override func dayView(dayView: DayView, didLongPressTimelineAt date: Date) {
        // Прекратяваме евентуална редакция на друго събитие
        endEventEditing()
        
        // Създаваме нов EKWrapper (EKEvent) с 1 час продължителност
        let newEKWrapper = createNewEvent(at: date)
        // Използваме CalendarKit метод `create(...)` да го визуализираме "на място" (drag за промяна)
        create(event: newEKWrapper, animated: true)
    }
    
    /// Създава нов EKWrapper и задава начална/крайна дата (+1 час)
    private func createNewEvent(at date: Date) -> EKWrapper {
        let newEKEvent = EKEvent(eventStore: eventStore)
        // По подразбиране календарът за нови събития
        newEKEvent.calendar = eventStore.defaultCalendarForNewEvents
        
        var components = DateComponents()
        components.hour = 1
        let endDate = calendar.date(byAdding: components, to: date)
        
        newEKEvent.startDate = date
        newEKEvent.endDate = endDate
        newEKEvent.title = "New event"
        
        let newEKWrapper = EKWrapper(eventKitEvent: newEKEvent)
        // За да сигнализираме на CalendarKit, че това е "ново" събитие,
        // и в момента се редактира (drag нанася промени върху `editedEvent`):
        newEKWrapper.editedEvent = newEKWrapper
        return newEKWrapper
    }
    
    /// Дълго задържане върху вече съществуващо събитие – започва редакция
    override func dayViewDidLongPressEventView(_ eventView: EventView) {
        guard let descriptor = eventView.descriptor as? EKWrapper else { return }
        endEventEditing()
        beginEditing(event: descriptor, animated: true)
    }
    
    /// Извиква се, след като потребителят приключи drag/resize на събитието
    override func dayView(dayView: DayView, didUpdate event: EventDescriptor) {
        guard let editingEvent = event as? EKWrapper else { return }
        
        if let originalEvent = event.editedEvent {
            // Прилагаме промените (дата/час) в нашия EKWrapper
            editingEvent.commitEditing()
            
            if originalEvent === editingEvent {
                // Ако originalEvent === editingEvent, значи това е новосъздадено събитие
                // Отваряме EKEventEditViewController за допълнително редактиране
                presentEditingViewForEvent(editingEvent.ekEvent)
            } else {
                // Редактираме вече съществуващо събитие
                // Записваме промените обратно в EventStore
                try! eventStore.save(editingEvent.ekEvent, span: .thisEvent)
            }
        }
        
        // Презареждаме календарния изглед
        reloadData()
    }
    
    /// Показва системния редактор (EKEventEditViewController) за дадено EKEvent
    private func presentEditingViewForEvent(_ ekEvent: EKEvent) {
        let eventEditViewController = EKEventEditViewController()
        eventEditViewController.event = ekEvent
        eventEditViewController.eventStore = eventStore
        eventEditViewController.editViewDelegate = self
        present(eventEditViewController, animated: true, completion: nil)
    }
    
    // MARK: - Други интеракции с DayView
    
    /// Обикновен tap в празно място – край на евентуална редакция
    override func dayView(dayView: DayView, didTapTimelineAt date: Date) {
        endEventEditing()
    }
    
    /// Плъзгане на DayView (скрол) – край на евентуална редакция
    override func dayViewDidBeginDragging(dayView: DayView) {
        endEventEditing()
    }
    
    // MARK: - EKEventEditViewDelegate
    
    /// Делегатен метод, който се вика при затваряне на EKEventEditViewController
    func eventEditViewController(_ controller: EKEventEditViewController,
                                 didCompleteWith action: EKEventEditViewAction) {
        endEventEditing()
        reloadData()
        controller.dismiss(animated: true, completion: nil)
    }
}
