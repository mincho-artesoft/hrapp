import Foundation
import SwiftUI

enum CalendarEditorProvider: String {
    case google, microsoft

    init?(id: String, source: String?) {
        guard id.hasPrefix("provider-") || id.hasPrefix("app-local:provider-"), let source,
              let name = source.components(separatedBy: " · ").first else { return nil }
        self.init(rawValue: name.lowercased())
    }

    var availability: [String] { self == .google ? ["busy", "free"] : ["busy", "free", "tentative", "oof", "workingElsewhere"] }
    var privacy: [String] { self == .google ? ["default", "public", "private"] : ["normal", "personal", "private", "confidential"] }
    var alertLimit: Int { self == .google ? 5 : 1 }
}

struct CalendarProviderEventOptions: Equatable {
    var availability: String
    var privacy: String
    var reminders: [Int]
    var emailReminders: [Int]
    var calendarReminders: Bool

    init(_ event: DeviceCalendarEvent? = nil) {
        let details = event?.details ?? [:]
        availability = details["providerShowAs"]?.string ?? ([1: "free", 2: "tentative", 3: "oof"][Int(details["availability"]?.number ?? 0)] ?? "busy")
        privacy = details["providerPrivacy"]?.string ?? ""
        calendarReminders = details["providerDefaultReminders"] == .bool(true) || (details["alarms"] == nil && details["providerDefaultReminders"] == nil)
        if case .array(let others) = details["providerOtherReminders"] {
            emailReminders = others.compactMap { value in
                guard case let .object(fields) = value, fields["method"] == .string("email"),
                      let minutes = fields["minutes"]?.number else { return nil }
                return Int(minutes)
            }
        } else {
            emailReminders = []
        }
        let alerts: [SharedEventAlarm] = event?.decodedDetail("alarms") ?? []
        reminders = alerts.compactMap { $0.relativeOffset.map { max(0, Int((-$0 / 60).rounded())) } }
    }

    var signature: [String] {
        [availability, privacy, String(calendarReminders)] + reminders.map(String.init) + ["email"] + emailReminders.map(String.init)
    }

    func reminderLimit(for provider: CalendarEditorProvider) -> Int {
        provider == .google ? max(0, provider.alertLimit - emailReminders.count) : provider.alertLimit
    }

    func applying(to value: inout DeviceCalendarEvent, provider: CalendarEditorProvider) {
        var details = value.details ?? [:]
        let keepsRemoteStatus = provider == .microsoft && availability == details["providerShowAs"]?.string
        let showAs = provider.availability.contains(availability) || keepsRemoteStatus ? availability : "busy"
        details["availability"] = .number(["free": 1, "tentative": 2, "oof": 3][showAs] ?? 0)
        details["providerShowAs"] = provider == .microsoft ? .string(showAs) : nil
        let keepsRemotePrivacy = provider == .google && privacy == "confidential" && privacy == details["providerPrivacy"]?.string
        details["providerPrivacy"] = .string(provider.privacy.contains(privacy) || keepsRemotePrivacy ? privacy : provider.privacy[0])
        details["providerDefaultReminders"] = provider == .google ? .bool(calendarReminders) : nil
        if provider == .google && !calendarReminders && !emailReminders.isEmpty {
            details["providerOtherReminders"] = .array(emailReminders.prefix(provider.alertLimit).map {
                .object(["method": .string("email"), "minutes": .number(Double($0))])
            })
        } else {
            details.removeValue(forKey: "providerOtherReminders")
        }
        let offsets = provider == .google && calendarReminders ? [] : Array(reminders.prefix(reminderLimit(for: provider)))
        details["alarms"] = .array(offsets.map { .object(["relativeOffset": .number(-Double($0) * 60)]) })
        value.details = details
    }
}

struct CalendarProviderEventFields: View {
    let provider: CalendarEditorProvider
    @Binding var options: CalendarProviderEventOptions
    private let labels = ["busy":"Busy", "free":"Free", "tentative":"Tentative", "oof":"Out of Office",
        "workingElsewhere":"Working Elsewhere", "default":"Default", "normal":"Normal", "public":"Public",
        "private":"Private", "personal":"Personal", "confidential":"Confidential"]
    private let standardMinutes = [0, 5, 10, 15, 30, 60, 120, 1440, 2880, 10080]

