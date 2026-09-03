import EventKit
import SwiftUI

/// Turns one of the owner's real calendars into a public booking page.
///
/// The owner picks a source calendar, names the meetings they offer and the
/// hours they take them, and gets a link to share. Busy times come from — and
/// confirmed bookings are written back into — the chosen calendar, so their real
/// commitments and their booked meetings live in one place.
struct BookingSetupView: View {
    @Environment(\.dismiss) private var dismiss

    private struct EditableType: Identifiable {
        let id = UUID()
        var serverID: String?
        var name: String
        var duration: Int
    }
    private struct EditableDay: Identifiable {
        let id = UUID()
        let weekday: Int // 0=Sun … 6=Sat
        var on: Bool
        var start: Date
        var end: Date
    }

    private enum Phase: Equatable { case form, saving, done }

    @State private var phase: Phase = .form
    @State private var displayName = ""
    @State private var selectedCalendarID = ""
    @State private var types: [EditableType] = [EditableType(serverID: nil, name: "Intro call", duration: 30)]
    @State private var days: [EditableDay] = []
    @State private var bookingURL = ""
    @State private var errorMessage: String?
    @State private var writable: [EKCalendar] = []

    private let durations = [15, 30, 45, 60, 90]

    var body: some View {
        NavigationStack {
            Group {
                switch phase {
                case .form, .saving: form
                case .done: done
                }
            }
            .navigationTitle(Text("Booking page"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    AppToolbarTextButton("Close") { dismiss() }
                }
            }
        }
        .onAppear(perform: seed)
    }

    // MARK: - Form

    private var form: some View {
        Form {
            Section("Your name") {
                TextField("Display name", text: $displayName)
            }

            Section {
                Picker("Calendar", selection: $selectedCalendarID) {
                    ForEach(writable, id: \.calendarIdentifier) { cal in
                        Text(cal.title).tag(cal.calendarIdentifier)
                    }
                }
            } header: {
                Text("Source calendar")
            } footer: {
                Text("Booked meetings land here, and your busy times here block new bookings.")
            }

            Section("Meeting types") {
                ForEach($types) { $t in
                    VStack(alignment: .leading, spacing: 6) {
                        TextField("Name", text: $t.name)
                        Picker("Length", selection: $t.duration) {
                            ForEach(durations, id: \.self) { duration in
                                Text(
                                    String.localizedStringWithFormat(
                                        NSLocalizedString("%lld min", comment: "Meeting duration in minutes"),
                                        Int64(duration)
                                    )
                                )
                                .tag(duration)
                            }
                        }
                        .pickerStyle(.menu)
                    }
                }
                .onDelete { types.remove(atOffsets: $0) }
                Button {
                    types.append(EditableType(serverID: nil, name: "", duration: 30))
                } label: {
                    Label("Add meeting type", systemImage: "plus.circle")
                }
            }

            Section("Weekly hours") {
                ForEach($days) { $d in
                    VStack {
                        Toggle(weekdayName(d.weekday), isOn: $d.on)
                        if d.on {
                            HStack {
                                DatePicker("From", selection: $d.start, displayedComponents: .hourAndMinute)
                                DatePicker("To", selection: $d.end, displayedComponents: .hourAndMinute)
                            }
                            .font(.subheadline)
                        }
                    }
                }
            }

            if let errorMessage {
                Section {
                    Text(errorMessage).foregroundStyle(.red).font(.footnote)
                }
            }

            Section {
                Button(action: { Task { await save() } }) {
                    HStack {
                        Spacer()
                        if phase == .saving { ProgressView() } else { Text("Save booking page").bold() }
                        Spacer()
                    }
                }
                .disabled(phase == .saving || displayName.trimmingCharacters(in: .whitespaces).isEmpty || selectedCalendarID.isEmpty)
            }
        }
    }

    // MARK: - Done

