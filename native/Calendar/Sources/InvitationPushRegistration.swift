import Foundation
import Security
import UIKit
import UserNotifications

/// One private installation identity, independently bound to the signed-in
/// Cloud Calendars account. Provider calendar accounts are never used here.
@MainActor
final class InvitationPushRegistration {
    static let shared = InvitationPushRegistration()

    private struct Installation: Codable {
        var id: String
        var secret: String
        var revision: Int
        var lastToken: String?
        var registered: Bool = false
        // Protected, excluded-from-backup credential used only to disable the
        // old installation. It never becomes a CalendarFeedSession again.
        var pendingSignOut: CloudCalendarsAPI.Session?
    }

    private var installation: Installation?
    private var deviceToken: String?
    private var syncTask: Task<Void, Never>?
    private var needsSync = false
    private var generation = 0
    private var cleanupTask: Task<Void, Never>?
    private(set) var remoteInvitationsEnabled = false
    private(set) var lastError: String?

    #if DEBUG
    var auditStatus: [String: Any] {
        ["hasAPNsToken": deviceToken != nil, "remoteInvitationsEnabled": remoteInvitationsEnabled,
         "lastError": lastError ?? "", "environment": Self.environment]
    }
    #endif

    private init() {}

    func start() {
        Task {
            await retrySignOutCleanup()
            guard CalendarFeedSession.existing != nil,
                  (try? loadInstallation().pendingSignOut) == nil else {
                UIApplication.shared.unregisterForRemoteNotifications()
                return
            }
            // Re-register after a later login, but only after the old account's
            // push binding has been disabled on the server.
            UIApplication.shared.registerForRemoteNotifications()
            requestSync()
        }
    }

    func received(token: Data) {
        guard CalendarFeedSession.existing != nil,
              (try? loadInstallation().pendingSignOut) == nil else {
            UIApplication.shared.unregisterForRemoteNotifications()
            return
        }
        deviceToken = token.map { String(format: "%02x", $0) }.joined()
        lastError = nil
        print("[InvitationPush] APNs device registration succeeded")
        requestSync()
    }

    func failedToRegister() {
        remoteInvitationsEnabled = false
        lastError = "APNs registration failed"
        print("[InvitationPush] APNs registration failed; foreground fallback remains available")
    }

    func requestSync() {
        needsSync = true
        Task { await synchronize() }
    }

    func synchronize() async {
        if let syncTask { await syncTask.value; return }
        guard CalendarFeedSession.existing != nil,
              (try? loadInstallation().pendingSignOut) == nil else { return }
        let currentGeneration = generation
        needsSync = true
        let task = Task { @MainActor in
            while self.needsSync && self.generation == currentGeneration && !Task.isCancelled {
                self.needsSync = false
                await self.syncOnce()
            }
        }
        syncTask = task
        await task.value
        syncTask = nil
    }

    private func syncOnce() async {
        guard let token = deviceToken, let session = CalendarFeedSession.existing else {
            remoteInvitationsEnabled = false
            return
        }
        let currentGeneration = generation
        let settings = await UNUserNotificationCenter.current().notificationSettings()
        guard !Task.isCancelled, generation == currentGeneration, CalendarFeedSession.isCurrent(session) else { return }
        let authorized = settings.authorizationStatus == .authorized
            || settings.authorizationStatus == .provisional
            || settings.authorizationStatus == .ephemeral
        let enabled = authorized && PendingEventInvitationManager.shared.invitationNotificationsEnabled
        do {
            var state = try loadInstallation()
            state.lastToken = token
            state.revision += 1
            try save(state)
            let remote = try await CloudCalendarsAPI.registerInvitationPush(
                installationId: state.id, secret: state.secret, revision: state.revision,
                token: token, environment: Self.environment, enabled: enabled, session: session
            )
            guard !Task.isCancelled, generation == currentGeneration,
                  CalendarFeedSession.isCurrent(session) else { return }
            state.registered = true
            try save(state)
            remoteInvitationsEnabled = remote
            lastError = nil
            print("[InvitationPush] Server registration complete; remote invitations: \(remote)")
        } catch {
            guard generation == currentGeneration, CalendarFeedSession.isCurrent(session) else { return }
            // Keep the previous remote state on a transient refresh error to
            // avoid doubling a push with the foreground polling notification.
            lastError = "Push registration could not reach the server"
            print("[InvitationPush] Server registration requires retry")
        }
    }

    /// Local logout must not depend on a network response. Stop APNs delivery
    /// immediately, then durably retry server cleanup without keeping the UI
    /// or received shares signed in. Independent provider accounts are untouched.
    func prepareForSignOut(session: CloudCalendarsAPI.Session?) {
        generation += 1
        needsSync = false
        syncTask?.cancel()
        deviceToken = nil
        remoteInvitationsEnabled = false
        UIApplication.shared.unregisterForRemoteNotifications()
        do {
            var state = try loadInstallation()
            if let session, state.lastToken != nil {
                state.pendingSignOut = session
                state.revision += 1
            }
            state.registered = false
            try save(state)
        } catch {
            lastError = "Push cleanup could not be saved"
        }
        Task { await retrySignOutCleanup() }
    }

    private func retrySignOutCleanup() async {
        if let cleanupTask { await cleanupTask.value; return }
        let task = Task { @MainActor in
            do {
                var state = try self.loadInstallation()
                guard let session = state.pendingSignOut, let token = state.lastToken else { return }
                // Each retry is newer: a timed-out response may already have
                // committed the previous disable on the server.
                state.revision += 1
                try self.save(state)
                _ = try await CloudCalendarsAPI.registerInvitationPush(
                    installationId: state.id, secret: state.secret, revision: state.revision,
                    token: token, environment: Self.environment, enabled: false, session: session
                )
                guard try self.loadInstallation().revision == state.revision else { return }
                state.pendingSignOut = nil
                state.registered = false
                try self.save(state)
                self.lastError = nil
            } catch {
                self.lastError = "Push sign-out cleanup will retry"
            }
        }
        cleanupTask = task
        await task.value
        cleanupTask = nil
    }

    private static var environment: String {
        // Simulator and development builds use Apple's sandbox, not live APNs.
        #if DEBUG || targetEnvironment(simulator)
        "sandbox"
        #else
        "production"
        #endif
    }

    private func storageURL() throws -> URL {
        let support = try FileManager.default.url(for: .applicationSupportDirectory,
            in: .userDomainMask, appropriateFor: nil, create: true)
        return support.appendingPathComponent("InvitationPushInstallation.json")
    }

    private func loadInstallation() throws -> Installation {
        if let installation { return installation }
        let url = try storageURL()
        if FileManager.default.fileExists(atPath: url.path) {
            let stored = try JSONDecoder().decode(Installation.self, from: Data(contentsOf: url))
            installation = stored
            return stored
        }
        var bytes = [UInt8](repeating: 0, count: 32)
        guard SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes) == errSecSuccess else {
            throw CocoaError(.fileWriteUnknown)
        }
        let created = Installation(id: UUID().uuidString, secret: bytes.map { String(format: "%02x", $0) }.joined(), revision: 0)
        try save(created)
        return created
    }

    private func save(_ state: Installation) throws {
        var url = try storageURL()
        try JSONEncoder().encode(state).write(to: url, options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
        var values = URLResourceValues()
        values.isExcludedFromBackup = true
        try url.setResourceValues(values)
        installation = state
    }
}
