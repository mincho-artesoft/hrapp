import CoreLocation
import Combine
import EventKit
import Foundation
import UserNotifications

struct SharedEventAlarm: Codable, Equatable {
    let relativeOffset: TimeInterval?
    let absoluteDate: String?

    init(relativeOffset: TimeInterval?, absoluteDate: String? = nil) {
        self.relativeOffset = relativeOffset
        self.absoluteDate = absoluteDate
    }

    init(alarm: EKAlarm) {
        if let absoluteDate = alarm.absoluteDate {
            self.absoluteDate = ISO8601DateFormatter().string(from: absoluteDate)
            self.relativeOffset = nil
        } else {
            self.absoluteDate = nil
            self.relativeOffset = alarm.relativeOffset
        }
    }

    func makeAlarm() -> EKAlarm? {
        if let absoluteDate,
           let date = ISO8601DateFormatter().date(from: absoluteDate) {
            return EKAlarm(absoluteDate: date)
        }
        if let relativeOffset { return EKAlarm(relativeOffset: relativeOffset) }
        return nil
    }
}

struct SharedEventLocation: Codable, Equatable {
    let title: String
    let latitude: Double?
    let longitude: Double?
    let radius: Double

    init(
        title: String,
        latitude: Double?,
        longitude: Double?,
        radius: Double
    ) {
        self.title = title
        self.latitude = latitude
        self.longitude = longitude
        self.radius = radius
    }

    init(location: EKStructuredLocation) {
        title = location.title ?? ""
        latitude = location.geoLocation?.coordinate.latitude
        longitude = location.geoLocation?.coordinate.longitude
        radius = location.radius
    }

    func makeLocation(title titleOverride: String? = nil) -> EKStructuredLocation {
        let displayTitle = titleOverride?
            .trimmingCharacters(in: .whitespacesAndNewlines)
        let location = EKStructuredLocation(
            title: displayTitle.flatMap { $0.isEmpty ? nil : $0 } ?? title
        )
        if let latitude, let longitude {
            location.geoLocation = CLLocation(latitude: latitude, longitude: longitude)
        }
        location.radius = radius
        return location
    }
}

struct SharedEventRecurrenceDay: Codable, Equatable {
    let weekday: Int
    let weekNumber: Int
}

struct SharedEventRecurrenceRule: Codable, Equatable {
    let frequency: Int
    let interval: Int
    let daysOfTheWeek: [SharedEventRecurrenceDay]?
    let daysOfTheMonth: [Int]?
    let monthsOfTheYear: [Int]?
    let weeksOfTheYear: [Int]?
    let daysOfTheYear: [Int]?
    let setPositions: [Int]?
    let endDate: String?
    let occurrenceCount: Int?

    init(rule: EKRecurrenceRule) {
        frequency = rule.frequency.rawValue
        interval = rule.interval
        daysOfTheWeek = rule.daysOfTheWeek?.map {
            .init(weekday: $0.dayOfTheWeek.rawValue, weekNumber: $0.weekNumber)
        }
        daysOfTheMonth = rule.daysOfTheMonth?.map(\.intValue)
        monthsOfTheYear = rule.monthsOfTheYear?.map(\.intValue)
        weeksOfTheYear = rule.weeksOfTheYear?.map(\.intValue)
        daysOfTheYear = rule.daysOfTheYear?.map(\.intValue)
        setPositions = rule.setPositions?.map(\.intValue)
        endDate = rule.recurrenceEnd?.endDate.map { ISO8601DateFormatter().string(from: $0) }
        let count = rule.recurrenceEnd?.occurrenceCount ?? 0
        occurrenceCount = count > 0 ? count : nil
    }

    func makeRule() -> EKRecurrenceRule? {
        guard let frequency = EKRecurrenceFrequency(rawValue: frequency), interval > 0 else {
            return nil
        }
        let recurrenceDays = daysOfTheWeek?.compactMap { value -> EKRecurrenceDayOfWeek? in
            guard let weekday = EKWeekday(rawValue: value.weekday) else { return nil }
            return EKRecurrenceDayOfWeek(dayOfTheWeek: weekday, weekNumber: value.weekNumber)
        }
        let recurrenceEnd: EKRecurrenceEnd?
        if let endDate, let date = ISO8601DateFormatter().date(from: endDate) {
            recurrenceEnd = EKRecurrenceEnd(end: date)
        } else if let occurrenceCount, occurrenceCount > 0 {
            recurrenceEnd = EKRecurrenceEnd(occurrenceCount: occurrenceCount)
        } else {
            recurrenceEnd = nil
        }
        return EKRecurrenceRule(
            recurrenceWith: frequency,
            interval: interval,
            daysOfTheWeek: recurrenceDays,
            daysOfTheMonth: daysOfTheMonth?.map(NSNumber.init(value:)),
            monthsOfTheYear: monthsOfTheYear?.map(NSNumber.init(value:)),
            weeksOfTheYear: weeksOfTheYear?.map(NSNumber.init(value:)),
            daysOfTheYear: daysOfTheYear?.map(NSNumber.init(value:)),
            setPositions: setPositions?.map(NSNumber.init(value:)),
            end: recurrenceEnd
        )
    }
}

struct SharedEventParticipant: Codable, Equatable {
    let name: String?
    let email: String?
    let role: Int
    let type: Int
    let status: Int
    let isCurrentUser: Bool

