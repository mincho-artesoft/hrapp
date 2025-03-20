//
//  CalendarViewModel.swift
//  YourProject
//

import SwiftUI
import EventKit
import Combine
import GoogleSignIn
import GoogleSignInSwift

@MainActor
final class CalendarViewModel: ObservableObject {
    
    let eventStore: EKEventStore = EKEventStore()
    @Published var allCalendars: [EKCalendar] = []
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID: [String: EKEvent] = [:]
    @Published var accessGranted = false
    @Published var selectedCalendarIDs: Set<String> = []
    @Published var calendarsDict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
    @Published var firstLocalCalendarColor: UIColor?
    static let shared = CalendarViewModel()
    let calendar = Calendar(identifier: .gregorian)
    private var cancellables = Set<AnyCancellable>()
    
    @Published var syncTokens: [String: String] = [:]
    private let syncTokensKey = "GoogleCalendarSyncTokensKey"
    private var syncTimer: Timer?
    
    @Published var googleToLocalCalendarMapping: [String: String] = [:]
    private let googleToLocalCalendarMappingKey = "GoogleToLocalCalendarMappingKey"
    @Published var googleToLocalEventMapping: [String: String] = [:]
    private let googleToLocalEventMappingKey = "GoogleToLocalEventMappingKey"
    @Published var isGoogleSignedIn: Bool = false
    private var isImportingGoogleData = false
    private var lastSyncDate: Date?

    init() {
        loadLocalCalendars()
        if let storedArray = UserDefaults.standard.array(forKey: "SelectedCalendarIDsKey") as? [String], !storedArray.isEmpty {
            self.selectedCalendarIDs = Set(storedArray)
        } else {
            let cals = eventStore.calendars(for: .event)
            self.selectedCalendarIDs = Set(cals.map { $0.calendarIdentifier })
        }
        
        $selectedCalendarIDs.sink { newValue in
            UserDefaults.standard.set(Array(newValue), forKey: "SelectedCalendarIDsKey")
        }.store(in: &cancellables)
        
        loadMappingsFromUserDefaults()
        
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(eventStoreDidChange(_:)),
            name: .EKEventStoreChanged,
            object: eventStore
        )
        
