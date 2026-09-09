import EventKit
@preconcurrency import MapKit
import SwiftUI
import UniformTypeIdentifiers

private func localizedEventEditorString(_ key: String) -> String {
    // `String(localized:)` resolves against the process language and can
    // bypass the in-app Bundle override. Route dynamic editor text through
    // Bundle.main so it changes in the same transaction as the SwiftUI UI.
    Bundle.main.localizedString(forKey: key, value: key, table: nil)
}

/// One editor target for both EventKit and Cloud Calendars-owned events.
struct AppLocalEventEditorTarget: Identifiable {
    let id = UUID()
    let eventID: String?
    let eventKitEvent: EKEvent?
    let initialDate: Date
    let initialInterval: DateInterval?
    let initialCalendarID: String?
    let initialEventKitCalendarID: String?
    let initialIsAllDay: Bool
    let startsInEditingMode: Bool

    init(eventID: String, startsInEditingMode: Bool = false) {
        self.eventID = eventID
        eventKitEvent = nil
        initialDate = Date()
        initialInterval = nil
        initialCalendarID = nil
        initialEventKitCalendarID = nil
        initialIsAllDay = false
        self.startsInEditingMode = startsInEditingMode
    }

    init(
        date: Date,
        calendarID: String?,
        eventKitCalendarID: String? = nil,
        isAllDay: Bool = false,
        initialInterval: DateInterval? = nil
    ) {
        eventID = nil
        eventKitEvent = nil
        initialDate = date
        self.initialInterval = initialInterval
        initialCalendarID = calendarID
        initialEventKitCalendarID = eventKitCalendarID
        initialIsAllDay = isAllDay
        startsInEditingMode = true
    }

    init(eventKitEvent: EKEvent, startsInEditingMode: Bool) {
        eventID = nil
        self.eventKitEvent = eventKitEvent
        initialDate = eventKitEvent.startDate ?? Date()
        initialInterval = nil
        initialCalendarID = nil
        initialEventKitCalendarID = eventKitEvent.calendar?.calendarIdentifier
        initialIsAllDay = eventKitEvent.isAllDay
        self.startsInEditingMode = startsInEditingMode
    }
}

@MainActor
private final class EventLocationSearchModel: NSObject, ObservableObject, MKLocalSearchCompleterDelegate {
    @Published var suggestions: [MKLocalSearchCompletion] = []
    private let completer = MKLocalSearchCompleter()

    override init() {
        super.init()
        completer.delegate = self
        completer.resultTypes = [.address, .pointOfInterest]
    }

    func update(query: String) {
        let value = query.trimmingCharacters(in: .whitespacesAndNewlines)
        if value.isEmpty {
            suggestions = []
        } else {
            completer.queryFragment = value
        }
    }

    func select(_ result: MKLocalSearchCompletion) async -> SharedEventLocation? {
        let request = MKLocalSearch.Request(completion: result)
        guard let item = try? await MKLocalSearch(request: request).start().mapItems.first else {
            return SharedEventLocation(
                title: result.subtitle.isEmpty ? result.title : "\(result.title), \(result.subtitle)",
                latitude: nil,
                longitude: nil,
                radius: 0
            )
        }
        let coordinate = item.placemark.coordinate
        return SharedEventLocation(
            title: item.name ?? result.title,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
            radius: 0
        )
    }

    nonisolated func completerDidUpdateResults(_ completer: MKLocalSearchCompleter) {
        let values = Array(completer.results.prefix(6))
        Task { @MainActor in suggestions = values }
    }

    nonisolated func completer(_ completer: MKLocalSearchCompleter, didFailWithError error: Error) {
        Task { @MainActor in suggestions = [] }
    }
}

@MainActor
struct AppLocalEventEditorView: View {
    private enum CalendarKind: Equatable { case appLocal, eventKit }

    private struct CalendarChoice: Identifiable {
        let id: String
        let title: String
        let subtitle: String?
        let color: UIColor
        let kind: CalendarKind
        let canEdit: Bool
    }

    private struct EditorFingerprint: Equatable {
        let title: String
        let location: String
        let structuredLocation: SharedEventLocation?
        let startDate: Date
        let endDate: Date
        let isAllDay: Bool
        let selectedCalendarID: String
        let alertOffset: String
        let secondAlertOffset: String
        let repeatOption: String
        let repeatInterval: Int
        let recurrenceEndDate: Date?
        let travelTime: Int
        let urlString: String
        let videoCallURL: String
        let notes: String
        let attachments: [AppLocalEventAttachment]
    }

    private enum AlertOffset: String, CaseIterable, Identifiable {
        case none, atTime, fiveMinutes, tenMinutes, fifteenMinutes, thirtyMinutes
        case oneHour, twoHours, oneDay, twoDays, oneWeek
        var id: String { rawValue }
        var seconds: TimeInterval? {
            switch self {
            case .none: nil
            case .atTime: 0
            case .fiveMinutes: -300
            case .tenMinutes: -600
            case .fifteenMinutes: -900
            case .thirtyMinutes: -1_800
            case .oneHour: -3_600
            case .twoHours: -7_200
            case .oneDay: -86_400
            case .twoDays: -172_800
            case .oneWeek: -604_800
            }
        }
        var title: LocalizedStringKey {
            switch self {
            case .none: "None"
            case .atTime: "At time of event"
            case .fiveMinutes: "5 minutes before"
            case .tenMinutes: "10 minutes before"
            case .fifteenMinutes: "15 minutes before"
            case .thirtyMinutes: "30 minutes before"
            case .oneHour: "1 hour before"
            case .twoHours: "2 hours before"
            case .oneDay: "1 day before"
            case .twoDays: "2 days before"
            case .oneWeek: "1 week before"
            }
        }
    }

    private enum RepeatOption: String, CaseIterable, Identifiable {
        case never, daily, weekly, monthly, yearly
        var id: String { rawValue }
        var title: LocalizedStringKey {
            switch self {
            case .never: "Never"
            case .daily: "Every Day"
            case .weekly: "Every Week"
            case .monthly: "Every Month"
            case .yearly: "Every Year"
            }
        }
        var frequency: EKRecurrenceFrequency? {
            switch self {
            case .never: nil
            case .daily: .daily
            case .weekly: .weekly
            case .monthly: .monthly
            case .yearly: .yearly
            }
        }

        init(rules: [EKRecurrenceRule]?) {
            guard let frequency = rules?.first?.frequency else { self = .never; return }
            self = Self(frequency: frequency)
        }

        init(sharedRules: [SharedEventRecurrenceRule]?) {
            guard let raw = sharedRules?.first?.frequency,
                  let frequency = EKRecurrenceFrequency(rawValue: raw)
            else { self = .never; return }
            self = Self(frequency: frequency)
        }

        private init(frequency: EKRecurrenceFrequency) {
            switch frequency {
            case .daily: self = .daily
            case .weekly: self = .weekly
            case .monthly: self = .monthly
            case .yearly: self = .yearly
            @unknown default: self = .never
            }
        }
    }

    private enum TravelTimeOption: Int, CaseIterable, Identifiable {
        case none = 0, five = 300, fifteen = 900, thirty = 1800, oneHour = 3600, twoHours = 7200
        var id: Int { rawValue }
        @MainActor var title: String {
            switch self {
            case .none: return localizedEventEditorString("None")
            default:
                let formatter = DateComponentsFormatter()
                formatter.allowedUnits = rawValue < 3_600 ? [.minute] : [.hour]
                formatter.unitsStyle = .full
                formatter.maximumUnitCount = 1
                var calendar = Calendar(identifier: .gregorian)
                calendar.locale = AppPreferences.shared.interfaceLocale
                formatter.calendar = calendar
                return formatter.string(from: TimeInterval(rawValue)) ?? "\(rawValue / 60) min"
            }
        }
        init(seconds: TimeInterval?) {
            self = Self.allCases.min(by: {
                abs(Double($0.rawValue) - (seconds ?? 0)) < abs(Double($1.rawValue) - (seconds ?? 0))
            }) ?? .none
        }
    }

    let target: AppLocalEventEditorTarget
    let onDismissed: (() -> Void)?

    @Environment(\.dismiss) private var dismiss
    @ObservedObject private var localStore = AppLocalCalendarStore.shared
    @ObservedObject private var appPreferences = AppPreferences.shared
    @StateObject private var locationSearch = EventLocationSearchModel()

    @State private var title: String
    @State private var location: String
    @State private var structuredLocation: SharedEventLocation?
    @State private var startDate: Date
    @State private var endDate: Date
    @State private var isAllDay: Bool
    @State private var selectedCalendarID: String
    @State private var alertOffset: AlertOffset
    @State private var secondAlertOffset: AlertOffset
    @State private var repeatOption: RepeatOption
    @State private var repeatInterval: Int
    @State private var recurrenceEndDate: Date?
    @State private var travelTime: TravelTimeOption
    @State private var urlString: String
    @State private var videoCallURL: String
    @State private var notes: String
    @State private var attachments: [AppLocalEventAttachment]
    @State private var isEditing: Bool
    @State private var showDeleteConfirmation = false
    @State private var showFileImporter = false
    @State private var showLocationEditor = false
    @State private var showCustomRecurrenceEditor = false
    @State private var errorMessage: String?
    @State private var initialEditorFingerprint: EditorFingerprint?

    private let eventStore = CalendarViewModel.shared.eventStore

    init(target: AppLocalEventEditorTarget, onDismissed: (() -> Void)? = nil) {
        self.target = target
        self.onDismissed = onDismissed

        let local = target.eventID.flatMap { id in
            MainActor.assumeIsolated { AppLocalCalendarStore.shared.event(id: id) }
        }
        let system = target.eventKitEvent
        let defaultCalendarID = MainActor.assumeIsolated {
            CalendarViewModel.shared.newEventCalendar()?.id
        }
        let initialAllDay = local?.isAllDay ?? system?.isAllDay ?? target.initialIsAllDay
        let initialSchedule = EventEditorInitialSchedule.resolve(
            day: target.initialDate, exactInterval: target.initialInterval, isAllDay: initialAllDay)
        let initialStart = local?.startDate ?? system?.startDate
            ?? initialSchedule.start
        let storedEnd = local?.endDate
            ?? system?.endDate
            ?? initialSchedule.end
        let initialEnd = initialAllDay && storedEnd > initialStart
            ? storedEnd.addingTimeInterval(-1)
            : storedEnd
        let initialCalendar = local?.calendarID
            ?? system?.calendar?.calendarIdentifier
            ?? target.initialCalendarID
            ?? target.initialEventKitCalendarID
            ?? defaultCalendarID
            ?? ""
        let systemAlarms = (system?.alarms ?? []).sorted { $0.relativeOffset > $1.relativeOffset }
        let localAlarms = local?.alarms.map(\.relativeOffset) ?? []
        let systemSupplement = MainActor.assumeIsolated {
            system.flatMap(EventKitEventSupplementStore.supplement(for:))
        }

        _title = State(initialValue: local?.title ?? system?.title ?? localizedEventEditorString("New Event"))
        _location = State(initialValue: local?.location ?? system?.location ?? "")
        _structuredLocation = State(initialValue: local?.structuredLocation ?? system?.structuredLocation.map(SharedEventLocation.init(location:)))
        _startDate = State(initialValue: initialStart)
        _endDate = State(initialValue: initialEnd)
        _isAllDay = State(initialValue: initialAllDay)
        _selectedCalendarID = State(initialValue: initialCalendar)
        _alertOffset = State(initialValue: Self.alert(for: localAlarms.first ?? systemAlarms.first?.relativeOffset))
        _secondAlertOffset = State(initialValue: Self.alert(for: localAlarms.dropFirst().first ?? systemAlarms.dropFirst().first?.relativeOffset))
        _repeatOption = State(initialValue: local.map { RepeatOption(sharedRules: $0.recurrenceRules) } ?? RepeatOption(rules: system?.recurrenceRules))
        _repeatInterval = State(initialValue: max(
            1,
            local?.recurrenceRules?.first?.interval
                ?? system?.recurrenceRules?.first?.interval
                ?? 1
        ))
        _recurrenceEndDate = State(initialValue:
            local?.recurrenceRules?.first?.endDate.flatMap(ISO8601DateFormatter().date(from:))
                ?? system?.recurrenceRules?.first?.recurrenceEnd?.endDate
        )
        // EventKit's public EKEvent API does not expose Calendar.app's travel-time value.
        // App-owned events retain it; system events still use the same editor layout.
        _travelTime = State(initialValue: TravelTimeOption(
            seconds: local?.travelTime ?? systemSupplement?.travelTime
        ))
        _urlString = State(initialValue: local?.urlString ?? system?.url?.absoluteString ?? "")
        _videoCallURL = State(initialValue: local?.videoCallURL ?? systemSupplement?.videoCallURL ?? "")
        _notes = State(initialValue: local?.notes ?? system?.notes ?? "")
        _attachments = State(initialValue: local?.attachments ?? systemSupplement?.attachments ?? [])
        _isEditing = State(initialValue: target.startsInEditingMode || (local == nil && system?.eventIdentifier == nil))
#if DEBUG
        _showLocationEditor = State(
            initialValue: UserDefaults.standard.bool(forKey: "EventEditorReferencePreview")
                && UserDefaults.standard.string(forKey: "EventEditorReferenceMode") == "location"
        )
#endif
    }