    init(participant: EKParticipant) {
        name = participant.name
        email = participant.url.absoluteString
            .replacingOccurrences(of: "mailto:", with: "", options: [.anchored, .caseInsensitive])
            .removingPercentEncoding
        role = participant.participantRole.rawValue
        type = participant.participantType.rawValue
        status = participant.participantStatus.rawValue
        isCurrentUser = participant.isCurrentUser
    }
}

struct SharedEventAttachment: Codable, Equatable, Identifiable {
    let id: String
    let fileName: String
    let contentType: String?
    let dataBase64: String
}

struct SharedEventDetails: Codable, Equatable {
    static func == (lhs: Self, rhs: Self) -> Bool {
        // Older local snapshots omit attachments; the API normalizes them to
        // []. That wire-format difference is not an edit and must not trigger
        // a stale owner upload over a Writer's canonical revision.
        lhs.notes == rhs.notes && lhs.timeZone == rhs.timeZone
            && lhs.availability == rhs.availability && lhs.alarms == rhs.alarms
            && lhs.recurrenceRules == rhs.recurrenceRules
            && lhs.structuredLocation == rhs.structuredLocation
            && lhs.videoCallURL == rhs.videoCallURL && lhs.organizer == rhs.organizer
            && lhs.attendees == rhs.attendees && lhs.travelTime == rhs.travelTime
            && (lhs.attachments ?? []) == (rhs.attachments ?? [])
    }
    let notes: String?
    let timeZone: String?
    let availability: Int
    let alarms: [SharedEventAlarm]
    let recurrenceRules: [SharedEventRecurrenceRule]
    let structuredLocation: SharedEventLocation?
    let videoCallURL: String?
    let organizer: SharedEventParticipant?
    let attendees: [SharedEventParticipant]
    /// EventKit does not expose these two fields through its public API. They
    /// are nevertheless part of the portable model used by app-owned
    /// calendars, where Cloud Calendars can preserve them losslessly.
    let travelTime: TimeInterval?
    let attachments: [SharedEventAttachment]?
    private var hasCompleteExtensionFields = false

    private enum CodingKeys: String, CodingKey {
        case notes, timeZone, availability, alarms, recurrenceRules, structuredLocation
        case videoCallURL, organizer, attendees, travelTime, attachments
    }

    init(
        notes: String?,
        timeZone: String?,
        availability: Int = 0,
        alarms: [SharedEventAlarm] = [],
        recurrenceRules: [SharedEventRecurrenceRule] = [],
        structuredLocation: SharedEventLocation? = nil,
        videoCallURL: String? = nil,
        organizer: SharedEventParticipant? = nil,
        attendees: [SharedEventParticipant] = [],
        travelTime: TimeInterval? = nil,
        attachments: [SharedEventAttachment]? = nil
    ) {
        self.notes = notes
        self.timeZone = timeZone
        self.availability = availability
        self.alarms = alarms
        self.recurrenceRules = recurrenceRules
        self.structuredLocation = structuredLocation
        self.videoCallURL = videoCallURL
        self.organizer = organizer
        self.attendees = attendees
        self.travelTime = travelTime
        self.attachments = attachments
        hasCompleteExtensionFields = true
    }

    init(event: EKEvent) {
        notes = event.notes
        timeZone = event.timeZone?.identifier
        availability = event.availability.rawValue
        alarms = (event.alarms ?? []).map(SharedEventAlarm.init(alarm:))
        recurrenceRules = (event.recurrenceRules ?? []).map(SharedEventRecurrenceRule.init(rule:))
        structuredLocation = event.structuredLocation.map(SharedEventLocation.init(location:))
        videoCallURL = nil
        organizer = event.organizer.map(SharedEventParticipant.init(participant:))
        attendees = (event.attendees ?? []).map(SharedEventParticipant.init(participant:))
        travelTime = nil
        attachments = nil
    }

    func applyWritableFields(
        to event: EKEvent,
        canonicalLocation: String? = nil
    ) {
        event.notes = notes
        event.timeZone = timeZone.flatMap(TimeZone.init(identifier:))
        if let availability = EKEventAvailability(rawValue: availability),
           availability != .notSupported {
            event.availability = availability
        }
        for alarm in event.alarms ?? [] { event.removeAlarm(alarm) }
        for alarm in alarms.compactMap({ $0.makeAlarm() }) { event.addAlarm(alarm) }
        for rule in event.recurrenceRules ?? [] { event.removeRecurrenceRule(rule) }
        for rule in recurrenceRules.compactMap({ $0.makeRule() }) { event.addRecurrenceRule(rule) }
        if let structuredLocation {
            // Assigning `event.location` after `structuredLocation` makes
            // EventKit discard the coordinates. Use the complete canonical
            // display string as the structured title instead, preserving both
            // the two-line title/address presentation and the geo metadata.
            event.structuredLocation = structuredLocation.makeLocation(
                title: canonicalLocation
            )
        } else {
            event.structuredLocation = nil
            let displayLocation = canonicalLocation?
                .trimmingCharacters(in: .whitespacesAndNewlines)
            event.location = displayLocation.flatMap { $0.isEmpty ? nil : $0 }
        }
    }

