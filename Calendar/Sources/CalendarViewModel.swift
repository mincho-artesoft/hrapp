import SwiftUI
import EventKit
import Combine
import GoogleSignIn

@MainActor
final class CalendarViewModel: ObservableObject {
    
    // MARK: - EventKit Store & Properties
    var eventStore: EKEventStore = EKEventStore()
  
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
    var googleToLocalCalendarMap: [String: String] {
        get {
            UserDefaults.standard.dictionary(forKey: "GoogleToLocalCalendarMap") as? [String: String] ?? [:]
        }
        set {
            UserDefaults.standard.setValue(newValue, forKey: "GoogleToLocalCalendarMap")
        }
    }
    
    // MARK: - Google Event -> Local Event mapping
    private var oldGoogleToLocalEventMap: [String: String]  = [:]
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
            oldGoogleToLocalEventMap = googleToLocalEventMap
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
    
    private func syncGoogleCalendars(
        _ googleCalendars: [GoogleCalendarItem],
        accessToken: String
    ) async {
        var stillExistsGoogleCalendarIDs = Set<String>()
        
        for gcal in googleCalendars {
            let googleCalId = gcal.id
            stillExistsGoogleCalendarIDs.insert(googleCalId)
            
            // Взимаме името и (ако има) backgroundColor
            let googleCalName = gcal.summary
            // Парсваме color-a, ако е наличен. Ако липсва или не е валиден, fallback = .systemBlue
            let googleCalColor = colorFromHexString(gcal.backgroundColor ?? "") ?? .systemBlue
            
            let map = self.googleToLocalCalendarMap
            if let localCalID = map[googleCalId],
               let localEKCal = eventStore.calendar(withIdentifier: localCalID) {
                
                // Проверяваме дали Google e променил името или цвета
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
                
                // Сваляме събития (Google->Local)
                await downloadAllEvents(
                    forGoogleCalendarID: googleCalId,
                    localCalendar: localEKCal,
                    accessToken: accessToken
                )
                
            } else {
                // Ако липсва локален календар за този Google календар -> създаваме нов
                if let newCal = createLocalCalendar(
                    googleCalendarName: googleCalName,
                    googleCalendarColor: googleCalColor
                ) {
                    var newMap = map
                    newMap[googleCalId] = newCal.calendarIdentifier
                    self.googleToLocalCalendarMap = newMap
                    
                    await downloadAllEvents(
                        forGoogleCalendarID: googleCalId,
                        localCalendar: newCal,
                        accessToken: accessToken
                    )
                }
            }
        }
        
        // Трием локални календари, които вече ги няма в Google...
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
            // 1) Изтегляме всички Google събития за този календар
            let allGEvents = try await fetchAllGoogleEvents(
                googleCalId: googleCalId,
                accessToken: accessToken,
                startDate: startDate,
                endDate: endDate
            )
            
            // 2) Принтираме дали имат Google Meet или не
            for gevent in allGEvents {
                if let meetLink = gevent.hangoutLink {
                    print("Event \"\(gevent.summary ?? "(no summary)")\" има Google Meet: \(meetLink)")
                } else {
                    print("Event \"\(gevent.summary ?? "(no summary)")\" НЯМА Google Meet.")
                }
            }
            
            // 3) Прехвърляме всички Google Event ID-та в Set (за по-лесно търсене по-късно)
            let googleEventIDsSet = Set(allGEvents.map { $0.id })
            
            // 4) Създаваме/ъпдейтваме локалните събития (Google -> Local)
            for gevent in allGEvents {
                let googleUpdated = gevent.updated ?? ""
                let localKnownUpdated = googleEventUpdatedMap[gevent.id] ?? ""
                
                // Проверяваме дали Google е променил събитието (updated стойността)
                let googleChanged = (googleUpdated != localKnownUpdated)
                
                // Ако вече имаме mapping (googleToLocalEventMap) -> взимаме локалното събитие
                if let mappedLocalID = googleToLocalEventMap[gevent.id],
                   let existingLocalEvent = eventStore.event(withIdentifier: mappedLocalID) {
                    
                    if googleChanged {
                        updateLocalEvent(existingLocalEvent, withGoogleEvent: gevent, inCalendar: localCalendar)
                    }
                    
                // Ако го намерим по URL (груба проверка), но не е в речника googleToLocalEventMap
                } else if let foundByUrl = findLocalEvent(withGoogleID: gevent.id) {
                    
                    if googleChanged {
                        // Обновяваме речника, за да не го търсим всеки път
                        var newMap = googleToLocalEventMap
                        newMap[gevent.id] = foundByUrl.eventIdentifier
                        googleToLocalEventMap = newMap
                        
                        updateLocalEvent(foundByUrl, withGoogleEvent: gevent, inCalendar: localCalendar)
                    }
                    
                } else {
                    // Ако локално изобщо не съществува такова събитие, създаваме го
                    if let newEv = createLocalEvent(gevent, inCalendar: localCalendar) {
                        var newMap = googleToLocalEventMap
                        newMap[gevent.id] = newEv.eventIdentifier
                        googleToLocalEventMap = newMap
                    }
                }
                
                // Винаги обновяваме локалния 'updated' отпечатък
                var updMap = googleEventUpdatedMap
                updMap[gevent.id] = googleUpdated
                googleEventUpdatedMap = updMap
            }
            
            // 5) Изтриваме локалните събития, които вече не съществуват в Google
            let localEvents = fetchLocalEvents(
                in: localCalendar,
                startDate: startDate,
                endDate: endDate
            )
            
            for localEv in localEvents {
                if let gID = getGoogleIDFrom(localEv) {
                    // Ако googleEventIDsSet не съдържа това gID => то е изтрито от Google
                    if !googleEventIDsSet.contains(gID) {
                        do {
                            try eventStore.remove(localEv, span: .thisEvent, commit: true)
                            print("Removed local event:", localEv.title ?? "(No Title)")
                            
                            // Почистете речниците
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
        // 1) Първо качваме редактираните/новите събития (както досега).
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
            print("No local changes in calendar \(localCalendar.title). Checking for deletions…")
            // Понеже нямаме промени, все пак ще проверим за изтрити.
            await uploadLocalDeletionsToGoogle(googleCalId: googleCalId, accessToken: accessToken)
            return
        }
        
        print("Found \(changedEvents.count) local changes in \"\(localCalendar.title)\", uploading…")
        
        for event in changedEvents {
            if let googleID = getGoogleIDFrom(event) {
                // PATCH (update) в Google
                let success = await patchEventToGoogle(event: event,
                                                       googleCalId: googleCalId,
                                                       googleEventId: googleID,
                                                       accessToken: accessToken)
                if success {
                    // OK
                }
            } else {
                // POST (create) в Google
                let success = await postEventToGoogle(event: event,
                                                      googleCalId: googleCalId,
                                                      accessToken: accessToken)
                if success {
                    // OK
                }
            }
        }
        
        // 2) Проверяваме и за изтрити локални събития
        await uploadLocalDeletionsToGoogle(googleCalId: googleCalId, accessToken: accessToken)
        
        // 3) Накрая ъпдейтваме lastSyncDate
        lastSyncDate = Date()
    }

    private func uploadLocalDeletionsToGoogle(googleCalId: String, accessToken: String) async {
        for (gID, localID) in oldGoogleToLocalEventMap {
            
            // Проверка: calendarIdentifier на това събитие съвпада ли с този googleCalId?
            // Всъщност, ако имате 1:1 връзка googleCalId -> localCalendar, може да филтрирате по него.
            // Но често googleToLocalEventMap няма нужда от допълнителна проверка, стига да знаете в кой метод се вика.
            
            if eventStore.event(withIdentifier: localID) == nil {
                // Локалното събитие е изтрито, а в googleToLocalEventMap все още има връзка към Google.
                let success = await deleteEventFromGoogle(googleCalId: googleCalId,
                                                          googleEventId: gID,
                                                          accessToken: accessToken)
                if success {
                    // Ако сме изтрили успешно, махаме го и от речниците
                    var newMap = googleToLocalEventMap
                    newMap.removeValue(forKey: gID)
                    googleToLocalEventMap = newMap
                    
                    var updMap = googleEventUpdatedMap
                    updMap.removeValue(forKey: gID)
                    googleEventUpdatedMap = updMap
                    
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
            
            // Успешно (статус 204 или 200)
            return true
            
        } catch {
            print("Error deleting event from Google:", error.localizedDescription)
            return false
        }
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

    private func createLocalEvent(_ gevent: GoogleEventItem,
                                  inCalendar: EKCalendar) -> EKEvent? {
        let newEvent = EKEvent(eventStore: eventStore)
        newEvent.calendar = inCalendar
        
        // Сетваме URL, за да знаем, че това е "gcal://<someID>"
        newEvent.url = URL(string: "gcal://\(gevent.id)")
        
        // Title & description
        newEvent.title = gevent.summary ?? "(No Title)"
        newEvent.notes = gevent.description
        
        // Ако Google има location
        if let gLocation = gevent.location, !gLocation.isEmpty {
            newEvent.location = gLocation
        }
        
        // Ако има Google Meet линк
        if let meetLink = gevent.hangoutLink, !meetLink.isEmpty {
            let videoCallBlock = """
            ----( Video Call )----
            [Google Meet]
            \(meetLink)
            ---===---
            """
            // Добавяме го в notes (в случая - на нов ред под описанието)
            let existingNotes = newEvent.notes ?? ""
            newEvent.notes = existingNotes.isEmpty
                ? videoCallBlock
                : existingNotes + "\n\n" + videoCallBlock
        }

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
            
        // Или dateTime (нормално събитие с час)
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
        localEvent.notes = gevent.description  // Първо презаписваме описание
        
        // Сетваме location, ако има
        if let gLocation = gevent.location, !gLocation.isEmpty {
            localEvent.location = gLocation
        } else {
            localEvent.location = nil
        }
        
        // Ако има Google Meet линк - добавяме го в notes
        if let meetLink = gevent.hangoutLink, !meetLink.isEmpty {
            let videoCallBlock = """
            ----( Video Call )----
            [Google Meet]
            \(meetLink)
            ---===---
            """
            let existingNotes = localEvent.notes ?? ""
            localEvent.notes = existingNotes.isEmpty
                ? videoCallBlock
                : existingNotes + "\n\n" + videoCallBlock
        }
        
        // Примерен подход: Ако искате да **не** презаписвате `notes` изцяло по-горе,
        // а само да добавите Meet линка, трябва да комбинирате описанието + блока.
        // Тук, за простота, показвам overwrite на notes със gevent.description,
        // после добавям MeetLink. Ако ви е нужно друго, нагласете логиката.

        // Ъпдейт на start/end
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
        
        // Ако локалното събитие досега е нямало url, а Google има ID, сетваме
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
    private func colorFromHexString(_ hexString: String) -> UIColor? {
        var cString = hexString.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        
        // Премахваме # ако има
        if cString.hasPrefix("#") {
            cString.removeFirst()
        }
        
        // Ако е 6-символен хекс, добавяме FF за алфа канал
        if cString.count == 6 {
            cString.append("FF")
        }
        // Ако не е 8 => невалиден хекс
        else if cString.count != 8 {
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
    let updated: String?      // <--- полето "updated"
    let summary: String?
    let description: String?
    let location: String?
    let start: GoogleEventDate?
    let end: GoogleEventDate?
    
    // Добавяме това:
    let hangoutLink: String?  // <--- Google Meet линк (ако има)
}


struct GoogleEventDate: Codable {
    let date: String?      // при all-day евенти
    let dateTime: String?  // при евенти с час
}
extension CalendarViewModel {
    func signOutFromGoogle() {
        // 1) Извеждаме потребителя от Google
        GIDSignIn.sharedInstance.signOut()
        
        // 2) Нулираме googleUser
        self.googleUser = nil
        
        // 3) Спираме syncTimer
        self.stopGoogleCalendarSync()
        
        // 4) Трием локалните календари, който са копие на Google
        let currentMap = self.googleToLocalCalendarMap
        for (_, localCalID) in currentMap {
            if let calToDelete = eventStore.calendar(withIdentifier: localCalID) {
                do {
                    try eventStore.removeCalendar(calToDelete, commit: true)
                    print("Removed local Google-copy calendar:", calToDelete.title)
                } catch {
                    print("Failed to remove local calendar:", error.localizedDescription)
                }
            }
        }
        
        // 5) Изчистваме речниците
        self.googleToLocalCalendarMap = [:]
        self.googleToLocalEventMap   = [:]
        self.googleEventUpdatedMap   = [:]
        
        // 6) Презареждаме всичко
        self.reloadCalendars()
    }
    public func isGoogleCalendarEvent(_ descriptor: EventDescriptor) -> Bool {
        guard let multi = descriptor as? EKMultiDayWrapper else {
            // Ако не е EKMultiDayWrapper, няма реален EKEvent
            return false
        }
        let realEKEvent = multi.realEvent
        
        // 1) Проверка дали "calendarIdentifier" на събитието съществува в googleToLocalCalendarMap.values
        let googleLocalIDs = CalendarViewModel.shared.googleToLocalCalendarMap.values
        if googleLocalIDs.contains(realEKEvent.calendar.calendarIdentifier) {
            return true
        }
        return false
    }
    func findGoogleIDs(for descriptor: EventDescriptor) -> (calID: String, eventID: String)? {
        guard let multi = descriptor as? EKMultiDayWrapper else { return nil }
        let localEvent = multi.realEvent
        
        // Ако сте си пазили URL:
        // localEvent.url = gcal://<googleEventID>
        guard let urlStr = localEvent.url?.absoluteString,
              urlStr.hasPrefix("gcal://")
        else {
            return nil
        }
        let googleEventID = urlStr.replacingOccurrences(of: "gcal://", with: "")
        
        // А за calendarID:
        // Ако сте си пазили в речник googleToLocalCalendarMap:
        //   googleToLocalCalendarMap[gCalID] = localCalendarID
        // Тук localCalendarID = localEvent.calendar.calendarIdentifier
        // Трябва да намерим ключа "gCalID"
        
        let localCalID = localEvent.calendar.calendarIdentifier
        // Търсим кой Google Calendar ID съответства
        let reverse = CalendarViewModel.shared.googleToLocalCalendarMap
            .filter { $0.value == localCalID }
        guard let (gCalID, _) = reverse.first else {
            return nil
        }
        
        return (gCalID, googleEventID)
    }
    func addGoogleMeet(to descriptor: EventDescriptor) {
        // 1) Намираме googleCalId & googleEventId
        guard let (googleCalId, googleEventId) = findGoogleIDs(for: descriptor) else {
            print("Нямаме Google IDs за това събитие.")
            return
        }
        // 2) Проверяваме имаме ли Google User & accessToken
        guard let user = CalendarViewModel.shared.googleUser else {
            print("Нямаме googleUser => не можем да добавим Meet.")
            return
        }
        let accessToken = user.accessToken.tokenString
        
        // 3) Правим PATCH заявка
        Task {
            // Пробваме да refresh-нем, в случай че е изтекъл
            do { try await refreshTokensIfNeeded(user: user) } catch { /*...*/ }
            
            let success = await self.patchConferenceData(
                googleCalId: googleCalId,
                googleEventId: googleEventId,
                accessToken: accessToken
            )
            
            if success {
                // Ако е success, Google е създал Hangouts Meet линк.
                // Обновяваме локалното EKEvent (notes).
                 self.updateLocalEventWithMeetLink(descriptor)
            }
        }
    }
    private func patchConferenceData(googleCalId: String,
                                     googleEventId: String,
                                     accessToken: String) async -> Bool {
        // URL:
        //   PATCH /calendars/<calId>/events/<evId>?conferenceDataVersion=1
        // Тялото:
        // {
        //   "conferenceData": {
        //     "createRequest": {
        //       "requestId": "some-unique-string",
        //       "conferenceSolutionKey": {
        //         "type": "hangoutsMeet"
        //       }
        //     }
        //   }
        // }

        let encodedCalID = googleCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalId
        let encodedEvID  = googleEventId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleEventId
        
        var urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events/\(encodedEvID)?conferenceDataVersion=1"
        guard let url = URL(string: urlString) else {
            print("Invalid URL")
            return false
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=UTF-8", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "conferenceData": [
                "createRequest": [
                    "requestId": UUID().uuidString,           // трябва да е уникално
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
            
            // Ако е успешен (2xx), Google връща пълен JSON с event (вкл. conferenceData, hangoutLink и пр.)
            // Можем да го декодираме, за да видим hangoutLink:
            let updatedEvent = try JSONDecoder().decode(GoogleEventItem.self, from: data)
            if let meetLink = updatedEvent.hangoutLink {
                print("Successfully created Google Meet link:", meetLink)
            } else {
                // Понякога е в updatedEvent.conferenceData?.entryPoints?
                print("No hangoutLink field in response, might be in .conferenceData.entryPoints")
            }
            
            return true
            
        } catch {
            print("Error PATCH confData:", error.localizedDescription)
            return false
        }
    }
    @MainActor
    private func updateLocalEventWithMeetLink(_ descriptor: EventDescriptor) {
        guard let multi = descriptor as? EKMultiDayWrapper else { return }
       
        
        // 1) отново fetch-вате event (за да сме сигурни, че е актуален)
        guard let localEv = eventStore.event(withIdentifier: multi.realEvent.eventIdentifier) else {
            return
        }
        
        // 2) Да кажем, че сме запазили meetLink в някакво свойство (или сте го върнали от patchConferenceData).
        let meetLink = "https://meet.google.com/abc-defg-hjk"  // <-- ако сте го взели от PATCH
        
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
            
            // И ако искате -> извиквате self.onEventDeleted?(descriptor)
            // или reloadCurrentRange?
            // Зависи от логиката ви
        } catch {
            print("Error saving local event:", error.localizedDescription)
        }
    }
    // Примерна функция, която проверява дали в notes има "Google Meet" линк
    func hasGoogleMeetLink(in descriptor: EventDescriptor) -> Bool {
        guard let multi = descriptor as? EKMultiDayWrapper else { return false }
        let event = multi.realEvent
        guard let notes = event.notes else { return false }
        // Търсим "hangout" или "meet.google.com" (по избор)
        return notes.contains("meet.google.com") // или "Video Call" и т.н.
    }

}
