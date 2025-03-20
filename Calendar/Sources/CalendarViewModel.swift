import SwiftUI
import EventKit
import Combine
import GoogleSignIn

@MainActor
final class CalendarViewModel: ObservableObject {
    
    // MARK: - EventKit Store & Properties
    let eventStore: EKEventStore = EKEventStore()

    @Published var allCalendars: [EKCalendar] = []
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID:  [String: EKEvent] = [:]

    @Published var accessGranted = false
    @Published var selectedCalendarIDs: Set<String> = []
    @Published var calendarsDict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
    
    @Published var firstLocalCalendarColor: UIColor?
    
    /// Google User (след логин)
    @Published var googleUser: GIDGoogleUser? = nil
    
    /// Timer за автоматична синхронизация
    private var syncTimer: Timer? = nil

    static let shared = CalendarViewModel()

    let calendar = Calendar(identifier: .gregorian)
    
    private var cancellables = Set<AnyCancellable>()
    
    // MARK: - За мапване Google Calendar ID -> Local Calendar ID
    private var googleToLocalCalendarMap: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: "GoogleToLocalCalendarMap") as? [String: String] ?? [:]
        }
        set {
            UserDefaults.standard.setValue(newValue, forKey: "GoogleToLocalCalendarMap")
        }
    }
    
    // MARK: - Google Event -> Local Event mapping
    private var googleToLocalEventMap: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: "GoogleToLocalEventMap") as? [String: String] ?? [:]
        }
        set {
            UserDefaults.standard.setValue(newValue, forKey: "GoogleToLocalEventMap")
        }
    }
    
    // MARK: - Тук пазим момента на последната локална синхронизация (за частичен upload)
    private var lastSyncDate: Date {
        get {
            // Ако не е записвано досега, връщаме .distantPast
            return UserDefaults.standard.object(forKey: "LastSyncDateKey") as? Date ?? .distantPast
        }
        set {
            UserDefaults.standard.set(newValue, forKey: "LastSyncDateKey")
        }
    }
    
    // MARK: - Речник за пазене на Google `updated` стойностите за всяко събитие.
    // Ключ: Google Event ID, Стойност: последната получена updated-стойност от Google.
    private var googleEventUpdatedMap: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: "GoogleEventUpdatedMap") as? [String: String] ?? [:]
        }
        set {
            UserDefaults.standard.setValue(newValue, forKey: "GoogleEventUpdatedMap")
        }
    }

    // MARK: - Init
    init() {
        // 0) Авто-възстановяване на Google сесия, ако има
        if GIDSignIn.sharedInstance.hasPreviousSignIn() {
            GIDSignIn.sharedInstance.restorePreviousSignIn { [weak self] user, error in
                guard let self = self else { return }
                Task { @MainActor in
                    if let error = error {
                        print("Failed to restore previous Google Sign In:", error.localizedDescription)
                    } else if let user = user {
                        print("Restored Google user:", user.profile?.email ?? "(no email)")
                        self.googleUser = user
                        // Стартираме syncTimer и/или правим еднократен sync
                        self.startGoogleCalendarSync()
                        await self.performGoogleCalendarSync()
                    }
                }
            }
        }

        // 1) Зареждаме локални календари
        loadLocalCalendars()
        
        // 2) Зареждаме избраните ID-та
        if let storedArray = UserDefaults.standard.array(forKey: "SelectedCalendarIDsKey") as? [String],
           !storedArray.isEmpty {
            self.selectedCalendarIDs = Set(storedArray)
        } else {
            let cals = eventStore.calendars(for: .event)
            self.selectedCalendarIDs = Set(cals.map { $0.calendarIdentifier })
        }
        
        // 3) При промяна на selectedCalendarIDs -> пазим обратно в UserDefaults
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

// MARK: - Google Sync (2‑way пример)
extension CalendarViewModel {
    
    func startGoogleCalendarSync() {
        print("Start Google Calendar sync timer...")
        syncTimer?.invalidate()
        
        // Тук Timer не е на MainActor, затова в closure-то пускаме Task
        syncTimer = Timer.scheduledTimer(withTimeInterval: 10, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            Task {
                await self.performGoogleCalendarSync()
            }
        }
    }
    
    func stopGoogleCalendarSync() {
        print("Stop Google Calendar sync timer...")
        syncTimer?.invalidate()
        syncTimer = nil
    }
    
    /// Основен метод за ДВУПОСОЧЕН sync
    func performGoogleCalendarSync() async {
        guard let user = googleUser else {
            print("No Google user, skip sync.")
            return
        }
        
        // Ако token е изтекъл, опит за refresh
        if let expirationDate = user.accessToken.expirationDate,
           expirationDate < Date() {
            print("Access token possibly expired, trying refreshTokensIfNeeded()…")
            do {
                try await refreshTokensIfNeeded(user: user)
            } catch {
                print("Refresh token error:", error.localizedDescription)
                return
            }
        }
        
        let accessToken = user.accessToken.tokenString
        
        do {
            // 1) Google -> Local
            let googleCalendars = try await fetchGoogleCalendarList(accessToken: accessToken)
            await syncGoogleCalendars(googleCalendars, accessToken: accessToken)
            
            // 2) Local -> Google (качваме само промени след lastSyncDate)
            for (gCalID, localCalID) in googleToLocalCalendarMap {
                if let localCal = eventStore.calendar(withIdentifier: localCalID) {
                    await uploadLocalChangesToGoogle(
                        googleCalId: gCalID,
                        accessToken: accessToken,
                        localCalendar: localCal
                    )
                }
            }
            
        } catch {
            print("Error in performGoogleCalendarSync:", error.localizedDescription)
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
    
    private func syncGoogleCalendars(_ googleCalendars: [GoogleCalendarItem],
                                     accessToken: String) async {
        var stillExistsGoogleCalendarIDs = Set<String>()
        
        for gcal in googleCalendars {
            let googleCalId = gcal.id
            stillExistsGoogleCalendarIDs.insert(googleCalId)
            
            let googleCalName = gcal.summary
            let googleCalColor = UIColor.systemBlue  // примерно задаваме някакъв default цвят
            
            let map = self.googleToLocalCalendarMap
            if let localCalID = map[googleCalId],
               let localEKCal = eventStore.calendar(withIdentifier: localCalID) {
                
                // Update на заглавие/цвят при нужда
                if localEKCal.title != googleCalName {
                    localEKCal.title = googleCalName
                    localEKCal.cgColor = googleCalColor.cgColor
                    do {
                        try eventStore.saveCalendar(localEKCal, commit: true)
                    } catch {
                        print("Error updating local calendar:", error.localizedDescription)
                    }
                }
                
                // Сваляме събития (Google->Local)
                await downloadAllEvents(forGoogleCalendarID: googleCalId,
                                        localCalendar: localEKCal,
                                        accessToken: accessToken)
            } else {
                // Create local
                if let newCal = createLocalCalendar(googleCalendarName: googleCalName,
                                                    googleCalendarColor: googleCalColor) {
                    var newMap = map
                    newMap[googleCalId] = newCal.calendarIdentifier
                    self.googleToLocalCalendarMap = newMap
                    
                    await downloadAllEvents(forGoogleCalendarID: googleCalId,
                                            localCalendar: newCal,
                                            accessToken: accessToken)
                }
            }
        }
        
        // Трием локални календари, които вече ги няма в Google
        let currentMap = googleToLocalCalendarMap
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
                self.googleToLocalCalendarMap = newMap
            }
        }
    }
    
    private func createLocalCalendar(googleCalendarName: String,
                                     googleCalendarColor: UIColor?) -> EKCalendar? {
        guard accessGranted else { return nil }
        
        let newCal = EKCalendar(for: .event, eventStore: eventStore)
        newCal.title = googleCalendarName
        
        // Избиране на източник (local, iCloud и т.н.)
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
    
    // MARK: !!! ТУК Е ОСНОВНАТА ПРОМЯНА !!!
    private func downloadAllEvents(forGoogleCalendarID googleCalId: String,
                                   localCalendar: EKCalendar,
                                   accessToken: String) async {
        let now = Date()
        let startDate = Calendar.current.date(byAdding: .day, value: -180, to: now)!
        let endDate   = Calendar.current.date(byAdding: .day, value: 360, to: now)!
        
        do {
            let allGEvents = try await fetchAllGoogleEvents(googleCalId: googleCalId,
                                                            accessToken: accessToken,
                                                            startDate: startDate,
                                                            endDate: endDate)
            
            let googleEventIDsSet = Set(allGEvents.map { $0.id })
            
            // Създаваме/ъпдейтваме локални събития
            for gevent in allGEvents {
                let googleUpdated = gevent.updated ?? ""
                let localKnownUpdated = googleEventUpdatedMap[gevent.id] ?? ""
                
                // Проверяваме дали Google действително е обновил събитието (updated се е сменило),
                // иначе не презаписваме локалното (за да не загубим наша промяна).
                let googleChanged = (googleUpdated != localKnownUpdated)
                
                if let mappedLocalID = googleToLocalEventMap[gevent.id],
                   let existingLocalEvent = eventStore.event(withIdentifier: mappedLocalID) {
                    
                    // Само ако Google наистина е променил (googleChanged == true), ъпдейтваме локално
                    if googleChanged {
                        updateLocalEvent(existingLocalEvent, withGoogleEvent: gevent, inCalendar: localCalendar)
                    }
                    
                } else if let foundByUrl = findLocalEvent(withGoogleID: gevent.id) {
                    
                    // Ако не сме го вкарали в googleToLocalEventMap, но го намерим по URL
                    // отново проверка googleChanged
                    if googleChanged {
                        var newMap = googleToLocalEventMap
                        newMap[gevent.id] = foundByUrl.eventIdentifier
                        googleToLocalEventMap = newMap
                        
                        updateLocalEvent(foundByUrl, withGoogleEvent: gevent, inCalendar: localCalendar)
                    }
                    
                } else {
                    // Ако изобщо не съществува локално, значи е ново Google събитие -> винаги го сваляме
                    if let newEv = createLocalEvent(gevent, inCalendar: localCalendar) {
                        var newMap = googleToLocalEventMap
                        newMap[gevent.id] = newEv.eventIdentifier
                        googleToLocalEventMap = newMap
                    }
                }
                
                // Винаги накрая записваме какво updated имаме от Google.
                var updMap = googleEventUpdatedMap
                updMap[gevent.id] = googleUpdated
                googleEventUpdatedMap = updMap
            }
            
            // Трием локалните, които липсват в Google
            let localEvents = fetchLocalEvents(in: localCalendar, startDate: startDate, endDate: endDate)
            for localEv in localEvents {
                if let gID = getGoogleIDFrom(localEv) {
                    if !googleEventIDsSet.contains(gID) {
                        do {
                            try eventStore.remove(localEv, span: .thisEvent, commit: true)
                            print("Removed local event:", localEv.title ?? "(No Title)")
                            var newMap = googleToLocalEventMap
                            newMap.removeValue(forKey: gID)
                            googleToLocalEventMap = newMap
                            
                            var updMap = googleEventUpdatedMap
                            updMap.removeValue(forKey: gID)
                            googleEventUpdatedMap = updMap
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
                                            accessToken: String,
                                            localCalendar: EKCalendar) async {
        // Пример: 1 година назад и 1 година напред
        let oneYearAgo = Date().addingTimeInterval(-3600*24*365)
        let oneYearAfter = Date().addingTimeInterval(3600*24*365)
        
        let localEvents = fetchLocalEvents(in: localCalendar,
                                           startDate: oneYearAgo,
                                           endDate: oneYearAfter)
        
        // Филтрираме само събитията, които са променени след lastSyncDate
        let changedEvents = localEvents.filter { ev in
            guard let modDate = ev.lastModifiedDate else { return false }
            return modDate > lastSyncDate
        }
        
        guard !changedEvents.isEmpty else {
            print("No local changes in calendar \(localCalendar.title). Skip uploading.")
            return
        }
        
        print("Found \(changedEvents.count) local changes in \"\(localCalendar.title)\", uploading…")
        
        for event in changedEvents {
            // Ако има google ID => PATCH/обновяване, иначе => POST/създаване
            if let googleID = getGoogleIDFrom(event) {
                // (По желание може да се направи проверка за конфликт тук, ако googleEventUpdatedMap е различен от "live" Google updated)
                let success = await patchEventToGoogle(event: event,
                                                       googleCalId: googleCalId,
                                                       googleEventId: googleID,
                                                       accessToken: accessToken)
                if success {
                    // OK
                }
            } else {
                // Нямаме googleID => ново събитие, правим POST
                let success = await postEventToGoogle(event: event,
                                                      googleCalId: googleCalId,
                                                      accessToken: accessToken)
                if success {
                    // OK
                }
            }
        }
        
        // След като приключим, ъпдейтваме lastSyncDate
        lastSyncDate = Date()
    }
    
    /// Примерна функция, която вади `updated` само за конкретно събитие от Google,
    /// ако искате "live" проверка (не винаги е нужно, ако вече сте свалили всичко).
    private func fetchGoogleEventUpdated(googleCalId: String,
                                         eventId: String,
                                         accessToken: String) async -> String? {
        let encodedCalID = googleCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalId
        let encodedEvID  = eventId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? eventId
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events/\(encodedEvID)?fields=updated"
        
        guard let url = URL(string: urlString) else { return nil }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse, httpResp.statusCode >= 300 {
                return nil
            }
            // Декодираме само "updated"
            struct TempResp: Codable {
                let updated: String
            }
            let t = try JSONDecoder().decode(TempResp.self, from: data)
            return t.updated
        } catch {
            print("Error fetching single event updated:", error.localizedDescription)
            return nil
        }
    }
    
    private func postEventToGoogle(event: EKEvent,
                                   googleCalId: String,
                                   accessToken: String) async -> Bool {
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
            // Успех (2xx)
            let createdEventResp = try JSONDecoder().decode(GoogleEventItem.self, from: data)
            let gID = createdEventResp.id
            
            event.url = URL(string: "gcal://\(gID)")
            try eventStore.save(event, span: .thisEvent, commit: true)
            
            var newMap = googleToLocalEventMap
            newMap[gID] = event.eventIdentifier
            googleToLocalEventMap = newMap
            
            // Записваме "updated" (ако го има) от отговора
            if let newUpdated = createdEventResp.updated {
                var updMap = googleEventUpdatedMap
                updMap[gID] = newUpdated
                googleEventUpdatedMap = updMap
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
                                    accessToken: String) async -> Bool {
        let encodedCalID = googleCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalId
        let encodedEvID  = googleEventId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleEventId
        
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events/\(encodedEvID)"
        guard let url = URL(string: urlString) else { return false }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let bodyDict: [String: Any] = makeGoogleEventBody(from: event)
        request.httpBody = try? JSONSerialization.data(withJSONObject: bodyDict)
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse,
               (httpResp.statusCode < 200 || httpResp.statusCode >= 300) {
                let responseBody = String(data: data, encoding: .utf8) ?? ""
                print("PATCH event error, status = \(httpResp.statusCode), body = \(responseBody)")
                return false
            }
            // Успех
            let updatedEventResp = try JSONDecoder().decode(GoogleEventItem.self, from: data)
            
            // Ако Google върне нов updated -> записваме в map
            if let newUpdated = updatedEventResp.updated {
                var updMap = googleEventUpdatedMap
                updMap[googleEventId] = newUpdated
                googleEventUpdatedMap = updMap
            }
            
            print("Updated Google event -> \(event.title ?? "(No Title)")")
            return true
        } catch {
            print("Error PATCHing to Google:", error.localizedDescription)
            return false
        }
    }
    
    // MARK: - Помощни методи
    
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
    
    private func findLocalEvent(withGoogleID gID: String) -> EKEvent? {
        if let localEvID = googleToLocalEventMap[gID],
           let ev = eventStore.event(withIdentifier: localEvID) {
            return ev
        }
        let oneYearAgo = Date().addingTimeInterval(-3600*24*365)
        let oneYearAfter = Date().addingTimeInterval(3600*24*365)
        
        let localCals = allCalendars.filter { $0.source.sourceType == .local }
        let pred = eventStore.predicateForEvents(withStart: oneYearAgo, end: oneYearAfter, calendars: localCals)
        let events = eventStore.events(matching: pred)
        
        return events.first(where: { $0.url?.absoluteString == "gcal://\(gID)" })
    }

    private func createLocalEvent(_ gevent: GoogleEventItem, inCalendar: EKCalendar) -> EKEvent? {
        let newEvent = EKEvent(eventStore: eventStore)
        newEvent.calendar = inCalendar
        newEvent.url = URL(string: "gcal://\(gevent.id)")
        
        newEvent.title = gevent.summary ?? "(No Title)"
        newEvent.notes = gevent.description

        // Проверяваме дали е all-day
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
            print("Created local event:", newEvent.title)
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
    
    /// Обвивка за refreshTokensIfNeeded (която не е нативно async)
    private func refreshTokensIfNeeded(user: GIDGoogleUser) async throws -> Void {
        try await withUnsafeThrowingContinuation { (continuation: UnsafeContinuation<Void, Error>) in
            user.refreshTokensIfNeeded { newUser, error in
                if let error = error {
                    continuation.resume(throwing: error)
                } else if let newUser = newUser {
                    self.googleUser = newUser
                    continuation.resume(returning: ())
                } else {
                    let err = NSError(
                        domain: "RefreshError",
                        code: -1,
                        userInfo: [NSLocalizedDescriptionKey: "Unknown error"]
                    )
                    continuation.resume(throwing: err)
                }
            }
        }
    }
    
    /// Връща речник [String: Any], който после се конвертира в JSON за заявката
    private func makeGoogleEventBody(from event: EKEvent) -> [String: Any] {
        if event.isAllDay {
            // Ако е all-day събитие
            let startDateStr = localAllDayDateString(event.startDate)
            let endDateStr   = localAllDayDateString(event.endDate)
            return [
                "summary": event.title ?? "(No Title)",
                "description": event.notes ?? "",
                "start": ["date": startDateStr],
                "end":   ["date": endDateStr]
            ]
        } else {
            // Нормални евенти с час
            return [
                "summary": event.title ?? "(No Title)",
                "description": event.notes ?? "",
                "start": ["dateTime": isoDateString(event.startDate)],
                "end":   ["dateTime": isoDateString(event.endDate)]
            ]
        }
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
    let updated: String?      // <--- полето "updated"
    let summary: String?
    let description: String?
    let location: String?
    let start: GoogleEventDate?
    let end: GoogleEventDate?
}

struct GoogleEventDate: Codable {
    let date: String?      // при all-day евенти
    let dateTime: String?  // при евенти с час
}
