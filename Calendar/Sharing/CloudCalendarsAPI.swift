import Foundation

/// Client for the calendar sync service.
///
/// The service exists to answer one question a shared `.ics` file cannot: what
/// happened to this event after it was sent. Everything here is in service of
/// letting an organiser move or cancel an event and have that reach people who
/// already added it.
enum CloudCalendarsAPI {
    /// The API's own domain rather than the generated execute-api hostname.
    /// That hostname belongs to one API in one region, so anything shipped
    /// against it is pinned to today's deployment; this one can be pointed
    /// elsewhere without another App Store release.
    static let baseURL = URL(string: "https://api.cloud-calendars.com")!

    struct Session: Codable, Equatable {
        let calendarId: String
        let deviceToken: String
        let feedId: String
        let feedUrl: String
        var email: String?
    }

    struct Grant: Codable, Equatable {
        let feedId: String
        let role: String
        let feedUrl: String
        let webcal: String
        /// False when this grant already existed - sharing the same event twice
        /// reaches the same feed rather than minting a second subscription.
        var created: Bool?
    }

    enum Failure: LocalizedError {
        case http(Int, String)
        case malformedResponse

        var errorDescription: String? {
            switch self {
            case .http(let code, let body): return "Server returned \(code): \(body)"
            case .malformedResponse:        return "Unreadable response from the server"
            }
        }
    }

    // MARK: - Identity

    /// Exchanges a Google ID token or Microsoft access token for the calendar
    /// that belongs to that account, creating it on first use.
    ///
    /// The provider token is proof of ownership: an email address on its own is
    /// a claim anyone could make, so the server verifies the signature before
    /// handing back a feed. Passing `linkingTo` attaches a second account to a
    /// calendar that already exists, which is what keeps someone with a personal
    /// and a work Gmail from quietly ending up with two calendars.
    static func resolve(
        provider: String,
        token: String,
        linkingTo existing: Session? = nil,
        name: String? = nil,
        timeZone: TimeZone = .current
    ) async throws -> Session {
        var body: [String: Any] = [
            "provider": provider,
            "token": token,
            "timeZone": timeZone.identifier
        ]
        if let name { body["name"] = name }

        return try await send("/resolve", body: body, bearer: existing?.deviceToken)
    }

    /// Fallback for a device with no Google or Microsoft account signed in.
    /// This calendar is reachable only from this device.
    static func register(name: String? = nil, timeZone: TimeZone = .current) async throws -> Session {
        var body: [String: Any] = ["timeZone": timeZone.identifier]
        if let name { body["name"] = name }
        return try await send("/register", body: body, bearer: nil)
    }

    // MARK: - Events

    static func upsertEvent(
        _ event: SharedEventUpload,
        session: Session
    ) async throws {
        try await sendIgnoringResponse(
            "/events/\(event.id)",
            method: "PUT",
            body: event.payload,
            bearer: session.deviceToken
        )
    }

    static func cancelEvent(id: String, session: Session) async throws {
        try await sendIgnoringResponse(
            "/events/\(id)",
            method: "DELETE",
            body: nil,
            bearer: session.deviceToken
        )
    }

    // MARK: - Sharing

    /// Issues a feed for one recipient. Each grant gets its own URL so that
    /// revoking one person never disturbs anybody else's subscription.
    ///
    /// Passing `eventId` scopes the feed to that single event. That is what an
    /// invite should carry: the recipient sees the event they were invited to
    /// and nothing else the sender has ever shared. The call is idempotent for
    /// a given event, so re-sharing reuses the feed the recipient may already
    /// be subscribed to.
    static func createGrant(
        role: String,
        eventId: String? = nil,
        label: String? = nil,
        feedName: String? = nil,
        session: Session
    ) async throws -> Grant {
        var body: [String: Any] = ["role": role]
        if let eventId { body["eventId"] = eventId }
        if let label { body["label"] = label }
        if let feedName { body["feedName"] = feedName }
        return try await send("/grants", body: body, bearer: session.deviceToken)
    }

    static func revokeGrant(feedId: String, session: Session) async throws {
        try await sendIgnoringResponse(
            "/grants/\(feedId)",
            method: "DELETE",
            body: nil,
            bearer: session.deviceToken
        )
    }

    // MARK: - Booking pairing

    /// Authorises a web browser to set up a booking page under this device's
    /// calendar. The browser opens `/book/setup`, shows a QR whose short code
    /// lands here; approving hands that browser a token for this calendar and,
    /// because the approval came from an installed app, marks the owner entitled
    /// to publish without paying. The code is single-use and short-lived.
    static func pairApprove(code: String, session: Session) async throws {
        try await sendIgnoringResponse(
            "/pair/approve",
            method: "POST",
            body: ["code": code],
            bearer: session.deviceToken
        )
    }

    // MARK: - Booking (owner setup on the app path)

    /// One weekly opening: `day` 0–6 (Sun–Sat), start/end minutes from local midnight.
    struct AvailabilityRule: Codable, Equatable {
        var day: Int
        var start: Int
        var end: Int
    }

    struct MeetingType: Codable, Equatable {
        var id: String?
        var name: String
        var durationMinutes: Int
        var location: String?
        var description: String?
    }

