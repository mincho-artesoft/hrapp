import SwiftUI
import EventKit
import Combine
import GoogleSignIn

@MainActor
final class CalendarViewModel: ObservableObject {
    
    // MARK: - EventKit Store & Properties
    var eventStore: EKEventStore = EKEventStore()
    
    let clientID = "540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com"
    @Published var allCalendars: [EKCalendar] = []
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID:  [String: EKEvent] = [:]

    @Published var accessGranted = false
    @Published var selectedCalendarIDs: Set<String> = []
    @Published var calendarsDict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
    
    @Published var firstLocalCalendarColor: UIColor?
    
    // MARK: MULTI-ACCOUNT: Instead of a single StoredGoogleUser, keep an array
    @Published var storedUsers: [StoredGoogleUser] = []
    
    /// Timer за автоматична синхронизация (we'll run one timer that syncs all accounts)
    private var syncTimer: Timer? = nil

    static let shared = CalendarViewModel()

    let calendar = Calendar(identifier: .gregorian)
    
    private var cancellables = Set<AnyCancellable>()

    // MARK: MULTI-ACCOUNT: Instead of a single googleToLocalCalendarMap, store them per user.
    //
    // For example, `googleToLocalCalendarMapAll[userID]` = (dictionary of googleCalId->localCalendarID).
    // We'll have corresponding methods to load/save them from UserDefaults.
    private var googleToLocalCalendarMapAll: [String : [String : String]] = [:]
    
    // For events:
    private var googleToLocalEventMapAll: [String : [String : String]] = [:]
    
    // The Google “updated” string, per event ID:
    private var googleEventUpdatedMapAll: [String : [String : String]] = [:]
    
    // For storing each user’s lastSyncDate
    private var lastSyncDateAll: [String : Date] = [:]
    
    // In multi-account, when we do a sync for one user, we store a snapshot of that user’s googleToLocalEventMap
    private var oldGoogleToLocalEventMap: [String : String] = [:]

    // MARK: - Init
    init() {
        // 1) Attempt to load the array of StoredGoogleUsers from UserDefaults
        self.loadAllUsersFromUserDefaults()
        
        // 2) Load per-user dictionaries from UserDefaults
        for user in storedUsers {
            self.loadPerUserMaps(for: user)
        }

        Task {
            await refreshTokensForAllUsers()
            startGoogleCalendarSync()
        }
        // 3) Reload local calendars from EKEventStore
       
        loadLocalCalendars()

        // 4) Load the previously selected calendar IDs
        if let storedArray = UserDefaults.standard.array(forKey: "SelectedCalendarIDsKey") as? [String],
           !storedArray.isEmpty {
            self.selectedCalendarIDs = Set(storedArray)
        } else {
            let cals = eventStore.calendars(for: .event)
            self.selectedCalendarIDs = Set(cals.map { $0.calendarIdentifier })
        }

        // 5) Observe changes in selectedCalendarIDs and store them
        $selectedCalendarIDs
            .sink { newValue in
                let array = Array(newValue)
                UserDefaults.standard.set(array, forKey: "SelectedCalendarIDsKey")
            }
            .store(in: &cancellables)
    }
    
    deinit {
        syncTimer?.invalidate()
    }

    // MARK: - Calendar Access
    func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            return (status == .fullAccess)
        } else {
            return (status == .authorized)
        }
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

    // MARK: - Load Calendars
    func reloadCalendars() {
        let cals = eventStore.calendars(for: .event)
        self.allCalendars = cals
        
        if let firstLocalCal = cals.first(where: { $0.source.sourceType == .local }),
           let cgColor = firstLocalCal.cgColor {
            self.firstLocalCalendarColor = UIColor(cgColor: cgColor)
        } else {
            self.firstLocalCalendarColor = nil
        }
        syncLocalCalendarsDict()
    }

    func allowedCalendars() -> [EKCalendar] {
        allCalendars.filter {
            selectedCalendarIDs.contains($0.calendarIdentifier)
        }
    }

    func loadEvents(for month: Date) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID  = [:]
            return
        }
        
        let fetched = eventStore.fetchEventsByDay(for: month,
                                                  calendar: calendar,
                                                  allowedCalendarIDs: selectedCalendarIDs)
        self.eventsByDay = fetched
        
        var tmp: [String: EKEvent] = [:]
        for evList in fetched.values {
            for ev in evList {
                tmp[ev.eventIdentifier] = ev
            }
        }
        self.eventsByID = tmp
    }
    func syncLocalCalendarsDict() {
        // 1) Filter the allCalendars to only local
        let localCals = allCalendars.filter { $0.source.sourceType == .local }
        
        // 2) Create a new dictionary
        var newDict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
        
        for cal in localCals {
            let calTitle = cal.title
            
            var uiColor = UIColor.systemGray
            if let cgColor = cal.cgColor {
                uiColor = UIColor(cgColor: cgColor)
            }
            
            // If we already had this calendar in old dictionary, preserve its `selected` value.
            let wasSelected = calendarsDict[cal.calendarIdentifier]?.selected ?? true
            
            newDict[cal.calendarIdentifier] = (
                title: calTitle,
                color: uiColor,
                selected: wasSelected,
                calendar: cal
            )
        }
        
        // 3) Assign it
        self.calendarsDict = newDict
    }
    func loadEventsForWholeYear(year: Int) {
        guard isCalendarAccessGranted() else {
            self.eventsByDay = [:]
            self.eventsByID  = [:]
            return
        }

        var comp = DateComponents()
        comp.year = year
        comp.month = 1
        comp.day = 1
        guard let startOfYear = calendar.date(from: comp) else { return }

        var compNext = DateComponents()
        compNext.year = year + 1
        compNext.month = 1
        compNext.day = 1
        guard let startOfNextYear = calendar.date(from: compNext) else { return }

        let allowedCals = allowedCalendars()
        let predicate = eventStore.predicateForEvents(
            withStart: startOfYear,
            end: startOfNextYear,
            calendars: allowedCals
        )
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
        
        let localCals = allCalendars.filter {
            $0.source.sourceType == .local
        }
        
        var dict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
        
        for cal in localCals {
            let calTitle = cal.title
            var uiColor = UIColor.systemGray
            if let cgColor = cal.cgColor {
                uiColor = UIColor(cgColor: cgColor)
            }
            dict[cal.calendarIdentifier] = (
                title: calTitle,
                color: uiColor,
                selected: true,
                calendar: cal
            )
        }
        
        self.calendarsDict = dict
    }
}

// MARK: - Google Sync (2‑way пример), adapted for multi-user
extension CalendarViewModel {
    
    func startGoogleCalendarSync() {
        print("Start Google Calendar sync timer (multi-user)…")
        syncTimer?.invalidate()
        
        // We'll do 1 timer that syncs *all* accounts every X seconds
        syncTimer = Timer.scheduledTimer(withTimeInterval: 10, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            Task {
                await self.performGoogleCalendarSyncForAllUsers()
            }
        }
    }
    
    func stopGoogleCalendarSync() {
        print("Stop Google Calendar sync timer...")
        syncTimer?.invalidate()
        syncTimer = nil
    }
    
    /// Sync *all* storedUsers
    @MainActor
    func performGoogleCalendarSyncForAllUsers() async {
        for user in storedUsers {
            await performGoogleCalendarSync(for: user)
        }
    }
    
