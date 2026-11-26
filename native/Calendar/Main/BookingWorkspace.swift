import SwiftUI
import EventKit

struct BookingInterval: Codable, Identifiable {
    let id: String
    let start: String
    let end: String
    var title: String?
    var location: String?
    var structuredLocation: SharedEventLocation?
    var excludedStarts: [String]?
    var rule: SharedEventRecurrenceRule?
    var timeZone: String?
    var payload: [String: any Sendable] {
        var fields: [String: any Sendable] = ["id": id, "start": start, "end": end]
        fields["title"] = title
        fields["timeZone"] = timeZone
        fields["rule"] = rule?.bookingPayload
        return fields.merging(bookingVenue(location, structuredLocation)) { _, new in new }
    }
    static func date(_ value: String) -> Date {
        (try? Date(value, strategy: Date.ISO8601FormatStyle(includingFractionalSeconds: true))) ??
            (try? Date(value, strategy: .iso8601)) ?? .distantPast
    }
    var label: String {
        let from = Self.date(start), to = Self.date(end)
        return from.formatted(date: .abbreviated, time: .shortened) + " – " + to.formatted(date: Calendar.current.isDate(from, inSameDayAs: to) ? .omitted : .abbreviated, time: .shortened)
    }
}

struct BookingAppointment: Codable, Identifiable {
    let id, slotId, start, end, guestName, hostName, calendarTitle, status: String
    var appointmentType, customType: String?
    var title, location, calendarId: String?
    var structuredLocation: SharedEventLocation?
    var proposal: BookingInterval?
    var interval: BookingInterval { .init(id: slotId, start: start, end: end, title: title, location: location, structuredLocation: structuredLocation) }
    var eventStatus: BookingEventStatus { BookingEventStatus(rawValue: status) ?? .unknown }
    var active: Bool { status == "pending" || status == "accepted" }
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
}
private struct BookingOffer: Decodable {
    let id, title, hostName: String
    let isOwner: Bool
    var slots: [BookingInterval]
    let appointmentType, customType: String?
    var nextFrom: String?
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

private func bookingVenue(_ location: String?, _ point: SharedEventLocation?) -> [String: any Sendable] {
    var fields: [String: any Sendable] = ["location": location ?? "", "structuredLocation": NSNull()]
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
    var initialInterval: DateInterval?
    var id: String { calendar.id + (slot?.id ?? "-new") }
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
    @Published var data = BookingData()
    @Published var error: String?
    @Published var loaded = false
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
            data = BookingData()
            loaded = false
            error = nil
            account = session
            if let session, let saved = UserDefaults.standard.data(forKey: cacheKey(for: session)),
               let cached = try? JSONDecoder().decode(BookingData.self, from: saved) {
                data = cached
                loaded = true
            }
        }
        generation += 1
        let version = generation
        guard let session else { loaded = true; return }
        do {
            let updated: BookingData = try await CloudCalendarsAPI.bookingRequest("", session: session)
            guard generation == version, CalendarFeedSession.isCurrent(session) else { return }
            if let encoded = try? JSONEncoder().encode(updated) {
                let key = cacheKey(for: session)
                if UserDefaults.standard.data(forKey: key) != encoded { UserDefaults.standard.set(encoded, forKey: key) }
            }
            data = updated
            loaded = true
            error = nil
        } catch {
            if generation == version && CalendarFeedSession.isCurrent(session) { self.error = error.localizedDescription }
        }
    }
    @discardableResult
    func mutate(_ path: String, method: String = "PUT", body: [String: any Sendable]? = nil) async throws -> BookingReceipt {
        let session = try await CalendarFeedSession.current()
        let receipt: BookingReceipt = try await CloudCalendarsAPI.bookingRequest(path, method: method, body: body, session: session)
        guard CalendarFeedSession.isCurrent(session) else { throw CancellationError() }
        await refresh()
        return receipt
    }
}

struct BookingsContent: View {
    let mode: BookingViewMode
    let addAction: Int
    @Binding var timelineID: String?
    @ObservedObject private var manager = CloudAccountManager.shared