        GIDSignIn.sharedInstance.restorePreviousSignIn { [weak self] user, error in
            guard let self = self else { return }
            if user != nil && error == nil {
                self.isGoogleSignedIn = true
                self.startPeriodicSync()
            }
        }
    }
    
    deinit {
        syncTimer?.invalidate()
    }
    
    private func loadMappingsFromUserDefaults() {
        if let data = UserDefaults.standard.data(forKey: googleToLocalCalendarMappingKey),
           let mapping = try? JSONDecoder().decode([String: String].self, from: data) {
            self.googleToLocalCalendarMapping = mapping
        }
        if let data = UserDefaults.standard.data(forKey: googleToLocalEventMappingKey),
           let mapping = try? JSONDecoder().decode([String: String].self, from: data) {
            self.googleToLocalEventMapping = mapping
        }
        if let data = UserDefaults.standard.data(forKey: syncTokensKey),
           let tokens = try? JSONDecoder().decode([String: String].self, from: data) {
            self.syncTokens = tokens
        }
    }
    
    private func startPeriodicSync() {
        syncTimer?.invalidate()
        syncTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            Task { [weak self] in
                await self?.syncWithGoogleCalendars()
            }
        }
        Task { await syncWithGoogleCalendars() }
    }
    
    func stopPeriodicSync() {
        syncTimer?.invalidate()
        syncTimer = nil
    }
    
    @objc private func eventStoreDidChange(_ notification: Notification) {
        guard !isImportingGoogleData else { return } // Prevent feedback loop
        
        print("EKEventStore has changed! Ще презаредим...")
        let oldEventsDict = self.eventsByID
        reloadCalendars()
        loadEvents(for: Date())
        let newEventsDict = self.eventsByID
        
        let oldIDs = Set(oldEventsDict.keys)
        let newIDs = Set(newEventsDict.keys)
        let addedIDs = newIDs.subtracting(oldIDs)
        let removedIDs = oldIDs.subtracting(newIDs)
        let potentialUpdatedIDs = oldIDs.intersection(newIDs)
        
        let googleLocalEventIDs = Set(googleToLocalEventMapping.values)
        
        // Only process events not yet mapped to Google
        let googleAddedIDs = addedIDs.filter { !googleLocalEventIDs.contains($0) && isInGoogleCalendar($0) }
        let googleRemovedIDs = removedIDs.filter { googleLocalEventIDs.contains($0) }
        let googleUpdatedIDs = potentialUpdatedIDs.filter { googleLocalEventIDs.contains($0) }
        
        if let singleAddedID = googleAddedIDs.first,
           let singleAddedEvent = newEventsDict[singleAddedID] {
            print("Локално добавено 1 Google-събитие: \(singleAddedEvent.title ?? "(без заглавие)")")
            Task {
                do {
                    try await createEventInGoogle(singleAddedEvent)
                } catch {
                    print("Грешка при createEventInGoogle:", error)
                }
            }
        }
        
        if let singleRemovedID = googleRemovedIDs.first,
           let singleRemovedEvent = oldEventsDict[singleRemovedID] {
            print("Локално изтрито 1 Google-събитие: \(singleRemovedEvent.title ?? "(без заглавие)")")
            Task {
                do {
                    try await removeEventFromGoogle(singleRemovedEvent)
                } catch {
                    print("Грешка при removeEventFromGoogle:", error)
                }
            }
        }
        
        if let singleUpdatedID = googleUpdatedIDs.first,
           let oldEvent = oldEventsDict[singleUpdatedID],
           let newEvent = newEventsDict[singleUpdatedID],
           (oldEvent.title != newEvent.title || oldEvent.startDate != newEvent.startDate || oldEvent.endDate != newEvent.endDate || oldEvent.notes != newEvent.notes) {
            print("Локално обновено 1 Google-събитие: \(oldEvent.title ?? "(без заглавие)") -> \(newEvent.title ?? "(без заглавие)")")
            Task {
                do {
                    try await updateEventInGoogle(newEvent)
                } catch {
                    print("Грешка при updateEventInGoogle:", error)
                }
            }
        }
    }
    
    private func fetchGoogleCalendarList(accessToken: String) async throws -> [GoogleCalendarItem] {
        let url = URL(string: "https://www.googleapis.com/calendar/v3/users/me/calendarList")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, (200..<300).contains(httpResponse.statusCode) else {
            throw NSError(domain: "CalendarListFetch", code: -1, userInfo: [NSLocalizedDescriptionKey: String(data: data, encoding: .utf8) ?? "Failed to fetch calendar list"])
        }
        
        let decoder = JSONDecoder()
        return try decoder.decode(GoogleCalendarList.self, from: data).items
    }

    // In CalendarViewModel class

    private func fetchSyncToken(forCalendarId calId: String, accessToken: String) async -> String? {
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(calId)/events?singleEvents=true&orderBy=startTime&maxResults=10"
        guard let url = URL(string: urlString) else {
            print("Invalid URL for sync token fetch: \(urlString)")
            return nil
        }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse else {
                print("Failed to fetch sync token for \(calId): Invalid HTTP response")
                return nil
            }
            guard (200..<300).contains(httpResponse.statusCode) else {
                let errorBody = String(data: data, encoding: .utf8) ?? "Unknown error"
                print("Failed to fetch sync token for \(calId): HTTP \(httpResponse.statusCode), Response: \(errorBody)")
                return nil
            }
            // Log raw JSON response for debugging
            if let jsonString = String(data: data, encoding: .utf8) {
                print("Raw sync token response for \(calId): \(jsonString)")
            }
            let eventsList = try JSONDecoder().decode(GoogleEventsList.self, from: data)
            print("Sync token fetch response for \(calId): Items: \(eventsList.items.count), NextSyncToken: \(eventsList.nextSyncToken ?? "nil")")
            return eventsList.nextSyncToken
        } catch {
            print("Error fetching sync token for \(calId): \(error.localizedDescription)")
            return nil
        }
    }

    private func performFullSync(user: GIDGoogleUser) async {
        isImportingGoogleData = true
        defer { isImportingGoogleData = false; lastSyncDate = Date() }
        
        do {
            let accessToken = user.accessToken.tokenString
            let googleCalendars = try await fetchGoogleCalendarList(accessToken: accessToken)
            let validGoogleCalIDs = Set(googleCalendars.map { $0.id })
            
            // Clean up mappings for invalid calendars
            googleToLocalCalendarMapping = googleToLocalCalendarMapping.filter { validGoogleCalIDs.contains($0.key) }
            syncTokens = syncTokens.filter { validGoogleCalIDs.contains($0.key) }
            saveGoogleToLocalCalendarMapping()
            saveSyncTokens()
            
            for googleCal in googleCalendars {
                let localCal = try findOrCreateLocalCalendar(for: googleCal)
                do {
                    let events = try await fetchAllEvents(forCalendarId: googleCal.id, accessToken: accessToken)
                    try await importGoogleEventsAvoidingDuplicates(events, into: localCal)
                    // Attempt to fetch sync token, but proceed even if nil
                    if let syncToken = await fetchSyncToken(forCalendarId: googleCal.id, accessToken: accessToken) {
                        syncTokens[googleCal.id] = syncToken
                        saveSyncTokens()
                    } else {
                        print("No sync token returned for \(googleCal.id), proceeding with full sync data")
                        // Clear existing sync token to force a full sync next time if needed
                        syncTokens.removeValue(forKey: googleCal.id)
                        saveSyncTokens()
                    }
                } catch {
                    print("Full sync failed for calendar \(googleCal.id): \(error.localizedDescription)")
                    if let nsError = error as NSError?, nsError.code == 404 {
                        googleToLocalCalendarMapping.removeValue(forKey: googleCal.id)
                        syncTokens.removeValue(forKey: googleCal.id)
                        saveGoogleToLocalCalendarMapping()
                        saveSyncTokens()
                    }
                    continue
                }
            }
            reloadCalendars()
            loadEvents(for: Date())
        } catch {
            print("Full sync error: \(error.localizedDescription)")
        }
    }

    func syncWithGoogleCalendars() async {
        guard isGoogleSignedIn, let user = GIDSignIn.sharedInstance.currentUser else { return }
        guard let lastSync = lastSyncDate else {
            lastSyncDate = Date()
            return await performFullSync(user: user)
        }
        if Date().timeIntervalSince(lastSync) < 5 { return } // Debounce sync calls
        
        isImportingGoogleData = true
        defer { isImportingGoogleData = false; lastSyncDate = Date() }
        
        do {
            let accessToken = user.accessToken.tokenString
            let googleCalendars = try await fetchGoogleCalendarList(accessToken: accessToken)
            let validGoogleCalIDs = Set(googleCalendars.map { $0.id })
            
            // Clean up mappings for invalid calendars
            googleToLocalCalendarMapping = googleToLocalCalendarMapping.filter { validGoogleCalIDs.contains($0.key) }
            syncTokens = syncTokens.filter { validGoogleCalIDs.contains($0.key) }
            saveGoogleToLocalCalendarMapping()
            saveSyncTokens()
            
            for googleCal in googleCalendars {
                let localCal = try findOrCreateLocalCalendar(for: googleCal)
                do {
                    try await syncEvents(forCalendarId: googleCal.id, localCalendar: localCal, accessToken: accessToken)
                } catch {
                    print("Sync failed for calendar \(googleCal.id): \(error.localizedDescription)")
                    if let nsError = error as NSError?, nsError.code == 404 {
                        googleToLocalCalendarMapping.removeValue(forKey: googleCal.id)
                        syncTokens.removeValue(forKey: googleCal.id)
                        saveGoogleToLocalCalendarMapping()
                        saveSyncTokens()
                    }
                    continue
                }
            }
            reloadCalendars()
            loadEvents(for: Date())
        } catch {
            print("Sync error: \(error.localizedDescription)")
        }
    }

    private func syncEvents(forCalendarId calId: String, localCalendar: EKCalendar, accessToken: String) async throws {
        var urlString = "https://www.googleapis.com/calendar/v3/calendars/\(calId)/events?singleEvents=true&orderBy=startTime"
        if let syncToken = syncTokens[calId] {
            urlString += "&syncToken=\(syncToken)"
        } else {
            urlString += "&timeMin=\(ISO8601DateFormatter().string(from: Date().addingTimeInterval(-60*60*24*365)))"
        }
        
        guard let url = URL(string: urlString) else { throw URLError(.badURL) }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw URLError(.badServerResponse)
        }
        guard (200..<300).contains(httpResponse.statusCode) else {
            let errorBody = String(data: data, encoding: .utf8) ?? "Unknown error"
            if httpResponse.statusCode == 410 {
                syncTokens.removeValue(forKey: calId)
                saveSyncTokens()
                return try await syncEvents(forCalendarId: calId, localCalendar: localCalendar, accessToken: accessToken)
            }
            throw NSError(domain: "EventSync", code: httpResponse.statusCode, userInfo: [NSLocalizedDescriptionKey: "Failed to sync events for \(calId): \(errorBody)"])
        }
        
        let decoder = JSONDecoder()
        let eventsList = try decoder.decode(GoogleEventsList.self, from: data)
        
        eventStore.reset()
        var changesMade = false
        for gEvent in eventsList.items {
            guard let startDate = parseGoogleDateTime(gEvent.start),
                  let endDate = parseGoogleDateTime(gEvent.end) else { continue }
            
            let googleID = gEvent.id
            if gEvent.status == "cancelled" {
                if let localEventID = googleToLocalEventMapping[googleID],
                   let existingEvent = eventStore.event(withIdentifier: localEventID) {
                    try eventStore.remove(existingEvent, span: .thisEvent, commit: false)
                    googleToLocalEventMapping.removeValue(forKey: googleID)
                    changesMade = true
                }
            } else if let localEventID = googleToLocalEventMapping[googleID],
                      let existingEvent = eventStore.event(withIdentifier: localEventID) {
                if existingEvent.title != gEvent.summary ||
                   existingEvent.startDate != startDate ||
                   existingEvent.endDate != endDate {
                    existingEvent.calendar = localCalendar
                    existingEvent.title = gEvent.summary ?? "(Без заглавие)"
                    existingEvent.isAllDay = (gEvent.start?.date != nil)
                    existingEvent.startDate = startDate
                    existingEvent.endDate = endDate
                    try eventStore.save(existingEvent, span: .thisEvent, commit: false)
                    changesMade = true
                }
            } else {
                let newEvent = EKEvent(eventStore: eventStore)
                newEvent.calendar = localCalendar
                newEvent.title = gEvent.summary ?? "(Без заглавие)"
                newEvent.isAllDay = (gEvent.start?.date != nil)
                newEvent.startDate = startDate
                newEvent.endDate = endDate
                try eventStore.save(newEvent, span: .thisEvent, commit: false)
                googleToLocalEventMapping[googleID] = newEvent.eventIdentifier
                changesMade = true
            }
        }
        
        if changesMade {
            try eventStore.commit()
            reloadCalendars()
            loadEvents(for: Date())
        }
        
        if let nextSyncToken = eventsList.nextSyncToken {
            syncTokens[calId] = nextSyncToken
            saveSyncTokens()
        }
        saveGoogleToLocalEventMapping()
    }
    
    func saveSyncTokens() {
        if let data = try? JSONEncoder().encode(syncTokens) {
            UserDefaults.standard.set(data, forKey: syncTokensKey)
        }
    }
    
    func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) { return status == .fullAccess }
        return status == .authorized
    }
    
    func requestCalendarAccessIfNeeded() async -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if status == .notDetermined {
            do {
                let granted = try await eventStore.requestFullAccessToEvents()
                self.accessGranted = granted
                return granted
            } catch {
                print("Error requesting calendar access: \(error.localizedDescription)")
                self.accessGranted = false
                return false
            }
        } else {
            let granted = isCalendarAccessGranted()
            self.accessGranted = granted
            return granted
        }
    }
    
    func reloadCalendars() {
        let cals = eventStore.calendars(for: .event)
        self.allCalendars = cals
        if let firstLocalCal = cals.first(where: { $0.source.sourceType == .local }),
           let cgColor = firstLocalCal.cgColor {
            self.firstLocalCalendarColor = UIColor(cgColor: cgColor)
        } else {
            self.firstLocalCalendarColor = nil
        }
    }
    
    func allowedCalendars() -> [EKCalendar] {
        allCalendars.filter { selectedCalendarIDs.contains($0.calendarIdentifier) }
    }
    
    func loadEvents(for month: Date) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID = [:]
            return
        }
        
        let fetched = eventStore.fetchEventsByDay(for: month, calendar: calendar, allowedCalendarIDs: selectedCalendarIDs)
        self.eventsByDay = fetched
        var tmp: [String: EKEvent] = [:]
        for evList in fetched.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }
    
    func loadEventsForWholeYear(year: Int) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID = [:]
            return
        }
        
        var comp = DateComponents(year: year, month: 1, day: 1)
        guard let startOfYear = calendar.date(from: comp) else { return }
        var compNext = DateComponents(year: year + 1, month: 1, day: 1)
        guard let startOfNextYear = calendar.date(from: compNext) else { return }
        
        let predicate = eventStore.predicateForEvents(withStart: startOfYear, end: startOfNextYear, calendars: allowedCalendars())
        let foundEvents = eventStore.events(matching: predicate)
        
        var dict: [Date: [EKEvent]] = [:]
        for ev in foundEvents {
            let dayKey = calendar.startOfDay(for: ev.startDate)
            dict[dayKey, default: []].append(ev)
        }
        self.eventsByDay = dict
        
        var tmp: [String: EKEvent] = [:]
        for evList in dict.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }
    
    func loadLocalCalendars() {
        reloadCalendars()
        let localCals = allCalendars.filter { $0.source.sourceType == .local }
        var dict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
        
        for cal in localCals {
            let uiColor = cal.cgColor != nil ? UIColor(cgColor: cal.cgColor!) : UIColor.systemGray
            dict[cal.calendarIdentifier] = (title: cal.title, color: uiColor, selected: true, calendar: cal)
        }
        self.calendarsDict = dict
    }
    
    func saveGoogleToLocalCalendarMapping() {
        UserDefaults.standard.removeObject(forKey: googleToLocalCalendarMappingKey)
        if let data = try? JSONEncoder().encode(googleToLocalCalendarMapping) {
            UserDefaults.standard.set(data, forKey: googleToLocalCalendarMappingKey)
        }
    }
    
    func saveGoogleToLocalEventMapping() {
        UserDefaults.standard.removeObject(forKey: googleToLocalEventMappingKey)
        if let data = try? JSONEncoder().encode(googleToLocalEventMapping) {
            UserDefaults.standard.set(data, forKey: googleToLocalEventMappingKey)
        }
    }
}

