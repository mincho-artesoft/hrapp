# Native Mac calendar source

Source repository: `/Users/aleksandarsvinarov/Desktop/Repo/wonek/app/HRCalendar`.

`Calendar/Mac/Wonek/MacTabletCalendarViews.swift` contains the Day, MultiDay, MultiCalendar, Month, Year, List, search, event details/editor and calendar editor from `Main/MacTabletCalendarView.swift`. The timeline, drag/resize, range selection, date pickers, formatting, recurrence and context-menu helpers are copied from the corresponding Wonek components. `WonekMacPort.json` records source filenames and hashes.

HRApp keeps its own root navigation: the shared iPad sidebar, Wonek Mac header/view chooser, a right-pane Menu page opened from the top-right view picker and full-window Weather. Mac has no bottom bar. Wonek's root navigation, menu page, chat invitations and debug fixtures are excluded. Chat sharing is adapted to the native share sheet. Source wrappers use native SwiftUI sheets and confirmation dialogs; the event/calendar layouts remain the source views.

`MacCalendarAdapters.swift` bridges HRApp local documents to the source views' unsaved EventKit display objects, preserving native EventKit calendars. It never creates an account or a calendar automatically. Local recurring events use Wonek's recurrence expansion without persisting generated occurrences. `MacEventData.swift` uses the same portable alarm/location/recurrence models as HRApp iOS. All Mac source files are limited to the macOS platform in the existing `Calendar` target.

Validation: native macOS and connected iPad Debug builds; iPad update-install and launch with fixtures disabled; Mac menu, calendar editor and MultiDay checked in the running app. A separately identified Debug QA copy (`Deksan.CalendarASD.MacInteractionQA`) uses temporary local documents and no cloud session. Verified selection, moving a test event to another day/hour, resizing its end, hold-to-create with exact dates/times, and the right-click action menu. The isolated interaction checks did not request real account calendar access or edit real events. The normal signed build also displays the user-authorized native calendars. Empty calendars now show a message on hold/double-click explaining how to add a writable destination or enable access.

Data regression test:

```sh
xcrun swiftc native/Calendar/Sharing/DeviceCalendarReplica.swift native/Calendar/Sharing/SharedEventData.swift native/Calendar/Sharing/SharedEventWireCompatibility.swift native/Calendar/Mac/MacEventData.swift native/Calendar/Mac/Wonek/AppLocalRecurrence.swift native/scripts/tests/MacCalendarPortTests.swift -o /tmp/hrapp-mac-port-tests
/tmp/hrapp-mac-port-tests
```

The Mac Weather root adapts HRApp iOS `WeatherView/WeatherKitView.swift`; forecast cards, graphs, region storage and WeatherKit models are shared. Saved Regions uses a custom trailing Done button. Calendar menu rows and Sharing navigation rows use shared iOS components, with platform-neutral colors and explicit typography. Subscriptions and Apps use the actual shared iOS views.

`CalendarWidget` is one multiplatform extension target, embedded in both app builds. Live Activities remain iOS-only. Native Mac publishes selected native/local event occurrences, weather and formatting through the same App Group snapshot format. Calendar permissions are not required for app-local event snapshots.

Mac windows have a 1280 × 720 minimum content size. Weather and Saved Regions center their content in a column capped at 70% of the window width while keeping full-window backgrounds. The Weather metric menu uses the same `MacChoiceMenu` as the calendar view chooser. Subscription categories share a custom full-width segmented control across Mac/iOS. Picker hit regions cover their complete labels/segments, including padding.

Native Mac persists the active view using the iOS `selectedTabRoot` preference, plus its Menu section and previous calendar view. Reopening restores Calendar/Weather/Menu rather than always starting in Month.

The Calendar action labels (local/iCloud/share/Google/Microsoft), account sign-in content, Web Authenticator, Sharing page header and shared-event rows are now shared with iOS. Mac notification switches explicitly reserve the trailing edge of their rows. Sidebar Open event uses the shared app button style instead of a platform-specific bordered control. Today and month arrows retain their original plain style, as requested. Calendar permission recovery is shown on Add iCloud Calendar; there is no permanent access banner on either platform.

Mac Cloud Calendars sign-in shares the iOS PKCE and identity/session API, opens the default browser, and accepts only the matching in-memory callback state; iOS retains AuthenticationServices. All Mac picker choices share neutral material rows and a leading selection check instead of a blue selected row. Calendar-source authorization is separate: it requests Google Calendar or Microsoft Graph calendar scopes, stores refresh credentials in Keychain and synchronizes provider calendars into app-local documents. Provider snapshots use conditional writes and stable creation IDs; errors preserve local pending changes. Connecting or using these provider calendars does not require EventKit permission. Microsoft retains the existing Premium requirement. No real provider credentials, consent or remote calendar edits were submitted during development validation.

Provider wire regression test:

```sh
xcrun swiftc native/Calendar/Sharing/DeviceCalendarReplica.swift native/Calendar/Sharing/SharedEventData.swift native/Calendar/Sharing/SharedEventWireCompatibility.swift native/Calendar/Mac/MacEventData.swift native/Calendar/Mac/MacCalendarProviderEventWire.swift native/scripts/tests/MacProviderEventWireTests.swift -o /tmp/hrapp-provider-wire-tests
/tmp/hrapp-provider-wire-tests
```

API references: [Google event versions](https://developers.google.com/workspace/calendar/api/guides/version-resources), [Google event listing](https://developers.google.com/workspace/calendar/api/v3/reference/events/list), [Microsoft calendarView](https://learn.microsoft.com/en-us/graph/api/calendar-list-calendarview?view=graph-rest-1.0), [Microsoft dateTimeTimeZone](https://learn.microsoft.com/en-us/graph/api/resources/datetimetimezone?view=graph-rest-1.0).

Mac modal headers use `CalendarSheetNavigation`: iOS keeps its navigation bar, while Mac renders only the shared custom header. This removes duplicate Web Authenticator/Web Sign-In titles and redundant navigation chrome from Saved Regions, lunar/solar detail and Map Data sheets. Calendar/event editors hide the native window toolbar while retaining their own navigation. Web Authenticator was visually verified with one centered title and one Close button. Final Debug builds, update installs and launches succeeded for native Mac, iPad Air M3 and iPhone SE; no Wonek project or simulator was built or modified.
