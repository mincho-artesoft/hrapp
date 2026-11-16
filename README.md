# Cloud Calendars — Unified Monorepo

Complete codebase for **Cloud Calendars** (`iOS`, `iPadOS`, `macOS`, `watchOS`, Angular Web App, and NestJS Backend API).

## Repository Structure

- **[`native/`](./native)** — Native Swift / SwiftUI application (`Cloud Calendars for Google, Microsoft and iCloud.xcodeproj`), WidgetKit extensions (`CalendarWidget`), and App Clip (`CalendarAppClip`).
- **[`web/`](./web)** — Angular web application and marketing/documentation portal (`www.cloud-calendars.com`, `/calendar/`, `/book/`).
- **[`backend/`](./backend)** — NestJS serverless API (`api.cloud-calendars.com` on AWS Lambda + Hetzner calendar storage `cal.cloud-calendars.com`).

