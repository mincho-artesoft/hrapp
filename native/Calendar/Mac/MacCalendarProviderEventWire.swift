#if os(macOS)
import Foundation
import CryptoKit

/// Pure provider payload conversion, also exercised by the regression harness.
enum MacCalendarProviderEventWire {
    enum Failure: LocalizedError {
        case invalidResponse, unsupportedRecurrence
        var errorDescription: String? {
            switch self {
            case .invalidResponse: NSLocalizedString("The calendar provider returned an invalid event.", comment: "")
            case .unsupportedRecurrence: NSLocalizedString("This repeat pattern is not supported by the selected calendar provider.", comment: "")
            }
        }
    }
    static func event(_ raw: [String: Any], id: String, google: Bool) throws -> DeviceCalendarEvent {
        guard let start = raw["start"] as? [String: Any], let end = raw["end"] as? [String: Any] else { throw Failure.invalidResponse }
        let allDay = google ? start["date"] != nil : raw["isAllDay"] as? Bool ?? false
        let zone = start["timeZone"] as? String ?? (allDay ? TimeZone.current.identifier : "UTC")
        guard let startDate = providerDate(start, allDay: allDay), let endDate = providerDate(end, allDay: allDay), endDate > startDate else { throw Failure.invalidResponse }
        let notes = google ? raw["description"] as? String : (raw["body"] as? [String: Any])?["content"] as? String
        let location = google ? raw["location"] as? String : (raw["location"] as? [String: Any])?["displayName"] as? String
        var details: [String: CalendarJSON] = ["timeZone": .string(zone), "notes": .string(notes ?? "")]
        if let video = raw["hangoutLink"] as? String ?? (raw["onlineMeeting"] as? [String: Any])?["joinUrl"] as? String { details["videoCallURL"] = .string(video) }
        let attendees = raw["attendees"] as? [[String: Any]] ?? []
        return DeviceCalendarEvent(id: id, title: (raw[google ? "summary" : "subject"] as? String) ?? "",
            start: DeviceCalendarEvent.iso(startDate), end: DeviceCalendarEvent.iso(endDate), allDay: allDay,
            location: location?.isEmpty == true ? nil : location, details: details, readOnly: !attendees.isEmpty)
    }
    private static func providerDate(_ value: [String: Any], allDay: Bool) -> Date? {
        if let date = value["date"] as? String ?? (allDay ? (value["dateTime"] as? String).map { String($0.prefix(10)) } : nil) {
            let formatter = DateFormatter(); formatter.locale = Locale(identifier: "en_US_POSIX"); formatter.dateFormat = "yyyy-MM-dd"
            formatter.timeZone = (value["timeZone"] as? String).flatMap(TimeZone.init(identifier:)) ?? .current
            return formatter.date(from: date)
        }
        guard let date = value["dateTime"] as? String else { return nil }
        if let parsed = DeviceCalendarEvent.date(date) { return parsed }
        // Graph's offset-free dateTime is interpreted in its accompanying zone.
        let formatter = DateFormatter(); formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = (value["timeZone"] as? String).flatMap(TimeZone.init(identifier:)) ?? TimeZone(secondsFromGMT: 0)
        for format in ["yyyy-MM-dd'T'HH:mm:ss.SSSSSSS", "yyyy-MM-dd'T'HH:mm:ss"] {
            formatter.dateFormat = format
            if let parsed = formatter.date(from: date) { return parsed }
        }
        return nil
    }
    static func body(_ event: DeviceCalendarEvent, previous: DeviceCalendarEvent?, google: Bool) throws -> [String: Any] {
        var result: [String: Any] = [:]
        if previous == nil { result[google ? "id" : "transactionId"] = google ? SHA256.hash(data: Data(event.id.utf8)).map { String(format: "%02x", $0) }.joined() : event.id }
        if previous?.title != event.title { result[google ? "summary" : "subject"] = event.title }
        if previous?.details?["notes"] != event.details?["notes"] {
            let notes = event.details?["notes"]?.string ?? ""
            result[google ? "description" : "body"] = google ? notes as Any : ["contentType": "text", "content": notes]
        }
        if previous?.location != event.location { result["location"] = google ? (event.location ?? "") as Any : ["displayName": event.location ?? ""] }
        if previous == nil || previous?.start != event.start || previous?.end != event.end || previous?.allDay != event.allDay {
            if google, event.allDay {
                let formatter = DateFormatter(); formatter.locale = Locale(identifier: "en_US_POSIX"); formatter.dateFormat = "yyyy-MM-dd"
                formatter.timeZone = event.details?["timeZone"]?.string.flatMap(TimeZone.init(identifier:)) ?? .current
                result["start"] = ["date": formatter.string(from: event.startDate)]; result["end"] = ["date": formatter.string(from: event.endDate)]
            } else if !google, event.allDay {
                let formatter = DateFormatter(); formatter.locale = Locale(identifier: "en_US_POSIX"); formatter.dateFormat = "yyyy-MM-dd"
                formatter.timeZone = event.details?["timeZone"]?.string.flatMap(TimeZone.init(identifier:)) ?? .current
                result["start"] = ["dateTime": formatter.string(from: event.startDate) + "T00:00:00", "timeZone": formatter.timeZone.identifier]
                result["end"] = ["dateTime": formatter.string(from: event.endDate) + "T00:00:00", "timeZone": formatter.timeZone.identifier]
            } else {
                let zone = google ? event.details?["timeZone"]?.string ?? TimeZone.current.identifier : "UTC"
                let start = google ? event.start : String(event.start.dropLast(event.start.hasSuffix("Z") ? 1 : 0))
                let end = google ? event.end : String(event.end.dropLast(event.end.hasSuffix("Z") ? 1 : 0))
                result["start"] = ["dateTime": start, "timeZone": zone]; result["end"] = ["dateTime": end, "timeZone": zone]
            }
            if !google { result["isAllDay"] = event.allDay }
        }
        if previous == nil, !event.macRecurrenceRules.isEmpty {
            if google { result["recurrence"] = try event.macRecurrenceRules.map(googleRecurrence) }
            else {
                guard event.macRecurrenceRules.count == 1, let rule = event.macRecurrenceRules.first else { throw Failure.unsupportedRecurrence }
                result["recurrence"] = try microsoftRecurrence(rule, event: event)
            }
        }
        return result
    }
    private static func googleRecurrence(_ rule: SharedEventRecurrenceRule) throws -> String {
        let frequencies = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]
        guard frequencies.indices.contains(rule.frequency), rule.interval > 0 else { throw Failure.unsupportedRecurrence }
        var parts = ["FREQ=\(frequencies[rule.frequency])", "INTERVAL=\(rule.interval)"]
        let days = ["", "SU", "MO", "TU", "WE", "TH", "FR", "SA"]
        if let values = rule.daysOfTheWeek, !values.isEmpty {
            guard values.allSatisfy({ (1...7).contains($0.weekday) }) else { throw Failure.unsupportedRecurrence }
            parts.append("BYDAY=" + values.map { ($0.weekNumber == 0 ? "" : String($0.weekNumber)) + days[$0.weekday] }.joined(separator: ","))
        }
        for (key, value) in [("BYMONTHDAY", rule.daysOfTheMonth), ("BYMONTH", rule.monthsOfTheYear),
            ("BYWEEKNO", rule.weeksOfTheYear), ("BYYEARDAY", rule.daysOfTheYear), ("BYSETPOS", rule.setPositions)] {
            if let value, !value.isEmpty { parts.append(key + "=" + value.map(String.init).joined(separator: ",")) }
        }
        if let count = rule.occurrenceCount, count > 0 { parts.append("COUNT=\(count)") }
        else if let end = rule.endDate.flatMap(DeviceCalendarEvent.date) {
            let formatter = DateFormatter(); formatter.locale = Locale(identifier: "en_US_POSIX"); formatter.timeZone = TimeZone(secondsFromGMT: 0)
            formatter.dateFormat = "yyyyMMdd'T'HHmmss'Z'"; parts.append("UNTIL=" + formatter.string(from: end))
        }
        return "RRULE:" + parts.joined(separator: ";")
    }
    private static func microsoftRecurrence(_ rule: SharedEventRecurrenceRule, event: DeviceCalendarEvent) throws -> [String: Any] {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = event.details?["timeZone"]?.string.flatMap(TimeZone.init(identifier:)) ?? .current
        let date = calendar.dateComponents([.day, .month, .weekday], from: event.startDate)
        let weekdays = ["", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
        let dayRules = rule.daysOfTheWeek ?? []
        guard dayRules.allSatisfy({ (1...7).contains($0.weekday) }), rule.interval > 0,
              (rule.weeksOfTheYear ?? []).isEmpty, (rule.daysOfTheYear ?? []).isEmpty,
              (rule.daysOfTheMonth ?? []).count <= 1, (rule.monthsOfTheYear ?? []).count <= 1 else { throw Failure.unsupportedRecurrence }
        var pattern: [String: Any] = ["interval": rule.interval]
        switch rule.frequency {
        case 0: pattern["type"] = "daily"
        case 1:
            pattern["type"] = "weekly"; pattern["firstDayOfWeek"] = "sunday"
            pattern["daysOfWeek"] = dayRules.isEmpty ? [weekdays[date.weekday!]] : dayRules.map { weekdays[$0.weekday] }
        case 2, 3:
            let yearly = rule.frequency == 3
            if yearly { pattern["month"] = rule.monthsOfTheYear?.first ?? date.month! }
            if dayRules.isEmpty {
                pattern["type"] = yearly ? "absoluteYearly" : "absoluteMonthly"
                let day = rule.daysOfTheMonth?.first ?? date.day!
                guard (1...31).contains(day) else { throw Failure.unsupportedRecurrence }
                pattern["dayOfMonth"] = day
            } else {
                pattern["type"] = yearly ? "relativeYearly" : "relativeMonthly"
                pattern["daysOfWeek"] = dayRules.map { weekdays[$0.weekday] }
                let positions = Set(dayRules.map(\.weekNumber).filter { $0 != 0 }).union(rule.setPositions ?? [])
                guard positions.count == 1, let position = positions.first,
                    let index = [1: "first", 2: "second", 3: "third", 4: "fourth", -1: "last"][position] else { throw Failure.unsupportedRecurrence }
                pattern["index"] = index
            }
        default: throw Failure.unsupportedRecurrence
        }
        let formatter = DateFormatter(); formatter.locale = Locale(identifier: "en_US_POSIX"); formatter.timeZone = calendar.timeZone; formatter.dateFormat = "yyyy-MM-dd"
        var range: [String: Any] = ["startDate": formatter.string(from: event.startDate), "recurrenceTimeZone": calendar.timeZone.identifier]
        if let count = rule.occurrenceCount, count > 0 { range["type"] = "numbered"; range["numberOfOccurrences"] = count }
        else if let end = rule.endDate.flatMap(DeviceCalendarEvent.date) { range["type"] = "endDate"; range["endDate"] = formatter.string(from: end) }
        else { range["type"] = "noEnd" }
        return ["pattern": pattern, "range": range]
    }

}
#endif