    /// Perform a 2‑way sync for a specific user
    @MainActor
    func performGoogleCalendarSync(for user: StoredGoogleUser) async {
        // 1) Check if user’s accessToken is expired
        if user.accessTokenExpiration < Date() {
            // Attempt to refresh
            if let refresh = user.refreshToken, !refresh.isEmpty {
                do {
                    let (newAccessToken, newExpDate, newIDToken) = try await self.refreshTokens(refreshToken: refresh)
                    
                    let updatedUser = StoredGoogleUser(
                        uniqueID: user.uniqueID,
                        userID: user.userID,
                        email:  user.email,
                        accessToken: newAccessToken,
                        accessTokenExpiration: newExpDate,
                        refreshToken: user.refreshToken, // same refresh
                        idToken: newIDToken
                    )
                    
                    // Update local array
                    updateUserInMemory(updatedUser)
                    // Overwrite in UserDefaults
                    self.saveAllUsersToUserDefaults()
                    
                } catch {
                    print("Refresh token error for \(user.email ?? "???"): \(error.localizedDescription)")
                    return
                }
            } else {
                // If no refresh token => skip
                print("No refresh token for \(user.email ?? "???" ) => skip sync.")
                return
            }
        }

        // 2) Should now have valid token
        let validAccessToken = getUserInMemory(user.uniqueID)?.accessToken ?? ""
        if validAccessToken.isEmpty { return }
        
        // 3) 2‑way sync
        do {
            // We'll keep a snapshot of googleToLocalEventMap for *this user*
            self.oldGoogleToLocalEventMap = googleToLocalEventMap(for: user.uniqueID)
            
            // (A) Google → Local
            let googleCalendars = try await fetchGoogleCalendarList(accessToken: validAccessToken)
            await syncGoogleCalendars(googleCalendars, forUser: user, accessToken: validAccessToken)

            // (B) Local → Google
            let map = googleToLocalCalendarMap(for: user.uniqueID) // the user's map
            for (gCalID, localCalID) in map {
                if let localCal = eventStore.calendar(withIdentifier: localCalID) {
                    await uploadLocalChangesToGoogle(
                        googleCalId: gCalID,
                        userID: user.uniqueID,
                        accessToken: validAccessToken,
                        localCalendar: localCal
                    )
                }
            }
            
        } catch {
            print("Error in performGoogleCalendarSync(for: \(user.email ?? "???")): \(error.localizedDescription)")
        }
    }

    // MARK: - Google -> Local
    private func fetchGoogleCalendarList(accessToken: String) async throws -> [GoogleCalendarItem] {
        guard let url = URL(string: "https://www.googleapis.com/calendar/v3/users/me/calendarList") else {
            throw SyncError.invalidURL
        }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        if let httpResp = response as? HTTPURLResponse {
            if httpResp.statusCode == 403 || httpResp.statusCode == 429 {
                throw SyncError.rateLimit
            } else if httpResp.statusCode >= 400 {
                throw SyncError.networkError("HTTP \(httpResp.statusCode)")
            }
        }
        
        let decoded = try JSONDecoder().decode(GoogleCalendarListResponse.self, from: data)
        return decoded.items
    }
    
    private func syncGoogleCalendars(
        _ googleCalendars: [GoogleCalendarItem],
        forUser user: StoredGoogleUser,
        accessToken: String
    ) async {
        var stillExistsGoogleCalendarIDs = Set<String>()
        
        // For convenience, load the user's map first
        let userID = user.uniqueID
        var map = googleToLocalCalendarMap(for: userID)
        
        for gcal in googleCalendars {
            let googleCalId = gcal.id
            stillExistsGoogleCalendarIDs.insert(googleCalId)
            
            let googleCalName = gcal.summary
            let googleCalColor = colorFromHexString(gcal.backgroundColor ?? "") ?? .systemBlue
            
            if let localCalID = map[googleCalId],
               let localEKCal = eventStore.calendar(withIdentifier: localCalID) {
                
                // Check if name or color differ
                if localEKCal.title != googleCalName ||
                    localEKCal.cgColor != googleCalColor.cgColor {
                    
                    localEKCal.title  = googleCalName
                    localEKCal.cgColor = googleCalColor.cgColor
                    do {
                        try eventStore.saveCalendar(localEKCal, commit: true)
                    } catch {
                        print("Error updating local calendar:", error.localizedDescription)
                    }
                }
                
                // Download Google → Local events
                await downloadAllEvents(
                    forGoogleCalendarID: googleCalId,
                    userID: userID,
                    localCalendar: localEKCal,
                    accessToken: accessToken
                )
                
            } else {
                // Create a new local calendar if none found
                if let newCal = createLocalCalendar(googleCalendarName: googleCalName,
                                                    googleCalendarColor: googleCalColor) {
                    map[googleCalId] = newCal.calendarIdentifier
                    self.setGoogleToLocalCalendarMap(map, for: userID)
                    
                    // Then download events
                    await downloadAllEvents(
                        forGoogleCalendarID: googleCalId,
                        userID: userID,
                        localCalendar: newCal,
                        accessToken: accessToken
                    )
                }
            }
        }
        
        // Delete local calendars that no longer exist in Google for this user
        let currentMap = googleToLocalCalendarMap(for: userID)
        for (gCalID, localID) in currentMap {
            if !stillExistsGoogleCalendarIDs.contains(gCalID) {
                if let calToDelete = eventStore.calendar(withIdentifier: localID) {
                    do {
                        try eventStore.removeCalendar(calToDelete, commit: true)
                        print("Removed local calendar:", calToDelete.title)
                    } catch {
                        print("Failed to remove local calendar:", error.localizedDescription)
                    }
                }
                var newMap = currentMap
                newMap.removeValue(forKey: gCalID)
                setGoogleToLocalCalendarMap(newMap, for: userID)
            }
        }
    }

    private func createLocalCalendar(googleCalendarName: String,
                                     googleCalendarColor: UIColor?) -> EKCalendar? {
        guard accessGranted else { return nil }
        
        let newCal = EKCalendar(for: .event, eventStore: eventStore)
        newCal.title = googleCalendarName
        
        if let localSource = eventStore.sources.first(where: { $0.sourceType == .local }) {
            newCal.source = localSource
        } else if let icloudSource = eventStore.sources.first(where: { $0.sourceType == .calDAV }) {
            newCal.source = icloudSource
        } else {
            newCal.source = eventStore.defaultCalendarForNewEvents?.source
        }
        
        if let uiColor = googleCalendarColor {
            newCal.cgColor = uiColor.cgColor
        }
        
        do {
            try eventStore.saveCalendar(newCal, commit: true)
            self.reloadCalendars()
            print("Created local calendar:", newCal.title)
            return newCal
        } catch {
            print("Error saving local calendar:", error.localizedDescription)
            return nil
        }
    }
    
