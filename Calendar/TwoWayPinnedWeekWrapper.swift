//
//  TwoWayPinnedWeekWrapper.swift
//  ExampleCalendarApp
//
//  SwiftUI обвивка за TwoWayPinnedWeekContainerView (UIKit).
//  При смяна на седмицата (< / >) вика onWeekChange -> можем да fetch‑нем нови евенти.
//

import SwiftUI
import CalendarKit
import EventKit

public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]

    /// Примерно, ако искаме да fetch‑ваме евентите локално. Може и да ползвате глобално eventStore.
    let localEventStore = EKEventStore()

    public init(startOfWeek: Binding<Date>, events: Binding<[EventDescriptor]>) {
        self._startOfWeek = startOfWeek
        self._events = events
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()

        // (1) Създаваме TwoWayPinnedWeekContainerView
        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // (2) Задаваме началните събития
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // (3) При < или >
        container.onWeekChange = { newStartDate in
            // Обновяваме SwiftUI
            self.startOfWeek = newStartDate

            // Пример: ако искаме да fetch‑нем от localEventStore
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let predicate = self.localEventStore.predicateForEvents(
                withStart: newStartDate,
                end: endOfWeek,
                calendars: nil
            )
            let found = self.localEventStore.events(matching: predicate)
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }

            // Обновяваме @Binding events
            self.events = wrappers

            // Слагаме ги във weekView
            let (ad, reg) = self.splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }

            container.setNeedsLayout()
            container.layoutIfNeeded()
        }

        // (4) Добавяме го
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
        // Когато SwiftUI смени startOfWeek или events
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

    /// Разделя евентите на all-day / редовни
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
}
