#if os(macOS)
import SwiftUI

struct MacCalendarSettingsView: View {
    @ObservedObject private var appPreferences = AppPreferences.shared
    @State private var weatherNotifications = UserDefaults.standard.bool(forKey: "WeatherAlertNotificationsEnabled")
    @AppStorage("EventNotificationsEnabled") private var eventNotifications = false
    var openAccount: () -> Void
    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                VStack(alignment: .leading, spacing: 10) {
                    Toggle(isOn: $eventNotifications) {
                        preferenceLabel("Event Notifications", icon: eventNotifications ? "bell.fill" : "bell.slash")
                    }
                    Divider()
                    Toggle(isOn: $weatherNotifications) {
                        preferenceLabel("Weather Alert Notifications", icon: weatherNotifications ? "exclamationmark.triangle.fill" : "exclamationmark.triangle", color: .orange)
                    }
                    .onChange(of: weatherNotifications) { _, enabled in
                        Task { await WeatherAlertNotificationManager.shared.setNotificationsEnabled(enabled) }
                    }
                }.padding(.vertical, 6)
                Divider()
                preferencesContent
            }
            .toggleStyle(MacTrailingSwitchStyle())
            .padding(.horizontal, DraggableMenuContentLayout.horizontalInset)
            .padding(.vertical, DraggableMenuContentLayout.verticalInset)
        }
        .font(CalendarTypography.body)
        .buttonStyle(.plain)
    }
    private var preferencesContent: some View {
        VStack(spacing: 0) {
                HStack(spacing: 0) {
                    preferenceLabel("Theme", icon: "circle.lefthalf.filled")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    AppPicker("Theme", selection: $appPreferences.theme) {
                        Text(LocalizedStringKey("System"))
                            .tag(AppThemePreference.system)
                        Text(LocalizedStringKey("Light"))
                            .tag(AppThemePreference.light)
                        Text(LocalizedStringKey("Dark"))
                            .tag(AppThemePreference.dark)
                    }
                    .labelsHidden()
                    .tint(.appBlue)
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)

                Divider()

                HStack(spacing: 0) {
                    preferenceLabel("Language", icon: "globe")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    AppPicker("Language", selection: $appPreferences.languageIdentifier) {
                        Text(LocalizedStringKey("System"))
                            .tag(AppPreferences.systemLanguageIdentifier)
                        ForEach(appPreferences.availableLanguageIdentifiers, id: \.self) { identifier in
                            Text(verbatim: appPreferences.languageDisplayName(for: identifier))
                                .tag(identifier)
                        }
                    }
                    .labelsHidden()
                    .tint(.appBlue)
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)

                Divider()

                HStack(spacing: 0) {
                    preferenceLabel("Measurement Units", icon: "ruler")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    AppPicker("Measurement Units", selection: $appPreferences.measurementUnits) {
                        Text(LocalizedStringKey("System"))
                            .tag(MeasurementUnitsPreference.system)
                        Text(LocalizedStringKey("Metric"))
                            .tag(MeasurementUnitsPreference.metric)
                        Text(LocalizedStringKey("Imperial"))
                            .tag(MeasurementUnitsPreference.imperial)
                    }
                    .labelsHidden()
                    .tint(.appBlue)
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)

                Divider()

                HStack(spacing: 0) {
                    preferenceLabel("Date Format", icon: "calendar")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    AppPicker("Date Format", selection: $appPreferences.dateFormat) {
                        ForEach(AppDateFormatPreference.allCases) { preference in
                            dateFormatOption(preference)
                                .tag(preference)
                        }
                    }
                    .labelsHidden()
                    .tint(.appBlue)
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)

                Divider()

                HStack(spacing: 0) {
                    preferenceLabel("Time Format", icon: "clock")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    AppPicker("Time Format", selection: $appPreferences.timeFormat) {
                        ForEach(AppTimeFormatPreference.allCases) { preference in
                            timeFormatOption(preference)
                                .tag(preference)
                        }
                    }
                    .labelsHidden()
                    .tint(.appBlue)
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)

                Divider()

                HStack(spacing: 0) {
                    preferenceLabel("First Day of Week", icon: "calendar.day.timeline.left")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    AppPicker("First Day of Week", selection: $appPreferences.firstWeekday) {
                        ForEach(FirstWeekdayPreference.allCases) { preference in
                            firstWeekdayOption(preference)
                                .tag(preference)
                        }
                    }
                    .labelsHidden()
                    .tint(.appBlue)
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)

        }
    }

    private func preferenceLabel(_ title: LocalizedStringKey, icon: String, color: Color = .blue) -> some View {
        HStack(spacing: 12) {
            preferenceIcon(icon, color: color)

            Text(title)
                .font(CalendarTypography.headline)
                .lineLimit(2)
                .minimumScaleFactor(1)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private func preferenceIcon(_ name: String, color: Color) -> some View {
        Image(systemName: name)
            .font(CalendarTypography.title3)
            .foregroundColor(color)
            .frame(width: 28, height: 28)
    }

    private func dateFormatOption(_ preference: AppDateFormatPreference) -> Text {
        let example = directionallyIsolated(
            appPreferences.dateExample(for: preference)
        )
        if preference == .system {
            let system = NSLocalizedString("System", comment: "System preference")
            return Text(verbatim: "\(system) (\(example))")
        }
        return Text(verbatim: example)
    }

    /// Weekday names come from the calendar's own standalone symbols, so the
    /// 54 localizations do not have to carry seven more hand-written strings.
    private func firstWeekdayOption(_ preference: FirstWeekdayPreference) -> Text {
        let name = appPreferences.weekdayDisplayName(for: preference)
        if preference == .system {
            let system = NSLocalizedString("System", comment: "System preference")
            return Text(verbatim: name.isEmpty ? system : "\(system) (\(name))")
        }
        return Text(verbatim: name)
    }

    private func timeFormatOption(_ preference: AppTimeFormatPreference) -> Text {
        let example = directionallyIsolated(
            appPreferences.timeExample(for: preference)
        )
        if preference == .system {
            let system = NSLocalizedString("System", comment: "System preference")
            return Text(verbatim: "\(system) (\(example))")
        }
        return Text(verbatim: example)
    }

    /// Keep numeric-only date/time examples in the same bidi run as the
    /// selected application language. Without an isolate, a menu can place
    /// its indicator on the LTR side when Arabic is active.
    private func directionallyIsolated(_ value: String) -> String {
        let start = appPreferences.layoutDirection == .rightToLeft
            ? "\u{2067}" // Right-to-left isolate
            : "\u{2066}" // Left-to-right isolate
        return "\(start)\(value)\u{2069}"
    }

}
/// macOS's automatic switch layout hugs the label; iOS puts it at the row edge.
private struct MacTrailingSwitchStyle: ToggleStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack(spacing: 16) {
            configuration.label.frame(maxWidth: .infinity, alignment: .leading)
            Toggle(isOn: configuration.$isOn) { configuration.label }
                .labelsHidden().toggleStyle(.switch).fixedSize()
        }.frame(maxWidth: .infinity).padding(.vertical, 4)
    }
}
#endif