    private func downloadAllEvents(
        forGoogleCalendarID googleCalId: String,
        userID: UUID,
        localCalendar: EKCalendar,
        accessToken: String
    ) async {
        let now = Date()
        let startDate = Calendar.current.date(byAdding: .day, value: -180, to: now)!
        let endDate   = Calendar.current.date(byAdding: .day, value: 360, to: now)!

        do {
            let allGEvents = try await fetchAllGoogleEvents(
                googleCalId: googleCalId,
                accessToken: accessToken,
                startDate: startDate,
                endDate: endDate
            )
            
            let googleEventIDsSet = Set(allGEvents.map { $0.id })
            
            // Load current maps for user
            var evMap  = googleToLocalEventMap(for: userID)
            var updMap = googleEventUpdatedMap(for: userID)
            
            // For each event from Google
            for gevent in allGEvents {
                let googleUpdated = gevent.updated ?? ""
                let localKnownUpdated = updMap[gevent.id] ?? ""
                let googleChanged = (googleUpdated != localKnownUpdated)
                
                if let mappedLocalID = evMap[gevent.id],
                   let existingLocalEvent = eventStore.event(withIdentifier: mappedLocalID) {
                    
                    if googleChanged {
                        updateLocalEvent(existingLocalEvent, withGoogleEvent: gevent, inCalendar: localCalendar)
                    }
                    
                } else if let foundByUrl = findLocalEvent(withGoogleID: gevent.id, userID: userID) {
                    
                    if googleChanged {
                        evMap[gevent.id] = foundByUrl.eventIdentifier
                        updateLocalEvent(foundByUrl, withGoogleEvent: gevent, inCalendar: localCalendar)
                    }
                    
                } else {
                    // Create new local event
                    if let newEv = createLocalEvent(gevent, inCalendar: localCalendar) {
                        evMap[gevent.id] = newEv.eventIdentifier
                    }
                }
                
                // Always update updated-value
                updMap[gevent.id] = googleUpdated
            }
            
            setGoogleToLocalEventMap(evMap, for: userID)
            setGoogleEventUpdatedMap(updMap, for: userID)
            
            // Remove local events that no longer exist in Google
            let localEvents = fetchLocalEvents(
                in: localCalendar,
                startDate: startDate,
                endDate: endDate
            )
            for localEv in localEvents {
                if let gID = getGoogleIDFrom(localEv) {
                    if !googleEventIDsSet.contains(gID) {
                        do {
                            try eventStore.remove(localEv, span: .thisEvent, commit: true)
                            print("Removed local event:", localEv.title ?? "(No Title)")
                            
                            // Update maps
                            var newMap = googleToLocalEventMap(for: userID)
                            newMap.removeValue(forKey: gID)
                            setGoogleToLocalEventMap(newMap, for: userID)
                            
                            var newUpdMap = googleEventUpdatedMap(for: userID)
                            newUpdMap.removeValue(forKey: gID)
                            setGoogleEventUpdatedMap(newUpdMap, for: userID)
                            
                        } catch {
                            print("Error removing local event:", error.localizedDescription)
                        }
                    }
                }
            }
            
        } catch {
            print("Error fetching events for \(googleCalId):", error.localizedDescription)
        }
    }

    private func fetchAllGoogleEvents(googleCalId: String,
                                      accessToken: String,
                                      startDate: Date,
                                      endDate: Date) async throws -> [GoogleEventItem] {
        var allEvents: [GoogleEventItem] = []
        var pageToken: String? = nil
        
        repeat {
            let (events, nextToken) = try await fetchEventsPage(
                googleCalId: googleCalId,
                accessToken: accessToken,
                startDate: startDate,
                endDate: endDate,
                pageToken: pageToken
            )
            allEvents.append(contentsOf: events)
            pageToken = nextToken
        } while pageToken != nil
        
        return allEvents
    }
    
    private func fetchEventsPage(googleCalId: String,
                                 accessToken: String,
                                 startDate: Date,
                                 endDate: Date,
                                 pageToken: String?) async throws -> ([GoogleEventItem], String?) {
        let isoFormatter = ISO8601DateFormatter()
        isoFormatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let timeMin = isoFormatter.string(from: startDate)
        let timeMax = isoFormatter.string(from: endDate)
        
        let encodedCalID = googleCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalId
        
        var urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events?timeMin=\(timeMin)&timeMax=\(timeMax)&singleEvents=true&orderBy=startTime"
        if let pToken = pageToken {
            urlString += "&pageToken=\(pToken)"
        }
        
        guard let url = URL(string: urlString) else {
            throw SyncError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        if let httpResp = response as? HTTPURLResponse {
            if httpResp.statusCode == 403 || httpResp.statusCode == 429 {
                throw SyncError.rateLimit
            } else if httpResp.statusCode >= 400 {
                throw SyncError.networkError("HTTP \(httpResp.statusCode)")
            }
        }
        let eventsResp = try JSONDecoder().decode(GoogleCalendarEventsResponse.self, from: data)
        return (eventsResp.items, eventsResp.nextPageToken)
    }
    
    // MARK: - Local -> Google
    
    private func uploadLocalChangesToGoogle(googleCalId: String,
                                            userID: UUID,
                                            accessToken: String,
                                            localCalendar: EKCalendar) async {
        let oneYearAgo   = Date().addingTimeInterval(-3600*24*365)
        let oneYearAfter = Date().addingTimeInterval( 3600*24*365)
        
        let localEvents = fetchLocalEvents(in: localCalendar,
                                           startDate: oneYearAgo,
                                           endDate: oneYearAfter)
        
        let lastSync = self.lastSyncDateAll[userID.uuidString] ?? .distantPast
        let changedEvents = localEvents.filter { ev in
            guard let modDate = ev.lastModifiedDate else { return false }
            return modDate > lastSync
        }
        
        if changedEvents.isEmpty {
            // Possibly check for local deletions
            print("No local changes in \(localCalendar.title). Checking for local deletions…")
            await uploadLocalDeletionsToGoogle(googleCalId: googleCalId,
                                               userID: userID,
                                               accessToken: accessToken)
            return
        }
        
        print("Found \(changedEvents.count) local changes in \"\(localCalendar.title)\", uploading…")
        
        for event in changedEvents {
            let googleID = getGoogleIDFrom(event)
            
            if let googleID = googleID {
                // PATCH (update)
                let success = await patchEventToGoogle(event: event,
                                                       googleCalId: googleCalId,
                                                       googleEventId: googleID,
                                                       accessToken: accessToken,
                                                       userID: userID)
                if success {
                    // ...
                }
            } else {
                // POST (create)
                let success = await postEventToGoogle(event: event,
                                                      googleCalId: googleCalId,
                                                      accessToken: accessToken,
                                                      userID: userID)
                if success {
                    // ...
                }
            }
        }
        
        // Check for local deletions
        await uploadLocalDeletionsToGoogle(googleCalId: googleCalId,
                                           userID: userID,
                                           accessToken: accessToken)
        
        // Update lastSyncDate
        lastSyncDateAll[userID.uuidString] = Date()
        saveUserSyncDate(userID, date: Date())
    }

    private func uploadLocalDeletionsToGoogle(googleCalId: String,
                                              userID: UUID,
                                              accessToken: String) async {
        let oldMap = oldGoogleToLocalEventMap // snapshot before sync
        let currentMap = googleToLocalEventMap(for: userID)
        
        for (gID, localID) in oldMap {
            // If the localID no longer exists in the eventStore, that means user deleted it locally
            if eventStore.event(withIdentifier: localID) == nil {
                let success = await deleteEventFromGoogle(googleCalId: googleCalId,
                                                          googleEventId: gID,
                                                          accessToken: accessToken)
                if success {
                    var newMap = currentMap
                    newMap.removeValue(forKey: gID)
                    setGoogleToLocalEventMap(newMap, for: userID)
                    
                    var updMap = googleEventUpdatedMap(for: userID)
                    updMap.removeValue(forKey: gID)
                    setGoogleEventUpdatedMap(updMap, for: userID)
                    
                    print("Removed event \(gID) from Google because it no longer exists locally.")
                }
            }
        }
    }

    private func deleteEventFromGoogle(googleCalId: String,
                                       googleEventId: String,
                                       accessToken: String) async -> Bool {
        let encodedCalID = googleCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalId
        let encodedEvID  = googleEventId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleEventId
        
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events/\(encodedEvID)"
        guard let url = URL(string: urlString) else { return false }
        
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse,
               httpResp.statusCode >= 300 {
                print("Failed to DELETE event in Google (status = \(httpResp.statusCode))")
                return false
            }
            return true
        } catch {
            print("Error deleting event from Google:", error.localizedDescription)
            return false
        }
    }