    var body: some View {
        choice("Show As", values: provider.availability, selection: $options.availability)
        choice(provider == .google ? "Visibility" : "Sensitivity", values: provider.privacy, selection: $options.privacy)

        if provider == .google {
            row(separator: !options.calendarReminders) {
                #if os(macOS)
                HStack {
                    Text("Use calendar reminders")
                    Spacer()
                    Toggle("Use calendar reminders", isOn: $options.calendarReminders)
                        .labelsHidden().toggleStyle(.switch).controlSize(.large)
                }
                #else
                Toggle("Use calendar reminders", isOn: $options.calendarReminders).toggleStyle(.switch)
                #endif
            }
        }
        if provider != .google || !options.calendarReminders {
            let emailLimit = provider == .google ? max(0, provider.alertLimit - options.reminders.count) : 0
            reminderRows($options.reminders, limit: options.reminderLimit(for: provider), email: false,
                         followedByEmails: emailLimit > 0)
            reminderRows($options.emailReminders, limit: emailLimit, email: true)
        }
    }

    @ViewBuilder private func row<Content: View>(separator: Bool = true, @ViewBuilder content: @escaping () -> Content) -> some View {
        #if os(macOS)
        MacCalendarFormRow(separator: separator, content: content)
        #else
        content()
        #endif
    }

    private func reminderTitle(_ minutes: Int) -> String {
        let labels = [-1: "None", 0: "At time of event", 5: "5 minutes before", 10: "10 minutes before",
                      15: "15 minutes before", 30: "30 minutes before", 60: "1 hour before", 120: "2 hours before",
                      1440: "1 day before", 2880: "2 days before", 10080: "1 week before"]
        if let label = labels[minutes] { return NSLocalizedString(label, comment: "") }
        return String.localizedStringWithFormat(NSLocalizedString("%ld minutes before", comment: ""), minutes)
    }

    @ViewBuilder private func reminderRows(_ values: Binding<[Int]>, limit: Int, email: Bool, followedByEmails: Bool = false) -> some View {
        let count = min(values.wrappedValue.count + 1, limit)
        ForEach(0..<count, id: \.self) { index in
            let selected = values.wrappedValue.indices.contains(index) ? values.wrappedValue[index] : -1
            let title: LocalizedStringKey = email ? "Email reminder" : index == 0 ? "Alert" : "Additional reminder"
            row(separator: index + 1 < count || followedByEmails) {
                CalendarEventEditorMenuRow(title: title, value: reminderTitle(selected)) {
                    let minutes = Set(standardMinutes + [-1, selected]).sorted()
                    ForEach(minutes, id: \.self) { value in
                        Button {
                            if values.wrappedValue.indices.contains(index) {
                                if value < 0 { values.wrappedValue.remove(at: index) }
                                else { values.wrappedValue[index] = value }
                            } else if value >= 0 { values.wrappedValue.append(value) }
                        } label: { option(reminderTitle(value), selected: value == selected) }
                    }
                }
            }
        }
    }

    private func choice(_ title: LocalizedStringKey, values: [String], selection: Binding<String>) -> some View {
        let current = values.contains(selection.wrappedValue) ? selection.wrappedValue : values[0]
        return row {
            CalendarEventEditorMenuRow(title: title, value: NSLocalizedString(labels[current] ?? current, comment: "")) {
                ForEach(values, id: \.self) { value in
                    Button { selection.wrappedValue = value } label: {
                        option(NSLocalizedString(labels[value] ?? value, comment: ""), selected: value == current)
                    }
                }
            }
        }
    }

    @ViewBuilder private func option(_ text: String, selected: Bool) -> some View {
        if selected { Label { Text(verbatim: text) } icon: { Image(systemName: "checkmark") } }
        else { Text(verbatim: text) }
    }
}

struct CalendarEventEditorMenuRow<Options: View>: View {
    let title: LocalizedStringKey
    let value: String
    @ViewBuilder var options: () -> Options

    var body: some View {
        #if os(macOS)
        HStack {
            Text(title)
            Spacer()
            Menu(content: options) {
                AppMenuValueLabel(value, chevronFont: CalendarTypography.caption)
                    .font(CalendarTypography.body).foregroundStyle(.secondary)
            }
            .menuStyle(.borderlessButton).menuIndicator(.hidden).fixedSize().tint(.secondary)
            .accessibilityLabel(Text(title)).accessibilityValue(Text(verbatim: value))
        }
        #else
        LabeledContent(title) {
            Menu(content: options) { CalendarEventEditorMenuValue(text: Text(verbatim: value)) }
                .tint(.secondary)
                .accessibilityLabel(Text(title)).accessibilityValue(Text(verbatim: value))
        }
        #endif
    }
}

#if !os(macOS)
struct CalendarEventEditorMenuValue: View {
    let text: Text
    var body: some View {
        HStack(spacing: 4) {
            text.lineLimit(1)
            Image(systemName: "chevron.up.chevron.down").font(.caption2.weight(.semibold))
                .accessibilityHidden(true)
        }
        .foregroundStyle(.secondary)
    }
}
#endif
