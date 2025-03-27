import SwiftUI
import EventKit
import Combine
import GoogleSignIn
import MSAL

@MainActor
final class CalendarViewModel: ObservableObject {
    private var msSyncTimer: Timer?

    let kClientID = "5b1a5159-948f-4b5b-ac6a-009df927c665"
    let kRedirectUri = "msauth.Deksan.CalendarASD://auth"
    let kAuthority = "https://login.microsoftonline.com/common"
    let kGraphEndpoint = "https://graph.microsoft.com/"
    
    @Published var storedMsUsers: [StoredMicrosoftUser] = []
       
       // For 2-way sync, you can keep analogous dictionary maps:
   private var msToLocalCalendarMapAll: [String : [String : String]] = [:]  // [userKey: [msCalendarID : localCalendarID]]
   private var msToLocalEventMapAll:    [String : [String : String]] = [:]
   private var msEventUpdatedMapAll:    [String : [String : String]] = [:]
   private var msLastSyncDateAll:       [String : Date] = [:]
    private var oldMsToLocalEventMap: [String : String] = [:]

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
        
        // load MS users
       loadAllMsUsersFromUserDefaults()
       
       // load per-user MS dictionary maps
       for user in storedMsUsers {
           loadPerMsUserMaps(for: user)
       }
       
       // Possibly start an MS sync timer as well
       startMicrosoftCalendarSync()
        
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
        NotificationCenter.default.addObserver(
               self,
               selector: #selector(handleEventStoreChanged(_:)),
               name: .EKEventStoreChanged,
               object: eventStore
           )