    private func postEventToGoogle(event: EKEvent,
                                   googleCalId: String,
                                   accessToken: String,
                                   userID: UUID) async -> Bool {
        let encodedCalID = googleCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalId
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events"
        guard let url = URL(string: urlString) else { return false }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let bodyDict: [String: Any] = makeGoogleEventBody(from: event)
        request.httpBody = try? JSONSerialization.data(withJSONObject: bodyDict)
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse,
               (httpResp.statusCode < 200 || httpResp.statusCode >= 300) {
                let responseBody = String(data: data, encoding: .utf8) ?? ""
                print("POST event error, status = \(httpResp.statusCode), body = \(responseBody)")
                return false
            }
            // Success
            let createdEventResp = try JSONDecoder().decode(GoogleEventItem.self, from: data)
            let gID = createdEventResp.id
            
            event.url = URL(string: "gcal://\(gID)")
            try eventStore.save(event, span: .thisEvent, commit: true)
            
            var newMap = googleToLocalEventMap(for: userID)
            newMap[gID] = event.eventIdentifier
            setGoogleToLocalEventMap(newMap, for: userID)
            
            if let newUpdated = createdEventResp.updated {
                var updMap = googleEventUpdatedMap(for: userID)
                updMap[gID] = newUpdated
                setGoogleEventUpdatedMap(updMap, for: userID)
            }
            
            print("Created new event in Google -> \(event.title ?? "(No Title)")")
            return true
        } catch {
            print("Error POSTing to Google:", error.localizedDescription)
            return false
        }
    }

    private func patchEventToGoogle(event: EKEvent,
                                    googleCalId: String,
                                    googleEventId: String,
                                    accessToken: String,
                                    userID: UUID) async -> Bool {
        let encodedCalID = googleCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalId
        let encodedEvID  = googleEventId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleEventId
        
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events/\(encodedEvID)"
        guard let url = URL(string: urlString) else { return false }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let bodyDict: [String: Any] = makeGoogleEventBody(from: event)
        request.httpBody = try? JSONSerialization.data(withJSONObject: bodyDict, options: [])

        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse,
               (httpResp.statusCode < 200 || httpResp.statusCode >= 300) {
                let responseBody = String(data: data, encoding: .utf8) ?? ""
                print("PATCH event error, status = \(httpResp.statusCode), body = \(responseBody)")
                return false
            }
            // Success
            let updatedEventResp = try JSONDecoder().decode(GoogleEventItem.self, from: data)
            
            if let newUpdated = updatedEventResp.updated {
                var updMap = googleEventUpdatedMap(for: userID)
                updMap[googleEventId] = newUpdated
                setGoogleEventUpdatedMap(updMap, for: userID)
            }
            
            print("Updated Google event -> \(event.title ?? "(No Title)")")
            return true
        } catch {
            print("Error PATCHing to Google:", error.localizedDescription)
            return false
        }
    }
    
    // MARK: - Helper Methods
    
    private func fetchLocalEvents(in calendar: EKCalendar, startDate: Date, endDate: Date) -> [EKEvent] {
        let pred = eventStore.predicateForEvents(withStart: startDate, end: endDate, calendars: [calendar])
        return eventStore.events(matching: pred)
    }
    
    private func getGoogleIDFrom(_ localEvent: EKEvent) -> String? {
        if let urlStr = localEvent.url?.absoluteString,
           urlStr.hasPrefix("gcal://") {
            return urlStr.replacingOccurrences(of: "gcal://", with: "")
        }
        return nil
    }
    
    private func findLocalEvent(withGoogleID gID: String, userID: UUID) -> EKEvent? {
        // First, check direct map
        let evMap = googleToLocalEventMap(for: userID)
        if let localEvID = evMap[gID],
           let ev = eventStore.event(withIdentifier: localEvID) {
            return ev
        }
        // If not found, do a fallback fetch
        let oneYearAgo = Date().addingTimeInterval(-3600*24*365)
        let oneYearAfter = Date().addingTimeInterval(3600*24*365)
        
        let localCals = allCalendars.filter { $0.source.sourceType == .local }
        let pred = eventStore.predicateForEvents(withStart: oneYearAgo, end: oneYearAfter, calendars: localCals)
        let events = eventStore.events(matching: pred)
        
        return events.first(where: { $0.url?.absoluteString == "gcal://\(gID)" })
    }

    private func createLocalEvent(_ gevent: GoogleEventItem,
                                  inCalendar: EKCalendar) -> EKEvent? {
        let newEvent = EKEvent(eventStore: eventStore)
        newEvent.calendar = inCalendar
        
        newEvent.url = URL(string: "gcal://\(gevent.id)")
        
        newEvent.title = gevent.summary ?? "(No Title)"
        newEvent.notes = gevent.description
        
        if let gLocation = gevent.location, !gLocation.isEmpty {
            newEvent.location = gLocation
        }
        
        // If there's a Google Meet link
        if let meetLink = gevent.hangoutLink, !meetLink.isEmpty {
            let videoCallBlock = """
            ----( Video Call )----
            [Google Meet]
            \(meetLink)
            ---===---
            """
            let existingNotes = newEvent.notes ?? ""
            newEvent.notes = existingNotes.isEmpty
                ? videoCallBlock
                : existingNotes + "\n\n" + videoCallBlock
        }

        if let startStr = gevent.start?.date {
            newEvent.isAllDay = true
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            if let startDate = formatter.date(from: startStr) {
                newEvent.startDate = startDate
            }
            if let endStr = gevent.end?.date,
               let endDate = formatter.date(from: endStr) {
                newEvent.endDate = endDate
            }
        } else if let startStr = gevent.start?.dateTime {
            newEvent.isAllDay = false
            if let startDate = ISO8601DateFormatter().date(from: startStr) {
                newEvent.startDate = startDate
            }
            if let endStr = gevent.end?.dateTime,
               let endDate = ISO8601DateFormatter().date(from: endStr) {
                newEvent.endDate = endDate
            }
        }
        
        do {
            try eventStore.save(newEvent, span: .thisEvent, commit: true)
            print("Created local event:", newEvent.title as Any)
            return newEvent
        } catch {
            print("Error creating local event:", error.localizedDescription)
            return nil
        }
    }

    private func updateLocalEvent(_ localEvent: EKEvent,
                                  withGoogleEvent gevent: GoogleEventItem,
                                  inCalendar: EKCalendar) {
        localEvent.title = gevent.summary ?? "(No Title)"
        localEvent.notes = gevent.description
        
        if let gLocation = gevent.location, !gLocation.isEmpty {
            localEvent.location = gLocation
        } else {
            localEvent.location = nil
        }
        
        // If there's a Google Meet link
        if let meetLink = gevent.hangoutLink, !meetLink.isEmpty {
            let videoCallBlock = """
            ----( Video Call )----
            [Google Meet]
            \(meetLink)
            ---===---
            """
            let existingNotes = localEvent.notes ?? ""
            // Simple approach: just append
            if !existingNotes.contains(meetLink) {
                localEvent.notes = existingNotes.isEmpty
                    ? videoCallBlock
                    : existingNotes + "\n\n" + videoCallBlock
            }
        }
        
        localEvent.calendar = inCalendar
        if let startStr = gevent.start?.date {
            localEvent.isAllDay = true
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            if let startDate = formatter.date(from: startStr) {
                localEvent.startDate = startDate
            }
            if let endStr = gevent.end?.date,
               let endDate = formatter.date(from: endStr) {
                localEvent.endDate = endDate
            }
        } else if let startStr = gevent.start?.dateTime {
            localEvent.isAllDay = false
            if let startDate = ISO8601DateFormatter().date(from: startStr) {
                localEvent.startDate = startDate
            }
            if let endStr = gevent.end?.dateTime,
               let endDate = ISO8601DateFormatter().date(from: endStr) {
                localEvent.endDate = endDate
            }
        }
        
        if localEvent.url == nil {
            localEvent.url = URL(string: "gcal://\(gevent.id)")
        }

        do {
            try eventStore.save(localEvent, span: .thisEvent, commit: true)
            print("Updated local event:", localEvent.title as Any)
        } catch {
            print("Error updating event:", error.localizedDescription)
        }
    }
    
    private func localAllDayDateString(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }
    
    private func isoDateString(_ date: Date) -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter.string(from: date)
    }

    private func makeGoogleEventBody(from event: EKEvent) -> [String: Any] {
        if event.isAllDay {
            let startDateStr = localAllDayDateString(event.startDate)
            let endDateStr   = localAllDayDateString(event.endDate)
            return [
                "summary": event.title ?? "(No Title)",
                "description": event.notes ?? "",
                "start": ["date": startDateStr],
                "end":   ["date": endDateStr]
            ]
        } else {
            return [
                "summary": event.title ?? "(No Title)",
                "description": event.notes ?? "",
                "start": ["dateTime": isoDateString(event.startDate)],
                "end":   ["dateTime": isoDateString(event.endDate)]
            ]
        }
    }
    
    private func colorFromHexString(_ hexString: String) -> UIColor? {
        var cString = hexString.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        
        if cString.hasPrefix("#") {
            cString.removeFirst()
        }
        
        if cString.count == 6 {
            cString.append("FF")
        } else if cString.count != 8 {
            return nil
        }
        
        var rgbValue: UInt64 = 0
        guard Scanner(string: cString).scanHexInt64(&rgbValue) else {
            return nil
        }

        let r = CGFloat((rgbValue & 0xFF000000) >> 24) / 255.0
        let g = CGFloat((rgbValue & 0x00FF0000) >> 16) / 255.0
        let b = CGFloat((rgbValue & 0x0000FF00) >> 8)  / 255.0
        let a = CGFloat(rgbValue & 0x000000FF)         / 255.0
        
        return UIColor(red: r, green: g, blue: b, alpha: a)
    }
}

