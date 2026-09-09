import Foundation

extension SharedEventImportPayload {
    /// Compact e-mail QR codes carry only canonical identifiers. Resolve the
    /// scoped feed before showing the import sheet; full legacy links still
    /// work offline and are refreshed by the importer after acceptance.
    static func resolve(url: URL) async -> SharedEventImportPayload? {
        if let payload = SharedEventImportPayload(url: url) { return payload }
        guard url.scheme == "https", url.path == "/event-invites/open",
              url.user == nil, url.password == nil, url.port == nil,
              var components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        else { return nil }
        var allowed = ["api.cloud-calendars.com"]
        #if DEBUG
        allowed.append(CloudCalendarsAPI.baseURL.host ?? "")
        #endif
        guard allowed.contains(url.host ?? "") else { return nil }
        let values = components.sharedEventFormQueryValues
        func validID(_ value: String?) -> Bool {
            guard let value, !value.isEmpty, value.count <= 128 else { return false }
            return value.range(of: "^[A-Za-z0-9_-]+$", options: .regularExpression) != nil
        }
        guard validID(values["e"]), validID(values["c"]),
              let eventID = values["e"], let feedID = values["c"] else { return nil }
        let base = url.host == "api.cloud-calendars.com"
            ? URL(string: "https://cal.cloud-calendars.com")! : CloudCalendarsAPI.baseURL
        let feed = base.appendingPathComponent("f").appendingPathComponent(feedID + ".ics")
        do {
            let (data, response) = try await URLSession.shared.data(for: URLRequest(
                url: feed, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 20))
            guard (response as? HTTPURLResponse)?.statusCode == 200,
                  let text = String(data: data, encoding: .utf8),
                  let event = ICSEvent.first(withUID: eventID, in: text), !event.isCancelled,
                  let start = event.start, let end = event.end else { return nil }
            var query = values
            query["title"] = event.summary ?? NSLocalizedString("Shared event", comment: "")
            query["start"] = String(start.timeIntervalSince1970)
            query["end"] = String(end.timeIntervalSince1970)
            query["allDay"] = event.isAllDay == true ? "1" : "0"
            query["location"] = event.location
            query["eventURL"] = event.url?.absoluteString
            query["timeZone"] = event.details?.timeZone ?? values["timeZone"]
            components.queryItems = query.sorted { $0.key < $1.key }.map { URLQueryItem(name: $0.key, value: $0.value) }
            return components.url.flatMap(SharedEventImportPayload.init(url:))
        } catch { return nil }
    }
}