extension CalendarViewModel {
    func findOrCreateLocalCalendar(for googleCal: GoogleCalendarItem) throws -> EKCalendar {
        if let localCalID = googleToLocalCalendarMapping[googleCal.id],
           let existingLocalCalendar = eventStore.calendar(withIdentifier: localCalID) {
            if existingLocalCalendar.title != googleCal.summary {
                existingLocalCalendar.title = googleCal.summary
            }
            if let bgColorHex = googleCal.backgroundColor, let uiColor = UIColor(hex: bgColorHex),
               existingLocalCalendar.cgColor?.components != uiColor.cgColor.components {
                existingLocalCalendar.cgColor = uiColor.cgColor
            }
            do {
                try eventStore.saveCalendar(existingLocalCalendar, commit: true)
                reloadCalendars()
            } catch {
                print("Failed to save calendar: \(error)")
            }
            return existingLocalCalendar
        } else {
            guard let localSource = eventStore.sources.first(where: { $0.sourceType == .local }) else {
                throw NSError(domain: "LocalSourceError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Не е намерен локален source (On My iPhone)."])
            }
            let newCal = EKCalendar(for: .event, eventStore: eventStore)
            newCal.title = googleCal.summary
            newCal.source = localSource
            if let bgColorHex = googleCal.backgroundColor, let uiColor = UIColor(hex: bgColorHex) {
                newCal.cgColor = uiColor.cgColor
            }
            try eventStore.saveCalendar(newCal, commit: true)
            reloadCalendars()
            googleToLocalCalendarMapping[googleCal.id] = newCal.calendarIdentifier
            saveGoogleToLocalCalendarMapping()
            return newCal
        }
    }
}