// MARK: - Допълнителни модели/грешки

enum SyncError: Error {
    case invalidURL
    case rateLimit
    case networkError(String)
    
    var localizedDescription: String {
        switch self {
        case .invalidURL: return "Invalid URL"
        case .rateLimit: return "Rate limit or insufficient permission"
        case .networkError(let msg): return "Network error: \(msg)"
        }
    }
}

struct GoogleCalendarListResponse: Codable {
    let kind: String
    let etag: String
    let items: [GoogleCalendarItem]
}

struct GoogleCalendarItem: Codable {
    let kind: String
    let etag: String
    let id: String
    let summary: String
    let timeZone: String?
    let colorId: String?
    let backgroundColor: String?
    let foregroundColor: String?
}

struct GoogleCalendarEventsResponse: Codable {
    let kind: String
    let etag: String
    let summary: String?
    let items: [GoogleEventItem]
    let nextPageToken: String?
}

struct GoogleEventItem: Codable {
    let kind: String
    let etag: String
    let id: String
    let status: String?
    let htmlLink: String?
    let created: String?
    let updated: String?
    let summary: String?
    let description: String?
    let location: String?
    let start: GoogleEventDate?
    let end: GoogleEventDate?
    
    let hangoutLink: String?
}

struct GoogleEventDate: Codable {
    let date: String?
    let dateTime: String?
}

// MARK: - Модел за запазване на Google токени

import Foundation

/// MARK: MULTI-ACCOUNT: Add `uniqueID: UUID` as a stable identifier
/// so we can store multiple users even if userID or email are nil/duplicated.
struct StoredGoogleUser: Codable, Hashable {
    let uniqueID: UUID
    var userID: String?
    var email: String?
    var accessToken: String
    var accessTokenExpiration: Date
    var refreshToken: String?
    var idToken: String?
    
    // Ново поле:
    var photoURL: String?  // тук ще пазим линка към снимката
}


// MARK: - Методи за StoredGoogleUser
extension CalendarViewModel {
    
    // MARK: MULTI-ACCOUNT: signOut from a single user
    func signOutFromGoogle(user: StoredGoogleUser) {
        // Първо правим signOut, за да изчистим текущия session в Google SDK (в памет)
        GIDSignIn.sharedInstance.signOut()
        
        // След това извикваме disconnect, за да изтрием refresh token‑а от keychain‑а
        GIDSignIn.sharedInstance.disconnect { error in
            print("test")
            if let error = error {
                print("Error disconnecting user: \(error.localizedDescription)")
            } else {
                print("User successfully disconnected from Google.")
            }
            
            // Тук продължаваме с премахването на акаунта от нашата логика (UserDefaults, локални календари и т.н.)
            
            // 1) Махаме локалните календари, който са копия на Google календарите за този user
            self.removeLocalGoogleCalendars(forUserID: user.uniqueID)
            
            // 2) Премахваме потребителя от масива storedUsers
            self.storedUsers.removeAll(where: { $0.uniqueID == user.uniqueID })
            
            print("storedUsers", self.storedUsers)
            
            
            // 3) Изтриваме user-специфичните речници от UserDefaults
            UserDefaults.standard.removeObject(forKey: "GoogleToLocalEventMap_\(user.uniqueID.uuidString)")
            UserDefaults.standard.removeObject(forKey: "GoogleEventUpdatedMap_\(user.uniqueID.uuidString)")
            UserDefaults.standard.removeObject(forKey: "LastSyncDateKey_\(user.uniqueID.uuidString)")
            
            // 4) Премахваме и от речниците в паметта
            self.googleToLocalEventMapAll.removeValue(forKey: user.uniqueID.uuidString)
            self.googleEventUpdatedMapAll.removeValue(forKey: user.uniqueID.uuidString)
            self.lastSyncDateAll.removeValue(forKey: user.uniqueID.uuidString)
            
            // 5) Ако вече нямаме други потребители, спираме таймера за синхронизация
            if self.storedUsers.isEmpty {
                self.stopGoogleCalendarSync()
            }
            self.saveAllUsersToUserDefaults()
            guard let data = UserDefaults.standard.data(forKey: "StoredGoogleUsers") else { return }
            do {
                let decoded = try JSONDecoder().decode([StoredGoogleUser].self, from: data)
                print("decoded", decoded)
            } catch {
                print("Failed to decode [StoredGoogleUser]:", error)
            }
            // 6) Презареждаме локалните календари
            self.reloadCalendars()
        }
    }
    
    
    private func removeLocalGoogleCalendars(forUserID userID: UUID) {
        let map = googleToLocalCalendarMap(for: userID)
        for (_, localCalID) in map {
            if let calToDelete = eventStore.calendar(withIdentifier: localCalID) {
                do {
                    try eventStore.removeCalendar(calToDelete, commit: true)
                    print("Removed local Google-copy calendar:", calToDelete.title)
                } catch {
                    print("Failed to remove local calendar:", error.localizedDescription)
                }
            }
        }
        UserDefaults.standard.removeObject(forKey: "GoogleToLocalCalendarMap_\(userID.uuidString)")
        self.googleToLocalCalendarMapAll.removeValue(forKey: userID.uuidString)
    }
    