    /// EventKit exposes organizer and attendees as read-only. Compare only the
    /// fields that this app can restore on the recipient's local event so an
    /// unchanged feed does not cause a save on every foreground refresh.
    func matchesWritableFields(
        of event: EKEvent,
        canonicalLocation: String? = nil
    ) -> Bool {
        let current = SharedEventDetails(event: event)
        let availabilityMatches = availability == EKEventAvailability.notSupported.rawValue
            || availability == current.availability
        let displayLocation = canonicalLocation?
            .trimmingCharacters(in: .whitespacesAndNewlines)
        let expectedStructuredLocation = structuredLocation.map {
            SharedEventLocation(
                title: displayLocation.flatMap { $0.isEmpty ? nil : $0 } ?? $0.title,
                latitude: $0.latitude,
                longitude: $0.longitude,
                radius: $0.radius
            )
        }
        return notes == current.notes
            && timeZone == current.timeZone
            && availabilityMatches
            && alarms == current.alarms
            && recurrenceRules == current.recurrenceRules
            && expectedStructuredLocation == current.structuredLocation
    }

    var payload: [String: Any]? {
        guard let data = try? JSONEncoder().encode(self),
              let object = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
        else { return nil }
        return SharedEventWireCompatibility.detailsPayload(
            object, explicitExtensionClears: hasCompleteExtensionFields
        )
    }
}

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
    #if DEBUG
    static let baseURL = URL(
        string: "https://63yo3ore3c.execute-api.us-east-1.amazonaws.com"
    )!
    #else
    static let baseURL = URL(string: "https://api.cloud-calendars.com")!
    #endif

    struct AccountIdentity: Codable, Equatable, Identifiable {
        let provider: String
        let email: String?

        var id: String { provider }
    }

    enum EventAccess: String, Codable, CaseIterable, Identifiable {
        case reader
        case writer
        case owner

        var id: String { rawValue }
        static let calendarSharingCases: [Self] = [.reader, .writer, .owner]

        var title: String {
            switch self {
            case .reader: String(localized: "Reader")
            case .writer: String(localized: "Writer")
            case .owner: String(localized: "Owner")
            }
        }
    }

    struct EventRecipient: Codable, Equatable, Identifiable {
        let id: String
        let userId: String?
        let isAnonymous: Bool
        let emails: [String]
        let identities: [AccountIdentity]
        var access: EventAccess
        let isOriginalOwner: Bool?
        let acceptedAt: String?
        let invitedAt: String?
        let updatedAt: String?

        var displayEmail: String {
            if isAnonymous { return String(localized: "Anonymous recipient") }
            return emails.first
                ?? identities.compactMap(\.email).first
                ?? String(localized: "Cloud Calendars user")
        }

        var isPendingInvitation: Bool {
            !isAnonymous && userId == nil
        }

        var belongsToOriginalOwner: Bool { isOriginalOwner == true }
    }

    struct EventInvitation: Equatable, Identifiable {
        let email: String
        let access: EventAccess

        var id: String { email.lowercased() }
    }

    struct ICloudCalendarRecipient: Codable, Equatable, Identifiable {
        let id: String
        let userId: String?
        let email: String
        var access: EventAccess
        let isPending: Bool?
        let invitedAt: String?
        let acceptedAt: String?
        let updatedAt: String?

        var isPendingInvitation: Bool {
            isPending == true || (userId == nil && acceptedAt == nil)
        }
    }

    struct ICloudCalendarSharing: Codable, Equatable, Identifiable {
        let id: String
        let ownerId: String?
        let ownerEmail: String?
        let currentAccess: EventAccess?
        let isOriginalOwner: Bool?
        let title: String
        let color: String
        let timeZone: String
        let calendarKind: String?
        let recipients: [ICloudCalendarRecipient]
        let updatedAt: String?
        let events: [SharedICloudCalendarEvent]?
        let eventsUpdatedAt: String?
        let windowStart: String?
        let windowEnd: String?
    }

    struct SharedICloudCalendarEvent: Codable, Equatable, Identifiable {
        let id: String
        let title: String
        let start: String
        let end: String
        let allDay: Bool
        let location: String?
        let url: String?
        let details: SharedEventDetails?

        var startDate: Date? { Self.date(start) }
        var endDate: Date? { Self.date(end) }

        private static func date(_ value: String) -> Date? {
            let fractional = ISO8601DateFormatter()
            fractional.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            return fractional.date(from: value) ?? ISO8601DateFormatter().date(from: value)
        }
    }

    struct SharedICloudCalendar: Decodable, Equatable, Identifiable {
        let id: String
        let ownerId: String
        let ownerEmail: String?
        let calendarId: String
        let title: String
        let color: String
        let timeZone: String
        let calendarKind: String?
        let access: EventAccess
        let invitedAt: String?
        let updatedAt: String?
        let events: [SharedICloudCalendarEvent]?
        let eventsUpdatedAt: String?
        let windowStart: String?
        let windowEnd: String?
        let revokedAt: String?
        let revokedReason: String?

        var isRevoked: Bool { revokedAt != nil }
        var wasDeletedByOwner: Bool { revokedReason == "owner_deleted" }

        var windowStartDate: Date? { Self.date(windowStart) }
        var windowEndDate: Date? { Self.date(windowEnd) }

        private static func date(_ value: String?) -> Date? {
            guard let value else { return nil }
            let fractional = ISO8601DateFormatter()
            fractional.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            return fractional.date(from: value) ?? ISO8601DateFormatter().date(from: value)
        }
    }

    struct PendingEventInvitation: Decodable, Equatable, Identifiable {
        let id: String
        let eventId: String
        let feedId: String
        let title: String
        let start: String
        let end: String
        let allDay: Bool
        let location: String?
        let access: EventAccess
        let invitedAt: String?
        let senderName: String
        let senderEmail: String?
        let eventUrl: String
        let color: String

        var startDate: Date? { Self.date(start) }
        var endDate: Date? { Self.date(end) }
        var sourceURL: URL? { URL(string: eventUrl) }
        var importPayload: SharedEventImportPayload? {
            sourceURL.flatMap(SharedEventImportPayload.init(url:))
        }

        private static func date(_ value: String) -> Date? {
            let fractional = ISO8601DateFormatter()
            fractional.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            return fractional.date(from: value) ?? ISO8601DateFormatter().date(from: value)
        }
    }

    struct PendingICloudCalendarInvitation: Decodable, Equatable, Identifiable {
        let id: String
        let ownerId: String
        let ownerEmail: String?
        let calendarId: String
        let title: String
        let color: String
        let timeZone: String
        let calendarKind: String?
        let access: EventAccess
        let invitedAt: String?
        let senderEmail: String?

        var invitationURL: URL? {
            guard var components = URLComponents(
                url: CloudCalendarsAPI.baseURL,
                resolvingAgainstBaseURL: false
            ) else { return nil }
            components.path = "/icloud-calendar-invites/open"
            components.queryItems = [
                URLQueryItem(name: "o", value: ownerId),
                URLQueryItem(name: "c", value: calendarId),
                URLQueryItem(name: "title", value: title),
                URLQueryItem(name: "color", value: color)
            ]
            return components.url
        }

        var importPayload: SharedCalendarInvitationPayload? {
            invitationURL.flatMap(SharedCalendarInvitationPayload.init(url:))
        }
    }

    private struct PendingEventInvitationsResponse: Decodable {
        let invitations: [PendingEventInvitation]
    }

    private struct PendingICloudCalendarInvitationsResponse: Decodable {
        let invitations: [PendingICloudCalendarInvitation]
    }

    private struct EventRecipientsResponse: Decodable {
        let recipients: [EventRecipient]
    }

    private struct EventRecipientResponse: Decodable {
        let recipient: EventRecipient
    }

    private struct EventInvitationsResponse: Decodable {
        let recipients: [EventRecipient]
        let invitedCount: Int
    }

    private struct ICloudCalendarSharingResponse: Decodable {
        let calendar: ICloudCalendarSharing
    }

    private struct ICloudCalendarEventsSaveResponse: Decodable {
        let updatedAt: String?
    }

    private struct SharedICloudCalendarsResponse: Decodable {
        let calendars: [SharedICloudCalendar]
    }

    private struct AcceptedICloudCalendarResponse: Decodable {
        let calendar: SharedICloudCalendar
    }

    struct ReceivedInviteAccess: Decodable, Equatable {
        let access: EventAccess
    }

    struct Session: Codable, Equatable {
        let calendarId: String
        let deviceToken: String
        let feedId: String
        let feedUrl: String
        var email: String?
        var provider: String?
        var ownerId: String?
        var identities: [AccountIdentity]?
    }

    struct RemoteSharedEvent: Decodable, Equatable, Identifiable {
        let id: String
        let title: String
        let start: String
        let end: String
        let allDay: Bool
        let location: String?
        let url: String?
        let details: SharedEventDetails?
        let status: String?
        let sequence: Int?
        let feedId: String
        let localEventIdentifier: String?
        let access: EventAccess?

        var startDate: Date? { Self.date(start) }
        var endDate: Date? { Self.date(end) }
        var isCancelled: Bool { status == "cancelled" }

        private static func date(_ value: String) -> Date? {
            let fractional = ISO8601DateFormatter()
            fractional.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            return fractional.date(from: value) ?? ISO8601DateFormatter().date(from: value)
        }
    }

    struct SharedState: Decodable, Equatable {
        let ownerId: String
        let identities: [AccountIdentity]?
        let outgoing: [RemoteSharedEvent]
        let received: [RemoteSharedEvent]
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
            case .http(let code, let body):
                return String.localizedStringWithFormat(
                    String(localized: "Server returned %lld: %@"),
                    Int64(code),
                    body
                )
            case .malformedResponse:
                return String(localized: "Unreadable response from the server")
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

    static func unlinkIdentity(provider: String, session: Session) async throws -> Session {
        try await send(
            "/identities/\(provider)",
            method: "DELETE",
            body: nil,
            bearer: session.deviceToken
        )
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
        session: Session,
        receivedFeedId: String? = nil
    ) async throws {
        var body = event.payload
        if let receivedFeedId { body["feedId"] = receivedFeedId }
        try await sendIgnoringResponse(
            "/events/\(event.id)",
            method: "PUT",
            body: body,
            bearer: session.deviceToken
        )
    }

    static func eventRecipients(
        eventId: String,
        session: Session
    ) async throws -> [EventRecipient] {
        let response: EventRecipientsResponse = try await send(
            "/events/\(eventId)/recipients",
            method: "GET",
            body: nil,
            bearer: session.deviceToken
        )
        return response.recipients
    }

    @discardableResult
    static func inviteEventRecipients(
        eventId: String,
        eventURL: URL,
        invitations: [EventInvitation],
        session: Session
    ) async throws -> [EventRecipient] {
        let invitationPayload: [[String: Any]] = invitations.map {
            ["email": $0.email, "access": $0.access.rawValue]
        }
        let response: EventInvitationsResponse = try await send(
            "/events/\(eventId)/invitations",
            body: [
                "eventUrl": eventURL.absoluteString,
                "invitations": invitationPayload
            ],
            bearer: session.deviceToken
        )
        return response.recipients
    }

    static func pendingEventInvitations(
        session: Session
    ) async throws -> [PendingEventInvitation] {
        let response: PendingEventInvitationsResponse = try await send(
            "/event-invitations/pending",
            method: "GET",
            body: nil,
            bearer: session.deviceToken
        )
        return response.invitations
    }

    static func pendingICloudCalendarInvitations(
        session: Session
    ) async throws -> [PendingICloudCalendarInvitation] {
        let response: PendingICloudCalendarInvitationsResponse = try await send(
            "/icloud-calendar-invitations/pending",
            method: "GET",
            body: nil,
            bearer: session.deviceToken
        )
        return response.invitations
    }

    static func declinePendingICloudCalendarInvitation(
        ownerId: String,
        calendarId: String,
        session: Session
    ) async throws {
        try await sendIgnoringResponse(
            "/icloud-calendar-invitations/pending/\(calendarId)/decline",
            body: ["ownerId": ownerId],
            bearer: session.deviceToken
        )
    }

    static func declinePendingEventInvitation(
        eventId: String,
        feedId: String,
        session: Session
    ) async throws {
        try await sendIgnoringResponse(
            "/event-invitations/pending/\(eventId)/decline",
            body: ["feedId": feedId],
            bearer: session.deviceToken
        )
    }

    static func updateEventRecipientAccess(
        eventId: String,
        recipientId: String,
        access: EventAccess,
        session: Session
    ) async throws -> EventRecipient {
        let response: EventRecipientResponse = try await send(
            "/events/\(eventId)/recipients/\(recipientId)",
            method: "PUT",
            body: ["access": access.rawValue],
            bearer: session.deviceToken
        )
        return response.recipient
    }

    static func saveEventRecipientChanges(
        eventId: String,
        accessByRecipientID: [String: EventAccess],
        removedRecipientIDs: Set<String>,
        session: Session
    ) async throws -> [EventRecipient] {
        let updates: [[String: Any]] = accessByRecipientID.map {
            ["id": $0.key, "access": $0.value.rawValue]
        }
        let response: EventRecipientsResponse = try await send(
            "/events/\(eventId)/recipients",
            method: "PUT",
            body: [
                "updates": updates,
                "removedIds": Array(removedRecipientIDs)
            ],
            bearer: session.deviceToken
        )
        return response.recipients
    }

    // MARK: - iCloud calendar sharing

    static func iCloudCalendarSharing(
        calendarId: String,
        ownerId: String? = nil,
        session: Session
    ) async throws -> ICloudCalendarSharing {
        var path = "/icloud-calendars/\(calendarId)/sharing"
        if let ownerId, !ownerId.isEmpty {
            path += "?ownerId=\(ownerId.urlQueryEncoded)"
        }
        let response: ICloudCalendarSharingResponse = try await send(
            path,
            method: "GET",
            body: nil,
            bearer: session.deviceToken
        )
        return response.calendar
    }

    static func iCloudCalendarsSharedWithMe(
        session: Session
    ) async throws -> [SharedICloudCalendar] {
        let response: SharedICloudCalendarsResponse = try await send(
            "/icloud-calendars-shared-with-me",
            method: "GET",
            body: nil,
            bearer: session.deviceToken
        )
        return response.calendars
    }

    static func acceptICloudCalendarInvitation(
        ownerId: String,
        calendarId: String,
        session: Session
    ) async throws -> SharedICloudCalendar {
        let response: AcceptedICloudCalendarResponse = try await send(
            "/icloud-calendar-invites/accept",
            body: [
                "ownerId": ownerId,
                "calendarId": calendarId
            ],
            bearer: session.deviceToken
        )
        return response.calendar
    }

    static func leaveICloudCalendar(
        ownerId: String,
        calendarId: String,
        session: Session
    ) async throws {
        try await sendIgnoringResponse(
            "/icloud-calendars/\(calendarId)/access?ownerId=\(ownerId.urlQueryEncoded)",
            method: "DELETE",
            body: nil,
            bearer: session.deviceToken
        )
    }

    static func saveICloudCalendarSharing(
        calendarId: String,
        ownerId: String? = nil,
        title: String,
        color: String,
        timeZone: String,
        calendarKind: String = "eventkit",
        recipients: [(email: String, access: EventAccess)],
        removedRecipientEmails: Set<String> = [],
        expectedUpdatedAt: String? = nil,
        session: Session
    ) async throws -> ICloudCalendarSharing {
        var body: [String: Any] = [
            "title": title,
            "color": color,
            "timeZone": timeZone,
            "calendarKind": calendarKind,
            "recipients": recipients.map {
                ["email": $0.email, "access": $0.access.rawValue]
            },
            // Calendar recipients may accept a QR/App Clip while the owner's
            // sharing sheet is still open. Preserve recipients absent from
            // that stale UI snapshot; only this explicit list revokes access.
            "preserveUnmentionedRecipients": true,
            "removedRecipientEmails": Array(removedRecipientEmails)
        ]
        if let ownerId, !ownerId.isEmpty { body["ownerId"] = ownerId }
        if let expectedUpdatedAt, !expectedUpdatedAt.isEmpty {
            body["expectedUpdatedAt"] = expectedUpdatedAt
        }
        let response: ICloudCalendarSharingResponse = try await send(
            "/icloud-calendars/\(calendarId)/sharing",
            method: "PUT",
            body: body,
            bearer: session.deviceToken
        )
        return response.calendar
    }

    @discardableResult
    static func inviteICloudCalendarRecipients(
        calendarId: String,
        ownerId: String? = nil,
        emails: [String],
        session: Session
    ) async throws -> ICloudCalendarSharing {
        var body: [String: Any] = ["emails": emails]
        if let ownerId, !ownerId.isEmpty { body["ownerId"] = ownerId }
        let response: ICloudCalendarSharingResponse = try await send(
            "/icloud-calendars/\(calendarId)/invitations",
            body: body,
            bearer: session.deviceToken
        )
        return response.calendar
    }

    static func deleteICloudCalendarSharing(
        calendarId: String,
        session: Session
    ) async throws {
        try await sendIgnoringResponse(
            "/icloud-calendars/\(calendarId)/sharing",
            method: "DELETE",
            body: nil,
            bearer: session.deviceToken
        )
    }

    static func saveICloudCalendarEvents(
        calendarId: String,
        ownerId: String? = nil,
        events: [SharedICloudCalendarEvent],
        windowStart: Date,
        windowEnd: Date,
        expectedUpdatedAt: String? = nil,
        session: Session
    ) async throws -> String? {
        let encoder = JSONEncoder()
        let eventObjects: [[String: Any]] = try events.map { event in
            let data = try encoder.encode(event)
            guard var object = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                throw Failure.malformedResponse
            }
            // Use the same explicit-clear semantics as single-event uploads.
            object["details"] = event.details?.payload ?? NSNull()
            return object
        }
        var body: [String: Any] = [
            "windowStart": ISO8601DateFormatter().string(from: windowStart),
            "windowEnd": ISO8601DateFormatter().string(from: windowEnd),
            "events": eventObjects
        ]
        if let ownerId, !ownerId.isEmpty { body["ownerId"] = ownerId }
        if let expectedUpdatedAt, !expectedUpdatedAt.isEmpty {
            body["expectedUpdatedAt"] = expectedUpdatedAt
        }
        let response: ICloudCalendarEventsSaveResponse = try await send(
            "/icloud-calendars/\(calendarId)/events",
            method: "PUT",
            body: body,
            bearer: session.deviceToken
        )
        return response.updatedAt
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

    static func sharedState(session: Session) async throws -> SharedState {
        try await send("/shared-state", method: "GET", body: nil, bearer: session.deviceToken)
    }

    static func rememberReceivedInvite(
        eventId: String,
        feedId: String,
        localEventIdentifier: String? = nil,
        anonymousRecipientId: String? = nil,
        session: Session
    ) async throws {
        var body: [String: Any] = ["eventId": eventId, "feedId": feedId]
        if let localEventIdentifier { body["localEventIdentifier"] = localEventIdentifier }
        if let anonymousRecipientId { body["anonymousRecipientId"] = anonymousRecipientId }
        try await sendIgnoringResponse(
            "/received-invites",
            body: body,
            bearer: session.deviceToken
        )
    }

    static func rememberAnonymousReceivedInvite(
        eventId: String,
        feedId: String,
        anonymousRecipientId: String
    ) async throws {
        try await sendIgnoringResponse(
            "/received-invites/anonymous",
            body: [
                "eventId": eventId,
                "feedId": feedId,
                "anonymousRecipientId": anonymousRecipientId
            ],
            bearer: nil
        )
    }

    static func forgetAnonymousReceivedInvite(
        eventId: String,
        feedId: String,
        anonymousRecipientId: String
    ) async throws {
        try await sendIgnoringResponse(
            "/received-invites/anonymous/forget",
            body: [
                "eventId": eventId,
                "feedId": feedId,
                "anonymousRecipientId": anonymousRecipientId
            ],
            bearer: nil
        )
    }

    static func anonymousReceivedInviteAccess(
        eventId: String,
        feedId: String,
        anonymousRecipientId: String
    ) async throws -> EventAccess {
        let response: ReceivedInviteAccess = try await send(
            "/received-invites/anonymous/access",
            body: [
                "eventId": eventId,
                "feedId": feedId,
                "anonymousRecipientId": anonymousRecipientId
            ],
            bearer: nil
        )
        return response.access
    }

    static func forgetReceivedInvite(eventId: String, session: Session) async throws {
        try await sendIgnoringResponse(
            "/received-invites/\(eventId)",
            method: "DELETE",
            body: nil,
            bearer: session.deviceToken
        )
    }

    static func receivedInviteAccess(
        eventId: String,
        session: Session
    ) async throws -> EventAccess {
        let response: ReceivedInviteAccess = try await send(
            "/received-invites/\(eventId)/access",
            method: "GET",
            body: nil,
            bearer: session.deviceToken
        )
        return response.access
    }


    static func registerInvitationPush(
        installationId: String, secret: String, revision: Int, token: String,
        environment: String, enabled: Bool, session: Session
    ) async throws -> Bool {
        struct Registration: Decodable { let remoteInvitations: Bool }
        let response: Registration = try await send(
            "/me/push-devices/\(installationId)", method: "PUT",
            body: ["secret": secret, "revision": revision, "token": token,
                   "environment": environment, "enabled": enabled], bearer: session.deviceToken
        )
        return response.remoteInvitations
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
        var url = requestURL(for: path)
        if method == "GET",
           var components = URLComponents(url: url, resolvingAgainstBaseURL: false) {
            var items = components.queryItems ?? []
            items.append(URLQueryItem(name: "_refresh", value: UUID().uuidString))
            components.queryItems = items
            url = components.url ?? url
        }
        var request = URLRequest(
            url: url,
            cachePolicy: method == "GET" ? .reloadIgnoringLocalCacheData : .useProtocolCachePolicy
        )
        request.httpMethod = method
        request.timeoutInterval = 20

        if method == "GET" {
            request.setValue("no-cache, no-store", forHTTPHeaderField: "Cache-Control")
            request.setValue("no-cache", forHTTPHeaderField: "Pragma")
        }

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

    private static func requestURL(for path: String) -> URL {
        let parts = path.split(separator: "?", maxSplits: 1, omittingEmptySubsequences: false)
        let url = baseURL.appendingPathComponent(String(parts[0]))
        guard parts.count == 2,
              var components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return url
        }
        components.percentEncodedQuery = String(parts[1])
        return components.url ?? url
    }
}

