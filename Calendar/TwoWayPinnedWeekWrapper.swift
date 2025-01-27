//
//  TwoWayPinnedWeekWrapper.swift
//  Calendar
//
//  Created by Aleksandar Svinarov on 27/1/25.
//


import SwiftUI
import CalendarKit
import EventKit

/// Обвивка, която създава TwoWayPinnedWeekContainerView (UIKit)
/// и позволява лесно да му подадем:
///   - startOfWeek (Binding<Date>)
///   - масив от EventDescriptor
/// Когато потребителят натисне бутон < или >, вика onWeekChange и ние можем да реагираме.
public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    // Параметри, които идват отвън:
    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]

    // Може да имате и eventStore тук, ако искате директно да fetch-вате
    let localEventStore = EKEventStore()

    public init(startOfWeek: Binding<Date>, events: Binding<[EventDescriptor]>) {
        self._startOfWeek = startOfWeek
        self._events = events
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        let vc = UIViewController()

        // 1) Създаваме TwoWayPinnedWeekContainerView
        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // 2) Задаваме начални събития (разделяме на all-day / редовни)
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // 3) Когато сменим седмицата от бутоните < / >:
        container.onWeekChange = { newStartDate in
            // (а) сменяме @Binding startOfWeek -> ъпдейт в SwiftUI
            self.startOfWeek = newStartDate

            // (б) Тук можете директно да fetch-нете нови събития, ако желаете:
            //     Например:
            /*
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let predicate = self.localEventStore.predicateForEvents(withStart: newStartDate, end: endOfWeek, calendars: nil)
            let found = self.localEventStore.events(matching: predicate)
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }
            // (в) Обновяваме @Binding events (ако трябва да го пазим в SwiftUI)
            self.events = wrappers
            // (г) Слагаме ги във view-то
            let (ad, reg) = splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }
            container.setNeedsLayout()
            container.layoutIfNeeded()
            */
        }

        // Слагаме го във VC
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
        // Ако SwiftUI смени startOfWeek или events, рефрешваме
        guard let container = uiViewController.view.subviews
            .first(where: { $0 is TwoWayPinnedWeekContainerView }) as? TwoWayPinnedWeekContainerView
        else { return }

        // (1) Обновяваме startOfWeek
        container.startOfWeek = startOfWeek

        // (2) Обновяваме списъка със събития
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        container.setNeedsLayout()
        container.layoutIfNeeded()
    }

    // Разделя евентите на allDay / редовни
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