    func refreshTokens(refreshToken: String) async throws -> (
        accessToken: String,
        expirationDate: Date,
        idToken: String?
    ) {
        print("=== refreshTokens START ===")
        let safeRefresh = String(refreshToken.prefix(6)) + "..."  // За да не печатаме целия
        print("Will refresh using refreshToken = \(safeRefresh)")
        
        guard let url = URL(string: "https://oauth2.googleapis.com/token") else {
            print("Bad URL for token endpoint!")
            throw NSError(domain: "BadURL", code: -1, userInfo: nil)
        }
        
        print("Request URL = \(url.absoluteString)")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        // Премахваме client_secret
        let postString = """
        client_id=\(clientID)&\
        refresh_token=\(refreshToken)&\
        grant_type=refresh_token
        """
        print("POST body = \(postString)")
        request.httpBody = postString.data(using: .utf8)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        // Печатаме HTTP кода и евентуално body (ако искате да видите exact отговора)
        if let httpResp = response as? HTTPURLResponse {
            print("HTTP status code = \(httpResp.statusCode)")
        }
        if let bodyString = String(data: data, encoding: .utf8) {
            print("HTTP response body:\n\(bodyString)")
        }
        
        if let httpResp = response as? HTTPURLResponse, httpResp.statusCode != 200 {
            let errMsg = String(data: data, encoding: .utf8) ?? "Unknown error"
            print("Got error response => \(errMsg)")
            throw NSError(domain: "RefreshError", code: httpResp.statusCode, userInfo: [
                NSLocalizedDescriptionKey: "HTTP \(httpResp.statusCode) - \(errMsg)"
            ])
        }

        struct RefreshResponse: Codable {
            let access_token: String
            let expires_in: Int
            let token_type: String?
            let scope: String?
            let id_token: String?
        }

        let decoded = try JSONDecoder().decode(RefreshResponse.self, from: data)
        
        let newToken = decoded.access_token
        let expiresIn = decoded.expires_in
        let newIDToken = decoded.id_token
        let newExpDate = Date().addingTimeInterval(TimeInterval(expiresIn))
        
        let safeAccess = String(newToken.prefix(6)) + "..."
        print("Successfully refreshed tokens!")
        print("New AccessToken = \(safeAccess)")
        print("ExpiresAt = \(newExpDate)")
        if let idToken = newIDToken {
            print("Got id_token as well (prefix) = \(String(idToken.prefix(6)))...")
        }
        
        print("=== refreshTokens END ===")
        return (newToken, newExpDate, newIDToken)
    }

    @MainActor
    func refreshTokensForAllUsers() async {
        print("=== refreshTokensForAllUsers START ===")
        
        for user in storedUsers {
            print("Checking user: \(user.email ?? "???" )")
            guard let refresh = user.refreshToken, !refresh.isEmpty else {
                print("No refresh token => skip this user.")
                continue
            }
            
            do {
                let (newAccessToken, newExpDate, newIDToken) = try await refreshTokens(refreshToken: refresh)
                // Създаваме нов “ъпдейтнат” потребител
                let updatedUser = StoredGoogleUser(
                    uniqueID: user.uniqueID,
                    userID:    user.userID,
                    email:     user.email,
                    accessToken: newAccessToken,
                    accessTokenExpiration: newExpDate,
                    refreshToken: refresh,  // същият refresh
                    idToken: newIDToken
                )
                // Обновяваме този потребител в масива `storedUsers`
                self.updateUserInMemory(updatedUser)
                
                print("Updated user \(user.email ?? "???" ) with new token. Expires at \(newExpDate)")
                
            } catch {
                print("Refresh tokens error за \(user.email ?? "???"): \(error.localizedDescription)")
            }
        }
        
        // Записваме всички потребители обратно в UserDefaults
        self.saveAllUsersToUserDefaults()
        print("=== refreshTokensForAllUsers END ===")
    }


}

// MARK: - Store multiple users in UserDefaults
extension CalendarViewModel {
    private func loadAllUsersFromUserDefaults() {
        guard let data = UserDefaults.standard.data(forKey: "StoredGoogleUsers") else { return }
        do {
            let decoded = try JSONDecoder().decode([StoredGoogleUser].self, from: data)
            self.storedUsers = decoded
        } catch {
            print("Failed to decode [StoredGoogleUser]:", error)
        }
    }
    
    func saveAllUsersToUserDefaults() {
        do {
            let encodedData = try JSONEncoder().encode(storedUsers)
            UserDefaults.standard.set(encodedData, forKey: "StoredGoogleUsers")
            UserDefaults.standard.synchronize()
        } catch {
            print("Failed to encode [StoredGoogleUser]:", error)
        }
    }
    
    func updateUserInMemory(_ updatedUser: StoredGoogleUser) {
        if let idx = storedUsers.firstIndex(where: { $0.uniqueID == updatedUser.uniqueID }) {
            storedUsers[idx] = updatedUser
        }
    }
    
    func getUserInMemory(_ uniqueID: UUID) -> StoredGoogleUser? {
        return storedUsers.first(where: { $0.uniqueID == uniqueID })
    }
    
    // When user signs in (new account):
    func storeGoogleUserInUserDefaults(_ gUser: GIDGoogleUser) {
        let accessToken = gUser.accessToken.tokenString
            let expiration  = gUser.accessToken.expirationDate
            let refreshTokenString = gUser.refreshToken.tokenString
            let idToken = gUser.idToken?.tokenString
            let email = gUser.profile?.email
            
            // Намираме URL на аватара
            let avatarURL = gUser.profile?.imageURL(withDimension: 96)?.absoluteString
            
            let newStoredUser = StoredGoogleUser(
                uniqueID: UUID(),
                userID: gUser.userID,
                email:  email,
                accessToken: accessToken,
                accessTokenExpiration: expiration!,
                refreshToken: refreshTokenString,
                idToken: idToken,
                photoURL: avatarURL  // записваме го
            )
            
            self.storedUsers.append(newStoredUser)
            self.saveAllUsersToUserDefaults()
        
        // Immediately load per-user maps for that user
        loadPerUserMaps(for: newStoredUser)
    }
}