extension CalendarViewModel {
    func importGoogleEvents(_ googleEvents: [GoogleEvent], into localCalendar: EKCalendar) async throws {
        eventStore.reset()
        for gEvent in googleEvents {
            guard let startDate = parseGoogleDateTime(gEvent.start),
                  let endDate = parseGoogleDateTime(gEvent.end) else { continue }
            let newEvent = EKEvent(eventStore: eventStore)
            newEvent.calendar = localCalendar
            newEvent.title = gEvent.summary ?? "(Без заглавие)"
            newEvent.isAllDay = gEvent.start?.date != nil
            newEvent.startDate = startDate
            newEvent.endDate = endDate
            try eventStore.save(newEvent, span: .thisEvent, commit: false)
        }
        try eventStore.commit()
    }
    
    func importGoogleEventsAvoidingDuplicates(_ googleEvents: [GoogleEvent], into localCalendar: EKCalendar) async throws {
        eventStore.reset()
        for gEvent in googleEvents {
            guard let startDate = parseGoogleDateTime(gEvent.start),
                  let endDate = parseGoogleDateTime(gEvent.end) else { continue }
            let googleID = gEvent.id
            if let localEventID = googleToLocalEventMapping[googleID],
               let existingEvent = eventStore.event(withIdentifier: localEventID) {
                existingEvent.calendar = localCalendar
                existingEvent.title = gEvent.summary ?? "(Без заглавие)"
                existingEvent.isAllDay = gEvent.start?.date != nil
                existingEvent.startDate = startDate
                existingEvent.endDate = endDate
                try eventStore.save(existingEvent, span: .thisEvent, commit: false)
            } else {
                let newEvent = EKEvent(eventStore: eventStore)
                newEvent.calendar = localCalendar
                newEvent.title = gEvent.summary ?? "(Без заглавие)"
                newEvent.isAllDay = gEvent.start?.date != nil
                newEvent.startDate = startDate
                newEvent.endDate = endDate
                try eventStore.save(newEvent, span: .thisEvent, commit: false)
                googleToLocalEventMapping[googleID] = newEvent.eventIdentifier
            }
        }
        try eventStore.commit()
        saveGoogleToLocalEventMapping()
    }
    
