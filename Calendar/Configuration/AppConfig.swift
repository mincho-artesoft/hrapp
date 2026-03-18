import Foundation

enum AppVariant: String {
    case cloud
    case dreams
}

enum AppConfig {
    #if DREAMS_APP
    static let variant: AppVariant = .dreams
    static let googleSyncEnabled = false
    static let microsoftSyncEnabled = false
    static let googleClientID = ""
    static let microsoftClientID = ""
    static let microsoftRedirectURI = ""
    static let appGroupSuiteName: String? = nil
    static let subscriptionProductIDs: [String] = []
    #else
    static let variant: AppVariant = .cloud
    static let googleSyncEnabled = true
    static let microsoftSyncEnabled = true
    static let googleClientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"
    static let microsoftClientID = "5b1a5159-948f-4b5b-ac6a-009df927c665"
    static let microsoftRedirectURI = "msauth.\(Bundle.main.bundleIdentifier ?? "Deksan.CalendarASD")://auth"
    static let appGroupSuiteName: String? = "group.ARTE-SOFT.sandBOX"
    static let subscriptionProductIDs: [String] = [
        "Cloud.Calendars.Advanced.Monthly",
        "Cloud.Calendars.Advanced.Yearly",
        "Cloud.Calendars.Premium.Monthly",
        "Cloud.Calendars.Premium.Yearly"
    ]
    #endif
}