private extension String {
    var urlQueryEncoded: String {
        addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? self
    }
}

@MainActor
final class PendingEventInvitationManager: ObservableObject {
    static let shared = PendingEventInvitationManager()

    @Published private(set) var invitations: [CloudCalendarsAPI.PendingEventInvitation] = []
    @Published private(set) var calendarInvitations: [CloudCalendarsAPI.PendingICloudCalendarInvitation] = []
    @Published private(set) var isLoading = false
    @Published private(set) var errorMessage: String?
    @Published private(set) var invitationNotificationsEnabled: Bool

    var totalInvitationCount: Int { invitations.count + calendarInvitations.count }

    private let defaults = UserDefaults(suiteName: "group.ARTE-SOFT.sandBOX") ?? .standard
    private static let invitationNotificationsEnabledKey =
        "InvitationNotificationsEnabled"
    private let seenInvitationIDsKey = "pendingEventInvitations.seenIDs.v1"
    private let seenCalendarInvitationIDsKey = "pendingCalendarInvitations.seenIDs.v1"
    private var pendingNotificationRefresh = false
    private var foregroundPollingTask: Task<Void, Never>?

    private init() {
        let defaults = UserDefaults(suiteName: "group.ARTE-SOFT.sandBOX") ?? .standard
        if defaults.object(forKey: Self.invitationNotificationsEnabledKey) == nil {
            invitationNotificationsEnabled = true
        } else {
            invitationNotificationsEnabled = defaults.bool(
                forKey: Self.invitationNotificationsEnabledKey
            )
        }
    }