    fileprivate func parseGoogleDateTime(_ dateTime: EventDateTime?) -> Date? {
        guard let dateTime = dateTime else { return nil }
        if let dateTimeString = dateTime.dateTime {
            let formatter = ISO8601DateFormatter()
            return formatter.date(from: dateTimeString)
        } else if let dateString = dateTime.date {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            return formatter.date(from: dateString)
        }
        return nil
    }
}

extension CalendarViewModel {
    func fetchAllEvents(forCalendarId calId: String, accessToken: String) async throws -> [GoogleEvent] {
        var allEvents: [GoogleEvent] = []
        var nextPageToken: String?
        repeat {
            var urlString = "https://www.googleapis.com/calendar/v3/calendars/\(calId)/events?singleEvents=true&orderBy=startTime"
            if let token = nextPageToken { urlString += "&pageToken=\(token)" }
            guard let url = URL(string: urlString) else { throw URLError(.badURL) }
            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse, (200..<300).contains(httpResponse.statusCode) else {
                throw NSError(domain: "CalendarFetch", code: (response as? HTTPURLResponse)?.statusCode ?? -1, userInfo: [NSLocalizedDescriptionKey: String(data: data, encoding: .utf8) ?? "HTTP Error"])
            }
            let eventsList = try JSONDecoder().decode(GoogleEventsList.self, from: data)
            allEvents.append(contentsOf: eventsList.items)
            nextPageToken = (try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any])?["nextPageToken"] as? String
        } while nextPageToken != nil
        return allEvents
    }
}

