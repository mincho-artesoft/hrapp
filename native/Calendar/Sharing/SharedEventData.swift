import Foundation
import EventKit
import CoreLocation

extension EKEvent {
    /// EventKit clears isAllDay when a time zone is assigned. Set wall times
    /// in timed mode first, including when reusing a previously all-day event.
    func applyCalendarSchedule(start: Date, end: Date, allDay: Bool, timeZone zone: TimeZone?) {
        if isAllDay { isAllDay = false }
        timeZone = zone
        startDate = start
        endDate = end
        isAllDay = allDay
    }

    /// The calendar wire format and timeline use a half-open range. AppKit
    /// EventKit can return the last second of the final day for all-day items.
    var calendarRangeEnd: Date {
        guard isAllDay else { return endDate }
        let calendar = Calendar.current
        let midnight = calendar.startOfDay(for: endDate)
        if endDate == midnight && endDate > startDate { return endDate }
        return calendar.dateInterval(of: .day, for: max(startDate, endDate))?.end ?? endDate
    }
}

private func sharedEventDate(_ value: String) -> Date? {
    (try? Date.ISO8601FormatStyle(includingFractionalSeconds: true).parse(value))
        ?? (try? Date.ISO8601FormatStyle().parse(value))
}

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
           let date = sharedEventDate(absoluteDate) {
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
        if let endDate, let date = sharedEventDate(endDate) {
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
            && lhs.recurrenceRules == rhs.recurrenceRules && (lhs.excludedStarts ?? []) == (rhs.excludedStarts ?? [])
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
    var excludedStarts: [String]?
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
        case notes, timeZone, availability, alarms, recurrenceRules, excludedStarts, structuredLocation
        case videoCallURL, organizer, attendees, travelTime, attachments
    }

    init(
        notes: String?,
        timeZone: String?,
        availability: Int = 0,
        alarms: [SharedEventAlarm] = [],
        recurrenceRules: [SharedEventRecurrenceRule] = [],
        excludedStarts: [String]? = nil,
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
        self.excludedStarts = excludedStarts
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
        if !event.isAllDay { event.timeZone = timeZone.flatMap(TimeZone.init(identifier:)) }
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
            && (event.isAllDay || timeZone == current.timeZone)
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

