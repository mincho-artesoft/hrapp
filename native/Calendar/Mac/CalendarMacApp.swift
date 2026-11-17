import SwiftUI

@main
struct CalendarMacApp: App {
    @StateObject private var appPreferences = AppPreferences.shared
    init() { MacMenuSizing.shared.start() }
    var body: some Scene {
        WindowGroup("Cloud Calendars") {
            Group {
                #if DEBUG
                if PhysicalSharingAudit.requested { PhysicalSharingAuditView() } else { CalendarMacRoot() }
                #else
                CalendarMacRoot()
                #endif
            }.frame(minWidth: 1280, minHeight: 720).tint(.appBlue)
                .handlesExternalEvents(preferring: ["*"], allowing: ["*"])
                .onOpenURL { url in
                    if !CloudAccountManager.shared.handleBrowserCallback(url) {
                        CloudAccountManager.calendarConnections.handleBrowserCallback(url)
                    }
                }
                // Set preferences at the scene content boundary so sheets,
                // including sheets opened by nested views, inherit them too.
                .environment(\.locale, appPreferences.presentationLocale)
                .environment(\.calendar, appPreferences.presentationCalendar)
                .environment(\.layoutDirection, appPreferences.layoutDirection)
        }
        .defaultSize(width: 1280, height: 860)
        .windowResizability(.contentMinSize)
        .windowStyle(.hiddenTitleBar)
    }
}