           // Първоначално зареждане на локални събития и запис в oldEventCalendarMap
           loadAndStoreCurrentEvents()
    }
    
    deinit {
        syncTimer?.invalidate()
    }

    private var oldEventCalendarMap: [String: String] = [:]  // eventID -> calendarID

    func loadAndStoreCurrentEvents() {
        // Пример: взимаме всички локални календари, или разрешените от потребителя
        let allowedCalendars = eventStore.calendars(for: .event)
            .filter { selectedCalendarIDs.contains($0.calendarIdentifier) }

        // Правим predicate за някакъв обхват
        let start = Date().addingTimeInterval(-3600 * 24 * 30) // 1 месец назад
        let end   = Date().addingTimeInterval(3600 * 24 * 180) // 6 месеца напред
        let pred = eventStore.predicateForEvents(withStart: start, end: end, calendars: allowedCalendars)
        let events = eventStore.events(matching: pred)
        
        // Изчистваме стария речник и записваме нов
        var tmp: [String: String] = [:]
        for ev in events {
            // eventIdentifier може да е nil, макар и рядко, затова check-нете
            if let evID = ev.eventIdentifier {
                tmp[evID] = ev.calendar.calendarIdentifier
            }
        }
        oldEventCalendarMap = tmp
    }
    @objc private func handleEventStoreChanged(_ notification: Notification) {
        // 1) Презареждаме евентите (в подходящ диапазон + филтрирани календари)
        let allowedCalendars = eventStore.calendars(for: .event)
            .filter { selectedCalendarIDs.contains($0.calendarIdentifier) }

        let start = Date().addingTimeInterval(-3600 * 24 * 30) // 1 месец назад
        let end   = Date().addingTimeInterval( 3600 * 24 * 180) // 6 месеца напред
        let pred = eventStore.predicateForEvents(withStart: start, end: end, calendars: allowedCalendars)
        let events = eventStore.events(matching: pred)

        // 2) Строим нов snapshot (eventID -> calendarID) от текущите събития
        var newEventCalendarMap: [String: String] = [:]

        for ev in events {
            guard let evID = ev.eventIdentifier else { continue }
            
            let newCalID = ev.calendar.calendarIdentifier
            newEventCalendarMap[evID] = newCalID
            
            // Сравняваме с това, което сме запомнили досега (oldEventCalendarMap)
            if let oldCalID = oldEventCalendarMap[evID], oldCalID != newCalID {
                // => Евентът е преместен от oldCalID към newCalID!
                Task {
                    // 1) Проверяваме дали старият календар е Google (и ако да, кой userID + googleCalID)
                    let oldGoogleInfo = findGoogleCalID(forLocalCalID: oldCalID)
                    // 2) Проверяваме дали новият календар е Google
                    let newGoogleInfo = findGoogleCalID(forLocalCalID: newCalID)
                    
                    // 3) Еvent може да има url="gcal://someGoogleEventID". Вземаме го:
                    let maybeGEventID = extractGoogleEventID(ev)

                    switch (oldGoogleInfo, newGoogleInfo) {
                        
                    // ---------------------------
                    // 1) Старият = Google, Новият = Google
                    // ---------------------------
                    case let (.some((oldUserID, oldGoogleCalID)), .some((newUserID, newGoogleCalID))):

                        // Ако това е един и същ Google акаунт и имаме googleEventID => MOVE
                        if oldUserID == newUserID, let googleEventID = maybeGEventID {
                            
                            guard let user = getUserInMemory(oldUserID) else { return }
                            // Ако token е изтекъл => refreshTokens(...) (пропускаме тук за краткост)
                            
                            // 1) Преместваме (move)
                            let successMove = await moveEventInGoogle(
                                googleEventID: googleEventID,
                                oldGoogleCalID: oldGoogleCalID,
                                newGoogleCalID: newGoogleCalID,
                                accessToken: user.accessToken
                            )
                            if successMove {
                                print("Успешно преместен евент (Google → Google) с moveEventInGoogle.")
                                // 2) Пачваме (patchEventToGoogle), за да качим и другите промени (заглавие, дати...)
                                let successPatch = await patchEventToGoogle(
                                    event: ev,
                                    googleCalId: newGoogleCalID,
                                    googleEventId: googleEventID,
                                    accessToken: user.accessToken,
                                    userID: user.uniqueID
                                )
                                if successPatch {
                                    print("Patch успешен, евентът е обновен в новия календар (заглавие, време и пр.).")
                                }
                            }

                        } else {
                            // => Различни акаунти (или maybeGEventID е nil) => изтриваме от стария + създаваме в новия
                            // (a) Delete
                            if let googleEventID = maybeGEventID,
                               let oldUser = getUserInMemory(oldUserID) {
                                _ = await deleteEventFromGoogle(
                                    googleCalId: oldGoogleCalID,
                                    googleEventId: googleEventID,
                                    accessToken: oldUser.accessToken
                                )
                                print("Изтрит евент от стария акаунт (Google).")
                            }
                            // (b) Create
                            if let newUser = getUserInMemory(newUserID) {
                                _ = await postEventToGoogle(
                                    event: ev,
                                    googleCalId: newGoogleCalID,
                                    accessToken: newUser.accessToken,
                                    userID: newUser.uniqueID
                                )
                                print("Създаден евент в новия акаунт (Google).")
                            }
                        }
                        
                    // ---------------------------
                    // 2) Старият = Google, Новият = Не-Google
                    // ---------------------------
                    case let (.some((oldUserID, oldGoogleCalID)), .none):
                        // => Трябва да го изтрием от Google, защото вече е локален
                        if let googleEventID = maybeGEventID,
                           let oldUser = getUserInMemory(oldUserID) {
                            _ = await deleteEventFromGoogle(
                                googleCalId: oldGoogleCalID,
                                googleEventId: googleEventID,
                                accessToken: oldUser.accessToken
                            )
                            print("Изтрит евент от Google (преместване към не-Google календар).")
                        }
                        
                    // ---------------------------
                    // 3) Старият = Не-Google, Новият = Google
                    // ---------------------------
                    case let (.none, .some((newUserID, newGoogleCalID))):
                        // => Създаваме ново събитие в Google
                        if let newUser = getUserInMemory(newUserID) {
                            _ = await postEventToGoogle(
                                event: ev,
                                googleCalId: newGoogleCalID,
                                accessToken: newUser.accessToken,
                                userID: newUser.uniqueID
                            )
                            print("Създаден евент в Google (преместен от локален).")
                        }
                        
                    // ---------------------------
                    // 4) И старият, и новият = НЕ-Google
                    // ---------------------------
                    case (.none, .none):
                        // => Не засяга Google, не правим нищо
                        break
                    }
                }

                // Тук за debug отпечатваме, че събитието е преместено:
                let oldCalName = eventStore.calendar(withIdentifier: oldCalID)?.title ?? "(неизвестен)"
                let newCalName = ev.calendar.title
                print("Събитие ‘\(ev.title ?? "Без заглавие")’ беше преместено от ‘\(oldCalName)’ в ‘\(newCalName)’")
            }
        }

        // Проверяваме дали някой евент от стария snapshot го няма вече => може би е изтрит:
        for oldEvID in oldEventCalendarMap.keys {
            if newEventCalendarMap[oldEvID] == nil {
                print("Събитие с ID=\(oldEvID) е изчезнало => вероятно е изтрито.")
                // Ако е било Google => може да викнете deleteEventFromGoogle...
            }
        }

        // 3) Накрая запомняме новата снимка
        oldEventCalendarMap = newEventCalendarMap
    }



    /// Връща true, ако `calendarIdentifier` е локален календар,
    /// който е "копие" на някой Google Calendar за НЯКОЙ от потребителите
    func isGoogleLocalCalendar(_ calendarIdentifier: String) -> Bool {
        for (_, googleMap) in googleToLocalCalendarMapAll {
            // googleMap е [googleCalID: localCalID]
            if googleMap.values.contains(calendarIdentifier) {
                return true
            }
        }
        return false
    }
    /// Премества Google-събитие от oldGoogleCalID към newGoogleCalID
    /// (запазва същия googleEventID). Връща `true` при успех.
    func moveEventInGoogle(
        googleEventID: String,
        oldGoogleCalID: String,
        newGoogleCalID: String,
        accessToken: String
    ) async -> Bool {
        // Енкодираме CalendarID и EventID за URL
        let encOldCalID = oldGoogleCalID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? oldGoogleCalID
        let encEvID     = googleEventID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleEventID
        let endpoint = "https://www.googleapis.com/calendar/v3/calendars/\(encOldCalID)/events/\(encEvID)/move?destination=\(newGoogleCalID)"
        
        guard let url = URL(string: endpoint) else {
            print("moveEventInGoogle: Invalid URL!")
            return false
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse, !(200...299).contains(httpResp.statusCode) {
                let body = String(data: data, encoding: .utf8) ?? ""
                print("moveEventInGoogle failed: status=\(httpResp.statusCode), body=\(body)")
                return false
            }
            print("moveEventInGoogle: success.")
            return true
        } catch {
            print("moveEventInGoogle error: \(error)")
            return false
        }
    }

    func extractGoogleEventID(_ event: EKEvent) -> String? {
        guard let urlStr = event.url?.absoluteString,
              urlStr.hasPrefix("gcal://") else {
            return nil
        }
        return urlStr.replacingOccurrences(of: "gcal://", with: "")
    }

    func findGoogleCalID(forLocalCalID localCalID: String) -> (UUID, String)? {
        // googleToLocalCalendarMapAll е [ userKeyString : [googleCalID : localCalID] ]
        for (userKey, map) in googleToLocalCalendarMapAll {
            // userKey е String = userID.uuidString
            guard let uuid = UUID(uuidString: userKey) else { continue }
            
            // map е [googleCalendarID : localCalendarID]
            // търсим дали localCalID съвпада с някоя от стойностите
            // напр. ("primary" : "123-ABCD-LOCALCAL")
            if let foundPair = map.first(where: { $0.value == localCalID }) {
                // foundPair.key  = googleCalendarID
                // foundPair.value= localCalendarID
                return (uuid, foundPair.key)
            }
        }
        return nil // не е Google календар
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
                        idToken: newIDToken,
                        photoURL: user.photoURL
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

    private func postEventToGoogle(
        event: EKEvent,
        googleCalId: String,
        accessToken: String,
        userID: UUID
    ) async -> Bool {
        // 1) Добавяме "?conferenceDataVersion=1" към URL-а
        let encodedCalID = googleCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? googleCalId
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalID)/events?conferenceDataVersion=1"
        guard let url = URL(string: urlString) else { return false }

        // 2) Подготвяме request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // 3) Създаваме тялото на заявката
        var bodyDict: [String: Any] = makeGoogleEventBody(from: event)
        // Добавяме conferenceData, за да се генерира Meet линк
        bodyDict["conferenceData"] = [
            "createRequest": [
                "requestId": UUID().uuidString, // нещо уникално, може и random низ
                "conferenceSolutionKey": [
                    "type": "hangoutsMeet"
                ]
            ]
        ]

        // 4) Сериализираме в JSON и прикачваме
        request.httpBody = try? JSONSerialization.data(withJSONObject: bodyDict, options: [])

        do {
            // 5) Изпращаме заявката
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse,
               (httpResp.statusCode < 200 || httpResp.statusCode >= 300) {
                let responseBody = String(data: data, encoding: .utf8) ?? ""
                print("POST event error, status = \(httpResp.statusCode), body = \(responseBody)")
                return false
            }

            // 6) Ако е успех, декодираме резултата
            let createdEventResp = try JSONDecoder().decode(GoogleEventItem.self, from: data)
            let gID = createdEventResp.id

            // Записваме gcal://... в локалния EKEvent
            event.url = URL(string: "gcal://\(gID)")

            // 7) Ако има hangoutLink => добавяме го в локалния EKEvent (напр. в notes)
            if let meetLink = createdEventResp.hangoutLink, !meetLink.isEmpty {
                print("Успешно създадохме Google Meet линк:", meetLink)
                self.updateLocalEventWithMeetLink(event, meetLink: meetLink)
            }

            // 8) Записваме събитието локално
            try eventStore.save(event, span: .thisEvent, commit: true)

            // 9) Обновяваме речниците googleToLocalEventMap/updatedMap и т.н.
            var newMap = googleToLocalEventMap(for: userID)
            newMap[gID] = event.eventIdentifier
            setGoogleToLocalEventMap(newMap, for: userID)

            if let updatedTime = createdEventResp.updated {
                var updMap = googleEventUpdatedMap(for: userID)
                updMap[gID] = updatedTime
                setGoogleEventUpdatedMap(updMap, for: userID)
            }

            print("Създадохме ново Google събитие + Meet за ‘\(event.title ?? "(No title)")’.")
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
    private func removeVideoCallBlock(from notes: String) -> String {
        // 1) Пишем RegEx шаблон:
        //    - "----\( Video Call \)----" (буквално)
        //    - [\s\S]*? (всички символи, жадно, докато не срещне...)
        //    - "---===---"
        //    Разликата между [\s\S] и . (dot) e, че [\s\S] мачва и нови редове.
        let pattern = #"----\( Video Call \)----[\s\S]*?---===---"#

        do {
            let regex = try NSRegularExpression(pattern: pattern, options: [])
            let range = NSRange(notes.startIndex..., in: notes)
            // Глобално заменяме всички срещания с празен низ:
            let cleaned = regex.stringByReplacingMatches(in: notes, options: [], range: range, withTemplate: "")
            // Също може да подрежем водещи/завършващи whitespace:
            let trimmed = cleaned.trimmingCharacters(in: .whitespacesAndNewlines)
            return trimmed
        } catch {
            // Ако нещо стане, връщаме оригиналния notes
            return notes
        }
    }
    private func makeGoogleEventBody(from event: EKEvent) -> [String: Any] {
        print("event.notes")
        
        // 1) Вие вече правите RegEx и създавате масив `attendees: [Attendee]`.
        let input = event.attendees?.description ?? ""
        let pattern = #"""
        UUID\s*=\s*(.*?);\s*name\s*=\s*(.*?);\s*email\s*=\s*(.*?);\s*phone\s*=\s*\((.*?)\);\s*status\s*=\s*(\d+);\s*role\s*=\s*(\d+);\s*type\s*=\s*(\d+)
        """#

        guard let regex = try? NSRegularExpression(pattern: pattern, options: []) else {
            fatalError("Невалиден регулярен израз.")
        }

        let nsrange = NSRange(input.startIndex..<input.endIndex, in: input)
        let matches = regex.matches(in: input, options: [], range: nsrange)

        var attendees: [Attendee] = []

        for match in matches {
            func getGroup(_ index: Int) -> String {
                let range = match.range(at: index)
                guard let swiftRange = Range(range, in: input) else { return "" }
                return String(input[swiftRange])
            }

            let uuid   = getGroup(1)
            let name   = getGroup(2)
            let email  = getGroup(3)
            let phoneString = getGroup(4)
            let status = Int(getGroup(5)) ?? 0
            let role   = Int(getGroup(6)) ?? 0
            let type   = Int(getGroup(7)) ?? 0
            
            let phone: String? = (phoneString == "null") ? nil : phoneString
            
            let attendee = Attendee(uuid: uuid,
                                    name: name,
                                    email: email,
                                    phone: phone,
                                    status: status,
                                    role: role,
                                    type: type)
            attendees.append(attendee)
        }

        // 2) Сега можете да отпечатате / debug-нете, ако желаете:
        for a in attendees {
            if a.email != GlobalState.email {
                print("Will share event with => \(a.email)")
            }
        }

        // === НАЙ-ВАЖНО ===
        // 3) Тук превръщаме подходящите Attendee обекти в JSON “attendees” за Google
        var googleAttendeeDicts: [[String: Any]] = []
        for a in attendees {
            guard a.email != GlobalState.email else {
                continue // пропускаме "основния" имейл
            }
            // Можем да подадем само "email", или да добавим "displayName", "optional", etc.
            let dict: [String: Any] = [
                "email": a.email,
                "displayName": a.name,
                // Ако искате да ги бележите като “необходими” или “опционални”:
                "optional": false
                // Може да зададете responseStatus: "needsAction", ако искате.
            ]
            googleAttendeeDicts.append(dict)
        }
        
        // == КРАЙ на attendees ==

        // Почистваме notes от VideoCall блок
        let originalNotes = event.notes ?? ""
        let sanitizedNotes = removeVideoCallBlock(from: originalNotes)

        if event.isAllDay {
            let startDateStr = localAllDayDateString(event.startDate)
            let endDateStr   = localAllDayDateString(event.endDate)

            // 4) Връщаме новия body, в който слагаме "attendees" масива
            return [
                "summary": event.title ?? "(No Title)",
                "description": sanitizedNotes,
                "start": ["date": startDateStr],
                "end":   ["date": endDateStr],
                // Ето го attendees:
                "attendees": googleAttendeeDicts
            ]
        } else {
            return [
                "summary": event.title ?? "(No Title)",
                "description": sanitizedNotes,
                "start": ["dateTime": isoDateString(event.startDate)],
                "end":   ["dateTime": isoDateString(event.endDate)],
                // Ето го attendees:
                "attendees": googleAttendeeDicts
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
    var photoURL: String?
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
        
//        // Печатаме HTTP кода и евентуално body (ако искате да видите exact отговора)
//        if let httpResp = response as? HTTPURLResponse {
//            print("HTTP status code = \(httpResp.statusCode)")
//        }
//        if let bodyString = String(data: data, encoding: .utf8) {
//            print("HTTP response body:\n\(bodyString)")
//        }
        
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
                    idToken: newIDToken,
                    photoURL : user.photoURL
                    
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
            print("saveAllUsersToUserDefaults",storedUsers)
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
                photoURL: avatarURL!  // записваме го
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
                            idToken: newIDToken,
                            photoURL: user.photoURL
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
                        idToken: newID,
                        photoURL: user.photoURL
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
/// MARK: - Microsoft user model
struct StoredMicrosoftUser: Codable, Hashable {
    let uniqueID: UUID  // internal stable ID for app
    var msAccountID: String?  // e.g., "xxxx-xxxx..." from Microsoft
    var email: String?
    
    var accessToken: String
    var accessTokenExpiration: Date
    var refreshToken: String?
    
    // Possibly store the ID token, photoURL, displayName, etc.
    var idToken: String?
    var avatarURL: String?
}
extension CalendarViewModel {
    // Примерен метод за логин
    func signInWithMicrosoft() {
        do {
            let authorityURL = URL(string: kAuthority)!
            let msalConfig = MSALPublicClientApplicationConfig(
                clientId: kClientID,
                redirectUri: kRedirectUri,
                authority: try MSALAADAuthority(url: authorityURL)
            )

            let application = try MSALPublicClientApplication(configuration: msalConfig)

            let scopes = ["Calendars.ReadWrite", "User.Read"]
            let parameters = MSALInteractiveTokenParameters(scopes: scopes)
            parameters.promptType = .selectAccount
            parameters.parentViewController = topMostViewController()

            print("Will acquire MS token (interactive)...")

            application.acquireToken(with: parameters) { result, error in
                if let error = error {
                    print("MSAL error: \(error)")
                    return
                }
                guard let authResult = result else {
                    print("No MSAL result!")
                    return
                }

                print("MSAL login success! accessToken length = \(authResult.accessToken.count)")

                // Извличаме данни
                let accessToken = authResult.accessToken
                let expiresOn   = authResult.expiresOn ?? Date()
                let account     = authResult.account
                let msID        = account.identifier
                let email       = account.username ?? "(No username)"
                let refresh     = "???"

                let newMsUser = StoredMicrosoftUser(
                    uniqueID: UUID(),
                    msAccountID: msID,
                    email: email,
                    accessToken: accessToken,
                    accessTokenExpiration: expiresOn,
                    refreshToken: refresh,
                    idToken: authResult.idToken,
                    avatarURL: nil
                )

                print("Will store new MS user:", newMsUser)

                Task { @MainActor in
                    self.storedMsUsers.append(newMsUser)
                    self.saveAllMsUsersToUserDefaults()

                    if self.storedMsUsers.count >= 1 {
                        self.startMicrosoftCalendarSync()
                    }

                    await self.performMicrosoftCalendarSync(for: newMsUser)
                }
            }

        } catch {
            print("MSAL init error:", error)
        }
    }

    @MainActor
    func performMicrosoftCalendarSync(for user: StoredMicrosoftUser) async {
        print("==> performMicrosoftCalendarSync(\(user.email ?? "???")) START")

        // 1) Проверяваме дали токенът е изтекъл и ако да – опитваме тих рефреш.
        let freshUser = await refreshMicrosoftTokenIfNeeded(for: user) ?? user

        // 2) Запазваме старото състояние на [msEventID : localEventIdentifier]
        //    за да засечем локално изтрити евенти по-късно.
        self.oldMsToLocalEventMap = msToLocalEventMap(for: freshUser.uniqueID)

        do {
            // 3) Взимаме списък с MS календари (через Graph API)
            let msCalendars = try await fetchMsCalendarList(accessToken: freshUser.accessToken)
            
            // 4) MS → Local: синхронизация на календарите и техните събития
            await syncMsCalendars(msCalendars, forUser: freshUser, accessToken: freshUser.accessToken)
            
            // 5) Local → MS: за всеки MS календар синхронизираме локалните промени
            let map = msToLocalCalendarMap(for: freshUser.uniqueID)
            for (msCalId, localCalId) in map {
                if let localCal = eventStore.calendar(withIdentifier: localCalId) {
                    await uploadLocalChangesToMicrosoft(
                        msCalId: msCalId,
                        user: freshUser,
                        accessToken: freshUser.accessToken,
                        localCalendar: localCal
                    )
                }
            }
            
        } catch {
            print("performMicrosoftCalendarSync(\(user.email ?? "???")) error:", error)
        }
        
        print("==> performMicrosoftCalendarSync(\(user.email ?? "???")) DONE")

        // По желание: debug метод, който отпечатва локалните MS календари и събития:
        debugPrintLocalMsCalendars()
        
        // Ако желаете, тук може да записвате "новия" map като "стар" за следващото извикване:
        // self.oldMsToLocalEventMap = msToLocalEventMap(for: freshUser.uniqueID)
    }

   

    func debugPrintLocalMsCalendars() {
        print("=== debugPrintLocalMsCalendars START ===")

        // 1) Събираме ВСИЧКИ локални идентификатори,
        //    които се ползват като копия на MS календари за някой потребител.
        //    msToLocalCalendarMap(for:) връща [msCalendarID : localCalendarID].
        var msLocalCalIDs = Set<String>()
        for msUser in storedMsUsers {
            let mapForUser = msToLocalCalendarMap(for: msUser.uniqueID) // [String : String]
            // mapForUser.values са локалните calendarIdentifier-и.
            msLocalCalIDs.formUnion(mapForUser.values)
        }

        // 2) Вземаме *всички локални календари* от EventKit...
        let allLocalCalendars = eventStore.calendars(for: .event)
            .filter { $0.source.sourceType == .local }

        // 3) Филтрираме да останат само тези, които съвпадат с msLocalCalIDs
        let msLocalCalendars = allLocalCalendars.filter {
            msLocalCalIDs.contains($0.calendarIdentifier)
        }

        // 4) Правим си диапазон: 1 месец назад - 6 месеца напред (примерен)
        let start = Date().addingTimeInterval(-3600 * 24 * 30)
        let end   = Date().addingTimeInterval( 3600 * 24 * 180)

        // 5) Принтираме
        for cal in msLocalCalendars {
            print("Local MS cal \"\(cal.title)\" => \(cal.calendarIdentifier)")
            let predicate = eventStore.predicateForEvents(withStart: start, end: end, calendars: [cal])
            let events = eventStore.events(matching: predicate)
            print("   Found \(events.count) events in \"\(cal.title)\"")
            for e in events {
                print("   - \(e.title ?? "(no title)") [\(e.startDate) - \(e.endDate)] id=\(e.eventIdentifier ?? "?")")
            }
        }

        print("=== debugPrintLocalMsCalendars END ===")
    }


    // Примерен helper
    private func topMostViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes
                .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
              let rootVC = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController
        else {
            return nil
        }
        var topVC = rootVC
        while let presented = topVC.presentedViewController {
            topVC = presented
        }
        return topVC
    }

    
    // MARK: - Sign out
    func signOutFromMicrosoft(user: StoredMicrosoftUser) {
        // For MSAL, you typically remove the account from MSAL’s cache:
        // 1) Locate the account object in the cache
        // 2) call application.remove(account)
        
        // Then remove from your local data
        removeLocalMicrosoftCalendars(forUserID: user.uniqueID)
        self.storedMsUsers.removeAll(where: { $0.uniqueID == user.uniqueID })
        
        UserDefaults.standard.removeObject(forKey: "MsToLocalEventMap_\(user.uniqueID.uuidString)")
        UserDefaults.standard.removeObject(forKey: "MsEventUpdatedMap_\(user.uniqueID.uuidString)")
        UserDefaults.standard.removeObject(forKey: "MsLastSyncDateKey_\(user.uniqueID.uuidString)")
        self.msToLocalEventMapAll.removeValue(forKey: user.uniqueID.uuidString)
        self.msEventUpdatedMapAll.removeValue(forKey: user.uniqueID.uuidString)
        self.msLastSyncDateAll.removeValue(forKey: user.uniqueID.uuidString)
        
        if self.storedMsUsers.isEmpty {
            self.stopMicrosoftCalendarSync()
        }
        self.saveAllMsUsersToUserDefaults()
        self.reloadCalendars()
    }
    
    private func removeLocalMicrosoftCalendars(forUserID userID: UUID) {
        let map = msToLocalCalendarMap(for: userID)
        for (_, localCalID) in map {
            if let calToDelete = eventStore.calendar(withIdentifier: localCalID) {
                do {
                    try eventStore.removeCalendar(calToDelete, commit: true)
                    print("Removed local MS-copy calendar:", calToDelete.title)
                } catch {
                    print("Failed to remove local calendar:", error.localizedDescription)
                }
            }
        }
        UserDefaults.standard.removeObject(forKey: "MsToLocalCalendarMap_\(userID.uuidString)")
        self.msToLocalCalendarMapAll.removeValue(forKey: userID.uuidString)
    }
    
    // MARK: - MSAL Refresh (simplified)

    /// Example approach for refreshing (if needed).
    /// MSAL typically handles refresh tokens in the library’s cache,
    /// so you may not need a manual HTTP request for refresh like with Google.
    func refreshMicrosoftTokenIfNeeded(for user: StoredMicrosoftUser) async -> StoredMicrosoftUser? {
        if user.accessTokenExpiration > Date() {
            // still valid, no refresh needed
            return user
        }
        // If you do want to do a silent token call:
        do {
            guard let authorityURL = URL(string: kAuthority) else { return user }
            let msalConfig = MSALPublicClientApplicationConfig(clientId: kClientID,
                                                               redirectUri: kRedirectUri,
                                                               authority: try MSALAADAuthority(url: authorityURL))
            let application = try MSALPublicClientApplication(configuration: msalConfig)
            
            // We have to find the account in MSAL’s cache
            // If we stored "msAccountID" = user.msAccountID = e.g. "some-homeAccountId"
            guard let msAccountID = user.msAccountID else { return user }
            
            let cachedAccounts = try application.allAccounts()
            if let matching = cachedAccounts.first(where: { $0.identifier == msAccountID }) {
                
                let params = MSALSilentTokenParameters(scopes: ["Calendars.ReadWrite", "offline_access", "User.Read"],
                                                       account: matching)
                let result = try await withCheckedThrowingContinuation { (cont: CheckedContinuation<MSALResult, Error>) in
                    application.acquireTokenSilent(with: params) { (res, err) in
                        if let err = err {
                            cont.resume(throwing: err)
                        } else if let res = res {
                            cont.resume(returning: res)
                        } else {
                            cont.resume(throwing: NSError(domain: "Unknown MSAL error", code: -1))
                        }
                    }
                }
                // success
                let updated = StoredMicrosoftUser(
                    uniqueID: user.uniqueID,
                    msAccountID: msAccountID,
                    email: result.account.username,
                    accessToken: result.accessToken,
                    accessTokenExpiration: result.expiresOn!,
                    refreshToken: user.refreshToken, // or nil
                    idToken: result.idToken,
                    avatarURL: user.avatarURL
                )
                
                // store in memory
                updateMsUserInMemory(updated)
                saveAllMsUsersToUserDefaults()
                return updated
            }
        } catch {
            print("MSAL silent refresh error:", error.localizedDescription)
        }
        return user
    }




    func startMicrosoftCalendarSync() {
        print("Start Microsoft Calendar sync timer…")
        msSyncTimer?.invalidate()

        msSyncTimer = Timer.scheduledTimer(withTimeInterval: 10, repeats: true) { [weak self] _ in
            Task { [weak self] in
                await self?.performMicrosoftCalendarSyncForAllUsers()
            }
        }
    }


       func stopMicrosoftCalendarSync() {
           print("Stop Microsoft Calendar sync timer…")
           msSyncTimer?.invalidate()
           msSyncTimer = nil
       }


    /// Call this to sync all stored MsUsers
    func performMicrosoftCalendarSyncForAllUsers() async {
        for user in storedMsUsers {
            print(" - Will sync user \(user.email ?? "???" )")
            await performMicrosoftCalendarSync(for: user)
        }
    }

    private func fetchMsCalendarList(accessToken: String) async throws -> [MSCalendarItem] {
        guard let url = URL(string: "\(kGraphEndpoint)v1.0/me/calendars") else {
            throw NSError(domain: "Bad URL", code: -1)
        }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)

        if let httpResp = response as? HTTPURLResponse, httpResp.statusCode >= 300 {
            let body = String(data: data, encoding: .utf8) ?? ""
            throw NSError(domain: "MsCalendarList HTTP \(httpResp.statusCode)", code: -1,
                          userInfo: [NSLocalizedDescriptionKey: body])
        }

        let decoded = try JSONDecoder().decode(MSCalendarListResponse.self, from: data)

        // ТУК можеш да принтираш какво точно ти връща Graph:
        for cal in decoded.value {
        }

        return decoded.value
    }


    private func syncMsCalendars(
        _ msCalendars: [MSCalendarItem],
        forUser user: StoredMicrosoftUser,
        accessToken: String
    ) async {
        let userKey = user.uniqueID
        var map = msToLocalCalendarMap(for: userKey)
        
        var stillExistsIDs = Set<String>()
        
        for msCal in msCalendars {
            stillExistsIDs.insert(msCal.id)
            
            let msCalName = msCal.name
            let msCalID   = msCal.id
            // Microsoft doesn’t always store color directly, or you’d get it from `msCal.colorHex`
            // For example, we can default all to .systemBlue
            let msColor = UIColor.systemBlue
            
            if let localID = map[msCalID],
               let localEKCal = eventStore.calendar(withIdentifier: localID) {
                
                // If the name or color differs, update
                if localEKCal.title != msCalName || localEKCal.cgColor != msColor.cgColor {
                    localEKCal.title  = msCalName
                    localEKCal.cgColor = msColor.cgColor
                    do {
                        try eventStore.saveCalendar(localEKCal, commit: true)
                    } catch {
                        print("Error updating local MS calendar:", error.localizedDescription)
                    }
                }
                
                // Then fetch events from MS -> local
                await downloadAllMsEvents(
                    forMsCalendarID: msCalID,
                    user: user,
                    localCalendar: localEKCal,
                    accessToken: accessToken
                )
            } else {
                // create local calendar
                if let newLocalCal = createLocalCalendar(googleCalendarName: msCalName, googleCalendarColor: msColor) {
                    // Reuse the same function or make a separate createLocalMsCalendar
                    map[msCalID] = newLocalCal.calendarIdentifier
                    setMsToLocalCalendarMap(map, for: userKey)
                    
                    // fetch MS -> local events
                    await downloadAllMsEvents(
                        forMsCalendarID: msCalID,
                        user: user,
                        localCalendar: newLocalCal,
                        accessToken: accessToken
                    )
                }
            }
        }
        
        // Delete local calendars that were removed from MS
        let currentMap = msToLocalCalendarMap(for: userKey)
        for (msCalID, localID) in currentMap {
            if !stillExistsIDs.contains(msCalID) {
                if let toRemove = eventStore.calendar(withIdentifier: localID) {
                    do {
                        try eventStore.removeCalendar(toRemove, commit: true)
                    } catch {
                        print("removeCalendar error:", error.localizedDescription)
                    }
                }
                var newMap = currentMap
                newMap.removeValue(forKey: msCalID)
                setMsToLocalCalendarMap(newMap, for: userKey)
            }
        }
    }
    
    // Here we reuse your createLocalCalendar from Google code
    // or rename it to something more general:
    // `createLocalCalendar(title:color:)`
    
    private func downloadAllMsEvents(
        forMsCalendarID msCalId: String,
        user: StoredMicrosoftUser,
        localCalendar: EKCalendar,
        accessToken: String
    ) async {
        let now = Date()
        let startDate = Calendar.current.date(byAdding: .month, value: -6, to: now)!
        let endDate   = Calendar.current.date(byAdding: .month, value: 6, to: now)!

        do {
            // 1) Fetch all events from Graph
            let msEvents = try await fetchAllMsEvents(
                msCalID: msCalId,
                accessToken: accessToken,
                startDate: startDate,
                endDate: endDate
            )
            
            let msEventIDs = Set(msEvents.map { $0.id })
            
            // Load existing dictionaries for this user
            var evMap  = msToLocalEventMap(for: user.uniqueID)
            var updMap = msEventUpdatedMap(for: user.uniqueID)
            
            // For each MS event
            for msEvent in msEvents {
                let msUpdated = msEvent.lastModifiedDateTime ?? ""
                let localKnownUpdated = updMap[msEvent.id] ?? ""
                let msChanged = (msUpdated != localKnownUpdated)
                
                if let mappedLocalID = evMap[msEvent.id],
                   let existingLocal = eventStore.event(withIdentifier: mappedLocalID) {
                    
                    // If MS event has changed, update the local event
                    if msChanged {
                        updateLocalEvent(existingLocal, withMsEvent: msEvent, inCalendar: localCalendar)
                    }
                    // else DO NOTHING if the event has *not* changed
                    // (so we do NOT accidentally create a duplicate)
                    
                } else {
                    // If no local mapping, create new local event
                    if let newEv = createLocalMsEvent(msEvent, inCalendar: localCalendar) {
                        evMap[msEvent.id] = newEv.eventIdentifier
                    }
                }
                
                // Update our “updated” dictionary every time
                updMap[msEvent.id] = msUpdated
            }
            
            // Save the updated maps
            setMsToLocalEventMap(evMap, for: user.uniqueID)
            setMsEventUpdatedMap(updMap, for: user.uniqueID)
            
            // 4) Remove any local events that no longer exist in MS
            let localEvents = fetchLocalEvents(
                in: localCalendar,
                startDate: startDate,
                endDate: endDate
            )
            for locEv in localEvents {
                if let msID = extractMsEventID(locEv),  // e.g., mscal://...
                   !msEventIDs.contains(msID) {
                    // => The event was deleted from Microsoft => remove locally
                    do {
                        try eventStore.remove(locEv, span: .thisEvent, commit: true)
                        print("Removed local MS event:", locEv.title ?? "")
                        
                        // And remove from our dictionaries
                        var newMap = msToLocalEventMap(for: user.uniqueID)
                        newMap.removeValue(forKey: msID)
                        setMsToLocalEventMap(newMap, for: user.uniqueID)
                        
                        var newUpd = msEventUpdatedMap(for: user.uniqueID)
                        newUpd.removeValue(forKey: msID)
                        setMsEventUpdatedMap(newUpd, for: user.uniqueID)
                    } catch {
                        print("Error removing local MS event:", error.localizedDescription)
                    }
                }
            }
            
        } catch {
            print("Error fetching MS events:", error.localizedDescription)
        }
    }


    
    private func fetchAllMsEvents(
        msCalID: String,
        accessToken: String,
        startDate: Date,
        endDate: Date
    ) async throws -> [MSCalendarEvent] {
        var allEv: [MSCalendarEvent] = []
        var nextLink: String? = nil
        
        repeat {
            let (chunk, link) = try await fetchMsEventsPage(
                msCalID: msCalID,
                accessToken: accessToken,
                startDate: startDate,
                endDate: endDate,
                pageLink: nextLink
            )

            // Нов принт (по желание):
            print("fetchAllMsEvents: fetched chunk of \(chunk.count) events (pageLink=\(nextLink ?? "nil"))")

            allEv.append(contentsOf: chunk)
            nextLink = link
        } while nextLink != nil
        
        return allEv
    }

    
    private func fetchMsEventsPage(msCalID: String,
                                   accessToken: String,
                                   startDate: Date,
                                   endDate: Date,
                                   pageLink: String?) async throws -> ([MSCalendarEvent], String?) {
        if let pageLink = pageLink {
            // If Graph gave us a nextLink, use it
            guard let url = URL(string: pageLink) else {
                return ([], nil)
            }
            var req = URLRequest(url: url)
            req.httpMethod = "GET"
            req.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
            
            let (data, resp) = try await URLSession.shared.data(for: req)
            if let httpResp = resp as? HTTPURLResponse, httpResp.statusCode >= 300 {
                throw NSError(domain: "MSGraph Error", code: httpResp.statusCode)
            }
            
            let decoded = try JSONDecoder().decode(MSCalendarEventResponse.self, from: data)
            // Use .odataNextLink, not subscript
            return (decoded.value, decoded.odataNextLink)
            
        } else {
            // First page
            let formatter = ISO8601DateFormatter()
            let startStr = formatter.string(from: startDate)
            let endStr   = formatter.string(from: endDate)
            
            guard let encodedCalId = msCalID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
                  let url = URL(string: "\(kGraphEndpoint)v1.0/me/calendars/\(encodedCalId)/events?startDateTime=\(startStr)&endDateTime=\(endStr)")
            else {
                return ([], nil)
            }
            
            var req = URLRequest(url: url)
            req.httpMethod = "GET"
            req.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
            
            let (data, resp) = try await URLSession.shared.data(for: req)
            if let httpResp = resp as? HTTPURLResponse, httpResp.statusCode >= 300 {
                throw NSError(domain: "MSGraph Error", code: httpResp.statusCode)
            }
            
            let decoded = try JSONDecoder().decode(MSCalendarEventResponse.self, from: data)
            // Again, use decoded.odataNextLink
            return (decoded.value, decoded.odataNextLink)
        }
    }

    
    // Similarly implement uploadLocalChangesToMicrosoft (Local -> MS)...

    /// Качва локални промени (в посочения локален календар) към MS.
    func uploadLocalChangesToMicrosoft(
        msCalId: String,
        user: StoredMicrosoftUser,
        accessToken: String,
        localCalendar: EKCalendar
    ) async {
        print("=== uploadLocalChangesToMicrosoft START for \(msCalId) (\(localCalendar.title)) ===")

        // 1) Определяме времето на последната синхронизация (ако няма, distantPast).
        let lastSync = msLastSyncDateAll[user.uniqueID.uuidString] ?? .distantPast
        
        // 2) Намираме ВСИЧКИ локални събития в този календар за разумен диапазон (примерно 1 година назад/напред)
        let oneYearAgo   = Date().addingTimeInterval(-3600 * 24 * 365)
        let oneYearAfter = Date().addingTimeInterval( 3600 * 24 * 365)
        let localEvents = fetchLocalEvents(in: localCalendar, startDate: oneYearAgo, endDate: oneYearAfter)
        
        // 3) От тях филтрираме тези, които са модифицирани след `lastSync`
        let changedEvents = localEvents.filter { ev in
            guard let modDate = ev.lastModifiedDate else { return false }
            return modDate > lastSync
        }
        
        if changedEvents.isEmpty {
            print("Няма локални промени в '\(localCalendar.title)' след \(lastSync).")
            
            // Все пак ще обработим локалните изтривания (ако някъде имате oldMap).
            await uploadLocalDeletionsToMicrosoft(msCalId: msCalId, user: user, accessToken: accessToken)
            
            return
        }
        
        print("Намерени \(changedEvents.count) локално-променени евента в \"\(localCalendar.title)\", качваме в MS…")
        
        // 4) За всеки локален евент => проверяваме дали е “mscal://” (т.е. вече съществува в MS) или е нов
        for event in changedEvents {
            // Проверяваме дали евентът вече има msEventID в `url="mscal://..."`.
            if let msID = extractMsEventID(event) {
                // => PATCH (актуализиране) в Graph
                let success = await patchMsEvent(
                    msCalId: msCalId,
                    msEventId: msID,
                    localEvent: event,
                    accessToken: accessToken,
                    user: user
                )
                if success {
                    print("Успешно patch-нат евент в MS:", event.title ?? "")
                }
            } else {
                // => POST (нов евент в MS)
                let success = await postMsEvent(
                    msCalId: msCalId,
                    localEvent: event,
                    accessToken: accessToken,
                    user: user
                )
                if success {
                    print("Успешно post-нат (създаден) евент в MS:", event.title ?? "")
                }
            }
        }
        
        // 5) Накрая обработваме локалните изтривания (ако пазите oldMap от предната итерация)
        await uploadLocalDeletionsToMicrosoft(msCalId: msCalId, user: user, accessToken: accessToken)
        
        // 6) Обновяваме `lastSyncDate` за този потребител
        saveMsLastSyncDate(user.uniqueID, date: Date())
        
        print("=== uploadLocalChangesToMicrosoft END for \(msCalId) (\(localCalendar.title)) ===")
    }
    /// Създава НОВ евент в MS Calendar (POST /me/calendars/{calId}/events)
    private func postMsEvent(
        msCalId: String,
        localEvent: EKEvent,
        accessToken: String,
        user: StoredMicrosoftUser
    ) async -> Bool {
        // Примерен endpoint:
        //   POST https://graph.microsoft.com/v1.0/me/calendars/{calId}/events
        guard let encodedCalID = msCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let url = URL(string: "\(kGraphEndpoint)v1.0/me/calendars/\(encodedCalID)/events")
        else {
            print("postMsEvent: Bad URL!")
            return false
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let bodyDict = makeMsEventBody(from: localEvent)
        guard let bodyData = try? JSONSerialization.data(withJSONObject: bodyDict, options: []) else {
            print("postMsEvent: cannot encode JSON body!")
            return false
        }
        request.httpBody = bodyData
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse, !(200...299).contains(httpResp.statusCode) {
                let errBody = String(data: data, encoding: .utf8) ?? ""
                print("postMsEvent: HTTP \(httpResp.statusCode), body=\(errBody)")
                return false
            }
            
            // Ако е success => decode-ваме отговора и взимаме новия id
            let created = try JSONDecoder().decode(MSCalendarEvent.self, from: data)
            let newID   = created.id
            
            // 1) Записваме URL-то в локалния евент => "mscal://{id}"
            localEvent.url = URL(string: "mscal://\(newID)")
            // 2) Save в eventStore
            try eventStore.save(localEvent, span: .thisEvent, commit: true)
            
            // 3) Обновяваме речниците: `msToLocalEventMap` и `msEventUpdatedMap`
            var evMap  = msToLocalEventMap(for: user.uniqueID)
            evMap[newID] = localEvent.eventIdentifier
            setMsToLocalEventMap(evMap, for: user.uniqueID)
            
            var updMap = msEventUpdatedMap(for: user.uniqueID)
            // Взимаме lastModifiedDateTime от `created`, за да го сложим
            if let msUpdated = created.lastModifiedDateTime {
                updMap[newID] = msUpdated
            }
            setMsEventUpdatedMap(updMap, for: user.uniqueID)
            
            return true
        } catch {
            print("postMsEvent: error =>", error.localizedDescription)
            return false
        }
    }
    /// Актуализира съществуващ евент (PATCH /me/calendars/{calId}/events/{eventId})
    private func patchMsEvent(
        msCalId: String,
        msEventId: String,
        localEvent: EKEvent,
        accessToken: String,
        user: StoredMicrosoftUser
    ) async -> Bool {
        guard let encodedCalID = msCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let encodedEvID  = msEventId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let url = URL(string: "\(kGraphEndpoint)v1.0/me/calendars/\(encodedCalID)/events/\(encodedEvID)")
        else {
            print("patchMsEvent: Bad URL!")
            return false
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let bodyDict = makeMsEventBody(from: localEvent)
        
        // Внимавайте: при PATCH към Graph, ако поле липсва, може да го изтрие.
        // За да избегнете проблеми, или използвайте само полетата, които искате да актуализирате.
        // В текущия пример пращаме почти всички, все едно overwrite-име.
        // Ако някои полета липсват, това може да изчисти стойности в MS.
        // Ако искате "partial update", редуцирайте bodyDict само до променените полета.
        
        guard let bodyData = try? JSONSerialization.data(withJSONObject: bodyDict, options: []) else {
            print("patchMsEvent: cannot encode JSON body!")
            return false
        }
        request.httpBody = bodyData
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse, !(200...299).contains(httpResp.statusCode) {
                let errBody = String(data: data, encoding: .utf8) ?? ""
                print("patchMsEvent: HTTP \(httpResp.statusCode), body=\(errBody)")
                return false
            }
            
            // Ако е success => декодираме новото съдържание. MS връща пълния обект.
            let updated = try JSONDecoder().decode(MSCalendarEvent.self, from: data)
            // Обновяваме msEventUpdatedMap
            if let newUpdated = updated.lastModifiedDateTime {
                var updMap = msEventUpdatedMap(for: user.uniqueID)
                updMap[msEventId] = newUpdated
                setMsEventUpdatedMap(updMap, for: user.uniqueID)
            }
            
            print("patchMsEvent: success => updated event ‘\(localEvent.title ?? "")’ in MS.")
            return true
        } catch {
            print("patchMsEvent: error =>", error.localizedDescription)
            return false
        }
    }
    private func makeMsEventBody(from localEvent: EKEvent) -> [String: Any] {
        // subject => заглавие
        // body => можем да ползваме notes (BodyType=text/html),
        // start / end => MSDateTimeTimeZone

        // Пример:
        
        var subjectVal = localEvent.title ?? "(No Title)"
        let bodyPreviewVal = (localEvent.notes?.prefix(100) ?? "")  // bodyPreview обикновено идва от MS
        let notesVal = localEvent.notes ?? ""
        let locationVal = localEvent.location ?? ""
        
        // Правим start/end обекти
        // Ако е all-day => използваме date-only формата (например "yyyy-MM-dd")
        
        let isAllDay = localEvent.isAllDay
        let startDict: [String: Any]
        let endDict:   [String: Any]

        if isAllDay {
            // date-only
            let formatter = DateFormatter()
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            formatter.dateFormat = "yyyy-MM-dd"
            let startDateStr = formatter.string(from: localEvent.startDate)
            
            // MS all-day често се води с endDate = "следващия ден", но зависи от логиката.
            // Може да се наложи да прецените дали endDate е реалното.
            let endDateStr   = formatter.string(from: localEvent.endDate)
            
            startDict = [
                "date": startDateStr,
                "timeZone": "UTC"
            ]
            endDict = [
                "date": endDateStr,
                "timeZone": "UTC"
            ]
        } else {
            // Дата с час (dateTime: "2023-03-01T09:00:00", timeZone: "UTC")
            let iso = ISO8601DateFormatter()
            iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds] // напр. 2023-03-01T09:00:00Z
            let startStr = iso.string(from: localEvent.startDate)
            let endStr   = iso.string(from: localEvent.endDate)
            
            startDict = [
                "dateTime": startStr,
                "timeZone": "UTC"
            ]
            endDict = [
                "dateTime": endStr,
                "timeZone": "UTC"
            ]
        }
        
        // Graph позволява да подадем body: { contentType, content }
        let bodyDict: [String: Any] = [
            "contentType": "text", // или "html"
            "content": notesVal
        ]
        
        let eventDict: [String: Any] = [
            "subject": subjectVal,
            "bodyPreview": bodyPreviewVal,
            "body": bodyDict,
            "start": startDict,
            "end":   endDict,
            "location": [
                "displayName": locationVal
            ]
            // Може да добавите attendees, isOnlineMeeting, onlineMeetingProvider...
        ]
        
        return eventDict
    }
    /// Качва локалните изтривания: т.е. евентите, които преди са били в msToLocalEventMap,
    /// но сега локално вече *не съществуват* (или са премахнати от речника).
    func uploadLocalDeletionsToMicrosoft(
        msCalId: String,
        user: StoredMicrosoftUser,
        accessToken: String
    ) async {
        // 1) Взимаме новата (актуална) карта:
        let currentMap = msToLocalEventMap(for: user.uniqueID)
        
        // 2) Обхождаме "стария" snapshot.
        // Ако някой msEventID вече го няма в currentMap,
        // или съответният локален event не съществува, значи локално сме го изтрили.
        for (msID, oldLocalID) in oldMsToLocalEventMap {
            
            // Ако в currentMap вече липсва този msID => изтрит/преместен
            let wasRemovedFromMap = (currentMap[msID] == nil)
            
            // Или ако самият eventStore.event(...) не може да го намери => изтрит локално.
            let localEventStillExists = (eventStore.event(withIdentifier: oldLocalID) != nil)
            
            if wasRemovedFromMap || !localEventStillExists {
                // => Нужно е да го изтрием и в Microsoft, ако искате 2‑way sync
                let success = await deleteMsEvent(
                    msCalID: msCalId,
                    msEventID: msID,
                    accessToken: accessToken
                )
                if success {
                    print("Успешно изтрит MS евент => \(msID)")
                    
                    // И изчистваме от (текущия) map
                    var newMap = msToLocalEventMap(for: user.uniqueID)
                    newMap.removeValue(forKey: msID)
                    setMsToLocalEventMap(newMap, for: user.uniqueID)

                    // И от msEventUpdatedMap
                    var updMap = msEventUpdatedMap(for: user.uniqueID)
                    updMap.removeValue(forKey: msID)
                    setMsEventUpdatedMap(updMap, for: user.uniqueID)
                }
            }
        }
    }


    /// Примерен delete
    /// Прави DELETE към:
    ///     DELETE /v1.0/me/calendars/{calId}/events/{eventId}
    func deleteMsEvent(msCalID: String, msEventID: String, accessToken: String) async -> Bool {
        guard let encodedCalID = msCalID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let encodedEvID  = msEventID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let url = URL(string: "\(kGraphEndpoint)v1.0/me/calendars/\(encodedCalID)/events/\(encodedEvID)")
        else {
            print("deleteMsEvent: Invalid URL!")
            return false
        }

        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")

        do {
            let (_, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse, httpResp.statusCode >= 300 {
                print("deleteMsEvent: Failed with HTTP \(httpResp.statusCode)")
                return false
            }
            return true
        } catch {
            print("deleteMsEvent: Error =>", error.localizedDescription)
            return false
        }
    }


    
    // Example of how you create a local event from an MS event
    /// Създава нов локален EKEvent (iOS) от Microsoft събитие (msEvent).
    /// Задава url="mscal://someMsEventID", за да можем после да го разпознаем като MS събитие.
    private func createLocalMsEvent(_ msEvent: MSCalendarEvent,
                                    inCalendar: EKCalendar) -> EKEvent? {
        print("createLocalMsEvent CALLED with msEvent.id=\(msEvent.id), subject='\(msEvent.subject ?? "")' => target calendar: '\(inCalendar.title)' (\(inCalendar.calendarIdentifier))")

        let newEvent = EKEvent(eventStore: eventStore)
        newEvent.calendar = inCalendar
        let msEventID = msEvent.id
        newEvent.url = URL(string: "mscal://\(msEventID)")

        newEvent.title = msEvent.subject ?? "(No Title)"
        newEvent.notes = msEvent.bodyPreview ?? ""
        if let locName = msEvent.location?.displayName, !locName.isEmpty {
            newEvent.location = locName
        }

        // --- Parse START ---
        if let startStr = msEvent.start?.dateTime {
            // 1) Имаме time-based начало
            if let startDate = parseMsDateTime(startStr) {
                newEvent.startDate = startDate
                print("   startDate parsed => \(startDate)")
            } else {
                print("   WARNING: parseMsDateTime(\(startStr)) failed => ABORT")
                return nil
            }
        } else if let dateOnlyStr = msEvent.start?.date {
            // 2) All-day в MS
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            if let dateVal = formatter.date(from: dateOnlyStr) {
                newEvent.startDate = dateVal
                newEvent.isAllDay  = true
                print("   startDate all-day => \(dateVal)")
            } else {
                print("   WARNING: can't parse msEvent.start?.date => ABORT")
                return nil
            }
        } else {
            print("   WARNING: no start?.dateTime or start?.date => ABORT")
            return nil
        }

        // --- Parse END ---
        if let endStr = msEvent.end?.dateTime {
            // time-based край
            if let endDate = parseMsDateTime(endStr) {
                newEvent.endDate = endDate
                print("   endDate parsed => \(endDate)")
            } else {
                let fallback = newEvent.startDate.addingTimeInterval(3600)
                newEvent.endDate = fallback
                print("   WARNING: parse fail => fallback endDate => \(fallback)")
            }
        } else if let endDateOnlyStr = msEvent.end?.date {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            if let dateVal = formatter.date(from: endDateOnlyStr) {
                newEvent.endDate = dateVal
                // Ако са all-day, обикновено endDate е "следващия" ден. Може да се наложи да нагласите
                // newEvent.endDate = dateVal.addingTimeInterval(24*60*60)  // ако Outlook така го дава.
                // Но зависи как Graph връща all-day events.
                newEvent.isAllDay = true
                print("   endDate all-day => \(dateVal)")
            } else {
                let fallback = newEvent.startDate.addingTimeInterval(3600)
                newEvent.endDate = fallback
                print("   WARNING: can't parse end?.date => fallback => \(fallback)")
            }
        } else {
            // fallback
            let fallback = newEvent.startDate.addingTimeInterval(3600)
            newEvent.endDate = fallback
            print("   WARNING: no endDate => fallback => \(fallback)")
        }

        do {
            try eventStore.save(newEvent, span: .thisEvent, commit: true)
            print("   SUCCESS: created local event in '\(inCalendar.title)' => \(newEvent.title ?? "nil") (start=\(newEvent.startDate))")
            return newEvent
        } catch {
            print("   ERROR saving local MS event => \(error.localizedDescription)")
            return nil
        }
    }


    private func updateLocalEvent(_ localEvent: EKEvent,
                                  withMsEvent msEvent: MSCalendarEvent,
                                  inCalendar: EKCalendar)
    {
        print("updateLocalEvent CALLED for localEvent.id='\(localEvent.eventIdentifier ?? "?")' => msEvent.id=\(msEvent.id), subject='\(msEvent.subject ?? "")'")
        print("   Local event old title='\(localEvent.title ?? "")' => will update to '\(msEvent.subject ?? "")'")

        // Заглавие, notes, location
        localEvent.title = msEvent.subject ?? "(No Title)"
        localEvent.notes = msEvent.bodyPreview ?? ""
        if let locName = msEvent.location?.displayName, !locName.isEmpty {
            localEvent.location = locName
        } else {
            localEvent.location = nil
        }

        // Ако искате винаги да е в конкретния календар:
        localEvent.calendar = inCalendar
        
        // ---- Parse START ----
        if let startStr = msEvent.start?.dateTime {
            // time-based
            if let startDate = parseMsDateTime(startStr) {
                localEvent.startDate = startDate
                localEvent.isAllDay = false
                print("   localEvent.startDate updated => \(startDate)")
            } else {
                print("   WARNING: parseMsDateTime(\(startStr)) failed => skip updating start?")
            }
        } else if let allDayStartStr = msEvent.start?.date {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            if let sDate = formatter.date(from: allDayStartStr) {
                localEvent.startDate = sDate
                localEvent.isAllDay = true
                print("   localEvent.startDate all-day => \(sDate)")
            } else {
                print("   WARNING: can't parse msEvent.start?.date => skip updating start?")
            }
        } else {
            print("   WARNING: no start?.dateTime or start?.date => skip updating start?")
        }

        // ---- Parse END ----
        if let endStr = msEvent.end?.dateTime {
            // time-based
            if let endDate = parseMsDateTime(endStr) {
                localEvent.endDate = endDate
                if !localEvent.isAllDay {
                    print("   localEvent.endDate updated => \(endDate)")
                }
            } else {
                print("   WARNING: parseMsDateTime(\(endStr)) failed => skip updating end?")
            }
        } else if let allDayEndStr = msEvent.end?.date {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            if let eDate = formatter.date(from: allDayEndStr) {
                localEvent.endDate = eDate
                localEvent.isAllDay = true
                print("   localEvent.endDate all-day => \(eDate)")
            } else {
                print("   WARNING: can't parse msEvent.end?.date => skip updating end?")
            }
        } else {
            print("   WARNING: no end?.dateTime or end?.date => skip updating end?")
        }

        // Финално save
        do {
            try eventStore.save(localEvent, span: .thisEvent, commit: true)
            print("   SUCCESS: updated local event => new title='\(localEvent.title ?? "")', allDay=\(localEvent.isAllDay)")
        } catch {
            print("   ERROR updating local MS event => \(error.localizedDescription)")
        }
    }

    private func extractMsEventID(_ event: EKEvent) -> String? {
        guard let urlStr = event.url?.absoluteString,
              urlStr.hasPrefix("mscal://") else {
            return nil
        }
        return urlStr.replacingOccurrences(of: "mscal://", with: "")
    }
    
    // For convenience, we can do something like:
    func microsoftCopiedCalendars(for user: StoredMicrosoftUser) -> [EKCalendar] {
        let map = msToLocalCalendarMap(for: user.uniqueID)
        let localIDs = Set(map.values)
        return allCalendars.filter { localIDs.contains($0.calendarIdentifier) }
    }
}

// MARK: - Microsoft Graph Models
struct MSCalendarListResponse: Codable {
    let value: [MSCalendarItem]
}

struct MSCalendarItem: Codable {
    let id: String
    let name: String
}

struct MSCalendarEventResponse: Codable {
    let value: [MSCalendarEvent]
    let odataNextLink: String?

    // In actual JSON, Microsoft uses `@odata.nextLink`
    // so define custom keys:
    private enum CodingKeys: String, CodingKey {
        case value
        case odataNextLink = "@odata.nextLink"
    }
}

struct MSCalendarEvent: Codable {
    let id: String
    let subject: String?
    let bodyPreview: String?
    let start: MSDateTimeTimeZone?
    let end:   MSDateTimeTimeZone?
    let location: MSLocation?
    
    let lastModifiedDateTime: String?
}

struct MSDateTimeTimeZone: Codable {
    let dateTime: String?
    let timeZone: String?
    // При all-day от Graph се връща date (без часове).
    let date: String?  // <-- Добавете това
}



struct MSLocation: Codable {
    let displayName: String?
}

extension CalendarViewModel {
    private func loadAllMsUsersFromUserDefaults() {
        guard let data = UserDefaults.standard.data(forKey: "StoredMsUsers") else { return }
        do {
            let decoded = try JSONDecoder().decode([StoredMicrosoftUser].self, from: data)
            self.storedMsUsers = decoded
        } catch {
            print("Failed to decode [StoredMicrosoftUser]:", error)
        }
    }
    
    func saveAllMsUsersToUserDefaults() {
        do {
            let encoded = try JSONEncoder().encode(storedMsUsers)
            UserDefaults.standard.set(encoded, forKey: "StoredMsUsers")
            UserDefaults.standard.synchronize()
        } catch {
            print("Failed to encode [StoredMicrosoftUser]:", error)
        }
    }
    
    func updateMsUserInMemory(_ updatedUser: StoredMicrosoftUser) {
        if let idx = storedMsUsers.firstIndex(where: { $0.uniqueID == updatedUser.uniqueID }) {
            storedMsUsers[idx] = updatedUser
        }
    }
}
extension CalendarViewModel {
    func loadPerMsUserMaps(for user: StoredMicrosoftUser) {
        let userKey = user.uniqueID.uuidString
        
        let cals = UserDefaults.standard.dictionary(forKey: "MsToLocalCalendarMap_\(userKey)") as? [String : String] ?? [:]
        msToLocalCalendarMapAll[userKey] = cals
        
        let evs = UserDefaults.standard.dictionary(forKey: "MsToLocalEventMap_\(userKey)") as? [String : String] ?? [:]
        msToLocalEventMapAll[userKey] = evs
        
        let upds = UserDefaults.standard.dictionary(forKey: "MsEventUpdatedMap_\(userKey)") as? [String : String] ?? [:]
        msEventUpdatedMapAll[userKey] = upds
        
        let last = UserDefaults.standard.object(forKey: "MsLastSyncDateKey_\(userKey)") as? Date ?? .distantPast
        msLastSyncDateAll[userKey] = last
    }

    func msToLocalCalendarMap(for userID: UUID) -> [String : String] {
        return msToLocalCalendarMapAll[userID.uuidString] ?? [:]
    }
    func setMsToLocalCalendarMap(_ newVal: [String : String], for userID: UUID) {
        msToLocalCalendarMapAll[userID.uuidString] = newVal
        UserDefaults.standard.setValue(newVal, forKey: "MsToLocalCalendarMap_\(userID.uuidString)")
    }

    func msToLocalEventMap(for userID: UUID) -> [String : String] {
        return msToLocalEventMapAll[userID.uuidString] ?? [:]
    }
    func setMsToLocalEventMap(_ newVal: [String : String], for userID: UUID) {
        msToLocalEventMapAll[userID.uuidString] = newVal
        UserDefaults.standard.setValue(newVal, forKey: "MsToLocalEventMap_\(userID.uuidString)")
    }

    func msEventUpdatedMap(for userID: UUID) -> [String : String] {
        return msEventUpdatedMapAll[userID.uuidString] ?? [:]
    }
    func setMsEventUpdatedMap(_ newVal: [String : String], for userID: UUID) {
        msEventUpdatedMapAll[userID.uuidString] = newVal
        UserDefaults.standard.setValue(newVal, forKey: "MsEventUpdatedMap_\(userID.uuidString)")
    }

    func saveMsLastSyncDate(_ userID: UUID, date: Date) {
        msLastSyncDateAll[userID.uuidString] = date
        UserDefaults.standard.set(date, forKey: "MsLastSyncDateKey_\(userID.uuidString)")
    }
    func parseMsDateTime(_ raw: String) -> Date? {
        let formatter = DateFormatter()
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone(secondsFromGMT: 0)
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS"
        return formatter.date(from: raw)
    }

}
