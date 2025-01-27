import SwiftUI
import CalendarKit
import EventKit

/// SwiftUI обвивка, която създава TwoWayPinnedWeekContainerView (UIKit).
/// Подаваме `startOfWeek` ( Binding<Date> ), и `events` ( Binding<[EventDescriptor]> ).
/// При натискане на < / >: TwoWayPinnedWeekContainerView вика onWeekChange,
/// тук fetch-ваме нови евенти и ги връщаме към SwiftUI (self.events).
public struct TwoWayPinnedWeekWrapper: UIViewControllerRepresentable {

    @Binding var startOfWeek: Date
    @Binding var events: [EventDescriptor]

    /// Може да ползвате глобален EKEventStore,
    /// тук за пример създавам локален:
    let localEventStore = EKEventStore()

    public init(startOfWeek: Binding<Date>, events: Binding<[EventDescriptor]>) {
        self._startOfWeek = startOfWeek
        self._events = events
    }

    public func makeUIViewController(context: Context) -> UIViewController {
        // (1) Правим празен UIViewController
        let vc = UIViewController()

        // (2) Създаваме TwoWayPinnedWeekContainerView
        let container = TwoWayPinnedWeekContainerView()
        container.startOfWeek = startOfWeek

        // (3) Първоначално задаваме събитията
        let (allDay, regular) = splitAllDay(events)
        container.weekView.allDayLayoutAttributes  = allDay.map { EventLayoutAttributes($0) }
        container.weekView.regularLayoutAttributes = regular.map { EventLayoutAttributes($0) }

        // (4) Когато натискаме < или >:
        container.onWeekChange = { newStartDate in
            // (а) Ъпдейтваме SwiftUI
            self.startOfWeek = newStartDate

            // (б) Fetch от localEventStore за [newStartDate..+7 дни]
            let endOfWeek = Calendar.current.date(byAdding: .day, value: 7, to: newStartDate)!
            let predicate = self.localEventStore.predicateForEvents(withStart: newStartDate,
                                                                    end: endOfWeek,
                                                                    calendars: nil)
            let found = self.localEventStore.events(matching: predicate)

            // Превръщаме EKEvent -> EKWrapper (което е EventDescriptor)
            let wrappers = found.map { EKWrapper(eventKitEvent: $0) }

            // (в) Показваме ги на SwiftUI
            self.events = wrappers

            // (г) Обновяваме седмичния изглед
            let (ad, reg) = self.splitAllDay(wrappers)
            container.weekView.allDayLayoutAttributes  = ad.map { EventLayoutAttributes($0) }
            container.weekView.regularLayoutAttributes = reg.map { EventLayoutAttributes($0) }

            container.setNeedsLayout()
            container.layoutIfNeeded()
        }

        // (5) Добавяме container във vc
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
        // Когато SwiftUI смени startOfWeek / events
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

    /// Помощна функция: разделя евентите на allDay и редовни
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
