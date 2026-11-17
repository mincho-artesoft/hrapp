# Cloud Calendars — Unified Monorepo

Complete codebase for **Cloud Calendars** (`iOS`, `iPadOS`, `macOS`, `watchOS`, Angular Web App, and NestJS Backend API).

## Repository Structure

- **[`native/`](./native)** — Native Swift / SwiftUI application (`Cloud Calendars for Google, Microsoft and iCloud.xcodeproj`), WidgetKit extensions (`CalendarWidget`), and App Clip (`CalendarAppClip`).
- **[`web/`](./web)** — Angular web application and marketing/documentation portal (`www.cloud-calendars.com`, `/calendar/`, `/book/`).
- **[`backend/`](./backend)** — NestJS API. Debug runs on Hetzner at `storage.wonek.com/cloud-calendars-debug`; production remains `api.cloud-calendars.com` on Lambda pending a separately authorized deployment. Calendar data is stored on Hetzner; email delivery remains Amazon SES. Legacy AWS Debug clients remain supported.

## Local Symlinks

For backward compatibility with existing scripts and toolchains:
- `/Users/minchomilev/work/hrapp` → `/Users/minchomilev/work/cloud-calendars/native`
- `/Users/minchomilev/cloud-calendars` → `/Users/minchomilev/work/cloud-calendars/web`
- `/Users/minchomilev/work/cloud-calendars-api-nest` → `/Users/minchomilev/work/cloud-calendars/backend`

## Native app builds

Open `native/Cloud Calendars for Google, Microsoft and iCloud.xcodeproj` and use the shared `Calendar` scheme. Its main application target supports iPhone, iPad, and native **Mac (macOS SDK)** with bundle identifier `Deksan.CalendarASD`. Mac Catalyst and Designed for iPad are disabled; there is no separate Mac target or scheme.

The macOS entry point and EventKit adapter live in `native/Calendar/Mac/`. Day, MultiDay, MultiCalendar, Month, Year, List, search and both editors use the source components ported from Wonek in `Mac/Wonek/`; `MacCalendarAdapters.swift` connects those views to HRApp documents and EventKit. Source provenance and integration notes are in `native/docs/WonekMacPort.md`. The sidebar, menu section picker, typography and button styles are shared with iPad; Mac uses Wonek’s custom header and view-choice panel. Mac opens Menu in the right pane from the upper-right view picker, has no bottom bar, and shows Weather across the full window. iOS keeps its draggable drawer. The same widget extension supports native macOS and iOS; only its Live Activity is iOS-only. Platform filters keep UIKit, iOS SDK packages and the App Clip out of the Mac build. Set an iOS platform filter on new UIKit-only files; leave portable components shared.

```sh
# Compile iPhone/iPad without booting or changing simulators.
bash native/scripts/build-simulator-app.sh -derivedDataPath /tmp/hrapp-calendar-build

# Compile native Mac with WeatherKit and App Group provisioning.
xcodebuild -project 'native/Cloud Calendars for Google, Microsoft and iCloud.xcodeproj' -scheme Calendar -configuration Debug -destination 'platform=macOS' -derivedDataPath /tmp/hrapp-mac-build -allowProvisioningUpdates CODE_SIGN_STYLE=Automatic CODE_SIGN_IDENTITY='Apple Development' DEVELOPMENT_TEAM=8293TNMX6S
```

The device-calendar web replica requires the backend `/ios/calendars/sync` endpoint. Debug native and development web builds use the Debug API; production deployment is separate. EventKit sync covers the previous year and next two years, retains records outside that window, and keeps subscribed or attendee-managed events read-only on the web.