    /// The owner's booking-page configuration, as the server stores it.
    struct BookingConfig: Codable, Equatable {
        var handle: String?
        var enabled: Bool
        var displayName: String
        var timeZone: String
        var contactEmail: String?
        var sourceCalendarId: String?
        var meetingTypes: [MeetingType]
        var availability: [AvailabilityRule]
        var slotIntervalMinutes: Int
        var minNoticeHours: Int
        var maxAdvanceDays: Int
    }

    struct SavedBooking: Decodable {
        let bookingUrl: String
        let config: BookingConfig
    }

    /// A confirmed booking, for mirroring into the owner's real calendar.
    struct BookingEvent: Decodable, Equatable {
        let id: String
        let title: String
        let start: Date
        let end: Date
        let location: String?
        let status: String
        let organizerName: String?
        let organizerEmail: String?
        let sequence: Int
        let updatedAt: Date?
    }

    /// Create or update the owner's booking page.
    static func saveBooking(_ config: BookingConfig, session: Session) async throws -> SavedBooking {
        var body: [String: Any] = [
            "enabled": config.enabled,
            "displayName": config.displayName,
            "timeZone": config.timeZone,
            "slotIntervalMinutes": config.slotIntervalMinutes,
            "minNoticeHours": config.minNoticeHours,
            "maxAdvanceDays": config.maxAdvanceDays,
            "meetingTypes": config.meetingTypes.map { t -> [String: Any] in
                var m: [String: Any] = ["name": t.name, "durationMinutes": t.durationMinutes]
                if let id = t.id { m["id"] = id }
                if let l = t.location { m["location"] = l }
                if let d = t.description { m["description"] = d }
                return m
            },
            "availability": config.availability.map { ["day": $0.day, "start": $0.start, "end": $0.end] }
        ]
        if let email = config.contactEmail { body["contactEmail"] = email }
        if let src = config.sourceCalendarId { body["sourceCalendarId"] = src }
        return try await send("/booking", method: "PUT", body: body, bearer: session.deviceToken)
    }

    /// The current booking config, or nil if the owner has not set one up.
    static func getBooking(session: Session) async throws -> SavedBooking? {
        do {
            let saved: SavedBooking = try await send("/booking", method: "GET", body: nil, bearer: session.deviceToken)
            return saved
        } catch Failure.http(let code, _) where code == 404 {
            return nil
        }
    }

    /// Push the busy blocks read from the owner's chosen calendar, so the public
    /// page never offers a time they are already committed in.
    static func setBusy(
        blocks: [(start: Date, end: Date)],
        sourceCalendarId: String?,
        session: Session
    ) async throws {
        let iso = ISO8601DateFormatter()
        var body: [String: Any] = [
            "blocks": blocks.map { ["start": iso.string(from: $0.start), "end": iso.string(from: $0.end)] }
        ]
        if let src = sourceCalendarId { body["sourceCalendarId"] = src }
        try await sendIgnoringResponse("/booking/busy", method: "PUT", body: body, bearer: session.deviceToken)
    }

    /// The confirmed bookings on this calendar, for mirroring into the owner's
    /// real calendar. `since` narrows it to what changed.
    static func listBookingEvents(since: Date? = nil, session: Session) async throws -> [BookingEvent] {
        var path = "/booking/events"
        if let since {
            path += "?since=\(ISO8601DateFormatter().string(from: since))"
        }
        struct Wrap: Decodable { let events: [BookingEvent] }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let data = try await sendIgnoringResponse(path, method: "GET", body: nil, bearer: session.deviceToken)
        return (try decoder.decode(Wrap.self, from: data)).events
    }

    // MARK: - Transport

    /// Decoding wrapper. Split from `sendIgnoringResponse` so that calls with
    /// no body to read do not have to invent a type to decode into.
    private static func send<T: Decodable>(
        _ path: String,
        method: String = "POST",
        body: [String: Any]?,
        bearer: String?
    ) async throws -> T {
        let data = try await sendIgnoringResponse(path, method: method, body: body, bearer: bearer)
        return try JSONDecoder().decode(T.self, from: data)
    }

    @discardableResult
    private static func sendIgnoringResponse(
        _ path: String,
        method: String = "POST",
        body: [String: Any]?,
        bearer: String?
    ) async throws -> Data {
        var request = URLRequest(url: baseURL.appendingPathComponent(path))
        request.httpMethod = method
        request.timeoutInterval = 20

        if let body {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        }
        if let bearer {
            request.setValue("Bearer \(bearer)", forHTTPHeaderField: "Authorization")
        }

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else { throw Failure.malformedResponse }
        guard (200..<300).contains(http.statusCode) else {
            throw Failure.http(http.statusCode, String(data: data, encoding: .utf8) ?? "")
        }

        return data
    }
}

/// The event as the service stores it. Deliberately narrower than `EKEvent`:
/// notes, attendees and calendar identifiers are never uploaded, because a
/// shared event should carry only what the recipient needs to see.
struct SharedEventUpload {
    let id: String
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let location: String?
    let organizerName: String?
    let organizerEmail: String?

    var payload: [String: Any] {
        var body: [String: Any] = [
            "title": title,
            "start": ISO8601DateFormatter().string(from: start),
            "end": ISO8601DateFormatter().string(from: end),
            "allDay": isAllDay
        ]
        if let location { body["location"] = location }
        if let organizerName { body["organizerName"] = organizerName }
        if let organizerEmail { body["organizerEmail"] = organizerEmail }
        return body
    }
}
