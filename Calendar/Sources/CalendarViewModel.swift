import SwiftUI
import EventKit
import Combine
@preconcurrency import GoogleSignIn   // silences Sendable enforcement for SDK types
import MSAL
import Contacts

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

    let calendar = Calendar.current
    
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
    private let selectedCalendarIDsKey = "SelectedCalendarIDsKey"
    private let hasConfiguredSelectedCalendarIDsKey = "HasConfiguredSelectedCalendarIDsKey"

    // MARK: - Init
    init() {
        Task {
              await refreshTokensForAllUsers()      // Google
              for msUser in storedMsUsers {         // Microsoft
                  _ = await refreshMicrosoftTokenIfNeeded(for: msUser)
              }
          }
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
        if let storedArray = UserDefaults.standard.array(forKey: selectedCalendarIDsKey) as? [String],
           !storedArray.isEmpty || UserDefaults.standard.bool(forKey: hasConfiguredSelectedCalendarIDsKey) {
            self.selectedCalendarIDs = Set(storedArray)
            if !storedArray.isEmpty {
                UserDefaults.standard.set(true, forKey: hasConfiguredSelectedCalendarIDsKey)
            }
        } else {
            ensureDefaultCalendarSelectionIfNeeded()
        }

        // 5) Observe changes in selectedCalendarIDs and store them
        $selectedCalendarIDs
            .sink { newValue in
                let hasConfiguredSelection = UserDefaults.standard.bool(forKey: self.hasConfiguredSelectedCalendarIDsKey)
                guard !newValue.isEmpty || hasConfiguredSelection || !self.allCalendars.isEmpty else { return }

                let array = Array(newValue)
                UserDefaults.standard.set(array, forKey: self.selectedCalendarIDsKey)
                if !newValue.isEmpty {
                    UserDefaults.standard.set(true, forKey: self.hasConfiguredSelectedCalendarIDsKey)
                }
                CalendarWidgetStore.saveCalendarSelectionSnapshot(newValue)

                Task { @MainActor in
                    EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
                    CalendarLiveActivityManager.shared.update()
                }
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

    func signInWithGoogle() {
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientID)

        guard
            let windowScene = UIApplication.shared.connectedScenes
                .first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
            let rootVC = windowScene.windows.first(where: { $0.isKeyWindow })?.rootViewController
        else { return }

        let extraScopes = [
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/contacts.readonly",
            "https://www.googleapis.com/auth/contacts.other.readonly"
        ]

        GIDSignIn.sharedInstance.signIn(
            withPresenting: rootVC,
            hint: nil,
            additionalScopes: extraScopes
        ) { [weak self] signInResult, error in
            guard let self else { return }

            // Early exit / logging are cheap – do them right here
            if let error = error {
                print("Google Sign-In error:", error.localizedDescription)
                return
            }
            guard let gUser = signInResult?.user else { return }

            // Mutate main-actor state *before* the Task
            Task { @MainActor in
                self.storeGoogleUserInUserDefaults(gUser)

                if let newStoredUser = self.storedUsers.last {
                    await self.performGoogleCalendarSync(for: newStoredUser)
                    await self.fetchGoogleContactsAndSaveLocally(for: newStoredUser)
                    await self.fetchGoogleOtherContactsAndSaveLocally(for: newStoredUser)
                }
            }
        }

    }

    
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
        // 1) Селектираме „разрешените“ календари (или всички, ако предпочитате).
        let allowedCalendars = eventStore.calendars(for: .event)
            .filter { selectedCalendarIDs.contains($0.calendarIdentifier) }

        // 2) Избираме диапазон (1 месец назад / 6 месеца напред като пример).
        let start = Date().addingTimeInterval(-3600 * 24 * 30)
        let end   = Date().addingTimeInterval( 3600 * 24 * 180)

        // 3) Взимаме всички събития в този диапазон от тези календари.
        let pred = eventStore.predicateForEvents(withStart: start, end: end, calendars: allowedCalendars)
        let events = eventStore.events(matching: pred)

        // 4) Създаваме "нов" snapshot eventID -> calendarID
        var newEventCalendarMap: [String: String] = [:]
        for ev in events {
            guard let evID = ev.eventIdentifier else { continue }
            let newCalID = ev.calendar.calendarIdentifier
            newEventCalendarMap[evID] = newCalID

            // Проверяваме дали старият календар се различава
            if let oldCalID = oldEventCalendarMap[evID], oldCalID != newCalID {
                // => събитието е преместено от oldCalID към newCalID
                print("handleEventStoreChanged: \"\(ev.title ?? "")\" от \(oldCalID) към \(newCalID).")

                // ========== GOOGLE част ==========
                let oldGoogleInfo = findGoogleCalID(forLocalCalID: oldCalID)
                let newGoogleInfo = findGoogleCalID(forLocalCalID: newCalID)
                let maybeGEventID = extractGoogleEventID(ev)

                switch (oldGoogleInfo, newGoogleInfo) {
                case let (.some((oldGUserID, oldGCalID)), .some((newGUserID, newGCalID))):
                    // И старият, и новият са Google календари
                    if oldGUserID == newGUserID, let gEvID = maybeGEventID {
                        // Същият Google акаунт => може да ползваме moveEventInGoogle + patchEventToGoogle
                        Task {
                            guard let googleUser = getUserInMemory(oldGUserID) else { return }
                            // move
                            let successMove = await moveEventInGoogle(
                                googleEventID: gEvID,
                                oldGoogleCalID: oldGCalID,
                                newGoogleCalID: newGCalID,
                                accessToken: googleUser.accessToken
                            )
                            if successMove {
                                // После patch, за да се качат евентуални промени
                                _ = await patchEventToGoogle(
                                    event: ev,
                                    googleCalId: newGCalID,
                                    googleEventId: gEvID,
                                    accessToken: googleUser.accessToken,
                                    userID: googleUser.uniqueID
                                )
                            }
                        }
                    } else {
                        // Различни акаунти (или нямаме gEvID) => трием от стария + качваме в новия
                        Task {
                            // (a) delete от стария
                            if let gEvID = maybeGEventID,
                               let oldUser = getUserInMemory(oldGUserID) {
                                _ = await deleteEventFromGoogle(
                                    googleCalId: oldGCalID,
                                    googleEventId: gEvID,
                                    accessToken: oldUser.accessToken
                                )
                            }
                            // (b) post в новия
                            if let newUser = getUserInMemory(newGUserID) {
                                _ = await postEventToGoogle(
                                    event: ev,
                                    googleCalId: newGCalID,
                                    accessToken: newUser.accessToken,
                                    userID: newUser.uniqueID
                                )
                            }
                        }
                    }

                case let (.some((oldGUserID, oldGCalID)), .none):
                    // Старият е Google, новият = не-Google => трием от Google
                    Task {
                        if let gEvID = maybeGEventID,
                           let oldUser = getUserInMemory(oldGUserID) {
                            _ = await deleteEventFromGoogle(
                                googleCalId: oldGCalID,
                                googleEventId: gEvID,
                                accessToken: oldUser.accessToken
                            )
                        }
                    }

                case let (.none, .some((newGUserID, newGCalID))):
                    // Старият = не-Google, новият = Google => създаваме в Google
                    Task {
                        if let newUser = getUserInMemory(newGUserID) {
                            _ = await postEventToGoogle(
                                event: ev,
                                googleCalId: newGCalID,
                                accessToken: newUser.accessToken,
                                userID: newUser.uniqueID
                            )
                        }
                    }

                case (.none, .none):
                    // И двата не са Google => нищо не правим за Google
                    break
                }

                // ========== MICROSOFT част ==========
                let oldMsInfo = findMsCalID(forLocalCalID: oldCalID)   // -> (UUID, String)?
                let newMsInfo = findMsCalID(forLocalCalID: newCalID)
                let maybeMsEvID = extractMsEventID(from: ev)

                switch (oldMsInfo, newMsInfo) {
                case let (.some((oldMsUserID, oldMsCalID)), .some((newMsUserID, newMsCalID))):
                    // И старият, и новият са Microsoft
                    if oldMsUserID == newMsUserID, let msID = maybeMsEvID {
                        // Същият MS акаунт => можем да “premestime” (patch) ако Graph поддържа такъв ход
                        Task {
                            if let oldMsUser = storedMsUsers.first(where: { $0.uniqueID == oldMsUserID }) {
                                // Примерен вариант: ако има moveMsEvent или PATCH calendarId
                                // await moveMsEvent(...)
                                // или просто:
                                _ = await patchMsEvent(
                                    msCalId: newMsCalID,
                                    msEventId: msID,
                                    localEvent: ev,
                                    accessToken: oldMsUser.accessToken,
                                    user: oldMsUser,
                                    forceAddTeams: false
                                )
                            }
                        }
                    } else {
                        // Различни акаунти или нямаме msID => изтриваме от стария + качваме в новия
                        Task {
                            // (a) delete от стария
                            if let msID = maybeMsEvID,
                               let oldUser = storedMsUsers.first(where: { $0.uniqueID == oldMsUserID }) {
                                _ = await deleteMsEvent(
                                    msCalID: oldMsCalID,
                                    msEventID: msID,
                                    accessToken: oldUser.accessToken
                                )
                            }
                            // (b) post в новия
                            if let newUser = storedMsUsers.first(where: { $0.uniqueID == newMsUserID }) {
                                _ = await postMsEvent(
                                    msCalId: newMsCalID,
                                    localEvent: ev,
                                    accessToken: newUser.accessToken,
                                    user: newUser
                                )
                            }
                        }
                    }

                case let (.some((oldMsUserID, oldMsCalID)), .none):
                    // Старият = Microsoft, новият = не-Microsoft => трием от MS
                    Task {
                        if let msID = maybeMsEvID,
                           let oldMsUser = storedMsUsers.first(where: { $0.uniqueID == oldMsUserID }) {
                            _ = await deleteMsEvent(
                                msCalID: oldMsCalID,
                                msEventID: msID,
                                accessToken: oldMsUser.accessToken
                            )
                        }
                    }

                case let (.none, .some((newMsUserID, newMsCalID))):
                    // Старият = не-Microsoft, новият = Microsoft => постваме в MS
                    Task {
                        if let newMsUser = storedMsUsers.first(where: { $0.uniqueID == newMsUserID }) {
                            _ = await postMsEvent(
                                msCalId: newMsCalID,
                                localEvent: ev,
                                accessToken: newMsUser.accessToken,
                                user: newMsUser
                            )
                        }
                    }

                case (.none, .none):
                    // И двата не са Microsoft => нищо не правим за MS
                    break
                }
            }
        }

        // 5) Проверяваме дали някой евент от стария snapshot вече го няма
        for oldEvID in oldEventCalendarMap.keys {
            if newEventCalendarMap[oldEvID] == nil {
                print("Събитие с ID=\(oldEvID) вече не съществува => изтрито е")
                // => Ако е било Google => deleteEventFromGoogle(...)
                // => Ако е било MS => deleteMsEvent(...)
                // (Може да го откриете чрез обратен map googleToLocalEventMap/msToLocalEventMap и т.н.)
            }
        }

        // 6) Накрая записваме newEventCalendarMap като нов „стар“ snapshot
        oldEventCalendarMap = newEventCalendarMap
        CalendarWidgetStore.saveUpcomingEventsSnapshot()
        EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
    }

    /// Търси в msToLocalCalendarMapAll дали даденият локален календар (localCalID)
    /// съответства на Microsoft календар. Ако да – връща (msUserUUID, msCalendarID).
    /// Ако не намери, връща nil.
    func findMsCalID(forLocalCalID localCalID: String) -> (UUID, String)? {
        // msToLocalCalendarMapAll е речник [String : [String : String]],
        // където ключът е стринг формата на userID.uuidString,
        // а стойността е map: [msCalendarID : localCalendarID].
        for (userKey, msMap) in msToLocalCalendarMapAll {
            // userKey е "UUID().uuidString"
            guard let uuid = UUID(uuidString: userKey) else { continue }

            // Преглеждаме всяка двойка (msCalID -> localID).
            // Ако localID съвпада, значи това е търсеният Microsoft календар.
            if let (msCalID, _) = msMap.first(where: { $0.value == localCalID }) {
                // Връщаме (UUID, msCalendarID)
                return (uuid, msCalID)
            }
        }
        // Нищо не е намерено => не е MS календар
        return nil
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
    /// Returns `true` when calendar permission is granted.
    /// Suspends the caller instead of blocking a thread.
    @MainActor              // we want to be called from UI code
    private func requestCalendarAccess() async -> Bool {
        if #available(iOS 17.0, *) {
            // New, async API – just await it
            do {
                return try await eventStore.requestFullAccessToEvents()
            } catch {
                print("Calendar access error:", error)
                return false
            }
        } else {
            // Bridge the old completion-handler API to async/await
            return await withCheckedContinuation { cont in
                eventStore.requestAccess(to: .event) { granted, error in
                    if let error { print("Calendar access error:", error) }
                    cont.resume(returning: granted)
                }
            }
        }
    }


    // MARK: - Load Calendars
    func reloadCalendars() {
        let cals = eventStore.calendars(for: .event)
        self.allCalendars = cals
        ensureDefaultCalendarSelectionIfNeeded()

        // Обновяваме речника (или каквото друго е нужно)
        syncNonOtherCalendarsDict()

        // Използваме същата логика, която ползваме при създаване на нови събития
        // (примерно pickFirstWritableSelectedCalendar())
        if let writableSelectedCal = pickFirstWritableSelectedCalendar(),
           let cgColor = writableSelectedCal.cgColor {
            self.firstLocalCalendarColor = UIColor(cgColor: cgColor)
        } else {
            self.firstLocalCalendarColor = nil
        }
    }

    private func ensureDefaultCalendarSelectionIfNeeded() {
        guard !UserDefaults.standard.bool(forKey: hasConfiguredSelectedCalendarIDsKey) else { return }
        if let storedArray = UserDefaults.standard.array(forKey: selectedCalendarIDsKey) as? [String],
           !storedArray.isEmpty {
            selectedCalendarIDs = Set(storedArray)
            UserDefaults.standard.set(true, forKey: hasConfiguredSelectedCalendarIDsKey)
            return
        }

        let allIDs = Set(allCalendars.map(\.calendarIdentifier))
        guard !allIDs.isEmpty else { return }

        selectedCalendarIDs = allIDs
        UserDefaults.standard.set(Array(allIDs), forKey: selectedCalendarIDsKey)
        UserDefaults.standard.set(true, forKey: hasConfiguredSelectedCalendarIDsKey)
    }


    @MainActor
    func pickFirstWritableSelectedCalendar() -> EKCalendar? {
        // Тук предполагаме, че:
        // - `CalendarViewModel.shared.selectedCalendarIDs` е Set<String> с идентификатори
        // - `CalendarViewModel.shared.allowedCalendars()` връща масив от EKCalendar,
        //   или имате друг начин да вземете всички налични календари и да ги филтрирате.

        let selectedIDs = selectedCalendarIDs
        let possibleCalendars = allowedCalendars()

        // Обхождаме ги в някакъв ред (какъвто вие решите: по title, по ред на избиране и т.н.)
        // и връщаме първия, който е едновременно избран и не е read-only.
        for cal in possibleCalendars {
            if selectedIDs.contains(cal.calendarIdentifier),
               cal.allowsContentModifications {
                return cal
            }
        }
        return nil
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
        EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
    }
    func localOrICloudCalendars() -> [EKCalendar] {
       let googleSyncedIDs = Set(
           storedUsers.flatMap { user in
               googleToLocalCalendarMap(for: user.uniqueID).values
           }
       )
       let msSyncedIDs = Set(
           storedMsUsers.flatMap { user in
               msToLocalCalendarMap(for: user.uniqueID).values
           }
       )
       
       return allCalendars.filter {
           // Дали е локален (On My iPhone) или iCloud
           ($0.source.sourceType == .local || $0.source.title == "iCloud")
           // ... и не е „копиран“ от Google или Microsoft
           && !googleSyncedIDs.contains($0.calendarIdentifier)
           && !msSyncedIDs.contains($0.calendarIdentifier)
       }
   }
   func otherCalendars() -> [EKCalendar] {
       let googleSyncedIDs = Set(
           storedUsers.flatMap { user in
               googleToLocalCalendarMap(for: user.uniqueID).values
           }
       )
       let msSyncedIDs = Set(
        storedMsUsers.flatMap { user in
               msToLocalCalendarMap(for: user.uniqueID).values
           }
       )
       
       return allCalendars.filter {
           // Да не е локален
           $0.source.sourceType != .local
           // Да не е iCloud (по title)
           && $0.source.title != "iCloud"
           // И да не е календар, копиран от Google / Microsoft
           && !googleSyncedIDs.contains($0.calendarIdentifier)
           && !msSyncedIDs.contains($0.calendarIdentifier)
       }
   }
    func syncNonOtherCalendarsDict() {
        // 1) Събираме "other" календарите в множество, за да ги изключим.
        let otherSet = Set(otherCalendars())
        
        // 2) Филтрираме `allCalendars`, така че да останат само тези,
        // които не са в `otherCalendars()`
        let nonOtherCals = allCalendars.filter { !otherSet.contains($0) }
        
        // 3) Създаваме нов речник
        var newDict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
        
        for cal in nonOtherCals {
            let calTitle = cal.title
            
            // Вземаме цвета, ако има
            var uiColor = UIColor.systemGray
            if let cgColor = cal.cgColor {
                uiColor = UIColor(cgColor: cgColor)
            }
            
            // Запазваме дали е било селектирано досега
            let wasSelected = calendarsDict[cal.calendarIdentifier]?.selected ?? true
            
            newDict[cal.calendarIdentifier] = (
                title: calTitle,
                color: uiColor,
                selected: wasSelected,
                calendar: cal
            )
        }
        
        // 4) Заместваме стария речник с новия
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
        // Проверка дали вече има активен таймер
        guard syncTimer == nil else {
            print("startGoogleCalendarSync: вече има пуснат таймер => няма нужда да пускаме втори.")
            return
        }

        print("Start Google Calendar sync timer (multi-user)…")
        syncTimer?.invalidate() // по желание, ако искаш да си подсигуриш
        syncTimer = Timer.scheduledTimer(withTimeInterval: 20, repeats: true) { [weak self] _ in
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
    
    // -------------------------------------------------------------------------
    // MARK: - Google helper to detect holiday calendar
    // -------------------------------------------------------------------------
    private func isGoogleHolidayCalendar(_ gcal: GoogleCalendarItem) -> Bool {
        // Holiday календарите обикновено имат ID, завършващо на "holiday@group.v.calendar.google.com"
        // напр. "bg.bulgarian#holiday@group.v.calendar.google.com"
        // Ако искате, може да проверявате и по title: gcal.summary.lowercased().contains("holiday")
        return gcal.id.contains("holiday@group.v.calendar.google.com")
    }


    // -------------------------------------------------------------------------
    // MARK: - syncGoogleCalendars(...)
    // -------------------------------------------------------------------------
    private func syncGoogleCalendars(
        _ googleCalendars: [GoogleCalendarItem],
        forUser user: StoredGoogleUser,
        accessToken: String
    ) async {
        var stillExistsGoogleCalendarIDs = Set<String>()
        let userID = user.uniqueID

        // Map от UserDefaults: [googleCalId: localCalId]
        var map = googleToLocalCalendarMap(for: userID)

        for gcal in googleCalendars {
            let googleCalId = gcal.id
            stillExistsGoogleCalendarIDs.insert(googleCalId)

            let googleCalName = gcal.summary
            let googleCalColor = colorFromHexString(gcal.backgroundColor ?? "") ?? .systemBlue

            // --- NEW: Ако е holiday календар, сваляме го еднократно и пропускаме двупосочния sync ---
            if isGoogleHolidayCalendar(gcal) {
                // 1) Ако нямаме още локален календар => създаваме го и еднократно сваляме събития.
                if map[googleCalId] == nil {
                    if let newCal = createLocalCalendar(
                        googleCalendarName: googleCalName,
                        googleCalendarColor: googleCalColor
                    ) {
                        map[googleCalId] = newCal.calendarIdentifier
                        self.setGoogleToLocalCalendarMap(map, for: userID)

                        // Изтегляме събития само веднъж
                        await downloadAllEvents(
                            forGoogleCalendarID: googleCalId,
                            userID: userID,
                            localCalendar: newCal,
                            accessToken: accessToken
                        )
                    }
                }
                // 2) След това пропускаме (не правим 2‑way sync)
                continue
            }
            // --- END HOLIDAY CHECK ---

            // (1) Ако вече имаме локален календар
            if let localCalID = map[googleCalId],
               let localEKCal = eventStore.calendar(withIdentifier: localCalID) {

                // Проверка за промяна в title/color
                if localEKCal.title != googleCalName ||
                   localEKCal.cgColor != googleCalColor.cgColor {
                    localEKCal.title = googleCalName
                    localEKCal.cgColor = googleCalColor.cgColor
                    do {
                        try eventStore.saveCalendar(localEKCal, commit: true)
                    } catch {
                        print("Error updating local calendar:", error.localizedDescription)
                    }
                }

                // Сваляме събития само ако календарът е селектиран
                if selectedCalendarIDs.contains(localCalID) {
                    await downloadAllEvents(
                        forGoogleCalendarID: googleCalId,
                        userID: userID,
                        localCalendar: localEKCal,
                        accessToken: accessToken
                    )
                } else {
                    print("Skipping download for not‑selected localCalID:", localCalID)
                }

            } else {
                // (2) Ако нямаме локален календар => създаваме
                if let newCal = createLocalCalendar(
                    googleCalendarName: googleCalName,
                    googleCalendarColor: googleCalColor
                ) {
                    map[googleCalId] = newCal.calendarIdentifier
                    self.setGoogleToLocalCalendarMap(map, for: userID)

                    // Проверка за selection
                    if selectedCalendarIDs.contains(newCal.calendarIdentifier) {
                        await downloadAllEvents(
                            forGoogleCalendarID: googleCalId,
                            userID: userID,
                            localCalendar: newCal,
                            accessToken: accessToken
                        )
                    } else {
                        print("Created local calendar but skipping download (not selected).")
                    }
                }
            }
        }

        // Накрая: трием локални календари, които вече не съществуват в Google
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


    // -------------------------------------------------------------------------
    // MARK: - performGoogleCalendarSync(for:)
    // -------------------------------------------------------------------------
    @MainActor
    func performGoogleCalendarSync(for user: StoredGoogleUser) async {
        // (1) Ако токенът е изтекъл => refresh
        if user.accessTokenExpiration < Date() {
            if let rToken = user.refreshToken, !rToken.isEmpty {
                do {
                    let (newAccess, newExp, newID) = try await refreshTokens(refreshToken: rToken)
                    let updatedUser = StoredGoogleUser(
                        uniqueID: user.uniqueID,
                        userID: user.userID,
                        email: user.email,
                        accessToken: newAccess,
                        accessTokenExpiration: newExp,
                        refreshToken: rToken,
                        idToken: newID,
                        photoURL: user.photoURL
                    )
                    updateUserInMemory(updatedUser)
                    saveAllUsersToUserDefaults()
                } catch {
                    print("Refresh token error: \(error)")
                    return
                }
            }
        }

        let validUser = getUserInMemory(user.uniqueID) ?? user
        let accessToken = validUser.accessToken
        if accessToken.isEmpty { return }

        do {
            // Google → Local
            self.oldGoogleToLocalEventMap = googleToLocalEventMap(for: validUser.uniqueID)
            let googleCalendars = try await fetchGoogleCalendarList(accessToken: accessToken)
            await syncGoogleCalendars(googleCalendars, forUser: validUser, accessToken: accessToken)

            // Local → Google
            let map = googleToLocalCalendarMap(for: validUser.uniqueID)
            for (gCalID, localCalID) in map {
                // --- NEW: пропускаме holiday календар ---
                if gCalID.contains("holiday@group.v.calendar.google.com") {
                    continue
                }
                // --- END ---

                // Пропускаме, ако не е селектиран
                guard selectedCalendarIDs.contains(localCalID) else { continue }

                if let localCal = eventStore.calendar(withIdentifier: localCalID) {
                    await uploadLocalChangesToGoogle(
                        googleCalId: gCalID,
                        userID: validUser.uniqueID,
                        accessToken: accessToken,
                        localCalendar: localCal
                    )
                }
            }

        } catch {
            print("performGoogleCalendarSync error:", error.localizedDescription)
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
    
    /// Изтегля всички събития от Google Calendar и ги синхронизира в локалния EKCalendar.
    /// Ако `gevent.updated` се различава от запаметеното в `updMap[gevent.id]`,
    /// значи има промяна (title/description/location/attendees и т.н.) и се ъпдейтва.
    private func downloadAllEvents(
        forGoogleCalendarID googleCalId: String,
        userID: UUID,
        localCalendar: EKCalendar,
        accessToken: String
    ) async {
        // Примерен диапазон от -180 дни до +360 дни
        let now = Date()
        let startDate = Calendar.current.date(byAdding: .day, value: -180, to: now)!
        let endDate   = Calendar.current.date(byAdding: .day, value: 360, to: now)!

        do {
            // 1) Изтегляме всички Google събития (с възможни страници pageToken)
            let allGEvents = try await fetchAllGoogleEvents(
                googleCalId: googleCalId,
                accessToken: accessToken,
                startDate: startDate,
                endDate: endDate
            )

            // Събираме ID-тата в множество, за да видим по-късно кое е изтрито
            let googleEventIDsSet = Set(allGEvents.map { $0.id })

            // Вземаме текущите речници за потребителя
            var evMap  = googleToLocalEventMap(for: userID)    // [googleEventID: localEventID]
            var updMap = googleEventUpdatedMap(for: userID)    // [googleEventID: googleUpdatedString]

            // 2) Обхождаме всяко Google събитие
            for gevent in allGEvents {
                // Google поддържа `updated` като ISO8601 String
                let googleUpdated = gevent.updated ?? ""
                let localKnownUpdated = updMap[gevent.id] ?? ""
                let googleChanged = (googleUpdated != localKnownUpdated)

                if let mappedLocalID = evMap[gevent.id],
                   let existingLocalEvent = eventStore.event(withIdentifier: mappedLocalID) {
                    // => вече има локално събитие
                    if googleChanged {
                        // => Правим updateLocalEvent(...), за да отразим всякакви промени
                        updateLocalEvent(existingLocalEvent,
                                         withGoogleEvent: gevent,
                                         inCalendar: localCalendar)
                    }
                } else if let foundByUrl = findLocalEvent(withGoogleID: gevent.id, userID: userID) {
                    // => Нямаме го в map-a, но го намираме по url = "gcal://..."
                    if googleChanged {
                        evMap[gevent.id] = foundByUrl.eventIdentifier
                        updateLocalEvent(foundByUrl,
                                         withGoogleEvent: gevent,
                                         inCalendar: localCalendar)
                    }
                } else {
                    // => Напълно ново събитие (не съществува локално)
                    if let newEv = createLocalEvent(gevent, inCalendar: localCalendar) {
                        evMap[gevent.id] = newEv.eventIdentifier
                    }
                }

                // При всяка итерация обновяваме updated-стойността (даже и да не е имало промяна)
                updMap[gevent.id] = googleUpdated
            }

            // 3) Записваме обновените речници
            setGoogleToLocalEventMap(evMap, for: userID)
            setGoogleEventUpdatedMap(updMap, for: userID)

            // 4) Накрая трием локално събитие, ако вече не съществува в Google
            let localEvents = fetchLocalEvents(in: localCalendar,
                                               startDate: startDate,
                                               endDate: endDate)
            for localEv in localEvents {
                if let gID = getGoogleIDFrom(localEv),
                   !googleEventIDsSet.contains(gID) {
                    // => Събитие е изтрито от Google => трием го локално
                    do {
                        try eventStore.remove(localEv, span: .thisEvent, commit: true)
                        print("Removed local event:", localEv.title ?? "(No Title)")

                        // Махаме го и от map / updMap
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
    
    /// Качва локалните промени (в даден EKCalendar) към Google.
    /// Ползваме lastModifiedDate на EKEvent (EventKit) за да разберем дали има промяна.
    private func uploadLocalChangesToGoogle(
        googleCalId: String,
        userID: UUID,
        accessToken: String,
        localCalendar: EKCalendar
    ) async {
        // 1) Селектираме локални събития за последната/следващата година
        let oneYearAgo   = Date().addingTimeInterval(-3600*24*365)
        let oneYearAfter = Date().addingTimeInterval( 3600*24*365)

        let localEvents = fetchLocalEvents(in: localCalendar,
                                           startDate: oneYearAgo,
                                           endDate: oneYearAfter)

        // 2) Гледаме lastSyncDate, за да качим само събития, които са пипнати след него
        let lastSync = self.lastSyncDateAll[userID.uuidString] ?? .distantPast
        let changedEvents = localEvents.filter { ev in
            guard let modDate = ev.lastModifiedDate else { return false }
            return modDate > lastSync
        }

        if changedEvents.isEmpty {
            // Ако няма промени => проверяваме само за локални изтривания
            print("No local changes in \(localCalendar.title). Checking for local deletions…")
            await uploadLocalDeletionsToGoogle(
                googleCalId: googleCalId,
                userID: userID,
                accessToken: accessToken
            )
            return
        }

        print("Found \(changedEvents.count) local changes in ‘\(localCalendar.title)’, uploading…")

        // 3) За всяко променено събитие => решаваме PATCH или POST в Google
        for event in changedEvents {
            let googleID = getGoogleIDFrom(event)
            if let googleID = googleID {
                // => Вече съществува в Google => PATCH (update)
                let success = await patchEventToGoogle(
                    event: event,
                    googleCalId: googleCalId,
                    googleEventId: googleID,
                    accessToken: accessToken,
                    userID: userID
                )
                if success {
                    print("Успешно обновен Google евент ‘\(event.title ?? "")’.")
                }
            } else {
                // => Ново събитие => POST (create)
                let success = await postEventToGoogle(
                    event: event,
                    googleCalId: googleCalId,
                    accessToken: accessToken,
                    userID: userID
                )
                if success {
                    print("Успешно създаден Google евент ‘\(event.title ?? "")’.")
                }
            }
        }

        // 4) Проверяваме за изтрити локално събития (за да ги изтрием и от Google)
        await uploadLocalDeletionsToGoogle(
            googleCalId: googleCalId,
            userID: userID,
            accessToken: accessToken
        )

        // 5) Ъпдейтваме lastSyncDate
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
        var bodyDict: [String: Any] = await makeGoogleEventBody(from: event)
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
        
        let bodyDict: [String: Any] = await makeGoogleEventBody(from: event)
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
        
        newEvent.title = gevent.summary ?? NSLocalizedString("(No Title)", comment: "Untitled synced event fallback")
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
            formatter.locale = Locale(identifier: "en_US_POSIX")
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
        localEvent.title = gevent.summary ?? NSLocalizedString("(No Title)", comment: "Untitled synced event fallback")
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
            formatter.locale = Locale(identifier: "en_US_POSIX")
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
        formatter.locale = Locale(identifier: "en_US_POSIX")
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
    @MainActor
    func pickPrimaryEmailIfNeeded(from attendees: [Attendee]) async {
        // Already set? -> nothing to do
        guard GlobalState.email == "" else { return }

        let uniqueEmails = Array(Set(attendees.map(\.email))).sorted()
        guard uniqueEmails.count > 1 else {
            GlobalState.email = uniqueEmails.first ?? ""
            return
        }

        // Ask the user which address is theirs
        let chosen = await withCheckedContinuation { (cont: CheckedContinuation<String, Never>) in
            let alert = UIAlertController(
                title: NSLocalizedString("Choose your e-mail", comment: "Primary email picker title"),
                message: NSLocalizedString("It will be treated as your primary address and invitations will not be sent to it.", comment: "Primary email picker message"),
                preferredStyle: .actionSheet
            )
            uniqueEmails.forEach { email in
                alert.addAction(UIAlertAction(title: email, style: .default) { _ in
                    cont.resume(returning: email)
                })
            }
            alert.addAction(UIAlertAction(title: NSLocalizedString("Cancel", comment: "Cancel button"), style: .cancel) { _ in
                // If cancelled, default to the first e-mail in the list
                cont.resume(returning: "")
            })
            UIApplication.shared.topMostViewController?.present(alert, animated: true)
        }

        GlobalState.email = chosen
    }

    //  CalendarViewModel.swift
    //  MARK: - Build the JSON body used for POST / PATCH to Google Calendar
    //
    //  • Extracts attendees from EKEvent.attendees using the regex you already have
    //  • If GlobalState.email is still empty *and* there are ≥ 2 addresses,
    //    shows the e-mail-picker sheet and waits for the user’s choice
    //  • Builds the final `[String: Any]` body (skipping the primary address)
    //
    @MainActor
    private func makeGoogleEventBody(from event: EKEvent) async -> [String: Any] {

        // -------------------------------------------------------------
        // 1) Parse EKEvent.attendees → [Attendee]
        // -------------------------------------------------------------
        let input   = event.attendees?.description ?? ""
        let pattern = #"""
        UUID\s*=\s*(.*?);\s*name\s*=\s*(.*?);\s*email\s*=\s*(.*?);\s*phone\s*=\s*\((.*?)\);\s*status\s*=\s*(\d+);\s*role\s*=\s*(\d+);\s*type\s*=\s*(\d+)
        """#

        guard let regex = try? NSRegularExpression(pattern: pattern) else {
            fatalError("Bad regex for attendees")
        }

        var attendees: [Attendee] = []
        let nsrange = NSRange(input.startIndex..<input.endIndex, in: input)

        for m in regex.matches(in: input, range: nsrange) {
            func group(_ i: Int) -> String {
                let r = m.range(at: i)
                guard let swift = Range(r, in: input) else { return "" }
                return String(input[swift])
            }
            let phone = group(4) == "null" ? nil : group(4)
            attendees.append(
                Attendee(uuid:   group(1),
                         name:   group(2),
                         email:  group(3),
                         phone:  phone,
                         status: Int(group(5)) ?? 0,
                         role:   Int(group(6)) ?? 0,
                         type:   Int(group(7)) ?? 0)
            )
        }

        // -------------------------------------------------------------
        // 2) Let the user choose their “primary” e-mail once
        // -------------------------------------------------------------
        await pickPrimaryEmailIfNeeded(from: attendees)

        // -------------------------------------------------------------
        // 3) Convert the remaining attendees → Google JSON format
        // -------------------------------------------------------------
        var googleAttendeeDicts: [[String: Any]] = []

        print("GlobalState.email", GlobalState.email)
        for a in attendees where a.email != GlobalState.email {
            googleAttendeeDicts.append([
                "email"       : a.email,
                "displayName" : a.name,
                "optional"    : false          // mark them as required; change if you wish
            ])
        }

        // -------------------------------------------------------------
        // 4) Clean up notes (remove any “Video Call” blocks)
        // -------------------------------------------------------------
        let originalNotes  = event.notes ?? ""
        let sanitizedNotes = removeVideoCallBlock(from: originalNotes)

        // -------------------------------------------------------------
        // 5) Build & return the final body
        // -------------------------------------------------------------
        if event.isAllDay {
            let startDateStr = localAllDayDateString(event.startDate)
            let endDateStr   = localAllDayDateString(event.endDate)

            return [
                "summary"    : event.title ?? NSLocalizedString("(No Title)", comment: "Untitled synced event fallback"),
                "description": sanitizedNotes,
                "start"      : ["date": startDateStr],
                "end"        : ["date": endDateStr],
                "attendees"  : googleAttendeeDicts
            ]
        } else {
            return [
                "summary"    : event.title ?? NSLocalizedString("(No Title)", comment: "Untitled synced event fallback"),
                "description": sanitizedNotes,
                "start"      : ["dateTime": isoDateString(event.startDate)],
                "end"        : ["dateTime": isoDateString(event.endDate)],
                "attendees"  : googleAttendeeDicts
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
        case .invalidURL: return NSLocalizedString("Invalid URL", comment: "Sync error")
        case .rateLimit: return NSLocalizedString("Rate limit or insufficient permission", comment: "Sync error")
        case .networkError(let msg): return String(format: NSLocalizedString("Network error: %@", comment: "Sync network error"), msg)
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
//  StoredGoogleUser.swift  (or wherever the model lives)

struct StoredGoogleUser: Codable, Hashable, Identifiable {   // ← add Identifiable
    let uniqueID: UUID
    
    // Identifiable requirement
    var id: UUID { uniqueID }                                 // ← one-liner

    var userID: String?
    var email: String?
    var accessToken: String
    var accessTokenExpiration: Date
    var refreshToken: String?
    var idToken: String?
    var photoURL: String?
}


// MARK: - Методи за StoredGoogleUser
extension CalendarViewModel {
    
    // MARK: MULTI-ACCOUNT: signOut from a single user
    func signOutFromGoogle(user: StoredGoogleUser) {
        // Първо правим signOut, за да изчистим текущия session в Google SDK (в памет)
        GIDSignIn.sharedInstance.signOut()
        
        // След това извикваме disconnect, за да изтрием refresh token‑а от keychain‑а
        GIDSignIn.sharedInstance.disconnect { [weak self] error in
            Task { @MainActor in       //  ← hop to main actor
                guard let self else { return }

                if let error { print("Disconnect error:", error) }

                // 1) remove calendars
                self.removeLocalGoogleCalendars(forUserID: user.uniqueID)

                // 2) update model
                self.storedUsers.removeAll { $0.uniqueID == user.uniqueID }

                // 3) purge UserDefaults
                let prefix = user.uniqueID.uuidString
                let ud = UserDefaults.standard
                ud.removeObject(forKey: "GoogleToLocalEventMap_\(prefix)")
                ud.removeObject(forKey: "GoogleEventUpdatedMap_\(prefix)")
                ud.removeObject(forKey: "LastSyncDateKey_\(prefix)")

                // 4) clear in-memory maps
                self.googleToLocalEventMapAll.removeValue(forKey: prefix)
                self.googleEventUpdatedMapAll.removeValue(forKey: prefix)
                self.lastSyncDateAll.removeValue(forKey: prefix)

                // 5) stop timer if last user
                if self.storedUsers.isEmpty { self.stopGoogleCalendarSync() }

                // 6) persist & refresh UI state
                self.saveAllUsersToUserDefaults()
                self.reloadCalendars()
            }
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
        let email = gUser.profile?.email ?? "(no email)"
        
        let avatarURL = gUser.profile?.imageURL(withDimension: 96)?.absoluteString
        
        // Подготвяме потенциално новия потребител
        let newStoredUser = StoredGoogleUser(
            uniqueID: UUID(),
            userID: gUser.userID,
            email:  email,
            accessToken: accessToken,
            accessTokenExpiration: expiration!,
            refreshToken: refreshTokenString,
            idToken: idToken,
            photoURL: avatarURL
        )
        
        // 1) Проверяваме дали вече имаме този потребител по email или userID
        if let existingIndex = storedUsers.firstIndex(where: {
            // Може да изберете дали да проверявате по email, или по userID, или и двете.
            // Тук пример: същия имейл ИЛИ същия gUser.userID
            $0.email == email || ($0.userID == gUser.userID && gUser.userID != nil)
        }) {
            // => Вече имаме такъв акаунт => решаваме какво да правим:
            
            // (А) Просто пропускаме добавянето
            // print("User already exists => skip")
            // return
            
            // (Б) Или обновяваме токените на вече съществуващия запис
            var existingUser = storedUsers[existingIndex]
            existingUser.accessToken = newStoredUser.accessToken
            existingUser.accessTokenExpiration = newStoredUser.accessTokenExpiration
            existingUser.refreshToken = newStoredUser.refreshToken
            existingUser.idToken = newStoredUser.idToken
            existingUser.photoURL = newStoredUser.photoURL
            // По желание, ако userID / email са празни в стария, може да ги презапишем:
            // existingUser.userID = newStoredUser.userID
            // existingUser.email = newStoredUser.email
            
            storedUsers[existingIndex] = existingUser
            print("Updated existing Google user => \(email).")
        }
        else {
            // => Нямаме такъв акаунт => добавяме като нов
            storedUsers.append(newStoredUser)
            print("Added new Google user => \(email).")
        }
        
        // 2) Записваме (UserDefaults) + презареждаме map-овете
        self.saveAllUsersToUserDefaults()
        self.loadPerUserMaps(for: newStoredUser)
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
    func hasMicrosoftTeamsLink(in descriptor: EventDescriptor) -> Bool {
        guard let multi = descriptor as? EKMultiDayWrapper else { return false }
        let event = multi.realEvent
        guard let notes = event.notes?.lowercased() else { return false }
        return notes.contains("teams.live.com")
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

            // Създаваме web view parameters вместо deprecated parentViewController
            guard let presentingVC = topMostViewController() else {
                print("No view controller to present from.")
                return
            }
            let webParameters = MSALWebviewParameters(authPresentationViewController: presentingVC)

            // Нов инициализатор с webviewParameters
            let interactiveParameters = MSALInteractiveTokenParameters(
                scopes: scopes,
                webviewParameters: webParameters
            )
            interactiveParameters.promptType = .selectAccount

            application.acquireToken(with: interactiveParameters) { (result, error) in
                if let error = error {
                    print("MSAL error: \(error)")
                    return
                }
                guard let authResult = result else {
                    print("No MSAL result!")
                    return
                }

                // Обработка на токените и съхранение на user
                let accessToken = authResult.accessToken
                let expiresOn   = authResult.expiresOn ?? Date()
                let msID        = authResult.account.identifier
                let email       = authResult.account.username ?? "(No username)"
                let refresh     = "???"  // MSAL обикновено се грижи сам за refresh

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

                Task { @MainActor in
                    if let existingIndex = self.storedMsUsers.firstIndex(where: {
                        $0.msAccountID == msID || ($0.email == email && !email.isEmpty)
                    }) {
                        var existingUser = self.storedMsUsers[existingIndex]
                        existingUser.accessToken = accessToken
                        existingUser.accessTokenExpiration = expiresOn
                        existingUser.idToken = authResult.idToken
                        self.storedMsUsers[existingIndex] = existingUser
                        await self.performMicrosoftCalendarSync(for: existingUser)
                    } else {
                        self.storedMsUsers.append(newMsUser)
                        self.saveAllMsUsersToUserDefaults()
                        await self.performMicrosoftCalendarSync(for: newMsUser)
                    }
                }
            }
        } catch {
            print("MSAL init error:", error)
        }
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
                print("   - \(e.title ?? "(no title)") [\(String(describing: e.startDate)) - \(String(describing: e.endDate))] id=\(e.eventIdentifier ?? "?")")
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
        // Проверка дали вече има активен таймер
        guard msSyncTimer == nil else {
            print("startMicrosoftCalendarSync: вече има активен таймер => няма нужда да стартираме втори.")
            return
        }

        print("Start Microsoft Calendar sync timer…")
        msSyncTimer = Timer.scheduledTimer(withTimeInterval: 20, repeats: true) { [weak self] _ in
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

        return decoded.value
    }


    // -------------------------------------------------------------------------
    // MARK: - Microsoft helper to detect holiday calendar (by name)
    // -------------------------------------------------------------------------
    private func isMicrosoftHolidayCalendar(_ cal: MSCalendarItem) -> Bool {
        let lowerName = cal.name.lowercased()
        // Пример: "Holidays in Bulgaria", "US Holidays", "Birthdays" и т.н.
        if lowerName.contains("holiday") || lowerName.contains("birthdays") {
            return true
        }
        return false
    }


    // -------------------------------------------------------------------------
    // MARK: - syncMsCalendars(...)
    // -------------------------------------------------------------------------
    private func syncMsCalendars(
        _ msCalendars: [MSCalendarItem],
        forUser user: StoredMicrosoftUser,
        accessToken: String
    ) async {
        var map = msToLocalCalendarMap(for: user.uniqueID)
        var stillExistsIDs = Set<String>()

        for msCal in msCalendars {
            stillExistsIDs.insert(msCal.id)

            let msCalName = msCal.name
            let msCalID   = msCal.id
            let msColor   = UIColor.systemBlue

            // --- NEW: ако е holiday => сваляме го веднъж и прескачаме 2-way sync ---
            if isMicrosoftHolidayCalendar(msCal) {
                if map[msCalID] == nil {
                    // Създаваме локален календар и сваляме събития само веднъж
                    if let newLocalCal = createLocalCalendar(
                        googleCalendarName: msCalName,
                        googleCalendarColor: msColor
                    ) {
                        map[msCalID] = newLocalCal.calendarIdentifier
                        setMsToLocalCalendarMap(map, for: user.uniqueID)

                        await downloadAllMsEvents(
                            forMsCalendarID: msCalID,
                            user: user,
                            localCalendar: newLocalCal,
                            accessToken: accessToken
                        )
                    }
                }
                // След това continue => не правим двупосочно sync
                continue
            }
            // --- END HOLIDAY CHECK ---

            if let localID = map[msCalID],
               let localEKCal = eventStore.calendar(withIdentifier: localID) {

                // Ако името/цвета са различни, ъпдейтваме
                if localEKCal.title != msCalName ||
                   localEKCal.cgColor != msColor.cgColor {
                    localEKCal.title  = msCalName
                    localEKCal.cgColor = msColor.cgColor
                    do {
                        try eventStore.saveCalendar(localEKCal, commit: true)
                    } catch {
                        print("Error updating local MS calendar:", error.localizedDescription)
                    }
                }

                // Сваляме събития само ако е селектиран
                if selectedCalendarIDs.contains(localID) {
                    await downloadAllMsEvents(
                        forMsCalendarID: msCalID,
                        user: user,
                        localCalendar: localEKCal,
                        accessToken: accessToken
                    )
                } else {
                    print("Skipping MS download for not‑selected \(localID)")
                }

            } else {
                // Създаваме нов локален
                if let newLocalCal = createLocalCalendar(
                    googleCalendarName: msCalName,
                    googleCalendarColor: msColor
                ) {
                    map[msCalID] = newLocalCal.calendarIdentifier
                    setMsToLocalCalendarMap(map, for: user.uniqueID)

                    if selectedCalendarIDs.contains(newLocalCal.calendarIdentifier) {
                        await downloadAllMsEvents(
                            forMsCalendarID: msCalID,
                            user: user,
                            localCalendar: newLocalCal,
                            accessToken: accessToken
                        )
                    } else {
                        print("Skipping MS download for new local ID = \(newLocalCal.calendarIdentifier)")
                    }
                }
            }
        }

        // Трием локални, които ги няма вече в MS
        let currentMap = msToLocalCalendarMap(for: user.uniqueID)
        for (msCalID, localID) in currentMap {
            if !stillExistsIDs.contains(msCalID) {
                if let toRemove = eventStore.calendar(withIdentifier: localID) {
                    do {
                        try eventStore.removeCalendar(toRemove, commit: true)
                        print("Removed local MS-copy calendar:", toRemove.title)
                    } catch {
                        print("removeCalendar error:", error.localizedDescription)
                    }
                }
                var newMap = currentMap
                newMap.removeValue(forKey: msCalID)
                setMsToLocalCalendarMap(newMap, for: user.uniqueID)
            }
        }
    }


    // -------------------------------------------------------------------------
    // MARK: - performMicrosoftCalendarSync(for:)
    // -------------------------------------------------------------------------
    @MainActor
    func performMicrosoftCalendarSync(for user: StoredMicrosoftUser) async {
        // Проверка за изтичащ токен => refresh ако е нужно
        let freshUser = await refreshMicrosoftTokenIfNeeded(for: user) ?? user

        // Стар snapshot
        self.oldMsToLocalEventMap = msToLocalEventMap(for: freshUser.uniqueID)

        do {
            // MS → Local
            let msCalendars = try await fetchMsCalendarList(accessToken: freshUser.accessToken)
            await syncMsCalendars(msCalendars, forUser: freshUser, accessToken: freshUser.accessToken)

            // Local → MS
            let map = msToLocalCalendarMap(for: freshUser.uniqueID)
            for (msCalId, localCalId) in map {

                // --- NEW: пропускаме holiday/birthday календари ---
                if let foundCalItem = msCalendars.first(where: { $0.id == msCalId }),
                   isMicrosoftHolidayCalendar(foundCalItem) {
                    continue
                }
                // --- END ---

                guard selectedCalendarIDs.contains(localCalId) else { continue }

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
                if let msID = extractMsEventID(from: locEv),  // e.g., mscal://...
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
            print("fetchAllMsEvents: fetched chunk of \(chunk.count) events")

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
    @MainActor
       func uploadLocalChangesToMicrosoft(
           msCalId: String,
           user: StoredMicrosoftUser,
           accessToken: String,
           localCalendar: EKCalendar
       ) async {
           print("=== uploadLocalChangesToMicrosoft START for \(msCalId) => \(localCalendar.title) ===")

           // Примерно (може да го оставите, ако искате да го използвате за debug):
           let lastSync = msLastSyncDateAll[user.uniqueID.uuidString] ?? .distantPast
           print("Последна синхронизация беше: \(lastSync)")

           // 1) Изтегляме всички локални събития в разумен диапазон
           let oneYearAgo   = Date().addingTimeInterval(-3600 * 24 * 365)
           let oneYearAfter = Date().addingTimeInterval( 3600 * 24 * 365)
           let localEvents = fetchLocalEvents(in: localCalendar, startDate: oneYearAgo, endDate: oneYearAfter)

           // 2) **Премахваме** филтъра по `lastModifiedDate`. Качваме всички в този календар.
           //    (По‑добре е да имате собствен флаг или сравнение с "updatedMap", но тук показваме най-простия подход.)
           let changedEvents = localEvents
           
           print("Ще качим \(changedEvents.count) евента от локалния календар ‘\(localCalendar.title)’ към MS…")

           // 3) Качваме всяко събитие: PATCH, ако имаме mscal://ID, или POST, ако е ново (няма mscal://)
           for event in changedEvents {
               if let msID = extractMsEventID(from: event) {
                   // Вече съществува в MS => PATCH
                   let success = await patchMsEvent(
                       msCalId: msCalId,
                       msEventId: msID,
                       localEvent: event,
                       accessToken: accessToken,
                       user: user
                   )
                   if success {
                       print("PATCH MS ev => \(event.title ?? "Без име")")
                   }
               } else {
                   // Ново събитие => POST
                   let success = await postMsEvent(
                       msCalId: msCalId,
                       localEvent: event,
                       accessToken: accessToken,
                       user: user
                   )
                   if success {
                       print("POST MS ev => \(event.title ?? "Без име")")
                   }
               }
           }

           // 4) Обработваме изтрити (или изчезнали от map) локални евенти
           await uploadLocalDeletionsToMicrosoft(msCalId: msCalId, user: user, accessToken: accessToken)

           // 5) Обновяваме (по желание) `lastSyncDate` – ако искате да се отчита, че сме качили промените
           saveMsLastSyncDate(user.uniqueID, date: Date())

           print("=== uploadLocalChangesToMicrosoft END for \(msCalId) => \(localCalendar.title) ===")
       }
    /// Създава НОВ евент в MS Calendar (POST /me/calendars/{calId}/events)
    /// Creates a new event in Microsoft Calendar *with* a Teams link by default.
    private func postMsEvent(
        msCalId: String,
        localEvent: EKEvent,
        accessToken: String,
        user: StoredMicrosoftUser
    ) async -> Bool {
        // Примерен URL: https://graph.microsoft.com/v1.0/me/calendars/{calId}/events
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

        // Правим JSON тялото от локалния EKEvent, което вече включва "attendees"
        var bodyDict = await makeMsEventBody(from: localEvent)

        // Ако искаме да принудим Teams линк => добавяме:
        bodyDict["isOnlineMeeting"] = true
        bodyDict["onlineMeetingProvider"] = "teamsForBusiness"

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

            // Декодираме създадения евент
            let created = try JSONDecoder().decode(MSCalendarEvent.self, from: data)
            let newID   = created.id

            // Сетваме url = "mscal://{newID}" локално
            localEvent.url = URL(string: "mscal://\(newID)")

            // Ако има joinUrl => добавяме го в notes
            if let joinUrl = created.onlineMeeting?.joinUrl, !joinUrl.isEmpty {
                let teamsBlock = """
                ----( Video Call )----
                [Microsoft Teams]
                \(joinUrl)
                ---===---
                """
                let existingNotes = localEvent.notes ?? ""
                localEvent.notes = existingNotes.isEmpty
                    ? teamsBlock
                    : existingNotes + "\n\n" + teamsBlock
            }

            try eventStore.save(localEvent, span: .thisEvent, commit: true)

            // Обновяваме map:
            var evMap  = msToLocalEventMap(for: user.uniqueID)
            evMap[newID] = localEvent.eventIdentifier
            setMsToLocalEventMap(evMap, for: user.uniqueID)

            var updMap = msEventUpdatedMap(for: user.uniqueID)
            if let msUpdated = created.lastModifiedDateTime {
                updMap[newID] = msUpdated
            }
            setMsEventUpdatedMap(updMap, for: user.uniqueID)

            print("postMsEvent => created MS event with Teams link => \(localEvent.title ?? "(No title)")")
            return true
        } catch {
            print("postMsEvent: error =>", error.localizedDescription)
            return false
        }
    }



    /// Прави PATCH към Microsoft Graph, за да актуализира съществуващо събитие (MS Calendar Event).
    /// - Parameters:
    ///   - msCalId:     Идентификаторът на Microsoft календара (напр. "AAMkAG...").
    ///   - msEventId:   Идентификаторът на Microsoft събитието (url="mscal://{id}").
    ///   - localEvent:  Локалният EKEvent, от който вземаме заглавие, дати и т.н.
    ///   - accessToken: Валиден (неизтекъл) Access Token за Microsoft Graph.
    ///   - user:        StoredMicrosoftUser, който държи refreshToken и др.
    ///   - forceAddTeams: Ако е `true`, _винаги_ добавяме "isOnlineMeeting=true".
    ///
    /// Връща `true` при успех или `false` при грешка.
    private func patchMsEvent(
        msCalId: String,
        msEventId: String,
        localEvent: EKEvent,
        accessToken: String,
        user: StoredMicrosoftUser,
        forceAddTeams: Bool = false
    ) async -> Bool {

        guard
            let encodedCalID = msCalId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
            let encodedEvID  = msEventId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
            let url = URL(string: "\(kGraphEndpoint)v1.0/me/calendars/\(encodedCalID)/events/\(encodedEvID)")
        else {
            print("patchMsEvent: Bad URL!")
            return false
        }

        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=UTF-8", forHTTPHeaderField: "Content-Type")

        // Тялото вече включва "attendees"
        var bodyDict = await makeMsEventBody(from: localEvent)

        // Ако искаме винаги да добавяме Teams линк (или в notes има Teams), задаваме:
        if forceAddTeams {
            bodyDict["isOnlineMeeting"] = true
            bodyDict["onlineMeetingProvider"] = "teamsForBusiness"
        }

        guard let bodyData = try? JSONSerialization.data(withJSONObject: bodyDict, options: []) else {
            print("patchMsEvent: Не можем да сериализираме JSON!")
            return false
        }
        request.httpBody = bodyData

        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse, !(200...299).contains(httpResp.statusCode) {
                let errBody = String(data: data, encoding: .utf8) ?? ""
                print("patchMsEvent => HTTP \(httpResp.statusCode). body=\(errBody)")
                return false
            }

            let updated = try JSONDecoder().decode(MSCalendarEvent.self, from: data)

            // Обновяваме updatedMap, ако имаме lastModifiedDateTime
            if let newUpdated = updated.lastModifiedDateTime {
                var updMap = msEventUpdatedMap(for: user.uniqueID)
                updMap[msEventId] = newUpdated
                setMsEventUpdatedMap(updMap, for: user.uniqueID)
            }

            // Ако Graph върне onlineMeeting.joinUrl => вмъкваме го в notes (ако не съществува)
            if let joinUrl = updated.onlineMeeting?.joinUrl, !joinUrl.isEmpty {
                let teamsBlock = """
                ----( Video Call )----
                [Microsoft Teams]
                \(joinUrl)
                ---===---
                """
                let existingNotes = localEvent.notes ?? ""
                if !existingNotes.contains(joinUrl) {
                    localEvent.notes = existingNotes.isEmpty
                        ? teamsBlock
                        : existingNotes + "\n\n" + teamsBlock

                    do {
                        try eventStore.save(localEvent, span: .thisEvent, commit: true)
                    } catch {
                        print("patchMsEvent: грешка при save(localEvent) => \(error)")
                    }
                }
            }

            print("patchMsEvent => success => обновихме ‘\(localEvent.title ?? "")’ в MS (attendees са качени).")
            return true
        } catch {
            print("patchMsEvent => Error:", error.localizedDescription)
            return false
        }
    }



    /// Примерна структура `Attendee`, която вече имате:
    struct Attendee {
        let uuid: String
        let name: String
        let email: String
        let phone: String?
        let status: Int
        let role: Int
        let type: Int
    }

    // Примерен метод, който връща вашите Attendee обекти
    func extractMsAttendees(from event: EKEvent) -> [Attendee] {
        let input = event.attendees?.description ?? ""
        let pattern = #"""
        UUID\s*=\s*(.*?);\s*name\s*=\s*(.*?);\s*email\s*=\s*(.*?);\s*phone\s*=\s*\((.*?)\);\s*status\s*=\s*(\d+);\s*role\s*=\s*(\d+);\s*type\s*=\s*(\d+)
        """#

        guard let regex = try? NSRegularExpression(pattern: pattern, options: []) else {
            print("extractMsAttendees: invalid regex => return [].")
            return []
        }

        let nsrange = NSRange(input.startIndex..<input.endIndex, in: input)
        let matches = regex.matches(in: input, options: [], range: nsrange)

        var results: [Attendee] = []
        for match in matches {
            func getGroup(_ index: Int) -> String {
                let range = match.range(at: index)
                guard let swiftRange = Range(range, in: input) else { return "" }
                return String(input[swiftRange])
            }

            let uuid = getGroup(1)
            let name = getGroup(2)
            let email = getGroup(3)
            let phoneString = getGroup(4)
            let status = Int(getGroup(5)) ?? 0
            let role   = Int(getGroup(6)) ?? 0
            let type   = Int(getGroup(7)) ?? 0

            let phone: String? = (phoneString == "null" ? nil : phoneString)

            let att = Attendee(
                uuid: uuid,
                name: name,
                email: email,
                phone: phone,
                status: status,
                role: role,
                type: type
            )
            results.append(att)
        }
        return results
    }

    /// Помощна функция, която създава JSON речник (Dictionary)
    /// за тялото на заявка (POST / PATCH) към Microsoft Graph Events API.
    ///
    /// - Премахваме "video call" блокове от `notes`, за да не ги качваме обратно в MS.
    /// - Ако е all-day, пращаме `start.date` / `end.date`,
    ///   иначе `start.dateTime` / `end.dateTime`.
    ///
    /// Помощна функция, която създава JSON речник (Dictionary)
    /// за тялото на заявка (POST / PATCH) към Microsoft Graph Events API.
    ///
    /// - НЕ трием video call блоковете (Meet, Teams) от `notes`,
    ///   за да не губим информацията за онлайн срещата.
    /// Builds the dictionary for MS Graph `POST / PATCH` request body.
    /// This example does NOT remove any "video call" blocks from notes
    /// (so if you have existing Teams or Meet info, it will remain).
    //  CalendarViewModel.swift
    //  MARK: - Build Microsoft-Graph event body (attendees + primary-mail picker)

    @MainActor
    private func makeMsEventBody(from localEvent: EKEvent) async -> [String: Any] {

        // ------------------------------------------------------------------
        // 0) Basic fields (subject, body, start / end, location)
        // ------------------------------------------------------------------
        let subjectVal     = localEvent.title ?? "(No Title)"
        let originalNotes  = localEvent.notes ?? ""

        let bodyDict: [String: Any] = [
            "contentType": "text",
            "content": originalNotes
        ]

        var startDict: [String: Any] = [:]
        var endDict:   [String: Any] = [:]

        if localEvent.isAllDay {
            let fmt = DateFormatter()
            fmt.locale       = Locale(identifier: "en_US_POSIX")
            fmt.timeZone     = .init(secondsFromGMT: 0)
            fmt.dateFormat   = "yyyy-MM-dd"

            startDict = ["date": fmt.string(from: localEvent.startDate), "timeZone": "UTC"]
            endDict   = ["date": fmt.string(from: localEvent.endDate)  , "timeZone": "UTC"]
        } else {
            let iso = ISO8601DateFormatter()
            iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]

            startDict = ["dateTime": iso.string(from: localEvent.startDate), "timeZone": "UTC"]
            endDict   = ["dateTime": iso.string(from: localEvent.endDate) , "timeZone": "UTC"]
        }

        let locationDict: [String: Any] = [
            "displayName": localEvent.location ?? ""
        ]

        // ------------------------------------------------------------------
        // 1) Extract attendees & let the user pick their own e-mail once
        // ------------------------------------------------------------------
        let localAttendees = extractMsAttendees(from: localEvent)          // [Attendee]
        await pickPrimaryEmailIfNeeded(from: localAttendees)               // may show the picker

        // ------------------------------------------------------------------
        // 2) Transform attendees → Microsoft Graph format
        //    (skip the address stored in GlobalState.email)
        // ------------------------------------------------------------------
        var msAttendeeArray: [[String: Any]] = []

        for a in localAttendees where a.email != GlobalState.email {
            let typeString = (a.role == 1) ? "optional" : "required"       // your rule
            msAttendeeArray.append([
                "emailAddress": [
                    "address": a.email,
                    "name"   : a.name
                ],
                "type": typeString
            ])
        }

        // ------------------------------------------------------------------
        // 3) Assemble & return the final event dictionary
        // ------------------------------------------------------------------
        return [
            "subject"  : subjectVal,
            "body"     : bodyDict,
            "start"    : startDict,
            "end"      : endDict,
            "location" : locationDict,
            "attendees": msAttendeeArray
        ]
    }





    /// Качва локалните изтривания: т.е. евентите, които преди са били в msToLocalEventMap,
    /// но сега локално вече *не съществуват* (или са премахнати от речника).
    func uploadLocalDeletionsToMicrosoft(
          msCalId: String,
          user: StoredMicrosoftUser,
          accessToken: String
      ) async {
          // 1) Вземаме “стария” snapshot: oldMsToLocalEventMap (запазен преди sync)
          // 2) Вземаме “актуалния” map: msToLocalEventMap(for: user.uniqueID)
          //    за да видим дали някое msEventID липсва вече локално.
          
          let currentMap = msToLocalEventMap(for: user.uniqueID)
          
          for (msID, oldLocalID) in oldMsToLocalEventMap {
              // ако го няма в currentMap ИЛИ самото локално събитие вече не съществува в eventStore => трием от Microsoft
              
              let removedFromMap = (currentMap[msID] == nil)
              let stillExistsLocally = (eventStore.event(withIdentifier: oldLocalID) != nil)
              
              if removedFromMap || !stillExistsLocally {
                  // => трябва да го изтрием и от MS
                  let success = await deleteMsEvent(
                      msCalID: msCalId,
                      msEventID: msID,
                      accessToken: accessToken
                  )
                  if success {
                      print("Изтрихме MS евент => \(msID) (защото вече го няма локално)")
                      // махаме от map
                      var newMap = msToLocalEventMap(for: user.uniqueID)
                      newMap.removeValue(forKey: msID)
                      setMsToLocalEventMap(newMap, for: user.uniqueID)
                      
                      // махаме от msEventUpdatedMap
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


    
    private func createLocalMsEvent(_ msEvent: MSCalendarEvent,
                                    inCalendar: EKCalendar) -> EKEvent? {
        // Печат на JSON-а за дебъг
        print("===== ПОЛУЧЕН MSCalendarEvent =====")
        do {
            let encoded = try JSONEncoder().encode(msEvent)
            if let jsonStr = String(data: encoded, encoding: .utf8) {
                print(jsonStr)
            }
        } catch {
            print("Грешка при JSON encode на msEvent:", error.localizedDescription)
        }
        print("====================================\n")

        let newEvent = EKEvent(eventStore: eventStore)
        newEvent.calendar = inCalendar

        // За да знаем кое MS събитие е това:
        let msEventID = msEvent.id
        newEvent.url = URL(string: "mscal://\(msEventID)")

        // Заглавие, notes (примерно bodyPreview) и локация
        newEvent.title = msEvent.subject ?? "(No Title)"
        newEvent.notes = msEvent.bodyPreview ?? ""
        if let locName = msEvent.location?.displayName, !locName.isEmpty {
            newEvent.location = locName
        }

        // Ако има onlineMeeting.joinUrl => добавяме блок в notes
        if let joinUrl = msEvent.onlineMeeting?.joinUrl, !joinUrl.isEmpty {
            let videoCallBlock = """
            ----( Video Call )----
            [Microsoft Teams]
            \(joinUrl)
            ---===---
            """
            let existingNotes = newEvent.notes ?? ""
            newEvent.notes = existingNotes.isEmpty
                ? videoCallBlock
                : existingNotes + "\n\n" + videoCallBlock
        }

        // Парсваме start
        if let startStr = msEvent.start?.dateTime {
            // Вариант: dateTime (например "2025-03-27T10:00:00.0000000")
            if let startDate = parseMsDateTime(startStr) {
                newEvent.startDate = startDate
                newEvent.isAllDay  = false
            }
        } else if let dateOnlyStr = msEvent.start?.date {
            // Вариант: само дата ("2025-03-27") => all-day
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "en_US_POSIX")
            formatter.dateFormat = "yyyy-MM-dd"
            if let dateVal = formatter.date(from: dateOnlyStr) {
                newEvent.startDate = dateVal
                newEvent.isAllDay  = true
            }
        }

        // Парсваме end
        if let endStr = msEvent.end?.dateTime {
            if let endDate = parseMsDateTime(endStr) {
                newEvent.endDate = endDate
            } else {
                // fallback +1 час
                newEvent.endDate = newEvent.startDate.addingTimeInterval(3600)
            }
        } else if let endDateOnlyStr = msEvent.end?.date {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "en_US_POSIX")
            formatter.dateFormat = "yyyy-MM-dd"
            if let dateVal = formatter.date(from: endDateOnlyStr) {
                newEvent.endDate = dateVal
                newEvent.isAllDay = true
            } else {
                newEvent.endDate = newEvent.startDate.addingTimeInterval(3600)
            }
        }

        // Накрая save
        do {
            try eventStore.save(newEvent, span: .thisEvent, commit: true)
            print("Създаден локален EKEvent в календар ‘\(inCalendar.title)’ => ‘\(newEvent.title ?? "nil")’")
            return newEvent
        } catch {
            print("Грешка при save на локален EKEvent:", error.localizedDescription)
            return nil
        }
    }

    private func updateLocalEvent(_ localEvent: EKEvent,
                                  withMsEvent msEvent: MSCalendarEvent,
                                  inCalendar: EKCalendar) {
        print("updateLocalEvent => localEvent.id='\(localEvent.eventIdentifier ?? "?")' => msEvent.id=\(msEvent.id)")

        // Заглавие, notes, location
        localEvent.title = msEvent.subject ?? "(No Title)"
        localEvent.notes = msEvent.bodyPreview ?? ""
        localEvent.location = msEvent.location?.displayName ?? ""

        // Ако има onlineMeeting.joinUrl => добавяме го в notes (ако го няма вече)
        if let joinUrl = msEvent.onlineMeeting?.joinUrl, !joinUrl.isEmpty {
            let videoCallBlock = """
            ----( Video Call )----
            [Microsoft Teams]
            \(joinUrl)
            ---===---
            """
            let existing = localEvent.notes ?? ""
            if !existing.contains(joinUrl) {
                localEvent.notes = existing.isEmpty
                    ? videoCallBlock
                    : existing + "\n\n" + videoCallBlock
            }
        }

        // Принудително да сме в същия календар (по желание)
        localEvent.calendar = inCalendar

        // Обновяваме start/end
        if let startStr = msEvent.start?.dateTime {
            if let sDate = parseMsDateTime(startStr) {
                localEvent.startDate = sDate
                localEvent.isAllDay  = false
            }
        } else if let dateOnlyStr = msEvent.start?.date {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "en_US_POSIX")
            formatter.dateFormat = "yyyy-MM-dd"
            if let dateVal = formatter.date(from: dateOnlyStr) {
                localEvent.startDate = dateVal
                localEvent.isAllDay  = true
            }
        }
        if let endStr = msEvent.end?.dateTime {
            if let eDate = parseMsDateTime(endStr) {
                localEvent.endDate = eDate
            } else {
                localEvent.endDate = localEvent.startDate.addingTimeInterval(3600)
            }
        } else if let dateOnlyStr = msEvent.end?.date {
            let formatter = DateFormatter()
            formatter.locale = Locale(identifier: "en_US_POSIX")
            formatter.dateFormat = "yyyy-MM-dd"
            if let dateVal = formatter.date(from: dateOnlyStr) {
                localEvent.endDate = dateVal
                localEvent.isAllDay = true
            } else {
                localEvent.endDate = localEvent.startDate.addingTimeInterval(3600)
            }
        }

        // Save
        do {
            try eventStore.save(localEvent, span: .thisEvent, commit: true)
            print("Успешно обновен локален евент => title='\(localEvent.title ?? "")'")
        } catch {
            print("Грешка при update на локалния евент:", error.localizedDescription)
        }
    }
    

    func extractMsEventID(from event: EKEvent) -> String? {
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
    
    // Ново:
    let onlineMeeting: MSOnlineMeetingInfo?
}

struct MSOnlineMeetingInfo: Codable {
    let joinUrl: String?
    // Може да има и други полета (conferenceId, tollNumber...), ако искате.
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
extension CalendarViewModel {
    
    /// Проверява дали събитието е в някой от календарите на Microsoft.
    /// (Понеже вече имате msToLocalCalendarMap, можем директно да видим
    ///  дали `descriptor.calendarID` влиза в някой [msCalID: localCalID].values)
    func isMsCalendarEvent(_ descriptor: EventDescriptor) -> Bool {
        guard let multi = descriptor as? EKMultiDayWrapper else {
            return false
        }
        let localCalID = multi.realEvent.calendar.calendarIdentifier
        
        // Събираме всички локални calendarIdentifier-и, които са копие на *някой* Microsoft акаунт
        let allMsLocalIDs = storedMsUsers.flatMap { msToLocalCalendarMap(for: $0.uniqueID).values }
        
        return allMsLocalIDs.contains(localCalID)
    }

    /// Намира *кой* MS акаунт притежава този локален EKCalendar
    /// (Ако имате няколко MS акаунта – връща първия, който има map-ване към localCalID.)
    func findMicrosoftUser(for descriptor: EventDescriptor) -> StoredMicrosoftUser? {
        guard let multi = descriptor as? EKMultiDayWrapper else { return nil }
        let localCalID = multi.realEvent.calendar.calendarIdentifier

        for user in storedMsUsers {
            let userMap = msToLocalCalendarMap(for: user.uniqueID) // [msCalendarID : localCalendarID]
            if userMap.values.contains(localCalID) {
                return user
            }
        }
        return nil
    }
}
extension CalendarViewModel {
    /// Добавя Microsoft Teams видеосреща към посоченото събитие,
    /// като праща PATCH (isOnlineMeeting=true, onlineMeetingProvider=teamsForBusiness).
    /// - Parameters:
    ///   - descriptor: Вашият EventDescriptor (EKMultiDayWrapper)
    ///   - msUser: конкретният StoredMicrosoftUser (already found).
    /// Добавя Microsoft Teams видеосреща към посоченото събитие.
    /// - Parameters:
    ///   - descriptor: Вашият EventDescriptor (EKMultiDayWrapper)
    ///   - msUser: Потребителят (StoredMicrosoftUser), чийто акаунт ще ползваме за PATCH
    func addMicrosoftTeams(to descriptor: EventDescriptor, for msUser: StoredMicrosoftUser) {
        // 1) Проверяваме дали descriptor е EKMultiDayWrapper
        guard let multi = descriptor as? EKMultiDayWrapper else {
            print("addMicrosoftTeams: descriptor не е EKMultiDayWrapper => отказ.")
            return
        }

        // 2) Ако токенът е изтекъл, опитваме silent refresh
        if msUser.accessTokenExpiration < Date() {
            Task {
                // ако silent refresh успее, получаваме нов user
                let freshUser = await refreshMicrosoftTokenIfNeeded(for: msUser) ?? msUser
                // вече с новите данни, правим PATCH
                await self.patchMsEventToAddTeams(meDescriptor: multi, user: freshUser)
            }
        } else {
            // Токенът е валиден => директен PATCH
            Task {
                await self.patchMsEventToAddTeams(meDescriptor: multi, user: msUser)
            }
        }
    }

    
    /// Реално извършва PATCH: `isOnlineMeeting=true`, `onlineMeetingProvider=teamsForBusiness`.
    /// Реално извършва PATCH isOnlineMeeting=true.
    /// - Important: Проверява дали събитието има `url = "mscal://{someID}"`.
    private func patchMsEventToAddTeams(meDescriptor: EKMultiDayWrapper, user: StoredMicrosoftUser) async {
        // 1) Опитваме да извлечем msEventID от локалния EKEvent.url (примерно "mscal://1234-ABC...")
        let msEventID = extractMsEventID(from: meDescriptor.realEvent)
        guard let msEventID = msEventID else {
            print("patchMsEventToAddTeams: Нямаме mscal://{id} в event.url => отказ.")
            return
        }
        
        // 2) Намираме кой msCalendarID от map отговаря на localCalendarID
        let localCalID = meDescriptor.realEvent.calendar.calendarIdentifier
        guard let msCalID = msToLocalCalendarMap(for: user.uniqueID)
            .first(where: { $0.value == localCalID })?.key
        else {
            print("patchMsEventToAddTeams: не откривам msCalendarID за този localCalID => отказ.")
            return
        }
        
        // 3) Ползваме вече съществуващия patchMsEvent(...) с параметър forceAddTeams = true
        let success = await self.patchMsEvent(
            msCalId: msCalID,
            msEventId: msEventID,
            localEvent: meDescriptor.realEvent,
            accessToken: user.accessToken,
            user: user,
            forceAddTeams: true
        )
        if success {
            print("Add Microsoft Teams => success!")
        }
    }
    func addMicrosoftTeamsLink(to event: EKEvent, msCalendarId: String, accessToken: String) async -> String? {
        // Извличаме идентификатора на MS събитието от URL-а на EKEvent
        guard let msEventID = extractMsEventID(from: event) else {
            print("Събитието няма валиден mscal:// идентификатор.")
            return nil
        }
        
        // Енкодваме идентификаторите за безопасност в URL-а
        let encodedCalendarId = msCalendarId.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? msCalendarId
        let encodedEventId = msEventID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? msEventID
        
        // Създаваме URL-а за PATCH заявката
        let urlString = "https://graph.microsoft.com/v1.0/me/calendars/\(encodedCalendarId)/events/\(encodedEventId)?conferenceDataVersion=1"
        guard let url = URL(string: urlString) else {
            print("Невалиден URL: \(urlString)")
            return nil
        }
        
        // Настройваме PATCH заявката
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        
        // Тялото на заявката казва, че искаме онлайн среща с Teams
        let body: [String: Any] = [
            "isOnlineMeeting": true,
            "onlineMeetingProvider": "teamsForBusiness"
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])
        } catch {
            print("Грешка при сериализация на JSON: \(error)")
            return nil
        }
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
                print("Заявката не беше успешна. HTTP код: \((response as? HTTPURLResponse)?.statusCode ?? -1)")
                return nil
            }
            
            // Опитваме се да декодираме отговора, за да извлечем join URL
            if let jsonObject = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let onlineMeeting = jsonObject["onlineMeeting"] as? [String: Any],
               let joinUrl = onlineMeeting["joinUrl"] as? String {
                print("Успешно създадохме Teams среща. Линк: \(joinUrl)")
                return joinUrl
            } else {
                print("Не можа да се извлече Teams линк от отговора.")
                return nil
            }
        } catch {
            print("Грешка при изпълнение на заявката: \(error)")
            return nil
        }
    }

}
import Foundation
import GoogleSignIn
import EventKit

extension CalendarViewModel {
    
    // MARK: - Google Calendar Sharing (ACL)

    /// Взима списъка от ACL (Access Control List) правила за даден Google календар.
    /// За да разберем с кого е споделен календарът, ще извлечем “scope.type=email”
    /// и “scope.value=имейл адрес” от JSON отговора.
    func fetchGoogleCalendarAclList(
        googleCalendarID: String,
        accessToken: String
    ) async throws -> [GoogleCalendarACLRule] {
        guard let encCalID = googleCalendarID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let url = URL(string: "https://www.googleapis.com/calendar/v3/calendars/\(encCalID)/acl")
        else {
            throw NSError(domain: "BadURL", code: -1, userInfo: nil)
        }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        if let httpResp = response as? HTTPURLResponse, httpResp.statusCode >= 300 {
            let body = String(data: data, encoding: .utf8) ?? ""
            throw NSError(domain: "fetchGoogleCalendarAclList", code: httpResp.statusCode, userInfo: [
                NSLocalizedDescriptionKey: "HTTP \(httpResp.statusCode): \(body)"
            ])
        }
        
        let decoded = try JSONDecoder().decode(GoogleCalendarACLListResponse.self, from: data)
        return decoded.items
    }
    
    /// Добавя ново ACL правило (споделяне) за даден Google календар с конкретен имейл.
    /// - parameter ruleRole: Какви права даваме – например "reader" (само четене) или "writer".
    ///   Ако искаме да даваме и права за „управление“, това е "owner", но обикновено се внимава с това.
    func insertGoogleCalendarAcl(
        googleCalendarID: String,
        accessToken: String,
        emailToShare: String,
        ruleRole: String = "reader"
    ) async throws -> GoogleCalendarACLRule {
        guard let encCalID = googleCalendarID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let url = URL(string: "https://www.googleapis.com/calendar/v3/calendars/\(encCalID)/acl")
        else {
            throw NSError(domain: "BadURL", code: -1, userInfo: nil)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        
        // Тялото: даваме права "reader" или "writer" на конкретен имейл
        let bodyDict: [String: Any] = [
            "scope": [
                "type": "user",
                "value": emailToShare
            ],
            "role": ruleRole
        ]
        
        let bodyData = try JSONSerialization.data(withJSONObject: bodyDict, options: [])
        request.httpBody = bodyData
        
        let (data, response) = try await URLSession.shared.data(for: request)
        if let httpResp = response as? HTTPURLResponse, httpResp.statusCode >= 300 {
            let body = String(data: data, encoding: .utf8) ?? ""
            throw NSError(domain: "insertGoogleCalendarAcl", code: httpResp.statusCode, userInfo: [
                NSLocalizedDescriptionKey: "HTTP \(httpResp.statusCode): \(body)"
            ])
        }
        
        let decoded = try JSONDecoder().decode(GoogleCalendarACLRule.self, from: data)
        return decoded
    }
    
    /// Изтрива вече създадено ACL правило – за да махнем даден имейл от споделянията.
    /// Това означава, че трябва да знаем ID-то на самото правило "aclId", което обикновено е "user:somebody@domain.com".
    func deleteGoogleCalendarAclRule(
        googleCalendarID: String,
        aclRuleID: String,
        accessToken: String
    ) async throws {
        guard let encCalID = googleCalendarID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let encAclID = aclRuleID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let url = URL(string: "https://www.googleapis.com/calendar/v3/calendars/\(encCalID)/acl/\(encAclID)")
        else {
            throw NSError(domain: "BadURL", code: -1, userInfo: nil)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (_, response) = try await URLSession.shared.data(for: request)
        if let httpResp = response as? HTTPURLResponse, httpResp.statusCode >= 300 {
            throw NSError(domain: "deleteGoogleCalendarAclRule", code: httpResp.statusCode, userInfo: [
                NSLocalizedDescriptionKey: "HTTP \(httpResp.statusCode)"
            ])
        }
    }
}

// MARK: - Модели
struct GoogleCalendarACLListResponse: Codable {
    let kind: String
    let etag: String
    let items: [GoogleCalendarACLRule]
}

// Предполагаеми модели:
struct GoogleCalendarACLRule: Codable, Identifiable {
    var id: String               // "user:someone@gmail.com"
    var scope: GoogleACLScope?   // (type: "user", value: "someone@gmail.com")
    var role: String             // "owner", "writer", "reader"
}


struct GoogleACLScope: Codable, Equatable {
    var type: String    // "user", "group", "domain", "default"
    var value: String?
}
extension CalendarViewModel {
    func updateGoogleCalendarAclRule(googleCalendarID: String,
                                     aclRuleID: String,
                                     accessToken: String,
                                     newRole: String) async throws {
        // Енкодваме calendarID и aclRuleID за URL-а
        guard let encodedCalendarID = googleCalendarID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let encodedAclRuleID = aclRuleID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
              let url = URL(string: "https://www.googleapis.com/calendar/v3/calendars/\(encodedCalendarID)/acl/\(encodedAclRuleID)") else {
            throw NSError(domain: "updateGoogleCalendarAclRule", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        
        // Създаваме JSON тялото с новата роля
        let body: [String: Any] = ["role": newRole]
        request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])
        
        let (data, response) = try await URLSession.shared.data(for: request)
        if let httpResponse = response as? HTTPURLResponse, !(200...299).contains(httpResponse.statusCode) {
            let responseBody = String(data: data, encoding: .utf8) ?? ""
            throw NSError(domain: "updateGoogleCalendarAclRule", code: httpResponse.statusCode, userInfo: [NSLocalizedDescriptionKey: "HTTP \(httpResponse.statusCode): \(responseBody)"])
        }
        // При успех може да декодирате отговора ако е необходимо
    }
}
// Модели за People API:
struct GoogleConnectionsResponse: Codable {
    let connections: [Person]?
}

struct Person: Codable {
    let names: [Name]?
    let emailAddresses: [EmailAddress]?
    let phoneNumbers: [PhoneNumber]?
}

struct Name: Codable {
    let givenName: String?
    let familyName: String?
}

struct EmailAddress: Codable {
    let value: String?
}

struct PhoneNumber: Codable {
    let value: String?
}

// Служебна структура, за да ни е по-лесно да подадем данните към createOrUpdateLocalContact(...)
struct GoogleContact {
    let givenName: String?
    let familyName: String?
    let emails: [String]
    let phones: [String]
}

extension CalendarViewModel {
    
    /// Тегли контактите от Google People API (използвайки contacts.readonly scope),
    /// и за всеки ги създава/обновява в iOS Contacts.
    @MainActor
    func fetchGoogleContactsAndSaveLocally(for user: StoredGoogleUser) async {
        // 1) Проверка за валиден accessToken (ако е изтекъл => refresh).
        var currentUser = user
        if user.accessTokenExpiration < Date(), let rToken = user.refreshToken {
            do {
                let (newAccess, newExp, newIDT) = try await refreshTokens(refreshToken: rToken)
                currentUser.accessToken = newAccess
                currentUser.accessTokenExpiration = newExp
                currentUser.idToken = newIDT
                updateUserInMemory(currentUser)
                saveAllUsersToUserDefaults()
            } catch {
                print("fetchGoogleContactsAndSaveLocally: Failed to refresh => \(error)")
                return
            }
        }
        
        let accessToken = currentUser.accessToken
        
        // 2) Подготвяме People API заявка (примерно, v1/people/me/connections)
        guard let url = URL(string: "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers") else {
            print("Bad URL for People API")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse,
               !(200...299).contains(httpResp.statusCode) {
                let body = String(data: data, encoding: .utf8) ?? ""
                print("Error: People API => HTTP \(httpResp.statusCode). Body=\(body)")
                return
            }
            
            // 3) Декодираме JSON
            let decoded = try JSONDecoder().decode(GoogleConnectionsResponse.self, from: data)
            let connections = decoded.connections ?? []
            print("Got \(connections.count) Google contacts from People API.")
            
            // 4) Трябва да поискаме достъп до iOS Contacts
            let contactStore = CNContactStore()
            let granted = try await contactStore.requestAccess(for: .contacts)
            if !granted {
                print("User did NOT grant contacts permission => abort.")
                return
            }
            
            // 5) Минаваме през всеки Google контакт
            for person in connections {
                let names = person.names ?? []
                let emails = person.emailAddresses?.compactMap { $0.value } ?? []
                let phones = person.phoneNumbers?.compactMap { $0.value } ?? []
                
                // Вземаме името от първия елемент (ако има)
                let firstName  = names.first?.givenName
                let familyName = names.first?.familyName
                
                let gContact = GoogleContact(
                    givenName: firstName,
                    familyName: familyName,
                    emails: emails,
                    phones: phones
                )
                
                // 6) Създаваме/обновяваме в локалните iOS Contacts
                createOrUpdateLocalContact(gContact, contactStore: contactStore)
            }
            
        } catch {
            print("fetchGoogleContactsAndSaveLocally: Error => \(error)")
        }
    }
    @MainActor
    func fetchGoogleOtherContactsAndSaveLocally(for user: StoredGoogleUser) async {
        // 1) Проверяваме дали токенът е валиден, иначе – refresh:
        var currentUser = user
        if user.accessTokenExpiration < Date(), let rToken = user.refreshToken {
            do {
                let (newAcc, newExp, newID) = try await refreshTokens(refreshToken: rToken)
                currentUser.accessToken = newAcc
                currentUser.accessTokenExpiration = newExp
                currentUser.idToken = newID
                updateUserInMemory(currentUser)
                saveAllUsersToUserDefaults()
            } catch {
                print("Failed to refresh => \(error)")
                return
            }
        }
        
        let accessToken = currentUser.accessToken
        
        // 2) People API заявка за другите контакти
        guard let url = URL(string: "https://people.googleapis.com/v1/otherContacts?readMask=names,emailAddresses,phoneNumbers") else {
            print("Bad URL for People API (otherContacts)")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            if let httpResp = response as? HTTPURLResponse,
               !(200...299).contains(httpResp.statusCode) {
                let body = String(data: data, encoding: .utf8) ?? ""
                print("People API otherContacts error => HTTP \(httpResp.statusCode). Body=\(body)")
                return
            }
            
            // 3) Моделът тук е леко различен от people/me/connections:
            //    Официалният тип на отговора е People API `ListOtherContactsResponse`.
            struct ListOtherContactsResponse: Codable {
                let otherContacts: [Person]?
            }
            
            let decoded = try JSONDecoder().decode(ListOtherContactsResponse.self, from: data)
            let otherContacts = decoded.otherContacts ?? []
            
            print("Got \(otherContacts.count) 'other' Google contacts.")
            
            // 4) Искаме permission за iOS Contacts (ако нямаме вече)
            let contactStore = CNContactStore()
            let granted = try await contactStore.requestAccess(for: .contacts)
            guard granted else {
                print("No iOS Contacts permission => abort.")
                return
            }
            
            // 5) Обхождаме всеки Person (подобно на fetchGoogleContactsAndSaveLocally)
            for person in otherContacts {
                let names = person.names ?? []
                let firstName = names.first?.givenName
                let familyName = names.first?.familyName
                let emails = person.emailAddresses?.compactMap { $0.value } ?? []
                let phones = person.phoneNumbers?.compactMap { $0.value } ?? []
                
                let gContact = GoogleContact(
                    givenName: firstName,
                    familyName: familyName,
                    emails: emails,
                    phones: phones
                )
                
                // Създаваме/ъпдейтваме в iOS Contacts:
                createOrUpdateLocalContact(gContact, contactStore: contactStore)
            }
            
        } catch {
            print("fetchGoogleOtherContactsAndSaveLocally error => \(error)")
        }
    }

    
    /// Търси дали вече съществува iOS контакт с даден email (примерна логика).
    /// Ако има – може да върнем CNMutableContact (ако искаме да го ъпдейтнем).
    private func findLocalContactByEmail(_ email: String,
                                         contactStore: CNContactStore) -> CNMutableContact? {
        let predicate = CNContact.predicateForContacts(matchingEmailAddress: email)
        let keys = [
            CNContactIdentifierKey,
            CNContactGivenNameKey,
            CNContactFamilyNameKey,
            CNContactEmailAddressesKey,
            CNContactPhoneNumbersKey
        ] as [CNKeyDescriptor]
        
        do {
            let contacts = try contactStore.unifiedContacts(matching: predicate, keysToFetch: keys)
            if let found = contacts.first {
                // Преобразуваме го в mutable, за да можем да ъпдейтваме
                return found.mutableCopy() as? CNMutableContact
            } else {
                return nil
            }
        } catch {
            print("Error searching contact by email:", error)
            return nil
        }
    }
    
    /// Създава/ъпдейтва локален iOS контакт, базиран на данните от GoogleContact
    private func createOrUpdateLocalContact(_ gContact: GoogleContact,
                                            contactStore: CNContactStore) {
        // 1) Ако нямаме имейли изобщо, може да решим да пропуснем
        print("gContact",gContact)
        guard let firstEmail = gContact.emails.first else {
            return
        }
        
        // 2) Опитваме да намерим съществуващ контакт по email
        if let existing = findLocalContactByEmail(firstEmail, contactStore: contactStore) {
            // ========== АКО ВЕЧЕ ИМА КОНТАКТ ==========
            
            var needSave = false  // ще отметнем, ако има промяна и трябва да записваме
            
            // (A) Ъпдейт на име
            if let newFirstName = gContact.givenName,
               !newFirstName.isEmpty,
               newFirstName != existing.givenName {
                existing.givenName = newFirstName
                needSave = true
            }
            
            // (B) Ъпдейт на фамилия
            if let newFamilyName = gContact.familyName,
               !newFamilyName.isEmpty,
               newFamilyName != existing.familyName {
                existing.familyName = newFamilyName
                needSave = true
            }
            
            // (C) Ъпдейт на телефони (ако липсват)
            let existingPhones = existing.phoneNumbers.map { ($0.value as CNPhoneNumber).stringValue }
            for phone in gContact.phones {
                if !existingPhones.contains(phone) {
                    let newValue = CNLabeledValue(
                        label: CNLabelPhoneNumberMobile,
                        value: CNPhoneNumber(stringValue: phone)
                    )
                    existing.phoneNumbers.append(newValue)
                    needSave = true
                }
            }
            
            // (D) Ъпдейт на имейли (ако липсват допълнителни)
            let existingEmails = existing.emailAddresses.map { $0.value as String }
            for e in gContact.emails {
                if !existingEmails.contains(e) {
                    let newEmailValue = CNLabeledValue(
                        label: CNLabelHome,
                        value: e as NSString
                    )
                    existing.emailAddresses.append(newEmailValue)
                    needSave = true
                }
            }
            
            if needSave {
                let saveReq = CNSaveRequest()
                saveReq.update(existing)
                do {
                    try contactStore.execute(saveReq)
                    print("Updated existing contact:", existing.identifier)
                } catch {
                    print("Error updating contact:", error)
                }
            } else {
                print("No changes needed for:", existing.identifier)
            }
            
            return
        }
        
        // ========== АКО НЯМА ТАКЪВ КОНТАКТ (с този email) => СЪЗДАВАМЕ ==========
        let newContact = CNMutableContact()
        newContact.givenName  = gContact.givenName ?? ""
        newContact.familyName = gContact.familyName ?? ""
        
        // Имейли:
        newContact.emailAddresses = gContact.emails.map {
            CNLabeledValue(label: CNLabelHome, value: $0 as NSString)
        }
        
        // Телефони:
        newContact.phoneNumbers = gContact.phones.map {
            CNLabeledValue(label: CNLabelPhoneNumberMobile, value: CNPhoneNumber(stringValue: $0))
        }
        
        let saveReq = CNSaveRequest()
        saveReq.add(newContact, toContainerWithIdentifier: nil)
        do {
            try contactStore.execute(saveReq)
            print("Created new iOS contact => \(newContact.identifier)")
        } catch {
            print("Error creating contact:", error)
        }
    }
    
    private func syncRequestAccessToCalendar() -> Bool {
        var granted = false
        let sema = DispatchSemaphore(value: 0)

        Task {                                   // runs on main actor because
            granted = await self.requestCalendarAccess()   // ✨ explicit self
            sema.signal()
        }

        sema.wait()
        return granted
    }



}

extension CalendarViewModel {
    /// Множество от calendarIdentifier-и, които трябва да се виждат.
    /// • Ако няма отметнати календари – показваме всички.
    var visibleCalendarIDs: Set<String> {
        let selected = calendarsDict.filter { $0.value.selected }
        return selected.isEmpty
            ? Set(calendarsDict.keys)
            : Set(selected.keys)
    }
}

extension CalendarViewModel{
    /// Hex string „#RRGGBB“ от UIColor
    private func hexRGB(from uiColor: UIColor) -> String {
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        uiColor.getRed(&r, green: &g, blue: &b, alpha: &a)
        return String(format: "#%02X%02X%02X", Int(r*255), Int(g*255), Int(b*255))
    }

    /// PATCH /users/me/calendarList/{calendarId}?colorRgbFormat=true
    private func patchCalendarColor(
        calendarID: String,
        background: UIColor,
        accessToken: String
    ) async {
        let hex = hexRGB(from: background)
        
        guard
            let encID = calendarID.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed),
            let url   = URL(string:
                "https://www.googleapis.com/calendar/v3/users/me/calendarList/\(encID)?colorRgbFormat=true")
        else { return }
        
        var req = URLRequest(url: url)
        req.httpMethod = "PATCH"
        req.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        req.setValue("application/json",     forHTTPHeaderField: "Content-Type")
        
        // Google изчислява подходящ „foregroundColor“; можете да зададете и свой.
        let body = ["backgroundColor": hex]
        req.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        do {
            let (_, resp) = try await URLSession.shared.data(for: req)
            if let http = resp as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
                print("patchCalendarColor → HTTP\(http.statusCode)")
            }
        } catch { print("patchCalendarColor error:", error) }
    }
    // MARK: - Create Google calendar then local copy
    @MainActor
    func addGoogleCalendar(name: String, color uiColor: UIColor, for user: StoredGoogleUser) async {
        // 1. Ensure we have a fresh access token
        var gUser = user
        if gUser.accessTokenExpiration < Date(), let r = gUser.refreshToken {
            do {
                let (newAcc, newExp, newIDT) = try await refreshTokens(refreshToken: r)
                gUser.accessToken = newAcc
                gUser.accessTokenExpiration = newExp
                gUser.idToken = newIDT
                updateUserInMemory(gUser);  saveAllUsersToUserDefaults()
            } catch {
                print("addGoogleCalendar: refresh error →", error); return
            }
        }

        // 2. POST to https://www.googleapis.com/calendar/v3/calendars
        struct CreateBody: Encodable { let summary: String }
        guard let url = URL(string: "https://www.googleapis.com/calendar/v3/calendars"),
              let body = try? JSONEncoder().encode(CreateBody(summary: name)) else { return }

        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("Bearer \(gUser.accessToken)", forHTTPHeaderField: "Authorization")
        req.setValue("application/json",               forHTTPHeaderField: "Content-Type")
        req.httpBody = body

        do {
            let (data, resp) = try await URLSession.shared.data(for: req)
            guard let http = resp as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
                let txt = String(data: data, encoding: .utf8) ?? ""
                print("addGoogleCalendar: HTTP-\( (resp as? HTTPURLResponse)?.statusCode ?? 0) → \(txt)")
                return
            }
            struct Resp: Decodable { let id: String }
            let gCalID = try JSONDecoder().decode(Resp.self, from: data).id
            await patchCalendarColor(calendarID: gCalID,      // ← НОВО
                                     background: uiColor,
                                     accessToken: gUser.accessToken)
            print("✅ Created Google calendar →", gCalID)

            // 3. Create the *local* EKCalendar copy & map it
            if let localCal = createLocalCalendar(
                googleCalendarName: name,
                googleCalendarColor: uiColor
            ) {
                var map = googleToLocalCalendarMap(for: gUser.uniqueID)
                map[gCalID] = localCal.calendarIdentifier
                setGoogleToLocalCalendarMap(map, for: gUser.uniqueID)
                // auto-select it if user’s current filters allow
                selectedCalendarIDs.insert(localCal.calendarIdentifier)
                reloadCalendars()
                print("🗓  Local copy created →", localCal.title)
            }
        } catch {
            print("addGoogleCalendar: error →", error)
        }
    }
}
