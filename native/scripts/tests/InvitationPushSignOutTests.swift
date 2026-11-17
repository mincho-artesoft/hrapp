import Foundation

// UI/transport doubles only. Compile the real push registration implementation
// with an isolated installation file; never contact APNs or the live server.
@MainActor final class UIApplication {
    static let shared = UIApplication()
    var registrations = 0
    var unregistrations = 0
    func registerForRemoteNotifications() { registrations += 1 }
    func unregisterForRemoteNotifications() { unregistrations += 1 }
}
struct NotificationSettings: Sendable {
    enum Status: Sendable { case authorized, provisional, ephemeral }
    let authorizationStatus = Status.authorized
}
struct UNUserNotificationCenter: Sendable {
    static func current() -> Self { .init() }
    func notificationSettings() async -> NotificationSettings { .init() }
}
@MainActor enum CalendarFeedSession {
    static var existing: CloudCalendarsAPI.Session?
    static func isCurrent(_ session: CloudCalendarsAPI.Session) -> Bool { existing == session }
}
@MainActor enum PendingEventInvitationManager {
    static let shared = Manager()
    struct Manager { let invitationNotificationsEnabled = true }
}
@MainActor enum CloudCalendarsAPI {
    struct Session: Codable, Equatable { var deviceToken: String }
    static var failDisable = false
    static var delayEnable = false
    static var heldEnable: CheckedContinuation<Bool, Never>?
    static var disableCalls = 0
    static func registerInvitationPush(installationId: String, secret: String, revision: Int,
        token: String, environment: String, enabled: Bool, session: Session) async throws -> Bool {
        if !enabled {
            disableCalls += 1
            if failDisable { throw URLError(.notConnectedToInternet) }
        } else if delayEnable {
            return await withCheckedContinuation { heldEnable = $0 }
        }
        return enabled
    }
}
@main enum InvitationPushSignOutTests {
    @MainActor static func main() async throws {
        let file = URL(fileURLWithPath: CommandLine.arguments[1])
        defer { try? FileManager.default.removeItem(at: file) }
        var checks = 0
        func check(_ value: Bool, _ message: String) { precondition(value, message); checks += 1 }
        func wait(_ condition: () -> Bool) async {
            for _ in 0..<1000 {
                if condition() { return }
                try? await Task.sleep(for: .milliseconds(1))
            }
            preconditionFailure("Async operation did not finish")
        }
        func state() -> [String: Any] { (try? JSONSerialization.jsonObject(with: Data(contentsOf: file))) as? [String: Any] ?? [:] }
        let push = InvitationPushRegistration.shared
        CalendarFeedSession.existing = .init(deviceToken: "old-session")
        push.start()
        await wait { UIApplication.shared.registrations > 0 }
        push.received(token: Data([1, 2, 3]))
        await push.synchronize()
        check(push.remoteInvitationsEnabled, "Initial registration enables remote invitations")
        CloudCalendarsAPI.failDisable = true
        push.prepareForSignOut(session: CalendarFeedSession.existing)
        CalendarFeedSession.existing = nil
        check(!push.remoteInvitationsEnabled, "Remote state turns off synchronously")
        check(UIApplication.shared.unregistrations > 0, "Device APNs delivery is stopped immediately")
        check(state()["pendingSignOut"] != nil, "Failed cleanup can survive a process restart")
        await wait { push.lastError != nil }
        check(state()["registered"] as? Bool == false, "Offline sign-out never remains registered locally")
        let registrations = UIApplication.shared.registrations
        CalendarFeedSession.existing = .init(deviceToken: "new-session")
        push.start()
        await wait { CloudCalendarsAPI.disableCalls > 1 }
        check(UIApplication.shared.registrations == registrations, "New login cannot re-enable old account push while cleanup fails")
        CloudCalendarsAPI.failDisable = false
        push.start()
        await wait { state()["pendingSignOut"] == nil }
        await wait { UIApplication.shared.registrations > registrations }
        check(state()["pendingSignOut"] == nil, "Successful retry removes the old cleanup credential")
        push.received(token: Data([1, 2, 3]))
        await push.synchronize()
        check(push.remoteInvitationsEnabled, "A new login can register again after cleanup")
        CloudCalendarsAPI.delayEnable = true
        let delayed = Task { await push.synchronize() }
        await wait { CloudCalendarsAPI.heldEnable != nil }
        let revision = state()["revision"] as? Int ?? 0
        push.prepareForSignOut(session: CalendarFeedSession.existing)
        CalendarFeedSession.existing = nil
        await wait { state()["pendingSignOut"] == nil }
        CloudCalendarsAPI.heldEnable?.resume(returning: true)
        CloudCalendarsAPI.heldEnable = nil
        await delayed.value
        check(!push.remoteInvitationsEnabled, "Late registration cannot reactivate a signed-out account")
        check(state()["registered"] as? Bool == false, "Late response cannot overwrite persisted sign-out")
        check((state()["revision"] as? Int ?? 0) > revision, "Server disable supersedes an in-flight enable")
        print("PASS: \(checks) push sign-out regression checks")
    }
}