    private var existingLocalEvent: AppLocalEventRecord? {
        target.eventID.flatMap(localStore.event(id:))
    }

    private var isNew: Bool {
        target.eventID == nil && target.eventKitEvent?.eventIdentifier == nil
    }

    private var choices: [CalendarChoice] {
        let localChoices = localStore.calendars.filter { !$0.isRevoked }.map {
            CalendarChoice(
                id: $0.id,
                title: $0.title,
                subtitle: $0.origin == .received ? $0.remoteOwnerEmail : nil,
                color: AppLocalCalendarStore.color($0.displayColorHex),
                kind: .appLocal,
                canEdit: $0.canEditEvents
            )
        }
        let eventKitChoices = eventStore.calendars(for: .event).map {
            CalendarChoice(
                id: $0.calendarIdentifier,
                title: $0.title,
                subtitle: $0.source.title,
                color: UIColor(cgColor: $0.cgColor),
                kind: .eventKit,
                canEdit: $0.allowsContentModifications
                    && (!SharedICloudCalendarLocalStore.isShared(localCalendarIdentifier: $0.calendarIdentifier)
                        || SharedICloudCalendarLocalStore.canEditEvents(localCalendarIdentifier: $0.calendarIdentifier))
            )
        }
        // The custom editor represents both storage backends, so every event
        // must be able to see every writable destination. Restricting an
        // existing event to its current backend made EventKit and app-local
        // events show two different calendar pickers.
        //
        // Match EventKit's picker by omitting destinations that cannot accept
        // events (Birthdays, Holidays, Reader and Pending shares). Keep the
        // current destination so a read-only event can still identify it.
        return (localChoices + eventKitChoices)
            .filter { $0.canEdit || (!isNew && $0.id == selectedCalendarID) }
            .sorted(by: Self.sortCalendars)
    }

    private var selectedChoice: CalendarChoice? { choices.first { $0.id == selectedCalendarID } }

    private var existingCalendarKind: CalendarKind? {
        if target.eventID != nil { return .appLocal }
        if target.eventKitEvent?.eventIdentifier != nil { return .eventKit }
        return nil
    }

    private var payloadIsReadOnly: Bool {
        if let event = target.eventKitEvent, event.eventIdentifier != nil {
            return event.calendar?.allowsContentModifications != true
                || SharedInviteTracker.isReadOnly(event)
        }
        if let event = existingLocalEvent,
           let calendar = localStore.calendar(id: event.calendarID) {
            return !calendar.canEditEvents
        }
        return selectedChoice?.canEdit != true
    }

    private var canShare: Bool {
        if let event = target.eventKitEvent, event.eventIdentifier != nil {
            return SharedInviteTracker.canShare(event)
        }
        guard let event = existingLocalEvent,
              let calendar = localStore.calendar(id: event.calendarID)
        else { return false }
        return calendar.canManageSharing && !event.isCancelled
    }

    private var canDelete: Bool {
        if let event = target.eventKitEvent, event.eventIdentifier != nil {
            return event.calendar?.allowsContentModifications == true
                && !SharedInviteTracker.isReadOnly(event)
                && !SharedInviteTracker.isInReadOnlySharedCalendar(event)
        }
        return existingLocalEvent != nil && !payloadIsReadOnly
    }

    private var currentEditorFingerprint: EditorFingerprint {
        EditorFingerprint(
            title: title,
            location: location,
            structuredLocation: structuredLocation,
            startDate: startDate,
            endDate: endDate,
            isAllDay: isAllDay,
            selectedCalendarID: selectedCalendarID,
            alertOffset: alertOffset.rawValue,
            secondAlertOffset: secondAlertOffset.rawValue,
            repeatOption: repeatOption.rawValue,
            repeatInterval: repeatInterval,
            recurrenceEndDate: recurrenceEndDate,
            travelTime: travelTime.rawValue,
            urlString: urlString,
            videoCallURL: videoCallURL,
            notes: notes,
            attachments: attachments
        )
    }

    private var hasUnsavedChanges: Bool {
        guard let initialEditorFingerprint else { return false }
        return currentEditorFingerprint != initialEditorFingerprint
    }

