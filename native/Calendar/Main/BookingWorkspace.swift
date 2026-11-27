import SwiftUI
import EventKit

struct BookingBreak: Codable, Equatable, Identifiable {
    let id = UUID()
    var start, end: Int
    private enum CodingKeys: String, CodingKey { case start, end }
    static func == (lhs: Self, rhs: Self) -> Bool { lhs.start == rhs.start && lhs.end == rhs.end }
}
struct BookingDailyPattern: Codable, Equatable {
    var first, last, step: Int
    var breaks: [BookingBreak]
    func minutes(duration: Double) -> [Int] {
        guard (0..<1440).contains(first), (first..<1440).contains(last), (1...1440).contains(step),
              duration > 0, duration <= Double(step),
              breaks.allSatisfy({ $0.start >= 0 && $0.end > $0.start && $0.end <= 1440 }) else { return [] }
        return stride(from: first, through: last, by: step).filter { start in
            let end = Double(start) + duration
            return end <= 1440 && !breaks.contains { start < $0.end && Double($0.start) < end }
        }
    }
    var payload: [String: any Sendable] {
        ["first": first, "last": last, "step": step, "breaks": breaks.map { ["start": $0.start, "end": $0.end] }]
    }
}

struct BookingInterval: Codable, Identifiable {
    var id: String
    var start: String
    var end: String
    var title: String?
    var location: String?
    var structuredLocation: SharedEventLocation?
    var videoCallURL: String?
    var hasVideoCall: Bool?
    var excludedStarts: [String]?
    var rule: SharedEventRecurrenceRule?
    var hoursOfDay: [Int]?
    var timeZone: String?
    var allDay: Bool?
    var dailyPattern: BookingDailyPattern?
    var payload: [String: any Sendable] {
        var fields: [String: any Sendable] = ["id": id, "start": start, "end": end]
        fields["title"] = title
        fields["timeZone"] = timeZone
        fields["rule"] = rule?.bookingPayload
        fields["hoursOfDay"] = hoursOfDay
        fields["allDay"] = allDay
        fields["dailyPattern"] = dailyPattern?.payload
        return fields.merging(bookingVenue(location, structuredLocation, videoCallURL)) { _, new in new }
    }
    static func date(_ value: String) -> Date {
        (try? Date(value, strategy: Date.ISO8601FormatStyle(includingFractionalSeconds: true))) ??
            (try? Date(value, strategy: .iso8601)) ?? .distantPast
    }
    var myBookingId: String?
    var isBusy: Bool { id.hasPrefix("busy/") }
    func guestDisplayDate(_ value: String) -> Date {
        let date = Self.date(value)
        guard allDay == true, let zone = timeZone.flatMap(TimeZone.init(identifier:)) else { return date }
        var owner = Calendar.current
        owner.timeZone = zone
        return Calendar.current.date(from: owner.dateComponents([.era, .year, .month, .day], from: date)) ?? date
    }
    var label: String {
        let from = Self.date(start), to = Self.date(end)
        if allDay == true {
            let zone = timeZone.flatMap(TimeZone.init(identifier:)) ?? .current
            let date = appShortDateFormatter(timeZone: zone)
            let first = date.string(from: from), last = date.string(from: to.addingTimeInterval(-1))
            return (first == last ? first : first + " – " + last) + " · " + NSLocalizedString("All-day", comment: "")
        }
        let date = appShortDateFormatter(), time = appTimeFormatter()
        let endDate = Calendar.current.isDate(from, inSameDayAs: to) ? "" : date.string(from: to) + " · "
        return date.string(from: from) + " · " + time.string(from: from) + " – " + endDate + time.string(from: to)
    }
}

func bookingParticipantName(_ name: String) -> String {
    name == "Cloud Calendars user" ? NSLocalizedString("Cloud Calendars user", comment: "") : name
}

enum BookingDecision: String { case accepted, declined }

struct BookingAppointment: Codable, Identifiable {
    let id, slotId, start, end, guestName, hostName, calendarTitle, status: String
    var appointmentType, customType: String?
    var title, location, calendarId: String?
    var structuredLocation: SharedEventLocation?
    var videoCallURL: String?
    var hasVideoCall: Bool?
    var allDay: Bool?
    var timeZone: String?
    var cancelledByGuest: Bool?
    var proposal: BookingInterval?
    var interval: BookingInterval { .init(id: slotId, start: start, end: end, title: title, location: location, structuredLocation: structuredLocation, videoCallURL: videoCallURL, hasVideoCall: hasVideoCall, timeZone: timeZone, allDay: allDay) }
    var eventStatus: BookingEventStatus { BookingEventStatus(rawValue: status) ?? .unknown }
    var active: Bool { status == "pending" || status == "accepted" }
    var canCancel: Bool {
        active && max(BookingInterval.date(start), BookingInterval.date(proposal?.start ?? start)) > .now
    }
    var displayedInterval: BookingInterval { proposal ?? interval }
    var isHistory: Bool { !active || cancelledByGuest == true || BookingInterval.date(displayedInterval.end) <= .now }
    var statusLabel: String { cancelledByGuest == true ? "Cancelled" : eventStatus.label }
    var needsHostResponse: Bool { status == "pending" && proposal == nil && BookingInterval.date(end) > .now }
    var needsChangeResponse: Bool { active && proposal != nil && calendarId != nil }
}
struct HostedBookingCalendar: Codable, Identifiable {
    var id = UUID().uuidString.lowercased()
    var title = ""
    var appointmentType, customType: String?
    var revision = 0
    var listed: Bool?
    var slots: [BookingInterval] = []
    var requests: [BookingAppointment] = []

    func reservation(for slot: BookingInterval) -> BookingAppointment? {
        guard slot.rule == nil else { return nil }
        return requests.first {
            let held = $0.proposal ?? $0.interval
            return $0.status != "declined" && $0.slotId == slot.id && held.start == slot.start && held.end == slot.end
        }
    }

    func status(for slot: BookingInterval) -> BookingEventStatus {
        if slot.rule != nil { return .available }
        if let reservation = reservation(for: slot) {
            return reservation.eventStatus
        }
        return BookingEventStatus.unreserved(ending: BookingInterval.date(slot.end))
    }
}
private struct BookingData: Codable {
    var calendars: [HostedBookingCalendar] = []
    var appointments: [BookingAppointment] = []
    var pendingChanges: [BookingAppointment] { appointments.filter(\.needsChangeResponse) }
    var upcoming: [BookingAppointment] {
        appointments.filter { !$0.isHistory }.sorted {
            if $0.needsChangeResponse != $1.needsChangeResponse { return $0.needsChangeResponse }
            return $0.displayedInterval.start < $1.displayedInterval.start
        }
    }
    var history: [BookingAppointment] {
        appointments.filter(\.isHistory).sorted { $0.displayedInterval.start > $1.displayedInterval.start }
    }
}
struct BookingOffer: Decodable, Identifiable {
    let id, title, hostName: String
    let isOwner: Bool
    var slots: [BookingInterval]
    let appointmentType, customType: String?
    var nextFrom: String?
    var busy: [BookingInterval]?
    var displaySlots: [BookingInterval] {
        (slots + (busy ?? [])).sorted { $0.start == $1.start ? $0.id < $1.id : $0.start < $1.start }
    }
}
private struct BookingListing: Decodable, Identifiable {
    let id, title, hostName, appointmentType: String
    let customType: String?
    let isOwner: Bool
}
private struct BookingDirectoryPage: Decodable {
    let calendars: [BookingListing]
    let next: String?
}
private struct BookingReceipt: Decodable { let id: String; var revision: Int? }

enum BookingEventStatus: String {
    case available, pending, accepted, declined, past, unknown

    static func unreserved(ending end: Date) -> Self { end <= .now ? .past : .available }

    var label: String {
        self == .available ? "Available time" : rawValue.capitalized
    }

    var color: Color {
        let hex: String
        switch self {
        case .available: hex = "#0A84FF"
        case .pending: hex = "#FF9F0A"
        case .accepted: hex = "#34C759"
        case .declined: hex = "#FF453A"
        case .past, .unknown: hex = "#8E8E93"
        }
        #if os(macOS)
        return Color(hex: hex)
        #else
        return Color(uiColor: AppLocalCalendarStore.color(hex))
        #endif
    }
}

private extension View {
    func bookingStatusBar(_ status: BookingEventStatus) -> some View {
        padding(.leading, 9).overlay(alignment: .leading) {
            Capsule().fill(status.color).frame(width: 3).accessibilityHidden(true)
        }
    }
}

private func bookingVenue(_ location: String?, _ point: SharedEventLocation?, _ videoCallURL: String?) -> [String: any Sendable] {
    var fields: [String: any Sendable] = ["location": location ?? "", "structuredLocation": NSNull(), "videoCallURL": videoCallURL ?? ""]
    if let point {
        var coordinates: [String: any Sendable] = ["title": point.title, "radius": point.radius]
        coordinates["latitude"] = point.latitude
        coordinates["longitude"] = point.longitude
        fields["structuredLocation"] = coordinates
    }
    return fields
}

private struct BookingSlotTarget: Identifiable {
    let calendar: HostedBookingCalendar
    var slot: BookingInterval?
    var occurrence = false
    var reservation: BookingAppointment?
    var initialAllDay = false
    var initialInterval: DateInterval?
    var id: String { calendar.id + (slot?.id ?? "-new") }
}
private struct BookingSlotRemoval {
    let calendarID: String
    let revision: Int
    let slotID: String
    let recurring: Bool
}
private func bookingLink(_ id: String) -> URL {
    URL(string: "https://www.cloud-calendars.com/calendar/bookings/")!.appending(queryItems: [
        URLQueryItem(name: "bookingCalendar", value: id),
        URLQueryItem(name: "bookingServer", value: "production")
    ])
}