extension CalendarViewModel {
    func createEventInGoogle(_ localEvent: EKEvent) async throws {
        guard let googleCalID = findGoogleCalendarID(forLocalCalendarID: localEvent.calendar.calendarIdentifier) else {
            throw NSError(domain: "NoGoogleCalID", code: -1, userInfo: [NSLocalizedDescriptionKey: "Локалният календар няма Google ID"])
        }
        guard let user = GIDSignIn.sharedInstance.currentUser else {
            throw NSError(domain: "NoGoogleUser", code: -1, userInfo: [NSLocalizedDescriptionKey: "Не сте логнати в Google"])
        }
        let accessToken = user.accessToken.tokenString
        
        var requestBody: [String: Any] = ["summary": localEvent.title ?? "(Без заглавие)", "description": localEvent.notes ?? ""]
        if localEvent.isAllDay {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            requestBody["start"] = ["date": dateFormatter.string(from: localEvent.startDate)]
            requestBody["end"] = ["date": dateFormatter.string(from: localEvent.endDate)]
        } else {
            let isoFormatter = ISO8601DateFormatter()
            requestBody["start"] = ["dateTime": isoFormatter.string(from: localEvent.startDate), "timeZone": TimeZone.current.identifier]
            requestBody["end"] = ["dateTime": isoFormatter.string(from: localEvent.endDate), "timeZone": TimeZone.current.identifier]
        }
        
        let url = URL(string: "https://www.googleapis.com/calendar/v3/calendars/\(googleCalID)/events")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody, options: [])
        
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResp = response as? HTTPURLResponse, (200..<300).contains(httpResp.statusCode) else {
            throw NSError(domain: "GoogleCreate", code: -1, userInfo: [NSLocalizedDescriptionKey: String(data: data, encoding: .utf8) ?? "Грешка при Create"])
        }
        
