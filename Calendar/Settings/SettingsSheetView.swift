import SwiftUI

struct SettingsSheetView: View {
    @ObservedObject private var appPreferences = AppPreferences.shared
    @ObservedObject private var notificationManager = EventNotificationManager.shared
    @ObservedObject private var invitationManager = PendingEventInvitationManager.shared
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
        // `Form` is UIKit-backed and can retain its original semantic layout
        // and menu labels after an in-app language change. Recreate only the
        // settings form after the complete preference transaction, leaving
        // the surrounding draggable menu and its position intact.
        .id(appPreferences.presentationRevision)
        .transaction { transaction in
            transaction.animation = nil
        }
        .contentMargins(.horizontal, 0, for: .scrollContent)
        .contentMargins(.vertical, 0, for: .scrollContent)
        .listSectionSpacing(0)
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
            .listRowInsets(
                EdgeInsets(
                    top: 0,
                    leading: DraggableMenuContentLayout.horizontalInset,
                    bottom: 0,
                    trailing: DraggableMenuContentLayout.horizontalInset
                )
            )
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
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)

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
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)

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
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)

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
                    .environment(\.layoutDirection, appPreferences.layoutDirection)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                }
                .padding(.vertical, DraggableMenuContentLayout.verticalInset)
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
        let example = directionallyIsolated(
            appPreferences.dateExample(for: preference)
        )
        if preference == .system {
            let system = NSLocalizedString("System", comment: "System preference")
            return Text(verbatim: "\(system) (\(example))")
        }
        return Text(verbatim: example)
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

                Toggle(isOn: invitationNotificationToggleBinding) {
                    HStack(spacing: 12) {
                        Image(
                            systemName: invitationNotificationsToggleIsOn
                                ? "envelope.badge.fill"
                                : "envelope.badge"
                        )
                        .font(.title3)
                        .foregroundColor(.blue)
                        .frame(width: 28, height: 28)

                        Text(LocalizedStringKey("Invitation Notifications"))
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
                        .foregroundColor(.orange)
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

    private var invitationNotificationsToggleIsOn: Bool {
        invitationManager.invitationNotificationsEnabled
            && notificationManager.notificationsAllowed
    }

    private var invitationNotificationToggleBinding: Binding<Bool> {
        Binding(
            get: { invitationNotificationsToggleIsOn },
            set: { isOn in
                invitationManager.setInvitationNotificationsEnabled(isOn)

                guard isOn else { return }
                if notificationManager.canAskForPermission {
                    notificationManager.requestSystemNotificationAuthorizationIfNeeded()
                } else if !notificationManager.notificationsAllowed {
                    notificationManager.openAppSettings()
                }
            }
        )
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
