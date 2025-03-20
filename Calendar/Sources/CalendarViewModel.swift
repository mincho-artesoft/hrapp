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
    
    // MARK: - EventKit Store & Properties
    let eventStore: EKEventStore = EKEventStore()

    /// Съхраняваме всички намерени EKCalendar (локални, iCloud, Outlook, и т.н.)
    @Published var allCalendars: [EKCalendar] = []
    
    /// Събития (по дни и по ID) - примерно за месечен/годишен календар
    @Published var eventsByDay: [Date: [EKEvent]] = [:]
    @Published var eventsByID:  [String: EKEvent] = [:]

    /// Дали вече имаме достъп до iOS Календара (EventKit)
    @Published var accessGranted = false

    /// IDs на календари, които потребителят е маркирал като "show"
    @Published var selectedCalendarIDs: Set<String> = []

    /// Dictionary за вашите локални календари
    @Published var calendarsDict: [String: (title: String, color: UIColor, selected: Bool, calendar: EKCalendar)] = [:]
    
    /// Пазим UI цвят (UIColor) на първия локален календар (за някои цели)
    @Published var firstLocalCalendarColor: UIColor?

    /// Singleton, за да се ползва по цялото приложение
    static let shared = CalendarViewModel()

    /// Можем да използваме този Calendar за изчисления (gregorian)
    let calendar = Calendar(identifier: .gregorian)
    
    private var cancellables = Set<AnyCancellable>()
    
    // Sync Token Storage: [GoogleCalendarID: SyncToken]
    @Published var syncTokens: [String: String] = [:]
    private let syncTokensKey = "GoogleCalendarSyncTokensKey"
    
    // Periodic Sync Timer
    private var syncTimer: Timer?
    
    // MARK: - Google -> Local Calendar Mapping
    /// Речник: Google Calendar ID -> Local EKCalendar ID
    @Published var googleToLocalCalendarMapping: [String: String] = [:]
    private let googleToLocalCalendarMappingKey = "GoogleToLocalCalendarMappingKey"

    // MARK: - Google -> Local Event Mapping (за да избегнем дубликати)
    /// Речник: Google Event ID -> Local EKEvent.eventIdentifier
    @Published var googleToLocalEventMapping: [String: String] = [:]
    private let googleToLocalEventMappingKey = "GoogleToLocalEventMappingKey"
    
    // MARK: - Нови флагове за Google влизане и избягване на цикли:
    /// Дали потребителят е логнат в Google (за да знаем дали да синхронизираме автоматично)
    @Published var isGoogleSignedIn: Bool = false
    
    /// Флаг, който показва, че **в момента** импортираме данни от Google.
    /// Цел: да не влиза в безкраен цикъл, ако импортирането задейства `eventStoreDidChange(_:)`
    private var isImportingGoogleData = false

    // MARK: - Инициализатор
    init() {
        // 1) Зареждаме локални календари от EventKit
        loadLocalCalendars()
        
        // 2) Зареждаме selectedCalendarIDs (ако има) от UserDefaults
        if let storedArray = UserDefaults.standard.array(forKey: "SelectedCalendarIDsKey") as? [String],
           !storedArray.isEmpty {
            self.selectedCalendarIDs = Set(storedArray)
        } else {
            // Ако няма нищо запазено => селектираме всички налични EKCalendar
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
        
        // 4) Зареждаме вече запазен mapping за Calendar
        if let data = UserDefaults.standard.data(forKey: googleToLocalCalendarMappingKey),
           let mapping = try? JSONDecoder().decode([String: String].self, from: data) {
            self.googleToLocalCalendarMapping = mapping
            print("googleToLocalCalendarMapping", googleToLocalCalendarMapping)
        } else {
            self.googleToLocalCalendarMapping = [:]
        }
        
        // 5) Зареждаме вече запазен mapping за Event
        if let data = UserDefaults.standard.data(forKey: googleToLocalEventMappingKey),
           let mapping = try? JSONDecoder().decode([String: String].self, from: data) {
            self.googleToLocalEventMapping = mapping
            print("googleToLocalEventMapping", googleToLocalEventMapping)
        } else {
            self.googleToLocalEventMapping = [:]
        }
        
        if let data = UserDefaults.standard.data(forKey: syncTokensKey),
           let tokens = try? JSONDecoder().decode([String: String].self, from: data) {
            self.syncTokens = tokens
        }
        else {
            self.syncTokens = [:]
        }
        
        // 6) Абонираме се за промени в Event Store:
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(eventStoreDidChange(_:)),
            name: .EKEventStoreChanged,
            object: eventStore
        )
        
        // (По желание) опит за auto-login в Google:
        // GIDSignIn.sharedInstance.restorePreviousSignIn { ... }
        GIDSignIn.sharedInstance.restorePreviousSignIn { [weak self] user, error in
            guard let self = self else { return }
            if user != nil && error == nil {
                self.isGoogleSignedIn = true
                self.startPeriodicSync()
            }
        }
    }
    
    private func startPeriodicSync() {
        syncTimer?.invalidate()
        syncTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            Task { [weak self] in
                await self?.syncWithGoogleCalendars()
            }
        }
        // Run immediately on start
        Task {
            await syncWithGoogleCalendars()
        }
    }
        
    func stopPeriodicSync() {
        syncTimer?.invalidate()
        syncTimer = nil
    }
    
    /// Това ще се вика всеки път, когато има промяна (добавяне, триене или редакция на събитие/календар)
    @objc private func eventStoreDidChange(_ notification: Notification) {
        print("EKEventStore has changed! Ще презаредим...")

        // 1) Запазваме старите събития:
        let oldEventsDict = self.eventsByID

        // 2) Презареждаме списъка календари
        reloadCalendars()
        
        // 3) Презареждаме събитията за текущия месец (примерно)
        loadEvents(for: Date())
        
        // 4) Вземаме „новите“ събития
        let newEventsDict = self.eventsByID
        
        let oldIDs = Set(oldEventsDict.keys)
        let newIDs = Set(newEventsDict.keys)
        
        let addedIDs            = newIDs.subtracting(oldIDs)      // току-що добавени (локално)
        let removedIDs          = oldIDs.subtracting(newIDs)      // току-що изтрити (локално)
        let potentialUpdatedIDs = oldIDs.intersection(newIDs)     // може би редактирани
        
        // –––––––––––––––––––––––––––––––––
        // Филтрираме *само* Google-събития
        // –––––––––––––––––––––––––––––––––
        let googleLocalEventIDs = Set(googleToLocalEventMapping.values)
        
        // 1) Новодобавени локално, които са в Google календар
        let googleAddedIDs = addedIDs.filter { googleLocalEventIDs.contains($0) || isInGoogleCalendar($0) }
        
        // 2) Изтрити локално
        let googleRemovedIDs = removedIDs.filter { googleLocalEventIDs.contains($0) }
        
        // 3) Обновени
        let googleUpdatedIDs = potentialUpdatedIDs.filter { googleLocalEventIDs.contains($0) }

        // –––––––––––––––––––––––––––––––––
        // 1) Добавено Google-събитие локално
        // –––––––––––––––––––––––––––––––––
        if googleAddedIDs.count == 1,
           let singleAddedID = googleAddedIDs.first,
           let singleAddedEvent = newEventsDict[singleAddedID] {
            
            print("Локално добавено 1 Google-събитие: \(singleAddedEvent.title ?? "(без заглавие)")")
            
            // Тук създаваме в Google (Async)
            Task {
                do {
                    try await createEventInGoogle(singleAddedEvent)
                    print("Успешно създадено Google-събитие!")
                } catch {
                    print("Грешка при createEventInGoogle:", error)
                }
            }
        }
        
        // –––––––––––––––––––––––––––––––––
        // 2) Изтрито Google-събитие локално
        // –––––––––––––––––––––––––––––––––
        if googleRemovedIDs.count == 1,
           let singleRemovedID = googleRemovedIDs.first,
           let singleRemovedEvent = oldEventsDict[singleRemovedID] {
            
            print("Локално изтрито 1 Google-събитие: \(singleRemovedEvent.title ?? "(без заглавие)")")
            
            // Тук изтриваме в Google (Async)
            Task {
                do {
                    try await removeEventFromGoogle(singleRemovedEvent)
                    print("Успешно изтрито Google-събитие!")
                } catch {
                    print("Грешка при removeEventFromGoogle:", error)
                }
            }
        }
        
        // –––––––––––––––––––––––––––––––––
        // 3) Обновено Google-събитие локално
        // –––––––––––––––––––––––––––––––––
        print("googleUpdatedIDs.count",googleUpdatedIDs.count)
        if googleUpdatedIDs.count == 1,
           let singleUpdatedID = googleUpdatedIDs.first,
           let oldEvent = oldEventsDict[singleUpdatedID],
           let newEvent = newEventsDict[singleUpdatedID] {
            
            // Проверяваме дали наистина се е променило нещо (title/startDate/endDate/notes)
            if oldEvent.title     != newEvent.title ||
               oldEvent.startDate != newEvent.startDate ||
               oldEvent.endDate   != newEvent.endDate ||
               oldEvent.notes     != newEvent.notes {
                
                print("Локално обновено 1 Google-събитие: \(oldEvent.title ?? "(без заглавие)") -> \(newEvent.title ?? "(без заглавие)")")
                
                // Тук обновяваме в Google (Async)
                Task {
                    do {
                        try await updateEventInGoogle(newEvent)
                        print("Успешно обновено Google-събитие!")
                    } catch {
                        print("Грешка при updateEventInGoogle:", error)
                    }
                }
            }
        }
        
        // –––––––––––––––––––––––––––––––––
        // Автоматично презареждане от Google (двупосочна синхронизация)
        // –––––––––––––––––––––––––––––––––
        // Ако сте логнати в Google, може да презаредите цялата информация от Google
        // за да хванете промени, направени на друго устройство или директно в Google Calendar.
        // Внимавайте с честите заявки.
        
        // !!! Проверка за избягване на цикли:
        if isGoogleSignedIn && !isImportingGoogleData {
            Task {
                do {
                    isImportingGoogleData = true
                    // Тук викаме "loadGoogleCalendars()" или друга ваша функция,
                    // която зарежда Google календарите и ги импортва локално.
                    // Това ще опресни локалния EventKit при промени, направени извън устройството.
                    try await Task.sleep(nanoseconds: 500_000_000)  // (примерно 0.5сек изчакване)
                    await CalendarsSheetView().loadGoogleCalendars()
                } catch {
                    print("Грешка при автоматично обновяване от Google: \(error.localizedDescription)")
                }
                isImportingGoogleData = false
            }
        }
    }
    
    func syncWithGoogleCalendars() async {
        guard isGoogleSignedIn, let user = GIDSignIn.sharedInstance.currentUser else { return }
        let accessToken = user.accessToken.tokenString
        
        isImportingGoogleData = true
        defer { isImportingGoogleData = false }
        
        do {
            let googleCalendars = try await fetchGoogleCalendarList(accessToken: accessToken)
            for googleCal in googleCalendars {
                let localCal = try findOrCreateLocalCalendar(for: googleCal)
                try await syncEvents(forCalendarId: googleCal.id, localCalendar: localCal, accessToken: accessToken)
            }
            reloadCalendars()
            loadEvents(for: Date())
        } catch {
            print("Sync error: \(error.localizedDescription)")
        }
    }
    
    private func fetchGoogleCalendarList(accessToken: String) async throws -> [GoogleCalendarItem] {
        let url = URL(string: "https://www.googleapis.com/calendar/v3/users/me/calendarList")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse, (200..<300).contains(httpResponse.statusCode) else {
            throw NSError(domain: "CalendarListFetch", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to fetch calendar list"])
        }
        
        let decoder = JSONDecoder()
        let calendarList = try decoder.decode(GoogleCalendarList.self, from: data)
        return calendarList.items
    }
    
    private func syncEvents(forCalendarId calId: String, localCalendar: EKCalendar, accessToken: String) async throws {
        var urlString = "https://www.googleapis.com/calendar/v3/calendars/\(calId)/events?singleEvents=true&orderBy=startTime"
        if let syncToken = syncTokens[calId] {
            urlString += "&syncToken=\(syncToken)"
        } else {
            urlString += "&timeMin=\(ISO8601DateFormatter().string(from: Date().addingTimeInterval(-60*60*24*365)))" // 1 year back for initial sync
        }
        
        guard let url = URL(string: urlString) else { throw URLError(.badURL) }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        let httpResponse = response as? HTTPURLResponse
        guard  (200..<300).contains(httpResponse!.statusCode) else {
            if httpResponse!.statusCode == 410 { // Sync token expired
                syncTokens.removeValue(forKey: calId)
                saveSyncTokens()
                return try await syncEvents(forCalendarId: calId, localCalendar: localCalendar, accessToken: accessToken) // Retry full sync
            }
            throw NSError(domain: "EventSync", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to sync events"])
        }
        
        let decoder = JSONDecoder()
        let eventsList = try decoder.decode(GoogleEventsList.self, from: data)
        
        eventStore.reset()
        for gEvent in eventsList.items {
            guard let startDate = parseGoogleDateTime(gEvent.start),
                  let endDate = parseGoogleDateTime(gEvent.end) else { continue }
            
            let googleID = gEvent.id
            if gEvent.status == "cancelled" {
                if let localEventID = googleToLocalEventMapping[googleID],
                   let existingEvent = eventStore.event(withIdentifier: localEventID) {
                    try eventStore.remove(existingEvent, span: .thisEvent, commit: false)
                    googleToLocalEventMapping.removeValue(forKey: googleID)
                }
            } else if let localEventID = googleToLocalEventMapping[googleID],
                      let existingEvent = eventStore.event(withIdentifier: localEventID) {
                existingEvent.calendar = localCalendar
                existingEvent.title = gEvent.summary ?? "(Без заглавие)"
                existingEvent.isAllDay = (gEvent.start?.date != nil)
                existingEvent.startDate = startDate
                existingEvent.endDate = endDate
                try eventStore.save(existingEvent, span: .thisEvent, commit: false)
            } else {
                let newEvent = EKEvent(eventStore: eventStore)
                newEvent.calendar = localCalendar
                newEvent.title = gEvent.summary ?? "(Без заглавие)"
                newEvent.isAllDay = (gEvent.start?.date != nil)
                newEvent.startDate = startDate
                newEvent.endDate = endDate
                try eventStore.save(newEvent, span: .thisEvent, commit: false)
                googleToLocalEventMapping[googleID] = newEvent.eventIdentifier
            }
        }
        
        try eventStore.commit()
        if let nextSyncToken = eventsList.nextSyncToken {
            syncTokens[calId] = nextSyncToken
            saveSyncTokens()
        }
        saveGoogleToLocalEventMapping()
    }
        
        // MARK: - Storage Methods
    func saveSyncTokens() {
        if let data = try? JSONEncoder().encode(syncTokens) {
            UserDefaults.standard.set(data, forKey: syncTokensKey)
        }
    }
        

    // MARK: - Методи за EventKit (iOS) календари
    func isCalendarAccessGranted() -> Bool {
        let status = EKEventStore.authorizationStatus(for: .event)
        if #available(iOS 17.0, *) {
            return (status == .fullAccess)
        } else {
            return (status == .authorized)
        }
    }

    @MainActor
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
        
        // Намираме първия локален календар и пазим неговия цвят
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
        
        let fetched = eventStore.fetchEventsByDay(
            for: month,
            calendar: calendar,
            allowedCalendarIDs: selectedCalendarIDs
        )
        self.eventsByDay = fetched
        
        // Събираме всички в един речник по eventIdentifier
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
    
    // MARK: - Записване на mapping-и в UserDefaults
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

// MARK: - Методи за намиране/създаване на локален календар (с ъпдейт на име/цвят)
extension CalendarViewModel {
    func findOrCreateLocalCalendar(for googleCal: GoogleCalendarItem) throws -> EKCalendar {
        
        if let localCalID = googleToLocalCalendarMapping[googleCal.id],
           let existingLocalCalendar = eventStore.calendar(withIdentifier: localCalID) {
            
            // ОБНОВЯВАМЕ име и цвят, ако са се променили
            if existingLocalCalendar.title != googleCal.summary {
                existingLocalCalendar.title = googleCal.summary
            }
            
            if let bgColorHex = googleCal.backgroundColor,
               let uiColor = UIColor(hex: bgColorHex) {
                let currentComponents = existingLocalCalendar.cgColor?.components
                let newComponents = uiColor.cgColor.components
                if currentComponents != newComponents {
                    existingLocalCalendar.cgColor = uiColor.cgColor
                }
            }
            
            do {
                try eventStore.saveCalendar(existingLocalCalendar, commit: true)
                reloadCalendars()
            } catch {
                print("Failed to save calendar: \(error)")
            }
            
            return existingLocalCalendar
            
        } else {
            // Създаваме нов локален календар
            guard let localSource = eventStore.sources.first(where: { $0.sourceType == .local }) else {
                throw NSError(domain: "LocalSourceError",
                              code: 1,
                              userInfo: [NSLocalizedDescriptionKey: "Не е намерен локален source (On My iPhone)."])
            }
            
            let newCal = EKCalendar(for: .event, eventStore: eventStore)
            newCal.title = googleCal.summary
            newCal.source = localSource
            
            if let bgColorHex = googleCal.backgroundColor,
               let uiColor = UIColor(hex: bgColorHex) {
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

// MARK: - Методи за Импорт на Събития (без и със проверка за дубликати)
extension CalendarViewModel {

    func importGoogleEvents(_ googleEvents: [GoogleEvent], into localCalendar: EKCalendar) async throws {
        eventStore.reset()
        
        for gEvent in googleEvents {
            guard let startDate = parseGoogleDateTime(gEvent.start),
                  let endDate   = parseGoogleDateTime(gEvent.end) else {
                continue
            }
            
            let newEvent = EKEvent(eventStore: eventStore)
            newEvent.calendar = localCalendar
            newEvent.title = gEvent.summary ?? "(Без заглавие)"
            
            if gEvent.start?.date != nil {
                newEvent.isAllDay = true
            }
            
            newEvent.startDate = startDate
            newEvent.endDate   = endDate
            
            do {
                try eventStore.save(newEvent, span: .thisEvent, commit: false)
            } catch {
                print("Грешка при запис на събитие: \(error.localizedDescription)")
            }
        }
        
        do {
            try eventStore.commit()
        } catch {
            print("Грешка при commit на събитията: \(error.localizedDescription)")
        }
    }
    
    func importGoogleEventsAvoidingDuplicates(_ googleEvents: [GoogleEvent],
                                              into localCalendar: EKCalendar) async throws {
        eventStore.reset()
        
        for gEvent in googleEvents {
            guard let startDate = parseGoogleDateTime(gEvent.start),
                  let endDate   = parseGoogleDateTime(gEvent.end) else {
                continue
            }
            
            let googleID = gEvent.id
            
            // 1) Проверяваме дали вече имаме локален EKEvent за това Google ID
            if let localEventID = googleToLocalEventMapping[googleID],
               let existingEvent = eventStore.event(withIdentifier: localEventID) {
                
                // => Обновяваме съществуващо събитие
                existingEvent.calendar  = localCalendar
                existingEvent.title     = gEvent.summary ?? "(Без заглавие)"
                existingEvent.isAllDay  = (gEvent.start?.date != nil)
                existingEvent.startDate = startDate
                existingEvent.endDate   = endDate
                
                do {
                    try eventStore.save(existingEvent, span: .thisEvent, commit: false)
                } catch {
                    print("Грешка при update: \(error.localizedDescription)")
                }
                
            } else {
                // => Няма такова локално събитие -> Създаваме ново
                let newEvent = EKEvent(eventStore: eventStore)
                newEvent.calendar  = localCalendar
                newEvent.title     = gEvent.summary ?? "(Без заглавие)"
                newEvent.isAllDay  = (gEvent.start?.date != nil)
                newEvent.startDate = startDate
                newEvent.endDate   = endDate
                
                do {
                    try eventStore.save(newEvent, span: .thisEvent, commit: false)
                    
                    // Записваме mapping: googleEventID -> localEventID
                    googleToLocalEventMapping[googleID] = newEvent.eventIdentifier
                } catch {
                    print("Грешка при създаване на Event: \(error.localizedDescription)")
                }
            }
        }
        
        do {
            try eventStore.commit()
        } catch {
            print("Грешка при commit на събитията: \(error.localizedDescription)")
        }
        
        saveGoogleToLocalEventMapping()
    }
    
    fileprivate func parseGoogleDateTime(_ dateTime: EventDateTime?) -> Date? {
        guard let dateTime = dateTime else { return nil }
        
        if let dateTimeString = dateTime.dateTime {
            // Ако е пълно ISO8601
            let formatter = ISO8601DateFormatter()
            return formatter.date(from: dateTimeString)
        } else if let dateString = dateTime.date {
            // Целодневно: YYYY-MM-DD
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd"
            formatter.timeZone = TimeZone(secondsFromGMT: 0)
            return formatter.date(from: dateString)
        }
        return nil
    }
}

// MARK: - Fetch ALL events (без период, с обработка на pageToken)
extension CalendarViewModel {
    func fetchAllEvents(forCalendarId calId: String, accessToken: String) async throws -> [GoogleEvent] {
        var allEvents: [GoogleEvent] = []
        var nextPageToken: String? = nil
        
        repeat {
            var urlString = "https://www.googleapis.com/calendar/v3/calendars/\(calId)/events?singleEvents=true&orderBy=startTime"
            if let token = nextPageToken {
                urlString += "&pageToken=\(token)"
            }
            
            guard let url = URL(string: urlString) else {
                throw URLError(.badURL)
            }
            
            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
            
            let (data, response) = try await URLSession.shared.data(for: request)
            
            guard let httpResponse = response as? HTTPURLResponse,
                  (200..<300).contains(httpResponse.statusCode) else {
                let statusCode = (response as? HTTPURLResponse)?.statusCode ?? -1
                let respStr = String(data: data, encoding: .utf8) ?? ""
                throw NSError(
                    domain: "CalendarFetch",
                    code: statusCode,
                    userInfo: [NSLocalizedDescriptionKey: "HTTP Error: \(respStr)"]
                )
            }
            
            let decoder = JSONDecoder()
            let eventsList = try decoder.decode(GoogleEventsList.self, from: data)
            
            allEvents.append(contentsOf: eventsList.items)
            
            let json = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
            let token = json?["nextPageToken"] as? String
            nextPageToken = token
        } while nextPageToken != nil
        
        return allEvents
    }
}

// MARK: - CREATE/UPDATE/DELETE в Google
extension CalendarViewModel {
    
    // MARK: CREATE (POST)
    func createEventInGoogle(_ localEvent: EKEvent) async throws {
        guard let googleCalID = findGoogleCalendarID(forLocalCalendarID: localEvent.calendar.calendarIdentifier) else {
            throw NSError(domain: "NoGoogleCalID", code: -1, userInfo: [NSLocalizedDescriptionKey: "Локалният календар няма Google ID"])
        }
        
        guard let user = GIDSignIn.sharedInstance.currentUser else {
            throw NSError(domain: "NoGoogleUser", code: -1, userInfo: [NSLocalizedDescriptionKey: "Не сте логнати в Google"])
        }
        let accessToken = user.accessToken.tokenString
        
        var requestBody: [String: Any] = [
            "summary": localEvent.title ?? "(Без заглавие)",
            "description": localEvent.notes ?? ""
        ]
        
        if localEvent.isAllDay {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            let startStr = dateFormatter.string(from: localEvent.startDate)
            let endStr   = dateFormatter.string(from: localEvent.endDate)
            
            requestBody["start"] = ["date": startStr]
            requestBody["end"]   = ["date": endStr]
        } else {
            let isoFormatter = ISO8601DateFormatter()
            let startStr = isoFormatter.string(from: localEvent.startDate)
            let endStr   = isoFormatter.string(from: localEvent.endDate)
            
            requestBody["start"] = [
                "dateTime": startStr,
                "timeZone": TimeZone.current.identifier
            ]
            requestBody["end"] = [
                "dateTime": endStr,
                "timeZone": TimeZone.current.identifier
            ]
        }
        
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(googleCalID)/events"
        guard let url = URL(string: urlString) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        
        let jsonData = try JSONSerialization.data(withJSONObject: requestBody, options: [])
        request.httpBody = jsonData
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResp = response as? HTTPURLResponse,
              (200..<300).contains(httpResp.statusCode) else {
            let respStr = String(data: data, encoding: .utf8) ?? ""
            throw NSError(domain: "GoogleCreate", code: -1,
                          userInfo: [NSLocalizedDescriptionKey: "Грешка при Create: \(respStr)"])
        }
        
        let decoder = JSONDecoder()
        let createdGoogleEvent = try decoder.decode(GoogleEvent.self, from: data)
        
        let newGoogleID = createdGoogleEvent.id
        googleToLocalEventMapping[newGoogleID] = localEvent.eventIdentifier
        saveGoogleToLocalEventMapping()
        
        print("Create Success: GoogleEventID = \(newGoogleID)")
    }
    
    // MARK: UPDATE (PATCH)
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
        
        var patchBody: [String: Any] = [
            "summary": localEvent.title ?? "(Без заглавие)",
            "description": localEvent.notes ?? ""
        ]
        
        if localEvent.isAllDay {
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            let startStr = dateFormatter.string(from: localEvent.startDate)
            let endStr   = dateFormatter.string(from: localEvent.endDate)
            
            patchBody["start"] = ["date": startStr]
            patchBody["end"]   = ["date": endStr]
        } else {
            let isoFormatter = ISO8601DateFormatter()
            let startStr = isoFormatter.string(from: localEvent.startDate)
            let endStr   = isoFormatter.string(from: localEvent.endDate)
            
            patchBody["start"] = [
                "dateTime": startStr,
                "timeZone": TimeZone.current.identifier
            ]
            patchBody["end"] = [
                "dateTime": endStr,
                "timeZone": TimeZone.current.identifier
            ]
        }
        
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(googleCalID)/events/\(googleEventID)"
        guard let url = URL(string: urlString) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json; charset=utf-8", forHTTPHeaderField: "Content-Type")
        
        let jsonData = try JSONSerialization.data(withJSONObject: patchBody, options: [])
        request.httpBody = jsonData
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResp = response as? HTTPURLResponse,
              (200..<300).contains(httpResp.statusCode) else {
            let respStr = String(data: data, encoding: .utf8) ?? ""
            throw NSError(domain: "GoogleUpdate", code: -1,
                          userInfo: [NSLocalizedDescriptionKey: "Грешка при Update: \(respStr)"])
        }
        
        print("Update Success: GoogleEventID = \(googleEventID)")
    }
    
    // MARK: REMOVE (DELETE)
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
        
        let urlString = "https://www.googleapis.com/calendar/v3/calendars/\(googleCalID)/events/\(googleEventID)"
        guard let url = URL(string: urlString) else {
            throw URLError(.badURL)
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        let (_, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResp = response as? HTTPURLResponse,
              (200..<300).contains(httpResp.statusCode) else {
            throw NSError(domain: "GoogleDelete", code: -1,
                          userInfo: [NSLocalizedDescriptionKey: "Грешка при Delete"])
        }
        
        // Махаме го от mapping
        if let key = findGoogleEventID(forLocalEventID: localEvent.eventIdentifier) {
            googleToLocalEventMapping.removeValue(forKey: key)
            saveGoogleToLocalEventMapping()
        }
        
        print("Delete Success: GoogleEventID = \(googleEventID)")
    }
    
    // MARK: - Reverse Lookups
    private func findGoogleEventID(forLocalEventID localID: String) -> String? {
        for (googleID, mappedLocalID) in googleToLocalEventMapping {
            if mappedLocalID == localID {
                return googleID
            }
        }
        return nil
    }

    private func findGoogleCalendarID(forLocalCalendarID localCalID: String) -> String? {
        for (googleCalID, mappedLocalCalID) in googleToLocalCalendarMapping {
            if mappedLocalCalID == localCalID {
                return googleCalID
            }
        }
        return nil
    }
    
    private func isInGoogleCalendar(_ localEventID: String) -> Bool {
        guard let ev = eventsByID[localEventID] else { return false }
        let localCalID = ev.calendar.calendarIdentifier
        
        return googleToLocalCalendarMapping.values.contains(localCalID)
    }
}

extension UIColor {
    convenience init?(hex: String) {
        var raw = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if raw.hasPrefix("#") {
            raw.removeFirst()
        }
        
        guard raw.count == 6 || raw.count == 8 else {
            return nil
        }
        
        var rgbValue: UInt64 = 0
        Scanner(string: raw).scanHexInt64(&rgbValue)
        
        if raw.count == 6 {
            let r = CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0
            let g = CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0
            let b = CGFloat(rgbValue & 0x0000FF)         / 255.0
            self.init(red: r, green: g, blue: b, alpha: 1.0)
        } else {
            let r = CGFloat((rgbValue & 0xFF000000) >> 24) / 255.0
            let g = CGFloat((rgbValue & 0x00FF0000) >> 16) / 255.0
            let b = CGFloat((rgbValue & 0x0000FF00) >> 8)  / 255.0
            let a = CGFloat(rgbValue & 0x000000FF)         / 255.0
            self.init(red: r, green: g, blue: b, alpha: a)
        }
    }
}

// MARK: - Модели за декодиране на Google Calendar
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