        let createdGoogleEvent = try JSONDecoder().decode(GoogleEvent.self, from: data)
        googleToLocalEventMapping[createdGoogleEvent.id] = localEvent.eventIdentifier
        saveGoogleToLocalEventMapping()
        print("Create Success: GoogleEventID = \(createdGoogleEvent.id)")
    }
    
    func updateEventInGoogle(_ localEvent: EKEvent) async throws {
        guard let googleEventID = findGoogleEventID(forLocalEventID: localEvent.eventIdentifier) else {
            throw NSError(domain: "NoGoogleEventID", code: -1, userInfo: [NSLocalizedDescriptionKey: "Това събитие няма Google ID"])
        }
        guard let googleCalID = findGoogleCalendarID(forLocalCalendarID: localEvent.calendar.calendarIdentifier) else {
            throw NSError(domain: "NoGoogleCalID", code: -1, userInfo: [NSLocalizedDescriptionKey: "Локалният календар няма Google ID"])
        }
        guard let user = GIDSignIn.sharedInstance.currentUser else {
            throw NSError(domain: "NoGoogleUser", code: -1, userInfo: [NSLocalizedDescriptionKey: "Не сте логнати в Google"])
        }
        let accessToken = user.accessToken.tokenString
        
        var patchBody: [String: Any] = ["summary": localEvent.title ?? "(Без заглавие)", "description": localEvent.notes ?? ""]
        if localEvent.isAllDay {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            patchBody["start"] = ["date": dateFormatter.string(from: localEvent.startDate)]
            patchBody["end"] = ["date": dateFormatter.string(from: localEvent.endDate)]
        } else {
            let isoFormatter = ISO8601DateFormatter()
            patchBody["start"] = ["dateTime": isoFormatter.string(from: localEvent.startDate), "timeZone": TimeZone.current.identifier]
            patchBody["end"] = ["dateTime": isoFormatter.string(from: localEvent.endDate), "timeZone": TimeZone.current.identifier]
        }
        
        let url = URL(string: "https://www.googleapis.com/calendar/v3/calendars/\(googleCalID)/events/\(googleEventID)")!
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: patchBody, options: [])
        
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResp = response as? HTTPURLResponse, (200..<300).contains(httpResp.statusCode) else {
            throw NSError(domain: "GoogleUpdate", code: -1, userInfo: [NSLocalizedDescriptionKey: String(data: data, encoding: .utf8) ?? "Грешка при Update"])
        }
        print("Update Success: GoogleEventID = \(googleEventID)")
    }
    
    func removeEventFromGoogle(_ localEvent: EKEvent) async throws {
        guard let googleEventID = findGoogleEventID(forLocalEventID: localEvent.eventIdentifier) else {
            throw NSError(domain: "NoGoogleEventID", code: -1, userInfo: [NSLocalizedDescriptionKey: "Това събитие няма Google ID"])
        }
        guard let googleCalID = findGoogleCalendarID(forLocalCalendarID: localEvent.calendar.calendarIdentifier) else {
            throw NSError(domain: "NoGoogleCalID", code: -1, userInfo: [NSLocalizedDescriptionKey: "Локалният календар няма Google ID"])
        }
        guard let user = GIDSignIn.sharedInstance.currentUser else {
            throw NSError(domain: "NoGoogleUser", code: -1, userInfo: [NSLocalizedDescriptionKey: "Не сте логнати в Google"])
        }
        let accessToken = user.accessToken.tokenString
        
        let url = URL(string: "https://www.googleapis.com/calendar/v3/calendars/\(googleCalID)/events/\(googleEventID)")!
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (_, response) = try await URLSession.shared.data(for: request)
        guard let httpResp = response as? HTTPURLResponse, (200..<300).contains(httpResp.statusCode) else {
            throw NSError(domain: "GoogleDelete", code: -1, userInfo: [NSLocalizedDescriptionKey: "Грешка при Delete"])
        }
        
        googleToLocalEventMapping.removeValue(forKey: googleEventID)
        saveGoogleToLocalEventMapping()
        print("Delete Success: GoogleEventID = \(googleEventID)")
    }
    
    private func findGoogleEventID(forLocalEventID localID: String) -> String? {
        googleToLocalEventMapping.first(where: { $0.value == localID })?.key
    }
    
    private func findGoogleCalendarID(forLocalCalendarID localCalID: String) -> String? {
        googleToLocalCalendarMapping.first(where: { $0.value == localCalID })?.key
    }
    
    private func isInGoogleCalendar(_ localEventID: String) -> Bool {
        guard let ev = eventsByID[localEventID] else { return false }
        return googleToLocalCalendarMapping.values.contains(ev.calendar.calendarIdentifier)
    }
}