// MARK: - Per-user dictionaries from UserDefaults
extension CalendarViewModel {
    func loadPerUserMaps(for user: StoredGoogleUser) {
        let userKey = user.uniqueID.uuidString
        
        let cals = UserDefaults.standard.dictionary(forKey: "GoogleToLocalCalendarMap_\(userKey)") as? [String : String] ?? [:]
        googleToLocalCalendarMapAll[userKey] = cals
        
        let evs  = UserDefaults.standard.dictionary(forKey: "GoogleToLocalEventMap_\(userKey)") as? [String : String] ?? [:]
        googleToLocalEventMapAll[userKey] = evs
        
        let upds = UserDefaults.standard.dictionary(forKey: "GoogleEventUpdatedMap_\(userKey)") as? [String : String] ?? [:]
        googleEventUpdatedMapAll[userKey] = upds
        
        let last = UserDefaults.standard.object(forKey: "LastSyncDateKey_\(userKey)") as? Date ?? .distantPast
        lastSyncDateAll[userKey] = last
    }
    
    func googleToLocalCalendarMap(for userID: UUID) -> [String : String] {
        return googleToLocalCalendarMapAll[userID.uuidString] ?? [:]
    }
    func setGoogleToLocalCalendarMap(_ newVal: [String : String], for userID: UUID) {
        googleToLocalCalendarMapAll[userID.uuidString] = newVal
        UserDefaults.standard.setValue(newVal, forKey: "GoogleToLocalCalendarMap_\(userID.uuidString)")
    }
    
    func googleToLocalEventMap(for userID: UUID) -> [String : String] {
        return googleToLocalEventMapAll[userID.uuidString] ?? [:]
    }
    func setGoogleToLocalEventMap(_ newVal: [String : String], for userID: UUID) {
        googleToLocalEventMapAll[userID.uuidString] = newVal
        UserDefaults.standard.setValue(newVal, forKey: "GoogleToLocalEventMap_\(userID.uuidString)")
    }
    
    func googleEventUpdatedMap(for userID: UUID) -> [String : String] {
        return googleEventUpdatedMapAll[userID.uuidString] ?? [:]
    }
    func setGoogleEventUpdatedMap(_ newVal: [String : String], for userID: UUID) {
        googleEventUpdatedMapAll[userID.uuidString] = newVal
        UserDefaults.standard.setValue(newVal, forKey: "GoogleEventUpdatedMap_\(userID.uuidString)")
    }
    
    func saveUserSyncDate(_ userID: UUID, date: Date) {
        lastSyncDateAll[userID.uuidString] = date
        UserDefaults.standard.set(date, forKey: "LastSyncDateKey_\(userID.uuidString)")
    }
}

// MARK: - Example for "Add Google Meet" to a specific user's event
extension CalendarViewModel {
    
    func addGoogleMeet(to localEvent: EKEvent, for user: StoredGoogleUser) {
        // Check if event is google event from that user
        guard let urlStr = localEvent.url?.absoluteString,
              urlStr.hasPrefix("gcal://") else {
            print("Event has no gcal:// link => not a google event for us.")
            return
        }
        let googleEventID = urlStr.replacingOccurrences(of: "gcal://", with: "")
        let userID = user.uniqueID
        
        // If token is expired, try refresh
        if user.accessTokenExpiration < Date() {
            if let rToken = user.refreshToken, !rToken.isEmpty {
                Task {
                    do {
                        let (newAccessToken, newExpDate, newIDToken) = try await self.refreshTokens(refreshToken: rToken)
                        let updatedUser = StoredGoogleUser(
                            uniqueID: user.uniqueID,
                            userID: user.userID,
                            email: user.email,
                            accessToken: newAccessToken,
                            accessTokenExpiration: newExpDate,
                            refreshToken: user.refreshToken,
                            idToken: newIDToken
                        )
                        self.updateUserInMemory(updatedUser)
                        self.saveAllUsersToUserDefaults()
                        
                        let success = await self.patchConferenceData(googleCalId: self.findGoogleCalID(for: localEvent, userID: userID),
                                                                     googleEventId: googleEventID,
                                                                     accessToken: newAccessToken)
                        if success {
                            self.updateLocalEventWithMeetLink(localEvent, meetLink: "...")
                        }
                    } catch {
                        print("Error refreshing/adding meet:", error.localizedDescription)
                    }
                }
            } else {
                print("No refreshToken => cannot refresh => skip.")
            }
        } else {
            // token is valid
            let accessToken = user.accessToken
            Task {
                let success = await self.patchConferenceData(googleCalId: self.findGoogleCalID(for: localEvent, userID: userID),
                                                             googleEventId: googleEventID,
                                                             accessToken: accessToken)
                if success {
                    self.updateLocalEventWithMeetLink(localEvent, meetLink: "...")
                }
            }
        }
    }
    
    private func patchConferenceData(googleCalId: String?,
                                     googleEventId: String,
                                     accessToken: String) async -> Bool {
        guard let googleCalId = googleCalId else { return false }
        
        let encodedCalID = googleCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalId
        let encodedEvID  = googleEventId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleEventId
        
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events/\(encodedEvID)?conferenceDataVersion=1"
        guard let url = URL(string: urlString) else {
            print("Invalid URL for patchConferenceData")
            return false
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=UTF-8", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "conferenceData": [
                "createRequest": [
                    "requestId": UUID().uuidString,
                    "conferenceSolutionKey": [
                        "type": "hangoutsMeet"
                    ]
                ]
            ]
        ]
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: body, options: [])
            request.httpBody = jsonData
            
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse,
               !(200...299).contains(httpResp.statusCode) {
                let errBody = String(data: data, encoding: .utf8) ?? ""
                print("Error: PATCH confData status=\(httpResp.statusCode), body=\(errBody)")
                return false
            }
            
            let updatedEvent = try JSONDecoder().decode(GoogleEventItem.self, from: data)
            if let meetLink = updatedEvent.hangoutLink {
                print("Successfully created Google Meet link:", meetLink)
            } else {
                print("No hangoutLink field in response.")
            }
            
            return true
        } catch {
            print("Error PATCH confData:", error.localizedDescription)
            return false
        }
    }
    
    private func updateLocalEventWithMeetLink(_ localEv: EKEvent, meetLink: String) {
        let videoCallBlock = """
        ----( Video Call )----
        [Google Meet]
        \(meetLink)
        ---===---
        """
        let existingNotes = localEv.notes ?? ""
        localEv.notes = existingNotes.isEmpty
            ? videoCallBlock
            : existingNotes + "\n\n" + videoCallBlock

        do {
            try eventStore.save(localEv, span: .thisEvent, commit: true)
            print("Local EKEvent updated with Google Meet link in notes.")
        } catch {
            print("Error saving local event:", error.localizedDescription)
        }
    }
    
    private func findGoogleCalID(for localEvent: EKEvent, userID: UUID) -> String? {
        // We want to find which googleCalendarId in googleToLocalCalendarMap is mapped to localEvent.calendar
        let calID = localEvent.calendar.calendarIdentifier
        let map = googleToLocalCalendarMap(for: userID)
        let reverse = map.first(where: { $0.value == calID })
        return reverse?.key
    }
    
}
extension CalendarViewModel {
    func isGoogleCalendarEvent(_ descriptor: EventDescriptor) -> Bool {
        guard let multi = descriptor as? EKMultiDayWrapper else {
            return false
        }
        let localCalendarID = multi.realEvent.calendar.calendarIdentifier
        // Събираме всички локални календар идентификатори, които са копие на *някой* Google акаунт
        let allGoogleCals = storedUsers.flatMap { googleToLocalCalendarMap(for: $0.uniqueID).values }
        return allGoogleCals.contains(localCalendarID)
    }
    
