import SwiftUI

struct SettingsSheetView: View {
    @ObservedObject private var appPreferences = AppPreferences.shared
    @ObservedObject private var notificationManager = EventNotificationManager.shared
    @State private var weatherAlertNotificationsEnabled =
        WeatherAlertNotificationManager.notificationsEnabled
    @AppStorage(EventSharePromptSettings.userDefaultsKey)
    private var eventSharePromptEnabled = true

    private let bottomContentInset: CGFloat

    init(bottomContentInset: CGFloat = 0) {
        self.bottomContentInset = bottomContentInset
    }

    var body: some View {
        Form {
            settingsSection

            if bottomContentInset > 0 {
                Section {
                    Color.clear
                        .frame(height: bottomContentInset)
                        .listRowInsets(EdgeInsets())
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                        .accessibilityHidden(true)
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(Color.clear)
        .listRowBackground(Color.clear)
        .onAppear {
            weatherAlertNotificationsEnabled =
                WeatherAlertNotificationManager.notificationsEnabled
            notificationManager.refreshAuthorizationStatus()
        }
    }

    private var settingsSection: some View {
        Section {
            VStack(spacing: 0) {
                notificationContent

                Divider()

                preferencesContent
            }
            .listRowSeparator(.hidden)
            .listRowBackground(Color.clear)
        }
    }

    private var preferencesContent: some View {
        VStack(spacing: 0) {
                HStack(spacing: 0) {
                    preferenceLabel("Language", icon: "globe")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    Picker("", selection: $appPreferences.languageIdentifier) {
                        Text(LocalizedStringKey("System"))
                            .tag(AppPreferences.systemLanguageIdentifier)
                        ForEach(appPreferences.availableLanguageIdentifiers, id: \.self) { identifier in
                            Text(verbatim: appPreferences.languageDisplayName(for: identifier))
                                .tag(identifier)
                        }
                    }
                    .labelsHidden()
                    .pickerStyle(.menu)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, 10)

                Divider()

                HStack(spacing: 0) {
                    preferenceLabel("Measurement Units", icon: "ruler")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    Picker("", selection: $appPreferences.measurementUnits) {
                        Text(LocalizedStringKey("System"))
                            .tag(MeasurementUnitsPreference.system)
                        Text(LocalizedStringKey("Metric"))
                            .tag(MeasurementUnitsPreference.metric)
                        Text(LocalizedStringKey("Imperial"))
                            .tag(MeasurementUnitsPreference.imperial)
                    }
                    .labelsHidden()
                    .pickerStyle(.menu)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, 10)

                Divider()

                HStack(spacing: 0) {
                    preferenceLabel("Date Format", icon: "calendar")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    Picker("", selection: $appPreferences.dateFormat) {
                        ForEach(AppDateFormatPreference.allCases) { preference in
                            dateFormatOption(preference)
                                .tag(preference)
                        }
                    }
                    .labelsHidden()
                    .pickerStyle(.menu)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, 10)

                Divider()

                HStack(spacing: 0) {
                    preferenceLabel("Time Format", icon: "clock")
                        .frame(maxWidth: .infinity, alignment: .leading)

                    Picker("", selection: $appPreferences.timeFormat) {
                        ForEach(AppTimeFormatPreference.allCases) { preference in
                            timeFormatOption(preference)
                                .tag(preference)
                        }
                    }
                    .labelsHidden()
                    .pickerStyle(.menu)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, 10)
        }
    }

    private func preferenceLabel(_ title: LocalizedStringKey, icon: String) -> some View {
        HStack(spacing: 12) {
            preferenceIcon(icon)

            Text(title)
                .font(.headline)
                .lineLimit(2)
                .minimumScaleFactor(1)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private func preferenceIcon(_ name: String) -> some View {
        Image(systemName: name)
            .font(.title3)
            .foregroundColor(.blue)
            .frame(width: 28, height: 28)
    }

    private func dateFormatOption(_ preference: AppDateFormatPreference) -> Text {
        let example = appPreferences.dateExample(for: preference)
        if preference == .system {
            return Text(LocalizedStringKey("System")) + Text(verbatim: " (\(example))")
        }
        return Text(verbatim: example)
    }

    private func timeFormatOption(_ preference: AppTimeFormatPreference) -> Text {
        let example = appPreferences.timeExample(for: preference)
        if preference == .system {
            return Text(LocalizedStringKey("System")) + Text(verbatim: " (\(example))")
        }
        return Text(verbatim: example)
    }

    private var notificationContent: some View {
        VStack(alignment: .leading, spacing: 10) {
                Toggle(isOn: notificationToggleBinding) {
                    HStack(spacing: 12) {
                        Image(systemName: notificationsToggleIsOn ? "bell.fill" : "bell.slash")
                            .font(.title3)
                            .foregroundColor(.blue)
                            .frame(width: 28, height: 28)

                        Text(LocalizedStringKey("Event Notifications"))
                            .font(.headline)
                    }
                }

                Divider()

                Toggle(isOn: weatherNotificationToggleBinding) {
                    HStack(spacing: 12) {
                        Image(
                            systemName: weatherNotificationsToggleIsOn
                                ? "exclamationmark.triangle.fill"
                                : "exclamationmark.triangle"
                        )
                        .font(.title3)
                        .foregroundColor(.blue)
                        .frame(width: 28, height: 28)

                        Text(LocalizedStringKey("Weather Alert Notifications"))
                            .font(.headline)
                    }
                }

                Divider()

                Toggle(isOn: eventSharePromptToggleBinding) {
                    HStack(spacing: 12) {
                        Image(
                            systemName: eventSharePromptEnabled
                                ? "square.and.arrow.up.fill"
                                : "square.and.arrow.up"
                        )
                        .font(.title3)
                        .foregroundColor(.blue)
                        .frame(width: 28, height: 28)

                        Text(LocalizedStringKey("Share Pop-up"))
                            .font(.headline)
                    }
                }

                if weatherAlertNotificationsEnabled
                    && !notificationManager.eventNotificationsEnabled
                    && !notificationManager.notificationsAllowed {
                    if notificationManager.canAskForPermission {
                        Text(LocalizedStringKey("Allow notifications so weather alerts can appear."))
                            .font(.footnote)
                            .foregroundColor(.secondary)
                    } else {
                        Text(LocalizedStringKey("Notifications are turned off for this app. To enable them go to: Settings -> Apps -> Cloud Calendars -> Notifications -> Allow Notifications."))
                            .font(.footnote)
                            .foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }

                if notificationManager.eventNotificationsEnabled
                    && !notificationManager.notificationsAllowed {
                    if notificationManager.canAskForPermission {
                        Text(LocalizedStringKey("Allow notifications so event alerts can appear at the right time."))
                            .font(.footnote)
                            .foregroundColor(.secondary)
                    } else {
                        Text(LocalizedStringKey("Notifications are turned off for this app. To enable them go to: Settings -> Apps -> Cloud Calendars -> Notifications -> Allow Notifications."))
                            .font(.footnote)
                            .foregroundColor(.secondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
        }
        .padding(.vertical, 6)
    }

    private var notificationsToggleIsOn: Bool {
        notificationManager.eventNotificationsEnabled
            && notificationManager.notificationsAllowed
    }

    private var notificationToggleBinding: Binding<Bool> {
        Binding(
            get: { notificationsToggleIsOn },
            set: { isOn in
                notificationManager.setEventNotificationsEnabled(isOn)
            }
        )
    }

    private var weatherNotificationsToggleIsOn: Bool {
        weatherAlertNotificationsEnabled && notificationManager.notificationsAllowed
    }

    private var weatherNotificationToggleBinding: Binding<Bool> {
        Binding(
            get: { weatherNotificationsToggleIsOn },
            set: { isOn in
                weatherAlertNotificationsEnabled = isOn

                Task {
                    await WeatherAlertNotificationManager.shared
                        .setNotificationsEnabled(isOn)
                }

                if isOn {
                    notificationManager.requestSystemNotificationAuthorizationIfNeeded()
                }
            }
        )
    }

    private var eventSharePromptToggleBinding: Binding<Bool> {
        Binding(
            get: { eventSharePromptEnabled },
            set: { isEnabled in
                eventSharePromptEnabled = isEnabled
                EventSharePromptSettings.setEnabled(isEnabled)
                if !isEnabled {
                    EventSharePromptManager.shared.dismiss()
                }
            }
        )
    }

}