extension UIColor {
    convenience init?(hex: String) {
        var raw = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if raw.hasPrefix("#") { raw.removeFirst() }
        guard raw.count == 6 || raw.count == 8 else { return nil }
        var rgbValue: UInt64 = 0
        Scanner(string: raw).scanHexInt64(&rgbValue)
        if raw.count == 6 {
            self.init(red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
                      green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
                      blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
                      alpha: 1.0)
        } else {
            self.init(red: CGFloat((rgbValue & 0xFF000000) >> 24) / 255.0,
                      green: CGFloat((rgbValue & 0x00FF0000) >> 16) / 255.0,
                      blue: CGFloat((rgbValue & 0x0000FF00) >> 8) / 255.0,
                      alpha: CGFloat(rgbValue & 0x000000FF) / 255.0)
        }
    }
}

struct GoogleCalendarList: Codable {
    let items: [GoogleCalendarItem]
}

struct GoogleCalendarItem: Codable, Hashable {
    let id: String
    let summary: String
    let description: String?
    let colorId: String?
    let backgroundColor: String?
    let foregroundColor: String?
}

struct GoogleEventsList: Codable {
    let items: [GoogleEvent]
    let nextSyncToken: String?
    
    enum CodingKeys: String, CodingKey {
        case items
        case nextSyncToken = "nextSyncToken" // Explicitly match the API field name
    }
}

struct GoogleEvent: Codable, Hashable {
    let id: String
    let summary: String?
    let description: String?
    let start: EventDateTime?
    let end: EventDateTime?
    let status: String?
}

struct EventDateTime: Codable, Hashable {
    let dateTime: String?
    let date: String?
}