@MainActor
private final class BookingStore: ObservableObject {
    static let shared = BookingStore()
    @Published private var confirmed = BookingData()
    @Published private var freePreviews: [String: HostedBookingCalendar] = [:]
    private var freeWrites: [String: Task<Void, Error>] = [:]
    var data: BookingData {
        guard !freePreviews.isEmpty else { return confirmed }
        return BookingData(calendars: confirmed.calendars.map { freePreviews[$0.id] ?? $0 }, appointments: confirmed.appointments)
    }
    @Published var error: String?
    @Published var loaded = false
    @Published private(set) var decidingRequests: Set<String> = []
    @Published private(set) var pendingMoves: [BookingTimelineMove] = []
    private var account: CloudCalendarsAPI.Session?
    func belongs(to session: CloudCalendarsAPI.Session) -> Bool {
        CalendarFeedSession.isCurrent(session) && account == session
    }
    private func cacheKey(for session: CloudCalendarsAPI.Session) -> String {
        "bookings.workspace." + (CloudCalendarsAPI.baseURL.host ?? "") + "." + session.calendarId
    }
    private var generation = 0
    private var observer: NSObjectProtocol?
    init() {
        observer = NotificationCenter.default.addObserver(forName: .cloudAccountChanged, object: nil, queue: .main) { [weak self] _ in
            Task { @MainActor in await self?.refresh() }
        }
    }
    func refresh() async {
        let session = CalendarFeedSession.existing
        if account != session {
            freeWrites.removeAll()
            freePreviews.removeAll()
            pendingMoves.removeAll()
            confirmed = BookingData()
            loaded = false
            error = nil
            account = session
            if let session, let saved = UserDefaults.standard.data(forKey: cacheKey(for: session)),
               let cached = try? JSONDecoder().decode(BookingData.self, from: saved) {
                confirmed = cached
                loaded = true
            }
        }
        generation += 1
        let version = generation
        guard let session else { loaded = true; return }
        do {
            var updated: BookingData = try await CloudCalendarsAPI.bookingRequest("", session: session)
            guard generation == version, CalendarFeedSession.isCurrent(session) else { return }
            // A read started before a successful drop can arrive after its receipt.
            for (index, calendar) in updated.calendars.enumerated() {
                if let newer = confirmed.calendars.first(where: { $0.id == calendar.id && $0.revision > calendar.revision }) {
                    updated.calendars[index] = newer
                }
            }
            if let encoded = try? JSONEncoder().encode(updated) {
                let key = cacheKey(for: session)
                if UserDefaults.standard.data(forKey: key) != encoded { UserDefaults.standard.set(encoded, forKey: key) }
            }
            confirmed = updated
            let stillPending = pendingMoves.filter { move in
                data.calendars.contains { $0.id == move.calendarID && $0.revision == move.revision }
            }
            if stillPending.count != pendingMoves.count { pendingMoves = stillPending }
            loaded = true
            error = nil
        } catch {
            if !Task.isCancelled && generation == version && CalendarFeedSession.isCurrent(session) { self.error = error.localizedDescription }
        }
    }
    func move(_ entry: BookingTimelineEntry, to interval: DateInterval, in calendar: HostedBookingCalendar,
              session: CloudCalendarsAPI.Session, onFailure: @escaping (String) -> Void) {
        guard belongs(to: session), data.calendars.contains(where: { $0.id == calendar.id && $0.revision == calendar.revision }),
              !pendingMoves.contains(where: { $0.calendarID == calendar.id && $0.entry.id == entry.id }) else { return }
        if entry.requestID == nil {
            moveFreeSlot(entry, to: interval, in: calendar, session: session, onFailure: onFailure)
            return
        }
        let move = BookingTimelineMove(calendarID: calendar.id, revision: calendar.revision, entry: entry, interval: interval)
        pendingMoves.append(move)
        Task {
            do {
                try await freeWrites[calendar.id]?.value
                guard belongs(to: session) else { return }
                let receipt: BookingReceipt = try await CloudCalendarsAPI.bookingRequest("/" + calendar.id + "/occurrences/" + entry.slotID,
                    method: "PUT", body: ["revision": calendar.revision, "allDay": entry.allDay, "timeZone": entry.zone ?? TimeZone.current.identifier, "start": DeviceCalendarEvent.iso(interval.start),
                        "end": DeviceCalendarEvent.iso(interval.end)], session: session)
                if belongs(to: session), receipt.revision == move.revision { pendingMoves.removeAll { $0 == move } }
            } catch {
                guard belongs(to: session) else { return }
                pendingMoves.removeAll { $0 == move }
                onFailure(error.localizedDescription)
            }
            if belongs(to: session) { await refresh() }
        }
    }

    func moveFuture(_ change: BookingTimelineMove, session: CloudCalendarsAPI.Session) async throws {
        let id = change.calendarID
        try await freeWrites[id]?.value
        guard belongs(to: session) else { throw CancellationError() }
        let updated: HostedBookingCalendar = try await CloudCalendarsAPI.bookingRequest("/" + id + "/future-occurrences/" + change.entry.slotID,
            method: "PUT", body: ["revision": change.revision, "allDay": change.entry.allDay, "timeZone": change.entry.zone ?? TimeZone.current.identifier, "start": DeviceCalendarEvent.iso(change.interval.start),
                "end": DeviceCalendarEvent.iso(change.interval.end), "freeOnly": change.entry.requestID == nil], session: session)
        guard belongs(to: session) else { return }
        if let i = confirmed.calendars.firstIndex(where: { $0.id == id && $0.revision <= updated.revision }) {
            confirmed.calendars[i] = updated
        }
        await refresh()
    }

    private func moveFreeSlot(_ entry: BookingTimelineEntry, to interval: DateInterval, in calendar: HostedBookingCalendar,
                              session: CloudCalendarsAPI.Session, onFailure: @escaping (String) -> Void) {
        let baseID = entry.slotID.components(separatedBy: "@")[0]
        guard let index = calendar.slots.firstIndex(where: { $0.id == baseID }) else { return }
        var next = calendar
        var slot = calendar.slots[index]
        slot.allDay = entry.allDay
        if entry.allDay && slot.timeZone == nil { slot.timeZone = TimeZone.current.identifier }
        slot.start = DeviceCalendarEvent.iso(interval.start)
        slot.end = DeviceCalendarEvent.iso(interval.end)
        var body: [String: any Sendable] = ["revision": calendar.revision, "freeOnly": true, "allDay": entry.allDay, "timeZone": slot.timeZone ?? TimeZone.current.identifier, "start": slot.start, "end": slot.end]
        if slot.rule != nil {
            next.slots[index].excludedStarts = (slot.excludedStarts ?? []) + [DeviceCalendarEvent.iso(entry.start)]
            slot.id = UUID().uuidString.lowercased()
            slot.rule = nil
            slot.hoursOfDay = nil
            slot.dailyPattern = nil
            slot.excludedStarts = nil
            next.slots.append(slot)
            body["detachedId"] = slot.id
        } else {
            next.slots[index] = slot
        }
        next.slots.sort { $0.start < $1.start }
        next.revision += 1
        freePreviews[calendar.id] = next
        let previous = freeWrites[calendar.id]
        let write = Task<Void, Error> {
            try await previous?.value
            guard belongs(to: session) else { throw CancellationError() }
            let receipt: BookingReceipt = try await CloudCalendarsAPI.bookingRequest("/" + calendar.id + "/occurrences/" + entry.slotID,
                method: "PUT", body: body, session: session)
            guard belongs(to: session) else { throw CancellationError() }
            guard receipt.revision == next.revision else {
                throw NSError(domain: "Bookings", code: 409, userInfo: [NSLocalizedDescriptionKey: NSLocalizedString("This calendar changed. Refresh and try again.", comment: "")])
            }
            if let i = confirmed.calendars.firstIndex(where: { $0.id == calendar.id && $0.revision < next.revision }) {
                confirmed.calendars[i] = next
            }
        }
        freeWrites[calendar.id] = write
        Task {
            let result = await write.result
            guard belongs(to: session), freeWrites[calendar.id] == write else { return }
            freeWrites[calendar.id] = nil
            freePreviews[calendar.id] = nil
            if case .failure(let error) = result { onFailure(error.localizedDescription) }
            await refresh()
        }
    }
    func decide(calendarID: String, requestID: String, decision: BookingDecision, onFailure: @escaping (String) -> Void) {
        guard let session = CalendarFeedSession.existing, belongs(to: session),
              let calendar = data.calendars.first(where: { $0.id == calendarID }),
              calendar.requests.contains(where: { $0.id == requestID && $0.needsHostResponse }),
              !pendingMoves.contains(where: { $0.calendarID == calendarID && $0.revision == calendar.revision && $0.entry.requestID == requestID }),
              decidingRequests.insert(requestID).inserted else { return }
        Task {
            defer { decidingRequests.remove(requestID) }
            do {
                try await mutate("/" + calendarID + "/requests/" + requestID + "/decision", body: ["status": decision.rawValue])
            } catch {
                guard belongs(to: session) else { return }
                onFailure(error.localizedDescription)
                await refresh()
            }
        }
    }

    func mutate(_ path: String, method: String = "PUT", body: [String: any Sendable]? = nil) async throws {
        let session = try await CalendarFeedSession.current()
        if let id = path.split(separator: "/").first { try await freeWrites[String(id)]?.value }
        guard CalendarFeedSession.isCurrent(session) else { throw CancellationError() }
        let _: BookingReceipt = try await CloudCalendarsAPI.bookingRequest(path, method: method, body: body, session: session)
        guard CalendarFeedSession.isCurrent(session) else { throw CancellationError() }
        await refresh()
    }
}

struct BookingChangeNotice: View {
    @SceneStorage(MyBookingsView.storageKey) private var myView = MyBookingsView.list
    let reviewing: Bool
    let open: () -> Void
    @Environment(\.scenePhase) private var scenePhase
    @ObservedObject private var account = CloudAccountManager.shared
    @ObservedObject private var store = BookingStore.shared

    var body: some View {
        VStack(spacing: 0) {
            if !reviewing, account.isSignedIn, let session = CalendarFeedSession.existing, store.belongs(to: session),
               let first = store.data.pendingChanges.first {
                Button {
                    myView = .list
                    open()
                } label: {
                    HStack(spacing: 10) {
                        Image(systemName: "bell.fill").foregroundStyle(Color.appBlue)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Proposed change").font(CalendarTypography.headline)
                            Text(verbatim: first.calendarTitle).font(CalendarTypography.subheadline).foregroundStyle(.secondary).lineLimit(1)
                        }
                        Spacer()
                        if store.data.pendingChanges.count > 1 {
                            Text(verbatim: localizedIntegerString(store.data.pendingChanges.count)).monospacedDigit()
                        }
                        Image(systemName: "chevron.forward").font(CalendarTypography.caption).foregroundStyle(.secondary)
                    }
                    .padding(.horizontal, 16).padding(.vertical, 6)
                    .frame(minHeight: 44).contentShape(Rectangle())
                }
                .buttonStyle(.plain).accessibilityHint(Text("My bookings"))
                .background(CalendarPalette.secondaryGroupedBackground)
                Divider()
            }
        }
        .task(id: scenePhase == .active && account.isSignedIn) {
            guard scenePhase == .active, account.isSignedIn else { return }
            while !Task.isCancelled {
                await store.refresh()
                do { try await Task.sleep(for: .seconds(30)) } catch { return }
            }
        }
    }
}

struct BookingsContent: View {
    let mode: BookingViewMode
    @Binding var timelineID: String?
    @Binding var addingSlot: Bool
    let openOffer: (BookingOffer) -> Void
    @ObservedObject private var manager = CloudAccountManager.shared

    var body: some View {
        if manager.isSignedIn, let session = CalendarFeedSession.existing {
            SignedInBookingsContent(mode: mode, session: session, timelineID: $timelineID, addingSlot: $addingSlot, openOffer: openOffer)
                .id(session.calendarId)
        } else {
            CalendarSharingForm { CalendarSharingSection { CloudAccountSignInContent() } }
                .onAppear { timelineID = nil; addingSlot = false }
        }
    }
}

private struct BookingDecisionPrompt {
    let request: BookingAppointment
    let decision: BookingDecision

    var title: LocalizedStringKey { decision == .accepted ? "Accept" : "Decline" }
    var details: String {
        var lines = [request.calendarTitle, request.interval.label]
        if let proposal = request.proposal {
            lines += [NSLocalizedString("Proposed change", comment: ""), proposal.label]
        } else {
            lines.insert(bookingParticipantName(request.guestName), at: 1)
        }
        return lines.joined(separator: "\n")
    }
}

