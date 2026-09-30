import Combine
import CoreLocation
import EventKit
import MapKit
import UIKit
import UserNotifications

/// Personal, device-local opt-ins. Never exported to invitees or calendar providers.
@MainActor
final class CalendarTravelReminderManager: NSObject, ObservableObject, @preconcurrency CLLocationManagerDelegate {
    static let shared = CalendarTravelReminderManager()
    nonisolated static let prefix = "calendar.travel."
    private static let storageKey = "CalendarTravelReminders.v1"
    private static let deliveredKey = "CalendarTravelReminders.scheduled.v1"

    struct Selection: Codable {
        var eventID: String
        var calendarID: String
        var native: Bool
        var settings: TravelReminderSettings?
    }
    private struct Candidate {
        var key: String
        var eventID: String
        var calendarID: String
        var title: String
        var start: Date
        var destination: CLLocationCoordinate2D
        var settings: TravelReminderSettings
        var signature: String {
            "\(start.timeIntervalSince1970)|\(destination.latitude)|\(destination.longitude)|\(settings.signature)"
        }
        var notificationID: String { CalendarTravelReminderManager.prefix + key + "." + String(start.timeIntervalSince1970) }
    }

    @Published private var statuses: [String: String] = [:]
    @Published private(set) var message = "travel.pending"
    private var selections: [String: Selection] = [:]
    private var scheduled: [String: TravelReminderSchedule] = [:]
    private let locationManager = CLLocationManager()
    private var currentLocation: CLLocation?
    private var worker: Task<Void, Never>?
    private var rerun = false
    private var directions: MKDirections?
    private var lastCalculation: [String: (signature: String, origin: CLLocation, date: Date)] = [:]
    private var backgroundTask: UIBackgroundTaskIdentifier = .invalid
    private var wantsAlways = false

    var reservedNotificationSlots: Int { selections.isEmpty ? 0 : 8 }

    private override init() {
        super.init()
        if let data = UserDefaults.standard.data(forKey: Self.storageKey) {
            selections = (try? JSONDecoder().decode([String: Selection].self, from: data)) ?? [:]
        }
        if let data = UserDefaults.standard.data(forKey: Self.deliveredKey) {
            scheduled = (try? JSONDecoder().decode([String: TravelReminderSchedule].self, from: data)) ?? [:]
        }
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters
    }

    static func key(for event: EKEvent) -> String { "native:" + event.calendarItemIdentifier }
    static func key(localID: String) -> String { "local:" + localID }
    func isEnabled(key: String?) -> Bool { key.map { selections[$0] != nil } ?? false }

    func settings(for key: String?) -> TravelReminderSettings {
        key.flatMap { selections[$0]?.settings } ?? TravelReminderSettings()
    }

    func status(for key: String?) -> String {
        if locationManager.authorizationStatus != .authorizedAlways
            || !EventNotificationManager.shared.eventNotificationsEnabled {
            return "travel.permissions"
        }
        guard let key else { return "travel.pending" }
        return statuses[key] ?? "travel.pending"
    }

    func setEnabled(_ enabled: Bool, key: String, eventID: String, calendarID: String, native: Bool, settings: TravelReminderSettings) {
        selections[key] = enabled ? Selection(eventID: eventID, calendarID: calendarID, native: native, settings: settings) : nil
        persist()
        refresh()
    }

    /// Invoked only after the person accepts the editor's explanation.
    func requestPermissions() {
        Task {
            let center = UNUserNotificationCenter.current()
            let settings = await center.notificationSettings()
            if settings.authorizationStatus == .notDetermined {
                _ = try? await center.requestAuthorization(options: [.alert, .sound, .badge])
                EventNotificationManager.shared.refreshAuthorizationStatus()
            }
            wantsAlways = true
            switch locationManager.authorizationStatus {
            case .notDetermined: locationManager.requestWhenInUseAuthorization()
            case .authorizedWhenInUse:
                wantsAlways = false
                locationManager.requestAlwaysAuthorization()
                locationManager.requestLocation()
            case .authorizedAlways: locationManager.requestLocation()
            default: message = "travel.permissions"
            }
        }
    }

    func refreshAndWait() async {
        refresh()
        await worker?.value
    }

    func remove(key: String?) {
        guard let key else { return }
        selections.removeValue(forKey: key)
        statuses.removeValue(forKey: key)
        persist()
        refresh()
    }

    func refresh() {
        #if DEBUG
        guard !ScreenshotMode.isActive else { return }
        #endif
        if worker != nil { rerun = true; return }
        backgroundTask = UIApplication.shared.beginBackgroundTask(withName: "Calendar travel reminder") { [weak self] in
            Task { @MainActor in
                self?.directions?.cancel()
                self?.worker?.cancel()
                self?.finishBackgroundTask()
            }
        }
        worker = Task { [weak self] in
            guard let self else { return }
            repeat {
                rerun = false
                await reconcile()
            } while rerun && !Task.isCancelled
            worker = nil
            finishBackgroundTask()
        }
    }

