import Foundation

// Compile with the real CalendarFeedSession and ReceivedSharingVisibility.
// API/authenticator doubles keep this suite offline in an isolated storage directory.
enum CloudCalendarsAPI {
    struct AccountIdentity: Codable, Equatable { let provider: String; let email: String? }
    struct Session: Codable, Equatable {
        let calendarId: String; let deviceToken: String; let feedId: String; let feedUrl: String
        var email: String?; var provider: String?; var ownerId: String?; var identities: [AccountIdentity]?
    }
    enum Failure: Error { case http(Int, String) }
    @MainActor static var response: Session!
    @MainActor static func resolve(provider: String, token: String, linkingTo: Session?, name: String) async throws -> Session { response }
    @MainActor static func unlinkIdentity(provider: String, session: Session) async throws -> Session { response }
}
@MainActor final class WebStudioAuthenticatorStore {
    static let shared = WebStudioAuthenticatorStore()
    var clearCount = 0
    func clear() { clearCount += 1 }
}

@main enum CloudAccountSignOutTests {
    @MainActor static func main() async throws {
        let folder = CommandLine.arguments[1]
        let root = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent(folder)
        defer { try? FileManager.default.removeItem(at: root) }
        var checks = 0
        func check(_ condition: Bool, _ label: String) {
            precondition(condition, label); checks += 1
        }
        func session(_ account: String, providers: [String], token: String) -> CloudCalendarsAPI.Session {
            .init(calendarId: account, deviceToken: token, feedId: "feed", feedUrl: "https://example.com/feed",
                  email: "test@example.com", provider: providers.first, ownerId: account,
                  identities: providers.map { .init(provider: $0, email: "test@example.com") })
        }
        // Reproduce the real iPad's persisted state after the visible providers
        // were removed but the server's web email identity remained.
        try FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
        let orphan = session("A", providers: ["email"], token: "orphan")
        let orphanFile = root.appendingPathComponent("feed-session-debug.json")
        try JSONEncoder().encode(orphan).write(to: orphanFile)
        ReceivedSharingVisibility.activate(accountID: "A")
        ReceivedSharingVisibility.register(["legacy-received"], kind: "calendar", accountID: "A")
        check(CalendarFeedSession.existing == nil, "Web email alone does not keep the app connected")
        check(!FileManager.default.fileExists(atPath: orphanFile.path), "Orphan persisted session is migrated on launch")
        check(!ReceivedSharingVisibility.isVisible("legacy-received", kind: "calendar"), "Migration hides previously received calendars")
        check(WebStudioAuthenticatorStore.shared.clearCount == 1, "Migration clears the stale authenticator")
        WebStudioAuthenticatorStore.shared.clearCount = 0
        check(CalendarFeedSession.appIdentities(in: session("A", providers: ["apple", "google", "microsoft", "email"], token: "test")).count == 3,
              "Only the three native providers count as active logins")
        check(CalendarFeedSession.appIdentities(in: session("A", providers: ["google", "email"], token: "test")).count == 1,
              "A hidden email identity cannot prevent final local sign-out")
        var legacy = session("A", providers: ["apple"], token: "legacy")
        legacy.identities = nil
        check(CalendarFeedSession.appIdentities(in: legacy).count == 1, "Old native sessions without a provider list remain compatible")
        legacy.identities = []
        check(CalendarFeedSession.appIdentities(in: legacy).isEmpty, "Explicit empty list cannot resurrect the old primary provider")
        CloudCalendarsAPI.response = session("A", providers: ["apple", "google", "email"], token: "one")
        let first = try await CalendarFeedSession.authenticate(provider: "apple", token: "test")
        ReceivedSharingVisibility.register(["received-calendar"], kind: "calendar", accountID: "A")
        ReceivedSharingVisibility.register(["received-event"], kind: "event", accountID: "A")
        check(ReceivedSharingVisibility.isVisible("received-calendar", kind: "calendar"), "Signed-in recipient sees calendar")
        check(ReceivedSharingVisibility.isVisible("received-event", kind: "event"), "Signed-in recipient sees event")

        CloudCalendarsAPI.response = session("A", providers: ["google", "email"], token: "two")
        let remaining = try await CalendarFeedSession.disconnect(provider: "apple")
        check(CalendarFeedSession.appIdentities(in: remaining).count == 1, "Unlinking one identity retains the remaining identity")
        check(ReceivedSharingVisibility.isVisible("received-event", kind: "event"), "Partial sign-out keeps received data")
        check(!CalendarFeedSession.isCurrent(first), "Old in-flight token cannot publish after unlink")
        check(CalendarFeedSession.isCurrent(remaining), "Replacement session remains active")

        let providerDefaults = UserDefaults.standard
        providerDefaults.set("independent-google-token", forKey: "test.google.calendar.connection")
        providerDefaults.set("independent-microsoft-token", forKey: "test.microsoft.calendar.connection")
        defer {
            providerDefaults.removeObject(forKey: "test.google.calendar.connection")
            providerDefaults.removeObject(forKey: "test.microsoft.calendar.connection")
        }
        CalendarFeedSession.forget()
        check(CalendarFeedSession.existing == nil, "Last sign-out removes the session")
        check(!CalendarFeedSession.isCurrent(remaining), "Late network result cannot use logged-out session")
        check(WebStudioAuthenticatorStore.shared.clearCount == 1, "Authenticator is cleared on final sign-out")
        check(!ReceivedSharingVisibility.isVisible("received-event", kind: "event"), "Received event is hidden")
        check(!ReceivedSharingVisibility.isVisible("received-calendar", kind: "calendar"), "Received calendar is hidden")
        for kind in ["calendar", "event"] {
            check(ReceivedSharingVisibility.isVisible("owned-and-shared-by-me", kind: kind), "Owned/outgoing data survives")
            check(ReceivedSharingVisibility.isVisible("provider-google", kind: kind), "Google calendars survive")
            check(ReceivedSharingVisibility.isVisible("provider-microsoft", kind: kind), "Microsoft calendars survive")
        }
        check(providerDefaults.string(forKey: "test.google.calendar.connection") != nil, "Google connection retained")
        check(providerDefaults.string(forKey: "test.microsoft.calendar.connection") != nil, "Microsoft connection retained")
        let file = root.appendingPathComponent("feed-session-debug.json")
        check(!FileManager.default.fileExists(atPath: file.path), "Persisted session removed")
        try JSONEncoder().encode(remaining).write(to: file)
        check(CalendarFeedSession.existing == nil, "A stale disk file cannot repopulate a logged-out in-memory session")
        try FileManager.default.removeItem(at: file)

        CloudCalendarsAPI.response = session("B", providers: ["microsoft"], token: "three")
        _ = try await CalendarFeedSession.authenticate(provider: "microsoft", token: "test")
        check(!ReceivedSharingVisibility.isVisible("received-event", kind: "event"), "Different account cannot see old received event")
        check(!ReceivedSharingVisibility.isVisible("received-calendar", kind: "calendar"), "Different account cannot see old calendar")
        ReceivedSharingVisibility.register(["received-event"], kind: "event", accountID: "B", onlyUnscoped: true)
        check(!ReceivedSharingVisibility.isVisible("received-event", kind: "event"), "Legacy migration never claims another account's data")
        CalendarFeedSession.forget()
        CloudCalendarsAPI.response = session("A", providers: ["google"], token: "four")
        _ = try await CalendarFeedSession.authenticate(provider: "google", token: "test")
        check(ReceivedSharingVisibility.isVisible("received-event", kind: "event"), "Same account recovers received event")
        check(ReceivedSharingVisibility.isVisible("received-calendar", kind: "calendar"), "Same account recovers received calendar")
        CloudCalendarsAPI.response = session("A", providers: ["email"], token: "web-only")
        _ = try await CalendarFeedSession.disconnect(provider: "google")
        check(CalendarFeedSession.existing == nil, "Web-only unlink response completes local logout")
        check(!ReceivedSharingVisibility.isVisible("received-event", kind: "event"), "Web-only unlink response hides received events")
        check(!FileManager.default.fileExists(atPath: file.path), "Web-only unlink response is never stored as an app login")
        CalendarFeedSession.forget()
        print("PASS: \(checks) account sign-out regression checks")
    }
}