    func setInvitationNotificationsEnabled(_ enabled: Bool) {
        invitationNotificationsEnabled = enabled
        defaults.set(enabled, forKey: Self.invitationNotificationsEnabledKey)
        InvitationPushRegistration.shared.requestSync()

        if !enabled {
            removeInvitationNotifications()
        }
    }

    func startForegroundPolling() {
        guard foregroundPollingTask == nil else { return }
        foregroundPollingTask = Task { [weak self] in
            while !Task.isCancelled {
                guard let self else { return }
                await self.refresh(notifyForNewInvitations: true)
                do {
                    try await Task.sleep(for: .seconds(20))
                } catch {
                    return
                }
            }
        }
    }

    func stopForegroundPolling() {
        foregroundPollingTask?.cancel()
        foregroundPollingTask = nil
    }

    func refresh(notifyForNewInvitations: Bool = false) async {
        guard !isLoading else {
            pendingNotificationRefresh = pendingNotificationRefresh
                || notifyForNewInvitations
            return
        }
        guard let session = CalendarFeedSession.existing else {
            invitations = []
            calendarInvitations = []
            errorMessage = nil
            return
        }

        isLoading = true
        defer {
            isLoading = false
            if pendingNotificationRefresh {
                pendingNotificationRefresh = false
                Task {
                    await self.refresh(notifyForNewInvitations: true)
                }
            }
        }
        do {
            async let loadedEvents = CloudCalendarsAPI.pendingEventInvitations(session: session)
            async let loadedCalendars = CloudCalendarsAPI.pendingICloudCalendarInvitations(
                session: session
            )
            let (eventValues, calendarValues) = try await (loadedEvents, loadedCalendars)
            let sorted = eventValues.sorted {
                ($0.startDate ?? .distantFuture) < ($1.startDate ?? .distantFuture)
            }
            let sortedCalendars = calendarValues.sorted {
                ($0.invitedAt ?? "") > ($1.invitedAt ?? "")
            }
            let seen = Set(defaults.stringArray(forKey: seenInvitationIDsKey) ?? [])
            let newInvitations = sorted.filter { !seen.contains($0.id) }
            let seenCalendars = Set(
                defaults.stringArray(forKey: seenCalendarInvitationIDsKey) ?? []
            )
            let newCalendarInvitations = sortedCalendars.filter {
                !seenCalendars.contains($0.id)
            }

            invitations = sorted
            calendarInvitations = sortedCalendars
            errorMessage = nil

            if notifyForNewInvitations {
                var updatedSeen = seen
                updatedSeen.formUnion(sorted.map(\.id))
                if updatedSeen.count > 500 {
                    updatedSeen = Set(Array(updatedSeen).suffix(500))
                }
                defaults.set(Array(updatedSeen), forKey: seenInvitationIDsKey)

                var updatedSeenCalendars = seenCalendars
                updatedSeenCalendars.formUnion(sortedCalendars.map(\.id))
                if updatedSeenCalendars.count > 500 {
                    updatedSeenCalendars = Set(Array(updatedSeenCalendars).suffix(500))
                }
                defaults.set(
                    Array(updatedSeenCalendars),
                    forKey: seenCalendarInvitationIDsKey
                )

                await InvitationPushRegistration.shared.synchronize()
                let useRemotePush = InvitationPushRegistration.shared.remoteInvitationsEnabled
                if !useRemotePush && !newInvitations.isEmpty {
                    await postNotifications(for: newInvitations)
                }
                if !useRemotePush && !newCalendarInvitations.isEmpty {
                    await postCalendarNotifications(for: newCalendarInvitations)
                }
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    /// Server push uses the same invitation IDs and navigation as local alerts.
    /// Polling still refreshes the list, but must not add a second banner.
    @discardableResult
    func receivedRemoteInvitation(eventID: String?, calendarID: String?) -> Bool {
        if let eventID {
            var seen = Set(defaults.stringArray(forKey: seenInvitationIDsKey) ?? [])
            seen.insert(eventID)
            defaults.set(Array(seen).suffix(500).map { $0 }, forKey: seenInvitationIDsKey)
        }
        if let calendarID {
            var seen = Set(defaults.stringArray(forKey: seenCalendarInvitationIDsKey) ?? [])
            seen.insert(calendarID)
            defaults.set(Array(seen).suffix(500).map { $0 }, forKey: seenCalendarInvitationIDsKey)
        }
        Task { await refresh() }
        return invitationNotificationsEnabled && CloudAccountManager.shared.isSignedIn
    }

    private func postNotifications(
        for invitations: [CloudCalendarsAPI.PendingEventInvitation]
    ) async {
        guard invitationNotificationsEnabled else { return }
        let center = UNUserNotificationCenter.current()
        guard await notificationsAreAuthorized(center) else { return }

        for invitation in invitations {
            let content = UNMutableNotificationContent()
            content.title = NSLocalizedString(
                "New event invitation",
                comment: "Pending shared-event invitation notification title"
            )
            content.body = localizedFormat(
                NSLocalizedString(
                    "%@ invited you to %@",
                    comment: "Pending shared-event invitation notification body"
                ),
                invitation.senderName,
                invitation.title
            )
            content.sound = .default
            content.userInfo = ["pendingEventInvitationID": invitation.id]
            let request = UNNotificationRequest(
                identifier: "shared.event.invitation.\(invitation.id)",
                content: content,
                trigger: nil
            )
            try? await center.add(request)
        }
    }

    #if DEBUG
    /// Simulator audit: exercise production notification builders without
    /// sending e-mails or changing pending invitations on the server.
    func testNotificationDelivery(
        events: [CloudCalendarsAPI.PendingEventInvitation],
        calendars: [CloudCalendarsAPI.PendingICloudCalendarInvitation]
    ) async {
        guard LocalSharingE2ETest.requested else { return }
        await postNotifications(for: events)
        await postCalendarNotifications(for: calendars)
    }
    #endif

    private func postCalendarNotifications(
        for invitations: [CloudCalendarsAPI.PendingICloudCalendarInvitation]
    ) async {
        guard invitationNotificationsEnabled else { return }
        let center = UNUserNotificationCenter.current()
        guard await notificationsAreAuthorized(center) else { return }

        for invitation in invitations {
            let content = UNMutableNotificationContent()
            content.title = NSLocalizedString(
                "New calendar invitation",
                comment: "Pending shared-calendar invitation notification title"
            )
            let sender = invitation.senderEmail ?? invitation.ownerEmail ?? "Cloud Calendars"
            content.body = localizedFormat(
                NSLocalizedString(
                    "%@ invited you to %@",
                    comment: "Pending shared-calendar invitation notification body"
                ),
                sender,
                invitation.title
            )
            content.sound = .default
            content.userInfo = ["pendingCalendarInvitationID": invitation.id]
            let request = UNNotificationRequest(
                identifier: "shared.calendar.invitation.\(invitation.id)",
                content: content,
                trigger: nil
            )
            try? await center.add(request)
        }
    }

    private func notificationsAreAuthorized(
        _ center: UNUserNotificationCenter
    ) async -> Bool {
        await withCheckedContinuation { continuation in
            center.getNotificationSettings { settings in
                let status = settings.authorizationStatus
                continuation.resume(returning:
                    status == .authorized
                        || status == .provisional
                        || status == .ephemeral
                )
            }
        }
    }

    func removeInvitationNotifications() {
        let center = UNUserNotificationCenter.current()
        let prefixes = ["shared.event.invitation.", "shared.calendar.invitation."]

        center.getPendingNotificationRequests { requests in
            let identifiers = requests.map(\.identifier).filter { identifier in
                prefixes.contains { identifier.hasPrefix($0) }
            }
            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: identifiers)
        }

        center.getDeliveredNotifications { notifications in
            let identifiers = notifications.filter { notification in
                notification.request.content.userInfo["cloudCalendarsPush"] as? Bool == true
                    || prefixes.contains { notification.request.identifier.hasPrefix($0) }
            }.map { $0.request.identifier }
            UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: identifiers)
        }
    }
}

/// The event as the service stores it. Provider-owned identifiers and the
/// destination calendar stay local, while all portable event content is sent.
struct SharedEventUpload {
    let id: String
    let title: String
    let start: Date
    let end: Date
    let isAllDay: Bool
    let location: String?
    let url: URL?
    let details: SharedEventDetails
    let localEventIdentifier: String?
    let organizerName: String?
    let organizerEmail: String?

    var payload: [String: Any] {
        var body: [String: Any] = [
            "title": title,
            "start": ISO8601DateFormatter().string(from: start),
            "end": ISO8601DateFormatter().string(from: end),
            "allDay": isAllDay,
            "url": url?.absoluteString ?? NSNull()
        ]
        if let location { body["location"] = location }
        if let details = details.payload { body["details"] = details }
        if let localEventIdentifier { body["localEventIdentifier"] = localEventIdentifier }
        if let organizerName { body["organizerName"] = organizerName }
        if let organizerEmail { body["organizerEmail"] = organizerEmail }
        return body
    }
}