    private func finishBackgroundTask() {
        if backgroundTask != .invalid {
            UIApplication.shared.endBackgroundTask(backgroundTask)
            backgroundTask = .invalid
        }
    }

    private func configureMonitoring() {
        guard !selections.isEmpty, EventNotificationManager.shared.eventNotificationsEnabled,
              locationManager.authorizationStatus == .authorizedAlways else {
            locationManager.stopMonitoringSignificantLocationChanges()
            locationManager.stopMonitoringVisits()
            return
        }
        if CLLocationManager.significantLocationChangeMonitoringAvailable() {
            locationManager.startMonitoringSignificantLocationChanges()
        }
        locationManager.startMonitoringVisits()
    }

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        objectWillChange.send()
        if wantsAlways, manager.authorizationStatus == .authorizedWhenInUse {
            wantsAlways = false
            manager.requestAlwaysAuthorization()
        }
        if manager.authorizationStatus == .denied || manager.authorizationStatus == .restricted {
            currentLocation = nil
            message = "travel.permissions"
        }
        refresh()
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last,
              TravelReminderPolicy.acceptsLocation(timestamp: location.timestamp,
                  accuracy: location.horizontalAccuracy, now: Date()) else { return }
        let shouldRefresh = currentLocation.map {
            location.distance(from: $0) >= 200 || location.timestamp.timeIntervalSince($0.timestamp) >= 300
        } ?? true
        currentLocation = location
        if shouldRefresh { refresh() }
    }

    func locationManager(_ manager: CLLocationManager, didVisit visit: CLVisit) {
        // Visit dates can be delayed; obtain a fresh fix instead of treating the
        // visited location as the user's current departure point.
        manager.requestLocation()
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        message = "travel.unavailable"
        // Keep the last successfully scheduled reminder on location/network failure.
    }

    private func candidates(now: Date) -> [Candidate] {
        let store = CalendarViewModel.shared.eventStore
        let end = now.addingTimeInterval(366 * 86400)
        var result: [Candidate] = []
        for (key, selection) in selections {
            if selection.native {
                guard CalendarViewModel.shared.isCalendarAccessGranted(),
                      let calendar = store.event(withIdentifier: selection.eventID)?.calendar
                        ?? store.calendar(withIdentifier: selection.calendarID) else { continue }
                let predicate = store.predicateForEvents(withStart: now, end: end, calendars: [calendar])
                // Native recurring occurrences each get their own identifier and timing.
                let events = store.events(matching: predicate).filter { Self.key(for: $0) == key }
                for event in events {
                    guard !event.isAllDay, event.status != .canceled, event.startDate > now,
                          let coordinate = event.structuredLocation?.geoLocation?.coordinate,
                          CLLocationCoordinate2DIsValid(coordinate) else { continue }
                    result.append(Candidate(key: key, eventID: event.eventIdentifier ?? selection.eventID,
                        calendarID: event.calendar.calendarIdentifier, title: event.title ?? "",
                        start: event.startDate, destination: coordinate, settings: selection.settings ?? TravelReminderSettings()))
                }
            } else if let event = AppLocalCalendarStore.shared.event(id: selection.eventID),
                      !event.isCancelled, !event.isAllDay,
                      let latitude = event.structuredLocation?.latitude,
                      let longitude = event.structuredLocation?.longitude {
                let coordinate = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
                guard CLLocationCoordinate2DIsValid(coordinate) else { continue }
                for start in TravelRecurrence.starts(start: event.startDate, timeZone: event.timeZoneIdentifier,
                    rules: event.recurrenceRules ?? [], after: now, before: end) {
                    result.append(Candidate(key: key, eventID: event.id, calendarID: event.calendarID,
                        title: event.title, start: start, destination: coordinate,
                        settings: selection.settings ?? TravelReminderSettings()))
                }
            }
        }
        return result.sorted { $0.start < $1.start }
    }

    private func reconcile() async {
        let center = UNUserNotificationCenter.current()
        let now = Date()
        let candidates = candidates(now: now)
        let allowed = EventNotificationManager.shared.eventNotificationsEnabled
        let active = allowed ? Array(candidates.prefix(8)) : []
        let validIDs = Set(active.map(\.notificationID))
        let pending = await center.pendingNotificationRequests()
        guard !Task.isCancelled else { return }
        let signatures = Dictionary(active.map { ($0.notificationID, $0.signature) }, uniquingKeysWith: { first, _ in first })
        let obsolete = pending.filter {
            $0.identifier.hasPrefix(Self.prefix) && (!validIDs.contains($0.identifier)
                || (scheduled[$0.identifier] != nil && scheduled[$0.identifier]?.signature != signatures[$0.identifier]))
        }.map(\.identifier)
        center.removePendingNotificationRequests(withIdentifiers: obsolete)
        for id in obsolete { scheduled.removeValue(forKey: id) }
        scheduled = scheduled.filter { $0.value.eventStart > now }
        lastCalculation = lastCalculation.filter { validIDs.contains($0.key) }
        persist()
        guard !active.isEmpty else {
            locationManager.stopMonitoringSignificantLocationChanges()
            locationManager.stopMonitoringVisits()
            return
        }
        configureMonitoring()
        let settings = await center.notificationSettings()
        guard settings.authorizationStatus == .authorized || settings.authorizationStatus == .provisional else {
            message = "travel.permissions"
            for candidate in active { statuses[candidate.key] = message }; return
        }
        guard let origin = currentLocation, abs(origin.timestamp.timeIntervalSinceNow) < 300 else {
            if locationManager.authorizationStatus == .authorizedAlways || locationManager.authorizationStatus == .authorizedWhenInUse {
                locationManager.requestLocation()
            }
            message = "travel.pending"
            for candidate in active { statuses[candidate.key] = scheduled[candidate.notificationID] == nil ? message : "travel.scheduled" }; return
        }
        let otherCount = pending.filter { !$0.identifier.hasPrefix(Self.prefix) }.count
        let slots = max(0, min(8, 64 - otherCount))
        for candidate in active.prefix(slots) {
            guard !Task.isCancelled else { return }
            let id = candidate.notificationID
            // A previously delivered occurrence must not notify again on every move.
            if let old = scheduled[id], old.wasDelivered(signature: candidate.signature, now: now) { continue }
            if let previous = lastCalculation[id], previous.signature == candidate.signature,
               origin.distance(from: previous.origin) < 200, now.timeIntervalSince(previous.date) < 300,
               pending.contains(where: { $0.identifier == id }) { continue }
            let request = MKDirections.Request()
            request.source = MKMapItem(placemark: MKPlacemark(coordinate: origin.coordinate))
            request.destination = MKMapItem(placemark: MKPlacemark(coordinate: candidate.destination))
            switch candidate.settings.transport {
            case .driving: request.transportType = .automobile
            case .walking: request.transportType = .walking
            case .transit: request.transportType = .transit
            }
            let arrival = candidate.start.addingTimeInterval(-TimeInterval(candidate.settings.arrivalBufferMinutes * 60))
            if arrival > Date() { request.arrivalDate = arrival }
            else { request.departureDate = Date() }
            let calculation = MKDirections(request: request)
            directions = calculation
            do {
                let departure: Date
                do {
                    let eta = try await calculation.calculateETA()
                    departure = arrival > Date() ? eta.expectedDepartureDate : arrival.addingTimeInterval(-eta.expectedTravelTime)
                } catch {
                    guard !Task.isCancelled, !rerun else { continue }
                    // If future-date routing is unavailable, still try an initial
                    // estimate using current traffic. Never invent a journey time.
                    request.arrivalDate = nil
                    request.departureDate = Date()
                    let fallback = MKDirections(request: request)
                    directions = fallback
                    let eta = try await fallback.calculateETA()
                    departure = arrival.addingTimeInterval(-eta.expectedTravelTime)
                }
                guard !Task.isCancelled, selections[candidate.key] != nil, !rerun else { continue }
                guard let fire = TravelReminderPolicy.notificationDate(start: candidate.start,
                    departure: departure, now: Date(), advanceNotice: TimeInterval(candidate.settings.advanceNoticeMinutes * 60)) else { continue }
                let content = UNMutableNotificationContent()
                content.title = travelString("travel.title")
                let formatter = DateFormatter()
                formatter.locale = AppPreferences.shared.interfaceLocale
                formatter.timeStyle = .short
                content.body = String(format: travelString("travel.notification"),
                    candidate.title, formatter.string(from: departure))
                content.sound = .default
                content.userInfo = ["eventIdentifier": candidate.eventID,
                    "calendarIdentifier": candidate.calendarID, "eventStartDate": candidate.start.timeIntervalSince1970]
                let trigger = UNTimeIntervalNotificationTrigger(timeInterval: max(1, fire.timeIntervalSinceNow), repeats: false)
                // Replacing the same ID is atomic: never remove the fallback before ETA succeeds.
                try await center.add(UNNotificationRequest(identifier: id, content: content, trigger: trigger))
                lastCalculation[id] = (candidate.signature, origin, Date())
                scheduled[id] = TravelReminderSchedule(signature: candidate.signature, fireDate: fire, eventStart: candidate.start)
                message = "travel.scheduled"
                statuses[candidate.key] = message
                persist()
            } catch {
                message = "travel.unavailable"
                statuses[candidate.key] = message
            }
            directions = nil
        }
    }

    private func persist() {
        if let data = try? JSONEncoder().encode(selections) { UserDefaults.standard.set(data, forKey: Self.storageKey) }
        if let data = try? JSONEncoder().encode(scheduled) { UserDefaults.standard.set(data, forKey: Self.deliveredKey) }
    }
}

func travelString(_ key: String) -> String {
    Bundle.main.localizedString(forKey: key, value: nil, table: "CalendarTravel")
}
