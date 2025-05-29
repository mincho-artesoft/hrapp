import Foundation
import StoreKit
import SwiftUI

/// Centralised logic for deciding *when* to surface the in‑app ★ rating prompt.
///
/// ‑ Fires **at most** three times in 365 days (system‑enforced).
/// ‑ Local policy:
///   * ≥ 5 launches **and** ≥ 3 days since first launch **OR**
///   * ≥ 3 events created from the “Add” button.
///   * ≥ 120 days cooldown between two prompts (so you ‘spend’ one per season).
///
/// Integrate by calling
/// ```swift
/// ReviewManager.appLaunched()
/// ```
/// once per launch (e.g. in `scenePhase == .active`) **and**
/// ```swift
/// ReviewManager.eventCreated()
/// ```
/// right after a successful event creation via the bottom bar.
///
/// All counters are kept in `UserDefaults` under the `rm_` namespace.
@MainActor
enum ReviewManager {
    // MARK: ‑ Tunables
    private static let requiredLaunches        = 5
    private static let requiredDaysAfterInstall = 1
    private static let requiredCreatedEvents    = 3
    private static let cooldownDays            = 120

    // MARK: ‑ Keys
    private static let installDateKey  = "rm_installDate"
    private static let launchCountKey  = "rm_launchCount"
    private static let createCountKey  = "rm_createCount"
    private static let lastPromptKey   = "rm_lastPromptDate"

    // MARK: ‑ Public entry points
    static func appLaunched() {
        let ud = UserDefaults.standard
        if ud.object(forKey: installDateKey) == nil {
            ud.set(Date(), forKey: installDateKey)
        }
        ud.set(ud.integer(forKey: launchCountKey) + 1, forKey: launchCountKey)
        evaluateIfNeeded()
    }

    static func eventCreated() {
        let ud = UserDefaults.standard
        ud.set(ud.integer(forKey: createCountKey) + 1, forKey: createCountKey)
        evaluateIfNeeded()
    }

    // MARK: ‑ Internal logic
    private static func evaluateIfNeeded() {
        guard shouldPrompt else { return }
        guard let scene = UIApplication.shared.connectedScenes
                .compactMap({ $0 as? UIWindowScene })
                .first(where: { $0.activationState == .foregroundActive }) else { return }

        Task {
            if #available(iOS 18, *) {
                AppStore.requestReview(in: scene)
            } else {
                SKStoreReviewController.requestReview(in: scene)
            }
            UserDefaults.standard.set(Date(), forKey: lastPromptKey)
            resetCounters()
        }
    }

    private static var shouldPrompt: Bool {
        let ud = UserDefaults.standard
        let launches  = ud.integer(forKey: launchCountKey)
        let created   = ud.integer(forKey: createCountKey)
        guard let install = ud.object(forKey: installDateKey) as? Date else { return false }
        guard Date().timeIntervalSince(install) >= Double(requiredDaysAfterInstall) * 86_400 else { return false }

        let reachedThresholds = (launches >= requiredLaunches) || (created >= requiredCreatedEvents)
        guard reachedThresholds else { return false }

        if let last = ud.object(forKey: lastPromptKey) as? Date {
            return Date().timeIntervalSince(last) >= Double(cooldownDays) * 86_400
        }
        return true
    }

    private static func resetCounters() {
        UserDefaults.standard.set(0, forKey: launchCountKey)
        UserDefaults.standard.set(0, forKey: createCountKey)
    }
}
