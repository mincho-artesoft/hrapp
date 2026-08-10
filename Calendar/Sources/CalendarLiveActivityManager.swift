import ActivityKit
import Foundation

struct CalendarLiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        let updatedAt: Date
        let events: [CalendarLiveActivityEvent]
    }

    let title: String
}

struct CalendarLiveActivityEvent: Codable, Hashable, Identifiable {
    let id: String
    let title: String
    let startDate: Date
    let endDate: Date
    let isAllDay: Bool
    let location: String?
    let videoCallPlatform: String?
    let colorRed: Double
    let colorGreen: Double
    let colorBlue: Double
    let colorAlpha: Double
}

@MainActor
final class CalendarLiveActivityManager: ObservableObject {
    static let shared = CalendarLiveActivityManager()

    @Published private(set) var isSupported = false
    @Published private(set) var isRunning = false

    private init() {
        refreshStatus()
    }

    func refreshStatus() {
        guard #available(iOS 16.1, *) else {
            isSupported = false
            isRunning = false
            return
        }

        isSupported = ActivityAuthorizationInfo().areActivitiesEnabled
        isRunning = !Activity<CalendarLiveActivityAttributes>.activities.isEmpty
    }

    func toggle() {
        refreshStatus()

        if isRunning {
            stop()
        } else {
            start()
        }
    }

    func start() {
        guard #available(iOS 16.1, *), ActivityAuthorizationInfo().areActivitiesEnabled else {
            refreshStatus()
            return
        }

        CalendarWidgetStore.saveUpcomingEventsSnapshot()

        let attributes = CalendarLiveActivityAttributes(
            title: NSLocalizedString("Calendar Live Activity", comment: "Live Activity title")
        )
        let state = makeContentState()

        do {
            if #available(iOS 16.2, *) {
                _ = try Activity.request(
                    attributes: attributes,
                    content: ActivityContent(state: state, staleDate: Self.staleDate(for: state)),
                    pushType: nil
                )
            } else {
                _ = try Activity.request(
                    attributes: attributes,
                    contentState: state,
                    pushType: nil
                )
            }
        } catch {
            print("Live Activity start error:", error.localizedDescription)
        }

        refreshStatus()
    }

    func stop() {
        guard #available(iOS 16.1, *) else { return }

        Task {
            for activity in Activity<CalendarLiveActivityAttributes>.activities {
                if #available(iOS 16.2, *) {
                    await activity.end(
                        ActivityContent(state: makeContentState(), staleDate: nil),
                        dismissalPolicy: .immediate
                    )
                } else {
                    await activity.end(dismissalPolicy: .immediate)
                }
            }

            await MainActor.run {
                self.refreshStatus()
            }
        }
    }

    func update(refreshSnapshot: Bool = true) {
        guard #available(iOS 16.1, *) else { return }

        if refreshSnapshot {
            CalendarWidgetStore.saveUpcomingEventsSnapshot()
        }
        let state = makeContentState()

        Task {
            for activity in Activity<CalendarLiveActivityAttributes>.activities {
                if #available(iOS 16.2, *) {
                    await activity.update(
                        ActivityContent(state: state, staleDate: Self.staleDate(for: state))
                    )
                } else {
                    await activity.update(using: state)
                }
            }

            await MainActor.run {
                self.refreshStatus()
            }
        }
    }

    private func makeContentState() -> CalendarLiveActivityAttributes.ContentState {
        Self.makeContentState(from: CalendarWidgetStore.upcomingEventsSnapshot())
    }

    nonisolated static func makeContentState(
        from snapshots: [CalendarWidgetStore.UpcomingEventSnapshot]
    ) -> CalendarLiveActivityAttributes.ContentState {
        let now = Date()
        // Every ActivityKit request must keep its combined attributes and
        // content state below 4 KB. The UI only renders the next event; retain
        // two additional events so it can roll forward without sending the
        // entire widget snapshot to ActivityKit.
        let maximumEventCount = 3

        return CalendarLiveActivityAttributes.ContentState(
            updatedAt: Date(),
            events: snapshots
                .filter { !$0.isAllDay && $0.startDate > now }
                .sorted { lhs, rhs in
                    lhs.startDate < rhs.startDate
                }
                .prefix(maximumEventCount)
                .map {
                    CalendarLiveActivityEvent(
                        id: $0.id,
                        title: $0.title,
                        startDate: $0.startDate,
                        endDate: $0.endDate,
                        isAllDay: $0.isAllDay,
                        location: $0.location,
                        videoCallPlatform: $0.videoCallPlatform,
                        colorRed: $0.colorRed,
                        colorGreen: $0.colorGreen,
                        colorBlue: $0.colorBlue,
                        colorAlpha: $0.colorAlpha
                    )
                }
        )
    }

    nonisolated static func staleDate(for state: CalendarLiveActivityAttributes.ContentState) -> Date? {
        let now = Date()
        return state.events
            .filter { !$0.isAllDay && $0.startDate > now }
            .map(\.startDate)
            .min()
    }
}
