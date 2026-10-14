import SwiftUI
import UIKit
import EventKit

// Only the store-dependent services are doubles. Both event rows, their accent
// layout and EventKit day slices are compiled from the application's sources.
enum SharedInviteTracker {
    static func shouldAppearStruckThrough(_ event: EventDescriptor) -> Bool { false }
    static func shouldAppearStruckThrough(_ event: EKEvent) -> Bool { false }
}
func appTimeFormatter() -> DateFormatter {
    let formatter = DateFormatter()
    formatter.dateFormat = "HH:mm"
    return formatter
}
final class AppLocalEventDescriptor: EventDescriptor {
    let eventID = "unsaved-test-event"
    let location = ""
    let isCancelled = false
    var dateInterval = DateInterval(start: Date(), duration: 3600)
    var isAllDay = false
    var text = "Planning"
    var attributedText: NSAttributedString? { nil }
    var lineBreakMode: NSLineBreakMode? { nil }
    var font: UIFont { .preferredFont(forTextStyle: .body) }
    var color: UIColor { .systemBlue }
    var textColor: UIColor { .label }
    var backgroundColor: UIColor { .clear }
    var editedEvent: EventDescriptor?
    func makeEditable() -> Self { self }
    func commitEditing() {}
}

@MainActor private func rows(for event: EventDescriptor) -> [AnyView] {
    [AnyView(EventRowView(event: event, timeString: { appTimeFormatter().string(from: $0) })),
     AnyView(SearchEventRowView(event: event))]
}

@MainActor private func runSizingTests() throws -> Int {
    let event = BasicEvent()
    event.dateInterval = DateInterval(start: Date(), duration: 3600)
    let store = EKEventStore() // Unsaved fixtures; no EventKit access or writes.
    let native = EKEvent(eventStore: store)
    native.calendar = EKCalendar(for: .event, eventStore: store)
    native.calendar.cgColor = UIColor.systemBlue.cgColor
    native.title = "Conference across several days"
    native.startDate = event.dateInterval.start
    native.endDate = native.startDate.addingTimeInterval(3 * 86400)
    let slices = (0..<3).map { day in
        EKMultiDayWrapper(realEvent: native,
            partialStart: native.startDate.addingTimeInterval(Double(day) * 86400),
            partialEnd: native.startDate.addingTimeInterval(Double(day + 1) * 86400))
    }
    var checks = 0
    for width: CGFloat in [280, 334, 374, 600] {
        for rtl in [false, true] {
            for typeSize: DynamicTypeSize in [.large, .accessibility3] {
                for title in ["Planning", "Project planning and review with the whole team for the upcoming release",
                              "اجتماع تخطيط المشروع ومراجعة العمل مع أعضاء الفريق"] {
                    for allDay in [false, true] {
                        event.text = title
                        event.isAllDay = allDay
                        let testedRows = rows(for: event) + slices.flatMap { rows(for: $0) }
                        for (index, row) in testedRows.enumerated() {
                            let host = UIHostingController(rootView: row
                                .environment(\.layoutDirection, rtl ? .rightToLeft : .leftToRight)
                                .environment(\.locale, Locale(identifier: rtl ? "ar" : "en_US"))
                                .environment(\.dynamicTypeSize, typeSize))
                            // UICollectionView remeasures cells using an estimated
                            // height. Content must return its own height once there
                            // is enough room, rather than echoing that estimate.
                            let first = host.sizeThatFits(in: CGSize(width: width, height: 2000))
                            let second = host.sizeThatFits(in: CGSize(width: width, height: 3000))
                            guard first.height > 0, first.height < 2000,
                                  abs(first.height - second.height) < 0.5 else {
                                throw NSError(domain: "EventRowSizing", code: 1, userInfo: [
                                    NSLocalizedDescriptionKey:
                                        "Row \(index), width \(width), RTL \(rtl), size \(typeSize), all-day \(allDay): estimated heights produced \(first.height) and \(second.height)"
                                ])
                            }
                            checks += 1
                        }
                    }
                }
            }
        }
    }
    return checks
}

private struct ListStressView: View {
    let revision: Int
    let events: [BasicEvent]
    var body: some View {
        ScrollViewReader { proxy in
            List {
                ForEach(0..<20, id: \.self) { section in
                    Section("Day \(section + 1)") {
                        ForEach(0..<5, id: \.self) { offset in
                            let index = section * 5 + offset
                            if index.isMultiple(of: 2) {
                                EventRowView(event: events[index], timeString: { appTimeFormatter().string(from: $0) })
                                    .id(index)
                            } else {
                                SearchEventRowView(event: events[index]).id(index)
                            }
                        }
                    }
                }
            }
            .listStyle(.plain)
            .environment(\.dynamicTypeSize, revision.isMultiple(of: 3) ? .accessibility1 : .large)
            .environment(\.layoutDirection, revision.isMultiple(of: 2) ? .leftToRight : .rightToLeft)
            .task(id: revision) {
                await Task.yield()
                proxy.scrollTo((revision * 17) % events.count, anchor: .top)
            }
        }
    }
}

@main final class EventRowSizingTestApp: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, configurationForConnecting session: UISceneSession,
                     options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        let configuration = UISceneConfiguration(name: "Sizing tests", sessionRole: session.role)
        configuration.delegateClass = EventRowSizingTestScene.self
        return configuration
    }
}

final class EventRowSizingTestScene: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession,
               options: UIScene.ConnectionOptions) {
        guard let scene = scene as? UIWindowScene else { return }
        window = UIWindow(windowScene: scene)
        let events = (0..<100).map { index in
            let event = BasicEvent()
            event.text = index.isMultiple(of: 3)
                ? "اجتماع تخطيط المشروع ومراجعة العمل مع أعضاء الفريق"
                : "Project planning and review with the whole team \(index)"
            event.isAllDay = index.isMultiple(of: 5)
            event.dateInterval = DateInterval(start: Date(), duration: 3600)
            return event
        }
        let host = UIHostingController(rootView: ListStressView(revision: 0, events: events))
        window?.rootViewController = host
        window?.makeKeyAndVisible()
        Task { @MainActor in
            do {
                let checks = try runSizingTests()
                for revision in 1...30 {
                    host.rootView = ListStressView(revision: revision, events: events)
                    try await Task.sleep(for: .milliseconds(150))
                    host.view.layoutIfNeeded()
                }
                try write(["status": "PASS", "sizingChecks": checks, "listScrollAndResizeCycles": 30])
            } catch {
                try? write(["status": "FAIL", "error": error.localizedDescription])
            }
        }
    }

    private func write(_ result: [String: Any]) throws {
        let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("result.json")
        try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys])
            .write(to: url, options: .atomic)
    }
}