    var body: some View {
        if manager.isSignedIn, let session = CalendarFeedSession.existing {
            SignedInBookingsContent(mode: mode, addAction: addAction, session: session, timelineID: $timelineID)
                .id(session.calendarId)
        } else {
            CalendarSharingForm { CalendarSharingSection { CloudAccountSignInContent() } }
                .onAppear { timelineID = nil }
        }
    }
}

private struct SignedInBookingsContent: View {
    let mode: BookingViewMode
    let addAction: Int
    let session: CloudCalendarsAPI.Session
    @ObservedObject private var store = BookingStore.shared
    @Binding var timelineID: String?
    @State private var editing: HostedBookingCalendar?
    @State private var slotTarget: BookingSlotTarget?
    @State private var lookup = false
    @State private var deciding = false
    @State private var failure: String?
    var body: some View {
        Group {
            if let timelineID, mode == .availability, store.belongs(to: session),
               let schedule = store.data.calendars.first(where: { $0.id == timelineID }) {
                BookingCalendarTimeline(schedule: schedule, onBack: { self.timelineID = nil }, onEdit: { entry in
                    let base = schedule.slots.first { $0.id == entry.slotID.components(separatedBy: "@")[0] }
                    let request = schedule.requests.first { $0.id == entry.requestID }
                    let source = entry.proposed ? request?.proposal : request?.interval
                    let slot = BookingInterval(id: entry.slotID, start: DeviceCalendarEvent.iso(entry.start), end: DeviceCalendarEvent.iso(entry.end),
                        title: source?.title ?? base?.title, location: entry.location,
                        structuredLocation: source == nil ? base?.structuredLocation : source?.structuredLocation, timeZone: base?.timeZone)
                    slotTarget = .init(calendar: schedule, slot: slot, occurrence: true, reservation: request)
                }, onMove: { entry, interval in
                    Task {
                        do {
                            try await store.mutate("/" + schedule.id + "/occurrences/" + entry.slotID, body: [
                                "revision": schedule.revision, "start": DeviceCalendarEvent.iso(interval.start), "end": DeviceCalendarEvent.iso(interval.end)])
                        } catch { failure = error.localizedDescription; await store.refresh() }
                    }
                }, onCreate: { interval in slotTarget = .init(calendar: schedule, initialInterval: interval) })
                    .id(schedule.id)
            } else {
                bookingList
            }
        }
        .task {
            repeat {
                await store.refresh()
                do { try await Task.sleep(for: .seconds(30)) } catch { return }
            } while !Task.isCancelled
        }
        .onChange(of: store.data.calendars.map(\.id)) { _, ids in
            if let timelineID, !ids.contains(timelineID) { self.timelineID = nil }
        }
        .onChange(of: mode) { timelineID = nil }
        .onChange(of: addAction) { add() }
        .appSheet(item: $editing) { BookingCalendarEditor(calendar: $0) }
        .appSheet(item: $slotTarget) { target in BookingTimeEditor(calendar: target.calendar, original: target.slot, occurrence: target.occurrence, reservation: target.reservation, initialInterval: target.initialInterval) }
        .appSheet(isPresented: $lookup) { BookingLookupSheet() }
        .alert("Bookings", isPresented: Binding(get: { failure != nil }, set: { if !$0 { failure = nil } })) {
            Button("OK") { failure = nil }
        } message: { Text(verbatim: failure ?? "") }
    }