    func hasGoogleMeetLink(in descriptor: EventDescriptor) -> Bool {
        guard let multi = descriptor as? EKMultiDayWrapper else { return false }
        let event = multi.realEvent
        guard let notes = event.notes else { return false }
        return notes.contains("meet.google.com")
    }
    func findGoogleUser(for descriptor: EventDescriptor) -> StoredGoogleUser? {
        guard let multi = descriptor as? EKMultiDayWrapper else { return nil }
        let localCalendarID = multi.realEvent.calendar.calendarIdentifier
        
        // Обхождаме всички акаунти и гледаме дали техният map съдържа calendarIdentifier:
        for user in storedUsers {
            let userMap = googleToLocalCalendarMap(for: user.uniqueID)
            if userMap.values.contains(localCalendarID) {
                return user
            }
        }
        return nil
    }

}
extension CalendarViewModel {
    
    /// Добавя Google Meet линк към посоченото събитие (ако то е в Google календар).
    /// - Parameter descriptor: Вашият EventDescriptor (най-често EKMultiDayWrapper).
    func addGoogleMeet(to descriptor: EventDescriptor) {
        // 1) Проверяваме дали е EKMultiDayWrapper
        guard descriptor is EKMultiDayWrapper else {
            print("addGoogleMeet: descriptor не е EKMultiDayWrapper => отказ.")
            return
        }
        
        // 2) Намираме кой потребител притежава този локален календар
        guard let user = findGoogleUser(for: descriptor) else {
            print("addGoogleMeet: Няма Google акаунт, който да притежава това събитие => отказ.")
            return
        }
        
        // 3) Ако accessToken е изтекъл, опитваме refresh (ако имаме refreshToken)
        if user.accessTokenExpiration < Date() {
            guard let rToken = user.refreshToken, !rToken.isEmpty else {
                print("addGoogleMeet: Нямаме refreshToken => не можем да опитаме refresh => отказ.")
                return
            }
            Task {
                do {
                    let (newAccess, newExp, newID) = try await self.refreshTokens(refreshToken: rToken)
                    let updatedUser = StoredGoogleUser(
                        uniqueID: user.uniqueID,
                        userID: user.userID,
                        email: user.email,
                        accessToken: newAccess,
                        accessTokenExpiration: newExp,
                        refreshToken: user.refreshToken,
                        idToken: newID
                    )
                    // Записваме промяната в масива `storedUsers` и UserDefaults
                    self.updateUserInMemory(updatedUser)
                    self.saveAllUsersToUserDefaults()
                    
                    // Пачваме (добавяме Meet) вече с новия token
                    let success = await self.patchConferenceData(
                        descriptor: descriptor,
                        user: updatedUser
                    )
                    if success {
                        // Ако Google Meet линк е създаден, ъпдейтваме локалния EKEvent.notes
                        self.updateLocalEventWithMeetLink(descriptor)
                    }
                } catch {
                    print("addGoogleMeet: Refresh token error => \(error)")
                }
            }
        } else {
            // 4) Токенът е валиден -> директно patch-ване
            Task {
                let success = await self.patchConferenceData(
                    descriptor: descriptor,
                    user: user
                )
                if success {
                    self.updateLocalEventWithMeetLink(descriptor)
                }
            }
        }
    }
    
    /// Прави PATCH към Google Calendar API, за да добави Hangouts Meet (conferenceData)
    @MainActor
    private func patchConferenceData(
        descriptor: EventDescriptor,
        user: StoredGoogleUser
    ) async -> Bool {
        guard let multi = descriptor as? EKMultiDayWrapper else { return false }
        // Намираме googleCalendarId + googleEventId
        let localEvent = multi.realEvent
        
        // Взимаме локалния календарID, и търсим кой е Google calendarId
        guard let googleCalID = findGoogleCalID(for: localEvent, userID: user.uniqueID) else {
            print("patchConferenceData: Не откривам googleCalID за този event.")
            return false
        }
        // Извличаме googleEventId от url (gcal://...)
        guard let googleEventID = extractGoogleEventID(localEvent) else {
            print("patchConferenceData: Event няма gcal://... => отказ.")
            return false
        }
        
        let encodedCalID = googleCalID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalID
        let encodedEvID  = googleEventID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleEventID
        
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events/\(encodedEvID)?conferenceDataVersion=1"
        guard let url = URL(string: urlString) else {
            print("patchConferenceData: invalid URL => \(urlString)")
            return false
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(user.accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=UTF-8", forHTTPHeaderField: "Content-Type")
        
        // Тялото: създаваме conferenceData.createRequest с type hangoutsMeet
        let body: [String: Any] = [
            "conferenceData": [
                "createRequest": [
                    "requestId": UUID().uuidString,
                    "conferenceSolutionKey": [
                        "type": "hangoutsMeet"
                    ]
                ]
            ]
        ]
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: body)
            request.httpBody = jsonData
            
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse,
               !(200...299).contains(httpResp.statusCode) {
                let errBody = String(data: data, encoding: .utf8) ?? ""
                print("patchConferenceData: HTTP \(httpResp.statusCode), body: \(errBody)")
                return false
            }
            
            // Ако е успех, опитваме да парснем JSON за hangoutLink
            let updatedEvent = try JSONDecoder().decode(GoogleEventItem.self, from: data)
            if let meetLink = updatedEvent.hangoutLink {
                print("Success: created Google Meet link => \(meetLink)")
            } else {
                print("patchConferenceData: Успешен PATCH, но няма hangoutLink в отговора.")
            }
            return true
        } catch {
            print("patchConferenceData: Error => \(error.localizedDescription)")
            return false
        }
    }
    
    /// Вади gcal://ID от EKEvent.url
    private func extractGoogleEventID(_ event: EKEvent) -> String? {
        guard let urlStr = event.url?.absoluteString,
              urlStr.hasPrefix("gcal://") else {
            return nil
        }
        return urlStr.replacingOccurrences(of: "gcal://", with: "")
    }
    
    /// След като Google ни върне hangoutLink, добавяме го в notes на локалното събитие (ако го няма).
    func updateLocalEventWithMeetLink(_ descriptor: EventDescriptor) {
        guard let multi = descriptor as? EKMultiDayWrapper else { return }
        let localEv = multi.realEvent
        
        // Пример: Ако искате да актуализирате notes:
        let meetLink = "https://meet.google.com/????"
        // (При истинския PATCH отговор, meetLink го четете от JSON-а => updatedEvent.hangoutLink)
        
        let videoCallBlock = """
        ----( Video Call )----
        [Google Meet]
        \(meetLink)
        ---===---
        """
        let existingNotes = localEv.notes ?? ""
        if !existingNotes.contains(meetLink) {
            let newNotes = existingNotes.isEmpty
              ? videoCallBlock
              : existingNotes + "\n\n" + videoCallBlock
            localEv.notes = newNotes
            
            // Записваме в eventStore
            do {
                try eventStore.save(localEv, span: .thisEvent, commit: true)
                print("Local event updated with Google Meet link in notes.")
            } catch {
                print("updateLocalEventWithMeetLink: failed => \(error)")
            }
        }
    }
}
