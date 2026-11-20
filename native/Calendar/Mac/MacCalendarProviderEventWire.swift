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
    static func event(_ raw: [String: Any], id: String, google: Bool, calendarTimeZone: String? = nil) throws -> DeviceCalendarEvent {
        guard let start = raw["start"] as? [String: Any], let end = raw["end"] as? [String: Any] else { throw Failure.invalidResponse }
        let allDay = google ? start["date"] != nil : raw["isAllDay"] as? Bool ?? false
        let originalZone = (raw["originalStartTimeZone"] as? String).flatMap(TimeZone.init(identifier:))
        let zone = (!google ? originalZone?.identifier : nil) ?? start["timeZone"] as? String
            ?? (allDay ? calendarTimeZone ?? TimeZone.current.identifier : "UTC")
        guard let startDate = providerDate(start, allDay: allDay, fallbackZone: zone), let endDate = providerDate(end, allDay: allDay, fallbackZone: zone), endDate > startDate else { throw Failure.invalidResponse }
        let notes = google ? raw["description"] as? String : (raw["body"] as? [String: Any])?["content"] as? String
        let location = google ? raw["location"] as? String : (raw["location"] as? [String: Any])?["displayName"] as? String
        var details: [String: CalendarJSON] = ["timeZone": .string(zone), "notes": .string(notes ?? ""),
            "availability": .number(0), "alarms": .array([])]
        if let video = raw["hangoutLink"] as? String ?? (raw["onlineMeeting"] as? [String: Any])?["joinUrl"] as? String { details["videoCallURL"] = .string(video) }
        details["providerPrivacy"] = .string(raw[google ? "visibility" : "sensitivity"] as? String ?? (google ? "default" : "normal"))
        if google {
            let reminders = raw["reminders"] as? [String: Any]
            details["providerDefaultReminders"] = .bool(reminders?["useDefault"] as? Bool ?? (reminders?["overrides"] == nil))
            let other = (reminders?["overrides"] as? [[String: Any]] ?? []).filter { $0["method"] as? String != "popup" }
            if !other.isEmpty { details["providerOtherReminders"] = try JSONDecoder().decode(CalendarJSON.self, from: JSONSerialization.data(withJSONObject: other)) }
        } else {
            details["providerShowAs"] = .string(raw["showAs"] as? String ?? "busy")
        }
        if google, let reminders = raw["reminders"] as? [String: Any], reminders["useDefault"] as? Bool != true {
            let overrides = reminders["overrides"] as? [[String: Any]] ?? []
            details["alarms"] = .array(overrides.compactMap { item in
                guard item["method"] as? String == "popup", let minutes = item["minutes"] as? Int else { return nil }
                return .object(["relativeOffset": .number(-Double(minutes) * 60)])
            })
        } else if !google, let enabled = raw["isReminderOn"] as? Bool {
            let minutes = raw["reminderMinutesBeforeStart"] as? Int ?? 0
            details["alarms"] = .array(enabled ? [.object(["relativeOffset": .number(-Double(minutes) * 60)])] : [])
        }
        if google, let transparency = raw["transparency"] as? String {
            details["availability"] = .number(transparency == "transparent" ? 1 : 0)
        } else if !google, let showAs = raw["showAs"] as? String {
            details["availability"] = .number(["free": 1, "tentative": 2, "oof": 3][showAs] ?? 0)
        }
        let attendees = raw["attendees"] as? [[String: Any]] ?? []
        let ownsMeeting = google ? (raw["organizer"] as? [String: Any])?["self"] as? Bool == true : raw["isOrganizer"] as? Bool == true
        let cancelled = raw["status"] as? String == "cancelled" || raw["isCancelled"] as? Bool == true
        if let organizer = raw["organizer"] as? [String: Any] {
            details["organizer"] = participant(organizer, google: google, organizer: true)
        }
        if !attendees.isEmpty {
            details["attendees"] = .array(attendees.map { participant($0, google: google, organizer: false) })
        }
        return DeviceCalendarEvent(id: id, title: (raw[google ? "summary" : "subject"] as? String) ?? "",
            start: DeviceCalendarEvent.iso(startDate), end: DeviceCalendarEvent.iso(endDate), allDay: allDay,
            location: location?.isEmpty == true ? nil : location, details: details, readOnly: cancelled || (!attendees.isEmpty && !ownsMeeting) || raw["locked"] as? Bool == true, updatedAt: (raw[google ? "updated" : "lastModifiedDateTime"] as? String),
            status: cancelled ? "cancelled" : nil)
    }
    private static func participant(_ raw: [String: Any], google: Bool, organizer: Bool) -> CalendarJSON {
        let address = (raw["emailAddress"] as? [String: Any]) ?? raw
        let response = raw["responseStatus"] as? String ?? (raw["status"] as? [String: Any])?["response"] as? String ?? ""
        let optional = google ? raw["optional"] as? Bool == true : raw["type"] as? String == "optional"
        var fields: [String: CalendarJSON] = [
            "role": .number(organizer ? 3 : optional ? 2 : 1),
            "type": .number(raw["resource"] as? Bool == true || raw["type"] as? String == "resource" ? 3 : 1),
            "status": .number(["needsAction": 1, "notResponded": 1, "accepted": 2, "organizer": 2, "declined": 3, "tentative": 4, "tentativelyAccepted": 4][response] ?? 0),
            "isCurrentUser": .bool(raw["self"] as? Bool == true),
        ]
        fields["email"] = (address[google ? "email" : "address"] as? String).map(CalendarJSON.string)
        fields["name"] = (address[google ? "displayName" : "name"] as? String).map(CalendarJSON.string)
        return .object(fields)
    }
    private static func providerDate(_ value: [String: Any], allDay: Bool, fallbackZone: String) -> Date? {
        if let date = value["date"] as? String ?? (allDay ? (value["dateTime"] as? String).map { String($0.prefix(10)) } : nil) {
            let formatter = DateFormatter(); formatter.locale = Locale(identifier: "en_US_POSIX"); formatter.dateFormat = "yyyy-MM-dd"
            formatter.timeZone = TimeZone(identifier: fallbackZone) ?? .current
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
        if let privacy = event.details?["providerPrivacy"]?.string, privacy != previous?.details?["providerPrivacy"]?.string {
            result[google ? "visibility" : "sensitivity"] = privacy
        }
        if event.details?["availability"] != previous?.details?["availability"] || event.details?["providerShowAs"] != previous?.details?["providerShowAs"] {
            let value = Int(event.details?["availability"]?.number ?? 0)
            result[google ? "transparency" : "showAs"] = google ? (value == 1 ? "transparent" : "opaque")
                : (event.details?["providerShowAs"]?.string ?? [1: "free", 2: "tentative", 3: "oof"][value] ?? "busy")
        }
        if event.details?["alarms"] != previous?.details?["alarms"] ||
            event.details?["providerDefaultReminders"] != previous?.details?["providerDefaultReminders"] ||
            (google && event.details?["providerOtherReminders"] != previous?.details?["providerOtherReminders"]) {
            let alarms: [SharedEventAlarm] = event.decodedDetail("alarms") ?? []
            let minutes = alarms.compactMap { alarm -> Int? in
                let offset = alarm.relativeOffset ?? alarm.absoluteDate.flatMap(DeviceCalendarEvent.date)?.timeIntervalSince(event.startDate)
                return offset.map { max(0, Int((-$0 / 60).rounded())) }
            }
            if google {
                if event.details?["providerDefaultReminders"] == .bool(true) {
                    result["reminders"] = ["useDefault": true]
                } else {
                    let preserved: [[String: Any]] = try event.details?["providerOtherReminders"].map {
                        try JSONSerialization.jsonObject(with: JSONEncoder().encode($0)) as? [[String: Any]] ?? []
                    } ?? []
                    let overrides = minutes.prefix(max(0, 5 - preserved.count)).map { ["method": "popup", "minutes": min(40320, $0)] as [String: Any] }
                    result["reminders"] = ["useDefault": false, "overrides": preserved + overrides]
                }
            } else {
                result["isReminderOn"] = !minutes.isEmpty
                result["reminderMinutesBeforeStart"] = minutes.first ?? 0
            }
        }
        if previous == nil || previous?.details?["timeZone"] != event.details?["timeZone"] || previous?.start != event.start || previous?.end != event.end || previous?.allDay != event.allDay {
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
                let zone = event.details?["timeZone"]?.string ?? "UTC"
                if google {
                    result["start"] = ["dateTime": event.start, "timeZone": zone]
                    result["end"] = ["dateTime": event.end, "timeZone": zone]
                } else {
                    let formatter = DateFormatter()
                    formatter.locale = Locale(identifier: "en_US_POSIX")
                    formatter.timeZone = TimeZone(identifier: zone) ?? TimeZone(secondsFromGMT: 0)
                    for (key, date) in [("start", event.startDate), ("end", event.endDate)] {
                        formatter.dateFormat = DeviceCalendarEvent.iso(date).contains(".") ? "yyyy-MM-dd'T'HH:mm:ss.SSS" : "yyyy-MM-dd'T'HH:mm:ss"
                        result[key] = ["dateTime": formatter.string(from: date), "timeZone": zone]
                    }
                }
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