    private var bookingList: some View {
        CalendarSharingForm {
            CalendarSharingSection(rows: true) {
            Button { add() } label: {
                Label(mode == .availability ? LocalizedStringKey("Create booking calendar") : "Open booking calendar", systemImage: mode == .availability ? "calendar.badge.plus" : "magnifyingglass")
            }
            .calendarSharingRowAction()
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
                        HStack(spacing: 0) {
                            Button { timelineID = calendar.id } label: {
                                VStack(alignment: .leading) {
                                    Text(verbatim: calendar.title).font(.headline)
                                    Text(verbatim: bookingPurpose(calendar.appointmentType, calendar.customType)).font(.subheadline).foregroundStyle(.secondary)
                                }
                                .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
                                .contentShape(Rectangle())
                            }
                            .buttonStyle(.plain)
                            .accessibilityHint(Text("Multi-day calendar view"))
                            HStack(spacing: 0) {
                                Button { editing = calendar } label: {
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
                            .buttonStyle(.plain)
                            .fixedSize()
                        }
                        Button("Add time slot") { slotTarget = .init(calendar: calendar) }.calendarSharingRowAction()
                        ForEach(calendar.slots) { slot in
                            Button { slotTarget = .init(calendar: calendar, slot: slot) } label: {
                              VStack(alignment: .leading) {
                                if let title = slot.title, !title.isEmpty { Text(verbatim: title).font(.headline) }
                                Text(verbatim: slot.label)
                                if let location = slot.location { Text(verbatim: location).font(.subheadline).foregroundStyle(.secondary) }
                                if let rule = slot.rule { Label(LocalizedStringKey(BookingRepeat(rule).rawValue), systemImage: "repeat").font(.caption).foregroundStyle(.secondary) }
                              }.bookingStatusBar(calendar.status(for: slot)).frame(maxWidth: .infinity, alignment: .leading).contentShape(Rectangle())
                            }.buttonStyle(.plain)
                        }
                        ForEach(calendar.requests) { request in
                            VStack(alignment: .leading, spacing: 5) {
                                bookingRow(request.guestName, request)
                                if request.status == "pending" && request.proposal == nil {
                                    HStack {
                                        Button("Accept") { decide(calendar, request, "accepted") }
                                        Button("Decline") { decide(calendar, request, "declined") }
                                    }.buttonStyle(.bordered).disabled(deciding)
                                }
                            }
                        }
                    }
                }
            } else {
                if store.data.appointments.isEmpty { Text("No bookings yet.").foregroundStyle(.secondary) }
                ForEach(store.data.appointments) { r in
                    CalendarSharingSection(rows: true) {
                      VStack(alignment: .leading) {
                        bookingRow(r.calendarTitle, r)
                        if let proposal = r.proposal, let id = r.calendarId {
                            HStack {
                                Button("Accept") { respond(id, r.id, proposal.id, "accepted") }
                                Button("Decline") { respond(id, r.id, proposal.id, "declined") }
                            }.buttonStyle(.bordered).disabled(deciding)
                        }
                        Text(verbatim: bookingPurpose(r.appointmentType, r.customType) + " · " + r.hostName).font(.subheadline).foregroundStyle(.secondary)
                      }
                    }
                }
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    private func add() {
        guard CalendarFeedSession.existing != nil else {
            failure = NSLocalizedString("Sign in to Cloud Calendars to use bookings.", comment: "")
            return
        }
        if mode == .availability { editing = HostedBookingCalendar() } else { lookup = true }
    }
    private func bookingRow(_ name: String, _ r: BookingAppointment) -> some View {
        HStack {
            VStack(alignment: .leading) {
                Text(verbatim: name).font(.headline)
                if let title = r.title, !title.isEmpty { Text(verbatim: title).font(.subheadline) }
                Text(verbatim: r.interval.label).font(.subheadline)
                if let location = r.location, !location.isEmpty { Text(verbatim: location).font(.subheadline).foregroundStyle(.secondary) }
                if let proposal = r.proposal {
                    Text("Proposed change").font(.headline)
                    Text(verbatim: proposal.label)
                    if let title = proposal.title { Text(verbatim: title) }
                    if let location = proposal.location { Text(verbatim: location) }
                }
            }
            .bookingStatusBar(r.eventStatus)
            Spacer()
            Text(LocalizedStringKey(r.status.capitalized)).font(.caption.bold()).foregroundStyle(.secondary)
        }
    }
    private func respond(_ calendarID: String, _ requestID: String, _ proposalID: String, _ status: String) {
        deciding = true
        Task {
            defer { deciding = false }
            do {
                try await store.mutate("/" + calendarID + "/requests/" + requestID + "/change-response",
                    body: ["status": status, "proposalId": proposalID])
            } catch { failure = error.localizedDescription; await store.refresh() }
        }
    }
    private func decide(_ calendar: HostedBookingCalendar, _ r: BookingAppointment, _ status: String) {
        deciding = true
        Task {
            defer { deciding = false }
            do { try await store.mutate("/" + calendar.id + "/requests/" + r.id + "/decision", body: ["status": status]) }
            catch { failure = error.localizedDescription }
        }
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
    var title, location: String
    var structuredLocation: SharedEventLocation?
    let zone: TimeZone
    var choice: BookingRepeat
    var frequency: EKRecurrenceFrequency
    var interval: Int
    var pattern: CalendarRecurrencePattern
    var until: Date?
    var count: Int?

    var calendar: Calendar {
        var value = Calendar(identifier: .gregorian)
        value.timeZone = zone
        return value
    }
    init(_ slot: BookingInterval) {
        id = slot.id
        title = slot.title ?? ""
        location = slot.location ?? ""
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
    }
    init(start: Date) {
        self.init(.init(id: UUID().uuidString.lowercased(), start: DeviceCalendarEvent.iso(start),
                        end: DeviceCalendarEvent.iso(start.addingTimeInterval(3600))))
    }
    mutating func setStart(_ value: Date) {
        end = value.addingTimeInterval(end.timeIntervalSince(start))
        start = value
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
        result.merge(bookingVenue(location, structuredLocation)) { _, new in new }
        if choice == .never { result["rule"] = NSNull(); return result }
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

private struct BookingCalendarEditor: View {
    let calendar: HostedBookingCalendar
    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var store = BookingStore.shared
    @State private var title: String
    @State private var type: String
    @State private var customType: String
    @State private var listed: Bool
    @State private var created: HostedBookingCalendar?
    @State private var search = ""
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
        if let created {
            BookingTimeEditor(calendar: created, original: nil)
        } else {
            calendarSheet
        }
    }
    private var calendarSheet: some View {
        NavigationStack {
            BookingSheet(title: "Booking calendar", leading: "Close", back: { dismiss() }, save: { persist(false) },
                        canSave: !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !type.isEmpty) {
                editor
            }.page
            #if os(macOS)
            .toolbar(.hidden, for: .windowToolbar)
            #endif
            .navigationDestination(isPresented: $choosingType) {
                #if os(macOS)
                VStack(spacing: 0) {
                    MacCalendarSheetHeader(title: Text("Appointment type")) {
                        MacCalendarToolbarIconButton(icon: "chevron.backward", title: "Back") { choosingType = false }
                    } trailing: { EmptyView() }
                    typePicker
                }
                .background(CalendarPalette.groupedBackground)
                .navigationBarBackButtonHidden()
                #else
                typePicker
                    .navigationTitle("Appointment type")
                    .navigationBarTitleDisplayMode(.inline)
                #endif
            }
        }
        .calendarSharingSheetSize()
        .disabled(busy).interactiveDismissDisabled(busy)
        .confirmationDialog("Delete booking calendar?", isPresented: $confirming, titleVisibility: .visible) {
            Button("Delete", role: .destructive) { persist(true) }
            Button("Cancel", role: .cancel) {}
        }
    }
    private var typePicker: some View {
        CalendarSharingForm {
            CalendarSharingSection(rows: true) {
                HStack { Image(systemName: "magnifyingglass").foregroundStyle(.secondary)
                    TextField("Search appointment types", text: $search).textFieldStyle(.plain)
                }
            }
            let groups = BookingTypeGroup.matching(search)
            if groups.isEmpty { CalendarSharingSection { Text("No matching types").foregroundStyle(.secondary) } }
            ForEach(groups, id: \.title) { group in
                CalendarSharingSection(LocalizedStringKey(group.title), rows: true) {
                    ForEach(group.types, id: \.self) { item in
                        Button {
                            type = item
                            choosingType = false
                        } label: {
                            HStack {
                                Text(verbatim: bookingPurpose(item, nil))
                                Spacer()
                                if type == item { Image(systemName: "checkmark").foregroundStyle(Color.appBlue) }
                            }.contentShape(Rectangle())
                        }.buttonStyle(.plain)
                    }
                }
            }
        }
    }

    private var editor: some View {
        CalendarSharingForm {
            CalendarSharingSection(rows: true) {
                TextField("Name", text: $title).textFieldStyle(.plain)
                Button { search = ""; choosingType = true } label: {
                    HStack {
                        Text("Appointment type")
                        Spacer()
                        Text(verbatim: type.isEmpty ? NSLocalizedString("Choose type", comment: "") : bookingPurpose(type, nil))
                            .foregroundStyle(.secondary)
                        Image(systemName: "chevron.right").font(.caption).foregroundStyle(.secondary)
                    }.contentShape(Rectangle())
                }.buttonStyle(.plain)
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
                    let receipt = try await store.mutate("/" + calendar.id, body: body)
                    if calendar.revision == 0 {
                        var saved = calendar
                        saved.title = title
                        saved.appointmentType = type
                        saved.listed = listed
                        saved.customType = customType
                        saved.revision = receipt.revision ?? 1
                        created = saved
                        return
                    }
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
         reservation: BookingAppointment? = nil, initialInterval: DateInterval? = nil) {
        self.calendar = calendar
        self.original = original
        let booked = reservation ?? original.flatMap(calendar.reservation(for:))
        self.occurrence = occurrence || booked != nil
        self.reservation = booked
        let tomorrow = Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date()
        let start = Calendar.current.date(bySettingHour: 9, minute: 0, second: 0, of: tomorrow) ?? tomorrow
        let lastEnd = calendar.slots.last.map { BookingInterval.date($0.end) }
        var draft = original.map(BookingTimeDraft.init) ?? .init(start: initialInterval?.start ?? max(start,lastEnd ?? start))
        if let initialInterval { draft.end = initialInterval.end }
        _slot = State(initialValue: draft)
    }

    private var locked: Bool {
        if occurrence { return reservation?.proposal != nil || reservation?.status == "past" }
        return calendar.requests.contains { $0.active && ($0.slotId == slot.id || $0.slotId.hasPrefix(slot.id + "@")) }
    }

    var body: some View {
        BookingSheet(title: customRepeat ? "Custom" : (reservation != nil ? "Booking" : original == nil ? "Add time slot" : "Available time"),
                     leading: customRepeat ? "Back" : "Close", back: {
            if customRepeat { customRepeat = false } else { dismiss() }
        }, save: (customRepeat || locked) ? nil : { persist(remove: false) }, canSave: slot.end > slot.start) {
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
            CalendarEventTitleLocationSection(title: $slot.title, location: slot.location,
                editLocation: { choosingLocation = true }, clearLocation: { slot.location = ""; slot.structuredLocation = nil })
            BookingEventSection {
                    CalendarDateTimePickerRow(title: "Starts", id: slot.id + "-start",
                        selection: Binding(get: { slot.start }, set: { slot.setStart($0) }), expanded: $expanded)
                    CalendarDateTimePickerRow(title: "Ends", id: slot.id + "-end",
                        selection: $slot.end, range: slot.start...Date.distantFuture, expanded: $expanded)
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
                if slot.choice != .never {
                    CalendarEventEditorMenuRow(title: "End Repeat", value: slot.count.map(String.init)
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
                videoCallURL: .constant(""), allowsVideoLink: false) { choosingLocation = false }
            #else
            EventLocationEditorSheet(location: $slot.location, structuredLocation: $slot.structuredLocation,
                videoCallURL: .constant(""), allowsVideoLink: false, searchModel: locationSearch)
                .presentationDetents([.large]).presentationDragIndicator(.hidden)
            #endif
        }
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
    @Environment(\.dismiss) private var dismiss
    @State private var offer: BookingOffer?
    @State private var busy = false
    @State private var error: String?
    @State private var search = ""
    @State private var category = ""
    @State private var directory: [BookingListing] = []
    @State private var loading = true
    @State private var directoryError: String?
    @State private var attempt = 0

    private var matches: [BookingListing] {
        let query = search.trimmingCharacters(in: .whitespacesAndNewlines)
        let types = BookingTypeGroup.catalog.first { $0.title == category }?.types
        let matchingTypes = Set(BookingTypeGroup.matching(query).flatMap(\.types))
        return directory.filter { item in
            (types?.contains(item.appointmentType) ?? true) &&
                (query.isEmpty || matchingTypes.contains(item.appointmentType) ||
                 [item.title, item.hostName, item.appointmentType, item.customType ?? ""].contains { $0.localizedStandardContains(query) })
        }.sorted { $0.title.localizedStandardCompare($1.title) == .orderedAscending }
    }

    var body: some View {
        BookingSheet(title: "Open booking calendar", leading: offer == nil ? "Close" : "Back", back: {
            if offer == nil { dismiss() } else { offer = nil; error = nil }
        }) {
            CalendarSharingForm {
                if let offer {
                    CalendarSharingSection(rows: true) {
                        Text(verbatim: offer.title).font(.headline)
                        Text(verbatim: bookingPurpose(offer.appointmentType, offer.customType))
                        Text(verbatim: offer.hostName)
                        if offer.isOwner { Text("Your booking calendar").foregroundStyle(.secondary) }
                    }
                    CalendarSharingSection("Available times", rows: true) {
                        if offer.slots.isEmpty { Text("No available times.") }
                        ForEach(offer.slots) { slot in
                            HStack {
                                VStack(alignment: .leading) {
                                    if let title = slot.title { Text(verbatim: title).font(.headline) }
                                    Text(verbatim: slot.label)
                                    if let location = slot.location { Text(verbatim: location).font(.subheadline).foregroundStyle(.secondary) }
                                }
                                .bookingStatusBar(.available)
                                Spacer()
                                if !offer.isOwner { Button("Book") { book(offer, slot) } }
                            }
                        }
                        if let next = offer.nextFrom { Button("More available times") { load(id: offer.id, from: next) }.calendarSharingRowAction() }
                    }
                } else {
                    CalendarSharingSection(rows: true) {
                        HStack {
                            Image(systemName: "magnifyingglass").foregroundStyle(.secondary)
                            TextField("Search by name, category, or link", text: $search)
                                .textFieldStyle(.plain)
                                .onChange(of: search) { _, _ in openSearchLink() }
                                .onSubmit { openSearchLink(submitted: true) }
                        }
                        Picker("Category", selection: $category) {
                            Text("All categories").tag("")
                            ForEach(BookingTypeGroup.catalog, id: \.title) { group in
                                Text(LocalizedStringKey(group.title)).tag(group.title)
                            }
                        }.pickerStyle(.menu)
                    }
                    CalendarSharingSection("Booking calendars", rows: true) {
                        let results = matches
                        ForEach(results) { item in
                            Button { load(id: item.id) } label: {
                                HStack {
                                    VStack(alignment: .leading) {
                                        Text(verbatim: item.title).font(.headline)
                                        Text(verbatim: bookingPurpose(item.appointmentType, item.customType) + " · " + item.hostName)
                                            .font(.subheadline).foregroundStyle(.secondary)
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right").font(.caption).foregroundStyle(.secondary)
                                }.contentShape(Rectangle())
                            }.buttonStyle(.plain)
                        }
                        if loading { ProgressView() }
                        else if let directoryError {
                            Text(verbatim: directoryError).foregroundStyle(.red)
                            Button("Try Again") { attempt += 1 }
                        } else if results.isEmpty { Text("No matching calendars.").foregroundStyle(.secondary) }
                    }
                }
                if let error { Text(verbatim: error).foregroundStyle(.red) }
            }
        }
        .disabled(busy).interactiveDismissDisabled(busy)
        .task(id: attempt) { await loadDirectory() }
    }
    private func loadDirectory() async {
        directory = []; directoryError = nil; loading = true
        defer { loading = false }
        do {
            let session = try await CalendarFeedSession.current()
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
        guard !busy else { return }
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
        load(id: id, fromSearchLink: true)
    }
    private func load(id: String, from: String? = nil, fromSearchLink: Bool = false) {
        var route = URLComponents()
        route.path = "/" + id
        if let from { route.queryItems = [.init(name: "from", value: from)] }
        guard let path = route.string else { return }
        busy = true
        Task {
            defer { busy = false }
            do {
                let session = try await CalendarFeedSession.current()
                var value: BookingOffer = try await CloudCalendarsAPI.bookingRequest(path, session: session)
                guard CalendarFeedSession.isCurrent(session) else { return }
                if from != nil { value.slots = (offer?.slots ?? []) + value.slots }
                if fromSearchLink { search = "" }
                offer = value; error = nil
            } catch { self.error = error.localizedDescription }
        }
    }
    private func book(_ offer: BookingOffer, _ slot: BookingInterval) {
        guard !offer.isOwner, !busy else { return }
        busy = true
        Task {
            defer { busy = false }
            do {
                try await BookingStore.shared.mutate("/"+offer.id+"/requests/"+UUID().uuidString.lowercased(), body: ["slotId":slot.id])
                dismiss()
            } catch { self.error = error.localizedDescription }
        }
    }
}