    private var done: some View {
        VStack(spacing: 18) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 54))
                .foregroundStyle(.green)
            Text("Your booking page is live").font(.title2.bold())
            Text("Share this link — anyone can book one of your open times.")
                .font(.callout).foregroundStyle(.secondary).multilineTextAlignment(.center)
            if let url = URL(string: bookingURL) {
                ShareLink(item: url) {
                    Label("Share link", systemImage: "square.and.arrow.up").frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)
                Text(bookingURL).font(.footnote).foregroundStyle(.secondary).textSelection(.enabled)
            }
            Button("Edit settings") { phase = .form }
            Spacer()
        }
        .padding(28)
    }

    // MARK: - Actions

    private func seed() {
        if writable.isEmpty {
            writable = CalendarViewModel.shared.eventStore
                .calendars(for: .event)
                .filter(\.allowsContentModifications)
                .sorted { $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending }
        }
        if selectedCalendarID.isEmpty {
            selectedCalendarID = BookingManager.sourceCalendarID
                ?? writable.first?.calendarIdentifier ?? ""
        }
        if days.isEmpty {
            let cal = Calendar.current
            let start = cal.date(bySettingHour: 9, minute: 0, second: 0, of: Date()) ?? Date()
            let end = cal.date(bySettingHour: 17, minute: 0, second: 0, of: Date()) ?? Date()
            // Monday-first for reading; weekday value stays the API's 0–6.
            days = [1, 2, 3, 4, 5, 6, 0].map {
                EditableDay(weekday: $0, on: $0 >= 1 && $0 <= 5, start: start, end: end)
            }
        }
        Task { await loadExisting() }
    }

    private func loadExisting() async {
        guard let saved = await BookingManager.existing() else { return }
        let c = saved.config
        displayName = c.displayName
        if let src = c.sourceCalendarId, writable.contains(where: { $0.calendarIdentifier == src }) {
            selectedCalendarID = src
        }
        if !c.meetingTypes.isEmpty {
            types = c.meetingTypes.map { EditableType(serverID: $0.id, name: $0.name, duration: $0.durationMinutes) }
        }
        let byDay = Dictionary(grouping: c.availability, by: { $0.day })
        let calendar = Calendar.current
        days = days.map { day in
            guard let rule = byDay[day.weekday]?.first else { return EditableDay(weekday: day.weekday, on: false, start: day.start, end: day.end) }
            let s = calendar.date(bySettingHour: rule.start / 60, minute: rule.start % 60, second: 0, of: Date()) ?? day.start
            let e = calendar.date(bySettingHour: rule.end / 60, minute: rule.end % 60, second: 0, of: Date()) ?? day.end
            return EditableDay(weekday: day.weekday, on: true, start: s, end: e)
        }
        bookingURL = saved.bookingUrl
    }

    private func save() async {
        errorMessage = nil
        let meetingTypes = types
            .filter { !$0.name.trimmingCharacters(in: .whitespaces).isEmpty }
            .map { CloudCalendarsAPI.MeetingType(id: $0.serverID, name: $0.name.trimmingCharacters(in: .whitespaces), durationMinutes: $0.duration, location: nil, description: nil) }
        guard !meetingTypes.isEmpty else {
            errorMessage = NSLocalizedString("Add at least one meeting type.", comment: "Booking setup validation")
            return
        }

        let cal = Calendar.current
        let availability: [CloudCalendarsAPI.AvailabilityRule] = days.compactMap { d in
            guard d.on else { return nil }
            let s = minutes(of: d.start, cal)
            let e = minutes(of: d.end, cal)
            guard e > s else { return nil }
            return CloudCalendarsAPI.AvailabilityRule(day: d.weekday, start: s, end: e)
        }
        guard !availability.isEmpty else {
            errorMessage = NSLocalizedString("Turn on at least one day with valid hours.", comment: "Booking setup validation")
            return
        }

        phase = .saving
        do {
            let saved = try await BookingManager.save(
                displayName: displayName.trimmingCharacters(in: .whitespaces),
                timeZone: .current,
                contactEmail: CalendarFeedSession.existing?.email,
                sourceCalendarID: selectedCalendarID,
                meetingTypes: meetingTypes,
                availability: availability
            )
            bookingURL = saved.bookingUrl
            phase = .done
        } catch {
            errorMessage = error.localizedDescription
            phase = .form
        }
    }

    // MARK: - Helpers

    private func minutes(of date: Date, _ cal: Calendar) -> Int {
        let c = cal.dateComponents([.hour, .minute], from: date)
        return (c.hour ?? 0) * 60 + (c.minute ?? 0)
    }
    private func weekdayName(_ day: Int) -> String {
        let f = DateFormatter()
        f.locale = .appFormatting
        return f.standaloneWeekdaySymbols[day % 7]
    }
}
