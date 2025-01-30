//
//  CalendarViewControllerWrapper.swift
//  ExampleCalendarApp
//

import SwiftUI
import CalendarKit
import EventKit

struct CalendarViewControllerWrapper: UIViewControllerRepresentable {
    let selectedDate: Date
    let eventStore: EKEventStore
    
    func makeUIViewController(context: Context) -> CalendarViewController {
        let vc = CalendarViewController()
        vc.selectedDate = selectedDate
        vc.eventStore = eventStore
        return vc
    }
    
    func updateUIViewController(_ uiViewController: CalendarViewController, context: Context) {
        // Ако date се промени, да обновим DayView:
        uiViewController.selectedDate = selectedDate
        uiViewController.dayView.state?.move(to: selectedDate)
    }
}