private extension View {
    func bookingDecisionConfirmation(_ selection: Binding<BookingDecisionPrompt?>,
                                     confirm: @escaping (BookingDecisionPrompt) -> Void) -> some View {
        alert(Text(selection.wrappedValue?.title ?? "Bookings"), isPresented: Binding(
            get: { selection.wrappedValue != nil }, set: { if !$0 { selection.wrappedValue = nil } }
        ), presenting: selection.wrappedValue) { prompt in
            Button(role: prompt.decision == .declined ? .destructive : nil) { confirm(prompt) } label: { Text(prompt.title) }
            Button("Cancel", role: .cancel) {}
        } message: { prompt in Text(verbatim: prompt.details) }
    }

    func guestBookingConfirmation<Item>(selection: Binding<Item?>,
                                        cancelling: (Item) -> Bool,
                                        details: @escaping (Item) -> String,
                                        confirm: @escaping (Item) -> Void) -> some View {
        let isCancellation = selection.wrappedValue.map(cancelling) ?? false
        return alert(isCancellation ? Text("Cancel booking") : Text("Book"),
                     isPresented: Binding(get: { selection.wrappedValue != nil },
                                          set: { if !$0 { selection.wrappedValue = nil } }),
                     presenting: selection.wrappedValue) { item in
            if isCancellation {
                Button("Cancel booking", role: .destructive) { confirm(item) }
                Button("Keep booking", role: .cancel) {}
            } else {
                Button("Book") { confirm(item) }
                Button("Cancel", role: .cancel) {}
            }
        } message: { item in Text(verbatim: details(item)) }
    }
}

private enum MyBookingsView: String {
    case list, multiDay, history
    static let storageKey = "BookingWorkspace.myView"
}

private struct SignedInBookingsContent: View {
    let mode: BookingViewMode
    let session: CloudCalendarsAPI.Session
    @ObservedObject private var store = BookingStore.shared
    @State private var recurringMove: BookingTimelineMove?
    @State private var slotRemoval: BookingSlotRemoval?
    @Binding var timelineID: String?
    @Binding var addingSlot: Bool
    let openOffer: (BookingOffer) -> Void
    @State private var lookupOpen = false
    @State private var selectedOffer: BookingOffer?
    @State private var editing: HostedBookingCalendar?
    @State private var slotTarget: BookingSlotTarget?
    @State private var decisionPrompt: BookingDecisionPrompt?
    @SceneStorage(MyBookingsView.storageKey) private var myView = MyBookingsView.list
    @State private var inspecting: BookingAppointment?
    private var myRange = BookingGridRange()
    @State private var failure: String?
    var body: some View {
        Group {
            if let timelineID, mode == .availability, store.belongs(to: session),
               let schedule = store.data.calendars.first(where: { $0.id == timelineID }) {
                BookingCalendarTimeline(schedule: schedule, moves: store.pendingMoves, decidingRequests: store.decidingRequests,
                    onDecide: { requestID, decision in
                        if let request = schedule.requests.first(where: { $0.id == requestID && $0.needsHostResponse }) {
                            decisionPrompt = BookingDecisionPrompt(request: request, decision: decision)
                        }
                    }, onBack: { self.timelineID = nil }, onAdd: { addingSlot = true }, onEdit: { entry in
                    let base = schedule.slots.first { $0.id == entry.slotID.components(separatedBy: "@")[0] }
                    let request = schedule.requests.first { $0.id == entry.requestID }
                    if let base, base.rule == nil, request == nil {
                        slotTarget = .init(calendar: schedule, slot: base)
                        return
                    }
                    let source = entry.proposed ? request?.proposal : request?.interval
                    let slot = BookingInterval(id: entry.slotID, start: DeviceCalendarEvent.iso(entry.start), end: DeviceCalendarEvent.iso(entry.end),
                        title: source?.title ?? base?.title, location: entry.location,
                        structuredLocation: source == nil ? base?.structuredLocation : source?.structuredLocation,
                        videoCallURL: entry.videoCallURL, timeZone: entry.zone ?? base?.timeZone, allDay: entry.allDay)
                    slotTarget = .init(calendar: schedule, slot: slot, occurrence: true, reservation: request)
                }, onDelete: { entry in
                    guard entry.canDelete, let source = schedule.slots.first(where: { $0.id == entry.slotID.components(separatedBy: "@")[0] }) else { return }
                    slotRemoval = .init(calendarID: schedule.id, revision: schedule.revision, slotID: entry.slotID, recurring: source.rule != nil)
                }, onMove: { entry, interval in
                    let baseID = entry.slotID.components(separatedBy: "@")[0]
                    if schedule.slots.first(where: { $0.id == baseID })?.rule != nil {
                        recurringMove = .init(calendarID: schedule.id, revision: schedule.revision, entry: entry, interval: interval)
                    } else {
                        store.move(entry, to: interval, in: schedule, session: session) { failure = $0 }
                    }
                }, onCreate: { interval, allDay in slotTarget = .init(calendar: schedule, initialAllDay: allDay, initialInterval: interval) })
                    .id(schedule.id)
                    .confirmationDialog("Recurring Event", isPresented: Binding(
                        get: { recurringMove != nil }, set: { if !$0 { recurringMove = nil } }),
                        titleVisibility: .visible, presenting: recurringMove) { change in
                        Button("This Event Only") { apply(change, future: false) }
                        Button("All Future Events") { apply(change, future: true) }
                        Button("Cancel", role: .cancel) { recurringMove = nil }
                    } message: { _ in Text("This event is part of a series. Update which events?") }
            } else {
                VStack(spacing: 0) {
                    Button { lookupOpen = true } label: {
                        Label("Open booking calendar", systemImage: "magnifyingglass")
                            .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                            .padding(.horizontal, 16)
                            .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain).foregroundStyle(Color.appBlue)
                    .background(CalendarPalette.secondaryGroupedBackground, in: RoundedRectangle(cornerRadius: CalendarCorners.formSection))
                    .padding(.horizontal, 20).padding(.vertical, 6).frame(maxWidth: 780)
                    if mode == .appointments {
                        CalendarSectionPicker(selection: $myView, rows: [[
                            .init(id: .list, title: "List"), .init(id: .multiDay, title: "MultiDay"), .init(id: .history, title: "History")
                        ]])
                        .accessibilityLabel("Calendar views")
                        .frame(maxWidth: 400).padding(.horizontal).padding(.vertical, 6)
                    }
                    if mode == .appointments && myView == .multiDay && store.belongs(to: session) && store.loaded && store.error == nil {
                        myCalendar
                    } else {
                        bookingList
                    }
                }
                .background(CalendarPalette.groupedBackground)
            }
        }
        .bookingDecisionConfirmation($decisionPrompt) { prompt in
            let request = prompt.request
            guard store.belongs(to: session), let id = request.calendarId else { return }
            store.decide(calendarID: id, requestID: request.id, decision: prompt.decision) { failure = $0 }
        }
        .appSheet(item: $inspecting) { selected in
            BookingSheet(title: "My booking", leading: "Close", back: { inspecting = nil }) {
                CalendarSharingForm {
                    if let current = store.data.appointments.first(where: { $0.id == selected.id }) {
                        CalendarSharingSection(rows: true) { BookingGuestRequestRow(request: current, session: session) }
                    } else {
                        Text("No bookings yet.").foregroundStyle(.secondary)
                    }
                }
            }
        }
        .onChange(of: store.data.calendars.map(\.id)) { _, ids in
            if let timelineID, !ids.contains(timelineID) { self.timelineID = nil }
        }
        .onChange(of: addingSlot) {
            guard addingSlot else { return }
            addingSlot = false
            if mode == .availability, store.belongs(to: session),
               let schedule = store.data.calendars.first(where: { $0.id == timelineID }) {
                slotTarget = .init(calendar: schedule)
            }
        }
        .confirmationDialog("Remove time slot?", isPresented: Binding(
            get: { slotRemoval != nil }, set: { if !$0 { slotRemoval = nil } }),
            titleVisibility: .visible, presenting: slotRemoval) { target in
            if target.recurring {
                Button("This Event Only", role: .destructive) { remove(target, future: false) }
                Button("All Future Events", role: .destructive) { remove(target, future: true) }
            } else {
                Button("Delete", role: .destructive) { remove(target, future: false) }
            }
            Button("Cancel", role: .cancel) {}
        }
        .onChange(of: timelineID) { recurringMove = nil; slotRemoval = nil; addingSlot = false }
        .onChange(of: mode) { timelineID = nil }
        .appSheet(isPresented: $lookupOpen, onDismiss: {
            if let selectedOffer, CalendarFeedSession.isCurrent(session) {
                openOffer(selectedOffer)
            }
            selectedOffer = nil
        }) {
            BookingLookupSheet(session: session) { offer in
                guard lookupOpen else { return }
                selectedOffer = offer
                lookupOpen = false
            }
        }
        .appSheet(item: $editing) { BookingCalendarEditor(calendar: $0) }
        .appSheet(item: $slotTarget) { target in BookingTimeEditor(calendar: target.calendar, original: target.slot, occurrence: target.occurrence, reservation: target.reservation, initialInterval: target.initialInterval, initialAllDay: target.initialAllDay) }
        .alert("Bookings", isPresented: Binding(get: { failure != nil }, set: { if !$0 { failure = nil } })) {
            Button("OK") { failure = nil }
        } message: { Text(verbatim: failure ?? "") }
    }

    private func remove(_ target: BookingSlotRemoval, future: Bool) {
        slotRemoval = nil
        Task {
            guard timelineID == target.calendarID, store.belongs(to: session) else { return }
            let path = future ? "/future-occurrences/" : "/occurrences/"
            do {
                try await store.mutate("/" + target.calendarID + path + target.slotID,
                    body: ["revision": target.revision, "remove": true, "freeOnly": true])
            } catch {
                guard store.belongs(to: session) else { return }
                failure = error.localizedDescription
                await store.refresh()
            }
        }
    }

    private func apply(_ change: BookingTimelineMove, future: Bool) {
        recurringMove = nil
        guard timelineID == change.calendarID, store.belongs(to: session) else { return }
        guard let schedule = store.data.calendars.first(where: { $0.id == change.calendarID && $0.revision == change.revision }) else {
            failure = NSLocalizedString("This calendar changed. Refresh and try again.", comment: "")
            return
        }
        if future {
            Task {
                do { try await store.moveFuture(change, session: session) }
                catch {
                    guard store.belongs(to: session) else { return }
                    failure = error.localizedDescription
                    await store.refresh()
                }
            }
        } else {
            store.move(change.entry, to: change.interval, in: schedule, session: session) { failure = $0 }
        }
    }