    var body: some View {
        NavigationStack {
            Group {
                if isEditing || isNew {
                    editorForm
                } else {
                    detailForm
                }
            }
            .navigationTitle(LocalizedStringKey(isNew ? "New Event" : (isEditing ? "Edit Event" : "Event Details")))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { toolbarContent }
            .fileImporter(
                isPresented: $showFileImporter,
                allowedContentTypes: [.data],
                allowsMultipleSelection: true,
                onCompletion: importFiles
            )
            .sheet(isPresented: $showLocationEditor) {
                EventLocationEditorSheet(
                    location: $location,
                    structuredLocation: $structuredLocation,
                    videoCallURL: $videoCallURL,
                    searchModel: locationSearch
                )
                .presentationDetents([.large])
                .presentationDragIndicator(.hidden)
            }
            .navigationDestination(isPresented: $showCustomRecurrenceEditor) {
                customRecurrenceEditor
            }
            .confirmationDialog("Delete Event?", isPresented: $showDeleteConfirmation, titleVisibility: .visible) {
                Button("Delete Event", role: .destructive) { deleteEvent() }
                Button("Cancel", role: .cancel) {}
            }
            .alert("Please try again.", isPresented: Binding(
                get: { errorMessage != nil },
                set: { if !$0 { errorMessage = nil } }
            )) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(errorMessage ?? localizedEventEditorString("Please try again."))
            }
            .onAppear {
                if (selectedCalendarID.isEmpty || (isNew && selectedChoice?.canEdit != true)),
                   let first = choices.first(where: \.canEdit) {
                    selectedCalendarID = first.id
                }
                if initialEditorFingerprint == nil {
                    initialEditorFingerprint = currentEditorFingerprint
                }
            }
        }
        .environment(\.locale, appPreferences.presentationLocale)
        .environment(\.layoutDirection, appPreferences.layoutDirection)
    }

    private var editorForm: some View {
        ScrollViewReader { proxy in
            Form {
            Section {
                TextField("Title", text: $title)

                HStack(spacing: 10) {
                    Button {
                        showLocationEditor = true
                    } label: {
                        Text(location.isEmpty ? localizedEventEditorString("Location or Video Call") : location)
                            .foregroundStyle(location.isEmpty ? AnyShapeStyle(.tertiary) : AnyShapeStyle(.primary))
                            .lineLimit(1)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    .buttonStyle(.plain)

                    if !location.isEmpty {
                        Button {
                            location = ""
                            structuredLocation = nil
                        } label: {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundStyle(.tertiary)
                        }
                        .buttonStyle(.plain)
                        .accessibilityLabel("Clear")
                    }
                }
            }

            Section {
                Toggle("All-day", isOn: $isAllDay)
                LabeledContent("Starts") {
                    HStack(spacing: 6) {
                        PreferenceCompactDatePicker(
                            selection: $startDate,
                            range: Date.distantPast...Date.distantFuture,
                            component: .date,
                            timeZone: eventTimeZone
                        )
                        if !isAllDay {
                            PreferenceCompactDatePicker(
                                selection: $startDate,
                                range: Date.distantPast...Date.distantFuture,
                                component: .time,
                                timeZone: eventTimeZone
                            )
                        }
                    }
                    .layoutPriority(1)
                }
                LabeledContent("Ends") {
                    HStack(spacing: 6) {
                        PreferenceCompactDatePicker(
                            selection: $endDate,
                            range: startDate...Date.distantFuture,
                            component: .date,
                            timeZone: eventTimeZone
                        )
                        if !isAllDay {
                            PreferenceCompactDatePicker(
                                selection: $endDate,
                                range: startDate...Date.distantFuture,
                                component: .time,
                                timeZone: eventTimeZone
                            )
                        }
                    }
                    .layoutPriority(1)
                }
                NavigationLink {
                    travelTimeEditor
                } label: {
                    LabeledContent("Travel Time") {
                        Text(travelTime.title)
                            .foregroundStyle(.secondary)
                    }
                }
            }

            Section {
                LabeledContent("Repeat") {
                    Menu {
                        ForEach(RepeatOption.allCases) { option in
                            Button {
                                repeatOption = option
                                repeatInterval = 1
                                if option == .never { recurrenceEndDate = nil }
                            } label: {
                                if option == repeatOption && repeatInterval == 1 {
                                    Label(option.title, systemImage: "checkmark")
                                } else {
                                    Text(option.title)
                                }
                            }
                        }
                        Button {
                            repeatOption = .weekly
                            repeatInterval = 2
                        } label: {
                            if repeatOption == .weekly && repeatInterval == 2 {
                                Label("Every 2 Weeks", systemImage: "checkmark")
                            } else {
                                Text("Every 2 Weeks")
                            }
                        }
                        Divider()
                        Button("Custom…") { showCustomRecurrenceEditor = true }
                    } label: {
                        menuValueLabel(repeatDisplayText)
                    }
                    .tint(.secondary)
                }

                if repeatOption != .never {
                    LabeledContent("End Repeat") {
                        Menu {
                            Button {
                                recurrenceEndDate = nil
                            } label: {
                                if recurrenceEndDate == nil {
                                    Label("Never", systemImage: "checkmark")
                                } else {
                                    Text("Never")
                                }
                            }
                            Button {
                                if recurrenceEndDate == nil {
                                    recurrenceEndDate = eventCalendar.date(
                                        byAdding: .month,
                                        value: 1,
                                        to: startDate
                                    ) ?? startDate
                                }
                            } label: {
                                if recurrenceEndDate != nil {
                                    Label("On Date", systemImage: "checkmark")
                                } else {
                                    Text("On Date")
                                }
                            }
                        } label: {
                            menuValueLabel(endRepeatDisplayText)
                        }
                        .tint(.secondary)
                    }

                    if recurrenceEndDate != nil {
                        DatePicker(
                            "Ends",
                            selection: Binding(
                                get: { recurrenceEndDate ?? startDate },
                                set: { recurrenceEndDate = $0 }
                            ),
                            in: startDate...,
                            displayedComponents: .date
                        )
                    }
                }
            }

            Section {
                LabeledContent("Calendar") {
                    Menu {
                        Picker("Calendar", selection: $selectedCalendarID) {
                            ForEach(choices.filter(\.canEdit)) { calendar in
                                calendarPickerItem(calendar, includesSubtitle: true)
                                    .tag(calendar.id)
                            }
                        }
                        .labelsHidden()
                    } label: {
                        HStack(spacing: 8) {
                            Circle()
                                .fill(eventColor)
                                .frame(width: 11, height: 11)
                            menuValueLabel(Text(selectedChoice?.title ?? ""))
                        }
                    }
                    .tint(.secondary)
                }
            }

            Section {
                alertMenu(label: "Alert", selection: $alertOffset)
                .onChange(of: alertOffset) { _, value in
                    if value == .none { secondAlertOffset = .none }
                }
                if alertOffset != .none {
                    alertMenu(label: "Second Alert", selection: $secondAlertOffset)
                }
            }

            Section {
                Button("Add attachment…") { showFileImporter = true }
                    .foregroundStyle(.primary)
                ForEach(attachments) { attachment in
                    HStack {
                        Image(systemName: "paperclip")
                        Text(attachment.fileName).lineLimit(1)
                        Spacer()
                        Button(role: .destructive) {
                            attachments.removeAll { $0.id == attachment.id }
                        } label: { Image(systemName: "xmark.circle.fill") }
                        .buttonStyle(.plain)
                    }
                }
            } footer: {
                if repeatOption != .never {
                    Text("Attachments will be applied to all occurrences")
                }
            }

            Section {
                TextField("URL", text: $urlString)
                    .keyboardType(.URL)
                    .textInputAutocapitalization(.never)
                TextField("Notes", text: $notes, axis: .vertical).lineLimit(3...8)
            }

                if !isNew && canDelete {
                    Section {
                        Button("Delete Event", role: .destructive) { showDeleteConfirmation = true }
                            .frame(maxWidth: .infinity)
                    }
                    .id("event-editor-bottom")
                }
            }
            .scrollDismissesKeyboard(.interactively)
            .contentMargins(.horizontal, 20, for: .scrollContent)
            .onAppear {
#if DEBUG
                guard UserDefaults.standard.bool(forKey: "EventEditorReferencePreview"),
                      UserDefaults.standard.string(forKey: "EventEditorReferenceMode") == "edit-bottom"
                else { return }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                    proxy.scrollTo("event-editor-bottom", anchor: .bottom)
                }
#endif
            }
        }
    }

    private var detailForm: some View {
        ScrollViewReader { proxy in
            Form {
            Section {
                VStack(alignment: .leading, spacing: 6) {
                    Text(title)
                        .font(.title2.weight(.bold))
                        .foregroundStyle(.primary)
                        .frame(maxWidth: .infinity, alignment: .leading)

                    if !location.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        Text(location)
                            .foregroundStyle(eventColor)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }

                    eventDetailDateSummary

                    if repeatOption != .never {
                        Text("Repeats \(repeatSummaryText)")
                            .foregroundStyle(.secondary)
                    }
                }
                .padding(.vertical, 2)
            }
            .listRowBackground(Color.clear)
            .listRowInsets(EdgeInsets(top: 6, leading: 16, bottom: -4, trailing: 16))

            Section {
                EventDetailTimelinePreview(
                    items: detailTimelineItems,
                    timeZone: eventTimeZone,
                    locale: appPreferences.presentationLocale,
                    timeFormat: appPreferences.timeFormat
                )
                .listRowInsets(EdgeInsets())
            }

            Section {
                if choices.contains(where: \.canEdit) {
                    LabeledContent("Calendar") {
                        Menu {
                            Picker(
                                "Calendar",
                                selection: Binding(
                                    get: { selectedCalendarID },
                                    set: { moveExistingEvent(to: $0) }
                                )
                            ) {
                                ForEach(choices) { calendar in
                                    calendarPickerItem(calendar, includesSubtitle: false)
                                        .tag(calendar.id)
                                        .disabled(!calendar.canEdit)
                                }
                            }
                            .labelsHidden()
                        } label: {
                            HStack(spacing: 8) {
                                Circle().fill(eventColor).frame(width: 11, height: 11)
                                menuValueLabel(Text(selectedChoice?.title ?? ""))
                            }
                        }
                        .tint(.secondary)
                    }
                } else {
                    LabeledContent("Calendar") {
                        HStack(spacing: 8) {
                            Circle()
                                .fill(eventColor)
                                .frame(width: 11, height: 11)
                            Text(selectedChoice?.title ?? "")
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                if travelTime != .none {
                    LabeledContent("Travel Time") {
                        Text(travelTime.title).foregroundStyle(.secondary)
                    }
                }

            }

            Section {
                if payloadIsReadOnly {
                    LabeledContent("Alert") {
                        Text(alertOffset.title).foregroundStyle(.secondary)
                    }
                    if secondAlertOffset != .none {
                        LabeledContent("Second Alert") {
                            Text(secondAlertOffset.title).foregroundStyle(.secondary)
                        }
                    }
                } else {
                    alertMenu(label: "Alert", selection: $alertOffset)
                        .onChange(of: alertOffset) { _, value in
                            if value == .none { secondAlertOffset = .none }
                            saveDetailChanges()
                        }
                    if alertOffset != .none {
                        alertMenu(label: "Second Alert", selection: $secondAlertOffset)
                            .onChange(of: secondAlertOffset) { _, _ in saveDetailChanges() }
                    }
                }
            }

            if !attachments.isEmpty {
                Section {
                    ForEach(attachments) { attachment in
                        Label(attachment.fileName, systemImage: "paperclip")
                    }
                }
            }

            if !urlString.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                || !videoCallURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                || !notes.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                Section {
                    if let videoURL = URL(string: videoCallURL.trimmingCharacters(in: .whitespacesAndNewlines)),
                       !videoCallURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Video Call")
                                .foregroundStyle(.primary)
                            Link(videoCallURL, destination: videoURL)
                                .lineLimit(2)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                    if let url = URL(string: urlString.trimmingCharacters(in: .whitespacesAndNewlines)),
                       !urlString.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("URL")
                                .foregroundStyle(.primary)
                            Link(urlString, destination: url)
                                .lineLimit(2)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                    if !notes.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Notes")
                                .foregroundStyle(.primary)
                            Text(notes)
                                .foregroundStyle(.secondary)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .textSelection(.enabled)
                        }
                    }
                }
            }

            if let coordinate = structuredLocationCoordinate {
                Section {
                    Map(
                        initialPosition: .region(MKCoordinateRegion(
                            center: coordinate,
                            span: MKCoordinateSpan(latitudeDelta: 0.0045, longitudeDelta: 0.0045)
                        )),
                        interactionModes: []
                    ) {
                        Marker(location.isEmpty ? structuredLocation?.title ?? "" : location, coordinate: coordinate)
                    }
                    .frame(height: 170)
                    .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
                }
                .listRowInsets(EdgeInsets())
            }

                if canDelete {
                    Section {
                        Button("Delete Event", role: .destructive) { showDeleteConfirmation = true }
                            .frame(maxWidth: .infinity)
                            .buttonStyle(.bordered)
                            .controlSize(.large)
                    }
                    .listRowBackground(Color.clear)
                    .id("event-detail-bottom")
                }
            }
            .listSectionSpacing(.custom(19))
            .contentMargins(.top, 12, for: .scrollContent)
            .contentMargins(.horizontal, 20, for: .scrollContent)
            .onAppear {
#if DEBUG
                guard UserDefaults.standard.bool(forKey: "EventEditorReferencePreview"),
                      UserDefaults.standard.string(forKey: "EventEditorReferenceMode") == "detail-bottom"
                else { return }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.25) {
                    proxy.scrollTo("event-detail-bottom", anchor: .bottom)
                }
#endif
            }
        }
    }

    private var eventDetailDateSummary: some View {
        let displayEndDate = endDate
        let dateFormatter = appShortDateFormatter(
            timeZone: eventTimeZone,
            includesYear: true,
            includesWeekday: true,
            usesFullWeekday: true
        )
        let isSameDay = eventCalendar.isDate(startDate, inSameDayAs: displayEndDate)

        return VStack(alignment: .leading, spacing: 4) {
            Text(dateFormatter.string(from: startDate))
                .foregroundStyle(.primary)
            if isAllDay {
                if !isSameDay {
                    Text(dateFormatter.string(from: displayEndDate))
                        .foregroundStyle(.primary)
                }
                Text("All-day")
                    .foregroundStyle(.primary)
            } else if isSameDay {
                Text("\(detailTimeText(startDate)) – \(detailTimeText(endDate))")
                    .foregroundStyle(.primary)
            } else {
                Text(detailTimeText(startDate))
                    .foregroundStyle(.primary)
                Text(dateFormatter.string(from: displayEndDate))
                    .foregroundStyle(.primary)
                    .padding(.top, 4)
                Text(detailTimeText(endDate))
                    .foregroundStyle(.primary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func detailTimeText(_ date: Date) -> String {
        let minute = eventCalendar.component(.minute, from: date)
        let localeUsesTwelveHourTime = DateFormatter.dateFormat(
            fromTemplate: "j",
            options: 0,
            locale: appPreferences.presentationLocale
        )?.contains("a") == true
        let usesTwelveHourTime = appPreferences.timeFormat == .twelveHour
            || (appPreferences.timeFormat == .system && localeUsesTwelveHourTime)

        guard minute == 0, usesTwelveHourTime else {
            return appTimeFormatter(timeZone: eventTimeZone).string(from: date)
        }
        let formatter = DateFormatter()
        formatter.locale = appPreferences.presentationLocale
        formatter.timeZone = eventTimeZone
        formatter.setLocalizedDateFormatFromTemplate("j")
        return formatter.string(from: date)
            .replacingOccurrences(of: "\u{202F}", with: " ")
            .replacingOccurrences(of: "\u{00A0}", with: " ")
    }

    private func menuValueLabel(_ text: Text) -> some View {
        HStack(spacing: 4) {
            text
                .foregroundStyle(.secondary)
                .lineLimit(1)
            Image(systemName: "chevron.up.chevron.down")
                .font(.caption2.weight(.semibold))
                .foregroundStyle(.secondary)
        }
    }

    private var repeatDisplayText: Text {
        if repeatOption == .weekly && repeatInterval == 2 {
            return Text("Every 2 Weeks")
        }
        if repeatInterval > 1 {
            return Text("\(repeatInterval)") + Text(" ") + Text(repeatOption.title)
        }
        return Text(repeatOption.title)
    }

    private var repeatSummaryText: String {
        let key: String
        switch repeatOption {
        case .never: key = "Never"
        case .daily: key = repeatInterval == 1 ? "Daily" : "Every Day"
        case .weekly: key = repeatInterval == 1 ? "Weekly" : "Every 2 Weeks"
        case .monthly: key = repeatInterval == 1 ? "Monthly" : "Every Month"
        case .yearly: key = repeatInterval == 1 ? "Yearly" : "Every Year"
        }
        return localizedEventEditorString(key).lowercased(with: appPreferences.interfaceLocale)
    }

    private var endRepeatDisplayText: Text {
        guard let recurrenceEndDate else { return Text("Never") }
        let formatter = appShortDateFormatter(timeZone: eventTimeZone, includesYear: true)
        return Text(formatter.string(from: recurrenceEndDate))
    }

    private var customRecurrenceEditor: some View {
        Form {
            Section {
                Picker("Repeat", selection: $repeatOption) {
                    ForEach(RepeatOption.allCases.filter { $0 != .never }) { option in
                        Text(option.title).tag(option)
                    }
                }

                Stepper(value: $repeatInterval, in: 1...99) {
                    LabeledContent("Repeat") {
                        Text("\(repeatInterval)")
                            .foregroundStyle(.secondary)
                    }
                }
            }
        }
        .navigationTitle("Custom…")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func alertMenu(
        label: LocalizedStringKey,
        selection: Binding<AlertOffset>
    ) -> some View {
        LabeledContent(label) {
            Menu {
                ForEach(AlertOffset.allCases) { option in
                    Button {
                        selection.wrappedValue = option
                    } label: {
                        if option == selection.wrappedValue {
                            Label(option.title, systemImage: "checkmark")
                        } else {
                            Text(option.title)
                        }
                    }
                }
            } label: {
                menuValueLabel(Text(selection.wrappedValue.title))
            }
            .tint(.secondary)
        }
    }

    private var travelTimeEditor: some View {
        Form {
            Section {
                Toggle("Travel Time", isOn: Binding(
                    get: { travelTime != .none },
                    set: { enabled in
                        travelTime = enabled ? (travelTime == .none ? .fifteen : travelTime) : .none
                    }
                ))

                if travelTime != .none {
                    Picker("Travel Time", selection: $travelTime) {
                        ForEach(TravelTimeOption.allCases.filter { $0 != .none }) { option in
                            Text(option.title).tag(option)
                        }
                    }
                    .pickerStyle(.wheel)
                    .labelsHidden()
                }
            } footer: {
                Text("Add travel time for this event to your calendar. Event alerts will take this time into account and your calendar will be blocked during this time.")
            }
        }
        .navigationTitle("Travel Time")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var structuredLocationCoordinate: CLLocationCoordinate2D? {
        guard let latitude = structuredLocation?.latitude,
              let longitude = structuredLocation?.longitude else { return nil }
        return CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }

    private var normalizedVideoCallURL: String? {
        let value = videoCallURL.trimmingCharacters(in: .whitespacesAndNewlines)
        return value.isEmpty ? nil : value
    }

    private var eventColor: Color {
        selectedChoice.map { Color(uiColor: $0.color) } ?? .accentColor
    }

    private var persistedStartDate: Date {
        isAllDay ? eventCalendar.startOfDay(for: startDate) : startDate
    }

    private var persistedEndDate: Date {
        guard isAllDay else { return max(endDate, startDate) }
        let inclusiveEnd = max(
            eventCalendar.startOfDay(for: endDate),
            eventCalendar.startOfDay(for: startDate)
        )
        return eventCalendar.date(byAdding: .day, value: 1, to: inclusiveEnd)
            ?? inclusiveEnd.addingTimeInterval(86_400)
    }

    private var eventCalendar: Calendar {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = eventTimeZone
        calendar.locale = appPreferences.presentationLocale
        return calendar
    }

    private var recurrenceRule: EKRecurrenceRule? {
        guard let frequency = repeatOption.frequency else { return nil }
        let end = recurrenceEndDate.map(EKRecurrenceEnd.init(end:))
        return EKRecurrenceRule(
            recurrenceWith: frequency,
            interval: max(1, repeatInterval),
            daysOfTheWeek: nil,
            daysOfTheMonth: nil,
            monthsOfTheYear: nil,
            weeksOfTheYear: nil,
            daysOfTheYear: nil,
            setPositions: nil,
            end: end
        )
    }

    private var eventTimeZone: TimeZone {
        if let identifier = existingLocalEvent?.timeZoneIdentifier,
           let timeZone = TimeZone(identifier: identifier) {
            return timeZone
        }
        return target.eventKitEvent?.timeZone ?? .autoupdatingCurrent
    }

    private var detailTimelineItems: [EventDetailTimelineItem] {
        let selectedItem = EventDetailTimelineItem(
            id: "selected-event",
            calendarTitle: selectedChoice?.title ?? "",
            title: title,
            location: location,
            startDate: startDate,
            endDate: max(endDate, startDate),
            isAllDay: isAllDay,
            isRecurring: repeatOption != .never,
            color: selectedChoice?.color ?? .systemBlue,
            isSelected: true
        )

        let dayStart = eventCalendar.startOfDay(for: startDate)
        let dayEnd = eventCalendar.date(byAdding: .day, value: 1, to: dayStart)
            ?? dayStart.addingTimeInterval(86_400)
        var selectedIDs = CalendarViewModel.shared.selectedCalendarIDs
#if DEBUG
        // Match a native reference capture without changing saved selections.
        if UserDefaults.standard.bool(forKey: "EventEditorReferencePreview"),
           let referenceIDs = UserDefaults.standard.string(forKey: "EventEditorReferenceCalendarIDs"),
           !referenceIDs.isEmpty {
            selectedIDs = Set(referenceIDs.split(separator: ",").map(String.init))
        }
#endif
        var result = [selectedItem]

        let allEventKitCalendars = eventStore.calendars(for: .event)
        let visibleEventKitCalendars = selectedIDs.isEmpty
            ? allEventKitCalendars
            : allEventKitCalendars.filter { selectedIDs.contains($0.calendarIdentifier) }
        if !visibleEventKitCalendars.isEmpty {
            let predicate = eventStore.predicateForEvents(
                withStart: dayStart,
                end: dayEnd,
                calendars: visibleEventKitCalendars
            )
            for event in eventStore.events(matching: predicate) {
                if let current = target.eventKitEvent,
                   (event.eventIdentifier == current.eventIdentifier
                    || event.calendarItemIdentifier == current.calendarItemIdentifier) {
                    continue
                }
                guard event.isAllDay == isAllDay else { continue }
                result.append(EventDetailTimelineItem(
                    id: "eventkit:\(event.eventIdentifier ?? event.calendarItemIdentifier)",
                    calendarTitle: event.calendar.title,
                    title: event.title ?? localizedEventEditorString("New Event"),
                    location: event.location ?? "",
                    startDate: event.startDate,
                    endDate: max(event.endDate, event.startDate),
                    isAllDay: event.isAllDay,
                    isRecurring: event.hasRecurrenceRules,
                    color: UIColor(cgColor: event.calendar.cgColor),
                    isSelected: false
                ))
            }
        }

        for event in localStore.events where !event.isCancelled {
            guard event.id != target.eventID,
                  event.isAllDay == isAllDay,
                  event.startDate < dayEnd,
                  event.endDate > dayStart,
                  selectedIDs.isEmpty || selectedIDs.contains(event.calendarID),
                  let calendar = localStore.calendar(id: event.calendarID),
                  !calendar.isRevoked
            else { continue }
            result.append(EventDetailTimelineItem(
                id: "local:\(event.id)",
                calendarTitle: calendar.title,
                title: event.title,
                location: event.location,
                startDate: event.startDate,
                endDate: max(event.endDate, event.startDate),
                isAllDay: event.isAllDay,
                isRecurring: !(event.recurrenceRules ?? []).isEmpty,
                color: AppLocalCalendarStore.color(calendar.displayColorHex),
                isSelected: false
            ))
        }

        return result.sorted {
            if $0.startDate != $1.startDate { return $0.startDate < $1.startDate }
            if $0.endDate != $1.endDate { return $0.endDate > $1.endDate }
            let calendarOrder = $0.calendarTitle.localizedStandardCompare($1.calendarTitle)
            if calendarOrder != .orderedSame { return calendarOrder == .orderedAscending }
            return $0.title.localizedStandardCompare($1.title) == .orderedAscending
        }
    }

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        if isEditing || isNew {
            ToolbarItem(placement: .topBarLeading) {
                Button { cancelOrClose() } label: { Image(systemName: "xmark") }
                    .buttonStyle(.borderedProminent)
                    .buttonBorderShape(.circle)
                    .tint(.secondary)
                    .accessibilityLabel("Close")
            }
            ToolbarItem(placement: .confirmationAction) {
                Button { save() } label: { Image(systemName: "checkmark") }
                    .buttonStyle(.borderedProminent)
                    .buttonBorderShape(.circle)
                    .accessibilityLabel("Done")
                    .disabled(
                        title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
                            || selectedChoice?.canEdit != true
                            || (!isNew && !hasUnsavedChanges)
                    )
            }
        } else {
            ToolbarItemGroup(placement: .topBarLeading) {
                if !payloadIsReadOnly {
                    Button { isEditing = true } label: { Image(systemName: "pencil") }
                        .accessibilityLabel("Edit")
                }
                if canShare {
                    Button { shareEvent() } label: { Image(systemName: "square.and.arrow.up") }
                        .accessibilityLabel("Share")
                }
            }
            ToolbarItem(placement: .confirmationAction) {
                Button { close() } label: { Image(systemName: "checkmark") }
                    .buttonStyle(.borderedProminent)
                    .buttonBorderShape(.circle)
                    .accessibilityLabel("Done")
            }
        }
    }

    private func chooseLocation(_ suggestion: MKLocalSearchCompletion) {
        locationSearch.suggestions = []
        location = suggestion.subtitle.isEmpty ? suggestion.title : "\(suggestion.title), \(suggestion.subtitle)"
        Task { structuredLocation = await locationSearch.select(suggestion) }
    }

    private func importFiles(_ result: Result<[URL], Error>) {
        do {
            let urls = try result.get()
            for url in urls.prefix(max(0, 5 - attachments.count)) {
                let hasAccess = url.startAccessingSecurityScopedResource()
                defer { if hasAccess { url.stopAccessingSecurityScopedResource() } }
                let data = try Data(contentsOf: url)
                guard data.count <= 1_000_000 else { continue }
                let type = try? url.resourceValues(forKeys: [.contentTypeKey]).contentType
                attachments.append(AppLocalEventAttachment(
                    fileName: url.lastPathComponent,
                    contentType: type?.preferredMIMEType,
                    dataBase64: data.base64EncodedString()
                ))
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func save() {
        guard selectedChoice?.canEdit == true else { return }
        do {
            let migratedBetweenStores = try persistSelectedDestination()
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
            SharedEventSyncManager.eventStoreDidChange()
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            // A cross-store move creates a new backing identifier. Close this
            // detail instance instead of leaving it bound to the removed one.
            if migratedBetweenStores {
                close()
            } else if !isNew && !target.startsInEditingMode {
                isEditing = false
            } else {
                close()
            }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    @discardableResult
    private func saveAppLocalEvent() throws -> AppLocalEventRecord {
        guard localStore.calendar(id: selectedCalendarID)?.canEditEvents == true else {
            throw selectedCalendarUnavailableError()
        }
        let now = Date()
        let event = AppLocalEventRecord(
            id: existingLocalEvent?.id ?? "app-local-event:" + UUID().uuidString.lowercased(),
            calendarID: selectedCalendarID,
            title: title.trimmingCharacters(in: .whitespacesAndNewlines),
            startDate: persistedStartDate,
            endDate: persistedEndDate,
            isAllDay: isAllDay,
            location: location,
            notes: notes,
            urlString: urlString,
            videoCallURL: normalizedVideoCallURL,
            timeZoneIdentifier: existingLocalEvent?.timeZoneIdentifier
                ?? target.eventKitEvent?.timeZone?.identifier
                ?? TimeZone.current.identifier,
            alarms: [alertOffset.seconds, secondAlertOffset.seconds].compactMap { seconds in
                guard let seconds else { return nil }
                return AppLocalEventAlarm(relativeOffset: seconds)
            },
            createdAt: existingLocalEvent?.createdAt
                ?? target.eventKitEvent?.creationDate
                ?? now,
            updatedAt: now,
            remoteEventID: existingLocalEvent?.remoteEventID,
            isCancelled: existingLocalEvent?.isCancelled ?? false,
            travelTime: travelTime == .none ? nil : TimeInterval(travelTime.rawValue),
            recurrenceRules: recurrenceRule.map { [SharedEventRecurrenceRule(rule: $0)] },
            structuredLocation: structuredLocation,
            attachments: attachments
        )
        localStore.saveEvent(event)
        return event
    }

    @discardableResult
    private func saveEventKitEvent(showsSharePrompt: Bool = true) throws -> EKEvent {
        guard let calendar = eventStore.calendar(withIdentifier: selectedCalendarID),
              calendar.allowsContentModifications else {
            throw selectedCalendarUnavailableError()
        }
        let event = target.eventKitEvent ?? EKEvent(eventStore: eventStore)
        let wasNew = event.eventIdentifier == nil
        event.title = title.trimmingCharacters(in: .whitespacesAndNewlines)
        event.location = location
        event.structuredLocation = structuredLocation?.makeLocation(title: location)
        event.startDate = persistedStartDate
        event.endDate = persistedEndDate
        event.isAllDay = isAllDay
        event.calendar = calendar
        if event.timeZone == nil {
            event.timeZone = existingLocalEvent
                .flatMap { TimeZone(identifier: $0.timeZoneIdentifier) }
                ?? TimeZone.current
        }
        event.url = URL(string: urlString.trimmingCharacters(in: .whitespacesAndNewlines))
        event.notes = notes
        event.alarms = [alertOffset.seconds, secondAlertOffset.seconds].compactMap { seconds in
            guard let seconds else { return nil }
            return EKAlarm(relativeOffset: seconds)
        }
        event.recurrenceRules = recurrenceRule.map { [$0] }
        let span: EKSpan = event.eventIdentifier != nil && event.hasRecurrenceRules ? .futureEvents : .thisEvent
        try eventStore.save(event, span: span, commit: true)
        EventKitEventSupplementStore.update(
            travelTime: travelTime == .none ? nil : TimeInterval(travelTime.rawValue),
            attachments: attachments,
            videoCallURL: normalizedVideoCallURL,
            for: event
        )
        if wasNew && showsSharePrompt { EventSharePromptManager.shared.show(for: event) }
        return event
    }

    /// Persists into the selected backend and, for an existing event, removes
    /// the old backing record only after the new one has been saved. This makes
    /// choosing an app-local calendar from an EventKit event (and vice versa)
    /// a move instead of an accidental duplicate.
    @discardableResult
    private func persistSelectedDestination() throws -> Bool {
        guard let destinationKind = selectedChoice?.kind else {
            throw selectedCalendarUnavailableError()
        }
        let sourceKind = existingCalendarKind

        switch destinationKind {
        case .appLocal:
            let savedEvent = try saveAppLocalEvent()
            guard sourceKind == .eventKit, let sourceEvent = target.eventKitEvent else {
                return false
            }

            let sourceIdentifier = sourceEvent.eventIdentifier
            let span: EKSpan = sourceEvent.hasRecurrenceRules ? .futureEvents : .thisEvent
            do {
                try eventStore.remove(sourceEvent, span: span, commit: true)
            } catch {
                // Roll back the newly-created local record if EventKit could
                // not remove the source, avoiding two copies of the event.
                localStore.deleteEvent(id: savedEvent.id)
                throw error
            }
            EventKitEventSupplementStore.remove(for: sourceEvent)
            if let sourceIdentifier {
                SharedInviteTracker.localEventWasDeleted(
                    localEventIdentifier: sourceIdentifier
                )
            }
            return true

        case .eventKit:
            _ = try saveEventKitEvent(showsSharePrompt: sourceKind == nil)
            guard sourceKind == .appLocal, let sourceID = target.eventID else {
                return false
            }
            localStore.deleteEvent(id: sourceID)
            return true
        }
    }

    private func selectedCalendarUnavailableError() -> NSError {
        NSError(
            domain: "AppLocalEventEditor",
            code: 1,
            userInfo: [
                NSLocalizedDescriptionKey: localizedEventEditorString(
                    "The selected calendar cannot be edited."
                )
            ]
        )
    }

    private func deleteEvent() {
        do {
            if let id = target.eventID {
                localStore.deleteEvent(id: id)
            } else if let event = target.eventKitEvent {
                let identifier = event.eventIdentifier
                EventKitEventSupplementStore.remove(for: event)
                let span: EKSpan = event.hasRecurrenceRules ? .futureEvents : .thisEvent
                try eventStore.remove(event, span: span, commit: true)
                if let identifier { SharedInviteTracker.localEventWasDeleted(localEventIdentifier: identifier) }
            }
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
            SharedEventSyncManager.eventStoreDidChange()
            close()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private var canMoveReadOnlySystemCopy: Bool {
        guard target.eventID == nil,
              let event = target.eventKitEvent,
              event.eventIdentifier != nil
        else { return false }
        return SharedInviteTracker.isReadOnly(event)
    }

    private func moveExistingEvent(to newCalendarID: String) {
        guard newCalendarID != selectedCalendarID,
              choices.first(where: { $0.id == newCalendarID })?.canEdit == true
        else { return }

        let oldCalendarID = selectedCalendarID
        selectedCalendarID = newCalendarID
        if canMoveReadOnlySystemCopy, selectedChoice?.kind == .eventKit {
            moveReadOnlySystemCopy(from: oldCalendarID, to: newCalendarID)
            return
        }

        do {
            let migratedBetweenStores = try persistSelectedDestination()
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
            SharedEventSyncManager.eventStoreDidChange()
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            if migratedBetweenStores { close() }
        } catch {
            selectedCalendarID = oldCalendarID
            errorMessage = error.localizedDescription
        }
    }

    private func saveDetailChanges() {
        guard !payloadIsReadOnly, selectedChoice?.canEdit == true else { return }
        do {
            let migratedBetweenStores = try persistSelectedDestination()
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()
            SharedEventSyncManager.eventStoreDidChange()
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            if migratedBetweenStores { close() }
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func moveReadOnlySystemCopy(from oldCalendarID: String, to newCalendarID: String) {
        guard let event = target.eventKitEvent,
              let oldEventIdentifier = event.eventIdentifier,
              var invite = SharedInviteTracker.invite(localEventIdentifier: oldEventIdentifier),
              let calendar = eventStore.calendar(withIdentifier: newCalendarID),
              calendar.allowsContentModifications
        else {
            selectedCalendarID = oldCalendarID
            return
        }
        let supplement = EventKitEventSupplementStore.supplement(for: event)

        event.calendar = calendar
        do {
            let span: EKSpan = event.hasRecurrenceRules ? .futureEvents : .thisEvent
            try eventStore.save(event, span: span, commit: true)
            if let supplement {
                EventKitEventSupplementStore.update(
                    travelTime: supplement.travelTime,
                    attachments: supplement.attachments,
                    videoCallURL: supplement.videoCallURL,
                    for: event
                )
            }
            let newEventIdentifier = event.eventIdentifier ?? oldEventIdentifier
            invite.localEventIdentifier = newEventIdentifier
            SharedInviteTracker.update(invite)
            NotificationCenter.default.post(name: .sharedEventsTrackingChanged, object: nil)
            NotificationCenter.default.post(name: .sharedEventImported, object: nil)
            EventNotificationManager.shared.rescheduleUpcomingEventNotifications()

            if let session = CalendarFeedSession.existing {
                Task {
                    try? await CloudCalendarsAPI.rememberReceivedInvite(
                        eventId: invite.eventID,
                        feedId: invite.feedID,
                        localEventIdentifier: newEventIdentifier,
                        anonymousRecipientId: SharedInviteTracker.anonymousRecipientID,
                        session: session
                    )
                }
            }
        } catch {
            selectedCalendarID = oldCalendarID
            errorMessage = error.localizedDescription
        }
    }

    private func shareEvent() {
        if let event = target.eventKitEvent {
            EventAppClipSharing.present(for: event)
        } else if let event = existingLocalEvent {
            EventAppClipSharing.present(for: AppLocalEventDescriptor(
                eventID: event.id,
                partialStart: event.startDate,
                partialEnd: event.endDate
            ))
        }
    }

    private func close() {
        dismiss()
        onDismissed?()
    }

    private func calendarPickerItem(
        _ calendar: CalendarChoice,
        includesSubtitle: Bool
    ) -> some View {
        Label {
            if includesSubtitle, let subtitle = calendar.subtitle {
                Text("\(calendar.title) · \(subtitle)")
            } else {
                Text(calendar.title)
            }
        } icon: {
            // Native menus discard arbitrary Shape views. An original-mode
            // UIImage survives the UIKit menu bridge and keeps each calendar's
            // real color next to the system-managed selection checkmark.
            Image(uiImage: Self.calendarDotImage(color: calendar.color))
        }
    }

    private static func calendarDotImage(color: UIColor) -> UIImage {
        let configuration = UIImage.SymbolConfiguration(pointSize: 11, weight: .regular)
        let image = UIImage(systemName: "circle.fill", withConfiguration: configuration)
            ?? UIImage()
        return image.withTintColor(color, renderingMode: .alwaysOriginal)
    }

    private func cancelOrClose() {
        guard isEditing, !isNew, !target.startsInEditingMode else {
            close()
            return
        }
        restorePersistedValues()
        isEditing = false
    }

    private func restorePersistedValues() {
        let local = existingLocalEvent
        let system = target.eventKitEvent
        let systemAlarms = (system?.alarms ?? []).sorted { $0.relativeOffset > $1.relativeOffset }
        let localAlarms = local?.alarms.map(\.relativeOffset) ?? []
        let systemSupplement = system.flatMap(EventKitEventSupplementStore.supplement(for:))

        title = local?.title ?? system?.title ?? localizedEventEditorString("New Event")
        location = local?.location ?? system?.location ?? ""
        structuredLocation = local?.structuredLocation
            ?? system?.structuredLocation.map(SharedEventLocation.init(location:))
        let restoredAllDay = local?.isAllDay ?? system?.isAllDay ?? isAllDay
        let restoredStart = local?.startDate ?? system?.startDate ?? startDate
        let restoredStoredEnd = local?.endDate ?? system?.endDate ?? endDate
        startDate = restoredStart
        endDate = restoredAllDay && restoredStoredEnd > restoredStart
            ? restoredStoredEnd.addingTimeInterval(-1)
            : restoredStoredEnd
        isAllDay = restoredAllDay
        selectedCalendarID = local?.calendarID
            ?? system?.calendar?.calendarIdentifier
            ?? selectedCalendarID
        alertOffset = Self.alert(for: localAlarms.first ?? systemAlarms.first?.relativeOffset)
        secondAlertOffset = Self.alert(
            for: localAlarms.dropFirst().first ?? systemAlarms.dropFirst().first?.relativeOffset
        )
        repeatOption = local.map { RepeatOption(sharedRules: $0.recurrenceRules) }
            ?? RepeatOption(rules: system?.recurrenceRules)
        repeatInterval = max(
            1,
            local?.recurrenceRules?.first?.interval
                ?? system?.recurrenceRules?.first?.interval
                ?? 1
        )
        recurrenceEndDate = local?.recurrenceRules?.first?.endDate
            .flatMap(ISO8601DateFormatter().date(from:))
            ?? system?.recurrenceRules?.first?.recurrenceEnd?.endDate
        travelTime = TravelTimeOption(seconds: local?.travelTime ?? systemSupplement?.travelTime)
        urlString = local?.urlString ?? system?.url?.absoluteString ?? ""
        videoCallURL = local?.videoCallURL ?? systemSupplement?.videoCallURL ?? ""
        notes = local?.notes ?? system?.notes ?? ""
        attachments = local?.attachments ?? systemSupplement?.attachments ?? []
        locationSearch.suggestions = []
    }

    private static func alert(for seconds: TimeInterval?) -> AlertOffset {
        AlertOffset.allCases.first { $0.seconds == seconds } ?? .none
    }

    private static func sortCalendars(_ lhs: CalendarChoice, _ rhs: CalendarChoice) -> Bool {
        lhs.title.localizedStandardCompare(rhs.title) == .orderedAscending
    }

}

@MainActor
private struct EventLocationEditorSheet: View {
    @Binding var location: String
    @Binding var structuredLocation: SharedEventLocation?
    @Binding var videoCallURL: String
    @ObservedObject var searchModel: EventLocationSearchModel

    @Environment(\.dismiss) private var dismiss
    @State private var draftLocation: String
    @State private var draftVideoCallURL: String

    init(
        location: Binding<String>,
        structuredLocation: Binding<SharedEventLocation?>,
        videoCallURL: Binding<String>,
        searchModel: EventLocationSearchModel
    ) {
        _location = location
        _structuredLocation = structuredLocation
        _videoCallURL = videoCallURL
        self.searchModel = searchModel
        _draftLocation = State(initialValue: location.wrappedValue)
        _draftVideoCallURL = State(initialValue: videoCallURL.wrappedValue)
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    HStack(spacing: 0) {
                        Text("Location")
                            .foregroundStyle(.secondary)
                        Text(": ")
                            .foregroundStyle(.secondary)
                        TextField("", text: $draftLocation)
                            .textInputAutocapitalization(.words)
                            .autocorrectionDisabled(false)
                        if !draftLocation.isEmpty {
                            Button {
                                draftLocation = ""
                                searchModel.update(query: "")
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundStyle(.tertiary)
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel("Clear")
                        }
                    }

                    HStack(spacing: 0) {
                        Text("Video Call")
                            .foregroundStyle(.secondary)
                        Text(": ")
                            .foregroundStyle(.secondary)
                        TextField("", text: $draftVideoCallURL)
                            .keyboardType(.URL)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()
                    }
                }

                let trimmed = draftLocation.trimmingCharacters(in: .whitespacesAndNewlines)
                if !trimmed.isEmpty {
                    Section {
                        Button {
                            location = trimmed
                            videoCallURL = draftVideoCallURL.trimmingCharacters(in: .whitespacesAndNewlines)
                            structuredLocation = SharedEventLocation(
                                title: trimmed,
                                latitude: nil,
                                longitude: nil,
                                radius: 0
                            )
                            dismiss()
                        } label: {
                            Text("“\(trimmed)”")
                                .foregroundStyle(.primary)
                        }
                    }
                }

                if !searchModel.suggestions.isEmpty {
                    Section("Map Locations") {
                        ForEach(Array(searchModel.suggestions.enumerated()), id: \.offset) { _, suggestion in
                            Button {
                                select(suggestion)
                            } label: {
                                HStack(spacing: 12) {
                                    Image(systemName: "mappin.and.ellipse")
                                        .foregroundStyle(.red)
                                        .frame(width: 24)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(suggestion.title)
                                            .foregroundStyle(.primary)
                                        if !suggestion.subtitle.isEmpty {
                                            Text(suggestion.subtitle)
                                                .font(.footnote)
                                                .foregroundStyle(.secondary)
                                                .lineLimit(2)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Location")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        commitTypedLocation()
                        dismiss()
                    } label: {
                        Image(systemName: "xmark")
                    }
                    .buttonStyle(.borderedProminent)
                    .buttonBorderShape(.circle)
                    .tint(.secondary)
                    .accessibilityLabel("Close")
                }
            }
            .onAppear { searchModel.update(query: draftLocation) }
            .onChange(of: draftLocation) { _, newValue in
                searchModel.update(query: newValue)
            }
        }
    }

    private func commitTypedLocation() {
        let trimmed = draftLocation.trimmingCharacters(in: .whitespacesAndNewlines)
        videoCallURL = draftVideoCallURL.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed != location {
            location = trimmed
            structuredLocation = trimmed.isEmpty ? nil : SharedEventLocation(
                title: trimmed,
                latitude: nil,
                longitude: nil,
                radius: 0
            )
        }
    }

    private func select(_ suggestion: MKLocalSearchCompletion) {
        Task {
            let selected = await searchModel.select(suggestion)
            location = suggestion.subtitle.isEmpty
                ? suggestion.title
                : "\(suggestion.title), \(suggestion.subtitle)"
            structuredLocation = selected
            videoCallURL = draftVideoCallURL.trimmingCharacters(in: .whitespacesAndNewlines)
            searchModel.suggestions = []
            dismiss()
        }
    }
}

private enum PreferenceDatePickerComponent {
    case date
    case time

    var displayedComponents: DatePickerComponents {
        switch self {
        case .date: .date
        case .time: .hourAndMinute
        }
    }
}

/// Keeps the familiar compact EventKit control and its native picker, while
/// rendering the value with the date/time format explicitly selected in the
/// app. SwiftUI's compact DatePicker only follows the locale and otherwise
/// ignores an app-specific format such as `dd.MM.yyyy`.
private struct PreferenceCompactDatePicker: View {
    @ObservedObject private var appPreferences = AppPreferences.shared

    @Binding var selection: Date
    let range: ClosedRange<Date>
    let component: PreferenceDatePickerComponent
    let timeZone: TimeZone

    var body: some View {
        ZStack {
            Text(displayText)
                .font(.body)
                .foregroundStyle(.primary)
                .lineLimit(1)
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(
                    Color(uiColor: .secondarySystemFill),
                    in: RoundedRectangle(cornerRadius: 8, style: .continuous)
                )
                .allowsHitTesting(false)
                .accessibilityHidden(true)

            DatePicker(
                "",
                selection: $selection,
                in: range,
                displayedComponents: component.displayedComponents
            )
            .labelsHidden()
            .datePickerStyle(.compact)
            .opacity(0.02)
        }
        .fixedSize(horizontal: true, vertical: true)
        .environment(\.locale, appPreferences.presentationLocale)
    }

    private var displayText: String {
        switch component {
        case .date:
            appShortDateFormatter(timeZone: timeZone, includesYear: true)
                .string(from: selection)
        case .time:
            appTimeFormatter(timeZone: timeZone).string(from: selection)
        }
    }
}

private struct EventDetailTimelineItem: Identifiable {
    let id: String
    let calendarTitle: String
    let title: String
    let location: String
    let startDate: Date
    let endDate: Date
    let isAllDay: Bool
    let isRecurring: Bool
    let color: UIColor
    let isSelected: Bool
}

@MainActor
private struct EventDetailTimelinePreview: View {
    private struct LayoutItem: Identifiable {
        let item: EventDetailTimelineItem
        let leading: CGFloat
        let width: CGFloat
        let depth: Int
        let contentEnd: Date

        var id: String { item.id }
    }

    @Environment(\.layoutDirection) private var layoutDirection
    @Environment(\.colorScheme) private var colorScheme

    let items: [EventDetailTimelineItem]
    let timeZone: TimeZone
    let locale: Locale
    let timeFormat: AppTimeFormatPreference

    private let rowHeight: CGFloat = 40
    private let timeColumnWidth: CGFloat = 58
    private let contentInset: CGFloat = 12
    private let trailingInset: CGFloat = 26
    private let columnGap: CGFloat = 2
    private let minimumBlockHeight: CGFloat = 16

    var body: some View {
        GeometryReader { proxy in
            let availableWidth = max(
                1,
                proxy.size.width - timeColumnWidth - contentInset - trailingInset
            )
            ZStack(alignment: .topLeading) {
                VStack(spacing: 0) {
                    ForEach(0..<5, id: \.self) { offset in
                        HStack(alignment: .top, spacing: 8) {
                            if layoutDirection == .rightToLeft {
                                timelineGridLine
                                timelineHourLabel(offset: offset, alignment: .leading)
                            } else {
                                timelineHourLabel(offset: offset, alignment: .trailing)
                                timelineGridLine
                            }
                        }
                        .frame(height: rowHeight, alignment: .top)
                    }
                }
                .offset(y: CGFloat(firstGridHour.timeIntervalSince(firstDisplayedHour) / 3_600) * rowHeight)

                ForEach(layoutItems(availableWidth: availableWidth)) { layout in
                    let width = layout.width
                    // Use physical coordinates here. SwiftUI mirrors a
                    // `.topLeading` alignment in RTL, while `offset(x:)`
                    // remains a physical translation. Mirror the normalized
                    // Apple-style overlap region exactly once.
                    let contentLeftEdge = layoutDirection == .rightToLeft
                        ? trailingInset
                        : timeColumnWidth + contentInset
                    let logicalOrigin = layout.leading
                    let physicalOrigin = layoutDirection == .rightToLeft
                        ? availableWidth - logicalOrigin - width
                        : logicalOrigin
                    let horizontalPosition = contentLeftEdge + physicalOrigin + width / 2
                    let height = blockHeight(for: layout.item)

                    eventBlock(layout.item, width: width, height: height, depth: layout.depth, contentEnd: layout.contentEnd)
                        .environment(\.layoutDirection, layoutDirection)
                        .position(
                            x: horizontalPosition,
                            y: blockOffset(for: layout.item) + height / 2
                        )
                        .zIndex(Double(layout.depth) + (layout.item.isSelected ? 0.1 : 0))
                }
            }
            // Geometry coordinates must stay physical. If this container is
            // allowed to mirror, SwiftUI mirrors `position(x:)` a second time
            // and the manually mirrored RTL blocks overlap the hour labels.
            .environment(\.layoutDirection, .leftToRight)
        }
        .frame(height: rowHeight * CGFloat(displayedHourCount))
        .clipped()
        .accessibilityElement(children: .combine)
    }

    private var timelineGridLine: some View {
        Rectangle()
            .fill(Color(uiColor: .separator).opacity(0.45))
            .frame(height: 0.5)
    }

    private func timelineHourLabel(
        offset: Int,
        alignment: Alignment
    ) -> some View {
        hourLabel(for: calendar.date(
            byAdding: .hour,
            value: offset,
            to: firstGridHour
        ) ?? firstGridHour)
        .environment(\.layoutDirection, layoutDirection)
        .foregroundStyle(.secondary)
        .frame(width: timeColumnWidth, alignment: alignment)
        .offset(y: -8)
    }

    @ViewBuilder
    private func eventBlock(
        _ item: EventDetailTimelineItem,
        width: CGFloat,
        height: CGFloat,
        depth: Int,
        contentEnd: Date
    ) -> some View {
        let eventColor = Color(uiColor: item.color)
        let foregroundColor: Color = item.isSelected ? .white : timelineTextColor(item.color, strength: 0.82)
        let titleColor: Color = item.isSelected ? .white : timelineTextColor(item.color, strength: 0.58)
        let backgroundColor = timelineBackground(item.color, selected: item.isSelected, depth: depth)
        let showsColorBar = !item.isSelected && !item.isAllDay && height > 12
        let colorBarInset: CGFloat = 5
        let colorBarWidth: CGFloat = 3
        let colorBarTextSpacing: CGFloat = 4
        let horizontalPadding: CGFloat = width < 90 ? 5 : 8
        // Reserve the bar's entire width plus a gap before laying out text.
        // Both use logical leading so the same spacing is preserved in RTL.
        let leadingPadding = showsColorBar
            ? colorBarInset + colorBarWidth + colorBarTextSpacing
            : horizontalPadding
        let hiddenTop = max(0, CGFloat(firstDisplayedHour.timeIntervalSince(item.startDate) / 3_600) * rowHeight)
        let textClipHeight = max(0, min(height, CGFloat(contentEnd.timeIntervalSince(max(item.startDate, firstDisplayedHour)) / 3_600) * rowHeight - 2))
        let contentHeight = textClipHeight + hiddenTop
        let fontSize: CGFloat = contentHeight < 20 && !item.isSelected ? 9 : 10
        let lineHeight = UIFont.systemFont(ofSize: fontSize).lineHeight
        let verticalPadding: CGFloat = height < 20 ? 1 : 3
        let availableLines = max(0, (contentHeight - 2 * verticalPadding) / lineHeight)
        let lineCount = max(0, Int(floor(availableLines)))

        Group {
            // Calendar keeps the content at the event's real start. A block
            // clipped by the top of this four-hour window therefore remains a
            // colored underlay instead of repeating its title over its children.
            if hiddenTop < rowHeight * 4, lineCount > 0 {
                timelineContent(item, titleColor: titleColor, width: max(1, width - leadingPadding - horizontalPadding), lineCount: lineCount, fontSize: fontSize)
                    .font(.system(size: fontSize))
                    .fixedSize(horizontal: false, vertical: true)
            } else {
                Color.clear
            }
        }
        .foregroundStyle(foregroundColor)
        .padding(.leading, leadingPadding)
        .padding(.trailing, horizontalPadding)
        .padding(.vertical, verticalPadding)
        .offset(y: -hiddenTop)
        .frame(width: width, height: height, alignment: .topLeading)
        // Child backgrounds may be translucent. Clip the parent's text at
        // its first child so text can never show through a nested event.
        .mask(alignment: .top) {
            Rectangle().frame(height: textClipHeight)
        }
        .background(
            backgroundColor,
            in: UnevenRoundedRectangle(
                topLeadingRadius: item.startDate < firstDisplayedHour ? 0 : 5,
                bottomLeadingRadius: item.endDate > displayEnd ? 0 : 5,
                bottomTrailingRadius: item.endDate > displayEnd ? 0 : 5,
                topTrailingRadius: item.startDate < firstDisplayedHour ? 0 : 5,
                style: .continuous
            )
        )
        .overlay(alignment: .leading) {
            if showsColorBar {
                Capsule()
                    .fill(eventColor)
                    .frame(width: colorBarWidth)
                    .padding(.top, max(0, 5 - hiddenTop))
                    .padding(.bottom, item.endDate > displayEnd ? 0 : 5)
                    .padding(.leading, colorBarInset)
            }
        }
        .clipped()
    }

    private func timelineContent(_ item: EventDetailTimelineItem, titleColor: Color, width: CGFloat, lineCount: Int, fontSize: CGFloat) -> some View {
        let titleLines = min(lineCount, min(2, textLineCount(item.title, width: width - (item.isRecurring ? 14 : 0), font: .systemFont(ofSize: fontSize, weight: .semibold))))
        let locationLines = item.location.isEmpty ? 0 : min(max(0, lineCount - titleLines), min(2, textLineCount("◉ " + item.location, width: width, font: .systemFont(ofSize: fontSize))))
        let timeLines = max(0, lineCount - titleLines - locationLines)
        return VStack(alignment: .leading, spacing: 0) {
            (Text(item.title).fontWeight(.semibold) + (item.isRecurring ? Text(" ") + Text(Image(systemName: "repeat")) : Text("")))
                .foregroundColor(titleColor)
                .lineLimit(titleLines)
            if locationLines > 0 {
                (Text(Image(systemName: "location")).font(.system(size: 8)) + Text("\u{00A0}" + item.location))
                    .lineLimit(locationLines)
            }
            if timeLines > 0, !item.isAllDay {
                (Text(Image(systemName: "clock")).font(.system(size: 8)) + Text("\u{00A0}" + compactTimeRange(item.startDate, item.endDate)))
                    .lineLimit(timeLines)
            }
        }
    }

    private func textLineCount(_ text: String, width: CGFloat, font: UIFont) -> Int {
        let bounds = (text as NSString).boundingRect(with: CGSize(width: max(1, width), height: .greatestFiniteMagnitude), options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: [.font: font], context: nil)
        return max(1, Int(ceil(bounds.height / font.lineHeight)))
    }

    private func timelineTextColor(_ color: UIColor, strength: CGFloat) -> Color {
        Color(uiColor: EventTimelineColors.text(color, strength: strength, dark: colorScheme == .dark))
    }

    private func timelineBackground(_ color: UIColor, selected: Bool, depth: Int) -> Color {
        Color(uiColor: EventTimelineColors.background(color, selected: selected, depth: depth, dark: colorScheme == .dark))
    }

    private var calendar: Calendar {
        var value = Calendar(identifier: .gregorian)
        value.timeZone = timeZone
        value.locale = locale
        return value
    }

    private var previewWindow: EventDetailTimelineLayout.Window {
        let selected = selectedItem
        return EventDetailTimelineLayout.window(start: selected?.startDate ?? Date(),
            end: selected?.endDate ?? Date(), allDay: selected?.isAllDay ?? false, calendar: calendar)
    }

    private var firstDisplayedHour: Date { previewWindow.start }

    private var firstGridHour: Date {
        calendar.dateInterval(of: .hour, for: firstDisplayedHour)?.start
            ?? firstDisplayedHour
    }

    private var selectedItem: EventDetailTimelineItem? {
        items.first(where: \.isSelected) ?? items.first
    }

    private var displayEnd: Date { previewWindow.end }
    private var displayedHourCount: Int { previewWindow.hours }

    private func layoutItems(availableWidth: CGFloat) -> [LayoutItem] {
        let candidates = items.filter { $0.isSelected || !$0.isAllDay }
        let byID = Dictionary(candidates.map { ($0.id, $0) }, uniquingKeysWith: { first, _ in first })
        let input = byID.values.map {
            EventDetailTimelineLayout.Item(id: $0.id, title: $0.title, calendarTitle: $0.calendarTitle,
                start: $0.startDate, end: $0.endDate)
        }
        let engine = EventDetailTimelineLayout(width: availableWidth,
            minimumDuration: TimeInterval((minimumBlockHeight + columnGap) / rowHeight * 3_600),
            minimumHeaderDuration: TimeInterval((minimumBlockHeight + columnGap) / rowHeight * 3_600))
        let visibleInterval = DateInterval(start: firstDisplayedHour, end: displayEnd)
        return engine.place(input, in: visibleInterval).compactMap { placement in
            guard let item = byID[placement.id],
                  item.startDate < displayEnd, item.endDate > firstDisplayedHour else { return nil }
            return LayoutItem(item: item, leading: placement.leading, width: placement.width,
                depth: placement.depth, contentEnd: placement.contentEnd)
        }
    }

    private func blockOffset(for item: EventDetailTimelineItem) -> CGFloat {
        guard !item.isAllDay else { return 5 }
        let clippedStart = max(item.startDate, firstDisplayedHour)
        return CGFloat(clippedStart.timeIntervalSince(firstDisplayedHour) / 3_600) * rowHeight + (item.startDate < firstDisplayedHour ? 0 : 1)
    }

    private func blockHeight(for item: EventDetailTimelineItem) -> CGFloat {
        guard !item.isAllDay else { return 34 }
        let clippedStart = max(item.startDate, firstDisplayedHour)
        let clippedEnd = min(item.endDate, displayEnd)
        let duration = max(0, clippedEnd.timeIntervalSince(clippedStart))
        return min(
            rowHeight * CGFloat(displayedHourCount) - blockOffset(for: item),
            max(minimumBlockHeight, CGFloat(duration / 3_600) * rowHeight - 2)
        )
    }

    @ViewBuilder
    private func hourLabel(for date: Date) -> some View {
        let hour = calendar.component(.hour, from: date)
        let minute = calendar.component(.minute, from: date)

        if usesTwelveHourTime, hour == 12, minute == 0 {
            Text(localizedNoon(for: date))
                .font(.footnote.weight(.semibold))
        } else if usesTwelveHourTime {
            HStack(alignment: .lastTextBaseline, spacing: 2) {
                Text(hourNumber(for: date))
                    .font(.footnote)
                Text(dayPeriod(for: date))
                    .font(.caption2)
            }
        } else {
            Text(hourText(for: date))
                .font(.footnote)
        }
    }

    private var usesTwelveHourTime: Bool {
        switch timeFormat {
        case .twelveHour:
            true
        case .twentyFourHour:
            false
        case .system:
            DateFormatter.dateFormat(fromTemplate: "j", options: 0, locale: locale)?.contains("a") == true
        }
    }

    private func hourNumber(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        formatter.dateFormat = "h"
        return formatter.string(from: date)
    }

    private func dayPeriod(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        formatter.dateFormat = "a"
        return formatter.string(from: date)
    }

    private func localizedNoon(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        formatter.dateFormat = "B"
        return formatter.string(from: date).capitalized(with: locale)
    }

    private func hourText(for date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        formatter.setLocalizedDateFormatFromTemplate("j")
        return formatter.string(from: date)
    }

    private func timeText(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.locale = locale
        formatter.timeZone = timeZone
        let minute = calendar.component(.minute, from: date)
        switch timeFormat {
        case .twelveHour:
            formatter.dateFormat = minute == 0 ? "h a" : "h:mm a"
        case .twentyFourHour:
            formatter.dateFormat = "HH:mm"
        case .system:
            formatter.setLocalizedDateFormatFromTemplate(minute == 0 ? "j" : "jm")
        }
        return formatter.string(from: date)
    }

    private func compactTimeText(_ date: Date) -> String {
        timeText(date)
            .replacingOccurrences(of: "\u{202F}", with: " ")
            .replacingOccurrences(of: "\u{00A0}", with: " ")
    }

    private func compactTimeRange(_ start: Date, _ end: Date) -> String {
        var startText = compactTimeText(start)
        let endText = compactTimeText(end)
        if usesTwelveHourTime, dayPeriod(for: start) == dayPeriod(for: end) {
            startText = startText.replacingOccurrences(of: dayPeriod(for: start), with: "")
                .trimmingCharacters(in: .whitespaces)
        }
        return startText + " – " + endText
    }
}

#if DEBUG
/// Deterministic, launch-argument-only fixture used to compare this custom
/// editor and detail screen with the EventKit reference captures.
@MainActor
struct AppLocalEventReferencePreview: View {
    private static let calendarID = "app-local:event-editor-reference-calendar"
    private static let overlapCalendarID = "app-local:event-editor-overlap-calendar"
    private static let eventID = "app-local-event:event-editor-reference"
    private static let overlapEventID = "app-local-event:event-editor-overlap"
    private static let denseCalendarID = "app-local:event-editor-dense-calendar"
    private static let denseEventIDs = (0..<5).map { "app-local-event:event-editor-dense-\($0)" }
    private static let underlayEventID = "app-local-event:event-editor-underlay"
    private static let eventKitFixtureKey = "UnifiedEventEditorEventKitFixtureID"

    private let target: AppLocalEventEditorTarget

    init() {
        let mode = UserDefaults.standard.string(forKey: "EventEditorReferenceMode") ?? "edit"
        let startsEditing = !mode.hasPrefix("detail")
        // Inspect an existing local record without recreating fixture data.
        if UserDefaults.standard.string(forKey: "EventEditorReferenceKind") == "local",
           let requestedTitle = UserDefaults.standard.string(forKey: "EventEditorReferenceExistingTitle"),
           let event = AppLocalCalendarStore.shared.events.first(where: { $0.title == requestedTitle }) {
            target = AppLocalEventEditorTarget(eventID: event.id, startsInEditingMode: startsEditing)
            return
        }
        if UserDefaults.standard.string(forKey: "EventEditorReferenceKind") == "eventkit",
           let event = Self.makeEventKitFixture() {
            target = AppLocalEventEditorTarget(
                eventKitEvent: event,
                startsInEditingMode: startsEditing
            )
            return
        }

        target = Self.makeAppLocalFixture(startsEditing: startsEditing)
    }

    var body: some View {
        AppLocalEventEditorView(target: target)
    }

    private static func makeAppLocalFixture(startsEditing: Bool) -> AppLocalEventEditorTarget {
        let store = AppLocalCalendarStore.shared
        store.upsertCalendar(AppLocalCalendarRecord(
            id: Self.calendarID,
            title: "Calendar1",
            colorHex: "#0088FF",
            origin: .owned,
            access: .owner,
            isOriginalCreator: true
        ))
        store.upsertCalendar(AppLocalCalendarRecord(
            id: Self.overlapCalendarID,
            title: "Team",
            colorHex: "#007AFF",
            origin: .owned,
            access: .owner,
            isOriginalCreator: true
        ))
        store.upsertCalendar(AppLocalCalendarRecord(
            id: Self.denseCalendarID,
            title: "30 Minute Schedule",
            colorHex: "#FF9500",
            origin: .owned,
            access: .owner,
            isOriginalCreator: true
        ))
        let includesOverlap = UserDefaults.standard.bool(forKey: "EventEditorReferenceOverlap")
        let includesDenseTimeline = UserDefaults.standard.bool(
            forKey: "EventEditorReferenceDenseTimeline"
        )
        CalendarViewModel.shared.selectedCalendarIDs = Set(
            [Self.calendarID]
                + (includesOverlap ? [Self.overlapCalendarID] : [])
                + (includesDenseTimeline ? [Self.denseCalendarID] : [])
        )

        var eventCalendar = Calendar(identifier: .gregorian)
        eventCalendar.timeZone = TimeZone(identifier: "Europe/Sofia") ?? .current
        let start = eventCalendar.date(from: DateComponents(
            year: 2026,
            month: 9,
            day: 5,
            hour: 10,
            minute: 30
        )) ?? Date()
        let end = eventCalendar.date(byAdding: .minute, value: 90, to: start)
            ?? start.addingTimeInterval(5_400)
        let recurrence = EKRecurrenceRule(recurrenceWith: .weekly, interval: 1, end: nil)

        store.saveEvent(AppLocalEventRecord(
            id: Self.eventID,
            calendarID: Self.calendarID,
            title: "Product Launch Planning",
            startDate: start,
            endDate: end,
            location: "Apple Park Visitor Center, Cupertino",
            notes: "Review the launch checklist.\nBring the final presentation and confirm the release owners.",
            urlString: "https://cloud-calendars.com/launch",
            timeZoneIdentifier: eventCalendar.timeZone.identifier,
            alarms: [
                AppLocalEventAlarm(relativeOffset: -900),
                AppLocalEventAlarm(relativeOffset: -86_400)
            ],
            recurrenceRules: [SharedEventRecurrenceRule(rule: recurrence)],
            structuredLocation: SharedEventLocation(
                title: "Apple Park Visitor Center, Cupertino",
                latitude: 37.3327,
                longitude: -122.0053,
                radius: 0
            )
        ))
        if includesOverlap {
            store.saveEvent(AppLocalEventRecord(
                id: Self.overlapEventID,
                calendarID: Self.overlapCalendarID,
                title: "Team Sync",
                startDate: eventCalendar.date(byAdding: .minute, value: -30, to: start) ?? start,
                endDate: eventCalendar.date(byAdding: .minute, value: 45, to: start)
                    ?? start.addingTimeInterval(2_700),
                location: "Conference Room",
                timeZoneIdentifier: eventCalendar.timeZone.identifier
            ))
        } else if store.event(id: Self.overlapEventID) != nil {
            store.deleteEvent(id: Self.overlapEventID)
        }

        let denseTitles = [
            "Preparation",
            "Design Check",
            "Engineering Sync",
            "Release Review",
            "Follow-up"
        ]
        // Together these cover a long underlay, nested events, three-way
        // overlap, equal boundaries, a 30-minute event, and an event beginning
        // exactly when another ends. All remain in one calendar column.
        let denseOffsets = [-30, 0, 30, 60, 90]
        let denseDurations = [180, 90, 30, 90, 30]
        for index in Self.denseEventIDs.indices {
            let id = Self.denseEventIDs[index]
            guard includesDenseTimeline else {
                if store.event(id: id) != nil { store.deleteEvent(id: id) }
                continue
            }
            let denseStart = eventCalendar.date(
                byAdding: .minute,
                value: denseOffsets[index],
                to: start
            ) ?? start
            let denseEnd = eventCalendar.date(
                byAdding: .minute,
                value: denseDurations[index],
                to: denseStart
            ) ?? denseStart.addingTimeInterval(TimeInterval(denseDurations[index] * 60))
            store.saveEvent(AppLocalEventRecord(
                id: id,
                calendarID: Self.denseCalendarID,
                title: denseTitles[index],
                startDate: denseStart,
                endDate: denseEnd,
                location: index.isMultiple(of: 2) ? "Apple Park" : "",
                timeZoneIdentifier: eventCalendar.timeZone.identifier
            ))
        }

        if includesDenseTimeline {
            let previousDay = eventCalendar.date(byAdding: .day, value: -1, to: start) ?? start
            let nextDay = eventCalendar.date(byAdding: .day, value: 1, to: start) ?? end
            store.saveEvent(AppLocalEventRecord(
                id: Self.underlayEventID,
                calendarID: Self.calendarID,
                title: "Multi-Day Underlay",
                startDate: previousDay,
                endDate: nextDay,
                location: "Sofia Expo Center",
                timeZoneIdentifier: eventCalendar.timeZone.identifier
            ))
        } else if store.event(id: Self.underlayEventID) != nil {
            store.deleteEvent(id: Self.underlayEventID)
        }

        let stored = store.event(id: Self.eventID)
        assert(stored?.title == "Product Launch Planning")
        assert(stored?.alarms.count == 2)
        assert(stored?.recurrenceRules?.first?.frequency == EKRecurrenceFrequency.weekly.rawValue)
        assert(!includesDenseTimeline || Self.denseEventIDs.allSatisfy { store.event(id: $0) != nil })
        assert(!includesDenseTimeline || store.event(id: Self.underlayEventID) != nil)
        print("[UnifiedEventEditorTest] PASS app-local create/update/read")
        return AppLocalEventEditorTarget(eventID: Self.eventID, startsInEditingMode: startsEditing)
    }

    private static func makeEventKitFixture() -> EKEvent? {
        let eventStore = CalendarViewModel.shared.eventStore
        if let requestedTitle = UserDefaults.standard.string(
            forKey: "EventEditorReferenceExistingTitle"
        )?.trimmingCharacters(in: .whitespacesAndNewlines),
           !requestedTitle.isEmpty {
            var fixtureCalendar = Calendar(identifier: .gregorian)
            fixtureCalendar.timeZone = TimeZone(identifier: "Europe/Sofia") ?? .current
            let rangeStart = fixtureCalendar.date(from: DateComponents(
                year: 2026,
                month: 1,
                day: 1
            )) ?? Date(timeIntervalSince1970: 1_767_225_600)
            let rangeEnd = fixtureCalendar.date(byAdding: .year, value: 1, to: rangeStart)
                ?? rangeStart.addingTimeInterval(31_536_000)
            let predicate = eventStore.predicateForEvents(
                withStart: rangeStart,
                end: rangeEnd,
                calendars: nil
            )
            if let existing = eventStore.events(matching: predicate).first(where: {
                $0.title == requestedTitle
            }) {
                return existing
            }
        }

        guard let destination = eventStore.defaultCalendarForNewEvents
            ?? eventStore.calendars(for: .event).first(where: \.allowsContentModifications)
        else {
            print("[UnifiedEventEditorTest] SKIP EventKit: no writable calendar")
            return nil
        }

        let storedIdentifier = UserDefaults.standard.string(forKey: eventKitFixtureKey)
        let event = storedIdentifier
            .flatMap { eventStore.calendarItem(withIdentifier: $0) as? EKEvent }
            ?? EKEvent(eventStore: eventStore)

        var eventCalendar = Calendar(identifier: .gregorian)
        eventCalendar.timeZone = TimeZone(identifier: "Europe/Sofia") ?? .current
        let start = eventCalendar.date(from: DateComponents(
            year: 2026,
            month: 9,
            day: 5,
            hour: 10,
            minute: 30
        )) ?? Date()

        event.calendar = destination
        event.title = "Product Launch Planning"
        event.location = "Apple Park Visitor Center, Cupertino"
        event.structuredLocation = EKStructuredLocation(title: "Apple Park Visitor Center, Cupertino")
        event.structuredLocation?.geoLocation = CLLocation(latitude: 37.3327, longitude: -122.0053)
        event.startDate = start
        event.endDate = eventCalendar.date(byAdding: .minute, value: 90, to: start)
        event.timeZone = eventCalendar.timeZone
        event.notes = "Review the launch checklist.\nBring the final presentation and confirm the release owners."
        event.url = URL(string: "https://cloud-calendars.com/launch")
        event.alarms = [EKAlarm(relativeOffset: -900), EKAlarm(relativeOffset: -86_400)]
        event.recurrenceRules = [EKRecurrenceRule(recurrenceWith: .weekly, interval: 1, end: nil)]

        do {
            try eventStore.save(event, span: .futureEvents, commit: true)
            UserDefaults.standard.set(event.calendarItemIdentifier, forKey: eventKitFixtureKey)
            EventKitEventSupplementStore.update(
                travelTime: nil,
                attachments: [],
                videoCallURL: "",
                for: event
            )

            let reloaded = eventStore.event(withIdentifier: event.eventIdentifier)
            let supplement = reloaded.flatMap(EventKitEventSupplementStore.supplement(for:))
            assert(reloaded?.title == "Product Launch Planning")
            assert(reloaded?.calendar.allowsContentModifications == true)
            assert(reloaded?.alarms?.count == 2)
            assert(reloaded?.recurrenceRules?.first?.frequency == .weekly)
            assert(supplement?.travelTime == nil)
            assert(supplement?.attachments.isEmpty == true)
            assert(supplement?.videoCallURL?.isEmpty != false)
            print("[UnifiedEventEditorTest] PASS EventKit create/update/read")
            return reloaded ?? event
        } catch {
            print("[UnifiedEventEditorTest] FAIL EventKit: \(error.localizedDescription)")
            return nil
        }
    }
}
#endif
