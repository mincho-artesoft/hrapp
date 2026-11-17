#if os(macOS)
import Foundation

/// The iOS sharing view talks to the native Google ACL, not an unrelated Cloud Calendars copy.
@MainActor
final class MacGoogleCalendarSharingAdapter: ObservableObject {
    let providers: MacCalendarProviderStore
    let accountID: String
    init(providers: MacCalendarProviderStore, accountID: String) {
        self.providers = providers; self.accountID = accountID
    }
    func fetchGoogleCalendarAclList(googleCalendarID: String, accessToken: String) async throws -> [GoogleCalendarACLRule] {
        try await providers.googleCalendarACL(accountID: accountID, calendarID: googleCalendarID)
    }
    func insertGoogleCalendarAcl(googleCalendarID: String, accessToken: String, emailToShare: String, ruleRole: String) async throws -> GoogleCalendarACLRule {
        guard let rule = try await providers.changeGoogleCalendarACL(accountID: accountID, calendarID: googleCalendarID,
            method: "POST", body: ["scope": ["type": "user", "value": emailToShare], "role": ruleRole]) else {
            throw MacCalendarProviderStore.Failure.invalidResponse
        }
        return rule
    }
    func deleteGoogleCalendarAclRule(googleCalendarID: String, aclRuleID: String, accessToken: String) async throws {
        _ = try await providers.changeGoogleCalendarACL(accountID: accountID, calendarID: googleCalendarID, ruleID: aclRuleID, method: "DELETE")
    }
    func updateGoogleCalendarAclRule(googleCalendarID: String, aclRuleID: String, accessToken: String, newRole: String) async throws {
        _ = try await providers.changeGoogleCalendarACL(accountID: accountID, calendarID: googleCalendarID,
            ruleID: aclRuleID, method: "PATCH", body: ["role": newRole])
    }
}
#endif