    private var bookingList: some View {
        CalendarSharingForm {
            if mode == .availability {
                CalendarSharingSection(rows: true) {
                    Button { editing = HostedBookingCalendar() } label: {
                        Label("Create booking calendar", systemImage: "calendar.badge.plus")
                    }.calendarSharingRowAction()
                }
            }
            if let message = store.error {
                Text(verbatim: message)
                Button("Try Again") { Task { await store.refresh() } }
            } else if !store.belongs(to: session) || !store.loaded {
                ProgressView()
            } else if mode == .availability {
                if store.data.calendars.isEmpty { Text("No booking calendars yet.").foregroundStyle(.secondary) }
                ForEach(store.data.calendars) { calendar in
                    CalendarSharingSection(rows: true) {
                        BookingCalendarCard(calendar: calendar, open: { timelineID = calendar.id }, edit: { editing = calendar })
                        ForEach(calendar.requests) { request in
                            BookingHostRequestRow(calendarID: calendar.id, request: request) { failure = $0 }
                        }
                    }
                }
            } else {
                let rows = myView == .history ? store.data.history : store.data.upcoming
                if rows.isEmpty {
                    Text(myView == .list ? LocalizedStringKey("Nothing upcoming") : "No bookings yet.").foregroundStyle(.secondary)
                } else {
                    CalendarSharingSection(rows: true) {
                        ForEach(rows) { BookingGuestRequestRow(request: $0, session: session) }
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    private var myCalendar: some View {
        let blocks = store.data.appointments.map { r in
            let status = r.proposal != nil && !r.isHistory ? "Proposed change" : r.statusLabel
            let title = [r.calendarTitle, r.title, NSLocalizedString(status, comment: "")].compactMap { $0 }.joined(separator: " · ")
            return BookingGridItem(id: r.id, title: title, interval: r.displayedInterval, status: r.eventStatus, selectable: true)
        }
        return BookingGuestGrid(title: NSLocalizedString("My bookings", comment: ""), blocks: blocks, dates: myRange.dates,
                                changeRange: myRange.changeRange) { id in
            inspecting = store.data.appointments.first { $0.id == id }
        }
    }
}

private struct BookingGuestRequestRow: View {
    let request: BookingAppointment
    let session: CloudCalendarsAPI.Session
    @ObservedObject private var store = BookingStore.shared
    @State private var decision: BookingDecisionPrompt?
    @State private var cancelling: BookingAppointment?
    @State private var busy = false
    @State private var failure: String?

    var body: some View {
        VStack(alignment: .leading) {
            BookingRequestSummary(name: request.calendarTitle, request: request)
            if request.needsChangeResponse && !request.isHistory {
                PendingInvitationActions(accept: { decision = .init(request: request, decision: .accepted) },
                                         decline: { decision = .init(request: request, decision: .declined) })
            }
            Text(verbatim: bookingPurpose(request.appointmentType, request.customType) + " · " + bookingParticipantName(request.hostName))
                .font(CalendarTypography.subheadline).foregroundStyle(.secondary)
            if !request.isHistory && request.canCancel && request.calendarId != nil {
                CalendarEventRemovalButton(title: "Cancel booking") { cancelling = request }
            }
            if let failure { Text(verbatim: failure).foregroundStyle(.red) }
        }
        .disabled(busy)
        .bookingDecisionConfirmation($decision) { submit($0.request, decision: $0.decision) }
        .guestBookingConfirmation(selection: $cancelling, cancelling: { _ in true },
            details: { [$0.calendarTitle, $0.interval.label].joined(separator: "\n") }) { submit($0, decision: nil) }
    }

    private func submit(_ snapshot: BookingAppointment, decision: BookingDecision?) {
        guard !busy, store.belongs(to: session), let id = snapshot.calendarId,
              let current = store.data.appointments.first(where: { $0.id == snapshot.id && $0.calendarId == id }), !current.isHistory else { return }
        let path = "/" + id + "/requests/" + current.id
        var body: [String: any Sendable]?
        if let decision {
            guard current.needsChangeResponse, let proposal = snapshot.proposal, current.proposal?.id == proposal.id else { return }
            body = ["status": decision.rawValue, "proposalId": proposal.id]
        } else if !current.canCancel { return }
        busy = true
        failure = nil
        Task {
            defer { busy = false }
            do { try await store.mutate(path + (decision == nil ? "/cancel" : "/change-response"), body: body) }
            catch { failure = error.localizedDescription; await store.refresh() }
        }
    }
}

private struct BookingHostRequestRow: View {
    let calendarID: String
    let request: BookingAppointment
    let onFailure: (String) -> Void
    @ObservedObject private var store = BookingStore.shared

    @State private var decisionPrompt: BookingDecisionPrompt?

    var body: some View {
        VStack(alignment: .leading, spacing: 5) {
            BookingRequestSummary(name: bookingParticipantName(request.guestName), request: request)
            if request.needsHostResponse {
                PendingInvitationActions(
                    accept: { decisionPrompt = .init(request: request, decision: .accepted) },
                    decline: { decisionPrompt = .init(request: request, decision: .declined) }
                )
                    .disabled(store.decidingRequests.contains(request.id) || store.pendingMoves.contains {
                        $0.calendarID == calendarID && $0.entry.requestID == request.id
                    })
            }
        }
        .bookingDecisionConfirmation($decisionPrompt) { prompt in
            store.decide(calendarID: calendarID, requestID: prompt.request.id, decision: prompt.decision, onFailure: onFailure)
        }
    }
}

private struct BookingRequestSummary: View {
    let name: String
    let request: BookingAppointment
    var body: some View {
        let r = request
        HStack {
            VStack(alignment: .leading) {
                Text(verbatim: name).font(CalendarTypography.headline)
                if let title = r.title, !title.isEmpty { Text(verbatim: title).font(CalendarTypography.subheadline) }
                Text(verbatim: r.interval.label).font(CalendarTypography.subheadline)
                if let location = r.location, !location.isEmpty { Text(verbatim: location).font(CalendarTypography.subheadline).foregroundStyle(.secondary) }
                bookingVideo(r.videoCallURL, available: r.hasVideoCall)
                if let proposal = r.proposal {
                    Text("Proposed change").font(CalendarTypography.headline)
                    Text(verbatim: proposal.label)
                    if let title = proposal.title { Text(verbatim: title) }
                    if let location = proposal.location { Text(verbatim: location) }
                    bookingVideo(proposal.videoCallURL, available: proposal.hasVideoCall)
                }
            }
            .bookingStatusBar(r.eventStatus)
            Spacer()
            Text(LocalizedStringKey(r.statusLabel)).font(CalendarTypography.caption.bold()).foregroundStyle(.secondary)
        }
    }
    @ViewBuilder private func bookingVideo(_ value: String?, available: Bool?) -> some View {
        if let value, let url = URL(string: value), ["https", "http"].contains(url.scheme?.lowercased() ?? ""), url.host != nil {
            Link("Video Call", destination: url).font(CalendarTypography.subheadline)
        } else if available == true {
            Text("Video Call").font(CalendarTypography.subheadline).foregroundStyle(.secondary)
        }
    }
}

private struct BookingCalendarCard: View {
    let calendar: HostedBookingCalendar
    let open: () -> Void
    let edit: () -> Void

    var body: some View {
        HStack(spacing: 4) {
            Button(action: open) {
                HStack(spacing: 12) {
                    Image(systemName: "calendar")
                        .font(.system(size: 22, weight: .medium))
                        .frame(width: 42, height: 42)
                        .background(CalendarPalette.tertiaryFill, in: RoundedRectangle(cornerRadius: 12))
                        .accessibilityHidden(true)
                    VStack(alignment: .leading, spacing: 3) {
                        Text(verbatim: calendar.title).font(CalendarTypography.headline)
                        Text(verbatim: bookingPurpose(calendar.appointmentType, calendar.customType))
                            .font(CalendarTypography.subheadline).foregroundStyle(.secondary)
                    }
                    .fixedSize(horizontal: false, vertical: true)
                }
                .frame(maxWidth: .infinity, minHeight: 52, alignment: .leading)
                .contentShape(Rectangle())
            }
            .accessibilityHint(Text("Multi-day calendar view"))

            HStack(spacing: 0) {
                Button(action: edit) {
                    Label("Edit Calendar", systemImage: "pencil")
                        .frame(width: 44, height: 44).contentShape(Rectangle())
                }
                .help(Text("Edit Calendar"))
                ShareLink(item: bookingLink(calendar.id)) {
                    Label("Share", systemImage: "square.and.arrow.up")
                        .frame(width: 44, height: 44).contentShape(Rectangle())
                }
                .help(Text("Share"))
            }
            .labelStyle(.iconOnly)
            .font(CalendarTypography.body)
            .foregroundStyle(Color.appBlue)
            .fixedSize()
        }
        .buttonStyle(.plain)
    }
}

struct BookingAvailabilitySheet: View {
    let calendarID: String
    @ObservedObject private var store = BookingStore.shared
    @State private var failure: String?
    @Environment(\.dismiss) private var dismiss
    @State private var slotTarget: BookingSlotTarget?

    var body: some View {
        BookingSheet(title: "Available times", leading: "Close", back: { dismiss() }) {
            CalendarSharingForm {
                if let calendar = store.data.calendars.first(where: { $0.id == calendarID }) {
                    let pending = calendar.requests.filter(\.needsHostResponse)
                    if !pending.isEmpty {
                        CalendarSharingSection("Pending", rows: true) {
                            ForEach(pending) { request in
                                BookingHostRequestRow(calendarID: calendar.id, request: request) { failure = $0 }
                            }
                        }
                    }
                    CalendarSharingSection(rows: true) {
                        Button("Add time slot") { slotTarget = .init(calendar: calendar) }.calendarSharingRowAction()
                        ForEach(calendar.slots) { slot in
                            Button { slotTarget = .init(calendar: calendar, slot: slot) } label: {
                              VStack(alignment: .leading) {
                                if let title = slot.title, !title.isEmpty { Text(verbatim: title).font(CalendarTypography.headline) }
                                Text(verbatim: slot.label)
                                if let location = slot.location { Text(verbatim: location).font(CalendarTypography.subheadline).foregroundStyle(.secondary) }
                                if slot.videoCallURL != nil { Text("Video Call").font(CalendarTypography.subheadline).foregroundStyle(.secondary) }
                                if let summary = slot.repeatSummary { Label { Text(verbatim: summary) } icon: { Image(systemName: "repeat") }.font(CalendarTypography.caption).foregroundStyle(.secondary) }
                              }.bookingStatusBar(calendar.status(for: slot)).frame(maxWidth: .infinity, alignment: .leading).contentShape(Rectangle())
                            }.buttonStyle(.plain)
                        }
                    }
                }
            }
        }
        .appSheet(item: $slotTarget) { target in
            BookingTimeEditor(calendar: target.calendar, original: target.slot)
        }
        .alert("Bookings", isPresented: Binding(get: { failure != nil }, set: { if !$0 { failure = nil } })) {
            Button("OK") { failure = nil }
        } message: { Text(verbatim: failure ?? "") }
    }
}

private func bookingPurpose(_ type: String?, _ custom: String?) -> String {
    if type == "Other", let custom, !custom.isEmpty { return custom }
    return NSLocalizedString(type == "Other" ? "Other appointment type" : (type ?? "General appointment"), comment: "")
}

private struct BookingTypeGroup: Decodable {
    let title: String
    let types: [String]

    static let catalog: [BookingTypeGroup] = {
        guard let url = Bundle.main.url(forResource: "BookingTypes", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let groups = try? JSONDecoder().decode([BookingTypeGroup].self, from: data) else { return [] }
        return groups
    }()

    static func matching(_ query: String) -> [BookingTypeGroup] {
        let text = query.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return catalog }
        return catalog.compactMap { group in
            if group.title.localizedCaseInsensitiveContains(text) || NSLocalizedString(group.title, comment: "").localizedCaseInsensitiveContains(text) { return group }
            let types = group.types.filter { $0.localizedCaseInsensitiveContains(text) || bookingPurpose($0, nil).localizedCaseInsensitiveContains(text) }
            return types.isEmpty ? nil : .init(title: group.title, types: types)
        }
    }
}

private enum BookingRepeat: String, CaseIterable {
    case never = "Never", daily = "Every Day", weekly = "Every Week", monthly = "Every Month"
    case yearly = "Every Year", fortnightly = "Every 2 Weeks", custom = "Custom…"

    init(_ rule: SharedEventRecurrenceRule?) {
        guard let rule else { self = .never; return }
        if rule.daysOfTheWeek != nil || rule.daysOfTheMonth != nil || rule.monthsOfTheYear != nil ||
           rule.weeksOfTheYear != nil || rule.daysOfTheYear != nil || rule.setPositions != nil { self = .custom; return }
        if rule.frequency == EKRecurrenceFrequency.weekly.rawValue && rule.interval == 2 { self = .fortnightly; return }
        guard rule.interval == 1 else { self = .custom; return }
        switch EKRecurrenceFrequency(rawValue: rule.frequency) {
        case .daily: self = .daily
        case .weekly: self = .weekly
        case .monthly: self = .monthly
        case .yearly: self = .yearly
        default: self = .custom
        }
    }
}

private func bookingHourStepLabel(_ step: Int) -> String {
    step < 0 ? NSLocalizedString("Custom schedule", comment: "") : step == 0 ? NSLocalizedString("Never", comment: "") :
        Duration.seconds(step * 3600).formatted(.units(allowed: [.hours], width: .wide).locale(.appFormatting))
}

private extension BookingInterval {
    var repeatSummary: String? {
        guard let rule else { return nil }
        let period = NSLocalizedString(BookingRepeat(rule).rawValue, comment: "")
        if dailyPattern != nil { return period + " · " + NSLocalizedString("Custom schedule", comment: "") }
        guard let hours = hoursOfDay, hours.count > 1 else { return period }
        let draft = BookingTimeDraft(self)
        let times = draft.clockLabel(hours[0]) + " – " + draft.clockLabel(hours[hours.count-1])
        let parts = [draft.choice == .never ? nil : period, bookingHourStepLabel(draft.hourStep), times]
        return parts.compactMap { $0 }.joined(separator: " · ")
    }
}

private extension SharedEventRecurrenceRule {
    var bookingPayload: [String: any Sendable] {
        var fields: [String: any Sendable] = ["frequency": frequency, "interval": interval]
        fields["daysOfTheWeek"] = daysOfTheWeek?.map { ["weekday": $0.weekday, "weekNumber": $0.weekNumber] }
        fields["daysOfTheMonth"] = daysOfTheMonth
        fields["monthsOfTheYear"] = monthsOfTheYear
        fields["weeksOfTheYear"] = weeksOfTheYear
        fields["daysOfTheYear"] = daysOfTheYear
        fields["setPositions"] = setPositions
        fields["endDate"] = endDate
        fields["occurrenceCount"] = occurrenceCount
        return fields
    }
}

private struct BookingTimeDraft: Identifiable {
    let id: String
    var start, end: Date
    var title, location, videoCallURL: String
    var structuredLocation: SharedEventLocation?
    let zone: TimeZone
    var choice: BookingRepeat
    var frequency: EKRecurrenceFrequency
    var interval: Int
    var pattern: CalendarRecurrencePattern
    var until: Date?
    var count: Int?
    var hourStep: Int
    var firstHour: Int
    var lastHour: Int
    var allDay = false
    var breaks: [BookingBreak] = []
    var gap = 0
    var closeMinute = 1080
    var firstMinute = 0

    var duration: Int {
        get { Int((end.timeIntervalSince(start)/60).rounded()) }
        set { end = start.addingTimeInterval(Double(max(0,min(1440,newValue)))*60) }
    }
    func minute(_ date: Date) -> Int { calendar.component(.hour, from: date)*60 + calendar.component(.minute, from: date) }
    var dailyPattern: BookingDailyPattern {
        .init(first:firstMinute,last:closeMinute-duration,step:duration+max(-1,min(1440,gap)),breaks:breaks)
    }
    mutating func addBreak() {
        setHourStep(-1)
        let first = min(1380,breaks.last?.end ?? 720)
        breaks.append(.init(start:first,end:first+60))
    }
    var displayedEnd: Date {
        get { allDay ? calendar.startOfDay(for: end.addingTimeInterval(-1)) : end }
        set { end = allDay ? calendar.dateInterval(of: .day, for: newValue)!.end : newValue }
    }
    mutating func setAllDay(_ enabled: Bool) {
        if enabled {
            start = calendar.startOfDay(for:start)
            end = calendar.dateInterval(of:.day,for:max(start,end.addingTimeInterval(-1)))!.end
        } else {
            let last = displayedEnd
            start = calendar.date(bySettingHour:9,minute:0,second:0,of:start) ?? start
            end = calendar.date(bySettingHour:10,minute:0,second:0,of:last) ?? start.addingTimeInterval(3600)
            firstMinute = minute(start)
        }
        allDay = enabled
    }

    var dailyHours: [Int] {
        guard hourStep > 0, firstHour >= 0, firstHour < 24 else { return [] }
        return Array(stride(from: firstHour, through: min(23, lastHour), by: hourStep))
    }
    var lastHourOptions: [Int] {
        guard hourStep > 0 else { return [] }
        let seedHour = calendar.component(.hour, from: start)
        return stride(from: firstHour + hourStep, to: 24, by: hourStep).filter { $0 >= seedHour }
    }
    var validDailyHours: Bool {
        if allDay { return true }
        if hourStep == -1 { return (0...1439).contains(gap) && !dailyPattern.minutes(duration:Double(duration)).isEmpty }
        return hourStep == 0 || (dailyHours.count >= 2 && dailyHours.contains(calendar.component(.hour, from: start))
            && end.timeIntervalSince(start) <= Double(hourStep * 3600))
    }
    mutating func setHourStep(_ value: Int) {
        if value == -1 {
            if hourStep != -1 {
                firstMinute = hourStep > 0 ? firstHour*60 + minute(start)%60 : minute(start)
                closeMinute = min(1440,hourStep > 0 ? lastHour*60 + minute(start)%60 + duration : max(1080,firstMinute+duration))
                gap = hourStep > 0 ? max(0,hourStep*60-duration) : 0
            }
            hourStep = value
            return
        }
        hourStep = value
        firstHour = calendar.component(.hour, from: start)
        if let first = lastHourOptions.first {
            lastHour = lastHourOptions.last(where: { $0 <= lastHour }) ?? first
        }
    }
    func clockLabel(_ hour: Int) -> String {
        let minute = calendar.component(.minute, from: start)
        let date = Date(timeIntervalSince1970: TimeInterval(hour * 3600 + minute * 60))
        #if os(macOS)
        return MacCalendarFormatting.timeFormatter(timeZone: .gmt).string(from: date)
        #else
        return appTimeFormatter(timeZone: .gmt).string(from: date)
        #endif
    }

    var calendar: Calendar {
        var value = Calendar(identifier: .gregorian)
        value.timeZone = zone
        return value
    }
    init(_ slot: BookingInterval) {
        id = slot.id
        title = slot.title ?? ""
        location = slot.location ?? ""
        videoCallURL = slot.videoCallURL ?? ""
        structuredLocation = slot.structuredLocation
        let date = BookingInterval.date(slot.start)
        start = date
        end = BookingInterval.date(slot.end)
        zone = slot.timeZone.flatMap(TimeZone.init(identifier:)) ?? .current
        let rule = slot.rule?.makeRule()
        choice = BookingRepeat(slot.rule)
        frequency = rule?.frequency ?? .daily
        interval = rule?.interval ?? 1
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = zone
        pattern = CalendarRecurrencePattern(rule: rule, start: date, calendar: calendar)
        until = slot.rule?.endDate.map(BookingInterval.date)
        count = slot.rule?.occurrenceCount
        let hours = slot.hoursOfDay ?? []
        firstHour = hours.first ?? calendar.component(.hour, from: date)
        hourStep = hours.count > 1 ? hours[1] - hours[0] : 0
        lastHour = hours.last ?? 17
        allDay = slot.allDay == true
        firstMinute = firstHour*60+calendar.component(.minute,from:date)
        if let p = slot.dailyPattern {
            let span = Int((end.timeIntervalSince(start)/60).rounded())
            hourStep = -1; firstMinute = p.first; gap = max(0,p.step-span); closeMinute = p.last+span; breaks = p.breaks
        }
        if hourStep != 0, choice == .daily, let until, calendar.isDate(date, inSameDayAs: until) {
            choice = .never
            self.until = nil
        }
    }
    init(start: Date) {
        self.init(.init(id: UUID().uuidString.lowercased(), start: DeviceCalendarEvent.iso(start),
                        end: DeviceCalendarEvent.iso(start.addingTimeInterval(3600))))
    }
    mutating func setStart(_ value: Date) {
        let previousHour = calendar.component(.hour, from: start)
        if allDay {
            let days = max(1,calendar.dateComponents([.day],from:start,to:end).day ?? 1)
            start = calendar.startOfDay(for:value)
            end = calendar.date(byAdding:.day,value:days,to:start)!
        } else {
            if hourStep == -1 && minute(value) != minute(start) { firstMinute = minute(value) }
            end = value.addingTimeInterval(end.timeIntervalSince(start))
            start = value
            if hourStep > 0 && calendar.component(.hour, from: value) != previousHour { setHourStep(hourStep) }
        }
        if let until, until < value { self.until = calendar.dateInterval(of: .day, for: value)?.end.addingTimeInterval(-1) }
    }
    mutating func select(_ value: BookingRepeat) {
        if value != .custom {
            switch value {
            case .weekly, .fortnightly: frequency = .weekly
            case .monthly: frequency = .monthly
            case .yearly: frequency = .yearly
            default: frequency = .daily
            }
            interval = value == .fortnightly ? 2 : 1
            pattern = .init(rule: nil, start: start, calendar: calendar)
        }
        if value == .never { until = nil; count = nil }
        choice = value
    }
    var payload: [String: any Sendable] {
        var result: [String: any Sendable] = ["id": id, "start": DeviceCalendarEvent.iso(start),
                                              "end": DeviceCalendarEvent.iso(end), "timeZone": zone.identifier]
        result["title"] = title
        result.merge(bookingVenue(location, structuredLocation, videoCallURL)) { _, new in new }
        result["allDay"] = allDay
        if hourStep == -1 && !allDay { result["dailyPattern"] = dailyPattern.payload } else { result["dailyPattern"] = NSNull() }
        if hourStep > 0 && !allDay { result["hoursOfDay"] = dailyHours } else { result["hoursOfDay"] = NSNull() }
        if choice == .never {
            if hourStep != 0, !allDay, let day = calendar.dateInterval(of: .day, for: start) {
                result["rule"] = ["frequency": 0, "interval": 1, "endDate": DeviceCalendarEvent.iso(day.end.addingTimeInterval(-0.001))] as [String: any Sendable]
            } else { result["rule"] = NSNull() }
            return result
        }
        let rule: EKRecurrenceRule
        if choice == .custom {
            rule = pattern.rule(frequency: frequency, interval: interval, end: until)
        } else {
            rule = EKRecurrenceRule(recurrenceWith: frequency, interval: interval, end: nil)
        }
        rule.recurrenceEnd = until.map(EKRecurrenceEnd.init(end:)) ?? count.map(EKRecurrenceEnd.init(occurrenceCount:))
        result["rule"] = SharedEventRecurrenceRule(rule: rule).bookingPayload
        return result
    }
}

private struct BookingSheet<Content: View>: View {
    let title: LocalizedStringKey
    let leading: LocalizedStringKey
    var back: () -> Void
    var save: (() -> Void)? = nil
    var canSave = true
    @ViewBuilder var content: () -> Content

    var body: some View {
        CalendarSheetNavigation { page }
            .calendarSharingSheetSize()
    }

    var page: some View {
        VStack(spacing: 0) {
            #if os(macOS)
            MacCalendarSheetHeader(title: Text(title)) {
                MacCalendarToolbarIconButton(icon: leading == "Back" ? "chevron.backward" : "xmark", title: leading, action: back)
            } trailing: {
                if let save { MacCalendarToolbarIconButton(icon: "checkmark", title: "Save", action: save).disabled(!canSave) }
            }
            #endif
            content()
        }
        .background(CalendarPalette.groupedBackground)
        #if os(iOS)
        .navigationTitle(title)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            AppSheetToolbarItem(placement: .cancellationAction) { AppToolbarTextButton(leading, action: back) }
            if let save {
                AppSheetToolbarItem(placement: .confirmationAction) { AppToolbarTextButton("Save", action: save).disabled(!canSave) }
            }
        }
        #endif
    }
}

private struct BookingTypeRow: View {
    let selection: String
    let open: () -> Void

    var body: some View {
        Button(action: open) {
            HStack {
                Text("Appointment type")
                Spacer()
                Text(verbatim: selection.isEmpty ? NSLocalizedString("Choose type", comment: "") : bookingPurpose(selection, nil))
                    .foregroundStyle(.secondary)
                Image(systemName: "chevron.forward").font(CalendarTypography.caption).foregroundStyle(.secondary)
            }.contentShape(Rectangle())
        }.buttonStyle(.plain)
    }
}

private struct BookingTypePicker: View {
    let selection: String
    var category = ""
    var allowsClear = false
    let back: () -> Void
    let choose: (String) -> Void
    @State private var search = ""

    var body: some View {
        #if os(macOS)
        VStack(spacing: 0) {
            MacCalendarSheetHeader(title: Text("Appointment type")) {
                MacCalendarToolbarIconButton(icon: "chevron.backward", title: "Back", action: back)
            } trailing: { EmptyView() }
            form
        }
        .background(CalendarPalette.groupedBackground)
        .navigationBarBackButtonHidden()
        #else
        form.navigationTitle("Appointment type").navigationBarTitleDisplayMode(.inline)
        #endif
    }

    private var form: some View {
        CalendarSharingForm {
            CalendarSharingSection(rows: true) {
                HStack { Image(systemName: "magnifyingglass").foregroundStyle(.secondary)
                    TextField("Search appointment types", text: $search).textFieldStyle(.plain)
                }
            }
            if allowsClear && !selection.isEmpty {
                CalendarSharingSection(rows: true) {
                    Button("Clear") { choose("") }.calendarSharingRowAction()
                }
            }
            let groups = BookingTypeGroup.matching(search).filter { category.isEmpty || $0.title == category }
            if groups.isEmpty { CalendarSharingSection { Text("No matching types").foregroundStyle(.secondary) } }
            ForEach(groups, id: \.title) { group in
                CalendarSharingSection(LocalizedStringKey(group.title), rows: true) {
                    ForEach(group.types, id: \.self) { item in
                        Button {
                            choose(item)
                        } label: {
                            HStack {
                                Text(verbatim: bookingPurpose(item, nil))
                                Spacer()
                                if selection == item { Image(systemName: "checkmark").foregroundStyle(Color.appBlue) }
                            }.contentShape(Rectangle())
                        }.buttonStyle(.plain)
                    }
                }
            }
        }
    }

}

private struct BookingCalendarEditor: View {
    let calendar: HostedBookingCalendar
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var store = BookingStore.shared
    @State private var title: String
    @State private var type: String
    @State private var customType: String
    @State private var listed: Bool
    @State private var choosingType = false
    @State private var busy = false
    @State private var error: String?
    @State private var confirming = false

    init(calendar: HostedBookingCalendar) {
        self.calendar = calendar
        _title = State(initialValue: calendar.title)
        _type = State(initialValue: calendar.appointmentType ?? (calendar.revision == 0 ? "" : "General appointment"))
        _customType = State(initialValue: calendar.customType ?? "")
        _listed = State(initialValue: calendar.listed ?? true)
    }
    var body: some View {
        NavigationStack {
            BookingSheet(title: "Booking calendar", leading: "Close", back: { dismiss() }, save: { persist(false) },
                        canSave: !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !type.isEmpty) {
                editor
            }.page
            #if os(macOS)
            .toolbar(.hidden, for: .windowToolbar)
            #endif
            .navigationDestination(isPresented: $choosingType) {
                BookingTypePicker(selection: type, back: { choosingType = false }) { item in
                    type = item
                    choosingType = false
                }
            }
        }
        .calendarSharingSheetSize()
        .disabled(busy).interactiveDismissDisabled(busy)
        .confirmationDialog("Delete booking calendar?", isPresented: $confirming, titleVisibility: .visible) {
            Button("Delete", role: .destructive) { persist(true) }
            Button("Cancel", role: .cancel) {}
        }
    }
    private var editor: some View {
        CalendarSharingForm {
            CalendarSharingSection(rows: true) {
                TextField("Name", text: $title).textFieldStyle(.plain)
                BookingTypeRow(selection: type) { choosingType = true }
                if type == "Other" { TextField("Custom type (optional)", text: $customType).textFieldStyle(.plain) }
                Toggle(isOn: $listed) {
                    Text("Show in booking search")
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .contentShape(Rectangle())
                }
                #if os(macOS)
                .toggleStyle(.switch)
                .controlSize(.large)
                #endif
            }
            if calendar.revision > 0 {
                CalendarRemovalSection { confirming = true }
            }
            if let error { CalendarSharingSection { Text(verbatim: error).foregroundStyle(.red) } }
        }
    }
    private func persist(_ remove: Bool) {
        guard !busy else { return }
        busy = true
        Task {
            defer { busy = false }
            do {
                if remove { try await store.mutate("/" + calendar.id + "?revision=" + String(calendar.revision), method: "DELETE") }
                else {
                    var body: [String: any Sendable] = ["title": title]
                    body["revision"] = calendar.revision
                    body["appointmentType"] = type
                    body["listed"] = listed
                    body["customType"] = type == "Other" ? customType : ""
                    body["slots"] = calendar.slots.map(\.payload)
                    try await store.mutate("/" + calendar.id, body: body)
                }
                dismiss()
            } catch { self.error = error.localizedDescription }
        }
    }
}

// Use the event editor's platform rows so date chips, separators and menus have
// the same height and alignment as Starts, Ends and Repeat on a regular event.
private struct BookingEventSection<Content: View>: View {
    @ViewBuilder var content: () -> Content
    var body: some View {
        #if os(macOS)
        MacCalendarFormSection {
            Group(subviews: content()) { rows in
                ForEach(rows) { row in MacCalendarFormRow(separator: row.id != rows.last?.id) { row } }
            }
        }
        #else
        Section(content: content)
        #endif
    }
}

private struct BookingTimeEditor: View {
    let calendar: HostedBookingCalendar
    let original: BookingInterval?
    let occurrence: Bool
    let reservation: BookingAppointment?
    @Environment(\.dismiss) private var dismiss
    @State private var slot: BookingTimeDraft
    @State private var choosingLocation = false
    #if os(iOS)
    @StateObject private var locationSearch = EventLocationSearchModel()
    #endif
    @State private var customRepeat = false
    @State private var expanded: CalendarDatePickerFocus?
    @State private var busy = false
    @State private var confirmRemove = false
    @State private var error: String?

    init(calendar: HostedBookingCalendar, original: BookingInterval?, occurrence: Bool = false,
         reservation: BookingAppointment? = nil, initialInterval: DateInterval? = nil, initialAllDay: Bool = false) {
        self.calendar = calendar
        self.original = original
        let booked = reservation ?? original.flatMap(calendar.reservation(for:))
        self.occurrence = occurrence || booked != nil
        self.reservation = booked
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()
        let start = Calendar.current.date(bySettingHour: 9, minute: 0, second: 0, of: tomorrow) ?? tomorrow
        let lastEnd = calendar.slots.last.map { BookingInterval.date($0.end) }
        var draft = original.map(BookingTimeDraft.init) ?? .init(start: initialInterval?.start ?? max(start,lastEnd ?? start))
        if let initialInterval { draft.end = initialInterval.end; draft.allDay = initialAllDay }
        _slot = State(initialValue: draft)
    }

    private var locked: Bool {
        if occurrence { return reservation?.proposal != nil || reservation?.status == "past" }
        // The server validates all existing reservations before saving a series edit.
        if original?.hoursOfDay != nil || original?.dailyPattern != nil { return false }
        return calendar.requests.contains { $0.active && ($0.slotId == slot.id || $0.slotId.hasPrefix(slot.id + "@")) }
    }

    var body: some View {
        BookingSheet(title: customRepeat ? "Custom" : (reservation != nil ? "Booking" : original == nil ? "Add time slot" : "Available time"),
                     leading: customRepeat ? "Back" : "Close", back: {
            if customRepeat { customRepeat = false } else { dismiss() }
        }, save: (customRepeat || locked) ? nil : { persist(remove: false) }, canSave: slot.end > slot.start && slot.validDailyHours) {
            if customRepeat {
                CalendarRecurrenceEditor(frequency: $slot.frequency, interval: $slot.interval, pattern: $slot.pattern,
                                         startDate: slot.start, timeZone: slot.zone)
            } else { form }
        }
        .disabled(busy).interactiveDismissDisabled(busy)
        .confirmationDialog("Remove time slot?", isPresented: $confirmRemove, titleVisibility: .visible) {
            Button("Remove", role: .destructive) { persist(remove: true) }
            Button("Cancel", role: .cancel) {}
        }
    }
    private var form: some View {
        CalendarSharingForm {
            if let reservation {
                Text(reservation.proposal != nil ? LocalizedStringKey("Awaiting guest response") :
                     reservation.status == "past" ? "Past" : "The guest will be asked to accept this change.")
            }
            CalendarEventTitleLocationSection(title: $slot.title, location: slot.location.isEmpty ? slot.videoCallURL : slot.location,
                allowsVideoLink: true, editLocation: { choosingLocation = true }, clearLocation: {
                    slot.location = ""
                    slot.structuredLocation = nil
                    slot.videoCallURL = ""
                })
            BookingEventSection {
                    Toggle(isOn: Binding(get: { slot.allDay }, set: { slot.setAllDay($0); expanded = nil })) {
                        Text("All-day").frame(maxWidth: .infinity, alignment: .leading)
                    }
                    #if os(macOS)
                    .toggleStyle(.switch).controlSize(.large)
                    #endif
                    CalendarDateTimePickerRow(title: "Starts", id: slot.id + "-start",
                        selection: Binding(get: { slot.start }, set: { slot.setStart($0) }), showsTime: !slot.allDay, expanded: $expanded)
                    CalendarDateTimePickerRow(title: "Ends", id: slot.id + "-end",
                        selection: $slot.displayedEnd, range: slot.start...Date.distantFuture, showsTime: !slot.allDay, expanded: $expanded)
            }.calendarDatePickerColumns([slot.start,slot.end])
            if !occurrence { BookingEventSection {
                CalendarEventEditorMenuRow(title: "Repeat", value: NSLocalizedString(slot.choice == .custom ? "Custom" : slot.choice.rawValue, comment: "")) {
                    ForEach(BookingRepeat.allCases, id: \.self) { choice in
                        if choice == .custom { Divider() }
                        Button {
                            slot.select(choice)
                            expanded = nil
                            if choice == .custom { customRepeat = true }
                        } label: {
                            if choice == slot.choice { Label(LocalizedStringKey(choice.rawValue), systemImage: "checkmark") }
                            else { Text(LocalizedStringKey(choice.rawValue)) }
                        }
                    }
                }
                if !slot.allDay { CalendarEventEditorMenuRow(title: "Repeat within day", value: bookingHourStepLabel(slot.hourStep)) {
                    ForEach(0..<24, id: \.self) { step in
                        Button(bookingHourStepLabel(step)) { slot.setHourStep(step) }
                    }
                    Button("Custom schedule") { slot.setHourStep(-1) }
                }
                if slot.hourStep > 0 {
                    let hours = slot.lastHourOptions
                    CalendarEventEditorMenuRow(title: "Last start", value: hours.isEmpty ? "—" : slot.clockLabel(slot.lastHour)) {
                        ForEach(hours, id: \.self) { hour in
                            Button(slot.clockLabel(hour)) { slot.lastHour = hour }
                        }
                    }
                    if !slot.validDailyHours {
                        Text("Choose an interval that fits at least two non-overlapping slots in the day.").font(CalendarTypography.footnote).foregroundStyle(.secondary)
                    }
                }
                if slot.hourStep == -1 { customScheduleRows }
                Button {
                    slot.addBreak()
                } label: {
                    Text("Add break")
                        .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                        .contentShape(Rectangle())
                }
                #if os(macOS)
                .buttonStyle(.plain)
                .foregroundStyle(Color.appBlue)
                #endif
                }
                if slot.choice != .never {
                    CalendarEventEditorMenuRow(title: "End Repeat", value: slot.count.map { localizedIntegerString($0) }
                        ?? NSLocalizedString(slot.until == nil ? "Never" : "On Date", comment: "")) {
                        Button("Never") { slot.until = nil; slot.count = nil; expanded = nil }
                        Button("On Date") {
                            let proposed = slot.until ?? slot.calendar.date(byAdding: .month, value: 1, to: slot.start) ?? slot.start
                            slot.until = slot.calendar.dateInterval(of: .day, for: proposed)?.end.addingTimeInterval(-1)
                            slot.count = nil
                        }
                    }
                    if slot.until != nil {
                        CalendarDateTimePickerRow(title: "End Date", id: slot.id + "-until", selection: Binding(
                            get: { slot.until ?? slot.start }, set: { value in
                                slot.until = slot.calendar.dateInterval(of: .day, for: value)?.end.addingTimeInterval(-1)
                            }), range: slot.start...Date.distantFuture, showsTime: false, expanded: $expanded)
                    }
                }
            }
            }
            if original != nil && reservation == nil && !locked {
                CalendarEventRemovalSection(title: "Remove time slot") { confirmRemove = true }
            }
            if let error { CalendarSharingSection { Text(verbatim: error).foregroundStyle(.red) } }
        }
        .environment(\.timeZone, slot.zone)
        .disabled(locked)
        .appSheet(isPresented: $choosingLocation) {
            #if os(macOS)
            MacEventLocationEditorSheet(location: $slot.location, structuredLocation: Binding(
                get: { slot.structuredLocation?.makeLocation() },
                set: { slot.structuredLocation = $0.map(SharedEventLocation.init(location:)) }),
                videoCallURL: $slot.videoCallURL, allowsVideoLink: true) { choosingLocation = false }
            #else
            EventLocationEditorSheet(location: $slot.location, structuredLocation: $slot.structuredLocation,
                videoCallURL: $slot.videoCallURL, allowsVideoLink: true, searchModel: locationSearch)
                .presentationDetents([.large]).presentationDragIndicator(.hidden)
            #endif
        }
    }

    @ViewBuilder private var customScheduleRows: some View {
        minuteCount("Duration (minutes)", value: $slot.duration)
        minuteCount("Pause between appointments (minutes)", value: $slot.gap)
        clockRow("Workday ends", id: "workday-end", minute: $slot.closeMinute, midnightEndsDay: true)
        ForEach($slot.breaks) { $pause in
            HStack {
                Text("Break")
                Spacer()
                Button(role: .destructive) {
                    let id = pause.id
                    expanded = nil
                    slot.breaks.removeAll { $0.id == id }
                } label: {
                    Image(systemName: "trash")
                        .frame(minWidth: 44, minHeight: 44, alignment: .trailing)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.borderless)
                .foregroundStyle(.red)
                .accessibilityLabel(Text("Remove"))
            }
            clockRow("Starts", id: pause.id.uuidString + "-start", minute: $pause.start)
            clockRow("Ends", id: pause.id.uuidString + "-end", minute: $pause.end, midnightEndsDay: true)
        }
        if !slot.validDailyHours { Text("Check the daily schedule and breaks.").foregroundStyle(.secondary) }
    }

    private func minuteCount(_ title: LocalizedStringKey, value: Binding<Int>) -> some View {
        HStack {
            Text(title); Spacer()
            TextField("", value: value, format: .number.grouping(.never))
                .textFieldStyle(.plain)
                .multilineTextAlignment(.trailing)
                .frame(width:70).accessibilityLabel(Text(title))
                #if os(iOS)
                .keyboardType(.numberPad)
                #endif
        }
    }

    @ViewBuilder private func clockRow(_ title: LocalizedStringKey, id: String, minute: Binding<Int>, midnightEndsDay: Bool = false) -> some View {
        // This is a wall-clock field. Keep all minutes selectable even on a DST transition.
        let clock = Binding<Date>(
            get: { Date(timeIntervalSince1970: Double(minute.wrappedValue % 1440) * 60) },
            set: { date in
                var calendar = Calendar(identifier: .gregorian)
                calendar.timeZone = .gmt
                let value = calendar.component(.hour, from: date) * 60 + calendar.component(.minute, from: date)
                minute.wrappedValue = midnightEndsDay && value == 0 ? 1440 : value
            })
        #if os(macOS)
        CalendarDateTimePickerRow(title: title, id: id, selection: clock, showsDate: false, expanded: $expanded)
            .environment(\.timeZone, .gmt)
        #else
        HStack {
            Text(title)
            Spacer()
            DatePicker(title, selection: clock, displayedComponents: .hourAndMinute)
                .labelsHidden()
                .environment(\.timeZone, .gmt)
        }
        #endif
    }

    private func persist(remove: Bool) {
        guard !busy, !locked else { return }
        busy = true
        Task {
            defer { busy = false }
            var slots = calendar.slots.filter { $0.id != slot.id }.map(\.payload)
            if !remove { slots.append(slot.payload) }
            do {
                if occurrence {
                    var body = remove ? ["remove": true] as [String:any Sendable] : slot.payload
                    body["revision"] = calendar.revision
                    try await BookingStore.shared.mutate("/" + calendar.id + "/occurrences/" + slot.id, body: body)
                } else { try await BookingStore.shared.mutate("/" + calendar.id, body: [
                    "revision": calendar.revision, "title": calendar.title, "slots": slots
                ]) }
                dismiss()
            } catch { self.error = error.localizedDescription }
        }
    }
}

private struct BookingLookupSheet: View {
    let session: CloudCalendarsAPI.Session
    let select: (BookingOffer) -> Void
    @Environment(\.dismiss) private var dismiss
    @State private var requestedID: String?
    @State private var error: String?
    @State private var search = ""
    @State private var category = ""
    @State private var appointmentType = ""
    @State private var choosingType = false
    @State private var directory: [BookingListing] = []
    @State private var loading = true
    @State private var directoryError: String?
    @State private var attempt = 0

    private var matches: [BookingListing] {
        let query = search.trimmingCharacters(in: .whitespacesAndNewlines)
        let types = BookingTypeGroup.catalog.first { $0.title == category }?.types
        let matchingTypes = Set(BookingTypeGroup.matching(query).flatMap(\.types))
        return directory.filter { item in
            (appointmentType.isEmpty || item.appointmentType == appointmentType) && (types?.contains(item.appointmentType) ?? true) &&
                (query.isEmpty || matchingTypes.contains(item.appointmentType) ||
                 [item.title, item.hostName, item.appointmentType, item.customType ?? ""].contains { $0.localizedStandardContains(query) })
        }.sorted { $0.title.localizedStandardCompare($1.title) == .orderedAscending }
    }

    var body: some View {
        NavigationStack {
            lookupPage
                #if os(macOS)
                .toolbar(.hidden, for: .windowToolbar)
                #endif
                .navigationDestination(isPresented: $choosingType) {
                    BookingTypePicker(selection: appointmentType, category: category, allowsClear: true, back: { choosingType = false }) { item in
                        appointmentType = item
                        choosingType = false
                    }
                }
        }
        .calendarSharingSheetSize()
        #if os(macOS)
        .onExitCommand {
            if choosingType { choosingType = false } else { dismiss() }
        }
        #endif
        .task(id: attempt) { await loadDirectory() }
        .task(id: requestedID) {
            guard let requestedID else { return }
            do {
                let offer: BookingOffer = try await CloudCalendarsAPI.bookingRequest("/" + requestedID + "?includeBusy=true", session: session)
                guard !Task.isCancelled, CalendarFeedSession.isCurrent(session) else { return }
                select(offer)
            } catch {
                guard !Task.isCancelled else { return }
                self.error = error.localizedDescription
                self.requestedID = nil
            }
        }
    }

    @ViewBuilder private var categoryOptions: some View {
        Text("All categories").tag("")
        ForEach(BookingTypeGroup.catalog, id: \.title) { group in
            Text(LocalizedStringKey(group.title)).tag(group.title)
        }
    }

    private var lookupPage: some View {
        BookingSheet(title: "Open booking calendar", leading: "Close", back: { dismiss() }) {
            CalendarSharingForm {
                CalendarSharingSection(rows: true) {
                    HStack {
                        Image(systemName: "magnifyingglass").foregroundStyle(.secondary)
                        TextField("Search by name, category, or link", text: $search)
                            .textFieldStyle(.plain)
                            .onChange(of: search) { _, _ in openSearchLink() }
                            .onSubmit { openSearchLink(submitted: true) }
                    }
                    #if os(macOS)
                    AppPicker("Category", selection: $category) { categoryOptions }
                    #else
                    Picker("Category", selection: $category) { categoryOptions }.pickerStyle(.menu)
                    #endif
                    BookingTypeRow(selection: appointmentType) { choosingType = true }
                }
                CalendarSharingSection("Booking calendars", rows: true) {
                    let results = matches
                    ForEach(results) { item in
                        Button { requestedID = item.id } label: {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(verbatim: item.title).font(CalendarTypography.headline)
                                    Text(verbatim: bookingPurpose(item.appointmentType, item.customType) + " · " + bookingParticipantName(item.hostName))
                                        .font(CalendarTypography.subheadline).foregroundStyle(.secondary)
                                }
                                Spacer()
                                Image(systemName: "chevron.forward").font(CalendarTypography.caption).foregroundStyle(.secondary)
                            }.contentShape(Rectangle())
                        }.buttonStyle(.plain)
                    }
                    if loading { ProgressView() }
                    else if let directoryError {
                        Text(verbatim: directoryError).foregroundStyle(.red)
                        Button("Try Again") { attempt += 1 }
                    } else if results.isEmpty { Text("No matching calendars.").foregroundStyle(.secondary) }
                }
                if let error { Text(verbatim: error).foregroundStyle(.red) }
            }
            .disabled(requestedID != nil)
        }.page
        .onChange(of: category) { _, _ in appointmentType = "" }
    }
    private func loadDirectory() async {
        directory = []; directoryError = nil; loading = true
        defer { loading = false }
        do {
            var after: String?
            repeat {
                let path = "/directory" + (after.map { "?after=" + $0 } ?? "")
                let page: BookingDirectoryPage = try await CloudCalendarsAPI.bookingRequest(path, session: session)
                guard !Task.isCancelled, CalendarFeedSession.isCurrent(session) else { return }
                directory.append(contentsOf: page.calendars)
                after = page.next
            } while after != nil
        } catch { if !Task.isCancelled { directoryError = error.localizedDescription } }
    }
    private func openSearchLink(submitted: Bool = false) {
        error = nil
        let text = search.trimmingCharacters(in: .whitespacesAndNewlines)
        guard let url = URLComponents(string: text), let scheme = url.scheme?.lowercased(),
              ["https", "http"].contains(scheme) else { return }
        guard scheme == "https", ["www.cloud-calendars.com", "cloud-calendars.com"].contains(url.host?.lowercased() ?? ""),
              let value = url.queryItems?.first(where: { $0.name == "bookingCalendar" })?.value,
              let id = UUID(uuidString: value)?.uuidString.lowercased() else {
            if submitted { error = NSLocalizedString("Enter a booking calendar link.", comment: "") }
            return
        }
        requestedID = id
    }
}

private struct BookingGridRange: DynamicProperty {
    @State private var selectedCount: Int?
    @State var firstDay: Date
    init(start: Date = .now) {
        _firstDay = State(initialValue: Calendar.current.startOfDay(for: start))
    }
    #if os(iOS)
    @Environment(\.horizontalSizeClass) private var sizeClass
    #endif
    var dates: [Date] {
        #if os(iOS)
        let count = sizeClass == .compact ? 3 : 7
        #else
        let count = 7
        #endif
        return (0..<(selectedCount ?? count)).compactMap { Calendar.current.date(byAdding: .day, value: $0, to: firstDay) }
    }

    func changeRange(_ first: Date, _ last: Date) {
        let cal = Calendar.current
        let start = cal.startOfDay(for: first)
        let count = min(31, max(1, (cal.dateComponents([.day], from: start, to: cal.startOfDay(for: last)).day ?? 0) + 1))
        guard firstDay != start || dates.count != count else { return }
        firstDay = start
        selectedCount = count
    }

}

struct BookingOfferScreen: View {
    @Environment(\.scenePhase) private var scenePhase
    @State private var offer: BookingOffer
    let close: () -> Void
    @ObservedObject private var account = CloudAccountManager.shared
    @State private var busy = false
    @State private var error: String?

    @State private var multiDay = false
    private var range: BookingGridRange
    @State private var window: BookingOffer?
    @State private var windowError: String?
    @State private var refresh = 0
    @State private var selection: BookingInterval?
    @State private var confirmation: String?
    init(offer: BookingOffer, close: @escaping () -> Void) {
        _offer = State(initialValue: offer)
        let first = offer.displaySlots.first.map { $0.guestDisplayDate($0.start) } ?? .now
        range = BookingGridRange(start: max(.now, first))
        self.close = close
    }

    var body: some View {
        CalendarSheetNavigation {
            BookingSheet(title: "Open booking calendar", leading: "Close", back: close) {
                VStack(spacing: 0) {
                    CalendarSectionPicker(selection: $multiDay, rows: [[
                        .init(id: false, title: "List"), .init(id: true, title: "MultiDay")
                    ]])
                    .frame(maxWidth: 400).padding(.horizontal).padding(.vertical, 6)
                    if let error { Text(verbatim: error).foregroundStyle(.red).padding(.horizontal) }
                    if let confirmation { Text(verbatim: confirmation).foregroundStyle(.secondary) }
                    if multiDay { calendarGrid } else { list }
                }
            }.page
        }
        .guestBookingConfirmation(selection: $selection, cancelling: { $0.myBookingId != nil },
                                  details: { [offer.title, $0.title, $0.label, $0.location].compactMap { $0 }.joined(separator: "\n") },
                                  confirm: submit)
        .task(id: "\(multiDay)-\(range.firstDay.timeIntervalSinceReferenceDate)-\(range.dates.count)-\(refresh)-\(scenePhase == .active)") {
            guard multiDay, scenePhase == .active else { return }
            await loadWindow()
            while !Task.isCancelled {
                do { try await Task.sleep(for: .seconds(30)) } catch { return }
                await loadWindow()
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .disabled(busy)
        .onChange(of: account.isSignedIn) { _, signedIn in if !signedIn { close() } }
        .onChange(of: account.account?.ownerId) { old, new in if old != nil && new != old { close() } }
        #if os(macOS)
        .toolbar(.hidden, for: .windowToolbar)
        .onExitCommand { if !busy { close() } }
        #endif
    }

    private var list: some View {
        CalendarSharingForm {
            CalendarSharingSection(rows: true) {
                Text(verbatim: offer.title).font(CalendarTypography.headline)
                Text(verbatim: bookingPurpose(offer.appointmentType, offer.customType))
                Text(verbatim: bookingParticipantName(offer.hostName))
                if offer.isOwner { Text("Your booking calendar").foregroundStyle(.secondary) }
            }
            CalendarSharingSection("Available times", rows: true) {
                if offer.displaySlots.isEmpty { Text("No available times.") }
                ForEach(offer.displaySlots) { slot in
                    VStack(alignment: .leading, spacing: 4) {
                        HStack {
                            VStack(alignment: .leading) {
                                if slot.myBookingId != nil { Text("My booking").font(CalendarTypography.headline) }
                                else if slot.isBusy { Text("Busy").font(CalendarTypography.headline) }
                                else if let title = slot.title { Text(verbatim: title).font(CalendarTypography.headline) }
                                Text(verbatim: slot.label)
                                if let location = slot.location { Text(verbatim: location).font(CalendarTypography.subheadline).foregroundStyle(.secondary) }
                                if slot.hasVideoCall == true { Text("Video Call").font(CalendarTypography.subheadline).foregroundStyle(.secondary) }
                            }
                            .bookingStatusBar(slot.isBusy ? .unknown : .available)
                            Spacer()
                            if !offer.isOwner && !slot.isBusy && slot.myBookingId == nil {
                                Button("Book") { selection = slot }.buttonStyle(PendingInvitationActionStyle(prominent: true))
                            }
                        }
                        if !offer.isOwner && slot.myBookingId != nil {
                            CalendarEventRemovalButton(title: "Cancel booking") { selection = slot }
                        }
                    }
                }
                if let next = offer.nextFrom { Button("More available times") { loadMore(from: next) }.calendarSharingRowAction() }
            }
        }
    }

    private var calendarGrid: some View {
        ZStack {
            let slots = (window ?? offer).displaySlots
            let blocks = slots.map { slot in
                let title = slot.myBookingId != nil ? NSLocalizedString("My booking", comment: "") : slot.isBusy ? NSLocalizedString("Busy", comment: "") : slot.title ?? NSLocalizedString("Available time", comment: "")
                return BookingGridItem(id: slot.id, title: title, interval: slot, status: slot.isBusy ? .unknown : .available,
                                       selectable: !offer.isOwner && (!slot.isBusy || slot.myBookingId != nil))
            }
            BookingGuestGrid(title: offer.title, blocks: blocks, dates: range.dates, changeRange: { first, last in
                range.changeRange(first, last)
                selection = nil
                windowError = nil
            }) { id in
                if windowError == nil { selection = slots.first { $0.id == id } }
            }
            if let windowError {
                VStack { Text(verbatim: windowError); Button("Try Again") { refresh += 1 } }
                    .padding().background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
            } else if window == nil { ProgressView() }
        }
    }

    private func loadWindow() async {
        windowError = nil
        let calendar = Calendar.current
        guard let from = calendar.date(byAdding: .day, value: -1, to: range.firstDay),
              let to = calendar.date(byAdding: .day, value: range.dates.count + 1, to: range.firstDay) else { return }
        var route = URLComponents()
        route.path = "/" + offer.id
        route.queryItems = [.init(name: "from", value: from.ISO8601Format()), .init(name: "to", value: to.ISO8601Format())]
        guard let path = route.string else { return }
        do {
            let session = try await CalendarFeedSession.current()
            let page: BookingOffer = try await CloudCalendarsAPI.bookingRequest(path, session: session)
            guard !Task.isCancelled, CalendarFeedSession.isCurrent(session) else { return }
            window = page
            if let selection, !page.displaySlots.contains(where: { $0.id == selection.id && $0.myBookingId == selection.myBookingId && $0.start == selection.start && $0.end == selection.end }) {
                self.selection = nil
                error = NSLocalizedString("This time slot is no longer available.", comment: "")
            }
        } catch { if !Task.isCancelled { window = nil; selection = nil; windowError = error.localizedDescription } }
    }

    private func loadMore(from: String) {
        guard !busy else { return }
        var route = URLComponents()
        route.path = "/" + offer.id
        route.queryItems = [.init(name: "from", value: from), .init(name: "includeBusy", value: "true")]
        guard let path = route.string else { return }
        busy = true
        Task {
            defer { busy = false }
            do {
                let session = try await CalendarFeedSession.current()
                var page: BookingOffer = try await CloudCalendarsAPI.bookingRequest(path, session: session)
                guard CalendarFeedSession.isCurrent(session) else { return }
                let newBusy = page.busy ?? []
                let oldIDs = Set((offer.busy ?? []).map(\.id))
                page.busy = (offer.busy ?? []) + newBusy.filter { !oldIDs.contains($0.id) }
                page.slots = offer.slots + page.slots
                offer = page
                error = nil
            } catch { self.error = error.localizedDescription }
        }
    }
    private func submit(_ slot: BookingInterval) {
        guard !offer.isOwner, !slot.isBusy || slot.myBookingId != nil, !busy else { return }
        busy = true
        confirmation = nil; error = nil
        Task {
            defer { busy = false }
            do {
                let path = "/" + offer.id + "/requests/"
                if let id = slot.myBookingId {
                    try await BookingStore.shared.mutate(path + id + "/cancel")
                    confirmation = NSLocalizedString("Cancelled", comment: "") + " · " + slot.label
                } else {
                    try await BookingStore.shared.mutate(path + UUID().uuidString.lowercased(), body: ["slotId":slot.id])
                    confirmation = NSLocalizedString("Pending", comment: "") + " · " + slot.label
                }
            } catch { self.error = error.localizedDescription }
            refresh += 1
            do {
                let session = try await CalendarFeedSession.current()
                let latest: BookingOffer = try await CloudCalendarsAPI.bookingRequest("/" + offer.id + "?includeBusy=true", session: session)
                if CalendarFeedSession.isCurrent(session) { offer = latest }
            } catch { self.error = error.localizedDescription }
        }
    }
}
