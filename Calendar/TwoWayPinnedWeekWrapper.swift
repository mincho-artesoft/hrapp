import SwiftUI
import CalendarKit
import EventKit

/// SwiftUI обвивка, която създава `TwoWayPinnedWeekContainerView` (UIKit).
/// Подаваме:
///  - @Binding var startOfWeek: Date
///  - @Binding var events: [EventDescriptor]
///
/// Когато потребителят натисне < или >, `TwoWayPinnedWeekContainerView` вика onWeekChange(...),
/// тук fetch-ваме нови евенти (по желание) и ги връщаме към SwiftUI.
public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]

    /// Може да ползвате глобален EKEventStore. Тук за пример създавам локален:
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

        // (3) Когато натиснем < или >:
        container.onWeekChange = { newStartDate in
            // (а) Обновяваме SwiftUI
            self.startOfWeek = newStartDate

            // (б) Ако искате да fetch-нете реални евенти [newStartDate .. +7 дни]:
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let predicate = self.localEventStore.predicateForEvents(
                withStart: newStartDate,
                end: endOfWeek,
                calendars: nil
            )
            let found = self.localEventStore.events(matching: predicate)
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }

            // (в) Обновяваме @Binding events в SwiftUI
            self.events = wrappers

            // (г) Задаваме ги във седмичния изглед
            let (ad, reg) = self.splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }

            container.setNeedsLayout()
            container.layoutIfNeeded()
        }

        // (4) Добавяме го във vc
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

        // (1) Обновяваме startOfWeek
        container.startOfWeek = startOfWeek

        // (2) Обновяваме events
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

